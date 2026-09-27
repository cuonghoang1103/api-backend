/**
 * Ngày 4 — sách trang 54–73:
 *   Reading Skills: Sentence Completion 1 · Writing Skills: Introduction to
 *   IELTS Writing Task 1 · Speaking Skills: Yes/No Questions (Part 1, Hobbies)
 *   · Homework (34 câu dịch + điền từ theo khung).
 *
 * Giữ đủ kiến thức, thứ tự, dạng bài và số câu của sách; bài đọc, ví dụ, câu
 * trả lời mẫu và câu bài tập đều VIẾT MỚI (xem ../SOAN-BAI.md).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Reading ─────────────────────────── */

const D4_READING: Lesson = {
  id: "d4-doc",
  kind: "reading",
  title: "Đọc: Sentence Completion 1 (hoàn thành câu)",
  goal: "Làm được dạng Sentence Completion theo 9 bước: đọc kỹ giới hạn số từ, đoán từ loại, tìm từ khoá, dò ra câu được viết lại (paraphrase) và điền đúng từ trong bài.",
  minutes: 40,
  blocks: [
    {
      t: "p",
      text: "**Sentence Completion** (hoàn thành câu) là dạng bài cho sẵn một câu hoặc một bản ghi chú (notes) có chỗ trống. Bạn phải **lấy đúng từ trong bài đọc** để điền vào. Đây là dạng dễ lấy điểm với người mới, vì đáp án **có sẵn trong bài**, bạn không phải tự nghĩ ra từ, chỉ cần tìm đúng chỗ.",
    },
    {
      t: "note",
      title: "Ghi nhớ về dạng bài",
      items: [
        "Từ điền vào phải **chép đúng từ trong bài** (đúng chính tả, đúng số ít/số nhiều). Không được đổi sang từ đồng nghĩa.",
        "Câu hỏi hầu như luôn **viết lại (paraphrase)** câu trong bài: đổi từ, đổi cấu trúc. Ví dụ bài viết “shut its doors”, câu hỏi viết “closed”.",
        "Các câu hỏi thường đi **theo thứ tự của bài đọc**: đáp án câu 2 nằm sau đáp án câu 1.",
      ],
    },

    { t: "h", text: "1. Cách làm: 9 bước" },
    {
      t: "p",
      text: "Đây là 9 bước sách hướng dẫn cho mục tiêu band 4.0. Lúc đầu hãy làm **chậm, đủ cả 9 bước**. Làm quen rồi, các bước sẽ tự nhập lại thành một động tác nhanh.",
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Giải thích thêm"],
      rows: [
        ["1. Đọc kỹ hướng dẫn", "Xem được điền **tối đa mấy từ**: ONE WORD ONLY, NO MORE THAN TWO WORDS, ONE WORD AND/OR A NUMBER…", "Điền quá số từ là **sai cả câu**, dù ý đúng. Khoanh tròn giới hạn này trước khi làm gì khác."],
        ["2. Hiểu nghĩa câu cần điền", "Đọc cả câu, hiểu câu đang nói về chuyện gì, chỗ trống đang hỏi loại thông tin nào.", "Tự hỏi: chỗ trống là **người? vật? nơi chốn? con số? lý do?**"],
        ["3. Xác định từ loại cần điền", "Danh từ, động từ, tính từ hay trạng từ?", "Nhìn từ đứng trước và sau chỗ trống: sau **the / a / tính từ** → danh từ; sau **to / can / will** → động từ; trước danh từ hoặc sau **is / are / very** → tính từ."],
        ["4. Tìm từ khoá trong câu", "Gạch chân những từ quan trọng nhất của câu hỏi.", "Ưu tiên **tên riêng, con số, năm, từ chuyên ngành**: những từ này khó bị viết lại nên dễ dò nhất."],
        ["5. Quét (scan) bài đọc", "Lướt mắt tìm từ khoá hoặc **từ đồng nghĩa** của nó trong bài.", "Quét là không đọc từng chữ, chỉ “săn” từ khoá. Nhớ rằng bài thường dùng **từ khác cùng nghĩa**."],
        ["6. Đọc kỹ đoạn liên quan", "Tìm thấy chỗ có từ khoá thì đọc thật kỹ câu đó và 1–2 câu xung quanh.", "Đáp án thường nằm **trong cùng câu** hoặc câu ngay trước/sau từ khoá."],
        ["7. So sánh và đối chiếu", "Đặt câu hỏi cạnh câu trong bài: ý có khớp nhau không? từ định điền có đúng từ loại không?", "Cẩn thận bẫy: bài có thể nhắc 2–3 từ gần nhau, chỉ một từ khớp đúng nghĩa câu hỏi."],
        ["8. Điền đáp án chính xác", "Chép từ trong bài vào chỗ trống.", "Kiểm tra lại **số từ** và **chính tả**. Viết sai một chữ cái là mất điểm."],
        ["9. Đọc lại câu hoàn chỉnh", "Đọc to (trong đầu) cả câu đã điền.", "Câu phải **đúng ngữ pháp và có nghĩa**. Ví dụ trước chỗ trống có “a” mà bạn điền danh từ số nhiều là sai."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở dạng bài này",
      items: [
        "Điền **từ đồng nghĩa tự nghĩ ra** thay vì từ trong bài. Bài viết “purchased” mà bạn điền ~~bought~~ là sai.",
        "Quên **đuôi -s** hoặc tự thêm -s: bài viết “regions” mà bạn chép ~~region~~ thì mất điểm.",
        "Điền quá số từ: đề ONE WORD ONLY mà viết ~~the market~~ là sai, chỉ viết **market**.",
        "Thấy đúng từ khoá là điền luôn từ đứng cạnh, không đọc lại cả câu. Luôn làm **bước 7 và bước 9**.",
      ],
    },
    {
      t: "note",
      title: "Mẹo đếm số từ (phần này sách chưa có)",
      items: [
        "Từ có **gạch nối** tính là 1 từ: **well-known**, **three-year-old**.",
        "**Con số** viết bằng chữ số tính là 1 số, không tính là từ: đề “ONE WORD AND/OR A NUMBER” cho phép điền **45 minutes**.",
        "Mạo từ **a / an / the** cũng là một từ. Thường không cần chép chúng vào chỗ trống, vì câu hỏi đã có sẵn.",
        "Viết hoa hay viết thường đều được chấm đúng, nhưng **chính tả phải đúng tuyệt đối**.",
      ],
    },

    { t: "h", text: "2. Ví dụ chi tiết" },
    {
      t: "p",
      text: "**Đề:** Complete the sentence below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer.",
    },
    {
      t: "examples",
      items: [
        { en: "Question: The bridge was closed because of ______.", vi: "Câu hỏi: Cây cầu bị đóng vì ______." },
        { en: "Passage: The old bridge was shut for two weeks as engineers carried out urgent repairs.", vi: "Bài đọc: Cây cầu cũ bị đóng suốt hai tuần vì các kỹ sư tiến hành sửa chữa khẩn cấp." },
      ],
    },
    {
      t: "table",
      head: ["Bước", "Áp dụng vào ví dụ"],
      rows: [
        ["1. Hướng dẫn", "NO MORE THAN TWO WORDS → được điền 1 hoặc 2 từ."],
        ["2. Hiểu câu", "Câu hỏi muốn biết **lý do** cây cầu bị đóng."],
        ["3. Từ loại", "Sau **because of** phải là **danh từ** (hoặc cụm danh từ)."],
        ["4. Từ khoá", "**bridge**, **closed**."],
        ["5. Quét bài", "Thấy “bridge” ngay đầu câu. “closed” không xuất hiện, nhưng có **“was shut”**: đây là từ đồng nghĩa."],
        ["6. Đọc kỹ", "“…as engineers carried out urgent repairs”: chữ **as** ở đây nghĩa là **vì**, nên phần sau nó là lý do."],
        ["7. So sánh", "because of ↔ as · closed ↔ shut · lý do là **repairs** (sửa chữa), một danh từ, đúng từ loại."],
        ["8. Điền", "**urgent repairs** (2 từ) hoặc **repairs** (1 từ): cả hai đều đúng vì không quá 2 từ."],
        ["9. Đọc lại", "“The bridge was closed because of urgent repairs.” Câu đúng ngữ pháp, đúng nghĩa. ✓"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với từ không thể điền",
      items: [
        "Không điền ~~engineers~~: kỹ sư không phải lý do đóng cầu, họ là người sửa cầu.",
        "Không điền ~~urgent repairs carried~~: quá 2 từ và câu sai nghĩa.",
        "Bài học chính: câu hỏi và bài đọc **không dùng cùng một từ** (closed ≠ shut, because of ≠ as). Kỹ năng quan trọng nhất của dạng này là **nhận ra từ đồng nghĩa**.",
      ],
    },

    { t: "h", text: "3. Bài đọc luyện tập" },
    {
      t: "p",
      text: "Bài đọc dưới đây được soạn riêng cho khoá học, cùng chủ đề và độ khó với bài trong sách: **một nhóm nghiên cứu tìm hiểu trẻ mẫu giáo trước khi thiết kế sản phẩm cho các em**. Hãy làm theo 9 bước: đọc câu hỏi trước, rồi mới quét bài.",
    },
    {
      t: "passage",
      title: "Designing a Tablet App for Young Children: The Research Behind It",
      intro: "Bài đọc gồm 3 đoạn A, B, C. Câu hỏi 1–5 ở ngay bên dưới.",
      paras: [
        {
          label: "A",
          text: "A small educational software company in Vietnam wanted to build a drawing and counting app for children aged three to six. Its producers had a keen interest in the idea, but the design team knew very little about how such young children actually use a touchscreen. After several long meetings, the team agreed on three goals for the project. The first was to understand the range of physical and cognitive skills that young children bring to a tablet, especially in the context of play. The second was to observe how these young users interact with the device, in particular how they control the taps, swipes and other game mechanics found in the apps presently on the market for this platform. The third was to find out the expectations of teachers, since many children meet a tablet for the first time in the classroom, and to learn where such apps are usually purchased and where play normally occurs.",
        },
        {
          label: "B",
          text: "The research team decided that in-home ethnographies, a method in which researchers spend time watching families in their own homes, would yield a comprehensive database of real behaviour rather than simple opinions. They therefore started by conducting 30 home visits in three regions of the country: an urban district of Hanoi, a suburban area outside Ho Chi Minh City and a rural village in the Mekong Delta. These places were chosen because children in different settings often have very different access to technology, and an app that works well in a busy city flat may not suit a family that shares one phone among five people.",
        },
        {
          label: "C",
          text: "The subjects of the study included 16 girls and 14 boys whose ages ranged from 3 years and 2 months to 6 years. Earlier studies had shown the effect of older brothers and sisters on the way young children play, so the sample was a combination of children with and without older siblings. In many homes, the children were looked after during the day by their grandparents while both parents were at work, and these carers were interviewed as well. Fifteen of the thirty families already owned a tablet; for the others, the researchers brought one along. This allowed the team to compare the instinctive, intuitive movements of first-time users with the learned movements of children who played every day, and to test each child's ability to drag small objects across the screen. Each visit lasted between 60 and 120 minutes and was filmed, so that the team could later check how easily every child found their way around the tablet's operating system.",
        },
      ],
    },

    { t: "h", text: "Questions 1–5" },
    {
      t: "p",
      text: "Complete the notes below. Choose **ONE WORD ONLY** from the passage for each answer. — *Hoàn thành ghi chú dưới đây. Chọn **MỘT TỪ DUY NHẤT** trong bài đọc cho mỗi câu trả lời.*",
    },
    {
      t: "table",
      caption: "Research Project for a Children's App — Dự án nghiên cứu cho một ứng dụng trẻ em",
      head: ["Mục", "Ghi chú (notes)"],
      rows: [
        ["Main objectives — Mục tiêu chính", "Identify the physical and mental **(1) ______** of young children"],
        ["", "Watch how children handle the device"],
        ["", "Discover what **(2) ______** expect from learning apps"],
        ["Subjects — Đối tượng nghiên cứu", "30 children from three **(3) ______** of the country"],
        ["", "Age: 3 years 2 months to 6 years"],
        ["", "Many children spend the day with their **(4) ______**"],
        ["", "Half of the families had a **(5) ______** before the study"],
        ["Length of visit — Thời gian mỗi lần đến", "1–2 hours"],
      ],
    },
    {
      t: "quiz",
      id: "d4-doc-cau",
      title: "Questions 1–5 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(1) Identify the physical and mental ___ of young children.", answers: ["skills"] },
        { q: "(2) Discover what ___ expect from learning apps.", answers: ["teachers"] },
        { q: "(3) 30 children from three ___ of the country.", answers: ["regions"] },
        { q: "(4) Many children spend the day with their ___.", answers: ["grandparents"] },
        { q: "(5) Half of the families had a ___ before the study.", answers: ["tablet"] },
      ],
    },

    { t: "h", text: "4. Giải thích đáp án" },
    {
      t: "note",
      title: "Giải thích đáp án câu 1: skills",
      items: [
        "**Dạng câu hỏi:** Sentence Completion · **Vị trí:** đoạn A, câu 4.",
        "Bài viết: “The first was to understand the range of physical and cognitive **skills** that young children bring to a tablet.” — *Mục tiêu thứ nhất là hiểu các kỹ năng thể chất và nhận thức mà trẻ nhỏ mang theo khi dùng máy tính bảng.*",
        "Paraphrase: **mental** (thuộc về trí óc) = **cognitive** (nhận thức); **Identify** (xác định) ≈ **understand**. Sau hai tính từ physical and mental phải là **danh từ số nhiều** → **skills**.",
        "Không điền ~~range~~: “physical and mental range” không có nghĩa. Trong bài, hai tính từ physical and cognitive đứng ngay trước **skills**, đúng như hai tính từ physical and mental đứng trước chỗ trống.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 2: teachers",
      items: [
        "**Dạng câu hỏi:** Sentence Completion · **Vị trí:** đoạn A, câu 6 (câu cuối).",
        "Bài viết: “The third was to find out the expectations of **teachers**, since many children meet a tablet for the first time in the classroom.” — *Mục tiêu thứ ba là tìm hiểu kỳ vọng của giáo viên, vì nhiều trẻ lần đầu gặp máy tính bảng ở lớp học.*",
        "Paraphrase: **Discover** = **find out**; **what (2) expect** = **the expectations of (2)**. Danh từ “expectations” trong bài đã được đổi thành động từ “expect” trong câu hỏi: đây là kiểu viết lại rất hay gặp.",
        "Không điền ~~producers~~: đoạn A chỉ nói người sản xuất **quan tâm** tới ý tưởng (interest), không nói họ kỳ vọng gì ở ứng dụng học tập.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 3: regions",
      items: [
        "**Dạng câu hỏi:** Sentence Completion · **Vị trí:** đoạn B, câu 2.",
        "Bài viết: “They therefore started by conducting 30 home visits in three **regions** of the country: an urban district of Hanoi, a suburban area… and a rural village…” — *Vì vậy họ bắt đầu bằng 30 lần đến thăm tại nhà ở ba vùng của đất nước: một quận nội thành Hà Nội, một khu ngoại ô… và một làng quê…*",
        "Từ khoá dễ dò: con số **30** và **three**. Sau “three” cần **danh từ số nhiều** → **regions** (nhớ giữ đuôi -s).",
        "Không điền ~~districts~~ hay ~~areas~~: bài không viết số nhiều của chúng, và chúng chỉ là **từng** nơi cụ thể trong ba vùng.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 4: grandparents",
      items: [
        "**Dạng câu hỏi:** Sentence Completion · **Vị trí:** đoạn C, câu 3.",
        "Bài viết: “In many homes, the children were looked after during the day by their **grandparents** while both parents were at work.” — *Ở nhiều nhà, ban ngày trẻ được ông bà trông trong khi bố mẹ đi làm.*",
        "Paraphrase: **Many children spend the day with** ≈ **In many homes, the children were looked after during the day by**. Câu bị động trong bài (were looked after by) đã được đổi thành câu chủ động trong câu hỏi.",
        "Bẫy: ~~parents~~ đứng ngay sau, nhưng bố mẹ **đi làm** (at work), không ở cùng trẻ ban ngày. Còn ~~siblings~~ ở câu trước nói về anh chị, không nói ai trông trẻ.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án câu 5: tablet",
      items: [
        "**Dạng câu hỏi:** Sentence Completion · **Vị trí:** đoạn C, câu 4.",
        "Bài viết: “Fifteen of the thirty families already owned a **tablet**; for the others, the researchers brought one along.” — *Mười lăm trong ba mươi gia đình đã có sẵn máy tính bảng; với các gia đình còn lại, nhà nghiên cứu mang một chiếc đến.*",
        "Paraphrase bằng **con số**: 15 trên 30 = **Half** (một nửa); **already owned** = **had… before the study**. Trước chỗ trống có **a** → danh từ số ít → **tablet** (không có -s).",
        "Đây là kiểu viết lại khó nhất với người mới: bài không có chữ “half”, bạn phải tự tính. Gặp con số trong bài, luôn thử xem câu hỏi có nói bằng **phân số, phần trăm** hay không.",
      ],
    },

    { t: "h", text: "5. Từ vựng hữu ích (42 từ)" },
    {
      t: "p",
      text: "Đủ 42 từ của sách, tất cả đều có mặt trong bài đọc trên. Bấm 🔊 để nghe, đọc lại câu trong bài có chứa từ đó, rồi tự đặt một câu. 34 từ đầu sẽ dùng lại ngay trong **Bài tập Ngày 4**.",
    },
    {
      t: "vocab",
      items: [
        { w: "combination", pos: "n", ipa: "/ˌkɒmbɪˈneɪʃn/", vi: "sự kết hợp", ex: "Pho is a combination of rice noodles, broth and herbs.", exVi: "Phở là sự kết hợp của bánh phở, nước dùng và rau thơm." },
        { w: "instinctive", pos: "adj", ipa: "/ɪnˈstɪŋktɪv/", vi: "theo bản năng", ex: "Pulling your hand away from a hot pan is instinctive.", exVi: "Rụt tay khỏi chảo nóng là phản xạ theo bản năng." },
        { w: "interest", pos: "n", ipa: "/ˈɪntrəst/", vi: "sự quan tâm, sở thích", ex: "My sister has a strong interest in space.", exVi: "Chị tôi rất quan tâm đến vũ trụ." },
        { w: "intuitive", pos: "adj", ipa: "/ɪnˈtjuːɪtɪv/", vi: "theo trực giác; (thiết kế) dễ dùng, nhìn là biết cách dùng", ex: "The new menu is so intuitive that my grandfather uses it easily.", exVi: "Menu mới dễ dùng đến mức ông tôi dùng được ngay." },
        { w: "agree", pos: "v", ipa: "/əˈɡriː/", vi: "đồng ý", ex: "We agreed to meet at the library at eight.", exVi: "Chúng tôi đồng ý gặp nhau ở thư viện lúc tám giờ." },
        { w: "goal", pos: "n", ipa: "/ɡəʊl/", vi: "mục tiêu", ex: "Set a small goal for every study session.", exVi: "Hãy đặt một mục tiêu nhỏ cho mỗi buổi học." },
        { w: "project", pos: "n", ipa: "/ˈprɒdʒekt/", vi: "dự án", ex: "Our science project is about recycling plastic.", exVi: "Dự án khoa học của chúng tôi nói về tái chế nhựa." },
        { w: "understand", pos: "v", ipa: "/ˌʌndəˈstænd/", vi: "hiểu", ex: "Read the question twice if you don't understand it.", exVi: "Hãy đọc câu hỏi hai lần nếu bạn chưa hiểu." },
        { w: "range", pos: "n", ipa: "/reɪndʒ/", vi: "phạm vi, loạt (nhiều loại khác nhau)", ex: "The shop sells a wide range of school bags.", exVi: "Cửa hàng bán rất nhiều loại cặp sách." },
        { w: "physical", pos: "adj", ipa: "/ˈfɪzɪkl/", vi: "thuộc về thể chất, cơ thể", ex: "Swimming is good for your physical health.", exVi: "Bơi lội tốt cho sức khoẻ thể chất." },
        { w: "cognitive", pos: "adj", ipa: "/ˈkɒɡnətɪv/", vi: "thuộc về nhận thức (suy nghĩ, ghi nhớ, hiểu)", ex: "Chess can improve a child's cognitive skills.", exVi: "Cờ vua có thể cải thiện kỹ năng nhận thức của trẻ." },
        { w: "ability", pos: "n", ipa: "/əˈbɪləti/", vi: "khả năng", ex: "She has the ability to explain hard ideas simply.", exVi: "Cô ấy có khả năng giải thích ý khó một cách đơn giản." },
        { w: "context", pos: "n", ipa: "/ˈkɒntekst/", vi: "bối cảnh, ngữ cảnh", ex: "You can often guess a word from its context.", exVi: "Bạn thường đoán được nghĩa một từ nhờ ngữ cảnh." },
        { w: "system", pos: "n", ipa: "/ˈsɪstəm/", vi: "hệ thống", ex: "The school uses a new system to take attendance.", exVi: "Trường dùng một hệ thống mới để điểm danh." },
        { w: "urban", pos: "adj", ipa: "/ˈɜːbən/", vi: "thuộc đô thị, thành thị", ex: "Urban traffic gets worse every year.", exVi: "Giao thông đô thị ngày càng tệ hơn mỗi năm." },
        { w: "suburban", pos: "adj", ipa: "/səˈbɜːbən/", vi: "thuộc ngoại ô", ex: "They moved to a suburban house with a small garden.", exVi: "Họ chuyển đến một ngôi nhà ngoại ô có vườn nhỏ." },
        { w: "interact", pos: "v", ipa: "/ˌɪntərˈækt/", vi: "tương tác", ex: "Good teachers interact with every student in the class.", exVi: "Giáo viên giỏi tương tác với mọi học sinh trong lớp." },
        { w: "control", pos: "v", ipa: "/kənˈtrəʊl/", vi: "điều khiển, kiểm soát", ex: "You control the robot with this small remote.", exVi: "Bạn điều khiển con robot bằng chiếc điều khiển nhỏ này." },
        { w: "different", pos: "adj", ipa: "/ˈdɪfrənt/", vi: "khác, khác nhau", ex: "My twin brother and I have very different tastes in music.", exVi: "Anh em sinh đôi chúng tôi có gu âm nhạc rất khác nhau." },
        { w: "mechanics", pos: "n", ipa: "/mɪˈkænɪks/", vi: "cơ chế (cách một thứ vận hành); game mechanics = cơ chế trò chơi", ex: "The mechanics of this puzzle game are easy to learn.", exVi: "Cơ chế của trò chơi giải đố này dễ học." },
        { w: "present", pos: "adj", ipa: "/ˈpreznt/", vi: "hiện tại, hiện nay", ex: "The present price of rice is higher than last year.", exVi: "Giá gạo hiện nay cao hơn năm ngoái." },
        { w: "market", pos: "n", ipa: "/ˈmɑːkɪt/", vi: "thị trường; chợ", ex: "Many new phones enter the market every year.", exVi: "Mỗi năm có nhiều điện thoại mới ra thị trường." },
        { w: "platform", pos: "n", ipa: "/ˈplætfɔːm/", vi: "nền tảng", ex: "This game is available on every platform.", exVi: "Trò chơi này có trên mọi nền tảng." },
        { w: "expectation", pos: "n", ipa: "/ˌekspekˈteɪʃn/", vi: "sự kỳ vọng", ex: "The film did not meet my expectations.", exVi: "Bộ phim không đạt được kỳ vọng của tôi." },
        { w: "parent", pos: "n", ipa: "/ˈpeərənt/", vi: "cha hoặc mẹ; parents = bố mẹ, phụ huynh", ex: "Every parent wants their child to be safe online.", exVi: "Cha mẹ nào cũng muốn con an toàn trên mạng." },
        { w: "purchase", pos: "v", ipa: "/ˈpɜːtʃəs/", vi: "mua (trang trọng hơn buy)", ex: "You can purchase tickets at the front desk.", exVi: "Bạn có thể mua vé ở quầy lễ tân." },
        { w: "occur", pos: "v", ipa: "/əˈkɜː(r)/", vi: "xảy ra", ex: "Most floods occur between September and November.", exVi: "Phần lớn lũ lụt xảy ra từ tháng Chín đến tháng Mười Một." },
        { w: "team", pos: "n", ipa: "/tiːm/", vi: "đội, nhóm", ex: "Our team has five members.", exVi: "Nhóm chúng tôi có năm thành viên." },
        { w: "research", pos: "n", ipa: "/rɪˈsɜːtʃ/", vi: "sự nghiên cứu", ex: "New research shows that breakfast helps students focus.", exVi: "Nghiên cứu mới cho thấy bữa sáng giúp học sinh tập trung." },
        { w: "decide", pos: "v", ipa: "/dɪˈsaɪd/", vi: "quyết định", ex: "I decided to study abroad after university.", exVi: "Tôi quyết định đi du học sau đại học." },
        { w: "family", pos: "n", ipa: "/ˈfæməli/", vi: "gia đình", ex: "My family goes back to our hometown every Tet.", exVi: "Tết nào gia đình tôi cũng về quê." },
        { w: "yield", pos: "v", ipa: "/jiːld/", vi: "mang lại, tạo ra (kết quả, sản lượng)", ex: "The survey yielded some surprising results.", exVi: "Cuộc khảo sát mang lại vài kết quả bất ngờ." },
        { w: "comprehensive", pos: "adj", ipa: "/ˌkɒmprɪˈhensɪv/", vi: "toàn diện, đầy đủ", ex: "This guide gives a comprehensive list of IELTS topics.", exVi: "Cuốn hướng dẫn này đưa ra danh sách đầy đủ các chủ đề IELTS." },
        { w: "database", pos: "n", ipa: "/ˈdeɪtəbeɪs/", vi: "cơ sở dữ liệu", ex: "The library database has over ten thousand books.", exVi: "Cơ sở dữ liệu của thư viện có hơn mười nghìn cuốn sách." },
        { w: "ethnography", pos: "n", ipa: "/eθˈnɒɡrəfi/", vi: "nghiên cứu quan sát thực địa (dân tộc học): nhà nghiên cứu đến tận nơi xem người ta sống, làm việc", ex: "The ethnography showed how families really use their phones at dinner.", exVi: "Nghiên cứu quan sát thực địa cho thấy các gia đình thật sự dùng điện thoại thế nào trong bữa tối." },
        { w: "start", pos: "v", ipa: "/stɑːt/", vi: "bắt đầu", ex: "Classes start at seven thirty.", exVi: "Lớp học bắt đầu lúc bảy giờ ba mươi." },
        { w: "conduct", pos: "v", ipa: "/kənˈdʌkt/", vi: "tiến hành (khảo sát, nghiên cứu, phỏng vấn)", ex: "The students conducted a survey about screen time.", exVi: "Các bạn sinh viên đã tiến hành một khảo sát về thời gian dùng màn hình." },
        { w: "rural", pos: "adj", ipa: "/ˈrʊərəl/", vi: "thuộc nông thôn", ex: "Rural schools often lack good internet.", exVi: "Trường ở nông thôn thường thiếu mạng internet tốt." },
        { w: "subject", pos: "n", ipa: "/ˈsʌbdʒɪkt/", vi: "đối tượng (được nghiên cứu); môn học", ex: "Each subject in the study wore a small watch.", exVi: "Mỗi đối tượng trong nghiên cứu đeo một chiếc đồng hồ nhỏ." },
        { w: "include", pos: "v", ipa: "/ɪnˈkluːd/", vi: "bao gồm", ex: "The price includes breakfast.", exVi: "Giá đã bao gồm bữa sáng." },
        { w: "range from", pos: "v", ipa: "/reɪndʒ frɒm/", vi: "dao động (từ … đến …)", ex: "Ticket prices range from 50,000 to 200,000 dong.", exVi: "Giá vé dao động từ 50.000 đến 200.000 đồng." },
        { w: "effect", pos: "n", ipa: "/ɪˈfekt/", vi: "ảnh hưởng, tác động", ex: "Music has a calming effect on me.", exVi: "Âm nhạc có tác dụng làm tôi bình tĩnh lại." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những chỗ sách ghi quá gọn",
      items: [
        "Sách ghi **mechanic (n) = cơ chế**. Thật ra **a mechanic** là **thợ máy**. Nghĩa “cơ chế” luôn dùng dạng **mechanics** (có -s): **game mechanics**, **the mechanics of a clock**.",
        "**effect** (n, ảnh hưởng) khác **affect** (v, ảnh hưởng tới): ~~It effects children.~~ → **It affects children.** / **It has an effect on children.**",
        "**present** tính từ đọc /ˈpreznt/ (nhấn đầu). Động từ **present** (trình bày) đọc /prɪˈzent/ (nhấn sau). Trạng từ **presently** trong bài đọc nghĩa là “hiện nay”.",
        "**range** vừa là danh từ (**a wide range of** + danh từ số nhiều) vừa là động từ (**range from A to B**). Sách tách thành 2 từ, ở đây cũng giữ 2 mục.",
      ],
    },
  ],
};

/* ─────────────────────────── Writing ─────────────────────────── */

const D4_WRITING: Lesson = {
  id: "d4-viet",
  kind: "writing",
  title: "Viết: Làm quen IELTS Writing Task 1",
  goal: "Biết Task 1 yêu cầu gì, nhận ra 6 dạng biểu đồ, nắm khung Introduction – Overview – Body, hiểu một bài band 4 trông thế nào và phải làm gì để lên band 5–6.",
  minutes: 40,
  blocks: [
    { t: "h", text: "1. Writing Task 1 là gì?" },
    {
      t: "p",
      text: "Ở bài thi **IELTS Academic**, Writing Task 1 cho bạn **một hình** (biểu đồ, bảng, sơ đồ quy trình hoặc bản đồ) và yêu cầu bạn **tả lại những điểm chính** bằng lời. Bạn viết **ít nhất 150 từ** trong khoảng **20 phút** (cả bài Writing là 60 phút, Task 2 cần khoảng 40 phút).",
    },
    {
      t: "table",
      head: ["Điều cần biết", "Chi tiết"],
      rows: [
        ["Số từ", "Tối thiểu **150 từ**. Viết thiếu bị trừ điểm ở tiêu chí Task Achievement. Nên viết **160–190 từ**."],
        ["Thời gian", "Khoảng **20 phút**: 3 phút đọc hình, 15 phút viết, 2 phút soát lỗi."],
        ["Trọng số", "Task 2 được tính **gấp đôi** Task 1. Đừng dành quá 20 phút cho Task 1."],
        ["Bạn làm gì", "**Tả và so sánh** số liệu. **Không** nêu ý kiến riêng, **không** đoán nguyên nhân."],
        ["General Training", "Bài GT thì Task 1 là **viết thư** (letter), không tả biểu đồ. Khoá này học bản Academic, nhưng bảng tiêu chí ở mục 4 có một dòng riêng cho thư."],
      ],
    },

    { t: "h", text: "2. Sáu dạng bài của Task 1" },
    {
      t: "table",
      head: ["Dạng", "Tiếng Anh", "Hình trông thế nào", "Bạn cần tả"],
      rows: [
        ["Biểu đồ cột", "bar chart", "Các cột đứng hoặc nằm ngang", "So sánh các nhóm: cột nào cao nhất, thấp nhất, chênh bao nhiêu."],
        ["Biểu đồ đường", "line graph", "Các đường đi qua nhiều mốc thời gian", "**Xu hướng** theo thời gian: tăng, giảm, dao động, đạt đỉnh, vượt nhau."],
        ["Biểu đồ tròn", "pie chart", "Hình tròn chia thành nhiều phần", "**Tỉ lệ phần trăm**: phần lớn nhất, nhỏ nhất, phần nào bằng nhau."],
        ["Bảng biểu", "table", "Hàng và cột chứa số", "Chọn số **nổi bật** để tả, không kể hết từng ô."],
        ["Sơ đồ quy trình", "process diagram", "Các bước nối nhau bằng mũi tên", "Các **bước theo thứ tự**, thường dùng câu bị động (is heated, is packed)."],
        ["Bản đồ", "map", "Một nơi ở hai thời điểm (trước – sau)", "Cái gì **được xây thêm, bị dỡ bỏ, được chuyển chỗ**."],
      ],
    },
    {
      t: "p",
      text: "Hai hình dưới đây là ví dụ tự soạn cho khoá học. Mọi con số là giả định để luyện tập.",
    },
    {
      t: "chart",
      kind: "line",
      title: "Average daily time children aged 3–6 spent on three activities in one country, 2014–2024",
      unit: "phút/ngày",
      labels: ["2014", "2016", "2018", "2020", "2022", "2024"],
      series: [
        { name: "Watching TV", values: [95, 90, 82, 75, 70, 62] },
        { name: "Using tablets", values: [10, 25, 45, 80, 88, 96] },
        { name: "Reading books", values: [30, 28, 27, 25, 24, 24] },
      ],
    },
    {
      t: "chart",
      kind: "bar",
      title: "Favourite free-time activities of teenagers (13–17) in one city, by gender",
      unit: "%",
      labels: ["Sport", "Music", "Video games", "Reading", "Drawing"],
      series: [
        { name: "Boys", values: [42, 18, 55, 15, 10] },
        { name: "Girls", values: [28, 35, 25, 30, 26] },
      ],
    },

    { t: "h", text: "3. Khung bài: Introduction – Overview – Body" },
    {
      t: "p",
      text: "Dạng nào cũng viết theo **một khung 4 đoạn**. Học thuộc khung này là bạn đã biết mình phải viết gì trước khi nhìn đề.",
    },
    {
      t: "table",
      head: ["Đoạn", "Viết gì", "Độ dài", "Câu mở mẫu"],
      rows: [
        ["Introduction (mở bài)", "**Viết lại câu đề bằng lời của bạn**: hình tả cái gì, ở đâu, khi nào, đơn vị gì.", "1 câu", "The line graph **illustrates** how much time… between 2014 and 2024."],
        ["Overview (tổng quan)", "**2 đặc điểm nổi bật nhất**: xu hướng chính, cái lớn nhất / nhỏ nhất. **Không** đưa số liệu chi tiết.", "1–2 câu", "**Overall,** tablet use rose dramatically, while…"],
        ["Body 1 (thân bài 1)", "Tả chi tiết nhóm số liệu thứ nhất, **có số liệu** và so sánh.", "2–4 câu", "In 2014, children watched TV for around 95 minutes a day…"],
        ["Body 2 (thân bài 2)", "Tả nhóm số liệu còn lại, **có số liệu** và so sánh.", "2–4 câu", "After 2020, the gap widened…"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: Overview là đoạn quan trọng nhất",
      items: [
        "Theo tiêu chí chấm, bài **không có overview rõ ràng** thì Task Achievement khó vượt **band 5**.",
        "Overview **không cần kết luận**, không viết “In conclusion, I think…”. Task 1 không có ý kiến riêng.",
        "Mở overview bằng **Overall,** hoặc **In general,** để giám khảo thấy ngay.",
      ],
    },

    { t: "h", text: "4. Một bài Task 1 band 4.0 trông thế nào?" },
    {
      t: "p",
      text: "Kiến thức thì vô tận. Nếu không biết rõ mình đang ở đâu và cần **tập trung** vào gì, bạn rất dễ lạc hướng. Vì vậy trước khi viết, hãy xem giám khảo mô tả một bài **band 4** ra sao. Bảng dưới đây diễn đạt lại (không chép nguyên văn) bảng tiêu chí chấm công khai của IELTS, kèm cột **muốn lên band 5–6 thì làm gì** (phần này sách chưa có).",
    },
    {
      t: "table",
      caption: "Band 4 theo 4 tiêu chí chấm (Band Descriptors)",
      head: ["Tiêu chí", "Band 4 — diễn đạt lại (EN)", "Nghĩa là", "Muốn lên band 5–6"],
      rows: [
        ["**Task Achievement** (hoàn thành yêu cầu đề)", "Tries to answer the task but misses some key features; the format may not suit the task.", "Có cố tả, nhưng **bỏ sót điểm chính**; có khi viết sai kiểu bài (ví dụ viết như bài luận).", "Luôn có **Overview**; tả đủ mọi nhóm số liệu; viết đúng khung 4 đoạn."],
        ["**Task Achievement** (chỉ bài General Training)", "In a letter, the purpose is not made clear and the tone may be wrong.", "Viết thư mà **không nói rõ viết để làm gì**, giọng văn không hợp người nhận.", "Câu đầu thư nói ngay mục đích; thư cho sếp thì trang trọng, cho bạn thì thân mật."],
        ["**Task Achievement**", "May mix up key features with small details; some parts may be unclear, off-topic, repeated or wrong.", "Nhầm **chi tiết nhỏ** với **điểm chính**; có đoạn khó hiểu, lạc đề, lặp lại, hoặc **đọc sai số**.", "Chọn 2 điểm lớn nhất cho overview; kiểm lại từng con số so với hình."],
        ["**Coherence & Cohesion** (mạch lạc & liên kết)", "Presents information, but it is not organised logically and the answer does not move forward clearly.", "Có thông tin nhưng **sắp xếp lộn xộn**, người đọc không thấy bài đi từ đâu đến đâu.", "Mỗi đoạn một nhóm số liệu; đi theo **thời gian** hoặc theo **từ lớn đến nhỏ**."],
        ["**Coherence & Cohesion**", "Uses some simple linking words, but they may be wrong or repeated.", "Có dùng từ nối đơn giản nhưng **dùng sai** hoặc **lặp mãi một từ** (and… and… and).", "Dùng đa dạng: **while, whereas, however, in contrast, after that, by 2024**."],
        ["**Lexical Resource** (vốn từ)", "Uses only basic words, often repeated or not suitable for the task.", "Chỉ dùng từ **rất cơ bản**, lặp đi lặp lại (increase, increase, increase).", "Học bộ từ tả xu hướng: **rise, climb, grow / fall, drop, decline / peak / remain stable**."],
        ["**Lexical Resource**", "Limited control of word forms and spelling; mistakes may make reading hard.", "Hay **sai dạng từ** (increase/increasing) và **chính tả**, người đọc phải đoán.", "Nắm cặp **động từ – danh từ**: rose sharply = a sharp rise. Soát chính tả 2 phút cuối."],
        ["**Grammatical Range & Accuracy** (ngữ pháp)", "Uses a very small range of structures and almost no complex sentences.", "Toàn **câu đơn ngắn**, gần như không có câu ghép, câu phức.", "Thêm câu có **while / whereas / which / when**: “…, while TV viewing fell.”"],
        ["**Grammatical Range & Accuracy**", "Some structures are correct, but errors are frequent and punctuation is often wrong.", "Có câu đúng, nhưng **lỗi nhiều hơn câu đúng**; dấu câu hay sai.", "Viết **đúng thì**: số liệu quá khứ dùng quá khứ đơn. Mỗi câu một dấu chấm, không nối câu bằng dấu phẩy."],
      ],
    },
    {
      t: "note",
      title: "Lỗi người Việt hay mắc ở Task 1",
      items: [
        "Chép nguyên câu đề làm mở bài: phần chép **không được tính** vào 150 từ. Hãy đổi từ: **shows → illustrates / compares**, **the number of → how many**.",
        "Dùng sai thì: số liệu năm 2014 mà viết ~~TV viewing falls~~ → **TV viewing fell**.",
        "Kể từng con số như đọc bảng mà **không so sánh**. Giám khảo muốn thấy **cái nào hơn, hơn bao nhiêu, thay đổi ra sao**.",
        "Tự thêm nguyên nhân: ~~because children like games more~~. Hình không nói lý do thì bạn **không được đoán**.",
      ],
    },

    { t: "h", text: "5. Bốn câu hỏi bạn có thể đặt ra" },
    {
      t: "table",
      head: ["Câu hỏi", "Trả lời"],
      rows: [
        ["1. Task 1 có bao nhiêu dạng bài?", "**6 dạng phổ biến**: biểu đồ cột (bar chart), biểu đồ đường (line graph), biểu đồ tròn (pie chart), bảng (table), sơ đồ quy trình (process diagram) và bản đồ (map). Mỗi dạng cần cách tả khác nhau: dạng có thời gian thì tả **xu hướng**, dạng không có thời gian thì **so sánh**, quy trình thì tả **các bước**, bản đồ thì tả **thay đổi**. Đề cũng có thể **kết hợp hai hình** (ví dụ một biểu đồ tròn và một bảng)."],
        ["2. Mỗi dạng có khung sườn riêng không?", "**Có.** Khung chung gồm **Introduction** (giới thiệu hình), **Overview** (nêu các đặc điểm nổi bật) và **Body** (phân tích chi tiết số liệu, xu hướng). Mỗi dạng chỉ khác nhau ở cách chia hai đoạn thân bài: theo thời gian, theo nhóm, theo các bước, hay theo từng khu vực trên bản đồ."],
        ["3. Mục tiêu band 4.0 thì tập trung vào gì?", "Viết **rõ ràng, ngắn gọn, mạch lạc**. Hiểu đúng đề hỏi gì, trình bày thông tin đơn giản, **chia đoạn hợp lý** và tránh lỗi ngữ pháp cơ bản (chia thì, số ít số nhiều, mạo từ). Chưa cần từ khó; một câu đơn đúng có giá trị hơn một câu dài sai."],
        ["4. Nên bắt đầu học từ đâu?", "Bắt đầu bằng việc **làm quen 6 dạng bài** và học cách đọc số liệu, nhận ra xu hướng. Sau đó tập viết **câu đơn giản** về số liệu, rồi tăng dần độ khó khi đã tự tin: thêm từ nối, câu so sánh, câu phức. **Luyện đều mỗi tuần** và **đọc bài mẫu** là cách tiến bộ nhanh nhất."],
      ],
    },
    {
      t: "note",
      title: "Mẹo học Task 1 cho người mới (phần thêm)",
      items: [
        "Tuần đầu chỉ luyện **2 dạng có số liệu theo thời gian**: line graph và bar chart. Chúng chiếm phần lớn đề thi và dùng chung bộ từ tả xu hướng.",
        "Mỗi lần luyện: viết **overview trước** (2 câu), rồi mới viết thân bài.",
        "Chép tay 5 câu mẫu tả xu hướng vào sổ, mỗi ngày đọc to một lần.",
      ],
    },

    { t: "h", text: "6. Bài mẫu cho biểu đồ đường ở trên (phần thêm)" },
    {
      t: "p",
      text: "Sách chưa có bài mẫu ở ngày này. Dưới đây là một bài mẫu khoảng **175 từ**, mức band 6, viết cho biểu đồ đường ở mục 2. Để ý nhãn **[Intro] [Overview] [Body 1] [Body 2]** và các từ in đậm.",
    },
    {
      t: "examples",
      items: [
        { en: "[Intro] The line graph illustrates how many minutes a day children aged three to six in one country spent watching TV, using tablets and reading books between 2014 and 2024.", vi: "[Mở bài] Biểu đồ đường cho thấy trẻ từ ba đến sáu tuổi ở một quốc gia dành bao nhiêu phút mỗi ngày để xem TV, dùng máy tính bảng và đọc sách từ năm 2014 đến 2024." },
        { en: "[Overview] Overall, tablet use rose dramatically and overtook television as the main activity, while the time spent on TV and books both fell.", vi: "[Tổng quan] Nhìn chung, thời gian dùng máy tính bảng tăng vọt và vượt TV để trở thành hoạt động chính, trong khi thời gian xem TV và đọc sách đều giảm." },
        { en: "[Body 1] In 2014, children watched TV for around 95 minutes a day, far more than the 10 minutes they spent on tablets. Over the next six years, TV viewing declined steadily to 75 minutes, whereas tablet use climbed sharply to 80 minutes, overtaking television in 2020.", vi: "[Thân bài 1] Năm 2014, trẻ xem TV khoảng 95 phút mỗi ngày, nhiều hơn hẳn 10 phút dùng máy tính bảng. Sáu năm sau đó, thời gian xem TV giảm đều xuống 75 phút, trong khi máy tính bảng tăng mạnh lên 80 phút và vượt TV vào năm 2020." },
        { en: "[Body 2] After 2020, the gap widened. Tablet use kept growing and reached a peak of 96 minutes in 2024, while TV viewing dropped to 62 minutes. Reading books was the least popular activity throughout the period, falling gradually from 30 to 24 minutes and then remaining stable.", vi: "[Thân bài 2] Sau năm 2020, khoảng cách ngày càng lớn. Máy tính bảng tiếp tục tăng, đạt đỉnh 96 phút năm 2024, còn TV giảm xuống 62 phút. Đọc sách là hoạt động ít nhất suốt giai đoạn, giảm dần từ 30 xuống 24 phút rồi giữ nguyên." },
      ],
    },
    {
      t: "note",
      title: "Mẹo: bộ từ tả xu hướng dùng trong bài mẫu",
      items: [
        "Tăng: **rose, climbed, grew, kept growing** · Giảm: **declined, dropped, fell** · Đỉnh: **reached a peak of** · Đứng yên: **remained stable**.",
        "Mức độ: **dramatically, sharply** (mạnh) · **steadily** (đều) · **gradually** (từ từ).",
        "So sánh hai đường: **while / whereas** (trong khi), **far more than** (nhiều hơn hẳn), **overtook** (vượt qua), **the gap widened** (khoảng cách rộng ra).",
      ],
    },
    {
      t: "mcq",
      id: "d4-viet-nhanh",
      title: "Kiểm tra nhanh — hiểu khung bài Task 1 (4 câu)",
      items: [
        { q: "Câu nào là một **Overview** tốt?", options: ["In 2014, children watched TV for 95 minutes.", "Overall, tablet use rose sharply, while TV viewing fell.", "I think children should read more books."], correct: 1, why: "Overview nêu **xu hướng chính**, không có số chi tiết. Câu 1 là chi tiết thân bài, câu 3 là ý kiến riêng (Task 1 không được nêu)." },
        { q: "Số liệu năm 2016 thì dùng thì nào?", options: ["Hiện tại đơn: falls", "Quá khứ đơn: fell", "Tương lai: will fall"], correct: 1, why: "Số liệu đã xảy ra trong quá khứ → **quá khứ đơn**." },
        { q: "Hình có các bước nối nhau bằng mũi tên là dạng nào?", options: ["pie chart", "process diagram", "map"], correct: 1, why: "**Process diagram** (sơ đồ quy trình) tả các bước theo thứ tự." },
        { q: "Bài Task 1 tối thiểu bao nhiêu từ?", options: ["100 từ", "150 từ", "250 từ"], correct: 1, why: "Task 1 cần **ít nhất 150 từ**; 250 từ là của Task 2." },
      ],
    },

    { t: "h", text: "7. Tự viết" },
    {
      t: "essay",
      id: "d4-viet-bai",
      task: "Task 1",
      prompt: "The bar chart shows the percentage of teenagers (aged 13–17) in one city who named five activities as their favourite free-time activity, by gender (they could choose more than one). Data — Sport: boys 42%, girls 28% · Music: boys 18%, girls 35% · Video games: boys 55%, girls 25% · Reading: boys 15%, girls 30% · Drawing: boys 10%, girls 26%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Nhìn biểu đồ cột ở mục 2 trong lúc viết.",
        "Mở bài: viết lại câu đề, đổi “shows” thành “compares” hoặc “illustrates”.",
        "Overview: hoạt động nào boys thích nhất, girls thích nhất? Nhóm nào chọn nhiều hơn ở phần lớn hoạt động?",
        "Body 1: các hoạt động boys chọn nhiều hơn (video games, sport). Body 2: các hoạt động girls chọn nhiều hơn (music, reading, drawing).",
        "Không có mốc thời gian → dùng thì **hiện tại đơn** hoặc quá khứ đơn nhất quán, tập trung **so sánh** (higher than, twice as many, while).",
      ],
    },
  ],
};

/* ─────────────────────────── Speaking ─────────────────────────── */

const D4_SPEAKING: Lesson = {
  id: "d4-noi",
  kind: "speaking",
  title: "Nói: Trả lời câu hỏi Yes/No (Part 1 · Sở thích)",
  goal: "Trả lời câu hỏi Yes/No ở Speaking Part 1 bằng 2–4 câu (trả lời + lý do + ví dụ) về chủ đề sở thích, và phát âm đúng 11 nguyên âm đơn ngắn/dài.",
  minutes: 40,
  blocks: [
    { t: "h", text: "1. Câu hỏi Yes/No ở Part 1" },
    {
      t: "p",
      text: "**Speaking Part 1** kéo dài 4–5 phút. Giám khảo hỏi những chủ đề quen thuộc: nhà ở, học tập, công việc, **sở thích**. Rất nhiều câu hỏi là dạng **Yes/No**, bắt đầu bằng **Do you…? / Are you…? / Did you…? / Have you…?**",
    },
    {
      t: "p",
      text: "Câu hỏi Yes/No **không có nghĩa là chỉ trả lời Yes hoặc No**. Ở band 4, bạn cần trả lời **rõ ràng** rồi **mở rộng bằng vài câu đơn giản**. Công thức dễ nhớ nhất:",
    },
    {
      t: "table",
      head: ["Bước", "Làm gì", "Ví dụ"],
      rows: [
        ["1. Answer — Trả lời", "Yes/No + nhắc lại ý câu hỏi thành câu đầy đủ", "Yes, I **enjoy** watching movies a lot."],
        ["2. Reason — Lý do", "Vì sao? Dùng **because / so / it helps me…**", "**because** they help me relax after school."],
        ["3. Example — Ví dụ / chi tiết", "Khi nào, với ai, loại gì", "I usually watch cartoons **with my sister on Friday nights**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi trả lời Yes/No",
      items: [
        "Chỉ nói ~~Yes.~~ hoặc ~~Yes, I do.~~ rồi im lặng. Giám khảo không có gì để chấm, điểm Fluency tụt ngay.",
        "Trả lời thừa động từ: ~~Yes, I am enjoy watching movies.~~ → **Yes, I enjoy watching movies.** (enjoy đã là động từ, không thêm am).",
        "Sau **enjoy / like / love** mà dùng nguyên mẫu trần: ~~I enjoy watch movies.~~ → **I enjoy watching movies.**",
        "Nói “No” nhưng lại tả như mình rất thích. Chọn một hướng và giữ đúng hướng đó. Nói **No** vẫn được điểm cao nếu có lý do rõ ràng.",
      ],
    },
    {
      t: "note",
      title: "Mẹo trả lời Part 1",
      items: [
        "Mỗi câu trả lời dài khoảng **15–25 giây**, 2–4 câu là đủ. Part 1 không cần nói dài như Part 2.",
        "Không cần nói thật 100%. Nếu thật ra bạn không có sở thích gì hay ho, **chọn câu trả lời mà bạn có từ vựng để nói**.",
        "Bắt đầu tự nhiên bằng **Yes, definitely. / Yes, I do. / Not really, to be honest.** rồi mới vào ý.",
      ],
    },

    { t: "h", text: "2. Chủ đề Hobbies — câu 1: Do you enjoy watching movies?" },
    {
      t: "table",
      head: ["Từ vựng / Cụm từ", "Phiên âm", "Công thức ngữ pháp", "Ví dụ"],
      rows: [
        ["**watch movies** (xem phim)", "/wɒtʃ ˈmuːviz/ (Anh) · /wɑːtʃ/ (Mỹ)", "S + watch movies", "My dad **watches movies** on Sunday afternoons."],
        ["**relax** (thư giãn) → **relaxing** (làm thư giãn)", "/rɪˈlæks/ · /rɪˈlæksɪŋ/", "S + find + something + relaxing", "I **find comedy movies relaxing** after a long school day."],
        ["**interesting** (thú vị)", "/ˈɪntrəstɪŋ/", "S + find + something + interesting", "My sister **finds old movies interesting**."],
        ["**fun** (vui)", "/fʌn/", "S + think + something + is fun", "I **think watching movies with friends is fun**."],
        ["**free time** (thời gian rảnh)", "/friː taɪm/", "S + V + in + one's free time", "I often watch movies **in my free time**."],
      ],
    },
    { t: "h", text: "3. Câu 2: Do you like playing sports?" },
    {
      t: "table",
      head: ["Từ vựng / Cụm từ", "Phiên âm", "Công thức ngữ pháp", "Ví dụ"],
      rows: [
        ["**play sports** (chơi thể thao)", "/pleɪ spɔːts/ (Anh) · /spɔːrts/ (Mỹ)", "S + like + playing sports", "My brother **likes playing sports** after work."],
        ["**healthy** (khoẻ mạnh)", "/ˈhelθi/", "Playing sports + helps + O + stay healthy", "**Playing sports helps my parents stay healthy.**"],
        ["**exercise** (tập thể dục)", "/ˈeksəsaɪz/", "S + do exercise + to + V", "I **do exercise to** sleep better at night."],
        ["**enjoy** (thích, tận hưởng)", "/ɪnˈdʒɔɪ/", "S + enjoy + V-ing", "We **enjoy playing** volleyball on the beach."],
        ["**stay fit** (giữ dáng, giữ sức khoẻ)", "/steɪ fɪt/", "S + V + to stay fit", "My mum goes cycling **to stay fit**."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: vài chỗ trong bảng",
      items: [
        "Công thức **find + something + adj** cần **tính từ**: ~~I find movies relax.~~ → **I find movies relaxing.** (relax là động từ, relaxing mới là tính từ).",
        "**relaxing** (làm cho thư giãn, tả SỰ VẬT) khác **relaxed** (cảm thấy thư giãn, tả NGƯỜI): **Movies are relaxing. I feel relaxed.**",
        "**do exercise** đúng nhưng hơi cứng. Người bản xứ hay nói **exercise** (động từ) hoặc **do some exercise**: **I exercise every morning.**",
        "**help + O + V nguyên mẫu** (không có to cũng được): **helps me stay healthy** = **helps me to stay healthy**.",
      ],
    },

    { t: "h", text: "4. Câu trả lời mẫu band 4.0" },
    {
      t: "dialogue",
      title: "Câu 1 — Do you enjoy watching movies? (band 4.0)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you enjoy watching movies?" },
        { who: "Candidate", role: "candidate", text: "Yes, I enjoy watching movies. I watch them at the weekend. Comedy movies are funny and I feel relaxed.", vi: "Có, tôi thích xem phim. Tôi xem vào cuối tuần. Phim hài buồn cười và tôi thấy thư giãn." },
      ],
    },
    {
      t: "note",
      title: "Phân tích câu 1",
      items: [
        "Trả lời **đúng câu hỏi** và **rõ ràng**, dùng câu đơn ngắn, dễ hiểu: “I enjoy watching movies”, “Comedy movies are funny”.",
        "Có từ **relaxed** và nói được **khi nào** xem (at the weekend), nhưng **chưa phát triển ý**: không nói vì sao thích phim hài, xem với ai, xem ở đâu.",
        "Các câu nối với nhau chỉ bằng **and**, chưa có because, so, when. Đây là lý do bài dừng ở band 4.",
      ],
    },
    {
      t: "dialogue",
      title: "Câu 2 — Do you like playing sports? (band 4.0)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you like playing sports?" },
        { who: "Candidate", role: "candidate", text: "Yes, I like playing sports. I play badminton with my classmates. It is good for my body.", vi: "Có, tôi thích chơi thể thao. Tôi chơi cầu lông với bạn cùng lớp. Nó tốt cho cơ thể tôi." },
      ],
    },
    {
      t: "note",
      title: "Phân tích câu 2",
      items: [
        "Trả lời **thẳng và đơn giản**, dùng từ thông dụng: **badminton, classmates, body**.",
        "Câu đúng ngữ pháp nhưng **cùng một kiểu** (S + V + O), không có câu dài hơn hay chi tiết cụ thể (bao lâu một lần, ở đâu, vì sao chọn cầu lông).",
        "“good for my body” hiểu được, nhưng “**good for my health**” hoặc “**keeps me fit**” tự nhiên hơn.",
      ],
    },

    { t: "h", text: "5. Nâng lên band 6 (phần sách chưa có)" },
    {
      t: "p",
      text: "Cùng hai câu hỏi, đây là cách một thí sinh band 6 trả lời. Không cần từ khó, chỉ cần **có lý do, có chi tiết, có từ nối** và vài cụm từ tự nhiên.",
    },
    {
      t: "dialogue",
      title: "Câu 1 — bản nâng cấp band 6",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you enjoy watching movies?" },
        { who: "Candidate", role: "candidate", text: "Yes, I really do. Watching films is my favourite way to unwind after a busy week, so I usually watch one on Saturday night. I'm especially into animated movies, because they're funny but they often have a meaningful message too.", vi: "Có, rất thích. Xem phim là cách tôi thích nhất để thả lỏng sau một tuần bận rộn, nên tôi thường xem một bộ vào tối thứ Bảy. Tôi đặc biệt mê phim hoạt hình, vì chúng vui mà thường còn có thông điệp ý nghĩa." },
      ],
    },
    {
      t: "dialogue",
      title: "Câu 2 — bản nâng cấp band 6",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you like playing sports?" },
        { who: "Candidate", role: "candidate", text: "Definitely. I'm quite a sporty person, actually. I play badminton with my classmates twice a week, and on Sunday mornings I sometimes go jogging in the park near my house. It keeps me fit, and it's a great way to clear my head after studying.", vi: "Chắc chắn rồi. Thật ra tôi khá mê thể thao. Tôi chơi cầu lông với bạn cùng lớp mỗi tuần hai lần, và sáng Chủ nhật đôi khi tôi chạy bộ ở công viên gần nhà. Nó giúp tôi giữ dáng, và là cách tuyệt vời để đầu óc thoải mái sau giờ học." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao hai câu trên lên được band 6",
      items: [
        "**Mở đầu tự nhiên**: Yes, I really do. / Definitely. thay cho lặp lại nguyên câu hỏi.",
        "**Có lý do** bằng **so / because** và **có chi tiết**: twice a week, on Saturday night, in the park near my house.",
        "**Cụm từ tự nhiên**: unwind (thả lỏng), be into something (mê cái gì), a sporty person (người mê thể thao), keep me fit, clear my head (làm đầu óc thoải mái).",
        "Có **câu ghép, câu phức** (…, so I usually…; because they're…) nhưng vẫn ngắn gọn: 3 câu, khoảng 20 giây.",
      ],
    },

    { t: "h", text: "6. Phát âm: 11 nguyên âm đơn (6 ngắn, 5 dài)" },
    {
      t: "p",
      text: "Tiếng Anh phân biệt **nguyên âm ngắn** và **nguyên âm dài**. Dấu **ː** (hai chấm) trong phiên âm nghĩa là **kéo dài âm**. Đọc sai độ dài có thể đổi nghĩa của từ: **ship** /ʃɪp/ (con tàu) khác **sheep** /ʃiːp/ (con cừu).",
    },
    {
      t: "table",
      head: ["Âm", "Loại", "Gần giống tiếng Việt", "Ví dụ", "Khẩu hình"],
      rows: [
        ["/æ/", "Ngắn", "giữa “a” và “e”", "cat (con mèo), bat (con dơi), hat (cái mũ)", "Mở miệng rộng, kéo hai khoé môi sang ngang, lưỡi hạ thấp."],
        ["/ɪ/", "Ngắn", "“i” ngắn, hơi ngả về “ê”", "sit (ngồi), bit (một chút), hit (đánh)", "Môi thả lỏng, không bè; bật ra thật nhanh."],
        ["/ʌ/", "Ngắn", "“ă” / “â” ngắn", "cup (cái cốc), luck (may mắn), duck (con vịt)", "Miệng hé vừa, lưỡi ở giữa, môi thả lỏng."],
        ["/ɒ/", "Ngắn", "“o” ngắn (giọng Anh)", "dog (con chó), log (khúc gỗ), fog (sương mù)", "Môi hơi tròn, miệng mở khá rộng, bật nhanh."],
        ["/e/", "Ngắn", "“e” ngắn", "bed (cái giường), red (màu đỏ), said (đã nói)", "Miệng hé vừa, hơi kéo sang ngang; hẹp hơn /æ/."],
        ["/ʊ/", "Ngắn", "“u” ngắn", "book (sách), look (nhìn), cook (nấu ăn)", "Môi hơi tròn nhưng lỏng, không chu; bật nhanh."],
        ["/iː/", "Dài", "“i” kéo dài", "seat (chỗ ngồi), heat (sức nóng), meet (gặp)", "Kéo môi sang hai bên như đang cười, giữ âm lâu."],
        ["/uː/", "Dài", "“u” kéo dài", "boot (giày bốt), food (thức ăn), pool (bể bơi)", "Chu tròn môi về phía trước, giữ âm lâu."],
        ["/ɑː/", "Dài", "“a” kéo dài", "car (xe ô tô), star (ngôi sao), far (xa)", "Mở miệng to, lưỡi hạ thấp, giọng Anh không đọc âm “r”."],
        ["/ɔː/", "Dài", "“o” kéo dài", "door (cửa), more (nhiều hơn), floor (sàn nhà)", "Môi tròn, miệng mở vừa, giữ âm lâu."],
        ["/ɜː/", "Dài", "“ơ” kéo dài", "bird (con chim), heard (đã nghe), word (từ)", "Môi và lưỡi thả lỏng ở giữa miệng, giữ âm lâu."],
      ],
    },
    {
      t: "p",
      text: "Bấm 🔊 để nghe từng nhóm, đọc to theo 3 lần. Để ý: ba từ trong cùng một dòng có **cùng một nguyên âm**.",
    },
    {
      t: "examples",
      items: [
        { en: "cat, bat, hat", vi: "/æ/ — ngắn" },
        { en: "sit, bit, hit", vi: "/ɪ/ — ngắn" },
        { en: "cup, luck, duck", vi: "/ʌ/ — ngắn" },
        { en: "dog, log, fog", vi: "/ɒ/ — ngắn" },
        { en: "bed, red, said", vi: "/e/ — ngắn" },
        { en: "book, look, cook", vi: "/ʊ/ — ngắn" },
        { en: "seat, heat, meet", vi: "/iː/ — dài" },
        { en: "boot, food, pool", vi: "/uː/ — dài" },
        { en: "car, star, far", vi: "/ɑː/ — dài" },
        { en: "door, more, floor", vi: "/ɔː/ — dài" },
        { en: "bird, heard, word", vi: "/ɜː/ — dài" },
      ],
    },
    {
      t: "note",
      title: "Những cặp người Việt hay nhầm (phần thêm)",
      items: [
        "**/ɪ/ và /iː/**: sit – seat, ship – sheep, live – leave. Âm ngắn bật nhanh, âm dài kéo và cười.",
        "**/ʊ/ và /uː/**: full – fool, look – Luke. Âm dài phải chu môi mạnh.",
        "**/æ/ và /e/**: bad – bed, man – men. /æ/ mở miệng rộng hơn hẳn.",
        "**/ʌ/ và /ɑː/**: cut – cart, hut – heart. /ɑː/ mở to và kéo dài.",
        "**said** đọc /sed/ (như bed), không đọc ~~/seɪd/~~. **heard** và **word** đọc /ɜː/, không đọc ~~“hia”~~, ~~“wo”~~.",
      ],
    },
    {
      t: "examples",
      items: [
        { en: "sit — seat", vi: "/ɪ/ ngắn · /iː/ dài" },
        { en: "full — fool", vi: "/ʊ/ ngắn · /uː/ dài" },
        { en: "bad — bed", vi: "/æ/ · /e/" },
        { en: "cut — cart", vi: "/ʌ/ ngắn · /ɑː/ dài" },
        { en: "shot — short", vi: "/ɒ/ ngắn · /ɔː/ dài" },
      ],
    },

    { t: "h", text: "7. Luyện nói" },
    {
      t: "p",
      text: "Nghe từng câu hỏi, ghi âm câu trả lời của bạn theo công thức **Answer – Reason – Example**, rồi để AI chấm. Cố gắng nói 2–4 câu cho mỗi câu hỏi.",
    },
    {
      t: "speak",
      id: "d4-noi-luyen",
      part: "1",
      questions: [
        "Do you enjoy watching movies?",
        "Do you like playing sports?",
        "Do you have any hobbies?",
        "Do you like reading books in your free time?",
        "Did you have a hobby when you were a child?",
      ],
    },
  ],
};

/* ─────────────────────────── Homework ─────────────────────────── */

const D4_HOMEWORK: Lesson = {
  id: "d4-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 4",
  goal: "Dùng lại 34 từ vựng của bài đọc trong câu tiếng Anh của chính mình, và điền đúng 14 chỗ trống trong câu trả lời Speaking mẫu.",
  minutes: 45,
  blocks: [
    {
      t: "quiz",
      id: "d4-dich",
      title: "I. Dịch sang tiếng Anh — dùng từ gợi ý (34 câu)",
      kind: "translate",
      grammar: "Sự thật, thói quen → hiện tại đơn (he/she/it + V-s/es). Việc đã xong → quá khứ đơn. Nhớ mạo từ a/an/the và -s của danh từ số nhiều.",
      items: [
        { q: "Món súp này là sự kết hợp của rau và thịt gà.", hint: "combination", answers: ["This soup is a combination of vegetables and chicken.", "This soup is a combination of vegetables and chicken meat."] },
        { q: "Nỗi sợ bóng tối của trẻ nhỏ là theo bản năng.", hint: "instinctive", answers: ["Young children's fear of the dark is instinctive.", "The fear of the dark in young children is instinctive.", "Small children's fear of the dark is instinctive."] },
        { q: "Em trai tôi rất quan tâm đến robot.", hint: "interest", answers: ["My younger brother has a great interest in robots.", "My younger brother has a strong interest in robots.", "My brother has a great interest in robots.", "My brother has a strong interest in robots.", "My little brother has a strong interest in robots."] },
        { q: "Giao diện của ứng dụng này rất trực quan.", hint: "intuitive", answers: ["The interface of this app is very intuitive.", "This app's interface is very intuitive.", "This app has a very intuitive interface."] },
        { q: "Cả lớp đồng ý đi dã ngoại vào thứ Bảy.", hint: "agree", answers: ["The whole class agreed to go on a picnic on Saturday.", "The whole class agrees to go on a picnic on Saturday.", "The whole class agreed to have a picnic on Saturday."] },
        { q: "Mục tiêu của tôi năm nay là đạt IELTS 5.0.", hint: "goal", answers: ["My goal this year is to get IELTS 5.0.", "My goal this year is to achieve IELTS 5.0.", "My goal this year is to get band 5.0 in IELTS.", "This year my goal is to get IELTS 5.0.", "My goal this year is to get an IELTS score of 5.0."] },
        { q: "Nhóm chúng tôi đang làm một dự án về nước sạch.", hint: "project", answers: ["Our group is working on a project about clean water.", "Our team is working on a project about clean water.", "Our group is doing a project about clean water.", "Our group is working on a project on clean water."] },
        { q: "Tôi không hiểu câu hỏi cuối cùng.", hint: "understand", answers: ["I don't understand the last question.", "I do not understand the last question.", "I didn't understand the last question.", "I did not understand the last question."] },
        { q: "Thư viện có rất nhiều loại sách cho trẻ em.", hint: "range", answers: ["The library has a wide range of books for children.", "The library has a wide range of children's books.", "The library has a large range of books for children."] },
        { q: "Hoạt động thể chất giúp trẻ em ngủ ngon hơn.", hint: "physical", answers: ["Physical activity helps children sleep better.", "Physical activity helps children to sleep better.", "Physical activities help children sleep better.", "Physical activities help children to sleep better."] },
        { q: "Trò chơi xếp hình phát triển kỹ năng nhận thức của trẻ.", hint: "cognitive", answers: ["Puzzles develop children's cognitive skills.", "Jigsaw puzzles develop children's cognitive skills.", "Puzzle games develop children's cognitive skills.", "Puzzles develop the cognitive skills of children."] },
        { q: "Bà tôi vẫn có khả năng đọc mà không cần kính.", hint: "ability", answers: ["My grandmother still has the ability to read without glasses.", "My grandma still has the ability to read without glasses.", "My grandmother still has the ability to read without her glasses."] },
        { q: "Hãy đoán nghĩa của từ mới từ ngữ cảnh.", hint: "context", answers: ["Guess the meaning of new words from the context.", "Guess the meaning of new words from context.", "Guess the meaning of the new word from the context.", "Guess the meaning of new words from their context."] },
        { q: "Trường tôi có một hệ thống điểm danh mới.", hint: "system", answers: ["My school has a new attendance system.", "Our school has a new attendance system."] },
        { q: "Nhiều người trẻ chuyển đến khu vực đô thị để tìm việc.", hint: "urban", answers: ["Many young people move to urban areas to find jobs.", "Many young people move to urban areas to find work.", "Many young people move to urban areas to look for jobs.", "Many young people move to urban areas to look for work.", "Many young people move to urban areas to find a job."] },
        { q: "Gia đình tôi sống ở một khu ngoại ô yên tĩnh.", hint: "suburban", answers: ["My family lives in a quiet suburban area.", "My family lives in a quiet suburban neighbourhood.", "My family lives in a quiet suburban neighborhood."] },
        { q: "Giáo viên tương tác với học sinh qua các trò chơi.", hint: "interact", answers: ["The teacher interacts with students through games.", "The teacher interacts with the students through games.", "Teachers interact with students through games."] },
        { q: "Bạn có thể điều khiển chiếc xe đồ chơi bằng điện thoại.", hint: "control", answers: ["You can control the toy car with your phone.", "You can control the toy car with a phone.", "You can control the toy car using your phone.", "You can control the toy car by phone.", "You can control the toy car with a smartphone."] },
        { q: "Hai chị em tôi có sở thích khác nhau.", hint: "different", answers: ["My sister and I have different hobbies.", "My sister and I have different interests.", "My sister and I have different tastes."] },
        { q: "Cơ chế của trò chơi này rất đơn giản.", hint: "mechanics", answers: ["The mechanics of this game are very simple.", "This game's mechanics are very simple.", "The mechanics of this game is very simple.", "The mechanic of this game is very simple."] },
        { q: "Giá nhà ở thời điểm hiện tại quá cao.", hint: "present", answers: ["At present, house prices are too high.", "At present house prices are too high.", "House prices are too high at present.", "House prices at the present time are too high.", "Present house prices are too high.", "The present house prices are too high."] },
        { q: "Thị trường điện thoại ở Việt Nam rất cạnh tranh.", hint: "market", answers: ["The phone market in Vietnam is very competitive.", "The mobile phone market in Vietnam is very competitive.", "The smartphone market in Vietnam is very competitive.", "The phone market in Viet Nam is very competitive."] },
        { q: "YouTube là một nền tảng phổ biến để học tiếng Anh.", hint: "platform", answers: ["YouTube is a popular platform for learning English.", "YouTube is a popular platform to learn English."] },
        { q: "Bố mẹ tôi có kỳ vọng cao về việc học của tôi.", hint: "expectation", answers: ["My parents have high expectations for my studies.", "My parents have high expectations of my studies.", "My parents have high expectations about my studies.", "My parents have high expectations for my education."] },
        { q: "Nhiều phụ huynh lo lắng về thời gian dùng màn hình của con.", hint: "parent", answers: ["Many parents worry about their children's screen time.", "Many parents are worried about their children's screen time.", "Many parents worry about their kids' screen time.", "Many parents are worried about their kids' screen time."] },
        { q: "Công ty đã mua mười máy tính mới.", hint: "purchase", answers: ["The company purchased ten new computers.", "The company has purchased ten new computers.", "The company purchased 10 new computers.", "The company has purchased 10 new computers."] },
        { q: "Tai nạn thường xảy ra vào giờ cao điểm.", hint: "occur", answers: ["Accidents often occur during rush hour.", "Accidents often occur at rush hour.", "Accidents usually occur during rush hour.", "Accidents usually occur at rush hour.", "Accidents often occur in rush hour.", "Accidents often occur during the rush hour."] },
        { q: "Đội của chúng tôi đã thắng trận đấu hôm qua.", hint: "team", answers: ["Our team won the match yesterday.", "Our team won the game yesterday.", "Yesterday our team won the match."] },
        { q: "Nghiên cứu cho thấy ngủ đủ giấc giúp trí nhớ tốt hơn.", hint: "research", answers: ["Research shows that enough sleep improves memory.", "Research shows that getting enough sleep improves memory.", "Research shows that enough sleep helps memory.", "Research shows that getting enough sleep helps your memory.", "Research shows that sleeping enough improves memory.", "Research shows that enough sleep makes memory better.", "Research shows that getting enough sleep improves your memory."] },
        { q: "Anh ấy quyết định học thêm một ngôn ngữ nữa.", hint: "decide", answers: ["He decided to learn another language.", "He decides to learn another language.", "He decided to learn one more language.", "He decided to study another language."] },
        { q: "Gia đình tôi ăn tối cùng nhau mỗi tối.", hint: "family", answers: ["My family has dinner together every evening.", "My family has dinner together every night.", "My family eats dinner together every evening.", "My family eats dinner together every night."] },
        { q: "Cây xoài này cho rất nhiều quả mỗi năm.", hint: "yield", answers: ["This mango tree yields a lot of fruit every year.", "This mango tree yields lots of fruit every year.", "This mango tree yields a lot of fruit each year.", "This mango tree yields many mangoes every year.", "This mango tree yields a lot of mangoes every year."] },
        { q: "Cuốn sách này đưa ra một hướng dẫn toàn diện về ngữ pháp.", hint: "comprehensive", answers: ["This book gives a comprehensive guide to grammar.", "This book provides a comprehensive guide to grammar.", "This book offers a comprehensive guide to grammar.", "This book gives a comprehensive grammar guide.", "This book provides a comprehensive grammar guide."] },
        { q: "Bệnh viện lưu thông tin bệnh nhân trong một cơ sở dữ liệu.", hint: "database", answers: ["The hospital stores patient information in a database.", "The hospital stores patients' information in a database.", "The hospital keeps patient information in a database.", "The hospital keeps patients' information in a database."] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi dịch vài câu",
      items: [
        "Câu 3: “quan tâm đến” = **have an interest in** (giới từ **in**), không phải ~~interest about~~.",
        "Câu 9: **a wide range of** + danh từ **số nhiều** (books, không phải ~~book~~).",
        "Câu 20: **mechanics** là danh từ có -s nhưng thường đi với động từ số nhiều khi nói về các cơ chế: **The mechanics… are**.",
        "Câu 26 và 28: việc đã xong (đã mua, hôm qua) → **quá khứ đơn**: purchased, won (win → won là động từ bất quy tắc).",
        "Câu 32: **fruit** (quả nói chung) thường **không đếm được**: **a lot of fruit**, không phải ~~a lot of fruits~~ khi nói sản lượng.",
      ],
    },

    { t: "h", text: "II. Chọn từ thích hợp điền vào chỗ trống (14 chỗ trống)" },
    {
      t: "p",
      text: "Mỗi câu hỏi có **một khung từ**. Mỗi từ trong khung dùng **đúng một lần** cho cả hai câu trả lời mẫu của câu hỏi đó. Đọc cả câu trước khi chọn: nhìn từ loại (danh từ, tính từ, động từ) và nghĩa.",
    },
    {
      t: "note",
      title: "Khung từ câu hỏi 1 (6 từ)",
      items: ["**Facebook** · **Instagram** · **news** · **events** · **activities** · **updates**"],
    },
    {
      t: "quiz",
      id: "d4-dien-1",
      title: "Câu hỏi 1: Do you often use social media? (6 chỗ trống)",
      kind: "fill",
      items: [
        { q: "Mẫu 1 (Yes) · (1) Yes, I do, almost every day. In the evening I usually open ___ to chat with my relatives in the family group.", answers: ["Facebook", "Instagram"] },
        { q: "Mẫu 1 · (2) After that, I scroll through ___ to look at my friends' photos and short videos.", answers: ["Instagram", "Facebook"] },
        { q: "Mẫu 1 · (3) I also follow a few pages that post the latest ___ about my city.", answers: ["news"] },
        { q: "Mẫu 1 · (4) That's how I hear about local ___ such as concerts and food festivals.", answers: ["events"] },
        { q: "Mẫu 2 (No) · (1) Not really. I'd rather spend my free time on offline ___, like playing chess or cooking with my mum.", answers: ["activities"] },
        { q: "Mẫu 2 · (2) I only log in once or twice a week to catch up on important ___ from my class group.", answers: ["updates"] },
      ],
    },
    {
      t: "note",
      title: "Khung từ câu hỏi 2 (8 từ)",
      items: ["**bigger** · **hours** · **faster** · **information** · **social media** · **documents** · **carry** · **photos**"],
    },
    {
      t: "quiz",
      id: "d4-dien-2",
      title: "Câu hỏi 2: Do you prefer using a computer or a smartphone? (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "Mẫu 1 (computer) · (1) I prefer a computer. Its screen is much ___ than a phone screen,", answers: ["bigger"] },
        { q: "Mẫu 1 · (2) and I can type a lot ___ with a real keyboard.", answers: ["faster"] },
        { q: "Mẫu 1 · (3) It's ideal for schoolwork, for example when I search for ___ for a project.", answers: ["information"] },
        { q: "Mẫu 1 · (4) I can also sit at it for ___ without getting a sore neck. Still, my phone is handy when I'm out, so both are useful.", answers: ["hours"] },
        { q: "Mẫu 2 (smartphone) · (1) I'd say a smartphone, because it fits in my pocket and it's easy to ___ everywhere.", answers: ["carry"] },
        { q: "Mẫu 2 · (2) I use it to check ___ and text my friends,", answers: ["social media"] },
        { q: "Mẫu 2 · (3) and to take ___ of anything interesting I see.", answers: ["photos"] },
        { q: "Mẫu 2 · (4) I only switch to my laptop when I have to write long ___ for school, since typing on a small screen is tiring.", answers: ["documents"] },
      ],
    },
    {
      t: "note",
      title: "Mẹo: đọc từ loại trước khi chọn",
      items: [
        "Sau **much** và trước **than** → tính từ so sánh hơn: **bigger**. Sau **a lot** và trước **with** (bổ nghĩa cho động từ type) → **faster**.",
        "Sau **easy to** → động từ nguyên mẫu: **carry**. Sau **for** chỉ thời gian dài → **hours**.",
        "Sau **the latest** → danh từ: **news** (không đếm được, không thêm -s dù có chữ s ở cuối). **events** đi với “such as concerts”.",
        "Câu hỏi 2 là câu hỏi **lựa chọn A hay B** (không phải Yes/No): chọn một bên, nêu lý do, rồi nhắc ngắn bên kia như hai mẫu trên.",
      ],
    },
  ],
};

export const NGAY_4: Lesson[] = [D4_READING, D4_WRITING, D4_SPEAKING, D4_HOMEWORK];
