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
];
