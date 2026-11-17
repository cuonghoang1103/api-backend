/**
 * IELTS Tập 3 — Ngày 23 (band 5.0 → 6.0).
 * Bài 1 ngữ pháp: mệnh đề danh ngữ (that / if – whether / wh-) làm tân ngữ, chủ ngữ, bổ ngữ; It is + adj + that / to V
 *   (G30 — ôn G21 too / enough / so / such của Tập 2 Ngày 23; nối câu hỏi gián tiếp Tập 2 Ngày 19 và câu tường thuật Tập 3 Ngày 19).
 * Bài 2 đọc: Yes / No / Not Given 2 + suy luận quan điểm, giọng điệu, từ cực đoan, bẫy “đúng một nửa” (R15 · R19 — nối Tập 2 Ngày 20).
 * Bài 3 nói: Part 3 câu hỏi đánh giá “Is it a good thing that…?” (S06 — nối Tập 3 Ngày 10 · 14 · 19) · 🔊 ngữ điệu đối lập (S15).
 * Mọi bài đọc, câu ví dụ, câu trả lời mẫu đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_23: Lesson[] = [
  /* ═══════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════ */
  {
    id: "t3d23-ngu-phap",
    kind: "grammar",
    title: "Mệnh đề danh ngữ; It is + adj + that / to V",
    goal: "Dùng đúng mệnh đề danh ngữ (that / whether / wh-) ở vị trí tân ngữ, chủ ngữ và sau danh từ, và viết được câu “It is + tính từ + that / to V” để nêu nhận định trong Task 2 và Part 3 mà không sai trật tự từ.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        items: [
          "**Mệnh đề danh ngữ** (noun clause) = cả một mệnh đề có chủ ngữ + động từ nhưng đứng ở chỗ của **một danh từ**: làm tân ngữ, chủ ngữ, bổ ngữ. Có 3 loại: **that-**, **if / whether-**, **wh-**.",
          "Trật tự từ luôn là **trật tự câu kể** (S + V) — không đảo, không do / does / did. Bạn đã gặp ở câu hỏi gián tiếp (Tập 2 Ngày 19) và câu tường thuật (Tập 3 Ngày 19); hôm nay gom thành một hệ.",
          "Ba khung ăn điểm: **What + S + V + is…** (What worries me is that…), **the fact that…**, **Whether… depends on…**.",
          "**It is + adj + that + S + V** (nêu nhận định) và **It is + adj + (for sb) + to V** (nói việc gì dễ / khó / cần) — hai khung dùng nhiều nhất trong Task 2.",
          "Ôn **too / enough / so / such** (Tập 2 Ngày 23) bằng cách ghép với hai khung It is… ở trên.",
          "Đẩy tiêu chí **GRA** (trộn câu đơn + câu phức, lỗi hiếm khi làm sai nghĩa) của cả Writing lẫn Speaking band 6.",
        ],
      },

      { t: "h", text: "1. Mệnh đề danh ngữ là gì — 3 loại, 4 vị trí" },
      { t: "p", text: "So sánh: **I know the answer.** (tân ngữ là một danh từ) và **I know ==that he is right==.** / **I know ==why he left==.** (tân ngữ là cả một mệnh đề). Phần dạ quang làm đúng việc của danh từ “the answer”, nên gọi là **mệnh đề danh ngữ**. Mệnh đề nào cũng phải có **chủ ngữ + động từ đã chia**. Người Việt hay viết thiếu một trong hai, vì trong tiếng Việt nói “Tôi biết khó” là đủ." },
      {
        t: "table",
        caption: "Ba loại mệnh đề danh ngữ",
        head: ["Loại", "Bắt đầu bằng", "Đến từ câu gì", "Ví dụ"],
        rows: [
          ["that-clause", "that (thường bỏ được khi nói)", "một câu kể", "Many people believe **that** nuclear power is dangerous."],
          ["if / whether-clause", "if · whether (… or not)", "một câu hỏi Yes / No", "Nobody knows **whether** the plan will work."],
          ["wh-clause", "what · who · where · when · why · how · which · how much…", "một câu hỏi Wh-", "The chart shows **how much** each country spends."],
        ],
      },
      {
        t: "sodo", kind: "compare", title: "Bốn vị trí của mệnh đề danh ngữ",
        cols: [
          { title: "1. Tân ngữ (sau động từ)", items: ["I think **that it is unfair**.", "We don't know **why prices rose**.", "Hay gặp nhất — mục 2 và 3"] },
          { title: "2. Chủ ngữ (đầu câu)", items: ["**What we need** is more time.", "**Whether it works** is unclear.", "Động từ chính chia **số ít** — mục 4"] },
          { title: "3. Bổ ngữ (sau be)", items: ["The problem is **that nobody listens**.", "The question is **whether we can afford it**.", "Khung mở ý rất gọn cho Part 3"] },
          { title: "4. Sau danh từ / giới từ", items: ["**the fact that** fuel is expensive", "It depends **on how** you use it.", "Sau giới từ: dùng **whether**, không dùng if"] },
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận: đừng nhầm với mệnh đề quan hệ (Ngày 17)", items: [
        "Mệnh đề **quan hệ** bổ nghĩa cho một danh từ đứng trước: the report **that** I read (= cái báo cáo mà tôi đã đọc). Bỏ nó đi câu vẫn đủ thành phần.",
        "Mệnh đề **danh ngữ** là chính thành phần câu: I read **that** the report was wrong. Bỏ nó đi câu cụt: ~~I read.~~ (đọc cái gì?)",
        "Phép thử: thay cả cụm bằng **it / something**. Thay được ⇒ danh ngữ: I know **it**. ✔",
      ] },

      { t: "h", text: "2. That-clause: sau động từ, sau tính từ, sau danh từ" },
      { t: "p", text: "Đây là loại bạn đã dùng từ lâu (I think that…). Lên band 6 cần ba việc: (1) dùng **nhiều động từ hơn think** — động từ tường thuật của Ngày 19 đều đi với that-clause; (2) dùng **tính từ + that** để nói mức chắc chắn; (3) dùng **danh từ + that** (the fact that, the idea that…) để biến một câu thành chủ ngữ hay tân ngữ của giới từ." },
      {
        t: "patterns",
        rows: [
          { formula: "S + V + (that) + S + V", vi: "Sau động từ nghĩ – nói – cho thấy: think, believe, argue, claim, suggest, show, indicate, admit, agree, doubt…", examples: [
            { en: "The figures show that energy use has doubled since 1990.", vi: "Số liệu cho thấy mức dùng năng lượng đã tăng gấp đôi từ năm 1990." },
            { en: "Some experts doubt that the target can be met.", vi: "Một số chuyên gia nghi ngờ rằng mục tiêu có thể đạt được." },
          ] },
          { formula: "S + be + adj + (that) + S + V", vi: "Sau tính từ chỉ cảm xúc / mức chắc: sure, certain, aware, convinced, afraid, worried, surprised, pleased", examples: [
            { en: "I am convinced that children learn best by doing.", vi: "Tôi tin chắc rằng trẻ học tốt nhất khi được thực hành." },
            { en: "Few people are aware that plastic takes centuries to break down.", vi: "Ít người biết rằng nhựa mất hàng thế kỷ mới phân huỷ." },
          ] },
          { formula: "the + N + that + S + V", vi: "Sau danh từ trừu tượng: the fact / idea / belief / view / claim / evidence / possibility / news that…", examples: [
            { en: "The fact that rents are rising worries many students.", vi: "Việc tiền thuê nhà đang tăng làm nhiều sinh viên lo." },
            { en: "There is little evidence that homework improves results at primary level.", vi: "Có rất ít bằng chứng cho thấy bài tập về nhà cải thiện kết quả ở bậc tiểu học." },
          ] },
        ],
      },
      {
        t: "table",
        caption: "Khi nào bỏ được that?",
        head: ["Tình huống", "Bỏ that?", "Ví dụ"],
        rows: [
          ["Nói, sau think / say / know / hope", "✅ bỏ tự nhiên", "I think (that) it's a good idea."],
          ["Viết Task 1 / Task 2", "❌ nên giữ", "The chart shows **that** sales fell."],
          ["Sau danh từ: the fact that…", "❌ không bỏ", "the fact **that** prices rose"],
          ["That-clause đứng đầu câu", "❌ không bỏ", "**That** he lied is obvious."],
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai với that-clause", items: [
        "~~Despite the weather was bad, they went out.~~ → **Despite the fact that** the weather was bad… (despite + danh từ; muốn theo sau là mệnh đề thì thêm **the fact that** — nối Ngày 21).",
        "~~The fact which prices are rising…~~ → the fact **that** prices are rising (sau fact / idea / belief dùng that, không dùng which).",
        "~~I think that is important to save energy.~~ → I think that **it** is important… (mệnh đề phải có chủ ngữ; that ở đây chỉ là từ nối).",
        "~~Many people think that nuclear power dangerous.~~ → …nuclear power **is** dangerous (thiếu động từ be).",
        "~~I want that the government builds more schools.~~ → I want the government **to build**… (want / would like + O + to V, không đi với that).",
      ] },
      { t: "rule", formula: "S + V / be + adj + (that) + S + V  ·  the fact / idea / evidence + that + S + V", vi: "That-clause luôn đủ chủ ngữ + động từ; khi viết giữ that; sau fact / idea dùng that, không dùng which." },
      {
        t: "quiz", id: "t3d23-that-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "S + V + that + S + V · the fact that + S + V",
        items: [
          { q: "Biểu đồ cho thấy rằng số người dùng xe đạp đã tăng gấp ba.", answers: ["The chart shows that the number of cyclists has tripled.", "The chart shows that the number of people using bicycles has tripled.", "The chart shows that the number of people who use bicycles has tripled.", "The graph shows that the number of cyclists has tripled.", "The chart shows that the number of bicycle users has tripled."], hint: "shows that · the number of… has tripled" },
          { q: "Tôi tin chắc rằng giáo dục là chìa khoá.", answers: ["I am convinced that education is the key.", "I'm convinced that education is the key.", "I am sure that education is the key.", "I am certain that education is the key.", "I'm sure that education is the key."], hint: "be convinced / sure that" },
          { q: "Việc nhiều người trẻ rời quê là một vấn đề nghiêm trọng.", answers: ["The fact that many young people leave their hometowns is a serious problem.", "The fact that many young people are leaving their hometowns is a serious problem.", "The fact that many young people leave the countryside is a serious problem.", "The fact that many young people leave their hometown is a serious problem."], hint: "The fact that + S + V + is…" },
          { q: "Có rất ít bằng chứng cho thấy quảng cáo làm trẻ em béo phì.", answers: ["There is little evidence that advertising makes children obese.", "There is very little evidence that advertising makes children obese.", "There is little evidence that advertising causes obesity in children.", "There is little evidence that advertisements make children obese."], hint: "There is little evidence that…" },
          { q: "Mặc dù năng lượng mặt trời rẻ, ít hộ gia đình dùng nó.", answers: ["Despite the fact that solar energy is cheap, few households use it.", "In spite of the fact that solar energy is cheap, few households use it.", "Although solar energy is cheap, few households use it.", "Despite the fact that solar power is cheap, few households use it.", "Although solar power is cheap, few households use it."], hint: "Despite the fact that + S + V" },
        ],
      },
      {
        t: "mcq", id: "t3d23-that-luyen", title: "Chọn câu ĐÚNG (6 câu)",
        items: [
          { q: "Câu nào đúng?", options: ["I believe that is necessary to act now.", "I believe that it is necessary to act now.", "I believe that necessary to act now.", "I believe it necessary that act now."], correct: 1, why: "That-clause cần chủ ngữ giả it: that **it is** necessary to act." },
          { q: "Câu nào đúng?", options: ["The idea which money brings happiness is common.", "The idea what money brings happiness is common.", "The idea money brings happiness that is common.", "The idea that money brings happiness is common."], correct: 3, why: "idea + **that** + mệnh đề (nói rõ nội dung của ý tưởng)." },
          { q: "Câu nào đúng?", options: ["Despite the fact that he was tired, he kept working.", "Despite he was tired, he kept working.", "Despite of he was tired, he kept working.", "Despite that he tired, he kept working."], correct: 0, why: "despite + N / V-ing; muốn mệnh đề phải có **the fact that**." },
          { q: "Câu nào đúng?", options: ["Parents want that schools teach coding.", "Parents want schools teaching coding that.", "Parents want schools to teach coding.", "Parents want schools teach coding."], correct: 2, why: "want + O + **to V**; want không đi với that-clause." },
          { q: "Trong bài Task 1, câu nào hợp nhất?", options: ["The table shows that sales fell in 2020.", "The table shows sales fell in 2020 that.", "The table shows that fell sales in 2020.", "The table shows which sales fell in 2020."], correct: 0, why: "Viết học thuật giữ that; trật tự S + V: sales fell." },
          { q: "Câu nào là mệnh đề DANH NGỮ (không phải quan hệ)?", options: ["The book that I bought was cheap.", "The city that hosts the games will benefit.", "The news that taxes would rise shocked everyone.", "The man that called you is my boss."], correct: 2, why: "“that taxes would rise” chính là nội dung của the news; ba câu kia that = which / who, bổ nghĩa cho danh từ." },
        ],
      },

      { t: "h", text: "3. Wh-clause và if / whether-clause: trật tự câu kể" },
      { t: "p", text: "Khi một **câu hỏi** nằm trong câu khác, nó thành mệnh đề danh ngữ và **mất dáng câu hỏi**: không đảo trợ động từ, không do / does / did, không dấu hỏi (trừ khi câu chính là câu hỏi). Tập 2 Ngày 19 đã dạy “Do you know where the station is?”; Ngày 19 tuần này dạy “She asked where I lived”. Hôm nay dùng nó sau **mọi** động từ và cả sau giới từ, danh từ." },
      {
        t: "table",
        caption: "Câu hỏi trực tiếp → mệnh đề danh ngữ",
        head: ["Câu hỏi", "Trong câu khác", "Thay đổi"],
        rows: [
          ["Why **do** people move to cities?", "The essay explains **why people move** to cities.", "bỏ do, về S + V"],
          ["How much **does** it cost?", "Nobody told us **how much it costs**.", "bỏ does, thêm -s"],
          ["Where **is** the money spent?", "The chart shows **where the money is spent**.", "be về sau chủ ngữ"],
          ["**Will** prices fall?", "It is hard to say **whether prices will fall**.", "thêm whether / if, bỏ đảo"],
          ["Who **pays** for it? (hỏi chủ ngữ)", "It is unclear **who pays** for it.", "giữ nguyên — vốn đã là S + V"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + V + Wh- + S + V", vi: "Sau know, explain, show, understand, wonder, decide, depend on, be interested in…", examples: [
            { en: "The diagram illustrates how electricity is generated from waste.", vi: "Sơ đồ minh hoạ cách điện được sản xuất từ rác." },
            { en: "I often wonder what the city will look like in fifty years.", vi: "Tôi thường tự hỏi thành phố sẽ trông thế nào sau năm mươi năm." },
          ] },
          { formula: "S + V + whether / if + S + V (+ or not)", vi: "Câu hỏi Yes / No nằm trong câu khác. Whether dùng được ở mọi chỗ; if chỉ dùng sau động từ.", examples: [
            { en: "Researchers are testing whether the drug is safe.", vi: "Các nhà nghiên cứu đang thử xem thuốc có an toàn không." },
            { en: "It depends on whether you live in a city or in the countryside.", vi: "Điều đó tuỳ vào việc bạn sống ở thành phố hay nông thôn." },
          ] },
          { formula: "Wh- + to V", vi: "Rút gọn khi hai mệnh đề cùng chủ ngữ và có nghĩa “nên / có thể”: what to do, how to V, where to go, whether to V", examples: [
            { en: "Many graduates do not know how to write a good CV.", vi: "Nhiều sinh viên mới ra trường không biết cách viết một CV tốt." },
            { en: "She couldn't decide whether to accept the offer.", vi: "Cô ấy không quyết được có nên nhận lời mời hay không." },
          ] },
        ],
      },
      {
        t: "table",
        caption: "whether hay if?",
        head: ["Vị trí", "whether", "if"],
        rows: [
          ["Sau động từ (know, ask, wonder)", "✅ I don't know whether he'll come.", "✅ I don't know if he'll come. (thân mật hơn)"],
          ["Sau giới từ", "✅ It depends on whether…", "❌ ~~depends on if~~"],
          ["Đầu câu (làm chủ ngữ)", "✅ Whether it works is unclear.", "❌ ~~If it works is unclear.~~"],
          ["Trước to V", "✅ whether to go", "❌ ~~if to go~~"],
          ["Đi liền với or not", "✅ whether or not it rains", "❌ ~~if or not~~"],
        ],
      },
      { t: "note", title: "⚠️ Ba lỗi sai kinh điển", items: [
        "~~I don't know what should I do.~~ → I don't know what **I should** do. (Lỗi số 1 của người Việt ở Speaking — giám khảo nghe ra ngay.)",
        "~~The graph shows how did the price change.~~ → …how the price **changed**. (bỏ did, chia quá khứ)",
        "~~It depends on what do you want.~~ → It depends on what **you want**.",
        "~~I wonder that he will come.~~ → I wonder **whether / if** he will come. (wonder, ask chuyện chưa chắc ⇒ whether / if, không phải that; riêng doubt đi được cả hai: I doubt **that / whether** it will work.)",
      ] },
      { t: "rule", formula: "S + V + Wh- / whether / if + S + V  (không đảo, không do / does / did)", vi: "Câu hỏi nằm trong câu khác ⇒ trật tự câu kể. Sau giới từ, đầu câu, trước to V ⇒ whether." },
      {
        t: "quiz", id: "t3d23-wh-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "S + V + Wh- / whether + S + V",
        items: [
          { q: "Tôi không biết tại sao người ta lãng phí nhiều thức ăn như vậy.", answers: ["I don't know why people waste so much food.", "I do not know why people waste so much food."], hint: "why + S + V · so much food" },
          { q: "Biểu đồ cho thấy mỗi hộ gia đình dùng bao nhiêu nước.", answers: ["The chart shows how much water each household uses.", "The graph shows how much water each household uses.", "The chart shows how much water every household uses."], hint: "how much water + S + V(s)" },
          { q: "Điều đó tuỳ vào việc bạn có đủ tiền hay không.", answers: ["It depends on whether you have enough money.", "It depends on whether you have enough money or not.", "It depends on whether or not you have enough money.", "That depends on whether you have enough money."], hint: "depends on whether (không dùng if)" },
          { q: "Không ai có thể dự đoán giá dầu sẽ thay đổi thế nào.", answers: ["Nobody can predict how oil prices will change.", "No one can predict how oil prices will change.", "Nobody can predict how the price of oil will change.", "No one can predict how the price of oil will change."], hint: "predict how + S + will + V" },
          { q: "Nhiều sinh viên không biết chọn ngành nào.", answers: ["Many students don't know which major to choose.", "Many students do not know which major to choose.", "Many students don't know which subject to choose.", "Many students don't know which major they should choose.", "Many students do not know which subject to choose."], hint: "which major to choose" },
        ],
      },
      {
        t: "quiz", id: "t3d23-wh-luyen", title: "Viết lại — đặt câu hỏi vào trong câu (8 câu)", kind: "fill",
        items: [
          { q: "Where does the money go? → Nobody knows where ___ .", answers: ["the money goes"] },
          { q: "Why did sales fall? → The report explains why ___ .", answers: ["sales fell"] },
          { q: "Is the water safe? → Scientists are checking ___ the water is safe. (1 từ)", answers: ["whether", "if"] },
          { q: "How long will the project take? → It is unclear how long ___ .", answers: ["the project will take"] },
          { q: "What should we do? → We need to decide what ___ do. (1 từ)", answers: ["to"] },
          { q: "Can robots replace teachers? → People disagree about ___ robots can replace teachers. (1 từ)", answers: ["whether"] },
          { q: "How is paper recycled? → The diagram shows how ___ .", answers: ["paper is recycled"] },
          { q: "Who built the bridge? → I have no idea who ___ the bridge. (1 từ)", answers: ["built"] },
        ],
      },

      { t: "h", text: "4. Mệnh đề danh ngữ làm CHỦ NGỮ: What… is… · Whether… depends on…" },
      { t: "p", text: "Đây là bước nhảy từ band 5 lên band 6. Thay vì “I worry about pollution”, bạn nói **What worries me is pollution** — câu nhấn đúng vào ý quan trọng và nghe như người nói tự nhiên. Luật duy nhất cần nhớ: mệnh đề làm chủ ngữ tính là **một thứ** ⇒ động từ chính chia **số ít**." },
      {
        t: "patterns",
        rows: [
          { formula: "What + S + V + is / was + N / that-clause / (to) V", vi: "“Điều mà… là…” — nhấn ý. What = the thing that.", examples: [
            { en: "What young people need is practical experience.", vi: "Điều giới trẻ cần là kinh nghiệm thực tế." },
            { en: "What worries me is that nobody reads the terms.", vi: "Điều làm tôi lo là không ai đọc các điều khoản." },
            { en: "What the government should do is (to) invest in public transport.", vi: "Việc chính phủ nên làm là đầu tư vào giao thông công cộng." },
          ] },
          { formula: "Whether + S + V + is / depends on…", vi: "“Việc… hay không thì…” — mở câu trả lời cho câu hỏi Yes / No ở Part 3", examples: [
            { en: "Whether this is a good thing depends on how the money is spent.", vi: "Chuyện này tốt hay không tuỳ vào tiền được tiêu thế nào." },
            { en: "Whether students learn anything is another question.", vi: "Sinh viên có học được gì không lại là chuyện khác." },
          ] },
          { formula: "How / Why / Where + S + V + is…", vi: "Các wh- khác cũng làm chủ ngữ được", examples: [
            { en: "How people spend their free time has changed a lot.", vi: "Cách mọi người dùng thời gian rảnh đã đổi nhiều." },
            { en: "Why the bees are disappearing is still not fully understood.", vi: "Vì sao ong đang biến mất vẫn chưa được hiểu đầy đủ." },
          ] },
        ],
      },
      {
        t: "table",
        caption: "Nâng câu band 5 lên band 6 bằng What…",
        head: ["Band 5", "Band 6"],
        rows: [
          ["I like my job because of the people.", "**What I like most about my job is** the people."],
          ["Cities need more green space.", "**What cities really need is** more green space."],
          ["The price surprised me.", "**What surprised me was** the price."],
          ["We don't know if it is good or bad.", "**Whether it is good or bad is** hard to say."],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận ba chỗ", items: [
        "Động từ chính số ít: What they need **is** jobs. (không phải ~~are~~, dù jobs số nhiều — văn nói đôi khi nghe are, nhưng khi thi hãy dùng is.)",
        "~~What worries me is nobody reads.~~ Khi viết giữ **that**: What worries me is **that** nobody reads…",
        "**That + S + V** làm chủ ngữ (That prices will rise is certain) đúng nhưng rất trang trọng, nặng đầu câu. Người bản ngữ đổi sang **It is certain that prices will rise** — xem mục 5.",
        "What ≠ that: ~~That I need is time.~~ → **What** I need is time. (what = điều mà; that không thay được)",
      ] },
      { t: "rule", formula: "What + S + V + is + N / that + S + V  ·  Whether + S + V + depends on + N / Wh-", vi: "Mệnh đề làm chủ ngữ ⇒ động từ chính số ít. Dùng để nhấn ý chính của câu trả lời." },
      {
        t: "quiz", id: "t3d23-chu-ngu-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "What + S + V + is… · Whether + S + V + depends on…",
        items: [
          { q: "Điều tôi thích nhất ở thành phố này là thức ăn.", answers: ["What I like most about this city is the food.", "What I like best about this city is the food.", "What I like the most about this city is the food.", "What I love most about this city is the food."], hint: "What I like most about… is…" },
          { q: "Điều làm tôi ngạc nhiên là không ai phàn nàn.", answers: ["What surprised me was that nobody complained.", "What surprised me was that no one complained.", "What surprises me is that nobody complains.", "What surprised me is that nobody complained.", "What surprises me is that no one complains."], hint: "What surprised me was that…" },
          { q: "Việc chúng ta cần làm là giảm rác thải nhựa.", answers: ["What we need to do is reduce plastic waste.", "What we need to do is to reduce plastic waste.", "What we need to do is cut plastic waste.", "What we have to do is reduce plastic waste.", "What we need to do is to cut plastic waste."], hint: "What we need to do is (to) V" },
          { q: "Kế hoạch có thành công hay không tuỳ vào ngân sách.", answers: ["Whether the plan succeeds depends on the budget.", "Whether the plan will succeed depends on the budget.", "Whether the plan succeeds or not depends on the budget.", "Whether or not the plan succeeds depends on the budget.", "Whether the plan is successful depends on the budget."], hint: "Whether + S + V + depends on" },
          { q: "Cách trẻ em học đã thay đổi rất nhiều.", answers: ["How children learn has changed a lot.", "The way children learn has changed a lot.", "How children learn has changed greatly.", "How children learn has changed a great deal.", "The way children learn has changed greatly."], hint: "How + S + V + has changed" },
        ],
      },

      { t: "h", text: "5. It is + adj + that + S + V — nêu nhận định" },
      { t: "p", text: "Tiếng Anh không thích chủ ngữ dài. Thay vì ~~That many species are disappearing is clear~~, người ta đặt **It** giả ở đầu và đẩy mệnh đề thật ra sau: **It is clear that many species are disappearing**. Khung này cho bạn nêu nhận định mà không cần “I think” ở mọi câu — đúng thứ Task 2 band 6 cần." },
      {
        t: "table",
        caption: "Tính từ / phân từ hay đi với It is … that",
        head: ["Nhóm nghĩa", "It is + … + that", "Dùng khi"],
        rows: [
          ["Chắc chắn", "clear · obvious · true · certain · undeniable", "nêu điều ai cũng thấy; mở đoạn"],
          ["Có khả năng", "likely · unlikely · possible · probable", "dự đoán có mức độ (hedging)"],
          ["Cảm xúc / đánh giá", "surprising · worrying · unfortunate · encouraging · understandable", "câu hỏi đánh giá “Is it a good thing…?” (bài 3 hôm nay)"],
          ["Cần thiết", "important · essential · vital · necessary", "đề xuất giải pháp"],
          ["Bị động vô nhân xưng", "said · believed · thought · estimated · argued · widely accepted", "thuật ý chung mà không cần nêu ai nói (nối Ngày 13 · 19)"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "It is + adj + that + S + V", vi: "Nêu nhận định khách quan", examples: [
            { en: "It is clear that online shopping has changed the high street.", vi: "Rõ ràng mua sắm trực tuyến đã làm thay đổi các phố mua sắm." },
            { en: "It is unlikely that fossil fuels will disappear within a decade.", vi: "Khó có khả năng nhiên liệu hoá thạch biến mất trong một thập kỷ." },
          ] },
          { formula: "It is + V3 + that + S + V", vi: "“Người ta nói / tin / ước tính rằng…”", examples: [
            { en: "It is estimated that a third of all food is thrown away.", vi: "Người ta ước tính một phần ba lượng thức ăn bị vứt bỏ." },
            { en: "It is often argued that zoos protect endangered species.", vi: "Người ta thường lập luận rằng sở thú bảo vệ các loài nguy cấp." },
          ] },
          { formula: "It is + essential / vital / important + that + S + (should) + V nguyên thể", vi: "Sau nhóm “cần thiết”, văn trang trọng dùng động từ nguyên thể (không -s). Thêm should là cách dễ và an toàn.", examples: [
            { en: "It is essential that every child (should) have access to clean water.", vi: "Điều thiết yếu là mọi trẻ em đều được dùng nước sạch." },
          ] },
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai", items: [
        "~~Is clear that…~~ / ~~Clear that…~~ → **It is** clear that… (tiếng Việt “Rõ ràng là…” không có chủ ngữ; tiếng Anh bắt buộc có It).",
        "~~It is easy that people find information.~~ → It is easy **for people to find** information. (easy / difficult / hard KHÔNG đi với that — xem mục 6.)",
        "~~It is said that he is rich man.~~ Đúng khung nhưng đừng quên mạo từ: …**a** rich man.",
        "~~It is likely to rain that tomorrow.~~ Hai khung khác nhau: **It is likely that** it will rain / It **is likely to** rain.",
        "Đừng mở cả 5 câu liền bằng It is…. Trong một đoạn thân bài dùng 1–2 lần là đủ.",
      ] },
      { t: "rule", formula: "It is + adj / V3 + that + S + V", vi: "It giả đứng đầu, mệnh đề thật ở sau. clear · likely · surprising · said · estimated đi với that; easy · difficult thì không." },
      {
        t: "quiz", id: "t3d23-it-that-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "It is + adj / V3 + that + S + V",
        items: [
          { q: "Rõ ràng là công nghệ đã thay đổi cách chúng ta làm việc.", answers: ["It is clear that technology has changed the way we work.", "It is clear that technology has changed how we work.", "It is obvious that technology has changed the way we work.", "It is obvious that technology has changed how we work."], hint: "It is clear that · has changed the way we work" },
          { q: "Có khả năng giá điện sẽ tăng vào năm tới.", answers: ["It is likely that electricity prices will rise next year.", "It is likely that the price of electricity will rise next year.", "It is likely that electricity prices will increase next year.", "It is likely that electricity prices will go up next year.", "It is likely that the price of electricity will increase next year."], hint: "It is likely that + will" },
          { q: "Người ta ước tính rằng thành phố có hai triệu xe máy.", answers: ["It is estimated that the city has two million motorbikes.", "It is estimated that there are two million motorbikes in the city.", "It is estimated that the city has 2 million motorbikes.", "It is estimated that there are 2 million motorbikes in the city."], hint: "It is estimated that" },
          { q: "Thật đáng lo là nhiều trẻ em không ngủ đủ.", answers: ["It is worrying that many children do not get enough sleep.", "It is worrying that many children don't get enough sleep.", "It is worrying that many children do not sleep enough.", "It is worrying that many children don't sleep enough."], hint: "It is worrying that · get enough sleep" },
          { q: "Người ta thường nói rằng tiền không mua được hạnh phúc.", answers: ["It is often said that money cannot buy happiness.", "It is often said that money can't buy happiness.", "It is often said that money does not buy happiness.", "It is often said that money doesn't buy happiness."], hint: "It is often said that" },
        ],
      },

      { t: "h", text: "6. It is + adj + (for sb) + to V — việc gì thì dễ / khó / cần" },
      { t: "p", text: "Khung thứ hai với It giả: sau tính từ là **to V**, và người làm việc đó (nếu cần nói) đứng sau **for**. Hai khung It is… chia nhau tính từ khá rõ: tính từ nói về **sự việc có thật hay không** (clear, true, likely) đi với that; tính từ nói về **việc làm thì ra sao** (easy, difficult, hard, possible, expensive) đi với to V. Nhóm important / necessary / essential đi được cả hai." },
      {
        t: "patterns",
        rows: [
          { formula: "It is + adj + to V", vi: "Nói chung, không cần nêu ai", examples: [
            { en: "It is difficult to find affordable housing in big cities.", vi: "Khó tìm được nhà giá vừa túi tiền ở các thành phố lớn." },
          ] },
          { formula: "It is + adj + for + sb + to V", vi: "Nêu rõ ai làm", examples: [
            { en: "It is important for children to spend time outdoors.", vi: "Việc trẻ em dành thời gian ở ngoài trời là quan trọng." },
            { en: "It is almost impossible for small shops to compete with online giants.", vi: "Các cửa hàng nhỏ gần như không thể cạnh tranh với các ông lớn trực tuyến." },
          ] },
          { formula: "S + find / make + it + adj + to V", vi: "It giả ở vị trí tân ngữ — cấu trúc band 6–7 rất gọn", examples: [
            { en: "Many elderly people find it hard to use smartphones.", vi: "Nhiều người cao tuổi thấy khó dùng điện thoại thông minh." },
            { en: "The internet has made it easier to work from home.", vi: "Internet đã làm cho việc làm ở nhà dễ hơn." },
          ] },
        ],
      },
      {
        t: "table",
        caption: "Tính từ nào đi với khung nào?",
        head: ["Tính từ", "+ that + S + V", "+ (for sb) to V"],
        rows: [
          ["clear · obvious · true · likely · certain", "✅ It is clear that he lied.", "❌ (likely: dùng S + is likely to V)"],
          ["easy · difficult · hard · expensive · dangerous", "❌", "✅ It is hard (for them) to save money."],
          ["possible · impossible", "✅ It is possible that he forgot. (= có lẽ)", "✅ It is possible to walk there. (= làm được)"],
          ["important · necessary · essential · vital", "✅ It is vital that we act.", "✅ It is vital (for us) to act."],
          ["surprising · strange · good · sad", "✅ It is sad that the shop closed.", "✅ It is sad to see the shop close."],
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai — lỗi “tôi khó…”", items: [
        "~~I am difficult to wake up early.~~ → **It is difficult for me to** wake up early. / **I find it difficult to** wake up early. (“I am difficult” = tôi là người khó tính!)",
        "~~It is easy for learning English.~~ → It is easy **to learn** English.",
        "~~It is necessary that to protect forests.~~ → It is necessary **to protect** forests. (chọn một: that + S + V, hoặc to V)",
        "~~The internet makes easier to study.~~ → The internet makes **it** easier to study. (thiếu it)",
        "~~It is important for children should play.~~ → …for children **to play**.",
      ] },
      { t: "rule", formula: "It is + adj + (for + sb) + to V  ·  S + find / make + it + adj + to V", vi: "easy / difficult / hard / possible + to V; chủ ngữ thật là việc làm, không phải người." },
      {
        t: "quiz", id: "t3d23-it-to-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "It is + adj + (for sb) + to V · find / make it + adj + to V",
        items: [
          { q: "Tôi khó tập trung khi có tiếng ồn.", answers: ["It is difficult for me to concentrate when there is noise.", "It is hard for me to concentrate when there is noise.", "I find it difficult to concentrate when there is noise.", "I find it hard to concentrate when there is noise.", "It's hard for me to concentrate when there is noise.", "It is difficult for me to focus when there is noise.", "I find it hard to focus when there is noise."], hint: "It is difficult for me to… / I find it hard to…" },
          { q: "Điều quan trọng là các chính phủ phải đầu tư vào năng lượng sạch.", answers: ["It is important for governments to invest in clean energy.", "It is important that governments invest in clean energy.", "It is important that governments should invest in clean energy.", "It is essential for governments to invest in clean energy.", "It is vital for governments to invest in clean energy."], hint: "It is important for + sb + to V" },
          { q: "Điện thoại thông minh đã làm cho việc giữ liên lạc dễ hơn.", answers: ["Smartphones have made it easier to keep in touch.", "Smartphones have made it easier to stay in touch.", "Smartphones have made it easier to stay in contact.", "Smartphones have made it easier to keep in contact."], hint: "have made it easier to V" },
          { q: "Gần như không thể sống ở đây mà không có xe.", answers: ["It is almost impossible to live here without a car.", "It is nearly impossible to live here without a car.", "It's almost impossible to live here without a car.", "It is almost impossible to live here without a vehicle."], hint: "It is almost impossible to V" },
          { q: "Nhiều sinh viên thấy khó quản lý tiền của mình.", answers: ["Many students find it difficult to manage their money.", "Many students find it hard to manage their money.", "It is difficult for many students to manage their money.", "It is hard for many students to manage their money."], hint: "find it difficult to V" },
        ],
      },
      {
        t: "quiz", id: "t3d23-it-luyen", title: "that hay to? Điền MỘT từ (8 câu)", kind: "fill",
        items: [
          { q: "It is obvious ___ the old system no longer works.", answers: ["that"] },
          { q: "It is expensive ___ heat a large house in winter.", answers: ["to"] },
          { q: "It is believed ___ the first settlers arrived by sea.", answers: ["that"] },
          { q: "It is hard ___ young families to buy a home.", answers: ["for"] },
          { q: "Many people find ___ stressful to drive in the city centre.", answers: ["it"] },
          { q: "It is unlikely ___ the price will fall soon.", answers: ["that"] },
          { q: "New software has made ___ possible to work from anywhere.", answers: ["it"] },
          { q: "___ is surprising that so few people vote.", answers: ["It"] },
        ],
      },

      { t: "h", text: "7. Ôn Tập 2 Ngày 23: too · enough · so · such — ghép với khung It is…" },
      { t: "p", text: "Bốn từ này bạn đã học: **too + adj + to V** (quá… nên không thể), **adj + enough + to V** (đủ… để), **so + adj + that** / **such + (a) + adj + N + that** (…đến nỗi). Hôm nay ghép chúng với khung It is… và for sb to V — đây là chỗ band 5 hay viết sai trật tự." },
      {
        t: "table",
        caption: "Bốn khung, một ý: “Nhà quá đắt, người trẻ không mua nổi”",
        head: ["Khung", "Câu"],
        rows: [
          ["too + adj + for sb + to V", "Houses are **too expensive for young people to buy**."],
          ["not + adj + enough + to V", "Young people are **not rich enough to buy** a house."],
          ["so + adj + that + S + V", "Houses are **so expensive that** young people cannot buy them."],
          ["such + (a/an) + adj + N + that", "It is **such an expensive market that** young people cannot buy a house."],
          ["It is + adj + for sb + to V", "**It is impossible for young people to buy** a house."],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận — ba lỗi cũ hay quay lại", items: [
        "too…to **không** có tân ngữ lặp: ~~too expensive for young people to buy them~~ → …to buy. Nhưng so…that **phải** có: …that they cannot buy **them**.",
        "enough đứng **sau** tính từ, **trước** danh từ: old **enough** · **enough** money. ~~enough old~~",
        "so + adj; such + (a) + adj + **N**: so serious · such a serious **problem**. ~~so serious problem~~ / ~~such serious~~",
        "too ≠ very: “too good” = tốt quá mức (có vấn đề). Khen thì nói very / really good.",
      ] },
      { t: "rule", formula: "too + adj + (for sb) + to V  ·  adj + enough + to V  ·  so + adj + that + S + V  ·  such + (a) + adj + N + that + S + V", vi: "too…to không lặp tân ngữ; so…that thì có. so + tính từ, such + cụm danh từ." },
      {
        t: "mcq", id: "t3d23-on-g21", title: "too · enough · so · such (5 câu)",
        items: [
          { q: "The water is ___ polluted that nobody can swim in it.", options: ["too", "such", "so", "enough"], correct: 2, why: "so + adj + that." },
          { q: "It was ___ a difficult question that most candidates left it blank.", options: ["such", "so", "too", "very"], correct: 0, why: "such + a + adj + N + that." },
          { q: "The village is too remote ___.", options: ["for doctors to visit it regularly", "that doctors visit regularly", "for doctors visiting regularly", "for doctors to visit regularly"], correct: 3, why: "too + adj + for sb + to V, không lặp tân ngữ it." },
          { q: "Solar panels are now ___ for ordinary families to install.", options: ["enough cheap", "cheap enough", "so cheap", "such cheap"], correct: 1, why: "adj + enough + (for sb) + to V." },
          { q: "Câu nào đúng?", options: ["It is so a big city that you need a car.", "It is such big city that you need a car.", "It is a such big city that you need a car.", "It is such a big city that you need a car."], correct: 3, why: "such + a + adj + N." },
        ],
      },

      { t: "h", text: "8. Dùng trong bài thi: band 5 → band 6" },
      {
        t: "table",
        caption: "Cùng một ý — hai mức",
        head: ["Ở đâu", "Band 5", "Band 6"],
        rows: [
          ["Task 2 — mở thân bài", "I think technology is good for education.", "**It is clear that** technology has improved access to education."],
          ["Task 2 — nêu vấn đề", "Many people don't recycle. This is a problem.", "**The fact that** many people still do not recycle **is** a serious problem."],
          ["Task 2 — giải pháp", "Government should build more houses.", "**What** governments **should do is** build more affordable housing."],
          ["Task 1 — mở bài", "The chart is about energy.", "The chart shows **how much** energy was produced from five sources."],
          ["Part 3 — đánh giá", "It depends.", "**Whether it's a good thing depends on how** people use it."],
          ["Part 3 — nêu khó khăn", "Old people are difficult to use apps.", "Older people **find it hard to** use these apps."],
        ],
      },
      { t: "note", title: "💡 Mẹo tự soát 30 giây", items: [
        "Sau **what / why / how / where / whether** ở giữa câu: nhìn hai từ kế tiếp — phải là **chủ ngữ rồi động từ**. Thấy do / does / did / is đứng trước chủ ngữ ⇒ sửa.",
        "Sau **that**: có chủ ngữ chưa? có động từ đã chia chưa?",
        "Chủ ngữ là What… / Whether… ⇒ động từ chính **is / was / depends** (số ít).",
        "easy / difficult / hard ⇒ **to V**; clear / true / likely ⇒ **that**.",
      ] },
      {
        t: "mcq", id: "t3d23-ngu-phap-tong", title: "Tìm câu ĐÚNG ngữ pháp (6 câu)",
        items: [
          { q: "Câu nào đúng?", options: ["Could you tell me where is the library?", "I can't remember where did I put my keys.", "The map shows where the new library is.", "Nobody knows where does he live."], correct: 2, why: "Mệnh đề danh ngữ: where + S + V (the new library is)." },
          { q: "Câu nào đúng?", options: ["What we need are a better plan.", "What we need is a better plan.", "That we need is a better plan.", "What do we need is a better plan."], correct: 1, why: "What + S + V làm chủ ngữ ⇒ is; không đảo." },
          { q: "Câu nào đúng?", options: ["It is difficult for old people to learn new skills.", "Old people are difficult to learn new skills.", "It is difficult that old people learn new skills.", "It is difficult for old people learning new skills."], correct: 0, why: "It is difficult + for sb + to V." },
          { q: "Câu nào đúng?", options: ["It depends on if you have time.", "It depends whether do you have time.", "It depends on that you have time.", "It depends on whether you have time."], correct: 3, why: "Sau giới từ on ⇒ whether + S + V." },
          { q: "Câu nào đúng?", options: ["Is widely believed that sugar is harmful.", "It widely believes that sugar is harmful.", "It is widely believed that sugar is harmful.", "It is widely believed sugar harmful."], correct: 2, why: "It is + V3 + that + S + V (đủ be trong mệnh đề)." },
          { q: "Câu nào đúng?", options: ["Online maps make it easier to find places.", "Online maps make easier to find places.", "Online maps make it easier finding places.", "Online maps make it easier that find places."], correct: 0, why: "make + it + adj + to V." },
        ],
      },
    ],
  },
  /* ═══════════════════════ BÀI 2 — ĐỌC ═══════════════════════ */
  {
    id: "t3d23-doc",
    kind: "reading",
    title: "Yes / No / Not Given 2 — suy luận quan điểm, giọng điệu, từ cực đoan",
    goal: "Làm đúng ít nhất 9/13 câu Yes / No / Not Given + trắc nghiệm quan điểm trên một bài nghị luận ~750 từ trong 20 phút: tách được ý của TÁC GIẢ khỏi ý người khác được thuật lại, và không sập bẫy từ cực đoan, bẫy “đúng một nửa”.",
    minutes: 70,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy band nào",
        items: [
          "**Yes / No / Not Given** hỏi **quan điểm của tác giả** (claims / views of the writer), không hỏi sự kiện như True / False / Not Given. Tập 2 Ngày 20 đã dạy mức nhập; hôm nay làm ở bài nghị luận dài, nhiều giọng nói.",
          "Band 6 thêm 3 kỹ năng: (1) **ai nói câu này** — tác giả hay người bị thuật lại; (2) **mức độ** — all / only / never so với some / may / tend to; (3) **giọng điệu** — tác giả tán thành, dè dặt hay bác bỏ.",
          "Hai bẫy mới: **từ cực đoan** (câu hỏi nói all, bài chỉ nói many) và **đúng một nửa** (nửa đầu câu khớp bài, nửa sau thì không).",
          "Ngữ pháp hôm nay giúp bạn đọc: **It is clear that… / What they cannot teach is… / Whether… is uncertain** đều là chỗ tác giả lộ quan điểm.",
          "Luyện: khởi động 5 câu → bài trọn 13 câu (9 YNNG + 4 trắc nghiệm suy luận), đúng 20 phút. Mục tiêu Reading band 6: 23/40.",
        ],
      },

      { t: "h", text: "1. Ôn nhanh Tập 2 Ngày 20 — và band 6 thêm gì" },
      {
        t: "table",
        head: ["", "Tập 2 (band 5)", "Tập 3 hôm nay (band 6)"],
        rows: [
          ["Bài đọc", "400–500 từ, một giọng: tác giả nói thẳng", "700–900 từ, **nhiều giọng**: tác giả + nhà nghiên cứu + người phê bình"],
          ["YES", "Bài nói đúng ý đó bằng từ đồng nghĩa", "Phải gom ý từ một câu có nhượng bộ (although…, nevertheless…)"],
          ["NO", "Bài nói ngược lại rõ ràng", "Ngược về **mức độ** (some ≠ all) hoặc về **người nói** (họ tin ≠ tác giả tin)"],
          ["NOT GIVEN", "Bài không nhắc tới chủ đề", "Bài **có nhắc** chủ đề nhưng không nêu ý kiến về đúng điểm bị hỏi"],
          ["Dạng đi kèm", "—", "Trắc nghiệm hỏi thái độ / mục đích của tác giả"],
        ],
      },
      {
        t: "sodo", kind: "compare", title: "TFNG và YNNG — khác ở câu lệnh đề",
        cols: [
          { title: "True / False / Not Given (Ngày 3)", items: ["Do the statements agree with the **information** in the passage?", "Bài mô tả, tường thuật: lịch sử, khoa học", "So **sự kiện**: số, năm, ai làm gì"] },
          { title: "Yes / No / Not Given (hôm nay)", items: ["Do the statements agree with the **views / claims of the writer**?", "Bài nghị luận: tác giả bênh hoặc bác một ý", "So **ý kiến**: tác giả nghĩ gì, mạnh tới đâu"] },
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận: ghi đúng chữ đề yêu cầu", items: [
        "Đề YNNG mà viết TRUE / FALSE ⇒ **mất điểm** dù hiểu đúng. Đọc câu lệnh, nhìn ba chữ đề cho.",
        "Trên máy: bạn chọn từ danh sách nên không viết nhầm được — nhưng vẫn phải nhớ mình đang so **ý kiến**, không so sự kiện.",
      ] },

      { t: "h", text: "2. Ai đang nói? Tác giả hay người được thuật lại" },
      { t: "p", text: "Bài nghị luận band 6 gần như luôn theo nhịp: **nêu ý người khác → tác giả phản ứng**. Câu hỏi YNNG rất thích lấy đúng cái ý người khác ấy và hỏi “tác giả có nghĩ vậy không?”. Nếu bạn chỉ dò từ khoá, bạn sẽ thấy khớp và chọn YES — sai. Việc phải làm: tìm **động từ tường thuật** (Ngày 19) để biết ý đó của ai, rồi đọc tiếp 1–2 câu để tìm phản ứng của tác giả." },
      {
        t: "table",
        caption: "Biển báo: ý này của ai?",
        head: ["Của người khác", "Của tác giả", "Tác giả phản ứng với ý người khác"],
        rows: [
          ["Many people believe / assume that…", "In my view, · I believe · I suspect · I am (not) convinced", "This is an exaggeration. · This misunderstands…"],
          ["Supporters / Critics claim that…", "It is clear that… · Clearly, · Undoubtedly,", "There is some truth in this. (= đúng một phần)"],
          ["It is often said / argued that…", "What matters is… · The problem is…", "…, and rightly so. (= tác giả đồng ý)"],
          ["According to X, · X has described… as", "… should / ought to / must…", "Yet / However / Nevertheless + ý tác giả"],
          ["the so-called… · what is known as", "surely · of course · strikes me as", "I am not suggesting that… (= chặn hiểu lầm)"],
        ],
      },
      { t: "note", title: "📌 Ba quy tắc xử ý của người khác", items: [
        "Bài chỉ thuật ý người khác, tác giả **không phản ứng** ⇒ về điểm đó thường là **NOT GIVEN** (ta không biết tác giả nghĩ gì).",
        "Tác giả thuật rồi **bác** (This is an exaggeration) ⇒ câu hỏi chép ý người kia là **NO**.",
        "Tác giả thuật rồi **tán thành** (and rightly so · I agree · this is true) ⇒ **YES**.",
        "Tác giả **đồng ý một phần** (There is some truth in this) ⇒ câu hỏi nói “hoàn toàn đúng” hay “hoàn toàn sai” đều là **NO**.",
      ] },
      {
        t: "mcq", id: "t3d23-doc-ai-noi", title: "Ý này của ai — và tác giả nghĩ gì? (6 câu)",
        items: [
          { q: "“Many managers assume that long hours mean hard work. The evidence points the other way.” — Tác giả nghĩ gì về ý “giờ làm dài = chăm chỉ”?", options: ["Đồng ý", "Không đồng ý", "Không nêu ý kiến", "Đồng ý một phần"], correct: 1, why: "assume là ý của managers; “points the other way” = tác giả bác." },
          { q: "“Critics claim that tourism destroys local culture.” (câu sau chuyển sang ý khác) — Tác giả có cho rằng du lịch phá văn hoá địa phương?", options: ["Có", "Không", "Một phần", "Không biết được"], correct: 3, why: "Chỉ thuật ý critics, không có phản ứng ⇒ về điểm này là NOT GIVEN." },
          { q: "“It is often said that travel broadens the mind, and rightly so.” — Tác giả:", options: ["tán thành", "bác bỏ", "trung lập", "chế giễu"], correct: 0, why: "“and rightly so” = và nói thế là đúng." },
          { q: "“The so-called ‘smart’ city has so far made life easier mainly for advertisers.” — Giọng điệu của tác giả với “smart city” là:", options: ["ngưỡng mộ", "trung lập", "hoài nghi", "giận dữ"], correct: 2, why: "so-called + ngoặc đơn quanh smart + “mainly for advertisers” = hoài nghi, mỉa nhẹ." },
          { q: "“Supporters say the scheme will end poverty. There is some truth in this, but only some.” — Câu “The writer believes the scheme will end poverty” là:", options: ["YES", "NOT GIVEN", "không xác định được", "NO"], correct: 3, why: "Tác giả chỉ đồng ý một phần; “will end poverty” là mức tuyệt đối ⇒ NO." },
          { q: "“I am not suggesting that exams should be abolished.” — Câu này dùng để:", options: ["đề xuất bỏ thi cử", "chặn trước một cách hiểu sai ý tác giả", "thuật ý của người khác", "nêu một sự kiện"], correct: 1, why: "“I am not suggesting that…” = tôi không hề có ý nói… ⇒ câu hỏi nói tác giả muốn bỏ thi là NO." },
        ],
      },

      { t: "h", text: "3. Mức độ: từ cực đoan và từ rào đón" },
      { t: "p", text: "Tác giả học thuật hiếm khi nói tuyệt đối. Họ **rào đón** (hedging): may, tend to, some, often, it seems. Người ra đề lấy câu rào đón ấy, **đổi thành tuyệt đối** (all, always, never, only, proves) và hỏi bạn. Chủ đề khớp, từ khoá khớp, chỉ mức độ lệch ⇒ đáp án là **NO**. Vì vậy: gặp từ cực đoan trong **câu hỏi** thì khoanh ngay, rồi về bài tìm xem tác giả có nói mạnh tới vậy không." },
      {
        t: "table",
        caption: "Thang mức độ — câu hỏi hay đẩy lên một bậc",
        head: ["Loại", "Rào đón (bài hay viết)", "Cực đoan (câu hỏi hay viết)"],
        rows: [
          ["Số lượng", "some · many · several · a number of · most", "all · every · none · no"],
          ["Tần suất", "sometimes · often · usually · tend to · seldom", "always · never · invariably"],
          ["Độ chắc", "may · might · could · suggest · appear to · is likely to", "will · must · prove · show beyond doubt · certainly"],
          ["Phạm vi", "mainly · partly · one of the reasons · among the first", "only · solely · the main / sole reason · the first"],
          ["So sánh", "better than some · more common", "the best · the most · by far the"],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận: từ cực đoan không tự động là NO", items: [
        "Nếu **chính tác giả** cũng nói tuyệt đối (“nobody would seriously argue that…”) thì câu hỏi có all / no vẫn có thể là YES. Luôn quay về bài kiểm.",
        "Ngược lại, câu hỏi dùng từ nhẹ (some, may) mà bài nói đúng ý đó ở mức mạnh hơn ⇒ vẫn YES (nếu “tất cả” đúng thì “một số” cũng đúng).",
        "Bẫy **đúng một nửa**: “Structured activities teach useful skills **and are cheaper than before**.” Nửa đầu khớp bài, nửa sau bài không nói ⇒ **NOT GIVEN** cho cả câu (nếu nửa sau trái bài ⇒ NO). Phải kiểm **từng vế** của câu hỏi.",
        "Bẫy **so sánh không có trong bài**: câu hỏi nói “A is more X than B”, bài chỉ nói A is X. ⇒ NOT GIVEN.",
      ] },
      { t: "rule", formula: "Câu hỏi: all / only / never / proves  →  Bài: some / mainly / seldom / suggests  ⇒  NO", vi: "Khoanh từ chỉ mức độ trong câu hỏi trước, rồi so mức độ với bài — chủ đề khớp chưa phải là YES." },

      { t: "h", text: "4. Giọng điệu và suy luận" },
      { t: "p", text: "Bốn câu trắc nghiệm cuối bài hôm nay không hỏi “bài nói gì” mà hỏi “tác giả **nghĩ thế nào**” hoặc “tác giả nhắc chi tiết này **để làm gì**”. Đáp án không nằm nguyên văn trong bài; bạn suy từ **từ mang thái độ**. Suy luận ở IELTS luôn có bằng chứng trong 1–2 câu — không bao giờ cần kiến thức ngoài." },
      {
        t: "table",
        caption: "Từ mang thái độ — đọc ra giọng tác giả",
        head: ["Thái độ", "Từ / cụm báo hiệu", "Ví dụ"],
        rows: [
          ["Tán thành", "admirable · sensible · rightly · welcome · encouraging", "Their intentions are **admirable**."],
          ["Dè dặt", "uncertain · it remains to be seen · may · I suspect", "Whether this works is **uncertain**."],
          ["Bác bỏ", "misunderstands · exaggeration · dishonest · misleading", "That is an **exaggeration**."],
          ["Hoài nghi / mỉa", "so-called · fashionable · supposedly · merely", "a **fashionable** idea"],
          ["Nhượng bộ rồi giữ ý", "of course · admittedly · although · nevertheless · even so", "**Of course**, one study proves little. **Nevertheless**, …"],
        ],
      },
      { t: "note", title: "💡 Mẹo cho câu hỏi “in order to…” (tác giả nhắc X để làm gì)", items: [
        "Đừng đọc riêng chi tiết X. Đọc **câu đứng trước nó** — đó là luận điểm; X chỉ là ví dụ cho luận điểm ấy.",
        "Đáp án đúng thường là một **động từ chỉ mục đích lập luận**: to illustrate · to admit · to contrast · to warn · to question.",
        "Loại đáp án nói đúng **nghĩa đen** của chi tiết nhưng sai mục đích (tác giả nhắc tạp chí cũ không phải để bàn về tạp chí).",
      ] },

      { t: "h", text: "5. Chiến thuật 6 bước (≈ 11 phút cho 9 câu)" },
      {
        t: "sodo", kind: "flow", title: "Yes / No / Not Given ở band 6",
        steps: [
          { label: "1. Đọc câu lệnh", sub: "views / claims of the writer ⇒ ghi YES / NO / NOT GIVEN" },
          { label: "2. Đọc câu hỏi, khoanh 3 thứ", sub: "chủ đề · **từ mức độ** (all, only, more than) · **từng vế** nếu câu có and / because" },
          { label: "3. Tìm chỗ trong bài", sub: "câu hỏi đi theo thứ tự bài; dùng tên riêng, thuật ngữ để định vị" },
          { label: "4. Hỏi: ai nói?", sub: "tác giả, hay Many people / Critics / X claims?" },
          { label: "5. Đọc thêm 1–2 câu sau", sub: "tìm phản ứng: However · This is… · There is some truth" },
          { label: "6. Chốt", sub: "cùng ý cùng mức ⇒ YES · trái ý / lệch mức ⇒ NO · không có ý kiến về đúng điểm đó ⇒ NOT GIVEN" },
        ],
      },
      { t: "note", title: "💡 Mẹo phân biệt NO và NOT GIVEN trong 10 giây", items: [
        "Tự hỏi: “Nếu câu hỏi này đúng, có câu nào trong bài **thành sai** không?” Có ⇒ **NO**. Không câu nào bị đụng ⇒ **NOT GIVEN**.",
        "Đừng tốn quá 90 giây cho một câu. Không tìm ra sau khi đã đọc đúng đoạn ⇒ nhiều khả năng là NOT GIVEN; chọn và đi tiếp.",
        "Thông thường trong 9 câu có đủ cả ba loại. Nếu bạn chưa chọn NOT GIVEN lần nào ⇒ soát lại.",
      ] },
      { t: "rule", formula: "Ai nói? → Mức độ? → Từng vế?  ⇒  YES / NO / NOT GIVEN", vi: "Ba câu tự hỏi cho mỗi câu YNNG band 6." },

      { t: "h", text: "6. Khởi động — một đoạn, 5 câu (5 phút)" },
      { t: "p", text: "Đọc đoạn văn rồi quyết định mỗi nhận định có khớp **quan điểm của tác giả** không. Chú ý câu 2 và câu 5." },
      {
        t: "passage", title: "Open-book Examinations",
        paras: [
          { text: "Open-book examinations, in which students may consult their notes, are often dismissed as an easy option. This criticism misunderstands them. A well-designed open-book paper does not ask students to repeat facts; it asks them to apply ideas to an unfamiliar case, which is considerably harder than remembering a definition. Supporters sometimes claim that such exams remove stress altogether. That is an exaggeration: students still work against the clock, and many report that having their notes beside them is distracting rather than comforting." },
          { text: "It is also true that open-book papers take teachers longer to write, since every question must be new. Even so, I believe the extra effort is justified, because these exams reward the skill that employers actually want — using information, not storing it. Closed-book tests should not disappear entirely, however. In subjects such as medicine, where a doctor may have to act without time to look anything up, memory remains essential." },
        ],
      },
      {
        t: "mcq", id: "t3d23-doc-khoi-dong", title: "Do the following statements agree with the views of the writer? (5 câu)",
        items: [
          { q: "1. Open-book examinations are easier than traditional ones.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“often dismissed as an easy option. This criticism misunderstands them… considerably harder” — ý “dễ” là của người khác, tác giả bác ⇒ NO." },
          { q: "2. Open-book examinations free students from stress.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“Supporters sometimes claim… remove stress altogether. That is an exaggeration” — ý của supporters, tác giả bác ⇒ NO." },
          { q: "3. Preparing an open-book paper requires more of a teacher's time.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“It is also true that open-book papers take teachers longer to write” — It is true that = tác giả xác nhận ⇒ YES." },
          { q: "4. Employers prefer to hire graduates who have taken open-book examinations.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói employers muốn kỹ năng dùng thông tin; không nói họ ưu tiên tuyển người từng thi đề mở ⇒ NOT GIVEN (bẫy thêm ý)." },
          { q: "5. All closed-book tests ought to be replaced.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“Closed-book tests should not disappear entirely” — câu hỏi dùng All (cực đoan), trái ý tác giả ⇒ NO." },
        ],
      },

      { t: "h", text: "7. Luyện trọn bài — Questions 1–13 (20 phút)" },
      { t: "p", text: "Bấm giờ **20 phút**. Đọc câu hỏi 1–9 trước (khoanh từ mức độ), skim bài 2 phút để biết đoạn nào nói gì, rồi làm. Đừng xem giải thích trước khi làm xong cả 13 câu." },
      {
        t: "passage", title: "In Defence of Boredom",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "For most of human history, having nothing to do was a normal part of the day. People waited for the rain to stop, for the bread to rise, for a letter to arrive, and they waited without entertainment. Today that experience has almost vanished. A phone in every pocket means that the smallest gap — a lift ride, a queue at the bakery — can be filled within seconds. Most commentators treat this as progress. I am not convinced. In my view, we have removed something valuable from daily life without noticing what it was for." },
          { label: "B", text: "It is worth being clear about what boredom is. Psychologists generally define it as the uncomfortable feeling of wanting to be engaged in a satisfying activity but being unable to do so. It is not the same as relaxation, which is pleasant, nor is it the same as depression, although the two are sometimes confused. The psychologist Elena Marsh has described boredom as ‘an alarm, not an illness’: a signal that what we are doing no longer matters to us. Seen in this way, the feeling is useful, in much the same way as hunger is useful. The mistake is to switch off the alarm without asking why it rang." },
          { label: "C", text: "The strongest argument for boredom concerns creativity. In one frequently cited experiment, volunteers were asked to copy numbers from a telephone directory for fifteen minutes before being given a creative task — thinking of as many uses as possible for a pair of plastic cups. They produced more ideas than a group who had gone straight to the task. The researchers suggested that a dull activity allows the mind to wander, and that a wandering mind makes unexpected connections. One small study does not prove a general law, of course, and some later attempts to repeat the result have been less convincing. Nevertheless, the finding matches what many writers and scientists have reported about their own work: good ideas tend to arrive in the shower or on a long walk, seldom in front of a screen." },
          { label: "D", text: "Children are where the debate becomes heated. Many parents now believe that an unoccupied child is a neglected child, and they fill every afternoon with lessons, clubs and supervised play. Their intentions are admirable, and structured activities undoubtedly teach useful skills. What they cannot teach is how to decide, alone, what to do next. A child who complains ‘I'm bored’ and is told to find something to do will, after an unpleasant half hour, usually invent a game. That half hour is not wasted time; it is practice in directing one's own attention. I suspect that this ability will matter more in adult life than one more music certificate." },
          { label: "E", text: "None of this means that boredom is always beneficial, and those who praise it too enthusiastically ignore the evidence. Studies of long-term, unavoidable boredom — the kind experienced by people in repetitive jobs or by teenagers with nowhere to go — link it to risk-taking, overeating and poor concentration. Some critics go further and claim that the ‘value of boredom’ is a fashionable idea invented by comfortable people who are rarely bored themselves. There is some truth in this. A short, chosen pause is very different from months of empty days, and it would be dishonest to recommend the first by pointing to the romance of the second." },
          { label: "F", text: "Nor am I suggesting that technology is the enemy. Phones have made it easier to learn a language on the bus or to keep in touch with a distant relative, and nobody would seriously argue that we should return to waiting rooms with nothing but a two-year-old magazine. The problem is not the device but the habit of reaching for it automatically, before we have even noticed what we were feeling. Technology companies, for their part, have little reason to help: their income depends on how many minutes we spend looking at their products, so an empty moment is, from their point of view, an unsold one." },
          { label: "G", text: "What, then, should we do? Banning phones, as a few schools have done, strikes me as a blunt answer to a subtle problem, although it may suit younger pupils. A more realistic approach is to protect a few small gaps in the day — the walk to work, the first ten minutes after waking — and to leave them deliberately empty. Whether this will make anyone more creative is uncertain. What it will do is give the mind a regular chance to tell us what it wants, which is surely the least we can offer it." },
        ],
      },
      { t: "p", text: "**Questions 1–9.** Do the following statements agree with the views of the writer in the reading passage? Choose **YES** if the statement agrees with the views of the writer, **NO** if the statement contradicts the views of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this." },
      {
        t: "mcq", id: "t3d23-doc-ynng", title: "Questions 1–9 — Yes / No / Not Given",
        items: [
          { q: "1. The disappearance of empty moments from daily life should be seen as progress.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A: “Most commentators treat this as progress. I am not convinced.” Ý “progress” là của commentators; tác giả không tán thành ⇒ NO. Bẫy: nhầm ý người khác thành ý tác giả." },
          { q: "2. Boredom and depression are essentially the same condition.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: “nor is it the same as depression, although the two are sometimes confused” ⇒ trái ý ⇒ NO." },
          { q: "3. Boredom has a function comparable to that of hunger.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “the feeling is useful, in much the same way as hunger is useful.” useful → has a function; in the same way as → comparable to ⇒ YES." },
          { q: "4. The telephone-directory experiment proves that boring tasks make people more creative.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn C: “One small study does not prove a general law, of course.” Câu hỏi dùng **proves** (cực đoan); tác giả chỉ coi là gợi ý ⇒ NO." },
          { q: "5. The majority of important scientific discoveries have been made during long walks.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ nói ý hay “tend to arrive in the shower or on a long walk”; không có nhận định nào về “đa số phát kiến khoa học quan trọng” ⇒ NOT GIVEN. Bẫy: cùng từ khoá walk, scientists." },
          { q: "6. Parents who fill their children's afternoons with activities have good motives.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “Their intentions are admirable.” intentions → motives; admirable → good ⇒ YES." },
          { q: "7. Structured activities for children cost less today than they did in the past.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn D nói structured activities dạy kỹ năng hữu ích; không hề nói về chi phí ⇒ NOT GIVEN. Bẫy: chủ đề có trong bài, điểm bị hỏi thì không." },
          { q: "8. Being able to direct one's own attention will probably be more valuable than an additional music qualification.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “I suspect that this ability will matter more in adult life than one more music certificate.” I suspect → probably; matter more → more valuable ⇒ YES (mức độ khớp: cả hai đều rào đón)." },
          { q: "9. Critics who call the value of boredom a fashionable idea are completely mistaken.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn E: “There is some truth in this.” Tác giả đồng ý một phần; “completely mistaken” là tuyệt đối ⇒ NO." },
        ],
      },
      { t: "p", text: "**Questions 10–13.** Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq", id: "t3d23-doc-suy-luan", title: "Questions 10–13 — Multiple choice (quan điểm · mục đích)",
        items: [
          { q: "10. In paragraph E, what point does the writer make about long-term boredom?", options: ["It is harmless as long as people choose it.", "It must not be confused with short, voluntary pauses.", "It affects teenagers more seriously than adults.", "Its dangers have been exaggerated by researchers."], correct: 1, why: "“A short, chosen pause is very different from months of empty days” ⇒ B. A sai: bài nói boredom dài hạn gắn với hành vi xấu. C: bài kể cả người lớn lẫn thiếu niên, không so ai nặng hơn. D: tác giả chấp nhận bằng chứng (“ignore the evidence” là chê người khen quá lời)." },
          { q: "11. The writer mentions a ‘two-year-old magazine’ in paragraph F in order to", options: ["show that waiting rooms used to be more pleasant.", "criticise the quality of printed media.", "admit that the past was not better in every respect.", "suggest that reading is healthier than using a phone."], correct: 2, why: "Câu trước: “Nor am I suggesting that technology is the enemy… nobody would seriously argue that we should return to…” ⇒ tác giả nhượng bộ: quá khứ không hẳn tốt hơn ⇒ C. A ngược ý; B, D đúng nghĩa đen của “magazine” nhưng sai mục đích." },
          { q: "12. What does the writer imply about technology companies?", options: ["They are unlikely to encourage people to use their products less.", "They are unaware of the effects of their products.", "They deliberately make their users unhappy.", "They should be prevented from selling to schools."], correct: 0, why: "“have little reason to help: their income depends on how many minutes we spend…” ⇒ không có động lực khuyến khích dùng ít đi ⇒ A. B, C, D không có căn cứ trong bài." },
          { q: "13. Which of the following best describes the writer's view of banning phones in schools?", options: ["It is the most effective solution available.", "It has failed wherever it has been tried.", "It should be extended to the workplace.", "It is too crude in general, though possibly suitable for younger children."], correct: 3, why: "Đoạn G: “a blunt answer to a subtle problem, although it may suit younger pupils.” blunt → crude; may suit → possibly suitable ⇒ D." },
        ],
      },
      {
        t: "table",
        caption: "Bảng đáp án + loại bẫy (chấm xong mới xem)",
        head: ["Câu", "Đáp án", "Đoạn", "Bẫy / kỹ năng"],
        rows: [
          ["1", "NO", "A", "Ý người khác (Most commentators) ≠ ý tác giả"],
          ["2", "NO", "B", "Trái ý trực tiếp: nor is it the same as"],
          ["3", "YES", "B", "Paraphrase: useful in the same way as → comparable function"],
          ["4", "NO", "C", "Từ cực đoan: proves ≠ does not prove a general law"],
          ["5", "NOT GIVEN", "C", "Cùng từ khoá, khác điểm hỏi; thêm “majority”"],
          ["6", "YES", "D", "Paraphrase từ thái độ: admirable → good motives"],
          ["7", "NOT GIVEN", "D", "Chủ đề có, thông tin (chi phí) không có"],
          ["8", "YES", "D", "Khớp mức độ: I suspect → probably"],
          ["9", "NO", "E", "Đồng ý một phần ≠ completely mistaken"],
          ["10", "B", "E", "Ý chính của đoạn nhượng bộ"],
          ["11", "C", "F", "Mục đích của ví dụ — đọc câu đứng trước"],
          ["12", "A", "F", "Suy luận từ “have little reason to help”"],
          ["13", "D", "G", "Hai vế: blunt (chê) + although it may suit (nhượng bộ)"],
        ],
      },
      { t: "note", title: "📌 Chấm điểm và học lại", items: [
        "**11–13 đúng**: bạn đã ở mức band 6.5–7 cho dạng này. Sang Tập 4 Ngày 5 sẽ gặp lại ở Passage 3.",
        "**9–10 đúng**: đạt mục tiêu band 6. Xem lại câu sai thuộc loại bẫy nào trong bảng trên và ghi vào sổ lỗi.",
        "**≤ 8 đúng**: đọc lại mục 2 và 3, rồi làm lại bài sau 2 ngày. Sai nhiều ở câu 1, 9 ⇒ bạn chưa tách “ai nói”; sai ở 4, 5 ⇒ chưa nhìn từ mức độ; sai ở 5, 7 ⇒ còn tự thêm ý vào bài.",
        "Làm quá 20 phút? Lần sau bỏ hẳn việc đọc kỹ cả bài trước; skim 2 phút rồi đi theo câu hỏi.",
      ] },

      { t: "h", text: "8. Soi lại bài: ngữ pháp hôm nay là chỗ tác giả lộ quan điểm" },
      { t: "p", text: "Mở lại bài “In Defence of Boredom” và tìm các mệnh đề danh ngữ, khung It… — gần như chỗ nào có chúng, chỗ đó là quan điểm của tác giả (và là chỗ ra câu hỏi)." },
      {
        t: "table",
        head: ["Câu trong bài", "Cấu trúc (bài 1 hôm nay)", "Lộ điều gì"],
        rows: [
          ["**What they cannot teach is how to decide**, alone, **what to do next**.", "What + S + V + is + wh-clause; wh- + to V", "Luận điểm chính của đoạn D"],
          ["**I suspect that** this ability will matter more…", "S + V + that-clause", "Ý tác giả, có rào đón (→ câu 8)"],
          ["**It is worth being clear about what boredom is.**", "about + wh-clause (trật tự câu kể)", "Báo trước một định nghĩa"],
          ["**Whether this will make anyone more creative is uncertain.**", "Whether-clause làm chủ ngữ + is", "Tác giả dè dặt"],
          ["**What it will do is give** the mind a regular chance…", "What + S + V + is + V", "Kết luận của cả bài"],
          ["their income **depends on how many minutes we spend**…", "giới từ + wh-clause", "Căn cứ cho câu 12"],
          ["Phones **have made it easier to** learn a language…", "make + it + adj + to V", "Nhượng bộ: công nghệ có ích"],
        ],
      },

      { t: "h", text: "9. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "vanish", pos: "v", ipa: "/ˈvænɪʃ/", vi: "biến mất (đột ngột / hoàn toàn)", ex: "Many traditional jobs have vanished in the last twenty years.", exVi: "Nhiều nghề truyền thống đã biến mất trong hai mươi năm qua.", more: "**vanish** completely / without trace · = disappear (trang trọng hơn)" },
          { w: "wander", pos: "v", ipa: "/ˈwɒndə/", vi: "đi lang thang; (tâm trí) nghĩ vẩn vơ", ex: "My mind often wanders during long meetings.", exVi: "Đầu óc tôi hay nghĩ vẩn vơ trong các cuộc họp dài.", more: "let your mind **wander** · wander around the town · dễ nhầm với **wonder** /ˈwʌndə/ (tự hỏi)" },
          { w: "admirable", pos: "adj", ipa: "/ˈædmərəbl/", vi: "đáng khen, đáng ngưỡng mộ", ex: "Her intentions were admirable, but the plan failed.", exVi: "Ý định của cô ấy đáng khen, nhưng kế hoạch thất bại.", more: "trọng âm ở âm tiết **đầu** · admire (v) · admiration (n)" },
          { w: "neglect", pos: "v, n", ipa: "/nɪˈɡlekt/", vi: "bỏ bê, sao nhãng", ex: "Parents who work long hours worry that they neglect their children.", exVi: "Cha mẹ làm việc nhiều giờ lo rằng mình bỏ bê con cái.", more: "a **neglected** child / building · neglect your duties" },
          { w: "beneficial", pos: "adj", ipa: "/ˌbenɪˈfɪʃl/", vi: "có lợi", ex: "A short break can be beneficial to concentration.", exVi: "Một quãng nghỉ ngắn có thể có lợi cho sự tập trung.", more: "**beneficial to / for** · mutually beneficial · benefit (n, v)" },
          { w: "blunt", pos: "adj", ipa: "/blʌnt/", vi: "cùn; (cách làm) thô, thiếu tinh tế; (lời nói) thẳng thừng", ex: "A total ban is a blunt tool for a complex problem.", exVi: "Cấm hoàn toàn là một công cụ thô cho một vấn đề phức tạp.", more: "a **blunt** instrument / answer · to be blunt = nói thẳng · ≠ subtle (tinh tế)" },
          { w: "deliberately", pos: "adv", ipa: "/dɪˈlɪbərətli/", vi: "một cách cố ý, có chủ đích", ex: "She deliberately left her phone at home.", exVi: "Cô ấy cố ý để điện thoại ở nhà.", more: "= on purpose, intentionally · deliberate (adj) · ≠ accidentally" },
          { w: "exaggeration", pos: "n", ipa: "/ɪɡˌzædʒəˈreɪʃn/", vi: "sự phóng đại, nói quá", ex: "It is no exaggeration to say that the internet has changed everything.", exVi: "Không quá lời khi nói internet đã thay đổi mọi thứ.", more: "It is **no exaggeration to say that**… · exaggerate (v) · a slight / gross exaggeration" },
        ],
      },
      { t: "note", title: "💡 Cách học sau bài", items: [
        "Chép 5 cụm lộ quan điểm vào sổ: **I am not convinced · There is some truth in this · strikes me as · nobody would seriously argue that · it would be dishonest to**. Bài 3 hôm nay dùng lại chúng khi nói.",
        "Hai ngày nữa làm lại Questions 1–9 không nhìn giải thích; mỗi câu tự nói ra “ai nói — mức độ — từng vế”.",
        "Gặp dạng này ở Online Test mà sai ⇒ phiếu điểm sẽ dẫn bạn về đúng bài này.",
      ] },
    ],
  },
  /* ═══════════════════════ BÀI 3 — NÓI ═══════════════════════ */
  {
    id: "t3d23-noi",
    kind: "speaking",
    title: "Part 3: câu hỏi đánh giá — “Is it a good thing that…?”",
    goal: "Trả lời câu hỏi đánh giá của Part 3 trong 35–45 giây ở mức band 6: nêu phán quyết có mức độ, một mặt tốt có ví dụ, một mặt chưa tốt hoặc điều kiện, rồi chốt — và dùng ngữ điệu đối lập để người nghe nghe ra hai mặt.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        items: [
          "Câu hỏi **đánh giá** (evaluation): giám khảo nêu một hiện tượng có thật và hỏi nó **tốt hay xấu**. Khác câu “Do you agree…?” (Ngày 10) ở chỗ không có ý kiến nào để đồng ý — bạn phải tự ra phán quyết.",
          "Khung **Đ – T – N – C**: **Đ**ánh giá có mức độ → mặt **T**ốt + ví dụ → **N**hưng (mặt chưa tốt / với ai thì không tốt) → **C**hốt bằng điều kiện.",
          "Dùng ngay ngữ pháp bài 1: **What I like about it is that… · It's a shame that… · Whether it's a good thing depends on…**",
          "Nối Ngày 14 (ưu – nhược), Ngày 10 (đồng ý theo mức), Ngày 19 (Some people say…): hôm nay ghép cả ba thành một câu trả lời có **phán quyết**.",
          "🔊 **Ngữ điệu đối lập**: nhấn hai từ đối nhau (good for **COM**panies, not for **WOR**kers), vế đầu giọng lơ lửng, vế sau hạ xuống.",
          "Đẩy **FC** (nói dài sẵn lòng, có từ nối) + **GRA** (câu phức) + **P** (ngữ điệu) của band 6.",
        ],
      },

      { t: "h", text: "1. Câu hỏi đánh giá trông thế nào — và band 5 hụt ở đâu" },
      {
        t: "table",
        caption: "Năm kiểu hỏi, cùng một việc: ra phán quyết",
        head: ["Kiểu hỏi", "Ví dụ", "Giám khảo muốn nghe"],
        rows: [
          ["Is it a good thing that…?", "Is it a good thing that people are living longer?", "tốt / xấu + với ai + vì sao"],
          ["Is this a positive or negative development?", "More people shop online. Is this positive?", "phán quyết + hai mặt"],
          ["Do you think it's good for X to…?", "Do you think it's good for children to have smartphones?", "tốt cho **nhóm X** không"],
          ["How do you feel about the fact that…?", "How do you feel about the fact that many shops are closing?", "thái độ + lý do"],
          ["Is it better to… or…?", "Is it better to rent or to buy a home?", "chọn + điều kiện"],
        ],
      },
      {
        t: "table",
        caption: "Band 5 và band 6 ở câu hỏi đánh giá",
        head: ["Tiêu chí", "Band 5 hay làm", "Band 6 làm"],
        rows: [
          ["FC", "“Yes, it's good.” + 1 lý do, 15 giây, hết", "Phán quyết → mặt tốt → mặt chưa tốt → chốt; 35–45 giây"],
          ["LR", "good · bad · convenient lặp lại", "a mixed blessing · the downside · does more harm than good · a real benefit"],
          ["GRA", "câu đơn; “it is good thing”", "What I like is that… · Whether… depends on… · as long as…"],
          ["P", "giọng đều, không nghe ra đâu là “nhưng”", "nhấn cặp từ đối lập, hạ giọng ở vế chốt"],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận: ba kiểu trả lời làm tụt điểm", items: [
        "**Chỉ nói một mặt** rồi dừng: câu hỏi đánh giá gần như luôn có hai mặt; bỏ mặt kia là bỏ nửa câu trả lời.",
        "**Hai mặt nhưng không có phán quyết**: “It has advantages and disadvantages.” — rồi sao? Giám khảo hỏi “Is it a good thing?”, bạn phải trả lời **có / không / tuỳ**.",
        "**Kể chuyện mình quá dài**: Part 3 hỏi về xã hội. Một ví dụ cá nhân 1 câu thì tốt; cả câu trả lời về mình là lạc sang Part 1.",
      ] },

      { t: "h", text: "2. Khung Đ – T – N – C" },
      {
        t: "sodo", kind: "flow", title: "Một câu trả lời 35–45 giây (5–7 câu)",
        steps: [
          { label: "Đ — Đánh giá", sub: "1 câu: tốt tới mức nào · On the whole, yes — but not for everyone." },
          { label: "T — mặt Tốt", sub: "1–2 câu + ví dụ · What I like about it is that…" },
          { label: "N — Nhưng", sub: "1–2 câu: mặt chưa tốt / nhóm bị thiệt · At the same time, …" },
          { label: "C — Chốt", sub: "1 câu: điều kiện / cân lại · So it's a good thing, as long as…" },
        ],
      },
      { t: "p", text: "Thứ tự T rồi N dùng khi phán quyết của bạn **nghiêng về tốt**. Nếu bạn thấy **xấu nhiều hơn**, đảo lại: Đ (mostly negative) → N trước → “That said, there is one good side…” → C. Nguyên tắc: **mặt bạn tin nhiều hơn nói trước và nói dài hơn** — giống cách xếp thân bài “outweigh” ở Ngày 14." },
      { t: "rule", formula: "Đánh giá có mức độ → What I like is that… + ví dụ → At the same time, … → So… as long as…", vi: "Bốn bước cho mọi câu hỏi đánh giá; mặt mình tin hơn nói trước, nói dài hơn." },

      { t: "h", text: "3. Bước Đ — phán quyết có mức độ" },
      { t: "p", text: "Đừng mở bằng “Yes” trơ trọi. Một câu mở tốt cho giám khảo biết ngay **hướng** và **mức**: bạn thấy tốt hẳn, tốt nhiều hơn xấu, hai mặt ngang nhau, hay đáng lo." },
      {
        t: "table",
        caption: "Thang 5 bậc — chọn một câu mở",
        head: ["Mức", "Câu mở", "Nghĩa"],
        rows: [
          ["++ tốt hẳn", "Definitely. I think it's a really positive thing.", "Chắc chắn rồi, rất tích cực"],
          ["+ nghiêng tốt", "On the whole, yes — though not for everyone. · Mostly, yes.", "Nhìn chung là có, dù không phải với ai cũng vậy"],
          ["± hai mặt", "It's a bit of a mixed blessing, to be honest. · Yes and no.", "Vừa lợi vừa hại"],
          ["− nghiêng xấu", "I'm not sure it is, actually. · I think it does more harm than good.", "Tôi không chắc là tốt; hại nhiều hơn lợi"],
          ["−− đáng lo", "Honestly, I find it quite worrying.", "Tôi thấy khá đáng lo"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "I think it's great / a shame / worrying + that + S + V", vi: "Phán quyết + that-clause (It is + adj + that của bài 1, bản nói)", examples: [
            { en: "I think it's great that more women are studying engineering.", vi: "Tôi nghĩ thật tuyệt khi ngày càng nhiều phụ nữ học kỹ thuật." },
            { en: "It's a shame that so many small bookshops are closing.", vi: "Thật tiếc là nhiều hiệu sách nhỏ đang đóng cửa." },
          ] },
          { formula: "Whether it's a good thing depends on + N / Wh- + S + V", vi: "Mở kiểu “tuỳ” nhưng có tổ chức (nối “It depends” Ngày 6)", examples: [
            { en: "Whether it's a good thing depends on who you ask.", vi: "Tốt hay không tuỳ bạn hỏi ai." },
            { en: "I suppose it depends on how old the child is.", vi: "Tôi cho là tuỳ đứa trẻ bao nhiêu tuổi." },
          ] },
          { formula: "It's good for + nhóm A, but not so good for + nhóm B", vi: "Phán quyết tách theo nhóm (bảng trục chia nhóm Ngày 6)", examples: [
            { en: "It's good for consumers, but not so good for local shops.", vi: "Tốt cho người tiêu dùng, nhưng không tốt lắm cho cửa hàng địa phương." },
          ] },
        ],
      },

      { t: "h", text: "4. Bước T và N — nói hai mặt bằng mệnh đề danh ngữ" },
      { t: "p", text: "Ở Ngày 14 bạn đã có “One advantage is… / One drawback is…”. Hôm nay nâng lên bằng khung **What… is that…** và **The… thing is that…** — chúng cho bạn 1 giây nghĩ ý trong khi miệng vẫn nói, và giám khảo nghe ra câu phức." },
      {
        t: "table",
        caption: "Khung mở mặt tốt / mặt chưa tốt",
        head: ["Mặt tốt (T)", "Mặt chưa tốt (N)"],
        rows: [
          ["**What I like about it is that**…", "**What worries me is that**…"],
          ["**The good thing is that**…", "**The downside is that**… · **The trouble is that**…"],
          ["**One real benefit is that**…", "**The problem is that**…"],
          ["It **makes it easier (for people) to**…", "It **makes it harder (for people) to**…"],
          ["It **means that** people can…", "It **means that** people no longer…"],
        ],
      },
      {
        t: "table",
        caption: "Từ nối đối lập khi NÓI — đừng chỉ có but",
        head: ["Cụm", "Dùng khi", "Ví dụ"],
        rows: [
          ["At the same time, …", "thêm mặt kia, nhẹ nhàng", "At the same time, it's not so great for beginners."],
          ["Having said that, … · That said, …", "vừa nói xong một ý mạnh, giờ rào lại", "Having said that, I wouldn't want to do it every day."],
          ["Then again, …", "tự phản biện, rất tự nhiên", "Then again, maybe I'm just old-fashioned."],
          ["On the other hand, …", "mặt đối lập rõ (không cần On the one hand)", "On the other hand, it costs a fortune."],
          ["…, whereas / while…", "so hai nhóm trong một câu (Ngày 21)", "Adults can control it, whereas children often can't."],
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai", items: [
        "~~Although it is convenient, but it is expensive.~~ → **Although** it is convenient, it is expensive. / It is convenient, **but** it is expensive. (không dùng cả hai — nối Ngày 21)",
        "~~The good thing is people can save time.~~ Nói thì chấp nhận được, nhưng thêm **that** nghe rõ ràng hơn: The good thing is **that** people can save time.",
        "~~In the other hand~~ → **On** the other hand. ~~In the same time~~ → **At** the same time.",
        "~~It is good thing.~~ → It is **a** good thing. (thing đếm được)",
        "Đừng mở cả hai mặt bằng cùng một khung. Mặt tốt dùng “What I like…”, mặt xấu đổi sang “The downside is…”.",
      ] },

      { t: "h", text: "5. Bước C — chốt bằng điều kiện" },
      { t: "p", text: "Câu chốt band 5: “So I think it is good.” (lặp lại câu mở). Câu chốt band 6 **thêm một điều kiện** hoặc **cân lại hai mặt** — cho thấy bạn đã nghĩ, không chỉ liệt kê." },
      {
        t: "patterns",
        rows: [
          { formula: "So overall it's a good thing, as long as / provided (that) + S + V", vi: "Tốt, miễn là…", examples: [
            { en: "So overall it's a good thing, as long as parents set some limits.", vi: "Nên nhìn chung là tốt, miễn là cha mẹ đặt vài giới hạn." },
          ] },
          { formula: "So I'd say the benefits outweigh the drawbacks — but only just.", vi: "Lợi nhiều hơn hại — nhưng sát nút (nối outweigh Ngày 14)", examples: [
            { en: "So I'd say the benefits outweigh the drawbacks, at least for now.", vi: "Nên tôi cho rằng lợi nhiều hơn hại, ít nhất là lúc này." },
          ] },
          { formula: "In the end, it comes down to + how / whether + S + V", vi: "Rốt cuộc, mấu chốt là…", examples: [
            { en: "In the end, it comes down to how people use it.", vi: "Rốt cuộc, mấu chốt là người ta dùng nó thế nào." },
          ] },
        ],
      },
      { t: "rule", formula: "So overall it's a good thing, as long as + S + V  ·  It comes down to + how / whether + S + V", vi: "Chốt = phán quyết + điều kiện; không lặp nguyên câu mở." },
      {
        t: "quiz", id: "t3d23-noi-khung-dich", title: "Dịch Việt → Anh — dùng khung câu (6 câu)", kind: "translate", grammar: "What I like is that… · The downside is that… · as long as…",
        items: [
          { q: "Nhìn chung là có, dù không phải với ai cũng vậy.", answers: ["On the whole, yes, though not for everyone.", "On the whole, yes — though not for everyone.", "On the whole yes, though not for everyone.", "On the whole, yes, but not for everyone.", "On the whole, yes — but not for everyone."], hint: "On the whole, yes — though not for…" },
          { q: "Điều tôi thích ở nó là mọi người tiết kiệm được thời gian.", answers: ["What I like about it is that people save time.", "What I like about it is that people can save time.", "What I like about it is people can save time.", "What I like about it is that everyone can save time."], hint: "What I like about it is that…" },
          { q: "Mặt trái là nó khiến mọi người khó gặp bạn bè hơn.", answers: ["The downside is that it makes it harder for people to meet friends.", "The downside is that it makes it harder for people to meet their friends.", "The downside is that it makes it harder to meet friends.", "The downside is that it makes it more difficult for people to meet friends.", "The downside is it makes it harder for people to meet their friends."], hint: "The downside is that it makes it harder (for sb) to V" },
          { q: "Điều làm tôi lo là trẻ em ngủ ít đi.", answers: ["What worries me is that children sleep less.", "What worries me is that children are sleeping less.", "What worries me is that kids sleep less.", "What worries me is that children get less sleep.", "What worries me is that kids are sleeping less."], hint: "What worries me is that…" },
          { q: "Nên nhìn chung đó là điều tốt, miễn là nó có giá phải chăng.", answers: ["So overall it's a good thing, as long as it's affordable.", "So overall it is a good thing, as long as it is affordable.", "So overall, it's a good thing as long as it's affordable.", "So overall it's a good thing, provided that it's affordable.", "So overall it's a good thing as long as it's affordable.", "So overall it's a good thing, provided it's affordable."], hint: "So overall… as long as it's affordable" },
          { q: "Rốt cuộc, mấu chốt là người ta dùng nó thế nào.", answers: ["In the end, it comes down to how people use it.", "In the end it comes down to how people use it.", "In the end, it all comes down to how people use it."], hint: "it comes down to how + S + V" },
        ],
      },

      { t: "h", text: "6. Hai câu trả lời mẫu cho cùng câu hỏi: band 5 và band 6" },
      { t: "p", text: "Câu hỏi: **Is it a good thing that so many people now work from home?** Nghe bản band 5 trước, tự đoán nó thiếu bước nào của khung Đ – T – N – C, rồi nghe bản band 6." },
      {
        t: "dialogue", title: "Bản band 5 (ước tính) — khoảng 15 giây, 36 từ",
        lines: [
          { who: "Examiner", role: "examiner", text: "Is it a good thing that so many people now work from home?", vi: "Việc ngày nay rất nhiều người làm việc ở nhà có phải là điều tốt không?" },
          { who: "Candidate", role: "candidate", text: "Yes, it is good thing. Work from home is very convenient. People don't need go to office and they can save time. But sometimes it is boring. I think it is good for everyone.", vi: "Vâng, đó là điều tốt. Làm ở nhà rất tiện. Mọi người không cần tới văn phòng và họ tiết kiệm thời gian. Nhưng đôi khi nó chán. Tôi nghĩ nó tốt cho mọi người." },
        ],
      },
      {
        t: "dialogue", title: "Bản band 6 – 6.5 (ước tính) — khoảng 42 giây, 112 từ",
        lines: [
          { who: "Examiner", role: "examiner", text: "Is it a good thing that so many people now work from home?", vi: "Việc ngày nay rất nhiều người làm việc ở nhà có phải là điều tốt không?" },
          { who: "Candidate", role: "candidate", text: "On the whole, yes, I'd say it's a good thing — but not for everyone. What I like about it is that people get their time back. My sister used to spend two hours a day on the bus, and now she has breakfast with her kids instead. At the same time, it's not so great for people who've just started their careers, because it's really hard to learn from colleagues you only see on a screen. So whether it's a good thing depends on what stage you're at. For experienced staff it's a real benefit, as long as they still meet the team now and then.", vi: "Nhìn chung là có, tôi cho đó là điều tốt — nhưng không phải với ai cũng vậy. Điều tôi thích là mọi người lấy lại được thời gian. Chị tôi từng mất hai tiếng mỗi ngày trên xe buýt, giờ thì chị ăn sáng với các con. Đồng thời, nó không hay lắm với người mới bắt đầu sự nghiệp, vì rất khó học hỏi từ những đồng nghiệp mình chỉ thấy qua màn hình. Nên tốt hay không tuỳ bạn đang ở giai đoạn nào. Với nhân viên có kinh nghiệm thì đó là lợi ích thật, miễn là họ vẫn thỉnh thoảng gặp nhóm." },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Bản band 5", "Bản band 6"],
        rows: [
          ["FC", "5 câu ngắn rời; mặt xấu chỉ 1 câu “it is boring”; chốt mâu thuẫn (vừa nói boring lại “good for everyone”)", "Đủ Đ – T – N – C; từ nối: On the whole · At the same time · So · as long as; 42 giây không phải dừng"],
          ["LR", "good · convenient · boring · save time", "get their time back · started their careers · a real benefit · now and then"],
          ["GRA", "lỗi: ~~it is good thing~~ · ~~Work from home is~~ · ~~don't need go~~; toàn câu đơn", "What I like about it is that… · whether it's… depends on what stage… · colleagues (that) you only see · used to; lỗi không đáng kể"],
          ["P", "(nghe) đều giọng, không nhấn", "nhấn đối lập: **experienced** staff ↔ people who've **just started**; hạ giọng ở “now and then”"],
        ],
      },
      { t: "p", text: "Thêm một mẫu cho kiểu “Do you think it's good for X to…?” — phán quyết **hai mặt ngang nhau**, mặt xấu nói trước vì người nói lo nhiều hơn." },
      {
        t: "dialogue", title: "Bản band 6 — “mixed blessing” (khoảng 40 giây, 104 từ)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you think it's good for young children to have their own smartphones?", vi: "Bạn có nghĩ trẻ nhỏ có điện thoại thông minh riêng là điều tốt không?" },
          { who: "Candidate", role: "candidate", text: "Hmm, it's a bit of a mixed blessing, to be honest. What worries me is that a seven-year-old can't really control how long they spend on it — even adults find that difficult. And it's a shame that some kids would rather watch videos than play outside. Having said that, I can see why parents do it. It makes it much easier to stay in touch, especially if both parents work late. So I wouldn't say it's a bad thing in itself. It comes down to whether the parents set clear rules — a phone with limits is fine, but a phone with no limits probably isn't.", vi: "Ừm, thật lòng thì nó vừa lợi vừa hại. Điều làm tôi lo là một đứa trẻ bảy tuổi không thật sự kiểm soát được mình dùng bao lâu — đến người lớn còn thấy khó. Và thật tiếc là một số bé thà xem video còn hơn chơi ngoài trời. Dù vậy, tôi hiểu vì sao cha mẹ làm thế. Nó giúp giữ liên lạc dễ hơn nhiều, nhất là khi cả hai cha mẹ làm về muộn. Nên tôi không cho rằng tự nó là điều xấu. Mấu chốt là cha mẹ có đặt quy tắc rõ ràng không — điện thoại có giới hạn thì ổn, còn không giới hạn thì có lẽ là không." },
        ],
      },
      { t: "note", title: "💡 Soi bản mẫu thứ hai", items: [
        "**Đ**: a bit of a mixed blessing, to be honest. **N trước** (2 câu): What worries me is that… · it's a shame that…",
        "**Chuyển mặt**: Having said that, I can see why parents do it. (wh-clause sau see) → **T**: It makes it much easier to stay in touch.",
        "**C**: It comes down to whether the parents set clear rules + câu đối lập **with limits ↔ with no limits** (đọc to câu này để tập ngữ điệu ở mục 8).",
        "Mệnh đề danh ngữ trong 40 giây: 5 cái (that… ×2, how long…, why…, whether…). Bạn chỉ cần 2–3 là đủ band 6.",
      ] },
      {
        t: "mcq", id: "t3d23-noi-chon", title: "Chọn câu hợp khung Đ – T – N – C (6 câu)",
        items: [
          { q: "“Is it a good thing that people are living longer?” — Câu MỞ tốt nhất:", options: ["Yes.", "People are living longer because of medicine.", "On the whole, yes — though it does create some challenges.", "My grandmother is ninety years old."], correct: 2, why: "Có phán quyết + mức độ + báo trước mặt kia. B giải thích nguyên nhân (không ai hỏi); D kể chuyện mình." },
          { q: "Câu nào mở MẶT TỐT đúng ngữ pháp?", options: ["What I like about it is that families spend more time together.", "What I like about it that families spend more time together.", "What do I like about it is families spend more time together.", "That I like about it is families spend more time together."], correct: 0, why: "What + S + V + is + that-clause; không đảo, không dùng That thay What." },
          { q: "Vừa nói xong mặt tốt, muốn chuyển sang mặt chưa tốt. Chọn câu tự nhiên nhất khi NÓI:", options: ["Nevertheless, notwithstanding the above, …", "In the other hand, …", "But although it is good, but …", "Having said that, it isn't cheap."], correct: 3, why: "Having said that = tự nhiên khi nói. A quá trang trọng; B sai giới từ; C dùng cả although lẫn but." },
          { q: "Câu CHỐT nào đạt mức band 6?", options: ["So I think it is good.", "So overall it's a positive thing, provided that it doesn't replace real contact.", "That's all.", "So it has advantages and disadvantages."], correct: 1, why: "Phán quyết + điều kiện. A lặp câu mở; D không có phán quyết." },
          { q: "“How do you feel about the fact that many small shops are closing?” — Câu mở hợp nhất:", options: ["I agree with that.", "Yes, it is.", "The shops are closing because of the internet.", "Honestly, I think it's a real shame."], correct: 3, why: "Câu hỏi hỏi **cảm nhận** ⇒ nêu thái độ. A: không có ý kiến nào để agree; B: không phải câu hỏi Yes / No." },
          { q: "Câu nào tách phán quyết theo NHÓM?", options: ["It's great for big companies, but not so good for their staff.", "It is very good and very bad.", "It depends.", "Some people like it."], correct: 0, why: "good for A, but not so good for B — tách hai nhóm rõ; C thiếu “depends on gì”." },
        ],
      },

      { t: "h", text: "7. Phát âm: ngữ điệu đối lập" },
      { t: "p", text: "Khi nói hai thứ **đối nhau** (tốt ↔ xấu, người lớn ↔ trẻ em, lý thuyết ↔ thực tế), tiếng Anh làm hai việc cùng lúc. (1) **Nhấn mạnh hai từ đối nhau** — to hơn, dài hơn, cao hơn — kể cả khi bình thường từ đó không được nhấn. (2) **Vế đầu giọng lơ lửng** (xuống rồi hơi lên ↘↗: báo “còn nữa”), **vế sau hạ hẳn** (↘: “xong ý”). Tiếng Việt có thanh điệu nên ta quen giữ cao độ theo từng chữ; nói tiếng Anh đều đều thì người nghe không biết đâu là ý chính, đâu là “nhưng”. Tập 2 Ngày 19 đã dạy ngữ điệu câu hỏi; Ngày 11 dạy ngắt cụm; hôm nay ghép lại." },
      {
        t: "table",
        caption: "Chữ IN HOA = nhấn · ↘↗ = lơ lửng · ↘ = hạ",
        head: ["Câu", "Cách đọc", "Vì sao"],
        rows: [
          ["It's good for companies, but not for workers.", "It's good for **COM**panies ↘↗ | but not for **WOR**kers ↘", "companies ↔ workers là cặp đối lập"],
          ["In theory it works; in practice it doesn't.", "In **THE**ory it works ↘↗ | in **PRAC**tice it **DOES**n't ↘", "theory ↔ practice; works ↔ doesn't"],
          ["I like the idea, but I don't like the price.", "I like the i**DE**a ↘↗ | but I **DON'T** like the **PRICE** ↘", "idea ↔ price; like ↔ don't like"],
          ["It's not the phone, it's the habit.", "It's not the **PHONE** ↘↗ | it's the **HA**bit ↘", "sửa ý: không phải A mà là B"],
          ["a phone WITH limits · a phone with NO limits", "**WITH** limits ↘↗ | with **NO** limits ↘", "giới từ thường yếu, nhưng ở đây mang ý đối lập ⇒ được nhấn"],
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai", items: [
        "Nhấn **mọi** từ như nhau ⇒ mất đối lập. Chỉ 2 từ (mỗi vế 1) được nhấn mạnh nhất; các từ còn lại đọc nhẹ và nhanh.",
        "Hạ giọng xuống hẳn ở cuối vế đầu ⇒ người nghe tưởng bạn nói xong và có thể ngắt lời. Giữ lơ lửng trước **but / whereas / at the same time**.",
        "Nhấn **but** thật to. Không cần: but đọc yếu /bət/; cái cần nhấn là hai từ nội dung đối nhau.",
        "Lên giọng ở cuối cả câu như câu hỏi. Vế sau của phép đối lập là ý bạn chốt ⇒ **xuống**.",
        "Dấu hiệu chữ viết giúp bạn: dấu phẩy trước but, dấu chấm phẩy, dấu gạch ngang = chỗ ngắt cụm và đổi hướng giọng.",
      ] },
      {
        t: "phatam", id: "t3d23-phat-am", title: "Luyện phát âm — ngữ điệu đối lập",
        note: "Bấm “Nghe mẫu” và để ý hai từ được nhấn + chỗ giọng lơ lửng trước dấu phẩy. Đọc theo, cường điệu lên một chút, rồi “Đọc & chấm”. Máy chấm từng âm; ngữ điệu bạn tự nghe lại bản ghi và so với mẫu.",
        items: [
          { text: "good for companies, bad for workers", ipa: "ɡʊd fə kʌmpəniz bæd fə wɜːkəz", vi: "nhấn COMpanies ↔ WORkers" },
          { text: "cheaper, but not better", ipa: "tʃiːpə bət nɒt betə", vi: "nhấn CHEAper ↔ BETter; but đọc yếu" },
          { text: "It's great for adults, but not for children.", ipa: "ɪts ɡreɪt fər ædʌlts bət nɒt fə tʃɪldrən", vi: "Nó tuyệt cho người lớn, nhưng không cho trẻ em." },
          { text: "In theory it works; in practice it doesn't.", ipa: "ɪn θɪəri ɪt wɜːks ɪn præktɪs ɪt dʌznt", vi: "Về lý thuyết thì được; thực tế thì không." },
          { text: "I like the idea, but I don't like the price.", ipa: "aɪ laɪk ði aɪdɪə bət aɪ dəʊnt laɪk ðə praɪs", vi: "Tôi thích ý tưởng, nhưng không thích cái giá." },
          { text: "It's not the phone that's the problem, it's the habit.", ipa: "ɪts nɒt ðə fəʊn ðæts ðə prɒbləm ɪts ðə hæbɪt", vi: "Vấn đề không phải cái điện thoại, mà là thói quen." },
          { text: "On the one hand it saves time; on the other it costs money.", ipa: "ɒn ðə wʌn hænd ɪt seɪvz taɪm ɒn ði ʌðə ɪt kɒsts mʌni", vi: "Một mặt nó tiết kiệm thời gian; mặt khác nó tốn tiền." },
          { text: "Young people love it, whereas older people find it confusing.", ipa: "jʌŋ piːpl lʌv ɪt weəræz əʊldə piːpl faɪnd ɪt kənfjuːzɪŋ", vi: "Người trẻ thích, trong khi người lớn tuổi thấy rối." },
          { text: "What's good for the economy isn't always good for the environment.", ipa: "wɒts ɡʊd fə ði ɪkɒnəmi ɪznt ɔːlweɪz ɡʊd fə ði ɪnvaɪrənmənt", vi: "Cái tốt cho kinh tế không phải lúc nào cũng tốt cho môi trường." },
          { text: "It's a good thing overall, as long as it's affordable.", ipa: "ɪts ə ɡʊd θɪŋ əʊvərɔːl əz lɒŋ əz ɪts əfɔːdəbl", vi: "Nhìn chung là điều tốt, miễn là giá phải chăng." },
        ],
      },
      {
        t: "mcq", id: "t3d23-noi-ngu-dieu", title: "Nhấn từ nào? Giọng đi đâu? (6 câu)",
        items: [
          { q: "“It's cheap for tourists, but expensive for locals.” — Hai từ được nhấn mạnh nhất để nghe ra đối lập theo NHÓM người:", options: ["cheap – but", "It's – for", "tourists – locals", "for – for"], correct: 2, why: "Cặp đối lập về nhóm: TOURists ↔ LOcals (cheap ↔ expensive cũng được nhấn, nhưng but / for / it's thì không)." },
          { q: "“I like the idea, | but I don't like the price.” — Cuối vế đầu (idea), giọng nên:", options: ["hạ hẳn xuống thấp", "lơ lửng (xuống rồi hơi lên)", "lên cao như câu hỏi Yes / No", "giữ thật đều"], correct: 1, why: "Vế đầu chưa xong ý ⇒ fall-rise báo “còn nữa”." },
          { q: "“It's not the PHONE, it's the HABIT.” — Cuối câu (habit), giọng:", options: ["xuống", "lên", "lơ lửng", "ngắt giữa chừng"], correct: 0, why: "Vế sau là ý chốt ⇒ hạ giọng." },
          { q: "Từ nào thường đọc YẾU trong câu đối lập?", options: ["từ nội dung đối nhau thứ nhất", "từ nội dung đối nhau thứ hai", "trợ động từ phủ định (doesn't)", "but"], correct: 3, why: "but là từ chức năng, đọc /bət/; doesn't / don't mang nghĩa phủ định nên vẫn được nhấn." },
          { q: "“A phone WITH limits is fine; a phone with NO limits isn't.” — Vì sao giới từ with được nhấn?", options: ["Vì giới từ luôn được nhấn", "Vì nó đứng đầu câu", "Vì nó mang ý đối lập với “with no”", "Vì nó có một âm tiết"], correct: 2, why: "Từ chức năng được nhấn khi chính nó mang thông tin đối lập." },
          { q: "Nếu đọc cả câu đối lập với một cao độ đều đều, người nghe sẽ:", options: ["khó nhận ra đâu là hai ý đối nhau", "thấy bạn nói rất trôi chảy", "hiểu là bạn đang hỏi", "không ảnh hưởng gì"], correct: 0, why: "Ngữ điệu là thứ đánh dấu cấu trúc thông tin; nói đều ⇒ mất tín hiệu đối lập (tiêu chí P)." },
        ],
      },

      { t: "h", text: "8. Luyện nói — ghi âm, AI chấm" },
      { t: "p", text: "Mỗi câu nói **35–45 giây**. Trước khi bấm ghi, tự nhẩm 4 chữ: **Đ** (mức nào?) – **T** (mặt tốt + ví dụ gì?) – **N** (ai thiệt?) – **C** (điều kiện gì?). Nói xong nghe lại và đánh dấu: có đủ 4 bước không · có ít nhất 2 mệnh đề danh ngữ không · có nghe ra chỗ đối lập không." },
      {
        t: "speak", id: "t3d23-noi-part3", part: "3",
        questions: [
          "Is it a good thing that people can now buy almost everything online?",
          "Do you think it's good for teenagers to have part-time jobs?",
          "More and more young people are moving to big cities. Is this a positive or a negative development?",
          "How do you feel about the fact that many people now get their news from social media?",
        ],
      },
      {
        t: "speak", id: "t3d23-noi-part3-b", part: "3",
        questions: [
          "Is it better for children to grow up in the city or in the countryside?",
          "Is it a good thing that people are living much longer than in the past?",
          "Some companies now let staff choose their own working hours. Is that a good idea?",
        ],
      },
      { t: "note", title: "📌 Sổ Speaking (Tập 3 Ngày 2) — việc sau khi ghi âm", items: [
        "Chép lại **một** câu trả lời của bạn ra giấy, gạch dưới câu Đ và câu C. Hai câu đó có nói cùng một phán quyết không? (Bản band 5 ở mục 6 tự mâu thuẫn.)",
        "Đổi phán quyết: nếu bạn vừa nói “nhìn chung là tốt”, hôm sau trả lời lại cùng câu hỏi với “I'm not sure it is, actually” và đảo thứ tự N trước T sau.",
        "Ghi 3 cụm bạn muốn dùng lần sau (vd a mixed blessing · having said that · it comes down to) và tự đóng vai giám khảo hỏi lại mình vào ngày mai.",
      ] },
    ],
  },
  /* ═══════════════════════ BÀI 4 — BÀI TẬP ═══════════════════════ */
  {
    id: "t3d23-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 23 — mệnh đề danh ngữ · It is + adj + that / to · Yes / No / Not Given · câu hỏi đánh giá",
    goal: "Tự kiểm cả ngày bằng 41 câu có đáp án và một bài nói Part 3; đúng từ 29 câu trở lên là đạt.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Cách làm",
        items: [
          "Làm một mạch, không mở lại bài học. Sáu phần: I–III ngữ pháp (24 câu) · IV đọc YNNG (6 câu) · V nói + ngữ điệu (6 câu) · VI nối câu (5 câu) · rồi ghi âm.",
          "Chấm xong, đếm số câu đúng: **≥ 29 / 41** là đạt. Sai ở phần nào thì quay lại đúng mục ghi cạnh tên phần.",
          "Câu sai chép vào **sổ lỗi** kèm một dòng lý do (vd “sau depends on dùng whether, không dùng if”).",
          "Phần nói: ghi âm xong nghe lại, tự đánh dấu đủ 4 bước Đ – T – N – C chưa.",
        ],
      },

      { t: "h", text: "Phần I — Mệnh đề danh ngữ và khung It is… (10 câu · ôn bài 1 mục 2–6)" },
      {
        t: "mcq", id: "t3d23-bt-chon", title: "Chọn đáp án đúng",
        items: [
          { q: "The survey shows ___ most students prefer online lectures.", options: ["what", "that", "which", "whether"], correct: 1, why: "show + that + S + V (một sự thật)." },
          { q: "Nobody knows ___ the new tax will reduce traffic.", options: ["that", "what", "about", "whether"], correct: 3, why: "Chuyện chưa chắc (câu hỏi Yes / No) ⇒ whether." },
          { q: "Could you explain ___ ?", options: ["how this machine works", "how does this machine work", "how works this machine", "how this machine does work"], correct: 0, why: "Wh- + S + V, không đảo." },
          { q: "___ worries parents most is the cost of university.", options: ["That", "Which", "What", "It"], correct: 2, why: "What + V + is… (what = the thing that)." },
          { q: "It is ___ that sea levels will continue to rise.", options: ["easy", "likely", "difficult", "hard"], correct: 1, why: "likely + that; easy / difficult / hard + to V." },
          { q: "It is difficult ___ a job without experience.", options: ["that graduates find", "for graduates finding", "graduates to find", "for graduates to find"], correct: 3, why: "It is + adj + for sb + to V." },
          { q: "The fact ___ the population is ageing affects every government budget.", options: ["that", "which", "what", "of"], correct: 0, why: "the fact + that + mệnh đề." },
          { q: "Many commuters find ___ to work on a crowded train.", options: ["hard", "that hard", "it hard", "it is hard"], correct: 2, why: "find + it + adj + to V." },
          { q: "Whether the project succeeds ___ on public support.", options: ["depends", "depend", "are depending", "depending"], correct: 0, why: "Mệnh đề làm chủ ngữ ⇒ động từ số ít." },
          { q: "It ___ that half of the world's languages will disappear this century.", options: ["estimates", "is estimating", "has estimated", "is estimated"], correct: 3, why: "It is + V3 + that (bị động vô nhân xưng)." },
        ],
      },

      { t: "h", text: "Phần II — Điền MỘT từ (8 câu · ôn bài 1)" },
      {
        t: "quiz", id: "t3d23-bt-dien", title: "Điền một từ vào chỗ trống", kind: "fill",
        items: [
          { q: "It depends on ___ you want to live near the centre or not.", answers: ["whether"] },
          { q: "___ surprised me was how quiet the city was.", answers: ["What"] },
          { q: "Despite the ___ that petrol is expensive, most people still drive.", answers: ["fact"] },
          { q: "The internet has made ___ possible to study from home.", answers: ["it"] },
          { q: "It is important ___ children to read every day.", answers: ["for"] },
          { q: "I'm not sure ___ to accept the job or wait for a better one.", answers: ["whether"] },
          { q: "The traffic was ___ heavy that we missed the flight.", answers: ["so"] },
          { q: "It was ___ a long film that half the audience fell asleep.", answers: ["such"] },
        ],
      },

      { t: "h", text: "Phần III — Dịch sang tiếng Anh (6 câu · ôn bài 1)" },
      {
        t: "quiz", id: "t3d23-bt-dich", title: "Dịch Việt → Anh", kind: "translate", grammar: "that / wh- / whether-clause · It is + adj + that / to V",
        items: [
          { q: "Bảng cho thấy mỗi nước chi bao nhiêu cho y tế.", answers: ["The table shows how much each country spends on healthcare.", "The table shows how much each country spends on health care.", "The table shows how much each country spends on health.", "The table shows how much every country spends on healthcare."], hint: "shows how much + S + V(s) + on" },
          { q: "Người ta tin rằng âm nhạc giúp trẻ học tốt hơn.", answers: ["It is believed that music helps children learn better.", "It is believed that music helps children to learn better.", "It is believed that music helps children study better.", "It is believed that music helps kids learn better."], hint: "It is believed that" },
          { q: "Điều các thành phố cần là nhiều không gian xanh hơn.", answers: ["What cities need is more green space.", "What cities need is more green spaces.", "What the cities need is more green space."], hint: "What + S + V + is" },
          { q: "Người già thấy khó dùng ứng dụng ngân hàng.", answers: ["Elderly people find it difficult to use banking apps.", "Old people find it difficult to use banking apps.", "Older people find it difficult to use banking apps.", "Elderly people find it hard to use banking apps.", "Old people find it hard to use banking apps.", "Older people find it hard to use banking apps.", "It is difficult for elderly people to use banking apps.", "It is hard for old people to use banking apps.", "It is difficult for older people to use banking apps.", "It is difficult for old people to use banking apps."], hint: "find it difficult to V / It is difficult for… to V" },
          { q: "Tôi không biết tại sao cửa hàng đóng cửa.", answers: ["I don't know why the shop closed.", "I do not know why the shop closed.", "I don't know why the shop has closed.", "I don't know why the shop is closed.", "I don't know why the store closed.", "I don't know why the store is closed."], hint: "why + S + V (không đảo)" },
          { q: "Việc này tốt hay không tuỳ vào cách chúng ta dùng nó.", answers: ["Whether this is good depends on how we use it.", "Whether this is a good thing depends on how we use it.", "Whether it is good depends on how we use it.", "Whether it is a good thing depends on how we use it.", "Whether this is good or not depends on how we use it.", "Whether it's a good thing depends on how we use it."], hint: "Whether… depends on how + S + V" },
        ],
      },

      { t: "h", text: "Phần IV — Yes / No / Not Given (6 câu · ôn bài 2 mục 2–3)" },
      { t: "p", text: "Đọc đoạn văn (khoảng 190 từ) và làm 6 câu trong **7 phút**. Mỗi câu tự hỏi: ai nói — mức độ — từng vế." },
      {
        t: "passage", title: "Should Museums Be Free?",
        paras: [
          { text: "Free admission to national museums is often defended on the grounds that culture belongs to everyone. I agree with the principle, but the argument is usually made carelessly. Supporters assume that removing the ticket price will bring in people who have never visited a museum. The figures suggest otherwise: when charges were dropped in one European capital, visitor numbers rose sharply, yet surveys showed that most of the additional visits were made by people who already went regularly. Free entry, in other words, mainly rewards the existing audience." },
          { text: "This does not mean that charges should return. A ticket price, however small, tells some families that the building is not meant for them, and that message is hard to undo. What museums need, in my opinion, is not a different price but a different welcome: later opening hours, labels that an ordinary visitor can understand, and staff who start conversations. It is sometimes claimed that such changes lower standards. I have seen no evidence that they do. Whether governments will pay for them is another matter; so far, most have preferred to announce free entry and consider the job done." },
        ],
      },
      { t: "p", text: "Do the following statements agree with the views of the writer?" },
      {
        t: "mcq", id: "t3d23-bt-doc", title: "Questions 1–6 — Yes / No / Not Given",
        items: [
          { q: "1. Culture ought to be accessible to all members of society.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“culture belongs to everyone. I agree with the principle” ⇒ YES." },
          { q: "2. Abolishing entrance fees brings in large numbers of first-time visitors.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đây là điều Supporters assume; “The figures suggest otherwise… mainly rewards the existing audience” ⇒ NO." },
          { q: "3. Museums should begin charging for admission again.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“This does not mean that charges should return.” ⇒ NO." },
          { q: "4. Museum staff are paid too little for the work they do.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài có nhắc staff (who start conversations) nhưng không nói gì về lương ⇒ NOT GIVEN." },
          { q: "5. Making museums more welcoming damages their quality.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“It is sometimes claimed that such changes lower standards. I have seen no evidence that they do.” — ý người khác, tác giả bác ⇒ NO." },
          { q: "6. Governments have generally been reluctant to fund improvements beyond free entry.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“so far, most have preferred to announce free entry and consider the job done” ⇒ suy ra chính phủ không muốn chi thêm ⇒ YES (most → generally)." },
        ],
      },

      { t: "h", text: "Phần V — Câu hỏi đánh giá và ngữ điệu đối lập (6 câu · ôn bài 3)" },
      {
        t: "mcq", id: "t3d23-bt-noi", title: "Chọn đáp án đúng",
        items: [
          { q: "“Is it a good thing that fewer people read newspapers?” — Câu mở cho thấy bạn thấy HAI MẶT ngang nhau:", options: ["Definitely.", "Honestly, I find it quite worrying.", "It's a bit of a mixed blessing, to be honest.", "I think it does more harm than good."], correct: 2, why: "a mixed blessing = vừa lợi vừa hại." },
          { q: "Chọn câu ĐÚNG ngữ pháp:", options: ["The downside is that it costs a lot.", "The downside is that costs a lot.", "The downside is which it costs a lot.", "The downside that is it costs a lot."], correct: 0, why: "The downside is + that + S + V (đủ chủ ngữ it)." },
          { q: "Bạn nghiêng về “xấu nhiều hơn tốt”. Thứ tự nào hợp?", options: ["Đ → T → N → C", "T → T → C", "N → C", "Đ → N → T (That said, …) → C"], correct: 3, why: "Mặt mình tin hơn nói trước và dài hơn; vẫn cần Đ mở và C chốt." },
          { q: "“It's good for employers, but not for employees.” — Nhấn mạnh nhất ở:", options: ["good – not", "emPLOYers – employEES", "It's – but", "for – for"], correct: 1, why: "Cặp đối lập; để phân biệt hai từ gần giống, người nói còn dồn nhấn vào phần KHÁC nhau (-ers ↔ -EES)." },
          { q: "Cuối vế đầu của câu đối lập (trước but), giọng nên:", options: ["lơ lửng, chưa hạ hẳn", "hạ hẳn như hết câu", "lên vút như câu hỏi", "nhỏ dần rồi tắt"], correct: 0, why: "Fall-rise báo còn vế sau." },
          { q: "Câu chốt nào có ĐIỀU KIỆN?", options: ["So I think it is good.", "So it has two sides.", "That's my opinion.", "So it's a positive change, provided that nobody is left behind."], correct: 3, why: "provided that + S + V = miễn là." },
        ],
      },

      { t: "h", text: "Phần VI — Nối hai câu thành một (5 câu · ôn bài 1 mục 2, 4, 7)" },
      { t: "p", text: "Viết phần còn thiếu để câu mới giữ nguyên nghĩa. Chấm chính xác từng chữ — chú ý không đảo trợ động từ." },
      {
        t: "quiz", id: "t3d23-bt-noi-cau", title: "Hoàn thành câu viết lại", kind: "fill",
        items: [
          { q: "Why did the shop close? Nobody knows. → Nobody knows why ___ .", answers: ["the shop closed"] },
          { q: "I need a quiet place to study. → What I need ___ a quiet place to study. (1 từ)", answers: ["is"] },
          { q: "The flat is very small. A family cannot live in it. → The flat is too small for a family ___ . (3 từ)", answers: ["to live in"] },
          { q: "People say that the town was founded in 1650. → It ___ that the town was founded in 1650. (2 từ)", answers: ["is said"] },
          { q: "Learning to drive is easy for teenagers. → It is easy ___ to learn to drive. (2 từ)", answers: ["for teenagers"] },
        ],
      },

      { t: "h", text: "Phần VII — Nói Part 3 (ghi âm, AI chấm)" },
      { t: "p", text: "Chọn **hai** trong ba câu. Mỗi câu 35–45 giây, đủ Đ – T – N – C, có ít nhất một khung **What… is that…** và một câu đối lập đọc đúng ngữ điệu." },
      {
        t: "speak", id: "t3d23-bt-noi-ghi-am", part: "3",
        questions: [
          "Is it a good thing that children today learn to use computers at a very young age?",
          "Do you think it's good for a city to attract a lot of tourists?",
          "Fewer people are getting married than in the past. Is this a positive or a negative development?",
        ],
      },
    ],
  },
];
