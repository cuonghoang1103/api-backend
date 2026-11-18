/**
 * IELTS Tập 4 — Ngày 11 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, câu trả lời mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Mệnh đề danh ngữ & verb pattern trong câu phức dài không lỗi: the fact / claim that… · giới từ + wh- /
 *                     whether · suggest that S (should) V · bản đồ 7 khuôn động từ · to (giới từ) + V-ing · dạng bị động /
 *                     hoàn thành của to V và V-ing · quy trình soát 4 “khớp nối” của câu dài              [ôn G15 G30]
 *                     — nối Tập 2 Ngày 11 (40 động từ), Tập 3 Ngày 7 (verb patterns nâng cao), Tập 3 Ngày 23 (mệnh đề danh ngữ),
 *                       Tập 4 Ngày 7 (What… is… / It is X that…)
 *   Bài 2 (reading)   Note completion 2 — Passage 3: ghi chú xếp lại dưới đề mục, paraphrase danh hoá; bài “A Measure for
 *                     All People” (hệ mét) ~870 từ, 14 câu (27–40: 10 Note + 4 Yes / No / Not Given)             [R08]
 *                     — nối Tập 2 Ngày 4 (Note completion lần đầu), Tập 3 Ngày 23 · Tập 4 Ngày 5 (Y / N / NG)
 *   Bài 3 (speaking)  Part 3 “To what extent…?” — thang 5 bậc mức độ + khung 4 bước có chống đỡ; band 6 vs band 7   [S06]
 *                     — nối Tập 2 Ngày 17 (thang đồng ý), Tập 3 Ngày 10 (đồng ý một phần) · 🔊 trọng âm tương phản
 *   Bài tập Ngày 11   50 câu có đáp án + 1 lượt nói
 * Mọi id bắt đầu `t4d11-`.
 */
import type { Lesson } from '../data';

export const NGAY_11: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t4d11-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Mệnh đề danh ngữ & verb pattern — viết câu phức dài mà không lỗi",
    goal: "Viết và nói được câu phức 25–35 từ không lỗi ở hai “khớp nối” hay gãy nhất của band 6.5: mệnh đề danh ngữ (the fact that…, depends on whether…, suggest that S should V) và khuôn động từ (enable sb to V, prevent sb from V-ing, be committed to V-ing, to have been V3) — và biết tự soát bốn khớp nối của một câu dài trong 20 giây.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Band 7 GRA đòi ==“phần lớn câu không lỗi”== trong khi vẫn dùng nhiều câu phức. Người band 6.5 không thiếu cấu trúc — họ gãy ở **khớp nối**: chỗ một mệnh đề cắm vào mệnh đề khác, và chỗ một động từ kéo theo động từ thứ hai.",
          "**Khớp 1 — mệnh đề danh ngữ** (noun clause = cả một mệnh đề đứng ở vị trí của danh từ): **the fact that** + S + V · giới từ + **whether / how / what** + S + V · **suggest / recommend that** + S + (should) + V nguyên mẫu.",
          "**Khớp 2 — verb pattern** (khuôn động từ = động từ thứ nhất quyết định dạng của động từ thứ hai): 7 khuôn, trong đó ba khuôn người Việt sai nhiều nhất: ~~suggest sb to V~~, ~~prevent sb to V~~, ~~look forward to V~~.",
          "**Dạng nâng cao**: to **be** V3 · **being** V3 · to **have** V3 · **having** V3 — để nói “bị / được” và “đã xảy ra trước” ngay trong khuôn.",
          "**Quy trình soát 4 khớp** cho mọi câu dài: động từ chính → mỗi mệnh đề đủ S + V → dạng động từ sau mỗi động từ / giới từ → hoà hợp chủ – vị.",
          "Ôn từ: Tập 2 Ngày 11 (40 động từ + to V / V-ing), Tập 3 Ngày 7 (remember / stop / try đổi nghĩa), Tập 3 Ngày 23 (that / wh- / whether-clause; It is + adj + that). Hôm nay ==không học lại từ đầu== — chỉ vá chỗ còn sai ở band 6.5 và nâng lên câu dài.",
        ],
      },

      { t: "h", text: "1. Vì sao câu dài hay gãy — và kiểm tra đầu bài" },
      {
        t: "p",
        text: "Hãy nhìn một câu thật của người viết band 6.5: ~~Many experts suggest the government to invest more in public transport, because it helps reducing the traffic and prevents people to use private cars.~~ Câu này có ý tốt, từ vựng ổn, nhưng ==ba lỗi ở ba khớp nối==: suggest **that** the government (should) invest · helps **(to) reduce** · prevents people **from using**. Giám khảo đếm câu có lỗi, không đếm lỗi nặng hay nhẹ — một câu dài ba lỗi vẫn là “một câu có lỗi”, nhưng mười câu như vậy thì GRA dừng ở 6.",
      },
      {
        t: "table",
        head: ["Khớp nối", "Câu hỏi tự soát", "Ví dụ gãy → sửa"],
        rows: [
          ["Danh từ + that-clause", "Sau the fact / the idea / the claim có đủ S + V chưa?", "~~despite that prices rose~~ → despite **the fact that** prices rose"],
          ["Giới từ + mệnh đề", "Sau giới từ là wh- / whether (không phải that / if) chưa?", "~~depends on if they agree~~ → depends on **whether** they agree"],
          ["Động từ + động từ", "Động từ thứ nhất đòi to V, V-ing hay O + to V?", "~~avoid to use~~ → avoid **using**"],
          ["to + V-ing", "to này là giới từ hay là to của nguyên mẫu?", "~~contribute to reduce~~ → contribute to **reducing**"],
        ],
        caption: "Bốn khớp nối gây ra phần lớn lỗi câu phức ở band 6–6.5",
      },
      {
        t: "quiz",
        id: "t4d11-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 2 Ngày 11 · Tập 3 Ngày 7 · 23 (8 câu, đúng ≥ 6 thì học tiếp; chưa thì mở lại Tập 3 Ngày 7 mục 2–4)",
        items: [
          { q: "Most young people can't afford (buy) ____ a flat in the city centre.", answers: ["to buy"], hint: "afford + to V" },
          { q: "The council is considering (ban) ____ cars from the old town.", answers: ["banning"], hint: "consider + V-ing" },
          { q: "I remember (visit) ____ that museum when I was about ten. (nhớ lại việc đã làm)", answers: ["visiting"], hint: "remember + V-ing = nhớ đã làm" },
          { q: "It is still unclear ____ the new policy will work. (MỘT từ: liệu… hay không)", answers: ["whether", "if"], hint: "whether / if + S + V" },
          { q: "What worries parents most ____ (be) the amount of time children spend online.", answers: ["is"], hint: "Mệnh đề What… làm chủ ngữ ⇒ động từ số ít" },
          { q: "Researchers do not fully understand why ____ . (some people / need / less sleep) — viết 5 từ theo trật tự đúng", answers: ["some people need less sleep"], hint: "Wh-clause: trật tự câu kể, không đảo" },
          { q: "She stopped (work) ____ at sixty and moved to the coast. (thôi hẳn)", answers: ["working"], hint: "stop + V-ing = thôi làm" },
          { q: "It is essential (for governments / act) ____ now. — viết 4 từ", answers: ["for governments to act"], hint: "It is + adj + for sb + to V" },
        ],
      },
      { t: "rule", formula: "Câu dài không lỗi = mỗi khớp nối đúng khuôn", vi: "Band 7 không cần cấu trúc lạ hơn band 6.5 — cần cùng những cấu trúc đó nhưng không gãy ở chỗ nối." },

      { t: "h", text: "2. Danh từ + that-clause: the fact that… · the claim that… · the idea that…" },
      {
        t: "p",
        text: "Tập 3 Ngày 23 đã dạy that-clause sau động từ (believe that…) và tính từ (aware that…). Văn học thuật band 7 dùng thêm một chỗ thứ ba rất nhiều: ==sau danh từ trừu tượng==. Mệnh đề that lúc này **nói rõ nội dung** của danh từ đó — ngữ pháp gọi là mệnh đề đồng vị (appositive clause). Nó cho phép bạn gói cả một câu vào vị trí chủ ngữ hoặc đặt sau giới từ.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "The fact that + S + V + V (số ít) + …",
            vi: "Việc… (cả mệnh đề làm chủ ngữ). Động từ chính chia số ít.",
            examples: [
              { en: "The fact that wages have barely risen explains why so many graduates still live with their parents.", vi: "Việc lương hầu như không tăng giải thích vì sao rất nhiều cử nhân vẫn sống với bố mẹ." },
              { en: "The fact that a product is popular does not mean that it is safe.", vi: "Việc một sản phẩm được ưa chuộng không có nghĩa là nó an toàn." },
            ],
          },
          {
            formula: "giới từ (despite / due to / because of / owing to) + the fact that + S + V",
            vi: "Giới từ không đứng thẳng trước that — phải có the fact làm cầu.",
            examples: [
              { en: "Despite the fact that the evidence is limited, the theory has been widely accepted.", vi: "Mặc dù bằng chứng còn hạn chế, lý thuyết này đã được chấp nhận rộng rãi." },
              { en: "The delay was largely due to the fact that funding had been cut.", vi: "Sự chậm trễ phần lớn là do kinh phí đã bị cắt." },
            ],
          },
          {
            formula: "the claim / idea / belief / assumption / view / argument / evidence / possibility + that + S + V",
            vi: "Nêu NỘI DUNG của lời khẳng định / ý tưởng / niềm tin / giả định / bằng chứng…",
            examples: [
              { en: "There is little evidence that longer school days improve results.", vi: "Có rất ít bằng chứng cho thấy ngày học dài hơn cải thiện kết quả." },
              { en: "The assumption that economic growth always reduces poverty has been challenged.", vi: "Giả định rằng tăng trưởng kinh tế luôn giảm nghèo đã bị chất vấn." },
              { en: "I don't accept the argument that technology makes people lonelier.", vi: "Tôi không chấp nhận lập luận rằng công nghệ khiến con người cô đơn hơn." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["", "Mệnh đề đồng vị (nội dung của danh từ)", "Mệnh đề quan hệ (bổ nghĩa cho danh từ)"],
        rows: [
          ["Ví dụ", "the claim **that** sugar causes hyperactivity", "the claim **that / which** the company made"],
          ["Sau that", "một câu ĐỦ thành phần: sugar causes hyperactivity", "một câu THIẾU một thành phần: the company made ___"],
          ["Thay which?", "Không được: ~~the claim which sugar causes…~~", "Được: the claim which the company made"],
          ["Bỏ that?", "Không nên bỏ trong văn viết", "Bỏ được khi that là tân ngữ: the claim the company made"],
        ],
        caption: "Phép thử: che that đi — phần còn lại là câu đủ ⇒ đồng vị, chỉ dùng that",
      },
      {
        t: "note",
        title: "⚠️ Bốn chỗ người Việt hay sai",
        items: [
          "~~Despite that the city is crowded, …~~ → **Despite the fact that** the city is crowded, … hoặc gọn hơn: **Although** the city is crowded, … / **Despite** the crowds, …",
          "~~The fact that prices are rising worry many families.~~ → … **worries** many families. Chủ ngữ là cả mệnh đề ⇒ số ít, dù danh từ đứng sát động từ (prices) là số nhiều.",
          "~~The fact that many people unemployed is a problem.~~ → The fact that many people **are** unemployed is a problem. Trong mệnh đề that phải có động từ riêng — câu này có HAI động từ: are và is.",
          "Đừng lạm dụng: ==the fact that== nặng nề nếu dùng quá 1–2 lần mỗi bài. Khi thay được bằng danh từ thì thay: ~~the fact that crime has increased~~ → **the increase in crime** (danh hoá — học kỹ ở Ngày 21).",
        ],
      },
      { t: "rule", formula: "the fact / claim / idea / evidence + that + S + V (câu đủ)", vi: "Gói cả một câu vào vị trí danh từ; làm chủ ngữ thì động từ chính số ít; sau giới từ phải có the fact." },
      {
        t: "quiz",
        id: "t4d11-fact-that-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — danh từ + that-clause (5 câu)",
        grammar: "the fact / belief / evidence / idea + that + S + V",
        items: [
          { q: "Việc nhiều người trẻ rời nông thôn tạo ra vấn đề nghiêm trọng cho nông nghiệp.", answers: ["The fact that many young people leave the countryside creates serious problems for agriculture.", "The fact that many young people are leaving the countryside creates serious problems for agriculture.", "The fact that many young people leave rural areas creates serious problems for agriculture.", "The fact that many young people are leaving rural areas creates serious problems for agriculture."], hint: "The fact that… creates (số ít)" },
          { q: "Có ngày càng nhiều bằng chứng cho thấy ô nhiễm không khí ảnh hưởng đến trí nhớ.", answers: ["There is growing evidence that air pollution affects memory.", "There is increasing evidence that air pollution affects memory.", "There is more and more evidence that air pollution affects memory."], hint: "There is growing evidence that…" },
          { q: "Mặc dù vé rất đắt, buổi hoà nhạc đã bán hết trong một giờ.", answers: ["Despite the fact that the tickets were very expensive, the concert sold out in an hour.", "Despite the fact that tickets were very expensive, the concert sold out within an hour.", "Despite the fact that the tickets were very expensive, the concert sold out within an hour.", "Despite the fact that tickets were very expensive, the concert sold out in an hour.", "In spite of the fact that the tickets were very expensive, the concert sold out in an hour."], hint: "Despite the fact that…" },
          { q: "Tôi không đồng ý với quan điểm rằng tiền là động lực duy nhất.", answers: ["I disagree with the view that money is the only motivation.", "I do not agree with the view that money is the only motivation.", "I don't agree with the view that money is the only motivation.", "I disagree with the idea that money is the only motivation.", "I don't agree with the idea that money is the only motivation.", "I disagree with the view that money is the only motivator."], hint: "the view that…" },
          { q: "Niềm tin rằng trẻ em học ngôn ngữ dễ hơn người lớn rất phổ biến.", answers: ["The belief that children learn languages more easily than adults is very common.", "The belief that children learn languages more easily than adults is widespread.", "The belief that children learn languages more easily than adults is very widespread."], hint: "The belief that… is (số ít)" },
        ],
      },

      { t: "h", text: "3. Giới từ + wh- / whether-clause — và bốn chỗ không được dùng if" },
      {
        t: "p",
        text: "Sau **giới từ** (on, about, of, in, to, over…) không dùng that-clause, nhưng dùng được mệnh đề bắt đầu bằng **wh-** (what, how, why, where, who, how much…) hoặc **whether**. Đây là khuôn rất “band 7” vì nó thay cho những danh từ chung chung: ~~It depends on the situation~~ → It depends on **how much support the family can offer**.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "V / adj / N + giới từ + wh- / whether + S + V",
            vi: "Mệnh đề làm tân ngữ của giới từ — trật tự câu kể, không đảo trợ động từ.",
            examples: [
              { en: "Success depends largely on whether teachers are given enough time to prepare.", vi: "Thành công phụ thuộc phần lớn vào việc giáo viên có được cho đủ thời gian chuẩn bị hay không." },
              { en: "There is disagreement over how the money should be spent.", vi: "Có bất đồng về việc số tiền này nên được chi ra sao." },
              { en: "Employers are increasingly interested in what candidates can do rather than where they studied.", vi: "Nhà tuyển dụng ngày càng quan tâm ứng viên làm được gì hơn là họ học ở đâu." },
            ],
          },
          {
            formula: "Whether + S + V (+ or not) + V (số ít) + …",
            vi: "Việc… hay không (làm chủ ngữ). Chỉ dùng whether, không dùng if.",
            examples: [
              { en: "Whether remote work increases productivity remains an open question.", vi: "Việc làm từ xa có tăng năng suất hay không vẫn là câu hỏi bỏ ngỏ." },
              { en: "Whether or not the scheme succeeds will depend on public support.", vi: "Chương trình có thành công hay không sẽ tuỳ vào sự ủng hộ của công chúng." },
            ],
          },
          {
            formula: "the question / issue / problem + of + wh- / whether + S + V",
            vi: "Vấn đề / câu hỏi về việc…",
            examples: [
              { en: "This raises the question of who should pay for elderly care.", vi: "Điều này đặt ra câu hỏi ai nên chi trả cho việc chăm sóc người già." },
            ],
          },
          {
            formula: "wh- / whether + to V",
            vi: "Rút gọn khi cùng chủ ngữ: nên… hay không / nên… thế nào.",
            examples: [
              { en: "Many graduates are unsure whether to continue studying or to look for work.", vi: "Nhiều cử nhân phân vân nên học tiếp hay đi tìm việc." },
              { en: "Schools should teach children how to evaluate online information.", vi: "Trường học nên dạy trẻ cách đánh giá thông tin trên mạng." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Vị trí", "whether", "if", "Ví dụ đúng"],
        rows: [
          ["Sau động từ (ask, wonder, know…)", "✓", "✓", "I wonder whether / if it matters."],
          ["Sau giới từ", "✓", "✗", "It depends **on whether** they agree."],
          ["Làm chủ ngữ đầu câu", "✓", "✗", "**Whether** it works is unclear."],
          ["Trước to V", "✓", "✗", "unsure **whether to** apply"],
          ["Liền ngay or not", "✓", "✗", "**whether or not** they agree"],
          ["Sau danh từ (the question…)", "✓", "✗", "the question (of) **whether** it is fair"],
        ],
        caption: "Văn viết học thuật: cứ dùng whether là an toàn",
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay gặp ở band 6.5",
        items: [
          "Đảo trợ động từ như câu hỏi: ~~It depends on how much do they earn.~~ → It depends on **how much they earn**.",
          "Thừa giới từ hoặc thiếu giới từ: ~~discuss about whether…~~ → **discuss whether**… (discuss không có about) · I am not sure about whether… → chấp nhận được, nhưng gọn hơn: I am not sure **whether**… Còn **depend on, focus on, be interested in, be concerned about, think about, argue about / over** thì giữ giới từ.",
          "Dùng that sau giới từ: ~~I am worried about that children…~~ → I am worried **that** children… (bỏ giới từ trước that) hoặc worried **about the fact that**…",
          "Lẫn what và that: ~~I don't know that he wants.~~ → I don't know **what** he wants. (wants thiếu tân ngữ ⇒ what.) Ngược lại: ~~What he is late is a problem.~~ → **That / The fact that** he is late is a problem.",
        ],
      },
      { t: "rule", formula: "giới từ + wh- / whether + S + V   ·   Whether + S + V + V (số ít)", vi: "Sau giới từ và ở đầu câu: whether, không if; trật tự câu kể; không that sau giới từ." },
      {
        t: "quiz",
        id: "t4d11-whether-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — giới từ + wh- / whether (5 câu)",
        grammar: "giới từ + whether / how / what + S + V · Whether… + V số ít",
        items: [
          { q: "Điều đó phụ thuộc vào việc chính phủ sẵn sàng chi bao nhiêu.", answers: ["It depends on how much the government is willing to spend.", "That depends on how much the government is willing to spend.", "It depends on how much the government is prepared to spend."], hint: "depends on how much + S + V" },
          { q: "Việc trẻ em có nên dùng điện thoại ở trường hay không vẫn gây tranh cãi.", answers: ["Whether children should use phones at school is still controversial.", "Whether children should use phones at school remains controversial.", "Whether or not children should use phones at school is still controversial.", "Whether children should use mobile phones at school is still controversial.", "Whether children should use phones in school is still controversial."], hint: "Whether + S + V + is / remains…" },
          { q: "Có rất ít sự đồng thuận về việc vấn đề này nên được giải quyết như thế nào.", answers: ["There is little agreement on how this problem should be solved.", "There is little agreement about how this problem should be solved.", "There is little consensus on how this problem should be solved.", "There is little agreement on how this problem should be tackled.", "There is little consensus on how this issue should be addressed.", "There is little agreement on how this issue should be solved."], hint: "little agreement on how + S + should be V3" },
          { q: "Điều này đặt ra câu hỏi liệu giáo dục đại học có nên miễn phí hay không.", answers: ["This raises the question of whether higher education should be free.", "This raises the question whether higher education should be free.", "This raises the question of whether university education should be free.", "This raises the question of whether or not higher education should be free."], hint: "raises the question of whether…" },
          { q: "Tôi quan tâm đến việc mọi người học được gì hơn là họ học nhanh ra sao.", answers: ["I am more interested in what people learn than in how fast they learn.", "I am more interested in what people learn than how fast they learn.", "I'm more interested in what people learn than in how quickly they learn.", "I am more interested in what people learn than in how quickly they learn.", "I'm more interested in what people learn than how fast they learn.", "I am interested in what people learn rather than how fast they learn."], hint: "interested in what… than (in) how fast…" },
        ],
      },

      { t: "h", text: "4. suggest / recommend / insist / demand + that + S + (should) + V nguyên mẫu" },
      {
        t: "p",
        text: "Nhóm động từ ==đề nghị – yêu cầu== có một khuôn riêng, và đây là lỗi số 1 của người Việt ở Task 2 (dạng Problem – Solution, câu kết bài). Sau that, động từ ở dạng **nguyên mẫu không to** cho mọi ngôi (kể cả he / she / it), hoặc thêm **should**. Tính từ chỉ sự cần thiết (essential, vital, crucial, important, necessary) trong khung **It is… that** cũng theo khuôn này. Phần đầy đủ (subjunctive) học ở Ngày 27 — hôm nay chỉ cần dùng đúng hai dạng dưới.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + suggest / recommend / propose / insist / demand / request + that + S + (should) + V",
            vi: "Đề nghị / khuyến nghị / đòi ai làm gì. V nguyên mẫu, không chia.",
            examples: [
              { en: "The report recommends that every school (should) employ a full-time counsellor.", vi: "Báo cáo khuyến nghị mỗi trường nên thuê một chuyên viên tư vấn toàn thời gian." },
              { en: "Residents demanded that the factory be closed.", vi: "Người dân đòi đóng cửa nhà máy. (bị động: be + V3)" },
              { en: "I would suggest that the government invest in rail rather than roads.", vi: "Tôi cho rằng chính phủ nên đầu tư vào đường sắt thay vì đường bộ." },
            ],
          },
          {
            formula: "It is essential / vital / crucial / important + that + S + (should) + V",
            vi: "Điều thiết yếu là ai đó làm gì.",
            examples: [
              { en: "It is essential that this problem be addressed before it gets worse.", vi: "Điều thiết yếu là vấn đề này được giải quyết trước khi tồi tệ hơn." },
            ],
          },
          {
            formula: "S + suggest / recommend + V-ing",
            vi: "Đề nghị làm gì (không nói rõ ai làm, hoặc chính mình cùng làm).",
            examples: [
              { en: "Experts recommend limiting screen time for children under five.", vi: "Chuyên gia khuyến nghị hạn chế thời gian nhìn màn hình cho trẻ dưới năm tuổi." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Động từ", "✗ Sai (dịch từ tiếng Việt)", "✓ Đúng"],
        rows: [
          ["suggest", "~~I suggest the government to build…~~", "I suggest **that** the government (should) **build**… / I suggest **building**…"],
          ["recommend", "They recommend people to walk more. (Anh-Anh có dùng, nhưng dễ bị xem là lỗi — trong bài thi nên tránh)", "They recommend **that** people (should) **walk** more. / They recommend **walking** more."],
          ["insist", "~~She insisted him to stay.~~", "She insisted **that** he (should) **stay**. / She insisted **on** his **staying**."],
          ["advise · encourage · urge · require · ask", "—", "Nhóm này MỚI đi với O + to V: advise people **to walk** more."],
        ],
        caption: "suggest ≠ advise: nghĩa gần nhau nhưng khuôn khác nhau",
      },
      {
        t: "note",
        title: "💡 Mẹo nhớ + phân biệt hai nghĩa của suggest",
        items: [
          "==suggest / recommend / propose / insist / demand== = nhóm “**SRPID**” — sau chúng không bao giờ là O + to V.",
          "**suggest** còn nghĩa thứ hai là “cho thấy” (= indicate). Nghĩa này dùng thì bình thường, KHÔNG nguyên mẫu: The data **suggest that** the policy **is** working. (không phải ~~be working~~). Phép thử: thay bằng indicate được ⇒ chia thì như thường.",
          "Khi nói (Part 3), dùng **should** cho tự nhiên: I'd suggest that schools **should** teach… Khi viết, cả hai đều đúng; bỏ should nghe trang trọng hơn.",
        ],
      },
      { t: "rule", formula: "suggest / recommend / insist / demand + that + S + (should) + V", vi: "Động từ đề nghị – yêu cầu: sau that là nguyên mẫu cho mọi ngôi; không bao giờ suggest sb to V." },
      {
        t: "quiz",
        id: "t4d11-suggest",
        kind: "fill",
        title: "Viết dạng đúng của phần trong ngoặc (6 câu)",
        items: [
          { q: "The committee recommended that the proposal (reject) ____ .", answers: ["be rejected", "should be rejected"], hint: "bị động của nguyên mẫu: be + V3" },
          { q: "I would suggest that every employer (offer) ____ flexible hours.", answers: ["offer", "should offer"], hint: "nguyên mẫu, không -s" },
          { q: "The survey suggests that most commuters (prefer) ____ trains to buses. (suggest = cho thấy)", answers: ["prefer"], hint: "suggest = indicate ⇒ chia thì thường" },
          { q: "Doctors advise patients (take) ____ at least thirty minutes of exercise a day.", answers: ["to take"], hint: "advise + O + to V" },
          { q: "It is vital that each student (have) ____ access to a computer.", answers: ["have", "should have"], hint: "It is vital that + S + V nguyên mẫu" },
          { q: "Several scientists have proposed (tax) ____ sugary drinks more heavily.", answers: ["taxing"], hint: "propose + V-ing (không nói ai làm)" },
        ],
      },

      { t: "h", text: "5. Bản đồ 7 khuôn động từ — bản band 7" },
      {
        t: "p",
        text: "Tập 2 Ngày 11 và Tập 3 Ngày 7 đã dạy hai khuôn nền (V + to V · V + V-ing) và nhóm đổi nghĩa. Ở band 7, bài viết của bạn cần những động từ học thuật hơn — và chúng rải trên ==bảy khuôn==. Học theo khuôn, đừng học từng từ lẻ.",
      },
      {
        t: "table",
        head: ["Khuôn", "Động từ học thuật hay dùng", "Ví dụ"],
        rows: [
          ["① V + to V", "tend · seek · aim · attempt · fail · manage · struggle · refuse · claim · appear · seem · prove · afford · intend · hesitate", "Small firms **struggle to compete** with online retailers."],
          ["② V + V-ing", "avoid · consider · involve · risk · delay · postpone · deny · admit · justify · resist · tolerate · entail · mean (= đồng nghĩa với) · keep · practise", "Moving abroad **involves leaving** family behind."],
          ["③ V + O + to V", "enable · allow · permit · encourage · require · force · oblige · persuade · urge · cause · lead · prompt · motivate · expect · inspire · train", "Scholarships **enable poorer students to attend** university."],
          ["④ V + O + V (nguyên mẫu không to)", "make · let · have · help (cũng: help + O + to V)", "Deadlines **make people work** faster. · Bị động: People **are made to work** faster."],
          ["⑤ V + O + from + V-ing", "prevent · stop · discourage · deter · prohibit · ban · bar · protect · save", "High fees **deter many applicants from applying**."],
          ["⑥ V / adj + giới từ + V-ing", "succeed in · insist on · rely on · focus on · result in · contribute to · object to · benefit from · be capable of · be responsible for · be committed to · be accused of", "The scheme **succeeded in reducing** waste by a third."],
          ["⑦ Hai khuôn — hai nghĩa", "remember · forget · regret · stop · try · mean · go on · need", "The policy **means raising** taxes (= kéo theo). · The council **means to raise** taxes (= định)."],
        ],
        caption: "Bảy khuôn — mỗi khuôn chép 3 động từ + 1 câu của riêng bạn vào sổ",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ba động từ nghĩa gần nhau — ba khuôn khác nhau",
        cols: [
          { title: "Cho phép / giúp", items: ["**allow / enable** + O + **to V**", "**let** + O + **V**", "**help** + O + **(to) V**", "Bị động: be allowed **to V**"] },
          { title: "Bắt buộc / khiến", items: ["**force / require / cause** + O + **to V**", "**make** + O + **V**", "Bị động: be made **to V** · be required **to V**", "**lead** + O + **to V** (khiến ai đi đến chỗ…)"] },
          { title: "Ngăn / cản", items: ["**prevent / stop / deter** + O + **from V-ing**", "**discourage** + O + **from V-ing**", "**ban / prohibit** + O + **from V-ing**", "Bị động: be banned **from V-ing**"] },
        ],
        caption: "Sai kinh điển: ~~make people to work~~ · ~~prevent people to drive~~ · ~~let children to play~~",
      },
      {
        t: "note",
        title: "⚠️ Tám lỗi “gần đúng” ở band 6.5",
        items: [
          "~~This helps reducing traffic.~~ → helps **(to) reduce** traffic. help không bao giờ + V-ing (trừ can't help + V-ing = không nhịn được).",
          "~~This leads people spend more.~~ → leads people **to spend** more. Còn không có tân ngữ chỉ người: leads **to higher spending / to people spending** more (to là giới từ — mục 6).",
          "~~Parents should let children to choose.~~ → let children **choose**. Nhưng: children should **be allowed to choose** (let hiếm khi dùng bị động).",
          "~~The law prohibits companies to advertise…~~ → prohibits companies **from advertising**…",
          "~~They succeeded to reduce…~~ → succeeded **in reducing**… · ~~capable to do~~ → capable **of doing** · nhưng: **able to do**, **manage to do**.",
          "~~It causes that people lose jobs.~~ → It **causes people to lose** their jobs. / It **means that** people lose their jobs. cause không đi với that-clause.",
          "~~I want that the government builds…~~ → I **want the government to build**… want / would like / expect / need: O + to V, không that-clause.",
          "~~Governments should consider to raise…~~ → consider **raising**… · ~~avoid to use~~ → avoid **using** · ~~risk to lose~~ → risk **losing** · ~~involve to change~~ → involve **changing**.",
        ],
      },
      { t: "rule", formula: "enable + O + to V   ·   make + O + V   ·   prevent + O + from V-ing   ·   succeed in V-ing", vi: "Động từ thứ nhất quyết định dạng động từ thứ hai — học theo khuôn, không dịch từ tiếng Việt." },
      {
        t: "quiz",
        id: "t4d11-khuon-dien",
        kind: "fill",
        title: "Viết dạng đúng của động từ trong ngoặc — thêm giới từ nếu cần (10 câu)",
        items: [
          { q: "Online courses enable people in remote areas (gain) ____ qualifications.", answers: ["to gain"], hint: "enable + O + to V" },
          { q: "Strict rules discourage visitors (touch) ____ the exhibits.", answers: ["from touching"], hint: "discourage + O + from V-ing" },
          { q: "Uniforms are said to make pupils (feel) ____ part of a community.", answers: ["feel"], hint: "make + O + V" },
          { q: "In some countries, children are made (learn) ____ poems by heart.", answers: ["to learn"], hint: "bị động của make: be made to V" },
          { q: "Working from home involves (set) ____ clear boundaries between work and family.", answers: ["setting"], hint: "involve + V-ing" },
          { q: "The campaign succeeded (persuade) ____ thousands of people to give up smoking.", answers: ["in persuading"], hint: "succeed in + V-ing" },
          { q: "Many small shops struggle (survive) ____ when a supermarket opens nearby.", answers: ["to survive"], hint: "struggle + to V" },
          { q: "Higher prices prompted consumers (look) ____ for cheaper alternatives.", answers: ["to look"], hint: "prompt + O + to V" },
          { q: "Governments cannot justify (spend) ____ billions on space programmes while hospitals are short of staff.", answers: ["spending"], hint: "justify + V-ing" },
          { q: "Lowering the speed limit would mean (redesign) ____ hundreds of road signs. (= kéo theo)", answers: ["redesigning"], hint: "mean + V-ing = đồng nghĩa với việc" },
        ],
      },
      {
        t: "quiz",
        id: "t4d11-khuon-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng động từ cho trong gợi ý (5 câu)",
        grammar: "enable / prevent / make / encourage / risk — mỗi động từ một khuôn",
        items: [
          { q: "Công nghệ cho phép các bác sĩ chẩn đoán bệnh sớm hơn.", answers: ["Technology enables doctors to diagnose diseases earlier.", "Technology enables doctors to diagnose illnesses earlier.", "Technology enables doctors to diagnose disease earlier."], hint: "enable + O + to V" },
          { q: "Chi phí cao ngăn nhiều gia đình gửi con vào đại học.", answers: ["High costs prevent many families from sending their children to university.", "The high cost prevents many families from sending their children to university.", "High costs stop many families from sending their children to university."], hint: "prevent + O + from V-ing" },
          { q: "Quảng cáo khiến mọi người mua những thứ họ không cần.", answers: ["Advertising makes people buy things they do not need.", "Advertising makes people buy things they don't need.", "Advertisements make people buy things they do not need.", "Advertisements make people buy things they don't need.", "Advertising makes people buy things that they do not need."], hint: "make + O + V" },
          { q: "Các trường nên khuyến khích học sinh tự đặt câu hỏi.", answers: ["Schools should encourage students to ask their own questions.", "Schools should encourage pupils to ask their own questions.", "Schools should encourage students to ask questions themselves.", "Schools should encourage students to ask questions of their own."], hint: "encourage + O + to V" },
          { q: "Những công ty phớt lờ khách hàng có nguy cơ mất họ.", answers: ["Companies that ignore their customers risk losing them.", "Companies which ignore their customers risk losing them.", "Companies that ignore customers risk losing them.", "Firms that ignore their customers risk losing them."], hint: "risk + V-ing" },
        ],
      },

      { t: "h", text: "6. to là giới từ ⇒ to + V-ing — 14 cụm phải thuộc" },
      {
        t: "p",
        text: "Chữ **to** có hai thân phận: (1) dấu hiệu của nguyên mẫu (want **to go**) và (2) **giới từ** (go **to** school). Khi to là giới từ, sau nó là danh từ hoặc ==V-ing==. Phép thử 3 giây: thay động từ bằng một danh từ / đại từ **it** — nếu câu vẫn đúng thì to là giới từ. I look forward to **it** ✓ ⇒ look forward to **meeting** you. I want to **it** ✗ ⇒ want **to meet**.",
      },
      {
        t: "table",
        head: ["Cụm", "Nghĩa", "Ví dụ"],
        rows: [
          ["look forward to", "mong chờ", "I look forward to **hearing** from you."],
          ["be / get used to · be accustomed to", "quen với", "City children are used to **living** with noise."],
          ["object to · be opposed to", "phản đối", "Many residents object to **paying** higher parking fees."],
          ["contribute to · lead to", "góp phần vào · dẫn đến", "Cheap flights have contributed to **increasing** carbon emissions."],
          ["be committed / dedicated / devoted to", "cam kết · tận tâm", "The firm is committed to **reducing** its plastic use."],
          ["in addition to", "ngoài việc", "In addition to **creating** jobs, tourism funds conservation."],
          ["with a view to", "nhằm mục đích", "The road was closed with a view to **improving** air quality."],
          ["when it comes to", "khi nói đến chuyện", "When it comes to **saving** money, young people struggle."],
          ["be close to · come close to", "suýt / gần", "The species came close to **disappearing** altogether."],
          ["the key to · an approach to · an alternative to · a barrier to", "chìa khoá · cách tiếp cận · lựa chọn thay cho · rào cản đối với", "The key to **learning** a language is regular practice."],
          ["adapt to · adjust to", "thích nghi với", "Older workers may find it hard to adjust to **working** online."],
          ["admit to · confess to", "thừa nhận", "One in five students admitted to **copying** homework."],
          ["be limited / restricted to", "chỉ giới hạn ở", "Their role is limited to **giving** advice."],
          ["prefer A to B", "thích A hơn B", "Most people prefer **shopping** online to **queuing** in stores."],
        ],
        caption: "14 cụm to + V-ing — sai một cụm là mất một câu sạch",
      },
      {
        t: "note",
        title: "⚠️ Cặp dễ nhầm nhất: used to V · be used to V-ing · be used to V",
        items: [
          "**used to + V** = ngày xưa thường (nay không còn): People **used to write** letters.",
          "**be / get used to + V-ing** = quen với: People **are used to getting** instant replies.",
          "**be used to + V** = được dùng để (bị động của use): Satellites **are used to track** storms. Ở đây to là to của nguyên mẫu chỉ mục đích.",
          "Và **lead to**: ~~lead to increase prices~~ → lead to **increasing** prices / lead to **an increase in** prices (danh từ hay hơn). Còn **lead + người + to V**: This led researchers **to conclude** that…",
        ],
      },
      { t: "rule", formula: "look forward to / contribute to / be committed to / object to + V-ing", vi: "Thử thay bằng it: đứng được ⇒ to là giới từ ⇒ V-ing." },
      {
        t: "quiz",
        id: "t4d11-to-ving",
        kind: "fill",
        title: "to V hay to V-ing? Viết dạng đúng (8 câu)",
        items: [
          { q: "Urban planners are committed to (create) ____ more green space.", answers: ["creating"], hint: "be committed to + V-ing" },
          { q: "Most commuters would prefer to (work) ____ closer to home.", answers: ["work"], hint: "would prefer to V" },
          { q: "Poor diet contributes to (shorten) ____ life expectancy.", answers: ["shortening"], hint: "contribute to + V-ing" },
          { q: "Drones are increasingly used to (deliver) ____ medical supplies. (được dùng để)", answers: ["deliver"], hint: "be used to V = được dùng để" },
          { q: "It took me months to get used to (drive) ____ on the left.", answers: ["driving"], hint: "get used to + V-ing" },
          { q: "In addition to (teach) ____ , lecturers are expected to publish research.", answers: ["teaching"], hint: "in addition to + V-ing" },
          { q: "The findings led the team to (question) ____ their original theory.", answers: ["question"], hint: "lead + O + to V" },
          { q: "When it comes to (choose) ____ a career, salary is not the only factor.", answers: ["choosing"], hint: "when it comes to + V-ing" },
        ],
      },

      { t: "h", text: "7. Dạng bị động và hoàn thành của to V / V-ing" },
      {
        t: "p",
        text: "Khuôn nào cũng có thể mang thêm hai lớp nghĩa: ==bị / được== (bị động) và ==đã xảy ra trước đó== (hoàn thành). Bốn dạng dưới đây xuất hiện dày trong Passage 3 và làm bài viết của bạn chính xác hơn hẳn — nhất là sau **appear / seem / claim / be thought / be believed** (nối với hedging ở Ngày 7 và Ngày 13).",
      },
      {
        t: "table",
        head: ["Dạng", "Công thức", "Nghĩa", "Ví dụ"],
        rows: [
          ["Nguyên mẫu bị động", "to be + V3", "được / bị (cùng lúc hoặc sau)", "Every child deserves **to be given** a fair chance."],
          ["V-ing bị động", "being + V3", "việc được / bị", "Nobody enjoys **being criticised** in public. · He objects to **being treated** like a child."],
          ["Nguyên mẫu hoàn thành", "to have + V3", "đã… (trước thời điểm của động từ chính)", "The company claims **to have reduced** its emissions by half."],
          ["Nguyên mẫu hoàn thành bị động", "to have been + V3", "đã được / bị…", "The tools appear **to have been made** around 3000 BC."],
          ["V-ing hoàn thành", "having + V3", "việc đã…", "He denied **having received** the letter. · She regrets not **having studied** abroad."],
        ],
        caption: "Bốn dạng nâng cao — đều theo đúng khuôn của động từ đứng trước",
      },
      {
        t: "examples",
        items: [
          { en: "The ancient city is believed to have been abandoned after a long drought.", vi: "Người ta tin rằng thành cổ đã bị bỏ hoang sau một đợt hạn hán dài. (be believed + to have been V3)" },
          { en: "Teenagers resent being told what to do, yet they also need clear limits.", vi: "Thiếu niên ghét bị bảo phải làm gì, nhưng các em cũng cần giới hạn rõ ràng. (resent + being V3)" },
          { en: "Applicants are expected to have completed at least two years of study.", vi: "Ứng viên phải đã hoàn thành ít nhất hai năm học. (to have V3: xong trước thời điểm nộp)" },
          { en: "The new rules are designed to prevent data from being shared without permission.", vi: "Quy định mới được thiết kế để ngăn dữ liệu bị chia sẻ khi chưa được phép. (from + being V3)" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Hai lỗi tinh",
        items: [
          "Thiếu bị động khi tân ngữ đã lên làm chủ ngữ: ~~Children need to teach how to manage money.~~ → Children need **to be taught** how to manage money. Hỏi: trẻ “dạy” hay “được dạy”?",
          "Dùng thì quá khứ thay cho nguyên mẫu hoàn thành: ~~The Vikings are thought that they reached America.~~ → The Vikings are thought **to have reached** America. / **It is thought that** the Vikings **reached** America.",
        ],
      },
      { t: "rule", formula: "to be V3   ·   being V3   ·   to have V3   ·   to have been V3   ·   having V3", vi: "Giữ nguyên khuôn của động từ trước; thêm be để nói “được / bị”, thêm have để nói “đã xảy ra trước”." },
      {
        t: "quiz",
        id: "t4d11-dang-nang-cao-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dạng bị động / hoàn thành (4 câu)",
        grammar: "to be V3 · being V3 · to have (been) V3",
        items: [
          { q: "Mọi nhân viên đều muốn được đối xử công bằng.", answers: ["Every employee wants to be treated fairly.", "All employees want to be treated fairly.", "Every worker wants to be treated fairly."], hint: "want + to be V3" },
          { q: "Nhiều người nổi tiếng không thích bị chụp ảnh ở nơi công cộng.", answers: ["Many celebrities dislike being photographed in public.", "Many celebrities do not like being photographed in public.", "Many celebrities don't like being photographed in public.", "Many famous people dislike being photographed in public.", "Many famous people do not like being photographed in public."], hint: "dislike + being V3" },
          { q: "Công ty khẳng định đã tạo ra hai nghìn việc làm mới.", answers: ["The company claims to have created two thousand new jobs.", "The company claims to have created 2,000 new jobs.", "The company claims to have created 2000 new jobs.", "The firm claims to have created two thousand new jobs."], hint: "claim + to have V3" },
          { q: "Ngôi đền dường như đã được xây cách đây hơn một nghìn năm.", answers: ["The temple appears to have been built more than a thousand years ago.", "The temple seems to have been built more than a thousand years ago.", "The temple appears to have been built over a thousand years ago.", "The temple seems to have been built over a thousand years ago.", "The temple appears to have been built more than one thousand years ago."], hint: "appear / seem + to have been V3" },
        ],
      },

      { t: "h", text: "8. Dựng và soát một câu dài: quy trình 4 khớp trong 20 giây" },
      {
        t: "p",
        text: "Câu dài không phải là câu khó — nó là ==nhiều câu ngắn lồng vào nhau đúng chỗ==. Hãy xem cách một câu 33 từ được dựng từ ba ý, rồi dùng quy trình bên dưới để soát. Trong phòng thi, bạn chạy quy trình này ở lượt soát GRA (lượt 4 trong bảng tự soát 6 lượt — Tập 3 Ngày 27).",
      },
      {
        t: "table",
        head: ["Bước", "Câu"],
        rows: [
          ["Ba ý rời", "Cities are expanding. This forces people to commute longer. Nobody knows if public transport can cope."],
          ["Gói ý 1 thành chủ ngữ", "**The fact that cities are expanding** forces people to commute longer."],
          ["Thêm khuôn ③ + ý 3 bằng whether", "The fact that cities are expanding forces people **to commute** longer, **and it remains unclear whether** public transport can cope."],
          ["Thêm mục đích + khuôn ⑤", "The fact that cities are expanding so rapidly forces many people to commute for longer, and it remains unclear whether public transport networks can cope **without preventing** new residents **from reaching** their workplaces."],
        ],
        caption: "Từ 3 câu đơn (15 từ) thành 1 câu phức 33 từ — không lỗi vì từng khớp đều đúng khuôn",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Soát 4 khớp của một câu dài",
        steps: [
          { label: "① Tìm động từ chính", sub: "Gạch chân MỘT động từ chia thì của mệnh đề chính. Không có ⇒ câu cụt (fragment)." },
          { label: "② Đếm mệnh đề", sub: "Mỗi that / whether / wh- / because / which phải có S + V riêng. Hai mệnh đề chính chỉ nối bằng dấu phẩy ⇒ run-on." },
          { label: "③ Soát khuôn", sub: "Sau mỗi động từ + động từ, mỗi giới từ: to V, V-ing hay O + to V? to là giới từ?" },
          { label: "④ Hoà hợp", sub: "Chủ ngữ dài (The fact that…, Whether…, V-ing…) ⇒ động từ số ít. Đại từ this / they chỉ đúng danh từ nào?" },
        ],
        caption: "20 giây cho mỗi câu trên 25 từ",
      },
      {
        t: "note",
        title: "⚠️ Ba kiểu gãy của câu dài (ôn Tập 3 Ngày 27)",
        items: [
          "**Câu cụt** — chỉ có mệnh đề phụ: ~~The fact that many people work from home nowadays.~~ → thêm vị ngữ: … **has changed** the way cities are planned.",
          "**Run-on** — hai câu nối bằng dấu phẩy: ~~Fees are rising, this discourages students from applying.~~ → Fees are rising**, which** discourages students from applying. / Fees are rising**; this** discourages…",
          "**Thừa chủ ngữ** — lặp chủ ngữ bằng đại từ: ~~The fact that prices are rising it worries families.~~ → bỏ it. · ~~What the government should do it is to invest…~~ → What the government should do **is** (to) invest…",
        ],
      },
      { t: "rule", formula: "Động từ chính → mỗi mệnh đề đủ S + V → khuôn sau động từ / giới từ → hoà hợp", vi: "Bốn khớp cần soát ở mọi câu trên 25 từ." },
      {
        t: "mcq",
        id: "t4d11-soat-cau-dai",
        title: "Chọn câu KHÔNG có lỗi (8 câu)",
        items: [
          {
            q: "Câu nào đúng?",
            options: [
              "Despite that the scheme was expensive, it succeeded to reduce congestion.",
              "Despite the fact that the scheme was expensive, it succeeded in reducing congestion.",
              "Despite the fact the scheme expensive, it succeeded in reducing congestion.",
              "Despite of the fact that the scheme was expensive, it succeeded in reduce congestion.",
            ],
            correct: 1,
            why: "Despite + the fact that + S + V; succeed in + V-ing. A sai hai chỗ (despite that · succeeded to); C thiếu động từ was; D thừa of và sai in reduce.",
          },
          {
            q: "Câu nào đúng?",
            options: [
              "Whether universities should charge fees depends on how the costs are shared.",
              "If universities should charge fees depends on how are the costs shared.",
              "Whether universities should charge fees depend on how the costs are shared.",
              "Whether should universities charge fees depends on how the costs shared.",
            ],
            correct: 0,
            why: "Mệnh đề Whether làm chủ ngữ ⇒ depends (số ít); sau on là how + S + V không đảo. B dùng If đầu câu và đảo are; C depend sai hoà hợp; D đảo should và thiếu are.",
          },
          {
            q: "Câu nào đúng?",
            options: [
              "Experts suggest parents to limit the time their children spend online.",
              "Experts suggest that parents limiting the time their children spend online.",
              "Experts suggest to limit the time children spend online.",
              "Experts suggest that parents limit the time their children spend online.",
            ],
            correct: 3,
            why: "suggest + that + S + (should) + V. A là lỗi kinh điển suggest sb to V; B dùng V-ing sau chủ ngữ; C suggest to V không tồn tại (suggest limiting mới đúng).",
          },
          {
            q: "Câu nào đúng?",
            options: [
              "High rents prevent young people to save, which makes them to delay starting a family.",
              "High rents prevent young people from saving, which makes them delaying to start a family.",
              "High rents prevent young people from saving, which makes them delay starting a family.",
              "High rents prevent young people from save, which make them delay to start a family.",
            ],
            correct: 2,
            why: "prevent + O + from V-ing; make + O + V; delay + V-ing. Ba khuôn trong một câu — mỗi phương án sai ít nhất một khuôn.",
          },
          {
            q: "Câu nào đúng?",
            options: [
              "The fact that more people are living alone have increased the demand for small flats.",
              "The fact that more people are living alone has increased the demand for small flats.",
              "The fact that more people living alone has increased the demand for small flats.",
              "The fact more people are living alone, it has increased the demand for small flats.",
            ],
            correct: 1,
            why: "Chủ ngữ The fact that… ⇒ has (số ít). A have sai; C mệnh đề that thiếu are; D thừa chủ ngữ it.",
          },
          {
            q: "Câu nào đúng?",
            options: [
              "The government is committed to reduce emissions and looks forward to work with industry.",
              "The government is committed to reducing emissions and looks forward to work with industry.",
              "The government is committed to reduce emissions and looks forward to working with industry.",
              "The government is committed to reducing emissions and looks forward to working with industry.",
            ],
            correct: 3,
            why: "be committed to + V-ing và look forward to + V-ing — cả hai to đều là giới từ.",
          },
          {
            q: "Câu nào đúng?",
            options: [
              "The manuscript is thought to have been written by a monk in the ninth century.",
              "The manuscript is thought to be wrote by a monk in the ninth century.",
              "The manuscript is thought that it was written by a monk in the ninth century.",
              "The manuscript is thought to have written by a monk in the ninth century.",
            ],
            correct: 0,
            why: "Việc viết xảy ra trước và là bị động ⇒ to have been written. B sai dạng V3 và thiếu lớp hoàn thành; C trộn hai khung (It is thought that… / X is thought to…); D thiếu been.",
          },
          {
            q: "Câu nào đúng?",
            options: [
              "Tuition fees are rising, this discourages poorer students to apply.",
              "Tuition fees are rising, which discourages poorer students to apply.",
              "Tuition fees are rising, which discourages poorer students from applying.",
              "Tuition fees are rising, it discourages poorer students from applying.",
            ],
            correct: 2,
            why: "Nối bằng which (không run-on) + discourage + O + from V-ing. A và D là run-on (hai câu nối bằng dấu phẩy); B sai khuôn.",
          },
        ],
      },

      { t: "h", text: "9. Dùng ở đâu trong bài thi — band 6 và band 7 cho cùng một ý" },
      {
        t: "table",
        head: ["Chỗ dùng", "Band 6 (đúng nhưng rời, hoặc dài mà gãy)", "Band 7 (một câu, không lỗi)"],
        rows: [
          ["Task 2 — nêu nguyên nhân", "Many people move to cities. So there are not enough houses. It makes the price increase.", "**The fact that** so many people are moving to cities **has caused** house prices **to rise** beyond the reach of ordinary families."],
          ["Task 2 — đề xuất", "I suggest the government to give money for poor students so they can to study.", "I would suggest **that** the government **provide** grants **to enable** poorer students **to continue** studying."],
          ["Task 2 — nhượng bộ", "Some people think it is good or not, it depends on the situation.", "**Whether** this is beneficial **depends on how** the extra income **is spent**."],
          ["Speaking Part 3", "I think it depends. Some parents are strict, some are not.", "I think it really depends on **how much freedom** parents are prepared **to give**, and **whether** children are mature enough **to handle** it."],
          ["Task 1 — process / map", "After that the bottles are washed. Then they are used again.", "The bottles are then washed **to enable** them **to be reused**. (to be V3)"],
        ],
        caption: "Cùng ý — khác nhau ở việc gói ý bằng mệnh đề danh ngữ và nối đúng khuôn",
      },
      {
        t: "note",
        title: "💡 Cách học: sổ khuôn cá nhân",
        items: [
          "Mỗi lần AI chấm bài viết báo lỗi verb pattern, chép động từ đó vào đúng cột trong 7 khuôn ở mục 5 kèm một câu đúng của bạn.",
          "Mỗi bài Task 2: dùng ==tối đa 1 lần the fact that==, 1 lần whether làm chủ ngữ hoặc sau giới từ, và 1 câu đề xuất bằng suggest / recommend that. Nhiều hơn là phô.",
          "Đọc to câu dài của mình: nếu phải lấy hơi hai lần giữa câu mà không có dấu phẩy, câu đó nên tách.",
        ],
      },

      { t: "h", text: "10. Kiểm tra cuối bài (18 câu)" },
      {
        t: "mcq",
        id: "t4d11-np-chon",
        title: "Chọn phương án đúng (10 câu)",
        items: [
          { q: "There is no evidence ____ the new drug is more effective than the old one.", options: ["which", "what", "that", "whether or"], correct: 2, why: "evidence + that + câu đủ (mệnh đề đồng vị) ⇒ chỉ dùng that." },
          { q: "Much will depend on ____ the public is willing to pay higher taxes.", options: ["whether", "if", "that", "what"], correct: 0, why: "Sau giới từ on: whether (không if, không that). what không hợp vì mệnh đề sau đã đủ thành phần." },
          { q: "The inspectors insisted that the building ____ before the end of the month.", options: ["is repaired", "be repaired", "to be repaired", "repairing"], correct: 1, why: "insist + that + S + (should) + V nguyên mẫu; bị động ⇒ be repaired." },
          { q: "Free school meals enable children from poorer families ____ properly.", options: ["concentrate", "concentrating", "from concentrating", "to concentrate"], correct: 3, why: "enable + O + to V." },
          { q: "Critics object ____ public money on sports stadiums.", options: ["to spending", "to spend", "spending", "for spending"], correct: 0, why: "object to + V-ing (to là giới từ)." },
          { q: "____ worries economists is that young people are saving less than ever.", options: ["That", "What", "Which", "Whether"], correct: 1, why: "worries thiếu chủ ngữ ⇒ What (= the thing that). That đòi một câu đủ phía sau." },
          { q: "The species is believed ____ extinct over a century ago.", options: ["to become", "becoming", "to have become", "that it became"], correct: 2, why: "Sự việc xảy ra trước ⇒ nguyên mẫu hoàn thành to have become." },
          { q: "New regulations prohibit drivers ____ a phone while the engine is running.", options: ["to use", "using", "of using", "from using"], correct: 3, why: "prohibit + O + from V-ing." },
          { q: "The data suggest that the number of cyclists ____ since the lanes were built.", options: ["has doubled", "double", "be doubled", "doubling"], correct: 0, why: "suggest = cho thấy ⇒ chia thì bình thường: has doubled (since…)." },
          { q: "Nobody likes ____ what to do by someone much younger.", options: ["to tell", "being told", "telling", "having told"], correct: 1, why: "Chủ ngữ là người “bị bảo” ⇒ V-ing bị động: being told." },
        ],
      },
      {
        t: "quiz",
        id: "t4d11-np-viet-lai",
        kind: "fill",
        title: "Viết lại câu — gõ CẢ câu, bắt đầu bằng từ cho sẵn, nghĩa không đổi (8 câu)",
        items: [
          { q: "Although the bridge is old, it is still safe. → Despite the fact …", answers: ["Despite the fact that the bridge is old, it is still safe."], hint: "Despite the fact that + S + V" },
          { q: "Because of high fees, many students cannot study abroad. → High fees prevent …", answers: ["High fees prevent many students from studying abroad."], hint: "prevent + O + from V-ing" },
          { q: "“You should hire more nurses,” the report told the hospital. → The report recommended that the hospital …", answers: ["The report recommended that the hospital hire more nurses.", "The report recommended that the hospital should hire more nurses."], hint: "recommend that + S + (should) + V" },
          { q: "Will the plan succeed? Nobody knows. → Whether …", answers: ["Whether the plan will succeed is unknown.", "Whether the plan will succeed is not known.", "Whether the plan will succeed is unclear.", "Whether the plan will succeed nobody knows.", "Whether the plan will succeed remains unknown.", "Whether the plan will succeed remains unclear."], hint: "Whether + S + V + is unknown / unclear" },
          { q: "People think that the painting was stolen in 1911. → The painting is thought …", answers: ["The painting is thought to have been stolen in 1911."], hint: "is thought + to have been V3" },
          { q: "Thanks to the internet, small firms can sell worldwide. → The internet enables …", answers: ["The internet enables small firms to sell worldwide."], hint: "enable + O + to V" },
          { q: "Teachers force pupils to wear uniforms. → Pupils are made …", answers: ["Pupils are made to wear uniforms.", "Pupils are made to wear uniforms by teachers.", "Pupils are made to wear uniforms by their teachers."], hint: "be made + to V" },
          { q: "The council wants to cut pollution, so it closed the road. → The council closed the road with a view …", answers: ["The council closed the road with a view to cutting pollution."], hint: "with a view to + V-ing" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t4d11-doc",
    kind: "reading",
    title: "Đọc: Note completion 2 — Passage 3 (ghi chú xếp lại, paraphrase danh hoá)",
    goal: "Làm đúng ≥ 8/10 câu Note completion ở Passage 3 trong 12 phút: đọc ghi chú như một dàn ý, đoán loại từ và giới hạn số từ, tìm đúng đoạn dù ghi chú đã xếp lại và đổi động từ thành danh từ, chép nguyên dạng từ trong bài — rồi làm tiếp 4 câu Yes / No / Not Given của cùng bài.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "**Note completion** (điền vào ghi chú) = bản tóm tắt dạng gạch đầu dòng dưới các đề mục; bạn điền từ ==lấy nguyên từ bài đọc==. Tập 2 Ngày 4 đã học ở Passage 1 (thông tin cụ thể, cùng thứ tự, đổi từ đồng nghĩa).",
          "Ở **Passage 3**, dạng này khó hơn ở ba điểm: ghi chú **danh hoá** (bài: an attempt… was abandoned → ghi chú: abandonment of a ___), ghi chú **gộp ý từ hai câu**, và quanh đáp án có **2–3 danh từ mồi** cùng loại.",
          "Quy trình 6 bước (mục 3) + bốn mức paraphrase (mục 4) + năm bẫy (mục 5).",
          "Luyện trọn: bài “A Measure for All People” (lịch sử hệ mét) ~870 từ, **14 câu** (27–36 Note, ONE WORD ONLY · 37–40 Yes / No / Not Given) trong 20 phút. Mục tiêu band 7: ==Passage 3 ≥ 9/13==.",
          "Nối ngữ pháp sáng nay: bài đọc có nhiều mệnh đề danh ngữ mang ý chính (What it actually reflected was…, Whether this has done… is debatable, That a measure… turned out to…) — đọc được chúng là đọc được ý chính của đoạn.",
        ],
      },

      { t: "h", text: "1. Ôn Tập 2 Ngày 4 — và Passage 3 khác gì" },
      {
        t: "table",
        head: ["", "Note completion ở Passage 1 (Tập 2 Ngày 4)", "Note completion ở Passage 3 (hôm nay)"],
        rows: [
          ["Loại thông tin", "Sự kiện, số liệu, tên, vật cụ thể", "Sự kiện + ==lý do, lập luận, đánh giá== của tác giả"],
          ["Thứ tự", "Đúng thứ tự bài đọc", "Thường vẫn theo thứ tự, nhưng một dòng ghi chú có thể gộp ý của 2 câu cách nhau; đề mục ghi chú không trùng ranh giới đoạn"],
          ["Paraphrase", "Từ đồng nghĩa (begin → start)", "Đổi loại từ + đổi cấu trúc: động từ → danh từ, chủ động → bị động, phủ định → khẳng định trái nghĩa"],
          ["Mồi nhử", "Ít", "Quanh đáp án có 2–3 từ cùng loại (ba danh từ, hai con số)"],
          ["Giới hạn từ", "Thường NO MORE THAN TWO WORDS", "Hay gặp ==ONE WORD ONLY== — tính từ đi kèm phải bỏ"],
          ["Thời gian", "~1 phút / câu", "~1 phút 10 giây / câu — phần lớn dành cho việc ĐỊNH VỊ"],
        ],
        caption: "Cùng một dạng — khác ở độ dày paraphrase",
      },
      {
        t: "note",
        title: "📌 Ba luật không đổi (sai luật là mất điểm dù hiểu bài)",
        items: [
          "Từ điền phải **có trong bài đọc, đúng nguyên dạng** — không đổi số ít / số nhiều, không đổi thì, không tự nghĩ từ đồng nghĩa.",
          "**Đúng giới hạn số từ.** ONE WORD ONLY mà viết commercial convenience ⇒ sai. Số viết bằng chữ số tính là một “number”, không tính là “word”.",
          "Sau khi điền, **cả dòng ghi chú phải đúng ngữ pháp** và **đúng nghĩa với bài**. Ghi chú được phép cụt (bỏ mạo từ, bỏ be) nhưng loại từ phải khớp.",
        ],
      },

      { t: "h", text: "2. Đọc ghi chú như đọc một dàn ý" },
      {
        t: "p",
        text: "Người band 6 nhảy ngay vào chỗ trống đầu tiên. Người band 7 bỏ ==40 giây đọc toàn bộ ghi chú trước== — vì bản ghi chú chính là dàn ý của nửa bài đọc, do người ra đề viết sẵn cho bạn. Đọc xong, bạn biết: bài nói về gì, chia mấy phần, mỗi phần nằm khoảng đoạn nào. Đây là lợi thế mà dạng trắc nghiệm không có.",
      },
      {
        t: "table",
        head: ["Nhìn vào", "Tự hỏi", "Được gì"],
        rows: [
          ["Tiêu đề ghi chú", "Chủ đề chung là gì?", "Biết ghi chú phủ cả bài hay chỉ vài đoạn"],
          ["Các đề mục con", "Mỗi đề mục ứng với đoạn nào? (tên riêng, năm, nơi chốn)", "Chia bài đọc thành 3–5 vùng tìm kiếm"],
          ["Từ ngay trước / sau chỗ trống", "Cần danh từ, tính từ hay động từ? Số ít hay số nhiều? Người, vật, hay khái niệm?", "Loại được 90 % từ trong đoạn"],
          ["Từ neo không đổi được", "Tên riêng, con số, thuật ngữ (Saint-Denis, 1791, Napoleon, 1983)", "Điểm cắm để quét — những từ này người ra đề không paraphrase được"],
        ],
        caption: "40 giây đọc ghi chú tiết kiệm 3 phút tìm kiếm",
      },

      { t: "h", text: "3. Quy trình 6 bước cho Note completion ở Passage 3" },
      {
        t: "sodo",
        kind: "flow",
        title: "6 bước — khoảng 12 phút cho 10 câu",
        steps: [
          { label: "① Đọc đề: giới hạn số từ", sub: "Khoanh ONE WORD ONLY / NO MORE THAN TWO WORDS. Viết ra giấy nháp “1 từ”." },
          { label: "② Đọc cả bản ghi chú (40 giây)", sub: "Nắm dàn ý; gắn mỗi đề mục với một vùng của bài." },
          { label: "③ Đoán loại từ từng chỗ trống", sub: "Ghi nhanh N / adj / V, số ít / nhiều, người / vật / khái niệm." },
          { label: "④ Quét từ neo, đọc kỹ 2–3 câu quanh đó", sub: "Tìm ý tương đương với dòng ghi chú — đừng tìm chữ giống hệt." },
          { label: "⑤ Chọn từ, chép nguyên dạng", sub: "Nếu có 2–3 ứng viên cùng loại: so từng ứng viên với các từ quanh chỗ trống." },
          { label: "⑥ Đọc lại cả dòng", sub: "Đúng ngữ pháp? Đúng nghĩa bài? Đúng số từ? Đúng chính tả (chép từng chữ)?" },
        ],
        caption: "Kẹt quá 90 giây ở một câu ⇒ đoán, đánh dấu, đi tiếp: câu sau thường nằm ngay bên dưới",
      },
      { t: "rule", formula: "Giới hạn từ → dàn ý ghi chú → loại từ → từ neo → chép nguyên dạng → đọc lại cả dòng", vi: "Quy trình Note completion: dùng chính bản ghi chú làm bản đồ của bài đọc." },

      { t: "h", text: "4. Bốn mức paraphrase giữa bài đọc và ghi chú" },
      {
        t: "table",
        head: ["Mức", "Kiểu đổi", "Bài đọc viết", "Ghi chú viết"],
        rows: [
          ["1", "Từ đồng nghĩa", "a platinum bar representing the result", "result **embodied in** a bar made of ___"],
          ["2", "Đổi loại từ (danh hoá)", "An attempt to decimalise the clock… **was abandoned**", "**abandonment** of a decimal ___"],
          ["3", "Đổi cấu trúc / góc nhìn", "measured not by its surface but by **the labour it demanded**", "measured according to the amount of ___ **required**"],
          ["4", "Gộp hai câu · rút gọn ý lập luận", "uniform measures made the country readable from the centre. The same uniformity served merchants… for whom every local unit was a potential source of dispute", "uniform units helped officials… and helped ___ avoid disagreements"],
        ],
        caption: "Passage 1 dừng ở mức 1–2; Passage 3 dùng đều cả bốn mức",
      },
      {
        t: "note",
        title: "💡 Mẹo: dịch ngược ghi chú thành câu đầy đủ",
        items: [
          "Ghi chú hay bỏ động từ và mạo từ. Trước khi quét, hãy ==tự nói lại dòng ghi chú thành một câu== có động từ: “abandonment of a decimal ___” → “They abandoned a decimal ___”. Câu đầy đủ giúp bạn nhận ra câu gốc trong bài nhanh hơn nhiều.",
          "Danh từ trong ghi chú thường là **động từ / tính từ** trong bài: growth ← grew · refusal ← refused to · reliance on ← relied on · responsibility ← was responsible for. (Chính là bảy khuôn động từ sáng nay, nhìn từ phía bên kia.)",
          "Từ điền thì ngược lại: nó ==không bao giờ bị paraphrase== — nó nằm nguyên trong bài. Paraphrase chỉ xảy ra ở phần chữ quanh chỗ trống.",
        ],
      },

      { t: "h", text: "5. Năm bẫy của Note completion ở band 7" },
      {
        t: "table",
        head: ["Bẫy", "Trông thế nào", "Cách thoát"],
        rows: [
          ["① Mồi cùng loại từ", "Trong 2 câu quanh đáp án có ba danh từ chỉ người: officials, merchants, producers", "So với từ quanh chỗ trống: “helped ___ avoid disagreements” ⇒ người sợ tranh chấp ⇒ merchants"],
          ["② Vượt số từ", "Bài viết a platinum bar; đề ONE WORD ONLY và ghi chú đã có sẵn chữ bar", "Chỉ điền phần còn thiếu: platinum. Đừng chép lại từ ghi chú đã cho"],
          ["③ Đổi dạng từ", "Bài: spies (số nhiều) — bạn viết spy", "Chép từng chữ cái. Ghi chú đã được viết để nhận đúng dạng trong bài"],
          ["④ Phủ định ẩn", "Bài: measured **not by its surface but by** the labour it demanded", "not A but B: đáp án là B. Câu bắt đầu bằng Nor / Not / Far from cũng vậy — đừng điền thứ đang bị phủ định"],
          ["⑤ Ý của ai", "Bài thuật cách giải thích của historians trước đây rồi mới nêu ý tác giả (A more persuasive account…)", "Nhìn đề mục ghi chú: “Earlier view” hay “Writer's explanation”? Lấy từ ở đúng phần của người đó"],
        ],
        caption: "Bẫy ① và ④ chiếm phần lớn số câu sai ở band 6.5",
      },

      { t: "h", text: "6. Khởi động — một đoạn, ba chỗ trống (4 phút)" },
      {
        t: "passage",
        title: "The Sealed Tin",
        paras: [
          {
            text: "The preservation of food in sealed tins was devised in the early nineteenth century, chiefly to feed armies and navies on long campaigns. For decades, however, the invention remained oddly incomplete: the first tins were made of thick iron and had to be opened with a hammer and chisel, since a dedicated opener did not appear until almost fifty years later. Nor were the early products especially safe. The lead used to seal the lids is now thought to have poisoned at least one polar expedition. What eventually made tinned food a household item was not any improvement in taste but a fall in price, brought about when machines replaced the craftsmen who had shaped each container by hand. By the end of the century, a factory worker's family could afford to eat fish caught on the other side of the world — a change whose social significance is easily overlooked.",
          },
        ],
      },
      {
        t: "table",
        head: ["Tinned food — notes"],
        rows: [
          ["Original purpose: supplying **1** ___ and navies"],
          ["Early problems: • no opener (tools needed) • poisoning risk from the **2** ___ in the seal"],
          ["Reason for popularity: lower **3** ___ after mechanisation (not better flavour)"],
        ],
        caption: "Complete the notes. Choose ONE WORD ONLY from the passage for each answer.",
      },
      {
        t: "quiz",
        id: "t4d11-doc-khoi-dong",
        kind: "fill",
        title: "Khởi động — ONE WORD ONLY (3 câu)",
        items: [
          { q: "1. supplying ____ and navies", answers: ["armies"], hint: "Danh từ số nhiều, song song với navies. Bài: to feed armies and navies." },
          { q: "2. poisoning risk from the ____ in the seal", answers: ["lead"], hint: "Một chất liệu. iron là mồi — iron làm thân hộp, không phải thứ gây độc." },
          { q: "3. lower ____ after mechanisation", answers: ["price"], hint: "Bài: not any improvement in taste but a fall in price; taste là mồi (ghi chú đã nói not better flavour)." },
        ],
      },
      {
        t: "note",
        title: "📌 Soi lại ba câu khởi động",
        items: [
          "Câu 1 — mức 1: feed → **supplying**. Từ điền giữ nguyên số nhiều **armies** (viết army là sai).",
          "Câu 2 — mức 3 + bẫy mồi: bài có hai kim loại (iron, lead). Ghi chú nói “in the seal” ⇒ **lead** (The lead used to seal the lids). Chú ý cấu trúc sáng nay: **is now thought to have poisoned**.",
          "Câu 3 — mức 2 + bẫy phủ định: a fall in price → **lower price**; machines replaced the craftsmen → **mechanisation** (danh hoá). **taste** bị loại bằng not… but….",
        ],
      },

      { t: "h", text: "7. Luyện trọn bài — Reading Passage 3, Questions 27–40 (20 phút)" },
      {
        t: "p",
        text: "Bấm giờ ==20 phút==. Đọc ghi chú trước (40 giây), rồi đọc bài. Làm Questions 27–36 trước (theo thứ tự bài), sau đó 37–40. Không tra từ điển trong lúc làm.",
      },
      {
        t: "passage",
        title: "A Measure for All People",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on the reading passage below.",
        paras: [
          {
            label: "A",
            text: "Anyone travelling through France in the 1780s would have found that a pint of wine in Paris was not the same quantity as a pint a few miles away in Saint-Denis. By one estimate, the kingdom used some 250,000 different units of weight and measure, many of them sharing a name but not a size. To modern eyes this looks like simple chaos. What it actually reflected was a world in which measuring was a local matter, settled between neighbours who knew one another, and in which nobody needed a unit that meant the same thing in a place he would never visit.",
          },
          {
            label: "B",
            text: "Nor were the old measures as irrational as they appear. Land, in many districts, was measured not by its surface but by the labour it demanded: a field might be described as so many ‘days’, meaning the number of days a man needed to plough it. A unit of this kind told a farmer precisely what he wanted to know, which was how much work lay ahead, and it automatically allowed for the fact that steep or stony ground is harder to work than flat. The difficulty was that such measures were open to abuse. The right to keep the official measuring vessels usually belonged to the local lord, and peasants suspected, often with reason, that the vessel in which their rent was collected was larger than the one by which grain was sold to them. When the grievances of the French people were gathered in 1789, the demand for ‘one king, one law, one weight and one measure’ was among the most frequent.",
          },
          {
            label: "C",
            text: "The revolutionary government took up the demand with enthusiasm, though for reasons of its own. Scientists wanted a unit that was owed to no nation and would therefore be acceptable to all, and in 1791 the Academy of Sciences proposed that the new unit of length, the metre, should be one ten-millionth of the distance from the North Pole to the Equator. Two astronomers were sent to survey the line between Dunkirk and Barcelona, from which the full distance could be calculated. The task was expected to take a year. It took seven, interrupted by war and by villagers who took men carrying strange instruments for spies. A platinum bar representing the result was finally presented in 1799, under the motto ‘for all time, for all people’.",
          },
          {
            label: "D",
            text: "The people, however, proved unwilling. The new units had unfamiliar names, borrowed from Greek and Latin, and they divided by ten, whereas market traders were accustomed to halving and quartering. An attempt to decimalise the clock, with a day of ten hours, was abandoned after less than two years. Shopkeepers went on selling by the old pound, and in 1812 Napoleon gave way, permitting a set of ‘customary measures’ which kept the old names while fixing their values in metric terms. Only in 1840, more than four decades after the platinum bar was made, did the metric system become compulsory in France. What had been devised in the name of the people had, in the end, to be imposed on them.",
          },
          {
            label: "E",
            text: "Why, then, did the state persist? Historians once explained the metric system as the natural triumph of science over superstition. A more persuasive account points to the interests of government itself. Officials in Paris could not tax a harvest, plan a road or feed an army on the basis of 250,000 units which only local people understood; uniform measures made the country readable from the centre. The same uniformity served merchants trading over long distances, for whom every local unit was a potential source of dispute. Those who gained least were the small producers for whom local measures had worked perfectly well. It is significant that the reform succeeded only when schools began teaching the new units — in other words, when a generation had grown up knowing nothing else.",
          },
          {
            label: "F",
            text: "The system's later spread followed the same logic. In 1875, seventeen nations signed a treaty establishing an international office to maintain the standards, and most of the world adopted the metre during the following century, frequently at the moment of independence or revolution, when governments were keen to mark a break with the past. The United States, where metric units have been legal since 1866, never made them compulsory, and continues to use both systems side by side. Whether this has done the country any real harm is debatable. The usual example is the loss, in 1999, of a spacecraft whose builders had supplied figures in one system to engineers working in the other; yet such accidents are rare, and the cost of converting every road sign and machine would be enormous.",
          },
          {
            label: "G",
            text: "Meanwhile, the metre itself has quietly ceased to be what its inventors intended. The survey of the 1790s is now known to have contained a small error, so that the bar never quite matched the Earth it was supposed to represent; and since 1983 the unit has been defined not by any object or planet but by the distance light travels in a tiny fraction of a second. That a measure ‘taken from nature’ turned out to rest on agreement rather than on nature would not have surprised the peasants of 1789. They had always known that the important question about a measure is not what it is based on, but who is entitled to decide.",
          },
        ],
      },
      {
        t: "p",
        text: "**Questions 27–36.** Complete the notes below. Choose ==ONE WORD ONLY== from the passage for each answer.",
      },
      {
        t: "table",
        head: ["The metric system — notes"],
        rows: [
          ["**France before the Revolution**"],
          ["• many units had the same **27** ___ but were different in size"],
          ["• land often measured according to the amount of **28** ___ it required"],
          ["• official measuring containers were normally controlled by the **29** ___"],
          ["**Creating the metre**"],
          ["• scientists' aim: a unit that did not belong to any **30** ___"],
          ["• the two astronomers were sometimes mistaken for **31** ___"],
          ["• 1799: result embodied in a bar made of **32** ___"],
          ["**Public reaction**"],
          ["• abandonment of a decimal **33** ___ within two years"],
          ["• 1812: ‘customary measures’ allowed; system compulsory only from 1840"],
          ["**Why the state persisted (writer's explanation)**"],
          ["• uniform units helped officials to tax and plan, and helped **34** ___ avoid disagreements"],
          ["• reform finally worked once the units were taught in **35** ___"],
          ["**The metre today**"],
          ["• since 1983, defined by reference to **36** ___ , not to the Earth"],
        ],
      },
      {
        t: "quiz",
        id: "t4d11-doc-note",
        kind: "fill",
        title: "Questions 27–36 — Note completion (ONE WORD ONLY)",
        items: [
          { q: "27. many units had the same ____ but were different in size", answers: ["name"], hint: "Đoạn A: sharing a… but not a size." },
          { q: "28. land often measured according to the amount of ____ it required", answers: ["labour"], hint: "Đoạn B: not by its surface but by…" },
          { q: "29. official measuring containers were normally controlled by the ____", answers: ["lord"], hint: "Đoạn B: The right to keep the official measuring vessels…" },
          { q: "30. a unit that did not belong to any ____", answers: ["nation"], hint: "Đoạn C: owed to no…" },
          { q: "31. the two astronomers were sometimes mistaken for ____", answers: ["spies"], hint: "Đoạn C: villagers who took men… for… Chép đúng số nhiều." },
          { q: "32. result embodied in a bar made of ____", answers: ["platinum"], hint: "Đoạn C, câu cuối." },
          { q: "33. abandonment of a decimal ____ within two years", answers: ["clock"], hint: "Đoạn D: An attempt to decimalise the…" },
          { q: "34. helped ____ avoid disagreements", answers: ["merchants"], hint: "Đoạn E: a potential source of dispute." },
          { q: "35. reform finally worked once the units were taught in ____", answers: ["schools"], hint: "Đoạn E, câu cuối." },
          { q: "36. since 1983, defined by reference to ____", answers: ["light"], hint: "Đoạn G: not by any object or planet but by…" },
        ],
      },
      {
        t: "p",
        text: "**Questions 37–40.** Do the following statements agree with the claims of the writer in the reading passage? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t4d11-doc-ynng",
        title: "Questions 37–40 — Yes / No / Not Given",
        items: [
          {
            q: "37. Historians have always explained the metric system in terms of the needs of government.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 1,
            why: "Đoạn E: Historians once explained the metric system as the natural triumph of science over superstition. A more persuasive account points to the interests of government… ⇒ trước đây họ giải thích KHÁC ⇒ trái với “have always” ⇒ NO. Bẫy từ cực đoan always.",
          },
          {
            q: "38. The measures used before the Revolution suited their users better than they might seem to today.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 0,
            why: "Đoạn B: Nor were the old measures as irrational as they appear… A unit of this kind told a farmer precisely what he wanted to know. ⇒ tác giả khẳng định chúng hợp lý hơn vẻ ngoài ⇒ YES. Câu bắt đầu bằng Nor là phủ định đảo ngữ (Ngày 7).",
          },
          {
            q: "39. Napoleon personally preferred the old units to the metric ones.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 2,
            why: "Đoạn D chỉ nói Napoleon gave way, permitting a set of ‘customary measures’ — ông nhượng bộ dân chúng; không một chữ nào về sở thích cá nhân của ông ⇒ NOT GIVEN. Đừng suy ra từ hành động sang ý thích.",
          },
          {
            q: "40. It is uncertain whether keeping two systems of measurement has seriously damaged the United States.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 0,
            why: "Đoạn F: Whether this has done the country any real harm is debatable. ⇒ YES. debatable → uncertain; any real harm → seriously damaged. Mệnh đề Whether làm chủ ngữ — đúng khung sáng nay.",
          },
        ],
      },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Câu chứa đáp án trong bài", "Kiểu paraphrase · bẫy"],
        rows: [
          ["27", "name", "A: many of them sharing a **name** but not a size", "Mức 1: sharing → had the same; not a size → different in size. Mồi: size (ghi chú đã dùng), pint"],
          ["28", "labour", "B: measured not by its surface but by the **labour** it demanded", "Mức 3: demanded → required. Bẫy ④ not… but…: surface là thứ bị phủ định. Mồi: days, work (work nằm ở câu sau, không đi với “it required” trong bài)"],
          ["29", "lord", "B: The right to keep the official measuring vessels usually belonged to the local **lord**", "Mức 3: the right to keep… belonged to → were controlled by; vessels → containers; usually → normally. Mồi: peasants, king"],
          ["30", "nation", "C: a unit that was owed to no **nation**", "Mức 2–3: owed to no → did not belong to any. Mồi: Academy, government"],
          ["31", "spies", "C: villagers who took men carrying strange instruments for **spies**", "Mức 3: took… for → were mistaken for (chủ động → bị động). Mồi: villagers (người nhầm, không phải thứ bị nhầm thành)"],
          ["32", "platinum", "C: A **platinum** bar representing the result", "Mức 1: representing → embodied in. Bẫy ②: ghi chú đã có bar — chỉ điền platinum"],
          ["33", "clock", "D: An attempt to decimalise the **clock**… was abandoned after less than two years", "Mức 2: decimalise (V) → decimal (adj); was abandoned → abandonment. Mồi: day, hours, pound"],
          ["34", "merchants", "E: The same uniformity served **merchants**… for whom every local unit was a potential source of dispute", "Mức 4: gộp hai câu; dispute → disagreements. Bẫy ①: officials (đã có trong ghi chú), producers (người được lợi ÍT nhất)"],
          ["35", "schools", "E: the reform succeeded only when **schools** began teaching the new units", "Mức 3: schools began teaching → were taught in (chủ động → bị động); succeeded → finally worked. Mồi: generation"],
          ["36", "light", "G: defined not by any object or planet but by the distance **light** travels", "Mức 3 + bẫy ④ not… but…: object, planet bị phủ định. Mồi: Earth (ghi chú đã loại: not to the Earth)"],
        ],
        caption: "Đáp án Questions 27–36 — tự chấm rồi ghi kiểu bẫy mình dính vào sổ lỗi",
      },
      {
        t: "note",
        title: "📌 Chấm điểm và đọc kết quả",
        items: [
          "**12–14 đúng**: đạt mức Passage 3 của band 7 (≥ 9/13). Xem lại đúng 1–2 câu sai, ghi kiểu bẫy.",
          "**9–11 đúng**: đang ở band 6.5. Xem bạn sai vì ==không tìm ra chỗ== (⇒ luyện bước ② và ④) hay ==tìm ra nhưng chọn nhầm từ== (⇒ luyện bước ③ và ⑤).",
          "**≤ 8 đúng**: làm lại Tập 2 Ngày 4 mục chiến thuật, rồi làm lại bài này sau 3 ngày — lần hai chỉ tính thời gian.",
          "Sai 37–40 từ 2 câu trở lên ⇒ ôn Tập 4 Ngày 5 (bẫy T/F/NG band 7).",
        ],
      },

      { t: "h", text: "8. Soi lại bài đọc: mệnh đề danh ngữ mang ý chính của đoạn" },
      {
        t: "p",
        text: "Ở Passage 3, tác giả hay đặt ==nhận định của mình vào một mệnh đề danh ngữ== — đúng những khung bạn học sáng nay. Đọc ra chúng là nắm được lập luận của cả đoạn mà không cần hiểu hết từng từ.",
      },
      {
        t: "table",
        head: ["Đoạn", "Câu trong bài", "Khung", "Tác giả đang làm gì"],
        rows: [
          ["A", "**What it actually reflected was** a world in which measuring was a local matter", "Wh-cleft (Ngày 7)", "Bác cách nhìn “hỗn loạn”, nêu cách nhìn của mình"],
          ["B", "it automatically allowed for **the fact that** steep or stony ground is harder to work", "the fact that + S + V", "Chứng minh đơn vị cũ có lý"],
          ["D", "**What had been devised in the name of the people** had, in the end, to be imposed on them.", "What-clause làm chủ ngữ", "Chốt đoạn bằng một nghịch lý"],
          ["E", "**It is significant that** the reform succeeded only when schools began teaching the new units", "It is + adj + that", "Rọi vào bằng chứng cho lập luận của mình"],
          ["F", "**Whether this has done the country any real harm** is debatable.", "Whether-clause làm chủ ngữ + V số ít", "Dè dặt ⇒ câu 40"],
          ["G", "**That a measure ‘taken from nature’ turned out to rest on agreement**… would not have surprised the peasants", "That-clause làm chủ ngữ", "Nêu luận điểm kết bài"],
        ],
        caption: "Sáu câu “xương sống” của bài — đều là mệnh đề danh ngữ",
      },
      {
        t: "quiz",
        id: "t4d11-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ bài đọc — soi khuôn động từ và mệnh đề danh ngữ (6 câu)",
        items: [
          { q: "Đoạn B: the number of days a man needed ____ plough it.", answers: ["to"], hint: "need + to V (khuôn ①)" },
          { q: "Đoạn C: The task was expected ____ take a year.", answers: ["to"], hint: "be expected + to V (bị động của khuôn ③)" },
          { q: "Đoạn D: Shopkeepers went on ____ by the old pound.", answers: ["selling"], hint: "go on + V-ing = tiếp tục làm" },
          { q: "Đoạn D: market traders were accustomed to ____ and quartering.", answers: ["halving"], hint: "be accustomed to + V-ing (to là giới từ)" },
          { q: "Đoạn G: The survey of the 1790s is now known to ____ contained a small error.", answers: ["have"], hint: "is known + to have V3" },
          { q: "Đoạn F: ____ this has done the country any real harm is debatable.", answers: ["Whether"], hint: "Whether-clause làm chủ ngữ" },
        ],
      },
      {
        t: "note",
        title: "💡 Mang về bài viết của bạn",
        items: [
          "Hai khung đáng chép cho Task 2: **Whether X has done any real harm is debatable.** · **A more persuasive account / explanation points to…** — cả hai đều thể hiện lập trường có cân nhắc (hedging), đúng tinh thần band 7.",
          "Chú ý đảo ngữ ở đoạn D: **Only in 1840… did the metric system become** compulsory (Ngày 7 mục 6) — câu chứa mốc thời gian quan trọng nhất của đoạn.",
        ],
      },

      { t: "h", text: "9. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "irrational", pos: "adj", ipa: "/ɪˈræʃənl/", vi: "phi lý, không hợp lý", ex: "The fear of flying is common but largely irrational.", exVi: "Nỗi sợ đi máy bay khá phổ biến nhưng phần lớn là phi lý.", more: "↔ rational (a rational decision / explanation) · tiền tố **ir-** trước r: irregular, irrelevant, irresponsible · adv: irrationally" },
          { w: "be open to abuse", pos: "cụm", ipa: "/bi ˈəʊpən tə əˈbjuːs/", vi: "dễ bị lợi dụng", ex: "Any system based on trust is open to abuse.", exVi: "Bất kỳ hệ thống nào dựa trên lòng tin đều dễ bị lợi dụng.", more: "be open to **criticism / question / dispute / interpretation** · abuse n /əˈbjuːs/ — v /əˈbjuːz/ · abuse of power" },
          { w: "grievance", pos: "n", ipa: "/ˈɡriːvns/", vi: "điều bất bình, lời than phiền chính đáng", ex: "The workers presented a list of grievances to the management.", exVi: "Công nhân đưa cho ban quản lý một danh sách những điều bất bình.", more: "air / voice / address a grievance · a long-standing grievance · trang trọng hơn complaint" },
          { w: "accustomed", pos: "adj", ipa: "/əˈkʌstəmd/", vi: "quen với", ex: "Older employees were accustomed to working with paper records.", exVi: "Nhân viên lớn tuổi đã quen làm việc với hồ sơ giấy.", more: "be / become / grow accustomed **to + N / V-ing** (to là giới từ — bài Ngữ pháp mục 6) · = be used to (thân mật hơn)" },
          { w: "give way", pos: "cụm động từ", ipa: "/ɡɪv weɪ/", vi: "nhượng bộ; nhường chỗ cho", ex: "After weeks of protest, the council finally gave way.", exVi: "Sau nhiều tuần biểu tình, hội đồng cuối cùng đã nhượng bộ.", more: "give way **to** + N: Optimism gave way to doubt. (nhường chỗ cho) · trên đường: Give way = nhường đường" },
          { w: "compulsory", pos: "adj", ipa: "/kəmˈpʌlsəri/", vi: "bắt buộc", ex: "Wearing a seat belt has been compulsory for decades.", exVi: "Thắt dây an toàn đã là bắt buộc từ nhiều thập kỷ.", more: "compulsory education / subject / insurance · ↔ optional, voluntary · = mandatory (văn bản pháp lý), obligatory · make sth compulsory" },
          { w: "impose", pos: "v", ipa: "/ɪmˈpəʊz/", vi: "áp đặt", ex: "The government imposed a tax on plastic bags.", exVi: "Chính phủ áp thuế lên túi ni lông.", more: "impose sth **on** sb / sth · impose a ban / a limit / restrictions / a fine · n: imposition" },
          { w: "persist", pos: "v", ipa: "/pəˈsɪst/", vi: "kiên trì theo đuổi; kéo dài dai dẳng", ex: "The problem persisted despite several attempts to fix it.", exVi: "Vấn đề vẫn dai dẳng dù đã có vài lần cố sửa.", more: "persist **in** + V-ing / **with** + N (khuôn ⑥) · adj: persistent (persistent unemployment) · n: persistence" },
          { w: "uniform", pos: "adj", ipa: "/ˈjuːnɪfɔːm/", vi: "đồng nhất, như nhau ở mọi nơi", ex: "The company applies uniform standards in all its factories.", exVi: "Công ty áp dụng tiêu chuẩn đồng nhất ở mọi nhà máy.", more: "AWL sublist 8 (Ngày 8) · n: uniformity · adv: uniformly · ⚠️ danh từ uniform = đồng phục" },
          { w: "dispute", pos: "n / v", ipa: "/dɪˈspjuːt/ · /ˈdɪspjuːt/", vi: "tranh chấp, tranh cãi; phản bác", ex: "Unclear contracts are a common source of dispute between firms.", exVi: "Hợp đồng không rõ ràng là nguồn tranh chấp thường gặp giữa các công ty.", more: "a source of dispute · be **in** dispute · be open to dispute · a dispute **over / about** + N · v: Few would dispute that… (ít ai phản bác rằng…)" },
          { w: "debatable", pos: "adj", ipa: "/dɪˈbeɪtəbl/", vi: "còn phải bàn, chưa chắc", ex: "Whether the scheme saves money is debatable.", exVi: "Chương trình này có tiết kiệm tiền hay không thì còn phải bàn.", more: "It is debatable **whether**… (mệnh đề danh ngữ) · gần nghĩa: questionable, open to question, arguable · từ rào đón tốt cho Task 2" },
          { w: "be entitled to", pos: "cụm", ipa: "/bi ɪnˈtaɪtld tə/", vi: "có quyền (được hưởng / được làm)", ex: "Every employee is entitled to four weeks' paid holiday.", exVi: "Mọi nhân viên có quyền hưởng bốn tuần nghỉ phép có lương.", more: "be entitled to **+ N** (to giới từ: entitled to compensation) hoặc **+ V** (to nguyên mẫu: entitled to decide) · n: entitlement" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d11-noi",
    kind: "speaking",
    title: "Nói Part 3: “To what extent…?” — nói đúng mức độ và chống đỡ được mức đó",
    goal: "Trả lời câu hỏi mức độ ở Part 3 (To what extent…? · How far…? · How much influence…?) trong 40–50 giây theo khung 4 bước: đặt mức trên thang 5 bậc → chống đỡ bằng ví dụ / so sánh / hệ quả → nêu giới hạn → chốt lại; và dùng trọng âm tương phản để người nghe nghe ra đúng chỗ bạn phân biệt.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Câu hỏi **mức độ** (extent question) không hỏi “có hay không” mà hỏi ==“đến đâu”==. Trả lời Yes / No rồi nêu lý do là trả lời lệch câu hỏi — FC mất điểm mạch lạc dù nói trôi.",
          "**Thang 5 bậc**: entirely → to a large extent → to some extent → only to a limited extent → hardly at all. Chọn bậc bạn tin thật, rồi nói vì sao ==đúng bậc đó, không cao hơn, không thấp hơn==.",
          "**Khung 4 bước**: Mức độ → Chống đỡ (vì sao tới mức đó) → Giới hạn (vì sao không hơn) → Chốt.",
          "**Chống đỡ kiểu band 7**: một ví dụ có chi tiết, một phép so sánh hai nhóm, hoặc một hệ quả “nếu không thì” — không dừng ở câu khái quát.",
          "Ngữ pháp sáng nay dùng ngay: it depends on **how much**… · **whether**… · **the fact that**… · prevent sb **from** V-ing.",
          "🔊 **Trọng âm tương phản** (contrastive stress): nhấn vào đúng từ bạn đang đối chiếu — LARGELY, not ENTIRELY.",
          "Ôn từ: Tập 2 Ngày 17 (thang đồng ý), Tập 3 Ngày 10 (đồng ý một phần + 4 cách phát triển), Tập 3 Ngày 23 (ngữ điệu đối lập), Tập 4 Ngày 7 (thang chắc chắn khi dự đoán).",
        ],
      },

      { t: "h", text: "1. Nhận ra câu hỏi mức độ — sáu cách giám khảo hỏi" },
      {
        t: "table",
        head: ["Dạng câu hỏi", "Ví dụ", "Thật ra đang hỏi"],
        rows: [
          ["To what extent…?", "To what extent are parents responsible for the way their children behave?", "Bao nhiêu phần là do bố mẹ?"],
          ["How far…?", "How far do you think schools prepare young people for working life?", "Chuẩn bị được đến đâu?"],
          ["How much (influence / impact)…?", "How much influence does advertising have on what people buy?", "Ảnh hưởng nhiều hay ít?"],
          ["How important / necessary…?", "How important is it for a country to preserve its old buildings?", "Quan trọng đến mức nào so với thứ khác?"],
          ["Is X entirely / mainly…?", "Is technology mainly to blame for people reading less?", "Phần lớn hay chỉ một phần?"],
          ["Do you agree that… (có từ mức độ)", "Would you agree that success depends mostly on luck?", "“mostly” có đúng không — hay ít hơn thế?"],
        ],
        caption: "Thấy extent · far · much · mainly · entirely · mostly ⇒ câu trả lời phải có một TỪ CHỈ MỨC ĐỘ trong 5 giây đầu",
      },
      {
        t: "note",
        title: "⚠️ Ba cách trả lời lệch câu hỏi mức độ",
        items: [
          "**Trả lời Yes / No**: “Yes, I think parents are responsible because…” — giám khảo hỏi “đến đâu”, bạn trả lời “có”. Sửa: mở bằng mức độ — “**To a large extent**, I'd say, …”",
          "**Trả lời ‘It depends’ rồi bỏ lửng**: It depends là mở bài tốt (Tập 3 Ngày 6) nhưng ở câu hỏi mức độ bạn vẫn phải ==chốt một mức== ở cuối.",
          "**Liệt kê ưu – nhược**: câu hỏi không hỏi tốt hay xấu. Mọi câu bạn nói phải phục vụ việc chứng minh “mức này”.",
        ],
      },

      { t: "h", text: "2. Thang 5 bậc mức độ — và cách nói từng bậc" },
      {
        t: "table",
        head: ["Bậc", "Nghĩa", "Cụm mở câu (band 7)", "Cụm trong câu"],
        rows: [
          ["5", "Gần như hoàn toàn", "Almost entirely, I'd say. · Pretty much completely.", "be **almost entirely** down to… · **by and large**"],
          ["4", "Phần lớn", "To a large / great extent, yes. · For the most part, I think so.", "**largely** · **mainly** · **play a major part in**"],
          ["3", "Một phần", "To some extent, yes. · Up to a point. · To a certain degree.", "**partly** · **play a part in** · **is one factor among several**"],
          ["2", "Ít thôi", "Only to a limited extent, I think. · Not as much as people assume.", "**only marginally** · **has a fairly minor effect on**"],
          ["1", "Hầu như không", "Hardly at all, in my view. · Very little, to be honest.", "**barely** · **makes next to no difference to**"],
        ],
        caption: "Chọn bậc bạn có ví dụ để chứng minh — bậc 3 và 4 dễ nói nhất vì có cả hai phía",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "To a large / some / a limited extent, + S + V",
            vi: "Cụm mức độ đứng đầu, ngắt một nhịp rồi nói ý.",
            examples: [
              { en: "To a large extent, people's eating habits are formed at home.", vi: "Ở mức độ lớn, thói quen ăn uống của con người được hình thành ở nhà." },
              { en: "Only to a limited extent, I'd say — most people have already decided what they want.", vi: "Chỉ ở mức hạn chế thôi — hầu hết mọi người đã quyết mình muốn gì rồi." },
            ],
          },
          {
            formula: "S + be + largely / partly / mainly + down to + N / the fact that…",
            vi: "… phần lớn / một phần là do… (be down to = là do — tự nhiên khi nói).",
            examples: [
              { en: "A child's confidence is largely down to how much encouragement they get early on.", vi: "Sự tự tin của một đứa trẻ phần lớn là do các em nhận được bao nhiêu khích lệ từ sớm." },
              { en: "The decline is partly down to the fact that people have less free time.", vi: "Sự sụt giảm một phần là do mọi người có ít thời gian rảnh hơn." },
            ],
          },
          {
            formula: "S + play a major / a part / only a minor part + in + N / V-ing",
            vi: "đóng vai trò lớn / một phần / nhỏ trong việc…",
            examples: [
              { en: "Schools play a part in shaping behaviour, but only a minor one compared with the family.", vi: "Trường học có góp phần định hình hành vi, nhưng chỉ là phần nhỏ so với gia đình." },
            ],
          },
          {
            formula: "It depends (largely) on + how much / whether / what + S + V",
            vi: "Tuỳ (phần lớn) vào việc… — mệnh đề danh ngữ sau giới từ (bài Ngữ pháp mục 3).",
            examples: [
              { en: "It depends largely on whether the parents themselves set a good example.", vi: "Điều đó tuỳ phần lớn vào việc chính bố mẹ có làm gương tốt hay không." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi người Việt hay mắc với cụm mức độ",
        items: [
          "~~in some extent~~ · ~~at some extent~~ → **to** some extent. · ~~to some extend~~ → extent (/ɪkˈstent/, danh từ; extend là động từ).",
          "~~I very agree~~ · ~~I agree in a large extent~~ → I **largely** agree. / I agree **to a large extent**.",
          "~~It depends on the situation~~ rồi dừng → nói rõ tình huống nào: It depends on **how old the child is**.",
          "Lặp một cụm: nói “to some extent” ba lần trong một câu trả lời. Hãy đổi: to some extent → **partly** → **up to a point**.",
          "Phát âm: **extent** nhấn âm 2; **largely** /ˈlɑːdʒli/ hai âm tiết, không phải “la-gơ-li”.",
        ],
      },
      { t: "rule", formula: "To a large / some / a limited extent, S + V   ·   S + be largely / partly down to + N", vi: "Đặt mức độ ngay câu đầu; chọn một trong 5 bậc và giữ đúng bậc đó đến hết câu trả lời." },
      {
        t: "quiz",
        id: "t4d11-noi-muc-do-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng cụm cho trong gợi ý (5 câu)",
        grammar: "to a large / some / a limited extent · be largely down to · play a part in · depend on whether",
        items: [
          { q: "Ở mức độ lớn, thành công của một học sinh phụ thuộc vào giáo viên.", answers: ["To a large extent, a student's success depends on the teacher.", "To a large extent, a student's success depends on their teacher.", "To a great extent, a student's success depends on the teacher.", "To a large extent, a student's success depends on teachers.", "To a large extent a student's success depends on the teacher."], hint: "To a large extent, …" },
          { q: "Quảng cáo chỉ ảnh hưởng tới tôi ở mức hạn chế.", answers: ["Advertising only influences me to a limited extent.", "Advertising influences me only to a limited extent.", "Advertising affects me only to a limited extent.", "Advertising only affects me to a limited extent.", "Advertisements only influence me to a limited extent."], hint: "only to a limited extent" },
          { q: "Vấn đề này phần lớn là do thiếu kinh phí.", answers: ["This problem is largely down to a lack of funding.", "The problem is largely down to a lack of funding.", "This problem is largely down to the lack of funding.", "This problem is largely down to lack of funding.", "This problem is largely due to a lack of funding."], hint: "be largely down to + N" },
          { q: "Bạn bè đóng một vai trò lớn trong việc định hình sở thích của thanh thiếu niên.", answers: ["Friends play a major part in shaping teenagers' interests.", "Friends play a major part in shaping the interests of teenagers.", "Friends play a major role in shaping teenagers' interests.", "Friends play a big part in shaping teenagers' interests.", "Friends play a major part in shaping teenagers' tastes."], hint: "play a major part in + V-ing" },
          { q: "Điều đó tuỳ vào việc mọi người có sẵn lòng thay đổi hay không.", answers: ["It depends on whether people are willing to change.", "That depends on whether people are willing to change.", "It depends on whether or not people are willing to change.", "It depends on whether people are prepared to change."], hint: "depend on whether + S + V" },
        ],
      },

      { t: "h", text: "3. Khung 4 bước cho một câu trả lời mức độ (40–50 giây)" },
      {
        t: "sodo",
        kind: "flow",
        title: "Mức độ → Chống đỡ → Giới hạn → Chốt",
        steps: [
          { label: "① Mức độ (5 giây)", sub: "To a large extent, I'd say. / Only up to a point, I think." },
          { label: "② Chống đỡ (15–20 giây)", sub: "Vì sao TỚI mức đó: một ví dụ có chi tiết, một phép so sánh, hoặc một hệ quả." },
          { label: "③ Giới hạn (10–15 giây)", sub: "Vì sao KHÔNG HƠN mức đó: yếu tố khác cũng có phần. That said, … / But it's not the whole story — …" },
          { label: "④ Chốt (5 giây)", sub: "So on balance, … is the main factor, but not the only one." },
        ],
        caption: "Bước ③ là bước người band 6 hay bỏ — và chính nó chứng minh bạn hiểu chữ “extent”",
      },
      {
        t: "table",
        head: ["Bước", "Cụm band 7", "Ghi chú"],
        rows: [
          ["① Mức độ", "To a large extent, I'd say. · I'd say quite a lot, actually. · Less than you might think. · Only up to a point.", "Có thể thêm một giây mua thời gian trước: That's a tricky one. / Hmm, let me think. (Tập 3 Ngày 11)"],
          ["② Chống đỡ", "The main reason is that… · You can see this in the way… · Take… for instance. · If you compare… with…, · Without…, … would…", "Một kiểu chống đỡ nói kỹ tốt hơn ba kiểu nói lướt"],
          ["③ Giới hạn", "That said, … · Having said that, … · But it's not the whole story. · … also has a lot to do with it. · You can't put it all down to…", "put sth down to = quy cho, đổ cho"],
          ["④ Chốt", "So on balance, … · So I'd say it's a big factor, but not the deciding one. · So mostly, yes, but not entirely.", "Nhắc lại MỨC, không nhắc lại lý do"],
        ],
        caption: "Ngân hàng cụm cho bốn bước",
      },
      {
        t: "note",
        title: "💡 Ba kiểu chống đỡ — chọn một và nói cho tới",
        items: [
          "**Ví dụ có chi tiết** (ai, ở đâu, cái gì): không phải “for example, some children” mà “**my cousin's two boys** — the parents never raise their voices, and **neither do the kids**.”",
          "**So sánh hai nhóm**: “**If you compare** children who eat dinner with their family **with** those who eat alone in front of a screen, the difference in how they talk to adults is obvious.”",
          "**Hệ quả ngược lại** (điều kiện loại 2): “**If** parents **didn't** set any limits, most children **wouldn't** learn where the limits are — school alone can't do that.”",
          "Band 7 FC yêu cầu “ý được phát triển mạch lạc”: một ý + một kiểu chống đỡ nói đủ 15–20 giây là đạt. Ba ý mỗi ý 5 giây là liệt kê — band 6.",
        ],
      },
      { t: "rule", formula: "Mức độ → Chống đỡ (ví dụ / so sánh / hệ quả) → Giới hạn (That said, …) → Chốt (So on balance, …)", vi: "Khung 4 bước cho mọi câu hỏi To what extent / How far / How much." },

      { t: "h", text: "4. Nghe và so: band 6 và band 7 cho cùng một câu hỏi" },
      {
        t: "p",
        text: "Câu hỏi: ==To what extent are parents responsible for the way their children behave?== Bấm nghe hai câu trả lời. Trước khi xem bảng, tự trả lời: câu nào nói rõ “đến mức nào”? Câu nào có bước ③?",
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — khoảng 25 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "To what extent are parents responsible for the way their children behave?", vi: "Bố mẹ chịu trách nhiệm đến mức nào về cách con cái cư xử?" },
          { who: "Candidate", role: "candidate", text: "Yes, I think parents are responsible for their children's behaviour, because children spend a lot of time with their parents and they learn from them. For example, if parents are polite, children will be polite too. And if parents are busy, children can behave badly. Also school is important and friends are important. So parents should spend more time with their children.", vi: "Vâng, em nghĩ bố mẹ có trách nhiệm về hành vi của con, vì trẻ dành nhiều thời gian với bố mẹ và học từ họ. Ví dụ, nếu bố mẹ lịch sự thì con cũng lịch sự. Và nếu bố mẹ bận thì con có thể cư xử tệ. Ngoài ra trường học quan trọng và bạn bè quan trọng. Vì vậy bố mẹ nên dành nhiều thời gian hơn cho con." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 7 (ước tính) — khoảng 45 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "To what extent are parents responsible for the way their children behave?", vi: "Bố mẹ chịu trách nhiệm đến mức nào về cách con cái cư xử?" },
          { who: "Candidate", role: "candidate", text: "To a large extent, I'd say — at least while the children are young. Small kids basically copy whatever they see at home. My cousin's two boys are a good example: their parents never raise their voices, and the boys are the calmest kids I know, whereas you can usually tell when a child has grown up around a lot of shouting. That said, it's not the whole story. Once children reach their teens, friends and whatever they're watching online have a lot to do with it, and you can't really put it all down to the parents by then. So on balance, parents lay the foundations, but they're largely responsible rather than entirely responsible.", vi: "Ở mức độ lớn, em nghĩ vậy — ít nhất là khi con còn nhỏ. Trẻ nhỏ về cơ bản bắt chước mọi thứ chúng thấy ở nhà. Hai cậu con trai của anh họ em là ví dụ điển hình: bố mẹ chúng không bao giờ to tiếng, và hai đứa là những đứa trẻ điềm tĩnh nhất em biết, trong khi thường ta nhận ra ngay một đứa trẻ lớn lên giữa nhiều tiếng quát tháo. Dù vậy, đó chưa phải toàn bộ câu chuyện. Khi trẻ bước vào tuổi thiếu niên, bạn bè và những gì chúng xem trên mạng có ảnh hưởng rất nhiều, và lúc đó ta không thể đổ hết cho bố mẹ. Nên nhìn chung, bố mẹ đặt nền móng, nhưng họ chịu trách nhiệm phần lớn chứ không phải hoàn toàn." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7", "Khác ở đâu"],
        rows: [
          ["FC — trôi chảy, mạch lạc", "Mở bằng Yes ⇒ lệch câu hỏi mức độ; ba ý rời nối bằng And / Also; kết bằng lời khuyên không ai hỏi", "Mức độ ngay câu đầu → ví dụ → That said → So on balance; mỗi câu phục vụ một bước", "Có ==bước ③ và ④==; discourse markers đúng vai (whereas, That said, by then, on balance)"],
          ["LR — từ vựng", "important ×2, behave badly, spend time — đúng nhưng chung chung", "copy whatever they see · raise their voices · have a lot to do with it · put it all down to · lay the foundations", "Cụm tự nhiên, ít gặp, dùng đúng collocation"],
          ["GRA — ngữ pháp", "Điều kiện loại 1 lặp hai lần; câu ngắn S + V + O", "whatever-clause (copy whatever they see · whatever they're watching online) · whereas · Once + S + V · mệnh đề danh ngữ when a child has grown up… · rather than", "Nhiều loại câu phức, không lỗi"],
          ["P — phát âm", "Nhấn đều mọi từ", "Nhấn tương phản: LARGELY responsible rather than ENTIRELY responsible; YOUNG ↔ TEENS", "Trọng âm mang nghĩa — mục 6"],
          ["Trả lời câu hỏi", "Không có từ mức độ nào", "to a large extent · at least while… · largely rather than entirely", "Người nghe biết chính xác “đến đâu”"],
        ],
        caption: "Cùng một quan điểm — band 7 hơn ở chỗ đặt mức, chống đỡ bằng một ví dụ kỹ, và tự giới hạn",
      },
      {
        t: "mcq",
        id: "t4d11-noi-chon",
        title: "Kiểm tra — câu hỏi mức độ (6 câu)",
        items: [
          {
            q: "Giám khảo hỏi: “How far do you think schools prepare young people for working life?” Câu mở nào trả lời đúng trọng tâm?",
            options: [
              "Yes, schools are very important for young people.",
              "Only up to a point, I think.",
              "There are advantages and disadvantages.",
              "In my country, students go to school for twelve years.",
            ],
            correct: 1,
            why: "How far…? hỏi mức độ ⇒ phải có cụm mức độ ngay đầu. A trả lời Yes / No; C lạc sang ưu – nhược; D kể sự việc.",
          },
          {
            q: "Cụm nào ĐÚNG?",
            options: ["in some extent", "to some extend", "to some extent", "at some extent"],
            correct: 2,
            why: "Giới từ to + danh từ extent. extend là động từ.",
          },
          {
            q: "“That said, it's not the whole story.” — câu này thuộc bước nào?",
            options: ["① Mức độ", "② Chống đỡ", "④ Chốt", "③ Giới hạn"],
            correct: 3,
            why: "That said mở phần nhượng bộ: vì sao KHÔNG hơn mức vừa nêu ⇒ bước ③.",
          },
          {
            q: "Bạn tin quảng cáo ảnh hưởng rất ít đến việc bạn mua gì. Cụm nào hợp nhất?",
            options: ["Only marginally, I'd say.", "By and large, yes.", "For the most part.", "Pretty much completely."],
            correct: 0,
            why: "only marginally = chỉ chút ít (bậc 2). Ba cụm còn lại là bậc 4–5.",
          },
          {
            q: "Cách chống đỡ nào là kiểu “hệ quả ngược lại”?",
            options: [
              "My cousin's boys are a good example.",
              "If you compare city children with rural children, …",
              "Without any rules at home, most children wouldn't learn self-control.",
              "The main reason is that children copy adults.",
            ],
            correct: 2,
            why: "Without… wouldn't… = nếu không có thì sẽ không (điều kiện loại 2 rút gọn). A là ví dụ; B là so sánh; D là nêu lý do.",
          },
          {
            q: "Câu chốt nào tốt nhất cho câu trả lời “to some extent”?",
            options: [
              "So parents should spend more time with their children.",
              "So that is my opinion about this question.",
              "So yes, totally.",
              "So it's a factor, but not the deciding one.",
            ],
            correct: 3,
            why: "Bước ④ nhắc lại MỨC (một yếu tố, không quyết định) — khớp với to some extent. A là lời khuyên lạc đề; B rỗng; C mâu thuẫn với mức đã nêu.",
          },
        ],
      },

      { t: "h", text: "5. Kho ý cho bốn chủ đề hay hỏi mức độ" },
      {
        t: "table",
        head: ["Câu hỏi", "Mức gợi ý", "Chống đỡ", "Giới hạn"],
        rows: [
          ["To what extent does a good education guarantee a good job?", "Less than it used to", "Degrees are so common now that employers look at **what you can actually do**", "Still opens doors: many firms won't interview you without one"],
          ["How much influence does advertising have on what people buy?", "A lot on **which brand**, little on **whether** we buy", "Nobody buys shampoo because of an advert — but the advert decides which bottle", "Price and friends' recommendations often matter more"],
          ["How far has technology changed the way families communicate?", "To a great extent", "Group chats mean relatives abroad are part of daily life; grandparents see the kids on video", "Hasn't changed **what** families talk about — and can prevent people from talking at dinner"],
          ["To what extent should governments be responsible for people's health?", "For the conditions, not the choices", "Clean air, safe food, affordable clinics — individuals can't provide those", "Whether someone exercises is down to them; you can't force people to be healthy"],
        ],
        caption: "Mỗi ô là ý, không phải câu để học thuộc — nói bằng lời của bạn",
      },
      {
        t: "examples",
        items: [
          { en: "Less than it used to, I think. A degree was once enough to enable someone to walk into a good job, but now that so many people have one, employers are more interested in what you can actually do.", vi: "Ít hơn trước đây, em nghĩ vậy. Tấm bằng từng đủ để giúp ai đó bước thẳng vào một công việc tốt, nhưng giờ nhiều người có bằng quá nên nhà tuyển dụng quan tâm hơn đến việc bạn thực sự làm được gì." },
          { en: "It affects which brand we pick far more than whether we buy at all — nobody buys shampoo because of an advert, but the advert may well decide which bottle ends up in the basket.", vi: "Nó ảnh hưởng đến việc ta chọn nhãn nào nhiều hơn hẳn việc ta có mua hay không — chẳng ai mua dầu gội vì quảng cáo, nhưng quảng cáo rất có thể quyết định chai nào nằm trong giỏ." },
        ],
      },

      { t: "h", text: "6. Phát âm: trọng âm tương phản — nhấn vào chỗ bạn đang phân biệt" },
      {
        t: "p",
        text: "Bình thường, trọng âm chính của câu rơi vào ==từ nội dung cuối cùng== (Tập 4 Ngày 2). Nhưng khi bạn **đối chiếu hai thứ** — largely chứ không entirely, which chứ không whether, young chứ không teenage — trọng âm chính ==dời sang đúng hai từ đang được đối chiếu==, kể cả khi đó là từ chức năng (some, can, not, they). Cao độ nhảy lên ở từ đó, từ được kéo dài hơn một chút, các từ còn lại nói nhanh và nhẹ. Câu trả lời mức độ luôn chứa đối chiếu, nên đây là đặc trưng phát âm “ăn điểm” nhất của bài hôm nay.",
      },
      {
        t: "table",
        head: ["Câu", "Nhấn ở đâu", "Nghĩa người nghe nhận được"],
        rows: [
          ["Parents are **LARGELY** responsible, not **ENTIRELY**.", "hai trạng từ mức độ", "phần lớn — nhưng chưa phải tất cả"],
          ["It affects **WHICH** brand we buy, not **WHETHER** we buy.", "hai từ để hỏi", "ảnh hưởng tới lựa chọn, không tới quyết định mua"],
          ["To **SOME** extent, yes.", "some (bình thường là từ yếu)", "chỉ một phần thôi — sắp có “but”"],
          ["Schools **CAN** help, but **PARENTS** matter more.", "can · parents", "trường có góp phần; bố mẹ mới chính"],
          ["It's a problem for **OLDER** workers, not **YOUNGER** ones.", "hai tính từ đối nhau", "nhóm này, không phải nhóm kia"],
        ],
        caption: "Quy tắc: thông tin MỚI hoặc ĐỐI CHIẾU thì nhấn; thông tin đã nói rồi (responsible, brand, workers) thì lướt",
      },
      {
        t: "note",
        title: "⚠️ Lỗi của người Việt + cách tập",
        items: [
          "Nhấn đều mọi từ (tiếng Việt mỗi âm tiết đều rõ) ⇒ người nghe không biết bạn đang đối chiếu gì. Tập: nói câu với **chỉ hai từ to**, phần còn lại thì thầm.",
          "Nhấn lại từ đã nói: “largely responsible, not entirely **RESPONSIBLE**” — sai chỗ. Từ lặp lại phải ==lướt==, hoặc bỏ hẳn (ellipsis): largely, not entirely.",
          "Khi nhấn **some** để đối chiếu, phát âm đủ /sʌm/, không phải dạng yếu /səm/. Tương tự **can** /kæn/ khi nhấn, /kən/ khi không.",
          "Thu âm một câu hai cách: nhấn LARGELY rồi nhấn PARENTS. Nghe lại — nghĩa có đổi không? Nếu không nghe ra khác, bạn chưa nhấn đủ.",
        ],
      },
      { t: "rule", formula: "Đối chiếu A với B ⇒ nhấn A và B, lướt phần lặp lại", vi: "Trọng âm tương phản: cao hơn, dài hơn ở đúng hai từ đang được phân biệt." },
      {
        t: "phatam",
        id: "t4d11-phat-am",
        title: "Luyện phát âm — trọng âm tương phản",
        note: "Mỗi câu có hai từ đối chiếu (ghi trong ngoặc ở phần nghĩa). Nói to, dài và cao hơn ở hai từ đó; lướt phần còn lại. Máy chấm từng từ — nếu từ lặp lại (responsible, extent, matter) bị kéo dài quá, bạn đang nhấn nhầm chỗ.",
        items: [
          { text: "Parents are largely responsible, but not entirely.", ipa: "peərənts ə lɑːdʒli rɪspɒnsəbl bət nɒt ɪntaɪəli", vi: "Bố mẹ chịu trách nhiệm phần lớn, nhưng không hoàn toàn. (nhấn: largely · entirely)" },
          { text: "It affects what we buy, not how much we buy.", ipa: "ɪt əfekts wɒt wi baɪ nɒt haʊ mʌtʃ wi baɪ", vi: "Nó ảnh hưởng tới việc ta mua gì, không phải ta mua bao nhiêu. (nhấn: what · how much)" },
          { text: "I said it was useful, not essential.", ipa: "aɪ sed ɪt wəz juːsfl nɒt ɪsenʃl", vi: "Tôi nói nó hữu ích, chứ không phải thiết yếu. (nhấn: useful · essential)" },
          { text: "Schools can teach discipline, but they can't enforce it at home.", ipa: "skuːlz kən tiːtʃ dɪsəplɪn bət ðeɪ kɑːnt ɪnfɔːs ɪt ət həʊm", vi: "Trường có thể dạy kỷ luật, nhưng không thể thực thi nó ở nhà. (nhấn: teach · enforce)" },
          { text: "It is a problem for older workers, not for younger ones.", ipa: "ɪt ɪz ə prɒbləm fər əʊldə wɜːkəz nɒt fə jʌŋɡə wʌnz", vi: "Đó là vấn đề với người lao động lớn tuổi, không phải với người trẻ. (nhấn: older · younger)" },
          { text: "To some extent, yes, but only to some extent.", ipa: "tə sʌm ɪkstent jes bət əʊnli tə sʌm ɪkstent", vi: "Ở một mức nào đó thì có, nhưng chỉ ở một mức nào đó thôi. (nhấn: some · only)" },
          { text: "Money matters, but it does not matter most.", ipa: "mʌni mætəz bət ɪt dʌz nɒt mætə məʊst", vi: "Tiền có quan trọng, nhưng không phải quan trọng nhất. (nhấn: matters · most)" },
          { text: "The government can encourage change, but it cannot force it.", ipa: "ðə ɡʌvənmənt kən ɪnkʌrɪdʒ tʃeɪndʒ bət ɪt kænɒt fɔːs ɪt", vi: "Chính phủ có thể khuyến khích thay đổi, nhưng không thể ép buộc. (nhấn: encourage · force)" },
        ],
      },

      { t: "h", text: "7. Luyện nói Part 3 — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi câu nói ==40–50 giây== theo khung 4 bước. Trước khi bấm ghi, viết ra giấy **một từ** cho mỗi bước (vd: large → cousin → teens/friends → largely). Sau khi AI chấm, nghe lại và tự đánh dấu: 5 giây đầu có cụm mức độ chưa? Có That said / Having said that chưa? Câu chốt có nhắc lại mức không?",
      },
      {
        t: "speak",
        id: "t4d11-noi-p3",
        part: "3",
        questions: [
          "To what extent does a good education guarantee a good job nowadays?",
          "How much influence does advertising have on what people buy?",
          "How far do you think technology has changed the way families communicate?",
          "To what extent should governments be responsible for people's health?",
        ],
      },
      {
        t: "speak",
        id: "t4d11-noi-p3-2",
        part: "3",
        questions: [
          "To what extent is a person's character formed by the place where they grow up?",
          "How important is it for a country to preserve its old buildings?",
          "Would you agree that success in life depends mostly on luck?",
          "How far can individuals, rather than governments, solve environmental problems?",
        ],
      },
      {
        t: "note",
        title: "📌 Tự chấm theo 4 tiêu chí sau mỗi lượt",
        items: [
          "**FC**: đủ 4 bước? Có đoạn nào ngắt quá 2 giây để tìm ngữ pháp (không phải tìm ý)?",
          "**LR**: dùng ít nhất 2 cụm trong bảng mục 2–3 (be largely down to · put it all down to · play a part in · on balance)?",
          "**GRA**: có ít nhất 1 mệnh đề danh ngữ sau giới từ (depends on whether / how much…) và 1 khuôn động từ đúng (enable sb to · prevent sb from)?",
          "**P**: nghe lại — hai từ đối chiếu có nổi lên không?",
          "Chép câu trả lời hay nhất vào sổ Speaking (Tập 3 Ngày 2). Ngày mai tự hỏi lại đúng câu đó, không nhìn sổ.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 11 ═══════════════════════════ */
  {
    id: "t4d11-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 11 — mệnh đề danh ngữ · khuôn động từ · Note completion · câu hỏi mức độ · trọng âm tương phản",
    goal: "Tự kiểm 50 câu trộn cả ngày: chọn và viết đúng mệnh đề danh ngữ và 7 khuôn động từ trong câu dài, điền ghi chú ONE WORD ONLY từ một bài đọc ngắn, chọn đúng cụm mức độ, nhận ra trọng âm tương phản — rồi nói 2 câu Part 3.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Cách làm",
        items: [
          "Làm một mạch **50 câu** (khoảng 50 phút), không mở lại bài học. Xong mới xem đáp án.",
          "Đúng **≥ 40/50**: sang Ngày 12. **32–39**: xem phần sai nhiều nhất và làm lại riêng phần đó sau 2 ngày. **< 32**: học lại bài Ngữ pháp mục 4–6.",
          "Câu viết lại (phần III) gõ ==cả câu==, có dấu chấm cuối câu.",
          "Mỗi câu sai: chép động từ / cụm đó vào sổ khuôn cá nhân (bài Ngữ pháp mục 9).",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 11 trong một hình",
        center: "Câu dài không lỗi",
        branches: [
          { label: "Mệnh đề danh ngữ", items: ["the fact / claim that + S + V", "giới từ + whether / how…", "Whether… + V số ít", "suggest that S (should) V"] },
          { label: "7 khuôn động từ", items: ["enable sb to V", "make sb V · be made to V", "prevent sb from V-ing", "succeed in V-ing", "to (giới từ) + V-ing"] },
          { label: "Dạng nâng cao", items: ["to be V3 · being V3", "to have (been) V3", "having V3"] },
          { label: "Đọc: Note completion", items: ["ONE WORD ONLY", "chép nguyên dạng", "mồi cùng loại từ", "paraphrase danh hoá"] },
          { label: "Nói: mức độ", items: ["thang 5 bậc", "Mức → Chống đỡ → Giới hạn → Chốt", "nhấn tương phản"] },
        ],
      },

      { t: "h", text: "I. Chọn phương án đúng (8 câu) — ôn Ngữ pháp mục 2–7" },
      {
        t: "mcq",
        id: "t4d11-bt-chon",
        title: "I. Chọn phương án đúng",
        items: [
          { q: "The idea ____ people are naturally lazy is not supported by research.", options: ["which", "that", "what", "of"], correct: 1, why: "the idea + that + câu đủ (đồng vị)." },
          { q: "Opinions differ as to ____ the tax should be raised.", options: ["that", "if or not", "whether", "what"], correct: 2, why: "Sau giới từ (as to): whether. if or not không tồn tại." },
          { q: "The minister proposed that the age limit ____ to eighteen.", options: ["be raised", "is raised", "raising", "to be raised"], correct: 0, why: "propose + that + S + (should) + V nguyên mẫu; bị động: be raised." },
          { q: "Cheap credit has led many households ____ more than they can repay.", options: ["borrowing", "to borrowing", "borrow", "to borrow"], correct: 3, why: "lead + O (người) + to V." },
          { q: "Cheap credit has led ____ a sharp rise in household debt.", options: ["to", "for", "in", "at"], correct: 0, why: "lead to + N (to là giới từ)." },
          { q: "Many employees resent ____ to answer emails at weekends.", options: ["to expect", "being expected", "expecting", "to be expecting"], correct: 1, why: "resent + V-ing; nhân viên “bị yêu cầu” ⇒ being expected." },
          { q: "The tomb is thought ____ in the fourth century BC.", options: ["to seal", "sealing", "to have been sealed", "that was sealed"], correct: 2, why: "Trước thời điểm nói + bị động ⇒ to have been sealed." },
          { q: "____ surprised the researchers was how quickly the forest recovered.", options: ["That", "It", "Which", "What"], correct: 3, why: "surprised thiếu chủ ngữ ⇒ What. (It surprised the researchers how… cũng đúng, nhưng khi đó không có was phía sau.)" },
        ],
      },

      { t: "h", text: "II. Viết dạng đúng của động từ — thêm giới từ nếu cần (10 câu) — ôn mục 5–7" },
      {
        t: "quiz",
        id: "t4d11-bt-dang",
        kind: "fill",
        title: "II. Viết dạng đúng của động từ trong ngoặc",
        items: [
          { q: "Flexible hours allow parents (collect) ____ their children from school.", answers: ["to collect"], hint: "allow + O + to V" },
          { q: "Many graduates end up (work) ____ in fields unrelated to their degree.", answers: ["working"], hint: "end up + V-ing" },
          { q: "The new barrier is designed to stop floodwater (reach) ____ the old town.", answers: ["from reaching", "reaching"], hint: "stop + O + (from) V-ing" },
          { q: "Most pupils were made (repeat) ____ the test.", answers: ["to repeat"], hint: "be made to V" },
          { q: "The charity is dedicated to (protect) ____ endangered languages.", answers: ["protecting"], hint: "be dedicated to + V-ing" },
          { q: "Several witnesses admitted (see) ____ the documents before the meeting.", answers: ["seeing", "having seen", "to seeing", "to having seen"], hint: "admit + V-ing / having V3" },
          { q: "The bridge needs (repair) ____ before winter. (cần được sửa)", answers: ["repairing", "to be repaired"], hint: "need + V-ing = need to be V3" },
          { q: "Poor lighting discourages people (walk) ____ home after dark.", answers: ["from walking"], hint: "discourage + O + from V-ing" },
          { q: "The firm claims (cut) ____ its water use by forty per cent last year.", answers: ["to have cut"], hint: "claim + to have V3 (đã, năm ngoái)" },
          { q: "I regret (inform) ____ you that your application has been unsuccessful. (lấy làm tiếc phải báo)", answers: ["to inform"], hint: "regret + to V = tiếc phải (sắp nói tin xấu)" },
        ],
      },

      { t: "h", text: "III. Viết lại câu (6 câu) — ôn mục 2–5" },
      {
        t: "quiz",
        id: "t4d11-bt-viet-lai",
        kind: "fill",
        title: "III. Gõ CẢ câu, bắt đầu bằng từ cho sẵn",
        items: [
          { q: "Many people cannot afford a car. This explains the popularity of motorbikes. → The fact …", answers: ["The fact that many people cannot afford a car explains the popularity of motorbikes.", "The fact that many people can't afford a car explains the popularity of motorbikes."], hint: "The fact that + S + V + explains…" },
          { q: "Should the museum charge for entry? The answer depends on its funding. → Whether …", answers: ["Whether the museum should charge for entry depends on its funding."], hint: "Whether + S + should V + depends on…" },
          { q: "“Why don't you reduce class sizes?” the inspector said to the school. → The inspector suggested that the school …", answers: ["The inspector suggested that the school reduce class sizes.", "The inspector suggested that the school should reduce class sizes."], hint: "suggest that + S + (should) + V" },
          { q: "Because of the noise, I couldn't concentrate. → The noise prevented …", answers: ["The noise prevented me from concentrating."], hint: "prevent + O + from V-ing" },
          { q: "It is said that the castle was destroyed by fire. → The castle is said …", answers: ["The castle is said to have been destroyed by fire."], hint: "is said + to have been V3" },
          { q: "The company wants to attract younger customers, so it redesigned its logo. → The company redesigned its logo with a view …", answers: ["The company redesigned its logo with a view to attracting younger customers."], hint: "with a view to + V-ing" },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d11-bt-dich",
        kind: "translate",
        title: "IV. Dịch — dùng cấu trúc trong gợi ý",
        grammar: "the fact that · depend on whether · recommend that · be committed to V-ing · seem to have V3",
        items: [
          { q: "Việc mọi người sống lâu hơn gây áp lực lên hệ thống y tế.", answers: ["The fact that people are living longer puts pressure on the health system.", "The fact that people live longer puts pressure on the health system.", "The fact that people are living longer puts pressure on the healthcare system.", "The fact that people are living longer is putting pressure on the health system.", "The fact that people live longer puts pressure on the healthcare system."], hint: "The fact that… puts pressure on…" },
          { q: "Tất cả phụ thuộc vào việc các công ty có sẵn sàng đầu tư hay không.", answers: ["It all depends on whether companies are willing to invest.", "Everything depends on whether companies are willing to invest.", "It all depends on whether or not companies are willing to invest.", "It all depends on whether firms are willing to invest.", "Everything depends on whether or not companies are willing to invest."], hint: "depends on whether + S + V" },
          { q: "Báo cáo khuyến nghị rằng luật này được thay đổi.", answers: ["The report recommends that this law be changed.", "The report recommends that the law be changed.", "The report recommends that this law should be changed.", "The report recommends that the law should be changed.", "The report recommended that this law be changed.", "The report recommended that the law be changed."], hint: "recommend that + S + (should) be V3" },
          { q: "Thành phố cam kết cải thiện giao thông công cộng.", answers: ["The city is committed to improving public transport.", "The city is committed to improving its public transport."], hint: "be committed to + V-ing" },
          { q: "Vấn đề dường như đã được giải quyết.", answers: ["The problem seems to have been solved.", "The problem appears to have been solved.", "The problem seems to have been resolved.", "The problem appears to have been resolved.", "The issue seems to have been resolved."], hint: "seem + to have been V3" },
        ],
      },

      { t: "h", text: "V. Đọc — Note completion + Yes / No / Not Given (7 câu, 8 phút) — ôn bài Đọc mục 3–5" },
      {
        t: "passage",
        title: "One Sheet, Many Sizes",
        paras: [
          {
            text: "Most of the world prints its documents on paper whose shape was fixed by a single idea. In 1786 the German scientist Georg Lichtenberg observed that a sheet whose long side is about 1.41 times its short side has a useful property: cut it in half, and each piece keeps exactly the same proportions as the original. For more than a century the observation remained a curiosity, while printers went on using dozens of local sizes that had grown up by habit. It was an engineer, Walter Porstmann, who turned it into a system.",
          },
          {
            text: "His standard, published in Germany in 1922, began with a sheet measuring one square metre and obtained every smaller size by repeated halving, so that a poster could be reduced to a leaflet without redrawing the design. Offices adopted the system quickly, having discovered that files, envelopes and, later, copying machines could all be made to match. By the 1970s it had been accepted as an international standard. The United States and Canada, however, kept their own slightly wider sheet. Whether they have lost much by doing so is doubtful: the inconvenience is felt mainly by firms that trade abroad. What the story shows is that a good standard spreads not because it is imposed but because each new user makes it more useful to the next.",
          },
        ],
      },
      {
        t: "table",
        head: ["Standard paper sizes — notes"],
        rows: [
          ["Lichtenberg's observation: a sheet cut in two keeps the same **1** ___"],
          ["Before 1922: many local sizes, which had developed through **2** ___"],
          ["Porstmann's system: largest sheet has an area of one square **3** ___"],
          ["Smaller sizes produced by repeated **4** ___"],
          ["North America's different size: a problem mostly for **5** ___ trading internationally"],
        ],
        caption: "Complete the notes. Choose ONE WORD ONLY from the passage for each answer.",
      },
      {
        t: "quiz",
        id: "t4d11-bt-doc-note",
        kind: "fill",
        title: "V. Questions 1–5 — ONE WORD ONLY",
        items: [
          { q: "1. a sheet cut in two keeps the same ____", answers: ["proportions"], hint: "each piece keeps exactly the same proportions — chép đúng số nhiều; mồi: property, side" },
          { q: "2. local sizes, which had developed through ____", answers: ["habit"], hint: "had grown up by habit → developed through habit; mồi: curiosity (nói về nhận xét của Lichtenberg)" },
          { q: "3. largest sheet has an area of one square ____", answers: ["metre"], hint: "a sheet measuring one square metre → has an area of" },
          { q: "4. smaller sizes produced by repeated ____", answers: ["halving"], hint: "obtained every smaller size by repeated halving → produced by; mồi: redrawing (bị phủ định: without redrawing)" },
          { q: "5. a problem mostly for ____ trading internationally", answers: ["firms"], hint: "felt mainly by firms that trade abroad → mostly for firms trading internationally; mồi: offices" },
        ],
      },
      {
        t: "mcq",
        id: "t4d11-bt-doc-ynng",
        title: "V. Questions 6–7 — Yes / No / Not Given",
        items: [
          { q: "6. Offices found that the new system brought practical advantages.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Offices adopted the system quickly, having discovered that files, envelopes and… copying machines could all be made to match ⇒ YES. (having discovered = dạng V-ing hoàn thành, bài Ngữ pháp mục 7.)" },
          { q: "7. The writer is convinced that the United States has suffered badly from keeping its own paper size.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Whether they have lost much by doing so is doubtful ⇒ tác giả nghi ngờ là thiệt nhiều, trái với “is convinced… suffered badly” ⇒ NO. Mệnh đề Whether làm chủ ngữ + by doing so (thay thế cụm động từ)." },
        ],
      },

      { t: "h", text: "VI. Câu hỏi mức độ (10 câu) — ôn bài Nói mục 2–4" },
      {
        t: "quiz",
        id: "t4d11-bt-muc-do",
        kind: "fill",
        title: "VI-a. Điền MỘT từ vào mỗi chỗ trống (6 câu)",
        items: [
          { q: "____ a large extent, I'd say, yes.", answers: ["To"], hint: "giới từ đi với extent" },
          { q: "Only up to a ____ , I think — schools can't teach everything.", answers: ["point"], hint: "up to a point = đến một mức nào đó" },
          { q: "A child's confidence is largely ____ to the encouragement they get at home.", answers: ["down"], hint: "be down to = là do" },
          { q: "Friends play a major ____ in shaping teenagers' tastes.", answers: ["part", "role"], hint: "play a part / role in" },
          { q: "That ____ , it's not the whole story.", answers: ["said"], hint: "That said, … = dù vậy" },
          { q: "You can't put it all ____ to the parents.", answers: ["down"], hint: "put sth down to = quy cho" },
        ],
      },
      {
        t: "mcq",
        id: "t4d11-bt-muc-do-chon",
        title: "VI-b. Chọn cách nói hợp nhất (4 câu)",
        items: [
          {
            q: "“To what extent do celebrities influence young people?” — bạn tin là rất nhiều. Mở câu:",
            options: ["Hardly at all, in my view.", "Yes, I think so.", "To a great extent, I'd say.", "It is a good question."],
            correct: 2,
            why: "Cụm bậc 4 đặt mức ngay câu đầu. A ngược nghĩa; B không có mức; D chỉ mua thời gian.",
          },
          {
            q: "Sau khi nêu ví dụ, bạn muốn nói “nhưng còn yếu tố khác”. Chọn:",
            options: ["Having said that, family background also has a lot to do with it.", "So on balance, celebrities matter.", "Take my sister, for instance.", "To a great extent."],
            correct: 0,
            why: "Having said that mở bước ③ Giới hạn. B là bước ④; C là bước ②; D là bước ①.",
          },
          {
            q: "Câu nào dùng mệnh đề danh ngữ ĐÚNG?",
            options: [
              "It depends on how old is the child.",
              "It depends on that the child is old enough.",
              "It depends if the child is old enough or not on.",
              "It depends on how old the child is.",
            ],
            correct: 3,
            why: "on + how old + S + V, không đảo. A đảo is; B that sau giới từ; C sai trật tự.",
          },
          {
            q: "Câu chốt nào khớp với mức “only to a limited extent”?",
            options: [
              "So they are almost entirely responsible.",
              "So it makes a small difference, but nothing more than that.",
              "So for the most part, yes.",
              "So it is the deciding factor.",
            ],
            correct: 1,
            why: "a small difference, nothing more = mức hạn chế. Ba câu còn lại là bậc 4–5, mâu thuẫn với mức đã nêu.",
          },
        ],
      },

      { t: "h", text: "VII. Trọng âm tương phản (4 câu) — ôn bài Nói mục 6" },
      {
        t: "mcq",
        id: "t4d11-bt-trong-am",
        title: "VII. Hai từ nào được nhấn mạnh nhất?",
        items: [
          { q: "“Advertising changes which brand we choose, not whether we buy.”", options: ["advertising · buy", "changes · choose", "which · whether", "brand · not"], correct: 2, why: "Hai từ đang đối chiếu: which ↔ whether." },
          { q: "“Teachers can guide students, but they can't learn for them.”", options: ["guide · learn", "teachers · students", "can · them", "but · for"], correct: 0, why: "Đối chiếu hai hành động: guide ↔ learn." },
          { q: "“It's partly the school's fault, not wholly the school's fault.”", options: ["school's · school's", "partly · wholly", "fault · fault", "it's · not"], correct: 1, why: "partly ↔ wholly; phần lặp lại (the school's fault) lướt." },
          { q: "A: “So money is the main reason?” — B: “It's A reason, not THE reason.” B nhấn vào đâu?", options: ["reason · reason", "it's · not", "money · main", "a · the"], correct: 3, why: "Đối chiếu hai mạo từ: a (một trong nhiều) ↔ the (duy nhất). Khi nhấn, a đọc /eɪ/ và the đọc /ðiː/." },
        ],
      },

      { t: "h", text: "VIII. Nói 2 câu Part 3 mức độ — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi câu 40–50 giây, đủ 4 bước. Yêu cầu thêm: câu 1 dùng **depends on whether / how much…**; câu 2 dùng một khuôn **enable / prevent / encourage + O + …** và một cặp nhấn tương phản.",
      },
      {
        t: "speak",
        id: "t4d11-bt-noi",
        part: "3",
        questions: [
          "To what extent do you think people's happiness depends on how much they earn?",
          "How far should parents control what their children do online?",
        ],
      },
      {
        t: "note",
        title: "📌 Xong Ngày 11",
        items: [
          "Ghi điểm 50 câu vào sổ tiến độ. Phần sai nhiều nhất là phần mở lại đầu tiên ở bài kiểm tra chặng (Ngày 12).",
          "Ngày mai (Ngày 12): ngôn ngữ Task 1 band 7 — nhóm số liệu, ngoại lệ, tỉ lệ · cohesion band 7 · nghe Part 3 Flow-chart · **kiểm tra chặng Ngày 7–12**.",
        ],
      },
    ],
  },
];
