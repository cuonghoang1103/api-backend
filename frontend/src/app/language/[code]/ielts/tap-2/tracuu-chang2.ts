/**
 * Tra cứu công thức — chặng 2 của Tập 2 (Ngày 7–12). Mảng khối để phiên chính ghép vào
 * `TRA_CONG_THUC_T2.blocks` trong `tracuu.ts` (KHÔNG sửa tracuu.ts từ tệp này).
 *
 * Mỗi mục: `h` ghi "(Ngày N · mục M)" đúng mục trong `ngay/ngayN.ts` + `patterns` / `table` + `rule` chép từ bài.
 * Soạn 12/11/2026 cùng đợt ngay7.ts … ngay12.ts.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG2: Block[] = [
  /* ───────────── Ngày 7 ───────────── */
  { t: "h", text: "Bốn cách nói tương lai (Ngày 7 · Ngữ pháp mục 1–5)" },
  {
    t: "patterns",
    rows: [
      { formula: "S + will + V · S + won't + V · Will + S + V? · Shall I / we + V?", vi: "Quyết định NGAY lúc nói, dự đoán theo ý kiến (I think…), hứa, đề nghị giúp, sự việc chắc chắn.", examples: [{ en: "“It's raining.” — “I'll take a taxi.”", vi: "“Trời mưa.” — “Tôi sẽ đi taxi.”" }] },
      { formula: "S + am / is / are + going to + V", vi: "Dự định ĐÃ CÓ TỪ TRƯỚC, hoặc dự đoán có BẰNG CHỨNG.", examples: [{ en: "Look at the traffic! We're going to be late.", vi: "Nhìn tắc đường kìa! Mình sắp muộn rồi." }] },
      { formula: "S + am / is / are + V-ing + mốc tương lai", vi: "Kế hoạch ĐÃ HẸN, ĐÃ ĐẶT (có người khác, có vé, có giờ).", examples: [{ en: "I'm meeting my tutor at 3 tomorrow.", vi: "Ba giờ mai tôi gặp giáo viên hướng dẫn." }] },
      { formula: "S + V(s/es) + giờ / ngày", vi: "Lịch trình công khai, cố định (tàu xe, phim, giờ mở cửa, lịch thi).", examples: [{ en: "The last bus leaves at 10.45.", vi: "Chuyến xe buýt cuối rời bến lúc 10 giờ 45." }] },
    ],
  },
  {
    t: "table",
    caption: "Hỏi lần lượt — gặp “có” thì dừng",
    head: ["Câu hỏi", "Có → dùng"],
    rows: [
      ["Lịch công khai, cố định?", "hiện tại đơn: The bus **leaves** at 8."],
      ["Đã hẹn / đã đặt với người khác?", "am / is / are + V-ing: I**'m seeing** the doctor at 4."],
      ["Đã định từ trước, hoặc có bằng chứng?", "be going to: I**'m going to** save money."],
      ["Vừa quyết định, ý kiến, hứa, đề nghị?", "will: I**'ll** help you."],
    ],
  },
  { t: "rule", formula: "lịch → hiện tại đơn · đã hẹn → am / is / are + V-ing · đã định / bằng chứng → going to · vừa quyết định / ý kiến → will", vi: "Dùng will cho mọi “sẽ” là dấu hiệu band 4." },

  { t: "h", text: "Mệnh đề thời gian và ngôn ngữ dự báo (Ngày 7 · Ngữ pháp mục 6–7)" },
  {
    t: "patterns",
    rows: [
      { formula: "When / After / Before / As soon as / Until + S + V(s/es), S + will + V", vi: "Vế thời gian dùng HIỆN TẠI dù nói về tương lai.", examples: [{ en: "I'll call you as soon as I arrive.", vi: "Tôi sẽ gọi bạn ngay khi đến nơi." }] },
      { formula: "S + is / are + expected / predicted / projected + to + V", vi: "Dự báo trong Task 1 (năm tương lai).", examples: [{ en: "The number of electric cars is expected to reach 2 million by 2030.", vi: "Số ô tô điện được dự kiến đạt 2 triệu vào năm 2030." }] },
      { formula: "S + is / are + (un)likely + to + V · S + will probably + V · S + probably won't + V", vi: "Dự đoán có mức độ (Part 3, Task 2).", examples: [{ en: "More people are likely to work from home.", vi: "Có lẽ nhiều người sẽ làm việc ở nhà hơn." }] },
    ],
  },
  { t: "rule", formula: "when / as soon as + S + V(s/es) · is expected to + V · will probably + V · probably won't + V", vi: "~~when I will arrive~~ → when I arrive · ~~won't probably~~ → probably won't." },

  { t: "h", text: "Ngôn ngữ vị trí — Map labelling (Ngày 7 · Nghe mục 1–2)" },
  {
    t: "table",
    head: ["Cụm", "Nghĩa"],
    rows: [
      ["diagonally opposite / directly opposite", "chéo đối diện / đối diện thẳng"],
      ["at the far end (of) · halfway along", "tận cuối · khoảng giữa"],
      ["adjacent to · beyond / just past · alongside", "sát cạnh · đi quá một chút · dọc theo"],
      ["in the north-east corner · just inside the entrance", "góc đông bắc · ngay trong lối vào"],
      ["clockwise · counterclockwise (Mỹ) / anticlockwise (Anh)", "theo / ngược chiều kim đồng hồ"],
      ["the second room on your left · follow the corridor round", "phòng thứ hai bên trái · đi theo hành lang vòng qua góc"],
    ],
  },
  { t: "rule", formula: "Trái / phải tính theo NGƯỜI ĐANG ĐI · chờ hết “used to be… but now” rồi mới ghi", vi: "Đi xuống phía Nam: trái người đi = phải tờ giấy." },

  { t: "h", text: "Part 2 — tả địa điểm (Ngày 7 · Nói mục 1–2)" },
  {
    t: "patterns",
    rows: [
      { formula: "It's located in / on / near… · It's surrounded by + N", vi: "Ở đâu, xung quanh có gì.", examples: [{ en: "The village is surrounded by rice fields.", vi: "Ngôi làng được bao quanh bởi ruộng lúa." }] },
      { formula: "It's (well-)known / famous for + N / V-ing", vi: "Nổi tiếng vì…", examples: [{ en: "Hoi An is famous for its lanterns.", vi: "Hội An nổi tiếng với đèn lồng." }] },
      { formula: "It's the kind of place where + S + V · What I like most about it is…", vi: "Câu phức đơn giản + mở phần cảm xúc.", examples: [{ en: "It's the kind of place where you can forget about work.", vi: "Đó là kiểu nơi bạn có thể quên công việc." }] },
    ],
  },
  { t: "rule", formula: "Thẻ visited → quá khứ · often go → hiện tại đơn · would like to visit → would like to / going to / will", vi: "Chọn thì theo thẻ; dàn 4 phần: giới thiệu → vị trí → trải nghiệm → cảm xúc." },

  /* ───────────── Ngày 8 ───────────── */
  { t: "h", text: "Short-answer & paraphrase (Ngày 8 · Đọc mục 1–2)" },
  {
    t: "table",
    head: ["Cách paraphrase", "Ví dụ"],
    rows: [
      ["① Đồng nghĩa", "rush hour → peak time · costs far less → is much cheaper"],
      ["② Đổi loại từ", "roads are congested → congestion on roads · rely on → reliable"],
      ["③ Đổi cấu trúc", "Planners built it → It was built by planners · because prices rose → due to the price rise"],
    ],
  },
  { t: "rule", formula: "Short-answer: chép NGUYÊN chữ trong bài · đúng giới hạn từ (số không tính là từ) · câu hỏi theo thứ tự · When → thời gian · How many → số", vi: "Viết quá số từ = sai cả câu." },

  { t: "h", text: "So sánh trong Task 1 bar chart (Ngày 8 · Viết mục 2)" },
  {
    t: "patterns",
    rows: [
      { formula: "The figure for A was higher / lower than that for B · A had the highest / lowest + N", vi: "So sánh hai nhóm cùng loại (that = the figure).", examples: [{ en: "The figure for Ashford was much higher than that for Carlton.", vi: "Số liệu của Ashford cao hơn nhiều so với Carlton." }] },
      { formula: "A was twice / three times as high as B · almost / more than twice", vi: "Gấp bao nhiêu — nhân thử trước khi viết.", examples: [{ en: "52% was almost twice as high as 28%.", vi: "52% cao gần gấp đôi 28%." }] },
      { formula: "S + V, whereas / while + S + V · By contrast, + S + V · …, compared with + số", vi: "Đối lập trong câu / sang câu mới / so với.", examples: [{ en: "The bus was used by 35% of commuters in Bexley, compared with 20% in Ashford.", vi: "35% người đi làm ở Bexley đi xe buýt, so với 20% ở Ashford." }] },
      { formula: "just over / just under / nearly / around + số · a quarter · a third · a fifth · one in ten", vi: "Làm tròn và đổi phân số.", examples: [{ en: "Just over half of commuters drove to work.", vi: "Hơn một nửa một chút số người đi làm lái xe." }] },
    ],
  },
  { t: "rule", formula: "The figure for A was higher / the highest · far / slightly + higher · twice as high as · whereas · compared with", vi: "Biểu đồ không có năm = viết bằng so sánh; mỗi câu thân bài một phép so sánh." },

  /* ───────────── Ngày 9 ───────────── */
  { t: "h", text: "So sánh hơn / nhất / bằng (Ngày 9 · Ngữ pháp mục 1–5)" },
  {
    t: "table",
    head: ["Tính từ", "Hơn", "Nhất"],
    rows: [
      ["1 âm tiết: cheap · big (CVC) · large (-e)", "cheaper · bigger · larger", "the cheapest · the biggest · the largest"],
      ["2 âm tiết -y: busy, easy, noisy", "busier", "the busiest"],
      ["2+ âm tiết: modern, expensive, crowded", "more modern", "the most modern"],
      ["good / bad / far / many-much / little", "better / worse / further / more / less", "the best / the worst / the furthest / the most / the least"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "much / far / considerably / slightly + adj-er / more + adj + than", vi: "Mức độ trước so sánh hơn — không dùng very.", examples: [{ en: "The metro is much faster than the bus.", vi: "Metro nhanh hơn xe buýt nhiều." }] },
      { formula: "the + adj-est / the most + adj + in (nơi) / of (nhóm) · one of the + adj-est + N(s) · the second + adj-est", vi: "So sánh nhất luôn có the.", examples: [{ en: "The bus was the second most popular mode of transport.", vi: "Xe buýt là phương tiện phổ biến thứ hai." }] },
      { formula: "as + adj + as · not as + adj + as · the same (+ N) as · similar to · different from", vi: "Bằng · kém · giống · khác.", examples: [{ en: "The bus isn't as fast as the metro.", vi: "Xe buýt không nhanh bằng metro." }] },
      { formula: "more + N · fewer + N(s) đếm được · less + N không đếm được", vi: "So sánh với danh từ.", examples: [{ en: "Fewer people read printed newspapers nowadays.", vi: "Ngày nay ít người đọc báo giấy hơn." }] },
    ],
  },
  { t: "rule", formula: "Một dấu so sánh thôi (-er HOẶC more) · much / far / slightly + hơn · same AS · similar TO · different FROM · fewer + N đếm được", vi: "Năm lỗi hay gặp nhất: more cheaper · very cheaper · same with · different with · less people." },

  { t: "h", text: "Part 1 — mở câu không lặp từ giám khảo (Ngày 9 · Nói mục 1)" },
  {
    t: "table",
    head: ["Câu hỏi", "Mở câu (paraphrase)"],
    rows: [
      ["Do you like music?", "I'm really into / a big fan of music, especially…"],
      ["Do you enjoy shopping?", "Not really — I'm not much of a shopper."],
      ["Is it important to sleep well?", "Absolutely. A good night's sleep plays a huge role in…"],
      ["Do you often…?", "from time to time · most days · not as much as I'd like"],
    ],
  },
  { t: "rule", formula: "Đồng nghĩa · đổi loại từ · đổi cấu trúc · chung → cụ thể → lý do → ví dụ (2–4 câu)", vi: "Câu đầu tiên là chỗ dễ nhất để chứng minh paraphrase (LR)." },

  /* ───────────── Ngày 10 ───────────── */
  { t: "h", text: "Ngôn ngữ xu hướng vòng 2 (Ngày 10 · Từ vựng mục 2)" },
  {
    t: "table",
    head: ["Động từ + trạng từ", "There was + a / an + tính từ + danh từ + in"],
    rows: [
      ["Sales rose sharply.", "There was a sharp rise in sales."],
      ["Prices increased significantly.", "There was a significant increase in prices."],
      ["Use fell marginally.", "There was a marginal fall in use."],
      ["The figure stood at 12% · plateaued · bottomed out · tripled · surged", "a surge in · reached a plateau · a threefold increase"],
    ],
  },
  { t: "rule", formula: "dramatically > significantly > moderately > slightly > marginally (steadily / gradually nói về NHỊP độ, không phải độ lớn) · S + rose sharply = There was a sharp rise in + N", vi: "Chọn mức độ theo độ dốc thật của đường." },

  { t: "h", text: "Collocation AWL dùng ngay (Ngày 10 · Từ vựng mục 1)" },
  {
    t: "table",
    head: ["Collocation", "Lưu ý"],
    rows: [
      ["affect sb / sth = have an effect on", "affect (v) ≠ effect (n); không giới từ sau affect"],
      ["have an impact on · focus on", "~~impact to~~ · ~~focus in~~"],
      ["conduct research / a survey · achieve a goal · acquire skills", "~~achieve money~~ → earn money"],
      ["every aspect of life · energy consumption · reach a conclusion", "consumption không đếm được"],
    ],
  },
  { t: "rule", formula: "affect (v) = have an effect on (n) · have an impact on · conduct research · achieve a goal · every aspect of", vi: "Sai giới từ là lỗi LR dễ thấy nhất." },

  { t: "h", text: "Đề lợi – hại (Ngày 10 · Viết mục 1–2)" },
  {
    t: "patterns",
    rows: [
      { formula: "One major advantage of + N / V-ing + is that + S + V · Another benefit is that…", vi: "Câu chủ đề ý lợi.", examples: [{ en: "One major advantage of a gap year is that young people gain work experience.", vi: "Một lợi ích lớn của năm nghỉ là người trẻ có kinh nghiệm làm việc." }] },
      { formula: "The main drawback / disadvantage of + N + is (that)…", vi: "Câu chủ đề ý hại.", examples: [{ en: "The main drawback is the cost.", vi: "Nhược điểm chính là chi phí." }] },
      { formula: "Admittedly, + S + V. However, + S + V", vi: "Thừa nhận mặt kia rồi đẩy về quan điểm mình.", examples: [{ en: "Admittedly, it can be expensive. However, the benefits are far greater.", vi: "Phải thừa nhận nó có thể tốn kém. Tuy nhiên, lợi ích lớn hơn nhiều." }] },
      { formula: "On balance, + A + outweigh(s) + B", vi: "Kết luận cho đề “outweigh”.", examples: [{ en: "On balance, I believe the benefits far outweigh the drawbacks.", vi: "Cân nhắc mọi mặt, tôi tin lợi ích vượt xa nhược điểm." }] },
    ],
  },
  { t: "rule", formula: "Discuss adv & disadv → bàn cân bằng · Do the advantages outweigh…? → BẮT BUỘC kết luận bên nào nặng hơn (mở bài + kết bài)", vi: "Khung: mở bài → mặt yếu hơn (Admittedly…) → mặt mạnh hơn (However…) → On balance…" },

  /* ───────────── Ngày 11 ───────────── */
  { t: "h", text: "Gerund & infinitive (Ngày 11 · Ngữ pháp mục 1–6)" },
  {
    t: "table",
    head: ["Nhóm", "Động từ / cụm", "Ví dụ"],
    rows: [
      ["+ V-ing", "enjoy · avoid · finish · mind · suggest · consider · keep · practise · imagine · deny · admit · miss · risk · can't stand · give up · put off", "I enjoy **cooking**."],
      ["+ to V", "want · would like · decide · hope · plan · agree · refuse · promise · offer · arrange · manage · afford · learn · expect · need · seem · tend · fail · choose · aim", "I decided **to learn** Korean."],
      ["+ O + to V", "ask · tell · allow · encourage · advise · remind · persuade · want · expect", "encourage people **to use** buses"],
      ["+ O + V (không to)", "make · let", "let me **choose**"],
      ["Cả hai, nghĩa giống", "like · love · hate · prefer · start · begin · continue", "It started **raining / to rain**."],
      ["Cả hai, nghĩa KHÁC", "remember · forget · stop · try · regret", "stop **smoking** (bỏ) · stop **to buy** (dừng để)"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "V-ing + V(s) · giới từ + V-ing · look forward to / be used to + V-ing", vi: "V-ing làm chủ ngữ; sau mọi giới từ là V-ing.", examples: [{ en: "You can save money by cooking at home.", vi: "Bạn có thể tiết kiệm tiền bằng cách nấu ăn ở nhà." }] },
      { formula: "S + V + (in order) to V · It is + adj + (for sb) + to V", vi: "Mục đích · “Việc… là…”.", examples: [{ en: "It is important for children to learn how to swim.", vi: "Trẻ em học bơi là điều quan trọng." }] },
    ],
  },
  { t: "rule", formula: "remember / forget + V-ing (việc đã làm) · + to V (việc phải làm) · stop + V-ing (bỏ) · + to V (dừng để) · try + V-ing (thử) · + to V (cố)", vi: "Lỗi hay gặp: enjoy to read · look forward to see · suggest sb to do · let me to go." },

  { t: "h", text: "Kỹ năng nghe — báo hiệu và bẫy sửa lời (Ngày 11 · Nghe mục 1–3)" },
  {
    t: "table",
    head: ["Loại", "Cụm", "Bạn làm gì"],
    rows: [
      ["Đoán loại từ", "a + ___ · some + ___ · £ ___ · Ms ___ · on ___", "danh từ số ít · số nhiều / không đếm được · số · họ (đánh vần) · ngày"],
      ["Báo hiệu", "First of all · Moving on to · The most important thing · Finally", "biết đang ở câu nào; đáp án hay ngay sau “most important”"],
      ["Bẫy sửa lời", "no, sorry · I mean · actually · we were going to… but · used to… but now · hang on", "đáp án luôn ở SAU chữ sửa"],
    ],
  },
  { t: "rule", formula: "Đọc trước → đoán loại từ → nghe báo hiệu → chờ hết chữ sửa rồi mới ghi", vi: "Bẫy đứng TRƯỚC đáp án." },

  { t: "h", text: "Part 2 — tả đồ vật (Ngày 11 · Nói mục 2, 4)" },
  {
    t: "patterns",
    rows: [
      { formula: "It's made of… · It's about the size of… · It's used for + V-ing / I use it to + V", vi: "Chất liệu, kích thước, công dụng.", examples: [{ en: "It's used for recording sound, but I mainly use it to listen to podcasts.", vi: "Nó dùng để ghi âm, nhưng tôi chủ yếu dùng để nghe podcast." }] },
      { formula: "I've had it for / since… · It was given to me by… · It means a lot to me because…", vi: "Câu chuyện và ý nghĩa.", examples: [{ en: "It was given to me by my grandfather.", vi: "Ông tặng tôi nó." }] },
    ],
  },
  { t: "rule", formula: "made OF · used FOR + V-ing · use it TO + V · I've had it FOR / SINCE", vi: "Kể câu chuyện và cảm xúc, không kể thông số kỹ thuật. Trọng âm: danh từ nhấn đầu (PREsent), động từ nhấn sau (preSENT)." },

  /* ───────────── Ngày 12 ───────────── */
  { t: "h", text: "Matching headings (Ngày 12 · Đọc mục 1)" },
  { t: "rule", formula: "Tiêu đề = ý chính CẢ đoạn · câu đầu + câu cuối + sau However · trùng chữ ≠ đúng · mỗi tiêu đề dùng một lần", vi: "Tự tóm tắt đoạn bằng 3–5 từ trước khi nhìn danh sách; làm dạng này trước các dạng khác." },

  { t: "h", text: "Ngôn ngữ tỉ lệ — pie chart (Ngày 12 · Viết mục 2–4)" },
  {
    t: "patterns",
    rows: [
      { formula: "X + accounted for / made up / represented + số % + of + tổng", vi: "Chiếm bao nhiêu.", examples: [{ en: "Eating out accounted for 28% of the food budget in 2020.", vi: "Ăn ngoài chiếm 28% ngân sách thực phẩm năm 2020." }] },
      { formula: "the largest / second largest / smallest + share / category · …, followed by X and Y", vi: "Xếp hạng các phần.", examples: [{ en: "The bus was the most common choice (35%), followed by cycling (25%).", vi: "Xe buýt phổ biến nhất (35%), tiếp theo là xe đạp (25%)." }] },
      { formula: "The share of + N + spent on X + rose / fell from … to … · nearly tripled · halved", vi: "Hai pie hai năm: thay đổi.", examples: [{ en: "The share spent on meat and fish fell from 28% to 20%.", vi: "Phần chi cho thịt cá giảm từ 28% xuống 20%." }] },
      { formula: "the remaining + số % · … from A% to B% and from C% to D% respectively", vi: "Phần còn lại · lần lượt.", examples: [{ en: "The remaining 8% went on other items.", vi: "8% còn lại chi cho các khoản khác." }] },
      { formula: "Một pie: X was followed by Y · Taken together, A, B and C + V… · X was less than half the figure for Y", vi: "Một pie (không có thời gian): xếp hạng, gom, so sánh — KHÔNG rose / fell (Ngày 12 · Viết mục 4).", examples: [{ en: "Taken together, these three animal sources supplied almost three quarters of the protein.", vi: "Gộp lại, ba nguồn động vật này cung cấp gần ba phần tư lượng đạm." }] },
    ],
  },
  { t: "rule", formula: "accounted for / made up + % · the largest share · followed by · rose / fell from … to … · the remaining · respectively", vi: "Một pie = so sánh các phần (không rose / fell); hai pie hai năm = thêm ngôn ngữ thay đổi." },
];
