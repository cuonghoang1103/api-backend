/**
 * IELTS Tập 2 — Ngày 15 (tự soạn 12/11/2026, không chép sách; mọi câu ví dụ, kịch bản nghe, bài tập VIẾT MỚI).
 *   Bài 1 · Grammar   — Mệnh đề quan hệ xác định who / which / that / whose / where (+ when) [G17]
 *   Bài 2 · Listening — Part 1 + Part 2 giọng Úc nhập môn: form completion · MCQ · map labelling [L03 L04 L13 L17]
 *   Bài 3 · Speaking  — Part 2: Describe an event + Part 3 nối tiếp [S05 S06]; 🔊 âm yếu /ə/ nhập môn [S13]
 *   Bài tập           — 38 câu + 1 lượt nói Part 2.
 * Đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng 15. Cách soạn: ../../SOAN-BAI.md mục "Soạn Tập 2".
 * Nhân vật người Úc (Brett, Jess, Kate) đọc bằng giọng Úc thật (en-AU: au-nam / au-nu); đặc điểm giọng Úc có bảng ở bài 2 mục 2–3.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T2D15_GRAMMAR: Lesson = {
  id: "t2d15-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Mệnh đề quan hệ xác định — who · which · that · whose · where",
  goal: "Ghép hai câu đơn thành một câu phức bằng who / which / that / whose / where, biết khi nào lược bỏ được đại từ quan hệ, tránh 5 lỗi người Việt hay mắc — để Writing và Speaking có câu phức đúng (tiêu chí Ngữ pháp GRA band 5 → 5.5); biết ghép chuỗi câu đơn gãy vụn thành câu phức.",
  minutes: 85,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Mệnh đề quan hệ** (relative clause) = một cụm có chủ ngữ – động từ riêng, đứng **ngay sau một danh từ** để nói rõ **ai / cái nào / nơi nào**: the girl ==who lives next door==.",
        "Chọn từ nối theo danh từ đứng trước: **who** (người) · **which** (vật, con vật) · **that** (người hoặc vật) · **whose** (của ai / của cái gì) · **where** (nơi chốn) · (thêm) **when** (thời gian).",
        "Đại từ quan hệ làm **tân ngữ** thì **lược bỏ được**: the book (that) I bought. Làm **chủ ngữ** thì **không** bỏ được: the man ~~lives here~~ → the man **who** lives here.",
        "Mệnh đề quan hệ **xác định** (defining) **không có dấu phẩy**; bỏ nó đi thì câu mất nghĩa. Loại **không xác định** (có dấu phẩy) chỉ cần **nhận ra** — học kỹ ở Tập 3.",
        "Đẩy band nào: **Writing & Speaking — GRA** (Grammatical Range & Accuracy). Band 5 = “có **thử** câu phức nhưng sai nhiều”; dùng **đúng** mệnh đề quan hệ là bước lên band 5.5–6. Ở **Reading / Listening**, biết tách mệnh đề giúp tìm đúng **danh từ chính** của câu dài.",
        "Mục 8: **luyện ghép câu** — thấy ba câu đơn ngắn liền nhau cùng nhắc một danh từ thì ghép lại bằng who / which / where / whose; giữ câu đơn ngắn để **chốt ý**.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Mệnh đề quan hệ là gì? Ghép hai câu thành một" },
    {
      t: "p",
      text: "Đọc câu: **The woman is my teacher.** Người nghe hỏi ngay: “**Người phụ nữ nào?**” Ta thêm một mệnh đề để chỉ rõ: **The woman ==who lives next door== is my teacher.** (Người phụ nữ **sống ở nhà bên** là cô giáo tôi.) Cụm “who lives next door” là **mệnh đề quan hệ**: nó có động từ riêng (lives), đứng **sát sau** danh từ mà nó bổ nghĩa (the woman), và được nối bằng một **đại từ quan hệ** (relative pronoun) — ở đây là **who**.",
    },
    {
      t: "p",
      text: "Tiếng Việt làm việc này bằng chữ **“mà / người mà / nơi mà”** hoặc không cần từ nối (người **sống nhà bên**). Tiếng Anh **bắt buộc** có từ nối khi nó làm chủ ngữ, và từ nối phải **đúng loại**: người → who, vật → which…",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Ghép hai câu bằng mệnh đề quan hệ — 3 bước",
      caption: "Danh từ lặp lại ở câu 2 được THAY bằng đại từ quan hệ — không giữ lại cả hai (lỗi “the man who he…”).",
      steps: [
        { label: "Câu 1 + câu 2", sub: "I met a student. **The student** speaks five languages." },
        { label: "Tìm danh từ lặp", sub: "a student = **the student** (người)" },
        { label: "Thay bằng who / which…", sub: "the student → **who**" },
        { label: "Đặt ngay sau danh từ", sub: "I met a student **who speaks five languages**." },
      ],
    },
    {
      t: "table",
      caption: "Năm từ nối của mệnh đề quan hệ xác định",
      head: ["Từ nối", "Thay cho", "Ví dụ", "Dịch"],
      rows: [
        ["**who**", "người (làm chủ ngữ hoặc tân ngữ)", "The doctor **who** treated me was very kind.", "Bác sĩ (người) chữa cho tôi rất tốt bụng."],
        ["**which**", "vật, con vật, ý tưởng", "The phone **which** I bought last week has stopped working.", "Cái điện thoại tôi mua tuần trước đã hỏng."],
        ["**that**", "người hoặc vật (thay được who / which ở loại xác định)", "This is the bus **that** goes to the airport.", "Đây là chuyến xe buýt đi sân bay."],
        ["**whose** + N", "sở hữu: của người đó / của vật đó", "I have a friend **whose** father is a pilot.", "Tôi có một người bạn có bố là phi công."],
        ["**where** + S + V", "nơi chốn (= in / at which)", "That's the café **where** we first met.", "Đó là quán cà phê nơi chúng ta gặp nhau lần đầu."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "N + who / which / that + V …",
          vi: "Đại từ quan hệ làm CHỦ NGỮ của mệnh đề — theo sau là động từ.",
          examples: [
            { en: "People who exercise regularly sleep better.", vi: "Những người tập thể dục đều đặn ngủ ngon hơn." },
            { en: "It is a festival which attracts thousands of visitors.", vi: "Đó là một lễ hội thu hút hàng nghìn du khách." },
          ],
        },
        {
          formula: "N + (who / which / that) + S + V …",
          vi: "Đại từ quan hệ làm TÂN NGỮ — theo sau là một chủ ngữ mới (xem mục 3).",
          examples: [
            { en: "The film (that) we watched last night was boring.", vi: "Bộ phim (mà) chúng tôi xem tối qua thật chán." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "N + who / which / that + V … · N + (who / which / that) + S + V …",
      vi: "Mệnh đề quan hệ đứng NGAY SAU danh từ nó bổ nghĩa; đại từ quan hệ THAY cho danh từ lặp lại.",
    },
    {
      t: "quiz",
      id: "t2d15-dinh-nghia-dich",
      title: "Dịch sang tiếng Anh — câu có mệnh đề quan hệ (4 câu)",
      kind: "translate",
      grammar: "N (người) + who + V · N (vật) + which / that + V · mệnh đề đặt ngay sau danh từ.",
      items: [
        { q: "Tôi biết một người đàn ông nói được năm thứ tiếng.", hint: "I know a man, who, speaks five languages", answers: ["I know a man who speaks five languages.", "I know a man that speaks five languages.", "I know a man who can speak five languages.", "I know a man that can speak five languages."] },
        { q: "Đây là chuyến tàu đi Đà Nẵng.", hint: "This is the train, which / that, goes to Da Nang", answers: ["This is the train which goes to Da Nang.", "This is the train that goes to Da Nang.", "This is the train which goes to Danang.", "This is the train that goes to Danang."] },
        { q: "Những học sinh đọc sách mỗi ngày thường viết tốt hơn.", hint: "Students, who, read every day, usually write better", answers: ["Students who read every day usually write better.", "Students that read every day usually write better.", "Students who read books every day usually write better.", "Students that read books every day usually write better.", "Students who read every day often write better.", "Students who read books every day often write better.", "Students that read every day often write better.", "Students that read books every day often write better."] },
        { q: "Cô ấy làm việc cho một công ty sản xuất xe đạp điện.", hint: "She works for a company, which / that, makes electric bikes", answers: ["She works for a company which makes electric bikes.", "She works for a company that makes electric bikes.", "She works for a company which produces electric bikes.", "She works for a company that produces electric bikes.", "She works for a company which makes electric bicycles.", "She works for a company that makes electric bicycles.", "She works for a company which manufactures electric bikes.", "She works for a company that manufactures electric bikes."] },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. who · which · that — chọn theo danh từ đứng trước" },
    {
      t: "p",
      text: "Câu hỏi duy nhất cần tự hỏi: **danh từ đứng ngay trước là NGƯỜI hay VẬT?** Người → **who** (hoặc that). Vật, con vật, sự việc → **which** (hoặc that). **that** dùng được cho cả hai, nghe **tự nhiên, thân mật** hơn — trong nói và viết thường ngày người bản xứ dùng that rất nhiều.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "who · which · that · whose · where — mỗi từ một “việc”",
      caption: "Nhìn danh từ đứng ngay trước: người? vật? sở hữu? nơi chốn? — rồi chọn cột tương ứng.",
      cols: [
        { title: "**who**", anh: "woman-teacher", items: ["chỉ **người**", "the nurse **who** helped me", "~~the nurse which~~"] },
        { title: "**which**", anh: "mobile-phone", items: ["**vật / con vật / việc**", "the app **which** I use", "~~the app who~~"] },
        { title: "**that**", anh: "link", items: ["**người hoặc vật**", "the man **that** called · the bus **that** left", "không đứng sau dấu phẩy / giới từ"] },
        { title: "**whose / where**", anh: "house-with-garden", items: ["**whose + N**: của ai / của cái gì", "**where + S + V**: nơi mà", "a boy **whose** dog… · the town **where** I grew up"] },
      ],
    },
    {
      t: "table",
      caption: "Khi nào NÊN dùng that (mức nhận biết — gặp trong đọc / nghe rất nhiều)",
      head: ["Sau…", "Ví dụ", "Vì sao"],
      rows: [
        ["so sánh nhất (**the best, the biggest…**)", "It was **the best** film **that** I have ever seen.", "that tự nhiên hơn which ở đây"],
        ["**the only / the first / the last**", "She was **the only** student **that** passed.", "giới hạn “duy nhất / đầu tiên”"],
        ["**all, everything, something, nothing, anything**", "**Everything that** he said was true.", "~~everything what~~ là lỗi rất hay gặp"],
        ["người + vật cùng lúc", "the people and the places **that** I remember", "who hay which đều không hợp cả hai"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với who / which / that",
      items: [
        "Dùng **which cho người**: ~~the teacher which taught me~~ → **the teacher who / that taught me**.",
        "Dùng **what** thay cho that: ~~the thing what I need~~ → **the thing (that) I need**; ~~everything what~~ → **everything (that)**. **what** = “cái mà” và **không** đứng sau danh từ.",
        "Dùng **that sau dấu phẩy** hoặc **sau giới từ**: ~~the room in that we studied~~ → the room **in which** we studied / the room **(that)** we studied **in**.",
        "Con vật nuôi được coi như người (tên riêng, tình cảm) có thể dùng **who**: our dog, **who** is twelve… — nhưng khi viết bài thi cứ dùng **which / that** cho con vật là an toàn.",
        "(nhận biết) **whom** = dạng **trang trọng** của who khi làm **tân ngữ**: the people **whom** I met. Sau **giới từ** bắt buộc là whom: the person **to whom** I spoke. Văn nói dùng who / that hoặc bỏ hẳn, giới từ đẩy ra cuối: the person **(who) I spoke to**. Không dùng whom làm chủ ngữ: ~~the man whom lives here~~.",
      ],
    },
    {
      t: "rule",
      formula: "người + who / that · vật + which / that · the best / the only / everything + that",
      vi: "that thay được who và which trong mệnh đề xác định; không dùng that sau dấu phẩy hay giới từ; không dùng what sau danh từ.",
    },
    {
      t: "quiz",
      id: "t2d15-who-which-dich",
      title: "Dịch sang tiếng Anh — who / which / that (5 câu)",
      kind: "translate",
      grammar: "người → who / that · vật → which / that · sau so sánh nhất, the only, everything → that.",
      items: [
        { q: "Người lái xe đã giúp chúng tôi là người Úc.", hint: "The driver, who / that, helped us, was Australian", answers: ["The driver who helped us was Australian.", "The driver that helped us was Australian.", "The driver who helped us was from Australia.", "The driver that helped us was from Australia."] },
        { q: "Tôi thích những bài hát làm tôi nhớ đến tuổi thơ.", hint: "I like songs, which / that, remind me of my childhood", answers: ["I like songs which remind me of my childhood.", "I like songs that remind me of my childhood.", "I like the songs which remind me of my childhood.", "I like the songs that remind me of my childhood.", "I love songs that remind me of my childhood.", "I love songs which remind me of my childhood."] },
        { q: "Đó là món quà đẹp nhất mà tôi từng nhận.", hint: "That was, the best / the most beautiful present, that, I have ever received", answers: ["That was the most beautiful present that I have ever received.", "That was the most beautiful present I have ever received.", "That was the best present that I have ever received.", "That was the best present I have ever received.", "That is the most beautiful present that I have ever received.", "That is the most beautiful present I have ever received.", "That is the best present that I have ever received.", "That is the best present I have ever received.", "That was the most beautiful gift that I have ever received.", "That was the most beautiful gift I have ever received.", "That was the best gift that I have ever received.", "That was the best gift I have ever received.", "That is the best gift I have ever received.", "That is the most beautiful gift I have ever received."] },
        { q: "Mọi thứ cô ấy nói đều đúng.", hint: "Everything, (that), she said, was true — không dùng what", answers: ["Everything that she said was true.", "Everything she said was true.", "Everything that she said is true.", "Everything she said is true."] },
        { q: "Anh ấy là người duy nhất biết câu trả lời.", hint: "He is, the only person, that / who, knows the answer", answers: ["He is the only person who knows the answer.", "He is the only person that knows the answer.", "He was the only person who knew the answer.", "He was the only person that knew the answer.", "He is the only one who knows the answer.", "He is the only one that knows the answer."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Đại từ quan hệ làm chủ ngữ hay tân ngữ? — khi nào lược bỏ được" },
    {
      t: "p",
      text: "Nhìn **ngay sau** who / which / that:",
    },
    {
      t: "table",
      head: ["Ngay sau đại từ quan hệ là…", "Vai của đại từ", "Bỏ được không?", "Ví dụ"],
      rows: [
        ["một **động từ** (lives, was, teaches…)", "**chủ ngữ** của mệnh đề", "**KHÔNG**", "the man **who lives** here → ~~the man lives here~~ (thành câu khác hẳn)"],
        ["một **chủ ngữ mới + động từ** (I bought, she met…)", "**tân ngữ** của mệnh đề", "**CÓ** — bỏ hay giữ đều đúng", "the book **(that) I bought** · the people **(who) we met**"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Chủ ngữ (giữ) ↔ tân ngữ (bỏ được)",
      caption: "Mẹo: che đại từ đi rồi đọc. Nếu ngay sau đó còn một “ai đó làm gì” đầy đủ (I bought, we met) thì bỏ được.",
      cols: [
        {
          title: "Làm **chủ ngữ** → GIỮ",
          items: [
            "the girl **who won** the prize",
            "the bus **that leaves** at six",
            "a festival **which takes** place in May",
            "sau đại từ là **động từ**",
          ],
        },
        {
          title: "Làm **tân ngữ** → bỏ được",
          items: [
            "the girl **(who) I met** at the party",
            "the bus **(that) we took**",
            "a festival **(which) my town holds** every May",
            "sau đại từ là **chủ ngữ + động từ**",
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Gọi đúng tên: “lược bỏ đại từ quan hệ” — không phải “rút gọn mệnh đề quan hệ”",
      items: [
        "Bỏ who / which / that khi nó làm **tân ngữ** gọi là **lược bỏ đại từ quan hệ** (omitting the relative pronoun). Mệnh đề vẫn nguyên chủ ngữ + động từ: the book **I bought**.",
        "**Rút gọn mệnh đề quan hệ** (reduced relative clause) là chuyện khác: biến cả mệnh đề thành **V-ing / V3** — the man **sitting** next to me, the money **raised** last year. Phần đó học ở **Tập 3 (Ngày 17)**; hôm nay chưa dùng.",
        "Trong **văn nói**, người bản xứ gần như **luôn lược bỏ** đại từ tân ngữ (the film I saw). Trong **Writing**, giữ that / which cũng hoàn toàn đúng — chọn cách bạn chắc chắn.",
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: thêm đại từ thừa — lỗi số 1 của người Việt",
      items: [
        "~~The man who **he** lives next door is a doctor.~~ → The man who lives next door is a doctor. (**who** đã là chủ ngữ — không thêm he.)",
        "~~This is the book that I bought **it** yesterday.~~ → This is the book (that) I bought yesterday. (**that** đã là tân ngữ — không thêm it.)",
        "Vì sao hay sai: tiếng Việt nói “quyển sách mà tôi mua **nó**”… được, tiếng Anh thì không. Mỗi mệnh đề chỉ có **một** chủ ngữ và **một** tân ngữ cho mỗi động từ.",
      ],
    },
    {
      t: "rule",
      formula: "N + who / which / that + V (chủ ngữ — giữ) · N + (who / which / that) + S + V (tân ngữ — lược bỏ được)",
      vi: "Sau đại từ là động từ → không bỏ. Sau đại từ là chủ ngữ mới → bỏ được. Không bao giờ thêm he / she / it thừa.",
    },
    {
      t: "quiz",
      id: "t2d15-luoc-bo-dich",
      title: "Dịch sang tiếng Anh — lược bỏ đại từ tân ngữ (4 câu)",
      kind: "translate",
      grammar: "N + (that / which / who) + S + V — đại từ làm tân ngữ, bỏ hay giữ đều đúng; không thêm it / him thừa.",
      items: [
        { q: "Bộ phim chúng tôi xem tối qua rất buồn cười.", hint: "The film, (that), we watched last night, was very funny", answers: ["The film we watched last night was very funny.", "The film that we watched last night was very funny.", "The film which we watched last night was very funny.", "The movie we watched last night was very funny.", "The movie that we watched last night was very funny.", "The movie which we watched last night was very funny.", "The film we saw last night was very funny.", "The film that we saw last night was very funny.", "The film which we saw last night was very funny."] },
        { q: "Đây là chiếc váy mẹ tôi may cho tôi.", hint: "This is the dress, (that), my mother made for me", answers: ["This is the dress my mother made for me.", "This is the dress that my mother made for me.", "This is the dress which my mother made for me.", "This is the dress my mum made for me.", "This is the dress that my mum made for me.", "This is the dress my mom made for me.", "This is the dress that my mom made for me."] },
        { q: "Những người bạn tôi gặp ở Sydney rất thân thiện.", hint: "The people / friends, (who / that), I met in Sydney, were very friendly", answers: ["The people I met in Sydney were very friendly.", "The people who I met in Sydney were very friendly.", "The people that I met in Sydney were very friendly.", "The friends I met in Sydney were very friendly.", "The friends who I met in Sydney were very friendly.", "The friends that I met in Sydney were very friendly.", "The friends whom I met in Sydney were very friendly.", "The people whom I met in Sydney were very friendly."] },
        { q: "Món ăn tôi thích nhất là phở.", hint: "The dish / food, (that), I like most, is pho", answers: ["The dish I like most is pho.", "The dish that I like most is pho.", "The food I like most is pho.", "The food that I like most is pho.", "The dish I like best is pho.", "The dish that I like best is pho.", "The food I like best is pho.", "The food that I like best is pho.", "The dish I like the most is pho.", "The food I like the most is pho.", "The dish which I like most is pho.", "The dish that I like the most is pho.", "The food that I like the most is pho."] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. whose — “có… của người đó / của vật đó”" },
    {
      t: "p",
      text: "**whose** thay cho tính từ sở hữu **his / her / their / its** và **luôn có một danh từ theo sau**: whose **father**, whose **name**, whose **profits**. Dùng được cho **cả người lẫn vật** (công ty, thành phố, ngôi nhà…).",
    },
    {
      t: "table",
      head: ["Hai câu", "Ghép bằng whose", "Dịch"],
      rows: [
        ["I have a friend. **Her** father is a pilot.", "I have a friend **whose father** is a pilot.", "Tôi có một người bạn có bố là phi công."],
        ["That's the girl. I borrowed **her** bike.", "That's the girl **whose bike** I borrowed.", "Đó là cô gái mà tôi đã mượn xe đạp của cô ấy."],
        ["It is a city. **Its** streets are full of trees.", "It is a city **whose streets** are full of trees.", "Đó là thành phố có đường phố rợp cây xanh."],
        ["Students need support. **Their** parents work abroad.", "Students **whose parents** work abroad need support.", "Học sinh có bố mẹ làm việc ở nước ngoài cần được hỗ trợ."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với whose",
      items: [
        "**whose** ≠ **who's**: who's = who is / who has (**Who's** coming?). Viết ~~a man who's car~~ là sai chính tả ngữ pháp → a man **whose** car.",
        "Sau whose là danh từ **không có mạo từ**: ~~whose the father~~ → **whose father**.",
        "Không thêm his / her nữa: ~~a friend whose her father~~ → a friend **whose father**.",
        "Writing Task 2 dùng whose rất “ăn điểm”: **Children whose parents read to them** develop language skills earlier. **Countries whose economies depend on tourism**…",
      ],
    },
    {
      t: "rule",
      formula: "N + whose + N + V … (whose thay his / her / its / their)",
      vi: "whose luôn đi kèm một danh từ ngay sau; dùng cho người và vật; không viết who's.",
    },
    {
      t: "quiz",
      id: "t2d15-whose-dich",
      title: "Dịch sang tiếng Anh — whose (4 câu)",
      kind: "translate",
      grammar: "N + whose + N + V … — whose thay cho his / her / its / their, theo sau là danh từ không mạo từ.",
      items: [
        { q: "Tôi có một người hàng xóm có con trai là ca sĩ.", hint: "I have a neighbour, whose son, is a singer", answers: ["I have a neighbour whose son is a singer.", "I have a neighbor whose son is a singer."] },
        { q: "Đó là người phụ nữ mà xe của cô ấy bị đánh cắp.", hint: "That's the woman, whose car, was stolen", answers: ["That's the woman whose car was stolen.", "That is the woman whose car was stolen.", "That's the woman whose car got stolen.", "That is the woman whose car got stolen."] },
        { q: "Những trẻ em có bố mẹ đọc sách cho nghe thường học nói sớm hơn.", hint: "Children, whose parents, read to them, often learn to speak earlier", answers: ["Children whose parents read to them often learn to speak earlier.", "Children whose parents read to them usually learn to speak earlier.", "Children whose parents read to them often learn to talk earlier.", "Children whose parents read to them usually learn to talk earlier.", "Children whose parents read books to them often learn to speak earlier.", "Children whose parents read books to them usually learn to speak earlier."] },
        { q: "Đó là một công ty có sản phẩm được bán trên toàn thế giới.", hint: "It is a company, whose products, are sold all over the world", answers: ["It is a company whose products are sold all over the world.", "It's a company whose products are sold all over the world.", "It is a company whose products are sold around the world.", "It's a company whose products are sold around the world.", "It is a company whose products are sold worldwide.", "It's a company whose products are sold worldwide.", "That is a company whose products are sold all over the world.", "That is a company whose products are sold worldwide."] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. where (và when) — nơi chốn, thời gian" },
    {
      t: "p",
      text: "**where** = “nơi mà” = **in / at / on which**. Sau where phải là **một câu đầy đủ chủ ngữ + động từ**: the town **where I grew up**, the hotel **where we stayed**. Nếu sau chỗ trống là **động từ** (thiếu chủ ngữ) thì danh từ nơi chốn đó đang làm **chủ ngữ** → dùng **which / that**, không dùng where.",
    },
    {
      t: "table",
      caption: "where hay which? — nhìn ngay sau chỗ trống",
      head: ["Câu", "Sau chỗ trống là", "Chọn", "Vì sao"],
      rows: [
        ["Hoi An is a town ___ **attracts** many tourists.", "động từ (attracts)", "**which / that**", "town làm chủ ngữ của attracts"],
        ["Hoi An is a town ___ **I spent** my holiday.", "chủ ngữ + động từ (I spent)", "**where**", "= I spent my holiday **in** the town"],
        ["This is the hotel ___ **we booked**.", "chủ ngữ + động từ, nhưng book **nhận tân ngữ** (book the hotel)", "**which / that / (bỏ)**", "we booked **the hotel** — không có giới từ in / at"],
        ["This is the hotel ___ **we stayed**.", "chủ ngữ + động từ không nhận tân ngữ (stay)", "**where**", "we stayed **at** the hotel"],
      ],
    },
    {
      t: "p",
      text: "Câu thứ ba và thứ tư là **mẹo then chốt**: cùng “the hotel” nhưng **book** đi thẳng với danh từ (book the hotel) → which / that; **stay** cần giới từ (stay **at** the hotel) → where. Cách khác cũng đúng: đẩy giới từ ra **cuối** mệnh đề — the hotel **(that) we stayed at** — rất phổ biến trong văn nói.",
    },
    {
      t: "table",
      caption: "Ba cách nói cùng một ý — đều đúng",
      head: ["Cách", "Ví dụ", "Văn phong"],
      rows: [
        ["**where** + S + V", "the city **where** I live", "phổ biến, an toàn"],
        ["(that / which) + S + V + **giới từ cuối**", "the city **(that) I live in**", "tự nhiên trong văn nói"],
        ["**giới từ + which** + S + V", "the city **in which** I live", "trang trọng (Writing)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: thừa giới từ, thiếu chủ ngữ",
      items: [
        "~~the house where I grew up **in**~~ → **where** đã chứa sẵn “in” → the house **where I grew up** hoặc the house **I grew up in**.",
        "~~the restaurant where serves pho~~ → sau chỗ trống là động từ → the restaurant **that / which serves** pho.",
        "(thêm) **when** cho thời gian: the day **when** we met · the year **(that)** I started university. Có thể bỏ when hoặc thay bằng that: the day **we met**. Rất hợp cho Part 2 kể sự kiện (Ngày 15 · Nói mục 4).",
      ],
    },
    {
      t: "rule",
      formula: "N (nơi chốn) + where + S + V · = N + (that) + S + V + giới từ · N + when + S + V (thêm)",
      vi: "Sau where là câu đầy đủ chủ ngữ + động từ. Sau chỗ trống là động từ → which / that.",
    },
    {
      t: "quiz",
      id: "t2d15-where-dich",
      title: "Dịch sang tiếng Anh — where / when (5 câu)",
      kind: "translate",
      grammar: "N (nơi chốn) + where + S + V · hoặc N + (that) + S + V + giới từ · N (thời gian) + when + S + V.",
      items: [
        { q: "Đây là ngôi làng nơi ông bà tôi sống.", hint: "This is the village, where, my grandparents live", answers: ["This is the village where my grandparents live.", "This is the village my grandparents live in.", "This is the village that my grandparents live in.", "This is the village which my grandparents live in.", "This is the village in which my grandparents live."] },
        { q: "Tôi nhớ cái ngày chúng tôi đến Melbourne.", hint: "I remember the day, (when), we arrived in Melbourne", answers: ["I remember the day when we arrived in Melbourne.", "I remember the day we arrived in Melbourne.", "I remember the day that we arrived in Melbourne.", "I still remember the day when we arrived in Melbourne.", "I still remember the day we arrived in Melbourne."] },
        { q: "Hội An là một thị trấn thu hút nhiều khách du lịch.", hint: "Hoi An is a town, which / that (sau là động từ), attracts many tourists", answers: ["Hoi An is a town which attracts many tourists.", "Hoi An is a town that attracts many tourists.", "Hoi An is a town which attracts a lot of tourists.", "Hoi An is a town that attracts a lot of tourists.", "Hoi An is a town which attracts lots of tourists.", "Hoi An is a town that attracts lots of tourists."] },
        { q: "Khách sạn chúng tôi ở có một hồ bơi lớn.", hint: "The hotel, where, we stayed, had a big swimming pool", answers: ["The hotel where we stayed had a big swimming pool.", "The hotel we stayed at had a big swimming pool.", "The hotel we stayed in had a big swimming pool.", "The hotel that we stayed in had a big swimming pool.", "The hotel that we stayed at had a big swimming pool.", "The hotel which we stayed at had a big swimming pool.", "The hotel where we stayed had a large swimming pool.", "The hotel we stayed at had a large swimming pool.", "The hotel where we stayed had a big pool.", "The hotel we stayed at had a big pool.", "The hotel in which we stayed had a big swimming pool."] },
        { q: "Đó là quán cà phê nơi tôi thường học bài.", hint: "That's the café, where, I usually study", answers: ["That's the café where I usually study.", "That is the café where I usually study.", "That's the cafe where I usually study.", "That is the cafe where I usually study.", "That's the café where I often study.", "That's the cafe where I often study.", "That's the café I usually study in.", "That's the cafe I usually study in."] },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Chia động từ cho đúng & không dấu phẩy — xác định hay không xác định?" },
    {
      t: "p",
      text: "Hai lỗi “ngầm” làm mất điểm GRA dù bạn đã chọn đúng who / which. **Một**: động từ **trong** mệnh đề chia theo **danh từ đứng trước** đại từ; động từ **chính** của câu chia theo **danh từ chính** (không phải danh từ gần nhất). **Hai**: mệnh đề **xác định** không có dấu phẩy.",
    },
    {
      t: "table",
      caption: "Tìm danh từ chính trước khi chia động từ",
      head: ["Câu", "Danh từ chính", "Đúng / sai"],
      rows: [
        ["A student who **lives** far away **needs** a bus pass.", "a student (số ít)", "✔ lives · needs"],
        ["Students who **live** far away **need** a bus pass.", "students (số nhiều)", "✔ live · need"],
        ["The people who work in this office ~~is~~ **are** very friendly.", "the people (số nhiều)", "office chỉ nằm trong mệnh đề → không quyết định động từ chính"],
        ["One of the girls who ~~sings~~ **sing** in the choir is my sister.", "who = the girls (số nhiều) → sing; câu chính: **One… is**", "hai động từ, hai chủ ngữ khác nhau"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Xác định (hôm nay) ↔ không xác định (chỉ nhận ra, học kỹ ở Tập 3)",
      caption: "Bỏ mệnh đề đi mà câu vẫn rõ là ai / cái nào → đó là thông tin THÊM → có dấu phẩy (không xác định). Bỏ đi mà câu mơ hồ → xác định, không dấu phẩy.",
      cols: [
        {
          title: "**Xác định** (defining)",
          items: [
            "chỉ rõ **ai / cái nào** — bỏ đi câu thiếu nghĩa",
            "**không** dấu phẩy",
            "dùng được **that**; lược bỏ được đại từ tân ngữ",
            "The students **who passed** got a certificate. (chỉ những bạn đỗ)",
          ],
        },
        {
          title: "**Không xác định** (non-defining)",
          items: [
            "thêm thông tin về người / vật **đã rõ** (tên riêng, my mother…)",
            "**có** dấu phẩy hai đầu",
            "**không** dùng that; **không** lược bỏ đại từ",
            "My mother, **who is a nurse**, works at night.",
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai: dấu phẩy và động từ",
      items: [
        "~~People, who exercise regularly, sleep better.~~ → **People who exercise regularly sleep better.** Có dấu phẩy thì câu lại thành “mọi người (ai cũng) tập thể dục…” — sai ý.",
        "~~Hanoi that is the capital of Vietnam~~ → tên riêng đã rõ → không xác định: **Hanoi, which is the capital of Vietnam, …** (nhận ra là đủ; Tập 3 sẽ luyện).",
        "Viết xong câu dài, **gạch dưới danh từ chính** và **động từ chính**; kiểm số ít / số nhiều — đây là một trong 6 lượt tự soát bạn sẽ học kỹ ở Tập 3.",
      ],
    },
    {
      t: "rule",
      formula: "N (số ít) + who + V(s/es) … + V(s/es) chính · N (số nhiều) + who + V … + V chính — xác định: không dấu phẩy",
      vi: "Động từ trong mệnh đề theo danh từ đứng trước đại từ; động từ chính theo danh từ chính của câu.",
    },
    {
      t: "quiz",
      id: "t2d15-chia-dich",
      title: "Dịch sang tiếng Anh — chia động từ đúng (4 câu)",
      kind: "translate",
      grammar: "N + who / which / that + V (chia theo N) … + V chính (chia theo danh từ chính). Mệnh đề xác định không có dấu phẩy.",
      items: [
        { q: "Một nhân viên làm việc ở nhà cần một chiếc máy tính tốt.", hint: "An employee, who, works from home, needs a good computer", answers: ["An employee who works from home needs a good computer.", "An employee that works from home needs a good computer.", "An employee who works at home needs a good computer.", "An employee that works at home needs a good computer.", "A worker who works from home needs a good computer.", "A staff member who works from home needs a good computer."] },
        { q: "Những người sống gần biển thường bơi giỏi.", hint: "People, who, live near the sea, are often good at swimming / swim well", answers: ["People who live near the sea are often good at swimming.", "People that live near the sea are often good at swimming.", "People who live near the sea often swim well.", "People that live near the sea often swim well.", "People who live near the sea are usually good at swimming.", "People who live near the sea usually swim well.", "People who live by the sea are often good at swimming.", "People who live by the sea often swim well.", "People who live near the sea are often good swimmers.", "People who live near the sea are usually good swimmers."] },
        { q: "Những thành phố có nhiều công viên dễ sống hơn.", hint: "Cities, which / that, have many parks, are more liveable / easier to live in", answers: ["Cities which have many parks are more liveable.", "Cities that have many parks are more liveable.", "Cities which have many parks are easier to live in.", "Cities that have many parks are easier to live in.", "Cities which have a lot of parks are more liveable.", "Cities that have a lot of parks are more liveable.", "Cities which have a lot of parks are easier to live in.", "Cities that have a lot of parks are easier to live in.", "Cities with many parks are more liveable.", "Cities with many parks are easier to live in.", "Cities that have many parks are more livable.", "Cities which have many parks are more livable."] },
        { q: "Người đàn ông đứng cạnh các cô gái đó là bố tôi.", hint: "The man, who, is standing next to those girls, is my father", answers: ["The man who is standing next to those girls is my father.", "The man that is standing next to those girls is my father.", "The man who is standing next to those girls is my dad.", "The man that is standing next to those girls is my dad.", "The man who is standing beside those girls is my father.", "The man who is standing beside those girls is my dad.", "The man who stands next to those girls is my father."] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Áp vào bài thi IELTS" },
    {
      t: "table",
      caption: "Mệnh đề quan hệ ở cả 4 kỹ năng",
      head: ["Phần thi", "Dùng thế nào", "Ví dụ"],
      rows: [
        ["**Writing Task 2**", "nói rõ **nhóm người / loại việc** mình bàn tới — thay cho nhiều câu đơn", "**People who work long hours** often have little time for exercise. · **Countries where public transport is cheap** have fewer cars."],
        ["**Writing Task 1**", "gọi tên hạng mục có đặc điểm nổi bật", "Japan was **the country which / that had the highest** figure. · The group **whose spending rose most** was teenagers."],
        ["**Speaking Part 2**", "thêm chi tiết về người, nơi, thời điểm", "It was held in **a small park where we used to play** as children. · the cousin **who organised everything** · the moment **when** the lights went off"],
        ["**Reading / Listening**", "tìm **danh từ chính** của câu dài: bỏ phần who / which… trong đầu", "The scientists **who studied the reef** found that the coral **which had died** was older. → danh từ chính: **the scientists … found**"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "Students who live in big cities have more chances to practise English.", vi: "Học sinh sống ở thành phố lớn có nhiều cơ hội luyện tiếng Anh hơn. (Task 2 — câu chủ đề)" },
        { en: "The age group that spent the most time online was 16–24.", vi: "Nhóm tuổi dành nhiều thời gian trực tuyến nhất là 16–24. (Task 1)" },
        { en: "There are many people whose jobs depend on tourism.", vi: "Có nhiều người có công việc phụ thuộc vào du lịch. (Task 2 — ví dụ)" },
        { en: "I'd like to describe a festival which takes place in my hometown every spring.", vi: "Tôi muốn kể về một lễ hội diễn ra ở quê tôi mỗi mùa xuân. (Part 2 — câu mở đầu)" },
      ],
    },
    {
      t: "rule",
      formula: "Task 2: People / Children / Countries + who / whose / where … + V chính · Task 1: the N + that + had the highest …",
      vi: "Một mệnh đề quan hệ đúng thay được hai câu đơn — vừa tăng độ đa dạng câu (GRA), vừa giúp ý rõ hơn (TR).",
    },
    {
      t: "mcq",
      id: "t2d15-np-kiem-nhanh",
      title: "Kiểm nhanh cả bài (10 câu)",
      items: [
        { q: "The nurse ___ looked after my grandmother was very patient.", options: ["which", "who", "whose"], correct: 1, why: "Danh từ trước là **người** (the nurse) và sau chỗ trống là **động từ** (looked after) → **who** làm chủ ngữ. which dùng cho vật; whose phải có danh từ theo sau." },
        { q: "This is the laptop ___ I bought for university.", options: ["(that)", "who", "where"], correct: 0, why: "laptop là **vật**; sau chỗ trống là **I bought** (chủ ngữ + động từ) → đại từ làm **tân ngữ** → **that / which** hoặc **bỏ hẳn**. who chỉ người; where cần câu không thiếu tân ngữ (bought the laptop → thiếu tân ngữ)." },
        { q: "I met a man ___ son plays for the national team.", options: ["who", "who's", "whose"], correct: 2, why: "Sau chỗ trống là danh từ **son** → sở hữu (con trai **của ông ấy**) → **whose**. who's = who is." },
        { q: "Da Lat is a city ___ the weather is cool all year round.", options: ["where", "which", "that"], correct: 0, why: "Sau chỗ trống là câu đầy đủ **the weather is cool** → “nơi mà” → **where** (= in which). which / that cần chỗ trống làm chủ ngữ hoặc tân ngữ." },
        { q: "Da Lat is a city ___ attracts many young travellers.", options: ["where", "who", "which"], correct: 2, why: "Sau chỗ trống là **động từ** attracts → city làm chủ ngữ → **which / that**. ~~where attracts~~ là lỗi rất hay gặp." },
        { q: "Choose the correct sentence.", options: ["The book that I borrowed it was interesting.", "The book I borrowed was interesting.", "The book what I borrowed was interesting."], correct: 1, why: "Lược bỏ đại từ tân ngữ là đúng: the book **I borrowed**. A thừa **it**; C dùng **what** sau danh từ — sai." },
        { q: "Choose the correct sentence.", options: ["People, who recycle, help the environment.", "People who recycle helps the environment.", "People who recycle help the environment."], correct: 2, why: "Mệnh đề **xác định** → không dấu phẩy (loại A). Danh từ chính **People** số nhiều → **help** (loại B)." },
        { q: "It was the most exciting match ___ I have ever watched.", options: ["that", "what", "who"], correct: 0, why: "Sau **so sánh nhất** (the most exciting) dùng **that** (hoặc bỏ). what không đứng sau danh từ; who chỉ người." },
        { q: "That's the restaurant ___ we had dinner on my birthday.", options: ["which", "where", "whose"], correct: 1, why: "**we had dinner** đã đủ (had dinner = tân ngữ là dinner) → cần “**ở đó**” → **where** (= at which). which sẽ cần “we had dinner **at**”." },
        { q: "In which sentence can the relative pronoun be left out?", options: ["The girl who sits next to me is from Perth.", "The man who fixed my bike was friendly.", "The festival which we went to was crowded."], correct: 2, why: "Chỉ ở C, sau **which** là **we went to** (chủ ngữ + động từ) → which làm **tân ngữ** (của to) → bỏ được: the festival **we went to**. Ở A, B sau đại từ là động từ (sits, fixed) → làm chủ ngữ → không bỏ được." },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Luyện ghép câu: biến chuỗi câu đơn “gãy vụn” thành câu phức" },
    {
      t: "p",
      text: "Bài viết band 4–5 hay có **3–4 câu đơn ngắn liền nhau**, mỗi câu nhắc lại danh từ của câu trước: “I have a cousin. My cousin is a nurse. She works in a big hospital. The hospital is in Hanoi.” Đọc lên nghe **gãy vụn** (choppy), và giám khảo thấy bạn chưa biết nối câu. Mệnh đề quan hệ là cách ghép nhanh nhất: danh từ bị lặp ở câu sau → thay bằng **who / which / where / whose**.",
    },
    {
      t: "table",
      caption: "Trước – sau: cùng ý, ít câu hơn, rõ hơn",
      head: ["Câu đơn gãy vụn (band 4–5)", "Ghép bằng mệnh đề quan hệ (band 5.5–6)"],
      rows: [
        ["~~I have a cousin. My cousin is a nurse. She works in Hanoi.~~", "I have a cousin **who** is a nurse in Hanoi."],
        ["~~Many people buy cheap clothes. These clothes are thrown away quickly.~~", "Many people buy cheap clothes **which** are thrown away quickly."],
        ["~~We visited a village. People make pottery there.~~", "We visited a village **where** people make pottery."],
        ["~~Some students have part-time jobs. Their marks are often lower.~~", "Students **whose** jobs take up a lot of time often get lower marks."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: câu đơn ngắn không xấu — chỉ xấu khi đứng thành chuỗi",
      items: [
        "Một câu đơn ngắn **sau** một câu dài là cách **chốt ý** rất mạnh: “Cheap clothes are thrown away after a few months, which creates huge amounts of waste. **This has to change.**”",
        "Quy tắc tự soát: thấy **ba câu đơn liền nhau** cùng nói về một danh từ → ghép ít nhất hai câu lại. Câu ghép không nên quá ~30 từ.",
      ],
    },
    {
      t: "rule",
      formula: "Câu 1 + Câu 2 (lặp danh từ) → N + who / which / where / whose + phần còn lại của câu 2",
      vi: "Danh từ bị nhắc lại ở câu sau là dấu hiệu ghép được bằng mệnh đề quan hệ.",
    },
    {
      t: "quiz",
      id: "t2d15-ghep-cau",
      title: "Ghép thành MỘT câu bằng who / which / where / whose (5 câu)",
      kind: "translate",
      grammar: "Bỏ danh từ / đại từ bị lặp ở câu sau, thay bằng who (người) · which / that (vật) · where (nơi + câu đủ) · whose (của…).",
      items: [
        {
          q: "Ghép: My uncle is a farmer. He grows coffee in Dak Lak.",
          hint: "My uncle is a farmer who…",
          answers: ["My uncle is a farmer who grows coffee in Dak Lak.", "My uncle is a farmer that grows coffee in Dak Lak.", "My uncle, who is a farmer, grows coffee in Dak Lak.", "My uncle is a farmer who grows coffee in Daklak."],
        },
        {
          q: "Ghép: Many teenagers play online games. These games keep them awake at night.",
          hint: "Many teenagers play online games which / that…",
          answers: ["Many teenagers play online games which keep them awake at night.", "Many teenagers play online games that keep them awake at night.", "Many teenagers play online games, which keep them awake at night."],
        },
        {
          q: "Ghép: I grew up in a small town. Everyone knows each other there.",
          hint: "I grew up in a small town where…",
          answers: ["I grew up in a small town where everyone knows each other.", "I grew up in a small town in which everyone knows each other.", "I grew up in a small town where everybody knows each other.", "I grew up in a small town where everyone knew each other."],
        },
        {
          q: "Ghép: Workers should get extra pay. Their jobs are dangerous.",
          hint: "Workers whose jobs…",
          answers: ["Workers whose jobs are dangerous should get extra pay.", "Workers whose jobs are dangerous should receive extra pay.", "Workers whose jobs are dangerous should be given extra pay."],
        },
        {
          q: "Ghép: The festival was very crowded. We went to it last weekend.",
          hint: "The festival (which / that) we went to last weekend…",
          answers: ["The festival we went to last weekend was very crowded.", "The festival which we went to last weekend was very crowded.", "The festival that we went to last weekend was very crowded.", "The festival to which we went last weekend was very crowded."],
        },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Nghe ─────────────────────────── */

const T2D15_LISTENING: Lesson = {
  id: "t2d15-nghe",
  kind: "listening",
  title: "Nghe: Part 1 + Part 2 giọng Úc — điền phiếu, trắc nghiệm, bản đồ",
  goal: "Nhận ra 5 đặc điểm của giọng Úc và các từ kiểu Úc hay gặp, rồi làm trọn một bài Part 1 (10 câu điền phiếu) và một bài Part 2 (5 câu trắc nghiệm + 5 câu bản đồ) mà không bị “khựng” vì giọng lạ — đích P1+P2 ≥ 14/20 (Listening band 5.0).",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Đề IELTS Listening trộn giọng **Anh, Úc, New Zealand, Mỹ, Canada**. Giọng Úc xuất hiện **rất thường xuyên**, nhất là Part 1–2 (đặt tour, thuê đồ, giới thiệu sự kiện).",
        "Năm đặc điểm cần nhận ra: ==day nghe như “die”==, ==nice nghe như “noice”==, **không cuốn r** (như giọng Anh), **t giữa hai nguyên âm** đọc nhẹ như d (water → “wadda”), **lên giọng cuối câu kể**.",
        "Từ kiểu Úc hay gặp: **G'day · no worries · reckon · heaps · arvo · brekkie · servo · uni**; chữ H đọc **“haitch”**, chữ Z đọc **“zed”**.",
        "Hai bài luyện: **Part 1** (Questions 1–10, điền phiếu đặt tour xe đạp) · **Part 2** (Questions 11–20, trắc nghiệm + **bản đồ** lễ hội đèn lồng).",
        "Đẩy band nào: **Listening 4.5 → 5.0** — đích cuối Tập 2 là **P1 + P2 ≥ 14/20**. Giọng lạ không được là lý do mất câu dễ.",
      ],
    },
    {
      t: "note",
      title: "Lưu ý về giọng đọc trong bài này",
      items: [
        "Nghe giọng Úc thật: các nhân vật người Úc trong bài (**Brett** ở Part 1, **Jess** ở Part 2, **Kate** ở bài tập) được đọc bằng **giọng Úc (en-AU)**; người dẫn đài và Linh / Sam giữ giọng Anh / Mỹ để bạn so sánh ngay trong một bài.",
        "Khi nghe, đối chiếu từng chỗ với **bảng mô tả + từ ngữ kiểu Úc** ở mục 2–3: day ≈ “die”, không cuốn r, t giữa từ nhẹ như d, G'day · arvo · heaps · reckon. Muốn nghe thêm: xem video gắn ở đầu bài (nếu có) hoặc tìm “Australian accent IELTS listening”.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Vì sao phải làm quen giọng Úc?" },
    {
      t: "p",
      text: "IELTS do ba tổ chức cùng làm, trong đó có **IDP (Úc)**, nên giọng Úc là giọng “quen mặt” của đề thi. Người học Việt Nam thường chỉ nghe giọng Mỹ (phim) và giọng Anh (sách) — lần đầu gặp giọng Úc trong phòng thi dễ **khựng 2–3 giây**, và trong Listening, 3 giây là đủ để lỡ một đáp án. Tin tốt: giọng Úc **rất gần giọng Anh**; chỉ cần quen **năm điểm khác** dưới đây.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ba giọng hay gặp nhất trong đề",
      caption: "Giọng Úc giống giọng Anh ở chữ r (không cuốn), giống giọng Mỹ ở chữ t giữa từ; khác cả hai ở các nguyên âm đôi /eɪ/ và /aɪ/.",
      cols: [
        { title: "**Anh (UK)**", anh: "globe-showing-europe-africa", items: ["car /kɑː/ — không cuốn r", "water: t rõ", "day /deɪ/"] },
        { title: "**Mỹ (US)**", anh: "globe-showing-americas", items: ["car /kɑːr/ — cuốn r", "water → “wadder”", "day /deɪ/"] },
        { title: "**Úc (AU)**", anh: "globe-showing-asia-australia", items: ["car /kɑː/ — không cuốn r", "water → “wadda”", "day → gần “die”"] },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Năm đặc điểm của giọng Úc" },
    {
      t: "table",
      caption: "So sánh Anh – Mỹ – Úc (phiên âm gần đúng, để tai biết chờ âm gì)",
      head: ["Đặc điểm", "Anh (UK)", "Mỹ (US)", "Úc (AU)", "Ví dụ dễ nghe nhầm"],
      rows: [
        ["① Âm /eɪ/ (day, name, eight)", "/deɪ/", "/deɪ/", "mở rộng, gần **/daɪ/**", "**today** nghe như “to die”; **eight** như “ite”; **mate** như “mite”"],
        ["② Âm /aɪ/ (nice, like, time)", "/naɪs/", "/naɪs/", "lùi về sau, gần **“noice”**", "**five** nghe như “foive”; **right** như “roight”"],
        ["③ Chữ r sau nguyên âm", "**không** đọc", "**cuốn r**", "**không** đọc (như Anh)", "**car, park, four** — không nghe tiếng r"],
        ["④ t giữa hai nguyên âm", "t rõ", "đọc nhẹ như d", "đọc nhẹ như d (như Mỹ)", "**water** “wadda” · **thirty** “thirdy” · **better** “bedda”"],
        ["⑤ Ngữ điệu câu kể", "xuống cuối câu", "xuống cuối câu", "hay **lên giọng** cuối câu kể", "“We meet at the surf club ↗” — **không phải câu hỏi**"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: những chỗ giọng Úc dễ đánh lừa trong đề",
      items: [
        "**Số có 8 và 5**: “eight” (gần “ite”) và “five” (gần “foive”) — nghe kỹ, rồi đọc lại con số trong đầu. Người nói trong Part 1 thường **nhắc lại** số — tận dụng lần nhắc đó.",
        "**-ty và -teen**: thirty “thirdy” vẫn **nhấn âm đầu** (THIR-dy), thirteen **nhấn âm sau** (thir-TEEN) — dựa vào trọng âm, không dựa vào chữ t.",
        "**Lên giọng cuối câu kể** (high rising terminal) **không** có nghĩa người nói đang hỏi hay đang không chắc; đó chỉ là thói quen giữ người nghe chú ý.",
        "Đánh vần: nhiều người Úc đọc chữ **H** là **“haitch”** /heɪtʃ/ (không phải “aitch” /eɪtʃ/), và **Z** là **“zed”** (như Anh, không phải “zee” như Mỹ).",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Từ ngữ kiểu Úc hay gặp (nhận ra khi nghe)" },
    {
      t: "p",
      text: "Đề IELTS dùng giọng Úc **nhẹ, rõ**, không dùng tiếng lóng nặng. Nhưng một số từ thân mật rất hay lọt vào lời thoại Part 1 — biết trước thì không bị khựng. Bạn **không cần** dùng chúng khi thi Nói; chỉ cần **hiểu**.",
    },
    {
      t: "vocab",
      items: [
        { w: "G'day", pos: "exclamation", ipa: "/ɡəˈdeɪ/", vi: "chào (kiểu Úc, = hello / good day)", ex: "G'day, Coastline Bike Tours, Brett speaking.", exVi: "Xin chào, Công ty tour xe đạp Coastline, Brett nghe đây.", more: "Thân mật, dùng cả ngày (không chỉ buổi sáng). Viết có dấu **'** vì là dạng rút gọn của **good day**." },
        { w: "no worries", pos: "phrase", ipa: "/ˌnəʊ ˈwʌriz/", vi: "không sao / được thôi / không có gì", ex: "\"Thanks for your help.\" \"No worries!\"", exVi: "“Cảm ơn anh đã giúp.” “Không có gì!”", more: "Dùng để **đồng ý** (= sure), **đáp lời cảm ơn** (= you're welcome) hoặc **xin lỗi** (= it's fine). Giọng Anh / Mỹ nói **no problem**." },
        { w: "reckon", pos: "v", ipa: "/ˈrekən/", vi: "nghĩ là, cho là (= think)", ex: "I reckon the electric bikes are the smart choice.", exVi: "Tôi nghĩ xe đạp điện là lựa chọn khôn ngoan.", more: "Cả người Anh lẫn người Úc dùng trong văn nói. **I reckon (that) + S + V**. Không dùng trong Writing Task 2 (quá thân mật) — viết **I believe / I think**." },
        { w: "heaps", pos: "n / adv (informal)", ipa: "/hiːps/", vi: "rất nhiều (heaps of = a lot of); rất (heaps easier = much easier)", ex: "There are heaps of food stalls this year.", exVi: "Năm nay có rất nhiều quầy đồ ăn.", more: "**heaps of + N** = a lot of · **heaps + so sánh hơn** = much: heaps **better**, heaps **easier**." },
        { w: "arvo", pos: "n (informal, AU)", ipa: "/ˈɑːvəʊ/", vi: "buổi chiều (= afternoon)", ex: "The workshops are on every arvo between three and five.", exVi: "Các buổi làm đèn diễn ra mỗi chiều từ ba đến năm giờ.", more: "**this arvo** = this afternoon. Người Úc hay rút gọn từ rồi thêm **-o / -ie**: arvo, servo, brekkie." },
        { w: "brekkie", pos: "n (informal, AU)", ipa: "/ˈbreki/", vi: "bữa sáng (= breakfast)", ex: "Let's grab some brekkie before the tour.", exVi: "Đi ăn sáng chút trước khi đi tour nhé.", more: "Cũng viết **brekky**. Người Anh cũng hay nói (thân mật)." },
        { w: "servo", pos: "n (informal, AU)", ipa: "/ˈsɜːvəʊ/", vi: "trạm xăng (= service station / petrol station)", ex: "Don't wait at the servo — the bikes are at the surf club.", exVi: "Đừng đợi ở trạm xăng — xe đạp ở câu lạc bộ lướt sóng.", more: "Anh: **petrol station** · Mỹ: **gas station** · Úc: **servo**. Trong đề, người nói thường giải thích ngay sau đó (“that's a petrol station”)." },
        { w: "uni", pos: "n (informal)", ipa: "/ˈjuːni/", vi: "trường đại học (= university)", ex: "We're all at uni here in Brisbane.", exVi: "Bọn em đều đang học đại học ở Brisbane.", more: "Úc và Anh nói **at uni**; Mỹ nói **in college**. ~~at the uni~~ — không có the." },
      ],
    },
    {
      t: "mcq",
      id: "t2d15-nghe-tu-uc",
      title: "Hiểu từ kiểu Úc trong ngữ cảnh (5 câu)",
      items: [
        { q: "\"Can you call me back this arvo?\" — When should you call?", options: ["this morning", "this afternoon", "this evening"], correct: 1, why: "**arvo** = afternoon. Mẹo: arvo = **af**(ternoon) cắt ngắn (f đọc thành v) + đuôi **-o** kiểu Úc." },
        { q: "\"The beach is heaps better in winter.\" — The speaker thinks the beach in winter is…", options: ["a little better", "much better", "worse"], correct: 1, why: "**heaps + so sánh hơn** = much / far → **much better**." },
        { q: "\"I reckon we should leave early.\" — reckon means…", options: ["think", "remember", "count"], correct: 0, why: "**reckon** = think (cho là). Nghĩa “đếm, tính” rất cũ, gần như không dùng trong hội thoại." },
        { q: "\"Sorry I'm late!\" — \"No worries.\" The second speaker means…", options: ["\"Don't be late again.\"", "\"I'm worried about you.\"", "\"It's fine, don't worry.\""], correct: 2, why: "**No worries** đáp lời xin lỗi = it's fine / no problem. Không phải lời trách." },
        { q: "\"My surname starts with haitch.\" — What is the first letter?", options: ["H", "A", "E"], correct: 0, why: "Nhiều người Úc đọc chữ **H** là **haitch** /heɪtʃ/. Người Anh / Mỹ thường đọc **aitch** /eɪtʃ/." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Practice 1 — Part 1: đặt tour xe đạp (Questions 1–10)" },
    {
      t: "p",
      text: "Nhắc lại chiến thuật Part 1 (Tập 1 Ngày 7 và 15; Tập 2 Ngày 1): **đọc trước** cả phiếu, đoán **loại từ** của từng chỗ trống (tên? số? giờ? ngày?), để ý **giới hạn số từ**, và cảnh giác ba bẫy: **đổi ý** (Wednesday… no, full), **hai con số** (giá gốc ↔ giá sau giảm), **thông tin bị loại** (the River Trail is booked out). Đáp án luôn đi **theo thứ tự** phiếu.",
    },
    {
      t: "canh",
      anh: ["telephone-receiver", "man-biking", "woman-student", "beach-with-umbrella"],
      caption: "Linh, một sinh viên Việt Nam đang học ở Brisbane, gọi cho công ty **Coastline Bike Tours** ở Noosa (bang Queensland, Úc) để đặt tour xe đạp ven biển cho nhóm bạn. Nhân viên Brett là người Úc.",
    },
    {
      t: "table",
      caption: "Coastline Bike Tours — Booking form · Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer. (Hoàn thành phiếu. Viết KHÔNG QUÁ HAI TỪ VÀ/HOẶC MỘT CON SỐ cho mỗi câu.)",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Tour", "the **(1) ______** Trail"],
        ["Day", "**(2) ______**"],
        ["Meeting point", "out the front of the **(3) ______** on Beach Road"],
        ["Start time", "**(4) ______** a.m."],
        ["Number of riders", "**(5) ______**"],
        ["Name", "Linh **(6) ______**"],
        ["Mobile", "**(7) ______**"],
        ["Staying at", "the **(8) ______** Hostel"],
        ["Type of bike", "**(9) ______** bike"],
        ["Total price", "$ **(10) ______**"],
      ],
    },
    {
      t: "listen",
      id: "t2d15-nghe-p1",
      title: "Booking a bike tour in Noosa",
      dan: { so: "Day 15, Practice 1 (Listening Part 1)", boiCanh: "a telephone conversation between a man who works for a bike tour company and a student who wants to book a tour.", cau: [1, 10] },
      note: "Khoảng 3 phút, hai giọng: Brett (nhân viên người Úc, giọng Úc, nam) và Linh (sinh viên, giọng Mỹ, nữ). Nghe tối đa 2 lần; chưa mở lời thoại cho tới khi điền xong 10 chỗ trống. Để ý các từ kiểu Úc: G'day, no worries, heaps, servo, reckon, haitch, arvo.",
      lines: [
        { who: "Brett", voice: "au-nam", text: "G'day, Coastline Bike Tours, Brett speaking. How can I help?", vi: "Xin chào, Công ty tour xe đạp Coastline, Brett nghe đây. Tôi giúp gì được?" },
        { who: "Linh", voice: "us-nu", text: "Hi. I'd like to book a bike tour for this week, please.", vi: "Chào anh. Tôi muốn đặt một tour xe đạp trong tuần này ạ." },
        { who: "Brett", voice: "au-nam", text: "No worries. Which tour were you thinking of? We've got the River Trail and the Lighthouse Trail.", vi: "Được thôi. Bạn đang nghĩ tới tour nào? Bên tôi có tuyến Bờ Sông và tuyến Ngọn Hải Đăng." },
        { who: "Linh", voice: "us-nu", text: "A friend told me the River Trail is lovely.", vi: "Một người bạn bảo tôi tuyến Bờ Sông rất đẹp." },
        { who: "Brett", voice: "au-nam", text: "It is, but I'm afraid it's booked out all week. There are heaps of school groups at the moment. The Lighthouse Trail has got places, though, and to be honest, it's my favourite. You ride along the coast and finish at the old lighthouse.", vi: "Đúng vậy, nhưng tiếc là tuần này kín chỗ rồi. Dạo này rất nhiều đoàn học sinh. Tuyến Ngọn Hải Đăng thì còn chỗ, và thật lòng mà nói đó là tuyến tôi thích nhất. Bạn đạp dọc bờ biển và kết thúc ở ngọn hải đăng cổ." },
        { who: "Linh", voice: "us-nu", text: "OK, let's do the Lighthouse Trail, then.", vi: "Vâng, vậy đi tuyến Ngọn Hải Đăng ạ." },
        { who: "Brett", voice: "au-nam", text: "Beauty. What day suits you?", vi: "Tuyệt. Ngày nào tiện cho bạn?" },
        { who: "Linh", voice: "us-nu", text: "Wednesday, if possible.", vi: "Thứ Tư, nếu được ạ." },
        { who: "Brett", voice: "au-nam", text: "Sorry, Wednesday's full. I can do Thursday or Saturday.", vi: "Tiếc quá, thứ Tư kín rồi. Tôi xếp được thứ Năm hoặc thứ Bảy." },
        { who: "Linh", voice: "us-nu", text: "Thursday is better. We fly home on Saturday.", vi: "Thứ Năm thì hơn ạ. Thứ Bảy bọn tôi bay về rồi." },
        { who: "Brett", voice: "au-nam", text: "Thursday it is. Now, we meet out the front of the surf club on Beach Road. There's a servo right next to it, that's a petrol station, but please don't wait there, because all the bikes are lined up at the surf club.", vi: "Vậy thứ Năm. Giờ thì, chúng ta gặp nhau trước cửa câu lạc bộ lướt sóng trên đường Beach. Ngay cạnh đó có một cái servo, tức là trạm xăng, nhưng đừng đợi ở đó nhé, vì xe đạp đều xếp sẵn ở câu lạc bộ lướt sóng." },
        { who: "Linh", voice: "us-nu", text: "The surf club, not the petrol station. Got it. And what time do you start?", vi: "Câu lạc bộ lướt sóng, không phải trạm xăng. Tôi hiểu rồi. Mấy giờ thì bắt đầu ạ?" },
        { who: "Brett", voice: "au-nam", text: "In summer we head off at eight, but this time of year the mornings are a bit cooler, so we start at half past eight. Try to get there ten minutes early.", vi: "Mùa hè bọn tôi xuất phát lúc tám giờ, nhưng thời điểm này buổi sáng hơi lạnh hơn nên bắt đầu lúc tám rưỡi. Cố tới sớm mười phút nhé." },
        { who: "Linh", voice: "us-nu", text: "Half past eight. OK.", vi: "Tám rưỡi. Vâng." },
        { who: "Brett", voice: "au-nam", text: "And how many people?", vi: "Còn bao nhiêu người?" },
        { who: "Linh", voice: "us-nu", text: "There were going to be four of us, but my friend Mai has to work on Thursday, so just three.", vi: "Định là bốn người, nhưng bạn Mai của tôi phải đi làm hôm thứ Năm, nên chỉ ba thôi." },
        { who: "Brett", voice: "au-nam", text: "Three riders. Can I take a name for the booking?", vi: "Ba người đạp. Cho tôi xin tên để đặt chỗ?" },
        { who: "Linh", voice: "us-nu", text: "Yes, it's Linh Hoang. Hoang is H, O, A, N, G.", vi: "Vâng, Linh Hoàng. Hoang là H, O, A, N, G." },
        { who: "Brett", voice: "au-nam", text: "Sorry, was the first letter haitch?", vi: "Xin lỗi, chữ đầu là “haitch” (H) phải không?" },
        { who: "Linh", voice: "us-nu", text: "Yes, H for hotel.", vi: "Vâng, H trong hotel." },
        { who: "Brett", voice: "au-nam", text: "Lovely. H, O, A, N, G. And a mobile number?", vi: "Tốt. H, O, A, N, G. Còn số di động?" },
        { who: "Linh", voice: "us-nu", text: "It's an Australian number. Oh four one two, double five seven, three nine one.", vi: "Là số Úc ạ. Không bốn một hai, hai số năm bảy, ba chín một." },
        { who: "Brett", voice: "au-nam", text: "Oh four one two, five five seven, three nine one. And where are you staying, in case we need to drop anything off?", vi: "Không bốn một hai, năm năm bảy, ba chín một. Bạn đang ở đâu, phòng khi bọn tôi cần mang gì tới?" },
        { who: "Linh", voice: "us-nu", text: "At the Palm Grove Hostel. That's Palm, P, A, L, M, and then Grove, G, R, O, V, E.", vi: "Ở nhà nghỉ Palm Grove. Palm là P, A, L, M, rồi Grove là G, R, O, V, E." },
        { who: "Brett", voice: "au-nam", text: "Oh, I know it. It's just near the river. Now, bikes. Most people take a mountain bike on this trail, but there's a fair bit of hill at the end, up to the lighthouse.", vi: "À, tôi biết chỗ đó, ngay gần sông. Giờ đến xe. Đa số mọi người đi xe đạp địa hình cho tuyến này, nhưng đoạn cuối lên ngọn hải đăng khá nhiều dốc." },
        { who: "Linh", voice: "us-nu", text: "Hmm. None of us ride very often. Do you have electric bikes?", vi: "Hừm. Bọn tôi chẳng ai đạp xe thường xuyên. Bên anh có xe đạp điện không?" },
        { who: "Brett", voice: "au-nam", text: "We sure do. They make the hill heaps easier. I reckon that's the smart choice.", vi: "Có chứ. Chúng làm con dốc dễ hơn nhiều. Tôi nghĩ đó là lựa chọn khôn ngoan." },
        { who: "Linh", voice: "us-nu", text: "Then electric, please, for all three of us.", vi: "Vậy xe điện ạ, cho cả ba người." },
        { who: "Brett", voice: "au-nam", text: "Easy. Helmets are included, so you don't need to bring your own. Now, the price. It's normally sixty-five dollars per person for an electric bike.", vi: "Dễ thôi. Có sẵn mũ bảo hiểm nên không cần mang theo. Giờ đến giá. Bình thường xe điện là sáu mươi lăm đô một người." },
        { who: "Linh", voice: "us-nu", text: "Do you have a student discount? We're all at uni here.", vi: "Bên anh có giảm giá cho sinh viên không? Bọn tôi đều đang học đại học ở đây." },
        { who: "Brett", voice: "au-nam", text: "We do. It's ten dollars off each, if you show your student card on the day. So, three students at fifty-five dollars, that's one hundred and sixty-five dollars all up.", vi: "Có. Giảm mười đô mỗi người, nếu trình thẻ sinh viên hôm đi. Vậy ba sinh viên, mỗi người năm mươi lăm đô, tổng cộng là một trăm sáu mươi lăm đô." },
        { who: "Linh", voice: "us-nu", text: "Great. Can I pay on the day?", vi: "Tuyệt. Tôi trả tiền hôm đó được không?" },
        { who: "Brett", voice: "au-nam", text: "Sure, card or cash, either's fine. And if it looks like rain, we'll text you the arvo before. See you Thursday!", vi: "Được, thẻ hay tiền mặt đều được. Nếu trời có vẻ mưa, bọn tôi sẽ nhắn tin cho bạn vào chiều hôm trước. Hẹn gặp thứ Năm!" },
        { who: "Linh", voice: "us-nu", text: "Thanks so much, Brett. Bye.", vi: "Cảm ơn anh nhiều, Brett. Chào anh." },
      ],
    },
    {
      t: "quiz",
      id: "t2d15-nghe-p1-dien",
      title: "Questions 1–10 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Tour: the ___ Trail", answers: ["Lighthouse"] },
        { q: "(2) Day: ___", answers: ["Thursday"] },
        { q: "(3) Meeting point: out the front of the ___ on Beach Road", answers: ["surf club"] },
        { q: "(4) Start time: ___ a.m.", answers: ["8.30", "8:30", "eight thirty", "8.30 a.m.", "8:30 a.m."] },
        { q: "(5) Number of riders: ___", answers: ["3", "three"] },
        { q: "(6) Name: Linh ___", answers: ["Hoang"] },
        { q: "(7) Mobile: ___", answers: ["0412 557 391", "0412557391", "0412 557391", "0412-557-391"] },
        { q: "(8) Staying at: the ___ Hostel", answers: ["Palm Grove"] },
        { q: "(9) Type of bike: ___ bike", answers: ["electric"] },
        { q: "(10) Total price: $ ___", answers: ["165", "165.00", "$165"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 1–10",
      items: [
        "**(1) Lighthouse** — Brett nêu **hai** tuyến; **River Trail** “booked out all week” (kín chỗ) → bị loại. Linh chốt: “let's do the **Lighthouse** Trail”.",
        "**(2) Thursday** — bẫy **đổi ý**: Linh xin **Wednesday**, Brett: “Wednesday's **full**”; Linh chọn “**Thursday** is better”. **Saturday** là ngày bay về — mồi nhử thứ hai.",
        "**(3) surf club** — “out the front of the **surf club** on Beach Road”. **servo** (trạm xăng) chỉ là chỗ **bên cạnh**, Brett dặn **đừng** đợi ở đó. Nghe được từ **servo** mà không hiểu thì dễ ghi nhầm — đây là lý do mục 3 dạy từ này.",
        "**(4) 8.30** — bẫy **hai mốc giờ**: “In summer… at **eight**, but this time of year… **half past eight**”. Đề hỏi giờ **bắt đầu** của tour bạn đặt → 8.30. “ten minutes early” không đổi giờ bắt đầu. Ghi bằng **số** (8.30 / 8:30): “half past eight” là **ba từ** — vượt giới hạn hai từ.",
        "**(5) 3** — “There were going to be **four** of us, **but**… so just **three**”. Sau **but** là thông tin thật.",
        "**(6) Hoang** — đánh vần **H-O-A-N-G**; Brett hỏi lại “**haitch**?” — cách người Úc đọc chữ H. Đọc phiếu: chỗ trống đứng sau “Linh” → là **họ**.",
        "**(7) 0412 557 391** — **oh** = 0; **double five** = 55. Số di động ở Úc bắt đầu bằng **04** và có **10** chữ số — đếm lại cho chắc.",
        "**(8) Palm Grove** — Linh đánh vần cả hai từ. Chữ **Hostel** đã in sẵn trên phiếu → không chép lại (chép lại là thừa từ, có thể bị tính sai).",
        "**(9) electric** — bẫy **thông tin bị loại**: “Most people take a **mountain** bike… **but**… Do you have **electric** bikes?” → “Then **electric**, please”.",
        "**(10) 165** — bẫy **giá gốc ↔ giá cuối**: “normally **sixty-five** dollars per person” → giảm 10 đô/người → 55 × 3 = “**one hundred and sixty-five** dollars **all up**” (all up = tổng cộng, kiểu Úc). Phiếu đã in “$” → chỉ ghi số.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Practice 2 — Part 2: Lễ hội đèn lồng bên sông (Questions 11–20)" },
    {
      t: "p",
      text: "Part 2 là **độc thoại** (một người nói) về đời sống: giới thiệu sự kiện, hướng dẫn tham quan. Bài này có hai dạng (Tập 1 Ngày 9; Tập 2 Ngày 7): **trắc nghiệm A/B/C** (11–15) và **điền chữ cái trên bản đồ** (16–20). Trắc nghiệm: người nói thường **nhắc cả ba phương án** — chỉ một cái khớp **đúng câu hỏi** (cái mới, cái cô ấy khuyên…). Bản đồ: đặt ngón tay ở **You are here**, đi theo lời người nói; **trái / phải** tính theo **hướng đang đi**.",
    },
    {
      t: "canh",
      anh: ["radio", "woman-office-worker", "red-paper-lantern", "fireworks"],
      caption: "Trên đài phát thanh địa phương, Jess Taylor (tình nguyện viên người Úc) giới thiệu **Riverside Lantern Festival** — lễ hội đèn lồng tổ chức ở **Kingfisher Park**, bên một con sông ở Brisbane.",
    },
    {
      t: "p",
      text: "**Questions 11–15.** Choose the correct letter, **A, B or C**. — Đọc trước 5 câu hỏi, gạch từ khoá: **new this year · workshop · parade · food stalls · get to the festival**.",
    },
    {
      t: "listen",
      id: "t2d15-nghe-p2",
      title: "The Riverside Lantern Festival",
      dan: { so: "Day 15, Practice 2 (Listening Part 2)", boiCanh: "a festival volunteer talking on local radio about a lantern festival.", cau: [11, 20] },
      note: "Khoảng 3 phút rưỡi. Người dẫn đài (nam, giọng Anh) giới thiệu một câu; sau đó Jess (người Úc, giọng Úc, nữ) nói một mình. Câu 11–15 ở phần đầu, câu 16–20 (bản đồ) ở phần sau. Nghe tối đa 2 lần.",
      lines: [
        { who: "Presenter", voice: "uk-nam", text: "And now on Radio Riverside, we've got Jess Taylor from the Lantern Festival team to tell us what's on this weekend. Over to you, Jess.", vi: "Và giờ trên Radio Riverside, chúng ta có Jess Taylor từ ban tổ chức Lễ hội Đèn lồng kể cho ta nghe cuối tuần này có gì. Mời Jess." },
        { who: "Jess", voice: "au-nu", text: "Thanks, Tom. G'day, everyone. So, this is our tenth Riverside Lantern Festival, and we're really excited, because for the first time ever, it runs over three nights, from Friday to Sunday, instead of just two. We're in the same spot as always, Kingfisher Park, right on the river, and entry is still free.", vi: "Cảm ơn Tom. Chào mọi người. Đây là Lễ hội Đèn lồng Bên sông lần thứ mười, và bọn mình rất háo hức, vì lần đầu tiên lễ hội kéo dài ba đêm, từ thứ Sáu đến Chủ nhật, thay vì chỉ hai. Địa điểm vẫn như mọi năm, công viên Kingfisher ngay bên sông, và vào cửa vẫn miễn phí." },
        { who: "Jess", voice: "au-nu", text: "If you'd like to make your own lantern for the parade, come along to one of our workshops. They're on every arvo, sorry, every afternoon, between three and five. You don't need to book, and we supply all the paper and the lights, so you don't have to bring anything. Just remember that the last session starts at four, so you need to be there by four o'clock at the latest.", vi: "Nếu bạn muốn tự làm đèn lồng cho buổi diễu hành, hãy đến một buổi làm đèn. Có vào mọi “arvo” — xin lỗi, mọi buổi chiều — từ ba đến năm giờ. Không cần đặt trước, và bọn mình cung cấp hết giấy và đèn, nên bạn không phải mang gì. Chỉ nhớ là buổi cuối bắt đầu lúc bốn giờ, nên phải có mặt muộn nhất là bốn giờ." },
        { who: "Jess", voice: "au-nu", text: "The parade itself leaves from the boat ramp at half past seven. That's half an hour later than last year, because we found the lanterns look much better when it's properly dark. And this year it doesn't finish at the main stage. It finishes at the fireworks viewing area, so you can go straight on to the fireworks. Kids are very welcome to walk in the parade, and if they're over twelve, they don't need a parent with them.", vi: "Buổi diễu hành xuất phát từ bến thả thuyền lúc bảy rưỡi. Muộn hơn năm ngoái nửa tiếng, vì bọn mình thấy đèn lồng đẹp hơn hẳn khi trời tối hẳn. Và năm nay đoàn không kết thúc ở sân khấu chính, mà ở khu xem pháo hoa, để bạn đi thẳng sang xem pháo hoa luôn. Trẻ em rất được chào đón tham gia diễu hành, và nếu trên mười hai tuổi thì không cần bố mẹ đi cùng." },
        { who: "Jess", voice: "au-nu", text: "Now, food. There are heaps of stalls this year, around forty. The queues do get long at about seven, but they move pretty quickly, so I wouldn't worry about that. What I would say is this: most stalls take cards, but some of the smaller family ones are cash only, so it's a good idea to bring a bit of cash with you.", vi: "Giờ đến đồ ăn. Năm nay rất nhiều quầy, khoảng bốn mươi. Khoảng bảy giờ hàng người có dài, nhưng đi khá nhanh nên mình nghĩ không cần lo chuyện đó. Điều mình muốn nói là: hầu hết quầy nhận thẻ, nhưng vài quầy gia đình nhỏ chỉ nhận tiền mặt, nên mang theo ít tiền mặt là ý hay." },
        { who: "Jess", voice: "au-nu", text: "And getting here. Please don't drive. Parking around the park is a nightmare. There are extra buses, which is great, but the nearest bus stop is a fifteen-minute walk away. Honestly, the ferry is the one I'd recommend, because it drops you right at the main gate.", vi: "Còn cách đến đây. Xin đừng lái xe. Chỗ đỗ xe quanh công viên là cơn ác mộng. Có thêm chuyến xe buýt, tốt thôi, nhưng trạm gần nhất cách mười lăm phút đi bộ. Thật lòng, mình khuyên đi phà, vì phà thả bạn ngay cổng chính." },
        { who: "Jess", voice: "au-nu", text: "Right, let me take you around the site. Have a look at the map on our website. You come in through the main gate, at the southern end of the park, and the main path goes straight ahead of you, north, towards the river. The information desk is immediately on your left as you come through the gate, and on your right, opposite it, is the first-aid tent.", vi: "Rồi, để mình dẫn bạn đi một vòng. Xem bản đồ trên trang web nhé. Bạn vào qua cổng chính ở đầu phía nam công viên, lối đi chính chạy thẳng trước mặt bạn về phía bắc, hướng ra sông. Bàn thông tin nằm ngay bên trái khi bạn qua cổng, và bên phải, đối diện nó, là lều sơ cứu." },
        { who: "Jess", voice: "au-nu", text: "Keep walking north. Just before you reach Lantern Lane, which crosses the park from east to west, you'll see the lantern workshop tent on your left. Opposite the workshop, on your right, is the bike parking. That area used to be lost property, but lost property has moved to the information desk this year.", vi: "Tiếp tục đi về phía bắc. Ngay trước khi tới đường Lantern, con đường chạy ngang công viên từ đông sang tây, bạn sẽ thấy lều làm đèn lồng bên trái. Đối diện lều làm đèn, bên phải, là bãi để xe đạp. Chỗ đó trước kia là nơi giữ đồ thất lạc, nhưng năm nay đồ thất lạc chuyển về bàn thông tin." },
        { who: "Jess", voice: "au-nu", text: "At the crossroads, turn right into Lantern Lane. On your left, you'll pass the kids' zone first, and then, right at the far end of the lane, still on your left, is the food court. So the food court is the second area on your left, not the first.", vi: "Tới ngã tư, rẽ phải vào đường Lantern. Bên trái, bạn sẽ đi qua khu trẻ em trước, rồi ở tận cuối đường, vẫn bên trái, là khu ẩm thực. Vậy khu ẩm thực là khu thứ hai bên trái, không phải khu đầu tiên." },
        { who: "Jess", voice: "au-nu", text: "Then come back to the crossroads and carry straight on, north, towards the river. The main stage is on your left, right beside the main path, just before you reach the Riverside Walk.", vi: "Rồi quay lại ngã tư và đi thẳng về phía bắc, hướng ra sông. Sân khấu chính nằm bên trái, sát lối đi chính, ngay trước khi tới đường đi bộ ven sông." },
        { who: "Jess", voice: "au-nu", text: "And finally, the fireworks viewing area. When you get to the Riverside Walk, turn left and follow the river all the way to the western end of the park. The viewing area is there on your left, at the very end. Please don't stand on the walk itself during the fireworks, because that's where the parade comes through. Enjoy the festival, and we'll see you by the river!", vi: "Cuối cùng là khu xem pháo hoa. Khi tới đường đi bộ ven sông, rẽ trái và đi dọc sông tới tận đầu phía tây công viên. Khu xem pháo hoa ở đó, bên trái bạn, tận cuối đường. Đừng đứng trên đường đi bộ khi bắn pháo hoa nhé, vì đoàn diễu hành đi qua đó. Chúc vui lễ hội, hẹn gặp bên sông!" },
      ],
    },
    {
      t: "mcq",
      id: "t2d15-nghe-p2-chon",
      title: "Questions 11–15 — Choose A, B or C",
      items: [
        { q: "(11) What is new about the festival this year?", options: ["A It lasts for three nights.", "B It is held in a different park.", "C Entry is free."], correct: 0, why: "“**for the first time ever**, it runs over **three nights**… instead of just two” → A. B sai: “the **same spot as always**”. C đúng sự thật nhưng **không mới**: “entry is **still** free” (vẫn miễn phí như mọi năm)." },
        { q: "(12) People who want to make a lantern should", options: ["A book a place in advance.", "B bring their own materials.", "C arrive by four o'clock."], correct: 2, why: "“the last session starts at four, so you need to be there **by four o'clock at the latest**” → C. A sai: “You **don't need to book**”. B sai: “we **supply** all the paper and the lights”." },
        { q: "(13) What does Jess say about the parade?", options: ["A It will end at the main stage.", "B It starts later than last year.", "C All children must walk with a parent."], correct: 1, why: "“half past seven. That's **half an hour later than last year**” → B. A sai: “this year it **doesn't** finish at the main stage”. C sai: trên mười hai tuổi “**don't need** a parent”." },
        { q: "(14) What advice does Jess give about the food stalls?", options: ["A Arrive early to avoid long queues.", "B Try the stalls run by families.", "C Bring some cash."], correct: 2, why: "“it's a good idea to **bring a bit of cash** with you” → C. A sai: hàng dài lúc bảy giờ nhưng “**I wouldn't worry** about that”. B: quầy gia đình chỉ được nhắc vì **chỉ nhận tiền mặt**, cô không khuyên nên thử." },
        { q: "(15) Jess recommends getting to the festival by", options: ["A ferry.", "B bus.", "C car."], correct: 0, why: "“**the ferry is the one I'd recommend**, because it drops you right at the main gate” → A. C sai: “Please **don't drive**”. B: có thêm chuyến nhưng trạm cách **15 phút đi bộ** — cô không khuyên." },
      ],
    },
    {
      t: "p",
      text: "**Questions 16–20.** Label the map below. Write the correct letter, **A–H**, next to Questions 16–20. — **Ghi chữ cái đúng (A–H) cho mỗi địa điểm.** Có 8 ô nhưng chỉ 5 câu: 3 ô còn lại là **ô gây nhiễu** (vẫn được nhắc trong bài).",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "Riverside Lantern Festival — Kingfisher Park",
        note: "Bản đồ tự vẽ cho bài luyện. Phía trên là hướng Bắc (sông).",
        map: {
          cols: 12,
          rows: 9,
          paths: [
            { x: 0.3, y: 0.9, w: 11.4, h: 0.7, label: "Riverside Walk" },
            { x: 0.3, y: 4.3, w: 5.3, h: 0.8, label: "Lantern Lane" },
            { x: 6.5, y: 4.3, w: 5.2, h: 0.8 },
            { x: 5.6, y: 1.6, w: 0.9, h: 6.4 },
          ],
          boxes: [
            { x: 0.3, y: 0.1, w: 11.4, h: 0.7, label: "River" },
            { x: 5.15, y: 8.0, w: 1.8, h: 0.9, label: "Main gate" },
            { x: 0.6, y: 1.9, w: 2.1, h: 2.1, blank: "D" },
            { x: 3.0, y: 1.9, w: 2.3, h: 2.1, blank: "E" },
            { x: 6.8, y: 1.9, w: 2.2, h: 2.1, blank: "F" },
            { x: 9.3, y: 1.9, w: 2.4, h: 2.1, blank: "G" },
            { x: 0.6, y: 5.4, w: 4.7, h: 1.0, blank: "A" },
            { x: 0.6, y: 6.7, w: 4.7, h: 1.1, blank: "H" },
            { x: 6.8, y: 5.4, w: 4.9, h: 1.0, blank: "C" },
            { x: 6.8, y: 6.7, w: 4.9, h: 1.1, blank: "B" },
          ],
          pins: [{ x: 6.05, y: 7.6, label: "You are here" }],
        },
      },
    },
    {
      t: "quiz",
      id: "t2d15-nghe-p2-ban-do",
      title: "Questions 16–20 — ghi MỘT chữ cái (A–H)",
      kind: "fill",
      items: [
        { q: "(16) First-aid tent ___", answers: ["B"] },
        { q: "(17) Lantern workshop ___", answers: ["A"] },
        { q: "(18) Food court ___", answers: ["G"] },
        { q: "(19) Main stage ___", answers: ["E"] },
        { q: "(20) Fireworks viewing area ___", answers: ["D"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 11–20 (phần bản đồ: di ngón tay theo lời Jess)",
      items: [
        "**Hướng đi lúc đầu**: từ cổng chính đi **lên phía Bắc** → **trái = Tây**, **phải = Đông**.",
        "**(16) B** — “The information desk is immediately on your **left**… and on your **right**, **opposite it**, is the **first-aid tent**.” Ô phía Đông, sát cổng → **B**. **H** (bên trái, sát cổng) là **bàn thông tin** — ô gây nhiễu.",
        "**(17) A** — “**Just before** you reach Lantern Lane… the lantern workshop tent **on your left**.” Phía Tây, sát đường Lantern → **A**. **C** (đối diện, bên phải) là **bãi để xe đạp**; bẫy **used to**: “That area **used to be** lost property” — bản đồ tả **năm nay**.",
        "**(18) G** — “turn **right** into Lantern Lane” → giờ đang đi về phía **Đông**, nên **trái = Bắc**. “you'll pass the **kids' zone first** (F)… **right at the far end**… is the **food court**” → **G**. Jess còn nhấn: “the **second** area on your left, **not the first**”.",
        "**(19) E** — quay lại ngã tư, “carry **straight on, north**” → trái = Tây. “The main stage is on your **left**, right **beside the main path**, just before… the Riverside Walk” → ô phía Tây **sát lối chính** ở nửa bắc → **E** (không phải D, nằm xa lối chính).",
        "**(20) D** — “turn **left**” vào đường ven sông → đang đi về phía **Tây**, nên **trái = Nam**. “follow the river **all the way to the western end**… on your **left**, **at the very end**” → **D**.",
        "Ba ô gây nhiễu: **H** (bàn thông tin), **C** (bãi xe đạp — từng là chỗ giữ đồ thất lạc), **F** (khu trẻ em). Giọng Úc **không** đổi gì ở phần chỉ đường — chỉ cần bình tĩnh nghe **left / right / opposite / just before / at the far end**.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Sau khi nghe — học từ chính bài nghe" },
    {
      t: "note",
      title: "Cách học lại bài nghe (15 phút)",
      items: [
        "Mở lời thoại, **gạch dưới mọi từ kiểu Úc**: G'day · no worries · heaps · servo · reckon · haitch · arvo · all up · beauty. Đọc to từng câu chứa chúng.",
        "**Đánh dấu mọi bẫy**: but · instead of · used to · not the first · still. Trong cả hai bài, đáp án đúng **luôn đến sau** những từ này.",
        "Để ý **mệnh đề quan hệ** trong lời Jess (bài Ngữ pháp hôm nay): Lantern Lane, **which crosses the park** (có dấu phẩy → loại không xác định, chỉ cần nhận ra) · the one **I'd recommend** (đã lược bỏ that) · that's **where the parade comes through** — nghe ra chúng giúp bạn không lạc mạch câu dài.",
        "**Shadowing** (đọc nhại) 5 câu của Brett, cố bắt chước cả **ngữ điệu lên cuối câu** — để tai quen, không phải để dùng khi thi Nói.",
      ],
    },
    {
      t: "rule",
      formula: "Giọng lạ ≠ đề khó: bắt TỪ KHOÁ + CON SỐ · chờ thông tin SAU but / instead / actually · trái – phải theo hướng ĐANG ĐI",
      vi: "Đừng dừng lại ở một âm nghe lạ — đi tiếp với câu sau, người nói Part 1 thường nhắc lại số và tên.",
    },

    /* ── 7 ── */
    { t: "h", text: "7. Thêm: trắc nghiệm ngay trong Part 1" },
    {
      t: "p",
      text: "Đa số Part 1 là **điền phiếu**, nên nhiều người nghĩ trắc nghiệm A/B/C chỉ có ở Part 2–3. Thực tế đề đôi khi cho **vài câu trắc nghiệm ngay trong cuộc gọi Part 1** (thường 2–4 câu, đứng trước hoặc sau phần phiếu). Nội dung vẫn là đời sống — chọn lớp học, chỗ đỗ xe, giấy tờ cần mang — nhưng bẫy là bẫy của trắc nghiệm: **cả ba phương án đều được nhắc**, chỉ một cái được **chốt** (Ngày 11 mục 6, Ngày 13 mục 9).",
    },
    {
      t: "note",
      title: "Mẹo: làm trắc nghiệm Part 1 như điền một phiếu ngắn",
      items: [
        "Phương án Part 1 thường **rất ngắn** (một môn, một mức giá, một giấy tờ) — đọc chúng như **ba ô trên phiếu** và gạch chữ khác nhau giữa chúng.",
        "Câu hỏi vẫn **đi theo thứ tự** lời thoại và người gọi vẫn **sửa lời** (actually, sorry…) — lấy điều được **chốt cuối cùng**.",
        "Nghe từ phủ định và điều kiện: **unless**, **don't need**, **used to… but now** — chúng loại phương án nhanh nhất.",
      ],
    },
    {
      t: "listen",
      id: "t2d15-nghe-p1-chon-bai",
      title: "Joining Bayside Fitness",
      dan: { so: "Day 15, Practice 3 (Listening Part 1)", boiCanh: "a telephone conversation between a woman and a receptionist at a fitness centre.", cau: [1, 3] },
      note: "Khoảng 1 phút. Shannon (lễ tân, giọng Úc), Linh (giọng Anh). Đọc ba câu hỏi trước, nghe tối đa 2 lần.",
      lines: [
        { who: "Shannon", voice: "au-nu", text: "Good morning, Bayside Fitness, Shannon speaking.", vi: "Chào buổi sáng, Bayside Fitness, Shannon nghe." },
        { who: "Linh", voice: "uk-nu", text: "Hi. I'm thinking of joining one of your classes. I did yoga for years, but I'd like to try something new.", vi: "Chào chị. Tôi đang tính tham gia một lớp bên chị. Tôi tập yoga nhiều năm rồi, nhưng muốn thử thứ gì mới." },
        { who: "Shannon", voice: "au-nu", text: "Sure. Our pilates class is really popular, but I'm afraid it's full until March. Aqua fitness has heaps of places, and it's easy on the knees.", vi: "Được chứ. Lớp pilates bên tôi rất đông khách, nhưng tiếc là kín chỗ tới tháng Ba. Lớp thể dục dưới nước còn nhiều chỗ, mà lại nhẹ cho đầu gối." },
        { who: "Linh", voice: "uk-nu", text: "Actually, that sounds perfect. I'll go for that one. And is there parking?", vi: "Thật ra nghe hợp lắm. Tôi chọn lớp đó. Còn có chỗ đỗ xe không ạ?" },
        { who: "Shannon", voice: "au-nu", text: "There is. It used to be free all day, but now members get the first two hours free, and after that you pay at the machine by the door.", vi: "Có. Trước đây miễn phí cả ngày, nhưng giờ hội viên được miễn phí hai tiếng đầu, sau đó trả tiền ở máy cạnh cửa." },
        { who: "Linh", voice: "uk-nu", text: "Two hours is plenty. Do I need to bring anything to the first session?", vi: "Hai tiếng là dư rồi. Buổi đầu tôi có cần mang gì không?" },
        { who: "Shannon", voice: "au-nu", text: "We don't need a doctor's note unless you've had an injury, and we'll take your photo for the membership card here, so don't worry about that. Just bring your bank card, so we can set up the monthly payment.", vi: "Bên tôi không cần giấy bác sĩ trừ khi chị từng bị chấn thương, và bên tôi sẽ chụp ảnh làm thẻ hội viên tại chỗ, nên chị đừng lo. Chị chỉ cần mang thẻ ngân hàng để cài đặt thanh toán hằng tháng." },
      ],
    },
    {
      t: "mcq",
      id: "t2d15-nghe-p1-chon",
      title: "Questions 1–3 — Choose A, B or C",
      items: [
        { q: "(1) Which class does the woman decide to join?", options: ["A yoga", "B pilates", "C aqua fitness"], correct: 2, why: "“Aqua fitness has heaps of places…” — “**Actually**, that sounds perfect. **I'll go for that one**.” Yoga = lớp cô **đã tập nhiều năm** (muốn đổi); pilates **full until March**." },
        { q: "(2) What does the receptionist say about parking?", options: ["A It is free all day.", "B The first two hours are free.", "C Members must always pay at the machine."], correct: 1, why: "“It **used to be** free all day, **but now** members get **the first two hours free**”. A = quy định **cũ**; C sai vì chỉ trả **sau** hai tiếng." },
        { q: "(3) What should the woman bring to her first session?", options: ["A a photo", "B a doctor's note", "C her bank card"], correct: 2, why: "“**Just bring** your bank card”. Giấy bác sĩ: “**don't need**… **unless** you've had an injury”; ảnh: “we'll **take your photo** here”." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T2D15_SPEAKING: Lesson = {
  id: "t2d15-noi",
  kind: "speaking",
  title: "Nói: Part 2 — Describe an event (kể một sự kiện) + Part 3 nối tiếp · âm yếu /ə/",
  goal: "Dùng 1 phút ghi chú để kể liền mạch gần 2 phút về một sự kiện đã dự (đám cưới, lễ hội, lễ tốt nghiệp…) — đủ mọi gạch đầu dòng, đúng thì quá khứ, có mệnh đề quan hệ thêm chi tiết, kết bằng cảm xúc — và đọc đúng dạng yếu của to / for / of / and / a / can (Speaking FC + GRA + P band 5 → 5.5).",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Thẻ đề **sự kiện** (event): Describe a **celebration / wedding / festival / ceremony / party** you attended… — luôn có 4 dòng: **whose / what** · **when & where** · **what happened** · **and explain why / how you felt**.",
        "1 phút ghi chú bằng **sơ đồ ý**; kể theo **dàn 4 phần**: Mở → Bối cảnh → Diễn biến (dài nhất) → Cảm xúc. Thì **quá khứ đơn** + từ nối thời gian (**First · Then · After that · Later on · In the end**).",
        "Thêm chi tiết bằng **mệnh đề quan hệ** (bài Ngữ pháp hôm nay): the hotel **where** the party took place · the moment **that** I remember most · the relatives **who** came from far away.",
        "**Gạch chân động từ của thẻ** (enjoyed / surprised / changed you…) để chọn góc kể; cạn ý ở ô nào thì dùng cách kéo dài của ô đó (chiến thuật đổi ý, it turned out that, “Anyway, …” để quay lại).",
        "Phát âm: **âm yếu /ə/** — to /tə/, for /fə/, of /əv/, and /ən/, a /ə/, can /kən/. Nói đúng dạng yếu thì câu **nhanh và tự nhiên** hơn hẳn.",
        "Đẩy band nào: **Speaking 5.0** — FC: nói đủ ~2 phút không ngắt dài · GRA: thử câu phức đúng · P: bắt đầu có **nhịp** tiếng Anh (âm yếu).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Thẻ đề “sự kiện” trông thế nào?" },
    {
      t: "p",
      text: "Part 2 có 6 loại đề: người (Ngày 3), nơi chốn (Ngày 7), đồ vật (Ngày 11), **sự kiện** (hôm nay), hoạt động (Ngày 19), đề trừu tượng (Ngày 23). Đề sự kiện là loại **dễ kể nhất** vì có sẵn trình tự thời gian — nhưng cũng dễ mắc lỗi **chia thì** nhất.",
    },
    {
      t: "table",
      caption: "Các đề sự kiện hay gặp — chuẩn bị sẵn 1–2 câu chuyện dùng được cho nhiều đề",
      head: ["Đề (Describe…)", "Câu chuyện có thể dùng"],
      rows: [
        ["a **wedding** you attended / a **celebration** in your family", "đám cưới anh chị họ"],
        ["a **festival** that is important in your country", "Tết, Trung thu"],
        ["a **ceremony** (graduation, prize-giving, opening)", "lễ tốt nghiệp cấp ba của bạn"],
        ["a **party** you enjoyed / a **surprise** you organised", "sinh nhật bất ngờ cho bạn thân"],
        ["a **sports event** or a **concert** you watched live", "trận bóng ở sân Mỹ Đình, buổi hoà nhạc"],
        ["a time when you **met many people** / a **family reunion**", "đám cưới (lại dùng được!)"],
      ],
    },
    {
      t: "table",
      caption: "Thẻ đề mẫu — Describe a wedding or a celebration you attended.",
      head: ["Dòng trên thẻ", "Trả lời bằng", "Khung câu"],
      rows: [
        ["**whose** celebration it was", "người + quan hệ", "I'd like to talk about **a wedding that I went to** last summer. It was my cousin's wedding."],
        ["**when and where** it took place", "thời gian + nơi chốn (quá khứ)", "It **took place** in… , **the city where** my mother grew up."],
        ["**what happened** during it", "trình tự: First / Then / After that", "**First**, there was a ceremony… **Then**, in the evening… **The part that I remember most** was…"],
        ["and **explain why it was memorable**", "cảm xúc + lý do + hiện tại", "**It was memorable because**… I **felt**… **Even now, when** I look at the photos, …"],
      ],
    },
    {
      t: "table",
      caption: "Gạch chân ĐỘNG TỪ / tính từ chính của thẻ — nó quyết định bạn kể GÓC nào của cùng một câu chuyện",
      head: ["Thẻ đề nói", "Phần “explain” phải xoay quanh", "Kể nhiều hơn về"],
      rows: [
        ["…an event you **enjoyed**", "vì sao **vui** (hoạt động, không khí, người đi cùng)", "những gì mọi người **làm** trong buổi đó"],
        ["…an event that **surprised** you", "điều **không ngờ** + phản ứng lúc đó", "lúc **trước** và lúc **sau** điều bất ngờ"],
        ["…an event that **changed** you / you **learned** from", "**bài học** + bạn **khác đi** thế nào bây giờ", "hệ quả: Since then, I have… (hiện tại hoàn thành)"],
        ["…an event you **organised** / **helped** with", "**vai trò của bạn**, việc khó nhất", "khâu chuẩn bị (planned, booked, invited…)"],
        ["…an event you **missed** / **want to go to**", "vì sao lỡ / vì sao muốn đi", "thì **khác**: missed → quá khứ; want to → tương lai (I'd love to…)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: dùng lại câu chuyện đã chuẩn bị mà không lạc đề",
      items: [
        "Cùng **một** đám cưới dùng được cho “enjoyed”, “surprised”, “learned from” — nhưng phần **explain** phải đổi theo động từ. Kể đám cưới cho đề “changed you” mà chỉ tả đồ ăn, khách mời → **lạc đề**, mất điểm.",
        "Câu mở nên **nhắc lại động từ của thẻ**: “I'd like to talk about an event that really **surprised** me…” — giám khảo thấy ngay bạn đúng đề.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. 1 phút ghi chú — sơ đồ ý, không viết câu" },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú 1 phút cho thẻ đề đám cưới",
      caption: "Mỗi nhánh = một gạch đầu dòng. Ghi TỪ KHOÁ + 2–3 từ “đắt” muốn dùng (ceremony, guests, atmosphere, reunion). Nhánh “why” ghi 2 lý do.",
      center: "**cousin Lan's wedding**",
      branches: [
        { label: "whose / when / where", items: ["cousin Lan", "last summer", "Hue — mum's hometown"], anh: "wedding" },
        { label: "morning", items: ["ceremony at bride's house", "áo dài, gifts", "I carried fruit tray — heavy!"], anh: "red-paper-lantern" },
        { label: "evening", items: ["reception, hotel by river", "300 guests", "uncle's funny speech"], anh: "party-popper" },
        { label: "why memorable", items: ["warm atmosphere", "family reunion", "first full traditional ceremony"], anh: "people-hugging" },
      ],
    },
    {
      t: "note",
      title: "Mẹo dùng 1 phút ghi chú",
      items: [
        "Viết **ngang** theo 4 dòng thẻ đề, mỗi dòng 3–5 từ khoá. **Không** viết câu: 1 phút chỉ đủ khoảng 20–25 từ.",
        "Ghi một **chi tiết bất ngờ / buồn cười** (khay hoa quả nặng, bài phát biểu của chú) — chi tiết cụ thể làm câu chuyện sống động và kéo dài thời gian nói tự nhiên.",
        "Ghi sẵn 2 **mệnh đề quan hệ** muốn dùng (the city **where**…, the part **that** I remember most…) — lúc nói chỉ việc ghép vào.",
        "Không chắc chuyện nào có thật? **Được phép** kể chuyện không hoàn toàn có thật — giám khảo chấm **ngôn ngữ**, không chấm sự thật. Nhưng kể chuyện mình biết rõ thì dễ nói đủ 2 phút hơn.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Dàn 4 phần + từ nối thời gian" },
    {
      t: "sodo",
      kind: "flow",
      title: "Dàn 2 phút cho đề sự kiện",
      caption: "Phần 3 (diễn biến) dài nhất. Nói hết 4 phần mà chưa hết giờ → thêm cảm xúc / so sánh với hiện tại; giám khảo sẽ ngắt khi đủ 2 phút.",
      steps: [
        { label: "① Mở (~10 giây)", sub: "I'd like to talk about… / I'm going to describe…" },
        { label: "② Bối cảnh (~20 giây)", sub: "whose · when · where · who was there" },
        { label: "③ Diễn biến (~60 giây)", sub: "First… Then… After that… The part that I remember most…" },
        { label: "④ Cảm xúc (~30 giây)", sub: "It was memorable because… I felt… Even now…" },
      ],
    },
    {
      t: "table",
      caption: "Từ nối thời gian cho câu chuyện quá khứ",
      head: ["Chức năng", "Từ / cụm", "Ví dụ"],
      rows: [
        ["Bắt đầu", "**First (of all)** · **At the beginning** · **In the morning**", "**First of all**, there was a short ceremony at the bride's house."],
        ["Tiếp theo", "**Then** · **After that** · **Later on** · **Next**", "**After that**, everyone moved to the hotel."],
        ["Cùng lúc", "**While** + S + was / were + V-ing · **At the same time**", "**While** we **were eating**, a band started to play."],
        ["Ngay khi", "**As soon as** + S + V-ed", "**As soon as** the bride arrived, everyone stood up."],
        ["Kết thúc", "**Finally** · **In the end** · **By the end of the night**", "**In the end**, we danced until midnight."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi kể sự kiện",
      items: [
        "**Quên thì quá khứ** giữa chừng: ~~Everybody wear áo dài and we go to the hotel~~ → Everybody **wore** áo dài and we **went** to the hotel. Ghi chú bằng động từ quá khứ (wore, went, gave) để tự nhắc.",
        "**At the end** ≠ **In the end**: at the end **of** something = ở cuối (at the end of the party); in the end = cuối cùng thì, rốt cuộc (In the end, we got home at 2 a.m.).",
        "~~my cousin wedding~~ → **my cousin's wedding** (sở hữu cách 's). ~~listen music~~ → **listen to** music.",
        "Lặp “and then… and then…” suốt 2 phút → đổi bằng After that / Later on / While… / As soon as… — đây là điểm **Coherence** (mạch lạc) của FC.",
        "Kết bằng “**That's all.**” — cụt. Thay bằng một câu cảm xúc: **So that's why it was such a special day for me.**",
      ],
    },
    {
      t: "rule",
      formula: "I'd like to talk about + N + that I went to … · It took place in … · First … Then … After that … · It was memorable because + S + V",
      vi: "Khung 4 phần của đề sự kiện — mở, bối cảnh, diễn biến, cảm xúc; cả bài dùng quá khứ đơn.",
    },
    {
      t: "table",
      caption: "Cạn ý ở một ô? Mỗi ô của thẻ sự kiện có cách kéo dài riêng",
      head: ["Ô trên thẻ", "Cách kéo dài", "Câu mẫu"],
      rows: [
        ["**when**", "Không nhớ chính xác thì nói thật rồi **ước lượng**", "I can't remember the exact date, but **I think it was** around August, **because** it was really hot."],
        ["**where**", "Một câu tả nơi đó + **so sánh** với nơi khác", "It was held in a riverside hotel. **Unlike** most wedding venues, it had a huge garden."],
        ["**what happened**", "**Chiến thuật đổi ý**: kế hoạch ban đầu → điều xảy ra → quyết định", "**At first we planned** to have the party outside, **but then we realised** it was going to rain, **so we decided** to move everything indoors."],
        ["**what happened**", "Một điều **hoá ra** khác dự đoán", "I thought the speech would be boring, but **it turned out that** my uncle was really funny."],
        ["**why / how you felt**", "Cảm xúc **lúc đó** → cảm xúc **bây giờ**", "At the time I was exhausted, but **looking back**, it was one of the best days of that year."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: kể lạc sang chi tiết phụ thì quay về bằng “Anyway, …”",
      items: [
        "Lỡ kể dài về một chi tiết (chiếc xe hỏng trên đường đến tiệc) → **Anyway, as I was saying, …** / **Anyway, back to the wedding, …** rồi nói tiếp ô còn thiếu. Giám khảo thấy bạn **kiểm soát được mạch** (Coherence).",
        "“**It turned out that** + S + V-ed” = hoá ra là… — câu kể chuyện rất tự nhiên, dùng một lần mỗi bài là đủ.",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Thêm chi tiết bằng mệnh đề quan hệ — câu chuyện “dày” hơn" },
    {
      t: "p",
      text: "Câu đơn nối nhau bằng and nghe như **band 4–5**. Một mệnh đề quan hệ biến hai câu thành một, vừa thêm chi tiết, vừa cho giám khảo thấy **câu phức** (GRA). Mỗi lượt Part 2, đặt mục tiêu **3–4 mệnh đề quan hệ đúng**.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "the person / people + who + V …",
          vi: "Thêm chi tiết về người trong câu chuyện.",
          examples: [
            { en: "There were some relatives who came all the way from Saigon.", vi: "Có vài người họ hàng đi từ tận Sài Gòn ra." },
          ],
        },
        {
          formula: "the place + where + S + V …",
          vi: "Thêm chi tiết về nơi diễn ra sự kiện.",
          examples: [
            { en: "The party was held at a small restaurant where my parents had their first date.", vi: "Bữa tiệc tổ chức ở một nhà hàng nhỏ, nơi bố mẹ tôi hẹn hò lần đầu." },
          ],
        },
        {
          formula: "the part / the moment + (that) + I remember most + was …",
          vi: "Dẫn vào chi tiết đáng nhớ nhất — câu “đinh” của phần diễn biến.",
          examples: [
            { en: "The moment that I remember most was when the fireworks started.", vi: "Khoảnh khắc tôi nhớ nhất là lúc pháo hoa bắt đầu bắn." },
          ],
        },
        {
          formula: "the day / the year + (when) + S + V …",
          vi: "Thêm thời điểm (when — mở rộng của bài Ngữ pháp mục 5).",
          examples: [
            { en: "It was the day when I finally understood why Tet matters so much to my grandparents.", vi: "Đó là ngày tôi cuối cùng cũng hiểu vì sao Tết quan trọng với ông bà đến thế." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "the people who + V · the place where + S + V · the moment (that) + S + V · the day (when) + S + V",
      vi: "Mỗi bài Part 2 sự kiện: 3–4 mệnh đề quan hệ — không dấu phẩy, không thêm he / it thừa.",
    },
    {
      t: "quiz",
      id: "t2d15-noi-dich",
      title: "Dịch sang tiếng Anh — câu kể sự kiện có mệnh đề quan hệ (4 câu)",
      kind: "translate",
      grammar: "quá khứ đơn + who / where / (that) / (when): the guests who… · the hotel where… · the moment (that) I remember most…",
      items: [
        { q: "Lễ cưới diễn ra ở một khách sạn nơi bố mẹ tôi tổ chức đám cưới 25 năm trước.", hint: "The wedding took place at a hotel, where, my parents got married / had their wedding, 25 years ago", answers: ["The wedding took place at a hotel where my parents got married 25 years ago.", "The wedding took place at a hotel where my parents had their wedding 25 years ago.", "The wedding took place in a hotel where my parents got married 25 years ago.", "The wedding took place in a hotel where my parents had their wedding 25 years ago.", "The wedding took place at a hotel where my parents got married twenty-five years ago.", "The wedding took place at a hotel where my parents had their wedding twenty-five years ago.", "The wedding was held at a hotel where my parents got married 25 years ago.", "The wedding was held at a hotel where my parents had their wedding 25 years ago."] },
        { q: "Có rất nhiều khách đến từ nước ngoài.", hint: "There were a lot of guests, who, came from abroad / other countries", answers: ["There were a lot of guests who came from abroad.", "There were many guests who came from abroad.", "There were lots of guests who came from abroad.", "There were a lot of guests who came from other countries.", "There were many guests who came from other countries.", "There were a lot of guests that came from abroad.", "There were many guests that came from abroad.", "There were a lot of guests who came from overseas.", "There were many guests who came from overseas."] },
        { q: "Khoảnh khắc tôi nhớ nhất là bài phát biểu của chú tôi.", hint: "The moment, (that), I remember most, was my uncle's speech", answers: ["The moment I remember most was my uncle's speech.", "The moment that I remember most was my uncle's speech.", "The moment I remember the most was my uncle's speech.", "The moment that I remember the most was my uncle's speech.", "The part I remember most was my uncle's speech.", "The part that I remember most was my uncle's speech."] },
        { q: "Đó là lần đầu tiên tôi xem một buổi lễ truyền thống từ đầu đến cuối.", hint: "It was the first time, (that), I watched / saw a traditional ceremony, from start to finish", answers: ["It was the first time that I watched a traditional ceremony from start to finish.", "It was the first time I watched a traditional ceremony from start to finish.", "It was the first time that I saw a traditional ceremony from start to finish.", "It was the first time I saw a traditional ceremony from start to finish.", "It was the first time that I had watched a traditional ceremony from start to finish.", "It was the first time I had watched a traditional ceremony from start to finish.", "It was the first time that I had seen a traditional ceremony from start to finish.", "It was the first time I had seen a traditional ceremony from start to finish.", "It was the first time that I watched a traditional ceremony from beginning to end.", "It was the first time I watched a traditional ceremony from beginning to end.", "It was the first time I saw a traditional ceremony from beginning to end."] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Từ vựng hữu ích cho đề sự kiện" },
    {
      t: "vocab",
      items: [
        { w: "ceremony", pos: "n", ipa: "/ˈserəməni/", vi: "nghi lễ, buổi lễ", ex: "The graduation ceremony lasted almost three hours.", exVi: "Lễ tốt nghiệp kéo dài gần ba tiếng.", more: "a **wedding / graduation / opening** ceremony · **hold / attend** a ceremony. Trọng âm âm đầu: **CE**-re-mo-ny.", anh: "graduation-cap" },
        { w: "celebration", pos: "n", ipa: "/ˌselɪˈbreɪʃn/", vi: "lễ kỷ niệm, buổi ăn mừng", ex: "We had a small celebration when my sister passed her driving test.", exVi: "Cả nhà ăn mừng nho nhỏ khi chị tôi thi đỗ bằng lái.", more: "Họ từ: **celebrate** (v) · **celebration** (n). **celebrate** + sự kiện: celebrate **Tet**, celebrate **a birthday** (~~celebrate for~~).", anh: "party-popper" },
        { w: "occasion", pos: "n", ipa: "/əˈkeɪʒn/", vi: "dịp (đặc biệt)", ex: "My grandmother only wears that necklace on special occasions.", exVi: "Bà tôi chỉ đeo chiếc vòng cổ đó vào những dịp đặc biệt.", more: "a **special / formal / happy** occasion · **on** this occasion. Chính tả: một **c** đôi + một **s**: o**cc**a**s**ion." },
        { w: "atmosphere", pos: "n", ipa: "/ˈætməsfɪə(r)/", vi: "bầu không khí (cảm giác của một nơi / sự kiện)", ex: "The atmosphere at the festival was relaxed and friendly.", exVi: "Bầu không khí ở lễ hội thoải mái và thân thiện.", more: "a **warm / lively / festive / tense** atmosphere · **create** an atmosphere. Nghĩa khác: bầu khí quyển (Tập 2 Ngày 2)." },
        { w: "guest", pos: "n", ipa: "/ɡest/", vi: "khách (được mời)", ex: "More than three hundred guests came to the reception.", exVi: "Hơn ba trăm khách đến dự tiệc chiêu đãi.", more: "**wedding** guests · a **guest list** · **invite** guests. Phát âm /ɡest/ — chữ u câm. Khách du lịch là **tourist / visitor**, không phải guest.", anh: "busts-in-silhouette" },
        { w: "decorate", pos: "v", ipa: "/ˈdekəreɪt/", vi: "trang trí", ex: "The hall was decorated with red and gold flowers.", exVi: "Hội trường được trang trí bằng hoa đỏ và vàng.", more: "**decorate** sth **with** sth · danh từ **decorations** (đồ trang trí): Christmas **decorations**. Hay dùng ở **bị động**: was decorated with.", anh: "red-paper-lantern" },
        { w: "memorable", pos: "adj", ipa: "/ˈmemərəbl/", vi: "đáng nhớ, khó quên", ex: "It was one of the most memorable days of my life.", exVi: "Đó là một trong những ngày đáng nhớ nhất đời tôi.", more: "Họ từ: **memory** (n) · **memorable** (adj) · **memorise** (v). Thẻ đề hay hỏi: explain **why it was memorable**." },
        { w: "take place", pos: "phr v", ipa: "/ˌteɪk ˈpleɪs/", vi: "diễn ra (sự kiện có kế hoạch)", ex: "The festival takes place on the fifteenth day of the eighth lunar month.", exVi: "Lễ hội diễn ra vào ngày rằm tháng Tám âm lịch.", more: "**Không** có bị động: ~~was taken place~~ → **took place** / **was held**. Quá khứ: **took place**." },
        { w: "crowd", pos: "n", ipa: "/kraʊd/", vi: "đám đông", ex: "A huge crowd gathered by the river to watch the fireworks.", exVi: "Một đám đông lớn tụ tập bên sông xem pháo hoa.", more: "a **huge / large** crowd · **crowded** (adj): a **crowded** street (~~a crowd street~~).", anh: "busts-in-silhouette" },
        { w: "reunion", pos: "n", ipa: "/ˌriːˈjuːniən/", vi: "cuộc đoàn tụ, buổi họp mặt lại", ex: "Tet is a time for family reunions.", exVi: "Tết là dịp đoàn tụ gia đình.", more: "a **family / class / school** reunion. Cấu tạo: **re-** (lại) + **union** (sự hợp nhất).", anh: "people-hugging" },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bài mẫu: band 5 và band 6 cho cùng một thẻ đề" },
    {
      t: "p",
      text: "Thẻ đề: **Describe a wedding or a celebration you attended.** You should say: whose celebration it was; when and where it took place; what happened during it; and explain why it was memorable. — So hai câu trả lời. Bản **band 5** có ý nhưng ngắn (~45 giây), câu đơn, lặp từ và **có lỗi** (tự tìm trước khi đọc bảng). Bản **band 6** dài ~2 phút, có trình tự, mệnh đề quan hệ, cảm xúc.",
    },
    {
      t: "dialogue",
      title: "Band 5 (ước tính) — ngắn, câu đơn, có lỗi",
      lines: [
        { who: "Examiner", role: "examiner", text: "All right? Remember, you have one to two minutes for this. Please start speaking now." },
        { who: "Candidate", role: "candidate", text: "I want to talk about my cousin wedding. It was last year in Hue. There were many people. In the morning they had a ceremony at the house. Everybody wear áo dài. In the evening we go to a hotel and eat. The food was very delicious. My uncle gave a speech. It was very funny. Everybody laughed. Then we listened music and took photos. I think it was memorable because I saw my family. I was very happy. That's all.", vi: "Tôi muốn nói về đám cưới anh họ tôi. Năm ngoái ở Huế. Có nhiều người. Buổi sáng họ làm lễ ở nhà. Mọi người mặc áo dài. Buổi tối chúng tôi đến khách sạn và ăn. Đồ ăn rất ngon. Chú tôi phát biểu. Rất buồn cười. Mọi người cười. Rồi chúng tôi nghe nhạc và chụp ảnh. Tôi nghĩ nó đáng nhớ vì tôi gặp gia đình. Tôi rất vui. Hết rồi." },
      ],
    },
    {
      t: "dialogue",
      title: "Band 6 (ước tính) — ~2 phút, đủ 4 dòng thẻ đề",
      lines: [
        { who: "Examiner", role: "examiner", text: "All right? Remember, you have one to two minutes for this. Please start speaking now." },
        { who: "Candidate", role: "candidate", text: "I'd like to talk about a wedding that I went to last summer. It was my cousin Lan's wedding, and it took place in Hue, the city where my mother grew up.", vi: "Tôi muốn kể về một đám cưới tôi dự hè năm ngoái. Đó là đám cưới của chị họ Lan, diễn ra ở Huế, thành phố nơi mẹ tôi lớn lên." },
        { who: "Candidate", role: "candidate", text: "The wedding had two parts. First, in the morning, there was a traditional ceremony at the bride's house. Everyone wore áo dài, and the two families exchanged gifts. My job was to carry a tray of fruit that was much heavier than it looked, so I was really nervous about dropping it!", vi: "Đám cưới có hai phần. Đầu tiên, buổi sáng có lễ truyền thống ở nhà cô dâu. Ai cũng mặc áo dài, và hai họ trao lễ vật. Việc của tôi là bưng một khay hoa quả nặng hơn vẻ ngoài nhiều, nên tôi rất sợ làm rơi!" },
        { who: "Candidate", role: "candidate", text: "Then, in the evening, there was a big reception at a hotel by the Perfume River. There were about three hundred guests, and the hall was decorated with red and gold flowers. The part that I remember most was my uncle's speech. He told funny stories about Lan when she was a little girl, and the whole room was laughing.", vi: "Rồi buổi tối có tiệc chiêu đãi lớn ở một khách sạn bên sông Hương. Có khoảng ba trăm khách, hội trường trang trí hoa đỏ và vàng. Phần tôi nhớ nhất là bài phát biểu của chú tôi. Chú kể những chuyện buồn cười về chị Lan hồi bé, cả hội trường cười rộ." },
        { who: "Candidate", role: "candidate", text: "After that, we had a huge meal, and a band played live music. While we were eating, some relatives who I don't see very often came over to chat with me, so in a way it was also a family reunion.", vi: "Sau đó chúng tôi ăn một bữa thật thịnh soạn, và có ban nhạc chơi nhạc sống. Trong lúc ăn, vài người họ hàng ít khi gặp đến trò chuyện với tôi, nên theo một nghĩa nào đó đây cũng là buổi đoàn tụ gia đình." },
        { who: "Candidate", role: "candidate", text: "As for why it was so memorable, I think it was mainly the atmosphere. Everyone who was there seemed genuinely happy, and I felt really proud of my cousin. It was also the first time that I saw a traditional ceremony from start to finish, so I learnt a lot about our customs. Even now, when I look at the photos, I can still hear the music in my head.", vi: "Còn vì sao nó đáng nhớ, tôi nghĩ chủ yếu là bầu không khí. Ai có mặt cũng có vẻ vui thật lòng, và tôi rất tự hào về chị họ mình. Đó cũng là lần đầu tôi xem một lễ truyền thống từ đầu đến cuối, nên tôi học được nhiều về phong tục. Đến giờ, mỗi lần xem ảnh, tôi vẫn như nghe thấy tiếng nhạc trong đầu." },
        { who: "Examiner", role: "examiner", text: "Thank you. Do you often go to weddings?" },
        { who: "Candidate", role: "candidate", text: "Not very often, maybe once or twice a year, mostly in the winter wedding season.", vi: "Không thường lắm, chắc một hai lần một năm, chủ yếu vào mùa cưới cuối năm." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bản thứ hai được band cao hơn — 4 tiêu chí",
      head: ["Tiêu chí", "Band 5 (bản 1)", "Band 6 (bản 2)"],
      rows: [
        ["**FC** — trôi chảy & mạch lạc", "~45 giây rồi dừng (“That's all”); ý rời rạc, chỉ có “Then”", "~2 phút; 4 phần rõ; **First · Then · After that · While · As for why**"],
        ["**LR** — từ vựng", "từ cơ bản lặp (very, many people, happy)", "**ceremony, reception, guests, decorated with, atmosphere, reunion, customs**; cụm tự nhiên (the whole room was laughing)"],
        ["**GRA** — ngữ pháp", "toàn câu đơn; lỗi: ~~cousin wedding~~ (thiếu 's) · ~~wear~~ / ~~go~~ / ~~eat~~ (thiếu quá khứ) · ~~listened music~~ (thiếu to)", "**6 mệnh đề quan hệ** đúng (a wedding **that** I went to · the city **where**… · a tray of fruit **that**… · the part **that** I remember most · relatives **who**… · everyone **who** was there); quá khứ đơn + quá khứ tiếp diễn (While we **were eating**)"],
        ["**P** — phát âm", "(nghe ghi âm) thường đọc mạnh mọi từ → nhịp “đều đều”", "đọc yếu to / of / and / a → nhịp tự nhiên (mục 7)"],
      ],
    },
    {
      t: "note",
      title: "Sửa 5 lỗi của bản band 5",
      items: [
        "~~my cousin wedding~~ → **my cousin's wedding**",
        "~~Everybody wear áo dài~~ → Everybody **wore** áo dài",
        "~~In the evening we go to a hotel and eat~~ → we **went** to a hotel and **ate** (cả hai động từ đều về quá khứ)",
        "~~we listened music~~ → we **listened to** music",
        "~~The food was very delicious~~ → **The food was delicious / absolutely delicious** (delicious đã là “rất ngon” — người bản xứ ít nói very delicious; lỗi tự nhiên, không phải lỗi ngữ pháp).",
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Phát âm: âm yếu /ə/ (nhập môn)" },
    {
      t: "p",
      text: "Âm **/ə/** (schwa — đọc là “sờ-oa”) là âm **phổ biến nhất** trong tiếng Anh: một âm “ơ” rất ngắn, miệng thả lỏng, **không nhấn**. Những **từ chức năng** nhỏ (a, the, to, for, of, and, can, was…) khi **không được nhấn** sẽ đọc bằng /ə/ — gọi là **dạng yếu** (weak form). Người Việt hay đọc **mọi từ to và rõ như nhau** → câu nghe như robot, chậm, và **khó nghe** với người bản xứ. (Ngày 17 sẽ học tiếp: trọng âm câu và nhịp.)",
    },
    {
      t: "table",
      caption: "Dạng mạnh ↔ dạng yếu của các từ hay gặp",
      head: ["Từ", "Dạng mạnh", "Dạng yếu", "Ví dụ (dạng yếu)"],
      rows: [
        ["**a**", "/eɪ/", "/ə/", "**a** cup of tea → /ə kʌp əv tiː/"],
        ["**to**", "/tuː/", "/tə/ (trước phụ âm) · /tu/ (trước nguyên âm)", "I want **to** go → /tə ɡəʊ/ · **to** eat → /tu iːt/"],
        ["**for**", "/fɔː/", "/fə/", "a present **for** you → /fə juː/"],
        ["**of**", "/ɒv/", "/əv/", "one **of** my friends → /wʌn əv/"],
        ["**and**", "/ænd/", "/ən/ hoặc /ənd/", "fish **and** chips → /fɪʃ ən tʃɪps/"],
        ["**can**", "/kæn/", "/kən/", "I **can** swim → /aɪ kən swɪm/"],
        ["**was**", "/wɒz/", "/wəz/", "It **was** great → /ɪt wəz ɡreɪt/"],
      ],
    },
    {
      t: "note",
      title: "Khi nào dùng dạng MẠNH?",
      items: [
        "Từ đứng **cuối câu**: What are you looking **for**? → /fɔː/ · Yes, I **can**. → /kæn/ (không bao giờ ~~Yes, I /kən/~~).",
        "Khi **nhấn mạnh / đối lập**: It's a present **for** you, not **from** you. · I said **and**, not **or**.",
        "Khi đọc **riêng từng từ** (đọc chính tả). Trong câu bình thường → dạng yếu.",
        "Bẫy nghe: **can** /kən/ và **can't** /kɑːnt/ — can't **không bao giờ** yếu: giọng Anh / Úc có nguyên âm dài /ɑː/, giọng Mỹ đọc /kænt/ với /æ/ rõ. Nghe thấy “ơ” ngắn là **can**.",
      ],
    },
    {
      t: "phatam",
      id: "t2d15-phat-am",
      title: "Luyện phát âm — âm yếu /ə/ trong to, for, of, and, a, can",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Đọc những từ in đậm trong bảng trên thật NHẸ và NGẮN (/ə/), dồn sức vào từ mang nghĩa (cup, tea, festival, best…). Dòng 7 và 8 có từ đứng cuối câu → đọc dạng MẠNH.",
      items: [
        { text: "a cup of tea", ipa: "ə kʌp əv tiː", vi: "a /ə/ · of /əv/" },
        { text: "fish and chips", ipa: "fɪʃ ən tʃɪps", vi: "and /ən/" },
        { text: "I went to the festival for a day.", ipa: "aɪ went tə ðə festɪvl fər ə deɪ", vi: "to /tə/ · for /fə(r)/ nối với a" },
        { text: "We can stay for an hour.", ipa: "wi kən steɪ fər ən aʊə", vi: "can /kən/ · for /fə(r)/" },
        { text: "It was one of the best nights of the year.", ipa: "ɪt wəz wʌn əv ðə best naɪts əv ðə jɪə", vi: "was /wəz/ · of /əv/ hai lần" },
        { text: "I'd like to go back and see it again.", ipa: "aɪd laɪk tə ɡəʊ bæk ən siː ɪt əɡen", vi: "to /tə/ · and /ən/" },
        { text: "What are you looking for?", ipa: "wɒt ə ju lʊkɪŋ fɔː", vi: "are /ə/ — nhưng for cuối câu: MẠNH /fɔː/" },
        { text: "I can swim, and yes, I can.", ipa: "aɪ kən swɪm ən jes aɪ kæn", vi: "can yếu /kən/ ↔ can cuối câu MẠNH /kæn/" },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Part 3 nối tiếp đề sự kiện" },
    {
      t: "p",
      text: "Sau Part 2, giám khảo hỏi **câu chung** về cùng chủ đề (lễ hội, đám cưới, ăn mừng). Dùng khung **Ý kiến → Lý do → Ví dụ** (Tập 1 Ngày 12, Tập 2 Ngày 13), nói về **mọi người / xã hội**, không chỉ về bản thân. Câu trả lời 3–5 câu.",
    },
    {
      t: "dialogue",
      title: "Part 3 — hai câu mẫu (band 5.5–6)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Why do people like to celebrate special events?" },
        { who: "Candidate", role: "candidate", text: "I think the main reason is that celebrations bring people together. In daily life, most people are busy with work, so a wedding or a festival is a chance to see relatives who live far away. For example, at Tet, many people who work in big cities travel back to their hometowns. Also, celebrations help people remember the good moments in life.", vi: "Tôi nghĩ lý do chính là các dịp ăn mừng gắn kết mọi người. Thường ngày ai cũng bận làm việc, nên đám cưới hay lễ hội là dịp gặp họ hàng sống ở xa. Ví dụ, dịp Tết, nhiều người làm việc ở thành phố lớn về quê. Ngoài ra, ăn mừng giúp người ta nhớ những khoảnh khắc đẹp trong đời." },
        { who: "Examiner", role: "examiner", text: "Do you think weddings today are too expensive?" },
        { who: "Candidate", role: "candidate", text: "In some cases, yes. Some families spend a fortune on a big reception because they worry about what other people will think. For instance, I know a couple who borrowed money for their wedding and then took years to pay it back. Personally, I think a smaller wedding where only close friends and family are invited can be just as meaningful.", vi: "Có những trường hợp là vậy. Một số gia đình chi rất nhiều tiền cho tiệc lớn vì lo người khác nghĩ gì. Ví dụ, tôi biết một cặp vay tiền làm đám cưới rồi mất nhiều năm mới trả hết. Cá nhân tôi nghĩ một đám cưới nhỏ chỉ mời bạn bè thân và gia đình cũng ý nghĩa không kém." },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Luyện nói" },
    {
      t: "p",
      text: "**Part 2:** chọn một thẻ đề, bấm giờ **1 phút** ghi chú theo sơ đồ ý ở mục 2, rồi ghi âm **2 phút**. Nghe lại và tự đếm: mấy động từ quá khứ đúng? mấy mệnh đề quan hệ? có đủ 4 dòng thẻ đề? có đọc yếu to / of / and không? **Part 3:** mỗi câu 3–5 câu theo Ý kiến → Lý do → Ví dụ.",
    },
    {
      t: "speak",
      id: "t2d15-noi-p2",
      part: "2",
      questions: [
        "Describe a festival that is important in your country. You should say: what the festival is called; when it takes place; what people do during it; and explain why it is important to people in your country.",
        "Describe a ceremony you attended, such as a graduation or a prize-giving. You should say: whose ceremony it was; when and where it took place; what happened during it; and explain how you felt about it.",
        "Describe a party that you enjoyed. You should say: whose party it was; where it was held; who you met there; and explain why you enjoyed it.",
      ],
    },
    {
      t: "speak",
      id: "t2d15-noi-p3",
      part: "3",
      questions: [
        "Are traditional festivals still important to young people in your country?",
        "Why do some people spend so much money on weddings?",
        "What are the advantages of celebrating special events with family rather than with friends?",
        "How might people celebrate special events differently in the future?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D15_HOMEWORK: Lesson = {
  id: "t2d15-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 15",
  goal: "Ôn trọn Ngày 15: chọn và ghép câu bằng mệnh đề quan hệ, biết khi nào lược bỏ đại từ, sửa 5 lỗi kinh điển, dịch câu phức, nghe một đoạn hội thoại có giọng và từ kiểu Úc, nhận ra âm yếu, và nói một lượt Part 2 kể sự kiện.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (38 câu + 1 lượt nói)",
      items: [
        "**I. Chọn đáp án** (8 câu): who / which / that / whose / where + 2 câu ôn Tập 1 – Tập 2.",
        "**II. Nối hai câu thành một** (6 câu) · **III. Lược bỏ được không?** (4 câu) · **IV. Sửa lỗi** (5 câu).",
        "**V. Dịch Việt → Anh** (6 câu, có 💡) · **VI. Nghe** (5 câu — hội thoại kiểu Úc) · **VII. Âm yếu /ə/** (4 câu).",
        "**VIII. Nói**: 1 phút ghi chú + 2 phút Part 2 kể một sự kiện, dùng ít nhất 3 mệnh đề quan hệ.",
        "Đạt: **≥ 27/38** câu đúng (70 %). Sai phần nào thì mở lại đúng mục ghi trong lời giải.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 15 trước khi làm bài",
      caption: "Ba bài của hôm nay — mỗi nhánh là điều dễ quên nhất.",
      center: "**Ngày 15**",
      branches: [
        { label: "Mệnh đề quan hệ xác định", items: ["người → who · vật → which · cả hai → that", "whose + N · where + S + V", "tân ngữ → lược bỏ được", "không dấu phẩy, không he / it thừa"], anh: "link" },
        { label: "Giọng Úc", items: ["day ≈ “die” · nice ≈ “noice”", "không cuốn r · t → d", "arvo · heaps · reckon · no worries · servo", "H = “haitch”"], anh: "kangaroo" },
        { label: "Part 2 sự kiện + /ə/", items: ["4 phần: mở · bối cảnh · diễn biến · cảm xúc", "quá khứ đơn + First / Then / After that", "to /tə/ · of /əv/ · and /ən/ · can /kən/", "cuối câu → dạng mạnh"], anh: "microphone" },
      ],
    },

    { t: "h", text: "I. Chọn đáp án đúng (8 câu)" },
    {
      t: "mcq",
      id: "t2d15-bt-chon",
      title: "I. Chọn đáp án đúng (8 câu)",
      items: [
        { q: "The man ___ repaired our roof finished in one day.", options: ["who", "which", "whose"], correct: 0, why: "Người (the man) + sau chỗ trống là động từ (repaired) → **who** (hoặc that). Bài Ngữ pháp mục 2." },
        { q: "I can't find the charger ___ came with my phone.", options: ["who", "where", "that"], correct: 2, why: "Vật (the charger) làm chủ ngữ của came → **that / which**. where cần chủ ngữ mới sau nó. Mục 2, 5." },
        { q: "Is there a shop near here ___ sells umbrellas?", options: ["where", "which", "who"], correct: 1, why: "Sau chỗ trống là **động từ** sells → shop làm chủ ngữ → **which / that**, không phải where. Mục 5." },
        { q: "She's the singer ___ voice everyone loves.", options: ["who", "whose", "who's"], correct: 1, why: "Sau chỗ trống là danh từ **voice** → sở hữu → **whose**. who's = who is. Mục 4." },
        { q: "That's the beach ___ we learnt to surf.", options: ["where", "which", "that"], correct: 0, why: "**we learnt to surf** đủ nghĩa, thiếu “ở đó” → **where** (= at which). Mục 5." },
        { q: "Melbourne is the city ___ hosts the Australian Open every January.", options: ["where", "whose", "that"], correct: 2, why: "Sau chỗ trống là động từ **hosts** → city làm chủ ngữ → **that / which**. Bẫy: thấy “city” là chọn where. Mục 5." },
        { q: "(Ôn Tập 1 Ngày 15 + Tập 2 Ngày 5) The festival ___ every year since 1995.", options: ["has been held", "is held", "held"], correct: 0, why: "**since 1995** → hiện tại hoàn thành; lễ hội **được** tổ chức → bị động: **has been held**. is held không đi với since; held thiếu be." },
        { q: "(Ôn Tập 1 Ngày 13) Visitors ___ bring food into the museum — it's not allowed.", options: ["don't have to", "needn't", "mustn't"], correct: 2, why: "“it's **not allowed**” = **cấm** → **mustn't**. don't have to / needn't = **không cần** (sai nghĩa)." },
      ],
    },

    { t: "h", text: "II. Nối hai câu thành một (6 câu)" },
    {
      t: "quiz",
      id: "t2d15-bt-noi",
      title: "II. Viết lại thành MỘT câu có mệnh đề quan hệ (6 câu)",
      kind: "fill",
      items: [
        { q: "I have a friend. She works for an airline. → I have a friend ___", answers: ["who works for an airline", "that works for an airline", "I have a friend who works for an airline", "I have a friend that works for an airline"], hint: "who / that + V" },
        { q: "This is the photo. I took it in Perth. → This is the photo ___", answers: ["I took in Perth", "that I took in Perth", "which I took in Perth", "This is the photo I took in Perth", "This is the photo that I took in Perth", "This is the photo which I took in Perth"], hint: "đại từ làm tân ngữ — bỏ it" },
        { q: "We stayed in a village. There was no Wi-Fi in the village. → We stayed in a village ___", answers: ["where there was no Wi-Fi", "where there was no wifi", "where there was no WiFi", "which had no Wi-Fi", "that had no Wi-Fi", "which had no wifi", "that had no wifi", "where there wasn't any Wi-Fi", "where there wasn't any wifi", "which didn't have Wi-Fi", "that didn't have Wi-Fi", "We stayed in a village where there was no Wi-Fi", "We stayed in a village where there was no wifi"], hint: "where + S + V" },
        { q: "Do you know the boy? His bike was stolen. → Do you know the boy ___?", answers: ["whose bike was stolen", "Do you know the boy whose bike was stolen"], hint: "whose + N" },
        { q: "The bus was late. We took it this morning. → The bus ___ was late.", answers: ["we took this morning", "that we took this morning", "which we took this morning", "The bus we took this morning was late", "The bus that we took this morning was late", "The bus which we took this morning was late"], hint: "mệnh đề đứng ngay sau the bus" },
        { q: "The people were very friendly. They organised the festival. → The people ___ were very friendly.", answers: ["who organised the festival", "that organised the festival", "who organized the festival", "that organized the festival", "The people who organised the festival were very friendly", "The people that organised the festival were very friendly", "The people who organized the festival were very friendly", "The people that organized the festival were very friendly"], hint: "who + V; động từ chính were giữ nguyên" },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần II",
      items: [
        "**(1)** She → **who** (người, chủ ngữ của works). **(2)** it → **that / which** hoặc bỏ: “I took **it**” → đại từ làm **tân ngữ**; tuyệt đối không giữ cả it.",
        "**(3)** “in the village” = nơi chốn → **where there was no Wi-Fi**. Cách khác: the village **which had** no Wi-Fi (đổi động từ).",
        "**(4)** His bike → **whose bike**. **(5)** the bus làm tân ngữ của took → the bus **(that) we took this morning** — mệnh đề chen giữa chủ ngữ và **was late**. **(6)** They → **who**; động từ chính **were** chia theo **The people** (số nhiều).",
      ],
    },

    { t: "h", text: "III. Lược bỏ đại từ quan hệ được không? (4 câu)" },
    {
      t: "mcq",
      id: "t2d15-bt-luoc",
      title: "III. Có lược bỏ được đại từ in đậm không? (4 câu)",
      items: [
        { q: "The song **that** won the competition was written by a teenager.", options: ["Bỏ được", "Không bỏ được"], correct: 1, why: "Sau **that** là động từ **won** → that làm **chủ ngữ** → không bỏ được. Mục 3." },
        { q: "The song **that** we heard on the radio was beautiful.", options: ["Bỏ được", "Không bỏ được"], correct: 0, why: "Sau **that** là **we heard** (chủ ngữ + động từ) → that làm **tân ngữ** → bỏ được: the song we heard…" },
        { q: "Is this the key **which** you were looking for?", options: ["Bỏ được", "Không bỏ được"], correct: 0, why: "Sau which là **you were looking for** → which là tân ngữ của **for** → bỏ được: the key you were looking for?" },
        { q: "Anyone **who** wants a ticket should call this number.", options: ["Bỏ được", "Không bỏ được"], correct: 1, why: "Sau **who** là động từ **wants** → chủ ngữ → giữ. ~~Anyone wants a ticket should call~~ là câu sai." },
      ],
    },

    { t: "h", text: "IV. Sửa lỗi — viết lại câu đúng (5 câu)" },
    {
      t: "quiz",
      id: "t2d15-bt-sua",
      title: "IV. Mỗi câu có MỘT lỗi — viết lại cả câu cho đúng (5 câu)",
      kind: "fill",
      items: [
        { q: "The teacher which taught me English was from Canada.", answers: ["The teacher who taught me English was from Canada.", "The teacher that taught me English was from Canada."] },
        { q: "This is the house where I grew up in.", answers: ["This is the house where I grew up.", "This is the house I grew up in.", "This is the house that I grew up in.", "This is the house which I grew up in.", "This is the house in which I grew up."] },
        { q: "The man who he lives next door is a chef.", answers: ["The man who lives next door is a chef.", "The man that lives next door is a chef."] },
        { q: "People who lives in the countryside often grow their own vegetables.", answers: ["People who live in the countryside often grow their own vegetables.", "People that live in the countryside often grow their own vegetables."] },
        { q: "Everything what you need is in this bag.", answers: ["Everything you need is in this bag.", "Everything that you need is in this bag."] },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần IV",
      items: [
        "**(1)** which cho **người** → **who / that** (mục 2). **(2)** where đã chứa “in” → bỏ **in**, hoặc giữ in và bỏ where (mục 5).",
        "**(3)** **he** thừa — who đã là chủ ngữ (mục 3). **(4)** who = **people** (số nhiều) → **live**, không phải lives (mục 6).",
        "**(5)** **what** không đứng sau danh từ / everything → **that** hoặc bỏ (mục 2).",
      ],
    },

    { t: "h", text: "V. Dịch sang tiếng Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d15-bt-dich",
      title: "V. Dịch sang tiếng Anh — câu có mệnh đề quan hệ (6 câu)",
      kind: "translate",
      grammar: "who / which / that + V · (that) + S + V · whose + N · where + S + V · the most + adj + N + (that) I have ever…",
      items: [
        { q: "Người phụ nữ bán vé cho chúng tôi rất tốt bụng.", hint: "The woman, who, sold us the tickets, was very kind", answers: ["The woman who sold us the tickets was very kind.", "The woman that sold us the tickets was very kind.", "The woman who sold the tickets to us was very kind.", "The woman that sold the tickets to us was very kind.", "The woman who sold us tickets was very kind.", "The woman that sold us tickets was very kind.", "The lady who sold us the tickets was very kind."] },
        { q: "Tôi có một người bạn có mẹ là bác sĩ.", hint: "I have a friend, whose mother, is a doctor", answers: ["I have a friend whose mother is a doctor.", "I have a friend whose mum is a doctor.", "I have a friend whose mom is a doctor."] },
        { q: "Đây là nhà hàng nơi chúng tôi ăn tối hôm qua.", hint: "This is the restaurant, where, we had dinner, yesterday", answers: ["This is the restaurant where we had dinner yesterday.", "This is the restaurant where we ate dinner yesterday.", "This is the restaurant where we had dinner last night.", "This is the restaurant where we ate last night.", "This is the restaurant where we ate yesterday.", "This is the restaurant we had dinner at yesterday.", "This is the restaurant we had dinner at last night.", "This is the restaurant that we had dinner at yesterday.", "This is the restaurant at which we had dinner yesterday."] },
        { q: "Những học sinh nộp bài muộn sẽ bị trừ điểm.", hint: "Students, who, hand in / submit their work late, will lose marks", answers: ["Students who hand in their work late will lose marks.", "Students who submit their work late will lose marks.", "Students that hand in their work late will lose marks.", "Students that submit their work late will lose marks.", "Students who hand in their homework late will lose marks.", "Students who submit their assignments late will lose marks.", "Students who hand in their work late will lose points.", "Students who submit their work late will lose points."] },
        { q: "Đó là chuyến đi thú vị nhất mà tôi từng có.", hint: "That was, the most interesting / exciting trip, (that), I have ever had", answers: ["That was the most interesting trip that I have ever had.", "That was the most interesting trip I have ever had.", "That was the most exciting trip that I have ever had.", "That was the most exciting trip I have ever had.", "That is the most interesting trip I have ever had.", "That is the most exciting trip I have ever had.", "It was the most interesting trip I have ever had.", "It was the most exciting trip I have ever had.", "That was the most interesting trip I've ever been on.", "That was the most exciting trip I've ever been on."] },
        { q: "Lễ hội chúng tôi đến xem rất đông người.", hint: "The festival, (that), we went to, was very crowded", answers: ["The festival we went to was very crowded.", "The festival that we went to was very crowded.", "The festival which we went to was very crowded.", "The festival we went to see was very crowded.", "The festival that we went to see was very crowded.", "The festival we visited was very crowded.", "The festival that we visited was very crowded."] },
      ],
    },

    { t: "h", text: "VI. Nghe — đặt lớp học lướt sóng (5 câu)" },
    {
      t: "canh",
      anh: ["hotel", "person-surfing", "beach-with-umbrella", "man-student"],
      caption: "Sam, một khách du lịch ba lô, hỏi lễ tân Kate (người Úc) ở nhà nghỉ về lớp học lướt sóng.",
    },
    {
      t: "table",
      caption: "Surf lesson booking · Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      head: ["Mục", "Thông tin"],
      rows: [
        ["Beach", "**(1) ______** Beach"],
        ["Day and time", "Saturday, **(2) ______** a.m."],
        ["Price for hostel guests", "$ **(3) ______**"],
        ["Bring", "a towel and **(4) ______**"],
        ["Meet the instructor at", "the **(5) ______**"],
      ],
    },
    {
      t: "listen",
      id: "t2d15-bt-nghe",
      title: "Booking a surf lesson",
      dan: { so: "Day 15, Homework", boiCanh: "a conversation between a hostel receptionist and a guest who wants to book a surf lesson.", cau: [1, 5] },
      note: "Khoảng 1 phút rưỡi. Kate (lễ tân người Úc, giọng Úc, nữ) và Sam (khách, giọng Mỹ, nam). Nghe tối đa 2 lần.",
      lines: [
        { who: "Kate", voice: "au-nu", text: "G'day! Front desk. What can I do for you?", vi: "Chào bạn! Quầy lễ tân đây. Tôi giúp gì được?" },
        { who: "Sam", voice: "us-nam", text: "Hi. I saw a poster about surfing lessons. Can I book one here?", vi: "Chào chị. Tôi thấy tấm áp phích về lớp học lướt sóng. Tôi đặt ở đây được không?" },
        { who: "Kate", voice: "au-nu", text: "Sure can. The lessons are at Tallow Beach. That's T, A, double L, O, W. It's about ten minutes from here on the free shuttle.", vi: "Được chứ. Lớp học ở bãi Tallow. Là T, A, hai chữ L, O, W. Cách đây khoảng mười phút đi xe đưa đón miễn phí." },
        { who: "Sam", voice: "us-nam", text: "Great. Is there anything tomorrow arvo? I mean, tomorrow afternoon?", vi: "Tuyệt. Chiều mai — à, “arvo” — có lớp nào không?" },
        { who: "Kate", voice: "au-nu", text: "Ha, you're learning the lingo! Sorry, tomorrow afternoon's full. The next one with spaces is Saturday morning. There's one at half past eight and one at half past ten, but the early one is heaps colder, so I reckon half past ten is better.", vi: "Ha, bạn học tiếng địa phương nhanh đấy! Tiếc là chiều mai kín rồi. Lớp còn chỗ gần nhất là sáng thứ Bảy. Có lớp tám rưỡi và lớp mười rưỡi, nhưng lớp sớm lạnh hơn nhiều, nên tôi nghĩ mười rưỡi tốt hơn." },
        { who: "Sam", voice: "us-nam", text: "Half past ten sounds good.", vi: "Mười rưỡi được đấy." },
        { who: "Kate", voice: "au-nu", text: "No worries. It's normally fifty-nine dollars, but guests at the hostel get ten dollars off, so for you it's forty-nine.", vi: "Được thôi. Bình thường là năm mươi chín đô, nhưng khách ở nhà nghỉ được giảm mười đô, nên với bạn là bốn mươi chín." },
        { who: "Sam", voice: "us-nam", text: "Do I need to bring a board or a wetsuit?", vi: "Tôi có cần mang ván hay đồ bơi giữ nhiệt không?" },
        { who: "Kate", voice: "au-nu", text: "No, they give you both. Just bring a towel and some sunscreen. The sun is really strong here, even in winter.", vi: "Không, họ cho mượn cả hai. Chỉ cần mang khăn tắm và ít kem chống nắng. Nắng ở đây gắt lắm, kể cả mùa đông." },
        { who: "Sam", voice: "us-nam", text: "And where do I meet the instructor?", vi: "Tôi gặp người hướng dẫn ở đâu?" },
        { who: "Kate", voice: "au-nu", text: "Not at the surf shop. That's where people usually go by mistake. You meet at the lifeguard tower, right in the middle of the beach.", vi: "Không phải ở cửa hàng đồ lướt sóng — người ta hay nhầm tới đó. Bạn gặp ở chòi cứu hộ, ngay giữa bãi biển." },
        { who: "Sam", voice: "us-nam", text: "The lifeguard tower. Thanks, Kate!", vi: "Chòi cứu hộ. Cảm ơn chị Kate!" },
      ],
    },
    {
      t: "quiz",
      id: "t2d15-bt-nghe-dien",
      title: "VI. Questions 1–5 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Beach: ___ Beach", answers: ["Tallow"] },
        { q: "(2) Day and time: Saturday, ___ a.m.", answers: ["10.30", "10:30", "ten thirty", "10.30 a.m.", "10:30 a.m."] },
        { q: "(3) Price for hostel guests: $ ___", answers: ["49", "forty-nine", "forty nine", "$49"] },
        { q: "(4) Bring: a towel and ___", answers: ["sunscreen", "some sunscreen"] },
        { q: "(5) Meet the instructor at: the ___", answers: ["lifeguard tower"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần VI",
      items: [
        "**(1) Tallow** — đánh vần “T, A, **double L**, O, W”: double L = hai chữ L.",
        "**(2) 10.30** — bẫy **hai giờ**: 8.30 và 10.30; Kate: “the early one is **heaps colder**, so **I reckon** half past ten is better”, Sam đồng ý. Ghi bằng **số** — “half past ten” là ba từ, vượt giới hạn. (arvo = chiều mai — đã **kín**.)",
        "**(3) 49** — bẫy **giá gốc ↔ giá cuối**: 59 đô, **khách nhà nghỉ** giảm 10 → **49**. Phiếu hỏi đúng giá cho hostel guests.",
        "**(4) sunscreen** — board và wetsuit “they give you **both**” (không cần mang). **(5) lifeguard tower** — “**Not** at the surf shop… You meet at the **lifeguard tower**”.",
      ],
    },

    { t: "h", text: "VII. Âm yếu /ə/ (4 câu)" },
    {
      t: "mcq",
      id: "t2d15-bt-am-yeu",
      title: "VII. Dạng yếu hay dạng mạnh? (4 câu)",
      items: [
        { q: "In “a cup of tea”, “of” is usually pronounced…", options: ["/ɒv/", "/əv/", "/ɔːf/"], correct: 1, why: "of không được nhấn → dạng yếu **/əv/**. /ɒv/ là dạng mạnh (khi đứng cuối câu hoặc nhấn mạnh)." },
        { q: "In which sentence is “for” pronounced /fɔː/ (strong form)?", options: ["Who is it for?", "This is for you.", "We waited for an hour."], correct: 0, why: "for đứng **cuối câu** → dạng **mạnh** /fɔː/. Ở hai câu kia for đứng giữa câu, không nhấn → /fə/." },
        { q: "In “I can swim”, “can” is usually pronounced…", options: ["/kæn/", "/kɑːnt/", "/kən/"], correct: 2, why: "can giữa câu khẳng định → dạng yếu **/kən/**; nghĩa nằm ở **swim** (được nhấn). /kɑːnt/ là can't." },
        { q: "Which word in “I want to go to Sydney” is NOT usually stressed?", options: ["want", "to", "Sydney"], correct: 1, why: "**to** là từ chức năng → đọc yếu /tə/. want và Sydney là từ mang nghĩa → được nhấn (Ngày 17 học kỹ về trọng âm câu)." },
      ],
    },

    { t: "h", text: "VIII. Nói — Part 2 kể một sự kiện" },
    {
      t: "p",
      text: "Bấm giờ **1 phút**, ghi chú theo sơ đồ 4 nhánh (bài Nói mục 2) **ra giấy**, trong đó viết sẵn **3 mệnh đề quan hệ** bạn định dùng (the place where… · the people who… · the moment that I remember most…). Rồi ghi âm **2 phút**. Nghe lại: đủ 4 dòng thẻ đề chưa? Quá khứ đơn đúng hết chưa? to / of / and có đọc yếu không?",
    },
    {
      t: "speak",
      id: "t2d15-bt-noi-p2",
      part: "2",
      questions: [
        "Describe an event that you enjoyed in your town or city. You should say: what the event was; when and where it took place; who you went with; and explain why you enjoyed it.",
      ],
    },
  ],
};

export const NGAY_15: Lesson[] = [T2D15_GRAMMAR, T2D15_LISTENING, T2D15_SPEAKING, T2D15_HOMEWORK];
