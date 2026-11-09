// Khoá TỰ SOẠN cho BRA201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Giáo trình chuẩn: Keller & Swaminathan "Strategic Brand Management" 5th; Aaker "Building Strong Brands"; Kapferer "The New Strategic Brand Management" 5th.
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const x = (s) => (Array.isArray(s) ? s[0] + '|||' + s[1] : (String(s).includes('|||') ? s : s + '|||' + s));
const W = 'https://en.wikipedia.org/wiki/';
const wk = (p, en, vi) => [W + p, 'Wikipedia — ' + en, 'Wikipedia — ' + vi];
const LK = {
  brand: wk('Brand', 'Brand', 'Thương hiệu'),
  equity: wk('Brand_equity', 'Brand equity', 'Giá trị thương hiệu'),
  mgmt: wk('Brand_management', 'Brand management', 'Quản trị thương hiệu'),
  arch: wk('Brand_architecture', 'Brand architecture', 'Kiến trúc thương hiệu'),
  pos: wk('Positioning_(marketing)', 'Positioning (marketing)', 'Định vị (marketing)'),
  ext: wk('Brand_extension', 'Brand extension', 'Mở rộng thương hiệu'),
  cobrand: wk('Co-branding', 'Co-branding', 'Đồng thương hiệu'),
  imc: wk('Marketing_communications', 'Marketing communications (IMC)', 'Truyền thông marketing (IMC)'),
  aware: wk('Brand_awareness', 'Brand awareness', 'Độ nhận biết thương hiệu'),
  loyal: wk('Brand_loyalty', 'Brand loyalty', 'Lòng trung thành thương hiệu'),
  celeb: wk('Celebrity_branding', 'Celebrity branding', 'Thương hiệu gắn với người nổi tiếng'),
  nps: wk('Net_promoter', 'Net promoter score', 'Chỉ số NPS'),
  valu: wk('Brand_valuation', 'Brand valuation', 'Định giá thương hiệu'),
  rebrand: wk('Rebranding', 'Rebranding', 'Tái định vị / đổi diện mạo thương hiệu'),
  csr: wk('Corporate_social_responsibility', 'Corporate social responsibility', 'Trách nhiệm xã hội doanh nghiệp'),
  green: wk('Greenwashing', 'Greenwashing', 'Tẩy xanh (greenwashing)'),
  gmk: wk('Green_marketing', 'Green marketing', 'Marketing xanh'),
  smm: wk('Social_media_marketing', 'Social media marketing', 'Marketing trên mạng xã hội'),
  influ: wk('Influencer_marketing', 'Influencer marketing', 'Marketing người ảnh hưởng'),
  logo: wk('Logo', 'Logo', 'Logo'),
  slogan: wk('Slogan', 'Slogan', 'Khẩu hiệu (slogan)'),
  tm: wk('Trademark', 'Trademark', 'Nhãn hiệu (trademark)'),
  corpid: wk('Corporate_identity', 'Corporate identity', 'Nhận diện doanh nghiệp'),
  comm: wk('Brand_community', 'Brand community', 'Cộng đồng thương hiệu'),
  mix: wk('Marketing_mix', 'Marketing mix', 'Marketing hỗn hợp (4P)'),
  cx: wk('Customer_experience', 'Customer experience', 'Trải nghiệm khách hàng'),
  cann: wk('Cannibalization_(marketing)', 'Cannibalization (marketing)', 'Tự ăn thị phần (cannibalization)'),
  dil: wk('Trademark_dilution', 'Trademark dilution', 'Làm mờ nhãn hiệu (dilution)'),
  priv: wk('Private_label', 'Private label', 'Nhãn riêng của nhà bán lẻ'),
  spons: wk('Sponsor_(commercial)', 'Sponsor (commercial)', 'Tài trợ (thương mại)'),
  ingr: wk('Ingredient_branding', 'Ingredient branding', 'Thương hiệu thành phần'),
  lic: wk('Brand_licensing', 'Brand licensing', 'Cấp phép thương hiệu'),
  seg: wk('Market_segmentation', 'Market segmentation', 'Phân khúc thị trường'),
  tgt: wk('Target_market', 'Target market', 'Thị trường mục tiêu'),
  usp: wk('Unique_selling_proposition', 'Unique selling proposition', 'Lợi điểm bán hàng độc nhất (USP)'),
  mnem: wk('Mnemonic', 'Mnemonic', 'Kỹ thuật ghi nhớ (mnemonic)'),
  jingle: wk('Jingle', 'Jingle', 'Nhạc hiệu quảng cáo (jingle)'),
  sound: wk('Sound_trademark', 'Sound trademark', 'Nhãn hiệu âm thanh'),
  amb: wk('Brand_ambassador', 'Brand ambassador', 'Đại sứ thương hiệu'),
  wom: wk('Word_of_mouth', 'Word of mouth', 'Truyền miệng'),
  content: wk('Content_marketing', 'Content marketing', 'Content marketing'),
  safety: wk('Brand_safety', 'Brand safety', 'An toàn thương hiệu'),
  cancel: wk('Cancel_culture', 'Cancel culture', 'Văn hoá tẩy chay (cancel culture)'),
  cause: wk('Cause_marketing', 'Cause marketing', 'Marketing vì mục đích xã hội'),
  engage: wk('Brand_engagement', 'Brand engagement', 'Gắn kết thương hiệu'),
  glocal: wk('Glocalization', 'Glocalization', 'Toàn cầu hoá địa phương (glocalization)'),
  coo: wk('Country_of_origin', 'Country of origin', 'Xuất xứ quốc gia'),
  plc: wk('Product_lifecycle', 'Product lifecycle', 'Vòng đời sản phẩm'),
  keller: wk('Kevin_Lane_Keller', 'Kevin Lane Keller', 'Kevin Lane Keller'),
  aaker: wk('David_Aaker', 'David Aaker', 'David Aaker'),
  pmap: wk('Perceptual_mapping', 'Perceptual mapping', 'Bản đồ nhận thức (perceptual map)'),
  ugc: wk('User-generated_content', 'User-generated content', 'Nội dung do người dùng tạo (UGC)'),
  corpbr: wk('Corporate_branding', 'Corporate branding', 'Thương hiệu doanh nghiệp'),
  personal: wk('Personal_branding', 'Personal branding', 'Thương hiệu cá nhân'),
  nation: wk('Nation_branding', 'Nation branding', 'Thương hiệu quốc gia'),
  madrid: wk('Madrid_system', 'Madrid System (international trademarks)', 'Hệ thống Madrid (đăng ký nhãn hiệu quốc tế)'),
  sharp: wk('Byron_Sharp', 'Byron Sharp', 'Byron Sharp'),
  clv: wk('Customer_lifetime_value', 'Customer lifetime value', 'Giá trị vòng đời khách hàng'),
  csat: wk('Customer_satisfaction', 'Customer satisfaction', 'Mức hài lòng của khách hàng'),
  cb: wk('Consumer_behaviour', 'Consumer behaviour', 'Hành vi người tiêu dùng'),
  dove: wk('Dove_Campaign_for_Real_Beauty', 'Dove Campaign for Real Beauty', 'Chiến dịch Dove “Vẻ đẹp thật sự”'),
  vinamilk: wk('Vinamilk', 'Vinamilk', 'Vinamilk'),
  highlands: wk('Highlands_Coffee', 'Highlands Coffee', 'Highlands Coffee'),
  vinfast: wk('VinFast', 'VinFast', 'VinFast'),
  vingroup: wk('Vingroup', 'Vingroup', 'Vingroup'),
  viettel: wk('Viettel', 'Viettel', 'Viettel'),
  vietjet: wk('Vietjet_Air', 'VietJet Air', 'VietJet Air'),
  vnair: wk('Vietnam_Airlines', 'Vietnam Airlines', 'Vietnam Airlines'),
  masan: wk('Masan_Group', 'Masan Group', 'Tập đoàn Masan'),
  sabeco: wk('Saigon_Beer', 'Sabeco (Saigon Beer)', 'Sabeco (Bia Sài Gòn)'),
  grab: wk('Grab_(company)', 'Grab Holdings', 'Grab'),
  nike: wk('Nike,_Inc.', 'Nike', 'Nike'),
  apple: wk('Apple_Inc.', 'Apple Inc.', 'Apple'),
  coke: wk('Coca-Cola', 'Coca-Cola', 'Coca-Cola'),
  newcoke: wk('New_Coke', 'New Coke', 'New Coke (1985)'),
  patagonia: wk('Patagonia,_Inc.', 'Patagonia', 'Patagonia'),
  lego: wk('Lego', 'Lego', 'Lego'),
  lexus: wk('Lexus', 'Lexus', 'Lexus'),
  redbull: wk('Red_Bull', 'Red Bull', 'Red Bull'),
  harley: wk('Harley-Davidson', 'Harley-Davidson', 'Harley-Davidson'),
  virgin: wk('Virgin_Group', 'Virgin Group', 'Virgin Group'),
  toyota: wk('Toyota', 'Toyota', 'Toyota'),
  pg: wk('Procter_%26_Gamble', 'Procter &amp; Gamble', 'Procter &amp; Gamble'),
  unilever: wk('Unilever', 'Unilever', 'Unilever'),
  tesla: wk('Tesla,_Inc.', 'Tesla, Inc.', 'Tesla'),
  starbucks: wk('Starbucks', 'Starbucks', 'Starbucks'),
  gap: wk('Gap_Inc.', 'Gap Inc.', 'Gap Inc.'),
  marlboro: wk('Marlboro_(cigarette)', 'Marlboro', 'Marlboro'),
  volvo: wk('Volvo_Cars', 'Volvo Cars', 'Volvo Cars'),
  samsung: wk('Samsung', 'Samsung', 'Samsung'),
  mcd: wk('McDonald%27s', 'McDonald&#39;s', 'McDonald&#39;s'),
  philips: wk('Philips', 'Philips', 'Philips'),
  intel: wk('Intel', 'Intel', 'Intel'),
  interbrand: ['https://interbrand.com/best-global-brands/', 'Interbrand — Best Global Brands (methodology and annual ranking)', 'Interbrand — Best Global Brands (phương pháp và bảng xếp hạng hằng năm)'],
  brandz: ['https://www.kantar.com/campaigns/brandz', 'Kantar BrandZ — most valuable brands', 'Kantar BrandZ — các thương hiệu giá trị nhất'],
  bfin: ['https://brandfinance.com/', 'Brand Finance — brand valuation consultancy', 'Brand Finance — tư vấn định giá thương hiệu'],
  wipo: ['https://www.wipo.int/trademarks/en/', 'WIPO — Trademarks (what a trademark is, how to protect it)', 'WIPO — Nhãn hiệu (nhãn hiệu là gì, bảo hộ thế nào)'],
  wipomad: ['https://www.wipo.int/madrid/en/', 'WIPO — Madrid System for international trademark protection', 'WIPO — Hệ thống Madrid bảo hộ nhãn hiệu quốc tế'],
  ipvn: ['https://ipvietnam.gov.vn/', 'IP Vietnam (Cục Sở hữu trí tuệ) — official site', 'Cục Sở hữu trí tuệ Việt Nam — trang chính thức'],
  uspto: ['https://www.uspto.gov/trademarks', 'USPTO — Trademarks', 'USPTO — Nhãn hiệu (Hoa Kỳ)'],
  edx: ['https://www.edx.org/learn/branding', 'edX — branding courses', 'edX — các khoá học về xây dựng thương hiệu'],
  tgoogle: ['https://www.thinkwithgoogle.com/', 'Think with Google — marketing research and insights', 'Think with Google — nghiên cứu và insight marketing'],
  ana: ['https://www.ana.net', 'Association of National Advertisers (ANA)', 'Hiệp hội Nhà quảng cáo Quốc gia Hoa Kỳ (ANA)'],
  vnm: ['https://www.vinamilk.com.vn/en', 'Vinamilk — official site', 'Vinamilk — trang chính thức'],
};
const lk = (ks, i) => '<ul>' + ks.map((k) => { if (!LK[k]) throw new Error('thiếu link ' + k); return '<li><a href="' + LK[k][0] + '" target="_blank" rel="noopener">' + LK[k][i] + '</a></li>'; }).join('') + '</ul>';
const tbl = (head, rows) => '<table><thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
// o: {n, g:[[en,vi]], b:[en,vi], pit:[en,vi], s:[[en,vi]], l:[keys], p:[[qen,qvi,aen,avi]]}
const build = (o, L) => {
  const I = L === 'en' ? 0 : 1;
  const T = L === 'en'
    ? { goals: 'Lesson goals', lec: 'Lesson', pit: 'Common mistakes', sum: '📌 Summary', more: '🔗 Learn more', prac: '🧪 Practice', ans: 'Answer', les: 'Lesson ' }
    : { goals: 'Mục tiêu bài', lec: 'Bài giảng', pit: 'Lỗi hay gặp', sum: '📌 Tóm tắt', more: '🔗 Học thêm', prac: '🧪 Tự luyện', ans: 'Đáp án', les: 'Bài ' };
  let h = '<span class="eyebrow">BRA201 · ' + T.les + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + o.b[I] + '\n';
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong> ' + o.pit[I] + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
const D = (slug, en, vi, desc, o) => ({ title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: bi(build(o, 'en'), build(o, 'vi')) });
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => ({ id: 'q' + (i + 1), question: x(q[0]), options: q[1].map(x), correctIndex: q[2], points: 1, explanation: x(q[3]) })) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'bra201-ts-';
const secs = [];
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu BRA201, chuẩn đầu ra tự soạn, giáo trình và tài liệu học.', [
  D(P + '0-1', '0.1 About BRA201 — Introduction to Brand Management', '0.1 Giới thiệu môn BRA201 — Nhập môn Quản trị thương hiệu',
    'BRA201 là môn gì, học để làm gì, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [['Understand what BRA201 is and why brand management matters for your career', 'Hiểu BRA201 là môn gì và vì sao quản trị thương hiệu quan trọng với nghề nghiệp'],
        ['Know the 8 self-authored learning outcomes', 'Nắm 8 chuẩn đầu ra tự soạn'],
        ['See the map of the 9 chapters', 'Nắm bản đồ 9 chương của khoá']],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> The university has not published a BRA201 syllabus on FLM (checked by code, variants and name on 09/11/2026). This outline is self-authored from standard textbooks (Keller &amp; Swaminathan, Aaker, Kapferer). Grading scheme and exam schedule follow your lecturer.</div>
<p><strong>What it is.</strong> BRA201 (Introduction to Brand Management) is a second-semester subject for Business and Communication majors. It answers one question: how does a company build, measure and protect the value that sits in a name, a logo and a set of beliefs in customers' heads? "Brand" is not "logo" and not "advertising": it is what customers know, feel and expect when they meet your name.</p>
<p><strong>Why it matters.</strong> In a marketing, PR, advertising, e-commerce or startup job, almost every decision touches the brand: naming a product, choosing a slogan, briefing an agency, answering a crisis post, pricing a new line. People who can think in terms of positioning, brand equity and consistency make fewer expensive mistakes. For your capstone or a startup idea, a clear brand strategy is also the cheapest way to look professional.</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Explain what a brand is, what it does for consumers and for firms, and the strategic brand management process.</li>
<li>Describe brand equity with Keller's customer-based model (CBBE) and Aaker's five asset groups.</li>
<li>Write a positioning statement with a target, frame of reference, points of difference and reason to believe.</li>
<li>Evaluate and choose brand elements (name, logo, slogan, packaging) with six criteria, and know basic trademark protection.</li>
<li>Describe brand identity, personality and architecture, and pick a structure (branded house, house of brands, endorsed).</li>
<li>Design a coherent mix of product, price, channel and communication, and use secondary associations (co-branding, celebrities, sponsorship).</li>
<li>Run a simple brand audit, track brand health metrics and read a brand valuation report critically.</li>
<li>Judge brand extensions, rebranding, international and digital brand decisions, with ethical and sustainability awareness.</li></ol>
<h4>Related subjects</h4>
<p>BRA201 is normally taken after an introductory marketing subject and before advertising, digital marketing or integrated marketing communication subjects. Exact prerequisites and follow-up subjects are not published; ask your academic office. Chapter map: 1 Brands and brand management · 2 Brand equity and CBBE · 3 Positioning · 4 Brand elements · 5 Identity, personality, architecture · 6 Marketing programs and secondary associations · 7 Measuring brands · 8 Extension, revitalization, international · 9 Digital, ethics, capstone.</p>
<h4>How to study</h4>
<p>Pick one Vietnamese brand (for example Vinamilk, Highlands Coffee or VinFast) and one international brand, and apply every chapter to them in a notebook. By the last chapter you have a mini brand audit ready for your assignment.</p>`,
       `<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của BRA201 trên FLM (đã dò theo mã, biến thể mã và tên ngày 09/11/2026). Khung này soạn theo giáo trình chuẩn (Keller &amp; Swaminathan, Aaker, Kapferer); cách tính điểm và lịch thi theo giảng viên của lớp bạn.</div>
<p><strong>Là môn gì.</strong> BRA201 (Nhập môn Quản trị thương hiệu) là môn kỳ 2 của khối Kinh doanh và Truyền thông. Môn trả lời một câu hỏi: doanh nghiệp xây dựng, đo lường và bảo vệ giá trị nằm trong một cái tên, một logo và một tập niềm tin trong đầu khách hàng bằng cách nào? "Thương hiệu" không phải "logo" và không phải "quảng cáo": đó là điều khách hàng biết, cảm nhận và kỳ vọng khi gặp tên bạn.</p>
<p><strong>Để làm gì.</strong> Làm marketing, PR, quảng cáo, thương mại điện tử hay startup, gần như quyết định nào cũng chạm tới thương hiệu: đặt tên sản phẩm, chọn slogan, brief agency, trả lời một bài đăng khủng hoảng, định giá dòng mới. Người biết nghĩ theo định vị, giá trị thương hiệu và tính nhất quán sẽ ít mắc sai lầm đắt tiền hơn. Với đồ án hay ý tưởng khởi nghiệp, chiến lược thương hiệu rõ ràng cũng là cách rẻ nhất để trông chuyên nghiệp.</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Giải thích thương hiệu là gì, làm được gì cho người tiêu dùng và doanh nghiệp, và quy trình quản trị thương hiệu chiến lược.</li>
<li>Mô tả giá trị thương hiệu bằng mô hình CBBE của Keller và năm nhóm tài sản của Aaker.</li>
<li>Viết tuyên bố định vị gồm đối tượng, khung tham chiếu, điểm khác biệt và lý do tin.</li>
<li>Đánh giá và chọn yếu tố thương hiệu (tên, logo, slogan, bao bì) theo sáu tiêu chí, biết cách bảo hộ nhãn hiệu cơ bản.</li>
<li>Mô tả nhận diện, tính cách và kiến trúc thương hiệu; chọn cấu trúc (nhà thương hiệu, nhà của các thương hiệu, bảo chứng).</li>
<li>Thiết kế bộ sản phẩm – giá – kênh – truyền thông nhất quán và dùng liên tưởng thứ cấp (đồng thương hiệu, người nổi tiếng, tài trợ).</li>
<li>Làm một cuộc kiểm toán thương hiệu đơn giản, theo dõi chỉ số sức khoẻ thương hiệu và đọc báo cáo định giá một cách phê phán.</li>
<li>Đánh giá quyết định mở rộng thương hiệu, tái định vị, quốc tế hoá và thương hiệu số, có ý thức về đạo đức và bền vững.</li></ol>
<h4>Môn liên quan</h4>
<p>BRA201 thường học sau môn marketing căn bản và trước các môn quảng cáo, marketing số hay truyền thông tích hợp. Môn tiên quyết và môn học tiếp chưa được công bố; hỏi phòng đào tạo. Bản đồ chương: 1 Thương hiệu và quản trị thương hiệu · 2 Giá trị thương hiệu và CBBE · 3 Định vị · 4 Yếu tố thương hiệu · 5 Nhận diện, tính cách, kiến trúc · 6 Chương trình marketing và liên tưởng thứ cấp · 7 Đo lường thương hiệu · 8 Mở rộng, làm mới, quốc tế · 9 Số, đạo đức, tổng kết.</p>
<h4>Cách học</h4>
<p>Chọn một thương hiệu Việt (ví dụ Vinamilk, Highlands Coffee hoặc VinFast) và một thương hiệu quốc tế, rồi áp từng chương vào hai thương hiệu đó trong sổ tay. Đến chương cuối bạn đã có sẵn một bản kiểm toán thương hiệu thu nhỏ cho bài tập.</p>`],
    pit: ['Treating "brand" as just a logo or an ad campaign, then wondering why a redesign changed nothing.', 'Coi "thương hiệu" chỉ là logo hay chiến dịch quảng cáo, rồi thắc mắc vì sao đổi diện mạo mà không có gì thay đổi.'],
    s: [['BRA201 = how to build, measure and protect brand value.', 'BRA201 = cách xây dựng, đo lường và bảo vệ giá trị thương hiệu.'],
        ['No FLM syllabus exists: this outline is self-authored from standard textbooks.', 'Chưa có syllabus trên FLM: khung này tự soạn theo giáo trình chuẩn.'],
        ['Apply each chapter to one Vietnamese and one international brand.', 'Áp từng chương vào một thương hiệu Việt và một thương hiệu quốc tế.']],
    l: ['mgmt', 'brand', 'edx'],
    p: [['In one sentence: why is a brand more than a logo?', 'Một câu: vì sao thương hiệu hơn một logo?', 'A brand is the set of knowledge, feelings and expectations in customers\' minds; the logo is only one visible sign.', 'Thương hiệu là tập kiến thức, cảm xúc và kỳ vọng trong đầu khách hàng; logo chỉ là một dấu hiệu nhìn thấy được.'],
        ['Name two jobs where brand decisions appear daily.', 'Kể hai công việc có quyết định thương hiệu mỗi ngày.', 'For example brand/marketing executive and PR or social media specialist.', 'Ví dụ chuyên viên thương hiệu/marketing và chuyên viên PR hoặc mạng xã hội.']] }),

  D(P + '0-2', '0.2 Textbooks & resources', '0.2 Giáo trình & tài liệu',
    'Giáo trình chuẩn có ISBN, khoá học mở và nguồn tra cứu đã kiểm.', {
    n: '0.2',
    g: [['Choose a main textbook and two references', 'Chọn giáo trình chính và hai sách tham khảo'], ['Know free sources for definitions, cases and rankings', 'Biết nguồn miễn phí để tra định nghĩa, tình huống và bảng xếp hạng']],
    b: [`<h4>Books (ISBNs checked on publisher and bookseller listings)</h4>
<ul><li><strong>Strategic Brand Management: Building, Measuring, and Managing Brand Equity</strong>, Kevin Lane Keller and Vanitha Swaminathan, 5th edition, Pearson, 2019/2020. ISBN 978-0-13-489249-8 (US edition); Global Edition ISBN 978-1-292-31496-9. <em>Main textbook of this outline.</em></li>
<li><strong>Building Strong Brands</strong>, David A. Aaker, The Free Press, 1996. A widely held library edition carries ISBN 978-0-02-900151-6 (ISBN-10 002900151X); reprints exist under other ISBNs, so check the number on your copy.</li>
<li><strong>The New Strategic Brand Management: Advanced Insights and Strategic Thinking</strong>, Jean-Noël Kapferer, 5th edition, Kogan Page, 2012. ISBN 978-0-7494-6515-5. Strong on brand identity and the European view.</li></ul>
<p>Edition note: a newer edition of any title may exist; the chapter content of this course does not depend on a specific page number.</p>
<h4>Free resources</h4>` + lk(['wipo', 'interbrand', 'brandz', 'tgoogle', 'edx'], 1) + `<p><strong>Study routine.</strong> Each week: read one chapter, collect two real examples (one Vietnamese, one international) from news or the brand's own website, and write a 5-line analysis. Wikipedia pages linked in lessons are for quick definitions and examples; for exams and assignments cite the textbooks.</p>`,
       `<h4>Sách (ISBN đã đối chiếu trên trang nhà xuất bản và nhà sách)</h4>
<ul><li><strong>Strategic Brand Management: Building, Measuring, and Managing Brand Equity</strong>, Kevin Lane Keller và Vanitha Swaminathan, lần xuất bản 5, Pearson, 2019/2020. ISBN 978-0-13-489249-8 (bản Mỹ); bản Global Edition ISBN 978-1-292-31496-9. <em>Giáo trình chính của khung này.</em></li>
<li><strong>Building Strong Brands</strong>, David A. Aaker, The Free Press, 1996. Một bản thư viện phổ biến mang ISBN 978-0-02-900151-6 (ISBN-10 002900151X); các bản tái bản có ISBN khác, hãy xem số in trên cuốn của bạn.</li>
<li><strong>The New Strategic Brand Management: Advanced Insights and Strategic Thinking</strong>, Jean-Noël Kapferer, lần xuất bản 5, Kogan Page, 2012. ISBN 978-0-7494-6515-5. Mạnh về nhận diện thương hiệu và góc nhìn châu Âu.</li></ul>
<p>Lưu ý: có thể đã có lần xuất bản mới hơn; nội dung chương trong khoá này không phụ thuộc số trang của một bản cụ thể.</p>
<h4>Tài nguyên miễn phí</h4>` + lk(['wipo', 'interbrand', 'brandz', 'tgoogle', 'edx'], 2) + `<p><strong>Thói quen học.</strong> Mỗi tuần: đọc một chương, sưu tầm hai ví dụ thật (một Việt Nam, một quốc tế) từ tin tức hoặc trang chính thức của thương hiệu, và viết phân tích 5 dòng. Các trang Wikipedia dẫn trong bài chỉ để tra nhanh định nghĩa và ví dụ; khi làm bài thi, bài tập hãy trích giáo trình.</p>`],
    s: [['Main book: Keller &amp; Swaminathan, 5th ed.; references: Aaker and Kapferer.', 'Sách chính: Keller &amp; Swaminathan, bản 5; tham khảo: Aaker và Kapferer.'], ['Use WIPO, Interbrand and Kantar BrandZ for official definitions and rankings.', 'Dùng WIPO, Interbrand, Kantar BrandZ cho định nghĩa và bảng xếp hạng chính thức.'], ['Weekly habit: two real examples and a 5-line analysis.', 'Thói quen hằng tuần: hai ví dụ thật và phân tích 5 dòng.']],
    l: ['wipo', 'interbrand'],
    p: [['Which book is the main textbook in this outline?', 'Sách nào là giáo trình chính của khung này?', 'Keller and Swaminathan, Strategic Brand Management (5th ed.).', 'Keller và Swaminathan, Strategic Brand Management (bản 5).'],
        ['Why check the ISBN on your own copy of Aaker\'s book?', 'Vì sao nên kiểm ISBN trên cuốn Aaker của bạn?', 'Reprints and editions carry different ISBNs.', 'Các bản tái bản và lần xuất bản có ISBN khác nhau.']] }),
]));
// ===== Chương 1 =====
secs.push(SEC('Chapter 1 — Brands and brand management', 'Chương 1 — Thương hiệu và quản trị thương hiệu',
  'Thương hiệu là gì, vì sao quan trọng, quy trình quản trị thương hiệu chiến lược.', [
  D(P + '1-1', '1.1 What is a brand?', '1.1 Thương hiệu là gì?', 'Định nghĩa thương hiệu, phân biệt sản phẩm – thương hiệu, các cấp độ ý nghĩa.', {
    n: '1.1',
    g: [['Define "brand" and separate it from "product"', 'Định nghĩa "thương hiệu" và phân biệt với "sản phẩm"'], ['List the brand elements that identify a brand', 'Kể các yếu tố thương hiệu dùng để nhận diện'], ['Explain why the same product can have very different brand value', 'Giải thích vì sao cùng một sản phẩm có thể có giá trị thương hiệu rất khác nhau']],
    b: [`<p>The classic definition (American Marketing Association, used by Keller) says a <strong>brand</strong> is a name, term, sign, symbol, design, or a combination of them, intended to identify the goods or services of one seller and differentiate them from competitors. This is the <em>identification</em> view. Modern authors add the <em>meaning</em> view: a brand is what lives in customers' heads, namely knowledge, feelings, and expectations.</p>
<h4>Product vs brand</h4>
<p>A <strong>product</strong> is what a factory makes and a shelf holds. A <strong>brand</strong> is what the customer believes about it. A glass of fresh milk from a no-name stall and a carton of Vinamilk milk may be nutritionally close, yet customers pay differently and feel differently, because the brand adds trust, convenience, a promise of safety and sometimes pride. Branding means giving a product the "power of a brand" by creating mental structures that help consumers organise what they know.</p>
<h4>Brand elements</h4>
<p>The visible tools of a brand are its <strong>brand elements</strong>: name, logo and symbol, character, slogan, jingle, packaging, URL. Chapter 4 studies them. Keep in mind that elements are the handles; meaning is created by experience, advertising, price and word of mouth over time.</p>
<h4>Three levels of meaning (Kapferer's view)</h4>
<ul><li><strong>Identity</strong>: what the company wants the brand to stand for.</li>
<li><strong>Image</strong>: what the public actually perceives.</li>
<li><strong>Equity</strong>: the value created when the first two match and customers prefer you.</li></ul>
<p>A brand manager's daily work is to shrink the gap between identity and image.</p>
<h4>Example: same function, different brand</h4>` + tbl(['Product category', 'Functional core', 'Brand adds'], [['Sports shoes', 'Protect and cushion the foot', 'Status, belonging, confidence (for example Nike)'], ['Dairy', 'Nutrition, calcium', 'Safety trust, "national" feeling (for example Vinamilk)'], ['Coffee shop', 'A hot caffeinated drink', 'A place to meet, a lifestyle (for example Highlands Coffee, Starbucks)']]) +
`<p>Brands exist beyond goods: services (Vietnam Airlines), people (personal branding of an athlete), places (nation branding), organisations and ideas.</p>`,
       `<p>Định nghĩa kinh điển (Hiệp hội Marketing Hoa Kỳ, Keller dùng lại) nói <strong>thương hiệu</strong> là tên, thuật ngữ, dấu hiệu, biểu tượng, thiết kế hoặc tổ hợp của chúng, dùng để nhận ra hàng hoá hay dịch vụ của một người bán và phân biệt với đối thủ. Đây là góc nhìn <em>nhận diện</em>. Các tác giả hiện đại thêm góc nhìn <em>ý nghĩa</em>: thương hiệu là thứ nằm trong đầu khách hàng, gồm kiến thức, cảm xúc và kỳ vọng.</p>
<h4>Sản phẩm và thương hiệu</h4>
<p><strong>Sản phẩm</strong> là thứ nhà máy làm ra và kệ hàng bày. <strong>Thương hiệu</strong> là điều khách hàng tin về nó. Ly sữa tươi ở quầy vô danh và hộp sữa Vinamilk có thể gần nhau về dinh dưỡng, nhưng khách trả giá khác và cảm nhận khác, vì thương hiệu thêm lòng tin, sự tiện lợi, lời hứa an toàn và đôi khi là niềm tự hào. Xây dựng thương hiệu (branding) nghĩa là trao cho sản phẩm "sức mạnh thương hiệu" bằng cách tạo cấu trúc tinh thần giúp người tiêu dùng sắp xếp những gì họ biết.</p>
<h4>Yếu tố thương hiệu</h4>
<p>Công cụ nhìn thấy của thương hiệu là các <strong>yếu tố thương hiệu</strong>: tên, logo và biểu tượng, nhân vật, slogan, nhạc hiệu, bao bì, địa chỉ web. Chương 4 sẽ học kỹ. Hãy nhớ yếu tố chỉ là cái tay cầm; ý nghĩa được tạo ra dần dần bởi trải nghiệm, quảng cáo, giá và truyền miệng.</p>
<h4>Ba tầng ý nghĩa (góc nhìn Kapferer)</h4>
<ul><li><strong>Bản sắc (identity)</strong>: doanh nghiệp muốn thương hiệu đại diện cho điều gì.</li>
<li><strong>Hình ảnh (image)</strong>: công chúng thực sự cảm nhận gì.</li>
<li><strong>Giá trị (equity)</strong>: giá trị sinh ra khi hai thứ trên khớp nhau và khách hàng ưu tiên bạn.</li></ul>
<p>Việc hằng ngày của người quản trị thương hiệu là thu hẹp khoảng cách giữa bản sắc và hình ảnh.</p>
<h4>Ví dụ: cùng chức năng, khác thương hiệu</h4>` + tbl(['Ngành hàng', 'Lõi chức năng', 'Thương hiệu thêm vào'], [['Giày thể thao', 'Bảo vệ và êm chân', 'Địa vị, sự thuộc về, tự tin (ví dụ Nike)'], ['Sữa', 'Dinh dưỡng, canxi', 'Lòng tin an toàn, cảm giác "quốc dân" (ví dụ Vinamilk)'], ['Quán cà phê', 'Một thức uống nóng có caffeine', 'Nơi gặp gỡ, phong cách sống (ví dụ Highlands Coffee, Starbucks)']]) +
`<p>Thương hiệu tồn tại cả ngoài hàng hoá: dịch vụ (Vietnam Airlines), con người (thương hiệu cá nhân của vận động viên), địa danh (thương hiệu quốc gia), tổ chức và ý tưởng.</p>`],
    pit: ['"Brand = logo". A new logo on an unchanged product and service changes the identity sign, not the meaning in customers\' minds.', '"Thương hiệu = logo". Logo mới trên sản phẩm và dịch vụ không đổi chỉ đổi dấu hiệu nhận diện, không đổi ý nghĩa trong đầu khách hàng.'],
    s: [['Brand = identifying name/sign + the meaning customers attach to it.', 'Thương hiệu = tên/dấu hiệu nhận diện + ý nghĩa khách hàng gắn vào đó.'], ['Product is what is made; brand is what is believed.', 'Sản phẩm là thứ được làm ra; thương hiệu là thứ được tin.'], ['Elements are handles; meaning builds over time.', 'Yếu tố là tay cầm; ý nghĩa được xây theo thời gian.'], ['Identity, image, equity: close the gap between the first two.', 'Bản sắc, hình ảnh, giá trị: thu hẹp khoảng cách giữa hai cái đầu.']],
    l: ['brand', 'mgmt', 'vinamilk', 'nike'],
    p: [['Give the AMA-style definition of a brand in your own words.', 'Diễn đạt lại định nghĩa kiểu AMA về thương hiệu bằng lời của bạn.', 'A name, sign, symbol or design (or combination) that identifies one seller\'s goods and sets them apart from competitors.', 'Tên, dấu hiệu, biểu tượng hay thiết kế (hoặc tổ hợp) nhận diện hàng hoá của một người bán và phân biệt với đối thủ.'],
        ['Pick a bottled water and name what the brand adds beyond "water".', 'Chọn một loại nước đóng chai và nêu thương hiệu thêm gì ngoài "nước".', 'For example trust in purity and safety, convenience, a style or image; the water itself is similar.', 'Ví dụ lòng tin về độ tinh khiết, an toàn, tiện lợi, phong cách hình ảnh; bản thân nước thì tương tự.'],
        ['Is "image" the same as "identity"?', '"Hình ảnh" có giống "bản sắc" không?', 'No. Identity is what the firm wants; image is what the public actually perceives.', 'Không. Bản sắc là điều doanh nghiệp muốn; hình ảnh là điều công chúng thật sự cảm nhận.']] }),

  D(P + '1-2', '1.2 Why brands matter', '1.2 Vì sao thương hiệu quan trọng', 'Vai trò của thương hiệu với người tiêu dùng và doanh nghiệp; thách thức của quản trị thương hiệu.', {
    n: '1.2',
    g: [['List the functions of brands for consumers', 'Liệt kê chức năng của thương hiệu với người tiêu dùng'], ['List the benefits of brands for firms', 'Liệt kê lợi ích của thương hiệu với doanh nghiệp'], ['Name the main challenges of modern brand management', 'Nêu các thách thức chính của quản trị thương hiệu hiện đại']],
    b: [`<h4>For consumers</h4>
<p>Brands are shortcuts. In a supermarket with thousands of items nobody compares everything. Keller lists roles such as: identifying the source of the product, assigning responsibility to the maker, reducing risk (functional, financial, social, psychological), cutting search costs, being a promise or pact with the maker, a symbol that expresses identity, and a signal of quality. Choosing a known pharmacy chain over an unknown one is risk reduction in action.</p>
<h4>For firms</h4>` +
`<ul><li><strong>Identification and tracking</strong>: easier handling, inventory and records.</li>
<li><strong>Legal protection</strong>: a registered trademark protects the name and logo from copying.</li>
<li><strong>Quality signal</strong>: satisfied buyers repurchase with less effort.</li>
<li><strong>Differentiation</strong>: a basis for competitive advantage when products are similar.</li>
<li><strong>Financial returns</strong>: price premium, loyalty, lower marketing cost per sale, and an asset that can be valued, licensed or sold.</li></ul>
<h4>Challenges</h4>
<p>Keller names several: savvy customers who compare prices online, retailer private labels (see "Private label" below), media fragmentation, increasing cost of advertising, social media where customers talk back, and pressure for short-term results that harms long-term brand building. Cutting promotion budget in a bad quarter may raise profit now and lose awareness later.</p>
<h4>Case idea: a local brand against a global one</h4>
<p>Vietnamese brands such as Vinamilk, Highlands Coffee or Viettel compete with global players. Their advantages often come from local insight (taste, price points, distribution reach); their challenge is to keep quality and image consistent as they grow. Use Wikipedia pages in "Learn more" for factual background, then write which consumer function (risk reduction, identity, etc.) each brand serves best.</p>`,
       `<h4>Với người tiêu dùng</h4>
<p>Thương hiệu là lối tắt. Trong siêu thị hàng nghìn mặt hàng, không ai so sánh tất cả. Keller liệt kê các vai trò như: xác định nguồn gốc sản phẩm, quy trách nhiệm cho nhà sản xuất, giảm rủi ro (chức năng, tài chính, xã hội, tâm lý), giảm chi phí tìm kiếm, là lời cam kết với nhà sản xuất, là biểu tượng thể hiện bản thân và là tín hiệu chất lượng. Chọn chuỗi nhà thuốc quen thuộc thay vì nơi lạ chính là giảm rủi ro.</p>
<h4>Với doanh nghiệp</h4>` +
`<ul><li><strong>Nhận diện và theo dõi</strong>: dễ quản lý hàng tồn và hồ sơ.</li>
<li><strong>Bảo hộ pháp lý</strong>: nhãn hiệu đã đăng ký bảo vệ tên và logo khỏi bị sao chép.</li>
<li><strong>Tín hiệu chất lượng</strong>: khách hài lòng mua lại ít tốn công hơn.</li>
<li><strong>Khác biệt hoá</strong>: nền tảng lợi thế cạnh tranh khi sản phẩm giống nhau.</li>
<li><strong>Lợi ích tài chính</strong>: giá cao hơn, lòng trung thành, chi phí marketing trên mỗi lượt bán thấp hơn, và một tài sản có thể định giá, cấp phép hay bán.</li></ul>
<h4>Thách thức</h4>
<p>Keller nêu: khách hàng tinh khôn so giá trực tuyến, nhãn riêng của nhà bán lẻ (xem "Private label" bên dưới), truyền thông phân mảnh, chi phí quảng cáo tăng, mạng xã hội nơi khách phản hồi trực tiếp, và áp lực kết quả ngắn hạn làm hại việc xây thương hiệu dài hạn. Cắt ngân sách khuyến mãi ở quý xấu có thể tăng lợi nhuận bây giờ nhưng mất độ nhận biết sau này.</p>
<h4>Gợi ý tình huống: thương hiệu nội gặp thương hiệu toàn cầu</h4>
<p>Các thương hiệu Việt như Vinamilk, Highlands Coffee hay Viettel cạnh tranh với tập đoàn toàn cầu. Lợi thế của họ thường đến từ hiểu biết bản địa (khẩu vị, mức giá, độ phủ phân phối); thách thức là giữ chất lượng và hình ảnh nhất quán khi lớn lên. Dùng các trang Wikipedia ở "Học thêm" lấy bối cảnh, rồi viết xem mỗi thương hiệu phục vụ tốt nhất chức năng nào (giảm rủi ro, biểu đạt bản thân…).</p>`],
    pit: ['Believing brands only help big companies. A small shop with a consistent name, quality and service also lowers customer risk.', 'Tin rằng thương hiệu chỉ giúp công ty lớn. Một cửa hàng nhỏ có tên, chất lượng và dịch vụ nhất quán cũng giảm rủi ro cho khách.'],
    s: [['For consumers, brands cut risk and search cost and signal quality.', 'Với người tiêu dùng, thương hiệu giảm rủi ro, giảm chi phí tìm kiếm và báo hiệu chất lượng.'], ['For firms, brands give legal protection, loyalty, price premium and a valuable asset.', 'Với doanh nghiệp, thương hiệu cho bảo hộ pháp lý, lòng trung thành, giá cao hơn và một tài sản có giá trị.'], ['Challenges: price comparison, private labels, fragmented media, short-termism.', 'Thách thức: so giá, nhãn riêng, truyền thông phân mảnh, tư duy ngắn hạn.']],
    l: ['brand', 'priv', 'equity', 'viettel'],
    p: [['Which consumer function is served when you pick a familiar bank for a first loan?', 'Chức năng nào phục vụ người tiêu dùng khi bạn chọn ngân hàng quen cho khoản vay đầu tiên?', 'Risk reduction (financial and psychological) and lower search cost.', 'Giảm rủi ro (tài chính và tâm lý) và giảm chi phí tìm kiếm.'],
        ['Give two financial benefits of a strong brand.', 'Nêu hai lợi ích tài chính của thương hiệu mạnh.', 'Price premium and customer loyalty (repeat purchase); also lower marketing cost per sale.', 'Giá cao hơn và lòng trung thành (mua lặp lại); cũng giảm chi phí marketing trên mỗi lượt bán.']] }),

  D(P + '1-3', '1.3 The strategic brand management process', '1.3 Quy trình quản trị thương hiệu chiến lược', 'Bốn bước: nhận diện – định vị, kế hoạch marketing, đo lường, tăng trưởng và duy trì giá trị.', {
    n: '1.3',
    g: [['Describe the four steps of strategic brand management', 'Mô tả bốn bước của quản trị thương hiệu chiến lược'], ['Map the chapters of this course onto the steps', 'Ghép các chương của khoá vào từng bước'], ['Write a one-page brand management checklist', 'Viết bảng kiểm quản trị thương hiệu một trang']],
    b: [`<p>Keller defines <strong>strategic brand management</strong> as the design and implementation of marketing programs and activities to build, measure, and manage brand equity. The process has four steps, which this course follows.</p>` +
tbl(['Step', 'Question', 'Chapters'], [['1. Identify and establish brand positioning and values', 'Who are we for, against whom, and what do we stand for?', '2, 3, 5'], ['2. Plan and implement brand marketing programs', 'What do we make, charge, say and do to bring that to life?', '4, 6'], ['3. Measure and interpret brand performance', 'Is the meaning in customers\' heads what we planned?', '7'], ['4. Grow and sustain brand equity', 'Where can the brand extend, how do we refresh it, and how does it travel?', '8, 9']]) +
`<h4>Step 1 in practice</h4>
<p>Start with mental maps of customers and competitors. A café brand might choose "a calm third place between home and work for young office staff", not simply "good coffee". The choice drives every later decision.</p>
<h4>Step 2 in practice</h4>
<p>Choose brand elements, then align product, price, distribution and communication to the same meaning. If you position as premium but discount every week, the market will believe the discount.</p>
<h4>Step 3 in practice</h4>
<p>Run a brand audit and track awareness, image and preference. Without numbers, brand talk becomes opinion.</p>
<h4>Step 4 in practice</h4>
<p>Decide extensions (new categories), rebrands, and international moves. Do it in line with the first three steps. Brand architecture (Chapter 5) provides the map for growth.</p>
<div class="meo"><strong>Checklist.</strong> Target · promise · differentiator · proof · elements · consistent mix · metric · owner · review date.</div>`,
       `<p>Keller định nghĩa <strong>quản trị thương hiệu chiến lược</strong> là thiết kế và triển khai các chương trình, hoạt động marketing để xây dựng, đo lường và quản lý giá trị thương hiệu. Quy trình có bốn bước, khoá học này đi theo đó.</p>` +
tbl(['Bước', 'Câu hỏi', 'Chương'], [['1. Xác lập định vị và giá trị thương hiệu', 'Ta dành cho ai, so với ai, và đại diện cho điều gì?', '2, 3, 5'], ['2. Lên kế hoạch và triển khai chương trình marketing thương hiệu', 'Ta làm gì, bán giá nào, nói gì, làm gì để biến điều đó thành thật?', '4, 6'], ['3. Đo lường và diễn giải hiệu quả thương hiệu', 'Ý nghĩa trong đầu khách có đúng như ta dự định không?', '7'], ['4. Tăng trưởng và duy trì giá trị thương hiệu', 'Mở rộng sang đâu, làm mới thế nào, đi ra nước ngoài ra sao?', '8, 9']]) +
`<h4>Bước 1 trong thực tế</h4>
<p>Bắt đầu từ bản đồ nhận thức của khách và đối thủ. Một thương hiệu cà phê có thể chọn "không gian thứ ba yên tĩnh giữa nhà và công ty cho nhân viên văn phòng trẻ", chứ không chỉ "cà phê ngon". Lựa chọn này dẫn dắt mọi quyết định sau.</p>
<h4>Bước 2 trong thực tế</h4>
<p>Chọn yếu tố thương hiệu, rồi căn chỉnh sản phẩm, giá, phân phối, truyền thông theo cùng một ý nghĩa. Nếu định vị cao cấp mà tuần nào cũng giảm giá, thị trường sẽ tin vào đợt giảm giá.</p>
<h4>Bước 3 trong thực tế</h4>
<p>Làm kiểm toán thương hiệu và theo dõi độ nhận biết, hình ảnh, mức ưa thích. Không có số liệu, bàn về thương hiệu chỉ là ý kiến.</p>
<h4>Bước 4 trong thực tế</h4>
<p>Quyết định mở rộng (ngành mới), đổi diện mạo, đi quốc tế, nhất quán với ba bước đầu. Kiến trúc thương hiệu (Chương 5) là tấm bản đồ cho tăng trưởng.</p>
<div class="meo"><strong>Bảng kiểm.</strong> Đối tượng · lời hứa · điểm khác biệt · bằng chứng · yếu tố · bộ marketing nhất quán · chỉ số · người chịu trách nhiệm · ngày rà soát.</div>`],
    pit: ['Jumping to step 2 (ads, logo) before step 1 (positioning). The campaign looks busy but says nothing specific.', 'Nhảy vào bước 2 (quảng cáo, logo) trước bước 1 (định vị). Chiến dịch trông bận rộn nhưng không nói điều gì cụ thể.'],
    s: [['Four steps: position, plan programs, measure, grow and sustain.', 'Bốn bước: định vị, lên chương trình, đo lường, tăng trưởng và duy trì.'], ['Every marketing element must carry the same brand meaning.', 'Mọi yếu tố marketing phải mang cùng một ý nghĩa thương hiệu.'], ['Measure early; opinions are not evidence.', 'Đo sớm; ý kiến không phải bằng chứng.']],
    l: ['mgmt', 'keller', 'mix', 'equity'],
    p: [['Which step covers brand audits and tracking?', 'Bước nào gồm kiểm toán và theo dõi thương hiệu?', 'Step 3: measure and interpret brand performance.', 'Bước 3: đo lường và diễn giải hiệu quả thương hiệu.'],
        ['Why should positioning come before the logo brief?', 'Vì sao định vị phải có trước brief logo?', 'The logo must express a defined meaning; without it the design is arbitrary.', 'Logo phải diễn đạt một ý nghĩa đã xác định; thiếu nó thì thiết kế tuỳ hứng.']] }),

  Q(P + 'quiz-1', 'Chapter 1 quiz — Brands and brand management', 'Quiz Chương 1 — Thương hiệu và quản trị thương hiệu', [
    ['Which statement best separates a brand from a product?|||Câu nào phân biệt đúng nhất thương hiệu với sản phẩm?', ['A brand is the factory output|||Thương hiệu là sản phẩm của nhà máy', 'A brand is the meaning customers attach to the offer|||Thương hiệu là ý nghĩa khách hàng gắn với sản phẩm', 'A brand is the price|||Thương hiệu là mức giá', 'A brand is only the logo|||Thương hiệu chỉ là logo'], 1, 'The brand lives in customers\' minds as knowledge, feelings and expectations.|||Thương hiệu nằm trong đầu khách hàng dưới dạng kiến thức, cảm xúc và kỳ vọng.'],
    ['Which is a brand element?|||Đâu là một yếu tố thương hiệu?', ['Quarterly profit|||Lợi nhuận quý', 'Slogan|||Slogan', 'Warehouse size|||Diện tích kho', 'Staff headcount|||Số nhân viên'], 1, 'Names, logos, slogans, jingles and packaging are brand elements.|||Tên, logo, slogan, nhạc hiệu và bao bì là các yếu tố thương hiệu.'],
    ['A consumer chooses a known brand to lower the chance of a bad purchase. Which role is this?|||Người tiêu dùng chọn thương hiệu quen để giảm khả năng mua hỏng. Đây là vai trò nào?', ['Risk reduction|||Giảm rủi ro', 'Legal protection|||Bảo hộ pháp lý', 'Price discrimination|||Phân biệt giá', 'Inventory tracking|||Theo dõi tồn kho'], 0, 'Brands act as a shortcut that reduces functional, financial and psychological risk.|||Thương hiệu là lối tắt giảm rủi ro chức năng, tài chính và tâm lý.'],
    ['Which benefit is specific to firms, not consumers?|||Lợi ích nào dành riêng cho doanh nghiệp, không phải người tiêu dùng?', ['Lower search cost|||Giảm chi phí tìm kiếm', 'Legal protection of the name|||Bảo hộ pháp lý cho tên gọi', 'Quality signal|||Tín hiệu chất lượng', 'Reduced risk|||Giảm rủi ro'], 1, 'Trademark registration protects the firm\'s name and logo.|||Đăng ký nhãn hiệu bảo vệ tên và logo của doanh nghiệp.'],
    ['In Kapferer\'s view, what is the gap brand managers must close?|||Theo Kapferer, khoảng cách nào người quản trị thương hiệu phải thu hẹp?', ['Between cost and price|||Giữa chi phí và giá', 'Between identity and image|||Giữa bản sắc và hình ảnh', 'Between sales and profit|||Giữa doanh thu và lợi nhuận', 'Between online and offline|||Giữa trực tuyến và ngoại tuyến'], 1, 'Identity is intended; image is perceived; equity grows when they match.|||Bản sắc là điều dự định; hình ảnh là điều cảm nhận; giá trị tăng khi hai thứ khớp nhau.'],
    ['What is the first step of strategic brand management?|||Bước đầu của quản trị thương hiệu chiến lược là gì?', ['Run ads|||Chạy quảng cáo', 'Identify and establish positioning and values|||Xác lập định vị và giá trị thương hiệu', 'Design the packaging|||Thiết kế bao bì', 'Measure sales|||Đo doanh số'], 1, 'Positioning guides programs, measurement and growth.|||Định vị dẫn dắt chương trình, đo lường và tăng trưởng.'],
    ['Which is a typical modern brand-management challenge?|||Đâu là thách thức điển hình của quản trị thương hiệu hiện đại?', ['Customers cannot compare prices|||Khách không thể so giá', 'Retailer private labels and fragmented media|||Nhãn riêng của nhà bán lẻ và truyền thông phân mảnh', 'No competition|||Không có đối thủ', 'Unlimited budgets|||Ngân sách không giới hạn'], 1, 'Private labels, price transparency and fragmented media make brand building harder.|||Nhãn riêng, giá minh bạch và truyền thông phân mảnh khiến việc xây thương hiệu khó hơn.'],
    ['A company positions as premium but discounts weekly. What is the likely result?|||Công ty định vị cao cấp nhưng tuần nào cũng giảm giá. Kết quả có thể là gì?', ['A stronger premium image|||Hình ảnh cao cấp mạnh hơn', 'Customers believe the discount, not the premium claim|||Khách tin vào giảm giá chứ không tin tuyên bố cao cấp', 'No effect|||Không ảnh hưởng', 'Higher trademark protection|||Bảo hộ nhãn hiệu cao hơn'], 1, 'The marketing mix must support the same brand meaning.|||Bộ marketing phải hỗ trợ cùng một ý nghĩa thương hiệu.'],
  ]),
]));
// ===== Chương 2 =====
secs.push(SEC('Chapter 2 — Brand equity and the CBBE model', 'Chương 2 — Giá trị thương hiệu và mô hình CBBE',
  'Giá trị thương hiệu theo Aaker và Keller: nhận biết, hình ảnh, kim tự tháp CBBE, cộng hưởng và lòng trung thành.', [
  D(P + '2-1', '2.1 Brand equity: two classic views', '2.1 Giá trị thương hiệu: hai góc nhìn kinh điển', 'Brand equity theo Aaker (5 nhóm tài sản) và Keller (hiệu ứng khác biệt của kiến thức thương hiệu).', {
    n: '2.1',
    g: [['Define brand equity', 'Định nghĩa giá trị thương hiệu (brand equity)'], ['List Aaker\'s five asset groups', 'Liệt kê năm nhóm tài sản của Aaker'], ['State Keller\'s customer-based definition', 'Nêu định nghĩa dựa trên khách hàng của Keller']],
    b: [`<p><strong>Brand equity</strong> is the added value a brand gives a product. Two schools shaped the field.</p>
<h4>Aaker: brand equity as a set of assets and liabilities</h4>
<p>David Aaker defines it as the assets (and liabilities) linked to a brand's name and symbol that add to or subtract from the value of a product or service. He groups them in five:</p>` +
tbl(['Asset group', 'Meaning', 'Quick example'], [['Brand loyalty', 'Customers keep buying', 'Repeat purchase of the same milk brand'], ['Brand awareness', 'Customers recognise or recall the brand', 'Thinking of a name first in a category'], ['Perceived quality', 'Overall judgement of quality', 'Belief that a brand is reliable'], ['Brand associations', 'Anything linked in memory', 'Colours, people, values, places'], ['Other proprietary assets', 'Patents, trademarks, channel relationships', 'A registered trademark']]) +
`<h4>Keller: customer-based brand equity (CBBE)</h4>
<p>Keller defines CBBE as the <em>differential effect</em> that brand knowledge has on consumer response to the marketing of that brand. Test it: give the same product with and without a brand name. If responses differ (more willing to buy, to pay more, to forgive a mistake), there is positive brand equity. If a brand makes consumers react worse than an unnamed version, equity is negative.</p>
<p>So brand equity depends on <strong>brand knowledge</strong> (awareness and image), which the next lessons break down.</p>
<h4>Financial view</h4>
<p>Accountants and consultancies also talk about brand equity as a money amount (brand valuation). Chapter 7 covers it. The two views are linked: strong customer-based equity is the reason a financial valuation can be high.</p>`,
       `<p><strong>Giá trị thương hiệu (brand equity)</strong> là giá trị gia tăng mà thương hiệu đem lại cho sản phẩm. Hai trường phái định hình lĩnh vực này.</p>
<h4>Aaker: giá trị thương hiệu là tập tài sản và nợ</h4>
<p>David Aaker định nghĩa là các tài sản (và nợ) gắn với tên và biểu tượng thương hiệu, làm tăng hoặc giảm giá trị sản phẩm hay dịch vụ. Ông chia thành năm nhóm:</p>` +
tbl(['Nhóm tài sản', 'Ý nghĩa', 'Ví dụ nhanh'], [['Lòng trung thành', 'Khách tiếp tục mua', 'Mua lại cùng một nhãn sữa'], ['Nhận biết thương hiệu', 'Khách nhận ra hoặc nhớ ra thương hiệu', 'Nghĩ đến một cái tên đầu tiên trong ngành'], ['Chất lượng cảm nhận', 'Đánh giá tổng quát về chất lượng', 'Tin rằng thương hiệu đáng tin cậy'], ['Liên tưởng thương hiệu', 'Mọi thứ gắn trong trí nhớ', 'Màu sắc, con người, giá trị, địa danh'], ['Tài sản độc quyền khác', 'Bằng sáng chế, nhãn hiệu, quan hệ kênh', 'Nhãn hiệu đã đăng ký']]) +
`<h4>Keller: giá trị thương hiệu dựa trên khách hàng (CBBE)</h4>
<p>Keller định nghĩa CBBE là <em>hiệu ứng khác biệt</em> của kiến thức thương hiệu lên phản ứng của người tiêu dùng với hoạt động marketing của thương hiệu đó. Thử nghiệm: đưa cùng một sản phẩm có và không có tên thương hiệu. Nếu phản ứng khác nhau (sẵn lòng mua, trả giá cao hơn, bỏ qua một lỗi), có giá trị thương hiệu dương. Nếu có tên mà phản ứng tệ hơn bản không tên, giá trị âm.</p>
<p>Vậy giá trị thương hiệu phụ thuộc vào <strong>kiến thức thương hiệu</strong> (nhận biết và hình ảnh), hai bài tiếp theo sẽ mổ xẻ.</p>
<h4>Góc nhìn tài chính</h4>
<p>Kế toán và công ty tư vấn cũng nói giá trị thương hiệu bằng một số tiền (định giá thương hiệu). Chương 7 sẽ học. Hai góc nhìn liên quan: giá trị dựa trên khách hàng mạnh là lý do định giá tài chính có thể cao.</p>`],
    pit: ['Confusing "brand equity" (the effect on customers) with "brand value" in money (the valuation). They are related but not the same thing.', 'Lẫn "brand equity" (hiệu ứng lên khách hàng) với "brand value" bằng tiền (kết quả định giá). Chúng liên quan nhưng không giống nhau.'],
    s: [['Aaker: five asset groups (loyalty, awareness, perceived quality, associations, other assets).', 'Aaker: năm nhóm tài sản (trung thành, nhận biết, chất lượng cảm nhận, liên tưởng, tài sản khác).'], ['Keller: differential effect of brand knowledge on consumer response.', 'Keller: hiệu ứng khác biệt của kiến thức thương hiệu lên phản ứng người tiêu dùng.'], ['Equity can be negative.', 'Giá trị thương hiệu có thể âm.']],
    l: ['equity', 'aaker', 'keller', 'valu'],
    p: [['Which of Aaker\'s groups does "a registered trademark" belong to?', '"Nhãn hiệu đã đăng ký" thuộc nhóm nào của Aaker?', 'Other proprietary assets.', 'Tài sản độc quyền khác.'],
        ['How would you test whether a brand has positive CBBE?', 'Làm sao thử một thương hiệu có CBBE dương?', 'Compare responses to the same product with and without the brand name.', 'So phản ứng với cùng một sản phẩm có và không có tên thương hiệu.']] }),

  D(P + '2-2', '2.2 Brand knowledge: awareness and image', '2.2 Kiến thức thương hiệu: nhận biết và hình ảnh', 'Nhận biết (recognition/recall, độ rộng/sâu) và hình ảnh (liên tưởng mạnh, ưa thích, độc đáo).', {
    n: '2.2',
    g: [['Distinguish brand recognition from brand recall', 'Phân biệt nhận ra (recognition) với nhớ ra (recall)'], ['Describe the three qualities of strong associations', 'Mô tả ba phẩm chất của liên tưởng thương hiệu mạnh'], ['Classify associations by type', 'Phân loại liên tưởng theo loại']],
    b: [`<p>In Keller's associative network memory model, a brand is a <em>node</em> linked to other nodes (colours, places, feelings). <strong>Brand knowledge</strong> has two parts: awareness and image.</p>
<h4>Brand awareness</h4>
<ul><li><strong>Recognition</strong>: can the consumer confirm they have seen the brand when shown it (a bottle on a shelf)?</li>
<li><strong>Recall</strong>: can they name the brand when given the category or a need ("a coffee chain")?</li></ul>
<p>Depth means how easily the brand comes to mind; breadth means how many situations trigger it. A brand known only for "tet gifts" has narrow breadth. Being first to mind (top-of-mind) matters because most low-involvement purchases are made quickly.</p>
<h4>Brand image: three qualities of associations</h4>` +
tbl(['Quality', 'Question', 'Example'], [['Strength', 'How firmly is the link held?', 'Repeated experience of the taste'], ['Favourability', 'Do customers value it?', 'Convenience matters to them'], ['Uniqueness', 'Is it different from competitors?', 'Only this brand owns "national dairy pride"']]) +
`<h4>Types of association</h4>
<ul><li><strong>Attributes</strong>: product-related (ingredients) and non-product-related (price, user imagery, usage situations, feelings).</li>
<li><strong>Benefits</strong>: functional, experiential, symbolic.</li>
<li><strong>Attitudes</strong>: overall evaluation ("I trust it").</li></ul>
<h4>Example</h4>
<p>VinFast chose a name built from Vietnamese words (Việt Nam, phong cách, an toàn, sáng tạo, tiên phong) to attach national pride and safety to a new car brand. Whether those associations become strong, favourable and unique depends on real product and service experience over time, not on the name alone.</p>`,
       `<p>Trong mô hình mạng lưới liên tưởng của Keller, thương hiệu là một <em>nút</em> nối với các nút khác (màu sắc, địa danh, cảm xúc). <strong>Kiến thức thương hiệu</strong> gồm hai phần: nhận biết và hình ảnh.</p>
<h4>Nhận biết thương hiệu</h4>
<ul><li><strong>Nhận ra (recognition)</strong>: khi được cho xem, khách có xác nhận từng thấy thương hiệu không (chai trên kệ)?</li>
<li><strong>Nhớ ra (recall)</strong>: khi cho ngành hàng hay nhu cầu, khách có tự nêu được tên không ("một chuỗi cà phê")?</li></ul>
<p>Chiều sâu là thương hiệu hiện ra trong đầu dễ đến mức nào; chiều rộng là bao nhiêu tình huống gợi ra nó. Thương hiệu chỉ được nhớ vì "quà Tết" có chiều rộng hẹp. Được nghĩ đến đầu tiên (top-of-mind) quan trọng vì phần lớn mua hàng ít cân nhắc diễn ra rất nhanh.</p>
<h4>Hình ảnh thương hiệu: ba phẩm chất của liên tưởng</h4>` +
tbl(['Phẩm chất', 'Câu hỏi', 'Ví dụ'], [['Mạnh', 'Liên kết được giữ chắc đến đâu?', 'Trải nghiệm lặp lại về hương vị'], ['Được ưa thích', 'Khách có coi trọng không?', 'Sự tiện lợi quan trọng với họ'], ['Độc đáo', 'Có khác đối thủ không?', 'Chỉ thương hiệu này sở hữu "niềm tự hào sữa quốc gia"']]) +
`<h4>Các loại liên tưởng</h4>
<ul><li><strong>Thuộc tính</strong>: liên quan sản phẩm (thành phần) và không liên quan (giá, hình ảnh người dùng, tình huống sử dụng, cảm xúc).</li>
<li><strong>Lợi ích</strong>: chức năng, trải nghiệm, biểu tượng.</li>
<li><strong>Thái độ</strong>: đánh giá chung ("tôi tin nó").</li></ul>
<h4>Ví dụ</h4>
<p>VinFast chọn cái tên ghép từ các từ Việt (Việt Nam, phong cách, an toàn, sáng tạo, tiên phong) để gắn niềm tự hào quốc gia và an toàn vào một thương hiệu xe mới. Các liên tưởng đó có thành mạnh, được ưa thích và độc đáo hay không phụ thuộc vào trải nghiệm sản phẩm, dịch vụ thật theo thời gian, chứ không chỉ cái tên.</p>`],
    pit: ['Measuring only "have you heard of us?" (recognition). Strong brands win on recall in buying situations.', 'Chỉ đo "bạn đã nghe tên chưa?" (nhận ra). Thương hiệu mạnh thắng nhờ nhớ ra đúng lúc mua.'],
    s: [['Awareness = recognition + recall; depth and breadth.', 'Nhận biết = nhận ra + nhớ ra; chiều sâu và chiều rộng.'], ['Image = strong, favourable, unique associations.', 'Hình ảnh = liên tưởng mạnh, được ưa thích, độc đáo.'], ['Associations: attributes, benefits, attitudes.', 'Liên tưởng: thuộc tính, lợi ích, thái độ.']],
    l: ['aware', 'equity', 'vinfast', 'cb'],
    p: [['Which is recall: seeing a logo and saying "yes I know it", or naming a coffee chain with no cue?', 'Đâu là recall: thấy logo và nói "biết rồi", hay tự nêu một chuỗi cà phê khi không có gợi ý?', 'Naming a coffee chain with no cue is recall.', 'Tự nêu chuỗi cà phê không gợi ý là recall.'],
        ['Name the three qualities that make an association valuable.', 'Nêu ba phẩm chất làm liên tưởng có giá trị.', 'Strong, favourable, unique.', 'Mạnh, được ưa thích, độc đáo.']] }),

  D(P + '2-3', '2.3 The CBBE pyramid', '2.3 Kim tự tháp CBBE', 'Bốn bước, sáu khối: salience, performance, imagery, judgments, feelings, resonance.', {
    n: '2.3',
    g: [['Name the four steps and six building blocks of CBBE', 'Gọi tên bốn bước và sáu khối của CBBE'], ['Match each block with a customer question', 'Ghép mỗi khối với một câu hỏi của khách hàng'], ['Apply the pyramid to a brand of your choice', 'Áp kim tự tháp vào một thương hiệu bạn chọn']],
    b: [`<p>Keller's CBBE pyramid says brand building is a sequence of four steps, each asking a customer question. Work from the bottom up; resonance (top) needs all the layers below it.</p>` +
tbl(['Step', 'Customer question', 'Building block'], [['1. Identity', '"Who are you?"', '<strong>Salience</strong>: depth and breadth of awareness'], ['2. Meaning', '"What are you?"', '<strong>Performance</strong> (functional) and <strong>imagery</strong> (psychological/social)'], ['3. Response', '"What about you? What do I think and feel?"', '<strong>Judgments</strong> (quality, credibility, consideration, superiority) and <strong>feelings</strong> (warmth, fun, excitement, security, social approval, self-respect)'], ['4. Relationships', '"What about you and me?"', '<strong>Resonance</strong>: loyalty, attachment, community, active engagement']]) +
`<h4>Left side and right side</h4>
<p>The pyramid has a rational route (performance → judgments) and an emotional route (imagery → feelings). Strong brands often use both: a car with safety proof and also a sense of pride.</p>
<h4>Walk-through: a coffee chain</h4>
<ul><li>Salience: easily recalled when thinking "coffee near me".</li>
<li>Performance: taste, speed, store design. Imagery: modern, social, young.</li>
<li>Judgments: "good quality, I would consider it first". Feelings: warm, belonging.</li>
<li>Resonance: regular visits, joining a loyalty programme, recommending it, and following the brand online.</li></ul>
<p>Use the Highlands Coffee page for background and write your own pyramid with evidence for each block (menu, store experience, ads you remember).</p>
<h4>Using it in management</h4>
<p>Find the weakest block. If salience is low, spend on awareness; if judgments are weak despite good performance, the issue is communication or credibility, not product.</p>`,
       `<p>Kim tự tháp CBBE của Keller cho rằng xây thương hiệu là chuỗi bốn bước, mỗi bước trả lời một câu hỏi của khách. Đi từ dưới lên; đỉnh cộng hưởng cần tất cả các tầng bên dưới.</p>` +
tbl(['Bước', 'Câu hỏi của khách', 'Khối xây dựng'], [['1. Nhận diện', '"Bạn là ai?"', '<strong>Salience</strong>: chiều sâu và chiều rộng của nhận biết'], ['2. Ý nghĩa', '"Bạn là gì?"', '<strong>Performance</strong> (chức năng) và <strong>imagery</strong> (tâm lý/xã hội)'], ['3. Phản ứng', '"Còn bạn thì sao? Tôi nghĩ và cảm thấy gì?"', '<strong>Judgments</strong> (chất lượng, uy tín, cân nhắc, vượt trội) và <strong>feelings</strong> (ấm áp, vui, hứng khởi, an tâm, được xã hội chấp nhận, tự trọng)'], ['4. Quan hệ', '"Còn bạn và tôi thì sao?"', '<strong>Resonance</strong>: trung thành, gắn bó, cộng đồng, chủ động tương tác']]) +
`<h4>Bên trái và bên phải</h4>
<p>Kim tự tháp có đường lý trí (performance → judgments) và đường cảm xúc (imagery → feelings). Thương hiệu mạnh thường dùng cả hai: chiếc xe có bằng chứng an toàn và cả cảm giác tự hào.</p>
<h4>Ví dụ đi qua: chuỗi cà phê</h4>
<ul><li>Salience: dễ nhớ ra khi nghĩ "cà phê gần đây".</li>
<li>Performance: vị, tốc độ, thiết kế cửa hàng. Imagery: hiện đại, giao lưu, trẻ.</li>
<li>Judgments: "chất lượng tốt, tôi sẽ cân nhắc đầu tiên". Feelings: ấm áp, thuộc về.</li>
<li>Resonance: ghé đều đặn, tham gia chương trình thành viên, giới thiệu bạn bè, theo dõi thương hiệu trực tuyến.</li></ul>
<p>Dùng trang Highlands Coffee để lấy bối cảnh và tự vẽ kim tự tháp với bằng chứng cho từng khối (thực đơn, trải nghiệm cửa hàng, quảng cáo bạn nhớ).</p>
<h4>Dùng trong quản trị</h4>
<p>Tìm khối yếu nhất. Nếu salience thấp, chi cho nhận biết; nếu judgments yếu dù performance tốt, vấn đề là truyền thông hay uy tín chứ không phải sản phẩm.</p>`],
    pit: ['Starting at the top ("we want loyal fans") without salience and performance. Resonance is earned, not declared.', 'Bắt đầu từ đỉnh ("ta muốn fan trung thành") mà thiếu salience và performance. Cộng hưởng là thứ giành được, không phải tuyên bố.'],
    s: [['Four steps: identity, meaning, response, relationships.', 'Bốn bước: nhận diện, ý nghĩa, phản ứng, quan hệ.'], ['Six blocks: salience, performance, imagery, judgments, feelings, resonance.', 'Sáu khối: salience, performance, imagery, judgments, feelings, resonance.'], ['Rational and emotional routes; find the weakest block.', 'Đường lý trí và cảm xúc; tìm khối yếu nhất.']],
    l: ['equity', 'keller', 'highlands', 'loyal'],
    p: [['Which block answers "what do I think of you?"', 'Khối nào trả lời "tôi nghĩ gì về bạn?"', 'Judgments.', 'Judgments.'],
        ['A brand has great taste (performance) but customers do not think of it. Which block is weak?', 'Thương hiệu có vị rất ngon (performance) nhưng khách không nghĩ tới. Khối nào yếu?', 'Salience.', 'Salience.']] }),

  D(P + '2-4', '2.4 Brand resonance, loyalty and the value of customers', '2.4 Cộng hưởng, lòng trung thành và giá trị khách hàng', 'Bốn chiều của resonance; trung thành hành vi vs thái độ; giá trị vòng đời.', {
    n: '2.4',
    g: [['List the four dimensions of brand resonance', 'Liệt kê bốn chiều của cộng hưởng thương hiệu'], ['Separate behavioural loyalty from attitudinal loyalty', 'Phân biệt trung thành hành vi với trung thành thái độ'], ['Link loyalty to customer lifetime value', 'Liên hệ trung thành với giá trị vòng đời khách hàng']],
    b: [`<p><strong>Resonance</strong> is the top of the pyramid: the intensity of the psychological bond and the level of activity it produces. Keller splits it into four categories.</p>
<ul><li><strong>Behavioural loyalty</strong>: repeat purchase, share of category requirements.</li>
<li><strong>Attitudinal attachment</strong>: "I love it", "it is special to me".</li>
<li><strong>Sense of community</strong>: kinship with other users or staff (see Brand community).</li>
<li><strong>Active engagement</strong>: spending time, money or effort beyond purchase, such as joining events, following, recommending.</li></ul>
<h4>Behavioural vs attitudinal loyalty</h4>
<p>Someone may buy a brand every week only because it is the only store near the office (behavioural without attitude), so a competitor opening next door can take them. Another person loves a brand but seldom buys due to price (attitude without behaviour). A healthy base has both.</p>
<h4>Why loyalty pays</h4>
<p>Retaining a customer usually costs less than acquiring one; loyal customers buy more, forgive occasional mistakes, and recommend. The metric linking this to money is <strong>customer lifetime value (CLV)</strong>: the net contribution a customer generates over the relationship. Brand managers use it to decide how much to spend on loyalty programmes.</p>
<h4>Measuring in practice</h4>
<p>Combine data: purchase frequency from sales records, net promoter score and satisfaction from surveys, social engagement from platform analytics. One number never tells the whole story.</p>
<div class="callout"><strong>Reminder.</strong> Byron Sharp's research argues that brands grow mostly by reaching more buyers (mental and physical availability), not only by deepening loyalty. Take both views: loyalty is valuable, but growth also needs reach. See the Wikipedia page for a summary and read the primary book for details.</div>`,
       `<p><strong>Cộng hưởng (resonance)</strong> là đỉnh kim tự tháp: cường độ của sự gắn kết tâm lý và mức hoạt động mà nó sinh ra. Keller chia thành bốn nhóm.</p>
<ul><li><strong>Trung thành hành vi</strong>: mua lặp lại, phần chiếm trong nhu cầu của ngành.</li>
<li><strong>Gắn bó thái độ</strong>: "tôi yêu nó", "nó đặc biệt với tôi".</li>
<li><strong>Cảm giác cộng đồng</strong>: gần gũi với người dùng khác hoặc nhân viên (xem Brand community).</li>
<li><strong>Chủ động tương tác</strong>: bỏ thời gian, tiền, công sức ngoài việc mua, như dự sự kiện, theo dõi, giới thiệu.</li></ul>
<h4>Trung thành hành vi và thái độ</h4>
<p>Có người tuần nào cũng mua chỉ vì đó là cửa hàng duy nhất gần công ty (hành vi không có thái độ); đối thủ mở sát bên là lấy được họ. Người khác yêu thương hiệu nhưng ít mua vì giá (thái độ không có hành vi). Tập khách khoẻ mạnh có cả hai.</p>
<h4>Vì sao trung thành sinh lợi</h4>
<p>Giữ một khách thường rẻ hơn tìm khách mới; khách trung thành mua nhiều hơn, bỏ qua lỗi thỉnh thoảng và giới thiệu người khác. Chỉ số nối chuyện này với tiền là <strong>giá trị vòng đời khách hàng (CLV)</strong>: đóng góp ròng một khách tạo ra trong suốt mối quan hệ. Người quản trị thương hiệu dùng nó để quyết định chi bao nhiêu cho chương trình khách hàng thân thiết.</p>
<h4>Đo trong thực tế</h4>
<p>Kết hợp dữ liệu: tần suất mua từ hồ sơ bán hàng, NPS và mức hài lòng từ khảo sát, tương tác mạng xã hội từ công cụ phân tích nền tảng. Một con số không bao giờ kể hết câu chuyện.</p>
<div class="callout"><strong>Lưu ý.</strong> Nghiên cứu của Byron Sharp lập luận thương hiệu tăng trưởng chủ yếu nhờ tiếp cận nhiều người mua hơn (sẵn có về tâm trí và hiện diện), không chỉ nhờ làm sâu lòng trung thành. Hãy giữ cả hai góc nhìn: trung thành có giá trị, nhưng tăng trưởng cần cả độ phủ. Xem trang Wikipedia để tóm tắt và đọc sách gốc để hiểu kỹ.</div>`],
    pit: ['Equating a loyalty-card sign-up with loyalty. A card can be pure habit or discount-chasing; check attitude and engagement too.', 'Đồng nhất việc đăng ký thẻ thành viên với lòng trung thành. Thẻ có thể chỉ là thói quen hay săn giảm giá; hãy kiểm cả thái độ và tương tác.'],
    s: [['Resonance = behavioural loyalty + attachment + community + engagement.', 'Cộng hưởng = trung thành hành vi + gắn bó + cộng đồng + tương tác.'], ['Behaviour without attitude is fragile.', 'Hành vi không có thái độ thì mong manh.'], ['CLV connects loyalty to money; growth also needs reach.', 'CLV nối trung thành với tiền; tăng trưởng còn cần độ phủ.']],
    l: ['loyal', 'comm', 'clv', 'sharp', 'engage'],
    p: [['A student buys from the only shop near campus but dislikes it. Which loyalty is this?', 'Sinh viên mua ở cửa hàng duy nhất gần trường nhưng không thích. Đây là trung thành nào?', 'Behavioural without attitudinal loyalty (fragile).', 'Trung thành hành vi không có thái độ (mong manh).'],
        ['Why is CLV useful for loyalty programmes?', 'Vì sao CLV hữu ích cho chương trình khách hàng thân thiết?', 'It shows how much value a retained customer brings, so it guides how much to spend to keep them.', 'Nó cho thấy giá trị khách giữ được mang lại, từ đó định mức chi để giữ khách.']] }),

  Q(P + 'quiz-2', 'Chapter 2 quiz — Brand equity and CBBE', 'Quiz Chương 2 — Giá trị thương hiệu và CBBE', [
    ['Keller defines customer-based brand equity as…|||Keller định nghĩa CBBE là…', ['The accounting value of the brand|||Giá trị kế toán của thương hiệu', 'The differential effect of brand knowledge on consumer response|||Hiệu ứng khác biệt của kiến thức thương hiệu lên phản ứng người tiêu dùng', 'The number of stores|||Số cửa hàng', 'The advertising budget|||Ngân sách quảng cáo'], 1, 'CBBE compares responses to the marketing of a brand versus an unnamed version.|||CBBE so phản ứng với marketing của thương hiệu với phiên bản không tên.'],
    ['Which is NOT one of Aaker\'s five asset groups?|||Nhóm nào KHÔNG thuộc năm nhóm tài sản của Aaker?', ['Brand loyalty|||Lòng trung thành', 'Perceived quality|||Chất lượng cảm nhận', 'Employee count|||Số nhân viên', 'Brand awareness|||Nhận biết thương hiệu'], 2, 'The five are loyalty, awareness, perceived quality, associations and other proprietary assets.|||Năm nhóm là trung thành, nhận biết, chất lượng cảm nhận, liên tưởng và tài sản độc quyền khác.'],
    ['Naming a brand when given only the category tests…|||Nêu tên thương hiệu khi chỉ cho ngành hàng là kiểm…', ['Recognition|||Nhận ra', 'Recall|||Nhớ ra', 'Satisfaction|||Hài lòng', 'Price sensitivity|||Độ nhạy giá'], 1, 'Recall means retrieving the brand from memory with a category cue.|||Recall là lấy thương hiệu ra từ trí nhớ với gợi ý là ngành hàng.'],
    ['Three qualities of a valuable association are…|||Ba phẩm chất của liên tưởng có giá trị là…', ['Cheap, fast, large|||Rẻ, nhanh, lớn', 'Strong, favourable, unique|||Mạnh, được ưa thích, độc đáo', 'Old, famous, local|||Cũ, nổi tiếng, địa phương', 'Red, round, loud|||Đỏ, tròn, to'], 1, 'Strength, favourability and uniqueness are Keller\'s criteria.|||Mạnh, được ưa thích và độc đáo là tiêu chí của Keller.'],
    ['In the CBBE pyramid, which block sits at the bottom?|||Khối nào nằm ở đáy kim tự tháp CBBE?', ['Resonance|||Resonance', 'Feelings|||Feelings', 'Salience|||Salience', 'Judgments|||Judgments'], 2, 'Salience (identity, "who are you?") is the base.|||Salience (nhận diện, "bạn là ai?") là nền.'],
    ['Customer question "What about you and me?" corresponds to…|||Câu hỏi "Còn bạn và tôi thì sao?" ứng với…', ['Salience|||Salience', 'Performance|||Performance', 'Imagery|||Imagery', 'Resonance|||Resonance'], 3, 'Relationships/resonance is the top step.|||Quan hệ/cộng hưởng là bước trên cùng.'],
    ['Which pair is on the rational route?|||Cặp nào thuộc đường lý trí?', ['Performance and judgments|||Performance và judgments', 'Imagery and feelings|||Imagery và feelings', 'Salience and feelings|||Salience và feelings', 'Imagery and resonance|||Imagery và resonance'], 0, 'Performance → judgments is rational; imagery → feelings is emotional.|||Performance → judgments là lý trí; imagery → feelings là cảm xúc.'],
    ['Buying only because no alternative is nearby is…|||Mua chỉ vì không có lựa chọn nào gần là…', ['Strong attitudinal attachment|||Gắn bó thái độ mạnh', 'Behavioural loyalty without attitude|||Trung thành hành vi không có thái độ', 'Active engagement|||Chủ động tương tác', 'A sense of community|||Cảm giác cộng đồng'], 1, 'It is fragile: a nearby competitor can take the customer.|||Nó mong manh: đối thủ mở gần là lấy được khách.'],
  ]),
]));
// ===== Chương 3 =====
secs.push(SEC('Chapter 3 — Brand positioning', 'Chương 3 — Định vị thương hiệu',
  'Phân khúc – mục tiêu – định vị, khung tham chiếu, điểm tương đồng và khác biệt, tuyên bố định vị, tái định vị.', [
  D(P + '3-1', '3.1 From STP to a frame of reference', '3.1 Từ STP đến khung tham chiếu', 'Phân khúc, chọn mục tiêu, định vị; khung tham chiếu cạnh tranh.', {
    n: '3.1',
    g: [['Explain segmentation, targeting and positioning (STP)', 'Giải thích phân khúc, chọn mục tiêu và định vị (STP)'], ['Choose a competitive frame of reference', 'Chọn khung tham chiếu cạnh tranh'], ['Describe target consumers with more than demographics', 'Mô tả khách hàng mục tiêu vượt ra ngoài nhân khẩu học']],
    b: [`<p><strong>Brand positioning</strong> is the act of designing the offer and image so that the brand occupies a distinctive place in the minds of the target market. It starts with STP.</p>
<h4>Segmentation and targeting</h4>
<p>Markets are split into groups that respond differently, by demographics (age, income), geography, psychographics (lifestyle, values), behaviour (usage rate, occasion) and needs. A good segment is identifiable, substantial, reachable, responsive and stable. Targeting chooses one or a few. "Everyone aged 18–60" is not a target: it gives no guidance for choosing a message or channel.</p>
<h4>Frame of reference</h4>
<p>Consumers always compare. The <strong>frame of reference</strong> signals which category the brand competes in and therefore which brands it is compared with. A new product might say "a coffee shop" (compared with coffee chains), "a workspace" (compared with co-working) or "a place to meet" (compared with restaurants). The choice changes every competitor, price and proof point.</p>
<p>Competitors include <em>direct</em> (same category) and <em>indirect</em> (different category, same need). Bottled tea competes with soft drinks, and also with water and coffee.</p>
<h4>Know the target better: personas</h4>
<p>Write a short persona: "Linh, 21, second-year student, spends 40k VND a day on drinks, studies in cafés 3 evenings a week, discovers places on short video apps." This sharpens the choice of price, location and media. Base it on interviews or survey data, not guesswork.</p>
<div class="meo"><strong>Tip.</strong> Check the target against the question "who would NOT be our customer?" If the answer is "nobody", the target is too broad.</div>`,
       `<p><strong>Định vị thương hiệu</strong> là việc thiết kế sản phẩm và hình ảnh để thương hiệu chiếm một vị trí khác biệt trong tâm trí thị trường mục tiêu. Nó bắt đầu bằng STP.</p>
<h4>Phân khúc và chọn mục tiêu</h4>
<p>Thị trường được chia thành các nhóm phản ứng khác nhau, theo nhân khẩu học (tuổi, thu nhập), địa lý, tâm lý học (lối sống, giá trị), hành vi (tần suất dùng, dịp dùng) và nhu cầu. Phân khúc tốt phải nhận diện được, đủ lớn, tiếp cận được, phản ứng được và ổn định. Chọn mục tiêu là chọn một hoặc vài phân khúc. "Mọi người 18–60 tuổi" không phải mục tiêu: nó không giúp chọn thông điệp hay kênh.</p>
<h4>Khung tham chiếu</h4>
<p>Người tiêu dùng luôn so sánh. <strong>Khung tham chiếu</strong> báo hiệu thương hiệu cạnh tranh trong ngành nào, vì thế được so với thương hiệu nào. Một sản phẩm mới có thể nói "quán cà phê" (so với chuỗi cà phê), "không gian làm việc" (so với co-working) hay "nơi gặp gỡ" (so với nhà hàng). Lựa chọn này đổi mọi đối thủ, mức giá và bằng chứng.</p>
<p>Đối thủ gồm <em>trực tiếp</em> (cùng ngành) và <em>gián tiếp</em> (khác ngành, cùng nhu cầu). Trà đóng chai cạnh tranh với nước ngọt, cả nước lọc và cà phê.</p>
<h4>Hiểu mục tiêu sâu hơn: persona</h4>
<p>Viết persona ngắn: "Linh, 21 tuổi, sinh viên năm hai, chi 40 nghìn đồng mỗi ngày cho đồ uống, học ở quán 3 buổi tối mỗi tuần, tìm quán qua ứng dụng video ngắn." Điều này làm sắc nét việc chọn giá, địa điểm, phương tiện. Hãy dựa vào phỏng vấn hoặc khảo sát, đừng đoán.</p>
<div class="meo"><strong>Mẹo.</strong> Hỏi "ai sẽ KHÔNG phải khách của ta?" Nếu trả lời "không ai", mục tiêu quá rộng.</div>`],
    pit: ['Defining the target only by age and gender. Two 22-year-olds can behave completely differently.', 'Định nghĩa mục tiêu chỉ bằng tuổi và giới tính. Hai người 22 tuổi có thể hành xử hoàn toàn khác nhau.'],
    s: [['STP: segment, target, position.', 'STP: phân khúc, chọn mục tiêu, định vị.'], ['The frame of reference decides who the competitors are.', 'Khung tham chiếu quyết định đối thủ là ai.'], ['Use personas built from real data.', 'Dùng persona dựng từ dữ liệu thật.']],
    l: ['pos', 'seg', 'tgt', 'cb'],
    p: [['Give two segmentation bases other than demographics.', 'Nêu hai cơ sở phân khúc khác nhân khẩu học.', 'Psychographics (lifestyle) and behaviour (usage occasion) – also geography or needs.', 'Tâm lý học (lối sống) và hành vi (dịp dùng) – cũng có địa lý hay nhu cầu.'],
        ['Why does choosing "workspace" vs "coffee shop" as the frame matter?', 'Vì sao chọn khung "không gian làm việc" hay "quán cà phê" lại quan trọng?', 'It changes competitors, price expectations and the proof you must show.', 'Nó đổi đối thủ, kỳ vọng về giá và bằng chứng phải đưa ra.']] }),

  D(P + '3-2', '3.2 Points of parity and points of difference', '3.2 Điểm tương đồng và điểm khác biệt', 'POP, POD, khác biệt hoá có ý nghĩa, đánh đổi.', {
    n: '3.2',
    g: [['Define points of parity (POP) and points of difference (POD)', 'Định nghĩa điểm tương đồng (POP) và điểm khác biệt (POD)'], ['Apply desirability, deliverability and differentiation tests', 'Áp dụng ba phép thử: đáng mong muốn, khả thi, khác biệt'], ['Handle conflicting attributes', 'Xử lý các thuộc tính mâu thuẫn nhau']],
    b: [`<p>Keller distinguishes two kinds of associations that shape a position.</p>
<ul><li><strong>Points of difference (POD)</strong>: strong, favourable, unique associations that consumers link to the brand and do not find in competitors.</li>
<li><strong>Points of parity (POP)</strong>: associations not necessarily unique to the brand, shared with others. <em>Category POPs</em> are the minimum to be considered a legitimate member of the category (a bank must be safe). <em>Competitive POPs</em> neutralise a rival's POD (matching a rival's free delivery).</li></ul>
<h4>Tests for a good POD</h4>` +
tbl(['Criterion', 'Questions'], [['Desirable', 'Relevant to target customers? Distinctive and superior?'], ['Deliverable', 'Can we really do it, sustain it, and communicate it?'], ['Differentiating', 'Is it different from competitors, and defensible against copying?']]) +
`<h4>Example</h4>
<p>A low-cost airline such as Vietjet builds its position around low fares and wide network; to be accepted it must meet category POPs (safety, punctuality). A full-service airline such as Vietnam Airlines can stress service and national flag-carrier status while matching competitors on price in selected fares. Look at both Wikipedia pages for background and write your own POP/POD table.</p>
<h4>Conflicting attributes</h4>
<p>Customers often want two things that seem opposed: "cheap but high quality", "strong but gentle". Solutions: launch two products, use <em>leverage</em> from a trusted partner, or present the conflict as a benefit (for example "powerful and gentle" through a technology). Do not claim both without proof.</p>
<div class="callout"><strong>Reason to believe.</strong> Every POD needs evidence: a feature, a certification, a test, a guarantee. A claim without proof is only a slogan.</div>`,
       `<p>Keller phân biệt hai loại liên tưởng định hình vị thế.</p>
<ul><li><strong>Điểm khác biệt (POD)</strong>: liên tưởng mạnh, được ưa thích, độc đáo mà khách gắn với thương hiệu và không tìm thấy ở đối thủ.</li>
<li><strong>Điểm tương đồng (POP)</strong>: liên tưởng không nhất thiết độc nhất, chia sẻ với thương hiệu khác. <em>POP ngành</em> là mức tối thiểu để được coi là thành viên hợp lệ của ngành (ngân hàng phải an toàn). <em>POP cạnh tranh</em> vô hiệu hoá POD của đối thủ (ngang với miễn phí giao hàng của đối thủ).</li></ul>
<h4>Phép thử cho POD tốt</h4>` +
tbl(['Tiêu chí', 'Câu hỏi'], [['Đáng mong muốn', 'Liên quan đến khách mục tiêu? Nổi bật và vượt trội?'], ['Khả thi', 'Ta có thật sự làm được, duy trì được và truyền thông được?'], ['Khác biệt', 'Khác đối thủ, và khó bị sao chép?']]) +
`<h4>Ví dụ</h4>
<p>Hãng hàng không giá rẻ như Vietjet xây vị thế quanh giá vé thấp và mạng bay rộng; để được chấp nhận phải đạt POP ngành (an toàn, đúng giờ). Hãng dịch vụ đầy đủ như Vietnam Airlines có thể nhấn mạnh dịch vụ và vị thế hãng hàng không quốc gia, đồng thời ngang giá ở một số hạng vé. Xem hai trang Wikipedia lấy bối cảnh rồi tự lập bảng POP/POD.</p>
<h4>Thuộc tính mâu thuẫn</h4>
<p>Khách thường muốn hai điều tưởng đối nghịch: "rẻ mà chất lượng cao", "mạnh mà dịu". Giải pháp: ra hai sản phẩm, mượn uy tín của đối tác tin cậy, hoặc trình bày mâu thuẫn như một lợi ích (ví dụ "mạnh mà dịu" nhờ công nghệ). Đừng tuyên bố cả hai nếu không có bằng chứng.</p>
<div class="callout"><strong>Lý do tin.</strong> Mỗi POD cần bằng chứng: tính năng, chứng nhận, thử nghiệm, bảo hành. Tuyên bố không bằng chứng chỉ là khẩu hiệu.</div>`],
    pit: ['Listing ten PODs. Customers remember one or two. Choose the one that is desirable, deliverable and different.', 'Liệt kê mười POD. Khách chỉ nhớ một hai điều. Chọn điều vừa đáng mong muốn, khả thi và khác biệt.'],
    s: [['POD = unique, POP = shared; category and competitive POPs.', 'POD = độc nhất, POP = dùng chung; có POP ngành và POP cạnh tranh.'], ['Test PODs for desirability, deliverability, differentiation.', 'Thử POD về mức đáng mong muốn, khả thi, khác biệt.'], ['Back each claim with a reason to believe.', 'Mỗi tuyên bố cần lý do tin.']],
    l: ['pos', 'usp', 'vietjet', 'vnair'],
    p: [['A bank is "safe". POP or POD? Why?', 'Ngân hàng "an toàn". POP hay POD? Vì sao?', 'Usually a category POP: all banks must be safe to be considered.', 'Thường là POP ngành: ngân hàng nào cũng phải an toàn mới được cân nhắc.'],
        ['What does a reason to believe do?', 'Lý do tin có tác dụng gì?', 'It proves the claim with evidence so the position is credible.', 'Chứng minh tuyên bố bằng bằng chứng nên vị thế đáng tin.']] }),

  D(P + '3-3', '3.3 Writing a positioning statement', '3.3 Viết tuyên bố định vị', 'Mẫu tuyên bố định vị, bản đồ nhận thức, lỗi hay gặp.', {
    n: '3.3',
    g: [['Write a positioning statement in a standard template', 'Viết tuyên bố định vị theo mẫu chuẩn'], ['Draw a simple perceptual map', 'Vẽ bản đồ nhận thức đơn giản'], ['Distinguish positioning statement from slogan', 'Phân biệt tuyên bố định vị với slogan']],
    b: [`<p>A common template (adapted from Geoffrey Moore and marketing textbooks):</p>
<div class="formula"><span class="lbl">Template</span>For [target], [brand] is the [frame of reference] that [point of difference] because [reason to believe].</div>
<p><strong>Worked example (fictional).</strong> "For busy university students, CampusBrew is the study café that gives free fast Wi-Fi and a quiet zone, because every branch is built with sound-absorbing panels and a dedicated power outlet at each seat." Check it: the target is specific, the frame is clear, the POD is concrete, and the reason can be verified in a store visit.</p>
<h4>Internal vs external</h4>
<p>The positioning statement is an <strong>internal</strong> document guiding product, price and campaigns. The slogan is <strong>external</strong>. Customers never need to see the statement; they need to experience it everywhere.</p>
<h4>Perceptual map</h4>
<p>A perceptual map plots brands on two dimensions that matter to the target (for example price: low–high; image: traditional–modern) using survey ratings. Look for empty spaces with demand (white space) and crowded areas to avoid. Build it from at least 30 respondents' ratings; a map drawn from your own opinion is only a hypothesis.</p>` +
tbl(['Brand (illustrative)', 'Price (1–5)', 'Modern image (1–5)'], [['Brand A', '2', '2'], ['Brand B', '4', '5'], ['Brand C', '3', '4'], ['Our idea', '2', '5']]) +
`<p>In this made-up table, the "low price + modern" corner is empty, so "Our idea" aims there. Always test whether the gap exists because customers do not want it.</p>
<h4>Common weaknesses of statements</h4>
<ul><li>Generic words: "high quality, customer-focused, innovative".</li>
<li>No competitor named or implied.</li>
<li>A promise that operations cannot keep.</li></ul>`,
       `<p>Mẫu thường dùng (chuyển thể từ Geoffrey Moore và các giáo trình marketing):</p>
<div class="formula"><span class="lbl">Mẫu</span>Dành cho [đối tượng], [thương hiệu] là [khung tham chiếu] mang lại [điểm khác biệt] bởi vì [lý do tin].</div>
<p><strong>Ví dụ (hư cấu).</strong> "Dành cho sinh viên đại học bận rộn, CampusBrew là quán cà phê học tập có Wi-Fi nhanh miễn phí và khu yên tĩnh, bởi vì mọi chi nhánh đều ốp tấm tiêu âm và có ổ điện ở từng chỗ ngồi." Kiểm tra: đối tượng cụ thể, khung rõ, POD cụ thể, lý do kiểm chứng được khi đến cửa hàng.</p>
<h4>Nội bộ và bên ngoài</h4>
<p>Tuyên bố định vị là tài liệu <strong>nội bộ</strong> dẫn dắt sản phẩm, giá, chiến dịch. Slogan là phần <strong>bên ngoài</strong>. Khách không cần đọc tuyên bố; họ cần trải nghiệm nó ở mọi nơi.</p>
<h4>Bản đồ nhận thức</h4>
<p>Bản đồ nhận thức đặt các thương hiệu lên hai trục quan trọng với khách mục tiêu (ví dụ giá: thấp–cao; hình ảnh: truyền thống–hiện đại) dựa trên điểm khảo sát. Tìm ô trống có nhu cầu (khoảng trắng) và vùng đông đúc cần tránh. Dựng từ điểm đánh giá của ít nhất 30 người; bản đồ vẽ theo ý kiến riêng chỉ là giả thuyết.</p>` +
tbl(['Thương hiệu (minh hoạ)', 'Giá (1–5)', 'Hình ảnh hiện đại (1–5)'], [['Thương hiệu A', '2', '2'], ['Thương hiệu B', '4', '5'], ['Thương hiệu C', '3', '4'], ['Ý tưởng của ta', '2', '5']]) +
`<p>Trong bảng giả định này, góc "giá thấp + hiện đại" còn trống nên "Ý tưởng của ta" nhắm vào đó. Luôn thử xem khoảng trống có phải do khách không muốn không.</p>
<h4>Điểm yếu thường gặp của tuyên bố</h4>
<ul><li>Từ chung chung: "chất lượng cao, lấy khách hàng làm trung tâm, đổi mới".</li>
<li>Không nêu rõ hay ngầm chỉ đối thủ.</li>
<li>Lời hứa mà vận hành không giữ được.</li></ul>`],
    pit: ['Copying the statement onto a poster as the slogan. A statement is an internal brief; a slogan is a short public line derived from it.', 'Chép tuyên bố lên áp phích làm slogan. Tuyên bố là brief nội bộ; slogan là câu ngắn công khai rút ra từ nó.'],
    s: [['Template: For [target], [brand] is the [frame] that [POD] because [RTB].', 'Mẫu: Dành cho [đối tượng], [thương hiệu] là [khung] mang lại [POD] bởi vì [lý do tin].'], ['Statement is internal; slogan is external.', 'Tuyên bố là nội bộ; slogan là bên ngoài.'], ['Perceptual maps need real ratings, not opinion.', 'Bản đồ nhận thức cần điểm đánh giá thật, không phải ý kiến.']],
    l: ['pos', 'pmap', 'usp', 'slogan'],
    p: [['Write a positioning statement for a student laundry service (your own details).', 'Viết tuyên bố định vị cho dịch vụ giặt là cho sinh viên (tự đặt chi tiết).', 'Example: For dorm students, WashNow is the 24-hour laundry service that returns clothes in 12 hours because it has pick-up lockers in every dorm.', 'Ví dụ: Dành cho sinh viên ký túc xá, WashNow là dịch vụ giặt là 24 giờ trả đồ trong 12 giờ vì có tủ nhận đồ ở từng ký túc xá.'],
        ['Why is a perceptual map built from your own opinion weak?', 'Vì sao bản đồ nhận thức dựng theo ý kiến riêng thì yếu?', 'It reflects the creator, not target customers\' perceptions.', 'Nó phản ánh người vẽ, không phải nhận thức của khách mục tiêu.']] }),

  D(P + '3-4', '3.4 Repositioning and keeping a position', '3.4 Tái định vị và giữ vị thế', 'Khi nào tái định vị; nhất quán; ví dụ.', {
    n: '3.4',
    g: [['Recognise triggers for repositioning', 'Nhận ra các dấu hiệu cần tái định vị'], ['Plan a repositioning step by step', 'Lập kế hoạch tái định vị từng bước'], ['Explain why consistency protects a position', 'Giải thích vì sao nhất quán bảo vệ vị thế']],
    b: [`<p>Positions erode: competitors copy, tastes change, the brand drifts. <strong>Repositioning</strong> changes the target, the frame or the POD.</p>
<h4>Triggers</h4>
<ul><li>Target shrinks or ages (the brand is seen as "for my parents").</li>
<li>A competitor takes the POD.</li>
<li>The category itself changes (for example from "phone" to "smartphone").</li>
<li>Negative associations accumulate after crises.</li></ul>
<h4>Approaches</h4>` +
tbl(['Approach', 'Idea', 'Risk'], [['Reach a new target', 'Same product, new audience', 'Alienate current buyers'], ['New usage occasion', 'Add situations of use', 'Weak credibility if too far'], ['Change POD', 'Highlight a different benefit', 'Needs proof; slow']]) +
`<h4>Case: Dove's campaign</h4>
<p>Dove's "Campaign for Real Beauty" (launched 2004) moved the brand's communication from product claims to a point of view on how beauty is represented. The Wikipedia page describes its content and the debate about it. Note the lesson: the shift was supported by a long, consistent programme, and critics still questioned the commercial motive, which links to the ethics topics in Chapter 9.</p>
<h4>A repositioning plan</h4>
<ol><li>Diagnose with research: what do target customers think now?</li>
<li>Decide the new position with the 3.3 template.</li>
<li>Align product, price, channel and communication.</li>
<li>Communicate to employees first, then customers.</li>
<li>Track metrics (awareness, image, sales) for at least a year.</li></ol>
<h4>Consistency</h4>
<p>A position is held by repetition. Changing the slogan, colours and message every quarter prevents associations from becoming strong. Review annually; change only when research shows the position no longer works.</p>`,
       `<p>Vị thế bị bào mòn: đối thủ sao chép, thị hiếu đổi, thương hiệu trôi. <strong>Tái định vị</strong> đổi mục tiêu, khung hay POD.</p>
<h4>Dấu hiệu</h4>
<ul><li>Tập khách thu hẹp hoặc già đi (thương hiệu bị coi là "đồ của bố mẹ").</li>
<li>Đối thủ chiếm mất POD.</li>
<li>Bản thân ngành đổi (ví dụ từ "điện thoại" sang "điện thoại thông minh").</li>
<li>Liên tưởng tiêu cực tích tụ sau khủng hoảng.</li></ul>
<h4>Các cách tiếp cận</h4>` +
tbl(['Cách', 'Ý tưởng', 'Rủi ro'], [['Tiếp cận mục tiêu mới', 'Cùng sản phẩm, khán giả mới', 'Làm xa khách hiện tại'], ['Dịp sử dụng mới', 'Thêm tình huống dùng', 'Thiếu thuyết phục nếu quá xa'], ['Đổi POD', 'Nhấn một lợi ích khác', 'Cần bằng chứng; chậm']]) +
`<h4>Tình huống: chiến dịch của Dove</h4>
<p>Chiến dịch "Vẻ đẹp thật sự" của Dove (ra mắt 2004) chuyển truyền thông của thương hiệu từ tuyên bố về sản phẩm sang một quan điểm về cách thể hiện cái đẹp. Trang Wikipedia mô tả nội dung và tranh luận quanh nó. Rút ra: sự chuyển dịch được hỗ trợ bởi chương trình dài và nhất quán, và giới phê bình vẫn đặt câu hỏi về động cơ thương mại, liên quan đến chủ đề đạo đức ở Chương 9.</p>
<h4>Kế hoạch tái định vị</h4>
<ol><li>Chẩn đoán bằng nghiên cứu: khách mục tiêu đang nghĩ gì?</li>
<li>Quyết định vị thế mới theo mẫu ở bài 3.3.</li>
<li>Căn chỉnh sản phẩm, giá, kênh và truyền thông.</li>
<li>Truyền thông cho nhân viên trước, rồi cho khách.</li>
<li>Theo dõi chỉ số (nhận biết, hình ảnh, doanh số) ít nhất một năm.</li></ol>
<h4>Nhất quán</h4>
<p>Vị thế được giữ bằng sự lặp lại. Đổi slogan, màu sắc và thông điệp mỗi quý khiến liên tưởng không thể trở nên mạnh. Rà soát hằng năm; chỉ đổi khi nghiên cứu cho thấy vị thế không còn hiệu quả.</p>`],
    pit: ['Repositioning without changing the product or service. Customers judge reality, not announcements.', 'Tái định vị mà không đổi sản phẩm hay dịch vụ. Khách đánh giá thực tế, không phải thông báo.'],
    s: [['Repositioning is triggered by shrinking target, copied POD or category change.', 'Tái định vị khởi từ mục tiêu thu hẹp, POD bị sao chép hay ngành thay đổi.'], ['Align the whole mix and inform employees first.', 'Căn chỉnh cả bộ marketing và báo nhân viên trước.'], ['Consistency makes a position strong.', 'Nhất quán làm vị thế mạnh.']],
    l: ['dove', 'rebrand', 'pos', 'plc'],
    p: [['Name two triggers for repositioning.', 'Nêu hai dấu hiệu cần tái định vị.', 'Aging target; competitor copies the POD; category change; negative associations.', 'Tập khách già đi; đối thủ sao chép POD; ngành đổi; liên tưởng tiêu cực.'],
        ['Why tell employees before customers?', 'Vì sao báo nhân viên trước khách hàng?', 'They deliver the new promise daily; if they do not understand it, experience contradicts the message.', 'Họ thực hiện lời hứa mới mỗi ngày; nếu không hiểu, trải nghiệm sẽ mâu thuẫn với thông điệp.']] }),

  Q(P + 'quiz-3', 'Chapter 3 quiz — Brand positioning', 'Quiz Chương 3 — Định vị thương hiệu', [
    ['STP stands for…|||STP là viết tắt của…', ['Sales, Training, Pricing|||Bán hàng, Đào tạo, Định giá', 'Segmentation, Targeting, Positioning|||Phân khúc, Chọn mục tiêu, Định vị', 'Strategy, Tactics, Planning|||Chiến lược, Chiến thuật, Kế hoạch', 'Survey, Test, Promotion|||Khảo sát, Thử nghiệm, Khuyến mãi'], 1, 'The classic three-step sequence.|||Chuỗi ba bước kinh điển.'],
    ['The frame of reference tells customers…|||Khung tham chiếu cho khách biết…', ['The company\'s history|||Lịch sử công ty', 'Which category the brand belongs to and who it competes with|||Thương hiệu thuộc ngành nào và cạnh tranh với ai', 'The logo colour|||Màu logo', 'The price list|||Bảng giá'], 1, 'It sets the comparison set.|||Nó xác lập tập đối chiếu.'],
    ['Associations shared with competitors but needed to be in the category are…|||Liên tưởng chia sẻ với đối thủ nhưng cần để thuộc ngành là…', ['Category points of parity|||POP ngành', 'Points of difference|||Điểm khác biệt', 'Slogans|||Slogan', 'Brand elements|||Yếu tố thương hiệu'], 0, 'Category POPs are the entry ticket.|||POP ngành là vé vào cửa.'],
    ['Which is NOT a test for a good POD?|||Đâu KHÔNG phải phép thử cho POD tốt?', ['Desirable|||Đáng mong muốn', 'Deliverable|||Khả thi', 'Differentiating|||Khác biệt', 'Decorative|||Trang trí'], 3, 'The three tests are desirable, deliverable, differentiating.|||Ba phép thử là đáng mong muốn, khả thi, khác biệt.'],
    ['In the statement template, "because…" gives…|||Trong mẫu tuyên bố, "bởi vì…" cho…', ['The target|||Đối tượng', 'The reason to believe|||Lý do tin', 'The price|||Giá', 'The competitor|||Đối thủ'], 1, 'Evidence makes the claim credible.|||Bằng chứng làm tuyên bố đáng tin.'],
    ['A positioning statement is mainly…|||Tuyên bố định vị chủ yếu là…', ['A public slogan|||Slogan công khai', 'An internal guide for product, price and campaigns|||Hướng dẫn nội bộ cho sản phẩm, giá, chiến dịch', 'A legal document|||Văn bản pháp lý', 'A press release|||Thông cáo báo chí'], 1, 'The slogan is derived from it.|||Slogan được rút ra từ nó.'],
    ['A perceptual map should be built from…|||Bản đồ nhận thức nên dựng từ…', ['The manager\'s opinion|||Ý kiến người quản lý', 'Ratings by target respondents|||Điểm đánh giá của người trả lời thuộc mục tiêu', 'Competitors\' ads|||Quảng cáo đối thủ', 'Random guesses|||Phỏng đoán'], 1, 'Perceptions of the target are the data.|||Nhận thức của mục tiêu mới là dữ liệu.'],
    ['Which is a risk of changing the slogan every quarter?|||Rủi ro của việc đổi slogan mỗi quý là gì?', ['Associations never become strong|||Liên tưởng không bao giờ trở nên mạnh', 'Lower taxes|||Thuế thấp hơn', 'Higher recall|||Nhớ ra cao hơn', 'None|||Không có'], 0, 'Repetition builds strength.|||Lặp lại tạo sức mạnh.'],
  ]),
]));
// ===== Chương 4 =====
secs.push(SEC('Chapter 4 — Brand elements', 'Chương 4 — Yếu tố thương hiệu',
  'Tiêu chí chọn yếu tố thương hiệu, tên, logo – biểu tượng – nhân vật, slogan – nhạc hiệu – bao bì, bảo hộ nhãn hiệu.', [
  D(P + '4-1', '4.1 Six criteria for choosing brand elements', '4.1 Sáu tiêu chí chọn yếu tố thương hiệu', 'Memorable, meaningful, likeable (xây dựng); transferable, adaptable, protectable (bảo vệ).', {
    n: '4.1',
    g: [['Recall Keller\'s six criteria', 'Nhớ sáu tiêu chí của Keller'], ['Separate "build" criteria from "defend" criteria', 'Phân biệt tiêu chí "xây" với tiêu chí "giữ"'], ['Score two candidate names', 'Chấm điểm hai tên ứng viên']],
    b: [`<p>Brand elements are the trademarkable devices that identify and differentiate: names, URLs, logos, symbols, characters, spokespeople, slogans, jingles, packages and signage. Keller proposes six criteria. The first three <strong>build</strong> brand equity; the last three <strong>defend and leverage</strong> it.</p>` +
tbl(['Criterion', 'Question', 'Quick test'], [['Memorable', 'Easy to recognise and recall?', 'Ask 10 people to repeat it tomorrow'], ['Meaningful', 'Describes the category or conveys a benefit/personality?', 'What do people guess it sells?'], ['Likeable', 'Fun, pleasant, visually and verbally attractive?', 'Does anyone dislike it?'], ['Transferable', 'Can it be used for new categories and in other geographies?', 'Does it limit the brand?'], ['Adaptable', 'Can it be updated over time?', 'Can the logo be simplified later?'], ['Protectable', 'Legally and competitively protectable?', 'Is the trademark available? Easy to copy?']]) +
`<h4>Trade-offs</h4>
<p>A descriptive name (Vietnam Airlines) is meaningful but hard to protect and extend. An invented name (Kodak, Zalo-style coinages) is highly protectable and transferable but needs spending to create meaning. A name that is perfect in one language may be vulgar in another: check before going abroad.</p>
<h4>Scoring example</h4>` +
tbl(['Criterion (1–5)', 'Name A "SunMilk"', 'Name B "Zora"'], [['Memorable', '4', '4'], ['Meaningful', '5', '2'], ['Likeable', '3', '4'], ['Transferable', '2', '5'], ['Adaptable', '3', '5'], ['Protectable', '2', '4'], ['Total', '19', '24']]) +
`<p>Totals are a discussion aid, not a verdict. If the brand will stay in dairy forever, "meaningful" may deserve more weight. Decide weights before scoring.</p>`,
       `<p>Yếu tố thương hiệu là những công cụ đăng ký bảo hộ được để nhận diện và phân biệt: tên, địa chỉ web, logo, biểu tượng, nhân vật, người phát ngôn, slogan, nhạc hiệu, bao bì và biển hiệu. Keller đề xuất sáu tiêu chí. Ba tiêu chí đầu <strong>xây</strong> giá trị thương hiệu; ba tiêu chí sau <strong>bảo vệ và khai thác</strong> nó.</p>` +
tbl(['Tiêu chí', 'Câu hỏi', 'Phép thử nhanh'], [['Dễ nhớ', 'Dễ nhận ra và nhớ ra?', 'Nhờ 10 người nhắc lại vào ngày mai'], ['Có ý nghĩa', 'Mô tả ngành hoặc gợi lợi ích/tính cách?', 'Mọi người đoán nó bán gì?'], ['Dễ mến', 'Vui, dễ chịu, hấp dẫn về hình và âm?', 'Có ai ghét nó không?'], ['Chuyển giao được', 'Dùng được cho ngành mới và vùng địa lý khác?', 'Nó có giới hạn thương hiệu không?'], ['Thích nghi được', 'Cập nhật được theo thời gian?', 'Sau này đơn giản hoá logo được không?'], ['Bảo hộ được', 'Bảo hộ được về pháp lý và cạnh tranh?', 'Nhãn hiệu còn trống không? Có dễ bị bắt chước?']]) +
`<h4>Sự đánh đổi</h4>
<p>Tên mô tả (Vietnam Airlines) có ý nghĩa nhưng khó bảo hộ và khó mở rộng. Tên tự đặt (Kodak) bảo hộ và chuyển giao rất tốt nhưng phải chi tiền để tạo nghĩa. Tên hay ở ngôn ngữ này có thể thô tục ở ngôn ngữ khác: hãy kiểm trước khi ra nước ngoài.</p>
<h4>Ví dụ chấm điểm</h4>` + tbl(['Tiêu chí (1–5)', 'Tên A "SunMilk"', 'Tên B "Zora"'], [['Dễ nhớ', '4', '4'], ['Có ý nghĩa', '5', '2'], ['Dễ mến', '3', '4'], ['Chuyển giao được', '2', '5'], ['Thích nghi được', '3', '5'], ['Bảo hộ được', '2', '4'], ['Tổng', '19', '24']]) +
`<p>Tổng điểm chỉ hỗ trợ thảo luận, không phải phán quyết. Nếu thương hiệu mãi ở ngành sữa, "có ý nghĩa" có thể đáng trọng số cao hơn. Hãy quyết trọng số trước khi chấm.</p>`],
    pit: ['Choosing a name because the team likes it, without checking trademark availability or other-language meaning.', 'Chọn tên vì cả nhóm thích, mà không kiểm nhãn hiệu còn trống hay nghĩa ở ngôn ngữ khác.'],
    s: [['Build: memorable, meaningful, likeable.', 'Xây: dễ nhớ, có ý nghĩa, dễ mến.'], ['Defend: transferable, adaptable, protectable.', 'Giữ: chuyển giao được, thích nghi được, bảo hộ được.'], ['Names trade meaning against protectability.', 'Tên đánh đổi giữa ý nghĩa và khả năng bảo hộ.']],
    l: ['logo', 'tm', 'keller', 'wipo'],
    p: [['Which two criteria conflict most for a descriptive name?', 'Hai tiêu chí nào xung đột nhất với tên mô tả?', 'Meaningful (high) versus protectable and transferable (low).', 'Có ý nghĩa (cao) so với bảo hộ được và chuyển giao được (thấp).'],
        ['Score a name you know on the six criteria (1–5) and justify one score.', 'Chấm một tên bạn biết theo sáu tiêu chí (1–5) và giải thích một điểm.', 'Any reasoned answer; for example Vinamilk: meaningful 5 (milk), protectable 3.', 'Mọi đáp án có lý do; ví dụ Vinamilk: có ý nghĩa 5 (sữa), bảo hộ 3.']] }),

  D(P + '4-2', '4.2 Brand names', '4.2 Đặt tên thương hiệu', 'Các kiểu tên, quy trình đặt tên, kiểm tra ngôn ngữ và pháp lý.', {
    n: '4.2',
    g: [['Classify names by type', 'Phân loại tên theo kiểu'], ['Follow a naming process', 'Đi theo quy trình đặt tên'], ['Check language and legal risks', 'Kiểm tra rủi ro ngôn ngữ và pháp lý']],
    b: [`<h4>Types of name</h4>` +
tbl(['Type', 'Idea', 'Example'], [['Founder name', 'Uses a person\'s name', 'Toyota (from the Toyoda family, spelling changed), Ford, Honda'], ['Descriptive', 'Says what it does', 'Vietnam Airlines, Vietnam Dairy (Vinamilk\'s full name: Vietnam Dairy Products JSC)'], ['Acronym/compound', 'Abbreviation or blend', 'VinFast (Việt Nam, phong cách, an toàn, sáng tạo, tiên phong), Vinamilk (Vietnam + milk)'], ['Metaphor', 'Evokes a feeling', 'Red Bull (strength), Virgin'], ['Invented', 'New word', 'Kodak, Lego (from Danish "leg godt", play well)'], ['Place', 'Region or place', 'Highlands Coffee (Vietnamese highlands coffee-growing image)']]) +
`<p>Note: some etymologies are widely told but not always verified; treat company-history anecdotes with care and cite the company's own sources in assignments.</p>
<h4>Naming process</h4>
<ol><li><strong>Brief</strong>: positioning, personality, markets, languages, extension plans.</li>
<li><strong>Generate</strong>: aim for dozens of candidates; ban quick judgment.</li>
<li><strong>Screen</strong>: six criteria; read aloud; spelling by phone.</li>
<li><strong>Legal search</strong>: trademark databases of the national IP office and, for abroad, WIPO tools.</li>
<li><strong>Consumer test</strong>: associations, pronunciation, translation by native speakers.</li>
<li><strong>Domain and social handles</strong>: secure them before announcing.</li></ol>
<h4>Vietnamese specifics</h4>
<p>Vietnamese is tonal and diacritic-heavy. A name that works with accents (Việt) must still be readable without (Viet) for international use. Short two-syllable names are easier to say and spell. Watch for unintended meanings when syllables are joined.</p>`,
       `<h4>Các kiểu tên</h4>` +
tbl(['Kiểu', 'Ý tưởng', 'Ví dụ'], [['Tên người sáng lập', 'Dùng tên một người', 'Toyota (từ họ Toyoda, đổi cách viết), Ford, Honda'], ['Mô tả', 'Nói rõ làm gì', 'Vietnam Airlines, Vietnam Dairy (tên đầy đủ của Vinamilk: Công ty cổ phần Sữa Việt Nam)'], ['Viết tắt/ghép', 'Viết tắt hay ghép từ', 'VinFast (Việt Nam, phong cách, an toàn, sáng tạo, tiên phong), Vinamilk (Vietnam + milk)'], ['Ẩn dụ', 'Gợi cảm giác', 'Red Bull (sức mạnh), Virgin'], ['Tự đặt', 'Từ mới', 'Kodak, Lego (từ tiếng Đan Mạch "leg godt", chơi vui)'], ['Địa danh', 'Vùng hay nơi chốn', 'Highlands Coffee (gợi hình ảnh cà phê Tây Nguyên)']]) +
`<p>Lưu ý: một số nguồn gốc tên được kể rộng rãi nhưng chưa luôn được kiểm chứng; hãy thận trọng với giai thoại lịch sử công ty và dẫn nguồn của chính công ty trong bài làm.</p>
<h4>Quy trình đặt tên</h4>
<ol><li><strong>Brief</strong>: định vị, tính cách, thị trường, ngôn ngữ, kế hoạch mở rộng.</li>
<li><strong>Phát sinh</strong>: nhắm hàng chục ứng viên; cấm phán xét vội.</li>
<li><strong>Sàng lọc</strong>: sáu tiêu chí; đọc to; đánh vần qua điện thoại.</li>
<li><strong>Tra cứu pháp lý</strong>: cơ sở dữ liệu nhãn hiệu của cơ quan sở hữu trí tuệ quốc gia và, với nước ngoài, công cụ của WIPO.</li>
<li><strong>Thử với người tiêu dùng</strong>: liên tưởng, phát âm, dịch bởi người bản ngữ.</li>
<li><strong>Tên miền và tài khoản mạng xã hội</strong>: giữ chỗ trước khi công bố.</li></ol>
<h4>Đặc thù tiếng Việt</h4>
<p>Tiếng Việt có thanh điệu và nhiều dấu. Tên dùng tốt có dấu (Việt) vẫn phải đọc được khi bỏ dấu (Viet) cho thị trường quốc tế. Tên hai âm tiết ngắn dễ nói và dễ đánh vần. Cẩn thận nghĩa ngoài ý muốn khi ghép âm tiết.</p>`],
    pit: ['Falling in love with a name before the legal search. Rebranding after a trademark dispute costs far more than a search fee.', 'Phải lòng một cái tên trước khi tra cứu pháp lý. Đổi tên sau tranh chấp nhãn hiệu tốn hơn nhiều so với phí tra cứu.'],
    s: [['Name types: founder, descriptive, acronym, metaphor, invented, place.', 'Kiểu tên: người sáng lập, mô tả, viết tắt, ẩn dụ, tự đặt, địa danh.'], ['Process: brief, generate, screen, legal, test, secure handles.', 'Quy trình: brief, phát sinh, sàng lọc, pháp lý, thử, giữ tài khoản.'], ['Check meanings in other languages and without diacritics.', 'Kiểm nghĩa ở ngôn ngữ khác và khi bỏ dấu.']],
    l: ['tm', 'wipo', 'ipvn', 'vinfast'],
    p: [['Classify "Vinamilk" by name type.', 'Phân loại tên "Vinamilk" theo kiểu.', 'Compound (Vietnam + milk), also descriptive.', 'Tên ghép (Vietnam + milk), cũng mang tính mô tả.'],
        ['Why test a new name by phone spelling?', 'Vì sao thử tên mới bằng cách đánh vần qua điện thoại?', 'Word-of-mouth and search depend on people spelling it correctly.', 'Truyền miệng và tìm kiếm phụ thuộc việc mọi người viết đúng.']] }),

  D(P + '4-3', '4.3 Logos, symbols, characters and colour', '4.3 Logo, biểu tượng, nhân vật và màu sắc', 'Vai trò của yếu tố hình ảnh, cách đánh giá logo, nhân vật, màu sắc.', {
    n: '4.3',
    g: [['Describe the roles of logos and symbols', 'Mô tả vai trò của logo và biểu tượng'], ['Evaluate a logo with simple tests', 'Đánh giá logo bằng các phép thử đơn giản'], ['Explain how characters and colour carry meaning', 'Giải thích nhân vật và màu sắc mang ý nghĩa thế nào']],
    b: [`<p>Visual elements are quickly recognised, cross language barriers, and can be small enough for icons and apps. Keller notes logos range from <em>wordmarks</em> (stylised name) through <em>symbols</em> (abstract or pictorial) to combinations.</p>
<h4>What a logo must do</h4>
<ul><li><strong>Identify</strong> the brand at a glance, at 16 pixels and on a billboard.</li>
<li><strong>Express</strong> something about the position and personality, without needing explanation.</li>
<li><strong>Work in black-and-white</strong>, on dark and light backgrounds.</li>
<li><strong>Last</strong>: adapt gently, not be replaced.</li></ul>
<h4>Evaluate with five tests</h4>
<ol><li>Squint test: does the silhouette stay recognisable blurred?</li>
<li>Size test: legible small?</li>
<li>Monochrome test.</li>
<li>Recall test: can people redraw it from memory?</li>
<li>Meaning test: what do people say it stands for?</li></ol>
<h4>Characters</h4>
<p>Characters (a mascot, a cartoon figure, a human spokesperson) add personality and are easy to use across ages. Risks: a character can age, or be tied to one person. Lego uses a consistent minifigure world; Red Bull's cartoon bulls fit its energetic tone. Check the brand pages for background.</p>
<h4>Colour</h4>
<p>Colours carry cultural meaning, and meaning differs by country. Red can mean luck in Vietnam and China but warning elsewhere; white is mourning in some Asian contexts. Pick colours for differentiation (standing out on a shelf) and consistency (same shade everywhere with a written colour code).</p>
<div class="meo"><strong>Practice.</strong> Take screenshots of three competing logos in your category and look for shared colours. Choose a different colour family if you want to stand out.</div>`,
       `<p>Yếu tố hình ảnh được nhận ra nhanh, vượt rào ngôn ngữ và đủ nhỏ để làm biểu tượng ứng dụng. Keller lưu ý logo trải từ <em>logo chữ</em> (tên cách điệu) qua <em>biểu tượng</em> (trừu tượng hay hình ảnh) đến dạng kết hợp.</p>
<h4>Logo phải làm được gì</h4>
<ul><li><strong>Nhận diện</strong> thương hiệu thoáng qua, ở cỡ 16 điểm ảnh và trên biển quảng cáo.</li>
<li><strong>Diễn đạt</strong> điều gì đó về vị thế và tính cách, không cần giải thích.</li>
<li><strong>Dùng được đen trắng</strong>, trên nền tối và sáng.</li>
<li><strong>Bền</strong>: chỉnh nhẹ nhàng, không thay hẳn.</li></ul>
<h4>Đánh giá bằng năm phép thử</h4>
<ol><li>Thử nheo mắt: hình bóng còn nhận ra khi mờ không?</li>
<li>Thử kích thước: nhỏ còn đọc được không?</li>
<li>Thử đơn sắc.</li>
<li>Thử trí nhớ: mọi người vẽ lại được từ trí nhớ không?</li>
<li>Thử ý nghĩa: mọi người nói nó đại diện cho gì?</li></ol>
<h4>Nhân vật</h4>
<p>Nhân vật (linh vật, hoạt hình, người phát ngôn) thêm tính cách và dễ dùng cho nhiều lứa tuổi. Rủi ro: nhân vật có thể lỗi thời hoặc gắn với một người. Lego dùng thế giới minifigure nhất quán; những chú bò hoạt hình của Red Bull hợp với tông năng lượng. Xem trang thương hiệu để lấy bối cảnh.</p>
<h4>Màu sắc</h4>
<p>Màu mang ý nghĩa văn hoá, và ý nghĩa khác nhau theo quốc gia. Đỏ có thể là may mắn ở Việt Nam và Trung Quốc nhưng là cảnh báo ở nơi khác; trắng là tang ở một số bối cảnh châu Á. Chọn màu để khác biệt (nổi trên kệ) và nhất quán (cùng sắc độ ở mọi nơi với mã màu bằng văn bản).</p>
<div class="meo"><strong>Thực hành.</strong> Chụp màn hình ba logo đối thủ trong ngành và tìm màu chung. Chọn họ màu khác nếu muốn nổi bật.</div>`],
    pit: ['Redrawing a logo every year to "stay fresh". Recognition is built by repetition; change only to fix a real problem.', 'Vẽ lại logo mỗi năm để "luôn mới". Nhận biết được xây bằng sự lặp lại; chỉ đổi để sửa vấn đề thật.'],
    s: [['Logos must identify, express, work small and in mono, and last.', 'Logo phải nhận diện, diễn đạt, dùng được nhỏ và đơn sắc, và bền.'], ['Five tests: squint, size, mono, recall, meaning.', 'Năm phép thử: nheo mắt, kích thước, đơn sắc, trí nhớ, ý nghĩa.'], ['Characters add personality; colour meaning is cultural.', 'Nhân vật thêm tính cách; ý nghĩa màu mang tính văn hoá.']],
    l: ['logo', 'corpid', 'lego', 'redbull'],
    p: [['Which test checks that a logo survives on a tiny app icon?', 'Phép thử nào kiểm logo sống sót trên biểu tượng ứng dụng nhỏ?', 'The size test.', 'Phép thử kích thước.'],
        ['Why write colour codes in a brand guide?', 'Vì sao ghi mã màu trong hướng dẫn thương hiệu?', 'To keep the exact shade consistent across media and suppliers.', 'Để giữ đúng sắc độ nhất quán trên các phương tiện và nhà cung cấp.']] }),

  D(P + '4-4', '4.4 Slogans, jingles, packaging and legal protection', '4.4 Slogan, nhạc hiệu, bao bì và bảo hộ pháp lý', 'Slogan là móc nối ký ức, nhạc hiệu, bao bì và nhãn hiệu.', {
    n: '4.4',
    g: [['Explain how slogans work as "hooks" and "handles"', 'Giải thích slogan hoạt động như "móc" và "tay cầm"'], ['Know the role of jingles and packaging', 'Biết vai trò của nhạc hiệu và bao bì'], ['Understand basic trademark protection and the first-to-file idea', 'Hiểu bảo hộ nhãn hiệu cơ bản và nguyên tắc nộp đơn đầu tiên']],
    b: [`<h4>Slogans</h4>
<p>A <strong>slogan</strong> is a short phrase that communicates descriptive or persuasive information. Keller calls slogans "hooks" that help consumers grasp what the brand is and what makes it special, and "handles" that help them remember it. Good slogans are short, rhythmic, truthful and flexible across campaigns. Vinamilk's own history includes different slogans in different years (for example "Niềm tin Việt Nam" in 2009 and "Vươn cao Việt Nam" in 2010, per the Vinamilk Wikipedia page), a reminder that slogans are tied to a campaign period while the name and logo hold longer.</p>
<h4>Jingles and sonic branding</h4>
<p>Short melodies or sound logos add memory through music and can be recognised without any visual. They are protectable in some jurisdictions as sound trademarks (see "Sound trademark"). Risk: tiring repetition, and the need to refresh the arrangement while keeping the core notes.</p>
<h4>Packaging</h4>
<p>Packaging does at least four jobs: identify the brand, convey descriptive and persuasive information, protect and ease transport, and aid storage and use. In shops it is often the only "ad" the buyer sees. Consistency of shape, colour and typography across a product line builds shelf impact. Sustainability now matters too: lighter, recyclable materials and clear labels.</p>
<h4>Legal protection</h4>
<ul><li>A <strong>trademark</strong> protects a sign that distinguishes goods or services. Rights are territorial: registered in Vietnam does not mean protected in Thailand.</li>
<li>Many countries, including Vietnam, work on a <strong>first-to-file</strong> basis, so register before launching. Check the national IP office for current procedures.</li>
<li>For several countries, the <strong>Madrid System</strong> from WIPO lets you file one application for many members.</li>
<li>Protect against <strong>dilution</strong>: monitor marketplaces and social media for copies.</li></ul>
<div class="callout"><strong>Not legal advice.</strong> This lesson explains concepts. For a real filing talk to a licensed IP attorney or the national IP office.</div>`,
       `<h4>Slogan</h4>
<p><strong>Slogan</strong> là cụm từ ngắn truyền đạt thông tin mô tả hoặc thuyết phục. Keller gọi slogan là "cái móc" giúp khách hiểu thương hiệu là gì và đặc biệt ở đâu, và là "tay cầm" giúp họ nhớ. Slogan tốt thì ngắn, có nhịp, trung thực và linh hoạt qua các chiến dịch. Lịch sử Vinamilk có những slogan khác nhau ở các năm (ví dụ "Niềm tin Việt Nam" năm 2009 và "Vươn cao Việt Nam" năm 2010, theo trang Wikipedia về Vinamilk), nhắc rằng slogan gắn với một giai đoạn chiến dịch còn tên và logo tồn tại lâu hơn.</p>
<h4>Nhạc hiệu và thương hiệu âm thanh</h4>
<p>Giai điệu ngắn hay logo âm thanh thêm trí nhớ qua âm nhạc và nhận ra được mà không cần hình. Một số nơi bảo hộ chúng như nhãn hiệu âm thanh (xem "Sound trademark"). Rủi ro: lặp lại gây chán, và phải làm mới phối khí nhưng giữ nốt cốt lõi.</p>
<h4>Bao bì</h4>
<p>Bao bì làm ít nhất bốn việc: nhận diện thương hiệu, truyền thông tin mô tả và thuyết phục, bảo vệ và dễ vận chuyển, hỗ trợ lưu trữ và sử dụng. Tại cửa hàng, nó thường là "quảng cáo" duy nhất người mua thấy. Nhất quán về hình dáng, màu, chữ trên cả dòng sản phẩm tạo sức nổi trên kệ. Bền vững nay cũng quan trọng: vật liệu nhẹ, tái chế được và nhãn rõ ràng.</p>
<h4>Bảo hộ pháp lý</h4>
<ul><li><strong>Nhãn hiệu</strong> bảo hộ dấu hiệu phân biệt hàng hoá, dịch vụ. Quyền mang tính lãnh thổ: đăng ký ở Việt Nam không có nghĩa được bảo hộ ở Thái Lan.</li>
<li>Nhiều nước, trong đó có Việt Nam, theo nguyên tắc <strong>nộp đơn đầu tiên</strong>, nên hãy đăng ký trước khi ra mắt. Xem cơ quan sở hữu trí tuệ quốc gia để biết thủ tục hiện hành.</li>
<li>Với nhiều nước, <strong>Hệ thống Madrid</strong> của WIPO cho phép nộp một đơn cho nhiều thành viên.</li>
<li>Phòng ngừa <strong>làm mờ nhãn hiệu</strong>: theo dõi sàn thương mại và mạng xã hội để phát hiện hàng nhái.</li></ul>
<div class="callout"><strong>Không phải tư vấn pháp lý.</strong> Bài này giải thích khái niệm. Nộp đơn thật hãy hỏi luật sư sở hữu trí tuệ có chứng chỉ hoặc cơ quan sở hữu trí tuệ quốc gia.</div>`],
    pit: ['Launching first and registering later. A squatter may file your name in the market before you.', 'Ra mắt trước, đăng ký sau. Kẻ chiếm tên có thể nộp đơn trước bạn.'],
    s: [['Slogans are hooks and handles; they change with campaigns.', 'Slogan là móc và tay cầm; đổi theo chiến dịch.'], ['Packaging identifies, informs, protects, and sells on shelf.', 'Bao bì nhận diện, thông tin, bảo vệ và bán hàng trên kệ.'], ['Trademark rights are territorial and often first-to-file; use WIPO Madrid for multi-country filing.', 'Quyền nhãn hiệu mang tính lãnh thổ và thường nộp đơn đầu tiên; dùng Madrid của WIPO khi nộp nhiều nước.']],
    l: ['slogan', 'jingle', 'sound', 'tm', 'wipomad'],
    p: [['Why is trademark protection described as "territorial"?', 'Vì sao bảo hộ nhãn hiệu được gọi là "lãnh thổ"?', 'Rights apply only in the countries where the mark is registered.', 'Quyền chỉ áp dụng ở những nước nơi nhãn hiệu được đăng ký.'],
        ['Name two jobs of packaging beyond holding the product.', 'Nêu hai việc của bao bì ngoài việc chứa sản phẩm.', 'Identify the brand and communicate information; also protect and ease use.', 'Nhận diện thương hiệu và truyền thông tin; cũng bảo vệ và dễ sử dụng.']] }),

  Q(P + 'quiz-4', 'Chapter 4 quiz — Brand elements', 'Quiz Chương 4 — Yếu tố thương hiệu', [
    ['Which criteria "build" brand equity?|||Tiêu chí nào "xây" giá trị thương hiệu?', ['Memorable, meaningful, likeable|||Dễ nhớ, có ý nghĩa, dễ mến', 'Transferable, adaptable, protectable|||Chuyển giao, thích nghi, bảo hộ', 'Cheap, fast, local|||Rẻ, nhanh, địa phương', 'Old, big, red|||Cũ, lớn, đỏ'], 0, 'The first three build; the last three defend and leverage.|||Ba tiêu chí đầu xây; ba tiêu chí sau giữ và khai thác.'],
    ['A purely invented name usually scores high on…|||Tên hoàn toàn tự đặt thường được điểm cao về…', ['Meaningful|||Có ý nghĩa', 'Protectable and transferable|||Bảo hộ được và chuyển giao được', 'Descriptive power|||Sức mô tả', 'Local relevance|||Liên quan địa phương'], 1, 'Invented names are easy to protect but need spend to create meaning.|||Tên tự đặt dễ bảo hộ nhưng cần chi tiền để tạo nghĩa.'],
    ['A name that works with diacritics should also…|||Tên dùng tốt có dấu cũng nên…', ['Be unreadable without them|||Không đọc được khi bỏ dấu', 'Be readable without diacritics for international use|||Đọc được khi bỏ dấu cho dùng quốc tế', 'Use only capital letters|||Chỉ dùng chữ hoa', 'Be longer|||Dài hơn'], 1, 'International markets and search often drop diacritics.|||Thị trường quốc tế và tìm kiếm thường bỏ dấu.'],
    ['The "squint test" for logos checks…|||"Thử nheo mắt" cho logo kiểm…', ['Legal status|||Tình trạng pháp lý', 'Whether the silhouette stays recognisable when blurred|||Hình bóng còn nhận ra khi mờ không', 'Price|||Giá', 'Font licence|||Bản quyền phông'], 1, 'A strong shape is recognisable even when blurred.|||Hình khối mạnh vẫn nhận ra khi mờ.'],
    ['Slogans are described as…|||Slogan được mô tả là…', ['Legal contracts|||Hợp đồng pháp lý', 'Hooks and handles for memory|||Móc và tay cầm cho trí nhớ', 'Price tags|||Nhãn giá', 'Logos|||Logo'], 1, 'They help consumers understand and remember the brand.|||Chúng giúp khách hiểu và nhớ thương hiệu.'],
    ['Trademark rights are generally…|||Quyền nhãn hiệu nhìn chung…', ['Global automatically|||Tự động toàn cầu', 'Territorial|||Mang tính lãnh thổ', 'Valid without registration everywhere|||Có hiệu lực ở mọi nơi dù không đăng ký', 'Only for logos|||Chỉ cho logo'], 1, 'Register in each target country or via the Madrid System.|||Đăng ký ở từng nước mục tiêu hoặc qua Hệ thống Madrid.'],
    ['Which tool lets one application cover many countries?|||Công cụ nào cho một đơn bao nhiều nước?', ['Madrid System (WIPO)|||Hệ thống Madrid (WIPO)', 'A press release|||Thông cáo báo chí', 'A domain name|||Tên miền', 'A jingle|||Nhạc hiệu'], 0, 'The Madrid System provides international trademark filing.|||Hệ thống Madrid cho phép nộp đơn nhãn hiệu quốc tế.'],
    ['Which is a main packaging function?|||Chức năng chính của bao bì là?', ['Identify the brand and inform|||Nhận diện thương hiệu và cung cấp thông tin', 'Replace the product|||Thay thế sản phẩm', 'Set the exchange rate|||Định tỷ giá', 'Hire staff|||Tuyển nhân viên'], 0, 'Packaging identifies, informs, protects and supports use.|||Bao bì nhận diện, thông tin, bảo vệ và hỗ trợ sử dụng.'],
  ]),
]));
// ===== Chương 5 =====
secs.push(SEC('Chapter 5 — Brand identity, personality and architecture', 'Chương 5 — Nhận diện, tính cách và kiến trúc thương hiệu',
  'Hệ thống nhận diện của Aaker, lăng kính Kapferer, tính cách thương hiệu, kiến trúc và danh mục thương hiệu.', [
  D(P + '5-1', '5.1 Brand identity: Aaker\'s system and Kapferer\'s prism', '5.1 Nhận diện thương hiệu: hệ thống Aaker và lăng kính Kapferer', 'Core identity, extended identity, value proposition; sáu mặt của lăng kính Kapferer.', {
    n: '5.1',
    g: [['Define brand identity', 'Định nghĩa nhận diện (bản sắc) thương hiệu'], ['Describe core vs extended identity', 'Mô tả bản sắc cốt lõi và bản sắc mở rộng'], ['Name the six facets of Kapferer\'s prism', 'Gọi tên sáu mặt của lăng kính Kapferer']],
    b: [`<p>Aaker defines <strong>brand identity</strong> as a unique set of brand associations that the brand strategist aspires to create or maintain. It is the <em>sender</em> side (what we want), while image is the <em>receiver</em> side (what customers perceive).</p>
<h4>Aaker's identity system</h4>
<ul><li><strong>Core identity</strong>: the timeless essence, central to the brand's meaning and success. It stays when the brand enters new markets and products.</li>
<li><strong>Extended identity</strong>: additional elements that complete the picture (personality, symbols, relationships).</li>
<li><strong>Value proposition</strong>: functional, emotional and self-expressive benefits.</li>
<li><strong>Credibility</strong>: the relationship with customers built on trust.</li></ul>
<p>Aaker also suggests looking at the brand as a <em>product</em>, an <em>organisation</em>, a <em>person</em> and a <em>symbol</em>: four perspectives that stop you from reducing identity to product features.</p>
<h4>Kapferer's identity prism</h4>
<p>Kapferer describes identity with a six-facet prism. Top half expresses the sender; bottom half expresses the receiver; left side is externalisation (visible), right side is internalisation (inner).</p>` +
tbl(['Facet', 'Question', 'Example prompt'], [['Physique', 'What does it look like and do?', 'Core features, colours, shape'], ['Personality', 'How does it speak and behave as a person?', 'Warm, bold, dependable'], ['Culture', 'What values and origin drive it?', 'Country, founder ethic'], ['Relationship', 'What kind of bond with customers?', 'Advisor, friend, expert'], ['Reflection', 'What type of customer does it show in ads?', 'The image of the typical user'], ['Self-image', 'How do customers see themselves when using it?', 'Smart, modern, caring']]) +
`<div class="meo"><strong>Practice.</strong> Fill six sentences for a brand you know. Then read its latest ad and check whether each facet appears consistently.</div>`,
       `<p>Aaker định nghĩa <strong>nhận diện (bản sắc) thương hiệu</strong> là tập liên tưởng độc nhất mà nhà chiến lược thương hiệu mong muốn tạo ra hoặc duy trì. Đó là phía <em>người gửi</em> (điều ta muốn), còn hình ảnh là phía <em>người nhận</em> (điều khách cảm nhận).</p>
<h4>Hệ thống nhận diện của Aaker</h4>
<ul><li><strong>Bản sắc cốt lõi</strong>: tinh chất bất biến, trung tâm ý nghĩa và thành công của thương hiệu. Nó giữ nguyên khi thương hiệu sang thị trường và sản phẩm mới.</li>
<li><strong>Bản sắc mở rộng</strong>: các yếu tố bổ sung hoàn thiện bức tranh (tính cách, biểu tượng, quan hệ).</li>
<li><strong>Đề xuất giá trị</strong>: lợi ích chức năng, cảm xúc và thể hiện bản thân.</li>
<li><strong>Uy tín</strong>: mối quan hệ với khách xây trên lòng tin.</li></ul>
<p>Aaker còn gợi ý nhìn thương hiệu như một <em>sản phẩm</em>, một <em>tổ chức</em>, một <em>con người</em> và một <em>biểu tượng</em>: bốn góc nhìn giúp bạn khỏi thu hẹp bản sắc thành tính năng sản phẩm.</p>
<h4>Lăng kính nhận diện của Kapferer</h4>
<p>Kapferer mô tả bản sắc bằng lăng kính sáu mặt. Nửa trên thể hiện người gửi; nửa dưới thể hiện người nhận; bên trái là ngoại hiện (nhìn thấy), bên phải là nội hiện (bên trong).</p>` +
tbl(['Mặt', 'Câu hỏi', 'Gợi ý'], [['Thể chất (physique)', 'Trông ra sao và làm được gì?', 'Tính năng cốt lõi, màu, hình dáng'], ['Tính cách (personality)', 'Nói và hành xử như một con người ra sao?', 'Ấm áp, táo bạo, đáng tin'], ['Văn hoá (culture)', 'Giá trị và nguồn gốc nào dẫn dắt?', 'Quốc gia, đạo đức người sáng lập'], ['Quan hệ (relationship)', 'Loại gắn kết nào với khách?', 'Cố vấn, bạn bè, chuyên gia'], ['Phản chiếu (reflection)', 'Quảng cáo cho thấy kiểu khách nào?', 'Hình ảnh người dùng điển hình'], ['Tự hình dung (self-image)', 'Khách thấy mình thế nào khi dùng?', 'Thông minh, hiện đại, biết quan tâm']]) +
`<div class="meo"><strong>Thực hành.</strong> Điền sáu câu cho một thương hiệu bạn biết. Rồi đọc quảng cáo mới nhất của nó và kiểm xem từng mặt có xuất hiện nhất quán không.</div>`],
    pit: ['Mixing up identity and image: running a survey of customers and calling the result "our identity". Surveys measure image.', 'Lẫn bản sắc và hình ảnh: khảo sát khách rồi gọi kết quả là "bản sắc của ta". Khảo sát đo hình ảnh.'],
    s: [['Identity = what we want; image = what they perceive.', 'Bản sắc = điều ta muốn; hình ảnh = điều họ cảm nhận.'], ['Aaker: core + extended identity, value proposition, credibility.', 'Aaker: bản sắc cốt lõi + mở rộng, đề xuất giá trị, uy tín.'], ['Kapferer prism: physique, personality, culture, relationship, reflection, self-image.', 'Lăng kính Kapferer: thể chất, tính cách, văn hoá, quan hệ, phản chiếu, tự hình dung.']],
    l: ['aaker', 'corpid', 'equity', 'brand'],
    p: [['Which prism facet describes the typical user shown in advertising?', 'Mặt lăng kính nào mô tả người dùng điển hình hiện trong quảng cáo?', 'Reflection.', 'Phản chiếu (reflection).'],
        ['Why keep a core identity stable while the extended identity may change?', 'Vì sao giữ bản sắc cốt lõi ổn định còn bản sắc mở rộng có thể đổi?', 'The core gives continuity across products and time; extended elements adapt to context.', 'Lõi tạo liên tục qua sản phẩm và thời gian; phần mở rộng thích nghi với bối cảnh.']] }),

  D(P + '5-2', '5.2 Brand personality', '5.2 Tính cách thương hiệu', 'Năm chiều tính cách của Jennifer Aaker và cách dùng.', {
    n: '5.2',
    g: [['Define brand personality', 'Định nghĩa tính cách thương hiệu'], ['Name Jennifer Aaker\'s five dimensions', 'Gọi tên năm chiều của Jennifer Aaker'], ['Write a personality brief that guides tone of voice', 'Viết bản tính cách để dẫn dắt giọng điệu']],
    b: [`<p><strong>Brand personality</strong> is the set of human characteristics associated with a brand. Customers choose brands partly the way they choose friends: for the traits they express. In 1997 Jennifer Aaker published a study of American brands and proposed five dimensions.</p>` +
tbl(['Dimension', 'Facets (examples)', 'Typical brand image'], [['Sincerity', 'Down-to-earth, honest, wholesome, cheerful', 'Family food, banks that stress trust'], ['Excitement', 'Daring, spirited, imaginative, up-to-date', 'Energy drinks, youth fashion'], ['Competence', 'Reliable, intelligent, successful', 'Business software, insurance'], ['Sophistication', 'Upper class, charming', 'Luxury fashion, premium cars'], ['Ruggedness', 'Outdoorsy, tough', 'Outdoor gear, motorcycles']]) +
`<p>Her results come from a US sample; later studies found that dimensions differ across cultures (for example "peacefulness" appears in Japan, "passion" in Spain). When working in Vietnam, check with local research before assuming the same factors.</p>
<h4>Where personality comes from</h4>
<p>Everything communicates it: user imagery, endorsers, tone of ads, price, packaging, employees and the name. Harley-Davidson's association with freedom and toughness shows personality shaped by riders, events and stories over decades. Patagonia's personality comes from its public environmental stance.</p>
<h4>Using personality</h4>
<ul><li><strong>Tone of voice</strong>: how you write social posts and customer replies. A "sincere" brand uses plain, warm words; a "sophisticated" brand uses restrained, elegant language.</li>
<li><strong>Casting and design</strong> decisions, from endorsers to colour.</li>
<li><strong>Consistency check</strong>: before posting, ask "would our brand person say this?"</li></ul>
<div class="pitfall"><strong>Caution.</strong> A brand cannot be everything. Pick one main dimension and one supporting one.</div>`,
       `<p><strong>Tính cách thương hiệu</strong> là tập đặc điểm của con người gắn với thương hiệu. Khách chọn thương hiệu một phần như chọn bạn: theo nét tính cách nó thể hiện. Năm 1997 Jennifer Aaker công bố nghiên cứu về các thương hiệu Mỹ và đề xuất năm chiều.</p>` +
tbl(['Chiều', 'Khía cạnh (ví dụ)', 'Hình ảnh thương hiệu điển hình'], [['Chân thành (sincerity)', 'Giản dị, trung thực, lành mạnh, vui vẻ', 'Thực phẩm gia đình, ngân hàng nhấn mạnh lòng tin'], ['Hứng khởi (excitement)', 'Táo bạo, sôi nổi, giàu tưởng tượng, bắt kịp thời đại', 'Nước tăng lực, thời trang trẻ'], ['Năng lực (competence)', 'Đáng tin, thông minh, thành công', 'Phần mềm doanh nghiệp, bảo hiểm'], ['Tinh tế (sophistication)', 'Thượng lưu, quyến rũ', 'Thời trang xa xỉ, xe cao cấp'], ['Mạnh mẽ (ruggedness)', 'Ưa ngoài trời, cứng cáp', 'Đồ dã ngoại, xe mô tô']]) +
`<p>Kết quả của bà từ mẫu Hoa Kỳ; các nghiên cứu sau cho thấy các chiều khác nhau theo văn hoá (ví dụ "bình yên" xuất hiện ở Nhật, "đam mê" ở Tây Ban Nha). Khi làm ở Việt Nam hãy kiểm bằng nghiên cứu địa phương, đừng mặc định cùng các yếu tố.</p>
<h4>Tính cách đến từ đâu</h4>
<p>Mọi thứ đều truyền đạt nó: hình ảnh người dùng, người bảo chứng, giọng điệu quảng cáo, giá, bao bì, nhân viên và cái tên. Sự gắn Harley-Davidson với tự do và cứng cáp cho thấy tính cách được hình thành bởi người lái, sự kiện và câu chuyện qua nhiều thập kỷ. Tính cách Patagonia đến từ lập trường môi trường công khai của họ.</p>
<h4>Cách dùng tính cách</h4>
<ul><li><strong>Giọng điệu</strong>: cách viết bài mạng xã hội và trả lời khách. Thương hiệu "chân thành" dùng từ giản dị, ấm; thương hiệu "tinh tế" dùng ngôn ngữ chừng mực, thanh lịch.</li>
<li><strong>Chọn người và thiết kế</strong>, từ người bảo chứng đến màu sắc.</li>
<li><strong>Kiểm nhất quán</strong>: trước khi đăng, hỏi "nhân vật thương hiệu của ta có nói câu này không?"</li></ul>
<div class="pitfall"><strong>Cẩn trọng.</strong> Thương hiệu không thể là tất cả. Chọn một chiều chính và một chiều hỗ trợ.</div>`],
    pit: ['Choosing "innovative, friendly, premium, affordable, youthful" all at once. Adjectives that contradict cancel each other.', 'Chọn cùng lúc "đổi mới, thân thiện, cao cấp, giá rẻ, trẻ trung". Các tính từ mâu thuẫn triệt tiêu nhau.'],
    s: [['Five dimensions: sincerity, excitement, competence, sophistication, ruggedness.', 'Năm chiều: chân thành, hứng khởi, năng lực, tinh tế, mạnh mẽ.'], ['Dimensions vary by culture; test locally.', 'Các chiều khác nhau theo văn hoá; kiểm bản địa.'], ['Use personality to guide tone of voice and consistency.', 'Dùng tính cách để dẫn giọng điệu và tính nhất quán.']],
    l: ['brand', 'harley', 'patagonia', 'celeb'],
    p: [['Which dimension fits a motorcycle brand built on toughness?', 'Chiều nào hợp với thương hiệu mô tô xây trên sự cứng cáp?', 'Ruggedness.', 'Mạnh mẽ (ruggedness).'],
        ['Why test personality dimensions locally?', 'Vì sao kiểm các chiều tính cách tại địa phương?', 'Factors found in US samples may differ in other cultures.', 'Các yếu tố tìm thấy ở mẫu Mỹ có thể khác ở văn hoá khác.']] }),

  D(P + '5-3', '5.3 Brand architecture and hierarchy', '5.3 Kiến trúc và hệ thống thứ bậc thương hiệu', 'Branded house, house of brands, endorsed, sub-brands, hybrid.', {
    n: '5.3',
    g: [['Compare a branded house and a house of brands', 'So sánh nhà thương hiệu và nhà của các thương hiệu'], ['Describe endorsed brands and sub-brands', 'Mô tả thương hiệu bảo chứng và thương hiệu con'], ['Pick a structure for a given case', 'Chọn cấu trúc cho một tình huống']],
    b: [`<p><strong>Brand architecture</strong> is the structure of the brand portfolio: which brand names are used across products, and how they relate. Keller adds the idea of a <em>brand hierarchy</em> (corporate, family, individual, modifier levels). Aaker's brand relationship spectrum is widely used.</p>` +
tbl(['Model', 'Idea', 'Pros', 'Cons', 'Example'], [['Branded house', 'One master brand over many offers', 'Efficient; every product builds the same brand', 'A failure hurts all', 'Samsung, Virgin (many sectors under one name)'], ['Endorsed brands', 'Individual brand with a visible parent', 'Borrow trust, keep identity', 'Complex to manage', 'Marriott-style hotels (endorser adds credibility)'], ['Sub-brands', 'Master brand + descriptor', 'Flexible', 'Can blur', 'Many car model families under a corporate name'], ['House of brands', 'Separate brands, parent hidden', 'Targeted; failure isolated', 'Costly; no shared equity', 'Procter &amp; Gamble, Unilever products']]) +
`<h4>Vietnamese example: the "Vin" family</h4>
<p>Vingroup uses the "Vin" prefix across businesses (for example VinFast in cars, and others in real estate, healthcare and education). That is closer to a branded house with a family-name link: reputation moves between units, which is an advantage in launching new ones and a risk if one unit is criticised. Check the Vingroup and VinFast pages for the current structure, since it changes over time.</p>
<h4>Toyota and Lexus</h4>
<p>Toyota created Lexus as a separate luxury brand to avoid diluting the mainstream image of Toyota: a case for a separate brand when positions differ greatly. See the Lexus page.</p>
<h4>Decision questions</h4>
<ol><li>Are the positions and target segments close? Close: share a brand. Far: separate.</li>
<li>Does the master brand have positive equity to lend?</li>
<li>Can we afford separate brand-building budgets?</li>
<li>Will the structure be understandable to customers and staff?</li></ol>`,
       `<p><strong>Kiến trúc thương hiệu</strong> là cấu trúc danh mục thương hiệu: những tên nào dùng cho các sản phẩm, và chúng liên quan nhau thế nào. Keller thêm khái niệm <em>hệ thống thứ bậc thương hiệu</em> (cấp công ty, họ sản phẩm, từng sản phẩm, bổ nghĩa). Phổ quan hệ thương hiệu của Aaker được dùng rộng rãi.</p>` +
tbl(['Mô hình', 'Ý tưởng', 'Ưu điểm', 'Nhược điểm', 'Ví dụ'], [['Nhà thương hiệu (branded house)', 'Một thương hiệu mẹ trên nhiều sản phẩm', 'Hiệu quả; sản phẩm nào cũng xây cùng thương hiệu', 'Một thất bại hại tất cả', 'Samsung, Virgin (nhiều ngành một tên)'], ['Thương hiệu bảo chứng (endorsed)', 'Thương hiệu riêng với công ty mẹ hiển thị', 'Mượn uy tín, giữ bản sắc', 'Quản lý phức tạp', 'Khách sạn kiểu Marriott (bảo chứng thêm tin cậy)'], ['Thương hiệu con (sub-brand)', 'Thương hiệu mẹ + phần mô tả', 'Linh hoạt', 'Dễ nhoè', 'Nhiều dòng xe dưới tên hãng'], ['Nhà của các thương hiệu (house of brands)', 'Các thương hiệu tách biệt, mẹ ẩn', 'Nhắm đúng; thất bại cô lập', 'Tốn kém; không chia sẻ giá trị', 'Sản phẩm của Procter &amp; Gamble, Unilever']]) +
`<h4>Ví dụ Việt Nam: họ "Vin"</h4>
<p>Vingroup dùng tiền tố "Vin" cho các mảng kinh doanh (ví dụ VinFast ở ô tô, cùng các mảng bất động sản, y tế, giáo dục). Gần với nhà thương hiệu theo họ tên: danh tiếng lan giữa các đơn vị, lợi thế khi ra mắt đơn vị mới và là rủi ro khi một đơn vị bị chỉ trích. Xem trang Vingroup và VinFast để biết cấu trúc hiện tại, vì nó thay đổi theo thời gian.</p>
<h4>Toyota và Lexus</h4>
<p>Toyota lập Lexus thành thương hiệu xe sang riêng để khỏi làm loãng hình ảnh đại chúng của Toyota: tình huống nên tách thương hiệu khi vị thế quá khác nhau. Xem trang Lexus.</p>
<h4>Câu hỏi quyết định</h4>
<ol><li>Vị thế và phân khúc có gần nhau không? Gần: dùng chung thương hiệu. Xa: tách riêng.</li>
<li>Thương hiệu mẹ có giá trị dương để cho mượn không?</li>
<li>Có đủ ngân sách xây thương hiệu riêng không?</li>
<li>Cấu trúc có dễ hiểu với khách và nhân viên không?</li></ol>`],
    pit: ['Letting each division invent its own name and logo without rules, producing a pile of unrelated brands nobody can manage.', 'Để mỗi bộ phận tự đặt tên và logo không luật lệ, tạo ra đống thương hiệu rời rạc không ai quản được.'],
    s: [['Spectrum: branded house, endorsed, sub-brand, house of brands.', 'Phổ: nhà thương hiệu, bảo chứng, thương hiệu con, nhà của các thương hiệu.'], ['Share a brand when positions are close; separate when far.', 'Dùng chung thương hiệu khi vị thế gần; tách riêng khi xa.'], ['Structure changes over time; document it.', 'Cấu trúc đổi theo thời gian; hãy ghi lại.']],
    l: ['arch', 'corpbr', 'vingroup', 'lexus', 'pg'],
    p: [['Is Samsung closer to a branded house or a house of brands? Why?', 'Samsung gần nhà thương hiệu hay nhà của các thương hiệu? Vì sao?', 'Branded house: many product lines under the same master name.', 'Nhà thương hiệu: nhiều dòng sản phẩm dưới cùng một tên mẹ.'],
        ['Why did Toyota launch Lexus as a separate brand?', 'Vì sao Toyota ra mắt Lexus thành thương hiệu riêng?', 'To avoid diluting the mainstream Toyota image with a luxury position.', 'Để tránh làm loãng hình ảnh đại chúng của Toyota bằng vị thế xe sang.']] }),

  D(P + '5-4', '5.4 Managing a brand portfolio', '5.4 Quản lý danh mục thương hiệu', 'Vai trò thương hiệu trong danh mục, cắt tỉa, tránh chồng chéo.', {
    n: '5.4',
    g: [['Assign roles to brands in a portfolio', 'Gán vai trò cho các thương hiệu trong danh mục'], ['Spot overlap and cannibalization', 'Nhận ra chồng chéo và tự ăn thị phần'], ['Decide whether to keep, merge or retire a brand', 'Quyết định giữ, gộp hay khai tử một thương hiệu']],
    b: [`<p>A <strong>brand portfolio</strong> is the set of all brands and sub-brands a firm offers. The goal is to maximise equity as a whole and minimise overlap.</p>
<h4>Roles in the portfolio</h4>
<ul><li><strong>Flagship</strong>: the brand that best represents the firm and its core business.</li>
<li><strong>Cash cow</strong>: stable profits with low investment.</li>
<li><strong>Fighter (flanker)</strong>: protects the flagship by competing against low-price or niche rivals.</li>
<li><strong>Low-end entry</strong>: attracts new customers who may trade up later.</li>
<li><strong>High-end prestige</strong>: lends image to the rest of the line.</li></ul>
<h4>Cannibalization and overlap</h4>
<p>If two of your own brands target the same customers with the same promise, they fight each other rather than rivals. <strong>Cannibalization</strong> is not always bad (better than losing the customer to a competitor), but it must be planned. Check overlap by customer segment, price band and need.</p>
<h4>Pruning</h4>
<p>Many firms simplify after growth: they merge near-duplicate brands, sell weak ones, or retire them. A common test: does the brand have a distinctive role, enough sales and a path to profit? If not, merge, harvest or exit. Unilever's public strategy documents describe focusing on a smaller set of "power brands", for example; check the company's investor materials for current details.</p>
<h4>Portfolio map exercise</h4>` +
tbl(['Brand', 'Target', 'Price band', 'Role'], [['Brand X', 'Families', 'Mid', 'Flagship'], ['Brand Y', 'Students', 'Low', 'Entry'], ['Brand Z', 'Office workers', 'Mid', 'Overlaps with X?']]) +
`<p>In this made-up table Z and X may overlap; the manager must either differentiate Z or merge it.</p>`,
       `<p><strong>Danh mục thương hiệu</strong> là tập mọi thương hiệu và thương hiệu con một doanh nghiệp cung cấp. Mục tiêu là tối đa hoá giá trị tổng thể và giảm chồng chéo.</p>
<h4>Vai trò trong danh mục</h4>
<ul><li><strong>Thương hiệu chủ lực (flagship)</strong>: đại diện tốt nhất cho doanh nghiệp và mảng cốt lõi.</li>
<li><strong>Bò sữa (cash cow)</strong>: lợi nhuận ổn định, ít đầu tư.</li>
<li><strong>Thương hiệu chiến đấu (fighter)</strong>: bảo vệ chủ lực bằng cách cạnh tranh với đối thủ giá rẻ hoặc ngách.</li>
<li><strong>Cửa vào phân khúc thấp</strong>: thu hút khách mới có thể nâng cấp sau.</li>
<li><strong>Cao cấp danh giá</strong>: cho mượn hình ảnh với cả dòng.</li></ul>
<h4>Tự ăn thị phần và chồng chéo</h4>
<p>Nếu hai thương hiệu của chính bạn nhắm cùng khách với cùng lời hứa, chúng đánh nhau thay vì đánh đối thủ. <strong>Cannibalization</strong> không phải lúc nào cũng xấu (tốt hơn mất khách cho đối thủ) nhưng phải có kế hoạch. Kiểm chồng chéo theo phân khúc khách, khung giá và nhu cầu.</p>
<h4>Cắt tỉa</h4>
<p>Nhiều doanh nghiệp đơn giản hoá sau giai đoạn lớn: gộp thương hiệu gần giống, bán thương hiệu yếu, hoặc khai tử. Phép thử thường dùng: thương hiệu có vai trò khác biệt, đủ doanh số và con đường đến lợi nhuận không? Nếu không, gộp, thu hoạch hoặc rút. Chẳng hạn tài liệu công khai của Unilever mô tả việc tập trung vào nhóm "thương hiệu lực lượng" nhỏ hơn; xem tài liệu nhà đầu tư của công ty để biết chi tiết hiện hành.</p>
<h4>Bài tập bản đồ danh mục</h4>` +
tbl(['Thương hiệu', 'Mục tiêu', 'Khung giá', 'Vai trò'], [['Thương hiệu X', 'Gia đình', 'Trung', 'Chủ lực'], ['Thương hiệu Y', 'Sinh viên', 'Thấp', 'Cửa vào'], ['Thương hiệu Z', 'Nhân viên văn phòng', 'Trung', 'Chồng chéo với X?']]) +
`<p>Trong bảng giả định này Z và X có thể chồng chéo; người quản lý phải làm Z khác đi hoặc gộp nó.</p>`],
    pit: ['Keeping every brand "because it still sells a little". Tail brands drain attention and budget from the winners.', 'Giữ mọi thương hiệu "vì vẫn bán được chút ít". Thương hiệu đuôi hút sự chú ý và ngân sách từ thương hiệu thắng cuộc.'],
    s: [['Roles: flagship, cash cow, fighter, entry, prestige.', 'Vai trò: chủ lực, bò sữa, chiến đấu, cửa vào, danh giá.'], ['Check overlap by segment, price and need.', 'Kiểm chồng chéo theo phân khúc, giá và nhu cầu.'], ['Merge, harvest or retire brands without a clear role.', 'Gộp, thu hoạch hoặc khai tử thương hiệu không có vai trò rõ.']],
    l: ['cann', 'arch', 'unilever', 'pg'],
    p: [['What is a "fighter" brand for?', 'Thương hiệu "chiến đấu" dùng để làm gì?', 'To protect the flagship by competing with low-price or niche rivals.', 'Bảo vệ chủ lực bằng cách cạnh tranh với đối thủ giá rẻ hoặc ngách.'],
        ['When is cannibalization acceptable?', 'Khi nào cannibalization chấp nhận được?', 'When it takes share from your own brands instead of losing the customer to a competitor, and it is planned.', 'Khi lấy thị phần của chính bạn thay vì mất khách cho đối thủ, và có kế hoạch.']] }),

  Q(P + 'quiz-5', 'Chapter 5 quiz — Identity, personality, architecture', 'Quiz Chương 5 — Nhận diện, tính cách, kiến trúc', [
    ['Brand identity is best described as…|||Bản sắc thương hiệu được mô tả tốt nhất là…', ['What customers perceive|||Điều khách cảm nhận', 'What the strategist aspires the brand to stand for|||Điều nhà chiến lược mong thương hiệu đại diện', 'The sales figure|||Con số doanh thu', 'A legal term|||Thuật ngữ pháp lý'], 1, 'Identity is the sender side; image is the receiver side.|||Bản sắc là phía người gửi; hình ảnh là phía người nhận.'],
    ['Aaker\'s core identity is…|||Bản sắc cốt lõi của Aaker là…', ['Short-term promotion|||Khuyến mãi ngắn hạn', 'The timeless essence of the brand|||Tinh chất bất biến của thương hiệu', 'A price list|||Bảng giá', 'The logo only|||Chỉ logo'], 1, 'It remains stable across markets and products.|||Nó ổn định qua thị trường và sản phẩm.'],
    ['Which is NOT a facet of Kapferer\'s prism?|||Đâu KHÔNG phải mặt của lăng kính Kapferer?', ['Physique|||Thể chất', 'Reflection|||Phản chiếu', 'Relationship|||Quan hệ', 'Inventory|||Tồn kho'], 3, 'The six are physique, personality, culture, relationship, reflection, self-image.|||Sáu mặt là thể chất, tính cách, văn hoá, quan hệ, phản chiếu, tự hình dung.'],
    ['Which is one of J. Aaker\'s five personality dimensions?|||Đâu là một trong năm chiều tính cách của J. Aaker?', ['Sincerity|||Chân thành', 'Profitability|||Lợi nhuận', 'Frequency|||Tần suất', 'Distribution|||Phân phối'], 0, 'Sincerity, excitement, competence, sophistication, ruggedness.|||Chân thành, hứng khởi, năng lực, tinh tế, mạnh mẽ.'],
    ['A branded house means…|||Nhà thương hiệu nghĩa là…', ['Many unrelated names|||Nhiều tên không liên quan', 'One master brand across many offers|||Một thương hiệu mẹ trên nhiều sản phẩm', 'No brand name|||Không có tên', 'Only private labels|||Chỉ nhãn riêng'], 1, 'Efficient but a failure may hurt all.|||Hiệu quả nhưng một thất bại có thể hại tất cả.'],
    ['Toyota created Lexus separately mainly to…|||Toyota lập Lexus riêng chủ yếu để…', ['Cut costs|||Cắt chi phí', 'Avoid diluting mainstream image with a luxury position|||Tránh làm loãng hình ảnh đại chúng bằng vị thế xe sang', 'Avoid taxes|||Tránh thuế', 'Reduce advertising|||Giảm quảng cáo'], 1, 'Very different positions suggest separate brands.|||Vị thế quá khác nhau gợi ý tách thương hiệu.'],
    ['Cannibalization is…|||Cannibalization là…', ['Your brand taking sales from another of your brands|||Thương hiệu của bạn lấy doanh số từ thương hiệu khác của bạn', 'A trademark crime|||Tội về nhãn hiệu', 'A type of logo|||Một loại logo', 'A discount|||Một đợt giảm giá'], 0, 'It should be planned and monitored.|||Cần có kế hoạch và theo dõi.'],
    ['A brand with no distinctive role, low sales and no path to profit should usually be…|||Thương hiệu không vai trò khác biệt, doanh số thấp, không có đường đến lợi nhuận thường nên…', ['Kept forever|||Giữ mãi', 'Merged, harvested or retired|||Gộp, thu hoạch hoặc khai tử', 'Given more ads|||Cho thêm quảng cáo', 'Renamed monthly|||Đổi tên hằng tháng'], 1, 'Pruning frees resources for stronger brands.|||Cắt tỉa giải phóng nguồn lực cho thương hiệu mạnh.'],
  ]),
]));
// ===== Chương 6 =====
secs.push(SEC('Chapter 6 — Brand marketing programs and secondary associations', 'Chương 6 — Chương trình marketing thương hiệu và liên tưởng thứ cấp',
  'Sản phẩm – giá – kênh, truyền thông tích hợp (IMC), co-branding, người nổi tiếng, tài trợ, xuất xứ.', [
  D(P + '6-1', '6.1 Product, price and channel strategy for brands', '6.1 Chiến lược sản phẩm, giá và kênh cho thương hiệu', 'Chất lượng cảm nhận, trải nghiệm, chiến lược giá giá trị, kênh phân phối.', {
    n: '6.1',
    g: [['Link product design and experience to brand meaning', 'Gắn thiết kế sản phẩm và trải nghiệm với ý nghĩa thương hiệu'], ['Explain how price shapes perceived quality', 'Giải thích giá định hình chất lượng cảm nhận thế nào'], ['Describe direct and indirect channel effects on the brand', 'Mô tả tác động của kênh trực tiếp và gián tiếp lên thương hiệu']],
    b: [`<p>Keller says the product is the heart of brand equity: if it does not satisfy, no communication can fix it for long. A brand marketing programme aligns the 4Ps (product, price, place, promotion) with the positioning.</p>
<h4>Product</h4>
<ul><li><strong>Performance and quality</strong>: consistent delivery of the core benefit.</li>
<li><strong>Experience</strong>: the sum of every touchpoint: store layout, staff, app, delivery, after-sales. Customer experience is where most promises are tested.</li>
<li><strong>Services and guarantees</strong> that remove risk.</li></ul>
<h4>Price</h4>
<p>Consumers use price as a signal of quality, especially when they cannot judge quality themselves. Keller describes <em>value pricing</em>: setting prices to reflect perceived value, not just cost. Constant discounting trains customers to wait for sales and weakens premium positions; a stable price with occasional, clearly-signalled promotions protects the image. Compare three policies:</p>` +
tbl(['Policy', 'Effect on image', 'Use when'], [['Premium, stable', 'Reinforces quality', 'Strong POD and proof'], ['Everyday low price', 'Value and trust in fairness', 'Cost leadership'], ['High-low (frequent promotions)', 'Can signal "cheap"', 'Heavy competitive pressure; use carefully']]) +
`<h4>Place (channels)</h4>
<p>Selling through particular stores or platforms transfers their image to the brand. A beauty brand sold in a prestigious department store gains credibility; sold by street sellers with fake variants, it may lose it. Own channels (company stores, website, app) give the most control and data. Marketplaces give reach but compete on price and put your brand beside rivals. Choose channels on the basis of the target's shopping behaviour and the brand's image, and train partners on brand standards.</p>
<div class="meo"><strong>Check.</strong> For one brand, list the product, price, channel and message in four lines. Do all four support the same position?</div>`,
       `<p>Keller cho rằng sản phẩm là trái tim của giá trị thương hiệu: nếu không làm hài lòng, truyền thông nào cũng không cứu được lâu. Chương trình marketing thương hiệu căn chỉnh 4P (sản phẩm, giá, phân phối, xúc tiến) theo định vị.</p>
<h4>Sản phẩm</h4>
<ul><li><strong>Hiệu năng và chất lượng</strong>: giao ổn định lợi ích cốt lõi.</li>
<li><strong>Trải nghiệm</strong>: tổng mọi điểm chạm: bố trí cửa hàng, nhân viên, ứng dụng, giao hàng, hậu mãi. Trải nghiệm khách hàng là nơi hầu hết lời hứa được thử thách.</li>
<li><strong>Dịch vụ và bảo hành</strong> xoá rủi ro.</li></ul>
<h4>Giá</h4>
<p>Người tiêu dùng dùng giá như tín hiệu chất lượng, nhất là khi không tự đánh giá được chất lượng. Keller mô tả <em>định giá theo giá trị</em>: đặt giá phản ánh giá trị cảm nhận, không chỉ chi phí. Giảm giá liên tục dạy khách chờ khuyến mãi và làm yếu vị thế cao cấp; giá ổn định với khuyến mãi thỉnh thoảng, báo hiệu rõ ràng, bảo vệ hình ảnh. So sánh ba chính sách:</p>` +
tbl(['Chính sách', 'Tác động hình ảnh', 'Dùng khi'], [['Cao cấp, ổn định', 'Củng cố chất lượng', 'POD mạnh và có bằng chứng'], ['Giá thấp mỗi ngày', 'Giá trị và lòng tin về sự công bằng', 'Dẫn đầu chi phí'], ['Cao–thấp (khuyến mãi thường xuyên)', 'Có thể báo hiệu "rẻ"', 'Áp lực cạnh tranh lớn; dùng cẩn thận']]) +
`<h4>Phân phối (kênh)</h4>
<p>Bán qua cửa hàng hay nền tảng nào thì hình ảnh của nơi đó chuyển sang thương hiệu. Thương hiệu mỹ phẩm bán trong trung tâm thương mại danh tiếng được thêm uy tín; bán bởi người bán rong kèm hàng giả có thể mất nó. Kênh của mình (cửa hàng, website, ứng dụng) cho kiểm soát và dữ liệu nhiều nhất. Sàn thương mại cho độ phủ nhưng cạnh tranh về giá và đặt thương hiệu cạnh đối thủ. Chọn kênh dựa trên hành vi mua sắm của mục tiêu và hình ảnh thương hiệu, và huấn luyện đối tác theo chuẩn thương hiệu.</p>
<div class="meo"><strong>Kiểm.</strong> Với một thương hiệu, ghi sản phẩm, giá, kênh, thông điệp thành bốn dòng. Cả bốn có ủng hộ cùng một vị thế không?</div>`],
    pit: ['Letting channels follow volume only. A deep-discount marketplace listing can undo years of premium positioning.', 'Để kênh chạy theo sản lượng. Một gian hàng giảm sâu có thể huỷ nhiều năm định vị cao cấp.'],
    s: [['Product experience is the base of equity.', 'Trải nghiệm sản phẩm là nền của giá trị thương hiệu.'], ['Price signals quality; avoid constant discounting for premium brands.', 'Giá báo hiệu chất lượng; tránh giảm giá liên tục với thương hiệu cao cấp.'], ['Channels transfer their image to the brand.', 'Kênh chuyển hình ảnh của nó sang thương hiệu.']],
    l: ['mix', 'cx', 'priv', 'brand'],
    p: [['Why can constant discounts harm a premium brand?', 'Vì sao giảm giá liên tục có thể hại thương hiệu cao cấp?', 'Customers read price as quality and learn to wait for sales.', 'Khách đọc giá như chất lượng và học cách chờ khuyến mãi.'],
        ['Give one advantage and one risk of selling only on a marketplace.', 'Nêu một ưu điểm và một rủi ro khi chỉ bán trên sàn thương mại.', 'Advantage: reach. Risk: price competition and weak control over brand image.', 'Ưu điểm: độ phủ. Rủi ro: cạnh tranh giá và kiểm soát hình ảnh yếu.']] }),

  D(P + '6-2', '6.2 Integrated marketing communications for brands', '6.2 Truyền thông marketing tích hợp cho thương hiệu', 'Các công cụ truyền thông và sáu tiêu chí chọn bộ truyền thông của Keller.', {
    n: '6.2',
    g: [['List the main communication options', 'Liệt kê các lựa chọn truyền thông chính'], ['Apply Keller\'s six criteria to a media mix', 'Áp sáu tiêu chí của Keller vào bộ phương tiện'], ['Write a one-page integrated message plan', 'Viết kế hoạch thông điệp tích hợp một trang']],
    b: [`<p><strong>Integrated marketing communications (IMC)</strong> means coordinating all messages and media so that customers see one consistent story. The tools:</p>
<ul><li>Advertising (TV, video, print, outdoor, online).</li>
<li>Sales promotion (discounts, samples, contests).</li>
<li>Events and experiences, sponsorships.</li>
<li>Public relations and publicity.</li>
<li>Direct and database marketing, email, messaging apps.</li>
<li>Interactive and social marketing, content, search.</li>
<li>Word of mouth, personal selling.</li></ul>
<h4>Keller's six criteria for choosing the mix</h4>` +
tbl(['Criterion', 'Meaning'], [['Coverage', 'How much of the target is reached, and how much overlaps'], ['Contribution', 'Ability to create the desired response without other communications'], ['Commonality', 'Extent to which the same associations are reinforced across options'], ['Complementarity', 'Different options emphasise different associations and benefits'], ['Versatility', 'Works with different types of consumers (new or loyal)'], ['Cost', 'Total cost, with efficiency and effectiveness balanced']]) +
`<h4>Message architecture</h4>
<p>Write a short chain: <em>Who</em> we speak to → <em>one</em> main idea → three supporting points with proof → required tone → action we want. Then adapt the same idea to each channel instead of inventing new ideas per channel. The main idea should come from the positioning (Chapter 3).</p>
<h4>Awareness vs image vs response</h4>
<p>Match the tool to the stage: video and outdoor for broad awareness, content and PR for credibility, search and direct response for conversion. Track one measure per stage (reach, brand lift, sales).</p>
<div class="callout"><strong>Case thought.</strong> Compare how two coffee chains you know communicate: same message everywhere, or a different one on each platform? Note which is easier to recall.</div>`,
       `<p><strong>Truyền thông marketing tích hợp (IMC)</strong> là phối hợp mọi thông điệp và phương tiện để khách thấy một câu chuyện nhất quán. Các công cụ:</p>
<ul><li>Quảng cáo (TV, video, in ấn, ngoài trời, trực tuyến).</li>
<li>Khuyến mãi (giảm giá, dùng thử, cuộc thi).</li>
<li>Sự kiện và trải nghiệm, tài trợ.</li>
<li>Quan hệ công chúng và truyền thông báo chí.</li>
<li>Marketing trực tiếp và dữ liệu, email, ứng dụng nhắn tin.</li>
<li>Marketing tương tác và mạng xã hội, nội dung, tìm kiếm.</li>
<li>Truyền miệng, bán hàng trực tiếp.</li></ul>
<h4>Sáu tiêu chí chọn bộ truyền thông của Keller</h4>` +
tbl(['Tiêu chí', 'Ý nghĩa'], [['Độ phủ (coverage)', 'Tiếp cận bao nhiều mục tiêu, và bao nhiêu trùng lặp'], ['Đóng góp (contribution)', 'Khả năng tạo phản ứng mong muốn mà không cần truyền thông khác'], ['Chung (commonality)', 'Mức các lựa chọn củng cố cùng liên tưởng'], ['Bổ sung (complementarity)', 'Các lựa chọn nhấn các liên tưởng và lợi ích khác nhau'], ['Linh hoạt (versatility)', 'Hiệu quả với các loại khách khác nhau (mới hay trung thành)'], ['Chi phí (cost)', 'Tổng chi phí, cân bằng hiệu quả và hiệu suất']]) +
`<h4>Kiến trúc thông điệp</h4>
<p>Viết chuỗi ngắn: <em>Nói với ai</em> → <em>một</em> ý chính → ba ý hỗ trợ có bằng chứng → giọng điệu cần → hành động mong muốn. Rồi điều chỉnh cùng một ý cho từng kênh thay vì nghĩ ý mới cho mỗi kênh. Ý chính phải xuất phát từ định vị (Chương 3).</p>
<h4>Nhận biết, hình ảnh, phản ứng</h4>
<p>Khớp công cụ với giai đoạn: video và ngoài trời cho nhận biết rộng, nội dung và PR cho uy tín, tìm kiếm và phản hồi trực tiếp cho chuyển đổi. Theo dõi một chỉ số mỗi giai đoạn (tiếp cận, tăng nhận biết, doanh số).</p>
<div class="callout"><strong>Gợi ý tình huống.</strong> So sánh cách hai chuỗi cà phê bạn biết truyền thông: cùng một thông điệp ở mọi nơi, hay khác nhau trên từng nền tảng? Ghi lại cái nào dễ nhớ hơn.</div>`],
    pit: ['Letting each agency and platform team create its own tagline. Customers see disjointed messages and remember none.', 'Để mỗi agency và nhóm nền tảng tự đặt tagline. Khách thấy thông điệp rời rạc và không nhớ cái nào.'],
    s: [['IMC = one coordinated story across all tools.', 'IMC = một câu chuyện phối hợp qua mọi công cụ.'], ['Keller\'s six criteria: coverage, contribution, commonality, complementarity, versatility, cost.', 'Sáu tiêu chí Keller: độ phủ, đóng góp, chung, bổ sung, linh hoạt, chi phí.'], ['One main idea adapted to each channel.', 'Một ý chính điều chỉnh cho từng kênh.']],
    l: ['imc', 'content', 'wom', 'ana'],
    p: [['Which criterion asks whether channels reinforce the same associations?', 'Tiêu chí nào hỏi các kênh có củng cố cùng liên tưởng không?', 'Commonality.', 'Chung (commonality).'],
        ['Why start a message plan from one main idea?', 'Vì sao bắt đầu kế hoạch thông điệp từ một ý chính?', 'Repetition of one idea builds a strong association; many ideas dilute it.', 'Lặp một ý tạo liên tưởng mạnh; nhiều ý làm loãng.']] }),

  D(P + '6-3', '6.3 Leveraging secondary associations', '6.3 Khai thác liên tưởng thứ cấp', 'Co-branding, thương hiệu thành phần, cấp phép, người nổi tiếng, tài trợ, xuất xứ.', {
    n: '6.3',
    g: [['Define secondary brand associations', 'Định nghĩa liên tưởng thương hiệu thứ cấp'], ['Compare co-branding, ingredient branding, licensing, endorsement and sponsorship', 'So sánh đồng thương hiệu, thương hiệu thành phần, cấp phép, bảo chứng và tài trợ'], ['Evaluate the risks of borrowing equity', 'Đánh giá rủi ro khi mượn giá trị']],
    b: [`<p>A brand can borrow meaning by linking to another entity: a company, a person, a place, an event. These are <strong>secondary associations</strong>. They "leverage" existing knowledge instead of building it from zero.</p>` +
tbl(['Source', 'How it works', 'Example'], [['Co-branding', 'Two brands on one product', 'Sports brand with a tech brand to launch a product'], ['Ingredient branding', 'A component brand promoted on its own', 'A chip brand on laptops (Intel)'], ['Licensing', 'Brand name rented to products by others', 'Characters or fashion names on merchandise'], ['Celebrities / endorsers', 'A person lends credibility and attention', 'Athletes and artists (Nike with athletes)'], ['Sponsorship / events', 'Association with an event or cause', 'Red Bull with extreme sports'], ['Country / place of origin', 'Image of the country transfers', 'Swiss precision, Japanese reliability, Vietnamese coffee'], ['Third-party endorsements', 'Awards, certifications, reviews', 'Quality marks, expert awards']]) +
`<h4>Selecting a partner</h4>
<ol><li>Awareness and image: does the partner have positive, relevant equity?</li>
<li>Fit: a logical match with the brand's position and personality.</li>
<li>Reach: does the partner help with the target segment?</li>
<li>Risk: reputation risk, exclusivity, contract duration, exit clauses.</li></ol>
<h4>Risks</h4>
<ul><li><strong>Negative spillover</strong>: scandal or product failure of a partner harms your brand. Include a morals clause and monitor.</li>
<li><strong>Overshadowing</strong>: the celebrity is remembered, the brand is forgotten.</li>
<li><strong>Overuse</strong>: the same endorser for many brands loses credibility.</li>
<li><strong>Dilution of control</strong>: licensors lose control if product quality of licensees differs.</li></ul>
<h4>Case thinking: Vietnamese context</h4>
<p>Vietnamese brands often use national sports teams, music festivals, and popular artists. Before copying, ask: is the link believable for our product, and does our own product deliver after attention is won? Consult the Wikipedia pages for Celebrity branding and Co-branding for definitions, then analyse a local campaign you have seen using the table above.</p>
<div class="callout"><strong>Disclosure.</strong> Paid endorsements generally must be disclosed to consumers; see Chapter 9.</div>`,
       `<p>Thương hiệu có thể mượn ý nghĩa bằng cách liên kết với thực thể khác: công ty, con người, địa danh, sự kiện. Đó là <strong>liên tưởng thứ cấp</strong>. Chúng "khai thác" tri thức sẵn có thay vì xây từ con số không.</p>` +
tbl(['Nguồn', 'Cách hoạt động', 'Ví dụ'], [['Đồng thương hiệu', 'Hai thương hiệu trên một sản phẩm', 'Hãng thể thao hợp tác hãng công nghệ ra sản phẩm'], ['Thương hiệu thành phần', 'Linh kiện được quảng bá riêng', 'Thương hiệu chip trên laptop (Intel)'], ['Cấp phép', 'Cho thuê tên thương hiệu cho sản phẩm của bên khác', 'Nhân vật hay tên thời trang trên hàng lưu niệm'], ['Người nổi tiếng / bảo chứng', 'Một người cho mượn uy tín và sự chú ý', 'Vận động viên, nghệ sĩ (Nike với các vận động viên)'], ['Tài trợ / sự kiện', 'Gắn với sự kiện hay mục đích', 'Red Bull với thể thao mạo hiểm'], ['Quốc gia / nơi xuất xứ', 'Hình ảnh quốc gia chuyển sang', 'Chính xác Thuỵ Sĩ, đáng tin Nhật, cà phê Việt Nam'], ['Chứng thực bên thứ ba', 'Giải thưởng, chứng nhận, đánh giá', 'Dấu chất lượng, giải thưởng chuyên gia']]) +
`<h4>Chọn đối tác</h4>
<ol><li>Nhận biết và hình ảnh: đối tác có giá trị dương và liên quan không?</li>
<li>Độ khớp: hợp logic với vị thế và tính cách thương hiệu.</li>
<li>Tiếp cận: đối tác có giúp với phân khúc mục tiêu không?</li>
<li>Rủi ro: danh tiếng, độc quyền, thời hạn hợp đồng, điều khoản thoát.</li></ol>
<h4>Rủi ro</h4>
<ul><li><strong>Lan truyền tiêu cực</strong>: bê bối hay sản phẩm hỏng của đối tác hại thương hiệu bạn. Đưa điều khoản đạo đức và theo dõi.</li>
<li><strong>Lấn át</strong>: người ta nhớ người nổi tiếng, quên thương hiệu.</li>
<li><strong>Dùng quá nhiều</strong>: cùng một người bảo chứng cho nhiều thương hiệu mất uy tín.</li>
<li><strong>Mất kiểm soát</strong>: bên cấp phép mất kiểm soát nếu chất lượng sản phẩm của bên nhận khác nhau.</li></ul>
<h4>Suy nghĩ tình huống: bối cảnh Việt Nam</h4>
<p>Thương hiệu Việt thường dùng đội tuyển thể thao quốc gia, lễ hội âm nhạc và nghệ sĩ nổi tiếng. Trước khi bắt chước, hỏi: liên kết có đáng tin với sản phẩm của ta không, và sản phẩm của ta có đáp ứng sau khi giành được sự chú ý không? Xem các trang Wikipedia về Celebrity branding và Co-branding để lấy định nghĩa, rồi phân tích một chiến dịch địa phương bạn từng thấy bằng bảng trên.</p>
<div class="callout"><strong>Công khai.</strong> Bảo chứng có trả tiền nhìn chung phải được công khai với người tiêu dùng; xem Chương 9.</div>`],
    pit: ['Picking a famous face only for reach. If the fit is weak, people recall the celebrity and not the brand.', 'Chọn gương mặt nổi tiếng chỉ vì độ phủ. Nếu độ khớp yếu, người ta nhớ người nổi tiếng chứ không nhớ thương hiệu.'],
    s: [['Secondary associations let a brand borrow equity from partners, people, places and events.', 'Liên tưởng thứ cấp cho thương hiệu mượn giá trị từ đối tác, con người, địa danh, sự kiện.'], ['Choose partners on awareness, fit, reach and risk.', 'Chọn đối tác theo nhận biết, độ khớp, tiếp cận và rủi ro.'], ['Plan for negative spillover.', 'Lường trước lan truyền tiêu cực.']],
    l: ['cobrand', 'ingr', 'lic', 'celeb', 'spons', 'coo'],
    p: [['What is ingredient branding? Give a one-line example.', 'Thương hiệu thành phần là gì? Cho ví dụ một dòng.', 'Promoting a component brand separately, such as Intel on laptops.', 'Quảng bá riêng thương hiệu của linh kiện, như Intel trên laptop.'],
        ['Name two risks of celebrity endorsement.', 'Nêu hai rủi ro của bảo chứng bằng người nổi tiếng.', 'Negative spillover from scandal; overshadowing the brand; overuse.', 'Lan truyền tiêu cực khi có bê bối; lấn át thương hiệu; dùng quá nhiều.']] }),

  Q(P + 'quiz-6', 'Chapter 6 quiz — Marketing programs and secondary associations', 'Quiz Chương 6 — Chương trình marketing và liên tưởng thứ cấp', [
    ['Why is the product called the heart of brand equity?|||Vì sao sản phẩm được gọi là trái tim của giá trị thương hiệu?', ['Communication can fix a poor product for long|||Truyền thông có thể cứu sản phẩm kém lâu dài', 'If it does not satisfy, communication cannot repair it for long|||Nếu không làm hài lòng, truyền thông không cứu được lâu', 'Because price does not matter|||Vì giá không quan trọng', 'Because logos are cheap|||Vì logo rẻ'], 1, 'Experience tests the promise.|||Trải nghiệm thử thách lời hứa.'],
    ['Constant deep discounting mostly…|||Giảm giá sâu liên tục chủ yếu…', ['Strengthens premium image|||Củng cố hình ảnh cao cấp', 'Trains customers to wait for sales|||Dạy khách chờ khuyến mãi', 'Raises trademark value|||Tăng giá trị nhãn hiệu', 'Improves quality|||Cải thiện chất lượng'], 1, 'Price is also a quality signal.|||Giá cũng là tín hiệu chất lượng.'],
    ['Selling through a prestigious store usually…|||Bán qua cửa hàng danh giá thường…', ['Transfers some of the store\'s image to the brand|||Chuyển một phần hình ảnh cửa hàng sang thương hiệu', 'Has no effect|||Không tác động', 'Lowers awareness|||Giảm nhận biết', 'Prevents registration|||Ngăn đăng ký'], 0, 'Channels lend (or take) credibility.|||Kênh cho mượn (hoặc lấy đi) uy tín.'],
    ['IMC means…|||IMC nghĩa là…', ['Individual media costs|||Chi phí phương tiện riêng lẻ', 'Coordinating all messages and media into one consistent story|||Phối hợp mọi thông điệp và phương tiện thành một câu chuyện nhất quán', 'Internet marketing campaigns only|||Chỉ chiến dịch marketing internet', 'Inventory management|||Quản lý tồn kho'], 1, 'Consistency across tools.|||Nhất quán qua các công cụ.'],
    ['Which is one of Keller\'s six IMC criteria?|||Đâu là một trong sáu tiêu chí IMC của Keller?', ['Commonality|||Chung (commonality)', 'Capacity|||Công suất', 'Carbon|||Carbon', 'Currency|||Tiền tệ'], 0, 'Also coverage, contribution, complementarity, versatility, cost.|||Còn có độ phủ, đóng góp, bổ sung, linh hoạt, chi phí.'],
    ['Intel branding on laptops is an example of…|||Thương hiệu Intel trên laptop là ví dụ của…', ['Ingredient branding|||Thương hiệu thành phần', 'House of brands|||Nhà của các thương hiệu', 'Cannibalization|||Cannibalization', 'Rebranding|||Đổi diện mạo'], 0, 'A component brand promoted to the end customer.|||Thương hiệu linh kiện được quảng bá tới khách cuối.'],
    ['"Negative spillover" in endorsements means…|||"Lan truyền tiêu cực" trong bảo chứng nghĩa là…', ['A partner scandal harms your brand|||Bê bối của đối tác hại thương hiệu của bạn', 'Costs go down|||Chi phí giảm', 'Sales rise|||Doanh số tăng', 'Trademark expires|||Nhãn hiệu hết hạn'], 0, 'Use clauses and monitoring.|||Dùng điều khoản và theo dõi.'],
    ['A key question when choosing an endorser is…|||Câu hỏi then chốt khi chọn người bảo chứng là…', ['Does the fit and credibility match our brand?|||Độ khớp và uy tín có phù hợp thương hiệu không?', 'Is the endorser the cheapest?|||Người đó có rẻ nhất không?', 'Is the endorser famous in any field?|||Người đó có nổi tiếng ở lĩnh vực bất kỳ không?', 'Is the endorser new?|||Người đó có mới không?'], 0, 'Fit and credibility drive transfer of meaning.|||Độ khớp và uy tín quyết định việc chuyển ý nghĩa.'],
  ]),
]));
// ===== Chương 7 =====
secs.push(SEC('Chapter 7 — Measuring brand performance', 'Chương 7 — Đo lường hiệu quả thương hiệu',
  'Kiểm toán thương hiệu, chỉ số sức khoẻ thương hiệu, định giá thương hiệu và đọc báo cáo xếp hạng.', [
  D(P + '7-1', '7.1 Brand audit and brand inventory', '7.1 Kiểm toán thương hiệu và kiểm kê thương hiệu', 'Brand inventory, brand exploratory, báo cáo kiểm toán và hành động.', {
    n: '7.1',
    g: [['Define a brand audit', 'Định nghĩa kiểm toán thương hiệu'], ['Build a brand inventory', 'Lập bản kiểm kê thương hiệu'], ['Plan a small exploratory study of customer perceptions', 'Lập kế hoạch một nghiên cứu khám phá nhỏ về nhận thức khách hàng']],
    b: [`<p>A <strong>brand audit</strong> is a comprehensive examination of a brand's health: its sources of equity, and how to improve and leverage it. Keller splits the audit in two.</p>
<h4>Brand inventory (supply side)</h4>
<p>A current, complete profile of how all products and services are marketed and branded: names, logos, packaging, prices, channels, communication, trademarks, the competition's equivalent. Practical steps:</p>
<ol><li>List every product and its brand elements, with screenshots and photos.</li>
<li>Record price, distribution and positioning statements.</li>
<li>Collect all recent campaigns and customer touchpoints.</li>
<li>Review trademark status and any disputes.</li>
<li>Do the same for 2–3 main competitors.</li></ol>
<h4>Brand exploratory (demand side)</h4>
<p>Research on what consumers think and feel. Methods: <em>free association</em> ("what comes to mind when you hear this brand?"), projective techniques ("if this brand were a person…"), in-depth interviews, focus groups, and then a quantitative survey for awareness and image measures. Start qualitative to find the right words; then quantify.</p>
<h4>Output</h4>` +
tbl(['Section', 'Content'], [['Findings', 'Strengths, weaknesses, opportunities, threats of the brand'], ['Gaps', 'Differences between intended identity and perceived image'], ['Priorities', '3–5 actions, owner, cost, deadline'], ['Metrics', 'Which numbers will show improvement']]) +
`<div class="meo"><strong>Mini-project.</strong> Audit the website, social pages and shop of one local brand (for example a Vietnamese beverage or fashion brand) in 90 minutes. Capture 10 findings and 3 priorities. This could be the base of a course assignment.</div>`,
       `<p><strong>Kiểm toán thương hiệu</strong> là cuộc khảo sát toàn diện sức khoẻ thương hiệu: nguồn giá trị, cách cải thiện và khai thác. Keller chia kiểm toán làm hai.</p>
<h4>Kiểm kê thương hiệu (phía cung)</h4>
<p>Hồ sơ đầy đủ, cập nhật về cách mọi sản phẩm và dịch vụ được marketing và đặt thương hiệu: tên, logo, bao bì, giá, kênh, truyền thông, nhãn hiệu, và tương đương của đối thủ. Các bước thực tế:</p>
<ol><li>Liệt kê mọi sản phẩm và yếu tố thương hiệu, kèm ảnh chụp màn hình.</li>
<li>Ghi giá, phân phối và tuyên bố định vị.</li>
<li>Thu thập mọi chiến dịch và điểm chạm khách hàng gần đây.</li>
<li>Rà soát tình trạng nhãn hiệu và tranh chấp (nếu có).</li>
<li>Làm tương tự cho 2–3 đối thủ chính.</li></ol>
<h4>Khám phá thương hiệu (phía cầu)</h4>
<p>Nghiên cứu về điều người tiêu dùng nghĩ và cảm. Phương pháp: <em>liên tưởng tự do</em> ("nghe thương hiệu này bạn nghĩ gì?"), kỹ thuật phóng chiếu ("nếu thương hiệu này là một người…"), phỏng vấn sâu, thảo luận nhóm, rồi khảo sát định lượng đo nhận biết và hình ảnh. Bắt đầu định tính để tìm đúng từ ngữ; sau đó định lượng.</p>
<h4>Kết quả</h4>` +
tbl(['Phần', 'Nội dung'], [['Phát hiện', 'Điểm mạnh, yếu, cơ hội, thách thức của thương hiệu'], ['Khoảng cách', 'Chênh giữa bản sắc dự định và hình ảnh cảm nhận'], ['Ưu tiên', '3–5 hành động, người phụ trách, chi phí, hạn chót'], ['Chỉ số', 'Con số nào sẽ cho thấy cải thiện']]) +
`<div class="meo"><strong>Dự án nhỏ.</strong> Kiểm toán website, trang mạng xã hội và cửa hàng của một thương hiệu địa phương (ví dụ thương hiệu đồ uống hay thời trang Việt) trong 90 phút. Ghi 10 phát hiện và 3 ưu tiên. Có thể là nền của bài tập môn học.</div>`],
    pit: ['Auditing only your own materials. Without the exploratory part you cannot know whether customers see what you intended.', 'Chỉ kiểm toán tài liệu của mình. Thiếu phần khám phá, bạn không biết khách có thấy điều bạn dự định không.'],
    s: [['Audit = inventory (supply) + exploratory (demand).', 'Kiểm toán = kiểm kê (cung) + khám phá (cầu).'], ['Start qualitative, then quantify.', 'Bắt đầu định tính rồi định lượng.'], ['Output: findings, gaps, priorities, metrics.', 'Đầu ra: phát hiện, khoảng cách, ưu tiên, chỉ số.']],
    l: ['mgmt', 'keller', 'pmap', 'cb'],
    p: [['Which half of the audit looks at consumer perceptions?', 'Nửa nào của kiểm toán xem nhận thức người tiêu dùng?', 'The brand exploratory (demand side).', 'Khám phá thương hiệu (phía cầu).'],
        ['Give two qualitative methods used in the exploratory.', 'Nêu hai phương pháp định tính trong phần khám phá.', 'Free association, interviews, focus groups, projective techniques.', 'Liên tưởng tự do, phỏng vấn, thảo luận nhóm, kỹ thuật phóng chiếu.']] }),

  D(P + '7-2', '7.2 Brand health metrics and tracking', '7.2 Chỉ số sức khoẻ thương hiệu và theo dõi', 'Phễu thương hiệu, NPS, theo dõi định kỳ, kết hợp dữ liệu.', {
    n: '7.2',
    g: [['List common brand health metrics', 'Liệt kê các chỉ số sức khoẻ thương hiệu thường dùng'], ['Interpret a brand funnel', 'Diễn giải phễu thương hiệu'], ['Compute and read an NPS', 'Tính và đọc NPS']],
    b: [`<p>Brand tracking repeats the same survey at set intervals (for example every quarter) with comparable samples so changes can be seen. Typical metrics:</p>
<h4>Brand funnel</h4>` +
tbl(['Stage', 'Survey question (example)'], [['Unaided awareness', '"Which coffee chains can you name?"'], ['Aided awareness', '"Have you heard of Brand X?"'], ['Consideration', '"Would you consider buying X?"'], ['Preference', '"Which one do you prefer?"'], ['Purchase / usage', '"Which have you bought in the past month?"'], ['Loyalty / advocacy', '"Would you recommend X?"']]) +
`<p>Look at the <em>conversion</em> between stages. High awareness but low consideration signals an image or relevance problem, not a reach problem.</p>
<h4>Net Promoter Score (NPS)</h4>
<p>Ask "How likely are you to recommend us to a friend or colleague?" on a 0–10 scale. Promoters answer 9–10, passives 7–8, detractors 0–6.</p>
<div class="formula"><span class="lbl">NPS</span>NPS = % promoters − % detractors</div>
<p>Worked example: of 200 customers, 90 are promoters (45%), 70 passives (35%), 40 detractors (20%). NPS = 45 − 20 = <strong>+25</strong>. NPS is a simple trend signal; it does not explain <em>why</em>, so always add an open question.</p>
<h4>Other signals</h4>
<ul><li>Search volume for the brand name; share of search against competitors.</li>
<li>Social metrics: mentions, sentiment, engagement (treat likes with care).</li>
<li>Sales data: price premium vs category average, repeat rate, share of wallet.</li>
<li>Customer satisfaction and complaint rates.</li></ul>
<div class="callout"><strong>Good practice.</strong> Track few metrics, consistently, with the same wording; compare with competitors; link each metric to an action owner.</div>`,
       `<p>Theo dõi thương hiệu là lặp lại cùng một khảo sát theo định kỳ (ví dụ mỗi quý) với mẫu so sánh được để thấy thay đổi. Các chỉ số điển hình:</p>
<h4>Phễu thương hiệu</h4>` +
tbl(['Giai đoạn', 'Câu hỏi khảo sát (ví dụ)'], [['Nhận biết không gợi ý', '"Bạn kể được những chuỗi cà phê nào?"'], ['Nhận biết có gợi ý', '"Bạn đã nghe về thương hiệu X chưa?"'], ['Cân nhắc', '"Bạn có cân nhắc mua X không?"'], ['Ưa thích', '"Bạn thích thương hiệu nào hơn?"'], ['Mua / sử dụng', '"Tháng qua bạn đã mua những thương hiệu nào?"'], ['Trung thành / giới thiệu', '"Bạn có giới thiệu X không?"']]) +
`<p>Hãy nhìn <em>tỷ lệ chuyển</em> giữa các giai đoạn. Nhận biết cao mà cân nhắc thấp cho thấy vấn đề hình ảnh hay mức liên quan, không phải vấn đề độ phủ.</p>
<h4>Net Promoter Score (NPS)</h4>
<p>Hỏi "Bạn có khả năng giới thiệu chúng tôi cho bạn bè hay đồng nghiệp đến đâu?" trên thang 0–10. Người ủng hộ trả lời 9–10, trung lập 7–8, chỉ trích 0–6.</p>
<div class="formula"><span class="lbl">NPS</span>NPS = % người ủng hộ − % người chỉ trích</div>
<p>Ví dụ: trong 200 khách, 90 người ủng hộ (45%), 70 trung lập (35%), 40 chỉ trích (20%). NPS = 45 − 20 = <strong>+25</strong>. NPS là tín hiệu xu hướng đơn giản; nó không giải thích <em>vì sao</em>, nên luôn thêm câu hỏi mở.</p>
<h4>Tín hiệu khác</h4>
<ul><li>Lượng tìm kiếm tên thương hiệu; thị phần tìm kiếm so với đối thủ.</li>
<li>Chỉ số mạng xã hội: lượt nhắc, cảm xúc, tương tác (thận trọng với lượt thích).</li>
<li>Dữ liệu bán hàng: giá cao hơn trung bình ngành, tỷ lệ mua lại, thị phần chi tiêu.</li>
<li>Mức hài lòng và tỷ lệ khiếu nại.</li></ul>
<div class="callout"><strong>Thực hành tốt.</strong> Theo dõi ít chỉ số, nhất quán, cùng cách hỏi; so với đối thủ; gắn mỗi chỉ số với người chịu trách nhiệm hành động.</div>`],
    pit: ['Changing the survey wording or sample each quarter, then reporting a "trend".', 'Đổi cách hỏi hoặc mẫu mỗi quý rồi báo cáo một "xu hướng".'],
    s: [['Funnel: unaided awareness → aided → consideration → preference → purchase → advocacy.', 'Phễu: nhận biết không gợi ý → có gợi ý → cân nhắc → ưa thích → mua → giới thiệu.'], ['NPS = % promoters − % detractors.', 'NPS = % người ủng hộ − % người chỉ trích.'], ['Keep wording and sample comparable over time.', 'Giữ cách hỏi và mẫu so sánh được theo thời gian.']],
    l: ['nps', 'aware', 'csat', 'engage'],
    p: [['A survey shows 50% promoters, 30% passives, 20% detractors. NPS?', 'Khảo sát có 50% người ủng hộ, 30% trung lập, 20% chỉ trích. NPS?', '50 − 20 = +30.', '50 − 20 = +30.'],
        ['Awareness is 80% but consideration only 10%. What is the likely problem?', 'Nhận biết 80% nhưng cân nhắc chỉ 10%. Vấn đề có lẽ là gì?', 'Image or relevance, not reach.', 'Hình ảnh hoặc mức liên quan, không phải độ phủ.']] }),

  D(P + '7-3', '7.3 Brand valuation and ranking reports', '7.3 Định giá thương hiệu và báo cáo xếp hạng', 'Cách các tổ chức định giá thương hiệu và đọc phê phán.', {
    n: '7.3',
    g: [['Explain why and how brands are valued', 'Giải thích vì sao và cách định giá thương hiệu'], ['Name the main published ranking providers', 'Gọi tên các tổ chức xếp hạng công bố chính'], ['Read a ranking critically', 'Đọc một bảng xếp hạng một cách phê phán']],
    b: [`<p>Brand valuation estimates the financial value of a brand, for uses such as mergers and acquisitions, licensing, accounting, tax planning, and board-level reporting. It differs from customer-based equity but depends on it.</p>
<h4>Common approaches</h4>` +
tbl(['Approach', 'Idea'], [['Cost', 'What it would cost to recreate the brand (often weak: past spend is not value)'], ['Market', 'Compare to prices paid for similar brands'], ['Income (royalty relief)', 'Estimate the royalties you would pay if you licensed the brand, and discount them to present value'], ['Brand contribution', 'Separate the part of earnings caused by the brand from other drivers (product, price, distribution), then discount the future']]) +
`<h4>Published rankings</h4>
<p>Interbrand (Best Global Brands), Kantar BrandZ and Brand Finance each publish annual reports using their own methodology, mixing financial analysis with consumer research and a brand strength score. Their methods and numbers differ, so rankings are not identical. Open their sites to read the methodology page before quoting any figure.</p>
<h4>Reading critically</h4>
<ul><li>Rankings are estimates built on assumptions; compare year over year within the same provider.</li>
<li>Different providers produce different values for the same brand. Quote the source, year, and currency.</li>
<li>A big number does not tell you which brand-building action worked.</li>
<li>Do not invent numbers: in your assignments cite the publisher's page or report with the date.</li></ul>
<h4>Link back to management</h4>
<p>Use valuation to prioritise investment and to explain the value of marketing to finance colleagues, but run management by customer metrics (Lesson 7.2), which show causes.</p>`,
       `<p>Định giá thương hiệu ước tính giá trị tài chính của thương hiệu, phục vụ sáp nhập và mua lại, cấp phép, kế toán, hoạch định thuế và báo cáo hội đồng. Nó khác với giá trị dựa trên khách hàng nhưng phụ thuộc vào đó.</p>
<h4>Các cách tiếp cận thường gặp</h4>` +
tbl(['Cách', 'Ý tưởng'], [['Chi phí', 'Chi phí để tạo lại thương hiệu (thường yếu: chi tiêu quá khứ không phải giá trị)'], ['Thị trường', 'So với giá đã trả cho thương hiệu tương tự'], ['Thu nhập (tiền bản quyền được miễn)', 'Ước tính tiền bản quyền sẽ phải trả nếu đi thuê thương hiệu, rồi chiết khấu về hiện tại'], ['Đóng góp của thương hiệu', 'Tách phần lợi nhuận do thương hiệu khỏi các yếu tố khác (sản phẩm, giá, phân phối), rồi chiết khấu tương lai']]) +
`<h4>Bảng xếp hạng công bố</h4>
<p>Interbrand (Best Global Brands), Kantar BrandZ và Brand Finance mỗi nơi công bố báo cáo hằng năm theo phương pháp riêng, kết hợp phân tích tài chính, nghiên cứu người tiêu dùng và điểm sức mạnh thương hiệu. Phương pháp và con số khác nhau nên bảng xếp hạng không giống nhau. Hãy mở trang của họ đọc phần phương pháp trước khi trích bất kỳ số liệu nào.</p>
<h4>Đọc phê phán</h4>
<ul><li>Xếp hạng là ước tính dựa trên giả định; so sánh qua các năm trong cùng một tổ chức.</li>
<li>Các tổ chức cho giá trị khác nhau cho cùng một thương hiệu. Ghi nguồn, năm và đơn vị tiền tệ.</li>
<li>Con số lớn không cho biết hành động xây dựng thương hiệu nào hiệu quả.</li>
<li>Đừng bịa số: trong bài tập hãy trích trang hay báo cáo của đơn vị công bố kèm ngày.</li></ul>
<h4>Nối về quản trị</h4>
<p>Dùng định giá để ưu tiên đầu tư và giải thích giá trị marketing với đồng nghiệp tài chính, nhưng điều hành bằng chỉ số khách hàng (Bài 7.2) vì chúng cho thấy nguyên nhân.</p>`],
    pit: ['Quoting a ranking number from a social media post without the source or year.', 'Trích con số xếp hạng từ bài đăng mạng xã hội mà không có nguồn hoặc năm.'],
    s: [['Valuation approaches: cost, market, income/royalty relief, brand contribution.', 'Cách định giá: chi phí, thị trường, thu nhập/bản quyền miễn trừ, đóng góp thương hiệu.'], ['Providers use different methods; cite source and year.', 'Các tổ chức dùng phương pháp khác nhau; ghi nguồn và năm.'], ['Run management on customer metrics.', 'Điều hành bằng chỉ số khách hàng.']],
    l: ['valu', 'interbrand', 'brandz', 'bfin'],
    p: [['Why is the cost approach often weak?', 'Vì sao cách tiếp cận chi phí thường yếu?', 'Past spending does not equal current customer value.', 'Chi tiêu quá khứ không bằng giá trị khách hàng hiện tại.'],
        ['Why should you read the methodology page before using a ranking figure?', 'Vì sao nên đọc phần phương pháp trước khi dùng số liệu xếp hạng?', 'Methods and assumptions differ, so figures are not comparable across providers.', 'Phương pháp và giả định khác nhau nên số liệu không so được giữa các tổ chức.']] }),

  Q(P + 'quiz-7', 'Chapter 7 quiz — Measuring brand performance', 'Quiz Chương 7 — Đo lường hiệu quả thương hiệu', [
    ['A brand audit has which two parts?|||Kiểm toán thương hiệu gồm hai phần nào?', ['Inventory and exploratory|||Kiểm kê và khám phá', 'Logo and slogan|||Logo và slogan', 'Price and place|||Giá và phân phối', 'Sales and tax|||Doanh số và thuế'], 0, 'Supply side and demand side.|||Phía cung và phía cầu.'],
    ['Free association is…|||Liên tưởng tự do là…', ['A pricing method|||Phương pháp định giá', 'Asking what comes to mind about a brand|||Hỏi điều gì hiện ra trong đầu về thương hiệu', 'A legal term|||Thuật ngữ pháp lý', 'A distribution plan|||Kế hoạch phân phối'], 1, 'It is a qualitative research technique.|||Đó là kỹ thuật nghiên cứu định tính.'],
    ['Unaided awareness asks…|||Nhận biết không gợi ý hỏi…', ['"Have you heard of X?"|||"Bạn đã nghe về X chưa?"', '"Which brands in this category can you name?"|||"Bạn kể được thương hiệu nào trong ngành này?"', '"Do you love X?"|||"Bạn có yêu X không?"', '"Will you buy X?"|||"Bạn sẽ mua X chứ?"'], 1, 'No brand names are shown.|||Không đưa ra tên thương hiệu nào.'],
    ['Promoters score…|||Người ủng hộ cho điểm…', ['0–6', '7–8', '9–10', '5–6'], 2, 'On NPS: 9–10 promoters, 7–8 passives, 0–6 detractors.|||Theo NPS: 9–10 ủng hộ, 7–8 trung lập, 0–6 chỉ trích.'],
    ['NPS = ?|||NPS = ?', ['% promoters − % detractors|||% người ủng hộ − % người chỉ trích', '% promoters + % detractors|||% người ủng hộ + % người chỉ trích', '% passives − % promoters|||% trung lập − % người ủng hộ', 'Average score|||Điểm trung bình'], 0, 'Passives are ignored in the formula.|||Công thức bỏ qua nhóm trung lập.'],
    ['High awareness but low consideration suggests…|||Nhận biết cao nhưng cân nhắc thấp gợi ý…', ['A reach problem|||Vấn đề độ phủ', 'An image or relevance problem|||Vấn đề hình ảnh hay mức liên quan', 'A packaging problem only|||Chỉ vấn đề bao bì', 'No problem|||Không có vấn đề'], 1, 'People know you but do not see you as for them.|||Người ta biết bạn nhưng không thấy bạn dành cho họ.'],
    ['Which is NOT a valuation approach?|||Cái nào KHÔNG phải cách định giá?', ['Cost|||Chi phí', 'Market|||Thị trường', 'Income/royalty relief|||Thu nhập/bản quyền miễn trừ', 'Coin toss|||Tung đồng xu'], 3, 'Standard approaches are cost, market and income-based.|||Các cách chuẩn là chi phí, thị trường và dựa trên thu nhập.'],
    ['When quoting a ranking, you should…|||Khi trích bảng xếp hạng, bạn nên…', ['Cite source, year and methodology|||Ghi nguồn, năm và phương pháp', 'Round it to a nice number|||Làm tròn cho đẹp', 'Mix providers freely|||Trộn các tổ chức tuỳ ý', 'Omit the source|||Bỏ nguồn'], 0, 'Providers differ in method and assumptions.|||Các tổ chức khác nhau về phương pháp và giả định.'],
  ]),
]));
// ===== Chương 8 =====
secs.push(SEC('Chapter 8 — Growing and sustaining brand equity', 'Chương 8 — Tăng trưởng và duy trì giá trị thương hiệu',
  'Mở rộng thương hiệu, làm mới và tái thiết, thương hiệu quốc tế.', [
  D(P + '8-1', '8.1 Brand extensions', '8.1 Mở rộng thương hiệu', 'Line extension vs category extension, điều kiện thành công, rủi ro dilution và cannibalization.', {
    n: '8.1',
    g: [['Distinguish line extensions from category extensions', 'Phân biệt mở rộng dòng với mở rộng ngành'], ['Apply a checklist for extension success', 'Áp dụng bảng kiểm thành công của mở rộng'], ['Identify risks: dilution and cannibalization', 'Nhận ra rủi ro: làm mờ và tự ăn thị phần']],
    b: [`<p>A <strong>brand extension</strong> uses an established brand name to launch a new product. Two main types:</p>
<ul><li><strong>Line extension</strong>: new flavours, sizes or variants in the same category (a new milk flavour).</li>
<li><strong>Category extension</strong>: a new product category (a dairy brand launching a drink in another segment).</li></ul>
<h4>Why extend</h4>
<p>Lower launch cost (awareness already exists), lower perceived risk for consumers, and positive feedback to the parent if it goes well. Most new products use existing names for this reason.</p>
<h4>Success checklist</h4>
<ol><li><strong>Parent brand quality and awareness</strong>: strong, positive equity.</li>
<li><strong>Fit</strong>: the extension seems logical (shared expertise, similar use, similar image). Fit can be based on product features or on the brand concept (a "prestige" or "healthy" image can travel across categories).</li>
<li><strong>Relevant POD</strong> in the new category: the parent's associations must matter there.</li>
<li><strong>Quality delivered</strong>: a weak extension damages the parent.</li>
<li><strong>Marketing support</strong>: do not assume the name sells itself.</li></ol>
<h4>Risks</h4>` +
tbl(['Risk', 'What happens'], [['Dilution', 'Too many unrelated extensions blur what the brand stands for'], ['Cannibalization', 'The new product takes sales from the parent'], ['Reciprocal harm', 'Failure of the extension weakens the parent'], ['Lost opportunity', 'Using the name instead of building a new brand that could be valuable']]) +
`<h4>Example to analyse</h4>
<p>Vinamilk's product range spans milk, yoghurt, powdered milk and other products, as listed on its Wikipedia page. For each product line ask: line or category extension? Does the "trust and nutrition" association fit? Then pick one possible new product and score it with the checklist.</p>
<div class="pitfall"><strong>Reminder.</strong> Fit is judged by the customer, not by the factory. "We already have the machines" is not fit.</div>`,
       `<p><strong>Mở rộng thương hiệu</strong> là dùng tên thương hiệu đã có để ra sản phẩm mới. Hai loại chính:</p>
<ul><li><strong>Mở rộng dòng</strong>: hương vị, kích cỡ, biến thể mới trong cùng ngành (một vị sữa mới).</li>
<li><strong>Mở rộng ngành</strong>: ngành sản phẩm mới (thương hiệu sữa ra đồ uống ở phân khúc khác).</li></ul>
<h4>Vì sao mở rộng</h4>
<p>Chi phí ra mắt thấp (nhận biết đã có), rủi ro cảm nhận của khách thấp, và phản hồi tích cực cho thương hiệu mẹ nếu thành công. Phần lớn sản phẩm mới dùng tên có sẵn vì lý do này.</p>
<h4>Bảng kiểm thành công</h4>
<ol><li><strong>Chất lượng và nhận biết của thương hiệu mẹ</strong>: giá trị dương, mạnh.</li>
<li><strong>Độ khớp</strong>: mở rộng có vẻ hợp lý (chuyên môn chung, cách dùng, hình ảnh tương tự). Độ khớp có thể dựa trên tính năng sản phẩm hoặc khái niệm thương hiệu (hình ảnh "cao cấp" hay "khoẻ mạnh" có thể đi qua nhiều ngành).</li>
<li><strong>POD liên quan</strong> ở ngành mới: liên tưởng của thương hiệu mẹ phải có ý nghĩa ở đó.</li>
<li><strong>Giao chất lượng</strong>: mở rộng yếu làm hại thương hiệu mẹ.</li>
<li><strong>Hỗ trợ marketing</strong>: đừng cho rằng cái tên tự bán.</li></ol>
<h4>Rủi ro</h4>` +
tbl(['Rủi ro', 'Điều xảy ra'], [['Làm mờ (dilution)', 'Quá nhiều mở rộng không liên quan làm nhoè điều thương hiệu đại diện'], ['Cannibalization', 'Sản phẩm mới lấy doanh số của sản phẩm mẹ'], ['Hại ngược', 'Thất bại của mở rộng làm yếu thương hiệu mẹ'], ['Mất cơ hội', 'Dùng tên thay vì xây thương hiệu mới có thể rất giá trị']]) +
`<h4>Ví dụ để phân tích</h4>
<p>Danh mục của Vinamilk gồm sữa, sữa chua, sữa bột và sản phẩm khác, như liệt kê trên trang Wikipedia. Với mỗi dòng hỏi: mở rộng dòng hay ngành? Liên tưởng "tin cậy và dinh dưỡng" có khớp không? Rồi chọn một sản phẩm mới khả dĩ và chấm bằng bảng kiểm.</p>
<div class="pitfall"><strong>Nhắc.</strong> Độ khớp do khách hàng đánh giá, không phải nhà máy. "Ta đã có máy móc sẵn" không phải là khớp.</div>`],
    pit: ['Judging fit from the company side ("same factory") instead of the customer side ("would I trust this?").', 'Đánh giá độ khớp từ phía công ty ("cùng nhà máy") thay vì phía khách ("tôi có tin cái này không?").'],
    s: [['Line extension = same category; category extension = new category.', 'Mở rộng dòng = cùng ngành; mở rộng ngành = ngành mới.'], ['Success needs parent equity, fit, relevant POD, quality and support.', 'Thành công cần giá trị mẹ, độ khớp, POD liên quan, chất lượng và hỗ trợ.'], ['Watch for dilution and cannibalization.', 'Chú ý làm mờ và cannibalization.']],
    l: ['ext', 'dil', 'cann', 'vinamilk', 'virgin'],
    p: [['Is a new yoghurt flavour a line or category extension?', 'Vị sữa chua mới là mở rộng dòng hay ngành?', 'Line extension.', 'Mở rộng dòng.'],
        ['A premium watch brand launches cheap plastic toys under its name. Predict one risk.', 'Thương hiệu đồng hồ cao cấp ra đồ chơi nhựa giá rẻ dưới tên mình. Dự đoán một rủi ro.', 'Dilution of the premium image and poor fit.', 'Làm mờ hình ảnh cao cấp và độ khớp kém.']] }),

  D(P + '8-2', '8.2 Managing brands over time: reinforce, revitalize, rebrand', '8.2 Quản trị thương hiệu theo thời gian: củng cố, làm mới, đổi diện mạo', 'Củng cố, làm mới, tái thiết; ví dụ New Coke, Vinamilk 2023.', {
    n: '8.2',
    g: [['Explain how to reinforce brand meaning', 'Giải thích cách củng cố ý nghĩa thương hiệu'], ['Decide between revitalizing and rebranding', 'Quyết định giữa làm mới và đổi diện mạo'], ['Learn from New Coke and a Vietnamese identity update', 'Rút bài học từ New Coke và một lần cập nhật nhận diện của Việt Nam']],
    b: [`<h4>Reinforcing</h4>
<p>Keep delivering the same core promise: consistent innovation in product relevance, consistent communication, and sustaining the sources of equity. Reinforcement means "refresh the execution, not the idea".</p>
<h4>Revitalizing</h4>
<p>When equity has faded: win back lapsed customers, reach new ones, or fix lost relevance. Options: increase usage, find new usage occasions, enter new markets, repair negative associations, or reposition (Lesson 3.4).</p>
<h4>Rebranding</h4>
<p>A <strong>rebrand</strong> changes name, logo or identity, sometimes also positioning. Typical reasons: merger, outdated image, negative history, entering new markets, or a bigger business scope. Rebranding is high risk: you can lose the recognition you built. Rules of thumb: keep the equity that is positive (colour, a symbol, a name part), explain the change, and align the experience, not only the logo.</p>
<h4>Case 1: New Coke (1985)</h4>
<p>Coca-Cola launched a reformulated sweeter product in 1985 after taste tests, and strong consumer backlash led to the return of the original formula within months, marketed as "Coca-Cola Classic". The lesson is often summarised as: taste tests measured the sip, not the full meaning, identity and emotional attachment of the brand. See the New Coke page for the timeline.</p>
<h4>Case 2: Vinamilk identity updates</h4>
<p>According to the Vinamilk Wikipedia page, the company used different slogans across the years (2007 "Cuộc sống tươi đẹp", 2009 "Niềm tin Việt Nam", 2010 "Vươn cao Việt Nam") and introduced a new brand identity and logo in July 2023. Analyse: what stayed (name, milk category) and what changed (visual identity, message)? Which risks would you monitor in the first year?</p>
<div class="callout"><strong>Rebrand checklist.</strong> Reason · research with customers and staff · what to keep · migration plan (shops, packaging, digital, legal) · communication · metrics before and after.</div>`,
       `<h4>Củng cố</h4>
<p>Tiếp tục giao cùng lời hứa cốt lõi: đổi mới nhất quán về mức liên quan của sản phẩm, truyền thông nhất quán, và duy trì các nguồn tạo giá trị. Củng cố nghĩa là "làm mới cách thực hiện, không đổi ý tưởng".</p>
<h4>Làm mới</h4>
<p>Khi giá trị phai: lấy lại khách đã rời, tiếp cận khách mới, hoặc sửa mức liên quan đã mất. Lựa chọn: tăng mức sử dụng, tìm dịp sử dụng mới, vào thị trường mới, sửa liên tưởng tiêu cực, hoặc tái định vị (Bài 3.4).</p>
<h4>Đổi diện mạo (rebrand)</h4>
<p><strong>Rebrand</strong> đổi tên, logo hay nhận diện, đôi khi cả định vị. Lý do thường gặp: sáp nhập, hình ảnh lỗi thời, quá khứ tiêu cực, vào thị trường mới, hoặc phạm vi kinh doanh lớn hơn. Rebrand rủi ro cao: bạn có thể mất sự nhận biết đã xây. Nguyên tắc: giữ phần giá trị dương (màu, một biểu tượng, một phần tên), giải thích thay đổi, và căn chỉnh trải nghiệm chứ không chỉ logo.</p>
<h4>Tình huống 1: New Coke (1985)</h4>
<p>Năm 1985 Coca-Cola ra sản phẩm công thức mới ngọt hơn sau các thử nghiệm vị, và phản ứng dữ dội của người tiêu dùng khiến công thức gốc trở lại trong vài tháng, bán với tên "Coca-Cola Classic". Bài học thường được tóm: thử nếm đo ngụm uống, không đo trọn ý nghĩa, bản sắc và sự gắn bó cảm xúc của thương hiệu. Xem trang New Coke để biết dòng thời gian.</p>
<h4>Tình huống 2: cập nhật nhận diện của Vinamilk</h4>
<p>Theo trang Wikipedia về Vinamilk, công ty dùng các slogan khác nhau qua các năm (2007 "Cuộc sống tươi đẹp", 2009 "Niềm tin Việt Nam", 2010 "Vươn cao Việt Nam") và giới thiệu nhận diện và logo mới vào tháng 7/2023. Phân tích: cái gì giữ lại (tên, ngành sữa) và cái gì đổi (nhận diện hình ảnh, thông điệp)? Bạn sẽ theo dõi rủi ro nào trong năm đầu?</p>
<div class="callout"><strong>Bảng kiểm rebrand.</strong> Lý do · nghiên cứu với khách và nhân viên · giữ gì · kế hoạch chuyển đổi (cửa hàng, bao bì, số, pháp lý) · truyền thông · chỉ số trước và sau.</div>`],
    pit: ['Treating a new logo as the whole rebrand. If experience and product do not change, customers see only a different picture.', 'Coi logo mới là toàn bộ rebrand. Nếu trải nghiệm và sản phẩm không đổi, khách chỉ thấy bức hình khác.'],
    s: [['Reinforce: refresh execution, keep the idea.', 'Củng cố: làm mới cách thực hiện, giữ ý tưởng.'], ['Revitalize when equity fades; rebrand only with strong reasons.', 'Làm mới khi giá trị phai; chỉ rebrand khi có lý do mạnh.'], ['New Coke shows emotional attachment is not captured by taste tests alone.', 'New Coke cho thấy gắn bó cảm xúc không đo được chỉ bằng thử nếm.']],
    l: ['rebrand', 'newcoke', 'coke', 'vinamilk', 'gap'],
    p: [['What is the main lesson of New Coke?', 'Bài học chính của New Coke là gì?', 'Brand meaning and attachment go beyond product taste; test the whole brand.', 'Ý nghĩa và sự gắn bó với thương hiệu vượt ngoài vị sản phẩm; hãy thử cả thương hiệu.'],
        ['List three things to decide before a rebrand.', 'Liệt kê ba việc cần quyết trước khi rebrand.', 'Reason; what equity to keep; migration and communication plan (and metrics).', 'Lý do; giữ giá trị nào; kế hoạch chuyển đổi và truyền thông (và chỉ số).']] }),

  D(P + '8-3', '8.3 International and global branding', '8.3 Thương hiệu quốc tế và toàn cầu', 'Chuẩn hoá hay thích nghi, glocalization, xuất xứ, ví dụ VinFast.', {
    n: '8.3',
    g: [['Compare standardization and adaptation', 'So sánh chuẩn hoá và thích nghi'], ['Explain glocalization and country-of-origin effects', 'Giải thích glocalization và hiệu ứng xuất xứ'], ['Analyse a Vietnamese brand going abroad', 'Phân tích một thương hiệu Việt ra nước ngoài']],
    b: [`<p>Going abroad raises three questions: what stays the same everywhere, what is localised, and how to protect the brand legally.</p>
<h4>Standardize or adapt</h4>` +
tbl(['Element', 'Often standardized', 'Often adapted'], [['Name, logo, core promise', 'Yes (builds global recognition)', 'Only if the name has bad meaning'], ['Product', 'Core product platform', 'Taste, size, features, regulations'], ['Price', '—', 'By income level and competition'], ['Communication', 'Core idea and visual identity', 'Language, humour, cultural codes'], ['Distribution', '—', 'Local partners, platforms']]) +
`<p><strong>Glocalization</strong> ("think global, act local") keeps the global brand idea and adapts details. A fast-food chain keeps its logo and core menu but adds local items. Keller also cautions that an image can differ across countries because of different category conditions.</p>
<h4>Country-of-origin effect</h4>
<p>Consumers infer quality from the country a product comes from (Swiss watches, German cars). The effect can be positive or negative and depends on the category. A new brand from an emerging market may need extra proof, such as certifications and warranties, to counter doubts. Nation branding research studies how countries build such images.</p>
<h4>Case: VinFast</h4>
<p>Per the Wikipedia page, VinFast was founded in 2017, unveiled its first cars at the Paris Motor Show in 2018, began production in 2019, and listed on Nasdaq in August 2023. Brand questions for analysis:</p>
<ul><li>What is the frame of reference in foreign markets (electric vehicles)? Who are the competitors?</li>
<li>Does the "Vietnamese" origin help or must it be backed by proof (reviews, service network)?</li>
<li>What must be adapted: dealer model, warranty, language, pricing?</li>
<li>Which risks would you track (quality complaints, service gaps, public perception)?</li></ul>
<div class="callout"><strong>Important.</strong> Do not state sales or satisfaction numbers unless you cite a current, reliable source with the date.</div>`,
       `<p>Ra nước ngoài đặt ra ba câu hỏi: cái gì giữ nguyên ở mọi nơi, cái gì địa phương hoá, và bảo hộ thương hiệu về pháp lý thế nào.</p>
<h4>Chuẩn hoá hay thích nghi</h4>` +
tbl(['Yếu tố', 'Thường chuẩn hoá', 'Thường thích nghi'], [['Tên, logo, lời hứa cốt lõi', 'Có (xây nhận biết toàn cầu)', 'Chỉ khi tên có nghĩa xấu'], ['Sản phẩm', 'Nền tảng sản phẩm cốt lõi', 'Vị, cỡ, tính năng, quy định'], ['Giá', '—', 'Theo mức thu nhập và cạnh tranh'], ['Truyền thông', 'Ý chính và nhận diện hình ảnh', 'Ngôn ngữ, hài hước, mã văn hoá'], ['Phân phối', '—', 'Đối tác và nền tảng địa phương']]) +
`<p><strong>Glocalization</strong> ("nghĩ toàn cầu, làm địa phương") giữ ý tưởng thương hiệu toàn cầu và điều chỉnh chi tiết. Chuỗi thức ăn nhanh giữ logo và thực đơn lõi nhưng thêm món địa phương. Keller cũng lưu ý hình ảnh có thể khác giữa các nước vì điều kiện ngành khác nhau.</p>
<h4>Hiệu ứng xuất xứ</h4>
<p>Người tiêu dùng suy ra chất lượng từ nước sản xuất (đồng hồ Thuỵ Sĩ, xe Đức). Hiệu ứng có thể tích cực hoặc tiêu cực và phụ thuộc ngành. Thương hiệu mới từ thị trường mới nổi có thể cần thêm bằng chứng như chứng nhận và bảo hành để đối phó nghi ngại. Nghiên cứu thương hiệu quốc gia xem các nước xây dựng hình ảnh như vậy thế nào.</p>
<h4>Tình huống: VinFast</h4>
<p>Theo trang Wikipedia, VinFast thành lập năm 2017, giới thiệu những chiếc xe đầu tiên tại Paris Motor Show 2018, bắt đầu sản xuất năm 2019 và niêm yết trên Nasdaq vào tháng 8/2023. Câu hỏi thương hiệu để phân tích:</p>
<ul><li>Khung tham chiếu ở thị trường nước ngoài (xe điện) là gì? Đối thủ là ai?</li>
<li>Xuất xứ "Việt Nam" giúp ích hay phải được chứng minh (đánh giá, mạng lưới dịch vụ)?</li>
<li>Cần thích nghi gì: mô hình đại lý, bảo hành, ngôn ngữ, giá?</li>
<li>Theo dõi rủi ro nào (khiếu nại chất lượng, thiếu dịch vụ, nhận thức công chúng)?</li></ul>
<div class="callout"><strong>Quan trọng.</strong> Đừng nêu số liệu doanh số hay mức hài lòng nếu không trích nguồn tin cậy, hiện hành kèm ngày.</div>`],
    pit: ['Assuming a name or slogan works abroad. Translate and test with native speakers, and check trademark availability.', 'Giả định tên hay slogan dùng được ở nước ngoài. Hãy dịch, thử với người bản ngữ và kiểm nhãn hiệu còn trống.'],
    s: [['Standardize the core; adapt product, price and communication details.', 'Chuẩn hoá phần lõi; thích nghi sản phẩm, giá và chi tiết truyền thông.'], ['Glocalization = global idea, local execution.', 'Glocalization = ý tưởng toàn cầu, thực hiện địa phương.'], ['Country of origin can help or hurt; back it with proof.', 'Xuất xứ có thể giúp hoặc hại; hãy hậu thuẫn bằng bằng chứng.']],
    l: ['glocal', 'coo', 'nation', 'vinfast', 'wipomad', 'mcd'],
    p: [['What is glocalization?', 'Glocalization là gì?', 'Keeping a global brand idea while adapting details to local markets.', 'Giữ ý tưởng thương hiệu toàn cầu và điều chỉnh chi tiết cho thị trường địa phương.'],
        ['Why might a new brand from an emerging market need extra proof abroad?', 'Vì sao thương hiệu mới từ thị trường mới nổi cần thêm bằng chứng ở nước ngoài?', 'Country-of-origin doubts reduce perceived quality; warranties and reviews counter them.', 'Nghi ngại về xuất xứ làm giảm chất lượng cảm nhận; bảo hành và đánh giá giúp đối phó.']] }),

  Q(P + 'quiz-8', 'Chapter 8 quiz — Growing and sustaining brand equity', 'Quiz Chương 8 — Tăng trưởng và duy trì giá trị thương hiệu', [
    ['A new flavour of an existing product is a…|||Vị mới của sản phẩm hiện có là…', ['Line extension|||Mở rộng dòng', 'Category extension|||Mở rộng ngành', 'Rebrand|||Rebrand', 'Licensing deal|||Hợp đồng cấp phép'], 0, 'Same category, new variant.|||Cùng ngành, biến thể mới.'],
    ['Which is a main extension risk?|||Đâu là rủi ro chính của mở rộng?', ['Dilution of brand meaning|||Làm mờ ý nghĩa thương hiệu', 'Lower taxes|||Thuế thấp hơn', 'More recall|||Nhớ nhiều hơn', 'No risk|||Không có rủi ro'], 0, 'Unrelated extensions blur the brand.|||Mở rộng không liên quan làm nhoè thương hiệu.'],
    ['Extension fit is judged by…|||Độ khớp mở rộng được đánh giá bởi…', ['The factory|||Nhà máy', 'The customer|||Khách hàng', 'The lawyer|||Luật sư', 'The supplier|||Nhà cung cấp'], 1, 'Customer perception decides.|||Nhận thức của khách quyết định.'],
    ['Reinforcing a brand means…|||Củng cố thương hiệu nghĩa là…', ['Changing the idea every year|||Đổi ý tưởng mỗi năm', 'Refreshing execution while keeping the core promise|||Làm mới cách thực hiện mà giữ lời hứa cốt lõi', 'Dropping the logo|||Bỏ logo', 'Stopping advertising|||Ngừng quảng cáo'], 1, 'Consistency with fresh execution.|||Nhất quán với cách thực hiện mới.'],
    ['What is the commonly cited lesson of New Coke?|||Bài học thường được nhắc của New Coke là?', ['Taste tests alone do not capture brand meaning and attachment|||Thử nếm đơn thuần không nắm được ý nghĩa và sự gắn bó thương hiệu', 'Never change anything|||Đừng bao giờ đổi gì', 'Lower prices always win|||Giảm giá luôn thắng', 'Sweeter is better|||Ngọt hơn là tốt hơn'], 0, 'Consumers reacted to losing the original, not only to taste.|||Người tiêu dùng phản ứng vì mất bản gốc, không chỉ vì vị.'],
    ['A rebrand is risky mainly because…|||Rebrand rủi ro chủ yếu vì…', ['It may lose built recognition|||Có thể mất nhận biết đã xây', 'It is free|||Nó miễn phí', 'It cannot be reversed by law|||Luật không cho đảo ngược', 'It removes competitors|||Nó loại bỏ đối thủ'], 0, 'Keep positive equity when changing identity.|||Giữ giá trị dương khi đổi nhận diện.'],
    ['Glocalization means…|||Glocalization nghĩa là…', ['Fully standardised everywhere|||Chuẩn hoá hoàn toàn mọi nơi', 'Global idea with local adaptation|||Ý tưởng toàn cầu với thích nghi địa phương', 'Only local brands|||Chỉ thương hiệu địa phương', 'No communication|||Không truyền thông'], 1, 'Think global, act local.|||Nghĩ toàn cầu, làm địa phương.'],
    ['Country-of-origin effect refers to…|||Hiệu ứng xuất xứ là…', ['Quality inferred from the country of origin|||Chất lượng suy ra từ nước xuất xứ', 'The local tax rate|||Thuế địa phương', 'The shipping cost|||Chi phí vận chuyển', 'The brand colour|||Màu thương hiệu'], 0, 'It can be positive or negative.|||Có thể tích cực hay tiêu cực.'],
  ]),
]));
// ===== Chương 9 =====
secs.push(SEC('Chapter 9 — Digital brands, ethics and capstone', 'Chương 9 — Thương hiệu số, đạo đức và tổng kết',
  'Thương hiệu trên mạng xã hội, người ảnh hưởng và minh bạch, đạo đức – bền vững – tẩy xanh, kế hoạch thương hiệu tổng kết.', [
  D(P + '9-1', '9.1 Building a brand in digital and social media', '9.1 Xây thương hiệu trên không gian số và mạng xã hội', 'Owned/earned/paid, content, cộng đồng, UGC, nhất quán đa nền tảng.', {
    n: '9.1',
    g: [['Distinguish owned, earned and paid media', 'Phân biệt phương tiện sở hữu, kiếm được và trả tiền'], ['Plan content that supports positioning', 'Lên kế hoạch nội dung hỗ trợ định vị'], ['Manage community, UGC and consistency across platforms', 'Quản lý cộng đồng, UGC và tính nhất quán đa nền tảng']],
    b: [`<p>Digital media changed brand building in two ways: customers can answer back in public, and every touchpoint produces data. The brand principles (positioning, consistency, equity) stay the same.</p>
<h4>Owned, earned, paid</h4>` +
tbl(['Type', 'Meaning', 'Examples', 'Control'], [['Owned', 'Channels the brand controls', 'Website, app, brand pages, email list', 'High'], ['Earned', 'Others talk about you', 'Press, reviews, shares, word of mouth', 'Low'], ['Paid', 'Bought exposure', 'Search ads, social ads, sponsored content', 'Medium (money-limited)']]) +
`<h4>Content strategy</h4>
<p>Content marketing means creating useful or entertaining material for a defined audience rather than interrupting them. Begin with <em>content pillars</em> (3–4 themes drawn from positioning) and a tone of voice from the personality (Lesson 5.2). A study-café brand might choose pillars such as "study tips", "campus life", "behind the scenes", "community stories".</p>
<h4>Community and user-generated content</h4>
<p>Brand communities form when customers share identity and rituals around a brand (Harley-Davidson owners' groups, Lego fan builders). UGC (customers' photos, reviews, videos) is trusted more than ads by many consumers, but it requires permission to reuse and moderation.</p>
<h4>Consistency across platforms</h4>
<ul><li>One visual identity and handle naming everywhere.</li>
<li>One voice, adapted to format (short video vs long article).</li>
<li>Response standards: answer within a set time, escalate complaints to a person.</li></ul>
<h4>Measure</h4>
<p>Link metrics to funnel stages: reach and share of search (awareness), saves and comments (engagement), conversion (purchase). Vanity metrics (follower counts) are weak proof of equity.</p>
<div class="meo"><strong>Exercise.</strong> Take the brand page of a Vietnamese brand and tag its last 10 posts by pillar. If you cannot find pillars, the brand has no content strategy.</div>`,
       `<p>Không gian số thay đổi việc xây thương hiệu theo hai cách: khách có thể phản hồi công khai, và mọi điểm chạm đều sinh dữ liệu. Nguyên tắc thương hiệu (định vị, nhất quán, giá trị) vẫn như cũ.</p>
<h4>Sở hữu, kiếm được, trả tiền</h4>` +
tbl(['Loại', 'Ý nghĩa', 'Ví dụ', 'Kiểm soát'], [['Sở hữu (owned)', 'Kênh thương hiệu kiểm soát', 'Website, ứng dụng, trang thương hiệu, danh sách email', 'Cao'], ['Kiếm được (earned)', 'Người khác nói về bạn', 'Báo chí, đánh giá, chia sẻ, truyền miệng', 'Thấp'], ['Trả tiền (paid)', 'Hiện diện mua được', 'Quảng cáo tìm kiếm, quảng cáo mạng xã hội, nội dung tài trợ', 'Trung bình (giới hạn bởi tiền)']]) +
`<h4>Chiến lược nội dung</h4>
<p>Content marketing là tạo nội dung hữu ích hoặc giải trí cho một nhóm khán giả xác định thay vì làm phiền họ. Bắt đầu với <em>trụ cột nội dung</em> (3–4 chủ đề rút từ định vị) và giọng điệu từ tính cách (Bài 5.2). Một thương hiệu quán học tập có thể chọn trụ cột như "mẹo học", "đời sống sinh viên", "hậu trường", "câu chuyện cộng đồng".</p>
<h4>Cộng đồng và nội dung do người dùng tạo</h4>
<p>Cộng đồng thương hiệu hình thành khi khách chia sẻ bản sắc và nghi thức quanh thương hiệu (nhóm chủ xe Harley-Davidson, người chơi Lego). UGC (ảnh, đánh giá, video của khách) được nhiều người tin hơn quảng cáo, nhưng cần xin phép khi dùng lại và cần kiểm duyệt.</p>
<h4>Nhất quán đa nền tảng</h4>
<ul><li>Một nhận diện hình ảnh và cách đặt tên tài khoản ở mọi nơi.</li>
<li>Một giọng điệu, điều chỉnh theo định dạng (video ngắn so với bài dài).</li>
<li>Chuẩn phản hồi: trả lời trong thời hạn, chuyển khiếu nại lên một người phụ trách.</li></ul>
<h4>Đo lường</h4>
<p>Gắn chỉ số với giai đoạn phễu: tiếp cận và thị phần tìm kiếm (nhận biết), lưu và bình luận (tương tác), chuyển đổi (mua). Chỉ số hào nhoáng (số người theo dõi) là bằng chứng yếu cho giá trị thương hiệu.</p>
<div class="meo"><strong>Bài tập.</strong> Lấy trang thương hiệu của một thương hiệu Việt và gắn nhãn 10 bài đăng gần nhất theo trụ cột. Nếu không tìm ra trụ cột, thương hiệu chưa có chiến lược nội dung.</div>`],
    pit: ['Chasing every trend. Jumping on a meme that does not fit the personality produces attention without equity, and sometimes backlash.', 'Chạy theo mọi xu hướng. Nhảy vào meme không hợp tính cách tạo chú ý mà không có giá trị thương hiệu, đôi khi còn phản ứng ngược.'],
    s: [['Owned, earned, paid media complement each other.', 'Phương tiện sở hữu, kiếm được, trả tiền bổ sung nhau.'], ['Content pillars come from positioning and personality.', 'Trụ cột nội dung xuất phát từ định vị và tính cách.'], ['Consistency and response standards protect the brand online.', 'Nhất quán và chuẩn phản hồi bảo vệ thương hiệu trực tuyến.']],
    l: ['smm', 'content', 'ugc', 'comm', 'tgoogle'],
    p: [['Classify a news article about your brand by media type.', 'Phân loại bài báo viết về thương hiệu của bạn theo loại phương tiện.', 'Earned media.', 'Phương tiện kiếm được (earned).'],
        ['Why is follower count a weak brand-equity metric?', 'Vì sao số người theo dõi là chỉ số yếu của giá trị thương hiệu?', 'It does not show perception, preference or purchase.', 'Nó không cho thấy nhận thức, mức ưa thích hay việc mua.']] }),

  D(P + '9-2', '9.2 Influencers, disclosure and brand crises', '9.2 Người ảnh hưởng, minh bạch và khủng hoảng thương hiệu', 'Chọn influencer, công khai quảng cáo, brand safety, ứng phó khủng hoảng.', {
    n: '9.2',
    g: [['Select influencers using brand fit, not follower count alone', 'Chọn influencer theo độ khớp thương hiệu, không chỉ số người theo dõi'], ['Explain why paid relationships must be disclosed', 'Giải thích vì sao quan hệ trả tiền phải được công khai'], ['Apply a crisis response framework', 'Áp dụng khung ứng phó khủng hoảng']],
    b: [`<h4>Influencer marketing</h4>
<p>Influencers are people with an engaged audience who can shape opinions. Treat them as endorsers (Lesson 6.3). Selection criteria:</p>
<ul><li><strong>Fit</strong>: audience, values and tone match the brand.</li>
<li><strong>Authenticity</strong>: credible use of the product, not random brand switching.</li>
<li><strong>Engagement quality</strong>: comments from real people, not only numbers.</li>
<li><strong>History</strong>: past controversies and brand safety.</li></ul>
<p>Micro-influencers with small, close audiences can build more trust per post than a celebrity, but less reach. Write a clear brief (key message, must-say, must-not-say) and an approval process.</p>
<h4>Disclosure</h4>
<p>When there is a material connection (payment, free product, commission), audiences should be told clearly, in the post itself and in plain language. Authorities such as the US Federal Trade Commission publish endorsement guides, and other countries have advertising laws. For Vietnam, check the Advertising Law and current decrees, and the rules of each platform. Hiding sponsorship harms trust in both influencer and brand.</p>
<h4>Brand safety</h4>
<p>Ads appearing next to inappropriate content, or partner conduct, can harm a brand. Use exclusion lists and review where ads run.</p>
<h4>Crisis response framework</h4>` +
tbl(['Step', 'Action'], [['1 Verify', 'Get the facts; identify scope and affected people'], ['2 Contain', 'Stop harmful content or product; pause scheduled posts'], ['3 Respond', 'Speak early, plainly, with empathy and the next step; one spokesperson'], ['4 Fix', 'Correct the cause, not only the message'], ['5 Review', 'Record lessons; update the crisis plan']]) +
`<p>Avoid deleting criticism, blaming customers, and blanket template replies. A sincere apology with a concrete remedy retains more equity than defensive silence. Keep monitoring "cancel culture" style waves early using social listening.</p>`,
       `<h4>Marketing người ảnh hưởng</h4>
<p>Influencer là người có khán giả gắn bó, có thể định hướng ý kiến. Hãy coi họ là người bảo chứng (Bài 6.3). Tiêu chí chọn:</p>
<ul><li><strong>Độ khớp</strong>: khán giả, giá trị và giọng điệu hợp thương hiệu.</li>
<li><strong>Tính xác thực</strong>: dùng sản phẩm đáng tin, không đổi thương hiệu ngẫu nhiên.</li>
<li><strong>Chất lượng tương tác</strong>: bình luận từ người thật, không chỉ con số.</li>
<li><strong>Lịch sử</strong>: các tranh cãi trước đây và an toàn thương hiệu.</li></ul>
<p>Micro-influencer có khán giả nhỏ, thân thiết có thể tạo nhiều niềm tin trên mỗi bài hơn người nổi tiếng, nhưng ít tiếp cận hơn. Viết brief rõ (thông điệp chính, điều phải nói, điều không được nói) và quy trình duyệt.</p>
<h4>Công khai</h4>
<p>Khi có quan hệ lợi ích (trả tiền, tặng sản phẩm, hoa hồng), khán giả cần được thông báo rõ, ngay trong bài và bằng ngôn ngữ dễ hiểu. Các cơ quan như Ủy ban Thương mại Liên bang Hoa Kỳ (FTC) công bố hướng dẫn về bảo chứng, và các nước khác có luật quảng cáo. Ở Việt Nam, hãy kiểm Luật Quảng cáo và các nghị định hiện hành, cùng quy định của từng nền tảng. Giấu quan hệ tài trợ làm tổn hại lòng tin với cả influencer lẫn thương hiệu.</p>
<h4>An toàn thương hiệu</h4>
<p>Quảng cáo xuất hiện cạnh nội dung không phù hợp, hoặc hành vi của đối tác, có thể hại thương hiệu. Dùng danh sách loại trừ và rà soát nơi quảng cáo chạy.</p>
<h4>Khung ứng phó khủng hoảng</h4>` +
tbl(['Bước', 'Hành động'], [['1 Xác minh', 'Nắm sự thật; xác định phạm vi và người bị ảnh hưởng'], ['2 Kiềm chế', 'Dừng nội dung hay sản phẩm gây hại; tạm hoãn bài lên lịch'], ['3 Phản hồi', 'Nói sớm, rõ ràng, đồng cảm và nêu bước tiếp theo; một người phát ngôn'], ['4 Khắc phục', 'Sửa nguyên nhân, không chỉ thông điệp'], ['5 Rút kinh nghiệm', 'Ghi bài học; cập nhật kế hoạch khủng hoảng']]) +
`<p>Tránh xoá lời chỉ trích, đổ lỗi cho khách và trả lời mẫu hàng loạt. Lời xin lỗi chân thành kèm biện pháp cụ thể giữ được nhiều giá trị hơn im lặng phòng thủ. Theo dõi sớm các làn sóng kiểu "cancel culture" bằng công cụ lắng nghe mạng xã hội.</p>`],
    pit: ['Hiring an influencer by follower count and not reading their comments. Purchased followers do not buy products.', 'Thuê influencer theo số người theo dõi mà không đọc bình luận của họ. Người theo dõi mua ảo không mua sản phẩm.'],
    s: [['Choose influencers for fit, authenticity, engagement quality and history.', 'Chọn influencer theo độ khớp, xác thực, chất lượng tương tác và lịch sử.'], ['Disclose paid relationships clearly.', 'Công khai rõ các quan hệ trả tiền.'], ['Crisis: verify, contain, respond, fix, review.', 'Khủng hoảng: xác minh, kiềm chế, phản hồi, khắc phục, rút kinh nghiệm.']],
    l: ['influ', 'amb', 'safety', 'cancel', 'celeb'],
    p: [['Name two checks before signing an influencer.', 'Nêu hai việc kiểm trước khi ký với influencer.', 'Audience fit and engagement quality; past controversies.', 'Độ khớp khán giả và chất lượng tương tác; tranh cãi trong quá khứ.'],
        ['Why is "delete the criticism" a poor crisis tactic?', 'Vì sao "xoá lời chỉ trích" là chiến thuật khủng hoảng kém?', 'It looks like hiding and increases mistrust; screenshots spread anyway.', 'Trông như che giấu và tăng bất tín; ảnh chụp màn hình vẫn lan.']] }),

  D(P + '9-3', '9.3 Ethics, purpose and sustainability', '9.3 Đạo đức, mục đích và bền vững', 'CSR, brand purpose, cause marketing, greenwashing, nguyên tắc trung thực.', {
    n: '9.3',
    g: [['Distinguish CSR, purpose and cause marketing', 'Phân biệt CSR, mục đích thương hiệu và marketing vì mục đích xã hội'], ['Recognise greenwashing', 'Nhận ra tẩy xanh'], ['Apply honesty tests to brand claims', 'Áp dụng phép thử trung thực cho tuyên bố thương hiệu']],
    b: [`<h4>CSR, purpose, cause marketing</h4>
<ul><li><strong>CSR (corporate social responsibility)</strong>: how a company manages its impact on society and environment, beyond the legal minimum.</li>
<li><strong>Brand purpose</strong>: the reason a brand exists beyond profit, which guides decisions and products.</li>
<li><strong>Cause marketing</strong>: partnering with a cause so that sales support it (for example a share of price donated).</li></ul>
<p>Customers increasingly expect brands to take a position, but they judge the gap between words and actions. Patagonia is widely discussed because its environmental stance is built into products and business decisions; read its Wikipedia page for background and judge how far the actions match the claims.</p>
<h4>Greenwashing</h4>
<p><strong>Greenwashing</strong> is presenting a product or company as more environmentally friendly than it is. Typical signs:</p>` +
tbl(['Sign', 'Example'], [['Vague claims', '"Eco-friendly", "natural" with no definition'], ['Irrelevant claim', '"CFC-free" when it is banned anyway'], ['Hidden trade-off', 'Green packaging, but a very harmful product'], ['No proof', 'No certificate, data or third-party check'], ['Imagery only', 'Green leaves and earth colours on the pack']]) +
`<p>Regulators in many places publish guides on environmental claims (for example the US FTC Green Guides) and enforce against misleading claims. Check the rules in your market before making a claim.</p>
<h4>Honesty tests for brand claims</h4>
<ol><li>Is it true and specific (with number, scope and date)?</li>
<li>Can we prove it today?</li>
<li>Would we be comfortable if the customer visited the factory?</li>
<li>Does it exclude something material (for example, only 1% of the product)?</li></ol>
<h4>Other ethical themes</h4>
<ul><li>Marketing to children and vulnerable groups.</li>
<li>Data and privacy in personalisation.</li>
<li>Counterfeits: protecting consumers and trademarks.</li>
<li>Cultural sensitivity and stereotypes in advertising.</li></ul>
<p>In an assignment, avoid unsupported claims about any real company; stay with documented facts and cite sources.</p>`,
       `<h4>CSR, mục đích, marketing vì mục đích xã hội</h4>
<ul><li><strong>CSR (trách nhiệm xã hội doanh nghiệp)</strong>: cách công ty quản lý tác động lên xã hội và môi trường, vượt mức tối thiểu pháp luật.</li>
<li><strong>Mục đích thương hiệu</strong>: lý do thương hiệu tồn tại ngoài lợi nhuận, dẫn dắt quyết định và sản phẩm.</li>
<li><strong>Cause marketing</strong>: hợp tác với một mục đích xã hội để doanh số hỗ trợ nó (ví dụ trích một phần giá bán làm từ thiện).</li></ul>
<p>Khách hàng ngày càng kỳ vọng thương hiệu có lập trường, nhưng họ đánh giá khoảng cách giữa lời nói và hành động. Patagonia được bàn nhiều vì lập trường môi trường được đưa vào sản phẩm và quyết định kinh doanh; đọc trang Wikipedia của hãng để lấy bối cảnh và tự đánh giá hành động khớp lời nói đến đâu.</p>
<h4>Tẩy xanh (greenwashing)</h4>
<p><strong>Greenwashing</strong> là trình bày sản phẩm hay công ty thân thiện với môi trường hơn thực tế. Dấu hiệu thường gặp:</p>` +
tbl(['Dấu hiệu', 'Ví dụ'], [['Tuyên bố mơ hồ', '"Thân thiện môi trường", "tự nhiên" không định nghĩa'], ['Tuyên bố không liên quan', '"Không chứa CFC" trong khi vốn đã bị cấm'], ['Đánh đổi bị giấu', 'Bao bì xanh nhưng sản phẩm rất có hại'], ['Không bằng chứng', 'Không chứng nhận, số liệu hay kiểm tra bên thứ ba'], ['Chỉ có hình ảnh', 'Lá xanh và màu đất trên bao bì']]) +
`<p>Cơ quan quản lý nhiều nơi công bố hướng dẫn về tuyên bố môi trường (ví dụ Green Guides của FTC Hoa Kỳ) và xử lý tuyên bố gây hiểu lầm. Hãy kiểm quy định của thị trường mình trước khi đưa ra tuyên bố.</p>
<h4>Phép thử trung thực cho tuyên bố thương hiệu</h4>
<ol><li>Có đúng và cụ thể không (có số, phạm vi, ngày)?</li>
<li>Hôm nay ta chứng minh được không?</li>
<li>Ta có thoải mái nếu khách đến thăm nhà máy không?</li>
<li>Có loại bỏ điều trọng yếu không (ví dụ chỉ 1% sản phẩm)?</li></ol>
<h4>Các chủ đề đạo đức khác</h4>
<ul><li>Marketing cho trẻ em và nhóm dễ tổn thương.</li>
<li>Dữ liệu và quyền riêng tư trong cá nhân hoá.</li>
<li>Hàng giả: bảo vệ người tiêu dùng và nhãn hiệu.</li>
<li>Nhạy cảm văn hoá và định kiến trong quảng cáo.</li></ul>
<p>Trong bài tập, tránh các khẳng định không có căn cứ về doanh nghiệp thật; chỉ dùng sự kiện có tài liệu và dẫn nguồn.</p>`],
    pit: ['Launching a "green" campaign before the operations change. The gap becomes the story.', 'Ra chiến dịch "xanh" trước khi vận hành thay đổi. Khoảng cách đó trở thành câu chuyện.'],
    s: [['CSR is impact management; purpose is the reason to exist; cause marketing links sales to a cause.', 'CSR là quản lý tác động; mục đích là lý do tồn tại; cause marketing gắn doanh số với một mục đích.'], ['Greenwashing = overstating environmental benefits.', 'Greenwashing = phóng đại lợi ích môi trường.'], ['Make claims true, specific and provable.', 'Làm tuyên bố đúng, cụ thể và chứng minh được.']],
    l: ['csr', 'green', 'gmk', 'cause', 'patagonia'],
    p: [['Is "eco-friendly" with no detail a strong claim? Why?', '"Thân thiện môi trường" không chi tiết có là tuyên bố mạnh không? Vì sao?', 'No: vague and unprovable; a typical greenwashing sign.', 'Không: mơ hồ và không chứng minh được; dấu hiệu tẩy xanh điển hình.'],
        ['Rewrite "natural drink" into a testable claim.', 'Viết lại "đồ uống tự nhiên" thành tuyên bố kiểm chứng được.', 'For example: "Made with 100% fruit juice, no added sugar; tested by [lab], report available" (only if true).', 'Ví dụ: "Làm từ 100% nước ép trái cây, không thêm đường; kiểm nghiệm bởi [phòng thí nghiệm], có báo cáo" (chỉ khi đúng).']] }),

  D(P + '9-4', '9.4 Capstone: a one-page brand plan', '9.4 Tổng kết: kế hoạch thương hiệu một trang', 'Tổng hợp chín chương thành bản kế hoạch một trang và checklist chấm bài.', {
    n: '9.4',
    g: [['Combine all chapters into a one-page brand plan', 'Tổng hợp chín chương thành kế hoạch thương hiệu một trang'], ['Score a plan with a rubric', 'Chấm một kế hoạch bằng thang điểm'], ['Prepare a five-minute presentation', 'Chuẩn bị bài trình bày năm phút']],
    b: [`<p>A strong assignment or startup pitch shows that your decisions connect. Use this template for a real or imagined brand (for example a student café, a local fashion line, or a Vietnamese food brand).</p>` +
tbl(['Section', 'Content', 'Chapter'], [['1 Situation', 'Category, competitors, customers, brand audit findings', '1, 7'], ['2 Target and frame', 'Persona, frame of reference', '3'], ['3 Positioning', 'POP, POD, reason to believe, statement', '3'], ['4 Identity and personality', 'Core identity, 2 personality dimensions, tone of voice', '5'], ['5 Elements', 'Name, logo idea, slogan, packaging; trademark check', '4'], ['6 Marketing program', '4Ps aligned to the position; IMC main idea and channels', '6'], ['7 Partners', 'Co-branding or endorsers, with risk plan', '6'], ['8 Metrics', 'Funnel metrics, NPS, targets and review dates', '7'], ['9 Growth', 'First extension idea and brand architecture', '5, 8'], ['10 Ethics', 'Claims you will make and proof', '9']]) +
`<h4>Rubric (20 points)</h4>` +
tbl(['Criterion', 'Points'], [['Clear, specific target and frame of reference', '3'], ['Positioning statement with real POD and reason to believe', '4'], ['Consistency across elements and marketing mix', '4'], ['Measurable metrics and review plan', '3'], ['Realistic growth and risk thinking', '3'], ['Honest claims, cited sources, no invented numbers', '3']]) +
`<h4>Five-minute presentation</h4>
<ol><li>One slide: who, against whom, why us (30 s).</li>
<li>One slide: brand identity and elements (60 s).</li>
<li>One slide: marketing program (90 s).</li>
<li>One slide: metrics and risks (60 s).</li>
<li>One slide: ask and next steps (30 s). Leave time for questions.</li></ol>
<div class="callout"><strong>Sources.</strong> For facts about real companies use official sites, annual reports and reliable news, and write the date. When unsure, say "not verified" rather than guessing.</div>`,
       `<p>Bài tập hay bài thuyết trình khởi nghiệp tốt cho thấy các quyết định của bạn liên kết với nhau. Dùng mẫu này cho một thương hiệu thật hoặc tưởng tượng (ví dụ quán cà phê sinh viên, dòng thời trang địa phương, thương hiệu thực phẩm Việt).</p>` +
tbl(['Phần', 'Nội dung', 'Chương'], [['1 Bối cảnh', 'Ngành, đối thủ, khách hàng, phát hiện kiểm toán', '1, 7'], ['2 Mục tiêu và khung', 'Persona, khung tham chiếu', '3'], ['3 Định vị', 'POP, POD, lý do tin, tuyên bố', '3'], ['4 Nhận diện và tính cách', 'Bản sắc cốt lõi, 2 chiều tính cách, giọng điệu', '5'], ['5 Yếu tố', 'Tên, ý tưởng logo, slogan, bao bì; kiểm nhãn hiệu', '4'], ['6 Chương trình marketing', '4P khớp với vị thế; ý chính IMC và kênh', '6'], ['7 Đối tác', 'Đồng thương hiệu hoặc người bảo chứng, kèm kế hoạch rủi ro', '6'], ['8 Chỉ số', 'Chỉ số phễu, NPS, mục tiêu và ngày rà soát', '7'], ['9 Tăng trưởng', 'Ý tưởng mở rộng đầu tiên và kiến trúc thương hiệu', '5, 8'], ['10 Đạo đức', 'Tuyên bố sẽ đưa ra và bằng chứng', '9']]) +
`<h4>Thang điểm (20 điểm)</h4>` +
tbl(['Tiêu chí', 'Điểm'], [['Mục tiêu và khung tham chiếu rõ, cụ thể', '3'], ['Tuyên bố định vị có POD thật và lý do tin', '4'], ['Nhất quán giữa các yếu tố và bộ marketing', '4'], ['Chỉ số đo được và kế hoạch rà soát', '3'], ['Tư duy tăng trưởng và rủi ro thực tế', '3'], ['Tuyên bố trung thực, dẫn nguồn, không bịa số', '3']]) +
`<h4>Thuyết trình năm phút</h4>
<ol><li>Một slide: ai, so với ai, vì sao chọn ta (30 giây).</li>
<li>Một slide: nhận diện và yếu tố thương hiệu (60 giây).</li>
<li>Một slide: chương trình marketing (90 giây).</li>
<li>Một slide: chỉ số và rủi ro (60 giây).</li>
<li>Một slide: đề nghị và bước tiếp theo (30 giây). Chừa thời gian hỏi đáp.</li></ol>
<div class="callout"><strong>Nguồn.</strong> Với sự kiện về doanh nghiệp thật hãy dùng trang chính thức, báo cáo thường niên và tin tức đáng tin, và ghi ngày. Khi chưa chắc, hãy viết "chưa kiểm chứng" thay vì đoán.</div>`],
    pit: ['Ten slides of logos and no numbers. Evaluators look for decisions linked to a target and a metric.', 'Mười slide toàn logo và không có số liệu. Người chấm tìm các quyết định gắn với mục tiêu và chỉ số.'],
    s: [['A one-page plan connects target, position, identity, elements, mix, metrics, growth, ethics.', 'Kế hoạch một trang nối mục tiêu, định vị, nhận diện, yếu tố, bộ marketing, chỉ số, tăng trưởng, đạo đức.'], ['Use a rubric to self-check.', 'Dùng thang điểm để tự kiểm.'], ['Cite sources; never invent numbers.', 'Dẫn nguồn; không bao giờ bịa số.']],
    l: ['mgmt', 'equity', 'pos', 'tgoogle'],
    p: [['Which sections of the plan link back to Chapter 7?', 'Những phần nào của kế hoạch liên hệ với Chương 7?', 'Situation (audit findings) and Metrics.', 'Bối cảnh (phát hiện kiểm toán) và Chỉ số.'],
        ['Draft the first line of your positioning statement for your chosen brand.', 'Soạn dòng đầu tuyên bố định vị cho thương hiệu bạn chọn.', 'Any answer following: For [target], [brand] is the [frame] that [POD]…', 'Mọi đáp án theo mẫu: Dành cho [đối tượng], [thương hiệu] là [khung] mang lại [POD]…']] }),

  Q(P + 'quiz-9', 'Chapter 9 quiz — Digital brands, ethics and capstone', 'Quiz Chương 9 — Thương hiệu số, đạo đức và tổng kết', [
    ['A press article about your brand is…|||Một bài báo viết về thương hiệu của bạn là…', ['Owned media|||Phương tiện sở hữu', 'Earned media|||Phương tiện kiếm được', 'Paid media|||Phương tiện trả tiền', 'Private media|||Phương tiện riêng'], 1, 'Others talk about you without payment.|||Người khác nói về bạn mà không trả tiền.'],
    ['Content pillars are derived from…|||Trụ cột nội dung được rút từ…', ['Random trends|||Xu hướng ngẫu nhiên', 'Positioning and personality|||Định vị và tính cách', 'Competitors\' logos|||Logo đối thủ', 'The price list|||Bảng giá'], 1, 'They keep content consistent with the brand.|||Chúng giữ nội dung nhất quán với thương hiệu.'],
    ['Which is a weak equity metric?|||Đâu là chỉ số yếu về giá trị thương hiệu?', ['Follower count alone|||Chỉ số người theo dõi', 'Repeat purchase|||Mua lại', 'NPS|||NPS', 'Share of search|||Thị phần tìm kiếm'], 0, 'Followers do not show preference or purchase.|||Người theo dõi không cho thấy ưa thích hay mua.'],
    ['Paid brand-influencer relationships should be…|||Quan hệ trả tiền giữa thương hiệu và influencer nên được…', ['Hidden|||Giấu', 'Disclosed clearly|||Công khai rõ ràng', 'Deleted after posting|||Xoá sau khi đăng', 'Paid in cash only|||Chỉ trả tiền mặt'], 1, 'Disclosure protects trust.|||Công khai bảo vệ lòng tin.'],
    ['First step of a crisis response is…|||Bước đầu ứng phó khủng hoảng là…', ['Verify facts and scope|||Xác minh sự thật và phạm vi', 'Delete comments|||Xoá bình luận', 'Blame customers|||Đổ lỗi khách hàng', 'Ignore it|||Phớt lờ'], 0, 'Then contain, respond, fix, review.|||Rồi kiềm chế, phản hồi, khắc phục, rút kinh nghiệm.'],
    ['Greenwashing is…|||Greenwashing là…', ['Cleaning a factory|||Dọn dẹp nhà máy', 'Overstating environmental benefits|||Phóng đại lợi ích môi trường', 'A tax credit|||Ưu đãi thuế', 'A packaging colour|||Màu bao bì'], 1, 'Vague or unproven green claims mislead consumers.|||Tuyên bố xanh mơ hồ hoặc không chứng minh gây hiểu lầm.'],
    ['Which claim is the most testable?|||Tuyên bố nào kiểm chứng được nhất?', ['"Eco-friendly"|||"Thân thiện môi trường"', '"Made from 100% recycled PET, certified by [named body], 2026"|||"Làm từ 100% PET tái chế, chứng nhận bởi [tổ chức nêu tên], 2026"', '"Very natural"|||"Rất tự nhiên"', '"The best"|||"Tốt nhất"'], 1, 'Specific, provable and dated.|||Cụ thể, chứng minh được và có ngày.'],
    ['In a capstone brand plan you should…|||Trong kế hoạch thương hiệu tổng kết bạn nên…', ['Invent supporting numbers|||Bịa số liệu hỗ trợ', 'Cite sources and mark unverified items|||Dẫn nguồn và ghi rõ mục chưa kiểm chứng', 'Skip metrics|||Bỏ qua chỉ số', 'Copy a competitor\'s slogan|||Chép slogan đối thủ'], 1, 'Honesty and traceability matter.|||Trung thực và truy được nguồn là quan trọng.'],
  ]),
]));

export default secs;
