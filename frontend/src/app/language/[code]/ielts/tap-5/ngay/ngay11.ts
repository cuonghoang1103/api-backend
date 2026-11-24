/**
 * IELTS Tập 5 — Ngày 11 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, bài mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)  Ngữ pháp nói band 8 — cấu trúc phức nói tự nhiên, ellipsis, substitution [G44, vòng 3]
 *                    — nối Tập 3 Ngày 11 (chunks) · Tập 4 Ngày 23 (5 móc nối, rút gọn bằng trợ động từ, tags, head–tail).
 *                    Mới: ellipsis đầu câu · sau wh- / modal hoàn thành / to · if any / if ever · do so, one, ngôn ngữ ước
 *                    chừng · giới từ cuối câu, mệnh đề bình luận, not that · I'd have thought / you'd think · fronting khi nói
 *                    và cụm nói lại cho rõ (or rather, put it this way).
 *   Bài 2 (reading)  Thể loại khó: triết học / kinh tế học, 900 từ / 15 phút [R20 R21] — khởi động "The Price of a String
 *                    Quartet" (~340 từ, bệnh chi phí Baumol) + bài chính "The Machine Nobody Wants" (~900 từ, cỗ máy trải
 *                    nghiệm của Nozick), 15 câu: YNNG 6 · MCQ 4 · Summary có hộp từ 5. Dữ kiện thật: Baumol & Bowen 1966 ·
 *                    Nozick 1974 (ba lý do từ chối cỗ máy) · status quo bias · De Brigard 2010 (kịch bản đảo ngược: không
 *                    mô tả đời thật ⇒ chia gần đôi; đời thật tệ ⇒ đa số ở lại). Lời văn tự viết, không trích nguyên văn.
 *   Bài 3 (speaking) Idiom và từ ít gặp dùng khéo + paraphrase câu hỏi [VD7 S10] · 🔊 trọng âm chuỗi (đỉnh giọng của cụm
 *                    cố định) — nối Tập 3 Ngày 30 · Tập 4 Ngày 18 · Tập 5 Ngày 3 (idiom), Tập 3 Ngày 27 (paraphrase câu hỏi).
 *                    14 idiom + 10 từ CHƯA dạy ở Tập 3–5. Thẻ Part 2 mới.
 *   Bài tập Ngày 11  41 câu có đáp án
 * Mọi id bắt đầu `t5d11-`.
 */
import type { Lesson } from '../data';

export const NGAY_11: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d11-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp nói band 8: câu phức nói tự nhiên, ellipsis và substitution (vòng 3)",
    goal: "Trả lời Part 1 và Part 3 bằng ngữ pháp của người nói thật ở mức band 8: lược đúng chỗ (Never been, actually. · …I can't remember who. · I should have.), thay từ thay vì lặp (do so · one · that sort of thing), dùng câu phức kiểu nói (the people I work with · from what I've seen · not that… · I'd have thought…) và tự sửa lời có đánh dấu (or rather · put it this way) mà không sai dạng.",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Grammatical Range & Accuracy của Speaking từ 7 lên 8**: band 8 là “dùng nhiều kiểu cấu trúc một cách linh hoạt, đa số câu không lỗi”. Linh hoạt khi NÓI không có nghĩa là câu dài như bài viết.",
          "**Vòng 3** của ngữ pháp nói: Tập 3 Ngày 11 dạy chunks (I'd say…, the thing is…); Tập 4 Ngày 23 dạy 5 móc nối, rút gọn bằng trợ động từ (…than I used to), tags, head–tail. Hôm nay học phần còn lại: ==lược, thay, và câu phức kiểu nói==.",
          "Sáu nhóm: (1) lược đầu câu · (2) lược sau wh-, sau modal hoàn thành, sau to · (3) thay từ + ngôn ngữ ước chừng · (4) giới từ cuối câu, mệnh đề bình luận, not that · (5) I'd have thought / you'd think · (6) đưa ra trước + nói lại cho rõ.",
          "Mỗi nhóm có **giới hạn**: dùng ở Part nào, liều bao nhiêu. Người band 7 học xong hay dùng quá tay; phần ⚠️ của từng mục nói rõ chỗ dừng.",
          "Những cấu trúc này cũng là thứ bạn NGHE thấy ở Listening Part 1 và Part 3. Nhận ra chúng thì hết bị lạc khi người nói bỏ lửng nửa câu.",
        ],
      },

      { t: "h", text: "1. Vòng 3 — band 7 và band 8 khác nhau ở đâu khi NÓI" },
      { t: "p", text: "Người Việt ở band 7 thường nói **tiếng Anh viết**: câu nào cũng đủ chủ ngữ, đủ động từ, lặp lại nguyên cụm của câu hỏi, nối bằng Firstly / Moreover. Không sai, nhưng giám khảo nghe ra đó là câu được dựng sẵn. Người bản ngữ có học nói khác: họ **bỏ phần ai cũng hiểu**, **thay phần vừa nói bằng một từ ngắn**, và gói ý phức vào những khung rất gọn." },
      {
        t: "table", head: ["", "Band 7", "Band 8"],
        rows: [
          ["Mở câu trả lời", "Yes, I think I am a person who likes cooking.", "Love it, actually — though I don't get much time for it."],
          ["Phần đã nói", "Lặp nguyên: …but I did not learn to swim.", "Lược: …but I never did. · I wish I had."],
          ["Câu phức", "Mệnh đề quan hệ kiểu viết: the people with whom I work", "Kiểu nói: the people I work with"],
          ["Rào đón", "I think · maybe · in my opinion (lặp)", "I'd have thought… · from what I've seen · I couldn't tell you exactly"],
          ["Khi nói hỏng", "Ngừng, im, nói lại từ đầu câu", "Sửa có đánh dấu: …or rather, … · put it this way: …"],
        ],
      },
      { t: "p", text: "Làm bài chẩn đoán trước. Sai câu nào thì đọc chậm mục tương ứng (câu 1 → mục 2, câu 2–3 → mục 3, câu 6 → mục 4, câu 4 → mục 5, câu 5 → mục 6)." },
      {
        t: "mcq", id: "t5d11-chan-doan", title: "Chẩn đoán đầu bài — chọn phương án ĐÚNG và tự nhiên (6 câu)",
        items: [
          { q: "1. “Do you cook much?” — “___”", options: ["Is not often, honestly.", "Not often, to be honest.", "Am not often cook."], correct: 1, why: "Lược được CẢ cụm “I do” / “I cook”, còn lại “Not often”. Không lược chủ ngữ mà để lại is / am đứng trơ: “Is not often”, “Am not…” là lỗi do dịch từ tiếng Việt." },
          { q: "2. Someone told me about the scholarship, but I can't remember ___.", options: ["who", "who is", "whom told"], correct: 0, why: "Sau wh- lược cả mệnh đề: …remember who (told me). Không thêm is; “whom told” sai vì whom không làm chủ ngữ." },
          { q: "3. I didn't back up my files last term. I really ___.", options: ["should", "should have", "should had"], correct: 1, why: "Việc ở quá khứ ⇒ giữ should have, lược “backed them up”. “I should” nói về hiện tại / tương lai. “should had” sai dạng." },
          { q: "4. Câu nào là cách NÓI tự nhiên?", options: ["They're the people I work with.", "They're the people with who I work.", "They're the people which I work with."], correct: 0, why: "Khi nói, giới từ ở cuối và bỏ đại từ quan hệ. “with who” sai (phải là with whom, và nghe như văn bản); which không dùng cho người." },
          { q: "5. I'd have thought more students ___ the library in exam week.", options: ["will use", "use", "would use"], correct: 2, why: "I'd have thought + S + would + V: “tôi cứ tưởng là…” — một cách tỏ ý ngạc nhiên / không đồng tình rất lịch sự." },
          { q: "6. The ticket costs fifty dollars ___.", options: ["or so", "or such", "or that"], correct: 0, why: "Số + or so = khoảng chừng. Không có “or such / or that” với nghĩa này." },
        ],
      },

      { t: "h", text: "2. Lược đầu câu — bỏ chủ ngữ (và trợ động từ) khi ai cũng hiểu" },
      { t: "p", text: "Trong hội thoại, người bản ngữ hay bỏ **I / it / that** ở đầu câu, kèm luôn trợ động từ hoặc be đi với nó. Tên gọi: **situational ellipsis** (lược theo tình huống). Nó làm câu mở đầu nghe như đang trò chuyện. Quy tắc cốt lõi: ==bỏ thì bỏ cả cụm đầu (chủ ngữ + trợ động từ / be); không bao giờ bỏ chủ ngữ mà để is / am / have đứng trơ==." },
      {
        t: "patterns", rows: [
          { formula: "(I) + V…   ·   (I'm) + adj / V-ing…   ·   (I've) + V3…", vi: "Bỏ I, hoặc bỏ cả I'm / I've. Hợp nhất với câu ĐẦU của câu trả lời Part 1.", examples: [
            { en: "Can't say I do, to be honest.", vi: "(I) can't say… — Thật lòng thì tôi không (thích).", },
            { en: "Not sure, actually. I've never really thought about it.", vi: "(I'm) not sure — Tôi không chắc. Tôi chưa nghĩ tới bao giờ." },
            { en: "Never been, I'm afraid — though it's high on my list.", vi: "(I've) never been — Tiếc là chưa từng đến, dù tôi rất muốn." },
          ] },
          { formula: "(It / That) + V(s/es)…   ·   (It's) + adj / N…", vi: "Bỏ it / that khi đang nhận xét điều vừa được nhắc.", examples: [
            { en: "Depends on the day, really.", vi: "(It) depends… — Còn tuỳ hôm." },
            { en: "Sounds like a lot of work, but it isn't.", vi: "(It) sounds… — Nghe thì có vẻ nhiều việc, nhưng không phải." },
            { en: "Hard to say. Probably my grandmother.", vi: "(It's) hard to say — Khó nói. Chắc là bà tôi." },
          ] },
          { formula: "(There's) + no / not much + N…   ·   (Do you) + V…? (nghe hiểu)", vi: "Bỏ There's; bỏ Do you / Have you trong câu hỏi thân mật — dạng sau chỉ cần NGHE ra.", examples: [
            { en: "No point complaining, so we just got on with it.", vi: "(There's) no point… — Phàn nàn chẳng ích gì nên chúng tôi cứ làm." },
            { en: "Ever tried it yourself? — Once. Never again.", vi: "(Have you) ever tried…? — Thử một lần. Không bao giờ nữa." },
          ] },
        ],
      },
      {
        t: "table", head: ["Tình huống", "Dùng được không", "Ví dụ / lý do"],
        rows: [
          ["Câu đầu của câu trả lời Part 1", "✔ Rất hợp", "Not really. · Love it. · Depends. — rồi nói tiếp 1–2 câu ĐẦY ĐỦ"],
          ["Giữa câu trả lời Part 2", "✔ Thỉnh thoảng, khi kể", "Got there at six. Nobody around. — nhịp kể chuyện"],
          ["Part 3 (thảo luận trừu tượng)", "△ Chỉ câu mở", "Hard to say. I'd guess… — phần lập luận phải là câu đủ"],
          ["Lược chủ ngữ nhưng giữ be / have", "✘ Luôn sai", "~~Is very difficult.~~ ~~Am not sure.~~ ~~Have never been.~~"],
          ["Lược ở mọi câu", "✘ Nghe cộc lốc", "Sau câu lược phải có câu đủ để mở rộng"],
          ["Writing Task 1 / Task 2", "✘ Không bao giờ", "Đây là ngữ pháp của lời nói"],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở lược đầu câu",
        items: [
          "Tiếng Việt bỏ chủ ngữ rất tự do (“Khó lắm.” “Chưa đi bao giờ.”). Dịch thẳng thành ~~Is very difficult.~~ ~~Not yet go.~~ là lỗi ngữ pháp, không phải ellipsis. Tiếng Anh chỉ lược theo **khuôn**: (It's) Hard to say. · (I've) Never been.",
          "Động từ sau khi lược vẫn giữ **đúng dạng** như khi còn chủ ngữ: (It) **Depends**. — không nói ~~Depend.~~; (It) **Sounds** great. — không nói ~~Sound great.~~",
          "Trả lời MỘT cụm lược rồi im là band 5. Khuôn band 8: **cụm lược + câu mở rộng** — “Not often, to be honest. I used to bake every weekend, but these days I barely have time to boil an egg.”",
          "Trợ động từ **phủ định rút gọn** đứng đầu thì được, vì người nghe hiểu ngay chủ ngữ là I: **Don't know.** · **Can't say.** · **Haven't tried.** Nhưng chỉ với I: ~~Doesn't know.~~ (bỏ he) thì không ai biết đang nói về ai. Dạng khẳng định thì không: ~~Have never been.~~ → Never been.",
        ],
      },
      { t: "rule", formula: "(I / It / That) + V…  ·  (I'm / It's / I've) + phần còn lại  →  rồi nói 1–2 câu đầy đủ", vi: "Bỏ cả cụm đầu hoặc không bỏ gì. Chỉ ở câu mở; không trong bài viết." },
      {
        t: "quiz", id: "t5d11-luoc-dau-dich", title: "Dịch sang tiếng Anh — câu đầu dùng dạng lược (4 câu)", kind: "translate",
        grammar: "(I / It) + V… · (I'm / It's / I've) lược cả cụm",
        items: [
          { q: "1. Chưa đến bao giờ, thật ra. Nhưng tôi rất muốn đi.", answers: ["Never been, actually. But I'd love to go.", "Never been, actually, but I'd love to go.", "Never been there, actually. But I'd love to go.", "Never been, actually. But I would love to go."], hint: "Never been · I'd love to" },
          { q: "2. Còn tuỳ thời tiết. Nếu trời nắng thì tôi đi bộ.", answers: ["Depends on the weather. If it's sunny, I walk.", "Depends on the weather. If it is sunny, I walk.", "Depends on the weather. If it's sunny, I'll walk."], hint: "Depends on · If it's sunny" },
          { q: "3. Khó nói lắm. Có lẽ là giáo viên dạy toán của tôi.", answers: ["Hard to say. Probably my maths teacher.", "Hard to say. Probably my math teacher.", "Hard to say. It's probably my maths teacher."], hint: "Hard to say · Probably" },
          { q: "4. Không chắc nữa. Tôi chưa bao giờ nghĩ về chuyện đó.", answers: ["Not sure. I've never thought about it.", "Not sure. I have never thought about it.", "Not sure, actually. I've never thought about it.", "Not sure. I've never really thought about it."], hint: "Not sure · I've never thought" },
        ],
      },

      { t: "h", text: "3. Lược giữa và cuối câu — sau wh-, sau modal hoàn thành, sau to" },
      { t: "p", text: "Tập 4 Ngày 23 đã dạy lược sau trợ động từ đơn (…than I **do** · …but I **can't**) và sau **to** (I'd love **to**). Ba kiểu dưới đây khó hơn một bậc, và là chỗ band 7 hay nói thừa hoặc nói sai thì." },
      {
        t: "patterns", rows: [
          { formula: "S + V…, but / and + S + V + who / what / why / where / when / how", vi: "Lược cả mệnh đề sau từ hỏi. Chỉ giữ lại từ hỏi — không thêm is / was / did.", examples: [
            { en: "Somebody recommended it to me — I can't remember who.", vi: "Có người giới thiệu cho tôi — tôi không nhớ là ai." },
            { en: "They changed the timetable last month, and nobody has explained why.", vi: "Tháng trước họ đổi thời khoá biểu, và chưa ai giải thích vì sao." },
            { en: "I knew I'd seen her somewhere, but I couldn't work out where.", vi: "Tôi biết đã gặp cô ấy ở đâu đó, nhưng không nghĩ ra ở đâu." },
          ] },
          { formula: "S + should / could / might / would / must + have (+ been)", vi: "Việc ở QUÁ KHỨ ⇒ giữ have (và been nếu động từ gốc là be / bị động). Lược phần V3 trở đi.", examples: [
            { en: "I didn't take a gap year. Looking back, I probably should have.", vi: "Tôi đã không nghỉ một năm. Nghĩ lại thì có lẽ nên làm thế." },
            { en: "Was it worth the money? — It might have been, if I'd finished the course.", vi: "Có đáng tiền không? — Có thể đáng, nếu tôi học hết khoá." },
            { en: "He says he wasn't told, but he must have been.", vi: "Anh ấy nói không ai báo, nhưng hẳn là đã được báo." },
          ] },
          { formula: "S + meant / used / ought / tried / want + to   ·   S + would rather not   ·   S + V + not to", vi: "Giữ to, bỏ động từ. Phủ định: not to. Sau would rather KHÔNG có to.", examples: [
            { en: "I always meant to learn the piano, but I never got round to it.", vi: "Tôi vẫn định học piano, nhưng chưa bao giờ sắp xếp được." },
            { en: "They asked me to give a speech. I'd rather not, frankly.", vi: "Họ bảo tôi phát biểu. Nói thật là tôi không muốn." },
            { en: "I could have complained, but I decided not to.", vi: "Tôi đã có thể khiếu nại, nhưng quyết định là không." },
          ] },
          { formula: "few / little + N, if any, …   ·   seldom / rarely, if ever, …   ·   If so, … / If not, …", vi: "Mệnh đề if lược còn hai từ. Chèn giữa hai dấu phẩy (khi nói: hai quãng ngắt ngắn).", examples: [
            { en: "Very few people, if any, read the terms before they click “agree”.", vi: "Rất ít người, nếu có, đọc điều khoản trước khi bấm đồng ý." },
            { en: "My grandfather rarely, if ever, raised his voice.", vi: "Ông tôi hiếm khi, nếu không nói là chưa bao giờ, to tiếng." },
            { en: "Is the course accredited? If not, I wouldn't bother.", vi: "Khoá học có được công nhận không? Nếu không thì tôi chẳng bận tâm." },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — bốn lỗi khi lược giữa câu",
        items: [
          "**Sai thì:** ~~I didn't revise, but I should.~~ → …but I **should have**. “I should” = bây giờ / sắp tới nên làm; “I should have” = lẽ ra đã nên làm.",
          "**Thừa động từ sau wh-:** ~~I can't remember who was.~~ ~~Nobody told us why is.~~ → …who. · …why.",
          "**Thừa to sau would rather / had better:** ~~I'd rather not to.~~ → I'd rather **not**. Nhưng: I decided **not to**. · I'd prefer **not to**.",
          "**if any / if ever** chỉ đi với từ mang nghĩa ít / hiếm (few, little, hardly any, seldom, rarely). ~~Many people, if any, …~~ là vô nghĩa.",
        ],
      },
      { t: "rule", formula: "…V + who / why / where  ·  should / might / must + have (+ been)  ·  meant to / not to  ·  few…, if any,  ·  rarely, if ever,", vi: "Giữ đúng một “cái móc” (từ hỏi, have, to, if any) rồi dừng. Việc quá khứ thì móc phải có have." },
      {
        t: "quiz", id: "t5d11-luoc-giua", title: "Điền MỘT từ để hoàn thành câu lược (7 câu)", kind: "fill",
        items: [
          { q: "1. Somebody left a laptop in the lab last night, but nobody knows ___ .", answers: ["who"] },
          { q: "2. “Did you apply for the exchange programme?” — “I meant ___ , but the deadline passed.”", answers: ["to"] },
          { q: "3. I didn't keep a copy of the contract. Looking back, I really should ___ .", answers: ["have"] },
          { q: "4. Very few first-year students, if ___ , finish the whole reading list.", answers: ["any"] },
          { q: "5. They moved the bus stop two weeks ago, and no one has told us ___ .", answers: ["why"] },
          { q: "6. “Was the trip worth it?” — “It might have ___ , if it hadn't rained every day.”", answers: ["been"] },
          { q: "7. My manager seldom, if ___ , replies on the same day.", answers: ["ever"] },
        ],
      },
      {
        t: "quiz", id: "t5d11-luoc-giua-dich", title: "Dịch sang tiếng Anh — lược phần đã rõ (4 câu)", kind: "translate",
        grammar: "…V + who / why · wish + S + had · I'd rather not · few…, if any,",
        items: [
          { q: "1. Có người gợi ý quyển sách đó cho tôi — tôi không nhớ là ai.", answers: ["Someone recommended that book to me — I can't remember who.", "Somebody recommended that book to me — I can't remember who.", "Someone recommended that book to me, but I can't remember who.", "Someone recommended that book to me. I can't remember who."], hint: "recommended · can't remember who" },
          { q: "2. Hồi nhỏ tôi không học bơi, và giờ tôi ước là mình đã học.", answers: ["I didn't learn to swim as a child, and now I wish I had.", "I didn't learn to swim when I was a child, and now I wish I had.", "I didn't learn to swim when I was young, and now I wish I had."], hint: "didn't learn to swim · wish I had" },
          { q: "3. Họ bảo tôi phát biểu, nhưng tôi không muốn.", answers: ["They asked me to give a speech, but I'd rather not.", "They asked me to give a speech, but I would rather not.", "They asked me to give a speech, but I didn't want to."], hint: "asked me to · I'd rather not" },
          { q: "4. Rất ít người, nếu có, đọc hết các điều khoản.", answers: ["Very few people, if any, read all the terms.", "Very few people, if any, read all of the terms.", "Very few people, if any, read the terms in full."], hint: "Very few people, if any," },
        ],
      },

      { t: "h", text: "4. Thay từ và ngôn ngữ ước chừng — do so, one, that sort of thing, -ish" },
      { t: "p", text: "**Substitution** (phép thế) = thay phần vừa nói bằng một từ ngắn. Tập 4 Ngày 13 đã dạy this / such trong bài viết, Ngày 23 dạy I hope so / I hope not. Hôm nay thêm ba từ thế còn lại và **ngôn ngữ ước chừng** (vague language) — thứ người bản ngữ dùng liên tục, còn người học thì hoặc không dùng, hoặc chỉ biết “and so on”." },
      {
        t: "table", head: ["Công cụ", "Thay cho", "Ví dụ", "Lưu ý"],
        rows: [
          ["**do so**", "một hành động vừa nêu (trang trọng vừa phải)", "People are told to save more, but few actually **do so**.", "Hợp Part 3 và cả bài viết. Không dùng cho trạng thái: ~~I like it and she does so.~~"],
          ["**do that / do it**", "một hành động cụ thể", "I could move abroad, but I'd never **do that** to my parents.", "do that = nhấn; do it = việc đã xác định rõ"],
          ["**one / ones**", "danh từ đếm được", "The old library was cramped; the new **one** is twice the size.", "Không dùng với danh từ không đếm được: ~~some advice… a good one~~"],
          ["**the same**", "cả một nhận xét", "My brother hates crowds, and I'm **the same**.", "= I hate crowds too"],
          ["**…and that sort of thing · and so on**", "phần còn lại của danh sách", "We talked about rent, bills **and that sort of thing**.", "Sau ÍT NHẤT hai ví dụ cụ thể"],
          ["**…or something (like that)**", "một khả năng tương tự", "He's a consultant **or something like that**.", "Khi không chắc chi tiết"],
          ["**số + or so · -ish · give or take**", "con số gần đúng", "an hour **or so** · around seven**ish** · forty people, **give or take**", "-ish chỉ khi nói"],
          ["**sort of / kind of + adj / V**", "làm mềm một từ chưa thật khớp", "It's **sort of** a hobby and a job at the same time.", "Tối đa 1 lần / câu trả lời"],
        ],
      },
      {
        t: "note", title: "⚠️ “Ước chừng” không phải là “thiếu từ”",
        items: [
          "Band 8 yêu cầu “diễn đạt nghĩa chính xác”. Ngôn ngữ ước chừng vẫn chính xác — nó nói đúng rằng **bạn không cần / không biết con số tròn**. “An hour or so” chính xác hơn một con số bịa.",
          "Nhưng nó chỉ đứng SAU nội dung cụ thể. ~~I like sports and so on.~~ (chưa có gì để “so on”) → I like racket sports — badminton, squash **and that sort of thing**.",
          "Lỗi dạng hay gặp: ~~and so on, etc.~~ (thừa) · ~~such kind of things~~ → that kind of thing · ~~or something like this~~ → or something like **that** · ~~sevenish o'clock~~ → seven**ish**.",
          "Đừng kết MỌI câu bằng “and so on” hoặc “or something”: một câu trả lời một lần là đủ; ba lần thì nghe như không biết mình nói gì.",
        ],
      },
      { t: "rule", formula: "S + V…, but few + do so  ·  adj + one(s)  ·  N, N + and that sort of thing  ·  số + or so / -ish", vi: "Thay phần lặp bằng một từ; ước chừng sau khi đã nói cái cụ thể." },
      {
        t: "mcq", id: "t5d11-thay-tu", title: "Thay từ và ước chừng — chọn phương án đúng (5 câu)",
        items: [
          { q: "1. Universities are encouraged to publish their graduate salaries, and most already ___.", options: ["do so", "do it so", "make so"], correct: 0, why: "do so thay cho “publish their graduate salaries”. Hai phương án kia không tồn tại." },
          { q: "2. My first phone lasted six years; the ___ I've got now barely lasted two.", options: ["it", "one", "ones"], correct: 1, why: "the one = the phone. “it” không đứng sau the; “ones” là số nhiều." },
          { q: "3. In the first week we covered timetables, deadlines, library cards ___.", options: ["and such kind of things", "and so on things", "and that sort of thing"], correct: 2, why: "Cụm cố định: and that sort / kind of thing (thing số ít). Đứng sau ba ví dụ cụ thể nên dùng đúng chỗ." },
          { q: "4. The whole renovation took three months, give or ___ a week.", options: ["get", "take", "make"], correct: 1, why: "give or take + khoảng chênh = xê xích chừng đó." },
          { q: "5. Câu nào dùng ĐÚNG?", options: ["She gave me some advice, and it was a good one.", "My sister loves long walks, and I'm the same.", "I like music and so on."], correct: 1, why: "the same thay cả nhận xét. advice không đếm được nên không dùng one. “music and so on” chưa có danh sách để tiếp." },
        ],
      },

      { t: "h", text: "5. Câu phức nói tự nhiên — giới từ cuối câu, mệnh đề bình luận, not that" },
      { t: "p", text: "Band 8 vẫn cần câu phức. Khác biệt là **loại** câu phức: bài viết dùng mệnh đề quan hệ đủ đại từ, danh hoá, phân từ; lời nói dùng những khung dưới đây. Dùng nhầm khung viết khi nói thì nghe cứng; dùng khung nói trong bài viết thì mất điểm register." },
      {
        t: "patterns", rows: [
          { formula: "N + (that) + S + V + giới từ", vi: "Mệnh đề quan hệ kiểu nói: bỏ đại từ, giới từ về cuối. (Viết trang trọng: with whom / about which.)", examples: [
            { en: "It's something I'd never really thought about.", vi: "Đó là chuyện tôi chưa từng nghĩ tới." },
            { en: "The flatmates I ended up with turned out to be great.", vi: "Mấy bạn cùng nhà mà rốt cuộc tôi ở chung hoá ra rất ổn." },
          ] },
          { formula: "From what I've seen / As far as I can tell / If I'm honest / As it happens / Come to think of it, + S + V", vi: "Mệnh đề bình luận: nói rõ ý này dựa trên gì hoặc chắc tới đâu. Đứng đầu, giữa hoặc cuối câu.", examples: [
            { en: "From what I've seen, most people learn faster in pairs.", vi: "Theo những gì tôi thấy, đa số học nhanh hơn khi học đôi." },
            { en: "My cousin, as it happens, works for the same company.", vi: "Tình cờ là anh họ tôi cũng làm ở công ty đó." },
            { en: "It was cheaper back then, come to think of it.", vi: "Nghĩ lại thì hồi đó rẻ hơn." },
          ] },
          { formula: "S + V — not that + S + V", vi: "Chặn trước một suy diễn sai mà người nghe có thể rút ra từ câu vừa nói.", examples: [
            { en: "I rarely go to the cinema — not that I don't like films.", vi: "Tôi hiếm khi đi xem phim — không phải là tôi không thích phim." },
            { en: "She got the job on her first try, not that anyone was surprised.", vi: "Cô ấy được nhận ngay lần đầu — mà cũng chẳng ai ngạc nhiên." },
          ] },
          { formula: "Suppose / Supposing / Say + S + V-ed, would + S + V?   ·   If it weren't for / hadn't been for + N, S + would (have)…", vi: "Giả định kiểu nói: mở bằng Suppose / Say thay cho If; “nếu không nhờ / không vì”.", examples: [
            { en: "Say you had an extra day off every week — what would you actually do with it?", vi: "Cứ cho là mỗi tuần bạn có thêm một ngày nghỉ — bạn sẽ làm gì với nó?" },
            { en: "If it hadn't been for the scholarship, I wouldn't have gone to university at all.", vi: "Nếu không nhờ học bổng thì tôi đã chẳng học đại học." },
          ] },
        ],
      },
      {
        t: "table", head: ["Ý", "Kiểu VIẾT (Task 2)", "Kiểu NÓI (Part 3)"],
        rows: [
          ["Người tôi làm cùng", "the colleagues with whom I work", "the people I work with"],
          ["Dựa trên quan sát", "Evidence suggests that…", "From what I've seen, …"],
          ["Chặn suy diễn sai", "This is not to suggest that…", "…— not that I'm complaining."],
          ["Giả định", "Were tuition to be abolished, …", "Say they scrapped tuition fees, …"],
          ["Nhờ / tại", "Without this support, …", "If it weren't for my parents, …"],
        ],
      },
      {
        t: "note", title: "⚠️ Hai lỗi band 7 ở các khung này",
        items: [
          "**Lặp tân ngữ sau giới từ cuối câu:** ~~the people I work with them~~ · ~~something I'd never thought about it~~. Giới từ đứng cuối là hết — tân ngữ đã ở đầu mệnh đề.",
          "**Thì sau Suppose / Say / If it weren't for:** giả định về hiện tại ⇒ quá khứ đơn (Say you **had**…), về quá khứ ⇒ quá khứ hoàn thành (If it **hadn't been** for…). ~~Suppose you will have…~~ là sai.",
        ],
      },
      { t: "rule", formula: "N + S + V + giới từ  ·  From what I've seen, S + V  ·  S + V — not that + S + V  ·  Say + S + V-ed, would…?", vi: "Bốn khung câu phức của lời nói. Khung viết tương ứng để dành cho Task 2." },
      {
        t: "quiz", id: "t5d11-cau-phuc-dich", title: "Dịch sang tiếng Anh — câu phức kiểu nói (5 câu)", kind: "translate",
        grammar: "N + S + V + giới từ · From what I've seen · not that · Suppose + S + V-ed · If it hadn't been for",
        items: [
          { q: "1. Đó là chuyện tôi chưa từng nghĩ tới.", answers: ["That's something I'd never thought about.", "That's something I had never thought about.", "It's something I'd never thought about.", "That's something I've never thought about.", "It's something I've never thought about."], hint: "something · thought about" },
          { q: "2. Theo những gì tôi thấy, hầu hết sinh viên thích học theo nhóm hơn.", answers: ["From what I've seen, most students prefer studying in groups.", "From what I've seen, most students prefer to study in groups.", "From what I have seen, most students prefer studying in groups."], hint: "From what I've seen · prefer" },
          { q: "3. Tôi hiếm khi đi xem phim — không phải là tôi không thích phim.", answers: ["I rarely go to the cinema — not that I don't like films.", "I rarely go to the cinema, not that I don't like films.", "I rarely go to the cinema — not that I don't like movies.", "I rarely go to the movies — not that I don't like films."], hint: "rarely · not that I don't" },
          { q: "4. Giả sử bạn có thêm một ngày nghỉ mỗi tuần, bạn sẽ làm gì?", answers: ["Suppose you had an extra day off every week, what would you do?", "Supposing you had an extra day off every week, what would you do?", "Say you had an extra day off every week, what would you do?", "Suppose you had an extra day off each week, what would you do?"], hint: "Suppose you had · what would you do" },
          { q: "5. Nếu không nhờ học bổng thì tôi đã không học đại học.", answers: ["If it hadn't been for the scholarship, I wouldn't have gone to university.", "If it had not been for the scholarship, I would not have gone to university.", "If it hadn't been for the scholarship, I wouldn't have gone to college."], hint: "If it hadn't been for · wouldn't have gone" },
        ],
      },

      { t: "h", text: "6. Modal quá khứ để rào đón khi nói — I'd have thought, you'd think, I wouldn't say" },
      { t: "p", text: "Tập 4 Ngày 13 và Tập 5 Ngày 6 đã dạy hedging (may, tend to, it seems). Khi NÓI, người bản ngữ rào đón bằng một nhóm khung có **would + have**. Chúng lịch sự hơn “I disagree” và cho thấy bạn điều khiển được modal hoàn thành — đúng loại cấu trúc giám khảo chờ ở band 8." },
      {
        t: "patterns", rows: [
          { formula: "I'd have thought (that) + S + would + V / V-ed", vi: "“Tôi cứ tưởng là…” — nêu kỳ vọng của mình, ngầm nói thực tế khác đi hoặc mình chưa bị thuyết phục.", examples: [
            { en: "I'd have thought a city this size would have a decent bus service.", vi: "Tôi cứ nghĩ thành phố cỡ này phải có xe buýt tử tế chứ." },
            { en: "I'd have thought that was obvious, but apparently not.", vi: "Tôi tưởng điều đó hiển nhiên, mà hoá ra không." },
          ] },
          { formula: "You'd think (that) + S + would + V, but + S + V", vi: "“Ai cũng sẽ nghĩ là… nhưng” — nêu điều hợp lý rồi lật lại bằng thực tế. Khung hai nhịp rất hợp Part 3.", examples: [
            { en: "You'd think people would save more as they earn more, but they don't.", vi: "Ai cũng nghĩ kiếm nhiều thì tiết kiệm nhiều hơn, nhưng không phải vậy." },
          ] },
          { formula: "I wouldn't say (that) + S + V   ·   I wouldn't have said + S + V-ed", vi: "Phản đối nhẹ một nhận định (của giám khảo hoặc của số đông).", examples: [
            { en: "It's popular, but I wouldn't say it's good.", vi: "Nó phổ biến, nhưng tôi không cho là nó hay." },
            { en: "I wouldn't have said he was shy — quiet, maybe.", vi: "Tôi sẽ không bảo anh ấy nhút nhát — ít nói thì có." },
          ] },
          { formula: "I couldn't tell you + wh- / exactly   ·   S + must have / can't have / may well have + V3", vi: "Nhận là không biết chính xác; suy đoán về quá khứ (so sánh xưa – nay ở Part 3).", examples: [
            { en: "I couldn't tell you exactly how many — a few thousand, I'd guess.", vi: "Tôi không nói chính xác được bao nhiêu — vài nghìn, tôi đoán vậy." },
            { en: "Life must have been slower then: nobody can have been checking email at midnight.", vi: "Cuộc sống hồi đó hẳn chậm hơn: chẳng ai có thể ngồi xem email lúc nửa đêm." },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Ba chỗ dễ trượt",
        items: [
          "**I'd have thought** = I **would** have thought (không phải I had). Sau nó là **would + V** hoặc quá khứ: ~~I'd have thought the bus will come.~~ → …would come.",
          "**can't have + V3** (chắc chắn không) đối với **must have + V3** (chắc chắn có). Không có ~~mustn't have~~ với nghĩa suy đoán.",
          "Đừng mở MỌI câu Part 3 bằng “You'd think…”. Mỗi lượt Part 3 (4–5 câu hỏi) dùng mỗi khung một lần.",
        ],
      },
      { t: "rule", formula: "I'd have thought + S + would + V  ·  You'd think + S + would + V, but…  ·  I wouldn't say + S + V  ·  S + must have / can't have + V3", vi: "would + have để nêu kỳ vọng và phản đối nhẹ; must / can't + have để đoán về quá khứ." },
      {
        t: "quiz", id: "t5d11-modal-dien", title: "Điền MỘT từ (6 câu)", kind: "fill",
        items: [
          { q: "1. I'd have ___ a university this big would have more than one printer per floor.", answers: ["thought"] },
          { q: "2. You'd ___ that with all these apps people would be better organised — but no.", answers: ["think"] },
          { q: "3. The film made a lot of money, but I wouldn't ___ it was a good film.", answers: ["say"] },
          { q: "4. The streets were empty by nine. People ___ have gone to bed much earlier in those days.", answers: ["must"] },
          { q: "5. “How many people live there?” — “I couldn't ___ you exactly. Forty thousand or so.”", answers: ["tell"] },
          { q: "6. He can't ___ walked all the way: it's forty kilometres.", answers: ["have"] },
        ],
      },
      {
        t: "quiz", id: "t5d11-modal-dich", title: "Dịch sang tiếng Anh — rào đón bằng would / must + have (4 câu)", kind: "translate",
        grammar: "I'd have thought · You'd think…, but · I wouldn't say · must have + V3",
        items: [
          { q: "1. Tôi cứ nghĩ là học trực tuyến sẽ rẻ hơn chứ.", answers: ["I'd have thought online courses would be cheaper.", "I would have thought online courses would be cheaper.", "I'd have thought studying online would be cheaper.", "I'd have thought online learning would be cheaper."], hint: "I'd have thought · would be cheaper" },
          { q: "2. Ai cũng nghĩ điện thoại sẽ giúp ta tiết kiệm thời gian, nhưng không phải vậy.", answers: ["You'd think phones would save us time, but they don't.", "You would think phones would save us time, but they don't.", "You'd think that phones would save us time, but they don't.", "You'd think phones would save us time, but they do not."], hint: "You'd think · would save us time · but they don't" },
          { q: "3. Tôi không cho rằng người trẻ lười hơn.", answers: ["I wouldn't say young people are lazier.", "I wouldn't say that young people are lazier.", "I would not say young people are lazier."], hint: "I wouldn't say · lazier" },
          { q: "4. Thế hệ ông bà tôi hẳn đã làm việc vất vả hơn nhiều.", answers: ["My grandparents' generation must have worked much harder.", "My grandparents' generation must have worked a lot harder.", "My grandparents' generation must have worked far harder."], hint: "must have worked · much harder" },
        ],
      },

      { t: "h", text: "7. Đưa ra trước và nói lại cho rõ — fronting khi nói, or rather, put it this way" },
      { t: "p", text: "**Fronting khi nói** khác fronting trang trọng của Tập 4 Ngày 27 (Rarely have we seen…). Ở đây không có đảo ngữ: bạn chỉ **kéo phần đang bàn lên đầu**, ngắt một nhịp, rồi nói phần còn lại theo trật tự thường. Nó cho thấy bạn đang trả lời đúng vào chữ của câu hỏi." },
      {
        t: "patterns", rows: [
          { formula: "That / This + S + V   ·   Wh- / Whether + S + V, + S + V (trật tự thường)", vi: "Tân ngữ hoặc mệnh đề wh- lên đầu; phần sau KHÔNG đảo.", examples: [
            { en: "That I couldn't tell you.", vi: "Cái đó thì tôi chịu, không nói được." },
            { en: "Why people queue for two hours to get in, I have no idea.", vi: "Vì sao người ta xếp hàng hai tiếng để vào thì tôi chịu." },
            { en: "Whether it'll last, I'm not so sure.", vi: "Còn nó có bền không thì tôi không chắc lắm." },
          ] },
          { formula: "S + V…, or rather, + (phần nói lại)   ·   I mean, + S + V", vi: "Tự sửa có đánh dấu: báo cho người nghe biết mình đang nói lại cho đúng hơn.", examples: [
            { en: "It's cheap — or rather, it's cheaper than the alternatives.", vi: "Nó rẻ — hay đúng hơn là rẻ hơn các lựa chọn khác." },
            { en: "He's my boss. I mean, he was until last month.", vi: "Ông ấy là sếp tôi. Ý tôi là cho tới tháng trước." },
          ] },
          { formula: "Put it this way: + S + V   ·   What I'm getting at is (that) + S + V   ·   …, if that makes sense.", vi: "Nói lại cả ý bằng cách khác khi thấy câu trước chưa rõ; kiểm xem người nghe theo kịp không.", examples: [
            { en: "Put it this way: I wouldn't do it again.", vi: "Nói thế này cho dễ: tôi sẽ không làm lại lần nữa." },
            { en: "What I'm getting at is that the rule punishes the wrong people.", vi: "Ý tôi muốn nói là quy định ấy phạt nhầm người." },
            { en: "It's less about the money and more about the status, if that makes sense.", vi: "Vấn đề không hẳn là tiền mà là địa vị, không biết nói vậy có rõ không." },
          ] },
        ],
      },
      {
        t: "table", head: ["Khi nói hỏng một câu", "Band 6", "Band 8"],
        rows: [
          ["Chọn sai từ", "It's cheap… uh… no… sorry… it's… (im 3 giây)", "It's cheap — **or rather**, it's cheaper than the alternatives."],
          ["Câu quá rối", "Bỏ dở, bắt đầu lại nguyên câu", "**Put it this way:** + một câu ngắn nói đúng ý đó"],
          ["Sợ người nghe chưa hiểu", "Do you understand?", "…, **if that makes sense**."],
          ["Sai thì / sai số", "Sửa nhiều lần, xin lỗi", "They was… they **were** all there. (sửa một lần, không xin lỗi)"],
        ],
      },
      { t: "rule", formula: "That + S + V  ·  Wh- + S + V, + S + V  ·  …, or rather, …  ·  Put it this way: S + V  ·  …, if that makes sense.", vi: "Kéo chủ đề lên đầu không đảo ngữ; sửa lời một lần, có đánh dấu, rồi đi tiếp." },
      {
        t: "mcq", id: "t5d11-dua-truoc", title: "Fronting và nói lại — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. Câu nào đúng?", options: ["Why they do it, I've no idea.", "Why do they do it, I've no idea.", "Why they do it, have I no idea."], correct: 0, why: "Mệnh đề wh- lên đầu giữ trật tự trần thuật (they do), mệnh đề chính không đảo." },
          { q: "2. The flat is in the centre — ___, it's a ten-minute walk from the centre.", options: ["or better", "or rather", "or instead"], correct: 1, why: "or rather = hay nói đúng hơn. Hai cụm kia không dùng để tự sửa." },
          { q: "3. ___: if they offered me the same job tomorrow, I'd say no.", options: ["Put it this way", "Put this way it", "Say it this way out"], correct: 0, why: "Cụm cố định Put it this way (+ dấu hai chấm khi viết, một quãng ngừng khi nói)." },
          { q: "4. It's not exactly a rule, more a habit everyone follows, if that makes ___.", options: ["meaning", "reason", "sense"], correct: 2, why: "if that makes sense — kiểm xem người nghe có theo kịp không." },
        ],
      },

      { t: "h", text: "8. Áp dụng — một câu Part 3, hai câu trả lời" },
      { t: "p", text: "**Câu hỏi:** Why do some people find it hard to change their daily habits? Hai câu trả lời có **cùng ý** (thói quen lâu năm; ví dụ ông bố uống cà phê). Đọc to cả hai, bấm giờ: bản band 8 dài hơn khoảng 10 giây nhưng không có câu nào dài hơn 25 từ." },
      {
        t: "dialogue", title: "Bản band 7 (ước tính) — 93 từ",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do some people find it hard to change their daily habits?", vi: "Vì sao một số người thấy khó thay đổi thói quen hằng ngày?" },
          { who: "Candidate", role: "candidate", text: "I think there are several reasons why people find it difficult to change their habits. Firstly, habits are things which people have done for many years, so it is very difficult to stop them. Secondly, people are very busy, and they do not have enough time to think about what they are doing. For example, my father has drunk coffee every morning for thirty years. The doctor told him that he should stop, but he did not stop. So I think changing habits is very hard for most people.", vi: "Tôi nghĩ có vài lý do… Thứ nhất… Thứ hai… Ví dụ bố tôi uống cà phê mỗi sáng suốt ba mươi năm. Bác sĩ bảo nên dừng nhưng ông không dừng. Vì vậy tôi nghĩ đổi thói quen rất khó với đa số." },
        ],
      },
      {
        t: "dialogue", title: "Bản band 8 (ước tính) — 124 từ",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do some people find it hard to change their daily habits?", vi: "Vì sao một số người thấy khó thay đổi thói quen hằng ngày?" },
          { who: "Candidate", role: "candidate", text: "Mostly because habits don't feel like decisions, I'd say. You don't choose to check your phone the moment you wake up — you just do. So when someone tells you to stop, there's nothing obvious to stop, if that makes sense. My dad's a good example. His doctor told him to cut down on coffee years ago, and he meant to, but he never quite got round to it — not that he didn't believe her. You'd think a warning like that would be enough, but apparently it isn't. What does seem to work, from what I've seen, is swapping one habit for another rather than just dropping it. Whether that lasts, I couldn't tell you.", vi: "Chủ yếu là vì thói quen không giống một quyết định, tôi nghĩ vậy. Bạn không chọn việc xem điện thoại ngay khi thức dậy — bạn cứ thế làm. Nên khi ai đó bảo dừng, chẳng có gì rõ ràng để mà dừng, không biết nói vậy có rõ không. Bố tôi là ví dụ. Bác sĩ bảo ông giảm cà phê từ nhiều năm trước, ông cũng định thế, nhưng chưa bao giờ làm được — không phải là ông không tin bác sĩ. Ai cũng nghĩ lời cảnh báo như vậy là đủ, nhưng hoá ra không. Theo những gì tôi thấy, cách có vẻ hiệu quả là đổi thói quen này lấy thói quen khác thay vì chỉ bỏ. Còn có bền không thì tôi chịu." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Bản band 7", "Bản band 8", "Bài học"],
        rows: [
          ["Fluency & Coherence", "Firstly / Secondly / For example / So — khung bài viết", "Ý nối bằng nghĩa: So when… · My dad's a good example. · What does seem to work…", "Bỏ từ nối đánh số khi nói; để ý sau trả lời ý trước"],
          ["Lexical Resource", "difficult ×2 · hard · stop ×3", "feel like decisions · cut down on · got round to it · swapping… dropping", "Cụm động từ đời thường dùng đúng là “less common” của lời nói"],
          ["Grammar", "Câu đủ, đúng, cùng một kiểu (S + V + because / so)", "Lược: you just do · he meant to · Fronting: Whether that lasts, … · not that · You'd think…, but · do nhấn mạnh (Tập 4 Ngày 23)", "6 kiểu cấu trúc trong 124 từ, không câu nào quá 25 từ"],
          ["Pronunciation", "Dễ đọc đều giọng vì câu dài bằng nhau", "Câu ngắn – dài xen kẽ tạo nhịp; “just DO”, “meant TO” mang trọng âm", "Từ đứng lại sau khi lược luôn được nhấn"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo đúng liều — nâng một câu trả lời từ 7 lên 8",
        items: [
          "Ghi âm một câu trả lời Part 3 của bạn, chép ra giấy. Gạch dưới mọi chỗ **lặp lại** nguyên một cụm động từ — đó là chỗ lược được (mục 3) hoặc thay được (mục 4).",
          "Thêm **đúng hai** khung của mục 5–7 vào câu trả lời đó. Không phải sáu. Bản band 8 ở trên dày đặc để làm mẫu; trong phòng thi, 2–3 khung mỗi câu trả lời là đủ “range”.",
          "Nói lại bản mới ba lần cho tới khi không phải nhìn giấy. Cấu trúc chỉ tính điểm khi nó ra khỏi miệng mà không có quãng ngừng trước nó.",
        ],
      },

      { t: "h", text: "9. Kiểm tra cuối bài (14 câu)" },
      {
        t: "mcq", id: "t5d11-np-chon", title: "Chọn phương án đúng (8 câu)",
        items: [
          { q: "1. “Did you enjoy the course?” — “___”", options: ["Loved it. Best thing I did all year.", "Was loved it. Is best thing.", "Am loved it, best thing."], correct: 0, why: "(I) Loved it. (It was the) Best thing… — lược cả cụm đầu. Không để was / is / am đứng trơ." },
          { q: "2. I haven't read the safety guidelines yet, though I know I ___.", options: ["ought have", "ought to have", "ought to had"], correct: 1, why: "ought to have (read them): giữ to + have, lược V3." },
          { q: "3. Something changed in my second year, though I couldn't say exactly ___.", options: ["what", "what was", "that"], correct: 0, why: "Lược sau wh-: …say exactly what (changed)." },
          { q: "4. She's the lecturer ___.", options: ["from who I learnt the most", "which I learnt the most from", "I learnt the most from"], correct: 2, why: "Kiểu nói: bỏ đại từ quan hệ, giới từ ở cuối. “from who” sai (from whom); which không dùng cho người." },
          { q: "5. He's thirty___, I'd guess — he mentioned finishing university about ten years ago.", options: ["-ish", "-like", "-wise"], correct: 0, why: "Số + -ish = khoảng chừng (chỉ khi nói)." },
          { q: "6. Suppose the government ___ all tuition fees tomorrow — would more people apply?", options: ["scraps", "would scrap", "scrapped"], correct: 2, why: "Suppose + quá khứ đơn cho giả định về hiện tại / tương lai." },
          { q: "7. You'd think that with so many delivery apps, people ___ less time on food — but they don't.", options: ["would spend", "will spend", "are spending"], correct: 0, why: "You'd think + S + would + V, but…" },
          { q: "8. Câu trả lời Part 3 nào SAI ngữ pháp?", options: ["Depends. In big cities, I'd say yes; in the countryside, less so.", "Is depending on city. Is yes in big city.", "Hard to say, really — it varies a lot from place to place."], correct: 1, why: "Bỏ chủ ngữ mà để is đứng trơ là lỗi. (It) Depends. và (It's) Hard to say. lược cả cụm nên đúng." },
        ],
      },
      {
        t: "quiz", id: "t5d11-np-dien", title: "Điền MỘT từ (6 câu)", kind: "fill",
        items: [
          { q: "1. I never learnt to drive. I always meant ___ , but there was never time.", answers: ["to"] },
          { q: "2. Few graduates, if ___ , end up in exactly the job they trained for.", answers: ["any"] },
          { q: "3. They've closed the canteen on Fridays, and nobody's explained ___ .", answers: ["why"] },
          { q: "4. I wouldn't have ___ he was the type to give up, but he did.", answers: ["said", "thought"] },
          { q: "5. It's a kind of market — or ___ , a car park that turns into a market at night.", answers: ["rather"] },
          { q: "6. If it ___ been for my flatmate, I'd have slept through the exam.", answers: ["hadn't"] },
        ],
      },
      {
        t: "note", title: "📌 Mang gì sang các bài sau",
        items: [
          "**Bài 3 hôm nay (Nói):** idiom chỉ nghe tự nhiên khi đứng trong ngữ pháp nói. “It's a mixed bag, to be honest.” hay hơn “I think that it is a mixed bag.”",
          "**Ngày 13:** cleft, đảo ngữ, nhượng bộ trong Task 2 — phiên bản VIẾT của những gì hôm nay bạn nói. Giữ bảng “kiểu viết / kiểu nói” ở mục 5 để không lẫn register.",
          "**Listening:** khi người nói bỏ lửng (“…but I never did.” · “…not sure why.”), đáp án nằm ở câu TRƯỚC đó. Nghe ra phần bị lược là nghe ra đáp án.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d11-doc",
    kind: "reading",
    title: "Đọc: thể loại khó — triết học và kinh tế học, 900 từ trong 15 phút",
    goal: "Đọc một lượt một bài lập luận triết học khoảng 900 từ và làm 15 câu (YES / NO / NOT GIVEN · Multiple choice · Summary có hộp từ) trong 15–17 phút, đúng từ 13 câu: vẽ được bản đồ lập luận “luận điểm → thí nghiệm tưởng tượng → phản bác → đáp lại”, tách được ý của tác giả khỏi ý của người được trích, và không hoảng khi gặp thuật ngữ vì biết bài luôn tự định nghĩa nó.",
    minutes: 85,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Giữ **Reading ở 35+/40** khi Passage 3 rơi vào hai thể loại người học IT ngại nhất: **triết học** và **kinh tế học**. Không cần kiến thức nền — cần biết loại văn bản này được dựng thế nào.",
          "Hai thể loại này không khó ở từ vựng. Chúng khó vì **không có sự kiện để bám**: không năm tháng, không thí nghiệm theo thứ tự, chỉ có luận điểm chồng lên luận điểm.",
          "Công cụ hôm nay: **bản đồ lập luận 4 ô** (ai chủ trương gì → ví dụ / thí nghiệm tưởng tượng → ai phản bác thế nào → ai đáp lại) ghi ở lề trong lúc đọc MỘT lượt.",
          "Khởi động bằng một bài kinh tế ~340 từ (5 phút), rồi bài chính triết học ~900 từ với 15 câu. Nhịp của Tập 5 vẫn là ==15 – 18 – 22 phút==; hôm nay cho phép 17 phút vì là lần đầu gặp thể loại.",
          "Nối lại: Tập 4 Ngày 21 (văn bản kinh tế), Tập 4 Ngày 25 (đọc câu phức Passage 3), Tập 5 Ngày 1 (đọc một lần, ghi dấu ở lề), Tập 5 Ngày 9 (YNNG: ý của ai).",
        ],
      },

      { t: "h", text: "1. Vì sao hai thể loại này làm người band 7 mất 3–4 câu" },
      {
        t: "table", head: ["", "Bài khoa học / lịch sử (quen)", "Bài triết học / kinh tế học (hôm nay)"],
        rows: [
          ["Xương sống của bài", "Thời gian hoặc quy trình: trước → sau", "Lập luận: chủ trương → phản bác → đáp lại"],
          ["Danh từ", "Cụ thể: glacier, sample, engine", "Trừu tượng: doctrine, assumption, intuition, incentive"],
          ["Ví dụ", "Thí nghiệm thật, có số liệu", "**Thí nghiệm tưởng tượng** (Imagine… / Suppose…) hoặc một mô hình"],
          ["Giọng trong bài", "Thường một giọng: tác giả thuật lại", "3–5 giọng: người chủ trương, người phê bình, người bênh, **và tác giả**"],
          ["Thuật ngữ", "Tên vật, tên chất", "Tên học thuyết — luôn được định nghĩa ngay cạnh"],
          ["Câu hỏi hay ra", "TFNG, Note, Diagram", "YNNG, MCQ về mục đích của một đoạn, Summary, Matching người – quan điểm"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba phản xạ sai của người đọc quen văn bản kỹ thuật",
        items: [
          "**Tìm số liệu để bám.** Bài triết học hầu như không có. Thứ để bám là **tên người + động từ thuật** (argued, suggested, questioned, point out) và các từ đổi hướng (But · Perhaps · Besides · That assumption is exactly what…).",
          "**Coi thí nghiệm tưởng tượng là chuyện bên lề rồi đọc lướt.** Nó là dữ kiện DUY NHẤT của bài; 3–4 câu hỏi sẽ hỏi về chi tiết và mục đích của nó. Đọc đoạn đó chậm hơn các đoạn khác.",
          "**Cho rằng tác giả đồng ý với người được nhắc tới nhiều nhất.** Tác giả thường đứng ngoài, cân hai bên, và chỉ lộ ý mình ở vài tính từ / trạng từ đánh giá (ingenious, hardly irrational, It would be rash to…).",
        ],
      },

      { t: "h", text: "2. Bản đồ lập luận — bốn ô ghi ở lề" },
      { t: "p", text: "Trong lúc đọc, cạnh mỗi đoạn ghi **một chữ cái** cho biết đoạn đó làm việc gì. Bốn việc dưới đây phủ gần hết mọi bài triết học và kinh tế học của IELTS. Ghi xong, bạn có một bản đồ 8 ký tự; câu hỏi nào hỏi về “phản bác” thì nhìn thẳng vào đoạn có chữ P." },
      {
        t: "sodo", kind: "flow", title: "Bản đồ lập luận của một bài triết học / kinh tế học",
        steps: [
          { label: "C — Chủ trương", sub: "Ai nói điều gì? Nhằm bác học thuyết nào?" },
          { label: "V — Ví dụ / thí nghiệm tưởng tượng / mô hình", sub: "Imagine… · Suppose… · Consider… · Take the case of…" },
          { label: "P — Phản bác", sub: "critics · sceptics · That assumption is exactly what… · Perhaps…" },
          { label: "Đ — Đáp lại", sub: "Defenders… · are not without a response · The reply is…" },
          { label: "T — Tác giả cân", sub: "thường ở đoạn cuối: What the debate has shown is…" },
        ],
        caption: "Một đoạn có thể làm hai việc (C + V). Thứ tự có thể đảo: nhiều bài mở bằng V rồi mới tới C.",
      },
      {
        t: "table", head: ["Việc của đoạn", "Tín hiệu hay gặp", "Câu hỏi thường nhắm vào"],
        rows: [
          ["C — chủ trương", "X argued / held / maintained that… · the doctrine that… · On this view / account, …", "YNNG về nội dung chủ trương; Summary"],
          ["V — ví dụ", "Imagine that… · Suppose… · He imagined a… · A string quartet, they pointed out, …", "MCQ “is used to show that…”"],
          ["P — phản bác", "Not everyone has been persuaded · later critics have questioned · Perhaps… · More subtly, …", "MCQ “Why does the writer mention…?”"],
          ["Đ — đáp lại", "Defenders point out · The reply is neat, but… · Besides, …", "MCQ về lập luận của bên bênh"],
          ["T — tác giả", "It would be rash to say… · What… has shown is… · deserves notice · ingenious", "YNNG “the writer considers…”; MCQ câu cuối"],
        ],
      },
      { t: "rule", formula: "Mỗi đoạn một chữ: C · V · P · Đ · T  →  câu hỏi hỏi việc gì thì về đúng đoạn có chữ đó", vi: "Đọc một lượt, ghi 8 chữ ở lề. Không gạch chân cả câu." },

      { t: "h", text: "3. Thuật ngữ — bài luôn tự định nghĩa" },
      { t: "p", text: "Đề IELTS không được đòi kiến thức chuyên ngành. Vì vậy mỗi thuật ngữ lạ (hedonism, opportunity cost, status quo bias…) luôn có định nghĩa nằm **ngay trước hoặc ngay sau** nó. Việc của bạn là nhận ra khuôn định nghĩa và **không dừng lại** ở từ lạ." },
      {
        t: "table", head: ["Khuôn", "Ví dụ", "Định nghĩa nằm ở"],
        rows: [
          ["N, the doctrine / view / idea that + mệnh đề", "hedonism, **the doctrine that** the only thing which makes a life go well is how it feels", "Sau dấu phẩy"],
          ["mô tả + , a tendency / effect + (which) X call / label + N", "people are reluctant to give up what they have, **a tendency psychologists label** status quo bias", "TRƯỚC thuật ngữ"],
          ["became known as + N", "The phenomenon **became known as** the cost disease", "Cả đoạn trước đó"],
          ["Philosophers / Economists call such + N + N", "**Philosophers call such** reactions intuitions", "Câu ngay trước"],
          ["N — that is, … / N, or …", "unanimity — **that is**, everyone giving the same answer", "Sau dấu gạch"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo: thuật ngữ trong câu hỏi",
        items: [
          "Câu hỏi thường **không lặp thuật ngữ** mà dùng lại phần định nghĩa bằng lời khác. Bài: “status quo bias”; câu hỏi: “the common unwillingness to part with one's existing circumstances”. Tìm theo nghĩa, đừng tìm theo chữ.",
          "Gặp thuật ngữ lần đầu: khoanh tròn nó và nối một nét sang phần định nghĩa. Lần sau thuật ngữ quay lại (thường 2–3 đoạn sau), bạn không phải đọc ngược.",
        ],
      },

      { t: "h", text: "4. Khởi động — kinh tế học, 5 phút" },
      { t: "p", text: "Bài kinh tế học dựng bằng **mô hình + cơ chế**: một ví dụ đơn giản (ở đây là bốn nhạc công), rồi chuỗi “vì… nên…” dẫn tới một kết luận ngược trực giác. Đọc và trả lời 5 câu trong **5 phút**. Ghi chữ C / V / T cạnh từng đoạn." },
      {
        t: "passage", title: "The Price of a String Quartet",
        intro: "Bài tự soạn cho khoá. Hai nhà kinh tế, cuốn sách năm 1966 và ví dụ tứ tấu đàn dây là có thật; lời văn tự viết.",
        paras: [
          { label: "A", text: "In 1966 two American economists, William Baumol and William Bowen, set out to explain why orchestras and theatres were perpetually short of money. Their answer had nothing to do with bad management. A string quartet by Beethoven, they pointed out, calls for four players and takes about as long to perform today as it did when it was written. A car worker, by contrast, turns out many times more vehicles per hour than his counterpart of a century ago. In one trade output per worker has soared; in the other it has not moved, and cannot." },
          { label: "B", text: "This would not matter if musicians were content to be paid what musicians earned in 1800. They are not, and there is no reason why they should be. Employers in the stagnant trades must compete for staff with the progressive ones, so wages across the economy tend to rise together. A violinist's pay therefore climbs with the car worker's, although her output does not. The cost of each performance goes up year after year, and the same arithmetic applies wherever the work consists largely of one person's time and attention: nursing, teaching, hairdressing, the law." },
          { label: "C", text: "The phenomenon became known as the cost disease, an unfortunate label, since it suggests that something has gone wrong. Nothing has. The rising price of a concert or a hospital stay is, on this account, a side effect of spectacular success elsewhere. Because an hour of labour now buys far more food, clothing and machinery than it once did, a society can pay more for its nurses and still have more of everything else. What changes is not what we can afford but how the bill is divided: a growing share of income goes to services whose price keeps rising, a shrinking share to goods whose price keeps falling." },
          { label: "D", text: "The practical lesson is uncomfortable for politicians. When the cost of schooling or health care outpaces inflation, the instinct is to look for waste. Some waste there may be, but a hunt for it will not reverse a trend that is built into the nature of the work." },
        ],
      },
      {
        t: "mcq", id: "t5d11-doc-khoi-dong-chon", title: "Khởi động — Questions 1–3: choose the correct letter",
        items: [
          { q: "1. What did Baumol and Bowen originally want to account for?", options: ["the constant financial difficulties of the performing arts", "the poor management of arts organisations", "the difference in pay between musicians and factory workers", "the length of time needed to perform classical music"], correct: 0, why: "Đoạn A: “set out to explain why orchestras and theatres were perpetually short of money”. Phương án về quản lý kém bị bác thẳng: “nothing to do with bad management”. Hai phương án cuối là chi tiết của ví dụ, không phải mục đích." },
          { q: "2. According to paragraph B, musicians' wages rise because", options: ["audiences are willing to pay more for tickets.", "their skills are becoming harder to find.", "employers have to keep pace with pay in more productive industries.", "performances demand more preparation than in the past."], correct: 2, why: "“Employers in the stagnant trades must compete for staff with the progressive ones, so wages… tend to rise together.” stagnant / progressive được đổi thành less / more productive." },
          { q: "3. What is the writer's view of the term “cost disease”?", options: ["It describes the problem accurately.", "It was invented by Baumol's opponents.", "It should be applied only to the arts.", "It is misleading because it implies that a fault exists."], correct: 3, why: "Đoạn C: “an unfortunate label, since it suggests that something has gone wrong. Nothing has.” Câu hai từ “Nothing has.” là giọng tác giả." },
        ],
      },
      {
        t: "quiz", id: "t5d11-doc-khoi-dong-dien", title: "Khởi động — Questions 4–5: ONE WORD ONLY from the passage", kind: "fill",
        items: [
          { q: "4. As an economy becomes more productive, a larger ___ of people's income is spent on services.", answers: ["share"], hint: "C: “a growing share of income goes to services”. Chỗ trống sau “a larger” ⇒ danh từ số ít." },
          { q: "5. Faced with rising costs in education, politicians' first reaction is to search for ___ .", answers: ["waste"], hint: "D: “the instinct is to look for waste”. instinct → first reaction; look for → search for." },
        ],
      },
      {
        t: "note", title: "💡 Bài kinh tế vừa rồi dạy gì về thể loại",
        items: [
          "Bản đồ: A = V (mô hình tứ tấu) · B = cơ chế (vì… nên…) · C = C + T (tên hiện tượng, và tác giả nói thẳng “Nothing has.”) · D = hệ quả thực tiễn.",
          "Bài kinh tế hay kết bằng **một kết luận ngược trực giác**: giá tăng không phải vì ai làm kém. Câu MCQ khó nhất thường hỏi đúng chỗ ngược đó.",
          "Chuỗi nhân quả dài 3–4 mắt (năng suất nơi khác tăng → lương chung tăng → lương nhạc công tăng → giá vé tăng). Câu hỏi hay **cắt lấy một mắt giữa** — câu 2 ở trên.",
        ],
      },

      { t: "h", text: "5. Bài đọc chính — 17 phút, Questions 1–15" },
      { t: "p", text: "Bài soạn riêng cho khoá, khoảng **900 từ**, 8 đoạn A–H. Thí nghiệm tưởng tượng (1974), ba lý do của tác giả nó, và nghiên cứu đảo ngược năm 2010 là có thật; lời văn tự viết. **Đọc một lượt khoảng 5 phút**, ghi C / V / P / Đ / T ở lề, rồi làm câu hỏi 10–12 phút. Bấm giờ." },
      {
        t: "passage", title: "The Machine Nobody Wants",
        paras: [
          { label: "A", text: "Imagine that scientists have built a machine capable of giving you any experience you care to choose. Floating in a tank, with your brain wired to a computer, you would seem to yourself to be winning a championship, falling in love or composing a symphony – whatever you had picked from the catalogue in advance. Once connected, you would have no idea that you were in the tank; you would believe that it was all really happening. The friends you made there, the applause you heard and the pride you felt would be indistinguishable from the genuine article. Every couple of years you could surface for a short while to select the next instalment of your life. Would you plug in?" },
          { label: "B", text: "The American philosopher Robert Nozick posed the question in 1974, in a few paragraphs of a long book on political theory, and those paragraphs remain among the most discussed things he wrote. His target was hedonism, the doctrine that the only thing which makes a life go well for the person living it is how that life feels from the inside. Hedonism has an ancient pedigree and an obvious appeal: it is hard to see how something could be good for me if it never touched my experience at all. But if the doctrine is true, the machine is a bargain. It guarantees more pleasure than any real life could deliver, and a consistent hedonist ought to sign up without hesitation." },
          { label: "C", text: "Nozick was confident that most of us would refuse, and he thought the refusal instructive. He offered three suggestions as to what lies behind it. We do not merely want the sensation of having done things; we want to do them. We want, too, to be a certain sort of person – brave, say, or kind – and nothing of the sort can be said of a body suspended in a tank. And we want to be in touch with a world that is more than a human construction. If any of this is right, then something matters to us besides how our lives feel, and hedonism is false." },
          { label: "D", text: "As a piece of reasoning this is unusual, and its form deserves notice. No premise is established by evidence in the usual sense. The reader is invited to consult their own reaction to an invented case and to treat that reaction as data against which a general theory can be tested, much as an observation tests a hypothesis in physics. Philosophers call such reactions intuitions, and the method stands or falls with the assumption that they are tracking something other than our habits and fears. It is also what makes the argument so portable: no library or laboratory is needed, only a willingness to answer honestly." },
          { label: "E", text: "That assumption is exactly what later critics have questioned. Perhaps we recoil from the tank for reasons that have nothing to do with the worth of reality. The machine might break down. The scientists might not be trustworthy. Nor is it clear that readers manage to imagine the case as described: told that the illusion would be perfect, they may go on picturing themselves as somehow aware of the tank. More subtly, people are known to be reluctant to give up whatever they currently have, a tendency psychologists label status quo bias; the life we are living may attract us simply because it is ours." },
          { label: "F", text: "In 2010 the philosopher Felipe De Brigard found an ingenious way to pull these explanations apart: he turned the story round. His participants were asked to suppose that they had just been informed that the life they remembered had been produced by such a machine all along, and were offered the chance to disconnect and return to their real existence. If contact with reality were what people prized, they should have leapt at the offer. They did not. When nothing was said about what the real life would be like, the group divided roughly in half; when it was described as unpleasant, a large majority chose to remain in the simulation. What had looked like a love of the real began to resemble a preference for the familiar." },
          { label: "G", text: "Defenders of Nozick are not without a response. The reversed case, they point out, alters more than the direction of travel. Someone who disconnects loses every relationship and project they care about, illusory or not, and it is hardly irrational to weigh that loss heavily. A person asked to walk away from a marriage of twenty years is not obviously in the grip of a bias when he declines, even if he has just been told that the marriage was scripted. Besides, the original argument never required unanimity. It needs only the claim that reality counts for something in our deliberations, and the fact that the participants were divided, rather than indifferent, suggests that it does." },
          { label: "H", text: "Half a century on, the question has acquired a practical edge its author could not have anticipated, as growing numbers of people spend a substantial part of their waking hours in environments designed to be more rewarding than the world outside. It would be rash to say that the experiments have settled what they would choose if the offer were made in earnest. What the debate has shown is narrower, and more useful: that a response which feels like a considered judgement about value may be, at least in part, a reflex – and that telling the two apart takes more than asking people what they think." },
        ],
      },
      { t: "p", text: "**Questions 1–6.** Do the following statements agree with the claims of the writer? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this." },
      {
        t: "mcq", id: "t5d11-doc-ynng", title: "Questions 1–6 — YES / NO / NOT GIVEN",
        items: [
          { q: "1. Nozick's discussion of the machine made up only a small part of the work in which it appeared.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "B: “in a few paragraphs of a long book on political theory”. a few paragraphs of a long book → only a small part of the work." },
          { q: "2. Hedonism is an idea that first emerged in the twentieth century.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "B: “Hedonism has an ancient pedigree” (có gốc gác lâu đời) — trái với “first emerged in the twentieth century”. Bẫy: năm 1974 đứng ngay câu trước, nhưng đó là năm Nozick đặt câu hỏi." },
          { q: "3. It is easy to understand why hedonism attracts people.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "B: “an obvious appeal: it is hard to see how something could be good for me if it never touched my experience”. Đây là lời tác giả, không phải lời Nozick." },
          { q: "4. Nozick later came to doubt the argument he had put forward.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài không nói gì về suy nghĩ sau này của Nozick. Bẫy: “later” gợi nhớ “later critics” (E) — đó là NGƯỜI KHÁC phản bác Nozick, không phải Nozick tự nghi ngờ. Đừng gán ý của người phê bình cho tác giả của lập luận." },
          { q: "5. Nozick's argument rests on evidence of a conventional kind.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "D: “No premise is established by evidence in the usual sense.” in the usual sense → of a conventional kind; câu hỏi khẳng định điều bài phủ định." },
          { q: "6. The people who took part in De Brigard's study had been trained in philosophy.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "F chỉ nói “His participants” — không có thông tin họ là ai. “the philosopher Felipe De Brigard” là nghề của người làm nghiên cứu, không phải của người tham gia." },
        ],
      },
      { t: "p", text: "**Questions 7–10.** Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq", id: "t5d11-doc-mcq", title: "Questions 7–10 — Multiple choice",
        items: [
          { q: "7. Nozick's three suggestions in paragraph C are intended to show that", options: ["most people misunderstand what pleasure is.", "people care about things other than the quality of their experiences.", "a real life contains more pleasure than a simulated one.", "people cannot predict whether they would refuse the machine."], correct: 1, why: "Câu chốt của đoạn C: “something matters to us besides how our lives feel”. Phương án C sai vì đoạn B đã nói máy cho NHIỀU khoái lạc hơn đời thật. Phương án A và D không có trong bài." },
          { q: "8. Why does the writer mention the possibility that the machine “might break down”?", options: ["to show that the technology described is unrealistic", "to explain what psychologists mean by status quo bias", "to suggest that Nozick deliberately ignored practical problems", "to give an example of a reason for refusing that is unconnected with the value of reality"], correct: 3, why: "Đoạn E: “for reasons that have nothing to do with the worth of reality. The machine might break down.” — câu sau là ví dụ cho câu trước. Phương án B sai: status quo bias là lý do KHÁC, được mở bằng “More subtly”." },
          { q: "9. What did the results of De Brigard's study suggest?", options: ["People's choices depend heavily on the situation they believe they are already in.", "People value reality even more than Nozick supposed.", "Most people would enter the machine if it really existed.", "Descriptions of real life had no effect on people's decisions."], correct: 0, why: "Đoạn F: “a preference for the familiar”. Người đang “ở trong máy” thì phần lớn không chịu ra. Phương án D sai: mô tả đời thật là unpleasant làm kết quả đổi hẳn. Phương án C nói quá: nghiên cứu hỏi chuyện RỜI máy, không phải vào máy." },
          { q: "10. According to Nozick's defenders, the reversed version of the story", options: ["was carried out on too small a group.", "shows that hedonism is correct after all.", "introduces a cost that the original case did not involve.", "gives the same result as the original."], correct: 2, why: "Đoạn G: “alters more than the direction of travel. Someone who disconnects loses every relationship and project they care about”. Mất mát đó không có ở tình huống gốc. Phương án A không được nhắc; B và D trái với lập luận của họ." },
        ],
      },
      { t: "p", text: "**Questions 11–15.** Complete the summary using the list of words, **A–J**, below. Gõ MỘT chữ cái cho mỗi câu." },
      {
        t: "table", head: ["", "List of words"],
        rows: [
          ["A", "existing"], ["B", "funding"], ["C", "attachments"], ["D", "evenly"], ["E", "imagined"],
          ["F", "trust"], ["G", "awake"], ["H", "connected"], ["I", "unanimously"], ["J", "pleasure"],
        ],
      },
      { t: "p", text: "**Doubts about the argument.** Critics doubt whether refusing the machine reveals a commitment to reality. A refusal might instead reflect practical worries, such as a lack of **11** ………… in the people operating it, or the widespread unwillingness to part with one's **12** ………… circumstances. De Brigard tested this by reversing the story so that his participants were the ones already **13** ………… . Given no details of their real lives, they were split fairly **14** ………… ; told that those lives were disagreeable, most stayed where they were. Nozick's supporters reply that leaving would mean abandoning the **15** ………… a person has formed, which is a genuine loss." },
      {
        t: "quiz", id: "t5d11-doc-tom-tat", title: "Questions 11–15 — gõ MỘT chữ cái A–J", kind: "fill",
        items: [
          { q: "11.", answers: ["F"], hint: "E: “The scientists might not be trustworthy.” → a lack of trust in the people operating it. funding không có trong bài." },
          { q: "12.", answers: ["A"], hint: "E: “reluctant to give up whatever they currently have” → unwillingness to part with one's existing circumstances. Thuật ngữ status quo bias bị bỏ, chỉ còn định nghĩa." },
          { q: "13.", answers: ["H"], hint: "F: cuộc đời họ nhớ “had been produced by such a machine all along” → họ là người ĐÃ được nối máy. awake là nghĩa ngược." },
          { q: "14.", answers: ["D"], hint: "F: “the group divided roughly in half” → split fairly evenly. unanimously (nhất trí) trái nghĩa với split." },
          { q: "15.", answers: ["C"], hint: "G: “loses every relationship and project they care about” → the attachments a person has formed. pleasure không đi với “has formed”." },
        ],
      },

      { t: "h", text: "6. Mổ lại — bản đồ lập luận và chỗ đặt bẫy" },
      {
        t: "table", head: ["Đoạn", "Việc", "Giọng của ai", "Câu hỏi rơi vào"],
        rows: [
          ["A", "V — thí nghiệm tưởng tượng", "Tác giả thuật lại (Imagine…)", "—"],
          ["B", "C — Nozick nhắm vào hedonism", "Nozick + nhận xét của tác giả (an obvious appeal)", "1 · 2 · 3"],
          ["C", "C — ba gợi ý của Nozick", "Nozick (he thought · He offered)", "7"],
          ["D", "T — tác giả bình về PHƯƠNG PHÁP", "Tác giả (deserves notice)", "5"],
          ["E", "P — bốn lý do khác khiến ta từ chối", "Later critics", "8 · 11 · 12"],
          ["F", "P — thí nghiệm đảo ngược", "De Brigard; tác giả khen (ingenious)", "6 · 9 · 13 · 14"],
          ["G", "Đ — bên bênh Nozick", "Defenders (they point out)", "10 · 15"],
          ["H", "T — tác giả cân và kết", "Tác giả (It would be rash to say…)", "—"],
        ],
      },
      {
        t: "table", head: ["Câu", "Kiểu bẫy", "Chữ quyết định"],
        rows: [
          ["2", "Con số đứng gần (1974) kéo về đáp án sai", "ancient pedigree"],
          ["4", "Mang thông tin từ bài khác / gán “critics” cho Nozick", "không có câu nào về Nozick sau này ⇒ NOT GIVEN"],
          ["5", "Câu hỏi khẳng định điều bài phủ định", "No premise… in the usual sense"],
          ["6", "Nghề của tác giả nghiên cứu ≠ người tham gia", "His participants (không mô tả)"],
          ["8", "Hai lý do cạnh nhau; phương án B lấy lý do sau", "More subtly, … (mở lý do mới)"],
          ["9", "Phương án nói quá phạm vi (vào máy ≠ rời máy)", "a preference for the familiar"],
          ["12", "Thuật ngữ biến mất, chỉ còn định nghĩa", "whatever they currently have"],
          ["15", "Từ trong hộp hợp nghĩa chung nhưng không hợp kết từ", "has formed ⇒ attachments"],
        ],
      },
      {
        t: "table", head: ["Đúng / 15", "Mức ước tính", "Việc cần làm"],
        rows: [
          ["14–15", "Band 8+ cho thể loại này", "Lần sau ép xuống 15 phút. Sang Ngày 13 làm đủ 3 passage 55 phút."],
          ["12–13", "Band 7.5", "Xem lại câu sai thuộc đoạn nào của bản đồ. Sai ở P / Đ ⇒ bạn lẫn giọng; đọc lại mục 2."],
          ["≤ 11", "Band 7 trở xuống", "Đọc lại bài KHÔNG bấm giờ, ghi bản đồ 8 chữ ra giấy, rồi làm lại câu 7–10. Ôn Tập 5 Ngày 9 (YNNG: ý của ai)."],
        ],
      },
      {
        t: "note", title: "💡 Ba điều rút ra cho lần sau",
        items: [
          "Đoạn mở bằng **Imagine / Suppose / Consider** là dữ kiện của cả bài. Đọc nó ở tốc độ bình thường, không lướt.",
          "Từ đánh giá của tác giả rất ít và rất nhỏ: ingenious · hardly irrational · It would be rash to… · deserves notice. Khoanh chúng lại — câu YNNG “the writer considers…” lấy từ đó.",
          "Khi hai bên đều có lý (E–F đối với G), đáp án của câu hỏi về **quan điểm tác giả** gần như luôn là phương án dè dặt nhất.",
        ],
      },

      { t: "h", text: "7. Đọc lại bằng mắt của người viết — sáu câu đáng chép" },
      { t: "p", text: "Sáu chỗ trống dưới đây lấy từ bài đọc chính. Chúng là những cụm bạn dùng lại được trong Task 2 khi thuật và phê bình một quan điểm (nối Ngày 10, Phrasebank nâng cao). Điền **MỘT từ**, không nhìn lại bài." },
      {
        t: "quiz", id: "t5d11-doc-cum", title: "Điền MỘT từ lấy từ bài đọc (6 câu)", kind: "fill",
        items: [
          { q: "1. The method stands or ___ with the assumption that intuitions can be trusted.", answers: ["falls"], hint: "stand or fall with = thành bại tuỳ vào" },
          { q: "2. Perhaps we refuse for reasons that have nothing to ___ with the worth of reality.", answers: ["do"], hint: "have nothing to do with" },
          { q: "3. Defenders of Nozick are not ___ a response.", answers: ["without"], hint: "phủ định kép: are not without = có" },
          { q: "4. It would be ___ to say that the experiments have settled the matter.", answers: ["rash"], hint: "vội vàng, liều" },
          { q: "5. It is ___ irrational to weigh that loss heavily.", answers: ["hardly"], hint: "hầu như không" },
          { q: "6. A response that feels like a judgement may be, at least in ___ , a reflex.", answers: ["part"], hint: "at least in part" },
        ],
      },

      { t: "h", text: "8. Từ vựng hữu ích từ hai bài đọc" },
      {
        t: "vocab", items: [
          { w: "doctrine", pos: "n", ipa: "/ˈdɒktrɪn/", vi: "học thuyết, chủ thuyết", ex: "Hedonism is the doctrine that only experience matters.", exVi: "Chủ nghĩa khoái lạc là học thuyết cho rằng chỉ trải nghiệm mới quan trọng.", more: "the doctrine **that** + mệnh đề · adj: doctrinaire (giáo điều)" },
          { w: "pedigree", pos: "n", ipa: "/ˈpedɪɡriː/", vi: "gốc gác, lai lịch (lâu đời)", ex: "The idea has a long intellectual pedigree.", exVi: "Ý tưởng này có gốc gác học thuật lâu đời.", more: "an ancient / impressive pedigree" },
          { w: "a bargain", pos: "n", ipa: "/ˈbɑːɡɪn/", vi: "món hời", ex: "At that price the course is a bargain.", exVi: "Với giá đó thì khoá học là món hời.", more: "v: bargain **for** sth · into the bargain (thêm vào đó)" },
          { w: "indistinguishable", pos: "adj", ipa: "/ˌɪndɪˈstɪŋɡwɪʃəbl/", vi: "không thể phân biệt được", ex: "To most customers, the cheaper brand is indistinguishable from the original.", exVi: "Với phần lớn khách hàng, nhãn rẻ hơn không phân biệt được với hàng gốc.", more: "indistinguishable from · distinguish between A and B (Ngày 10) · trong bài: indistinguishable from the genuine article (đoạn A)" },
          { w: "stand or fall with", pos: "phr", ipa: "/stænd ɔː fɔːl wɪð/", vi: "thành bại tuỳ thuộc vào", ex: "The whole proposal stands or falls with its funding.", exVi: "Cả đề xuất thành hay bại tuỳ vào nguồn tiền.", more: "cũng: stand or fall **on** / **by**" },
          { w: "recoil from", pos: "v", ipa: "/rɪˈkɔɪl frəm/", vi: "chùn lại, ghê sợ trước", ex: "Many voters recoil from the idea of higher taxes.", exVi: "Nhiều cử tri chùn lại trước ý tưởng tăng thuế.", more: "recoil **from** N / V-ing · recoil **at** the sight of" },
          { w: "leap at", pos: "v", ipa: "/liːp æt/", vi: "chộp lấy ngay (cơ hội)", ex: "She leapt at the chance to study abroad.", exVi: "Cô ấy chộp ngay cơ hội du học.", more: "leap at the chance / offer / opportunity · quá khứ: leapt / leaped" },
          { w: "unanimity", pos: "n", ipa: "/ˌjuːnəˈnɪməti/", vi: "sự nhất trí hoàn toàn", ex: "The decision does not require unanimity.", exVi: "Quyết định này không cần sự nhất trí hoàn toàn.", more: "adj: unanimous · adv: unanimously" },
          { w: "in earnest", pos: "phr", ipa: "/ɪn ˈɜːnɪst/", vi: "một cách nghiêm túc, thật sự", ex: "Work on the bridge began in earnest in March.", exVi: "Việc xây cầu thật sự bắt đầu vào tháng Ba.", more: "be in earnest (nói nghiêm túc) · begin in earnest" },
          { w: "outpace", pos: "v", ipa: "/ˌaʊtˈpeɪs/", vi: "tăng nhanh hơn, vượt", ex: "Rents have outpaced wages for a decade.", exVi: "Tiền thuê nhà tăng nhanh hơn lương suốt một thập kỷ.", more: "cùng họ: outstrip · outnumber · outweigh" },
        ],
      },
      {
        t: "note", title: "📌 Sau bài này",
        items: [
          "Ghi vào sổ lỗi: mỗi câu sai thuộc **đoạn nào** và đoạn đó là giọng của ai. Nếu 2 câu trở lên sai ở đoạn P / Đ, vấn đề của bạn là lẫn giọng chứ không phải từ vựng.",
          "**Ngày 13:** Reading đủ 3 passage 55 phút. Mang theo bản đồ 5 chữ C · V · P · Đ · T cho Passage 3.",
          "Tự luyện thêm thể loại: đọc mục “Philosophy” hoặc “Economics” của một tạp chí phổ thông tiếng Anh, mỗi bài chỉ làm một việc — ghi bản đồ lập luận ở lề.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d11-noi",
    kind: "speaking",
    title: "Nói: idiom và từ ít gặp dùng khéo — paraphrase câu hỏi; trọng âm chuỗi",
    goal: "Dùng 2–3 idiom và 2–3 từ ít gặp trong một lượt Part 2 + Part 3 sao cho chúng làm việc thật (thay được một lời giải thích dài), đúng nguyên dạng, đúng register và đúng đỉnh giọng; mở câu trả lời bằng cách nói lại câu hỏi bằng từ của mình thay vì lặp từ của giám khảo.",
    minutes: 75,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Lexical Resource của Speaking từ 7 lên 8**. Band 7: “dùng được một số từ ít gặp và idiom, có ý thức về phong cách và collocation, đôi chỗ chọn chưa khéo”. Band 8: “dùng từ ít gặp và idiom **một cách khéo léo**, chỉ thỉnh thoảng thiếu chính xác”. Khác nhau ở chữ khéo.",
          "**Bốn phép thử** trước khi cho một idiom ra khỏi miệng: đúng nghĩa · đúng dạng · đúng giọng (register) · đúng liều. Nối ba luật của Tập 5 Ngày 3.",
          "**14 idiom + 10 từ ít gặp** chưa xuất hiện ở Tập 3–5. Không có proverb, không có cụm “sách luyện thi” (every coin has two sides, in a nutshell…).",
          "**Paraphrase câu hỏi** (ôn Tập 3 Ngày 27 ở mức band 8): câu đầu của bạn dùng TỪ KHÁC với câu hỏi, và khi thiếu từ thì nói vòng có kỹ thuật.",
          "🔊 **Trọng âm chuỗi**: mỗi idiom là một chuỗi có MỘT đỉnh giọng, gần như luôn ở từ nội dung cuối (a pinch of SALT). Đặt sai đỉnh thì người nghe không nhận ra cụm.",
        ],
      },

      { t: "h", text: "1. Idiom ở band 7 và band 8 — khác nhau ở đâu" },
      {
        t: "table", head: ["", "Band 7", "Band 8"],
        rows: [
          ["Số lượng", "4–5 idiom trong một câu trả lời, để “khoe”", "2–3 trong cả Part 2; có câu trả lời không có cái nào"],
          ["Loại", "Proverb và cụm học thuộc: every cloud has a silver lining · in a nutshell", "Cụm đời thường của người có học: a mixed bag · hard to come by · on the spur of the moment"],
          ["Dạng", "Sai một từ nhỏ: ~~bite more than you can chew~~ · ~~back to the square one~~", "Đúng nguyên dạng, chia đúng thì: she'd **bitten** off more than she could chew"],
          ["Vị trí", "Mở hoặc kết câu, tách rời nội dung", "Nằm GIỮA một câu có chi tiết, làm vị ngữ của câu"],
          ["Âm", "Đều giọng, hoặc nhấn từ đầu", "Một đỉnh ở từ nội dung cuối, nói liền một hơi"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba thói quen giữ người Việt ở band 7",
        items: [
          "**Dịch thành ngữ Việt.** ~~It is like water pouring on a duck's head.~~ Người nghe không hiểu. Có cụm tương đương thì dùng (it's like water off a duck's back); không chắc thì nói thẳng nghĩa.",
          "**Dùng idiom để mở bài.** “As the saying goes, practice makes perfect.” là dấu hiệu của bài thuộc lòng. Idiom band 8 xuất hiện khi câu chuyện CẦN nó.",
          "**Sợ sai nên không dùng gì.** Bài nói sạch nhưng toàn good / bad / difficult / important dừng ở LR 6.5–7. Hôm nay học 24 đơn vị; mục tiêu là dùng đúng 5–6 cái trong một lần thi.",
        ],
      },

      { t: "h", text: "2. Bốn phép thử trước khi dùng một idiom" },
      {
        t: "table", head: ["Phép thử", "Hỏi", "Trượt thì"],
        rows: [
          ["① Đúng nghĩa", "Mình giải thích được cụm này bằng một câu thường không?", "Nói câu thường đó — an toàn hơn"],
          ["② Đúng dạng", "Mạo từ, giới từ, số ít / nhiều có đúng từng chữ không? Chia thì được ở từ nào?", "Bỏ. Sai một chữ là lộ"],
          ["③ Đúng giọng", "Đang NÓI hay đang VIẾT? Chủ đề nghiêm túc (bệnh tật, tang lễ) hay đời thường?", "Bài viết Task 2: thay bằng cụm trung tính (be treated with caution)"],
          ["④ Đúng liều", "Câu trả lời này đã có idiom nào chưa?", "Để dành cho câu sau"],
          ["⑤ Có làm việc không", "Bỏ cụm đi thì câu có mất nghĩa không?", "Nếu không mất gì, cụm ấy chỉ để trang trí — bỏ"],
        ],
      },
      { t: "rule", formula: "Đúng nghĩa → đúng dạng → đúng giọng → đúng liều → bỏ đi có mất nghĩa không?", vi: "Trượt một phép thử thì nói câu thường. Câu thường đúng luôn hơn idiom sai." },

      { t: "h", text: "3. Mười bốn idiom đời thường — hai nhóm" },
      { t: "p", text: "**Nhóm A — để NHẬN XÉT** một thứ (chất lượng, độ hiếm, độ khó). Chúng đứng sau **be**, nên rất dễ đặt vào câu. Dòng dưới mỗi ví dụ ghi chỗ được phép biến đổi." },
      {
        t: "vocab", items: [
          { w: "a mixed bag", pos: "idiom", ipa: "/ə mɪkst ˈbæɡ/", vi: "lẫn lộn hay dở, cái được cái không", ex: "The lecturers were a mixed bag: two were brilliant, one just read from his slides.", exVi: "Giảng viên thì người hay người dở: hai người xuất sắc, một người chỉ đọc slide.", more: "a bit of a mixed bag · something of a mixed bag. Luôn có **a**; không số nhiều." },
          { w: "few and far between", pos: "idiom", ipa: "/fjuː ən fɑː bɪˈtwiːn/", vi: "hiếm hoi, thưa thớt", ex: "Affordable flats near the centre are few and far between.", exVi: "Căn hộ vừa túi tiền gần trung tâm rất hiếm.", more: "Chủ ngữ **số nhiều** + are. Không: ~~little and far between~~." },
          { w: "hard to come by", pos: "idiom", ipa: "/hɑːd tə ˈkʌm baɪ/", vi: "khó kiếm, khó tìm", ex: "Part-time jobs that fit around lectures are hard to come by.", exVi: "Việc làm thêm khớp với lịch học rất khó kiếm.", more: "easy to come by (ít gặp hơn) · come by sth = kiếm được" },
          { w: "a tall order", pos: "idiom", ipa: "/ə tɔːl ˈɔːdə/", vi: "một đòi hỏi quá khó", ex: "Learning a language in three months is a tall order.", exVi: "Học một ngôn ngữ trong ba tháng là đòi hỏi quá khó.", more: "That's a tall order. · a pretty tall order. Không liên quan tới “order” = gọi món." },
          { w: "part and parcel of", pos: "idiom", ipa: "/pɑːt ən ˈpɑːsl əv/", vi: "phần tất yếu, gắn liền với", ex: "Late nights are part and parcel of student life.", exVi: "Thức khuya là phần tất yếu của đời sinh viên.", more: "Không mạo từ: ~~a part and parcel~~. Hợp cả Task 2 mức trung tính." },
          { w: "take sth with a pinch of salt", pos: "idiom", ipa: "/teɪk wɪð ə pɪntʃ əv ˈsɔːlt/", vi: "nghe nhưng đừng tin hẳn", ex: "I take online reviews with a pinch of salt.", exVi: "Tôi đọc đánh giá trên mạng nhưng không tin hẳn.", more: "Anh-Mỹ: a **grain** of salt. Chia thì ở **take**." },
          { w: "an uphill struggle", pos: "idiom", ipa: "/ən ʌphɪl ˈstrʌɡl/", vi: "việc chật vật, khó từng bước", ex: "Getting my grandparents to bank online was an uphill struggle.", exVi: "Thuyết phục ông bà tôi dùng ngân hàng trực tuyến là cả một sự chật vật.", more: "cũng: an uphill battle / task. face an uphill struggle" },
        ],
      },
      { t: "p", text: "**Nhóm B — để KỂ** một việc đã xảy ra. Chúng có động từ, nên phải **chia thì** — chỗ band 7 hay sai nhất." },
      {
        t: "vocab", items: [
          { w: "bite off more than you can chew", pos: "idiom", ipa: "/baɪt ɒf mɔː ðən jʊ kən ˈtʃuː/", vi: "ôm việc quá sức", ex: "I'd bitten off more than I could chew by taking two jobs.", exVi: "Tôi đã ôm quá sức khi nhận hai việc.", more: "bite – bit – bitten. Đổi **you / can** theo người và thì: more than **she could** chew. Không bỏ **off**." },
          { w: "back to square one", pos: "idiom", ipa: "/bæk tə skweə ˈwʌn/", vi: "quay về vạch xuất phát", ex: "The file got corrupted, so we were back to square one.", exVi: "Tệp bị hỏng nên chúng tôi lại về vạch xuất phát.", more: "be / go back to square one. Không mạo từ: ~~the square one~~." },
          { w: "get your head round sth", pos: "idiom", ipa: "/ɡet jɔː ˈhed raʊnd/", vi: "hiểu nổi, thấm được (thường ở phủ định)", ex: "I still can't get my head round how much rents have gone up.", exVi: "Tôi vẫn chưa thấm nổi tiền thuê nhà đã tăng tới mức nào.", more: "Anh-Mỹ: get your head **around**. Đổi your → my / his." },
          { w: "steer clear of", pos: "idiom", ipa: "/stɪə ˈklɪər əv/", vi: "tránh xa", ex: "I steer clear of group chats during exam week.", exVi: "Tuần thi tôi tránh xa các nhóm chat.", more: "steer clear **of** N / V-ing. Chia: steered clear of." },
          { w: "on the spur of the moment", pos: "idiom", ipa: "/ɒn ðə spɜːr əv ðə ˈməʊmənt/", vi: "bốc đồng, không tính trước", ex: "We booked the trip on the spur of the moment.", exVi: "Chúng tôi đặt chuyến đi trong một phút bốc đồng.", more: "adj: a spur-of-the-moment decision. Luôn **the… the**." },
          { w: "stuck in a rut", pos: "idiom", ipa: "/stʌk ɪn ə ˈrʌt/", vi: "mắc kẹt trong nếp cũ nhàm chán", ex: "After three years in the same role I felt stuck in a rut.", exVi: "Sau ba năm cùng một vị trí, tôi thấy mình giậm chân tại chỗ.", more: "be / feel / get stuck in a rut · get out of a rut" },
          { w: "rub off on sb", pos: "idiom", ipa: "/rʌb ˈɒf ɒn/", vi: "(tính cách, thói quen) lây sang ai", ex: "Her enthusiasm for running has rubbed off on the whole office.", exVi: "Niềm mê chạy bộ của cô ấy lây sang cả văn phòng.", more: "Chủ ngữ là **tính cách / thói quen**, không phải người: ~~She rubbed off on me.~~" },
        ],
      },
      {
        t: "table", head: ["Cụm", "Được đổi", "KHÔNG được đổi"],
        rows: [
          ["bite off more than you can chew", "thì của bite; you → I / she; can → could", "bỏ off; đổi chew → eat"],
          ["take sth with a pinch of salt", "thì của take; tân ngữ ở giữa", "pinch → piece / bit; salt → sugar"],
          ["back to square one", "động từ trước nó: be / go / send sb", "thêm the; one → zero"],
          ["few and far between", "động từ: are / were / have become", "thứ tự hai tính từ"],
          ["a mixed bag", "thêm a bit of / something of", "số nhiều; bỏ a"],
          ["rub off on", "thì của rub (rubbed); người sau on", "chủ ngữ là người"],
        ],
      },
      {
        t: "mcq", id: "t5d11-noi-idiom", title: "Đúng dạng, đúng nghĩa, đúng giọng? (6 câu)",
        items: [
          { q: "1. Good, cheap places to eat near campus are ___.", options: ["little and far between", "few and far between", "few and far away"], correct: 1, why: "Cụm cố định few and far between; đi với chủ ngữ số nhiều." },
          { q: "2. When the client rejected the whole design, we were ___.", options: ["back at first square", "back to the square one", "back to square one"], correct: 2, why: "back to square one — không mạo từ, không đổi giới từ." },
          { q: "3. Câu nào KHÔNG nên viết trong bài Task 2?", options: ["Such forecasts should be treated with caution.", "We should take such forecasts with a pinch of salt.", "Such forecasts are not always reliable."], correct: 1, why: "with a pinch of salt là idiom của lời nói. Bài viết dùng cụm trung tính: be treated with caution. Phép thử ③ — đúng giọng." },
          { q: "4. I still ___ how the new tax rules work.", options: ["can't get my head round", "can't take my head round", "can't put my head around of"], correct: 0, why: "get your head round sth (Anh-Mỹ: around). Động từ là get." },
          { q: "5. My flatmate cycles everywhere, and it has ___.", options: ["rubbed on me", "rubbed off to me", "rubbed off on me"], correct: 2, why: "rub off on sb: cần cả off lẫn on. Chủ ngữ it = thói quen đi xe đạp." },
          { q: "6. “Finishing the whole report by Friday is a tall order.” Người nói muốn nói rằng", options: ["bản báo cáo rất dài.", "yêu cầu đó rất khó đáp ứng.", "đã có lệnh từ cấp trên."], correct: 1, why: "a tall order = một đòi hỏi quá khó. Không liên quan tới độ dài hay mệnh lệnh." },
        ],
      },

      { t: "h", text: "4. Mười từ ít gặp — đổi từ chung thành từ chính xác" },
      { t: "p", text: "“Less common vocabulary” của band 8 không phải từ hàn lâm. Đó là những từ **nói đúng hơn một bậc** so với good / bad / think / problem. Mỗi từ dưới đây thay cho cả một cụm giải thích." },
      {
        t: "table", head: ["Band 7 nói", "Band 8 nói", "Chính xác hơn ở đâu"],
        rows: [
          ["I had a feeling that…, but I had no proof.", "I had **a hunch** that…", "linh cảm có cơ sở mơ hồ"],
          ["It was not as good as people say.", "It's **overrated**.", "được khen quá mức"],
          ["People were not very excited about it.", "It got a **lukewarm** response.", "không ghét, không thích"],
          ["He tried, but not seriously.", "He made a **half-hearted** attempt.", "làm cho có"],
          ["I passed, but only because I was lucky.", "It was **a fluke**.", "may mắn một lần, không lặp lại được"],
          ["There was a small unexpected problem.", "We hit **a snag**.", "trục trặc nhỏ làm chậm lại"],
          ["I need to think about it carefully for some time.", "I need to **mull it over**.", "nghĩ lâu, chưa vội quyết"],
          ["She is naturally good at it.", "She has **a knack for** it.", "khéo bẩm sinh ở một việc cụ thể"],
        ],
      },
      {
        t: "vocab", items: [
          { w: "overrated", pos: "adj", ipa: "/ˌəʊvəˈreɪtɪd/", vi: "được đánh giá quá cao", ex: "Honestly, I think the city's nightlife is overrated.", exVi: "Thật lòng, tôi nghĩ cuộc sống về đêm của thành phố được khen quá lời.", more: "trái nghĩa: **underrated** · vastly / hugely overrated" },
          { w: "lukewarm", pos: "adj", ipa: "/ˌluːkˈwɔːm/", vi: "hờ hững, không mặn mà (nghĩa gốc: âm ấm)", ex: "The proposal got a lukewarm response from students.", exVi: "Đề xuất nhận phản ứng hờ hững từ sinh viên.", more: "a lukewarm reception / review · be lukewarm **about** sth" },
          { w: "half-hearted", pos: "adj", ipa: "/ˌhɑːf ˈhɑːtɪd/", vi: "làm cho có, thiếu nhiệt tình", ex: "He made a half-hearted attempt to apologise.", exVi: "Anh ấy xin lỗi cho có.", more: "a half-hearted effort / attempt · adv: half-heartedly · trái nghĩa: wholehearted" },
          { w: "a hunch", pos: "n", ipa: "/hʌntʃ/", vi: "linh cảm", ex: "I had a hunch the interview had gone badly.", exVi: "Tôi linh cảm buổi phỏng vấn không ổn.", more: "have a hunch **(that)**… · act on a hunch · My hunch is that…" },
          { w: "a fluke", pos: "n", ipa: "/fluːk/", vi: "chuyện ăn may", ex: "Passing first time was a fluke; I'd barely revised.", exVi: "Đỗ ngay lần đầu là ăn may; tôi hầu như chưa ôn.", more: "a complete / sheer fluke · It was no fluke. (không phải ăn may)" },
          { w: "a snag", pos: "n", ipa: "/snæɡ/", vi: "trục trặc nhỏ bất ngờ", ex: "The plan hit a snag when the venue cancelled.", exVi: "Kế hoạch gặp trục trặc khi nơi tổ chức huỷ.", more: "hit / run into a snag · The only snag is (that)…" },
          { w: "relish", pos: "v", ipa: "/ˈrelɪʃ/", vi: "thích thú, khoái (một việc người khác ngại)", ex: "Most people dread presentations, but she relishes them.", exVi: "Đa số sợ thuyết trình, còn cô ấy lại khoái.", more: "relish the chance / challenge / prospect of + V-ing. Không: ~~relish to do~~" },
          { w: "mull over", pos: "v", ipa: "/mʌl ˈəʊvə/", vi: "nghiền ngẫm, cân nhắc lâu", ex: "I mulled the offer over for a week before saying yes.", exVi: "Tôi cân nhắc lời mời cả tuần rồi mới nhận.", more: "mull **it** over (đại từ ở giữa) · mull over a decision" },
          { w: "a knack (for)", pos: "n", ipa: "/næk/", vi: "sự khéo bẩm sinh, cái tài (làm việc gì)", ex: "She has a knack for explaining hard ideas simply.", exVi: "Cô ấy có tài giải thích điều khó thành dễ.", more: "have a knack **for / of** + V-ing · get the knack of it. Chữ k câm." },
          { w: "fathom", pos: "v", ipa: "/ˈfæðəm/", vi: "hiểu thấu (thường ở phủ định)", ex: "I can't fathom why anyone would pay that much for trainers.", exVi: "Tôi không hiểu nổi vì sao có người trả chừng ấy tiền cho một đôi giày.", more: "can't fathom **why / how**… · fathom out (Anh-Anh)" },
        ],
      },
      {
        t: "quiz", id: "t5d11-noi-tu", title: "Điền MỘT từ — chữ cái đầu cho sẵn (10 câu)", kind: "fill",
        items: [
          { q: "1. The sequel got a l___ reception: nobody hated it, nobody loved it.", answers: ["lukewarm"] },
          { q: "2. I had a h___ that the bus wouldn't come, so I set off on foot.", answers: ["hunch"] },
          { q: "3. He scored from the halfway line, but everyone knew it was a f___ .", answers: ["fluke"] },
          { q: "4. Everything was going smoothly until we hit a s___ : the projector didn't work.", answers: ["snag"] },
          { q: "5. My aunt has a real k___ for making strangers feel at home.", answers: ["knack"] },
          { q: "6. I think that café is o___ — the queue is more impressive than the coffee.", answers: ["overrated"] },
          { q: "7. Don't answer now. M___ it over and tell me on Monday.", answers: ["mull", "Mull"] },
          { q: "8. She made a h___ effort to tidy the room, then went back to her phone. (một từ có gạch nối)", answers: ["half-hearted", "halfhearted", "half hearted"] },
          { q: "9. I can't f___ how he manages on four hours' sleep.", answers: ["fathom"] },
          { q: "10. Most students dread oral exams, but my brother actually r___ them.", answers: ["relishes"] },
        ],
      },

      { t: "h", text: "5. Paraphrase câu hỏi — câu đầu không lặp từ của giám khảo" },
      { t: "p", text: "Tập 3 Ngày 27 dạy đổi một từ của câu hỏi bằng từ đồng nghĩa. Ở band 8, câu mở đầu làm **hai việc cùng lúc**: trả lời thẳng VÀ cho thấy bạn có từ khác để nói cùng ý đó. Có ba cách, giống ba cách paraphrase của bài viết (Tập 5 Ngày 6)." },
      {
        t: "table", head: ["Giám khảo hỏi", "Câu mở band 8", "Cách đổi"],
        rows: [
          ["Do you think advertising **influences what people buy**?", "It definitely **shapes our choices**, yes — more than we'd like to admit.", "Đồng nghĩa: influence → shape; what people buy → our choices"],
          ["Why do some people **dislike their jobs**?", "I think what **puts people off** is rarely the work itself.", "Cụm động từ + đưa nguyên nhân lên làm chủ ngữ"],
          ["Is it important to **preserve old buildings**?", "**Keeping them standing** matters, I'd say, but not at any cost.", "Đổi loại từ: preserve → keeping… standing; important → matters"],
          ["Do young people **read less** than in the past?", "**Less on paper**, certainly. Whether they take in fewer words overall, I'm not so sure.", "Thu hẹp câu hỏi + fronting (Bài 1 mục 7)"],
          ["How has **shopping changed** in your country?", "**The biggest shift**, for me, is that nobody carries cash any more.", "Danh hoá: changed → the biggest shift"],
        ],
      },
      {
        t: "patterns", rows: [
          { formula: "It's a kind of / sort of + N + that + V…   ·   It's what you use to + V…", vi: "Thiếu từ ⇒ tả loại và công dụng. Người bản ngữ cũng làm thế.", examples: [
            { en: "It's a sort of metal frame that you stand the pot on.", vi: "Đó là một kiểu khung kim loại để bạn đặt nồi lên. (không nhớ từ trivet)" },
          ] },
          { formula: "I'm not sure of the exact word, but + S + V   ·   …, for want of a better word, …", vi: "Báo trước là mình đang nói gần đúng, rồi nói tiếp không dừng.", examples: [
            { en: "The atmosphere was, for want of a better word, flat.", vi: "Không khí, tạm gọi là, tẻ nhạt." },
            { en: "I'm not sure of the exact word, but it's the fee you pay when you cancel early.", vi: "Tôi không chắc từ chính xác, nhưng đó là khoản phí bạn trả khi huỷ sớm." },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Paraphrase không phải là đổi hết",
        items: [
          "Đổi **một hoặc hai** từ khoá là đủ. Cố đổi mọi từ sẽ ra câu lạ: ~~Do youthful individuals peruse fewer volumes?~~",
          "Danh từ kỹ thuật và tên riêng **giữ nguyên** (smartphone, university, Tet). Thứ cần đổi là động từ và tính từ đánh giá.",
          "Không mở bằng việc nhắc lại cả câu hỏi (“Do I think advertising influences what people buy? Well…”). Một lần cả bài thi thì được; lần thứ hai là câu giờ.",
        ],
      },
      { t: "rule", formula: "Câu mở = trả lời thẳng + 1–2 từ khoá đã đổi  ·  thiếu từ: It's a sort of N that… / for want of a better word", vi: "Giám khảo chấm từ vựng từ câu đầu tiên. Đừng trả lại cho họ đúng từ của họ." },

      { t: "h", text: "6. Band 7 và band 8 đặt cạnh nhau — cùng một câu Part 3" },
      { t: "p", text: "**Câu hỏi:** Do you think people today take on too many commitments? Bản band 7 dưới đây có **nhiều idiom hơn** bản band 8. Đọc và tìm xem vì sao nó vẫn thấp điểm hơn, rồi đối chiếu với bảng." },
      {
        t: "dialogue", title: "Bản band 7 (ước tính) — 5 cụm, 3 cụm có vấn đề",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you think people today take on too many commitments?", vi: "Bạn có nghĩ ngày nay người ta nhận quá nhiều việc không?" },
          { who: "Candidate", role: "candidate", text: "Yes, I think people today take on too many commitments. As the saying goes, they bite more than they can chew. For example, my sister is a doctor and she also studies for a master's degree, so it is a tall order for her. But every cloud has a silver lining, because she will get a better job in the future. In a nutshell, people are too busy nowadays and it is a double-edged sword.", vi: "Vâng, tôi nghĩ ngày nay người ta nhận quá nhiều việc. Như người ta hay nói, họ ôm quá sức. Ví dụ chị tôi là bác sĩ mà còn học thạc sĩ, nên đó là đòi hỏi quá khó với chị. Nhưng trong cái rủi có cái may, vì sau này chị sẽ có việc tốt hơn. Tóm lại, ngày nay người ta quá bận và đó là con dao hai lưỡi." },
        ],
      },
      {
        t: "dialogue", title: "Bản band 8 (ước tính) — 3 cụm + 1 từ ít gặp",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you think people today take on too many commitments?", vi: "Bạn có nghĩ ngày nay người ta nhận quá nhiều việc không?" },
          { who: "Candidate", role: "candidate", text: "A lot of them say yes to more than they can handle, I think — and usually without noticing until it's too late. My sister's a classic case. She was already working full-time at a hospital when she signed up for a master's, more or less on the spur of the moment, and within a couple of months it was obvious she'd bitten off more than she could chew. She's not half-hearted about anything, so she kept going, but it nearly wore her out. So I'd take the idea that being busy means being successful with a pinch of salt. Half the time it just means you never stopped to think about what you were agreeing to.", vi: "Tôi nghĩ nhiều người nhận lời nhiều hơn mức họ kham nổi — và thường không nhận ra cho tới khi quá muộn. Chị tôi là ví dụ điển hình. Chị đang làm toàn thời gian ở bệnh viện thì đăng ký học thạc sĩ, gần như trong một phút bốc đồng, và chỉ vài tháng sau đã rõ là chị ôm quá sức. Chị không làm gì nửa vời, nên vẫn tiếp tục, nhưng suýt kiệt sức. Vì vậy tôi không tin hẳn ý cho rằng bận rộn nghĩa là thành công. Nhiều khi nó chỉ có nghĩa là bạn chưa từng dừng lại nghĩ xem mình đang nhận lời việc gì." },
        ],
      },
      {
        t: "table", head: ["Điểm so sánh", "Bản band 7", "Bản band 8"],
        rows: [
          ["Câu mở", "Lặp nguyên câu hỏi: take on too many commitments", "Paraphrase: say yes to more than they can handle"],
          ["Đúng dạng", "~~bite more than they can chew~~ (thiếu off)", "she'd bitten off more than she could chew — đúng dạng, đúng thì, đổi đúng đại từ"],
          ["Loại cụm", "As the saying goes · every cloud has a silver lining · In a nutshell — cụm học thuộc", "on the spur of the moment · with a pinch of salt — cụm đời thường"],
          ["Có làm việc không", "a double-edged sword: chưa nêu hai mặt nào ⇒ trang trí", "Mỗi cụm mang một thông tin: quyết định vội · quá sức · không tin hẳn"],
          ["Vị trí", "Mở câu và kết bài", "Giữa câu, sau chi tiết cụ thể (full-time at a hospital… master's)"],
          ["Từ ít gặp", "busy · better · a tall order (đúng, nhưng lạc lõng)", "a classic case · half-hearted · wore her out"],
        ],
      },
      {
        t: "note", title: "💡 Cách đưa idiom vào bài nói của CHÍNH bạn",
        items: [
          "Chọn **6 đơn vị** trong 24 của hôm nay hợp với đời bạn nhất (một sinh viên IT gần như chắc chắn dùng được: hit a snag · back to square one · get my head round).",
          "Với mỗi đơn vị, viết **một câu thật** về chính bạn: “Our capstone demo hit a snag the night before — the server wouldn't start.” Câu thật thì bạn sẽ nhớ; câu ví dụ trong sách thì không.",
          "Ghi âm 3 câu trả lời Part 3 bất kỳ. Nghe lại: chỗ nào bạn đã nói vòng 8–10 từ cho một ý mà hôm nay có một cụm gọn hơn? Thay vào và nói lại.",
        ],
      },

      { t: "h", text: "7. 🔊 Phát âm — trọng âm chuỗi: mỗi cụm một đỉnh" },
      { t: "p", text: "Một idiom được nói như **một từ dài**: các từ dính vào nhau, và chỉ **một** âm tiết mang đỉnh giọng (cao hơn, dài hơn, rõ hơn). Người Việt hay nhấn đều từng từ, hoặc nhấn từ đầu tiên. Cả hai cách đều làm người nghe không nhận ra đó là một cụm cố định." },
      {
        t: "table", head: ["Luật", "Ví dụ (CHỮ HOA = đỉnh)", "Lỗi hay gặp"],
        rows: [
          ["Đỉnh ở **từ nội dung cuối** của cụm", "a pinch of SALT · a mixed BAG · back to square ONE · a tall ORder", "~~a PINCH of salt~~ · ~~a MIXED bag~~"],
          ["Từ chức năng (a, of, the, to, and) đọc yếu và dính", "few ən far beTWEEN · part ən PARcel · on thə spur əv thə MOment", "Đọc rõ từng chữ: few – AND – far"],
          ["Cụm động từ: đỉnh ở **tiểu từ trạng từ**, không ở giới từ / đại từ theo sau", "rubbed OFF on me · mull it Over · bitten OFF more than she could CHEW", "~~rubbed off on ME~~ · ~~mull IT over~~"],
          ["Đại từ cuối câu không mang đỉnh", "get my HEAD round it · steer CLEAR of them", "~~get my head round IT~~"],
          ["Sau đỉnh, giọng đi xuống và không lên lại", "It was a bit of a mixed BAG, to be honest. (phần sau dấu phẩy nói thấp)", "Lên giọng ở “honest” như câu hỏi"],
        ],
      },
      {
        t: "phatam", id: "t5d11-phat-am", title: "Luyện phát âm — trọng âm chuỗi: nói liền một hơi, một đỉnh mỗi cụm",
        note: "Mỗi câu đọc ba lần: lần 1 gõ tay vào đúng âm tiết mang đỉnh; lần 2 nói các từ chức năng thật nhẹ; lần 3 nói ở tốc độ trò chuyện. Máy chấm từng âm; vị trí đỉnh giọng thì bạn tự nghe lại bản ghi và so với cột ghi chú.",
        items: [
          { text: "It was a bit of a mixed bag, to be honest.", ipa: "ɪt wəz ə bɪt əv ə mɪkst bæɡ tə bi ɒnɪst", vi: "Đỉnh: BAG. “to be honest” nói thấp và nhanh." },
          { text: "Decent flats are few and far between.", ipa: "diːsnt flæts ə fjuː ən fɑː bɪtwiːn", vi: "Đỉnh: beTWEEN. “and” chỉ còn /ən/." },
          { text: "I'd take that with a pinch of salt.", ipa: "aɪd teɪk ðæt wɪð ə pɪntʃ əv sɔːlt", vi: "Đỉnh: SALT. Không nhấn pinch." },
          { text: "We were back to square one.", ipa: "wi wə bæk tə skweə wʌn", vi: "Đỉnh: ONE. “were”, “to” đọc yếu." },
          { text: "I couldn't get my head round it.", ipa: "aɪ kʊdnt ɡet maɪ hed raʊnd ɪt", vi: "Đỉnh: HEAD. “it” không mang trọng âm." },
          { text: "His enthusiasm rubbed off on me.", ipa: "hɪz ɪnθjuːziæzəm rʌbd ɒf ɒn miː", vi: "Đỉnh: OFF (tiểu từ). “on me” nói nhẹ." },
          { text: "I booked it on the spur of the moment.", ipa: "aɪ bʊkt ɪt ɒn ðə spɜːr əv ðə məʊmənt", vi: "Đỉnh: MOment. Nối spur‿of bằng /r/." },
          { text: "That's a tall order for a first-year student.", ipa: "ðæts ə tɔːl ɔːdə fər ə fɜːstjɪə stjuːdnt", vi: "Hai đỉnh vì hai cụm: ORder · STUdent." },
        ],
      },

      { t: "h", text: "8. Đến lượt bạn — Part 2 + Part 3" },
      { t: "p", text: "Trước khi ghi âm, ghi ra giấy **ba** đơn vị của hôm nay bạn định dùng cho mỗi thẻ — không hơn. Sau mỗi bản ghi, nghe lại và kiểm bốn phép thử của mục 2 cho từng cụm đã nói." },
      {
        t: "speak", id: "t5d11-noi-thoi-quen", part: "2",
        questions: [
          "Describe a habit you have tried to change. You should say: what the habit was; why you wanted to change it; what you did to try to change it; and explain how successful you were.",
          "Do the people close to you know about this?",
        ],
      },
      {
        t: "speak", id: "t5d11-noi-nhan-loi", part: "2",
        questions: [
          "Describe a time when you agreed to do something that turned out to be much harder than you had expected. You should say: what you agreed to do; who asked you to do it; what made it so difficult; and explain how you dealt with the situation.",
          "Would you agree to do the same thing again?",
        ],
      },
      {
        t: "speak", id: "t5d11-noi-p3", part: "3",
        questions: [
          "Why do many people find it hard to say no when they are asked to do something?",
          "Do you think people make more spontaneous decisions nowadays than they did in the past?",
          "Is it better to plan your life carefully or to take things as they come?",
          "How can someone tell whether a piece of advice is worth following?",
          "Do people's habits become harder to change as they get older?",
        ],
      },
      {
        t: "note", title: "Sau khi AI chấm — tự soát năm câu hỏi của band 8",
        items: [
          "Câu mở của mỗi câu trả lời Part 3 có **lặp nguyên** cụm của câu hỏi không? (mục 5)",
          "Mỗi idiom đã nói: đúng từng chữ chưa? Đặt ở giữa câu có chi tiết, hay ở đầu / cuối cho có?",
          "Có câu trả lời nào **không có** idiom nào không? (Phải có — đó là dấu hiệu đúng liều.)",
          "Đỉnh giọng của mỗi cụm rơi vào từ nào? Nghe lại và so với bảng mục 7.",
          "Có dùng được ít nhất hai cấu trúc của Bài 1 (lược, not that, I'd have thought, or rather) không?",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d11-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 11 — lược và thay từ · modal quá khứ khi nói · câu phức kiểu nói · đọc kinh tế học · idiom · từ ít gặp · trọng âm chuỗi",
    goal: "Tự kiểm cả ngày: lược đúng chỗ và đúng thì, thay từ thay vì lặp, rào đón bằng would / must + have, đọc một đoạn kinh tế học có kết luận ngược trực giác, dùng đúng dạng 14 idiom và 10 từ ít gặp, đặt đúng đỉnh giọng của một cụm cố định.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Cách làm",
        items: [
          "**I–IV (22 câu)** — ngữ pháp nói của Bài 1: lược, thay từ, modal quá khứ, dịch.",
          "**V (5 câu)** — một đoạn kinh tế học 200 từ: YES / NO / NOT GIVEN + điền từ, 6 phút.",
          "**VI–VII (14 câu)** — idiom, từ ít gặp, trọng âm chuỗi của Bài 3.",
          "41 câu, khoảng 45 phút, không mở lại bài học. Mục tiêu band 8: **≥ 36/41**. Dòng cuối chỉ mục cần ôn theo phần sai.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ôn nhanh Ngày 11 trước khi làm bài",
        center: "Nói như người nói thật",
        branches: [
          { label: "Lược", items: ["(I've) Never been.", "…can't remember who.", "I should have.", "few, if any,"] },
          { label: "Thay · ước chừng", items: ["do so · one", "and that sort of thing", "an hour or so · sevenish"] },
          { label: "Câu phức kiểu nói", items: ["the people I work with", "from what I've seen", "— not that…", "I'd have thought…"] },
          { label: "Idiom 4 phép thử", items: ["nghĩa · dạng", "giọng · liều", "đỉnh ở từ nội dung cuối"] },
        ],
      },

      { t: "h", text: "I. Lược — chọn phương án đúng (6 câu) — ôn Bài 1 mục 2 · 3" },
      {
        t: "mcq", id: "t5d11-bt-luoc", title: "I. Chọn phương án đúng",
        items: [
          { q: "1. “Have you ever been to Hue?” — “___ I'd love to go, though.”", options: ["Have never been.", "Never been, actually.", "Am never been."], correct: 1, why: "(I've) Never been — lược cả I've. Không để have / am đứng trơ." },
          { q: "2. “Is the canteen any good?” — “___ on what you order.”", options: ["Depend", "Is depend", "Depends"], correct: 2, why: "(It) Depends — động từ vẫn chia theo chủ ngữ đã lược." },
          { q: "3. I knew I'd met him before, but I couldn't work out ___.", options: ["where was", "where", "where did"], correct: 1, why: "Lược sau wh-: chỉ giữ where." },
          { q: "4. “Did you revise over the holiday?” — “No, and I know I ___.”", options: ["should", "should had", "should have"], correct: 2, why: "Việc quá khứ ⇒ should have." },
          { q: "5. They invited me to join the committee, but I'd ___.", options: ["rather not", "rather not to", "rather don't"], correct: 0, why: "would rather + not, không có to." },
          { q: "6. My uncle rarely, if ___, takes a day off.", options: ["any", "never", "ever"], correct: 2, why: "rarely / seldom, if ever. (few…, if any.)" },
        ],
      },

      { t: "h", text: "II. Thay từ, ước chừng, nói lại — điền MỘT từ (6 câu) — ôn Bài 1 mục 4 · 7" },
      {
        t: "quiz", id: "t5d11-bt-thay", title: "II. Điền MỘT từ", kind: "fill",
        items: [
          { q: "1. Staff were asked to switch off their screens at night, but hardly anyone did ___ .", answers: ["so"] },
          { q: "2. I don't need an expensive laptop; a second-hand ___ will do.", answers: ["one"] },
          { q: "3. The talk lasted an hour or ___ , and nobody left early.", answers: ["so"] },
          { q: "4. We covered budgeting, invoices, tax and that ___ of thing.", answers: ["sort", "kind"] },
          { q: "5. He's a designer — or ___ , he trained as one and now sells insurance.", answers: ["rather"] },
          { q: "6. It's not a shortage of time so much as a shortage of attention, if that makes ___ .", answers: ["sense"] },
        ],
      },

      { t: "h", text: "III. Modal quá khứ khi nói — điền MỘT từ (5 câu) — ôn Bài 1 mục 6" },
      {
        t: "quiz", id: "t5d11-bt-modal", title: "III. Điền MỘT từ", kind: "fill",
        items: [
          { q: "1. I'd have ___ a library would be the quietest place on campus. It isn't.", answers: ["thought"] },
          { q: "2. You'd think cheap flights ___ make people travel more thoughtfully, but the opposite happens.", answers: ["would"] },
          { q: "3. I ___ say he's unfriendly — just slow to warm up. (phủ định, một từ)", answers: ["wouldn't"] },
          { q: "4. There were no streetlights then. The village ___ have been completely dark by seven.", answers: ["must"] },
          { q: "5. She ___ have written this essay in an hour — it's four thousand words. (chắc chắn không)", answers: ["can't", "cannot", "couldn't"] },
        ],
      },

      { t: "h", text: "IV. Dịch sang tiếng Anh (5 câu) — ôn Bài 1 mục 3 · 5 · 6" },
      {
        t: "quiz", id: "t5d11-bt-dich", title: "IV. Dịch — dùng cấu trúc trong gợi ý", kind: "translate",
        grammar: "…V + why · the N + S + V + giới từ · not that · You'd think…, but · If it weren't for",
        items: [
          { q: "1. Họ đã huỷ buổi học, nhưng không ai nói vì sao.", answers: ["They cancelled the class, but nobody said why.", "They cancelled the class, but no one said why.", "They canceled the class, but nobody said why.", "They cancelled the lesson, but nobody said why."], hint: "cancelled · nobody said why" },
          { q: "2. Đó là kiểu người mà bạn có thể trông cậy.", answers: ["That's the kind of person you can rely on.", "That's the sort of person you can rely on.", "That's the kind of person you can count on.", "He's the kind of person you can rely on.", "She's the kind of person you can rely on."], hint: "the kind of person · rely on" },
          { q: "3. Tôi hầu như không xem tivi — không phải là tôi không có thời gian.", answers: ["I hardly watch TV — not that I don't have time.", "I hardly ever watch TV — not that I don't have time.", "I hardly watch television — not that I don't have time.", "I hardly ever watch TV, not that I don't have time.", "I hardly ever watch TV — not that I don't have the time."], hint: "hardly (ever) · not that I don't" },
          { q: "4. Ai cũng nghĩ giá cao hơn sẽ khiến người ta lái xe ít đi, nhưng không phải vậy.", answers: ["You'd think higher prices would make people drive less, but they don't.", "You would think higher prices would make people drive less, but they don't.", "You'd think that higher prices would make people drive less, but they don't."], hint: "You'd think · would make people drive less · but they don't" },
          { q: "5. Nếu không vì giao thông thì tôi sẽ thích sống ở đây.", answers: ["If it weren't for the traffic, I'd like living here.", "If it weren't for the traffic, I would like living here.", "If it weren't for the traffic, I'd enjoy living here.", "If it wasn't for the traffic, I'd like living here.", "If it weren't for the traffic, I'd like to live here."], hint: "If it weren't for · I'd like living here" },
        ],
      },

      { t: "h", text: "V. Đọc — kinh tế học, một kết luận ngược trực giác (5 câu · 6 phút) — ôn Bài 2 mục 2–4" },
      { t: "p", text: "Câu đố và mốc thời gian trong đoạn là có thật; lời văn tự viết. **Câu 1–3:** YES / NO / NOT GIVEN (ý của tác giả). **Câu 4–5:** ONE WORD ONLY lấy từ đoạn văn." },
      {
        t: "passage", title: "Why Is Water Cheap?",
        paras: [
          { text: "Water is indispensable, yet it can be exchanged for next to nothing; a diamond has hardly any practical use, yet a great deal can be had in return for one. Adam Smith set out this puzzle in 1776 and could not resolve it. He concluded that the usefulness of a thing and the price it fetches were simply separate matters, and for the best part of a century economists followed him." },
          { text: "The solution, reached independently by several thinkers in the 1870s, was to stop asking about water in general. Nobody is ever offered a choice between all the water in the world and all the diamonds. The choices people actually face concern one more unit: an extra litre, an extra stone. Where water is plentiful, the next litre will be used for something trivial, such as washing a car, and so people will pay very little for it. Diamonds are scarce enough that the next one still satisfies a keen desire. Price, on this account, reflects the value of the last unit consumed rather than the value of the whole supply – which is why a traveller lost in a desert would gladly hand over a diamond for a single bottle." },
        ],
      },
      {
        t: "mcq", id: "t5d11-bt-doc-ynng", title: "V. Questions 1–3 — YES / NO / NOT GIVEN",
        items: [
          { q: "1. Adam Smith arrived at a satisfactory explanation of the puzzle he had described.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“set out this puzzle… and could not resolve it”." },
          { q: "2. The thinkers who solved the puzzle in the 1870s did so as a team.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“reached independently by several thinkers” — độc lập, trái với as a team." },
          { q: "3. Smith's treatment of the puzzle was attacked by other writers during his lifetime.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn chỉ nói các nhà kinh tế “followed him” gần một thế kỷ; không có thông tin về việc ông bị công kích lúc sinh thời." },
        ],
      },
      {
        t: "quiz", id: "t5d11-bt-doc-dien", title: "V. Questions 4–5 — ONE WORD ONLY", kind: "fill",
        items: [
          { q: "4. Where water is abundant, an additional litre is likely to be put to a ___ use.", answers: ["trivial"], hint: "“the next litre will be used for something trivial”" },
          { q: "5. According to the solution, the price of a good depends on the value of the ___ unit that is consumed.", answers: ["last"], hint: "“the value of the last unit consumed”" },
        ],
      },

      { t: "h", text: "VI. Idiom — điền MỘT từ (8 câu) — ôn Bài 3 mục 3" },
      {
        t: "quiz", id: "t5d11-bt-idiom", title: "VI. Điền MỘT từ để hoàn thành cụm", kind: "fill",
        items: [
          { q: "1. The conference was a mixed ___ : great speakers, terrible food.", answers: ["bag"] },
          { q: "2. Scholarships that cover living costs are few and far ___ .", answers: ["between"] },
          { q: "3. I'd take his promises with a ___ of salt if I were you.", answers: ["pinch", "grain"] },
          { q: "4. The funding fell through, so the project was back to ___ one.", answers: ["square"] },
          { q: "5. Volunteering to organise the whole festival, I'd bitten ___ more than I could chew.", answers: ["off"] },
          { q: "6. Criticism is part and ___ of working in a team.", answers: ["parcel"] },
          { q: "7. We bought the tickets on the ___ of the moment and left the next morning.", answers: ["spur"] },
          { q: "8. I tend to steer ___ of the city centre on match days.", answers: ["clear"] },
        ],
      },

      { t: "h", text: "VII. Từ ít gặp, register và trọng âm chuỗi (6 câu) — ôn Bài 3 mục 2 · 4 · 7" },
      {
        t: "mcq", id: "t5d11-bt-tu", title: "VII. Chọn phương án đúng",
        items: [
          { q: "1. The new policy got a ___ response: no protests, but no enthusiasm either.", options: ["half-hearted", "lukewarm", "overrated"], correct: 1, why: "lukewarm response / reception = hờ hững. half-hearted tả nỗ lực của người làm; overrated = được khen quá mức." },
          { q: "2. “It was a fluke.” Người nói muốn nói rằng", options: ["kết quả đó nhờ may mắn, khó lặp lại.", "kết quả đó rất đáng thất vọng.", "kết quả đó đã được tính trước."], correct: 0, why: "a fluke = chuyện ăn may." },
          { q: "3. Câu nào dùng relish ĐÚNG?", options: ["I relish to speak in public.", "I relish the chance to speak in public.", "I am relish speaking in public."], correct: 1, why: "relish + N / V-ing (relish the chance to…). Không: relish to do." },
          { q: "4. Câu nào hợp với bài Task 2 (văn viết trang trọng)?", options: ["Such statistics should be treated with caution.", "You've got to take such statistics with a pinch of salt.", "Such statistics are a bit of a mixed bag."], correct: 0, why: "Hai câu sau là idiom của lời nói — phép thử ③ đúng giọng." },
          { q: "5. Trong câu “I'd take that with a pinch of salt”, đỉnh giọng rơi vào", options: ["take", "pinch", "salt"], correct: 2, why: "Đỉnh ở từ nội dung cuối của cụm: SALT." },
          { q: "6. Trong câu “Her confidence rubbed off on me”, đỉnh giọng của cụm động từ rơi vào", options: ["off", "on", "me"], correct: 0, why: "Tiểu từ trạng từ (off) mang đỉnh; giới từ on và đại từ me đọc nhẹ." },
        ],
      },
      {
        t: "note", title: "📌 Sai nhiều ở đâu thì ôn ở đó",
        items: [
          "**I–II sai ≥ 3:** đọc lại Bài 1 mục 2–4, làm lại hai bài dịch của mục 2 và 3.",
          "**III–IV sai ≥ 3:** Bài 1 mục 5–6; nói to 8 câu ví dụ của mục 6.",
          "**V sai ≥ 2:** Bài 2 mục 2–3; vẽ lại bản đồ lập luận của “The Machine Nobody Wants”.",
          "**VI–VII sai ≥ 3:** Bài 3 mục 3–4 và bảng “được đổi / không được đổi”; đọc lại khối phát âm.",
        ],
      },
    ],
  },
];
