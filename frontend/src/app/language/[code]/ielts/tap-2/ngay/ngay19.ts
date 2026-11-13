/**
 * IELTS Tập 2 — Ngày 19 (chặng 4: Ngày 19–24) — tự soạn 12/11/2026, không chép sách / đề thật.
 *   Bài 1 (grammar)   — Câu hỏi Yes/No · Wh- · câu hỏi gián tiếp · question tags [G19]
 *   Bài 2 (listening) — Listening Part 4: Note · Sentence completion · Short answer; chuyển đáp án, 2 phút kiểm;
 *                       nhận ra giọng Úc [L06 L14 L16 L17 X02]
 *   Bài 3 (speaking)  — Part 2: Describe an activity [S05] · 🔊 ngữ điệu câu hỏi Yes/No ↑ Wh- ↓ [S15 nhập]
 *   Bài tập           — 40 câu + ghi âm Part 2.
 * Hai bài nghe Part 4 (Rabbits in Australia · Koalas) đọc bằng giọng Úc thật (en-AU: au-nam / au-nu); đặc điểm giọng Úc có bảng ở mục 3.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T2D19_GRAMMAR: Lesson = {
  id: "t2d19-ngu-phap",
  kind: "grammar",
  title: "Câu hỏi Wh- / Yes-No / câu hỏi gián tiếp; question tags",
  goal: "Đặt đúng mọi loại câu hỏi (Yes/No, Wh-, hỏi chủ ngữ), đổi sang câu hỏi gián tiếp lịch sự (Could you tell me where… is?) và dùng question tags đúng trợ động từ — để nghe hiểu hội thoại Listening Part 1/3 và nói tự nhiên ở Speaking (GRA band 5).",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Yes/No question**: đảo **trợ động từ** (be · do/does/did · have · can/will…) lên trước chủ ngữ: **Does** she **play** tennis? — không bao giờ ~~Does she plays~~.",
        "**Wh- question**: **Wh- + trợ động từ + S + V**: Where **do** you **live**? — riêng khi hỏi **chủ ngữ** thì KHÔNG mượn do: **Who won** the match?",
        "**Câu hỏi gián tiếp** (indirect question): Could you tell me / Do you know + **wh- / if** + **S + V** (thứ tự câu kể): Could you tell me where **the station is**?",
        "**Question tags**: câu khẳng định → đuôi phủ định, và ngược lại; đuôi dùng **đúng trợ động từ** của câu: She **can** swim, **can't** she? — người Việt hay gắn ~~isn't it?~~ cho mọi câu.",
        "Đẩy **GRA** (Grammatical Range & Accuracy) Speaking lên 5.0: câu hỏi sai trật tự là lỗi giám khảo nghe ra ngay; và giúp **Listening Part 1/3** — nghe câu hỏi đuôi để biết người nói đang xác nhận hay đang hỏi thật.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Câu hỏi Yes/No — đảo trợ động từ lên đầu" },
    {
      t: "p",
      text: "**Yes/No question** (câu hỏi Có/Không) là câu hỏi mà người nghe trả lời được bằng **Yes** hoặc **No**. Tiếng Việt chỉ cần thêm “có… không?” vào cuối câu; tiếng Anh thì phải **đưa một trợ động từ (auxiliary verb) lên trước chủ ngữ**. Trợ động từ là gì thì tuỳ câu kể đang có gì: có **be** thì đảo be; có **modal** (can, will, should…) thì đảo modal; có **have** của thì hoàn thành thì đảo have; **không có** trợ động từ nào thì **mượn do / does / did**.",
    },
    {
      t: "table",
      caption: "Một quy tắc cho mọi thì: tìm trợ động từ → đưa lên đầu",
      head: ["Câu kể", "Trợ động từ", "Câu hỏi Yes/No", "Trả lời ngắn"],
      rows: [
        ["She **is** a coach.", "is (be)", "**Is** she a coach?", "Yes, she **is**. / No, she **isn't**."],
        ["They **live** in Hue.", "(mượn) do", "**Do** they **live** in Hue?", "Yes, they **do**. / No, they **don't**."],
        ["He **plays** chess.", "(mượn) does", "**Does** he **play** chess?", "Yes, he **does**. / No, he **doesn't**."],
        ["You **watched** the final.", "(mượn) did", "**Did** you **watch** the final?", "Yes, I **did**. / No, I **didn't**."],
        ["It **is raining**.", "is (be)", "**Is** it raining?", "Yes, it **is**. / No, it **isn't**."],
        ["She **has finished** the race.", "has", "**Has** she finished the race?", "Yes, she **has**. / No, she **hasn't**."],
        ["You **can** swim.", "can", "**Can** you swim?", "Yes, I **can**. / No, I **can't**."],
        ["The match **will** start at 7.", "will", "**Will** the match start at 7?", "Yes, it **will**. / No, it **won't**."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Am / Is / Are / Was / Were + S + …?",
          vi: "Câu có động từ to be (kể cả be trong thì tiếp diễn): đảo be lên đầu.",
          examples: [
            { en: "Are you free this weekend?", vi: "Cuối tuần này bạn rảnh không?" },
            { en: "Was the stadium full last night?", vi: "Tối qua sân vận động có kín chỗ không?" },
          ],
        },
        {
          formula: "Do / Does / Did + S + V (nguyên mẫu) …?",
          vi: "Câu không có trợ động từ: mượn do/does/did — động từ chính trở về NGUYÊN MẪU (bỏ -s, bỏ -ed).",
          examples: [
            { en: "Does your brother work out at a gym?", vi: "Anh trai bạn có tập ở phòng gym không?" },
            { en: "Did you enjoy the concert?", vi: "Bạn có thích buổi hoà nhạc không?" },
          ],
        },
        {
          formula: "Modal / Have / Has + S + V …?",
          vi: "Câu có modal (can, will, should…) hoặc have/has của thì hoàn thành: đảo chính nó lên đầu.",
          examples: [
            { en: "Can I join your team?", vi: "Tôi tham gia đội của bạn được không?" },
            { en: "Have you ever tried rock climbing?", vi: "Bạn đã bao giờ thử leo núi đá chưa?" },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: năm lỗi người Việt hay mắc với câu hỏi Yes/No",
      items: [
        "**Hai trợ động từ cùng lúc**: ~~Do you are a student?~~ → **Are** you a student? (đã có be thì không mượn do).",
        "**Giữ -s / -ed sau does / did**: ~~Does she likes jazz?~~ → Does she **like** jazz? · ~~Did you went?~~ → Did you **go**? — does / did đã “gánh” thì và ngôi rồi.",
        "**Quên đảo** khi viết: ~~You like football?~~ — chỉ chấp nhận trong nói chuyện thân mật (lên giọng cuối câu); trong bài viết và khi hỏi lịch sự phải là **Do you like football?**",
        "**Viết tắt (contraction) trong câu trả lời ngắn khẳng định**: ~~Yes, I'm.~~ ~~Yes, she's.~~ → **Yes, I am. / Yes, she is.** (chỉ viết tắt được ở câu trả lời phủ định: No, I'm not / No, she isn't).",
        "Ở **Speaking Part 1**, đừng trả lời một chữ “Yes.” — trả lời **Yes / No + lý do + ví dụ** (Tập 2 Ngày 1): “Yes, I do. I play badminton twice a week because it helps me relax after work.”",
      ],
    },
    {
      t: "rule",
      formula: "Trợ động từ (be / do / does / did / have / has / modal) + S + V …? → Yes, S + trợ động từ. / No, S + trợ động từ + n't.",
      vi: "Câu hỏi Yes/No: tìm trợ động từ, đưa lên trước chủ ngữ; không có thì mượn do/does/did và trả động từ về nguyên mẫu.",
    },
    {
      t: "quiz",
      id: "t2d19-yesno-dich",
      title: "Dịch sang tiếng Anh — câu hỏi Yes/No (4 câu)",
      kind: "translate",
      grammar: "Trợ động từ + S + V…? · Do/Does/Did + S + V nguyên mẫu · Are/Is + S… · Have/Has + S + V3 · Can + S + V.",
      items: [
        { q: "Bố bạn có chơi bóng đá không?", hint: "Does, your father / your dad, play football", answers: ["Does your father play football?", "Does your dad play football?", "Does your father play soccer?", "Does your dad play soccer?"] },
        { q: "Hôm qua bạn có đi bơi không?", hint: "Did, you, go swimming, yesterday", answers: ["Did you go swimming yesterday?", "Yesterday did you go swimming?", "Did you swim yesterday?", "Did you go for a swim yesterday?"] },
        { q: "Bạn đã bao giờ xem một trận đấu trực tiếp chưa?", hint: "Have, you, ever watched / ever seen, a live match", answers: ["Have you ever watched a live match?", "Have you ever seen a live match?", "Have you ever watched a match live?", "Have you ever seen a match live?", "Have you ever watched a live game?", "Have you ever seen a live game?"] },
        { q: "Phòng gym có mở cửa vào Chủ nhật không?", hint: "Is, the gym, open, on Sundays / on Sunday", answers: ["Is the gym open on Sundays?", "Is the gym open on Sunday?", "Does the gym open on Sundays?", "Does the gym open on Sunday?"] },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Câu hỏi Wh- — và trường hợp đặc biệt: hỏi CHỦ NGỮ" },
    {
      t: "p",
      text: "**Wh- question** (câu hỏi có từ để hỏi) cần một câu trả lời là **thông tin**, không phải Yes/No. Công thức chỉ là: **đặt từ để hỏi lên đầu, rồi viết tiếp y như câu hỏi Yes/No**. Where **do you live**? = Where + (Do you live?).",
    },
    {
      t: "table",
      caption: "Các từ để hỏi hay gặp trong IELTS (Listening Part 1 hỏi đúng những thứ này)",
      head: ["Từ để hỏi", "Hỏi về", "Ví dụ"],
      rows: [
        ["**What**", "cái gì, việc gì (lựa chọn mở)", "**What** do you do in your free time?"],
        ["**Which**", "cái nào (lựa chọn trong một nhóm có sẵn)", "**Which** team do you support — Hanoi or Viettel?"],
        ["**Who**", "ai", "**Who** do you usually play with?"],
        ["**Whose**", "của ai", "**Whose** racket is this?"],
        ["**Where**", "ở đâu", "**Where** is the nearest swimming pool?"],
        ["**When / What time**", "khi nào / mấy giờ", "**What time** does the class start?"],
        ["**Why**", "tại sao", "**Why** did you stop playing the guitar?"],
        ["**How**", "như thế nào, bằng cách nào", "**How** did you learn to swim?"],
        ["**How often**", "bao lâu một lần (tần suất)", "**How often** do you go jogging?"],
        ["**How long**", "bao lâu (thời gian kéo dài)", "**How long** have you played tennis?"],
        ["**How far**", "bao xa", "**How far** is the stadium from here?"],
        ["**How many + N số nhiều**", "bao nhiêu (đếm được)", "**How many** players are there in a team?"],
        ["**How much + N không đếm / giá**", "bao nhiêu (không đếm) · giá bao nhiêu", "**How much** does a monthly pass cost?"],
        ["**What kind of / What sort of**", "loại gì", "**What kind of** music do you listen to?"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hỏi TÂN NGỮ (mượn do) ≠ hỏi CHỦ NGỮ (không mượn do)",
      caption: "Câu kể gốc: “Lan called Minh.” Hỏi người được gọi (Minh) → hỏi tân ngữ. Hỏi người gọi (Lan) → hỏi chủ ngữ: Who thay luôn vào chỗ chủ ngữ, động từ giữ nguyên dạng câu kể.",
      cols: [
        {
          title: "Hỏi **tân ngữ** — Who / What + **did** + S + V",
          anh: "telephone-receiver",
          items: [
            "Who **did Lan call**? → Minh.",
            "What **did you buy**? → A new racket.",
            "Who **do** you **live** with? → My parents.",
          ],
        },
        {
          title: "Hỏi **chủ ngữ** — Who / What / Which + **V** (như câu kể)",
          anh: "person-raising-hand",
          items: [
            "Who **called** Minh? → Lan (did).",
            "What **happened** at the match? → A fan ran onto the pitch.",
            "Which team **won**? → The home team.",
          ],
        },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Wh- + trợ động từ + S + V …?",
          vi: "Câu hỏi Wh- thường (hỏi tân ngữ, nơi chốn, thời gian, lý do…).",
          examples: [
            { en: "How often do you go to the cinema?", vi: "Bao lâu bạn đi xem phim một lần?" },
            { en: "Why has the match been cancelled?", vi: "Tại sao trận đấu bị huỷ?" },
          ],
        },
        {
          formula: "Who / What / Which (+ N) + V (chia như câu kể) …?",
          vi: "Hỏi CHỦ NGỮ: không mượn do/does/did, động từ chia theo thì như câu kể (thường ngôi số ít: Who lives…?).",
          examples: [
            { en: "Who teaches the yoga class?", vi: "Ai dạy lớp yoga?" },
            { en: "What made you choose this sport?", vi: "Điều gì khiến bạn chọn môn thể thao này?" },
          ],
        },
        {
          formula: "Wh- + trợ động từ + S + V + giới từ?",
          vi: "Giới từ đi theo động từ thường đứng CUỐI câu hỏi (tiếng Anh nói tự nhiên).",
          examples: [
            { en: "Where are you from?", vi: "Bạn đến từ đâu?" },
            { en: "What are you interested in?", vi: "Bạn quan tâm đến điều gì?" },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: lỗi hay gặp với câu hỏi Wh-",
      items: [
        "**Quên trợ động từ**: ~~Where you live?~~ → Where **do** you live? · ~~Why you don't come?~~ → Why **don't you** come?",
        "**Mượn do khi hỏi chủ ngữ**: ~~Who did win the match?~~ → **Who won** the match? · ~~What did happen?~~ → **What happened**?",
        "**How many + danh từ không đếm được**: ~~How many money~~ → **How much** money · ~~How much people~~ → **How many** people.",
        "**How long ≠ How often**: How **long** = kéo dài bao lâu (three years); How **often** = mấy lần (twice a week). Listening Part 1 hay gài đúng chỗ này.",
        "**What vs Which**: lựa chọn đã cho sẵn (trong menu, trong hai đội) → **which**; hỏi mở → **what**.",
      ],
    },
    {
      t: "rule",
      formula: "Wh- + trợ động từ + S + V? · Hỏi chủ ngữ: Who / What / Which + V (không do)?",
      vi: "Câu hỏi Wh- = từ để hỏi + câu hỏi Yes/No; khi từ để hỏi chính là chủ ngữ thì giữ trật tự câu kể.",
    },
    {
      t: "quiz",
      id: "t2d19-wh-dich",
      title: "Dịch sang tiếng Anh — câu hỏi Wh- (5 câu)",
      kind: "translate",
      grammar: "Wh- + do/does/did + S + V? · Hỏi chủ ngữ: Who/What + V? · How often / How long / How much / How many.",
      items: [
        { q: "Bạn thường chơi cầu lông ở đâu?", hint: "Where, do you usually play, badminton", answers: ["Where do you usually play badminton?", "Where do you normally play badminton?", "Where do you often play badminton?"] },
        { q: "Ai đã dạy bạn bơi?", hint: "hỏi chủ ngữ: Who + taught (không did)", answers: ["Who taught you to swim?", "Who taught you how to swim?", "Who taught you swimming?"] },
        { q: "Bao lâu bạn đi tập gym một lần?", hint: "How often, do you go to the gym", answers: ["How often do you go to the gym?", "How often do you go to the gym to work out?", "How often do you work out at the gym?"] },
        { q: "Một vé xem trận chung kết giá bao nhiêu?", hint: "How much, does a ticket for the final cost", answers: ["How much does a ticket for the final cost?", "How much is a ticket for the final?", "How much does a ticket to the final cost?", "How much is a ticket to the final?", "How much does a final ticket cost?"] },
        { q: "Điều gì đã xảy ra sau trận đấu?", hint: "hỏi chủ ngữ: What + happened (không did)", answers: ["What happened after the match?", "What happened after the game?"] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Câu hỏi gián tiếp — hỏi lịch sự kiểu “Bạn có biết… không?”" },
    {
      t: "p",
      text: "**Indirect question** (câu hỏi gián tiếp) là một câu hỏi được **lồng vào sau một câu mở đầu** như **Could you tell me…? / Do you know…? / I'd like to know… / I was wondering…** Người bản ngữ dùng nó để hỏi **lịch sự hơn** — hỏi người lạ, hỏi lễ tân, hỏi giám khảo. Khi lồng vào, phần câu hỏi **mất dạng câu hỏi**: không đảo, không mượn do/does/did — nó quay về **thứ tự câu kể S + V**.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Ba bước đổi câu hỏi trực tiếp → gián tiếp",
      caption: "Ví dụ chạy suốt: “What time does the class start?”",
      steps: [
        { label: "Bước 1 — viết câu mở đầu", sub: "**Could you tell me** … ? / **Do you know** … ? / **I'd like to know** … ." },
        { label: "Bước 2 — giữ từ để hỏi; Yes/No thì thêm **if / whether**", sub: "Could you tell me **what time** …" },
        { label: "Bước 3 — bỏ do/does/did, viết **S + V** như câu kể", sub: "… what time **the class starts**? (does biến mất → starts lấy lại -s)" },
      ],
    },
    {
      t: "table",
      caption: "Đổi trực tiếp → gián tiếp: để ý phần in đậm đổi vị trí",
      head: ["Câu hỏi trực tiếp", "Câu hỏi gián tiếp"],
      rows: [
        ["Where **is the changing room**?", "Could you tell me where **the changing room is**?"],
        ["What time **does the pool open**?", "Do you know what time **the pool opens**?"],
        ["Why **did they cancel** the race?", "I'd like to know why **they cancelled** the race."],
        ["How much **is a lesson**?", "Can you tell me how much **a lesson is**?"],
        ["**Is** the course **full**? (Yes/No)", "Could you tell me **if / whether** the course **is full**?"],
        ["**Did** my parcel **arrive**? (Yes/No)", "Do you know **if / whether** my parcel **arrived**?"],
        ["**Who won** the game? (hỏi chủ ngữ)", "Do you know **who won** the game? (giữ nguyên thứ tự)"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Could you tell me / Do you know + Wh- + S + V …?",
          vi: "Hỏi lịch sự một câu Wh-: sau từ để hỏi là thứ tự câu kể. Câu mở đầu là câu hỏi ⇒ cuối câu dấu ?",
          examples: [
            { en: "Could you tell me where the tennis courts are?", vi: "Anh có thể cho tôi biết sân tennis ở đâu không?" },
            { en: "Do you know how long the course lasts?", vi: "Bạn có biết khoá học kéo dài bao lâu không?" },
          ],
        },
        {
          formula: "Could you tell me / Do you know + if / whether + S + V …?",
          vi: "Hỏi lịch sự một câu Yes/No: thêm if hoặc whether (whether trang trọng hơn).",
          examples: [
            { en: "Do you know if the gym has a sauna?", vi: "Bạn có biết phòng gym có phòng xông hơi không?" },
            { en: "Could you tell me whether I need to bring my own racket?", vi: "Anh có thể cho tôi biết tôi có cần mang vợt riêng không?" },
          ],
        },
        {
          formula: "I'd like to know / I wonder / I'm not sure + Wh- / if + S + V .",
          vi: "Câu mở đầu là câu kể ⇒ cả câu kết thúc bằng dấu CHẤM, không phải dấu hỏi.",
          examples: [
            { en: "I wonder why so many people prefer watching sport to playing it.", vi: "Tôi tự hỏi vì sao nhiều người thích xem thể thao hơn là chơi." },
            { en: "I'm not sure whether e-sports should be called a sport.", vi: "Tôi không chắc thể thao điện tử có nên được gọi là một môn thể thao không." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: lỗi số 1 của câu hỏi gián tiếp là VẪN ĐẢO",
      items: [
        "~~Could you tell me where **is the station**?~~ → Could you tell me where **the station is**?",
        "~~Do you know what time **does it open**?~~ → Do you know what time **it opens**? (bỏ does, trả -s về động từ).",
        "~~I wonder where **is she**?~~ → I wonder where **she is**. (câu mở đầu là câu kể → dấu chấm).",
        "Yes/No mà quên **if/whether**: ~~Do you know the shop is open?~~ (câu này hiểu thành “Bạn có biết là cửa hàng đang mở không” — nghĩa khác) → Do you know **if** the shop is open?",
        "Đừng đổi thì (lùi thì) ở đây: đó là **câu tường thuật** (reported speech) — học ở Tập 3. Câu hỏi gián tiếp hôm nay giữ nguyên thì của câu gốc.",
      ],
    },
    {
      t: "note",
      title: "Câu hỏi gián tiếp trong IELTS — dùng ở đâu?",
      items: [
        "**Listening Part 1**: lễ tân / nhân viên hay hỏi kiểu “**Can I ask how** you heard about us?” “**Could you tell me what** your postcode is?” — câu trả lời (đáp án) đến ngay sau. Nhận ra cấu trúc này giúp bạn biết **chỗ trống nào sắp được đọc**.",
        "**Speaking**: khi không nghe rõ: “Sorry, **could you repeat the question**, please?” (Part 1 giám khảo chỉ được nhắc lại câu hỏi). Ở **Part 3** được hỏi lại nghĩa: “Sorry, **could you tell me what you mean by** ‘leisure facilities’?”",
        "**Speaking Part 3 / Writing Task 2**: câu hỏi gián tiếp nằm **trong câu kể** để nêu ý tinh tế: “**It depends on how much** free time people have.” “**Nobody really knows whether** e-sports will become an Olympic event.” — giám khảo tính đây là **câu phức** (complex sentence), cộng điểm GRA.",
      ],
    },
    {
      t: "rule",
      formula: "Could you tell me / Do you know + Wh- / if / whether + S + V …? · I wonder / I'm not sure + Wh- / if + S + V .",
      vi: "Câu hỏi gián tiếp: sau câu mở đầu là thứ tự câu kể (không đảo, không do/does/did); Yes/No dùng if/whether.",
    },
    {
      t: "quiz",
      id: "t2d19-giantiep-dich",
      title: "Dịch sang tiếng Anh — câu hỏi gián tiếp (5 câu)",
      kind: "translate",
      grammar: "Could you tell me / Do you know + Wh- + S + V? · … + if / whether + S + V? · I wonder + Wh- + S + V.",
      items: [
        { q: "Anh có thể cho tôi biết hồ bơi ở đâu không?", hint: "Could you tell me, where the swimming pool is", answers: ["Could you tell me where the swimming pool is?", "Could you tell me where the pool is?", "Can you tell me where the swimming pool is?", "Can you tell me where the pool is?"] },
        { q: "Bạn có biết lớp học bắt đầu lúc mấy giờ không?", hint: "Do you know, what time the class starts", answers: ["Do you know what time the class starts?", "Do you know when the class starts?", "Do you know what time the lesson starts?", "Do you know when the lesson starts?", "Do you know what time the class begins?", "Do you know when the class begins?"] },
        { q: "Chị có thể cho tôi biết tôi có cần mang theo giày không?", hint: "Could you tell me, if / whether, I need to bring, shoes", answers: ["Could you tell me if I need to bring shoes?", "Could you tell me whether I need to bring shoes?", "Could you tell me if I need to bring my shoes?", "Could you tell me whether I need to bring my shoes?", "Can you tell me if I need to bring shoes?", "Can you tell me whether I need to bring shoes?", "Could you tell me if I need to bring my own shoes?", "Could you tell me whether I need to bring my own shoes?"] },
        { q: "Tôi muốn biết vì sao trận đấu bị hoãn.", hint: "I'd like to know, why the match was postponed", answers: ["I'd like to know why the match was postponed.", "I would like to know why the match was postponed.", "I'd like to know why the match has been postponed.", "I would like to know why the match has been postponed.", "I'd like to know why the game was postponed.", "I would like to know why the game was postponed."] },
        { q: "Bạn có biết ai đã thắng giải không?", hint: "Do you know, who won, the prize / the tournament", answers: ["Do you know who won the prize?", "Do you know who won the tournament?", "Do you know who won the competition?", "Do you know who won the award?"] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Question tags — câu hỏi đuôi “…, phải không?”" },
    {
      t: "p",
      text: "**Question tag** (câu hỏi đuôi) là đoạn ngắn gắn **cuối câu kể** để **xác nhận** điều mình nghĩ là đúng, giống “…, phải không?”, “…, nhỉ?” của tiếng Việt. Tiếng Việt chỉ có một đuôi cho mọi câu; tiếng Anh thì đuôi **phải khớp với câu**: dùng lại **đúng trợ động từ** của câu, **đổi khẳng định ↔ phủ định**, và chủ ngữ đổi thành **đại từ**.",
    },
    {
      t: "table",
      caption: "Ba bước: tìm trợ động từ → đảo dấu (+/−) → chủ ngữ thành đại từ",
      head: ["Câu kể", "Trợ động từ", "Câu hỏi đuôi"],
      rows: [
        ["Your sister **is** a dancer,", "is → isn't", "**isn't she?**"],
        ["You **play** volleyball,", "(mượn) do → don't", "**don't you?**"],
        ["Nam **plays** the drums,", "(mượn) does → doesn't", "**doesn't he?**"],
        ["They **won** the cup,", "(mượn) did → didn't", "**didn't they?**"],
        ["She **has visited** Da Lat,", "has → hasn't", "**hasn't she?**"],
        ["He **can't** swim,", "can't → can", "**can he?**"],
        ["You **won't** be late,", "won't → will", "**will you?**"],
        ["We **weren't** ready,", "weren't → were", "**were we?**"],
      ],
    },
    {
      t: "table",
      caption: "Các trường hợp đặc biệt — đề thi trắc nghiệm ngữ pháp và Listening hay gặp",
      head: ["Câu", "Đuôi", "Vì sao"],
      rows: [
        ["**I am** right,", "**aren't I?**", "Không có ~~amn't I~~; dùng **aren't I** (dạng chuẩn; rất trang trọng: am I not?). Câu phủ định I'm not… → **am I?**"],
        ["**Let's** go for a walk,", "**shall we?**", "Lời rủ với Let's luôn đi với shall we."],
        ["**Close** the door, (mệnh lệnh)", "**will you? / can you? / could you?**", "Lời nhờ: đuôi will/can/could you. Don't + V… → **will you?**"],
        ["**There is** a café nearby,", "**isn't there?**", "There is/are → đuôi giữ **there**."],
        ["**This / That** is your bag,", "**isn't it?**", "this/that → **it**; these/those → **they**."],
        ["**Everyone / Somebody / Nobody** enjoyed it,", "**didn't they? / did they?**", "Đại từ chỉ người không xác định → **they**."],
        ["**Nothing / Everything** went wrong,", "**did it? / didn't it?**", "Đại từ chỉ vật → **it**."],
        ["She **never / hardly ever** complains,", "**does she?**", "never, hardly, seldom, no, nobody, nothing mang nghĩa PHỦ ĐỊNH → đuôi **khẳng định**."],
        ["You **used to** live here,", "**didn't you?**", "used to chia như động từ thường quá khứ → did (Ngày 21)."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ngữ điệu của câu hỏi đuôi — cùng chữ, khác nghĩa",
      caption: "Hiểu ngữ điệu câu hỏi đuôi giúp bạn theo kịp hội thoại Listening Part 1 và Part 3: biết người nói đã chắc hay còn đang hỏi.",
      cols: [
        {
          title: "Giọng **xuống ↘** — “đúng thế nhỉ?”",
          anh: "smiling-face-with-sunglasses",
          items: [
            "Người nói **đã chắc**, chỉ chờ bạn đồng ý.",
            "Dùng khi bắt chuyện (small talk).",
            "It's a lovely day, **isn't it ↘**",
            "That was a great match, **wasn't it ↘**",
          ],
        },
        {
          title: "Giọng **lên ↗** — “có phải không?”",
          anh: "thinking-face",
          items: [
            "Người nói **chưa chắc**, đang hỏi thật.",
            "Chờ câu trả lời thông tin.",
            "The class starts at six, **doesn't it ↗**",
            "You've paid the fee, **haven't you ↗**",
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: trả lời câu hỏi đuôi PHỦ ĐỊNH — người Việt hay nói ngược",
      items: [
        "Tiếng Anh trả lời theo **sự thật**, không theo câu hỏi. “You **aren't** busy, **are you**?” — nếu bạn **không bận**: **No, I'm not.** (không phải ~~Yes~~ dù tiếng Việt nói “Ừ, không bận”).",
        "Nếu bạn **có bận**: **Yes, I am.** — Yes đi với câu khẳng định, No đi với câu phủ định, luôn luôn.",
        "Lỗi số 1: gắn **isn't it?** cho mọi câu vì dịch từ “phải không?”: ~~You like tea, isn't it?~~ → You like tea, **don't you?** · ~~She can drive, isn't it?~~ → She can drive, **can't she?**",
        "Trong nói thân mật, người bản ngữ cũng dùng **…, right?** cho mọi câu — dùng được khi nói, nhưng khi thi ngữ pháp/viết thì phải chọn đuôi đúng.",
      ],
    },
    {
      t: "rule",
      formula: "Câu khẳng định, trợ động từ + n't + đại từ? · Câu phủ định, trợ động từ + đại từ? (I am → aren't I · Let's → shall we · never → đuôi khẳng định)",
      vi: "Câu hỏi đuôi lặp lại đúng trợ động từ của câu, đổi dấu +/−, chủ ngữ thành đại từ.",
    },
    {
      t: "quiz",
      id: "t2d19-tag-dich",
      title: "Dịch sang tiếng Anh — câu hỏi đuôi (4 câu)",
      kind: "translate",
      grammar: "Khẳng định, + aux + n't + đại từ? · Phủ định, + aux + đại từ? · Let's…, shall we? · never → đuôi khẳng định.",
      items: [
        { q: "Bạn thích bóng chuyền, phải không?", hint: "You like volleyball, + don't you?", answers: ["You like volleyball, don't you?"] },
        { q: "Chúng ta đi dạo đi, nhé?", hint: "Let's go for a walk, + shall we?", answers: ["Let's go for a walk, shall we?", "Let's take a walk, shall we?"] },
        { q: "Anh ấy không bao giờ đến muộn, phải không?", hint: "He never arrives late / is never late, + does he? / is he?", answers: ["He is never late, is he?", "He's never late, is he?", "He never arrives late, does he?", "He never comes late, does he?"] },
        { q: "Có một sân bóng gần trường, phải không?", hint: "There is a football pitch near the school, + isn't there?", answers: ["There is a football pitch near the school, isn't there?", "There's a football pitch near the school, isn't there?", "There is a football field near the school, isn't there?", "There's a football field near the school, isn't there?"] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Luyện tổng hợp — chọn câu hỏi đúng" },
    {
      t: "mcq",
      id: "t2d19-np-chon",
      title: "Chọn đáp án đúng (12 câu)",
      items: [
        { q: "___ your brother play any sports?", options: ["Does", "Is", "Do", "Has"], correct: 0, why: "Câu không có trợ động từ, chủ ngữ ngôi thứ ba số ít (your brother) → mượn **Does**; động từ play giữ nguyên mẫu." },
        { q: "Where ___ you yesterday afternoon?", options: ["did", "was", "were", "have"], correct: 2, why: "Câu có to be ở quá khứ (bạn **đã ở** đâu) → **were** you. ~~did you~~ cần thêm động từ chính (Where did you go?)." },
        { q: "Who ___ the first goal?", options: ["did score", "scored", "does score", "scoring"], correct: 1, why: "Hỏi **chủ ngữ** (ai ghi bàn) → không mượn did: **Who scored**…?" },
        { q: "Could you tell me where ___?", options: ["is the gym", "does the gym", "the gym does", "the gym is"], correct: 3, why: "Câu hỏi gián tiếp → thứ tự câu kể **the gym is**. ~~where is the gym~~ là lỗi đảo." },
        { q: "Do you know ___ the course is free?", options: ["does", "what", "whether", "which"], correct: 2, why: "Câu gốc là Yes/No (Is the course free?) → nối bằng **if / whether**." },
        { q: "___ have you been learning English? — For about two years.", options: ["How long", "How often", "How many", "How far"], correct: 0, why: "Trả lời bằng khoảng thời gian (for two years) → **How long**. How often hỏi tần suất." },
        { q: "You play the guitar, ___?", options: ["isn't it", "aren't you", "don't you", "do you"], correct: 2, why: "Câu khẳng định, động từ thường play, chủ ngữ you → mượn do, đuôi phủ định: **don't you?**" },
        { q: "She can't swim, ___?", options: ["can she", "can't she", "does she", "is she"], correct: 0, why: "Câu phủ định với **can't** → đuôi khẳng định cùng trợ động từ: **can she?**" },
        { q: "I'm late again, ___?", options: ["am not I", "amn't I", "isn't it", "aren't I"], correct: 3, why: "Trường hợp đặc biệt: I am → **aren't I?** (không có ~~amn't I~~)." },
        { q: "Nobody called while I was out, ___?", options: ["didn't they", "did they", "did he", "didn't he"], correct: 1, why: "**Nobody** mang nghĩa phủ định → đuôi khẳng định; đại từ thay cho nobody là **they** → **did they?**" },
        { q: "___ kind of films do you enjoy?", options: ["Whose", "What", "How", "Who"], correct: 1, why: "Cụm cố định **What kind of** + N (loại gì)." },
        { q: "“You aren't tired, are you?” — Bạn KHÔNG mệt. Trả lời đúng là:", options: ["Yes, I'm not.", "Yes, I am.", "No, I am.", "No, I'm not."], correct: 3, why: "Trả lời theo sự thật: không mệt = câu phủ định → **No, I'm not.** Yes luôn đi với khẳng định." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Nghe ─────────────────────────── */

const T2D19_LISTENING: Lesson = {
  id: "t2d19-nghe",
  kind: "listening",
  title: "Listening Part 4 — Note · Sentence completion · Short answer (giọng Úc)",
  goal: "Làm trọn một Part 4 (bài giảng một người nói, 10 câu, không nghỉ giữa) với ba dạng điền: ghi chú, hoàn thành câu, trả lời ngắn — đúng giới hạn số từ, chuyển đáp án đúng chính tả trong 2 phút kiểm, và nhận ra đặc điểm giọng Úc (Listening band 5: Part 4 ≥ 4/10).",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Part 4** = một bài giảng học thuật (lecture), **một người nói**, khoảng 4–5 phút, **10 câu (31–40)**, phát **một lần, không nghỉ giữa**.",
        "Ba dạng hôm nay: **Note completion** (ghi chú) · **Sentence completion** (hoàn thành câu — câu điền xong phải ĐÚNG NGỮ PHÁP) · **Short-answer questions** (trả lời câu hỏi bằng vài từ).",
        "Giới hạn từ đọc từng chữ: **ONE WORD ONLY** · **NO MORE THAN TWO WORDS** · **NO MORE THAN TWO WORDS AND/OR A NUMBER** — viết thừa một từ là SAI cả câu.",
        "**Chuyển đáp án**: thi giấy có **10 phút** cuối; thi máy gõ thẳng và chỉ có **2 phút** kiểm — phải soát **chính tả, số ít/số nhiều** ngay khi nghe.",
        "**Giọng Úc** (Australian English): day nghe như “die”, /r/ cuối không đọc, câu kể hay lên giọng cuối câu. Band 5 cần Listening ≥ 16/40 — Part 4 khó nhất, mục tiêu hôm nay **≥ 4/10**, rồi tăng dần.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Part 4 khác Part 1–3 ở đâu?" },
    {
      t: "table",
      caption: "Vị trí của Part 4 trong bài Listening (đã học Tập 1 Ngày 13 — nhắc lại để thấy độ khó tăng)",
      head: ["Part", "Ai nói", "Bối cảnh", "Độ khó"],
      rows: [
        ["1", "2 người", "Đời sống: đặt chỗ, đăng ký", "Dễ nhất — số, tên, ngày"],
        ["2", "1 người", "Đời sống: hướng dẫn, giới thiệu địa điểm", "Bản đồ, trắc nghiệm"],
        ["3", "2–4 người", "Học thuật: sinh viên thảo luận với giảng viên", "Ý kiến, đồng ý / phản đối"],
        ["**4**", "**1 người**", "**Học thuật: bài giảng**", "**Khó nhất** — từ học thuật, không có ai ngắt lời, không nghỉ giữa"],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: ba điều làm Part 4 “dễ chịu” hơn Part 3",
      items: [
        "**Câu hỏi đi đúng thứ tự** bài giảng — và bài giảng **có dàn ý**: giảng viên luôn báo “First…, Now let's turn to…, Finally…”. Tiêu đề trong phiếu ghi chú chính là dàn ý đó.",
        "**Đáp án gần như luôn là danh từ hoặc số**, và thường là **một từ khoá** người giảng nhấn mạnh hoặc nhắc lại, đôi khi **đánh vần** (từ chuyên ngành).",
        "Chỉ có **một giọng** → không phải phân biệt ai nói gì như Part 3.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Ba dạng câu hỏi và giới hạn số từ" },
    {
      t: "sodo",
      kind: "compare",
      title: "Note completion · Sentence completion · Short answer",
      caption: "Cả ba đều là “điền từ nghe được”. Khác nhau ở chỗ chỗ trống nằm trong cái gì — và vì thế bạn kiểm tra đáp án bằng cách nào.",
      cols: [
        {
          title: "**Note completion** — ghi chú",
          anh: "memo",
          items: [
            "Dòng gạch đầu dòng, không cần câu đủ.",
            "Đoán loại từ từ chữ đứng trước/sau: **few natural ___** → danh từ số nhiều.",
            "Kiểm: đọc lại cả dòng có “hợp nghĩa” không.",
          ],
        },
        {
          title: "**Sentence completion** — hoàn thành câu",
          anh: "pencil",
          items: [
            "Câu đã viết sẵn, thiếu một đoạn.",
            "Câu điền xong phải **đúng ngữ pháp**: became ___ → tính từ.",
            "Kiểm: đọc to cả câu, sai ngữ pháp là sai đáp án.",
          ],
        },
        {
          title: "**Short answer** — trả lời ngắn",
          anh: "red-question-mark",
          items: [
            "Một câu hỏi Wh- đầy đủ.",
            "Từ để hỏi cho biết loại thông tin: **How many** → số · **Why** → lý do · **Where** → nơi chốn.",
            "Không viết lại cả câu, chỉ viết **cụm trả lời**.",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Đọc giới hạn số từ thế nào? (“a number” = viết bằng chữ số: 24, 1950, 100)",
      head: ["Lời dẫn trong đề", "Được viết", "Không được viết"],
      rows: [
        ["**ONE WORD ONLY**", "erosion · predators", "~~soil erosion~~ (2 từ) · ~~the predators~~ (2 từ)"],
        ["**ONE WORD AND/OR A NUMBER**", "1950 · predators · 3 hours", "~~three long hours~~"],
        ["**NO MORE THAN TWO WORDS**", "island · other side · the island", "~~the other side~~ (3 từ)"],
        ["**NO MORE THAN TWO WORDS AND/OR A NUMBER**", "24 · 100 kilometres · about 100 kilometres", "~~more than 100 kilometres~~ (3 từ + số)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: bốn cách mất điểm dù đã nghe đúng",
      items: [
        "**Thừa từ**: thêm a / the / some vào khi giới hạn là ONE WORD → sai cả câu. Mạo từ cũng tính là một từ.",
        "**Sai chính tả**: đáp án phải viết đúng từng chữ (bilby, erosion, resistant). Từ lạ thường **được đánh vần** trong bài — ghi lại từng chữ cái.",
        "**Sai số ít / số nhiều**: few natural **predators** (số nhiều) — bỏ -s là sai. Nhìn từ đứng trước chỗ trống: **few / many / several / a number of** → số nhiều.",
        "**Viết số bằng chữ dài dòng**: “twenty-four” vẫn đúng nhưng tốn thời gian và dễ sai chính tả — viết **24**. Từ gạch nối (twenty-four, well-known) tính là **một** từ.",
      ],
    },
    {
      t: "rule",
      formula: "Đọc giới hạn từ → đoán loại từ (N / adj / số) → nghe từ đồng nghĩa (paraphrase) → viết đúng chính tả + số ít/nhiều → đọc lại cả dòng.",
      vi: "Năm bước cho mỗi chỗ trống Part 4 — làm trong 45 giây đọc đề trước khi băng chạy.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Nhận ra giọng Úc (Australian English)" },
    {
      t: "p",
      text: "Đề IELTS dùng nhiều giọng: Anh, Mỹ, **Úc**, Canada, New Zealand. Tập 2 Ngày 15 đã nghe giọng Úc ở Part 1–2; hôm nay nhắc lại ở bài giảng dài. Giọng Úc trong đề là giọng **chuẩn, rõ** (không phải giọng vùng quê đặc sệt), nên chỉ cần quen **năm dấu hiệu** dưới đây là không bị “khựng” khi nghe. 🎧 Hai bài luyện bên dưới là bài giảng ở trường đại học Úc và được đọc bằng **giọng Úc** (giảng viên nam ở bài 1, giảng viên nữ ở bài 2) — vừa nghe vừa dò năm dấu hiệu trong bảng. Muốn quen tai hơn, nghe thêm bản tin ABC News Australia trên YouTube.",
    },
    {
      t: "table",
      caption: "Năm dấu hiệu giọng Úc — và từ nào dễ nghe nhầm",
      head: ["Dấu hiệu", "Ví dụ", "Dễ nghe nhầm thành"],
      rows: [
        ["Nguyên âm /eɪ/ mở rộng gần như /aɪ/", "**day, today, paper, mate**", "today ≈ “to die” · paper ≈ “piper”"],
        ["Nguyên âm /aɪ/ tròn môi hơn, gần “oi”", "**time, five, Friday**", "five ≈ “foive”"],
        ["Không đọc /r/ cuối âm tiết (giống Anh-Anh)", "**car, water, number**", "number ≈ “numbuh”"],
        ["/t/ giữa hai nguyên âm thành âm “đ” nhẹ (giống Mỹ)", "**water, city, little**", "city ≈ “ciddy”"],
        ["Câu kể **lên giọng ở cuối** (high rising terminal)", "So we went to the beach ↗", "tưởng là câu hỏi — thật ra người nói vẫn đang kể"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "uni", pos: "n (informal, Úc/Anh)", ipa: "/ˈjuːni/", vi: "trường đại học (nói tắt của university)", ex: "My brother is in his second year at uni in Melbourne.", exVi: "Anh tôi đang học năm hai đại học ở Melbourne.", more: "Người Úc rất hay rút ngắn từ: **arvo** (afternoon — buổi chiều), **brekkie** (breakfast), **footy** (bóng bầu dục kiểu Úc)." },
        { w: "native", pos: "adj", ipa: "/ˈneɪtɪv/", vi: "bản địa (sinh ra/sống tự nhiên ở một nơi)", ex: "The bilby is a small native animal of Australia.", exVi: "Bilby là một loài thú nhỏ bản địa của Úc.", more: "**native species / native plants** · trái nghĩa trong bài giảng: **introduced species** (loài du nhập)." },
        { w: "release", pos: "v", ipa: "/rɪˈliːs/", vi: "thả ra; phát hành", ex: "Twenty-four rabbits were released on a farm in 1859.", exVi: "Hai mươi bốn con thỏ đã được thả ra ở một trang trại năm 1859.", more: "**release animals into the wild** · **release a film / an album** (phát hành)." },
        { w: "predator", pos: "n", ipa: "/ˈpredətə(r)/", vi: "động vật săn mồi, thiên địch", ex: "Rabbits had few natural predators in Australia.", exVi: "Ở Úc, thỏ có rất ít thiên địch tự nhiên.", more: "**natural predator** · đối lập **prey** /preɪ/ (con mồi)." },
        { w: "erosion", pos: "n", ipa: "/ɪˈrəʊʒn/", vi: "sự xói mòn", ex: "Without plants, the soil is lost through erosion.", exVi: "Không có cây, đất bị mất đi do xói mòn.", more: "**soil erosion** · động từ **erode** /ɪˈrəʊd/." },
        { w: "resistant", pos: "adj", ipa: "/rɪˈzɪstənt/", vi: "có khả năng kháng lại, chống chịu", ex: "After a few years, the rabbits became resistant to the virus.", exVi: "Sau vài năm, thỏ trở nên kháng lại loại virus đó.", more: "**resistant to** + N · danh từ **resistance** · **heat-resistant**, **water-resistant**." },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Chiến thuật một lần nghe: đọc trước · bám tín hiệu · bỏ câu lỡ · chuyển đáp án" },
    {
      t: "sodo",
      kind: "flow",
      title: "Một Part 4 từ lúc mở đề đến lúc nộp",
      caption: "Thi giấy: 10 phút cuối chép sang phiếu trả lời. Thi máy: gõ thẳng vào ô khi nghe; cuối bài chỉ có 2 phút để kiểm.",
      steps: [
        { label: "45 giây đọc đề", sub: "Gạch chân tiêu đề + từ khoá; đánh dấu loại từ (N / adj / số) cạnh từng ô." },
        { label: "Nghe lời mở đầu", sub: "Giảng viên nói luôn dàn ý: “I'll talk about three…” → khớp với tiêu đề phiếu." },
        { label: "Bám từ tín hiệu", sub: "First… · However… · Now let's turn to… · The main reason… · Finally… — đáp án đứng ngay sau." },
        { label: "Lỡ một câu → BỎ", sub: "Đoán nhanh một từ hợp loại, nhảy sang câu sau. Đuổi theo câu lỡ là mất thêm 2–3 câu." },
        { label: "2 phút kiểm (máy) / 10 phút chép (giấy)", sub: "Chính tả · số ít/nhiều · đúng giới hạn từ · không để ô trống (sai không bị trừ điểm)." },
      ],
    },
    {
      t: "note",
      title: "Mẹo chuyển đáp án — thi máy và thi giấy",
      items: [
        "**Thi máy**: gõ ngay khi nghe; nếu chưa chắc chính tả, gõ tạm rồi sửa trong 2 phút cuối. Không có 10 phút chép như bản giấy.",
        "**Thi giấy**: ghi tạm lên đề, cuối bài có **10 phút** chép sang phiếu — viết HOA toàn bộ đáp án (chữ in hoa) giúp giám khảo không đọc nhầm chữ của bạn.",
        "**Không bỏ trống**: sai không bị trừ điểm. Câu lỡ thì điền một từ hợp loại từ — có khi trúng.",
        "Viết hoa / viết thường **không** ảnh hưởng điểm; **chính tả** thì có.",
      ],
    },
    {
      t: "table",
      caption: "Đoán CÓ CƠ SỞ cho câu đã lỡ (làm trong 2 phút kiểm) — đoán theo loại ô, không đoán bừa",
      head: ["Ô trống hỏi gì", "Đoán hợp lý nhất", "Vì sao"],
      rows: [
        ["Thanh toán: “Payment by ___”", "**card**", "Đề hiện đại gần như luôn trả bằng thẻ; cash hay bị nhắc rồi gạt đi"],
        ["Phương tiện: “Travel to the site by ___”", "**bus** / **train**", "Đọc cả phiếu: có “station” ⇒ train; có “stop” ⇒ bus"],
        ["Ngày trong tuần / tháng", "chọn ngày **chưa** xuất hiện ở ô khác", "Một phiếu ít khi lặp cùng một ngày cho hai việc"],
        ["Số nhiều sau “some / many / several / a number of”", "danh từ **thêm -s** hợp chủ đề", "Ngữ pháp loại sẵn mọi từ số ít"],
        ["Part 4 bài giảng: “the main cause was ___”", "một danh từ **đã nghe trong bài** (lặp lại nhiều lần)", "Giảng viên hay nhắc lại từ khoá chính của bài"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: kiểm từ đoán bằng hai phép thử",
      items: [
        "**Ngữ pháp**: đặt từ vào ô rồi đọc cả câu — “a ___” cần danh từ số ít đếm được; “they ___ the samples” cần động từ; “very ___” cần tính từ. Sai loại từ là chắc chắn sai.",
        "**Giới hạn từ**: ONE WORD ONLY ⇒ loại ngay mọi cụm hai từ, kể cả cụm bạn nghe được (~~credit card~~ → **card**). Viết quá số từ thì **đúng ý vẫn mất điểm**.",
        "Đoán xong thì **thôi**, đừng quay lại sửa đi sửa lại — lần đoán đầu (dựa trên ngữ cảnh) thường hợp lý nhất.",
      ],
    },
    {
      t: "mcq",
      id: "t2d19-nghe-doan",
      title: "Lỡ câu này — đoán gì? (4 câu)",
      items: [
        { q: "Phiếu: “Payment: by ___” · ONE WORD ONLY. Bạn chỉ kịp nghe “…we don't take cash any more…”.", options: ["credit card", "card", "money"], correct: 1, why: "“no cash” ⇒ thẻ. **credit card** = 2 từ, vượt ONE WORD ⇒ sai dù đúng ý. **money** quá chung, không phải hình thức thanh toán." },
        { q: "Bài giảng: “Farmers released several ___ to control the insects.” · ONE WORD ONLY. Bạn lỡ mất từ.", options: ["bird", "birds", "chemical"], correct: 1, why: "**several** + danh từ **số nhiều** ⇒ birds. “bird” sai số; “chemical” là tính từ / danh từ số ít, và “release chemical” không hợp “several”." },
        { q: "Phiếu: “Meeting day: ___” · Các ô khác đã có Monday (lớp học) và Friday (nộp bài). Bạn lỡ câu này.", options: ["Monday", "Wednesday", "Friday"], correct: 1, why: "Không có thông tin ⇒ chọn một ngày **chưa dùng** ở ô khác. Đây chỉ là đoán — nhưng đoán có cơ sở vẫn hơn để trống (bỏ trống chắc chắn 0 điểm)." },
        { q: "Note: “The scientists ___ the water every morning.” · ONE WORD ONLY.", options: ["test", "tests", "testing"], correct: 0, why: "Sau chủ ngữ số nhiều **The scientists** ở hiện tại ⇒ động từ **nguyên mẫu không -s**. “tests” sai hoà hợp chủ–vị, “testing” thiếu “are”." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Practice 1 — Questions 31–40: Rabbits in Australia" },
    {
      t: "canh",
      anh: ["rabbit", "kangaroo", "farmer", "microscope"],
      caption: "Một giảng viên sinh thái học ở một trường đại học Úc kể lại vì sao thỏ — một loài vật nhỏ, dễ thương — lại trở thành “kẻ phá hoại” lớn nhất của nước Úc, và con người đã chống lại chúng thế nào.",
    },
    {
      t: "p",
      text: "Đọc **toàn bộ** ba phần câu hỏi trong 45 giây (để ý giới hạn từ **khác nhau** ở mỗi phần). Nghe **một lần**, rồi điền.",
    },
    {
      t: "table",
      caption: "Questions 31–33 — Answer the questions below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      head: ["Câu", "Câu hỏi"],
      rows: [
        ["31", "How many rabbits did Thomas Austin release in 1859?"],
        ["32", "Why did Austin want the rabbits?"],
        ["33", "How far did the rabbits spread each year?"],
      ],
    },
    {
      t: "table",
      caption: "Questions 34–37 — Complete the notes below. Write ONE WORD ONLY for each answer.",
      head: ["Phần", "Ghi chú"],
      rows: [
        ["Why rabbits spread so fast", "• **(34) ______** winters, so they could breed all year · • few natural **(35) ______**"],
        ["Damage", "• ate crops and native plants · • caused soil **(36) ______** · • took food from native animals, e.g. the **(37) ______**"],
      ],
    },
    {
      t: "table",
      caption: "Questions 38–40 — Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
      head: ["Câu", "Câu cần hoàn thành"],
      rows: [
        ["38", "The fence failed because some rabbits were already on the ______ when it was completed."],
        ["39", "After a few years, the rabbits became ______ to myxomatosis."],
        ["40", "The second virus escaped from an ______ where it was being tested."],
      ],
    },
    {
      t: "listen",
      id: "t2d19-nghe-bai-1",
      title: "Rabbits in Australia",
      dan: { so: "Day 19, Practice 1", boiCanh: "part of a lecture in an Australian university about rabbits as an introduced species.", cau: [31, 40] },
      note: "Khoảng 5 phút, một người nói, không nghỉ giữa. (Giảng viên nam, giọng Úc — dò năm dấu hiệu ở mục 3.)",
      lines: [
        { who: "Lecturer", voice: "au-nam", text: "Good morning, everyone. In today's lecture on introduced species, I'm going to talk about an animal that most of you probably think of as small and harmless: the rabbit. In fact, rabbits have caused more damage to the Australian environment than almost any other animal. I'll start with how they arrived, then look at the damage they caused, and finally, I'll describe the methods that have been used to control them.", vi: "Chào buổi sáng mọi người. Trong bài giảng hôm nay về các loài du nhập, tôi sẽ nói về một con vật mà hầu hết các bạn có lẽ nghĩ là nhỏ bé và vô hại: con thỏ. Thực tế, thỏ đã gây hại cho môi trường Úc nhiều hơn gần như bất kỳ loài vật nào khác. Tôi sẽ bắt đầu bằng việc chúng đến đây thế nào, sau đó xem chúng gây ra thiệt hại gì, và cuối cùng mô tả các cách đã được dùng để kiểm soát chúng." },
        { who: "Lecturer", voice: "au-nam", text: "Rabbits actually came to Australia with the first European ships, but those early rabbits were kept in cages for food and didn't spread. The real problem began in 1859, when a farmer called Thomas Austin, who lived near Geelong in Victoria, released twenty-four rabbits, sent from England by his brother, on his land. Austin had grown up in England, and he wanted the rabbits for hunting, which was a popular sport there. He reportedly said that a few rabbits could do little harm.", vi: "Thật ra thỏ đã đến Úc cùng những con tàu châu Âu đầu tiên, nhưng những con thỏ ban đầu ấy bị nhốt trong chuồng để làm thức ăn và không lan ra. Vấn đề thật sự bắt đầu năm 1859, khi một nông dân tên Thomas Austin, sống gần Geelong ở bang Victoria, thả hai mươi bốn con thỏ, do anh trai gửi từ Anh sang, trên đất của mình. Austin lớn lên ở Anh, và ông muốn có thỏ để săn bắn, một môn thể thao phổ biến ở đó. Người ta kể rằng ông nói vài con thỏ thì chẳng gây hại được bao nhiêu." },
        { who: "Lecturer", voice: "au-nam", text: "He was very wrong. Within ten years, there were millions of rabbits in Victoria, and they kept moving north and west. Researchers estimate that they spread across the country at about a hundred kilometres a year — the fastest spread of any mammal ever recorded.", vi: "Ông đã sai hoàn toàn. Trong vòng mười năm, ở Victoria đã có hàng triệu con thỏ, và chúng tiếp tục tiến lên phía bắc và phía tây. Các nhà nghiên cứu ước tính chúng lan khắp đất nước với tốc độ khoảng một trăm cây số mỗi năm — tốc độ lan nhanh nhất từng được ghi nhận ở một loài thú." },
        { who: "Lecturer", voice: "au-nam", text: "So why did they spread so quickly? The summers in southern Australia are hot, of course, but that wasn't the key factor. What mattered was that the winters are mild, so rabbits could breed almost all year round, instead of mainly in the warmer months, as they do in much of Europe. A female rabbit can have up to forty babies in a single year. The second reason is that rabbits had few natural predators here. In Europe, foxes, wild cats and large birds kill huge numbers of them, but in Australia there was almost nothing to stop them.", vi: "Vậy vì sao chúng lan nhanh như thế? Dĩ nhiên mùa hè ở miền nam nước Úc rất nóng, nhưng đó không phải yếu tố then chốt. Điều quan trọng là mùa đông ở đây ôn hoà, nên thỏ có thể sinh sản gần như quanh năm, thay vì chủ yếu vào những tháng ấm như ở phần lớn châu Âu. Một con thỏ cái có thể đẻ tới bốn mươi con trong một năm. Lý do thứ hai là ở đây thỏ có rất ít kẻ săn mồi tự nhiên. Ở châu Âu, cáo, mèo hoang và chim lớn giết rất nhiều thỏ, nhưng ở Úc gần như chẳng có gì ngăn được chúng." },
        { who: "Lecturer", voice: "au-nam", text: "Now, let's look at the damage. Rabbits eat crops, of course, which made them a disaster for farmers. But the damage to the natural environment was even worse. They eat young native plants before the plants can grow, and when the plants disappear, the soil has nothing to hold it in place. Wind and rain then carry it away, so the result is soil erosion on a massive scale. Rabbits also compete for food with native animals. It isn't the kangaroos that suffer most — they're doing fine — but small animals such as the bilby. That's B-I-L-B-Y. The bilby has disappeared from most of the areas where it once lived.", vi: "Giờ ta xem thiệt hại. Dĩ nhiên thỏ ăn hoa màu, nên chúng là thảm hoạ cho nông dân. Nhưng thiệt hại với môi trường tự nhiên còn tệ hơn. Chúng ăn cây non bản địa trước khi cây kịp lớn, và khi cây biến mất thì đất không còn gì giữ lại. Gió và mưa cuốn đất đi, kết quả là xói mòn đất trên diện rộng. Thỏ còn tranh thức ăn với các loài vật bản địa. Chịu thiệt nhiều nhất không phải chuột túi — chúng vẫn ổn — mà là những loài nhỏ như bilby. Đánh vần là B-I-L-B-Y. Bilby đã biến mất khỏi phần lớn những vùng nó từng sống." },
        { who: "Lecturer", voice: "au-nam", text: "Finally, how have Australians tried to control rabbits? One of the first ideas was a fence. In Western Australia, the government built a fence more than one thousand eight hundred kilometres long, and it was completed in 1907. Unfortunately, it was a failure. By the time it was finished, some rabbits were already on the other side, so the fence simply couldn't stop them.", vi: "Cuối cùng, người Úc đã cố kiểm soát thỏ thế nào? Một trong những ý tưởng đầu tiên là hàng rào. Ở Tây Úc, chính quyền xây một hàng rào dài hơn một nghìn tám trăm cây số, hoàn thành năm 1907. Đáng tiếc là nó thất bại. Lúc hàng rào xây xong thì một số con thỏ đã ở bên kia rồi, nên hàng rào đơn giản là không ngăn được chúng." },
        { who: "Lecturer", voice: "au-nam", text: "Biological control was far more successful, at least at first. In 1950, scientists released a virus that causes a disease called myxomatosis — I'll put the spelling on the slide. It spread through mosquitoes and killed more than ninety per cent of the rabbits in some areas. But the survivors passed on their natural protection, and after a few years, the rabbits became resistant to the virus. In the 1990s, a second virus was tested on an island off the coast of South Australia, so that it couldn't reach the mainland by accident. However, in 1995 it escaped from the island, probably carried by insects, and spread across the country.", vi: "Kiểm soát sinh học thành công hơn nhiều, ít nhất là lúc đầu. Năm 1950, các nhà khoa học thả một loại virus gây ra căn bệnh tên là myxomatosis — tôi sẽ để cách viết trên slide. Nó lây qua muỗi và giết hơn chín mươi phần trăm số thỏ ở một số vùng. Nhưng những con sống sót truyền lại khả năng tự bảo vệ, và sau vài năm, thỏ trở nên kháng lại loại virus này. Vào những năm 1990, loại virus thứ hai được thử nghiệm trên một hòn đảo ngoài khơi Nam Úc để nó không vô tình lan vào đất liền. Tuy nhiên, năm 1995 nó thoát khỏi hòn đảo, có lẽ do côn trùng mang theo, và lan ra khắp nước." },
        { who: "Lecturer", voice: "au-nam", text: "Today, there are still around two hundred million rabbits in Australia. Most scientists now agree that no single method will ever be enough. Viruses work best when they are combined with destroying the rabbits' underground homes, which are called warrens. In our next lecture, we'll look at another introduced species: the cane toad.", vi: "Ngày nay, ở Úc vẫn còn khoảng hai trăm triệu con thỏ. Hầu hết các nhà khoa học hiện đồng ý rằng không một biện pháp đơn lẻ nào là đủ. Virus hiệu quả nhất khi kết hợp với việc phá các hang ngầm của thỏ, gọi là warren. Trong bài giảng tới, chúng ta sẽ tìm hiểu một loài du nhập khác: cóc mía." },
      ],
    },
    {
      t: "quiz",
      id: "t2d19-nghe-p1",
      title: "Questions 31–40 — điền đáp án (giới hạn từ khác nhau ở mỗi phần)",
      kind: "fill",
      items: [
        { q: "(31) How many rabbits did Thomas Austin release in 1859? (TWO WORDS AND/OR A NUMBER)", answers: ["24", "twenty-four", "twenty four", "24 rabbits", "twenty-four rabbits"], hint: "How many → một con số" },
        { q: "(32) Why did Austin want the rabbits? (TWO WORDS AND/OR A NUMBER)", answers: ["for hunting", "hunting"], hint: "Why → lý do / mục đích (for + N)" },
        { q: "(33) How far did the rabbits spread each year? (TWO WORDS AND/OR A NUMBER)", answers: ["100 kilometres", "about 100 kilometres", "100 km", "about 100 km", "100 kilometers", "about 100 kilometers", "100km", "about 100km", "a hundred kilometres", "one hundred kilometres"], hint: "How far → số + đơn vị khoảng cách" },
        { q: "(34) ___ winters, so they could breed all year (ONE WORD)", answers: ["mild"], hint: "trước winters → tính từ" },
        { q: "(35) few natural ___ (ONE WORD)", answers: ["predators"], hint: "few + danh từ SỐ NHIỀU" },
        { q: "(36) caused soil ___ (ONE WORD)", answers: ["erosion"], hint: "soil + danh từ" },
        { q: "(37) took food from native animals, e.g. the ___ (ONE WORD)", answers: ["bilby"], hint: "tên một loài vật — có đánh vần" },
        { q: "(38) some rabbits were already on the ___ when it was completed (TWO WORDS)", answers: ["other side"], hint: "the + (tính từ) + danh từ — vị trí" },
        { q: "(39) the rabbits became ___ to myxomatosis (TWO WORDS)", answers: ["resistant"], hint: "became + tính từ; ___ to" },
        { q: "(40) The second virus escaped from an ___ where it was being tested (TWO WORDS)", answers: ["island"], hint: "an + danh từ bắt đầu bằng nguyên âm — một nơi" },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 31–35",
      items: [
        "**(31) 24** — “released **twenty-four** rabbits… on his land”. Viết **24** (một số) là gọn nhất. Bẫy: năm **1859** cũng là số, nhưng câu hỏi đã cho sẵn năm.",
        "**(32) (for) hunting** — “he wanted the rabbits **for hunting**”. Câu hỏi dùng chính động từ want; đáp án là cụm mục đích. ~~sport~~ không đủ: “hunting, which was a popular **sport**” — sport là lời giải thích thêm cho hunting.",
        "**(33) (about) 100 kilometres** — “at **about a hundred kilometres a year**”. Không viết ~~a hundred kilometres a year~~ (vượt giới hạn: 4 từ). Chấp nhận **100 km**.",
        "**(34) mild** — Bẫy “**hot**”: “The summers… are **hot**, of course, **but that wasn't the key factor**. What mattered was that **the winters are mild**.” Phiếu hỏi về **winters** → mild.",
        "**(35) predators** — “rabbits had **few natural predators** here”. Phải có **-s** (few + số nhiều). foxes, wild cats, large birds là **ví dụ** của predators — không phải đáp án.",
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 36–40",
      items: [
        "**(36) erosion** — “the result is **soil erosion** on a massive scale”. Phiếu đã in sẵn “soil”, nên chỉ điền **erosion** (ONE WORD).",
        "**(37) bilby** — Bẫy “**kangaroos**”: “**It isn't the kangaroos** that suffer most… **but** small animals **such as the bilby**”. Từ báo hiệu **such as** = e.g. trên phiếu. Giảng viên **đánh vần** B-I-L-B-Y → chép đúng từng chữ.",
        "**(38) other side** — “some rabbits were already **on the other side**”. Phiếu đã có **the** → chỉ điền 2 từ **other side**. Viết ~~the other side~~ thì câu thành “on the the other side” (và 3 từ).",
        "**(39) resistant** — “the rabbits **became resistant to** the virus”. Câu điền xong: became + **tính từ** + to → đúng ngữ pháp. ~~resistance~~ (danh từ) sai.",
        "**(40) island** — “it **escaped from the island**”. Phiếu viết “**an** ___” → từ bắt đầu bằng **nguyên âm** — một mẹo kiểm tra rất hay. Bẫy: **mainland** (đất liền) — nơi virus KHÔNG được phép tới.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Practice 2 — Questions 1–6: Why koalas sleep so much" },
    {
      t: "canh",
      anh: ["koala", "leaf-fluttering-in-wind", "sleeping-face", "teacher"],
      caption: "Bài giảng ngắn trong một khoá sinh học năm nhất: koala ngủ gần cả ngày — vì lười, hay vì món ăn duy nhất của chúng?",
    },
    {
      t: "p",
      text: "Bài ngắn hơn (khoảng 2 phút), hai dạng: **Sentence completion** (câu 1–3, **ONE WORD ONLY**) và **Short answer** (câu 4–6, **NO MORE THAN TWO WORDS AND/OR A NUMBER**). Lần này hãy thử **ghi chú tay trong lúc nghe** rồi mới điền vào ô, như thi giấy.",
    },
    {
      t: "table",
      caption: "Questions 1–6",
      head: ["Câu", "Đề"],
      rows: [
        ["1", "Koalas are often called bears, but they are actually ______."],
        ["2", "Eucalyptus leaves contain very few ______."],
        ["3", "Koalas need a long time to ______ the leaves."],
        ["4", "How many hours a day can a koala sleep?"],
        ["5", "Where do koalas get most of their water?"],
        ["6", "What is the greatest danger to koalas today?"],
      ],
    },
    {
      t: "listen",
      id: "t2d19-nghe-bai-2",
      title: "Why koalas sleep so much",
      dan: { so: "Day 19, Practice 2", boiCanh: "a short talk in a first-year biology course.", cau: [1, 6] },
      note: "Khoảng 2 phút. Giảng viên nữ, giọng Úc. Có thể nghe hai lần: lần một ghi chú, lần hai kiểm.",
      lines: [
        { who: "Lecturer", voice: "au-nu", text: "Today's animal is one that every tourist in Australia wants to see: the koala. People often call them koala bears, but that's a mistake. Koalas aren't bears at all. They're marsupials, which means the mother carries her baby in a pouch, just like a kangaroo.", vi: "Con vật hôm nay là loài mà mọi du khách đến Úc đều muốn xem: koala. Người ta hay gọi chúng là gấu koala, nhưng đó là nhầm lẫn. Koala hoàn toàn không phải gấu. Chúng là thú có túi, nghĩa là con mẹ mang con trong một cái túi, giống như chuột túi." },
        { who: "Lecturer", voice: "au-nu", text: "The thing most visitors notice is that koalas hardly ever seem to be awake. Many people assume they're simply lazy, but the real explanation is their diet. Koalas eat almost nothing except eucalyptus leaves, and these leaves contain very few nutrients. They're also full of fibre and natural poisons, so koalas need a long time to digest them. Sleeping saves energy while their stomachs do the hard work — in fact, a koala can sleep for up to twenty hours a day.", vi: "Điều hầu hết du khách để ý là koala dường như gần như chẳng bao giờ thức. Nhiều người cho rằng chúng chỉ lười, nhưng lời giải thích thật là chế độ ăn. Koala gần như chỉ ăn lá bạch đàn, mà những lá này chứa rất ít chất dinh dưỡng. Chúng còn nhiều chất xơ và chất độc tự nhiên, nên koala cần rất lâu để tiêu hoá. Ngủ giúp tiết kiệm năng lượng trong khi dạ dày làm việc nặng — thực tế, một con koala có thể ngủ tới hai mươi tiếng mỗi ngày." },
        { who: "Lecturer", voice: "au-nu", text: "Interestingly, koalas rarely drink. The name koala is often said to mean 'no drink' in an Aboriginal language, although experts disagree about that. What we do know is that koalas get most of their water from the leaves they eat, and they only come down to drink during very hot, dry weather.", vi: "Điều thú vị là koala hiếm khi uống nước. Cái tên koala hay được cho là có nghĩa “không uống” trong một ngôn ngữ thổ dân, dù các chuyên gia không thống nhất về điều đó. Điều ta biết chắc là koala lấy phần lớn nước từ lá chúng ăn, và chỉ xuống đất uống nước khi trời rất nóng và khô." },
        { who: "Lecturer", voice: "au-nu", text: "Sadly, koala numbers have fallen in many areas. Disease and bushfires are serious problems, but the greatest danger today is habitat loss, as forests are cleared for farms, roads and houses. Without trees, koalas have nowhere to live and nothing to eat.", vi: "Đáng buồn là số lượng koala đã giảm ở nhiều vùng. Bệnh tật và cháy rừng là những vấn đề nghiêm trọng, nhưng mối nguy lớn nhất hiện nay là mất môi trường sống, khi rừng bị phá để làm trang trại, đường sá và nhà cửa. Không có cây, koala chẳng còn chỗ sống và chẳng có gì để ăn." },
      ],
    },
    {
      t: "quiz",
      id: "t2d19-nghe-p2",
      title: "Questions 1–6",
      kind: "fill",
      items: [
        { q: "(1) Koalas are often called bears, but they are actually ___ (ONE WORD)", answers: ["marsupials"], hint: "danh từ số nhiều — một nhóm động vật" },
        { q: "(2) Eucalyptus leaves contain very few ___ (ONE WORD)", answers: ["nutrients"], hint: "very few + danh từ số nhiều" },
        { q: "(3) Koalas need a long time to ___ the leaves (ONE WORD)", answers: ["digest"], hint: "to + động từ nguyên mẫu" },
        { q: "(4) How many hours a day can a koala sleep? (TWO WORDS AND/OR A NUMBER)", answers: ["20", "twenty", "up to 20", "20 hours", "twenty hours"], hint: "số giờ" },
        { q: "(5) Where do koalas get most of their water? (TWO WORDS AND/OR A NUMBER)", answers: ["from leaves", "leaves", "the leaves", "eucalyptus leaves"], hint: "Where … get → từ đâu" },
        { q: "(6) What is the greatest danger to koalas today? (TWO WORDS AND/OR A NUMBER)", answers: ["habitat loss"], hint: "danger → danh từ / cụm danh từ" },
      ],
    },
    {
      t: "note",
      title: "Giải thích Practice 2",
      items: [
        "**(1) marsupials** — “They're **marsupials**”. Chính tả: mar-**su**-pi-als. Số nhiều vì chủ ngữ “they”.",
        "**(2) nutrients** — “these leaves contain **very few nutrients**”. Bẫy: **fibre** (xơ) và **poisons** — lá chứa NHIỀU hai thứ này (“full of”), không phải “very few”.",
        "**(3) digest** — “koalas need a long time **to digest** them” — câu đề paraphrase gần như nguyên văn; sau **to** cần động từ nguyên mẫu.",
        "**(4) 20 / up to 20** — “sleep for **up to twenty hours** a day”. **up to 20** = 2 từ + số, hợp lệ.",
        "**(5) (from the) leaves** — “get most of their water **from the leaves they eat**”. **from the leaves** = 3 từ → vượt giới hạn; viết **from leaves** hoặc **leaves** hoặc **eucalyptus leaves**. Đây là chỗ giới hạn từ thường đánh rơi điểm.",
        "**(6) habitat loss** — “Disease and bushfires are serious problems, **but the greatest danger today is habitat loss**”. Bẫy kinh điển “A và B nghiêm trọng, **nhưng**… mới là lớn nhất”.",
      ],
    },
    {
      t: "mcq",
      id: "t2d19-nghe-gioi-han",
      title: "Kiểm tra: đáp án nào HỢP LỆ với giới hạn từ? (5 câu)",
      items: [
        { q: "Giới hạn ONE WORD ONLY. Bạn nghe: “…caused serious soil erosion”. Ô trống: “caused soil ___”.", options: ["erosion", "serious erosion", "soil erosion"], correct: 0, why: "Chỉ một từ, và “soil” đã in sẵn → **erosion**." },
        { q: "Giới hạn NO MORE THAN TWO WORDS. Bạn nghe “Let's meet at the main entrance”. Câu: “Meet at the ___ at 9.”", options: ["main entrance", "the main entrance", "entrance hall"], correct: 0, why: "Câu đề đã in sẵn **the** → chỉ điền **main entrance** (2 từ). Viết “the main entrance” thì vừa thừa “the” vừa thành 3 từ. **entrance hall** không có trong bài nghe." },
        { q: "Giới hạn ONE WORD AND/OR A NUMBER. Bạn nghe “three thousand five hundred”. Cách viết nào AN TOÀN nhất?", options: ["three thousand five hundred", "3 thousand", "3,500"], correct: 2, why: "Viết bằng **chữ số 3,500** = một số → hợp lệ và không sợ sai chính tả." },
        { q: "Câu: “Few natural ___ live in the area.” Bạn nghe “predator”. Viết:", options: ["predator", "predators", "a predator"], correct: 1, why: "**Few** + danh từ **số nhiều** → predators. Người nói thường nói số nhiều; nếu bạn nghe thiếu -s thì ngữ pháp của câu đề giúp bạn sửa." },
        { q: "Câu: “The second virus escaped from an ___.” Từ nào CHẮC CHẮN sai về ngữ pháp?", options: ["island", "area", "laboratory"], correct: 2, why: "**an** chỉ đi với từ bắt đầu bằng **âm nguyên âm** — **laboratory** /ləˈbɒrətri/ bắt đầu bằng phụ âm → không thể là đáp án. Dùng mạo từ để loại trừ là mẹo rất nhanh." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T2D19_SPEAKING: Lesson = {
  id: "t2d19-noi",
  kind: "speaking",
  title: "Part 2: Describe an activity",
  goal: "Nói trọn 2 phút Part 2 về một hoạt động (thể thao, sở thích, việc làm để thư giãn): ghi chú 1 phút theo sơ đồ, dùng đúng thì (thói quen · lúc bắt đầu · kế hoạch), kể cách làm và giải thích vì sao thích; trả lời được câu Part 3 đi kèm — và đọc câu hỏi đúng ngữ điệu (FC + GRA + P band 5).",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Đề **“hoạt động”** (activity) là loại thứ 5 trong 6 loại thẻ Part 2 (đã có: người · nơi · đồ vật · sự kiện). Chuẩn bị **một** hoạt động thật của bạn là dùng được cho cả chục thẻ đề.",
        "Đề hoạt động trộn **ba thì**: hiện tại đơn (thói quen: I play twice a week) · quá khứ đơn (lúc bắt đầu: I started when…) · hiện tại hoàn thành (I've played it for three years).",
        "Khung 4 phần × ~30 giây: **giới thiệu → khi nào, ở đâu, với ai → làm như thế nào (kể 1 lần cụ thể) → vì sao thích (2 lý do)**.",
        "🔊 **Ngữ điệu câu hỏi**: Yes/No lên giọng ↗, Wh- xuống giọng ↘ — áp ngay khi bạn hỏi lại giám khảo hoặc kể lời thoại trong bài nói.",
        "Đẩy **FC** (nói đủ 2 phút, mạch rõ), **LR** (từ chủ đề cụ thể), **GRA** (đúng thì, có câu phức). Band 5 = Part 2 nói đủ 2 phút.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Thẻ đề “hoạt động” trông như thế nào?" },
    {
      t: "p",
      text: "Thẻ đề luôn có **một dòng chủ đề** + **ba gợi ý “You should say”** + **một dòng “and explain…”**. Với đề hoạt động, dòng “explain” gần như luôn hỏi **vì sao bạn thích / nó có ích gì** — đây là phần ăn điểm nhất, đừng để còn 5 giây mới nói tới.",
    },
    {
      t: "table",
      caption: "Một hoạt động chuẩn bị sẵn — dùng được cho nhiều thẻ đề (ví dụ: chơi cầu lông)",
      head: ["Thẻ đề có thể gặp", "Dùng cầu lông thế nào"],
      rows: [
        ["Describe an outdoor activity you enjoy", "Kể trọn: chơi ở công viên mỗi sáng"],
        ["Describe a sport you like playing / watching", "Kể chơi + xem giải đấu trên TV"],
        ["Describe something you do to stay healthy", "Nhấn phần lợi ích sức khoẻ"],
        ["Describe an activity you do with a family member", "Nhấn người chơi cùng (bố)"],
        ["Describe a hobby you started recently / as a child", "Nhấn lúc bắt đầu (quá khứ)"],
        ["Describe something you do to relax", "Nhấn cảm giác thư giãn sau giờ học / làm"],
      ],
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Bản đồ thì cho đề hoạt động",
      caption: "Mỗi gợi ý trên thẻ gần như gắn với một thì. Dùng đủ ba thì là cách tự nhiên nhất để giám khảo thấy “range” ngữ pháp.",
      marks: [
        { from: -7, label: "**started** (quá khứ đơn) — I **started** playing when I was in Grade 10.", kieu: "diem", mau: 1 },
        { from: -7, to: 0, label: "**have played** (HTHT) — I**'ve played** it **for** three years / **since** 2023.", kieu: "doan", mau: 2 },
        { from: -3, to: 3, label: "**play** (hiện tại đơn) — I **play** it **twice a week**.", kieu: "lap", mau: 3 },
        { from: 5, label: "**I'd like to / I'm going to** — I**'m going to** join a club next year.", kieu: "diem", mau: 1 },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Khung 4 phần — mỗi phần khoảng 30 giây",
      steps: [
        { label: "1 · Giới thiệu (10–15″)", sub: "I'd like to talk about… / The activity I'm going to describe is… — nói luôn nó là gì nếu giám khảo có thể không biết." },
        { label: "2 · When · where · who (30″)", sub: "Thói quen (hiện tại đơn) + lúc bắt đầu (quá khứ) + đã bao lâu (HTHT)." },
        { label: "3 · How — kể MỘT lần cụ thể (40″)", sub: "“For example, last Sunday…” — câu chuyện nhỏ là cách dễ nhất để nói đủ giờ." },
        { label: "4 · Why — 2 lý do + cảm xúc (30″)", sub: "Firstly… / More importantly… / That's why… — kết bằng một câu cảm xúc hoặc dự định." },
      ],
    },
    {
      t: "rule",
      formula: "I'd like to talk about + V-ing / N. · I + V(s/es) + tần suất. · I started + V-ing + when… · I've + V3 + for / since… · What I enjoy most is (that)… · That's why…",
      vi: "Khung câu cho đề hoạt động: giới thiệu → thói quen → lúc bắt đầu → đã bao lâu → lý do.",
    },

    /* ── 2 ── */
    { t: "h", text: "2. Ghi chú 1 phút — thẻ đề 1" },
    {
      t: "p",
      text: "**Describe an outdoor activity you enjoy doing.** You should say: **what** the activity is · **when and where** you do it · **who** you do it with · and **explain why** you enjoy it. — Bấm giờ **1 phút**, viết **từ khoá tiếng Anh** (không viết câu) theo sơ đồ bên dưới.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú mẫu — cầu lông với bố",
      center: "**Badminton in the park**",
      branches: [
        { label: "What", items: ["badminton", "light, fast, cheap"], anh: "badminton" },
        { label: "When / Where", items: ["6 a.m., 4 mornings/week", "park near home", "started Grade 10 — 3 yrs"], anh: "sunrise" },
        { label: "Who", items: ["dad", "group of retired men"], anh: "old-man" },
        { label: "How — one time", items: ["last Sunday", "match vs dad's friends", "lost 2 sets → laughed"], anh: "trophy" },
        { label: "Why", items: ["fit, sleep better", "time with dad — talk", "clear head before school"], anh: "flexed-biceps" },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Bài nói mẫu — thẻ đề 1" },
    {
      t: "canh",
      anh: ["sunrise", "badminton", "old-man", "national-park"],
      caption: "Sáu giờ sáng ở công viên gần nhà: hai bố con đánh cầu lông cùng nhóm các bác đã nghỉ hưu, trước khi con đi học và bố đi làm.",
    },
    {
      t: "dialogue",
      title: "Part 2 — Describe an outdoor activity you enjoy doing (≈ 2 phút, khoảng 255 từ + câu chốt)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Now, I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Here's your topic: describe an outdoor activity you enjoy doing." },
        { who: "Candidate", role: "candidate", text: "I'd like to talk about playing badminton, which is probably the most popular outdoor sport in my neighbourhood. You only need two rackets and a shuttlecock, so it's cheap and easy for anyone to start.", vi: "Tôi muốn kể về chơi cầu lông, có lẽ là môn thể thao ngoài trời phổ biến nhất ở khu tôi ở. Chỉ cần hai cây vợt và một quả cầu, nên nó rẻ và ai cũng dễ bắt đầu." },
        { who: "Candidate", role: "candidate", text: "I play it with my dad in a small park near our house, usually four mornings a week, at around six o'clock, before it gets too hot. I started when I was in Grade 10, because my dad said I spent too much time in front of a screen. So I've played for about three years now. There's also a group of retired men who play there every morning, and they've become our regular opponents.", vi: "Tôi chơi với bố ở một công viên nhỏ gần nhà, thường bốn buổi sáng một tuần, vào khoảng sáu giờ, trước khi trời quá nóng. Tôi bắt đầu từ năm lớp 10, vì bố bảo tôi ngồi trước màn hình quá nhiều. Vậy là đến giờ tôi đã chơi khoảng ba năm. Ở đó còn có một nhóm các bác đã nghỉ hưu sáng nào cũng chơi, và họ thành đối thủ quen thuộc của chúng tôi." },
        { who: "Candidate", role: "candidate", text: "Let me give you an example. Last Sunday, my dad and I played a doubles match against two of those men. They're both over sixty and they hardly moved, but they still beat us in two sets! Everyone was laughing at the end, and one of them taught me a better way to hold my racket.", vi: "Để tôi kể một ví dụ. Chủ nhật vừa rồi, hai bố con tôi đánh đôi với hai bác trong nhóm đó. Cả hai đều ngoài sáu mươi, nhưng gần như chẳng phải di chuyển mà vẫn thắng chúng tôi hai ván! Cuối trận ai cũng cười, và một bác còn chỉ cho tôi cách cầm vợt tốt hơn." },
        { who: "Candidate", role: "candidate", text: "I enjoy it for a few reasons. Firstly, it keeps me fit. Since I started playing, I've lost about four kilos, and I sleep much better. But more importantly, it's the only time I really talk to my dad. He works long hours, and I'm busy with school, so those early mornings in the park are special for both of us. Finally, after an hour of running around, my head feels clear, and I can concentrate in class. That's why I'd never give it up, even when I go to university.", vi: "Tôi thích nó vì vài lý do. Thứ nhất, nó giúp tôi khoẻ. Từ khi bắt đầu chơi, tôi đã giảm khoảng bốn ký và ngủ ngon hơn nhiều. Nhưng quan trọng hơn, đó là lúc duy nhất tôi thật sự nói chuyện với bố. Bố làm việc nhiều giờ, tôi thì bận học, nên những buổi sáng sớm ở công viên là đặc biệt với cả hai. Cuối cùng, sau một tiếng chạy nhảy, đầu óc tôi tỉnh táo và tôi tập trung được trong lớp. Vì vậy tôi sẽ không bao giờ bỏ nó, kể cả khi lên đại học." },
        { who: "Examiner", role: "examiner", text: "Thank you. Do many young people in your country play badminton?" },
        { who: "Candidate", role: "candidate", text: "Yes, quite a lot, especially students, because you can play it almost anywhere — even in the street.", vi: "Có, khá nhiều, nhất là học sinh sinh viên, vì có thể chơi ở gần như bất cứ đâu — kể cả ngoài đường." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu đạt mức band 5–6 (theo 4 tiêu chí Speaking)",
      head: ["Tiêu chí", "Bài mẫu làm gì"],
      rows: [
        ["**Fluency & Coherence**", "Đi đủ 4 phần theo thứ tự thẻ; có câu chuyển rõ: **Let me give you an example** · **I enjoy it for a few reasons** · **Firstly… But more importantly… Finally… That's why…**"],
        ["**Lexical Resource**", "Từ chủ đề cụ thể: rackets, shuttlecock, doubles match, opponents, sets, keeps me fit, concentrate, give it up — không lặp “good / fun”."],
        ["**Grammatical Range & Accuracy**", "Ba thì đúng chỗ: **play / usually** (thói quen) · **started / beat / taught** (quá khứ) · **'ve played for / 've become / Since I started… I've lost** (HTHT). Câu phức: mệnh đề quan hệ **which is…**, **who play…**; **because / so / before / even when**."],
        ["**Pronunciation**", "Nhiều từ có âm cuối cần giữ: rackets /ts/, sets /ts/, kilos /z/; câu hỏi của giám khảo ở cuối là Yes/No → lên giọng."],
        ["**Trả lời đủ thẻ**", "what ✓ (badminton) · when & where ✓ (6 a.m., 4 mornings, park) · who ✓ (dad + retired men) · explain why ✓ (fit · time with dad · clear head)."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: lỗi người Việt hay mắc ở đề hoạt động",
      items: [
        "**play / go / do** dùng sai: ~~play yoga~~ → **do** yoga · ~~go to swim~~ → **go swimming** · ~~play jogging~~ → **go jogging**. (Ngày 20 học bảng đầy đủ.)",
        "**Lẫn thì**: “I start playing when I was 15” → I **started**… · “I play it since 2023” → I**'ve played** it since 2023.",
        "~~I very like badminton~~ → I **really** like / I **love** badminton. **very** không đứng trước động từ.",
        "**Dừng ở phút thứ nhất** vì “hết ý”: luôn chuẩn bị **một câu chuyện nhỏ** (phần 3) — đó là kho thời gian của bạn.",
        "Kể **quy tắc chơi** quá dài (luật cầu lông 6 câu) → giám khảo không chấm kiến thức thể thao; chỉ cần 1–2 câu “It's simple: you hit the shuttlecock over the net…”.",
      ],
    },
    {
      t: "table",
      caption: "Ngôn ngữ ăn điểm cho đề hoạt động",
      head: ["Muốn nói", "Câu mẫu"],
      rows: [
        ["Tần suất", "I play it **four mornings a week** / **every other day** / **whenever I have free time**."],
        ["Lúc bắt đầu", "I **took it up** when I was in Grade 10. / I **got into** it thanks to my dad."],
        ["Đã bao lâu", "I**'ve been doing** it **for** about three years. / I**'ve played** since 2023."],
        ["Cách làm", "**It's pretty simple:** you just… / **The hardest part is** …"],
        ["Kể một lần", "**Let me give you an example.** Last Sunday… / **I still remember the first time** I…"],
        ["Lý do", "**What I enjoy most is** that… / **It's a great way to** relax / stay fit / meet people."],
        ["Kết", "**That's why** I'd never give it up. / **I'm planning to** join a club next year."],
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Thẻ đề 2 — một hoạt động bạn MUỐN thử" },
    {
      t: "p",
      text: "**Describe an activity you would like to try in the future.** You should say: **what** it is · **where** you would do it · **who** you would do it with · and **explain why** you want to try it. — Đề này chuyển trọng tâm sang **tương lai** (would like to · I'm going to · I hope to — Tập 2 Ngày 7) và **giả định** (I would…).",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ghi chú mẫu — lặn biển ở Nha Trang",
      center: "**Scuba diving — Nha Trang**",
      branches: [
        { label: "What", items: ["scuba diving", "breathe underwater", "need a course"], anh: "tropical-fish" },
        { label: "Where", items: ["Nha Trang — clear water", "coral reefs"], anh: "coral" },
        { label: "Who", items: ["cousin — already diver", "maybe classmates"], anh: "people-hugging" },
        { label: "Why", items: ["videos of fish → amazing", "overcome fear of deep water", "learn about the ocean"], anh: "water-wave" },
      ],
    },
    {
      t: "dialogue",
      title: "Part 2 — Describe an activity you would like to try (bài mẫu ngắn, ≈ 1 phút 10)",
      lines: [
        { who: "Candidate", role: "candidate", text: "An activity I'd really like to try is scuba diving, which means swimming deep under the sea with a tank of air on your back.", vi: "Một hoạt động tôi rất muốn thử là lặn biển có bình dưỡng khí, tức là bơi sâu dưới biển với một bình khí trên lưng." },
        { who: "Candidate", role: "candidate", text: "I'd like to do it in Nha Trang, because the water there is clear and there are beautiful coral reefs not far from the beach. I'd go with my cousin, who already has a diving licence. She's promised to help me find a good course, which usually takes three or four days.", vi: "Tôi muốn lặn ở Nha Trang, vì nước ở đó trong và có những rạn san hô đẹp không xa bờ. Tôi sẽ đi với chị họ, người đã có bằng lặn. Chị ấy hứa sẽ giúp tôi tìm một khoá học tốt, thường mất ba hoặc bốn ngày." },
        { who: "Candidate", role: "candidate", text: "There are two reasons why I want to try it. The first is that I've watched so many videos of tropical fish and sea turtles that I want to see them with my own eyes. The second reason is a bit personal: I've always been afraid of deep water, and I think learning to dive properly would help me overcome that fear. I'm hoping to save enough money to do the course next summer.", vi: "Có hai lý do tôi muốn thử. Thứ nhất là tôi đã xem rất nhiều video về cá nhiệt đới và rùa biển đến mức muốn tận mắt thấy chúng. Lý do thứ hai hơi riêng tư: tôi luôn sợ nước sâu, và tôi nghĩ học lặn đúng cách sẽ giúp tôi vượt qua nỗi sợ đó. Tôi đang hy vọng để dành đủ tiền để học khoá này vào mùa hè tới." },
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: đề “muốn thử” vẫn cần một câu chuyện",
      items: [
        "Chưa làm thì kể **lý do bắt nguồn**: lần đầu thấy hoạt động đó ở đâu (video, chuyến đi, người quen) — đó là phần quá khứ của bài.",
        "Dùng **would** cho giả định (I would go with…), **I'm hoping to / I'm planning to** cho kế hoạch thật. Không viết ~~I will can dive~~ → I **will be able to** dive.",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Câu chốt Part 2 và Part 3 đi kèm" },
    {
      t: "p",
      text: "Sau 2 phút, giám khảo có thể hỏi **1–2 câu chốt ngắn** (rounding-off question) — trả lời 1–2 câu là đủ. Rồi sang **Part 3**: câu hỏi **chung, xã hội** về chủ đề hoạt động / giải trí. Ở Part 3 dùng công thức **Ý kiến → Lý do → Ví dụ** (Tập 2 Ngày 13).",
    },
    {
      t: "dialogue",
      title: "Part 3 — Leisure activities (hai câu mẫu)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Why do some people prefer indoor activities to outdoor ones?" },
        { who: "Candidate", role: "candidate", text: "I think the main reason is convenience. Indoor activities like going to the gym or playing video games don't depend on the weather, so people can do them at any time. In a hot city like Ho Chi Minh City, for example, it's hard to exercise outside at midday. Having said that, I believe outdoor activities are better for our mental health, because we get fresh air and sunlight.", vi: "Tôi nghĩ lý do chính là sự tiện lợi. Hoạt động trong nhà như đi gym hay chơi game không phụ thuộc thời tiết, nên người ta làm lúc nào cũng được. Ví dụ ở một thành phố nóng như TP.HCM, rất khó tập ngoài trời lúc giữa trưa. Dù vậy, tôi tin hoạt động ngoài trời tốt hơn cho sức khoẻ tinh thần, vì ta được hít thở không khí trong lành và có ánh nắng." },
        { who: "Examiner", role: "examiner", text: "Do you think people have less free time than in the past?" },
        { who: "Candidate", role: "candidate", text: "In some ways, yes. Many people work longer hours now, and even when they're at home, they keep checking work emails on their phones. My parents, for instance, often answer messages from their boss late at night. So even if people technically have free time, they don't really feel free.", vi: "Ở một số mặt thì có. Nhiều người bây giờ làm việc nhiều giờ hơn, và ngay cả khi ở nhà họ vẫn kiểm tra email công việc trên điện thoại. Ví dụ bố mẹ tôi thường trả lời tin nhắn của sếp lúc tối muộn. Nên dù về lý thuyết người ta có thời gian rảnh, họ không thật sự thấy thảnh thơi." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Thêm: ngữ điệu câu hỏi — Yes/No ↗ · Wh- ↘" },
    {
      t: "p",
      text: "**Intonation** (ngữ điệu) là giọng lên hay xuống ở cuối câu. Tiếng Việt dùng thanh điệu cho từng chữ; tiếng Anh dùng ngữ điệu cho **cả câu** để báo loại câu. Quy tắc cơ bản (đủ dùng cho band 5): **câu hỏi Yes/No lên giọng ↗** ở từ cuối · **câu hỏi Wh- xuống giọng ↘** · **câu hỏi đuôi**: xuống khi chỉ xác nhận, lên khi hỏi thật (mục 4 bài Ngữ pháp). Câu hỏi gián tiếp mở đầu bằng Could you… / Do you know… là Yes/No về hình thức → **thường lên giọng**.",
    },
    {
      t: "table",
      caption: "Nghe mẫu rồi đọc theo — mũi tên là hướng giọng ở từ cuối",
      head: ["Câu", "Ngữ điệu", "Vì sao"],
      rows: [
        ["Do you play badminton?", "↗ cuối câu", "Yes/No"],
        ["Where do you usually play?", "↘ cuối câu", "Wh-"],
        ["How often do you practise?", "↘", "Wh-"],
        ["Could you repeat the question, please?", "↗", "Yes/No lịch sự"],
        ["You enjoy sport, don't you?", "↘ (chỉ xác nhận)", "Câu hỏi đuôi — đã chắc"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: Wh- mà lên giọng là… ngạc nhiên",
      items: [
        "Người Việt hay **lên giọng ở mọi câu hỏi** vì nghĩ “câu hỏi thì lên giọng”. Wh- lên giọng ở cuối nghe như **đang ngạc nhiên / hỏi lại** (You went WHERE? ↗).",
        "Trong Part 2 / Part 3 khi bạn **kể lại câu hỏi** của ai đó (My dad asked me, “Why don't you try badminton?”) — đọc đúng ngữ điệu làm bài nói sinh động và cộng điểm **Pronunciation**.",
      ],
    },
    {
      t: "phatam",
      id: "t2d19-phat-am",
      title: "Luyện phát âm — ngữ điệu và dạng yếu trong câu hỏi",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Yes/No lên giọng ở từ cuối; Wh- xuống giọng. do / does / could / you đọc NHẸ (dạng yếu /də/, /dəz/, /kəd/, /ju/); từ mang nghĩa (play, often, start, court) đọc rõ.",
      items: [
        { text: "Do you play badminton?", ipa: "də ju pleɪ bædmɪntən", vi: "↗ Yes/No" },
        { text: "Is it far from here?", ipa: "ɪz ɪt fɑː frəm hɪə", vi: "↗ · from đọc yếu /frəm/" },
        { text: "Where do you usually play?", ipa: "weə də ju juːʒuəli pleɪ", vi: "↘ Wh-" },
        { text: "How often do you practise?", ipa: "haʊ ɒfn də ju præktɪs", vi: "↘ · often thường không đọc /t/" },
        { text: "What time does the class start?", ipa: "wɒt taɪm dəz ðə klɑːs stɑːt", vi: "↘ · does yếu /dəz/" },
        { text: "Could you repeat the question, please?", ipa: "kəd ju rɪpiːt ðə kwestʃən pliːz", vi: "↗ hỏi lịch sự" },
        { text: "Could you tell me where the court is?", ipa: "kəd ju tel mi weə ðə kɔːt ɪz", vi: "↗ · gián tiếp: the court is" },
        { text: "You enjoy sport, don't you?", ipa: "ju ɪndʒɔɪ spɔːt dəʊnt ju", vi: "↘ ở đuôi — xác nhận" },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Luyện nói" },
    {
      t: "p",
      text: "**Part 2:** đọc thẻ, bấm giờ **1 phút** ghi chú theo 5 nhánh (What · When/Where · Who · How — một lần cụ thể · Why), rồi ghi âm **2 phút**. Nghe lại và tự kiểm: có đủ **ba thì** (thói quen · lúc bắt đầu · đã bao lâu) không? Có **một câu chuyện** không? **Part 3:** mỗi câu 3–5 câu theo Ý kiến → Lý do → Ví dụ.",
    },
    {
      t: "speak",
      id: "t2d19-noi-p2",
      part: "2",
      questions: [
        "Describe an outdoor activity you enjoy doing. You should say: what the activity is; when and where you do it; who you do it with; and explain why you enjoy it.",
        "Describe an activity you would like to try in the future. You should say: what it is; where you would do it; who you would do it with; and explain why you want to try it.",
        "Describe something you do to relax after a busy day. You should say: what you do; when you started doing it; how often you do it; and explain how it helps you relax.",
      ],
    },
    {
      t: "speak",
      id: "t2d19-noi-p3",
      part: "3",
      questions: [
        "What kinds of activities are popular with young people in your country?",
        "Why do some people prefer indoor activities to outdoor ones?",
        "Do you think people have less free time than in the past?",
        "Should schools make sport compulsory for all students?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D19_HOMEWORK: Lesson = {
  id: "t2d19-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 19",
  goal: "Ôn trọn Ngày 19: đặt câu hỏi Yes/No và Wh- đúng trật tự, đổi sang câu hỏi gián tiếp, chọn câu hỏi đuôi đúng, nhớ giới hạn từ của Part 4 — và nói lại thẻ đề hoạt động.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (40 câu + 1 lượt ghi âm)",
      items: [
        "**I. Dịch Việt → Anh** (10 câu, có 💡): mọi loại câu hỏi.",
        "**II. Trắc nghiệm** (10 câu): câu hỏi, câu hỏi đuôi, giới hạn từ Part 4.",
        "**III. Điền câu hỏi đuôi** (8 câu).",
        "**IV. Viết lại thành câu hỏi gián tiếp** (6 câu). **V. Đặt câu hỏi cho phần in đậm** (6 câu).",
        "**VI. Nói**: ghi âm lại Part 2 thẻ đề 3 (“something you do to relax”).",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 19 trước khi làm bài",
      center: "**Ngày 19**",
      branches: [
        { label: "Câu hỏi", items: ["Yes/No: aux + S + V?", "Wh- + aux + S + V?", "hỏi chủ ngữ: Who won? (không did)"], anh: "red-question-mark" },
        { label: "Gián tiếp & đuôi", items: ["Could you tell me where it IS?", "if / whether cho Yes/No", "đuôi = đúng aux, đổi +/−"], anh: "speech-balloon" },
        { label: "Part 4", items: ["ONE WORD / TWO WORDS AND/OR A NUMBER", "số ít/nhiều · chính tả", "bẫy: but · however"], anh: "headphone" },
        { label: "Part 2 activity", items: ["3 thì: play · started · have played", "1 câu chuyện", "2 lý do + That's why"], anh: "badminton" },
      ],
    },

    { t: "h", text: "I. Dịch sang tiếng Anh (10 câu)" },
    {
      t: "quiz",
      id: "t2d19-bt-dich",
      title: "I. Dịch sang tiếng Anh — câu hỏi các loại (10 câu)",
      kind: "translate",
      grammar: "Aux + S + V? · Wh- + aux + S + V? · Who/What + V (hỏi chủ ngữ)? · Could you tell me / Do you know + wh- / if + S + V? · …, aux + n't + đại từ?",
      items: [
        { q: "Em gái bạn có học nhảy không?", hint: "Does, your sister, learn dancing / take dance classes", answers: ["Does your sister learn dancing?", "Does your sister learn to dance?", "Does your sister take dance classes?", "Does your sister study dancing?", "Does your younger sister learn dancing?", "Does your little sister learn dancing?", "Is your sister learning to dance?", "Does your sister take dance lessons?", "Does your sister take dancing lessons?", "Does your sister take dancing classes?"] },
        { q: "Tối qua bạn đã xem phim gì?", hint: "What film / What movie, did you watch, last night", answers: ["What film did you watch last night?", "What movie did you watch last night?", "Which film did you watch last night?", "Which movie did you watch last night?", "What film did you see last night?", "What movie did you see last night?"] },
        { q: "Ai đã phát minh ra bóng rổ?", hint: "hỏi chủ ngữ: Who + invented", answers: ["Who invented basketball?", "Who invented the game of basketball?"] },
        { q: "Bạn đã chơi đàn guitar được bao lâu rồi?", hint: "How long, have you played / have you been playing, the guitar", answers: ["How long have you played the guitar?", "How long have you been playing the guitar?", "How long have you played guitar?", "How long have you been playing guitar?"] },
        { q: "Bạn có thể cho tôi biết bảo tàng mở cửa lúc mấy giờ không?", hint: "Could you tell me, what time the museum opens", answers: ["Could you tell me what time the museum opens?", "Could you tell me when the museum opens?", "Can you tell me what time the museum opens?", "Can you tell me when the museum opens?"] },
        { q: "Bạn có biết vé đã được bán hết chưa không?", hint: "Do you know, if / whether, the tickets have sold out / have been sold out", answers: ["Do you know if the tickets have sold out?", "Do you know whether the tickets have sold out?", "Do you know if the tickets have been sold out?", "Do you know whether the tickets have been sold out?", "Do you know if the tickets are sold out?", "Do you know whether the tickets are sold out?", "Do you know if the tickets have already sold out?", "Do you know whether the tickets have already sold out?"] },
        { q: "Tôi tự hỏi vì sao anh ấy bỏ đội bóng.", hint: "I wonder, why he left / quit the team (dấu chấm cuối câu)", answers: ["I wonder why he left the team.", "I wonder why he quit the team.", "I wonder why he has left the team.", "I wonder why he has quit the team.", "I wonder why he left the football team.", "I wonder why he quit the football team."] },
        { q: "Trận đấu thật tuyệt, phải không?", hint: "The match was great, + wasn't it?", answers: ["The match was great, wasn't it?", "The game was great, wasn't it?", "The match was amazing, wasn't it?", "The match was fantastic, wasn't it?", "It was a great match, wasn't it?", "It was a great game, wasn't it?"] },
        { q: "Bạn chưa từng đến Đà Lạt, phải không?", hint: "You haven't been to Da Lat, + have you?", answers: ["You haven't been to Da Lat, have you?", "You have never been to Da Lat, have you?", "You've never been to Da Lat, have you?", "You haven't visited Da Lat, have you?", "You have not been to Da Lat, have you?", "You haven't been to Dalat, have you?", "You have never been to Dalat, have you?", "You haven't visited Dalat, have you?"] },
        { q: "Bao lâu bạn đi bơi một lần?", hint: "How often, do you go swimming", answers: ["How often do you go swimming?", "How often do you swim?"] },
      ],
    },

    { t: "h", text: "II. Trắc nghiệm (10 câu)" },
    {
      t: "mcq",
      id: "t2d19-bt-chon",
      title: "II. Chọn đáp án đúng (10 câu)",
      items: [
        { q: "___ they win the championship last year?", options: ["Did", "Do", "Were", "Have"], correct: 0, why: "Câu không có trợ động từ, có **last year** → mượn **Did**; win giữ nguyên mẫu." },
        { q: "What ___ your favourite sport when you were a child?", options: ["did", "was", "were", "does"], correct: 1, why: "Hỏi bằng to be (cái gì **là** môn ưa thích), chủ ngữ số ít (your favourite sport), quá khứ → **was**." },
        { q: "Who ___ you how to ride a bike?", options: ["did teach", "teach", "taught", "does teach"], correct: 2, why: "Hỏi **chủ ngữ** (ai dạy) → không mượn did, chia quá khứ: **taught**." },
        { q: "Can you tell me how much ___?", options: ["does the ticket cost", "the ticket costs", "costs the ticket", "is the ticket cost"], correct: 1, why: "Câu hỏi gián tiếp → thứ tự câu kể: **the ticket costs** (-s trở lại vì bỏ does)." },
        { q: "I'm not sure ___ the shop opens on Sundays.", options: ["does", "what", "which", "if"], correct: 3, why: "Câu gốc Yes/No (Does the shop open…?) → **if / whether**." },
        { q: "Let's watch the final together, ___?", options: ["shall we", "don't we", "will we", "aren't we"], correct: 0, why: "Let's… luôn đi với **shall we?**" },
        { q: "There aren't many people here, ___?", options: ["aren't there", "are they", "are there", "aren't they"], correct: 2, why: "There + phủ định → đuôi khẳng định giữ **there**: **are there?**" },
        { q: "She hardly ever misses a training session, ___?", options: ["does she", "doesn't she", "is she", "isn't she"], correct: 0, why: "**hardly ever** mang nghĩa phủ định → đuôi khẳng định; động từ thường hiện tại → **does she?**" },
        { q: "Part 4 — NO MORE THAN TWO WORDS. Bạn nghe “kept in a wooden box”. Ô trống: “stored in a ___”.", options: ["in wooden box", "wooden box", "a wooden box", "box wooden"], correct: 1, why: "Ô trống đã có **a** → chỉ điền **wooden box** (2 từ). Viết “a wooden box” là lặp mạo từ (a a wooden box) và thành 3 từ." },
        { q: "Part 4 — câu “The second reason is that rabbits had few natural ___.” Bạn nghe “…few natural predators”. Viết:", options: ["predator", "natural predators", "the predators", "predators"], correct: 3, why: "**few** + số nhiều; “natural” đã in sẵn → **predators**." },
      ],
    },

    { t: "h", text: "III. Điền câu hỏi đuôi (8 câu)" },
    {
      t: "quiz",
      id: "t2d19-bt-duoi",
      title: "III. Điền câu hỏi đuôi (8 câu) — viết cả trợ động từ và đại từ",
      kind: "fill",
      grammar: "Khẳng định → đuôi phủ định; phủ định → đuôi khẳng định; đúng trợ động từ; chủ ngữ → đại từ.",
      items: [
        { q: "Your parents like jazz, ___?", answers: ["don't they"], hint: "like (hiện tại, they) → do" },
        { q: "Minh has finished his homework, ___?", answers: ["hasn't he"], hint: "has + V3 → has" },
        { q: "The players weren't happy with the result, ___?", answers: ["were they"], hint: "weren't → were" },
        { q: "You'll come to my birthday party, ___?", answers: ["won't you"], hint: "'ll = will → won't" },
        { q: "Lan can't cook very well, ___?", answers: ["can she"], hint: "can't → can" },
        { q: "I'm in the right room, ___?", answers: ["aren't I", "am I not"], hint: "I am → đặc biệt" },
        { q: "Pass me the remote, ___?", answers: ["will you", "can you", "could you", "would you", "won't you"], hint: "câu mệnh lệnh / lời nhờ" },
        { q: "Everyone enjoyed the concert, ___?", answers: ["didn't they"], hint: "everyone → they; enjoyed → did" },
      ],
    },

    { t: "h", text: "IV. Viết lại thành câu hỏi gián tiếp (6 câu)" },
    {
      t: "quiz",
      id: "t2d19-bt-gian-tiep",
      title: "IV. Viết lại cả câu, bắt đầu bằng phần cho sẵn (6 câu)",
      kind: "fill",
      grammar: "Could you tell me / Do you know + wh- / if + S + V (thứ tự câu kể, bỏ do/does/did).",
      items: [
        { q: "Where is the nearest bus stop? → Could you tell me ___", answers: ["Could you tell me where the nearest bus stop is?", "where the nearest bus stop is?", "where the nearest bus stop is"], hint: "where + S + is" },
        { q: "When does the swimming pool close? → Do you know ___", answers: ["Do you know when the swimming pool closes?", "when the swimming pool closes?", "when the swimming pool closes"], hint: "bỏ does → closes" },
        { q: "Did the team practise yesterday? → Do you know ___", answers: ["Do you know if the team practised yesterday?", "Do you know whether the team practised yesterday?", "if the team practised yesterday?", "whether the team practised yesterday?", "if the team practised yesterday", "whether the team practised yesterday", "Do you know if the team practiced yesterday?", "Do you know whether the team practiced yesterday?", "if the team practiced yesterday", "whether the team practiced yesterday"] , hint: "Yes/No → if / whether; bỏ did → practised" },
        { q: "How many people are there in the club? → Can you tell me ___", answers: ["Can you tell me how many people there are in the club?", "how many people there are in the club?", "how many people there are in the club", "Can you tell me how many people are in the club?", "how many people are in the club"], hint: "how many people + there are" },
        { q: "Why did the concert start late? → I'd like to know ___", answers: ["I'd like to know why the concert started late.", "why the concert started late.", "why the concert started late", "I would like to know why the concert started late."], hint: "câu kể → dấu chấm; bỏ did → started" },
        { q: "Is this seat free? → Could you tell me ___", answers: ["Could you tell me if this seat is free?", "Could you tell me whether this seat is free?", "if this seat is free?", "whether this seat is free?", "if this seat is free", "whether this seat is free"], hint: "if / whether + this seat is" },
      ],
    },

    { t: "h", text: "V. Đặt câu hỏi cho phần in đậm (6 câu)" },
    {
      t: "quiz",
      id: "t2d19-bt-dat-cau-hoi",
      title: "V. Đặt câu hỏi Wh- để hỏi phần IN ĐẬM (6 câu)",
      kind: "fill",
      grammar: "Phần in đậm là tân ngữ / nơi chốn / thời gian… → Wh- + aux + S + V? · Phần in đậm là CHỦ NGỮ → Who / What + V?",
      items: [
        { q: "She goes jogging **three times a week**. → ___", answers: ["How often does she go jogging?", "How often does she jog?"], hint: "tần suất" },
        { q: "**My uncle** taught me chess. → ___", answers: ["Who taught you chess?", "Who taught you to play chess?", "Who taught you how to play chess?"], hint: "hỏi chủ ngữ" },
        { q: "They played **in the park near the river**. → ___", answers: ["Where did they play?"], hint: "nơi chốn, quá khứ" },
        { q: "The tickets cost **200,000 dong**. → ___", answers: ["How much did the tickets cost?", "How much do the tickets cost?", "How much are the tickets?", "How much were the tickets?"], hint: "giá" },
        { q: "He stopped playing football **because he hurt his knee**. → ___", answers: ["Why did he stop playing football?", "Why did he stop playing?"], hint: "lý do" },
        { q: "**The heavy rain** caused the delay. → ___", answers: ["What caused the delay?"], hint: "hỏi chủ ngữ (vật)" },
      ],
    },

    { t: "h", text: "VI. Nói — ghi âm lại Part 2" },
    {
      t: "p",
      text: "Ghi âm thẻ đề 3 bên dưới. Trước khi nói, viết ghi chú 1 phút theo **5 nhánh**. Sau khi nói, nghe lại và đếm: (1) đủ 2 phút? (2) có ít nhất một câu **I've … for / since**? (3) có **một câu chuyện cụ thể**? (4) kết bằng **That's why…**?",
    },
    {
      t: "speak",
      id: "t2d19-bt-noi",
      part: "2",
      questions: [
        "Describe something you do to relax after a busy day. You should say: what you do; when you started doing it; how often you do it; and explain how it helps you relax.",
      ],
    },
  ],
};

export const NGAY_19: Lesson[] = [T2D19_GRAMMAR, T2D19_LISTENING, T2D19_SPEAKING, T2D19_HOMEWORK];
