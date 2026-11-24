/**
 * IELTS Tập 5 — Ngày 13 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Câu chẻ · đảo ngữ · nhượng bộ · liên kết ngầm trong Task 2 band 8 — dùng VỪA ĐỦ (vòng 3)   [G29 G36 G37 G40]
 *                     — nối Tập 3 Ngày 21 (nhượng bộ) · Tập 4 Ngày 7 (câu chẻ, đảo ngữ) · Tập 4 Ngày 12–13 (referencing, substitution,
 *                       ellipsis) · Tập 4 Ngày 15 (từ nối đúng liều)
 *   Bài 2 (reading)   Reading đủ 3 passage · 40 câu · 55 phút (lần 1 của Tập 5): ống khí nén đưa thư (TFNG + Notes) · vì sao ngựa
 *                     vằn có sọc (Matching information + Matching features + Summary) · “meritocracy” (MCQ + YNNG + Summary có hộp từ)  [R20]
 *                     — nối Tập 4 Ngày 13 · 21 · 27 (60 phút) · Tập 5 Ngày 1 (đọc một lần)
 *   Bài 3 (listening) Nghe Part 3 trừu tượng cấp cao (seminar về nguyên tắc phòng ngừa trong chính sách, ~175 từ/phút, giọng Ireland ·
 *                     Canada · Anh) → mượn khung để NÓI Part 3 triết lý – chính sách band 8                       [L05 L11 L12 · S06]
 *                     — nối Tập 4 Ngày 23 (Part 3 trừu tượng) · Tập 5 Ngày 6 (phản biện, nhượng bộ)   🔊 pause mang nghĩa
 *                     (Bảng 3.5 ghi bài 3 là Nói; khuôn N mod 4 = 1 buộc kind listening ⇒ bài nghe làm đầu vào, có phần nói Part 3 + AI chấm.)
 *   Bài tập Ngày 13   44 câu có đáp án + 1 đoạn viết + 3 câu nói
 * Mọi id bắt đầu `t5d13-`. Dữ kiện có thật (đã làm tròn / làm mờ): ống khí nén điện báo ở London 1853 (Josiah Latimer Clark), mạng
 * bưu điện khí nén Paris 1866–1984, Berlin 1865–1976, New York 1897–1953, Praha hỏng sau lũ 2002; tranh luận Darwin – Wallace về sọc
 * ngựa vằn, nghiên cứu của Tim Caro (2014, 2019), Amanda Melin (2016), Brenda Larison (2015), Gábor Horváth (2012), Alison & Stephen
 * Cobb (2019); Michael Young, The Rise of the Meritocracy (1958) và bài báo năm 2001 của ông; Robert Frank, Success and Luck (2016).
 * Tên riêng trong bài nghe và bài tập (Dr Brennan, Halden, Marrow Bay…) là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_13: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d13-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Câu chẻ, đảo ngữ, nhượng bộ và liên kết ngầm trong Task 2 band 8 — dùng vừa đủ, đúng chỗ",
    goal: "Biết chính xác MỖI cấu trúc nhấn mạnh làm việc gì trong một bài Task 2 (câu chẻ = sửa một cách nhìn; đảo ngữ = đẩy luận điểm mạnh nhất; nhượng bộ = thừa nhận rồi vượt qua; liên kết ngầm = nối câu không cần từ nối), đặt chúng đúng vị trí với đúng liều lượng (một bài 280–300 từ: 1 câu chẻ, 0–1 đảo ngữ, 2 nhượng bộ), và không mắc sáu lỗi hình thức mà người band 7 vẫn mắc.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **GRA 7 → 8** và **CC 7 → 8** của Writing Task 2. Band 8 không đòi cấu trúc mới; nó đòi ==cấu trúc hiếm xuất hiện đúng chỗ, không lỗi, và không gây chú ý==.",
          "Bốn nhóm hôm nay đều đã học: câu chẻ + đảo ngữ (Tập 4 Ngày 7), nhượng bộ (Tập 3 Ngày 21 · Tập 4 Ngày 15), liên kết ngầm (Tập 4 Ngày 12–13). Đây là **vòng 3**: dùng trong bài thi đủ độ dài.",
          "Mỗi cấu trúc có MỘT việc: **câu chẻ** sửa một cách nhìn sai · **đảo ngữ** đẩy luận điểm mạnh nhất · **nhượng bộ** thừa nhận rồi vượt qua · **this + danh từ tóm tắt** nối câu thay từ nối.",
          "Liều cho một bài 280–300 từ: ==1 câu chẻ · 0–1 đảo ngữ · 2 nhượng bộ · 5–8 mối liên kết ngầm · không quá 4 từ nối lộ==.",
          "Giám khảo đọc thấy ba đảo ngữ trong một bài là biết bạn học thuộc mẫu. Một đảo ngữ đúng chỗ đáng giá hơn ba cái rải đều.",
          "Sáu lỗi hình thức cần triệt: quên đảo sau Only when… · đảo cả khi Only bổ nghĩa chủ ngữ · the reason is because · Although… but · albeit + mệnh đề · this không có danh từ.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao “vừa đủ” — band 7 khoe cấu trúc, band 8 giấu cấu trúc" },
      {
        t: "p",
        text: "Mô tả GRA band 8 có hai vế: ==a wide range of structures== và ==the majority of sentences are error-free==. Nhiều người đọc vế đầu rồi nhồi mọi cấu trúc khó vào bài. Kết quả thường là band 7 hoặc thấp hơn, vì ba lẽ: cấu trúc đặt sai chỗ làm lệch trọng tâm lập luận (mất TR), dày đặc làm văn nghe như bài mẫu thuộc lòng (mất CC), và mỗi cấu trúc khó là một cơ hội sai hình thức (mất GRA).",
      },
      {
        t: "table",
        head: ["", "Band 7 (ước tính)", "Band 8 (ước tính)"],
        rows: [
          ["Câu chẻ", "mở bài nào cũng “It is undeniable that…” — không chẻ gì cả", "một lần, đúng chỗ cần sửa một cách nhìn: **What this view overlooks is…**"],
          ["Đảo ngữ", "2–3 lần, đầu mỗi thân bài: Not only… Only by… Rarely…", "0–1 lần, ở câu mang luận điểm mạnh nhất của cả bài"],
          ["Nhượng bộ", "Although ở mọi đoạn; hoặc Although… but…", "2 lần, đổi khuôn: **While… / Persuasive as this is, …**"],
          ["Liên kết", "Firstly · Moreover · In addition · Furthermore đầu mỗi câu", "**This reluctance… Such measures… The latter…** — từ nối lộ chỉ 3–4"],
          ["Lỗi hình thức", "cứ 3 câu khó thì 1 câu sai", "câu khó nào cũng đúng"],
        ],
        caption: "Cùng bốn công cụ — hai cách dùng",
      },
      {
        t: "quiz",
        id: "t5d13-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 3 Ngày 21 · Tập 4 Ngày 7 · Ngày 13 (6 câu)",
        items: [
          { q: "Not only ___ the scheme reduce waste, but it also created jobs. (một từ)", answers: ["did"], hint: "Not only đứng đầu câu → đảo trợ động từ; created là quá khứ → did. Tập 4 Ngày 7 mục 4." },
          { q: "It was the cost, not the design, ___ worried the council. (một từ)", answers: ["that", "which"], hint: "It-cleft: It + be + phần nhấn + that + phần còn lại. Tập 4 Ngày 7 mục 2." },
          { q: "___ the high cost, the project went ahead. (Although / Despite)", answers: ["Despite"], hint: "Sau chỗ trống là cụm danh từ, không phải mệnh đề → Despite. Tập 3 Ngày 21." },
          { q: "Some firms cut wages. Others refused to do ___ . (một từ)", answers: ["so"], hint: "do so thay cho cả cụm động từ “cut wages”. Tập 4 Ngày 13 mục 6." },
          { q: "___ the law been enforced, the river would not have been polluted. (một từ)", answers: ["Had"], hint: "Điều kiện loại 3 đảo ngữ: Had + S + V3 = If + S + had + V3." },
          { q: "Taxes fund both schools and hospitals; the ___ absorb the larger share. (former / latter)", answers: ["latter"], hint: "the latter = cái nhắc sau (hospitals). Tập 4 Ngày 13 mục 5." },
        ],
      },
      { t: "p", text: "Đúng 5–6 câu: hình thức đã ổn, hôm nay tập trung vào ==vị trí và liều lượng==. Sai từ 2 câu: đọc kỹ các bảng hình thức ở mục 2–5 trước khi sang mục 6." },
      { t: "rule", formula: "band 8 = mỗi cấu trúc nhấn mạnh có MỘT việc + xuất hiện MỘT lần ở đúng chỗ của việc đó", vi: "Hỏi “câu này cần nhấn gì?” trước; chỉ khi có câu trả lời mới chọn cấu trúc." },

      /* ── 2 ── */
      { t: "h", text: "2. Câu chẻ — công cụ để sửa một cách nhìn" },
      {
        t: "p",
        text: "Câu chẻ tách một câu làm hai phần để ==dồn ánh sáng vào một phần==. Trong Task 2, việc của nó gần như luôn là **đối chiếu**: không phải A mà là B. Vì vậy chỗ đứng tự nhiên nhất là ngay sau khi bạn thuật một quan điểm phổ biến (ở mở bài hoặc đầu thân bài phản biện). Câu chẻ không có vế đối chiếu, dù nói ra hay ngầm, là câu chẻ thừa.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "It is / was + N (not N) + that + V …",
            vi: "Nhấn một danh từ / trạng ngữ; hay kèm “not…” để loại cách nhìn kia.",
            examples: [
              { en: "It is the quality of teaching, not the size of the budget, that determines how much pupils learn.", vi: "Chính chất lượng giảng dạy, chứ không phải quy mô ngân sách, quyết định học sinh học được bao nhiêu." },
              { en: "It is only when wages rise that young people begin to return to the countryside.", vi: "Chỉ khi lương tăng thì người trẻ mới bắt đầu quay về nông thôn." },
            ],
          },
          {
            formula: "What + S + V + is / was + N / that + S + V",
            vi: "Nhấn phần đứng SAU be; hợp nhất để mở lời phản biện.",
            examples: [
              { en: "What this argument overlooks is that most commuters have no realistic alternative to the car.", vi: "Điều lập luận này bỏ qua là phần lớn người đi làm không có lựa chọn thực tế nào ngoài ô tô." },
              { en: "What matters is not how long students study but how they study.", vi: "Điều quan trọng không phải là học bao lâu mà là học thế nào." },
            ],
          },
          {
            formula: "The reason (why) + S + V + is that + S + V",
            vi: "Nhấn nguyên nhân. Sau is dùng that, KHÔNG dùng because.",
            examples: [{ en: "The reason such schemes fail is that they are funded for a single year.", vi: "Lý do các chương trình như vậy thất bại là chúng chỉ được cấp vốn một năm." }],
          },
          {
            formula: "All (that) + S + V + is + N / (to) V",
            vi: "“Tất cả những gì… chỉ là…” — hạ giá một lập luận.",
            examples: [{ en: "All a ban would achieve is to move the trade out of sight.", vi: "Tất cả những gì một lệnh cấm đạt được chỉ là đẩy việc buôn bán ra khỏi tầm mắt." }],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — bốn lỗi câu chẻ còn sót ở band 7",
        items: [
          "~~The reason is because they lack funding.~~ → The reason is **that** they lack funding.",
          "~~What the country needs are more nurses.~~ Văn viết cẩn thận: What… **is** more nurses (mệnh đề What là chủ ngữ số ít). Dùng are sẽ không bị coi là lỗi nặng, nhưng is luôn an toàn.",
          "~~It is undeniable that technology is important.~~ Đây không phải câu chẻ mà là câu rỗng: không nhấn gì, không đối chiếu gì. Bỏ.",
          "~~It is the government who should to act.~~ → It is the government **that / who should act**. Sau that là mệnh đề bình thường, động từ chia theo phần được nhấn: It is the **parents** who **are** responsible.",
        ],
      },
      { t: "rule", formula: "It is N (not N) that V …   ·   What S V is that S V   ·   The reason S V is that S V", vi: "Dùng khi vừa nêu một cách nhìn và muốn nói “không phải thế, mà là thế này”. Một bài một lần." },
      {
        t: "quiz",
        id: "t5d13-cau-che-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu chẻ (4 câu)",
        grammar: "It is N (not N) that V · What S V is (that)… · The reason S V is that…",
        items: [
          { q: "Chính sự thiếu thực thi, chứ không phải thiếu luật, giải thích cho vấn đề này.", answers: ["It is the lack of enforcement, not the lack of laws, that explains this problem.", "It is the lack of enforcement, not the lack of laws, that explains the problem.", "It is the lack of enforcement, rather than the lack of laws, that explains this problem."], hint: "the lack of enforcement · explain" },
          { q: "Điều quan điểm này bỏ qua là không phải ai cũng tiếp cận được internet.", answers: ["What this view overlooks is that not everyone has access to the internet.", "What this view ignores is that not everyone has access to the internet.", "What this view overlooks is that not everyone has internet access."], hint: "overlook · have access to" },
          { q: "Lý do nhiều người trẻ rời nông thôn là ở đó có ít việc làm lương cao.", answers: ["The reason many young people leave the countryside is that there are few well-paid jobs there.", "The reason why many young people leave the countryside is that there are few well-paid jobs there.", "The reason many young people leave rural areas is that there are few well-paid jobs there."], hint: "The reason … is that · well-paid" },
          { q: "Điều quan trọng không phải là chi bao nhiêu tiền mà là chi như thế nào.", answers: ["What matters is not how much money is spent but how it is spent.", "What matters is not how much is spent but how it is spent.", "What matters is not how much money is spent, but how it is spent."], hint: "What matters is not … but …" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Đảo ngữ — một lần, ở câu mạnh nhất của bài" },
      {
        t: "p",
        text: "Đảo ngữ đưa một trạng ngữ phủ định hoặc giới hạn lên đầu câu, rồi đảo trợ động từ lên trước chủ ngữ như câu hỏi. Nó làm câu ==trang trọng và dứt khoát==, nên hợp nhất với câu nêu điều kiện cần (Only if / Only by…), câu bác bỏ mạnh (Under no circumstances…, Nor…) và câu điều kiện trang trọng (Should / Were / Had…). Trong Task 2, chỗ đẹp nhất là ==câu chốt thân bài 2 hoặc câu đầu kết bài==.",
      },
      {
        t: "table",
        head: ["Nhóm", "Khuôn", "Ví dụ Task 2", "Dùng khi"],
        rows: [
          ["Điều kiện cần", "Only when / if / by + … + **aux + S + V**", "Only by taxing fuel more heavily **can governments** change how people travel.", "nêu giải pháp duy nhất — hợp câu chốt"],
          ["Cộng dồn", "Not only + **aux + S + V**, but S also V", "Not only **does** tourism **create** jobs, but it also funds conservation.", "hai lợi ích, cái sau nặng hơn"],
          ["Hiếm / chưa từng", "Rarely / Seldom / Never before + **aux + S + V**", "Rarely **has** a single invention **changed** working life so quickly.", "mở bài về một thay đổi lớn"],
          ["Bác bỏ", "Nor + **aux + S + V** · Under no circumstances + **aux + S + V**", "Fines do not deter wealthy drivers. Nor **do they** raise much revenue.", "thêm một ý phủ định thứ hai"],
          ["Điều kiện trang trọng", "**Should / Were / Had** + S + V", "**Were** fares **to be abolished**, demand would outstrip capacity within months.", "nêu hệ quả giả định — thay If"],
          ["Mức độ", "So + adj + **be + S** + that … · Such **is** + N + that …", "So rapid **was the change** that regulators could not keep up.", "văn kể – giải thích; dùng dè"],
        ],
        caption: "Sáu nhóm đảo ngữ dùng được trong Task 2",
      },
      {
        t: "note",
        title: "⚠️ Hay sai — ba cái bẫy hình thức của đảo ngữ",
        items: [
          "**Only + mệnh đề phụ: đảo ở mệnh đề CHÍNH.** ~~Only when the law is enforced it will work.~~ → Only when the law is enforced **will it work**. Không đảo trong vế when.",
          "**Only bổ nghĩa CHỦ NGỮ thì không đảo.** Only the government **can** fund a project of this size. (không viết ~~Only the government can it fund~~, cũng không ~~Only can the government~~).",
          "**Not only… nhưng chủ ngữ đứng trước:** Tourism **not only creates** jobs but also funds conservation — không đảo, vẫn đúng và nhẹ hơn. Chỉ đảo khi Not only đứng ĐẦU câu.",
          "No sooner… than, Hardly… when là đảo ngữ của văn KỂ. Đặt vào bài nghị luận nghe lạc giọng.",
        ],
      },
      { t: "rule", formula: "Only by V-ing … + can / will + S + V   ·   Not only + does / did + S + V, but S also V   ·   Were S to V, S would V", vi: "Đảo trợ động từ ở mệnh đề chính. Một bài tối đa một lần, ở câu bạn muốn giám khảo nhớ." },
      {
        t: "quiz",
        id: "t5d13-dao-ngu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — đảo ngữ (4 câu)",
        grammar: "Only by / Only when … + aux + S + V · Not only + aux + S + V · Were S to V …",
        items: [
          { q: "Chỉ bằng cách đầu tư vào giáo viên, các trường mới nâng được chuẩn. (Only by…)", answers: ["Only by investing in teachers can schools raise standards.", "Only by investing in teachers will schools raise standards.", "Only by investing in teachers can schools raise their standards."], hint: "invest in · raise standards" },
          { q: "Lệnh cấm không những không giảm được việc dùng nhựa mà còn làm tăng giá thực phẩm. (Not only…)", answers: ["Not only did the ban fail to reduce plastic use, but it also raised food prices.", "Not only did the ban fail to reduce the use of plastic, but it also raised food prices.", "Not only did the ban fail to reduce plastic use, but it also increased food prices."], hint: "fail to reduce · raise food prices (quá khứ)" },
          { q: "Nếu thuế này được áp dụng, các hộ nghèo sẽ chịu thiệt nhiều nhất. (Were…)", answers: ["Were this tax to be introduced, poorer households would suffer most.", "Were this tax to be introduced, poor households would suffer most.", "Were this tax to be introduced, poorer households would suffer the most."], hint: "Were + S + to be introduced · suffer most" },
          { q: "Chỉ khi cha mẹ làm gương thì trẻ mới đọc sách vì thích. (Only when…)", answers: ["Only when parents set an example do children read for pleasure.", "Only when parents set an example will children read for pleasure.", "Only when their parents set an example do children read for pleasure."], hint: "set an example · read for pleasure" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Nhượng bộ — thừa nhận thật, rồi vượt qua" },
      {
        t: "p",
        text: "TR band 8 đòi lập trường ==được phát triển đầy đủ, có cân nhắc==. Nhượng bộ là cách cho thấy bạn đã cân nhắc: thừa nhận phần đúng của phía bên kia, rồi nói vì sao lập trường của bạn vẫn đứng. Band 7 chỉ có although. Band 8 có sáu, bảy khuôn và biết khuôn nào nặng nhẹ ra sao.",
      },
      {
        t: "table",
        head: ["Khuôn", "Ví dụ", "Sắc thái"],
        rows: [
          ["While / Although + S + V, …", "**While** such fines raise revenue, they do little to change behaviour.", "trung tính; while nhẹ hơn although"],
          ["adj / adv + as / though + S + V, …", "**Appealing as** this proposal **may be**, it ignores the cost.", "trang trọng; thừa nhận mạnh rồi bác"],
          ["Much as + S + V, …", "**Much as** I sympathise with this view, I cannot accept its conclusion.", "dùng với động từ cảm nghĩ: sympathise, admire, would like"],
          ["However + adj / adv + S + V, …", "**However well funded** a campaign is, it cannot replace regulation.", "“dù… đến đâu”; không thêm very"],
          ["For all + N, …", "**For all its flaws**, the examination system is at least transparent.", "“bất chấp mọi…”, gọn, rất tự nhiên"],
          ["S may V, but …", "This **may** be true of large cities, **but** it hardly applies to villages.", "nhượng bộ có giới hạn phạm vi — khuôn của người bản ngữ"],
          ["Admittedly, … . Even so, / Nonetheless, …", "**Admittedly**, the scheme is expensive. **Even so**, the alternative costs more.", "tách hai câu; dùng khi vế thừa nhận dài"],
          ["…, albeit + adj / adv / cụm", "The policy worked, **albeit slowly**.", "chêm cuối câu; KHÔNG theo sau bằng mệnh đề"],
        ],
        caption: "Tám khuôn nhượng bộ — xếp từ quen đến hiếm",
      },
      {
        t: "note",
        title: "⚠️ Sai kinh điển của người Việt ở nhượng bộ",
        items: [
          "~~Although it is expensive, but it works.~~ Tiếng Việt “tuy… nhưng…”, tiếng Anh chỉ MỘT trong hai: Although it is expensive, it works.",
          "~~Despite the scheme is expensive~~ → Despite **the cost of the scheme** / Despite **the scheme being** expensive / Although the scheme is expensive.",
          "~~albeit it is slow~~ → albeit **slow** / albeit **slowly** / although it is slow.",
          "~~However it is well funded~~ → However **well funded it is**: tính từ đứng ngay sau however.",
          "**even though** = sự thật (Even though prices rose, sales held up). **even if** = giả định (Even if prices rose, sales would hold up). Đổi chỗ là đổi nghĩa.",
        ],
      },
      { t: "rule", formula: "While S V, S V   ·   adj + as + S + may be, S V   ·   For all + N, S V   ·   S may V, but S V", vi: "Hai lần mỗi bài, hai khuôn khác nhau; vế sau phải nói VÌ SAO lập trường của bạn vẫn đứng." },
      {
        t: "quiz",
        id: "t5d13-nhuong-bo-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — nhượng bộ (4 câu)",
        grammar: "adj + as + S + may be · For all + N · However + adj + S + V · S may V, but …",
        items: [
          { q: "Dù đề xuất này có vẻ hấp dẫn đến đâu, nó vẫn bỏ qua chi phí bảo trì. (Appealing as…)", answers: ["Appealing as this proposal may seem, it ignores the cost of maintenance.", "Appealing as this proposal may be, it ignores the cost of maintenance.", "Appealing as this proposal may seem, it ignores maintenance costs."], hint: "Appealing as … may seem · the cost of maintenance" },
          { q: "Bất chấp mọi khiếm khuyết, hệ thống hiện nay ít nhất cũng minh bạch. (For all…)", answers: ["For all its flaws, the current system is at least transparent.", "For all its flaws, the present system is at least transparent.", "For all its shortcomings, the current system is at least transparent."], hint: "For all its flaws · at least transparent" },
          { q: "Dù một chiến dịch được tài trợ tốt đến đâu, nó cũng không thay thế được luật. (However…)", answers: ["However well funded a campaign is, it cannot replace legislation.", "However well funded a campaign is, it cannot replace the law.", "However well funded a campaign may be, it cannot replace legislation."], hint: "However well funded · replace legislation" },
          { q: "Điều này có thể đúng với các thành phố lớn, nhưng khó mà đúng với vùng nông thôn. (may…, but…)", answers: ["This may be true of large cities, but it is hardly true of rural areas.", "This may be true of big cities, but it is hardly true of rural areas.", "This may be true of large cities, but it hardly applies to rural areas."], hint: "be true of · hardly" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Liên kết ngầm — nối câu mà không cần từ nối" },
      {
        t: "p",
        text: "CC band 8 ghi: ==cohesion is managed so that it attracts no attention==. Từ nối đầu câu (Moreover, Furthermore, In addition) là loại liên kết gây chú ý nhất. Người band 8 nối câu chủ yếu bằng cách ==cho câu sau nắm lấy một thứ của câu trước==: một danh từ tóm tắt, một đại từ, một cụm thay thế, hoặc một chỗ lược bỏ.",
      },
      {
        t: "table",
        head: ["Công cụ", "Câu trước → câu sau", "Ghi chú"],
        rows: [
          ["this / these + danh từ tóm tắt", "Many graduates take jobs unrelated to their degree. **This mismatch** is costly for the economy.", "danh từ tóm tắt phải ĐÚNG loại: mismatch · trend · reluctance · assumption · shift · measure"],
          ["such + N", "Cities have introduced tolls and parking levies. **Such measures** are unpopular but effective.", "= những thứ thuộc loại vừa nêu"],
          ["the former / the latter", "Schools can raise fees or cut courses. **The latter** is usually chosen.", "chỉ khi vừa nêu ĐÚNG hai thứ, và câu sau đứng sát"],
          ["do so / do the same", "Employers are urged to offer flexible hours, but few have **done so**.", "thay cả cụm động từ"],
          ["one / ones · that of / those of", "The problems of small firms differ from **those of** large corporations.", "that of cho số ít, those of cho số nhiều"],
          ["lược bỏ", "Some residents welcomed the change; others did **not**.", "bỏ phần lặp sau trợ động từ"],
          ["The same is true of… / cannot be said of…", "Wages in cities have risen. **The same cannot be said of** rural areas.", "nối đối chiếu không cần However"],
        ],
        caption: "Bảy mối nối ngầm của band 8",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — this trần và danh từ tóm tắt sai",
        items: [
          "~~Many graduates take unrelated jobs. This is costly.~~ This trần chỉ vào đâu? Thêm danh từ: **This mismatch** is costly.",
          "Danh từ tóm tắt cũng là một nhận định. Viết **this problem** khi câu trước chỉ tả một xu hướng trung tính là bạn đã lén đưa ý kiến vào; dùng **this trend / this shift** nếu chưa muốn đánh giá.",
          "Bỏ từ nối không có nghĩa là bỏ liên kết: câu sau vẫn phải nắm một thứ của câu trước. Hai câu đứng cạnh nhau mà không có mối nào là đứt mạch.",
        ],
      },
      { t: "rule", formula: "S V … .   This / Such + N (tóm tắt) + V …   ·   … . The latter V …   ·   … , but few have done so.", vi: "Câu sau nắm lấy một thứ của câu trước; từ nối lộ để dành cho chỗ đổi hướng lớn (However, Nevertheless)." },
      {
        t: "quiz",
        id: "t5d13-lien-ket-dien",
        kind: "fill",
        title: "Điền MỘT từ để nối hai câu (7 câu)",
        items: [
          { q: "Fewer young people are learning to drive. This ___ has surprised car manufacturers. (xu hướng)", answers: ["trend", "decline", "shift"], hint: "Danh từ tóm tắt một thay đổi theo thời gian: trend / decline / shift." },
          { q: "Officials assumed that lower prices would raise demand. This ___ proved wrong. (giả định)", answers: ["assumption"], hint: "assumed → assumption: danh hoá chính động từ câu trước." },
          { q: "Councils may subsidise buses or build cycle lanes. The ___ option is cheaper. (cái nhắc sau)", answers: ["latter"], hint: "the latter = cycle lanes." },
          { q: "Firms were asked to publish their pay data, and most have done ___ .", answers: ["so"], hint: "do so = publish their pay data." },
          { q: "The diet of city children is poorer than ___ of children in farming areas.", answers: ["that"], hint: "that of = the diet of (số ít)." },
          { q: "Curfews, bans and fines have all been tried. ___ measures rarely last. (một từ, viết hoa)", answers: ["Such", "These"], hint: "Such + N số nhiều: những biện pháp loại vừa nêu." },
          { q: "House prices in the capital have doubled. The same cannot be ___ of wages.", answers: ["said"], hint: "The same cannot be said of… = điều đó không đúng với…" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Liều lượng và vị trí — “ngân sách” cho một bài 280–300 từ" },
      {
        t: "table",
        head: ["Vị trí", "Việc của câu", "Cấu trúc hợp", "Liều"],
        rows: [
          ["Mở bài — câu 2 (thesis)", "nêu lập trường có cân nhắc", "nhượng bộ: While… , I would argue that…", "1"],
          ["Thân bài 1 — câu chủ đề", "nêu lý do chính", "câu thường, rõ; không cần cấu trúc hiếm", "0"],
          ["Thân bài 1 — giữa đoạn", "nối bằng chứng với lý do", "this + danh từ tóm tắt · such + N", "2–3"],
          ["Thân bài 2 — câu đầu", "thuật phía bên kia rồi bác", "nhượng bộ khuôn khác: Appealing as… / Admittedly… Even so…", "1"],
          ["Thân bài 2 — câu phản biện", "sửa cách nhìn của phía bên kia", "câu chẻ: What this overlooks is that…", "1"],
          ["Thân bài 2 — câu chốt HOẶC kết bài", "luận điểm mạnh nhất", "đảo ngữ: Only by… can…", "0–1"],
          ["Mọi đoạn", "giữ mạch", "the latter · do so · lược bỏ", "tuỳ"],
        ],
        caption: "Bản đồ vị trí — tổng cộng 4 cấu trúc “nổi” trong cả bài",
      },
      { t: "p", text: "Dưới đây là cùng một thân bài viết hai cách. Đề: Some people think the voting age should be lowered to sixteen. Đếm số cấu trúc “nổi” trong mỗi bản trước khi đọc bảng." },
      {
        t: "passage",
        title: "Thân bài band 7 (ước tính) — 104 từ, nhồi cấu trúc",
        paras: [
          { text: "Firstly, it is undeniable that young people are affected by political decisions. Not only do they attend state schools, but also they use public transport. Moreover, although they cannot vote, but they pay tax when they work part-time. Furthermore, rarely do politicians listen to them. Only when the voting age is lowered politicians will pay attention to their needs. In addition, it is education that is the most important issue for them. Therefore, never should we ignore their voice. This is unfair. Admittedly, some teenagers are immature, however this is also true for some adults, so the voting age should be lowered for all of them." },
        ],
      },
      {
        t: "passage",
        title: "Thân bài band 8 (ước tính) — 118 từ, dùng vừa đủ",
        paras: [
          { text: "The strongest argument for lowering the voting age is that sixteen-year-olds already bear many of the consequences of political decisions. They study in schools whose budgets are set by elected officials, and those in part-time work pay tax on what they earn. Opponents reply that teenagers lack the maturity to choose wisely. This objection may hold for some sixteen-year-olds, but it holds equally for some forty-year-olds, and no one proposes testing the latter before they vote. What the objection really reveals is an assumption that the young have less at stake, when decisions on climate or housing will in fact shape their lives for far longer. Only when they have a vote will such issues be given the weight they deserve." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bản band 7", "Bản band 8"],
        rows: [
          ["Đảo ngữ", "4 (Not only · rarely · Only when · never) — 1 sai: thiếu đảo sau Only when", "1 (Only when… will such issues…) — ở câu chốt"],
          ["Câu chẻ", "1, không đối chiếu gì (it is education that…)", "1, sửa cách nhìn của phía phản đối (What the objection really reveals is…)"],
          ["Nhượng bộ", "although… but (sai) · Admittedly…, however (comma splice)", "may…, but… — một lần, có giới hạn phạm vi"],
          ["Liên kết", "Firstly · Moreover · Furthermore · In addition · Therefore; This trần", "This objection · the latter · such issues · those in part-time work; 0 từ nối đầu câu"],
          ["Lỗi", "4 lỗi hình thức trong 9 câu", "0 lỗi trong 6 câu"],
          ["Lập luận", "sáu ý rời, không ý nào được chống đỡ", "một lý do → phản bác → bác lại → hệ quả"],
        ],
        caption: "Vì sao bản nhiều cấu trúc hơn lại thấp điểm hơn",
      },
      {
        t: "note",
        title: "💡 Mẹo — phép thử “bỏ đi có mất gì không”",
        items: [
          "Viết lại câu bằng dạng thường. Nếu nghĩa và trọng tâm không đổi, cấu trúc hiếm ở đó là trang trí: bỏ.",
          "Mỗi câu chẻ phải trả lời được: “không phải … mà là …” — điền được hai chỗ trống thì giữ.",
          "Hai cấu trúc nổi không đứng cạnh nhau. Sau một câu đảo ngữ là một câu thường, ngắn.",
          "Khi soát bài (lượt 5 của bảng tự soát 6 lượt), khoanh mọi cấu trúc nổi. Hơn 4 cái trong một bài: xoá cái yếu nhất.",
        ],
      },
      { t: "rule", formula: "1 câu chẻ + 0–1 đảo ngữ + 2 nhượng bộ (khác khuôn) + this / such / the latter / do so ở mọi đoạn  ≤  4 cấu trúc “nổi” / bài", vi: "Ngân sách cấu trúc cho một bài Task 2 band 8." },

      /* ── 7 ── */
      { t: "h", text: "7. Sáu lỗi hình thức — bảng soát" },
      {
        t: "table",
        head: ["Lỗi", "Câu sai", "Câu đúng", "Cách soát"],
        rows: [
          ["Quên đảo sau Only + mệnh đề", "~~Only if fares fall people will leave their cars.~~", "Only if fares fall **will people** leave their cars.", "tìm Only đầu câu → nhìn mệnh đề chính"],
          ["Đảo khi Only bổ nghĩa chủ ngữ", "~~Only can the state afford this.~~", "Only **the state can** afford this.", "sau Only là danh từ chủ ngữ → không đảo"],
          ["the reason… is because", "~~The reason is because costs rose.~~", "The reason is **that** costs rose.", "tìm reason → nhìn chữ sau is"],
          ["Although… but", "~~Although it helps, but it is costly.~~", "Although it helps, it is costly.", "tìm although → xoá but"],
          ["albeit / despite + mệnh đề", "~~albeit it was late~~ · ~~despite it was late~~", "albeit **late** · despite **being** late", "sau albeit / despite không có S + V"],
          ["this trần / former–latter xa", "~~This shows…~~ (ba ý phía trước)", "**This pattern** shows…", "mỗi this đầu câu phải có danh từ"],
        ],
      },
      {
        t: "mcq",
        id: "t5d13-sau-loi",
        title: "Câu nào KHÔNG có lỗi? (6 câu)",
        items: [
          { q: "1.", options: ["A  Only when rents fall young families will return to the centre.", "B  Only when rents fall will young families return to the centre.", "C  Only when do rents fall young families will return to the centre."], correct: 1, why: "Đảo ở mệnh đề chính: will young families return. A quên đảo; C đảo nhầm ở vế when." },
          { q: "2.", options: ["A  The reason the scheme failed is because it was underfunded.", "B  The reason why the scheme failed is due to it was underfunded.", "C  The reason the scheme failed is that it was underfunded."], correct: 2, why: "The reason… is that + mệnh đề. A: is because thừa nghĩa. B: due to + mệnh đề sai." },
          { q: "3.", options: ["A  Although the tax is unpopular, it has cut emissions.", "B  Although the tax is unpopular, but it has cut emissions.", "C  Despite the tax is unpopular, it has cut emissions."], correct: 0, why: "Although không đi với but; despite không đi với mệnh đề." },
          { q: "4.", options: ["A  Only can central government fund a project of this scale.", "B  Only central government can fund a project of this scale.", "C  Only central government can it fund a project of this scale."], correct: 1, why: "Only bổ nghĩa chủ ngữ (central government) → trật tự thường, không đảo." },
          { q: "5.", options: ["A  The reform succeeded, albeit it took a decade.", "B  The reform succeeded, albeit after a decade.", "C  The reform succeeded, albeit that took a decade."], correct: 1, why: "albeit + cụm (after a decade), không + mệnh đề." },
          { q: "6.", options: ["A  Not only the policy reduced crime, but it also saved money.", "B  Not only did the policy reduced crime, but it also saved money.", "C  Not only did the policy reduce crime, but it also saved money."], correct: 2, why: "Not only + did + S + V nguyên mẫu. A không đảo; B chia reduced sau did." },
        ],
      },
      { t: "rule", formula: "Only + mệnh đề → đảo ở mệnh đề chính   ·   Only + chủ ngữ → không đảo   ·   reason … is that   ·   albeit / despite + cụm", vi: "Bốn dòng soát lỗi của bài hôm nay." },

      /* ── 8 ── */
      { t: "h", text: "8. Kiểm tra cuối bài (14 câu)" },
      {
        t: "mcq",
        id: "t5d13-np-chon",
        title: "Chọn phương án tốt nhất cho một bài Task 2 band 8 (8 câu)",
        items: [
          { q: "1. Bạn vừa thuật ý “tội phạm tăng vì hình phạt nhẹ” và muốn nói nguyên nhân thật là cơ hội việc làm. Câu nào hợp nhất?", options: ["A  Moreover, job opportunities are also a cause of crime.", "B  It is the absence of job opportunities, not the leniency of sentences, that drives young people into crime.", "C  Never do lenient sentences cause crime."], correct: 1, why: "Việc cần làm: sửa một cách nhìn (không phải A mà là B) → câu chẻ có vế not. A chỉ cộng thêm; C khẳng định quá mức và đảo ngữ sai việc." },
          { q: "2. Câu chốt thân bài 2 nêu giải pháp duy nhất. Chọn:", options: ["A  Only by making public transport reliable can cities persuade drivers to give up their cars.", "B  Only by making public transport reliable cities can persuade drivers to give up their cars.", "C  It is undeniable that public transport should be reliable."], correct: 0, why: "Only by + V-ing → đảo can cities persuade. B quên đảo. C là câu rỗng." },
          { q: "3. Chọn câu nối tốt nhất sau: “Many employers still refuse to let staff work from home.”", options: ["A  Moreover, this is bad.", "B  This is because of many reasons.", "C  This reluctance is hard to justify when productivity has not fallen."], correct: 2, why: "This + danh từ tóm tắt (reluctance = refuse) nắm lấy câu trước và đẩy lập luận đi tiếp." },
          { q: "4. Trong một bài 290 từ đã có “Not only does…” ở thân bài 1, câu nào nên viết ở kết bài?", options: ["A  Rarely have we seen such a problem, and never should we ignore it.", "B  In conclusion, the benefits of the policy outweigh its costs, provided that it is properly funded.", "C  Only then can we, and never before could we, solve it."], correct: 1, why: "Đã dùng hết ngân sách đảo ngữ; kết bài cần rõ và có điều kiện (provided that). A, C nhồi đảo ngữ." },
          { q: "5. Chọn khuôn nhượng bộ đúng hình thức:", options: ["A  Much as I admire the aims of the scheme, I doubt that it can be afforded.", "B  Much as the scheme is expensive, I support it.", "C  Much I admire the aims of the scheme, but I doubt it."], correct: 0, why: "Much as + động từ cảm nghĩ (admire, sympathise). B dùng với be expensive không tự nhiên (dùng Expensive as the scheme is). C thiếu as và thừa but." },
          { q: "6. “Schools can lengthen the day or shorten the holidays. ___ would be far less popular with teachers.”", options: ["A  The latter", "B  The last", "C  This"], correct: 0, why: "Hai lựa chọn vừa nêu → the latter (shorten the holidays). The last dùng cho danh sách ≥ 3; This mơ hồ." },
          { q: "7. Câu nào là nhượng bộ có giới hạn phạm vi?", options: ["A  Online courses are cheap and they are convenient.", "B  Online courses may suit motivated adults, but they rarely work for younger pupils.", "C  Online courses are undeniably the future of education."], correct: 1, why: "may…, but… thừa nhận đúng trong một phạm vi (motivated adults) rồi giới hạn." },
          { q: "8. Câu nào dùng điều kiện đảo ngữ đúng?", options: ["A  Were the subsidy to be withdrawn, many rural routes would close.", "B  Were the subsidy withdrawn, many rural routes will close.", "C  Was the subsidy to withdraw, many rural routes would close."], correct: 0, why: "Were + S + to be V3, S + would V. B sai thì (will). C sai was và sai thể bị động." },
        ],
      },
      {
        t: "quiz",
        id: "t5d13-np-sua",
        kind: "fill",
        title: "Mỗi câu một lỗi — gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "Only if parents are involved [schools can] improve attendance.", answers: ["can schools"], hint: "Only if + mệnh đề → đảo ở mệnh đề chính." },
          { q: "The reason so few people cycle is [because] the roads feel unsafe.", answers: ["that"], hint: "The reason… is that." },
          { q: "[Despite] the plan is costly, it deserves support.", answers: ["Although", "Though", "While", "Even though"], hint: "Sau đó là mệnh đề S + V → although." },
          { q: "Not only [the museum attracts] tourists, but it also employs two hundred local people.", answers: ["does the museum attract"], hint: "Not only + does + S + V nguyên mẫu." },
          { q: "The new line is faster, [albeit it is] more expensive.", answers: ["albeit", "although it is", "though it is"], hint: "albeit + tính từ: albeit more expensive." },
          { q: "Wages have stagnated while rents have risen. [This] has pushed many families out of the city. (thêm danh từ)", answers: ["This combination", "This squeeze", "This gap", "This situation", "This trend", "This pressure"], hint: "This + danh từ tóm tắt hai việc cùng lúc: combination / squeeze / gap." },
        ],
      },
      {
        t: "note",
        title: "Sau bài này — việc phải làm với bài viết của bạn",
        items: [
          "Mở bài Task 2 gần nhất (Đề 9 ở Online Test). Khoanh mọi câu chẻ, đảo ngữ, nhượng bộ. Đếm. Hơn 4: xoá cái yếu nhất. Chưa có nhượng bộ nào: thêm một ở thesis.",
          "Gạch chân mọi từ nối đầu câu. Hơn 4: thay hai cái bằng this + danh từ tóm tắt.",
          "Ghi vào Sổ lỗi khuôn nào bạn còn sai hình thức (theo bảng mục 7). Ngày 21 sẽ đưa đúng ba cấu trúc hiếm này vào Speaking Part 3.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d13-doc",
    kind: "reading",
    title: "Đọc: Reading đủ 3 passage · 40 câu · 55 phút — lần 1 của Tập 5 (mục tiêu 33+/40)",
    goal: "Làm trọn một bài Reading Academic ba passage (khoảng 2.600 từ, 40 câu, 7 dạng câu hỏi, Passage 3 là văn lập luận trừu tượng) trong 55 phút theo nhịp 15 – 18 – 20 + 2 phút soát, đạt ít nhất 33/40 (≈ band 7.5), và phân loại được từng câu sai theo ba nguyên nhân (không tìm ra chỗ · hiểu sai paraphrase · suy quá mức) để hai lần sau (Ngày 19 · 27) lên 35+.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Reading 7.0 → 8.0**: band 8 cần **35/40**; hôm nay mục tiêu **33**, và làm trong ==55 phút chứ không phải 60== để ngày thi còn 5 phút dự phòng.",
          "Ba passage tự soạn, khó dần: lịch sử kỹ thuật (thực tế) → sinh học có nhiều giả thuyết cạnh tranh → lập luận xã hội – triết học.",
          "Bảy dạng: TFNG · Note completion · Matching information · Matching features · Summary (từ trong bài) · Multiple choice · YNNG · Summary (hộp từ).",
          "Nhịp **15 – 18 – 20 – 2**. Đọc mỗi passage ==một lần== theo cách của Ngày 1 (ghi lề 3–5 chữ mỗi đoạn), rồi mới trả lời.",
          "Không bỏ trống câu nào. Câu bí quá 60 giây: chọn đáp án tạm, đánh dấu, đi tiếp.",
          "Chấm xong phải làm bảng phân loại lỗi ở cuối bài — điểm số chỉ có ích khi biết mình mất điểm vì đâu.",
        ],
      },

      { t: "h", text: "1. Trước khi bấm giờ — kế hoạch 55 phút ở band 8" },
      {
        t: "table",
        head: ["Passage", "Câu", "Giờ", "Mục tiêu hôm nay", "Mục tiêu cuối tập"],
        rows: [
          ["1 — thực tế, mô tả", "1–13", "15 phút", "12–13 / 13", "13 / 13"],
          ["2 — nhiều giả thuyết, nhiều tên người", "14–26", "18 phút", "11 / 13", "12 / 13"],
          ["3 — lập luận trừu tượng", "27–40", "20 phút", "10–11 / 14", "12 / 14"],
          ["Soát cuối", "câu đã đánh dấu", "2 phút", "không đổi đáp án nếu không có chứng cứ mới", ""],
          ["**Tổng**", "40", "**55 phút**", "**33+**", "**35–37**"],
        ],
        caption: "Tập 4 Ngày 13 làm 60 phút, nhịp 17 – 20 – 23; hôm nay cắt 5 phút",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Mỗi passage — bốn bước",
        steps: [
          { label: "① 30 giây", sub: "Đọc tiêu đề + lướt các nhóm câu hỏi: có mấy dạng, dạng nào theo thứ tự bài (TFNG, YNNG, completion, MCQ), dạng nào không (matching)." },
          { label: "② Đọc một lần, 5–6 phút", sub: "Ghi lề mỗi đoạn 3–5 chữ: nói về gì + làm gì (nêu giả thuyết · bác · bằng chứng · nhượng bộ)." },
          { label: "③ Trả lời theo nhóm", sub: "Dạng theo thứ tự làm trước; matching làm sau, dựa vào ghi lề." },
          { label: "④ Chốt", sub: "Câu chưa chắc: ghi đáp án tạm + dấu ?. Sang passage sau đúng giờ." },
        ],
      },
      {
        t: "note",
        title: "📌 Ba điều khác Tập 4",
        items: [
          "Đề band 8 có nhiều câu mà ==hai phương án đều có chữ trong bài==; phương án đúng là cái khớp cả MỨC ĐỘ (some / most / only) lẫn CHỦ THỂ (ai nói, ai làm).",
          "Passage 2 có năm nhà nghiên cứu. Lúc đọc, khoanh tên và ghi lề một chữ cho phát hiện của từng người — khi đó Matching features chỉ mất 3 phút.",
          "Passage 3: người viết thuật ý của người khác rất nhiều. Trước mỗi câu YNNG, hỏi “đây là ý của NGƯỜI VIẾT hay của người được thuật?”.",
        ],
      },
      { t: "p", text: "Chuẩn bị đồng hồ đếm ngược **55 phút**. Không tra từ điển. Che phần đáp án (nút 💡) cho tới khi hết giờ. Bấm giờ rồi bắt đầu." },

      /* ───────────── PASSAGE 1 ───────────── */
      { t: "h", text: "READING PASSAGE 1 — Questions 1–13 (15 phút)" },
      {
        t: "passage",
        title: "Letters Through the Pipes",
        intro: "You should spend about 15 minutes on Questions 1–13, which are based on Reading Passage 1.",
        paras: [
          { text: "In the middle of the nineteenth century the electric telegraph could carry a message between two cities in minutes, yet the final stage of its journey was frequently the slowest. A telegram arriving at a central office still had to be handed to a messenger boy, who carried it on foot through crowded streets to the bank or trading house that was waiting for it. In London in 1853 an engineer named Josiah Latimer Clark proposed a remedy: a narrow tube laid beneath the pavement, through which a small cylinder containing the message would be drawn by a pump at the far end. His first line, which ran for roughly two hundred metres between the Stock Exchange and the central station of a telegraph company, worked well enough for others to follow." },
          { text: "The principle was simple. Messages were rolled up and placed inside a carrier, a capsule of metal or leather fitted with rings of felt so that it sat tightly in the pipe. A steam engine drove a pump which either removed the air ahead of the carrier or forced air in behind it; in both cases the difference in pressure pushed the carrier along. The earliest lines, Clark's included, could only suck, so traffic ran in one direction and empty carriers had to be returned by hand. Within about a decade engineers had learned to combine suction with compressed air, which allowed carriers to travel both ways through the same tube." },
          { text: "Other capitals took up the idea. Berlin opened its first line in 1865 and Paris followed a year later, and it was in these two cities, rather than in London, that the system grew into a service for the general public. By the early twentieth century a Parisian could buy a special lightweight letter-card, drop it into a marked box and expect it to reach any address in the city within about two hours, the last stage being completed by a messenger on a bicycle. The network eventually extended to more than four hundred kilometres of pipe, most of it hung from the roofs of the city's sewers, an arrangement which spared the authorities the expense of digging up the streets. Berlin's network was of comparable length and at its busiest handled several million items a year." },
          { text: "The most ambitious systems of all were built in the United States. From 1897 the main post offices of several large American cities, New York among them, were linked by tubes some twenty centimetres across, wide enough for carriers that each held several hundred letters. The carriers travelled at around 50 kilometres an hour, and the men who loaded and received them became known as rocketeers. According to a story that has often been repeated, a live cat was placed in a carrier at the opening ceremony in New York and emerged dazed but unharmed. Whatever the truth of the tale, the system in its best years is thought to have carried something like a third of the city's letter mail." },
          { text: "It did not last. The tubes had always had drawbacks. Carriers jammed, and finding one that had stuck somewhere beneath a busy street was no simple matter; engineers in Paris are said to have located blockages by firing a pistol into the pipe and timing the echo. Capacity was fixed, since the pipes could not be enlarged without being rebuilt. Above all, the tubes were costly. The American government did not own them but rented them from private companies at a high annual charge for every mile, and when motor vans became common they proved both cheaper and more flexible. Service in most American cities was suspended in 1918, and although the New York tubes were later brought back into use, they closed for good in 1953. The last section of the Berlin network survived until 1976 and the Paris service until 1984. The last city network to remain in service was that of Prague, which was still carrying messages when floods in 2002 damaged it so badly that it has not operated since." },
          { text: "Why did the European systems outlast the American ones by several decades? Part of the answer is that they carried something different. The American tubes moved ordinary mail in bulk between sorting offices, a task that a van could perform equally well. The European ones offered the public a premium service, an urgent written message delivered within an hour or two, for which there was no real substitute until the telephone, and later the fax machine, became universal. Once most households had the former and most offices the latter, the pneumatic letter had lost its purpose." },
          { text: "The technology itself, however, has not vanished so much as moved indoors. Many large hospitals use tubes to send blood samples from wards to laboratories, banks and supermarkets use them to move cash from the tills to a secure room, and some factories use them to deliver small parts to the production line. Modern systems are directed by computer, which chooses a route for each carrier and slows it gently before arrival so that fragile contents are not shaken. In such settings the old advantages still hold: a tube is not delayed by lifts, corridors or traffic, and nobody has to accompany what it carries." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–6** — Do the following statements agree with the information given in Reading Passage 1? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.",
      },
      {
        t: "mcq",
        id: "t5d13-doc-p1-tfng",
        title: "Questions 1–6 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "1. Before pneumatic tubes, the last part of a telegram's delivery often took longer than the rest.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn 1: “the final stage of its journey was frequently the slowest”. often ≈ frequently; took longer than the rest ≈ the slowest." },
          { q: "2. Clark's first line could send carriers in either direction.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn 2: “The earliest lines, Clark's included, could only suck, so traffic ran in one direction”. Hai chiều chỉ có “within about a decade”." },
          { q: "3. The decision to run the Paris pipes through the sewers saved money.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn 3: “spared the authorities the expense of digging up the streets”. saved money ≈ spared… the expense." },
          { q: "4. The Berlin network carried more items each year than the Paris network.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói mạng Berlin “of comparable length” và “several million items a year”; không có số lượng thư của Paris để so. Bẫy: comparable nói về chiều dài, không phải lượng thư." },
          { q: "5. The cat sent through the New York tubes belonged to one of the postal workers.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn 4 kể chuyện con mèo nhưng không nói nó của ai." },
          { q: "6. The tubes used by American post offices were the property of the government.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn 5: “The American government did not own them but rented them from private companies”." },
        ],
      },
      { t: "p", text: "**Questions 7–13** — Complete the notes below. Choose **ONE WORD AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "note",
        title: "Pneumatic post — notes",
        items: [
          "**How it worked:** carrier kept tight in the pipe by rings made of **7** ___",
          "**Paris:** most pipes were suspended inside the **8** ___ of the city",
          "**United States:** staff who handled the carriers were called **9** ___ ; carriers moved at about **10** ___ kilometres an hour",
          "**Problems:** in Paris, a blocked carrier was found by timing the echo of a **11** ___",
          "**Decline:** most American services were halted in **12** ___",
          "**Today:** hospitals send samples of **13** ___ to their laboratories by tube",
        ],
      },
      {
        t: "quiz",
        id: "t5d13-doc-p1-ghi-chu",
        kind: "fill",
        title: "Questions 7–13 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "7", answers: ["felt"], hint: "Đoạn 2: “fitted with rings of felt so that it sat tightly in the pipe”. kept tight ≈ sat tightly." },
          { q: "8", answers: ["sewers"], hint: "Đoạn 3: “hung from the roofs of the city's sewers”. suspended ≈ hung. Không viết roofs: ống treo TRONG cống." },
          { q: "9", answers: ["rocketeers"], hint: "Đoạn 4: “the men who loaded and received them became known as rocketeers”." },
          { q: "10", answers: ["50", "fifty"], hint: "Đoạn 4: “travelled at around 50 kilometres an hour”. Nhiễu: twenty (centimetres), 1897." },
          { q: "11", answers: ["pistol"], hint: "Đoạn 5: “firing a pistol into the pipe and timing the echo”." },
          { q: "12", answers: ["1918"], hint: "Đoạn 5: “Service in most American cities was suspended in 1918”. Nhiễu: 1953 là năm New York đóng hẳn." },
          { q: "13", answers: ["blood"], hint: "Đoạn 7: “send blood samples from wards to laboratories”." },
        ],
      },

      /* ───────────── PASSAGE 2 ───────────── */
      { t: "h", text: "READING PASSAGE 2 — Questions 14–26 (18 phút)" },
      {
        t: "passage",
        title: "The Riddle of the Zebra's Stripes",
        intro: "You should spend about 18 minutes on Questions 14–26, which are based on Reading Passage 2.",
        paras: [
          { label: "A", text: "Few patterns in nature are as conspicuous as the coat of a zebra, and few have attracted as much speculation. In the nineteenth century Alfred Russel Wallace suggested that the stripes helped to conceal the animal at dusk or among tall grasses; Charles Darwin was unconvinced, pointing out that on the open plains where zebras spend much of their time they could hardly be easier to see. In the century and a half since that exchange, more than a dozen explanations have been put forward. Only in the last twenty years or so, however, have they been tested systematically against one another." },
          { label: "B", text: "The oldest idea, camouflage, has fared badly. In 2016 a team led by Amanda Melin took what is known about the eyesight of lions and hyenas, which is considerably less sharp than our own, and calculated how a zebra would appear to them at various distances. Their conclusion was that beyond about fifty metres in daylight, and rather less at twilight, the stripes merge into a uniform grey. At that range a predator would already have heard or smelt its prey. Stripes that cannot be seen until the hunter is close can do little to hide the animal's outline." },
          { label: "C", text: "A second proposal holds that stripes protect not a stationary zebra but a running one. Just as some warships in the First World War were painted with bold geometric shapes so that enemy gunners would misjudge their speed and heading, the moving stripes of a fleeing herd might mislead a pursuing lion. Computer modelling by Martin How and a colleague, published in 2014, showed that striped surfaces in motion can indeed generate false signals of direction in a visual system. Whether lions are actually deceived is another matter. Zebras are killed by them at least as often as their numbers would predict, which is not what one would expect if the pattern offered much protection." },
          { label: "D", text: "A third explanation concerns heat. Black hair absorbs more sunlight than white, and it has been proposed that the resulting differences in temperature set up tiny currents of air that cool the skin. Brenda Larison and her colleagues, who in 2015 compared zebra populations at sixteen sites across Africa, found that the boldness of the striping was better predicted by temperature than by any other factor they examined: the warmer the region, the stronger the stripes. Field measurements in Kenya by Alison and Stephen Cobb later confirmed that at midday the black stripes of a living zebra are well over ten degrees hotter than the white ones. On the other hand, when another group filled barrels with water and wrapped them in striped and plain coverings, the striped barrels stayed no cooler than the rest." },
          { label: "E", text: "The explanation that currently commands most support involves insects. In 2012 a Hungarian team headed by Gábor Horváth set out models of horses painted in different patterns and counted the horseflies they attracted. These flies are drawn to dark surfaces, which reflect light in a way that resembles water, but striped models attracted far fewer of them than either black or white ones, and the narrower the stripes, the fewer flies arrived. Two years later Tim Caro compared the ranges of striped and unstriped members of the horse family with maps of several environmental factors. Striping, he reported, coincided closely with regions where biting flies are active for much of the year; it showed no such relationship with the distribution of large predators." },
          { label: "F", text: "Caro's team followed this up in 2019 on a farm in Britain that kept both horses and zebras. Flies approached the two kinds of animal equally often, but as they neared a zebra they failed to slow down, and either flew past or collided with it clumsily rather than landing. When the researchers dressed horses in striped coats, far fewer flies settled on the covered parts of the body than on horses wearing plain black or white coats, although the number landing on their uncovered heads was unchanged. Why would this matter enough to shape an animal's evolution? In Africa, biting flies transmit several diseases that are fatal to horses and their relatives, and because a zebra's hair is unusually short, the insects have no difficulty in biting through it." },
          { label: "G", text: "The matter is not closed. Larison maintains that a feature as costly as a striped coat may well serve more than one purpose, and she notes that flies themselves are most active where it is warm and humid, so that an explanation based on insects and one based on temperature are not easily separated by comparing maps. What is no longer in doubt is how the question should be approached. For a hundred and fifty years the debate was conducted by naturalists proposing ever more ingenious stories. It began to make progress only when someone thought to measure what a lion can see and to count where a fly lands." },
        ],
      },
      {
        t: "p",
        text: "**Questions 14–18** — Reading Passage 2 has seven paragraphs, **A–G**. Which paragraph contains the following information? Write the correct letter, **A–G**. **NB** You may use any letter more than once.",
      },
      {
        t: "quiz",
        id: "t5d13-doc-p2-thong-tin",
        kind: "fill",
        title: "Questions 14–18 — viết chữ cái A–G",
        items: [
          { q: "14. a comparison with a practice once used in warfare", answers: ["C"], hint: "C: “Just as some warships in the First World War were painted with bold geometric shapes…”." },
          { q: "15. an estimate of the distance at which a pattern can no longer be made out", answers: ["B"], hint: "B: “beyond about fifty metres in daylight… the stripes merge into a uniform grey”." },
          { q: "16. the point that two rival explanations are hard to tell apart", answers: ["G"], hint: "G: “an explanation based on insects and one based on temperature are not easily separated”." },
          { q: "17. a reference to a disagreement between two early naturalists", answers: ["A"], hint: "A: Wallace đề xuất, “Charles Darwin was unconvinced” — “that exchange”." },
          { q: "18. a reason why a particular insect is especially dangerous to zebras", answers: ["F"], hint: "F: “biting flies transmit several diseases that are fatal… because a zebra's hair is unusually short”. E chỉ nói ruồi bị hút tới đâu, không nói vì sao nguy hiểm." },
        ],
      },
      {
        t: "p",
        text: "**Questions 19–23** — Look at the following findings and the list of researchers below. Match each finding with the correct researcher, **A–E**.",
      },
      { t: "table", head: ["", "List of Researchers"], rows: [["A", "Amanda Melin"], ["B", "Martin How"], ["C", "Brenda Larison"], ["D", "Gábor Horváth"], ["E", "Tim Caro"]] },
      {
        t: "quiz",
        id: "t5d13-doc-p2-nguoi",
        kind: "fill",
        title: "Questions 19–23 — viết chữ cái A–E",
        items: [
          { q: "19. Stripes tend to be more pronounced in hotter places.", answers: ["C"], hint: "D: Larison — “the warmer the region, the stronger the stripes”. more pronounced ≈ stronger / boldness." },
          { q: "20. Certain insects are less attracted to a striped surface than to a plain one.", answers: ["D"], hint: "E: Horváth — “striped models attracted far fewer of them than either black or white ones”." },
          { q: "21. Hunting animals are unable to distinguish stripes until they are near their prey.", answers: ["A"], hint: "B: Melin — “Stripes that cannot be seen until the hunter is close”." },
          { q: "22. Where striped species live corresponds to where a certain pest is found.", answers: ["E"], hint: "E: Caro — “Striping… coincided closely with regions where biting flies are active”. corresponds to ≈ coincided with." },
          { q: "23. A striped pattern in motion can give a misleading impression of where something is heading.", answers: ["B"], hint: "C: How — “striped surfaces in motion can indeed generate false signals of direction”." },
        ],
      },
      { t: "p", text: "**Questions 24–26** — Complete the summary below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer." },
      {
        t: "note",
        title: "The 2019 farm study",
        items: [
          "Flies came close to horses and zebras at the same rate. However, when they got near a zebra they did not **24** ___ , and so were unable to land properly.",
          "Horses that were given striped coats had fewer flies on their bodies, but just as many on their **25** ___ .",
          "The findings matter because flies carry fatal diseases and can easily bite through a zebra's **26** ___ .",
        ],
      },
      {
        t: "quiz",
        id: "t5d13-doc-p2-tom-tat",
        kind: "fill",
        title: "Questions 24–26 — NO MORE THAN TWO WORDS",
        items: [
          { q: "24", answers: ["slow down"], hint: "F: “as they neared a zebra they failed to slow down”. did not ≈ failed to." },
          { q: "25", answers: ["heads", "uncovered heads"], hint: "F: “the number landing on their uncovered heads was unchanged”. just as many ≈ unchanged." },
          { q: "26", answers: ["hair"], hint: "F: “because a zebra's hair is unusually short, the insects have no difficulty in biting through it”." },
        ],
      },

      /* ───────────── PASSAGE 3 ───────────── */
      { t: "h", text: "READING PASSAGE 3 — Questions 27–40 (20 phút + 2 phút soát)" },
      {
        t: "passage",
        title: "The Word That Changed Sides",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3.",
        paras: [
          { text: "Few political terms have travelled as far from their origins as “meritocracy”. Today it is used as a term of praise by politicians of almost every party, a promise that positions will go to the able and the hard-working rather than to the well-born. Yet the word was coined as a warning. The British sociologist Michael Young introduced it in a book published in 1958, The Rise of the Meritocracy, a satire written in the voice of a self-satisfied historian looking back from the year 2034 on a society that had learned to sort its members by intelligence tests. In that society merit is defined as intelligence plus effort, and the story ends in revolt." },
          { text: "It was not to the appointment of competent people that Young objected. His concern was with what happens to a society once it believes that it has sorted its members fairly. Under an aristocracy, those at the bottom could tell themselves that their position reflected their birth and not their worth, and those at the top, in their more honest moments, knew the same. In a perfected meritocracy this consolation disappears. The successful come to believe that they deserve everything they have; the unsuccessful are told, and may come to accept, that they have nobody to blame but themselves. Young thought such an arrangement crueller than the old injustice and, in the long run, more dangerous. In 2001, shortly before his death, he complained in a newspaper article that the term had been taken up with enthusiasm by the government of the day without, he suspected, anyone there having read the book it came from." },
          { text: "The most familiar criticism of meritocracy is a practical one: it has never been achieved. The children of wealthy parents arrive at school with larger vocabularies, private tutors and quiet rooms in which to work, so that examinations designed to detect ability detect, in part, preparation. Critics of this kind accept the ideal and complain only that the race is rigged. Their remedy is to make the competition fairer, through scholarships, for instance, or earlier help for disadvantaged children." },
          { text: "The second criticism, which was Young's own, goes deeper. Even a perfectly fair contest would distribute rewards according to qualities that nobody chose. Talent is in part inherited; and the willingness to work hard, which we like to regard as wholly our own doing, depends a good deal on upbringing, health and the example of those around us. If that is so, the winner of a fair race can be said to have earned the prize but not to have earned the legs. It does not follow that prizes should be abolished, since they may be useful in encouraging people to develop what abilities they have. The conclusion to draw is that winners owe more humility, and losers are owed more respect, than meritocratic thinking allows." },
          { text: "The economist Robert Frank has added a third consideration: the part played by chance even among the equally deserving. In many modern markets, from entertainment to law and technology, rewards are concentrated on a handful of top performers, although the difference between them and their nearest rivals is tiny. Frank ran computer simulations of contests in which the result depended overwhelmingly on ability and effort, with luck counting for only a few per cent. When the number of contestants was large, the winner was seldom the most able person in the field. It was usually someone very able who had also been unusually fortunate. The reason is arithmetical. Among thousands of competitors many are close to the top in skill, and among those, somebody will have had almost the best possible luck." },
          { text: "Successful people rarely see their careers in this way, and Frank offers a psychological explanation. A cyclist, he observes, is far more aware of a wind blowing against her than of one blowing from behind. In the same way, the obstacles we have overcome remain vivid in memory, while the encouraging teacher, the well-timed introduction and the favourable year of our birth fade from it. Nor is this mere vanity. Someone convinced that success is a lottery may see little point in trying, and to that extent the belief that effort decides everything does the believer some good. Useful as this belief may be to the individual, it serves the wider community poorly. Those who credit themselves alone tend to resent contributing to the schools, roads and courts that made their success possible. In experiments described by Frank, people who had been asked to recall outside factors that had helped them subsequently gave more to charity than those asked to recall their own good qualities." },
          { text: "None of this amounts to an argument for choosing surgeons by lot. Selection by competence remains better than any alternative that has been tried, and the two practical critics are right that it could be made fairer than it is. What the history of Young's word suggests is rather that an arrangement which is defensible as a method of filling posts becomes troubling when it is treated as a verdict on human worth. A society can reward the capable without concluding that the unrewarded are incapable, and can honour effort while admitting that no one chooses the starting line. That Young's warning has so often been mistaken for a recommendation is perhaps the best evidence that it was needed." },
        ],
      },
      { t: "p", text: "**Questions 27–31** — Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq",
        id: "t5d13-doc-p3-chon",
        title: "Questions 27–31 — Multiple choice",
        items: [
          {
            q: "27. What point does the writer make about the word “meritocracy” in the first paragraph?",
            options: ["A  Its meaning has become too vague to be useful.", "B  It was invented by politicians seeking votes.", "C  It is now used in a sense opposite to the one its inventor intended.", "D  It first appeared in a work of serious history."],
            correct: 2,
            why: "“used as a term of praise… Yet the word was coined as a warning”. D bẫy: sách là “a satire written in the voice of a… historian”, không phải sử học nghiêm túc.",
          },
          {
            q: "28. According to Young, how would a perfected meritocracy differ from an aristocracy?",
            options: ["A  People at the top would feel less secure.", "B  People at the bottom would lose a comforting explanation of their position.", "C  Positions would no longer be passed from parents to children.", "D  Fewer people would be dissatisfied with their place in society."],
            correct: 1,
            why: "“those at the bottom could tell themselves that their position reflected their birth and not their worth… In a perfected meritocracy this consolation disappears.” A ngược: người ở trên tin mình xứng đáng.",
          },
          {
            q: "29. The critics described in the third paragraph",
            options: ["A  believe that the principle of rewarding merit is mistaken.", "B  think that examinations should be abolished.", "C  argue that wealthy parents should pay more for education.", "D  support the goal of meritocracy but deny that it has been reached."],
            correct: 3,
            why: "“Critics of this kind accept the ideal and complain only that the race is rigged.” A là phê bình thứ hai (đoạn 4), không phải đoạn 3.",
          },
          {
            q: "30. The writer refers to earning “the prize but not… the legs” in order to show that",
            options: ["A  the abilities which win a fair contest are not themselves deserved.", "B  athletes are rewarded more than they should be.", "C  hard work matters more than natural talent.", "D  fair contests are impossible to organise."],
            correct: 0,
            why: "“Even a perfectly fair contest would distribute rewards according to qualities that nobody chose.” Legs = tài năng + sự chăm chỉ không do mình chọn. C ngược: bài nói cả sự chăm chỉ cũng phụ thuộc hoàn cảnh.",
          },
          {
            q: "31. What did Frank's simulations show?",
            options: ["A  Luck is more important than ability in most careers.", "B  In a large contest, the most talented entrant usually fails to come first.", "C  Small contests are fairer than large ones.", "D  The best performers earn only slightly more than their rivals."],
            correct: 1,
            why: "“When the number of contestants was large, the winner was seldom the most able person in the field.” A suy quá mức: luck chỉ “a few per cent”. D ngược: rewards are concentrated dù khác biệt “tiny”.",
          },
        ],
      },
      {
        t: "p",
        text: "**Questions 32–36** — Do the following statements agree with the claims of the writer in Reading Passage 3? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t5d13-doc-p3-ynng",
        title: "Questions 32–36 — YES / NO / NOT GIVEN",
        items: [
          { q: "32. Young was opposed to giving jobs to people who were good at them.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“It was not to the appointment of competent people that Young objected.” Câu chẻ có not: phủ định đúng điều statement nói." },
          { q: "33. Young suspected that those in government who praised meritocracy did not know his book.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“without, he suspected, anyone there having read the book it came from”." },
          { q: "34. Scholarships have succeeded in making educational competition fair.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Scholarships chỉ được nêu là “remedy” mà nhóm phê bình thứ nhất đề xuất; bài không nói chúng đã thành công hay chưa." },
          { q: "35. Rewards for achievement ought to be done away with.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“It does not follow that prizes should be abolished, since they may be useful…”; đoạn cuối: “Selection by competence remains better than any alternative”." },
          { q: "36. Believing that effort determines success can benefit the person who holds that belief.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“the belief that effort decides everything does the believer some good”; “Useful as this belief may be to the individual”." },
        ],
      },
      {
        t: "p",
        text: "**Questions 37–40** — Complete the summary using the list of words, **A–H**, below.",
      },
      {
        t: "note",
        title: "Why the successful overlook luck",
        items: [
          "Frank suggests that successful people underestimate luck because of the way **37** ___ works: difficulties stay **38** ___ , whereas help received is forgotten.",
          "This outlook may encourage **39** ___ , but it also makes people less willing to pay for **40** ___ .",
        ],
      },
      {
        t: "table",
        head: ["A", "B", "C", "D", "E", "F", "G", "H"],
        rows: [["charity", "effort", "invisible", "memory", "public services", "vanity", "vivid", "competition"]],
      },
      {
        t: "quiz",
        id: "t5d13-doc-p3-hop-tu",
        kind: "fill",
        title: "Questions 37–40 — viết chữ cái A–H",
        items: [
          { q: "37", answers: ["D"], hint: "“the obstacles we have overcome remain vivid in memory, while… fade from it” → cơ chế là memory. F (vanity) bị bài bác: “Nor is this mere vanity”." },
          { q: "38", answers: ["G"], hint: "“remain vivid in memory”. C (invisible) ngược nghĩa." },
          { q: "39", answers: ["B"], hint: "“Someone convinced that success is a lottery may see little point in trying” → tin vào nỗ lực thì chịu cố gắng: effort." },
          { q: "40", answers: ["E"], hint: "“resent contributing to the schools, roads and courts” = public services. A (charity) là bẫy: charity thuộc thí nghiệm, và người nhớ tới may mắn mới cho NHIỀU hơn." },
        ],
      },

      /* ───────────── CHẤM ───────────── */
      { t: "h", text: "Hết 55 phút — chấm điểm và phân loại lỗi" },
      {
        t: "table",
        head: ["Số câu đúng / 40", "Band Reading (ước tính)", "Nghĩa là"],
        rows: [
          ["39–40", "9.0", "Giữ nhịp; lần sau thử 50 phút."],
          ["37–38", "8.5", "Đã vượt đích. Xem lại 2–3 câu sai thuộc dạng nào."],
          ["35–36", "8.0", "Đúng đích của tập. Cần lặp lại được ở Ngày 19 và 27."],
          ["33–34", "7.5", "Đạt mục tiêu hôm nay. Thiếu 2 câu: gần như chắc ở Passage 3."],
          ["30–32", "7.0", "Vẫn ở mức đầu tập. Làm kỹ bảng phân loại bên dưới."],
          ["dưới 30", "≤ 6.5", "Hôm nay mệt hoặc lệch nhịp: xem bạn hết giờ ở passage nào, làm lại sau 3 ngày."],
        ],
        caption: "Quy đổi theo bảng công khai của Academic Reading — chỉ là ước tính trên một đề tự soạn",
      },
      {
        t: "table",
        head: ["Nhãn lỗi", "Dấu hiệu", "Thường gặp ở", "Cách chữa"],
        rows: [
          ["**K — không tìm ra chỗ**", "đọc lại cả bài mới thấy; hết giờ", "Matching information (14–18), Summary hộp từ (37–40)", "ghi lề khi đọc; Ngày 1 mục 3 · Ngày 5 mục 2"],
          ["**P — hiểu sai paraphrase**", "tìm đúng câu nhưng chọn sai", "TFNG 3 · 4, Features 19 · 22, MCQ 28", "gạch chân cặp từ đồng nghĩa trong 💡; Tập 4 Ngày 15 · Tập 5 Ngày 6"],
          ["**S — suy quá mức / nhầm chủ thể**", "chọn YES / TRUE cho điều bài không nói, hoặc nhầm ý người được thuật với ý người viết", "TFNG 4 · 5, YNNG 34, MCQ 31", "Ngày 3 (TFNG band 8) · Ngày 9 mục YNNG"],
          ["**C — chính tả / quá số từ**", "viết roofs, uncovered head, 50 km", "Notes 7–13, Summary 24–26", "chép nguyên dạng từ trong bài; đếm từ"],
        ],
        caption: "Ghi nhãn K / P / S / C cạnh từng câu sai rồi chép vào Sổ lỗi",
      },
      {
        t: "note",
        title: "💡 Mẹo: ba kiểu bẫy band 8 có trong đề hôm nay",
        items: [
          "**Chữ có trong bài nhưng nói về thứ khác:** câu 4 — comparable (chiều dài) bị mượn để gợi ý so sánh số thư; câu 40 — charity có trong bài nhưng ở thí nghiệm.",
          "**Ý của người được thuật ≠ ý người viết:** câu 34 — scholarships là đề xuất của nhóm phê bình, người viết không đánh giá kết quả.",
          "**Đúng hướng nhưng quá mức:** câu 31 A — luck có vai trò, nhưng “more important than ability” thì bài không nói; câu 30 D — bài giả định contest công bằng CÓ thể có.",
        ],
      },

      { t: "h", text: "Soi lại Passage 3 bằng ngữ pháp Bài 1 — người viết dùng “vừa đủ” thế nào" },
      { t: "p", text: "Passage 3 dài 900 từ và chỉ có ==hai câu chẻ, một đảo ngữ, một nhượng bộ khuôn hiếm==, mỗi cái ở đúng chỗ cần. Tìm chúng: điền MỘT từ lấy nguyên văn từ bài." },
      {
        t: "quiz",
        id: "t5d13-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ Passage 3 (6 câu)",
        items: [
          { q: "Câu chẻ có not (đoạn 2): It was ___ to the appointment of competent people that Young objected.", answers: ["not"], hint: "Việc của câu: loại cách hiểu sai (Young ghét người giỏi) trước khi nêu mối lo thật." },
          { q: "Danh từ tóm tắt (đoạn 2): In a perfected meritocracy this ___ disappears.", answers: ["consolation"], hint: "this consolation gói cả câu trước (tự nhủ vị trí do xuất thân) vào một danh từ." },
          { q: "Đảo ngữ (đoạn 6): ___ is this mere vanity.", answers: ["Nor"], hint: "Nor + is + S: thêm một ý phủ định, câu ngắn 5 từ đặt sau câu dài." },
          { q: "Nhượng bộ (đoạn 6): Useful ___ this belief may be to the individual, it serves the wider community poorly.", answers: ["as"], hint: "adj + as + S + may be — thừa nhận mạnh rồi bác; cả bài chỉ dùng một lần." },
          { q: "Câu chẻ What (đoạn 7): What the history of Young's word ___ is rather that…", answers: ["suggests"], hint: "Câu mang luận điểm chính của cả bài được dành cho What-cleft." },
          { q: "Liên kết (đoạn 3): Critics of this ___ accept the ideal and complain only that the race is rigged.", answers: ["kind"], hint: "Critics of this kind = những người phê bình vừa tả; không cần lặp lại nội dung." },
        ],
      },

      { t: "h", text: "Từ vựng hữu ích từ ba bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "conspicuous", pos: "adj", ipa: "/kənˈspɪkjuəs/", vi: "dễ thấy, đập vào mắt", ex: "Few patterns in nature are as conspicuous as a zebra's coat.", exVi: "Ít hoa văn nào trong tự nhiên dễ thấy như bộ lông ngựa vằn.", more: "conspicuous by its absence (vắng mặt mà ai cũng nhận ra) · trái nghĩa: inconspicuous" },
          { w: "speculation", pos: "n", ipa: "/ˌspekjuˈleɪʃn/", vi: "sự phỏng đoán (chưa có bằng chứng)", ex: "The discovery ended years of speculation about the cause.", exVi: "Phát hiện này chấm dứt nhiều năm phỏng đoán về nguyên nhân.", more: "speculate (v) about / on · pure / mere speculation · khác assumption (giả định ngầm)" },
          { w: "outlast", pos: "v", ipa: "/ˌaʊtˈlɑːst/", vi: "tồn tại lâu hơn", ex: "The European systems outlasted the American ones by decades.", exVi: "Các hệ thống châu Âu tồn tại lâu hơn hệ thống Mỹ hàng chục năm.", more: "out- + V = hơn: outnumber · outweigh · outperform · outlive" },
          { w: "drawback", pos: "n", ipa: "/ˈdrɔːbæk/", vi: "nhược điểm (của một thứ nhìn chung tốt)", ex: "The main drawback of the tubes was their fixed capacity.", exVi: "Nhược điểm chính của các ống là công suất cố định.", more: "a major / serious drawback of / to sth · nhẹ hơn disadvantage, trang trọng hơn downside" },
          { w: "premium", pos: "adj / n", ipa: "/ˈpriːmiəm/", vi: "cao cấp, giá cao hơn; khoản trả thêm", ex: "Customers paid extra for the premium service.", exVi: "Khách trả thêm tiền cho dịch vụ cao cấp.", more: "at a premium (khan hiếm, đắt) · put a premium on sth (coi trọng)" },
          { w: "merge", pos: "v", ipa: "/mɜːdʒ/", vi: "hoà vào nhau, sáp nhập", ex: "At a distance the stripes merge into a uniform grey.", exVi: "Nhìn từ xa các sọc hoà thành một màu xám đều.", more: "merge into / with · merger (n, sáp nhập công ty)" },
          { w: "ingenious", pos: "adj", ipa: "/ɪnˈdʒiːniəs/", vi: "khéo léo, tài tình (ý tưởng, thiết bị)", ex: "Naturalists proposed ever more ingenious explanations.", exVi: "Các nhà tự nhiên học đưa ra những lời giải thích ngày càng tài tình.", more: "⚠️ khác ingenuous (ngây thơ, thật thà) · ingenuity (n)" },
          { w: "satire", pos: "n", ipa: "/ˈsætaɪə/", vi: "tác phẩm châm biếm", ex: "The book was a satire on a society obsessed with testing.", exVi: "Cuốn sách là một tác phẩm châm biếm xã hội ám ảnh với thi cử.", more: "a satire on / of sth · satirical (adj) · satirise (v)" },
          { w: "consolation", pos: "n", ipa: "/ˌkɒnsəˈleɪʃn/", vi: "niềm an ủi", ex: "It was some consolation that nobody else had passed either.", exVi: "Cũng an ủi phần nào là không ai khác đỗ cả.", more: "console (v) · a consolation prize · small / little consolation" },
          { w: "rigged", pos: "adj", ipa: "/rɪɡd/", vi: "bị dàn xếp, không công bằng", ex: "Many voters believe that the system is rigged against them.", exVi: "Nhiều cử tri tin rằng hệ thống bị dàn xếp để chống lại họ.", more: "rig an election / a contest · văn nói và báo chí; trong bài luận dùng unfair / biased" },
          { w: "humility", pos: "n", ipa: "/hjuːˈmɪləti/", vi: "sự khiêm nhường", ex: "Success ought to be accompanied by a degree of humility.", exVi: "Thành công nên đi kèm một mức độ khiêm nhường.", more: "humble (adj) · with humility · ⚠️ khác humiliation (sự bẽ mặt)" },
          { w: "self-satisfied", pos: "adj", ipa: "/ˌself ˈsætɪsfaɪd/", vi: "tự mãn", ex: "The report's self-satisfied tone ignores the problems that remain.", exVi: "Giọng tự mãn của bản báo cáo phớt lờ những vấn đề còn tồn tại.", more: "gần nghĩa: complacent (Ngày 4) · trong bài: a self-satisfied historian (Passage 3, đoạn 1)" },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau buổi làm đủ",
        items: [
          "Ghi điểm từng passage (…/13 · …/13 · …/14) và thời gian thật vào sổ. So với Tập 4 Ngày 27.",
          "Mỗi câu sai: một dòng trong Sổ lỗi gồm nhãn K / P / S / C + cặp paraphrase đã lừa bạn.",
          "Passage nào dưới mục tiêu: đọc lại KHÔNG bấm giờ, gạch chân mọi chỗ người viết thuật ý người khác.",
          "Lần 2 ở Ngày 19 (mục tiêu 34), lần 3 ở Ngày 27 (mục tiêu 35+).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE (→ NÓI PART 3) ═══════════════════════════ */
  {
    id: "t5d13-nghe",
    kind: "listening",
    title: "Nghe Part 3 trừu tượng cấp cao: seminar về một nguyên tắc chính sách (giọng Ireland · Canada · Anh) → mượn khung để nói Part 3 triết lý – chính sách band 8; pause mang nghĩa",
    goal: "Theo được một cuộc thảo luận Part 3 khoảng 5 phút ở tốc độ thật (~175 từ/phút) mà nội dung là khái niệm chứ không phải việc cụ thể, biết ý nào của ai và ai đã đổi ý ở đâu để đúng 9–10/10 câu (MCQ + Matching ý kiến); rồi dùng chính các khung thừa nhận – giới hạn – định nghĩa lại vừa nghe để trả lời 5 câu Speaking Part 3 về triết lý và chính sách, có chỗ ngừng đặt đúng ranh giới ý.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Listening Part 3 → 9–10/10** và **Speaking Part 3 FC + LR band 8**. Bảng lộ trình ghi hôm nay là buổi Nói Part 3 trừu tượng; bài này lấy ==nghe làm đầu vào, nói làm đầu ra==.",
          "Part 3 band 8 khó vì người nói ==thừa nhận một nửa, giới hạn lại, rồi mới nêu ý mình== — câu hỏi kiểm xem bạn có theo được ai đang đứng ở đâu SAU khi họ đã nhượng bộ.",
          "Ba động tác cần nghe ra: **thừa nhận** (I take the point, but…) · **giới hạn** (in principle… in practice…) · **định nghĩa lại** (that rather depends on what we mean by…).",
          "Chính ba động tác đó là thứ đưa câu trả lời Part 3 của bạn từ “I think it depends” (band 7) lên band 8.",
          "🔊 **Pause mang nghĩa:** ngừng trước từ then chốt, sau vế nhượng bộ, và quanh phần chêm. Ngừng sai chỗ có thể đổi nghĩa cả câu.",
          "Nối Tập 4 Ngày 23 (Part 3 trừu tượng band 7) và Tập 5 Ngày 6 (phản biện, nhượng bộ, hedging).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Part 3 “trừu tượng” band 8 khác gì band 7" },
      {
        t: "table",
        head: ["", "Tập 4 Ngày 5 · 23 (band 7)", "Hôm nay (band 8)"],
        rows: [
          ["Nội dung", "việc cụ thể: chọn đề tài, chia việc, phương pháp", "một khái niệm: nó có nghĩa gì, có đứng vững không"],
          ["Ý kiến", "mỗi người một ý, giữ đến cuối", "ý kiến ==dịch chuyển==: nhượng một phần, đổi cách nói, có lúc đổi hẳn"],
          ["Câu hỏi", "Who suggests…? What do they decide?", "What does X find MOST significant? · Which view do BOTH hold?"],
          ["Bẫy", "người kia nói phương án sai", "chính người đó nói phương án sai trước rồi bác; hoặc đồng ý “về nguyên tắc”"],
          ["Tốc độ", "~165 từ/phút", "~175 từ/phút, lượt lời ngắn, cắt lời nhau"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách ghi khi nghe thảo luận trừu tượng",
        items: [
          "Kẻ hai cột tên người. Mỗi lần một người nêu lập trường, ghi 2–3 chữ. Mỗi lần họ NHƯỢNG, vẽ mũi tên sang cột kia.",
          "Đọc trước nhóm Matching: nếu có phương án “both”, bạn phải nghe tới HẾT lượt trao đổi về ý đó — người thứ hai thường phản ứng sau cùng.",
          "Câu hỏi có MOST / MAIN / FINALLY: đáp án nằm sau các tín hiệu “what strikes me is…”, “where we part company is…”, “put like that, fine”.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ba động tác của người tranh luận giỏi — nghe ra để nói lại" },
      {
        t: "table",
        head: ["Động tác", "Câu hay gặp", "Nghĩa thật", "Khi làm câu hỏi"],
        rows: [
          ["**Thừa nhận rồi giữ ý**", "I take the point, but… · That's fair, although… · I've no quarrel with that. Where we part company is…", "đồng ý MỘT phần; phần sau but mới là lập trường", "đừng tính là “đồng ý” nếu câu hỏi nói về phần sau but"],
          ["**Thừa nhận thật (đổi ý)**", "I'd accept that, actually. · Put like that, fine. · I'd go along with that.", "đã sang phía người kia", "đây là chỗ đáp án “both”"],
          ["**Bác thẳng**", "I don't buy that, I'm afraid. · I'm less convinced. · That's a bit cynical.", "không đồng ý", "ý đó chỉ thuộc về MỘT người"],
          ["**Giới hạn phạm vi**", "in principle… in practice… · up to a point · at least not as a general rule", "đúng trong một phạm vi", "phương án có always / all thường sai"],
          ["**Định nghĩa lại**", "That rather depends on what we mean by… · I'd put it differently. · That phrase is doing a great deal of work.", "vấn đề nằm ở một chữ chưa rõ", "câu hỏi kiểu What is the difficulty with…?"],
        ],
        caption: "Năm nhóm câu tín hiệu — học thuộc để nghe, rồi dùng để nói",
      },
      { t: "rule", formula: "I take the point, but …   ≠   I'd accept that, actually.", vi: "Câu đầu vẫn giữ lập trường riêng; câu sau là đổi ý thật — chỉ câu sau mới cho đáp án “cả hai đồng ý”." },

      /* ── 3 ── */
      { t: "h", text: "3. 🔊 Pause mang nghĩa — ngừng ở đâu, người nghe hiểu thế ấy" },
      {
        t: "p",
        text: "Ở Tập 4 Ngày 15 và Tập 5 Ngày 2 bạn đã ngừng đúng ranh giới cụm để câu dễ nghe. Hôm nay thêm một bậc: ==chỗ ngừng tự nó mang nghĩa==. Người nói giỏi ngừng nửa nhịp TRƯỚC từ họ muốn bạn nhớ, ngừng SAU vế nhượng bộ để báo “ý chính sắp tới”, và ngừng hai bên phần chêm (I think, however, of course). Trong bài nghe, đáp án rất hay đứng ngay sau một chỗ ngừng như vậy.",
      },
      {
        t: "table",
        head: ["Kiểu ngừng", "Ví dụ ( | = ngừng ngắn, ‖ = ngừng rõ)", "Người nghe hiểu"],
        rows: [
          ["Trước từ then chốt", "What worries me isn't the cost | but ‖ **who pays it**.", "phần sau chỗ ngừng là trọng tâm"],
          ["Sau vế nhượng bộ", "In principle, yes. ‖ In practice | it depends.", "“yes” chưa phải câu trả lời cuối"],
          ["Quanh phần chêm", "That | I think | is the real question.", "I think là chêm, không phải ý chính"],
          ["Tách hai khả năng", "Some harms can be put right. ‖ Others | can't.", "đối chiếu hai nhóm"],
          ["Đổi nghĩa (không ngừng / có ngừng)", "The students who objected were ignored. ↔ The students | who objected | were ignored.", "không ngừng: chỉ những sinh viên phản đối; có ngừng: mọi sinh viên, và họ đều phản đối"],
          ["Đổi nghĩa với because", "I didn't refuse because of the cost. ↔ I didn't refuse | because of the cost.", "không ngừng: tôi từ chối, nhưng không phải vì giá; có ngừng: tôi không từ chối, lý do là giá"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai — ba kiểu ngừng làm mất điểm",
        items: [
          "Ngừng đều sau mỗi 3–4 từ như đọc chính tả: người nghe không biết từ nào quan trọng.",
          "Ngừng giữa mạo từ / giới từ và danh từ (the | cost, of | the policy) để tìm từ: đây là ngập ngừng vì ngôn ngữ (Ngày 2 mục 2).",
          "Không ngừng sau vế nhượng bộ: “In principle yes in practice it depends” nói liền một hơi nghe như không có lập trường.",
        ],
      },
      {
        t: "phatam",
        id: "t5d13-phat-am",
        title: "Luyện phát âm — pause mang nghĩa: ngừng ở dấu phẩy và dấu chấm, liền hơi ở mọi chỗ khác",
        note: "Mỗi câu đọc hai lần: lần một đếm thầm “một” ở mỗi dấu câu; lần hai ở tốc độ nói thường. Máy chấm từng âm; chỗ ngừng bạn nghe lại bản ghi và so với bảng ở trên.",
        items: [
          { text: "In principle, yes. In practice, it depends.", ipa: "ɪn prɪnsəpl jes ɪn præktɪs ɪt dɪpendz", vi: "Về nguyên tắc thì có. Trên thực tế thì còn tuỳ. (ngừng rõ sau yes)" },
          { text: "What worries me is not the cost, but who pays it.", ipa: "wɒt wʌriz miː ɪz nɒt ðə kɒst bʌt huː peɪz ɪt", vi: "Điều tôi lo không phải chi phí, mà là ai trả. (ngừng trước who pays it)" },
          { text: "The students, who objected, were ignored.", ipa: "ðə stjuːdnts huː əbdʒektɪd wɜː ɪɡnɔːd", vi: "Các sinh viên — họ đều phản đối — đã bị phớt lờ. (hai chỗ ngừng làm thành mệnh đề chêm)" },
          { text: "I take the point. I just don't accept the conclusion.", ipa: "aɪ teɪk ðə pɔɪnt aɪ dʒʌst dəʊnt əksept ðə kənkluːʒn", vi: "Tôi hiểu ý bạn. Tôi chỉ không chấp nhận kết luận thôi." },
          { text: "Some harms can be put right. Others can't.", ipa: "sʌm hɑːmz kæn biː pʊt raɪt ʌðəz kɑːnt", vi: "Có tác hại sửa được. Có cái thì không. (ngừng nửa nhịp sau Others)" },
          { text: "That, I think, is the real question.", ipa: "ðæt aɪ θɪŋk ɪz ðə rɪəl kwestʃən", vi: "Đó, tôi nghĩ, mới là câu hỏi thật sự." },
          { text: "It isn't illegal. It is, however, unwise.", ipa: "ɪt ɪznt ɪliːɡl ɪt ɪz haʊevə ʌnwaɪz", vi: "Việc đó không trái luật. Tuy vậy, nó thiếu khôn ngoan." },
          { text: "Not acting is also a decision.", ipa: "nɒt æktɪŋ ɪz ɔːlsəʊ ə dɪsɪʒn", vi: "Không hành động cũng là một quyết định. (ngừng nửa nhịp sau acting)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d13-nghe-pause",
        title: "Pause mang nghĩa — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. “The residents | who signed the petition | were invited to the meeting.” (có ngừng hai bên) nghĩa là:", options: ["A  Chỉ những cư dân đã ký mới được mời.", "B  Mọi cư dân đều được mời, và tất cả họ đã ký.", "C  Không cư dân nào được mời."], correct: 1, why: "Hai chỗ ngừng biến who signed thành mệnh đề chêm (không xác định): nói thêm về TẤT CẢ cư dân." },
          { q: "2. Bạn muốn nhấn “who decides”. Ngừng ở đâu?", options: ["A  The real | issue is who decides.", "B  The real issue is | who decides.", "C  The real issue is who | decides."], correct: 1, why: "Ngừng ngay TRƯỚC phần then chốt, ở ranh giới cụm (sau is)." },
          { q: "3. “She didn't resign | because of the criticism.” (ngừng trước because) nghĩa là:", options: ["A  Cô ấy không từ chức; lý do là những lời chỉ trích.", "B  Cô ấy từ chức, nhưng không phải vì bị chỉ trích.", "C  Cô ấy bị chỉ trích vì từ chức."], correct: 0, why: "Có ngừng: phủ định chỉ phủ lên resign; because… là lý do của việc KHÔNG từ chức." },
          { q: "4. Trong bài nghe, sau câu “Up to a point, yes. ‖” bạn nên chờ gì?", options: ["A  Người nói sẽ chuyển chủ đề.", "B  Người nói đã đồng ý hoàn toàn.", "C  Một giới hạn hoặc phản bác — lập trường thật sắp tới."], correct: 2, why: "Up to a point + ngừng rõ = nhượng bộ có giới hạn; ý chính đứng sau." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Khởi động — Practice 1: hai sinh viên, một quy định (giọng New Zealand · Úc)" },
      { t: "p", text: "Nghe MỘT lần. Để ý chỗ người nữ nói “In principle…” và chỗ người nam nói “Fair point. Although…”. Mỗi câu điền **ONE WORD OR A NUMBER**." },
      {
        t: "listen",
        id: "t5d13-nghe-ngan",
        title: "Practice 1 — Two students discussing an attendance rule",
        dan: { so: "Day 13, Recording 1", boiCanh: "two students discussing a proposal to make attendance at lectures compulsory.", cau: [1, 4] },
        note: "Khoảng 1 phút, ~175 từ/phút. Tom: giọng New Zealand; Mia: giọng Úc.",
        lines: [
          { who: "Tom", voice: "nz-nam", text: "So where do you stand on compulsory attendance? The department's proposing a minimum of seventy per cent." },
          { who: "Mia", voice: "au-nu", text: "In principle I'm against it. We're adults, and if someone learns better from the recordings, that's their call. What bothers me, though, isn't the rule itself. It's the reason they've given. They say it's about results, but the figures they quote only show that people who attend do better, not that attending is the cause." },
          { who: "Tom", voice: "nz-nam", text: "Fair point. Although I'd have thought the people it's aimed at are the ones who drift away in week three and never come back. Left alone, they fail. Isn't a bit of compulsion kinder than that?" },
          { who: "Mia", voice: "au-nu", text: "Possibly. But then call it support, not a rule. Email them, offer them a meeting. Penalties just teach people to sign the sheet and leave." },
          { who: "Tom", voice: "nz-nam", text: "So you'd accept monitoring, just not punishment." },
          { who: "Mia", voice: "au-nu", text: "Exactly. Monitoring I can live with." },
        ],
      },
      {
        t: "quiz",
        id: "t5d13-nghe-ngan-dien",
        kind: "fill",
        title: "Practice 1 — Questions 1–4. ONE WORD OR A NUMBER",
        items: [
          { q: "1. The proposed minimum attendance is ___ per cent.", answers: ["70", "seventy"], hint: "“a minimum of seventy per cent”." },
          { q: "2. Mia says the figures do not prove that attendance is the ___ of better results.", answers: ["cause"], hint: "“only show that people who attend do better, not that attending is the cause”." },
          { q: "3. Tom thinks the rule is aimed at students who stop coming in week ___ .", answers: ["three", "3"], hint: "“the ones who drift away in week three”." },
          { q: "4. Mia is willing to accept ___ of attendance, but not penalties.", answers: ["monitoring"], hint: "“Monitoring I can live with.” — tân ngữ đưa lên đầu để nhấn." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — Part 3, Questions 21–30" },
      { t: "p", text: "Bạn có 40 giây đọc câu 21–30. Gạch chân MOST (câu 23), finally (câu 24) và đọc kỹ ba phương án của nhóm 26–30: có phương án “both”. Kẻ sẵn hai cột **Callum | Priya**. Nghe MỘT lần." },
      {
        t: "listen",
        id: "t5d13-nghe-bai",
        title: "Part 3 — Preparing a seminar on the precautionary principle",
        dan: { so: "Day 13, Recording 2", boiCanh: "two students, Callum and Priya, talking to their tutor about a seminar presentation on the precautionary principle.", cau: [21, 30] },
        note: "Khoảng 5 phút, ~175 từ/phút. Dr Brennan: giọng Ireland (nữ); Callum: giọng Canada; Priya: giọng Anh.",
        lines: [
          { who: "Dr Brennan", voice: "ie-nu", text: "Come in, both of you. So, the seminar's a week on Thursday and you've got the precautionary principle. How far have you got?" },
          { who: "Priya", voice: "uk-nu", text: "Well, we've read most of what was on the list and we've got a rough plan, but to be honest we've spent a lot of the time arguing with each other." },
          { who: "Dr Brennan", voice: "ie-nu", text: "That's no bad thing. Arguing about what?" },
          { who: "Callum", voice: "ca-nam", text: "About whether the principle actually says anything. Everyone quotes it and nobody can pin it down. I started counting the definitions in just the three articles you gave us, and I got to nine before I gave up." },
          { who: "Dr Brennan", voice: "ie-nu", text: "And did that put you off the topic?" },
          { who: "Callum", voice: "ca-nam", text: "Not at all. I'd say it's what makes it worth doing. If it were clear, there'd be nothing to present." },
          { who: "Dr Brennan", voice: "ie-nu", text: "Fair enough. So where will you begin? With the wording from the Rio declaration, I assume." },
          { who: "Priya", voice: "uk-nu", text: "That was my first thought, the 1992 text, lack of full scientific certainty shall not be used as a reason for postponing measures, and so on. But when we tried it out on my flatmate, who doesn't do our subject, she just glazed over. So we're now going to open with a story, the one about lead in petrol, and bring in the formal wording once people can see why anyone would want a principle like this." },
          { who: "Dr Brennan", voice: "ie-nu", text: "Good. Remind me of the outline of the lead story." },
          { who: "Callum", voice: "ca-nam", text: "It was added to petrol in the nineteen-twenties to make engines run more smoothly. There were warnings from doctors at the time, but the industry's line was that nobody had demonstrated harm at the levels involved, and that was accepted. It was about half a century before it started to be phased out." },
          { who: "Dr Brennan", voice: "ie-nu", text: "And what do you take from that? That the experts were ignored? That it took so long?" },
          { who: "Callum", voice: "ca-nam", text: "Well, both of those are true, but what strikes me most is where the burden of proof was put. The people who were worried had to prove there was danger. The people selling the product didn't have to prove it was safe." },
          { who: "Priya", voice: "uk-nu", text: "Which is exactly the version of the principle I'd defend. Not never do anything risky. Just this: if there's a credible threat of serious harm, it's for the producer to show the thing is safe, not for the public to show it isn't." },
          { who: "Callum", voice: "ca-nam", text: "And I've no quarrel with that. Where we part company is the strong version, the one that says, when in doubt, don't. Because not acting is also a decision, and it has risks of its own. If you hold back a new treatment for ten years, people are harmed by that too. You just never see their names. So to my mind the risk of delay deserves exactly the same attention as the risk of going ahead." },
          { who: "Priya", voice: "uk-nu", text: "I don't buy that, I'm afraid, at least not as a general rule. Some harms can be put right afterwards and some can't. If a species has gone, or a water supply's been contaminated, you don't get a second go. So I'd give irreversible harm more weight, even when it's less likely." },
          { who: "Callum", voice: "ca-nam", text: "I'd accept that, actually. Irreversibility does matter. I just don't think the principle tells you how much." },
          { who: "Dr Brennan", voice: "ie-nu", text: "Let me push you both. Who decides whether a risk is acceptable? Because that word is doing a great deal of work." },
          { who: "Priya", voice: "uk-nu", text: "Scientists, surely. Independent ones." },
          { who: "Callum", voice: "ca-nam", text: "See, I'd say that's only half of it. Scientists can tell you how likely something is. Whether it's worth running the risk is a question about values, and that belongs to whoever has to live with the result." },
          { who: "Priya", voice: "uk-nu", text: "I'm not sure a public vote on toxicology is a great idea." },
          { who: "Callum", voice: "ca-nam", text: "I'm not suggesting a vote, on the toxicology or on anything else. I'm saying the experts estimate the risk, and the people affected decide whether to take it." },
          { who: "Priya", voice: "uk-nu", text: "Put like that, fine. I'd go along with that." },
          { who: "Dr Brennan", voice: "ie-nu", text: "And has the principle been any use in practice, do you think?" },
          { who: "Priya", voice: "uk-nu", text: "I think so. It's what got certain chemicals restricted before the evidence was complete, and we'd be worse off if that hadn't happened." },
          { who: "Callum", voice: "ca-nam", text: "I'm less convinced. In practice I think it gets invoked selectively, against things people already dislike, and quietly forgotten for things they're fond of." },
          { who: "Priya", voice: "uk-nu", text: "That's a bit cynical." },
          { who: "Callum", voice: "ca-nam", text: "Maybe. But I'd like to see a counter-example." },
          { who: "Dr Brennan", voice: "ie-nu", text: "Well, keep that disagreement, because it's useful. Now, practicalities. You have twenty minutes. Please don't try to settle the question; the weakest presentations I see are the ones that end with a joint conclusion that it all depends. And don't simply split the material down the middle and read out a half each. What works best is if each of you argues a side properly, and then tells the audience the one thing the other person made you concede." },
          { who: "Callum", voice: "ca-nam", text: "Then I'd better work out what I've conceded." },
          { who: "Priya", voice: "uk-nu", text: "Irreversibility. I heard you." },
          { who: "Dr Brennan", voice: "ie-nu", text: "There you are. Send me your slides by Monday. No, make it Tuesday, I'm away on Monday." },
        ],
      },
      { t: "p", text: "**Questions 21–25** — Choose the correct letter, **A**, **B** or **C**." },
      {
        t: "mcq",
        id: "t5d13-nghe-chon",
        title: "Questions 21–25 — Multiple choice",
        items: [
          { q: "21. What does Callum say about the number of definitions he found?", options: ["A  It made him want to change the topic.", "B  It is the reason the topic is worth presenting.", "C  It shows that the reading list was badly chosen."], correct: 1, why: "“Not at all. I'd say it's what makes it worth doing.” A bị bác bằng “Not at all”. C không có." },
          { q: "22. How do the students now plan to begin their presentation?", options: ["A  with a historical example", "B  with the text of an international declaration", "C  with the reaction of a student from another subject"], correct: 0, why: "“That was my first thought, the 1992 text… So we're now going to open with a story, the one about lead in petrol.” B là ý đầu đã bỏ; C là lý do đổi, không phải cách mở." },
          { q: "23. What does Callum find MOST significant about the case of lead in petrol?", options: ["A  that medical warnings were not heeded", "B  that it took so long for action to be taken", "C  which side was required to provide the evidence"], correct: 2, why: "“both of those are true, but what strikes me most is where the burden of proof was put.” A và B đều đúng sự thật — nhưng không phải MOST." },
          { q: "24. What do the students finally agree about deciding whether a risk is acceptable?", options: ["A  It should be left to independent scientists.", "B  It should be settled by a public vote.", "C  Those affected should decide, using experts' estimates of the risk."], correct: 2, why: "Callum: “the experts estimate the risk, and the people affected decide whether to take it.” Priya: “Put like that, fine.” A là ý ban đầu của Priya; B bị Callum bác: “I'm not suggesting a vote”." },
          { q: "25. What does the tutor recommend for the presentation?", options: ["A  ending with a conclusion that both students share", "B  each student defending a position and saying what they conceded", "C  dividing the material into two equal halves"], correct: 1, why: "“each of you argues a side properly, and then tells the audience the one thing the other person made you concede.” A và C là hai điều cô bảo ĐỪNG làm." },
        ],
      },
      { t: "p", text: "**Questions 26–30** — Who expresses each of the following views? Choose **A** (Callum only), **B** (Priya only) or **C** (both Callum and Priya)." },
      {
        t: "mcq",
        id: "t5d13-nghe-ghep",
        title: "Questions 26–30 — Matching: whose view?",
        items: [
          { q: "26. Producers, not the public, should have to show that a product is safe.", options: ["A  Callum only", "B  Priya only", "C  both Callum and Priya"], correct: 2, why: "Priya: “it's for the producer to show the thing is safe”. Callum: “And I've no quarrel with that.”" },
          { q: "27. Delaying something new should be treated as just as risky as allowing it.", options: ["A  Callum only", "B  Priya only", "C  both Callum and Priya"], correct: 0, why: "Callum: “the risk of delay deserves exactly the same attention as the risk of going ahead.” Priya: “I don't buy that, I'm afraid.”" },
          { q: "28. Harm that cannot be undone deserves special weight.", options: ["A  Callum only", "B  Priya only", "C  both Callum and Priya"], correct: 2, why: "Priya: “I'd give irreversible harm more weight”. Callum: “I'd accept that, actually. Irreversibility does matter.” — đổi ý thật." },
          { q: "29. The principle has produced good results when applied.", options: ["A  Callum only", "B  Priya only", "C  both Callum and Priya"], correct: 1, why: "Priya: “It's what got certain chemicals restricted… we'd be worse off if that hadn't happened.” Callum: “I'm less convinced.”" },
          { q: "30. The principle tends to be applied inconsistently.", options: ["A  Callum only", "B  Priya only", "C  both Callum and Priya"], correct: 0, why: "Callum: “it gets invoked selectively… and quietly forgotten for things they're fond of.” Priya: “That's a bit cynical.”" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Sau khi nghe — ai đứng ở đâu, đổi ý lúc nào" },
      {
        t: "table",
        head: ["Câu", "Tín hiệu", "Bẫy", "Kiểu bẫy"],
        rows: [
          ["21", "Not at all. I'd say it's what makes it worth doing.", "nine · gave up (nghe như chán)", "chi tiết tiêu cực rồi kết luận tích cực"],
          ["22", "That was my first thought… So we're now going to…", "the 1992 text", "ý đầu bị thay"],
          ["23", "both of those are true, but what strikes me most is…", "experts ignored · took so long", "ba ý đều đúng, chỉ một ý là MOST"],
          ["24", "Put like that, fine. I'd go along with that.", "Scientists, surely · a public vote", "lập trường dịch chuyển qua 5 lượt lời"],
          ["25", "What works best is…", "joint conclusion · a half each", "hai điều ĐỪNG làm nói trước"],
          ["26", "I've no quarrel with that.", "Where we part company… (ngay sau)", "đồng ý xong mới tách"],
          ["27", "I don't buy that, I'm afraid.", "—", "bác thẳng"],
          ["28", "I'd accept that, actually.", "I just don't think the principle tells you how much.", "nhượng thật + giữ một dè dặt"],
          ["29–30", "I'm less convinced. · That's a bit cynical.", "—", "hai người ở hai phía"],
        ],
      },
      {
        t: "note",
        title: "📌 Thang điểm của bài này",
        items: [
          "9–10/10: đúng mức band 8 cho Part 3. 7–8: band 7 — xem bạn sai ở nhóm 21–25 (bẫy ý đầu) hay 26–30 (ai đồng ý với ai).",
          "Sai câu 23 hoặc 24: bạn chọn theo ý nghe được ĐẦU TIÊN. Luyện lại Ngày 9 mục câu tín hiệu “bác rồi mới nói”.",
          "Sai câu 26 hoặc 28: bạn chưa phân biệt I take the point (giữ ý) với I'd accept that (đổi ý) — học lại bảng mục 2.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Từ nghe sang nói — khung trả lời Part 3 triết lý, chính sách band 8" },
      {
        t: "p",
        text: "Câu hỏi Part 3 cấp cao không hỏi sở thích mà hỏi ==nguyên tắc==: nhà nước có quyền làm X không, ai nên quyết định Y, một luật không ai tuân thủ có còn nên giữ. Người band 7 trả lời “It depends” rồi liệt kê hai phía. Người band 8 làm đúng việc Callum và Priya vừa làm: ==nói rõ nó tuỳ vào CÁI GÌ==, nêu nguyên tắc, đặt giới hạn, cho một ví dụ nhỏ, rồi chốt.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Năm bước cho một câu trả lời 35–45 giây",
        steps: [
          { label: "① Khoanh lại câu hỏi", sub: "I think it depends on what kind of harm we're talking about. / That rather depends on what we mean by “protect”." },
          { label: "② Nguyên tắc của bạn", sub: "Where a mistake can be put right afterwards, I'd let people decide for themselves." },
          { label: "③ Giới hạn / ngoại lệ", sub: "Where the damage can't be undone, though, I'd want… (ngừng rõ trước though)" },
          { label: "④ Một ví dụ nhỏ, cụ thể", sub: "a treatment held back for ten years · a helmet law · a default pension scheme" },
          { label: "⑤ Chốt một câu", sub: "So for me the test isn't how new something is, but whether you get a second go." },
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "It / That (rather) depends on what we mean by + N", vi: "Định nghĩa lại — mua thời gian bằng nội dung.", examples: [{ en: "That rather depends on what we mean by “acceptable”.", vi: "Điều đó còn tuỳ ta hiểu “chấp nhận được” là gì." }] },
          { formula: "In principle, S V. In practice, (though,) S V", vi: "Tách nguyên tắc và thực tế.", examples: [{ en: "In principle, adults should be free to take risks. In practice, though, someone else usually pays when it goes wrong.", vi: "Về nguyên tắc người lớn nên được tự do mạo hiểm. Nhưng thực tế, khi hỏng việc thường có người khác trả giá." }] },
          { formula: "I take the point that S V, but S V", vi: "Thừa nhận phía bên kia rồi giữ ý.", examples: [{ en: "I take the point that experts know more, but knowing more isn't the same as having the right to decide.", vi: "Tôi hiểu rằng chuyên gia biết nhiều hơn, nhưng biết nhiều hơn không đồng nghĩa với có quyền quyết định." }] },
          { formula: "What I wouldn't accept is + N / that S V", vi: "Câu chẻ để đặt giới hạn cho lập trường.", examples: [{ en: "What I wouldn't accept is a blanket rule of “when in doubt, ban it”.", vi: "Điều tôi không chấp nhận là một quy tắc chung kiểu “nghi thì cấm”." }] },
          { formula: "The test, for me, is whether S V", vi: "Chốt bằng một tiêu chí.", examples: [{ en: "The test, for me, is whether the person bearing the risk is the one who chose it.", vi: "Với tôi, phép thử là người chịu rủi ro có phải là người đã chọn nó hay không." }] },
        ],
      },
      {
        t: "dialogue",
        title: "Cùng một câu hỏi — band 7 và band 8 (ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Should governments restrict new technologies before their risks are fully understood?", vi: "Chính phủ có nên hạn chế công nghệ mới trước khi hiểu hết rủi ro không?" },
          { who: "Band 7", role: "a", text: "I think yes, governments should restrict them. New technologies can be dangerous, for example AI or new medicines, and if the government doesn't control them, people may be harmed. But on the other hand technology is also very useful, so the government shouldn't control too much. So I think it depends on the technology.", vi: "Tôi nghĩ có… Nhưng mặt khác công nghệ cũng hữu ích… Nên tôi nghĩ còn tuỳ công nghệ." },
          { who: "Band 8", role: "candidate", text: "I think it depends on what kind of harm we're talking about. If a mistake can be put right afterwards, say an app that turns out to be addictive, I'd let it go ahead and regulate as the evidence comes in. Where the damage can't be undone, though, I'd want the people selling it to show it's safe first. What I wouldn't accept is a blanket rule of “when in doubt, ban it”, because delay isn't free either. A treatment that's held back for ten years costs lives too. We just never see whose.", vi: "Tôi nghĩ còn tuỳ ta nói về loại tác hại nào. Sai lầm sửa được về sau thì cứ cho làm rồi điều chỉnh. Còn thiệt hại không thể đảo ngược thì bên bán phải chứng minh an toàn trước. Điều tôi không chấp nhận là quy tắc “nghi thì cấm”, vì trì hoãn cũng có giá." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["FC", "hai phía rồi “it depends” — không nói tuỳ vào gì", "nói ngay tuỳ vào loại tác hại → nguyên tắc → giới hạn → ví dụ → chốt"],
          ["LR", "dangerous · useful · control", "put right · can't be undone · a blanket rule · as the evidence comes in"],
          ["GRA", "câu đơn + but / so", "If… , I'd… · Where… , though, … · What I wouldn't accept is… · câu ngắn 5 từ để chốt"],
          ["Phát âm", "đều giọng", "ngừng trước though; ngừng rõ trước câu chốt “We just never see whose.”"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo — ba trục để “khoanh lại” mọi câu hỏi nguyên tắc",
        items: [
          "**Sửa được hay không:** reversible ↔ irreversible (công nghệ, môi trường, y tế).",
          "**Ai chịu hậu quả:** người tự chọn ↔ người khác phải gánh (luật mũ bảo hiểm, hút thuốc, tiếng ồn).",
          "**Nguyên tắc hay thực thi:** in principle ↔ in practice (luật có nhưng không ai tuân thủ, kiểm duyệt, thuế).",
          "Chọn MỘT trục cho mỗi câu trả lời. Dùng cả ba là lan man.",
        ],
      },
      {
        t: "speak",
        id: "t5d13-noi-p3",
        part: "3",
        questions: [
          "Should governments restrict new technologies before their risks are fully understood?",
          "Is it ever right for a government to protect people from their own choices?",
          "Who should decide what level of risk is acceptable in a society: experts or ordinary citizens?",
          "Some people say that a law which is widely ignored is worse than no law at all. What do you think?",
          "Do you think people today are more cautious than previous generations were?",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Chép lại câu trả lời tốt nhất của bạn; gạch dưới bước ① và bước ⑤. Thiếu bước nào thì nói lại.",
          "Nghe lại bản ghi: đánh dấu mọi chỗ ngừng. Chỗ nào rơi vào giữa cụm (the | cost) là ngừng vì ngôn ngữ — nói lại câu đó.",
          "Ngày 21 sẽ đưa ba cấu trúc hiếm (đảo ngữ, câu chẻ, giả định) vào đúng năm bước này; Ngày 23 luyện phản biện lại giám khảo.",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Từ vựng hữu ích từ bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "burden of proof", pos: "n phr", ipa: "/ˌbɜːdn əv ˈpruːf/", vi: "nghĩa vụ chứng minh", ex: "The burden of proof should lie with the company, not with the public.", exVi: "Nghĩa vụ chứng minh nên thuộc về công ty chứ không phải công chúng.", more: "the burden of proof lies with / rests on / falls on sb · shift the burden of proof" },
          { w: "credible", pos: "adj", ipa: "/ˈkredəbl/", vi: "đáng tin, có cơ sở", ex: "There is no credible evidence that the scheme reduces crime.", exVi: "Không có bằng chứng đáng tin nào cho thấy chương trình giảm tội phạm.", more: "a credible threat / witness / alternative · credibility (n) · ⚠️ khác credulous (cả tin)" },
          { w: "precautionary", pos: "adj", ipa: "/prɪˈkɔːʃənəri/", vi: "mang tính phòng ngừa", ex: "The bridge was closed as a precautionary measure.", exVi: "Cây cầu bị đóng như một biện pháp phòng ngừa.", more: "a precautionary measure · the precautionary principle (nguyên tắc phòng ngừa) · as a precaution" },
          { w: "blanket", pos: "adj", ipa: "/ˈblæŋkɪt/", vi: "áp dụng chung cho mọi trường hợp, không phân biệt", ex: "A blanket ban on advertising would hurt small firms most.", exVi: "Một lệnh cấm quảng cáo đồng loạt sẽ làm doanh nghiệp nhỏ thiệt nhất.", more: "a blanket ban / rule / refusal · chỉ đứng trước danh từ · thường mang ý chê: thiếu phân biệt" },
          { w: "pin down", pos: "phr v", ipa: "/ˌpɪn ˈdaʊn/", vi: "xác định chính xác (thứ khó nắm)", ex: "The cause of the decline is difficult to pin down.", exVi: "Nguyên nhân của sự suy giảm rất khó xác định chính xác.", more: "hard / difficult to pin down · pin sb down (buộc ai nói rõ)" },
          { w: "glaze over", pos: "phr v", ipa: "/ɡleɪz ˈəʊvə/", vi: "(mắt) đờ ra vì chán, không theo kịp", ex: "As soon as he started on the statistics, the audience's eyes glazed over.", exVi: "Anh ta vừa bắt đầu đọc số liệu là mắt khán giả đờ ra.", more: "trong bài nghe: she just glazed over · lời khuyên thuyết trình: mở bằng một câu chuyện để người nghe không “glaze over”" },
          { w: "have no quarrel with", pos: "idiom", ipa: "/hæv nəʊ ˈkwɒrəl wɪð/", vi: "không phản đối gì (ý / người đó)", ex: "I have no quarrel with the aim of the policy, only with its cost.", exVi: "Tôi không phản đối gì mục tiêu của chính sách, chỉ phản đối chi phí của nó.", more: "have no quarrel with sb / sth · câu nhượng bộ khi Nói; trong Task 2 dùng “I accept that…”" },
          { w: "part company", pos: "idiom", ipa: "/ˌpɑːt ˈkʌmpəni/", vi: "bắt đầu bất đồng; tách ra", ex: "This is where I part company with most economists.", exVi: "Đây là chỗ tôi bắt đầu khác ý với phần lớn các nhà kinh tế.", more: "part company with sb on / over sth · dùng khi Nói và trong bình luận; ít dùng trong Task 2" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 13 ═══════════════════════════ */
  {
    id: "t5d13-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 13 — câu chẻ · đảo ngữ · nhượng bộ · liên kết ngầm · liều lượng · đọc lập luận · nghe ai đồng ý với ai · pause mang nghĩa",
    goal: "Ôn trọn Ngày 13: viết đúng hình thức câu chẻ, đảo ngữ và tám khuôn nhượng bộ, chọn đúng vị trí và liều lượng cho từng cấu trúc trong một bài Task 2, nối câu bằng liên kết ngầm, đọc một bài lập luận ngắn về chính sách và trả lời YNNG, nghe một đoạn thảo luận để biết ý nào của ai — 44 câu có đáp án, một thân bài AI chấm và ba câu Part 3 ghi âm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay",
        items: [
          "Phần I–IV ôn Bài 1 (25 câu): hình thức → vị trí → sửa lỗi → dịch.",
          "Phần V ôn Bài 2: một bài lập luận 230 từ, 5 câu — chú ý ý người viết và ý người được thuật.",
          "Phần VI–VII ôn Bài 3: nghe hai người tranh luận (giọng Úc · Ireland) và pause mang nghĩa.",
          "Phần VIII: 5 từ của ngày. Phần IX–X: viết một thân bài đúng “ngân sách” cấu trúc và nói 3 câu Part 3.",
          "Đạt: ≥ 36/44. Dưới 70 % ở phần nào thì mở lại đúng mục ghi trong tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 13 trong một hình",
        center: "Nhấn mạnh **vừa đủ**",
        branches: [
          { label: "Câu chẻ — sửa cách nhìn", items: ["It is N (not N) that…", "What S V is that…", "The reason… is that…"] },
          { label: "Đảo ngữ — câu mạnh nhất", items: ["Only by V-ing can S V", "Not only does S V…", "Were S to V…"] },
          { label: "Nhượng bộ — thừa nhận rồi vượt", items: ["adj + as + S + may be", "For all + N", "S may V, but…"] },
          { label: "Liên kết ngầm", items: ["this + danh từ tóm tắt", "such + N · the latter", "do so · lược bỏ"] },
          { label: "Nghe → nói Part 3", items: ["I take the point, but…", "In principle… In practice…", "pause trước từ then chốt"] },
        ],
      },

      { t: "h", text: "I. Điền MỘT từ (8 câu) — ôn Bài 1 mục 2–5" },
      {
        t: "quiz",
        id: "t5d13-bt-dien",
        kind: "fill",
        title: "I. Điền MỘT từ",
        items: [
          { q: "1. ___ the industry needs is not more subsidy but more competition.", answers: ["What"], hint: "What-cleft: What S V is…" },
          { q: "2. Only by cutting class sizes ___ schools give weaker pupils the attention they need.", answers: ["can", "will"], hint: "Only by + V-ing → đảo: can schools give." },
          { q: "3. Popular ___ the measure was with motorists, it did nothing for air quality.", answers: ["as", "though"], hint: "adj + as / though + S + V." },
          { q: "4. ___ all its faults, the jury system commands public trust.", answers: ["For"], hint: "For all + N = bất chấp mọi…" },
          { q: "5. The council promised to consult residents, but it has yet to do ___ .", answers: ["so"], hint: "do so = consult residents." },
          { q: "6. ___ the grant to be withdrawn, half the museums in the region would close.", answers: ["Were"], hint: "Were + S + to be V3, S would V." },
          { q: "7. It is the poorest households, not the richest, ___ spend the largest share of their income on fuel.", answers: ["that", "who", "which"], hint: "It-cleft: It is N that + V." },
          { q: "8. The scheme has reduced congestion, ___ only in the city centre. (dù chỉ)", answers: ["albeit"], hint: "albeit + cụm (only in the city centre)." },
        ],
      },

      { t: "h", text: "II. Đúng chỗ, đúng liều (6 câu) — ôn Bài 1 mục 1 · 6" },
      {
        t: "mcq",
        id: "t5d13-bt-vi-tri",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. Câu chẻ có việc gì trong một bài Task 2?", options: ["A  Làm mở bài trang trọng hơn.", "B  Sửa một cách nhìn: không phải A mà là B.", "C  Thay cho từ nối Moreover."], correct: 1, why: "Câu chẻ = đối chiếu. Không có vế “không phải…” (nói ra hoặc ngầm) thì thừa." },
          { q: "2. Chỗ đặt đảo ngữ hợp nhất?", options: ["A  Câu đầu của mỗi thân bài.", "B  Câu nêu ví dụ.", "C  Câu chốt thân bài 2 hoặc câu đầu kết bài — luận điểm mạnh nhất."], correct: 2, why: "Một lần, ở câu bạn muốn giám khảo nhớ." },
          { q: "3. Bài 290 từ của bạn có: 3 đảo ngữ, 2 câu chẻ, 1 although. Việc đầu tiên nên làm?", options: ["A  Thêm một câu chẻ cho cân.", "B  Xoá hai đảo ngữ yếu nhất và một câu chẻ.", "C  Đổi although thành albeit."], correct: 1, why: "Ngân sách: ≤ 4 cấu trúc nổi. Sau đó mới thêm một nhượng bộ khuôn khác." },
          { q: "4. “It is undeniable that education is important.” Nhận xét đúng?", options: ["A  Câu chẻ tốt cho mở bài.", "B  Câu rỗng: không nhấn gì, không đối chiếu gì.", "C  Đảo ngữ trang trọng."], correct: 1, why: "Không phải câu chẻ, và không mang thông tin." },
          { q: "5. Câu nào nối tốt nhất sau: “Rents in the capital have risen twice as fast as wages.”", options: ["A  Furthermore, it is a problem.", "B  This is bad for many reasons.", "C  This gap is forcing key workers to leave."], correct: 2, why: "This + danh từ tóm tắt (gap) nắm lấy phép so sánh ở câu trước." },
          { q: "6. Hai nhượng bộ trong một bài nên:", options: ["A  dùng hai khuôn khác nhau, ở thesis và đầu thân bài 2.", "B  đều là Although, đầu mỗi thân bài.", "C  đứng liền nhau trong kết bài."], correct: 0, why: "Đổi khuôn để cho thấy range; đặt ở hai chỗ cần cân nhắc phía bên kia." },
        ],
      },

      { t: "h", text: "III. Sửa lỗi — gõ lại phần [trong ngoặc] (6 câu) — ôn Bài 1 mục 7" },
      {
        t: "quiz",
        id: "t5d13-bt-sua",
        kind: "fill",
        title: "III. Mỗi câu một lỗi",
        items: [
          { q: "1. Only when voters are informed [democracy can] function properly.", answers: ["can democracy"], hint: "Only when + mệnh đề → đảo ở mệnh đề chính." },
          { q: "2. The reason why reading has declined is [because of] children have more screens.", answers: ["that"], hint: "The reason… is that + mệnh đề." },
          { q: "3. Although nuclear power is clean, [but it] is expensive to build.", answers: ["it"], hint: "Although không đi với but." },
          { q: "4. [Only can large firms] afford to train their own staff.", answers: ["Only large firms can"], hint: "Only bổ nghĩa chủ ngữ → không đảo." },
          { q: "5. [However the fine is large], wealthy drivers will simply pay it.", answers: ["However large the fine is", "However large the fine may be", "However large the fine"], hint: "However + adj + S + V." },
          { q: "6. Rarely [a policy has] divided opinion so sharply.", answers: ["has a policy"], hint: "Rarely đầu câu → has + S + V3." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–5" },
      {
        t: "quiz",
        id: "t5d13-bt-dich",
        kind: "translate",
        title: "IV. Dịch — dùng cấu trúc trong ngoặc",
        grammar: "What S V is that… · Only if… + aux + S + V · For all + N · this + danh từ tóm tắt · Not only + aux + S + V",
        items: [
          { q: "Điều những người chỉ trích bỏ qua là chương trình này tự trang trải được chi phí. (What…)", answers: ["What critics overlook is that the scheme pays for itself.", "What the critics overlook is that the scheme pays for itself.", "What critics overlook is that this scheme pays for itself.", "What critics ignore is that the scheme pays for itself."], hint: "overlook · pay for itself" },
          { q: "Chỉ khi vé rẻ hơn thì người đi làm mới chuyển sang tàu. (Only if…)", answers: ["Only if tickets are cheaper will commuters switch to the train.", "Only if tickets become cheaper will commuters switch to the train.", "Only if fares are cheaper will commuters switch to the train.", "Only if tickets are cheaper will commuters switch to trains."], hint: "commuters · switch to the train" },
          { q: "Bất chấp mọi lợi ích, làm việc từ xa không phù hợp với tất cả mọi người. (For all…)", answers: ["For all its benefits, remote working does not suit everyone.", "For all its benefits, remote work does not suit everyone.", "For all its advantages, remote working does not suit everyone.", "For all its benefits, working remotely does not suit everyone."], hint: "For all its benefits · suit" },
          { q: "Nhiều bậc cha mẹ không muốn cho con đi bộ tới trường. Sự e ngại này là dễ hiểu. (This + danh từ)", answers: ["Many parents are unwilling to let their children walk to school. This reluctance is understandable.", "Many parents are reluctant to let their children walk to school. This reluctance is understandable.", "Many parents do not want to let their children walk to school. This reluctance is understandable."], hint: "be unwilling to let · This reluctance" },
          { q: "Chính sách này không những tiết kiệm tiền mà còn cứu được nhiều mạng người. (Not only…)", answers: ["Not only does the policy save money, but it also saves lives.", "Not only does this policy save money, but it also saves lives.", "Not only does the policy save money, but it also saves many lives.", "Not only does this policy save money, but it also saves many lives."], hint: "Not only does… save · but it also" },
        ],
      },

      { t: "h", text: "V. Đọc — một bài lập luận ngắn (5 câu · 6 phút) — ôn Bài 2" },
      {
        t: "passage",
        title: "Should Libraries Fine Their Readers?",
        paras: [
          { text: "For as long as public libraries have lent books, they have charged readers who bring them back late. The justification is familiar: a small penalty encourages prompt return, and the money helps to pay for new stock. In recent years, however, a growing number of library services have abandoned fines altogether, and it is worth asking why." },
          { text: "Supporters of fines regard this as an abandonment of responsibility. A book kept by one borrower, they point out, is a book denied to another. That is true as far as it goes. What it overlooks is how fines actually behave. The sums collected are small, and a good part of them is swallowed by the cost of collecting them. More importantly, it is not the careless reader who is driven away but the poor one: a family that owes a few pounds may simply stop coming, and the children in that family are precisely the readers a public library exists to serve." },
          { text: "The service in Marrow Bay, which ended fines three years ago, reports that the number of overdue books has not risen and that several thousand lapsed members have returned. One service proves little, and it may be that readers there were unusually conscientious to begin with. Even so, the burden of proof has shifted. Those who wish to keep fines can no longer assume that they work; they must show it." },
        ],
      },
      {
        t: "mcq",
        id: "t5d13-bt-doc",
        title: "V. Questions 1–4: YES / NO / NOT GIVEN (ý người viết) · Question 5: chọn A–C",
        items: [
          { q: "1. Fines bring libraries a substantial income.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“The sums collected are small, and a good part of them is swallowed by the cost of collecting them.”" },
          { q: "2. The argument that a late book deprives other readers has some truth in it.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“That is true as far as it goes.” — nhượng bộ có giới hạn; người viết thừa nhận phần đúng." },
          { q: "3. Most library services in the country have now ended fines.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói “a growing number”; không nói đã là đa số hay chưa." },
          { q: "4. The Marrow Bay figures settle the question.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“One service proves little.” Người viết chỉ nói nghĩa vụ chứng minh đã đổi phía." },
          { q: "5. Which structure carries the writer's main objection to fines?", options: ["A  an inversion beginning with Not only", "B  a cleft sentence contrasting two kinds of reader", "C  a conditional beginning with Were"], correct: 1, why: "“it is not the careless reader who is driven away but the poor one” — It-cleft có not… but…, đặt đúng ở luận điểm chính. Cả bài không có đảo ngữ nào." },
        ],
      },

      { t: "h", text: "VI. Nghe — hai sinh viên, một đề xuất (5 câu) — ôn Bài 3 mục 2" },
      {
        t: "listen",
        id: "t5d13-bt-nghe",
        title: "A discussion — closing the street outside a school",
        dan: { so: "Day 13, Recording 3", boiCanh: "two students discussing a proposal to close a street to cars outside a primary school.", cau: [1, 5] },
        note: "Khoảng 1 phút 15 giây. Lachlan: giọng Úc; Niamh: giọng Ireland.",
        lines: [
          { who: "Niamh", voice: "ie-nu", text: "Have you read the council's plan for Halden Road? They want to close it to cars for forty-five minutes at each end of the school day." },
          { who: "Lachlan", voice: "au-nam", text: "I have. In principle I'm all for it. Children should be able to walk to school without dodging traffic. What I'm not sure about is where the cars go instead. They don't vanish. They'll end up on the two streets either side." },
          { who: "Niamh", voice: "ie-nu", text: "I take the point, but the trial in the next district found that about a fifth of the car journeys simply stopped. People walked." },
          { who: "Lachlan", voice: "au-nam", text: "A fifth, though. That leaves four fifths somewhere else. And the residents of those side streets never asked for it." },
          { who: "Niamh", voice: "ie-nu", text: "No, they didn't, and I'd accept they ought to be consulted first. But I wouldn't give them a veto. The street doesn't belong to drivers any more than it belongs to children." },
          { who: "Lachlan", voice: "au-nam", text: "Consulted, not a veto. Put like that, fine. I'd still want it reviewed after one term, with the traffic counted properly." },
          { who: "Niamh", voice: "ie-nu", text: "One term's too short, I think. I'd say a full year." },
        ],
      },
      {
        t: "mcq",
        id: "t5d13-bt-nghe-chon",
        title: "VI. Questions 1–5 — chọn phương án đúng",
        items: [
          { q: "1. The road would be closed for ___ at each end of the school day.", options: ["A  fifteen minutes", "B  forty-five minutes", "C  an hour"], correct: 1, why: "“for forty-five minutes at each end of the school day”." },
          { q: "2. What is Lachlan's main doubt about the plan?", options: ["A  that children will still not be safe", "B  that parents will ignore the closure", "C  that traffic will move to neighbouring streets"], correct: 2, why: "“What I'm not sure about is where the cars go instead… They'll end up on the two streets either side.”" },
          { q: "3. In the trial mentioned by Niamh, what happened to about a fifth of car journeys?", options: ["A  They were no longer made.", "B  They were made earlier in the day.", "C  They moved to side streets."], correct: 0, why: "“about a fifth of the car journeys simply stopped. People walked.”" },
          { q: "4. Residents of the side streets should be consulted. Whose view is this?", options: ["A  Lachlan only", "B  Niamh only", "C  both"], correct: 2, why: "Niamh: “I'd accept they ought to be consulted first.” Lachlan: “Consulted, not a veto. Put like that, fine.”" },
          { q: "5. The scheme should be reviewed after one term. Whose view is this?", options: ["A  Lachlan only", "B  Niamh only", "C  both"], correct: 0, why: "Lachlan: “reviewed after one term”. Niamh: “One term's too short… a full year.”" },
        ],
      },

      { t: "h", text: "VII. Pause mang nghĩa (4 câu) — ôn Bài 3 mục 3" },
      {
        t: "mcq",
        id: "t5d13-bt-pause",
        title: "VII. Chọn phương án đúng",
        items: [
          { q: "1. Chỗ ngừng nào là ngập ngừng vì NGÔN NGỮ?", options: ["A  In principle, yes. ‖ In practice, it depends.", "B  The problem is the | cost of the | policy.", "C  What matters | is who decides."], correct: 1, why: "Ngừng giữa mạo từ / giới từ và danh từ là dừng để tìm từ." },
          { q: "2. “The teachers who complained were moved.” (KHÔNG ngừng) nghĩa là:", options: ["A  Mọi giáo viên đều phàn nàn và đều bị chuyển.", "B  Chỉ những giáo viên đã phàn nàn mới bị chuyển.", "C  Không ai bị chuyển."], correct: 1, why: "Không ngừng = mệnh đề xác định: giới hạn nhóm." },
          { q: "3. Trong “Monitoring | I can live with.”, chỗ ngừng báo điều gì?", options: ["A  Người nói quên từ.", "B  Monitoring được đưa lên đầu để đối chiếu với thứ khác (penalties).", "C  Câu chưa nói xong."], correct: 1, why: "Tân ngữ đưa lên đầu + ngừng = nhấn đối chiếu." },
          { q: "4. Bạn nói: “I take the point ‖ but I don't accept the conclusion.” Ngừng rõ trước but giúp gì?", options: ["A  Báo rằng lập trường thật sắp tới.", "B  Cho thấy bạn đồng ý hoàn toàn.", "C  Không giúp gì; nên nói liền."], correct: 0, why: "Ngừng sau vế nhượng bộ = “ý chính ở phía sau”." },
        ],
      },

      { t: "h", text: "VIII. Từ vựng của ngày (5 câu) — ôn Bài 2 và Bài 3 mục từ vựng" },
      {
        t: "quiz",
        id: "t5d13-bt-tu-vung",
        kind: "fill",
        title: "VIII. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. The road was closed as a p___ measure after part of the bank collapsed.", answers: ["precautionary"], hint: "mang tính phòng ngừa" },
          { q: "2. A b___ ban on phones in schools ignores the pupils who need them for medical reasons.", answers: ["blanket"], hint: "áp dụng đồng loạt, không phân biệt" },
          { q: "3. So far nobody has produced c___ evidence that the scheme saves money.", answers: ["credible"], hint: "đáng tin, có cơ sở" },
          { q: "4. Winning the prize was little c___ for losing the contract.", answers: ["consolation"], hint: "niềm an ủi" },
          { q: "5. The main d___ of the new timetable is that the last bus now leaves at nine.", answers: ["drawback"], hint: "nhược điểm" },
        ],
      },

      { t: "h", text: "IX. Viết một thân bài đúng “ngân sách” cấu trúc (110–140 từ) — AI chấm" },
      {
        t: "p",
        text: "Đề: Some people believe that public libraries should stop charging fines for books returned late. Viết MỘT thân bài bênh vực hoặc phản đối ý này. Yêu cầu: đúng **một** câu chẻ (để sửa cách nhìn của phía bên kia), đúng **một** nhượng bộ KHÔNG dùng although, ít nhất **hai** mối liên kết ngầm (this / such + danh từ, the latter, do so), **không** có đảo ngữ, và không quá **một** từ nối đầu câu. Viết xong, khoanh từng cấu trúc và tự kiểm bằng bảng mục 6 của Bài 1.",
      },
      {
        t: "essay",
        id: "t5d13-bt-viet-doan",
        task: "Task 2",
        prompt: "Topic: Some people believe that public libraries should stop charging fines for books that are returned late. Write ONE body paragraph (110–140 words) supporting OR opposing this view. Use exactly ONE cleft sentence, exactly ONE concession that does not use “although”, at least TWO cohesive links of the type “this / such + summary noun”, “the latter” or “do so”, NO inversion, and no more than ONE sentence-initial linking word.",
        minWords: 110,
        tips: [
          "Câu 1: lý do chính của bạn — câu thường, rõ.",
          "Câu 2–3: bằng chứng / cơ chế; nối bằng this + danh từ tóm tắt.",
          "Câu 4: thuật phía bên kia + nhượng bộ (This may be true of…, but… / Reasonable as this sounds, …).",
          "Câu 5: câu chẻ sửa cách nhìn (What this overlooks is that… / It is not… but… that…).",
          "Câu 6: chốt — câu ngắn, không đảo ngữ.",
        ],
      },
      {
        t: "note",
        title: "📌 Một thân bài mẫu để so SAU khi đã viết (band 8, ước tính) — 121 từ",
        items: [
          "The strongest case for abolishing fines is that they keep away the very readers libraries are meant to reach. A family that owes a few pounds often stops borrowing altogether, and **this withdrawal** costs the library far more than a late book does. Defenders of fines reply that penalties teach responsibility. **That may be true of** readers who can easily pay, **but** it means little to those who cannot. **What the argument overlooks is that** a penalty only deters people who are still using the service; once they have left, it teaches them nothing. Services that have dropped fines report no rise in overdue books, and many lapsed members have rejoined. **Such results** suggest that trust is at least as effective as punishment.",
          "Đếm: 1 câu chẻ (What… is that…) · 1 nhượng bộ (may…, but…) · 2 liên kết ngầm (this withdrawal · such results) · 0 đảo ngữ · 0 từ nối đầu câu.",
        ],
      },

      { t: "h", text: "X. Nói 3 câu Part 3 — ghi âm, AI chấm — ôn Bài 3 mục 7" },
      { t: "p", text: "Mỗi câu 35–45 giây, đủ năm bước: khoanh lại câu hỏi → nguyên tắc → giới hạn → ví dụ nhỏ → chốt. Nghe lại và đánh dấu chỗ ngừng." },
      {
        t: "speak",
        id: "t5d13-bt-noi-p3",
        part: "3",
        questions: [
          "Is it fair to punish everyone with a rule because a few people behave badly?",
          "Should local residents have the final say over changes to their own street?",
          "When, if ever, is it right for the authorities to act before the evidence is complete?",
        ],
      },
    ],
  },
];
