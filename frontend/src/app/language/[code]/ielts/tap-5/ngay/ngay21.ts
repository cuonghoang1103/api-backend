/**
 * IELTS Tập 5 — Ngày 21 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 * Khuôn N mod 4 = 1 ⇒ grammar · reading · LISTENING · homework (docs/ielts-lo-trinh-0-8.md mục 3.5, hàng 21).
 *   Bài 1 (grammar)   3 cấu trúc hiếm dùng ĐÚNG CHỖ trong Part 3 — câu chẻ khi nói · đảo ngữ “nói được” · giả định + đưa lên đầu câu,
 *                     cộng keo nối G44 để câu hiếm không nặng                                               [G36 G37 G42 G44]
 *                     — nối Tập 4 Ngày 7 (câu chẻ, đảo ngữ) · Tập 5 Ngày 11 (ngữ pháp nói, ellipsis) · Ngày 13 (câu chẻ / đảo ngữ trong
 *                       Task 2) · Ngày 19 (giả định trong văn viết). Hôm nay chỉ dạy phần CHƯA phủ: phiên bản NÓI, độ trang trọng, vị trí
 *                       trong câu trả lời 4 nhịp, liều lượng. Câu hỏi mẫu band 7 ↔ band 8: trả tiền cho trẻ làm việc nhà.
 *   Bài 2 (reading)   Chiến thuật band 8: đọc MỘT lượt, không quay lại; kế hoạch 55 phút [R20 X03] — giao thức một lượt cho 14 dạng,
 *                     luật dừng 90 giây, “cờ” trên máy, rồi đề nhỏ 2 passage / 27 câu / 38 phút: “The Eye That Goes Back” (~860 từ,
 *                     chuyển động mắt khi đọc: Matching information · Sentence completion · MCQ) + “Judged by the Outcome” (~920 từ,
 *                     may rủi đạo đức — moral luck: YNNG · Matching features · Summary hộp từ).
 *                     — nối Tập 5 Ngày 1 (đọc có ghi dấu) · Ngày 13 · 19 (đủ 3 passage) · Tập 4 Ngày 29 (ngày thi).
 *                     DỮ KIỆN có thật nhưng soạn theo trí nhớ, CHƯA mở nguồn đối chiếu, số liệu đã làm tròn / làm mờ: Javal (cuối thập
 *                     niên 1870) mô tả mắt nhảy; kỹ thuật “cửa sổ di động” thập niên 1970 (khoảng 14–15 chữ bên phải, 3–4 bên trái;
 *                     đảo chiều ở người đọc chữ viết phải → trái); khoảng 10–15 % cú nhảy là quay lui; thí nghiệm 2014 che chữ sau
 *                     khi mắt đi qua; bài tổng quan 2016 về đọc nhanh. Bernard Williams và Thomas Nagel cùng viết bài “Moral Luck”
 *                     năm 1976 (người hoạ sĩ phỏng theo Gauguin, “agent-regret”, bốn loại may rủi của Nagel); Kant về thiện chí;
 *                     các thí nghiệm tâm lý về outcome bias (không nêu tên tác giả). Bài có ghi chú “đừng dùng làm tài liệu tra cứu”.
 *   Bài 3 (listening) Podcast / tin tức tốc độ thật, giọng vùng [E08 L17 L18] — bản tin địa phương hư cấu (Ireland · Úc · Mỹ, ~175 wpm,
 *                     Questions 1–6) + podcast “Slips of the Ear” về nghe nhầm (New Zealand · Anh · Canada, ~900 từ ≈ 5 phút ở 175–180 wpm,
 *                     Questions 11–20: MCQ + Matching ý kiến) + thói quen nghe podcast thật mỗi ngày · 🔊 dạng yếu + nối âm ở tốc
 *                     độ đọc tin. Dữ kiện: Sylvia Wright đặt từ “mondegreen” năm 1954 (KHÔNG trích lời bài hát nào); giả thuyết
 *                     “âm tiết mạnh mở đầu từ” cuối thập niên 1980 (làm mờ). Giọng Scotland không có giọng máy — không giả.
 *                     — nối Tập 5 Ngày 1 (Part 1 giọng trộn) · Ngày 4 (4 người nói) · Ngày 20 (bài giảng giọng vùng).
 *   Bài tập Ngày 21   38 câu có đáp án + 2 speak (Part 3) — bài đọc “The Unopened Letter”, bản tin giọng Canada · New Zealand (hư cấu).
 * Đã grep tap-3…tap-5/ngay + thi-may/de trước khi chọn đề tài: moral luck, Gauguin, Nagel, Bernard Williams, saccade, eye movement,
 * mondegreen, mishear, meteorite, pocket money = 0 kết quả. Mọi id bắt đầu `t5d21-`.
 */
import type { Lesson } from '../data';

export const NGAY_21: Lesson[] = [
  /* ════════════════ BÀI 1 — NGỮ PHÁP ════════════════ */
  {
    id: "t5d21-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: 3 cấu trúc hiếm dùng đúng chỗ trong Part 3 — câu chẻ khi nói, đảo ngữ “nói được”, giả định và đưa lên đầu câu",
    goal: "Trong một câu trả lời Part 3 dài 40–60 giây, dùng 1–2 cấu trúc hiếm, mỗi cái ở đúng nhịp và làm đúng một việc (sửa tiền đề câu hỏi, câu xoay nhượng bộ hoặc câu chốt), chọn phiên bản nghe tự nhiên khi nói thay vì phiên bản văn viết, không mắc sáu lỗi hình thức người Việt hay mắc (thiếu trợ động từ sau Not only, đảo nhầm vế sau Only when, câu chẻ rỗng…).",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Grammatical Range & Accuracy** của Speaking. Band 7: dùng được một số cấu trúc phức, khá linh hoạt. Band 8: ==a wide range of structures, used flexibly==, đa số câu không lỗi, chỉ còn ==very occasional inappropriacies== — tức là chỗ dùng cấu trúc KHÔNG HỢP hoàn cảnh cũng bị tính.",
          "Ba cấu trúc hôm nay: ① **câu chẻ khi nói** (What worries me isn't…, it's… · Where I'd disagree is…) ② **đảo ngữ “nói được”** — chỉ năm khuôn người bản ngữ thật sự nói ③ **giả định + đưa lên đầu câu** (It's vital that everyone have… · If it weren't for… · Odd as it sounds,…).",
          "Đã học ở đâu: Tập 4 Ngày 7 (hình thức), Tập 5 Ngày 13 (trong Task 2), Ngày 19 (giả định khi viết), Ngày 11 (ngữ pháp nói). Hôm nay chỉ dạy phần ==chưa phủ==: phiên bản nói, độ trang trọng, vị trí, liều lượng.",
          "Luật vàng: **mỗi cấu trúc hiếm một việc** — tối đa một cái mỗi nhịp, thường 1–2 cái cho một câu trả lời, đặt ở nhịp 1 (sửa tiền đề), nhịp 3 (câu xoay) hoặc nhịp 4 (câu chốt). Không bao giờ ở câu đầu chỉ để “khoe”.",
          "Cấu trúc hiếm chỉ nổi khi xung quanh nó **nhẹ**: ellipsis, câu ngắn, chunks của Ngày 11 (and rightly so · if anything · not that…).",
        ],
      },

      { t: "h", text: "0. Kiểm nhanh đầu bài — năm câu của các ngày trước" },
      { t: "p", text: "Điền MỘT từ. Sai từ hai câu trở lên thì mở lại Tập 5 Ngày 13 mục 2–3 (câu chẻ, đảo ngữ) trước khi học tiếp." },
      {
        t: "quiz", id: "t5d21-on-dau-bai", kind: "fill", title: "Ôn đầu bài (5 câu) — điền MỘT từ",
        items: [
          { q: "1. ___ matters most is not how much money a city spends, but how it spends it.", answers: ["What"], hint: "Câu chẻ wh-: What + V + is… (Tập 4 Ngày 7)." },
          { q: "2. It was only when the factory closed ___ people realised how much the town depended on it.", answers: ["that"], hint: "It + be + (only when…) + that + mệnh đề." },
          { q: "3. Not only ___ the scheme cost less, but it was also far more popular.", answers: ["did"], hint: "Not only + trợ động từ + S + V nguyên. Thì quá khứ ⇒ did." },
          { q: "4. Had the council consulted residents, the plan ___ have gone more smoothly.", answers: ["would", "might", "could"], hint: "Đảo ngữ điều kiện loại 3: Had + S + V3, S + would / might + have + V3." },
          { q: "5. Rarely ___ a single policy changed a city so quickly.", answers: ["has"], hint: "Rarely + have / has + S + V3 (hiện tại hoàn thành)." },
        ],
      },
      { t: "rule", formula: "What + V + is…   ·   It + be + X + that…   ·   Not only + do/does/did + S + V   ·   Had + S + V3, S + would have V3", vi: "Bốn khuôn này bạn đã viết được. Hôm nay học NÓI chúng: chọn khuôn nào, ở nhịp nào, và khi nào đừng nói." },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao “hiếm” — và “đúng chỗ” nghĩa là gì trong một câu trả lời Part 3" },
      { t: "p", text: "Giám khảo Speaking không đếm số cấu trúc. Họ nghe xem cấu trúc có **làm một việc** không. Một câu đảo ngữ đặt ở câu đầu (“Never before has society faced…”) không làm việc gì ngoài báo hiệu “tôi đã học thuộc”. Cùng câu đó đặt sau một nhượng bộ, khi bạn cần nhấn mức độ, lại là điểm cộng. Bảng dưới gán mỗi cấu trúc một VIỆC." },
      {
        t: "table",
        head: ["Cấu trúc", "Việc nó làm trong Part 3", "Nhịp nên đặt", "Liều"],
        rows: [
          ["**Câu chẻ khi nói**", "sửa tiền đề của câu hỏi; thu hẹp trọng tâm (“không phải X, mà là Y”)", "nhịp 1 (ngay câu trả lời thẳng) hoặc nhịp 3", "tối đa 1 / câu trả lời"],
          ["**Đảo ngữ “nói được”**", "nhấn mức độ; nêu điều kiện giả định một cách nghiêm túc", "nhịp 3 (câu xoay) hoặc nhịp 4 (câu chốt)", "2–3 lần cả bài thi"],
          ["**Giả định + đưa lên đầu câu**", "nói điều kiện cần (It's vital that…); nhượng bộ có chọn lọc (That I accept. What I don't accept is…)", "câu hỏi chính sách / đạo đức, nhịp 3", "1 lần mỗi câu chính sách"],
          ["**Keo G44**", "giữ cho xung quanh nhẹ: ellipsis, chunks, câu ngắn", "khắp nơi", "không giới hạn"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Câu trả lời Part 3 bốn nhịp — chỗ đặt cấu trúc hiếm",
        caption: "Ô có dấu ★ là chỗ một cấu trúc hiếm làm được việc. Một câu trả lời thường dùng 1–2 ô ★, mỗi ô tối đa một cấu trúc.",
        steps: [
          { label: "① Trả lời thẳng", sub: "★ câu chẻ nếu câu hỏi có tiền đề sai: “What's changed isn't…, it's…”" },
          { label: "② Lý do + cơ chế", sub: "câu thường, rõ; ví dụ cụ thể" },
          { label: "③ Câu xoay", sub: "★ nhượng bộ / phạm vi: “That I'd accept. Where it goes wrong is…” · “Should that happen,…”" },
          { label: "④ Câu chốt", sub: "★ đảo ngữ nhấn mức độ: “Only then do…” · hoặc câu ngắn, dứt khoát" },
        ],
      },
      { t: "rule", formula: "1–2 ★ / câu trả lời   ·   ★ ở ① (sửa tiền đề) · ③ (xoay) · ④ (chốt), mỗi nhịp tối đa một ★   ·   không ★ ở câu mở đầu chỉ để khoe", vi: "Cấu trúc hiếm là gia vị. Rắc vào chỗ lập luận đổi hướng thì người nghe nhận ra; rắc khắp nơi thì thành món mặn." },

      /* ── 2 ── */
      { t: "h", text: "2. Cấu trúc 1 — câu chẻ khi nói: sửa tiền đề, thu hẹp trọng tâm" },
      { t: "p", text: "Ngày 13 dạy câu chẻ trong bài viết: It is… that… và What… is…. Khi NÓI, người bản ngữ dùng những biến thể ngắn hơn, có động từ chỉ suy nghĩ (worries, bothers, strikes me), và rất hay đi với **not X, (it's) Y**. Sáu khuôn dưới đây đủ cho mọi câu hỏi Part 3." },
      {
        t: "patterns",
        rows: [
          { formula: "What + S + V + isn't X, it's Y", vi: "sửa tiền đề: câu hỏi giả định X, bạn chỉ ra Y mới là chuyện chính", examples: [
            { en: "What worries me isn't that people read less; it's that they read in shorter pieces.", vi: "Điều làm tôi lo không phải là người ta đọc ít hơn, mà là họ đọc từng mẩu ngắn hơn." },
            { en: "What's changed isn't the amount of free time, it's who controls it.", vi: "Thứ thay đổi không phải là lượng thời gian rảnh, mà là ai nắm nó." },
          ] },
          { formula: "Where + S + V + is (on / in / when)…", vi: "chỉ ra CHỖ mình đồng ý / không đồng ý — rất hợp nhịp ③", examples: [
            { en: "Where I'd part company with that argument is on cost.", vi: "Chỗ tôi không đi cùng lập luận đó là ở chi phí." },
            { en: "Where these schemes tend to fail is in the second year, when the novelty wears off.", vi: "Chỗ các chương trình này hay hỏng là ở năm thứ hai, khi cái mới đã nhạt." },
          ] },
          { formula: "It's not so much X as Y", vi: "thu hẹp: X có phần đúng, nhưng Y mới đúng hơn (không phải câu chẻ thuần, nhưng làm đúng việc của nó)", examples: [
            { en: "It's not so much that teenagers don't care as that nobody asks them.", vi: "Không hẳn là thanh thiếu niên không quan tâm, mà là chẳng ai hỏi các em." },
          ] },
          { formula: "The thing / The problem / The irony is (that)…", vi: "câu chẻ “nhẹ” nhất khi nói; đặt trước ý quan trọng nhất", examples: [
            { en: "The irony is that the cheapest option often turns out to be the most expensive.", vi: "Điều trớ trêu là phương án rẻ nhất lại thường hoá ra đắt nhất." },
          ] },
          { formula: "All + S + V + is (to) V…", vi: "giảm nhẹ lập trường của mình: “tôi chỉ nói rằng…”", examples: [
            { en: "All I'm saying is that we should test it before we roll it out everywhere.", vi: "Tôi chỉ nói là ta nên thử trước khi triển khai khắp nơi." },
            { en: "All it takes is one bad experience for people to stop trusting the system.", vi: "Chỉ cần một trải nghiệm tệ là người ta thôi tin hệ thống." },
          ] },
          { formula: "N / mệnh đề — that's what / why…", vi: "câu chẻ đảo (đưa ý lên trước, chốt bằng that's what): hợp nhịp ④", examples: [
            { en: "Feeling that someone is actually listening — that's what keeps people coming back.", vi: "Cảm giác có người thật sự lắng nghe — chính điều đó khiến người ta quay lại." },
          ] },
        ],
      },
      {
        t: "table", caption: "Câu chẻ rỗng (band 6–7) và câu chẻ có việc (band 8)",
        head: ["Câu chẻ rỗng", "Vì sao yếu", "Câu chẻ có việc"],
        rows: [
          ["What I want to say is that I think it's a good idea.", "không có X bị gạt bỏ, không có Y được nhấn; chỉ thêm chữ", "What makes it a good idea isn't the money, it's the habit it builds."],
          ["The thing is that, um, the thing is technology.", "lặp khung khi bí ý", "The thing is, the technology already exists — the problem is who pays for it."],
          ["It is the government that should do it.", "đúng ngữ pháp nhưng giọng văn viết, nghe như đọc", "If anyone should pay for it, it's the government."],
        ],
      },
      {
        t: "note", title: "⚠️ Lỗi người Việt hay mắc khi nói câu chẻ",
        items: [
          "~~What I worry is the cost.~~ → What I worry **about** is the cost. Động từ có giới từ (worry about, care about, object to) phải giữ giới từ trong mệnh đề What.",
          "~~What makes me surprised it is the price.~~ → What surprises me is the price. Không thêm **it** sau mệnh đề What; và dùng động từ cảm xúc thẳng (surprises, bothers, strikes).",
          "~~It is the parents that makes the decision.~~ → It's the parents **who make** the decision. Động từ sau that / who hoà hợp với danh từ được chẻ (parents ⇒ make).",
          "~~The reason is because…~~ → The reason is **that**… — lỗi rất hay nghe ở band 6–7.",
          "Lặp “is is” (What matters is is…) khi nói nhanh: người bản ngữ cũng mắc, giám khảo ít trừ, nhưng đừng tập thành thói quen.",
        ],
      },
      { t: "rule", formula: "What + S + V (+ giới từ) + isn't X, it's Y   ·   Where + S + V + is…   ·   It's not so much X as Y", vi: "Câu chẻ khi nói phải gạt bỏ một X cụ thể. Không có X để gạt thì đừng chẻ." },
      {
        t: "quiz", id: "t5d21-cau-che-dich", kind: "translate", title: "Dịch Việt → Anh — câu chẻ khi nói (4 câu)",
        grammar: "What + S + V + isn't X, it's Y · Where + S + V + is… · It's not so much X as Y · All + S + V + is…",
        items: [
          { q: "1. Điều làm tôi bận tâm không phải là giá vé, mà là việc chẳng có xe buýt nào sau chín giờ tối.", answers: ["What bothers me isn't the fare, it's that there are no buses after nine in the evening.", "What bothers me isn't the price of the ticket, it's that there are no buses after 9 pm.", "What bothers me is not the fare but the fact that there are no buses after nine at night."], hint: "What bothers me isn't…, it's that…" },
          { q: "2. Chỗ tôi không đồng ý là ở cách đo thành công.", answers: ["Where I disagree is in how success is measured.", "Where I'd disagree is on how success is measured.", "Where I disagree is on the way success is measured."], hint: "Where I('d) disagree is in / on how…" },
          { q: "3. Không hẳn là người già ngại công nghệ, mà là công nghệ không được thiết kế cho họ.", answers: ["It's not so much that older people are afraid of technology as that it isn't designed for them.", "It's not so much that elderly people are wary of technology as that technology isn't designed for them."], hint: "It's not so much that… as that…" },
          { q: "4. Tôi chỉ nói là nên hỏi người dân trước.", answers: ["All I'm saying is that residents should be asked first.", "All I'm saying is that we should ask residents first.", "All I'm saying is that local people should be consulted first."], hint: "All I'm saying is (that)…" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Cấu trúc 2 — đảo ngữ “nói được”: năm khuôn, và ba khuôn để dành cho bài viết" },
      { t: "p", text: "Phần lớn đảo ngữ trong sách ngữ pháp thuộc văn viết trang trọng. Nói chúng trong Part 3 giống mặc com-lê đi chợ: không sai, nhưng lạ. Năm khuôn dưới đây người bản ngữ có học vẫn dùng khi bàn chuyện nghiêm túc. Ba khuôn cuối bảng để dành cho Task 2." },
      {
        t: "table",
        head: ["Khuôn", "Ví dụ Part 3", "Khi nói", "Ghi chú"],
        rows: [
          ["**Not only + trợ ĐT + S + V, (but)…**", "Not only does it save money, it actually gets used.", "✅ tự nhiên", "khi nói thường bỏ but also, chỉ ngừng rồi nói vế sau"],
          ["**Only when / if / then + trợ ĐT + S + V**", "Only when people can see the benefit do they change their habits.", "✅ nói chậm, nhấn Only", "đảo ở VẾ CHÍNH, không đảo vế when"],
          ["**Should + S + V, …** (điều kiện)", "Should that happen, I think the government would have to step in.", "✅ trang trọng vừa", "hợp câu dự đoán / giả định; một lần"],
          ["**Had + S + V3, …** (điều kiện loại 3)", "Had they asked residents first, the scheme might have worked.", "✅ trang trọng vừa", "để bình luận một chính sách đã hỏng"],
          ["**Little did + S + V**", "Little did I know that I'd end up working there.", "✅ CHỈ khi kể (Part 2)", "trong Part 3 nghe như kể chuyện cổ tích"],
          ["Never / Rarely / Seldom + have + S + V3", "Rarely has a technology spread so fast.", "⚠️ như diễn văn", "nói: It's rare for… / I can't think of another… that…"],
          ["So + adj + be + S + that…", "So great was the demand that…", "❌ để dành viết", "nói: It was so popular that…"],
          ["Were + S + to + V", "Were the tax to rise, demand would fall.", "❌ để dành viết", "nói: If the tax went up,…"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "Not only + do / does / did + S + V…, (S + V)…", vi: "nhấn rằng có HAI lợi ích / hai vấn đề, cái sau mạnh hơn", examples: [
            { en: "Not only do these programmes cost very little, they reach people that nothing else reaches.", vi: "Các chương trình này không chỉ tốn rất ít, chúng còn chạm tới những người mà không gì khác chạm tới được." },
          ] },
          { formula: "Only when / if + S + V… + do / does / will + S + V", vi: "điều kiện duy nhất — câu chốt rất mạnh", examples: [
            { en: "Only if the rules apply to everyone will people accept them.", vi: "Chỉ khi luật áp dụng cho tất cả, người ta mới chấp nhận nó." },
            { en: "Only then do you realise how much you relied on it.", vi: "Chỉ lúc đó bạn mới nhận ra mình đã dựa vào nó nhiều thế nào." },
          ] },
          { formula: "Should + S + V…, S + would / will + V", vi: "nếu chẳng may / trong trường hợp — dự đoán có điều kiện", examples: [
            { en: "Should prices keep rising, I suspect more people will simply stay at home.", vi: "Nếu giá cứ tiếp tục tăng, tôi đoán sẽ có thêm nhiều người chỉ ở nhà." },
          ] },
          { formula: "Had + S + V3…, S + might / would + have + V3", vi: "bình luận một việc đã xảy ra theo cách khác", examples: [
            { en: "Had the city kept the old tram lines, it wouldn't be spending millions on new ones now.", vi: "Nếu thành phố giữ lại đường tàu điện cũ thì giờ đã không phải tốn hàng triệu cho đường mới. (điều kiện hỗn hợp — Ngày 19)" },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Sai hình thức — sáu lỗi nghe thấy nhiều nhất",
        items: [
          "~~Not only it saves money…~~ → Not only **does it** save money… — thiếu trợ động từ là lỗi số một.",
          "~~Only when people see the benefit they change.~~ → Only when people see the benefit **do they** change. Không đảo ⇒ câu sai.",
          "~~Only when do people see the benefit, they change.~~ → đảo NHẦM vế. Vế đi sau Only when giữ trật tự thường; vế CHÍNH mới đảo.",
          "~~Hardly people use cash now.~~ → **Hardly anyone** uses cash now. Hardly + any- là cách nói tự nhiên, không cần đảo.",
          "~~Should it will happen,…~~ → **Should it happen**,… — sau Should là động từ nguyên mẫu.",
          "~~Had they ask…~~ → Had they **asked**… — sau Had là V3.",
        ],
      },
      { t: "rule", formula: "Not only + do/does/did + S + V   ·   Only when + S + V + do/does + S + V   ·   Should + S + V   ·   Had + S + V3", vi: "Bốn khuôn này nói được trong Part 3. Never / So / Were… to để dành cho Task 2." },
      {
        t: "quiz", id: "t5d21-dao-ngu-dich", kind: "translate", title: "Dịch Việt → Anh — đảo ngữ nói được (4 câu)",
        grammar: "Not only + trợ ĐT + S + V · Only when / if + S + V + trợ ĐT + S + V · Should + S + V · Had + S + V3",
        items: [
          { q: "1. Ứng dụng ấy không chỉ miễn phí, nó còn dễ dùng hơn nhiều.", answers: ["Not only is the app free, it's also much easier to use.", "Not only is that app free, it's also far easier to use.", "Not only is the app free, but it's also much easier to use."], hint: "Not only + is + S…, it's also…" },
          { q: "2. Chỉ khi giá giảm thì người ta mới đổi sang xe điện.", answers: ["Only when prices fall will people switch to electric cars.", "Only when prices come down do people switch to electric cars.", "Only when the price falls will people switch to electric cars."], hint: "Only when + S + V, will / do + S + V" },
          { q: "3. Nếu chuyện đó xảy ra, tôi nghĩ các trường sẽ phải thay đổi cách dạy.", answers: ["Should that happen, I think schools would have to change the way they teach.", "Should that happen, I think schools will have to change how they teach."], hint: "Should + that + happen, …" },
          { q: "4. Nếu họ thử nghiệm trước thì có lẽ dự án đã không thất bại.", answers: ["Had they tested it first, the project might not have failed.", "Had they tested it beforehand, the project might not have failed.", "Had they piloted it first, the project might not have failed."], hint: "Had + S + V3, S + might not have + V3" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Cấu trúc 3 — giả định và đưa lên đầu câu: điều kiện cần, nhượng bộ có chọn lọc" },
      { t: "p", text: "Ngày 19 dạy giả định (subjunctive) và các cấu trúc trang trọng trong bài viết. Khi nói, bốn nhóm sau dùng được — mỗi nhóm có một phiên bản “nhẹ” và một phiên bản “nặng”. Band 8 biết chọn: câu chính sách nghiêm túc thì dùng bản nặng một lần; còn lại dùng bản nhẹ." },
      {
        t: "table",
        head: ["Nhóm", "Bản nhẹ (nói thoải mái)", "Bản nặng (một lần, câu nghiêm túc)", "Việc trong Part 3"],
        rows: [
          ["**Điều kiện cần**", "It's vital that everyone **should have**… / It's vital that everyone **has**… (Anh–Anh)", "It's vital that every child **have** access to… (giả định: V nguyên, không -s)", "câu hỏi chính sách: What should governments do…?"],
          ["**Nếu không có X**", "**If it weren't for** subsidies, …", "**Were it not for** subsidies, … · **But for** subsidies, …", "chỉ ra một yếu tố đang giữ mọi thứ đứng vững"],
          ["**Nhượng bộ đưa lên đầu**", "It sounds odd, but…", "**Odd as it may sound**, … · **Expensive though it is**, …", "câu xoay ③: thừa nhận rồi vượt qua"],
          ["**Tân ngữ đưa lên đầu**", "I can accept that. What I can't accept is…", "**That I can accept.** What I can't accept is…", "nhượng bộ có chọn lọc — chấp nhận một nửa, bác nửa kia"],
          ["**Cụm giả định cố định**", "if necessary · anyway", "**if need be** · **be that as it may** · **come what may** · **as it were**", "một lần, đúng nghĩa; đừng ghép hai cụm"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Were it not for volunteers, half the museums in my province would have closed years ago.", vi: "Nếu không có tình nguyện viên, một nửa số bảo tàng ở tỉnh tôi đã đóng cửa từ nhiều năm trước." },
          { en: "Odd as it may sound, I think a four-hour journey is part of what makes the trip worth it.", vi: "Nghe có vẻ lạ, nhưng tôi nghĩ bốn tiếng đi đường là một phần làm chuyến đi đáng giá." },
          { en: "That it's expensive, I accept. What I don't accept is that it's a waste.", vi: "Việc nó đắt, tôi chấp nhận. Điều tôi không chấp nhận là bảo nó lãng phí." },
          { en: "It's essential that the person making the decision be accountable to the people it affects.", vi: "Điều cốt yếu là người ra quyết định phải chịu trách nhiệm trước những người chịu ảnh hưởng. (be nguyên mẫu — giả định)" },
          { en: "I'd keep the scheme going, and raise the fee if need be.", vi: "Tôi sẽ giữ chương trình, và tăng phí nếu cần." },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — giả định và đưa lên đầu câu",
        items: [
          "It's important that he **goes** / he **should go** / he **go**: cả ba đều chấp nhận được (Anh–Anh hay dùng should hoặc -s; Anh–Mỹ hay dùng V nguyên). ~~It's important that he must go~~ và ~~that he to go~~ thì SAI.",
          "**Were it not for** + CỤM DANH TỪ, không + mệnh đề: ~~Were it not for people don't care…~~ → Were it not for people's indifference… / If people didn't care so little…",
          "~~Expensive as is it~~ → **Expensive as it is** — trong khuôn adj + as / though + S + V, KHÔNG đảo S và V.",
          "Odd as it may sound = Although it may sound odd. Đừng nói ~~As odd as it may sound, but…~~ — đã có as thì không thêm but.",
          "Mỗi câu trả lời một cụm nặng. “Be that as it may, come what may, we must…” là hai cụm liền nhau — nghe như diễn văn tranh cử.",
        ],
      },
      { t: "rule", formula: "It's vital that + S + (should) + V   ·   If it weren't for / Were it not for + N   ·   adj + as / though + S + V,   ·   That I accept. What I don't accept is…", vi: "Bản nặng dùng một lần cho câu chính sách / đạo đức; còn lại nói bản nhẹ." },
      {
        t: "quiz", id: "t5d21-gia-dinh-dich", kind: "translate", title: "Dịch Việt → Anh — giả định, đưa lên đầu câu (4 câu)",
        grammar: "It's vital that + S + V · If it weren't for / Were it not for + N · adj + as + S + V · That I accept. What I don't accept is…",
        items: [
          { q: "1. Nếu không có internet giá rẻ, phần lớn các khoá học này đã không tồn tại.", answers: ["If it weren't for cheap internet, most of these courses wouldn't exist.", "Were it not for cheap internet, most of these courses wouldn't exist.", "But for cheap internet access, most of these courses wouldn't exist."], hint: "If it weren't for / Were it not for + N, … wouldn't exist" },
          { q: "2. Nghe có vẻ lạ, nhưng tôi nghĩ trẻ em cần chán một chút.", answers: ["Odd as it may sound, I think children need to be a bit bored.", "Strange as it may sound, I think children need to get bored sometimes.", "Odd as it sounds, I think children need to be bored now and then."], hint: "Odd / Strange as it may sound, …" },
          { q: "3. Điều cốt yếu là mọi đứa trẻ đều được học bơi.", answers: ["It's essential that every child learn to swim.", "It's essential that every child should learn to swim.", "It's essential that every child learns to swim.", "It is essential that every child learn to swim."], hint: "It's essential that + S + (should) + V" },
          { q: "4. Việc nó chậm, tôi chấp nhận. Điều tôi không chấp nhận là nó không an toàn.", answers: ["That it's slow, I accept. What I don't accept is that it isn't safe.", "That it's slow I can accept. What I can't accept is that it's unsafe.", "That it is slow, I accept. What I don't accept is that it is not safe."], hint: "That + mệnh đề, I accept. What I don't accept is that…" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Keo nối G44 — để câu hiếm không “nặng”" },
      { t: "p", text: "Ngày 11 dạy ellipsis và chunks của văn nói. Hôm nay dùng chúng như **đệm** quanh cấu trúc hiếm. Quy tắc: câu trước và câu sau một cấu trúc hiếm nên ngắn và thân mật. Người nghe cảm thấy bạn đang nói, không đang đọc." },
      {
        t: "table",
        head: ["Keo", "Nghĩa", "Đứng cạnh cấu trúc hiếm"],
        rows: [
          ["**…, and rightly so.**", "và như thế là đúng", "People are suspicious of these apps — and rightly so. What worries me is…"],
          ["**If anything, …**", "nếu có gì thì (còn ngược lại)", "It hasn't made us lazier. If anything, it's the opposite."],
          ["**I'd like to think so. / I doubt it.**", "trả lời rút gọn", "Will it last? I'd like to think so. Only if it's funded properly, though, will it survive."],
          ["**Not that…**", "không phải là (chen ý phụ)", "Not that money is the only issue — where it really goes wrong is…"],
          ["**…, or rather, …**", "hay đúng hơn là", "It's the parents, or rather the grandparents, who…"],
          ["**…, though.**", "dù vậy (cuối câu)", "It's expensive, though. That I'd accept if…"],
        ],
      },
      { t: "rule", formula: "câu ngắn + keo  →  ★ cấu trúc hiếm  →  câu ngắn", vi: "Đệm hai bên bằng câu ngắn và chunks; cấu trúc hiếm nằm giữa sẽ nổi mà không lên giọng diễn văn." },

      /* ── 6 ── */
      { t: "h", text: "6. Đặt đúng chỗ — một câu hỏi Part 3, band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "Câu hỏi: **“Should children be paid for doing household chores?”** Nghe hai câu trả lời. Đếm cấu trúc hiếm trong mỗi bài, rồi hỏi: mỗi cái làm việc gì?" },
      {
        t: "dialogue", title: "Bài nói band 7 (ước tính) — khoảng 45 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Should children be paid for doing household chores?" },
          { who: "Thí sinh A", role: "a", text: "Well, not only is it a controversial question, but it is also a very interesting one. What I want to say is that I think children should not be paid, because chores are part of family life. Never before have children been so busy with homework, so maybe some parents think money is a good motivation. However, it is essential that children learn responsibility. In conclusion, I believe that they should not be paid.", vi: "Ba cấu trúc hiếm, không cái nào làm việc: Not only… ở câu đầu chỉ để mở bài; What I want to say is… là câu chẻ rỗng; Never before have… nghe như diễn văn và lạc ý. “In conclusion” là ngôn ngữ bài viết." },
        ],
      },
      {
        t: "dialogue", title: "Bài nói band 8 (ước tính) — khoảng 50 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Should children be paid for doing household chores?" },
          { who: "Thí sinh B", role: "candidate", text: "I'd say not for the basic ones, no. What bothers me about paying for everything isn't the money, it's the message — that you only help at home if there's something in it for you.", vi: "① Trả lời thẳng + ★ câu chẻ sửa tiền đề: vấn đề không phải tiền, mà là thông điệp." },
          { who: "Thí sinh B", role: "candidate", text: "My parents never paid me for washing up, and I don't think I'd have done it more willingly if they had. That said, I can see the case for paying for extra jobs — cleaning the car, say. I'd go along with that, because it teaches them what work's worth.", vi: "② Lý do + ví dụ thật → ③ câu xoay bằng câu THƯỜNG (That said… I'd go along with that) — không cần ★ ở đây, vì câu chốt sẽ dùng ★." },
          { who: "Thí sinh B", role: "candidate", text: "But only if the everyday stuff is done for nothing does the money actually mean anything. Otherwise it's just wages.", vi: "④ Câu chốt: đảo ngữ Only if… does… — hơi trang trọng, nhưng đặt ở câu chốt nên có sức nặng. Câu cuối ngắn, thân mật làm đệm." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8", "Động tác tạo khác biệt"],
        rows: [
          ["**GRA — phạm vi**", "3 cấu trúc hiếm, đều ở chỗ trang trí", "2 cấu trúc hiếm (câu chẻ ở nhịp ①, Only if… does ở nhịp ④), mỗi cái một việc; phần còn lại là câu thường đa dạng", "gắn mỗi cấu trúc một VIỆC"],
          ["**GRA — phù hợp**", "Never before have… + In conclusion: văn viết", "“I'd say not…, no.” · “cleaning the car, say” · “it's just wages”", "đệm bằng câu ngắn, chunks"],
          ["**FC**", "ý nhảy: busy with homework không liên quan", "mạch: thông điệp → kinh nghiệm → ngoại lệ → điều kiện", "câu xoay có thật, không phải However máy móc"],
          ["**LR**", "controversial, motivation, responsibility (chung chung)", "something in it for you · washing up · what work's worth · wages", "từ cụ thể, đúng register nói"],
        ],
      },
      {
        t: "note", title: "📌 Ghi nhớ — đếm được, nhưng đừng đếm khi nói",
        items: [
          "Bài band 7 có BA cấu trúc hiếm, bài band 8 chỉ có HAI — vậy mà phạm vi ngữ pháp của bài band 8 được đánh giá cao hơn. Khác nhau không ở SỐ LƯỢNG mà ở VIỆC — đúng điều mô tả band 8 gọi là “flexibly”.",
          "Khi luyện: ghi âm, nghe lại, gạch chân cấu trúc hiếm, viết bên cạnh nó làm việc gì (sửa tiền đề / xoay / chốt). Không viết được việc ⇒ bỏ nó.",
          "Trong phòng thi: đừng nghĩ “phải chèn đảo ngữ”. Nghĩ “mình đang xoay ý” — câu xoay tự gọi cấu trúc đến.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Chọn chỗ — câu nào dùng cấu trúc hiếm đúng việc? (6 câu)" },
      {
        t: "mcq", id: "t5d21-chon-cho", title: "Cấu trúc hiếm đúng chỗ (6 câu)",
        items: [
          { q: "1. Câu hỏi: “Is technology making people lonelier?” Câu mở đầu nào tốt nhất?", options: ["Never before has technology been so important in our lives.", "What's making people lonelier isn't technology itself, it's what it's replaced — the reasons we used to have to go out.", "It is technology that is making people lonelier, in my opinion."], correct: 1, why: "Câu chẻ sửa tiền đề (công nghệ tự nó ↔ thứ nó thay thế) — làm việc ở nhịp ①. A là diễn văn lạc đề; C là câu chẻ kiểu văn viết, không gạt bỏ X nào." },
          { q: "2. Câu nào đúng hình thức?", options: ["Only when the weather is good people go to the park.", "Only when the weather is good do people go to the park.", "Only when is the weather good do people go to the park."], correct: 1, why: "Vế sau Only when giữ trật tự thường; vế chính đảo (do people go)." },
          { q: "3. Trong câu trả lời về chính sách giao thông, chỗ hợp nhất cho “Should fuel prices keep rising, …” là:", options: ["câu đầu tiên, trước khi trả lời", "nhịp ③ — khi chuyển sang một kịch bản giả định", "cuối cùng, sau câu chốt"], correct: 1, why: "Should + S + V là điều kiện giả định — hợp câu xoay sang tình huống khác." },
          { q: "4. Câu nào tự nhiên nhất khi NÓI?", options: ["So popular was the scheme that it was extended.", "The scheme was so popular that they extended it.", "Such was the popularity of the scheme that it was extended."], correct: 1, why: "So… that thường ⇒ tự nhiên khi nói. A và C là đảo ngữ văn viết." },
          { q: "5. Câu nào SAI?", options: ["Expensive as it is, it's worth it.", "Were it not for the subsidy, the bus would stop running.", "Were it not for the government doesn't help, the bus would stop."], correct: 2, why: "Were it not for + CỤM DANH TỪ, không + mệnh đề. Sửa: Were it not for government help…" },
          { q: "6. Bài nói nào có liều đúng?", options: ["ba câu chẻ liền nhau trong 40 giây", "một câu chẻ ở nhịp ①, các câu còn lại ngắn và thân mật", "một đảo ngữ ở câu đầu và một ở câu cuối, giữa không có ví dụ"], correct: 1, why: "Một ★ cho một câu trả lời; xung quanh nhẹ. C thiếu nhịp ② (lý do + ví dụ) — mất FC." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Kiểm tra cuối bài (10 câu)" },
      {
        t: "quiz", id: "t5d21-np-kiem", kind: "fill", title: "Điền MỘT từ (6 câu)",
        items: [
          { q: "1. What I object ___ isn't the tax itself, it's how it's collected.", answers: ["to"], hint: "object TO — giữ giới từ trong mệnh đề What." },
          { q: "2. It's not so much that they can't afford it ___ that they don't see the point.", answers: ["as"], hint: "It's not so much X as Y." },
          { q: "3. Not only ___ it cheaper, it's quicker.", answers: ["is"], hint: "Not only + is + it + adj." },
          { q: "4. Only if the service is reliable ___ people use it.", answers: ["will", "do"], hint: "Only if… + will / do + S + V." },
          { q: "5. ___ it not for the bridge, the village would be cut off every winter.", answers: ["Were"], hint: "Were it not for + N." },
          { q: "6. Strange ___ it may sound, I enjoy long train journeys.", answers: ["as", "though"], hint: "adj + as / though + S + V." },
        ],
      },
      {
        t: "mcq", id: "t5d21-np-chon", title: "Chọn câu tự nhiên và đúng (4 câu)",
        items: [
          { q: "1. Bạn muốn sửa tiền đề “Young people don't care about politics.”", options: ["What young people don't care about is politics.", "It's not so much that young people don't care about politics as that they don't trust politicians.", "Not only do young people care about politics."], correct: 1, why: "It's not so much X as Y gạt X (không quan tâm) và đưa Y (không tin chính trị gia). A lặp tiền đề; C cụt vế sau." },
          { q: "2. Câu nào đúng?", options: ["Had they told us earlier, we could have prepared.", "Had they tell us earlier, we could have prepared.", "Had they told us earlier, we could prepare yesterday."], correct: 0, why: "Had + S + V3, S + could have + V3." },
          { q: "3. “It's essential that every school ___ a trained nurse.”", options: ["has / have / should have — đều chấp nhận", "must has", "to have"], correct: 0, why: "Sau It's essential that: has (Anh–Anh thân mật), have (giả định), should have — đều được." },
          { q: "4. Câu nào là câu chẻ RỖNG?", options: ["What I'd like to say is that I agree.", "Where I'd disagree is on the timing.", "What worries me isn't the speed, it's the noise."], correct: 0, why: "A không gạt bỏ gì, không nhấn gì — chỉ kéo dài câu. B và C đều chỉ ra một chỗ cụ thể." },
        ],
      },
      {
        t: "note", title: "📌 Ghi vào sổ Speaking",
        items: [
          "Chép ba câu ★ của riêng bạn — một câu chẻ, một đảo ngữ nói được, một câu “That I accept. What I don't accept is…” — cho ba chủ đề bạn hay gặp (giáo dục, công nghệ, môi trường).",
          "Bài 3 hôm nay (podcast) có ít nhất bốn câu chẻ người bản ngữ nói thật — nghe ra và chép lại. Ngày 23 (Part 3 phản biện giám khảo khéo) dùng lại đúng khung bốn nhịp này.",
        ],
      },
    ],
  },

  /* ════════════════ BÀI 2 — ĐỌC ════════════════ */
  {
    id: "t5d21-doc",
    kind: "reading",
    title: "Đọc: Chiến thuật band 8 — đọc một lượt, không quay lại; kế hoạch 55 phút (đề nhỏ 2 passage · 27 câu · 38 phút)",
    goal: "Làm Reading theo giao thức MỘT LƯỢT: mỗi đoạn đọc một lần, trả lời ngay khi đi qua chỗ có đáp án, câu bí quá 90 giây thì đoán có lý + gắn cờ, chỉ quay lại cờ ở 5 phút đệm cuối — và đạt ≥ 23/27 câu trong đề nhỏ 38 phút (tương đương ≥ 35/40 cả bài).",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Ngày 1 dạy **đọc một lần có ghi dấu** cho MỘT passage. Hôm nay mở rộng ra **cả bài 60 phút**: làm sao để không bao giờ phải đọc lại một đoạn từ đầu, kể cả với dạng câu hỏi không theo thứ tự (Headings, Matching information, Matching features).",
          "Phân biệt hai kiểu “quay lại”: **quay lui nhỏ** (mắt lùi một hai chữ để sửa một chỗ hiểu nhầm — có ích, đừng cấm) và **đọc lại cả đoạn** (bỏ câu hỏi, đọc lại từ đầu — đây mới là chỗ mất 8–12 phút mỗi bài).",
          "Luật dừng **90 giây / câu**, thang đoán có lý bốn bậc, và cờ trên bản thi máy tính.",
          "Kế hoạch band 8: **16 – 18 – 19 phút** + 5 phút đệm cho cờ + 2 phút soát chính tả. Bản máy không có giờ chép đáp án — đáp án gõ thẳng.",
          "Đề nhỏ: hai passage, 27 câu, 38 phút. Bài đọc thứ nhất nói đúng về chuyện mắt quay lui khi đọc — đọc xong bạn sẽ hiểu vì sao giao thức hôm nay KHÔNG cấm mọi cái nhìn lại.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao “quay lại” là lỗ — tính bằng phút" },
      { t: "p", text: "Người band 7 hiếm khi hết giờ vì đọc chậm. Họ hết giờ vì đọc **hai lần**: một lần “cho biết bài nói gì”, rồi đọc lại từng phần khi gặp câu hỏi. Bảng dưới là số liệu ước lượng từ nhật ký làm bài của người học ở mức 7.0–7.5 (con số làm tròn để minh hoạ, không phải số đo khoa học)." },
      {
        t: "table",
        head: ["Thói quen", "Tốn mỗi passage", "Cả bài", "Thay bằng"],
        rows: [
          ["Đọc lướt cả bài trước khi xem câu hỏi", "2–3 phút", "6–9 phút", "đọc câu hỏi nhóm đầu → đọc đoạn A"],
          ["Gặp câu Matching information → đọc lại từ đầu tìm từng câu", "4–6 phút", "4–6 phút", "giữ 5 câu trong đầu khi đọc; gặp đoạn nào khớp thì ghi ngay"],
          ["Câu khó: đọc đi đọc lại cùng một đoạn 3–4 lần", "2–4 phút / câu", "4–8 phút", "luật 90 giây + đoán có lý + cờ"],
          ["Soát lại toàn bộ đáp án cuối giờ", "—", "4–5 phút", "chỉ mở lại câu có cờ"],
        ],
      },
      {
        t: "note", title: "📌 Ghi nhớ — quay lui nhỏ khác đọc lại",
        items: [
          "Mắt người đọc giỏi vẫn lùi lại một hai chữ khi một câu hoá ra có nghĩa khác dự đoán. Đó là sửa lỗi hiểu — rẻ, nhanh, đừng ép mình bỏ.",
          "Cái cần bỏ là **đọc lại có hệ thống**: quay về đầu đoạn, đầu bài, vì lần đọc đầu đã không được dùng (không ghi lề, không trả lời).",
          "Câu hỏi để tự kiểm sau mỗi đề: “Mình đã đọc lại TRỌN đoạn nào không? Đoạn nào? Vì sao?” — ghi vào nhật ký ở mục 8.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Giao thức một lượt — năm bước cho mọi passage" },
      {
        t: "sodo", kind: "flow", title: "Một lượt, không đọc lại",
        caption: "Bước ③ là trái tim của giao thức: đáp án được ghi NGAY khi mắt đi qua, không để “tí nữa quay lại”.",
        steps: [
          { label: "① Đọc tiêu đề + câu hỏi nhóm 1", sub: "≤ 60 giây; gạch từ khoá không thể paraphrase (tên, số, năm)" },
          { label: "② Liếc nhóm câu không theo thứ tự", sub: "Headings / Matching info / Features: đọc danh sách MỘT lần, giữ trong đầu" },
          { label: "③ Đọc từng đoạn — trả lời khi đi qua", sub: "ghi lề 3–5 chữ; gặp chỗ khớp câu nào thì ghi đáp án ngay" },
          { label: "④ Câu chưa có đáp án sau đoạn của nó", sub: "90 giây ⇒ đoán có lý + cờ; đi tiếp" },
          { label: "⑤ Cuối passage", sub: "câu không theo thứ tự còn trống: dùng ghi lề, KHÔNG đọc lại bài" },
        ],
      },
      { t: "rule", formula: "đọc câu hỏi → đọc đoạn → trả lời khi đi qua → 90 giây thì đoán + cờ → đi tiếp", vi: "Lần đọc đầu phải là lần đọc dùng được: vừa hiểu, vừa ghi lề, vừa trả lời." },

      /* ── 3 ── */
      { t: "h", text: "3. Dạng theo thứ tự và không theo thứ tự — làm trong một lượt thế nào" },
      {
        t: "table",
        head: ["Nhóm dạng", "Đáp án nằm…", "Làm trong một lượt"],
        rows: [
          ["TFNG · YNNG · Sentence / Summary / Note / Table / Flow-chart completion · Short answer · MCQ chi tiết", "**theo thứ tự** bài", "đọc câu 1–2 trước; đọc tới đâu trả lời tới đó; câu 3 chưa thấy mà đã sang câu 4 ⇒ câu 3 nằm giữa hai chỗ đó"],
          ["Matching headings", "mỗi đoạn một heading", "đọc danh sách heading một lần; đọc HẾT đoạn rồi mới chọn (heading là ý cả đoạn, không phải câu đầu); loại heading đã dùng"],
          ["Matching information (đoạn nào chứa…)", "rải rác, có thể dồn vào một đoạn", "giữ 5–7 câu trong đầu, gạch DANH TỪ LOẠI (an example / a reason / a comparison…); đoạn nào có đúng loại ấy thì ghi ngay"],
          ["Matching features (ai nói gì)", "theo tên người / mốc", "khoanh mọi tên riêng khi đọc, ghi lề “W: …”, “N: …”; cuối passage nối câu với ghi lề"],
          ["Summary có hộp từ", "thường gọn trong 1–2 đoạn", "câu đầu summary cho biết đoạn nào; đoán từ loại cho mỗi chỗ trống TRƯỚC khi đọc đoạn ấy"],
          ["MCQ ý chính / mục đích của bài", "cả bài", "để CUỐI; trả lời từ ghi lề + đoạn kết, không đọc lại"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — câu Matching information là bẫy thời gian số một",
        items: [
          "Đừng làm Matching information theo kiểu “câu 1 → đọc cả bài tìm; câu 2 → đọc cả bài tìm”. Đó là 5 lần đọc lại.",
          "Gạch **danh từ loại** trong mỗi câu: a description of a method · an example of · a reason why · a reference to · a comparison between. Khi đọc, hỏi mỗi đoạn: “đoạn này có MỘT ví dụ không? có MỘT phương pháp không?”",
          "Một đoạn có thể khớp hai câu, và có đoạn không khớp câu nào. Đừng ép mỗi đoạn một đáp án.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Luật dừng 90 giây và thang đoán có lý" },
      { t: "p", text: "Ở band 8 bạn sẽ có 2–4 câu thật sự khó mỗi bài. Đọc lại đoạn văn lần thứ ba hiếm khi cứu được chúng — thường lý do bạn bí là câu hỏi, không phải đoạn văn. Bấm giờ trong đầu: 90 giây kể từ lúc bạn đã ở đúng đoạn mà chưa chốt được ⇒ đoán theo thang dưới, gắn cờ, đi tiếp." },
      {
        t: "table",
        head: ["Bậc", "Dạng", "Đoán thế nào"],
        rows: [
          ["1", "TFNG / YNNG", "phân vân giữa FALSE và NOT GIVEN ⇒ hỏi “bài có nói NGƯỢC không?”; không tìm được câu nói ngược ⇒ NOT GIVEN"],
          ["2", "MCQ", "loại phương án có từ tuyệt đối không có trong bài (always, only, entirely); loại phương án lặp nguyên văn một cụm (bẫy chữ trùng)"],
          ["3", "Completion", "chọn từ đúng TỪ LOẠI và đúng giới hạn số từ ở đoạn có các đáp án lân cận"],
          ["4", "Matching", "loại các lựa chọn đã dùng chắc chắn; chọn theo ghi lề"],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — cờ không phải giấy phép đọc lại",
        items: [
          "Bản thi máy tính có nút **flag / review** cho từng câu. Dùng nó cho câu đã ĐOÁN, không phải câu bỏ trống. Câu bỏ trống khi hết giờ là 0 điểm chắc chắn; câu đoán có lý có 30–50 % cơ hội.",
          "Ở 5 phút đệm: mở câu có cờ, đọc lại ĐÚNG câu chứa từ khoá (không đọc lại cả đoạn). Không đổi đáp án nếu không tìm được một lý do mới trong bài.",
          "Công cụ highlight trên máy chỉ để đánh dấu tên riêng và số. Tô cả câu dài là đang trì hoãn quyết định.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Kế hoạch 55 phút band 8 — và bản thi máy tính" },
      {
        t: "table",
        head: ["Phút", "Việc", "Mốc kiểm"],
        rows: [
          ["0 – 16", "Passage 1 (13 câu)", "phút 16 chưa xong ⇒ đoán phần còn lại, gắn cờ, sang Passage 2"],
          ["16 – 34", "Passage 2 (13 câu)", "phút 34"],
          ["34 – 53", "Passage 3 (14 câu)", "phút 53; câu ý chính / mục đích làm sau cùng"],
          ["53 – 58", "Đệm: mở câu có cờ", "chỉ đọc câu chứa từ khoá"],
          ["58 – 60", "Soát chính tả, số ít / số nhiều, giới hạn số từ", "đáp án không quá số từ cho phép"],
        ],
      },
      {
        t: "table", caption: "Bản giấy và bản máy — khác nhau ở chỗ ảnh hưởng chiến thuật",
        head: ["", "Bản giấy", "Bản máy"],
        rows: [
          ["Giờ chép đáp án", "không có thêm giờ cho Reading (khác Listening)", "không có — gõ thẳng"],
          ["Ghi lề", "bút chì lên đề", "highlight + ghi chú trên màn hình (dùng ít); giấy nháp"],
          ["Đánh dấu câu", "khoanh số câu", "nút review / flag; ô số câu ở thanh dưới đổi màu"],
          ["Đổi passage", "lật trang", "tab ở cuối màn hình — có thể nhảy, nhưng giao thức vẫn đi tuần tự"],
        ],
      },
      { t: "rule", formula: "16 – 18 – 19 + 5 phút cờ + 2 phút soát = 60", vi: "Con số chỉ là mốc kiểm; nếu Passage 1 dễ và xong ở phút 13, ba phút dư chuyển cho Passage 3." },
      {
        t: "mcq", id: "t5d21-doc-chien-thuat", title: "Kiểm nhanh chiến thuật (5 câu)",
        items: [
          { q: "1. Bạn đã ở đúng đoạn được 90 giây, vẫn phân vân FALSE / NOT GIVEN. Nên:", options: ["đọc lại cả đoạn một lần nữa cho chắc", "tìm câu nói NGƯỢC; không thấy ⇒ NOT GIVEN, gắn cờ, đi tiếp", "bỏ trống để cuối giờ quay lại"], correct: 1, why: "Luật 90 giây + thang đoán bậc 1. Bỏ trống là 0 điểm nếu không kịp quay lại." },
          { q: "2. Cách làm Matching information trong một lượt:", options: ["mỗi câu đọc lại cả bài một lần", "gạch danh từ loại ở 5 câu, giữ trong đầu khi đọc, gặp đoạn khớp thì ghi ngay", "làm sau cùng bằng cách đọc lại toàn bài"], correct: 1, why: "Mục 3. Cách A và C là đọc lại có hệ thống." },
          { q: "3. Mắt bạn lùi lại hai chữ vì câu vừa đọc có nghĩa khác dự đoán. Điều này:", options: ["là lỗi phải tập bỏ bằng mọi giá", "là sửa lỗi hiểu — bình thường và có ích", "chứng tỏ bạn nên đọc nhanh hơn"], correct: 1, why: "Mục 1: quay lui nhỏ khác đọc lại cả đoạn. Bài đọc ở mục 6 giải thích vì sao." },
          { q: "4. Câu “What is the writer's main purpose?” nên làm:", options: ["đầu tiên", "sau cùng, từ ghi lề và đoạn kết", "bằng cách đọc lại câu đầu mọi đoạn"], correct: 1, why: "Câu toàn bài làm cuối — lúc ấy bạn đã có bản đồ lập luận." },
          { q: "5. Ở phút 16 bạn còn 3 câu Passage 1 chưa làm. Nên:", options: ["làm nốt dù mất thêm 5 phút", "đoán có lý cả ba, gắn cờ, sang Passage 2", "bỏ trống, sang Passage 2"], correct: 1, why: "Mốc kiểm giữ cho Passage 3 (khó nhất) có đủ 19 phút. Câu đoán vẫn có cơ hội đúng." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Đề nhỏ — Passage 2 (18 phút), Questions 1–13" },
      { t: "p", text: "Đặt đồng hồ **38:00** cho cả hai passage. Làm theo giao thức mục 2: đọc câu 1–5 (Matching information) và câu 6–9 trước, rồi đọc đoạn A. Không đọc lại trọn đoạn nào. Các nghiên cứu về chuyển động mắt và về moral luck trong hai bài là có thật, kể gọn và làm tròn con số (khoảng chữ nhìn thấy, tỉ lệ quay lui khác nhau theo người đọc và loại văn bản)." },
      {
        t: "passage", title: "The Eye That Goes Back", intro: "What the eyes really do when we read — and what that means for reading fast",
        paras: [
          { label: "A", text: "Ask people to describe what their eyes do as they read a line of print, and most will say that the eyes glide steadily along it, like a finger tracing the words. They do nothing of the kind. In the late 1870s the French eye specialist Louis Émile Javal, watching readers closely, reported that their eyes advanced in a series of quick jumps separated by brief pauses. The jumps came to be known as saccades, from a French word for a sudden jerk, and the pauses as fixations. Almost all the useful information is taken in during the fixations, which typically last around a quarter of a second. During the jumps themselves, the brain largely suppresses what the eyes receive, which is why the world does not appear to blur each time we glance across a room." },
          { label: "B", text: "How much can a reader see in a single fixation? Less than it feels like. In the 1970s researchers found an ingenious way of measuring it. A computer tracked a reader's eyes and displayed normal text only within a small window around the point of fixation, replacing every letter outside it with an x. The window travelled with the eyes, so that wherever the reader looked, the words were there. When the window was large enough, readers noticed nothing odd and read at their usual speed. The critical size turned out to be modest: roughly fourteen or fifteen letters to the right of the fixation point and only three or four to the left. Shrink it further and reading slowed at once. The lopsided shape is not a fixed property of the eye. Among readers of languages written from right to left, the pattern is reversed, which suggests that the span is shaped by where the reader expects the next words to appear." },
          { label: "C", text: "The finding that has proved hardest to accept concerns the movements that go the wrong way. Something like one saccade in every seven to ten carries the eyes back to a word already read. For much of the twentieth century these regressions were treated as a symptom of poor reading, and the speed-reading courses that became fashionable from the late 1950s onwards made eliminating them a central goal: students were taught to sweep a finger or a card down the page so that the eyes could not slip back. Yet most regressions are short, a word or two, and they cluster at precisely the points where a sentence turns out to mean something other than the reader assumed. A reader who meets “The old man the boat” will almost always return to “man”, because only on the second look does it become clear that the word is a verb." },
          { label: "D", text: "An experiment published in 2014 put the matter to a direct test. Volunteers read sentences on a screen that followed their eyes, and in one condition each word was replaced by a row of xs as soon as the eyes had moved past it, so that a backward glance found nothing to read. For straightforward sentences the change made little difference. For sentences that required the reader to revise an early interpretation, comprehension fell sharply. The researchers concluded that backward movements are not a leak in an otherwise efficient process; they are part of the way understanding is repaired as it is built." },
          { label: "E", text: "This has awkward implications for speed-reading technology. Apps that flash words one at a time at a single point on the screen promise to free the reader from wasteful eye movements, and in one sense they do: there is nowhere for the eyes to go. By the same token, however, there is no possibility of looking back. Studies of such displays have found that comprehension holds up reasonably well at ordinary rates and declines as the rate is pushed higher. A large review published in 2016 by a team of reading researchers concluded that there is a genuine trade-off between speed and accuracy which no training has been shown to remove. The most reliable way to read faster without understanding less, the authors suggested, is the unglamorous one: to know more words and more about the subject, so that each fixation takes in more." },
          { label: "F", text: "None of this means that rapid reading is useless. Skimming — moving quickly through a text to find out what it is about, or to locate a particular piece of information — is a valuable skill, and skilled readers switch into it constantly. It is, however, a different activity from reading for understanding, with a different goal. The trouble begins when the speed of the first is expected to deliver the results of the second." },
          { label: "G", text: "For anyone reading under time pressure, then, the lesson is not that the eyes should be forbidden to look back. Small regressions, of the kind that repair a misread phrase, are cheap and useful, and suppressing them would cost more in misunderstanding than it saved in time. The regressions that are expensive are of a different order: abandoning a question in order to read whole paragraphs again from the top, often more than once. Those are not repairs. They are a sign that the first reading was not being used." },
        ],
      },
      { t: "p", text: "**Questions 1–5** — The passage has seven paragraphs, **A–G**. Which paragraph contains the following information? You may use any letter more than once." },
      {
        t: "quiz", id: "t5d21-doc-match-info", kind: "fill", title: "Questions 1–5 — Matching information (gõ chữ cái A–G)",
        items: [
          { q: "1. the origin of the name given to a type of eye movement", answers: ["A"], hint: "Đoạn A: “saccades, from a French word for a sudden jerk”. Danh từ loại: the origin of the name ⇒ tìm chỗ giải thích một TÊN gọi." },
          { q: "2. a description of a method that limited how much text was visible at any one moment", answers: ["B"], hint: "Đoạn B: “displayed normal text only within a small window… replacing every letter outside it with an x”. Bẫy D: thí nghiệm 2014 cũng che chữ, nhưng che chữ ĐÃ đọc, không giới hạn vùng nhìn thấy." },
          { q: "3. an example of a sentence that readers are likely to misunderstand at first", answers: ["C"], hint: "Đoạn C: “The old man the boat” — man là động từ (= điều khiển, vận hành). Danh từ loại: an example of a sentence." },
          { q: "4. a claim about the most dependable way to increase reading speed without loss of understanding", answers: ["E"], hint: "Đoạn E: “The most reliable way to read faster without understanding less… to know more words and more about the subject”. dependable = reliable; without loss of understanding = without understanding less." },
          { q: "5. a distinction between two purposes for moving quickly through a text", answers: ["F"], hint: "Đoạn F: skimming (tìm bài nói gì / tìm chỗ có thông tin) ≠ reading for understanding, “with a different goal”. Bẫy G: G phân biệt hai kiểu QUAY LẠI, không phải hai mục đích đọc nhanh." },
        ],
      },
      { t: "p", text: "**Questions 6–9** — Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer." },
      {
        t: "quiz", id: "t5d21-doc-cau", kind: "fill", title: "Questions 6–9 — Sentence completion (NO MORE THAN TWO WORDS)",
        items: [
          { q: "6. Readers take in most of what they read during the short pauses known as ___.", answers: ["fixations"], hint: "Đoạn A: “the pauses as fixations. Almost all the useful information is taken in during the fixations”. Viết số nhiều." },
          { q: "7. The asymmetry of the visible window seems to depend on where readers expect the ___ to appear.", answers: ["next words"], hint: "Đoạn B, câu cuối: “where the reader expects the next words to appear”. asymmetry = lopsided shape (paraphrase mức 2)." },
          { q: "8. Speed-reading students were taught to move a finger or a ___ down the page to stop their eyes slipping back.", answers: ["card", "a card"], hint: "Đoạn C: “sweep a finger or a card down the page”. a card là 2 từ — vẫn trong giới hạn; card là đủ." },
          { q: "9. In the 2014 study, preventing backward glances mainly harmed comprehension when readers had to revise an early ___.", answers: ["interpretation"], hint: "Đoạn D: “sentences that required the reader to revise an early interpretation, comprehension fell sharply”. preventing backward glances = a backward glance found nothing to read." },
        ],
      },
      { t: "p", text: "**Questions 10–13** — Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq", id: "t5d21-doc-mcq", title: "Questions 10–13 — Multiple choice",
        items: [
          { q: "10. According to paragraph A, the world does not seem to blur when we move our eyes because", options: ["A the eyes move too quickly for the blur to register.", "B the brain largely ignores what the eyes receive during a jump.", "C each fixation lasts about a quarter of a second.", "D the jumps between fixations are very short."], correct: 1, why: "“During the jumps themselves, the brain largely suppresses what the eyes receive, which is why the world does not appear to blur”. largely ignores = largely suppresses. C đúng sự thật trong bài nhưng không phải LÝ DO." },
          { q: "11. What does the writer suggest about the shape of the visible window in paragraph B?", options: ["A It is determined by the structure of the eye.", "B It is the same for readers of every language.", "C It reflects the direction in which a language is written.", "D It becomes smaller as readers grow more skilled."], correct: 2, why: "“The lopsided shape is not a fixed property of the eye… the pattern is reversed” ở người đọc chữ viết phải → trái. A bị bác thẳng; D không có trong bài." },
          { q: "12. What is the writer's view of apps that display one word at a time?", options: ["A They deliver what they promise at every speed.", "B They remove one inefficiency at the cost of a useful process.", "C They are mainly suitable for skimming.", "D They have not yet been properly studied."], correct: 1, why: "Đoạn E: chúng loại bỏ cử động mắt “wasteful”, nhưng “By the same token… no possibility of looking back” — mà Đoạn D cho thấy quay lui là cách sửa hiểu. Ý ẩn mức 4, nối hai đoạn. D sai: “Studies of such displays have found…”." },
          { q: "13. What is the main point of paragraph G?", options: ["A Readers under time pressure should never look back.", "B Brief regressions are worth keeping, but rereading whole paragraphs is costly.", "C Speed-reading is a waste of time for test-takers.", "D Skimming should replace careful reading in timed tests."], correct: 1, why: "“Small regressions… are cheap and useful… The regressions that are expensive are… read whole paragraphs again from the top”. A ngược nghĩa câu đầu đoạn. Đây cũng là lý lẽ của cả Bài 2 hôm nay." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Đề nhỏ — Passage 3 (20 phút), Questions 14–27" },
      { t: "p", text: "Đồng hồ đang chạy tiếp. Passage 3 là bài triết học: nhiều tên người, nhiều lập trường. Trước khi đọc, nhìn danh sách câu 19–23 (Matching features) và khoanh năm lựa chọn A–E; khi đọc, ghi lề “W:”, “N:”, “K:”… cạnh mỗi lập trường. Tên và năm xuất bản là có thật; các ví dụ được thuật lại bằng lời của bài, không trích nguyên văn — đừng dùng làm tài liệu tra cứu." },
      {
        t: "passage", title: "Judged by the Outcome", intro: "Should we be blamed for what we cannot control? A philosophical puzzle and its practical consequences",
        paras: [
          { label: "A", text: "Two drivers leave the same party at the same hour, and each, on the same stretch of road, glances down at a phone for two seconds. One arrives home without incident. The other looks up to find that a child has run into the road, and cannot stop in time. Almost everyone judges the second driver more harshly than the first, and so does the law: the penalties she faces are of a different order. Yet if we are asked to say what the second driver did that the first did not, the honest answer is nothing. The difference between them lies entirely in circumstances that neither of them controlled." },
          { label: "B", text: "Philosophers call this phenomenon moral luck, a term that entered the discussion through two papers, both entitled “Moral Luck”, published by Bernard Williams and Thomas Nagel in 1976. The puzzle they identified is easily stated. Most people, asked in the abstract, will agree that a person should be praised or blamed only for what is within his or her control. Call this the control principle. Yet in practice we abandon it constantly — not only when outcomes differ, as with the two drivers, but in a great many quieter ways. Williams and Nagel did not agree about what followed from this, but both took the conflict seriously rather than dismissing one side of it as a simple mistake." },
          { label: "C", text: "Williams approached the problem through an imagined painter, loosely modelled on Gauguin, who leaves his family to pursue his art on a distant island. Is he justified? Williams's unsettling suggestion was that the answer may depend on whether he succeeds — on whether he becomes the painter he hoped to be — and that this is something he cannot know when he makes the choice. Not every failure would count against him equally: if he were injured on the voyage and never painted again, that would reveal nothing about his decision, whereas failing because his talent was not equal to the task would. Williams also described a lorry driver who, through no fault of his own, runs over a child. Such a driver, he argued, will feel something that a bystander does not, and should not, feel — a regret that attaches to him as the person who did it. Williams called this agent-regret, and thought that someone who felt none of it would be lacking something, not demonstrating clear thinking." },
          { label: "D", text: "Nagel's contribution was to show how far the problem extends. Beyond luck in how things turn out, he distinguished luck in the circumstances one faces — an ordinary citizen of a country that falls under a brutal government is set moral tests that people in more fortunate places never encounter, and may fail them — and luck in one's constitution: the temperament, sensitivities and inclinations that one did not choose but for which one is nonetheless often judged. There is, finally, luck in the way one's actions are shaped by everything that preceded them. Nagel's conclusion was not comforting. If the control principle were applied consistently, he suggested, very little would remain for which anyone could be held responsible at all." },
          { label: "E", text: "One response is to hold the line. Kant had argued that a good will has its full value regardless of what it achieves, and that its worth does not depend on whether circumstances allow it to succeed. Several philosophers since 1976 have defended a version of this position: what an agent deserves blame for is what she chose and intended, and the outcome is relevant only as evidence of those things. On this view the two drivers are equally blameworthy, and the difference in how they are treated is a failure of reasoning. The difficulty with this response is the one Williams anticipated. It asks the second driver to believe that she has no more to answer for than the first, and a moral outlook that required her to believe this would not obviously be more rational. It might simply be less human." },
          { label: "F", text: "Psychologists have since examined how ordinary people actually make such judgements, and the picture is more interesting than a simple bias. In experiments, people's evaluations of a decision shift with its outcome even when they are told that the outcome was a matter of chance, an effect known as outcome bias. But studies in the 2000s suggested that the influence is uneven. When participants were asked whether an action was wrong, their answers depended mainly on what the agent had intended and believed. When they were asked how much the agent should be punished, the outcome counted for considerably more. If this is right, our intuitions are not simply confused; they may be answering two different questions." },
          { label: "G", text: "That distinction offers a way of looking again at a practice often cited as irrational: the law's habit of punishing an attempted crime less severely than the same crime carried out. If punishment existed only to respond to the wrongdoer's character, the habit would be hard to defend. But punishment also serves to acknowledge the harm that victims have actually suffered, and an attempt that harms no one leaves nothing of that kind to acknowledge. Where the real danger lies is in letting outcomes settle questions they cannot answer. Organisations routinely judge employees' ability by results: the manager whose risky project happened to succeed is promoted, while the one whose careful plan was undone by events is not. Moral luck cannot be abolished. It can, however, be noticed, and noticing it is the beginning of judging a little more fairly." },
        ],
      },
      { t: "p", text: "**Questions 14–18** — Do the following statements agree with the claims of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq", id: "t5d21-doc-ynng", title: "Questions 14–18 — YES / NO / NOT GIVEN",
        items: [
          { q: "14. There is no morally relevant difference between the actions of the two drivers.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn A: “what the second driver did that the first did not, the honest answer is nothing” ⇒ YES. Paraphrase mức 3: did… did not → no difference between the actions." },
          { q: "15. Williams and Nagel reached the same conclusion about the problem of moral luck.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: “Williams and Nagel did not agree about what followed from this” ⇒ NO. Bẫy: “both took the conflict seriously” — cùng coi trọng VẤN ĐỀ ≠ cùng KẾT LUẬN." },
          { q: "16. Nagel's work on moral luck has had more influence than that of Williams.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài nói Nagel “show how far the problem extends”, nhưng không so mức ảnh hưởng ⇒ NOT GIVEN. Bẫy so sánh không có trong bài." },
          { q: "17. The position defended by Kant's later followers has a significant weakness.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn E: “The difficulty with this response is the one Williams anticipated… It might simply be less human.” Người viết nêu và đồng tình với điểm yếu ⇒ YES. Phê bình bằng giọng nhẹ (might simply) vẫn là phê bình." },
          { q: "18. The research described in paragraph F shows that people's moral intuitions are confused.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F: “our intuitions are not simply confused; they may be answering two different questions” ⇒ NO. Khuôn not X; Y — gạch Y, viết “bẫy” cạnh X (Ngày 17)." },
        ],
      },
      { t: "p", text: "**Questions 19–23** — Look at the following statements and the list of people below. Match each statement with the correct person or group, **A–E**. You may use any letter more than once." },
      {
        t: "table", caption: "List of people",
        head: ["Chữ cái", "Người / nhóm"],
        rows: [
          ["A", "Bernard Williams"],
          ["B", "Thomas Nagel"],
          ["C", "Kant"],
          ["D", "philosophers who defended Kant's line after 1976"],
          ["E", "psychologists who studied ordinary judgements"],
        ],
      },
      {
        t: "quiz", id: "t5d21-doc-features", kind: "fill", title: "Questions 19–23 — Matching features (gõ chữ cái A–E)",
        items: [
          { q: "19. drew attention to moral tests that some people face only because of where they happen to live", answers: ["B"], hint: "Đoạn D: “an ordinary citizen of a country that falls under a brutal government is set moral tests that people in more fortunate places never encounter” — luck in circumstances." },
          { q: "20. suggested that whether a choice was justified might depend on something unknown when it was made", answers: ["A"], hint: "Đoạn C: hoạ sĩ — “the answer may depend on whether he succeeds… something he cannot know when he makes the choice”." },
          { q: "21. held that the worth of good intentions is unaffected by what they bring about", answers: ["C"], hint: "Đoạn E: “a good will has its full value regardless of what it achieves”. unaffected by what they bring about = regardless of what it achieves." },
          { q: "22. found that judgements about punishment are more sensitive to outcomes than judgements about wrongness", answers: ["E"], hint: "Đoạn F: hỏi wrong ⇒ dựa vào ý định; hỏi punished ⇒ “the outcome counted for considerably more”." },
          { q: "23. regarded the result of an action as relevant only as evidence of what the agent chose", answers: ["D"], hint: "Đoạn E: “the outcome is relevant only as evidence of those things” — lập trường của “several philosophers since 1976”, KHÔNG phải của Kant (bẫy C: tên Kant đứng ngay trước)." },
        ],
      },
      { t: "p", text: "**Questions 24–27** — Complete the summary using the list of words, **A–I**, below. Mỗi từ dùng nhiều nhất một lần; có năm từ thừa." },
      {
        t: "note", title: "Outcomes, punishment and fairness",
        items: [
          "The writer argues that the legal practice of punishing attempted crimes less **24** ___ than completed ones is easier to defend than it first appears. Punishment does not respond only to the wrongdoer's **25** ___; it also recognises the harm that victims have suffered. The real danger, in the writer's view, lies in allowing outcomes to decide questions that they cannot **26** ___, as when organisations promote managers whose risky projects happened to succeed. Although moral luck cannot be **27** ___, awareness of it can make our judgements fairer.",
        ],
      },
      {
        t: "table", caption: "List of words",
        head: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        rows: [["intentions", "eliminated", "severely", "rewarded", "answer", "frequently", "character", "ignore", "measured"]],
      },
      {
        t: "quiz", id: "t5d21-doc-hop-tu", kind: "fill", title: "Questions 24–27 — gõ chữ cái A–I",
        items: [
          { q: "24.", answers: ["C"], hint: "Đoạn G: “punishing an attempted crime less severely than the same crime carried out”. Bẫy F frequently: đúng từ loại (trạng từ) nhưng bài nói về MỨC phạt, không phải tần suất." },
          { q: "25.", answers: ["G"], hint: "“If punishment existed only to respond to the wrongdoer's character”. Bẫy A intentions: hợp nghĩa với Đoạn E, nhưng câu summary bám Đoạn G." },
          { q: "26.", answers: ["E"], hint: "“letting outcomes settle questions they cannot answer”. settle → decide; answer giữ nguyên. Bẫy I measured: hợp ngữ pháp, sai ý." },
          { q: "27.", answers: ["B"], hint: "“Moral luck cannot be abolished” ⇒ eliminated (đồng nghĩa mức 2). Bẫy H ignore: bài nói ngược lại — “It can, however, be noticed”." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Chấm điểm, bảng paraphrase — và nhật ký “quay lại”" },
      {
        t: "table",
        head: ["Điểm / 27", "Quy ra cả bài", "Việc tiếp theo"],
        rows: [
          ["25–27", "≈ 37–40 / 40 (band 8.5–9)", "giữ giao thức; Ngày 27 làm đủ 3 passage, mục tiêu 35+"],
          ["23–24", "≈ 34–36 / 40 (band 7.5–8)", "xem câu sai có phải câu bạn đã ĐỌC LẠI không — thường là có"],
          ["20–22", "≈ 30–33 / 40 (band 7–7.5)", "câu sai dồn ở Matching? ôn mục 3; dồn ở YNNG? ôn Tập 5 Ngày 9"],
          ["≤ 19", "dưới 30", "làm lại đề nhỏ sau 3 ngày, KHÔNG bấm giờ, chỉ tập giao thức; rồi mới bấm giờ"],
        ],
      },
      {
        t: "table", caption: "Bảy cặp paraphrase đáng chép vào sổ",
        head: ["Bài viết", "Câu hỏi", "Phép đổi"],
        rows: [
          ["The most reliable way to read faster without understanding less", "the most dependable way… without loss of understanding (Q4)", "đồng nghĩa + đổi từ loại (understanding less → loss of understanding)"],
          ["The lopsided shape is not a fixed property of the eye", "determined by the structure of the eye (Q11 — sai)", "phủ định bị bỏ: bẫy ngược nghĩa"],
          ["the brain largely suppresses what the eyes receive", "the brain largely ignores… (Q10)", "đồng nghĩa mức 2"],
          ["did not agree about what followed from this", "reached the same conclusion (Q15 — NO)", "phủ định + danh từ hoá"],
          ["regardless of what it achieves", "unaffected by what they bring about (Q21)", "đồng nghĩa cả cụm"],
          ["the outcome counted for considerably more", "more sensitive to outcomes (Q22)", "đổi chủ ngữ (outcome → judgements)"],
          ["Moral luck cannot be abolished. It can, however, be noticed", "cannot be eliminated (Q27) · bẫy: ignore", "đồng nghĩa + bẫy ngược ở câu kế"],
        ],
      },
      {
        t: "note", title: "💡 Nhật ký “quay lại” — ghi ngay sau khi chấm",
        items: [
          "Ba cột: **Đoạn đã đọc lại trọn** · **Vì sao** (không ghi lề / câu hỏi không theo thứ tự / không hiểu một từ) · **Câu đó đúng hay sai**.",
          "Sau ba đề, xem cột “Vì sao”: lý do nào lặp lại thì đó là chỗ giao thức của bạn còn thủng. Hầu hết người học thấy câu trả lời là Matching information hoặc Matching features.",
          "Đếm số lần đọc lại trọn đoạn: mục tiêu band 8 là **0–1 lần cả bài 60 phút**.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Từ vựng hữu ích từ hai bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "regression", pos: "n", ipa: "/rɪˈɡreʃn/", vi: "(khi đọc) cú nhảy lùi của mắt; (chung) sự thụt lùi", ex: "Most regressions are short and happen when a sentence surprises the reader.", exVi: "Phần lớn các cú quay lui đều ngắn và xảy ra khi một câu làm người đọc bất ngờ.", more: "regress (v) · a regression to old habits · trong thống kê: regression to the mean (hồi quy về trung bình — Ngày 22)" },
          { w: "lopsided", pos: "adj", ipa: "/ˌlɒpˈsaɪdɪd/", vi: "lệch hẳn về một phía, không cân", ex: "The debate was lopsided: one side had all the data.", exVi: "Cuộc tranh luận lệch hẳn: một bên nắm hết số liệu.", more: "a lopsided result / contest / smile · gần nghĩa trang trọng hơn: asymmetrical, uneven" },
          { w: "cluster", pos: "v", ipa: "/ˈklʌstə/", vi: "tụ lại, dồn vào một chỗ", ex: "Complaints tend to cluster around the first week of term.", exVi: "Lời phàn nàn thường dồn vào tuần đầu học kỳ.", more: "cluster around / at / in · danh từ: a cluster of cases (một cụm ca bệnh)" },
          { w: "put sth to the test", pos: "phr", ipa: "/pʊt tə ðə test/", vi: "đem ra thử thật", ex: "The new rules were put to the test during the first heatwave.", exVi: "Quy định mới được đem ra thử thật trong đợt nắng nóng đầu tiên.", more: "put a claim / theory to the test · gần nghĩa: test sth out" },
          { w: "hold up", pos: "phr v", ipa: "/həʊld ˈʌp/", vi: "vẫn đứng vững, vẫn đúng (khi bị kiểm tra)", ex: "Her argument holds up well even under close examination.", exVi: "Lập luận của cô ấy vẫn đứng vững kể cả khi bị soi kỹ.", more: "the evidence / theory holds up · cẩn thận: hold up còn nghĩa “làm chậm” (We were held up by traffic)" },
          { w: "of a different order", pos: "phr", ipa: "/əv ə ˈdɪfrənt ˈɔːdə/", vi: "ở một tầm / mức khác hẳn", ex: "The cost of a new line is of a different order from repairing the old one.", exVi: "Chi phí làm tuyến mới ở mức khác hẳn so với sửa tuyến cũ.", more: "of the order of + số = khoảng (of the order of 10 %) · on a different scale" },
          { w: "in the abstract", pos: "phr", ipa: "/ɪn ði ˈæbstrækt/", vi: "nói chung chung, trên lý thuyết (không gắn trường hợp cụ thể)", ex: "In the abstract, everyone supports new housing; next door, fewer people do.", exVi: "Nói chung chung thì ai cũng ủng hộ nhà mới; xây ngay cạnh nhà mình thì ít người hơn.", more: "trái: in practice / in concrete terms · Part 3 rất hợp: It's easy to agree in the abstract, but…" },
          { w: "unsettling", pos: "adj", ipa: "/ʌnˈsetlɪŋ/", vi: "gây bất an, làm lung lay điều mình tin", ex: "It's an unsettling thought that so much depends on chance.", exVi: "Thật bất an khi nghĩ rằng bao nhiêu thứ phụ thuộc vào may rủi.", more: "an unsettling idea / experience · unsettle (v) · gần: disconcerting, disturbing" },
          { w: "bystander", pos: "n", ipa: "/ˈbaɪstændə/", vi: "người đứng ngoài chứng kiến, không liên quan", ex: "An innocent bystander was hurt in the accident.", exVi: "Một người qua đường vô can bị thương trong vụ tai nạn.", more: "an innocent bystander · the bystander effect (hiệu ứng người ngoài cuộc)" },
          { w: "inclination", pos: "n", ipa: "/ˌɪŋklɪˈneɪʃn/", vi: "thiên hướng, xu hướng tự nhiên muốn làm gì", ex: "I had neither the time nor the inclination to argue.", exVi: "Tôi không có thời gian cũng chẳng có ý muốn tranh cãi.", more: "an inclination to do sth / towards sth · be inclined to (Ngày 6 hedging: I'm inclined to think…)" },
          { w: "blameworthy", pos: "adj", ipa: "/ˈbleɪmwɜːði/", vi: "đáng bị trách", ex: "Is a careless driver who is lucky any less blameworthy?", exVi: "Người lái xe bất cẩn mà gặp may có bớt đáng trách hơn không?", more: "trái: praiseworthy · blame sb for sth · be to blame for" },
          { w: "hold the line", pos: "idiom", ipa: "/həʊld ðə laɪn/", vi: "giữ vững lập trường, không nhượng bộ", ex: "The school held the line on phones despite pressure from parents.", exVi: "Nhà trường giữ vững quy định về điện thoại bất chấp sức ép phụ huynh.", more: "hold the line on prices / spending · gần: stand firm" },
          { w: "routinely", pos: "adv", ipa: "/ruːˈtiːnli/", vi: "thường xuyên như một thói quen, như lệ", ex: "Patients are routinely asked the same questions three times.", exVi: "Bệnh nhân thường xuyên bị hỏi cùng một câu ba lần.", more: "routine (adj): a routine check · Task 2: X is routinely overlooked" },
          { w: "be undone by", pos: "phr", ipa: "/bi ʌnˈdʌn baɪ/", vi: "bị phá hỏng, đổ bể vì", ex: "Years of careful planning were undone by a single storm.", exVi: "Bao năm lên kế hoạch cẩn thận bị một cơn bão phá hỏng.", more: "undo (v): undo the damage · come undone (bung ra, đổ vỡ)" },
        ],
      },
    ],
  },

  /* ════════════════ BÀI 3 — NGHE ════════════════ */
  {
    id: "t5d21-nghe",
    kind: "listening",
    title: "Nghe: Podcast và tin tức tốc độ thật, giọng vùng — bản tin (Ireland · Úc · Mỹ) + podcast “Slips of the Ear” (New Zealand · Anh · Canada)",
    goal: "Nghe hiểu một bản tin và một podcast ba người ở tốc độ thật (~175–180 từ/phút), sáu giọng khác nhau, bắt đúng con số đã được ĐÍNH CHÍNH, phân biệt ý kiến của từng người khi họ ngắt lời và tự sửa, đạt ≥ 14/16 câu; và dựng được thói quen nghe podcast thật 20 phút mỗi ngày.",
    minutes: 85,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Tiếng Anh thật ngoài phòng thi (E08): **tin tức** dày danh từ và con số, đọc nhanh, không lặp lại; **podcast** nhiều người nói chồng, tự sửa, đùa, nói lạc đề rồi quay lại. IELTS Part 3 và Part 4 ở band 8 bắt chước đúng hai kiểu nói này.",
          "Sáu giọng trong một bài: Ireland, Úc, Mỹ (bản tin) · New Zealand, Anh, Canada (podcast). Giọng Scotland không có giọng máy nào, nên khoá không giả — học nhận diện qua bảng ở mục 2.",
          "Hai bẫy band 8 xuất hiện nhiều nhất ở tốc độ thật: **con số bị đính chính** (not the four hundred reported…) và **ý kiến bị người sau sửa** (Well, I'd put it differently…).",
          "🔊 Dạng yếu + nối âm ở tốc độ đọc tin: are, to, of, the, and co lại; phụ âm cuối nối sang nguyên âm đầu.",
          "Cuối bài: kế hoạch 4 tuần nghe podcast thật — chọn gì, nghe mấy lần, chép gì vào sổ.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Tin tức và podcast — hai kiểu nói khác nhau" },
      {
        t: "table",
        head: ["Đặc điểm", "Tin tức (news)", "Podcast / thảo luận", "Nghe thế nào"],
        rows: [
          ["**Thứ tự ý**", "kim tự tháp ngược: điều quan trọng nhất ở câu đầu, chi tiết sau", "đi vòng: kể chuyện → lạc đề → quay lại", "tin: bắt câu đầu mỗi mục; podcast: chờ câu “So anyway…”, “Coming back to…”"],
          ["**Câu**", "dài, nhiều cụm danh từ (a month-long review of rural transport)", "ngắn, cắt giữa chừng, bắt đầu lại", "tin: nghe danh từ chính của cụm; podcast: bỏ qua câu bị bỏ dở"],
          ["**Con số**", "dày, có đính chính (not the… reported earlier)", "ước lượng (about, nearer a third), tự sửa", "chờ hết câu mới ghi số"],
          ["**Nguồn**", "officials say · it's thought that · according to", "I reckon · to be fair · as far as I know", "phân biệt sự thật với ý kiến"],
          ["**Tín hiệu chuyển**", "In other news · And finally · Now to…", "Which brings me to · Hang on · Can I just jump in?", "tín hiệu = mục mới / người mới / ý mới"],
          ["**Chen ngang**", "không có", "nhiều: Sorry — go on · No, you're right", "ý kiến cuối cùng mới là ý kiến của người đó"],
        ],
      },
      {
        t: "mcq", id: "t5d21-nghe-dac-diem", title: "Nhận đặc điểm — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. “The fragment weighs about three hundred and forty grams — not the four hundred reported last week.” Bạn ghi:", options: ["400", "340", "740"], correct: 1, why: "Đính chính ⇒ con số sau “not the… reported” là con số SAI. Chờ hết câu mới ghi." },
          { q: "2. Trong podcast, A nói “It's just lazy listening”, B chen: “Is it, though?”, A đáp: “Well, okay, maybe not lazy — distracted.” Ý kiến cuối của A là:", options: ["nghe nhầm do lười", "nghe nhầm do mất tập trung", "nghe nhầm là tốt"], correct: 1, why: "Người nói tự sửa sau khi bị phản bác — câu cuối là lập trường thật." },
          { q: "3. Câu đầu của một mục tin thường cho bạn:", options: ["chi tiết phụ", "ý quan trọng nhất của cả mục", "lời bình của phóng viên"], correct: 1, why: "Kim tự tháp ngược — câu đầu là “tin”, phần sau là chi tiết." },
          { q: "4. “So anyway, coming back to what you asked…” báo hiệu:", options: ["người nói sắp lạc đề", "người nói quay về câu hỏi chính", "chương trình sắp kết thúc"], correct: 1, why: "Tín hiệu quay lại — câu trả lời thật thường đến ngay sau." },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Giọng vùng — nhận diện nhanh, không cần bắt chước" },
      { t: "p", text: "Mục tiêu không phải đoán người nói từ đâu, mà là **không để giọng làm mất một chữ**. Mỗi giọng có hai ba chỗ làm người Việt nghe trượt. Ôn từ Tập 2 Ngày 7 (Mỹ), Tập 3 Ngày 12 · 24 (Canada, New Zealand), Tập 4 Ngày 21 (Ireland)." },
      {
        t: "table",
        head: ["Giọng", "Chỗ hay nghe trượt", "Ví dụ", "Mẹo"],
        rows: [
          ["**Ireland**", "th đọc gần như t / d; r rõ ở cuối từ; film, worm nghe như hai âm tiết", "three ≈ tree · this ≈ dis · farm có r", "tin vào ngữ cảnh: “tree hundred grams” chỉ có thể là three"],
          ["**Úc**", "day ≈ “dye”, mate ≈ “mite”; giọng lên ở cuối câu kể", "eight ≈ “ite” · paddock", "lên giọng cuối câu KHÔNG phải câu hỏi"],
          ["**Mỹ**", "t giữa hai nguyên âm thành d nhẹ (flap); r rõ", "a lot of ≈ “a lodda” · thirty ≈ “thirdy”", "cẩn thận thirty / thirteen: nghe trọng âm"],
          ["**New Zealand**", "i ngắn rút về gần “ơ”; e ngắn nghe như i", "fish and chips ≈ “fush and chups” · ten ≈ “tin”", "six ≈ “sux”: dựa vào số đi kèm"],
          ["**Anh (miền Nam)**", "r cuối không đọc; t cuối hoặc giữa thành âm tắc họng", "car ≈ “cah” · football ≈ “foo'ball”", "water, better: t gần như biến mất"],
          ["**Canada**", "ou trong about, out hơi nâng; r rõ như Mỹ", "about ≈ “a-boat” (nghe nhẹ) · sorry ≈ “sore-y”", "gần Mỹ; khác ở vài nguyên âm"],
        ],
      },
      {
        t: "note", title: "📌 Ghi nhớ — Scotland và các giọng không có trong bài",
        items: [
          "Giọng Scotland (r rung đầu lưỡi, ou trong house thành “hoose”, loch có âm kh) có thể xuất hiện trong đề thật nhưng không có giọng máy để khoá dùng. Cách luyện: tìm podcast hoặc bản tin vùng Scotland (mục 7), nghe 5 phút mỗi tuần.",
          "Đề IELTS dùng giọng “dễ hiểu với người học quốc tế” — giọng vùng nhẹ, không phải phương ngữ đặc. Nếu nghe được bài hôm nay ở tốc độ 1.0, bạn đủ sức với mọi giọng trong đề.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. 🔊 Dạng yếu và nối âm ở tốc độ đọc tin" },
      { t: "p", text: "Phát thanh viên đọc khoảng 170–180 từ/phút mà vẫn rõ, vì họ chỉ nhấn **từ mang tin** (danh từ, số, động từ chính) và đọc lướt mọi từ chức năng. Bạn nghe ra được khi tự đọc được. Ký hiệu trong phần dịch: CHỮ HOA = nhấn; ‿ = nối âm." },
      {
        t: "phatam", id: "t5d21-phat-am", title: "Luyện phát âm — đọc tin: nhấn từ mang tin, lướt từ chức năng, nối phụ âm với nguyên âm",
        note: "Đọc theo nhịp: chỉ nhấn chữ HOA, mọi từ còn lại đọc nhanh và nhẹ (are /ə/, to /tə/, of /əv/, and /ən/). Nối âm ở chỗ ‿. Thu âm, nghe lại: nếu câu 1 dài hơn 4 giây là bạn đang nhấn đều mọi chữ.",
        items: [
          { text: "Police are asking anyone who saw the accident to come forward.", ipa: "pəliːs ər ɑːskɪŋ eniwʌn huː sɔː ði æksɪdənt tə kʌm fɔːwəd", vi: "Cảnh sát đề nghị bất kỳ ai chứng kiến vụ tai nạn ra trình báo. (poLICE · ASKing · SAW · ACcident · come FORward; police‿are · saw‿the)" },
          { text: "The fragment was found on a farm outside the village.", ipa: "ðə fræɡmənt wəz faʊnd ɒn ə fɑːm aʊtsaɪd ðə vɪlɪdʒ", vi: "Mảnh đá được tìm thấy ở một trang trại ngoài làng. (FRAGment · FOUND · FARM · VILLage; found‿on‿a)" },
          { text: "Talks are expected to resume at the end of the month.", ipa: "tɔːks ər ɪkspektɪd tə rɪzjuːm ət ði end əv ðə mʌnθ", vi: "Các cuộc đàm phán dự kiến nối lại vào cuối tháng. (TALKS · exPECTed · reSUME · END · MONTH; end‿of)" },
          { text: "Officials say the road will reopen on Thursday.", ipa: "əfɪʃlz seɪ ðə rəʊd wɪl riːəʊpən ɒn θɜːzdeɪ", vi: "Giới chức nói con đường sẽ thông lại vào thứ Năm. (ofFICials · ROAD · reOPen · THURSday; reopen‿on)" },
          { text: "Temperatures could reach thirty degrees by the weekend.", ipa: "temprətʃəz kəd riːtʃ θɜːti dɪɡriːz baɪ ðə wiːkend", vi: "Nhiệt độ có thể lên tới ba mươi độ vào cuối tuần. (TEMperatures · REACH · THIRty · deGREES · WEEKend — thirty nhấn âm ĐẦU, khác thirTEEN)" },
          { text: "It's the first time in forty years that the cinema has closed.", ipa: "ɪts ðə fɜːst taɪm ɪn fɔːti jɪəz ðət ðə sɪnəmə həz kləʊzd", vi: "Đây là lần đầu tiên trong bốn mươi năm rạp chiếu phim đóng cửa. (FIRST TIME · FORty YEARS · CINema · CLOSED; time‿in)" },
          { text: "We'll be back with more after the break.", ipa: "wil bi bæk wɪð mɔːr ɑːftə ðə breɪk", vi: "Chúng tôi sẽ trở lại với nhiều tin hơn sau giờ nghỉ. (BACK · MORE · BREAK; more‿after — r nối)" },
        ],
      },
      {
        t: "mcq", id: "t5d21-nghe-dang-yeu", title: "Dạng yếu — chọn phương án đúng (3 câu)",
        items: [
          { q: "1. Trong “Talks are expected to resume”, từ are thường nghe như:", options: ["/ɑː/ rõ ràng", "/ə/, gần như dính vào Talks", "không có âm nào"], correct: 1, why: "Trợ động từ không nhấn ⇒ dạng yếu /ə/. Người nghe chỉ chờ TALKS và exPECTed." },
          { q: "2. “a lot of people” ở tốc độ thật (giọng Mỹ) nghe gần như:", options: ["a-lot-of-people tách bốn tiếng", "a lodda people", "a lot people"], correct: 1, why: "Flap t + of /ə/ + nối âm ⇒ “a lodda”. of không mất hẳn — nó thành /ə/." },
          { q: "3. Vì sao thirty và thirteen dễ nhầm ở tốc độ thật?", options: ["vì giống hệt nhau", "vì trọng âm khác (THIRty / thirTEEN) mà người nghe không để ý", "vì giọng Úc đọc khác"], correct: 1, why: "Dựa vào trọng âm, và vào âm cuối (-ty yếu, -teen dài)." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Practice 1 — bản tin trưa (Ireland · Mỹ · Úc), Questions 1–6" },
      { t: "p", text: "Nghe MỘT lần. Đọc sáu câu hỏi trong 20 giây. Hai câu có con số bị đính chính hoặc có số gây nhiễu — chờ hết câu mới ghi. Bản tin và mọi tên người, tên nơi trong đó là hư cấu." },
      {
        t: "listen", id: "t5d21-nghe-tin", title: "Practice 1 — The lunchtime news on Valley Radio",
        dan: { so: "Day 21, Recording 1", boiCanh: "a local radio news bulletin with three items.", cau: [1, 6] },
        lines: [
          { who: "Newsreader", voice: "ie-nu", text: "Good afternoon. It's one o'clock, and this is the lunchtime news on Valley Radio. A lump of dark rock found in a field outside Kilbrack has been confirmed as a meteorite — the first to be recovered in the county in more than a century. Farmer Pat Mulhern came across the stone in October while he was mending a fence along the edge of the bog, and he kept it in his shed for a month before a neighbour suggested he have it looked at. The fragment weighs about three hundred and forty grams — not the four hundred reported in some papers last week — and it's thought to have fallen within the last few hundred years. It was examined by Dr Mark Ellison, a visiting geologist from Ohio." },
          { who: "Dr Ellison", voice: "us-nam", text: "What gives it away is the crust. When a rock comes in through the atmosphere, the outside melts and then hardens into this thin black skin, almost like the glaze on a pot. And it's heavy for its size, because there's a fair bit of iron in there. Honestly, most of what people bring me turns out to be slag from some old furnace, so this was a really nice surprise." },
          { who: "Newsreader", voice: "ie-nu", text: "Mr Mulhern has donated the meteorite to the county museum in Tullagh, where it'll go on display from the beginning of March, once the new gallery opens. The museum had hoped to show it before Christmas, but the gallery won't be finished in time. In Australia now, where a country town in Queensland has saved its drive-in cinema. Our correspondent Josh Reilly reports." },
          { who: "Josh Reilly", voice: "au-nam", text: "The Starlight Drive-In outside Corrigan Flats has been showing films since nineteen sixty-six, and for almost all of that time it was run by one family. When the owners announced last year that they were retiring, it looked as if the screen would go dark for good. Instead, residents have formed a cooperative. Around eight hundred of them have bought a share, at fifty dollars each, and the first screening under the new management is this Saturday night. They're expecting a full paddock, too: tickets for two hundred cars sold out in under an hour." },
          { who: "Newsreader", voice: "ie-nu", text: "And the weather. A dry afternoon for most of us, with highs of eleven degrees, but heavy rain is expected overnight, so drivers are being asked to take care on the Kilbrack road, where there's been flooding before. That's the news. We'll be back at two." },
        ],
      },
      {
        t: "quiz", id: "t5d21-nghe-tin-dien", kind: "fill", title: "Practice 1 — Questions 1–6. ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Weight of the meteorite: approximately ___ grams", answers: ["340", "three hundred and forty"], hint: "“about three hundred and forty grams — not the four hundred reported…” Bẫy đính chính: 400 là con số SAI." },
          { q: "2. It was found while the farmer was repairing a ___.", answers: ["fence"], hint: "“while he was mending a fence” — mend = repair. Bẫy: bog (đầm lầy) là nơi, không phải thứ được sửa." },
          { q: "3. The geologist recognised it by its thin black ___.", answers: ["crust"], hint: "“What gives it away is the crust… this thin black skin”. gives it away = để lộ nó ra. Bẫy: skin, glaze — câu hỏi đã có thin black, cần danh từ ông ấy GỌI TÊN: crust." },
          { q: "4. It will be on display in Tullagh from ___.", answers: ["March", "the beginning of March"], hint: "“from the beginning of March”. Bẫy: Christmas (dự định cũ, không thực hiện được)." },
          { q: "5. The drive-in will now be run by a ___.", answers: ["cooperative", "co-operative"], hint: "“residents have formed a cooperative”. Chính tả: cooperative hoặc co-operative đều đúng." },
          { q: "6. Price of one share: ___ dollars", answers: ["50", "fifty"], hint: "“at fifty dollars each”. Số gây nhiễu: 1966, eight hundred (số người), two hundred (số xe). Giọng Úc: fifty có t rõ, nhấn FIFty." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — podcast ba người, Questions 11–20" },
      { t: "p", text: "Bạn có 30 giây đọc câu 11–15 và 20 giây đọc câu 16–20. Câu 16–20 hỏi **AI** nói ý nào: khoanh tên ba người (Aroha · Dan · Leah). Cẩn thận: người nói tự sửa, và có lúc người này nhắc lại ý của người kia để phản bác. Nghe MỘT lần, tốc độ thật. Chương trình, người nói và cuộc khảo sát trong bài là hư cấu; chuyện về chữ “mondegreen” là có thật." },
      {
        t: "listen", id: "t5d21-nghe-bai", title: "Podcast — Slips of the Ear",
        dan: { so: "Day 21, Recording 2", boiCanh: "an episode of a podcast in which two presenters talk to a speech scientist about mishearing.", cau: [11, 20] },
        lines: [
          { who: "Aroha", voice: "nz-nu", text: "Kia ora, and welcome back to Loose Ends, the podcast about the bits of language nobody taught you. I'm Aroha, and with me as always is Dan, who has a confession to make." },
          { who: "Dan", voice: "uk-nam", text: "I do. Until I was about eleven, I genuinely believed the weather forecast kept promising “scattered flowers”. I thought it was a bit poetic, honestly. I used to look out of the window for them." },
          { who: "Aroha", voice: "nz-nu", text: "That's lovely. And it's exactly what today's about, because we've got Dr Leah Morrow with us, who studies how we pull words out of speech. Leah, welcome. Is Dan's scattered flowers a mondegreen?" },
          { who: "Leah", voice: "ca-nu", text: "It's a textbook one. The word goes back to an American writer, Sylvia Wright, who published an essay about it in a magazine in 1954. As a child she'd heard an old Scottish ballad read aloud — something about an earl who'd been killed — and she turned the last few words of one line into a woman's name, Lady Mondegreen. And as I understand it, she rather preferred her version. She thought the lady was more interesting than what the poem actually said." },
          { who: "Dan", voice: "uk-nam", text: "Which is fair, to be honest. Half the time the wrong version's better. It's more memorable, anyway — I can't remember a single real forecast from my childhood, but I remember the flowers." },
          { who: "Aroha", voice: "nz-nu", text: "But why does it happen? I mean, the words are right there." },
          { who: "Leah", voice: "ca-nu", text: "That's the thing — they're not, really. When you look at a recording of continuous speech, there are no gaps between the words. The silences are in odd places, inside words as often as between them. So what your brain is doing, all the time, is betting on where one word stops and the next one starts. And for English, there's a fairly strong bet listeners seem to make. Research in the late nineteen-eighties suggested that English listeners tend to assume a strong, stressed syllable is the start of a new word. Most of the time that's a winning bet, because most English content words do start with a stressed syllable. But when it isn't, you get “a nice man” turning into “an iceman”." },
          { who: "Dan", voice: "uk-nam", text: "Right. Or “scattered showers”. Although, sorry — I'm going to push back a bit here. Isn't a lot of this just lazy listening? I wasn't paying attention to the forecast. I was eleven." },
          { who: "Aroha", voice: "nz-nu", text: "Is it lazy, though? Because the way Leah's describing it, your brain was working incredibly hard. It just came up with the wrong answer. That's not laziness, that's — it's guesswork. Really fast guesswork." },
          { who: "Dan", voice: "uk-nam", text: "Okay, fine, maybe not lazy. Distracted. I'll give you distracted." },
          { who: "Leah", voice: "ca-nu", text: "I'd put it slightly differently from both of you, actually. Mishearing isn't a fault in the system so much as the price of a system that's built for speed. If you waited until you'd heard every sound clearly before you decided what the word was, you'd fall hopelessly behind — people speak at, what, three words a second. So the brain commits early and fixes things later. Most of the time, the fixing happens so fast you never notice. A mondegreen is just a case where the fix never arrives, usually because there's nothing in the context to correct it. Song lyrics, names, a station announcement with a lot of noise." },
          { who: "Aroha", voice: "nz-nu", text: "We actually asked listeners to send us theirs before this episode, didn't we? Leah, you had a look at them." },
          { who: "Leah", voice: "ca-nu", text: "I did. We had just over six hundred, and — I think I said song lyrics were about half when we spoke last week, but that was a different survey I was thinking of. In yours it was nearer a third. The biggest group was actually names: people's names, place names, brands. Which makes sense, because a name is the one thing where context can't help you. You can't guess a surname from the rest of the sentence." },
          { who: "Aroha", voice: "nz-nu", text: "Can I bring in something personal here? Because I teach English to adults on the side, and a lot of my students hear English as one long blur. Is that the same thing?" },
          { who: "Leah", voice: "ca-nu", text: "It's related. Everybody brings the habits of their first language with them. If you grew up speaking a language where every syllable gets roughly the same weight — French, Spanish, Vietnamese, plenty of others — you're not used to using stress as a signpost. So in English the little words, the of and to and and, shrink right down, and they don't jump out at you as words at all. My advice is the opposite of what people expect. Don't try to catch every word. Listen for the stressed syllables, the ones that carry the information, and let the small ones fill themselves in." },
          { who: "Aroha", voice: "nz-nu", text: "Mm. I'd want to add a warning to that, though, for anyone listening who's preparing for an exam. In a test you often need the exact word — the spelling of a name, a number. You can't just let your brain fill that in. That's precisely where it lets you down." },
          { who: "Leah", voice: "ca-nu", text: "No, you're absolutely right. For the gist, trust the stressed words. For a name or a number, wait for it to be spelled or repeated. Announcers almost always do, because they know." },
          { who: "Dan", voice: "uk-nam", text: "And on that note — we want your misheard announcements, not lyrics this time. The address is on the website. Next week: why we trust some accents more than others. Leah, thank you." },
          { who: "Leah", voice: "ca-nu", text: "Thanks for having me. And Dan — keep looking out for the flowers." },
        ],
      },
      { t: "p", text: "**Questions 11–15** — Choose the correct letter, **A**, **B** or **C**." },
      {
        t: "mcq", id: "t5d21-nghe-chon", title: "Questions 11–15 — Multiple choice",
        items: [
          { q: "11. What does Dan say about his childhood mistake?", options: ["A He misheard a phrase in a weather forecast.", "B He misread a word in a poem.", "C He misheard the name of a flower."], correct: 0, why: "“the weather forecast kept promising ‘scattered flowers’” — nghe nhầm scattered showers. Bẫy B: poetic là lời bình, không phải bài thơ; bẫy C: flowers là chữ nghe nhầm, không phải tên hoa." },
          { q: "12. According to Leah, Sylvia Wright", options: ["A first heard the ballad in a magazine.", "B preferred her own mistaken version.", "C wrote her essay about a song she had sung."], correct: 1, why: "“she rather preferred her version”. Bẫy A: magazine là nơi bà ĐĂNG bài luận năm 1954, còn bài ballad bà nghe đọc to khi nhỏ." },
          { q: "13. Leah says that English listeners tend to assume that", options: ["A a pause marks the end of a word.", "B a stressed syllable begins a new word.", "C short words carry the most information."], correct: 1, why: "“English listeners tend to assume a strong, stressed syllable is the start of a new word”. Bẫy A bị bác: “there are no gaps between the words”." },
          { q: "14. In the podcast's own survey, how many of the reported mishearings were song lyrics?", options: ["A about half", "B about a third", "C over six hundred"], correct: 1, why: "Đính chính: “I think I said… about half… but that was a different survey… In yours it was nearer a third.” 600 là tổng số bài gửi về." },
          { q: "15. What is Leah's main advice to second-language listeners?", options: ["A Try to catch every word.", "B Focus on the stressed syllables.", "C Practise the small words separately."], correct: 1, why: "“Don't try to catch every word. Listen for the stressed syllables” — A là điều cô bảo đừng làm (bẫy chữ trùng)." },
        ],
      },
      { t: "p", text: "**Questions 16–20** — Who expresses each opinion? Choose **A** (Aroha), **B** (Dan) or **C** (Leah). You may use any letter more than once." },
      {
        t: "quiz", id: "t5d21-nghe-ai", kind: "fill", title: "Questions 16–20 — Matching (gõ A, B hoặc C)",
        items: [
          { q: "16. Mishearing shows that the brain is working hard.", answers: ["A"], hint: "Aroha: “your brain was working incredibly hard. It just came up with the wrong answer.”" },
          { q: "17. Mishearing is often the result of not concentrating.", answers: ["B"], hint: "Dan: “Isn't a lot of this just lazy listening?” rồi tự sửa: “maybe not lazy. Distracted.” — vẫn là không tập trung. Ý cuối của Dan." },
          { q: "18. Errors are an unavoidable cost of processing speech quickly.", answers: ["C"], hint: "Leah: “the price of a system that's built for speed”. price = cost (paraphrase mức 2). Cô mở bằng “I'd put it slightly differently from both of you” — tín hiệu ý của người THỨ BA." },
          { q: "19. People taking a test cannot rely on the brain to fill in missing details.", answers: ["A"], hint: "Aroha: “for anyone… preparing for an exam… You can't just let your brain fill that in.” Bẫy C: Leah đồng ý (“you're absolutely right”) nhưng người NÊU ý là Aroha." },
          { q: "20. A misheard version can be easier to remember than the original.", answers: ["B"], hint: "Dan: “Half the time the wrong version's better. It's more memorable, anyway”. Bẫy: Sylvia Wright thích bản của mình — nhưng đó là chuyện Leah KỂ, không phải ý của Leah." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Sau khi nghe — bẫy ở đâu, và tín hiệu nào báo trước" },
      {
        t: "table",
        head: ["Câu", "Bẫy", "Tín hiệu báo trước"],
        rows: [
          ["1 · 14", "con số bị đính chính", "not the… reported · I think I said… but · actually"],
          ["17", "người nói tự sửa sau khi bị phản bác", "Okay, fine, maybe not… · I'll give you…"],
          ["18", "ý của người thứ ba khác cả hai", "I'd put it slightly differently from both of you"],
          ["19", "người đồng ý ≠ người nêu ý", "No, you're absolutely right — Leah ĐỒNG Ý, Aroha NÊU"],
          ["20 · 12", "người kể chuyện ≠ người có ý kiến", "as I understand it, she… — Leah thuật lại, không phát biểu"],
          ["3", "từ bị thay bằng từ gần nghĩa ngay sau", "the crust… this thin black skin"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — ba câu chẻ người bản ngữ vừa nói (nối Bài 1)",
        items: [
          "“What gives it away is the crust.” (Dr Ellison) — câu chẻ What… is… để nhấn dấu hiệu nhận biết.",
          "“That's the thing — they're not, really.” (Leah) — The thing is… ở dạng ngắn nhất, sửa tiền đề “the words are right there”.",
          "“Mishearing isn't a fault in the system so much as the price of a system that's built for speed.” (Leah) — biến thể của It's not so much X as Y. Chép cả ba vào sổ Speaking.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. E08 — nghe podcast và tin tức thật mỗi ngày: kế hoạch 4 tuần" },
      { t: "p", text: "Một bài nghe trong sách không thay được 20 phút nghe thật mỗi ngày. Kế hoạch dưới đây dùng **nguồn miễn phí** (podcast của các đài phát thanh công cộng, kênh tin của trường đại học, chương trình khoa học phổ thông). Không cần nguồn cụ thể nào — chọn chủ đề bạn thích, vì bạn sẽ phải nghe nó nhiều lần." },
      {
        t: "table",
        head: ["Tuần", "Nghe gì", "Cách nghe", "Chép vào sổ"],
        rows: [
          ["1", "bản tin 5 phút, một giọng (Anh hoặc Mỹ)", "lần 1 không lời; lần 2 ghi 5 danh từ chính; lần 3 đọc transcript", "5 cụm danh từ dài (a month-long review of…)"],
          ["2", "podcast hai người, 15–20 phút, có transcript", "nghe cả tập ở 1.0; chọn 2 phút khó nhất nghe lại 3 lần + chép chính tả", "tín hiệu chuyển ý, câu tự sửa"],
          ["3", "trộn giọng: một tập Úc / New Zealand, một tập Ireland / Scotland", "chỉ ghi số và tên riêng; so với transcript", "chữ bạn nghe trượt + giọng nào"],
          ["4", "thảo luận 3 người hoặc phỏng vấn dài", "sau mỗi 5 phút dừng, nói 30 giây tóm tắt (luyện Part 3)", "3 câu ý kiến hay để mượn khi nói"],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — ba thói quen làm phí giờ nghe",
        items: [
          "**Nghe ở tốc độ 0.75.** Bạn quen với tiếng Anh chậm và thi sẽ hụt. Chậm chỉ dùng cho đoạn chép chính tả, không cho cả tập.",
          "**Bật phụ đề ngay lần đầu.** Mắt đọc thay tai. Phụ đề để ở lần thứ ba.",
          "**Đổi nguồn mỗi ngày.** Cùng một chương trình trong hai tuần giúp tai quen giọng, và bạn bắt đầu nghe được cả câu đùa — dấu hiệu rõ nhất của band 8.",
        ],
      },
      { t: "rule", formula: "20 phút / ngày · tốc độ 1.0 · nghe 3 lượt (không chữ → ghi chú → transcript) · 2 phút chép chính tả", vi: "Nghe thật đều đặn mỗi ngày quan trọng hơn nghe nhiều một hôm." },

      /* ── 8 ── */
      { t: "h", text: "8. Từ vựng hữu ích từ bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "mishear", pos: "v", ipa: "/ˌmɪsˈhɪə/", vi: "nghe nhầm", ex: "I must have misheard the platform number.", exVi: "Chắc tôi đã nghe nhầm số sân ga.", more: "mishear – misheard – misheard · cùng họ: misread, misspell, mispronounce · a misheard lyric" },
          { w: "guesswork", pos: "n", ipa: "/ˈɡeswɜːk/", vi: "sự phỏng đoán, đoán mò", ex: "Without proper data, any forecast is just guesswork.", exVi: "Không có số liệu đàng hoàng thì mọi dự báo chỉ là đoán mò.", more: "pure / educated guesswork · không đếm được: ~~a guesswork~~" },
          { w: "garbled", pos: "adj", ipa: "/ˈɡɑːbld/", vi: "méo mó, lộn xộn (lời nói, tin nhắn) khó hiểu", ex: "The announcement was so garbled that nobody moved.", exVi: "Thông báo méo mó đến mức không ai nhúc nhích.", more: "a garbled message / account · garble (v)" },
          { w: "make out", pos: "phr v", ipa: "/meɪk ˈaʊt/", vi: "nghe ra / nhìn ra (một cách khó khăn)", ex: "I could just make out the name of the street.", exVi: "Tôi chỉ vừa đủ nghe ra tên con phố.", more: "make out what sb is saying · can't make it out · Listening: rất hay dùng khi nói về tiếng ồn" },
          { w: "pick up on", pos: "phr v", ipa: "/pɪk ˈʌp ɒn/", vi: "nhận ra (chi tiết tinh tế); nói tiếp ý ai đó", ex: "Good listeners pick up on small changes in tone.", exVi: "Người nghe giỏi nhận ra những thay đổi nhỏ trong giọng.", more: "to pick up on what you said… (Part 3: nối ý giám khảo) · pick up = học lỏm (pick up a language)" },
          { w: "the gist", pos: "n", ipa: "/ðə dʒɪst/", vi: "ý chính, đại ý", ex: "I didn't catch every word, but I got the gist.", exVi: "Tôi không bắt được từng chữ, nhưng hiểu đại ý.", more: "get / catch the gist (of sth) · gần: the main point, the thrust" },
          { w: "trip sb up", pos: "phr v", ipa: "/trɪp ˈʌp/", vi: "làm ai vấp, làm ai mắc lỗi", ex: "It's the small words that trip most learners up.", exVi: "Chính những từ nhỏ làm hầu hết người học vấp.", more: "trick questions designed to trip you up · trip over (vấp vào)" },
          { w: "on the fly", pos: "idiom", ipa: "/ɒn ðə flaɪ/", vi: "ngay trong lúc đang làm, tức thì", ex: "The brain corrects these errors on the fly.", exVi: "Bộ não sửa những lỗi này ngay trong lúc đang nghe.", more: "decide / adapt / translate on the fly · gần: in real time" },
          { w: "come forward", pos: "phr v", ipa: "/kʌm ˈfɔːwəd/", vi: "đứng ra (trình báo, cung cấp thông tin)", ex: "Several witnesses have come forward since the appeal.", exVi: "Đã có vài nhân chứng đứng ra sau lời kêu gọi.", more: "come forward with information / evidence · tin tức hay dùng: Police are urging anyone… to come forward" },
          { w: "reinstate", pos: "v", ipa: "/ˌriːɪnˈsteɪt/", vi: "khôi phục (dịch vụ, chức vụ)", ex: "The bus route was reinstated after a petition.", exVi: "Tuyến xe buýt được khôi phục sau một bản kiến nghị.", more: "reinstate a service / an employee · reinstatement (n)" },
          { w: "resume", pos: "v", ipa: "/rɪˈzjuːm/", vi: "tiếp tục lại (sau khi ngừng)", ex: "Talks will resume next week.", exVi: "Đàm phán sẽ tiếp tục lại vào tuần sau.", more: "resume work / talks / normal service · KHÔNG nhầm với résumé /ˈrezjumeɪ/ (CV, Anh–Mỹ)" },
          { w: "correspondent", pos: "n", ipa: "/ˌkɒrəˈspɒndənt/", vi: "phóng viên thường trú (ở một nơi / một mảng)", ex: "Our science correspondent has the details.", exVi: "Phóng viên mảng khoa học của chúng tôi có thông tin chi tiết.", more: "a foreign / political / health correspondent · correspond (v) = trao đổi thư từ; tương ứng" },
          { w: "put a number on sth", pos: "phr", ipa: "/pʊt ə ˈnʌmbə ɒn/", vi: "đưa ra con số cụ thể cho cái gì", ex: "It's hard to put a number on how many people were affected.", exVi: "Khó đưa ra con số cụ thể về số người bị ảnh hưởng.", more: "Part 3 hedging: I couldn't put a number on it, but… · put a figure / price on sth" },
          { w: "a throwaway remark", pos: "n", ipa: "/ə ˈθrəʊəweɪ rɪˈmɑːk/", vi: "câu nói buột ra, nói chơi không nghĩ nhiều", ex: "It was meant as a throwaway remark, but it upset her.", exVi: "Đó chỉ là câu nói buột ra, nhưng nó làm cô ấy buồn.", more: "a throwaway comment / line · Listening Part 3: câu nói chơi thường KHÔNG phải đáp án" },
        ],
      },
    ],
  },

  /* ════════════════ BÀI TẬP NGÀY 21 ════════════════ */
  {
    id: "t5d21-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 21 — câu chẻ · đảo ngữ · giả định khi nói · đọc một lượt · nghe bản tin hai giọng · từ vựng",
    goal: "Ôn trọn Ngày 21 trong 60 phút: nói đúng hình thức và đúng chỗ ba cấu trúc hiếm, đọc một bài lập luận ngắn theo giao thức một lượt (không đọc lại), nghe một bản tin giọng Canada và New Zealand có con số bị đính chính, dùng đúng 6 từ mới — rồi nói ba câu Part 3 có một ★ mỗi câu cho AI chấm.",
    minutes: 60,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay",
        items: [
          "Phần I–IV ôn **Bài 1** (ba cấu trúc hiếm khi nói). Sai từ 2 câu trong một phần ⇒ đọc lại đúng mục đó.",
          "Phần V ôn **Bài 2**: bấm 6 phút, đọc MỘT lượt — cấm cuộn lên đọc lại trọn đoạn. Làm xong ghi một dòng vào nhật ký “quay lại”.",
          "Phần VI ôn **Bài 3**: nghe MỘT lần, giọng Canada và New Zealand, có đính chính số.",
          "Phần VII: từ vựng của ngày. Phần VIII: nói Part 3 — mỗi câu trả lời dùng ít nhất MỘT ★ đúng việc (tối đa hai).",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 21 trong một hình", center: "Band 8 = đúng chỗ, một lượt, tốc độ thật",
        branches: [
          { label: "Nói Part 3", items: ["What… isn't X, it's Y", "Only when… do…", "That I accept. What I don't…", "1–2 ★ / câu trả lời"] },
          { label: "Đọc 60 phút", items: ["trả lời khi đi qua", "90 giây ⇒ đoán + cờ", "16 – 18 – 19 + 5 + 2", "0–1 lần đọc lại trọn đoạn"] },
          { label: "Nghe thật", items: ["tin: câu đầu là tin", "podcast: ý cuối mới là ý", "số bị đính chính", "6 giọng"] },
          { label: "Mỗi ngày", items: ["20 phút podcast", "tốc độ 1.0", "3 lượt nghe", "2 phút chép chính tả"] },
        ],
      },

      { t: "h", text: "I. Câu chẻ khi nói — điền MỘT từ (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "quiz", id: "t5d21-bt-cau-che", kind: "fill", title: "I. Câu chẻ khi nói",
        items: [
          { q: "1. What I care ___ is whether it works, not how it looks.", answers: ["about"], hint: "care ABOUT — giữ giới từ trong mệnh đề What." },
          { q: "2. What's changed isn't the price; ___ the way people pay.", answers: ["it's"], hint: "What… isn't X; it's Y." },
          { q: "3. ___ I'd disagree is on the timing.", answers: ["Where"], hint: "Where + S + V + is on… — chỉ ra CHỖ không đồng ý." },
          { q: "4. It's not so much that they're unwilling ___ that they're unable.", answers: ["as"], hint: "It's not so much X as Y." },
          { q: "5. ___ it takes is one careless comment for the trust to disappear.", answers: ["All"], hint: "All it takes is…" },
          { q: "6. It's the older residents ___ use the service most.", answers: ["who", "that"], hint: "It's + N (người) + who / that + V — V hoà hợp với residents (use, không uses)." },
        ],
      },

      { t: "h", text: "II. Đảo ngữ nói được — chọn câu đúng và tự nhiên (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "mcq", id: "t5d21-bt-dao-ngu", title: "II. Đảo ngữ khi nói",
        items: [
          { q: "1. Chọn câu đúng.", options: ["Not only it is cheaper, it's faster.", "Not only is it cheaper, it's faster.", "Not only cheaper is it, it's faster."], correct: 1, why: "Not only + be + S + adj." },
          { q: "2. Chọn câu đúng.", options: ["Only when the rules are clear people follow them.", "Only when are the rules clear do people follow them.", "Only when the rules are clear do people follow them."], correct: 2, why: "Vế Only when giữ trật tự thường; vế chính đảo." },
          { q: "3. Câu nào tự nhiên nhất trong Part 3?", options: ["Seldom have I encountered such a fascinating question.", "That's not something I've thought about much, but…", "Rarely does one consider such matters."], correct: 1, why: "A và C nghe như diễn văn — lại ở câu mở đầu, không làm việc gì. B là câu mua thời gian tự nhiên (Tập 5 Ngày 2)." },
          { q: "4. Chọn câu đúng.", options: ["Should the price rise, fewer people would buy it.", "Should the price will rise, fewer people would buy it.", "Should the price rose, fewer people would buy it."], correct: 0, why: "Should + S + V nguyên mẫu." },
          { q: "5. “Little did I know…” hợp nhất với:", options: ["câu chốt Part 3 về chính sách", "Part 2 khi kể chuyện", "Part 1 câu hỏi về sở thích"], correct: 1, why: "Little did… là giọng kể chuyện." },
          { q: "6. Bản nói tự nhiên của “So great was the demand that the shop ran out”:", options: ["So great the demand was that…", "Demand was so high that the shop ran out.", "Such great was the demand that…"], correct: 1, why: "Khi nói: so… that trật tự thường." },
        ],
      },

      { t: "h", text: "III. Giả định và đưa lên đầu câu — điền MỘT từ (5 câu) — ôn Bài 1 mục 4" },
      {
        t: "quiz", id: "t5d21-bt-gia-dinh", kind: "fill", title: "III. Giả định, đưa lên đầu câu",
        items: [
          { q: "1. If it ___ for the volunteers, the festival would have stopped years ago.", answers: ["weren't", "wasn't"], hint: "If it weren't for + N (Anh–Anh nói thoải mái cũng dùng wasn't)." },
          { q: "2. ___ it not for the scholarship, I couldn't afford to study abroad.", answers: ["Were"], hint: "Were it not for + N (hiện tại / chung). Nói về quá khứ thì dùng Had it not been for… — câu này ở hiện tại (couldn't afford) nên Were." },
          { q: "3. Odd ___ it may sound, I find traffic jams relaxing.", answers: ["as", "though"], hint: "adj + as / though + S + may + V." },
          { q: "4. It's vital that every patient ___ told the risks in plain language.", answers: ["be", "is"], hint: "Giả định: be + V3 (Anh–Mỹ, trang trọng); is cũng chấp nhận ở Anh–Anh." },
          { q: "5. That it's popular, I ___. What I don't accept is that it's fair.", answers: ["accept", "admit", "agree"], hint: "That + mệnh đề, I accept. — tân ngữ đưa lên đầu để nhượng bộ có chọn lọc." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–5" },
      {
        t: "quiz", id: "t5d21-bt-dich", kind: "translate", title: "IV. Dịch — mỗi câu một ★",
        grammar: "câu chẻ khi nói · đảo ngữ nói được · giả định / đưa lên đầu · keo G44",
        items: [
          { q: "1. Điều làm tôi ngạc nhiên không phải là giá, mà là có bao nhiêu người sẵn lòng trả.", answers: ["What surprises me isn't the price, it's how many people are willing to pay it.", "What surprised me wasn't the price, it was how many people were willing to pay.", "What surprises me is not the price but how many people are willing to pay."], hint: "What surprises me isn't…, it's how many…" },
          { q: "2. Chỉ khi có xe buýt đêm thì người trẻ mới thôi lái xe sau khi uống rượu.", answers: ["Only when there are night buses will young people stop driving after drinking.", "Only if there are night buses will young people stop drink-driving.", "Only when night buses are available do young people stop driving after drinking."], hint: "Only when / if + mệnh đề, will / do + S + V" },
          { q: "3. Nếu không có bà tôi, tôi đã chẳng bao giờ học nấu ăn.", answers: ["If it hadn't been for my grandmother, I would never have learned to cook.", "Had it not been for my grandmother, I would never have learnt to cook.", "Were it not for my grandmother, I would never have learned to cook."], hint: "If it hadn't been for / Had it not been for + N, … would never have + V3" },
          { q: "4. Nghe có vẻ kỳ, nhưng tôi thích những ngày mưa.", answers: ["Strange as it may sound, I like rainy days.", "Odd as it may sound, I love rainy days.", "Strange as it sounds, I enjoy rainy days."], hint: "Strange / Odd as it may sound, …" },
          { q: "5. Người ta nghi ngờ các ứng dụng này — và như thế là đúng.", answers: ["People are suspicious of these apps, and rightly so.", "People are wary of these apps — and rightly so.", "People are suspicious of these apps and rightly so."], hint: "…, and rightly so. (keo G44)" },
        ],
      },

      { t: "h", text: "V. Đọc một lượt — “The Unopened Letter” (5 câu · 6 phút) — ôn Bài 2 mục 2–4" },
      { t: "p", text: "Bấm 6 phút. Đọc câu 1–5 trước, rồi đọc bài MỘT lượt và trả lời khi đi qua. Thuật ngữ “ostrich effect” là có thật; bệnh viện và con số trong đoạn C là hư cấu." },
      {
        t: "passage", title: "The Unopened Letter",
        paras: [
          { label: "A", text: "Most accounts of human reasoning assume that people want information and that the problem is getting enough of it. Yet anyone who has left an envelope from the bank unopened on the kitchen table for a week knows that this is not the whole story. People frequently choose not to know things, even when the knowledge is free and would be useful." },
          { label: "B", text: "Economists have a name for one form of this behaviour: the ostrich effect, after the animal's supposed habit of burying its head in the sand — a habit, incidentally, that ostriches do not actually have. Studies of investors have found that they check the value of their savings more often when markets are rising than when they are falling, as if not looking could keep the losses from being real." },
          { label: "C", text: "The pattern is not confined to money. When a hospital in one fictional but typical example offered free tests for an inherited condition to the relatives of patients, fewer than half took up the offer, although a positive result would have allowed them to take precautions. Those who declined were not, on the whole, less educated or less worried than those who accepted. If anything, they were more worried." },
          { label: "D", text: "It would be easy to call such choices irrational. But information is not only a tool for making decisions; it also changes how we feel, and some people judge, perhaps correctly, that a piece of bad news would cost them more in peace of mind than it would give them in useful options. The difficulty is that this judgement is usually made before the information has been seen, which means it rests on a guess about what the letter contains." },
        ],
      },
      {
        t: "mcq", id: "t5d21-bt-doc", title: "V. TRUE / FALSE / NOT GIVEN (5 câu)",
        items: [
          { q: "1. Most theories of reasoning assume that people avoid information.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn A: chúng giả định “people want information” ⇒ ngược lại ⇒ FALSE." },
          { q: "2. Ostriches really do hide their heads in the sand when frightened.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn B: “a habit… that ostriches do not actually have” ⇒ FALSE. Bẫy: lời chen “incidentally” chứa đáp án." },
          { q: "3. Investors look at their savings less often when markets are falling.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: check “more often when markets are rising than when they are falling” ⇒ khi giảm thì xem ÍT hơn ⇒ TRUE. Đảo chiều so sánh — bẫy quen của Đề 10." },
          { q: "4. People who declined the test were generally less anxious than those who accepted it.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn C: “If anything, they were more worried.” ⇒ FALSE." },
          { q: "5. The writer believes that avoiding bad news is always a mistake.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn D: “some people judge, perhaps correctly…” ⇒ bài cho biết có trường hợp né tin xấu là hợp lý ⇒ trái với always ⇒ FALSE. Từ tuyệt đối always là tín hiệu đầu tiên cần soi." },
        ],
      },
      {
        t: "note", title: "📌 Nhật ký “quay lại” — một dòng",
        items: [
          "Bạn có cuộn lên đọc lại trọn đoạn nào không? Nếu có: đoạn nào, vì câu nào? Câu ấy đúng hay sai?",
          "Câu 3 là câu hay bị đọc lại nhất (so sánh hai vế). Nếu bạn đọc lại ở câu 3, lần sau: khi gặp more… than… trong bài, viết lề “↑ rising > falling” ngay lần đọc đầu.",
        ],
      },

      { t: "h", text: "VI. Nghe — bản tin hai giọng (5 câu) — ôn Bài 3 mục 1 · 4" },
      { t: "p", text: "Nghe MỘT lần. Giọng Canada (phát thanh viên) và New Zealand (nhân viên). Có một con số bị đính chính. Tên thành phố và mọi chi tiết là hư cấu." },
      {
        t: "listen", id: "t5d21-bt-nghe", title: "Homework — Port Merrin lost property auction",
        dan: { so: "Day 21, Homework", boiCanh: "a local news item about a public transport lost property office.", cau: [1, 5] },
        lines: [
          { who: "Newsreader", voice: "ca-nam", text: "Port Merrin Transit will auction off more than twelve hundred unclaimed items next month — that's down from the two thousand it originally announced, after a run of owners came forward this week. Items are normally held for ninety days before they can be sold. The auction takes place on Saturday the fourteenth at the old tram depot on Harbour Road, and all the money raised will go to the city's food bank. Mere Thompson manages the lost property office." },
          { who: "Mere Thompson", voice: "nz-nu", text: "People always assume it's going to be phones, and we do get plenty, but the thing we get most of by a long way is single gloves. Never pairs — always one. We've got a whole cabinet of them. The strangest thing this year was a full-size cello. Somebody left it on the number nine bus, and nobody's claimed it, which honestly I still can't get my head around." },
          { who: "Newsreader", voice: "ca-nam", text: "Viewing starts at nine on the morning of the sale, and bidding opens at ten." },
        ],
      },
      {
        t: "quiz", id: "t5d21-bt-nghe-dien", kind: "fill", title: "VI. Questions 1–5 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
        items: [
          { q: "1. Number of items to be auctioned: more than ___", answers: ["1200", "1,200", "twelve hundred"], hint: "“more than twelve hundred… down from the two thousand it originally announced” — đính chính." },
          { q: "2. Items are kept for ___ days before they can be sold.", answers: ["90", "ninety"], hint: "“held for ninety days”." },
          { q: "3. Money raised will go to the city's ___.", answers: ["food bank"], hint: "“all the money raised will go to the city's food bank” — danh từ ghép hai từ, vừa giới hạn." },
          { q: "4. The most common item handed in: single ___", answers: ["gloves", "glove"], hint: "“the thing we get most of by a long way is single gloves” — bẫy: phones (“we do get plenty”, nhưng không nhiều nhất)." },
          { q: "5. Bidding begins at ___ o'clock.", answers: ["10", "ten"], hint: "“Viewing starts at nine… bidding opens at ten”. Bẫy: 9 là giờ xem hàng; số 9 còn là số tuyến xe buýt." },
        ],
      },

      { t: "h", text: "VII. Từ vựng của ngày (6 câu) — ôn Bài 2 mục 9 và Bài 3 mục 8" },
      {
        t: "quiz", id: "t5d21-bt-tu-vung", kind: "fill", title: "VII. Điền MỘT từ",
        items: [
          { q: "1. The station announcement was so ___ that nobody knew which platform to go to.", answers: ["garbled"], hint: "garbled = méo mó, khó hiểu." },
          { q: "2. I didn't understand every word, but I got the ___.", answers: ["gist"], hint: "get the gist = hiểu đại ý." },
          { q: "3. Her theory was put to the ___ in a large study last year.", answers: ["test"], hint: "put sth to the test." },
          { q: "4. Delays tend to ___ around the start of the holidays.", answers: ["cluster"], hint: "cluster around = dồn vào." },
          { q: "5. The service was ___ after hundreds of residents signed a petition.", answers: ["reinstated"], hint: "reinstate = khôi phục." },
          { q: "6. In the ___, everyone agrees with fairness; in practice, it's harder.", answers: ["abstract"], hint: "in the abstract ↔ in practice." },
        ],
      },

      { t: "h", text: "VIII. Nói Part 3 — mỗi câu trả lời 1–2 ★ — AI chấm — ôn Bài 1 mục 1 · 6" },
      { t: "p", text: "Mỗi câu nói 40–60 giây theo bốn nhịp. Trước khi nói, quyết định ★ nằm ở nhịp nào. Nghe lại: ★ có làm việc không (sửa tiền đề / xoay / chốt)? Có câu nào nghe như diễn văn không?" },
      {
        t: "speak", id: "t5d21-bt-noi-p3", part: "3",
        questions: [
          "Is it ever better not to know the truth about something?",
          "Do you think people listen to each other less carefully than they used to?",
          "Should news organisations be punished when they report something that turns out to be wrong?",
        ],
      },
      {
        t: "speak", id: "t5d21-bt-noi-them", part: "3",
        questions: [
          "Why do some people prefer podcasts to reading the news?",
          "To what extent should schools teach students how to judge whether information is reliable?",
        ],
      },
    ],
  },
];
