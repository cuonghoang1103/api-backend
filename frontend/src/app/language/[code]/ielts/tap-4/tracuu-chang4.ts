/**
 * Mục TRA CÔNG THỨC của IELTS Tập 4 — chặng 4 (Ngày 19–24). Soạn cùng `ngay/ngay19..24.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T4.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG4: Block[] = [
  /* ── Ngày 19 ── */
  { t: "h", text: "4.1 (Ngày 19 · mục 2–3) Câu điều kiện hỗn hợp — hai vế, hai thời gian" },
  {
    t: "patterns",
    rows: [
      { formula: "If + S + had + V3, S + would + V (now / today / still)", vi: "Kiểu 1: quá khứ không thật → hậu quả ở hiện tại.", examples: [{ en: "If the city had invested in public transport in the 1990s, it would not be so congested today.", vi: "Nếu thành phố đã đầu tư vào giao thông công cộng từ thập niên 1990 thì ngày nay đã không tắc đến thế." }] },
      { formula: "If + S + V2 / were, S + would + have + V3 (mốc quá khứ)", vi: "Kiểu 2: tính chất hiện tại không thật → hậu quả trong quá khứ.", examples: [{ en: "If I were more confident, I would have applied for the scholarship last year.", vi: "Nếu tôi là người tự tin hơn thì năm ngoái tôi đã nộp đơn xin học bổng." }] },
      { formula: "Had + S + V3, S + would + V (now)", vi: "Đảo ngữ thay if (trang trọng, Task 2); phủ định viết rời: Had it not…", examples: [{ en: "Had the dam not been built, the valley would still be farmland.", vi: "Nếu con đập không được xây thì thung lũng vẫn là đất nông nghiệp." }] },
    ],
  },
  { t: "rule", formula: "If + S + had + V3, S + would + V + now  ·  If + S + V2 / were, S + would + have + V3", vi: "Mỗi vế tự hỏi: lúc nào? có thật không? Vế if không bao giờ có would." },

  { t: "h", text: "4.2 (Ngày 19 · mục 4) would · could · might trong vế chính" },
  {
    t: "table",
    head: ["Vế chính", "Nghĩa", "Ví dụ"],
    rows: [
      ["would + V / would have + V3", "gần như chắc", "…, the river **would be** cleaner now."],
      ["could + V / could have + V3", "có khả năng / đủ điều kiện", "If she had saved more, she **could retire** now."],
      ["might + V / might have + V3", "có lẽ (không dùng may have cho giả định)", "…, some lives **might have been saved**."],
      ["would be + V-ing", "đang diễn ra lúc này", "…, I **would be working** in Berlin now."],
    ],
  },
  { t: "rule", formula: "would = chắc  ·  could = có thể làm được  ·  might = có lẽ", vi: "+ V cho hiện tại; + have V3 cho quá khứ." },

  { t: "h", text: "4.3 (Ngày 19 · mục 5–6) Từ thay if" },
  {
    t: "table",
    head: ["Từ nối", "Nghĩa – sắc thái", "Ví dụ"],
    rows: [
      ["provided (that) / providing (that)", "miễn là — điều kiện cần cho kết quả mong muốn; + hiện tại đơn", "Nuclear power is a sensible option **provided that** waste is stored safely."],
      ["as long as / so long as", "miễn là — tự nhiên hơn, hợp Speaking", "I don't mind working late **as long as** I get the weekend off."],
      ["on condition that", "với điều kiện là — thoả thuận, rất trang trọng", "The loan was approved **on condition that** the firm cut its emissions."],
      ["only if (đầu câu ⇒ đảo ngữ)", "chỉ khi", "**Only if** funding is secured **will the project** go ahead."],
      ["supposing / suppose · imagine", "giả sử — mở giả định để bàn", "**Supposing** everyone worked from home, what would happen to city centres?"],
      ["otherwise", "nếu không thì — đứng ở vế sau", "The grant was renewed; **otherwise**, the laboratory would have closed."],
      ["but for + N · if it were not for + N · had it not been for + N", "nếu không có / không nhờ", "**But for** foreign aid, the health system would have collapsed."],
      ["If + S + were to + V · Were + S + to V", "giả định tương lai xa vời", "**Were taxes to rise** again, many firms would relocate."],
    ],
  },
  { t: "rule", formula: "provided that / as long as + S + V(s/es)  ·  but for + N, S + would (have) + V(3)  ·  …; otherwise, S + would + V", vi: "Sau provided that / as long as không dùng will; không dùng chúng cho kết quả xấu." },

  { t: "h", text: "4.4 (Ngày 19 · Đọc mục 2–3) Matching information ở Passage 3" },
  {
    t: "table",
    head: ["Câu hỏi bắt đầu bằng", "Trong bài sẽ là", "Tín hiệu"],
    rows: [
      ["a concession / an acknowledgement", "thừa nhận điểm yếu của phe mình", "admittedly, it is true that, although, yet"],
      ["a rebuttal / a response to criticism", "đáp trả lời chê", "have responded, in reply"],
      ["a condition / a rule / a criterion", "điều kiện để được chấp nhận", "only, provided that, entitled to"],
      ["a warning / a risk", "điều có thể sai", "will overestimate, risk, neglect"],
      ["a claim / the suggestion that", "quan điểm của người khác", "the argument goes, on this view"],
    ],
  },
  { t: "rule", formula: "loại thông tin (danh từ đầu câu hỏi) → vai trò đoạn → câu chứng cứ khớp ĐỦ mọi phần", vi: "Làm sau các dạng khác; một đoạn có thể dùng hai lần, có đoạn không dùng." },

  { t: "h", text: "4.5 (Ngày 19 · Nói mục 2) Khung 5 bước trả lời câu hỏi giả định Part 3" },
  {
    t: "table",
    head: ["Bước", "Cụm dùng được ngay"],
    rows: [
      ["1. Vào giả định", "It's quite hard to picture, actually… · That's a tricky one. · I suppose…"],
      ["2. Hệ quả chính", "The most obvious difference would be that… · We'd probably still be + V-ing"],
      ["3. Chuỗi hệ quả", "…and that would have a knock-on effect on… · …which in turn would mean…"],
      ["4. Mặt ngược lại", "Mind you, it might not be all bad. · Then again, … · I doubt we'd…"],
      ["5. Chốt về thực tế", "So on balance, I'm glad it happened. · So, all in all, I think we'd be worse off."],
    ],
  },
  { t: "rule", formula: "If + S + hadn't + V3, S + 'd still be + V-ing.  →  S + would've + V3.  →  Otherwise, S + 'd + V.", vi: "Một câu if dựng cảnh; các câu sau chỉ cần would / would've / otherwise. would've = /wʊdəv/." },

  /* ── Ngày 20 ── */
  { t: "h", text: "4.6 (Ngày 20 · Từ vựng mục 3) Năm từ nối trang trọng của AWL sublist 10" },
  {
    t: "table",
    head: ["Từ", "Theo sau là", "Đúng", "Sai hay gặp"],
    rows: [
      ["albeit", "adj / adv / cụm giới từ", "a useful, **albeit** costly, solution", "~~albeit it is costly~~"],
      ["nonetheless", "(đầu câu mới) + mệnh đề", "The risks are real. **Nonetheless**, the benefits are greater.", "~~…, nonetheless the benefits…~~"],
      ["notwithstanding", "cụm danh từ", "**Notwithstanding** the high cost, the scheme went ahead.", "~~Notwithstanding the cost is high~~"],
      ["likewise", "(đầu vế mới) + mệnh đề cùng hướng", "Exports fell; **likewise**, tourism declined.", "dùng để nối ý trái ngược"],
      ["whereby", "mệnh đề đủ S + V", "a system **whereby** users pay per journey", "~~whereby paying per journey~~"],
    ],
  },
  { t: "rule", formula: "albeit + adj / adv  ·  Notwithstanding + N, S + V  ·  S + V. Nonetheless, S + V  ·  N + whereby + S + V", vi: "Chỉ dùng trong văn viết, tối đa hai lần mỗi bài." },

  { t: "h", text: "4.7 (Ngày 20 · Từ vựng mục 7) Collocation công nghệ cho Task 2 + đổi văn phong" },
  {
    t: "table",
    head: ["Ý muốn nói", "Speaking (thân mật)", "Task 2 (trang trọng)"],
    rows: [
      ["rành công nghệ", "tech-savvy", "digitally literate · technologically proficient"],
      ["thay đổi cuộc chơi", "a game-changer", "a major breakthrough · a turning point"],
      ["trục trặc ban đầu", "teething problems", "initial difficulties"],
      ["theo kịp", "keep up with", "keep pace with"],
      ["làm lỗi thời", "kill off", "render… obsolete"],
    ],
  },
  { t: "rule", formula: "pose a threat to N  ·  harness / roll out + N  ·  over-reliance on N  ·  render N obsolete  ·  keep pace with N", vi: "Năm collocation dùng được trong gần như mọi đề Task 2 về công nghệ." },

  { t: "h", text: "4.8 (Ngày 20 · Viết mục 2) Kịch bản thuyết trình 3 phút — khung và câu dẫn đường" },
  {
    t: "table",
    head: ["Phần", "Thời lượng", "Câu khung"],
    rows: [
      ["Hook", "15 giây", "Last month, our team received… How many of them, do you think, …?"],
      ["Roadmap", "15 giây", "In the next three minutes, I'd like to… I'll look at three things — A, B and C — and then…"],
      ["Ba ý", "3 × 40 giây", "Let's start with A. · That brings me to my second point: B. · Finally, C."],
      ["Recap", "15 giây", "So, to sum up: A, B, and C."],
      ["Close", "10 giây", "My recommendation, therefore, is… Thank you — I'd be happy to take any questions."],
    ],
  },
  { t: "rule", formula: "Hook → In the next three minutes, I'd like to… → Let's start with A → That brings me to B → Finally, C → So, to sum up… → My recommendation is…", vi: "3 phút ≈ 380–420 từ; câu ≤ 20 từ; nói trước – nói – nhắc lại." },

  { t: "h", text: "4.9 (Ngày 20 · Viết mục 5) Bản tóm tắt 80–100 từ" },
  {
    t: "patterns",
    rows: [
      { formula: "In her presentation, X argued that S + should + V.", vi: "Câu 1 = thông điệp chính.", examples: [{ en: "In her presentation, Linh argued that the support team should trial a chatbot for customer emails.", vi: "Trong bài trình bày, Linh lập luận rằng nhóm hỗ trợ nên thử dùng chatbot cho email khách hàng." }] },
      { formula: "While acknowledging that S + V, she maintained that S + V.", vi: "Nhượng bộ + giữ quan điểm.", examples: [{ en: "While acknowledging that automated replies are unsuitable for complaints, she maintained that routine enquiries could be handled reliably.", vi: "Dù thừa nhận trả lời tự động không hợp với khiếu nại, cô vẫn cho rằng câu hỏi thường gặp có thể được xử lý ổn." }] },
      { formula: "She therefore recommended + N / that S + (should) + V.", vi: "Câu cuối = khuyến nghị; sau recommend that dùng động từ nguyên mẫu.", examples: [{ en: "She therefore recommended a three-month trial limited to delivery questions.", vi: "Vì vậy cô đề xuất thử nghiệm ba tháng, giới hạn ở câu hỏi giao hàng." }] },
    ],
  },
  { t: "rule", formula: "Thông điệp chính → lý lẽ gộp (2–3 con số) → nhượng bộ / điều kiện → khuyến nghị", vi: "Văn viết, động từ tường thuật đa dạng, không ý kiến riêng." },

  { t: "h", text: "4.10 (Ngày 20 · Nghe mục 2) Ghi chú kiểu Cornell cho Part 4" },
  {
    t: "table",
    head: ["Vùng", "Viết khi nào", "Viết gì"],
    rows: [
      ["Cột gợi nhớ (trái)", "trước / sau khi nghe", "từ khoá, tên mục, câu hỏi — trong đề IELTS là các đề mục in sẵn"],
      ["Cột ghi chú (phải)", "trong lúc nghe", "gạch đầu dòng, viết tắt, ký hiệu (→ ↑ ↓ ∵ ≠ c. w/)"],
      ["Ô tóm tắt (dưới)", "sau khi nghe, 2 phút", "2–3 câu bằng lời của mình"],
    ],
  },
  { t: "rule", formula: "Trước: đọc đề mục → Trong: ghi tắt theo mục, nghe câu dẫn đường → Sau: tóm tắt 2–3 câu", vi: "Bám MỤC trước, chỗ trống sau; lỡ một câu thì bỏ, chờ câu dẫn đường kế tiếp." },

  /* ── Ngày 21 ── */
  { t: "h", text: "4.11 (Ngày 21 · mục 1–2) Danh hoá mức 2 — nén cả mệnh đề thành cụm danh từ" },
  {
    t: "patterns",
    rows: [
      { formula: "The + adj + N + in/of + N + lead to / result in + N", vi: "Nén mệnh đề nguyên nhân (Because S V) thành chủ ngữ.", examples: [{ en: "The sharp rise in prices led to a fall in consumer spending.", vi: "Việc giá tăng mạnh dẫn tới sụt giảm chi tiêu tiêu dùng." }] },
      { formula: "S + V + N's + failure / inability / refusal + to V", vi: "Nén mệnh đề phủ định (did not V).", examples: [{ en: "Critics complain about the government's failure to consult residents.", vi: "Giới phê bình phàn nàn về việc chính phủ không tham vấn cư dân." }] },
      { formula: "A reduction / an increase in + N + would + V", vi: "Nén mệnh đề điều kiện (If S V) thành chủ ngữ.", examples: [{ en: "A reduction in fares would encourage greater use of buses.", vi: "Việc giảm giá vé sẽ khuyến khích dùng xe buýt nhiều hơn." }] },
    ],
  },
  {
    t: "table",
    head: ["Danh từ", "Giới từ", "Ví dụ"],
    rows: [
      ["rise / fall / increase / decline / reduction", "in", "a decline in birth rates"],
      ["demand / need / reason / responsibility", "for", "the demand for housing"],
      ["reliance / dependence / impact / effect / influence", "on", "the impact on small firms"],
      ["lack / shortage / awareness", "of", "a lack of investment"],
      ["access / solution / threat", "to", "a solution to the problem"],
      ["failure / ability / tendency / refusal", "to V", "the failure to act"],
    ],
  },
  { t: "rule", formula: "The + adj + N + in/of + N + V (lead to / result in / reflect / stem from) + N", vi: "Quan hệ nhân quả nằm ở động từ, không ở because / so; động từ chia theo danh từ ĐẦU cụm." },

  { t: "h", text: "4.12 (Ngày 21 · mục 3) Lúc nào trả về động từ" },
  {
    t: "table",
    head: ["Phép thử", "Nặng", "Gọn"],
    rows: [
      ["3 chữ of liền nhau", "the improvement of the quality of the education of children", "improving the quality of children's education"],
      ["động từ rỗng + danh từ", "made a decision to carry out a reduction of staff", "decided to reduce staff"],
      ["giấu tác nhân", "There should be an implementation of stricter controls.", "Governments should impose stricter controls."],
    ],
  },
  { t: "rule", formula: "≤ 2 cụm danh hoá / câu · câu lập trường và câu giải pháp dùng S + V", vi: "Danh hoá để nối ý và nêu nhân quả; động từ để nói ai làm gì." },

  { t: "h", text: "4.13 (Ngày 21 · mục 4) Register — văn nói → văn viết" },
  {
    t: "table",
    head: ["Văn nói", "Văn viết"],
    rows: [
      ["a lot of / lots of", "a great deal of · numerous · considerable"],
      ["kids · things · big", "children · factors / issues · substantial / significant"],
      ["get · find out · look into", "obtain / receive · establish / discover · investigate"],
      ["go up · go down · cut down on", "rise · fall / decline · reduce"],
      ["put up with · get rid of · come up with", "tolerate · abolish / eliminate · devise"],
      ["don't · you can see · And / But / So đầu câu", "do not · it can be seen · In addition / However / As a result"],
    ],
  },
  { t: "rule", formula: "Writing: one-word verb · no contractions · no you · no question  |  Speaking: contractions + phrasal verbs", vi: "Giữ MỘT mức văn phong suốt bài; khi nói thì đừng nói như viết." },

  { t: "h", text: "4.14 (Ngày 21 · mục 5) Dấu câu band 7" },
  {
    t: "table",
    head: ["Dấu", "Quy tắc", "Ví dụ"],
    rows: [
      [";", "nối hai mệnh đề độc lập; đứng trước however / therefore", "Fares were cut; however, passenger numbers barely changed."],
      [":", "chỉ sau một mệnh đề đủ", "The scheme failed for one reason: nobody was consulted."],
      [", which … ,", "thông tin thêm (không dùng that); không phẩy = xác định", "The airport, which opened in 1975, is overcrowded."],
      ["’", "N’s · Ns’ · its (của nó) không nháy", "both countries’ economies · the city and its suburbs"],
      ["-", "tính từ ghép trước danh từ; số + danh từ số ít", "a long-term solution · a five-year plan"],
    ],
  },
  { t: "rule", formula: "câu đủ ; câu đủ  ·  câu đủ : giải thích  ·  không phẩy trước that  ·  không phẩy giữa S dài và V", vi: "Che phần bên trái dấu ; và dấu : — không đứng được thành câu thì dấu đó sai." },

  { t: "h", text: "4.15 (Ngày 21 · mục 6) Bảng tự soát 6 lượt — lần 2 (band 7)" },
  {
    t: "table",
    head: ["Lượt", "Tìm", "Thêm ở band 7"],
    rows: [
      ["1 · Động từ", "thì · S–V · bị động", "động từ theo danh từ đầu của cụm danh hoá"],
      ["2 · Danh từ", "mạo từ · số nhiều", "giới từ sau danh từ · ≤ 2 cụm danh hoá / câu"],
      ["3 · Ranh giới câu", "comma splice · run-on · câu cụt", "; however, · dấu : · its / it's · gạch nối"],
      ["4 · Song song + từ loại", "hai bên and / or / than", "collocation · dangling modifier"],
      ["5 · Liên kết", "từ nối · this / it", "register · rào đón"],
      ["6 · Chính tả + đề", "từ hay sai · đủ vế đề", "lập trường suốt bài · ví dụ cụ thể"],
    ],
  },

  { t: "h", text: "4.16 (Ngày 21 · mục 7) Academic Phrasebank — 8 chức năng" },
  {
    t: "table",
    head: ["Chức năng", "Khung"],
    rows: [
      ["Bối cảnh", "Recent decades have seen a marked increase in N."],
      ["Ý kiến chung", "It is widely believed that… · A frequent criticism of N is that…"],
      ["Lập trường", "I would argue that… · This essay argues that…"],
      ["Nguyên nhân", "One reason for this is that… · This can largely be attributed to N."],
      ["Ví dụ", "A clear illustration of this is N. · N is a case in point."],
      ["Nhượng bộ rồi bác", "Admittedly, … Nevertheless, … · While it is true that…, this does not mean that…"],
      ["Hệ quả", "This, in turn, leads to N. · As a consequence, …"],
      ["Kết luận có rào đón", "On balance, it seems that… · The evidence suggests that…"],
    ],
  },
  { t: "rule", formula: "bối cảnh → ý kiến chung → lập trường → [lý do → ví dụ → hệ quả] × 2 → nhượng bộ + bác → kết luận", vi: "Khung là vỏ; phần ruột (lý do, ví dụ cụ thể) vẫn phải của bạn." },

  { t: "h", text: "4.17 (Ngày 21 · bài Nghe) Nhận diện giọng Ireland và Scotland" },
  {
    t: "table",
    head: ["Đặc điểm", "Ireland", "Scotland"],
    rows: [
      ["/r/ sau nguyên âm", "đọc rõ (car, north)", "đọc rõ, vỗ lưỡi"],
      ["th", "gần t / d: three ≈ tree, thirty ≈ “tirty”", "giữ /θ/"],
      ["/t/ giữa, cuối từ", "mềm, hơi xì", "âm tắc họng (Glasgow)"],
      ["nguyên âm", "bus gần /ʊ/", "pool = pull; day ≈ /e/, go ≈ /o/"],
      ["cách nói", "half twelve = 12.30 · ten euro · I'm after V-ing = have just V3", "wee = small · aye = yes"],
    ],
    caption: "Khoá có giọng máy Ireland; giọng Scotland không có giọng máy — học bằng mô tả và nghe người thật.",
  },
  { t: "rule", formula: "đoán loại đáp án → bám phụ âm → chờ nhắc lại", vi: "Giọng đổi âm, không đổi đáp án." },

  /* ── Ngày 22 ── */
  { t: "h", text: "4.18 (Ngày 22 · Từ vựng mục 6) bring up / raise ≠ grow up" },
  {
    t: "table",
    head: ["Cặp", "Khác nhau", "Ví dụ"],
    rows: [
      ["bring up / raise ≠ grow up", "người lớn nuôi (có tân ngữ) · trẻ tự lớn (không tân ngữ)", "I was brought up by my grandparents. · I grew up in Huế."],
      ["authoritative ≠ authoritarian", "nghiêm mà ấm (khen) · độc đoán (chê)", "an authoritative parent · an authoritarian regime"],
      ["childish ≠ childlike", "trẻ con (chê) · hồn nhiên (khen)", "childish behaviour · childlike curiosity"],
      ["maternal ≠ maternity", "thuộc về người mẹ · thuộc về việc sinh nở", "maternal instinct · maternity leave"],
    ],
  },
  { t: "rule", formula: "bring up / raise + O  ·  S + grow up  ·  be brought up by / in", vi: "“Tôi được ông bà nuôi” = I was brought up by my grandparents; “tôi lớn lên ở…” = I grew up in…" },

  { t: "h", text: "4.19 (Ngày 22 · Từ vựng mục 8) Năm câu khung Task 2 / Part 3 — trẻ em & vai trò giới" },
  {
    t: "patterns",
    rows: [
      { formula: "Children who are + V3 / adj … tend to + V", vi: "Nêu xu hướng có rào đón.", examples: [{ en: "Children who are given clear boundaries tend to cope better with frustration.", vi: "Trẻ được đặt giới hạn rõ ràng thường đối phó tốt hơn với sự bực bội." }] },
      { formula: "The responsibility for + V-ing … lies (primarily) with + N", vi: "Trả lời đề “ai chịu trách nhiệm”.", examples: [{ en: "The responsibility for teaching children right from wrong lies primarily with parents.", vi: "Trách nhiệm dạy trẻ phân biệt đúng sai trước hết thuộc về cha mẹ." }] },
      { formula: "Far from + V-ing, N + V", vi: "Bác một quan niệm sai.", examples: [{ en: "Far from harming children, a working mother can serve as a powerful role model.", vi: "Người mẹ đi làm không hề gây hại cho con mà còn có thể là tấm gương mạnh mẽ." }] },
      { formula: "N + is no longer the preserve of + N", vi: "Một vai trò không còn dành riêng cho một giới.", examples: [{ en: "Childcare is no longer the preserve of women.", vi: "Chăm con không còn là việc riêng của phụ nữ." }] },
    ],
  },

  { t: "h", text: "4.20 (Ngày 22 · Viết mục 4) Bốn phép thử tính khả thi C · E · A · L" },
  {
    t: "table",
    head: ["Phép thử", "Câu hỏi", "Từ / cụm band 7"],
    rows: [
      ["C — Cost", "ai trả tiền?", "costly · cost-effective · place a financial burden on"],
      ["E — Enforcement", "có thực thi, kiểm tra được không?", "enforceable · difficult to enforce · hard to monitor · open to abuse"],
      ["A — Acceptance", "người liên quan có chịu không?", "politically unpopular · meet with resistance from · have little reason to object"],
      ["L — Limits", "ai / trường hợp nào bị bỏ sót?", "would not help every… · only a partial solution · needs to be combined with"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "The obvious response would be for + N + to V. Admittedly, …; however, + [C / E / A]", vi: "Nêu giải pháp hiển nhiên rồi chỉ chỗ khó.", examples: [{ en: "The obvious response would be for governments to cap the working week. Admittedly, this would address the cause directly; however, it is difficult to enforce in sectors such as retail.", vi: "Phản ứng hiển nhiên là chính phủ giới hạn tuần làm việc. Phải thừa nhận cách này xử lý thẳng nguyên nhân; tuy nhiên, nó khó thực thi ở những ngành như bán lẻ." }] },
      { formula: "A more feasible measure is to V. This costs + N + very little, and since …, …", vi: "Giải pháp khả thi hơn + vì sao.", examples: [{ en: "A more feasible measure is to give parents a legal right to request flexible hours. This costs the state very little.", vi: "Một biện pháp khả thi hơn là trao cho cha mẹ quyền hợp pháp được xin giờ làm linh hoạt. Việc này hầu như không tốn ngân sách." }] },
      { formula: "It would not help every + N — [ví dụ] — so it needs to be combined with + N", vi: "Nhận giới hạn và thêm biện pháp bù.", examples: [{ en: "It would not help every family, so it needs to be combined with subsidised after-school clubs.", vi: "Nó không giúp được mọi gia đình, nên cần kết hợp với câu lạc bộ sau giờ học được trợ giá." }] },
      { formula: "While no single measure will solve the problem, N appears to be the most practical way of V-ing", vi: "Kết bài: chọn rõ một giải pháp, có rào đón.", examples: [{ en: "While no single measure will solve the problem, flexible working appears to be the most practical way of giving families time back.", vi: "Dù không biện pháp đơn lẻ nào giải quyết được vấn đề, làm việc linh hoạt có vẻ là cách thực tế nhất để trả lại thời gian cho các gia đình." }] },
    ],
  },
  { t: "rule", formula: "obvious measure → Admittedly…; however, [C/E/A] → A more feasible measure is to V + vì sao → It would not help every N, so… combined with N", vi: "Đoạn giải pháp band 7: nêu – chỉ chỗ khó – đưa cái khả thi hơn – nhận giới hạn và bù." },

  { t: "h", text: "4.21 (Ngày 22 · Nói mục 3) Sáu khung hỏi – đáp (Q&A) sau thuyết trình — dùng được ở Part 3" },
  {
    t: "table",
    head: ["Kiểu câu hỏi", "Nước đi đầu tiên", "Rồi làm gì"],
    rows: [
      ["Hỏi thẳng, bạn biết", "That's a good question. / Yes — …", "2–3 câu + Does that answer your question?"],
      ["Không chắc hiểu", "If I've understood you correctly, you're asking whether…", "chờ xác nhận rồi trả lời"],
      ["Khó, cần nghĩ", "That's an interesting point. Let me think about that for a second.", "I suppose I'd say…"],
      ["Không biết", "I'm afraid I don't have that figure to hand.", "What I can say is… · I can find out and get back to you."],
      ["Bị phản bác", "I take your point. / That's a fair challenge.", "Where I'd disagree is… / I'd see it slightly differently, because…"],
      ["Nhiều vế / lạc đề", "There are two questions there, so let me take them in turn. / That's slightly outside what I covered today, but briefly…", "On the first… As for the second… / Perhaps we could talk about that afterwards."],
    ],
  },
  { t: "rule", formula: "nước đi đầu (2 giây) → trả lời 2–3 câu → Does that answer your question?", vi: "Nước đi đầu mua thời gian; câu kiểm tra cuối trả quyền nói lại cho người hỏi." },

  { t: "h", text: "4.22 (Ngày 22 · Nói mục 5) Chunking bài nói dài" },
  { t: "rule", formula: "ngắt | sau cụm dẫn đường · | trước con số / từ khoá · | giữa các ý liệt kê (↗ ↗ ↘)", vi: "Mỗi cụm nói liền hơi, nhấn một từ; tốc độ thuyết trình ~135 từ/phút." },

  /* ── Ngày 23 ── */
  { t: "h", text: "4.23 (Ngày 23 · mục 2) Câu phức khi nói — năm “móc” nhẹ" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V…, which means (that) / which is why + S + V", vi: "Móc 1 — which bình luận CẢ mệnh đề đứng trước.", examples: [{ en: "Most of my friends work shifts, which means we hardly ever meet up during the week.", vi: "Phần lớn bạn tôi làm theo ca, nên trong tuần chúng tôi gần như chẳng gặp nhau." }] },
      { formula: "What + S + V + is (that) + S + V", vi: "Móc 2 — chẻ câu bằng What: báo trước điều quan trọng, mua nửa giây để nghĩ.", examples: [{ en: "What worries me is that children are getting phones younger and younger.", vi: "Điều làm tôi lo là trẻ có điện thoại ngày càng sớm." }] },
      { formula: "The thing is, + S + V  ·  The reason (why) + S + V + is that + S + V", vi: "Móc 3 — danh từ rỗng + is (that) + mệnh đề.", examples: [{ en: "The reason I chose engineering is that I've always liked taking things apart.", vi: "Lý do tôi chọn kỹ thuật là tôi vốn thích tháo tung đồ đạc." }] },
      { formula: "It's not that + S + V, it's (just) that + S + V", vi: "Móc 4 — gạt một lý do, đưa lý do thật.", examples: [{ en: "It's not that young people don't care about politics; it's just that they don't trust politicians.", vi: "Không phải người trẻ không quan tâm chính trị; chỉ là họ không tin chính trị gia." }] },
      { formula: "S + V, even though + S + V  ·  Having said that, + S + V  ·  Much as + S + V, + S + V", vi: "Móc 5 — nhượng bộ đặt SAU ý chính.", examples: [{ en: "I'd still rather live in the city, even though it costs twice as much.", vi: "Tôi vẫn thích sống ở thành phố hơn, dù tốn gấp đôi." }] },
    ],
  },
  { t: "rule", formula: "S + V, which means (that) + S + V  ·  What + S + V + is (that) + S + V  ·  It's not that…, it's just that…", vi: "Ý chính trước, móc sau. Mỗi câu trả lời Part 3 có 2–3 móc khác kiểu là đủ “range”." },

  { t: "h", text: "4.24 (Ngày 23 · mục 3) Ellipsis mức 2 — dừng sau trợ động từ và sau to" },
  {
    t: "table",
    head: ["Kiểu", "Đúng", "Sai hay gặp"],
    rows: [
      ["so sánh", "She reads more than I **do**.", "~~more than I read books~~ (lặp)"],
      ["sau to", "I'd love **to**. · She forgot **to**.", "~~I'd love.~~ · ~~I'd love to it.~~"],
      ["thay mệnh đề", "I hope **so** / I hope **not** · I'm afraid **so**", "~~I hope it.~~ · ~~I don't hope so.~~"],
      ["trang trọng", "those who do **so**", "(thân mật hơn: those who do / those who do it)"],
    ],
  },
  { t: "rule", formula: "S + V + more than / as… as + S + do / did / have  ·  I'd love to. · I hope so / not.", vi: "Rút gọn = giữ trợ động từ hoặc to, bỏ phần lặp. Cuối câu đọc dạng đủ: I am, they have." },

  { t: "h", text: "4.25 (Ngày 23 · mục 4) Câu hỏi đuôi mức 2 — mười hai trường hợp khó" },
  {
    t: "table",
    head: ["Vế trước", "Đuôi", "Ví dụ"],
    rows: [
      ["never / hardly / rarely / seldom / little / few", "khẳng định", "People hardly ever write letters now, **do they**?"],
      ["nobody / no one / nothing", "khẳng định; người ⇒ they, vật ⇒ it", "Nothing has changed, **has it**?"],
      ["everyone / someone / anybody", "they", "Everyone wants a pay rise, **don't they**?"],
      ["this / that · these / those", "it · they", "That's a difficult question, **isn't it**?"],
      ["There is / are", "giữ there", "There's a lot of pressure, **isn't there**?"],
      ["I am", "aren't I?", "I'm next, **aren't I**?"],
      ["used to · have to", "didn't · don't / doesn't", "Families used to eat together, **didn't they**?"],
      ["'d better · 'd rather", "hadn't · wouldn't", "You'd better leave, **hadn't you**?"],
      ["I think / I don't think + mệnh đề", "theo mệnh đề sau", "I don't think it matters, **does it**?"],
      ["Let's… · câu mệnh lệnh", "shall we? · will / would / could you?", "Let's move on, **shall we**?"],
    ],
  },
  { t: "rule", formula: "never / hardly / nobody…, + trợ động từ (khẳng định) + they / it?  ·  I think + S + V, + đuôi theo mệnh đề sau  ·  Let's…, shall we?", vi: "Vế trước mang nghĩa phủ định ⇒ đuôi khẳng định. Chắc ⇒ xuống giọng; hỏi thật ⇒ lên giọng." },

  { t: "h", text: "4.26 (Ngày 23 · mục 5) Head · tail · do nhấn (chỉ khi NÓI)" },
  {
    t: "patterns",
    rows: [
      { formula: "N (chủ đề dài), + đại từ + V…", vi: "HEAD — đưa chủ đề ra trước.", examples: [{ en: "That course I did last summer, it completely changed how I study.", vi: "Khoá học hè năm ngoái ấy, nó thay đổi hẳn cách tôi học." }] },
      { formula: "Đại từ + V…, + N", vi: "TAIL — nhận xét trước, nói rõ “nó” là gì sau.", examples: [{ en: "It's become a real problem, the traffic.", vi: "Nó thành vấn đề thật rồi, giao thông ấy." }] },
      { formula: "S + do / does / did + V (nguyên mẫu)", vi: "Nhấn bằng do — phản lại một ý vừa nêu; đọc nhấn vào do.", examples: [{ en: "I'm not against technology, but I do think children need limits.", vi: "Tôi không phản đối công nghệ, nhưng tôi thật sự nghĩ trẻ cần giới hạn." }] },
    ],
  },
  { t: "rule", formula: "N dài, + it / they + V  ·  It / They + V…, + N  ·  S + do / does / did + V", vi: "Không chia động từ chính sau do / does / did. Head – tail chỉ dùng khi nói, không dùng trong Writing." },

  { t: "h", text: "4.27 (Ngày 23 · Đọc mục 2–3) Matching features 3 — người đó GIỮ ý, hay chỉ nhắc tới?" },
  {
    t: "table",
    head: ["Dấu hiệu", "Nghĩa", "Có khớp câu hỏi không"],
    rows: [
      ["argues · maintains · insists · contends", "ý người đó GIỮ (✓)", "khớp"],
      ["concedes · admits · acknowledges", "nhượng bộ (±) — thường kèm “but…”", "khớp nếu câu hỏi nói đúng mức nhượng bộ"],
      ["rejects · dismisses · challenges", "bác bỏ (✗)", "KHÔNG khớp ý bị bác"],
      ["X finds an ally in Y, who has argued that… · as Y has shown", "ý của Y nằm trong đoạn của X (“làm khách”)", "gán cho Y, không cho X"],
    ],
  },
  { t: "rule", formula: "Khoanh mọi lần có tên → đọc vùng từng người, đánh dấu ✓ ± ✗ “ ” → chỉ khớp ý ✓ và ± → soát lần “làm khách”", vi: "Trước khi điền, hỏi: người này GIỮ ý đó, hay chỉ nhắc tới nó?" },

  { t: "h", text: "4.28 (Ngày 23 · Nói mục 2) Part 3 trừu tượng — khung 5 bước “xuống thang rồi lên thang”" },
  {
    t: "table",
    head: ["Bước", "Việc", "Câu khung"],
    rows: [
      ["1", "Thu hẹp khái niệm", "It depends what we mean by X. If we're talking about…, then…"],
      ["2", "Lập trường", "By and large, I'd say… · On balance, I tend to think…"],
      ["3", "Nguyên tắc", "It comes down to… · At the end of the day, it's a question of…"],
      ["4", "Ví dụ cụ thể (xuống thang)", "Take…, for instance. · A good example would be…"],
      ["5", "Giới hạn (lên thang)", "Having said that, … · That's not to say that…"],
    ],
  },
  { t: "rule", formula: "It depends what we mean by X. + By and large, I'd say… + It comes down to… + Take…, for instance. + Having said that, …", vi: "Thu hẹp → lập trường → nguyên tắc → ví dụ cụ thể → giới hạn, trong 45–60 giây." },

  { t: "h", text: "4.29 (Ngày 23 · Nói mục 6) Trọng âm từ trừu tượng dài" },
  {
    t: "table",
    head: ["Đuôi", "Luật", "Ví dụ"],
    rows: [
      ["-ity", "nhấn âm tiết ngay trước", "responsi**BIL**ity · accounta**BIL**ity"],
      ["-tion / -sion", "nhấn âm tiết ngay trước", "discrimi**NA**tion · regu**LA**tion"],
      ["-ic / -ical", "nhấn âm tiết ngay trước", "techno**LOG**ical · philo**SOPH**ical"],
      ["-ism · -ment · -ness", "giữ trọng âm từ gốc", "ma**TER**ialism · **GOV**ernment · a**WARE**ness"],
    ],
  },
  { t: "rule", formula: "-ity · -tion · -ic(al) ⇒ nhấn âm tiết NGAY TRƯỚC đuôi  ·  -ism · -ment · -ness ⇒ giữ trọng âm từ gốc", vi: "Một từ dài chỉ có MỘT đỉnh chính; các âm tiết khác đọc nhẹ và nhanh." },

  /* ── Ngày 24 ── */
  { t: "h", text: "4.30 (Ngày 24 · Từ vựng mục 2–4) Task 1 — cường độ phải khớp con số" },
  {
    t: "table",
    head: ["Mức thay đổi", "Tính từ + danh từ", "Trạng từ + so sánh"],
    rows: [
      ["< 2 %", "a negligible change · virtually no change", "virtually unchanged · almost identical"],
      ["2–5 %", "a slight / marginal rise · a slight dip", "marginally / slightly higher"],
      ["5–15 %", "a modest increase · a gradual decline", "somewhat / moderately higher"],
      ["15–50 %", "a marked / considerable / significant rise", "considerably / significantly / noticeably higher"],
      ["> 50 % hoặc gấp bội", "a dramatic / sharp / steep rise · a twofold increase", "far / substantially higher · more than double"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "There was a + marked / modest / slight + increase / decline + in + N", vi: "Tả thay đổi bằng cụm danh từ.", examples: [{ en: "There was a marked increase in the number of organic farms.", vi: "Số trang trại hữu cơ tăng rõ rệt." }] },
      { formula: "N + remained + virtually unchanged / relatively stable", vi: "Gần như không đổi.", examples: [{ en: "The share of rail freight remained virtually unchanged at 12 %.", vi: "Tỉ trọng hàng hoá đường sắt gần như không đổi ở mức 12 %." }] },
      { formula: "A + was + marginally / considerably + higher than + B", vi: "So sánh hai số có độ chênh.", examples: [{ en: "Spending in the north was considerably lower than in the south.", vi: "Chi tiêu ở phía bắc thấp hơn hẳn phía nam." }] },
    ],
  },
  { t: "rule", formula: "Task 1: adj + N khớp cỡ con số (slight < modest < marked < dramatic)", vi: "Viết “a significant rise” cho 51 % → 52 % là sai số liệu (TA), không chỉ sai từ." },

  { t: "h", text: "4.31 (Ngày 24 · Từ vựng mục 2, 5–6) Task 2 — sáu họ trạng từ tăng cường + cụm lập luận" },
  {
    t: "table",
    head: ["Trạng từ", "Đi với nhóm nghĩa", "Cụm mẫu"],
    rows: [
      ["highly", "xác suất · đánh giá · trình độ", "highly unlikely / effective / controversial"],
      ["deeply", "cảm xúc · niềm tin · gốc rễ", "deeply rooted / concerned / divided"],
      ["widely", "nhiều người / nhiều nơi", "widely accepted / used / regarded as"],
      ["heavily", "phụ thuộc · tác động · mật độ", "heavily dependent / influenced / subsidised"],
      ["strictly", "luật lệ · giới hạn", "strictly regulated / forbidden / limited"],
      ["absolutely / utterly", "tính từ tuyệt đối", "absolutely essential · utterly unacceptable · virtually impossible"],
    ],
  },
  {
    t: "table",
    caption: "Cụm tính từ + danh từ cho lập luận",
    head: ["Thay cho", "Band 7"],
    rows: [
      ["a good argument · a big problem", "a compelling argument · a pressing issue"],
      ["bad effects · big results", "a detrimental effect on · far-reaching consequences"],
      ["a good solution · the main cause", "a viable solution · the root cause"],
      ["a big effort by many groups", "a concerted effort"],
      ["has good and bad sides", "a mixed blessing · a double-edged sword (nói)"],
    ],
  },
  { t: "rule", formula: "adv đúng họ + adj (highly unlikely · deeply rooted · widely accepted · heavily dependent · strictly regulated)", vi: "Chọn trạng từ theo “họ” nghĩa, không theo chữ “rất” của tiếng Việt; very không đi với tính từ tuyệt đối." },

  { t: "h", text: "4.32 (Ngày 24 · Từ vựng mục 7) Mười cụm ghép sai người Việt hay viết" },
  {
    t: "table",
    head: ["Sai", "Đúng"],
    rows: [
      ["~~a high / strong increase~~", "a sharp / marked / significant increase"],
      ["~~a big amount of people~~", "a large number of people"],
      ["~~a high possibility~~", "a strong possibility · a high probability"],
      ["~~strongly / deeply important~~", "vitally / critically important"],
      ["~~highly different~~", "markedly / radically different"],
      ["~~a heavy problem~~", "a serious / pressing problem"],
      ["~~bad effects to~~", "adverse / detrimental effects on"],
      ["~~in a large scale~~", "on a large scale"],
      ["~~the most part of~~", "the bulk of · the vast majority of"],
      ["~~very essential~~ · ~~very identical~~", "absolutely essential · almost identical"],
    ],
  },

  { t: "h", text: "4.33 (Ngày 24 · Viết mục 2–3) Task 1 ba nguồn — sợi chỉ chung và câu nối nguồn" },
  {
    t: "patterns",
    rows: [
      { formula: "The table + V…, while the line graph + V… . The pie chart + V…", vi: "Mở bài: hai nguồn cùng giai đoạn chung một câu, nguồn thứ ba một câu.", examples: [{ en: "The table gives the area of organic farmland in 2010 and 2020, while the line graph traces the number of organic farms over the same decade. The pie chart breaks down sales in 2020 by outlet.", vi: "Bảng cho diện tích đất hữu cơ năm 2010 và 2020, còn biểu đồ đường theo dõi số trang trại trong cùng thập kỷ. Biểu đồ tròn chia doanh số năm 2020 theo kênh bán." }] },
      { formula: "This growth / trend + was matched by / was mirrored in / was accompanied by + N", vi: "Nối hai nguồn CÙNG chiều — không nhân quả.", examples: [{ en: "This expansion was matched by a rise in the number of farms.", vi: "Sự mở rộng này đi cùng mức tăng số trang trại." }] },
      { formula: "As for / Turning to + N (nguồn 3), + S + V", vi: "Mở khổ cho nguồn còn lại.", examples: [{ en: "As for sales in 2020, supermarkets accounted for almost half.", vi: "Về doanh số năm 2020, siêu thị chiếm gần một nửa." }] },
    ],
  },
  { t: "rule", formula: "3 nguồn = 1 sợi chỉ chung → mở bài (2 câu) + overview (2 câu, có ý nối) + khổ 1 (hai nguồn cùng giai đoạn) + khổ 2 (nguồn còn lại)", vi: "Chia khổ theo câu chuyện, không theo số hình; không because giữa hai nguồn; năm đã qua ⇒ quá khứ đơn, kể cả hình tròn." },

  { t: "h", text: "4.34 (Ngày 24 · Viết mục 8) Tóm tắt bài giảng 10 phút (120–150 từ)" },
  {
    t: "patterns",
    rows: [
      { formula: "In his / her lecture on + N, + tên + argues / explains / shows that + S + V", vi: "Câu 1: nguồn + luận điểm bao trùm, động từ tường thuật ở hiện tại.", examples: [{ en: "In her lecture on the psychology of queuing, Dr Hale argues that how long a wait feels matters more than how long it lasts.", vi: "Trong bài giảng về tâm lý xếp hàng, TS Hale lập luận rằng cảm giác chờ quan trọng hơn thời gian chờ thật." }] },
      { formula: "She identifies / outlines + số + N (factors / stages). The first is…; the second…", vi: "Câu 2–4: gọi tên LOẠI rồi đếm.", examples: [{ en: "She identifies three factors that lengthen perceived waiting time.", vi: "Bà chỉ ra ba yếu tố làm thời gian chờ cảm nhận dài ra." }] },
      { formula: "She concludes that + S + V, although she concedes that + S + V", vi: "Câu cuối: kết luận + giới hạn mà chính giảng viên nêu.", examples: [{ en: "She concludes that managing perception is cheaper than shortening the wait, although she concedes that distraction cannot disguise very long delays.", vi: "Bà kết luận quản lý cảm nhận rẻ hơn rút ngắn thời gian chờ, dù thừa nhận sự phân tâm không che được lần chờ rất lâu." }] },
    ],
  },
  { t: "rule", formula: "luận điểm → các ý (gọi tên loại) → kết luận + giới hạn", vi: "Tóm ý, không tóm ví dụ; không ý kiến riêng; paraphrase, chỉ giữ thuật ngữ." },

  { t: "h", text: "4.35 (Ngày 24 · Nghe mục 1) Matching trong bài giảng dài" },
  {
    t: "table",
    head: ["Bước", "Việc"],
    rows: [
      ["Trước khi nghe (30–45 giây)", "gạch chân tên các mục; tóm mỗi lựa chọn A–H thành 2–3 chữ + đoán từ đồng nghĩa"],
      ["Nghe tên mục", "= vào trạm; chưa nghe tên mục kế thì chưa rời trạm"],
      ["Trong trạm", "ghi nháp 2–3 chữ khoá, chưa chọn chữ cái"],
      ["Câu chốt", "“So the point to take away…” ⇒ so với A–H rồi mới chọn"],
      ["Lỡ một trạm", "bỏ, nhảy theo tên mục kế; cuối bài đoán bằng chữ cái chưa dùng"],
    ],
  },
  { t: "rule", formula: "Tên mục (theo thứ tự đề) → 2–3 chữ khoá → câu chốt → chọn chữ cái", vi: "Câu hỏi đi theo thứ tự băng; lựa chọn thì xáo và được paraphrase; chi tiết đúng nhưng không phải ý chốt là mồi nhử." },

  { t: "h", text: "4.36 (Ngày 24 · Từ vựng mục 9) Trọng âm cụm hai từ" },
  { t: "rule", formula: "adj + N · adv + adj ⇒ cả hai từ đều nhấn, đỉnh (nucleus) ở từ SAU: a marked IN-crease · highly un-LIKE-ly", vi: "Đừng nuốt từ bổ nghĩa — nó mang điểm LR; nhưng đỉnh câu vẫn rơi vào từ chính." },
];
