/**
 * Ngày 14 — tự soạn (không chụp sách, 12/11/2026):
 *   Reading Skills: Summary Completion (chọn từ trong hộp) — bài đọc 7 đoạn A–G
 *   Writing Skills: Bài luận thảo luận hai mặt (Discuss both views and give your opinion)
 *   Speaking Skills: Kể lại trải nghiệm đã qua (Part 2 cue card + Part 3 nối tiếp)
 *   Homework: dịch có 💡, trắc nghiệm, điền, đọc tóm tắt ngắn, viết mở/kết bài.
 *
 * Bài đọc, bài mẫu, câu trả lời mẫu và bài tập đều VIẾT MỚI (xem ../SOAN-BAI.md).
 * Đề bài mẫu Writing dùng lại từ vựng Ngày 13 (học trực tuyến vs trên lớp).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Reading ─────────────────────────── */

const D14_READING: Lesson = {
  id: "d14-doc",
  kind: "reading",
  title: "Đọc: Summary Completion — chọn từ trong hộp (with a box)",
  goal: "Làm được dạng Summary Completion có hộp từ: tìm đoạn bài đọc tương ứng, đoán loại từ cho từng chỗ trống, chia hộp từ theo loại từ, nhận ra paraphrase và loại các phương án nhiễu trái nghĩa.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Summary Completion** = điền vào **đoạn tóm tắt** một phần bài đọc. Kiểu **có hộp từ** (with a box): chọn **chữ cái A, B, C…** từ một danh sách cho sẵn.",
        "Hộp luôn có **nhiều từ hơn** số chỗ trống (thừa 3–5 từ nhiễu) và từ trong hộp **thường KHÔNG giống** chữ trong bài — chúng là **paraphrase**.",
        "Cách làm: ==đọc tóm tắt → tìm đoạn bài → đoán loại từ → chia hộp theo loại từ → đọc kỹ bài → chọn → đọc lại cả câu==.",
        "Bẫy lớn nhất: hai từ **cùng loại, trái nghĩa** trong hộp (slow / quick, similarly / differently) — phải đọc đúng **ý** của bài.",
        "Luyện: bài đọc **7 đoạn A–G** về ghi chép bằng tay và bằng bàn phím · **14 câu** (2 tóm tắt + 3 câu True/False/Not Given ôn Ngày 12) · **30 từ vựng**.",
      ],
    },

    { t: "h", text: "1. Summary Completion là gì? Hai kiểu đề" },
    {
      t: "p",
      text: "**Summary** (bản tóm tắt) là một đoạn văn ngắn **kể lại ý chính** của một phần bài đọc bằng **lời khác**. Một số từ trong đoạn đã bị xoá đi; bạn phải điền lại. Có **hai kiểu**: kiểu bạn đã gặp ở Sentence / Flow-chart Completion (**chép từ trong bài**) và kiểu **chọn từ trong hộp** — hôm nay học kiểu thứ hai.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai kiểu Summary Completion",
      caption: "Nhìn đề bài là biết ngay kiểu nào: có “from the passage” → chép từ trong bài; có “from the box / list below, A–J” → chọn chữ cái.",
      cols: [
        {
          title: "Không có hộp — **chép từ trong bài**",
          items: [
            "Đề: Choose **NO MORE THAN TWO WORDS from the passage**",
            "Đáp án = **đúng chữ** trong bài",
            "Giới hạn số từ rất quan trọng",
            "Giống Ngày 4 (Sentence) và Ngày 6 (Flow-chart)",
          ],
        },
        {
          title: "Có hộp — **chọn A, B, C…**",
          items: [
            "Đề: Complete the summary using the list of words, **A–J**, below",
            "Đáp án = **chữ cái** của từ trong hộp",
            "Từ trong hộp thường là **từ đồng nghĩa**, không phải chữ trong bài",
            "Hộp thừa 3–5 từ nhiễu; mỗi chữ cái thường chỉ dùng **một lần**",
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ về kiểu có hộp từ",
      items: [
        "Bạn ghi vào phiếu trả lời **chữ cái** (C), không ghi từ (superior). Viết từ thay chữ cái là **mất điểm** trong thi thật. (Ô điền trong bài luyện này nhận cả hai để bạn tập.)",
        "Vì từ trong hộp là **paraphrase**, kiểu này kiểm tra **hiểu nghĩa** nhiều hơn là dò chữ. Đừng chọn một từ chỉ vì nó **trông giống** chữ trong bài.",
        "Tóm tắt thường đi **theo thứ tự** bài đọc, và thường chỉ tóm tắt **một vài đoạn** (đề hay ghi rõ, hoặc tiêu đề tóm tắt cho biết).",
        "Đọc đề cẩn thận: “You may use any letter **more than once**” (dùng lại được) hiếm gặp; mặc định mỗi chữ cái dùng **một lần**.",
      ],
    },

    { t: "h", text: "2. Cách làm: 7 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "Summary Completion có hộp từ — 7 bước",
      caption: "Bước 3–4 là chỗ người mới hay bỏ qua — nhưng chính nó loại được một nửa hộp từ trước khi đọc bài.",
      steps: [
        { label: "1. Đọc tiêu đề + cả đoạn tóm tắt", sub: "Hiểu tóm tắt nói về ý gì, chưa nhìn hộp" },
        { label: "2. Tìm đoạn bài tương ứng", sub: "Dò từ khoá / tên riêng / con số của câu đầu tóm tắt" },
        { label: "3. Đoán loại từ từng chỗ trống", sub: "Ghi n / adj / adv / v bên cạnh mỗi chỗ trống" },
        { label: "4. Chia hộp theo loại từ", sub: "Gạch nhóm: danh từ · tính từ · trạng từ · động từ" },
        { label: "5. Đọc kỹ câu trong bài", sub: "Hiểu ý: tích cực hay tiêu cực? tăng hay giảm? giống hay khác?" },
        { label: "6. Chọn từ đồng nghĩa", sub: "Từ trong hộp diễn đạt ĐÚNG ý của câu bài đọc" },
        { label: "7. Đọc lại cả câu tóm tắt", sub: "Đúng ngữ pháp (số ít/nhiều, a/an) và đúng nghĩa?" },
      ],
    },
    {
      t: "table",
      head: ["Dấu hiệu quanh chỗ trống", "Thường cần", "Ví dụ"],
      rows: [
        ["sau **a / an / the / their / of**", "danh từ (an + nguyên âm)", "a lack of ___ → **motivation**"],
        ["sau **was / were / is / became**", "tính từ (hoặc danh từ)", "handwriting is ___ → **slow**"],
        ["sau động từ thường, cuối câu", "trạng từ", "the two groups performed ___ → **similarly**"],
        ["sau **should / can / to**", "động từ nguyên mẫu", "students should ___ their notes → **summarise**"],
        ["trước danh từ", "tính từ", "a ___ record → **word-for-word**"],
        ["trước động từ số nhiều (were, have)", "danh từ số nhiều", "their ___ stayed the same → **habits**"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở dạng bài này",
      items: [
        "**Chọn từ trông giống chữ trong bài.** Bài viết “typing was the **better** choice”, hộp có **superior** — người mới thấy không có “better” nên bỏ qua. Ngược lại, hộp có một từ y hệt chữ trong bài nhưng **sai ý** thì lại chọn ngay.",
        "**Bỏ qua ý tích cực / tiêu cực.** Hộp gần như luôn có **cặp trái nghĩa**: slow – quick, similarly – differently, advantages – costs, nearby – distant. Đọc sai ý là chọn đúng loại từ mà vẫn sai.",
        "**Quên kiểm tra ngữ pháp.** “an ___” mà chọn từ bắt đầu bằng phụ âm; “were ___” mà chọn danh từ số ít.",
        "**Dùng một chữ cái hai lần.** Nếu hai chỗ trống cùng có vẻ hợp một từ, một trong hai chắc chắn sai — đọc lại.",
        "**Ghi sai hình thức đáp án** (phần này sách chưa có). Đề ghi “Write the correct letter, **A–H**” thì chỉ ghi **chữ cái** (D), không chép cả từ (~~quickly~~) — bài thi thật chấm sai. Đề tóm tắt **không có hộp** (“Choose ONE WORD ONLY from the passage”) thì ngược lại: chép **từ trong bài**, đúng chính tả, đúng số ít / số nhiều.",
      ],
    },
    {
      t: "rule",
      formula: "Đọc tóm tắt → tìm đoạn → đoán loại từ (n / adj / adv / v) → chia hộp theo loại từ → đọc ý câu bài → chọn từ ĐỒNG NGHĨA → đọc lại cả câu",
      vi: "Từ trong hộp là paraphrase. Kiểm cặp trái nghĩa và ngữ pháp (a/an, số ít/nhiều) trước khi chốt.",
    },

    { t: "h", text: "3. Ví dụ ngắn: áp dụng 7 bước (phần thêm)" },
    {
      t: "examples",
      items: [
        { en: "Passage: Bamboo is one of the fastest-growing plants on Earth. Some species can grow almost a metre in a single day, and a new forest can be harvested after only three to five years, compared with several decades for most trees.", vi: "Bài đọc: Tre là một trong những loài cây mọc nhanh nhất Trái Đất. Một số loài có thể cao gần một mét chỉ trong một ngày, và một rừng mới có thể thu hoạch chỉ sau ba đến năm năm, so với vài chục năm của phần lớn các loài cây." },
        { en: "Summary: Bamboo grows extremely (1) ______, so it can be cut much (2) ______ than ordinary trees.", vi: "Tóm tắt: Tre mọc cực kỳ (1) ______, nên có thể chặt (2) ______ hơn nhiều so với cây thường." },
        { en: "Box: A sooner   B slowly   C later   D quickly   E tall", vi: "Hộp: A sớm hơn · B chậm · C muộn hơn · D nhanh · E cao" },
      ],
    },
    {
      t: "table",
      head: ["Bước", "Áp dụng"],
      rows: [
        ["3. Loại từ", "(1) sau động từ **grows** + extremely → **trạng từ**. (2) sau **much** + than → **trạng từ so sánh hơn**."],
        ["4. Chia hộp", "Trạng từ: **slowly, quickly**. So sánh hơn: **sooner, later**. **tall** (tính từ) bị loại ngay."],
        ["5. Ý câu bài", "“fastest-growing… a metre in a single day” → mọc **nhanh**. “after only three to five years, compared with several decades” → thu hoạch **sớm hơn**."],
        ["6. Chọn", "(1) **D quickly** (fastest-growing ↔ grows quickly). (2) **A sooner** (after only 3–5 years ↔ cut much sooner). Nhiễu trái nghĩa: B slowly, C later."],
        ["7. Đọc lại", "“Bamboo grows extremely **quickly**, so it can be cut much **sooner** than ordinary trees.” ✓ đúng ngữ pháp, đúng ý."],
      ],
    },

    { t: "h", text: "4. Bài đọc luyện tập" },
    {
      t: "p",
      text: "Bài đọc dưới đây được soạn riêng cho khoá học (7 đoạn, khoảng 620 từ — dài và nhiều ý hơn các bài đọc trước). Theo đúng chiến thuật: đọc **hai đoạn tóm tắt** ở Questions 1–11 **trước**, rồi mới đọc bài.",
    },
    {
      t: "passage",
      title: "Pen or Keyboard? What Science Says About Taking Notes",
      intro: "Bài đọc 7 đoạn A–G. Questions 1–14 ở ngay bên dưới.",
      paras: [
        {
          label: "A",
          text: "Walk into almost any university lecture hall today and you will see rows of glowing screens. For many students, a laptop is now as basic a piece of equipment as a pen once was. Typing is fast, notes are neat, and everything can be stored in one place. Yet over the past two decades, psychologists have asked a surprisingly simple question: does the way we take notes change how much we actually learn?",
        },
        {
          label: "B",
          text: "At first, the answer seemed obvious. Because most people can type far more quickly than they can write by hand, typists are able to record much more of what a lecturer says. In the early 2000s, the assumption was that typing was simply the better choice, and many universities actively encouraged it. Some even gave every new student a laptop and installed power sockets beside each seat in their lecture theatres.",
        },
        {
          label: "C",
          text: "The first serious challenge to this view came from a set of experiments carried out by a team of American psychologists. Students watched short recorded talks on general topics such as history and economics, taking notes either on a laptop or with pen and paper. Afterwards, they answered two kinds of questions. On simple factual questions — dates, names, numbers — the scores of the two groups were almost identical. But on questions that asked them to explain an idea or apply it to a new situation, the students who had written by hand did clearly better.",
        },
        {
          label: "D",
          text: "Why should a slower method lead to better learning? The researchers' explanation focused on what happens in the brain during note-taking. Writing by hand takes much longer, so it is impossible to record everything. Students therefore have to listen, decide which points matter most and express them in their own words — and this process of selecting and summarising is itself a powerful form of learning. Typists, by contrast, often copied the lecturer's sentences exactly, a habit researchers call verbatim note-taking. In one experiment, typists were specifically told not to copy word for word, yet the instruction made almost no difference to the way they typed.",
        },
        {
          label: "E",
          text: "There is also a second problem with laptops, which has nothing to do with typing itself. A connected computer offers endless temptations: messages, news, shopping and social media are only one click away. Classroom observations have found that many students switch between their notes and unrelated websites throughout a lecture. Worse still, the damage spreads. In one study, students who sat behind a classmate using a laptop for other activities remembered less of the lecture, even though they had not touched a computer themselves.",
        },
        {
          label: "F",
          text: "However, the case against keyboards is not as strong as early headlines suggested. When other research groups repeated the original experiments, some found the advantage of handwriting to be much smaller, and a few found no clear difference at all. Typing also has real benefits. For students with dyslexia, or with physical conditions that make holding a pen painful, it can be the only practical option. Typed notes are easier to search, organise and share with classmates, and in subjects such as computer science, where lectures often include code, a keyboard may be the most natural tool.",
        },
        {
          label: "G",
          text: "Most experts now conclude that the tool matters less than the way it is used. A student who types but deliberately summarises each point in their own words is likely to learn more than one who copies by hand without thinking. Practical advice follows from this: switch off the internet during lectures, write short summaries rather than full sentences, and review notes within a day. For those who want the best of both worlds, tablets with digital pens now allow students to write by hand and still keep their notes organised on a screen.",
        },
      ],
    },

    { t: "h", text: "Questions 1–6" },
    {
      t: "p",
      text: "Complete the summary using the list of words, **A–J**, below. Write the correct letter, **A–J**. — **Hoàn thành đoạn tóm tắt bằng danh sách từ A–J bên dưới. Viết chữ cái đúng.**",
    },
    {
      t: "table",
      caption: "Early beliefs and the first experiments (paragraphs B–D)",
      head: ["", "Summary"],
      rows: [
        ["", "For a long time, many people believed that typing notes was **(1) ______** because typists could record more of a lecture. However, a series of experiments suggested a different picture. When students were tested on facts, the two groups performed **(2) ______**, but laptop users did worse when questions required a real **(3) ______** of the ideas. Researchers explained that handwriting is **(4) ______**, so students have to select the main points and put them into their own words. Typists, on the other hand, tend to produce a **(5) ______** record of what the lecturer says, which involves little thinking. Even when typists were specifically instructed to change, their **(6) ______** stayed almost the same."],
      ],
    },
    {
      t: "table",
      caption: "List of words",
      head: ["", "", "", "", ""],
      rows: [
        ["**A** similarly", "**B** understanding", "**C** superior", "**D** slow", "**E** word-for-word"],
        ["**F** habits", "**G** expensive", "**H** quick", "**I** memory", "**J** differently"],
      ],
    },
    {
      t: "quiz",
      id: "d14-doc-cau-1",
      title: "Questions 1–6 — viết chữ cái A–J (ô luyện nhận cả chữ cái hoặc từ)",
      kind: "fill",
      items: [
        { q: "(1) many people believed that typing notes was ___", answers: ["C", "superior"], hint: "sau was → tính từ; ý: tốt hơn" },
        { q: "(2) When students were tested on facts, the two groups performed ___", answers: ["A", "similarly"], hint: "sau động từ performed → trạng từ" },
        { q: "(3) laptop users did worse when questions required a real ___ of the ideas", answers: ["B", "understanding"], hint: "a real ___ of → danh từ" },
        { q: "(4) Researchers explained that handwriting is ___", answers: ["D", "slow"], hint: "sau is → tính từ" },
        { q: "(5) Typists tend to produce a ___ record of what the lecturer says", answers: ["E", "word-for-word"], hint: "a ___ record → tính từ đứng trước danh từ" },
        { q: "(6) Even when typists were specifically instructed to change, their ___ stayed almost the same", answers: ["F", "habits"], hint: "their ___ stayed → danh từ (số nhiều được)" },
      ],
    },

    { t: "h", text: "Questions 7–11" },
    {
      t: "p",
      text: "Complete the summary using the list of words, **A–I**, below. Write the correct letter, **A–I**.",
    },
    {
      t: "table",
      caption: "Other problems and benefits (paragraphs E–G)",
      head: ["", "Summary"],
      rows: [
        ["", "Laptops can also cause problems because of the **(7) ______** they offer: many students visit unrelated websites during lectures. This affects not only the laptop user but also **(8) ______** students who can see the screen. Nevertheless, typing has some clear **(9) ______**. For example, it is very helpful for students with certain **(10) ______**, and typed notes are easier to search and share. In the end, experts recommend that students should **(11) ______** their notes in their own words, whatever tool they use."],
      ],
    },
    {
      t: "table",
      caption: "List of words",
      head: ["", "", ""],
      rows: [
        ["**A** advantages", "**B** distractions", "**C** nearby"],
        ["**D** summarise", "**E** disabilities", "**F** costs"],
        ["**G** copy", "**H** distant", "**I** instructions"],
      ],
    },
    {
      t: "quiz",
      id: "d14-doc-cau-2",
      title: "Questions 7–11 — viết chữ cái A–I",
      kind: "fill",
      items: [
        { q: "(7) Laptops can also cause problems because of the ___ they offer", answers: ["B", "distractions"], hint: "the ___ → danh từ; ý: thứ cám dỗ" },
        { q: "(8) This affects not only the laptop user but also ___ students who can see the screen", answers: ["C", "nearby"], hint: "trước danh từ students → tính từ" },
        { q: "(9) Nevertheless, typing has some clear ___", answers: ["A", "advantages"], hint: "some clear ___ → danh từ số nhiều; Nevertheless → ý tích cực" },
        { q: "(10) it is very helpful for students with certain ___", answers: ["E", "disabilities"], hint: "certain ___ → danh từ số nhiều" },
        { q: "(11) experts recommend that students should ___ their notes in their own words", answers: ["D", "summarise", "summarize"], hint: "should + động từ nguyên mẫu" },
      ],
    },

    { t: "h", text: "Questions 12–14 (ôn dạng True / False / Not Given — Ngày 12)" },
    {
      t: "mcq",
      id: "d14-doc-tfng",
      title: "Questions 12–14 — TRUE / FALSE / NOT GIVEN",
      items: [
        { q: "(12) In the early 2000s, some universities provided laptops for all new students.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: “Some even **gave every new student a laptop**.” — some universities = Some; provided = gave; all new students = every new student → **TRUE**." },
        { q: "(13) The recorded talks used in the experiment in paragraph C were long.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn C: “Students watched **short** recorded talks…” → bài nói **ngắn**, trái nghĩa trực tiếp với “long” → **FALSE**. Bẫy: nếu đề hỏi một con số cụ thể (vd “more than 20 minutes”) mà bài không cho số phút thì mới là NOT GIVEN." },
        { q: "(14) Most students today prefer to take notes by hand.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài nói nhiều sinh viên dùng laptop (đoạn A) nhưng **không hề nói** phần lớn sinh viên **thích** cách nào hơn → **NOT GIVEN**. Đừng suy luận từ hiểu biết của mình." },
      ],
    },

    { t: "h", text: "5. Giải thích đáp án" },
    {
      t: "note",
      title: "Giải thích câu 1–3",
      items: [
        "**(1) C superior** · Đoạn B: “the assumption was that typing was simply **the better choice**”. **superior** = tốt hơn, vượt trội. Nhiễu: **H quick** cũng là tính từ và đúng là typing nhanh — nhưng câu tóm tắt nói người ta tin nó **tốt hơn** (vì ghi được nhiều), không phải tin nó nhanh.",
        "**(2) A similarly** · Đoạn C: “On simple factual questions… the scores of the two groups were **almost identical**.” identical = giống hệt → performed **similarly**. Cặp nhiễu trái nghĩa: **J differently**.",
        "**(3) B understanding** · Đoạn C: “questions that asked them to **explain an idea or apply it** to a new situation” → cần **hiểu** thật sự. Nhiễu: **I memory** — nhưng câu hỏi về **trí nhớ** (dates, names, numbers) thì hai nhóm **ngang nhau**; nhóm laptop chỉ kém ở câu hỏi cần **hiểu**.",
      ],
    },
    {
      t: "note",
      title: "Giải thích câu 4–6",
      items: [
        "**(4) D slow** · Đoạn D: “Writing by hand **takes much longer**” (và câu hỏi đầu đoạn: “Why should a **slower** method…”). Nhiễu trái nghĩa: **H quick**.",
        "**(5) E word-for-word** · Đoạn D: “Typists… often **copied the lecturer's sentences exactly**, a habit researchers call **verbatim** note-taking.” verbatim = word-for-word = nguyên văn từng chữ.",
        "**(6) F habits** · Đoạn D: “typists were specifically told not to copy word for word, yet the instruction **made almost no difference to the way they typed**.” the way they typed = **habits** (thói quen); made almost no difference = stayed almost the same. Nhiễu: **I memory** (danh từ nhưng sai ý).",
      ],
    },
    {
      t: "note",
      title: "Giải thích câu 7–11",
      items: [
        "**(7) B distractions** · Đoạn E: “A connected computer offers **endless temptations**: messages, news, shopping and social media…” temptations (cám dỗ) ở đây = **distractions** (thứ làm xao nhãng). Nhiễu: **F costs** (danh từ nhưng bài không nói chi phí).",
        "**(8) C nearby** · Đoạn E: “students who **sat behind** a classmate using a laptop… remembered less” → những người **ngồi gần**. Nhiễu trái nghĩa: **H distant**.",
        "**(9) A advantages** · Đoạn F: “Typing also has **real benefits**.” benefits = **advantages**. Từ nối **Nevertheless** (tuy vậy) trong tóm tắt báo ý **tích cực** → loại **F costs**.",
        "**(10) E disabilities** · Đoạn F: “students with **dyslexia** (chứng khó đọc), or with **physical conditions** that make holding a pen painful” → **disabilities** (khuyết tật, khó khăn về thể chất / học tập).",
        "**(11) D summarise** · Đoạn G: “A student who types but **deliberately summarises each point in their own words**…” và lời khuyên “write short summaries”. Nhiễu trái nghĩa: **G copy** — chép nguyên văn chính là thói quen bài đọc khuyên **tránh**.",
      ],
    },

    { t: "h", text: "6. Luyện nhận ra paraphrase (phần thêm)" },
    {
      t: "mcq",
      id: "d14-doc-paraphrase",
      title: "Cụm nào trong bài có nghĩa giống cụm in đậm? (5 câu)",
      items: [
        { q: "**performed similarly**", options: ["did clearly better", "found no clear difference at all", "the scores were almost identical"], correct: 2, why: "**almost identical** (gần như giống hệt) = performed **similarly**. Lưu ý: “found no clear difference” cũng gần nghĩa nhưng nói về **các nhóm nghiên cứu sau** (đoạn F), không phải hai nhóm sinh viên." },
        { q: "**takes much longer**", options: ["is slower", "is far quicker", "is impossible"], correct: 0, why: "takes much longer = **slower** (chậm hơn)." },
        { q: "**endless temptations**", options: ["a few problems", "many distractions", "useful tools"], correct: 1, why: "temptation = sự cám dỗ; endless = vô tận → **many distractions**." },
        { q: "**the only practical option**", options: ["the most expensive choice", "a popular choice", "the only realistic choice"], correct: 2, why: "practical = thực tế, làm được; option = choice → **the only realistic choice**." },
        { q: "**review notes within a day**", options: ["look at notes again in the next 24 hours", "write notes every day", "share notes with friends"], correct: 0, why: "review = xem lại; within a day = trong vòng một ngày → **look at notes again in the next 24 hours**." },
      ],
    },
    {
      t: "rule",
      formula: "Bài đọc: almost identical · takes much longer · real benefits · sat behind → Tóm tắt: similarly · slow · advantages · nearby",
      vi: "Summary có hộp từ = trò chơi paraphrase: luôn hỏi “từ nào trong hộp NÓI LẠI ý của câu bài đọc?”",
    },
    {
      t: "quiz",
      id: "d14-doc-dich",
      title: "Dịch sang tiếng Anh — câu paraphrase kiểu tóm tắt (4 câu)",
      kind: "translate",
      grammar: "Dùng từ đồng nghĩa của bài: perform similarly · be slower / take longer · have advantages / benefits · summarise … in their own words.",
      items: [
        { q: "Hai nhóm làm bài giống nhau ở các câu hỏi về sự kiện.", hint: "The two groups, performed similarly, on factual questions", answers: ["The two groups performed similarly on factual questions.", "The two groups performed similarly on the factual questions.", "Both groups performed similarly on factual questions.", "Both groups performed similarly on the factual questions."] },
        { q: "Viết tay chậm hơn gõ phím.", hint: "Handwriting / Writing by hand, is slower than, typing", answers: ["Handwriting is slower than typing.", "Writing by hand is slower than typing.", "Writing by hand takes longer than typing.", "Handwriting takes longer than typing."] },
        { q: "Gõ phím cũng có một số ưu điểm rõ ràng.", hint: "Typing also has, some clear advantages / benefits", answers: ["Typing also has some clear advantages.", "Typing also has some clear benefits.", "Typing has some clear advantages too.", "Typing has some clear benefits too.", "Typing also has some obvious advantages."] },
        { q: "Học sinh nên tóm tắt ghi chép bằng lời của chính mình.", hint: "Students should, summarise their notes, in their own words", answers: ["Students should summarise their notes in their own words.", "Students should summarize their notes in their own words.", "Students should summarise notes in their own words.", "Students should summarize notes in their own words."] },
      ],
    },

    { t: "h", text: "7. Từ vựng của bài đọc (30 từ)" },
    {
      t: "p",
      text: "Tất cả 30 từ đều có mặt trong bài (có khi ở dạng khác: observations, switch between, summarising…). Bấm 🔊 để nghe, tìm lại từ trong bài, rồi tự đặt một câu về việc học của bạn.",
    },
    {
      t: "vocab",
      items: [
        { w: "glowing", pos: "adj", ipa: "/ˈɡləʊɪŋ/", vi: "phát sáng, sáng rực", ex: "The children's faces were lit by glowing screens.", exVi: "Khuôn mặt bọn trẻ sáng lên bởi những màn hình phát sáng.", more: "Động từ **glow** (phát sáng nhẹ). Nghĩa bóng: **glowing** review = lời khen nồng nhiệt." },
        { w: "equipment", pos: "n", ipa: "/ɪˈkwɪpmənt/", vi: "thiết bị, dụng cụ", ex: "A good pair of shoes is the most important equipment for a runner.", exVi: "Một đôi giày tốt là thiết bị quan trọng nhất của người chạy bộ.", more: "**Không đếm được**: a piece of equipment (~~an equipment~~, ~~equipments~~)." },
        { w: "store", pos: "v", ipa: "/stɔː(r)/", vi: "lưu trữ, cất giữ", ex: "All my photos are stored online.", exVi: "Mọi ảnh của tôi đều được lưu trực tuyến.", more: "Danh từ **storage** (sự lưu trữ). **store** (n) = cửa hàng (Mỹ)." },
        { w: "decade", pos: "n", ipa: "/ˈdekeɪd/", vi: "thập kỷ (10 năm)", ex: "Prices have doubled over the past decade.", exVi: "Giá cả đã tăng gấp đôi trong thập kỷ qua.", more: "**over the past two decades** = trong hai mươi năm qua · **for decades** = hàng chục năm." },
        { w: "obvious", pos: "adj", ipa: "/ˈɒbviəs/", vi: "hiển nhiên, rõ ràng", ex: "The answer seemed obvious, but it was wrong.", exVi: "Câu trả lời có vẻ hiển nhiên nhưng lại sai.", more: "Trạng từ **obviously**. Gần nghĩa: **clear, evident**." },
        { w: "assumption", pos: "n", ipa: "/əˈsʌmpʃn/", vi: "giả định, điều được cho là đúng (chưa kiểm chứng)", ex: "Don't make assumptions about people from their clothes.", exVi: "Đừng đưa ra giả định về người khác qua quần áo của họ.", more: "**make an assumption** · động từ **assume** (cho rằng)." },
        { w: "actively", pos: "adv", ipa: "/ˈæktɪvli/", vi: "một cách tích cực, chủ động", ex: "The school actively encourages students to read.", exVi: "Nhà trường tích cực khuyến khích học sinh đọc sách.", more: "**actively** encourage / take part / support." },
        { w: "socket", pos: "n", ipa: "/ˈsɒkɪt/", vi: "ổ cắm điện", ex: "Is there a socket near the desk for my charger?", exVi: "Có ổ cắm nào gần bàn để cắm sạc không?", more: "Anh: **(power) socket**; Mỹ: **outlet**. Cái phích cắm = **plug**." },
        { w: "factual", pos: "adj", ipa: "/ˈfæktʃuəl/", vi: "thuộc về sự kiện, dữ kiện (đúng/sai kiểm được)", ex: "The quiz had twenty factual questions about Vietnamese history.", exVi: "Bài đố có hai mươi câu hỏi dữ kiện về lịch sử Việt Nam.", more: "Từ **fact** (sự thật, dữ kiện). Khác **conceptual** (thuộc về khái niệm, cần hiểu)." },
        { w: "identical", pos: "adj", ipa: "/aɪˈdentɪkl/", vi: "giống hệt", ex: "The twins wore identical shirts.", exVi: "Cặp sinh đôi mặc áo giống hệt nhau.", more: "**identical to / with** · **identical twins** (sinh đôi cùng trứng) · gần nghĩa: **the same**." },
        { w: "apply", pos: "v", ipa: "/əˈplaɪ/", vi: "áp dụng; nộp đơn", ex: "Try to apply the new grammar in your own sentences.", exVi: "Hãy thử áp dụng ngữ pháp mới vào câu của chính bạn.", more: "**apply** something **to** a situation (áp dụng) · **apply for** a job (nộp đơn) · danh từ **application**." },
        { w: "explanation", pos: "n", ipa: "/ˌekspləˈneɪʃn/", vi: "lời giải thích, cách giải thích", ex: "There is a simple explanation for the result.", exVi: "Có một cách giải thích đơn giản cho kết quả này.", more: "Động từ **explain** (~~explain me~~ → **explain to me**). Chính tả: explain → expl**a**nation (mất chữ i)." },
        { w: "express", pos: "v", ipa: "/ɪkˈspres/", vi: "diễn đạt, bày tỏ", ex: "It is hard to express my feelings in English.", exVi: "Bày tỏ cảm xúc bằng tiếng Anh thật khó.", more: "**express** an idea / an opinion / feelings · danh từ **expression**." },
        { w: "select", pos: "v", ipa: "/sɪˈlekt/", vi: "chọn lọc, lựa chọn", ex: "Only ten students were selected for the team.", exVi: "Chỉ mười học sinh được chọn vào đội.", more: "Trang trọng hơn **choose** · danh từ **selection**." },
        { w: "summarise", pos: "v", ipa: "/ˈsʌməraɪz/", vi: "tóm tắt", ex: "Can you summarise the article in three sentences?", exVi: "Bạn có thể tóm tắt bài báo trong ba câu không?", more: "Mỹ viết **summarize** · danh từ **summary** (bản tóm tắt) — chính tên dạng bài hôm nay." },
        { w: "by contrast", pos: "phr", ipa: "/baɪ ˈkɒntrɑːst/", vi: "ngược lại, trái lại (so sánh hai thứ khác nhau)", ex: "The north is cold in winter. By contrast, the south is warm all year.", exVi: "Miền Bắc lạnh vào mùa đông. Ngược lại, miền Nam ấm quanh năm.", more: "Gần nghĩa: **in contrast, on the other hand**. Từ nối rất hay gặp trong Reading — báo hiệu ý **đối lập**." },
        { w: "verbatim", pos: "adj, adv", ipa: "/vɜːˈbeɪtɪm/", vi: "nguyên văn, từng chữ một", ex: "He repeated the teacher's words verbatim.", exVi: "Anh ấy nhắc lại lời thầy nguyên văn.", more: "= **word for word** (trạng từ) / **word-for-word** (tính từ, có gạch nối khi đứng trước danh từ)." },
        { w: "instruction", pos: "n", ipa: "/ɪnˈstrʌkʃn/", vi: "lời hướng dẫn, chỉ thị", ex: "Read the instructions carefully before you start the test.", exVi: "Đọc kỹ hướng dẫn trước khi bắt đầu bài thi.", more: "Thường số nhiều **instructions** · **follow / give** instructions · động từ **instruct**." },
        { w: "temptation", pos: "n", ipa: "/tempˈteɪʃn/", vi: "sự cám dỗ, thứ cám dỗ", ex: "There is always a temptation to check your phone.", exVi: "Luôn có sự cám dỗ muốn xem điện thoại.", more: "**resist** a temptation (cưỡng lại) · động từ **tempt** · tính từ **tempting** (hấp dẫn, cám dỗ)." },
        { w: "unrelated", pos: "adj", ipa: "/ˌʌnrɪˈleɪtɪd/", vi: "không liên quan", ex: "She asked a question unrelated to the lesson.", exVi: "Cô ấy hỏi một câu không liên quan đến bài học.", more: "**unrelated to** + N · trái nghĩa **related to** · tiền tố **un-** = không." },
        { w: "switch", pos: "v", ipa: "/swɪtʃ/", vi: "chuyển (qua lại), đổi", ex: "He kept switching between his notes and social media.", exVi: "Anh ấy liên tục chuyển qua lại giữa ghi chép và mạng xã hội.", more: "**switch between** A **and** B · **switch from** A **to** B · **switch off / on** (tắt / bật: switch off the internet)." },
        { w: "observation", pos: "n", ipa: "/ˌɒbzəˈveɪʃn/", vi: "sự quan sát (để nghiên cứu); nhận xét", ex: "Classroom observations showed that many students were not listening.", exVi: "Quan sát trong lớp cho thấy nhiều học sinh không nghe giảng.", more: "Động từ **observe** (quan sát) · **make an observation** (đưa ra nhận xét)." },
        { w: "repeat", pos: "v", ipa: "/rɪˈpiːt/", vi: "lặp lại; (nghiên cứu) làm lại thí nghiệm để kiểm chứng", ex: "Scientists repeated the experiment with a larger group.", exVi: "Các nhà khoa học làm lại thí nghiệm với nhóm lớn hơn.", more: "Từ học thuật cùng nghĩa: **replicate** (lặp lại nghiên cứu). Danh từ **repetition** (Ngày 13)." },
        { w: "headline", pos: "n", ipa: "/ˈhedlaɪn/", vi: "tiêu đề báo (dòng chữ to đầu bài báo)", ex: "The headline said that laptops make students lazy, but the study itself was more careful.", exVi: "Tiêu đề báo nói laptop làm sinh viên lười, nhưng bản thân nghiên cứu thận trọng hơn thế.", more: "**hit / make the headlines** = được báo chí nói đến nhiều. Trong bài: “early headlines suggested” = báo chí ban đầu nói quá lên." },
        { w: "option", pos: "n", ipa: "/ˈɒpʃn/", vi: "lựa chọn, phương án", ex: "For some students, typing is the only practical option.", exVi: "Với một số sinh viên, gõ phím là phương án khả thi duy nhất.", more: "**have no option but to** + V (không còn cách nào khác) · tính từ **optional** (tuỳ chọn) ≠ **compulsory** (bắt buộc)." },
        { w: "advantage", pos: "n", ipa: "/ədˈvɑːntɪdʒ/", vi: "ưu điểm, lợi thế", ex: "One advantage of living in the city is good public transport.", exVi: "Một ưu điểm của sống ở thành phố là giao thông công cộng tốt.", more: "**the advantage of + N / V-ing** · **have an advantage over** · trái nghĩa **disadvantage, drawback**." },
        { w: "practical", pos: "adj", ipa: "/ˈpræktɪkl/", vi: "thực tế, khả thi; thiết thực", ex: "Cycling to work is not practical in heavy rain.", exVi: "Đạp xe đi làm không thực tế khi trời mưa to.", more: "**practical** advice / option / skills · trạng từ **practically** (gần như)." },
        { w: "organise", pos: "v", ipa: "/ˈɔːɡənaɪz/", vi: "sắp xếp, tổ chức", ex: "I organise my notes by subject and date.", exVi: "Tôi sắp xếp ghi chép theo môn và ngày.", more: "Mỹ viết **organize** · danh từ **organisation** · tính từ **organised** (ngăn nắp)." },
        { w: "deliberately", pos: "adv", ipa: "/dɪˈlɪbərətli/", vi: "một cách có chủ ý, cố tình", ex: "He deliberately sat at the front to avoid distractions.", exVi: "Anh ấy cố ý ngồi bàn đầu để tránh xao nhãng.", more: "Gần nghĩa: **on purpose, intentionally** · trái nghĩa **accidentally**." },
        { w: "conclude", pos: "v", ipa: "/kənˈkluːd/", vi: "kết luận", ex: "The report concludes that more research is needed.", exVi: "Báo cáo kết luận rằng cần nghiên cứu thêm.", more: "**conclude that** + mệnh đề · danh từ **conclusion** (In conclusion, … — câu mở kết bài Task 2)." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những từ dễ hiểu nhầm trong bài",
      items: [
        "**challenge** ở đoạn C không phải “thử thách” mà là **sự chất vấn**, phản bác một quan điểm: a challenge **to this view**.",
        "**subject** (Ngày 13 bài nghe) = đối tượng thí nghiệm; **subjects** ở đoạn F = **môn học** (subjects such as computer science).",
        "**case** trong “the case against keyboards” = **lập luận** (phía chống bàn phím), không phải “trường hợp”.",
        "**conditions** trong “physical conditions” = **bệnh, tình trạng sức khoẻ**, không phải “điều kiện”.",
      ],
    },
  ],
};

/* ─────────────────────────── Writing ─────────────────────────── */

const D14_WRITING: Lesson = {
  id: "d14-viet",
  kind: "writing",
  title: "Viết: Bài luận thảo luận hai mặt (Discuss both views and give your opinion)",
  goal: "Nhận ra đề Discussion, phân tích đủ 3 nhiệm vụ (quan điểm A, quan điểm B, ý kiến của mình), lập dàn ý 4 đoạn và viết trọn một bài khoảng 260 từ bằng các khung câu On the one hand… / On the other hand… / In my opinion…",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Đề **Discussion** có **hai quan điểm** (Some people think… while others believe…) và kết bằng **Discuss both views and give your own opinion**.",
        "Bài phải làm **đủ 3 việc**: ==bàn quan điểm A== · ==bàn quan điểm B== · ==nêu rõ ý kiến của mình==. Thiếu một việc → Task Response khó vượt band 5.",
        "Dàn ý **4 đoạn**: Mở bài (paraphrase 2 quan điểm + ý kiến) → Thân 1 (quan điểm A) → Thân 2 (quan điểm B + mình đồng ý) → Kết bài.",
        "Khung câu chủ lực: **On the one hand, some people argue that… · Those who… believe that… · On the other hand… · I agree with the latter view because…**",
        "Bài mẫu trọn **260 từ** (đề: lớp học truyền thống có bị học trực tuyến thay thế không?) + phân tích theo **4 tiêu chí chấm**.",
      ],
    },

    { t: "h", text: "1. Nhận ra đề Discussion" },
    {
      t: "p",
      text: "Ở Ngày 6, 8, 10 bạn đã viết **Opinion Essay** (đề nêu **một** ý kiến, hỏi bạn đồng ý không). Hôm nay là dạng **Discussion Essay** (bài luận thảo luận): đề nêu **hai ý kiến trái nhau** và yêu cầu bạn **bàn cả hai** trước khi nói mình nghiêng về bên nào.",
    },
    {
      t: "table",
      head: ["Câu cuối đề", "Phải làm gì", "Dạng"],
      rows: [
        ["**Discuss both views and give your own opinion.**", "Bàn quan điểm A + quan điểm B + **nêu ý kiến**", "Discussion (có ý kiến) — **phổ biến nhất**"],
        ["**Discuss both these views.**", "Bàn A + B một cách cân bằng; ý kiến **không bắt buộc**", "Discussion (không hỏi ý kiến) — hiếm gặp"],
        ["**Do you agree or disagree? / To what extent…?**", "Nêu ý kiến về **một** nhận định", "Opinion (Ngày 6, 8, 10)"],
        ["**What are the advantages and disadvantages?**", "Bàn lợi và hại của **một** sự việc", "Advantages/Disadvantages (học sau)"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Opinion Essay ≠ Discussion Essay",
      caption: "Khác nhau ở chỗ: Discussion bắt bạn trình bày CÔNG BẰNG cả phía mình không đồng ý, rồi mới nói ý kiến.",
      cols: [
        {
          title: "**Opinion** (Ngày 6–10)",
          items: [
            "Đề: **một** nhận định",
            "Thân 1, Thân 2 = **hai lý do** cho quan điểm của mình",
            "Ý kiến xuất hiện **xuyên suốt** bài",
            "Câu hỏi: Do you agree or disagree?",
          ],
        },
        {
          title: "**Discussion** (hôm nay)",
          items: [
            "Đề: **hai** quan điểm đối lập",
            "Thân 1 = quan điểm **A**, Thân 2 = quan điểm **B**",
            "Ý kiến ở **mở bài, thân 2 và kết bài**",
            "Câu hỏi: Discuss both views and give your own opinion.",
          ],
        },
      ],
    },

    { t: "h", text: "2. Phân tích đề: tìm đủ 3 nhiệm vụ" },
    {
      t: "p",
      text: "**Đề mẫu:** Some people think that traditional classrooms will soon be replaced by online learning, while others believe that face-to-face teaching will always be necessary. Discuss both views and give your own opinion. — **Một số người cho rằng lớp học truyền thống sẽ sớm bị học trực tuyến thay thế, trong khi những người khác tin rằng dạy học trực tiếp sẽ luôn cần thiết. Hãy thảo luận cả hai quan điểm và nêu ý kiến của bạn.**",
    },
    {
      t: "table",
      head: ["Nhiệm vụ", "Trong đề", "Bạn cần viết"],
      rows: [
        ["1. Quan điểm A", "traditional classrooms will soon be **replaced** by online learning", "**Vì sao** một số người nghĩ vậy (2 lý do + ví dụ) — kể cả khi bạn không đồng ý"],
        ["2. Quan điểm B", "face-to-face teaching will **always be necessary**", "**Vì sao** người khác nghĩ vậy (2 lý do + ví dụ)"],
        ["3. Ý kiến của bạn", "give your own opinion", "Bạn đứng về phía nào (hoặc đồng ý một phần) — nói **rõ ở mở bài**, nhắc lại ở **kết bài**"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba lỗi làm mất điểm Task Response",
      items: [
        "**Chỉ bàn một quan điểm** (thường là quan điểm mình thích) → mất một nửa yêu cầu đề.",
        "**Không nêu ý kiến**, hoặc chỉ nêu ở câu cuối cùng của bài → giám khảo coi là thiếu nhiệm vụ 3. Hãy nói ý kiến **ngay ở mở bài**.",
        "**Ý kiến lệch nhau**: mở bài nói đồng ý A, kết bài lại đồng ý B. Viết xong, đọc lại câu cuối mở bài và câu đầu kết bài — phải **cùng một ý**.",
        "Viết về quan điểm mình không đồng ý mà dùng **I think** → lẫn lộn. Dùng **Some people argue that… / Supporters of this view believe that…** cho quan điểm của người khác.",
      ],
    },

    { t: "h", text: "3. Dàn ý 4 đoạn" },
    {
      t: "sodo",
      kind: "flow",
      title: "Discussion Essay — 4 đoạn, khoảng 260 từ, 40 phút",
      caption: "Mẹo: đặt quan điểm mình ĐỒNG Ý ở thân bài 2 — đoạn cuối trước kết bài là đoạn giám khảo nhớ nhất, và nó dẫn thẳng sang kết luận.",
      steps: [
        { label: "Mở bài (~50 từ)", sub: "Paraphrase quan điểm A + quan điểm B → câu nêu ý kiến của bạn" },
        { label: "Thân bài 1 (~85 từ)", sub: "Quan điểm A (phía bạn ÍT đồng ý hơn): câu chủ đề → lý do → ví dụ" },
        { label: "Thân bài 2 (~85 từ)", sub: "Quan điểm B (phía bạn đồng ý): câu chủ đề có “I agree” → lý do → ví dụ" },
        { label: "Kết bài (~40 từ)", sub: "In conclusion + nhắc lại hai phía ngắn gọn + khẳng định ý kiến" },
      ],
    },
    {
      t: "table",
      caption: "Hai cách đặt ý kiến — cả hai đều đạt điểm cao nếu nhất quán",
      head: ["Cách", "Mở bài", "Thân bài", "Kết bài", "Hợp khi"],
      rows: [
        ["**Cách 1: nghiêng một phía** (khuyên dùng)", "Nói rõ mình đồng ý quan điểm B", "Thân 1: A (công bằng) · Thân 2: B + **I agree**", "Nhắc lại: đồng ý B", "Bạn có lập trường rõ — dễ viết nhất"],
        ["**Cách 2: đồng ý một phần**", "Cả hai đều có lý, nhưng…", "Thân 1: A · Thân 2: B — mỗi đoạn có câu đánh giá ngắn", "Kết hợp hai bên / đồng ý tuỳ trường hợp", "Đề mà hai phía đều rất mạnh"],
      ],
    },

    { t: "h", text: "4. Mở bài — khung câu" },
    {
      t: "patterns",
      rows: [
        {
          formula: "Some people argue / believe that + S + V, while / whereas others feel / think that + S + V.",
          vi: "Câu 1 — paraphrase CẢ HAI quan điểm trong một câu (hoặc tách hai câu bằng Others, however, …).",
          examples: [
            { en: "Some people argue that online courses will soon take the place of traditional classrooms, while others believe that face-to-face teaching will always be needed.", vi: "Một số người lập luận rằng khoá học trực tuyến sẽ sớm thay chỗ lớp học truyền thống, trong khi những người khác tin rằng dạy trực tiếp sẽ luôn cần thiết." },
          ],
        },
        {
          formula: "In my opinion, / I believe that + S + V (+ although + S + V).",
          vi: "Câu 2 — nêu ý kiến ngay ở mở bài. Thêm although để thừa nhận phía kia (cho thấy bạn công bằng).",
          examples: [
            { en: "In my opinion, although online learning will continue to grow, it cannot completely replace classroom teaching.", vi: "Theo tôi, dù học trực tuyến sẽ tiếp tục phát triển, nó không thể thay thế hoàn toàn việc dạy trên lớp." },
          ],
        },
        {
          formula: "This essay will discuss both views before explaining why I support the latter / the former.",
          vi: "Câu tuỳ chọn — báo dàn bài. the former = cái thứ nhất (A); the latter = cái thứ hai (B).",
          examples: [
            { en: "This essay will discuss both views before explaining why I support the latter.", vi: "Bài luận này sẽ bàn cả hai quan điểm trước khi giải thích vì sao tôi ủng hộ quan điểm sau." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Mở bài = Some people argue that + [A], while others believe that + [B]. + In my opinion, (although + S + V,) + S + V.",
      vi: "Hai quan điểm trong câu 1, ý kiến của bạn trong câu 2 — không bao giờ để giám khảo phải đoán.",
    },
    {
      t: "quiz",
      id: "d14-viet-dich-mo",
      title: "Dịch sang tiếng Anh — câu mở bài Discussion (4 câu)",
      kind: "translate",
      grammar: "Some people argue / believe that + S + V, while others feel / think that + S + V. · In my opinion, + S + V. · I believe that + S + V. · although + S + V.",
      items: [
        { q: "Một số người cho rằng trẻ em nên bắt đầu đi học sớm, trong khi những người khác nghĩ chúng nên chơi nhiều hơn.", hint: "Some people believe / argue that, children should start school early, while others think that, they should play more", answers: ["Some people believe that children should start school early, while others think that they should play more.", "Some people believe that children should start school early, while others think they should play more.", "Some people argue that children should start school early, while others think that they should play more.", "Some people argue that children should start school early, while others think they should play more.", "Some people think that children should start school early, while others believe that they should play more.", "Some people believe that children should start school early while others think that they should play more.", "Some people believe children should start school early, while others think they should play more.", "Some people argue that children should start school early, whereas others think that they should play more."] },
        { q: "Theo tôi, cả hai quan điểm đều có lý.", hint: "In my opinion, both views, are reasonable / have some merit", answers: ["In my opinion, both views are reasonable.", "In my opinion both views are reasonable.", "In my opinion, both views have some merit.", "In my opinion, both views make sense.", "In my opinion, both views are valid.", "In my view, both views are reasonable."] },
        { q: "Tôi tin rằng dạy học trực tiếp sẽ luôn cần thiết.", hint: "I believe that, face-to-face teaching, will always be necessary", answers: ["I believe that face-to-face teaching will always be necessary.", "I believe face-to-face teaching will always be necessary.", "I believe that face-to-face teaching will always be needed.", "I believe face-to-face teaching will always be needed.", "I believe that teaching face to face will always be necessary."] },
        { q: "Dù học trực tuyến rất tiện, nó không thể thay thế hoàn toàn lớp học.", hint: "Although, online learning is very convenient, it cannot completely replace, classrooms", answers: ["Although online learning is very convenient, it cannot completely replace classrooms.", "Although online learning is very convenient, it can't completely replace classrooms.", "Although online learning is very convenient, it cannot replace classrooms completely.", "Although online learning is very convenient, it cannot fully replace classrooms.", "Although online learning is very convenient, it cannot completely replace the classroom.", "Even though online learning is very convenient, it cannot completely replace classrooms.", "While online learning is very convenient, it cannot completely replace classrooms."] },
      ],
    },

    { t: "h", text: "5. Thân bài — khung câu cho hai quan điểm" },
    {
      t: "table",
      head: ["Chức năng", "Khung câu", "Ghi chú"],
      rows: [
        ["Mở thân 1 (quan điểm A)", "**On the one hand**, there are good reasons to think that… / **Those who** support online learning **argue that**…", "Không dùng I think — đây là ý của **người khác**"],
        ["Nêu lý do", "**Firstly**, … **Secondly**, … / **The main reason is that**…", "Mỗi lý do 1–2 câu giải thích"],
        ["Đưa ví dụ", "**For example**, … / **For instance**, … / … **such as** …", "Ví dụ cụ thể: người, nơi, con số"],
        ["Mở thân 2 (quan điểm B)", "**On the other hand**, I agree with those who say that… / **However**, others believe that…", "Nếu đồng ý B: nói luôn **I agree** ở câu chủ đề"],
        ["Thêm ý", "**In addition**, … / **Moreover**, … / **Another reason is that**…", "Không lạm dụng — mỗi đoạn 1–2 từ nối là đủ"],
        ["Kết luận", "**In conclusion**, while… , I believe that… / **To sum up**, …", "Không đưa ý mới"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "On the one hand, + some people / those who + V + argue that + S + V. + This is because + S + V. + For example, + S + V.",
          vi: "Thân bài 1 — trình bày CÔNG BẰNG quan điểm A.",
          examples: [
            { en: "On the one hand, some people argue that online learning is more convenient. This is because students can study at any time. For example, working parents can watch lectures after their children go to bed.", vi: "Một mặt, một số người lập luận rằng học trực tuyến tiện hơn. Đó là vì sinh viên có thể học bất cứ lúc nào. Ví dụ, phụ huynh đi làm có thể xem bài giảng sau khi con đi ngủ." },
          ],
        },
        {
          formula: "On the other hand, + I agree with those who believe that + S + V. + The main reason is that + S + V.",
          vi: "Thân bài 2 — quan điểm B + ý kiến của bạn trong cùng câu chủ đề.",
          examples: [
            { en: "On the other hand, I agree with those who believe that classroom teaching is irreplaceable. The main reason is that students learn a great deal from interacting with others.", vi: "Mặt khác, tôi đồng ý với những người tin rằng dạy trên lớp là không thể thay thế. Lý do chính là học sinh học được rất nhiều từ việc tương tác với người khác." },
          ],
        },
        {
          formula: "In conclusion, while + S + V (phía A), I believe that + S + V (phía B).",
          vi: "Kết bài — một câu nhắc cả hai phía, khẳng định ý kiến; câu thứ hai (tuỳ chọn) đưa gợi ý / dự đoán.",
          examples: [
            { en: "In conclusion, while online courses offer flexibility, I believe that schools will remain essential because they teach social skills.", vi: "Tóm lại, dù khoá học trực tuyến mang lại sự linh hoạt, tôi tin rằng trường học vẫn thiết yếu vì chúng dạy kỹ năng xã hội." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Thân 1: On the one hand, some people argue that + [A] + This is because… + For example… · Thân 2: On the other hand, I agree with those who believe that + [B] + The main reason is that… · Kết: In conclusion, while + [A], I believe that + [B].",
      vi: "Ý người khác → some people argue / those who…; ý của mình → I agree / I believe. Mỗi đoạn thân bài: câu chủ đề → lý do → ví dụ.",
    },
    {
      t: "quiz",
      id: "d14-viet-dich-than",
      title: "Dịch sang tiếng Anh — câu thân bài và kết bài (5 câu)",
      kind: "translate",
      grammar: "On the one hand, some people argue that + S + V. · This is because + S + V. · For example, + S + V. · On the other hand, I agree with those who believe that + S + V. · In conclusion, while + S + V, I believe that + S + V.",
      items: [
        { q: "Một mặt, một số người lập luận rằng học trực tuyến rẻ hơn.", hint: "On the one hand, some people argue that, online learning is cheaper", answers: ["On the one hand, some people argue that online learning is cheaper.", "On the one hand some people argue that online learning is cheaper.", "On the one hand, some people argue online learning is cheaper.", "On the one hand, some people argue that learning online is cheaper.", "On the one hand, some people argue that online learning is less expensive."] },
        { q: "Đó là vì sinh viên không phải trả tiền đi lại.", hint: "This is because, students don't have to, pay for travel / transport", answers: ["This is because students don't have to pay for travel.", "This is because students do not have to pay for travel.", "This is because students don't have to pay for transport.", "This is because students do not have to pay for transport.", "This is because students don't need to pay for travel.", "This is because students don't have to pay for transportation."] },
        { q: "Ví dụ, một sinh viên ở vùng nông thôn có thể học ở một trường đại học nổi tiếng mà không cần rời nhà.", hint: "For example, a student in a rural area, can study at a famous university, without leaving home", answers: ["For example, a student in a rural area can study at a famous university without leaving home.", "For example a student in a rural area can study at a famous university without leaving home.", "For instance, a student in a rural area can study at a famous university without leaving home.", "For example, a student in the countryside can study at a famous university without leaving home.", "For example, a student in a rural area can study at a famous university without leaving his home.", "For example, a student in a rural area can study at a famous university without leaving their home."] },
        { q: "Mặt khác, tôi đồng ý với những người tin rằng giáo viên không thể bị thay thế.", hint: "On the other hand, I agree with those who believe that, teachers cannot be replaced", answers: ["On the other hand, I agree with those who believe that teachers cannot be replaced.", "On the other hand, I agree with those who believe that teachers can't be replaced.", "On the other hand, I agree with those who believe teachers cannot be replaced.", "On the other hand I agree with those who believe that teachers cannot be replaced.", "On the other hand, I agree with people who believe that teachers cannot be replaced."] },
        { q: "Tóm lại, dù công nghệ rất hữu ích, tôi tin rằng trường học vẫn sẽ thiết yếu.", hint: "In conclusion, while, technology is very useful, I believe that, schools will remain essential", answers: ["In conclusion, while technology is very useful, I believe that schools will remain essential.", "In conclusion, while technology is very useful, I believe schools will remain essential.", "In conclusion, although technology is very useful, I believe that schools will remain essential.", "In conclusion, while technology is very useful, I believe that schools will still be essential.", "In conclusion, although technology is very useful, I believe that schools will still be essential.", "To sum up, while technology is very useful, I believe that schools will remain essential."] },
      ],
    },

    { t: "h", text: "6. Bài mẫu trọn vẹn (260 từ)" },
    {
      t: "p",
      text: "**Đề:** Some people think that traditional classrooms will soon be replaced by online learning, while others believe that face-to-face teaching will always be necessary. Discuss both views and give your own opinion. — Bài mẫu đi theo **Cách 1** (nghiêng về quan điểm B). Từ vựng in đậm lấy từ bài **Ngày 13** (học trực tuyến & truyền thống) và bài ngữ pháp modal.",
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction — 56 words] In recent years, online courses have become increasingly popular, and some people argue that they will soon take the place of traditional classrooms. Others, however, believe that schools and universities where students learn face to face will always be needed. In my opinion, although online learning will continue to grow, it cannot completely replace classroom teaching.", vi: "[Mở bài] Những năm gần đây, các khoá học trực tuyến ngày càng phổ biến, và một số người lập luận rằng chúng sẽ sớm thay chỗ lớp học truyền thống. Tuy nhiên, những người khác tin rằng các trường học và đại học nơi sinh viên học trực tiếp sẽ luôn cần thiết. Theo tôi, dù học trực tuyến sẽ tiếp tục phát triển, nó không thể thay thế hoàn toàn việc dạy trên lớp." },
        { en: "[Body 1 — 74 words] On the one hand, there are good reasons to think that online education may become the main way of learning. Firstly, it offers great flexibility, as students can watch recorded lectures and study at their own pace. Secondly, it is far more cost-effective, because learners do not have to pay for travel or accommodation. For example, a student in a remote village can now take a course from a famous university without leaving home.", vi: "[Thân bài 1] Một mặt, có những lý do chính đáng để nghĩ rằng giáo dục trực tuyến có thể trở thành cách học chính. Thứ nhất, nó mang lại sự linh hoạt lớn, vì sinh viên có thể xem bài giảng ghi hình và học theo tốc độ riêng. Thứ hai, nó tiết kiệm chi phí hơn nhiều, vì người học không phải trả tiền đi lại hay chỗ ở. Ví dụ, một sinh viên ở một ngôi làng xa xôi giờ có thể học một khoá của một trường đại học nổi tiếng mà không cần rời nhà." },
        { en: "[Body 2 — 88 words] On the other hand, I agree with those who say that face-to-face teaching will always be necessary. The main reason is that learning is not only about information but also about interaction. In a classroom, students can ask questions and receive immediate feedback, and they develop social skills by working with their peers. In addition, many subjects, such as medicine and chemistry, require hands-on practice that cannot be done through a screen. For instance, a nursing student cannot learn how to care for patients simply by watching videos.", vi: "[Thân bài 2] Mặt khác, tôi đồng ý với những người cho rằng dạy trực tiếp sẽ luôn cần thiết. Lý do chính là việc học không chỉ là thông tin mà còn là sự tương tác. Trong lớp học, sinh viên có thể đặt câu hỏi và nhận góp ý ngay lập tức, và họ phát triển kỹ năng xã hội khi làm việc với bạn học. Ngoài ra, nhiều môn học như y khoa và hoá học đòi hỏi thực hành trực tiếp mà không thể làm qua màn hình. Chẳng hạn, một sinh viên điều dưỡng không thể học cách chăm sóc bệnh nhân chỉ bằng cách xem video." },
        { en: "[Conclusion — 42 words] In conclusion, while online learning makes education more accessible, I believe that traditional classrooms will remain essential because they provide interaction and practical experience. The best solution may be to combine the two, so that students can enjoy the benefits of both.", vi: "[Kết bài] Tóm lại, dù học trực tuyến giúp giáo dục dễ tiếp cận hơn, tôi tin rằng lớp học truyền thống sẽ vẫn thiết yếu vì chúng mang lại sự tương tác và kinh nghiệm thực hành. Giải pháp tốt nhất có lẽ là kết hợp cả hai, để sinh viên được hưởng lợi ích của cả hai bên." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu đạt khoảng band 6.5 — phân tích theo 4 tiêu chí chấm",
      head: ["Tiêu chí", "Bài mẫu làm được gì", "Bằng chứng trong bài"],
      rows: [
        ["**Task Response** (trả lời đúng đề)", "Bàn **đủ hai quan điểm**, ý kiến **rõ và nhất quán** ở mở bài, thân 2, kết bài; mỗi ý có lý do và ví dụ", "“In my opinion, … it cannot completely replace…” ↔ “I agree with those who say…” ↔ “I believe that traditional classrooms will remain essential”"],
        ["**Coherence & Cohesion** (mạch lạc, liên kết)", "Mỗi thân bài **một quan điểm**; từ nối đúng chỗ, không dày đặc", "On the one hand / On the other hand · Firstly / Secondly · For example / For instance · In addition · In conclusion"],
        ["**Lexical Resource** (từ vựng)", "Từ đúng chủ đề, collocation tự nhiên, **paraphrase** đề thay vì chép", "replaced by → take the place of · flexibility · recorded lectures · at their own pace · cost-effective · immediate feedback · hands-on practice · accessible"],
        ["**Grammatical Range & Accuracy** (ngữ pháp)", "Câu phức đa dạng, gần như không lỗi", "Modal (may, can, cannot, will) · mệnh đề quan hệ (where students learn, who say, that cannot be done) · bị động (be needed, be done) · nhượng bộ (although, while)"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: những điều nhỏ làm nên bài mẫu",
      items: [
        "Thân bài 1 dùng **may become** (có thể trở thành) — nói **mềm** về quan điểm mình không hoàn toàn đồng ý. Thân bài 2 dùng **will always be necessary** — chắc chắn cho quan điểm mình ủng hộ. (Modal Ngày 13 dùng thật trong bài.)",
        "Không có câu nào bắt đầu bằng **I think** ở thân bài 1 — đó là ý của **người khác** (there are good reasons to think…).",
        "Kết bài **không thêm ý mới** (không nói đến giáo viên, học phí…) — chỉ gom hai phía và chốt ý kiến, rồi một câu gợi ý (combine the two).",
        "Độ dài từng đoạn cân đối: 56 · 74 · 88 · 42 = **260 từ** — vượt 250 một chút là đẹp; viết quá 320 từ dễ sinh lỗi.",
      ],
    },

    { t: "h", text: "7. So sánh: mở bài band 4 và mở bài band 6" },
    {
      t: "examples",
      items: [
        { en: "Band 4: Nowadays, online learning is very popular. Some people think it is good and some people think it is bad. I will discuss both views in this essay.", vi: "Vấn đề: câu đầu học thuộc, chung chung; “good / bad” không nói hai quan điểm thật sự là gì; KHÔNG có ý kiến → mất nhiệm vụ 3." },
        { en: "Band 6: Some people argue that online courses will soon take the place of traditional classrooms, while others believe that face-to-face teaching will always be needed. In my opinion, although online learning will continue to grow, it cannot completely replace classroom teaching.", vi: "Paraphrase đúng cả hai quan điểm; ý kiến rõ ràng, có thừa nhận phía kia (although…); hai câu, khoảng 50 từ." },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi viết bài Discussion",
      items: [
        "~~On the one hand… On the other side…~~ → **On the one hand… On the other hand…** (cặp cố định).",
        "~~In the other hand~~ → **On the other hand**. ~~In conclude~~ → **In conclusion**.",
        "~~Some people think…, others people think…~~ → **others** (đại từ, không có danh từ sau) hoặc **other people**.",
        "~~I agree with the opinion of those people who they say…~~ → **I agree with those who say…** (không lặp chủ ngữ they sau who).",
        "Dùng **the latter** sai: **the former** = cái được nhắc **trước** (A), **the latter** = cái được nhắc **sau** (B).",
        "Viết thân bài 1 rồi **phản bác ngay trong đoạn đó** → đoạn rối. Nhường hẳn thân bài 1 cho quan điểm A; phần phản bác để thân bài 2.",
      ],
    },
    {
      t: "mcq",
      id: "d14-viet-nhanh",
      title: "Kiểm tra nhanh — bài luận thảo luận hai mặt (5 câu)",
      items: [
        { q: "Đề kết thúc bằng “Discuss both views and give your own opinion.” Bài phải làm mấy nhiệm vụ?", options: ["1 — nêu ý kiến", "2 — bàn hai quan điểm", "3 — bàn quan điểm A, bàn quan điểm B, nêu ý kiến"], correct: 2, why: "Đủ **3 nhiệm vụ**: A, B và ý kiến của bạn. Thiếu ý kiến là thiếu một phần đề." },
        { q: "Câu nào là câu chủ đề phù hợp cho THÂN BÀI 1 (quan điểm bạn ít đồng ý)?", options: ["On the one hand, some people argue that online learning is more convenient.", "I strongly believe that online learning is better.", "In conclusion, online learning is convenient."], correct: 0, why: "Thân bài 1 trình bày ý của **người khác** → **some people argue that**. Câu 2 dùng I believe cho phía mình không ủng hộ — mâu thuẫn; câu 3 là câu kết." },
        { q: "Ý kiến của bạn nên xuất hiện ở đâu?", options: ["Chỉ ở kết bài", "Mở bài, thân bài 2 và kết bài", "Không cần nêu"], correct: 1, why: "Nêu **sớm** (mở bài), **củng cố** (thân bài 2), **khẳng định lại** (kết bài) — nhất quán từ đầu đến cuối." },
        { q: "Điền đúng: “___ the one hand, … ___ the other hand, …”", options: ["In / In", "On / In", "On / On"], correct: 2, why: "Cặp cố định **On the one hand… On the other hand…**" },
        { q: "Kết bài KHÔNG nên làm gì?", options: ["Đưa ra một lý do hoàn toàn mới", "Nhắc lại ý kiến của bạn", "Nhắc ngắn gọn cả hai phía"], correct: 0, why: "Kết bài **không đưa ý mới**. Ý mới phải nằm trong thân bài, có giải thích và ví dụ." },
      ],
    },

    { t: "h", text: "8. Tự viết" },
    {
      t: "essay",
      id: "d14-viet-bai",
      task: "Task 2",
      prompt: "Some people believe that young people should be required to do unpaid work in their local community, while others think that this should be their own choice. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Phân tích 3 nhiệm vụ: A = **bắt buộc** làm việc không lương cho cộng đồng · B = để người trẻ **tự chọn** · ý kiến của bạn.",
        "Từ vựng Ngày 9 (tình nguyện): volunteer, community service, charity, give back to society, gain experience, develop skills.",
        "Thân 1 (phía A) gợi ý: dạy trách nhiệm (responsibility), học kỹ năng thật, giúp người khó khăn. Thân 2 (phía B) gợi ý: ép buộc làm mất ý nghĩa tình nguyện, áp lực thời gian học, nên tôn trọng lựa chọn.",
        "Dùng modal: should (giải pháp), may / might (hậu quả có thể), have to (bắt buộc). Kết bài: In conclusion, while…, I believe that…",
        "Viết xong, đọc lại câu cuối mở bài và câu đầu kết bài — có **cùng một ý kiến** không?",
      ],
    },
  ],
};

/* ─────────────────────────── Speaking ─────────────────────────── */

const D14_SPEAKING: Lesson = {
  id: "d14-noi",
  kind: "speaking",
  title: "Nói: Kể lại trải nghiệm đã qua (Part 2 cue card · Part 3 nối tiếp)",
  goal: "Dùng 1 phút chuẩn bị để ghi ý bằng sơ đồ, nói liền mạch 2 phút về một trải nghiệm đã qua bằng thì quá khứ và từ nối thời gian, trả lời đủ mọi gạch đầu dòng của thẻ đề, rồi trả lời câu hỏi Part 3 theo khung Trả lời → Lý do → Ví dụ; đọc đúng đuôi -ed.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Part 2** = nhận **thẻ đề (cue card)** → **1 phút** ghi chú → nói **1–2 phút** (cố nói đủ 2 phút) → 1–2 câu hỏi ngắn → chuyển **Part 3**.",
        "Trả lời **mọi gạch đầu dòng** của thẻ; dòng cuối **“and explain…”** (cảm xúc / lý do) là dòng **quan trọng nhất**.",
        "Kể chuyện đã qua → **quá khứ đơn** (went, saw, felt…) + **từ nối thời gian**: ==First · Then · After that · Finally · In the end==.",
        "Ghi chú 1 phút bằng **sơ đồ ý (mindmap)**: chỉ **từ khoá**, không viết câu.",
        "**Part 3**: câu hỏi chung, trừu tượng hơn → khung ==O–R–E: Ý kiến → Lý do → Ví dụ== (học ở Ngày 12) + ý ngược lại. Phát âm: **đuôi -ed** /t/ · /d/ · /ɪd/.",
      ],
    },

    { t: "h", text: "1. Part 2 diễn ra thế nào?" },
    {
      t: "sodo",
      kind: "flow",
      title: "Một lượt Part 2 + Part 3 trong phòng thi",
      caption: "Giám khảo sẽ ngắt lời bạn khi hết 2 phút — đó là dấu hiệu TỐT (bạn nói đủ lâu), không phải bạn làm sai.",
      steps: [
        { label: "Nhận thẻ + giấy bút", sub: "Giám khảo đọc chủ đề, đưa thẻ đề có 3–4 gạch đầu dòng" },
        { label: "1 phút chuẩn bị", sub: "Ghi từ khoá theo sơ đồ ý — không viết câu hoàn chỉnh" },
        { label: "Nói 1–2 phút", sub: "Nói liền mạch, theo thứ tự gạch đầu dòng, kết bằng cảm xúc" },
        { label: "1–2 câu hỏi kết", sub: "Câu ngắn (rounding-off), trả lời 1–2 câu" },
        { label: "Part 3 (4–5 phút)", sub: "Thảo luận rộng hơn về cùng chủ đề — câu hỏi chung" },
      ],
    },
    {
      t: "table",
      head: ["Phần", "Thời gian", "Bạn làm gì", "Lỗi hay gặp"],
      rows: [
        ["Chuẩn bị", "1 phút", "Ghi từ khoá cho **từng** gạch đầu dòng + 2–3 từ vựng “đắt” muốn dùng", "Viết câu đầy đủ → hết giờ mới xong một ý"],
        ["Nói", "1–2 phút (nên ~2 phút)", "Mở đầu bằng một câu giới thiệu → kể theo thứ tự → kết bằng cảm xúc", "Nói 40 giây rồi dừng; nhìn giám khảo chờ đợi"],
        ["Câu hỏi kết", "~30 giây", "Trả lời ngắn, tự nhiên", "Kể lại cả câu chuyện lần nữa"],
        ["Part 3", "4–5 phút", "Nêu ý kiến chung + lý do + ví dụ", "Chỉ nói về bản thân như Part 1"],
      ],
    },

    { t: "h", text: "2. Đọc thẻ đề (cue card)" },
    {
      t: "p",
      text: "Thẻ đề luôn có cấu trúc: **Describe…** (chủ đề) + **You should say:** + 3 gạch đầu dòng (thường là what / when / where / who) + **and explain…** (vì sao, cảm thấy thế nào). Mỗi gạch đầu dòng là **một phần** của câu chuyện. Thì động từ cũng nằm ngay trên thẻ: “Describe a time when you **learned**…” → kể bằng **quá khứ**.",
    },
    {
      t: "table",
      caption: "Thẻ đề 1 — Describe a time when you learned something new outside school.",
      head: ["Dòng trên thẻ", "Trả lời bằng", "Gợi ý câu"],
      rows: [
        ["**what** you learned", "quá khứ đơn + danh từ", "I'd like to talk about the time I **learned how to** + V…"],
        ["**when and where** you learned it", "thời gian + nơi chốn", "It **happened** about three years ago, at…"],
        ["**who** helped you", "người + việc họ làm", "My grandmother **was** my teacher. First, she **showed** me how to…"],
        ["and **explain how you felt** about learning it", "tính từ cảm xúc + lý do", "Honestly, I **felt** really proud because… But more importantly…"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: biến thẻ đề thành dàn bài 4 phần",
      items: [
        "**Mở (10 giây):** một câu giới thiệu — I'd like to talk about… / I'm going to describe…",
        "**Bối cảnh (20 giây):** when, where, who, vì sao chuyện xảy ra.",
        "**Diễn biến (60 giây):** kể theo thứ tự với First, Then, After that… — đây là phần dài nhất, có **một chi tiết bất ngờ / buồn cười** thì câu chuyện sống động hẳn.",
        "**Kết (20–30 giây):** cảm xúc + vì sao đáng nhớ + hiện tại thế nào (Now I…).",
      ],
    },

    { t: "h", text: "3. Ngữ pháp kể chuyện: quá khứ đơn + từ nối thời gian" },
    {
      t: "p",
      text: "Ở **Ngày 9** bạn đã học **quá khứ đơn** (past simple). Part 2 là nơi dùng nó nhiều nhất. Động từ có quy tắc thêm **-ed** (watched, decided); động từ **bất quy tắc** phải học thuộc. Bảng dưới là 30 động từ bất quy tắc hay dùng nhất khi kể chuyện.",
    },
    {
      t: "table",
      caption: "30 động từ bất quy tắc hay dùng khi kể chuyện",
      head: ["V", "Quá khứ", "Nghĩa", "V", "Quá khứ", "Nghĩa"],
      rows: [
        ["be", "was / were", "thì, là, ở", "go", "went", "đi"],
        ["have", "had", "có, ăn", "do", "did", "làm"],
        ["see", "saw", "nhìn thấy", "meet", "met", "gặp"],
        ["take", "took", "lấy, đưa, mất (thời gian)", "make", "made", "làm ra"],
        ["get", "got", "nhận, đến", "come", "came", "đến"],
        ["feel", "felt", "cảm thấy", "think", "thought", "nghĩ"],
        ["buy", "bought", "mua", "bring", "brought", "mang đến"],
        ["teach", "taught", "dạy", "learn", "learnt / learned", "học"],
        ["tell", "told", "kể, bảo", "say", "said", "nói"],
        ["spend", "spent", "dành, tiêu", "leave", "left", "rời đi"],
        ["find", "found", "tìm thấy", "lose", "lost", "mất, thua"],
        ["give", "gave", "cho", "keep", "kept", "giữ"],
        ["begin", "began", "bắt đầu", "become", "became", "trở thành"],
        ["eat", "ate", "ăn", "drink", "drank", "uống"],
        ["ride", "rode", "đi (xe), cưỡi", "fall", "fell", "ngã, rơi"],
      ],
    },
    {
      t: "table",
      caption: "Từ nối thời gian — giúp câu chuyện trôi chảy (Fluency & Coherence)",
      head: ["Vị trí trong câu chuyện", "Từ nối", "Ví dụ"],
      rows: [
        ["Bắt đầu", "First · At first · In the beginning", "**At first**, I didn't want to go."],
        ["Tiếp theo", "Then · Next · After that · Later", "**After that**, we boiled the cakes."],
        ["Cùng lúc", "While · When · Meanwhile", "**While** we were waiting, it started to rain."],
        ["Bất ngờ", "Suddenly · All of a sudden · Just then", "**Suddenly**, the rice fell out."],
        ["Kết thúc", "Finally · Eventually · In the end", "**In the end**, I made a good one."],
        ["Mốc thời gian", "about three years ago · last summer · the next day · a week before Tet", "It happened **about three years ago**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi kể chuyện quá khứ",
      items: [
        "**Quên chia quá khứ** — lỗi số một. Tiếng Việt không đổi động từ theo thời gian, nên ta hay nói ~~Last year I go to Da Lat~~ → **Last year I went to Da Lat.** Mẹo: khi tập, gạch dưới mọi động từ trong bản ghi âm và kiểm tra.",
        "**Thêm -ed vào động từ bất quy tắc**: ~~goed, buyed, teached~~ → **went, bought, taught**.",
        "**Câu phủ định / câu hỏi** dùng **did + V nguyên mẫu**: ~~I didn't went~~ → **I didn't go**.",
        "**Đổi thì giữa chừng**: đang kể quá khứ lại chuyển sang hiện tại. Chỉ chuyển sang hiện tại khi nói về **bây giờ** (Now I make banh chung every year).",
        "**Thiếu tính từ cảm xúc**: “It was good.” → dùng từ cụ thể: **proud** (tự hào), **relieved** (nhẹ nhõm), **nervous** (hồi hộp), **embarrassed** (xấu hổ), **grateful** (biết ơn), **disappointed** (thất vọng).",
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V-ed / V2 (quá khứ đơn) · S + didn't + V · Did + S + V?",
          vi: "Kể từng việc đã xảy ra, theo thứ tự.",
          examples: [
            { en: "First, she showed me how to fold the leaves. Then I tried it myself.", vi: "Đầu tiên, bà chỉ tôi cách gói lá. Rồi tôi tự làm thử." },
          ],
        },
        {
          formula: "S + was / were + V-ing (quá khứ tiếp diễn) + when + S + V2",
          vi: "Tả BỐI CẢNH đang diễn ra thì một việc khác xen vào (đã học Ngày 9).",
          examples: [
            { en: "We were waiting for the bus when it started to rain.", vi: "Chúng tôi đang chờ xe buýt thì trời bắt đầu mưa." },
          ],
        },
        {
          formula: "I felt + adj (+ because + S + V) · It was + adj + to V",
          vi: "Kết câu chuyện bằng cảm xúc — dòng “explain” của thẻ đề.",
          examples: [
            { en: "I felt really proud because my cake didn't fall apart.", vi: "Tôi thấy rất tự hào vì cái bánh của tôi không bị vỡ." },
            { en: "It was amazing to see the sunrise from the top of the mountain.", vi: "Thật tuyệt khi ngắm bình minh từ đỉnh núi." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Mở: I'd like to talk about the time I + V2… · Kể: First, + S + V2… Then… After that… In the end… · Kết: I felt + adj + because + S + V2.",
      vi: "Toàn bộ câu chuyện ở quá khứ; chỉ câu cuối (Now I…) mới dùng hiện tại.",
    },
    {
      t: "quiz",
      id: "d14-noi-dich",
      title: "Dịch sang tiếng Anh — câu kể chuyện quá khứ (5 câu)",
      kind: "translate",
      grammar: "Quá khứ đơn: V-ed / V2 (went, took, felt, taught…) · didn't + V · S + was/were + V-ing when + S + V2 · I felt + adj + because…",
      items: [
        { q: "Chuyện xảy ra khoảng ba năm trước, ở nhà bà tôi.", hint: "It happened, about three years ago, at my grandmother's house", answers: ["It happened about three years ago at my grandmother's house.", "It happened about three years ago, at my grandmother's house.", "It happened about three years ago at my grandma's house.", "It happened around three years ago at my grandmother's house.", "It happened about three years ago, at my grandma's house."] },
        { q: "Đầu tiên, bà chỉ cho tôi cách rửa lá.", hint: "First, she showed me, how to wash the leaves", answers: ["First, she showed me how to wash the leaves.", "First she showed me how to wash the leaves.", "First, my grandmother showed me how to wash the leaves.", "At first, she showed me how to wash the leaves.", "First of all, she showed me how to wash the leaves."] },
        { q: "Chúng tôi đang đi bộ ra bãi biển thì trời bắt đầu mưa.", hint: "We were walking to the beach, when, it started to rain", answers: ["We were walking to the beach when it started to rain.", "We were walking to the beach when it started raining.", "We were walking to the beach when it began to rain.", "We were walking to the beach when it began raining."] },
        { q: "Tôi đã không ngủ được vì quá hồi hộp.", hint: "I couldn't / didn't sleep, because, I was too nervous", answers: ["I couldn't sleep because I was too nervous.", "I didn't sleep because I was too nervous.", "I could not sleep because I was too nervous.", "I couldn't sleep because I was so nervous.", "I didn't sleep because I was so nervous.", "I couldn't sleep as I was too nervous."] },
        { q: "Cuối cùng, tôi cảm thấy rất tự hào về bản thân.", hint: "In the end / Finally, I felt very proud of myself", answers: ["In the end, I felt very proud of myself.", "In the end I felt very proud of myself.", "Finally, I felt very proud of myself.", "Finally I felt very proud of myself.", "In the end, I felt really proud of myself.", "Finally, I felt really proud of myself."] },
      ],
    },

    { t: "h", text: "4. Ghi chú trong 1 phút bằng sơ đồ ý" },
    {
      t: "p",
      text: "Một phút rất ngắn. Đừng viết câu — hãy vẽ một **sơ đồ ý** (mindmap): chủ đề ở giữa, mỗi gạch đầu dòng của thẻ là **một nhánh**, mỗi nhánh 2–4 **từ khoá**. Lúc nói, nhìn từng nhánh theo chiều kim đồng hồ là bạn không bao giờ “cạn ý”.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú mẫu — thẻ đề 1 (học làm bánh chưng)",
      caption: "Đây là TOÀN BỘ ghi chú trong 1 phút: chỉ từ khoá, không câu nào. Nhánh “Cảm xúc” luôn ghi trước tiên để chắc chắn không quên dòng explain.",
      center: "**Learned to make banh chung**",
      branches: [
        { label: "What", items: ["banh chung", "square rice cake", "Tet"], anh: "cooked-rice" },
        { label: "When / Where", items: ["3 years ago", "week before Tet", "grandma's house — Nam Dinh"], anh: "spiral-calendar" },
        { label: "Who", items: ["grandmother = teacher", "cousins — stayed up late"], anh: "old-woman" },
        { label: "What happened", items: ["wash leaves → fold → rice + beans + pork", "1st cake = disaster (round!)", "5 attempts", "boil 10 hours, wood fire"], anh: "fire" },
        { label: "Feelings", items: ["proud", "closer to grandma", "family tradition", "now: every year"], anh: "smiling-face-with-heart-eyes" },
      ],
    },

    { t: "h", text: "5. Bài nói mẫu — thẻ đề 1" },
    {
      t: "canh",
      anh: ["old-woman", "leafy-green", "cooked-rice", "fire"],
      caption: "Một tuần trước Tết, ở quê bà ngoại tại Nam Định: hai bà cháu rửa lá dong, gói bánh chưng, rồi cả nhà thức canh nồi bánh bên bếp củi.",
    },
    {
      t: "dialogue",
      title: "Part 2 — Describe a time when you learned something new outside school (≈ 2 phút, 284 từ)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Now, I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. Here's your topic: describe a time when you learned something new outside school." },
        { who: "Candidate", role: "candidate", text: "I'd like to talk about the time I learned how to make banh chung, which is a traditional square rice cake that Vietnamese families eat during Tet, our Lunar New Year.", vi: "Tôi muốn kể về lần tôi học làm bánh chưng, một loại bánh gạo vuông truyền thống mà các gia đình Việt ăn dịp Tết, Tết Nguyên đán của chúng tôi." },
        { who: "Candidate", role: "candidate", text: "It happened about three years ago, a week before Tet, at my grandmother's house in a small village in Nam Dinh. Every year, my grandmother made these cakes, but I had never helped her because I was always busy with exams. That year, I finally had some free time, so I decided to learn.", vi: "Chuyện xảy ra khoảng ba năm trước, một tuần trước Tết, ở nhà bà tôi tại một làng nhỏ ở Nam Định. Năm nào bà cũng gói bánh, nhưng tôi chưa bao giờ phụ bà vì lúc nào cũng bận thi cử. Năm đó, cuối cùng tôi cũng có chút thời gian rảnh nên quyết định học." },
        { who: "Candidate", role: "candidate", text: "My grandmother was my teacher, of course. First, she showed me how to wash the dong leaves and soak the sticky rice overnight. Then she taught me how to fold the leaves into a square, add a layer of rice, some mung beans and a piece of pork, and then cover it all with more rice. It looked easy when she did it, but my first cake was a disaster. It was round instead of square, and the rice kept falling out! My grandmother just laughed and told me to try again. After about five attempts, I finally made one that looked quite good.", vi: "Bà dĩ nhiên là cô giáo của tôi. Đầu tiên, bà chỉ tôi cách rửa lá dong và ngâm gạo nếp qua đêm. Rồi bà dạy tôi gấp lá thành hình vuông, cho một lớp gạo, ít đậu xanh và một miếng thịt lợn, rồi phủ thêm gạo lên trên. Bà làm thì trông dễ, nhưng cái bánh đầu tiên của tôi là một thảm hoạ. Nó tròn chứ không vuông, và gạo cứ rơi ra! Bà chỉ cười và bảo tôi làm lại. Sau khoảng năm lần thử, cuối cùng tôi cũng gói được một cái trông khá ổn." },
        { who: "Candidate", role: "candidate", text: "After that, we boiled the cakes in a huge pot over a wood fire for about ten hours. My cousins and I stayed up late, kept the fire going and told each other stories.", vi: "Sau đó, chúng tôi luộc bánh trong một nồi rất to trên bếp củi khoảng mười tiếng. Tôi và mấy anh chị em họ thức khuya, giữ lửa và kể chuyện cho nhau nghe." },
        { who: "Candidate", role: "candidate", text: "Honestly, I felt really proud when we opened the cakes on New Year's Eve and mine didn't fall apart. But more importantly, I felt much closer to my grandmother. It wasn't just about cooking. It was about learning a family tradition. Now I make banh chung with her every year, and I hope I can teach my own children one day.", vi: "Thật lòng, tôi thấy rất tự hào khi cả nhà bóc bánh đêm Giao thừa và cái của tôi không bị vỡ. Nhưng quan trọng hơn, tôi thấy gần bà hơn nhiều. Đó không chỉ là chuyện nấu nướng. Đó là học một truyền thống của gia đình. Giờ năm nào tôi cũng gói bánh chưng cùng bà, và tôi mong một ngày nào đó sẽ dạy lại cho con mình." },
        { who: "Examiner", role: "examiner", text: "Thank you. Do you still make banh chung every year?" },
        { who: "Candidate", role: "candidate", text: "Yes, I do. It's become a little tradition between my grandmother and me.", vi: "Có ạ. Nó đã thành một truyền thống nhỏ giữa bà và tôi." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài nói mẫu đạt điểm tốt",
      head: ["Tiêu chí chấm Speaking", "Bài mẫu làm gì"],
      rows: [
        ["**Fluency & Coherence** (trôi chảy, mạch lạc)", "Đi đúng 4 phần: giới thiệu → bối cảnh → diễn biến → cảm xúc. Từ nối: First, Then, After that, After about five attempts, finally, Now."],
        ["**Lexical Resource** (từ vựng)", "Từ cụ thể và tự nhiên: soak the sticky rice overnight, a layer of, a disaster, kept falling out, attempts, stayed up late, kept the fire going, fall apart, family tradition."],
        ["**Grammatical Range & Accuracy** (ngữ pháp)", "Quá khứ đơn đúng suốt bài (happened, made, showed, taught, felt…); quá khứ hoàn thành (**had never helped** — thì này học ở Tập 2, gặp trước một câu để quen); mệnh đề quan hệ (**which is**…, **one that** looked…); cấu trúc keep + V-ing; modal (I hope I **can**)."],
        ["**Pronunciation** (phát âm)", "Nhiều đuôi -ed để luyện: decided /ɪd/, showed /d/, laughed /t/, boiled /d/ — xem mục 9."],
        ["**Trả lời đủ thẻ đề**", "what ✓ (banh chung) · when & where ✓ (3 năm trước, Nam Định) · who ✓ (bà) · explain how you felt ✓ (proud, closer, tradition)."],
      ],
    },

    { t: "h", text: "6. Thẻ đề 2 — một chuyến đi bạn thích" },
    {
      t: "p",
      text: "**Describe a trip you took that you really enjoyed.** You should say: **where** you went · **who** you went with · **what** you did there · and **explain why** you enjoyed it. — Chủ đề “chuyến đi” là một trong những chủ đề **hay ra nhất** của Part 2. Chuẩn bị sẵn một chuyến đi thật của bạn: nó dùng lại được cho nhiều thẻ khác (a holiday, a time you were happy, a place you visited…).",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú mẫu — thẻ đề 2 (chuyến đi Đà Lạt)",
      center: "**A trip I enjoyed — Da Lat**",
      branches: [
        { label: "Where / When", items: ["Da Lat", "July, 2 years ago", "after high school exams"], anh: "mountain" },
        { label: "Who", items: ["3 close friends", "overnight bus"], anh: "bus" },
        { label: "What we did", items: ["motorbikes → waterfall", "strawberry farm — picked", "night market, soy milk"], anh: "strawberry" },
        { label: "Why enjoyed", items: ["cool, fresh weather", "last trip together", "photos → relaxed, free"], anh: "camera" },
      ],
    },
    {
      t: "canh",
      anh: ["bus", "mountain", "strawberry", "camera"],
      caption: "Bốn người bạn đi xe khách đêm lên Đà Lạt sau kỳ thi tốt nghiệp: thác nước, vườn dâu, chợ đêm và rất nhiều ảnh.",
    },
    {
      t: "dialogue",
      title: "Part 2 — Describe a trip you took that you really enjoyed (bài mẫu ngắn hơn, ≈ 1 phút 30)",
      lines: [
        { who: "Candidate", role: "candidate", text: "I'm going to describe a trip to Da Lat that I took with three close friends after we finished our high school exams.", vi: "Tôi sẽ kể về chuyến đi Đà Lạt với ba người bạn thân sau khi chúng tôi thi xong tốt nghiệp phổ thông." },
        { who: "Candidate", role: "candidate", text: "It was in July, about two years ago. We had studied really hard for months, so we wanted to celebrate. We took an overnight bus from Ho Chi Minh City and arrived early in the morning, when the whole city was still covered in fog.", vi: "Đó là tháng Bảy, khoảng hai năm trước. Chúng tôi đã học rất vất vả suốt mấy tháng nên muốn ăn mừng. Chúng tôi đi xe khách đêm từ Thành phố Hồ Chí Minh và đến nơi lúc sáng sớm, khi cả thành phố vẫn còn chìm trong sương." },
        { who: "Candidate", role: "candidate", text: "We spent four days there. On the first day, we rented motorbikes and rode to a waterfall outside the city. The next day, we visited a strawberry farm and picked strawberries ourselves, which was great fun. In the evenings, we walked around the night market and drank hot soy milk, because it was quite cold.", vi: "Chúng tôi ở đó bốn ngày. Ngày đầu, chúng tôi thuê xe máy và chạy ra một thác nước ngoài thành phố. Hôm sau, chúng tôi đến một vườn dâu và tự hái dâu, rất vui. Buổi tối, chúng tôi đi dạo chợ đêm và uống sữa đậu nành nóng vì trời khá lạnh." },
        { who: "Candidate", role: "candidate", text: "I enjoyed the trip for two reasons. Firstly, the weather was cool and fresh, which was a nice change from the heat of Saigon. Secondly, and more importantly, it was the last time the four of us travelled together before we went to different universities. Whenever I look at the photos, I remember how relaxed and free we felt.", vi: "Tôi thích chuyến đi vì hai lý do. Thứ nhất, thời tiết mát và trong lành, một sự thay đổi dễ chịu so với cái nóng Sài Gòn. Thứ hai, và quan trọng hơn, đó là lần cuối bốn đứa đi cùng nhau trước khi vào các trường đại học khác nhau. Mỗi lần xem ảnh, tôi lại nhớ chúng tôi đã thấy thoải mái và tự do thế nào." },
      ],
    },
    {
      t: "note",
      title: "Mẹo: kéo dài bài nói khi bị “cạn ý” (phần thêm)",
      items: [
        "Thêm **giác quan**: bạn **thấy** gì, **nghe** gì, **ăn** gì, trời **lạnh / nóng** thế nào (covered in fog, hot soy milk).",
        "Thêm **một chi tiết bất ngờ**: a small problem, something funny (my first cake was a disaster; we got lost; it suddenly rained).",
        "Thêm **so sánh với bây giờ**: Now I… / I still… / I'd love to go back one day.",
        "Nếu hết ý thật: nói lại cảm xúc bằng từ khác — **I'll never forget…** / **Looking back, I realise that…**",
      ],
    },

    { t: "h", text: "7. Part 3 — thảo luận nối tiếp" },
    {
      t: "p",
      text: "Sau Part 2, giám khảo hỏi **Part 3**: câu hỏi **chung, trừu tượng** hơn về cùng chủ đề (học kỹ năng mới → giới trẻ, truyền thống, công nghệ). Bạn không kể chuyện nữa mà **nêu ý kiến về xã hội**. Dùng khung **O–R–E** (Opinion → Reason → Example) đã học ở Ngày 12 và thêm một ý ngược lại để câu trả lời dài và sâu.",
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Cụm mở đầu"],
      rows: [
        ["**O** — Opinion", "Nêu ý kiến thẳng, trả lời đúng câu hỏi", "I'd say… / I think… / Yes, I believe so. / Not really."],
        ["**R** — Reason", "Giải thích vì sao", "The main reason is that… / This is because…"],
        ["**E** — Example", "Ví dụ cụ thể (người khác, xã hội, bản thân)", "For example… / In my country… / I've noticed that…"],
        ["(+) Ý ngược lại", "Thêm mặt khác để thể hiện suy nghĩ sâu", "That said, … / However, … / On the other hand, …"],
      ],
    },
    {
      t: "dialogue",
      title: "Part 3 — Learning skills (4 câu hỏi, câu trả lời mẫu theo O–R–E)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think young people today are still interested in learning traditional skills?" },
        { who: "Candidate", role: "candidate", text: "I'd say fewer young people are interested than in the past. Most teenagers spend their free time on their phones, and skills like cooking traditional dishes or making handicrafts seem old-fashioned to them. That said, I've noticed that some traditional skills are becoming popular again through social media. For example, there are many short videos of young people making banh chung or weaving baskets, and they get millions of views.", vi: "Tôi cho là ít người trẻ quan tâm hơn trước. Phần lớn thanh thiếu niên dành thời gian rảnh cho điện thoại, và những kỹ năng như nấu món truyền thống hay làm đồ thủ công có vẻ lỗi thời với họ. Dù vậy, tôi để ý thấy một số kỹ năng truyền thống đang phổ biến trở lại nhờ mạng xã hội. Ví dụ, có rất nhiều video ngắn về người trẻ gói bánh chưng hay đan rổ, và chúng có hàng triệu lượt xem." },
        { who: "Examiner", role: "examiner", text: "What are the advantages of learning from older family members?" },
        { who: "Candidate", role: "candidate", text: "I think the biggest advantage is that they have a lot of practical experience. My grandmother has never read a cookbook, but she knows exactly how much salt to add just by tasting. Also, learning from older relatives helps families stay connected, because people spend time together and share stories. In my opinion, that's something you can't get from a video.", vi: "Tôi nghĩ ưu điểm lớn nhất là họ có rất nhiều kinh nghiệm thực tế. Bà tôi chưa bao giờ đọc sách nấu ăn, nhưng bà biết chính xác cần bao nhiêu muối chỉ bằng cách nếm. Ngoài ra, học từ người lớn tuổi trong nhà giúp gia đình gắn kết, vì mọi người dành thời gian bên nhau và kể chuyện cho nhau. Theo tôi, đó là thứ bạn không có được từ một đoạn video." },
        { who: "Examiner", role: "examiner", text: "Should practical skills such as cooking be taught at school?" },
        { who: "Candidate", role: "candidate", text: "Yes, I believe they should, at least the basic ones. Not every child has parents with enough time to teach them at home, so school is the fairest place to learn. For instance, if students learn how to cook a few simple, healthy meals, they will be able to look after themselves when they move away to university. However, I don't think schools should spend too much time on it, because academic subjects are still important.", vi: "Có, tôi tin là nên, ít nhất là những kỹ năng cơ bản. Không phải đứa trẻ nào cũng có bố mẹ đủ thời gian dạy ở nhà, nên trường học là nơi công bằng nhất để học. Chẳng hạn, nếu học sinh học nấu vài món đơn giản, lành mạnh, các em sẽ tự lo được cho mình khi xa nhà lên đại học. Tuy nhiên, tôi không nghĩ trường nên dành quá nhiều thời gian cho việc này, vì các môn học thuật vẫn quan trọng." },
        { who: "Examiner", role: "examiner", text: "How has technology changed the way people learn new skills?" },
        { who: "Candidate", role: "candidate", text: "It has changed things enormously. In the past, if you wanted to learn the guitar, you had to find a teacher and pay for lessons. Now you can watch free tutorials online and practise at your own pace. The downside is that nobody corrects your mistakes, so some people may pick up bad habits. Overall, though, I think technology has made learning far more accessible.", vi: "Nó đã thay đổi mọi thứ rất nhiều. Ngày trước, muốn học ghi-ta thì bạn phải tìm thầy và trả tiền học. Giờ bạn có thể xem hướng dẫn miễn phí trên mạng và tập theo tốc độ của mình. Mặt trái là không ai sửa lỗi cho bạn, nên một số người có thể nhiễm thói quen xấu. Nhưng nhìn chung, tôi nghĩ công nghệ đã giúp việc học dễ tiếp cận hơn rất nhiều." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: Part 2 khác Part 3 thế nào",
      items: [
        "Part 2 = **câu chuyện của bạn** (quá khứ, chi tiết cá nhân). Part 3 = **ý kiến về xã hội** (hiện tại đơn, nói chung: young people, families, schools).",
        "Part 3 dùng nhiều **modal** (should, may, can) và **so sánh** (fewer… than in the past, far more accessible) — chính là ngữ pháp Ngày 13 và các ngày trước.",
        "Câu trả lời Part 3 nên dài **3–5 câu (~30–40 giây)**. Ngắn quá → giám khảo không có gì để chấm; dài quá 1 phút → lạc đề.",
        "Ví dụ trong Part 3 có thể lấy từ **chính câu chuyện Part 2** (My grandmother…) — nối hai phần rất tự nhiên.",
      ],
    },

    { t: "h", text: "8. Phát âm: ba cách đọc đuôi -ed" },
    {
      t: "p",
      text: "Kể chuyện quá khứ là nói **hàng chục động từ -ed**. Đuôi -ed có **ba cách đọc**, quyết định bởi **âm cuối** của động từ gốc (không phải chữ cái cuối) — giống quy tắc đuôi -s bạn học ở Ngày 1.",
    },
    {
      t: "table",
      head: ["Âm cuối của động từ", "Đọc -ed là", "Ví dụ", "Mẹo nhớ"],
      rows: [
        ["/t/ hoặc /d/", "**/ɪd/** (thêm một âm tiết)", "wanted, needed, decided, visited, started", "“t-d → ɪd”: không thêm âm tiết thì không nghe ra quá khứ"],
        ["âm **vô thanh** /p k f s ʃ tʃ θ/", "**/t/**", "helped, worked, laughed, missed, washed, watched", "Đặt tay lên cổ: không rung → /t/"],
        ["âm **hữu thanh** còn lại và nguyên âm", "**/d/**", "played, cleaned, showed, boiled, travelled, opened", "Cổ rung → /d/"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với đuôi -ed",
      items: [
        "**Bỏ hẳn đuôi -ed** khi nói: “Yesterday I work…” — giám khảo nghe ra **lỗi ngữ pháp** dù bạn nghĩ đúng. Âm /t/ /d/ cuối phải nghe được.",
        "**Đọc mọi -ed thành /ɪd/**: ~~work-ID~~, ~~laugh-ID~~ → chỉ thêm âm tiết sau /t/ và /d/.",
        "**laughed** đọc /lɑːft/ (gh = /f/ vô thanh → /t/); **washed** /wɒʃt/; **watched** /wɒtʃt/.",
        "Tính từ đặc biệt đọc /ɪd/ dù không tận cùng t/d: **naked** /ˈneɪkɪd/, **wicked**, **beloved** — gặp thì học riêng.",
      ],
    },
    {
      t: "phatam",
      id: "d14-phat-am",
      title: "Luyện phát âm — đuôi -ed: /t/ · /d/ · /ɪd/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Giữ âm cuối thật rõ: /t/ bật hơi nhẹ, /d/ có rung, /ɪd/ thêm một âm tiết. Ba dòng đầu luyện từng nhóm, các dòng sau đọc trong câu kể chuyện.",
      items: [
        { text: "worked, watched, helped", ipa: "wɜːkt wɒtʃt helpt", vi: "-ed = /t/" },
        { text: "played, cleaned, travelled", ipa: "pleɪd kliːnd trævld", vi: "-ed = /d/" },
        { text: "wanted, needed, decided", ipa: "wɒntɪd niːdɪd dɪsaɪdɪd", vi: "-ed = /ɪd/" },
        { text: "laughed, stayed, visited", ipa: "lɑːft steɪd vɪzɪtɪd", vi: "/t/ · /d/ · /ɪd/" },
        { text: "I decided to learn how to cook.", ipa: "aɪ dɪsaɪdɪd tə lɜːn haʊ tə kʊk", vi: "decided /ɪd/" },
        { text: "We boiled the cakes and talked all night.", ipa: "wi bɔɪld ðə keɪks ənd tɔːkt ɔːl naɪt", vi: "boiled /d/ · talked /t/" },
        { text: "She laughed and showed me again.", ipa: "ʃi lɑːft ənd ʃəʊd mi əɡen", vi: "laughed /t/ · showed /d/" },
        { text: "We visited a farm and picked strawberries.", ipa: "wi vɪzɪtɪd ə fɑːm ənd pɪkt strɔːbəriz", vi: "visited /ɪd/ · picked /t/" },
      ],
    },

    { t: "h", text: "9. Luyện nói" },
    {
      t: "p",
      text: "**Part 2:** đọc thẻ đề, bấm giờ **1 phút** ghi chú theo sơ đồ ý, rồi ghi âm **2 phút**. Nghe lại và tự đếm: bao nhiêu động từ quá khứ đúng? Có trả lời đủ mọi gạch đầu dòng không? **Part 3:** mỗi câu 3–5 câu theo O–R–E.",
    },
    {
      t: "speak",
      id: "d14-noi-p2",
      part: "2",
      questions: [
        "Describe a time when you learned something new outside school. You should say: what you learned; when and where you learned it; who helped you; and explain how you felt about learning it.",
        "Describe a trip you took that you really enjoyed. You should say: where you went; who you went with; what you did there; and explain why you enjoyed it.",
        "Describe a time when you had to wait for something for a long time. You should say: what you were waiting for; where you were; what you did while you were waiting; and explain how you felt when the wait was over.",
      ],
    },
    {
      t: "speak",
      id: "d14-noi-p3",
      part: "3",
      questions: [
        "Do you think young people today are still interested in learning traditional skills?",
        "What are the advantages of learning from older family members?",
        "Should practical skills such as cooking be taught at school?",
        "How has technology changed the way people learn new skills?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const D14_HOMEWORK: Lesson = {
  id: "d14-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 14",
  goal: "Ôn trọn Ngày 14: dịch câu kể chuyện và câu bài luận thảo luận, chia động từ quá khứ, làm một bài tóm tắt có hộp từ, trắc nghiệm tổng hợp và viết mở bài + kết bài cho một đề Discussion.",
  minutes: 45,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (34 câu + 1 đoạn viết)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡): quá khứ đơn + khung câu Discussion.",
        "**II. Chia động từ quá khứ** (10 chỗ trống) trong một câu chuyện Part 2.",
        "**III. Summary Completion có hộp từ** (4 câu) — bài đọc ngắn về xe đạp công cộng.",
        "**IV. Trắc nghiệm tổng hợp** (10 câu): dạng bài đọc, bài luận, Part 2, đuôi -ed.",
        "**V. Viết**: mở bài + kết bài (~90 từ) cho một đề Discuss both views.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 14 trước khi làm bài",
      caption: "Ba kỹ năng của hôm nay — mỗi nhánh là điều dễ quên nhất khi làm bài.",
      center: "**Ngày 14**",
      branches: [
        { label: "Summary có hộp từ", items: ["đoán loại từ trước", "chia hộp theo loại từ", "cảnh giác cặp trái nghĩa", "ghi CHỮ CÁI"], anh: "open-book" },
        { label: "Discussion essay", items: ["3 nhiệm vụ: A · B · ý kiến", "On the one hand / On the other hand", "ý kiến ở mở bài = kết bài"], anh: "memo" },
        { label: "Part 2 kể chuyện", items: ["1 phút: sơ đồ từ khoá", "quá khứ đơn suốt bài", "kết bằng cảm xúc", "-ed: /t/ /d/ /ɪd/"], anh: "speech-balloon" },
      ],
    },
    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "d14-bt-dich",
      title: "I. Dịch sang tiếng Anh — kể chuyện & bài luận (10 câu)",
      kind: "translate",
      grammar: "Quá khứ đơn (V-ed / V2; didn't + V) · Some people argue that…, while others believe that… · On the one hand / On the other hand · I agree with those who… · In conclusion, while…, I believe that…",
      items: [
        { q: "Năm ngoái tôi đã đi Huế với bố mẹ.", hint: "Last year, I went to Hue, with my parents", answers: ["Last year I went to Hue with my parents.", "Last year, I went to Hue with my parents.", "I went to Hue with my parents last year.", "Last year I travelled to Hue with my parents.", "Last year, I traveled to Hue with my parents."] },
        { q: "Chúng tôi ở đó ba ngày và thăm Đại Nội.", hint: "We stayed there, for three days, and visited, the Imperial City", answers: ["We stayed there for three days and visited the Imperial City.", "We stayed there three days and visited the Imperial City.", "We spent three days there and visited the Imperial City.", "We stayed there for three days and visited the Citadel.", "We stayed there for 3 days and visited the Imperial City."] },
        { q: "Tôi chưa bao giờ thấy nhiều người như vậy.", hint: "I had never seen / I'd never seen, so many people", answers: ["I had never seen so many people.", "I'd never seen so many people.", "I had never seen so many people before.", "I'd never seen so many people before.", "I have never seen so many people."] },
        { q: "Ngày hôm sau, trời mưa nên chúng tôi ở trong khách sạn.", hint: "The next day, it rained, so, we stayed in the hotel", answers: ["The next day, it rained, so we stayed in the hotel.", "The next day it rained, so we stayed in the hotel.", "The next day, it rained so we stayed in the hotel.", "The next day it rained so we stayed in the hotel.", "The next day, it rained, so we stayed at the hotel.", "The next day it rained, so we stayed at the hotel."] },
        { q: "Tôi thấy rất nhẹ nhõm khi biết kết quả thi.", hint: "I felt very relieved, when, I got / found out, my exam results", answers: ["I felt very relieved when I got my exam results.", "I felt very relieved when I found out my exam results.", "I felt really relieved when I got my exam results.", "I felt so relieved when I got my exam results.", "I felt very relieved when I learned my exam results.", "I felt very relieved when I knew my exam results.", "I felt very relieved when I found out my exam result.", "I felt very relieved when I got my exam result."] },
        { q: "Một số người cho rằng học sinh nên mặc đồng phục, trong khi những người khác tin rằng các em nên được tự do chọn quần áo.", hint: "Some people argue / believe that, students should wear uniforms, while others believe that, they should be free to choose their clothes", answers: ["Some people argue that students should wear uniforms, while others believe that they should be free to choose their clothes.", "Some people believe that students should wear uniforms, while others believe that they should be free to choose their clothes.", "Some people argue that students should wear uniforms, while others believe they should be free to choose their clothes.", "Some people think that students should wear uniforms, while others believe that they should be free to choose their clothes.", "Some people argue that students should wear uniforms while others believe that they should be free to choose their clothes.", "Some people argue that students should wear uniforms, whereas others believe that they should be free to choose their clothes.", "Some people argue that students should wear uniforms, while others believe that they should be free to choose their own clothes."] },
        { q: "Một mặt, đồng phục giúp học sinh trông bình đẳng.", hint: "On the one hand, uniforms, help students / make students, look equal", answers: ["On the one hand, uniforms help students look equal.", "On the one hand, uniforms make students look equal.", "On the one hand uniforms help students look equal.", "On the one hand, uniforms help students to look equal.", "On the one hand, school uniforms help students look equal.", "On the one hand, school uniforms make students look equal."] },
        { q: "Mặt khác, tôi đồng ý với những người tin rằng học sinh nên thể hiện cá tính.", hint: "On the other hand, I agree with those who believe that, students should express their personality", answers: ["On the other hand, I agree with those who believe that students should express their personality.", "On the other hand, I agree with those who believe students should express their personality.", "On the other hand, I agree with those who believe that students should express their personalities.", "On the other hand, I agree with those who believe that students should be able to express their personality.", "On the other hand I agree with those who believe that students should express their personality."] },
        { q: "Tóm lại, dù cả hai quan điểm đều có lý, tôi tin rằng đồng phục có lợi hơn.", hint: "In conclusion, while / although, both views are reasonable, I believe that, uniforms are more beneficial", answers: ["In conclusion, while both views are reasonable, I believe that uniforms are more beneficial.", "In conclusion, although both views are reasonable, I believe that uniforms are more beneficial.", "In conclusion, while both views are reasonable, I believe uniforms are more beneficial.", "In conclusion, although both views are reasonable, I believe uniforms are more beneficial.", "In conclusion, while both views have some merit, I believe that uniforms are more beneficial.", "In conclusion, while both views make sense, I believe that uniforms are more beneficial."] },
        { q: "Bài luận này sẽ bàn cả hai quan điểm trước khi giải thích vì sao tôi ủng hộ quan điểm sau.", hint: "This essay will discuss both views, before explaining why, I support the latter", answers: ["This essay will discuss both views before explaining why I support the latter.", "This essay will discuss both views before explaining why I support the latter view.", "This essay will discuss both views before explaining why I support the latter one."] },
      ],
    },
    { t: "h", text: "II. Chia động từ quá khứ (10 chỗ trống)" },
    {
      t: "p",
      text: "Đoạn kể chuyện Part 2 dưới đây bị xoá động từ. Chia động từ trong ngoặc ở **quá khứ đơn** (hoặc quá khứ tiếp diễn nếu có gợi ý).",
    },
    {
      t: "quiz",
      id: "d14-bt-qua-khu",
      title: "II. Chia động từ trong ngoặc (10 câu)",
      kind: "fill",
      items: [
        { q: "(1) Last summer, I ___ (take) a cooking class in Hoi An.", answers: ["took"], hint: "bất quy tắc" },
        { q: "(2) The class ___ (begin) at eight in the morning.", answers: ["began"], hint: "bất quy tắc" },
        { q: "(3) First, our teacher ___ (bring) us to a local market.", answers: ["brought"], hint: "bất quy tắc — giống bought" },
        { q: "(4) We ___ (buy) fresh herbs, rice noodles and some pork.", answers: ["bought"], hint: "bất quy tắc" },
        { q: "(5) While we ___ (walk) back, it started to rain. (quá khứ tiếp diễn)", answers: ["were walking"], hint: "was / were + V-ing" },
        { q: "(6) Then the teacher ___ (teach) us how to make cao lau.", answers: ["taught"], hint: "bất quy tắc" },
        { q: "(7) I ___ (not / know) how to cut the herbs properly at first.", answers: ["didn't know", "did not know"], hint: "didn't + V nguyên mẫu" },
        { q: "(8) My noodles ___ (be) too soft, but everyone laughed about it.", answers: ["were"], hint: "chủ ngữ số nhiều" },
        { q: "(9) In the end, we ___ (eat) our own dishes together.", answers: ["ate"], hint: "bất quy tắc" },
        { q: "(10) I ___ (feel) very proud when I went home.", answers: ["felt"], hint: "bất quy tắc" },
      ],
    },
    { t: "h", text: "III. Summary Completion có hộp từ (4 câu)" },
    {
      t: "passage",
      title: "City Bicycles",
      paras: [
        {
          text: "In many cities, bike-sharing schemes have become a common sight. Users unlock a bicycle with a phone app, ride it across town and leave it at any station. Supporters say the schemes reduce traffic and air pollution, and they are much cheaper than taxis. However, there have been problems. In some cities, thousands of bikes were left on pavements, blocking the way for pedestrians, and many were stolen or damaged. As a result, several companies went out of business within two years. Today, the most successful schemes use fixed parking areas and charge users a small fine if a bike is left in the wrong place.",
        },
      ],
    },
    {
      t: "table",
      caption: "Complete the summary using the list of words, A–G.",
      head: ["", "Summary"],
      rows: [
        ["", "Bike-sharing schemes are popular because they are **(1) ______** than taxis and help to cut pollution. But in some places, badly parked bikes caused **(2) ______** for people walking, and many bikes were stolen. A number of companies **(3) ______** quickly. Successful schemes now **(4) ______** users who park in the wrong place."],
        ["Words", "**A** failed · **B** cheaper · **C** problems · **D** punish · **E** reward · **F** faster · **G** grew"],
      ],
    },
    {
      t: "quiz",
      id: "d14-bt-tom-tat",
      title: "III. Viết chữ cái A–G (4 câu)",
      kind: "fill",
      items: [
        { q: "(1) they are ___ than taxis", answers: ["B", "cheaper"], hint: "so sánh hơn — về giá" },
        { q: "(2) badly parked bikes caused ___ for people walking", answers: ["C", "problems"], hint: "caused + danh từ; blocking the way" },
        { q: "(3) A number of companies ___ quickly", answers: ["A", "failed"], hint: "went out of business = ?" },
        { q: "(4) Successful schemes now ___ users who park in the wrong place", answers: ["D", "punish"], hint: "charge a small fine = ? (nhiễu trái nghĩa: reward)" },
      ],
    },
    { t: "h", text: "IV. Trắc nghiệm tổng hợp (10 câu)" },
    {
      t: "mcq",
      id: "d14-bt-chon",
      title: "IV. Chọn đáp án đúng (10 câu)",
      items: [
        { q: "Summary Completion có hộp từ: bạn ghi gì vào phiếu trả lời?", options: ["Chữ cái của từ trong hộp", "Cả cụm từ trong bài", "Số thứ tự đoạn văn"], correct: 0, why: "Đề “Write the correct letter, A–J” → ghi **chữ cái**." },
        { q: "Bài đọc: “The two methods produced almost identical results.” Từ nào trong hộp khớp nhất? “The methods worked ___.”", options: ["differently", "slowly", "similarly"], correct: 2, why: "almost identical = gần như giống hệt → **similarly**." },
        { q: "Chỗ trống “an ___ change” cần từ nào?", options: ["important", "big", "small"], correct: 0, why: "**an** → từ bắt đầu bằng **nguyên âm**: important." },
        { q: "Đề Task 2 kết bằng “Discuss both views and give your own opinion.” Thân bài 1 thường viết gì?", options: ["Ý kiến của bạn và hai lý do", "Quan điểm A (thường là phía bạn ít đồng ý)", "Kết luận"], correct: 1, why: "Thân bài 1 = quan điểm **A**; thân bài 2 = quan điểm **B** + ý kiến của bạn." },
        { q: "Chọn câu đúng.", options: ["In the other hand, others disagree.", "On the other side, others disagree.", "On the other hand, others disagree."], correct: 2, why: "Cụm cố định **On the other hand**." },
        { q: "Quá khứ của “teach” là:", options: ["teached", "taught", "thought"], correct: 1, why: "teach → **taught**. thought là quá khứ của think." },
        { q: "Trong Part 2, bạn có bao nhiêu thời gian chuẩn bị?", options: ["30 giây", "1 phút", "2 phút"], correct: 1, why: "**1 phút** chuẩn bị, rồi nói 1–2 phút." },
        { q: "Dòng nào trên thẻ đề Part 2 thường quan trọng nhất?", options: ["what…", "when…", "and explain…"], correct: 2, why: "Dòng **explain** (vì sao / cảm xúc) cho thấy chiều sâu — hay bị bỏ quên nhất." },
        { q: "“decided” đọc đuôi -ed là:", options: ["/t/", "/d/", "/ɪd/"], correct: 2, why: "decide tận cùng âm **/d/** → -ed đọc **/ɪd/** (thêm một âm tiết)." },
        { q: "“watched” đọc đuôi -ed là:", options: ["/t/", "/d/", "/ɪd/"], correct: 0, why: "watch tận cùng âm **/tʃ/** vô thanh → -ed đọc **/t/**: /wɒtʃt/." },
      ],
    },
    { t: "h", text: "V. Viết mở bài + kết bài" },
    {
      t: "essay",
      id: "d14-bt-viet",
      task: "Task 2",
      prompt: "Write ONLY the introduction and the conclusion (about 90 words in total) for this essay question: “Some people think that children should learn to play a musical instrument at school, while others believe that this is a waste of time. Discuss both views and give your own opinion.”",
      minWords: 70,
      tips: [
        "Mở bài: Some people argue that…, while others believe that… + In my opinion, …",
        "Paraphrase: learn to play a musical instrument → **take music lessons / learn an instrument**; a waste of time → **not a good use of school time / unnecessary**.",
        "Kết bài: In conclusion, while…, I believe that… — cùng ý kiến với mở bài.",
        "Không viết thân bài; kiểm tra ý kiến ở mở bài và kết bài có KHỚP nhau không.",
      ],
    },
  ],
};

export const NGAY_14: Lesson[] = [D14_READING, D14_WRITING, D14_SPEAKING, D14_HOMEWORK];
