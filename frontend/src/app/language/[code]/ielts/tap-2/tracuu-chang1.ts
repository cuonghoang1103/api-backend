/**
 * Mục TRA CÔNG THỨC của IELTS Tập 2 — chặng 1 (Ngày 1–6). Soạn 12/11/2026 cùng `ngay/ngay1..6.ts`.
 * Phiên chính ghép mảng này vào `TRA_CONG_THUC_T2.blocks` trong `tracuu.ts` (sau khối `recap` mở đầu)
 * — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 * Đánh số mục 1–12; chặng sau đánh tiếp từ 13.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG1: Block[] = [
  /* ───────── Ngữ pháp ───────── */
  { t: 'h', text: '1. Mạo từ a / an / the / Ø — chọn bằng 3 câu hỏi (Ngày 1 · mục 1–4)' },
  {
    t: 'table',
    head: ['Câu hỏi', 'Trả lời', 'Mạo từ', 'Ví dụ'],
    rows: [
      ['Người nghe đã biết **cái nào**?', 'Có (lần hai · duy nhất · có "of / who…" · so sánh nhất · the + adj)', '**the**', 'The price **of houses** · **the** best way · **the** elderly · **the** internet'],
      ['Chưa biết — danh từ đếm được **số ít**?', 'Có', '**a / an** (theo ÂM đầu)', '**a** university · **an** hour · She is **an** engineer · twice **a** week'],
      ['Số nhiều / không đếm được, nói **chung**?', 'Có', '**Ø**', '**Children** need sleep. **Pollution** is a problem. have **breakfast** · by **bus** · go to **school**'],
    ],
  },
  {
    t: 'rule',
    formula: 'the + N đã xác định · a / an + N đếm được số ít (lần đầu, nghề) · Ø + N số nhiều / không đếm được nói chung',
    vi: 'Chữ "những, các, sự, việc" của tiếng Việt KHÔNG dịch thành the. Danh từ đếm được số ít không bao giờ đứng trần.',
  },

  { t: 'h', text: '2. Mạo từ với địa danh (Ngày 1 · mục 5)' },
  {
    t: 'table',
    head: ['Ø', 'the'],
    rows: [
      ['Nước, thành phố, tỉnh, châu lục: Vietnam · Hanoi · Asia', 'Tên có Republic / Kingdom / States: **the** UK · **the** USA · **the** Czech Republic'],
      ['Hồ, núi đơn: Lake Geneva · Mount Fansipan', 'Tên số nhiều, dãy núi: **the** Philippines · **the** Netherlands · **the** Alps'],
      ['Đường, công viên, sân bay: Oxford Street · Noi Bai Airport', 'Sông, biển, đại dương, sa mạc: **the** Mekong · **the** Pacific · **the** Sahara'],
      ['Dạng tính từ: **northern** Vietnam', '**the north of** Vietnam · **the** University **of** Hanoi'],
    ],
  },
  {
    t: 'rule',
    formula: 'Ø: Vietnam · Hanoi · Asia · Lake X · Mount X · X Street — the: the UK · the Philippines · the Mekong · the Pacific · the X of Y',
    vi: 'Tên một chữ riêng → Ø; có chữ chung / số nhiều / vùng nước / "of" → the.',
  },

  { t: 'h', text: '3. Giới từ thời gian (Ngày 3 · mục 1)' },
  {
    t: 'table',
    head: ['Giới từ', 'Dùng với', 'Ví dụ'],
    rows: [
      ['**at**', 'giờ · night · the weekend (Anh) · Christmas', 'at 7 o’clock · at night'],
      ['**on**', 'ngày · thứ · ngày tháng · Monday morning', 'on Monday · on 2 September'],
      ['**in**', 'tháng · năm · mùa · thập niên · buổi trong ngày', 'in May · in 2025 · in the 1990s · in the morning'],
      ['**Ø**', 'this / next / last / every · today / tomorrow · … ago', 'next week · three years ago'],
      ['**for / during**', 'for + khoảng (bao lâu) · during + sự kiện (trong lúc)', 'for two hours · during the meeting'],
      ['**by / until**', 'by = hạn chót · until = kéo dài tới', 'by Friday · until 9 p.m.'],
    ],
  },
  {
    t: 'rule',
    formula: 'at + giờ · on + ngày · in + tháng / năm / mùa · Ø + this / next / last / every · for + khoảng · during + sự kiện · by = hạn chót · until = kéo dài tới',
  },

  { t: 'h', text: '4. Giới từ nơi chốn và chuyển động (Ngày 3 · mục 2–3)' },
  {
    t: 'table',
    head: ['Nhóm', 'Giới từ', 'Ví dụ'],
    rows: [
      ['**in** — bên trong', 'thành phố, nước, phòng, xe con', 'in Hanoi · in the room · in a taxi'],
      ['**on** — bề mặt / tuyến', 'đường (không số nhà), tầng, xe buýt / tàu, internet', 'on Le Loi Street · on the third floor · on the bus'],
      ['**at** — một điểm', 'địa chỉ có số nhà, station, home, work', 'at 12 Le Loi Street · at the station · at home'],
      ['Vị trí', 'next to · opposite · between A and B · behind · in front of', 'The pharmacy is opposite the bank.'],
      ['Chuyển động', 'to · into / out of · across · along · past · through · towards · up / down', 'Walk along the river, go past the bank, cross the bridge.'],
    ],
  },
  {
    t: 'rule',
    formula: 'in + vùng / không gian · on + đường / tầng / bus · at + số nhà / điểm · arrive at (điểm) / in (thành phố) · go home (không to)',
  },

  { t: 'h', text: '5. Giới từ phụ thuộc hay gặp trong IELTS (Ngày 3 · mục 4)' },
  {
    t: 'table',
    head: ['Loại', 'Cụm'],
    rows: [
      ['Động từ + giới từ', 'depend on · rely on · focus on · listen to · belong to · contribute to · wait for · pay for · apply for · agree with · deal with · suffer from · benefit from'],
      ['Tính từ + giới từ', 'interested in · good / bad at · afraid of · aware of · proud of · responsible for · famous for · similar to · different from · worried about · keen on'],
      ['Danh từ + giới từ', 'an increase / a rise / a fall **in** · an impact / effect **on** · a reason **for** · demand **for** · a solution **to** · access **to** · an advantage **of**'],
      ['Task 1', 'rise **by** + lượng · rise **to** + mức · **from** X **to** Y · an increase **of** + lượng · peak **at** + mức'],
    ],
  },
  {
    t: 'rule',
    formula: 'an increase in + N · rise by + lượng · rise to + mức · the impact on · the reason for · a solution to · interested in + V-ing',
    vi: 'Học theo cụm; sau giới từ là danh từ hoặc V-ing.',
  },

  { t: 'h', text: '6. Hiện tại hoàn thành vs quá khứ đơn (Ngày 5 · mục 1–5)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + have / has (+ not) + V3', vi: 'Hiện tại hoàn thành: trải nghiệm (ever / never), kéo dài tới nay (for / since), kết quả còn đó, vừa / đã / chưa (just / already / yet), khoảng chưa hết (today, this year, in recent years)', examples: [{ en: 'I have lived in Hanoi since 2020.', vi: 'Tôi sống ở Hà Nội từ năm 2020.' }, { en: 'Have you ever tried durian?', vi: 'Bạn ăn sầu riêng bao giờ chưa?' }] },
      { formula: 'S + V2 / V-ed + mốc đã kết thúc', vi: 'Quá khứ đơn: yesterday · last… · …ago · in 2019 · When…?', examples: [{ en: 'We moved here three years ago.', vi: 'Chúng tôi chuyển đến đây ba năm trước.' }] },
      { formula: 'How long have / has + S + V3? · S + have / has + V3 + for + khoảng / since + mốc', vi: 'Hỏi và trả lời "bao lâu rồi"', examples: [{ en: 'How long have you studied English? — For six years.', vi: 'Bạn học tiếng Anh bao lâu rồi? — Sáu năm.' }] },
    ],
  },
  {
    t: 'table',
    caption: 'Vị trí trạng từ đi với hiện tại hoàn thành',
    head: ['Từ', 'Vị trí', 'Ví dụ'],
    rows: [
      ['just · already · never', 'giữa have và V3', 'I have **just** finished. · I’ve **never** flown.'],
      ['yet', 'cuối câu phủ định / câu hỏi', 'Have you booked **yet**?'],
      ['ever', 'câu hỏi; "the best … I have ever + V3"', 'Have you **ever** been to Japan?'],
      ['still', 'trước haven’t / hasn’t', 'He **still** hasn’t replied.'],
    ],
  },
  {
    t: 'rule',
    formula: 'Mốc đã kết thúc (yesterday · last … · … ago · in 2019) → V2 · Không mốc / tới nay (ever · just · yet · for / since · this year) → have / has + V3',
    vi: 'Hỏi bằng HTHT, kể chi tiết bằng quá khứ đơn. Task 1: năm đã qua → quá khứ đơn; giai đoạn tới nay → HTHT.',
  },

  /* ───────── Khung câu Nói ───────── */
  { t: 'h', text: '7. Speaking Part 1 — câu Yes/No: A – R – E (Ngày 1 · Nói mục 1)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Answer (Yes, definitely / Not really / It depends) → Reason (because…) → Example (For example, … / Actually, …)', vi: '2–3 câu, 15–25 giây; "It depends" phải nói rõ phụ thuộc vào gì', examples: [{ en: "Yes, definitely. The course is quite demanding, but it's very practical. For example, last term we ran a small online shop.", vi: 'Có chứ. Khoá học khá vất vả nhưng rất thực tế. Ví dụ, học kỳ trước chúng tôi mở một cửa hàng online nhỏ.' }] },
    ],
  },
  { t: 'rule', formula: 'A (Yes, definitely · I’d say so · Not really · It depends) → R (because…) → E (For example, …)' },

  { t: 'h', text: '8. Speaking Part 1 — câu Wh-: D – D – F + filler (Ngày 5 · Nói mục 1–3)' },
  {
    t: 'patterns',
    rows: [
      { formula: '(Well, / I’d say… / To be honest, …) + Direct answer → Detail (ai, ở đâu, khi nào) → Feeling / reason', vi: '20–30 giây; tối đa một filler mỗi câu; kéo dài bằng because · which means · for example · especially · apart from that', examples: [{ en: 'Well, on Saturdays I usually catch up with my friends. We often go to a café near West Lake. It’s the best way for me to unwind.', vi: 'À, thứ Bảy tôi hay gặp bạn bè. Chúng tôi thường đến một quán cà phê gần Hồ Tây. Đó là cách tốt nhất để tôi thư giãn.' }] },
    ],
  },
  { t: 'rule', formula: 'Filler (1 lần) + D → D → F · because / which means / for example / especially', vi: 'Im lặng quá 3 giây mới là lỗi Fluency; filler để mua 2–3 giây suy nghĩ.' },

  { t: 'h', text: '9. Speaking Part 2 — cue card & khung 4 phần; gọi điện đặt lịch (Ngày 3 · Nói mục 1–5)' },
  {
    t: 'table',
    head: ['Phần', 'Câu mở / câu nối', 'Thời lượng'],
    rows: [
      ['1 phút chuẩn bị', '4 ô từ khoá: who · how · what · why (có số, tên, thời gian)', '60″'],
      ['Mở đầu', 'I’d like to talk about… · The person I’m going to describe is…', '1 câu'],
      ['Dòng 1–3', 'I first met her when… · One thing I’ll never forget is… · After that, … · In the end, …', '~60″'],
      ['Dòng "explain"', 'The main reason this was important is that… · Thanks to her, … · Looking back, I realise…', '~40″'],
      ['Gọi điện đặt lịch', 'I’d like to make an appointment for… · Would Friday at three be possible? · Friday suits me. · So that’s…, is that right?', '—'],
    ],
  },
  { t: 'rule', formula: '1′ ghi chú 4 ô → mở 1 câu → kể (quá khứ đơn) → explain (lý do + kết quả + cảm xúc) → 1′30 – 2′' },

  /* ───────── Khung Viết ───────── */
  { t: 'h', text: '10. Task 2 — thân bài P-E-E và bài Opinion 4 đoạn (Ngày 2 · Viết mục 2–3)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'P: The main reason is that + S + V. → E: This means that + S + V. → E: For example, + nơi / người / năm / số.', vi: 'Một thân bài ~90 từ, một lý do, đủ ba phần', examples: [{ en: 'The main reason is that companies control the biggest sources of pollution. This means that one decision can cut emissions more than millions of individual efforts. For example, …', vi: 'Lý do chính là doanh nghiệp kiểm soát các nguồn ô nhiễm lớn nhất. Điều này nghĩa là một quyết định có thể giảm khí thải hơn hàng triệu nỗ lực cá nhân. Ví dụ, …' }] },
      { formula: 'Mở bài (paraphrase + thesis) → TB1 P-E-E → TB2 P-E-E → Kết bài (quan điểm lời khác + gói 2 lý do)', vi: 'Opinion: một quan điểm từ đầu đến cuối · 260–290 từ', examples: [{ en: 'I partly agree with this view: although governments have far more power, individuals still play an important role.', vi: 'Tôi đồng ý một phần: dù chính phủ có nhiều quyền lực hơn hẳn, cá nhân vẫn đóng vai trò quan trọng.' }] },
    ],
  },
  { t: 'rule', formula: 'P (câu chủ đề) → E (giải thích: This means that…) → E (ví dụ cụ thể: For example, …)' },

  { t: 'h', text: '11. Task 2 — Discussion essay, dàn ý 5 phút, chia 60 phút (Ngày 6 · Viết mục 2–5)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'While some people argue that A, others believe that B. In my view, …', vi: 'Mở bài: hai quan điểm + ý kiến riêng (bắt buộc)', examples: [{ en: 'While some people argue that phones are a useful learning tool, others believe they should be banned. In my view, phones should be allowed, but only in planned lessons.', vi: 'Trong khi một số người cho rằng điện thoại là công cụ học hữu ích, người khác tin rằng nên cấm. Theo tôi, nên cho phép nhưng chỉ trong tiết đã lên kế hoạch.' }] },
      { formula: 'On the one hand, there are good reasons why… (A) → On the other hand, I believe… (B — ý mình) → In conclusion, although A…, I believe B…', vi: 'TB1 = bên bạn không chọn · TB2 = bên bạn chọn · hai thân bài gần cân bằng', examples: [{ en: 'In conclusion, although smartphones can be a serious distraction, I believe a complete ban goes too far.', vi: 'Tóm lại, dù điện thoại có thể gây xao nhãng nghiêm trọng, tôi cho rằng cấm hoàn toàn là quá mức.' }] },
    ],
  },
  {
    t: 'table',
    head: ['Việc', 'Thời gian'],
    rows: [
      ['Dàn ý Task 2: gạch đề → chọn ý kiến → 2 lý do mỗi bên → 1 ví dụ mỗi đoạn → thesis', '5′'],
      ['Task 2: viết · soát', '30′ · 5′ (dừng đúng phút 40)'],
      ['Task 1: đọc hình · viết · soát', '3′ · 14′ · 3′'],
    ],
  },
  { t: 'rule', formula: 'Task 2 (5′ dàn ý + 30′ viết + 5′ soát) → Task 1 (3′ + 14′ + 3′) = 60′', vi: 'Đề Discussion có 3 phần bắt buộc: quan điểm A, quan điểm B, ý kiến riêng.' },

  { t: 'h', text: '12. Task 1 line graph — overview 2 câu & ngôn ngữ xu hướng (Ngày 4 · Viết mục 2–3)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'The line graph illustrates + how much / how many / the proportion of + N + between X and Y.', vi: 'Mở bài: paraphrase đề, 1 câu', examples: [{ en: 'The line graph illustrates how much sugar the average person in three countries consumed per day between 2000 and 2020.', vi: 'Biểu đồ đường cho thấy lượng đường trung bình mỗi người ở ba nước tiêu thụ mỗi ngày từ 2000 đến 2020.' }] },
      { formula: 'Overall, A rose…, while B fell…, and C remained stable. + A had the highest… / B had overtaken A by + năm.', vi: 'Overview: 2 câu — xu hướng chung + điểm nổi bật nhất; không số, không lý do', examples: [{ en: 'Overall, consumption rose steadily in Vietnam but fell in the UK after 2005, while Japan’s figure hardly changed.', vi: 'Nhìn chung, lượng tiêu thụ tăng đều ở Việt Nam nhưng giảm ở Anh sau 2005, trong khi Nhật hầu như không đổi.' }] },
      { formula: 'S + rose / fell + slightly / steadily / sharply · There was a + slight / steady / sharp + rise / fall + in + N · peaked at · remained stable at · overtook', vi: 'Hai cách tả xu hướng + đỉnh, ổn định, vượt', examples: [{ en: 'There was a slight rise in UK sugar consumption, which peaked at 100 grams in 2005.', vi: 'Lượng tiêu thụ đường ở Anh tăng nhẹ, đạt đỉnh 100 gram năm 2005.' }] },
    ],
  },
  { t: 'rule', formula: 'Intro (1 câu) → Overview (2 câu, không số) → Body 1 → Body 2 (số + so sánh) · rise to + mức · by + lượng · from X to Y', vi: 'Soát từng con số với hình trước khi nộp.' },

  /* ───────── Bổ sung 13/11/2026 — khung Nói / Viết đã thêm vào bài (đánh số tiếp) ───────── */
  { t: "h", text: "13. Speaking Part 1 — ngân hàng lý do + “It depends” theo 5 trục (Ngày 1 · Nói mục 1b)" },
  {
    t: 'table',
    caption: 'Vì sao THÍCH — 3 nhóm',
    head: ['Nhóm', 'Khung câu', 'Ví dụ'],
    rows: [
      ['**Giải trí, thư giãn**', 'It helps me + V (relax / unwind / forget about work) · It’s a great way to + V · It makes me feel + adj', 'Cooking **helps me forget about** my stressful day.'],
      ['**Học hỏi, phát triển**', 'It gives me the chance to + V · I can learn a lot about… · It broadens my mind.', 'Travelling **gives me the chance to** try new food.'],
      ['**Sức khoẻ**', 'It keeps me fit / in shape · It’s good for my health / my eyes / my back · It helps me sleep better.', 'Cycling to school **keeps me fit** without going to the gym.'],
      ['**Quan hệ** (thêm)', 'It’s a good chance to spend time with… · We can catch up with each other.', 'Family dinners are **a good chance to catch up with** my brother.'],
    ],
  },
  {
    t: 'table',
    caption: 'Vì sao KHÔNG THÍCH — 4 nhóm',
    head: ['Nhóm', 'Khung câu', 'Ví dụ'],
    rows: [
      ['**Chán**', 'I find it quite boring / repetitive. · It’s not really my cup of tea.', 'I find shopping malls **quite boring** — they all look the same.'],
      ['**Mệt, mất thời gian**', 'It’s tiring / time-consuming. · It takes too much time.', 'Cleaning the house is **so time-consuming**.'],
      ['**Bị bắt buộc**', 'I have to + V, so it doesn’t feel like fun. · I was forced to… as a child.', '**I had to** learn the piano as a child, **so** I never enjoyed it.'],
      ['**Hại / tốn kém**', 'It’s bad for my health / eyes. · It costs a fortune.', 'Fast food **is bad for my health**, so I avoid it.'],
    ],
  },
  {
    t: 'table',
    caption: '"It depends" — 5 TRỤC để chia nhóm (nói rõ phụ thuộc vào cái gì)',
    head: ['Trục', 'Cách gọi hai nhóm', 'Ví dụ'],
    rows: [
      ['**Tuổi**', 'young people / the younger generation ↔ older people / the elderly', 'It depends on age. **Young people** love it, but **the elderly** find it confusing.'],
      ['**Thu nhập**', 'well-off people / people with high incomes ↔ people on low incomes', '**Well-off families** can afford it, but **people on low incomes** can’t.'],
      ['**Nơi sống**', 'urban dwellers / city people ↔ people in rural areas / in the countryside', 'It’s popular with **urban dwellers**, but less so **in rural areas**.'],
      ['**Loại / thể loại**', 'some kinds of… ↔ others · light ones ↔ serious ones', 'It depends on the type. **Some films** are fine for kids, **others** aren’t.'],
      ['**Thời điểm**', 'on weekdays ↔ at weekends · in summer ↔ in winter', '**On weekdays** I eat at the office, but **at weekends** I cook.'],
    ],
  },
  {
    t: 'rule',
    formula: 'Thích: It helps me + V / It gives me the chance to + V / It keeps me fit · Không thích: I find it boring / It’s time-consuming / I have to… · It depends on + trục → A…, but B…',
    vi: 'Lý do Part 1 chỉ có vài nhóm — thuộc khung câu là không bao giờ bí chữ R.',
  },
  { t: "h", text: "14. Speaking Part 1 — 6 dạng câu hỏi, mỗi dạng một khung + “It depends → If… But if…” (Ngày 5 · Nói mục 5)" },
  {
    t: 'table',
    head: ['Dạng câu hỏi', 'Câu 1 (trả lời thẳng)', 'Câu 2–3 (kéo dài)'],
    rows: [
      ['**What is the best time to…?**', 'I think the best time to… is + thời điểm.', 'because + lý do · Thời điểm **xấu** thì sao: It’s not a good idea to… at…, because…'],
      ['**Is X suitable for…?** (children, old people…)', 'Yes, I think it’s suitable for… / Not really, it’s not very suitable for…', 'because + lý do · **but** + ngoại lệ: However, it might not be suitable for…'],
      ['**Is it easy or difficult to…?**', 'It’s quite easy / fairly difficult to…, actually.', 'lý do · **lúc đầu – về sau**: At first it was hard, but after a while…'],
      ['**What do you dislike about X?**', 'The only thing I don’t like about X is…', 'vì sao khó chịu + ví dụ nhỏ · có thể chốt: Apart from that, I love it.'],
      ['**When was the first / last time…?**', 'The last time I… was + thời điểm (quá khứ).', '2 câu **quá khứ đơn**: đi với ai, làm gì, cảm thấy thế nào. **Dừng** — không kể thành Part 2.'],
      ['**Is X popular in your country?**', 'Yes, it’s very popular in Vietnam, especially among + nhóm người.', 'vì sao phổ biến · xu hướng: These days more and more people…'],
    ],
  },
  {
    t: 'table',
    caption: 'Không nhớ rõ thời điểm (dạng first / last time) — 3 câu rào',
    head: ['Câu rào', 'Ví dụ'],
    rows: [
      ['**I can’t remember exactly, but** I think it was…', 'I can’t remember exactly, but I think it was about three years ago.'],
      ['**It’s been + thời gian + since I last** + V2', 'It’s been ages since I last went to the cinema — maybe six months.'],
      ['**As far as I can remember,** …', 'As far as I can remember, the first time I swam in the sea was when I was seven.'],
    ],
  },
  {
    t: 'table',
    caption: 'Câu hỏi quá rộng ("What kind of food / clothes / music…?") — khung It depends',
    head: ['Bước', 'Khung', 'Ví dụ: What kind of clothes do you usually wear?'],
    rows: [
      ['1 · Nói "tuỳ"', 'It depends on + điều kiện.', 'It depends on where I’m going.'],
      ['2 · Trường hợp A', 'If…, I usually…', 'If I’m going to work, I usually wear a shirt and trousers.'],
      ['3 · Trường hợp B', 'But if… / At weekends, …', 'But at weekends I just wear jeans and a T-shirt, because they’re comfortable.'],
    ],
  },
  {
    t: 'rule',
    formula: 'Nhận DẠNG câu hỏi → câu 1 trả lời đúng dạng → 1–2 câu lý do / ví dụ / mặt kia → hạ giọng, dừng.',
    vi: 'Part 1 = 2–3 câu. Biết dạng là biết câu đầu tiên.',
  },
  { t: "h", text: "15. Speaking Part 1 — kéo dài bằng đối lập + mở câu tần suất bằng bối cảnh (Ngày 5 · Nói mục 6)" },
  {
    t: 'table',
    head: ['Khung', 'Ví dụ'],
    rows: [
      ['**Generally I love X, but the only thing I don’t like is…**', 'Generally I love living in Hanoi, but the only thing I don’t like is the traffic in the rush hour.'],
      ['**At first… , but after a while…** (lúc đầu – về sau)', 'At first I found online classes boring, but after a while I got used to them.'],
      ['**X is great at / in…, but not at / in…** (lúc tốt – lúc xấu)', 'The beach is great in the early morning, but not at midday, when it gets really crowded.'],
      ['**The good thing is…, while the downside is…** (ưu – nhược)', 'The good thing about my phone is the camera, while the downside is the battery — it dies by 4 p.m.'],
    ],
  },
  {
    t: 'table',
    caption: 'Câu tần suất dễ cụt ("How often do you…?") — mở bằng bối cảnh',
    head: ['Cụt (band 4)', 'Có bối cảnh (band 5–5.5)'],
    rows: [
      ['I go swimming once a week.', 'These days I’m really busy with work, so I only go swimming once a week, usually on Sunday mornings.'],
      ['I read books every night.', 'Since I started living alone, I’ve had more free time, so I read for about half an hour every night before bed.'],
      ['I rarely cook.', 'My office is far from home and I get back quite late, so to be honest I rarely cook — maybe twice a month.'],
    ],
  },
  {
    t: 'rule',
    formula: 'Generally I love X, but the only thing I don’t like is… · At first…, but after a while… · Bối cảnh + so + tần suất',
    vi: 'Kéo dài bằng mặt kia hoặc bằng hoàn cảnh — không cần từ khó.',
  },
  { t: "h", text: "16. Task 1 — câu mở bài dùng cho 7 dạng · number / amount / proportion · chủ ngữ số liệu · in / by + năm (Ngày 4 · Viết mục 5)" },
  {
    t: 'table',
    caption: 'Bảng paraphrase câu mở bài (dùng cho mọi dạng)',
    head: ['Trong đề', 'Đổi thành', 'Ghi chú'],
    rows: [
      ['The graph / The chart', 'The **line graph** / **bar chart** / **pie charts** / **table** / **diagram** / **maps**', 'Gọi **đúng tên** hình; 2 hình → số nhiều (the two pie charts).'],
      ['shows', '**illustrates** · **compares** (từ 2 nhóm trở lên) · **presents** · **gives information about**', 'compares chỉ dùng khi hình thật sự có nhiều nhóm.'],
      ['the number of people who…', '**how many** people…', 'đếm được → how many'],
      ['the amount of money spent on…', '**how much** money was spent on… · **spending on**…', 'không đếm được → how much'],
      ['the percentage of…', '**the proportion of**… · **what percentage of**…', ''],
      ['information about / data on', '**data on** · **figures for**', ''],
      ['between 2000 and 2020', '**from** 2000 **to** 2020 · **over a twenty-year period**', 'Đếm đúng số năm!'],
      ['in three countries', 'in **Japan, Canada and Vietnam**', 'Gọi tên luôn cho rõ.'],
      ['(Process) how X is made', 'the **stages in the production of** X · **how** X **is produced**', 'Ngày 20'],
      ['(Map) changes to a town', '**how** the town **changed / was developed** between… and…', 'Ngày 22'],
    ],
  },
  {
    t: 'rule',
    formula: 'The + tên hình + illustrates / compares + how many / how much / the proportion of + N + in + nơi + from … to … / over a … period.',
    vi: 'Câu mở bài: đổi 2–3 phần (tên hình, động từ, cụm số liệu, thời gian); giữ nguyên tên riêng, đơn vị, năm.',
  },
  {
    t: 'table',
    caption: 'number / amount / proportion / figure — dùng với gì',
    head: ['Cụm', 'Đi với', 'Đúng', 'Sai hay gặp'],
    rows: [
      ['**the number of**', 'danh từ **đếm được** số nhiều', 'the number of **cars / tourists**', '~~the number of money~~'],
      ['**the amount of**', 'danh từ **không đếm được**', 'the amount of **sugar / water / money**', '~~the amount of people~~'],
      ['**the proportion / percentage of**', 'tỉ lệ (%), cả hai loại danh từ', 'the proportion of **adults who exercise**', '~~the percentage of 30%~~ → **30% of** adults'],
      ['**the figure for**', 'thay cho cả cụm số liệu đã nhắc', 'the figure **for** Japan', '~~the figure of Japan~~'],
      ['**percentage points**', 'khoảng cách giữa hai con số %', 'rose from 20% to 30% = **by 10 percentage points**', '~~rose by 10%~~ (10% của 20 chỉ là 2)'],
    ],
  },
  {
    t: 'table',
    caption: '5 cách gọi chủ ngữ số liệu — xoay vòng để không lặp "the figure"',
    head: ['Cách', 'Ví dụ (cùng một ý: du khách đến Đà Nẵng)'],
    rows: [
      ['1. **the number of** + N', 'The number of visitors to Da Nang rose to 8 million.'],
      ['2. **Con số làm chủ ngữ**', 'Around 8 million tourists visited Da Nang in 2020.'],
      ['3. **Danh từ khác / danh từ hoá**', 'Visitor numbers in Da Nang grew rapidly. · Tourism in Da Nang grew rapidly.'],
      ['4. **Nơi chốn / nhóm người làm chủ ngữ**', 'Da Nang welcomed 8 million visitors. · Hoi An attracted far fewer.'],
      ['5. **the figure for** + nơi / nhóm', 'The figure for Hoi An was much lower, at 3 million.'],
    ],
  },
  {
    t: 'table',
    caption: '"in + năm" khác "by + năm"',
    head: ['Cụm', 'Nghĩa', 'Thì', 'Ví dụ'],
    rows: [
      ['**in** 2010', 'đúng vào năm đó', 'quá khứ đơn', 'In 2010, the figure **reached** 50%.'],
      ['**by** 2010', 'tính dồn **đến** mốc đó (xảy ra lúc nào đó trước hoặc đúng 2010)', '**quá khứ hoàn thành** had + V3', 'By 2010, the figure **had reached** 50%. · Vietnam **had overtaken** the UK **by** 2020.'],
      ['**by** 2040 (dự báo)', 'đến mốc tương lai', 'is expected to + V (band 5) · will have + V3 (band 6+)', 'The figure **is expected to reach** 35% **by** 2040.'],
    ],
  },
  { t: "h", text: "17. Task 1 — “[năm / giai đoạn / nơi] + saw / witnessed + N xu hướng” (Ngày 4 · Bài tập Phần VII)" },
  {
    t: "rule",
    formula: "S + rose sharply → [The year 2020 / The period 2000–2020 / Hanoi] + saw / witnessed + a sharp rise + in + N",
    vi: "Đổi trạng từ → tính từ (sharply → sharp, steadily → steady). Không mở câu bằng chữ số: “2020 saw…” → “The year 2020 saw…”.",
  },
  { t: "h", text: "18. Task 1 — chia thân bài theo số hạng mục · đường nhiều chặng · biểu đồ có “Total” (Ngày 4 · Viết mục 6)" },
  {
    t: 'table',
    caption: 'Bảng quyết định chia thân bài',
    head: ['Hình có…', 'Chia thân bài', 'Ghi chú'],
    rows: [
      ['**2–3 hạng mục**, theo thời gian', 'Theo **giai đoạn** (trước / sau điểm đổi chiều) **hoặc** mỗi khổ một nhóm đường có "câu chuyện" chung', 'Như bài mẫu: UK + Vietnam (cắt nhau) / Japan (phẳng).'],
      ['**4 hạng mục**', '**2 + 2** theo xu hướng: nhóm tăng / nhóm giảm (hoặc nhóm cao / nhóm thấp)', ''],
      ['**5–6 hạng mục trở lên**', 'Gom thành **tối đa 4 khối**: khổ 1 = các mục lớn / thay đổi mạnh, khổ 2 = phần còn lại; mỗi khổ 2–3 câu', 'Mục **"Other"** luôn tả **cuối cùng**, 1 câu là đủ.'],
      ['Chỉ **2 mốc năm** (bar / pie / table)', 'Theo **nhóm tăng / nhóm giảm** — **không** chia "năm đầu / năm cuối"', 'Chia theo năm = kể hai lần cùng các mục.'],
      ['Có **năm dự báo**', '**Đã qua → dự báo** (ngoại lệ — mục 7)', 'Mỗi khổ một nhóm thì.'],
    ],
  },
  {
    t: 'sodo',
    kind: 'flow',
    title: 'Đường lên xuống nhiều lần → tối đa 3–4 chặng',
    steps: [
      { label: '1. Đánh dấu đầu & cuối', sub: 'Số năm đầu, số năm cuối' },
      { label: '2. Khoanh đỉnh & đáy', sub: 'Điểm cao nhất, điểm thấp nhất (chỉ những điểm đổi chiều lớn)' },
      { label: '3. Cắt thành 3–4 chặng', sub: 'Mỗi chặng nằm giữa hai điểm đã khoanh' },
      { label: '4. Mỗi chặng 1 câu', sub: 'Động từ xu hướng + số đầu / cuối chặng' },
    ],
    caption: 'Dao động nhỏ giữa một chặng → gom bằng "fluctuated between X and Y". Không tả từng năm một.',
  },
  {
    t: 'note',
    title: 'Biểu đồ có đường / cột "Total" — tả tổng trước',
    items: [
      'Đường (hoặc cột) **Total** = cộng các phần lại. Số đã có sẵn trên hình — **không** cần tự cộng.',
      '**Overview**: câu 1 nói **tổng** tăng / giảm thế nào; câu 2 nói **phần nào gây ra** phần lớn thay đổi đó. Ví dụ: Overall, **total** energy use rose over the period, **mainly because of** a sharp increase in electricity, while gas use fell.',
      '**Thân bài 1** mở bằng số của **tổng** (đầu → cuối); **thân bài 2** tả các thành phần, phần đóng góp lớn nhất trước.',
      'Bảng có **hàng / cột Total** làm y như vậy (Ngày 16).',
    ],
  },
  {
    t: 'rule',
    formula: 'Đếm hạng mục → 2–3: theo giai đoạn / nhóm · 4: 2 + 2 · 5+: ≤ 4 khối, Other cuối · 2 mốc năm: tăng / giảm · Total: tổng trước.',
    vi: 'Chọn cách chia thân bài TRƯỚC khi viết, theo số hạng mục và loại hình.',
  },
  { t: "h", text: "19. Task 1 — biểu đồ có năm dự báo: expected / projected / predicted (Ngày 4 · Viết mục 7)" },
  {
    t: 'table',
    caption: 'Ba phần thời gian — ba nhóm thì',
    head: ['Phần', 'Năm', 'Thì / khung', 'Ví dụ'],
    rows: [
      ['**Đã qua**', '2000 → 2010', 'quá khứ đơn: rose, climbed, saw', 'The figure for Japan **climbed** steadily.'],
      ['**Mốc hiện tại** (năm cuối có số thật)', '2020', 'quá khứ đơn: stood at, reached, was', 'In 2020, it **stood at** 18%.'],
      ['**Dự báo**', '2030*, 2040*', '**is expected / projected / predicted / forecast to** + V · **is likely to** + V', 'It **is projected to reach** 25% **by** 2040.'],
      ['**Overview** (bao cả hai)', 'cả giai đoạn', 'quá khứ + **is expected to continue / keep + V-ing**', 'The share **rose** … and **is expected to keep rising**.'],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + is expected / projected / predicted / forecast + to V (+ by + năm)', vi: 'chủ ngữ "được dự đoán sẽ…" — khung chính, xoay vòng 4 động từ', examples: [{ en: 'The figure for Japan is predicted to rise to 35% by 2040.', vi: 'Con số của Nhật được dự đoán tăng lên 35% vào năm 2040.' }] },
      { formula: 'S + is likely to + V', vi: 'nhiều khả năng sẽ…', examples: [{ en: 'Canada is likely to follow a similar pattern.', vi: 'Canada nhiều khả năng đi theo xu hướng tương tự.' }] },
      { formula: 'It is predicted / expected that + S + will + V', vi: 'người ta dự đoán rằng…', examples: [{ en: 'It is expected that the figure will double.', vi: 'Người ta dự đoán con số sẽ tăng gấp đôi.' }] },
      { formula: '…, with + N + forecast / projected + to V', vi: 'gói thêm một ý dự báo vào cuối câu (band 6)', examples: [{ en: 'Canada is likely to follow, with its figure forecast to hit 25%.', vi: 'Canada nhiều khả năng theo sau, với con số dự báo đạt 25%.' }] },
    ],
  },
  {
    t: 'rule',
    formula: 'Đã qua → V-ed · Dự báo → is expected / projected / predicted to + V (by + năm)',
    vi: 'Một đường, hai thì: số thật dùng quá khứ đơn, số dự báo dùng khung "được dự đoán". Thân 1 = đã qua, thân 2 = dự báo.',
  },
  { t: "h", text: "20. Task 2 — đọc đề: đếm vế + chữ tuyệt đối / so sánh (Ngày 2 · Viết mục 2b)" },
  {
    t: 'table',
    caption: 'Đếm vế — hai đề tự soạn',
    head: ['Đề', 'Các vế', 'Xử lý'],
    rows: [
      ['Tourism brings more problems than benefits to local communities, **therefore** governments should limit the number of visitors.', '**Vế 1**: du lịch gây hại nhiều hơn lợi · **Vế 2**: chính phủ nên giới hạn số khách', 'Hoàn toàn đồng ý ⇒ phải bảo vệ **cả hai** vế: TB1 = hại > lợi, TB2 = vì sao giới hạn là đúng. Đồng ý vế 1 mà không đồng ý vế 2 ⇒ đó là **đồng ý một phần** — nói rõ trong thesis.'],
      ['Online courses are cheaper and more flexible than classroom courses, **so** universities should move **all** their teaching online.', '**Vế 1**: học online rẻ + linh hoạt hơn · **Vế 2**: đại học nên chuyển **toàn bộ** lên online', 'Vế 1 dễ đồng ý; vế 2 có chữ **all** ⇒ chỗ bám để phản đối. Thesis gợi ý: đồng ý vế 1, phản đối vế 2 (thí nghiệm, thực hành không học online được).'],
    ],
  },
  {
    t: 'table',
    caption: 'Chữ tuyệt đối / so sánh trong đề — chỗ bám để chọn quan điểm',
    head: ['Chữ trong đề', 'Đề muốn bạn làm gì', 'Gợi ý thesis'],
    rows: [
      ['**only · all · always · never · completely**', 'Thường quá mạnh ⇒ dễ **đồng ý một phần**: chấp nhận phần đúng, bác chữ tuyệt đối.', 'Children should **only** learn job-related subjects ⇒ "Job-related subjects matter, but children should **not only** study these, since art and sport also build important skills."'],
      ['**the best / the most effective / the most important**', 'Phải so với **cách khác**. Ba lập trường: (1) đúng là tốt nhất · (2) có cách **tốt ngang** · (3) có cách **tốt hơn**.', 'The best way to reduce traffic jams is to build more roads ⇒ "New roads may help in the short term, but **improving public transport is a more effective** long-term solution."'],
      ['**A is better than B · A is more important than B**', 'Cần **một tiêu chí chung** (chi phí, sức khoẻ, thời gian, hiệu quả…) và **câu so sánh trực tiếp** ở mỗi thân bài.', 'Playing sport is better than watching it ⇒ "In terms of health, playing sport is **far more beneficial than** watching it on TV."'],
    ],
  },
  {
    t: 'rule',
    formula: 'Đọc đề: gạch chủ đề → đếm vế (therefore / so / which / and) → khoanh chữ tuyệt đối (only / all / best / better than) → chọn quan điểm cho TỪNG vế',
    vi: 'Đồng ý hết mọi vế = hoàn toàn đồng ý; đồng ý vế này, phản đối vế kia hoặc bác chữ tuyệt đối = đồng ý một phần.',
  },
];
