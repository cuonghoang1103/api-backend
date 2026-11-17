/**
 * Mục TRA CÔNG THỨC của IELTS Tập 3 — chặng 1 (Ngày 1–6). Soạn cùng `ngay/ngay1..6.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T3.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "K. Tên (Ngày N · mục M)" (K đánh số liên tục cả chặng) + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 * Ghép + soát chéo 18/11/2026 từ scratchpad tracuu-ngay1..6 sau khi soát nội dung ngày.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG1: Block[] = [
  /* ───────────── Ngày 1 ───────────── */
  { t: 'h', text: '1. Bảng 12 thì — 3 thời × 4 thể (Ngày 1 · mục 1)' },
  {
    t: 'table',
    caption: 'Động từ mẫu: work',
    head: ['Thể', 'Quá khứ', 'Hiện tại', 'Tương lai'],
    rows: [
      ['**Đơn**', 'S + V-ed / V2 — I **worked**', 'S + V(s/es) — she **works**', 'S + will + V — I **will work**'],
      ['**Tiếp diễn**', 'S + was / were + V-ing — I **was working**', 'S + am / is / are + V-ing — I **am working**', 'S + will be + V-ing — I **will be working**'],
      ['**Hoàn thành**', 'S + had + V3 — I **had worked**', 'S + have / has + V3 — I **have worked**', 'S + will have + V3 — I **will have worked**'],
      ['**Hoàn thành tiếp diễn**', 'S + had been + V-ing — I **had been working**', 'S + have / has been + V-ing — I **have been working**', 'S + will have been + V-ing (hiếm)'],
    ],
  },
  { t: 'rule', formula: 'Tiếp diễn = be + V-ing · Hoàn thành = have + V3 · Hoàn thành tiếp diễn = have + been + V-ing', vi: 'Đổi thời thì chỉ chia trợ động từ đầu tiên: have → had → will have.' },

  { t: 'h', text: '2. Ôn: hiện tại đơn / tiếp diễn · quá khứ đơn · hiện tại hoàn thành (Ngày 1 · mục 2–4)' },
  {
    t: 'table',
    head: ['Tín hiệu', 'Thì', 'Ví dụ'],
    rows: [
      ['Sự thật, thói quen', 'S + V(s/es)', 'The government **spends** a lot on roads.'],
      ['Xu hướng đang đổi (more and more, these days)', 'S + am / is / are + V-ing', 'More people **are choosing** to work from home.'],
      ['Động từ trạng thái (know, believe, want, have = có, belong, seem)', 'luôn thể đơn', 'I **agree** with this view. (~~am agreeing~~)'],
      ['Mốc đã đóng: in 2019 · last year · ago', 'S + V-ed / V2', 'The city **built** a bridge in 2019.'],
      ['Khoảng chưa đóng: so far · this year · over the past ten years · for / since', 'S + have / has + V3', 'The city **has built** three bridges over the past ten years.'],
      ['Thói quen / trạng thái ngày xưa', 'S + used to + V (would chỉ cho hành động)', 'I **used to live** in Hue.'],
    ],
  },
  { t: 'rule', formula: 'Mốc đã đóng → S + V-ed / V2 · Khoảng chưa đóng / không nêu lúc nào → S + have / has + V3', vi: 'Mở thân bài Task 2: Over the past few decades, … has + V3.' },

  { t: 'h', text: '3. Hiện tại hoàn thành tiếp diễn — have / has been + V-ing (Ngày 1 · mục 5)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'S + have / has + been + V-ing (+ for / since …)',
        vi: 'Hoạt động kéo dài từ quá khứ tới bây giờ — trả lời How long…?; hoặc vừa dừng, còn dấu vết.',
        examples: [
          { en: 'I **have been learning** English for six years.', vi: 'Tôi học tiếng Anh được sáu năm rồi.' },
          { en: 'How long **have** you **been living** in this city?', vi: 'Bạn sống ở thành phố này bao lâu rồi?' },
        ],
      },
    ],
  },
  {
    t: 'table',
    head: ['have / has + V3', 'have / has been + V-ing'],
    rows: [
      ['Kết quả, số lượng: I **have written** three reports.', 'Quá trình, độ dài: I **have been writing** reports all week.'],
      ['How **many**…?', 'How **long**…?'],
      ['Dùng với động từ trạng thái: I **have known** her for years.', 'Không dùng với động từ trạng thái: ~~have been knowing~~'],
    ],
  },
  { t: 'rule', formula: 'S + have / has + been + V-ing + for / since …', vi: 'Nhấn “bao lâu”. Đếm số lần / kết quả hoặc gặp động từ trạng thái thì dùng have / has + V3.' },

  { t: 'h', text: '4. Quá khứ hoàn thành — had + V3 · had been + V-ing (Ngày 1 · mục 6)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'S + had + V3 … when / before / by the time + S + V-ed',
        vi: 'Việc ở vế had + V3 xong TRƯỚC việc ở vế quá khứ đơn.',
        examples: [
          { en: 'By the time the police **arrived**, the thieves **had escaped**.', vi: 'Lúc cảnh sát đến thì bọn trộm đã trốn mất rồi.' },
          { en: 'She **failed** because she **had not revised** enough.', vi: 'Cô ấy trượt vì trước đó ôn chưa đủ.' },
        ],
      },
      {
        formula: 'By + năm quá khứ, S + had + V3',
        vi: 'Task 1: tính tới một năm quá khứ, con số ĐÃ đạt mức nào.',
        examples: [{ en: '**By 2010**, the figure **had risen** to 60%.', vi: 'Tính tới năm 2010, con số đã tăng lên 60%.' }],
      },
      {
        formula: 'S + had been + V-ing',
        vi: 'Hoạt động kéo dài suốt tới một mốc quá khứ (giải thích tình trạng lúc đó).',
        examples: [{ en: 'She was exhausted because she **had been working** since 5 a.m.', vi: 'Cô ấy kiệt sức vì đã làm việc suốt từ 5 giờ sáng.' }],
      },
    ],
  },
  { t: 'rule', formula: 'Việc trước: S + had + V3 → Việc sau (mốc): S + V-ed', vi: 'Phải có HAI việc quá khứ để so. Một việc đơn lẻ, dù đã lâu, vẫn là quá khứ đơn.' },

  { t: 'h', text: '5. Chọn thì trong bài thi (Ngày 1 · mục 8)' },
  {
    t: 'table',
    head: ['Phần thi', 'Thì chính', 'Thì phụ'],
    rows: [
      ['Task 1 — năm quá khứ', 'Quá khứ đơn', 'The graph **shows**… · **By 2010**, it **had fallen** to 5%.'],
      ['Task 1 — không có năm', 'Hiện tại đơn', '—'],
      ['Task 2', 'Hiện tại đơn', 'Xu hướng: has + V3 / is V-ing · Ví dụ thật: quá khứ đơn'],
      ['Speaking Part 1', 'Hiện tại đơn', 'How long…? → have been V-ing · Ngày xưa: used to'],
      ['Speaking Part 2 kể chuyện', 'Quá khứ đơn', 'Nền: was V-ing · Việc trước đó: had V3'],
    ],
  },

  { t: 'h', text: '6. Skim bố cục · paraphrase 4 mức (Ngày 1 · Đọc mục 2–4)' },
  { t: 'rule', formula: 'Skim = tiêu đề → đoạn đầu → câu đầu mỗi đoạn → từ báo hiệu → câu cuối (≤ 3 phút)', vi: 'Kết quả là bản đồ bài: mỗi đoạn 3–5 chữ.' },
  {
    t: 'table',
    head: ['Mức', 'Đề làm gì', 'Ví dụ'],
    rows: [
      ['① Đồng nghĩa', 'thay từ / cụm cùng nghĩa', 'find it harder to concentrate → have more difficulty focusing'],
      ['② Đổi loại từ', 'động từ ↔ danh từ ↔ tính từ', 'was completed in 1932 → the completion of the bridge in 1932'],
      ['③ Đổi cấu trúc', 'chủ động ↔ bị động · phủ định + trái nghĩa · đảo nguyên nhân – kết quả', 'Rising sea levels forced the villagers to move → The village was relocated because of rising sea levels'],
      ['④ Ý ẩn', 'cộng hai thông tin / suy ra', 'cửa hàng mở 9.00 + xe buýt đầu tiên tới 9.30 → villagers who rely on the bus cannot be there when the shop opens'],
    ],
  },
  { t: 'rule', formula: '① đồng nghĩa → ② đổi loại từ → ③ đổi cấu trúc → ④ ý ẩn', vi: 'Tìm Ý, không tìm chữ.' },

  { t: 'h', text: '7. Hai phút kiểm — 6 dòng (Ngày 1 · Nghe mục 5)' },
  { t: 'rule', formula: '2 phút kiểm = câu trống → giới hạn từ → số ít / số nhiều → chính tả → số & đơn vị → đọc lại cả dòng', vi: 'Thứ tự cố định, mỗi lượt nhìn một loại lỗi.' },

  /* ───────────── Ngày 2 ───────────── */
  { t: 'h', text: '8. Giới từ và dạng từ của AWL sublist 3 — chỗ hay sai (Ngày 2 · Từ vựng mục 1–4)' },
  {
    t: 'table',
    head: ['Cụm đúng', 'Lỗi hay gặp', 'Ví dụ'],
    rows: [
      ['contribute **to** + N / V-ing', '~~contribute to improve~~', 'Poor teaching **contributes to** low motivation.'],
      ['place / put **emphasis on** · emphasise + N', '~~emphasise on~~', 'Schools **place** too much **emphasis on** exam results.'],
      ['rely **on** · reliance **on**', '~~rely to~~', 'Many students **rely on** their parents.'],
      ['an alternative **to** + N / V-ing', '~~alternative for~~', 'Online courses offer **an alternative to** classroom teaching.'],
      ['criterion (số ít) → **criteria** (số nhiều)', '~~a criteria~~ · ~~criterias~~', 'marked against four **criteria**'],
      ['technology (công nghệ) · technique (cách làm) · technical (adj)', '~~modern techniques like smartphones~~', '**Technology** has changed the way we learn.'],
    ],
  },
  { t: 'rule', formula: 'contribute to / an alternative to + V-ing (to là giới từ)', vi: 'Học từ AWL theo cụm: động từ + giới từ + loại từ đi sau.' },

  { t: 'h', text: '9. Band 5 và band 6 — Writing Task 2 theo bốn tiêu chí (Ngày 2 · Viết mục 1)' },
  {
    t: 'table',
    head: ['Tiêu chí', 'Band 5', 'Band 6'],
    rows: [
      ['**TR**', 'Trả lời đề chỉ một phần; quan điểm không rõ suốt bài', 'Trả lời đủ mọi phần; quan điểm rõ; ý chính có giải thích'],
      ['**CC**', 'Thiếu tiến triển; từ nối thiếu / thừa / sai', 'Có tiến triển; từ nối hiệu quả dù đôi chỗ máy móc; chia đoạn chưa luôn hợp lý (mỗi đoạn một ý trung tâm rõ = band 7)'],
      ['**LR**', 'Vốn từ hạn chế; lỗi gây khó hiểu', 'Đủ rộng; thử từ ít gặp; lỗi không cản hiểu'],
      ['**GRA**', 'Thử câu phức nhưng sai nhiều', 'Trộn câu đơn + phức; lỗi hiếm khi làm sai nghĩa'],
    ],
  },
  { t: 'rule', formula: 'Viết → tự chấm 12 câu (đoán band từng tiêu chí) → AI chấm → so hai kết quả → ghi sổ lỗi → viết lại', vi: 'Tự chấm TRƯỚC khi xem điểm AI.' },

  { t: 'h', text: '10. Sổ lỗi theo mã · viết lại 3 phiên bản (Ngày 2 · Viết mục 6–7)' },
  {
    t: 'table',
    head: ['Mã', 'Loại lỗi', 'Ví dụ → sửa'],
    rows: [
      ['**A**', 'Mạo từ', '~~in the life~~ → in life'],
      ['**S**', 'Số ít – số nhiều, chủ – vị', '~~skills is~~ → skills are'],
      ['**T**', 'Thì', '~~I am learning for 5 years~~ → I have been learning'],
      ['**P**', 'Giới từ', '~~in the end of month~~ → at the end of the month'],
      ['**W**', 'Từ sai, dạng từ, collocation', '~~more quick~~ → more quickly'],
      ['**L**', 'Từ nối thừa / sai vai', '~~Moreover~~ (ý đối lập) → However'],
      ['**C**', 'Câu cụt, câu lê thê, dấu câu', '~~Because it is cheap.~~ → gộp vào câu trước'],
      ['**I**', 'Ý: thiếu vì sao / ví dụ, đổi lập trường', '+ because… / for instance…'],
    ],
  },
  { t: 'rule', formula: 'Bản 1 (gốc) → Bản 2: sửa CÂU theo mã A · S · T · P · W · L · C → Bản 3: sửa Ý theo mã I', vi: 'Sửa câu trước cho bài sạch (band 5.5), rồi mới phát triển ý (band 6+).' },

  { t: 'h', text: '11. Câu khung Task 2 band 6 (Ngày 2 · Viết mục 9)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'I partly agree: + ý đồng ý, but + ý giới hạn.',
        vi: 'Thesis có mức độ.',
        examples: [{ en: 'I partly agree: these skills deserve a place in the curriculum, but they should not replace academic subjects.', vi: 'Tôi đồng ý một phần: các kỹ năng này xứng đáng có chỗ trong chương trình, nhưng không nên thay thế môn học thuật.' }],
      },
      {
        formula: 'S + V … . As a result, S + V … .',
        vi: 'Đẩy ý tới hệ quả.',
        examples: [{ en: 'Many teenagers never learn to plan a budget. As a result, they often get into debt at university.', vi: 'Nhiều thiếu niên không bao giờ học lập ngân sách. Kết quả là họ thường mắc nợ khi vào đại học.' }],
      },
      {
        formula: 'S + V …, whereas S + V … .',
        vi: 'So sánh đối lập trong một câu phức.',
        examples: [{ en: 'Cooking can be learned in a few months, whereas it takes years to catch up on maths.', vi: 'Nấu ăn có thể học trong vài tháng, trong khi phải mất nhiều năm để bù lại môn toán.' }],
      },
      {
        formula: 'In conclusion, I agree that + S + V, but only + điều kiện.',
        vi: 'Kết bài nhắc lại đúng lập trường của mở bài.',
        examples: [{ en: 'In conclusion, I agree that practical skills should be taught, but only as a small part of the timetable.', vi: 'Tóm lại, tôi đồng ý rằng nên dạy kỹ năng thực hành, nhưng chỉ như một phần nhỏ của thời khoá biểu.' }],
      },
    ],
  },
  { t: 'rule', formula: 'Thesis có mức độ → câu chủ đề trả lời đề → vì sao (because / As a result) → ví dụ cụ thể (for instance) → câu chốt nối về lập trường', vi: 'Xương sống của mọi thân bài band 6 trong Tập 3.' },

  { t: 'h', text: '12. Speaking band 6 — năm thói quen (Ngày 2 · Nói mục 2 và 6)' },
  {
    t: 'table',
    head: ['Thói quen', 'Khung câu', 'Ví dụ'],
    rows: [
      ['1. Mở rộng', 'Trả lời + because … + For example, …', 'Yes, quite a lot, **because** it helps me relax. **For example**, I read before bed.'],
      ['2. Từ nối khi nói', 'Well, · Actually, · To be honest, · I\'d say · The thing is, · Having said that,', '**To be honest**, I\'ve never really enjoyed history.'],
      ['3. Nói vòng khi quên từ', 'It\'s a kind of + N that … · the thing you use to + V · I\'m not sure of the exact word, but it\'s …', '**It\'s a kind of** long white coat that scientists wear.'],
      ['4. Tự sửa gọn', '… — I mean, …', 'She teach, **I mean**, she taught me for two years.'],
      ['5. Kết dứt khoát', 'So overall, … · So that\'s why …', '**So overall**, I\'d say it depends on the teacher.'],
    ],
  },
  { t: 'rule', formula: 'Trả lời → because … → For example, … → (Having said that, …) → So overall, …', vi: 'Câu trả lời band 6 = câu trả lời band 5 + lý do + ví dụ + câu chốt.' },

  /* ───────────── Ngày 3 ───────────── */
  { t: 'h', text: '13. Ba cách nói CHUNG về một loại (Ngày 3 · mục 2)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Ø + N số nhiều / N không đếm được + V', vi: 'Mặc định, an toàn nhất — dùng cho mọi câu nói chung của Task 2 / Part 3.', examples: [{ en: 'Smartphones have changed the way people communicate.', vi: 'Điện thoại thông minh đã thay đổi cách con người liên lạc.' }] },
      { formula: 'The + N số ít + V(s/es)', vi: 'Học thuật: cả loại như một khái niệm (phát minh, loài vật, nhạc cụ).', examples: [{ en: 'The tiger is in danger of extinction.', vi: 'Loài hổ đang có nguy cơ tuyệt chủng.' }] },
      { formula: 'A / An + N số ít + V(s/es)', vi: 'Định nghĩa; điều đúng với bất kỳ một cá thể nào.', examples: [{ en: 'A teacher needs a great deal of patience.', vi: 'Một người giáo viên cần rất nhiều kiên nhẫn.' }] },
    ],
  },
  { t: 'rule', formula: 'Nói chung: Ø + N số nhiều (mặc định) · The + N số ít (học thuật) · A / An + N số ít (định nghĩa)', vi: 'Không dùng the + danh từ số nhiều cho câu nói chung về một loại (the + số nhiều = một nhóm cụ thể). Ngoại lệ: tên dân tộc — the Germans, the Thais (mục 4).' },

  { t: 'h', text: '14. Danh từ chung luôn có the — và nhóm luôn Ø (Ngày 3 · mục 3)' },
  {
    t: 'table',
    head: ['Luôn the', 'Luôn Ø khi nói chung'],
    rows: [
      ['the environment · the climate · the weather', 'society (~~the society~~) · nature (~~the nature~~)'],
      ['the government · the state · the police', 'people · humanity · life · health'],
      ['the economy · the job market · the workforce', 'education · crime · technology · science'],
      ['the internet · the media · the public', 'public transport · social media · work'],
      ['the world · the past / present / future · the cost of living', 'unemployment · poverty · pollution · tourism'],
    ],
  },
  { t: 'rule', formula: 'the + environment / government / economy / internet / media / public · Ø + society / nature / people / education / technology', vi: 'Thứ cả xã hội chia sẻ một cái → the. Khái niệm trừu tượng nói chung → Ø.' },

  { t: 'h', text: '15. the + tính từ = cả một nhóm người (Ngày 3 · mục 4)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'the + adj + V (số nhiều)', vi: 'the rich · the poor · the elderly · the young · the unemployed · the homeless — không thêm -s, động từ số nhiều.', examples: [{ en: 'The elderly are more likely to live alone.', vi: 'Người cao tuổi có khả năng sống một mình cao hơn.' }, { en: 'The gap between the rich and the poor is widening.', vi: 'Khoảng cách giàu nghèo đang nới rộng.' }] },
    ],
  },
  { t: 'rule', formula: 'the + adj (rich / poor / elderly / young / unemployed) + V số nhiều', vi: 'Một người → a / an + adj + person.' },

  { t: 'h', text: '16. Danh từ có cụm chỉ rõ phía sau (Ngày 3 · mục 5)' },
  {
    t: 'table',
    head: ['Nói chung — Ø', 'Được chỉ rõ — the', 'Vẫn là a / an'],
    rows: [
      ['Education is the key.', 'The education of girls has improved.', 'a lack of money · a range of courses'],
      ['History is my favourite subject.', 'The history of Vietnam is fascinating.', 'a member of · a kind of · a total of'],
      ['Information is easy to find.', 'The information that you gave me was wrong.', 'a rise of 5 % · a sharp rise in'],
      ['—', 'The number of cars has risen. (con số, V số ít)', 'A number of cars were damaged. (một số, V số nhiều)'],
      ['—', 'Task 1: The proportion of students who… rose to 40 %. (con số xác định trên hình)', 'có tính từ chỉ mức: a large proportion of · a small percentage of'],
    ],
  },
  { t: 'rule', formula: 'Ø + N chung → the + N + of / that / which / in… · nhưng: a number of · a lack of · a range of · a rise of 5 %', vi: 'Có cụm chỉ rõ cái nào → the. Chỉ số lượng, một trong nhiều → a / an.' },

  { t: 'h', text: '17. Danh từ không đếm được hay sai (Ngày 3 · mục 6)' },
  {
    t: 'table',
    head: ['Không a / an, không -s', 'Muốn đếm thì nói'],
    rows: [
      ['information · advice · news · knowledge · research · evidence · feedback', 'a piece of advice / information / evidence · a study'],
      ['equipment · furniture · luggage · software · rubbish · clothing', 'a piece of equipment / furniture · an item of clothing'],
      ['traffic · pollution · progress · employment · behaviour', 'a traffic jam · a type of pollution'],
      ['work · homework · accommodation · money', 'a job · a task · an assignment · a flat'],
    ],
  },
  { t: 'rule', formula: 'N không đếm được + V số ít · không a / an · không -s · ngoại lệ: a good knowledge of · a clear understanding of · a good education', vi: 'research shows (không researches show); some advice (không an advice).' },

  { t: 'h', text: '18. Mạo từ trong cụm cố định (Ngày 3 · mục 7)' },
  {
    t: 'table',
    head: ['Ø', 'the', 'a / an'],
    rows: [
      ['go to school / university / work / prison · by bus · on foot', 'in the morning · in the 1990s · in the past / future', 'once a week · 60 km an hour'],
      ['at night · at home · last year · next month · in 2020', 'the same · the only · the first · the most popular', 'as a result · as a whole · on a daily basis'],
      ['most people · in society · in public · in general', 'on the internet · on the one hand / on the other hand', 'play a role in · have an impact on · make a decision'],
    ],
  },
  { t: 'rule', formula: 'Tự soát 4 bước: ① N đếm được số ít đứng trần ② chữ the trong câu nói chung ③ society · nature · people · research · information · advice ④ cụm cố định + cụm of', vi: 'Soát mạo từ 2 phút cuối mỗi bài viết.' },

  { t: 'h', text: '19. 8 phép paraphrase (Ngày 3 · Đọc mục 2)' },
  {
    t: 'table',
    head: ['Phép', 'Trong bài', 'Trong câu hỏi'],
    rows: [
      ['P1 Đồng nghĩa', 'A vessel could spend as long in port as at sea.', 'A ship might stay in port for about as much time as it spent sailing.'],
      ['P2 Trái nghĩa + phủ định', 'The idea spread slowly.', 'The idea did not spread quickly.'],
      ['P3 Đổi loại từ', 'The unions resisted the change.', 'There was resistance from the unions.'],
      ['P4 Chủ động ↔ bị động', 'His company was hired by the military.', 'The military hired his company.'],
      ['P5 Đảo chiều so sánh', 'Machines were far cheaper than hand loading.', 'Hand loading was much more expensive than machines.'],
      ['P6 Con số ↔ lời', 'fifty-eight containers · three in ten', 'nearly sixty containers · fewer than half'],
      ['P7 Cụ thể ↔ khái quát', 'ships, trains and lorries', 'different forms of transport'],
      ['P8 Ý suy ra chắc chắn', 'a converted oil tanker', 'not originally built for containers'],
    ],
  },
  { t: 'rule', formula: 'TFNG: chẻ nhận định 3 mảnh (ai · làm gì · từ giới hạn) → định vị → đối chiếu từng mảnh → cả 3 khớp TRUE · có mảnh ngược FALSE · có mảnh bài không nói NOT GIVEN', vi: 'Bẫy band 6: ⑥ đúng một nửa · ⑦ đổi chủ thể · ⑧ lời kể / dự định ↔ sự thật · ⑨ kiến thức ngoài bài.' },

  { t: 'h', text: '20. 12 khung câu hỏi Part 1 (Ngày 3 · Nói mục 1)' },
  {
    t: 'table',
    head: ['Khung', 'Câu 1', 'Kéo dài'],
    rows: [
      ['Do you like X?', "I'm really keen on… / I'm not a big fan of…", 'lý do + một ví dụ cụ thể'],
      ['How often…?', 'Since I started…, I only… about twice a month.', 'I used to… much more often.'],
      ['When was the last time…?', "It's been… since I last… / The last time I… was…", '2 câu quá khứ rồi dừng'],
      ['Do you prefer X or Y?', "I'd go for X. / It depends on…", 'although Y is… / whereas…'],
      ['Is X popular in your country?', "It's hugely popular, especially among…", 'more and more people are…'],
      ['How has X changed?', "It has changed quite a lot. / It hasn't changed much.", '…used to…, but these days…'],
      ['Did you do X as a child?', 'Yes, all the time. / Not really — when I was a kid, I…', 'would / used to + These days I…'],
      ['What do you dislike about X?', 'The one thing that annoys me about X is…', 'Apart from that, I quite like it.'],
      ['Is it easy / difficult to…?', 'It can be quite tricky to… / It’s fairly easy to…', 'unless… / as long as…'],
      ['What is the best time to…?', "I'd say the best time is…, when…", "I'd avoid…, because…"],
      ['Is X suitable for…?', "On the whole, yes. / Not really, I'd say.", 'although it might not be ideal for…'],
      ['What kind of X do you like most?', "I like all kinds of X, but if I had to choose one, I'd go for…", 'vì sao + một ví dụ'],
    ],
  },
  { t: 'rule', formula: "I like all kinds of X, but if I had to choose one, I'd go for… · It's been… since I last + V2 · It depends on… If…, But if…", vi: 'Nghe khung → câu 1 trả lời thẳng → lý do / ví dụ cụ thể → mặt kia hoặc trước–nay → dừng (15–25 giây).' },

  { t: 'h', text: '21. Nối âm: phụ âm → nguyên âm và linking /r/ (Ngày 3 · Nói mục 8)' },
  {
    t: 'table',
    head: ['Phép nối', 'Luật', 'Ví dụ'],
    rows: [
      ['Phụ âm → nguyên âm', 'Phụ âm cuối trượt sang nguyên âm đầu của từ sau', 'a lot‿of · try‿it‿on · it‿depends‿on · twice‿a week'],
      ['Linking /r/ (Anh-Anh)', 'r cuối từ vốn câm; từ sau bắt đầu bằng nguyên âm thì /r/ xuất hiện để nối', 'weather‿is · for‿example · more‿often · far‿away · a pair‿of jeans'],
      ['Không nối /r/', 'Từ sau bắt đầu bằng phụ âm → r vẫn câm', 'the weather changes · for me'],
    ],
  },
  { t: 'rule', formula: 'C + V → nối · r + V → /r/ xuất hiện · chỉ nối trong một cụm nghĩa', vi: 'Giọng Mỹ / Canada đọc /r/ ở mọi vị trí — theo giọng nào cũng được, miễn nhất quán.' },

  /* ───────────── Ngày 4 ───────────── */
  { t: 'h', text: '22. Động từ pháp lý + giới từ · cụm chủ đề Crime (Ngày 4 · Từ vựng mục 4–6)' },
  {
    t: 'table',
    head: ['Cụm', 'Nghĩa', 'Ví dụ'],
    rows: [
      ['steal + vật · rob + người / nơi', 'lấy trộm cái gì · cướp của ai / ở đâu', 'Someone stole my phone. · Two men robbed the bank.'],
      ['arrest sb for · charge sb with · accuse sb of', 'bắt vì · buộc tội · cáo buộc', 'He was charged with fraud.'],
      ['convict sb of · sentence sb to', 'kết tội · tuyên án', 'She was sentenced to five years in prison.'],
      ['commit a crime · break / obey the law', 'phạm tội · phạm / tuân thủ luật', 'People who commit serious crimes should lose their freedom.'],
      ['serve a sentence · be released from prison', 'chấp hành án · được ra tù', 'After serving their sentences, many offenders cannot find work.'],
      ['act as a deterrent · a harsh / lenient punishment', 'có tác dụng răn đe · hình phạt nặng / nhẹ', 'Heavy fines act as a deterrent to dangerous driving.'],
      ['reoffend · the reoffending rate · a repeat offender', 'tái phạm · tỉ lệ tái phạm · người tái phạm nhiều lần', 'Education in prison lowers the reoffending rate.'],
      ['reintegrate into society · the root causes of crime · turn to crime', 'tái hoà nhập · nguyên nhân gốc rễ · sa vào phạm tội', 'Job training helps offenders reintegrate into society.'],
    ],
  },
  { t: 'rule', formula: 'While prison is necessary for + nhóm A, I believe that + hình phạt B + is more effective for + nhóm C.', vi: 'Câu luận điểm có mức độ cho mọi đề Crime: chia theo loại tội (bạo lực ↔ tội nhẹ) hoặc loại người (tái phạm ↔ lần đầu).' },

  { t: 'h', text: '23. Overview Task 1 band 6 — chọn 2 điểm bằng 4 câu hỏi (Ngày 4 · Viết mục 2)' },
  {
    t: 'table',
    head: ['Câu hỏi', 'Hình có thời gian', 'Hình không thời gian'],
    rows: [
      ['Q1 Chiều chung?', 'Các đường lên / xuống / đứng yên? Có nhóm ngược chiều?', 'Số liệu tăng / giảm dần theo trục hạng mục (tuổi, thu nhập)?'],
      ['Q2 Ai nhất?', 'Cao nhất / thấp nhất suốt giai đoạn', 'Lớn nhất / nhỏ nhất'],
      ['Q3 Đổi ngôi?', 'Thứ hạng đầu–cuối khác nhau? Đường nào vượt đường nào?', 'Thứ hạng hai chuỗi đảo nhau giữa các nhóm?'],
      ['Q4 Ngoại lệ?', 'Đường gần như không đổi', 'Nhóm khác hẳn phần còn lại'],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'Overall, A and B + V (giảm), whereas C + V (tăng).', vi: 'Hình động — hai nhóm ngược chiều.', examples: [{ en: 'Overall, burglary and vehicle theft became far less common, whereas online fraud rose dramatically.', vi: 'Nhìn chung, đột nhập trộm cắp và trộm xe ít hơn hẳn, trong khi lừa đảo trực tuyến tăng rất mạnh.' }] },
      { formula: 'As a result, C went from being the least… to the most…, while D hardly changed.', vi: 'Hình động — đổi ngôi + ngoại lệ.', examples: [{ en: 'As a result, online fraud went from being the rarest of the four offences to by far the most frequent, while shoplifting hardly changed.', vi: 'Kết quả là lừa đảo trực tuyến từ hiếm nhất thành phổ biến nhất, còn trộm hàng trong cửa hiệu hầu như không đổi.' }] },
      { formula: 'Overall, + N + increased with age, but the rise was much steeper for A.', vi: 'Hình tĩnh — tăng dần theo hạng mục.', examples: [{ en: 'Overall, concern about both crimes increased with age, but the rise was much steeper for online fraud.', vi: 'Nhìn chung, nỗi lo về cả hai tội tăng theo tuổi, nhưng dốc hơn nhiều ở lừa đảo trực tuyến.' }] },
      { formula: 'It is clear that A accounted for the largest share of…, while B made up the smallest.', vi: 'Hình tĩnh — ai lớn nhất, ai nhỏ nhất.', examples: [{ en: 'It is clear that fines accounted for the largest share of sentences, while probation made up the smallest.', vi: 'Rõ ràng phạt tiền chiếm phần lớn nhất, còn quản chế chiếm phần nhỏ nhất.' }] },
    ],
  },
  { t: 'rule', formula: 'Overall, + [Q1 chiều chung], whereas… + As a result / In addition, + [Q2 / Q3 / Q4: ai nhất · đổi ngôi · ngoại lệ].', vi: 'Overview band 6 = 2 điểm; không số, không lý do, nói về cả hình; đặt ngay sau mở bài.' },

  { t: 'h', text: '24. Nhóm số liệu và câu khung thân bài (Ngày 4 · Viết mục 3 + 6)' },
  {
    t: 'table',
    head: ['Việc', 'Khung', 'Ví dụ'],
    rows: [
      ['Nhóm ① theo chiều xu hướng', 'Body 1: các đường giảm · Body 2: đường tăng + đường đứng yên', 'hình động, các đường khác chiều'],
      ['Nhóm ② theo độ lớn', 'Body 1: nhóm cao · Body 2: nhóm thấp', 'hình tĩnh / các đường cùng chiều'],
      ['Nhóm ③ theo điểm đổi ngôi', 'Body 1: trước mốc (A > B) · Body 2: từ mốc trở đi (B > A)', 'có năm / nhóm tuổi mà thứ hạng đảo'],
      ['Mở nhóm', 'In + năm, A was the most…, at + số, followed by B at + số.', 'In 2000, burglary was the most common crime, at 18 cases, followed by vehicle theft at 14.'],
      ['Tả cả nhóm', 'Both figures + V…, and by + năm they stood at X and Y respectively.', 'Both figures fell steadily, and by 2020 they stood at 6 and 5 respectively.'],
      ['Tả trọn một đường', 'Starting at X, it climbed to Y in + năm and finished the period at Z.', 'Starting at just 1 case, it climbed to 8 in 2010 and finished the period at 21.'],
      ['So sánh bội / phân số', '…, more than three times the figure for B. · roughly a third of…', '…at 21, more than three times the figure for burglary.'],
      ['Đường phẳng', 'D, by contrast, remained stable, fluctuating between X and Y.', 'Shoplifting, by contrast, remained stable, fluctuating between 8 and 9 cases.'],
      ['Hình tĩnh: so hai chuỗi', 'Among + nhóm, X % were…, compared with only Y % for…', 'Among 16–24-year-olds, 35% were worried about burglary, compared with only 22% for online fraud.'],
    ],
  },
  { t: 'rule', formula: 'Body 1 = nhóm có chung đặc điểm X · Body 2 = nhóm còn lại · mỗi nhóm: đầu → cuối + đỉnh / đổi ngôi + 1 phép so sánh', vi: 'Chia theo câu chuyện của số liệu, không theo thứ tự năm hay thứ tự chú thích; mỗi đường tối đa 3 con số.' },

  { t: 'h', text: '25. Part 2: MCQ + Map labelling vòng 2 (Ngày 4 · Nghe mục 2–3)' },
  {
    t: 'table',
    head: ['Cụm vị trí', 'Nghĩa', 'Ví dụ'],
    rows: [
      ['at the far end of / all the way to the end', 'tận cuối', 'Follow the path all the way to its western end.'],
      ['the last building on the north side', 'toà cuối ở phía bắc (của lối đi)', 'It’s the last building on the north side.'],
      ['directly across the path from / facing it', 'đối diện ngay bên kia', 'Directly across the path from it is the office.'],
      ['just past / just beyond', 'ngay sau khi qua', 'Just past the flagpole, on your left, is the shelter.'],
      ['where the two paths cross', 'chỗ hai lối giao nhau', 'Stop at the flagpole, where the two paths cross.'],
      ['back onto', 'lưng giáp với', 'The washrooms back onto the parking lot.'],
      ['Đi về Bắc: trái = Tây, phải = Đông', 'Đi về Tây: trái = Nam, phải = Bắc', 'Đi về Đông: trái = Bắc, phải = Nam'],
    ],
  },
  { t: 'rule', formula: 'MCQ: nghe thấy chữ của phương án ≠ đáp án · chờ not / but / actually / used to / put off · Map: used to be = không phải đáp án · ô thừa cũng được nhắc', vi: 'Từ Canada: washroom (toilet) · parkade / parking lot (car park) · loonie / toonie (xu 1 / 2 đô) · runners (trainers) · fall (autumn).' },

  /* ───────────── Ngày 5 ───────────── */
  { t: 'h', text: '26. Tương lai tiếp diễn: will be + V-ing (Ngày 5 · mục 2)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + will be + V-ing + mốc tương lai', vi: 'Tại mốc đó việc đang diễn ra; cũng tả xu hướng tương lai.', examples: [{ en: 'This time next week I will be sitting my IELTS test.', vi: 'Giờ này tuần sau tôi đang ngồi thi IELTS.' }, { en: 'In twenty years\' time, most people will be working from home.', vi: 'Hai mươi năm nữa, đa số mọi người sẽ làm việc ở nhà.' }] },
      { formula: 'Will + S + be + V-ing …?', vi: 'Hỏi lịch trình một cách lịch sự.', examples: [{ en: 'Will you be using the meeting room this afternoon?', vi: 'Chiều nay anh có dùng phòng họp không ạ?' }] },
    ],
  },
  { t: 'rule', formula: 'S + will be + V-ing + mốc tương lai (at 8 p.m. / this time next year / in 2040)', vi: 'Tại mốc tương lai đó, việc đang diễn ra (chưa xong). Không dùng với động từ trạng thái (know, own, need).' },

  { t: 'h', text: '27. Tương lai hoàn thành: will have + V3 · will have been + V-ing (Ngày 5 · mục 3–4)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + will have + V3 + by + mốc thời gian', vi: 'Tính tới mốc đó, việc đã hoàn thành.', examples: [{ en: 'By 2040, the number of people aged over 65 will have doubled.', vi: 'Tới năm 2040, số người trên 65 tuổi sẽ tăng gấp đôi rồi.' }] },
      { formula: 'By the time + S + V(s/es), S + will have + V3', vi: 'Vế by the time dùng hiện tại đơn, không will.', examples: [{ en: 'By the time you read this, I will have left.', vi: 'Lúc bạn đọc tin này thì tôi đã đi rồi.' }] },
      { formula: 'By + mốc, S + will have been + V-ing + for + khoảng thời gian', vi: 'Tính tới mốc, hành động đã kéo dài bao lâu (hiếm).', examples: [{ en: 'By next June, I will have been learning English for eight years.', vi: 'Tới tháng Sáu tới, tôi học tiếng Anh được tám năm.' }] },
    ],
  },
  {
    t: 'table',
    caption: 'Chọn thì tương lai',
    head: ['Dấu hiệu', 'Thì', 'Ví dụ'],
    rows: [
      ['by + mốc, ý “đã xong trước đó”', 'will have + V3', 'By 2030 the government **will have built** 5,000 homes.'],
      ['mốc + ý “lúc đó đang dở” / xu hướng', 'will be + V-ing', 'This time next year it **will be building** the homes.'],
      ['chỉ dự đoán / sẽ xảy ra', 'will + V', 'It **will build** 5,000 homes next year.'],
    ],
  },
  { t: 'rule', formula: 'S + will have + V3 + by + mốc tương lai · By the time + S + V(s/es), S + will have + V3', vi: 'by = tính tới (đã xong trước mốc); khác in / at (tại mốc) và until (kéo dài tới).' },

  { t: 'h', text: '28. Dự báo trong Writing Task 1 — biểu đồ có năm tương lai (Ngày 5 · mục 6)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + is / are + expected / projected / predicted / forecast + to + V', vi: 'Bị động dự báo — luân phiên bốn động từ.', examples: [{ en: 'The share of solar power is projected to reach 35% by 2040.', vi: 'Tỉ trọng điện mặt trời được dự phóng đạt 35% vào năm 2040.' }] },
      { formula: 'S + is / are + likely / set + to + V', vi: 'Có khả năng / sắp.', examples: [{ en: 'Solar is set to overtake coal before 2030.', vi: 'Điện mặt trời sắp vượt than trước năm 2030.' }] },
      { formula: 'It is + predicted / expected + that + S + will + V', vi: 'Chủ ngữ giả It + mệnh đề that.', examples: [{ en: 'It is predicted that solar power will account for over a third of electricity in 2040.', vi: 'Người ta dự đoán điện mặt trời sẽ chiếm hơn một phần ba sản lượng điện vào năm 2040.' }] },
      { formula: '…, followed by a projected / predicted / forecast + rise / fall + to + số', vi: 'Dạng danh từ — nối hai giai đoạn trong một câu.', examples: [{ en: 'Solar power grew to 15% in 2020, followed by a projected rise to 35% by 2040.', vi: 'Điện mặt trời tăng lên 15% năm 2020, tiếp theo là mức tăng dự báo lên 35% vào năm 2040.' }] },
      { formula: 'S + V2 (quá khứ) …, before being expected / projected + to + V', vi: 'Đổi thì giữa câu — một đường, một câu.', examples: [{ en: 'The figure for coal fell steadily to 31% in 2020, before being expected to drop to 14% by 2040.', vi: 'Số liệu của than giảm đều xuống 31% năm 2020, trước khi được dự kiến tụt xuống 14% vào năm 2040.' }] },
      { formula: 'S + will have + V3 + by + năm', vi: 'Kết quả tích luỹ tới năm cuối.', examples: [{ en: 'By 2040, the share of coal will have more than halved compared with 2020.', vi: 'Tới năm 2040, tỉ trọng than sẽ giảm còn chưa tới một nửa so với năm 2020.' }] },
    ],
  },
  { t: 'rule', formula: 'S + V2 … in 2020, before being projected to + V … by 2040 · …, followed by a projected rise to + số', vi: 'Quá khứ đơn cho phần đã xảy ra, ngôn ngữ dự báo cho phần tương lai; overview bao cả hai giai đoạn.' },

  { t: 'h', text: '29. Speaking Part 3 — trả lời câu hỏi dự đoán (Ngày 5 · mục 7)' },
  { t: 'rule', formula: 'In + N + years\' time, S + will be + V-ing · By then, S + will (probably) have + V3 · S + is likely to + V', vi: 'Xu hướng lúc đó + thứ đã thay đổi xong + mức độ chắc (is bound to · may well · I doubt… will).' },

  { t: 'h', text: '30. Matching headings — ý chính vs chi tiết (Ngày 5 · Đọc mục 2–4)' },
  {
    t: 'table',
    caption: 'Bốn kiểu đoạn — ý chính nằm ở đâu',
    head: ['Kiểu đoạn', 'Dấu hiệu', 'Ý chính ở'],
    rows: [
      ['① Nêu rồi chứng minh', 'câu đầu khái quát + For example, số liệu', 'câu đầu'],
      ['② Đảo chiều', 'However, Yet, But, In fact', 'ngay sau từ đảo chiều'],
      ['③ Dẫn rồi kết', 'mở bằng ví dụ / câu chuyện; cuối đoạn therefore, this shows', 'câu cuối'],
      ['④ Hai nửa', 'nguyên nhân → hệ quả; vấn đề → giải pháp', 'cả hai nửa'],
    ],
  },
  { t: 'rule', formula: 'Tiêu đề đúng = paraphrase của Ý CHÍNH, đúng cho gần hết cả đoạn · Tiêu đề bẫy = chữ trùng với MỘT chi tiết', vi: 'Sáu bẫy: trùng chữ · chi tiết / ví dụ · đúng một nửa · quá rộng · trái nghĩa · đúng cho đoạn khác.' },

  { t: 'h', text: '31. Ghi số liệu khi nghe (Ngày 5 · Nghe mục 1–6)' },
  {
    t: 'table',
    caption: 'Nghe → viết',
    head: ['Nghe', 'Viết', 'Ghi chú'],
    rows: [
      ['nought point seven five', '0.75', 'thập phân dùng dấu CHẤM; sau point đọc từng số'],
      ['six thousand four hundred and fifty', '6,450', 'hàng nghìn dùng dấu PHẨY'],
      ['a quarter of a million · half a million', '250,000 · 500,000', 'two point three million = 2,300,000'],
      ['nineteen oh eight · twenty thirty', '1908 · 2030', 'the nineteenth century = the 1800s'],
      ['a third · three quarters · one in five', '1/3 · 3/4 · 20%', 'phân số ↔ phần trăm'],
      ['thirTEEN /n/ cuối · THIRty', '13 · 30', 'chờ cụm xác nhận “one three / three oh”'],
    ],
  },
  { t: 'rule', formula: 'Đề ĐÃ in đơn vị (£, %, km, million) → chỉ viết SỐ · chưa in → số + đơn vị', vi: 'Người nói nêu hai số: tìm từ khoá của câu hỏi (today, above, total) để biết số nào.' },

  /* ───────────── Ngày 6 ───────────── */
  { t: 'h', text: '32. Khung câu về nhà nước và chi tiêu công (Ngày 6 · Từ vựng mục 5–6)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Governments should allocate more funding to + N, rather than + V-ing / N', vi: 'Nêu ưu tiên chi tiêu.', examples: [{ en: 'Governments should allocate more funding to public transport, rather than building new roads.', vi: 'Các chính phủ nên phân bổ thêm kinh phí cho giao thông công cộng, thay vì xây đường mới.' }] },
      { formula: 'It is the responsibility of + N + to + V', vi: 'Ai chịu trách nhiệm.', examples: [{ en: 'It is the responsibility of the state to provide basic health care for every citizen.', vi: 'Nhà nước có trách nhiệm cung cấp chăm sóc y tế cơ bản cho mọi công dân.' }] },
      { formula: 'Since public funds are limited, spending on + N + means less money for + N', vi: 'Câu “tiền có hạn”.', examples: [{ en: 'Since public funds are limited, spending on space research means less money for hospitals.', vi: 'Vì công quỹ có hạn, chi cho nghiên cứu vũ trụ nghĩa là ít tiền hơn cho bệnh viện.' }] },
      { formula: 'One effective measure would be to impose a tax / ban on + N', vi: 'Đề xuất biện pháp.', examples: [{ en: 'One effective measure would be to impose a higher tax on cars entering the city centre.', vi: 'Một biện pháp hiệu quả là áp thuế cao hơn với ô tô vào trung tâm thành phố.' }] },
    ],
  },
  {
    t: 'table',
    caption: 'Giới từ đi kèm',
    head: ['Đúng', 'Ví dụ'],
    rows: [
      ['spend money **on**', 'Governments spend billions **on** defence.'],
      ['invest **in**', 'invest **in** public transport'],
      ['a tax / a ban **on** · impose … **on**', 'a ban **on** smoking · impose a fine **on** drivers'],
      ['allocate … **to**', 'allocate more funding **to** schools'],
      ['responsible **for**', 'responsible **for** public health'],
      ['at the expense **of**', 'not **at the expense of** public transport'],
    ],
  },
  { t: 'rule', formula: 'Governments should allocate more funding to + N · impose a tax on + N · N + is a good use of taxpayers\' money', vi: 'Ba khung lõi: phân bổ – áp thuế/cấm – đánh giá khoản chi.' },

  { t: 'h', text: '33. Đọc đề Opinion: đếm vế, tìm chữ tuyệt đối (Ngày 6 · Viết mục 2)' },
  {
    t: 'table',
    caption: 'Chữ bám để đồng ý một phần',
    head: ['Chữ trong đề', 'Cách bám'],
    rows: [
      ['the best / the most effective / the only way', 'là cách tốt, nhưng không phải tốt nhất / duy nhất'],
      ['all / every / always / never', 'đúng với đa số, nêu một ngoại lệ'],
      ['A is better than B / A rather than B', 'cần tiêu chí so sánh chung; phải bàn cả A lẫn B'],
      ['should be banned / completely / will solve', 'nên hạn chế / sẽ giảm — không cấm hẳn / không giải quyết hẳn'],
      ['khẳng định + because / and this will', 'bàn cả khẳng định lẫn lý do / hệ quả'],
    ],
  },

  { t: 'h', text: '34. Thesis có mức độ (Ngày 6 · Viết mục 4)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'I largely agree that + vế đồng ý, although I do not believe (that) + vế giới hạn', vi: 'Thesis ~75 %.', examples: [{ en: 'I largely agree that free public transport is a better investment than new roads, although I do not believe it is the single most effective measure.', vi: 'Tôi phần lớn đồng ý rằng giao thông công cộng miễn phí là khoản đầu tư tốt hơn đường mới, dù tôi không cho rằng đó là biện pháp hiệu quả nhất.' }] },
      { formula: 'While I accept that + điểm công nhận, I would argue that + ý chính của mình', vi: 'Thesis ~50 % / ~25 %.', examples: [{ en: 'While I accept that free buses would attract some drivers, I would argue that congestion charges are a far more effective solution.', vi: 'Dù tôi công nhận xe buýt miễn phí sẽ hút được một số tài xế, tôi cho rằng thu phí ùn tắc hiệu quả hơn nhiều.' }] },
      { formula: 'I agree that + vế 1, but only if + điều kiện', vi: 'Thesis có điều kiện.', examples: [{ en: 'I agree that fares should be abolished, but only if services are made more frequent at the same time.', vi: 'Tôi đồng ý nên bỏ tiền vé, nhưng chỉ khi dịch vụ đồng thời được tăng tần suất.' }] },
    ],
  },
  { t: 'rule', formula: 'I completely / largely / partly agree that + vế đồng ý, although + vế giới hạn', vi: 'Thesis band 6 = từ mức độ + nói rõ đồng ý vế nào, giới hạn vế nào; kết bài giữ đúng mức đó.' },

  { t: 'h', text: '35. Phản đề một câu (Ngày 6 · Viết mục 5)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Admittedly, + S + V (ý ngược). However / Nevertheless, + S + V (bác lại)', vi: 'Hai câu ngắn — an toàn nhất.', examples: [{ en: 'Admittedly, new roads can relieve the worst bottlenecks in the short term. However, experience shows that they soon fill with additional cars.', vi: 'Phải công nhận đường mới giải toả được các điểm nghẽn trước mắt. Tuy nhiên, thực tế cho thấy chúng sớm đầy thêm xe.' }] },
      { formula: 'Although / While + S + V (ý ngược), + S + V (bác lại)', vi: 'Một câu phức.', examples: [{ en: 'Although free travel would cost the state a great deal, this money would otherwise be spent on roads that make the problem worse.', vi: 'Dù đi lại miễn phí tốn của nhà nước rất nhiều, khoản tiền đó nếu không cũng bị chi cho những con đường làm vấn đề tệ hơn.' }] },
      { formula: 'It is true that + S + V, but + S + V', vi: 'Dễ nhất.', examples: [{ en: 'It is true that some drivers will never give up their cars, but even a small shift would shorten queues at peak times.', vi: 'Đúng là một số tài xế sẽ không bao giờ bỏ xe, nhưng chỉ một dịch chuyển nhỏ cũng rút ngắn hàng xe giờ cao điểm.' }] },
    ],
  },
  { t: 'rule', formula: 'Admittedly, + ý ngược. However, + lý do ý đó yếu hơn · Although + ý ngược, + ý của mình', vi: 'Một câu nhượng bộ + một câu bác; đặt cuối thân bài 1 hoặc đầu thân bài 2. Nêu mà không bác = lập trường lung lay.' },

  { t: 'h', text: '36. Part 3 “Why do you think…?” — 2 lý do + ví dụ (Ngày 6 · Nói mục 2–3)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'I think there are a couple of / two main reasons (for this).', vi: '① Báo trước.', examples: [{ en: 'I think there are a couple of reasons why people don\'t trust politicians.', vi: 'Tôi nghĩ có vài lý do khiến người ta không tin chính trị gia.' }] },
      { formula: 'The main one is (probably) that + S + V', vi: '② Lý do 1 (+ For example, if…).', examples: [{ en: 'The main one is probably that people can\'t see where their money goes.', vi: 'Lý do chính có lẽ là người ta không thấy tiền của mình đi đâu.' }] },
      { formula: 'Another reason is that + S + V · On top of that, + S + V', vi: '④ Lý do 2 (+ In my city, for instance, …).', examples: [{ en: 'Another reason is that tax feels unfair to some people.', vi: 'Một lý do nữa là thuế có vẻ bất công với một số người.' }] },
      { formula: 'So I\'d say it\'s less about + N + and more about + N', vi: '⑥ Chốt.', examples: [{ en: 'So I\'d say it\'s less about the money itself and more about trust.', vi: 'Nên tôi cho rằng vấn đề không hẳn là tiền mà là lòng tin.' }] },
    ],
  },
  {
    t: 'table',
    caption: 'Ngôn ngữ nguyên nhân khi nói',
    head: ['Cụm', 'Theo sau là'],
    rows: [
      ['because / since / as · That\'s mainly because · One reason is that · The reason is that', 'mệnh đề (S + V)'],
      ['because of / due to · It has a lot to do with · This is partly down to · thanks to', 'danh từ / V-ing'],
      ['…, which means (that) · …, and that\'s why', 'mệnh đề — nói hệ quả'],
    ],
  },
  { t: 'rule', formula: 'There are a couple of reasons. The main one is that… For example, … Another reason is that… So I\'d say…', vi: 'Khung “Why” band 6: báo trước → 2 lý do, mỗi lý do có ví dụ → một câu chốt. 30–45 giây.' },

  { t: 'h', text: '37. Bảng góc nhìn và bảng trục chia nhóm (Ngày 6 · Nói mục 4–5)' },
  {
    t: 'table',
    caption: 'Tìm lý do (góc nhìn) · tách nhóm (trục)',
    head: ['Công cụ', 'Các lựa chọn', 'Khung câu'],
    rows: [
      ['Góc nhìn', 'kinh tế · xã hội · tâm lý · công nghệ · giáo dục · thực tế – tiện lợi · cá nhân ↔ xã hội', 'Financially, … · People tend to feel that… · On a practical level, … · For society as a whole, …'],
      ['Trục chia nhóm', 'tuổi · thu nhập · vùng · nghề / hoàn cảnh · xưa ↔ nay', 'I think it depends on + trục. For + nhóm A, …, whereas + nhóm B + …'],
    ],
  },
  { t: 'rule', formula: 'It depends on + trục. For + nhóm A, …, whereas + nhóm B + …', vi: 'Khi không có lý do chung: chọn MỘT trục (tuổi / thu nhập / vùng) và nói một lý do cho mỗi đầu.' },
];
