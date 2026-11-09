// Khoá TỰ SOẠN cho EEM201 — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Giáo trình chuẩn: Bowdin et al. "Events Management"; Goldblatt "Special Events"; Allen, Harris & Jago "Festival & Special Event Management"; Vogel "Entertainment Industry Economics".
const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const x = (s) => (Array.isArray(s) ? s[0] + '|||' + s[1] : (String(s).includes('|||') ? s : s + '|||' + s));
const W = 'https://en.wikipedia.org/wiki/';
const wk = (p, en, vi) => [W + p, 'Wikipedia — ' + en, 'Wikipedia — ' + vi];
const LK = {
  evm: wk('Event_management', 'Event management', 'Quản lý sự kiện'),
  evp: wk('Event_planning', 'Event planning', 'Lập kế hoạch sự kiện'),
  fest: wk('Festival', 'Festival', 'Lễ hội'),
  mfest: wk('Music_festival', 'Music festival', 'Liên hoan âm nhạc'),
  conc: wk('Concert', 'Concert', 'Buổi hoà nhạc'),
  tour: wk('Concert_tour', 'Concert tour', 'Chuyến lưu diễn'),
  fair: wk('Trade_fair', 'Trade fair', 'Hội chợ thương mại'),
  show: wk('Trade_show', 'Trade show', 'Triển lãm thương mại'),
  conv: wk('Convention_(meeting)', 'Convention (meeting)', 'Hội nghị (convention)'),
  confe: wk('Conference', 'Conference', 'Hội thảo / hội nghị'),
  exhib: wk('Exhibition', 'Exhibition', 'Triển lãm'),
  ccent: wk('Convention_center', 'Convention center', 'Trung tâm hội nghị'),
  btour: wk('Business_tourism', 'Business tourism', 'Du lịch công vụ (MICE)'),
  ent: wk('Entertainment', 'Entertainment', 'Giải trí'),
  entind: wk('Entertainment_industry', 'Entertainment industry', 'Ngành công nghiệp giải trí'),
  spons: wk('Sponsor_(commercial)', 'Sponsor (commercial)', 'Tài trợ (thương mại)'),
  evmk: wk('Event_marketing', 'Event marketing', 'Marketing sự kiện'),
  exmk: wk('Experiential_marketing', 'Experiential marketing', 'Marketing trải nghiệm'),
  risk: wk('Risk_management', 'Risk management', 'Quản trị rủi ro'),
  rass: wk('Risk_assessment', 'Risk assessment', 'Đánh giá rủi ro'),
  cont: wk('Contingency_plan', 'Contingency plan', 'Kế hoạch dự phòng'),
  stake: wk('Stakeholder_(corporate)', 'Stakeholder (corporate)', 'Bên liên quan (stakeholder)'),
  stakean: wk('Stakeholder_analysis', 'Stakeholder analysis', 'Phân tích bên liên quan'),
  cpm: wk('Critical_path_method', 'Critical path method', 'Phương pháp đường găng'),
  gantt: wk('Gantt_chart', 'Gantt chart', 'Biểu đồ Gantt'),
  wbs: wk('Work_breakdown_structure', 'Work breakdown structure', 'Cấu trúc phân rã công việc (WBS)'),
  pm: wk('Project_management', 'Project management', 'Quản lý dự án'),
  budget: wk('Budget', 'Budget', 'Ngân sách'),
  roi: wk('Return_on_investment', 'Return on investment', 'Tỷ suất hoàn vốn (ROI)'),
  cba: wk('Cost-benefit_analysis', 'Cost–benefit analysis', 'Phân tích chi phí – lợi ích'),
  be: wk('Break-even_(economics)', 'Break-even (economics)', 'Điểm hoà vốn'),
  dyn: wk('Dynamic_pricing', 'Dynamic pricing', 'Định giá linh hoạt'),
  resale: wk('Ticket_resale', 'Ticket resale', 'Bán lại vé'),
  crowd: wk('Crowd_management', 'Crowd management', 'Quản lý đám đông'),
  crush: wk('Crowd_crush', 'Crowd crush', 'Dồn ép đám đông'),
  promo: wk('Concert_promoter', 'Concert promoter', 'Nhà tổ chức / bảo trợ buổi diễn (promoter)'),
  agent: wk('Talent_agent', 'Talent agent', 'Người đại diện nghệ sĩ'),
  stagem: wk('Stage_management', 'Stage management', 'Quản lý sân khấu'),
  sound: wk('Sound_reinforcement_system', 'Sound reinforcement system', 'Hệ thống âm thanh sân khấu'),
  fyre: wk('Fyre_Festival', 'Fyre Festival', 'Fyre Festival'),
  astro: wk('Astroworld_Festival_crowd_crush', 'Astroworld Festival crowd crush', 'Vụ dồn ép tại Astroworld Festival'),
  glasto: wk('Glastonbury_Festival', 'Glastonbury Festival', 'Glastonbury Festival'),
  tomorrow: wk('Tomorrowland_(festival)', 'Tomorrowland (festival)', 'Tomorrowland'),
  coachella: wk('Coachella_Valley_Music_and_Arts_Festival', 'Coachella Valley Music and Arts Festival', 'Coachella'),
  ln: wk('Live_Nation_Entertainment', 'Live Nation Entertainment', 'Live Nation Entertainment'),
  tm: wk('Ticketmaster', 'Ticketmaster', 'Ticketmaster'),
  eras: wk('Taylor_Swift:_The_Eras_Tour', 'Taylor Swift: The Eras Tour', 'Taylor Swift: The Eras Tour'),
  bp: wk('Born_Pink_World_Tour', 'Born Pink World Tour', 'Born Pink World Tour (có đêm diễn tại Hà Nội)'),
  sea: wk('2021_Southeast_Asian_Games', '2021 SEA Games (Hanoi)', 'SEA Games 31 (Hà Nội)'),
  oly: wk('Olympic_Games', 'Olympic Games', 'Thế vận hội Olympic'),
  expo: wk('Expo_2020', 'Expo 2020 (Dubai)', 'Expo 2020 (Dubai)'),
  kpi: wk('Key_performance_indicator', 'Key performance indicator', 'Chỉ số đo hiệu quả (KPI)'),
  nps: wk('Net_promoter', 'Net promoter score', 'Chỉ số NPS'),
  swot: wk('SWOT_analysis', 'SWOT analysis', 'Phân tích SWOT'),
  csat: wk('Customer_satisfaction', 'Customer satisfaction', 'Mức hài lòng của khách hàng'),
  pr: wk('Public_relations', 'Public relations', 'Quan hệ công chúng (PR)'),
  smm: wk('Social_media_marketing', 'Social media marketing', 'Marketing trên mạng xã hội'),
  influ: wk('Influencer_marketing', 'Influencer marketing', 'Marketing người ảnh hưởng'),
  cmk: wk('Content_marketing', 'Content marketing', 'Content marketing'),
  hybrid: wk('Hybrid_event', 'Hybrid event', 'Sự kiện kết hợp (hybrid)'),
  virt: wk('Virtual_event', 'Virtual event', 'Sự kiện trực tuyến'),
  live: wk('Live_streaming', 'Live streaming', 'Phát trực tiếp (livestream)'),
  sust: wk('Sustainability', 'Sustainability', 'Phát triển bền vững'),
  rfp: wk('Request_for_proposal', 'Request for proposal', 'Yêu cầu đề xuất (RFP)'),
  contr: wk('Contract', 'Contract', 'Hợp đồng'),
  insur: wk('Insurance', 'Insurance', 'Bảo hiểm'),
  copy: wk('Copyright', 'Copyright', 'Bản quyền'),
  pro: wk('Performance_rights_organisation', 'Performance rights organisation', 'Tổ chức quản lý quyền biểu diễn'),
  mlic: wk('Music_licensing', 'Music licensing', 'Cấp phép âm nhạc'),
  eic: ['https://www.eventscouncil.org/', 'Events Industry Council — industry body (research, certification CMP)', 'Events Industry Council — tổ chức ngành sự kiện (nghiên cứu, chứng chỉ CMP)'],
  icca: ['https://www.iccaworld.org/', 'ICCA — International Congress and Convention Association', 'ICCA — Hiệp hội Hội nghị và Đại hội Quốc tế'],
  ufi: ['https://www.ufi.org/', 'UFI — The Global Association of the Exhibition Industry', 'UFI — Hiệp hội Triển lãm Toàn cầu'],
  vtravel: ['https://vietnam.travel/', 'Vietnam.travel — official tourism website of Vietnam', 'Vietnam.travel — trang du lịch chính thức của Việt Nam'],
  glastosite: ['https://www.glastonburyfestivals.co.uk/', 'Glastonbury Festivals — official site', 'Glastonbury Festivals — trang chính thức'],
  lnsite: ['https://www.livenationentertainment.com/', 'Live Nation Entertainment — company site', 'Live Nation Entertainment — trang công ty'],
  hse: ['https://www.hse.gov.uk/event-safety/', 'UK HSE — Event safety guidance', 'HSE (Anh) — Hướng dẫn an toàn sự kiện'],
  ebblog: ['https://www.eventbrite.com/blog/', 'Eventbrite Blog — event trends and practice', 'Eventbrite Blog — xu hướng và thực hành sự kiện'],
  tomsite: ['https://www.tomorrowland.com/', 'Tomorrowland — official site', 'Tomorrowland — trang chính thức'],
  wipoc: ['https://www.wipo.int/copyright/en/', 'WIPO — Copyright', 'WIPO — Bản quyền'],
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
  let h = '<span class="eyebrow">EEM201 · ' + T.les + o.n + '</span>\n';
  h += '<h3>' + T.goals + '</h3><ul>' + o.g.map((g) => '<li>' + g[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.lec + '</h3>' + o.b[I] + '\n';
  if (o.pit) h += '<div class="pitfall"><strong>' + T.pit + '.</strong> ' + o.pit[I] + '</div>\n';
  h += '<h3>' + T.sum + '</h3><ul>' + o.s.map((s) => '<li>' + s[I] + '</li>').join('') + '</ul>\n';
  h += '<h3>' + T.more + '</h3>' + lk(o.l, 1 + I) + '\n';
  h += '<h3>' + T.prac + '</h3><ol>' + o.p.map((p) => '<li>' + p[I] + '<div class="dap-an"><strong>' + T.ans + ':</strong> ' + p[2 + I] + '</div></li>').join('') + '</ol>';
  return h;
};
// Phần mở rộng (09/11/2026): ví dụ làm từng bước với sự kiện HƯ CẤU, danh sách kiểm, mẫu; số liệu minh hoạ đều là giả định.
const EXTRA = {};
EXTRA['eem201-ts-1-1'] = { en: `<h4>Worked mini-case (fictional): sorting a university week into sectors</h4>
<p>Imagine a fictional university in Vietnam holding "Green Summer Week". Ask of each activity: is it entertainment, an event, or both?</p>
<ol><li>Step 1 — List the activities: an open-air band night, a career talk by a bank, an esports bracket in the dorm hall, a Spotify playlist shared by the club.</li>
<li>Step 2 — Test "planned, limited in time and place, gathers people for a purpose". The band night, career talk and esports bracket pass; the shared playlist fails (no place, no gathering), so it is entertainment content but not an event.</li>
<li>Step 3 — Assign sectors: music, business (a small corporate event), games and esports.</li>
<li>Step 4 — Note the consequence: each sector brings different suppliers (sound company, bank sponsor, gaming hardware), so the same week needs three different kinds of planning.</li></ol>
<h4>Checklist: is it an event?</h4>
<ul><li>Is there a start and end time and a defined place (physical or online)?</li><li>Is there a clear purpose that someone could write in one sentence?</li><li>Do people gather, in person or live online, at the same moment?</li><li>Is someone responsible for planning and for what goes wrong?</li></ul>
<p>If you answer "no" to the last question, nobody will fix problems on the day, and that is the first thing a professional organiser removes from the plan.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): xếp một tuần hoạt động của trường vào các mảng</h4>
<p>Giả sử một trường đại học hư cấu ở Việt Nam tổ chức "Tuần lễ Mùa Hè Xanh". Với mỗi hoạt động, hãy hỏi: đây là giải trí, sự kiện, hay cả hai?</p>
<ol><li>Bước 1 — Liệt kê hoạt động: đêm nhạc ngoài trời của ban nhạc, buổi nói chuyện nghề nghiệp của một ngân hàng, vòng thi esports ở sảnh ký túc xá, danh sách phát nhạc câu lạc bộ chia sẻ.</li>
<li>Bước 2 — Thử với tiêu chí "có kế hoạch, giới hạn thời gian và địa điểm, quy tụ người vì một mục đích". Đêm nhạc, buổi nói chuyện và vòng thi đều đạt; danh sách phát nhạc thì không (không có địa điểm, không có sự tụ họp), nên nó là nội dung giải trí chứ không phải sự kiện.</li>
<li>Bước 3 — Gán mảng: âm nhạc, kinh doanh (sự kiện doanh nghiệp nhỏ), game và esports.</li>
<li>Bước 4 — Ghi hệ quả: mỗi mảng cần nhà cung cấp khác nhau (công ty âm thanh, ngân hàng tài trợ, thiết bị game), nên cùng một tuần phải lập ba kiểu kế hoạch khác nhau.</li></ol>
<h4>Danh sách kiểm: đây có phải sự kiện không?</h4>
<ul><li>Có giờ bắt đầu, kết thúc và địa điểm xác định (thật hoặc trực tuyến) không?</li><li>Có mục đích rõ mà ai cũng viết được trong một câu không?</li><li>Mọi người có tụ họp, tại chỗ hoặc trực tuyến cùng lúc, không?</li><li>Có ai chịu trách nhiệm lập kế hoạch và xử lý khi sự cố không?</li></ul>
<p>Nếu câu trả lời cuối là "không", ngày diễn ra sẽ không ai sửa lỗi, và đó là điều đầu tiên người tổ chức chuyên nghiệp loại bỏ khỏi kế hoạch.</p>`,
p: [['Is a podcast recording sold as an audio file an event? Explain with the checklist.', 'Một bản ghi podcast bán dạng tệp âm thanh có phải sự kiện không? Giải thích bằng danh sách kiểm.', 'No: it has no shared time or place and nobody gathers. It is entertainment content. A live podcast show with an audience is an event.', 'Không: không có thời gian, địa điểm chung và không ai tụ họp. Đó là nội dung giải trí. Một buổi podcast trực tiếp có khán giả mới là sự kiện.']] };

EXTRA['eem201-ts-1-2'] = { en: `<h4>Worked mini-case (fictional): who gets what from one ticket</h4>
<p>A fictional promoter, "Sao Mai Live", stages a one-night show for a young pop singer at a rented hall. All figures below are assumed for teaching and are not real data.</p>
<ol><li>Step 1 — Draw the chain: artist, manager, promoter, venue and production crew, ticketing platform, audience.</li>
<li>Step 2 — Assume the ticket price is 500,000 VND and the platform keeps a fee of 5% (assumed). The platform's share is 25,000 VND; the remaining 475,000 VND goes to the promoter's account.</li>
<li>Step 3 — From the 475,000 VND the promoter must pay hall rental, sound and lights, security, the artist fee and marketing. The promoter pays all these costs before the doors open, so the promoter holds the risk.</li>
<li>Step 4 — Add other lines that do not depend on tickets: a drinks sponsor, merchandise sold in the foyer, food and beverage counters.</li></ol>
<h4>Revenue-line template</h4>` + tbl(['Revenue line', 'Who controls it', 'Question to ask'], [['Tickets', 'Promoter and platform', 'What is the net amount after fees?'], ['Sponsorship', 'Promoter or event owner', 'What does the sponsor receive in return?'], ['Food and beverage', 'Venue or vendors', 'Is it a commission or the promoter\'s own sales?'], ['Merchandise', 'Artist or promoter', 'Who splits the profit?'], ['Rights and grants', 'Owner or authority', 'Are there conditions or reporting duties?']]) + `<p><strong>Common mistake:</strong> counting gross ticket sales as income. Always subtract platform fees, taxes and refunds, or the budget will look healthier than it is.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): ai nhận gì từ một tấm vé</h4>
<p>Một đơn vị tổ chức hư cấu, "Sao Mai Live", dựng một đêm diễn cho ca sĩ nhạc pop trẻ tại một hội trường thuê. Mọi con số dưới đây là giả định để dạy học, không phải dữ liệu thật.</p>
<ol><li>Bước 1 — Vẽ chuỗi: nghệ sĩ, quản lý, nhà tổ chức, địa điểm và đội sản xuất, nền tảng bán vé, khán giả.</li>
<li>Bước 2 — Giả định giá vé 500.000 đồng và nền tảng giữ phí 5% (giả định). Phần của nền tảng là 25.000 đồng; 475.000 đồng còn lại chuyển cho nhà tổ chức.</li>
<li>Bước 3 — Từ 475.000 đồng, nhà tổ chức phải trả tiền thuê hội trường, âm thanh ánh sáng, an ninh, cát-xê nghệ sĩ và marketing. Các khoản này phải trả trước khi mở cửa, nên nhà tổ chức gánh rủi ro.</li>
<li>Bước 4 — Thêm các khoản không phụ thuộc vé: nhà tài trợ đồ uống, quà lưu niệm bán ở sảnh, quầy ăn uống.</li></ol>
<h4>Mẫu các nguồn thu</h4>` + tbl(['Nguồn thu', 'Ai kiểm soát', 'Câu hỏi cần đặt'], [['Vé', 'Nhà tổ chức và nền tảng', 'Số thực nhận sau phí là bao nhiêu?'], ['Tài trợ', 'Nhà tổ chức hoặc chủ sự kiện', 'Nhà tài trợ nhận lại gì?'], ['Ăn uống', 'Địa điểm hoặc đối tác bán hàng', 'Là hoa hồng hay doanh thu tự bán?'], ['Quà lưu niệm', 'Nghệ sĩ hoặc nhà tổ chức', 'Chia lợi nhuận thế nào?'], ['Bản quyền và tài trợ công', 'Chủ sở hữu hoặc cơ quan', 'Có điều kiện hay nghĩa vụ báo cáo không?']]) + `<p><strong>Lỗi hay gặp:</strong> tính doanh thu vé gộp là thu nhập. Luôn trừ phí nền tảng, thuế và tiền hoàn vé, nếu không ngân sách sẽ trông khoẻ hơn thực tế.</p>`,
p: [['In the case, which party holds the financial risk and why?', 'Trong tình huống trên, bên nào gánh rủi ro tài chính và vì sao?', 'The promoter, because costs are paid before ticket income is certain.', 'Nhà tổ chức, vì chi phí phải trả trước khi chắc chắn có tiền vé.']] };

EXTRA['eem201-ts-1-3'] = { en: `<h4>Worked mini-case (fictional): is a city festival worth backing?</h4>
<p>A fictional coastal town, "Bien Xanh", considers a three-day seafood and music festival in the low tourist season. All numbers are assumed.</p>
<ol><li>Step 1 — State the public goal: lift visitor nights in a quiet month, and show the town's identity.</li>
<li>Step 2 — Estimate new visitors, not total attendance. Assume 6,000 attendees, of whom 40% (2,400) are outside visitors. Residents' spending only moves money around the town.</li>
<li>Step 3 — Assume each outside visitor spends 1,200,000 VND on rooms, food and transport. The visitor spending is then 2,400 × 1,200,000 = 2,880,000,000 VND (assumed).</li>
<li>Step 4 — Compare with the public cost (stage, security, cleaning). If the town spends less than the new money brought in, the case is plausible; add non-money benefits such as pride and media attention.</li>
<li>Step 5 — Plan the risks: weather, traffic, waste. A good proposal names them before the council asks.</li></ol>
<h4>Checklist for a public-support proposal</h4>
<ul><li>Goal linked to tourism, culture or education policy.</li><li>Share of outside visitors, not just total tickets.</li><li>Costs borne by the public and by sponsors.</li><li>Plan for residents: noise, parking, cleaning.</li><li>Report back after the event with real numbers.</li></ul>`,
vi: `<h4>Tình huống mẫu (hư cấu): có nên hậu thuẫn một lễ hội thành phố?</h4>
<p>Một thị trấn ven biển hư cấu, "Biển Xanh", cân nhắc tổ chức lễ hội hải sản và âm nhạc ba ngày vào mùa thấp điểm. Mọi con số là giả định.</p>
<ol><li>Bước 1 — Nêu mục tiêu công: tăng số đêm lưu trú trong tháng vắng khách và quảng bá bản sắc thị trấn.</li>
<li>Bước 2 — Ước tính khách mới đến, không phải tổng người dự. Giả định 6.000 người dự, trong đó 40% (2.400) là khách từ nơi khác. Chi tiêu của cư dân chỉ chuyển tiền quanh thị trấn.</li>
<li>Bước 3 — Giả định mỗi khách ngoài chi 1.200.000 đồng cho phòng, ăn uống, đi lại. Khi đó chi tiêu của khách là 2.400 × 1.200.000 = 2.880.000.000 đồng (giả định).</li>
<li>Bước 4 — So với chi phí công (sân khấu, an ninh, vệ sinh). Nếu thị trấn chi ít hơn số tiền mới mang về thì đề xuất có cơ sở; thêm lợi ích phi tiền như niềm tự hào và truyền thông.</li>
<li>Bước 5 — Lập kế hoạch rủi ro: thời tiết, giao thông, rác. Một đề xuất tốt nêu sẵn các điều này trước khi hội đồng hỏi.</li></ol>
<h4>Danh sách kiểm cho đề xuất xin hỗ trợ công</h4>
<ul><li>Mục tiêu gắn với chính sách du lịch, văn hoá hoặc giáo dục.</li><li>Tỷ lệ khách từ nơi khác, không chỉ tổng số vé.</li><li>Chi phí do nhà nước và nhà tài trợ chịu.</li><li>Phương án cho cư dân: tiếng ồn, chỗ đỗ xe, vệ sinh.</li><li>Báo cáo lại sau sự kiện bằng số liệu thật.</li></ul>`,
p: [['Why count outside visitors rather than total attendance when estimating economic benefit?', 'Vì sao khi ước tính lợi ích kinh tế phải đếm khách ngoài thay vì tổng số người dự?', 'Residents would spend their money locally anyway; only new money from outside adds to the local economy.', 'Cư dân dù sao cũng chi tiền tại địa phương; chỉ tiền mới từ bên ngoài mới làm tăng kinh tế địa phương.']] };

EXTRA['eem201-ts-2-1'] = { en: `<h4>Worked mini-case (fictional): classifying three events</h4>
<p>Use the axes of size, purpose, audience, frequency, setting and sector on three fictional events.</p>` + tbl(['Axis', 'A: Campus Music Night', 'B: TechViet Product Launch', 'C: Delta Tourism Expo'], [['Size', 'Local, about 800 (assumed)', 'Small, 150 invited (assumed)', 'Major, several thousand (assumed)'], ['Purpose', 'Entertainment, club identity', 'Brand and sales', 'Trade and promotion'], ['Audience', 'Students', 'Press, partners, customers', 'Companies and public'], ['Frequency', 'Annual', 'One-off', 'Annual'], ['Setting', 'Open-air campus', 'Hotel ballroom', 'Exhibition hall'], ['Sector', 'Music', 'Business', 'MICE']]) + `<ol><li>Step 1 — Fill the table before you design anything.</li><li>Step 2 — Read the consequences: A needs sound, a stage permit and student security; B needs a script, demo equipment and press handling; C needs booth layout, exhibitor contracts and visitor flow.</li><li>Step 3 — Use the class to estimate staff, insurance and budget: a hallmark annual event justifies a permanent team, a one-off does not.</li></ol>
<p><strong>Common mistakes:</strong> using a single label such as "big event" and forgetting that a small event can be high risk (a rooftop party), or that size alone does not decide the permits.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): phân loại ba sự kiện</h4>
<p>Dùng các trục quy mô, mục đích, khán giả, tần suất, bối cảnh và mảng cho ba sự kiện hư cấu.</p>` + tbl(['Trục', 'A: Đêm nhạc trường', 'B: Ra mắt sản phẩm TechViet', 'C: Hội chợ du lịch Đồng bằng'], [['Quy mô', 'Địa phương, khoảng 800 (giả định)', 'Nhỏ, 150 khách mời (giả định)', 'Lớn, vài nghìn người (giả định)'], ['Mục đích', 'Giải trí, bản sắc câu lạc bộ', 'Thương hiệu và bán hàng', 'Giao thương và quảng bá'], ['Khán giả', 'Sinh viên', 'Báo chí, đối tác, khách hàng', 'Doanh nghiệp và công chúng'], ['Tần suất', 'Hằng năm', 'Một lần', 'Hằng năm'], ['Bối cảnh', 'Ngoài trời trong trường', 'Phòng tiệc khách sạn', 'Hội trường triển lãm'], ['Mảng', 'Âm nhạc', 'Kinh doanh', 'MICE']]) + `<ol><li>Bước 1 — Điền bảng trước khi thiết kế bất cứ thứ gì.</li><li>Bước 2 — Đọc hệ quả: A cần âm thanh, giấy phép sân khấu và an ninh sinh viên; B cần kịch bản, thiết bị demo và xử lý báo chí; C cần sơ đồ gian hàng, hợp đồng đơn vị trưng bày và dòng khách.</li><li>Bước 3 — Dùng phân loại để ước tính nhân sự, bảo hiểm và ngân sách: sự kiện thường niên danh tiếng đáng có đội cố định, sự kiện một lần thì không.</li></ol>
<p><strong>Lỗi hay gặp:</strong> dùng một nhãn như "sự kiện lớn" mà quên rằng sự kiện nhỏ vẫn có thể rủi ro cao (tiệc trên sân thượng), và quy mô một mình không quyết định giấy phép.</p>`,
p: [['Classify a one-off 60-person training workshop on the six axes.', 'Phân loại một buổi tập huấn 60 người, diễn ra một lần, theo sáu trục.', 'Small; learning; employees; one-off; classroom or meeting room; business.', 'Nhỏ; học tập; nhân viên; một lần; phòng học hoặc phòng họp; kinh doanh.']] };

EXTRA['eem201-ts-2-2'] = { en: `<h4>Worked mini-case (fictional): turning a concert into a one-day festival</h4>
<p>A fictional club, "Hoa Phuong Collective", has a successful 800-guest concert and wants a one-day festival with three stages. List what changes, step by step.</p>
<ol><li>Step 1 — Identity: write one sentence ("indie music and street food by the river"). Everything else must serve it.</li>
<li>Step 2 — Site: a concert has one room; a festival is a temporary city with entrances, stages, food area, toilets, first aid, water and a control room.</li>
<li>Step 3 — Time: draw a stage schedule so that sets do not overlap in a way that creates a crush at one stage.</li>
<li>Step 4 — Money: add income lines (food vendors, stalls, partners) and expense lines (fencing, generators, waste, welfare) that a concert never had.</li>
<li>Step 5 — People: multiply staff by the number of zones and add a safety lead with authority.</li></ol>
<h4>Festival readiness checklist</h4>
<ul><li>One-sentence identity and target audience.</li><li>Site map with entry, exits, stages, toilets, first aid and water.</li><li>Stage timetable with changeover times.</li><li>Waste, power and noise plan.</li><li>Named safety lead and communication channel.</li></ul>
<p><strong>Common mistake:</strong> adding stages and acts without checking the site capacity. More lineup does not mean more space.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): biến một buổi hoà nhạc thành lễ hội một ngày</h4>
<p>Một câu lạc bộ hư cấu, "Hoa Phượng Collective", có buổi hoà nhạc 800 khách thành công và muốn làm lễ hội một ngày với ba sân khấu. Liệt kê từng bước điều gì thay đổi.</p>
<ol><li>Bước 1 — Bản sắc: viết một câu ("nhạc indie và đồ ăn đường phố bên sông"). Mọi thứ khác phải phục vụ câu đó.</li>
<li>Bước 2 — Địa điểm: hoà nhạc có một phòng; lễ hội là một thành phố tạm với cổng vào, sân khấu, khu ẩm thực, nhà vệ sinh, y tế, nước và phòng điều hành.</li>
<li>Bước 3 — Thời gian: vẽ lịch các sân khấu để các suất diễn không chồng khiến đám đông dồn về một sân khấu.</li>
<li>Bước 4 — Tiền: thêm nguồn thu (gian ăn uống, gian hàng, đối tác) và khoản chi (hàng rào, máy phát điện, rác, chăm sóc khách) mà buổi hoà nhạc chưa từng có.</li>
<li>Bước 5 — Con người: nhân nhân sự theo số khu vực và thêm một trưởng an toàn có thẩm quyền.</li></ol>
<h4>Danh sách sẵn sàng cho lễ hội</h4>
<ul><li>Bản sắc một câu và khán giả mục tiêu.</li><li>Sơ đồ địa điểm có lối vào, lối thoát, sân khấu, vệ sinh, y tế, nước.</li><li>Lịch sân khấu có thời gian chuyển cảnh.</li><li>Kế hoạch rác, điện, tiếng ồn.</li><li>Trưởng an toàn có tên và kênh liên lạc.</li></ul>
<p><strong>Lỗi hay gặp:</strong> thêm sân khấu và nghệ sĩ mà không kiểm sức chứa địa điểm. Nhiều nghệ sĩ hơn không có nghĩa là có thêm chỗ.</p>`,
p: [['Name two cost lines a festival has that a single concert in a hall may not.', 'Kể hai khoản chi mà lễ hội có còn buổi hoà nhạc trong hội trường có thể không có.', 'For example fencing and generators; also waste collection and extra welfare services.', 'Ví dụ hàng rào và máy phát điện; cũng có thu gom rác và dịch vụ chăm sóc thêm.']] };

EXTRA['eem201-ts-2-3'] = { en: `<h4>Worked mini-case (fictional): a two-day MICE conference</h4>
<p>A fictional association plans "ViệtMICE Summit", a two-day conference with an exhibition area. Figures are assumed.</p>
<ol><li>Step 1 — Define the type: a conference (M and C of MICE) plus a small exhibition (E).</li>
<li>Step 2 — Define delegates: assume 400 paying delegates and 30 exhibitor booths.</li>
<li>Step 3 — Split the income: delegate fees, booth fees and sponsors. Delegates expect content quality, Wi-Fi, coffee breaks and networking.</li>
<li>Step 4 — Plan the programme: keynote, three parallel tracks, lunch, exhibition time, closing. Allow break time between sessions so that rooms can reset.</li>
<li>Step 5 — Decide hybrid or not: if streaming, a second production team handles cameras and a moderator for online questions.</li></ol>
<h4>Quick template: sport and community events</h4>` + tbl(['Type', 'Fixed by', 'Key partners', 'Typical risk'], [['Sport', 'Rules and calendar', 'Federation, broadcaster, medics', 'Injury, crowd, weather'], ['Community', 'Social goal', 'Volunteers, local authority', 'Low budget, volunteer shortage'], ['Hybrid', 'Both audiences', 'Streaming crew', 'Network failure']]) + `<p><strong>Common mistake:</strong> treating the online audience as an afterthought. A hybrid event needs its own script, moderator and test.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): hội nghị MICE hai ngày</h4>
<p>Một hiệp hội hư cấu lên kế hoạch "ViệtMICE Summit", hội nghị hai ngày kèm khu triển lãm. Số liệu là giả định.</p>
<ol><li>Bước 1 — Xác định loại: hội nghị (M và C của MICE) cộng triển lãm nhỏ (E).</li>
<li>Bước 2 — Xác định đại biểu: giả định 400 đại biểu trả phí và 30 gian hàng.</li>
<li>Bước 3 — Chia nguồn thu: phí đại biểu, phí gian hàng và tài trợ. Đại biểu kỳ vọng nội dung tốt, Wi-Fi, giờ giải lao và cơ hội kết nối.</li>
<li>Bước 4 — Lập chương trình: diễn giả chính, ba luồng song song, bữa trưa, giờ triển lãm, bế mạc. Chừa thời gian giữa các phiên để phòng kịp chuẩn bị lại.</li>
<li>Bước 5 — Quyết định có hybrid hay không: nếu phát trực tuyến, cần đội sản xuất thứ hai lo máy quay và người điều phối câu hỏi trực tuyến.</li></ol>
<h4>Mẫu nhanh: sự kiện thể thao và cộng đồng</h4>` + tbl(['Loại', 'Do cái gì quy định', 'Đối tác chính', 'Rủi ro điển hình'], [['Thể thao', 'Luật thi đấu và lịch', 'Liên đoàn, đài phát sóng, y tế', 'Chấn thương, đám đông, thời tiết'], ['Cộng đồng', 'Mục tiêu xã hội', 'Tình nguyện viên, chính quyền địa phương', 'Ngân sách thấp, thiếu tình nguyện viên'], ['Hybrid', 'Cả hai nhóm khán giả', 'Đội phát trực tuyến', 'Mất mạng']]) + `<p><strong>Lỗi hay gặp:</strong> coi khán giả trực tuyến là phần phụ. Sự kiện hybrid cần kịch bản, người điều phối và buổi chạy thử riêng.</p>`,
p: [['In the case, which two things must be ready for the online audience?', 'Trong tình huống, hai thứ nào phải sẵn sàng cho khán giả trực tuyến?', 'A second production team (cameras, streaming) and a moderator for online questions.', 'Đội sản xuất thứ hai (máy quay, phát trực tuyến) và người điều phối câu hỏi trực tuyến.']] };

EXTRA['eem201-ts-3-1'] = { en: `<h4>Worked mini-case (fictional): mapping stakeholders of a campus music night</h4>
<ol><li>Step 1 — Brainstorm everyone who affects or is affected: students, the faculty advisor, the dean's office, security, neighbours of the campus, a drinks sponsor, the sound company, the artist, the local police, volunteers.</li>
<li>Step 2 — Rate each for power (can stop or shape the event) and interest (cares about the outcome). Use high/low only.</li>
<li>Step 3 — Place them on the grid.</li></ol>` + tbl(['Quadrant', 'Examples', 'Approach'], [['High power, high interest', 'Dean\'s office, sponsor, security lead', 'Manage closely: regular meetings, written agreement'], ['High power, low interest', 'Local police, fire inspector', 'Keep satisfied: send required notices early'], ['Low power, high interest', 'Students, volunteers, artist fans', 'Keep informed: clear updates, FAQ'], ['Low power, low interest', 'Distant residents', 'Monitor: notice if noise complaints grow']]) + `<ol start="4"><li>Step 4 — Note conflicting expectations: the sponsor wants more logos, the artist wants a clean stage, the students want low prices. Write the compromise into the brief.</li></ol>
<p><strong>Common mistakes:</strong> forgetting neighbours and authorities until they complain, and keeping the grid once and never updating it as the plan changes.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): vẽ bản đồ các bên liên quan của đêm nhạc trường</h4>
<ol><li>Bước 1 — Liệt kê mọi người ảnh hưởng hoặc bị ảnh hưởng: sinh viên, cố vấn khoa, văn phòng trưởng khoa, bảo vệ, hàng xóm quanh trường, nhà tài trợ đồ uống, công ty âm thanh, nghệ sĩ, công an địa phương, tình nguyện viên.</li>
<li>Bước 2 — Đánh giá quyền lực (có thể ngăn hoặc định hình sự kiện) và mức quan tâm (quan tâm kết quả). Chỉ dùng cao/thấp.</li>
<li>Bước 3 — Đặt vào lưới.</li></ol>` + tbl(['Góc', 'Ví dụ', 'Cách tiếp cận'], [['Quyền lực cao, quan tâm cao', 'Văn phòng trưởng khoa, nhà tài trợ, trưởng an ninh', 'Quản lý sát: họp định kỳ, thỏa thuận bằng văn bản'], ['Quyền lực cao, quan tâm thấp', 'Công an địa phương, thanh tra cứu hỏa', 'Giữ hài lòng: gửi thông báo bắt buộc sớm'], ['Quyền lực thấp, quan tâm cao', 'Sinh viên, tình nguyện viên, người hâm mộ', 'Giữ thông tin: cập nhật rõ ràng, trang hỏi đáp'], ['Quyền lực thấp, quan tâm thấp', 'Cư dân ở xa', 'Theo dõi: để ý khi khiếu nại tiếng ồn tăng']]) + `<ol start="4"><li>Bước 4 — Ghi các kỳ vọng mâu thuẫn: nhà tài trợ muốn nhiều logo, nghệ sĩ muốn sân khấu gọn, sinh viên muốn giá thấp. Ghi thoả hiệp vào bản brief.</li></ol>
<p><strong>Lỗi hay gặp:</strong> quên hàng xóm và cơ quan chức năng cho đến khi họ phàn nàn, và vẽ lưới một lần rồi không cập nhật khi kế hoạch đổi.</p>`,
p: [['Where would you place a drinks sponsor who pays a lot and checks emails daily?', 'Bạn đặt nhà tài trợ đồ uống chi nhiều và đọc email hằng ngày ở góc nào?', 'High power, high interest: manage closely.', 'Quyền lực cao, quan tâm cao: quản lý sát.']] };

EXTRA['eem201-ts-3-2'] = { en: `<h4>Worked mini-case (fictional): staffing a startup product launch</h4>
<p>"TechViet" is a fictional company launching an app at a hotel, for 150 invited guests (assumed). Build a team with a small WBS.</p>
<ol><li>Step 1 — Event lead: one person owns the decisions and the budget.</li>
<li>Step 2 — Split into areas: content and stage, production (sound, light, screens), guests and registration, marketing and press, finance, safety.</li>
<li>Step 3 — Break each area into tasks with an owner and a due date.</li>
<li>Step 4 — Check there is one owner per task, not "everyone".</li></ol>` + tbl(['Area', 'Task', 'Owner role', 'Due (before day)'], [['Content', 'Final script and slides', 'Creative lead', '7 days'], ['Production', 'Sound check and screen test', 'Stage manager', '1 day'], ['Guests', 'Invitations and check-in list', 'Guest coordinator', '14 days'], ['Press', 'Press release and media list', 'PR lead', '10 days'], ['Safety', 'Exit plan and briefing', 'Safety lead', '3 days']]) + `<p>Due dates are illustrative. <strong>Common mistakes:</strong> giving one person three jobs on the day, no deputy for the lead, and volunteers without a briefing or a break.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): bố trí nhân sự cho buổi ra mắt sản phẩm của startup</h4>
<p>"TechViet" là công ty hư cấu ra mắt ứng dụng tại khách sạn cho 150 khách mời (giả định). Xây đội ngũ cùng WBS nhỏ.</p>
<ol><li>Bước 1 — Trưởng sự kiện: một người sở hữu quyết định và ngân sách.</li>
<li>Bước 2 — Chia mảng: nội dung và sân khấu, sản xuất (âm thanh, ánh sáng, màn hình), khách và đăng ký, marketing và báo chí, tài chính, an toàn.</li>
<li>Bước 3 — Chia mỗi mảng thành đầu việc có người phụ trách và hạn.</li>
<li>Bước 4 — Kiểm mỗi đầu việc có một người phụ trách, không phải "mọi người".</li></ol>` + tbl(['Mảng', 'Việc', 'Vai phụ trách', 'Hạn (trước ngày diễn)'], [['Nội dung', 'Kịch bản và slide cuối', 'Trưởng sáng tạo', '7 ngày'], ['Sản xuất', 'Thử âm thanh và màn hình', 'Điều phối sân khấu', '1 ngày'], ['Khách', 'Thư mời và danh sách check-in', 'Điều phối khách', '14 ngày'], ['Báo chí', 'Thông cáo và danh sách báo', 'Trưởng PR', '10 ngày'], ['An toàn', 'Sơ đồ thoát hiểm và họp triển khai', 'Trưởng an toàn', '3 ngày']]) + `<p>Hạn chỉ mang tính minh hoạ. <strong>Lỗi hay gặp:</strong> giao một người ba việc trong ngày diễn, trưởng nhóm không có người thay, và tình nguyện viên không được hướng dẫn hay nghỉ giải lao.</p>`,
p: [['Why is "everyone" a bad owner for a task?', 'Vì sao "mọi người" là người phụ trách tệ cho một đầu việc?', 'When everyone owns it, nobody is accountable and the task is dropped.', 'Khi mọi người cùng phụ trách thì không ai chịu trách nhiệm và việc bị bỏ sót.']] };

EXTRA['eem201-ts-3-3'] = { en: `<h4>Worked mini-case (fictional): contracting a sound supplier</h4>
<p>The fictional "Hoa Phuong Collective" needs sound and lights for its river festival. Walk through brief, RFP and contract.</p>
<ol><li>Step 1 — Write a brief: date, site, number of stages, expected audience, technical needs, budget range.</li>
<li>Step 2 — Send the same RFP to three suppliers and ask for a price, equipment list, crew, insurance, references and a plan for bad weather.</li>
<li>Step 3 — Compare on a weighted sheet: price 35%, equipment fit 25%, experience 20%, insurance 10%, service 10% (weights assumed).</li>
<li>Step 4 — Sign a contract that names the date, scope, price, payment dates, cancellation terms, liability and who sets up and removes the equipment.</li></ol>
<h4>Contract checklist</h4>
<ul><li>Parties and date.</li><li>Exact scope and deliverables.</li><li>Price, tax and payment schedule.</li><li>Cancellation and change rules.</li><li>Insurance and who is liable for damage.</li><li>Rights for music and images, if any.</li></ul>
<p>This is a teaching summary, not legal advice; have a qualified person review real contracts. <strong>Common mistake:</strong> agreeing by chat message and discovering on the day that the stage height or power was never written down.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): ký hợp đồng với nhà cung cấp âm thanh</h4>
<p>"Hoa Phượng Collective" hư cấu cần âm thanh và ánh sáng cho lễ hội ven sông. Đi qua brief, RFP và hợp đồng.</p>
<ol><li>Bước 1 — Viết brief: ngày, địa điểm, số sân khấu, khán giả dự kiến, yêu cầu kỹ thuật, khung ngân sách.</li>
<li>Bước 2 — Gửi cùng một RFP cho ba nhà cung cấp, yêu cầu giá, danh sách thiết bị, đội kỹ thuật, bảo hiểm, tham chiếu và phương án khi thời tiết xấu.</li>
<li>Bước 3 — So sánh trên bảng có trọng số: giá 35%, phù hợp thiết bị 25%, kinh nghiệm 20%, bảo hiểm 10%, dịch vụ 10% (trọng số giả định).</li>
<li>Bước 4 — Ký hợp đồng nêu ngày, phạm vi, giá, đợt thanh toán, điều khoản huỷ, trách nhiệm và ai lắp dựng, tháo dỡ thiết bị.</li></ol>
<h4>Danh sách kiểm hợp đồng</h4>
<ul><li>Các bên và ngày ký.</li><li>Phạm vi và sản phẩm bàn giao chính xác.</li><li>Giá, thuế và lịch thanh toán.</li><li>Quy tắc huỷ và thay đổi.</li><li>Bảo hiểm và ai chịu trách nhiệm hư hại.</li><li>Quyền với âm nhạc và hình ảnh nếu có.</li></ul>
<p>Đây là tóm tắt để học, không phải tư vấn pháp lý; hợp đồng thật cần người có chuyên môn xem lại. <strong>Lỗi hay gặp:</strong> chốt qua tin nhắn rồi đến ngày diễn mới phát hiện chiều cao sân khấu hay nguồn điện chưa từng được ghi.</p>`,
p: [['Name three things an RFP should ask suppliers to include.', 'Kể ba thứ mà RFP nên yêu cầu nhà cung cấp nêu.', 'For example price, equipment list, insurance, references or a bad-weather plan.', 'Ví dụ giá, danh sách thiết bị, bảo hiểm, tham chiếu hoặc phương án thời tiết xấu.']] };

EXTRA['eem201-ts-4-1'] = { en: `<h4>Worked mini-case (fictional): from idea to go / no-go</h4>
<p>Idea: a fictional "Night Market Music Fair" at a university square. Follow the steps with assumed values.</p>
<ol><li>Step 1 — Concept in 5 W + How: Who (students and neighbours), What (live bands and food stalls), When (a Saturday evening in the dry season), Where (the main square), Why (give student bands a stage and raise funds for a scholarship), How (volunteer team, sponsors, free entry with paid food).</li>
<li>Step 2 — Write SMART objectives: "Welcome 1,500 visitors (assumed) between 17:00 and 22:00; raise 80,000,000 VND (assumed) for the scholarship; reach a satisfaction score of at least 4 out of 5 in a short survey."</li>
<li>Step 3 — Feasibility: check the date against exams and holidays, the square's availability, the budget, the safety rules and volunteer numbers.</li>
<li>Step 4 — Decide: go, no-go or go with conditions, and record who decided and why.</li></ol>` + tbl(['Feasibility area', 'Question', 'Result (example)'], [['Date', 'Does it clash with exams or holidays?', 'Clear'], ['Site', 'Is the square free and large enough?', 'Needs approval'], ['Money', 'Can sponsors and stalls cover the costs?', 'Probable'], ['Safety', 'Can we meet exits and medical needs?', 'Yes with hired medics'], ['People', 'Do we have 40 volunteers?', 'Recruit']]) + `<p><strong>Common mistakes:</strong> objectives such as "make it great"; skipping the feasibility check because the idea is exciting; no written decision, so the team argues again in week six.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): từ ý tưởng đến quyết định đi / không đi</h4>
<p>Ý tưởng: "Hội chợ đêm âm nhạc" hư cấu tại sân trường. Làm theo các bước với giá trị giả định.</p>
<ol><li>Bước 1 — Ý tưởng theo 5 W + How: Ai (sinh viên và hàng xóm), Gì (ban nhạc sống và gian ăn uống), Khi nào (một tối thứ Bảy mùa khô), Ở đâu (sân chính), Vì sao (cho ban nhạc sinh viên có sân khấu và gây quỹ học bổng), Thế nào (đội tình nguyện, nhà tài trợ, vào cổng miễn phí, ăn uống trả tiền).</li>
<li>Bước 2 — Viết mục tiêu SMART: "Đón 1.500 lượt khách (giả định) từ 17:00 đến 22:00; gây quỹ 80.000.000 đồng (giả định) cho học bổng; đạt điểm hài lòng ít nhất 4 trên 5 trong khảo sát ngắn."</li>
<li>Bước 3 — Tính khả thi: kiểm ngày với lịch thi và lễ, tình trạng sân, ngân sách, quy tắc an toàn và số tình nguyện viên.</li>
<li>Bước 4 — Quyết định: đi, không đi hoặc đi có điều kiện, và ghi ai quyết định, vì sao.</li></ol>` + tbl(['Mảng khả thi', 'Câu hỏi', 'Kết quả (ví dụ)'], [['Ngày', 'Có trùng lịch thi hoặc lễ không?', 'Ổn'], ['Địa điểm', 'Sân có trống và đủ rộng không?', 'Cần phê duyệt'], ['Tiền', 'Tài trợ và gian hàng có bù được chi phí không?', 'Có khả năng'], ['An toàn', 'Đáp ứng lối thoát và y tế được không?', 'Được, thuê nhân viên y tế'], ['Con người', 'Có 40 tình nguyện viên không?', 'Cần tuyển']]) + `<p><strong>Lỗi hay gặp:</strong> mục tiêu kiểu "làm cho thật hay"; bỏ qua kiểm khả thi vì ý tưởng hấp dẫn; không ghi quyết định nên đến tuần thứ sáu cả nhóm lại cãi lại từ đầu.</p>`,
p: [['Rewrite "get many people" as a SMART objective for a fictional campus event.', 'Viết lại "có nhiều người" thành mục tiêu SMART cho một sự kiện trường hư cấu.', 'Example: "Reach 800 check-ins between 18:00 and 21:00 on the event day." Any measurable, time-bound version is fine.', 'Ví dụ: "Đạt 800 lượt check-in từ 18:00 đến 21:00 vào ngày diễn." Phiên bản đo được và có hạn là đủ.']] };

EXTRA['eem201-ts-4-2'] = { en: `<h4>Worked mini-case (fictional): a six-step critical path</h4>
<p>For the fictional "Night Market Music Fair" (event in week 12), these durations are assumed for teaching.</p>` + tbl(['Task', 'Duration (weeks)', 'Depends on'], [['A. Concept and go decision', '2', '—'], ['B. Permit application and approval', '5', 'A'], ['C. Sponsor proposals and contracts', '4', 'A'], ['D. Book sound and stage', '2', 'C'], ['E. Ticket and marketing launch', '3', 'A'], ['F. Volunteer recruitment and briefing', '4', 'A'], ['G. Final setup', '1', 'B, D, E, F']]) + `<ol><li>Step 1 — Trace each route from A to G. A-B-G = 2 + 5 + 1 = 8; A-C-D-G = 2 + 4 + 2 + 1 = 9; A-E-G = 6; A-F-G = 7.</li>
<li>Step 2 — The longest route is A-C-D-G with 9 weeks. It is the critical path: any delay there delays the event.</li>
<li>Step 3 — Slack: the permit route has 1 week of slack (9 − 8), marketing has 3 and volunteers 2.</li>
<li>Step 4 — With 12 weeks available, there are 3 weeks of buffer. Keep them for weather, approvals and illness.</li></ol>
<p>Note that in this assumed example the permit route is not critical, but it has little slack; if approval takes 6 weeks it becomes critical. Re-check after every change.</p>
<p><strong>Common mistakes:</strong> counting from today forward without a buffer, forgetting that tasks run in parallel, and never updating the Gantt chart.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): đường găng sáu bước</h4>
<p>Với "Hội chợ đêm âm nhạc" hư cấu (sự kiện ở tuần 12), các thời lượng dưới đây là giả định để dạy học.</p>` + tbl(['Việc', 'Thời lượng (tuần)', 'Phụ thuộc'], [['A. Ý tưởng và quyết định đi', '2', '—'], ['B. Nộp và chờ duyệt giấy phép', '5', 'A'], ['C. Đề xuất và hợp đồng tài trợ', '4', 'A'], ['D. Đặt âm thanh và sân khấu', '2', 'C'], ['E. Mở bán vé và marketing', '3', 'A'], ['F. Tuyển và hướng dẫn tình nguyện viên', '4', 'A'], ['G. Dựng cuối', '1', 'B, D, E, F']]) + `<ol><li>Bước 1 — Dò từng đường từ A đến G. A-B-G = 2 + 5 + 1 = 8; A-C-D-G = 2 + 4 + 2 + 1 = 9; A-E-G = 6; A-F-G = 7.</li>
<li>Bước 2 — Đường dài nhất là A-C-D-G với 9 tuần. Đó là đường găng: chậm ở đây là sự kiện chậm.</li>
<li>Bước 3 — Độ trễ cho phép: đường giấy phép có 1 tuần (9 − 8), marketing có 3 và tình nguyện viên có 2.</li>
<li>Bước 4 — Có 12 tuần, nên còn 3 tuần đệm. Giữ cho thời tiết, phê duyệt và ốm đau.</li></ol>
<p>Lưu ý trong ví dụ giả định này đường giấy phép chưa phải đường găng nhưng rất ít độ trễ; nếu duyệt mất 6 tuần thì nó thành đường găng. Hãy kiểm lại sau mỗi thay đổi.</p>
<p><strong>Lỗi hay gặp:</strong> tính từ hôm nay đi tới mà không chừa đệm, quên rằng các việc chạy song song, và không bao giờ cập nhật biểu đồ Gantt.</p>`,
p: [['In the table, which task would you start first if the permit usually takes longer than planned, and why?', 'Trong bảng, nếu giấy phép thường lâu hơn dự kiến, bạn bắt đầu việc nào trước và vì sao?', 'The permit (B), because it has the least slack among the routes and an official delay is outside your control.', 'Giấy phép (B), vì đường đó ít độ trễ nhất và sự chậm trễ của cơ quan nằm ngoài tầm kiểm soát của bạn.']] };

EXTRA['eem201-ts-4-3'] = { en: `<h4>Worked mini-case (fictional): scoring three venues</h4>
<p>A fictional product launch for 150 guests (assumed) compares three venues. Weights and scores are assumed, from 1 (poor) to 5 (excellent).</p>` + tbl(['Criterion (weight)', 'Hotel ballroom', 'Co-working loft', 'University hall'], [['Capacity and layout (30%)', '5', '3', '4'], ['Cost (25%)', '2', '4', '5'], ['Technical support (20%)', '5', '3', '3'], ['Access and parking (15%)', '4', '3', '3'], ['Brand fit (10%)', '4', '5', '2']]) + `<ol><li>Step 1 — Multiply each score by its weight: the ballroom gets 5 × 0.30 + 2 × 0.25 + 5 × 0.20 + 4 × 0.15 + 4 × 0.10 = 1.5 + 0.5 + 1.0 + 0.6 + 0.4 = 4.0.</li>
<li>Step 2 — The loft scores 0.9 + 1.0 + 0.6 + 0.45 + 0.5 = 3.45 and the hall scores 1.2 + 1.25 + 0.6 + 0.45 + 0.2 = 3.7.</li>
<li>Step 3 — Choose the highest score, but visit the top two in person and ask about permits, load-in times and cancellation rules.</li></ol>
<h4>Permit and supplier checklist</h4>
<ul><li>Which authority approves this activity, and how many weeks does it take?</li><li>What documents are needed (plan, insurance, safety)?</li><li>Backup supplier for sound, catering and security.</li><li>Written confirmation of every promise.</li></ul>
<p><strong>Lesson from the failure case:</strong> never sell what you cannot yet deliver. <strong>Common mistake:</strong> picking a venue only by price or photos.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): chấm điểm ba địa điểm</h4>
<p>Một buổi ra mắt sản phẩm hư cấu cho 150 khách (giả định) so sánh ba địa điểm. Trọng số và điểm là giả định, từ 1 (kém) đến 5 (xuất sắc).</p>` + tbl(['Tiêu chí (trọng số)', 'Phòng tiệc khách sạn', 'Gác mái co-working', 'Hội trường trường đại học'], [['Sức chứa và bố trí (30%)', '5', '3', '4'], ['Chi phí (25%)', '2', '4', '5'], ['Hỗ trợ kỹ thuật (20%)', '5', '3', '3'], ['Đi lại và đỗ xe (15%)', '4', '3', '3'], ['Hợp thương hiệu (10%)', '4', '5', '2']]) + `<ol><li>Bước 1 — Nhân điểm với trọng số: phòng tiệc được 5 × 0,30 + 2 × 0,25 + 5 × 0,20 + 4 × 0,15 + 4 × 0,10 = 1,5 + 0,5 + 1,0 + 0,6 + 0,4 = 4,0.</li>
<li>Bước 2 — Gác mái được 0,9 + 1,0 + 0,6 + 0,45 + 0,5 = 3,45 và hội trường được 1,2 + 1,25 + 0,6 + 0,45 + 0,2 = 3,7.</li>
<li>Bước 3 — Chọn điểm cao nhất, nhưng đến xem trực tiếp hai nơi đầu và hỏi về giấy phép, giờ vào dựng và quy tắc huỷ.</li></ol>
<h4>Danh sách kiểm giấy phép và nhà cung cấp</h4>
<ul><li>Cơ quan nào duyệt hoạt động này và mất bao nhiêu tuần?</li><li>Cần hồ sơ gì (kế hoạch, bảo hiểm, an toàn)?</li><li>Nhà cung cấp dự phòng cho âm thanh, ăn uống, an ninh.</li><li>Xác nhận bằng văn bản cho mọi lời hứa.</li></ul>
<p><strong>Bài học từ trường hợp thất bại:</strong> đừng bán thứ bạn chưa thể giao. <strong>Lỗi hay gặp:</strong> chọn địa điểm chỉ theo giá hoặc ảnh.</p>`,
p: [['What is the weighted score of a venue with scores 4, 3, 5, 2, 3 on the five criteria above?', 'Một địa điểm có điểm 4, 3, 5, 2, 3 trên năm tiêu chí trên thì điểm có trọng số là bao nhiêu?', '4 × 0.30 + 3 × 0.25 + 5 × 0.20 + 2 × 0.15 + 3 × 0.10 = 1.2 + 0.75 + 1.0 + 0.3 + 0.3 = 3.55.', '4 × 0,30 + 3 × 0,25 + 5 × 0,20 + 2 × 0,15 + 3 × 0,10 = 1,2 + 0,75 + 1,0 + 0,3 + 0,3 = 3,55.']] };

EXTRA['eem201-ts-5-1'] = { en: `<h4>Worked mini-case (fictional): break-even for a campus music night</h4>
<p>All figures are assumed for teaching. Fixed costs (stage, sound, security, insurance, marketing) total 60,000,000 VND. Sponsorship and stall fees bring 20,000,000 VND. Ticket price is 150,000 VND and each guest costs 30,000 VND in variable costs (wristband, drink, ticketing fee).</p>
<ol><li>Step 1 — Unit contribution = price − variable cost = 150,000 − 30,000 = 120,000 VND.</li>
<li>Step 2 — Fixed costs to cover from tickets = 60,000,000 − 20,000,000 = 40,000,000 VND.</li>
<li>Step 3 — Break-even attendance = 40,000,000 ÷ 120,000 = 333.3, so 334 paying guests.</li>
<li>Step 4 — Add a 10% contingency on costs (assumed): fixed costs become 66,000,000, so the cover from tickets is 46,000,000 and the break-even is 46,000,000 ÷ 120,000 = 383.3, so 384 guests.</li>
<li>Step 5 — With 800 capacity, break-even is about 48% of seats. A cautious plan also tests a low-sales case, for example 50% sold.</li></ol>
<h4>Budget template rows</h4>` + tbl(['Line', 'Type', 'Estimate', 'Actual', 'Owner'], [['Stage and sound', 'Fixed', '…', '…', 'Production'], ['Security', 'Fixed', '…', '…', 'Safety lead'], ['Wristbands', 'Variable', '…', '…', 'Guest lead'], ['Contingency 10%', 'Reserve', '…', '…', 'Finance']]) + `<p><strong>Common mistake:</strong> leaving out contingency, so a single price rise puts the event in a loss.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): điểm hoà vốn cho đêm nhạc trường</h4>
<p>Mọi số liệu là giả định để dạy học. Chi phí cố định (sân khấu, âm thanh, an ninh, bảo hiểm, marketing) tổng 60.000.000 đồng. Tài trợ và phí gian hàng mang về 20.000.000 đồng. Giá vé 150.000 đồng và mỗi khách tốn 30.000 đồng chi phí biến đổi (vòng tay, đồ uống, phí bán vé).</p>
<ol><li>Bước 1 — Phần đóng góp mỗi vé = giá − chi phí biến đổi = 150.000 − 30.000 = 120.000 đồng.</li>
<li>Bước 2 — Chi phí cố định cần bù bằng vé = 60.000.000 − 20.000.000 = 40.000.000 đồng.</li>
<li>Bước 3 — Số khách hoà vốn = 40.000.000 ÷ 120.000 = 333,3, tức 334 khách trả tiền.</li>
<li>Bước 4 — Thêm dự phòng 10% trên chi phí (giả định): chi phí cố định thành 66.000.000, phần cần bù bằng vé là 46.000.000, nên hoà vốn là 46.000.000 ÷ 120.000 = 383,3, tức 384 khách.</li>
<li>Bước 5 — Với sức chứa 800, hoà vốn khoảng 48% số ghế. Kế hoạch thận trọng còn thử kịch bản bán thấp, ví dụ bán 50%.</li></ol>
<h4>Dòng mẫu của bảng ngân sách</h4>` + tbl(['Khoản', 'Loại', 'Ước tính', 'Thực tế', 'Phụ trách'], [['Sân khấu và âm thanh', 'Cố định', '…', '…', 'Sản xuất'], ['An ninh', 'Cố định', '…', '…', 'Trưởng an toàn'], ['Vòng tay', 'Biến đổi', '…', '…', 'Trưởng khách'], ['Dự phòng 10%', 'Quỹ dự trữ', '…', '…', 'Tài chính']]) + `<p><strong>Lỗi hay gặp:</strong> bỏ dự phòng, nên chỉ một lần tăng giá là sự kiện lỗ.</p>`,
p: [['Recompute the break-even if the ticket price is 180,000 VND, other figures as in step 1 to 3.', 'Tính lại điểm hoà vốn nếu giá vé là 180.000 đồng, các số khác như bước 1 đến 3.', 'Contribution = 150,000; 40,000,000 ÷ 150,000 = 266.7, so 267 guests.', 'Đóng góp = 150.000; 40.000.000 ÷ 150.000 = 266,7, tức 267 khách.']] };

EXTRA['eem201-ts-5-2'] = { en: `<h4>Worked mini-case (fictional): designing ticket tiers</h4>
<p>For the fictional 800-seat campus night, the team must set prices. Figures are assumed.</p>
<ol><li>Step 1 — Find the floor: from the break-even lesson, the average net price per guest must at least cover the 120,000 VND contribution at about 384 guests.</li>
<li>Step 2 — Look at comparables: what do similar student nights charge? Ask five students what they would pay.</li>
<li>Step 3 — Build tiers: early bird 120,000 VND for the first 200 tickets; standard 150,000 VND for 450; on the day 180,000 VND for 100; group of five at 600,000 VND for 50.</li>
<li>Step 4 — Check the total: 200 × 120,000 = 24,000,000; 450 × 150,000 = 67,500,000; 100 × 180,000 = 18,000,000; 50 × 120,000 = 6,000,000 (the group price, 600,000 for 5 guests, is 120,000 each). Total tickets = 800 and gross revenue = 115,500,000 VND at full sales.</li>
<li>Step 5 — Subtract platform fees and refunds to get net income.</li></ol>
<h4>Checklist before the sale opens</h4>
<ul><li>Fees shown clearly at checkout.</li><li>Refund and transfer policy written.</li><li>Ticket check at the door (QR scan) tested.</li><li>Plan for a sales spike and for fake tickets.</li></ul>
<p><strong>Common mistake:</strong> pricing early bird too low, so the base tier can never cover costs.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): thiết kế các hạng vé</h4>
<p>Với đêm nhạc trường 800 chỗ hư cấu, đội phải định giá. Số liệu là giả định.</p>
<ol><li>Bước 1 — Tìm mức sàn: từ bài hoà vốn, giá thực nhận trung bình mỗi khách tối thiểu phải bù được phần đóng góp 120.000 đồng với khoảng 384 khách.</li>
<li>Bước 2 — Xem các sự kiện tương đương: các đêm nhạc sinh viên khác bán bao nhiêu? Hỏi năm sinh viên họ chịu trả bao nhiêu.</li>
<li>Bước 3 — Dựng các hạng: vé sớm 120.000 đồng cho 200 vé đầu; vé thường 150.000 đồng cho 450; vé tại chỗ 180.000 đồng cho 100; nhóm năm người 600.000 đồng cho 50 vé.</li>
<li>Bước 4 — Kiểm tổng: 200 × 120.000 = 24.000.000; 450 × 150.000 = 67.500.000; 100 × 180.000 = 18.000.000; 50 × 120.000 = 6.000.000 (giá nhóm 600.000 cho 5 khách là 120.000 mỗi người). Tổng vé = 800 và doanh thu gộp = 115.500.000 đồng khi bán hết.</li>
<li>Bước 5 — Trừ phí nền tảng và hoàn vé để ra thu nhập thực.</li></ol>
<h4>Danh sách kiểm trước khi mở bán</h4>
<ul><li>Hiển thị rõ phí ở bước thanh toán.</li><li>Chính sách hoàn và chuyển nhượng vé đã viết.</li><li>Kiểm vé tại cửa (quét QR) đã thử.</li><li>Có kế hoạch cho đợt tăng đột biến và vé giả.</li></ul>
<p><strong>Lỗi hay gặp:</strong> định giá vé sớm quá thấp, khiến hạng cơ bản không bao giờ bù được chi phí.</p>`,
p: [['In the case, why must you subtract platform fees before comparing revenue with costs?', 'Trong tình huống, vì sao phải trừ phí nền tảng trước khi so doanh thu với chi phí?', 'The organiser never receives the fee; gross sales overstate the money available.', 'Nhà tổ chức không nhận khoản phí đó; doanh thu gộp làm số tiền khả dụng cao hơn thực tế.']] };

EXTRA['eem201-ts-5-3'] = { en: `<h4>Worked mini-case (fictional): pitching a drinks brand</h4>
<p>The fictional student festival "Hoa Phuong Fest" approaches a drinks brand. Figures are assumed.</p>
<ol><li>Step 1 — Research the sponsor: its target (age 18–25), its campaign goals and its competitors. Never offer one brand's exclusivity to two competitors.</li>
<li>Step 2 — Match benefits: logo on the stage backdrop, a branded drink counter, a sampling zone, mentions by the host and a social media post series.</li>
<li>Step 3 — Build a ladder: title partner 50,000,000 VND, official partner 25,000,000, supporter 10,000,000 (all assumed).</li>
<li>Step 4 — Write a one-page proposal: the event, audience numbers (as estimates, labelled), the packages, the activation ideas, and the report you will send afterwards.</li>
<li>Step 5 — After the event, send photos, attendance, survey results and social figures within two weeks (a suggested standard). Renewal depends on this.</li></ol>
<h4>Sponsor agreement checklist</h4>
<ul><li>Exact benefits and exclusivity category.</li><li>Payment dates and in-kind values.</li><li>Approval of logo use.</li><li>What happens if the event is cancelled.</li></ul>
<p><strong>Common mistakes:</strong> asking for money without offering outcomes, promising numbers you cannot verify, and sending no report afterwards.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): chào tài trợ cho một hãng đồ uống</h4>
<p>Lễ hội sinh viên hư cấu "Hoa Phượng Fest" tiếp cận một hãng đồ uống. Số liệu là giả định.</p>
<ol><li>Bước 1 — Nghiên cứu nhà tài trợ: đối tượng (18–25 tuổi), mục tiêu chiến dịch và đối thủ. Đừng bao giờ cho hai đối thủ cùng quyền độc quyền.</li>
<li>Bước 2 — Ghép quyền lợi: logo trên phông sân khấu, quầy đồ uống mang thương hiệu, khu dùng thử, lời nhắc của MC và loạt bài mạng xã hội.</li>
<li>Bước 3 — Dựng bậc thang: đối tác chính 50.000.000 đồng, đối tác chính thức 25.000.000, đồng hành 10.000.000 (đều là giả định).</li>
<li>Bước 4 — Viết đề xuất một trang: sự kiện, số lượng khán giả (là ước tính, ghi rõ), các gói, ý tưởng kích hoạt và báo cáo bạn sẽ gửi sau đó.</li>
<li>Bước 5 — Sau sự kiện, gửi ảnh, số người dự, kết quả khảo sát và số liệu mạng xã hội trong vòng hai tuần (chuẩn gợi ý). Việc gia hạn phụ thuộc vào đây.</li></ol>
<h4>Danh sách kiểm thỏa thuận tài trợ</h4>
<ul><li>Quyền lợi chính xác và nhóm độc quyền.</li><li>Ngày thanh toán và giá trị hiện vật.</li><li>Phê duyệt cách dùng logo.</li><li>Điều gì xảy ra nếu sự kiện bị huỷ.</li></ul>
<p><strong>Lỗi hay gặp:</strong> xin tiền mà không đưa ra kết quả, hứa con số không kiểm chứng được và không gửi báo cáo sau sự kiện.</p>`,
p: [['Why should you not sell the same exclusivity category to two competing brands?', 'Vì sao không nên bán cùng một nhóm độc quyền cho hai thương hiệu cạnh tranh?', 'Exclusivity is what the sponsor pays for; selling it twice breaks the agreement and damages trust.', 'Độc quyền chính là thứ nhà tài trợ trả tiền để có; bán hai lần là phá thỏa thuận và mất lòng tin.']] };

EXTRA['eem201-ts-6-1'] = { en: `<h4>Worked mini-case (fictional): a persona and a one-page plan</h4>
<p>The fictional "Night Market Music Fair" needs a marketing plan. Follow the steps.</p>
<ol><li>Step 1 — Segment: students living in dorms, students living at home, alumni, neighbours.</li>
<li>Step 2 — Target: dorm students first, because they can attend after evening classes. Write a persona: "Linh, 20, second-year, shares a room, follows two bands on social media, has about 150,000 VND (assumed) to spend on a night out, decides with friends."</li>
<li>Step 3 — Position in one sentence: "The free-entry night where your campus bands play and your friends eat together."</li>
<li>Step 4 — Message: price (free entry), people (your bands), place (the main square), time (Saturday 17:00).</li>
<li>Step 5 — Fill the one-page plan.</li></ol>` + tbl(['Element', 'Content (example)'], [['Objective', '1,500 visitors (assumed), 80% from campus'], ['Audience', 'Dorm students, alumni'], ['Message', 'Free entry, local bands, street food'], ['Channels', 'Club pages, dorm posters, student groups'], ['Calendar', 'Teaser 4 weeks before, lineup 3 weeks, reminder 1 week, day-of posts'], ['Budget', 'Set as a share of the event budget'], ['Measures', 'Reach, registrations, check-ins']]) + `<p><strong>Common mistakes:</strong> "everyone" as the audience, listing features instead of benefits, and a plan with no measures.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): chân dung khán giả và kế hoạch một trang</h4>
<p>"Hội chợ đêm âm nhạc" hư cấu cần kế hoạch marketing. Làm theo các bước.</p>
<ol><li>Bước 1 — Phân khúc: sinh viên ở ký túc xá, sinh viên ở nhà, cựu sinh viên, hàng xóm.</li>
<li>Bước 2 — Mục tiêu: sinh viên ký túc xá trước, vì họ đến được sau giờ học tối. Viết chân dung: "Linh, 20 tuổi, năm hai, ở chung phòng, theo dõi hai ban nhạc trên mạng xã hội, có khoảng 150.000 đồng (giả định) cho một buổi tối đi chơi, quyết định cùng bạn bè."</li>
<li>Bước 3 — Định vị trong một câu: "Đêm vào cổng miễn phí, nơi ban nhạc của trường chơi và bạn bè cùng ăn uống."</li>
<li>Bước 4 — Thông điệp: giá (vào cổng miễn phí), con người (ban nhạc của bạn), nơi chốn (sân chính), giờ (thứ Bảy 17:00).</li>
<li>Bước 5 — Điền kế hoạch một trang.</li></ol>` + tbl(['Thành phần', 'Nội dung (ví dụ)'], [['Mục tiêu', '1.500 lượt khách (giả định), 80% từ trong trường'], ['Khán giả', 'Sinh viên ký túc xá, cựu sinh viên'], ['Thông điệp', 'Vào cổng miễn phí, ban nhạc địa phương, đồ ăn đường phố'], ['Kênh', 'Trang câu lạc bộ, poster ký túc xá, nhóm sinh viên'], ['Lịch', 'Giới thiệu trước 4 tuần, lộ danh sách 3 tuần, nhắc 1 tuần, đăng bài trong ngày'], ['Ngân sách', 'Đặt theo tỷ lệ trên ngân sách sự kiện'], ['Đo lường', 'Tiếp cận, đăng ký, check-in']]) + `<p><strong>Lỗi hay gặp:</strong> "tất cả mọi người" là khán giả, liệt kê tính năng thay vì lợi ích, và kế hoạch không có chỉ số đo.</p>`,
p: [['Write a one-sentence positioning for a fictional jazz night aimed at office workers.', 'Viết định vị một câu cho đêm nhạc jazz hư cấu nhắm tới nhân viên văn phòng.', 'Example: "A calm weekday jazz hour right after work, ten minutes from the office." Any clear benefit is accepted.', 'Ví dụ: "Một giờ jazz nhẹ nhàng ngay sau giờ làm, cách văn phòng mười phút." Chấp nhận mọi lợi ích rõ ràng.']] };

EXTRA['eem201-ts-6-2'] = { en: `<h4>Worked mini-case (fictional): a funnel from 20,000 views to 800 tickets</h4>
<p>Figures are assumed to show the method; real conversion rates vary widely.</p>
<ol><li>Step 1 — Set the goal: sell 800 tickets in six weeks.</li>
<li>Step 2 — Work backwards with assumed conversion rates: if 4% of people who visit the ticket page buy, you need 800 ÷ 0.04 = 20,000 page visits. If 10% of those who see a post click through, you need 200,000 impressions (assumed).</li>
<li>Step 3 — Split the channels: owned (club page, email list), earned (student news, band fans sharing), paid (a small social advert budget).</li>
<li>Step 4 — Give each channel its own tracking link so that you can see where tickets come from.</li>
<li>Step 5 — Review weekly and move money to the channel with the lowest cost per ticket.</li></ol>
<h4>Weekly review template</h4>` + tbl(['Channel', 'Spend', 'Visits', 'Tickets', 'Cost per ticket'], [['Club page', '0', '…', '…', '…'], ['Email list', '0', '…', '…', '…'], ['Paid social', '…', '…', '…', '…'], ['Creators', '…', '…', '…', '…']]) + `<p><strong>Common mistakes:</strong> counting likes as sales, spending the whole budget in week one, and having no ticket link on the post.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): phễu từ 20.000 lượt xem đến 800 vé</h4>
<p>Số liệu là giả định để minh hoạ phương pháp; tỷ lệ chuyển đổi thực tế rất khác nhau.</p>
<ol><li>Bước 1 — Đặt mục tiêu: bán 800 vé trong sáu tuần.</li>
<li>Bước 2 — Tính ngược với tỷ lệ chuyển đổi giả định: nếu 4% người vào trang vé mua, cần 800 ÷ 0,04 = 20.000 lượt vào trang. Nếu 10% người thấy bài đăng bấm vào, cần 200.000 lượt hiển thị (giả định).</li>
<li>Bước 3 — Chia kênh: sở hữu (trang câu lạc bộ, danh sách email), kiếm được (bản tin sinh viên, fan ban nhạc chia sẻ), trả tiền (ngân sách quảng cáo mạng xã hội nhỏ).</li>
<li>Bước 4 — Cho mỗi kênh một liên kết theo dõi riêng để biết vé đến từ đâu.</li>
<li>Bước 5 — Xem lại hằng tuần và chuyển tiền sang kênh có chi phí mỗi vé thấp nhất.</li></ol>
<h4>Mẫu xem lại hằng tuần</h4>` + tbl(['Kênh', 'Chi', 'Lượt vào', 'Vé', 'Chi phí mỗi vé'], [['Trang câu lạc bộ', '0', '…', '…', '…'], ['Danh sách email', '0', '…', '…', '…'], ['Mạng xã hội trả tiền', '…', '…', '…', '…'], ['Người sáng tạo nội dung', '…', '…', '…', '…']]) + `<p><strong>Lỗi hay gặp:</strong> tính lượt thích là doanh số, dùng hết ngân sách ngay tuần đầu, và bài đăng không có liên kết mua vé.</p>`,
p: [['Why does each channel need its own tracking link?', 'Vì sao mỗi kênh cần liên kết theo dõi riêng?', 'Otherwise you cannot tell which channel produced tickets and cannot move budget to what works.', 'Nếu không, bạn không biết kênh nào tạo ra vé và không thể chuyển ngân sách sang kênh hiệu quả.']] };

EXTRA['eem201-ts-6-3'] = { en: `<h4>Worked mini-case (fictional): a press release and a first-hour response</h4>
<p>For the fictional "Hoa Phuong Fest", write one page for the press.</p>
<ol><li>Step 1 — Headline with the news: "Student bands take the main stage at Hoa Phuong Fest on Saturday".</li>
<li>Step 2 — First paragraph answers who, what, when, where and why in two sentences.</li>
<li>Step 3 — One quote from the organiser, one from a band, and one practical block: time, address, free entry, accessibility, contact for the press.</li>
<li>Step 4 — Attach two photos with credit and a lineup.</li></ol>
<h4>Crisis template: strong wind stops the show (fictional)</h4>
<ol><li>Verify: the safety lead and stage manager confirm the facts before anything is posted.</li>
<li>Protect people: pause the show and use the announcement plan.</li>
<li>Say it once, in one voice: "The show is paused for safety. Please stay in the square and follow our staff. We will update at 19:30." Put the same text on the stage screen and the social page.</li>
<li>Update on schedule, even when there is no news.</li>
<li>After: thank the audience and explain what happened.</li></ol>
<p><strong>Common mistakes:</strong> several people giving different statements, deleting critical comments, and guessing before verifying.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): thông cáo báo chí và phản ứng trong giờ đầu</h4>
<p>Với "Hoa Phượng Fest" hư cấu, viết một trang cho báo chí.</p>
<ol><li>Bước 1 — Tiêu đề nêu tin: "Ban nhạc sinh viên lên sân khấu chính Hoa Phượng Fest vào thứ Bảy".</li>
<li>Bước 2 — Đoạn đầu trả lời ai, gì, khi nào, ở đâu, vì sao trong hai câu.</li>
<li>Bước 3 — Một trích dẫn từ nhà tổ chức, một từ ban nhạc, và một khối thực dụng: giờ, địa chỉ, vào cổng miễn phí, hỗ trợ người khuyết tật, đầu mối liên hệ báo chí.</li>
<li>Bước 4 — Đính kèm hai ảnh có ghi nguồn và danh sách nghệ sĩ.</li></ol>
<h4>Mẫu xử lý khủng hoảng: gió mạnh làm dừng chương trình (hư cấu)</h4>
<ol><li>Xác minh: trưởng an toàn và điều phối sân khấu xác nhận sự việc trước khi đăng bất cứ gì.</li>
<li>Bảo vệ người: tạm dừng chương trình và dùng kế hoạch thông báo.</li>
<li>Nói một lần, một giọng: "Chương trình tạm dừng vì an toàn. Mời mọi người ở lại trong sân và làm theo nhân viên. Chúng tôi cập nhật lúc 19:30." Đưa cùng nội dung lên màn hình sân khấu và trang mạng xã hội.</li>
<li>Cập nhật đúng hẹn, kể cả khi chưa có tin mới.</li>
<li>Sau đó: cảm ơn khán giả và giải thích điều đã xảy ra.</li></ol>
<p><strong>Lỗi hay gặp:</strong> nhiều người phát biểu khác nhau, xoá bình luận chỉ trích và đoán trước khi xác minh.</p>`,
p: [['Which five questions must the first paragraph of a press release answer?', 'Đoạn đầu của thông cáo báo chí phải trả lời năm câu hỏi nào?', 'Who, what, when, where and why.', 'Ai, gì, khi nào, ở đâu và vì sao.']] };

EXTRA['eem201-ts-7-1'] = { en: `<h4>Worked mini-case (fictional): a 60-minute run-of-show extract</h4>
<p>Fictional "Hoa Phuong Fest", main stage, evening. Times are assumed.</p>` + tbl(['Time', 'Cue', 'Who', 'Notes'], [['17:30', 'Doors open', 'Gate lead', 'Bag check running'], ['18:00', 'Host welcomes the crowd', 'Host, stage manager', 'Intro track, house lights down'], ['18:05', 'Band 1 starts (25 min)', 'Sound, lights', 'Cue light 1'], ['18:30', 'Changeover (15 min)', 'Stage crew', 'Host fills time'], ['18:45', 'Band 2 starts (30 min)', 'Sound, lights', 'Safety walk-round'], ['19:15', 'Sponsor message (2 min)', 'Host', 'Script approved']]) + `<ol><li>Step 1 — Check the arithmetic: 18:00 + 5 min + 25 min = 18:30; the changeover ends at 18:45; band 2 ends at 19:15. The sequence fits with no gap.</li>
<li>Step 2 — Add a "slip rule": if the show is more than 10 minutes late, cut a defined item (for example the sponsor message) rather than the headliner.</li>
<li>Step 3 — Share the sheet with every department the day before, and hold a 20-minute briefing two hours before doors.</li>
<li>Step 4 — Rehearse the first and last 10 minutes and the emergency announcement.</li></ol>
<h4>Load-in and strike checklist</h4>
<ul><li>Access times for each supplier.</li><li>Power and cable safety checked.</li><li>Strike order and area clean-up owners.</li></ul>
<p><strong>Common mistakes:</strong> a run of show that exists only in the stage manager's head, no changeover time, and no one assigned to the strike.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): trích kịch bản chạy chương trình 60 phút</h4>
<p>"Hoa Phượng Fest" hư cấu, sân khấu chính, buổi tối. Giờ là giả định.</p>` + tbl(['Giờ', 'Tín hiệu', 'Ai', 'Ghi chú'], [['17:30', 'Mở cổng', 'Trưởng cổng', 'Đang kiểm tra túi'], ['18:00', 'MC chào khán giả', 'MC, điều phối sân khấu', 'Nhạc mở, tắt đèn khán phòng'], ['18:05', 'Ban 1 bắt đầu (25 phút)', 'Âm thanh, ánh sáng', 'Đèn hiệu 1'], ['18:30', 'Chuyển cảnh (15 phút)', 'Đội sân khấu', 'MC lấp thời gian'], ['18:45', 'Ban 2 bắt đầu (30 phút)', 'Âm thanh, ánh sáng', 'Đi kiểm tra an toàn'], ['19:15', 'Lời nhà tài trợ (2 phút)', 'MC', 'Kịch bản đã duyệt']]) + `<ol><li>Bước 1 — Kiểm phép tính: 18:00 + 5 phút + 25 phút = 18:30; chuyển cảnh xong lúc 18:45; ban 2 kết thúc lúc 19:15. Chuỗi khớp, không có khoảng trống.</li>
<li>Bước 2 — Thêm "quy tắc trễ": nếu chương trình trễ quá 10 phút, cắt một mục định sẵn (ví dụ lời nhà tài trợ) chứ không cắt nghệ sĩ chính.</li>
<li>Bước 3 — Chia sẻ bảng cho mọi bộ phận từ hôm trước và họp triển khai 20 phút hai giờ trước khi mở cổng.</li>
<li>Bước 4 — Tập 10 phút đầu, 10 phút cuối và thông báo khẩn cấp.</li></ol>
<h4>Danh sách kiểm vào dựng và tháo dỡ</h4>
<ul><li>Giờ vào của từng nhà cung cấp.</li><li>Kiểm an toàn điện và dây cáp.</li><li>Thứ tự tháo dỡ và người phụ trách dọn khu vực.</li></ul>
<p><strong>Lỗi hay gặp:</strong> kịch bản chỉ nằm trong đầu điều phối sân khấu, không có thời gian chuyển cảnh và không ai phụ trách tháo dỡ.</p>`,
p: [['Why is a "slip rule" useful in a run of show?', '"Quy tắc trễ" có ích gì trong kịch bản chạy chương trình?', 'It decides in advance what to cut when the show runs late, so nobody argues under pressure.', 'Nó quyết định trước phần nào bị cắt khi chương trình trễ, nên không ai tranh cãi lúc áp lực.']] };

EXTRA['eem201-ts-7-2'] = { en: `<h4>Worked mini-case (fictional): checking the capacity of a square</h4>
<p>For the fictional "Hoa Phuong Fest" in a square, figures are assumed for teaching; real limits come from the venue and the authority.</p>
<ol><li>Step 1 — Measure the usable area: assume the square is 50 m × 40 m = 2,000 m², minus 600 m² for the stage, fences, food stalls and toilets. The usable area is 1,400 m².</li>
<li>Step 2 — Choose a planning density: assume 2 people per m² for a relaxed crowd and treat higher densities as a warning. Capacity = 1,400 × 2 = 2,800 people (assumed).</li>
<li>Step 3 — Compare with the expected crowd. If 3,500 are expected, either reduce tickets, add space or split the programme. Do not rely on "people will leave early".</li>
<li>Step 4 — Check flow: width of entrances and exits. Many people arriving in a short time creates a queue, so open gates early and add lanes.</li>
<li>Step 5 — Set trigger points: if the count at a gate reaches 90% of the plan, stop entry and tell the control room.</li></ol>
<h4>Welfare checklist</h4>
<ul><li>Marked first-aid points and medics.</li><li>Free drinking water and shade.</li><li>Lost-child and lost-property point.</li><li>Accessible route and viewing area.</li><li>A safety lead who can stop the show and a written way to do it.</li></ul>
<p><strong>Common mistake:</strong> counting only tickets sold and not staff, vendors and guests with free entry.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): kiểm sức chứa của một sân</h4>
<p>Với "Hoa Phượng Fest" hư cấu tổ chức ở sân, số liệu là giả định để dạy học; giới hạn thật do địa điểm và cơ quan chức năng quy định.</p>
<ol><li>Bước 1 — Đo diện tích dùng được: giả định sân 50 m × 40 m = 2.000 m², trừ 600 m² cho sân khấu, hàng rào, gian ăn uống và nhà vệ sinh. Diện tích dùng được là 1.400 m².</li>
<li>Bước 2 — Chọn mật độ lập kế hoạch: giả định 2 người trên m² cho đám đông thoải mái và coi mật độ cao hơn là cảnh báo. Sức chứa = 1.400 × 2 = 2.800 người (giả định).</li>
<li>Bước 3 — So với đám đông dự kiến. Nếu dự kiến 3.500 người thì giảm vé, thêm không gian hoặc chia chương trình. Đừng dựa vào "mọi người sẽ về sớm".</li>
<li>Bước 4 — Kiểm dòng người: bề rộng lối vào và lối ra. Nhiều người đến trong thời gian ngắn tạo hàng chờ, nên mở cổng sớm và thêm làn.</li>
<li>Bước 5 — Đặt ngưỡng kích hoạt: nếu số đếm ở một cổng đạt 90% kế hoạch thì dừng vào và báo phòng điều hành.</li></ol>
<h4>Danh sách kiểm chăm sóc khách</h4>
<ul><li>Điểm sơ cứu có biển và nhân viên y tế.</li><li>Nước uống miễn phí và chỗ che nắng.</li><li>Điểm tìm trẻ lạc và đồ thất lạc.</li><li>Lối đi và khu xem cho người khuyết tật.</li><li>Trưởng an toàn có quyền dừng chương trình và cách làm được viết ra.</li></ul>
<p><strong>Lỗi hay gặp:</strong> chỉ đếm vé đã bán mà quên nhân viên, gian hàng và khách vào cửa miễn phí.</p>`,
p: [['Compute the planning capacity if the usable area is 900 m² at 2 people per m².', 'Tính sức chứa lập kế hoạch nếu diện tích dùng được là 900 m² với 2 người trên m².', '900 × 2 = 1,800 people (assumed planning figure, not a legal limit).', '900 × 2 = 1.800 người (con số lập kế hoạch giả định, không phải giới hạn pháp lý).']] };

EXTRA['eem201-ts-7-3'] = { en: `<h4>Worked mini-case (fictional): building a risk register</h4>
<p>Fictional "Hoa Phuong Fest", outdoor evening event. Scores use likelihood (L) and impact (I) from 1 to 5; all scores are assumed.</p>` + tbl(['Risk', 'L', 'I', 'Score', 'Response', 'Owner'], [['Evening storm', '3', '4', '12', 'Check forecast, covered backstage, written stop rule, rain date option', 'Safety lead'], ['Power failure on main stage', '2', '4', '8', 'Backup generator, tested before doors', 'Production'], ['Crowd above plan at the gate', '3', '5', '15', 'Stop-entry trigger, extra lane, announcement', 'Gate lead'], ['Artist late', '2', '3', '6', 'Buffer set, spare act, host fills time', 'Stage manager'], ['Overspend', '3', '3', '9', 'Weekly budget review, 10% contingency', 'Finance']]) + `<ol><li>Step 1 — Brainstorm with every department, not only the leads.</li>
<li>Step 2 — Score as L × I and sort from the highest: crowd (15), storm (12), overspend (9), power (8), artist (6).</li>
<li>Step 3 — Name one owner for each and write the response as an action, not a hope.</li>
<li>Step 4 — Decide in advance who may postpone or cancel, on what condition, and how this is announced.</li>
<li>Step 5 — Review the register weekly and on the event day.</li></ol>
<p><strong>Common mistakes:</strong> listing risks without owners, scoring everything as medium, and forgetting that insurance may exclude some causes, so read the policy.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): xây dựng sổ rủi ro</h4>
<p>"Hoa Phượng Fest" hư cấu, sự kiện ngoài trời buổi tối. Điểm dùng khả năng xảy ra (L) và tác động (I) từ 1 đến 5; mọi điểm là giả định.</p>` + tbl(['Rủi ro', 'L', 'I', 'Điểm', 'Ứng phó', 'Phụ trách'], [['Giông buổi tối', '3', '4', '12', 'Xem dự báo, khu hậu trường có mái, quy tắc dừng bằng văn bản, phương án ngày dự phòng', 'Trưởng an toàn'], ['Mất điện sân khấu chính', '2', '4', '8', 'Máy phát dự phòng, thử trước khi mở cổng', 'Sản xuất'], ['Đám đông vượt kế hoạch ở cổng', '3', '5', '15', 'Ngưỡng dừng vào, thêm làn, thông báo', 'Trưởng cổng'], ['Nghệ sĩ đến muộn', '2', '3', '6', 'Thời gian đệm, tiết mục dự phòng, MC lấp thời gian', 'Điều phối sân khấu'], ['Chi vượt', '3', '3', '9', 'Xem ngân sách hằng tuần, dự phòng 10%', 'Tài chính']]) + `<ol><li>Bước 1 — Động não cùng mọi bộ phận, không chỉ các trưởng nhóm.</li>
<li>Bước 2 — Chấm điểm L × I và xếp từ cao nhất: đám đông (15), giông (12), chi vượt (9), mất điện (8), nghệ sĩ muộn (6).</li>
<li>Bước 3 — Gắn một người phụ trách cho từng rủi ro và viết ứng phó thành hành động, không phải hy vọng.</li>
<li>Bước 4 — Quyết định trước ai được hoãn hoặc huỷ, theo điều kiện nào và thông báo ra sao.</li>
<li>Bước 5 — Xem lại sổ hằng tuần và trong ngày diễn ra.</li></ol>
<p><strong>Lỗi hay gặp:</strong> liệt kê rủi ro mà không có người phụ trách, chấm mọi thứ ở mức trung bình, và quên rằng bảo hiểm có thể loại trừ một số nguyên nhân, nên hãy đọc kỹ hợp đồng.</p>`,
p: [['Score a risk with likelihood 4 and impact 3, then say whether it should be handled before "Artist late" above.', 'Chấm điểm một rủi ro có khả năng 4 và tác động 3, rồi cho biết có nên xử lý trước "Nghệ sĩ đến muộn" ở trên không.', 'Score = 4 × 3 = 12, higher than 6, so handle it first.', 'Điểm = 4 × 3 = 12, cao hơn 6, nên xử lý trước.']] };

EXTRA['eem201-ts-8-1'] = { en: `<h4>Worked mini-case (fictional): scoring a campus festival</h4>
<p>Results below are invented for teaching. The objectives came from the planning stage: 1,500 visitors, 80,000,000 VND raised and a satisfaction score of at least 4 out of 5.</p>` + tbl(['Objective', 'Target', 'Result', 'Verdict'], [['Visitors', '1,500', '1,320', '88% of target'], ['Funds raised', '80,000,000 VND', '86,000,000 VND', 'Above target'], ['Satisfaction', '4.0 of 5', '4.3 of 5', 'Above target']]) + `<ol><li>Step 1 — ROI for the sponsor-funded part: assume the total event cost was 120,000,000 VND and the benefit counted is 150,000,000 VND (funds plus sponsor value, assumed). ROI = (150,000,000 − 120,000,000) ÷ 120,000,000 = 25%.</li>
<li>Step 2 — State what you counted as benefit before computing, or the number cannot be compared.</li>
<li>Step 3 — NPS: from 100 survey answers (assumed), 55 were 9–10 (promoters), 30 were 7–8 (passive) and 15 were 0–6 (detractors). NPS = 55% − 15% = 40.</li>
<li>Step 4 — Read the open comments: they explain why, for example long food queues.</li></ol>
<p><strong>Common mistakes:</strong> counting only the good numbers, using ROI without defining benefit, and a survey sent two weeks late when people have forgotten.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): chấm điểm một lễ hội trường</h4>
<p>Kết quả dưới đây là bịa ra để dạy học. Mục tiêu đến từ khâu lập kế hoạch: 1.500 lượt khách, gây quỹ 80.000.000 đồng và điểm hài lòng ít nhất 4 trên 5.</p>` + tbl(['Mục tiêu', 'Chỉ tiêu', 'Kết quả', 'Nhận định'], [['Lượt khách', '1.500', '1.320', '88% chỉ tiêu'], ['Quỹ gây được', '80.000.000 đồng', '86.000.000 đồng', 'Vượt chỉ tiêu'], ['Hài lòng', '4,0 trên 5', '4,3 trên 5', 'Vượt chỉ tiêu']]) + `<ol><li>Bước 1 — ROI: giả định tổng chi phí sự kiện là 120.000.000 đồng và lợi ích được tính là 150.000.000 đồng (quỹ cộng giá trị tài trợ, giả định). ROI = (150.000.000 − 120.000.000) ÷ 120.000.000 = 25%.</li>
<li>Bước 2 — Nêu rõ bạn tính gì là lợi ích trước khi tính, nếu không số không so sánh được.</li>
<li>Bước 3 — NPS: từ 100 phiếu khảo sát (giả định), 55 phiếu 9–10 (người ủng hộ), 30 phiếu 7–8 (trung lập) và 15 phiếu 0–6 (người chê). NPS = 55% − 15% = 40.</li>
<li>Bước 4 — Đọc các góp ý mở: chúng giải thích lý do, ví dụ hàng chờ đồ ăn dài.</li></ol>
<p><strong>Lỗi hay gặp:</strong> chỉ đếm số đẹp, dùng ROI mà không định nghĩa lợi ích, và gửi khảo sát trễ hai tuần khi mọi người đã quên.</p>`,
p: [['Compute NPS if 40 of 80 answers are 9–10 and 20 are 0–6.', 'Tính NPS nếu trong 80 phiếu có 40 phiếu 9–10 và 20 phiếu 0–6.', '40/80 = 50% promoters; 20/80 = 25% detractors; NPS = 25.', '40/80 = 50% người ủng hộ; 20/80 = 25% người chê; NPS = 25.']] };

EXTRA['eem201-ts-8-2'] = { en: `<h4>Worked mini-case (fictional): a one-page post-event summary</h4>
<p>After "Hoa Phuong Fest" (fictional), the lead writes a one-page summary before the full report. All figures are assumed.</p>
<ol><li>Step 1 — Open with the result against objectives: visitors 1,320 of 1,500; funds 86,000,000 of 80,000,000 VND; satisfaction 4.3 of 5.</li>
<li>Step 2 — Budget: planned 120,000,000 VND, actual 118,000,000 VND (assumed), a difference of 2,000,000 VND under. Explain any line that differs by more than 10%.</li>
<li>Step 3 — Three things that worked (clear gate flow, volunteer briefing, sponsor activation) and three that did not (long food queues, late changeover, no spare phone chargers).</li>
<li>Step 4 — Lessons with actions: "Add a second food counter; owner: logistics; due: before next planning".</li>
<li>Step 5 — Thank-you list and the date the sponsor reports are sent.</li></ol>
<h4>Lessons-learned agenda (45 minutes)</h4>` + tbl(['Minutes', 'Item'], [['0–5', 'Rules: facts, not blame'], ['5–20', 'What went well, with evidence'], ['20–35', 'What to change, with causes'], ['35–45', 'Actions, owners and dates']]) + `<p><strong>Common mistakes:</strong> waiting months to write the report, hiding failures, and storing lessons in a file nobody opens when the next event starts.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): bản tóm tắt một trang sau sự kiện</h4>
<p>Sau "Hoa Phượng Fest" (hư cấu), trưởng sự kiện viết bản tóm tắt một trang trước báo cáo đầy đủ. Mọi số liệu là giả định.</p>
<ol><li>Bước 1 — Mở bằng kết quả so với mục tiêu: khách 1.320 trên 1.500; quỹ 86.000.000 trên 80.000.000 đồng; hài lòng 4,3 trên 5.</li>
<li>Bước 2 — Ngân sách: kế hoạch 120.000.000 đồng, thực tế 118.000.000 đồng (giả định), thấp hơn 2.000.000 đồng. Giải thích mọi khoản lệch quá 10%.</li>
<li>Bước 3 — Ba điều tốt (dòng người ở cổng, buổi hướng dẫn tình nguyện viên, kích hoạt tài trợ) và ba điều chưa tốt (hàng chờ ăn dài, chuyển cảnh trễ, thiếu sạc điện thoại dự phòng).</li>
<li>Bước 4 — Bài học kèm hành động: "Thêm quầy ăn thứ hai; phụ trách: hậu cần; hạn: trước kỳ lập kế hoạch sau".</li>
<li>Bước 5 — Danh sách cảm ơn và ngày gửi báo cáo cho nhà tài trợ.</li></ol>
<h4>Chương trình họp rút kinh nghiệm (45 phút)</h4>` + tbl(['Phút', 'Mục'], [['0–5', 'Quy tắc: sự kiện, không đổ lỗi'], ['5–20', 'Điều đã tốt, kèm bằng chứng'], ['20–35', 'Điều cần đổi, kèm nguyên nhân'], ['35–45', 'Hành động, người phụ trách và ngày']]) + `<p><strong>Lỗi hay gặp:</strong> chờ nhiều tháng mới viết báo cáo, giấu thất bại, và để bài học trong tệp không ai mở khi sự kiện kế tiếp bắt đầu.</p>`,
p: [['Name two items that belong in a close-out checklist besides the report.', 'Kể hai mục thuộc danh sách đóng sự kiện ngoài báo cáo.', 'For example final payments to suppliers, return of venue keys or deposit, thank-you messages, archive of files.', 'Ví dụ thanh toán cuối cho nhà cung cấp, trả chìa khoá hoặc tiền cọc địa điểm, tin cảm ơn, lưu trữ hồ sơ.']] };

EXTRA['eem201-ts-8-3'] = { en: `<h4>Worked mini-case (fictional): an ethics and sustainability review</h4>
<p>Before the fictional "Hoa Phuong Fest" opens ticket sales, the team runs a one-hour review using a short checklist.</p>
<ol><li>Step 1 — Safety: is capacity honest, are exits clear and is there a person with authority to stop the show? If not, delay sales.</li>
<li>Step 2 — Honesty: does the advertising promise only what we can deliver (lineup, food, price)? List every claim and a proof for each.</li>
<li>Step 3 — Fairness: are tickets sold by clear rules, with an accessible area and no hidden fees?</li>
<li>Step 4 — Privacy: which guest data do we collect, why, who sees it and when do we delete it?</li>
<li>Step 5 — Integrity: do gifts from suppliers or sponsors affect choices? Record and declare any.</li>
<li>Step 6 — Sustainability: choose three actions, for example reusable cups with a deposit, sorted waste bins and a list of nearby suppliers, then measure one number (for example kilograms of waste per guest).</li></ol>
<h4>Career self-check</h4>
<ul><li>Which role in Chapter 3 would you try first (production, marketing, guest services, finance, safety)?</li><li>Which skill do you need to build in the next semester?</li><li>Which student event can you join to practise it?</li></ul>
<p><strong>Common mistakes:</strong> greenwashing (claiming green without numbers), collecting data "just in case", and treating ethics as something to fix after a complaint.</p>`,
vi: `<h4>Tình huống mẫu (hư cấu): rà soát đạo đức và bền vững</h4>
<p>Trước khi "Hoa Phượng Fest" hư cấu mở bán vé, đội tổ chức họp rà soát một giờ bằng danh sách kiểm ngắn.</p>
<ol><li>Bước 1 — An toàn: sức chứa có trung thực không, lối thoát có rõ không và có người đủ thẩm quyền dừng chương trình không? Nếu chưa, hoãn mở bán.</li>
<li>Bước 2 — Trung thực: quảng cáo chỉ hứa điều ta giao được (danh sách nghệ sĩ, đồ ăn, giá) không? Liệt kê mọi cam kết và bằng chứng cho từng cái.</li>
<li>Bước 3 — Công bằng: vé bán theo quy tắc rõ ràng, có khu tiếp cận và không phí ẩn không?</li>
<li>Bước 4 — Riêng tư: thu dữ liệu khách nào, để làm gì, ai xem được và khi nào xoá?</li>
<li>Bước 5 — Liêm chính: quà từ nhà cung cấp hay nhà tài trợ có ảnh hưởng lựa chọn không? Ghi lại và công khai.</li>
<li>Bước 6 — Bền vững: chọn ba hành động, ví dụ cốc dùng lại có đặt cọc, thùng rác phân loại và danh sách nhà cung cấp gần, rồi đo một con số (ví dụ kilôgam rác trên mỗi khách).</li></ol>
<h4>Tự đánh giá nghề nghiệp</h4>
<ul><li>Bạn thử vai nào ở Chương 3 trước (sản xuất, marketing, chăm sóc khách, tài chính, an toàn)?</li><li>Kỹ năng nào cần xây trong học kỳ tới?</li><li>Sự kiện sinh viên nào bạn có thể tham gia để luyện?</li></ul>
<p><strong>Lỗi hay gặp:</strong> "tẩy xanh" (nói xanh mà không có số liệu), thu dữ liệu "phòng khi cần", và coi đạo đức là thứ sửa sau khi có khiếu nại.</p>`,
p: [['Give one example of "greenwashing" at an event and how to avoid it.', 'Cho một ví dụ "tẩy xanh" ở sự kiện và cách tránh.', 'Claiming "zero waste" with no measurement. Avoid it by measuring waste and reporting the real number.', 'Tuyên bố "không rác thải" mà không đo. Tránh bằng cách đo rác và báo con số thật.']] };

const D = (slug, en, vi, desc, o) => {
  const ex = EXTRA[slug];
  if (ex) o = { ...o, b: [o.b[0] + ex.en, o.b[1] + ex.vi], p: o.p.concat(ex.p || []) };
  return { title: en + '|||' + vi, slug, type: 'DOCUMENT', description: desc, content: bi(build(o, 'en'), build(o, 'vi')) };
};
const Q = (slug, en, vi, qs) => ({ title: en + '|||' + vi, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.',
  quiz: { timeLimitSeconds: 600, questions: qs.map((q, i) => ({ id: 'q' + (i + 1), question: x(q[0]), options: q[1].map(x), correctIndex: q[2], points: 1, explanation: x(q[3]) })) } });
const SEC = (en, vi, desc, lessons) => ({ title: en + '|||' + vi, description: desc, lessons });
const P = 'eem201-ts-';
const secs = [];
// ===== Mục 0 =====
secs.push(SEC('Section 0 — Course framework (self-authored, no FLM syllabus)', 'Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  'Giới thiệu EEM201, chuẩn đầu ra tự soạn, giáo trình và tài liệu học.', [
  D(P + '0-1', '0.1 About EEM201 — Introduction to Entertainment and Event Management', '0.1 Giới thiệu môn EEM201 — Nhập môn Quản lý giải trí và sự kiện',
    'EEM201 là môn gì, học để làm gì, học xong làm được gì; lưu ý khung môn tự soạn.', {
    n: '0.1',
    g: [['Understand what EEM201 covers and why it matters for a career in entertainment and events', 'Hiểu EEM201 học gì và vì sao quan trọng với nghề giải trí – sự kiện'],
        ['Know the 8 self-authored learning outcomes', 'Nắm 8 chuẩn đầu ra tự soạn'],
        ['See the map of the 8 chapters and what later subjects will deepen', 'Nắm bản đồ 8 chương và phần nào các môn sau sẽ đào sâu']],
    b: [`<div class="callout"><strong>⚠️ Notice.</strong> The university has not published an EEM201 syllabus on FLM (checked by code, variants and name on 09/11/2026). This outline is self-authored from standard textbooks (Bowdin et al.; Goldblatt; Allen, Harris and Jago; Vogel). The grading scheme and exam schedule follow your lecturer.</div>
<p><strong>What it is.</strong> EEM201 is the introductory subject of the entertainment and event management track (second semester). It gives you the whole picture in one pass: what the entertainment and events industry is, which kinds of events exist, who does what, how an event is planned and budgeted, how it is marketed and run, how risk is controlled, and how success is judged. The later subjects of the track (entertainment planning, event production and operations, entertainment marketing, event risk management, strategic event management) take each of these topics much deeper; here we stay at the level of a clear map.</p>
<p><strong>Why it matters.</strong> Concerts, festivals, conferences, trade fairs, brand activations, weddings and sports events all run on the same skeleton: an objective, an audience, a venue, a budget, a team, a timeline and a plan for what can go wrong. A student who understands that skeleton can join a student club event, an internship at an event agency, or a family-business wedding venue and be useful in the first week. It also helps you judge real news with a cool head, from a successful festival to a cancelled one.</p>
<h4>Learning outcomes (self-authored)</h4>
<ol><li>Describe the entertainment and events industry, its main sectors and its value chain.</li>
<li>Classify events (MICE, festivals, concerts, corporate, sports, community) and explain how each type differs in goals and audience.</li>
<li>Identify the stakeholders of an event and the typical job roles in an organising team.</li>
<li>Run the basic planning process: concept, objectives, timeline, venue, suppliers and permits.</li>
<li>Build a simple event budget, compute a break-even point and explain sponsorship and ticketing as revenue sources.</li>
<li>Outline a marketing and communication plan for an event, before, during and after.</li>
<li>Describe event-day operations and apply a simple risk register with a contingency plan.</li>
<li>Evaluate an event with KPIs, write a short post-event report and describe career paths and ethical duties.</li></ol>
<h4>Related subjects</h4>
<p>EEM201 opens the track. In the FPTU framework the later subjects named for it are EEP201 (Entertainment Planning), EPO201 (Event Production and Operations), ETM201 (Entertainment Marketing), ERM301c (Event Risk Management) and STE301 (Strategic Event Management). Exact prerequisites are not published; ask the academic office. Chapter map: 1 Industry overview · 2 Event types · 3 Roles and stakeholders · 4 Planning process · 5 Budget and sponsorship · 6 Marketing and communication · 7 Operations and risk · 8 Evaluation and careers.</p>
<h4>How to study</h4>
<p>Pick one Vietnamese event (for example Huế Festival, a university music night or a Tết flower street) and one international event (for example Glastonbury or Tomorrowland). Apply every chapter to both in a notebook. By Chapter 8 you will have a miniature case study that doubles as an assignment.</p>`,
`<div class="callout"><strong>⚠️ Lưu ý.</strong> Trường chưa công bố syllabus của EEM201 trên FLM (đã dò theo mã, biến thể mã và tên ngày 09/11/2026). Khung này tự soạn theo giáo trình chuẩn (Bowdin và cộng sự; Goldblatt; Allen, Harris và Jago; Vogel). Cách tính điểm và lịch thi theo giảng viên.</div>
<p><strong>Môn này là gì.</strong> EEM201 là môn nhập môn của chuyên ngành quản lý giải trí và sự kiện (học kỳ 2). Môn cho bạn bức tranh toàn cảnh trong một lượt: ngành giải trí và sự kiện là gì, có những loại sự kiện nào, ai làm việc gì, một sự kiện được lên kế hoạch và dự toán ra sao, được quảng bá và vận hành thế nào, rủi ro được kiểm soát ra sao và thành công được đo thế nào. Các môn sau của chuyên ngành (lập kế hoạch giải trí, sản xuất và vận hành sự kiện, marketing giải trí, quản trị rủi ro sự kiện, quản trị chiến lược sự kiện) sẽ đào sâu từng phần; ở đây ta dừng ở mức bản đồ rõ ràng.</p>
<p><strong>Để làm gì.</strong> Hoà nhạc, lễ hội, hội nghị, hội chợ, hoạt động kích hoạt thương hiệu, đám cưới hay sự kiện thể thao đều chạy trên cùng một bộ khung: mục tiêu, khán giả, địa điểm, ngân sách, đội ngũ, tiến độ và phương án cho điều có thể hỏng. Hiểu bộ khung ấy, bạn có thể tham gia đêm nhạc của câu lạc bộ, thực tập ở công ty tổ chức sự kiện hoặc giúp nhà hàng tiệc cưới của gia đình và có ích ngay tuần đầu. Nó cũng giúp bạn đọc tin tức thật bằng cái đầu lạnh, từ một lễ hội thành công đến một lễ hội bị huỷ.</p>
<h4>Chuẩn đầu ra (tự soạn)</h4>
<ol><li>Mô tả ngành giải trí và sự kiện, các mảng chính và chuỗi giá trị.</li>
<li>Phân loại sự kiện (MICE, lễ hội, hoà nhạc, doanh nghiệp, thể thao, cộng đồng) và giải thích khác biệt về mục tiêu và khán giả.</li>
<li>Nhận diện các bên liên quan và vai trò công việc điển hình trong đội tổ chức.</li>
<li>Thực hiện quy trình lập kế hoạch cơ bản: ý tưởng, mục tiêu, tiến độ, địa điểm, nhà cung cấp và giấy phép.</li>
<li>Lập ngân sách sự kiện đơn giản, tính điểm hoà vốn và giải thích tài trợ, bán vé như nguồn thu.</li>
<li>Phác thảo kế hoạch marketing và truyền thông cho sự kiện: trước, trong và sau.</li>
<li>Mô tả vận hành ngày diễn ra và áp dụng sổ rủi ro đơn giản cùng kế hoạch dự phòng.</li>
<li>Đánh giá sự kiện bằng KPI, viết báo cáo sau sự kiện ngắn gọn, mô tả lộ trình nghề nghiệp và trách nhiệm đạo đức.</li></ol>
<h4>Môn liên quan</h4>
<p>EEM201 mở đầu chuyên ngành. Trong khung FPTU, các môn học sau được gọi tên là EEP201 (Lập kế hoạch giải trí), EPO201 (Sản xuất và vận hành sự kiện), ETM201 (Marketing giải trí), ERM301c (Quản trị rủi ro sự kiện) và STE301 (Quản trị chiến lược sự kiện). Môn tiên quyết chính xác chưa được công bố; hỏi phòng đào tạo. Bản đồ chương: 1 Tổng quan ngành · 2 Loại hình sự kiện · 3 Vai trò và bên liên quan · 4 Quy trình lập kế hoạch · 5 Ngân sách và tài trợ · 6 Marketing và truyền thông · 7 Vận hành và rủi ro · 8 Đánh giá và nghề nghiệp.</p>
<h4>Cách học</h4>
<p>Chọn một sự kiện Việt (ví dụ Festival Huế, một đêm nhạc của trường hay đường hoa Tết) và một sự kiện quốc tế (ví dụ Glastonbury hoặc Tomorrowland). Áp từng chương vào cả hai trong sổ tay. Đến Chương 8 bạn đã có một tình huống thu nhỏ dùng luôn làm bài tập.</p>`],
    pit: ['Treating the subject as "party planning". Professional events are run with objectives, budgets and measurable results.', 'Coi môn này là "tổ chức tiệc tùng". Sự kiện chuyên nghiệp được vận hành bằng mục tiêu, ngân sách và kết quả đo được.'],
    s: [['EEM201 = the map of the entertainment and events industry and the event lifecycle.', 'EEM201 = bản đồ ngành giải trí – sự kiện và vòng đời một sự kiện.'],
        ['No FLM syllabus exists: this outline is self-authored from standard textbooks.', 'Chưa có syllabus trên FLM: khung này tự soạn theo giáo trình chuẩn.'],
        ['Later subjects of the track go deeper on planning, production, marketing and risk.', 'Các môn sau của chuyên ngành đào sâu kế hoạch, sản xuất, marketing và rủi ro.']],
    l: ['evm', 'entind', 'eic'],
    p: [['Name three kinds of events that share the same planning skeleton.', 'Kể ba loại sự kiện dùng chung bộ khung lập kế hoạch.', 'For example a concert, a conference and a trade fair: each has an objective, audience, venue, budget, team and timeline.', 'Ví dụ hoà nhạc, hội nghị và hội chợ: mỗi loại đều có mục tiêu, khán giả, địa điểm, ngân sách, đội ngũ và tiến độ.'],
        ['Which outcome of this course will you use first in a student-club event?', 'Chuẩn đầu ra nào của môn bạn sẽ dùng đầu tiên trong sự kiện câu lạc bộ?', 'Any reasoned choice; most students pick outcome 4 (planning) or 5 (budget).', 'Chọn nào có lý do đều được; đa số chọn chuẩn 4 (kế hoạch) hoặc 5 (ngân sách).']] }),

  D(P + '0-2', '0.2 Textbooks & resources', '0.2 Giáo trình & tài liệu',
    'Giáo trình chuẩn có ISBN, tổ chức ngành và nguồn tra cứu đã kiểm.', {
    n: '0.2',
    g: [['Choose a main textbook and references', 'Chọn giáo trình chính và sách tham khảo'], ['Know free sources for definitions, cases and industry research', 'Biết nguồn miễn phí để tra định nghĩa, tình huống và nghiên cứu ngành']],
    b: [`<h4>Books (ISBNs seen in Google Books listings)</h4>
<ul><li><strong>Events Management</strong>, Glenn Bowdin, Johnny Allen, Rob Harris, Ian McDonnell and William O'Toole, Routledge (3rd edition; electronic edition listed 2012), ISBN 978-1-136-44511-8. A 2023 edition with Leo Jago as a co-author (Taylor &amp; Francis) is listed under ISBN 978-1-000-90439-0. <em>Main textbook of this outline.</em></li>
<li><strong>Special Events: Creating and Sustaining a New World for Celebration</strong>, Joe Goldblatt, John Wiley &amp; Sons, 2013, ISBN 978-1-118-62677-1. Strong on event leadership and the history of the profession.</li>
<li><strong>Festival &amp; Special Event Management, Essentials Edition</strong>, Johnny Allen, Robert Harris and Leo Jago, John Wiley &amp; Sons, 2022, ISBN 978-0-7303-6940-0. Compact and practical.</li>
<li><strong>Entertainment Industry Economics: A Guide for Financial Analysis</strong>, Harold L. Vogel, Cambridge University Press, 2020, ISBN 978-1-108-49308-6. For the business side of film, music, live entertainment and media.</li></ul>
<p>Edition note: newer editions may exist; the chapters of this course do not depend on page numbers. Check the number on your own copy.</p>
<h4>Industry bodies and open resources (checked to open)</h4>
<ul><li><a href="https://www.eventscouncil.org/" target="_blank" rel="noopener">Events Industry Council</a> — research and professional certification (CMP).</li>
<li><a href="https://www.iccaworld.org/" target="_blank" rel="noopener">ICCA</a> — international association for association meetings and congresses.</li>
<li><a href="https://www.ufi.org/" target="_blank" rel="noopener">UFI</a> — global association of the exhibition industry.</li>
<li><a href="https://www.hse.gov.uk/event-safety/" target="_blank" rel="noopener">UK HSE event safety</a> — free guidance; the principles transfer to any country.</li>
<li><a href="https://www.eventbrite.com/blog/" target="_blank" rel="noopener">Eventbrite Blog</a> — practical articles on ticketing and promotion.</li></ul>
<p>Vietnamese legal rules on performances, advertising, fire safety and crowd control change; always check the current regulations with the local authority or your lecturer. This course does not quote legal articles.</p>`,
`<h4>Sách (ISBN thấy trên danh mục Google Books)</h4>
<ul><li><strong>Events Management</strong>, Glenn Bowdin, Johnny Allen, Rob Harris, Ian McDonnell và William O'Toole, Routledge (lần 3; bản điện tử ghi năm 2012), ISBN 978-1-136-44511-8. Bản 2023 có Leo Jago cùng tác giả (Taylor &amp; Francis) ghi ISBN 978-1-000-90439-0. <em>Giáo trình chính của khung này.</em></li>
<li><strong>Special Events: Creating and Sustaining a New World for Celebration</strong>, Joe Goldblatt, John Wiley &amp; Sons, 2013, ISBN 978-1-118-62677-1. Mạnh về lãnh đạo sự kiện và lịch sử nghề.</li>
<li><strong>Festival &amp; Special Event Management, Essentials Edition</strong>, Johnny Allen, Robert Harris và Leo Jago, John Wiley &amp; Sons, 2022, ISBN 978-0-7303-6940-0. Gọn và thực dụng.</li>
<li><strong>Entertainment Industry Economics: A Guide for Financial Analysis</strong>, Harold L. Vogel, Cambridge University Press, 2020, ISBN 978-1-108-49308-6. Dành cho mặt kinh doanh của phim, nhạc, giải trí trực tiếp và truyền thông.</li></ul>
<p>Lưu ý ấn bản: có thể đã có bản mới hơn; các chương của khoá không phụ thuộc số trang. Hãy kiểm số ISBN trên cuốn bạn cầm.</p>
<h4>Tổ chức ngành và nguồn mở (đã kiểm mở được)</h4>
<ul><li><a href="https://www.eventscouncil.org/" target="_blank" rel="noopener">Events Industry Council</a> — nghiên cứu và chứng chỉ nghề (CMP).</li>
<li><a href="https://www.iccaworld.org/" target="_blank" rel="noopener">ICCA</a> — hiệp hội quốc tế về hội nghị và đại hội của các hiệp hội.</li>
<li><a href="https://www.ufi.org/" target="_blank" rel="noopener">UFI</a> — hiệp hội triển lãm toàn cầu.</li>
<li><a href="https://www.hse.gov.uk/event-safety/" target="_blank" rel="noopener">HSE (Anh) về an toàn sự kiện</a> — hướng dẫn miễn phí; nguyên tắc dùng được ở mọi nước.</li>
<li><a href="https://www.eventbrite.com/blog/" target="_blank" rel="noopener">Eventbrite Blog</a> — bài thực hành về bán vé và quảng bá.</li></ul>
<p>Quy định pháp luật Việt Nam về biểu diễn, quảng cáo, phòng cháy và an ninh đám đông thay đổi theo thời gian; luôn kiểm quy định hiện hành với cơ quan địa phương hoặc giảng viên. Khoá này không trích điều luật.</p>`],
    pit: ['Memorising one textbook\'s case figures. Cases age quickly; learn the method and re-check the numbers from a current source.', 'Học thuộc số liệu tình huống của một cuốn sách. Tình huống cũ rất nhanh; hãy học phương pháp và kiểm lại số liệu từ nguồn mới.'],
    s: [['Main text: Bowdin et al., Events Management; references: Goldblatt, Allen–Harris–Jago, Vogel.', 'Giáo trình chính: Bowdin và cộng sự, Events Management; tham khảo: Goldblatt, Allen–Harris–Jago, Vogel.'],
        ['Industry bodies publish free research and standards.', 'Các tổ chức ngành công bố miễn phí nghiên cứu và chuẩn.'],
        ['Always check local regulations; they change.', 'Luôn kiểm quy định địa phương vì chúng thay đổi.']],
    l: ['eic', 'icca', 'ufi', 'hse'],
    p: [['Why should you re-check figures in any case study?', 'Vì sao nên kiểm lại số liệu trong mọi tình huống?', 'Figures and rules change; a current source keeps your analysis honest.', 'Số liệu và quy định thay đổi; nguồn mới giữ cho phân tích của bạn trung thực.'],
        ['Which resource would you open to learn about exhibitions?', 'Bạn mở tài nguyên nào để tìm hiểu về triển lãm?', 'UFI, the global association of the exhibition industry.', 'UFI, hiệp hội triển lãm toàn cầu.']] }),
]));
// ===== Chương 1 =====
secs.push(SEC('Chapter 1 — Industry overview', 'Chương 1 — Tổng quan ngành giải trí và sự kiện',
  'Ngành giải trí – sự kiện gồm những mảng nào, chuỗi giá trị, nguồn thu và bối cảnh Việt Nam.', [
  D(P + '1-1', '1.1 What the entertainment and events industry is', '1.1 Ngành giải trí và sự kiện là gì',
    'Định nghĩa giải trí, sự kiện, các mảng chính của ngành.', {
    n: '1.1',
    g: [['Define entertainment and event, and tell them apart', 'Định nghĩa giải trí và sự kiện, phân biệt hai khái niệm'], ['List the main sectors of the industry', 'Liệt kê các mảng chính của ngành'], ['Explain why live experiences matter in a digital age', 'Giải thích vì sao trải nghiệm trực tiếp vẫn quan trọng trong thời số']],
    b: [`<p><strong>Entertainment</strong> is content or activity that holds an audience's attention and gives pleasure: music, film, games, theatre, sport, comedy, shows. An <strong>event</strong> is a planned occasion, limited in time and place, that gathers people for a purpose: to celebrate, learn, trade, compete or be entertained. The two overlap in <em>live entertainment</em>, such as a concert, but they are not identical: a shareholders' meeting is an event without entertainment, and a streamed film is entertainment without an event.</p>
<h4>Main sectors</h4>` + tbl(['Sector', 'Typical products', 'How events connect'], [['Music', 'Recordings, streaming, concerts, festivals', 'Tours and festivals are a major income source for artists'], ['Film and TV', 'Cinema, series, premieres', 'Premieres, film festivals, fan conventions'], ['Games and esports', 'Video games, tournaments', 'Live tournaments and gaming expos'], ['Sports', 'Leagues, matches, mega-events', 'Matches, Olympic Games, regional games'], ['Performing arts', 'Theatre, dance, circus, comedy', 'Seasons and touring productions'], ['Business events (MICE)', 'Meetings, incentives, conferences, exhibitions', 'The event is the product itself'], ['Community and cultural', 'Festivals, parades, Tết markets', 'Public celebration, tourism']]) + `
<h4>Why live still matters</h4>
<p>Recorded media can be copied at almost no cost, but a shared moment cannot. Fans who stream a song for free still queue for a concert; companies that hold video calls still fly staff to a conference for trust and networking. Textbooks such as Bowdin et al. describe events as a response to this human wish to gather. Case: when <a href="` + W + `Born_Pink_World_Tour" target="_blank" rel="noopener">Blackpink's Born Pink tour</a> played two nights in Hanoi on 29 and 30 July 2023, the draw was the live experience itself, not the music, which was already available to everyone online.</p>
<h4>The scope of this course</h4>
<p>We treat entertainment events (concerts, festivals, shows) and business events (MICE) together, because they share planning methods. The deeper craft of each is left to the later subjects of the track.</p>`,
`<p><strong>Giải trí</strong> là nội dung hay hoạt động giữ sự chú ý của khán giả và mang lại niềm vui: âm nhạc, phim, trò chơi, sân khấu, thể thao, hài, chương trình biểu diễn. <strong>Sự kiện</strong> là một dịp được lên kế hoạch, giới hạn về thời gian và địa điểm, quy tụ mọi người vì một mục đích: ăn mừng, học tập, giao thương, thi đấu hoặc giải trí. Hai khái niệm chồng lên nhau ở <em>giải trí trực tiếp</em> như hoà nhạc, nhưng không đồng nhất: đại hội cổ đông là sự kiện không có giải trí, còn bộ phim xem trực tuyến là giải trí không có sự kiện.</p>
<h4>Các mảng chính</h4>` + tbl(['Mảng', 'Sản phẩm điển hình', 'Liên hệ với sự kiện'], [['Âm nhạc', 'Bản thu, streaming, hoà nhạc, lễ hội', 'Lưu diễn và lễ hội là nguồn thu lớn của nghệ sĩ'], ['Phim và truyền hình', 'Rạp, series, công chiếu', 'Lễ ra mắt, liên hoan phim, hội fan'], ['Game và esports', 'Trò chơi, giải đấu', 'Giải đấu trực tiếp, triển lãm game'], ['Thể thao', 'Giải đấu, trận đấu, sự kiện lớn', 'Trận đấu, Olympic, đại hội khu vực'], ['Biểu diễn nghệ thuật', 'Sân khấu, múa, xiếc, hài', 'Mùa diễn và vở lưu diễn'], ['Sự kiện doanh nghiệp (MICE)', 'Họp, khen thưởng, hội nghị, triển lãm', 'Sự kiện chính là sản phẩm'], ['Cộng đồng và văn hoá', 'Lễ hội, diễu hành, chợ Tết', 'Ăn mừng công cộng, du lịch']]) + `
<h4>Vì sao trực tiếp vẫn quan trọng</h4>
<p>Phương tiện ghi âm, ghi hình sao chép gần như miễn phí, nhưng một khoảnh khắc chung thì không. Người nghe nhạc miễn phí vẫn xếp hàng mua vé hoà nhạc; công ty họp qua video vẫn đưa nhân viên đi hội nghị để xây dựng lòng tin và kết nối. Các giáo trình như Bowdin và cộng sự mô tả sự kiện là câu trả lời cho nhu cầu tụ họp của con người. Ví dụ: khi <a href="` + W + `Born_Pink_World_Tour" target="_blank" rel="noopener">chuyến lưu diễn Born Pink của Blackpink</a> diễn hai đêm tại Hà Nội ngày 29 và 30/7/2023, sức hút nằm ở trải nghiệm trực tiếp chứ không phải bài hát vốn ai cũng nghe được trên mạng.</p>
<h4>Phạm vi của khoá</h4>
<p>Ta xét chung sự kiện giải trí (hoà nhạc, lễ hội, chương trình) và sự kiện doanh nghiệp (MICE) vì chúng dùng chung phương pháp lập kế hoạch. Kỹ nghệ sâu của từng loại dành cho các môn sau của chuyên ngành.</p>`],
    pit: ['Saying "event" and "entertainment" mean the same. A good analysis states which one a project really is selling.', 'Nói "sự kiện" và "giải trí" là một. Phân tích tốt chỉ rõ dự án thực sự đang bán cái nào.'],
    s: [['Entertainment is content that holds attention; an event is a planned gathering.', 'Giải trí là nội dung giữ sự chú ý; sự kiện là cuộc tụ họp có kế hoạch.'], ['Main sectors: music, film/TV, games, sports, performing arts, MICE, community.', 'Các mảng chính: âm nhạc, phim/TV, game, thể thao, biểu diễn, MICE, cộng đồng.'], ['Live experiences keep their value because they cannot be copied.', 'Trải nghiệm trực tiếp giữ giá trị vì không thể sao chép.']],
    l: ['ent', 'entind', 'evm', 'bp'],
    p: [['Give one example of an event with no entertainment and one entertainment with no event.', 'Cho một ví dụ sự kiện không có giải trí và một giải trí không có sự kiện.', 'Shareholders\' meeting; a film streamed at home.', 'Đại hội cổ đông; phim xem tại nhà.'],
        ['Why do fans still buy concert tickets when the music is free online?', 'Vì sao fan vẫn mua vé hoà nhạc khi nhạc có sẵn miễn phí trên mạng?', 'The live, shared, unrepeatable experience cannot be copied.', 'Trải nghiệm trực tiếp, chung và không lặp lại không thể sao chép.']] }),

  D(P + '1-2', '1.2 The value chain and revenue sources', '1.2 Chuỗi giá trị và nguồn thu',
    'Ai làm gì từ nghệ sĩ đến khán giả; các nguồn thu của sự kiện giải trí.', {
    n: '1.2',
    g: [['Trace the value chain from talent to audience', 'Lần theo chuỗi giá trị từ nghệ sĩ đến khán giả'], ['List the main revenue streams of a live event', 'Liệt kê các nguồn thu chính của sự kiện trực tiếp'], ['Explain the role of promoter, agent and ticketing company', 'Giải thích vai trò promoter, người đại diện và đơn vị bán vé']],
    b: [`<p>A live entertainment event is the end of a chain, and each link takes a share of the money and the risk.</p>
<div class="formula"><span class="lbl">Value chain of a concert</span>Artist and team → agent/manager → promoter → venue and production → ticketing and sponsors → audience</div>
<ul><li><strong>Artist and management:</strong> create the show; the manager guides the career.</li>
<li><strong>Booking agent:</strong> sells the artist's performance dates to promoters. See <a href="` + W + `Talent_agent" target="_blank" rel="noopener">talent agent</a>.</li>
<li><strong>Promoter:</strong> takes the financial risk, books the venue, sets ticket prices and markets the show. See <a href="` + W + `Concert_promoter" target="_blank" rel="noopener">concert promoter</a>.</li>
<li><strong>Venue and production:</strong> stadium, hall or field; stage, sound, light, staff.</li>
<li><strong>Ticketing and sponsors:</strong> companies that sell tickets and brands that pay to be associated with the show.</li></ul>
<h4>Revenue streams</h4>` + tbl(['Stream', 'Example', 'Who usually collects'], [['Ticket sales', 'General admission, VIP, early bird', 'Promoter or organiser (after ticketing fees)'], ['Sponsorship', 'Title sponsor, official partners', 'Organiser'], ['Food and beverage', 'Bars, stalls, vouchers', 'Venue or organiser, sometimes shared with vendors'], ['Merchandise', 'T-shirts, light sticks', 'Artist, often split with the venue'], ['Rights', 'Broadcast, streaming, recording', 'Organiser and artist by contract'], ['Grants and public funding', 'Cultural or tourism budgets', 'Public or non-profit events']]) + `
<h4>Case: one company across several links</h4>
<p>Live Nation Entertainment describes itself as a company active in live events and ticketing, and its ticketing arm is Ticketmaster; the two joined in 2010 (<a href="` + W + `Live_Nation_Entertainment" target="_blank" rel="noopener">Wikipedia</a>). This integration shows why regulators and artists debate market power: one firm can sit at several links of the chain. In Vietnam the chain is shorter and more varied: a single local organiser often does promotion, production and ticketing together.</p>
<p>Understanding the chain tells you where your own project makes or loses money: a promoter who cannot sell enough tickets bears the loss even if the artist is paid in advance.</p>`,
`<p>Một sự kiện giải trí trực tiếp là mắt xích cuối của một chuỗi, và mỗi mắt xích lấy một phần tiền và một phần rủi ro.</p>
<div class="formula"><span class="lbl">Chuỗi giá trị của một buổi hoà nhạc</span>Nghệ sĩ và đội ngũ → người đại diện/quản lý → promoter → địa điểm và sản xuất → bán vé và nhà tài trợ → khán giả</div>
<ul><li><strong>Nghệ sĩ và quản lý:</strong> tạo ra chương trình; quản lý định hướng sự nghiệp.</li>
<li><strong>Người đại diện (booking agent):</strong> bán các ngày biểu diễn của nghệ sĩ cho promoter. Xem <a href="` + W + `Talent_agent" target="_blank" rel="noopener">talent agent</a>.</li>
<li><strong>Promoter:</strong> chịu rủi ro tài chính, thuê địa điểm, định giá vé và quảng bá chương trình. Xem <a href="` + W + `Concert_promoter" target="_blank" rel="noopener">concert promoter</a>.</li>
<li><strong>Địa điểm và sản xuất:</strong> sân vận động, nhà hát hay bãi đất; sân khấu, âm thanh, ánh sáng, nhân sự.</li>
<li><strong>Bán vé và nhà tài trợ:</strong> công ty bán vé và thương hiệu trả tiền để gắn với chương trình.</li></ul>
<h4>Các nguồn thu</h4>` + tbl(['Nguồn', 'Ví dụ', 'Ai thường thu'], [['Bán vé', 'Vé thường, VIP, vé sớm', 'Promoter hoặc ban tổ chức (sau phí bán vé)'], ['Tài trợ', 'Nhà tài trợ chính, đối tác chính thức', 'Ban tổ chức'], ['Ăn uống', 'Quầy bar, gian hàng, phiếu', 'Địa điểm hoặc ban tổ chức, đôi khi chia với nhà bán'], ['Hàng lưu niệm', 'Áo, gậy cổ vũ', 'Nghệ sĩ, thường chia với địa điểm'], ['Bản quyền', 'Phát sóng, streaming, thu hình', 'Ban tổ chức và nghệ sĩ theo hợp đồng'], ['Tài trợ công, quỹ', 'Ngân sách văn hoá, du lịch', 'Sự kiện công cộng hoặc phi lợi nhuận']]) + `
<h4>Tình huống: một công ty đứng ở nhiều mắt xích</h4>
<p>Live Nation Entertainment tự mô tả là công ty hoạt động trong sự kiện trực tiếp và bán vé, mảng bán vé là Ticketmaster; hai bên hợp nhất năm 2010 (<a href="` + W + `Live_Nation_Entertainment" target="_blank" rel="noopener">Wikipedia</a>). Sự tích hợp này cho thấy vì sao cơ quan quản lý và nghệ sĩ tranh luận về sức mạnh thị trường: một công ty có thể đứng ở nhiều mắt xích. Ở Việt Nam, chuỗi ngắn và đa dạng hơn: một đơn vị tổ chức địa phương thường làm cả quảng bá, sản xuất và bán vé.</p>
<p>Hiểu chuỗi giá trị giúp bạn biết dự án mình lời hay lỗ ở đâu: promoter bán không đủ vé sẽ chịu lỗ dù nghệ sĩ đã được trả trước.</p>`],
    pit: ['Assuming the artist keeps most of the ticket price. Costs and shares along the chain take a large part; always read the contract.', 'Cho rằng nghệ sĩ giữ phần lớn tiền vé. Chi phí và phần chia dọc chuỗi lấy một phần lớn; luôn đọc hợp đồng.'],
    s: [['Chain: artist, agent/manager, promoter, venue/production, ticketing/sponsors, audience.', 'Chuỗi: nghệ sĩ, đại diện/quản lý, promoter, địa điểm/sản xuất, bán vé/tài trợ, khán giả.'], ['The promoter usually carries the financial risk.', 'Promoter thường chịu rủi ro tài chính.'], ['Revenue: tickets, sponsorship, F&B, merchandise, rights, grants.', 'Nguồn thu: vé, tài trợ, ăn uống, hàng lưu niệm, bản quyền, tài trợ công.']],
    l: ['promo', 'agent', 'ln', 'tm'],
    p: [['Who normally bears the risk if tickets do not sell?', 'Ai thường chịu rủi ro nếu vé không bán được?', 'The promoter (or organiser who put up the money).', 'Promoter (hoặc ban tổ chức đã bỏ vốn).'],
        ['Name four revenue streams of a music festival.', 'Kể bốn nguồn thu của một lễ hội âm nhạc.', 'Tickets, sponsorship, food and beverage, merchandise (also rights).', 'Vé, tài trợ, ăn uống, hàng lưu niệm (và cả bản quyền).']] }),

  D(P + '1-3', '1.3 Events, tourism and the Vietnamese context', '1.3 Sự kiện, du lịch và bối cảnh Việt Nam',
    'Vai trò kinh tế của sự kiện, du lịch sự kiện, ví dụ Việt Nam và xu hướng.', {
    n: '1.3',
    g: [['Explain how events create economic and social value', 'Giải thích sự kiện tạo giá trị kinh tế và xã hội thế nào'], ['Give Vietnamese examples of festivals, MICE and sports events', 'Nêu ví dụ Việt Nam về lễ hội, MICE, thể thao'], ['Name current trends that shape the industry', 'Nêu các xu hướng đang định hình ngành']],
    b: [`<h4>Why cities and governments back events</h4>
<p>Events bring visitors who spend on hotels, food and transport, give a place an identity and lift local pride. Public bodies therefore use events as a tool of tourism and city branding. Large one-off occasions such as the <a href="` + W + `Olympic_Games" target="_blank" rel="noopener">Olympic Games</a> or <a href="` + W + `Expo_2020" target="_blank" rel="noopener">Expo 2020 Dubai</a> (held in 2021–22) are called mega-events; most events are far smaller but follow the same logic: visitors in, spending, image, and sometimes disruption for residents.</p>
<h4>Vietnamese examples</h4>
<ul><li><strong>Cultural festivals:</strong> Huế Festival, held in the former imperial capital since 2000, ties heritage to tourism. The Da Nang International Fireworks Festival is a competition between fireworks teams that fills hotels in summer.</li>
<li><strong>Community and seasonal:</strong> the Tết flower streets in cities, for example Nguyễn Huệ in Hồ Chí Minh City, are free public events with heavy crowd management.</li>
<li><strong>Sports:</strong> the <a href="` + W + `2021_Southeast_Asian_Games" target="_blank" rel="noopener">31st SEA Games</a> were hosted in Hanoi in May 2022 after a postponement.</li>
<li><strong>International concerts:</strong> Blackpink's two nights in Hanoi in July 2023 show that Vietnam is now on international touring routes.</li>
<li><strong>MICE:</strong> the Vietnamese tourism authority promotes business events; see <a href="https://vietnam.travel/" target="_blank" rel="noopener">vietnam.travel</a>.</li></ul>
<h4>Trends</h4>` + tbl(['Trend', 'What it means for organisers'], [['Hybrid and online access', 'Add livestream or recorded content; new revenue and new risks'], ['Sustainability', 'Waste, energy and transport plans; sponsors ask for them'], ['Data and personalisation', 'Ticket data drives marketing and pricing'], ['Experience economy', 'Audiences want to take part and share, not only watch'], ['Safety expectations', 'Crowd safety is judged publicly after incidents']]) + `
<p>Keep a critical eye: figures on "economic impact" often come from the organiser or a sponsor. Ask who measured it, how, and for which year.</p>`,
`<h4>Vì sao thành phố và chính quyền hậu thuẫn sự kiện</h4>
<p>Sự kiện mang khách đến chi tiêu cho khách sạn, ăn uống, đi lại, tạo bản sắc cho một nơi và nâng niềm tự hào địa phương. Vì vậy cơ quan công quyền dùng sự kiện làm công cụ du lịch và xây dựng thương hiệu thành phố. Những dịp lớn một lần như <a href="` + W + `Olympic_Games" target="_blank" rel="noopener">Thế vận hội Olympic</a> hay <a href="` + W + `Expo_2020" target="_blank" rel="noopener">Expo 2020 Dubai</a> (tổ chức 2021–22) gọi là mega-event; phần lớn sự kiện nhỏ hơn nhiều nhưng theo cùng logic: khách đến, chi tiêu, hình ảnh, và đôi khi gây phiền cho cư dân.</p>
<h4>Ví dụ Việt Nam</h4>
<ul><li><strong>Lễ hội văn hoá:</strong> Festival Huế, tổ chức tại cố đô từ năm 2000, gắn di sản với du lịch. Lễ hội pháo hoa quốc tế Đà Nẵng là cuộc thi giữa các đội pháo hoa và làm đầy khách sạn vào mùa hè.</li>
<li><strong>Cộng đồng và theo mùa:</strong> đường hoa Tết ở các thành phố, như đường Nguyễn Huệ ở TP. Hồ Chí Minh, là sự kiện công cộng miễn phí đòi hỏi quản lý đám đông chặt chẽ.</li>
<li><strong>Thể thao:</strong> <a href="` + W + `2021_Southeast_Asian_Games" target="_blank" rel="noopener">SEA Games 31</a> được tổ chức tại Hà Nội vào tháng 5/2022 sau khi hoãn.</li>
<li><strong>Hoà nhạc quốc tế:</strong> hai đêm diễn của Blackpink tại Hà Nội tháng 7/2023 cho thấy Việt Nam đã nằm trong lộ trình lưu diễn quốc tế.</li>
<li><strong>MICE:</strong> cơ quan du lịch Việt Nam quảng bá sự kiện doanh nghiệp; xem <a href="https://vietnam.travel/" target="_blank" rel="noopener">vietnam.travel</a>.</li></ul>
<h4>Xu hướng</h4>` + tbl(['Xu hướng', 'Ý nghĩa với người tổ chức'], [['Hybrid và truy cập trực tuyến', 'Thêm livestream hay nội dung ghi hình; nguồn thu mới và rủi ro mới'], ['Bền vững', 'Kế hoạch rác, năng lượng, đi lại; nhà tài trợ đòi hỏi'], ['Dữ liệu và cá nhân hoá', 'Dữ liệu vé dẫn dắt marketing và định giá'], ['Kinh tế trải nghiệm', 'Khán giả muốn tham gia và chia sẻ, không chỉ xem'], ['Kỳ vọng về an toàn', 'An toàn đám đông bị công chúng đánh giá sau sự cố']]) + `
<p>Hãy giữ con mắt phê phán: số liệu về "tác động kinh tế" thường do ban tổ chức hay nhà tài trợ đưa ra. Hỏi ai đo, đo thế nào, cho năm nào.</p>`],
    pit: ['Quoting a huge "economic impact" number without a source. Always note who produced it and when.', 'Trích một con số "tác động kinh tế" khổng lồ mà không có nguồn. Luôn ghi ai tạo ra và khi nào.'],
    s: [['Events create visitor spending, identity and pride; governments use them for tourism.', 'Sự kiện tạo chi tiêu của khách, bản sắc và niềm tự hào; chính quyền dùng cho du lịch.'], ['Vietnamese examples: Huế Festival, Da Nang fireworks, Tết flower streets, SEA Games 31, international concerts.', 'Ví dụ Việt Nam: Festival Huế, pháo hoa Đà Nẵng, đường hoa Tết, SEA Games 31, hoà nhạc quốc tế.'], ['Trends: hybrid, sustainability, data, experience, safety.', 'Xu hướng: hybrid, bền vững, dữ liệu, trải nghiệm, an toàn.']],
    l: ['oly', 'expo', 'sea', 'btour', 'vtravel'],
    p: [['What makes an event a "mega-event"?', 'Điều gì khiến một sự kiện thành "mega-event"?', 'Very large scale, global attention, big public investment, one-off or rare (e.g. Olympics).', 'Quy mô rất lớn, thu hút chú ý toàn cầu, đầu tư công lớn, một lần hoặc hiếm (ví dụ Olympic).'],
        ['Pick a Vietnamese event and name one benefit and one cost for local residents.', 'Chọn một sự kiện Việt Nam và nêu một lợi ích, một chi phí cho cư dân.', 'Example: Tết flower street brings celebration (benefit) but causes road closures and crowds (cost).', 'Ví dụ: đường hoa Tết mang không khí lễ hội (lợi ích) nhưng gây cấm đường và đông đúc (chi phí).']] }),

  Q(P + 'quiz-1', 'Chapter 1 quiz — Industry overview', 'Quiz Chương 1 — Tổng quan ngành', [
    ['An event is best described as…|||Sự kiện được mô tả đúng nhất là…', ['A planned occasion limited in time and place|||Dịp có kế hoạch, giới hạn thời gian và địa điểm', 'Any film shown online|||Mọi bộ phim chiếu trực tuyến', 'A permanent shop|||Một cửa hàng cố định', 'A product warranty|||Một bảo hành sản phẩm'], 0, 'An event gathers people for a purpose within a set time and place.|||Sự kiện quy tụ mọi người vì một mục đích trong thời gian và địa điểm xác định.'],
    ['Which is MICE?|||Đâu là MICE?', ['Meetings, incentives, conferences, exhibitions|||Họp, khen thưởng, hội nghị, triển lãm', 'Music, ice, cinema, events|||Âm nhạc, đá, phim, sự kiện', 'Markets, internet, cash, exports|||Chợ, internet, tiền mặt, xuất khẩu', 'Media, insurance, contracts, energy|||Truyền thông, bảo hiểm, hợp đồng, năng lượng'], 0, 'MICE is the standard label for business events.|||MICE là nhãn chuẩn cho sự kiện doanh nghiệp.'],
    ['Who usually carries the financial risk of a concert?|||Ai thường chịu rủi ro tài chính của buổi hoà nhạc?', ['The promoter|||Promoter', 'The audience|||Khán giả', 'The security guard|||Nhân viên bảo vệ', 'The printer|||Nhà in'], 0, 'The promoter puts up money and earns or loses with ticket sales.|||Promoter bỏ vốn và lời hay lỗ theo doanh thu vé.'],
    ['A booking agent mainly…|||Booking agent chủ yếu…', ['Sells an artist\'s performance dates to promoters|||Bán các ngày biểu diễn của nghệ sĩ cho promoter', 'Builds the stage|||Dựng sân khấu', 'Cleans the venue|||Dọn địa điểm', 'Prints tickets|||In vé'], 0, 'Agents connect artists with promoters.|||Người đại diện kết nối nghệ sĩ với promoter.'],
    ['Which is a revenue stream of a festival?|||Đâu là nguồn thu của lễ hội?', ['Sponsorship|||Tài trợ', 'Fire alarm|||Chuông báo cháy', 'Stage curtain|||Màn sân khấu', 'Parking cone|||Cọc giao thông'], 0, 'Sponsorship sits next to tickets, F&B and merchandise.|||Tài trợ nằm cạnh vé, ăn uống và hàng lưu niệm.'],
    ['Why do people still attend live events?|||Vì sao người ta vẫn tham dự sự kiện trực tiếp?', ['A shared live experience cannot be copied|||Trải nghiệm chung trực tiếp không thể sao chép', 'Recordings are illegal|||Bản ghi bị cấm', 'Tickets are always free|||Vé luôn miễn phí', 'Streaming does not exist|||Không có streaming'], 0, 'Live experience keeps value in the digital age.|||Trải nghiệm trực tiếp giữ giá trị trong thời số.'],
    ['A mega-event is…|||Mega-event là…', ['A very large, globally watched event such as the Olympics|||Sự kiện rất lớn, được cả thế giới theo dõi như Olympic', 'A weekly staff meeting|||Cuộc họp nhân viên hằng tuần', 'A small birthday|||Sinh nhật nhỏ', 'A software update|||Bản cập nhật phần mềm'], 0, 'Mega-events combine scale, attention and public investment.|||Mega-event gồm quy mô, sự chú ý và đầu tư công.'],
    ['Economic impact figures should be…|||Số liệu tác động kinh tế nên được…', ['Checked for source, method and year|||Kiểm nguồn, phương pháp và năm', 'Accepted at once|||Chấp nhận ngay', 'Hidden|||Giấu đi', 'Doubled|||Nhân đôi'], 0, 'Organisers and sponsors often supply them.|||Ban tổ chức và nhà tài trợ thường là người cung cấp.'],
    ['Hybrid events add…|||Sự kiện hybrid thêm…', ['An online way to take part|||Một cách tham gia trực tuyến', 'A second venue only|||Chỉ một địa điểm thứ hai', 'Less planning|||Ít lập kế hoạch hơn', 'No audience|||Không khán giả'], 0, 'They combine in-person and online participation.|||Chúng kết hợp tham gia trực tiếp và trực tuyến.']
  ]),
]));
// ===== Chương 2 =====
secs.push(SEC('Chapter 2 — Event types', 'Chương 2 — Loại hình sự kiện',
  'Cách phân loại sự kiện, sự kiện giải trí, sự kiện doanh nghiệp, thể thao và cộng đồng.', [
  D(P + '2-1', '2.1 Ways to classify events', '2.1 Các cách phân loại sự kiện',
    'Phân loại theo quy mô, mục đích, khán giả, vòng đời; vì sao phân loại giúp lập kế hoạch.', {
    n: '2.1',
    g: [['Classify an event by size, purpose, audience and frequency', 'Phân loại sự kiện theo quy mô, mục đích, khán giả và tần suất'], ['Tell mega, hallmark, major and local events apart', 'Phân biệt mega, hallmark, major và local'], ['Use the classification to predict planning needs', 'Dùng phân loại để dự đoán nhu cầu lập kế hoạch']],
    b: [`<p>No single list covers all events, so planners classify along several axes. Choosing the right axis tells you what the event needs.</p>` + tbl(['Axis', 'Categories', 'Why it matters'], [['Size and reach', 'Mega, hallmark, major, local', 'Budget, media, government involvement'], ['Purpose', 'Celebrate, educate, trade, compete, entertain, raise funds', 'Objectives and success measures'], ['Audience', 'Public ticketed, invited, members, employees', 'Marketing channel and access control'], ['Frequency', 'One-off, annual, touring, series', 'Brand building and learning from past editions'], ['Setting', 'Indoor, outdoor, venue, multi-site, online', 'Weather risk, permits, technology'], ['Sector', 'Corporate, sport, culture, music, community', 'Suppliers and regulations']]) + `
<h4>Scale labels</h4>
<ul><li><strong>Mega-event:</strong> global attention, large public investment, such as the Olympic Games.</li>
<li><strong>Hallmark event:</strong> so tied to a place that it becomes its identity; a festival that people link with a city.</li>
<li><strong>Major event:</strong> attracts national or regional audiences and media, such as a big league final or a large concert.</li>
<li><strong>Local or community event:</strong> small scale, run by clubs, schools, neighbourhoods.</li></ul>
<h4>Worked example</h4>
<p>A university "Music Night" for 800 students: size local, purpose entertain and build community, audience invited (students), frequency annual, setting indoor hall, sector music/education. Predicted needs: school permission, a hall booking, basic sound and light, ID-based entry, first aid, and a budget funded by sponsors and a small ticket price. The same exercise for a 40,000-seat stadium concert predicts permits from authorities, traffic plans, large security, insurance and a promoter.</p>
<p>Read more about the vocabulary in <a href="` + W + `Event_management" target="_blank" rel="noopener">Event management</a>.</p>`,
`<p>Không có một danh sách nào bao trùm mọi sự kiện, nên người lập kế hoạch phân loại theo nhiều trục. Chọn đúng trục sẽ cho biết sự kiện cần gì.</p>` + tbl(['Trục', 'Nhóm', 'Vì sao quan trọng'], [['Quy mô và phạm vi', 'Mega, hallmark, major, local', 'Ngân sách, truyền thông, mức tham gia của chính quyền'], ['Mục đích', 'Ăn mừng, giáo dục, giao thương, thi đấu, giải trí, gây quỹ', 'Mục tiêu và thước đo thành công'], ['Khán giả', 'Bán vé công khai, mời, hội viên, nhân viên', 'Kênh marketing và kiểm soát ra vào'], ['Tần suất', 'Một lần, hằng năm, lưu diễn, chuỗi', 'Xây thương hiệu và học từ các kỳ trước'], ['Bối cảnh', 'Trong nhà, ngoài trời, tại địa điểm, nhiều điểm, trực tuyến', 'Rủi ro thời tiết, giấy phép, công nghệ'], ['Lĩnh vực', 'Doanh nghiệp, thể thao, văn hoá, âm nhạc, cộng đồng', 'Nhà cung cấp và quy định']]) + `
<h4>Các nhãn quy mô</h4>
<ul><li><strong>Mega-event:</strong> được cả thế giới chú ý, đầu tư công lớn, như Thế vận hội Olympic.</li>
<li><strong>Hallmark event:</strong> gắn chặt với một nơi đến mức thành bản sắc của nơi đó; lễ hội mà người ta liên tưởng ngay tới một thành phố.</li>
<li><strong>Major event:</strong> thu hút khán giả và báo chí quốc gia hay khu vực, như chung kết giải lớn hay hoà nhạc lớn.</li>
<li><strong>Sự kiện địa phương/cộng đồng:</strong> quy mô nhỏ, do câu lạc bộ, trường, khu phố tổ chức.</li></ul>
<h4>Ví dụ giải từng bước</h4>
<p>Một "Đêm nhạc" của trường cho 800 sinh viên: quy mô địa phương, mục đích giải trí và gắn kết, khán giả được mời (sinh viên), tần suất hằng năm, bối cảnh hội trường, lĩnh vực âm nhạc/giáo dục. Nhu cầu dự đoán: sự đồng ý của nhà trường, thuê hội trường, âm thanh ánh sáng cơ bản, kiểm soát vào cửa theo thẻ sinh viên, sơ cứu, ngân sách từ tài trợ và giá vé nhỏ. Làm cùng bài tập cho hoà nhạc sân vận động 40.000 chỗ sẽ dự đoán giấy phép của cơ quan chức năng, kế hoạch giao thông, an ninh lớn, bảo hiểm và một promoter.</p>
<p>Đọc thêm về thuật ngữ tại <a href="` + W + `Event_management" target="_blank" rel="noopener">Event management</a>.</p>`],
    pit: ['Planning a large public event with the checklist of a small private one. Classify first, then size the plan.', 'Lập kế hoạch sự kiện công cộng lớn bằng danh mục của sự kiện riêng nhỏ. Hãy phân loại trước rồi mới định cỡ kế hoạch.'],
    s: [['Classify along several axes: size, purpose, audience, frequency, setting, sector.', 'Phân loại theo nhiều trục: quy mô, mục đích, khán giả, tần suất, bối cảnh, lĩnh vực.'], ['Scale labels: mega, hallmark, major, local.', 'Nhãn quy mô: mega, hallmark, major, local.'], ['Classification predicts permits, staff, insurance and budget.', 'Phân loại cho biết giấy phép, nhân sự, bảo hiểm và ngân sách.']],
    l: ['evm', 'fest', 'evp', 'oly'],
    p: [['Classify a university "Orientation Day" along three axes.', 'Phân loại "Ngày định hướng" của trường theo ba trục.', 'Local scale; purpose educate/welcome; audience invited (new students); also annual and indoor/campus.', 'Quy mô địa phương; mục đích giáo dục/chào đón; khán giả được mời (tân sinh viên); hằng năm, trong khuôn viên.'],
        ['What is a hallmark event?', 'Hallmark event là gì?', 'An event so tied to a place that it becomes part of its identity.', 'Sự kiện gắn chặt với một nơi đến mức thành bản sắc của nơi đó.']] }),

  D(P + '2-2', '2.2 Entertainment events: concerts, festivals and shows', '2.2 Sự kiện giải trí: hoà nhạc, lễ hội và chương trình',
    'Hoà nhạc, lưu diễn, lễ hội âm nhạc, chương trình truyền hình; các ví dụ Glastonbury, Tomorrowland.', {
    n: '2.2',
    g: [['Describe the formats of concerts, tours and festivals', 'Mô tả các định dạng hoà nhạc, lưu diễn và lễ hội'], ['Compare a single-artist concert with a multi-artist festival', 'So sánh buổi diễn một nghệ sĩ với lễ hội nhiều nghệ sĩ'], ['Use real festivals as cases', 'Dùng các lễ hội thật làm tình huống']],
    b: [`<p>Entertainment events sell an experience. The main formats differ in who the draw is and where the risk sits.</p>` + tbl(['Format', 'Draw', 'Key planning point'], [['Single-artist concert', 'One artist', 'Date, capacity, ticket demand for that artist'], ['Tour', 'One artist, many cities', 'Logistics, repeated set-up, local promoters'], ['Music festival', 'Line-up, atmosphere, location', 'Site, multiple stages, camping, long operation'], ['Live show / TV recording', 'Programme format', 'Broadcast needs, audience management'], ['Theatre and performing arts', 'Production and cast', 'Season schedule, rehearsal, small venues']]) + `
<h4>Concert versus festival</h4>
<p>A concert is simple to explain and market but depends on one name. A festival spreads the risk over a line-up, and sells food, accommodation and atmosphere as well, but it requires a whole temporary city: water, power, toilets, security, medical care, transport and waste.</p>
<h4>Cases</h4>
<ul><li><a href="` + W + `Glastonbury_Festival" target="_blank" rel="noopener">Glastonbury Festival</a> in England has run since 1970 and is a hallmark event of its region; read the official <a href="https://www.glastonburyfestivals.co.uk/" target="_blank" rel="noopener">site</a> to see how it presents the site, ticketing and its charitable partners.</li>
<li><a href="` + W + `Tomorrowland_(festival)" target="_blank" rel="noopener">Tomorrowland</a> in Boom, Belgium, started in 2005 and built a global brand around design and storytelling of its stages; the official <a href="https://www.tomorrowland.com/" target="_blank" rel="noopener">site</a> shows how the experience is sold as a whole world, not only a line-up.</li>
<li><a href="` + W + `Coachella_Valley_Music_and_Arts_Festival" target="_blank" rel="noopener">Coachella</a> in California is a model of a festival that also acts as a media and brand-activation stage.</li></ul>
<h4>What to learn from them</h4>
<p>Each festival has a clear identity (what makes it different), a controlled site, and a long relationship with its audience. Student organisers can copy the method, not the budget: define the identity first, then the line-up.</p>`,
`<p>Sự kiện giải trí bán một trải nghiệm. Các định dạng chính khác nhau ở chỗ sức hút là ai và rủi ro nằm ở đâu.</p>` + tbl(['Định dạng', 'Sức hút', 'Điểm lập kế hoạch then chốt'], [['Hoà nhạc một nghệ sĩ', 'Một nghệ sĩ', 'Ngày diễn, sức chứa, nhu cầu vé của nghệ sĩ đó'], ['Lưu diễn', 'Một nghệ sĩ, nhiều thành phố', 'Hậu cần, dựng lặp lại, promoter địa phương'], ['Lễ hội âm nhạc', 'Đội hình nghệ sĩ, không khí, địa điểm', 'Khu đất, nhiều sân khấu, cắm trại, vận hành dài'], ['Chương trình trực tiếp / ghi hình truyền hình', 'Format chương trình', 'Nhu cầu phát sóng, quản lý khán giả'], ['Sân khấu và biểu diễn nghệ thuật', 'Vở diễn và dàn diễn viên', 'Lịch mùa diễn, tập duyệt, địa điểm nhỏ']]) + `
<h4>Hoà nhạc so với lễ hội</h4>
<p>Một buổi hoà nhạc dễ giải thích và dễ quảng bá nhưng phụ thuộc một cái tên. Lễ hội dàn rủi ro trên cả đội hình nghệ sĩ và còn bán ăn uống, chỗ ở, không khí, nhưng đòi hỏi dựng cả một thành phố tạm: nước, điện, nhà vệ sinh, an ninh, y tế, giao thông và rác.</p>
<h4>Tình huống</h4>
<ul><li><a href="` + W + `Glastonbury_Festival" target="_blank" rel="noopener">Glastonbury Festival</a> ở Anh diễn ra từ năm 1970 và là hallmark event của vùng; đọc <a href="https://www.glastonburyfestivals.co.uk/" target="_blank" rel="noopener">trang chính thức</a> để xem cách họ giới thiệu khu đất, bán vé và các đối tác từ thiện.</li>
<li><a href="` + W + `Tomorrowland_(festival)" target="_blank" rel="noopener">Tomorrowland</a> tại Boom, Bỉ, khởi đầu năm 2005 và xây thương hiệu toàn cầu bằng thiết kế và câu chuyện của các sân khấu; <a href="https://www.tomorrowland.com/" target="_blank" rel="noopener">trang chính thức</a> cho thấy trải nghiệm được bán như cả một thế giới chứ không chỉ đội hình nghệ sĩ.</li>
<li><a href="` + W + `Coachella_Valley_Music_and_Arts_Festival" target="_blank" rel="noopener">Coachella</a> ở California là mẫu lễ hội đồng thời làm sân khấu truyền thông và kích hoạt thương hiệu.</li></ul>
<h4>Bài học rút ra</h4>
<p>Mỗi lễ hội có bản sắc rõ (điều làm nó khác biệt), khu đất được kiểm soát và mối quan hệ lâu dài với khán giả. Ban tổ chức sinh viên có thể học phương pháp chứ không phải ngân sách: xác định bản sắc trước, đội hình sau.</p>`],
    pit: ['Booking big names first and finding the concept afterwards. Without an identity the line-up becomes a price war.', 'Chốt tên tuổi lớn trước rồi mới tìm ý tưởng. Không có bản sắc, đội hình biến thành cuộc đua giá.'],
    s: [['Formats: single concert, tour, festival, live show, theatre.', 'Định dạng: hoà nhạc đơn, lưu diễn, lễ hội, chương trình trực tiếp, sân khấu.'], ['Festival = a temporary city; more income lines but more operations.', 'Lễ hội = thành phố tạm; nhiều nguồn thu hơn nhưng vận hành phức tạp hơn.'], ['Strong festivals have a clear identity and a controlled site.', 'Lễ hội mạnh có bản sắc rõ và khu đất được kiểm soát.']],
    l: ['conc', 'mfest', 'tour', 'glastosite'],
    p: [['Why does a festival need more operations than a concert?', 'Vì sao lễ hội cần vận hành nhiều hơn hoà nhạc?', 'It must provide a temporary city: water, power, toilets, security, medical, transport, waste.', 'Nó phải cung cấp một thành phố tạm: nước, điện, nhà vệ sinh, an ninh, y tế, giao thông, rác.'],
        ['Write a one-line identity for a student music festival.', 'Viết một dòng bản sắc cho lễ hội âm nhạc sinh viên.', 'Any clear differentiator, e.g. "student bands only, on campus, eco-friendly".', 'Mọi điểm khác biệt rõ, ví dụ "chỉ ban nhạc sinh viên, trong trường, thân thiện môi trường".']] }),

  D(P + '2-3', '2.3 Business, sport and community events', '2.3 Sự kiện doanh nghiệp, thể thao và cộng đồng',
    'MICE, hội chợ, hội nghị, sự kiện thể thao, sự kiện cộng đồng và hybrid.', {
    n: '2.3',
    g: [['Explain each letter of MICE', 'Giải thích từng chữ trong MICE'], ['Describe how sport and community events differ', 'Mô tả sự khác nhau của sự kiện thể thao và cộng đồng'], ['Understand hybrid and online formats', 'Hiểu các hình thức hybrid và trực tuyến']],
    b: [`<h4>MICE</h4>` + tbl(['Letter', 'Meaning', 'Goal'], [['M', 'Meetings', 'Decisions, training, internal alignment'], ['I', 'Incentives', 'Reward staff or partners with a trip or experience'], ['C', 'Conferences and conventions', 'Share knowledge, network; <a href="' + W + 'Conference" target="_blank" rel="noopener">conference</a>'], ['E', 'Exhibitions and trade shows', 'Show products to buyers; <a href="' + W + 'Trade_show" target="_blank" rel="noopener">trade show</a>']]) + `
<p>Business events earn money through registration fees, exhibitor stands and sponsorship, and they boost the hotel and restaurant trade in the host city. Industry bodies include <a href="https://www.iccaworld.org/" target="_blank" rel="noopener">ICCA</a> (association congresses) and <a href="https://www.ufi.org/" target="_blank" rel="noopener">UFI</a> (exhibitions). Vietnam hosts trade fairs on tourism, food, construction and electronics in venues known as <a href="` + W + `Convention_center" target="_blank" rel="noopener">convention centres</a>.</p>
<h4>Sport events</h4>
<p>A match has a fixed rule set and a fixed schedule, with broadcasters, officials and teams as extra stakeholders. Revenue relies on broadcast rights, sponsorship and tickets. The 31st SEA Games in Hanoi, delayed to May 2022, show how health conditions can move a fixed-date event.</p>
<h4>Community and cultural events</h4>
<p>Parades, Tết markets, school festivals and charity runs have social goals first. Money is tight, volunteers are many, and goodwill from residents is essential.</p>
<h4>Online and hybrid</h4>
<p>A <a href="` + W + `Hybrid_event" target="_blank" rel="noopener">hybrid event</a> mixes people on site and people online. It widens the audience but adds a second production: cameras, platform, moderation and a separate experience design. Treat the online audience as a real audience, not a spectator behind glass.</p>`,
`<h4>MICE</h4>` + tbl(['Chữ', 'Nghĩa', 'Mục tiêu'], [['M', 'Meetings (họp)', 'Ra quyết định, đào tạo, thống nhất nội bộ'], ['I', 'Incentives (khen thưởng)', 'Thưởng nhân viên hay đối tác bằng chuyến đi hay trải nghiệm'], ['C', 'Conferences và conventions (hội nghị)', 'Chia sẻ kiến thức, kết nối; <a href="' + W + 'Conference" target="_blank" rel="noopener">conference</a>'], ['E', 'Exhibitions và trade shows (triển lãm)', 'Giới thiệu sản phẩm đến người mua; <a href="' + W + 'Trade_show" target="_blank" rel="noopener">trade show</a>']]) + `
<p>Sự kiện doanh nghiệp kiếm tiền từ phí đăng ký, gian hàng triển lãm và tài trợ, đồng thời thúc đẩy khách sạn, nhà hàng thành phố chủ nhà. Các tổ chức ngành có <a href="https://www.iccaworld.org/" target="_blank" rel="noopener">ICCA</a> (đại hội của các hiệp hội) và <a href="https://www.ufi.org/" target="_blank" rel="noopener">UFI</a> (triển lãm). Việt Nam tổ chức hội chợ du lịch, thực phẩm, xây dựng, điện tử tại các <a href="` + W + `Convention_center" target="_blank" rel="noopener">trung tâm hội nghị – triển lãm</a>.</p>
<h4>Sự kiện thể thao</h4>
<p>Một trận đấu có luật cố định và lịch cố định, thêm các bên liên quan là đơn vị phát sóng, trọng tài, đội thi đấu. Nguồn thu dựa vào bản quyền phát sóng, tài trợ và vé. SEA Games 31 tại Hà Nội, hoãn đến tháng 5/2022, cho thấy điều kiện y tế có thể dời một sự kiện có ngày cố định.</p>
<h4>Sự kiện cộng đồng và văn hoá</h4>
<p>Diễu hành, chợ Tết, hội chợ trường và chạy từ thiện đặt mục tiêu xã hội lên trước. Tiền eo hẹp, tình nguyện viên đông, và thiện cảm của cư dân là thiết yếu.</p>
<h4>Trực tuyến và hybrid</h4>
<p><a href="` + W + `Hybrid_event" target="_blank" rel="noopener">Sự kiện hybrid</a> trộn người tại chỗ và người trực tuyến. Nó mở rộng khán giả nhưng thêm một đợt sản xuất thứ hai: máy quay, nền tảng, điều phối và thiết kế trải nghiệm riêng. Hãy coi khán giả trực tuyến là khán giả thật, không phải người đứng sau tấm kính.</p>`],
    pit: ['Treating the online audience as an afterthought. A weak stream damages the whole event\'s image.', 'Coi khán giả trực tuyến là phần phụ. Luồng phát yếu làm hỏng hình ảnh cả sự kiện.'],
    s: [['MICE = meetings, incentives, conferences, exhibitions.', 'MICE = họp, khen thưởng, hội nghị, triển lãm.'], ['Sport: fixed rules, fixed dates, broadcasters; community: social goals, volunteers.', 'Thể thao: luật và lịch cố định, đơn vị phát sóng; cộng đồng: mục tiêu xã hội, tình nguyện viên.'], ['Hybrid needs a second production for the online audience.', 'Hybrid cần đợt sản xuất thứ hai cho khán giả trực tuyến.']],
    l: ['btour', 'show', 'confe', 'hybrid', 'virt'],
    p: [['What is the main difference between a conference and a trade show?', 'Khác biệt chính giữa hội nghị và triển lãm thương mại?', 'A conference shares knowledge; a trade show lets exhibitors show products to buyers.', 'Hội nghị chia sẻ kiến thức; triển lãm để nhà trưng bày giới thiệu sản phẩm đến người mua.'],
        ['Why is an incentive trip a MICE event?', 'Vì sao chuyến khen thưởng thuộc MICE?', 'It is a planned business event whose goal is to reward and motivate staff or partners.', 'Đó là sự kiện kinh doanh có kế hoạch nhằm thưởng và khích lệ nhân viên hoặc đối tác.']] }),

  Q(P + 'quiz-2', 'Chapter 2 quiz — Event types', 'Quiz Chương 2 — Loại hình sự kiện', [
    ['A hallmark event is…|||Hallmark event là…', ['So tied to a place that it becomes part of its identity|||Gắn chặt với một nơi đến mức thành bản sắc của nơi đó', 'Always free|||Luôn miễn phí', 'Always indoors|||Luôn trong nhà', 'Always online|||Luôn trực tuyến'], 0, 'Think of a festival people link with a city.|||Hãy nghĩ đến lễ hội mà người ta gắn với một thành phố.'],
    ['In MICE, the letter I stands for…|||Trong MICE, chữ I là…', ['Incentives|||Khen thưởng (incentives)', 'Insurance|||Bảo hiểm', 'Internet|||Internet', 'Invoices|||Hoá đơn'], 0, 'Incentive events reward staff or partners.|||Sự kiện khen thưởng thưởng cho nhân viên hoặc đối tác.'],
    ['Which classification axis answers "one-off or annual"?|||Trục phân loại nào trả lời "một lần hay hằng năm"?', ['Frequency|||Tần suất', 'Sector|||Lĩnh vực', 'Setting|||Bối cảnh', 'Colour|||Màu sắc'], 0, 'Frequency separates one-off, annual and touring.|||Tần suất phân biệt một lần, hằng năm và lưu diễn.'],
    ['A music festival is usually more complex than a single concert because…|||Lễ hội âm nhạc thường phức tạp hơn một buổi hoà nhạc vì…', ['It must provide a temporary city of services|||Phải cung cấp một thành phố tạm với nhiều dịch vụ', 'It has no audience|||Không có khán giả', 'It needs no permits|||Không cần giấy phép', 'It is always short|||Luôn ngắn'], 0, 'Water, power, toilets, security, medical and waste all scale up.|||Nước, điện, nhà vệ sinh, an ninh, y tế và rác đều tăng quy mô.'],
    ['A trade show mainly serves…|||Triển lãm thương mại chủ yếu phục vụ…', ['Exhibitors showing products to buyers|||Nhà trưng bày giới thiệu sản phẩm đến người mua', 'Private weddings|||Đám cưới riêng', 'School exams|||Kỳ thi trường', 'Home cooking|||Nấu ăn tại nhà'], 0, 'Exhibitions bring sellers and buyers together.|||Triển lãm đưa người bán và người mua lại với nhau.'],
    ['Community events usually have…|||Sự kiện cộng đồng thường có…', ['Social goals, tight money and many volunteers|||Mục tiêu xã hội, tiền eo hẹp và nhiều tình nguyện viên', 'No stakeholders|||Không có bên liên quan', 'Unlimited budget|||Ngân sách không giới hạn', 'Only paid staff|||Chỉ nhân viên có lương'], 0, 'Goodwill of residents is essential.|||Thiện cảm của cư dân là thiết yếu.'],
    ['A hybrid event combines…|||Sự kiện hybrid kết hợp…', ['On-site and online participants|||Người tham dự tại chỗ và trực tuyến', 'Two unrelated companies|||Hai công ty không liên quan', 'Two budgets|||Hai ngân sách', 'Two weather forecasts|||Hai dự báo thời tiết'], 0, 'It requires a second production for the online audience.|||Nó cần đợt sản xuất thứ hai cho khán giả trực tuyến.'],
    ['Why classify an event before planning?|||Vì sao phân loại sự kiện trước khi lập kế hoạch?', ['It predicts permits, staff, insurance and budget|||Nó cho biết giấy phép, nhân sự, bảo hiểm và ngân sách', 'It makes tickets cheaper|||Làm vé rẻ hơn', 'It removes risk|||Loại bỏ rủi ro', 'It replaces a contract|||Thay thế hợp đồng'], 0, 'The type sets the size of the plan.|||Loại hình định cỡ kế hoạch.']
  ]),
]));
// ===== Chương 3 =====
secs.push(SEC('Chapter 3 — Roles and stakeholders', 'Chương 3 — Vai trò và bên liên quan',
  'Các bên liên quan của sự kiện, đội tổ chức và vai trò công việc, hợp đồng và nhà cung cấp cơ bản.', [
  D(P + '3-1', '3.1 Stakeholders of an event', '3.1 Các bên liên quan của sự kiện',
    'Nhận diện bên liên quan, phân tích quyền lực – quan tâm, quản lý kỳ vọng.', {
    n: '3.1',
    g: [['Identify internal and external stakeholders', 'Nhận diện bên liên quan bên trong và bên ngoài'], ['Place stakeholders on a power–interest grid', 'Xếp các bên lên lưới quyền lực – mức quan tâm'], ['Plan how to communicate with each group', 'Lập cách giao tiếp với từng nhóm']],
    b: [`<p>A <a href="` + W + `Stakeholder_(corporate)" target="_blank" rel="noopener">stakeholder</a> is any person or group that affects the event or is affected by it. Missing one is a classic way for events to fail: a neighbour who files a noise complaint can matter as much as a headline sponsor.</p>` + tbl(['Group', 'Examples', 'What they want'], [['Owner / client', 'Company, school, host city, promoter', 'Objectives met, budget respected'], ['Participants', 'Audience, delegates, exhibitors', 'Good value, safety, a memorable experience'], ['Performers and speakers', 'Artists, MCs, athletes, keynote speakers', 'Fair pay, working conditions, respect for the rider'], ['Sponsors and partners', 'Brands, media partners', 'Exposure, access to audience, measurable return'], ['Venue and suppliers', 'Stadium, sound, catering', 'Clear brief, on-time payment'], ['Authorities', 'Police, fire, health, local government', 'Compliance and public safety'], ['Community', 'Neighbours, local business', 'Low disruption, benefits'], ['Media', 'Press, creators', 'Access and a story']]) + `
<h4>Power–interest grid</h4>
<p>Place each stakeholder by how much <em>power</em> they have over the event and how much <em>interest</em> they have in it. This is the core of <a href="` + W + `Stakeholder_analysis" target="_blank" rel="noopener">stakeholder analysis</a>.</p>` + tbl(['', 'Low interest', 'High interest'], [['High power', 'Keep satisfied (e.g. fire department)', 'Manage closely (e.g. title sponsor, owner)'], ['Low power', 'Monitor (e.g. general public)', 'Keep informed (e.g. fans, volunteers)']]) + `
<p>Example: for a student concert the head of student affairs is high power, high interest (manage closely); the building security office is high power, lower interest (keep satisfied by sending the plan early); fans are lower power but high interest (keep informed through social media).</p>
<p>Note that expectations can conflict: a sponsor wants a prominent logo on stage while the artist wants a clean backdrop. The organiser balances them in contracts and a clear brief.</p>`,
`<p><a href="` + W + `Stakeholder_(corporate)" target="_blank" rel="noopener">Bên liên quan</a> là người hay nhóm tác động đến sự kiện hoặc chịu tác động của nó. Bỏ sót một bên là cách thất bại kinh điển: người hàng xóm khiếu nại tiếng ồn có thể quan trọng không kém nhà tài trợ chính.</p>` + tbl(['Nhóm', 'Ví dụ', 'Họ muốn gì'], [['Chủ sở hữu / khách hàng', 'Công ty, trường, thành phố, promoter', 'Đạt mục tiêu, giữ ngân sách'], ['Người tham dự', 'Khán giả, đại biểu, nhà trưng bày', 'Giá trị tốt, an toàn, trải nghiệm đáng nhớ'], ['Nghệ sĩ và diễn giả', 'Ca sĩ, MC, vận động viên, diễn giả chính', 'Thù lao công bằng, điều kiện làm việc, tôn trọng rider'], ['Nhà tài trợ và đối tác', 'Thương hiệu, đối tác truyền thông', 'Hiện diện, tiếp cận khán giả, lợi ích đo được'], ['Địa điểm và nhà cung cấp', 'Sân vận động, âm thanh, ăn uống', 'Brief rõ, thanh toán đúng hạn'], ['Cơ quan chức năng', 'Công an, phòng cháy, y tế, chính quyền địa phương', 'Tuân thủ và an toàn công cộng'], ['Cộng đồng', 'Hàng xóm, doanh nghiệp địa phương', 'Ít gây phiền, có lợi ích'], ['Truyền thông', 'Báo chí, nhà sáng tạo nội dung', 'Quyền tiếp cận và một câu chuyện']]) + `
<h4>Lưới quyền lực – mức quan tâm</h4>
<p>Xếp từng bên theo mức <em>quyền lực</em> với sự kiện và mức <em>quan tâm</em> đến nó. Đây là lõi của <a href="` + W + `Stakeholder_analysis" target="_blank" rel="noopener">phân tích bên liên quan</a>.</p>` + tbl(['', 'Quan tâm thấp', 'Quan tâm cao'], [['Quyền lực cao', 'Giữ hài lòng (vd phòng cháy)', 'Quản lý sát (vd nhà tài trợ chính, chủ sở hữu)'], ['Quyền lực thấp', 'Theo dõi (vd công chúng chung)', 'Thông tin đầy đủ (vd fan, tình nguyện viên)']]) + `
<p>Ví dụ: với đêm nhạc sinh viên, trưởng phòng công tác sinh viên có quyền lực cao, quan tâm cao (quản lý sát); phòng bảo vệ toà nhà quyền lực cao, quan tâm thấp hơn (giữ hài lòng bằng cách gửi kế hoạch sớm); fan quyền lực thấp hơn nhưng quan tâm cao (thông tin qua mạng xã hội).</p>
<p>Lưu ý kỳ vọng có thể xung đột: nhà tài trợ muốn logo lớn trên sân khấu còn nghệ sĩ muốn phông sạch. Ban tổ chức cân bằng bằng hợp đồng và một bản brief rõ.</p>`],
    pit: ['Listing only the people who pay. Authorities and neighbours can stop the event.', 'Chỉ liệt kê những người trả tiền. Cơ quan chức năng và hàng xóm có thể làm sự kiện dừng lại.'],
    s: [['A stakeholder affects or is affected by the event.', 'Bên liên quan là người tác động hoặc chịu tác động của sự kiện.'], ['Use the power–interest grid to choose how to communicate.', 'Dùng lưới quyền lực – quan tâm để chọn cách giao tiếp.'], ['Expectations conflict; settle them in the brief and contracts.', 'Kỳ vọng có thể xung đột; giải quyết trong brief và hợp đồng.']],
    l: ['stake', 'stakean', 'evm', 'sust'],
    p: [['Name two stakeholders people often forget in outdoor events.', 'Kể hai bên liên quan hay bị quên ở sự kiện ngoài trời.', 'Neighbours/local residents and the authorities (police, fire, health).', 'Hàng xóm/cư dân địa phương và cơ quan chức năng (công an, phòng cháy, y tế).'],
        ['Where on the grid is a title sponsor?', 'Nhà tài trợ chính nằm ở đâu trên lưới?', 'High power, high interest: manage closely.', 'Quyền lực cao, quan tâm cao: quản lý sát.']] }),

  D(P + '3-2', '3.2 The organising team and job roles', '3.2 Đội tổ chức và các vai trò công việc',
    'Các vị trí chính trong đội sự kiện, cấu trúc đội theo dự án và tình nguyện viên.', {
    n: '3.2',
    g: [['Describe the main roles in an event team', 'Mô tả các vai trò chính của đội sự kiện'], ['Draw a simple team structure for a student event', 'Vẽ cơ cấu đội đơn giản cho sự kiện sinh viên'], ['Plan the use of volunteers', 'Lập kế hoạch dùng tình nguyện viên']],
    b: [`<p>Events are projects: a team forms, works hard for months, and disbands. Titles vary between companies, but the functions are similar.</p>` + tbl(['Function', 'Typical title', 'Main responsibility'], [['Overall lead', 'Event director / manager', 'Objectives, budget, final decisions'], ['Creative', 'Creative director / producer', 'Concept, programme, look and feel'], ['Production', 'Production manager', 'Stage, sound, light, set-up and strike'], ['On the show', 'Stage manager', 'Calls cues during the show; see <a href="' + W + 'Stage_management" target="_blank" rel="noopener">stage management</a>'], ['Logistics', 'Operations manager', 'Transport, accreditation, supplies, site flow'], ['Marketing and sales', 'Marketing / ticketing manager', 'Audience, ticket sales, sponsors'], ['Finance and legal', 'Finance officer', 'Budget tracking, payments, contracts'], ['Safety', 'Safety / security lead', 'Risk plan, crowd and medical'], ['People', 'Volunteer coordinator', 'Recruit, brief and care for volunteers']]) + `
<h4>Structure</h4>
<p>Small events use a flat team; larger ones use departments with a lead each and a weekly meeting. Keep one decision-maker per area. A simple method is a <a href="` + W + `Work_breakdown_structure" target="_blank" rel="noopener">work breakdown structure</a>: split the event into areas, then tasks, then owners.</p>
<h4>Volunteers</h4>
<p>Volunteers are the backbone of community events and festivals. Good practice: a written role, a briefing, a named supervisor, breaks and food, and recognition at the end. They are not free labour for safety-critical roles; those need trained staff.</p>
<h4>Worked example: Music Night, 800 guests</h4>
<ol><li>Lead: 1 student chair plus 1 staff adviser.</li>
<li>Departments: programme (3), production (4), marketing and ticketing (4), sponsors (3), logistics and safety (5), volunteers (12 on the night).</li>
<li>Weekly 30-minute meeting; one shared task board; every task has one owner and one date.</li></ol>
<p>Numbers here are an illustration, not a standard.</p>`,
`<p>Sự kiện là một dự án: đội hình thành, làm việc căng thẳng nhiều tháng rồi giải tán. Chức danh khác nhau giữa các công ty, nhưng chức năng thì tương tự.</p>` + tbl(['Chức năng', 'Chức danh thường gặp', 'Trách nhiệm chính'], [['Dẫn dắt chung', 'Giám đốc / quản lý sự kiện', 'Mục tiêu, ngân sách, quyết định cuối'], ['Sáng tạo', 'Giám đốc sáng tạo / producer', 'Ý tưởng, chương trình, diện mạo'], ['Sản xuất', 'Quản lý sản xuất', 'Sân khấu, âm thanh, ánh sáng, dựng và tháo'], ['Trên sân khấu', 'Stage manager', 'Gọi cue trong chương trình; xem <a href="' + W + 'Stage_management" target="_blank" rel="noopener">quản lý sân khấu</a>'], ['Hậu cần', 'Quản lý vận hành', 'Vận chuyển, thẻ ra vào, vật tư, luồng di chuyển'], ['Marketing và bán hàng', 'Quản lý marketing / bán vé', 'Khán giả, bán vé, nhà tài trợ'], ['Tài chính và pháp lý', 'Kế toán sự kiện', 'Theo dõi ngân sách, thanh toán, hợp đồng'], ['An toàn', 'Phụ trách an toàn / an ninh', 'Kế hoạch rủi ro, đám đông và y tế'], ['Con người', 'Điều phối tình nguyện viên', 'Tuyển, tập huấn và chăm sóc tình nguyện viên']]) + `
<h4>Cơ cấu</h4>
<p>Sự kiện nhỏ dùng đội phẳng; sự kiện lớn dùng các ban, mỗi ban một trưởng và họp tuần. Mỗi mảng chỉ có một người quyết định. Một phương pháp đơn giản là <a href="` + W + `Work_breakdown_structure" target="_blank" rel="noopener">cấu trúc phân rã công việc (WBS)</a>: chia sự kiện thành mảng, rồi việc, rồi người phụ trách.</p>
<h4>Tình nguyện viên</h4>
<p>Tình nguyện viên là xương sống của sự kiện cộng đồng và lễ hội. Thực hành tốt: vai trò bằng văn bản, buổi tập huấn, người giám sát có tên, nghỉ giải lao và ăn uống, ghi nhận cuối chương trình. Họ không phải lao động miễn phí cho các vị trí liên quan an toàn; những vị trí đó cần nhân sự được đào tạo.</p>
<h4>Ví dụ giải từng bước: Đêm nhạc 800 khách</h4>
<ol><li>Trưởng ban: 1 sinh viên làm chủ nhiệm cùng 1 cán bộ cố vấn.</li>
<li>Các ban: chương trình (3), sản xuất (4), marketing và bán vé (4), tài trợ (3), hậu cần và an toàn (5), tình nguyện viên (12 người trong đêm).</li>
<li>Họp 30 phút mỗi tuần; một bảng công việc dùng chung; mỗi việc có một người phụ trách và một hạn.</li></ol>
<p>Các con số ở đây chỉ để minh hoạ, không phải chuẩn.</p>`],
    pit: ['Everyone responsible for everything. A task with two owners has none.', 'Ai cũng chịu trách nhiệm mọi thứ. Một việc có hai người phụ trách thì không có ai.'],
    s: [['Roles: lead, creative, production, stage manager, logistics, marketing, finance, safety, volunteers.', 'Vai trò: trưởng ban, sáng tạo, sản xuất, stage manager, hậu cần, marketing, tài chính, an toàn, tình nguyện viên.'], ['Use a WBS: areas, tasks, owners.', 'Dùng WBS: mảng, việc, người phụ trách.'], ['Volunteers need a role, briefing and care.', 'Tình nguyện viên cần vai trò, tập huấn và sự chăm sóc.']],
    l: ['stagem', 'wbs', 'pm', 'evp'],
    p: [['Who calls the cues during a live show?', 'Ai gọi cue trong chương trình trực tiếp?', 'The stage manager.', 'Stage manager.'],
        ['Why should every task have exactly one owner?', 'Vì sao mỗi việc nên có đúng một người phụ trách?', 'Shared ownership leaves gaps and delays; one owner is accountable.', 'Chia sẻ trách nhiệm tạo khoảng trống và chậm trễ; một người chịu trách nhiệm rõ ràng.']] }),

  D(P + '3-3', '3.3 Contracts, suppliers and agencies (basics)', '3.3 Hợp đồng, nhà cung cấp và agency (cơ bản)',
    'Các loại hợp đồng, brief và RFP, thuê agency hay tự làm, bản quyền âm nhạc ở mức nhập môn.', {
    n: '3.3',
    g: [['List the contracts an event usually needs', 'Liệt kê các hợp đồng một sự kiện thường cần'], ['Write a clear brief and understand an RFP', 'Viết brief rõ và hiểu RFP'], ['Know why music and image rights need permission', 'Biết vì sao nhạc và hình ảnh cần xin phép']],
    b: [`<p>Most event problems begin as vague promises. A written <a href="` + W + `Contract" target="_blank" rel="noopener">contract</a> turns expectations into duties. This lesson is an introduction, not legal advice: for real events ask a qualified lawyer and check current Vietnamese rules.</p>
<h4>Common agreements</h4>` + tbl(['Agreement', 'Key points to write down'], [['Artist or speaker', 'Date, time, fee, payment dates, technical needs (rider), cancellation'], ['Venue hire', 'Dates incl. set-up and take-down, capacity, rules, deposit, insurance'], ['Supplier (sound, light, catering)', 'Scope, quantities, times, price, penalties, who is on site'], ['Sponsorship', 'Benefits, fee or in-kind value, exclusivity, logo use'], ['Volunteer', 'Role, hours, safety rules, expenses'], ['Ticketing platform', 'Fees, payout time, refund and data rules']]) + `
<h4>Brief and RFP</h4>
<p>A <em>brief</em> says what you want: objective, audience, date, budget range, deliverables. A <a href="` + W + `Request_for_proposal" target="_blank" rel="noopener">request for proposal</a> (RFP) asks suppliers or agencies to offer a solution against that brief. Compare at least three offers on the same table: scope, price, references, timeline, risk.</p>
<h4>Agency or in-house?</h4>
<p>An agency brings experience and a network, at a fee; an in-house team knows the brand and costs less per hour but may lack capacity. Student organisers often combine: a team for concept and a hired supplier for sound and light.</p>
<h4>Music and image rights</h4>
<p>Playing or performing music in public is a use of <a href="` + W + `Copyright" target="_blank" rel="noopener">copyright</a> work and usually needs a licence, often through a <a href="` + W + `Performance_rights_organisation" target="_blank" rel="noopener">performance rights organisation</a>. The same applies to photographing and filming the audience: tell guests, and obtain consent where required. See <a href="https://www.wipo.int/copyright/en/" target="_blank" rel="noopener">WIPO on copyright</a> for the global principles.</p>
<h4>Insurance</h4>
<p>Public liability <a href="` + W + `Insurance" target="_blank" rel="noopener">insurance</a> protects against claims from injury or damage; many venues demand proof before they hire.</p>`,
`<p>Đa số rắc rối của sự kiện bắt đầu từ những lời hứa mơ hồ. Một <a href="` + W + `Contract" target="_blank" rel="noopener">hợp đồng</a> bằng văn bản biến kỳ vọng thành nghĩa vụ. Bài này chỉ là nhập môn, không phải tư vấn pháp lý: với sự kiện thật hãy hỏi luật sư và kiểm quy định hiện hành của Việt Nam.</p>
<h4>Các thoả thuận thường gặp</h4>` + tbl(['Thoả thuận', 'Điều khoản cần ghi'], [['Nghệ sĩ hoặc diễn giả', 'Ngày giờ, thù lao, mốc thanh toán, yêu cầu kỹ thuật (rider), điều kiện huỷ'], ['Thuê địa điểm', 'Ngày gồm dựng và tháo, sức chứa, nội quy, tiền cọc, bảo hiểm'], ['Nhà cung cấp (âm thanh, ánh sáng, ăn uống)', 'Phạm vi, số lượng, thời gian, giá, phạt, ai có mặt tại chỗ'], ['Tài trợ', 'Quyền lợi, tiền hay hiện vật, độc quyền, cách dùng logo'], ['Tình nguyện viên', 'Vai trò, giờ làm, quy tắc an toàn, chi phí hỗ trợ'], ['Nền tảng bán vé', 'Phí, thời gian chuyển tiền, hoàn vé, dữ liệu']]) + `
<h4>Brief và RFP</h4>
<p><em>Brief</em> nói bạn muốn gì: mục tiêu, khán giả, ngày, khung ngân sách, sản phẩm bàn giao. <a href="` + W + `Request_for_proposal" target="_blank" rel="noopener">Yêu cầu đề xuất</a> (RFP) mời nhà cung cấp hoặc agency đưa giải pháp theo brief đó. So ít nhất ba đề xuất trên cùng một bảng: phạm vi, giá, tham chiếu, tiến độ, rủi ro.</p>
<h4>Thuê agency hay tự làm?</h4>
<p>Agency mang kinh nghiệm và mạng lưới, đổi lại là phí; đội nội bộ hiểu thương hiệu và rẻ hơn theo giờ nhưng có thể thiếu nhân lực. Ban tổ chức sinh viên thường kết hợp: đội lo ý tưởng, thuê nhà cung cấp lo âm thanh ánh sáng.</p>
<h4>Quyền âm nhạc và hình ảnh</h4>
<p>Phát hoặc biểu diễn nhạc nơi công cộng là sử dụng tác phẩm có <a href="` + W + `Copyright" target="_blank" rel="noopener">bản quyền</a> và thường cần giấy phép, hay qua một <a href="` + W + `Performance_rights_organisation" target="_blank" rel="noopener">tổ chức quản lý quyền biểu diễn</a>. Tương tự với việc chụp, quay khán giả: thông báo cho khách và xin đồng ý khi cần. Xem <a href="https://www.wipo.int/copyright/en/" target="_blank" rel="noopener">WIPO về bản quyền</a> cho các nguyên tắc chung.</p>
<h4>Bảo hiểm</h4>
<p><a href="` + W + `Insurance" target="_blank" rel="noopener">Bảo hiểm</a> trách nhiệm công cộng bảo vệ trước khiếu nại do thương tích hay hư hại; nhiều địa điểm đòi bằng chứng trước khi cho thuê.</p>`],
    pit: ['Agreeing by chat message only. Chats vanish and disputes follow; sign a contract with dates and amounts.', 'Chỉ thoả thuận bằng tin nhắn. Tin nhắn mất đi và tranh chấp xảy ra; hãy ký hợp đồng có ngày và số tiền.'],
    s: [['Write contracts for artists, venue, suppliers, sponsors, volunteers and ticketing.', 'Lập hợp đồng cho nghệ sĩ, địa điểm, nhà cung cấp, tài trợ, tình nguyện viên và bán vé.'], ['A brief states needs; an RFP asks suppliers to propose against it.', 'Brief nêu nhu cầu; RFP mời nhà cung cấp đề xuất theo đó.'], ['Public music and filming usually need licences or consent.', 'Phát nhạc công cộng và quay phim thường cần giấy phép hay sự đồng ý.']],
    l: ['contr', 'rfp', 'copy', 'pro', 'wipoc'],
    p: [['What three things should a venue hire contract state?', 'Hợp đồng thuê địa điểm nên nêu ba điều gì?', 'Dates including set-up/take-down, capacity and rules, deposit/insurance (any three reasonable ones).', 'Ngày gồm dựng/tháo, sức chứa và nội quy, tiền cọc/bảo hiểm (ba ý hợp lý bất kỳ).'],
        ['Why compare at least three proposals?', 'Vì sao so ít nhất ba đề xuất?', 'To see the market range in price and scope and avoid hidden gaps.', 'Để thấy mặt bằng giá và phạm vi, tránh khoảng trống ẩn.']] }),

  Q(P + 'quiz-3', 'Chapter 3 quiz — Roles and stakeholders', 'Quiz Chương 3 — Vai trò và bên liên quan', [
    ['A stakeholder is…|||Bên liên quan là…', ['Anyone who affects or is affected by the event|||Bất kỳ ai tác động hoặc chịu tác động của sự kiện', 'Only the sponsor|||Chỉ nhà tài trợ', 'Only the audience|||Chỉ khán giả', 'Only the artist|||Chỉ nghệ sĩ'], 0, 'Include authorities and neighbours too.|||Kể cả cơ quan chức năng và hàng xóm.'],
    ['High power and high interest means…|||Quyền lực cao, quan tâm cao nghĩa là…', ['Manage closely|||Quản lý sát', 'Ignore|||Bỏ qua', 'Monitor only|||Chỉ theo dõi', 'Remove|||Loại bỏ'], 0, 'Think of a title sponsor.|||Hãy nghĩ tới nhà tài trợ chính.'],
    ['The stage manager…|||Stage manager…', ['Calls cues during the show|||Gọi cue trong chương trình', 'Sells tickets|||Bán vé', 'Writes the budget|||Lập ngân sách', 'Designs the poster|||Thiết kế poster'], 0, 'They run the show from the cue sheet.|||Họ điều khiển chương trình theo bảng cue.'],
    ['A work breakdown structure splits an event into…|||WBS chia sự kiện thành…', ['Areas, tasks and owners|||Mảng, việc và người phụ trách', 'Colours|||Màu sắc', 'Songs|||Bài hát', 'Seats|||Ghế'], 0, 'It makes responsibilities visible.|||Nó làm trách nhiệm hiển thị rõ.'],
    ['Why not rely only on volunteers for safety-critical roles?|||Vì sao không chỉ dựa vào tình nguyện viên cho vị trí liên quan an toàn?', ['They need trained, accountable staff|||Cần nhân sự được đào tạo và chịu trách nhiệm', 'Volunteers are illegal|||Tình nguyện viên là bất hợp pháp', 'They cost too much|||Họ quá đắt', 'They dislike events|||Họ không thích sự kiện'], 0, 'Safety roles require training.|||Vị trí an toàn đòi hỏi đào tạo.'],
    ['An RFP is…|||RFP là…', ['A request asking suppliers to propose a solution|||Yêu cầu mời nhà cung cấp đề xuất giải pháp', 'A ticket type|||Một loại vé', 'A music genre|||Một thể loại nhạc', 'A fire drill|||Một buổi diễn tập cháy'], 0, 'Compare proposals against the brief.|||So các đề xuất với brief.'],
    ['Public performance of music usually needs…|||Biểu diễn nhạc công cộng thường cần…', ['A licence|||Giấy phép', 'Nothing|||Không cần gì', 'A second stage|||Sân khấu thứ hai', 'A bigger budget only|||Chỉ cần ngân sách lớn hơn'], 0, 'Music is copyright work.|||Âm nhạc là tác phẩm có bản quyền.'],
    ['A rider lists…|||Rider liệt kê…', ['An artist\'s technical and hospitality needs|||Nhu cầu kỹ thuật và tiếp đón của nghệ sĩ', 'Ticket prices|||Giá vé', 'Fire exits|||Lối thoát hiểm', 'Sponsor logos|||Logo nhà tài trợ'], 0, 'It is attached to the artist contract.|||Nó đi kèm hợp đồng nghệ sĩ.']
  ]),
]));
// ===== Chương 4 =====
secs.push(SEC('Chapter 4 — The planning process', 'Chương 4 — Quy trình lập kế hoạch',
  'Ý tưởng và mục tiêu SMART, tiến độ và đường găng, địa điểm, giấy phép và nhà cung cấp.', [
  D(P + '4-1', '4.1 Concept, objectives and feasibility', '4.1 Ý tưởng, mục tiêu và tính khả thi',
    'Từ ý tưởng đến mục tiêu SMART, 5W, SWOT và quyết định đi/không đi.', {
    n: '4.1',
    g: [['Turn an idea into a concept statement', 'Biến ý tưởng thành tuyên bố ý tưởng'], ['Write SMART objectives', 'Viết mục tiêu SMART'], ['Run a quick feasibility check before committing', 'Làm kiểm tra khả thi nhanh trước khi cam kết']],
    b: [`<p>Every event lifecycle starts with <em>initiation</em>: why does this event exist? A good concept answers the 5 W's: <strong>Why</strong> (purpose), <strong>Who</strong> (audience and organisers), <strong>When</strong>, <strong>Where</strong>, <strong>What</strong> (programme). Textbooks on event planning (see <a href="` + W + `Event_planning" target="_blank" rel="noopener">event planning</a>) add a sixth question: <strong>How</strong> will we pay for it and run it?</p>
<h4>Objectives: SMART</h4>
<p>Objectives must be <strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>chievable, <strong>R</strong>elevant and <strong>T</strong>ime-bound.</p>` + tbl(['Weak objective', 'SMART version'], [['Have a great music night', 'Sell 600 tickets and reach an average satisfaction of 4 out of 5 in the survey after the show on 20 November'], ['Get sponsors', 'Sign three sponsors covering at least 40% of the budget by 30 September'], ['Promote on social media', 'Reach 10,000 unique viewers of the teaser video before ticket launch']]) + `
<p>These are illustrative targets for a student event, not benchmarks.</p>
<h4>Feasibility</h4>
<p>Before you commit, test the idea with a short <a href="` + W + `SWOT_analysis" target="_blank" rel="noopener">SWOT</a> and four questions: Is there demand? Can we get a suitable venue on the date? Can we fund it? Do we have people and permission? A "no" is a cheap result at this stage; the same "no" found three weeks before the date is very expensive.</p>
<h4>Go / no-go decision</h4>
<p>Write one page: concept, objectives, audience, date, venue shortlist, budget range, main risks. The sponsor, school or client signs it off. This page becomes the reference when scope tries to grow.</p>`,
`<p>Vòng đời mỗi sự kiện bắt đầu bằng <em>khởi xướng</em>: vì sao sự kiện này tồn tại? Một ý tưởng tốt trả lời 5 chữ W: <strong>Why</strong> (mục đích), <strong>Who</strong> (khán giả và người tổ chức), <strong>When</strong> (khi nào), <strong>Where</strong> (ở đâu), <strong>What</strong> (chương trình). Các giáo trình lập kế hoạch sự kiện (xem <a href="` + W + `Event_planning" target="_blank" rel="noopener">event planning</a>) thêm câu thứ sáu: <strong>How</strong> (làm sao có tiền và vận hành).</p>
<h4>Mục tiêu: SMART</h4>
<p>Mục tiêu phải <strong>S</strong>pecific (cụ thể), <strong>M</strong>easurable (đo được), <strong>A</strong>chievable (khả thi), <strong>R</strong>elevant (liên quan) và <strong>T</strong>ime-bound (có hạn).</p>` + tbl(['Mục tiêu yếu', 'Phiên bản SMART'], [['Có một đêm nhạc tuyệt vời', 'Bán 600 vé và đạt mức hài lòng trung bình 4/5 trong khảo sát sau chương trình ngày 20/11'], ['Có nhà tài trợ', 'Ký ba nhà tài trợ phủ ít nhất 40% ngân sách trước 30/9'], ['Quảng bá trên mạng xã hội', 'Đạt 10.000 người xem riêng biệt video teaser trước khi mở bán vé']]) + `
<p>Đây là mục tiêu minh hoạ cho sự kiện sinh viên, không phải chuẩn so sánh.</p>
<h4>Tính khả thi</h4>
<p>Trước khi cam kết, kiểm tra ý tưởng bằng một bảng <a href="` + W + `SWOT_analysis" target="_blank" rel="noopener">SWOT</a> ngắn và bốn câu hỏi: Có nhu cầu không? Có địa điểm phù hợp vào ngày đó không? Có tiền không? Có người và sự cho phép không? Một câu "không" ở giai đoạn này rất rẻ; cùng câu "không" đó phát hiện trước ngày diễn ba tuần thì rất đắt.</p>
<h4>Quyết định đi / không đi</h4>
<p>Viết một trang: ý tưởng, mục tiêu, khán giả, ngày, danh sách địa điểm rút gọn, khung ngân sách, rủi ro chính. Nhà tài trợ, nhà trường hay khách hàng ký duyệt. Trang này là điểm tham chiếu khi phạm vi muốn phình ra.</p>`],
    pit: ['Objectives like "a successful event" cannot be measured. Without numbers you cannot tell afterwards whether you won.', 'Mục tiêu kiểu "sự kiện thành công" không đo được. Không có con số, sau này bạn không biết mình thắng hay thua.'],
    s: [['Concept = 5 W + How.', 'Ý tưởng = 5 W + How.'], ['Objectives must be SMART.', 'Mục tiêu phải SMART.'], ['Check feasibility early and record a go/no-go decision.', 'Kiểm khả thi sớm và ghi quyết định đi/không đi.']],
    l: ['evp', 'swot', 'evm', 'ebblog'],
    p: [['Rewrite "get many guests" as a SMART objective.', 'Viết lại "có nhiều khách" thành mục tiêu SMART.', 'Example: "Register 300 attendees by 15 October through the school portal."', 'Ví dụ: "Có 300 người đăng ký trước 15/10 qua cổng thông tin trường."'],
        ['Why is a "no" cheaper at the feasibility stage?', 'Vì sao một câu "không" rẻ hơn ở giai đoạn khả thi?', 'Little money is spent yet, so stopping or changing costs little.', 'Chưa tốn nhiều tiền nên dừng hay đổi hướng ít tốn kém.']] }),

  D(P + '4-2', '4.2 Timeline, Gantt chart and critical path', '4.2 Tiến độ, biểu đồ Gantt và đường găng',
    'Lập tiến độ ngược từ ngày diễn, Gantt, đường găng với ví dụ có số.', {
    n: '4.2',
    g: [['Plan backwards from the event date', 'Lập kế hoạch ngược từ ngày diễn ra'], ['Read a Gantt chart', 'Đọc biểu đồ Gantt'], ['Find the critical path in a small example', 'Tìm đường găng trong một ví dụ nhỏ']],
    b: [`<p>Event dates are fixed, so planners work <strong>backwards</strong>: start from the day of the show and list what must be finished before it. A <a href="` + W + `Gantt_chart" target="_blank" rel="noopener">Gantt chart</a> shows tasks as bars along a calendar; the <a href="` + W + `Critical_path_method" target="_blank" rel="noopener">critical path method</a> (CPM) tells you which tasks cannot slip without delaying the whole project.</p>
<h4>Phases and typical milestones</h4>` + tbl(['Phase', 'Milestones'], [['Initiation', 'Concept, go/no-go'], ['Planning', 'Budget approved, venue and date signed, permits applied'], ['Promotion', 'Teaser, ticket launch, sponsor announcements'], ['Pre-event', 'Production plan, briefings, rehearsals, accreditation'], ['Event', 'Set-up, show, take-down'], ['Close-out', 'Payments, thank-yous, report, lessons learned']]) + `
<h4>Worked example (durations in weeks, illustrative)</h4>` + tbl(['Task', 'Duration', 'Needs first'], [['A Book venue', '2', '—'], ['B Sign headline artist', '3', 'A'], ['C Obtain permits', '5', 'A'], ['D Launch ticket sales', '1', 'B'], ['E Production plan', '3', 'A'], ['G Final preparation', '2', 'C, D, E']]) + `
<p>Earliest finish: A = 2; B = 2+3 = 5; C = 2+5 = 7; E = 2+3 = 5; D = 5+1 = 6. G can start only when C, D and E are done, so it starts at week 7 (the latest of 7, 6, 5) and finishes at week 9.</p>
<div class="formula"><span class="lbl">Critical path</span>A → C → G = 2 + 5 + 2 = 9 weeks</div>
<p>Slack: the path A→B→D has 1 week of slack; E has 2 weeks. Any delay in permits delays the event, but a one-week delay in the artist contract does not. Manage permits first.</p>
<h4>Practical tips</h4>
<ul><li>Add buffers for tasks that depend on others (authorities, print, customs).</li>
<li>Review the chart weekly and mark progress honestly.</li>
<li>A shared board or sheet is enough; you do not need expensive software.</li></ul>`,
`<p>Ngày sự kiện là cố định, nên người lập kế hoạch làm <strong>ngược</strong>: bắt đầu từ ngày diễn và liệt kê những gì phải xong trước đó. <a href="` + W + `Gantt_chart" target="_blank" rel="noopener">Biểu đồ Gantt</a> thể hiện công việc như các thanh trên lịch; <a href="` + W + `Critical_path_method" target="_blank" rel="noopener">phương pháp đường găng</a> (CPM) cho biết việc nào không được trễ nếu không muốn làm trễ cả dự án.</p>
<h4>Giai đoạn và cột mốc điển hình</h4>` + tbl(['Giai đoạn', 'Cột mốc'], [['Khởi xướng', 'Ý tưởng, quyết định đi/không đi'], ['Lập kế hoạch', 'Duyệt ngân sách, ký địa điểm và ngày, nộp xin giấy phép'], ['Quảng bá', 'Teaser, mở bán vé, công bố nhà tài trợ'], ['Trước sự kiện', 'Kế hoạch sản xuất, tập huấn, tổng duyệt, thẻ ra vào'], ['Sự kiện', 'Dựng, diễn, tháo'], ['Kết thúc', 'Thanh toán, cảm ơn, báo cáo, bài học kinh nghiệm']]) + `
<h4>Ví dụ giải từng bước (thời lượng tính theo tuần, minh hoạ)</h4>` + tbl(['Việc', 'Thời lượng', 'Cần xong trước'], [['A Thuê địa điểm', '2', '—'], ['B Ký nghệ sĩ chính', '3', 'A'], ['C Xin giấy phép', '5', 'A'], ['D Mở bán vé', '1', 'B'], ['E Kế hoạch sản xuất', '3', 'A'], ['G Chuẩn bị cuối', '2', 'C, D, E']]) + `
<p>Hoàn thành sớm nhất: A = 2; B = 2+3 = 5; C = 2+5 = 7; E = 2+3 = 5; D = 5+1 = 6. G chỉ bắt đầu khi C, D, E đều xong nên bắt đầu ở tuần 7 (lớn nhất trong 7, 6, 5) và kết thúc ở tuần 9.</p>
<div class="formula"><span class="lbl">Đường găng</span>A → C → G = 2 + 5 + 2 = 9 tuần</div>
<p>Độ trễ cho phép (slack): đường A→B→D dư 1 tuần; E dư 2 tuần. Giấy phép trễ thì sự kiện trễ, còn hợp đồng nghệ sĩ trễ một tuần thì không. Hãy lo giấy phép trước.</p>
<h4>Mẹo thực hành</h4>
<ul><li>Thêm đệm cho việc phụ thuộc bên khác (cơ quan chức năng, in ấn, hải quan).</li>
<li>Rà biểu đồ hằng tuần và đánh dấu tiến độ trung thực.</li>
<li>Một bảng hoặc bảng tính dùng chung là đủ; không cần phần mềm đắt tiền.</li></ul>`],
    pit: ['Planning forwards from today. The date is fixed; planning backwards shows whether it is possible at all.', 'Lập kế hoạch tiến từ hôm nay. Ngày diễn là cố định; lập ngược cho biết liệu có khả thi hay không.'],
    s: [['Plan backwards from the event date.', 'Lập kế hoạch ngược từ ngày diễn.'], ['Gantt shows tasks on a calendar; CPM finds tasks with zero slack.', 'Gantt đặt việc lên lịch; CPM tìm các việc không còn độ trễ.'], ['Start the critical path (often permits) first and add buffers.', 'Bắt đầu đường găng trước (thường là giấy phép) và thêm đệm.']],
    l: ['gantt', 'cpm', 'wbs', 'pm'],
    p: [['In the example, what happens if task E (production plan) takes 5 weeks instead of 3?', 'Trong ví dụ, nếu E (kế hoạch sản xuất) mất 5 tuần thay vì 3 thì sao?', 'E finishes at week 7, equal to C; there is no more slack, but the project still ends at week 9.', 'E xong ở tuần 7, bằng C; hết dư nhưng dự án vẫn kết thúc ở tuần 9.'],
        ['If C takes 6 weeks, when does the project end?', 'Nếu C mất 6 tuần thì dự án kết thúc khi nào?', 'C finishes at week 8, G ends at week 10.', 'C xong ở tuần 8, G kết thúc ở tuần 10.']] }),

  D(P + '4-3', '4.3 Venue, permits and suppliers (and a failure case)', '4.3 Địa điểm, giấy phép và nhà cung cấp (và một ca thất bại)',
    'Chọn địa điểm theo tiêu chí, giấy phép ở mức khái niệm, Fyre Festival như bài học lập kế hoạch.', {
    n: '4.3',
    g: [['Score venues against criteria', 'Chấm điểm địa điểm theo tiêu chí'], ['Understand why permits are on the critical path', 'Hiểu vì sao giấy phép nằm trên đường găng'], ['Learn from a high-profile planning failure', 'Rút bài học từ một thất bại nổi tiếng']],
    b: [`<h4>Choosing the venue</h4>
<p>The venue is the largest single decision. Score each candidate on weighted criteria, then compare.</p>` + tbl(['Criterion', 'Weight', 'Hall A', 'Field B'], [['Capacity and layout', '25%', '4/5', '5/5'], ['Cost', '20%', '3/5', '4/5'], ['Access and transport', '15%', '5/5', '2/5'], ['Safety and exits', '20%', '5/5', '3/5'], ['Technical facilities', '10%', '4/5', '1/5'], ['Availability on date', '10%', '5/5', '5/5']]) + `
<p>Weighted score for Hall A: 0.25×4 + 0.20×3 + 0.15×5 + 0.20×5 + 0.10×4 + 0.10×5 = 1.00 + 0.60 + 0.75 + 1.00 + 0.40 + 0.50 = 4.25. For Field B: 1.25 + 0.80 + 0.30 + 0.60 + 0.10 + 0.50 = 3.55. Hall A wins on this scoring; change the weights and the answer may change, so agree the weights before you look at venues.</p>
<h4>Permits</h4>
<p>Public events usually need permission from the local authorities and checks on fire safety, crowd control, sound and food. Rules differ by place and change over time, so ask the venue and the local office early, and treat the approval time as a fixed part of the timeline (it is often on the critical path).</p>
<h4>Suppliers</h4>
<p>Book the long-lead items first (stage, sound, light, toilets, security). Ask for references, visit a previous job when possible, and confirm who is on site on the day.</p>
<h4>Failure case: Fyre Festival (2017)</h4>
<p>The <a href="` + W + `Fyre_Festival" target="_blank" rel="noopener">Fyre Festival</a> was promoted as a luxury music festival in the Bahamas in 2017. Guests arrived to find the infrastructure not ready, and the event collapsed. Its founder was later sentenced to prison for fraud. The planning lessons are plain: promises were sold before venue, accommodation, food, water, transport and medical services were secured; the marketing outran the operations. A feasibility check and a venue and supplier checklist would have stopped it early.</p>`,
`<h4>Chọn địa điểm</h4>
<p>Địa điểm là quyết định đơn lẻ lớn nhất. Chấm từng phương án theo tiêu chí có trọng số rồi so sánh.</p>` + tbl(['Tiêu chí', 'Trọng số', 'Hội trường A', 'Bãi đất B'], [['Sức chứa và bố cục', '25%', '4/5', '5/5'], ['Chi phí', '20%', '3/5', '4/5'], ['Đi lại và giao thông', '15%', '5/5', '2/5'], ['An toàn và lối thoát', '20%', '5/5', '3/5'], ['Cơ sở kỹ thuật', '10%', '4/5', '1/5'], ['Có sẵn vào ngày diễn', '10%', '5/5', '5/5']]) + `
<p>Điểm có trọng số của Hội trường A: 0,25×4 + 0,20×3 + 0,15×5 + 0,20×5 + 0,10×4 + 0,10×5 = 1,00 + 0,60 + 0,75 + 1,00 + 0,40 + 0,50 = 4,25. Của Bãi đất B: 1,25 + 0,80 + 0,30 + 0,60 + 0,10 + 0,50 = 3,55. Hội trường A thắng theo cách chấm này; đổi trọng số thì kết quả có thể đổi, nên hãy thống nhất trọng số trước khi xem địa điểm.</p>
<h4>Giấy phép</h4>
<p>Sự kiện công cộng thường cần sự cho phép của chính quyền địa phương và kiểm tra về phòng cháy, kiểm soát đám đông, âm thanh, thực phẩm. Quy định khác nhau theo nơi và thay đổi theo thời gian, nên hỏi địa điểm và cơ quan địa phương sớm, và coi thời gian xét duyệt là phần cố định của tiến độ (thường nằm trên đường găng).</p>
<h4>Nhà cung cấp</h4>
<p>Đặt trước các hạng mục cần thời gian dài (sân khấu, âm thanh, ánh sáng, nhà vệ sinh, bảo vệ). Hỏi tham chiếu, đi xem công việc trước đó nếu có thể, và xác nhận ai có mặt tại chỗ trong ngày diễn.</p>
<h4>Ca thất bại: Fyre Festival (2017)</h4>
<p><a href="` + W + `Fyre_Festival" target="_blank" rel="noopener">Fyre Festival</a> được quảng bá là lễ hội âm nhạc sang trọng ở Bahamas năm 2017. Khách đến nơi thì hạ tầng chưa sẵn sàng và sự kiện sụp đổ. Người sáng lập sau đó bị kết án tù vì gian lận. Bài học lập kế hoạch rất rõ: lời hứa được bán ra trước khi địa điểm, chỗ ở, thức ăn, nước, vận chuyển và y tế được bảo đảm; marketing chạy nhanh hơn vận hành. Một bước kiểm tra khả thi và danh mục địa điểm – nhà cung cấp đã có thể chặn nó từ sớm.</p>`],
    pit: ['Selling tickets before the venue, safety and suppliers are confirmed. Marketing must never outrun operations.', 'Bán vé trước khi xác nhận địa điểm, an toàn và nhà cung cấp. Marketing không bao giờ được chạy nhanh hơn vận hành.'],
    s: [['Score venues with agreed, weighted criteria.', 'Chấm địa điểm bằng tiêu chí có trọng số đã thống nhất.'], ['Permit approval time belongs on the timeline, often on the critical path.', 'Thời gian xét duyệt giấy phép thuộc tiến độ, thường nằm trên đường găng.'], ['Fyre Festival: promises sold before operations existed.', 'Fyre Festival: lời hứa được bán trước khi vận hành tồn tại.']],
    l: ['fyre', 'ccent', 'rass', 'hse'],
    p: [['Recompute Hall A if safety weight becomes 30% and cost 10%.', 'Tính lại Hội trường A nếu trọng số an toàn thành 30% và chi phí 10%.', '0.25×4 + 0.10×3 + 0.15×5 + 0.30×5 + 0.10×4 + 0.10×5 = 1.00+0.30+0.75+1.50+0.40+0.50 = 4.45.', '0,25×4 + 0,10×3 + 0,15×5 + 0,30×5 + 0,10×4 + 0,10×5 = 1,00+0,30+0,75+1,50+0,40+0,50 = 4,45.'],
        ['Name one planning lesson from the Fyre Festival.', 'Nêu một bài học lập kế hoạch từ Fyre Festival.', 'Confirm venue, services and safety before selling; test feasibility first.', 'Xác nhận địa điểm, dịch vụ và an toàn trước khi bán; kiểm khả thi trước.']] }),

  Q(P + 'quiz-4', 'Chapter 4 quiz — The planning process', 'Quiz Chương 4 — Quy trình lập kế hoạch', [
    ['SMART stands for…|||SMART là viết tắt của…', ['Specific, Measurable, Achievable, Relevant, Time-bound|||Cụ thể, Đo được, Khả thi, Liên quan, Có hạn', 'Simple, Modern, Active, Real, Total|||Đơn giản, Hiện đại, Năng động, Thật, Toàn bộ', 'Safe, Mild, Able, Ready, Timely|||An toàn, Nhẹ, Có thể, Sẵn sàng, Đúng lúc', 'Sell, Market, Ask, Repeat, Track|||Bán, Tiếp thị, Hỏi, Lặp lại, Theo dõi'], 0, 'SMART objectives can be checked afterwards.|||Mục tiêu SMART có thể kiểm tra sau đó.'],
    ['Which is the best objective?|||Đâu là mục tiêu tốt nhất?', ['Sell 600 tickets by 10 November|||Bán 600 vé trước 10/11', 'Be popular|||Được nổi tiếng', 'Have fun|||Vui vẻ', 'Do our best|||Cố hết sức'], 0, 'It has a number and a date.|||Có con số và có hạn.'],
    ['Event planning is done backwards from…|||Lập kế hoạch sự kiện làm ngược từ…', ['The fixed event date|||Ngày diễn cố định', 'The budget total|||Tổng ngân sách', 'The poster|||Tấm poster', 'The last invoice|||Hoá đơn cuối'], 0, 'The date is fixed, tasks are fitted before it.|||Ngày cố định, công việc được xếp vào trước đó.'],
    ['The critical path is…|||Đường găng là…', ['The chain of tasks with zero slack that sets the project end|||Chuỗi việc không còn dư thời gian, quyết định ngày kết thúc dự án', 'The shortest task|||Việc ngắn nhất', 'The cheapest supplier|||Nhà cung cấp rẻ nhất', 'The sponsor list|||Danh sách nhà tài trợ'], 0, 'Delay on it delays the event.|||Trễ ở đường này làm trễ sự kiện.'],
    ['In the worked example, the critical path is…|||Trong ví dụ, đường găng là…', ['A → C → G|||A → C → G', 'A → B → D|||A → B → D', 'A → E|||A → E', 'B → D → G|||B → D → G'], 0, '2 + 5 + 2 = 9 weeks.|||2 + 5 + 2 = 9 tuần.'],
    ['Why check feasibility early?|||Vì sao kiểm khả thi sớm?', ['Stopping early costs little|||Dừng sớm tốn ít', 'It removes the need for permits|||Nó bỏ nhu cầu giấy phép', 'It guarantees profit|||Nó bảo đảm lợi nhuận', 'It replaces the budget|||Nó thay ngân sách'], 0, 'Late "no" is expensive.|||Câu "không" muộn rất đắt.'],
    ['Weighted scoring of venues needs…|||Chấm điểm có trọng số địa điểm cần…', ['Agreed criteria and weights before viewing venues|||Tiêu chí và trọng số thống nhất trước khi xem địa điểm', 'Only a picture|||Chỉ một bức ảnh', 'A random draw|||Bốc thăm', 'No numbers|||Không dùng số'], 0, 'Otherwise the answer is biased.|||Nếu không kết quả bị thiên lệch.'],
    ['The main lesson of Fyre Festival is…|||Bài học chính của Fyre Festival là…', ['Do not sell promises before operations are secured|||Đừng bán lời hứa trước khi vận hành được bảo đảm', 'Always choose islands|||Luôn chọn đảo', 'Never use social media|||Không bao giờ dùng mạng xã hội', 'Free tickets fix everything|||Vé miễn phí giải quyết mọi thứ'], 0, 'Marketing must not outrun operations.|||Marketing không được chạy trước vận hành.']
  ]),
]));
// ===== Chương 5 =====
secs.push(SEC('Chapter 5 — Budget and sponsorship', 'Chương 5 — Ngân sách và tài trợ',
  'Lập ngân sách và điểm hoà vốn, bán vé và định giá, tài trợ.', [
  D(P + '5-1', '5.1 Event budget and break-even', '5.1 Ngân sách sự kiện và điểm hoà vốn',
    'Cấu trúc ngân sách, chi phí cố định và biến đổi, dự phòng, hoà vốn có ví dụ số.', {
    n: '5.1',
    g: [['Build a budget with income and expense lines', 'Lập ngân sách với các dòng thu và chi'], ['Separate fixed and variable costs', 'Tách chi phí cố định và biến đổi'], ['Compute a break-even point', 'Tính điểm hoà vốn']],
    b: [`<p>A <a href="` + W + `Budget" target="_blank" rel="noopener">budget</a> is a plan for money; it is also a decision tool. Build it in the same order as the planning: list income, list expenses by department, add a contingency, then compare.</p>
<h4>Typical lines</h4>` + tbl(['Income', 'Expenses'], [['Ticket sales', 'Venue hire, production (stage, sound, light)'], ['Sponsorship (cash and in-kind)', 'Artist and speaker fees, travel and hospitality'], ['Food and beverage, merchandise', 'Marketing, printing, content'], ['Grants, partner contributions', 'Staff, volunteers, insurance, permits, security, medical, admin, contingency']]) + `
<p>A common rule is to hold a <strong>contingency</strong> of around 5–10% of costs for surprises; the exact level depends on how uncertain the event is.</p>
<h4>Fixed and variable costs</h4>
<p><strong>Fixed</strong> costs do not change with attendance (venue, stage, artist fee). <strong>Variable</strong> costs grow with each guest (wristband, catering, ticketing fee). The <a href="` + W + `Break-even_(economics)" target="_blank" rel="noopener">break-even</a> point is the attendance at which income equals cost.</p>
<div class="formula"><span class="lbl">Break-even tickets</span>Break-even = (Fixed costs − other income) ÷ (Ticket price − Variable cost per ticket)</div>
<h4>Worked example (VND, illustrative)</h4>
<ul><li>Fixed costs: 300,000,000. Ticket price: 350,000. Variable cost per ticket: 80,000. Capacity: 1,500.</li>
<li>Contribution per ticket = 350,000 − 80,000 = 270,000.</li>
<li>Without sponsors: 300,000,000 ÷ 270,000 = 1,111.1, so you need <strong>1,112 tickets</strong>, about 74% of capacity.</li>
<li>With 100,000,000 of sponsorship: (300,000,000 − 100,000,000) ÷ 270,000 = 740.7, so <strong>741 tickets</strong>, about 49% of capacity.</li></ul>
<p>The calculation shows why sponsors reduce risk: they lower the break-even attendance. It also shows the danger of capacity: if the break-even is above capacity, the event cannot pay for itself at that price.</p>`,
`<p><a href="` + W + `Budget" target="_blank" rel="noopener">Ngân sách</a> là kế hoạch về tiền và cũng là công cụ ra quyết định. Lập theo thứ tự như kế hoạch: liệt kê thu, liệt kê chi theo ban, thêm dự phòng rồi so sánh.</p>
<h4>Các dòng điển hình</h4>` + tbl(['Thu', 'Chi'], [['Bán vé', 'Thuê địa điểm, sản xuất (sân khấu, âm thanh, ánh sáng)'], ['Tài trợ (tiền mặt và hiện vật)', 'Thù lao nghệ sĩ và diễn giả, đi lại và tiếp đón'], ['Ăn uống, hàng lưu niệm', 'Marketing, in ấn, nội dung'], ['Quỹ hỗ trợ, đóng góp của đối tác', 'Nhân sự, tình nguyện viên, bảo hiểm, giấy phép, bảo vệ, y tế, hành chính, dự phòng']]) + `
<p>Quy tắc thường dùng là giữ <strong>dự phòng</strong> khoảng 5–10% chi phí cho điều bất ngờ; mức chính xác phụ thuộc độ bất định của sự kiện.</p>
<h4>Chi phí cố định và biến đổi</h4>
<p>Chi phí <strong>cố định</strong> không đổi theo số khách (địa điểm, sân khấu, thù lao nghệ sĩ). Chi phí <strong>biến đổi</strong> tăng theo mỗi khách (vòng tay, ăn uống, phí bán vé). <a href="` + W + `Break-even_(economics)" target="_blank" rel="noopener">Điểm hoà vốn</a> là số khách tại đó thu bằng chi.</p>
<div class="formula"><span class="lbl">Số vé hoà vốn</span>Hoà vốn = (Chi phí cố định − thu khác) ÷ (Giá vé − Chi phí biến đổi mỗi vé)</div>
<h4>Ví dụ giải từng bước (VND, minh hoạ)</h4>
<ul><li>Chi phí cố định: 300.000.000. Giá vé: 350.000. Chi phí biến đổi mỗi vé: 80.000. Sức chứa: 1.500.</li>
<li>Đóng góp mỗi vé = 350.000 − 80.000 = 270.000.</li>
<li>Không có tài trợ: 300.000.000 ÷ 270.000 = 1.111,1, nên cần <strong>1.112 vé</strong>, khoảng 74% sức chứa.</li>
<li>Có 100.000.000 tài trợ: (300.000.000 − 100.000.000) ÷ 270.000 = 740,7, nên cần <strong>741 vé</strong>, khoảng 49% sức chứa.</li></ul>
<p>Phép tính cho thấy vì sao tài trợ giảm rủi ro: nó hạ số khách hoà vốn. Nó cũng cho thấy nguy cơ về sức chứa: nếu điểm hoà vốn vượt sức chứa thì sự kiện không thể tự nuôi mình ở mức giá đó.</p>`],
    pit: ['Forgetting variable costs or the contingency. A budget that only lists big items always looks cheaper than reality.', 'Quên chi phí biến đổi hoặc dự phòng. Ngân sách chỉ liệt kê khoản lớn luôn trông rẻ hơn thực tế.'],
    s: [['Budget = income, expenses by department, contingency.', 'Ngân sách = thu, chi theo ban, dự phòng.'], ['Break-even = (fixed − other income) ÷ (price − variable cost).', 'Hoà vốn = (cố định − thu khác) ÷ (giá − biến đổi).'], ['Sponsorship lowers break-even attendance.', 'Tài trợ làm giảm số khách hoà vốn.']],
    l: ['budget', 'be', 'cba', 'roi'],
    p: [['Fixed 200,000,000; price 300,000; variable 60,000; no other income. Break-even tickets?', 'Cố định 200.000.000; giá 300.000; biến đổi 60.000; không thu khác. Số vé hoà vốn?', '200,000,000 ÷ 240,000 = 833.3, so 834 tickets.', '200.000.000 ÷ 240.000 = 833,3 nên 834 vé.'],
        ['Why is a contingency line important?', 'Vì sao dòng dự phòng quan trọng?', 'Costs rise and surprises occur; it prevents a small shock from becoming a loss.', 'Chi phí tăng và có bất ngờ; nó giúp một cú sốc nhỏ không thành lỗ.']] }),

  D(P + '5-2', '5.2 Ticketing and pricing', '5.2 Bán vé và định giá',
    'Cơ cấu giá vé, vé sớm, phí, định giá linh hoạt, bán lại vé, bài học từ Eras Tour.', {
    n: '5.2',
    g: [['Design a simple ticket structure', 'Thiết kế cơ cấu vé đơn giản'], ['Explain early bird, tiers and dynamic pricing', 'Giải thích vé sớm, hạng vé và định giá linh hoạt'], ['Plan for demand spikes and resale', 'Lập kế hoạch cho nhu cầu tăng vọt và bán lại vé']],
    b: [`<p>Ticket price signals value and also pays the bills. Three questions guide pricing: what does it cost (break-even), what will the audience pay, and what do comparable events charge?</p>
<h4>Structures</h4>` + tbl(['Tool', 'How it works', 'Effect'], [['Tiers', 'General, premium, VIP with different benefits', 'Captures different willingness to pay'], ['Early bird', 'Lower price for first buyers', 'Early cash and proof of demand'], ['Groups and students', 'Discount for groups or ID', 'Builds audience, fills seats'], ['Bundles', 'Ticket plus merchandise or drink', 'Raises average spend'], ['<a href="' + W + 'Dynamic_pricing" target="_blank" rel="noopener">Dynamic pricing</a>', 'Price changes with demand', 'More revenue at peak, but fairness concerns']]) + `
<h4>Fees and refunds</h4>
<p>Show the total price early. Surprise fees at checkout annoy buyers more than a higher honest price. State the refund and transfer rules before the sale starts.</p>
<h4>Demand spikes and resale</h4>
<p>For very popular acts, demand can exceed supply many times over. When tickets for the <a href="` + W + `Taylor_Swift:_The_Eras_Tour" target="_blank" rel="noopener">Eras Tour</a> went on presale in the United States in November 2022, the ticketing system struggled and the <a href="` + W + `Ticketmaster" target="_blank" rel="noopener">Ticketmaster</a> sales became a public controversy, followed by political attention. For organisers the lessons are: load-test the sales system, use queues and verified-fan or ID-linked purchase, communicate clearly, and plan for <a href="` + W + `Ticket_resale" target="_blank" rel="noopener">resale</a> and fake tickets.</p>
<h4>Small-event checklist</h4>
<ul><li>Sell through one official channel and publish its link everywhere.</li>
<li>Use unique QR codes and check them at the gate to block copies.</li>
<li>Keep a small number of complimentary tickets and record who got them.</li></ul>`,
`<p>Giá vé báo hiệu giá trị và cũng trả các hoá đơn. Ba câu hỏi dẫn dắt định giá: tốn bao nhiêu (hoà vốn), khán giả sẵn sàng trả bao nhiêu, và sự kiện tương tự bán giá nào?</p>
<h4>Cơ cấu</h4>` + tbl(['Công cụ', 'Cách hoạt động', 'Tác động'], [['Hạng vé', 'Thường, cao cấp, VIP với quyền lợi khác nhau', 'Nắm các mức sẵn sàng chi trả khác nhau'], ['Vé sớm (early bird)', 'Giá thấp cho người mua đầu tiên', 'Có tiền sớm và bằng chứng nhu cầu'], ['Nhóm và sinh viên', 'Giảm giá theo nhóm hoặc thẻ', 'Xây khán giả, lấp ghế'], ['Gói combo', 'Vé kèm hàng lưu niệm hoặc đồ uống', 'Tăng chi tiêu trung bình'], ['<a href="' + W + 'Dynamic_pricing" target="_blank" rel="noopener">Định giá linh hoạt</a>', 'Giá đổi theo nhu cầu', 'Thu nhiều hơn lúc cao điểm nhưng có lo ngại về công bằng']]) + `
<h4>Phí và hoàn vé</h4>
<p>Hiển thị tổng giá sớm. Phí bất ngờ ở bước thanh toán làm người mua khó chịu hơn một mức giá cao nhưng trung thực. Nêu quy tắc hoàn và chuyển nhượng vé trước khi mở bán.</p>
<h4>Nhu cầu tăng vọt và bán lại vé</h4>
<p>Với nghệ sĩ cực hot, cầu có thể vượt cung nhiều lần. Khi vé <a href="` + W + `Taylor_Swift:_The_Eras_Tour" target="_blank" rel="noopener">Eras Tour</a> mở bán trước tại Mỹ hồi tháng 11/2022, hệ thống bán vé quá tải và việc bán vé của <a href="` + W + `Ticketmaster" target="_blank" rel="noopener">Ticketmaster</a> thành tranh cãi công khai, sau đó thu hút cả sự chú ý của chính trị. Với người tổ chức, bài học là: thử tải hệ thống bán vé, dùng hàng chờ và mua theo định danh/fan xác thực, truyền thông rõ ràng, và tính đến việc <a href="` + W + `Ticket_resale" target="_blank" rel="noopener">bán lại vé</a> và vé giả.</p>
<h4>Danh mục cho sự kiện nhỏ</h4>
<ul><li>Chỉ bán qua một kênh chính thức và công bố đường dẫn ở mọi nơi.</li>
<li>Dùng mã QR duy nhất và quét ở cổng để chặn bản sao.</li>
<li>Giữ ít vé mời và ghi lại ai nhận.</li></ul>`],
    pit: ['Underpricing because "students have no money" without testing. Check comparable events and offer a student tier instead.', 'Định giá thấp vì "sinh viên không có tiền" mà không thử. Hãy xem sự kiện tương tự và mở hạng vé sinh viên.'],
    s: [['Pricing uses cost, willingness to pay and comparables.', 'Định giá dựa vào chi phí, mức sẵn sàng chi trả và sự kiện tương tự.'], ['Tiers, early bird, groups and bundles shape demand.', 'Hạng vé, vé sớm, nhóm và combo định hình nhu cầu.'], ['Prepare the sales system and anti-fraud checks for spikes.', 'Chuẩn bị hệ thống bán vé và chống gian lận cho đợt tăng vọt.']],
    l: ['dyn', 'resale', 'tm', 'eras', 'ebblog'],
    p: [['Why show the total price early?', 'Vì sao hiển thị tổng giá sớm?', 'Surprise fees at checkout reduce trust and conversion.', 'Phí bất ngờ ở bước thanh toán làm giảm niềm tin và tỷ lệ mua.'],
        ['Name two controls that protect a small event from fake tickets.', 'Nêu hai biện pháp bảo vệ sự kiện nhỏ khỏi vé giả.', 'One official sales channel and unique QR codes scanned at the gate.', 'Một kênh bán chính thức và mã QR duy nhất được quét ở cổng.']] }),

  D(P + '5-3', '5.3 Sponsorship', '5.3 Tài trợ sự kiện',
    'Tài trợ là gì, các gói, đề xuất, kích hoạt và đo lường; đạo đức.', {
    n: '5.3',
    g: [['Explain what sponsors buy', 'Giải thích nhà tài trợ mua gì'], ['Structure sponsor packages', 'Cấu trúc các gói tài trợ'], ['Plan activation and reporting', 'Lập kế hoạch kích hoạt và báo cáo']],
    b: [`<p><a href="` + W + `Sponsor_(commercial)" target="_blank" rel="noopener">Sponsorship</a> is a business exchange, not a donation. The sponsor pays in cash or goods to reach an audience and to link its brand with the values of the event. The organiser needs the funds and the credibility.</p>
<h4>What a sponsor wants</h4>
<ul><li>Awareness and image among a specific audience.</li>
<li>Direct contact: sampling, leads, sales on site.</li>
<li>Content and media exposure.</li>
<li>Hospitality for clients and staff.</li></ul>
<h4>Package ladder (example)</h4>` + tbl(['Level', 'Benefits', 'Notes'], [['Title / presenting', 'Name in event title, main stage branding, speaking slot, data share where allowed', 'Only one; highest fee'], ['Official partner', 'Logo on materials, booth, social mentions', 'Category exclusivity (e.g. one drink brand)'], ['Supporter', 'Logo, thank-you mention', 'Low fee or in-kind'], ['Media partner', 'Coverage in return for access', 'Value in exposure rather than cash']]) + `
<h4>The proposal</h4>
<ol><li>Who is the audience (age, interests, size, past results)?</li>
<li>What are the benefits per package?</li>
<li>What will the sponsor see afterwards (report, photos, numbers)?</li>
<li>What is the price and the deadline?</li></ol>
<p>Research the sponsor first: match category and values, and address a named person.</p>
<h4>Activation and reporting</h4>
<p><em>Activation</em> means making the sponsorship work beyond a logo: a booth, a game, a product trial, a social campaign. Report results with numbers (visitors, samples, leads, reach) and photos. A good report is the basis for renewal. The same logic is behind <a href="` + W + `Event_marketing" target="_blank" rel="noopener">event marketing</a> and <a href="` + W + `Experiential_marketing" target="_blank" rel="noopener">experiential marketing</a>.</p>
<h4>Ethics</h4>
<p>Do not promise reach you cannot deliver, and check that a sponsor fits the audience (for example, alcohol or gambling brands at events with minors are a problem).</p>`,
`<p><a href="` + W + `Sponsor_(commercial)" target="_blank" rel="noopener">Tài trợ</a> là một trao đổi kinh doanh, không phải quyên góp. Nhà tài trợ trả bằng tiền hoặc hàng hoá để tiếp cận một nhóm khán giả và gắn thương hiệu với giá trị của sự kiện. Ban tổ chức cần nguồn tiền và uy tín.</p>
<h4>Nhà tài trợ muốn gì</h4>
<ul><li>Độ nhận biết và hình ảnh trong một nhóm khán giả cụ thể.</li>
<li>Tiếp xúc trực tiếp: dùng thử, thu khách tiềm năng, bán tại chỗ.</li>
<li>Nội dung và độ phủ truyền thông.</li>
<li>Tiếp đón khách hàng và nhân viên.</li></ul>
<h4>Bậc thang gói tài trợ (ví dụ)</h4>` + tbl(['Cấp', 'Quyền lợi', 'Ghi chú'], [['Chính / trình bày', 'Tên trong tên sự kiện, nhận diện sân khấu chính, phần phát biểu, chia sẻ dữ liệu nếu được phép', 'Chỉ một; phí cao nhất'], ['Đối tác chính thức', 'Logo trên ấn phẩm, gian hàng, nhắc tên trên mạng', 'Độc quyền theo ngành (vd một nhãn đồ uống)'], ['Đồng hành', 'Logo, lời cảm ơn', 'Phí thấp hoặc hiện vật'], ['Đối tác truyền thông', 'Đưa tin đổi lấy quyền tiếp cận', 'Giá trị nằm ở độ phủ chứ không phải tiền mặt']]) + `
<h4>Bản đề xuất</h4>
<ol><li>Khán giả là ai (tuổi, sở thích, quy mô, kết quả các kỳ trước)?</li>
<li>Quyền lợi của từng gói là gì?</li>
<li>Nhà tài trợ sẽ nhận gì sau đó (báo cáo, ảnh, số liệu)?</li>
<li>Giá và hạn chót là gì?</li></ol>
<p>Tìm hiểu nhà tài trợ trước: khớp ngành và giá trị, và gửi cho một người có tên cụ thể.</p>
<h4>Kích hoạt và báo cáo</h4>
<p><em>Kích hoạt (activation)</em> là làm cho tài trợ có tác dụng ngoài logo: gian hàng, trò chơi, dùng thử sản phẩm, chiến dịch mạng xã hội. Báo cáo kết quả bằng số liệu (lượt ghé, mẫu thử, khách tiềm năng, độ phủ) và ảnh. Báo cáo tốt là cơ sở để gia hạn. Cùng logic này nằm ở <a href="` + W + `Event_marketing" target="_blank" rel="noopener">marketing sự kiện</a> và <a href="` + W + `Experiential_marketing" target="_blank" rel="noopener">marketing trải nghiệm</a>.</p>
<h4>Đạo đức</h4>
<p>Đừng hứa độ phủ mà bạn không đạt được, và kiểm tra nhà tài trợ có phù hợp khán giả hay không (ví dụ thương hiệu rượu bia hay cờ bạc ở sự kiện có người chưa thành niên là vấn đề).</p>`],
    pit: ['Sending the same mass email to every company. Sponsors fund what matches their audience and goals.', 'Gửi cùng một email hàng loạt cho mọi công ty. Nhà tài trợ chỉ tài trợ cái khớp khán giả và mục tiêu của họ.'],
    s: [['Sponsorship is an exchange of money/goods for audience access and brand link.', 'Tài trợ là trao đổi tiền/hàng lấy quyền tiếp cận khán giả và liên kết thương hiệu.'], ['Package ladder: title, official partner, supporter, media partner.', 'Bậc thang: chính, đối tác chính thức, đồng hành, đối tác truyền thông.'], ['Activate, then report with numbers to win renewal.', 'Kích hoạt, rồi báo cáo bằng số liệu để được gia hạn.']],
    l: ['spons', 'evmk', 'exmk', 'lnsite'],
    p: [['What is category exclusivity?', 'Độc quyền theo ngành là gì?', 'A promise that no competitor in the same category (e.g. drinks) will sponsor the event.', 'Cam kết không có đối thủ cùng ngành (vd đồ uống) tài trợ sự kiện.'],
        ['List three numbers a sponsor report should include.', 'Liệt kê ba con số báo cáo tài trợ nên có.', 'Attendance, booth visitors/samples/leads, online reach (any three).', 'Số khách, lượt ghé gian hàng/mẫu thử/khách tiềm năng, độ phủ trực tuyến (ba ý bất kỳ).']] }),

  Q(P + 'quiz-5', 'Chapter 5 quiz — Budget and sponsorship', 'Quiz Chương 5 — Ngân sách và tài trợ', [
    ['Which cost is fixed?|||Chi phí nào là cố định?', ['Stage hire|||Thuê sân khấu', 'Wristband per guest|||Vòng tay mỗi khách', 'Catering per head|||Ăn uống theo đầu người', 'Ticketing fee per ticket|||Phí vé mỗi vé'], 0, 'Fixed costs do not change with attendance.|||Chi phí cố định không đổi theo số khách.'],
    ['Break-even tickets = ?|||Số vé hoà vốn = ?', ['(Fixed − other income) ÷ (price − variable cost)|||(Cố định − thu khác) ÷ (giá − biến đổi)', 'Price × capacity|||Giá × sức chứa', 'Fixed + variable|||Cố định + biến đổi', 'Price ÷ fixed|||Giá ÷ cố định'], 0, 'It divides the net fixed cost by the contribution per ticket.|||Chia chi phí cố định ròng cho phần đóng góp mỗi vé.'],
    ['Fixed 300 m, price 350k, variable 80k. Tickets to break even (rounded up)?|||Cố định 300 triệu, giá 350k, biến đổi 80k. Số vé hoà vốn (làm tròn lên)?', ['1,112|||1.112', '857|||857', '741|||741', '3,750|||3.750'], 0, '300,000,000 ÷ 270,000 = 1,111.1 → 1,112.|||300.000.000 ÷ 270.000 = 1.111,1 → 1.112.'],
    ['Sponsorship affects break-even by…|||Tài trợ ảnh hưởng điểm hoà vốn bằng cách…', ['Lowering the required attendance|||Hạ số khách cần có', 'Raising the required attendance|||Nâng số khách cần có', 'No effect|||Không ảnh hưởng', 'Doubling fixed costs|||Nhân đôi chi phí cố định'], 0, 'Other income reduces the net fixed cost.|||Thu khác làm giảm chi phí cố định ròng.'],
    ['An early bird ticket gives…|||Vé sớm mang lại…', ['Early cash and proof of demand|||Tiền sớm và bằng chứng nhu cầu', 'Higher price|||Giá cao hơn', 'No sales|||Không bán', 'Free entry for all|||Vào cửa miễn phí cho mọi người'], 0, 'It rewards first buyers.|||Nó thưởng người mua đầu tiên.'],
    ['Why test ticketing systems before a big sale?|||Vì sao thử tải hệ thống bán vé trước đợt bán lớn?', ['Demand spikes can crash them|||Cầu tăng vọt có thể làm sập', 'To remove tickets|||Để bỏ vé', 'To lower fees|||Để giảm phí', 'To avoid marketing|||Để tránh marketing'], 0, 'Eras Tour presale showed the risk.|||Đợt bán trước Eras Tour cho thấy rủi ro.'],
    ['A sponsorship is…|||Tài trợ là…', ['A business exchange for audience access|||Trao đổi kinh doanh để tiếp cận khán giả', 'A pure donation|||Quyên góp thuần tuý', 'A tax form|||Một mẫu thuế', 'A loan|||Một khoản vay'], 0, 'Both sides must gain.|||Cả hai bên đều phải có lợi.'],
    ['Activation means…|||Kích hoạt nghĩa là…', ['Making the sponsorship work beyond a logo|||Làm cho tài trợ có tác dụng vượt ngoài logo', 'Switching on lights|||Bật đèn', 'Printing tickets|||In vé', 'Cancelling sponsors|||Huỷ nhà tài trợ'], 0, 'Booths, trials, games, campaigns.|||Gian hàng, dùng thử, trò chơi, chiến dịch.']
  ]),
]));
// ===== Chương 6 =====
secs.push(SEC('Chapter 6 — Marketing and communications', 'Chương 6 — Marketing và truyền thông',
  'Khán giả mục tiêu và định vị, kênh và phễu bán vé, PR, mạng xã hội và truyền thông sau sự kiện.', [
  D(P + '6-1', '6.1 Audience, positioning and the marketing plan', '6.1 Khán giả, định vị và kế hoạch marketing',
    'Phân khúc, persona, thông điệp và kế hoạch marketing một trang (mức nhập môn).', {
    n: '6.1',
    g: [['Describe the target audience with a simple persona', 'Mô tả khán giả mục tiêu bằng persona đơn giản'], ['Write a one-line positioning statement', 'Viết một dòng tuyên bố định vị'], ['Outline a one-page marketing plan', 'Phác thảo kế hoạch marketing một trang']],
    b: [`<p>Event marketing starts with the audience, not with the poster. The method is the classic sequence of <em>segment, target, position</em>: split the market, choose who you serve, and decide the distinct idea you want them to remember. (A deeper treatment belongs to ETM201; here we keep it introductory.)</p>
<h4>Who is the audience?</h4>
<p>Describe a typical attendee in a short <em>persona</em>: age, where they live or study, how they spend a weekend, what they follow online, what they pay for, what stops them from buying.</p>
<div class="callout"><strong>Example persona.</strong> Linh, 20, second-year student in Hanoi. Follows indie and pop artists on short-video apps, buys tickets with friends, budget up to about 400,000 VND per outing, worried about transport back at night.</div>
<p>The persona already suggests actions: group discounts, a night-bus partner, content on short video.</p>
<h4>Positioning</h4>
<div class="formula"><span class="lbl">Positioning line</span>For [audience], [event name] is the [category] that offers [main benefit], unlike [alternative], because [reason to believe].</div>
<p>Example: For music-loving students, Campus Echo is the one-night festival where student bands play on a real stage, unlike commercial concerts, because every act is chosen by a student vote.</p>
<h4>One-page marketing plan</h4>` + tbl(['Part', 'Question'], [['Objective', 'How many tickets / registrations by when?'], ['Audience', 'Who exactly (persona)?'], ['Message', 'What single idea and what proof?'], ['Offer', 'Price, tiers, deadlines'], ['Channels', 'Where do they spend attention?'], ['Calendar', 'Teaser, launch, push, last call'], ['Budget', 'Money per channel and who owns it'], ['Measures', 'Reach, clicks, sales per channel']]) + `
<p>See also <a href="` + W + `Event_marketing" target="_blank" rel="noopener">event marketing</a> and, for current practice, the <a href="https://www.eventbrite.com/blog/" target="_blank" rel="noopener">Eventbrite Blog</a>.</p>`,
`<p>Marketing sự kiện bắt đầu từ khán giả, không phải từ tấm poster. Phương pháp là chuỗi kinh điển <em>phân khúc, chọn mục tiêu, định vị</em>: chia thị trường, chọn người bạn phục vụ và quyết định ý tưởng khác biệt muốn họ nhớ. (Phần sâu thuộc ETM201; ở đây ta giữ ở mức nhập môn.)</p>
<h4>Khán giả là ai?</h4>
<p>Mô tả một người tham dự điển hình bằng một <em>persona</em> ngắn: tuổi, nơi ở hoặc học, cách dùng cuối tuần, theo dõi gì trên mạng, trả tiền cho gì, điều gì ngăn họ mua.</p>
<div class="callout"><strong>Persona ví dụ.</strong> Linh, 20 tuổi, sinh viên năm hai ở Hà Nội. Theo dõi nghệ sĩ indie và pop trên ứng dụng video ngắn, mua vé cùng bạn bè, ngân sách mỗi lần đi chơi tối đa khoảng 400.000 đồng, lo chuyện về nhà buổi tối.</div>
<p>Persona đã gợi ra hành động: giảm giá nhóm, đối tác xe buýt đêm, nội dung video ngắn.</p>
<h4>Định vị</h4>
<div class="formula"><span class="lbl">Dòng định vị</span>Dành cho [khán giả], [tên sự kiện] là [loại hình] mang lại [lợi ích chính], khác với [lựa chọn thay thế], vì [lý do tin].</div>
<p>Ví dụ: Dành cho sinh viên yêu nhạc, Campus Echo là đêm lễ hội nơi ban nhạc sinh viên chơi trên sân khấu thật, khác với hoà nhạc thương mại, vì mọi tiết mục đều do sinh viên bình chọn.</p>
<h4>Kế hoạch marketing một trang</h4>` + tbl(['Phần', 'Câu hỏi'], [['Mục tiêu', 'Bao nhiêu vé / đăng ký trước khi nào?'], ['Khán giả', 'Chính xác là ai (persona)?'], ['Thông điệp', 'Một ý duy nhất và bằng chứng gì?'], ['Ưu đãi', 'Giá, hạng vé, hạn chót'], ['Kênh', 'Họ dành sự chú ý ở đâu?'], ['Lịch', 'Teaser, mở bán, đẩy mạnh, lời kêu gọi cuối'], ['Ngân sách', 'Tiền cho mỗi kênh và ai phụ trách'], ['Đo lường', 'Phủ, nhấp, bán theo kênh']]) + `
<p>Xem thêm <a href="` + W + `Event_marketing" target="_blank" rel="noopener">marketing sự kiện</a> và, cho thực hành hiện hành, <a href="https://www.eventbrite.com/blog/" target="_blank" rel="noopener">Eventbrite Blog</a>.</p>`],
    pit: ['Targeting "everyone aged 15–50". A message for everyone speaks to no one.', 'Nhắm "mọi người từ 15–50 tuổi". Thông điệp cho mọi người thì không nói với ai.'],
    s: [['Segment, target, position.', 'Phân khúc, chọn mục tiêu, định vị.'], ['A persona turns a vague audience into concrete actions.', 'Persona biến khán giả mơ hồ thành hành động cụ thể.'], ['A one-page plan links objective, message, channels, calendar and measures.', 'Kế hoạch một trang nối mục tiêu, thông điệp, kênh, lịch và đo lường.']],
    l: ['evmk', 'exmk', 'cmk', 'ebblog'],
    p: [['Write a positioning line for a charity run on campus.', 'Viết dòng định vị cho cuộc chạy từ thiện trong trường.', 'Any complete line with audience, benefit, alternative and reason to believe.', 'Mọi dòng đủ đối tượng, lợi ích, lựa chọn thay thế và lý do tin.'],
        ['What action does Linh\'s worry about night transport suggest?', 'Nỗi lo đi lại buổi tối của Linh gợi hành động nào?', 'Partner with a bus or ride service or end the show earlier.', 'Hợp tác xe buýt hoặc dịch vụ gọi xe, hoặc kết thúc sớm hơn.']] }),

  D(P + '6-2', '6.2 Channels and the ticket-sales funnel', '6.2 Các kênh và phễu bán vé',
    'Owned, earned, paid; lịch chiến dịch bán vé; đối tác và người ảnh hưởng.', {
    n: '6.2',
    g: [['Tell owned, earned and paid media apart', 'Phân biệt kênh sở hữu, kiếm được và trả tiền'], ['Plan a ticket-sales campaign calendar', 'Lập lịch chiến dịch bán vé'], ['Choose partners and creators carefully', 'Chọn đối tác và người sáng tạo nội dung cẩn thận']],
    b: [`<p>Most ticket buyers move through a funnel: they hear about the event (<em>awareness</em>), consider it (<em>interest</em>), decide (<em>intent</em>) and buy (<em>action</em>), and later talk about it (<em>advocacy</em>). Each stage needs a different message.</p>
<h4>Three kinds of media</h4>` + tbl(['Type', 'What it is', 'Examples'], [['Owned', 'You control it', 'Event website, email list, own social pages'], ['Earned', 'Others talk about you', 'Press, reviews, fan posts'], ['Paid', 'You pay for reach', 'Ads, sponsored posts, creator fees']]) + `
<h4>Campaign calendar (example for a 6-week sale)</h4>` + tbl(['Week', 'Goal', 'Typical actions'], [['-8 to -6', 'Awareness', 'Teaser, line-up reveals, press note'], ['-6', 'Launch', 'Early-bird opens, email to waiting list'], ['-5 to -3', 'Interest', 'Behind-the-scenes content, artist interviews'], ['-2', 'Intent', 'Deadline reminders, price-step announcements'], ['-1', 'Action', 'Last call, practical guide (transport, rules)'], ['Event week', 'Advocacy', 'Live content, hashtags, user posts']]) + `
<p>Collect a waiting list early: people who leave an email are the cheapest buyers on launch day.</p>
<h4>Partners and creators</h4>
<p>Media partners, universities, clubs and brands can share the event with their own audiences. <a href="` + W + `Influencer_marketing" target="_blank" rel="noopener">Influencer marketing</a> works when the creator's audience matches your persona; agree what is delivered, label paid posts clearly and check follower quality rather than only counting followers.</p>
<h4>Measure by channel</h4>
<p>Give each channel its own link or code (for example a tracked URL) so you can see tickets by source and move the budget to what works. Also read <a href="` + W + `Social_media_marketing" target="_blank" rel="noopener">social media marketing</a> for platform basics.</p>`,
`<p>Đa số người mua vé đi qua một phễu: nghe về sự kiện (<em>nhận biết</em>), cân nhắc (<em>quan tâm</em>), quyết định (<em>ý định</em>) và mua (<em>hành động</em>), rồi nói về nó (<em>lan tỏa</em>). Mỗi giai đoạn cần thông điệp khác nhau.</p>
<h4>Ba loại kênh</h4>` + tbl(['Loại', 'Là gì', 'Ví dụ'], [['Sở hữu (owned)', 'Bạn kiểm soát', 'Website sự kiện, danh sách email, trang mạng xã hội riêng'], ['Kiếm được (earned)', 'Người khác nói về bạn', 'Báo chí, đánh giá, bài của fan'], ['Trả tiền (paid)', 'Bạn trả để có độ phủ', 'Quảng cáo, bài tài trợ, phí người sáng tạo nội dung']]) + `
<h4>Lịch chiến dịch (ví dụ cho đợt bán 6 tuần)</h4>` + tbl(['Tuần', 'Mục tiêu', 'Hành động điển hình'], [['-8 đến -6', 'Nhận biết', 'Teaser, công bố đội hình, thông cáo báo chí'], ['-6', 'Mở bán', 'Mở vé sớm, email cho danh sách chờ'], ['-5 đến -3', 'Quan tâm', 'Nội dung hậu trường, phỏng vấn nghệ sĩ'], ['-2', 'Ý định', 'Nhắc hạn chót, thông báo bước tăng giá'], ['-1', 'Hành động', 'Lời kêu gọi cuối, hướng dẫn thực tế (đi lại, nội quy)'], ['Tuần diễn ra', 'Lan tỏa', 'Nội dung trực tiếp, hashtag, bài của người dùng']]) + `
<p>Thu danh sách chờ từ sớm: người để lại email là người mua rẻ nhất vào ngày mở bán.</p>
<h4>Đối tác và người sáng tạo nội dung</h4>
<p>Đối tác truyền thông, trường đại học, câu lạc bộ và thương hiệu có thể chia sẻ sự kiện với khán giả của họ. <a href="` + W + `Influencer_marketing" target="_blank" rel="noopener">Marketing người ảnh hưởng</a> hiệu quả khi khán giả của họ khớp persona của bạn; thoả thuận rõ sản phẩm bàn giao, ghi nhãn bài trả tiền và kiểm chất lượng người theo dõi thay vì chỉ đếm số lượng.</p>
<h4>Đo theo kênh</h4>
<p>Cho mỗi kênh một đường dẫn hoặc mã riêng (ví dụ URL có theo dõi) để thấy số vé theo nguồn và chuyển ngân sách sang kênh hiệu quả. Đọc thêm <a href="` + W + `Social_media_marketing" target="_blank" rel="noopener">marketing trên mạng xã hội</a> cho kiến thức nền tảng.</p>`],
    pit: ['Posting the same message at every stage. Awareness content cannot close a sale; last-call content cannot build interest.', 'Đăng cùng thông điệp ở mọi giai đoạn. Nội dung nhận biết không chốt được đơn; nội dung kêu gọi cuối không tạo được quan tâm.'],
    s: [['Funnel: awareness, interest, intent, action, advocacy.', 'Phễu: nhận biết, quan tâm, ý định, hành động, lan tỏa.'], ['Owned, earned and paid media work together.', 'Kênh sở hữu, kiếm được và trả tiền phối hợp với nhau.'], ['Track tickets by channel and move budget to what works.', 'Theo dõi vé theo kênh và dồn ngân sách vào kênh hiệu quả.']],
    l: ['influ', 'smm', 'cmk', 'evmk'],
    p: [['Is a newspaper review owned, earned or paid media?', 'Bài đánh giá trên báo là kênh sở hữu, kiếm được hay trả tiền?', 'Earned media.', 'Kênh kiếm được.'],
        ['Why start a waiting list before launch?', 'Vì sao lập danh sách chờ trước khi mở bán?', 'It gives you warm, cheap buyers on launch day and shows demand.', 'Có người mua nóng, rẻ vào ngày mở bán và chứng minh nhu cầu.']] }),

  D(P + '6-3', '6.3 PR, social media and communication during and after', '6.3 PR, mạng xã hội và truyền thông trong và sau sự kiện',
    'Thông cáo, quản lý hình ảnh, truyền thông ngày diễn ra, khủng hoảng ở mức nhập môn, truyền thông sau sự kiện.', {
    n: '6.3',
    g: [['Write a short press release structure', 'Nắm cấu trúc thông cáo báo chí ngắn'], ['Plan live communication on event day', 'Lập kế hoạch truyền thông trực tiếp ngày diễn ra'], ['Respond to a communication problem calmly', 'Phản ứng bình tĩnh với sự cố truyền thông']],
    b: [`<h4>Press and public relations</h4>
<p><a href="` + W + `Public_relations" target="_blank" rel="noopener">Public relations</a> builds trust through information that others choose to share. A press release should be one page and answer who, what, when, where, why; include a quote, an image link, and a contact. Send it to journalists who cover your topic, with the story written for their readers.</p>
<h4>Event day communication</h4>
<ul><li>Name one person as the voice of the event on social media.</li>
<li>Prepare a content plan: arrivals, set-up shots, highlight moments, thank-yous.</li>
<li>Announce practical information through the same channels (gates, delays, weather, lost and found).</li>
<li>Use a signed hashtag and repost guest content with permission.</li></ul>
<h4>When something goes wrong</h4>
<p>A rumour, a delay or an accident spreads fast. A basic response order: verify the facts; make the people safe; say what you know and what you do not; give the next update time; correct mistakes plainly. Delete nothing that you may need later and do not argue with guests. Detailed crisis planning belongs to the risk subject (ERM301c); Chapter 7 gives a first view.</p>
<h4>After the event</h4>
<p>Thank guests, sponsors and volunteers within days. Publish a short highlight and a few numbers (only those you can support). Ask for feedback in the same message. This turns attendees into a waiting list for next year and gives sponsors material for their reports. Live-stream or recorded content extends the life of the event; see <a href="` + W + `Live_streaming" target="_blank" rel="noopener">live streaming</a> for the technology basics.</p>
<div class="callout"><strong>Rule of honesty.</strong> Never claim attendance, awards or partners you do not have. Photos and numbers can be checked, and a single false claim can damage the whole brand.</div>`,
`<h4>Báo chí và quan hệ công chúng</h4>
<p><a href="` + W + `Public_relations" target="_blank" rel="noopener">Quan hệ công chúng</a> xây dựng niềm tin bằng thông tin mà người khác chọn chia sẻ. Thông cáo báo chí nên dài một trang và trả lời ai, cái gì, khi nào, ở đâu, vì sao; kèm một trích dẫn, đường dẫn ảnh và đầu mối liên hệ. Gửi cho phóng viên phụ trách chủ đề của bạn, với câu chuyện viết cho độc giả của họ.</p>
<h4>Truyền thông ngày diễn ra</h4>
<ul><li>Chỉ định một người làm tiếng nói của sự kiện trên mạng xã hội.</li>
<li>Chuẩn bị kế hoạch nội dung: khách đến, cảnh dựng, khoảnh khắc nổi bật, lời cảm ơn.</li>
<li>Thông báo thông tin thực tế qua cùng các kênh (cổng vào, trễ giờ, thời tiết, đồ thất lạc).</li>
<li>Dùng hashtag thống nhất và đăng lại nội dung của khách khi được phép.</li></ul>
<h4>Khi có sự cố</h4>
<p>Tin đồn, chậm trễ hay tai nạn lan rất nhanh. Thứ tự phản ứng cơ bản: xác minh sự thật; bảo đảm an toàn cho người; nói điều bạn biết và điều chưa biết; hẹn giờ cập nhật tiếp theo; sửa sai thẳng thắn. Đừng xoá thứ có thể cần sau này và đừng tranh cãi với khách. Kế hoạch khủng hoảng chi tiết thuộc môn rủi ro (ERM301c); Chương 7 cho cái nhìn đầu tiên.</p>
<h4>Sau sự kiện</h4>
<p>Cảm ơn khách, nhà tài trợ và tình nguyện viên trong vài ngày. Đăng một bản tổng hợp ngắn và vài con số (chỉ những số bạn chứng minh được). Xin phản hồi trong cùng thông điệp. Điều này biến người tham dự thành danh sách chờ cho năm sau và cho nhà tài trợ tư liệu báo cáo. Nội dung phát trực tiếp hoặc ghi hình kéo dài đời sống của sự kiện; xem <a href="` + W + `Live_streaming" target="_blank" rel="noopener">livestream</a> cho kiến thức công nghệ cơ bản.</p>
<div class="callout"><strong>Quy tắc trung thực.</strong> Không bao giờ nhận số khách, giải thưởng hay đối tác mà bạn không có. Ảnh và con số có thể bị kiểm chứng, và một tuyên bố sai có thể làm hỏng cả thương hiệu.</div>`],
    pit: ['Silence during a problem. Guests fill the gap with rumours; a short, honest update is better than none.', 'Im lặng khi có sự cố. Khách sẽ lấp khoảng trống bằng tin đồn; một cập nhật ngắn, trung thực tốt hơn không có gì.'],
    s: [['A press release answers who, what, when, where, why, in one page.', 'Thông cáo trả lời ai, cái gì, khi nào, ở đâu, vì sao trong một trang.'], ['Name one voice and prepare a content plan for event day.', 'Chỉ định một tiếng nói và chuẩn bị kế hoạch nội dung ngày diễn ra.'], ['Respond calmly: verify, protect people, update honestly. Thank and share results afterwards.', 'Phản ứng bình tĩnh: xác minh, bảo vệ người, cập nhật trung thực. Sau đó cảm ơn và chia sẻ kết quả.']],
    l: ['pr', 'live', 'smm', 'hybrid'],
    p: [['List the five questions a press release answers.', 'Liệt kê năm câu hỏi thông cáo báo chí trả lời.', 'Who, what, when, where, why.', 'Ai, cái gì, khi nào, ở đâu, vì sao.'],
        ['What is the first step when a rumour about an accident spreads?', 'Bước đầu tiên khi tin đồn về tai nạn lan ra là gì?', 'Verify the facts and make sure people are safe.', 'Xác minh sự thật và bảo đảm mọi người an toàn.']] }),

  Q(P + 'quiz-6', 'Chapter 6 quiz — Marketing and communications', 'Quiz Chương 6 — Marketing và truyền thông', [
    ['Segmenting, targeting, positioning means…|||Phân khúc, chọn mục tiêu, định vị nghĩa là…', ['Split the market, choose who to serve, define a distinct idea|||Chia thị trường, chọn đối tượng phục vụ, xác định ý tưởng khác biệt', 'Print, distribute, post|||In, phát, đăng', 'Sell, ship, sign|||Bán, giao, ký', 'Plan, pay, pack|||Lên kế hoạch, trả tiền, đóng gói'], 0, 'This is the classic marketing sequence.|||Đây là chuỗi marketing kinh điển.'],
    ['A persona is…|||Persona là…', ['A short description of a typical attendee|||Mô tả ngắn về một người tham dự điển hình', 'A sponsor logo|||Logo nhà tài trợ', 'A stage plan|||Sơ đồ sân khấu', 'A contract clause|||Một điều khoản hợp đồng'], 0, 'It makes the audience concrete.|||Nó làm khán giả cụ thể.'],
    ['Press coverage of your event is…|||Việc báo chí đưa tin về sự kiện là…', ['Earned media|||Kênh kiếm được', 'Owned media|||Kênh sở hữu', 'Paid media|||Kênh trả tiền', 'No media|||Không phải kênh'], 0, 'Others choose to talk about you.|||Người khác chọn nói về bạn.'],
    ['Your own email list is…|||Danh sách email của bạn là…', ['Owned media|||Kênh sở hữu', 'Earned media|||Kênh kiếm được', 'Paid media|||Kênh trả tiền', 'Rented media|||Kênh thuê'], 0, 'You control it.|||Bạn kiểm soát nó.'],
    ['Why create a waiting list?|||Vì sao lập danh sách chờ?', ['It gives cheap, warm buyers at launch|||Có người mua nóng, rẻ lúc mở bán', 'It lowers ticket price|||Hạ giá vé', 'It replaces marketing|||Thay thế marketing', 'It avoids permits|||Tránh giấy phép'], 0, 'It also proves demand.|||Nó cũng chứng minh nhu cầu.'],
    ['A good influencer match means…|||Chọn người ảnh hưởng phù hợp nghĩa là…', ['Their audience matches your persona|||Khán giả của họ khớp persona của bạn', 'They have the most followers|||Họ có nhiều người theo dõi nhất', 'They are cheap|||Họ rẻ', 'They are famous abroad only|||Họ chỉ nổi ở nước ngoài'], 0, 'Fit beats raw numbers.|||Độ khớp quan trọng hơn con số thô.'],
    ['During a rumour about an accident, the first step is…|||Khi có tin đồn tai nạn, bước đầu là…', ['Verify facts and ensure safety|||Xác minh sự thật và bảo đảm an toàn', 'Delete all comments|||Xoá mọi bình luận', 'Blame guests|||Đổ lỗi cho khách', 'Ignore it|||Phớt lờ'], 0, 'Then update honestly.|||Sau đó cập nhật trung thực.'],
    ['After the event you should…|||Sau sự kiện bạn nên…', ['Thank people, share verified results, ask for feedback|||Cảm ơn mọi người, chia sẻ kết quả đã kiểm, xin phản hồi', 'Stay silent|||Im lặng', 'Delete all photos|||Xoá hết ảnh', 'Invent attendance numbers|||Bịa số khách'], 0, 'This feeds next year\'s sales.|||Điều này nuôi doanh số năm sau.']
  ]),
]));
// ===== Chương 7 =====
secs.push(SEC('Chapter 7 — Operations and risk', 'Chương 7 — Vận hành và rủi ro',
  'Từ kế hoạch đến chương trình (run of show), an toàn đám đông và sổ rủi ro ở mức nhập môn.', [
  D(P + '7-1', '7.1 From plan to show: production and run of show', '7.1 Từ kế hoạch đến chương trình: sản xuất và run of show',
    'Dựng – diễn – tháo, run of show, bảng cue, tổng duyệt và liên lạc (nhập môn).', {
    n: '7.1',
    g: [['Describe load-in, show and strike', 'Mô tả dựng, diễn và tháo'], ['Read a simple run of show', 'Đọc một run of show đơn giản'], ['Explain why rehearsals and briefings matter', 'Giải thích vì sao tổng duyệt và tập huấn quan trọng']],
    b: [`<p>Operations is where the plan meets reality. Detailed production practice is the topic of EPO201; this lesson gives the vocabulary and the logic.</p>
<h4>Three stages on site</h4>
<ul><li><strong>Load-in / set-up:</strong> deliver and build the stage, <a href="` + W + `Sound_reinforcement_system" target="_blank" rel="noopener">sound</a>, light, screens, barriers, signs, power.</li>
<li><strong>Show:</strong> doors open, programme runs, services operate.</li>
<li><strong>Strike / load-out:</strong> remove equipment, clean, return the venue; often as long and as risky as the build.</li></ul>
<h4>Run of show</h4>
<p>The <em>run of show</em> is a minute-by-minute script of the day. Everyone works from the same version.</p>` + tbl(['Time', 'What', 'Who', 'Notes'], [['14:00', 'Sound check', 'Production', 'Headline act soundcheck first'], ['17:30', 'Staff briefing', 'Event manager', 'Gates, radios, emergency plan'], ['18:00', 'Doors open', 'Security, ticketing', 'Scan QR; bag checks'], ['19:00', 'MC welcome', 'Stage manager', 'Cue 1: house lights down'], ['19:10', 'Act 1 (30 min)', 'Stage manager', 'Cue 2: lights up on band'], ['21:30', 'Final act ends', 'Stage manager', 'Cue: house lights up, exit message'], ['21:45', 'Exit and transport', 'Logistics', 'Marshals at exits']]) + `
<p>The stage manager calls the cues from the cue sheet; no one else should give conflicting instructions to the crew.</p>
<h4>Rehearsal and briefing</h4>
<p>A technical rehearsal checks equipment and timing; a dress rehearsal runs the whole show. A staff briefing tells each team its tasks, the chain of command and what to do in an emergency. Short, clear <em>radio discipline</em> (who talks to whom) avoids chaos.</p>
<h4>Worked example: timing check</h4>
<p>Three acts of 30 minutes each with 10-minute changeovers last 3×30 + 2×10 = 110 minutes. If the MC takes 10 minutes at the start and 5 at the end, the show lasts 125 minutes. Doors at 18:00 and start at 19:00 end at about 21:05; allow 30 minutes of margin for delays before the venue's hard curfew.</p>`,
`<p>Vận hành là nơi kế hoạch gặp thực tế. Thực hành sản xuất chi tiết là chủ đề của EPO201; bài này cho thuật ngữ và logic.</p>
<h4>Ba giai đoạn tại chỗ</h4>
<ul><li><strong>Dựng (load-in):</strong> chuyển đến và dựng sân khấu, <a href="` + W + `Sound_reinforcement_system" target="_blank" rel="noopener">âm thanh</a>, ánh sáng, màn hình, rào chắn, biển báo, điện.</li>
<li><strong>Diễn (show):</strong> mở cửa, chương trình chạy, các dịch vụ hoạt động.</li>
<li><strong>Tháo (strike/load-out):</strong> dỡ thiết bị, dọn dẹp, trả địa điểm; thường dài và rủi ro như lúc dựng.</li></ul>
<h4>Run of show</h4>
<p><em>Run of show</em> là kịch bản từng phút của cả ngày. Mọi người làm việc theo cùng một phiên bản.</p>` + tbl(['Giờ', 'Việc', 'Ai', 'Ghi chú'], [['14:00', 'Thử âm', 'Sản xuất', 'Nghệ sĩ chính thử trước'], ['17:30', 'Họp nhân sự', 'Quản lý sự kiện', 'Cổng, bộ đàm, kế hoạch khẩn cấp'], ['18:00', 'Mở cửa', 'An ninh, bán vé', 'Quét QR; kiểm tra túi'], ['19:00', 'MC chào', 'Stage manager', 'Cue 1: tắt đèn khán phòng'], ['19:10', 'Tiết mục 1 (30 phút)', 'Stage manager', 'Cue 2: bật đèn lên ban nhạc'], ['21:30', 'Tiết mục cuối kết thúc', 'Stage manager', 'Cue: bật đèn khán phòng, thông báo ra về'], ['21:45', 'Ra về và giao thông', 'Hậu cần', 'Nhân viên hướng dẫn ở lối ra']]) + `
<p>Stage manager gọi cue theo bảng cue; không ai khác được đưa chỉ dẫn mâu thuẫn cho đội kỹ thuật.</p>
<h4>Tổng duyệt và tập huấn</h4>
<p>Buổi tổng duyệt kỹ thuật kiểm thiết bị và thời gian; buổi tổng duyệt trang phục chạy toàn bộ chương trình. Buổi họp nhân sự giao việc cho từng đội, chuỗi chỉ huy và việc cần làm khi khẩn cấp. <em>Kỷ luật bộ đàm</em> ngắn, rõ (ai nói với ai) giúp tránh hỗn loạn.</p>
<h4>Ví dụ giải từng bước: kiểm tra thời lượng</h4>
<p>Ba tiết mục 30 phút mỗi tiết mục, nghỉ chuyển cảnh 10 phút, kéo dài 3×30 + 2×10 = 110 phút. Nếu MC mất 10 phút đầu và 5 phút cuối thì chương trình dài 125 phút. Mở cửa 18:00, bắt đầu 19:00 sẽ kết thúc khoảng 21:05; chừa 30 phút dư trước giờ giới nghiêm cứng của địa điểm.</p>`],
    pit: ['Treating strike as an afterthought. Tired crews, darkness and heavy equipment make the take-down a common time for accidents; plan it.', 'Coi việc tháo là phần phụ. Đội mệt, trời tối và thiết bị nặng khiến lúc tháo hay xảy ra tai nạn; hãy lập kế hoạch cho nó.'],
    s: [['Three on-site stages: load-in, show, strike.', 'Ba giai đoạn tại chỗ: dựng, diễn, tháo.'], ['The run of show is one shared minute-by-minute script; the stage manager calls cues.', 'Run of show là kịch bản từng phút dùng chung; stage manager gọi cue.'], ['Rehearsals and briefings turn a plan into a team habit.', 'Tổng duyệt và tập huấn biến kế hoạch thành thói quen của đội.']],
    l: ['stagem', 'sound', 'conc', 'hse'],
    p: [['Four acts of 25 minutes with 10-minute changeovers: total running time?', 'Bốn tiết mục 25 phút, nghỉ chuyển cảnh 10 phút: tổng thời lượng?', '4×25 + 3×10 = 130 minutes.', '4×25 + 3×10 = 130 phút.'],
        ['Who should give instructions to the crew during the show?', 'Ai nên đưa chỉ dẫn cho đội kỹ thuật trong chương trình?', 'The stage manager, from the cue sheet.', 'Stage manager, theo bảng cue.']] }),

  D(P + '7-2', '7.2 Crowd safety and guest welfare', '7.2 An toàn đám đông và chăm sóc khách',
    'Nguyên tắc quản lý đám đông, sức chứa, lối vào – ra, y tế; bài học từ Astroworld 2021 (nhập môn).', {
    n: '7.2',
    g: [['Explain why capacity and flow matter', 'Giải thích vì sao sức chứa và luồng di chuyển quan trọng'], ['List the basic safety services', 'Liệt kê các dịch vụ an toàn cơ bản'], ['Learn from a crowd-safety tragedy responsibly', 'Rút bài học từ một thảm hoạ đám đông một cách có trách nhiệm']],
    b: [`<p>The first duty of an organiser is that guests go home safe. <a href="` + W + `Crowd_management" target="_blank" rel="noopener">Crowd management</a> is the planning and control of people's movement and density; the UK <a href="https://www.hse.gov.uk/event-safety/" target="_blank" rel="noopener">HSE event safety</a> pages offer free guidance whose principles apply anywhere. Detailed method is in the risk subject (ERM301c).</p>
<h4>Four basic ideas</h4>
<ul><li><strong>Capacity:</strong> never sell or admit more people than the safe limit set for the venue and area. Count entries.</li>
<li><strong>Flow:</strong> design entry, queues, circulation and exits so people never meet in a bottleneck. Exits must be marked, clear and large enough.</li>
<li><strong>Density:</strong> watch the area in front of stages, where people press together. Barriers and monitoring help.</li>
<li><strong>Information:</strong> clear signs, announcements and trained staff who can stop the show if needed.</li></ul>
<h4>Services on site</h4>` + tbl(['Service', 'Purpose'], [['First aid and medical', 'Treat injuries, handle heat, alcohol and drugs cases, link to ambulances'], ['Security and stewards', 'Search, access control, crowd watch, support to police'], ['Water and shade', 'Prevent heat illness; free water is a safety measure'], ['Welfare and lost children point', 'Support for distressed or separated guests'], ['Communications centre', 'One control room to see, decide and tell everyone'], ['Accessibility', 'Routes, viewing areas and toilets for disabled guests']]) + `
<h4>Case: Astroworld Festival, Houston, 2021</h4>
<p>At the 2021 Astroworld Festival, a <a href="` + W + `Crowd_crush" target="_blank" rel="noopener">crowd crush</a> in front of the main stage killed ten people and injured many more (<a href="` + W + `Astroworld_Festival_crowd_crush" target="_blank" rel="noopener">overview</a>). Investigations and legal cases examined crowd density, the ability to stop the show, communication between teams and emergency response. Without judging any party, the learning points for students are general: plan density and exits for the real crowd, give the safety lead authority to stop the show, and have one clear line of command.</p>
<div class="callout"><strong>Reminder.</strong> This course gives awareness, not certification. Real events need qualified safety professionals and the permits of the local authority.</div>`,
`<p>Nhiệm vụ đầu tiên của người tổ chức là khách về nhà an toàn. <a href="` + W + `Crowd_management" target="_blank" rel="noopener">Quản lý đám đông</a> là lập kế hoạch và kiểm soát sự di chuyển và mật độ của con người; trang <a href="https://www.hse.gov.uk/event-safety/" target="_blank" rel="noopener">HSE (Anh) về an toàn sự kiện</a> có hướng dẫn miễn phí với nguyên tắc dùng được ở mọi nơi. Phương pháp chi tiết nằm ở môn rủi ro (ERM301c).</p>
<h4>Bốn ý cơ bản</h4>
<ul><li><strong>Sức chứa:</strong> không bao giờ bán hay cho vào nhiều hơn giới hạn an toàn đã đặt cho địa điểm và khu vực. Đếm lượt vào.</li>
<li><strong>Luồng di chuyển:</strong> thiết kế lối vào, hàng chờ, đường đi và lối thoát sao cho mọi người không gặp nhau ở nút cổ chai. Lối thoát phải có biển, thông thoáng và đủ rộng.</li>
<li><strong>Mật độ:</strong> theo dõi khu vực trước sân khấu, nơi người ép sát nhau. Rào chắn và giám sát giúp ích.</li>
<li><strong>Thông tin:</strong> biển báo rõ, thông báo và nhân viên được huấn luyện, có thể dừng chương trình khi cần.</li></ul>
<h4>Dịch vụ tại chỗ</h4>` + tbl(['Dịch vụ', 'Mục đích'], [['Sơ cứu và y tế', 'Xử trí chấn thương, say nóng, rượu và chất kích thích, kết nối xe cấp cứu'], ['An ninh và nhân viên hướng dẫn', 'Kiểm tra, kiểm soát ra vào, quan sát đám đông, hỗ trợ công an'], ['Nước và bóng râm', 'Phòng say nóng; nước miễn phí là biện pháp an toàn'], ['Điểm chăm sóc và trẻ lạc', 'Hỗ trợ khách hoảng loạn hoặc lạc nhau'], ['Trung tâm điều hành', 'Một phòng điều khiển để thấy, quyết định và thông báo cho mọi người'], ['Hỗ trợ người khuyết tật', 'Lối đi, khu xem và nhà vệ sinh cho khách khuyết tật']]) + `
<h4>Tình huống: Astroworld Festival, Houston, 2021</h4>
<p>Tại Astroworld Festival năm 2021, một vụ <a href="` + W + `Crowd_crush" target="_blank" rel="noopener">dồn ép đám đông</a> trước sân khấu chính khiến mười người chết và nhiều người bị thương (<a href="` + W + `Astroworld_Festival_crowd_crush" target="_blank" rel="noopener">tổng quan</a>). Các cuộc điều tra và vụ kiện xem xét mật độ đám đông, khả năng dừng chương trình, liên lạc giữa các đội và phản ứng khẩn cấp. Không quy lỗi cho ai, các điểm học cho sinh viên là chung: tính mật độ và lối thoát theo đám đông thật, trao cho người phụ trách an toàn quyền dừng chương trình, và có một chuỗi chỉ huy rõ ràng.</p>
<div class="callout"><strong>Nhắc lại.</strong> Khoá này cho nhận thức, không phải chứng chỉ. Sự kiện thật cần chuyên gia an toàn đủ điều kiện và giấy phép của chính quyền địa phương.</div>`],
    pit: ['Treating safety as the security guards\' problem. Capacity, layout and authority to stop the show are management decisions.', 'Coi an toàn là chuyện của bảo vệ. Sức chứa, bố cục và quyền dừng chương trình là quyết định quản lý.'],
    s: [['Capacity, flow, density and information are the core ideas.', 'Sức chứa, luồng, mật độ và thông tin là các ý cốt lõi.'], ['Provide medical, security, water, welfare, control room and accessibility.', 'Bố trí y tế, an ninh, nước, chăm sóc, phòng điều hành và hỗ trợ khuyết tật.'], ['Astroworld 2021: plan for the real crowd and give someone authority to stop the show.', 'Astroworld 2021: tính theo đám đông thật và trao ai đó quyền dừng chương trình.']],
    l: ['crowd', 'crush', 'astro', 'hse'],
    p: [['Why do exits need to be as carefully planned as entries?', 'Vì sao lối thoát cần được tính kỹ như lối vào?', 'In an emergency everyone leaves at once; a bottleneck causes injury.', 'Khi khẩn cấp mọi người rời đi cùng lúc; nút cổ chai gây thương tích.'],
        ['Why is free water a safety measure?', 'Vì sao nước miễn phí là biện pháp an toàn?', 'It prevents dehydration and heat illness in crowds.', 'Nó phòng mất nước và say nóng trong đám đông.']] }),

  D(P + '7-3', '7.3 Risk register and contingency planning', '7.3 Sổ rủi ro và kế hoạch dự phòng',
    'Nhận diện rủi ro, chấm khả năng × tác động, biện pháp, kế hoạch B, bảo hiểm (nhập môn).', {
    n: '7.3',
    g: [['Identify risks by category', 'Nhận diện rủi ro theo nhóm'], ['Score risks with likelihood × impact', 'Chấm rủi ro bằng khả năng × tác động'], ['Write a mitigation and contingency plan', 'Viết biện pháp giảm thiểu và kế hoạch dự phòng']],
    b: [`<p><a href="` + W + `Risk_management" target="_blank" rel="noopener">Risk management</a> asks four questions: what could go wrong, how likely, how bad, and what will we do. The result is a <em>risk register</em>, a living table that the team reviews each week. (ERM301c treats this in depth.) A <a href="` + W + `Contingency_plan" target="_blank" rel="noopener">contingency plan</a> is the prepared "plan B" for a risk that happens.</p>
<h4>Common risk groups</h4>
<ul><li>People: crowd, injury, illness, fights, no-shows of staff or performers.</li>
<li>Technical: power failure, sound or light fault, network or ticketing failure.</li>
<li>Environment: rain, heat, storm, flood, air quality.</li>
<li>Financial: low ticket sales, supplier failure, currency changes.</li>
<li>Legal and reputation: permit refusal, copyright claim, social media crisis.</li></ul>
<h4>Scoring</h4>
<p>Score likelihood (L) and impact (I) from 1 to 5. The simple rating is L × I.</p>
<div class="formula"><span class="lbl">Risk score</span>Score = Likelihood (1–5) × Impact (1–5); 1–5 low, 6–12 medium, 15–25 high</div>` + tbl(['Risk', 'L', 'I', 'Score', 'Mitigation', 'Contingency'], [['Heavy rain at an outdoor show', '4', '4', '16 (high)', 'Cover stage, drainage, forecast watch', 'Move indoors or delay start; refund policy'], ['Headline act arrives late', '3', '4', '12 (medium)', 'Arrive a day early; backup transport', 'Reorder programme; MC fills'], ['Power failure', '2', '5', '10 (medium)', 'Generator with fuel, tested', 'Switch to backup within minutes'], ['Ticket sales far below plan', '3', '5', '15 (high)', 'Weekly sales review; promos', 'Cut costs, seek sponsor, reduce scope'], ['Crowd surge at the front', '2', '5', '10 (medium)', 'Barriers, density watch, safety lead', 'Stop the show, open exits']]) + `
<p>The table is an illustration. Look at the high scores first, name an owner for each risk, and decide ahead who has the authority to postpone or cancel.</p>
<h4>Insurance and cancellation</h4>
<p>Events can be insured against some risks (public liability, sometimes cancellation); read the exclusions carefully. State in the terms what happens to tickets if the event is cancelled or moved.</p>`,
`<p><a href="` + W + `Risk_management" target="_blank" rel="noopener">Quản trị rủi ro</a> hỏi bốn câu: điều gì có thể hỏng, khả năng bao nhiêu, nặng đến đâu và ta sẽ làm gì. Kết quả là <em>sổ rủi ro</em>, một bảng sống mà đội xem lại hằng tuần. (ERM301c đào sâu phần này.) <a href="` + W + `Contingency_plan" target="_blank" rel="noopener">Kế hoạch dự phòng</a> là "phương án B" đã chuẩn bị cho rủi ro xảy ra.</p>
<h4>Các nhóm rủi ro thường gặp</h4>
<ul><li>Con người: đám đông, thương tích, bệnh, ẩu đả, nhân sự hay nghệ sĩ vắng mặt.</li>
<li>Kỹ thuật: mất điện, hỏng âm thanh hay ánh sáng, lỗi mạng hay hệ thống bán vé.</li>
<li>Môi trường: mưa, nóng, bão, ngập, chất lượng không khí.</li>
<li>Tài chính: bán vé thấp, nhà cung cấp hỏng, biến động tỷ giá.</li>
<li>Pháp lý và danh tiếng: bị từ chối giấy phép, khiếu nại bản quyền, khủng hoảng mạng xã hội.</li></ul>
<h4>Chấm điểm</h4>
<p>Chấm khả năng (L) và tác động (I) từ 1 đến 5. Điểm đơn giản là L × I.</p>
<div class="formula"><span class="lbl">Điểm rủi ro</span>Điểm = Khả năng (1–5) × Tác động (1–5); 1–5 thấp, 6–12 trung bình, 15–25 cao</div>` + tbl(['Rủi ro', 'L', 'I', 'Điểm', 'Giảm thiểu', 'Dự phòng'], [['Mưa lớn ở show ngoài trời', '4', '4', '16 (cao)', 'Mái che sân khấu, thoát nước, theo dõi dự báo', 'Chuyển vào trong hoặc lùi giờ; chính sách hoàn vé'], ['Nghệ sĩ chính đến muộn', '3', '4', '12 (trung bình)', 'Đến sớm một ngày; xe dự phòng', 'Đảo chương trình; MC lấp chỗ'], ['Mất điện', '2', '5', '10 (trung bình)', 'Máy phát có nhiên liệu, đã thử', 'Chuyển sang nguồn dự phòng trong vài phút'], ['Vé bán thấp xa kế hoạch', '3', '5', '15 (cao)', 'Rà doanh số hằng tuần; khuyến mãi', 'Cắt chi phí, tìm tài trợ, thu hẹp quy mô'], ['Đám đông xô đẩy phía trước', '2', '5', '10 (trung bình)', 'Rào chắn, theo dõi mật độ, người phụ trách an toàn', 'Dừng chương trình, mở lối thoát']]) + `
<p>Bảng chỉ để minh hoạ. Xem điểm cao trước, đặt người phụ trách cho từng rủi ro và quyết định trước ai có quyền hoãn hoặc huỷ.</p>
<h4>Bảo hiểm và huỷ sự kiện</h4>
<p>Sự kiện có thể được bảo hiểm cho một số rủi ro (trách nhiệm công cộng, đôi khi huỷ sự kiện); đọc kỹ điều khoản loại trừ. Nêu trong điều kiện bán vé điều gì xảy ra với vé nếu sự kiện bị huỷ hay dời.</p>`],
    pit: ['A register written once and never reviewed. Risks change as the date nears; review it every week.', 'Sổ rủi ro viết một lần rồi không xem lại. Rủi ro đổi khi ngày diễn đến gần; hãy rà mỗi tuần.'],
    s: [['Risk = what could go wrong, likelihood, impact, response.', 'Rủi ro = điều có thể hỏng, khả năng, tác động, cách ứng phó.'], ['Score = L × I; handle high scores first and name owners.', 'Điểm = L × I; xử lý điểm cao trước và gán người phụ trách.'], ['Decide in advance who may postpone or cancel.', 'Quyết định trước ai có quyền hoãn hay huỷ.']],
    l: ['risk', 'rass', 'cont', 'insur'],
    p: [['A risk has L = 3 and I = 4. What is the score and rating?', 'Một rủi ro có L = 3 và I = 4. Điểm và mức?', '12, medium.', '12, trung bình.'],
        ['Give one mitigation and one contingency for rain at an outdoor show.', 'Nêu một biện pháp giảm thiểu và một dự phòng cho mưa ở show ngoài trời.', 'Mitigation: cover the stage and drain. Contingency: move indoors or delay start.', 'Giảm thiểu: che sân khấu và thoát nước. Dự phòng: chuyển vào trong hoặc lùi giờ bắt đầu.']] }),

  Q(P + 'quiz-7', 'Chapter 7 quiz — Operations and risk', 'Quiz Chương 7 — Vận hành và rủi ro', [
    ['A run of show is…|||Run of show là…', ['A minute-by-minute script for the day|||Kịch bản từng phút của cả ngày', 'A ticket price list|||Bảng giá vé', 'A sponsor contract|||Hợp đồng tài trợ', 'A seating chart only|||Chỉ sơ đồ chỗ ngồi'], 0, 'Everyone shares one version.|||Mọi người dùng chung một phiên bản.'],
    ['Strike (load-out) means…|||Strike (tháo) nghĩa là…', ['Removing equipment and returning the venue|||Dỡ thiết bị và trả địa điểm', 'A worker protest|||Cuộc đình công', 'Opening the doors|||Mở cửa', 'Starting the show|||Bắt đầu chương trình'], 0, 'It can be as risky as the build.|||Nó có thể rủi ro như lúc dựng.'],
    ['Three acts of 30 minutes with two 10-minute changeovers last…|||Ba tiết mục 30 phút với hai lần nghỉ 10 phút kéo dài…', ['110 minutes|||110 phút', '90 minutes|||90 phút', '100 minutes|||100 phút', '120 minutes|||120 phút'], 0, '3×30 + 2×10 = 110.|||3×30 + 2×10 = 110.'],
    ['Who calls cues in a live show?|||Ai gọi cue trong chương trình trực tiếp?', ['The stage manager|||Stage manager', 'The sponsor|||Nhà tài trợ', 'The ticket buyer|||Người mua vé', 'The caterer|||Nhà cung cấp ăn uống'], 0, 'One voice avoids conflicting orders.|||Một tiếng nói tránh mệnh lệnh mâu thuẫn.'],
    ['The four core crowd-safety ideas are…|||Bốn ý an toàn đám đông cốt lõi là…', ['Capacity, flow, density, information|||Sức chứa, luồng, mật độ, thông tin', 'Colour, taste, price, name|||Màu, vị, giá, tên', 'Music, light, snow, fog|||Nhạc, đèn, tuyết, sương', 'Chairs, tables, cups, plates|||Ghế, bàn, ly, đĩa'], 0, 'They guide layout and operations.|||Chúng dẫn dắt bố cục và vận hành.'],
    ['Risk score is…|||Điểm rủi ro là…', ['Likelihood × Impact|||Khả năng × Tác động', 'Likelihood + Impact|||Khả năng + Tác động', 'Cost ÷ Time|||Chi phí ÷ Thời gian', 'Price × Capacity|||Giá × Sức chứa'], 0, 'Both scaled 1 to 5.|||Cả hai theo thang 1 đến 5.'],
    ['Likelihood 4 and impact 4 give…|||Khả năng 4 và tác động 4 cho…', ['16, high|||16, cao', '8, low|||8, thấp', '12, medium|||12, trung bình', '4, low|||4, thấp'], 0, '4×4 = 16.|||4×4 = 16.'],
    ['A contingency plan is…|||Kế hoạch dự phòng là…', ['A prepared plan B if a risk occurs|||Phương án B đã chuẩn bị nếu rủi ro xảy ra', 'A discount code|||Mã giảm giá', 'A seating colour|||Màu chỗ ngồi', 'A thank-you note|||Thư cảm ơn'], 0, 'It is decided before the problem arrives.|||Nó được quyết định trước khi sự cố đến.']
  ]),
]));
// ===== Chương 8 =====
secs.push(SEC('Chapter 8 — Evaluation and careers', 'Chương 8 — Đánh giá và nghề nghiệp',
  'KPI, ROI, NPS, báo cáo sau sự kiện, đạo đức, bền vững và lộ trình nghề nghiệp.', [
  D(P + '8-1', '8.1 Measuring success: KPIs, ROI and satisfaction', '8.1 Đo thành công: KPI, ROI và mức hài lòng',
    'KPI theo mục tiêu, ROI có ví dụ số, NPS và khảo sát sau sự kiện.', {
    n: '8.1',
    g: [['Choose KPIs that match objectives', 'Chọn KPI khớp với mục tiêu'], ['Compute a simple ROI', 'Tính ROI đơn giản'], ['Compute NPS from survey answers', 'Tính NPS từ câu trả lời khảo sát']],
    b: [`<p>You can only judge success against the objectives set in Chapter 4. A <a href="` + W + `Key_performance_indicator" target="_blank" rel="noopener">key performance indicator</a> (KPI) turns an objective into a number you can track.</p>
<h4>Match objective to KPI</h4>` + tbl(['Objective', 'KPI examples'], [['Attendance', 'Tickets sold, check-ins, sell-through % of capacity, no-show rate'], ['Revenue and cost', 'Total income, cost per head, profit or loss versus budget'], ['Sponsor value', 'Sponsor renewals, leads, booth visits, content reach'], ['Experience', 'Satisfaction score, NPS, complaint count, queue times'], ['Safety', 'Incidents, first-aid cases, response time'], ['Reach and image', 'Press items, social reach, sentiment']]) + `
<h4>Return on investment</h4>
<p><a href="` + W + `Return_on_investment" target="_blank" rel="noopener">ROI</a> compares net benefit with cost. The formula is simple, but be explicit about what counts as benefit (money only, or also reach and goodwill).</p>
<div class="formula"><span class="lbl">ROI</span>ROI = (Benefit − Cost) ÷ Cost × 100%</div>
<p>Worked example (VND, illustrative): ticket income 300,000,000 plus sponsorship 150,000,000 gives benefit 450,000,000; total cost 400,000,000. ROI = (450 − 400) ÷ 400 = 12.5%. For a non-profit event the benefit might be donations raised or learning outcomes; define them before the event.</p>
<h4>Satisfaction and NPS</h4>
<p>Ask guests on a 0–10 scale: "How likely are you to recommend this event to a friend?" Promoters score 9–10, passives 7–8, detractors 0–6. The <a href="` + W + `Net_promoter" target="_blank" rel="noopener">Net Promoter Score</a> is the percentage of promoters minus the percentage of detractors.</p>
<div class="formula"><span class="lbl">NPS</span>NPS = % promoters − % detractors</div>
<p>Example: 100 answers, 60 promoters, 25 passives, 15 detractors: NPS = 60 − 15 = +45. Always add one open question (what should we change?) because the comments tell you why. For general satisfaction ideas see <a href="` + W + `Customer_satisfaction" target="_blank" rel="noopener">customer satisfaction</a>.</p>`,
`<p>Bạn chỉ đánh giá được thành công so với mục tiêu đặt ra ở Chương 4. <a href="` + W + `Key_performance_indicator" target="_blank" rel="noopener">Chỉ số đo hiệu quả</a> (KPI) biến mục tiêu thành con số có thể theo dõi.</p>
<h4>Ghép mục tiêu với KPI</h4>` + tbl(['Mục tiêu', 'Ví dụ KPI'], [['Số khách', 'Vé bán, lượt check-in, % sức chứa bán được, tỷ lệ không đến'], ['Thu chi', 'Tổng thu, chi phí mỗi khách, lãi hoặc lỗ so với ngân sách'], ['Giá trị tài trợ', 'Tỷ lệ gia hạn, khách tiềm năng, lượt ghé gian hàng, độ phủ nội dung'], ['Trải nghiệm', 'Điểm hài lòng, NPS, số khiếu nại, thời gian xếp hàng'], ['An toàn', 'Sự cố, ca sơ cứu, thời gian phản ứng'], ['Độ phủ và hình ảnh', 'Số bài báo, độ phủ mạng xã hội, sắc thái bình luận']]) + `
<h4>Tỷ suất hoàn vốn</h4>
<p><a href="` + W + `Return_on_investment" target="_blank" rel="noopener">ROI</a> so lợi ích ròng với chi phí. Công thức đơn giản, nhưng cần nói rõ cái gì tính là lợi ích (chỉ tiền, hay cả độ phủ và thiện cảm).</p>
<div class="formula"><span class="lbl">ROI</span>ROI = (Lợi ích − Chi phí) ÷ Chi phí × 100%</div>
<p>Ví dụ giải từng bước (VND, minh hoạ): thu vé 300.000.000 cộng tài trợ 150.000.000 cho lợi ích 450.000.000; tổng chi phí 400.000.000. ROI = (450 − 400) ÷ 400 = 12,5%. Với sự kiện phi lợi nhuận, lợi ích có thể là tiền quyên góp hay kết quả học tập; hãy định nghĩa trước sự kiện.</p>
<h4>Mức hài lòng và NPS</h4>
<p>Hỏi khách theo thang 0–10: "Bạn có khả năng giới thiệu sự kiện này cho bạn bè đến đâu?" Người ủng hộ (promoter) chấm 9–10, trung lập 7–8, người phê phán (detractor) 0–6. <a href="` + W + `Net_promoter" target="_blank" rel="noopener">Net Promoter Score</a> là phần trăm người ủng hộ trừ phần trăm người phê phán.</p>
<div class="formula"><span class="lbl">NPS</span>NPS = % người ủng hộ − % người phê phán</div>
<p>Ví dụ: 100 câu trả lời, 60 người ủng hộ, 25 trung lập, 15 người phê phán: NPS = 60 − 15 = +45. Luôn thêm một câu hỏi mở (nên thay đổi gì?) vì bình luận cho biết lý do. Về ý tưởng khảo sát chung xem <a href="` + W + `Customer_satisfaction" target="_blank" rel="noopener">mức hài lòng của khách hàng</a>.</p>`],
    pit: ['Reporting only attendance. A full house with long queues and unhappy guests is not success.', 'Chỉ báo cáo số khách. Kín chỗ nhưng xếp hàng dài và khách không vui không phải thành công.'],
    s: [['KPIs turn objectives into numbers.', 'KPI biến mục tiêu thành con số.'], ['ROI = (Benefit − Cost) ÷ Cost; define benefit first.', 'ROI = (Lợi ích − Chi phí) ÷ Chi phí; định nghĩa lợi ích trước.'], ['NPS = % promoters − % detractors; add an open question.', 'NPS = % người ủng hộ − % người phê phán; thêm câu hỏi mở.']],
    l: ['kpi', 'roi', 'nps', 'csat'],
    p: [['Cost 250m, benefit 300m. ROI?', 'Chi phí 250 triệu, lợi ích 300 triệu. ROI?', '(300 − 250) ÷ 250 = 20%.', '(300 − 250) ÷ 250 = 20%.'],
        ['50 answers: 20 promoters, 20 passives, 10 detractors. NPS?', '50 câu trả lời: 20 ủng hộ, 20 trung lập, 10 phê phán. NPS?', '40% − 20% = +20.', '40% − 20% = +20.']] }),

  D(P + '8-2', '8.2 The post-event report and lessons learned', '8.2 Báo cáo sau sự kiện và bài học kinh nghiệm',
    'Đóng sự kiện, khung báo cáo, họp rút kinh nghiệm; mẫu bài tập tổng kết.', {
    n: '8.2',
    g: [['List the close-out tasks', 'Liệt kê các việc đóng sự kiện'], ['Structure a post-event report', 'Cấu trúc một báo cáo sau sự kiện'], ['Run a short lessons-learned meeting', 'Tổ chức buổi họp rút kinh nghiệm ngắn']],
    b: [`<p>The event is not finished when the lights go off. Close-out protects relationships, money and learning.</p>
<h4>Close-out checklist</h4>
<ul><li>Return the venue and equipment; settle damage and deposits.</li>
<li>Pay suppliers and artists as agreed; reconcile ticket income.</li>
<li>Thank guests, sponsors, volunteers and authorities.</li>
<li>Archive contracts, permits, photos and data safely; delete personal data you no longer need.</li>
<li>Send the sponsor report within an agreed time.</li></ul>
<h4>Post-event report: a standard outline</h4>` + tbl(['Section', 'Content'], [['1 Summary', 'Objectives, results in one page'], ['2 Programme', 'What happened versus plan'], ['3 Audience', 'Numbers, profile, satisfaction, NPS'], ['4 Finance', 'Budget versus actual, with explanations'], ['5 Marketing', 'Results by channel'], ['6 Operations and safety', 'Incidents, response, issues'], ['7 Stakeholder feedback', 'Sponsors, partners, volunteers, community'], ['8 Lessons and recommendations', 'Keep, stop, change; owners and dates']]) + `
<h4>Lessons-learned meeting (45 minutes)</h4>
<ol><li>Each department names what went well (5 min each).</li>
<li>Each names what to change, with evidence.</li>
<li>Vote on the top five actions and give each an owner.</li>
<li>Write the notes in a shared document for the next team.</li></ol>
<p>Be careful with blame: ask "what in our process allowed this?" instead of "who did this?".</p>
<h4>Mini capstone for this course</h4>
<p>Design a one-night student event for 300 guests on paper. Deliver: objectives (SMART), persona, positioning line, budget with break-even, sponsor package, marketing calendar, run of show, three top risks with plans, and KPIs. A strong answer links every part back to the objectives.</p>`,
`<p>Sự kiện chưa kết thúc khi tắt đèn. Việc đóng sự kiện bảo vệ các mối quan hệ, tiền bạc và kiến thức học được.</p>
<h4>Danh mục đóng sự kiện</h4>
<ul><li>Trả địa điểm và thiết bị; xử lý hư hại và tiền cọc.</li>
<li>Thanh toán nhà cung cấp và nghệ sĩ như đã thoả thuận; đối soát thu từ vé.</li>
<li>Cảm ơn khách, nhà tài trợ, tình nguyện viên và cơ quan chức năng.</li>
<li>Lưu trữ an toàn hợp đồng, giấy phép, ảnh và dữ liệu; xoá dữ liệu cá nhân không còn cần.</li>
<li>Gửi báo cáo cho nhà tài trợ đúng hạn đã hẹn.</li></ul>
<h4>Báo cáo sau sự kiện: dàn ý chuẩn</h4>` + tbl(['Phần', 'Nội dung'], [['1 Tóm tắt', 'Mục tiêu, kết quả trong một trang'], ['2 Chương trình', 'Điều đã diễn ra so với kế hoạch'], ['3 Khán giả', 'Số lượng, chân dung, mức hài lòng, NPS'], ['4 Tài chính', 'Ngân sách so với thực tế, có giải thích'], ['5 Marketing', 'Kết quả theo kênh'], ['6 Vận hành và an toàn', 'Sự cố, phản ứng, vấn đề'], ['7 Phản hồi các bên liên quan', 'Nhà tài trợ, đối tác, tình nguyện viên, cộng đồng'], ['8 Bài học và đề xuất', 'Giữ, bỏ, đổi; người phụ trách và ngày']]) + `
<h4>Họp rút kinh nghiệm (45 phút)</h4>
<ol><li>Mỗi ban nêu điều tốt (5 phút mỗi ban).</li>
<li>Mỗi ban nêu điều cần đổi, kèm bằng chứng.</li>
<li>Bỏ phiếu chọn năm hành động hàng đầu và gán người phụ trách.</li>
<li>Ghi biên bản vào tài liệu dùng chung cho đội kế tiếp.</li></ol>
<p>Cẩn thận với việc đổ lỗi: hỏi "quy trình của ta đã cho phép điều này xảy ra thế nào?" thay vì "ai làm điều này?".</p>
<h4>Bài tập tổng kết thu nhỏ của khoá</h4>
<p>Thiết kế trên giấy một sự kiện sinh viên một buổi tối cho 300 khách. Sản phẩm: mục tiêu (SMART), persona, dòng định vị, ngân sách có điểm hoà vốn, gói tài trợ, lịch marketing, run of show, ba rủi ro hàng đầu kèm kế hoạch và KPI. Bài tốt nối mọi phần về mục tiêu.</p>`],
    pit: ['Writing the report to defend the team. A useful report is honest about what failed so the next team does not repeat it.', 'Viết báo cáo để bảo vệ đội. Báo cáo hữu ích trung thực về điều đã hỏng để đội sau không lặp lại.'],
    s: [['Close-out covers venue, payments, thanks, archive, sponsor report.', 'Đóng sự kiện gồm địa điểm, thanh toán, cảm ơn, lưu trữ, báo cáo tài trợ.'], ['The report has eight standard sections.', 'Báo cáo có tám phần chuẩn.'], ['Run a blame-free lessons-learned meeting and assign owners.', 'Họp rút kinh nghiệm không đổ lỗi và gán người phụ trách.']],
    l: ['evm', 'pm', 'cba', 'roi'],
    p: [['Why delete personal data you no longer need?', 'Vì sao xoá dữ liệu cá nhân không còn cần?', 'It reduces privacy risk and respects guests.', 'Giảm rủi ro riêng tư và tôn trọng khách.'],
        ['Rewrite "who messed up the gates?" as a blame-free question.', 'Viết lại "ai làm hỏng cổng vào?" thành câu hỏi không đổ lỗi.', 'What in our entry process caused the queue?', 'Điều gì trong quy trình vào cổng gây ra hàng chờ?']] }),

  D(P + '8-3', '8.3 Ethics, sustainability and careers', '8.3 Đạo đức, bền vững và nghề nghiệp',
    'Trách nhiệm đạo đức, sự kiện bền vững, các vị trí nghề nghiệp và lộ trình môn học sau.', {
    n: '8.3',
    g: [['Name the ethical duties of an event professional', 'Nêu các trách nhiệm đạo đức của người làm sự kiện'], ['Describe practical steps toward a sustainable event', 'Mô tả các bước thực tế hướng tới sự kiện bền vững'], ['Map career paths and the next subjects', 'Vẽ lộ trình nghề nghiệp và các môn học tiếp theo']],
    b: [`<h4>Ethics</h4>
<ul><li><strong>Safety first:</strong> never trade safety for profit or schedule.</li>
<li><strong>Honesty:</strong> do not overstate line-ups, attendance or benefits.</li>
<li><strong>Fairness:</strong> pay people on time; treat volunteers and interns with respect; avoid discrimination; give accessible options.</li>
<li><strong>Privacy:</strong> collect only the data you need and protect it.</li>
<li><strong>Integrity:</strong> declare conflicts of interest with suppliers and sponsors; do not accept bribes.</li></ul>
<h4>Sustainable events</h4>
<p><a href="` + W + `Sustainability" target="_blank" rel="noopener">Sustainability</a> asks organisers to reduce harm and leave a positive legacy. Practical steps: reusable cups and deposit systems, waste sorting, local suppliers, public-transport tickets, energy-efficient lighting, digital instead of printed materials, and donating surplus food. The international management-system standard ISO 20121 exists for sustainable events; ask your lecturer for access. Measure what you can (waste weight, share of public transport) and report it honestly: avoid vague claims without evidence.</p>
<h4>Careers</h4>` + tbl(['Area', 'Typical roles', 'Related subject in the track'], [['Planning and production', 'Event coordinator, production assistant, stage manager', 'EEP201, EPO201'], ['Marketing and sales', 'Event marketer, ticketing, sponsorship executive', 'ETM201'], ['Venues and MICE', 'Convention-centre staff, conference organiser, exhibition manager', 'EPO201, STE301'], ['Artist side', 'Artist manager, booking agent assistant, tour coordinator', 'EEP201'], ['Risk and compliance', 'Safety officer, risk coordinator', 'ERM301c'], ['Leadership', 'Event director, head of events, founder of an agency', 'STE301']]) + `
<p>The <a href="https://www.eventscouncil.org/" target="_blank" rel="noopener">Events Industry Council</a> offers a recognised professional certification (CMP); look at its requirements to see what the industry expects. Start now: volunteer for university and community events, keep a portfolio of plans and reports, and learn basic budgeting and project tools.</p>
<h4>What comes next</h4>
<p>The later subjects of the track go deeper: EEP201 on planning entertainment, EPO201 on production and operations, ETM201 on marketing, ERM301c on risk, STE301 on strategy. Use your mini capstone from Lesson 8.2 as the base project to grow through them.</p>`,
`<h4>Đạo đức</h4>
<ul><li><strong>An toàn trên hết:</strong> không đánh đổi an toàn lấy lợi nhuận hay tiến độ.</li>
<li><strong>Trung thực:</strong> không thổi phồng đội hình, số khách hay lợi ích.</li>
<li><strong>Công bằng:</strong> trả tiền đúng hạn; tôn trọng tình nguyện viên và thực tập sinh; tránh phân biệt đối xử; có lựa chọn dễ tiếp cận.</li>
<li><strong>Riêng tư:</strong> chỉ thu dữ liệu cần thiết và bảo vệ nó.</li>
<li><strong>Liêm chính:</strong> khai báo xung đột lợi ích với nhà cung cấp và nhà tài trợ; không nhận hối lộ.</li></ul>
<h4>Sự kiện bền vững</h4>
<p><a href="` + W + `Sustainability" target="_blank" rel="noopener">Bền vững</a> đòi hỏi người tổ chức giảm tác hại và để lại di sản tích cực. Các bước thực tế: ly dùng lại và hệ thống đặt cọc, phân loại rác, nhà cung cấp địa phương, vé kèm phương tiện công cộng, đèn tiết kiệm điện, tài liệu số thay vì in, và tặng thức ăn dư. Có tiêu chuẩn hệ thống quản lý quốc tế ISO 20121 dành cho sự kiện bền vững; hãy hỏi giảng viên cách tiếp cận. Đo những gì có thể (khối lượng rác, tỷ lệ dùng phương tiện công cộng) và báo cáo trung thực: tránh tuyên bố chung chung không có bằng chứng.</p>
<h4>Nghề nghiệp</h4>` + tbl(['Mảng', 'Vị trí điển hình', 'Môn liên quan trong chuyên ngành'], [['Lập kế hoạch và sản xuất', 'Điều phối sự kiện, trợ lý sản xuất, stage manager', 'EEP201, EPO201'], ['Marketing và bán hàng', 'Marketing sự kiện, bán vé, chuyên viên tài trợ', 'ETM201'], ['Địa điểm và MICE', 'Nhân viên trung tâm hội nghị, tổ chức hội nghị, quản lý triển lãm', 'EPO201, STE301'], ['Phía nghệ sĩ', 'Quản lý nghệ sĩ, trợ lý booking, điều phối lưu diễn', 'EEP201'], ['Rủi ro và tuân thủ', 'Cán bộ an toàn, điều phối rủi ro', 'ERM301c'], ['Lãnh đạo', 'Giám đốc sự kiện, trưởng bộ phận sự kiện, sáng lập agency', 'STE301']]) + `
<p><a href="https://www.eventscouncil.org/" target="_blank" rel="noopener">Events Industry Council</a> cung cấp chứng chỉ nghề được công nhận (CMP); hãy xem yêu cầu để biết ngành kỳ vọng gì. Hãy bắt đầu ngay: làm tình nguyện cho sự kiện của trường và cộng đồng, giữ hồ sơ các kế hoạch và báo cáo, học ngân sách và công cụ dự án cơ bản.</p>
<h4>Tiếp theo là gì</h4>
<p>Các môn sau của chuyên ngành đi sâu hơn: EEP201 về lập kế hoạch giải trí, EPO201 về sản xuất và vận hành, ETM201 về marketing, ERM301c về rủi ro, STE301 về chiến lược. Dùng bài tập tổng kết thu nhỏ ở Bài 8.2 làm dự án nền để phát triển qua các môn.</p>`],
    pit: ['Green claims without evidence ("eco-friendly event"). State the measure, such as kilograms of waste sorted, or say nothing.', 'Tuyên bố xanh không có bằng chứng ("sự kiện thân thiện môi trường"). Nêu phép đo, như số kg rác được phân loại, hoặc đừng nói.'],
    s: [['Ethics: safety, honesty, fairness, privacy, integrity.', 'Đạo đức: an toàn, trung thực, công bằng, riêng tư, liêm chính.'], ['Sustainable steps: reuse, waste sorting, local suppliers, transport, energy; measure and report.', 'Bước bền vững: dùng lại, phân loại rác, nhà cung cấp địa phương, giao thông, năng lượng; đo và báo cáo.'], ['Careers span planning, marketing, venues, artists, risk and leadership.', 'Nghề nghiệp trải từ kế hoạch, marketing, địa điểm, nghệ sĩ, rủi ro đến lãnh đạo.']],
    l: ['sust', 'eic', 'evm', 'icca'],
    p: [['Give two practical steps for a lower-waste student event.', 'Nêu hai bước thực tế cho sự kiện sinh viên ít rác.', 'Reusable cups with deposit and clearly labelled waste sorting bins (also digital tickets).', 'Ly dùng lại có đặt cọc và thùng phân loại rác có nhãn rõ (hoặc vé điện tử).'],
        ['Which subject of the track will deepen risk management?', 'Môn nào của chuyên ngành sẽ đào sâu quản trị rủi ro?', 'ERM301c, Event Risk Management.', 'ERM301c, Quản trị rủi ro sự kiện.']] }),

  Q(P + 'quiz-8', 'Chapter 8 quiz — Evaluation and careers', 'Quiz Chương 8 — Đánh giá và nghề nghiệp', [
    ['A KPI is…|||KPI là…', ['A number that tracks an objective|||Con số theo dõi một mục tiêu', 'A stage lamp|||Đèn sân khấu', 'A permit|||Giấy phép', 'A sponsor|||Nhà tài trợ'], 0, 'KPIs make objectives measurable.|||KPI làm mục tiêu đo được.'],
    ['ROI = ?|||ROI = ?', ['(Benefit − Cost) ÷ Cost|||(Lợi ích − Chi phí) ÷ Chi phí', 'Benefit × Cost|||Lợi ích × Chi phí', 'Cost ÷ Benefit|||Chi phí ÷ Lợi ích', 'Benefit + Cost|||Lợi ích + Chi phí'], 0, 'It is expressed as a percentage.|||Biểu thị bằng phần trăm.'],
    ['Cost 400m, benefit 450m. ROI?|||Chi phí 400 triệu, lợi ích 450 triệu. ROI?', ['12.5%|||12,5%', '50%|||50%', '112.5%|||112,5%', '8%|||8%'], 0, '(450 − 400) ÷ 400 = 12.5%.|||(450 − 400) ÷ 400 = 12,5%.'],
    ['NPS equals…|||NPS bằng…', ['% promoters − % detractors|||% người ủng hộ − % người phê phán', '% promoters + % passives|||% người ủng hộ + % trung lập', 'Average score|||Điểm trung bình', 'Number of responses|||Số câu trả lời'], 0, 'Passives are ignored in the formula.|||Người trung lập không tính trong công thức.'],
    ['60 promoters, 25 passives, 15 detractors out of 100. NPS?|||60 ủng hộ, 25 trung lập, 15 phê phán trên 100. NPS?', ['+45|||+45', '+60|||+60', '+15|||+15', '+85|||+85'], 0, '60 − 15 = 45.|||60 − 15 = 45.'],
    ['The post-event report should be…|||Báo cáo sau sự kiện nên…', ['Honest about both successes and failures|||Trung thực về cả thành công và thất bại', 'Only positive|||Chỉ nói điều tích cực', 'Secret from the team|||Giấu cả đội', 'Skipped|||Bỏ qua'], 0, 'Learning needs honesty.|||Học hỏi cần sự trung thực.'],
    ['A blame-free question is…|||Câu hỏi không đổ lỗi là…', ['What in our process allowed this?|||Điều gì trong quy trình đã cho phép việc này?', 'Who is guilty?|||Ai có lỗi?', 'Who should be fired?|||Ai nên bị sa thải?', 'Whose fault was the weather?|||Thời tiết lỗi của ai?'], 0, 'It targets the system, not the person.|||Nó nhắm vào hệ thống, không vào cá nhân.'],
    ['A strong sustainability claim is…|||Tuyên bố bền vững mạnh là…', ['Specific and measured, e.g. kilograms of waste sorted|||Cụ thể và đo được, vd số kg rác được phân loại', '"We are the greenest"|||"Chúng tôi xanh nhất"', 'No claim at all about anything|||Không tuyên bố gì', 'A picture of a tree|||Hình một cái cây'], 0, 'Evidence prevents greenwashing.|||Bằng chứng ngăn tẩy xanh.']
  ]),
]));

export default secs;
