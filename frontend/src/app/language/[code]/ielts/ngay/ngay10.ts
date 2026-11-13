/**
 * Ngày 10 — Reading: Matching Features · Writing: Opinion Essay 3 (kết bài + viết
 * trọn bài 250 từ) · Speaking: câu hỏi về thói quen (Part 1, used to, tần suất) ·
 * Homework.
 *
 * Tự soạn (không chụp sách — xem ../SOAN-BAI.md và bản giao việc 12/11/2026):
 * bài đọc, câu hỏi, bài mẫu, câu trả lời mẫu đều VIẾT MỚI. Các nhà nghiên cứu trong
 * bài đọc là nhân vật HƯ CẤU, số liệu tự đặt — để không gán nhầm phát hiện thật cho
 * người thật. Cả ngày đi chung một chủ đề: THÓI QUEN (đọc về khoa học thói quen,
 * viết về thói quen nhỏ, nói về thói quen hằng ngày).
 *
 * Nối tiếp: Ngày 6 = mở bài Opinion, Ngày 8 = thân bài; Ngày 10 ghép thành bài trọn.
 *
 * Bổ sung 12/11/2026 (lộ trình 0→8, mục 5.1 #3): bài Nói thêm mục 9 "Part 2 nhập môn:
 * Describe your daily routine — nói 1 phút" (thẻ đề 4 dòng, ghi chú 1 phút bằng sơ đồ
 * ý, khung bài, bài mẫu band ~4.5–5 có phân tích, tự ghi âm). Ngày 14 nâng lên 2 phút.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Reading ─────────────────────────── */

const D10_READING: Lesson = {
  id: "d10-doc",
  kind: "reading",
  title: "Đọc: Matching Features (nối thông tin với người / nhóm)",
  goal: "Làm được dạng Matching Features: quét tên riêng trong bài, đọc kỹ quanh từng tên, nhận ra từ đồng nghĩa và tránh 3 bẫy (một người xuất hiện nhiều đoạn, ý của người khác được nhắc lại, đoạn nói về A nhưng câu đó là của B).",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Matching Features** = nối mỗi **câu nhận định** (statement) với một **đặc điểm** (feature) trong danh sách A, B, C… — thường là **tên người** (nhà nghiên cứu), đôi khi là địa danh, thời kỳ, sản phẩm.",
        "Khác Flow-chart (Ngày 6): câu hỏi ==KHÔNG đi theo thứ tự bài đọc==, và một chữ cái có thể dùng **nhiều lần** (đề ghi **NB** — nota bene, “lưu ý”).",
        "Cách làm nhanh nhất: **quét và khoanh tên** trước (tên viết hoa, dễ thấy), rồi mới đọc câu hỏi và đọc kỹ quanh từng tên.",
        "3 bẫy: một người xuất hiện **ở nhiều đoạn** · người A **nhắc lại ý của người B** · đoạn nói về A nhưng **câu đó là của B**.",
        "Luyện 8 câu Matching Features + 3 câu Sentence Completion (ôn Ngày 4) + **26 từ vựng** của bài đọc.",
      ],
    },
    {
      t: "p",
      text: "Trong đề IELTS Reading thật, dạng **Matching Features** (nối đặc điểm) cho bạn hai thứ: một **danh sách câu nhận định** (đánh số 1, 2, 3…) và một **danh sách đặc điểm** (đánh chữ A, B, C…). Đặc điểm hay gặp nhất là **tên các nhà nghiên cứu** được nhắc trong bài. Việc của bạn: đọc mỗi câu nhận định và quyết định **ai đã nói / phát hiện / đề xuất** điều đó, rồi ghi **chữ cái** tương ứng.",
    },
    {
      t: "table",
      caption: "Đề Matching Features trông như thế này",
      head: ["Phần của đề", "Ví dụ", "Ý nghĩa"],
      rows: [
        ["Lệnh đề", "Look at the following statements (Questions 1–8) and the list of researchers below. Match each statement with the correct researcher, **A–E**.", "Nối mỗi câu 1–8 với một nhà nghiên cứu A–E."],
        ["Dòng NB", "**NB** You may use any letter more than once.", "Một chữ cái có thể dùng **nhiều lần** → có người được dùng 2–3 lần, có người **không được dùng lần nào**."],
        ["Câu nhận định", "**says that tiredness makes people repeat their usual behaviour**", "Câu đã **bị viết lại** (paraphrase): bài viết “When people are tired… they fall back on whatever they normally do”."],
        ["Danh sách đặc điểm", "A Dr Helen Marsh · B Professor Daniel Okafor · …", "Tên **không bị đổi** — đây là “mỏ neo” để bạn tìm vị trí trong bài."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Flow-chart Completion (Ngày 6) và Matching Features (hôm nay)",
      cols: [
        {
          title: "Flow-chart Completion",
          items: [
            "Đáp án đi **theo thứ tự** bài đọc",
            "**Chép từ** trong bài (có giới hạn số từ)",
            "Thường nằm gọn trong **1–2 đoạn**",
            "Mỏ neo: từ khoá trong từng ô",
          ],
        },
        {
          title: "Matching Features",
          items: [
            "Câu hỏi **không theo thứ tự** bài đọc",
            "**Chọn chữ cái** A, B, C… (không chép từ)",
            "Thông tin **rải khắp bài**, một người có thể ở nhiều đoạn",
            "Mỏ neo: **tên riêng** (viết hoa, không bị paraphrase)",
          ],
        },
      ],
      caption: "Vì câu hỏi không theo thứ tự, đừng đọc bài từ đầu tới cuối cho mỗi câu — hãy đánh dấu vị trí các tên MỘT lần, rồi dùng lại.",
    },

    { t: "h", text: "1. Cách làm: 5 bước" },
    {
      t: "sodo",
      kind: "flow",
      title: "5 bước làm Matching Features",
      steps: [
        { label: "Đọc lệnh đề", sub: "Mấy câu, mấy lựa chọn? Có dòng **NB** không?" },
        { label: "Quét & khoanh tên", sub: "Đánh dấu **mọi chỗ** mỗi người xuất hiện, kể cả khi chỉ còn họ (Marsh) hoặc “she / the psychologist”" },
        { label: "Gạch từ khoá câu hỏi", sub: "Động từ (says, found, recommends) + ý chính" },
        { label: "Đọc kỹ quanh tên", sub: "Tìm câu **cùng nghĩa** (paraphrase), xác định **ý của ai**" },
        { label: "Loại trừ & soát", sub: "Câu chắc làm trước; câu khó để cuối; kiểm lại bẫy" },
      ],
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Giải thích thêm"],
      rows: [
        ["1. Đọc lệnh đề", "Đếm số câu hỏi và số lựa chọn. Tìm dòng **NB You may use any letter more than once**.", "Có NB → đừng loại một người chỉ vì đã dùng tên đó rồi. Không có NB → mỗi chữ cái dùng **một lần**, loại trừ được."],
        ["2. Quét & khoanh tên", "Quét (scan) bài để tìm **tên riêng** — chữ viết hoa nổi bật. Khoanh **mọi chỗ** tên đó xuất hiện.", "Lần đầu bài viết đầy đủ (**Dr Helen Marsh**), các lần sau chỉ còn họ (**Marsh**), đại từ (**she**) hoặc nghề (**the psychologist**). Khoanh cả những chỗ đó."],
        ["3. Gạch từ khoá câu hỏi", "Gạch **động từ báo cáo** (says, found, believes, recommends, doubts) và **ý chính**.", "Động từ cho biết loại thông tin: **found** → kết quả thí nghiệm; **recommends / advises** → lời khuyên; **doubts / rejects** → ý phản bác."],
        ["4. Đọc kỹ quanh tên", "Đọc **2–3 câu** quanh mỗi chỗ đã khoanh, tìm câu có **cùng nghĩa** với câu hỏi.", "Câu hỏi luôn đã bị viết lại: tired → **tiredness**; free of charge → **without paying**; give up → **stop trying**."],
        ["5. Loại trừ & soát", "Làm câu **chắc chắn** trước. Câu khó để cuối, khi đã biết nhiều chữ cái.", "Soát 3 bẫy ở mục 2. Không bỏ trống: IELTS không trừ điểm câu sai, đoán vẫn hơn để trống."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: vì sao quét TÊN trước, không quét câu hỏi trước",
      items: [
        "Tên riêng **không bị paraphrase** và viết hoa nên **mắt bắt rất nhanh**. Câu hỏi thì luôn bị viết lại, quét theo câu hỏi rất dễ lạc.",
        "Đánh dấu vị trí tên **một lần** là dùng được cho **cả 8 câu**. Đây là chỗ tiết kiệm thời gian lớn nhất của dạng bài này.",
        "Bài thường giới thiệu người đó **kèm nghề**: “Dr Mei Tanaka, **who ran an experiment**…”, “Professor Lars Eriksen, **an economist**…”. Ghi chú nhanh bên lề (Tanaka = thí nghiệm văn phòng) giúp bạn nhớ ai làm gì.",
      ],
    },
    {
      t: "note",
      title: "Thứ tự ưu tiên khi làm (phần này sách chưa có)",
      items: [
        "**Đọc kỹ phần trích lời cạnh tên** — chỗ có dấu ngoặc kép (“…”) hoặc says / argues / claims ngay sau tên. Ý kiến của người đó **nằm gọn ở đó**, và câu hỏi thường paraphrase đúng câu trích này.",
        "**Làm người xuất hiện ÍT lần trước.** Một người chỉ được nhắc một lần thì chỉ có một chỗ để đọc — so với câu hỏi rất nhanh, gạch được câu đó khỏi danh sách.",
        "**Người được trích nhiều lần để sau.** Khi đã làm xong những người dễ, số câu còn lại ít đi → dùng **loại trừ**: câu nào chưa có chủ thì đối chiếu với các đoạn của người đó.",
        "Ghi chữ cái của người **ngay bên lề** đoạn trích (A, B, C…) khi quét tên lần đầu — lúc đối chiếu chỉ cần nhìn lề, không phải đọc lại tên.",
      ],
    },
    {
      t: "rule",
      formula: "Đọc lệnh (có NB?) → quét & khoanh MỌI chỗ tên xuất hiện → gạch động từ báo cáo + ý chính → đọc 2–3 câu quanh tên → ý đó CỦA AI? → ghi chữ cái",
      vi: "Một chữ cái có thể dùng nhiều lần (NB); có người không được dùng lần nào. Câu hỏi không theo thứ tự bài.",
    },

    { t: "h", text: "2. Ba bẫy thường gặp" },
    {
      t: "table",
      head: ["Bẫy", "Ví dụ trong bài", "Cách tránh"],
      rows: [
        ["**1. Một người xuất hiện ở nhiều đoạn**", "Okafor nói ở đoạn B (năng lượng của não) **và** đoạn F (kiến thức không đủ để đổi hành vi).", "Đó là lý do bước 2 phải khoanh **mọi chỗ**, không chỉ chỗ đầu tiên."],
        ["**2. Người A nhắc lại / phản bác ý của người B**", "“Eriksen points out that people in **Tanaka's** study did not have to give up anything…” — đây là ý **của Eriksen**, dù có tên Tanaka.", "Hỏi: **ai là chủ ngữ** của động từ nói / tin / cho rằng? Tên đứng sau **'s** hoặc sau **in / of** chỉ là người bị nhắc tới."],
        ["**3. Đoạn của A, câu của B**", "Đoạn C giới thiệu Tanaka, nhưng **câu cuối đoạn C** là ý của Eriksen.", "Đừng gán cả đoạn cho người được giới thiệu ở đầu đoạn. Đọc tới **từng câu**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở dạng bài này",
      items: [
        "Thấy **tên** và **một từ trùng** là chọn ngay: câu hỏi có “eating”, đoạn của Tanaka có “eating” → chọn Tanaka mà không kiểm tra **ý** có khớp không.",
        "Không để ý **phủ định / thái độ**: câu hỏi nói “**doubts** that…” (nghi ngờ) mà bài viết người đó **ủng hộ** ý đó → sai người.",
        "Nghĩ mỗi chữ cái chỉ dùng một lần dù đề có **NB** → bỏ đáp án đúng vì “đã dùng B rồi”.",
        "Đọc từ đầu bài cho **từng câu hỏi** → hết giờ. Khoanh tên một lần, dùng lại cho mọi câu.",
      ],
    },
    {
      t: "rule",
      formula: "Ý đó của ai? = ai là CHỦ NGỮ của says / argues / believes / found / points out. Tên đứng sau 's, in, of = người bị nhắc tới, chưa chắc là đáp án.",
      vi: "Luật vàng để thoát bẫy 2 và bẫy 3.",
    },

    { t: "h", text: "3. Ví dụ ngắn: áp dụng 5 bước (làm thử trước)" },
    {
      t: "examples",
      items: [
        { en: "Bài đọc ngắn: Professor Jane Hill studies sleep in teenagers. She found that students who used phones in bed slept 40 minutes less. Dr Sam Ortiz, however, thinks Hill's result says more about stress than about phones. In his view, worried students simply reach for their phones more often.", vi: "Giáo sư Jane Hill nghiên cứu giấc ngủ của thanh thiếu niên. Bà phát hiện học sinh dùng điện thoại trên giường ngủ ít hơn 40 phút. Tuy nhiên, Tiến sĩ Sam Ortiz cho rằng kết quả của Hill nói lên chuyện căng thẳng nhiều hơn là chuyện điện thoại. Theo ông, học sinh hay lo lắng đơn giản là cầm điện thoại nhiều hơn." },
      ],
    },
    {
      t: "mcq",
      id: "d10-doc-thu",
      title: "Làm thử — A Jane Hill · B Sam Ortiz (2 câu)",
      items: [
        {
          q: "Which researcher **measured a difference in how long students slept**?",
          options: ["A Jane Hill", "B Sam Ortiz"],
          correct: 0,
          why: "“She **found** that students who used phones in bed **slept 40 minutes less**” — chủ ngữ của found là **She = Hill**. measured a difference in how long = slept 40 minutes less.",
        },
        {
          q: "Which researcher **suggests that worry, not phones, may explain the result**?",
          options: ["A Jane Hill", "B Sam Ortiz"],
          correct: 1,
          why: "Bẫy 2: câu có tên **Hill's** (Hill's result) nhưng **chủ ngữ** của động từ thinks là **Dr Sam Ortiz**. worry = **stress / worried**. Đây là ý của Ortiz.",
        },
      ],
    },

    { t: "h", text: "4. Bài đọc luyện tập" },
    {
      t: "p",
      text: "Bài đọc dưới đây soạn riêng cho khoá học, về **khoa học thói quen** — cũng là chủ đề phần Nói hôm nay. Các nhà nghiên cứu là **nhân vật hư cấu**, số liệu tự đặt. Bài dài **6 đoạn A–F** (khoảng 680 từ), dài hơn bài Ngày 6 — đúng nhịp tăng dần của khoá. Làm theo thứ tự: đọc lệnh đề và danh sách tên → **quét, khoanh tên** → đọc câu hỏi → đọc kỹ quanh tên.",
    },
    {
      t: "passage",
      title: "Why Habits Stick",
      intro: "Bài đọc 6 đoạn (A–F). Questions 1–8 (Matching Features) và 9–11 (Sentence Completion) ở ngay bên dưới.",
      paras: [
        {
          label: "A",
          text: "Every morning, millions of people pick up their phones before they are fully awake, and very few of them could explain why. According to Dr Helen Marsh, a psychologist who has studied daily routines for more than twenty years, this is exactly what separates a habit from an ordinary decision. 'A habit is an action that no longer waits for permission,' she explains. 'Something in your surroundings, such as a place, a time or a sound, starts it, and you only notice afterwards.' In her view, most people greatly overestimate how many of their daily actions they actually choose.",
        },
        {
          label: "B",
          text: "Why should the brain work like this? Professor Daniel Okafor, who studies how the brain uses energy, believes the answer is efficiency. Thinking carefully about every small action, from brushing our teeth to locking the front door, would quickly exhaust us, so the brain hands repeated actions over to automatic systems that need very little attention. The cost of this efficiency, Okafor argues, appears at the end of a long day. When people are tired or stressed, they have less energy for careful decisions, and so they fall back on whatever they normally do, whether that is going for a run or opening a packet of crisps.",
        },
        {
          label: "C",
          text: "If habits are triggered by our surroundings, then changing the surroundings should change the habit. This was the starting point for Dr Mei Tanaka, who ran a six-month experiment in the offices of a large insurance company. Instead of giving staff information about healthy eating, her team simply moved a bowl of fresh fruit from a corner of the kitchen to a spot next to the coffee machine, while the biscuits were put inside a cupboard. Fruit consumption rose by almost a third, and biscuit consumption fell. 'We did not ask anyone to try harder,' Tanaka says. 'We just made the healthy choice the easy one.' Not everyone is convinced, however. Professor Lars Eriksen, an economist who studies motivation, points out that people in Tanaka's study did not have to give up anything they enjoyed. In his opinion, changes to the environment rarely last unless the new behaviour also brings some kind of pleasure.",
        },
        {
          label: "D",
          text: "Rewards are at the centre of Eriksen's own research. In his experiments, people who received a small reward immediately after exercising, such as being allowed to listen to a favourite podcast only while they were at the gym, kept going far longer than people who were promised a larger reward at the end of the month. Eriksen is also critical of the popular claim that any habit can be formed in exactly 21 days. 'There is no magic number,' he says. 'A simple habit, like drinking a glass of water after breakfast, may take a few weeks. Something difficult, like going to the gym before work, can take many months.'",
        },
        {
          label: "E",
          text: "Breaking an old habit, it seems, is even harder than building a new one. Dr Ana Ruiz, who works with patients trying to stop smoking or overeating, has found that simply trying to stop rarely works, because the trigger is still there. Instead, she encourages people to keep the trigger but change the response: someone who always reaches for a cigarette during a coffee break might go for a short walk instead. She also asks her patients to make a plan for difficult moments, such as a stressful week at work, before those moments arrive. Above all, Ruiz warns against what she calls 'all-or-nothing thinking'. Missing a day or making one mistake is normal, she insists, and it should never be treated as a reason to give up completely.",
        },
        {
          label: "F",
          text: "Okafor adds one final warning. Most people already know that sugar is bad for their teeth and that exercise is good for their heart, but this knowledge alone seldom changes what they do. Habits, he says, live in a part of our behaviour that facts do not easily reach. For this reason, Marsh believes the most useful question is not 'How can I find more willpower?' but 'How can I change my day so that I need less of it?'",
        },
      ],
    },

    { t: "h", text: "Questions 1–8" },
    {
      t: "p",
      text: "Look at the following statements (Questions 1–8) and the list of researchers below. Match each statement with the correct researcher, **A–E**. **NB** You may use any letter more than once. — **Nối mỗi câu 1–8 với đúng nhà nghiên cứu A–E. Lưu ý: một chữ cái có thể dùng nhiều lần.**",
    },
    {
      t: "table",
      caption: "List of Researchers — Danh sách nhà nghiên cứu",
      head: ["", "Researcher"],
      rows: [
        ["**A**", "Dr Helen Marsh"],
        ["**B**", "Professor Daniel Okafor"],
        ["**C**", "Dr Mei Tanaka"],
        ["**D**", "Professor Lars Eriksen"],
        ["**E**", "Dr Ana Ruiz"],
      ],
    },
    {
      t: "mcq",
      id: "d10-doc-cau",
      title: "Questions 1–8 — Matching Features (A–E)",
      items: [
        {
          q: "(1) compares a habit to an action that does not need anyone's approval",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 0,
          why: "Đoạn **A**: “A habit is an action that **no longer waits for permission**,” she (Dr Helen **Marsh**) explains. Paraphrase: permission = **approval**; no longer waits for = **does not need**.",
        },
        {
          q: "(2) says that tiredness makes people more likely to repeat their usual behaviour",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 1,
          why: "Đoạn **B**: “When people are **tired or stressed**… they **fall back on whatever they normally do**” — câu này nằm sau “**Okafor argues**”. tired → **tiredness**; whatever they normally do = **their usual behaviour**.",
        },
        {
          q: "(3) changed people's eating habits without giving them any advice",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 2,
          why: "Đoạn **C**: “**Instead of giving staff information** about healthy eating, her (Tanaka's) team simply **moved a bowl of fresh fruit**… Fruit consumption rose.” information about healthy eating = **advice**. Bẫy: Eriksen cũng ở đoạn C nhưng ông **không làm** thí nghiệm này.",
        },
        {
          q: "(4) doubts that changes to people's surroundings will last without a pleasant result",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 3,
          why: "**Bẫy 3** — câu cuối đoạn **C** (đoạn giới thiệu Tanaka): “In **his** opinion (Eriksen), changes to the **environment rarely last unless** the new behaviour also brings some kind of **pleasure**.” environment = **surroundings**; rarely last unless… pleasure = **doubts… will last without a pleasant result**. Tanaka thì ngược lại, bà tin đổi môi trường là đủ.",
        },
        {
          q: "(5) found that small instant rewards worked better than bigger rewards that came later",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 3,
          why: "Đoạn **D** (“Eriksen's own research”): people who received **a small reward immediately**… kept going far longer than people promised **a larger reward at the end of the month**. immediately = **instant**; at the end of the month = **came later**. Chữ **D** được dùng lần thứ hai — đúng tinh thần **NB**.",
        },
        {
          q: "(6) advises people to keep the cue but do something different",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 4,
          why: "Đoạn **E**: “she (**Ruiz**) **encourages** people to **keep the trigger but change the response**.” trigger = **cue** (tín hiệu khởi động); change the response = **do something different**; encourages = **advises**.",
        },
        {
          q: "(7) believes that information on its own seldom changes people's behaviour",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 1,
          why: "**Bẫy 1** — Okafor xuất hiện lần hai ở đoạn **F**: “this **knowledge alone seldom changes** what they do. Habits, **he** says…” knowledge = **information**; alone = **on its own**. Bẫy: **Marsh** cũng có mặt ở đoạn F, nhưng ý của bà là về **willpower** (ý chí), không phải về thông tin.",
        },
        {
          q: "(8) says that one mistake should not be a reason to stop trying",
          options: ["A Marsh", "B Okafor", "C Tanaka", "D Eriksen", "E Ruiz"],
          correct: 4,
          why: "Đoạn **E**: “**making one mistake** is normal, she (**Ruiz**) insists, and it should **never be treated as a reason to give up** completely.” give up = **stop trying**. Chữ **E** dùng lần thứ hai.",
        },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại đáp án: A 1 lần · B 2 lần · C 1 lần · D 2 lần · E 2 lần",
      items: [
        "Đúng như dòng **NB**: ba người được dùng **hai lần**. Nếu bạn cố “chia đều” mỗi người một câu thì sẽ sai ít nhất 3 câu.",
        "Câu 4 và câu 7 là hai câu khó nhất — cả hai đều là **bẫy**: câu 4 nằm trong đoạn của Tanaka nhưng là ý của Eriksen; câu 7 nằm trong đoạn có cả Okafor lẫn Marsh.",
        "Không câu nào chép **nguyên cụm từ khoá** của bài đọc: approval, tiredness, advice, surroundings, instant, cue, on its own, stop trying — tất cả đều là **từ đồng nghĩa hoặc đổi dạng từ**.",
      ],
    },

    { t: "h", text: "Questions 9–11 (ôn Ngày 4)" },
    {
      t: "p",
      text: "Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — **Hoàn thành câu. Chọn KHÔNG QUÁ HAI TỪ trong bài cho mỗi câu trả lời.** Lưu ý: từ có **gạch nối** (well-known, all-or-nothing) tính là **MỘT từ**.",
    },
    {
      t: "quiz",
      id: "d10-doc-hoan-thanh",
      title: "Questions 9–11 — NO MORE THAN TWO WORDS",
      kind: "fill",
      items: [
        { q: "(9) In Tanaka's experiment, the fruit was moved to a place next to the ___.", answers: ["coffee machine"] },
        { q: "(10) In Eriksen's experiments, some people could only listen to a favourite ___ while they were at the gym.", answers: ["podcast"] },
        { q: "(11) Ruiz warns her patients against “___ thinking”.", answers: ["all-or-nothing"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 9–11",
      items: [
        "**(9) coffee machine** — đoạn C: “moved a bowl of fresh fruit… to **a spot next to the coffee machine**”. a spot = **a place**. Sau “the” cần cụm danh từ, đúng 2 từ. Bẫy: ~~kitchen~~ là chỗ **cũ** của bát hoa quả (from a corner of the kitchen).",
        "**(10) podcast** — đoạn D: “listen to **a favourite podcast** only while they were at the gym”. Đề đã có sẵn “favourite”, chỉ cần điền **podcast**.",
        "**(11) all-or-nothing** — đoạn E: “what she calls **'all-or-nothing thinking'**”. Có gạch nối nên tính **một từ** — vừa giới hạn. Viết ~~all or nothing~~ (bỏ gạch nối) thành **ba từ** → vượt giới hạn NO MORE THAN TWO WORDS, có thể bị chấm sai. Chép **đúng như bài**, kể cả gạch nối.",
      ],
    },

    { t: "h", text: "5. Từ vựng của bài đọc (26 từ)" },
    {
      t: "p",
      text: "26 từ dưới đây đều có trong bài (có khi ở dạng khác: triggered, exhausted…). Học xong, mở lại bài và **tìm từng từ**. Hầu hết là từ dùng được ngay cho Speaking chủ đề **thói quen** và Writing Task 2 chủ đề **sức khoẻ, lối sống**.",
    },
    {
      t: "vocab",
      items: [
        { w: "habit", pos: "n", ipa: "/ˈhæbɪt/", vi: "thói quen", ex: "Checking my phone first thing in the morning is a bad habit.", exVi: "Kiểm tra điện thoại ngay khi vừa ngủ dậy là một thói quen xấu.", more: "**form / build / develop** a habit (hình thành) · **break / kick** a habit (bỏ) · **be in the habit of + V-ing** · a **good / bad / healthy** habit." },
        { w: "routine", pos: "n", ipa: "/ruːˈtiːn/", vi: "lịch sinh hoạt / nếp làm việc lặp lại hằng ngày", ex: "My morning routine starts with a glass of water and ten minutes of stretching.", exVi: "Lịch buổi sáng của tôi bắt đầu bằng một cốc nước và mười phút giãn cơ.", more: "**daily / morning / bedtime** routine · **stick to** a routine (giữ nếp) · tính từ **routine** = thường lệ: a routine check." },
        { w: "decision", pos: "n", ipa: "/dɪˈsɪʒn/", vi: "quyết định", ex: "Choosing a university is a big decision.", exVi: "Chọn trường đại học là một quyết định lớn.", more: "**make** a decision (không ~~do a decision~~) · động từ **decide to + V**. Âm /ʒ/ như trong usually." },
        { w: "permission", pos: "n", ipa: "/pəˈmɪʃn/", vi: "sự cho phép", ex: "You need your parents' permission to join the trip.", exVi: "Em cần sự cho phép của bố mẹ để tham gia chuyến đi.", more: "**ask for / give / get** permission · động từ **permit**. Không đếm được: ~~a permission~~." },
        { w: "surroundings", pos: "n", ipa: "/səˈraʊndɪŋz/", vi: "môi trường xung quanh (luôn số nhiều)", ex: "Children learn faster in safe and friendly surroundings.", exVi: "Trẻ em học nhanh hơn trong môi trường an toàn và thân thiện.", more: "Luôn có **-s** và đi với động từ số nhiều. Gần nghĩa: **environment** (số ít)." },
        { w: "overestimate", pos: "v", ipa: "/ˌəʊvərˈestɪmeɪt/", vi: "đánh giá quá cao", ex: "Many students overestimate how much they can study in one night.", exVi: "Nhiều sinh viên đánh giá quá cao lượng bài có thể học trong một đêm.", more: "Trái nghĩa **underestimate** (đánh giá thấp). Tiền tố **over-** = quá: overwork, oversleep, overeat." },
        { w: "efficiency", pos: "n", ipa: "/ɪˈfɪʃnsi/", vi: "hiệu suất, sự hiệu quả (ít tốn công sức, thời gian)", ex: "New machines have improved the efficiency of the factory.", exVi: "Máy móc mới đã nâng hiệu suất của nhà máy.", more: "Tính từ **efficient** (làm nhanh, ít lãng phí) — khác **effective** (đạt kết quả). **energy efficiency** = tiết kiệm năng lượng." },
        { w: "exhaust", pos: "v", ipa: "/ɪɡˈzɔːst/", vi: "làm kiệt sức; dùng cạn", ex: "Long night shifts exhaust even young nurses.", exVi: "Những ca đêm dài làm kiệt sức cả những y tá trẻ.", more: "Tính từ **exhausted** (người kiệt sức) · **exhausting** (việc làm kiệt sức). Chữ **h** câm: /ɪɡˈzɔːst/." },
        { w: "automatic", pos: "adj", ipa: "/ˌɔːtəˈmætɪk/", vi: "tự động; theo phản xạ, không cần nghĩ", ex: "After a few weeks, riding a motorbike becomes automatic.", exVi: "Sau vài tuần, việc lái xe máy trở thành phản xạ tự động.", more: "Trạng từ **automatically**. Danh từ **automation** (sự tự động hoá)." },
        { w: "attention", pos: "n", ipa: "/əˈtenʃn/", vi: "sự chú ý", ex: "Please pay attention to the spelling of names in Part 1.", exVi: "Hãy chú ý chính tả của tên riêng trong Part 1.", more: "**pay attention to** (không ~~pay attention on~~) · **attract / catch** sb's attention · **attention span** (khả năng tập trung)." },
        { w: "fall back on", pos: "phr v", ipa: "/fɔːl ˈbæk ɒn/", vi: "quay về dựa vào (cái quen thuộc / dự phòng)", ex: "When I forget a word in English, I fall back on simple vocabulary.", exVi: "Khi quên một từ tiếng Anh, tôi quay về dùng từ đơn giản.", more: "Quá khứ: **fell back on**. Danh từ **fallback** = phương án dự phòng." },
        { w: "trigger", pos: "n, v", ipa: "/ˈtrɪɡə(r)/", vi: "tác nhân khởi động; gây ra, kích hoạt", ex: "For many people, stress is a trigger for overeating.", exVi: "Với nhiều người, căng thẳng là tác nhân khiến ăn quá nhiều.", more: "Động từ: **trigger** a reaction / an alarm. Đồng nghĩa trong bài: **cue** (tín hiệu)." },
        { w: "insist", pos: "v", ipa: "/ɪnˈsɪst/", vi: "khẳng định chắc chắn, nhất quyết (dù người khác nghi ngờ)", ex: "My teacher insists that we speak only English in class.", exVi: "Giáo viên tôi nhất quyết yêu cầu chúng tôi chỉ nói tiếng Anh trong lớp.", more: "**insist that + S + V** · **insist on + V-ing / N** (He insisted on paying). Danh từ **insistence**. Trong bài đọc là **động từ báo cáo** mạnh (she insists) — Matching Features hay dùng." },
        { w: "consumption", pos: "n", ipa: "/kənˈsʌmpʃn/", vi: "sự tiêu thụ (lượng ăn, uống, dùng)", ex: "Sugar consumption among children has risen in recent years.", exVi: "Lượng tiêu thụ đường ở trẻ em đã tăng trong những năm gần đây.", more: "Động từ **consume**. Cụm Task 1 hay gặp: **energy / water / meat consumption**. Không đếm được." },
        { w: "convinced", pos: "adj", ipa: "/kənˈvɪnst/", vi: "tin chắc, bị thuyết phục", ex: "I am convinced that reading every day improves vocabulary.", exVi: "Tôi tin chắc rằng đọc mỗi ngày giúp tăng vốn từ.", more: "**be convinced that + S + V** / **be convinced of + N**. Động từ **convince sb to + V** (thuyết phục ai làm gì)." },
        { w: "warn", pos: "v", ipa: "/wɔːn/", vi: "cảnh báo", ex: "Doctors warn that sitting all day is bad for your back.", exVi: "Bác sĩ cảnh báo rằng ngồi cả ngày có hại cho lưng.", more: "**warn sb about / of sth** · **warn sb not to + V** · **warn against + V-ing / N** (Ruiz **warns against** all-or-nothing thinking). Danh từ **warning** (one final warning — đoạn F)." },
        { w: "give up", pos: "phr v", ipa: "/ɡɪv ˈʌp/", vi: "từ bỏ; bỏ (thói quen)", ex: "My father gave up smoking ten years ago.", exVi: "Bố tôi bỏ thuốc lá mười năm trước.", more: "**give up + V-ing / N** (give up **smoking**, không ~~give up to smoke~~) · tách được: give **it** up." },
        { w: "reward", pos: "n, v", ipa: "/rɪˈwɔːd/", vi: "phần thưởng; thưởng", ex: "After finishing my essay, I reward myself with a cup of bubble tea.", exVi: "Viết xong bài luận, tôi tự thưởng một cốc trà sữa.", more: "**reward sb with sth** · tính từ **rewarding** = đáng làm, mang lại cảm giác xứng đáng: a rewarding job." },
        { w: "immediately", pos: "adv", ipa: "/ɪˈmiːdiətli/", vi: "ngay lập tức", ex: "Write down new words immediately, or you will forget them.", exVi: "Ghi từ mới ngay lập tức, nếu không bạn sẽ quên.", more: "Tính từ **immediate** (an immediate reward = phần thưởng tức thì). Gần nghĩa: **instantly, right away**." },
        { w: "critical", pos: "adj", ipa: "/ˈkrɪtɪkl/", vi: "phê phán, chỉ trích; (2) cực kỳ quan trọng", ex: "Some parents are critical of long school hours.", exVi: "Một số phụ huynh phản đối việc học ở trường quá nhiều giờ.", more: "**be critical of sth** = phê phán · **critical thinking** = tư duy phản biện · **critical** = then chốt: a critical moment." },
        { w: "claim", pos: "n, v", ipa: "/kleɪm/", vi: "lời khẳng định (chưa chắc đúng); khẳng định", ex: "The advert claims that the drink makes you smarter.", exVi: "Quảng cáo khẳng định đồ uống đó làm bạn thông minh hơn.", more: "**claim that + S + V**. Trong Writing, **claim** cho thấy người viết **chưa tin hẳn** — khác **show / prove**." },
        { w: "response", pos: "n", ipa: "/rɪˈspɒns/", vi: "phản ứng; câu trả lời", ex: "Her response to the bad news was surprisingly calm.", exVi: "Phản ứng của cô ấy trước tin xấu bình tĩnh đến bất ngờ.", more: "**in response to** (để đáp lại) · động từ **respond to** · tính từ **responsive**." },
        { w: "plan", pos: "n, v", ipa: "/plæn/", vi: "kế hoạch; lên kế hoạch", ex: "Make a plan for the week before Monday starts.", exVi: "Lập kế hoạch cho cả tuần trước khi thứ Hai bắt đầu.", more: "**make a plan** · **plan to + V** · **plan ahead** (lên kế hoạch trước). Quá khứ **planned** (gấp đôi n)." },
        { w: "willpower", pos: "n", ipa: "/ˈwɪlpaʊə(r)/", vi: "ý chí, sức tự chủ", ex: "It takes willpower to study when your friends are going out.", exVi: "Cần có ý chí để ngồi học khi bạn bè đang đi chơi.", more: "Không đếm được. **have / lack** willpower · **strong** willpower." },
        { w: "seldom", pos: "adv", ipa: "/ˈseldəm/", vi: "hiếm khi (trang trọng hơn rarely)", ex: "My grandmother seldom watches TV; she prefers gardening.", exVi: "Bà tôi hiếm khi xem TV; bà thích làm vườn hơn.", more: "Đứng **trước động từ thường**, sau **be** — giống usually (xem bài Nói hôm nay). Đồng nghĩa: **rarely, hardly ever**." },
        { w: "behaviour", pos: "n", ipa: "/bɪˈheɪvjə(r)/", vi: "hành vi, cách cư xử", ex: "Teachers praise good behaviour in class.", exVi: "Giáo viên khen ngợi cách cư xử tốt trong lớp.", more: "Mỹ viết **behavior**. Thường **không đếm được**. Động từ **behave** (cư xử): behave **well / badly**." },
      ],
    },
    {
      t: "hinh",
      title: "Đồ vật trong bài đọc — chạm để nghe",
      items: [
        { anh: "mobile-phone", w: "phone", ro: "/fəʊn/", vi: "điện thoại (đoạn A)" },
        { anh: "toothbrush", w: "toothbrush", ro: "/ˈtuːθbrʌʃ/", vi: "bàn chải đánh răng (brushing our teeth — đoạn B)" },
        { anh: "key", w: "key", ro: "/kiː/", vi: "chìa khoá (locking the front door — đoạn B)" },
        { anh: "green-apple", w: "fruit", ro: "/fruːt/", vi: "hoa quả (a bowl of fresh fruit — đoạn C)" },
        { anh: "cookie", w: "biscuit", ro: "/ˈbɪskɪt/", vi: "bánh quy (Anh) — Mỹ gọi là cookie (đoạn C)" },
        { anh: "hot-beverage", w: "coffee", ro: "/ˈkɒfi/", vi: "cà phê (coffee machine, coffee break)" },
        { anh: "headphone", w: "podcast", ro: "/ˈpɒdkɑːst/", vi: "chương trình nghe trên mạng (đoạn D)" },
        { anh: "cigarette", w: "cigarette", ro: "/ˌsɪɡəˈret/", vi: "điếu thuốc lá (đoạn E)" },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những từ dễ dùng sai",
      items: [
        "**habit** (thói quen của một người) ≠ **custom** (phong tục của cả cộng đồng). ~~Eating banh chung at Tet is my habit.~~ → **…is a Vietnamese custom / tradition.**",
        "**efficient** (ít tốn thời gian, công sức) ≠ **effective** (đạt được kết quả). Một cách học có thể **effective** (hiệu quả) mà không **efficient** (tốn quá nhiều giờ).",
        "**give up + V-ing**: ~~give up to smoke~~ → **give up smoking**. **quit + V-ing** cũng vậy.",
        "**surroundings** luôn số nhiều: ~~a surrounding~~, ~~the surrounding is quiet~~ → **the surroundings are quiet**.",
        "**critical of** = phê phán. ~~She is critical with the plan.~~ → **She is critical of the plan.**",
      ],
    },
    {
      t: "rule",
      formula: "give up / quit + V-ing · be in the habit of + V-ing · pay attention to + N · be critical of + N · be convinced that + S + V",
      vi: "Năm khung đi kèm từ vựng hôm nay — sai giới từ / dạng động từ là mất điểm Lexical Resource.",
    },
    {
      t: "quiz",
      id: "d10-doc-tu-dich",
      title: "Dịch sang tiếng Anh — từ vựng bài đọc (5 câu)",
      kind: "translate",
      grammar: "give up + V-ing · be in the habit of + V-ing · pay attention to + N · S + seldom + V (trước động từ thường) · reward oneself with + N.",
      items: [
        { q: "Bố tôi đã bỏ hút thuốc năm ngoái.", hint: "My father, gave up, smoking, last year", answers: ["My father gave up smoking last year.", "My dad gave up smoking last year.", "My father quit smoking last year.", "My dad quit smoking last year.", "Last year, my father gave up smoking.", "Last year my father gave up smoking."] },
        { q: "Tôi có thói quen đọc tin tức vào buổi sáng.", hint: "I am in the habit of, reading the news, in the morning", answers: ["I am in the habit of reading the news in the morning.", "I'm in the habit of reading the news in the morning.", "I have a habit of reading the news in the morning.", "I am in the habit of reading the news in the mornings.", "I'm in the habit of reading the news in the mornings."] },
        { q: "Hãy chú ý đến từ đồng nghĩa trong câu hỏi.", hint: "Pay attention to, synonyms, in the questions", answers: ["Pay attention to synonyms in the questions.", "Pay attention to the synonyms in the questions.", "Please pay attention to synonyms in the questions.", "Please pay attention to the synonyms in the questions."] },
        { q: "Ông tôi hiếm khi uống cà phê.", hint: "My grandfather, seldom (trước động từ), drinks, coffee", answers: ["My grandfather seldom drinks coffee.", "My grandfather rarely drinks coffee.", "My grandpa seldom drinks coffee.", "My grandpa rarely drinks coffee.", "My grandfather hardly ever drinks coffee."] },
        { q: "Sau khi học xong, tôi tự thưởng cho mình một cốc trà sữa.", hint: "After finishing / After I finish, I reward myself with, a cup of bubble tea", answers: ["After finishing my studies, I reward myself with a cup of bubble tea.", "After I finish studying, I reward myself with a cup of bubble tea.", "After studying, I reward myself with a cup of bubble tea.", "After I finish studying, I reward myself with a bubble tea.", "After studying, I reward myself with a bubble tea.", "After finishing studying, I reward myself with a cup of bubble tea.", "After I finish my studies, I reward myself with a cup of bubble tea."] },
      ],
    },
  ],
};

/* ─────────────────────────── Writing ─────────────────────────── */

/** Bài mẫu trọn vẹn — để chung một chỗ cho bảng "cả bài" và bảng đếm từ đọc cùng nguồn. */
const D10_MAU = {
  mo: "It is often argued that teenagers should be required to do voluntary work in their local community as part of their school programme. I completely agree with this view because such work teaches young people practical skills and helps them understand the needs of others.",
  than1: "Firstly, community work allows students to develop skills that are rarely taught in the classroom. When teenagers help to organise a charity event or clean up a local park, they have to plan their time, solve unexpected problems and work in a team with people of different ages. For example, students who run a weekly reading club for younger children quickly learn how to explain ideas clearly and keep others interested. As a result, they become more confident and better prepared for university and work.",
  than2: "Secondly, unpaid work in the community helps young people become more caring citizens. Many teenagers spend most of their free time at school or online, so they have little contact with people whose lives are very different from their own. Visiting elderly people in a care home or helping at a food bank shows them the real difficulties that some members of society face. This experience often makes students more grateful for what they have and more willing to help others in the future. These are lessons that no textbook can teach.",
  ket: "In conclusion, I firmly believe that schools should include community work in their programmes. It gives students valuable practical skills that they will use for the rest of their lives, and it also teaches them to care about the people around them.",
};

const D10_WRITING: Lesson = {
  id: "d10-viet",
  kind: "writing",
  title: "Viết: Opinion Essay 3 — kết bài và viết trọn bài 250 từ",
  goal: "Viết được kết bài 2 câu cho bài Opinion (nhắc lại quan điểm + tóm tắt 2 lý do bằng lời khác, không thêm ý mới) và ghép mở bài – thân bài – kết bài thành một bài Task 2 trọn vẹn khoảng 260–280 từ trong 40 phút.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Nhắc lại cả bài Opinion **4 đoạn**: Mở bài (Ngày 6) → Thân bài 1 → Thân bài 2 (Ngày 8) → ==Kết bài (hôm nay)==.",
        "Kết bài **2 câu, ~35–50 từ**: ==In conclusion, + nhắc lại quan điểm (bằng lời khác)== + ==tóm tắt 2 lý do==.",
        "5 điều **cấm** trong kết bài: ý mới · ví dụ mới · đổi quan điểm · câu hỏi tu từ · chép y nguyên mở bài.",
        "Quy trình **40 phút**: 5′ đọc đề & dàn ý → 5′ mở bài → 20′ thân bài → 5′ kết bài → 5′ soát.",
        "Bài mẫu trọn vẹn **~270 từ** có phân tích theo 4 tiêu chí chấm, rồi bạn tự viết một bài trọn cho AI chấm.",
      ],
    },

    { t: "h", text: "1. Nhìn lại cả bài: 4 đoạn, mỗi đoạn một việc" },
    {
      t: "p",
      text: "Ở **Ngày 6** bạn đã viết **mở bài** (paraphrase đề + thesis statement — câu luận điểm nêu quan điểm và 2 lý do). Ở **Ngày 8** bạn đã viết **thân bài**: mỗi đoạn phát triển **một lý do** theo thứ tự câu chủ đề → giải thích → ví dụ. Hôm nay là mảnh cuối cùng: **kết bài** (conclusion), rồi ghép tất cả thành một bài trọn vẹn.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Bài Opinion 4 đoạn (khoảng 260–280 từ)",
      steps: [
        { label: "**Mở bài** ~45 từ", sub: "Paraphrase đề + thesis (quan điểm + lý do 1 + lý do 2)" },
        { label: "**Thân bài 1** ~90 từ", sub: "Firstly, + lý do 1 → giải thích → ví dụ → kết quả" },
        { label: "**Thân bài 2** ~90 từ", sub: "Secondly, + lý do 2 → giải thích → ví dụ → kết quả" },
        { label: "**Kết bài** ~40 từ", sub: "In conclusion, + nhắc lại quan điểm + tóm tắt 2 lý do" },
      ],
      caption: "Hai lý do xuất hiện BA lần: nêu ở thesis → phát triển ở thân bài → tóm tắt ở kết bài. Đó chính là “mạch” mà giám khảo tìm.",
    },
    {
      t: "table",
      head: ["Đoạn", "Số câu", "Số từ", "Nhiệm vụ", "Đã học ở"],
      rows: [
        ["Introduction", "2", "40–50", "Cho giám khảo biết bạn **hiểu đề** và **đứng về phía nào**.", "Ngày 6"],
        ["Body 1", "4–6", "85–110", "Thuyết phục bằng **lý do 1**: câu chủ đề, giải thích, ví dụ cụ thể.", "Ngày 8"],
        ["Body 2", "4–6", "85–110", "Thuyết phục bằng **lý do 2**, cùng cấu trúc với Body 1.", "Ngày 8"],
        ["Conclusion", "2", "35–50", "**Đóng bài**: nhắc lại quan điểm và hai lý do, không thêm gì mới.", "Hôm nay"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao không thể bỏ kết bài",
      items: [
        "Bảng tiêu chí **Task Response** (trả lời đúng đề) đòi một quan điểm **rõ ràng xuyên suốt** bài. Kết bài là chỗ bạn **khẳng định lần cuối** quan điểm đó.",
        "Tiêu chí **Coherence & Cohesion** (mạch lạc & liên kết) đánh giá bài có **mở – thân – kết** rõ ràng không. Bài thiếu kết bài trông như **chưa viết xong**.",
        "Hết giờ mà chưa có kết bài? Viết vội **một câu** “In conclusion, I believe that… because… and…” vẫn tốt hơn nhiều so với để trống.",
      ],
    },

    { t: "h", text: "2. Kết bài làm gì? 3 bước" },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Ví dụ (đề: học sinh trung học nên làm việc cộng đồng không lương)"],
      rows: [
        ["1. Báo hiệu kết bài", "Mở bằng **In conclusion,** / **To conclude,** / **In summary,**", "**In conclusion,** …"],
        ["2. Nhắc lại quan điểm", "Nói lại **đúng quan điểm** ở thesis nhưng **bằng từ khác** (đổi từ đồng nghĩa, đổi cấu trúc).", "…I **firmly believe** that **schools should include community work** in their programmes. (thesis: I completely agree with this view…)"],
        ["3. Tóm tắt 2 lý do", "Gói **2 lý do** của 2 thân bài vào **một câu ngắn**, cũng bằng lời khác.", "It gives students **valuable practical skills**, and it also teaches them **to care about the people around them**."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Mở bài và kết bài: giống nhau ở ý, khác nhau ở việc",
      cols: [
        {
          title: "Mở bài (Introduction)",
          items: [
            "Câu 1: **paraphrase đề** — giới thiệu vấn đề",
            "Câu 2: **thesis** — quan điểm + 2 lý do",
            "Nhìn **về phía trước**: “bài này sẽ nói…”",
            "Mở đầu: It is often argued that… / Some people believe that…",
          ],
        },
        {
          title: "Kết bài (Conclusion)",
          items: [
            "Câu 1: **nhắc lại quan điểm** (lời khác)",
            "Câu 2: **tóm tắt 2 lý do** (lời khác)",
            "Nhìn **về phía sau**: “bài này đã chứng minh…”",
            "Mở đầu: In conclusion, / To conclude,",
          ],
        },
      ],
      caption: "Cùng quan điểm, cùng 2 lý do — nhưng KHÔNG chép lại câu chữ. Giám khảo chấm vốn từ ở chính chỗ bạn đổi lời.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "In conclusion, I firmly believe that + S + V. + S + V + lý do 1, and + S + also + V + lý do 2.",
          vi: "Kết bài cho quan điểm ĐỒNG Ý (hoặc không đồng ý) một phía — dễ nhất, an toàn nhất.",
          examples: [
            { en: "In conclusion, I firmly believe that cooking should be taught at secondary school. It is an essential life skill, and it also helps teenagers eat more healthily.", vi: "Tóm lại, tôi tin chắc rằng nấu ăn nên được dạy ở trường trung học. Đó là một kỹ năng sống thiết yếu, và nó cũng giúp thanh thiếu niên ăn uống lành mạnh hơn." },
          ],
        },
        {
          formula: "To conclude, I disagree that + S + V, because + S + V + and + S + V.",
          vi: "Kết bài cho quan điểm KHÔNG đồng ý — gói cả quan điểm và lý do trong một câu dài, hoặc tách làm hai.",
          examples: [
            { en: "To conclude, I disagree that homework should be banned, because it helps students remember lessons and teaches them to work independently.", vi: "Tóm lại, tôi không đồng ý rằng nên cấm bài tập về nhà, vì nó giúp học sinh nhớ bài và dạy các em tự làm việc." },
          ],
        },
        {
          formula: "In conclusion, although + S + V (mặt kia), I believe that + S + V + because + lý do 1 + and + lý do 2.",
          vi: "Kết bài có NHƯỢNG BỘ (concession — thừa nhận mặt kia một chút) — hợp với đề “To what extent”, nghe chín chắn hơn (band 6+).",
          examples: [
            { en: "In conclusion, although online learning can feel lonely, I believe its advantages outweigh its drawbacks because it saves time and lets students learn at their own pace.", vi: "Tóm lại, dù học trực tuyến có thể gây cảm giác cô đơn, tôi tin lợi ích của nó lớn hơn bất lợi vì nó tiết kiệm thời gian và cho người học học theo tốc độ riêng." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Đổi lời từ thesis sang kết bài — ví dụ",
      head: ["Trong thesis (mở bài)", "Trong kết bài", "Cách đổi"],
      rows: [
        ["I completely agree with this view", "I firmly believe that schools should…", "Đổi cách nói quan điểm + nói rõ nội dung"],
        ["teaches young people practical skills", "gives students valuable practical skills", "Đổi động từ (teach → give), đổi danh từ (young people → students), thêm tính từ"],
        ["helps them understand the needs of others", "teaches them to care about the people around them", "Diễn đạt cùng ý bằng cụm khác"],
        ["because… and…", "It…, and it also…", "Đổi cấu trúc: một câu có because → câu riêng có “and… also”"],
      ],
    },
    {
      t: "rule",
      formula: "In conclusion, + I firmly believe / I strongly disagree that + S + V. + It + V + lý do 1, and it also + V + lý do 2.",
      vi: "Kết bài = báo hiệu + quan điểm (lời khác) + 2 lý do (lời khác). Không ý mới, không ví dụ mới.",
    },
    {
      t: "quiz",
      id: "d10-viet-ket-dich",
      title: "Dịch sang tiếng Anh — câu kết bài Opinion (5 câu)",
      kind: "translate",
      grammar: "In conclusion, / To conclude, + I firmly believe that + S + V · It + V-s + lý do 1, and it also + V-s + lý do 2 · although + S + V, I believe that + S + V.",
      items: [
        { q: "Tóm lại, tôi tin chắc rằng các trường học nên dạy nấu ăn.", hint: "In conclusion, I firmly believe that, schools should teach cooking", answers: ["In conclusion, I firmly believe that schools should teach cooking.", "In conclusion, I firmly believe schools should teach cooking.", "To conclude, I firmly believe that schools should teach cooking.", "In conclusion, I strongly believe that schools should teach cooking.", "To conclude, I strongly believe that schools should teach cooking.", "In conclusion, I firmly believe that cooking should be taught at school.", "In conclusion, I firmly believe that cooking should be taught in schools."] },
        { q: "Nó tiết kiệm thời gian, và nó cũng giảm căng thẳng.", hint: "It saves time, and it also reduces stress", answers: ["It saves time, and it also reduces stress.", "It saves time and it also reduces stress.", "It saves time, and it also lowers stress.", "It saves time and also reduces stress.", "It saves time, and it reduces stress as well."] },
        { q: "Tóm lại, tôi không đồng ý rằng nên cấm điện thoại ở trường.", hint: "To conclude / In conclusion, I disagree that, phones should be banned, at school / in schools", answers: ["To conclude, I disagree that phones should be banned at school.", "In conclusion, I disagree that phones should be banned at school.", "To conclude, I disagree that phones should be banned in schools.", "In conclusion, I disagree that phones should be banned in schools.", "In conclusion, I do not agree that phones should be banned at school.", "In conclusion, I don't agree that phones should be banned at school.", "To conclude, I disagree that mobile phones should be banned at school.", "In conclusion, I disagree that mobile phones should be banned in schools."] },
        { q: "Tóm lại, dù làm việc tại nhà có thể cô đơn, tôi tin rằng lợi ích của nó lớn hơn bất lợi.", hint: "In conclusion, although, working from home can be lonely, I believe that, its advantages outweigh its disadvantages / drawbacks", answers: ["In conclusion, although working from home can be lonely, I believe that its advantages outweigh its disadvantages.", "In conclusion, although working from home can be lonely, I believe that its advantages outweigh its drawbacks.", "In conclusion, although working from home can be lonely, I believe its advantages outweigh its disadvantages.", "In conclusion, although working from home can be lonely, I believe its advantages outweigh its drawbacks.", "To conclude, although working from home can be lonely, I believe that its advantages outweigh its disadvantages.", "In conclusion, although working from home can feel lonely, I believe that its advantages outweigh its disadvantages.", "In conclusion, although working from home can be lonely, I believe that the advantages outweigh the disadvantages."] },
        { q: "Nó cho học sinh những kỹ năng quý giá và dạy các em quan tâm đến người khác.", hint: "It gives students, valuable skills, and teaches them to care about, others", answers: ["It gives students valuable skills and teaches them to care about others.", "It gives students valuable skills, and it teaches them to care about others.", "It gives students valuable skills and teaches them to care about other people.", "It gives students valuable skills, and it also teaches them to care about others.", "It gives students valuable skills and also teaches them to care about others.", "It gives students valuable skills and teaches them to care for others."] },
      ],
    },

    { t: "h", text: "3. Năm điều KHÔNG làm trong kết bài" },
    {
      t: "note",
      title: "Người Việt hay sai khi viết kết bài",
      items: [
        "**Thêm ý mới**: ~~In conclusion, community work is good. Moreover, it can help students find a job.~~ Lý do mới phải nằm ở thân bài; kết bài chỉ **tóm lại** những gì đã viết.",
        "**Thêm ví dụ mới** hay số liệu mới: ~~…for example, my cousin volunteered for three years.~~ Ví dụ thuộc về thân bài.",
        "**Đổi quan điểm**: mở bài “I completely agree”, kết bài lại “both sides have advantages, so it depends” → giám khảo thấy bạn **không nhất quán**, Task Response bị hạ điểm.",
        "**Câu hỏi tu từ / câu cảm thán**: ~~So why don't we all do community work?~~ ~~Let's protect our planet!~~ — giọng diễn thuyết, không hợp văn học thuật.",
        "**Chép y nguyên mở bài**: phần chép lại không chứng minh được vốn từ. Cũng tránh mở đầu bằng ~~In a nutshell~~, ~~To sum up, I think that in my opinion…~~ (thân mật / lặp ý). Chỉ một từ nối: ~~In conclusion, to sum up,~~.",
        "**Kết bằng “I hope”**: ~~I hope the government will think about this.~~ — câu này không tóm tắt gì cả. Nếu muốn có câu cuối hướng tới tương lai, viết **khuyến nghị cụ thể** (Schools should therefore…).",
      ],
    },
    {
      t: "mcq",
      id: "d10-viet-chon-ket",
      title: "Chọn kết bài tốt nhất (4 câu)",
      items: [
        {
          q: "Thesis: “I agree that cooking should be compulsory because it is a life skill and it improves teenagers' diets.” Kết bài nào tốt nhất?",
          options: [
            "In conclusion, I strongly believe that every secondary school should teach cooking, as it prepares students for adult life and encourages them to eat more healthily.",
            "In conclusion, cooking should be compulsory because it is a life skill and it improves teenagers' diets.",
            "In conclusion, cooking is important. Also, it can help students get jobs in restaurants in the future.",
          ],
          correct: 0,
          why: "Phương án 1 giữ đúng quan điểm + 2 lý do nhưng **đổi lời**: compulsory → every school should teach; life skill → prepares students for adult life; improves diets → eat more healthily. Phương án 2 **chép gần y nguyên** thesis; phương án 3 thêm **ý mới** (việc làm ở nhà hàng).",
        },
        {
          q: "Câu nào **không nên** xuất hiện trong kết bài?",
          options: [
            "To conclude, I disagree that homework should be banned.",
            "For instance, a study in 2020 found that students who did homework scored 15% higher.",
            "It helps students review lessons and builds independence.",
          ],
          correct: 1,
          why: "Câu 2 là **ví dụ + số liệu mới** — thuộc về thân bài. Kết bài chỉ nhắc lại quan điểm (câu 1) và tóm tắt lý do (câu 3).",
        },
        {
          q: "Mở bài nói “I completely disagree”. Kết bài nào **nhất quán**?",
          options: [
            "In conclusion, there are both advantages and disadvantages, so it depends on each person.",
            "In conclusion, I believe that this idea has some benefits and I partly agree.",
            "In conclusion, I remain convinced that this policy would do more harm than good.",
          ],
          correct: 2,
          why: "Câu 3 giữ **đúng quan điểm phản đối** (do more harm than good = có hại nhiều hơn lợi). Câu 1 và 2 **đổi quan điểm** sang trung lập / đồng ý một phần → mất nhất quán, bị trừ điểm Task Response.",
        },
        {
          q: "Từ nối nào **đúng** để mở kết bài trong văn học thuật?",
          options: ["In conclusion,", "In a nutshell,", "Last but not least,"],
          correct: 0,
          why: "**In conclusion,** (hoặc To conclude, In summary,) là chuẩn. **In a nutshell** quá thân mật (văn nói). **Last but not least** dùng để giới thiệu **ý cuối cùng trong danh sách** — không dùng để kết bài.",
        },
      ],
    },

    { t: "h", text: "4. Viết trọn bài trong 40 phút" },
    {
      t: "sodo",
      kind: "flow",
      title: "Chia 40 phút cho Task 2",
      steps: [
        { label: "5′ — Đọc đề & dàn ý", sub: "Gạch chủ đề, đối tượng, ý kiến; chọn phía; ghi 2 lý do + 2 ví dụ ra nháp" },
        { label: "5′ — Mở bài", sub: "Paraphrase + thesis (Ngày 6)" },
        { label: "20′ — Hai thân bài", sub: "Mỗi đoạn ~10 phút: chủ đề → giải thích → ví dụ (Ngày 8)" },
        { label: "5′ — Kết bài", sub: "Quan điểm + 2 lý do, bằng lời khác" },
        { label: "5′ — Soát lỗi", sub: "Chia động từ, -s, mạo từ, chính tả, đếm từ" },
      ],
      caption: "Người mới hay bỏ bước 1 (dàn ý) vì sợ thiếu giờ — rồi viết tới thân bài 2 thì hết ý. 5 phút dàn ý TIẾT KIỆM thời gian chứ không tốn.",
    },
    {
      t: "p",
      text: "**Đề mẫu:** Some people believe that secondary school students should do unpaid community work as part of their studies. Do you agree or disagree? — **Một số người tin rằng học sinh trung học nên làm việc cộng đồng không lương như một phần của chương trình học. Bạn đồng ý hay không đồng ý?**",
    },
    {
      t: "table",
      caption: "Bước 1 — dàn ý 5 phút (ghi ra nháp bằng từ khoá, không viết câu)",
      head: ["Phần", "Ghi chú nháp"],
      rows: [
        ["Chủ đề · đối tượng · ý kiến", "unpaid community work · secondary students · should be part of studies → **ĐỒNG Ý**"],
        ["Lý do 1 + ví dụ", "practical skills (plan, solve problems, teamwork) → ví dụ: reading club for younger kids → confident"],
        ["Lý do 2 + ví dụ", "caring citizens (little contact with different people) → ví dụ: care home, food bank → grateful, help others"],
        ["Từ đổi lời", "unpaid community work → voluntary work / community work · students → teenagers / young people · studies → school programme"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: `[Introduction] ${D10_MAU.mo}`, vi: "[Mở bài] Người ta thường cho rằng thanh thiếu niên nên được yêu cầu làm việc tình nguyện ở cộng đồng địa phương như một phần chương trình học ở trường. Tôi hoàn toàn đồng ý với quan điểm này vì công việc như vậy dạy người trẻ những kỹ năng thực tế và giúp các em hiểu nhu cầu của người khác." },
        { en: `[Body 1] ${D10_MAU.than1}`, vi: "[Thân bài 1] Thứ nhất, làm việc cộng đồng giúp học sinh phát triển những kỹ năng hiếm khi được dạy trên lớp. Khi thanh thiếu niên giúp tổ chức một sự kiện từ thiện hay dọn dẹp công viên địa phương, các em phải sắp xếp thời gian, giải quyết vấn đề bất ngờ và làm việc nhóm với người ở nhiều độ tuổi. Ví dụ, những học sinh điều hành một câu lạc bộ đọc sách hằng tuần cho các em nhỏ hơn nhanh chóng học được cách giải thích ý tưởng rõ ràng và giữ cho người khác hứng thú. Nhờ đó, các em tự tin hơn và chuẩn bị tốt hơn cho đại học và công việc." },
        { en: `[Body 2] ${D10_MAU.than2}`, vi: "[Thân bài 2] Thứ hai, làm việc không lương trong cộng đồng giúp người trẻ trở thành những công dân biết quan tâm hơn. Nhiều thanh thiếu niên dành phần lớn thời gian rảnh ở trường hoặc trên mạng, nên ít tiếp xúc với những người có cuộc sống rất khác mình. Đến thăm người già ở viện dưỡng lão hay phụ giúp ở một ngân hàng thực phẩm cho các em thấy những khó khăn thật mà một số thành viên trong xã hội phải đối mặt. Trải nghiệm này thường khiến học sinh biết ơn hơn với những gì mình có và sẵn lòng giúp người khác hơn trong tương lai. Đó là những bài học không cuốn sách giáo khoa nào dạy được." },
        { en: `[Conclusion] ${D10_MAU.ket}`, vi: "[Kết bài] Tóm lại, tôi tin chắc rằng các trường nên đưa công việc cộng đồng vào chương trình học. Nó cho học sinh những kỹ năng thực tế quý giá mà các em sẽ dùng suốt đời, và nó cũng dạy các em quan tâm đến những người xung quanh." },
      ],
    },
    {
      t: "table",
      caption: "Đếm từ bài mẫu (đã đếm thật)",
      head: ["Đoạn", "Số từ", "Số câu"],
      rows: [
        ["Introduction", "45", "2"],
        ["Body 1", "85", "4"],
        ["Body 2", "92", "5"],
        ["Conclusion", "42", "2"],
        ["**Cả bài**", "**264**", "**13**"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: đếm từ trước khi nộp",
      items: [
        "Đề yêu cầu **at least 250 words** (ít nhất 250 từ). Bản nháp đầu tiên của bài mẫu này chỉ có **246 từ** — **thiếu 4 từ**, và bài dưới 250 từ bị **trừ điểm Task Response**. Chỉ hơi ngắn một chút là đã dưới mức tối thiểu!",
        "Cách sửa nhanh nhất là **thêm vào chỗ đã có ý**, không thêm ý mới: một câu kết đoạn cho Body 2 (**These are lessons that no textbook can teach.** +8 từ) và một cụm làm rõ trong kết bài (**that they will use for the rest of their lives** +10 từ) → **264 từ**.",
        "Thói quen tốt: nhắm **260–290 từ**. Đếm nhanh = số từ **trên một dòng** chữ của bạn (thường 10–12 từ) × số dòng. Không cần viết quá 320 từ — dài hơn không được thêm điểm mà tăng nguy cơ lỗi.",
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu có thể đạt khoảng band 6–6.5",
      head: ["Tiêu chí", "Bài mẫu làm được gì", "Ở đâu"],
      rows: [
        ["**Task Response** (trả lời đề)", "Quan điểm **rõ từ đầu đến cuối** (completely agree → firmly believe). Hai lý do đều có **giải thích + ví dụ cụ thể**.", "Thesis · reading club · care home, food bank"],
        ["**Coherence & Cohesion** (mạch lạc)", "4 đoạn rõ ràng; mỗi thân bài mở bằng **câu chủ đề** khớp 1 lý do; từ nối đa dạng: **Firstly, Secondly, For example, As a result, so, In conclusion**.", "Câu đầu mỗi đoạn"],
        ["**Lexical Resource** (vốn từ)", "Đổi lời liên tục: unpaid community work → **voluntary work / community work / unpaid work**; collocation tự nhiên: **solve unexpected problems, care home, food bank, caring citizens**.", "Khắp bài"],
        ["**Grammatical Range & Accuracy** (ngữ pháp)", "Có **mệnh đề quan hệ** (skills that are rarely taught, people whose lives…), câu **When…**, câu bị động (**are rarely taught**), so sánh (**more confident, better prepared**).", "Body 1, Body 2"],
      ],
    },
    {
      t: "table",
      caption: "Từ nối cho cả bài Opinion — mỗi vị trí một nhóm",
      head: ["Vị trí", "Từ nối", "Lưu ý"],
      rows: [
        ["Mở thân bài 1", "**Firstly, · First of all, · To begin with,**", "Không viết ~~First of all, firstly~~ (lặp)."],
        ["Mở thân bài 2", "**Secondly, · In addition, · Another reason is that…**", "**Secondly** đi đôi với **Firstly** — dùng cặp cho nhất quán (~~First, … Secondly~~ lệch cặp)."],
        ["Thêm ý trong đoạn", "**Moreover, · Furthermore, · also**", "Đứng đầu câu, có **dấu phẩy** sau Moreover, / Furthermore,."],
        ["Đưa ví dụ", "**For example, · For instance, · such as + N**", "**such as** đi với danh từ, không đi với câu: ~~such as students run a club~~."],
        ["Nêu kết quả", "**As a result, · Therefore, · so**", "**so** nối hai vế trong một câu: …online, **so** they have little contact…"],
        ["Nhượng bộ / đối lập", "**However, · Although + S + V, · while**", "~~Although… but…~~ → chỉ dùng **một** trong hai."],
        ["Mở kết bài", "**In conclusion, · To conclude, · In summary,**", "Không dùng ~~In a nutshell~~, ~~Last but not least~~."],
      ],
    },
    {
      t: "rule",
      formula: "Bài Opinion = [Paraphrase + I agree because R1 and R2.] + [Firstly, R1 → giải thích → For example… → As a result…] + [Secondly, R2 → …] + [In conclusion, quan điểm (lời khác) + R1 & R2 (lời khác).]",
      vi: "R1, R2 = hai lý do. Mỗi lý do xuất hiện 3 lần: thesis → thân bài → kết bài.",
    },
    {
      t: "quiz",
      id: "d10-viet-noi-dich",
      title: "Dịch sang tiếng Anh — câu có từ nối trong thân bài (4 câu)",
      kind: "translate",
      grammar: "Firstly, / Secondly, + S + V · For example, + S + V · As a result, + S + V · S + V, so + S + V · Although + S + V, S + V (không dùng but).",
      items: [
        { q: "Thứ nhất, làm việc cộng đồng dạy học sinh những kỹ năng thực tế.", hint: "Firstly, community work, teaches, students, practical skills", answers: ["Firstly, community work teaches students practical skills.", "First, community work teaches students practical skills.", "Firstly, community work teaches practical skills to students.", "To begin with, community work teaches students practical skills.", "First of all, community work teaches students practical skills."] },
        { q: "Ví dụ, học sinh có thể dọn dẹp một công viên địa phương.", hint: "For example, students can, clean up, a local park", answers: ["For example, students can clean up a local park.", "For instance, students can clean up a local park.", "For example, students could clean up a local park.", "For instance, students could clean up a local park.", "For example, students can clean a local park."] },
        { q: "Nhiều thanh thiếu niên dành thời gian rảnh trên mạng, nên các em ít tiếp xúc với người già.", hint: "Many teenagers, spend their free time online, so, they have little contact with, elderly people", answers: ["Many teenagers spend their free time online, so they have little contact with elderly people.", "Many teenagers spend their free time online, so they have little contact with old people.", "Many teenagers spend their free time online so they have little contact with elderly people.", "Many teenagers spend their free time online, so they have little contact with the elderly.", "Many teenagers spend their spare time online, so they have little contact with elderly people."] },
        { q: "Dù làm tình nguyện tốn thời gian, nó mang lại nhiều lợi ích.", hint: "Although, volunteering takes time, it brings, many benefits (KHÔNG dùng but)", answers: ["Although volunteering takes time, it brings many benefits.", "Although volunteering takes time, it brings a lot of benefits.", "Although volunteering is time-consuming, it brings many benefits.", "Although volunteering takes time, it has many benefits.", "Although volunteering takes time, it offers many benefits.", "Though volunteering takes time, it brings many benefits.", "Although voluntary work takes time, it brings many benefits."] },
      ],
    },
    {
      t: "table",
      caption: "Soát bài 5 phút cuối — đi từ trên xuống",
      head: ["Kiểm tra", "Câu hỏi tự đặt"],
      rows: [
        ["Quan điểm", "Mở bài và kết bài có **cùng một quan điểm** không?"],
        ["Lý do", "Hai lý do trong thesis có đúng là **hai đoạn thân bài** không? Kết bài có nhắc lại **đủ hai** không?"],
        ["Ý mới", "Kết bài có lỡ thêm **ý / ví dụ mới** nào không?"],
        ["Ngữ pháp", "Chủ ngữ số ít → động từ **-s**? Sau **can / should / helps + O** là **V nguyên mẫu**? **Although** có đi kèm ~~but~~ không?"],
        ["Danh từ", "**information, advice, knowledge, homework** không thêm -s? (Ngày 5)"],
        ["Số từ", "Ít nhất **250 từ**? (đếm số từ trên một dòng × số dòng)"],
      ],
    },

    { t: "h", text: "5. Tự viết một bài trọn vẹn" },
    {
      t: "p",
      text: "Đề dưới đây đi cùng chủ đề **thói quen** của bài đọc hôm nay. Bạn có thể dùng ý từ bài đọc (đổi môi trường dễ hơn dùng ý chí; phần thưởng nhỏ, tức thì…) — nhưng **viết bằng lời của bạn**, không chép câu trong bài đọc. Làm đủ 5 bước trong 40 phút.",
    },
    {
      t: "essay",
      id: "d10-viet-bai",
      task: "Task 2",
      prompt: "Some people believe that the best way to stay healthy is to build small daily habits rather than to make big changes to their lifestyle. Do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "5′ dàn ý: chọn phía (ví dụ: ĐỒNG Ý) + 2 lý do. Gợi ý lý do: small habits are **easier to keep** (dễ duy trì) · they **add up over time** (cộng dồn) · big changes often **fail after a few weeks** · one small habit can **lead to another**.",
        "Mở bài: paraphrase — stay healthy → **keep fit / maintain good health**; small daily habits → **minor everyday routines**; big changes to lifestyle → **dramatic lifestyle changes**.",
        "Mỗi thân bài: **Firstly / Secondly,** + câu chủ đề → giải thích → **For example,** (một người cụ thể: bố bạn đi bộ 15 phút sau bữa tối…) → **As a result,**.",
        "Kết bài: **In conclusion, I firmly believe that…** + tóm tắt 2 lý do **bằng từ khác**. Không thêm ý mới.",
        "Soát 5 phút cuối theo bảng ở mục 4, nhắm **260–290 từ**.",
      ],
    },
  ],
};

/* ─────────────────────────── Speaking ─────────────────────────── */

const D10_SPEAKING: Lesson = {
  id: "d10-noi",
  kind: "speaking",
  title: "Nói: Câu hỏi về thói quen (Part 1 · Routines & Habits)",
  goal: "Trả lời trôi chảy các câu hỏi Part 1 về thói quen: dùng hiện tại đơn + trạng từ tần suất đặt đúng chỗ, cụm chỉ tần suất (once a week, twice a month…), used to để so sánh xưa – nay, phát âm đúng used to /juːst tə/ cùng âm /ʒ/ trong usually; và làm quen Part 2: đọc thẻ đề, ghi chú 1 phút, nói liền 1 phút về một ngày của mình.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Câu hỏi thói quen ở Part 1: **How often…? · Do you usually…? · What do you normally do…? · Has your routine changed…? · Did you use to…?**",
        "Thói quen hiện tại → **hiện tại đơn** + trạng từ tần suất: ==S + always / usually / often / sometimes / rarely / never + V==, nhưng ==S + be + usually==. Cụm tần suất đặt **cuối câu**: every day · **once** a week · **twice** a month.",
        "Thói quen **trong quá khứ, nay không còn**: ==used to + V== (I **used to** walk to school). Khác hẳn ==be used to + V-ing== (quen với).",
        "Công thức trả lời 3–4 câu: **tần suất → chi tiết (khi nào, ở đâu, với ai) → lý do / cảm xúc → (xưa – nay)**.",
        "Phát âm: **used to** /juːst tə/ (âm /s/, không phải /z/) và âm **/ʒ/** trong **usually**, **leisure**, **television**.",
        "**Part 2 nhập môn** (mục 9): thẻ đề ==Describe your daily routine== — 1 phút ghi từ khoá theo sơ đồ ý, nói **liền 1 phút**: mở → ① ② ③ → **explain**; tự ghi âm, nghe lại, ghi lần 2.",
      ],
    },
    {
      t: "canh",
      anh: ["alarm-clock", "person-running", "hot-beverage", "mobile-phone"],
      caption: "Một buổi sáng quen thuộc: chuông báo thức, chạy bộ, một cốc cà phê, lướt điện thoại. Giám khảo Part 1 rất hay hỏi bạn làm những việc này **bao lâu một lần**, **lúc nào**, và **có khác trước không**.",
    },

    { t: "h", text: "1. Câu hỏi về thói quen hay gặp ở Part 1" },
    {
      t: "table",
      head: ["Câu hỏi", "Hỏi về", "Thì / cấu trúc để trả lời"],
      rows: [
        ["**How often** do you go swimming?", "tần suất", "I go swimming **twice a week**. · I **hardly ever** go swimming."],
        ["**Do you usually** get up early?", "thói quen (Yes/No)", "Yes, I **usually** get up at six. / Not really, I **tend to** sleep in."],
        ["What do you **normally** do on Sunday mornings?", "hoạt động thường làm", "I **normally** + V… / On Sunday mornings, I…"],
        ["**What time** do you usually go to bed?", "thời điểm", "I **usually** go to bed **at around** eleven."],
        ["**Has your daily routine changed** since you were a child?", "so sánh xưa – nay", "Yes, a lot. I **used to** + V…, but now I + V(s)…"],
        ["**Did you use to** play outside when you were young?", "thói quen trong quá khứ", "Yes, I **used to** play football… / No, I **didn't use to**…"],
        ["Do you have any **bad habits**?", "thói quen (tốt / xấu)", "I **tend to** + V… · I'm **in the habit of** + V-ing…"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: nghe đúng loại câu hỏi để chọn đúng thì",
      items: [
        "Có **usually / normally / often / every…** trong câu hỏi → trả lời bằng **hiện tại đơn**.",
        "Có **when you were a child / in the past / use to** → nói về **quá khứ** (used to / quá khứ đơn).",
        "Có **changed** (Has… changed?) → câu hỏi **so sánh**: nói cả **trước đây** (used to) **và bây giờ** (hiện tại đơn).",
        "Có **How often** → câu đầu tiên phải là **một tần suất** (every day, twice a week…), đừng trả lời ~~Yes, I do.~~",
      ],
    },
    {
      t: "p",
      text: "Phần này sách chưa có: câu tần suất rất dễ **cụt** — “I go swimming once a week.” rồi hết. Hai thao tác làm nó dài tự nhiên: **mở bằng hoàn cảnh** (vì sao chỉ được chừng ấy lần) và **giải thích liền** điều vừa nói.",
    },
    {
      t: "table",
      caption: "Câu tần suất — trước và sau",
      head: ["Trước (cụt, band 4)", "Sau (có hoàn cảnh + giải thích, band 5)"],
      rows: [
        ["I go swimming once a week.", "**These days I'm swamped with schoolwork, so** I only go swimming once a week, usually on Saturday afternoons."],
        ["I cook every day.", "**Since my mum started working late,** I cook dinner every day — **nothing fancy, just rice, soup and some vegetables**."],
        ["I rarely go to the cinema.", "I rarely go to the cinema **because tickets have become quite expensive**, so I watch most films at home now."],
        ["I visit my grandparents twice a month.", "**They live about an hour away, so** I visit my grandparents twice a month, **usually with my cousins**."],
      ],
    },
    {
      t: "rule",
      formula: "Hoàn cảnh (These days… / Since… / They live…, so) + S + V + tần suất + chi tiết (when / with whom)",
      vi: "Đừng để câu tần suất đứng một mình: thêm VÌ SAO chỉ chừng ấy lần, hoặc giải thích ngay sau.",
    },

    { t: "h", text: "2. Trạng từ tần suất — đặt ở đâu?" },
    {
      t: "table",
      caption: "Từ 100% đến 0%",
      head: ["Trạng từ", "Mức độ", "Nghĩa", "Ví dụ"],
      rows: [
        ["**always**", "100%", "luôn luôn", "I **always** have breakfast at home."],
        ["**usually / normally**", "≈ 90%", "thường thường", "I **usually** cycle to school."],
        ["**often / frequently**", "≈ 70%", "thường, hay", "We **often** eat out on Fridays."],
        ["**sometimes**", "≈ 50%", "thỉnh thoảng", "I **sometimes** study in a café."],
        ["**occasionally**", "≈ 30%", "đôi khi, lâu lâu", "I **occasionally** stay up after midnight."],
        ["**rarely / seldom**", "≈ 10%", "hiếm khi", "My father **rarely** watches TV."],
        ["**hardly ever**", "≈ 5%", "hầu như không", "I **hardly ever** drink soft drinks."],
        ["**never**", "0%", "không bao giờ", "I **never** skip breakfast."],
      ],
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Hiện tại đơn cho thói quen: lặp lại — trước, bây giờ, và còn tiếp",
      marks: [
        { from: -8, to: 8, label: "I **usually** get up at six. (hiện tại đơn — thói quen đang có)", kieu: "lap", mau: 1 },
        { from: -8, to: 8, label: "I go to the gym **twice a week**. (cụm tần suất cuối câu)", kieu: "lap", mau: 2 },
      ],
      caption: "Các dấu × là những lần lặp lại. Thói quen ở hiện tại đơn đã có từ trước, đang có bây giờ và (theo người nói) sẽ còn tiếp — vì thế KHÔNG dùng hiện tại tiếp diễn ~~I am usually getting up~~.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + always / usually / often / sometimes / rarely / never + V(s/es)",
          vi: "Trạng từ tần suất đứng TRƯỚC động từ thường.",
          examples: [
            { en: "My sister often reads before bed.", vi: "Em gái tôi hay đọc sách trước khi ngủ." },
            { en: "I never drink coffee after 4 p.m.", vi: "Tôi không bao giờ uống cà phê sau 4 giờ chiều." },
          ],
        },
        {
          formula: "S + am / is / are + always / usually / often… + adj / N",
          vi: "Với động từ to be, trạng từ đứng SAU be.",
          examples: [
            { en: "I am usually tired on Monday mornings.", vi: "Sáng thứ Hai tôi thường mệt." },
            { en: "The bus is rarely on time.", vi: "Xe buýt hiếm khi đúng giờ." },
          ],
        },
        {
          formula: "S + don't / doesn't + usually / often + V · Do / Does + S + usually + V?",
          vi: "Câu phủ định và câu hỏi: trạng từ đứng sau trợ động từ, trước động từ chính.",
          examples: [
            { en: "I don't usually eat breakfast.", vi: "Tôi thường không ăn sáng." },
            { en: "Do you often go to the cinema?", vi: "Bạn có hay đi xem phim không?" },
          ],
        },
        {
          formula: "S + V + (O) + every day / once a week / twice a month / three times a year / from time to time",
          vi: "Cụm tần suất (nhiều từ) thường đứng CUỐI câu.",
          examples: [
            { en: "I call my grandparents twice a week.", vi: "Tôi gọi cho ông bà hai lần một tuần." },
            { en: "We go camping once or twice a year.", vi: "Chúng tôi đi cắm trại một hai lần mỗi năm." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với trạng từ tần suất",
      items: [
        "Đặt trạng từ **sau động từ thường** theo kiểu tiếng Việt “tôi đi thường xuyên”: ~~I go usually to school by bus.~~ → **I usually go to school by bus.**",
        "Đặt **trước be**: ~~I usually am busy.~~ → **I am usually busy.**",
        "~~one time a week~~, ~~two times a week~~ → **once** a week, **twice** a week. Từ ba trở lên mới dùng **times**: three times a week.",
        "~~I always never~~, ~~I don't never~~ (phủ định hai lần) → **I never…** hoặc **I don't ever…**",
        "**sometimes** (thỉnh thoảng) ≠ **sometime** (một lúc nào đó): Let's meet **sometime** next week.",
        "Dùng tiếp diễn cho thói quen: ~~I am usually going to bed at 11.~~ → **I usually go to bed at 11.**",
      ],
    },
    {
      t: "rule",
      formula: "S + usually / often / never + V · S + be + usually + adj · …+ once / twice / three times + a week (cuối câu)",
      vi: "Trạng từ tần suất: TRƯỚC động từ thường, SAU be. Cụm nhiều chữ đứng cuối câu.",
    },
    {
      t: "quiz",
      id: "d10-noi-tan-suat-dich",
      title: "Dịch sang tiếng Anh — trạng từ & cụm tần suất (5 câu)",
      kind: "translate",
      grammar: "S + usually / often / rarely / never + V(s) · S + am / is / are + usually + adj · …once / twice / three times + a week / a month (cuối câu).",
      items: [
        { q: "Tôi thường đạp xe đi học.", hint: "I, usually (trước động từ), cycle / ride my bike, to school", answers: ["I usually cycle to school.", "I usually ride my bike to school.", "I usually go to school by bike.", "I usually go to school by bicycle.", "I normally cycle to school.", "I often cycle to school.", "I usually ride a bike to school."] },
        { q: "Mẹ tôi hiếm khi xem TV.", hint: "My mother, rarely / seldom (trước động từ), watches TV", answers: ["My mother rarely watches TV.", "My mother seldom watches TV.", "My mum rarely watches TV.", "My mom rarely watches TV.", "My mother hardly ever watches TV.", "My mother rarely watches television.", "My mum seldom watches TV."] },
        { q: "Sáng thứ Hai tôi thường mệt.", hint: "I am usually tired (usually SAU am), on Monday mornings", answers: ["I am usually tired on Monday mornings.", "I'm usually tired on Monday mornings.", "On Monday mornings, I am usually tired.", "On Monday mornings, I'm usually tired.", "I am often tired on Monday mornings.", "I'm often tired on Monday mornings."] },
        { q: "Tôi đi bơi hai lần một tuần.", hint: "I go swimming, twice a week (cuối câu)", answers: ["I go swimming twice a week.", "I swim twice a week."] },
        { q: "Bạn có hay ăn ngoài không?", hint: "Do you, often (sau you), eat out", answers: ["Do you often eat out?", "Do you usually eat out?", "Do you eat out often?", "Do you often go out to eat?"] },
      ],
    },

    { t: "h", text: "3. Thói quen ngày xưa: used to + V" },
    {
      t: "p",
      text: "Khi giám khảo hỏi **“Has your routine changed?”** hay **“What did you use to do when you were a child?”**, bạn cần nói về một **thói quen trong quá khứ mà bây giờ không còn nữa**. Tiếng Anh có một cấu trúc riêng cho việc này: **used to + V nguyên mẫu** (nghĩa là “trước đây thường…, nay không còn”).",
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "used to + V: lặp lại trong quá khứ, đã dừng trước bây giờ",
      marks: [
        { from: -9, to: -3, label: "I **used to** walk to school. (xưa đi bộ — nay không)", kieu: "lap", mau: 1 },
        { from: -2, to: 8, label: "Now I **cycle** to school. (nay đạp xe — hiện tại đơn)", kieu: "lap", mau: 2 },
        { from: -3, label: "I **moved** house in 2019. (quá khứ đơn — một lần; từ đó hết đi bộ)", kieu: "diem", mau: 3 },
      ],
      caption: "So sánh: used to = thói quen LẶP LẠI đã chấm dứt · quá khứ đơn = một việc xảy ra MỘT lần (hoặc kể lại) · hiện tại đơn = thói quen bây giờ.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + used to + V (nguyên mẫu)",
          vi: "Khẳng định: trước đây thường làm, bây giờ không còn. Dùng cho MỌI ngôi (I / he / they used to).",
          examples: [
            { en: "I used to play football every afternoon.", vi: "Trước đây chiều nào tôi cũng đá bóng." },
            { en: "My father used to smoke, but he gave up last year.", vi: "Bố tôi từng hút thuốc, nhưng năm ngoái ông đã bỏ." },
          ],
        },
        {
          formula: "S + didn't use to + V",
          vi: "Phủ định: sau didn't, used → use (bỏ -d).",
          examples: [
            { en: "I didn't use to like vegetables.", vi: "Trước đây tôi không thích rau." },
          ],
        },
        {
          formula: "Did + S + use to + V?",
          vi: "Câu hỏi: sau Did, cũng là use (bỏ -d).",
          examples: [
            { en: "Did you use to watch cartoons on Sunday mornings?", vi: "Hồi trước bạn có hay xem hoạt hình sáng Chủ nhật không?" },
          ],
        },
        {
          formula: "I used to + V…, but now I + V(s)… / these days I + V(s)…",
          vi: "Khung so sánh XƯA – NAY — câu ăn điểm cho mọi câu hỏi “Has… changed?”.",
          examples: [
            { en: "I used to stay up late gaming, but now I go to bed before eleven.", vi: "Trước đây tôi hay thức khuya chơi game, nhưng giờ tôi đi ngủ trước mười một giờ." },
          ],
        },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "used to + V  ≠  be used to + V-ing  ≠  get used to + V-ing",
      cols: [
        {
          title: "used to + V",
          anh: "hourglass-done",
          items: [
            "**trước đây thường** (nay không còn)",
            "I **used to** live in Hue.",
            "= Tôi **từng** sống ở Huế (giờ không).",
          ],
        },
        {
          title: "be used to + V-ing / N",
          anh: "relieved-face",
          items: [
            "**đã quen với** (thấy bình thường)",
            "I **am used to** living alone.",
            "= Tôi **đã quen** sống một mình.",
          ],
        },
        {
          title: "get used to + V-ing / N",
          anh: "persevering-face",
          items: [
            "**dần quen với** (quá trình làm quen)",
            "I'm **getting used to** waking up early.",
            "= Tôi **đang dần quen** dậy sớm.",
          ],
        },
      ],
      caption: "Mẹo: có be / get đứng trước → “quen” → theo sau là V-ing. Không có be → “từng” → theo sau là V nguyên mẫu.",
    },
    {
      t: "note",
      title: "Người Việt hay nhầm với used to",
      items: [
        "Dịch chữ “quen” thành used to: “Tôi **quen** dậy sớm rồi” ~~I used to get up early.~~ (nghĩa là: trước đây tôi hay dậy sớm, giờ thì không!) → **I'm used to getting up early.**",
        "~~I am used to get up early.~~ → **I am used to getting up early.** (sau be used to là **V-ing**, vì “to” ở đây là giới từ).",
        "~~I didn't used to~~ → **I didn't use to** (sau did/didn't bỏ -d). ~~I use to play football.~~ (nói về hiện tại) → **I usually play football.** — used to **không có thì hiện tại**.",
        "~~I used to go to Da Lat in 2018.~~ (một lần) → **I went to Da Lat in 2018.** used to chỉ dùng cho việc **lặp lại nhiều lần** hoặc trạng thái kéo dài.",
        "Phát âm: **used to** đọc /juːst tə/ — âm **/s/**, và **to** đọc nhẹ /tə/. Không đọc ~~/juːzd tuː/~~.",
      ],
    },
    {
      t: "rule",
      formula: "S + used to + V (xưa, nay hết) · S + didn't use to + V · Did + S + use to + V? · S + be used to + V-ing (đã quen)",
      vi: "Câu so sánh xưa – nay: I used to + V…, but now I + V(s)…",
    },
    {
      t: "quiz",
      id: "d10-noi-used-to-dich",
      title: "Dịch sang tiếng Anh — used to & be used to (5 câu)",
      kind: "translate",
      grammar: "S + used to + V · S + didn't use to + V · Did + S + use to + V? · S + am / is / are + used to + V-ing · I used to + V…, but now I + V(s)…",
      items: [
        { q: "Hồi nhỏ tôi thường chơi ngoài trời mỗi buổi chiều.", hint: "When I was a child / small, I used to, play outside, every afternoon", answers: ["When I was a child, I used to play outside every afternoon.", "When I was small, I used to play outside every afternoon.", "When I was young, I used to play outside every afternoon.", "I used to play outside every afternoon when I was a child.", "When I was a kid, I used to play outside every afternoon.", "When I was little, I used to play outside every afternoon.", "When I was a child I used to play outside every afternoon."] },
        { q: "Trước đây tôi không thích rau.", hint: "I, didn't use to (bỏ -d), like vegetables", answers: ["I didn't use to like vegetables.", "I did not use to like vegetables.", "I never used to like vegetables."] },
        { q: "Hồi trước bạn có hay xem hoạt hình không?", hint: "Did you, use to (bỏ -d), watch cartoons", answers: ["Did you use to watch cartoons?", "Did you use to watch cartoons when you were younger?", "Did you use to watch cartoons when you were a child?"] },
        { q: "Tôi đã quen dậy sớm.", hint: "I am used to + V-ing (getting up early)", answers: ["I am used to getting up early.", "I'm used to getting up early.", "I am used to waking up early.", "I'm used to waking up early.", "I have got used to getting up early.", "I've got used to getting up early."] },
        { q: "Trước đây tôi hay thức khuya, nhưng giờ tôi đi ngủ trước mười một giờ.", hint: "I used to stay up late, but now, I go to bed, before eleven / 11 p.m.", answers: ["I used to stay up late, but now I go to bed before eleven.", "I used to stay up late, but now I go to bed before 11.", "I used to stay up late but now I go to bed before eleven.", "I used to stay up late, but now I go to bed before 11 p.m.", "I used to stay up late, but these days I go to bed before eleven.", "I used to stay up late, but now I go to bed before eleven o'clock.", "I used to go to bed late, but now I go to bed before eleven."] },
      ],
    },

    { t: "h", text: "4. Thêm ba cách nói thói quen tự nhiên (band 5.5–6)" },
    {
      t: "table",
      head: ["Cấu trúc", "Nghĩa", "Ví dụ", "Dùng khi"],
      rows: [
        ["**tend to + V**", "có xu hướng, thường hay", "I **tend to** study better at night.", "Nói thói quen một cách **mềm**, không tuyệt đối — rất tự nhiên trong văn nói."],
        ["**be in the habit of + V-ing**", "có thói quen", "I'm **in the habit of** checking my email before breakfast.", "Nhấn mạnh **đây là một thói quen** (tốt hoặc xấu)."],
        ["**would + V** (kể chuyện xưa)", "ngày xưa hay…", "Every summer, my grandmother **would** take me to the market.", "Kể **hồi ức**, thường sau một câu **used to**. Chỉ dùng cho **hành động**, không cho trạng thái: ~~I would live in Hue~~ → I **used to** live in Hue."],
        ["**These days / Nowadays, S + V(s)**", "dạo này, ngày nay", "**These days**, I mostly read on my phone.", "Mở vế **bây giờ** sau khi đã nói chuyện xưa."],
      ],
    },
    {
      t: "rule",
      formula: "I tend to + V · I'm in the habit of + V-ing · I used to + V… and I would + V… · These days, I + V(s)…",
      vi: "Thay “I usually” lặp đi lặp lại bằng các cụm này để lên band Lexical Resource.",
    },

    { t: "h", text: "5. Công thức trả lời câu hỏi thói quen" },
    {
      t: "sodo",
      kind: "flow",
      title: "3–4 câu cho mỗi câu hỏi thói quen",
      steps: [
        { label: "Tần suất / câu trả lời thẳng", sub: "I usually… / I go… twice a week." },
        { label: "Chi tiết", sub: "khi nào · ở đâu · với ai · làm thế nào" },
        { label: "Lý do / cảm xúc", sub: "because… / It helps me… / I find it…" },
        { label: "(Xưa – nay)", sub: "I used to…, but now… — nếu hợp câu hỏi" },
      ],
    },
    {
      t: "dialogue",
      title: "Routines & Habits — câu trả lời mẫu band 5–5.5",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you usually get up early?" },
        { who: "Candidate", role: "candidate", text: "Yes, I usually get up at around six on weekdays. I live quite far from my university, so I need time to have breakfast and catch the bus. At weekends, though, I tend to sleep in until eight.", vi: "Có, ngày thường tôi hay dậy khoảng sáu giờ. Tôi sống khá xa trường nên cần thời gian ăn sáng và bắt xe buýt. Còn cuối tuần thì tôi hay ngủ nướng đến tám giờ." },
        { who: "Examiner", role: "examiner", text: "How often do you exercise?" },
        { who: "Candidate", role: "candidate", text: "I go jogging three times a week, usually in the park near my house. I go with my roommate, because it's easier to keep going when you have a partner. After a run, I always feel more awake.", vi: "Tôi chạy bộ ba lần một tuần, thường ở công viên gần nhà. Tôi đi cùng bạn cùng phòng, vì có bạn đồng hành thì dễ duy trì hơn. Chạy xong lúc nào tôi cũng thấy tỉnh táo hơn." },
        { who: "Examiner", role: "examiner", text: "Has your daily routine changed since you were a child?" },
        { who: "Candidate", role: "candidate", text: "Yes, quite a lot. I used to walk to primary school with my grandmother, and we would stop to buy sticky rice on the way. These days I have to catch a bus at half past six, so I hardly ever have time for a proper breakfast.", vi: "Có, khá nhiều. Hồi tiểu học tôi hay đi bộ đến trường với bà, và hai bà cháu hay dừng lại mua xôi dọc đường. Bây giờ tôi phải bắt xe buýt lúc sáu rưỡi nên hầu như chẳng bao giờ có thời gian ăn sáng đàng hoàng." },
        { who: "Examiner", role: "examiner", text: "Do you have any bad habits?" },
        { who: "Candidate", role: "candidate", text: "Unfortunately, yes. I'm in the habit of checking my phone as soon as I wake up, and sometimes I spend twenty minutes scrolling before I even get out of bed. I'm trying to change it by leaving my phone in the kitchen at night.", vi: "Tiếc là có. Tôi có thói quen kiểm tra điện thoại ngay khi vừa thức dậy, và có khi lướt hai mươi phút trước cả khi ra khỏi giường. Tôi đang cố sửa bằng cách để điện thoại ở bếp vào ban đêm." },
        { who: "Examiner", role: "examiner", text: "What did you use to do in your free time when you were younger?" },
        { who: "Candidate", role: "candidate", text: "When I was about ten, I used to play football in the street with the other kids in my neighbourhood almost every evening. We didn't use to have smartphones, so we spent hours outside. I really miss that now.", vi: "Hồi khoảng mười tuổi, gần như tối nào tôi cũng đá bóng ngoài đường với lũ trẻ trong xóm. Hồi đó chúng tôi không có điện thoại thông minh nên ở ngoài trời hàng giờ. Giờ tôi thật sự nhớ những ngày đó." },
        { who: "Examiner", role: "examiner", text: "Is there a habit you would like to start?" },
        { who: "Candidate", role: "candidate", text: "Yes, I'd love to start reading in English every day, even for just ten minutes. I think it would improve my vocabulary, and it's a better way to relax than watching short videos.", vi: "Có, tôi rất muốn bắt đầu đọc tiếng Anh mỗi ngày, dù chỉ mười phút. Tôi nghĩ việc đó sẽ cải thiện vốn từ, và là cách thư giãn tốt hơn xem video ngắn." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao các câu trả lời trên ăn điểm",
      items: [
        "Câu nào cũng **trả lời thẳng trước** (Yes, I usually… / I go jogging three times a week) rồi mới thêm chi tiết.",
        "**Đa dạng cách nói thói quen**: usually · tend to · always · hardly ever · I'm in the habit of · used to · would · these days — không lặp lại “usually” năm lần.",
        "**Chi tiết cụ thể** (six o'clock, three times a week, sticky rice, twenty minutes, ten minutes) làm câu trả lời **đáng tin** và tự nhiên.",
        "Câu “Has… changed?” trả lời **đủ hai vế**: xưa (used to… would…) và nay (These days…).",
        "Câu “Is there a habit you would like to start?” dùng **I'd love to + V** và **it would + V** — nói về điều **chưa xảy ra**.",
      ],
    },
    {
      t: "mcq",
      id: "d10-noi-chon",
      title: "Chọn câu đúng — thói quen & used to (6 câu)",
      items: [
        { q: "Câu nào đúng?", options: ["I go usually to bed at eleven.", "I usually go to bed at eleven.", "I usually am going to bed at eleven."], correct: 1, why: "Trạng từ tần suất đứng **trước động từ thường** (usually go); thói quen dùng **hiện tại đơn**, không dùng tiếp diễn." },
        { q: "Câu nào đúng?", options: ["She is often late for class.", "She often is late for class.", "She is late often for class."], correct: 0, why: "Với **be**, trạng từ đứng **sau be**: She **is often** late." },
        { q: "“Tôi đã quen ăn cay rồi.”", options: ["I used to eat spicy food.", "I am used to eat spicy food.", "I am used to eating spicy food."], correct: 2, why: "“Đã quen với” = **be used to + V-ing**. Câu 1 nghĩa là “trước đây tôi hay ăn cay (giờ không)”; câu 2 sai dạng động từ." },
        { q: "Examiner: “Did you use to read comics?” — câu trả lời nào đúng?", options: ["Yes, I used to read them every weekend.", "Yes, I use to read them every weekend.", "Yes, I was used to read them every weekend."], correct: 0, why: "Câu khẳng định: **used to + V** (có -d). **use to** chỉ đi sau **did / didn't**." },
        { q: "Chọn cụm đúng: “I visit my grandparents ___.”", options: ["two times a month", "two time in a month", "twice a month"], correct: 2, why: "**once** = 1 lần, **twice** = 2 lần, từ 3 trở lên mới dùng **times**. Tự nhiên nhất: **twice a month**." },
        { q: "Câu nào **không** đúng?", options: ["Every summer, we would swim in the river.", "I would live in a small village.", "I used to live in a small village."], correct: 1, why: "**would** (kể chuyện xưa) chỉ dùng cho **hành động lặp lại** (swim), không dùng cho **trạng thái** như live, have, like. Phải dùng **used to live**." },
      ],
    },

    { t: "h", text: "6. Nâng lên band 6–6.5 (phần thêm)" },
    {
      t: "dialogue",
      title: "Hai câu trả lời nâng cấp",
      lines: [
        { who: "Examiner", role: "examiner", text: "How often do you use social media?" },
        { who: "Candidate", role: "candidate", text: "Honestly, far more often than I'd like to admit. I tend to check Facebook whenever I'm waiting for something, like a bus or a lift, so it probably adds up to a couple of hours a day. I've recently started turning off notifications, which has helped a little.", vi: "Thật lòng thì thường xuyên hơn tôi muốn thừa nhận nhiều. Tôi hay kiểm tra Facebook mỗi khi phải chờ cái gì đó, như chờ xe buýt hay thang máy, nên cộng lại chắc cũng vài tiếng mỗi ngày. Gần đây tôi bắt đầu tắt thông báo, việc đó cũng đỡ được phần nào." },
        { who: "Examiner", role: "examiner", text: "Has your daily routine changed since you were a child?" },
        { who: "Candidate", role: "candidate", text: "Completely. As a kid, my days used to revolve around school and playing outside — I'd be home by five and asleep by nine. Now that I'm at university, my schedule is all over the place: some days I start at seven, other days I don't have class until the afternoon, so I've had to get used to planning each day separately.", vi: "Hoàn toàn khác. Hồi nhỏ, ngày của tôi chỉ xoay quanh việc đi học và chơi ngoài trời — năm giờ là đã ở nhà và chín giờ là ngủ rồi. Giờ lên đại học, lịch của tôi lộn xộn hẳn: có hôm bắt đầu từ bảy giờ, có hôm tới chiều mới có tiết, nên tôi đã phải tập quen với việc lên kế hoạch riêng cho từng ngày." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao hai câu trên lên được band 6–6.5",
      items: [
        "**Cụm tự nhiên**: far more often than I'd like to admit (thường hơn tôi muốn thừa nhận), adds up to (cộng lại thành), revolve around (xoay quanh), all over the place (lộn xộn).",
        "**Ngữ pháp đa dạng** trong cùng một câu trả lời: tend to · whenever · which has helped (mệnh đề quan hệ) · used to + I'd (= I would) · Now that… · have had to **get used to + V-ing**.",
        "Vẫn chỉ **3 câu, khoảng 25–30 giây** — Part 1 không cần dài, cần **tự nhiên và chính xác**.",
      ],
    },

    { t: "h", text: "7. Phát âm: used to /juːst tə/ và âm /ʒ/ trong usually" },
    {
      t: "p",
      text: "Hai lỗi phát âm hay gặp nhất khi nói về thói quen: (1) đọc **used to** thành ~~“du-dờ tu”~~ /juːzd tuː/ — đúng ra là /juːst tə/, âm **/s/** chứ không phải /z/, và **to** đọc rất nhẹ /tə/; (2) đọc **usually** thành ~~“du-du-a-li”~~ — chữ **s** ở giữa là âm **/ʒ/**: môi hơi tròn, đẩy hơi qua khe lưỡi như /ʃ/ (âm “s” nặng) nhưng **rung dây thanh**. Tiếng Việt không có âm này; gần nhất là “gi” đọc kéo dài và có hơi.",
    },
    {
      t: "table",
      head: ["Âm / từ", "Cách đọc", "Từ cùng âm"],
      rows: [
        ["**used to** (từng)", "/juːst tə/ — hai chữ đọc liền “dúst-tờ”", "I used to… / She used to… / Did you use to…? (/juːs tə/)"],
        ["**use** (động từ: dùng)", "/juːz/ — âm /z/", "I use a laptop. — khác hẳn **used to** /juːst/"],
        ["**/ʒ/**", "như /ʃ/ (she) nhưng **rung cổ họng**", "**usually** /juːʒuəli/ · **leisure** /leʒə/ · **television** /telɪvɪʒn/ · **decision** /dɪsɪʒn/ · **pleasure** /pleʒə/ · **measure** /meʒə/"],
      ],
    },
    {
      t: "phatam",
      id: "d10-phat-am",
      title: "Luyện phát âm — used to và âm /ʒ/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Với used to: đọc /s/ (không /z/), “to” thật nhẹ /tə/. Với /ʒ/: đặt lưỡi như khi nói “she”, rồi rung cổ họng.",
      items: [
        { text: "usually, leisure, television", ipa: "juːʒuəli leʒə telɪvɪʒn", vi: "/ʒ/ trong cả ba từ" },
        { text: "decision, pleasure, measure", ipa: "dɪsɪʒn pleʒə meʒə", vi: "/ʒ/ — rung cổ họng" },
        { text: "use, used to", ipa: "juːz juːst tə", vi: "/z/ trong use ≠ /st/ trong used to" },
        { text: "I used to walk to school.", ipa: "aɪ juːst tə wɔːk tə skuːl", vi: "used to = /juːst tə/" },
        { text: "Did you use to play outside?", ipa: "dɪd juː juːs tə pleɪ aʊtsaɪd", vi: "use to sau did = /juːs tə/" },
        { text: "I usually read the news at breakfast.", ipa: "aɪ juːʒuəli riːd ðə njuːz ət brekfəst", vi: "/ʒ/ trong usually · /ð/ trong the" },
        { text: "I'm used to getting up early.", ipa: "aɪm juːst tə ɡetɪŋ ʌp ɜːli", vi: "be used to + V-ing" },
        { text: "I watch television in my leisure time.", ipa: "aɪ wɒtʃ telɪvɪʒn ɪn maɪ leʒə taɪm", vi: "hai âm /ʒ/ trong một câu" },
      ],
    },

    { t: "h", text: "8. Luyện nói" },
    {
      t: "p",
      text: "Nghe từng câu hỏi, ghi âm câu trả lời **3–4 câu** theo công thức **tần suất → chi tiết → lý do / cảm xúc → (xưa – nay)**, rồi để AI chấm. Cố dùng ít nhất **một lần used to** và **một trạng từ tần suất khác usually**.",
    },
    {
      t: "speak",
      id: "d10-noi-luyen",
      part: "1",
      questions: [
        "Do you usually get up early?",
        "How often do you exercise?",
        "What do you normally do in the evening?",
        "Has your daily routine changed since you were a child?",
        "What did you use to do in your free time when you were younger?",
        "Do you have any bad habits?",
        "How often do you use social media?",
        "Is there a habit you would like to start?",
      ],
    },

    { t: "h", text: "9. Part 2 nhập môn: Describe your daily routine — nói 1 phút" },
    {
      t: "p",
      text: "**Phần thêm — làm quen Part 2.** Ở Ngày 2 bạn đã biết Speaking có 3 phần. **Part 2** là phần **độc thoại**: giám khảo đưa một **thẻ đề (cue card)**, cho **1 phút chuẩn bị** với giấy bút, rồi bạn tự nói **1–2 phút** không ngừng. Ngày 14 sẽ luyện trọn Part 2 (nói đủ 2 phút, kể chuyện quá khứ). Hôm nay làm quen trước với đề **dễ nhất** — **thói quen hằng ngày** — vì nó dùng đúng ngữ pháp vừa học: **hiện tại đơn + trạng từ tần suất**. Đích hôm nay: **nói liền 1 phút** (khoảng 100–130 từ) mà không dừng lâu.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Một lượt Part 2 — bản tập hôm nay",
      steps: [
        { label: "Đọc thẻ đề", sub: "1 chủ đề + 4 dòng: You should say… and explain…" },
        { label: "1 phút ghi chú", sub: "từ khoá, con số, ký hiệu — không viết câu" },
        { label: "Nói 1 phút", sub: "mở 1 câu → 3 dòng đầu → dòng explain" },
        { label: "Ngày 14", sub: "kéo dài từng phần để nói đủ 2 phút" },
      ],
      caption: "Trong phòng thi bạn được nói tối đa 2 phút; giám khảo không ngắt lời cho tới khi hết giờ. Nói dưới 1 phút là mất điểm Fluency.",
    },
    {
      t: "p",
      text: "**Thẻ đề:** **Describe your daily routine.** You should say: ① **what time** you usually get up · ② **what** you do in the morning · ③ **what** you do in the afternoon and evening · and ④ **explain** which part of the day you enjoy most.",
    },
    {
      t: "table",
      caption: "Đọc thẻ đề: mỗi dòng là một phần của bài nói",
      head: ["Dòng trên thẻ", "Trả lời bằng", "Câu mẫu"],
      rows: [
        ["① **what time** you usually get up", "hiện tại đơn + **at** + giờ", "On weekdays, I **usually get up at** half past six."],
        ["② **what** you do in the morning", "chuỗi việc nối bằng First · Then · After that", "**First**, I have a quick shower. **Then** I have breakfast…"],
        ["③ **what** you do in the afternoon and evening", "trạng từ / cụm tần suất + nơi chốn", "In the afternoon, I **often** study in the library."],
        ["④ and **explain** which part of the day you enjoy most", "enjoy / like + lý do (because…)", "I **enjoy** the evening **most, because** I can relax."],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: Part 2 khác Part 1 thế nào",
      items: [
        "**Part 1**: nhiều câu hỏi ngắn, mỗi câu trả lời 2–4 câu. **Part 2**: **một** thẻ đề, bạn tự nói **một mạch**, không có ai hỏi xen vào.",
        "Động từ trên thẻ quyết định thì: “Describe **your daily routine**” / “a place you **often** visit” → **hiện tại đơn**; “Describe a time when you **learned**…” (Ngày 14) → **quá khứ đơn**.",
        "Dòng **and explain…** là dòng **quan trọng nhất** (nói cảm xúc, lý do) — nhưng cũng là dòng hay bị quên nhất vì nó nằm cuối.",
      ],
    },
    {
      t: "p",
      text: "Cụm từ dưới đây là “gạch” để xây bài nói về một ngày của bạn. Bấm 🔊 nghe, rồi dùng nút che nghĩa để tự kiểm tra.",
    },
    {
      t: "vocab",
      items: [
        { w: "wake up", pos: "phr v", ipa: "/ˌweɪk ˈʌp/", vi: "tỉnh giấc", ex: "I usually wake up before my alarm goes off.", exVi: "Tôi thường tỉnh giấc trước khi chuông báo thức reo.", more: "**wake up** = mở mắt, tỉnh dậy (có thể vẫn nằm trên giường) ≠ **get up** = ra khỏi giường. Quá khứ: **woke up**." },
        { w: "get up", pos: "phr v", ipa: "/ˌɡet ˈʌp/", vi: "thức dậy, ra khỏi giường", ex: "On weekdays, I get up at half past six.", exVi: "Ngày thường tôi dậy lúc sáu rưỡi.", more: "**get up early / late** · cuối tuần ngủ nướng: **sleep in** (I tend to **sleep in** on Sundays)." },
        { w: "set an alarm", pos: "phr", ipa: "/ˌset ən əˈlɑːm/", vi: "đặt chuông báo thức", ex: "I always set two alarms because I'm a heavy sleeper.", exVi: "Tôi luôn đặt hai cái báo thức vì tôi ngủ rất say.", more: "**alarm** /əˈlɑːm/ nhấn âm tiết **thứ hai**. Chuông reo: **the alarm goes off** · tắt: **turn off the alarm**." },
        { w: "have a shower", pos: "phr", ipa: "/ˌhæv ə ˈʃaʊə(r)/", vi: "tắm (bằng vòi sen)", ex: "First, I have a quick shower to wake myself up.", exVi: "Đầu tiên, tôi tắm nhanh cho tỉnh ngủ.", more: "Anh-Anh **have a shower**, Anh-Mỹ **take a shower**. Tắm bồn: **have a bath**." },
        { w: "get dressed", pos: "phr", ipa: "/ˌɡet ˈdrest/", vi: "mặc quần áo, thay đồ", ex: "After breakfast, I get dressed and leave the house.", exVi: "Ăn sáng xong, tôi thay đồ rồi ra khỏi nhà.", more: "Không nói ~~I dress my clothes~~. Mặc **một món** cụ thể: **put on** a jacket." },
        { w: "take a nap", pos: "phr", ipa: "/ˌteɪk ə ˈnæp/", vi: "chợp mắt, ngủ ngắn ban ngày", ex: "Many Vietnamese students take a short nap after lunch.", exVi: "Nhiều học sinh Việt Nam ngủ trưa một lát sau bữa trưa.", more: "= **have a nap**. **a power nap** = giấc chợp mắt 15–20 phút cho tỉnh táo." },
        { w: "stay up late", pos: "phr", ipa: "/ˌsteɪ ʌp ˈleɪt/", vi: "thức khuya", ex: "I sometimes stay up late to finish my homework.", exVi: "Thỉnh thoảng tôi thức khuya để làm xong bài tập.", more: "≠ **get up late** (dậy muộn). Thức thâu đêm: **stay up all night**." },
        { w: "go to bed", pos: "phr", ipa: "/ˌɡəʊ tə ˈbed/", vi: "đi ngủ (lên giường)", ex: "I usually go to bed at around eleven.", exVi: "Tôi thường đi ngủ khoảng mười một giờ.", more: "**go to bed** (lên giường) ≠ **fall asleep** (ngủ thiếp đi). Không có **the**: ~~go to the bed~~." },
      ],
    },
    {
      t: "p",
      text: "**Ghi chú trong 1 phút.** Bạn có đúng 1 phút và một tờ giấy. Đừng viết câu — ghi **từ khoá, con số, ký hiệu** theo **sơ đồ ý**: chủ đề ở giữa, mỗi dòng của thẻ là một nhánh, thêm một nhánh “từ muốn dùng”. Ngày 14 sẽ luyện kỹ cách này với chuyện quá khứ; hôm nay tập trước với thói quen.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú mẫu trong 1 phút — Describe your daily routine",
      center: "**My daily routine**",
      branches: [
        { label: "① Get up", items: ["6.30 — weekdays", "2 alarms"], anh: "alarm-clock" },
        { label: "② Morning", items: ["shower → dressed", "breakfast w/ mum — banh mi", "bus → uni · class 8"], anh: "bus" },
        { label: "③ Afternoon / evening", items: ["library", "jog 3x/week", "dinner — family", "bed ~11"], anh: "books" },
        { label: "④ Explain: best part", items: ["evening", "relax + talk w/ family", "day = busy"], anh: "house" },
        { label: "Từ muốn dùng", items: ["usually · often · always", "three times a week", "First → Then → After that"], anh: "memo" },
      ],
      caption: "Đây là TOÀN BỘ ghi chú. Ký hiệu cho nhanh: → (rồi, sau đó) · w/ (with) · 3x/week (ba lần một tuần) · ~ (khoảng).",
    },
    {
      t: "note",
      title: "Mẹo ghi chú 1 phút",
      items: [
        "Ghi nhánh **④ explain** trước tiên — dòng này hay bị quên nhất mà lại là dòng ăn điểm.",
        "Mỗi nhánh **2–4 từ khoá**. Ghi bằng tiếng Anh nếu được (lúc nói đỡ phải dịch); không nhớ từ thì ghi tiếng Việt cũng được.",
        "Ghi **số và giờ** (6.30, 8, ~11): vừa nhanh, vừa nhắc bạn dùng **at + giờ**.",
        "Hết 1 phút mà chưa ghi xong cũng không sao: bắt đầu nói, đi lần lượt từng nhánh ① → ④.",
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Khung bài nói 1 phút",
      steps: [
        { label: "Mở — 1 câu", sub: "I'd like to talk about my daily routine on a normal weekday." },
        { label: "① Giờ dậy", sub: "I usually get up at… (+ một chi tiết)" },
        { label: "② Buổi sáng", sub: "First… Then… After that…" },
        { label: "③ Chiều – tối", sub: "In the afternoon, I often… In the evening…" },
        { label: "④ Explain", sub: "I enjoy… most, because…" },
      ],
      caption: "Mỗi phần 1–3 câu là đủ 1 phút. Ngày 14: kéo dài từng phần để nói đủ 2 phút.",
    },
    {
      t: "rule",
      formula: "Mở: I'd like to talk about… · I usually get up at… · First… Then… After that… · In the afternoon / evening, I often + V… · I enjoy… most, because + S + V…",
      vi: "Part 2 về thói quen → hiện tại đơn suốt bài; trả lời đủ 4 dòng, đúng thứ tự trên thẻ.",
    },
    {
      t: "canh",
      anh: ["alarm-clock", "bus", "books", "person-running"],
      caption: "Một ngày thường của một sinh viên: hai cái báo thức lúc sáu rưỡi, xe buýt tới trường, buổi chiều ở thư viện, mỗi tuần ba buổi chạy bộ trong công viên, buổi tối ăn cơm cùng gia đình.",
    },
    {
      t: "dialogue",
      title: "Part 2 — Describe your daily routine (bài mẫu ≈ 1 phút · 123 từ · band ~4.5–5)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Now, I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. Here's your topic: describe your daily routine." },
        { who: "Candidate", role: "candidate", text: "I'd like to talk about my daily routine on a normal weekday.", vi: "Tôi muốn nói về nếp sinh hoạt của mình vào một ngày thường trong tuần." },
        { who: "Candidate", role: "candidate", text: "I usually get up at half past six, and I always set two alarms.", vi: "Tôi thường dậy lúc sáu rưỡi, và lúc nào tôi cũng đặt hai cái báo thức." },
        { who: "Candidate", role: "candidate", text: "First, I have a quick shower and get dressed. Then I have breakfast with my mum, usually banh mi. After that, I take the bus to university. My classes start at eight.", vi: "Đầu tiên, tôi tắm nhanh rồi thay đồ. Sau đó tôi ăn sáng với mẹ, thường là bánh mì. Rồi tôi bắt xe buýt đến trường. Tiết học của tôi bắt đầu lúc tám giờ." },
        { who: "Candidate", role: "candidate", text: "In the afternoon, I often study in the library. Three times a week, I go jogging in the park, and in the evening I have dinner with my family. I usually go to bed at around eleven.", vi: "Buổi chiều, tôi hay học ở thư viện. Mỗi tuần ba lần, tôi chạy bộ trong công viên, và buổi tối tôi ăn cơm với gia đình. Tôi thường đi ngủ khoảng mười một giờ." },
        { who: "Candidate", role: "candidate", text: "I enjoy the evening most, because I can relax and talk with my family. During the day I'm always busy, so dinner time is really special for me.", vi: "Tôi thích buổi tối nhất, vì tôi được thư giãn và trò chuyện với gia đình. Ban ngày lúc nào tôi cũng bận, nên bữa tối thật sự đặc biệt với tôi." },
      ],
    },
    {
      t: "table",
      caption: "Phân tích bài mẫu theo 4 tiêu chí chấm Speaking",
      head: ["Tiêu chí", "Bài mẫu làm được", "Vì sao mới ~4.5–5"],
      rows: [
        ["**Fluency & Coherence** (trôi chảy, mạch lạc)", "Đi đúng thứ tự 4 dòng của thẻ; có câu mở và câu kết; từ nối thời gian First · Then · After that · In the afternoon · in the evening.", "Câu ngắn, từ nối đơn giản; mỗi ý chưa được mở rộng (vì sao, so với trước kia)."],
        ["**Lexical Resource** (từ vựng)", "Cụm thói quen đúng collocation: set two alarms · have a quick shower · get dressed · take the bus · go jogging · go to bed.", "Toàn từ phổ thông; thêm tend to, I'm in the habit of (mục 4) hay một chi tiết riêng là lên điểm."],
        ["**Grammatical Range & Accuracy** (ngữ pháp)", "Hiện tại đơn đúng suốt bài; trạng từ tần suất đúng chỗ (usually get up · often study · I'm always busy); cụm tần suất cuối câu hoặc đầu câu (three times a week); at + giờ.", "Phần lớn là câu đơn nối bằng and / because / so; chưa có câu phức kiểu When I get home, I… hay used to (mục 3)."],
        ["**Pronunciation** (phát âm)", "Nhiều chỗ để luyện: usually /ˈjuːʒuəli/ (mục 7) · đuôi -es của classes /ˈklɑːsɪz/ · nối âm get_up, have_a.", "Điểm phát âm là của **bạn** khi đọc lại: giữ âm cuối, -s, /ʒ/."],
        ["**Trả lời đủ thẻ đề**", "① 6.30 ✓ · ② shower, breakfast, bus ✓ · ③ library, jogging, dinner ✓ · ④ evening + lý do ✓", "Mỗi dòng mới 1–3 câu: đủ 1 phút, chưa đủ 2 phút (việc của Ngày 14)."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: hết ý trước 1 phút thì nói thêm gì?",
      items: [
        "Thêm **cuối tuần khác ngày thường**: At weekends, it's different. I tend to sleep in until nine…",
        "Thêm **xưa – nay** (mục 3): When I was in high school, I used to get up at five, but now…",
        "Thêm **một chi tiết cụ thể**: con số, tên món ăn, tên nơi chốn (the library on the third floor, a bowl of pho).",
        "Đừng im lặng: nối bằng **Another thing is that…** / **Oh, and I forgot to say…** rồi nói tiếp.",
      ],
    },
    {
      t: "p",
      text: "**Tự ghi âm — bắt buộc.** Đọc thẻ đề, bấm giờ **1 phút ghi chú** trên giấy, rồi ghi âm và nói tới khi được **ít nhất 1 phút**. Nghe lại, rồi **ghi lần 2** ngay sau khi đã sửa 1–2 lỗi vừa thấy. Giữ lại bản ghi: tới Ngày 14 nghe lại để thấy mình đã tiến bộ thế nào. Thẻ thứ hai (cuối tuần) để luyện thêm cùng khung.",
    },
    {
      t: "note",
      title: "Mẹo: tự nghe lại bản ghi âm",
      items: [
        "Có trả lời **đủ 4 dòng** của thẻ không? Dòng **explain** có lý do (because…) chưa?",
        "Động từ ngôi thứ ba có **-s** chưa (My class **starts**…)? Trạng từ tần suất đứng **trước** động từ thường chưa?",
        "Có chỗ nào **im lặng quá 3 giây** không? Ghi lại chỗ đó — lần sau chuẩn bị sẵn một câu nối.",
        "Nói **dưới 45 giây** → thêm ý theo mẹo ở trên; nói **quá 1 phút 30** cũng tốt — bạn đã sẵn sàng cho Ngày 14.",
      ],
    },
    {
      t: "speak",
      id: "d10-noi-p2",
      part: "2",
      questions: [
        "Describe your daily routine. You should say: what time you usually get up; what you do in the morning; what you do in the afternoon and evening; and explain which part of the day you enjoy most.",
        "Describe what you usually do at the weekend. You should say: what time you get up at the weekend; what you do on Saturday; what you do on Sunday; and explain why you enjoy your weekends.",
      ],
    },
  ],
};

/* ─────────────────────────── Homework ─────────────────────────── */

const D10_HOMEWORK: Lesson = {
  id: "d10-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 10",
  goal: "Tự kiểm tra Ngày 10: 8 câu dịch có gợi ý, 8 câu trắc nghiệm (Matching Features, used to, kết bài), 10 câu điền / chia động từ, 4 câu ghép trật tự trạng từ, và viết một kết bài hoàn chỉnh cho AI chấm — 30 câu có đáp án.",
  minutes: 40,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần I — Dịch Việt → Anh** (8 câu): trạng từ tần suất, used to, kết bài. Bí thì bấm 💡.",
        "**Phần II — Trắc nghiệm** (8 câu): bẫy Matching Features, used to / be used to, chọn kết bài.",
        "**Phần III — Điền / chia** (10 câu): once / twice / times, used to / be used to + V-ing, từ nối.",
        "**Phần IV — Ghép câu** (4 câu): đặt trạng từ tần suất đúng chỗ.",
        "**Phần V — Viết**: một **kết bài** 35–50 từ cho đề cho sẵn.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 10 trong một hình",
      center: "**Ngày 10**",
      branches: [
        { label: "Đọc: Matching Features", items: ["Quét & khoanh **tên** trước", "Câu hỏi **không theo thứ tự**", "**NB**: chữ cái dùng nhiều lần", "Ý của AI? → chủ ngữ của says / found"] },
        { label: "Viết: kết bài & cả bài", items: ["In conclusion, + quan điểm (lời khác)", "+ tóm tắt 2 lý do", "Không ý mới · không ví dụ mới", "40′: 5 dàn ý · 5 mở · 20 thân · 5 kết · 5 soát"] },
        { label: "Nói: thói quen", items: ["usually + V · be + usually", "once / twice / three times a week", "used to + V ≠ be used to + V-ing", "I used to…, but now I…"] },
      ],
    },

    { t: "h", text: "Phần I — Dịch Việt → Anh (8 câu)" },
    {
      t: "quiz",
      id: "d10-bt-dich",
      title: "Phần I — Dịch sang tiếng Anh (8 câu)",
      kind: "translate",
      grammar: "S + usually / often / never + V · S + be + usually + adj · once / twice / three times + a week · S + used to + V · S + be used to + V-ing · In conclusion, I firmly believe that + S + V.",
      items: [
        { q: "Anh trai tôi luôn uống cà phê sau bữa trưa.", hint: "My brother, always (trước động từ), drinks coffee, after lunch", answers: ["My brother always drinks coffee after lunch.", "My older brother always drinks coffee after lunch.", "My elder brother always drinks coffee after lunch.", "My big brother always drinks coffee after lunch.", "My brother always has coffee after lunch."] },
        { q: "Tôi hầu như không bao giờ ăn đồ ăn nhanh.", hint: "I, hardly ever, eat fast food", answers: ["I hardly ever eat fast food.", "I rarely eat fast food.", "I almost never eat fast food.", "I seldom eat fast food."] },
        { q: "Xe buýt thường đông vào buổi sáng.", hint: "The bus, is usually (usually sau is), crowded, in the morning", answers: ["The bus is usually crowded in the morning.", "The bus is usually crowded in the mornings.", "The buses are usually crowded in the morning.", "The bus is often crowded in the morning.", "The buses are usually crowded in the mornings.", "In the morning, the bus is usually crowded."] },
        { q: "Chúng tôi đi siêu thị một lần một tuần.", hint: "We go to the supermarket, once a week", answers: ["We go to the supermarket once a week.", "We go shopping at the supermarket once a week.", "We go to the supermarket once every week."] },
        { q: "Hồi nhỏ em gái tôi từng sợ chó.", hint: "When she was small / little, my sister, used to be afraid of / scared of, dogs", answers: ["When she was small, my sister used to be afraid of dogs.", "When she was little, my sister used to be afraid of dogs.", "My sister used to be afraid of dogs when she was small.", "My sister used to be afraid of dogs when she was little.", "When she was young, my sister used to be afraid of dogs.", "My sister used to be scared of dogs when she was little.", "When she was small, my sister used to be scared of dogs.", "My younger sister used to be afraid of dogs when she was small.", "My little sister used to be afraid of dogs when she was small."] },
        { q: "Bây giờ tôi đã quen làm việc ở nhà.", hint: "Now, I am used to + V-ing (working from home / at home)", answers: ["Now I am used to working from home.", "Now I'm used to working from home.", "Now I am used to working at home.", "Now I'm used to working at home.", "I am used to working from home now.", "I'm used to working from home now.", "Now, I'm used to working from home.", "Now, I am used to working from home."] },
        { q: "Tóm lại, tôi tin chắc rằng học sinh nên đi bộ hoặc đạp xe đến trường.", hint: "In conclusion, I firmly believe that, students should, walk or cycle, to school", answers: ["In conclusion, I firmly believe that students should walk or cycle to school.", "In conclusion, I firmly believe students should walk or cycle to school.", "To conclude, I firmly believe that students should walk or cycle to school.", "In conclusion, I strongly believe that students should walk or cycle to school.", "In conclusion, I firmly believe that students should walk or ride a bike to school.", "In conclusion, I firmly believe that students should walk or ride their bikes to school."] },
        { q: "Nó tốt cho sức khoẻ, và nó cũng giảm ô nhiễm không khí.", hint: "It is good for health, and it also reduces, air pollution", answers: ["It is good for health, and it also reduces air pollution.", "It is good for their health, and it also reduces air pollution.", "It is good for health and it also reduces air pollution.", "It's good for health, and it also reduces air pollution.", "It is good for our health, and it also reduces air pollution.", "It is healthy, and it also reduces air pollution.", "It is good for health, and it also cuts air pollution."] },
      ],
    },

    { t: "h", text: "Phần II — Trắc nghiệm (8 câu)" },
    {
      t: "p",
      text: "Câu 1–3 dựa trên đoạn văn ngắn sau. **A** Dr Kate Lin · **B** Professor Omar Said · **C** Dr Ivan Novak.",
    },
    {
      t: "passage",
      title: "Learning a Language at Any Age",
      paras: [
        { label: "A", text: "Dr Kate Lin believes that adults can learn pronunciation as well as children if they practise every day. Professor Omar Said disagrees. In his view, adults rarely lose their accent completely, although they often learn grammar faster than children do." },
        { label: "B", text: "Dr Ivan Novak, who studies memory, points out that Lin's learners practised with a teacher, not alone. He found that people who study alone forget new words much more quickly than people who study in groups." },
      ],
    },
    {
      t: "mcq",
      id: "d10-bt-chon",
      title: "Phần II — Trắc nghiệm (8 câu)",
      items: [
        { q: "(1) Which researcher says that adults may learn grammar more quickly than children?", options: ["A Lin", "B Said", "C Novak"], correct: 1, why: "“In **his** view (Said)… they often **learn grammar faster** than children do.” faster = **more quickly**." },
        { q: "(2) Which researcher found that studying with other people helps learners remember vocabulary?", options: ["A Lin", "B Said", "C Novak"], correct: 2, why: "**He (Novak) found** that people who study alone **forget new words** much more quickly than people who study **in groups**. Bẫy: tên **Lin's** có trong câu trước nhưng chỉ là người bị nhắc tới." },
        { q: "(3) Which researcher thinks that daily practice is the key for adults?", options: ["A Lin", "B Said", "C Novak"], correct: 0, why: "Dr Kate **Lin** believes adults can learn pronunciation as well as children **if they practise every day**. every day = **daily**." },
        { q: "(4) Trong Matching Features, dòng “NB You may use any letter more than once” nghĩa là gì?", options: ["Một chữ cái có thể là đáp án của nhiều câu", "Mỗi chữ cái dùng đúng một lần", "Có thể chọn hai chữ cái cho một câu"], correct: 0, why: "**NB** = lưu ý. Một người có thể là đáp án cho **nhiều câu**, và có người **không** là đáp án câu nào. Mỗi câu vẫn chỉ có **một** chữ cái." },
        { q: "(5) “Tôi đã quen với tiếng ồn của thành phố.”", options: ["I used to the noise of the city.", "I use to the noise of the city.", "I am used to the noise of the city."], correct: 2, why: "“Đã quen với” = **be used to + N / V-ing**: I **am used to** the noise." },
        { q: "(6) Câu nào nói đúng ý “Trước đây tôi sống ở nông thôn (giờ không còn)”?", options: ["I used to live in the countryside.", "I am used to living in the countryside.", "I would live in the countryside."], correct: 0, why: "Thói quen / trạng thái **đã chấm dứt** → **used to + V**. **would** không dùng cho trạng thái (live). Câu 2 nghĩa là “đã quen sống ở nông thôn”." },
        { q: "(7) Câu nào **phù hợp nhất** cho kết bài?", options: ["In conclusion, I think that in my opinion uniforms are good.", "In conclusion, I strongly believe that school uniforms should remain compulsory, as they save families money and reduce competition between students.", "In conclusion, uniforms are good. For example, my school's uniform is blue."], correct: 1, why: "Câu 2 có **từ nối đúng + quan điểm rõ + 2 lý do**. Câu 1 lặp ý (~~I think that in my opinion~~); câu 3 thêm **ví dụ mới**." },
        { q: "(8) Câu nào **sai**?", options: ["I hardly ever skip breakfast.", "She doesn't usually take the bus.", "They go often to the cinema."], correct: 2, why: "Trạng từ tần suất đứng **trước động từ thường**: They **often go** to the cinema." },
      ],
    },

    { t: "h", text: "Phần III — Điền / chia động từ (10 câu)" },
    {
      t: "quiz",
      id: "d10-bt-dien",
      title: "Phần III — Điền MỘT từ hoặc chia động từ trong ngoặc (10 câu)",
      kind: "fill",
      items: [
        { q: "(1) I visit my grandparents ___ a month. (2 lần — một từ)", answers: ["twice"] },
        { q: "(2) We have English class three ___ a week.", answers: ["times"] },
        { q: "(3) I go to the dentist ___ a year. (1 lần — một từ)", answers: ["once"] },
        { q: "(4) When I was ten, I used to ___ (ride) my bike to school.", answers: ["ride"] },
        { q: "(5) My mother didn't ___ to drink coffee, but now she loves it.", answers: ["use"] },
        { q: "(6) I'm not used to ___ (wake) up so early.", answers: ["waking"] },
        { q: "(7) It took me a month to get used to ___ (live) in a big city.", answers: ["living"] },
        { q: "(8) ___ you use to play video games when you were a kid?", answers: ["Did", "did"] },
        { q: "(9) ___ conclusion, I firmly believe that small habits matter more than big changes.", answers: ["In", "in"] },
        { q: "(10) ___ online learning is convenient, it can feel lonely. (một từ: Dù…)", answers: ["Although", "although", "Though", "though", "While", "while"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích nhanh Phần III",
      items: [
        "(1)–(3): **once** = 1 lần, **twice** = 2 lần, **three times** = 3 lần trở lên dùng **times** (số nhiều).",
        "(4) **used to + V nguyên mẫu** → ride. (5) sau **didn't** → **use** (bỏ -d). (8) Câu hỏi quá khứ: **Did** + S + use to + V?",
        "(6)(7) **be used to / get used to + V-ing** vì **to** ở đây là giới từ → waking, living.",
        "(9) **In conclusion,** — cụm cố định. (10) **Although + S + V, S + V** — không thêm ~~but~~ ở vế sau.",
      ],
    },

    { t: "h", text: "Phần IV — Ghép câu: đặt trạng từ đúng chỗ (4 câu)" },
    {
      t: "build",
      id: "d10-bt-ghep",
      title: "Phần IV — Ghép câu (4 câu)",
      items: [
        {
          vi: "Tôi thường học ở thư viện vào buổi tối.",
          chips: ["I ", "usually ", "study ", "in the library ", "in the evening.", "am usually "],
          answer: ["I ", "usually ", "study ", "in the library ", "in the evening."],
        },
        {
          vi: "Bố tôi hiếm khi về nhà muộn.",
          chips: ["My father ", "rarely ", "comes ", "come ", "home ", "late."],
          answer: ["My father ", "rarely ", "comes ", "home ", "late."],
        },
        {
          vi: "Cô ấy luôn bận vào thứ Hai.",
          chips: ["She ", "is ", "always ", "always is ", "busy ", "on Mondays."],
          answer: ["She ", "is ", "always ", "busy ", "on Mondays."],
        },
        {
          vi: "Trước đây tôi thường đi bộ đến trường, nhưng giờ tôi đi xe buýt.",
          chips: ["I ", "used to ", "use to ", "walk ", "to school, ", "but now ", "I take ", "the bus."],
          answer: ["I ", "used to ", "walk ", "to school, ", "but now ", "I take ", "the bus."],
        },
      ],
    },

    { t: "h", text: "Phần V — Viết kết bài (AI chấm)" },
    {
      t: "p",
      text: "Đề: “Some people think that children should not be given homework at primary school. Do you agree or disagree?” — Mở bài của bạn đã viết: “**It is sometimes argued that young pupils should not have to do any homework. I disagree with this view because homework helps children review what they have learnt and teaches them to work independently.**” Hãy viết **kết bài** (2 câu, 35–50 từ) khớp với mở bài này.",
    },
    {
      t: "essay",
      id: "d10-bt-ket-bai",
      task: "Task 2",
      prompt: "Write ONLY the conclusion (2 sentences, 35–50 words) for this essay. Question: Some people think that children should not be given homework at primary school. Do you agree or disagree? Introduction already written: It is sometimes argued that young pupils should not have to do any homework. I disagree with this view because homework helps children review what they have learnt and teaches them to work independently.",
      minWords: 30,
      tips: [
        "Mở bằng **In conclusion,** hoặc **To conclude,** — chỉ một từ nối.",
        "Giữ **đúng quan điểm KHÔNG đồng ý**, nhưng đổi lời: disagree → **I remain convinced that primary school children should still be given homework** / **I firmly believe that homework should not be removed…**",
        "Tóm tắt **2 lý do** bằng từ khác: review what they have learnt → **remember their lessons / consolidate their knowledge**; work independently → **become more independent learners**.",
        "Không thêm ý mới (ví dụ: “homework helps parents know their children's progress” là ý MỚI → không được).",
      ],
    },
  ],
};

export const NGAY_10: Lesson[] = [D10_READING, D10_WRITING, D10_SPEAKING, D10_HOMEWORK];
