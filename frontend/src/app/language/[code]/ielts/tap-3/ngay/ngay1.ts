/**
 * IELTS Tập 3 — Ngày 1 (tự soạn 18/11/2026, không chụp sách; mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI):
 *   Bài 1 · Grammar   — Hệ 12 thì: bảng tổng + timeline; hiện tại hoàn thành tiếp diễn; quá khứ hoàn thành
 *                        (ôn G01 G02 G06 G12 G20) [G22]
 *   Bài 2 · Reading   — Chiến thuật đọc band 6: skim bố cục bài ~750 từ, đọc câu hỏi trước, paraphrase 4 mức [R17 R18]
 *   Bài 3 · Listening — Part 1 giọng trộn UK / US / AU: 10/10 câu, 2 phút kiểm [L03 L16]
 *                        🔊 tự chẩn 44 âm + bù cặp /s/–/ʃ/ · /tʃ/–/dʒ/ · /v/–/w/–/f/ · /r/–/l/ [S11]
 *   Bài tập           — 44 câu: chia thì, chọn thì, sửa lỗi, dịch 💡, paraphrase 4 mức, nghe chép số / tên.
 * Nối Tập 2: N5 (hiện tại hoàn thành vs quá khứ đơn) · N21 (used to / would · quá khứ tiếp diễn) · N8 (paraphrase 3 cách)
 *           · N1 (Part 1 Form completion) · N19 (2 phút kiểm) · N15 (giọng Úc).
 * Bài đọc và bài nghe cố ý dùng lại thì của bài 1 (had been · has been V-ing · had already…).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T3D1_GRAMMAR: Lesson = {
  id: "t3d1-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Hệ 12 thì — bảng tổng, hiện tại hoàn thành tiếp diễn, quá khứ hoàn thành",
  goal: "Nhìn một câu là biết nó thuộc ô nào trong bảng 12 thì, dùng đúng hiện tại hoàn thành tiếp diễn (have been V-ing) và quá khứ hoàn thành (had V3) để kể chuyện có trước – sau, và chọn đúng thì cho Writing Task 1, Task 2 và Speaking Part 2 — nền của tiêu chí GRA band 6 “trộn câu đơn và câu phức, lỗi hiếm khi làm sai nghĩa”.",
  minutes: 90,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy tiêu chí nào",
      items: [
        "Tiếng Anh có **3 thời** (quá khứ · hiện tại · tương lai) × **4 thể** (đơn · tiếp diễn · hoàn thành · hoàn thành tiếp diễn) = ==12 thì==. Hôm nay xếp tất cả vào **một bảng** và **một trục thời gian**.",
        "Ôn nhanh 6 thì đã học ở Tập 1–2 (hiện tại đơn / tiếp diễn, quá khứ đơn / tiếp diễn, hiện tại hoàn thành, used to / would) — và sửa các lỗi còn sót ở band 5.",
        "Hai thì **mới**: ==hiện tại hoàn thành tiếp diễn== (have / has been V-ing — “đã và đang làm suốt từ đó tới giờ”) và ==quá khứ hoàn thành== (had V3 — “việc xảy ra TRƯỚC một việc khác trong quá khứ”).",
        "Lỗi số 1 của người Việt: tiếng Việt không chia thì nên bạn **giữ một thì cho cả đoạn**, hoặc dùng **had V3 cho mọi việc quá khứ**. Bài này dạy khi nào **bắt buộc** đổi thì và khi nào **không cần**.",
        "Đẩy band: **GRA band 6** ở Writing và Speaking. Giám khảo không đếm bạn dùng bao nhiêu thì — họ nhìn xem thì có **khớp với thời gian** bạn đang nói không. Sai thì ở Task 1 (năm quá khứ mà dùng hiện tại) là lỗi lặp cả bài.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Bảng 12 thì — 3 thời × 4 thể" },
    {
      t: "p",
      text: "**Thời** (time) trả lời câu hỏi **“khi nào?”**: quá khứ, hiện tại hay tương lai. **Thể** (aspect) trả lời câu hỏi **“nhìn hành động kiểu gì?”**: như một sự thật / một lần trọn vẹn (**đơn**), đang dở dang (**tiếp diễn**), đã xong trước một mốc và còn liên quan tới mốc đó (**hoàn thành**), hay kéo dài suốt cho tới một mốc (**hoàn thành tiếp diễn**). Ghép hai câu trả lời lại là ra thì.",
    },
    {
      t: "table",
      caption: "Bảng 12 thì — động từ mẫu: work. Ô có ★ là thì mới của hôm nay; ô có ☆ học ở Ngày 5.",
      head: ["Thể", "Quá khứ", "Hiện tại", "Tương lai"],
      rows: [
        ["**Đơn** (simple)", "S + V-ed / V2 — I **worked**", "S + V(s/es) — I **work** / she **works**", "S + will + V — I **will work**"],
        ["**Tiếp diễn** (continuous)", "S + was / were + V-ing — I **was working**", "S + am / is / are + V-ing — I **am working**", "☆ S + will be + V-ing — I **will be working**"],
        ["**Hoàn thành** (perfect)", "★ S + had + V3 — I **had worked**", "S + have / has + V3 — I **have worked**", "☆ S + will have + V3 — I **will have worked**"],
        ["**Hoàn thành tiếp diễn** (perfect continuous)", "★ S + had been + V-ing — I **had been working**", "★ S + have / has been + V-ing — I **have been working**", "S + will have been + V-ing (hiếm — chỉ cần nhận ra)"],
      ],
    },
    {
      t: "note",
      title: "Mẹo nhớ cấu tạo — ba “viên gạch”",
      items: [
        "**Tiếp diễn** luôn có ==be + V-ing==. **Hoàn thành** luôn có ==have + V3==. **Hoàn thành tiếp diễn** = hoàn thành của “be V-ing” → ==have + been + V-ing==.",
        "Muốn đổi **thời**, chỉ chia **trợ động từ đầu tiên**: have → **had** (quá khứ) → **will have** (tương lai). Phần sau giữ nguyên.",
        "Phủ định và câu hỏi cũng chỉ đụng tới trợ động từ đầu tiên: She **had not** finished. · **Had** she finished? · **Have** you **been** waiting long?",
      ],
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Bốn thể nhìn từ mốc “bây giờ”",
      caption: "Cùng một việc “làm việc ở công ty này”, bốn cách nhìn. Đổi mốc sang một điểm trong quá khứ thì được bốn thì quá khứ.",
      marks: [
        { from: -9, to: 9, label: "I **work** here. — sự thật, thói quen (hiện tại đơn)", kieu: "lap", mau: 1 },
        { from: -1, to: 1, label: "I **am working** now. — đang dở, tạm thời (hiện tại tiếp diễn)", kieu: "doan", mau: 2 },
        { from: -6, label: "I **have worked** on three projects. — đã xong trước bây giờ, kết quả còn đó (hiện tại hoàn thành)", kieu: "diem", mau: 3 },
        { from: -7, to: 0, label: "I **have been working** here since 2023. — kéo dài suốt tới bây giờ (HTHT tiếp diễn)", kieu: "doan", mau: 1 },
      ],
    },
    {
      t: "mcq",
      id: "t3d1-bang-ten-thi",
      title: "Câu này là thì nào? (6 câu)",
      items: [
        { q: "The number of visitors **had doubled** by 2015.", options: ["Quá khứ hoàn thành", "Hiện tại hoàn thành", "Quá khứ đơn", "Quá khứ tiếp diễn"], correct: 0, why: "**had + V3** = quá khứ hoàn thành: việc tăng gấp đôi xong **trước** mốc quá khứ 2015." },
        { q: "She **has been learning** Japanese for two years.", options: ["Hiện tại tiếp diễn", "Hiện tại hoàn thành tiếp diễn", "Quá khứ hoàn thành tiếp diễn", "Hiện tại hoàn thành"], correct: 1, why: "**has been + V-ing** = hiện tại hoàn thành tiếp diễn: bắt đầu hai năm trước, vẫn đang học." },
        { q: "When I arrived, they **were having** dinner.", options: ["Quá khứ đơn", "Quá khứ hoàn thành", "Quá khứ tiếp diễn", "Hiện tại tiếp diễn"], correct: 2, why: "**were + V-ing** = quá khứ tiếp diễn: đang dở lúc tôi tới (ôn Tập 2 Ngày 21)." },
        { q: "Water **boils** at 100 degrees Celsius.", options: ["Hiện tại tiếp diễn", "Tương lai đơn", "Hiện tại hoàn thành", "Hiện tại đơn"], correct: 3, why: "Sự thật khoa học → hiện tại đơn, ngôi ba số ít thêm **-s** (ôn Tập 1 Ngày 1)." },
        { q: "Prices **have risen** sharply since January.", options: ["Hiện tại hoàn thành", "Quá khứ đơn", "Hiện tại hoàn thành tiếp diễn", "Quá khứ hoàn thành"], correct: 0, why: "**have + V3** + since = hiện tại hoàn thành (ôn Tập 2 Ngày 5)." },
        { q: "They **had been waiting** for an hour when the bus finally came.", options: ["Quá khứ tiếp diễn", "Quá khứ hoàn thành tiếp diễn", "Hiện tại hoàn thành tiếp diễn", "Quá khứ hoàn thành"], correct: 1, why: "**had been + V-ing**: việc chờ kéo dài suốt một tiếng **cho tới** mốc quá khứ “xe buýt đến”." },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Ôn nhanh nhóm hiện tại: hiện tại đơn và hiện tại tiếp diễn" },
    {
      t: "p",
      text: "Hai thì này bạn học từ Tập 1 (Ngày 1, Ngày 9). Ở band 6 chỉ còn **ba chỗ hay sai**: quên **-s** ngôi ba, dùng tiếp diễn cho **động từ trạng thái**, và không biết hiện tại tiếp diễn còn tả **xu hướng đang thay đổi** — cách dùng rất đắt trong Task 2.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V(s/es) + O",
          vi: "Hiện tại đơn: sự thật, thói quen, lịch cố định, quan điểm chung trong bài luận.",
          examples: [
            { en: "Most students **rely** on their phones for information.", vi: "Phần lớn sinh viên dựa vào điện thoại để tìm thông tin." },
            { en: "The chart **shows** how energy use **differs** between four countries.", vi: "Biểu đồ cho thấy mức dùng năng lượng khác nhau thế nào giữa bốn nước." },
          ],
        },
        {
          formula: "S + am / is / are + V-ing + O",
          vi: "Hiện tại tiếp diễn: đang xảy ra lúc nói, việc tạm thời, và XU HƯỚNG đang thay đổi (thường đi với more and more, increasingly, these days).",
          examples: [
            { en: "More and more people **are choosing** to work from home.", vi: "Ngày càng nhiều người chọn làm việc tại nhà." },
            { en: "The climate **is getting** warmer, and sea levels **are rising**.", vi: "Khí hậu đang ấm dần lên, và mực nước biển đang dâng." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Động từ trạng thái (stative verbs) — KHÔNG dùng ở thể tiếp diễn",
      head: ["Nhóm", "Động từ", "Sai → Đúng"],
      rows: [
        ["Suy nghĩ, ý kiến", "know · believe · think (= cho rằng) · understand · agree · remember · mean", "~~I am agreeing with this view.~~ → I **agree** with this view."],
        ["Cảm xúc, mong muốn", "like · love · hate · prefer · want · need", "~~Children are needing more sleep.~~ → Children **need** more sleep."],
        ["Sở hữu, bản chất", "have (= có) · own · belong · contain · consist of · depend on", "~~This area is having many factories.~~ → This area **has** many factories."],
        ["Giác quan, vẻ ngoài", "see · hear · seem · appear · look (= trông có vẻ)", "~~The plan is seeming expensive.~~ → The plan **seems** expensive."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở nhóm hiện tại",
      items: [
        "Quên **-s / -es** khi chủ ngữ là danh từ số ít hoặc danh từ không đếm được: ~~The government spend~~ → The government **spends**; ~~Technology make~~ → Technology **makes**.",
        "Dùng hiện tại đơn cho xu hướng đang đổi: Nowadays, more people **work** online — câu này không sai, nhưng Nowadays, more and more people **are working** online nói rõ hơn ý “đang tăng dần lên”.",
        "**think** có hai nghĩa: I **think** it is unfair (cho rằng — trạng thái, không tiếp diễn) · I **am thinking** about changing my job (đang cân nhắc — hành động, tiếp diễn được).",
      ],
    },
    {
      t: "rule",
      formula: "Sự thật / thói quen → S + V(s/es) · Đang dở / tạm thời / xu hướng đang đổi → S + am / is / are + V-ing",
      vi: "Động từ trạng thái (know, believe, want, have = có, seem…) luôn ở thể đơn.",
    },
    {
      t: "quiz",
      id: "t3d1-hien-tai-dich",
      title: "Dịch sang tiếng Anh — hiện tại đơn hay tiếp diễn? (4 câu)",
      kind: "translate",
      grammar: "Sự thật: S + V(s/es) · Xu hướng đang đổi: S + am / is / are + V-ing · Động từ trạng thái: luôn thể đơn",
      items: [
        { q: "Ngày càng nhiều người trẻ đang rời nông thôn.", answers: ["More and more young people are leaving the countryside.", "More and more young people are leaving rural areas."], hint: "more and more · leave · the countryside" },
        { q: "Chính phủ chi rất nhiều tiền cho đường sá.", answers: ["The government spends a lot of money on roads.", "The government spends a great deal of money on roads."], hint: "spend … on · chủ ngữ số ít → -s" },
        { q: "Tôi không đồng ý với ý kiến này.", answers: ["I do not agree with this opinion.", "I don't agree with this opinion.", "I do not agree with this view.", "I don't agree with this view.", "I disagree with this opinion.", "I disagree with this view."], hint: "agree with — động từ trạng thái" },
        { q: "Giá thuê nhà ở các thành phố lớn đang tăng nhanh.", answers: ["Rents in big cities are rising quickly.", "Rents in big cities are rising fast.", "Rents in big cities are increasing quickly.", "Rents in large cities are rising quickly.", "Rent in big cities is rising quickly.", "Rents in big cities are rising rapidly."], hint: "rents · rise · quickly" },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Ôn nhanh nhóm quá khứ: quá khứ đơn, quá khứ tiếp diễn, used to / would" },
    {
      t: "p",
      text: "Ôn từ **Tập 2 Ngày 21**. Quá khứ đơn là thì **xương sống** khi kể chuyện (Speaking Part 2) và khi tả biểu đồ có năm trong quá khứ (Task 1). Quá khứ tiếp diễn chỉ làm **nền**: việc đang dở khi việc chính xảy ra. **used to / would** nói thói quen ngày xưa nay không còn.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V-ed / V2 + mốc thời gian quá khứ",
          vi: "Quá khứ đơn: việc đã xong tại một thời điểm quá khứ xác định (in 2010, last year, two days ago, when I was a child).",
          examples: [
            { en: "Sales **fell** to 20,000 units in 2012 and then **recovered**.", vi: "Doanh số giảm xuống 20.000 chiếc năm 2012 rồi hồi phục." },
            { en: "I **started** learning English when I **was** twelve.", vi: "Tôi bắt đầu học tiếng Anh khi tôi mười hai tuổi." },
          ],
        },
        {
          formula: "S + was / were + V-ing + when + S + V-ed",
          vi: "Quá khứ tiếp diễn làm nền (việc dài), quá khứ đơn là việc ngắn cắt ngang.",
          examples: [
            { en: "I **was preparing** for my exam when the power **went** out.", vi: "Tôi đang ôn thi thì mất điện." },
            { en: "While we **were waiting**, it **started** to rain.", vi: "Trong lúc chúng tôi đang chờ thì trời bắt đầu mưa." },
          ],
        },
        {
          formula: "S + used to + V · S + would + V",
          vi: "Thói quen / trạng thái ngày xưa, nay không còn. would chỉ dùng cho HÀNH ĐỘNG lặp lại, không dùng cho trạng thái.",
          examples: [
            { en: "People **used to** write letters; now they send messages.", vi: "Ngày xưa người ta viết thư; giờ họ gửi tin nhắn." },
            { en: "Every summer we **would** visit my grandparents in the countryside.", vi: "Mỗi mùa hè chúng tôi thường về thăm ông bà ở quê." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — ba lỗi quá khứ còn sót ở band 5",
      items: [
        "Kể chuyện quá khứ nhưng **trượt về hiện tại** giữa chừng: ~~Last year I went to Da Lat. The weather is cool and I like it.~~ → The weather **was** cool and I **liked** it.",
        "Sau **did / didn't** dùng động từ nguyên mẫu: ~~didn't went~~ → didn't **go**; câu hỏi: ~~Did you saw?~~ → Did you **see**?",
        "~~I would live in Hue when I was small.~~ (live là trạng thái) → I **used to live** in Hue. Và **be used to + V-ing** (= quen với) là cấu trúc khác: I **am used to getting** up early.",
      ],
    },
    {
      t: "rule",
      formula: "Việc chính trong quá khứ → S + V-ed / V2 · Nền đang dở → S + was / were + V-ing · Thói quen xưa → S + used to + V",
      vi: "Có mốc quá khứ xác định (in 2010, last week, when I was young) thì dùng quá khứ đơn, không dùng hiện tại hoàn thành.",
    },
    {
      t: "quiz",
      id: "t3d1-qua-khu-dich",
      title: "Dịch sang tiếng Anh — nhóm quá khứ (4 câu)",
      kind: "translate",
      grammar: "S + V-ed / V2 · S + was / were + V-ing + when + S + V-ed · S + used to + V",
      items: [
        { q: "Năm 2015, con số này giảm xuống còn 30%.", answers: ["In 2015, this figure fell to 30%.", "In 2015 this figure fell to 30%.", "In 2015, the figure fell to 30%.", "In 2015, this figure dropped to 30%.", "In 2015, this figure decreased to 30%.", "This figure fell to 30% in 2015."], hint: "figure · fall → fell · to 30%" },
        { q: "Tôi đang đi bộ về nhà thì gặp thầy giáo cũ.", answers: ["I was walking home when I met my old teacher.", "I was walking home when I met my former teacher."], hint: "was walking … when … met" },
        { q: "Ngày xưa bố tôi thường đạp xe đi làm.", answers: ["My father used to cycle to work.", "My dad used to cycle to work.", "My father used to ride a bike to work.", "My father used to ride his bike to work.", "My father would cycle to work."], hint: "used to + V · cycle to work" },
        { q: "Hồi còn nhỏ, tôi sống ở một ngôi làng nhỏ.", answers: ["When I was a child, I lived in a small village.", "When I was a child, I used to live in a small village.", "When I was young, I lived in a small village.", "When I was young, I used to live in a small village.", "When I was small, I lived in a small village.", "I used to live in a small village when I was a child.", "I lived in a small village when I was a child."], hint: "live là trạng thái → lived / used to live (không dùng would)" },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Hiện tại hoàn thành — cầu nối quá khứ với hiện tại (ôn và nâng)" },
    {
      t: "p",
      text: "Ôn từ **Tập 2 Ngày 5**: **have / has + V3** dùng khi việc xảy ra **trước bây giờ** mà **không nói rõ lúc nào**, hoặc bắt đầu trong quá khứ và **kéo tới bây giờ** (for / since). Ở band 6 bạn cần thêm hai cách dùng: **khoảng thời gian chưa kết thúc** (this year, so far, over the past decade) và **mở đoạn bằng xu hướng** trong Task 2.",
    },
    {
      t: "table",
      caption: "Hiện tại hoàn thành hay quá khứ đơn? — nhìn TỪ CHỈ THỜI GIAN",
      head: ["Tín hiệu", "Thì", "Ví dụ"],
      rows: [
        ["Mốc quá khứ **đã đóng**: in 2019 · last year · yesterday · ago · when I was young", "Quá khứ đơn", "The city **built** a new bridge **in 2019**."],
        ["Khoảng **chưa đóng**, tính tới bây giờ: so far · this year · recently · over the past ten years · in recent decades", "Hiện tại hoàn thành", "The city **has built** three bridges **over the past ten years**."],
        ["**for** + khoảng / **since** + mốc, việc còn tiếp diễn", "Hiện tại hoàn thành", "She **has lived** here **since 2020** / **for five years**."],
        ["Không nêu thời gian — chỉ quan tâm **kết quả bây giờ**", "Hiện tại hoàn thành", "Technology **has changed** the way we communicate."],
        ["**since** + mệnh đề: mệnh đề sau since thường ở quá khứ đơn (mốc bắt đầu)", "HTHT + since + QKĐ", "Sales **have doubled since** the company **opened** its online shop."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với hiện tại hoàn thành",
      items: [
        "Ghép hiện tại hoàn thành với mốc đã đóng: ~~I have graduated in 2022.~~ → I **graduated** in 2022.",
        "Dùng hiện tại đơn với for / since: ~~I live here since 2020.~~ → I **have lived** here since 2020.",
        "Chủ ngữ số ít mà dùng have: ~~The number of cars have increased.~~ → The number of cars **has** increased (chủ ngữ thật là **the number**).",
        "Task 1 có trục năm trong quá khứ (2000–2020) thì **không** dùng hiện tại hoàn thành để tả; hiện tại hoàn thành chỉ hợp khi biểu đồ kéo **tới hiện tại**.",
      ],
    },
    {
      t: "rule",
      formula: "Mốc đã đóng → S + V-ed / V2 · Khoảng chưa đóng / không nêu lúc nào → S + have / has + V3",
      vi: "Câu mở thân bài Task 2 rất hay dùng: Over the past few decades, … has + V3.",
    },
    {
      t: "quiz",
      id: "t3d1-htht-dich",
      title: "Dịch sang tiếng Anh — hiện tại hoàn thành hay quá khứ đơn? (4 câu)",
      kind: "translate",
      grammar: "Mốc đã đóng: S + V-ed / V2 · Khoảng chưa đóng: S + have / has + V3 (+ for / since / over the past…)",
      items: [
        { q: "Trong mười năm qua, số người dùng Internet đã tăng mạnh.", answers: ["Over the past ten years, the number of Internet users has increased sharply.", "Over the past ten years, the number of internet users has increased sharply.", "Over the last ten years, the number of Internet users has increased sharply.", "Over the past decade, the number of Internet users has increased sharply.", "Over the past ten years, the number of Internet users has risen sharply.", "Over the past decade, the number of internet users has risen sharply.", "In the past ten years, the number of Internet users has increased sharply."], hint: "over the past ten years · the number of … has + V3" },
        { q: "Tôi tốt nghiệp đại học năm ngoái.", answers: ["I graduated from university last year.", "I graduated from college last year."], hint: "last year = mốc đã đóng · graduate from" },
        { q: "Công nghệ đã thay đổi cách chúng ta học.", answers: ["Technology has changed the way we learn.", "Technology has changed the way we study.", "Technology has changed how we learn.", "Technology has changed the way that we learn."], hint: "has changed · the way we…" },
        { q: "Cô ấy làm việc ở đây từ khi rời Hà Nội.", answers: ["She has worked here since she left Hanoi.", "She has been working here since she left Hanoi.", "She has worked here since she left Ha Noi.", "She has been working here since she left Ha Noi."], hint: "has worked … since + quá khứ đơn" },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. ★ Hiện tại hoàn thành tiếp diễn — have / has been + V-ing" },
    {
      t: "p",
      text: "Thì này nói về một **hoạt động** bắt đầu trong quá khứ và **kéo dài suốt tới bây giờ** — thường vẫn đang tiếp tục, hoặc vừa mới dừng và còn để lại **dấu vết**. Tiếng Việt hay nói “đã … được (bao lâu) rồi”, “suốt từ … tới giờ”, “dạo này cứ…”. Điểm khác với hiện tại hoàn thành thường: nó nhấn vào **quá trình và độ dài**, không nhấn vào kết quả.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + have / has + been + V-ing (+ for / since …)",
          vi: "Hoạt động kéo dài từ quá khứ tới bây giờ — trả lời câu hỏi How long…?",
          examples: [
            { en: "I **have been learning** English **for** six years.", vi: "Tôi học tiếng Anh được sáu năm rồi (và vẫn đang học)." },
            { en: "Scientists **have been studying** this problem **since** the 1990s.", vi: "Các nhà khoa học nghiên cứu vấn đề này suốt từ những năm 1990." },
          ],
        },
        {
          formula: "S + have / has + been + V-ing (không cần for / since)",
          vi: "Hoạt động vừa dừng, còn dấu vết ở hiện tại; hoặc việc lặp lại “dạo gần đây”.",
          examples: [
            { en: "Sorry I look tired — I **have been working** all night.", vi: "Xin lỗi trông tôi mệt — tôi làm việc suốt cả đêm." },
            { en: "Recently I **have been reading** a lot about artificial intelligence.", vi: "Dạo này tôi đọc rất nhiều về trí tuệ nhân tạo." },
          ],
        },
        {
          formula: "S + have / has + not + been + V-ing · Have / Has + S + been + V-ing?",
          vi: "Phủ định và câu hỏi: chỉ đổi trợ động từ đầu tiên (have / has).",
          examples: [
            { en: "He **hasn't been sleeping** well lately.", vi: "Dạo này anh ấy ngủ không ngon." },
            { en: "How long **have** you **been living** in this city?", vi: "Bạn sống ở thành phố này bao lâu rồi?" },
          ],
        },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "have done hay have been doing?",
      caption: "Cùng một việc, hai cách nhìn. Hỏi “bao nhiêu / xong chưa” → have done. Hỏi “bao lâu / dạo này bận gì” → have been doing.",
      cols: [
        {
          title: "**have / has + V3** — KẾT QUẢ, số lượng",
          items: [
            "I **have written** three reports this week. (đếm được: ba bản, đã xong)",
            "She **has read** the book. (đọc xong rồi)",
            "How **many** pages have you written?",
            "Dùng với động từ **trạng thái**: I **have known** her for years.",
          ],
        },
        {
          title: "**have / has been + V-ing** — QUÁ TRÌNH, độ dài",
          items: [
            "I **have been writing** reports all week. (bận suốt, chưa chắc xong)",
            "She **has been reading** the book. (đang đọc dở)",
            "How **long** have you been writing?",
            "**Không** dùng với động từ trạng thái: ~~I have been knowing her~~.",
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với have been V-ing",
      items: [
        "Dùng hiện tại tiếp diễn với for / since: ~~I am learning English for six years.~~ → I **have been learning** English for six years. Tiếng Việt nói “tôi đang học … được 6 năm” nên rất dễ dịch thẳng.",
        "Thiếu **been**: ~~I have learning~~ → I have **been** learning. Hoặc thừa: ~~I have been learn~~ → I have been **learning**.",
        "Có **số lần / số lượng** thì dùng have + V3: ~~I have been visiting Da Nang three times.~~ → I **have visited** Da Nang three times.",
        "Với **live · work · study · teach**, hai dạng gần như cùng nghĩa: I **have lived** / **have been living** here for ten years — cả hai đều đúng.",
      ],
    },
    {
      t: "p",
      text: "**Dùng trong IELTS.** Speaking Part 1 rất hay hỏi “How long have you been…?” (studying English, living in your hometown, working there) — trả lời bằng đúng thì này là ghi điểm GRA ngay câu đầu. Trong Task 2, nó tả một hiện tượng **vẫn đang diễn ra**: Governments **have been investing** heavily in renewable energy.",
    },
    {
      t: "rule",
      formula: "S + have / has + been + V-ing + for / since …",
      vi: "Hoạt động kéo dài từ quá khứ tới bây giờ, nhấn vào “bao lâu”. Đếm số lần / kết quả hoặc gặp động từ trạng thái thì quay về have / has + V3.",
    },
    {
      t: "quiz",
      id: "t3d1-htht-td-dich",
      title: "Dịch sang tiếng Anh — hiện tại hoàn thành tiếp diễn (5 câu)",
      kind: "translate",
      grammar: "S + have / has + been + V-ing + for / since … (số lần / kết quả / động từ trạng thái → have / has + V3)",
      items: [
        { q: "Tôi học tiếng Anh được sáu năm rồi.", answers: ["I have been learning English for six years.", "I've been learning English for six years.", "I have been studying English for six years.", "I've been studying English for six years."], hint: "have been learning · for six years" },
        { q: "Bạn sống ở đây bao lâu rồi?", answers: ["How long have you been living here?", "How long have you lived here?"], hint: "How long have you been + V-ing" },
        { q: "Dạo này trời cứ mưa suốt.", answers: ["It has been raining a lot recently.", "It's been raining a lot recently.", "It has been raining a lot lately.", "It's been raining a lot lately.", "Recently, it has been raining a lot.", "Lately, it has been raining a lot."], hint: "It has been raining · a lot · recently / lately" },
        { q: "Tôi quen cô ấy được mười năm rồi.", answers: ["I have known her for ten years.", "I've known her for ten years."], hint: "know là động từ trạng thái → have known" },
        { q: "Chính phủ đầu tư vào năng lượng sạch suốt từ năm 2015.", answers: ["The government has been investing in clean energy since 2015.", "The government has invested in clean energy since 2015."], hint: "has been investing in · since 2015" },
      ],
    },
    {
      t: "quiz",
      id: "t3d1-htht-td-chia",
      title: "Chia động từ: have done hay have been doing? (6 câu)",
      kind: "fill",
      items: [
        { q: "She ___ (write) emails all morning, and she still has ten more to send.", answers: ["has been writing", "'s been writing"] },
        { q: "She ___ (write) twelve emails so far this morning.", answers: ["has written", "'s written"] },
        { q: "How long have you ___ (wait)? — About forty minutes.", answers: ["been waiting"] },
        { q: "I ___ (own) this laptop since 2021.", answers: ["have owned", "'ve owned"], hint: "own = sở hữu, động từ trạng thái" },
        { q: "Your eyes are red. Have you ___ (cry)?", answers: ["been crying"] },
        { q: "The company ___ (open) four new branches this year.", answers: ["has opened", "'s opened"] },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. ★ Quá khứ hoàn thành — had + V3: “quá khứ của quá khứ”" },
    {
      t: "p",
      text: "Khi đang kể chuyện ở **quá khứ đơn** mà cần nhắc tới một việc xảy ra **trước đó nữa**, tiếng Anh lùi thêm một bậc: **had + V3**. Tiếng Việt dùng chữ “đã … rồi”, “trước đó”. Không có mốc quá khứ để so thì **không** dùng thì này.",
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Hai việc trong quá khứ — việc nào trước dùng had + V3",
      caption: "When I arrived at the station, the train had already left. — Tàu đi TRƯỚC (had left), tôi đến SAU (arrived).",
      marks: [
        { from: -7, label: "①  The train **had left**. (việc trước → had + V3)", kieu: "diem", mau: 3 },
        { from: -4, label: "②  I **arrived** at the station. (mốc quá khứ → V-ed)", kieu: "diem", mau: 1 },
        { from: 0, label: "Bây giờ — lúc tôi kể lại", kieu: "diem", mau: 2 },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + had + V3 … when / before / by the time + S + V-ed",
          vi: "Việc ở vế had + V3 đã xong TRƯỚC việc ở vế quá khứ đơn.",
          examples: [
            { en: "By the time the police **arrived**, the thieves **had escaped**.", vi: "Lúc cảnh sát đến thì bọn trộm đã trốn mất rồi." },
            { en: "I **had never seen** snow before I **moved** to Canada.", vi: "Tôi chưa từng thấy tuyết trước khi chuyển tới Canada." },
          ],
        },
        {
          formula: "S + V-ed … because / that + S + had + V3",
          vi: "Giải thích NGUYÊN NHÂN có từ trước, hoặc thuật lại điều ai đó nhận ra / nói.",
          examples: [
            { en: "She **failed** the test because she **had not revised** enough.", vi: "Cô ấy trượt bài kiểm tra vì trước đó ôn chưa đủ." },
            { en: "He **realised** that he **had left** his passport at home.", vi: "Anh ấy nhận ra mình đã để quên hộ chiếu ở nhà." },
          ],
        },
        {
          formula: "By + năm quá khứ, S + had + V3",
          vi: "Task 1: tính tới một năm trong quá khứ, con số ĐÃ đạt mức nào.",
          examples: [
            { en: "**By 2010**, the figure **had risen** to 60%.", vi: "Tính tới năm 2010, con số đã tăng lên 60%." },
            { en: "**By the end of the period**, car ownership **had more than doubled**.", vi: "Tới cuối giai đoạn, tỉ lệ sở hữu ô tô đã tăng hơn gấp đôi." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "when + quá khứ đơn hay when + … had V3? — nghĩa khác hẳn",
      head: ["Câu", "Thứ tự", "Nghĩa"],
      rows: [
        ["When I arrived, they **had** dinner.", "tôi đến → rồi họ ăn", "Tôi đến thì (sau đó) họ mới ăn tối."],
        ["When I arrived, they **were having** dinner.", "họ đang ăn dở → tôi đến", "Tôi đến lúc họ đang ăn tối."],
        ["When I arrived, they **had had** dinner.", "họ ăn xong → tôi đến", "Tôi đến thì họ đã ăn tối xong rồi."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — had V3 KHÔNG phải “quá khứ xa”",
      items: [
        "Sai phổ biến nhất ở band 5–6: nghĩ had + V3 = chuyện đã lâu. ~~I had graduated in 2015.~~ (chỉ có một việc) → I **graduated** in 2015. Phải có **hai việc quá khứ** để so trước – sau.",
        "Kể các việc **theo đúng thứ tự** thì chỉ cần quá khứ đơn: I got up, **had** breakfast and **left** the house. (không cần had had)",
        "Có **before / after** đã rõ thứ tự thì quá khứ đơn cũng được: After she **finished** (hoặc had finished) her degree, she moved abroad. Trong bài thi, **had + V3** ở đây vẫn đúng và cho thấy bạn kiểm soát được thứ tự sự việc — nhưng đừng thêm nó khi chỉ có một việc.",
        "Sau **had** là **V3**, không phải V2: ~~had went~~ → had **gone**; ~~had saw~~ → had **seen**; ~~had rose~~ → had **risen**.",
      ],
    },
    {
      t: "p",
      text: "**Quá khứ hoàn thành tiếp diễn — had been + V-ing** (chỉ cần hiểu và dùng được một hai câu): hoạt động **kéo dài suốt** cho tới một mốc quá khứ, thường để giải thích tình trạng lúc đó. Nó là bản “lùi về quá khứ” của have been V-ing ở mục 5. Ví dụ: She was exhausted because she **had been working** since 5 a.m. — Cô ấy kiệt sức vì đã làm việc suốt từ 5 giờ sáng. · We **had been waiting** for an hour when the bus finally came.",
    },
    {
      t: "rule",
      formula: "Việc trước: S + had + V3 → Việc sau (mốc): S + V-ed",
      vi: "Chỉ dùng khi có hai việc trong quá khứ và cần nói rõ việc nào xong trước. Tín hiệu: by the time · by + năm · before · already · never … before · because.",
    },
    {
      t: "quiz",
      id: "t3d1-qkht-dich",
      title: "Dịch sang tiếng Anh — quá khứ hoàn thành (5 câu)",
      kind: "translate",
      grammar: "Việc trước: S + had + V3 · Việc sau: S + V-ed · By + năm quá khứ, S + had + V3",
      items: [
        { q: "Khi tôi đến rạp, bộ phim đã bắt đầu rồi.", answers: ["When I arrived at the cinema, the film had already started.", "When I got to the cinema, the film had already started.", "When I arrived at the cinema, the movie had already started.", "When I arrived at the cinema, the film had already begun.", "When I got to the cinema, the movie had already started.", "The film had already started when I arrived at the cinema."], hint: "arrived at · had already started" },
        { q: "Tính tới năm 2010, con số này đã tăng lên 60%.", answers: ["By 2010, this figure had risen to 60%.", "By 2010, the figure had risen to 60%.", "By 2010, this figure had increased to 60%.", "By 2010 this figure had risen to 60%.", "By 2010, this figure had gone up to 60%."], hint: "By 2010 · had risen to" },
        { q: "Cô ấy trượt vì trước đó không ôn bài.", answers: ["She failed because she had not revised.", "She failed because she hadn't revised.", "She failed because she had not studied.", "She failed because she hadn't studied."], hint: "failed · because · had not revised" },
        { q: "Tôi chưa bao giờ đi máy bay trước chuyến đi đó.", answers: ["I had never flown before that trip.", "I had never travelled by plane before that trip.", "I had never been on a plane before that trip.", "I had never taken a plane before that trip.", "Before that trip, I had never flown.", "I had never traveled by plane before that trip."], hint: "had never + V3 · before that trip" },
        { q: "Anh ấy nhận ra mình đã để quên điện thoại ở nhà.", answers: ["He realised that he had left his phone at home.", "He realised he had left his phone at home.", "He realized that he had left his phone at home.", "He realized he had left his phone at home."], hint: "realised (that) · had left · at home" },
      ],
    },
    {
      t: "quiz",
      id: "t3d1-qkht-chia",
      title: "Chia động từ: quá khứ đơn hay quá khứ hoàn thành? (6 câu)",
      kind: "fill",
      items: [
        { q: "By the time we reached the airport, the plane ___ (take off).", answers: ["had taken off", "had already taken off"] },
        { q: "I recognised him at once because I ___ (meet) him before.", answers: ["had met", "'d met"] },
        { q: "She got up, ___ (have) a shower and went to work.", answers: ["had"], hint: "ba việc nối tiếp đúng thứ tự → quá khứ đơn" },
        { q: "The streets were wet because it ___ (rain) all night. (hoạt động kéo dài suốt tới mốc quá khứ)", answers: ["had been raining", "had rained"] },
        { q: "In 2018 the company ___ (open) its first shop in Da Nang.", answers: ["opened"], hint: "một việc, có mốc năm → quá khứ đơn" },
        { q: "By 2000, the population of the town ___ (reach) 50,000.", answers: ["had reached", "had already reached"] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Nhóm tương lai — nhắc nhanh (học kỹ ở Ngày 5)" },
    {
      t: "table",
      caption: "Bốn cách nói tương lai bạn đã có + hai thì sắp học",
      head: ["Dạng", "Dùng khi", "Ví dụ"],
      rows: [
        ["**will + V**", "Dự đoán, quyết định ngay lúc nói, lời hứa", "I think online learning **will become** more common."],
        ["**be going to + V**", "Kế hoạch đã định; dự đoán có bằng chứng trước mắt", "I **am going to take** the IELTS test in March."],
        ["**Hiện tại tiếp diễn**", "Lịch hẹn đã sắp xếp với người khác", "I **am meeting** my tutor tomorrow at nine."],
        ["**Hiện tại đơn**", "Lịch tàu xe, thời khoá biểu; sau if / when / until (Tập 2 Ngày 13)", "The course **starts** on 3 May. · When it **ends**, I will apply for a job."],
        ["☆ will be + V-ing · will have + V3", "Đang dở tại một mốc tương lai · xong trước một mốc tương lai", "By 2040 the population **will have reached** 9 billion. (Ngày 5)"],
      ],
    },
    {
      t: "rule",
      formula: "Dự đoán → will + V · Kế hoạch → am / is / are going to + V · Sau when / if / until → hiện tại đơn (không will)",
      vi: "Bốn dạng này đủ cho band 6; tương lai tiếp diễn và tương lai hoàn thành học ở Ngày 5.",
    },

    /* ── 8 ── */
    { t: "h", text: "8. Chọn thì trong bài thi IELTS" },
    {
      t: "table",
      caption: "Mỗi phần thi một “thì xương sống” — nhìn THỜI GIAN của đề trước khi viết / nói",
      head: ["Phần thi", "Thì chính", "Thì phụ và ví dụ"],
      rows: [
        ["**Task 1** — biểu đồ có năm **quá khứ** (1990–2010)", "Quá khứ đơn", "Câu giới thiệu vẫn ở hiện tại: The graph **shows**… Thân bài: rose, fell, remained. Mốc “tính tới”: **By 2010**, it **had fallen** to 5%."],
        ["**Task 1** — không có năm / một thời điểm chung", "Hiện tại đơn", "Germany **has** the highest figure, while Italy **spends** the least."],
        ["**Task 1** — có năm **tương lai** (dự báo)", "will + V · is expected to", "The figure **is expected to reach** 70% by 2040. (Ngày 5)"],
        ["**Task 1** — quy trình, bản đồ", "Hiện tại đơn (bị động) · Bản đồ: hiện tại hoàn thành / quá khứ", "The beans **are dried**… · A new car park **has been built** / **was built**."],
        ["**Task 2**", "Hiện tại đơn", "Xu hướng: **has + V3**, **is / are + V-ing**. Ví dụ đời thật: quá khứ đơn. Dự đoán / hệ quả: will, would."],
        ["**Speaking Part 1**", "Hiện tại đơn", "How long…? → **have been V-ing**. Ngày xưa: **used to**."],
        ["**Speaking Part 2** — kể chuyện", "Quá khứ đơn", "Nền: **was V-ing**. Việc trước đó: **had V3**. Cảm nghĩ bây giờ: hiện tại đơn."],
        ["**Speaking Part 3**", "Hiện tại đơn", "So sánh xưa – nay: **used to** → **now**. Xu hướng: **have V3**. Dự đoán: will / might."],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "It **was** about three years ago. I **was studying** for my final exams when a friend **called** me. She **had just won** two tickets to a concert, and she **wanted** me to come.", vi: "Đó là khoảng ba năm trước. Tôi đang ôn thi cuối kỳ thì một người bạn gọi. Cô ấy vừa trúng hai vé xem ca nhạc, và muốn tôi đi cùng. — Một đoạn Part 2: quá khứ đơn (xương sống) + quá khứ tiếp diễn (nền) + quá khứ hoàn thành (việc trước đó)." },
        { en: "In 1990, only 10% of households **owned** a computer. The figure **rose** steadily, and **by 2010** it **had reached** 75%.", vi: "Năm 1990, chỉ 10% hộ gia đình có máy tính. Con số tăng đều, và tính tới 2010 đã đạt 75%. — Task 1: quá khứ đơn + By 2010… had V3." },
        { en: "Over the past two decades, cities **have grown** rapidly, and many of them **are struggling** with traffic. When I **visited** Jakarta in 2023, it **took** me two hours to travel ten kilometres.", vi: "Trong hai thập kỷ qua, các thành phố đã lớn lên nhanh chóng, và nhiều nơi đang vật lộn với giao thông. Khi tôi tới Jakarta năm 2023, tôi mất hai tiếng để đi mười cây số. — Task 2: xu hướng (HTHT, HTTD) rồi ví dụ (quá khứ đơn)." },
      ],
    },
    {
      t: "note",
      title: "Mẹo soát thì trong 1 phút cuối giờ viết",
      items: [
        "Khoanh mọi **từ chỉ thời gian** trong bài (in 2005, since, by 2010, over the past…, nowadays). Mỗi từ kéo theo **một thì** — động từ đứng cạnh nó có khớp không?",
        "Task 1: nhìn **trục ngang**. Toàn năm quá khứ → gạch chân mọi động từ thân bài, cái nào còn ở hiện tại thì sửa.",
        "Một câu có **hai động từ** thì hỏi: hai việc **cùng lúc**, **nối tiếp**, hay **một việc trước hẳn**? Chỉ trường hợp cuối mới cần had + V3.",
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Luyện tổng hợp" },
    {
      t: "mcq",
      id: "t3d1-np-tong-hop",
      title: "Chọn thì đúng (10 câu)",
      items: [
        { q: "I ___ in this flat since I started university.", options: ["live", "am living", "have been living", "lived"], correct: 2, why: "**since** + mốc, việc còn tiếp diễn → hiện tại hoàn thành (tiếp diễn). Hiện tại đơn / tiếp diễn không đi với since." },
        { q: "By the time the meeting started, I ___ all the documents.", options: ["had read", "have read", "read", "was reading"], correct: 0, why: "**By the time** + quá khứ đơn → việc đọc xong **trước** → had + V3." },
        { q: "In 2005, the unemployment rate ___ at 8%.", options: ["has stood", "had been standing", "stands", "stood"], correct: 3, why: "Một mốc quá khứ đã đóng (In 2005), chỉ một việc → quá khứ đơn." },
        { q: "She ___ four cups of coffee today — that's too many.", options: ["has been drinking", "has drunk", "drinks", "had drunk"], correct: 1, why: "Có **số lượng** (four cups) trong khoảng chưa đóng (today) → have + V3, không phải have been V-ing." },
        { q: "More and more companies ___ their staff to work remotely these days.", options: ["allowed", "had allowed", "are allowing", "allows"], correct: 2, why: "Xu hướng đang thay đổi (more and more … these days) → hiện tại tiếp diễn." },
        { q: "He was tired because he ___ all day.", options: ["had been driving", "has been driving", "is driving", "drives"], correct: 0, why: "Hoạt động kéo dài suốt tới mốc quá khứ (was tired) → had been + V-ing." },
        { q: "This building ___ to the city council.", options: ["is belonging", "has been belonging", "belong", "belongs"], correct: 3, why: "**belong** là động từ trạng thái → không tiếp diễn; chủ ngữ số ít → belongs." },
        { q: "When I was a child, we ___ a dog called Milo.", options: ["would have", "used to have", "have had", "had had"], correct: 1, why: "Trạng thái ngày xưa (có một con chó) → **used to**; would không dùng cho trạng thái; had had cần một mốc quá khứ khác." },
        { q: "The number of students ___ steadily over the past five years.", options: ["grew", "had grown", "has grown", "is growing"], correct: 2, why: "**over the past five years** = khoảng chưa đóng → hiện tại hoàn thành; chủ ngữ the number → has." },
        { q: "After they ___ the survey, they wrote a short report.", options: ["had completed", "have completed", "were completing", "complete"], correct: 0, why: "Hai việc quá khứ, làm khảo sát **xong trước** rồi mới viết báo cáo → had completed (completed cũng chấp nhận được, nhưng không có trong lựa chọn)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d1-np-sua-loi",
      title: "Mỗi câu có MỘT lỗi về thì — viết lại động từ đúng (8 câu)",
      kind: "fill",
      items: [
        { q: "I **am studying** English for five years. → I ___ English for five years.", answers: ["have been studying", "have studied", "'ve been studying", "'ve studied"] },
        { q: "The graph shows that sales **increase** sharply in 2015. → sales ___ sharply in 2015.", answers: ["increased"] },
        { q: "I **had visited** Hoi An last summer. → I ___ Hoi An last summer.", answers: ["visited"] },
        { q: "The number of tourists **have risen** since 2020. → The number of tourists ___ since 2020.", answers: ["has risen"] },
        { q: "When we got to the shop, it **already closed**. → it ___.", answers: ["had already closed", "had closed already"] },
        { q: "Many people **are believing** that money brings happiness. → Many people ___ that money brings happiness.", answers: ["believe"] },
        { q: "I **have been reading** this novel three times. → I ___ this novel three times.", answers: ["have read", "'ve read"] },
        { q: "She **didn't went** to university. → She ___ to university.", answers: ["didn't go", "did not go"] },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Đọc ─────────────────────────── */

const T3D1_READING: Lesson = {
  id: "t3d1-doc",
  kind: "reading",
  title: "Đọc: Chiến thuật band 6 — skim bố cục, đọc câu hỏi trước, paraphrase 4 mức",
  goal: "Làm một passage học thuật ~750 từ trong 20 phút theo đúng ba bước: skim 3 phút để vẽ “bản đồ bài”, đọc câu hỏi và gạch từ khoá trước khi đọc kỹ, rồi tìm đáp án bằng cách nhận ra paraphrase ở cả bốn mức (đồng nghĩa → đổi loại từ → đổi cấu trúc → ý ẩn) — kỹ năng quyết định Reading 23/40 = band 6.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Đích Reading của Tập 3: **23/40 = band 6.0**, làm **đủ 3 passage trong 60 phút**. Band 5 thường mất điểm không phải vì thiếu từ mà vì **hết giờ ở passage 3** và **không nhận ra paraphrase**.",
        "Bước 1 — **skim bố cục** (đọc lướt lấy ý chính) trong 2–3 phút: tiêu đề, câu đầu mỗi đoạn, từ báo hiệu → ghi 3–5 chữ cho mỗi đoạn thành một ==bản đồ bài==.",
        "Bước 2 — **đọc câu hỏi trước**, gạch từ khoá, đoán trước chúng sẽ bị **nói lại** thế nào trong bài.",
        "Bước 3 — nhận ra ==paraphrase 4 mức==: ① từ đồng nghĩa · ② đổi loại từ · ③ đổi cấu trúc câu · ④ ý ẩn (phải suy ra). Tập 2 Ngày 8 đã dạy ba cách đầu; hôm nay thêm mức ④ và luyện cả bốn trên một bài dài.",
        "Bài đọc hôm nay dùng nhiều thì của bài 1 (have been building · had started · had predicted) — đọc xong bạn sẽ thấy thì **giúp hiểu thứ tự sự việc** thế nào.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Reading band 6 khác band 5 ở đâu?" },
    {
      t: "table",
      caption: "Người đọc band 5 và band 6 — cùng một đề",
      head: ["", "Band 5 (15–18 câu đúng)", "Band 6 (23–26 câu đúng)"],
      rows: [
        ["**Thời gian**", "Đọc kỹ từ đầu đến cuối rồi mới xem câu hỏi; passage 3 chỉ còn 10 phút, phải đoán", "Chia **17 – 20 – 23 phút**; mỗi passage: 3 phút skim + đọc câu hỏi, phần còn lại tìm đáp án"],
        ["**Tìm vị trí**", "Dò từng chữ của câu hỏi trong bài; không thấy đúng chữ đó thì bí", "Nhớ **bản đồ bài** nên biết câu hỏi thuộc đoạn nào; tìm **ý**, không tìm chữ"],
        ["**Paraphrase**", "Nhận ra từ đồng nghĩa quen (big = large)", "Nhận ra cả **đổi loại từ** và **đổi cấu trúc**; bắt đầu suy được ý ẩn"],
        ["**Từ lạ**", "Dừng lại, hoảng, đọc lại cả đoạn", "Đoán từ ngữ cảnh rồi đi tiếp (Tập 2 Ngày 6); chỉ quay lại nếu câu hỏi cần đúng từ đó"],
        ["**Câu bỏ trống**", "Để trống câu không chắc", "**Không bỏ trống** câu nào — không bị trừ điểm khi sai"],
      ],
    },
    {
      t: "p",
      text: "Passage thật dài khoảng **700–950 từ**, mỗi passage 13–14 câu. Với 20 phút, bạn có khoảng **1 phút rưỡi cho mỗi câu** — tính cả thời gian đọc. Không ai đọc kỹ 900 từ rồi còn đủ giờ làm 13 câu. Vì vậy phải đọc **có mục đích**: lướt để biết bài nói gì ở đâu, rồi chỉ đọc kỹ chỗ câu hỏi cần.",
    },

    /* ── 2 ── */
    { t: "h", text: "2. Bước 1 — Skim bố cục trong 3 phút: vẽ “bản đồ bài”" },
    {
      t: "p",
      text: "**Skim** = đọc lướt để lấy **ý chính**, không lấy chi tiết. Bài học thuật viết theo khuôn: mỗi đoạn có **một ý**, và ý đó thường nằm ở **câu đầu** (câu chủ đề), đôi khi ở câu cuối. Vì thế chỉ cần đọc đúng chỗ là nắm được khung của cả bài.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Skim một passage 700–900 từ (2–3 phút)",
      caption: "Mục tiêu: sau 3 phút nói được “bài này nói về gì, theo trình tự nào”. Chưa cần hiểu chi tiết.",
      steps: [
        { label: "**Tiêu đề + dòng phụ đề**", sub: "Chủ đề là gì? Bài kể chuyện, giải thích hay tranh luận?" },
        { label: "**Trọn đoạn đầu**", sub: "Đoạn mở thường nêu vấn đề và hướng đi của cả bài." },
        { label: "**Câu đầu mỗi đoạn**", sub: "Ghi bên lề 3–5 chữ: đoạn này nói gì." },
        { label: "**Từ báo hiệu**", sub: "however · in contrast · as a result · for example · even so" },
        { label: "**Câu cuối bài**", sub: "Kết luận / thái độ của tác giả." },
      ],
    },
    {
      t: "table",
      caption: "Từ báo hiệu cho biết đoạn đang LÀM GÌ — nhìn thấy là đoán được hướng",
      head: ["Từ báo hiệu", "Đoạn đang…", "Câu hỏi hay rơi vào đây"],
      rows: [
        ["however · yet · even so · in contrast · on the other hand", "đổi hướng, nêu ý ngược lại", "TFNG / MCQ bẫy “đúng nửa đầu”"],
        ["because · since · as a result · therefore · this leads to", "nêu nguyên nhân – kết quả", "Sentence completion, Summary"],
        ["for example · for instance · in one case · such as", "đưa ví dụ, nghiên cứu cụ thể", "Câu hỏi có tên riêng, con số"],
        ["first · the second · finally · a further", "liệt kê các ý song song", "Matching, chọn TWO"],
        ["traditionally · in the past · until recently → now · today", "so sánh xưa – nay", "TFNG về thay đổi theo thời gian"],
        ["it is claimed · some argue · critics say", "nêu ý của NGƯỜI KHÁC, chưa chắc tác giả đồng ý", "Y/N/NG, MCQ về quan điểm"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi skim",
      items: [
        "**Đừng dịch.** Skim là để biết “đoạn B: hai hệ thống điều khiển giấc ngủ”, không phải hiểu từng câu. Gặp từ lạ thì bỏ qua.",
        "**Đừng skim quá 3 phút.** Nếu chưa xong thì chỉ đọc câu đầu của các đoạn còn lại rồi chuyển sang câu hỏi.",
        "Câu đầu đoạn đôi khi chỉ là câu **nối** (This shift is not limited to one culture) — vẫn dùng được: nó cho biết đoạn này mở rộng ý của đoạn trước.",
        "Bản máy tính: không viết được bên lề, nhưng có **Highlight** và **Notes** (bấm chuột phải). Tô câu đầu mỗi đoạn hoặc ghi chú 3 chữ — phòng thi máy của khoá cũng có hai nút này.",
      ],
    },
    {
      t: "rule",
      formula: "Skim = tiêu đề → đoạn đầu → câu đầu mỗi đoạn → từ báo hiệu → câu cuối (≤ 3 phút)",
      vi: "Kết quả là một bản đồ bài: mỗi đoạn 3–5 chữ. Có bản đồ thì mọi câu hỏi đều biết phải tìm ở đoạn nào.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Bước 2 — Đọc câu hỏi trước, gạch từ khoá" },
    {
      t: "p",
      text: "Sau khi skim, **đọc hết nhóm câu hỏi đầu tiên** trước khi đọc kỹ bài. Ôn từ Tập 1 Ngày 2: từ khoá là những chữ giúp bạn **định vị** (tìm đúng chỗ trong bài) và **kiểm tra** (đối chiếu nghĩa). Có hai loại, dùng khác nhau:",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai loại từ khoá",
      cols: [
        {
          title: "**Từ khoá “neo”** — KHÓ bị đổi → dùng để ĐỊNH VỊ",
          items: [
            "Tên riêng: người, nơi, tổ chức",
            "Con số, năm, tỉ lệ, đơn vị",
            "Thuật ngữ khoa học (melatonin, sleep debt)",
            "Chữ in nghiêng, trong ngoặc kép, viết hoa",
          ],
        },
        {
          title: "**Từ khoá “nghĩa”** — DỄ bị đổi → dùng để KIỂM TRA",
          items: [
            "Động từ chính và tân ngữ của câu hỏi",
            "Tính từ / trạng từ mức độ (only, most, always, rarely)",
            "Từ so sánh (more than, later than, as … as)",
            "Từ chỉ nguyên nhân – kết quả, phủ định",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Câu hỏi có đi theo thứ tự bài đọc không? — biết để khỏi tìm lung tung",
      head: ["Dạng câu hỏi", "Theo thứ tự bài?", "Cách tận dụng"],
      rows: [
        ["True / False / Not Given · Yes / No / Not Given", "**Có**", "Câu 2 nằm sau câu 1; không thấy câu 3 giữa chỗ của câu 2 và câu 4 → nghĩ tới NOT GIVEN"],
        ["Sentence completion · Short answer · MCQ một đáp án", "**Có** (gần như luôn)", "Tìm xong câu trước thì đọc tiếp từ đó"],
        ["Summary / Note / Table / Flow-chart completion", "Thường có, có thể gom trong 1–2 đoạn", "Dùng tiêu đề bảng tóm tắt để tìm đúng đoạn trước"],
        ["Matching headings · Matching information · Matching features", "**Không**", "Dựa vào bản đồ bài; làm nhóm này sau cùng nếu passage có nhiều nhóm câu"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: đoán trước từ thay thế",
      items: [
        "Khi gạch từ khoá “nghĩa”, tự hỏi 3 giây: **bài sẽ nói chữ này bằng chữ gì?** Ví dụ câu hỏi có **get better** → bài có thể viết improve, rise, recover; có **young people** → teenagers, adolescents, the young, those aged 14–17.",
        "Bạn không cần đoán trúng. Việc đoán làm mắt bạn **mở rộng vùng tìm**, không còn dán vào đúng một chữ.",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Bước 3 — Paraphrase 4 mức: đề “nói lại” bài đọc thế nào" },
    {
      t: "p",
      text: "**Paraphrase** = nói lại cùng một ý bằng lời khác. Người ra đề **không bao giờ** chép nguyên câu trong bài vào câu hỏi — họ nói lại nó. Câu càng khó thì mức nói lại càng xa. Tập 2 Ngày 8 đã dạy ba cách; ở band 6 bạn cần nhận ra thêm mức thứ tư.",
    },
    {
      t: "table",
      caption: "Bốn mức paraphrase — từ dễ đến khó",
      head: ["Mức", "Đề làm gì", "Trong bài", "Trong câu hỏi"],
      rows: [
        ["**① Đồng nghĩa**", "Thay từ bằng từ / cụm cùng nghĩa", "young children find it **harder** to **concentrate** in the afternoon", "younger pupils have **more difficulty** **focusing** after lunch"],
        ["**② Đổi loại từ**", "Động từ ↔ danh từ ↔ tính từ", "the bridge was **completed** in 1932", "the **completion** of the bridge in 1932"],
        ["**③ Đổi cấu trúc**", "Chủ động ↔ bị động · khẳng định ↔ phủ định + trái nghĩa · đảo nguyên nhân – kết quả", "Rising sea levels **forced** the villagers **to move** inland.", "The village **was relocated** inland **because of** rising sea levels."],
        ["**④ Ý ẩn**", "Không có câu nào nói thẳng — phải **cộng hai thông tin** hoặc **suy ra**", "…the shop opens at nine… the first bus from the village arrives at half past nine…", "Villagers who rely on the bus **cannot be there when the shop opens**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi gặp paraphrase",
      items: [
        "Thấy **đúng chữ** của câu hỏi trong bài là chọn ngay. Chữ giống hệt thường là **bẫy**: bài dùng chữ đó cho một ý khác hoặc để phủ định.",
        "Mức ③ với **phủ định + trái nghĩa**: bài viết **not uncommon** = common; **failed to improve** = stayed the same or got worse. Đọc sót chữ not là đổi TRUE thành FALSE.",
        "Mức ④: suy ra **quá xa**. Chỉ suy điều bài **bắt buộc** dẫn tới (xe buýt đầu tiên tới lúc 9 giờ 30 mà cửa hàng mở lúc 9 giờ → không kịp giờ mở cửa), không thêm hiểu biết riêng của bạn. Ý “nghe hợp lý” mà bài không nói thì là NOT GIVEN.",
      ],
    },
    {
      t: "rule",
      formula: "① đồng nghĩa → ② đổi loại từ → ③ đổi cấu trúc → ④ ý ẩn (cộng thông tin / suy ra)",
      vi: "Tìm Ý, không tìm chữ. Mỗi câu làm xong, tự gọi tên mức paraphrase — đó là cách luyện mắt nhanh nhất.",
    },
    {
      t: "mcq",
      id: "t3d1-doc-muc-para",
      title: "Câu hỏi nói lại câu trong bài ở MỨC nào? (8 câu · ngữ liệu riêng)",
      items: [
        { q: "Bài: “The museum **attracts** two million **visitors** a year.” — Câu hỏi: “Two million **people come to** the museum annually.”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 0, why: "attracts visitors = people come to; a year = annually. Chỉ thay từ cùng nghĩa, khung câu giữ nguyên → mức ①." },
        { q: "Bài: “The city **grew rapidly** in the 1950s.” — Câu hỏi: “the **rapid growth** of the city in the 1950s”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 1, why: "Động từ + trạng từ (grew rapidly) → tính từ + danh từ (rapid growth). Cùng gốc từ, đổi loại từ → mức ②." },
        { q: "Bài: “Farmers **abandoned** the valley **because** the river **dried up**.” — Câu hỏi: “The **drying up** of the river **led to** the valley **being abandoned**.”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 2, why: "Đảo thứ tự kết quả – nguyên nhân (because → led to) và đổi chủ động thành bị động. Khung câu đổi hẳn → mức ③ (có kèm ② ở dried up → drying up)." },
        { q: "Bài: “The first shop opened in 1990; ten years later there were forty.” — Câu hỏi: “By 2000 the company had **dozens of** shops.”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 3, why: "Bài không viết “2000” hay “dozens”: phải tự cộng 1990 + 10 = 2000 và hiểu forty = dozens of → mức ④." },
        { q: "Bài: “The new drug was **not ineffective**.” — Câu hỏi: “The new drug **worked**.”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 2, why: "Phủ định kép (not + in-effective) được đổi thành câu khẳng định → đổi cấu trúc, mức ③." },
        { q: "Bài: “Researchers **analysed** the data.” — Câu hỏi: “an **analysis** of the data **by** researchers”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 1, why: "analysed (v) → analysis (n): cùng họ từ, đổi loại từ → mức ②." },
        { q: "Bài: “Most of the workers were **under twenty-five**.” — Câu hỏi: “The workforce was mainly **young**.”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 0, why: "most of the workers = the workforce … mainly; under twenty-five = young. Thay cụm cùng nghĩa → mức ① (cụm, không phải từ đơn)." },
        { q: "Bài: “She had never left her village before she won the scholarship.” — Câu hỏi: “The scholarship gave her **her first experience of** life elsewhere.”", options: ["① Đồng nghĩa", "② Đổi loại từ", "③ Đổi cấu trúc", "④ Ý ẩn"], correct: 3, why: "Bài không nói “first experience”: phải suy từ “had never left … before” (quá khứ hoàn thành — việc trước đó) → mức ④." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Bài đọc luyện tập — 20 phút, Questions 1–13" },
    {
      t: "note",
      title: "Cách làm (bấm giờ 20 phút)",
      items: [
        "**Phút 0–3:** skim theo sơ đồ ở mục 2. Chưa đọc câu hỏi. Làm ngay bài “Bản đồ bài” bên dưới để kiểm tra bạn skim có đúng không.",
        "**Phút 3–5:** đọc Questions 1–5, gạch từ khoá neo và từ khoá nghĩa.",
        "**Phút 5–18:** làm lần lượt 3 nhóm câu hỏi. Mỗi câu: tìm đoạn (theo bản đồ) → đọc kỹ 2–3 câu quanh đó → đối chiếu nghĩa.",
        "**Phút 18–20:** soát chính tả, giới hạn số từ, điền nốt câu trống.",
      ],
    },
    {
      t: "passage",
      title: "Out of Sync: Why Teenagers Sleep Late",
      intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
      paras: [
        { label: "A", text: "For generations, parents and teachers have complained that teenagers stay up too late and are impossible to wake in the morning. The usual explanation has been a moral one: young people are lazy, or they lack discipline, or they spend too many hours looking at screens. Over the past thirty years, however, sleep researchers have been building a different picture. The evidence now suggests that the late nights of adolescence are driven largely by biology, and that the timetable of the average secondary school is working against it." },
        { label: "B", text: "Human sleep is governed by two separate systems. The first is the body clock, an internal rhythm of roughly twenty-four hours that tells us when to feel alert and when to feel drowsy. The second is known as sleep pressure: the longer a person has been awake, the stronger the need to sleep becomes. In young children and in most adults, these two systems are well matched to the normal day. During puberty, though, both of them change. The body clock shifts later, so that melatonin, the hormone that prepares the body for sleep, is released up to two hours later in the evening than it was in childhood. At the same time, sleep pressure builds more slowly, which makes it easier for a teenager to stay awake long after the rest of the household has gone to bed." },
        { label: "C", text: "This shift is not limited to one culture. Similar patterns have been recorded among adolescents on several continents, in rural communities as well as in large cities. Nor does it appear to be limited to humans: researchers have observed a comparable delay in several other mammals as they reach sexual maturity. Findings of this kind make it difficult to argue that modern technology is the root of the problem. Bright screens may well make a late bedtime later still, but they did not create it." },
        { label: "D", text: "What has not changed is the amount of sleep that a growing body requires. Most specialists recommend between eight and ten hours a night for those aged fourteen to seventeen. A teenager who cannot fall asleep before eleven o'clock, and who has to get up at six thirty to catch a school bus, will manage seven and a half hours at best. Repeated over a school week, the loss adds up to what researchers call sleep debt. Many young people try to repay it by sleeping until noon at the weekend, but this only pushes the body clock later still and makes Monday morning even harder." },
        { label: "E", text: "The consequences go well beyond yawning in class. Memory is consolidated during sleep, so material that was learned during the day is less likely to be retained if the night is cut short. Sleep-deprived adolescents also find it harder to control their emotions, and they are more likely to report low mood. Many of them come to depend on coffee or energy drinks simply to get through the morning, which in turn makes it harder to fall asleep the following night. Perhaps the most alarming findings concern road safety. In places where teenagers are allowed to drive, studies have linked early school start times to a higher rate of crashes among young drivers, most of them in the early morning." },
        { label: "F", text: "If the timetable is the problem, the obvious solution is to change it, and a number of school districts have tried. In one widely reported case, a city that had started lessons at ten to eight moved the first bell to a quarter to nine. Researchers who had measured the students' sleep before the change repeated the exercise a year later. They found that students were not simply going to bed later, as critics had predicted. Instead, they were sleeping for about half an hour longer each night. Attendance improved, lateness fell, and grades in a science class that the researchers followed rose slightly." },
        { label: "G", text: "Even so, most schools have kept their early start. The reasons are practical rather than scientific. Buses are often shared between primary and secondary schools, and running them later costs money. Sports teams and after-school jobs depend on an early finish. Working parents may be unable to leave for the office until their children have gone. None of these obstacles is impossible to overcome, but each of them requires someone to pay or to compromise. Until that happens, millions of teenagers will go on being asked to learn at a time when their bodies are still, in effect, asleep." },
      ],
    },
    {
      t: "mcq",
      id: "t3d1-doc-ban-do",
      title: "Bản đồ bài — sau 3 phút skim, đoạn nào nói về điều gì? (5 câu, không tính vào 13 câu)",
      items: [
        { q: "Đoạn nào giải thích **cơ chế sinh học** làm thiếu niên buồn ngủ muộn?", options: ["A", "B", "D", "F"], correct: 1, why: "Câu đầu đoạn B: “Human sleep is governed by two separate systems.” — báo trước một đoạn giải thích cơ chế (body clock, sleep pressure)." },
        { q: "Đoạn nào kể **một thử nghiệm đổi giờ học** và kết quả?", options: ["C", "E", "F", "G"], correct: 2, why: "Câu đầu đoạn F: “…the obvious solution is to change it, and a number of school districts have tried.” + “In one widely reported case” = ví dụ cụ thể." },
        { q: "Đoạn nào nói về **hậu quả** của thiếu ngủ?", options: ["E", "B", "C", "G"], correct: 0, why: "Câu đầu đoạn E: “The consequences go well beyond yawning in class.” — chữ consequences nói thẳng chức năng của đoạn." },
        { q: "Đoạn nào giải thích **vì sao phần lớn trường vẫn chưa đổi**?", options: ["A", "D", "F", "G"], correct: 3, why: "Đoạn G mở bằng **Even so** (dù vậy) + “most schools have kept their early start. The reasons are practical…” — từ báo hiệu đổi hướng." },
        { q: "Đoạn nào cho thấy hiện tượng này **không phải do công nghệ**?", options: ["B", "C", "D", "E"], correct: 1, why: "Đoạn C: “This shift is not limited to one culture… Nor … to humans” → kết: khó nói công nghệ là gốc rễ. Câu đầu chỉ là câu nối, phải lướt thêm câu gần cuối." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–5.** Do the following statements agree with the information given in the reading passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, or **NOT GIVEN** if there is no information on this.",
    },
    {
      t: "mcq",
      id: "t3d1-doc-tfng",
      title: "Questions 1–5 — True / False / Not Given",
      items: [
        { q: "(1) Adults have only recently begun to complain about the sleeping habits of teenagers.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn A: “**For generations**, parents and teachers have complained…” — đã nhiều thế hệ nay, trái với **only recently** → FALSE. Paraphrase: parents and teachers = adults (①); for generations ↔ only recently là hai ý **trái nghĩa** (③). Thì hiện tại hoàn thành (have complained) cũng báo việc kéo dài từ lâu tới nay." },
        { q: "(2) During puberty, melatonin starts to be produced later in the evening than before.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: “melatonin… **is released up to two hours later in the evening than it was in childhood**.” released = produced (①); than it was in childhood = than before (①) → TRUE." },
        { q: "(3) Teenagers in rural communities get more sleep than those who live in large cities.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ nói kiểu ngủ muộn được ghi nhận “in rural communities **as well as** in large cities” — không **so sánh** ai ngủ nhiều hơn → NOT GIVEN. Bẫy: có đúng hai chữ rural / cities nhưng không có ý so sánh." },
        { q: "(4) The delay in sleep timing at adolescence has been found only in human beings.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn C: “**Nor does it appear to be limited to humans**: researchers have observed a comparable delay in several other mammals.” Not limited to humans ↔ only in human beings → FALSE (mức ③: phủ định + đảo ngữ với Nor)." },
        { q: "(5) Trying to catch up on sleep at the weekend can make the start of the school week more difficult.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn D: “Many young people try to repay it by **sleeping until noon at the weekend**, but this only pushes the body clock later still and **makes Monday morning even harder**.” repay sleep debt = catch up on sleep (①); Monday morning even harder = the start of the school week more difficult (①) → TRUE. Chữ **try to … but this only** báo cố gắng phản tác dụng." },
      ],
    },
    {
      t: "p",
      text: "**Questions 6–9.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer.",
    },
    {
      t: "quiz",
      id: "t3d1-doc-cau",
      title: "Questions 6–9 — Sentence completion (NO MORE THAN TWO WORDS)",
      kind: "fill",
      items: [
        { q: "(6) The need for sleep that grows stronger the longer a person stays awake is called ______.", answers: ["sleep pressure"] },
        { q: "(7) If teenagers do not sleep long enough, what they studied in the daytime may not be ______.", answers: ["retained"] },
        { q: "(8) Research has connected early lessons with a greater number of ______ involving young drivers.", answers: ["crashes"] },
        { q: "(9) After one city changed its school timetable, ______ (how regularly students were present at school) improved, and so did punctuality.", answers: ["attendance"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 10–13.** Choose the correct letter, **A, B, C or D**.",
    },
    {
      t: "mcq",
      id: "t3d1-doc-chon",
      title: "Questions 10–13 — Multiple choice",
      items: [
        {
          q: "(10) What is the writer's main point in paragraph C?",
          options: ["A Teenagers in some cultures sleep much later than others.", "B Animals need more sleep than human beings do.", "C Technology cannot be the basic cause of late teenage sleep.", "D Bright screens have no effect on the time teenagers go to bed."],
          correct: 2,
          why: "Đoạn C: “Findings of this kind make it **difficult to argue that modern technology is the root of the problem**.” root = basic cause (①). A sai: bài nói hiện tượng **giống nhau** ở nhiều nơi. B không có. D sai — bẫy “đúng một nửa”: màn hình **có** làm muộn thêm (“may well make a late bedtime later still”), chỉ là không **gây ra**.",
        },
        {
          q: "(11) According to paragraph D, a teenager who falls asleep at eleven and gets up at six thirty",
          options: ["A sleeps for less time than specialists recommend.", "B has built up a sleep debt by Monday morning.", "C needs less sleep than a younger child does.", "D sleeps for as long as most adults do."],
          correct: 0,
          why: "Mức ④ — cộng hai thông tin: khuyến nghị “between **eight and ten hours**”; em này “will manage **seven and a half hours at best**” → ít hơn mức khuyến nghị → A. B: nợ ngủ tích **trong tuần học**, không phải “by Monday”. C, D: bài không so sánh với trẻ nhỏ hay người lớn.",
        },
        {
          q: "(12) What had critics of the later start time expected to happen?",
          options: ["A Students would arrive late more often.", "B Students would get lower grades in science.", "C Students would sleep longer at the weekend.", "D Students would go to bed later than before."],
          correct: 3,
          why: "Đoạn F: “students were **not simply going to bed later, as critics had predicted**.” had predicted = had expected (①); quá khứ hoàn thành cho biết lời dự đoán có **trước** kết quả. A, B là điều **ngược** với kết quả thật (lateness fell, grades rose) nhưng không phải điều người phản đối dự đoán.",
        },
        {
          q: "(13) Most schools have not changed their start times because",
          options: ["A they do not believe the scientific evidence.", "B the change would cause practical difficulties and extra costs.", "C parents think teenagers should learn discipline.", "D sports teams refuse to train in the evening."],
          correct: 1,
          why: "Đoạn G: “The reasons are **practical rather than scientific**… running them later **costs money**… requires someone to pay or to compromise.” → B. A sai: “rather than scientific” = lý do **không** nằm ở khoa học. C lấy chữ discipline ở đoạn A cho một ý khác. D: bài chỉ nói đội thể thao “depend on an early finish”, không nói họ từ chối.",
        },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Giải thích đáp án 6–9 và bảng paraphrase của cả bài" },
    {
      t: "table",
      caption: "Questions 6–9 — câu chứa đáp án và kiểu paraphrase",
      head: ["Câu", "Đáp án", "Câu trong bài", "Paraphrase"],
      rows: [
        ["6", "**sleep pressure**", "B: “The second is known as **sleep pressure**: the longer a person has been awake, the stronger the need to sleep becomes.”", "is called = is known as (①); câu hỏi đảo thứ tự: định nghĩa trước, tên sau (③)"],
        ["7", "**retained**", "E: “material that was learned during the day is less likely to be **retained** if the night is cut short.”", "what they studied in the daytime = material learned during the day (①); do not sleep long enough = the night is cut short (①); may not be = is less likely to be (①)"],
        ["8", "**crashes**", "E: “studies have **linked** early school start times **to a higher rate of crashes** among young drivers”", "connected … with = linked … to (①); a greater number of = a higher rate of (①); early lessons = early school start times (①)"],
        ["9", "**attendance**", "F: “**Attendance improved, lateness fell**”", "how regularly students were present = attendance (① — định nghĩa thay cho từ); improved = improved; **punctuality** (sự đúng giờ) improved = **lateness fell** (③ — trái nghĩa + đổi chiều động từ). Biết punctuality ↔ lateness giúp định vị đúng câu."],
      ],
    },
    {
      t: "note",
      title: "Lỗi hay gặp ở Questions 6–9",
      items: [
        "Câu 6 điền **body clock**: cũng là thuật ngữ ở đoạn B, nhưng định nghĩa “the longer… awake, the stronger the need” chỉ khớp sleep pressure. Đọc **hết câu định nghĩa**, đừng thấy thuật ngữ đầu tiên là điền.",
        "Câu 7 điền **learned** hoặc **consolidated**: learned là việc ban ngày, không phải điều “may not be…”; consolidated nằm ở câu trước và chủ ngữ là memory. Đối chiếu **chủ ngữ** của chỗ trống.",
        "Câu 8 điền **crash** (số ít): sau “a greater number of” phải là danh từ **số nhiều**, và bài viết crashes. Chép sai số ít / số nhiều là mất điểm.",
        "Câu 9 điền **grades**: grades cũng tăng (chỉ “slightly”, ở **một** lớp), nhưng ngoặc đơn của câu hỏi định nghĩa chỗ trống là “mức đi học đều” = attendance. Đọc **hết** câu hỏi, kể cả phần trong ngoặc, trước khi điền.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "13 câu vừa làm dùng mức paraphrase nào?",
      caption: "Phần lớn điểm band 5 nằm ở mức ①. Lên band 6 là ăn thêm các câu mức ③ và ④.",
      center: "Paraphrase trong bài “Out of Sync”",
      branches: [
        { label: "**① Đồng nghĩa**", items: ["Q2 released → produced", "Q5 Monday morning harder → start of the week more difficult", "Q7 cut short → not long enough", "Q8 linked to → connected with", "Q10 root → basic cause", "Q12 predicted → expected"] },
        { label: "**② Đổi loại từ**", items: ["Q13 costs money (v) → extra costs (n)"] },
        { label: "**③ Đổi cấu trúc**", items: ["Q1 for generations ↔ only recently (trái nghĩa)", "Q4 Nor … limited to humans ↔ only in humans", "Q6 đảo định nghĩa – tên gọi", "Q9 lateness fell ↔ punctuality improved"] },
        { label: "**④ Ý ẩn**", items: ["Q11 7,5 tiếng < 8–10 tiếng (cộng hai thông tin)"] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Sau khi chấm — sổ paraphrase và nhịp thời gian" },
    {
      t: "p",
      text: "Làm xong một bài đọc mà chỉ xem điểm thì chưa học được gì. Ôn từ Tập 2 Ngày 8 và Ngày 24: mỗi bài lập một **sổ paraphrase** — mỗi dòng là một cặp “câu hỏi nói A ↔ bài nói B”. Sau 20 bài, bạn sẽ có vài trăm cặp, và đề thật lặp lại chúng nhiều hơn bạn nghĩ.",
    },
    {
      t: "table",
      caption: "Mẫu sổ paraphrase — chép vào vở hoặc bảng tính, thêm cột Mức",
      head: ["Câu hỏi viết", "Bài viết", "Mức", "Ghi chú"],
      rows: [
        ["get better", "improve · rise", "①", "nhóm “tăng / tốt lên”"],
        ["punctuality got better", "lateness fell", "③", "trái nghĩa + đổi chiều"],
        ["only in human beings", "nor … limited to humans", "③", "Nor + đảo ngữ = cũng không"],
        ["less than specialists recommend", "8–10 hours ↔ 7.5 hours at best", "④", "phải tự so hai con số"],
        ["the basic cause", "the root of the problem", "①", "root = gốc rễ"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: nhịp 20 phút cho một passage",
      items: [
        "**3 – 2 – 13 – 2**: skim 3 phút · đọc câu hỏi 2 phút · tìm đáp án 13 phút · soát 2 phút. Lần đầu bạn sẽ quá giờ — cứ ghi lại mất bao nhiêu phút, tuần sau làm lại.",
        "Một câu **quá 2 phút** chưa ra: chọn đáp án hợp lý nhất, đánh dấu (nút Review trên bản máy), đi tiếp. Câu sau thường dễ hơn và nằm ngay đoạn kế.",
        "Sai câu nào thì ghi vào **Sổ lỗi** kèm lý do: sai vì **không tìm ra chỗ** (lỗi bản đồ), **không nhận ra paraphrase** (ghi mức), hay **đọc sót chữ** (not, only, most)? Ba loại lỗi có ba cách chữa khác nhau.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nghe ─────────────────────────── */

const T3D1_LISTENING: Lesson = {
  id: "t3d1-nghe",
  kind: "listening",
  title: "Nghe: Part 1 giọng trộn Anh – Mỹ – Úc — 10/10 câu và 2 phút kiểm",
  goal: "Làm trọn một bài Listening Part 1 (Form completion, 10 câu) khi hai người nói hai giọng khác nhau (Úc – Mỹ), nhận ra các khác biệt Anh / Mỹ / Úc ảnh hưởng tới số, ngày tháng và nguyên âm, dùng 2 phút kiểm cuối bài để không mất điểm vì chính tả, số ít – số nhiều và giới hạn từ — mục tiêu Part 1 đúng 9–10/10, nền của Listening 23/40.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Listening band 6 = **23/40**. Part 3 và Part 4 khó, nên bạn phải **ăn trọn Part 1**: mục tiêu ==9–10/10==. Mỗi câu Part 1 rơi là một câu Part 4 phải bù.",
        "Đề thật **trộn giọng**: Anh (UK), Mỹ (US), Úc (AU), đôi khi Canada, New Zealand. Hôm nay nghe **Úc + Mỹ** trong cùng một hội thoại — ôn giọng Úc từ Tập 2 Ngày 15.",
        "Ba chỗ giọng làm bạn nghe sai: **nguyên âm** (today của người Úc nghe gần “to-die”), **âm t của người Mỹ** (thirty nghe như “thirdy”), và **cách đọc số, ngày tháng** (double five · March fifth).",
        "Ôn bốn kiểu bẫy Part 1 của Tập 2 Ngày 1 (đổi ý / sửa lời, hai lựa chọn một bị loại, hai mốc gần nhau, giá gốc / giá giảm) và thêm hai kiểu (đánh vần bị đoán sai, nhiều món chỉ một món được chọn) — ở Tập 3 bẫy đến **nhanh hơn** và lời đúng thường được **nói lại bằng chữ khác**.",
        "**2 phút kiểm** cuối bài (bản máy): soát chính tả, số ít – số nhiều, giới hạn từ, đơn vị — ôn từ Tập 2 Ngày 19 và nâng thành bảng 6 dòng.",
        "🔊 Cuối bài: **tự chẩn 44 âm** bằng máy chấm và luyện bốn cặp âm người Việt hay lẫn: /s/–/ʃ/ · /tʃ/–/dʒ/ · /v/–/w/–/f/ · /r/–/l/.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Vì sao Part 1 phải đúng 9–10 câu?" },
    {
      t: "table",
      caption: "Một cách đạt 23/40 — và vì sao Part 1 là chỗ “gửi tiền”",
      head: ["Part", "Nội dung", "Mục tiêu band 6", "Ghi chú"],
      rows: [
        ["**Part 1**", "Hội thoại giao dịch 2 người (đặt chỗ, đăng ký, hỏi thông tin)", "**9–10 / 10**", "Dễ nhất; đáp án là tên, số, ngày, một hai từ"],
        ["**Part 2**", "Một người nói về nơi chốn / dịch vụ", "6–7 / 10", "MCQ, bản đồ — học ở Ngày 4"],
        ["**Part 3**", "2–3 người thảo luận học thuật", "4–5 / 10", "Khó vì nhiều người, nhiều ý kiến — Ngày 8"],
        ["**Part 4**", "Bài giảng một người", "4–5 / 10", "Dài, không ngắt — Ngày 13"],
      ],
    },
    {
      t: "p",
      text: "Cộng lại: 9 + 6 + 4 + 4 = **23**. Nếu Part 1 chỉ được 6, bạn phải gỡ thêm 3 câu ở Part 3–4 — khó hơn nhiều. Người thi band 5 thường mất 3–4 câu Part 1 vì ba lý do **không liên quan tới trình độ nghe**: chép sai chính tả, quên -s, và viết con số đầu tiên nghe được trước khi người nói đổi ý.",
    },

    /* ── 2 ── */
    { t: "h", text: "2. Ba giọng Anh – Mỹ – Úc: khác nhau ở đâu khi NGHE?" },
    {
      t: "p",
      text: "Bạn không cần nói được ba giọng, chỉ cần **không bị giật mình** khi nghe. Khác biệt gom lại ở bốn nhóm dưới đây. Giọng Úc đã nhập ở **Tập 2 Ngày 15 và 19**; bảng này đặt ba giọng cạnh nhau.",
    },
    {
      t: "table",
      caption: "Khác biệt nghe được giữa ba giọng",
      head: ["Hiện tượng", "Anh (UK)", "Mỹ (US)", "Úc (AU)"],
      rows: [
        ["Chữ **r** sau nguyên âm (car, there, fourteen)", "Không đọc r: /kɑː/", "**Đọc rõ r**: /kɑːr/", "Không đọc r, giống Anh"],
        ["Chữ **a** trong class, can't, dance, half, after", "/ɑː/ dài: /klɑːs/", "/æ/: /klæs/ — can't nghe gần **can**", "/ɑː/ như Anh (dance có thể là /æ/)"],
        ["Chữ **t** giữa hai nguyên âm (water, city, thirty, forty)", "/t/ rõ", "Thành âm vỗ gần /d/: “wader”, “thirdy”; **twenty → “twenny”**", "Thường cũng mềm như Mỹ"],
        ["Nguyên âm đôi **/eɪ/** (today, eight, name, pay)", "/eɪ/", "/eɪ/", "Mở rộng, nghe gần **/aɪ/**: today ≈ “to-die”, eight ≈ “ight”"],
        ["Chữ **o** trong hot, not, dollar, job", "/ɒ/ tròn môi", "/ɑː/ không tròn môi: “haht”, “dah-lar”", "/ɒ/ như Anh"],
        ["Ngữ điệu câu kể", "Xuống cuối câu", "Xuống cuối câu", "Hay **lên giọng** cuối câu kể — nghe như đang hỏi"],
      ],
    },
    {
      t: "table",
      caption: "Số, ngày tháng và từ vựng — chỗ dễ mất điểm Part 1 nhất",
      head: ["Nội dung", "Anh / Úc", "Mỹ"],
      rows: [
        ["Hai chữ số giống nhau liền kề", "**double five** (55) · **triple / treble two** (222)", "five five · two two two"],
        ["Số 0 trong số điện thoại", "**oh** (0417 = oh four one seven)", "**zero** hoặc oh"],
        ["Ngày tháng (nói)", "**the fifth of March**", "**March fifth** — không có the … of"],
        ["Ngày tháng (viết số)", "5/3 = ngày 5 tháng 3", "3/5 = ngày 5 tháng 3 (tháng trước)"],
        ["Số có hàng trăm", "a hundred **and** fifty", "a hundred fifty (hay bỏ and)"],
        ["Từ vựng giao dịch", "postcode · surname · flat · mobile · city centre · car park · holiday · fortnight (2 tuần)", "zip code · last name · apartment · cell phone · downtown · parking lot · vacation · two weeks"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi nghe giọng trộn",
      items: [
        "Nghe người Mỹ nói **thirty** thành **thirteen** (hoặc ngược lại) vì âm t bị mềm. Nghe **trọng âm**: thir-**TEEN** nhấn cuối, **THIR**-ty nhấn đầu — học kỹ ở Ngày 5.",
        "Nghe người Mỹ nói **can't** /kænt/ thành **can**. Dựa vào **ngữ cảnh** và trọng âm: can't luôn được nhấn, can thường yếu /kən/.",
        "Nghe người Úc nói **eight / eighteen** thành “ight / ighteen” và không nhận ra. Gặp giọng Úc, hễ nghe /aɪ/ ở chỗ lẽ ra là số thì nghĩ tới **8**.",
        "Viết ngày kiểu Mỹ rồi tự làm mình lẫn: trong IELTS cứ viết **14 March** hoặc **March 14** — cả hai đều được chấm đúng; đừng viết 14/3 hay 3/14.",
      ],
    },
    {
      t: "listen",
      id: "t3d1-nghe-ba-giong",
      title: "Six short extracts — three accents",
      dan: { so: "Day 1, Recording 1", boiCanh: "six short extracts in which different speakers give a number, a date or a name.", cau: [1, 6] },
      note: "Sáu câu ngắn, mỗi câu một người: Anh – Mỹ – Úc xen kẽ. Nghe một lần, viết đáp án, rồi mới mở lời thoại.",
      lines: [
        { who: "Speaker 1", voice: "uk-nu", text: "Your booking reference is double seven, oh, four, nine, treble two. I'll say that again: double seven, oh, four, nine, treble two.", vi: "Mã đặt chỗ của anh là hai số bảy, không, bốn, chín, ba số hai. Tôi nhắc lại: 77049222." },
        { who: "Speaker 2", voice: "us-nam", text: "The workshop is on March fifth. That's a Thursday, and we start at two thirty in the afternoon.", vi: "Buổi workshop vào ngày 5 tháng 3. Hôm đó là thứ Năm, và chúng ta bắt đầu lúc hai rưỡi chiều." },
        { who: "Speaker 3", voice: "au-nu", text: "The total comes to eighty-eight dollars. You can pay today, or when you come in on Friday.", vi: "Tổng cộng là tám mươi tám đô. Chị có thể trả hôm nay, hoặc khi chị tới vào thứ Sáu." },
        { who: "Speaker 4", voice: "us-nu", text: "I live at thirty forty Water Street, apartment twenty. That's three, zero, four, zero.", vi: "Tôi sống ở số 3040 phố Water, căn hộ 20. Tức là ba, không, bốn, không." },
        { who: "Speaker 5", voice: "uk-nam", text: "The surname's Featherstone. That's F-E-A-T-H-E-R, S-T-O-N-E, all one word.", vi: "Họ là Featherstone. Đánh vần là F-E-A-T-H-E-R, S-T-O-N-E, viết liền một chữ." },
        { who: "Speaker 6", voice: "au-nam", text: "The class starts at a quarter to eight, not eight o'clock, so please be there by seven forty.", vi: "Lớp bắt đầu lúc tám giờ kém mười lăm, không phải tám giờ, nên hãy có mặt trước bảy giờ bốn mươi." },
      ],
    },
    {
      t: "quiz",
      id: "t3d1-nghe-ba-giong-dien",
      title: "Questions 1–6 — viết số, ngày hoặc tên bạn nghe được",
      kind: "fill",
      items: [
        { q: "(1) Booking reference: ______", answers: ["77049222", "7704 9222", "77 04 9 222", "770 49 222"] },
        { q: "(2) Date of the workshop: ______", answers: ["5 March", "March 5", "5th March", "March 5th", "5th of March", "the 5th of March", "fifth of March", "March fifth"] },
        { q: "(3) Total to pay: $ ______", answers: ["88", "eighty-eight", "eighty eight"] },
        { q: "(4) House number in Water Street: ______", answers: ["3040"] },
        { q: "(5) Surname: ______", answers: ["Featherstone"] },
        { q: "(6) The class starts at: ______", answers: ["7.45", "7:45", "7.45 pm", "7.45 am", "7:45 pm", "7:45 am", "quarter to eight", "a quarter to eight", "7h45"] },
      ],
    },
    {
      t: "table",
      caption: "Giải thích 1–6 — giọng nào, bẫy gì",
      head: ["Câu", "Giọng", "Chỗ cần để ý"],
      rows: [
        ["1", "Anh", "**double seven** = 77 · **oh** = 0 · **treble two** = 222. Viết 7 0 4 9 2 là sót năm chữ số."],
        ["2", "Mỹ", "**March fifth** — tháng trước, không có “the … of”. Thursday và two thirty là thông tin thừa."],
        ["3", "Úc", "**eighty-eight** và **today** đều có /eɪ/ mở rộng. Đề đã in $ — chỉ viết 88."],
        ["4", "Mỹ", "**thirty forty** = 3040; âm t mềm nên nghe như “thirdy fordy”. Người nói nhắc lại từng chữ số: three, zero, four, zero. **twenty** (20) là số căn hộ — thông tin thừa."],
        ["5", "Anh", "Đánh vần 12 chữ cái, ngắt giữa FEATHER và STONE nhưng “all one word” → viết liền."],
        ["6", "Úc", "**a quarter to eight** = 7.45. Hai con số khác (eight o'clock, seven forty) là bẫy: một cái bị phủ định, một cái là giờ nên có mặt."],
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Quy trình Part 1 ở band 6 — và các kiểu bẫy đến nhanh hơn" },
    {
      t: "sodo",
      kind: "flow",
      title: "Trước – trong – sau khi nghe Part 1",
      caption: "Băng cho khoảng 30 giây đọc Questions 1–10 trước khi phát (có đề ngắt đôi 1–5 / 6–10).",
      steps: [
        { label: "**Đọc giới hạn từ**", sub: "ONE WORD AND/OR A NUMBER? TWO WORDS?" },
        { label: "**Đoán loại đáp án**", sub: "tên · số · ngày · giá · danh từ số ít / số nhiều" },
        { label: "**Nghe theo nhãn dòng**", sub: "nhãn form (Pick-up date…) báo trước ý sắp tới" },
        { label: "**Chờ lời chốt**", sub: "con số cuối cùng được XÁC NHẬN mới là đáp án" },
        { label: "**Lỡ một câu → bỏ**", sub: "nhìn ngay câu kế; đoán sau ở 2 phút kiểm" },
      ],
    },
    {
      t: "table",
      caption: "Bốn kiểu bẫy của Tập 2 Ngày 1 — bản band 6, cộng hai kiểu mới",
      head: ["Bẫy", "Bản Tập 2 (band 5)", "Bản Tập 3 (band 6) — phải nhận ra"],
      rows: [
        ["**Đổi ý / sửa lời**", "“My home number is… **Actually**, it's better to use my mobile”", "Không có chữ actually / no / sorry: “we're **fully booked** on the ninth… the earliest I **can do** is the eleventh” — lời sửa đến bằng **lý do**"],
        ["**Hai lựa chọn, một bị loại**", "“The Tuesday group is **full**, but there are places on Thursday”", "Lựa chọn bị loại bằng **điều kiện**, không bằng chữ full: “The morning class is fine, **but** it's only for beginners” → người đã học hai năm phải chọn lớp tối"],
        ["**Hai mốc gần nhau**", "open evening ngày 14 – buổi học đầu ngày 21", "**Ba** mốc liền nhau: ngày bay tới (2) – ngày định bắt đầu (3) – ngày bắt đầu thật (5); đọc kỹ nhãn dòng (Start date)"],
        ["**Giá gốc / giá giảm**", "giá chuẩn £120 – giá cư dân £95", "Giá **ngày thường** – giá **áp dụng cho bạn** (cuối tuần, mùa thấp điểm); mức phí **trọn gói** – mức **mỗi ngày**"],
        ["**Đánh vần** (mới)", "tên quen, đánh vần chậm", "Người nghe đoán **sai** trước (“T-H-O-M-P-S-O-N?” — “No, there's no P”) rồi người nói sửa; có chữ đôi, đuôi lạ (-eigh, -combe)"],
        ["**Nhiều món, một món được chọn** (mới)", "—", "Nhiều món được nhắc (towels, a kettle, a hairdryer) nhưng các món kia **đã có sẵn** — chỉ **một** món được “thêm vào” đơn"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: nghe ĐỘNG TỪ chốt, đừng nghe danh từ đầu tiên",
      items: [
        "Lời chốt thường có: **I'll add… · Let's make it… · So that's… · I'll take… · We'll go with… · That works.**",
        "Lời gạt bỏ thường có: **I'm afraid… · Originally… · I was thinking… but · You can, but… · We'd hoped to… · Normally…**",
        "Người nói thứ hai **nhắc lại** đáp án bằng cách đọc khác (three three eight → **double three** eight): đó là lúc bạn kiểm tra lại, không phải thêm một đáp án mới.",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Bài luyện chính — Questions 1–10 (Form completion)" },
    {
      t: "p",
      text: "Dành **30 giây** đọc form. Đoán loại đáp án: (1) họ — sẽ đánh vần · (2) số điện thoại · (3) ngày · (4) số đêm · (5) tên kiểu xe — có thể đánh vần · (6) (8) số tiền · (7) (9) (10) một từ. Nghe **một lần duy nhất** như thi thật; làm xong mới mở lời thoại.",
    },
    {
      t: "p",
      text: "**Questions 1–10.** Complete the form below. Write **ONE WORD AND/OR A NUMBER** for each answer.",
    },
    {
      t: "table",
      caption: "COASTLINE CAMPER HIRE — Booking form",
      head: ["", ""],
      rows: [
        ["Customer name", "Daniel (1) ______"],
        ["Contact number", "(2) ______"],
        ["Pick-up date", "(3) ______ March"],
        ["Length of hire", "(4) ______ nights"],
        ["Vehicle model", "the (5) ______ (sleeps four)"],
        ["Daily rate", "$ (6) ______"],
        ["Extra equipment", "a (7) ______ seat"],
        ["Maximum payment for damage (premium cover)", "$ (8) ______"],
        ["Collect from", "the (9) ______ depot"],
        ["Customer must show", "driver's licence and a (10) ______ card"],
      ],
    },
    {
      t: "listen",
      id: "t3d1-nghe-bai",
      title: "Booking a campervan",
      dan: { so: "Day 1, Recording 2 (Listening Part 1)", boiCanh: "a telephone conversation between a woman who works for a campervan hire company and a man who wants to book a vehicle for a family holiday.", cau: [1, 10] },
      note: "Khoảng 4 phút, hai giọng: Mia (Úc, nữ — nhân viên) và Daniel (Mỹ, nam — khách). Có 8 chỗ bẫy: đánh vần đoán sai, ngày bị đổi, số đêm thuê đổi, kiểu xe cho hai người, hai mức giá, hai mức bồi thường, hai điểm nhận xe, và một loại thẻ không được nhận.",
      lines: [
        { who: "Mia", voice: "au-nu", text: "Good morning, Coastline Camper Hire, Mia speaking. How can I help?", vi: "Chào buổi sáng, Coastline Camper Hire, Mia xin nghe. Tôi giúp gì được ạ?" },
        { who: "Daniel", voice: "us-nam", text: "Hi. I'm planning a road trip up the coast with my family, and I'd like to book a campervan.", vi: "Chào cô. Tôi đang lên kế hoạch một chuyến đi dọc bờ biển với gia đình, và tôi muốn đặt một xe cắm trại." },
        { who: "Mia", voice: "au-nu", text: "Lovely. Let me open a booking form. Can I start with your name?", vi: "Tuyệt quá. Để tôi mở phiếu đặt xe. Cho tôi xin tên anh trước nhé?" },
        { who: "Daniel", voice: "us-nam", text: "Sure. It's Daniel Hadleigh.", vi: "Vâng. Tôi là Daniel Hadleigh." },
        { who: "Mia", voice: "au-nu", text: "Is that H-A-D-L-E-Y?", vi: "Có phải H-A-D-L-E-Y không ạ?" },
        { who: "Daniel", voice: "us-nam", text: "No, it's a little unusual. H-A-D-L-E-I-G-H.", vi: "Không, nó hơi lạ một chút. H-A-D-L-E-I-G-H." },
        { who: "Mia", voice: "au-nu", text: "L-E-I-G-H. Got it. And a contact number while you're in Australia?", vi: "L-E-I-G-H. Tôi ghi rồi. Còn số liên lạc trong thời gian anh ở Úc?" },
        { who: "Daniel", voice: "us-nam", text: "I've bought a local SIM card. The number is oh four one seven, five five two, nine six eight.", vi: "Tôi đã mua một SIM nội địa. Số là 0417 552 968." },
        { who: "Mia", voice: "au-nu", text: "So that's oh four one seven, double five two, nine six eight.", vi: "Vậy là 0417, hai số năm rồi hai, 968." },
        { who: "Daniel", voice: "us-nam", text: "That's right.", vi: "Đúng rồi." },
        { who: "Mia", voice: "au-nu", text: "Great. Now, when would you like to pick the van up?", vi: "Tốt. Giờ thì, anh muốn nhận xe khi nào?" },
        { who: "Daniel", voice: "us-nam", text: "We land on the twelfth of March, so I was thinking the thirteenth.", vi: "Chúng tôi hạ cánh ngày 12 tháng 3, nên tôi đang tính ngày 13." },
        { who: "Mia", voice: "au-nu", text: "Hmm, I'm afraid everything's out on the thirteenth. There's a festival that weekend. I could have one ready for you on the fourteenth.", vi: "Hừm, tôi e là ngày 13 mọi xe đều đã cho thuê hết. Cuối tuần đó có lễ hội. Tôi có thể chuẩn bị sẵn một xe cho anh vào ngày 14." },
        { who: "Daniel", voice: "us-nam", text: "The fourteenth works. It gives us an extra day to get over the jet lag.", vi: "Ngày 14 được. Nó cho chúng tôi thêm một ngày để hết mệt vì lệch múi giờ." },
        { who: "Mia", voice: "au-nu", text: "And how long do you need it for?", vi: "Và anh cần xe trong bao lâu?" },
        { who: "Daniel", voice: "us-nam", text: "Originally I'd planned a week, but my wife has been reading about the national parks further north, and now she wants more time. Could we bring it back on the twenty-third?", vi: "Ban đầu tôi đã định một tuần, nhưng vợ tôi dạo này cứ đọc về các vườn quốc gia ở xa hơn về phía bắc, và giờ cô ấy muốn thêm thời gian. Chúng tôi trả xe ngày 23 được không?" },
        { who: "Mia", voice: "au-nu", text: "The twenty-third of March. Yes, that's fine. So that's nine nights.", vi: "Ngày 23 tháng 3. Vâng, được ạ. Vậy là chín đêm." },
        { who: "Daniel", voice: "us-nam", text: "Nine nights. Perfect.", vi: "Chín đêm. Hoàn hảo." },
        { who: "Mia", voice: "au-nu", text: "Now, which model? For two people, most customers take the Coaster. It's small and easy to park.", vi: "Giờ thì, kiểu xe nào? Với hai người, phần lớn khách chọn chiếc Coaster. Nó nhỏ và dễ đỗ." },
        { who: "Daniel", voice: "us-nam", text: "There are four of us, two adults and two kids.", vi: "Chúng tôi có bốn người, hai người lớn và hai đứa nhỏ." },
        { who: "Mia", voice: "au-nu", text: "Then you'll want the Voyager. That's V-O-Y-A-G-E-R. It sleeps four, and it has a small kitchen.", vi: "Vậy thì anh sẽ cần chiếc Voyager. Đánh vần là V-O-Y-A-G-E-R. Xe ngủ được bốn người, và có một bếp nhỏ." },
        { who: "Daniel", voice: "us-nam", text: "Sounds good. What does it cost?", vi: "Nghe ổn đấy. Giá bao nhiêu?" },
        { who: "Mia", voice: "au-nu", text: "In peak season it's a hundred and fifty dollars a day, but by mid-March we've already moved to the off-peak price, which is a hundred and thirty-five.", vi: "Vào mùa cao điểm là một trăm năm mươi đô một ngày, nhưng tới giữa tháng Ba chúng tôi đã chuyển sang giá thấp điểm rồi, là một trăm ba mươi lăm." },
        { who: "Daniel", voice: "us-nam", text: "A hundred thirty-five a day. OK. Is bedding included?", vi: "Một trăm ba mươi lăm một ngày. Được. Có kèm chăn ga không?" },
        { who: "Mia", voice: "au-nu", text: "Bedding and kitchen equipment are included. Camping chairs and a table are free as well, if you ask for them. Is there anything else you need?", vi: "Chăn ga và đồ bếp đã bao gồm. Ghế cắm trại và bàn cũng miễn phí, nếu anh yêu cầu. Anh còn cần gì nữa không?" },
        { who: "Daniel", voice: "us-nam", text: "Our younger daughter is five. Back home she uses a booster seat in the car.", vi: "Con gái nhỏ của chúng tôi năm tuổi. Ở nhà con bé dùng ghế nâng trên ô tô." },
        { who: "Mia", voice: "au-nu", text: "She'll need one here too. It's the law for children under seven. I'll add a booster seat. That's thirty dollars for the whole trip, not per day.", vi: "Ở đây con bé cũng cần một cái. Đó là luật với trẻ dưới bảy tuổi. Tôi sẽ thêm một ghế nâng. Phí là ba mươi đô cho cả chuyến, không phải mỗi ngày." },
        { who: "Daniel", voice: "us-nam", text: "Fine. What about insurance?", vi: "Được. Còn bảo hiểm thì sao?" },
        { who: "Mia", voice: "au-nu", text: "Basic insurance is included, but with basic cover you'd pay the first two and a half thousand dollars of any damage. If you take our premium cover, that drops to five hundred.", vi: "Bảo hiểm cơ bản đã bao gồm, nhưng với gói cơ bản anh sẽ phải trả hai nghìn rưỡi đô đầu tiên cho bất kỳ hư hại nào. Nếu anh lấy gói cao cấp, mức đó giảm xuống còn năm trăm." },
        { who: "Daniel", voice: "us-nam", text: "I've never driven on the left before, so I think I'd better take the premium cover.", vi: "Tôi chưa từng lái xe bên trái bao giờ, nên tôi nghĩ tốt hơn là lấy gói cao cấp." },
        { who: "Mia", voice: "au-nu", text: "Very sensible. So the most you'd ever pay is five hundred dollars. Now, where would you like to collect the van? We've got a depot in the city centre and one at the airport.", vi: "Rất hợp lý. Vậy mức cao nhất anh có thể phải trả là năm trăm đô. Giờ thì, anh muốn nhận xe ở đâu? Chúng tôi có một bãi xe ở trung tâm thành phố và một ở sân bay." },
        { who: "Daniel", voice: "us-nam", text: "Our hotel's downtown, so the city one, I guess.", vi: "Khách sạn của chúng tôi ở trung tâm, nên chắc là bãi trong thành phố." },
        { who: "Mia", voice: "au-nu", text: "You can, but the city depot doesn't open until ten. You said you wanted to get on the road early?", vi: "Được ạ, nhưng bãi trong thành phố mười giờ mới mở. Anh có nói là muốn lên đường sớm phải không?" },
        { who: "Daniel", voice: "us-nam", text: "Yeah, we'd hoped to leave by eight.", vi: "Vâng, chúng tôi đã mong đi trước tám giờ." },
        { who: "Mia", voice: "au-nu", text: "Then I'd suggest the airport. It opens at seven, and it's right next to the highway going north.", vi: "Vậy tôi gợi ý sân bay. Bãi đó mở lúc bảy giờ, và nằm ngay cạnh đường cao tốc đi lên phía bắc." },
        { who: "Daniel", voice: "us-nam", text: "OK, let's make it the airport depot.", vi: "Được, vậy chốt bãi ở sân bay." },
        { who: "Mia", voice: "au-nu", text: "Done. Last thing: when you pick up the van, you'll need to show your driver's licence, your American one is fine, and a credit card in the same name.", vi: "Xong. Điều cuối cùng: khi nhận xe, anh cần xuất trình bằng lái, bằng Mỹ của anh là được, và một thẻ tín dụng cùng tên." },
        { who: "Daniel", voice: "us-nam", text: "Can I use a debit card? That's what I normally travel with.", vi: "Tôi dùng thẻ ghi nợ được không? Tôi thường mang loại đó khi đi du lịch." },
        { who: "Mia", voice: "au-nu", text: "I'm sorry, we can't accept debit cards for the security deposit. It has to be a credit card.", vi: "Rất tiếc, chúng tôi không nhận thẻ ghi nợ cho khoản đặt cọc. Phải là thẻ tín dụng." },
        { who: "Daniel", voice: "us-nam", text: "No problem, I'll bring one.", vi: "Không sao, tôi sẽ mang một cái." },
        { who: "Mia", voice: "au-nu", text: "Wonderful. I'll email you the confirmation in a few minutes.", vi: "Tuyệt vời. Vài phút nữa tôi sẽ gửi email xác nhận cho anh." },
      ],
    },
    {
      t: "quiz",
      id: "t3d1-nghe-form",
      title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) Customer name: Daniel ______", answers: ["Hadleigh"] },
        { q: "(2) Contact number: ______", answers: ["0417552968", "0417 552 968", "0417-552-968", "0417 552968"] },
        { q: "(3) Pick-up date: ______ March", answers: ["14", "14th", "fourteenth", "the 14th"] },
        { q: "(4) Length of hire: ______ nights", answers: ["9", "nine"] },
        { q: "(5) Vehicle model: the ______", answers: ["Voyager"] },
        { q: "(6) Daily rate: $ ______", answers: ["135"] },
        { q: "(7) Extra equipment: a ______ seat", answers: ["booster"] },
        { q: "(8) Maximum payment for damage: $ ______", answers: ["500", "five hundred"] },
        { q: "(9) Collect from: the ______ depot", answers: ["airport"] },
        { q: "(10) Customer must show: driver's licence and a ______ card", answers: ["credit"] },
      ],
    },
    {
      t: "table",
      caption: "Giải thích đáp án 1–10 — câu nào trong lời thoại, bẫy ở đâu",
      head: ["Câu", "Đáp án", "Lời thoại và bẫy"],
      rows: [
        ["1", "**Hadleigh**", "Mia đoán sai “H-A-D-L-E-Y?” → Daniel: “No… H-A-D-L-E-**I-G-H**.” Bẫy đánh vần: bản đoán sai đến trước."],
        ["2", "**0417 552 968**", "Daniel (Mỹ) đọc “five five two”; Mia (Úc) nhắc lại “**double five** two” — cùng một số, hai cách đọc. “oh” = 0."],
        ["3", "**14**", "“I was thinking the thirteenth” → “everything's **out** on the thirteenth… ready for you on the **fourteenth**” → “The fourteenth **works**.” Ngày 12 là ngày hạ cánh. Lời sửa không có chữ no."],
        ["4", "**9**", "“Originally I'd planned **a week**” (quá khứ hoàn thành = kế hoạch cũ) → trả xe ngày 23 → Mia: “So that's **nine nights**.” Viết 7 là rơi bẫy đổi ý."],
        ["5", "**Voyager**", "Coaster dành cho hai người; “There are four of us” → “you'll want the **Voyager**. V-O-Y-A-G-E-R”."],
        ["6", "**135**", "“In peak season it's a hundred and fifty… **we've already moved to the off-peak price**, which is a hundred and thirty-five.” 150 là giá không áp dụng."],
        ["7", "**booster**", "Bedding, kitchen equipment, chairs, table đều **đã bao gồm / miễn phí** — chỉ “I'll **add** a booster seat”. 30 đô là phí ghế, không phải đáp án."],
        ["8", "**500**", "“with basic cover you'd pay the first **two and a half thousand**… premium cover, that **drops to five hundred**” → Daniel chọn premium → “the most you'd ever pay is five hundred dollars”."],
        ["9", "**airport**", "“the city one, I guess” → “You can, **but** the city depot doesn't open until ten” → “let's **make it** the airport depot.”"],
        ["10", "**credit**", "“a credit card in the same name” → Daniel hỏi debit card → “we **can't accept** debit cards… It has to be a credit card.”"],
      ],
    },
    {
      t: "note",
      title: "Cách học sau khi làm xong",
      items: [
        "Đúng **9–10**: đạt mục tiêu. Nghe lại một lần **không nhìn chữ**, nhại theo Mia hai câu có /eɪ/ (“a hundred and fifty dollars **a day**” · “a credit card in the **same name**”) để quen nguyên âm Úc.",
        "Đúng **7–8**: xem bạn sai vì **bẫy** (câu 3, 4, 5, 6, 8, 9, 10) hay vì **chính tả** (câu 1, 5, 7). Hai nhóm lỗi này chữa khác nhau: bẫy → mục 3; chính tả → mục 5.",
        "Đúng **≤ 6**: mở lại Tập 2 Ngày 1 (Form completion vòng 2) và Ngày 15 (giọng Úc), làm lại bài này sau ba ngày.",
        "Ngữ pháp bài 1 trong lời thoại: “I've **never driven** on the left **before**” · “my wife **has been reading** about the national parks” · “Originally I**'d planned** a week” · “we**'d hoped** to leave by eight”.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Hai phút kiểm — sáu dòng soát để không mất điểm oan" },
    {
      t: "p",
      text: "Thi **trên máy**, cuối bài Listening bạn có **2 phút** để xem lại (thi giấy có 10 phút chép đáp án sang phiếu). Ôn từ Tập 2 Ngày 19. Hai phút là đủ nếu bạn soát theo **một thứ tự cố định**, không đọc lại lung tung.",
    },
    {
      t: "table",
      caption: "Bảng soát 6 dòng — đi từ trên xuống, mỗi dòng nhìn cả 40 câu",
      head: ["#", "Soát gì", "Ví dụ mất điểm → sửa"],
      rows: [
        ["1", "**Câu trống** — điền hết, đoán theo loại từ", "Bỏ trống câu 7 → đoán một danh từ hợp nghĩa (seat → child / baby / booster). Không bị trừ điểm khi sai."],
        ["2", "**Giới hạn từ**", "ONE WORD AND/OR A NUMBER mà viết ~~airport depot~~ → **airport** (depot đã in sẵn)"],
        ["3", "**Số ít – số nhiều**", "“nine ______” → ~~night~~ → **nights**; sau a / an thì số ít"],
        ["4", "**Chính tả** của tên đã đánh vần và từ thường", "~~Hadley~~ → **Hadleigh** · ~~bouster~~ → **booster** · ~~Wensday~~ → **Wednesday**"],
        ["5", "**Số và đơn vị** — không lặp ký hiệu đã in", "Đề in “$ ______” mà viết ~~$135~~ thành “$ $135” → chỉ **135**; ~~14th of March March~~ → **14**"],
        ["6", "**Ngữ pháp của cả dòng** — đọc lại câu sau khi điền", "“a ______ card” + ~~credits~~ → **credit**; “the ______ depot” phải là danh từ / tính từ"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: điều KHÔNG cần sửa",
      items: [
        "**Viết hoa hay thường đều được**: voyager, Voyager, VOYAGER đều đúng. Nhiều thí sinh viết HOA toàn bộ cho dễ đọc.",
        "**Số viết bằng chữ số hay chữ đều được** (9 / nine) — viết chữ số cho nhanh và khỏi sai chính tả.",
        "**Đừng đổi đáp án đã chắc** chỉ vì hồi hộp. Chỉ sửa khi bạn nhớ rõ lời chốt, hoặc khi dòng đó sai ngữ pháp.",
      ],
    },
    {
      t: "rule",
      formula: "2 phút kiểm = câu trống → giới hạn từ → số ít / số nhiều → chính tả → số & đơn vị → đọc lại cả dòng",
      vi: "Thứ tự cố định, mỗi lượt nhìn một loại lỗi. Ở Part 1, sáu dòng này đáng giá 2–3 câu.",
    },
    {
      t: "mcq",
      id: "t3d1-nghe-kiem",
      title: "Đáp án nào được chấm ĐÚNG? (6 câu — đề: ONE WORD AND/OR A NUMBER)",
      items: [
        { q: "Form in sẵn: “Length of hire: ______ nights”. Băng nói: “So that's nine nights.”", options: ["nine nights", "9", "9 night", "nineth"], correct: 1, why: "“nights” đã in sẵn → chỉ viết **9** (hoặc nine). “nine nights” lặp chữ đã in và vượt giới hạn; “nineth” sai chính tả (ninth) và sai loại từ." },
        { q: "Form: “Daily rate: $ ______”. Băng: “a hundred and thirty-five”.", options: ["$135 dollars", "one hundred thirty five dollars", "135", "13.5"], correct: 2, why: "Ký hiệu $ đã in → viết **135**. Thêm dollars là thừa và vượt giới hạn từ." },
        { q: "Form: “Customer name: Daniel ______”. Băng: “H-A-D-L-E-I-G-H”.", options: ["hadleigh", "Hadley", "Hadliegh", "Daniel Hadleigh"], correct: 0, why: "Chữ thường vẫn được chấm đúng; quan trọng là **đúng từng chữ cái**. Hadley là bản đoán sai; Hadliegh đảo i–e; Daniel đã in sẵn." },
        { q: "Form: “Extra equipment: a ______ seat”. Băng: “I'll add a booster seat.”", options: ["booster seat", "boosters", "buster", "booster"], correct: 3, why: "“seat” đã in → một từ **booster**. Sau a + … seat không thể là số nhiều; buster sai chính tả." },
        { q: "Form: “Pick-up date: ______ March”. Băng: “on the fourteenth”.", options: ["40", "14th", "14/3", "fourteen March"], correct: 1, why: "**14** hoặc **14th** đều đúng. 40 là nghe nhầm fourteen / forty; 14/3 lặp tháng đã in; “fourteen March” lặp March." },
        { q: "Form: “Collect from: the ______ depot”. Băng: “let's make it the airport depot.”", options: ["city", "airports", "airport", "air port"], correct: 2, why: "Lời chốt là **airport**. city bị gạt (mở cửa muộn). airports thừa -s; air port tách thành hai từ là sai chính tả." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Phát âm: tự chẩn 44 âm và bốn cặp âm người Việt hay lẫn" },
    {
      t: "p",
      text: "Tiếng Anh có **44 âm**: 12 nguyên âm đơn, 8 nguyên âm đôi, 24 phụ âm. Tập 1–2 đã dạy gần hết, nhưng mỗi người **hỏng một vài âm khác nhau**. Trước khi học phát âm band 6 (nối âm, âm yếu — từ Ngày 3), hãy dùng máy chấm để biết **đúng âm nào của bạn** đang dưới chuẩn.",
    },
    {
      t: "table",
      caption: "44 âm tiếng Anh (Anh-Anh) — mỗi âm một từ mẫu",
      head: ["Nhóm", "Âm và từ mẫu"],
      rows: [
        ["**12 nguyên âm đơn**", "/iː/ see · /ɪ/ sit · /e/ bed · /æ/ cat · /ɑː/ car · /ɒ/ hot · /ɔː/ saw · /ʊ/ book · /uː/ moon · /ʌ/ cup · /ɜː/ bird · /ə/ **a**bout"],
        ["**8 nguyên âm đôi**", "/eɪ/ day · /aɪ/ my · /ɔɪ/ boy · /əʊ/ go · /aʊ/ now · /ɪə/ near · /eə/ air · /ʊə/ tour"],
        ["**24 phụ âm**", "/p/ pen · /b/ bag · /t/ tea · /d/ do · /k/ key · /ɡ/ go · /f/ five · /v/ very · /θ/ thin · /ð/ this · /s/ see · /z/ zoo · /ʃ/ she · /ʒ/ vision · /h/ hat · /tʃ/ cheap · /dʒ/ job · /m/ me · /n/ no · /ŋ/ sing · /l/ light · /r/ right · /w/ we · /j/ yes"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Tự chẩn trong 10 phút",
      steps: [
        { label: "**Đọc 9 câu chẩn đoán**", sub: "dòng 1–9 của bài luyện bên dưới" },
        { label: "**Xem điểm từng âm**", sub: "bấm vào từ bị tô đỏ / vàng" },
        { label: "**Ghi “sổ âm”**", sub: "3–5 âm thấp điểm nhất của riêng bạn" },
        { label: "**Luyện cặp tối thiểu**", sub: "dòng 10–15; lặp tới khi ≥ 80 điểm" },
        { label: "**Chẩn lại sau 2 tuần**", sub: "so điểm với hôm nay" },
      ],
    },
    {
      t: "p",
      text: "**Cặp tối thiểu** (minimal pair) là hai từ chỉ khác nhau **đúng một âm**: sea – she. Nếu bạn đọc hai từ nghe như nhau, người nghe sẽ hiểu sai từ. Bốn nhóm dưới đây là phần Tập 1–2 chưa luyện thành cặp.",
    },
    {
      t: "table",
      caption: "Bốn nhóm âm — khác nhau ở đâu trong miệng",
      head: ["Cặp", "Cách tạo âm", "Người Việt hay sai", "Cặp từ"],
      rows: [
        ["**/s/ – /ʃ/**", "/s/: lưỡi sát lợi trên, môi dẹt, tiếng rít mảnh. /ʃ/: lưỡi lùi về sau, **chu môi**, tiếng rít dày (như “suỵt”).", "Miền Bắc đọc cả hai thành /s/: she → “xi”; hoặc sửa quá tay, đọc see thành “she”.", "sea – she · sip – ship · sort – short · mess – mesh"],
        ["**/tʃ/ – /dʒ/**", "Cùng vị trí; /tʃ/ **không rung** dây thanh, /dʒ/ **có rung**. Đặt tay lên cổ để kiểm tra.", "Đọc /dʒ/ thành “d / gi” nhẹ: job → “giốp”; cuối từ thì bỏ hẳn: bridge → “brit”.", "cheap – jeep · chin – gin · rich – ridge · batch – badge"],
        ["**/v/ – /w/ – /f/**", "/f/, /v/: **răng trên chạm môi dưới** (/f/ không rung, /v/ rung). /w/: **chu tròn môi**, răng không chạm.", "Đọc /w/ thành /v/ (west → vest) hoặc /v/ cuối từ thành /f/ (leave → leaf, five → “fai”).", "vet – wet · vine – wine · very – ferry · leave – leaf"],
        ["**/r/ – /l/**", "/l/: đầu lưỡi **chạm** lợi trên. /r/: đầu lưỡi cong lên **không chạm** gì, môi hơi tròn.", "Lẫn trong cụm phụ âm: play ↔ pray, collect ↔ correct; /l/ cuối từ bị bỏ (học dark L ở Ngày 26).", "right – light · road – load · correct – collect · pray – play"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: bốn cặp này làm sai ĐÁP ÁN, không chỉ sai giọng",
      items: [
        "Listening: **collect** the van / **correct** the form · **wine** list / **vine** · **ship** / **sip** — nghe lẫn là điền sai từ.",
        "Speaking: giám khảo chấm Pronunciation theo mức **dễ hiểu**. Band 6 chấp nhận phát âm sai một số từ / âm làm giảm độ rõ **đôi lúc**; lẫn /s/–/ʃ/ và bỏ âm cuối /v/, /dʒ/ **lặp đi lặp lại** khiến người nghe phải đoán thường xuyên — đó là thứ kéo P xuống dưới 6.",
      ],
    },
    {
      t: "phatam",
      id: "t3d1-phat-am",
      title: "Tự chẩn 44 âm + luyện bốn cặp tối thiểu",
      note: "Dòng 1–9: câu chẩn đoán — đọc tự nhiên, rồi bấm vào từng từ để xem âm nào thấp điểm và ghi vào sổ âm. Dòng 10–13: cặp tối thiểu — đọc từng cặp chậm, cố ý làm hai từ nghe KHÁC nhau. Dòng 14–15: đưa các cặp vào câu.",
      items: [
        { text: "Three thin thieves thought about those other brothers.", ipa: "θriː θɪn θiːvz θɔːt əbaʊt ðəʊz ʌðə brʌðəz", vi: "Chẩn /θ/ và /ð/ (lưỡi giữa hai hàm răng)" },
        { text: "She sells six shiny shells by the seashore.", ipa: "ʃiː selz sɪks ʃaɪni ʃelz baɪ ðə siːʃɔː", vi: "Chẩn /s/ và /ʃ/" },
        { text: "The judge chose cheap cheese and orange juice.", ipa: "ðə dʒʌdʒ tʃəʊz tʃiːp tʃiːz ənd ɒrɪndʒ dʒuːs", vi: "Chẩn /tʃ/ và /dʒ/, cả ở cuối từ" },
        { text: "We visited a very wide valley for five weeks.", ipa: "wiː vɪzɪtɪd ə veri waɪd væli fə faɪv wiːks", vi: "Chẩn /v/, /w/, /f/" },
        { text: "Laura really likes the long light yellow lorry.", ipa: "lɔːrə rɪəli laɪks ðə lɒŋ laɪt jeləʊ lɒri", vi: "Chẩn /r/ và /l/" },
        { text: "A bird saw the first good book in the full moon.", ipa: "ə bɜːd sɔː ðə fɜːst ɡʊd bʊk ɪn ðə fʊl muːn", vi: "Chẩn nguyên âm /ɜː/ /ɔː/ /ʊ/ /uː/" },
        { text: "My boy enjoys loud noise near the air show.", ipa: "maɪ bɔɪ ɪndʒɔɪz laʊd nɔɪz nɪə ði eə ʃəʊ", vi: "Chẩn nguyên âm đôi /aɪ/ /ɔɪ/ /aʊ/ /ɪə/ /eə/ /əʊ/" },
        { text: "I usually measure the television.", ipa: "aɪ juːʒuəli meʒə ðə telɪvɪʒn", vi: "Chẩn /ʒ/ và /j/" },
        { text: "The young king is singing a happy song.", ipa: "ðə jʌŋ kɪŋ ɪz sɪŋɪŋ ə hæpi sɒŋ", vi: "Chẩn /ŋ/ cuối từ, /h/, /æ/, /ʌ/" },
        { text: "sea, she, sip, ship, sort, short, mess, mesh", ipa: "siː ʃiː sɪp ʃɪp sɔːt ʃɔːt mes meʃ", vi: "/s/ – /ʃ/: từ thứ hai mỗi cặp chu môi" },
        { text: "cheap, jeep, chin, gin, rich, ridge, batch, badge", ipa: "tʃiːp dʒiːp tʃɪn dʒɪn rɪtʃ rɪdʒ bætʃ bædʒ", vi: "/tʃ/ – /dʒ/: từ thứ hai mỗi cặp rung cổ" },
        { text: "vet, wet, vine, wine, very, ferry, leave, leaf", ipa: "vet wet vaɪn waɪn veri feri liːv liːf", vi: "/v/ – /w/ – /f/: /v/ /f/ răng chạm môi, /w/ tròn môi" },
        { text: "right, light, road, load, correct, collect, pray, play", ipa: "raɪt laɪt rəʊd ləʊd kərekt kəlekt preɪ pleɪ", vi: "/r/ – /l/: /l/ lưỡi chạm lợi, /r/ lưỡi không chạm" },
        { text: "Please collect the correct receipt from the lift on the right.", ipa: "pliːz kəlekt ðə kərekt rɪsiːt frəm ðə lɪft ɒn ðə raɪt", vi: "collect ≠ correct · lift ≠ rift · right ≠ light" },
        { text: "The chef showed us which sauce she chose.", ipa: "ðə ʃef ʃəʊd ʌs wɪtʃ sɔːs ʃiː tʃəʊz", vi: "/ʃ/ (chef, showed, she) · /tʃ/ (which, chose) · /s/ (sauce)" },
      ],
    },
    {
      t: "note",
      title: "Mẹo: sổ âm của riêng bạn",
      items: [
        "Ghi **3–5 âm** điểm thấp nhất vào trang đầu sổ Speaking (lập ở Ngày 2). Mỗi âm ghi kèm **ba từ bạn hay dùng** có âm đó (vd /ʃ/: should, education, she).",
        "Mỗi ngày đọc to ba từ đó trước khi luyện nói. Sau hai tuần chẩn lại — âm nào đã ≥ 80 điểm thì gạch đi, thêm âm khác.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập Ngày 1 ─────────────────────────── */

const T3D1_HOMEWORK: Lesson = {
  id: "t3d1-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 1",
  goal: "Ôn trọn Ngày 1: chia và chọn đúng thì trong hệ 12 thì (trọng tâm have been V-ing và had V3), sửa lỗi thì kiểu band 5, dịch câu Task 1 / Task 2 / Speaking, đọc một đoạn ngắn và nhận paraphrase, nghe chép số – ngày – tên, phân biệt bốn cặp âm.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (44 câu)",
      items: [
        "**I–III · Ngữ pháp (23 câu):** chia thì, chọn thì, sửa lỗi. Sai nhiều ở câu có **for / since** → ôn mục 5; sai ở câu có **by / before / when** → ôn mục 6.",
        "**IV · Dịch (6 câu):** câu dùng được ngay trong Task 1, Task 2 và Speaking — bấm 💡 nếu bí.",
        "**V · Đọc (6 câu):** đoạn 150 từ, làm trong 6 phút, gọi tên mức paraphrase của từng câu.",
        "**VI–VII · Nghe và âm (9 câu):** chép số, ngày, tên như Part 1; chọn từ đúng âm.",
        "Đạt khi đúng **≥ 31/44 (70 %)**. Câu sai chép vào **Sổ lỗi** kèm lý do sai.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 1 trước khi làm bài",
      center: "Ngày 1",
      branches: [
        { label: "**have / has been V-ing**", items: ["kéo dài tới bây giờ", "How long…? for / since", "không dùng với know, own, believe", "có số lần → have + V3"] },
        { label: "**had + V3**", items: ["việc TRƯỚC một việc quá khứ", "by the time · by 2010 · before", "một việc đơn lẻ → quá khứ đơn"] },
        { label: "**Chọn thì trong bài thi**", items: ["Task 1 năm quá khứ → V-ed", "Task 2 xu hướng → has V3 / is V-ing", "Part 2 kể chuyện → V-ed + was V-ing + had V3"] },
        { label: "**Đọc**", items: ["skim 3 phút → bản đồ bài", "đọc câu hỏi trước", "paraphrase ① ② ③ ④"] },
        { label: "**Nghe Part 1**", items: ["double / oh / March fifth", "chờ lời chốt", "2 phút kiểm: 6 dòng"] },
      ],
    },

    { t: "h", text: "I. Chia động từ trong ngoặc (10 câu)" },
    {
      t: "quiz",
      id: "t3d1-bt-chia",
      title: "I. Chia động từ — chọn đúng một trong 12 thì",
      kind: "fill",
      items: [
        { q: "1. My brother ___ (work) for the same company since 2019.", answers: ["has worked", "has been working", "'s worked", "'s been working"] },
        { q: "2. When we arrived at the cinema, the film ___ (already / start).", answers: ["had already started"] },
        { q: "3. In 1995, only 5% of the population ___ (have) access to the Internet.", answers: ["had"] },
        { q: "4. Look at the roads! It ___ (rain) all morning.", answers: ["has been raining", "'s been raining", "has rained", "'s rained"] },
        { q: "5. The number of electric cars ___ (increase) dramatically over the past decade.", answers: ["has increased"] },
        { q: "6. I ___ (know) my best friend for fifteen years.", answers: ["have known", "'ve known"] },
        { q: "7. By 2010, the figure for Japan ___ (fall) to 12%.", answers: ["had fallen"] },
        { q: "8. While I ___ (wait) for the bus, I saw an old classmate.", answers: ["was waiting"] },
        { q: "9. These days more and more students ___ (choose) to study abroad.", answers: ["are choosing"] },
        { q: "10. She was out of breath because she ___ (run).", answers: ["had been running", "'d been running", "had run"] },
      ],
    },

    { t: "h", text: "II. Chọn đáp án đúng (8 câu)" },
    {
      t: "mcq",
      id: "t3d1-bt-chon",
      title: "II. Chọn thì đúng",
      items: [
        { q: "How long ___ English?", options: ["are you learning", "do you learn", "have you been learning", "did you learn"], correct: 2, why: "**How long** + việc còn tiếp diễn → have you been learning." },
        { q: "I ___ three job applications this week.", options: ["have sent", "have been sending", "had sent", "am sending"], correct: 0, why: "Có **số lượng** (three) + khoảng chưa đóng (this week) → have + V3." },
        { q: "The company ___ in 1998 and now employs 2,000 people.", options: ["has been founded", "had founded", "has founded", "was founded"], correct: 3, why: "Mốc đã đóng **in 1998** → quá khứ đơn; công ty **được** thành lập → bị động was founded." },
        { q: "She told me that she ___ the email the day before.", options: ["sends", "had sent", "has sent", "was sending"], correct: 1, why: "Thuật lại trong quá khứ (told) một việc xảy ra **trước đó** (the day before) → had sent." },
        { q: "This phone ___ to my sister.", options: ["is belonging", "has been belonging", "belongs", "belong"], correct: 2, why: "belong = động từ trạng thái → hiện tại đơn; chủ ngữ số ít → belongs." },
        { q: "We ___ dinner when the lights went out.", options: ["were having", "have had", "had", "have been having"], correct: 0, why: "Việc đang dở (nền) bị việc ngắn cắt ngang → quá khứ tiếp diễn." },
        { q: "By the end of the period, sales in Europe ___.", options: ["have doubled", "are doubling", "double", "had doubled"], correct: 3, why: "**By the end of the period** (một mốc quá khứ của biểu đồ) → had + V3." },
        { q: "As a child, I ___ afraid of the dark.", options: ["would be", "used to be", "had been", "have been"], correct: 1, why: "Trạng thái ngày xưa → used to be; would không dùng với trạng thái." },
      ],
    },

    { t: "h", text: "III. Sửa lỗi (5 câu)" },
    {
      t: "quiz",
      id: "t3d1-bt-sua",
      title: "III. Mỗi câu có một lỗi về thì — gõ lại cụm động từ đúng",
      kind: "fill",
      items: [
        { q: "1. I **live** in Ho Chi Minh City since I was born. → I ___ in Ho Chi Minh City since I was born.", answers: ["have lived", "have been living", "'ve lived", "'ve been living"] },
        { q: "2. The line graph shows that the price of oil **rises** between 2000 and 2008. → the price of oil ___ between 2000 and 2008.", answers: ["rose"] },
        { q: "3. I **had bought** this laptop two years ago. → I ___ this laptop two years ago.", answers: ["bought"] },
        { q: "4. When I got home, my mother **already cooked** dinner. → my mother ___ dinner.", answers: ["had already cooked", "'d already cooked"] },
        { q: "5. Nowadays many people **are preferring** online shopping. → many people ___ online shopping.", answers: ["prefer"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án I và III",
      items: [
        "**I.** 1 since 2019, còn làm → HTHT (tiếp diễn). 2 hai việc quá khứ, phim bắt đầu trước → had already started. 3 mốc 1995 → quá khứ đơn (have = có, trạng thái). 4 đường còn ướt — dấu vết của hoạt động kéo dài → has been raining (has rained cũng chấp nhận, nhưng have been V-ing tự nhiên hơn khi nhấn “suốt cả buổi sáng”). 5 over the past decade → has increased (chủ ngữ the number). 6 know là trạng thái → have known. 7 By 2010 → had fallen. 8 nền đang dở → was waiting. 9 xu hướng → are choosing. 10 hoạt động kéo dài tới mốc quá khứ, để lại dấu vết (out of breath) → had been running (had run cũng được nếu coi việc chạy đã xong).",
        "**III.** 1 since → không dùng hiện tại đơn. 2 between 2000 and 2008 là quá khứ → rose (shows vẫn ở hiện tại). 3 chỉ một việc, có ago → quá khứ đơn. 4 nấu xong trước khi tôi về → had already cooked. 5 prefer là động từ trạng thái.",
      ],
    },

    { t: "h", text: "IV. Dịch sang tiếng Anh (6 câu)" },
    {
      t: "quiz",
      id: "t3d1-bt-dich",
      title: "IV. Dịch Việt → Anh — câu cho Task 1, Task 2 và Speaking",
      kind: "translate",
      grammar: "have / has been V-ing (kéo dài tới nay) · had + V3 (trước một mốc quá khứ) · V-ed (mốc đã đóng) · have / has + V3 (khoảng chưa đóng)",
      items: [
        { q: "Tôi sống ở Đà Nẵng được ba năm rồi.", answers: ["I have been living in Da Nang for three years.", "I have lived in Da Nang for three years.", "I've been living in Da Nang for three years.", "I've lived in Da Nang for three years.", "I have been living in Danang for three years.", "I have lived in Danang for three years."], hint: "have been living · for three years" },
        { q: "Tính tới năm 2020, tỉ lệ này đã giảm xuống còn 15%.", answers: ["By 2020, this rate had fallen to 15%.", "By 2020, the rate had fallen to 15%.", "By 2020, this proportion had fallen to 15%.", "By 2020, this percentage had fallen to 15%.", "By 2020, this figure had fallen to 15%.", "By 2020, this rate had dropped to 15%.", "By 2020, this rate had decreased to 15%.", "By 2020 this rate had fallen to 15%."], hint: "By 2020 · had fallen to" },
        { q: "Trong những năm gần đây, mua sắm trực tuyến đã trở nên rất phổ biến.", answers: ["In recent years, online shopping has become very popular.", "In recent years online shopping has become very popular.", "In recent years, online shopping has become very common.", "Online shopping has become very popular in recent years."], hint: "In recent years · has become" },
        { q: "Trước khi vào đại học, tôi chưa bao giờ sống xa gia đình.", answers: ["Before I went to university, I had never lived away from my family.", "Before I started university, I had never lived away from my family.", "Before I entered university, I had never lived away from my family.", "Before going to university, I had never lived away from my family.", "I had never lived away from my family before I went to university.", "Before university, I had never lived away from my family."], hint: "had never lived away from · before I went to university" },
        { q: "Ngày càng nhiều công ty đang cho phép nhân viên làm việc tại nhà.", answers: ["More and more companies are allowing their employees to work from home.", "More and more companies are allowing employees to work from home.", "More and more companies are allowing their staff to work from home.", "More and more companies are allowing staff to work from home.", "More and more companies are letting their employees work from home."], hint: "more and more · are allowing … to work from home" },
        { q: "Tôi đang xem TV thì bạn tôi gọi.", answers: ["I was watching TV when my friend called.", "I was watching TV when my friend called me.", "I was watching television when my friend called.", "I was watching TV when my friend phoned.", "I was watching TV when my friend rang."], hint: "was watching … when … called" },
      ],
    },

    { t: "h", text: "V. Đọc — 6 phút, 6 câu" },
    {
      t: "passage",
      title: "The Town That Turned Down the Lights",
      paras: [
        { text: "For most of the twentieth century, the small coastal town of Marlow Bay had kept its street lights on from dusk until dawn. By 2015, however, the cost of electricity had doubled, and the council was looking for savings. It decided to switch off two thirds of the lights between midnight and five in the morning. Many residents objected. They had assumed that darker streets would mean more crime and more accidents. In fact, police records for the following three years showed no rise in either." },
        { text: "What did change was the night sky: astronomers at a nearby college reported that they could now see roughly twice as many stars. Local wildlife benefited too. Volunteers who had been counting bats since 2010 found that numbers had started to recover. The council has since extended the scheme, although the lights on the main road and around the hospital stay on all night." },
      ],
    },
    {
      t: "mcq",
      id: "t3d1-bt-doc",
      title: "V. Câu 1–4: TRUE / FALSE / NOT GIVEN · Câu 5–6: chọn A, B hoặc C",
      items: [
        { q: "(1) The council reduced street lighting in order to spend less money.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "“the cost of electricity had doubled, and the council **was looking for savings**. It decided to switch off…” looking for savings = spend less money (mức ①–②) → TRUE." },
        { q: "(2) The number of crimes went up after the lights were switched off.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“police records… showed **no rise in either**” (either = crime, accidents) → FALSE. Bẫy: “more crime” có trong bài nhưng là điều người dân **had assumed** — nghĩ trước đó, không phải điều xảy ra." },
        { q: "(3) Most residents are now in favour of the scheme.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài nói ban đầu “many residents objected” và hội đồng đã mở rộng chương trình, nhưng **không nói** bây giờ người dân nghĩ gì → NOT GIVEN. Đừng suy quá xa (mức ④ có giới hạn)." },
        { q: "(4) No street lights in Marlow Bay are left on after midnight.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Chỉ tắt “**two thirds** of the lights”, và “the lights on the main road and around the hospital **stay on all night**” → FALSE." },
        { q: "(5) Which sentence is the best paraphrase of “Volunteers who had been counting bats since 2010 found that numbers had started to recover”?", options: ["A Volunteers started counting bats after the lights were switched off.", "B The bat population, which had been monitored for several years, began to rise again.", "C Volunteers found more bats in 2010 than in any later year."], correct: 1, why: "had been counting since 2010 = had been monitored for several years (① + bị động ③); numbers had started to recover = the population began to rise again (①). A sai thứ tự (đếm từ 2010, trước khi tắt đèn). C bài không nói." },
        { q: "(6) What does “had assumed” tell the reader about the residents' belief?", options: ["A They formed it before the lights were switched off.", "B They still hold it today.", "C They formed it after reading the police records."], correct: 0, why: "Quá khứ hoàn thành = việc có **trước** mốc quá khứ (objected / quyết định tắt đèn). Rồi “In fact…” cho thấy niềm tin đó sai. Thì giúp bạn đọc ra thứ tự sự việc." },
      ],
    },

    { t: "h", text: "VI. Nghe chép kiểu Part 1 (5 mục)" },
    {
      t: "dictation",
      id: "t3d1-bt-chep",
      title: "VI. Nghe và viết lại đúng thông tin",
      items: [
        { label: "1. Số điện thoại", spell: "My number is oh four one six, double three nine, seven oh two.", answer: "0416 339 702", alt: ["0416339702", "0416-339-702", "0416 339702"] },
        { label: "2. Ngày", spell: "The course begins on the twenty-first of August.", answer: "21 August", alt: ["21st August", "August 21", "August 21st", "21st of August", "the 21st of August"] },
        { label: "3. Họ", spell: "My surname is Whitcombe. W-H-I-T-C-O-M-B-E.", answer: "Whitcombe", alt: ["whitcombe", "WHITCOMBE"] },
        { label: "4. Giá phải trả", spell: "It was two hundred and eighty, but with the discount it comes to two hundred and fifteen dollars.", answer: "215", alt: ["$215", "215 dollars", "two hundred and fifteen"] },
        { label: "5. Giờ cuộc hẹn đầu tiên", spell: "The office opens at half past eight, but the first appointment is at a quarter past nine.", answer: "9.15", alt: ["9:15", "quarter past nine", "a quarter past nine", "9.15 am", "9:15 am"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích VI",
      items: [
        "1 **oh** = 0, **double three** = 33. 4 Hai con số: 280 là giá cũ, **215** là giá phải trả. 5 Câu hỏi là giờ **cuộc hẹn đầu tiên** → 9.15, không phải giờ mở cửa 8.30 — đọc kỹ nhãn mục cần điền.",
      ],
    },

    { t: "h", text: "VII. Âm nào? (4 câu)" },
    {
      t: "mcq",
      id: "t3d1-bt-am",
      title: "VII. Chọn từ có âm được hỏi",
      items: [
        { q: "Từ nào bắt đầu bằng **/ʃ/**?", options: ["sure", "seat", "city", "science"], correct: 0, why: "sure /ʃɔː/ (hoặc /ʃʊə/) — chữ s nhưng đọc /ʃ/. seat, city, science đều bắt đầu bằng /s/." },
        { q: "Từ nào kết thúc bằng **/dʒ/**?", options: ["rich", "bridge", "watch", "wish"], correct: 1, why: "bridge /brɪdʒ/. rich, watch kết thúc bằng /tʃ/; wish kết thúc bằng /ʃ/." },
        { q: "Từ nào bắt đầu bằng **/w/** (tròn môi, răng không chạm môi)?", options: ["very", "vote", "west", "view"], correct: 2, why: "west /west/. very, vote, view bắt đầu bằng /v/ — răng trên chạm môi dưới." },
        { q: "Người Mỹ nói “I live at **thirty** Oak Road” — âm t ở giữa nghe gần giống âm nào?", options: ["/s/", "/tʃ/", "/θ/", "/d/"], correct: 3, why: "Âm t giữa hai nguyên âm trong giọng Mỹ thành âm vỗ, nghe gần /d/: “thirdy”. Phân biệt với thirteen bằng trọng âm (THIR-ty)." },
      ],
    },
  ],
};

export const NGAY_1: Lesson[] = [T3D1_GRAMMAR, T3D1_READING, T3D1_LISTENING, T3D1_HOMEWORK];
