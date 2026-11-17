/**
 * Mục TRA CÔNG THỨC của IELTS Tập 3 — chặng 5 (Ngày 25–30). Soạn cùng `ngay/ngay25..30.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T3.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG5: Block[] = [
  /* ── Ngày 25 ── */
  { t: 'h', text: '1. (Ngày 25 · mục 2) Cụm danh từ phức — năm ô quanh danh từ chính' },
  {
    t: 'table',
    head: ['① Từ hạn định', '② Tính từ', '③ N bổ nghĩa', '④ DANH TỪ CHÍNH', '⑤ Phần đứng sau'],
    rows: [
      ['a', 'sharp', '—', 'rise', 'in fuel prices'],
      ['the', 'main', '—', 'cause', 'of air pollution in big cities'],
      ['a', 'five-year', 'government', 'plan', 'that was approved in 2020'],
      ['the', 'best', '—', 'way', 'to reduce traffic congestion'],
    ],
  },
  { t: 'rule', formula: 'từ hạn định + adj + N bổ nghĩa + DANH TỪ CHÍNH + (giới từ + N · who / which… · V-ing / V3 · to V)', vi: 'Từ ngắn đứng trước, cụm dài đứng sau; động từ chia theo danh từ chính.' },

  { t: 'h', text: '2. (Ngày 25 · mục 3) Bổ nghĩa trước danh từ — không thêm -s' },
  {
    t: 'patterns',
    rows: [
      { formula: 'N + N (danh từ thứ nhất số ít)', vi: 'Danh từ làm tính từ.', examples: [{ en: 'car ownership · government policy · energy consumption', vi: 'việc sở hữu ô tô · chính sách của chính phủ · mức tiêu thụ năng lượng' }] },
      { formula: 'số + gạch nối + N số ít + N', vi: 'Cụm số đo làm tính từ.', examples: [{ en: 'a five-year plan · a 20-storey building', vi: 'kế hoạch 5 năm · toà nhà 20 tầng' }] },
      { formula: 'adv / adj / N + gạch nối + V-ing / V3 / adj + N', vi: 'Tính từ ghép.', examples: [{ en: 'a well-paid job · a fast-growing city · low-income families', vi: 'công việc lương cao · thành phố phát triển nhanh · gia đình thu nhập thấp' }] },
    ],
  },
  { t: 'rule', formula: 'a / the + (số-N số ít) + adj + N số ít + N chính', vi: 'Mọi thứ đứng trước danh từ chính đều không thêm -s. Sở hữu của người dùng \'s: children\'s education.' },

  { t: 'h', text: '3. (Ngày 25 · mục 4) Bổ nghĩa sau danh từ + chia động từ theo danh từ chính' },
  {
    t: 'table',
    head: ['Kiểu', 'Công thức', 'Ví dụ'],
    rows: [
      ['Cụm giới từ', 'N + giới từ + N', 'the rise in unemployment'],
      ['Mệnh đề quan hệ', 'N + who / which / that + V', 'students who study abroad'],
      ['V-ing / V3 rút gọn', 'N + V-ing · N + V3', 'people living in cities · goods made in China'],
      ['to V', 'N (ability · chance · decision · way · plan) + to V', 'the ability to adapt'],
      ['that + mệnh đề', 'the fact / idea / belief + that + S + V', 'the fact that prices are rising'],
    ],
  },
  { t: 'rule', formula: 'The + N chính (số ít) + of + N số nhiều + V(s/es)', vi: 'The number of… + V số ít · A number of… + V số nhiều · One of the + N số nhiều + V số ít.' },

  { t: 'h', text: '4. (Ngày 25 · mục 5) Danh hoá mức 1' },
  {
    t: 'patterns',
    rows: [
      { formula: 'There + be + a / an + adj + N + in + N', vi: 'Task 1: gói “tăng / giảm thế nào” vào cụm danh từ.', examples: [{ en: 'There was a sharp rise in sales in 2020.', vi: 'Có một mức tăng mạnh về doanh số năm 2020.' }] },
      { formula: 'S + saw / experienced / witnessed + a / an + adj + N + in + N', vi: 'Chủ ngữ là nơi chốn / thời gian.', examples: [{ en: 'The 1980s saw a significant increase in unemployment.', vi: 'Thập niên 1980 chứng kiến thất nghiệp tăng đáng kể.' }] },
      { formula: 'The + N (danh hoá) + of + N + V …', vi: 'Task 2: cả một hành động làm chủ ngữ.', examples: [{ en: 'The introduction of stricter laws would reduce pollution.', vi: 'Việc ban hành luật nghiêm hơn sẽ giảm ô nhiễm.' }] },
      { formula: 'This / Such + N (danh hoá) + V …', vi: 'Danh từ tóm lại cả câu trước (liên kết).', examples: [{ en: 'Many factories have closed. This decline has left thousands without work.', vi: 'Nhiều nhà máy đã đóng cửa. Sự suy giảm này khiến hàng nghìn người mất việc.' }] },
    ],
  },
  { t: 'rule', formula: 'S + V + adv  →  (There + be) a / an + adj + N + in / of + N', vi: 'Động từ thành danh từ, trạng từ thành tính từ, chủ ngữ cũ lùi ra sau giới từ — rồi cho câu một động từ mới.' },

  { t: 'h', text: '5. (Ngày 25 · mục 6) Giới từ sau danh từ danh hoá' },
  {
    t: 'table',
    head: ['Giới từ', 'Danh từ'],
    rows: [
      ['in (thứ thay đổi)', 'rise · increase · fall · decline · growth · reduction · change · improvement · investment'],
      ['of (con số / tân ngữ)', 'a rise of 10% · the introduction / development / use / lack of'],
      ['for', 'demand · need · reason · responsibility · support'],
      ['to', 'solution · access · damage · threat · alternative · approach'],
      ['on', 'effect · impact · influence · ban · tax · pressure · emphasis'],
      ['between', 'difference · gap · link · relationship · balance'],
    ],
  },
  { t: 'rule', formula: 'a / an + adj + N (tăng – giảm) + of + con số + in + thứ thay đổi', vi: 'of đi với con số, in đi với thứ thay đổi: a rise of 12% in exports.' },

  { t: 'h', text: '6. (Ngày 25 · Đọc) Summary (từ trong bài) + Sentence completion band 6' },
  { t: 'rule', formula: 'Giới hạn từ → đọc cả tóm tắt → loại từ → từ khó đổi → câu CÙNG Ý (đổi loại từ / đảo vế) → chép nguyên văn → đọc lại', vi: 'Từ quanh chỗ trống thường khác bài; đáp án luôn là chữ nguyên văn. Câu hỏi có danh từ trừu tượng ⇒ trong bài thường là động từ.' },

  { t: 'h', text: '7. (Ngày 25 · Nghe) Năm loại bẫy Part 3 – Part 4' },
  {
    t: 'table',
    head: ['Bẫy', 'Tín hiệu', 'Đáp án ở đâu'],
    rows: [
      ['Nhắc rồi bác', 'but · actually · I wouldn\'t · that\'s not necessary', 'ở câu trả lời của người kia'],
      ['Đổi ý', 'originally · we\'d planned to · in the end', 'sau in the end / actually'],
      ['Số, tên gây nhiễu', 'not… but · less… than · rather than', 'vế sau but / than'],
      ['Tưởng vậy mà không', 'you might think · people assume · in fact · the main reason', 'sau in fact / the main reason'],
      ['Từ của đề, ý khác', 'phương án giống y chữ trong băng', 'phương án được paraphrase'],
    ],
  },
  { t: 'rule', formula: 'Nghe đề xuất → CHỜ phản hồi (but / actually / in the end / in fact) → mới ghi', vi: 'Thứ được nói đầu tiên hiếm khi là đáp án; đáp án là thứ được chốt.' },

  /* ── Ngày 26 ── */
  { t: 'h', text: '8. (Ngày 26 · Từ vựng) travel · trip · journey · tour + 12 collocation du lịch – văn hoá' },
  {
    t: 'table',
    head: ['Collocation', 'Nghĩa'],
    rows: [
      ['boost the local economy · generate income / revenue · create employment opportunities', 'lợi ích kinh tế'],
      ['attract visitors · preserve cultural heritage · respect local customs', 'du khách – di sản – phong tục'],
      ['gain a deeper understanding of · experience a different way of life', 'lợi ích với người đi'],
      ['put a strain on · pose a threat to · at the expense of', 'tác hại'],
      ['strike a balance between A and B', 'tìm điểm cân bằng'],
    ],
  },
  { t: 'rule', formula: 'go on a trip to + nơi · the journey takes + thời gian · a guided tour of + nơi · travel (không a)', vi: 'trip = cả chuyến; journey = quãng đường; tour = đi nhiều điểm; travel = việc đi lại nói chung, không đếm được.' },

  { t: 'h', text: '9. (Ngày 26 · Viết · mục 2) Báo cáo số liệu ngắn trong công việc — 5 phần' },
  {
    t: 'patterns',
    rows: [
      { formula: 'This report summarises / presents + N + and + V …', vi: 'Câu mục đích.', examples: [{ en: 'This report summarises bookings by sales channel in 2025 and recommends priorities for next year.', vi: 'Báo cáo này tóm tắt lượng đặt chỗ theo kênh bán năm 2025 và đề xuất ưu tiên cho năm tới.' }] },
      { formula: 'The main finding is that + S + V', vi: 'Phát hiện chính (= overview).', examples: [{ en: 'The main finding is that the mobile app has replaced the website as our largest channel.', vi: 'Phát hiện chính là ứng dụng đã thay trang web làm kênh lớn nhất.' }] },
      { formula: 'S + V2 …, which suggests that + S + V · This may be due to + N', vi: 'Diễn giải / nguyên nhân có mức độ — chỉ trong báo cáo, KHÔNG trong Task 1.', examples: [{ en: 'This may be due to the launch of the new app in March.', vi: 'Điều này có thể do việc ra mắt ứng dụng mới hồi tháng Ba.' }] },
      { formula: 'It is recommended that + S + (should) + V · We recommend + V-ing', vi: 'Đề xuất.', examples: [{ en: 'It is recommended that the marketing budget should be moved to the app.', vi: 'Đề xuất chuyển ngân sách tiếp thị sang ứng dụng.' }] },
    ],
  },
  { t: 'rule', formula: 'Subject → This report summarises … → The main finding is that … → [số liệu chọn lọc] → It is recommended that + S + (should) + V', vi: 'Báo cáo ngắn = Task 1 + tiêu đề + đề xuất; kết luận đứng trước chi tiết. Task 1 thì cấm nguyên nhân và đề xuất.' },

  { t: 'h', text: '10. (Ngày 26 · Viết · mục 6) Bảng ôn 7 dạng Task 1' },
  {
    t: 'table',
    head: ['Dạng', 'Overview phải nói', 'Thì', 'Khung câu chủ lực'],
    rows: [
      ['Line graph (Ngày 8)', 'hướng đi chung + đổi ngôi; có Total thì nói Total trước', 'quá khứ đơn; dự báo: is projected to', 'A overtook B in… · started at…, peaked at…, before ending at…'],
      ['Bar chart (Ngày 12)', 'có thời gian ⇒ như line; không ⇒ cao nhất / thấp nhất + khác biệt', 'theo năm; không năm ⇒ hiện tại đơn', '… was twice as high as… · its counterpart'],
      ['Pie chart (Ngày 16)', 'phần lớn nhất + dịch chuyển tỉ trọng', 'theo năm của đề', 'The share of… rose from x% to y% · accounted for'],
      ['Table (Ngày 20)', 'Total trước; cao nhất – thấp nhất', 'theo năm của đề', 'In total,… · accounted for a third of the total'],
      ['Mixed (Ngày 24)', 'mỗi hình một ý', 'mỗi hình một thì', '…, while the pie chart illustrates… · Turning to…'],
      ['Process (Tập 2 Ngày 20 → Ngày 28)', 'số bước + đầu – cuối', 'hiện tại đơn, bị động', 'The process consists of… stages, beginning with… and ending with…'],
      ['Map (Tập 2 Ngày 22 → Ngày 28)', 'thay đổi lớn nhất về tính chất', 'quá khứ / hiện tại hoàn thành, bị động', '… was replaced by… · … was built to the north of…'],
    ],
  },
  { t: 'rule', formula: 'Có thời gian ⇒ hướng đi + đổi ngôi · Không thời gian ⇒ cao nhất – thấp nhất · Process ⇒ số bước, đầu – cuối · Map ⇒ thay đổi lớn nhất · Mixed ⇒ mỗi hình một ý', vi: 'Nhìn dạng đề để biết overview cần LOẠI thông tin nào.' },

  { t: 'h', text: '11. (Ngày 26 · Nói · mục 1–3) Part 2 đồ vật / hoạt động band 6' },
  {
    t: 'patterns',
    rows: [
      { formula: "It's a + adj + chất liệu + N, about the size of + N, with + chi tiết", vi: 'Một câu tả gói.', examples: [{ en: "It's a plain brown clay teapot, about the size of my fist, with a tiny crack near the handle.", vi: 'Đó là chiếc ấm đất nâu trơn, to cỡ nắm tay, có vết nứt nhỏ gần quai.' }] },
      { formula: "I'd been + V-ing + when + S + V2", vi: 'Mở chuyện.', examples: [{ en: "We'd been wandering around the market for hours when we came across a tiny workshop.", vi: 'Bọn tôi lang thang ở chợ hàng giờ thì tình cờ gặp một xưởng nhỏ.' }] },
      { formula: 'What makes it special is (that) … · If I lost it, I\'d …', vi: 'Ý nghĩa + một câu giả định.', examples: [{ en: "If I broke it, I'd be really upset, because I couldn't replace that memory.", vi: 'Nếu làm vỡ nó tôi sẽ buồn lắm, vì không thay được ký ức ấy.' }] },
      { formula: "I'd never + V3 + before · At first…, but once… · It turned out to be…", vi: 'Hoạt động thử lần đầu: chưa từng – cảm xúc đổi – kết quả.', examples: [{ en: 'It turned out to be the most memorable part of the whole trip.', vi: 'Hoá ra đó là phần đáng nhớ nhất của cả chuyến đi.' }] },
    ],
  },
  { t: 'rule', formula: 'Là gì + tả 1 câu gói → I\'d been V-ing when… → bây giờ → What makes it special is… → If I lost it, I\'d…', vi: 'Khung band 6 cho đề đồ vật: tả – chuyện – hiện tại – ý nghĩa – giả định.' },

  { t: 'h', text: '12. (Ngày 26 · Nói · mục 4) Đề lạ — mượn khung' },
  {
    t: 'patterns',
    rows: [
      { formula: "That's not something I've thought about before, but the first thing that comes to mind is + N", vi: 'Câu mở khi thẻ lạ.', examples: [{ en: "That's not something I've thought about before, but the first thing that comes to mind is my grandmother's rice bowl.", vi: 'Chuyện này tôi chưa nghĩ tới, nhưng thứ đầu tiên hiện ra là cái bát của bà tôi.' }] },
      { formula: "I haven't actually + V3, but if I did / had to, I'd + V", vi: 'Không có trải nghiệm ⇒ chuyển sang giả định.', examples: [{ en: "I haven't actually lived abroad, but if I had to move, the one thing I'd take is a small photo album.", vi: 'Tôi chưa sống ở nước ngoài, nhưng nếu phải đi, thứ duy nhất tôi mang là một cuốn album nhỏ.' }] },
    ],
  },
  { t: 'rule', formula: 'Đề lạ → danh từ chính + động từ → loại gần nhất → khung của loại đó + một chuyện có sẵn → câu bắc cầu', vi: 'Không có đề mới, chỉ có đề cũ mặc áo khác.' },

  /* ── Ngày 27 ── */
  { t: 'h', text: '13. (Ngày 27 · mục 2–3) Dấu phẩy — 5 chỗ phải có, 3 chỗ không được có' },
  {
    t: 'table',
    head: ['Luật', 'Ví dụ'],
    rows: [
      ['Sau phần mở đầu (mệnh đề phụ / trạng ngữ / từ nối)', 'Although online courses are cheaper, many students prefer classes. · However, the cost is high.'],
      ['Trước and / but / so nối HAI mệnh đề độc lập', 'The government raised fuel taxes, but car use did not fall.'],
      ['Giữa các mục liệt kê', 'The scheme reduced noise, pollution and congestion.'],
      ['KẸP thông tin thêm (which / who không xác định)', 'Singapore, which has very little land, imports most of its food.'],
      ['KHÔNG giữa chủ ngữ và động từ', 'The number of people who work from home has doubled.'],
      ['KHÔNG trước that', 'Many people believe that technology isolates us.'],
      ['KHÔNG quanh mệnh đề quan hệ xác định', 'Students who study abroad become more independent.'],
    ],
  },
  { t: 'rule', formula: 'Phẩy sau phần MỞ ĐẦU · trước FANBOYS nối 2 mệnh đề · giữa các mục LIỆT KÊ · KẸP thông tin thêm · KHÔNG giữa S và V · KHÔNG trước that', vi: 'Tiếng Anh đặt dấu phẩy theo cấu trúc câu, không theo chỗ ngắt hơi.' },

  { t: 'h', text: '14. (Ngày 27 · mục 4) Comma splice / run-on — 4 cách sửa' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + V . S + V', vi: 'Tách thành hai câu.', examples: [{ en: 'House prices rose. Many people had to rent.', vi: 'Giá nhà tăng. Nhiều người phải thuê nhà.' }] },
      { formula: 'S + V, so / but / and + S + V', vi: 'Phẩy + liên từ.', examples: [{ en: 'House prices rose, so many people had to rent.', vi: 'Giá nhà tăng nên nhiều người phải thuê nhà.' }] },
      { formula: 'S + V; (however,) S + V', vi: 'Chấm phẩy; however / therefore / moreover đứng sau chấm phẩy hoặc dấu chấm.', examples: [{ en: 'The plan was popular; however, it was too expensive.', vi: 'Kế hoạch được ưa chuộng; tuy nhiên nó quá đắt.' }] },
      { formula: 'Because / Although + S + V, S + V', vi: 'Liên từ phụ thuộc — cách ăn điểm nhất.', examples: [{ en: 'Because house prices rose, many people had to rent.', vi: 'Vì giá nhà tăng, nhiều người phải thuê nhà.' }] },
    ],
  },
  { t: 'rule', formula: 'Dấu phẩy KHÔNG đủ sức nối 2 mệnh đề độc lập · however / therefore / then không phải liên từ', vi: 'Thấy “, it / , they / , this / , however” giữa câu là phải kiểm.' },

  { t: 'h', text: '15. (Ngày 27 · mục 5) Chấm phẩy · hai chấm · gạch ngang' },
  {
    t: 'table',
    head: ['Dấu', 'Việc chính', 'Ví dụ'],
    rows: [
      [';', 'Nối hai mệnh đề độc lập liên quan chặt', 'Some countries tax sugar; others ban advertising aimed at children.'],
      [':', 'Sau một câu ĐỦ NGHĨA, báo danh sách / lời giải thích', 'There are two main causes: low wages and high rents.'],
      ['—', 'Chêm thông tin để nhấn mạnh', 'Only one country — Japan — saw a fall in population.'],
    ],
  },
  { t: 'rule', formula: 'S + V ; S + V · S + V (đủ nghĩa) : danh sách / lời giải thích · S — thông tin chêm — V', vi: 'Không đặt hai chấm ngay sau động từ hoặc such as.' },

  { t: 'h', text: '16. (Ngày 27 · mục 6–9) Hệ thống lỗi: hoà hợp S–V · song song · dangling · nhất quán thì' },
  {
    t: 'table',
    head: ['Lỗi', 'Luật', 'Ví dụ đúng'],
    rows: [
      ['Hoà hợp S–V', 'Tìm danh từ CHÍNH: the number of + V số ít · a number of + V số nhiều · one of the + N số nhiều + V số ít · N không đếm được / V-ing + V số ít', 'The number of cars has risen. · One of the main reasons is cost.'],
      ['Song song', 'Hai bên and / or / but / than cùng dạng', 'Students learn to read, write and count. · Cycling is healthier than driving.'],
      ['Dangling modifier', 'V-ing / V3 đầu câu: chủ ngữ ngầm = chủ ngữ mệnh đề chính', 'After being washed, the olives are crushed. · Compared with 2010, the figure was twice as high.'],
      ['Nhất quán thì', 'Một đoạn một thì nền; đổi thì chỉ khi có mốc thời gian mới', 'In 2010 the figure was 20%, and it then increased to 35% in 2015.'],
    ],
  },
  { t: 'rule', formula: 'Tìm N chính → V theo N chính · A and B cùng dạng · V-ing …, S (người / vật làm hành động đó) + V · một đoạn = một thì nền' },

  { t: 'h', text: '17. (Ngày 27 · mục 10) Bảng tự soát 6 lượt' },
  {
    t: 'table',
    head: ['Lượt', 'Mắt chỉ nhìn', 'Lỗi điển hình'],
    rows: [
      ['1 Động từ', 'Mọi động từ chia thì', 'thiếu -s ngôi ba · the number of … are · đổi thì vô cớ · bị động thiếu be'],
      ['2 Danh từ', 'Mọi danh từ', 'thiếu a / the · thiếu -s số nhiều · informations'],
      ['3 Ranh giới câu', 'Mọi dấu phẩy, dấu chấm', 'comma splice · run-on · câu cụt · phẩy trước that'],
      ['4 Song song + từ loại', 'Mọi and / or / than', 'to read and writing · it is importance'],
      ['5 Liên kết', 'Từ đầu câu; this / it / they', 'However khi không đối lập · It mơ hồ'],
      ['6 Chính tả + đề', 'Từ dài, từ dễ nhầm; đọc lại đề', 'affect / effect · thiếu overview / thiếu ý kiến'],
    ],
  },
  { t: 'rule', formula: 'Động từ → Danh từ → Ranh giới câu → Song song + từ loại → Liên kết → Chính tả + đề', vi: 'Phòng thi: lượt 1 + lượt 3 + hai lượt bạn sai nhiều nhất.' },

  { t: 'h', text: '18. (Ngày 27 · Nói mục 2–5) Fluency: không im quá 3 giây · tự sửa · paraphrase câu hỏi · câu chốt' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Câu mua thời gian + paraphrase câu hỏi + ý chính', vi: 'Mở đầu Part 3 khi chưa có ý.', examples: [{ en: "Hmm, that's a tricky one. Whether technology has made people less patient… I'd say it has, to some extent.", vi: 'Hừm, câu này khó đấy. Chuyện công nghệ có làm con người kém kiên nhẫn hơn không… tôi cho là có, ở mức độ nào đó.' }] },
      { formula: '… từ sai — I mean, / sorry, / or rather, + từ đúng … (đi tiếp)', vi: 'Tự sửa MỘT lần, chỉ lặp từ sai, không quay lại đầu câu.', examples: [{ en: 'There were about fifteen — sorry, fifty — people in the room.', vi: 'Có khoảng mười lăm — xin lỗi, năm mươi — người trong phòng.' }] },
      { formula: 'Ý chính + , and the reason is… / For instance, … / Mind you, …', vi: 'Ba móc nối kéo dài ý: lý do → ví dụ → đối lập.', examples: [{ en: "I usually study in the library, and the reason is that I get distracted at home.", vi: 'Tôi thường học ở thư viện, lý do là ở nhà tôi dễ xao nhãng.' }] },
      { formula: "… So that's why … / So overall, I'd say … / … but that's just me.", vi: 'Câu chốt quay về câu hỏi, xuống giọng rồi dừng.', examples: [{ en: "So overall, I'd say it's a mix of constant interruptions and too much work.", vi: 'Nên nhìn chung tôi cho là do cả việc bị ngắt quãng liên tục lẫn quá nhiều việc.' }] },
    ],
  },
  { t: 'rule', formula: 'Im ở ĐẦU câu → câu mua thời gian + paraphrase · GIỮA câu → giải nghĩa từ · CUỐI ý → lý do / ví dụ / đối lập · KHÔNG HIỂU → hỏi lại', vi: 'Tự chấm bản ghi âm bằng 6 số: im > 3 giây · um · tự sửa · từ chép câu hỏi · số câu · câu chốt.' },

  /* ── Ngày 28 ── */
  { t: 'h', text: '19. (Ngày 28 · Từ vựng mục 6) Từ dễ nhầm — 16 cặp' },
  {
    t: 'table',
    head: ['Cặp', 'Khác nhau', 'Ví dụ'],
    rows: [
      ['affect (v) · effect (n)', 'ảnh hưởng tới · sự ảnh hưởng', 'Noise affects sleep. · Noise has an effect on sleep.'],
      ['advise (v) · advice (n)', 'khuyên · lời khuyên (không đếm được)', 'Doctors advise us to walk. · some advice'],
      ['practise (v) · practice (n)', 'luyện tập · sự luyện tập', 'You need to practise. · It takes practice.'],
      ['lose (v) · loose (adj)', 'mất · lỏng', 'Many languages lose speakers.'],
      ['choose (v) · choice (n)', 'chọn · sự lựa chọn', 'make a choice'],
      ['breathe (v) · breath (n)', 'thở · hơi thở', 'breathe clean air'],
      ['believe (v) · belief (n)', 'tin · niềm tin', 'a common belief'],
      ['succeed (v) · success (n) · successful (adj)', 'thành công', 'succeed in doing · a great success'],
      ['rise · raise', 'tự tăng (không tân ngữ) · nâng cái gì lên', 'Prices rose. · The shop raised its prices.'],
      ['economic · economical', 'thuộc kinh tế · tiết kiệm', 'economic growth · an economical car'],
      ['historic · historical', 'có ý nghĩa lịch sử · thuộc về quá khứ', 'a historic victory · historical records'],
      ['classic · classical', 'kinh điển · cổ điển', 'a classic novel · classical music'],
      ['sensible · sensitive', 'hợp lý · nhạy cảm', 'a sensible decision · sensitive skin'],
      ['number · amount', '+ N đếm được · + N không đếm được', 'the number of cars · the amount of traffic'],
      ['say · tell', 'say + lời nói · tell + người', 'He said (that)… · He told me (that)…'],
      ['remember · remind', 'tự nhớ · làm ai nhớ', 'This song reminds me of school.'],
    ],
  },
  { t: 'rule', formula: 'affect (v) → have an effect (n) on · prices rise → raise prices · the number of + N đếm được → the amount of + N không đếm được', vi: 'Soát ở lượt 6 của bảng tự soát 6 lượt (Ngày 27).' },

  { t: 'h', text: '20. (Ngày 28 · Viết mục 2) Process — overview ba thành phần' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Overall, this is a linear / cyclical process consisting of + số + stages, which begins with + N / V-ing and ends with + N / V-ing.', vi: 'Loại quy trình + số giai đoạn + đầu – cuối.', examples: [{ en: 'Overall, this is a linear process consisting of eight stages, which begins with the collection of used paper and ends with rolls of recycled paper ready for printing.', vi: 'Nhìn chung, đây là một quy trình thẳng gồm tám giai đoạn, bắt đầu bằng việc thu gom giấy đã dùng và kết thúc bằng những cuộn giấy tái chế sẵn sàng đem in.' }] },
    ],
  },
  { t: 'rule', formula: 'Overall, this is a linear / cyclical process consisting of + số + stages, which begins with … and ends with …' },

  { t: 'h', text: '21. (Ngày 28 · Viết mục 3–4) Process — mục đích của bước · by / with · gộp bước' },
  {
    t: 'table',
    head: ['Cấu trúc', 'Ví dụ'],
    rows: [
      ['to / in order to + V', 'The paper is mixed with water in order to break it down into pulp.'],
      ['so that + S + can + V', 'The pulp is passed through screens so that glue can be filtered out.'],
      ['to allow + N + to V', 'It is sprayed onto a mesh to allow the water to drain away.'],
      ['by means of + N / by + V-ing', 'Ink is removed by means of air bubbles.'],
      ['by + người / máy làm · with + dụng cụ, vật liệu', 'dried by heated rollers · mixed with water · picked by hand'],
      ['After being + V3, S + is + V3', 'After being cleaned, the pulp is pumped into a second tank.'],
      ['S + is + V3 before being + V3', 'The wet sheet is pressed and dried before being wound onto large rolls.'],
      ['Once + S + has been + V3, it + is + V3', 'Once the ink has been removed, the pulp is sprayed onto a moving mesh.'],
      ['…, where it + is + V3', 'The paper is taken to a recycling plant, where it is sorted by grade.'],
    ],
  },
  { t: 'rule', formula: 'S + is / are + V3 + in order to V / so that S can V / to allow N to V / by means of N', vi: 'Thêm TỪ chính xác thì được; thêm BƯỚC, con số, ý kiến ngoài hình thì không.' },

  { t: 'h', text: '22. (Ngày 28 · Viết mục 6) Map ba mốc: quá khứ – hiện tại – kế hoạch' },
  {
    t: 'table',
    head: ['Mốc', 'Thì', 'Ví dụ'],
    rows: [
      ['Năm quá khứ', 'Quá khứ đơn', 'In 1980, the area was used for trade.'],
      ['Quá khứ → nay', 'Hiện tại hoàn thành bị động', 'Since then, the market has been converted into a museum. · The houses have remained unchanged.'],
      ['Gói phá + xây', 'was demolished to make way for + N', 'The factory was demolished to make way for a shopping centre.'],
      ['Kế hoạch tương lai', 'is going to be / will be / is planned + V3', 'By 2040, the car park is going to be turned into a public park.'],
    ],
  },
  { t: 'rule', formula: 'In + năm quá khứ, S was … · Since then, S has been + V3 · By + năm tương lai, S is going to be / will be + V3', vi: 'Overview: the town has been transformed from … into …, and the future plans will make it …' },

  { t: 'h', text: '23. (Ngày 28 · Viết mục 7) Map chọn địa điểm S1 / S2' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Overall, the main difference is that S1 is + …, whereas S2 is + …', vi: 'Overview = khác biệt chính, không chọn bên.', examples: [{ en: 'Overall, the main difference is that S1 is a small site in the middle of the town, whereas S2 is a much larger site on the eastern outskirts.', vi: 'Nhìn chung, khác biệt chính là S1 là khu đất nhỏ giữa thị trấn, còn S2 là khu đất rộng hơn nhiều ở ngoại vi phía đông.' }] },
      { formula: 'S1 is situated / lies + vị trí · A + công trình + here would + V · Because it is + adj-er, it could + V', vi: 'Hiện tại đơn cho vị trí; would / could cho hệ quả nếu xây ở đó.', examples: [{ en: 'A sports centre here would be within walking distance for most residents.', vi: 'Một trung tâm thể thao ở đây sẽ nằm trong khoảng đi bộ được với phần lớn cư dân.' }] },
    ],
  },
  { t: 'rule', formula: 'S1 is situated / lies + vị trí · A … here would + V · Overall, the main difference is that S1 …, whereas S2 …', vi: 'Thân 1 = S1, thân 2 = S2; không quá khứ, không will, không should / I think.' },

  { t: 'h', text: '24. (Ngày 28 · Nghe mục 1) Short answer questions' },
  {
    t: 'table',
    head: ['Từ hỏi', 'Chờ nghe'],
    rows: [
      ['How many / How much / How long', 'Con số (+ đơn vị)'],
      ['What time / When / On which day', 'Giờ, ngày, thứ'],
      ['What / Which + N · What kind of', 'Danh từ · tính từ + danh từ'],
      ['Who / Which group · Where', 'Người, nhóm người · nơi chốn'],
    ],
  },
  { t: 'rule', formula: 'Từ hỏi → loại đáp án · đếm từ (a / the cũng tính) · chép CHỮ TRONG BĂNG · thông tin bị sửa ⇒ lấy cái nói SAU' },

  /* ── Ngày 29 ── */
  { t: 'h', text: '25. (Ngày 29 · mục 2) have / get + vật + V3 — nhờ, thuê người khác làm' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + have + O (vật) + V3', vi: 'Sắp xếp / trả tiền để người khác làm. Trung tính, dùng được khi viết.', examples: [{ en: 'The council had the old bridge repaired last year.', vi: 'Năm ngoái hội đồng thành phố cho sửa cây cầu cũ.' }] },
      { formula: 'S + get + O (vật) + V3', vi: 'Cùng nghĩa, thân mật hơn — hay dùng khi nói.', examples: [{ en: 'I need to get my phone screen fixed.', vi: 'Tôi cần đem điện thoại đi thay màn hình.' }] },
    ],
  },
  { t: 'rule', formula: 'S + have / get + O (vật) + V3 (+ by …)', vi: 'Chỉ chia have / get; vật đứng giữa; động từ chính luôn ở V3. Không nói “I cut my hair” khi thợ cắt.' },

  { t: 'h', text: '26. (Ngày 29 · mục 3) have + người + V · get + người + to V' },
  {
    t: 'table',
    head: ['Tân ngữ', 'Dạng động từ', 'Ví dụ'],
    rows: [
      ['Vật (được làm)', 'V3', 'I had my car washed.'],
      ['Người — sau have', 'V không to', 'I had a mechanic check the brakes.'],
      ['Người — sau get', 'to V', 'I got a mechanic to check the brakes.'],
    ],
  },
  { t: 'rule', formula: 'have + O (người) + V  ·  get + O (người) + to V  ·  have / get + O (vật) + V3', vi: 'Người làm ⇒ động từ chủ động (have: không to; get: có to). Vật được làm ⇒ V3.' },

  { t: 'h', text: '27. (Ngày 29 · mục 4) have + vật + V3 nghĩa “bị”' },
  { t: 'rule', formula: 'S (người chịu) + have + O (vật của mình) + V3', vi: 'Chuyện xui với đồ của mình: I had my phone stolen. Không viết I was stolen my phone.' },

  { t: 'h', text: '28. (Ngày 29 · mục 5) make · let · allow · enable · force — chủ động và bị động' },
  {
    t: 'table',
    head: ['Động từ', 'Chủ động', 'Bị động'],
    rows: [
      ['make', 'make sb do', 'be made to do'],
      ['let', 'let sb do', '— (dùng be allowed to do)'],
      ['allow / permit', 'allow sb to do', 'be allowed to do'],
      ['enable', 'enable sb to do', '(hiếm)'],
      ['force / require / encourage', 'force sb to do', 'be forced / required / encouraged to do'],
    ],
  },
  { t: 'rule', formula: 'make / let + O + V  ·  allow / enable / force / encourage + O + to V  ·  be made / allowed / forced + to V', vi: 'make, let: không to ở chủ động. Bị động của make thêm to; let mượn be allowed to.' },

  { t: 'h', text: '29. (Ngày 29 · mục 6) need + V-ing · want + vật + V3' },
  { t: 'rule', formula: 'N (vật) + need + V-ing  =  N + need + to be + V3', vi: 'Vật cần được làm gì: The road needs repairing. Người cần làm gì: We need to repair the road.' },

  { t: 'h', text: '30. (Ngày 29 · Đọc) Passage 3 — 900 từ / 20 phút' },
  { t: 'rule', formula: 'Tiêu đề → trọn đoạn đầu → câu đầu mỗi đoạn → trọn đoạn cuối → bản đồ đoạn (3 phút) → dạng theo thứ tự trước (15 phút) → soát (2 phút)', vi: 'Luôn hỏi “giọng của ai?”. Lựa chọn nói mạnh hơn tác giả (always, prove, completely) gần như luôn sai.' },

  { t: 'h', text: '31. (Ngày 29 · Nghe) Đề 40 câu — 2 phút kiểm' },
  { t: 'rule', formula: 'Nghe một lần → gõ ngay → lỡ thì bỏ → 2 phút kiểm: ô trống · số từ · -s · chính tả · chữ cái matching', vi: 'Đích Tập 3: ≥ 23/40 (band 6.0).' },

  /* ── Ngày 30 ── */
  { t: 'h', text: '32. (Ngày 30 · mục 1) Dùng idiom khi nói — 5 luật' },
  { t: 'rule', formula: 'Ý thường (1 câu) + idiom đúng nguyên dạng + because / — giải thích', vi: 'Chỉ dùng khi nói, mỗi câu trả lời tối đa 1 idiom, vẫn chia thì và đổi ngôi (gets on my nerves).' },

  { t: 'h', text: '33. (Ngày 30 · mục 7) Một ý — hai văn phong (nói ↔ viết)' },
  {
    t: 'table',
    head: ['Khi nói (Part 1–3)', 'Khi viết (Task 2)'],
    rows: [
      ['cost an arm and a leg', 'be extremely expensive / unaffordable'],
      ['struggle to make ends meet', 'struggle to cover basic living costs'],
      ['a double-edged sword', 'have both benefits and drawbacks'],
      ['the tip of the iceberg', 'only a small part of a much wider problem'],
      ['a drop in the ocean', 'insignificant compared with what is needed'],
      ['at the end of the day', 'ultimately'],
      ['be fed up with', 'be increasingly dissatisfied with'],
      ['the best of both worlds', 'combine the advantages of both'],
    ],
  },

  { t: 'h', text: '34. (Ngày 30 · Viết mục 3) Viết lại một bài cũ theo sổ lỗi' },
  { t: 'rule', formula: 'Đếm mã → chọn 2 mã mục tiêu → Bản 2: sửa CÂU (A S T P W L C) → Bản 3: sửa Ý (I) → nộp AI → so band trước – sau', vi: 'Câu trước, ý sau. Viết lại trọn bài từ dàn ý mới, không vá từng chữ trên bài cũ.' },

  { t: 'h', text: '35. (Ngày 30 · Viết mục 5) Thân bài Task 2 band 6' },
  {
    t: 'patterns',
    rows: [
      { formula: 'The main reason for + V-ing … is that + S + V', vi: 'Câu chủ đề nêu một lý do rõ.', examples: [{ en: 'The main reason for prioritising public transport is that it reduces the number of private vehicles.', vi: 'Lý do chính để ưu tiên giao thông công cộng là nó giảm số phương tiện cá nhân.' }] },
      { formula: 'Admittedly, S + V. However, this need can be met by + V-ing', vi: 'Nêu phản đề rồi TRẢ LỜI nó.', examples: [{ en: 'Admittedly, roads are essential for transporting goods. However, this need can be met by improving existing roads.', vi: 'Phải thừa nhận đường sá cần cho việc chở hàng. Tuy nhiên, nhu cầu này có thể đáp ứng bằng cách cải tạo đường hiện có.' }] },
    ],
  },
  { t: 'rule', formula: 'Câu chủ đề (1 lý do) + , which means / As a result (hệ quả) + for example (nơi · vật · kết quả) + câu nối về lập trường', vi: 'Một ý được đẩy tới hệ quả và ví dụ ăn điểm hơn ba ý chỉ được nêu tên.' },

  { t: 'h', text: '36. (Ngày 30 · Viết mục 6) Task 1 viết lại' },
  { t: 'rule', formula: 'Overall (2 điểm chính, không số) + nhóm số liệu theo “ai hơn ai” + mỗi câu một phép so sánh + bỏ nguyên nhân / ý kiến', vi: 'Kiểm đầu tiên ở mọi bài Task 1 cũ: có overview chưa, đúng thì chưa.' },

  { t: 'h', text: '37. (Ngày 30 · Nói mục 2) Part 3 band 6 — khung 4 bước' },
  {
    t: 'patterns',
    rows: [
      { formula: 'To some extent, yes. + lý do (so / because) + by contrast / for example + That said, … + câu chốt', vi: 'Ý kiến có mức độ → vì sao → ví dụ hoặc so sánh → mặt còn lại.', examples: [{ en: 'To some extent, yes. In the past, most people lived in small communities… That said, I wouldn\'t say people have become less kind.', vi: 'Ở một mức độ nào đó thì đúng. Ngày xưa đa số sống trong cộng đồng nhỏ… Dù vậy, tôi không cho rằng con người kém tử tế đi.' }] },
    ],
  },
  { t: 'rule', formula: 'Khởi động 3 Part → soát 12 điều → thi một mạch 11–14 phút → đọc 4 tiêu chí → so với lần trước → ghi 2 việc cần sửa', vi: 'Quy trình mỗi lần thi với giám khảo AI.' },
];
