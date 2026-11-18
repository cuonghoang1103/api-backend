/**
 * IELTS Tập 4 — Ngày 19 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, câu trả lời mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Câu điều kiện HỖN HỢP (quá khứ → hiện tại · hiện tại → quá khứ), could / might trong vế chính,
 *                     provided that / as long as / on condition that / supposing / otherwise / but for, đảo ngữ Had… / Were…,
 *                     if… were to / should                                                                     [G38]
 *                     — nối Tập 3 Ngày 15 (điều kiện loại 2 & 3, wish, từ thay if mức nhập) · Tập 4 Ngày 7 (đảo ngữ thay if)
 *   Bài 2 (reading)   Matching information 3 — Passage 3 lập luận (~900 từ), câu 27–40: 8 câu Matching information
 *                     + 6 câu Summary completion                                                               [R13]
 *                     — nối Tập 2 Ngày 16 (nhập) · Tập 3 Ngày 19 (gọi tên “loại thông tin”, 6 bước)
 *   Bài 3 (speaking)  Part 3 giả định & phản thực tế band 7 — khung 5 bước, mixed conditional khi nói           [S06]
 *                     — nối Tập 3 Ngày 15 (khung 4 bước “What would happen if…?”) · 🔊 would've trong câu dài
 *   Bài tập Ngày 19   41 câu có đáp án + 2 câu nói
 * Mọi id bắt đầu `t4d19-`.
 */
import type { Lesson } from '../data';

export const NGAY_19: Lesson[] = [
  /* ══════════════════════════════ BÀI 1 — NGỮ PHÁP ══════════════════════════════ */
  {
    id: "t4d19-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Câu điều kiện hỗn hợp · provided that / as long as / supposing — giả định đúng thời gian",
    goal: "Viết và nói không lỗi hai kiểu câu điều kiện hỗn hợp (quá khứ → hiện tại, hiện tại → quá khứ), chọn đúng would / could / might, và dùng đúng 10 từ thay if (provided that, as long as, on condition that, supposing, otherwise, but for…) trong Task 2 và Part 3.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **GRA band 7** (Viết + Nói): band 7 cần “nhiều cấu trúc phức, phần lớn câu không lỗi”. Câu điều kiện hỗn hợp là cấu trúc người band 6 hay viết sai thì nhất.",
          "**Hỗn hợp** = hai vế nói về **hai thời gian khác nhau**. Mỗi vế tự chọn thì theo thời gian của chính nó.",
          "Kiểu 1: ==If + had V3== (quá khứ không thật) → ==would + V== (hậu quả **bây giờ**). Kiểu 2: ==If + V2 / were== (tính chất **bây giờ** không thật) → ==would have + V3== (hậu quả **trong quá khứ**).",
          "would = chắc · could = có khả năng / có thể làm được · might = có lẽ. Đổi modal là đổi mức chắc chắn.",
          "provided that / as long as = “miễn là” (điều kiện mình **mong** xảy ra); sau chúng **không dùng will**.",
          "Ôn từ **Tập 3 Ngày 15** (loại 2 & 3, wish) và **Tập 4 Ngày 7** (đảo ngữ Had… / Were… / Should…).",
        ],
      },
      { t: "h", text: "1. Ôn 3 phút — bốn loại câu điều kiện và một câu hỏi duy nhất" },
      { t: "p", text: "Ở Tập 3 Ngày 15 bạn học bốn loại “thuần”: hai vế cùng một thời gian. Trước khi trộn, hãy chắc bạn còn nhớ. Mẹo band 7: đừng học thuộc số loại. Với **mỗi vế**, tự hỏi một câu: ==“Vế này nói về lúc nào, và có thật không?”==" },
      {
        t: "table",
        head: ["Vế nói về", "Thật / có thể", "Không thật (giả định)"],
        rows: [
          ["**Hiện tại / tương lai** — vế if", "If + V(s/es) (hiện tại đơn)", "If + V2 / were (quá khứ đơn)"],
          ["**Hiện tại / tương lai** — vế chính", "will / can / may + V", "would / could / might + V"],
          ["**Quá khứ** — vế if", "If + V2 (chuyện đã xảy ra thật)", "If + had + V3"],
          ["**Quá khứ** — vế chính", "V2", "would / could / might + have + V3"],
        ],
        caption: "Cột phải là “kho” cho mọi câu giả định. Câu hỗn hợp chỉ là lấy vế if ở một hàng và vế chính ở hàng khác.",
      },
      {
        t: "quiz",
        id: "t4d19-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 3 Ngày 15 (6 câu). Viết dạng đúng của động từ trong ngoặc",
        items: [
          { q: "If governments ___ (invest) more in public transport, fewer people would drive to work.", answers: ["invested"] },
          { q: "If the bridge had been inspected regularly, it ___ (not / collapse).", answers: ["would not have collapsed", "wouldn't have collapsed"] },
          { q: "I wish I ___ (know) the answer, but I'm afraid I don't.", answers: ["knew"] },
          { q: "If only the report ___ (publish — bị động) a year earlier.", answers: ["had been published"] },
          { q: "Unless the law ___ (change), nothing will improve.", answers: ["changes", "is changed"] },
          { q: "It's high time the city ___ (build) a second hospital.", answers: ["built"] },
        ],
      },
      { t: "rule", formula: "Mỗi vế tự hỏi: lúc nào? có thật không? → chọn thì theo vế đó", vi: "Sai dưới 5/6 ⇒ ôn Tập 3 Ngày 15 mục 2–5 trước khi học tiếp." },

      { t: "h", text: "2. Hỗn hợp kiểu 1 — quá khứ khác đi → HIỆN TẠI khác đi" },
      { t: "p", text: "Đây là kiểu gặp nhiều nhất trong IELTS. Một việc trong quá khứ **đã (không) xảy ra**, và bạn nói về **hậu quả kéo tới bây giờ**. Vế if lấy thì của “quá khứ không thật” (==had + V3==); vế chính lấy thì của “hiện tại không thật” (==would + V==). Dấu hiệu ở vế chính: **now, today, still, at present, these days**." },
      {
        t: "sodo",
        kind: "timeline",
        title: "If the city had built a metro in the 1990s, it would not be so congested today.",
        caption: "Vế if nằm ở QUÁ KHỨ (đã không xây) — vế chính nằm ở BÂY GIỜ (đang tắc).",
        marks: [
          { from: -7, label: "had built (không thật: thực tế không xây)", kieu: "diem", mau: 1 },
          { from: -1, to: 1, label: "would not be congested (không thật: thực tế đang tắc)", kieu: "doan", mau: 2 },
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "If + S + had + V3, S + would + V (now / today / still)",
            vi: "Nếu ngày trước đã…, thì bây giờ (đã)…",
            examples: [
              { en: "If the city had invested in public transport in the 1990s, it would not be so congested today.", vi: "Nếu thành phố đã đầu tư vào giao thông công cộng từ thập niên 1990 thì ngày nay đã không tắc đến thế." },
              { en: "If antibiotics had not been discovered, minor infections would still be fatal.", vi: "Nếu kháng sinh không được tìm ra thì những ca nhiễm trùng nhẹ đến giờ vẫn gây chết người." },
              { en: "If I had taken that job in Singapore, I would be living abroad now.", vi: "Nếu hồi đó tôi nhận công việc ở Singapore thì giờ tôi đang sống ở nước ngoài." },
            ],
          },
          {
            formula: "S + would + V (now), if + S + had + V3",
            vi: "Đảo thứ tự hai vế: không có dấu phẩy.",
            examples: [
              { en: "Many rural schools would have reliable internet access today if the scheme had not been cancelled.", vi: "Nhiều trường nông thôn ngày nay đã có mạng ổn định nếu chương trình không bị huỷ." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi người Việt hay sai ở kiểu 1",
        items: [
          "~~If the city invested in metro in the 1990s, it would not be congested today.~~ — tiếng Việt “nếu hồi đó đầu tư” không đổi dạng động từ nên bạn dễ viết quá khứ đơn. Nhưng trong vế if, quá khứ đơn = giả định về **hiện tại**. Quá khứ không thật phải là ==had invested==.",
          "~~If the scheme had not been cancelled, schools would have had internet today.~~ — có **today** thì hậu quả ở hiện tại ⇒ ==would have internet today== (have = “có”, động từ chính; **would + V**), không phải would have had.",
          "~~If I would have taken that job, …~~ — vế if **không có would**. Lỗi này người bản ngữ cũng nói, nhưng giám khảo vẫn tính là lỗi.",
          "Kiểm bằng thực tế: mỗi vế giả định phải **trái** với một sự thật. “had invested” ⇔ thực tế đã không đầu tư. “would not be congested” ⇔ thực tế đang tắc.",
        ],
      },
      { t: "rule", formula: "If + S + had + V3, S + would + V + now / today / still", vi: "Quá khứ không thật → hậu quả ở hiện tại. Thấy now / today / still ở vế chính ⇒ would + V, không phải would have V3." },
      {
        t: "quiz",
        id: "t4d19-hon-hop-1-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — hỗn hợp kiểu 1 (5 câu)",
        grammar: "If + S + had + V3, S + would (still / now) + V",
        items: [
          { q: "Nếu internet không được phát minh thì ngày nay chúng ta vẫn phụ thuộc vào thư giấy.", answers: ["If the internet had not been invented, we would still depend on letters today.", "If the internet hadn't been invented, we would still depend on letters today.", "If the internet had not been invented, we would still rely on letters today.", "If the internet hadn't been invented, we would still rely on letters today."], hint: "be invented · still · depend on / rely on · letters" },
          { q: "Nếu tôi học tiếng Anh nghiêm túc từ cấp ba thì bây giờ tôi đã không phải lo về kỳ thi này.", answers: ["If I had studied English seriously at high school, I would not be worried about this exam now.", "If I had studied English seriously at high school, I wouldn't be worried about this exam now.", "If I had studied English seriously in high school, I would not be worried about this exam now.", "If I had studied English seriously in high school, I wouldn't be worried about this exam now."], hint: "study seriously · at high school · be worried about · now" },
          { q: "Nếu chính phủ không cấm hút thuốc nơi công cộng thì tỉ lệ ung thư phổi hiện nay sẽ cao hơn nhiều.", answers: ["If the government had not banned smoking in public places, the rate of lung cancer would be much higher now.", "If the government hadn't banned smoking in public places, the rate of lung cancer would be much higher now.", "If the government had not banned smoking in public places, lung cancer rates would be much higher now.", "If the government hadn't banned smoking in public places, lung cancer rates would be much higher now."], hint: "ban smoking · in public places · the rate of lung cancer · much higher" },
          { q: "Nếu nhà máy đó bị đóng cửa từ năm 2010 thì con sông bây giờ đã sạch hơn.", answers: ["If the factory had been closed in 2010, the river would be cleaner now.", "If that factory had been closed in 2010, the river would be cleaner now."], hint: "bị động: had been closed · cleaner" },
          { q: "Nếu bố mẹ tôi không chuyển lên thành phố thì có lẽ giờ tôi đang làm nông.", answers: ["If my parents had not moved to the city, I would probably be farming now.", "If my parents hadn't moved to the city, I would probably be farming now.", "If my parents had not moved to the city, I would probably be a farmer now.", "If my parents hadn't moved to the city, I would probably be a farmer now."], hint: "move to the city · would probably be + V-ing / be a farmer" },
        ],
      },

      { t: "h", text: "3. Hỗn hợp kiểu 2 — hiện tại khác đi → QUÁ KHỨ đã khác đi" },
      { t: "p", text: "Kiểu này hiếm hơn nhưng rất “đắt” trong Part 3. Điều kiện là một **tính chất lâu dài, đúng cả bây giờ** (tính cách, năng lực, hoàn cảnh chung), còn hậu quả là **một việc cụ thể trong quá khứ**. Vế if dùng ==quá khứ đơn / were== (hiện tại không thật); vế chính dùng ==would have + V3==." },
      {
        t: "patterns",
        rows: [
          {
            formula: "If + S + V2 / were, S + would + have + V3 (last year / in 2020 / then)",
            vi: "Nếu (bản chất) S là…, thì hồi đó đã…",
            examples: [
              { en: "If I were more confident, I would have applied for the scholarship last year.", vi: "Nếu tôi là người tự tin hơn thì năm ngoái tôi đã nộp đơn xin học bổng." },
              { en: "If the company really cared about its staff, it would not have cut their pay during the crisis.", vi: "Nếu công ty thật sự quan tâm nhân viên thì đã không cắt lương họ trong khủng hoảng." },
              { en: "If she spoke Japanese, she would have been sent to the Tokyo office.", vi: "Nếu cô ấy biết tiếng Nhật thì đã được cử sang văn phòng Tokyo." },
            ],
          },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai kiểu hỗn hợp đặt cạnh nhau",
        cols: [
          { title: "Kiểu 1: quá khứ → hiện tại", items: ["Vế if: **had + V3** (một sự kiện đã qua)", "Vế chính: **would + V** + now / today", "If he **had saved** money, he **would own** a house now.", "Thực tế: đã không tiết kiệm · giờ không có nhà"] },
          { title: "Kiểu 2: hiện tại → quá khứ", items: ["Vế if: **V2 / were** (tính chất lâu dài)", "Vế chính: **would have + V3** + mốc quá khứ", "If he **were** careful with money, he **would have saved** more.", "Thực tế: vốn không cẩn thận · đã không tiết kiệm"] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Dễ nhầm ở kiểu 2",
        items: [
          "Vế if kiểu 2 gần như luôn là **động từ trạng thái**: be, know, speak, have, like, care, live, understand. Nếu vế if là một **hành động một lần** trong quá khứ thì đó là loại 3 hoặc kiểu 1, không phải kiểu 2.",
          "~~If I am more confident, I would have applied.~~ — giả định trái thực tế thì lùi thì: ==were==. Văn viết dùng **were** cho mọi ngôi (If I were / If it were); nói thường ngày nghe “If I was” vẫn chấp nhận, nhưng **were** an toàn hơn.",
          "~~If she spoke Japanese, she would be sent to Tokyo last year.~~ — có **last year** ⇒ ==would have been sent==.",
        ],
      },
      { t: "rule", formula: "If + S + V2 / were, S + would + have + V3 + mốc quá khứ", vi: "Tính chất hiện tại không thật → hậu quả trong quá khứ. Vế if thường là be / know / speak / have / care." },
      {
        t: "quiz",
        id: "t4d19-hon-hop-2-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — hỗn hợp kiểu 2 (4 câu)",
        grammar: "If + S + V2 / were, S + would have + V3",
        items: [
          { q: "Nếu tôi giỏi toán hơn thì hồi đó tôi đã chọn ngành kỹ thuật.", answers: ["If I were better at maths, I would have chosen engineering.", "If I were better at math, I would have chosen engineering.", "If I was better at maths, I would have chosen engineering.", "If I were better at maths, I would have chosen engineering then."], hint: "be better at maths · choose engineering" },
          { q: "Nếu anh ấy không sợ độ cao thì tuần trước anh ấy đã leo núi cùng chúng tôi.", answers: ["If he were not afraid of heights, he would have climbed the mountain with us last week.", "If he weren't afraid of heights, he would have climbed the mountain with us last week.", "If he was not afraid of heights, he would have climbed the mountain with us last week.", "If he wasn't afraid of heights, he would have climbed the mountain with us last week."], hint: "be afraid of heights · climb the mountain · last week" },
          { q: "Nếu thành phố này có hệ thống thoát nước tốt thì trận mưa hôm qua đã không gây ngập.", answers: ["If this city had a good drainage system, yesterday's rain would not have caused flooding.", "If this city had a good drainage system, yesterday's rain wouldn't have caused flooding.", "If the city had a good drainage system, yesterday's rain would not have caused flooding.", "If the city had a good drainage system, yesterday's rain wouldn't have caused flooding."], hint: "a good drainage system · yesterday's rain · cause flooding" },
          { q: "Nếu tôi biết lập trình thì năm ngoái tôi đã tự xây trang web đó.", answers: ["If I knew how to code, I would have built that website myself last year.", "If I knew how to program, I would have built that website myself last year.", "If I could code, I would have built that website myself last year."], hint: "know how to code · build · myself · last year" },
        ],
      },

      { t: "h", text: "4. Vế chính không chỉ có would — could, might và dạng tiếp diễn" },
      { t: "p", text: "Band 6 viết would ở mọi câu giả định. Band 7 chọn modal theo **mức chắc chắn** và theo **ý muốn nói** (chắc sẽ / có khả năng làm / có lẽ). Đây cũng là một dạng rào đón (hedging — Tập 4 Ngày 13)." },
      {
        t: "table",
        head: ["Vế chính", "Nghĩa", "Ví dụ"],
        rows: [
          ["would + V / would have + V3", "kết quả gần như chắc", "…, the river **would be** cleaner now."],
          ["could + V / could have + V3", "có khả năng / đủ điều kiện để làm", "If she had saved more, she **could retire** now. (đủ tiền để nghỉ)"],
          ["might + V / might have + V3", "có lẽ, không chắc", "If the warning had been issued earlier, some lives **might have been saved**."],
          ["would be + V-ing", "việc đang diễn ra lúc này", "If I had accepted the offer, I **would be working** in Berlin now."],
          ["would have been + V-ing", "việc lẽ ra đang diễn ra tại một lúc trong quá khứ", "If the flight had left on time, we **would have been sitting** in the meeting by noon."],
          ["should have + V3 (không có if)", "lẽ ra nên — phê bình quá khứ", "The council **should have consulted** residents first."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với could và might",
        items: [
          "~~If she had saved more, she can retire now.~~ — giả định thì dùng dạng lùi: ==could==.",
          "**may have + V3** = “có lẽ đã” (chuyện có thật, chưa rõ). Trong câu giả định trái thực tế, an toàn nhất là ==might have==: “may have” ở đây người bản ngữ vẫn nói, nhưng nhiều giáo trình và giám khảo coi là lỗi vì nó gợi “có lẽ đã xảy ra thật”: ~~If he had left earlier, he may have caught the train~~ → **might have caught**.",
          "Phủ định: **might not have + V3** (có lẽ đã không) khác **could not have + V3** (không thể nào đã): Without the loan, the firm **could not have survived**.",
        ],
      },
      { t: "rule", formula: "would = chắc  ·  could = có thể làm được  ·  might = có lẽ  ( + V cho hiện tại · + have V3 cho quá khứ )", vi: "Một câu giả định có hai quyết định: thời gian của mỗi vế và mức chắc chắn của vế chính." },
      {
        t: "quiz",
        id: "t4d19-modal-dien",
        kind: "fill",
        title: "Viết dạng đúng — chú ý thời gian từng vế (6 câu)",
        items: [
          { q: "If the vaccine had not been developed so quickly, many more people ___ (still / be) at risk today.", answers: ["would still be"] },
          { q: "If he were a better manager, the team ___ (not / lose) three engineers last year.", answers: ["would not have lost", "wouldn't have lost"] },
          { q: "If I had not moved to the city, I ___ (might / not / meet) my business partner. [nói về quá khứ]", answers: ["might not have met"] },
          { q: "If she had saved more when she was young, she ___ (could / retire) now.", answers: ["could retire"] },
          { q: "If we did not depend so heavily on tourism, the pandemic ___ (not / damage) our economy so badly.", answers: ["would not have damaged", "wouldn't have damaged"] },
          { q: "If I had accepted that offer, I ___ (work — tiếp diễn) in Berlin right now.", answers: ["would be working", "'d be working"] },
        ],
      },

      { t: "h", text: "5. Mười từ thay if — mỗi từ một sắc thái" },
      { t: "p", text: "Tập 3 Ngày 15 mới giới thiệu unless / as long as / provided that ở mức nhận ra. Band 7 phải **chọn đúng từ theo ý**: điều kiện mình mong, điều kiện bắt buộc, giả định để bàn, hay “nếu không có…”." },
      {
        t: "table",
        head: ["Từ nối", "Nghĩa – sắc thái", "Ví dụ"],
        rows: [
          ["provided (that) / providing (that)", "miễn là — điều kiện **cần**, người nói **muốn** kết quả; trang trọng; hợp Task 2", "Nuclear power is a sensible option **provided that** waste is stored safely."],
          ["as long as / so long as", "miễn là — như trên, tự nhiên hơn; hợp Speaking", "I don't mind working late **as long as** I get the weekend off."],
          ["on condition that", "với điều kiện là — thoả thuận, cam kết; rất trang trọng", "The loan was approved **on condition that** the firm cut its emissions."],
          ["only if (đầu câu ⇒ đảo ngữ vế chính)", "chỉ khi — điều kiện **duy nhất**", "**Only if** funding is secured **will the project** go ahead."],
          ["unless", "trừ khi = except if", "Rents will keep rising **unless** more homes are built."],
          ["supposing / suppose (that) · imagine · what if", "giả sử — mở một giả định để bàn; hay dùng khi nói", "**Supposing** everyone worked from home, what would happen to city centres?"],
          ["assuming (that)", "với giả thiết là — coi một điều là đúng để tính tiếp", "**Assuming that** prices remain stable, the scheme will pay for itself in five years."],
          ["otherwise / or else", "nếu không thì — đứng ở câu / vế sau", "The grant was renewed; **otherwise**, the laboratory would have closed."],
          ["but for + N · if it were not for + N · had it not been for + N", "nếu không có / không nhờ — theo sau là **cụm danh từ**", "**But for** foreign aid, the health system would have collapsed."],
          ["even if · whether or not", "kể cả nếu · dù có hay không — kết quả **không đổi**", "**Even if** fares were free, some people would still drive."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + will / can + V, provided that / as long as + S + V(s/es)",
            vi: "Điều kiện có thật: vế điều kiện ở hiện tại đơn, không dùng will.",
            examples: [
              { en: "Remote work can raise productivity provided that employees are given clear targets.", vi: "Làm từ xa có thể tăng năng suất miễn là nhân viên được giao mục tiêu rõ ràng." },
              { en: "Tourism benefits local people as long as the profits stay in the community.", vi: "Du lịch có lợi cho người địa phương miễn là lợi nhuận ở lại cộng đồng." },
            ],
          },
          {
            formula: "But for / Had it not been for + N, S + would (have) + V(3)",
            vi: "Nếu không có N thì… — dùng với loại 2, loại 3 và hỗn hợp.",
            examples: [
              { en: "Had it not been for the printing press, literacy would still be the privilege of a small elite.", vi: "Nếu không có máy in thì biết chữ đến nay vẫn là đặc quyền của một nhóm nhỏ." },
              { en: "If it were not for my scholarship, I could not afford to study abroad.", vi: "Nếu không nhờ học bổng thì tôi không đủ tiền du học." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Năm lỗi hay sai với từ thay if",
        items: [
          "~~provided that the government will invest~~ · ~~as long as you will work hard~~ — sau các từ này là **hiện tại đơn** (như sau if loại 1).",
          "**provided that / as long as** chỉ dùng cho điều kiện dẫn tới kết quả **mong muốn**. ~~Provided that temperatures rise, crops will fail.~~ → **If** temperatures rise, crops will fail.",
          "**unless** không thay được “if… not” khi câu giả định trái thực tế mang nghĩa “vì… không”: ~~Unless he were so lazy, he would pass.~~ → **If he weren't** so lazy, he would pass.",
          "**as long as** còn nghĩa thời gian “lâu chừng nào”: You can stay **as long as** you like. Nhìn ngữ cảnh để phân biệt.",
          "**in case** không phải “nếu”: Take an umbrella **in case** it rains = mang **phòng khi** mưa (mang trước). ~~In case it rains, I will stay home~~ → **If** it rains…",
          "~~Supposed everyone worked from home~~ → **Supposing / Suppose**. Còn **but for** phải theo sau là danh từ: ~~But for the government helped~~ → But for **the government's help**.",
        ],
      },
      { t: "rule", formula: "provided that / as long as + S + V(s/es)  ·  but for + N, S + would (have) + V(3)  ·  …; otherwise, S + would + V", vi: "Miễn là (điều kiện mình mong) · nếu không có N · nếu không thì." },
      {
        t: "quiz",
        id: "t4d19-thay-if-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ cho trong gợi ý, không dùng if (5 câu)",
        grammar: "provided that / as long as + hiện tại đơn · but for + N · otherwise · supposing + quá khứ đơn",
        items: [
          { q: "Mạng xã hội có ích miễn là người dùng kiểm tra thông tin họ chia sẻ. (provided that)", answers: ["Social media is useful provided that users check the information they share.", "Social media is useful provided that users check the information that they share.", "Social media is useful provided users check the information they share."], hint: "useful · users · check the information they share" },
          { q: "Trẻ em có thể dùng máy tính bảng miễn là cha mẹ giới hạn thời gian. (as long as)", answers: ["Children can use tablets as long as their parents limit the time.", "Children can use tablets as long as parents limit the time.", "Children can use tablets as long as their parents limit their screen time."], hint: "tablets · limit the time" },
          { q: "Nếu không có khoản vay đó thì công ty đã phá sản. (but for)", answers: ["But for that loan, the company would have gone bankrupt.", "But for the loan, the company would have gone bankrupt."], hint: "loan · go bankrupt" },
          { q: "Chúng tôi rời đi sớm; nếu không thì chúng tôi đã lỡ chuyến bay. (otherwise)", answers: ["We left early; otherwise, we would have missed the flight.", "We left early; otherwise we would have missed the flight.", "We left early. Otherwise, we would have missed the flight."], hint: "leave early · miss the flight" },
          { q: "Giả sử bạn được làm thị trưởng, bạn sẽ thay đổi điều gì đầu tiên? (supposing)", answers: ["Supposing you were the mayor, what would you change first?", "Supposing you were mayor, what would you change first?", "Supposing that you were the mayor, what would you change first?"], hint: "be the mayor · change first" },
        ],
      },

      { t: "h", text: "6. Đảo ngữ thay if + ba dạng tinh ở mức C1" },
      { t: "p", text: "Tập 4 Ngày 7 mục 7 đã dạy bỏ if rồi đảo **Had / Were / Should** lên đầu. Hôm nay ghép với câu hỗn hợp: vế đảo giữ nguyên thời gian của nó, vế chính tự chọn thì. Dùng **một lần** trong Task 2 là đủ gây ấn tượng; không dùng khi nói chuyện thường." },
      {
        t: "table",
        head: ["Câu có if", "Bỏ if + đảo", "Ghi chú"],
        rows: [
          ["If the city **had invested** earlier, it **would not be** so congested now.", "**Had the city invested** earlier, it would not be so congested now.", "Hỗn hợp kiểu 1. Phủ định: **Had it not invested…** (không viết tắt Hadn't)."],
          ["If people **were** more patient, the scheme **would have worked**.", "**Were people** more patient, the scheme would have worked.", "Hỗn hợp kiểu 2 — hiếm, rất trang trọng."],
          ["If it **were not for** tourism, the town **would have** no income.", "**Were it not for** tourism, the town would have no income.", "= But for tourism."],
          ["If taxes **were to rise** again, many firms **would relocate**.", "**Were taxes to rise** again, many firms would relocate.", "were to + V: giả định tương lai, người viết coi là khó xảy ra."],
          ["If you **should need** further details, please contact me.", "**Should you need** further details, please contact me.", "should: “nếu chẳng may / nếu có” — thư từ trang trọng."],
        ],
      },
      {
        t: "table",
        head: ["Dạng tinh", "Dùng khi", "Ví dụ"],
        rows: [
          ["If + S + were to + V", "giả định về tương lai mà mình thấy **xa vời**; lịch sự khi đề xuất", "If the government **were to ban** private cars, public opinion would turn against it."],
          ["If + S + should / happen to + V", "khả năng thấp nhưng có thật", "If you **happen to see** the report, could you send it to me?"],
          ["If + will / would (nghĩa “sẵn lòng”)", "lời mời / yêu cầu lịch sự — ngoại lệ hay gặp nhất cho will / would sau if", "If you **would** take a seat, the doctor will see you shortly."],
          ["if so · if not · if any · if necessary · if possible", "rút gọn vế if — làm câu gọn", "Few, **if any**, of these schemes have been evaluated. Are fares too high? **If so**, who should pay?"],
        ],
      },
      { t: "rule", formula: "Had + S + V3, S + would + V (now)  ·  Were + S + to V, S + would + V  ·  Should + S + V, …", vi: "Bỏ if, đưa Had / Were / Should lên trước chủ ngữ; phủ định viết rời (Had it not…)." },
      {
        t: "quiz",
        id: "t4d19-dao-dien",
        kind: "fill",
        title: "Hoàn thành câu thứ hai cho cùng nghĩa — điền 2–4 từ (4 câu)",
        items: [
          { q: "If the dam had not been built, the valley would still be farmland. → ___ been built, the valley would still be farmland.", answers: ["Had the dam not"] },
          { q: "If it were not for volunteers, the festival could not take place. → ___ volunteers, the festival could not take place.", answers: ["Were it not for", "But for"] },
          { q: "If interest rates rose sharply, many families would lose their homes. → Were interest rates ___ sharply, many families would lose their homes.", answers: ["to rise"] },
          { q: "If you need any help, please ask at reception. → ___ any help, please ask at reception.", answers: ["Should you need"] },
        ],
      },

      { t: "h", text: "7. Dùng ở đâu trong bài thi — band 6 và band 7" },
      {
        t: "table",
        head: ["Chỗ dùng", "Band 6 (ước tính)", "Band 7 (ước tính)"],
        rows: [
          ["Task 2 — chứng minh một chính sách cũ đúng / sai", "The government built many roads, so now there are many cars.", "**Had** the money **been spent** on rail rather than roads, far fewer commuters **would depend** on cars today."],
          ["Task 2 — đồng ý có điều kiện (thesis)", "I agree with this idea if it is controlled.", "I would support such a policy **provided that** it is accompanied by proper safeguards."],
          ["Task 2 — bác ý đối lập", "Some people say technology is bad, but it is useful.", "**But for** digital tools, education **would have come** to a halt during the pandemic."],
          ["Part 3 — “What if…?” về quá khứ", "If no internet, life is very difficult.", "If the internet **had never been invented**, I think we**'d still be queuing** at banks."],
          ["Part 3 — nói về bản thân", "I am shy so I didn't join.", "If I **weren't** so shy, I **would have joined** the debating club."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo dùng đúng liều",
        items: [
          "Task 2: **một** câu hỗn hợp + **một** câu provided that / unless là đủ. Bốn câu if liền nhau làm bài nghe như bài tập ngữ pháp.",
          "Chỗ đắt nhất: câu **bác ý đối lập** và câu **ví dụ** (“nếu ngày đó không… thì giờ…”) — một câu giả định thay được cả một ví dụ bịa số liệu.",
          "Sau khi viết, soát 10 giây: vế if có would không? vế chính có now / today mà lại viết would have không?",
        ],
      },

      { t: "h", text: "8. Kiểm tra cuối bài (16 câu)" },
      {
        t: "mcq",
        id: "t4d19-np-chon",
        title: "Chọn phương án đúng (10 câu)",
        items: [
          { q: "If the company ___ in research ten years ago, it would be the market leader today.", options: ["invested", "had invested", "would have invested", "has invested"], correct: 1, why: "“ten years ago” = quá khứ không thật ⇒ had invested; vế chính “today” ⇒ would be. Hỗn hợp kiểu 1." },
          { q: "If I were taller, I ___ for the school basketball team when I was sixteen.", options: ["would be chosen", "will have been chosen", "would have been chosen", "had been chosen"], correct: 2, why: "Tính chất hiện tại (were taller) → việc quá khứ (when I was sixteen) ⇒ would have been chosen. Kiểu 2." },
          { q: "Electric cars will become popular ___ charging points are widely available.", options: ["unless", "in case", "supposing", "provided that"], correct: 3, why: "Điều kiện cần cho một kết quả mong muốn ⇒ provided that. unless làm câu ngược nghĩa." },
          { q: "___ the lifeguard's quick reaction, the child would have drowned.", options: ["But for", "Unless", "Otherwise", "As long as"], correct: 0, why: "Theo sau là cụm danh từ, nghĩa “nếu không nhờ” ⇒ But for." },
          { q: "Which sentence is correct?", options: ["If he had listened to his doctor, he would have been healthy now.", "If he listened to his doctor, he would be healthy now. (nói về lời khuyên năm ngoái)", "If he had listened to his doctor, he would be healthy now.", "If he would have listened to his doctor, he would be healthy now."], correct: 2, why: "Quá khứ không thật (had listened) → hiện tại (would be… now). A sai vì now đi với would have been; D có would trong vế if." },
          { q: "As long as the weather ___ fine, the ceremony will be held outdoors.", options: ["will stay", "stays", "would stay", "stayed"], correct: 1, why: "Sau as long as dùng hiện tại đơn, không dùng will." },
          { q: "If the warning had been issued earlier, some of the damage ___.", options: ["might have been avoided", "may be avoided", "might avoid", "can have been avoided"], correct: 0, why: "Giả định quá khứ, mức “có lẽ” ⇒ might have been + V3 (bị động)." },
          { q: "___ taxes to rise again, many small firms would be forced to close.", options: ["Had", "Should", "If", "Were"], correct: 3, why: "Were + S + to V = If S were to V (đảo ngữ). Should đi với động từ nguyên mẫu không to: Should taxes rise…" },
          { q: "The roof was repaired in time; ___, the whole ceiling would have fallen in.", options: ["unless", "provided", "otherwise", "supposing"], correct: 2, why: "“Nếu không thì” đứng đầu vế sau, sau dấu chấm phẩy ⇒ otherwise." },
          { q: "Which sentence uses “provided that” appropriately?", options: ["Provided that the river floods, hundreds of homes will be destroyed.", "Students may leave early provided that they have finished the test.", "Provided that he will apologise, I will forgive him.", "Provided that I were rich, I would buy a boat."], correct: 1, why: "provided that = điều kiện cần cho kết quả được phép / mong muốn, + hiện tại (hoàn thành). A là kết quả xấu ⇒ If; C có will; D là giả định trái thực tế ⇒ If." },
        ],
      },
      {
        t: "quiz",
        id: "t4d19-np-viet-lai",
        kind: "fill",
        title: "Viết lại — gõ CẢ câu, bắt đầu bằng từ cho sẵn (6 câu)",
        items: [
          { q: "The town didn't build flood defences, so it is at risk now. → If the town …", answers: ["If the town had built flood defences, it would not be at risk now.", "If the town had built flood defences, it wouldn't be at risk now."] },
          { q: "I don't speak French, so I didn't understand the film. → If I …", answers: ["If I spoke French, I would have understood the film."] },
          { q: "She missed the interview, so she isn't working there now. → If she …", answers: ["If she had not missed the interview, she would be working there now.", "If she hadn't missed the interview, she would be working there now."] },
          { q: "You can borrow the car, but you must return it by six. → You can borrow the car as …", answers: ["You can borrow the car as long as you return it by six."] },
          { q: "Without the grant, the museum would have closed. → But …", answers: ["But for the grant, the museum would have closed."] },
          { q: "If the bank had not lent us the money, we would not own this shop today. → Had …", answers: ["Had the bank not lent us the money, we would not own this shop today.", "Had the bank not lent us the money, we wouldn't own this shop today."] },
        ],
      },
    ],
  },

  /* ══════════════════════════════ BÀI 2 — ĐỌC ══════════════════════════════ */
  {
    id: "t4d19-doc",
    kind: "reading",
    title: "Đọc: Matching information 3 — tìm “loại thông tin” trong Passage 3 lập luận",
    goal: "Làm đúng ít nhất 10/14 câu của một Passage 3 lập luận trong 20 phút: gọi tên loại thông tin trừu tượng mà câu hỏi đòi (a concession, a rebuttal, a criterion…), khoanh vùng bằng vai trò của đoạn chứ không bằng từ khoá, xử lý “NB You may use any letter more than once”, rồi làm 6 câu Summary completion.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **Reading band 7**: mục tiêu Passage 3 ≥ 9/13. Matching information là dạng tốn thời gian nhất — làm sai cách là cháy giờ cả đề.",
          "Câu hỏi không hỏi nội dung, mà hỏi **đoạn nào chứa một loại thông tin**: a reference to… · an explanation of… · a criticism of…",
          "Ở Passage 3, câu hỏi **không lặp từ khoá** của bài. Bạn khớp bằng ==chức năng của câu== (nêu ví dụ, nhượng bộ, bác lại, đặt tiêu chí), không khớp bằng chữ.",
          "Thứ tự câu hỏi **không theo** thứ tự bài; một đoạn có thể dùng **hai lần**, có đoạn **không dùng**.",
          "Làm dạng này **sau** các dạng khác của cùng passage — lúc đó bạn đã đọc bài một lượt.",
          "Ôn từ **Tập 2 Ngày 16** (nhập) và **Tập 3 Ngày 19** (gọi tên loại thông tin + 6 bước).",
        ],
      },
      { t: "h", text: "1. Ôn Tập 2 Ngày 16 · Tập 3 Ngày 19 — và Passage 3 khác gì" },
      {
        t: "table",
        head: ["Điểm", "Tập 2–3 (band 5–6)", "Tập 4 (band 7 — Passage 3)"],
        rows: [
          ["Loại bài", "mô tả, kể sự việc: ai làm gì, kết quả ra sao", "lập luận: quan điểm – phản bác – tiêu chí – đánh giá"],
          ["Thông tin cần tìm", "cụ thể: a figure, an example, a date", "trừu tượng: a concession, a rebuttal, a condition, an implication"],
          ["Mức paraphrase", "đổi từ đồng nghĩa (cost → price)", "đổi cả cách nói: một câu hỏi tóm **ý của 2–3 câu** trong bài"],
          ["Vị trí thông tin", "thường ở câu chủ đề của đoạn", "hay nằm ở **giữa hoặc cuối** đoạn, trong mệnh đề phụ"],
          ["Bẫy", "hai đoạn cùng nhắc một từ", "hai đoạn cùng bàn một ý nhưng **vai trò khác nhau** (đoạn nêu, đoạn bác)"],
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao dạng này khó nhất ở Passage 3",
        items: [
          "Bạn không scan được: câu hỏi “a warning about giving something too much attention” không có từ nào trùng với bài.",
          "Đáp án chỉ là **một chi tiết** của đoạn, không phải ý chính ⇒ khác hẳn Matching headings (Tập 4 Ngày 3).",
          "Cách thắng: sau lượt đọc đầu, bạn phải nhớ được ==mỗi đoạn làm việc gì== trong lập luận (ghi 3–4 chữ bên lề).",
        ],
      },

      { t: "h", text: "2. Mười hai “loại thông tin” trừu tượng — đọc câu hỏi là biết tìm câu kiểu gì" },
      {
        t: "table",
        head: ["Câu hỏi bắt đầu bằng", "Trong bài sẽ là", "Tín hiệu hay đi kèm"],
        rows: [
          ["a reference to / a mention of", "chỉ nhắc qua, có khi nửa câu", "tên riêng, thời điểm, cụm danh từ"],
          ["an example of / an instance of", "một trường hợp cụ thể minh hoạ", "say, for instance, such as, one…"],
          ["an explanation of / the reason why", "câu trả lời cho “vì sao / bằng cách nào”", "because, since, in other words, the result is"],
          ["a description of how…", "quá trình / cơ chế", "động từ nối tiếp, whereas, the more… the more"],
          ["a contrast between / a comparison of", "hai vật đặt cạnh nhau", "whereas, by contrast, unlike, rather than"],
          ["a claim / the view / the suggestion that", "quan điểm của ai đó, chưa chắc là của tác giả", "argue, maintain, on this view, the argument goes"],
          ["a criticism of / an objection to", "lời chê, điểm yếu", "complaint, critics, flaw, fail to"],
          ["a concession / an acknowledgement that", "thừa nhận điểm yếu của phe mình", "admittedly, it is true that, although, yet"],
          ["a rebuttal / a response to criticism", "đáp trả lời chê", "have responded, in reply, however"],
          ["a condition / a rule / a criterion", "điều kiện để điều gì được chấp nhận", "only, provided that, as long as, entitled to"],
          ["a warning / a risk", "điều có thể sai nếu không cẩn thận", "will overestimate, risk, danger, neglect"],
          ["a conclusion / an overall assessment", "đánh giá cuối", "ultimately, best described as, where does this leave"],
        ],
      },
      {
        t: "mcq",
        id: "t4d19-doc-loai",
        title: "Câu trong bài thuộc “loại thông tin” nào? (6 câu)",
        items: [
          { q: "“Admittedly, the survey covered only two cities, yet its findings have been repeated elsewhere.”", options: ["an example", "a concession", "a prediction", "a definition"], correct: 1, why: "Admittedly… yet… = thừa nhận điểm yếu rồi vẫn giữ quan điểm ⇒ a concession." },
          { q: "“Supporters have replied that the same charge could be made against any statistical model.”", options: ["a response to criticism", "a description of a process", "a warning", "a reference to a date"], correct: 0, why: "have replied that… = đáp trả lời chê ⇒ a response to criticism / a rebuttal." },
          { q: "“A grant is awarded only where the applicant can show that local residents were consulted.”", options: ["a contrast", "a criticism", "a condition", "an example"], correct: 2, why: "only where… = điều kiện để được chấp nhận ⇒ a condition / a criterion." },
          { q: "“Unlike their parents, who saved for years before buying, younger buyers expect to borrow.”", options: ["a claim that is rejected", "a reason", "a conclusion", "a contrast between two groups"], correct: 3, why: "Unlike… = đặt hai nhóm cạnh nhau ⇒ a contrast." },
          { q: "“If planners rely on these figures alone, they will underestimate demand in rural areas.”", options: ["a warning", "a definition", "an account of an experiment", "a concession"], correct: 0, why: "If… they will underestimate… = điều có thể sai ⇒ a warning. Chú ý: câu điều kiện loại 1 rất hay mang lời cảnh báo." },
          { q: "“The argument goes that cheap flights have made travel more democratic.”", options: ["the writer's own conclusion", "a statistic", "a view held by others", "a rule"], correct: 2, why: "The argument goes that… = tường thuật quan điểm của người khác, tác giả chưa nhận là của mình." },
        ],
      },

      { t: "h", text: "3. Quy trình 6 bước cho Passage 3 (≈ 10 phút cho 8 câu)" },
      {
        t: "sodo",
        kind: "flow",
        title: "Matching information ở Passage 3",
        steps: [
          { label: "1. Làm dạng khác trước", sub: "Summary / Y-N-NG / MCQ đi theo thứ tự bài ⇒ đọc xong là có bản đồ đoạn" },
          { label: "2. Ghi vai trò từng đoạn", sub: "3–4 chữ bên lề: A = bị coi thường · B = lý lẽ ủng hộ · C = ví dụ…" },
          { label: "3. Gọi tên loại thông tin", sub: "gạch chân danh từ đầu câu hỏi: a warning / an example / a claim…" },
          { label: "4. Đoán 1–2 đoạn ứng viên", sub: "dựa vào vai trò đoạn, KHÔNG dựa vào từ trùng" },
          { label: "5. Tìm đúng câu chứng cứ", sub: "phải chỉ tay được vào 1–2 câu; khớp đủ MỌI phần của câu hỏi" },
          { label: "6. Câu khó để cuối", sub: "còn 2 câu ⇒ so trực tiếp 2 đoạn ứng viên; không bỏ trống" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn bẫy ở band 7",
        items: [
          "**Trùng từ, sai vai trò**: đoạn D nhắc “politics” và câu hỏi cũng có “political” — nhưng câu hỏi đòi **a rule**, mà D chỉ là lời chê. Luôn khớp **loại thông tin** trước.",
          "**Khớp nửa câu**: câu hỏi “flaws in research that was **nevertheless influential**” có hai phần. Đoạn chỉ có lời chê mà không có “vẫn có ảnh hưởng” ⇒ chưa đúng.",
          "**Tưởng mỗi đoạn một câu**: có dòng “NB You may use any letter more than once” ⇒ gần như chắc có một đoạn dùng hai lần và ít nhất một đoạn không dùng.",
          "**Chọn theo ý chính của đoạn**: đáp án thường là một chi tiết phụ, nhiều khi nằm ở câu cuối đoạn.",
        ],
      },
      { t: "rule", formula: "loại thông tin (danh từ đầu câu hỏi) → vai trò đoạn → câu chứng cứ khớp ĐỦ mọi phần", vi: "Không scan từ khoá. Mỗi đáp án phải chỉ được vào 1–2 câu cụ thể trong đoạn." },

      { t: "h", text: "4. Luyện trọn bài — Reading Passage 3, Questions 27–40 (20 phút)" },
      { t: "p", text: "Bấm giờ **20 phút**. Thứ tự nên làm: đọc lướt cả bài 3 phút và ghi vai trò đoạn → **Questions 35–40** (Summary, theo thứ tự bài) → quay lại **Questions 27–34** (Matching information). Bài tự soạn; các nghiên cứu được nhắc tới là có thật nhưng được kể giản lược." },
      {
        t: "passage",
        title: "What If? The Uses and Abuses of Counterfactual History",
        intro: "Reading Passage 3 — You should spend about 20 minutes on Questions 27–40.",
        paras: [
          { label: "A", text: "For most of the twentieth century, professional historians treated the question “what if?” with a suspicion bordering on contempt. Their task, as they saw it, was to explain what had happened; to speculate about what had not was to abandon evidence for imagination. One influential British historian dismissed such speculation as a “parlour game”, an after-dinner amusement for people who could not accept that their side had lost. Had the question been confined to novelists, the matter might have rested there. Yet over the past few decades the counterfactual — a statement about what would have followed if some past event had turned out differently — has moved from the margins of the discipline towards its centre." },
          { label: "B", text: "The case for taking counterfactuals seriously begins with an awkward observation: historians use them all the time without admitting it. To say that a poor harvest caused a rebellion is to claim, implicitly, that if the harvest had been good the rebellion would not have broken out, or would at least have taken a different form. Every causal statement, in other words, carries a hidden “what if” inside it. Defenders of the method argue that it is more honest to bring that hidden claim into the open, where it can be examined, than to leave it buried in a confident narrative." },
          { label: "C", text: "The most celebrated demonstration came not from a political historian but from an economist. In the 1960s an American scholar set out to test the widely held belief that the railways had been indispensable to the growth of the United States in the nineteenth century. Rather than simply describing what the railways had done, he constructed a detailed model of an economy in which they had never been built, and in which goods travelled by canal, river and wagon instead. His conclusion was startling: without the railways, national output in 1890 would have been only a few per cent lower. The railways had been useful, but far from essential. The study was fiercely attacked — some of its assumptions about canal-building were decidedly optimistic — yet it showed that an imagined past could be built from real data and could, crucially, be checked by others. It went on to reshape the way economic history was written." },
          { label: "D", text: "Such rigour is rare, and critics have had little difficulty in finding weaker examples. A common complaint is that counterfactual writers tend to imagine the outcomes they would have preferred. A conservative author pictures a world in which a revolution never took place and finds it more prosperous; a radical one removes a war and discovers a fairer society. In both cases, the argument goes, the “alternative” past reveals more about the politics of the writer than about the period under discussion. A related objection concerns scale. Change one event, and the consequences multiply so rapidly that after a few years the historian is no longer analysing but inventing." },
          { label: "E", text: "Supporters have responded by proposing rules. The best known is that only those alternatives which people at the time actually considered should be admitted. If ministers debated two policies and narrowly chose one, the historian is entitled to ask what the other would have produced, because documents exist showing what its supporters expected. By contrast, scenarios that no contemporary could have imagined — a medieval king equipped with modern medicine, say — are ruled out as fantasy. A second rule limits the time span: the closer the imagined consequence lies to the altered event, the more confidence it deserves. Provided that these limits are respected, the argument runs, counterfactual reasoning is no less disciplined than any other kind of historical inference." },
          { label: "F", text: "There is, moreover, a moral argument, which is seldom stated but arguably matters most. A history in which everything had to happen as it did leaves no room for responsibility. If a disastrous decision was the inevitable product of vast economic forces, those who took it can hardly be blamed, and nor can those who failed to prevent it. Only by showing that a different choice was genuinely available can the historian hold individuals to account. Counterfactuals, on this view, are not an escape from the past but a way of restoring to it the uncertainty that people living through it actually felt." },
          { label: "G", text: "Psychology offers an unexpected footnote. Experiments suggest that the human mind produces “what ifs” automatically, and most readily after near misses. One much-quoted study of Olympic athletes found that those who won bronze medals appeared happier than those who won silver: the silver medallists were tormented by how close they had come to gold, whereas the bronze medallists were relieved to have won anything at all. If historians are subject to the same habit — and there is no reason to suppose they are not — then they will overestimate the importance of narrow outcomes, such as close elections, and neglect slow developments that never seemed to hang in the balance." },
          { label: "H", text: "Where does this leave the method? Few scholars today would defend the old view that counterfactuals have no place in serious history; equally, few would claim that they can settle arguments on their own. Their value is perhaps best described as diagnostic. A counterfactual forces a historian to say exactly which causes mattered and how much, and exposes those claims to challenge. It is a tool for testing explanations rather than a substitute for them — and, like any tool, it is only as good as the hand that uses it." },
        ],
      },
      { t: "p", text: "**Questions 27–34.** Reading Passage 3 has eight paragraphs, **A–H**. Which paragraph contains the following information? Write the correct letter, **A–H**. **NB** You may use any letter more than once." },
      {
        t: "quiz",
        id: "t4d19-doc-noi",
        kind: "fill",
        title: "Questions 27–34 — Matching information (gõ một chữ cái A–H)",
        items: [
          { q: "27. a description of how people's feelings about a result depend on what almost happened", answers: ["G"] },
          { q: "28. the claim that ordinary explanations of causes already contain unstated suppositions", answers: ["B"] },
          { q: "29. an example of an imagined situation that would not be considered acceptable", answers: ["E"] },
          { q: "30. a dismissive comparison once made by a member of the profession", answers: ["A"] },
          { q: "31. the suggestion that imagined pasts reflect the beliefs of the people who write them", answers: ["D"] },
          { q: "32. an explanation of why the method is linked to judging people's actions", answers: ["F"] },
          { q: "33. a mention of weaknesses in a piece of research that nevertheless proved influential", answers: ["C"] },
          { q: "34. a warning that one particular type of event may be given too much weight", answers: ["G"] },
        ],
      },
      { t: "p", text: "**Questions 35–40.** Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer." },
      { t: "p", text: "**Testing and limiting the “what if”** — In the 1960s an economist examined the common **35** ______ that American growth had depended on the railways. He built a **36** ______ of an economy which moved its goods by water and by road, and calculated that the country's **37** ______ would have been only slightly smaller. Although his **38** ______ regarding canals were questioned, others were able to check his work. Critics of the method point out that many writers simply describe the results they would have **39** ______. In reply, supporters accept only alternatives that were discussed at the time, since there are **40** ______ recording what was expected of them." },
      {
        t: "quiz",
        id: "t4d19-doc-tom-tat",
        kind: "fill",
        title: "Questions 35–40 — Summary completion. ONE WORD ONLY",
        items: [
          { q: "35. the common ___ that American growth had depended on the railways", answers: ["belief"] },
          { q: "36. He built a ___ of an economy…", answers: ["model"] },
          { q: "37. the country's ___ would have been only slightly smaller", answers: ["output"] },
          { q: "38. his ___ regarding canals were questioned", answers: ["assumptions"] },
          { q: "39. the results they would have ___", answers: ["preferred"] },
          { q: "40. there are ___ recording what was expected of them", answers: ["documents"] },
        ],
      },
      {
        t: "note",
        title: "📊 Chấm điểm (ước tính)",
        items: [
          "**12–14 đúng**: mức band 7.5+ cho Passage 3. **10–11**: band 7 — đạt mục tiêu của tập. **8–9**: band 6–6.5 — đọc kỹ bảng giải thích, xem mình sai vì khớp từ hay vì khớp nửa câu.",
          "**≤ 7**: làm lại bước 2 (ghi vai trò đoạn) với bài này, rồi ôn Tập 3 Ngày 19 mục 2–3.",
          "Quá 20 phút? Ghi lại số phút. Mục tiêu cuối tập: 8 câu Matching information trong 10 phút.",
        ],
      },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Câu chứng cứ trong bài", "Kiểu paraphrase / bẫy"],
        rows: [
          ["27", "G", "silver medallists were tormented by how close they had come to gold, whereas the bronze medallists were relieved", "feelings about a result = tormented / relieved · what almost happened = how close they had come. Không có từ nào trùng."],
          ["28", "B", "Every causal statement… carries a hidden “what if” inside it", "ordinary explanations of causes = causal statement · unstated suppositions = hidden “what if” / implicitly. Bẫy: A cũng có “what if?” nhưng là lời chê."],
          ["29", "E", "a medieval king equipped with modern medicine, say — are ruled out as fantasy", "an example = “say” · not acceptable = ruled out. Bẫy: D có ví dụ (conservative / radical author) nhưng đó là ví dụ về **người viết**, không phải về tình huống bị loại."],
          ["30", "A", "One influential British historian dismissed such speculation as a “parlour game”, an after-dinner amusement", "a dismissive comparison = dismissed… as a “parlour game” · a member of the profession = one… historian. Bẫy: H nhắc “the old view” nhưng không có phép so sánh nào."],
          ["31", "D", "the “alternative” past reveals more about the politics of the writer than about the period", "reflect the beliefs = reveals… the politics · “the argument goes” báo đây là ý của giới phê bình (suggestion)."],
          ["32", "F", "Only by showing that a different choice was genuinely available can the historian hold individuals to account", "judging people's actions = hold individuals to account / be blamed · linked = câu đảo ngữ Only by… can… nêu lý do."],
          ["33", "C", "The study was fiercely attacked — some of its assumptions… optimistic — yet it showed… It went on to reshape…", "Hai phần: weaknesses = assumptions… optimistic · nevertheless influential = yet… reshape the way economic history was written."],
          ["34", "G", "they will overestimate the importance of narrow outcomes, such as close elections", "a warning = If… then they will… · too much weight = overestimate the importance. G dùng **hai lần**; H không dùng."],
          ["35", "belief", "(C) to test the widely held belief that the railways had been indispensable", "common = widely held · depended on = indispensable to."],
          ["36", "model", "(C) he constructed a detailed model of an economy", "built = constructed · by water and by road = canal, river and wagon."],
          ["37", "output", "(C) national output in 1890 would have been only a few per cent lower", "the country's = national · slightly smaller = a few per cent lower."],
          ["38", "assumptions", "(C) some of its assumptions about canal-building were decidedly optimistic", "were questioned = fiercely attacked… optimistic. Phải số nhiều: sau chỗ trống là “were”."],
          ["39", "preferred", "(D) imagine the outcomes they would have preferred", "describe the results = imagine the outcomes."],
          ["40", "documents", "(E) because documents exist showing what its supporters expected", "there are = exist · recording = showing · discussed at the time = people at the time actually considered."],
        ],
      },

      { t: "h", text: "5. Soi lại bài đọc: câu giả định là biển báo “lập luận ở đây”" },
      { t: "p", text: "Bài đọc dùng đúng những cấu trúc bạn vừa học ở bài Ngữ pháp. Trong Passage 3, câu điều kiện hiếm khi chỉ để kể — nó mang **lập luận, điều kiện hoặc cảnh báo**, tức là chỗ người ra đề hay đặt câu hỏi. Điền từ lấy **từ bài đọc**." },
      {
        t: "quiz",
        id: "t4d19-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ bài đọc (6 câu)",
        items: [
          { q: "(A) ___ the question been confined to novelists, the matter might have rested there. [đảo ngữ thay if]", answers: ["Had"] },
          { q: "(B) …if the harvest had been good the rebellion would not have ___ out.", answers: ["broken"] },
          { q: "(C) …___ the railways, national output in 1890 would have been only a few per cent lower. [= if there had been no]", answers: ["without"] },
          { q: "(E) ___ that these limits are respected, the argument runs, counterfactual reasoning is no less disciplined…", answers: ["Provided"] },
          { q: "(F) ___ by showing that a different choice was genuinely available can the historian hold individuals to account. [đảo ngữ]", answers: ["Only"] },
          { q: "(G) If historians are subject to the same habit… then they ___ overestimate the importance of narrow outcomes.", answers: ["will"] },
        ],
      },
      {
        t: "note",
        title: "💡 Rút ra cho lần sau",
        items: [
          "**Had… might have…** (đoạn A) = giả định quá khứ ⇒ thường dẫn tới câu “Yet…” nêu thực tế — ý chính nằm sau Yet.",
          "**Provided that…** (đoạn E) = điều kiện ⇒ ứng viên cho câu hỏi “a condition under which…”.",
          "**If… will…** (đoạn G) = hệ quả có thật ⇒ ứng viên cho “a warning / a risk”.",
          "**the argument goes / runs · on this view** = tác giả đang thuật ý người khác — rất quan trọng cho Yes / No / Not Given (Tập 4 Ngày 9).",
        ],
      },

      { t: "h", text: "6. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "counterfactual", pos: "n, adj", ipa: "/ˌkaʊntəˈfæktʃuəl/", vi: "(điều) giả định trái với thực tế đã xảy ra", ex: "The report includes a counterfactual: what unemployment would have been without the scheme.", exVi: "Báo cáo có một giả định phản thực tế: tỉ lệ thất nghiệp sẽ là bao nhiêu nếu không có chương trình.", more: "**counterfactual** thinking / reasoning / history · a **counterfactual** scenario" },
          { w: "speculate", pos: "v", ipa: "/ˈspekjuleɪt/", vi: "suy đoán, phỏng đoán (khi thiếu chứng cứ)", ex: "It is pointless to speculate about what the minister meant.", exVi: "Suy đoán xem bộ trưởng có ý gì là vô ích.", more: "**speculate about / on** sth · speculation (n) · speculative (adj) · ⚠️ khác **estimate** (ước tính có cơ sở)" },
          { w: "dismiss", pos: "v", ipa: "/dɪsˈmɪs/", vi: "gạt bỏ, coi là không đáng bàn", ex: "Critics dismissed the proposal as unrealistic.", exVi: "Giới phê bình gạt bỏ đề xuất, cho là phi thực tế.", more: "**dismiss** sth **as** + adj / N · **dismiss** an idea / a claim / concerns · dismissive (adj)" },
          { w: "implicitly", pos: "adv", ipa: "/ɪmˈplɪsɪtli/", vi: "một cách ngầm ẩn, không nói thẳng", ex: "The article implicitly blames parents for the problem.", exVi: "Bài báo ngầm đổ lỗi cho cha mẹ về vấn đề này.", more: "implicit (adj) ≠ **explicit** · an **implicit** assumption / criticism" },
          { w: "indispensable", pos: "adj", ipa: "/ˌɪndɪˈspensəbl/", vi: "không thể thiếu", ex: "Reliable data are indispensable to good policy.", exVi: "Dữ liệu đáng tin cậy là thứ không thể thiếu cho chính sách tốt.", more: "**indispensable to / for** sth · = essential, vital · mạnh hơn important" },
          { w: "rigour", pos: "n", ipa: "/ˈrɪɡə/", vi: "sự chặt chẽ, nghiêm ngặt (trong nghiên cứu)", ex: "The study has been praised for its scientific rigour.", exVi: "Nghiên cứu được khen vì sự chặt chẽ khoa học.", more: "academic / intellectual **rigour** · rigorous (adj): **rigorous** testing · US: rigor" },
          { w: "inference", pos: "n", ipa: "/ˈɪnfərəns/", vi: "sự suy luận; điều suy ra", ex: "It is a reasonable inference that sales fell because prices rose.", exVi: "Suy ra rằng doanh số giảm vì giá tăng là hợp lý.", more: "**draw an inference from** sth · infer (v): **infer** sth **from** sth · ⚠️ infer (người đọc suy ra) ≠ imply (người viết ngụ ý)" },
          { w: "inevitable", pos: "adj", ipa: "/ɪnˈevɪtəbl/", vi: "không thể tránh khỏi", ex: "Some job losses are an inevitable consequence of automation.", exVi: "Mất một số việc làm là hệ quả tất yếu của tự động hoá.", more: "an **inevitable** consequence / result · inevitably (adv) · inevitability (n)" },
          { w: "hold sb to account", pos: "phr", ipa: "/həʊld tu əˈkaʊnt/", vi: "buộc ai chịu trách nhiệm", ex: "A free press helps to hold politicians to account.", exVi: "Báo chí tự do giúp buộc chính trị gia chịu trách nhiệm.", more: "= hold sb **accountable (for** sth) · accountability (n)" },
          { w: "hang in the balance", pos: "idiom", ipa: "/hæŋ ɪn ðə ˈbæləns/", vi: "chưa ngã ngũ, còn bấp bênh giữa hai kết cục", ex: "With one week to go, the result of the election still hangs in the balance.", exVi: "Còn một tuần, kết quả bầu cử vẫn chưa ngã ngũ.", more: "trung tính – dùng được trong báo chí và Speaking; trong Task 2 viết: remains uncertain" },
        ],
      },
    ],
  },

  /* ══════════════════════════════ BÀI 3 — NÓI ══════════════════════════════ */
  {
    id: "t4d19-noi",
    kind: "speaking",
    title: "Nói Part 3: Giả định & phản thực tế band 7 — “How would life be different if… had never…?”",
    goal: "Trả lời câu hỏi giả định của Part 3 (về hiện tại, về quá khứ và dạng hỗn hợp) trong 45–60 giây theo khung 5 bước, dùng đúng mixed conditional, would không cần if, could / might để chỉnh mức chắc chắn, và đọc would've / wouldn't have / I'd nhẹ, liền trong câu dài.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **GRA + FC band 7** của Speaking: “nhiều cấu trúc phức, thường không lỗi” và “nói dài không gắng sức”.",
          "Giám khảo dùng câu hỏi giả định để **đẩy bạn lên trần**: trả lời bằng thì hiện tại (If no internet, life is difficult) là tự khoá mình ở band 5–6.",
          "Nhận ra **thời gian của câu hỏi** trước khi mở miệng: would happen (hiện tại) · would have happened (quá khứ) · would be… now if… had… (hỗn hợp).",
          "Khung 5 bước: ==vào giả định → hệ quả chính → chuỗi hệ quả → mặt ngược lại → chốt về thực tế==.",
          "Sau câu đầu, **không cần lặp if**: “We'd still be…”, “That would've meant…”, “Otherwise…”.",
          "🔊 would've = /wʊdəv/ — một nhịp nhẹ, không phải “would have” hai từ rõ, càng không phải “would of”.",
        ],
      },
      { t: "h", text: "1. Ôn Tập 3 Ngày 15 — và năm kiểu câu hỏi giả định ở band 7" },
      { t: "p", text: "Tập 3 Ngày 15 dạy khung 4 bước cho “What would happen if…?” (giả định về hiện tại). Hôm nay thêm hai kiểu khó hơn: **quá khứ** và **hỗn hợp**. Nghe kỹ động từ của giám khảo — họ đã cho sẵn thì bạn cần dùng." },
      {
        t: "table",
        head: ["Kiểu câu hỏi", "Ví dụ", "Thì bạn dùng"],
        rows: [
          ["Hiện tại / tương lai không thật", "What **would happen** if everyone worked from home?", "If + V2, … **would + V**"],
          ["Quá khứ không thật", "What **would have happened** if your city hadn't built a metro?", "If + had V3, … **would have + V3**"],
          ["Hỗn hợp (quá khứ → nay)", "How **would** life **be** different **today** if the internet **had never been invented**?", "If + had V3, … **would (still) + V / be V-ing**"],
          ["Về bản thân", "If you **could change** one thing about your education, what **would** it **be**?", "I'd… / I **would have** + V3 · If I **were**…, I'd have…"],
          ["Điều kiện thật", "**Under what circumstances** should children be allowed to use phones at school?", "**as long as / provided that** + hiện tại đơn"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi làm tụt GRA nhiều nhất ở câu hỏi này",
        items: [
          "~~If no internet, life is very difficult.~~ — thiếu động từ và sai thì. Tối thiểu: **Without the internet, life would be** much harder.",
          "~~If the internet wasn't invented, we will…~~ — câu hỏi về quá khứ ⇒ **hadn't been invented**; hậu quả ⇒ **would**.",
          "Mở đầu đúng rồi **trượt về will / can** ở câu thứ hai: “…and people **can't** work online” → **couldn't / wouldn't be able to**. Giữ would / could / might cho **cả câu trả lời**.",
          "Không hiểu câu hỏi giả định? Xin nhắc lại là bình thường: “Sorry, do you mean if it had never existed at all?” (ôn Tập 2 Ngày 13).",
        ],
      },

      { t: "h", text: "2. Khung 5 bước cho một câu trả lời giả định (45–60 giây)" },
      {
        t: "sodo",
        kind: "flow",
        title: "Từ câu hỏi “What if…?” tới câu trả lời band 7",
        steps: [
          { label: "1. Vào giả định (3–5 giây)", sub: "It's quite hard to picture, actually… / I suppose…" },
          { label: "2. Hệ quả chính", sub: "the most obvious difference is that… we'd still be…" },
          { label: "3. Chuỗi hệ quả", sub: "and that would have a knock-on effect on… / which would mean…" },
          { label: "4. Mặt ngược lại / giới hạn", sub: "Mind you, it might not be all bad… / as long as…" },
          { label: "5. Chốt về thực tế", sub: "So on balance I'm glad… / which is probably why…" },
        ],
      },
      {
        t: "table",
        head: ["Bước", "Cụm dùng được ngay", "Ghi chú"],
        rows: [
          ["1. Vào giả định", "It's quite hard to picture, actually, because… · That's a tricky one. · I've never really thought about it, but I suppose… · Well, if that were the case, …", "Mua thời gian **bằng tiếng Anh thật**, không “ờ… ờ…”. Một cụm là đủ."],
          ["2. Hệ quả chính", "The most obvious difference would be that… · We'd probably still be + V-ing · I imagine people would… · For a start, there wouldn't be any…", "Chọn **một** hệ quả lớn, nói rõ; đừng liệt kê năm thứ."],
          ["3. Chuỗi hệ quả", "…and that would have a knock-on effect on… · …which in turn would mean (that)… · So we'd end up + V-ing · As a result, I'd almost certainly be…", "Đây là chỗ ăn điểm “mở rộng ý”: hệ quả của hệ quả (nối Tập 4 Ngày 15)."],
          ["4. Mặt ngược lại", "Mind you, it might not be all bad. · Then again, … · Having said that, people might well… · …as long as… · I doubt we'd…", "Đổi sang **might / could** ⇒ cho thấy bạn điều khiển được mức chắc chắn."],
          ["5. Chốt", "So on balance, I'm glad it happened. · …which is probably why… · So in a way we're lucky that… · So, all in all, I think we'd be worse off.", "Một câu, quay về **thực tế** (thì hiện tại) ⇒ kết dứt khoát."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo tìm ý trong 3 giây",
        items: [
          "Hỏi **ai bị ảnh hưởng** (cá nhân → gia đình → doanh nghiệp → nhà nước) và **mảng nào** (việc làm · thông tin · quan hệ · môi trường) — bảng trục chia nhóm của Tập 3 Ngày 6.",
          "Kéo về **chính mình**: “my own field, software, wouldn't exist” — ví dụ cá nhân làm câu trả lời thật và dễ nói hơn.",
          "Không cần đúng lịch sử. Giám khảo chấm ngôn ngữ, không chấm kiến thức: “I'm no expert, but I imagine…” là đủ an toàn.",
        ],
      },
      { t: "rule", formula: "vào giả định → we'd still be + V-ing → which would mean… → Mind you, … might… → So on balance…", vi: "Năm bước, 45–60 giây. Giữ would / could / might suốt câu trả lời; chỉ câu chốt mới về thì hiện tại." },

      { t: "h", text: "3. Ngữ pháp khi nói: mixed conditional + would không cần if" },
      { t: "p", text: "Người bản ngữ nói **một** câu if để dựng giả định, rồi các câu sau chỉ cần **would / wouldn't / would've** — người nghe tự hiểu vẫn đang ở trong giả định. Lặp “If… If… If…” nghe như đọc bài tập. Ngoài ra có bốn cách dựng giả định **không cần if**." },
      {
        t: "patterns",
        rows: [
          {
            formula: "If + S + hadn't + V3, S + 'd still be + V-ing / wouldn't + V",
            vi: "Hỗn hợp kiểu 1 khi nói — dạng viết tắt là bình thường.",
            examples: [
              { en: "If smartphones hadn't come along, we'd still be carrying cameras and maps around.", vi: "Nếu điện thoại thông minh không xuất hiện thì ta vẫn đang mang máy ảnh và bản đồ theo người." },
              { en: "If my parents hadn't pushed me, I wouldn't be at university now.", vi: "Nếu bố mẹ không thúc thì giờ tôi đã không học đại học." },
            ],
          },
          {
            formula: "Without + N, S + would (have) + V(3)  ·  Otherwise, S + would (have) + V(3)",
            vi: "Dựng giả định bằng without / otherwise — gọn hơn if.",
            examples: [
              { en: "Without that scholarship, I wouldn't have been able to study abroad.", vi: "Không có học bổng đó thì tôi đã không thể du học." },
              { en: "Luckily my teacher noticed; otherwise I'd have failed the course.", vi: "May mà thầy tôi để ý; không thì tôi đã trượt môn." },
            ],
          },
          {
            formula: "Suppose / Imagine + S + V2 / had V3 — S + would…",
            vi: "Mời người nghe cùng tưởng tượng.",
            examples: [
              { en: "Imagine nobody had invented the washing machine — housework would still take up most of the day.", vi: "Thử tưởng tượng không ai phát minh ra máy giặt — việc nhà vẫn sẽ chiếm gần hết ngày." },
            ],
          },
          {
            formula: "S + would've + V3 (không có vế if — giả định nằm ở câu trước)",
            vi: "Câu thứ hai, thứ ba trong chuỗi giả định.",
            examples: [
              { en: "A gap year would've done me good. I'd have learnt to manage money, and I might've chosen a different degree.", vi: "Một năm nghỉ trước đại học hẳn đã tốt cho tôi. Tôi đã học được cách quản lý tiền, và có lẽ đã chọn ngành khác." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Sai khi nói nhanh",
        items: [
          "**I'd** có hai nghĩa: I'd **go** = I would go · I'd **gone** = I had gone. “If I**'d** known, I**'d** have told you” = If I **had** known, I **would** have told you.",
          "~~If I would've known~~ — vẫn sai dù nghe quen tai. → If I**'d** known.",
          "~~I would of gone~~ — “of” chỉ là cách nghe của /əv/. Viết và hiểu là **would have**.",
          "Đừng trang trọng quá khi nói: “Had it not been for…”, “Were I to…” nghe như đọc văn. Dùng **If it hadn't been for…**, **Without…**.",
        ],
      },
      { t: "rule", formula: "If + S + hadn't + V3, S + 'd still be + V-ing.  →  S + would've + V3.  →  Otherwise, S + 'd + V.", vi: "Một câu if dựng cảnh; các câu sau chỉ cần would / would've / otherwise." },
      {
        t: "quiz",
        id: "t4d19-noi-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh như đang nói — dùng dạng viết tắt (5 câu)",
        grammar: "If + S + hadn't + V3, S + 'd still be V-ing · Without + N, S + would(n't) (have) + V(3) · otherwise",
        items: [
          { q: "Nếu ô tô không được phát minh thì các thành phố bây giờ sẽ nhỏ hơn nhiều.", answers: ["If cars hadn't been invented, cities would be much smaller now.", "If cars had not been invented, cities would be much smaller now.", "If the car hadn't been invented, cities would be much smaller now.", "If cars hadn't been invented, cities would be a lot smaller now."], hint: "be invented · cities · much smaller · now" },
          { q: "Không có cô giáo đó thì tôi đã bỏ học tiếng Anh.", answers: ["Without that teacher, I would've given up English.", "Without that teacher, I would have given up English.", "Without that teacher, I'd have given up English."], hint: "Without · give up English" },
          { q: "Nếu tôi không chuyển tới đây thì giờ tôi vẫn đang sống với bố mẹ.", answers: ["If I hadn't moved here, I'd still be living with my parents.", "If I had not moved here, I would still be living with my parents.", "If I hadn't moved here, I would still be living with my parents."], hint: "move here · still be living with" },
          { q: "May là tôi đã kiểm tra lại; không thì tôi đã gửi nhầm tệp.", answers: ["Luckily I checked again; otherwise I'd have sent the wrong file.", "Luckily I checked again; otherwise I would have sent the wrong file.", "Luckily, I checked again; otherwise, I would have sent the wrong file.", "Luckily I checked again, otherwise I'd have sent the wrong file."], hint: "Luckily · check again · otherwise · send the wrong file" },
          { q: "Nếu tôi là người kiên nhẫn hơn thì tôi đã học xong khoá đó.", answers: ["If I were more patient, I would've finished that course.", "If I were more patient, I would have finished that course.", "If I was more patient, I would have finished that course.", "If I were more patient, I'd have finished that course."], hint: "hỗn hợp kiểu 2: were more patient · finish that course" },
        ],
      },

      { t: "h", text: "4. Nghe và so: band 6 và band 7 cho cùng một câu hỏi" },
      { t: "p", text: "Câu hỏi: **How would life be different today if the internet had never been invented?** Bấm nghe từng câu trả lời. Lần đầu chỉ nghe; lần hai nhìn chữ và đánh dấu: câu nào dùng would / could / might, câu nào trượt về thì hiện tại. (Band ghi là **ước tính**.)" },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — khoảng 25 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "How would life be different today if the internet had never been invented?", vi: "Cuộc sống ngày nay sẽ khác thế nào nếu internet chưa từng được phát minh?" },
          { who: "Candidate", role: "candidate", text: "I think if there is no internet, life is very difficult. People cannot find information quickly, and they must go to the library. Also we cannot contact friends in other countries, only by letter, and it takes a long time. And I couldn't study online. So I think life will be very different and less convenient without the internet.", vi: "Tôi nghĩ nếu không có internet thì cuộc sống rất khó. Người ta không tìm thông tin nhanh được và phải tới thư viện. Ta cũng không liên lạc được với bạn ở nước khác, chỉ bằng thư, mất nhiều thời gian. Và tôi không học trực tuyến được. Nên tôi nghĩ cuộc sống sẽ rất khác và kém tiện hơn nếu không có internet." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 7 (ước tính) — khoảng 55 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "How would life be different today if the internet had never been invented?", vi: "Cuộc sống ngày nay sẽ khác thế nào nếu internet chưa từng được phát minh?" },
          { who: "Candidate", role: "candidate", text: "Hmm, it's quite hard to picture, actually, because I've never known a world without it.", vi: "Ừm, thật ra khá khó hình dung, vì tôi chưa từng biết một thế giới không có nó." },
          { who: "Candidate", role: "candidate", text: "I suppose the most obvious difference is that information would still be controlled by a fairly small number of sources — if the internet had never been invented, we'd probably still be relying on newspapers and whatever the local library happened to have.", vi: "Tôi cho rằng khác biệt rõ nhất là thông tin vẫn do một số ít nguồn nắm — nếu internet chưa từng ra đời, có lẽ ta vẫn đang dựa vào báo giấy và bất cứ thứ gì thư viện gần nhà tình cờ có." },
          { who: "Candidate", role: "candidate", text: "And that would have a knock-on effect on work. My own field, software, wouldn't exist in anything like its present form, so I'd almost certainly be doing a completely different job.", vi: "Và điều đó sẽ kéo theo ảnh hưởng tới việc làm. Ngành của chính tôi, phần mềm, sẽ không tồn tại ở dạng nào giống hiện nay, nên gần như chắc chắn tôi đang làm một nghề hoàn toàn khác." },
          { who: "Candidate", role: "candidate", text: "Mind you, it might not be all bad. People would probably have longer attention spans, and I doubt we'd be as anxious about what strangers think of us.", vi: "Nhưng mà, chưa chắc đã toàn điều xấu. Có lẽ người ta sẽ tập trung được lâu hơn, và tôi ngờ rằng ta sẽ không lo lắng nhiều như bây giờ về chuyện người lạ nghĩ gì về mình." },
          { who: "Candidate", role: "candidate", text: "So on balance I'm glad it happened, but I wouldn't say the alternative would be a disaster.", vi: "Nên cân nhắc lại thì tôi mừng là nó đã ra đời, nhưng tôi không cho rằng kịch bản kia sẽ là thảm hoạ." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6 (ước tính)", "Band 7 (ước tính)"],
        rows: [
          ["FC — trôi chảy, mạch lạc", "Bốn ý rời nối bằng Also / And / So; không ý nào được mở rộng; 25 giây là hết.", "Một ý chính → hệ quả của nó → mặt ngược lại → chốt. Từ dẫn tự nhiên: I suppose · And that would… · Mind you · So on balance."],
          ["LR — từ vựng", "find information, contact friends, convenient — đúng nhưng rất quen.", "hard to picture · a knock-on effect · in anything like its present form · attention spans · on balance."],
          ["GRA — ngữ pháp", "Câu hỏi là hỗn hợp nhưng trả lời bằng **is / cannot / must / will**; chỉ một chỗ đúng (couldn't).", "Mixed conditional đúng (had never been invented → we'd still be relying); giữ would / wouldn't / might suốt bài; mệnh đề whatever…; I doubt we'd…"],
          ["P — phát âm", "Từng từ rõ nhưng đều đều; “cannot”, “will” nhấn nặng.", "we'd /wiːd/, I'd /aɪd/ nhẹ; nhấn **still**, **different**, **all** bad; ngắt sau Mind you."],
        ],
      },
      {
        t: "mcq",
        id: "t4d19-noi-chon",
        title: "Kiểm tra — trả lời câu hỏi giả định (6 câu)",
        items: [
          { q: "Examiner: “What would have happened to your home town if the factory hadn't opened?” — Câu mở nào đúng thì?", options: ["If the factory doesn't open, many people leave.", "I think most young people would have left to find work elsewhere.", "Most young people will leave the town.", "If the factory wouldn't have opened, people left."], correct: 1, why: "Câu hỏi về quá khứ không thật ⇒ would have + V3. Không cần lặp vế if." },
          { q: "Câu nào là bước 3 (chuỗi hệ quả)?", options: ["That's a tricky one.", "So on balance I'm glad it happened.", "…which in turn would mean fewer jobs for local people.", "Mind you, it might not be all bad."], correct: 2, why: "which in turn would mean… = hệ quả của hệ quả." },
          { q: "“If I'd had better teachers, I'd be more confident now.” — Hai chữ 'd lần lượt là:", options: ["would · would", "had · had", "would · had", "had · would"], correct: 3, why: "If I'd had = If I had had (quá khứ hoàn thành) · I'd be = I would be." },
          { q: "Cách nào tự nhiên nhất khi NÓI?", options: ["If it hadn't been for my uncle, I'd never have got into programming.", "Had it not been for my uncle, never would I have got into programming.", "Were it not for my uncle, I would not have entered programming.", "But for my uncle I had not got into programming."], correct: 0, why: "If it hadn't been for… là dạng nói tự nhiên. B và C quá trang trọng; D sai thì." },
          { q: "Sau câu “If cars had never been invented, cities would be far more compact.”, câu tiếp theo nào giữ đúng giả định?", options: ["People can walk to work.", "People will walk to work every day.", "Most of us would be able to walk to work.", "People walked to work."], correct: 2, why: "Vẫn ở trong giả định ⇒ would be able to. can / will kéo câu về hiện thực." },
          { q: "“Under what circumstances should employees be allowed to work from home?” — Câu trả lời hợp nhất:", options: ["I'd say as long as they can be reached during office hours, it shouldn't be a problem.", "If they had worked from home, it would have been fine.", "Supposing they worked at home, they will be lazy.", "Unless they are allowed, it is fine."], correct: 0, why: "Câu hỏi về điều kiện thật ⇒ as long as + hiện tại đơn." },
        ],
      },

      { t: "h", text: "5. Kho ý cho bốn chủ đề giả định hay gặp" },
      {
        t: "table",
        head: ["Câu hỏi", "Hệ quả chính", "Chuỗi + mặt ngược lại"],
        rows: [
          ["How would cities be different now if cars had never been invented?", "Cities **would be** far more compact; most of us **would live** within walking distance of work.", "…which **would mean** cleaner air and quieter streets. Then again, the countryside **might be** much more isolated."],
          ["What would have happened if schools had stayed closed for another year during the pandemic?", "Many children **would have fallen** even further behind, especially those without a laptop at home.", "…and that gap **would still be showing** in exam results now. Mind you, online teaching **might have improved** faster."],
          ["If you could go back, would you choose a different subject to study?", "I **wouldn't** change the subject, but I**'d have started** learning English much earlier.", "If I**'d done** that, I **wouldn't be** cramming for this test now. Otherwise, no real regrets."],
          ["What would happen if governments stopped funding the arts?", "A lot of small theatres and galleries **would** simply **close**.", "…so the arts **would end up** as something only the rich **could** enjoy — unless private sponsors stepped in."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "I'm no historian, but I imagine the country would have developed much more slowly.", vi: "Tôi không phải nhà sử học, nhưng tôi hình dung đất nước sẽ phát triển chậm hơn nhiều." },
          { en: "It's hard to say, but I suspect we'd have found some other way of doing it.", vi: "Khó nói, nhưng tôi ngờ rằng ta sẽ tìm ra cách khác để làm việc đó." },
          { en: "In that case, I don't think I'd be sitting here talking to you in English.", vi: "Trong trường hợp đó, tôi không nghĩ mình đang ngồi đây nói tiếng Anh với bạn." },
        ],
      },

      { t: "h", text: "6. Phát âm: would've trong câu dài — nhẹ, liền, không rơi mất" },
      { t: "p", text: "Tập 3 Ngày 15 đã dạy would've /wʊdəv/ ở câu ngắn. Trong **câu dài**, người Việt hay mắc hai lỗi ngược nhau: (1) đọc rõ **would – have** hai nhịp nặng, làm gãy nhịp câu; (2) nuốt mất hẳn /əv/, thành “I would go” — sai nghĩa (hiện tại thay vì quá khứ). Cách đúng: /əv/ là **một nhịp rất nhẹ dính vào would**, còn trọng âm rơi vào **động từ chính và từ mang nghĩa** phía sau." },
      {
        t: "table",
        head: ["Viết", "Đọc nhanh", "Ví dụ — từ in đậm là chỗ nhấn"],
        rows: [
          ["would have", "/wʊdəv/", "I would've **told** you."],
          ["wouldn't have", "/wʊdnt əv/", "It wouldn't have made much **difference**."],
          ["I'd have / we'd have", "/aɪdəv/ · /wiːdəv/", "I'd have **failed** the course."],
          ["could have / might have", "/kʊdəv/ · /maɪtəv/", "They could've **built** it somewhere **else**."],
          ["would have been", "/wʊdəv bɪn/", "It would've been a **disaster**."],
          ["If I'd known (had)", "/ɪf aɪd nəʊn/", "If I'd **known**, I would've **applied**."],
        ],
      },
      {
        t: "note",
        title: "💡 Cách luyện",
        items: [
          "Đọc ngược từ cuối câu: **applied** → would've applied → I would've applied → If I'd known about it, I would've applied.",
          "Gõ nhịp chỉ ở từ nhấn: If I'd **KNOWN** about it, I would've ap**PLIED** — hai nhịp gõ cho cả câu.",
          "Giữ âm /d/ trước /əv/: /wʊ-dəv/. Rụng /d/ thành “wou've” thì máy và giám khảo đều không nhận ra.",
        ],
      },
      { t: "rule", formula: "would've = /wʊdəv/ · wouldn't have = /wʊdnt əv/ · I'd have = /aɪdəv/ — nhấn động từ chính, không nhấn have", vi: "/əv/ nhẹ nhưng phải có: mất nó là mất nghĩa quá khứ." },
      {
        t: "phatam",
        id: "t4d19-phat-am",
        title: "Luyện phát âm — would've / wouldn't have / I'd trong câu dài",
        note: "Câu 1–3: câu ngắn để bắt nhịp. Câu 4–8: câu dài — đọc liền một hơi, chỉ ngắt ở dấu phẩy. Máy chấm từng từ: would've điểm thấp thường do bạn tách thành hai từ nặng hoặc rụng âm /d/.",
        items: [
          { text: "We'd still be queuing at the bank.", ipa: "wiːd stɪl bi kjuːɪŋ ət ðə bæŋk", vi: "Chúng ta vẫn sẽ đang xếp hàng ở ngân hàng." },
          { text: "That might've changed everything.", ipa: "ðæt maɪtəv tʃeɪndʒd evriθɪŋ", vi: "Điều đó có lẽ đã thay đổi mọi thứ." },
          { text: "It wouldn't have made much difference.", ipa: "ɪt wʊdnt əv meɪd mʌtʃ dɪfrəns", vi: "Việc đó hẳn đã không tạo ra khác biệt mấy." },
          { text: "If I'd known about it, I would've applied.", ipa: "ɪf aɪd nəʊn əbaʊt ɪt aɪ wʊdəv əplaɪd", vi: "Nếu tôi biết chuyện đó thì tôi đã nộp đơn." },
          { text: "They could've built it somewhere else.", ipa: "ðeɪ kʊdəv bɪlt ɪt sʌmweər els", vi: "Họ đã có thể xây nó ở chỗ khác." },
          { text: "If I weren't so shy, I would've joined the debating club.", ipa: "ɪf aɪ wɜːnt səʊ ʃaɪ aɪ wʊdəv dʒɔɪnd ðə dɪbeɪtɪŋ klʌb", vi: "Nếu tôi không nhút nhát thế thì tôi đã tham gia câu lạc bộ tranh biện." },
          { text: "If the internet hadn't been invented, I'd be doing a different job.", ipa: "ɪf ði ɪntənet hædnt bɪn ɪnventɪd aɪd bi duːɪŋ ə dɪfrənt dʒɒb", vi: "Nếu internet không được phát minh thì tôi đang làm một nghề khác." },
          { text: "Without that scholarship, I wouldn't have been able to study abroad.", ipa: "wɪðaʊt ðæt skɒləʃɪp aɪ wʊdnt əv bɪn eɪbl tə stʌdi əbrɔːd", vi: "Không có học bổng đó thì tôi đã không thể du học." },
        ],
      },

      { t: "h", text: "7. Luyện nói Part 3 — ghi âm, AI chấm" },
      { t: "p", text: "Mỗi câu nói **45–60 giây**, đủ 5 bước. Trước khi bấm ghi, nói thầm thời gian của câu hỏi (hiện tại / quá khứ / hỗn hợp). Nghe lại và tự chấm: (1) có câu nào trượt về will / can / is không? (2) có ít nhất một chuỗi hệ quả không? (3) would've có nhẹ và liền không? Chép câu trả lời hay nhất vào **Sổ Speaking** (Tập 3 Ngày 2)." },
      {
        t: "speak",
        id: "t4d19-noi-p3",
        part: "3",
        questions: [
          "How would life be different today if the internet had never been invented?",
          "What would happen if all cars were banned from city centres?",
          "How would your life be different now if you had grown up in another country?",
          "What would have happened to your home town if tourism had never developed there?",
        ],
      },
      {
        t: "speak",
        id: "t4d19-noi-p3-2",
        part: "3",
        questions: [
          "If you could go back and change one thing about your education, what would it be?",
          "What would happen if governments stopped funding the arts?",
          "Do you think people would be happier if smartphones had never been invented?",
          "Under what circumstances should children be allowed to use phones at school?",
        ],
      },
      {
        t: "note",
        title: "📌 Tự soát sau khi ghi âm",
        items: [
          "Đếm số lần nói **if**: quá 2 lần trong một câu trả lời ⇒ thay bằng Without… / Otherwise… / câu would không if.",
          "AI chấm GRA thấp ở câu hỏi quá khứ? Gần như chắc bạn đã nói “would + V” thay cho “would have + V3”. Ghi âm lại riêng câu đó.",
          "Mục tiêu trước Ngày 23: cả 8 câu trên nói đủ 45 giây mà không dừng quá 2 giây.",
        ],
      },
    ],
  },

  /* ══════════════════════════════ BÀI TẬP NGÀY 19 ══════════════════════════════ */
  {
    id: "t4d19-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 19 — điều kiện hỗn hợp · từ thay if · Matching information · câu trả lời giả định · would've",
    goal: "Ôn trọn Ngày 19: chọn và viết đúng hai kiểu câu điều kiện hỗn hợp, dùng đúng provided that / as long as / otherwise / but for, làm 5 câu Matching information trên một bài ngắn, sắp đúng khung 5 bước và nhận ra would've khi nghe – nói.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Cách làm bài tập hôm nay",
        items: [
          "41 câu có đáp án + 2 câu nói. Làm một mạch khoảng 50 phút, **không mở lại bài học**.",
          "Mỗi phần ghi sẵn mục cần ôn nếu sai từ 2 câu trở lên.",
          "Câu sai chép vào **sổ lỗi** kèm lý do: sai thời gian vế nào? thêm will sau provided that? khớp từ thay vì khớp ý?",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 19 trên một trang",
        center: "Giả định đúng thời gian",
        branches: [
          { label: "Hỗn hợp kiểu 1", items: ["If + had V3", "would + V + now"] },
          { label: "Hỗn hợp kiểu 2", items: ["If + V2 / were", "would have + V3"] },
          { label: "Từ thay if", items: ["provided that · as long as", "otherwise · but for + N"] },
          { label: "Matching information", items: ["gọi tên loại thông tin", "khớp vai trò đoạn, đủ mọi phần"] },
          { label: "Part 3 giả định", items: ["5 bước", "would không cần if"] },
          { label: "🔊 would've", items: ["/wʊdəv/ nhẹ, liền", "nhấn động từ chính"] },
        ],
      },
      { t: "h", text: "I. Chọn phương án đúng (8 câu) — ôn Ngữ pháp mục 2–5" },
      {
        t: "mcq",
        id: "t4d19-bt-chon",
        title: "I. Chọn phương án đúng",
        items: [
          { q: "If the government ___ more nurses five years ago, hospitals would not be so short of staff today.", options: ["trained", "would train", "had trained", "has trained"], correct: 2, why: "“five years ago” = quá khứ không thật ⇒ had trained; vế chính “today” ⇒ would not be." },
          { q: "If I ___ a morning person, I would have gone to the 6 a.m. class with you yesterday.", options: ["were", "had been", "am", "would be"], correct: 0, why: "Tính chất lâu dài ở hiện tại ⇒ were; hậu quả hôm qua ⇒ would have gone. Kiểu 2." },
          { q: "If the bridge had been finished on time, we ___ it to cross the river now.", options: ["would have used", "will use", "used", "would be using"], correct: 3, why: "“now” ⇒ hậu quả hiện tại đang diễn ra ⇒ would be using." },
          { q: "Online courses are effective ___ learners receive regular feedback.", options: ["unless", "provided that", "in case", "otherwise"], correct: 1, why: "Điều kiện cần cho kết quả tốt ⇒ provided that." },
          { q: "___ the support of her colleagues, she would have resigned long ago.", options: ["But for", "Provided", "Unless", "As long as"], correct: 0, why: "But for + cụm danh từ = nếu không có." },
          { q: "The data were backed up every night; ___, three years of research would have been lost.", options: ["supposing", "provided", "otherwise", "unless"], correct: 2, why: "“nếu không thì” sau dấu chấm phẩy ⇒ otherwise." },
          { q: "If he had taken the earlier train, he ___ the opening speech — but we can't be sure.", options: ["would catch", "can have caught", "must catch", "might have caught"], correct: 3, why: "Giả định quá khứ + không chắc ⇒ might have caught." },
          { q: "Which sentence is correct?", options: ["If she would have studied law, she would be a judge now.", "If she had studied law, she would be a judge now.", "If she studied law at that time, she would be a judge now.", "If she had studied law, she will be a judge now."], correct: 1, why: "had studied (quá khứ không thật) → would be… now. A có would ở vế if; C dùng quá khứ đơn cho quá khứ; D dùng will." },
        ],
      },
      { t: "h", text: "II. Viết dạng đúng của động từ (8 câu) — ôn Ngữ pháp mục 2–4" },
      {
        t: "quiz",
        id: "t4d19-bt-dong-tu",
        kind: "fill",
        title: "II. Viết dạng đúng — chú ý mốc thời gian ở từng vế",
        items: [
          { q: "If the forest ___ (not / cut down) in the 1980s, the valley would not flood every year now.", answers: ["had not been cut down", "hadn't been cut down"] },
          { q: "If I ___ (speak) better English, I would have taken that job in Dublin last year.", answers: ["spoke"] },
          { q: "If she had not broken her leg, she ___ (compete) in the final right now.", answers: ["would be competing"] },
          { q: "If the city had a proper recycling system, last year's waste crisis ___ (not / happen).", answers: ["would not have happened", "wouldn't have happened"] },
          { q: "If the company had listened to its engineers, it ___ (still / be) in business today.", answers: ["would still be"] },
          { q: "If we ___ (not / be) so dependent on oil, the price rise in 2022 would not have hurt us so much.", answers: ["were not", "weren't"] },
          { q: "If the ambulance had arrived ten minutes earlier, the patient ___ (might / survive). [quá khứ]", answers: ["might have survived"] },
          { q: "If he had invested in property then, he ___ (could / retire) now.", answers: ["could retire"] },
        ],
      },
      { t: "h", text: "III. Từ thay if (6 câu) — ôn Ngữ pháp mục 5–6" },
      {
        t: "quiz",
        id: "t4d19-bt-thay-if",
        kind: "fill",
        title: "III. Điền MỘT từ: provided · long · otherwise · unless · supposing · Had",
        items: [
          { q: "The council will fund the festival ___ that the organisers keep ticket prices low.", answers: ["provided"] },
          { q: "As ___ as the data are kept anonymous, patients are usually happy to take part.", answers: ["long"] },
          { q: "___ the river is cleaned up soon, the fishing industry will disappear.", answers: ["Unless"] },
          { q: "She wore a helmet; ___, the accident could have been fatal.", answers: ["otherwise"] },
          { q: "___ you were given a year off with full pay, how would you spend it?", answers: ["Supposing"] },
          { q: "___ the canal not been built, the town would still be a village.", answers: ["Had"] },
        ],
      },
      { t: "h", text: "IV. Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d19-bt-dich",
        kind: "translate",
        title: "IV. Dịch — dùng cấu trúc cho trong ngoặc",
        grammar: "mixed conditional · provided that · but for · otherwise",
        items: [
          { q: "Nếu thành phố trồng nhiều cây hơn từ hai mươi năm trước thì mùa hè bây giờ đã mát hơn. (hỗn hợp kiểu 1)", answers: ["If the city had planted more trees twenty years ago, summers would be cooler now.", "If the city had planted more trees 20 years ago, summers would be cooler now.", "If the city had planted more trees twenty years ago, the summers would be cooler now."], hint: "plant more trees · twenty years ago · summers · cooler" },
          { q: "Nếu tôi là người có tổ chức hơn thì tôi đã không quên hạn nộp bài. (hỗn hợp kiểu 2)", answers: ["If I were more organised, I would not have forgotten the deadline.", "If I were more organised, I wouldn't have forgotten the deadline.", "If I were more organized, I would not have forgotten the deadline.", "If I were more organized, I wouldn't have forgotten the deadline."], hint: "be more organised · forget the deadline" },
          { q: "Xe tự lái sẽ được chấp nhận miễn là chúng an toàn hơn người lái. (provided that)", answers: ["Driverless cars will be accepted provided that they are safer than human drivers.", "Self-driving cars will be accepted provided that they are safer than human drivers.", "Driverless cars will be accepted provided they are safer than human drivers."], hint: "driverless cars · be accepted · safer than human drivers" },
          { q: "Nếu không có sự giúp đỡ của hàng xóm thì ngôi nhà đã cháy rụi. (but for)", answers: ["But for the neighbours' help, the house would have burnt down.", "But for the help of the neighbours, the house would have burnt down.", "But for the neighbours' help, the house would have burned down.", "But for the neighbors' help, the house would have burned down."], hint: "the neighbours' help · burn down" },
          { q: "Tôi đã ghi lại mọi thứ; nếu không thì giờ tôi chẳng nhớ gì. (otherwise)", answers: ["I wrote everything down; otherwise, I would not remember anything now.", "I wrote everything down; otherwise, I wouldn't remember anything now.", "I wrote everything down; otherwise I wouldn't remember anything now.", "I wrote everything down; otherwise I would not remember anything now."], hint: "write everything down · remember anything · now" },
        ],
      },
      { t: "h", text: "V. Đọc — Matching information (5 câu) — ôn bài Đọc mục 2–3" },
      { t: "p", text: "Đọc bài (4 đoạn A–D) và làm trong **6 phút**. Which paragraph contains the following information? **NB** You may use any letter more than once." },
      {
        t: "passage",
        title: "Imagining Failure in Advance",
        paras: [
          { label: "A", text: "Most organisations examine a project only after it has gone wrong. The meeting is known as a post-mortem, and by then little can be done except decide who is to blame. A psychologist who studied how experts make decisions proposed turning the exercise around and holding it before the work begins." },
          { label: "B", text: "In a “premortem”, the team gathers at the start and is told to imagine that a year has passed and the plan has failed completely. Each member then spends a few minutes writing down, privately, every reason they can think of for the disaster. The lists are read out one item at a time until nothing new remains." },
          { label: "C", text: "The technique works because it changes what people feel free to say. In an ordinary planning meeting, anyone who voices doubts risks seeming disloyal, so worries stay hidden. Once failure is treated as a fact to be explained, however, spotting problems becomes a sign of intelligence rather than of negativity. One early experiment reported that people who pictured an event as having already happened produced roughly a third more reasons for it than those who merely asked whether it might happen." },
          { label: "D", text: "The method is no cure for every weakness. It cannot reveal risks that nobody in the room knows about, and a team that lists forty dangers may lose the confidence it needs to begin at all. Its supporters therefore recommend that the session end with a short list of the three threats most worth preventing." },
        ],
      },
      {
        t: "quiz",
        id: "t4d19-bt-doc",
        kind: "fill",
        title: "V. Questions 1–5 — gõ một chữ cái A–D",
        items: [
          { q: "1. a figure showing the benefit of treating an outcome as certain", answers: ["C"] },
          { q: "2. an account of the stages that participants go through", answers: ["B"] },
          { q: "3. a possible harmful effect of using the technique", answers: ["D"] },
          { q: "4. a criticism of the usual timing of project reviews", answers: ["A"] },
          { q: "5. a reason why people normally keep their concerns to themselves", answers: ["C"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích phần V",
        items: [
          "**1 – C**: “roughly a third more reasons” = a figure; “pictured an event as having already happened” = treating an outcome as certain.",
          "**2 – B**: gathers → is told to imagine → writing down → read out = the stages.",
          "**3 – D**: “may lose the confidence it needs to begin” = harmful effect. Bẫy: “cannot reveal risks” là **giới hạn**, không phải tác hại.",
          "**4 – A**: “only after it has gone wrong… by then little can be done” = chê thời điểm thông thường.",
          "**5 – C**: “anyone who voices doubts risks seeming disloyal, so worries stay hidden”. C dùng **hai lần**.",
        ],
      },
      { t: "h", text: "VI. Khung nói giả định (5 câu) — ôn bài Nói mục 2–3" },
      {
        t: "quiz",
        id: "t4d19-bt-khung",
        kind: "fill",
        title: "VI. Điền MỘT từ vào mỗi chỗ trống",
        items: [
          { q: "It's quite hard to ___, actually, because I've never known a world without phones. [hình dung]", answers: ["picture", "imagine"] },
          { q: "…and that would have a ___-on effect on local shops. [kéo theo]", answers: ["knock"] },
          { q: "…which in ___ would mean higher prices for everyone.", answers: ["turn"] },
          { q: "___ you, it might not be all bad. [nhưng mà]", answers: ["Mind"] },
          { q: "So on ___, I'm glad it happened.", answers: ["balance"] },
        ],
      },
      { t: "h", text: "VII. would've trong câu dài (4 câu) — ôn bài Nói mục 6" },
      {
        t: "mcq",
        id: "t4d19-bt-phat-am",
        title: "VII. Chọn phương án đúng",
        items: [
          { q: "Bạn nghe: /ɪf aɪd nəʊn aɪ wʊdəv kʌm/. Câu đó viết là:", options: ["If I'd know, I would of come.", "If I'd known, I would've come.", "If I knew, I would come.", "If I'd known, I would come."], correct: 1, why: "/aɪd nəʊn/ = I'd known (had) · /wʊdəv kʌm/ = would've come (V3 của come là come)." },
          { q: "Trong câu “It wouldn't have made much difference”, từ nào được nhấn mạnh nhất?", options: ["have", "It", "wouldn't have (cả hai như nhau)", "difference"], correct: 3, why: "Trọng âm rơi vào từ mang nghĩa cuối cụm: difference (và nhẹ hơn ở made / much). have chỉ là /əv/." },
          { q: "“I'd have failed” đọc nhanh là:", options: ["/aɪdəv feɪld/", "/aɪ hæd hæv feɪld/", "/aɪd feɪld/", "/aɪ wʊd ɒv feɪld/"], correct: 0, why: "I'd have = /aɪdəv/. Bỏ mất /əv/ thành /aɪd feɪld/ = I had failed — nghĩa khác hẳn." },
          { q: "Nói “I would go to the meeting” thay cho “I would've gone to the meeting” thì sai ở đâu?", options: ["Không sai, hai câu như nhau", "Sai phát âm nhưng đúng nghĩa", "Đổi nghĩa: từ giả định quá khứ thành giả định hiện tại / tương lai", "Chỉ sai chính tả"], correct: 2, why: "would go = giả định hiện tại / tương lai; would've gone = giả định quá khứ. Rụng /əv/ + sai V3 là đổi thời gian." },
        ],
      },
      { t: "h", text: "VIII. Nói 2 câu Part 3 giả định — ghi âm, AI chấm" },
      { t: "p", text: "Mỗi câu 45–60 giây, đủ 5 bước. Câu 1 là giả định **hỗn hợp** (quá khứ → nay); câu 2 là giả định về **hiện tại**. Nghe lại: có câu nào trượt về will / can không?" },
      {
        t: "speak",
        id: "t4d19-bt-noi",
        part: "3",
        questions: [
          "How would the world be different today if aeroplanes had never been invented?",
          "What would happen if university education were free for everyone?",
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài tập",
        items: [
          "Đúng ≥ 33/41 (80 %): sẵn sàng sang Ngày 20. Dưới 29/41: ôn lại phần sai nhiều nhất trước.",
          "Sai phần I–II ⇒ Ngữ pháp mục 2–4 · phần III ⇒ mục 5–6 · phần V ⇒ bài Đọc mục 2–3 · phần VI–VII ⇒ bài Nói mục 2 và 6.",
          "Chép 3 câu hỗn hợp **về chính bạn** vào Sổ Speaking — bạn sẽ dùng lại ở Ngày 23 (Part 3 trừu tượng).",
        ],
      },
    ],
  },
];
