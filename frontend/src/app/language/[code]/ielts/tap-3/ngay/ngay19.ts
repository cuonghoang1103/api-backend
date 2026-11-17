/**
 * IELTS Tập 3 — Ngày 19 (band 5.0 → 6.0).
 * Bài 1 ngữ pháp: câu tường thuật (câu kể, câu hỏi, mệnh lệnh) + động từ tường thuật học thuật; modal suy đoán hiện tại / quá khứ
 *   (G27 · G28 — ôn G08 từ Tập 1 Ngày 13, câu hỏi gián tiếp Tập 2 Ngày 19, verb patterns Tập 3 Ngày 7).
 * Bài 2 đọc: Matching information 2 (R13 — nối Tập 2 Ngày 16) + Sentence completion.
 * Bài 3 nói: Part 3 tường thuật ý người khác “Some people say…” (S06 — nối Tập 3 Ngày 10) · 🔊 /s/ /z/ /ɪz/ cuối.
 * Mọi bài đọc, câu ví dụ, bài nói mẫu đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_19: Lesson[] = [
  /* ═══════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════ */
  {
    id: "t3d19-ngu-phap",
    kind: "grammar",
    title: "Câu tường thuật + động từ tường thuật học thuật; modal suy đoán",
    goal: "Thuật lại đúng lời nói, câu hỏi, lời yêu cầu của người khác; chọn đúng động từ tường thuật học thuật (claim, argue, suggest…) cho Task 2 và Part 3; suy đoán về hiện tại và quá khứ bằng must / might / can't (have).",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        items: [
          "**Câu tường thuật** (reported speech) = kể lại lời người khác mà **không lặp nguyên văn**: She said (that) she **was** tired. Ba việc phải làm: **lùi thì**, **đổi đại từ**, **đổi từ chỉ thời gian – nơi chốn**.",
          "Tường thuật **câu hỏi** và **mệnh lệnh** có khuôn riêng: asked **if / wh- + S + V** (không đảo ngữ) · told / asked + O + **to V**. Nối lại câu hỏi gián tiếp ở Tập 2 Ngày 19 và verb patterns ở Ngày 7.",
          "**Động từ tường thuật học thuật** (claim, argue, suggest, point out, acknowledge…) thay cho say / think — mỗi từ một **sắc thái**. Đây là thứ đẩy **LR + GRA** của Task 2 từ 5 lên 6.",
          "**Modal suy đoán**: must / might / may / could / can't + V (hiện tại) và + **have V3** (quá khứ); **should have V3** = lẽ ra nên làm. Ôn modal cơ bản từ Tập 1 Ngày 13.",
          "Bài 3 hôm nay (Nói Part 3 “Some people say…”) dùng ngay mọi thứ ở bài này.",
        ],
      },

      { t: "h", text: "1. Lời trực tiếp → lời tường thuật: lùi một thì" },
      { t: "p", text: "**Lời trực tiếp** (direct speech) chép nguyên văn trong ngoặc kép: He said, “I **am** busy.” **Lời tường thuật** (reported speech, còn gọi là lời gián tiếp) kể lại ý đó: He said (that) he **was** busy. Vì bạn kể lại **sau** lúc người ta nói, động từ trong lời nói **lùi về quá khứ một bậc** — gọi là **lùi thì** (backshift). Chữ **that** bỏ được khi nói; khi viết bài thi nên giữ." },
      {
        t: "table",
        caption: "Bảng lùi thì — động từ dẫn ở quá khứ (said, told, explained…)",
        head: ["Lời trực tiếp", "Lời tường thuật", "Ví dụ"],
        rows: [
          ["Hiện tại đơn: **work**", "Quá khứ đơn: **worked**", "“I work at home.” → She said she **worked** at home."],
          ["Hiện tại tiếp diễn: **am working**", "Quá khứ tiếp diễn: **was working**", "“I'm writing a report.” → He said he **was writing** a report."],
          ["Hiện tại hoàn thành: **have worked**", "Quá khứ hoàn thành: **had worked**", "“We have finished.” → They said they **had finished**."],
          ["Quá khứ đơn: **worked**", "Quá khứ hoàn thành: **had worked**", "“I lost my job.” → He said he **had lost** his job."],
          ["**will**", "**would**", "“Prices will rise.” → The minister said prices **would rise**."],
          ["**can** · **may**", "**could** · **might**", "“I can help.” → She said she **could help**."],
          ["**must** / have to", "**had to** (hoặc giữ must)", "“You must apply early.” → He said I **had to** apply early."],
          ["would · could · should · might · used to · had V3", "**giữ nguyên**", "“You should rest.” → The doctor said I **should rest**."],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Ba việc khi đổi sang lời tường thuật",
        steps: [
          { label: "1. Chọn động từ dẫn", sub: "said (that)… · told **me** (that)… · explained that…" },
          { label: "2. Lùi thì", sub: "am → was · will → would · did → had done" },
          { label: "3. Đổi đại từ", sub: "I → he / she · my → his / her · we → they" },
          { label: "4. Đổi thời gian – nơi chốn", sub: "now → then · tomorrow → the next day · here → there" },
        ],
      },
      {
        t: "table",
        caption: "Đổi từ chỉ thời gian – nơi chốn (khi bạn kể lại ở một thời điểm / nơi KHÁC)",
        head: ["Lời trực tiếp", "Lời tường thuật"],
        rows: [
          ["now · today · tonight", "then / at that time · that day · that night"],
          ["tomorrow · next week", "the next day / the following day · the following week"],
          ["yesterday · last year", "the day before / the previous day · the year before / the previous year"],
          ["two days ago", "two days before / earlier"],
          ["here · this · these", "there · that · those"],
        ],
      },
      { t: "p", text: "**Khi nào KHÔNG lùi thì?** Có ba trường hợp, và cả ba đều gặp trong bài thi:" },
      {
        t: "table",
        head: ["Trường hợp", "Ví dụ", "Dùng ở đâu"],
        rows: [
          ["Động từ dẫn ở **hiện tại** (says, argue, claim, have shown)", "Experts **say** that sleep **is** essential. · Many people **argue** that taxes **are** too high.", "**Task 2 và Part 3** — gần như luôn dùng kiểu này"],
          ["Điều được nói **vẫn còn đúng** lúc bạn kể", "She told me (that) her brother **lives** in Da Nang. (giờ vẫn sống ở đó)", "Nói Part 1 / 2 — lùi thì cũng đúng"],
          ["**Sự thật khoa học**, chân lý", "The teacher explained that water **boils** at 100°C.", "Đọc – viết học thuật"],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai",
        items: [
          "Tiếng Việt không chia thì nên hay quên lùi: ~~He said he **is** busy yesterday.~~ → He said he **was** busy.",
          "~~She said me that…~~ → She **told me** that… / She **said** that… / She **said to me** that… (xem mục 4).",
          "Quên đổi đại từ: “I love **my** job,” Lan said. → ~~Lan said that I love my job.~~ → Lan said that **she** loved **her** job.",
          "Giữ nguyên tomorrow / yesterday khi kể lại sau nhiều ngày: ~~He said he would come tomorrow~~ (nói từ tuần trước) → …he would come **the next day**.",
          "Lùi thì cả khi động từ dẫn ở hiện tại: ~~Many people think that technology **made** life easier~~ (ý nói hiện nay) → …technology **makes / has made** life easier.",
        ],
      },
      { t: "rule", formula: "S + said (that) + S + V lùi một thì  ·  S + say / argue (that) + S + V giữ nguyên thì", vi: "Động từ dẫn ở quá khứ ⇒ lùi một thì + đổi đại từ + đổi thời gian. Động từ dẫn ở hiện tại (bài luận, Part 3) ⇒ không lùi." },
      {
        t: "quiz", id: "t3d19-ke-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "S + said / told + O + (that) + S + V lùi thì",
        items: [
          { q: "Cô ấy nói rằng cô ấy đang tìm một công việc mới.", answers: ["She said that she was looking for a new job.", "She said she was looking for a new job."], hint: "said (that) · am looking → was looking" },
          { q: "Quản lý bảo chúng tôi rằng công ty đã mất hai khách hàng lớn.", answers: ["The manager told us that the company had lost two big clients.", "The manager told us the company had lost two big clients.", "The manager told us that the company had lost two major clients.", "The manager told us that the company had lost two big customers."], hint: "told us (that) · has lost / lost → had lost" },
          { q: "Bộ trưởng nói rằng giá vé sẽ không tăng vào năm sau đó.", answers: ["The minister said that fares would not rise the following year.", "The minister said that fares would not increase the following year.", "The minister said that fares wouldn't rise the following year.", "The minister said that fares would not rise the next year.", "The minister said fares would not rise the following year."], hint: "will → would · next year → the following year · fares" },
          { q: "Nhiều chuyên gia nói rằng tập thể dục cải thiện trí nhớ.", answers: ["Many experts say that exercise improves memory.", "Many experts say exercise improves memory.", "Many experts say that exercise improves our memory."], hint: "động từ dẫn ở HIỆN TẠI ⇒ không lùi thì" },
          { q: "Anh ấy nói rằng anh ấy không thể đến cuộc họp hôm đó.", answers: ["He said that he could not come to the meeting that day.", "He said that he couldn't come to the meeting that day.", "He said he couldn't come to the meeting that day.", "He said that he could not attend the meeting that day.", "He said that he couldn't attend the meeting that day."], hint: "can't → couldn't · today → that day" },
        ],
      },
      {
        t: "quiz", id: "t3d19-ke-luyen", title: "Viết lại bằng lời tường thuật — điền dạng đúng của động từ (8 câu)", kind: "fill",
        items: [
          { q: "“I am studying for my exams.” → Minh said he ___ for his exams.", answers: ["was studying"] },
          { q: "“We have never been abroad.” → They said they ___ never been abroad.", answers: ["had"] },
          { q: "“The project will take six months.” → The engineer said the project ___ six months.", answers: ["would take"] },
          { q: "“I missed the last bus.” → She said she ___ the last bus.", answers: ["had missed", "missed"] },
          { q: "“You can borrow my laptop.” → He told me I ___ borrow his laptop.", answers: ["could"] },
          { q: "“I'll call you tomorrow.” → She said she would call me the ___ day.", answers: ["next", "following"] },
          { q: "“The Earth goes round the Sun.” → The teacher explained that the Earth ___ round the Sun.", answers: ["goes"] },
          { q: "“We must leave now.” → They said they ___ to leave then.", answers: ["had"] },
        ],
      },

      { t: "h", text: "2. Tường thuật câu hỏi — không đảo ngữ, không do / does / did" },
      { t: "p", text: "Ở Tập 2 Ngày 19 bạn đã học **câu hỏi gián tiếp** lịch sự (Could you tell me where the station **is**?). Câu hỏi tường thuật dùng **đúng trật tự đó** — chủ ngữ đứng **trước** động từ như câu kể — và thêm một việc: **lùi thì**. Cuối câu là dấu chấm, không phải dấu hỏi." },
      {
        t: "patterns",
        rows: [
          { formula: "S + asked (+ O) + if / whether + S + V lùi thì", vi: "Câu hỏi Yes / No ⇒ thêm if hoặc whether (= liệu… có… không)", examples: [{ en: "“Do you live near here?” → The examiner asked me if I lived near there.", vi: "Giám khảo hỏi tôi có sống gần đó không." }, { en: "“Have you finished?” → She asked whether I had finished.", vi: "Cô ấy hỏi tôi đã xong chưa." }] },
          { formula: "S + asked (+ O) + Wh- + S + V lùi thì", vi: "Câu hỏi có từ để hỏi ⇒ giữ từ để hỏi, bỏ do / does / did", examples: [{ en: "“Where does she work?” → He asked where she worked.", vi: "Anh ấy hỏi cô ấy làm ở đâu." }, { en: "“Why did you choose this course?” → They asked me why I had chosen that course.", vi: "Họ hỏi vì sao tôi đã chọn khoá đó." }] },
          { formula: "S + wanted to know / wondered + if / Wh- + S + V", vi: "Hai động từ dẫn khác cho câu hỏi", examples: [{ en: "The interviewer wanted to know how long I had studied English.", vi: "Người phỏng vấn muốn biết tôi đã học tiếng Anh bao lâu." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Bốn lỗi sai kinh điển",
        items: [
          "Giữ trật tự câu hỏi: ~~He asked where **did she work**.~~ → He asked where **she worked**.",
          "Quên if / whether với câu Yes / No: ~~She asked me I was a student.~~ → She asked me **if** I was a student.",
          "Dùng cả that lẫn if: ~~He asked that if I could help.~~ → He asked **if** I could help.",
          "Ngay trước **or not**, trước **to V** và sau giới từ, chỉ dùng **whether**: I don't know **whether or not** it is true. · They discussed **whether** to close the school. · the question **of whether** it works.",
        ],
      },
      { t: "rule", formula: "S + asked + (O) + if / whether / Wh- + S + V lùi thì", vi: "Câu hỏi tường thuật = trật tự câu kể + lùi thì; Yes/No dùng if / whether, câu Wh- giữ từ để hỏi." },
      {
        t: "quiz", id: "t3d19-hoi-dich", title: "Dịch Việt → Anh (4 câu)", kind: "translate", grammar: "asked + (O) + if / Wh- + S + V",
        items: [
          { q: "Giám khảo hỏi tôi thích sống ở thành phố hay không.", answers: ["The examiner asked me if I liked living in the city.", "The examiner asked me whether I liked living in the city.", "The examiner asked me if I liked living in a city.", "The examiner asked me whether I liked living in a city.", "The examiner asked me whether I liked living in the city or not."], hint: "asked me if / whether · like → liked" },
          { q: "Cô ấy hỏi tôi đã mua cái điện thoại đó ở đâu.", answers: ["She asked me where I had bought that phone.", "She asked where I had bought that phone.", "She asked me where I had bought the phone.", "She asked me where I bought that phone."], hint: "where + S + had bought (không dùng did)" },
          { q: "Họ muốn biết khi nào cây cầu mới sẽ mở cửa.", answers: ["They wanted to know when the new bridge would open.", "They wanted to know when the new bridge would be opened."], hint: "wanted to know when · will → would" },
          { q: "Tôi tự hỏi vì sao rất ít người dùng xe buýt.", answers: ["I wondered why so few people used the bus.", "I wondered why so few people used buses.", "I wonder why so few people use the bus.", "I wonder why so few people use buses.", "I wondered why very few people used the bus."], hint: "wonder why + S + V · so few people" },
        ],
      },
      {
        t: "mcq", id: "t3d19-hoi-luyen", title: "Chọn câu tường thuật đúng (6 câu)",
        items: [
          { q: "“Are you working this weekend?” → She asked me ___", options: ["was I working that weekend.", "if I was working that weekend.", "that I was working that weekend.", "if was I working this weekend."], correct: 1, why: "Câu Yes/No ⇒ if + S + V (I was working), không đảo ngữ; this weekend → that weekend." },
          { q: "“How much does the ticket cost?” → He wanted to know ___", options: ["how much the ticket cost.", "how much did the ticket cost.", "how much does the ticket cost.", "how much cost the ticket."], correct: 0, why: "Bỏ does, chủ ngữ the ticket đứng trước động từ cost (quá khứ của cost vẫn là cost)." },
          { q: "“Why didn't you call me?” → She asked him ___", options: ["why didn't he call her.", "why he doesn't call her.", "why he didn't called her.", "why he hadn't called her."], correct: 3, why: "Quá khứ đơn lùi thành quá khứ hoàn thành: didn't call → hadn't called; trật tự câu kể." },
          { q: "“Will the trains run on Sunday?” → Passengers asked ___", options: ["will the trains run on Sunday.", "that the trains would run on Sunday.", "whether the trains would run on Sunday.", "whether would the trains run on Sunday."], correct: 2, why: "whether + S + would + V. Không dùng that cho câu hỏi." },
          { q: "“Where have you been?” → My mother asked me ___", options: ["where I had been.", "where had I been.", "where I have been.", "where did I be."], correct: 0, why: "have been → had been; chủ ngữ I đứng trước had." },
          { q: "“Can you speak any other languages?” → The interviewer asked ___", options: ["could I speak any other languages.", "that I can speak any other languages.", "if I can spoke any other languages.", "if I could speak any other languages."], correct: 3, why: "can → could; if + S + could + V nguyên mẫu." },
        ],
      },

      { t: "h", text: "3. Tường thuật mệnh lệnh, yêu cầu, lời khuyên, đề nghị" },
      { t: "p", text: "Câu mệnh lệnh (“Sit down.” / “Don't be late.”) không có thì để lùi. Ta dùng **động từ dẫn + tân ngữ + to V** — đúng khuôn **V + O + to V** của Ngày 7. Phủ định đặt **not** trước to." },
      {
        t: "patterns",
        rows: [
          { formula: "S + told / asked / advised / warned / encouraged / reminded / ordered + O + (not) + to V", vi: "bảo / nhờ / khuyên / cảnh báo / khuyến khích / nhắc / ra lệnh ai (đừng) làm gì", examples: [{ en: "“Please turn off your phones.” → The teacher asked us to turn off our phones.", vi: "Cô giáo nhờ chúng tôi tắt điện thoại." }, { en: "“Don't drive in the storm.” → Police warned drivers not to drive in the storm.", vi: "Cảnh sát cảnh báo tài xế đừng lái xe trong bão." }] },
          { formula: "S + suggested / recommended + V-ing  ·  + that + S + (should) + V", vi: "gợi ý / đề xuất — KHÔNG có tân ngữ + to V", examples: [{ en: "“Why don't we take the train?” → She suggested taking the train.", vi: "Cô ấy gợi ý đi tàu." }, { en: "The report recommended that the city (should) build more cycle lanes.", vi: "Bản báo cáo đề xuất thành phố nên xây thêm làn xe đạp." }] },
          { formula: "S + offered / promised / agreed / refused / threatened + to V", vi: "đề nghị giúp / hứa / đồng ý / từ chối / doạ — không tân ngữ", examples: [{ en: "“I'll pay you back on Friday.” → He promised to pay me back on Friday.", vi: "Anh ấy hứa trả tiền tôi vào thứ Sáu." }] },
          { formula: "S + apologised for / admitted / denied + V-ing  ·  accused + O + of + V-ing  ·  insisted on + V-ing", vi: "xin lỗi vì / thừa nhận / chối / buộc tội / khăng khăng", examples: [{ en: "“I didn't copy the essay.” → He denied copying the essay.", vi: "Cậu ấy chối việc chép bài luận." }, { en: "The company apologised for delaying the flight.", vi: "Hãng xin lỗi vì đã hoãn chuyến bay." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận: suggest không đi với to V",
        items: [
          "~~He suggested me to go by bus.~~ → He **suggested (that) I go** by bus. / He **suggested going** by bus. (Nhắc lại từ Ngày 7 — lỗi này giám khảo gặp hằng ngày.)",
          "~~She said me to wait.~~ → She **told me to wait**. (say không dùng cho mệnh lệnh + tân ngữ.)",
          "~~He told me don't worry.~~ → He told me **not to worry**.",
          "~~They refused that they would pay.~~ → They **refused to pay**.",
        ],
      },
      { t: "rule", formula: "told / asked / advised / warned + O + (not) to V  ·  suggested + V-ing / that S (should) V  ·  promised / refused + to V", vi: "Mệnh lệnh – yêu cầu – lời khuyên: chọn động từ dẫn theo ý, rồi theo đúng khuôn của động từ đó." },
      {
        t: "quiz", id: "t3d19-lenh-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "V + O + (not) to V · suggest + V-ing · refuse / promise + to V",
        items: [
          { q: "Bác sĩ khuyên tôi đừng làm việc quá khuya.", answers: ["The doctor advised me not to work too late.", "The doctor advised me not to work too late at night.", "My doctor advised me not to work too late."], hint: "advised me not to + V" },
          { q: "Giảng viên nhắc chúng tôi nộp báo cáo trước thứ Sáu.", answers: ["The lecturer reminded us to submit the report before Friday.", "The lecturer reminded us to hand in the report before Friday.", "The lecturer reminded us to submit our reports before Friday.", "The lecturer reminded us to submit the report by Friday.", "The lecturer reminded us to hand in the report by Friday."], hint: "reminded us to + V · submit / hand in" },
          { q: "Bạn tôi gợi ý chia tiền thuê nhà.", answers: ["My friend suggested sharing the rent.", "My friend suggested splitting the rent.", "My friend suggested that we share the rent.", "My friend suggested that we should share the rent.", "My friend suggested we share the rent."], hint: "suggested + V-ing (không to V)" },
          { q: "Chính phủ từ chối giảm thuế xăng dầu.", answers: ["The government refused to cut fuel tax.", "The government refused to reduce fuel tax.", "The government refused to cut the fuel tax.", "The government refused to reduce the tax on fuel.", "The government refused to lower fuel tax."], hint: "refused + to V · fuel tax" },
          { q: "Công ty xin lỗi vì đã không trả lời email của khách hàng.", answers: ["The company apologised for not replying to customers' emails.", "The company apologised for not answering customers' emails.", "The company apologized for not replying to customers' emails.", "The company apologised for not replying to the customers' emails.", "The company apologised for not replying to customer emails."], hint: "apologised for + not + V-ing" },
        ],
      },
      {
        t: "quiz", id: "t3d19-lenh-luyen", title: "Viết dạng đúng của động từ trong ngoặc (6 câu)", kind: "fill",
        items: [
          { q: "The guide warned us ___ (not / touch) the paintings.", answers: ["not to touch"] },
          { q: "My tutor suggested ___ (read) two more articles.", answers: ["reading"] },
          { q: "The mayor promised ___ (build) a new hospital by 2030.", answers: ["to build"] },
          { q: "The student admitted ___ (use) AI to write the essay.", answers: ["using", "having used", "to using", "to having used"] },
          { q: "She encouraged her son ___ (apply) for the scholarship.", answers: ["to apply"] },
          { q: "Residents accused the council of ___ (ignore) their complaints.", answers: ["ignoring"] },
        ],
      },

      { t: "h", text: "4. say · tell · speak · talk — bốn động từ dễ nhầm" },
      {
        t: "table",
        head: ["Động từ", "Khuôn", "Ví dụ", "Lỗi hay gặp"],
        rows: [
          ["**say**", "say (that)… · say **to** sb · say something", "She **said** (that) she was late. · He **said to** me, “Wait.”", "~~She said me that…~~"],
          ["**tell**", "tell **sb** (that)… · tell sb **to V** · tell a story / the truth / a lie", "She **told me** (that) she was late.", "~~She told that she was late.~~ (thiếu tân ngữ)"],
          ["**speak**", "speak + ngôn ngữ · speak **to** sb (trang trọng)", "He **speaks** three languages.", "~~He speaks that…~~"],
          ["**talk**", "talk **to** sb **about** sth (trò chuyện)", "We **talked about** the project for an hour.", "~~We talked the project.~~"],
        ],
      },
      { t: "rule", formula: "say + (that)…  ·  tell + người + (that)…  ·  talk to + người + about + việc", vi: "say không có người đứng ngay sau; tell bắt buộc có người." },
      {
        t: "mcq", id: "t3d19-say-tell", title: "say · tell · speak · talk (5 câu)",
        items: [
          { q: "The lecturer ___ us that the exam would be online.", options: ["said", "spoke", "told", "talked"], correct: 2, why: "Có tân ngữ us ngay sau ⇒ told us that…" },
          { q: "Nobody ___ anything during the meeting.", options: ["said", "told", "talked", "spoke to"], correct: 0, why: "say something / anything; tell cần người phía sau." },
          { q: "We ___ about the new timetable for twenty minutes.", options: ["said", "told", "explained", "talked"], correct: 3, why: "talk about + chủ đề." },
          { q: "She ___ to the manager that the report was not ready.", options: ["told", "said", "talked", "asked"], correct: 1, why: "say **to** sb that…; told không có to." },
          { q: "Can you ___ me the way to the library?", options: ["say", "speak", "tell", "talk"], correct: 2, why: "tell sb the way / the time / the truth." },
        ],
      },

      { t: "h", text: "5. Động từ tường thuật học thuật — thay “say” và “think”" },
      { t: "p", text: "Bài band 5 viết “Some people **think** … Other people **say** … I **think** …” suốt bài. Bài band 6 đổi sang một **động từ tường thuật** (reporting verb) hợp với **thái độ** của người nói: họ khẳng định mạnh, hay chỉ gợi ý, hay thừa nhận một điểm của phía kia? Chọn đúng từ là bạn vừa có từ vựng ít gặp (LR), vừa có mệnh đề that (GRA). Ngày 10 bạn đã gặp vài từ trong đoạn Discussion; hôm nay học trọn bảng." },
      {
        t: "table",
        caption: "25 động từ tường thuật học thuật theo 6 sắc thái",
        head: ["Nhóm", "Động từ", "Nghĩa – khi dùng", "Ví dụ"],
        rows: [
          ["Trung lập", "**state · note · observe · point out · explain**", "nêu / lưu ý / nhận xét / chỉ ra / giải thích — chỉ thuật lại, không tỏ thái độ", "The report **points out that** rents have doubled since 2010."],
          ["Khẳng định mạnh", "**argue · claim · maintain · insist**", "lập luận / tuyên bố (chưa chắc đúng) / giữ quan điểm / khăng khăng", "Supporters **argue that** the tax would reduce traffic. · The company **claims that** its cars are safe."],
          ["Dè dặt", "**suggest · indicate · imply · estimate**", "cho thấy, gợi ý / chỉ ra / hàm ý / ước tính — chưa khẳng định chắc", "Recent studies **suggest that** screen time affects sleep."],
          ["Thừa nhận", "**acknowledge · admit · accept · concede**", "công nhận một điểm (thường là điểm bất lợi cho mình)", "Even critics **acknowledge that** the scheme has saved money."],
          ["Phản bác", "**deny · doubt · question · challenge**", "phủ nhận / nghi ngờ / đặt nghi vấn / thách thức", "Some economists **question whether** the policy will work."],
          ["Đề xuất – cảnh báo", "**propose · recommend · warn · predict**", "đề xuất / khuyến nghị / cảnh báo / dự đoán", "Scientists **warn that** sea levels will continue to rise."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + argue / claim / suggest / point out + that + S + V", vi: "Khuôn chính: động từ tường thuật + that + mệnh đề (thì hiện tại — không lùi)", examples: [{ en: "Opponents of the plan argue that it will damage small businesses.", vi: "Những người phản đối kế hoạch lập luận rằng nó sẽ gây hại cho doanh nghiệp nhỏ." }] },
          { formula: "It is (often) argued / claimed / believed / said + that + S + V", vi: "Bị động với It — không cần nêu ai nói; rất hợp câu mở bài Task 2", examples: [{ en: "It is often claimed that money cannot buy happiness.", vi: "Người ta thường cho rằng tiền không mua được hạnh phúc." }] },
          { formula: "According to + N, + S + V  ·  As + N + points out, + S + V", vi: "Theo… / Như… đã chỉ ra — KHÔNG thêm động từ tường thuật nữa", examples: [{ en: "According to a recent survey, most commuters would prefer to work from home.", vi: "Theo một khảo sát gần đây, đa số người đi làm muốn làm việc tại nhà hơn." }] },
          { formula: "S + question / doubt + whether + S + V", vi: "Nghi ngờ / đặt nghi vấn liệu…", examples: [{ en: "Many parents doubt whether homework really helps young children.", vi: "Nhiều phụ huynh nghi ngờ liệu bài tập về nhà có thật sự giúp trẻ nhỏ không." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Năm lỗi sai với động từ tường thuật",
        items: [
          "**claim** hàm ý “họ nói vậy, chưa chắc đúng”. Đừng dùng claim cho ý của chính bạn: ~~I claim that…~~ → I would argue that… / I believe that…",
          "~~According to me / According to my opinion~~ → **In my view** / **I would argue that**. According to chỉ dùng cho người khác hoặc một nguồn.",
          "~~According to experts **say that**…~~ → According to experts, … **hoặc** Experts say that… — chọn một.",
          "~~They **discuss about** / **mention about** the problem.~~ → They **discuss / mention** the problem (không about). ~~They **emphasise on**…~~ → They **emphasise** the need… (danh từ thì có: an emphasis **on**).",
          "**suggest** có hai nghĩa: gợi ý (ai làm gì) và “cho thấy” (The data **suggest that**…). Nghĩa thứ hai dùng rất nhiều trong Reading.",
        ],
      },
      { t: "rule", formula: "Supporters argue that… · Critics claim that… · Studies suggest that… · It is often said that… · According to N, S + V", vi: "Đổi say / think thành động từ đúng sắc thái: mạnh (argue, claim), dè dặt (suggest), thừa nhận (acknowledge), nghi ngờ (question whether)." },
      {
        t: "quiz", id: "t3d19-hoc-thuat-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "S + argue / claim / suggest / acknowledge + that… · It is often argued that… · According to N, …",
        items: [
          { q: "Những người ủng hộ lập luận rằng giao thông công cộng miễn phí sẽ giảm tắc đường.", answers: ["Supporters argue that free public transport would reduce congestion.", "Supporters argue that free public transport will reduce congestion.", "Supporters argue that free public transport would reduce traffic congestion.", "Supporters argue that free public transport will reduce traffic congestion.", "Supporters argue that free public transport would reduce traffic jams."], hint: "Supporters argue that · reduce congestion" },
          { q: "Người ta thường cho rằng trẻ em học ngoại ngữ nhanh hơn người lớn.", answers: ["It is often said that children learn foreign languages faster than adults.", "It is often claimed that children learn foreign languages faster than adults.", "It is often argued that children learn foreign languages faster than adults.", "It is often believed that children learn foreign languages faster than adults.", "It is often said that children learn languages faster than adults."], hint: "It is often said / claimed that…" },
          { q: "Các nghiên cứu gần đây cho thấy thiếu ngủ ảnh hưởng đến trí nhớ.", answers: ["Recent studies suggest that a lack of sleep affects memory.", "Recent studies suggest that lack of sleep affects memory.", "Recent studies indicate that a lack of sleep affects memory.", "Recent research suggests that a lack of sleep affects memory.", "Recent studies show that a lack of sleep affects memory."], hint: "Recent studies suggest that · a lack of sleep" },
          { q: "Ngay cả những người chỉ trích cũng thừa nhận rằng kế hoạch đã tạo ra việc làm.", answers: ["Even critics acknowledge that the plan has created jobs.", "Even critics admit that the plan has created jobs.", "Even critics accept that the plan has created jobs.", "Even the critics acknowledge that the plan has created jobs.", "Even critics acknowledge that the scheme has created jobs."], hint: "Even critics acknowledge / admit that · has created" },
          { q: "Theo một khảo sát gần đây, 60% sinh viên làm thêm.", answers: ["According to a recent survey, 60% of students have a part-time job.", "According to a recent survey, 60% of students work part-time.", "According to a recent survey, 60 per cent of students work part-time.", "According to a recent survey, 60 percent of students work part-time.", "According to a recent survey, 60% of students have part-time jobs."], hint: "According to + N, (không thêm say) · work part-time" },
        ],
      },
      {
        t: "mcq", id: "t3d19-hoc-thuat-luyen", title: "Chọn động từ tường thuật hợp sắc thái (6 câu)",
        items: [
          { q: "The manufacturer ___ that the drug has no side effects, but independent tests have not confirmed this.", options: ["claims", "acknowledges", "proves", "admits"], correct: 0, why: "claims = tuyên bố nhưng chưa được kiểm chứng — khớp vế sau “tests have not confirmed”." },
          { q: "Although they support the new airport, local leaders ___ that it will increase noise.", options: ["deny", "acknowledge", "doubt", "insist on"], correct: 1, why: "Ủng hộ nhưng vẫn công nhận điểm bất lợi ⇒ acknowledge that." },
          { q: "Early results ___ that the vaccine may be effective, although more trials are needed.", options: ["insist", "deny", "suggest", "order"], correct: 2, why: "may + more trials are needed ⇒ dè dặt ⇒ suggest." },
          { q: "Some economists ___ whether a higher minimum wage would really help the poor.", options: ["argue", "claim", "state", "question"], correct: 3, why: "question whether = đặt nghi vấn liệu. argue / claim / state đi với that." },
          { q: "___ the World Health Organization, adults need at least 150 minutes of exercise a week.", options: ["According to", "As said", "In the opinion", "Following to"], correct: 0, why: "According to + nguồn, + mệnh đề." },
          { q: "The minister ___ any connection with the company and said the story was false.", options: ["admitted", "warned", "denied", "suggested"], correct: 2, why: "“said the story was false” ⇒ phủ nhận ⇒ denied." },
        ],
      },

      { t: "h", text: "6. Modal suy đoán về HIỆN TẠI: must · might · may · could · can't" },
      { t: "p", text: "Ở Tập 1 Ngày 13, must là “phải”, can là “có thể làm được”. Hôm nay cùng những chữ đó mang nghĩa thứ hai: **suy đoán** (deduction) — bạn không biết chắc, bạn **đoán dựa trên bằng chứng**. Ở Part 3 bạn thường phải đoán vì sao người khác nghĩ / làm điều gì đó, nên đây là ngữ pháp nói rất đắt." },
      {
        t: "table",
        caption: "Thang chắc chắn — suy đoán về hiện tại",
        head: ["Mức chắc", "Modal + V", "Nghĩa", "Ví dụ"],
        rows: [
          ["≈ 95% có", "**must** + V", "chắc hẳn là", "She works twelve hours a day — she **must be** exhausted."],
          ["≈ 50%", "**may / might / could** + V", "có lẽ, có thể là", "They **might be** stuck in traffic. · It **could be** a mistake."],
          ["≈ 50% không", "**may not / might not** + V", "có lẽ không", "He **might not know** about the change."],
          ["≈ 95% không", "**can't** + V", "chắc chắn không, không thể nào", "That **can't be** true — the shop closed last year."],
          ["đang diễn ra", "modal + **be V-ing**", "chắc đang / có lẽ đang", "The lights are on — someone **must be working** late."],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận ba chỗ",
        items: [
          "Phủ định của must (suy đoán) là **can't**, không phải mustn't: ~~He mustn't be at home~~ → He **can't be** at home. (mustn't = cấm.)",
          "**could not** ≠ **might not**: It **couldn't** be true = không thể nào; It **might not** be true = có lẽ không đúng.",
          "Không dùng **can** để suy đoán khẳng định về một việc cụ thể: ~~He can be at home now.~~ → He **could / may / might** be at home now.",
          "Sau modal luôn là **V nguyên mẫu**: ~~She must to be / must is tired~~ → She **must be** tired.",
        ],
      },
      { t: "rule", formula: "S + must / might / may / could / can't + V (be / be V-ing)", vi: "Đoán về hiện tại: must = chắc hẳn; might / may / could = có lẽ; can't = không thể nào." },
      {
        t: "quiz", id: "t3d19-modal-ht-dich", title: "Dịch Việt → Anh (4 câu)", kind: "translate", grammar: "must / might / can't + V",
        items: [
          { q: "Họ có ba chiếc xe hơi — họ chắc hẳn rất giàu.", answers: ["They have three cars — they must be very rich.", "They have three cars - they must be very rich.", "They have three cars, so they must be very rich.", "They have three cars. They must be very rich.", "They have got three cars, so they must be very rich."], hint: "must be + adj" },
          { q: "Con số đó không thể nào đúng được.", answers: ["That figure can't be right.", "That figure cannot be right.", "That figure can't be correct.", "That number can't be right.", "That figure cannot be correct."], hint: "can't be right" },
          { q: "Có lẽ giới trẻ thích nhắn tin vì nó nhanh hơn.", answers: ["Young people might prefer texting because it is faster.", "Young people may prefer texting because it is faster.", "Young people might prefer texting because it's faster.", "Young people may prefer texting because it's faster.", "Young people might prefer messaging because it is faster."], hint: "might / may + prefer" },
          { q: "Anh ấy không trả lời — chắc anh ấy đang lái xe.", answers: ["He isn't answering — he must be driving.", "He isn't answering - he must be driving.", "He is not answering, so he must be driving.", "He isn't answering, so he must be driving.", "He's not answering — he must be driving."], hint: "must be + V-ing" },
        ],
      },

      { t: "h", text: "7. Modal suy đoán về QUÁ KHỨ: must have · might have · can't have — và should have" },
      { t: "p", text: "Muốn đoán về việc **đã xảy ra**, giữ nguyên modal và thêm **have + V3** (V3 = cột ba: gone, been, seen). **have** ở đây không chia theo ngôi và khi nói đọc rất nhẹ: must have → **must've** /ˈmʌstəv/." },
      {
        t: "patterns",
        rows: [
          { formula: "S + must have + V3", vi: "chắc hẳn đã… (gần như chắc)", examples: [{ en: "The road is wet. It must have rained last night.", vi: "Đường ướt. Đêm qua chắc hẳn đã mưa." }] },
          { formula: "S + might / may / could have + V3", vi: "có lẽ đã…", examples: [{ en: "She's late. She might have missed the bus.", vi: "Cô ấy trễ. Có lẽ cô ấy đã lỡ xe buýt." }] },
          { formula: "S + can't / couldn't have + V3", vi: "không thể nào đã…", examples: [{ en: "He can't have finished already — he only started an hour ago.", vi: "Cậu ấy không thể nào đã xong — mới bắt đầu một tiếng trước." }] },
          { formula: "S + should have + V3  ·  shouldn't have + V3", vi: "lẽ ra nên làm (mà đã không) · lẽ ra không nên (mà đã làm) — phê bình, tiếc", examples: [{ en: "The government should have invested in railways decades ago.", vi: "Lẽ ra chính phủ nên đầu tư vào đường sắt từ nhiều thập kỷ trước." }, { en: "I shouldn't have chosen that course.", vi: "Lẽ ra tôi không nên chọn khoá đó." }] },
        ],
      },
      {
        t: "sodo", kind: "compare", title: "Hai nhóm dễ nhầm",
        cols: [
          { title: "Suy đoán (đoán chuyện đã qua)", items: ["**must have** V3 — chắc đã", "**might / could have** V3 — có lẽ đã", "**can't have** V3 — không thể đã", "People **must have** walked everywhere before cars."] },
          { title: "Đánh giá (việc đã làm sai)", items: ["**should have** V3 — lẽ ra nên", "**shouldn't have** V3 — lẽ ra không nên", "**could have** V3 — lẽ ra đã có thể (mà không làm)", "The city **should have** planned for more people."] },
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai",
        items: [
          "Dùng must + V cho quá khứ: ~~He must be tired yesterday.~~ → He **must have been** tired yesterday.",
          "Viết **of** thay have vì nghe giống: ~~She must of forgotten.~~ → She **must have** forgotten.",
          "Chia have theo ngôi hoặc dùng V2: ~~He might has gone~~ · ~~She must have went~~ → He **might have gone** · She **must have gone**.",
          "**had to** ≠ **must have**: I **had to** leave early (tôi buộc phải về sớm) · He **must have** left early (chắc hẳn anh ấy đã về sớm).",
        ],
      },
      { t: "rule", formula: "S + must / might / could / can't + have + V3  ·  S + should (not) + have + V3", vi: "Đoán về quá khứ = modal + have V3; should have V3 = lẽ ra nên (nhưng đã không làm)." },
      {
        t: "quiz", id: "t3d19-modal-qk-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "must / might / can't / should + have + V3",
        items: [
          { q: "Chắc hẳn cô ấy đã quên cuộc họp.", answers: ["She must have forgotten the meeting.", "She must have forgotten about the meeting.", "She must've forgotten the meeting."], hint: "must have + forgotten" },
          { q: "Có lẽ họ đã đi nhầm tàu.", answers: ["They might have taken the wrong train.", "They may have taken the wrong train.", "They could have taken the wrong train.", "They might have got on the wrong train.", "They may have got on the wrong train."], hint: "might / may have + taken · the wrong train" },
          { q: "Anh ấy không thể nào đã viết báo cáo này một mình.", answers: ["He can't have written this report alone.", "He can't have written this report by himself.", "He couldn't have written this report alone.", "He cannot have written this report alone.", "He can't have written this report on his own."], hint: "can't have + written" },
          { q: "Lẽ ra thành phố nên xây thêm trường học.", answers: ["The city should have built more schools."], hint: "should have + built" },
          { q: "Lẽ ra tôi không nên tiêu nhiều tiền như vậy.", answers: ["I shouldn't have spent so much money.", "I should not have spent so much money.", "I shouldn't have spent that much money."], hint: "shouldn't have + spent" },
        ],
      },
      {
        t: "mcq", id: "t3d19-modal-luyen", title: "Chọn modal đúng (6 câu)",
        items: [
          { q: "The office is completely dark. Everyone ___ home.", options: ["must go", "must have gone", "should go", "can't have gone"], correct: 1, why: "Bằng chứng (tối om) ⇒ chắc hẳn ĐÃ về: must have gone." },
          { q: "I'm not sure why sales fell. The price rise ___ some customers away.", options: ["must drive", "can't have driven", "might have driven", "should drive"], correct: 2, why: "“I'm not sure” ⇒ có lẽ đã: might have driven." },
          { q: "She ___ the email — she replied to it within a minute.", options: ["can't have missed", "must have missed", "might miss", "should have missed"], correct: 0, why: "Đã trả lời ⇒ không thể nào bỏ lỡ: can't have missed." },
          { q: "The bridge collapsed after two years. The engineers ___ the design more carefully.", options: ["must have checked", "might check", "can't have checked", "should have checked"], correct: 3, why: "Phê bình việc đã không làm ⇒ should have checked." },
          { q: "He speaks perfect French. He ___ in France for years.", options: ["must have lived", "should have lived", "can't have lived", "must live"], correct: 0, why: "Suy đoán chắc về quá khứ: must have lived." },
          { q: "Listen — the neighbours ___ a party. I can hear music.", options: ["must have", "must be having", "can't be having", "should have had"], correct: 1, why: "Việc đang diễn ra lúc này ⇒ must be + V-ing." },
        ],
      },

      { t: "h", text: "8. Dùng trong bài thi: band 5 → band 6" },
      {
        t: "table",
        head: ["Chỗ dùng", "Câu band 5", "Câu band 6"],
        rows: [
          ["Task 2 — nêu ý phía bên kia", "Some people think cars are bad.", "Environmental groups **argue that** private cars are the main cause of urban pollution."],
          ["Task 2 — nhượng bộ", "But cars are also good.", "Even opponents of car ownership **acknowledge that** cars remain essential in rural areas."],
          ["Task 2 — phê bình chính sách", "The government did not build roads. It is bad.", "The government **should have invested** in public transport before the population doubled."],
          ["Part 3 — thuật lại ý người khác", "Many people say young people are lazy. I don't think so.", "A lot of older people **say that** young people **are** lazy, but I think they **might be comparing** them with a very different time."],
          ["Part 2 — kể lời khuyên", "My teacher said: you must read more.", "My teacher **advised me to read** more, and she **told me that** reading **would improve** my writing."],
          ["Part 3 — đoán nguyên nhân", "Maybe they don't have money.", "They **may not be able to** afford it, or they **might have had** a bad experience before."],
        ],
      },
      { t: "note", title: "💡 Mẹo tự soát 30 giây", items: ["Tìm mọi chữ **think / say** trong bài — đổi ít nhất hai chỗ sang argue / claim / suggest / point out.", "Sau **said / told** (quá khứ): động từ phía sau đã lùi thì chưa?", "Sau **asked**: có **if / wh-** và trật tự **S + V** chưa?", "Sau modal: **V nguyên mẫu** hoặc **have + V3** — không to, không -s, không V2."] },
      {
        t: "mcq", id: "t3d19-ngu-phap-tong", title: "Tìm câu ĐÚNG ngữ pháp (5 câu)",
        items: [
          { q: "Câu nào đúng?", options: ["She said me that she was moving to Hue.", "She told that she was moving to Hue.", "She told me that she was moving to Hue.", "She told to me that she is moving to Hue."], correct: 2, why: "tell + người + that…; said không có người ngay sau; told không đi với to." },
          { q: "Câu nào đúng?", options: ["The examiner asked me what my favourite subject was.", "The examiner asked me what was my favourite subject.", "The examiner asked me what is my favourite subject?", "The examiner asked me that what my favourite subject was."], correct: 0, why: "Wh- + S + V lùi thì, không đảo ngữ, không that, kết bằng dấu chấm." },
          { q: "Câu nào đúng?", options: ["According to me, cities are too crowded.", "According to experts say that cities are too crowded.", "According to my opinion, cities are too crowded.", "According to experts, cities are too crowded."], correct: 3, why: "According to + nguồn (không phải me / my opinion), + mệnh đề, không thêm say." },
          { q: "Câu nào đúng?", options: ["He must have forget his passport.", "He must have forgotten his passport.", "He must has forgotten his passport.", "He must of forgotten his passport."], correct: 1, why: "modal + have (không chia) + V3 forgotten." },
          { q: "Câu nào đúng?", options: ["My parents suggested me to study abroad.", "My parents advised me study abroad.", "My parents suggested that I study abroad.", "My parents suggested to study abroad."], correct: 2, why: "suggest + that + S + (should) + V; advise mới đi với O + to V." },
        ],
      },
    ],
  },

  /* ═══════════════════════ BÀI 2 — ĐỌC ═══════════════════════ */
  {
    id: "t3d19-doc",
    kind: "reading",
    title: "Matching information 2 — tìm đoạn chứa thông tin (kèm Sentence completion)",
    goal: "Làm đúng ít nhất 9/13 câu trên một bài đọc ~780 từ trong 20 phút: gọi tên được “loại thông tin” mà câu hỏi tìm, dùng được một chữ cái hai lần, và không nhầm ý chính của đoạn với một chi tiết nằm trong đoạn.",
    minutes: 65,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy band nào",
        items: [
          "**Matching information** = đề cho 5–8 mẩu thông tin, bạn tìm **đoạn nào (A, B, C…) chứa** mẩu đó. Tập 2 Ngày 16 đã học ở mức Passage 1; hôm nay nâng lên **band 6**: bài dài hơn, câu hỏi trừu tượng hơn.",
          "Ba điểm khó hơn: câu hỏi mở đầu bằng **danh từ chỉ loại thông tin** (a comparison, a reason, a reference to…); **một chữ cái có thể dùng hai lần** và có đoạn không dùng; đáp án là **một chi tiết nhỏ**, không phải ý chính của đoạn.",
          "Câu hỏi **không theo thứ tự bài** — đây là dạng tốn thời gian nhất của Reading. Làm dạng khác của cùng passage **trước**, quay lại dạng này sau.",
          "Động từ tường thuật vừa học (argue, claim, admit, maintain, point out, suggest) chính là **biển chỉ đường**: thấy claim ⇒ đoạn đó chứa “a claim”; thấy admitted ⇒ “an admission / regret”.",
          "Đích band 6 của Reading: 23/40 — tức mỗi passage khoảng 8/13.",
        ],
      },

      { t: "h", text: "1. Ôn nhanh Tập 2 Ngày 16 — và band 6 thêm gì" },
      {
        t: "table",
        head: ["", "Tập 2 Ngày 16 (band 5)", "Hôm nay (band 6)"],
        rows: [
          ["Bài đọc", "~700 từ, 7 đoạn, văn kể dễ", "~780–900 từ, 8 đoạn, có số liệu và ý kiến trái chiều"],
          ["Câu hỏi", "nói thẳng nội dung: “why people spend more with cards”", "bắt đầu bằng **loại thông tin**: “an explanation of…”, “a reference to…”"],
          ["Chữ cái", "mỗi đoạn dùng một lần", "**NB You may use any letter more than once** — có đoạn 2 đáp án, có đoạn 0"],
          ["Paraphrase", "đổi từ đồng nghĩa", "đổi **cả loại từ và cấu trúc**: “he later admitted…” ⇒ “an inventor's regret”"],
          ["Bẫy", "từ khoá lặp ở hai đoạn", "một đoạn nói **chủ đề gần giống** nhưng không có đúng loại thông tin đề hỏi"],
        ],
      },
      {
        t: "sodo", kind: "compare", title: "Đừng nhầm với Matching headings (Ngày 5)",
        cols: [
          { title: "Matching headings", items: ["Hỏi **ý chính** của cả đoạn", "Mỗi đoạn một tiêu đề", "Đọc câu chủ đề + câu kết là thường đủ", "Chi tiết nhỏ là **bẫy**"] },
          { title: "Matching information", items: ["Hỏi **một chi tiết** nằm đâu đó trong đoạn", "Một đoạn có thể chứa 0, 1 hoặc 2 đáp án", "Phải quét **cả đoạn**, kể cả câu giữa", "Chi tiết nhỏ chính là **đáp án**"] },
        ],
      },

      { t: "h", text: "2. Đọc câu hỏi: gọi tên “loại thông tin”" },
      { t: "p", text: "Mỗi câu hỏi Matching information có hai phần: **danh từ chỉ loại thông tin** + **chủ đề**. Ví dụ “**a comparison** between an office and a factory”: loại = so sánh; chủ đề = văn phòng và nhà máy. Bạn đi tìm **một câu so sánh**, không phải bất cứ chỗ nào có chữ office. Bảng dưới là 12 loại hay gặp và **dấu hiệu trong bài** của từng loại." },
      {
        t: "table",
        caption: "12 danh từ chỉ loại thông tin — thấy gì trong bài thì khớp",
        head: ["Câu hỏi viết", "Nghĩa", "Dấu hiệu trong bài"],
        rows: [
          ["**a reason / an explanation** for / of", "lý do / lời giải thích", "because · since · so that · this is why · the aim was to · explain that"],
          ["**an example of**", "ví dụ", "for example · such as · one case is · tên riêng, địa danh cụ thể"],
          ["**a comparison / a contrast** between", "so sánh / đối chiếu", "like · much as · than · by contrast · whereas · -er / more"],
          ["**a description of** how / what", "mô tả cách làm, hình dáng", "chuỗi động từ, tính từ tả; first… then…; bị động"],
          ["**a reference to / mention of**", "có nhắc tới (thường chỉ một cụm ngắn)", "một danh từ / con số xuất hiện thoáng qua — dễ sót nhất"],
          ["**a figure / the proportion / statistics**", "con số, tỉ lệ", "%, phân số, half, two-thirds, số năm, số tiền"],
          ["**a claim / a suggestion / an argument**", "lời khẳng định / gợi ý / lập luận của ai đó", "argued that · claimed that · maintained that · suggested that"],
          ["**a criticism / an objection / a disadvantage**", "lời chê / phản đối / điểm bất lợi", "critics · complain · however · the problem is · a mistake"],
          ["**a prediction / a possible future**", "dự đoán", "will · is likely to · may eventually · remains to be seen"],
          ["**a definition of**", "định nghĩa", "known as · so-called · that is · , in which… · dấu ngoặc đơn"],
          ["**an account of** / the history of", "lời kể lại một việc đã xảy ra", "năm tháng, thì quá khứ, when / after"],
          ["**a regret / an admission / a change of opinion**", "sự hối tiếc / thừa nhận / đổi ý", "later admitted · regretted · described … as a mistake · no longer believed"],
        ],
      },
      {
        t: "mcq", id: "t3d19-doc-loai", title: "Câu trong bài thuộc “loại thông tin” nào? (6 câu)",
        items: [
          { q: "“Drivers avoid the tunnel because the toll doubles after 7 a.m.”", options: ["a definition", "a prediction", "a reason", "a comparison"], correct: 2, why: "because + nguyên nhân ⇒ a reason / an explanation." },
          { q: "“A ‘food desert’, that is, an area where fresh food cannot be bought within walking distance, …”", options: ["a definition", "a criticism", "an example", "an account"], correct: 0, why: "that is + mệnh đề giải nghĩa thuật ngữ ⇒ a definition." },
          { q: "“Unlike trams, which run on fixed rails, buses can be sent wherever demand is highest.”", options: ["a regret", "a contrast", "a figure", "a claim"], correct: 1, why: "Unlike … ⇒ đối chiếu hai thứ ⇒ a contrast / comparison." },
          { q: "“The architect later said she wished she had never accepted the project.”", options: ["a prediction", "a description", "an example", "a regret"], correct: 3, why: "wished she had never… ⇒ hối tiếc ⇒ a regret." },
          { q: "“By 2050, two out of three people are expected to live in cities.”", options: ["a prediction", "an objection", "a definition", "a reason"], correct: 0, why: "By 2050 + are expected to ⇒ a prediction (kèm một tỉ lệ)." },
          { q: "“Opponents complain that the scheme simply moves traffic to neighbouring streets.”", options: ["an explanation of how the scheme works", "a criticism of the scheme", "a comparison of two schemes", "a description of a street"], correct: 1, why: "Opponents complain that… ⇒ a criticism." },
        ],
      },

      { t: "h", text: "3. Chiến thuật 6 bước (≈ 10–11 phút cho 8 câu)" },
      {
        t: "sodo", kind: "flow", title: "Matching information ở band 6",
        steps: [
          { label: "1. Làm dạng kia trước", sub: "Sentence / Summary đi theo thứ tự bài — làm xong là bạn đã có “bản đồ” các đoạn" },
          { label: "2. Ghi bản đồ đoạn", sub: "Cạnh mỗi đoạn ghi 2–4 chữ: A giới thiệu · B đầu 1900 · C Đức · D cubicle…" },
          { label: "3. Gạch loại + chủ đề", sub: "Mỗi câu hỏi: khoanh danh từ loại thông tin, gạch chân chủ đề" },
          { label: "4. Đoán đoạn theo bản đồ", sub: "“inventor's regret” ⇒ đoạn nói về người thiết kế ⇒ thử D trước" },
          { label: "5. Tìm đúng câu", sub: "Phải chỉ được MỘT câu trong đoạn khớp cả loại lẫn chủ đề" },
          { label: "6. Câu khó để cuối", sub: "Quá 90 giây chưa ra ⇒ đánh dấu, làm câu khác; không bỏ trống" },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận: bốn bẫy của band 6",
        items: [
          "**Khớp chủ đề, sai loại**: câu hỏi “a criticism of open offices”; đoạn E nói open offices nhưng là **lời ủng hộ**. Phải khớp cả hai phần.",
          "**Nghĩ mỗi chữ cái dùng một lần**: thấy dòng **NB You may use any letter more than once** thì chắc chắn có ít nhất một đoạn dùng hai lần. Đừng gạch bỏ chữ cái đã dùng.",
          "**Dừng ở đoạn đầu tiên có từ khoá**: “cost / saving” có thể xuất hiện ở hai đoạn — đọc cả hai rồi chọn đoạn khớp **chi tiết** (ai tiết kiệm, tiết kiệm gì).",
          "**Chọn theo ý chính của đoạn**: đáp án thường nằm ở **câu giữa hoặc câu cuối** đoạn, là một chi tiết phụ. Đừng chỉ đọc câu đầu.",
        ],
      },
      { t: "rule", formula: "Loại thông tin + Chủ đề → đoán đoạn theo bản đồ → chỉ ra MỘT câu khớp cả hai", vi: "Không chỉ được câu cụ thể thì chưa phải đáp án." },

      { t: "h", text: "4. Khởi động — 4 đoạn ngắn, 5 câu" },
      { t: "p", text: "Đọc bốn đoạn ngắn dưới đây (khoảng 2 phút), rồi cho biết mỗi thông tin nằm ở đoạn nào. Lưu ý: **một chữ cái có thể dùng hai lần**." },
      {
        t: "passage", title: "Standing at Work",
        intro: "Bài tự soạn cho phần khởi động.",
        paras: [
          { label: "A", text: "Desks that can be raised so that people work on their feet first became popular in Scandinavia, where over eighty per cent of office workers now have access to one. Elsewhere they are still a rare sight." },
          { label: "B", text: "Manufacturers claim that standing for part of the day burns more energy and reduces back pain. Independent researchers are more careful. They point out that most trials have lasted only a few weeks, which is too short to measure any effect on long-term health." },
          { label: "C", text: "Standing all day is not the answer either. Shop assistants and factory workers, who are on their feet for eight hours, suffer more leg and foot problems than people who sit. What seems to matter is changing position regularly, much as a driver on a long journey stops to stretch." },
          { label: "D", text: "The main obstacle is price. An adjustable desk costs three to four times as much as an ordinary one, so many employers buy only a few and ask staff to share them. Some experts expect prices to fall as more companies enter the market." },
        ],
      },
      {
        t: "mcq", id: "t3d19-doc-khoi-dong", title: "Which paragraph contains the following information? (5 câu, A–D)",
        items: [
          { q: "a prediction about the future cost of the equipment", options: ["A", "B", "C", "D"], correct: 3, why: "D: “Some experts **expect** prices **to fall**” — dự đoán về giá." },
          { q: "a comparison between office workers and someone travelling by car", options: ["A", "B", "C", "D"], correct: 2, why: "C: “**much as** a driver on a long journey stops to stretch” — so sánh bằng much as." },
          { q: "a weakness in the research carried out so far", options: ["A", "B", "C", "D"], correct: 1, why: "B: “most trials have lasted only a few weeks, which is **too short**” — điểm yếu của nghiên cứu." },
          { q: "the proportion of employees in one region who can use the equipment", options: ["A", "B", "C", "D"], correct: 0, why: "A: “**over eighty per cent** of office workers” ở Scandinavia." },
          { q: "an example of people whose jobs prevent them from sitting down", options: ["A", "B", "C", "D"], correct: 2, why: "C lần thứ hai: “**Shop assistants and factory workers**, who are on their feet for eight hours”. Một chữ cái dùng hai lần." },
        ],
      },

      { t: "h", text: "5. Luyện trọn bài — Questions 1–13 (20 phút)" },
      { t: "p", text: "Bấm giờ **20 phút**. Nhớ chiến thuật: làm **Questions 9–13 trước** (đi theo thứ tự bài, vừa làm vừa ghi bản đồ đoạn), rồi mới quay lại Questions 1–8. Chưa xem phần giải thích." },
      {
        t: "passage", title: "The Open-Plan Office: A Century-Long Experiment",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below. (Bài tự soạn.)",
        paras: [
          { label: "A", text: "Walk into almost any large company today and you will find the same scene: long rows of desks, no walls, and dozens of people working within sight and sound of one another. Surveys suggest that around seventy per cent of office workers in the United States now sit in some form of open-plan space. The arrangement is so common that it is easy to assume it must be the best way to organise office work. Yet the open-plan office was not designed on the basis of evidence, and after more than a hundred years researchers are still arguing about whether it does what its supporters claim." },
          { label: "B", text: "The idea is older than most people think. In the early 1900s, large American firms placed their clerks in huge halls, with desks lined up facing a supervisor, much as machines were arranged on a factory floor. The aim was not to encourage conversation but to make workers easy to watch. Managers, by contrast, kept private rooms around the edge of the hall, each with a door and a window. Space, in other words, was a sign of rank: the more senior the employee, the more walls he was given." },
          { label: "C", text: "A very different vision appeared in Germany in the late 1950s. Two brothers who ran a consultancy near Hamburg proposed what they called the ‘office landscape’. They argued that paperwork should flow freely between people who needed to cooperate, and that walls only slowed this flow down. In their plans, desks were grouped in loose, irregular clusters and separated by plants and curved screens rather than corridors. Remarkably, managers were expected to sit among their staff. For its inventors, the open office was a tool of equality, not of control." },
          { label: "D", text: "When the concept crossed the Atlantic, however, it changed. In 1968 an American designer introduced a system of movable desks and panels that was supposed to give each worker a flexible, semi-private area. He later admitted that he had not foreseen what companies would do with it. Because the panels were cheap and could be packed tightly together, firms used them to squeeze more employees into each floor. The result was the ‘cubicle’, a small three-sided box that became a symbol of dull office life. By the end of the century, the designer was openly describing what companies had done with his invention as a kind of madness." },
          { label: "E", text: "The modern open plan, which removed even these low partitions, spread rapidly from technology companies in the early 2000s. Its advocates maintained that taking away barriers would lead to chance meetings, faster decisions and a stronger sense of belonging. There was also a less widely advertised motive. An open layout typically requires only about half the floor area per person that private offices do, and in cities where rents are high this represents an enormous saving. Critics have pointed out that it is difficult to know which of these two reasons really drove the change." },
          { label: "F", text: "What does the evidence show? In one widely reported study, researchers followed employees at two large firms before and after their offices were converted to an open layout. Each volunteer wore a small electronic badge that recorded when they spoke to a colleague. The findings surprised many people: face-to-face conversation fell by roughly seventy per cent after the walls came down, while the number of emails and instant messages rose sharply. The authors suggested that people who feel constantly observed may withdraw, putting on headphones and avoiding conversations that everyone nearby would overhear." },
          { label: "G", text: "Other investigations have focused on health and concentration. A Danish survey of more than two thousand workers reported that those in large shared rooms took around sixty per cent more days of sick leave than those in private offices, possibly because infections travel more easily. Noise is the complaint that employees mention most often. Psychologists explain that the human brain finds it almost impossible to ignore speech it can understand, so a neighbour's telephone call is far more distracting than the steady hum of an air conditioner. One estimate puts the time needed to return fully to a task after an interruption at more than twenty minutes." },
          { label: "H", text: "None of this means that walls will return everywhere. Many organisations are now experimenting with so-called activity-based working, in which nobody owns a desk. Instead, staff choose between quiet rooms, booths for calls and shared tables according to the task in front of them. Early reports claim that satisfaction is higher in such offices, although some workers complain about wasting time each morning looking for somewhere to sit. Whether this model proves to be a lasting solution, or simply the next chapter in a long experiment, remains to be seen." },
        ],
      },
      { t: "p", text: "**Questions 1–8.** The reading passage has eight paragraphs, **A–H**. Which paragraph contains the following information? Write the correct letter, **A–H**. **NB** You may use any letter more than once." },
      {
        t: "quiz", id: "t3d19-doc-noi", title: "Questions 1–8 — Matching information (viết chữ cái A–H)", kind: "fill",
        items: [
          { q: "1. a description of how information about workers' conversations was collected ___", answers: ["F"] },
          { q: "2. a designer's regret about the way his idea was used ___", answers: ["D"] },
          { q: "3. an explanation of why some sounds disturb people more than others ___", answers: ["G"] },
          { q: "4. a comparison between the layout of an office and that of a place where goods are made ___", answers: ["B"] },
          { q: "5. a disadvantage of offices in which employees have no fixed desk ___", answers: ["H"] },
          { q: "6. a reference to how much less space each person needs in a modern open-plan office ___", answers: ["E"] },
          { q: "7. the claim that an open office could put employees of different levels on equal terms ___", answers: ["C"] },
          { q: "8. a figure for how long it takes to concentrate again after being disturbed ___", answers: ["G"] },
        ],
      },
      { t: "p", text: "**Questions 9–13.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer." },
      {
        t: "quiz", id: "t3d19-doc-cau", title: "Questions 9–13 — Sentence completion (NO MORE THAN TWO WORDS)", kind: "fill",
        items: [
          { q: "9. In early American offices, the amount of private space an employee had showed his ___ .", answers: ["rank"] },
          { q: "10. In the German ‘office landscape’, groups of desks were divided by curved screens and ___ .", answers: ["plants"] },
          { q: "11. The cubicle came to be regarded as a ___ of boring office work.", answers: ["symbol"] },
          { q: "12. After the offices in the study became open-plan, staff sent more instant messages and ___ .", answers: ["emails", "e-mails"] },
          { q: "13. The Danish survey found that people in shared rooms had more ___ than people with their own office.", answers: ["sick leave"] },
        ],
      },
      {
        t: "table",
        caption: "Giải thích Questions 1–8 — loại thông tin → câu trong bài → kiểu viết lại",
        head: ["Câu", "Đáp án", "Câu chứa đáp án", "Viết lại thế nào · bẫy"],
        rows: [
          ["1", "**F**", "“Each volunteer **wore a small electronic badge that recorded** when they spoke to a colleague.”", "information about conversations was collected = badge recorded when they spoke. **Bẫy A**: có surveys nhưng không tả cách thu thập."],
          ["2", "**D**", "“He **later admitted** that he had not foreseen… describing what companies had done with his invention **as a kind of madness**.”", "regret = admitted + a kind of madness (danh từ loại thông tin ⇐ động từ tường thuật). designer = người thiết kế hệ panel."],
          ["3", "**G**", "“the human brain finds it almost impossible to ignore **speech it can understand**, so a neighbour's telephone call is far more distracting than the steady hum…”", "explanation = Psychologists explain that… ; some sounds more than others = phone call vs hum."],
          ["4", "**B**", "“desks lined up facing a supervisor, **much as machines were arranged on a factory floor**”", "comparison = much as; a place where goods are made = factory. **Bẫy D**: có firms, floor nhưng không so sánh với nhà máy."],
          ["5", "**H**", "“although some workers **complain about wasting time** each morning looking for somewhere to sit”", "no fixed desk = nobody owns a desk; disadvantage = complain about wasting time."],
          ["6", "**E**", "“requires only about **half the floor area per person** that private offices do”", "how much less space = half the floor area. **Bẫy D**: “squeeze more employees into each floor” nói về cubicle (vẫn có vách), không nêu con số, không phải modern open plan."],
          ["7", "**C**", "“managers were expected to sit among their staff… the open office was **a tool of equality**”", "claim = They argued… / For its inventors…; employees of different levels on equal terms = equality, managers among staff. **Bẫy B**: nói về cấp bậc nhưng là **bất** bình đẳng."],
          ["8", "**G**", "“One estimate puts the time needed to return fully to a task after an interruption at **more than twenty minutes**.”", "a figure = more than twenty minutes; concentrate again = return fully to a task; being disturbed = an interruption. **G dùng lần hai**; đoạn **A không có đáp án**."],
        ],
      },
      {
        t: "note", title: "Giải thích Questions 9–13",
        items: [
          "**9 rank** — B: “Space, in other words, was **a sign of rank**”. showed his… = was a sign of.",
          "**10 plants** — C: “separated by **plants** and curved screens rather than corridors”. divided by = separated by. Không điền corridors (rather than = thay vì).",
          "**11 symbol** — D: “became **a symbol of** dull office life”. boring = dull; came to be regarded as = became.",
          "**12 emails** — F: “the number of **emails** and instant messages rose sharply”. sent more = the number rose. Không điền conversation (cái đó giảm).",
          "**13 sick leave** — G: “took around sixty per cent more days of **sick leave**”. Hai từ, đúng giới hạn; “days” không cần vì trước chỗ trống đã có more.",
        ],
      },
      {
        t: "table",
        caption: "Chấm điểm (13 câu)",
        head: ["Số câu đúng", "Mức", "Việc cần làm"],
        rows: [
          ["11–13", "≈ band 6.5+", "Giữ nhịp; lần sau ép xuống 18 phút."],
          ["8–10", "≈ band 6", "Đạt đích. Xem lại câu sai thuộc bẫy nào ở mục 3."],
          ["5–7", "≈ band 5–5.5", "Làm lại bước 2 (bản đồ đoạn) và bảng 12 loại thông tin; ôn Tập 2 Ngày 16."],
          ["0–4", "dưới band 5", "Đọc lại bài không bấm giờ, gạch chân động từ tường thuật và từ nối trong từng đoạn."],
        ],
      },

      { t: "h", text: "6. Soi lại bài: động từ tường thuật là biển chỉ đường" },
      { t: "p", text: "Bài đọc học thuật luôn thuật lại ý của nhiều phía. Nhìn **động từ tường thuật** là biết tác giả đang thuật lời ai và với thái độ nào — đúng bảng ở bài Ngữ pháp hôm nay." },
      {
        t: "mcq", id: "t3d19-doc-tuong-thuat", title: "Động từ tường thuật trong bài “The Open-Plan Office” (6 câu)",
        items: [
          { q: "Đoạn E: “Its advocates **maintained** that taking away barriers would lead to chance meetings.” maintained cho biết gì?", options: ["Họ đã chứng minh được điều đó.", "Họ giữ vững quan điểm đó (dù có người nghi ngờ).", "Họ thừa nhận mình sai.", "Họ dự đoán một cách dè dặt."], correct: 1, why: "maintain that = khăng khăng giữ quan điểm; tác giả không nói điều đó đúng." },
          { q: "Đoạn E: vì sao viết “**would** lead” chứ không phải “will lead”?", options: ["Vì đó là điều kiện loại 2.", "Vì là thói quen trong quá khứ.", "Vì lùi thì sau maintained (quá khứ).", "Vì lịch sự."], correct: 2, why: "Lời tường thuật sau động từ dẫn quá khứ: will → would." },
          { q: "Đoạn D: “He later **admitted** that he **had not foreseen**…” — thì quá khứ hoàn thành dùng vì:", options: ["việc “không lường trước” xảy ra trước lúc ông thừa nhận.", "ông vẫn chưa lường trước được.", "đó là sự thật hiển nhiên.", "sau admit luôn dùng had."], correct: 0, why: "Lùi thì: “I did not foresee” → had not foreseen (xảy ra trước admitted)." },
          { q: "Đoạn F: “The authors **suggested** that people… **may** withdraw.” Hai chữ này cho thấy:", options: ["tác giả chắc chắn 100%.", "đây là mệnh lệnh.", "kết quả đã bị bác bỏ.", "đây là lời giải thích dè dặt, chưa khẳng định."], correct: 3, why: "suggest (cho rằng) + may = mức chắc thấp — ngôn ngữ thận trọng của nghiên cứu." },
          { q: "Đoạn H: “Early reports **claim** that satisfaction is higher.” Người viết ngụ ý:", options: ["điều này đã được chứng minh.", "đây là lời của các báo cáo, chưa chắc đúng.", "người viết hoàn toàn đồng ý.", "các báo cáo đã rút lại ý kiến."], correct: 1, why: "claim = tuyên bố nhưng chưa được kiểm chứng — và ngay sau đó là although…" },
          { q: "Đoạn A: “it is easy to assume it **must be** the best way” — must be ở đây là:", options: ["nghĩa vụ: phải là.", "lời khuyên.", "suy đoán: chắc hẳn là.", "sự cho phép."], correct: 2, why: "Modal suy đoán hiện tại (mục 6 bài Ngữ pháp): vì phổ biến nên người ta đoán chắc hẳn nó tốt nhất." },
        ],
      },

      { t: "h", text: "7. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "partition", pos: "n", ipa: "/pɑːˈtɪʃn/", vi: "vách ngăn", ex: "Low partitions separate the desks in our office.", exVi: "Các vách ngăn thấp ngăn cách bàn làm việc ở văn phòng chúng tôi.", more: "a glass / movable **partition** · động từ: partition a room" },
          { w: "advocate", pos: "n, v", ipa: "/ˈædvəkət/", vi: "người ủng hộ; (v) ủng hộ, chủ trương", ex: "Advocates of remote working say it saves time and money.", exVi: "Những người ủng hộ làm việc từ xa nói rằng nó tiết kiệm thời gian và tiền bạc.", more: "an **advocate of / for** · động từ đọc /ˈædvəkeɪt/: advocate (doing) sth — không thêm for" },
          { w: "foresee", pos: "v", ipa: "/fɔːˈsiː/", vi: "lường trước, thấy trước", ex: "Nobody foresaw how quickly online shopping would grow.", exVi: "Không ai lường trước mua sắm trực tuyến sẽ tăng nhanh thế nào.", more: "foresee – foresaw – foreseen · in the **foreseeable** future · unforeseen problems" },
          { w: "overhear", pos: "v", ipa: "/ˌəʊvəˈhɪə/", vi: "nghe lỏm, tình cờ nghe thấy", ex: "I overheard two colleagues talking about the new manager.", exVi: "Tôi tình cờ nghe hai đồng nghiệp nói về quản lý mới.", more: "overhear – overheard – overheard · overhear sb **doing / do** sth" },
          { w: "interruption", pos: "n", ipa: "/ˌɪntəˈrʌpʃn/", vi: "sự gián đoạn, sự ngắt quãng", ex: "Constant interruptions make it hard to finish a report.", exVi: "Bị ngắt quãng liên tục khiến khó hoàn thành báo cáo.", more: "interrupt (v) · work **without interruption** · constant / frequent interruptions" },
          { w: "withdraw", pos: "v", ipa: "/wɪðˈdrɔː/", vi: "rút lui, thu mình lại; rút (tiền)", ex: "Some employees withdraw when they feel they are being watched.", exVi: "Một số nhân viên thu mình lại khi cảm thấy bị theo dõi.", more: "withdraw – withdrew – withdrawn · **withdraw from** · withdraw money · withdrawal (n)" },
          { w: "convert", pos: "v", ipa: "/kənˈvɜːt/", vi: "chuyển đổi, cải tạo thành", ex: "The old factory was converted into flats.", exVi: "Nhà máy cũ được cải tạo thành căn hộ.", more: "**convert A into / to B** · conversion (n) · AWL sublist 7" },
        ],
      },
      { t: "note", title: "💡 Cách học sau bài", items: ["Mở lại bài, **không nhìn đáp án**, tự ghi bản đồ 8 đoạn bằng 2–4 chữ mỗi đoạn — so với lần làm đầu.", "Chép 12 danh từ loại thông tin vào sổ; mỗi lần gặp dạng này ở Online Test, ghi thêm danh từ mới (an outline of, details of, a suggestion that…).", "Sai câu nào ở Online Test dạng này, phiếu điểm sẽ dẫn về đúng bài hôm nay."] },
    ],
  },

  /* ═══════════════════════ BÀI 3 — NÓI ═══════════════════════ */
  {
    id: "t3d19-noi",
    kind: "speaking",
    title: "Part 3: thuật lại ý người khác — “Some people say…”",
    goal: "Trả lời câu hỏi Part 3 kiểu “Some people say that… What do you think?” ở mức band 6: thuật lại ý người ta bằng lời mình, đoán vì sao họ nghĩ vậy, rồi nêu ý mình có mức độ kèm ví dụ — nói 35–45 giây mỗi câu, và đọc rõ âm cuối /s/ /z/ /ɪz/.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        items: [
          "Part 3 hay hỏi **qua miệng người khác**: “**Some people say** that… — do you agree?”, “**Why do some people think**…?”, “**It's often said** that…”. Giám khảo muốn nghe bạn **bàn về một ý kiến**, không chỉ nói thích hay không thích.",
          "Khung 4 bước **T–V–M–V**: **T**huật lại ý đó bằng lời mình → **V**ì sao họ nghĩ vậy (đoán bằng might / must) → ý **M**ình (đồng ý tới đâu) → **V**í dụ.",
          "Dùng ngay ngữ pháp bài 1: **say that / argue that / told me to…** và **might be / must have…**. Đây là chỗ GRA band 6 lộ ra khi nói.",
          "Nối Ngày 10 (đồng ý theo mức) và Ngày 6 (2 lý do + ví dụ). Hôm nay thêm một tầng: **tách ý của người ta khỏi ý của mình**.",
          "🔊 Phát âm: âm cuối **/s/ · /z/ · /ɪz/** — thinks, claims, argues, changes. Người Việt hay nuốt mất, giám khảo nghe thành sai ngữ pháp.",
        ],
      },

      { t: "h", text: "1. Dạng câu hỏi và band 5 hay hụt ở đâu" },
      {
        t: "table",
        head: ["Giám khảo hỏi", "Thật ra muốn nghe"],
        rows: [
          ["**Some people say** that young people today are less patient. **Do you agree?**", "Bạn hiểu vì sao người ta nói vậy + bạn đồng ý tới đâu"],
          ["**Why do some people think** a university degree is no longer necessary?", "Lý do **của họ** (chưa cần ý bạn) — đoán 2 lý do"],
          ["**It's often said** that money can't buy happiness. **What's your view?**", "Thuật lại nhanh → ý bạn → ví dụ"],
          ["**Some people believe** X, **while others** think Y. **What about you?**", "Nói đủ **hai phía** rồi mới chọn (giống Discussion ở Ngày 10)"],
        ],
      },
      {
        t: "table",
        caption: "Band 5 và band 6 ở dạng câu hỏi này",
        head: ["Tiêu chí", "Band 5", "Band 6"],
        rows: [
          ["FC (trôi chảy, mạch lạc)", "Trả lời ngay “Yes, I agree” rồi hết ý sau 10 giây; hoặc lặp lại nguyên câu hỏi", "Nói 35–45 giây theo một đường: ý người ta → vì sao → ý mình → ví dụ"],
          ["LR (từ vựng)", "people say… people think… I think…", "argue · claim · reckon · tend to think · I can see why · there's some truth in that"],
          ["GRA (ngữ pháp)", "Câu đơn hiện tại; không thuật lại được lời ai", "that-clause, lời tường thuật (told me that… would…), modal suy đoán (might be, must have)"],
          ["P (phát âm)", "Nuốt -s: “people **say**, my father **say**, he **think**”", "Giữ âm cuối: he **says** /sez/, she **thinks** /θɪŋks/"],
        ],
      },
      { t: "note", title: "📌 Lỗi đặc trưng: trộn ý người ta với ý mình", items: ["Giám khảo hỏi “Why do some people think…?” mà bạn đáp “I think…” ⇒ lạc câu hỏi. Bắt đầu bằng **They…** / **I suppose they…**", "Ngược lại, hỏi “Do you agree?” mà chỉ thuật lại ý người ta rồi dừng ⇒ thiếu ý kiến. Phải có câu **Personally, …**", "Đừng nói “According to me”. Nói **Personally / For me / As I see it**."] },

      { t: "h", text: "2. Khung 4 bước T–V–M–V" },
      {
        t: "sodo", kind: "flow", title: "Một câu trả lời 35–45 giây",
        steps: [
          { label: "T — Thuật lại", sub: "Yeah, a lot of people say that… (đổi chữ, đừng lặp nguyên văn câu hỏi) — 5 giây" },
          { label: "V — Vì sao họ nghĩ vậy", sub: "I suppose that's because… / They might be thinking of… — 10 giây" },
          { label: "M — Ý mình, có mức độ", sub: "I can see why, but personally I'd say… — 10 giây" },
          { label: "V — Ví dụ", sub: "For instance, my cousin… / Take … for example — 10–15 giây" },
        ],
      },
      { t: "p", text: "Với câu hỏi “**Why do some people think**…?” (chỉ hỏi lý do của họ), dùng **T → V → V thứ hai → (M ngắn)**: thuật lại, hai lý do của họ, rồi thêm một câu ý mình nếu còn thời gian." },
      { t: "rule", formula: "A lot of people say that… → I suppose that's because… → Personally, I'd say… → For instance, …", vi: "Thuật lại — Vì sao — ý Mình — Ví dụ. Mỗi bước một đến hai câu." },

      { t: "h", text: "3. Bước T — khung câu thuật lại ý người khác khi NÓI" },
      { t: "p", text: "Khi viết, bạn dùng argue / claim / maintain. Khi **nói**, giữ argue / claim được nhưng thêm vài cách **tự nhiên hơn**. Sau các khung này, động từ ở **hiện tại** (không lùi thì) vì ý kiến đó vẫn đang tồn tại." },
      {
        t: "patterns",
        rows: [
          { formula: "A lot of people / Some people + say / think / argue / claim / reckon + (that) + S + V", vi: "Nhiều người nói / cho rằng… (reckon = nghĩ là — thân mật, rất Anh / Úc)", examples: [{ en: "A lot of people reckon that kids spend too much time on their phones.", vi: "Nhiều người nghĩ trẻ con dùng điện thoại quá nhiều." }] },
          { formula: "People (of my parents' generation) + tend to + think / believe + (that)…", vi: "Người (thế hệ bố mẹ tôi) thường có xu hướng nghĩ… — tend to làm câu bớt tuyệt đối", examples: [{ en: "People of my parents' generation tend to think that a stable job matters most.", vi: "Thế hệ bố mẹ tôi thường nghĩ công việc ổn định là quan trọng nhất." }] },
          { formula: "You often hear (people say) that…  ·  It's often said that…  ·  There's this idea that…", vi: "Ta hay nghe nói rằng… / Người ta thường nói… / Có cái quan niệm rằng…", examples: [{ en: "You often hear that money can't buy happiness.", vi: "Ta hay nghe rằng tiền không mua được hạnh phúc." }] },
          { formula: "Those who + V… + would say / would argue (that)…", vi: "Những người (làm gì đó) sẽ nói rằng… — tách rõ một nhóm", examples: [{ en: "Those who work in tech would argue that skills matter more than a degree.", vi: "Người làm công nghệ sẽ cho rằng kỹ năng quan trọng hơn bằng cấp." }] },
          { formula: "My dad always says (that)…  ·  My teacher once told me (that) + S + V lùi thì  ·  …told me to V", vi: "Thuật lời MỘT người thật: says (thói quen) không lùi; once told (một lần trong quá khứ) lùi thì", examples: [{ en: "My grandmother always says that patience is a kind of wealth.", vi: "Bà tôi luôn nói kiên nhẫn là một kiểu giàu có." }, { en: "My first manager once told me that nobody would remember my grades.", vi: "Quản lý đầu tiên của tôi từng bảo rằng sẽ chẳng ai nhớ điểm số của tôi." }] },
        ],
      },
      {
        t: "table",
        caption: "Đổi chữ của câu hỏi — đừng lặp nguyên văn (paraphrase là tiêu chí LR band 6)",
        head: ["Giám khảo nói", "Bạn thuật lại"],
        rows: [
          ["young people are **less patient**", "…that my generation **can't wait for anything** / **wants everything straight away**"],
          ["a degree is **no longer necessary**", "…that you **don't really need to go to university** any more"],
          ["money **can't buy happiness**", "…that **being rich doesn't make you happy**"],
          ["social media **makes people lonely**", "…that we're **more connected but less close**"],
          ["children **should learn to code**", "…that **programming should be taught** from primary school"],
        ],
      },

      { t: "h", text: "4. Bước V — đoán vì sao họ nghĩ vậy" },
      { t: "p", text: "Bạn không đọc được suy nghĩ của người khác, nên phải **đoán** — và đoán thì dùng **modal suy đoán** của bài 1. Một câu “They **might be** thinking of…” hoặc “They **must have** had…” là đủ để giám khảo ghi nhận câu phức." },
      {
        t: "patterns",
        rows: [
          { formula: "I suppose / I guess + that's because + S + V", vi: "Tôi đoán đó là vì…", examples: [{ en: "I suppose that's because everything is instant now — food, films, even friends.", vi: "Tôi đoán là vì giờ cái gì cũng tức thì — đồ ăn, phim, cả bạn bè." }] },
          { formula: "They might / may / could + be + V-ing / adj …", vi: "Có lẽ họ đang… (đoán về hiện tại)", examples: [{ en: "They might be comparing us with how they grew up.", vi: "Có lẽ họ đang so chúng tôi với cách họ lớn lên." }] },
          { formula: "They must / might + have + V3 …", vi: "Chắc hẳn / có lẽ họ đã… (đoán về trải nghiệm quá khứ)", examples: [{ en: "They must have seen graduates who couldn't find a job.", vi: "Chắc hẳn họ đã thấy những người tốt nghiệp mà không tìm được việc." }] },
          { formula: "From their point of view, …  ·  If you look at it from their side, …", vi: "Từ góc nhìn của họ…", examples: [{ en: "From their point of view, four years at university is a lot of money for one piece of paper.", vi: "Từ góc nhìn của họ, bốn năm đại học là rất nhiều tiền cho một tờ giấy." }] },
        ],
      },

      { t: "h", text: "5. Bước M — chuyển sang ý mình, có mức độ" },
      {
        t: "table",
        caption: "Câu chuyển từ “ý họ” sang “ý mình” (ôn thang đồng ý ở Ngày 10)",
        head: ["Mức", "Câu chuyển", "Ghi chú"],
        rows: [
          ["Đồng ý phần lớn", "**I think there's a lot of truth in that.** · I'd go along with that, mostly.", "rồi thêm một lý do của riêng bạn"],
          ["Đồng ý một phần", "**I can see why they'd say that, but**… · That's true **up to a point**, but…", "mức an toàn và giàu ý nhất"],
          ["Tuỳ trường hợp", "**It really depends on**… · That might be true for…, but not for…", "tách nhóm: tuổi, nghề, thành thị – nông thôn"],
          ["Không đồng ý", "**I'm not convinced, to be honest.** · I don't really buy that.", "lịch sự: đừng nói “They are wrong.”"],
        ],
      },
      { t: "rule", formula: "I can see why they'd say that, but personally I'd say (that)…", vi: "Câu bản lề của cả bài: công nhận ý người ta trước, rồi mới nêu ý mình. they'd = they would." },
      {
        t: "quiz", id: "t3d19-noi-khung-dich", title: "Dịch Việt → Anh — dùng khung câu (5 câu)", kind: "translate", grammar: "say / tend to think that… · might be / must have… · I can see why…, but…",
        items: [
          { q: "Nhiều người nói rằng giới trẻ ngày nay muốn mọi thứ ngay lập tức.", answers: ["A lot of people say that young people today want everything straight away.", "Many people say that young people today want everything straight away.", "A lot of people say that young people today want everything immediately.", "A lot of people say young people today want everything straight away.", "Many people say that young people today want everything immediately."], hint: "A lot of people say that · straight away" },
          { q: "Thế hệ bố mẹ tôi thường nghĩ rằng một công việc ổn định là quan trọng nhất.", answers: ["People of my parents' generation tend to think that a stable job is the most important thing.", "My parents' generation tend to think that a stable job is the most important thing.", "My parents' generation tends to think that a stable job is the most important thing.", "People of my parents' generation tend to think that a stable job matters most.", "My parents' generation tends to think that a stable job matters most."], hint: "tend to think that · a stable job" },
          { q: "Có lẽ họ đang so chúng tôi với thời của họ.", answers: ["They might be comparing us with their time.", "They may be comparing us with their time.", "They might be comparing us with their own time.", "They might be comparing us to their time.", "They could be comparing us with their time."], hint: "might be + V-ing · compare A with B" },
          { q: "Chắc hẳn họ đã có một trải nghiệm tồi tệ.", answers: ["They must have had a bad experience."], hint: "must have + had" },
          { q: "Tôi hiểu vì sao họ nói vậy, nhưng cá nhân tôi không đồng ý.", answers: ["I can see why they would say that, but personally I disagree.", "I can see why they'd say that, but personally I disagree.", "I can see why they say that, but personally I don't agree.", "I can see why they'd say that, but personally I don't agree.", "I can see why they say that, but personally I disagree."], hint: "I can see why they'd say that, but personally…" },
        ],
      },

      { t: "h", text: "6. Hai câu trả lời mẫu cho cùng câu hỏi: band 5 và band 6" },
      { t: "p", text: "Câu hỏi 1: **Some people say that young people today are less patient than previous generations. Do you agree?** Nghe hai bản rồi mới đọc bảng so sánh." },
      {
        t: "dialogue", title: "Bản band 5 (khoảng 15 giây, 37 từ)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Some people say that young people today are less patient than previous generations. Do you agree?", vi: "Một số người nói giới trẻ ngày nay kém kiên nhẫn hơn các thế hệ trước. Bạn có đồng ý không?" },
          { who: "Candidate", role: "candidate", text: "Yes, I agree. Young people are less patient. Because they use smartphone a lot and everything is fast. My father say I am not patient. I think it is not good. So I agree with this idea.", vi: "Vâng, tôi đồng ý. Giới trẻ kém kiên nhẫn hơn. Vì họ dùng điện thoại nhiều và mọi thứ đều nhanh. Bố tôi nói tôi không kiên nhẫn. Tôi nghĩ điều đó không tốt. Nên tôi đồng ý với ý này." },
        ],
      },
      {
        t: "dialogue", title: "Bản band 6 (khoảng 45 giây, 110 từ)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Some people say that young people today are less patient than previous generations. Do you agree?", vi: "Một số người nói giới trẻ ngày nay kém kiên nhẫn hơn các thế hệ trước. Bạn có đồng ý không?" },
          { who: "Candidate", role: "candidate", text: "Yeah, you hear that a lot — that my generation wants everything straight away. I suppose that's because we grew up with instant everything: food arrives in twenty minutes, and a film starts the second you press play. So older people might be comparing us with a time when they had to wait weeks for a letter. I can see why they'd say that, but personally I think it's only true for small things. My dad always says that I can't queue for five minutes, and he's right. But when it comes to something like learning to code, I've spent three years on it, which takes a lot of patience.", vi: "Vâng, câu đó nghe suốt — rằng thế hệ tôi muốn mọi thứ ngay lập tức. Tôi đoán là vì chúng tôi lớn lên với cái gì cũng tức thì: đồ ăn tới trong hai mươi phút, phim bắt đầu ngay giây bạn bấm phát. Nên người lớn tuổi có lẽ đang so chúng tôi với thời họ phải chờ hàng tuần cho một lá thư. Tôi hiểu vì sao họ nói vậy, nhưng cá nhân tôi nghĩ nó chỉ đúng với chuyện nhỏ. Bố tôi luôn nói tôi không xếp hàng nổi năm phút, và ông đúng. Nhưng với chuyện như học lập trình, tôi đã bỏ ba năm vào nó, cái đó cần rất nhiều kiên nhẫn." },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Bản band 5", "Bản band 6"],
        rows: [
          ["FC", "6 câu rời, lặp “I agree” ba lần, hết ý sau 15 giây", "Đủ 4 bước T–V–M–V; nối bằng I suppose · So · I can see why… but · But when it comes to"],
          ["LR", "Lặp nguyên “less patient”; “fast”, “not good”", "Đổi chữ câu hỏi: **wants everything straight away**; instant everything · queue · when it comes to"],
          ["GRA", "Câu đơn; lỗi **use smartphone**, **my father say**", "that-clause (says that I can't…), modal suy đoán (**might be comparing**), mệnh đề quan hệ (a time when…, which takes…), hiện tại hoàn thành"],
          ["P", "**say** thiếu -s ⇒ nghe thành lỗi ngữ pháp", "says /sez/, wants /wɒnts/, arrives /əraɪvz/, things /θɪŋz/ rõ âm cuối"],
          ["Nội dung", "Chỉ có ý mình, không giải thích ý người ta", "Tách rõ: ý họ → vì sao họ nghĩ vậy → mình đồng ý **một phần** + ví dụ thật"],
        ],
      },
      { t: "p", text: "Câu hỏi 2 — chỉ hỏi lý do của người khác: **Why do some people think a university degree is no longer necessary?**" },
      {
        t: "dialogue", title: "Bản band 6 cho câu hỏi “Why do some people think…?” (khoảng 40 giây, 96 từ)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do some people think a university degree is no longer necessary?", vi: "Vì sao một số người nghĩ bằng đại học không còn cần thiết nữa?" },
          { who: "Candidate", role: "candidate", text: "Well, I think there are two main reasons. First, those who work in tech would argue that skills matter more than a certificate — you can learn programming online for almost nothing. Second, they must have seen graduates who couldn't find a job in their field, so from their point of view, four years of fees is a big risk. One of my seniors actually told me that his degree had never been checked by any employer. Having said that, I'm not totally convinced, because for jobs like medicine or engineering you obviously can't teach yourself.", vi: "À, tôi nghĩ có hai lý do chính. Thứ nhất, người làm công nghệ sẽ cho rằng kỹ năng quan trọng hơn một tấm chứng chỉ — bạn có thể học lập trình trên mạng gần như miễn phí. Thứ hai, chắc hẳn họ đã thấy những người tốt nghiệp không tìm được việc đúng ngành, nên từ góc nhìn của họ, bốn năm học phí là một rủi ro lớn. Một anh khoá trên từng bảo tôi rằng bằng của anh ấy chưa bao giờ được nhà tuyển dụng nào kiểm tra. Dù vậy, tôi không hoàn toàn bị thuyết phục, vì với nghề như y hay kỹ sư thì rõ ràng bạn không thể tự học." },
        ],
      },
      {
        t: "note", title: "💡 Soi bản mẫu thứ hai",
        items: [
          "Chủ ngữ là **họ** suốt ba câu đầu (those who work in tech · they · from their point of view) — đúng trọng tâm câu hỏi “Why do some people think”.",
          "**told me that his degree had never been checked** — lời tường thuật có lùi thì + bị động: một câu ăn điểm GRA.",
          "**must have seen** — suy đoán về trải nghiệm của họ.",
          "Câu cuối **Having said that, I'm not totally convinced** — thêm ý mình ngắn gọn, không lấn phần chính.",
        ],
      },
      {
        t: "mcq", id: "t3d19-noi-chon", title: "Chọn câu mở tốt nhất cho câu trả lời (5 câu)",
        items: [
          { q: "“Some people say social media makes people lonelier. What do you think?” — câu mở nào ở mức band 6?", options: ["Yes, social media makes people lonelier.", "According to me, it is true.", "Yeah, there's this idea that we're more connected but actually less close.", "I don't know about some people."], correct: 2, why: "Thuật lại bằng lời mình (paraphrase), dùng khung There's this idea that… — không lặp nguyên câu hỏi." },
          { q: "“Why do some people think children should learn to code at school?” — câu tiếp theo nên bắt đầu bằng:", options: ["I suppose they're thinking about the job market…", "I think coding is boring…", "In my opinion I like games…", "Yes, I agree with them…"], correct: 0, why: "Câu hỏi hỏi lý do CỦA HỌ ⇒ chủ ngữ they + đoán (I suppose they're thinking…)." },
          { q: "Câu nào thuật lời một người thật ĐÚNG ngữ pháp?", options: ["My teacher once said me that I will succeed.", "My teacher once told me that I would succeed.", "My teacher once told that I would succeed.", "My teacher once told me that I will succeeded."], correct: 1, why: "told + me + that + would (lùi thì sau once told)." },
          { q: "Câu chuyển nào đúng và tự nhiên?", options: ["They are wrong, I think.", "According to my opinion, no.", "I see why they would said that.", "I can see why they'd say that, but I'm not convinced."], correct: 3, why: "Công nhận rồi mới phản đối; they'd say = they would say (V nguyên mẫu)." },
          { q: "Muốn đoán “chắc họ đã lớn lên ở nông thôn”, nói:", options: ["They must grow up in the countryside.", "They should have grown up in the countryside.", "They must have grown up in the countryside.", "They can't grow up in the countryside."], correct: 2, why: "Suy đoán về quá khứ: must have + V3 (grown)." },
        ],
      },

      { t: "h", text: "7. Phát âm: âm cuối /s/ · /z/ · /ɪz/" },
      { t: "p", text: "Tiếng Việt không có phụ âm /s/, /z/ ở cuối từ, nên người Việt hay **bỏ hẳn**: “he say”, “people think”, “many problem”. Khi nói về ý người khác bạn dùng ngôi thứ ba liên tục (she **thinks**, he **argues**, the report **claims**) — bỏ -s là giám khảo nghe ra **lỗi ngữ pháp**, không chỉ lỗi phát âm. Quy tắc dựa vào **âm đứng ngay trước** -s:" },
      {
        t: "table",
        caption: "Ba cách đọc đuôi -s / -es (ôn Tập 1 Ngày 1, nâng lên mức câu)",
        head: ["Đọc", "Khi âm trước là", "Ví dụ"],
        rows: [
          ["**/s/** (gió, không rung)", "âm vô thanh: /p t k f θ/", "thin**ks** /θɪŋks/ · sugges**ts** /sədʒests/ · accep**ts** /əksepts/ · cos**ts** /kɒsts/"],
          ["**/z/** (rung cổ họng)", "âm hữu thanh và mọi nguyên âm: /b d ɡ v ð m n ŋ l r/…", "clai**ms** /kleɪmz/ · argue**s** /ɑːɡjuːz/ · believe**s** /bɪliːvz/ · say**s** /sez/ · goe**s** /ɡəʊz/"],
          ["**/ɪz/** (thêm một âm tiết)", "âm xuýt: /s z ʃ ʒ tʃ dʒ/", "notic**es** /nəʊtɪsɪz/ · increas**es** /ɪnkriːsɪz/ · chang**es** /tʃeɪndʒɪz/ · pric**es** /praɪsɪz/"],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai",
        items: [
          "**says** đọc **/sez/** (như “sez”), không phải /seɪz/. **does** đọc /dʌz/.",
          "Đọc mọi -s thành /s/: “claim**ss**”, “argue**ss**”. Đặt tay lên cổ: /z/ phải **rung**.",
          "Cụm phụ âm cuối **-sts / -sks / -pts** (suggests, asks, accepts): đừng bỏ âm giữa, đọc chậm từng âm rồi nhanh dần.",
          "Cặp nghĩa khác nhau chỉ vì /s/ – /z/: **price** /praɪs/ – **prize** /praɪz/ · **rice** – **rise** · **place** – **plays** · **advice** (n) – **advise** (v).",
          "Âm cuối /s z/ **nối** sang nguyên âm sau: say**s‿i**t /sez ɪt/ · thin**ks‿a**bout.",
        ],
      },
      {
        t: "phatam", id: "t3d19-phat-am", title: "Luyện phát âm — âm cuối /s/ · /z/ · /ɪz/ trong động từ tường thuật",
        note: "Bấm “Nghe mẫu”, đọc chậm và kéo dài âm cuối một chút, rồi “Đọc & chấm”. Dòng 1–5: từ; dòng 6–10: câu dùng được ngay ở Part 3.",
        items: [
          { text: "claims, argues, believes", ipa: "kleɪmz ɑːɡjuːz bɪliːvz", vi: "/z/ sau âm hữu thanh" },
          { text: "thinks, suggests, accepts", ipa: "θɪŋks sədʒests əksepts", vi: "/s/ sau âm vô thanh" },
          { text: "says, does, goes", ipa: "sez dʌz ɡəʊz", vi: "ba từ hay đọc sai nguyên âm" },
          { text: "notices, increases, changes", ipa: "nəʊtɪsɪz ɪnkriːsɪz tʃeɪndʒɪz", vi: "/ɪz/ — thêm một âm tiết" },
          { text: "price, prize", ipa: "praɪs praɪz", vi: "cặp tối thiểu /s/ – /z/" },
          { text: "Some people say that money changes people.", ipa: "sʌm piːpl seɪ ðət mʌni tʃeɪndʒɪz piːpl", vi: "Một số người nói tiền làm thay đổi con người." },
          { text: "My dad always says that hard work pays off.", ipa: "maɪ dæd ɔːlweɪz sez ðət hɑːd wɜːk peɪz ɒf", vi: "Bố tôi luôn nói làm việc chăm chỉ sẽ được đền đáp." },
          { text: "She thinks that schools need more teachers.", ipa: "ʃi θɪŋks ðət skuːlz niːd mɔː tiːtʃəz", vi: "Cô ấy nghĩ trường học cần thêm giáo viên." },
          { text: "He argues that prices rise when wages rise.", ipa: "hi ɑːɡjuːz ðət praɪsɪz raɪz wen weɪdʒɪz raɪz", vi: "Ông ấy lập luận rằng giá tăng khi lương tăng." },
          { text: "Critics claim that it costs too much.", ipa: "krɪtɪks kleɪm ðət ɪt kɒsts tuː mʌtʃ", vi: "Người chỉ trích cho rằng nó tốn quá nhiều tiền." },
        ],
      },
      {
        t: "mcq", id: "t3d19-noi-am-cuoi", title: "Đuôi -s đọc thế nào? (6 câu)",
        items: [
          { q: "argue**s**", options: ["/s/", "/z/", "/ɪz/", "không đọc"], correct: 1, why: "Sau nguyên âm /uː/ ⇒ /z/: /ɑːɡjuːz/." },
          { q: "suggest**s**", options: ["/s/", "/z/", "/ɪz/", "/əz/"], correct: 0, why: "Sau /t/ vô thanh ⇒ /s/: /sədʒests/." },
          { q: "promis**es**", options: ["/s/", "/z/", "/ɪz/", "không đọc"], correct: 2, why: "Sau âm xuýt /s/ ⇒ /ɪz/: /prɒmɪsɪz/ — thêm một âm tiết." },
          { q: "believe**s**", options: ["/s/", "/ɪz/", "/ɪs/", "/z/"], correct: 3, why: "Sau /v/ hữu thanh ⇒ /z/: /bɪliːvz/." },
          { q: "Từ nào đọc là /sez/?", options: ["says", "seas", "sees", "size"], correct: 0, why: "says = /sez/; seas / sees = /siːz/; size = /saɪz/." },
          { q: "Cặp nào KHÁC nghĩa chỉ vì âm cuối /s/ – /z/?", options: ["think – thinks", "claim – claims", "advice – advise", "cost – costs"], correct: 2, why: "advice /ədvaɪs/ (lời khuyên, n) – advise /ədvaɪz/ (khuyên, v)." },
        ],
      },

      { t: "h", text: "8. Luyện nói — ghi âm, AI chấm" },
      { t: "p", text: "Mỗi câu nói **35–45 giây** theo T–V–M–V. Trước khi ghi âm, viết ra giấy 4 chữ khoá (một chữ cho mỗi bước), không viết cả câu. Nghe lại bản ghi và tự kiểm: (1) có thuật lại bằng **chữ khác** câu hỏi không; (2) có ít nhất **một modal suy đoán**; (3) có câu chuyển **I can see why… but…**; (4) mọi **-s** ngôi thứ ba có nghe được không." },
      {
        t: "speak", id: "t3d19-noi-part3", part: "3",
        questions: [
          "Some people say that young people today are less patient than previous generations. Do you agree?",
          "Why do some people think a university degree is no longer necessary?",
          "It's often said that money can't buy happiness. What's your view?",
          "Some people believe that social media makes people lonelier, while others think it brings people together. What about you?",
          "Many people argue that children should learn to code at primary school. Why do you think they say that?",
        ],
      },
      {
        t: "speak", id: "t3d19-noi-ke-lai", part: "3",
        questions: [
          "What is the best piece of advice anyone has ever given you? Who told you, and what did they say?",
          "Do older people in your country often criticise the younger generation? What do they usually say?",
        ],
      },
      { t: "note", title: "📌 Gợi ý cho hai câu “kể lại lời người khác”", items: ["Dùng **told me to + V** / **advised me not to + V** cho lời khuyên: My uncle **told me to save** ten per cent of everything I earned.", "Dùng **said that + lùi thì** cho câu kể: He **said that** small habits **mattered** more than big plans.", "Kết bằng đánh giá: Looking back, he **must have learned** that the hard way. / I **should have listened** earlier."] },
    ],
  },

  /* ═══════════════════════ BÀI TẬP ═══════════════════════ */
  {
    id: "t3d19-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 19 — câu tường thuật · động từ tường thuật · modal suy đoán · Matching information · âm cuối -s",
    goal: "Tự kiểm cả ngày bằng 42 câu có đáp án và một bài nói Part 3; đúng từ 30 câu trở lên là đạt.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Cách làm",
        items: [
          "Làm một mạch, **không mở lại bài học**; xong mới xem đáp án.",
          "Phần I–IV: ngữ pháp (29 câu). Phần V: đọc Matching information (5 câu). Phần VI: phát âm (5 câu). Phần VII: nói — AI chấm, và 3 câu chọn câu trả lời tốt.",
          "Đúng **≥ 30 / 42**: đạt. Sai nhiều ở phần nào thì ôn đúng mục đó (ghi dưới mỗi phần).",
          "Câu sai chép vào **Sổ lỗi** — bài kiểm tra chặng Ngày 24 sẽ hỏi lại.",
        ],
      },

      { t: "h", text: "Phần I — Câu tường thuật (10 câu)" },
      {
        t: "mcq", id: "t3d19-bt-tuong-thuat", title: "Chọn đáp án đúng",
        items: [
          { q: "“I'm leaving the company.” → She told me she ___ the company.", options: ["is leaving", "was leaving", "has left", "leaves"], correct: 1, why: "am leaving → was leaving." },
          { q: "“We'll finish by Friday.” → The builders said they ___ by Friday.", options: ["would finish", "will finish", "finished", "had finished"], correct: 0, why: "will → would." },
          { q: "“Did you enjoy the course?” → He asked me ___ the course.", options: ["did I enjoy", "that I enjoyed", "if I enjoy", "if I had enjoyed"], correct: 3, why: "Yes/No ⇒ if; did enjoy → had enjoyed." },
          { q: "“Don't park here.” → The guard told us ___ there.", options: ["don't park", "not park", "not to park", "to not parking"], correct: 2, why: "told + O + not to V." },
          { q: "“Where do your parents live?” → She asked me where ___.", options: ["do my parents live", "my parents lived", "did my parents live", "my parents live?"], correct: 1, why: "Wh- + S + V lùi thì, không đảo." },
          { q: "“I've lost my keys.” → He said he ___ his keys.", options: ["had lost", "has lost", "loses", "was losing"], correct: 0, why: "have lost → had lost." },
          { q: "“Why don't we cycle to work?” → Minh suggested ___ to work.", options: ["to cycle", "us to cycle", "cycle", "cycling"], correct: 3, why: "suggest + V-ing." },
          { q: "Experts ___ that the population will reach ten billion by 2060.", options: ["said", "told", "say", "tell us to"], correct: 2, why: "Ý kiến hiện vẫn đúng + will (không lùi) ⇒ động từ dẫn ở hiện tại: say. (said ⇒ would.)" },
          { q: "“I can't come tomorrow.” (nói hôm thứ Hai, kể lại tuần sau) → She said she couldn't come ___.", options: ["tomorrow", "the next day", "yesterday", "that day"], correct: 1, why: "tomorrow → the next day / the following day." },
          { q: "She ___ that she had made a mistake in the report.", options: ["admitted", "refused", "told", "advised"], correct: 0, why: "admit that… (thừa nhận). told cần tân ngữ; refuse / advise không đi với that như vậy." },
        ],
      },
      { t: "p", text: "Sai từ 4 câu ⇒ ôn mục 1–3 bài Ngữ pháp." },

      { t: "h", text: "Phần II — Viết dạng đúng (8 câu)" },
      {
        t: "quiz", id: "t3d19-bt-dang", title: "Viết dạng đúng của động từ trong ngoặc", kind: "fill",
        items: [
          { q: "The tutor advised us ___ (start) the assignment early.", answers: ["to start"] },
          { q: "He said that he ___ (never / see) such a long queue before.", answers: ["had never seen"] },
          { q: "The airline apologised for ___ (lose) our luggage.", answers: ["losing", "having lost"] },
          { q: "They asked whether the museum ___ (be) open on Mondays.", answers: ["was"] },
          { q: "The mayor refused ___ (answer) questions about the budget.", answers: ["to answer"] },
          { q: "She said she ___ (call) me the following day, but she never did.", answers: ["would call"] },
          { q: "The report recommends ___ (reduce) class sizes.", answers: ["reducing"] },
          { q: "Police warned residents ___ (not / leave) windows open.", answers: ["not to leave"] },
        ],
      },

      { t: "h", text: "Phần III — Động từ tường thuật học thuật (6 câu)" },
      { t: "p", text: "Hộp từ (mỗi từ dùng một lần, chia dạng nếu cần): **acknowledge · claim · deny · question · suggest · warn**" },
      {
        t: "quiz", id: "t3d19-bt-hoc-thuat", title: "Điền động từ tường thuật", kind: "fill",
        items: [
          { q: "Scientists ___ that without action, many coastal cities will flood by 2100.", answers: ["warn"] },
          { q: "The company ___ that its product is “100% natural”, but offers no proof.", answers: ["claims"] },
          { q: "New figures ___ that fewer young people are learning to drive, although the reasons are unclear.", answers: ["suggest"] },
          { q: "Even supporters of the scheme ___ that it has been more expensive than planned.", answers: ["acknowledge"] },
          { q: "Many teachers ___ whether tablets really improve learning.", answers: ["question"] },
          { q: "The minister ___ that he had ever met the businessman.", answers: ["denied", "denies"] },
        ],
      },
      { t: "p", text: "Sai từ 3 câu ⇒ ôn bảng 25 động từ ở mục 5." },

      { t: "h", text: "Phần IV — Modal suy đoán (5 câu)" },
      {
        t: "mcq", id: "t3d19-bt-modal", title: "Chọn modal đúng",
        items: [
          { q: "Her phone is switched off. She ___ in a meeting.", options: ["can't be", "should have been", "might be", "must have"], correct: 2, why: "Đoán về hiện tại, không chắc: might be." },
          { q: "The streets are flooded this morning. It ___ heavily during the night.", options: ["must rain", "should rain", "can't have rained", "must have rained"], correct: 3, why: "Bằng chứng ⇒ chắc đã mưa: must have rained." },
          { q: "He ___ the exam — he didn't answer half the questions.", options: ["can't have passed", "must have passed", "should pass", "might pass"], correct: 0, why: "Không thể nào đã đỗ: can't have passed." },
          { q: "The city is full of traffic. Planners ___ a metro system thirty years ago.", options: ["must have built", "should have built", "can't have built", "might build"], correct: 1, why: "Phê bình việc đã không làm: should have built." },
          { q: "That ___ the right address — there's no house here at all.", options: ["must be", "might be", "can't be", "mustn't be"], correct: 2, why: "Chắc chắn không ⇒ can't be (không dùng mustn't cho suy đoán)." },
        ],
      },

      { t: "h", text: "Phần V — Matching information: đoạn nào chứa thông tin? (5 câu)" },
      {
        t: "passage", title: "Hot-desking Comes to the Library",
        intro: "Bài tự soạn. Câu hỏi không theo thứ tự bài; một chữ cái có thể dùng hai lần.",
        paras: [
          { label: "A", text: "When the university library reopened after its renovation, students discovered that the long wooden tables had gone. In their place were three hundred numbered seats that could only be used by booking through a phone app. The head librarian explained that on a typical day before the change, a quarter of all seats had been ‘reserved’ by bags and coats whose owners were somewhere else." },
          { label: "B", text: "The system works rather like a cinema. A student chooses a seat on a plan of the building, receives a code, and has fifteen minutes to arrive and scan it. If nobody appears, the seat is released again. Each booking lasts a maximum of four hours, after which the student must move or book a new place." },
          { label: "C", text: "Not everyone was pleased. In a survey carried out by the students' union, almost half of those who replied said that they felt under pressure to leave even when they had not finished working. Several complained that groups of friends could no longer sit together. The union's president argued that the library should have asked students before spending the money." },
          { label: "D", text: "The library admits that the launch was rushed, but points to the results. Twelve months on, the number of individual visitors has risen by a third, and complaints about a lack of seats have almost disappeared. Other universities are now watching closely, and at least two are expected to introduce similar schemes next year." },
        ],
      },
      { t: "p", text: "Which paragraph (**A–D**) contains the following information?" },
      {
        t: "mcq", id: "t3d19-bt-doc", title: "Questions 1–5 — Matching information",
        items: [
          { q: "1. a comparison between booking a seat and another everyday activity", options: ["A", "B", "C", "D"], correct: 1, why: "B: “works rather **like a cinema**”." },
          { q: "2. a criticism of the way the decision was made", options: ["A", "B", "C", "D"], correct: 2, why: "C: “the library **should have asked** students before spending the money” — should have V3 = phê bình." },
          { q: "3. a prediction that the idea will spread", options: ["A", "B", "C", "D"], correct: 3, why: "D: “at least two **are expected to introduce** similar schemes next year”." },
          { q: "4. the proportion of seats that used to be occupied only by belongings", options: ["A", "B", "C", "D"], correct: 0, why: "A: “**a quarter** of all seats had been ‘reserved’ by bags and coats”." },
          { q: "5. an admission that something was done too quickly", options: ["A", "B", "C", "D"], correct: 3, why: "D: “The library **admits** that the launch was **rushed**” — D dùng lần hai." },
        ],
      },
      { t: "p", text: "Sai từ 2 câu ⇒ ôn bảng 12 loại thông tin (mục 2 bài Đọc) và làm lại phần khởi động." },

      { t: "h", text: "Phần VI — Âm cuối -s (5 câu)" },
      {
        t: "mcq", id: "t3d19-bt-am-cuoi", title: "Chọn từ có đuôi -s đọc KHÁC ba từ còn lại",
        items: [
          { q: "Từ nào khác?", options: ["thinks", "claims", "argues", "believes"], correct: 0, why: "thinks /s/; ba từ kia /z/." },
          { q: "Từ nào khác?", options: ["suggests", "changes", "accepts", "costs"], correct: 1, why: "changes /ɪz/; ba từ kia /s/." },
          { q: "Từ nào khác?", options: ["notices", "promises", "increases", "explains"], correct: 3, why: "explains /z/; ba từ kia /ɪz/." },
          { q: "Từ nào khác?", options: ["says", "tells", "asks", "warns"], correct: 2, why: "asks /s/ (sau /k/); ba từ kia /z/." },
          { q: "Từ nào khác?", options: ["reports", "denies", "admits", "doubts"], correct: 1, why: "denies /z/ (sau nguyên âm); ba từ kia /s/ (sau /t/)." },
        ],
      },

      { t: "h", text: "Phần VII — Nói Part 3 (3 câu chọn + ghi âm)" },
      {
        t: "mcq", id: "t3d19-bt-noi-chon", title: "Chọn câu trả lời hợp khung T–V–M–V",
        items: [
          { q: "“Some people say that working from home makes employees lazy. Do you agree?” — câu nào là bước **V (vì sao họ nghĩ vậy)**?", options: ["I suppose managers might be worried because they can't see what people are doing.", "Personally, I work better at home.", "For example, my sister finishes her tasks by 3 p.m.", "Yes, I agree with this opinion."], correct: 0, why: "Đoán lý do của họ bằng I suppose… might be… — đúng bước V." },
          { q: "Câu nào là bước **M (ý mình có mức độ)**?", options: ["They say employees are lazy.", "Lazy people are everywhere.", "That might be true for some jobs, but not for people who are paid by results.", "My boss said me to come to the office."], correct: 2, why: "That might be true for…, but not for… = tuỳ trường hợp, có mức độ." },
          { q: "Câu nào thuật lời sếp ĐÚNG?", options: ["My manager said me that I can work from home.", "My manager told me that I could work from home on Fridays.", "My manager told that I could work from home.", "My manager asked me that I could work from home."], correct: 1, why: "told + me + that + could (lùi thì)." },
        ],
      },
      { t: "p", text: "Ghi âm hai câu dưới đây, mỗi câu 35–45 giây. Nghe lại và đếm: mấy động từ ngôi thứ ba có **-s** rõ ràng?" },
      {
        t: "speak", id: "t3d19-bt-noi", part: "3",
        questions: [
          "Some people say that working from home makes employees less productive. Do you agree?",
          "Why do some older people think that life was better in the past?",
        ],
      },
    ],
  },
];
