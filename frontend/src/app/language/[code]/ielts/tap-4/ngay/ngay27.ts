/**
 * IELTS Tập 4 — Ngày 27 (6.0 → 7.0)
 * Bài 1 Ngữ pháp: Subjunctive & cấu trúc trang trọng; fronting [G42]
 * Bài 2 Đọc: Reading đủ 3 passage · 40 câu · 60 phút — lần 3 (Passage 3 ≥ 9/13) [R20]
 * Bài 3 Nói: Full test 14 phút tự thu, tự chấm 4 tiêu chí [S17] · 🔊 tự chẩn 44 âm
 * Mọi bài đọc, câu ví dụ, câu hỏi đều TỰ SOẠN.
 */
import type { Lesson } from '../data';

export const NGAY_27: Lesson[] = [
  /* ═══════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════ */
  {
    id: "t4d27-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Subjunctive (thức giả định) & cấu trúc trang trọng; fronting — đưa thành phần lên đầu câu",
    goal: "Viết đúng câu giả định sau động từ / tính từ / danh từ chỉ yêu cầu – đề xuất (It is essential that every child be taught…), dùng đúng quá khứ không thật (It is high time · would rather · as if), cụm cố định (be that as it may), lest, as do / so too, và đưa được một thành phần lên đầu câu (Equally important is… · At the heart of the debate lies… · Important as it is,…) — đúng chỗ, đúng liều trong Task 2 và Part 3.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "**Subjunctive (thức giả định)** = động từ ở dạng **nguyên mẫu không to** cho MỌI ngôi sau lời yêu cầu / đề xuất: It is essential that he ==be== told · They demand that she ==resign==.",
          "Phủ định đặt **not trước động từ**, không dùng do / does: …that the data ==not be== shared.",
          "**Quá khứ không thật**: It is high time + S + ==V2== · would rather + S + ==V2== · as if / as though + S + ==were==.",
          "**Fronting** = đưa một thành phần lên đầu câu để nối với câu trước hoặc để nhấn: ==Equally important is== the cost · ==At the heart of the debate lies== a simple question.",
          "Đây là ngữ pháp **liều thấp**: mỗi bài Task 2 dùng 1–2 lần là đủ để giám khảo thấy “đa dạng cấu trúc”; dùng dày là lộ ý khoe.",
          "Nối tiếp **Ngày 7** (đảo ngữ, So / Neither + trợ động từ) và **Ngày 19** (Were it not for…).",
        ],
      },

      { t: "h", text: "1. Ôn nhanh — bạn đã có gì, hôm nay thêm gì" },
      {
        t: "table",
        head: ["Đã học", "Ở đâu", "Hôm nay thêm"],
        rows: [
          ["Đảo ngữ sau từ phủ định: **Rarely do** governments…", "Tập 4 Ngày 7 mục 6", "đảo cả động từ chính sau cụm chỉ nơi chốn: **At the centre stands**…"],
          ["So / Such… that đầu câu; Nor / Neither / So + trợ động từ + S", "Tập 4 Ngày 7 mục 8", "**as do** / **as did** + S · **so too** + trợ động từ + S"],
          ["Đảo ngữ thay if: Had / Were / Should; **Were it not for**", "Tập 4 Ngày 7 mục 7 · Ngày 19 mục 5–6", "các cấu trúc “không thật” khác: It is high time · would rather · as if"],
          ["suggest / recommend + V-ing; suggest that S + should + V", "Tập 2 Ngày 11 · Tập 3 Ngày 19", "bỏ should, giữ nguyên mẫu: recommend that he **take**… (subjunctive)"],
        ],
      },
      { t: "p", text: "Điểm chung của mọi cấu trúc hôm nay: chúng là dấu hiệu của văn **trang trọng**. Giám khảo chấm GRA band 7 cần thấy “a variety of complex structures” với “frequent error-free sentences”. Một câu giả định viết đúng đáng giá hơn ba câu đảo ngữ viết sai." },

      { t: "h", text: "2. Mandative subjunctive — giả định sau lời yêu cầu, đề xuất, sự cần thiết" },
      { t: "p", text: "**Mandative** nghĩa là “mang tính yêu cầu”. Khi mệnh đề chính nói rằng một việc **cần / nên / phải** xảy ra, động từ trong mệnh đề **that** giữ ==dạng nguyên mẫu không to== — không thêm -s, không chia thì, kể cả khi câu ở quá khứ." },
      {
        t: "patterns",
        rows: [
          {
            formula: "It is + essential / vital / crucial / imperative / important / necessary / desirable + that + S + V (nguyên mẫu)",
            vi: "Tính từ chỉ sự cần thiết. Dùng nhiều nhất trong Task 2 khi nêu giải pháp.",
            examples: [
              { en: "It is essential that every child be taught how to assess online sources.", vi: "Điều thiết yếu là mọi đứa trẻ phải được dạy cách đánh giá nguồn tin trên mạng." },
              { en: "It is vital that the government act before the damage becomes irreversible.", vi: "Điều sống còn là chính phủ phải hành động trước khi thiệt hại không thể đảo ngược." },
            ],
          },
          {
            formula: "S + demand / insist / recommend / suggest / propose / request / require / urge / ask + that + S + V (nguyên mẫu)",
            vi: "Động từ chỉ yêu cầu, đề xuất. Động từ chính ở thì nào thì V sau that vẫn nguyên mẫu.",
            examples: [
              { en: "The report recommends that each school appoint a full-time counsellor.", vi: "Bản báo cáo khuyến nghị mỗi trường bổ nhiệm một chuyên viên tư vấn toàn thời gian." },
              { en: "Residents demanded that the factory be closed.", vi: "Người dân đòi đóng cửa nhà máy." },
            ],
          },
          {
            formula: "the + recommendation / proposal / requirement / demand / suggestion / insistence + that + S + V (nguyên mẫu)",
            vi: "Danh từ cùng họ cũng kéo theo giả định — hợp với văn danh hoá (Ngày 21).",
            examples: [
              { en: "The proposal that drivers pay to enter the city centre met strong opposition.", vi: "Đề xuất buộc tài xế trả phí để vào trung tâm thành phố vấp phải phản đối mạnh." },
            ],
          },
          {
            formula: "… that + S + not + V (nguyên mẫu)  ·  … that + S + be + V3",
            vi: "Phủ định: not đứng TRƯỚC động từ, không mượn do. Bị động: be + V3.",
            examples: [
              { en: "Doctors advise that patients not drive for 24 hours after the operation.", vi: "Bác sĩ khuyên bệnh nhân không lái xe trong 24 giờ sau ca mổ." },
              { en: "The law requires that all personal data be stored securely.", vi: "Luật yêu cầu mọi dữ liệu cá nhân phải được lưu trữ an toàn." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Ba cách viết cùng một ý", "Văn phong", "Dùng trong bài thi"],
        rows: [
          ["They recommend that every student **take** a first-aid course.", "giả định — trang trọng, rất phổ biến trong tiếng Anh Mỹ và văn học thuật", "Task 2, thư trang trọng ✔"],
          ["They recommend that every student **should take** a first-aid course.", "should + V — trang trọng, phổ biến trong tiếng Anh Anh", "Task 2 ✔ (an toàn nhất nếu bạn sợ quên)"],
          ["They recommend that every student **takes** a first-aid course.", "chia thì bình thường — chỉ gặp trong tiếng Anh Anh thân mật", "tránh trong bài viết"],
        ],
        caption: "Cả hai dòng đầu đều đúng. Chọn MỘT kiểu và giữ nhất quán trong cả bài.",
      },
      {
        t: "note",
        title: "⚠️ Bốn chỗ người Việt hay sai",
        items: [
          "~~It is essential that he **is** informed.~~ → that he ==be== informed. Sau tính từ chỉ sự cần thiết, **be** giữ nguyên cho mọi ngôi.",
          "~~They suggested me **to change** the topic.~~ → They suggested ==that I change== the topic / They suggested ==changing== the topic. **suggest** không đi với tân ngữ + to V (recommend, propose, demand, insist cũng vậy).",
          "~~…that students **don't use** phones.~~ → that students ==not use== phones. Giả định phủ định không có do / does / did.",
          "**insist that** có HAI nghĩa: He insists that she **be** present (đòi cô ấy phải có mặt — giả định) ≠ He insists that she **was** present (khăng khăng rằng cô ấy đã có mặt — sự thật, chia thì bình thường). **suggest that** cũng thế: The data suggest that prices **are** rising (cho thấy).",
        ],
      },
      { t: "rule", formula: "It is essential / S + recommend + that + S + (not) + V nguyên mẫu / be + V3", vi: "Sau lời yêu cầu – đề xuất – sự cần thiết: động từ nguyên mẫu cho mọi ngôi, mọi thì; hoặc dùng should + V." },
      {
        t: "quiz", id: "t4d27-gd-dich", kind: "translate", title: "Dịch Việt → Anh (4 câu) — mandative subjunctive",
        grammar: "It is + adj + that + S + V nguyên mẫu · S + recommend / insist / demand + that + S + (not) + V nguyên mẫu",
        items: [
          { q: "Điều thiết yếu là mọi nhân viên phải được đào tạo về an toàn dữ liệu.", answers: ["It is essential that every employee be trained in data security.", "It is essential that all employees be trained in data security.", "It is essential that every employee should be trained in data security."], hint: "essential · be trained in · data security" },
          { q: "Uỷ ban đề xuất rằng độ tuổi nghỉ hưu được nâng lên 67.", answers: ["The committee proposed that the retirement age be raised to 67.", "The committee proposes that the retirement age be raised to 67.", "The committee proposed that the retirement age should be raised to 67."], hint: "propose · retirement age · be raised" },
          { q: "Nhiều phụ huynh khăng khăng đòi nhà trường không giao bài tập về nhà vào cuối tuần.", answers: ["Many parents insist that the school not set homework at weekends.", "Many parents insist that the school not give homework at weekends.", "Many parents insist that the school should not set homework at weekends.", "Many parents insist that schools not set homework at weekends."], hint: "insist · not set homework · at weekends" },
          { q: "Bản báo cáo khuyến nghị rằng mỗi thành phố xây dựng một kế hoạch ứng phó nắng nóng.", answers: ["The report recommends that every city develop a heatwave plan.", "The report recommends that each city develop a heatwave plan.", "The report recommends that every city should develop a heatwave plan.", "The report recommends that each city draw up a heatwave plan."], hint: "recommend · each city · develop · heatwave plan" },
        ],
      },
      {
        t: "quiz", id: "t4d27-gd-dien", kind: "fill", title: "Chia động từ trong ngoặc (8 câu) — có câu KHÔNG phải giả định",
        items: [
          { q: "1. It is crucial that the evidence ___ (examine) by an independent body.", answers: ["be examined", "should be examined"], hint: "bị động của giả định: be + V3" },
          { q: "2. The union demanded that the company ___ (reinstate) the dismissed workers.", answers: ["reinstate", "should reinstate"], hint: "demanded ở quá khứ nhưng V sau that vẫn nguyên mẫu" },
          { q: "3. Recent figures suggest that the birth rate ___ (fall) faster than expected.", answers: ["is falling", "has fallen", "has been falling"], hint: "suggest = cho thấy ⇒ sự thật ⇒ chia thì bình thường" },
          { q: "4. The guidelines require that a patient ___ (not / leave) alone during the procedure.", answers: ["not be left", "should not be left"], hint: "phủ định + bị động: not be + V3" },
          { q: "5. She insisted that she ___ (lock) the door before leaving, but nobody believed her.", answers: ["had locked"], hint: "insist = khăng khăng một sự thật trong quá khứ ⇒ quá khứ hoàn thành" },
          { q: "6. It is desirable that every applicant ___ (have) some experience of teamwork.", answers: ["have", "should have"], hint: "every applicant + have (không phải has)" },
          { q: "7. The council's insistence that the market ___ (move) to the edge of town angered traders.", answers: ["be moved", "move", "should be moved", "should move"], hint: "danh từ insistence + that + giả định" },
          { q: "8. Critics propose that the tax ___ (replace) by a charge based on distance travelled.", answers: ["be replaced", "should be replaced"], hint: "be + V3" },
        ],
      },

      { t: "h", text: "3. Quá khứ không thật và các cụm giả định cố định" },
      { t: "p", text: "Nhóm thứ hai dùng **dạng quá khứ** để nói một điều **không thật ở hiện tại** — cùng logic với câu điều kiện loại 2. Với **be**, văn trang trọng dùng ==were== cho mọi ngôi." },
      {
        t: "patterns",
        rows: [
          {
            formula: "It is (high / about) time + S + V2",
            vi: "“Đã đến lúc (lẽ ra phải làm rồi)” — phê phán nhẹ sự chậm trễ. Hợp câu kết Task 2.",
            examples: [
              { en: "It is high time governments treated loneliness as a public health issue.", vi: "Đã đến lúc các chính phủ coi sự cô đơn là một vấn đề sức khoẻ cộng đồng." },
            ],
          },
          {
            formula: "S + would rather / would sooner + S + V2",
            vi: "Muốn NGƯỜI KHÁC làm gì (hai chủ ngữ khác nhau). Cùng chủ ngữ: would rather + V.",
            examples: [
              { en: "Most parents would rather their children spent less time on screens.", vi: "Đa số phụ huynh muốn con mình bớt thời gian trước màn hình." },
              { en: "I'd rather you didn't mention it to anyone.", vi: "Tôi muốn bạn đừng nói chuyện đó với ai." },
            ],
          },
          {
            formula: "S + V + as if / as though + S + V2 / were",
            vi: "“Như thể” — điều không đúng sự thật. Nếu có thể đúng thật, dùng thì bình thường.",
            examples: [
              { en: "Some firms behave as if natural resources were unlimited.", vi: "Một số công ty hành xử như thể tài nguyên thiên nhiên là vô hạn." },
              { en: "Advertisers speak as though happiness could be bought.", vi: "Giới quảng cáo nói như thể hạnh phúc mua được bằng tiền." },
            ],
          },
          {
            formula: "Suppose / Supposing / What if + S + V2 … ?  ·  If only / I wish + S + V2 / had + V3",
            vi: "Đặt giả thiết (Part 3) · tiếc nuối (hiện tại: V2; quá khứ: had + V3).",
            examples: [
              { en: "Suppose every commuter cycled to work — how much cleaner would the air be?", vi: "Giả sử mọi người đi làm đều đạp xe — không khí sẽ sạch hơn bao nhiêu?" },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Cụm cố định", "Nghĩa", "Dùng ở đâu", "Ví dụ"],
        rows: [
          ["**Be that as it may,**", "dù thế đi nữa (nhượng bộ rồi phản bác)", "Viết · Nói trang trọng", "The scheme is expensive. **Be that as it may**, doing nothing would cost more."],
          ["**Suffice it to say (that)**", "chỉ cần nói rằng", "Viết · Nói", "**Suffice it to say** that the results were disappointing."],
          ["**if need be**", "nếu cần", "Nói · Viết", "Classes could, **if need be**, be held online."],
          ["**as it were**", "có thể nói như vậy (rào cho một cách ví von)", "Nói Part 3", "Social media has become, **as it were**, the new town square."],
          ["**come what may**", "dù có chuyện gì xảy ra", "Nói · văn kể", "She was determined to finish the degree, **come what may**."],
          ["**so be it**", "thì đành vậy", "Nói", "If that means paying more tax, **so be it**."],
          ["**far be it from me to…**", "tôi đâu dám… (rồi vẫn nói)", "Nói", "**Far be it from me to** criticise teachers, but homework has got out of hand."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Hay sai: thì sau It is time và would rather",
        items: [
          "~~It is time the government **takes** action.~~ → ==took== action. Hoặc đổi sang It is time **for** the government **to take** action (trung tính, không hàm ý chê).",
          "~~I would rather you **don't** smoke here.~~ → you ==didn't== smoke. Nói về quá khứ: I'd rather you ==hadn't told== him.",
          "~~He talks as if he **is** the manager~~ (khi anh ta KHÔNG phải) → as if he ==were== the manager. Trong bài viết dùng **were**, không dùng was.",
          "Các cụm cố định **không đổi dạng**: không viết ~~be it as that may~~, ~~suffice to say it~~, ~~as it was~~ (với nghĩa này).",
        ],
      },
      { t: "rule", formula: "It is high time + S + V2  ·  S + would rather + S + V2  ·  as if + S + were", vi: "Dạng quá khứ = điều không thật ở hiện tại; be → were cho mọi ngôi." },
      {
        t: "quiz", id: "t4d27-kt-dich", kind: "translate", title: "Dịch Việt → Anh (4 câu) — quá khứ không thật · cụm cố định",
        grammar: "It is high time + S + V2 · would rather + S + V2 · as if + S + were · Be that as it may,",
        items: [
          { q: "Đã đến lúc các trường đại học coi trọng kỹ năng thực hành hơn.", answers: ["It is high time universities took practical skills more seriously.", "It is high time that universities took practical skills more seriously.", "It is time universities took practical skills more seriously.", "It is high time universities valued practical skills more."], hint: "It is high time · take sth seriously" },
          { q: "Nhiều người lớn tuổi muốn con cái họ sống gần họ hơn.", answers: ["Many elderly people would rather their children lived closer to them.", "Many older people would rather their children lived closer to them.", "Many elderly people would rather their children lived nearer to them.", "Many older people would rather their children lived nearer."], hint: "would rather + their children + V2" },
          { q: "Một số người tiêu tiền như thể không có ngày mai.", answers: ["Some people spend money as if there were no tomorrow.", "Some people spend money as though there were no tomorrow."], hint: "as if · there were" },
          { q: "Xe điện đắt. Dù thế đi nữa, chúng rẻ hơn về lâu dài.", answers: ["Electric cars are expensive. Be that as it may, they are cheaper in the long run.", "Electric cars are expensive. Be that as it may, they are cheaper in the long term.", "Electric vehicles are expensive. Be that as it may, they are cheaper in the long run."], hint: "Be that as it may · in the long run" },
        ],
      },

      { t: "h", text: "4. Ba cấu trúc trang trọng nhỏ: lest · as do / as did · so too" },
      {
        t: "patterns",
        rows: [
          {
            formula: "…, lest + S + (should) + V (nguyên mẫu)",
            vi: "lest = “kẻo, để khỏi” (= for fear that / so that… not). Rất trang trọng; sau lest là giả định, KHÔNG thêm not.",
            examples: [
              { en: "Historic buildings must be recorded in detail lest they be lost for ever.", vi: "Các công trình lịch sử phải được ghi chép chi tiết kẻo chúng mất đi vĩnh viễn." },
              { en: "He spoke quietly lest he wake the children.", vi: "Anh ấy nói khẽ kẻo làm bọn trẻ thức giấc." },
            ],
          },
          {
            formula: "S + V…, as + do / does / did / is / are / have / will + S",
            vi: "“cũng như… vậy” — thêm một chủ ngữ thứ hai mà không lặp động từ. Chủ ngữ sau thường dài.",
            examples: [
              { en: "Finland starts formal schooling at seven, as do several other Nordic countries.", vi: "Phần Lan cho trẻ bắt đầu đi học chính thức lúc bảy tuổi, cũng như một số nước Bắc Âu khác." },
              { en: "Car ownership rose sharply, as did the number of road accidents.", vi: "Tỉ lệ sở hữu ô tô tăng mạnh, và số vụ tai nạn giao thông cũng vậy." },
            ],
          },
          {
            formula: "… , and so too + do / does / did / is / has / will + S",
            vi: "so too = “và… cũng thế” — trang trọng hơn “so + trợ động từ + S” của Ngày 7.",
            examples: [
              { en: "Working patterns have changed, and so too have people's expectations of employers.", vi: "Cách làm việc đã thay đổi, và kỳ vọng của người lao động với chủ doanh nghiệp cũng thế." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: trợ động từ phải khớp với vế trước",
        items: [
          "Vế trước dùng thì đơn ⇒ **do / does / did**; dùng be ⇒ **is / are / was / were**; dùng have + V3 ⇒ **have / has / had**; dùng modal ⇒ lặp modal. ~~Prices have risen, as **did** wages.~~ → as ==have== wages.",
          "Đại từ thì **không đảo**: …as ==they did== last year (không viết ~~as did they~~).",
          "~~…lest they **not** forget~~ ✗ — lest đã mang nghĩa phủ định. Viết: lest they ==forget==.",
          "**as do / as did** rất hợp Task 1 (Ngày 9 mục 5 đã gặp): Sales of tea fell, **as did** those of coffee.",
        ],
      },
      { t: "rule", formula: "…, as + trợ động từ + S  ·  …, and so too + trợ động từ + S  ·  …, lest + S + V nguyên mẫu", vi: "Trợ động từ khớp thì của vế trước; chủ ngữ là danh từ thì đảo, là đại từ thì không." },
      {
        t: "quiz", id: "t4d27-as-dien", kind: "fill", title: "Điền MỘT đến HAI từ (6 câu) — lest · as do · so too",
        items: [
          { q: "1. Japan has an ageing population, as ___ Italy and Germany.", answers: ["do"], hint: "has ở đây là động từ thường (thì hiện tại đơn) ⇒ do" },
          { q: "2. House prices have doubled since 2010, and so too ___ rents.", answers: ["have"], hint: "have doubled ⇒ have" },
          { q: "3. The museum was closed for repairs, as ___ the library next door.", answers: ["was"], hint: "was closed ⇒ was" },
          { q: "4. Witnesses' names were removed from the report ___ they be identified.", answers: ["lest"], hint: "kẻo họ bị nhận ra" },
          { q: "5. Demand for water will increase, as ___ the cost of supplying it.", answers: ["will"], hint: "will increase ⇒ will" },
          { q: "6. The number of visitors fell in 2020, as ___ the income from ticket sales.", answers: ["did"], hint: "fell (quá khứ đơn) ⇒ did" },
        ],
      },

      { t: "h", text: "5. Fronting — đưa một thành phần lên đầu câu" },
      { t: "p", text: "Trật tự bình thường của câu tiếng Anh là **S + V + O / C + A**. **Fronting** là đưa một thành phần khác lên trước chủ ngữ. Mục đích không phải để “khó hơn” mà để: (1) **nối** với câu trước — thông tin đã biết đứng đầu, thông tin mới và dài đứng cuối; (2) **nhấn** hoặc tạo tương phản. Có năm kiểu đáng học; ba kiểu đầu kéo theo **đảo động từ lên trước chủ ngữ**." },
      {
        t: "patterns",
        rows: [
          {
            formula: "adj / V3 / cụm so sánh + be + S (dài)",
            vi: "Kiểu 1 — bổ ngữ lên đầu + đảo be. Cách chuyển đoạn band 7: câu trước nói A, câu này thêm B.",
            examples: [
              { en: "Equally important is the question of who will pay for the scheme.", vi: "Quan trọng không kém là câu hỏi ai sẽ trả tiền cho chương trình." },
              { en: "Of particular concern is the rise in anxiety among teenagers.", vi: "Đặc biệt đáng lo là sự gia tăng lo âu ở thanh thiếu niên." },
              { en: "Also worth noting is the gap between urban and rural areas.", vi: "Cũng đáng lưu ý là khoảng cách giữa thành thị và nông thôn." },
              { en: "Gone are the days when a degree guaranteed a job.", vi: "Đã qua rồi cái thời có bằng đại học là chắc chắn có việc." },
            ],
          },
          {
            formula: "cụm nơi chốn / hướng + V (be · lie · stand · come) + S",
            vi: "Kiểu 2 — trạng ngữ nơi chốn lên đầu + đảo CẢ động từ chính (không mượn do). Nghĩa bóng dùng nhiều trong Task 2.",
            examples: [
              { en: "At the heart of the debate lies a simple question: who benefits?", vi: "Nằm ở trung tâm cuộc tranh luận là một câu hỏi đơn giản: ai hưởng lợi?" },
              { en: "Among the main causes are low pay and long working hours.", vi: "Trong số các nguyên nhân chính có lương thấp và giờ làm dài." },
              { en: "Behind these figures lies a change in attitudes to marriage.", vi: "Đằng sau những con số này là một thay đổi trong thái độ với hôn nhân." },
            ],
          },
          {
            formula: "Such + be + N + that…  ·  So + adj + be + S + that…",
            vi: "Kiểu 3 — đã học ở Ngày 7 mục 8; nhắc lại vì cùng họ fronting.",
            examples: [
              { en: "So complex is the tax system that few people understand it fully.", vi: "Hệ thống thuế phức tạp đến mức ít ai hiểu hết." },
            ],
          },
          {
            formula: "adj / adv + as / though + S + V, S + V  ·  Try as + S + might, …  ·  Much as + S + V, …",
            vi: "Kiểu 4 — nhượng bộ (= Although…). KHÔNG đảo chủ ngữ – động từ.",
            examples: [
              { en: "Important as exam results are, they do not measure creativity.", vi: "Dù điểm thi quan trọng, chúng không đo được sự sáng tạo." },
              { en: "Much as I enjoy city life, I would not raise children there.", vi: "Dù rất thích cuộc sống thành phố, tôi sẽ không nuôi con ở đó." },
              { en: "Try as they might, the engineers could not find the fault.", vi: "Dù cố thế nào, các kỹ sư cũng không tìm ra lỗi." },
            ],
          },
          {
            formula: "O / C + S + V",
            vi: "Kiểu 5 — đưa tân ngữ hay bổ ngữ lên đầu, KHÔNG đảo. Chủ yếu để nối với câu trước hoặc tương phản; hợp Nói hơn Viết.",
            examples: [
              { en: "Some of these claims I find convincing; others I do not.", vi: "Một số nhận định này tôi thấy thuyết phục; số khác thì không." },
              { en: "That much is clear. What remains uncertain is the cost.", vi: "Chừng đó thì rõ. Điều còn chưa chắc là chi phí." },
            ],
          },
        ],
      },
      {
        t: "sodo", kind: "compare", title: "Fronting có đảo hay không đảo?",
        cols: [
          { title: "CÓ đảo động từ lên trước S", items: ["bổ ngữ + **be** + S: Equally important **is** X", "nơi chốn + **lie / stand / be / come** + S: Behind this **lies** X", "So + adj + **be** + S + that…", "từ phủ định + trợ động từ + S (Ngày 7): Rarely **do** we…"] },
          { title: "KHÔNG đảo", items: ["adj + **as** + S + V: Important as it **is**,…", "Try as they **might**,…", "tân ngữ lên đầu: This claim **I reject**", "chủ ngữ là ĐẠI TỪ: Here **it comes** · At the top **it stands**"] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi khi đảo — giám khảo thấy ngay",
        items: [
          "**Sai hoà hợp chủ – vị**: chủ ngữ thật đứng SAU động từ. ~~Among the causes **is** low pay and long hours.~~ → ==are== (hai nguyên nhân). ~~Behind this trend **lie** a simple fact.~~ → ==lies==.",
          "**Mượn do sai chỗ**: ~~At the heart of the problem **does lie** poverty.~~ → ==lies== poverty. Chỉ đảo ngữ sau từ phủ định mới mượn do (Ngày 7).",
          "**Chủ ngữ quá ngắn**: ~~Equally important is cost.~~ nghe cụt. Fronting chỉ tự nhiên khi chủ ngữ dài, mang thông tin mới: Equally important is ==the cost of training enough teachers==.",
          "**Dày quá**: hai câu fronting liền nhau trong một đoạn = khoe. Mỗi bài 1–2 câu, đặt ở **câu chuyển ý**.",
        ],
      },
      { t: "rule", formula: "adj / nơi chốn + V + S (dài, thông tin mới)  ·  adj + as + S + V, S + V", vi: "Đưa cái đã biết lên đầu, để cái mới ở cuối; động từ hoà hợp với chủ ngữ đứng SAU nó." },
      {
        t: "quiz", id: "t4d27-fr-dich", kind: "translate", title: "Dịch Việt → Anh (5 câu) — bắt đầu bằng từ gợi ý",
        grammar: "Equally important is + S · At the heart of… lies + S · adj + as + S + V,… · Gone are the days when…",
        items: [
          { q: "Quan trọng không kém là nhu cầu đào tạo lại người lao động lớn tuổi. (Equally…)", answers: ["Equally important is the need to retrain older workers.", "Equally important is the need to retrain older employees."], hint: "Equally important is · the need to retrain" },
          { q: "Nằm ở trung tâm của vấn đề là sự thiếu niềm tin. (At the heart…)", answers: ["At the heart of the problem lies a lack of trust.", "At the heart of the issue lies a lack of trust.", "At the heart of the problem is a lack of trust."], hint: "At the heart of · lies · a lack of trust" },
          { q: "Dù công nghệ hữu ích, nó không thể thay thế giáo viên. (Useful…)", answers: ["Useful as technology is, it cannot replace teachers.", "Useful though technology is, it cannot replace teachers.", "Useful as technology may be, it cannot replace teachers."], hint: "Useful as + S + is" },
          { q: "Đã qua rồi cái thời người ta làm một công việc cả đời. (Gone…)", answers: ["Gone are the days when people had one job for life.", "Gone are the days when people did one job for life.", "Gone are the days when people stayed in one job for life.", "Gone are the days when people had a job for life."], hint: "Gone are the days when · a job for life" },
          { q: "Trong số những người bị ảnh hưởng nặng nhất có các chủ cửa hàng nhỏ. (Among…)", answers: ["Among those worst affected are small shop owners.", "Among the worst affected are small shop owners.", "Among those most affected are small shop owners.", "Among those hardest hit are small shop owners."], hint: "Among those worst affected · are" },
        ],
      },
      {
        t: "quiz", id: "t4d27-fr-viet-lai", kind: "fill", title: "Viết lại — điền phần còn thiếu (6 câu)",
        items: [
          { q: "1. The shortage of nurses is particularly worrying. → Of particular ___ the shortage of nurses.", answers: ["concern is"], hint: "Of particular concern + be + S" },
          { q: "2. Although the plan is ambitious, it is not unrealistic. → Ambitious ___ , it is not unrealistic.", answers: ["as the plan is", "though the plan is", "as the plan may be"], hint: "adj + as + S + V" },
          { q: "3. Three factors lie behind the decline. → Behind the decline ___ three factors.", answers: ["lie"], hint: "three factors ⇒ số nhiều" },
          { q: "4. A statue of the founder stands in the centre of the square. → In the centre of the square ___ a statue of the founder.", answers: ["stands"], hint: "không mượn do" },
          { q: "5. Although I admire her work very much, I disagree with her conclusion. → Much ___ her work, I disagree with her conclusion.", answers: ["as I admire"], hint: "Much as + S + V" },
          { q: "6. The fact that many graduates are underemployed is also worth noting. → Also worth ___ the fact that many graduates are underemployed.", answers: ["noting is"], hint: "Also worth noting + be + S" },
        ],
      },

      { t: "h", text: "6. Dùng ở đâu trong bài thi — và dùng bao nhiêu" },
      {
        t: "table",
        head: ["Phần thi", "Nên dùng", "Câu mẫu", "Liều"],
        rows: [
          ["Task 2 — đoạn giải pháp / kết bài", "It is essential that… · It is high time… · recommend that…", "It is essential that vocational courses **be funded** on the same basis as degrees.", "1 câu"],
          ["Task 2 — câu chuyển ý giữa hai luận điểm", "Equally important is… · Of greater concern is… · adj + as…", "**Persuasive as** this argument **is**, it overlooks the cost.", "1 câu"],
          ["Task 1", "as did / as do · Among… was…", "Exports of rice rose, **as did** those of coffee.", "1 câu, không hơn"],
          ["Part 3 — nêu quan điểm, giả thiết", "I'd rather… · It's about time… · Suppose… · if need be · as it were", "**I'd rather** schools **spent** that money on teachers.", "tự nhiên, không gượng"],
          ["Thư / email trang trọng (Ngày 26)", "I would suggest that… · Should you require…", "I would suggest that the deadline **be extended** by a week.", "1–2 câu"],
        ],
      },
      { t: "note", title: "💡 Mẹo: nếu không chắc, chọn bản an toàn", items: ["Không chắc giả định ⇒ viết **should + V**: It is essential that every school **should have** a library. Không ai trừ điểm.", "Không chắc hoà hợp khi đảo ⇒ quay về trật tự thường: The question of cost **is equally important**. Câu đúng bình thường luôn hơn câu “đẹp” mà sai.", "**lest**, **far be it from me**, **come what may**: nhận ra khi đọc là đủ; đừng cố nhét vào bài."] },

      { t: "h", text: "7. Kiểm tra cuối bài (12 câu)" },
      {
        t: "mcq", id: "t4d27-np-kiem-tra", title: "Chọn phương án đúng (12 câu)",
        items: [
          { q: "1. The inspectors recommended that the bridge ___ to heavy vehicles immediately.", options: ["is closed", "be closed", "was closed", "would be closed"], correct: 1, why: "recommend that + giả định bị động: be + V3, dù recommended ở quá khứ." },
          { q: "2. It is imperative that no student ___ behind because of family income.", options: ["be left", "is leaving", "are left", "has left"], correct: 0, why: "imperative that + S + be + V3. no student số ít nhưng giả định không chia: be." },
          { q: "3. Câu nào ĐÚNG?", options: ["The teacher suggested us to read more widely.", "The teacher suggested that we to read more widely.", "The teacher suggested that we read more widely.", "The teacher suggested we reading more widely."], correct: 2, why: "suggest that + S + V nguyên mẫu. suggest không đi với tân ngữ + to V." },
          { q: "4. It is high time the city ___ in proper cycle lanes.", options: ["invests", "will invest", "has invested", "invested"], correct: 3, why: "It is high time + S + V2 (quá khứ không thật)." },
          { q: "5. I'd rather you ___ the report before Friday, if that's possible.", options: ["finish", "finished", "will finish", "to finish"], correct: 1, why: "would rather + chủ ngữ khác + V2." },
          { q: "6. Some politicians talk as though the problem ___ already solved.", options: ["were", "is being", "be", "has"], correct: 0, why: "as though + điều không thật ⇒ were." },
          { q: "7. Among the reasons given ___ the high cost of childcare and the shortage of housing.", options: ["was", "is", "are", "has been"], correct: 2, why: "Chủ ngữ thật đứng sau: the high cost… and the shortage… ⇒ số nhiều ⇒ are." },
          { q: "8. ___ as the evidence is, it does not prove that screens cause poor sleep.", options: ["Although strong", "However strong", "Despite strong", "Strong"], correct: 3, why: "adj + as + S + V = Although the evidence is strong. Không thêm although / despite phía trước." },
          { q: "9. Tourism brings in foreign currency, as ___ the export of coffee.", options: ["is", "does", "has", "do"], correct: 1, why: "brings (hiện tại đơn) ⇒ does; chủ ngữ the export số ít." },
          { q: "10. Câu nào SAI?", options: ["At the centre of the campus stands the library.", "Equally important is the role of parents.", "Behind the decision does lie a financial motive.", "Gone are the days of cheap housing."], correct: 2, why: "Đảo sau cụm nơi chốn dùng thẳng động từ chính: Behind the decision lies… — không mượn does." },
          { q: "11. The new rules require that visitors ___ photographs inside the gallery.", options: ["don't take", "not take", "not to take", "aren't taking"], correct: 1, why: "Giả định phủ định: not + V nguyên mẫu, không mượn do." },
          { q: "12. “The policy is unpopular. ___, it has reduced traffic by a fifth.” Cụm nào hợp nhất?", options: ["As it were", "If need be", "So be it", "Be that as it may"], correct: 3, why: "Be that as it may = dù thế đi nữa: nhượng bộ câu trước rồi nêu ý ngược lại." },
        ],
      },
      { t: "note", title: "📌 Ghi nhớ: đúng dưới 9/12 thì ôn gì", items: ["Sai câu 1–3, 11 ⇒ mục 2 (giả định sau yêu cầu – đề xuất).", "Sai câu 4–6, 12 ⇒ mục 3 (quá khứ không thật, cụm cố định).", "Sai câu 7, 8, 10 ⇒ mục 5 (fronting) và Tập 4 Ngày 7 mục 6–8.", "Sai câu 9 ⇒ mục 4."] },
    ],
  },

  /* ═══════════════════════ BÀI 2 — ĐỌC ═══════════════════════ */
  {
    id: "t4d27-doc",
    kind: "reading",
    title: "Đọc: Reading đủ 3 passage · 40 câu · 60 phút — lần 3 của Tập 4 (Passage 3 ≥ 9/13)",
    goal: "Làm trọn một bài Reading Academic ba passage (khoảng 2.700 từ, 40 câu, 8 dạng câu hỏi) trong đúng 60 phút theo nhịp 17 – 20 – 23, đạt ≥ 30/40 và riêng Passage 3 (văn lập luận) đúng ít nhất 10/14 câu — tương đương mốc 9/13 của band 7; so được kết quả với lần 1 (Ngày 13) và lần 2 (Ngày 21) để biết mình còn mất điểm ở dạng nào.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        items: [
          "Đây là **lần 3** làm đủ 3 passage của Tập 4 (lần 1: Ngày 13 · lần 2: Ngày 21). Mục tiêu hôm nay: **≥ 30/40**, và **Passage 3 ≥ 10/14**.",
          "Nhịp **17 – 20 – 23** phút. Passage 3 có 14 câu và là văn lập luận: phải còn **đủ 23 phút** cho nó.",
          "Mỗi passage: **2 phút đọc bố cục** (tiêu đề, câu đầu mỗi đoạn) → làm theo từng nhóm câu hỏi → không quay lại passage trước.",
          "Câu nào quá **90 giây** chưa ra: chọn tạm, đánh dấu, đi tiếp. **Không bỏ trống** câu nào.",
          "Passage 3: hỏi **người viết nghĩ gì** — để ý từ nhượng bộ (not a foolish one · the trouble is · none of this means) và mức chắc chắn.",
        ],
      },

      { t: "h", text: "1. Trước khi bấm giờ — kế hoạch của lần 3" },
      {
        t: "table",
        head: ["Passage", "Câu", "Dạng câu hỏi", "Thời gian", "Mốc band 7"],
        rows: [
          ["1 — mô tả (Walls Without Mortar)", "1–13", "TFNG (7) · Note completion (6)", "17 phút", "≥ 11/13"],
          ["2 — khoa học, nhiều giả thuyết (Why Do We Yawn?)", "14–26", "Matching information (5) · Matching features (5) · Sentence completion (3)", "20 phút", "≥ 9/13"],
          ["3 — lập luận (The Invisible Translator)", "27–40", "Multiple choice (5) · YNNG (5) · Summary hộp từ (4)", "23 phút (gồm 3 phút soát)", "≥ 10/14"],
        ],
        caption: "Tổng mục tiêu ≥ 30/40 ⇒ band 7.0 (bảng quy đổi phổ biến).",
      },
      {
        t: "sodo", kind: "flow", title: "Một passage — bốn bước (ôn Ngày 13 · Tập 3 Ngày 29)",
        steps: [
          { label: "2 phút: đọc bố cục", sub: "tiêu đề · câu đầu từng đoạn · ghi 2–3 chữ bên lề mỗi đoạn" },
          { label: "Nhóm câu theo THỨ TỰ bài trước", sub: "TFNG / YNNG · completion · MCQ" },
          { label: "Nhóm câu KHÔNG theo thứ tự sau", sub: "Matching information · features — dùng ghi chú bên lề" },
          { label: "30 giây cuối: điền hết ô trống", sub: "đoán có căn cứ; kiểm chính tả, số từ" },
        ],
      },
      { t: "note", title: "💡 Mẹo riêng cho lần 3: sửa đúng chỗ đã sai ở hai lần trước", items: ["Mở lại bảng kết quả Ngày 13 và Ngày 21. Dạng nào **sai ≥ 2 câu ở cả hai lần** thì hôm nay làm dạng đó **chậm lại 20%**, bù bằng cách làm nhanh dạng mình chắc.", "Hai lần trước **không kịp Passage 3**? Hôm nay đặt báo thức ở phút **17** và phút **37**. Chuông reo là chuyển passage, dù đang dở câu.", "Passage 2 hôm nay có **Matching information** (tìm đoạn chứa thông tin): làm SAU hai nhóm kia, vì lúc đó bạn đã đọc gần hết bài."] },
      { t: "p", text: "Chuẩn bị: đồng hồ đếm ngược **60 phút**, giấy nháp ghi đáp án 1–40. Không tra từ điển. Bấm giờ rồi mới kéo xuống." },

      /* ══ PASSAGE 1 ══ */
      { t: "h", text: "READING PASSAGE 1 — Questions 1–13 (17 phút)" },
      {
        t: "passage",
        title: "Walls Without Mortar",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1.",
        paras: [
          { label: "A", text: "Across the uplands of Britain and Ireland, and in hill country from Peru to Japan, fields are divided by walls that contain no mortar, no cement and no metal. A dry stone wall is held together by nothing more than gravity and the skill with which each stone has been placed against its neighbours. Estimates of the total length of such walls in Britain vary, but a figure of around 200,000 kilometres is often quoted, much of it more than two centuries old. That structures built without any binding material should outlast many of the roads and bridges put up since is a fact that surprises most people who stop to look at them." },
          { label: "B", text: "The technique is ancient. At Skara Brae, a village on the Orkney Islands that was occupied some five thousand years ago, houses, beds and storage shelves were all constructed from flat slabs of stone laid dry. Most of the field walls that walkers see today, however, are far younger. They date largely from the period between about 1750 and 1850, when a series of Enclosure Acts transferred open land, which villagers had farmed and grazed in common, into private ownership. The new owners were legally obliged to mark their boundaries, and in districts where trees were scarce and stone lay everywhere on the surface, a wall was the cheapest fence available. Clearing the stones had the additional advantage of improving the pasture." },
          { label: "C", text: "Although styles differ from region to region, the principles of construction are much the same everywhere. The waller first digs a shallow trench and lays in it the largest stones, known as footings. On this base two parallel faces are built up in level layers, or courses, each stone being set with its length running into the wall and not along it. The two faces lean slightly towards each other, a slope called the batter, so that the wall is narrower at the top than at the bottom. The gap between them is packed with small broken stones, the hearting, which must be placed by hand and never simply shovelled in." },
          { label: "D", text: "At intervals, long stones called throughstones are laid across the full width of the wall to tie the two faces together. Finally, a row of heavy stones is set on edge along the top. These copestones press down on the courses beneath and discourage sheep from attempting to jump over. A single rule governs the whole process: every joint between two stones must be covered by a stone in the course above, so that no vertical crack can run up the face. A competent waller working with stone that is already on the site is generally reckoned to complete about three metres in a day." },
          { label: "E", text: "The absence of mortar, which might seem a weakness, is in fact the reason for the walls' long life. A mortared wall is rigid; when the ground beneath it shifts or freezes, it cracks, and once water enters the cracks, the damage spreads. A dry wall, by contrast, can settle and adjust without breaking. Rain drains straight through it, and wind passes between the stones instead of pushing against a solid surface, which is why dry stone walls seldom blow down in gales that flatten wooden fences. Equally important to farmers is the shelter the walls provide: animals gather on the protected side in bad weather, and lambs born beside a wall are more likely to survive a cold spring night." },
          { label: "F", text: "Naturalists have come to value the walls as well. The stones offer a surface on which lichens and mosses can grow undisturbed for decades, and some lichen colonies on old walls are thought to be as old as the walls themselves. The spaces inside provide nesting sites for small birds such as the wheatear, shelter for lizards, toads and insects, and winter quarters for bats. In intensively farmed landscapes, where hedges and rough grass have been removed, a wall may act as a corridor along which small mammals can travel between one patch of habitat and another without crossing open ground." },
          { label: "G", text: "For much of the twentieth century, however, the walls were in decline. Rebuilding a collapsed section by hand costs many times more than putting up a post-and-wire fence, and as farms employed fewer workers, gaps were simply filled with wire. A national survey carried out in England in the 1990s found that only about one wall in eight was in good condition. Since then the picture has improved somewhat. Agricultural grants now pay farmers to repair walls, a professional association awards graded certificates to wallers, and in 2018 the craft, as practised in eight European countries, was added to UNESCO's list of intangible cultural heritage. Whether enough young people can be persuaded to take up such slow and physically demanding work is less certain: courses for beginners are often full, but only a minority of those who attend go on to earn their living from the craft." },
        ],
      },
      { t: "p", text: "**Questions 1–7** — Do the following statements agree with the information given in Reading Passage 1? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, or **NOT GIVEN** if there is no information on this." },
      {
        t: "mcq", id: "t4d27-doc-p1-tfng", title: "Questions 1–7 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "1. There is general agreement about the exact length of dry stone walling in Britain.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn A: “Estimates… vary, but a figure of around 200,000 kilometres is often quoted”. vary / around ↔ general agreement / exact ⇒ FALSE." },
          { q: "2. At Skara Brae, stone was used for furniture as well as for buildings.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: “houses, beds and storage shelves were all constructed from flat slabs of stone”. beds and storage shelves = furniture." },
          { q: "3. The majority of field walls seen today were put up before common land passed into private hands.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn B: chúng có từ giai đoạn 1750–1850, KHI đất chung bị chuyển thành đất tư, và chính chủ mới phải dựng ranh giới ⇒ không phải “trước khi”. Bẫy đổi thời điểm." },
          { q: "4. In stony districts, a wall cost less than any other means of marking a boundary.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: “a wall was the cheapest fence available”. cheapest = cost less than any other." },
          { q: "5. Wallers in different regions prefer stone of different colours.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ nói “styles differ from region to region”, không nói gì về màu đá. Đừng suy từ styles ra colours." },
          { q: "6. The hearting can be tipped into the middle of the wall with a shovel.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn C: “must be placed by hand and never simply shovelled in”." },
          { q: "7. Lambs born next to a wall grow more quickly than those born in open fields.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn E chỉ nói chúng “more likely to survive a cold spring night” — sống sót, không nói lớn nhanh hơn. Đúng chủ đề, sai thông tin ⇒ NOT GIVEN." },
        ],
      },
      { t: "p", text: "**Questions 8–13** — Complete the notes below. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "note",
        title: "Building a dry stone wall — notes",
        items: [
          "**Base:** the footings (largest stones) are laid in a shallow **8** ___",
          "**Faces:** two faces in level courses; they lean inwards — this slope is known as the **9** ___",
          "**Centre:** filled with hearting, which has to be positioned by **10** ___",
          "**Top:** copestones add weight and prevent **11** ___ from getting over",
          "**Main rule:** joints are always covered, so that no upright **12** ___ appears in the face",
          "**Wildlife:** in farmland with few hedges, a wall can serve small mammals as a **13** ___ between habitats",
        ],
      },
      {
        t: "quiz", id: "t4d27-doc-p1-ghi-chu", kind: "fill", title: "Questions 8–13 — ONE WORD ONLY",
        items: [
          { q: "8", answers: ["trench"], hint: "Đoạn C: “digs a shallow trench and lays in it the largest stones, known as footings”." },
          { q: "9", answers: ["batter"], hint: "Đoạn C: “lean slightly towards each other, a slope called the batter”. lean inwards = lean towards each other." },
          { q: "10", answers: ["hand"], hint: "Đoạn C: “must be placed by hand”. positioned = placed." },
          { q: "11", answers: ["sheep"], hint: "Đoạn D: “discourage sheep from attempting to jump over”. prevent… from getting over = discourage… from jumping over." },
          { q: "12", answers: ["crack"], hint: "Đoạn D: “so that no vertical crack can run up the face”. upright = vertical. Số ít (no + crack)." },
          { q: "13", answers: ["corridor"], hint: "Đoạn F: “a wall may act as a corridor along which small mammals can travel”. serve as = act as." },
        ],
      },

      /* ══ PASSAGE 2 ══ */
      { t: "h", text: "READING PASSAGE 2 — Questions 14–26 (20 phút)" },
      {
        t: "passage",
        title: "Why Do We Yawn?",
        intro: "You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2. (Văn bản tự soạn để luyện; tên các nhà nghiên cứu là hư cấu.)",
        paras: [
          { label: "A", text: "Few actions are as familiar as the yawn, and few are as poorly understood. The mouth opens wide, the lungs fill slowly, the jaw muscles stretch to their limit, and after about six seconds the air is released. Human beings begin doing this before they are born – ultrasound scans show foetuses yawning from roughly the eleventh week of pregnancy – and continue until the end of their lives. Nor is the habit confined to our own species: fish, snakes, birds and almost all mammals have been observed to yawn. A behaviour so ancient and so widespread would be expected to serve an obvious purpose, yet what that purpose is has proved remarkably hard to establish." },
          { label: "B", text: "The explanation that most people learn at school is that a yawn is the body's response to a shortage of oxygen: when breathing becomes shallow, carbon dioxide builds up in the blood, and a deep breath corrects the balance. The idea is at least two thousand years old, and it has the appeal of common sense. It is also, in all probability, wrong. In the 1980s the psychologist Martin Reiss asked volunteers to breathe air containing far more carbon dioxide than normal and, on other occasions, pure oxygen. If the traditional theory were correct, the first condition should have produced more yawns and the second fewer. In fact neither made any difference to how often the volunteers yawned, although both altered their rate of breathing." },
          { label: "C", text: "Reiss's own proposal was that yawning accompanies a change of state. People yawn most on waking and shortly before sleep, but also when moving from inactivity to action: soldiers have been seen yawning before a parachute jump, musicians before going on stage and athletes in the minutes before a race. None of these people is bored. On this view the yawn, with its powerful stretch of the jaw and its brief rise in heart rate, helps to shift the body from one level of alertness to another. The difficulty, as critics observed, is that the account describes when yawning happens far better than it explains what the yawn physically does." },
          { label: "D", text: "A more specific mechanism has been put forward by the biologist Karen Aldous, who argues that the function of a yawn is to cool the brain. The brain generates a great deal of heat and works best within a narrow range of temperatures. According to Aldous, the stretching of the jaw increases the flow of blood to the skull, while the deep intake of air cools that blood on its way there, much as a radiator cools an engine. The hypothesis generates predictions that can be tested. In her experiments, people who held a cold pack against the forehead, or who were instructed to breathe through the nose – both of which lower the temperature of the brain – yawned far less than others while watching films of people yawning. Pedestrians surveyed in the street also yawned less when the air outside was as warm as the body, a condition in which taking in air could not cool anything." },
          { label: "E", text: "Further support has come from comparisons between species. When Aldous and her colleagues timed the yawns of more than twenty kinds of mammal in video recordings, the length of the average yawn turned out to be closely related not to the size of the animal's body, nor even of its jaw, but to the weight of its brain and the number of nerve cells in its outer layer. Mice yawned for under a second; humans, whose brains contain the most such cells, yawned longest of all. A larger and more active brain, it seems, needs a longer period of cooling. The theory is not universally accepted – some physiologists doubt that a single breath could alter brain temperature enough to matter – but it has so far survived more attempts to disprove it than any of its rivals." },
          { label: "F", text: "None of this explains the strangest feature of yawning, which is that it is contagious. Seeing, hearing or even reading about a yawn is enough to set one off; many readers of this passage will already have yawned. Contagious yawning is not present from birth. Children do not begin to catch yawns from others until around the age of four or five, which is about the time at which they become able to recognise other people's emotions. This coincidence led to the suggestion that catching a yawn is a primitive form of empathy. The primatologist Lucia Ferrante, who recorded several hundred yawns in everyday settings, found that people were most likely to catch a yawn from a relative, then from a friend, then from an acquaintance, and least likely to catch one from a stranger. Dogs, too, have been shown to yawn in response to human yawns." },
          { label: "G", text: "The empathy theory has not gone unchallenged, however. When the geneticist Paul Hendry tested over three hundred adults, using questionnaires that measure empathy alongside tests of tiredness and intelligence, he found that none of these factors predicted how susceptible a person was to contagious yawning. Only age did – older participants were less likely to yawn in response to a film – and even age accounted for a very small part of the variation. Most of the difference between individuals therefore remains unexplained. It may be that spontaneous and contagious yawning, though they look identical, evolved for different reasons: the first to regulate the brain of the individual, the second to synchronise the alertness of a group. For the moment, that remains speculation. What can be said with confidence is that the yawn, long dismissed as a sign of boredom or bad manners, is nothing of the kind." },
        ],
      },
      { t: "p", text: "**Questions 14–18** — Reading Passage 2 has seven paragraphs, **A–G**. Which paragraph contains the following information? Write the correct letter, **A–G**. **NB** You may use any letter more than once." },
      {
        t: "quiz", id: "t4d27-doc-p2-doan", kind: "fill", title: "Questions 14–18 — viết chữ cái A–G",
        items: [
          { q: "14. a reference to yawning among people who are about to perform in public", answers: ["C"], hint: "Đoạn C: “musicians before going on stage and athletes in the minutes before a race”. about to perform = before going on stage." },
          { q: "15. a comparison between a process in the body and the working of a machine", answers: ["D"], hint: "Đoạn D: “much as a radiator cools an engine”. Câu hỏi không nhắc từ radiator hay engine — phải nhận ra PHÉP SO SÁNH." },
          { q: "16. evidence that yawning starts earlier than birth", answers: ["A"], hint: "Đoạn A: “ultrasound scans show foetuses yawning from roughly the eleventh week of pregnancy”." },
          { q: "17. a claim that one theory has resisted refutation better than the alternatives", answers: ["E"], hint: "Đoạn E, câu cuối: “it has so far survived more attempts to disprove it than any of its rivals”. refutation = attempts to disprove; alternatives = rivals." },
          { q: "18. the suggestion that two kinds of yawn may have separate origins", answers: ["G"], hint: "Đoạn G: “spontaneous and contagious yawning… evolved for different reasons”. Đoạn F giới thiệu ngáp lây nhưng chưa nói tới nguồn gốc riêng." },
        ],
      },
      { t: "p", text: "**Questions 19–23** — Look at the following findings and the list of researchers below. Match each finding with the correct researcher, **A–D**. **NB** You may use any letter more than once. — **A** Martin Reiss · **B** Karen Aldous · **C** Lucia Ferrante · **D** Paul Hendry" },
      {
        t: "quiz", id: "t4d27-doc-p2-nguoi", kind: "fill", title: "Questions 19–23 — viết chữ cái A–D",
        items: [
          { q: "19. The closer the relationship between two people, the more readily a yawn passes from one to the other.", answers: ["C"], hint: "Ferrante, đoạn F: relative → friend → acquaintance → stranger. Câu hỏi khái quát thành “the closer the relationship”." },
          { q: "20. Changing the gases that a person breathes has no effect on how frequently he or she yawns.", answers: ["A"], hint: "Reiss, đoạn B: “neither made any difference to how often the volunteers yawned”. gases = carbon dioxide / pure oxygen." },
          { q: "21. A person's ability to share the feelings of others does not determine whether he or she catches yawns.", answers: ["D"], hint: "Hendry, đoạn G: “none of these factors predicted…” — trong đó có empathy. ability to share the feelings of others = empathy." },
          { q: "22. The duration of a yawn reflects how complex an animal's brain is.", answers: ["B"], hint: "Aldous, đoạn E: độ dài cú ngáp liên quan tới “the weight of its brain and the number of nerve cells”." },
          { q: "23. Yawning tends to occur at moments of transition between one level of activity and another.", answers: ["A"], hint: "Reiss, đoạn C: “yawning accompanies a change of state… from inactivity to action”. Reiss được dùng HAI lần (NB)." },
        ],
      },
      { t: "p", text: "**Questions 24–26** — Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — **24** In Aldous's experiments, people yawned less if they breathed through the nose or pressed a ___ to the forehead. · **25** Children start to catch yawns at about the age at which they learn to identify the ___ of other people. · **26** In Hendry's study, the only factor linked to contagious yawning was ___ ." },
      {
        t: "quiz", id: "t4d27-doc-p2-cau", kind: "fill", title: "Questions 24–26 — NO MORE THAN TWO WORDS",
        items: [
          { q: "24", answers: ["cold pack"], hint: "Đoạn D: “people who held a cold pack against the forehead”. pressed = held… against. Chỉ pack là thiếu nghĩa." },
          { q: "25", answers: ["emotions"], hint: "Đoạn F: “become able to recognise other people's emotions”. identify = recognise. Không điền empathy: bài viết “a form of empathy”, không hợp “the ___ of other people”." },
          { q: "26", answers: ["age"], hint: "Đoạn G: “Only age did”. Ba yếu tố còn lại (empathy, tiredness, intelligence) đều bị loại." },
        ],
      },

      /* ══ PASSAGE 3 ══ */
      { t: "h", text: "READING PASSAGE 3 — Questions 27–40 (23 phút, gồm 3 phút soát cuối)" },
      {
        t: "passage",
        title: "The Invisible Translator",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3.",
        paras: [
          { label: "A", text: "When a novel written in another language is praised by English-speaking reviewers, the praise tends to take a predictable form. The prose is “fluent”, it “reads smoothly”, and – the highest compliment of all – it “does not feel like a translation”. The translator, if mentioned, is commended for having disappeared. So widely shared is this ideal of invisibility, by publishers, critics and readers alike, that it is rarely stated, let alone questioned. Yet it rests on an assumption that deserves scrutiny: that the best translation is the one which hides the fact that any translating has taken place." },
          { label: "B", text: "The debate behind this assumption is an old one. In a lecture delivered in 1813, the German philosopher Friedrich Schleiermacher argued that a translator has only two paths. Either the author is left in peace as far as possible and the reader is moved towards him, or the reader is left in peace and the author is moved towards the reader. The first approach, which later scholars labelled “foreignising”, preserves the strangeness of the original, including its unfamiliar rhythms and references. The second, “domesticating”, rewrites the text so that it conforms to what the new audience already expects. Schleiermacher himself favoured the former; the modern book trade, at least in English, has overwhelmingly chosen the latter." },
          { label: "C", text: "The case for domestication is not a foolish one. A reader who picks up a detective story from Stockholm or Tokyo generally wants to be absorbed in the plot, not reminded on every page that the dialogue was first written in a language with a different grammar. Sentences that follow the word order of the source can strike the reader as clumsy, and the clumsiness will be blamed on the author, who in the original may have been a master of elegance. To reproduce an awkwardness that was never there is hardly an act of fidelity. Defenders of the fluent style can reasonably claim that they are being faithful to something more important than vocabulary: the effect the book had on its first readers." },
          { label: "D", text: "The trouble is that fluency is not neutral. What counts as “natural” English is determined by the conventions that prevail in a handful of publishing centres, and a text made to conform to those conventions has had something removed. Forms of address that mark rank, proverbs with no equivalent, a dish whose name carries associations of poverty or celebration: all tend to be replaced by the nearest familiar thing or quietly dropped. Each individual decision is defensible. Their cumulative result, critics argue, is that books from very different cultures come to sound curiously alike, and the reader finishes with the comfortable impression that people everywhere think much as she does. It would be an exaggeration to call this deception, but it is certainly a loss, and one that the reader is in no position to detect." },
          { label: "E", text: "There is a further consequence, of a more practical kind. A profession whose highest achievement is to pass unnoticed will find it difficult to claim recognition or reward. Translators' names have traditionally been left off book covers; reviews frequently discuss the “author's style” in a work of which the reviewer has read not one word that the author wrote; and rates of pay reflect the common view that translating is a mechanical service and not a form of writing. It is no coincidence that the recent campaign demanding that the translator's name appear on the cover has been led by translators themselves. Invisibility, in other words, is not merely an aesthetic preference. It has economic effects, and they fall on those least able to object." },
          { label: "F", text: "None of this means that the remedy is to make translations deliberately difficult. Some advocates of foreignising write as though any discomfort caused to the reader were a virtue in itself, and the results can be unreadable: texts so loaded with untranslated terms and footnotes that only specialists persevere. A translation that nobody finishes serves the foreign author no better than one which smooths her into blandness. Moreover, the opposition between the two methods is too tidy. In practice every translator moves between them many times on a single page, keeping an unfamiliar image here and substituting a familiar one there, and it is in the quality of these countless small judgements, not in loyalty to a theory, that the merit of a translation lies." },
          { label: "G", text: "The arrival of machine translation has given the old argument a new edge. Automated systems are trained on enormous quantities of existing text and produce, by design, the most statistically probable wording. They are therefore fluent in exactly the sense that critics distrust: they favour the expected phrase over the surprising one. For timetables, manuals and routine correspondence this is precisely what is wanted, and it would be perverse to complain. Literature is another matter, since what distinguishes a literary text is very often the unexpected choice. Whether machines will eventually handle such choices as well as people do is not a question that can be settled yet; what seems clear is that, as fluent text becomes effortless to produce, fluency alone will cease to be evidence of skill." },
          { label: "H", text: "Where does this leave the reader? Not, I think, with an obligation to prefer difficult books. What can be asked of readers is something more modest: to remember that a translated work has two authors, to notice who the second one is, and to accept that an occasional moment of strangeness may be a sign not of a translator's failure but of an honest attempt to show that the book has come from somewhere else." },
        ],
      },
      { t: "p", text: "**Questions 27–31** — Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq", id: "t4d27-doc-p3-chon", title: "Questions 27–31 — Multiple choice",
        items: [
          { q: "27. In the first paragraph, the writer's main point about the praise given by reviewers is that it", options: ["is usually reserved for books first written in English.", "takes for granted a standard that ought to be examined.", "gives translators more credit than they deserve.", "is based on careful comparison with the original text."], correct: 1, why: "Đoạn A: “rarely stated, let alone questioned. Yet it rests on an assumption that deserves scrutiny”. takes for granted = rarely questioned; ought to be examined = deserves scrutiny. C ngược: dịch giả được khen vì “biến mất”. D không có." },
          { q: "28. According to the second paragraph, Schleiermacher", options: ["invented the terms “foreignising” and “domesticating”.", "thought that translators should combine the two approaches.", "preferred translations that take the reader towards the author.", "foresaw the direction that publishing would later take."], correct: 2, why: "Đoạn B: “Schleiermacher himself favoured the former” — the former = cách thứ nhất = “the reader is moved towards him”. A sai: hai thuật ngữ do “later scholars” đặt. B sai: “only two paths… Either… or”. D không có." },
          { q: "29. The writer mentions detective stories in order to", options: ["illustrate why a smooth translation may be exactly what readers reasonably want.", "argue that popular fiction does not deserve careful translation.", "suggest that crime fiction loses more in translation than other genres.", "give an example of a genre that is seldom translated."], correct: 0, why: "Câu hỏi mục đích của ví dụ. Đoạn C mở bằng “The case for domestication is not a foolish one”; truyện trinh thám minh hoạ người đọc muốn “be absorbed in the plot”. B, C, D đều không được nói tới." },
          { q: "30. What does the writer say about the translation decisions described in the fourth paragraph?", options: ["They are taken by publishers and not by translators.", "They amount to deliberately misleading the reader.", "They are usually noticed by attentive readers.", "Each can be justified, but together they make different cultures seem similar."], correct: 3, why: "Đoạn D: “Each individual decision is defensible. Their cumulative result… books from very different cultures come to sound curiously alike”. B quá tay: “an exaggeration to call this deception”. C ngược: “the reader is in no position to detect”." },
          { q: "31. What is the writer's view of translations that are made deliberately foreign?", options: ["They are the only honest way to translate literature.", "They are of more use to foreign authors than fluent versions are.", "They can fail the author just as badly as over-smooth versions do.", "They have become common in modern publishing."], correct: 2, why: "Đoạn F: “A translation that nobody finishes serves the foreign author no better than one which smooths her into blandness.” no better than = just as badly as. D ngược với đoạn B (ngành sách chọn domesticating)." },
        ],
      },
      { t: "p", text: "**Questions 32–36** — Do the following statements agree with the views of the writer in Reading Passage 3? Choose **YES** if the statement agrees with the views of the writer, **NO** if the statement contradicts the views of the writer, or **NOT GIVEN** if it is impossible to say what the writer thinks about this." },
      {
        t: "mcq", id: "t4d27-doc-p3-ynng", title: "Questions 32–36 — YES / NO / NOT GIVEN",
        items: [
          { q: "32. Word order copied from the source language can make a skilful author appear to write badly.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn C: câu theo trật tự từ của bản gốc “strike the reader as clumsy, and the clumsiness will be blamed on the author, who… may have been a master of elegance”." },
          { q: "33. Translated novels sell better in English-speaking countries when the translator is named on the cover.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn E có nói tới chiến dịch đòi in tên dịch giả lên bìa, nhưng không nói gì về doanh số. Cùng chủ đề, không có thông tin ⇒ NOT GIVEN." },
          { q: "34. The low pay of translators is connected with a belief that their work is not creative.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn E: “rates of pay reflect the common view that translating is a mechanical service and not a form of writing”. reflect = is connected with; mechanical… not a form of writing = not creative." },
          { q: "35. A translator ought to choose one of the two methods and apply it consistently throughout a book.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F: “the opposition between the two methods is too tidy… every translator moves between them many times on a single page”, và giá trị nằm ở các phán đoán nhỏ, “not in loyalty to a theory” ⇒ NO." },
          { q: "36. Machine translation is an unsuitable tool for practical documents such as manuals.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn G: với “timetables, manuals and routine correspondence this is precisely what is wanted” ⇒ ngược với unsuitable ⇒ NO." },
        ],
      },
      { t: "p", text: "**Questions 37–40** — Complete the summary using the list of words, **A–H**, below. — **Machines and readers** — Translation software generates whatever wording is most **37** ___ , which is why its output reads smoothly. The writer regards this as ideal for **38** ___ texts, but not for literature, in which an author's choices are often **39** ___ . The writer's conclusion is that readers need not seek out hard books; they should, however, recognise the translator as a second **40** ___ ." },
      {
        t: "table",
        head: ["A", "B", "C", "D", "E", "F", "G", "H"],
        rows: [["surprising", "critic", "likely", "accurate", "author", "everyday", "expensive", "ancient"]],
      },
      {
        t: "quiz", id: "t4d27-doc-p3-hop-tu", kind: "fill", title: "Questions 37–40 — viết chữ cái A–H",
        items: [
          { q: "37", answers: ["C"], hint: "Đoạn G: “the most statistically probable wording”. probable = likely. accurate (D) hợp ngữ pháp nhưng bài không nói máy dịch chính xác nhất." },
          { q: "38", answers: ["F"], hint: "Đoạn G: “timetables, manuals and routine correspondence”. routine = everyday." },
          { q: "39", answers: ["A"], hint: "Đoạn G: “what distinguishes a literary text is very often the unexpected choice”. unexpected = surprising." },
          { q: "40", answers: ["E"], hint: "Đoạn H: “a translated work has two authors, to notice who the second one is”. critic (B) là bẫy: bài có nhắc critics nhưng không phải ở ý này." },
        ],
      },

      /* ── Chấm ── */
      { t: "h", text: "Hết 60 phút — chấm điểm và so với hai lần trước" },
      {
        t: "table",
        head: ["Số câu đúng / 40", "Band Reading (ước tính)", "Nghĩa là"],
        rows: [
          ["33–36", "7.5 – 8.0", "Vượt mục tiêu Tập 4; sang Tập 5 luyện 55 phút"],
          ["30–32", "7.0", "Đạt mục tiêu cuối tập"],
          ["27–29", "6.5", "Còn 1–3 câu: xem bảng dưới, sửa đúng MỘT dạng trước Ngày 29"],
          ["23–26", "6.0", "Làm lại Ngày 13 và Ngày 21 không bấm giờ, đọc kỹ phần giải thích"],
          ["≤ 22", "≤ 5.5", "Ôn Tập 3 Ngày 27 · 29 rồi làm lại bài này sau một tuần"],
        ],
        caption: "Bảng quy đổi phổ biến của Reading Academic; band chỉ là ước tính.",
      },
      {
        t: "table",
        head: ["Ghi lại", "Lần 1 (Ngày 13)", "Lần 2 (Ngày 21)", "Lần 3 (hôm nay)"],
        rows: [
          ["Tổng / 40", "…", "…", "…"],
          ["Passage 3 (số câu đúng)", "… / 14", "… / …", "… / 14"],
          ["Phút dùng cho Passage 1", "…", "…", "…"],
          ["Dạng sai nhiều nhất", "…", "…", "…"],
        ],
        caption: "Chép bảng này vào sổ lỗi. Ngày 29 sẽ dùng nó để chọn thứ tự làm passage cho riêng bạn.",
      },
      {
        t: "table",
        head: ["Bạn sai ở", "Nguyên nhân thường gặp", "Ôn lại"],
        rows: [
          ["Câu 1–7 (TFNG)", "Nhầm NOT GIVEN với FALSE (câu 5, 7); bỏ qua bẫy thời điểm (câu 3)", "Tập 4 Ngày 5"],
          ["Câu 8–13 (Notes)", "Không nhận ra từ đồng nghĩa trong ghi chú (upright = vertical)", "Tập 4 Ngày 11"],
          ["Câu 14–18 (Matching information)", "Dò theo TỪ thay vì theo LOẠI thông tin (a comparison, a claim, evidence)", "Tập 4 Ngày 19"],
          ["Câu 19–23 (Matching features)", "Quên NB: một người có thể dùng hai lần; không khái quát được kết quả", "Tập 4 Ngày 23"],
          ["Câu 24–26 (Sentence)", "Điền thiếu từ (pack) hoặc từ không hợp ngữ pháp (empathy)", "Tập 3 Ngày 9"],
          ["Câu 27–31 (MCQ)", "Chọn phương án quá tay (deception) hoặc ngược (the former / the latter)", "Tập 4 Ngày 7"],
          ["Câu 32–36 (YNNG)", "Cùng chủ đề nhưng bài không nêu ý kiến (câu 33)", "Tập 4 Ngày 5 · 9"],
          ["Câu 37–40 (Summary hộp từ)", "Chọn từ có trong bài (critic) nhưng không đúng ý", "Tập 4 Ngày 25"],
          ["Không kịp Passage 3", "Passage 1 quá 17 phút; kẹt ở Matching information", "mục 1 bài này · Ngày 29"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: bốn kiểu paraphrase mức band 7 trong đề hôm nay",
        items: [
          "**Từ cụ thể → từ khái quát**: beds and storage shelves → furniture (câu 2) · relative, friend, acquaintance, stranger → the closer the relationship (câu 19) · carbon dioxide, pure oxygen → the gases (câu 20).",
          "**Đổi cách nói phủ định**: serves… no better than → fail… just as badly as (câu 31) · never simply shovelled in ↔ can be tipped in with a shovel (câu 6).",
          "**Gọi tên chức năng thay cho nội dung**: “much as a radiator cools an engine” → a comparison… with a machine (câu 15) · “survived more attempts to disprove it” → resisted refutation (câu 17).",
          "**Đại từ chỉ ngược**: the former / the latter (câu 28) — luôn dò lại xem cái nào được nêu TRƯỚC.",
        ],
      },

      /* ── Soi lại ── */
      { t: "h", text: "Soi lại ba bài đọc: giả định và fronting của Bài 1 xuất hiện ở đâu" },
      { t: "p", text: "Văn học thuật dùng đúng các cấu trúc bạn vừa học — không dày, nhưng luôn ở **chỗ chuyển ý**. Tìm lại trong ba passage và điền **MỘT từ** đúng như bài viết." },
      {
        t: "quiz", id: "t4d27-doc-soi", kind: "fill", title: "Điền MỘT từ lấy từ ba passage (6 câu)",
        items: [
          { q: "1. Passage 3, đoạn A: So widely ___ is this ideal of invisibility… that it is rarely stated.", answers: ["shared"], hint: "So + adv + V3 + be + S + that… (fronting kiểu 3)" },
          { q: "2. Passage 3, đoạn E: the recent campaign demanding that the translator's name ___ on the cover", answers: ["appear"], hint: "demand that + S + V nguyên mẫu — name số ít nhưng không thêm -s" },
          { q: "3. Passage 3, đoạn F: as though any discomfort caused to the reader ___ a virtue in itself", answers: ["were"], hint: "as though + điều người viết cho là không thật" },
          { q: "4. Passage 2, đoạn A: ___ is the habit confined to our own species.", answers: ["Nor"], hint: "Nor + be + S — đảo ngữ, Ngày 7 mục 8" },
          { q: "5. Passage 1, đoạn E: Equally important to farmers ___ the shelter the walls provide.", answers: ["is"], hint: "bổ ngữ lên đầu + be + S (fronting kiểu 1)" },
          { q: "6. Passage 2, đoạn B: If the traditional theory ___ correct, the first condition should have produced more yawns.", answers: ["were"], hint: "giả thiết trái sự thật" },
        ],
      },

      /* ── Từ vựng ── */
      { t: "h", text: "Từ vựng hữu ích từ ba bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "scrutiny", pos: "n", ipa: "/ˈskruːtəni/", vi: "sự xem xét kỹ lưỡng", ex: "The assumption deserves closer scrutiny.", exVi: "Giả định đó đáng được xem xét kỹ hơn.", more: "come under scrutiny · public scrutiny · scrutinise (v)" },
          { w: "cumulative", pos: "adj", ipa: "/ˈkjuːmjələtɪv/", vi: "tích luỹ, cộng dồn", ex: "The cumulative effect of small changes can be large.", exVi: "Tác động cộng dồn của những thay đổi nhỏ có thể rất lớn.", more: "cumulative effect / impact / result · họ từ: accumulate (AWL 8)" },
          { w: "defensible", pos: "adj", ipa: "/dɪˈfensəbl/", vi: "có thể biện hộ được, có lý", ex: "Each decision was defensible in itself.", exVi: "Từng quyết định riêng lẻ đều có lý." , more: "a defensible position · trái nghĩa: indefensible" },
          { w: "persevere", pos: "v", ipa: "/ˌpɜːsəˈvɪə(r)/", vi: "kiên trì đến cùng", ex: "Only specialists persevere with such a text.", exVi: "Chỉ giới chuyên môn mới kiên trì đọc hết một văn bản như vậy.", more: "persevere with / in sth · perseverance (n)" },
          { w: "disprove", pos: "v", ipa: "/ˌdɪsˈpruːv/", vi: "bác bỏ (bằng bằng chứng)", ex: "The experiment disproved the oxygen theory.", exVi: "Thí nghiệm đã bác bỏ thuyết thiếu oxy.", more: "đồng nghĩa trang trọng: refute · danh từ: refutation" },
          { w: "susceptible", pos: "adj", ipa: "/səˈseptəbl/", vi: "dễ bị (ảnh hưởng, mắc)", ex: "Children are more susceptible to advertising.", exVi: "Trẻ em dễ bị quảng cáo tác động hơn.", more: "susceptible **to** sth · susceptibility (n)" },
          { w: "synchronise", pos: "v", ipa: "/ˈsɪŋkrənaɪz/", vi: "làm cho đồng bộ", ex: "The signal helps to synchronise the group.", exVi: "Tín hiệu giúp đồng bộ cả nhóm.", more: "synchronise A **with** B · in sync (nói)" },
          { w: "contagious", pos: "adj", ipa: "/kənˈteɪdʒəs/", vi: "dễ lây (bệnh, cảm xúc)", ex: "Her enthusiasm was contagious.", exVi: "Sự nhiệt tình của cô ấy lan sang người khác.", more: "highly contagious · khác **infectious** rất ít; contagious hay dùng nghĩa bóng" },
          { w: "intangible", pos: "adj", ipa: "/ɪnˈtændʒəbl/", vi: "phi vật thể, khó nắm bắt", ex: "Crafts are part of a country's intangible heritage.", exVi: "Nghề thủ công là một phần di sản phi vật thể của một nước.", more: "intangible benefits / assets · trái nghĩa: tangible" },
          { w: "prevail", pos: "v", ipa: "/prɪˈveɪl/", vi: "thịnh hành; thắng thế", ex: "Different conventions prevail in different countries.", exVi: "Mỗi nước thịnh hành những quy ước khác nhau.", more: "prevailing view / wind · prevail **over** sth" },
        ],
      },
      { t: "note", title: "📌 Ghi nhớ sau lần 3", items: ["Chép **mọi câu sai** vào sổ lỗi theo ba cột: dạng câu · vì sao sai · câu trong bài chứa đáp án.", "Passage 3 dưới 10/14: đọc lại Passage 3 **không bấm giờ**, gạch mọi từ nhượng bộ và từ chỉ thái độ; rồi làm lại 14 câu.", "Ngày 29 học cách **chọn thứ tự passage theo độ khó cá nhân** — mang theo bảng ba lần hôm nay."] },
    ],
  },

  /* ═══════════════════════ BÀI 3 — NÓI ═══════════════════════ */
  {
    id: "t4d27-noi",
    kind: "speaking",
    title: "Nói: Full test 14 phút — tự thu âm, tự chấm 4 tiêu chí · 🔊 tự chẩn 44 âm",
    goal: "Tự chạy trọn một bài thi Speaking 11–14 phút (Part 1 → 2 → 3) không dừng, thu âm lại, rồi nghe và tự chấm theo bốn tiêu chí FC · LR · GRA · P bằng phiếu 12 dấu hiệu band 7; đọc 12 câu chẩn đoán để biết trong 44 âm tiếng Anh mình còn yếu âm nào và phải ôn ở đâu trước buổi giám khảo AI Ngày 30.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        items: [
          "Hôm nay bạn là **thí sinh và giám khảo** của chính mình: thi trọn 14 phút, thu âm, nghe lại, chấm.",
          "Luật khi thu: **không dừng, không thu lại, không nhìn ghi chú** (trừ 1 phút chuẩn bị Part 2).",
          "Tự chấm bằng **số đếm được**: số lần ngập ngừng dài, số từ ít gặp dùng đúng, số câu phức không lỗi, số từ phát âm sai.",
          "Band 7 không phải là không lỗi: là **nói dài không gắng sức**, tự sửa nhanh, từ vựng linh hoạt, câu phức thường xuyên đúng.",
          "🔊 12 câu chẩn đoán phủ **44 âm** (20 nguyên âm + 24 phụ âm): âm nào máy chấm thấp ⇒ ôn đúng ngày đã dạy âm đó.",
          "Kết quả hôm nay là bản nháp cho **Ngày 30** (giám khảo AI 14 phút).",
        ],
      },

      { t: "h", text: "1. Bài thi Nói 11–14 phút diễn ra thế nào" },
      {
        t: "table",
        head: ["Phần", "Thời gian", "Giám khảo làm gì", "Bạn cần làm gì ở band 7"],
        rows: [
          ["Part 1", "4–5 phút", "hỏi 10–12 câu về 3 chủ đề quen thuộc", "mỗi câu **2–3 câu nói**: trả lời thẳng + lý do / chi tiết cụ thể (Ngày 2)"],
          ["Part 2", "1 phút chuẩn bị + 1–2 phút nói", "đưa thẻ đề, bấm giờ, có thể hỏi thêm 1 câu ngắn", "nói **đủ 2 phút**, có câu chuyện nhỏ, có cảm nhận (Ngày 6 · 10 · 14 · 26)"],
          ["Part 3", "4–5 phút", "hỏi 4–6 câu trừu tượng, hỏi dồn “Why?”", "mỗi câu **40–60 giây**: quan điểm → lý do → ví dụ → rào đón / phản đề (Ngày 3 · 7 · 11 · 15 · 19 · 23)"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Quy trình tự thu — 5 bước",
        steps: [
          { label: "Chuẩn bị 3 phút", sub: "phòng yên tĩnh · điện thoại ở chế độ máy bay · giấy bút cho Part 2" },
          { label: "Bấm thu, làm Part 1", sub: "đọc to câu hỏi rồi trả lời ngay; khoảng 4 phút rưỡi" },
          { label: "Part 2", sub: "đọc đề · ghi ý đúng 1 phút · nói 2 phút, có đồng hồ" },
          { label: "Part 3", sub: "6 câu, mỗi câu 40–60 giây" },
          { label: "Nghỉ 10 phút rồi mới nghe lại", sub: "nghe 2 lượt: lượt 1 ghi FC + P, lượt 2 ghi LR + GRA" },
        ],
      },
      { t: "note", title: "📌 Ghi nhớ: hai cách thu", items: ["**Cách A (khuyên dùng)**: thu bằng ba khối ghi âm dưới đây — mỗi khối một phần, AI chấm sau khi bạn tự chấm xong. So điểm của mình với điểm AI.", "**Cách B**: thu một mạch bằng ứng dụng ghi âm của điện thoại để giữ đúng cảm giác 14 phút liền; sau đó thu lại từng phần vào khối để AI chấm.", "Dù cách nào: **tự chấm TRƯỚC**, xem điểm AI SAU. Mục đích là luyện tai giám khảo của chính bạn."] },

      { t: "h", text: "2. Đề thi — Part 1 (4–5 phút)" },
      { t: "p", text: "Ba chủ đề: **việc học / việc làm · buổi sáng · bản đồ**. Trả lời mỗi câu 2–3 câu nói, khoảng 15–20 giây. Không học thuộc — nói như đang trò chuyện." },
      {
        t: "speak", id: "t4d27-noi-p1", part: "1",
        questions: [
          "Do you work, or are you a student?",
          "What do you find most demanding about your studies or your job?",
          "Is there anything you would change about your daily timetable?",
          "Would you say you are a morning person?",
          "What do you usually do in the first hour after you wake up?",
          "Has your morning routine changed much in the last few years?",
          "Do you think it matters what time people get up?",
          "How often do you use maps?",
          "Do you prefer a map on your phone or a paper map?",
          "Were you taught how to read a map at school?",
          "Have you ever got lost even though you had a map?",
          "Do you think people will still need map-reading skills in the future?",
        ],
      },

      { t: "h", text: "3. Đề thi — Part 2 (1 phút chuẩn bị + 2 phút nói)" },
      { t: "p", text: "Ghi ý trong **đúng 1 phút**: chỉ ghi từ khoá theo bốn gạch đầu dòng + một chi tiết “đắt” (con số, câu nói của ai đó, cảm giác lúc ấy). Sau đó nói **đủ 2 phút**." },
      {
        t: "speak", id: "t4d27-noi-p2", part: "2",
        questions: [
          "Describe a time when you had to learn something in a short period of time. You should say: what you had to learn; why you had to learn it quickly; how you went about learning it; and explain how well you managed.",
        ],
      },

      { t: "h", text: "4. Đề thi — Part 3 (4–5 phút)" },
      { t: "p", text: "Sáu câu nối tiếp chủ đề **học nhanh, áp lực và cách học**. Mỗi câu 40–60 giây. Nếu chưa hiểu câu hỏi, hỏi lại một lần: “Sorry, do you mean… ?”" },
      {
        t: "speak", id: "t4d27-noi-p3", part: "3",
        questions: [
          "Why do some people pick up new skills faster than others?",
          "Is it better to learn under pressure or without a deadline?",
          "Do adults learn in a different way from children?",
          "Some people say that what is learned quickly is forgotten quickly. To what extent do you agree?",
          "How has technology changed the way people learn new skills?",
          "Should schools teach students how to learn, and not only what to learn?",
        ],
      },

      { t: "h", text: "5. Nghe mẫu trước khi chấm: band 6 và band 7 cho cùng một câu hỏi" },
      { t: "p", text: "Nghe hai câu trả lời cho câu Part 3 số 2, rồi bài Part 2 mức band 7. Đừng chép lại — hãy nghe xem **khác nhau ở đâu**, vì đó chính là thứ bạn sẽ tìm trong bản thu của mình." },
      {
        t: "dialogue", title: "Part 3 — câu trả lời band 6 (ước tính), khoảng 25 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Is it better to learn under pressure or without a deadline?", vi: "Học dưới áp lực thì tốt hơn hay học không có hạn chót thì tốt hơn?" },
          { who: "Candidate", role: "candidate", text: "I think learn under pressure is better. Because when you have deadline, you must focus and you don't waste time. For example, before the exam I study very hard, but when there is no exam I am lazy. But pressure is also bad, because some people feel stress and they cannot learn well. So it depends on the person. For me, I prefer have a deadline.", vi: "Em nghĩ học dưới áp lực thì tốt hơn. Vì khi có hạn chót, mình phải tập trung và không lãng phí thời gian. Ví dụ, trước kỳ thi em học rất chăm, nhưng khi không có thi thì em lười. Nhưng áp lực cũng không tốt, vì một số người bị căng thẳng và không học tốt được. Nên tuỳ người. Với em, em thích có hạn chót." },
        ],
      },
      {
        t: "dialogue", title: "Part 3 — câu trả lời band 7 (ước tính), khoảng 50 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Is it better to learn under pressure or without a deadline?", vi: "Học dưới áp lực thì tốt hơn hay học không có hạn chót thì tốt hơn?" },
          { who: "Candidate", role: "candidate", text: "I'd say it depends on what kind of learning we're talking about. For something practical and clearly defined, passing a driving test, say, a deadline is a real advantage, because it forces you to prioritise. Without one, most of us would put it off indefinitely. I certainly would. But for anything that requires deep understanding, pressure can be counterproductive. People under stress tend to memorise instead of thinking, and what's memorised in a panic tends to vanish just as quickly. So, ideally, I'd rather learners were given a deadline that's firm but generous: enough to keep them moving, but not so tight that they cut corners.", vi: "Em cho là còn tuỳ mình đang nói tới kiểu học nào. Với thứ thực hành và có đích rõ ràng, chẳng hạn thi bằng lái, hạn chót là lợi thế thật sự vì nó buộc mình sắp thứ tự ưu tiên. Không có nó, đa số chúng ta sẽ hoãn mãi. Em thì chắc chắn vậy. Nhưng với thứ cần hiểu sâu, áp lực có thể phản tác dụng. Người bị căng thẳng thường học thuộc thay vì suy nghĩ, và thứ thuộc trong lúc hoảng cũng biến mất nhanh y như thế. Nên lý tưởng nhất, em muốn người học được cho một hạn chót chắc nhưng rộng rãi: đủ để họ không dừng lại, nhưng không gấp tới mức làm ẩu." },
        ],
      },
      {
        t: "dialogue", title: "Part 2 — bài mẫu band 7 (ước tính), khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about the ten days in which I had to teach myself SQL, which is the language used to get information out of databases. It was last summer. I'd applied for an internship at a logistics firm more or less on impulse, and to my surprise they invited me to a technical test. The trouble was that the test was on databases, which I'd barely touched. So I had ten days, and had I not been so keen on that particular company, I'd probably have withdrawn.", vi: "Em muốn kể về mười ngày em phải tự học SQL, ngôn ngữ dùng để lấy thông tin từ cơ sở dữ liệu. Đó là mùa hè năm ngoái. Em nộp đơn thực tập ở một công ty logistics gần như theo hứng, và thật bất ngờ họ mời em làm bài kiểm tra kỹ thuật. Khổ nỗi bài kiểm tra lại về cơ sở dữ liệu, thứ em hầu như chưa đụng tới. Vậy là em có mười ngày, và nếu không quá thích công ty đó thì có lẽ em đã rút lui." },
          { who: "Candidate", role: "candidate", text: "What I did first was resist the temptation to watch hours of videos. Instead, I found a set of about sixty practice problems and simply started, looking things up only when I got stuck. Each evening I rewrote the ones I'd got wrong, from memory. I also persuaded a friend in the year above to look over my answers. His main recommendation was that I explain each query out loud, as if I were teaching it, which felt silly but worked remarkably well.", vi: "Việc đầu tiên em làm là cưỡng lại ham muốn xem video hàng giờ. Thay vào đó, em tìm một bộ khoảng sáu mươi bài tập và cứ thế bắt đầu, chỉ tra cứu khi bị kẹt. Mỗi tối em viết lại những bài làm sai, theo trí nhớ. Em còn thuyết phục một anh bạn khoá trên xem giúp bài làm. Lời khuyên chính của anh ấy là em hãy giải thích to từng câu truy vấn, như thể đang dạy lại nó — nghe hơi ngớ ngẩn nhưng hiệu quả bất ngờ." },
          { who: "Candidate", role: "candidate", text: "As for how well I managed, I passed the test, though not brilliantly. There was one question that I made a complete mess of. But what stayed with me wasn't the result. It was the discovery that a deadline, uncomfortable as it was, forced me to practise instead of just reading. Only afterwards did I realise that I'd learned more in those ten days than in some entire modules. I've tried to study that way ever since.", vi: "Còn chuyện em làm tốt tới đâu thì em qua được bài kiểm tra, dù không xuất sắc. Có một câu em làm hỏng hoàn toàn. Nhưng điều đọng lại với em không phải là kết quả. Đó là phát hiện rằng hạn chót, dù khó chịu, đã buộc em phải luyện tập thay vì chỉ đọc. Mãi sau này em mới nhận ra mười ngày đó em học được nhiều hơn cả vài học phần. Từ đó em luôn cố học theo cách ấy." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6 (bản Part 3 trên)", "Band 7 (hai bản mẫu)"],
        rows: [
          ["**FC** — trôi chảy, mạch lạc", "5 câu ngắn rời nhau, nối bằng Because / But / So; hết ý sau 25 giây", "mở bằng khung “it depends on…”, hai vế đối xứng (For something practical… But for anything that…), tự kết bằng So, ideally…"],
          ["**LR** — từ vựng", "focus · waste time · lazy · stress — đúng nhưng phổ thông; lặp deadline, pressure", "prioritise · put it off indefinitely · counterproductive · cut corners · on impulse · make a mess of — từ ít gặp, đúng collocation"],
          ["**GRA** — ngữ pháp", "lỗi lặp lại: ~~learn under pressure is~~ · ~~have deadline~~ · ~~prefer have~~; hầu hết câu đơn", "I'd rather learners **were given**… · **had I not been** so keen… · recommendation **that I explain**… · uncomfortable **as it was** · **Only afterwards did I** realise — đa dạng, không lỗi"],
          ["**P** — phát âm", "đều đều, nhấn mọi từ như nhau", "nhấn từ tương phản (PRACtical ↔ DEEP understanding), ngắt đúng cụm, lên giọng ở “say,” rồi xuống ở cuối ý"],
        ],
        caption: "Chú ý: bản band 7 dùng đúng năm cấu trúc của Bài 1 hôm nay — mỗi cấu trúc MỘT lần, ở chỗ tự nhiên.",
      },

      { t: "h", text: "6. Phiếu tự chấm — 12 dấu hiệu band 7" },
      { t: "p", text: "Nghe lại bản thu **hai lượt**. Với mỗi dòng, ghi **Có** hoặc **Chưa** kèm một bằng chứng (phút : giây). Đừng chấm theo cảm giác “nghe cũng được” — chấm theo thứ đếm được." },
      {
        t: "table",
        head: ["#", "Tiêu chí", "Dấu hiệu band 7 (đếm được)", "Cách kiểm khi nghe lại"],
        rows: [
          ["1", "FC", "Part 2 nói **đủ 1 phút 45 giây trở lên**, không cần giám khảo nhắc", "xem đồng hồ bản thu"],
          ["2", "FC", "Cả bài **không quá 5 lần** ngập ngừng dài hơn 2 giây để tìm TỪ", "gạch một vạch mỗi lần im quá 2 giây"],
          ["3", "FC", "Dùng **≥ 6 từ nối khác nhau** ngoài and / but / so / because (mind you · having said that · as for…)", "ghi lại từng từ nối nghe được"],
          ["4", "FC", "Mỗi câu Part 3 có **ít nhất hai tầng**: quan điểm + lý do / ví dụ / phản đề", "đánh dấu câu nào chỉ có một tầng"],
          ["5", "LR", "**≥ 8 từ / cụm ít gặp** dùng đúng (collocation, idiom, phrasal verb)", "chép ra; tra lại những cụm chưa chắc"],
          ["6", "LR", "Khi bí từ, **diễn đạt vòng** được thay vì im (the thing you use to… · it's a kind of…)", "tìm chỗ bí từ: mình im hay nói vòng?"],
          ["7", "LR", "Không lặp một tính từ “dễ” quá 3 lần (good · important · interesting)", "đếm từ lặp nhiều nhất"],
          ["8", "GRA", "**≥ 5 kiểu câu phức** khác nhau: quan hệ, điều kiện, nhượng bộ, câu chẻ, giả định…", "ghi mỗi kiểu một ví dụ"],
          ["9", "GRA", "**Hơn nửa số câu không lỗi**; lỗi còn lại là lỗi nhỏ (mạo từ, giới từ)", "chọn 20 câu liên tiếp, đếm câu sạch"],
          ["10", "GRA", "Thì động từ **đúng mốc thời gian** khi kể chuyện Part 2 (quá khứ đơn / hoàn thành)", "nghe riêng các động từ ở Part 2"],
          ["11", "P", "Người lạ nghe **hiểu hết không cần cố**; không quá 5 từ phải đoán", "nhờ một người bạn nghe 2 phút, hoặc xem bản chép của AI"],
          ["12", "P", "Có **nhấn từ khoá và lên xuống giọng**; âm cuối -s / -ed / -t không rụng", "nghe 30 giây đầu Part 3: giọng có đều đều không?"],
        ],
      },
      {
        t: "table",
        head: ["Số dòng “Có”", "Ước lượng", "Việc cần làm trước Ngày 30"],
        rows: [
          ["10–12", "quanh band 7.0–7.5", "giữ nhịp: mỗi ngày một đề Part 2 + hai câu Part 3"],
          ["7–9", "quanh band 6.5", "chọn tiêu chí có nhiều “Chưa” nhất, làm theo bảng dưới trong 3 ngày"],
          ["≤ 6", "quanh band 6.0 hoặc thấp hơn", "thu lại bài hôm nay vào ngày mai sau khi làm theo bảng dưới; so hai bản"],
        ],
        caption: "Chỉ là ước lượng để định hướng — điểm thật do giám khảo chấm trên toàn bộ bài nói.",
      },
      {
        t: "table",
        head: ["Yếu nhất ở", "Bài tập 15 phút mỗi ngày", "Ôn lại"],
        rows: [
          ["FC — ngập ngừng, hết ý sớm", "Nói 2 phút về một đề Part 2 bất kỳ, **cấm dừng**; bí thì nói vòng. Thu, đếm số lần im.", "Tập 4 Ngày 3 (discourse markers) · Ngày 6 (câu chuyện bốn nhịp)"],
          ["LR — từ phổ thông, lặp", "Lấy bản chép lời của mình, gạch 5 từ “dễ”, thay bằng collocation đã học; nói lại câu đó.", "Tập 4 Ngày 18 (idiom & register) · bài Từ vựng Ngày 28"],
          ["GRA — câu đơn, lỗi lặp", "Viết ra 3 lỗi mình lặp nhiều nhất; mỗi lỗi đặt 5 câu đúng, đọc to.", "Tập 4 Ngày 23 (ngữ pháp nói) · Bài 1 hôm nay"],
          ["P — đều đều, rụng âm cuối", "Đọc theo (shadowing) bản mẫu band 7 ở mục 5, từng câu; thu và so.", "Tập 4 Ngày 2 · 11 · 22 · mục 7 dưới đây"],
        ],
      },
      { t: "rule", formula: "Tự chấm = đếm: lần im > 2 giây · từ ít gặp dùng đúng · kiểu câu phức · từ người nghe phải đoán", vi: "Bốn con số, bốn tiêu chí. Con số nào xấu nhất thì luyện tiêu chí đó trước." },

      { t: "h", text: "7. 🔊 Tự chẩn 44 âm — 12 câu, mỗi câu một nhóm âm" },
      { t: "p", text: "Tiếng Anh (giọng Anh chuẩn) có **44 âm**: 12 nguyên âm đơn, 8 nguyên âm đôi, 24 phụ âm. Mười hai câu dưới đây chứa đủ cả 44. Đọc mỗi câu **một lần, tốc độ tự nhiên**; máy chấm từng từ. Từ nào điểm thấp, dò bảng để biết âm nào và ôn ở đâu." },
      {
        t: "table",
        head: ["Câu", "Âm được kiểm", "Lỗi người Việt hay mắc", "Ôn lại"],
        rows: [
          ["1", "/iː/ – /ɪ/", "đọc hai âm như nhau (sit = seat)", "Tập 1 Ngày 4 · 14"],
          ["2", "/e/ – /æ/", "/æ/ đọc thành /e/ (bad = bed)", "Tập 3 Ngày 2 · Tập 1 Ngày 4"],
          ["3", "/ʌ/ – /ɑː/ – /ɒ/", "/ʌ/ đọc thành “ă”, /ɒ/ thành “o” dài", "Tập 3 Ngày 2 · 6"],
          ["4", "/ʊ/ – /uː/ – /ɔː/", "good đọc như food; /ɔː/ thiếu độ dài", "Tập 1 Ngày 4 · Tập 3 Ngày 6"],
          ["5", "/ɜː/ – /ə/", "/ɜː/ đọc thành “ơ” ngắn; không làm yếu /ə/", "Tập 4 Ngày 3 · Tập 2 Ngày 15"],
          ["6", "/eɪ/ – /aɪ/ – /ɔɪ/", "/eɪ/ đọc thành “ê” đơn (lake = “lếch”)", "Tập 1 Ngày 6"],
          ["7", "/əʊ/ – /aʊ/", "/əʊ/ đọc thành “ô” đơn", "Tập 1 Ngày 6 · Tập 3 Ngày 6"],
          ["8", "/ɪə/ – /eə/ – /ʊə/", "share và sheer lẫn nhau", "Tập 3 Ngày 14 · Tập 1 Ngày 6"],
          ["9", "/θ/ – /ð/", "thành /t/, /d/ hoặc /s/, /z/", "Tập 1 Ngày 3 · 7 · Tập 2 Ngày 3 · Tập 3 Ngày 21"],
          ["10", "/ʃ/ – /ʒ/ – /tʃ/ – /dʒ/", "/ʒ/ thành /z/; /dʒ/ thành “gi”", "Tập 1 Ngày 8 · Tập 3 Ngày 13 · Tập 4 Ngày 10"],
          ["11", "/p b t d k ɡ f v/", "rụng âm cuối (kep’, par’); /v/ thành /b/", "Tập 2 Ngày 1 · Tập 1 Ngày 10 (/v/) · Tập 4 Ngày 13"],
          ["12", "/s z h m n ŋ l r j w/", "/z/ cuối từ thành /s/; /l/ cuối thành /n/", "Tập 2 Ngày 5 · Tập 1 Ngày 12 (/r/ /l/) · Tập 3 Ngày 26 (dark L) · Tập 4 Ngày 16 (/h/)"],
        ],
        caption: "Cột “Ôn lại” ghi ngày có luyện âm đó gần nhất; nếu không nhớ, mở mục Tra cứu → phát âm của từng tập.",
      },
      {
        t: "phatam",
        id: "t4d27-phat-am",
        title: "Tự chẩn 44 âm — 12 câu",
        note: "Đọc tự nhiên, không đọc từng từ. Sau khi máy chấm: ghi lại những TỪ dưới 80 điểm, dò bảng trên để biết thuộc nhóm âm nào. Ba nhóm thấp nhất = kế hoạch luyện 3 ngày tới (mỗi ngày 10 phút).",
        items: [
          { text: "Please sit still and read this simple list.", ipa: "pliːz sɪt stɪl ənd riːd ðɪs sɪmpl lɪst", vi: "Làm ơn ngồi yên và đọc danh sách đơn giản này." },
          { text: "The best plan had ten extra steps.", ipa: "ðə best plæn hæd ten ekstrə steps", vi: "Kế hoạch tốt nhất có thêm mười bước." },
          { text: "My brother's car stopped on a hot summer afternoon.", ipa: "maɪ brʌðəz kɑː stɒpt ɒn ə hɒt sʌmə ɑːftənuːn", vi: "Xe của anh tôi chết máy vào một buổi chiều hè nóng nực." },
          { text: "Good students should choose four short books.", ipa: "ɡʊd stjuːdnts ʃʊd tʃuːz fɔː ʃɔːt bʊks", vi: "Sinh viên giỏi nên chọn bốn cuốn sách ngắn." },
          { text: "The nurse returned to work early on Thursday.", ipa: "ðə nɜːs rɪtɜːnd tə wɜːk ɜːli ɒn θɜːzdeɪ", vi: "Cô y tá quay lại làm việc sớm vào thứ Năm." },
          { text: "They enjoy the quiet nights by the lake.", ipa: "ðeɪ ɪndʒɔɪ ðə kwaɪət naɪts baɪ ðə leɪk", vi: "Họ thích những đêm yên tĩnh bên hồ." },
          { text: "Go slowly round the old town house.", ipa: "ɡəʊ sləʊli raʊnd ði əʊld taʊn haʊs", vi: "Đi chậm vòng quanh ngôi nhà phố cổ." },
          { text: "It is clear that tourists share our fears.", ipa: "ɪt ɪz klɪə ðət tʊərɪsts ʃeə aʊə fɪəz", vi: "Rõ ràng là du khách cũng có nỗi lo như chúng ta." },
          { text: "I think that both of these methods are worth trying.", ipa: "aɪ θɪŋk ðət bəʊθ əv ðiːz meθədz ə wɜːθ traɪɪŋ", vi: "Tôi nghĩ cả hai phương pháp này đều đáng thử." },
          { text: "She usually watches a large television in the kitchen.", ipa: "ʃi juːʒuəli wɒtʃɪz ə lɑːdʒ telɪvɪʒn ɪn ðə kɪtʃɪn", vi: "Cô ấy thường xem một chiếc ti vi lớn trong bếp." },
          { text: "Five big dogs kept barking in the park over the road.", ipa: "faɪv bɪɡ dɒɡz kept bɑːkɪŋ ɪn ðə pɑːk əʊvə ðə rəʊd", vi: "Năm con chó to cứ sủa mãi trong công viên bên kia đường." },
          { text: "Young singers were happily rehearsing a long, lazy song in the morning.", ipa: "jʌŋ sɪŋəz wə hæpɪli rɪhɜːsɪŋ ə lɒŋ leɪzi sɒŋ ɪn ðə mɔːnɪŋ", vi: "Các ca sĩ trẻ vui vẻ tập một bài hát dài, lười biếng vào buổi sáng." },
        ],
      },
      { t: "note", title: "💡 Mẹo: biến kết quả hôm nay thành kế hoạch cho Ngày 30", items: ["Ghi vào sổ **ba dòng**: (1) tiêu chí yếu nhất + con số; (2) ba nhóm âm thấp nhất; (3) ba lỗi ngữ pháp lặp nhiều nhất.", "Ngày 28 và 29: mỗi ngày **15 phút** theo bảng ở mục 6 + **10 phút** phát âm.", "Ngày 30: thi với giám khảo AI 14 phút. Sau đó mở lại phiếu hôm nay — số dòng “Có” phải **tăng ít nhất 2**."] },
    ],
  },

  /* ═══════════════════════ BÀI TẬP VỀ NHÀ ═══════════════════════ */
  {
    id: "t4d27-bai-tap",
    kind: "homework",
    title: "Bài tập về nhà Ngày 27 — giả định, fronting, từ của ba bài đọc, chiến thuật Reading & tự chấm Speaking (36 câu + 1 đoạn viết)",
    goal: "Tự kiểm lại cả ngày trong khoảng 50 phút: chia đúng động từ sau lời yêu cầu – đề xuất, đảo đúng sau cụm nơi chốn, dịch câu Task 2 có cấu trúc trang trọng, sửa lỗi tinh, dùng đúng 10 từ của ba passage, nhớ nhịp 17 – 20 – 23 và 12 dấu hiệu band 7 khi tự chấm Nói; rồi viết một đoạn Task 2 có đúng một câu giả định và một câu fronting.",
    minutes: 50,
    blocks: [
      {
        t: "recap",
        items: [
          "Phần A (10 câu): ngữ pháp Bài 1 trộn lẫn — có câu **không** phải giả định để bạn không chia máy móc.",
          "Phần B (8 câu): từ vựng của ba passage, điền đúng dạng từ.",
          "Phần C (6 câu): dịch Việt → Anh câu dùng được ngay trong Task 2 / Part 3.",
          "Phần D (6 câu): sửa lỗi tinh — chỉ viết lại **phần sai**.",
          "Phần E (6 câu): chiến thuật Reading 60 phút và cách tự chấm Speaking.",
          "Cuối bài: một đoạn thân bài 110–140 từ, AI chấm 4 tiêu chí.",
        ],
      },

      { t: "h", text: "A. Ngữ pháp — chọn phương án đúng (10 câu)" },
      {
        t: "mcq", id: "t4d27-bt-ngu-phap", title: "A. Chọn phương án đúng",
        items: [
          { q: "1. The committee has proposed that the deadline for applications ___ by a fortnight.", options: ["be extended", "is extended", "will be extended", "extends"], correct: 0, why: "propose that + S + be + V3 (giả định bị động). Không chia theo the deadline." },
          { q: "2. The latest survey suggests that young people ___ more time online than ever before.", options: ["be spending", "should spend", "are spending", "spending"], correct: 2, why: "suggest ở đây = cho thấy (nêu sự thật) ⇒ chia thì bình thường: are spending (xu hướng đang diễn ra, có ‘than ever before’). Không dùng giả định be spending / should spend; spending thiếu động từ chia." },
          { q: "3. It's high time the university ___ its rules on plagiarism.", options: ["updates", "has updated", "update", "updated"], correct: 3, why: "It's high time + S + V2." },
          { q: "4. My parents would rather I ___ abroad for my master's degree, but I have already accepted the offer.", options: ["don't study", "hadn't studied", "won't study", "didn't study"], correct: 3, why: "would rather + chủ ngữ khác + V2 cho hiện tại / tương lai. hadn't studied dùng cho việc đã xảy ra trong quá khứ." },
          { q: "5. Among the most serious consequences of the drought ___ the loss of the entire rice harvest.", options: ["was", "were", "have been", "being"], correct: 0, why: "Chủ ngữ thật đứng sau: the loss (số ít) ⇒ was. Đừng hoà hợp với consequences hay drought." },
          { q: "6. ___ the evidence may be, it is not strong enough to justify a ban.", options: ["Although persuasive", "Persuasive as", "As persuasive", "Despite persuasive"], correct: 1, why: "adj + as + S + V, … = Although… Không thêm although / despite trước tính từ." },
          { q: "7. Online sales rose by 12% in 2023, as ___ the number of complaints about late delivery.", options: ["was", "had", "did", "were"], correct: 2, why: "rose = quá khứ đơn ⇒ did. Chủ ngữ sau dài (the number of complaints…)." },
          { q: "8. The documents were kept in a locked room lest anyone ___ them without permission.", options: ["didn't read", "read", "not read", "would not read"], correct: 1, why: "lest + S + V nguyên mẫu (hoặc should + V). lest đã có nghĩa ‘kẻo’ ⇒ không thêm not." },
          { q: "9. At the top of the hill ___ , visible from every part of the town.", options: ["does stand an old windmill", "an old windmill stands it", "stands an old windmill", "is standing it an old windmill"], correct: 2, why: "Cụm nơi chốn đầu câu + động từ chính + S. Không mượn does." },
          { q: "10. Câu nào ĐÚNG và tự nhiên nhất trong Task 2?", options: ["Equally important is cost.", "Equally important is the cost of maintaining the new facilities.", "Equally important are the cost of maintaining the facilities.", "Equally important the cost is of maintaining the facilities."], correct: 1, why: "Fronting cần chủ ngữ dài mang thông tin mới, và động từ hoà hợp với chủ ngữ số ít the cost ⇒ is." },
        ],
      },

      { t: "h", text: "B. Từ vựng ba bài đọc — điền đúng dạng (8 câu)" },
      { t: "p", text: "Dùng một từ trong khung, **đổi dạng nếu cần**: scrutiny · cumulative · defensible · persevere · disprove · susceptible · synchronise · contagious · intangible · prevail." },
      {
        t: "quiz", id: "t4d27-bt-tu-vung", kind: "fill", title: "B. Điền một từ (đổi dạng nếu cần)",
        items: [
          { q: "1. Elderly people are particularly ___ to heatstroke during long heatwaves.", answers: ["susceptible"], hint: "susceptible to sth" },
          { q: "2. Each small cut in the budget seemed harmless, but the ___ effect on the library service was severe.", answers: ["cumulative"], hint: "tác động cộng dồn" },
          { q: "3. The minister's spending decisions have come under intense public ___ .", answers: ["scrutiny"], hint: "come under scrutiny" },
          { q: "4. Most beginners give up the violin within a year; only those who ___ with daily practice reach a good standard.", answers: ["persevere"], hint: "persevere with sth — động từ, chủ ngữ those (số nhiều)" },
          { q: "5. Laughter, like yawning, is highly ___ : one person's laugh quickly spreads around the room.", answers: ["contagious"], hint: "dễ lây" },
          { q: "6. Benefits such as trust and team spirit are ___ , which makes them hard to measure in a cost–benefit analysis.", answers: ["intangible"], hint: "phi vật thể, khó nắm bắt" },
          { q: "7. In the end, common sense ___ and the plan to close the hospital was dropped.", answers: ["prevailed"], hint: "prevail — quá khứ" },
          { q: "8. The theory has been widely criticised, but so far nobody has managed to ___ it.", answers: ["disprove"], hint: "bác bỏ bằng bằng chứng — sau managed to" },
        ],
      },

      { t: "h", text: "C. Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz", id: "t4d27-bt-dich", kind: "translate", title: "C. Dịch sang tiếng Anh — dùng đúng cấu trúc trong ngoặc",
        grammar: "It is essential that + S + V nguyên mẫu · It is high time + S + V2 · Equally important is… · adj + as + S + V · …, as do + S",
        items: [
          { q: "Điều thiết yếu là mọi trẻ em được dạy bơi trước 10 tuổi. (It is essential that…)", answers: ["It is essential that every child be taught to swim before the age of ten.", "It is essential that all children be taught to swim before the age of ten.", "It is essential that every child be taught to swim before the age of 10.", "It is essential that every child should be taught to swim before the age of ten.", "It is essential that all children be taught to swim before they are ten."], hint: "be taught to swim · before the age of ten" },
          { q: "Đã đến lúc các công ty công nghệ chịu trách nhiệm về nội dung trên nền tảng của họ. (It is high time…)", answers: ["It is high time technology companies took responsibility for the content on their platforms.", "It is high time tech companies took responsibility for the content on their platforms.", "It is high time that technology companies took responsibility for the content on their platforms.", "It is high time technology companies took responsibility for content on their platforms."], hint: "take responsibility for · platform" },
          { q: "Quan trọng không kém là nhu cầu đào tạo đủ giáo viên cho các vùng nông thôn. (Equally important is…)", answers: ["Equally important is the need to train enough teachers for rural areas.", "Equally important is the need to train sufficient teachers for rural areas.", "Equally important is the need to train enough teachers for the countryside."], hint: "the need to train · rural areas" },
          { q: "Dù quảng cáo có hiệu quả đến đâu, nó không thể bán một sản phẩm tồi trong thời gian dài. (Effective as…)", answers: ["Effective as advertising is, it cannot sell a poor product for long.", "Effective as advertising may be, it cannot sell a poor product for long.", "Effective though advertising is, it cannot sell a bad product for long.", "Effective as advertising is, it cannot sell a bad product for long.", "Effective as advertising may be, it cannot sell a poor product for a long time."], hint: "Effective as + S + is / may be" },
          { q: "Hàn Quốc có tỉ lệ sinh rất thấp, và Nhật Bản cũng vậy. (…, as does…)", answers: ["South Korea has a very low birth rate, as does Japan.", "Korea has a very low birth rate, as does Japan.", "South Korea has an extremely low birth rate, as does Japan."], hint: "has ⇒ as does + S" },
          { q: "Bác sĩ khuyên bệnh nhân không dùng điện thoại một giờ trước khi ngủ. (recommend that… not…)", answers: ["Doctors recommend that patients not use their phones an hour before bed.", "Doctors recommend that patients not use their phones for an hour before going to bed.", "Doctors recommend that patients not use phones an hour before bedtime.", "Doctors recommend that patients should not use their phones an hour before bed.", "The doctor recommends that patients not use their phones an hour before going to sleep."], hint: "recommend that + S + not + V" },
        ],
      },

      { t: "h", text: "D. Sửa lỗi tinh — viết lại PHẦN SAI cho đúng (6 câu)" },
      { t: "p", text: "Mỗi câu có **một** lỗi. Chỉ gõ cụm đã sửa (đúng như gợi ý số từ)." },
      {
        t: "quiz", id: "t4d27-bt-sua-loi", kind: "fill", title: "D. Gõ cụm đã sửa",
        items: [
          { q: "1. The regulations require that every driver carries a valid licence at all times. (1 từ)", answers: ["carry"], hint: "require that + S + V nguyên mẫu — không thêm -s" },
          { q: "2. Behind the rise in obesity lie a simple fact: food has become cheaper and more processed. (1 từ)", answers: ["lies"], hint: "chủ ngữ thật: a simple fact (số ít)" },
          { q: "3. It is vital that the public does not panic if the alarm sounds. (2 từ)", answers: ["not panic"], hint: "giả định phủ định: not + V, không mượn does" },
          { q: "4. He talks about the project as if he was the only person who worked on it. (1 từ)", answers: ["were"], hint: "văn trang trọng: as if + S + were" },
          { q: "5. Unemployment has fallen this year, as did inflation. (1 từ)", answers: ["has"], hint: "vế trước dùng has fallen ⇒ as has inflation" },
          { q: "6. At the heart of the dispute does lie a disagreement about money. (1 từ — thay cho ‘does lie’)", answers: ["lies"], hint: "đảo sau cụm nơi chốn: dùng thẳng động từ chính" },
        ],
      },

      { t: "h", text: "E. Chiến thuật Reading 60 phút và tự chấm Speaking (6 câu)" },
      {
        t: "mcq", id: "t4d27-bt-chien-thuat", title: "E. Chọn phương án đúng",
        items: [
          { q: "1. Nhịp thời gian khuyên dùng cho ba passage trong Tập 4 là", options: ["20 – 20 – 20", "17 – 20 – 23", "15 – 20 – 25", "23 – 20 – 17"], correct: 1, why: "Passage 1 dễ nhất làm nhanh (17), dành nhiều thời gian nhất cho Passage 3 lập luận (23, gồm 3 phút soát)." },
          { q: "2. Ở Passage 2 hôm nay, nên làm nhóm Matching information (câu 14–18) khi nào?", options: ["Đầu tiên, trước khi đọc bài", "Ngay sau khi đọc tiêu đề", "Sau hai nhóm câu hỏi kia, khi đã đọc gần hết bài", "Bỏ qua, quay lại nếu còn thời gian"], correct: 2, why: "Matching information không theo thứ tự đoạn; làm sau thì bạn đã có ghi chú bên lề cho cả bảy đoạn." },
          { q: "3. Câu YNNG “Translated novels sell better when the translator is named” là NOT GIVEN vì", options: ["bài có nói về tên dịch giả trên bìa nhưng không nói gì về doanh số", "bài viết nói điều ngược lại", "người viết không có ý kiến về dịch giả", "câu đó chỉ đúng với tiểu thuyết trinh thám"], correct: 0, why: "Cùng chủ đề (tên trên bìa) nhưng thiếu thông tin then chốt (sell better) ⇒ NOT GIVEN — bẫy điển hình band 7." },
          { q: "4. Khi tự chấm FC, dấu hiệu nào ĐẾM được và đáng tin nhất?", options: ["“Nghe có vẻ trôi chảy”", "Số câu dùng thì hiện tại", "Độ to của giọng", "Số lần im lặng quá 2 giây để tìm từ"], correct: 3, why: "Phiếu tự chấm mục 6: chấm bằng con số (lần im > 2 giây), không bằng cảm giác." },
          { q: "5. Một câu trả lời Part 3 band 7 thường có", options: ["một câu trả lời ngắn, rõ ràng", "càng nhiều idiom càng tốt", "quan điểm + lý do / ví dụ + rào đón hoặc phản đề, khoảng 40–60 giây", "đọc lại nguyên câu hỏi rồi trả lời có / không"], correct: 2, why: "Ít nhất hai tầng ý; dài 40–60 giây là đủ để phát triển mà không lan man." },
          { q: "6. Trong 12 câu tự chẩn 44 âm, bạn được 62 điểm ở từ ‘Thursday’ và ‘both’. Nên ôn nhóm âm nào trước?", options: ["/θ/ – /ð/", "/iː/ – /ɪ/", "/ʃ/ – /ʒ/", "/eɪ/ – /aɪ/"], correct: 0, why: "Th trong Thursday và both là /θ/; người Việt hay đọc thành /t/ hoặc /s/." },
        ],
      },

      { t: "h", text: "F. Viết một đoạn thân bài (AI chấm)" },
      { t: "p", text: "Đề: **“Some people believe that governments should require all new buildings to produce some of their own energy, for example by fitting solar panels. To what extent do you agree or disagree?”** Viết MỘT đoạn thân bài 110–140 từ ủng hộ quan điểm của bạn. Đoạn phải có **đúng một** câu giả định (It is essential that… / recommend that…) và **đúng một** câu fronting (Equally important is… / adj + as…). Gạch chân hai câu đó khi tự soát." },
      {
        t: "essay", id: "t4d27-bt-doan", task: "Task 2",
        prompt: "Write ONE body paragraph (110–140 words) for this question: “Some people believe that governments should require all new buildings to produce some of their own energy, for example by fitting solar panels. To what extent do you agree or disagree?” Include exactly ONE subjunctive sentence (e.g. It is essential that… / The government should insist that…) and exactly ONE fronted sentence (e.g. Equally important is… / Costly as… is, …).",
        minWords: 110,
        tips: ["Câu chủ đề nêu thẳng lập trường; câu giả định hợp nhất ở chỗ nêu giải pháp / điều kiện.", "Fronting đặt ở câu chuyển sang ý thứ hai của đoạn.", "Soát hoà hợp: động từ sau fronting hợp với chủ ngữ đứng SAU nó."],
      },
      { t: "note", title: "📌 Ghi nhớ: tự chấm bài về nhà", items: ["Phần A + D dưới 12/16 ⇒ đọc lại Bài 1 mục 2 và mục 5.", "Phần B dưới 6/8 ⇒ ôn khối từ vựng cuối Bài 2.", "Phần E sai câu 1–3 ⇒ đọc lại mục 1 và bảng “Bạn sai ở” của Bài 2; sai câu 4–6 ⇒ mục 6–7 Bài 3."] },
    ],
  },
];
