/**
 * IELTS Tập 4 — Ngày 3 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, câu trả lời mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)  Thì trong văn học thuật: hiện tại hoàn thành cho xu hướng · tường thuật nghiên cứu ·
 *                    quá khứ hoàn thành trong tường thuật (By 2000, … had doubled) · chuyển thì trong một đoạn   [ôn G12 G22]
 *                    — nối Tập 2 Ngày 5 (HTHT vs quá khứ đơn), Tập 3 Ngày 1 (hệ 12 thì, had V3) · Ngày 19 (reported speech)
 *   Bài 2 (reading)  Matching headings 3 — tiêu đề nói bằng ý ẩn; bài đọc ~870 từ (lịch sử khái niệm nostalgia), 13 câu [R12 R18]
 *                    — nối Tập 2 Ngày 12 (headings nhập), Tập 3 Ngày 5 (ý chính vs chi tiết), Tập 3 Ngày 1 (paraphrase 4 mức)
 *   Bài 3 (speaking) Part 3 band 7: quá khứ – hiện tại – tương lai; discourse markers linh hoạt; so sánh hai nhóm cùng thời
 *                    ở band 7 [S06 S09] — nối Tập 2 Ngày 21 (xưa – nay, hai nhóm cùng thời) · 🔊 /ɜː/ /ə/
 *   Bài tập Ngày 3   42 câu có đáp án
 * Mọi id bắt đầu `t4d3-`.
 */
import type { Lesson } from '../data';

export const NGAY_3: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t4d3-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Thì trong văn học thuật — hiện tại hoàn thành cho xu hướng, quá khứ hoàn thành trong tường thuật",
    goal: "Chọn đúng thì trong câu học thuật dài: hiện tại hoàn thành để nêu xu hướng và tổng kết nghiên cứu (has risen steadily since…, research has shown that…), quá khứ hoàn thành để lùi một bậc trong tường thuật (By 2000, the figure had doubled), và chuyển thì trong cùng một đoạn mà không sai — đẩy GRA band 7 “phần lớn câu không lỗi”.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Ở band 6 bạn đã **biết** 12 thì (Tập 3 Ngày 1). Band 7 đòi thứ khác: ==chọn đúng thì trong câu dài, và đổi thì đúng chỗ trong một đoạn==. Lỗi thì là loại lỗi “dai dẳng” giám khảo đếm ở tiêu chí **GRA**.",
          "**Hiện tại hoàn thành (HTHT)** trong văn học thuật có hai việc: ① nêu **xu hướng kéo tới bây giờ** (The number **has risen** steadily since 2010) và ② **tổng kết nghiên cứu** (Several studies **have shown** that…).",
          "**Quá khứ hoàn thành (QKHT)** có hai việc: ① mốc **By + thời điểm quá khứ** trong Task 1 (By 2000, the figure **had doubled**) và ② **lùi một bậc** khi tường thuật (Researchers reported that sales **had fallen**).",
          "Ba thì để **nhắc tới nghiên cứu**: hiện tại đơn (Smith **argues**) · quá khứ đơn (A 2019 survey **found**) · HTHT (Research **has shown**). Mỗi thì mang một ý khác.",
          "Cuối bài: đọc một đoạn Task 1 và một đoạn Task 2 có **4 thì trong 5 câu** và giải thích được vì sao đổi.",
          "Nối bài cũ: Tập 2 Ngày 5 (HTHT vs quá khứ đơn, for / since) · Tập 3 Ngày 1 (bảng 12 thì, had V3) · Tập 3 Ngày 19 (reported speech).",
        ],
      },

      { t: "h", text: "1. Ôn 3 phút: HTHT hay quá khứ đơn? — câu hỏi duy nhất cần hỏi" },
      {
        t: "p",
        text: "Người Việt sai thì nhiều vì tiếng Việt **không chia thì**: “đã tăng” dịch được thành cả **rose** lẫn **has risen**. Tiếng Anh bắt bạn trả lời một câu hỏi trước khi viết: ==khoảng thời gian đó đã ĐÓNG hay còn MỞ tới bây giờ?== Đã đóng (in 2015, last year, between 2000 and 2010) ⇒ **quá khứ đơn**. Còn mở tới lúc nói (since 2015, over the past decade, so far) ⇒ **hiện tại hoàn thành**.",
      },
      {
        t: "sodo",
        kind: "timeline",
        title: "Khoảng thời gian ĐÓNG và MỞ",
        marks: [
          { from: -9, to: -5, label: "Between 2000 and 2010, sales rose (đóng)", kieu: "doan", mau: 1 },
          { from: -4, label: "In 2015 the firm opened a second factory (điểm, đóng)", kieu: "diem", mau: 1 },
          { from: -4, to: 0, label: "Since 2015, output has doubled (mở tới bây giờ)", kieu: "doan", mau: 2 },
        ],
        caption: "Vạch chạm vào BÂY GIỜ ⇒ have / has + V3. Vạch dừng trước bây giờ ⇒ V2.",
      },
      {
        t: "table",
        caption: "Cụm thời gian quyết định thì — học thuộc hai cột",
        head: ["Khoảng ĐÓNG ⇒ quá khứ đơn", "Khoảng MỞ ⇒ hiện tại hoàn thành"],
        rows: [
          ["in 2015 · in the 1990s · in the twentieth century", "since 2015 · since the 1990s · since the turn of the century"],
          ["between 2000 and 2010 · from 2000 to 2010", "over the past / last ten years · in the last decade"],
          ["ten years ago · a decade ago · a generation ago", "in recent years · in recent decades · recently · lately"],
          ["last year · at that time · during the war", "so far · to date · up to now · until now"],
          ["when + mệnh đề quá khứ (when the law was passed)", "ever · never · already · yet (không kèm mốc đã đóng)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba cụm người Việt hay chia sai thì",
        items: [
          "**in recent years / over the past decade** ⇒ HTHT, không phải quá khứ đơn: ~~In recent years, online shopping became popular.~~ → In recent years, online shopping **has become** popular.",
          "**in the last ten years** (mở, tính tới giờ) ≠ **in the ten years to 2010** (đóng). Có chữ **the last / the past** mà không có mốc kết thúc khác ⇒ HTHT.",
          "**since** + mốc bắt đầu (since 2010) · **for** + độ dài (for ten years). ~~since ten years~~ ✗. Và sau since là **quá khứ đơn** nếu là mệnh đề: since the law **was** passed, crime **has fallen**.",
        ],
      },
      {
        t: "quiz",
        id: "t4d3-on-dong-mo",
        kind: "fill",
        title: "Kiểm tra đầu bài — chia động từ: quá khứ đơn hay hiện tại hoàn thành? (6 câu)",
        items: [
          { q: "1. Since 2015, the proportion of households with broadband ___ (double).", answers: ["has doubled"], hint: "since 2015 → mở" },
          { q: "2. Between 1990 and 2000, the city's population ___ (grow) by a third.", answers: ["grew"], hint: "between … and … → đóng" },
          { q: "3. Over the past two decades, attitudes to remote work ___ (shift) dramatically.", answers: ["have shifted"], hint: "chủ ngữ số nhiều" },
          { q: "4. The first census in the region ___ (take) place a century ago.", answers: ["took"], hint: "ago → đóng" },
          { q: "5. So far, no study ___ (find) a direct link between the two.", answers: ["has found"], hint: "so far → mở" },
          { q: "6. Since the policy ___ (be) introduced, emissions have fallen by 12%.", answers: ["was"], hint: "sau since + mệnh đề: quá khứ đơn" },
        ],
      },

      { t: "h", text: "2. Hiện tại hoàn thành cho XU HƯỚNG — bốn khung câu band 7" },
      {
        t: "p",
        text: "Câu mở bài Task 2 và câu nêu bối cảnh thường nói về **một thay đổi bắt đầu trong quá khứ và còn đúng tới nay**. Band 6 viết “Nowadays, more and more people use…” (hiện tại đơn, cũ và mòn). Band 7 dùng ==HTHT + trạng từ mức độ + cụm thời gian mở==, và biết đổi qua lại giữa **động từ** (has risen sharply) và **danh từ** (there has been a sharp rise in).",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + have / has + V3 + adv + since / over the past …",
            vi: "Khung động từ: cái gì đã tăng / giảm / thay đổi thế nào, từ bao giờ.",
            examples: [
              { en: "The number of people working from home has risen steadily since 2015.", vi: "Số người làm việc tại nhà đã tăng đều từ năm 2015." },
              { en: "Over the past two decades, average working hours have fallen slightly in most developed economies.", vi: "Trong hai thập kỷ qua, số giờ làm trung bình đã giảm nhẹ ở hầu hết các nền kinh tế phát triển." },
            ],
          },
          {
            formula: "There has been + a / an + adj + N + in + N + (since / over …)",
            vi: "Khung danh từ: “đã có một sự tăng / giảm…”. Sau danh từ chỉ thay đổi dùng in.",
            examples: [
              { en: "There has been a marked increase in the use of antidepressants over the last ten years.", vi: "Mười năm qua đã có sự gia tăng rõ rệt trong việc dùng thuốc chống trầm cảm." },
              { en: "In recent years there has been a gradual shift away from private car ownership.", vi: "Những năm gần đây đã có sự dịch chuyển dần khỏi việc sở hữu ô tô riêng." },
            ],
          },
          {
            formula: "Thời gian / nơi chốn + have / has + seen / witnessed + N",
            vi: "Chủ ngữ là KHOẢNG THỜI GIAN hoặc NƠI CHỐN — rất học thuật, giám khảo coi là cấu trúc ít gặp.",
            examples: [
              { en: "The past decade has seen a dramatic rise in childhood obesity.", vi: "Thập kỷ qua đã chứng kiến sự gia tăng mạnh của béo phì ở trẻ em." },
              { en: "Many Asian cities have witnessed rapid growth in private tutoring.", vi: "Nhiều thành phố châu Á đã chứng kiến sự phát triển nhanh của dạy thêm tư." },
            ],
          },
          {
            formula: "S + have / has + become + (increasingly) + adj / + N",
            vi: "“đã trở nên (ngày càng)…” — thay cho “more and more”.",
            examples: [
              { en: "Housing has become increasingly unaffordable for young adults.", vi: "Nhà ở đã trở nên ngày càng ngoài tầm với của người trẻ." },
              { en: "Remote work has become the norm in the technology sector.", vi: "Làm việc từ xa đã thành chuyện thường trong ngành công nghệ." },
            ],
          },
        ],
      },
      {
        t: "table",
        caption: "Đổi “more and more” (band 6) thành câu band 7",
        head: ["Band 6", "Band 7", "Khác ở đâu"],
        rows: [
          ["Nowadays, more and more people live alone.", "The number of people living alone **has grown steadily** in recent decades.", "HTHT + trạng từ + cụm thời gian mở"],
          ["Today many students study abroad.", "**There has been a sharp increase in** the number of students studying abroad.", "Danh hoá: a sharp increase in"],
          ["In the last years, cities are bigger.", "**The last fifty years have seen** unprecedented urban growth.", "Chủ ngữ thời gian + have seen"],
          ["Now technology is very important at work.", "Technology **has become increasingly central** to most occupations.", "has become increasingly + adj"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi viết xu hướng",
        items: [
          "**Bị động thừa**: rise, fall, increase (nội động từ), grow, decline, happen **không có bị động**. ~~The price has been increased sharply~~ (chỉ đúng khi có người cố ý tăng giá) → The price **has increased** sharply. ~~has been risen~~ ✗ luôn luôn.",
          "**rise** (tự tăng: rise – rose – risen) ≠ **raise** (làm tăng cái gì: raise – raised – raised). Taxes **have risen**. / The government **has raised** taxes.",
          "**Sai giới từ sau danh từ**: an increase **in** the number of (cái gì tăng) · an increase **of** 10% (tăng bao nhiêu). ~~an increase of the number~~ ✗.",
          "**Chia sai theo chủ ngữ thật**: **The number of** students **has** risen (number là số ít). **A number of** students **have** left (= nhiều sinh viên, số nhiều).",
          "**HTHT + mốc đã đóng**: ~~Sales have risen in 2019.~~ → Sales **rose** in 2019. / Sales **have risen since** 2019.",
          "**the last years** ✗ → **the last few years** / **recent years** (tiếng Anh cần few hoặc một con số).",
        ],
      },
      {
        t: "rule",
        formula: "S + have / has + V3 + adv + since … / over the past …  ⇄  There has been + a + adj + N + in …",
        vi: "Xu hướng kéo tới bây giờ: dùng HTHT với cụm thời gian MỞ; đổi qua lại dạng động từ và dạng danh từ để không lặp.",
      },
      {
        t: "quiz",
        id: "t4d3-xu-huong-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — HTHT cho xu hướng (5 câu)",
        grammar: "S + have / has + V3 + adv + since / over the past … · There has been a + adj + N + in …",
        items: [
          { q: "Số người sống một mình đã tăng đều trong ba thập kỷ qua.", answers: ["The number of people living alone has risen steadily over the past three decades.", "The number of people living alone has increased steadily over the past three decades.", "The number of people living alone has grown steadily over the last three decades.", "The number of people who live alone has risen steadily over the past three decades.", "The number of people living alone has risen steadily over the last three decades."], hint: "the number of … has · steadily · over the past three decades" },
          { q: "Những năm gần đây đã có sự sụt giảm mạnh về số người đọc báo giấy.", answers: ["In recent years there has been a sharp decline in the number of people reading printed newspapers.", "In recent years, there has been a sharp decline in the number of people reading printed newspapers.", "There has been a sharp decline in the number of people reading printed newspapers in recent years.", "In recent years there has been a sharp fall in the number of people reading printed newspapers.", "In recent years there has been a sharp drop in the number of people who read printed newspapers."], hint: "there has been a sharp decline in · printed newspapers" },
          { q: "Thập kỷ qua đã chứng kiến sự phát triển nhanh của giáo dục trực tuyến.", answers: ["The past decade has seen rapid growth in online education.", "The last decade has seen rapid growth in online education.", "The past decade has witnessed rapid growth in online education.", "The past decade has seen a rapid growth in online education.", "The past decade has seen the rapid growth of online education."], hint: "The past decade has seen · rapid growth in" },
          { q: "Từ khi luật được thông qua, số vụ tai nạn đã giảm một phần tư.", answers: ["Since the law was passed, the number of accidents has fallen by a quarter.", "Since the law was passed, the number of accidents has dropped by a quarter.", "Since the law was passed, the number of accidents has decreased by a quarter.", "The number of accidents has fallen by a quarter since the law was passed.", "Since the law was passed, the number of accidents has declined by a quarter."], hint: "since + quá khứ đơn (was passed) · has fallen by a quarter" },
          { q: "Nhà ở đã trở nên ngày càng đắt đỏ ở các thành phố lớn.", answers: ["Housing has become increasingly expensive in large cities.", "Housing has become increasingly expensive in big cities.", "Housing has become increasingly expensive in major cities.", "Housing has become more and more expensive in large cities.", "Housing has become increasingly unaffordable in large cities."], hint: "has become increasingly + adj · housing (không đếm được)" },
        ],
      },

      { t: "h", text: "3. has risen hay has been rising? — HTHT đơn và tiếp diễn khi nói xu hướng" },
      {
        t: "p",
        text: "Tập 3 Ngày 1 đã dạy **have been V-ing** (“đã và đang làm suốt”). Khi viết xu hướng, hai dạng này **đều đúng ngữ pháp** nhưng nhấn hai thứ khác nhau. Chọn sai không bị trừ nặng, nhưng chọn đúng làm câu chính xác hơn — đúng thứ band 7 cần.",
      },
      {
        t: "table",
        head: ["", "has / have + V3", "has / have been + V-ing"],
        rows: [
          ["Nhấn vào", "**Kết quả** tính tới giờ — có con số, có mức", "**Quá trình** đang tiếp tục, chưa dừng"],
          ["Đi với con số?", "✓ has risen **by 20%** · has doubled · has reached 5 million", "✗ ~~has been rising by 20%~~ · ~~has been doubling~~"],
          ["Ví dụ", "Unemployment **has fallen** to 4% since 2020.", "Unemployment **has been falling** since 2020 (và còn đang giảm)."],
          ["Động từ trạng thái", "✓ has existed · has remained · has been (stable)", "✗ ~~has been remaining~~ · ~~has been existing~~ · ~~has been knowing~~"],
          ["Dùng ở đâu", "Task 1 (số liệu), kết luận", "Câu bối cảnh Task 2, Speaking Part 3"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Global temperatures have been rising for more than a century, and have increased by roughly one degree since 1900.", vi: "Nhiệt độ toàn cầu đã và đang tăng hơn một thế kỷ, và đã tăng khoảng một độ từ năm 1900. (vế 1 = quá trình, vế 2 = con số)" },
          { en: "Birth rates have remained low since the 1990s.", vi: "Tỉ lệ sinh vẫn ở mức thấp từ thập niên 1990. (remain là động từ trạng thái — không tiếp diễn)" },
          { en: "Employers have been complaining about a skills shortage for years, yet investment in training has barely changed.", vi: "Giới chủ đã than phiền về tình trạng thiếu kỹ năng nhiều năm nay, vậy mà đầu tư cho đào tạo hầu như không đổi." },
        ],
      },
      {
        t: "rule",
        formula: "có con số / kết quả ⇒ have + V3 · quá trình còn tiếp diễn, không con số ⇒ have been + V-ing",
        vi: "Động từ trạng thái (remain, exist, know, belong) chỉ dùng have + V3.",
      },
      {
        t: "mcq",
        id: "t4d3-don-hay-tiep-dien",
        title: "has + V3 hay has been + V-ing? (6 câu)",
        items: [
          { q: "1. The cost of solar panels ___ by almost 80% since 2010.", options: ["has been falling", "has fallen", "fell", "is falling"], correct: 1, why: "Có con số (by almost 80%) + since ⇒ kết quả tính tới giờ ⇒ has fallen. has been falling không đi với mức thay đổi cụ thể." },
          { q: "2. Scientists ___ about plastic in the oceans for decades, but only recently have governments begun to act.", options: ["have been warning", "warned", "have warn", "had warned"], correct: 0, why: "for decades + việc lặp lại, còn tiếp tục, không có con số ⇒ have been warning. Vế sau dùng HTHT (have begun) nên mốc là hiện tại, không phải had warned." },
          { q: "3. The gap between rich and poor regions ___ largely unchanged since the 1980s.", options: ["has been remaining", "remained", "has remained", "is remaining"], correct: 2, why: "remain là động từ trạng thái ⇒ không tiếp diễn; since the 1980s ⇒ HTHT: has remained." },
          { q: "4. Since the app was launched, it ___ more than two million users.", options: ["has been attracting", "attracts", "attracted", "has attracted"], correct: 3, why: "Con số tổng (more than two million users) tính tới giờ ⇒ has attracted. Sau since + quá khứ đơn (was launched)." },
          { q: "5. House prices ___ so quickly lately that many first-time buyers have given up.", options: ["have been rising", "rose", "had risen", "have been risen"], correct: 0, why: "lately + quá trình đang tiếp diễn, không con số ⇒ have been rising. have been risen là bị động sai (rise là nội động từ)." },
          { q: "6. To date, the programme ___ over 3,000 teachers in rural areas.", options: ["has been training", "has trained", "trained", "was training"], correct: 1, why: "to date (tính tới nay) + con số 3,000 ⇒ kết quả ⇒ has trained." },
        ],
      },

      { t: "h", text: "4. Ba thì để nhắc tới nghiên cứu — argues · found · has shown" },
      {
        t: "p",
        text: "Bài đọc Passage 3 và bài giảng Part 4 đầy câu kiểu “Researchers **have found**…”, “A 2019 study **showed**…”, “Brown **argues**…”. Người viết **không chọn bừa**: mỗi thì báo cho người đọc biết thông tin đó là **một việc đã xong**, **một hiểu biết còn giá trị**, hay **một quan điểm đang được tranh luận**. Hiểu điều này giúp bạn đọc nhanh hơn (bài 2 hôm nay) và viết Task 2 chắc hơn.",
      },
      {
        t: "table",
        caption: "Ba thì — ba ý",
        head: ["Thì", "Ý ngầm", "Tín hiệu", "Ví dụ"],
        rows: [
          ["**Quá khứ đơn**", "Một nghiên cứu **cụ thể**, đã làm xong, có năm / có tên", "A 2019 survey · In one experiment · Smith (2015)", "A 2019 survey **found** that 40% of employees **felt** isolated."],
          ["**Hiện tại hoàn thành**", "**Nhiều** nghiên cứu, không nêu thời điểm; kết quả **còn giá trị** hôm nay", "Research · Several studies · Recent work · Little attention", "Research **has shown** that sleep **affects** memory."],
          ["**Hiện tại đơn**", "**Quan điểm / lập luận** của tác giả (coi như đang nói với ta); **sự thật chung**", "Brown argues / claims / suggests · The data indicate", "Brown **argues** that cities **are** becoming less equal."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Research / Several studies + have + shown / found / suggested + that + S + V (hiện tại)",
            vi: "Tổng kết hiểu biết chung. Mệnh đề sau that ở HIỆN TẠI vì điều đó còn đúng.",
            examples: [
              { en: "Numerous studies have shown that regular exercise reduces the risk of heart disease.", vi: "Rất nhiều nghiên cứu đã cho thấy tập thể dục đều đặn làm giảm nguy cơ bệnh tim." },
              { en: "Recent research has suggested that bilingual children may be better at switching between tasks.", vi: "Nghiên cứu gần đây gợi ý rằng trẻ song ngữ có thể giỏi chuyển đổi giữa các nhiệm vụ hơn." },
            ],
          },
          {
            formula: "Little / Much / Considerable + attention / research + has been + V3 + (to / on) + N",
            vi: "Dạng bị động: “người ta đã (ít / nhiều) chú ý tới…”. Dùng để nêu khoảng trống hoặc nền tảng.",
            examples: [
              { en: "Little attention has been paid to the effects of noise on older residents.", vi: "Người ta còn ít chú ý tới tác động của tiếng ồn với cư dân lớn tuổi." },
              { en: "Considerable research has been carried out on the causes of urban poverty.", vi: "Đã có lượng nghiên cứu đáng kể về nguyên nhân của nghèo đô thị." },
            ],
          },
          {
            formula: "A + (năm) + study / survey + found / showed + that + S + V2",
            vi: "Một nghiên cứu cụ thể đã xong ⇒ cả hai động từ ở quá khứ (kết quả của riêng lần đó).",
            examples: [
              { en: "A 2018 study of 3,000 commuters found that those who cycled to work reported lower stress levels.", vi: "Một nghiên cứu năm 2018 trên 3.000 người đi làm thấy rằng những người đạp xe đi làm báo cáo mức căng thẳng thấp hơn." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — bốn lỗi khi nhắc tới nghiên cứu trong Task 2",
        items: [
          "~~Many researches have shown~~ ✗ — **research không đếm được**: Much research **has** shown / Many **studies have** shown.",
          "~~Researches show that in 2019…~~ — có năm cụ thể thì dùng quá khứ đơn: A 2019 study **showed**…",
          "~~Scientists have proved that…~~ — **prove** quá mạnh, gần như không nghiên cứu nào “chứng minh” tuyệt đối. Band 7 viết **have shown / found / suggested / indicated** (bài hedging ở Ngày 13).",
          "Đừng bịa số liệu và tên nghiên cứu trong bài thi. Viết khái quát mà đúng thì: “Studies **have** consistently **shown** that…” là đủ và an toàn.",
        ],
      },
      {
        t: "rule",
        formula: "Research has shown that + hiện tại · A 2019 study found that + quá khứ · Brown argues that + hiện tại",
        vi: "Nhiều nghiên cứu, còn giá trị ⇒ HTHT; một nghiên cứu có năm ⇒ quá khứ đơn; quan điểm tác giả ⇒ hiện tại đơn.",
      },
      {
        t: "quiz",
        id: "t4d3-nghien-cuu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — nhắc tới nghiên cứu (4 câu)",
        grammar: "Research has shown that + S + V(s) · A + năm + study found that + S + V2 · Little attention has been paid to + N",
        items: [
          { q: "Nhiều nghiên cứu đã cho thấy rằng thiếu ngủ ảnh hưởng tới khả năng tập trung.", answers: ["Many studies have shown that a lack of sleep affects concentration.", "Numerous studies have shown that a lack of sleep affects concentration.", "Many studies have shown that lack of sleep affects concentration.", "Several studies have shown that a lack of sleep affects concentration.", "Many studies have shown that a lack of sleep affects the ability to concentrate.", "Many studies have shown that sleep deprivation affects concentration."], hint: "Many studies have shown that · a lack of sleep · affects (hiện tại)" },
          { q: "Một khảo sát năm 2020 thấy rằng 60% nhân viên muốn làm việc tại nhà.", answers: ["A 2020 survey found that 60% of employees wanted to work from home.", "A 2020 survey found that 60 percent of employees wanted to work from home.", "A survey in 2020 found that 60% of employees wanted to work from home.", "A 2020 survey showed that 60% of employees wanted to work from home.", "A 2020 survey found that 60% of employees preferred to work from home."], hint: "A 2020 survey found that · wanted (quá khứ)" },
          { q: "Người ta còn ít chú ý tới sức khoẻ tinh thần của người chăm sóc.", answers: ["Little attention has been paid to the mental health of carers.", "Little attention has been paid to the mental health of caregivers.", "Little attention has been paid to carers' mental health.", "Little attention has been given to the mental health of carers."], hint: "Little attention has been paid to · carers" },
          { q: "Nghiên cứu gần đây gợi ý rằng mạng xã hội có thể làm tăng cảm giác cô đơn.", answers: ["Recent research has suggested that social media may increase feelings of loneliness.", "Recent research suggests that social media may increase feelings of loneliness.", "Recent research has suggested that social media may increase loneliness.", "Recent research has suggested that social media can increase feelings of loneliness.", "Recent research has suggested that social media might increase feelings of loneliness."], hint: "Recent research has suggested that · may increase · research không có s" },
        ],
      },

      { t: "h", text: "5. Quá khứ hoàn thành ① — By + mốc quá khứ: câu ăn điểm của Task 1" },
      {
        t: "p",
        text: "**Quá khứ hoàn thành** (past perfect) = **had + V3** = “quá khứ của quá khứ” (Tập 3 Ngày 1). Trong Task 1, nó có một chỗ dùng gần như cố định: ==By + năm quá khứ, S + had + V3== — “**tính tới** năm đó thì đã…”. Chữ **by** nghĩa là “không muộn hơn”, nên việc tăng / giảm đã **hoàn tất trước** mốc đó ⇒ lùi một bậc.",
      },
      {
        t: "sodo",
        kind: "timeline",
        title: "By 2010, the figure had doubled",
        marks: [
          { from: -9, label: "1990: 10 triệu (điểm xuất phát)", kieu: "diem", mau: 3 },
          { from: -9, to: -4, label: "had doubled — việc tăng diễn ra TRƯỚC mốc", kieu: "doan", mau: 2 },
          { from: -4, label: "By 2010: 20 triệu (mốc quá khứ)", kieu: "diem", mau: 1 },
        ],
        caption: "Mốc (2010) đã ở quá khứ; việc tăng xảy ra trước mốc ⇒ had + V3. Nếu mốc là BÂY GIỜ thì dùng have + V3; mốc ở TƯƠNG LAI thì will have + V3 (Tập 3 Ngày 5).",
      },
      {
        t: "table",
        caption: "Một khung By — ba mốc, ba thì",
        head: ["Mốc", "Thì", "Ví dụ"],
        rows: [
          ["By + **quá khứ** (By 2010, By the end of the period)", "had + V3", "By 2010, the figure **had doubled** to 20 million."],
          ["By **now** / So far / To date", "have + V3", "To date, the figure **has reached** 30 million."],
          ["By + **tương lai** (By 2040)", "will have + V3", "By 2040, the figure **will have exceeded** 40 million."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "By + năm, S + had + V3 + (to / by + số)",
            vi: "Chốt con số tại một mốc trong quá khứ.",
            examples: [
              { en: "By 2005, the proportion of women in higher education had overtaken that of men.", vi: "Đến năm 2005, tỉ lệ nữ học đại học đã vượt tỉ lệ nam." },
              { en: "By the end of the period, coal consumption had fallen to less than half its 1980 level.", vi: "Đến cuối giai đoạn, lượng tiêu thụ than đã giảm còn chưa tới một nửa mức năm 1980." },
            ],
          },
          {
            formula: "S + V2 …, having / after + V-ing …  ·  S + had + V3 … before + V-ing / S + V2",
            vi: "Kể hai chặng: chặng trước dùng had + V3, chặng sau dùng V2.",
            examples: [
              { en: "Sales had remained flat for five years before rising sharply in 2015.", vi: "Doanh số đã đi ngang năm năm trước khi tăng vọt vào năm 2015." },
              { en: "The figure, which had peaked at 70% in 1995, dropped steadily over the following decade.", vi: "Con số này, vốn đã đạt đỉnh 70% năm 1995, giảm đều trong thập kỷ sau đó." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với By + quá khứ",
        items: [
          "~~By 2010, the figure doubled.~~ — sau **By + mốc quá khứ** cần **had doubled**. (In 2010, the figure doubled ✓ — in thì quá khứ đơn.)",
          "~~By 2010, the figure has doubled.~~ — mốc đã ở quá khứ thì không dùng has. Lỗi này rất hay gặp khi biểu đồ kết thúc ở năm đã qua.",
          "~~had rose / had fell / had grew~~ ✗ → had **risen** / had **fallen** / had **grown** (sau had là V3, không phải V2).",
          "Đừng rải had khắp bài. Một bài Task 1 mô tả quá khứ: **quá khứ đơn là thì chính**, had V3 chỉ xuất hiện ở 1–2 câu có **By / before / which had**.",
        ],
      },
      {
        t: "rule",
        formula: "By + mốc quá khứ, S + had + V3 · S + had + V3 + before + V-ing",
        vi: "Việc hoàn tất TRƯỚC một mốc đã ở quá khứ. Quá khứ đơn vẫn là thì chính; had V3 chỉ để lùi một bậc.",
      },
      {
        t: "quiz",
        id: "t4d3-by-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — By + mốc quá khứ (4 câu)",
        grammar: "By + năm, S + had + V3 · S + had + V3 + before + V-ing",
        items: [
          { q: "Đến năm 2000, dân số thành phố đã tăng gấp đôi.", answers: ["By 2000, the city's population had doubled.", "By 2000, the population of the city had doubled.", "By 2000 the city's population had doubled.", "By the year 2000, the city's population had doubled."], hint: "By 2000 · had doubled" },
          { q: "Đến cuối giai đoạn, con số này đã giảm xuống 15%.", answers: ["By the end of the period, this figure had fallen to 15%.", "By the end of the period, the figure had fallen to 15%.", "By the end of the period, this figure had dropped to 15%.", "By the end of the period, this figure had declined to 15%.", "By the end of the period, this figure had decreased to 15%."], hint: "By the end of the period · had fallen to" },
          { q: "Giá đã ổn định trong ba năm trước khi tăng mạnh vào năm 2018.", answers: ["Prices had remained stable for three years before rising sharply in 2018.", "Prices had been stable for three years before rising sharply in 2018.", "Prices had remained stable for three years before they rose sharply in 2018.", "Prices had remained steady for three years before rising sharply in 2018.", "The price had remained stable for three years before rising sharply in 2018."], hint: "had remained stable · before rising sharply" },
          { q: "Đến năm 2015, số người dùng điện thoại thông minh đã vượt số người dùng máy tính.", answers: ["By 2015, the number of smartphone users had exceeded the number of computer users.", "By 2015, the number of smartphone users had overtaken the number of computer users.", "By 2015, the number of smartphone users had exceeded that of computer users.", "By 2015, the number of smartphone users had overtaken that of computer users.", "By 2015, the number of smartphone users had surpassed the number of computer users."], hint: "the number of … had exceeded / overtaken" },
        ],
      },

      { t: "h", text: "6. Quá khứ hoàn thành ② — lùi một bậc khi tường thuật và kể chuyện" },
      {
        t: "p",
        text: "Việc thứ hai của had + V3: khi câu chính **đã ở quá khứ** (reported, found, realised, discovered, it turned out) và mệnh đề sau nói về việc **xảy ra trước đó**, tiếng Anh **lùi thì** (backshift — Tập 3 Ngày 19). Bạn gặp nó ở ba nơi: **tường thuật nghiên cứu**, **kể chuyện** trong Speaking Part 2, và **bài đọc lịch sử** — như bài đọc hôm nay.",
      },
      {
        t: "table",
        caption: "Lùi thì trong tường thuật",
        head: ["Việc gốc", "Tường thuật (động từ chính ở quá khứ)"],
        rows: [
          ["Stress levels **fell**. (quá khứ đơn)", "The team reported that stress levels **had fallen**."],
          ["Participants **have improved**. (HTHT)", "The researchers found that participants **had improved**."],
          ["The method **is** unreliable. (còn đúng tới nay)", "Critics pointed out that the method **was** / **is** unreliable. (sự thật còn đúng ⇒ được giữ hiện tại)"],
          ["Nobody **had noticed** the error. (đã là QKHT)", "It emerged that nobody **had noticed** the error. (không lùi thêm được)"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "When the results were published, it became clear that the earlier estimates had been far too optimistic.", vi: "Khi kết quả được công bố, người ta thấy rõ rằng các ước tính trước đó đã quá lạc quan." },
          { en: "Homesickness had been familiar for as long as people had travelled; what the doctor did was give it a medical name.", vi: "Nỗi nhớ nhà đã quen thuộc từ khi con người biết đi xa; điều vị bác sĩ làm là đặt cho nó một cái tên y học. (kiểu câu trong bài đọc hôm nay)" },
          { en: "By the time the government acted, thousands of small firms had already closed.", vi: "Vào lúc chính phủ hành động, hàng nghìn doanh nghiệp nhỏ đã đóng cửa rồi." },
          { en: "I'd never spoken in public before, so I was shaking when I walked onto the stage.", vi: "Trước đó tôi chưa từng nói trước đám đông, nên tôi run khi bước lên sân khấu. (Speaking Part 2)" },
        ],
      },
      {
        t: "table",
        caption: "Khi nào KHÔNG cần had",
        head: ["Tình huống", "Dùng", "Ví dụ"],
        rows: [
          ["Các việc kể **đúng thứ tự** xảy ra", "Quá khứ đơn cho tất cả", "The firm **opened** in 1990, **expanded** in 1995 and **closed** in 2008."],
          ["Có **after / before** đã nói rõ trước – sau", "had không bắt buộc", "After the law **was** (had been) passed, accidents fell."],
          ["Chỉ có **một** việc quá khứ", "Quá khứ đơn", "~~The Romans had built this road.~~ → The Romans **built** this road."],
          ["Cần đảo thứ tự kể — nói việc sau trước, rồi **nhìn lùi**", "**had + V3** bắt buộc", "The bridge collapsed in 1879. It **had been** open for only nineteen months."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi tinh ở band 6.5",
        items: [
          "**Dùng had cho việc xảy ra SAU**: ~~He graduated in 2010 and then had found a job.~~ → …and then **found** a job. had chỉ dành cho việc **trước**.",
          "**Quên lùi thì khi tường thuật**: ~~The survey showed that most people have changed their habits.~~ → …most people **had changed** their habits.",
          "**when** đổi nghĩa theo thì: When I arrived, the lecture **started** (tôi đến rồi bài giảng mới bắt đầu) ≠ When I arrived, the lecture **had started** (tôi đến muộn).",
          "**Bị động của QKHT** = had **been** + V3: The site **had been abandoned** for decades. ~~had abandoned~~ ở đây sai nghĩa.",
        ],
      },
      {
        t: "rule",
        formula: "S + V2 (reported / found / realised) + that + S + had + V3",
        vi: "Động từ chính ở quá khứ + việc xảy ra trước đó ⇒ lùi thành had + V3. Kể đúng thứ tự thì không cần had.",
      },
      {
        t: "quiz",
        id: "t4d3-tuong-thuat-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — lùi thì trong tường thuật (4 câu)",
        grammar: "S + V2 + that + S + had + V3 · By the time + S + V2, S + had + V3",
        items: [
          { q: "Các nhà nghiên cứu báo cáo rằng mức độ lo âu đã giảm sau sáu tuần.", answers: ["The researchers reported that anxiety levels had fallen after six weeks.", "Researchers reported that anxiety levels had fallen after six weeks.", "The researchers reported that levels of anxiety had fallen after six weeks.", "The researchers reported that anxiety levels had dropped after six weeks.", "The researchers reported that anxiety levels had decreased after six weeks."], hint: "reported that · anxiety levels · had fallen" },
          { q: "Vào lúc cảnh sát đến, bọn trộm đã bỏ trốn.", answers: ["By the time the police arrived, the thieves had escaped.", "By the time the police arrived, the thieves had run away.", "By the time the police arrived, the thieves had fled.", "By the time the police arrived, the thieves had already escaped.", "The thieves had escaped by the time the police arrived."], hint: "By the time + V2, … had + V3" },
          { q: "Cuộc khảo sát cho thấy hầu hết người tham gia chưa từng nghe về chính sách này.", answers: ["The survey showed that most participants had never heard of this policy.", "The survey showed that most participants had never heard of the policy.", "The survey showed that most participants had never heard about this policy.", "The survey found that most participants had never heard of this policy.", "The survey revealed that most participants had never heard of this policy."], hint: "showed that · had never heard of" },
          { q: "Toà nhà đã bị bỏ hoang hai mươi năm trước khi được chuyển thành bảo tàng.", answers: ["The building had been abandoned for twenty years before it was turned into a museum.", "The building had been abandoned for twenty years before being turned into a museum.", "The building had been abandoned for twenty years before it was converted into a museum.", "The building had been abandoned for 20 years before it was turned into a museum.", "The building had been abandoned for twenty years before being converted into a museum."], hint: "had been abandoned (bị động) · before it was turned into" },
        ],
      },

      { t: "h", text: "7. Chuyển thì trong MỘT đoạn — mỗi lần đổi phải có lý do" },
      {
        t: "p",
        text: "Một đoạn văn band 7 hiếm khi chỉ có một thì. Nhưng **đổi thì bừa** là lỗi nặng hơn cả dùng một thì đơn điệu. Quy tắc: ==mỗi đoạn có một THÌ NỀN; chỉ rời thì nền khi có tín hiệu thời gian mới==. Xem hai đoạn mẫu, mỗi chỗ đổi thì đã được đánh số.",
      },
      {
        t: "table",
        caption: "Đoạn Task 1 (biểu đồ 1990 – 2020, có dự báo 2040) — thì nền: quá khứ đơn",
        head: ["Câu", "Thì", "Vì sao"],
        rows: [
          ["① In 1990, around 10% of households **owned** a computer.", "Quá khứ đơn", "Mốc đã đóng (In 1990) — thì nền"],
          ["② This figure **rose** steadily over the next decade, and by 2005 it **had reached** 60%.", "QK đơn → QKHT", "by 2005 ⇒ had + V3"],
          ["③ Growth then **slowed**, although ownership **stood** at 85% in 2020.", "Quá khứ đơn", "Về lại thì nền"],
          ["④ Overall, ownership **has increased** more than eightfold since 1990.", "HTHT", "since 1990 — nhìn cả giai đoạn tới gần đây (chỉ dùng khi năm cuối là hiện tại / rất gần)"],
          ["⑤ It **is expected to** exceed 90% by 2040.", "Hiện tại đơn (bị động) + to V", "Dự báo (Tập 3 Ngày 5)"],
        ],
      },
      {
        t: "table",
        caption: "Đoạn thân bài Task 2 — thì nền: hiện tại đơn",
        head: ["Câu", "Thì", "Vì sao"],
        rows: [
          ["① Remote work **benefits** employees as much as employers.", "Hiện tại đơn", "Câu chủ đề = nhận định chung — thì nền"],
          ["② Over the past decade, the technology needed to work from home **has become** cheap and reliable.", "HTHT", "Xu hướng tới nay (Over the past decade)"],
          ["③ When offices **closed** in 2020, many firms **discovered** that productivity **had** not **fallen** as they **had feared**.", "QK đơn + QKHT", "Ví dụ cụ thể đã xong; việc “giảm” và “sợ” lùi một bậc"],
          ["④ As a result, flexible arrangements **are** now common, and they **are likely to** remain so.", "Hiện tại đơn", "Về thì nền + dự đoán"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo soát thì trong 60 giây (lượt 1 · ĐỘNG TỪ của bảng tự soát 6 lượt)",
        items: [
          "Khoanh mọi **cụm thời gian** trong bài (in 2010, since, over the past, by, ago). Động từ đứng cạnh có khớp cột ĐÓNG / MỞ ở mục 1 không?",
          "Tìm mọi chữ **had**: có **mốc quá khứ** nào đứng sau nó về thời gian không? Không có ⇒ đổi về quá khứ đơn.",
          "Tìm mọi **has / have + V3**: có mốc đã đóng (in 2015, last year) trong cùng mệnh đề không? Có ⇒ đổi về quá khứ đơn.",
          "Task 1 biểu đồ toàn năm quá khứ ⇒ **không có will**, không có is / are cho số liệu. Biểu đồ không ghi năm ⇒ hiện tại đơn cả bài.",
        ],
      },
      {
        t: "rule",
        formula: "thì nền + tín hiệu thời gian mới ⇒ đổi thì · hết tín hiệu ⇒ về thì nền",
        vi: "Task 1 có năm quá khứ: nền = quá khứ đơn. Task 2: nền = hiện tại đơn; ví dụ đã xong = quá khứ; xu hướng = HTHT.",
      },

      { t: "h", text: "8. Luyện tổng hợp — câu dài học thuật" },
      {
        t: "quiz",
        id: "t4d3-np-doan-van",
        kind: "fill",
        title: "Chia động từ trong ngoặc — một đoạn Task 1 liền mạch (8 chỗ trống)",
        items: [
          { q: "1. In 1980, coal ___ (account) for almost two-thirds of the country's electricity.", answers: ["accounted"], hint: "In 1980 — thì nền" },
          { q: "2. Its share then ___ (decline) gradually over the following two decades.", answers: ["declined"] },
          { q: "3. By 2000, it ___ (fall) to just over 40%.", answers: ["had fallen"], hint: "By 2000" },
          { q: "4. Gas, which ___ (be) almost negligible at the start of the period, became the second largest source in 1995.", answers: ["had been", "was"], hint: "nhìn lùi về trước 1995 (had been; was cũng chấp nhận vì đã có mốc at the start of the period)" },
          { q: "5. Renewables ___ (not exceed) 5% until 2010, when they began to climb rapidly.", answers: ["did not exceed", "didn't exceed"], hint: "kể đúng thứ tự — không cần had" },
          { q: "6. By the end of the period in 2020, wind and solar together ___ (overtake) coal.", answers: ["had overtaken"] },
          { q: "7. Overall, the energy mix ___ (change) almost beyond recognition since 1980.", answers: ["has changed"], hint: "since 1980" },
          { q: "8. The share of renewables is expected ___ (reach) 70% by 2040.", answers: ["to reach"], hint: "is expected + to V" },
        ],
      },
      {
        t: "mcq",
        id: "t4d3-np-tong-hop",
        title: "Chọn đáp án đúng (10 câu)",
        items: [
          { q: "1. ___ the past thirty years, life expectancy in the region has risen by almost a decade.", options: ["Since", "Over", "During the", "From"], correct: 1, why: "Over the past thirty years + HTHT. Since cần một mốc bắt đầu (since 1995), không đi với khoảng thời gian." },
          { q: "2. A 2017 experiment ___ that participants who slept for eight hours ___ twice as many words.", options: ["has shown / recall", "shows / had recalled", "showed / recalled", "had shown / recall"], correct: 2, why: "Một thí nghiệm cụ thể có năm ⇒ quá khứ đơn cho cả động từ tường thuật lẫn kết quả của lần đó." },
          { q: "3. By the time the vaccine became widely available, the virus ___ to more than a hundred countries.", options: ["had spread", "spread", "has spread", "was spread"], correct: 0, why: "By the time + quá khứ đơn (became) ⇒ việc lây lan hoàn tất trước đó ⇒ had spread. spread là nội động từ ở đây nên không bị động." },
          { q: "4. There ___ a significant fall ___ the number of smokers since the ban came into force.", options: ["was / of", "has been / of", "had been / in", "has been / in"], correct: 3, why: "since the ban came into force ⇒ HTHT; a fall IN the number of (cái gì giảm)." },
          { q: "5. Much research ___ on the causes of obesity, but far less on its prevention.", options: ["have been carried out", "has carried out", "was carrying out", "has been carried out"], correct: 3, why: "research không đếm được ⇒ has; nghiên cứu “được thực hiện” ⇒ bị động: has been carried out." },
          { q: "6. The report concluded that the scheme ___ because local residents ___ consulted.", options: ["failed / were not", "had failed / had not been", "has failed / have not been", "fails / are not"], correct: 1, why: "Động từ chính ở quá khứ (concluded) + hai việc xảy ra trước đó ⇒ lùi thì: had failed · had not been consulted (bị động)." },
          { q: "7. The number of graduates ___ dramatically in recent years, which ___ competition for entry-level jobs fiercer.", options: ["have increased / makes", "increased / made", "has increased / has made", "had increased / makes"], correct: 2, why: "The number of … + has (số ít); in recent years ⇒ HTHT; hệ quả cũng kéo tới nay ⇒ has made." },
          { q: "8. Car ownership peaked in 2008, ___ steadily throughout the previous decade.", options: ["having risen", "has risen", "rising then", "rose"], correct: 0, why: "having + V3 = sau khi đã… (việc xảy ra trước peaked) — dạng rút gọn của ‘after it had risen’. Hai mệnh đề nối bằng dấu phẩy không thể dùng rose trần." },
          { q: "9. Historians ___ long ___ that the wall was built for defence; recent finds, however, suggest otherwise.", options: ["had / assume", "have / assumed", "are / assuming", "were / assumed"], correct: 1, why: "have long assumed = từ lâu vẫn cho rằng (tới nay) — HTHT với long; vế sau ở hiện tại (suggest) xác nhận mốc là bây giờ." },
          { q: "10. Until the 1950s, most people ___ far from the town where they ___ born.", options: ["have never travelled / were", "never travel / are", "had never travelled / had been", "would never travelled / was"], correct: 2, why: "Until the 1950s là mốc quá khứ; ‘chưa từng đi xa’ tính tới mốc đó ⇒ had never travelled; ‘được sinh ra’ còn trước nữa ⇒ had been born (were born cũng chấp nhận được trong thực tế, nhưng phương án A sai ở have never travelled)." },
        ],
      },
      {
        t: "note",
        title: "📌 Mang gì sang các bài sau",
        items: [
          "**Bài 2 (Đọc)**: bài đọc hôm nay kể lịch sử một khái niệm qua bốn thế kỷ — để ý chỗ tác giả dùng **had + V3** để nhìn lùi và **have + V3** khi nói về nghiên cứu hiện nay.",
          "**Bài 3 (Nói)**: câu hỏi “How has … changed?” bắt buộc mở bằng **has changed / has become** — đúng mục 2.",
          "**Ngày 4 (Viết)**: câu bối cảnh mở bài Opinion dùng khung “The past decade has seen…” / “There has been growing concern about…”.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t4d3-doc",
    kind: "reading",
    title: "Đọc: Matching headings 3 — tiêu đề nói bằng ý ẩn",
    goal: "Ghép đúng tiêu đề cho 8 đoạn của một bài Passage 3 khi tiêu đề KHÔNG lặp chữ nào của đoạn mà chỉ nói lại ý (paraphrase mức 4 — ý ẩn), loại được ba kiểu bẫy band 7, và làm trọn 13 câu trong 20 phút — hướng tới Passage 3 ≥ 9/13.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "**Matching headings** = ghép mỗi đoạn với một tiêu đề tóm ý chính. Đây là lần thứ ba: Tập 2 Ngày 12 (nhập — tìm câu chủ đề), Tập 3 Ngày 5 (ý chính vs chi tiết). Hôm nay là mức **Passage 3**.",
          "Khác biệt ở band 7: tiêu đề **không dùng lại chữ** của đoạn, thậm chí không dùng từ đồng nghĩa. Nó nói **việc đoạn văn LÀM** (so sánh, bác bỏ, đặt nghi vấn) hoặc **kết luận bạn phải tự rút ra** — gọi là ==paraphrase ý ẩn== (mức 4 trong thang Tập 3 Ngày 1).",
          "Đoạn Passage 3 thường **không có câu chủ đề lộ**: ý chính nằm ở **câu cuối**, ở **chỗ đổi hướng** (yet, however, not… but…), hoặc trải cả đoạn.",
          "Ba bẫy band 7: tiêu đề **đúng một nửa** · tiêu đề **nói ngược** bằng chính chữ của bài · hai tiêu đề **gần nghĩa** cho phần mở và phần kết.",
          "Bài đọc ~870 từ, 8 đoạn, 11 tiêu đề (thừa 3) + 5 câu Sentence completion = 13 câu / 20 phút.",
          "Ngữ pháp bài 1 giúp gì: nhìn **thì** là biết đoạn đang kể chuyện cũ (had + V3, quá khứ đơn) hay nói về hiểu biết hôm nay (have + V3, hiện tại) — một manh mối để chọn tiêu đề.",
        ],
      },

      { t: "h", text: "1. Headings ở Passage 3 khác Passage 1–2 thế nào?" },
      {
        t: "table",
        head: ["", "Tập 2–3 (Passage 1–2)", "Tập 4 (Passage 3)"],
        rows: [
          ["Chữ trong tiêu đề", "Từ đồng nghĩa / đổi loại từ của câu chủ đề", "Chữ **trừu tượng**, gọi tên **chức năng** của đoạn: a challenge to…, grounds for doubting…"],
          ["Ý chính của đoạn", "Thường ở câu 1–2", "Hay ở **câu cuối**, sau chỗ **đổi hướng**, hoặc phải gộp cả đoạn"],
          ["Bẫy", "Chi tiết có thật trong đoạn", "Đúng một nửa · nói ngược · gần nghĩa với tiêu đề của đoạn khác"],
          ["Số tiêu đề thừa", "2–3", "3–4, và tiêu đề thừa **nghe rất hợp lý**"],
          ["Thời gian", "≈ 1 phút / đoạn", "≈ 1 phút 15 giây / đoạn — không hơn"],
        ],
      },
      {
        t: "p",
        text: "Nhắc lại **thang paraphrase 4 mức** (Tập 3 Ngày 1): ① từ đồng nghĩa (expensive → costly) · ② đổi loại từ (grow → growth) · ③ đổi cấu trúc (chủ động → bị động, khẳng định → phủ định kép) · ④ **ý ẩn** — đề nói ra điều mà bài chỉ **hàm ý**. Ở mức 4 bạn không thể “dò chữ”; phải **hiểu rồi tự nói lại**.",
      },
      {
        t: "table",
        caption: "Paraphrase mức 4 trong tiêu đề — bốn kiểu hay gặp",
        head: ["Kiểu", "Đoạn văn viết", "Tiêu đề nói"],
        rows: [
          ["**Gọi tên chức năng**", "Sceptics point out that… There is evidence that… A distinction may also need to be drawn…", "Grounds for doubting the optimistic account"],
          ["**Khái quát hoá ví dụ**", "leeches, opium, the threat of punishment… cowbells, atmospheric pressure…", "Many explanations but…"],
          ["**Rút kết luận từ câu cuối**", "The emotion had lost its medical stigma only to acquire a moral one.", "Freed from one kind of blame only to attract another"],
          ["**Ẩn dụ / hình ảnh**", "translate an ordinary sorrow into the language of medicine", "A new name for an old sorrow"],
        ],
      },

      { t: "h", text: "2. Tìm ý chính khi đoạn không có câu chủ đề lộ" },
      {
        t: "sodo",
        kind: "flow",
        title: "Headings Passage 3 — 6 bước",
        caption: "Bước 3 là bước band 6 hay bỏ: phải tự nói ý chính bằng lời mình TRƯỚC khi nhìn danh sách.",
        steps: [
          { label: "1 · Đọc danh sách tiêu đề (30 giây)", sub: "Gạch chân danh từ trừu tượng + chữ giới hạn: only, single, rather than, another" },
          { label: "2 · Đọc đoạn: câu đầu + câu cuối + chỗ đổi hướng", sub: "yet · however · not… but… · It was X, not Y, that…" },
          { label: "3 · Tự tóm đoạn bằng 5–7 chữ", sub: "Đoạn này LÀM gì? kể · giải thích · bác · so sánh · cảnh báo" },
          { label: "4 · Chọn tiêu đề khớp CẢ đoạn", sub: "Khớp nửa đoạn = bẫy" },
          { label: "5 · Kiểm chữ giới hạn", sub: "‘finally died out’ — bài có nói biến mất hẳn không?" },
          { label: "6 · Phân vân giữa hai tiêu đề ⇒ ghi cả hai, đi tiếp", sub: "Đoạn sau sẽ lấy mất một trong hai" },
        ],
      },
      {
        t: "table",
        caption: "Ý chính nằm ở đâu — bốn dáng đoạn của Passage 3",
        head: ["Dáng đoạn", "Dấu hiệu", "Ý chính ở"],
        rows: [
          ["**Đổi hướng**", "Mở bằng điều người ta tưởng → Yet / However / In fact", "**Sau** chữ đổi hướng"],
          ["**Dồn về cuối**", "Nhiều ví dụ, chi tiết → câu cuối khái quát", "**Câu cuối**"],
          ["**Hai nửa**", "Nửa đầu một ý, nửa sau một ý khác (also, a second…)", "Tiêu đề phải **phủ cả hai** (… and …)"],
          ["**Liệt kê lý lẽ**", "Sceptics point out… There is evidence… A distinction…", "Không câu nào; ý chính = **tên chung** của các lý lẽ"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba bẫy band 7 — và cách thử",
        items: [
          "**Đúng một nửa**: tiêu đề khớp 2–3 câu đầu nhưng đoạn còn rẽ sang ý khác. Thử: che nửa sau của đoạn — tiêu đề còn đúng không? Rồi che nửa đầu.",
          "**Nói ngược bằng chữ của bài**: bài viết “It did **not disappear** so much as change category”, tiêu đề bẫy viết “Why the condition finally **died out**”. Thấy tiêu đề dùng **đúng chữ** của đoạn ⇒ nghi ngờ trước.",
          "**Gần nghĩa mở – kết**: đoạn mở bài và đoạn kết thường nói cùng một luận điểm. Phân biệt: mở bài **nêu vấn đề / báo hướng đi**; kết bài **rút ra bài học / nhìn về sau**.",
          "**Chi tiết gây chú ý**: con số, tên riêng, chuyện lạ (chuông bò, đỉa) rất dễ nhớ nhưng hầu như **không bao giờ** là ý chính.",
        ],
      },
      {
        t: "rule",
        formula: "Ý chính = việc đoạn văn LÀM + về cái gì  →  tự tóm 5–7 chữ  →  mới nhìn danh sách",
        vi: "Tiêu đề đúng phải phủ CẢ đoạn và không mâu thuẫn với chữ giới hạn nào trong đoạn.",
      },

      { t: "h", text: "3. Khởi động — bốn đoạn ngắn, tiêu đề ý ẩn" },
      {
        t: "p",
        text: "Mỗi câu là một đoạn 3–4 câu. Chọn tiêu đề đúng nhất. Cả bốn phương án đều dùng ý **có trong đoạn** — chỉ một phương án là ý chính của **cả** đoạn.",
      },
      {
        t: "mcq",
        id: "t4d3-doc-khoi-dong",
        title: "Chọn tiêu đề đúng nhất (4 đoạn)",
        items: [
          {
            q: "1. “It is often assumed that the printing press made books cheap overnight. In fact, for several decades after its invention a printed Bible cost roughly what a skilled craftsman earned in a year. What changed first was not the price of a book but the number of identical copies in existence, and it was this that allowed scholars in different cities to argue about exactly the same text.”",
            options: ["The high price of early printed books", "A popular belief about affordability", "The real first effect of a new technology", "How scholars travelled between cities"],
            correct: 2,
            why: "Dáng ĐỔI HƯỚNG: ‘It is often assumed… In fact…’. Ý chính nằm sau ‘What changed first was not… but…’ = tác động đầu tiên thật sự. A và B chỉ khớp nửa đầu (đúng một nửa); D là chi tiết bị bóp méo.",
          },
          {
            q: "2. “Lighthouse keepers recorded the weather four times a day. Ships' officers noted wind and temperature in their logs. Farmers kept diaries of frosts and harvests. None of these people thought of themselves as scientists, yet their notebooks are now among the most valuable sources we have for reconstructing the climate of the last three centuries.”",
            options: ["Unintended contributions to research", "The daily routine of a lighthouse keeper", "Why old records are unreliable", "Three centuries of climate change"],
            correct: 0,
            why: "Dáng DỒN VỀ CUỐI: ba ví dụ → câu cuối khái quát ‘None… thought of themselves as scientists, yet their notebooks are… valuable sources’ = đóng góp ngoài ý định. Tiêu đề không dùng chữ nào của đoạn — paraphrase mức 4.",
          },
          {
            q: "3. “Supporters of the four-day week point to trials in which output did not fall. Most of those trials, however, involved office-based firms that volunteered to take part. Hospitals, factories and schools — where work cannot simply be compressed — were rarely included, and no trial has yet lasted longer than a year.”",
            options: ["Evidence in favour of shorter weeks", "Sectors that have adopted the four-day week", "A proposal for longer trials", "Weaknesses in the supporting evidence"],
            correct: 3,
            why: "Dáng LIỆT KÊ LÝ LẼ sau however: chỉ có công ty văn phòng, tự nguyện, không có bệnh viện / nhà máy, chưa quá một năm = các điểm yếu của bằng chứng. A chỉ khớp câu 1; B nói ngược (các ngành này KHÔNG tham gia); C không có trong đoạn.",
          },
          {
            q: "4. “When the first railways were planned, doctors warned that the human body could not survive speeds above thirty miles an hour. Similar fears greeted the bicycle, the telephone and, a century later, the home computer. In each case the alarm faded within a generation, only to reappear, in almost the same words, with the next invention.”",
            options: ["Medical objections to early railways", "A recurring pattern of anxiety", "Why inventions are eventually accepted", "The dangers of travelling at speed"],
            correct: 1,
            why: "Ý chính = điều LẶP LẠI qua bốn ví dụ: ‘Similar fears… In each case… only to reappear’ = một kiểu lo sợ tái diễn. A là chi tiết đầu; C khớp nửa (‘faded’) nhưng bỏ mất ‘reappear’; D lấy chữ của bài nhưng lệch ý.",
          },
        ],
      },

      { t: "h", text: "4. Bài đọc chính — 20 phút, Questions 1–13" },
      {
        t: "p",
        text: "Bài đọc soạn riêng cho khoá, khoảng **870 từ**, **8 đoạn A–H**, thể loại **nhân văn – tâm lý học**: lịch sử của một khái niệm. Văn bản kiểu này là “đặc sản” của Passage 3: ít số liệu, nhiều lập luận, câu dài. Bấm giờ **20 phút**: Questions 1–8 (≈ 11 phút), rồi 9–13 (≈ 7 phút), 2 phút soát.",
      },
      {
        t: "p",
        text: "**Questions 1–8.** Reading Passage has eight paragraphs, **A–H**. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, **i–xi**.",
      },
      {
        t: "table",
        caption: "List of Headings",
        head: ["Số", "Heading"],
        rows: [
          ["i", "A new name for an old sorrow"],
          ["ii", "The marketing of an invented emotion"],
          ["iii", "Many explanations but a single dependable cure"],
          ["iv", "Why the condition finally died out"],
          ["v", "An emotion whose reputation has been overturned"],
          ["vi", "Placed in a different category and directed at a different object"],
          ["vii", "Freed from one kind of blame only to attract another"],
          ["viii", "Grounds for doubting the optimistic account"],
          ["ix", "Laboratory tests of a long-held assumption"],
          ["x", "One unchanging feeling, a succession of verdicts"],
          ["xi", "The particular risks of living far from home"],
        ],
      },
      {
        t: "passage",
        title: "Homesick for the Past: The Changing Reputation of Nostalgia",
        intro: "Bài đọc tự soạn (~870 từ). Đọc danh sách tiêu đề trước khi đọc bài.",
        paras: [
          { label: "A", text: "Few emotions have had their reputation revised as thoroughly as nostalgia. Today the word suggests a pleasant, slightly sentimental fondness for the past — the feeling stirred by an old song or a school photograph. Yet for the first two centuries of its existence, the term described not a mood but a medical condition, and one considered serious enough to kill. Tracing how a supposed disease became, in the eyes of many psychologists, a source of strength tells us a good deal about nostalgia itself. It tells us rather more, perhaps, about how each age decides which feelings count as healthy." },
          { label: "B", text: "The word was coined in 1688 by Johannes Hofer, a Swiss medical student, who joined two Greek roots — nostos, the return home, and algos, pain — to label an illness he had observed among Swiss soldiers serving abroad. Sufferers lost their appetite, slept badly and thought obsessively of home; some, it was said, simply wasted away. Hofer was not describing anything new. Homesickness had been familiar for as long as people had travelled. What he had done was to translate an ordinary sorrow into the language of medicine, and once it possessed a learned name it could be diagnosed, recorded and treated like any other complaint." },
          { label: "C", text: "For the next hundred and fifty years, army doctors took the condition entirely seriously. Their accounts of its origin varied with medical fashion: some physicians blamed the change in atmospheric pressure experienced by mountain-dwellers who descended to the plains, others the constant clanging of cowbells during childhood, which was thought to have damaged the brain. The treatments proposed were equally inventive, ranging from leeches and opium to the threat of punishment. On one remedy, however, nearly everyone agreed, and it was the simplest. A soldier who was promised leave, or actually sent home, generally recovered on the road — a fact that might have prompted doubts about whether the fault lay in the body at all." },
          { label: "D", text: "Those doubts eventually prevailed. By the end of the nineteenth century, nostalgia had largely vanished from medical textbooks, since doctors had failed to find any physical cause. It did not disappear so much as move. Psychiatrists of the early twentieth century reclassified it as a disorder of the mind — a form of melancholy, a refusal to grow up, a failure to adapt to new surroundings — and regarded immigrants and students living away from their families as especially vulnerable. Meanwhile, what sufferers were thought to long for had quietly shifted. Hofer's patients had yearned for a place to which they could, in principle, return; the modern nostalgic yearned for a time, and no journey leads there." },
          { label: "E", text: "It was commerce, not science, that first treated this longing as something other than a problem. From the middle of the twentieth century, advertisers discovered that goods associated with a customer's youth sold remarkably well, and a profitable trade in revived fashions, re-released music and “traditional” recipes followed. Critics were unimpressed. To many commentators, nostalgia now seemed less an illness than a kind of dishonesty: a sweetened version of history from which hardship had been edited out, and which could be used to sell a political programme as easily as a packet of biscuits. The emotion had shed its medical stigma only to acquire a moral one." },
          { label: "F", text: "Its rehabilitation began around the turn of the present century, when a group of social psychologists in Britain started to investigate nostalgia experimentally instead of taking its effects for granted. Volunteers were asked to recall either a nostalgic event or an ordinary one and then to complete a series of questionnaires. The findings have been repeated many times since. People who have just revisited a cherished memory tend to report feeling closer to others, more optimistic and more convinced that their lives have meaning. Intriguingly, the feeling appears to arise most often not in moments of contentment but in response to loneliness, cold or bad news — which suggests that it works as a remedy rather than a symptom." },
          { label: "G", text: "Not everyone has been persuaded. Sceptics point out that most of these studies measure mood a few minutes after a memory has been prompted, and reveal little about people who dwell on the past habitually. There is evidence that, for individuals already prone to depression, setting a glowing past beside a disappointing present can deepen unhappiness rather than relieve it. A distinction may also need to be drawn between personal nostalgia, which draws on events one actually lived through, and the collective kind, in which whole communities long for an era that few of their members experienced and that may never have existed in the form remembered." },
          { label: "H", text: "What the history of nostalgia shows most clearly, then, is that the feeling itself has probably altered far less than the judgements passed upon it. Soldiers in the seventeenth century and office workers in the twenty-first are recognisably moved by the same thing: the sense that something valued lies out of reach. Whether that sense is called a disease, a weakness, a sales opportunity or a psychological resource has depended on who was doing the describing, and why. It would be unwise to assume that the present verdict, however well supported, will be the last." },
        ],
      },
      {
        t: "quiz",
        id: "t4d3-doc-tieu-de",
        title: "Questions 1–8 — ghi số La Mã (i–xi)",
        kind: "fill",
        items: [
          { q: "1. Paragraph A ___", answers: ["v"] },
          { q: "2. Paragraph B ___", answers: ["i"] },
          { q: "3. Paragraph C ___", answers: ["iii"] },
          { q: "4. Paragraph D ___", answers: ["vi"] },
          { q: "5. Paragraph E ___", answers: ["vii"] },
          { q: "6. Paragraph F ___", answers: ["ix"] },
          { q: "7. Paragraph G ___", answers: ["viii"] },
          { q: "8. Paragraph H ___", answers: ["x"] },
        ],
      },
      {
        t: "p",
        text: "**Questions 9–13.** Complete the sentences below. Choose **ONE WORD ONLY** from the passage for each answer.",
      },
      {
        t: "quiz",
        id: "t4d3-doc-hoan-thanh",
        title: "Questions 9–13 — Sentence completion (ONE WORD ONLY)",
        kind: "fill",
        items: [
          { q: "9. Hofer created the term by combining two word roots taken from ___.", answers: ["Greek"] },
          { q: "10. According to one early theory, the brains of sufferers had been harmed by the sound of ___.", answers: ["cowbells"] },
          { q: "11. Early twentieth-century psychiatrists thought that students and ___ were particularly at risk.", answers: ["immigrants"] },
          { q: "12. After recalling a memory, participants in the British experiments filled in a number of ___.", answers: ["questionnaires"] },
          { q: "13. Critics say the experiments tell us little about those who think about the past ___.", answers: ["habitually"] },
        ],
      },

      { t: "h", text: "5. Giải thích Questions 1–8 — ý chính ở đâu, paraphrase kiểu gì, bẫy nào" },
      {
        t: "note",
        title: "Giải thích 1–4 (đoạn A–D)",
        items: [
          "**A — v** (An emotion whose reputation has been overturned). Câu 1: “Few emotions have had their **reputation revised** as thoroughly…”; cả đoạn dựng thế đối lập **xưa là bệnh chết người → nay là nguồn sức mạnh**. overturned = revised thoroughly (mức 1–2). Bẫy **x**: cũng nói về “đánh giá thay đổi”, nhưng x khẳng định cảm xúc **không đổi** (one unchanging feeling) — ý đó chỉ xuất hiện ở đoạn **H**. Đoạn mở **nêu vấn đề**, đoạn kết **rút bài học**.",
          "**B — i** (A new name for an old sorrow). Dáng **đổi hướng** ở giữa đoạn: “Hofer was **not describing anything new**. Homesickness **had been familiar**… What he had done was to **translate an ordinary sorrow into the language of medicine**… a **learned name**”. old sorrow = ordinary sorrow / homesickness; new name = the word was coined / a learned name. Để ý **had been familiar** (QKHT — bài 1 mục 6): tác giả nhìn lùi về trước 1688 để nói “cái này có từ trước rồi”.",
          "**C — iii** (Many explanations but a single dependable cure). Đoạn **hai nửa** nối bằng however: nửa đầu = nhiều cách giải thích + nhiều cách chữa (atmospheric pressure, cowbells; leeches, opium) → nửa sau “**On one remedy**, however, **nearly everyone agreed**… generally recovered”. Tiêu đề **khái quát hoá** các ví dụ: Many explanations; single dependable cure = one remedy… generally recovered. Paraphrase mức 4: tiêu đề không nêu ví dụ nào.",
          "**D — vi** (Placed in a different category and directed at a different object). Lại là đoạn **hai nửa**: ① “**reclassified** it as a disorder of the mind” = placed in a different category; ② “what sufferers were thought to long for had quietly **shifted**… a place → a time” = directed at a different object. Bẫy **iv** (Why the condition finally died out) = bẫy **nói ngược**: bài viết “had largely vanished from medical textbooks” nhưng liền sau “It did **not disappear so much as move**”. Bẫy **xi** (risks of living far from home): “immigrants and students living away” chỉ là **một** chi tiết trong **một** câu.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 5–8 (đoạn E–H)",
        items: [
          "**E — vii** (Freed from one kind of blame only to attract another). Ý chính **dồn về câu cuối**: “The emotion had **shed its medical stigma only to acquire a moral one**.” stigma = blame; shed = freed from; acquire = attract. Bẫy **ii** (The marketing of an invented emotion) = **đúng một nửa + sai một chữ**: có marketing (advertisers), nhưng cảm xúc **không** do quảng cáo “phát minh” ra — bài nói nó có từ thế kỷ 17; và nửa sau của đoạn (critics, dishonesty) bị bỏ mất.",
          "**F — ix** (Laboratory tests of a long-held assumption). “started to **investigate nostalgia experimentally instead of taking its effects for granted**” — experimentally = laboratory tests; taking for granted = a long-held assumption (giả định rằng nostalgia có hại). Phần còn lại là thiết kế và kết quả thí nghiệm. Để ý thì: “The findings **have been repeated**… People… **tend to** report” — HTHT + hiện tại = hiểu biết còn giá trị (bài 1 mục 4).",
          "**G — viii** (Grounds for doubting the optimistic account). Dáng **liệt kê lý lẽ**: “Not everyone has been persuaded. Sceptics point out… There is evidence that… A distinction may also need to be drawn…” — ba lý do nghi ngờ. grounds = reasons; the optimistic account = kết quả tích cực ở đoạn F. Tiêu đề không dùng chữ nào của đoạn.",
          "**H — x** (One unchanging feeling, a succession of verdicts). “the feeling itself has probably **altered far less than the judgements** passed upon it… **the same thing**… a disease, a weakness, a sales opportunity or a psychological resource… the present **verdict**” — unchanging = altered far less / the same thing; a succession of verdicts = bốn cách gọi nối tiếp nhau.",
          "Ba tiêu đề thừa: **ii**, **iv**, **xi** — cả ba dùng **chữ có thật trong bài** (advertisers, vanished, living away from their families). Ở Passage 3, tiêu đề lặp chữ của bài đáng ngờ hơn tiêu đề không lặp chữ nào.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 9–13 — câu chứa đáp án và kiểu paraphrase",
        items: [
          "**9 — Greek** (đoạn B): “joined two **Greek** roots — nostos… and algos” ↔ combining two word roots taken from… (joined → combining: mức 1).",
          "**10 — cowbells** (đoạn C): “the constant clanging of **cowbells** during childhood, which was thought to have damaged the brain” ↔ brains… had been harmed by the sound of… (clanging → sound; damaged → harmed; chủ động ↔ bị động: mức 3). Bẫy: **pressure** cũng là một “theory” nhưng không liên quan tới brain / sound.",
          "**11 — immigrants** (đoạn D): “regarded **immigrants** and students living away from their families as especially vulnerable” ↔ particularly at risk (vulnerable → at risk: mức 1–2).",
          "**12 — questionnaires** (đoạn F): “to complete a series of **questionnaires**” ↔ filled in a number of… (complete → filled in; a series of → a number of).",
          "**13 — habitually** (đoạn G): “reveal little about people who dwell on the past **habitually**” ↔ tell us little about those who think about the past… (dwell on → think about; reveal → tell). Phải là trạng từ — vị trí sau động từ + tân ngữ.",
        ],
      },
      {
        t: "table",
        caption: "Sổ paraphrase của bài — chép 6 dòng bạn thấy khó nhất vào sổ",
        head: ["Trong bài", "Trong đề", "Mức"],
        rows: [
          ["reputation revised thoroughly", "reputation has been overturned", "1 — đồng nghĩa"],
          ["translate an ordinary sorrow into the language of medicine", "a new name for an old sorrow", "4 — hình ảnh → ý"],
          ["On one remedy… nearly everyone agreed", "a single dependable cure", "2–3 — đổi cấu trúc"],
          ["reclassified it as a disorder of the mind", "placed in a different category", "2 — đổi loại từ"],
          ["shed its medical stigma only to acquire a moral one", "freed from one kind of blame only to attract another", "1 + 4"],
          ["instead of taking its effects for granted", "a long-held assumption", "4 — ý ẩn"],
          ["Sceptics point out… There is evidence… A distinction…", "grounds for doubting", "4 — gọi tên chức năng"],
          ["altered far less than the judgements passed upon it", "one unchanging feeling, a succession of verdicts", "3–4"],
        ],
      },

      { t: "h", text: "6. Ngữ pháp bài 1 trong bài đọc — thì kể chuyện và thì nghiên cứu" },
      {
        t: "p",
        text: "Bài đọc đi qua bốn thế kỷ nên tác giả **đổi thì có chủ ý**. Điền dạng đúng của động từ — tất cả lấy từ bài (đừng nhìn lại bài cho tới khi làm xong).",
      },
      {
        t: "quiz",
        id: "t4d3-doc-thi",
        kind: "fill",
        title: "Chia động từ trong ngoặc — câu lấy từ bài đọc (6 câu)",
        items: [
          { q: "1. Few emotions ___ (have) their reputation revised as thoroughly as nostalgia.", answers: ["have had"], hint: "tính tới nay" },
          { q: "2. Hofer wanted to label an illness he ___ (observe) among Swiss soldiers.", answers: ["had observed"], hint: "quan sát trước, đặt tên sau" },
          { q: "3. Homesickness ___ (be) familiar for as long as people had travelled.", answers: ["had been"] },
          { q: "4. By the end of the nineteenth century, nostalgia ___ largely ___ (vanish) from medical textbooks.", answers: ["had vanished", "had largely vanished"], hint: "By + mốc quá khứ" },
          { q: "5. The findings ___ (repeat — bị động) many times since.", answers: ["have been repeated"], hint: "since → tới nay; bị động" },
          { q: "6. Not everyone ___ (persuade — bị động).", answers: ["has been persuaded"], hint: "everyone → số ít" },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "coin (a word)", pos: "v", ipa: "/kɔɪn/", vi: "đặt ra (một từ mới)", ex: "The term was coined by a Swiss student in 1688.", exVi: "Thuật ngữ này do một sinh viên Thuỵ Sĩ đặt ra năm 1688.", more: "coin a term / a phrase · bị động rất hay gặp: **was coined by**" },
          { w: "stigma", pos: "n", ipa: "/ˈstɪɡmə/", vi: "sự kỳ thị, tiếng xấu gắn với điều gì", ex: "There is still a stigma attached to mental illness.", exVi: "Vẫn còn sự kỳ thị gắn với bệnh tâm thần.", more: "a social stigma · **carry / shed** a stigma · stigma **attached to** N" },
          { w: "reclassify", pos: "v", ipa: "/ˌriːˈklæsɪfaɪ/", vi: "xếp lại vào loại khác", ex: "The planet was reclassified as a dwarf planet in 2006.", exVi: "Hành tinh này được xếp lại thành hành tinh lùn năm 2006.", more: "reclassify N **as** N · họ từ: classify → classification → reclassify" },
          { w: "vulnerable", pos: "adj", ipa: "/ˈvʌlnərəbl/", vi: "dễ bị tổn thương, dễ bị ảnh hưởng", ex: "Young children are especially vulnerable to air pollution.", exVi: "Trẻ nhỏ đặc biệt dễ bị ô nhiễm không khí ảnh hưởng.", more: "vulnerable **to** N · the most vulnerable groups · n: vulnerability" },
          { w: "yearn", pos: "v", ipa: "/jɜːn/", vi: "khao khát, mong mỏi (văn viết)", ex: "Many city dwellers yearn for a quieter life.", exVi: "Nhiều người thành phố khao khát một cuộc sống yên tĩnh hơn.", more: "yearn **for** N / yearn **to** V · gần nghĩa: long for · âm /ɜː/ của hôm nay" },
          { w: "rehabilitation", pos: "n", ipa: "/ˌriːəˌbɪlɪˈteɪʃn/", vi: "sự phục hồi (sức khoẻ, danh tiếng)", ex: "The rehabilitation of his reputation took decades.", exVi: "Việc phục hồi danh tiếng của ông mất hàng thập kỷ.", more: "v: rehabilitate · drug rehabilitation (cai nghiện) · the rehabilitation of offenders" },
          { w: "sceptic", pos: "n", ipa: "/ˈskeptɪk/", vi: "người hoài nghi", ex: "Sceptics argue that the results cannot be generalised.", exVi: "Những người hoài nghi cho rằng kết quả không thể khái quát hoá.", more: "adj: sceptical **about / of** · n: scepticism · Mỹ viết skeptic" },
          { w: "prone to", pos: "adj", ipa: "/prəʊn tuː/", vi: "dễ mắc, dễ bị (điều xấu)", ex: "People who sleep badly are more prone to anxiety.", exVi: "Người ngủ kém dễ bị lo âu hơn.", more: "be prone **to** N / **to** V · accident-prone · chỉ dùng cho điều tiêu cực" },
          { w: "dwell on", pos: "phr v", ipa: "/dwel ɒn/", vi: "cứ nghĩ mãi về (thường là điều buồn)", ex: "There is no point in dwelling on past mistakes.", exVi: "Cứ nghĩ mãi về lỗi lầm cũ chẳng ích gì.", more: "dwell on the past / on a problem · dwelt hoặc dwelled" },
          { w: "verdict", pos: "n", ipa: "/ˈvɜːdɪkt/", vi: "phán quyết; nhận định cuối cùng", ex: "The critics' verdict on the film was mixed.", exVi: "Nhận định của giới phê bình về bộ phim là khen chê lẫn lộn.", more: "reach / deliver a verdict · the verdict **on** N · âm /ɜː/ của hôm nay" },
        ],
      },
      {
        t: "note",
        title: "💡 Nhìn lại cả bài — rút kinh nghiệm",
        items: [
          "Đúng **7–8/8** phần headings và **4–5/5** phần điền: bạn đang ở mức Passage 3 ≥ 9/13. Đúng **5–6/8**: xem lại bạn sai vì **bẫy nào** trong ba bẫy ở mục 2 và ghi vào sổ lỗi.",
          "Nếu bạn chọn **x** cho đoạn A hoặc **v** cho đoạn H: đó là bẫy **gần nghĩa mở – kết**. Lần sau, làm đoạn giữa trước, để hai đoạn đầu – cuối lại sau cùng.",
          "Nếu bạn chọn **iv** cho đoạn D: bạn đã dừng đọc ở “vanished”. Ở Passage 3, **đọc hết câu kế tiếp** sau một chữ mạnh — tác giả hay rút lại ngay.",
          "Thời gian: headings quá 12 phút ⇒ bạn đang đọc kỹ từng chữ. Tập lại bước 2: **câu đầu + câu cuối + chỗ đổi hướng**.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d3-noi",
    kind: "speaking",
    title: "Nói: Part 3 band 7 — quá khứ, hiện tại, tương lai; discourse markers linh hoạt",
    goal: "Trả lời câu hỏi Part 3 kiểu “How has … changed? / Will this continue?” trong 40–60 giây theo ba chặng xưa – nay – sắp tới, chuyển thì đúng, dùng discourse markers đa dạng đúng chức năng (không lặp I think / Moreover), và so sánh hai nhóm cùng thời ở mức band 7 — đẩy FC và GRA.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Part 3 band 7 không hỏi về bạn mà hỏi về **xã hội theo thời gian**: How has X changed? · Is X different from the past? · What will X be like in the future? Một câu trả lời tốt đi qua ==ba chặng: XƯA → NAY → SẮP TỚI==.",
          "Ba chặng = ba nhóm thì. XƯA: **used to / would / quá khứ đơn**. NAY: **hiện tại + hiện tại hoàn thành** (has become, has changed — đúng bài 1 hôm nay). SẮP TỚI: **dự đoán có mức độ** (I'd imagine…, is likely to…, may well…).",
          "**Discourse markers** = những cụm “dẫn đường” khi nói (Well, · Having said that, · As for…). Band 6: có nhưng lặp và máy móc. Band 7: ==đa dạng, đúng chức năng, nghe tự nhiên== — đây là mô tả chính thức của tiêu chí **FC**.",
          "Nâng dạng **so sánh hai nhóm cùng thời** (đã nhập ở Tập 2 Ngày 21: The main difference is that A…, whereas B…) lên band 7: nói có mức độ, thêm lý do, thêm xu hướng “khoảng cách đang hẹp lại”.",
          "🔊 Phát âm: **/ɜː/** (work, world, prefer, research) và **/ə/** (about, ago, generation) — hai âm xuất hiện trong gần như mọi câu nói về thời gian.",
        ],
      },

      { t: "h", text: "1. Band 6 và band 7 khác nhau ở đâu trong Part 3?" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**FC**", "Sẵn lòng nói dài nhưng thỉnh thoảng mất mạch; từ nối có nhưng **không luôn đúng**", "Nói dài **không gắng sức**; chỉ ngắt để tìm ý; discourse markers **linh hoạt**"],
          ["**LR**", "Đủ từ để bàn; paraphrase được", "Có **từ ít gặp / cụm tự nhiên** (a job for life, raise an eyebrow), ý thức văn phong"],
          ["**GRA**", "Trộn đơn + phức; lỗi ở câu phức", "Nhiều cấu trúc phức; **thường không lỗi**; đổi thì đúng"],
          ["**P**", "Dễ hiểu, kiểm soát lẫn lộn", "Nhấn từ mang nghĩa, âm yếu /ə/, nối âm khá đều"],
          ["Độ dài", "20–35 giây, 3–5 câu", "40–60 giây, 6–9 câu, có **chốt**"],
        ],
      },
      {
        t: "note",
        title: "📌 Sáu kiểu câu hỏi “theo thời gian” của Part 3",
        items: [
          "**How has** (shopping / family life / education) **changed** in recent decades? → mở bằng **has changed / has become**.",
          "**Is** X **different from** what it was when your parents were young? → Xưa (used to) ↔ Nay.",
          "**Do you think** people **were** happier in the past? → so sánh + ý kiến có mức độ.",
          "**What will** X **be like** in twenty years' time? → dự đoán có mức độ.",
          "**Do you think** this trend **will continue**? → Nay → Sắp tới + lý do.",
          "**Why has** X **become** so popular? → xu hướng (HTHT) + nguyên nhân.",
        ],
      },

      { t: "h", text: "2. Khung ba chặng: XƯA → NAY → SẮP TỚI" },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung 5 bước (40–60 giây)",
        caption: "Câu hỏi chỉ hỏi xưa – nay thì bước 4 rút còn một câu hoặc bỏ. Câu hỏi về tương lai thì bước 2 rút còn một câu.",
        steps: [
          { label: "1 · Mở + nhận định chung", sub: "Well, it's changed enormously, I'd say." },
          { label: "2 · XƯA", sub: "If you go back a generation, people used to / would…" },
          { label: "3 · NAY (+ lý do / ví dụ)", sub: "These days… has become… largely because…" },
          { label: "4 · SẮP TỚI (có mức độ)", sub: "As for the future, I'd imagine… may well…" },
          { label: "5 · Chốt", sub: "So, all in all, …" },
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "XƯA: If you go back a generation / Back in my parents' day, S + used to + V / would + V",
            vi: "used to = từng (thói quen hoặc trạng thái, nay hết). would = thói quen lặp lại ngày xưa (không dùng cho trạng thái). Ôn Tập 2 Ngày 21.",
            examples: [
              { en: "Back in my grandparents' day, families would eat together every single evening.", vi: "Thời ông bà tôi, các gia đình tối nào cũng ăn cùng nhau." },
              { en: "A generation ago, a university degree used to guarantee a decent job.", vi: "Một thế hệ trước, tấm bằng đại học từng bảo đảm một công việc tử tế." },
            ],
          },
          {
            formula: "NAY: These days / Nowadays, S + V(s) · S + have / has + become / changed / grown …",
            vi: "Hiện tại đơn cho thực trạng; HTHT cho thay đổi kéo tới nay (bài 1 mục 2).",
            examples: [
              { en: "These days it's quite normal for both parents to work full-time.", vi: "Ngày nay cả bố lẫn mẹ đi làm toàn thời gian là chuyện khá bình thường." },
              { en: "Online shopping has become second nature to people my age.", vi: "Mua sắm trực tuyến đã thành thói quen tự nhiên với người ở tuổi tôi." },
            ],
          },
          {
            formula: "SẮP TỚI: I'd imagine / I suspect + S + will … · S + is / are likely to + V · S + may well + V",
            vi: "Dự đoán có mức độ — không nói chắc nịch “will definitely”. (Học kỹ hedging ở Ngày 7.)",
            examples: [
              { en: "I'd imagine most routine office work will be automated within a couple of decades.", vi: "Tôi hình dung phần lớn việc văn phòng lặp lại sẽ được tự động hoá trong vài thập kỷ." },
              { en: "Small local shops may well disappear from city centres altogether.", vi: "Các cửa hàng nhỏ rất có thể sẽ biến mất hẳn khỏi trung tâm thành phố." },
            ],
          },
          {
            formula: "CHUYỂN CHẶNG: Whereas in the past …, now … · Compared with ten years ago, … · As for the future, …",
            vi: "Cụm báo cho giám khảo biết bạn đang đổi chặng thời gian.",
            examples: [
              { en: "Whereas in the past people saved up for years, now they simply borrow.", vi: "Nếu ngày xưa người ta dành dụm nhiều năm thì nay họ đơn giản là vay." },
              { en: "Compared with even ten years ago, people are far more open about mental health.", vi: "So với chỉ mười năm trước, người ta cởi mở hơn nhiều về sức khoẻ tinh thần." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi nói ba chặng",
        items: [
          "**Kẹt ở hiện tại đơn**: ~~In the past, people work on farms.~~ → people **worked / used to work** on farms. Khi nói, lỗi này rất dễ lọt vì tiếng Việt không chia.",
          "~~It changed a lot.~~ (không mốc, kết quả còn tới nay) → It **has changed** a lot. / It**'s changed** a lot.",
          "~~people are used to work~~ ✗. **used to + V** (từng) ≠ **be used to + V-ing** (quen với): People **used to work** on farms. / People **are used to working** from home now.",
          "**would** cho trạng thái ✗: ~~My family would live in the countryside.~~ → My family **used to live** in the countryside. (would chỉ cho hành động lặp lại: we **would walk** to school.)",
          "Dự đoán quá chắc: ~~In the future everyone will work at home.~~ → **I'd imagine many** people will… / …**is likely to** become the norm.",
        ],
      },
      {
        t: "rule",
        formula: "Well, + has changed … → Back then, S + used to / would + V → These days, S + V(s) / has become … → As for the future, I'd imagine … → So, all in all, …",
        vi: "Ba chặng, ba nhóm thì, mỗi chặng có một cụm báo hiệu. Chặng nào đề không hỏi thì nói một câu.",
      },

      { t: "h", text: "3. Discourse markers linh hoạt — đúng chức năng, không lặp" },
      {
        t: "p",
        text: "**Discourse marker** (từ dẫn mạch) là cụm không thêm thông tin nhưng báo cho người nghe biết **câu sắp tới làm gì**: mở ý, thêm ý, rẽ hướng, làm rõ, chốt. Band 6 thường có ba thói quen xấu: mở mọi câu bằng **I think**, dùng từ nối **của bài viết** khi nói (Moreover, Furthermore, In conclusion), và dùng một cụm ba bốn lần. Band 7 có **mỗi chức năng 2–3 lựa chọn** và đổi qua lại.",
      },
      {
        t: "table",
        caption: "Ngân hàng discourse markers — mỗi chức năng học 2 cụm cho chắc",
        head: ["Chức năng", "Cụm band 7 (văn nói)", "Tránh"],
        rows: [
          ["**Mở câu trả lời**", "Well, I'd say… · I suppose… · That's a tricky one, but… · It's hard to generalise, but…", "I think… (lặp mỗi câu)"],
          ["**Thêm ý**", "On top of that, … · What's more, … · Not only that, but… · And another thing is…", "Moreover, · Furthermore, · In addition, (văn viết)"],
          ["**Rẽ hướng / nhượng bộ**", "Having said that, … · That said, … · Mind you, … · Then again, … · At the same time, …", "But… but… but…"],
          ["**Làm rõ / nói lại**", "What I mean is… · In other words, … · Put it this way: … · To be more precise, …", "(im lặng, hoặc lặp nguyên câu)"],
          ["**Đưa ví dụ**", "Take … for instance. · A good example would be… · You only have to look at…", "For example, (lặp)"],
          ["**Đổi chặng thời gian**", "If you go back a generation, … · These days… · As for the future, … · Looking ahead, …", "In the past… Now… In the future… (ba lần y một khuôn)"],
          ["**Câu giờ có nội dung**", "Let me think… · I've never really thought about it, but… · How shall I put it…", "Ờ… / er… kéo dài"],
          ["**Chốt**", "So, all in all, … · So yes, on balance… · I guess what I'm saying is…", "In conclusion, · To sum up, (văn viết) · “…and yeah.”"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một ý — khi VIẾT và khi NÓI",
        cols: [
          { title: "Task 2 (viết)", items: ["Moreover, / Furthermore,", "However, / Nevertheless,", "For instance,", "In conclusion,", "It is widely believed that…"] },
          { title: "Part 3 (nói)", items: ["On top of that, / What's more,", "Having said that, / Then again,", "Take … for instance.", "So, all in all,", "A lot of people seem to think…"] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Dùng discourse markers sao cho không bị trừ điểm",
        items: [
          "**Đúng chức năng**: “Having said that” phải dẫn tới ý **ngược lại** một phần. Nói “Having said that” rồi thêm một ý cùng chiều ⇒ giám khảo ghi “markers not always appropriate” (band 6).",
          "**Không rải dày**: một câu trả lời 50 giây cần **3–4** cụm (mở · một lần rẽ hoặc thêm · chốt). Mỗi câu một cụm nghe như học thuộc.",
          "**Mind you / Then again** là văn nói thân mật — hợp Part 3, **không** đưa vào bài viết.",
          "**Actually** không có nghĩa là “hiện nay” (đó là currently / at the moment). Actually = thật ra (sửa lại điều người ta tưởng).",
          "Sau **As for…** là danh từ rồi dấu phẩy: **As for the future,** I'd imagine… (không phải ~~As for I think~~).",
        ],
      },
      {
        t: "rule",
        formula: "mở (Well, I'd say…) + rẽ / thêm (Having said that, … / On top of that, …) + chốt (So, all in all, …)",
        vi: "Mỗi câu trả lời Part 3: 3–4 discourse markers, mỗi cụm một chức năng, không lặp cụm của câu trả lời trước.",
      },

      { t: "h", text: "4. Mẫu band 6 và band 7 — cùng một câu hỏi" },
      {
        t: "p",
        text: "Câu hỏi: **“How has the way people work changed in your country over the last few decades?”** Nghe / đọc câu trả lời band 6 trước. Nó **không sai nhiều** — hãy tự tìm vì sao chưa phải band 7, rồi mới xem bản band 7 và bảng so sánh.",
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — 71 từ, khoảng 30 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "How has the way people work changed in your country over the last few decades?", vi: "Cách người ta làm việc ở nước bạn đã thay đổi thế nào trong vài thập kỷ qua?" },
          { who: "Candidate", role: "candidate", text: "I think work changed a lot. In the past, most people worked on farms or in factories, and they stayed in one job for their whole life. Now many people work in offices and they use computers every day. Also, young people change jobs more often than before. In the future, I think more people will work at home because of the internet. So yes, I think it changed a lot.", vi: "Tôi nghĩ công việc đã thay đổi nhiều. Ngày xưa, đa số làm ở nông trại hay nhà máy, và họ ở một công việc cả đời. Bây giờ nhiều người làm văn phòng và dùng máy tính mỗi ngày. Ngoài ra, người trẻ đổi việc thường xuyên hơn trước. Trong tương lai, tôi nghĩ nhiều người hơn sẽ làm ở nhà nhờ internet. Nên vâng, tôi nghĩ nó đã thay đổi nhiều." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 7 – 7.5 (ước tính) — 141 từ, khoảng 55 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "How has the way people work changed in your country over the last few decades?", vi: "Cách người ta làm việc ở nước bạn đã thay đổi thế nào trong vài thập kỷ qua?" },
          { who: "Candidate", role: "candidate", text: "Well, it's changed almost beyond recognition, I'd say. If you go back a generation, to when my parents were starting out, most people would join a state company or work the land, and they'd stay put until they retired — a job was basically for life. These days it's a completely different picture. The service sector has expanded enormously, and people my age tend to switch jobs every two or three years without anyone raising an eyebrow. Having said that, the security my parents took for granted has largely disappeared. As for where it's all heading, I'd imagine remote work will become even more common, although I doubt offices will vanish altogether, because people still need to meet face to face. So, all in all, there's a lot more freedom than there used to be, but a good deal less certainty.", vi: "À, tôi cho là nó đã thay đổi gần như không nhận ra nổi. Nếu lùi lại một thế hệ, lúc bố mẹ tôi mới đi làm, đa số sẽ vào một công ty nhà nước hoặc làm ruộng, và họ ở yên đó tới lúc nghỉ hưu — một công việc về cơ bản là cho cả đời. Ngày nay thì bức tranh hoàn toàn khác. Khu vực dịch vụ đã mở rộng rất mạnh, và người ở tuổi tôi thường đổi việc hai ba năm một lần mà chẳng ai ngạc nhiên. Nói vậy chứ, sự ổn định mà bố mẹ tôi coi là đương nhiên phần lớn đã biến mất. Còn về hướng đi sắp tới, tôi hình dung làm việc từ xa sẽ còn phổ biến hơn, dù tôi không nghĩ văn phòng sẽ biến mất hẳn, vì người ta vẫn cần gặp mặt trực tiếp. Vậy nên, nhìn chung, tự do hơn xưa nhiều, nhưng kém chắc chắn hơn hẳn." },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu — bốn tiêu chí Speaking",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**FC** — mạch và từ dẫn", "I think × 3; In the past · Now · Also · In the future — đúng nhưng **một khuôn**; chốt lặp lại câu mở", "Well, … I'd say · If you go back a generation · These days · **Having said that** · **As for where it's all heading** · **So, all in all** — sáu cụm, sáu chức năng; chốt **nói ý mới** (freedom vs certainty)"],
          ["**LR** — từ vựng", "changed a lot × 2 · work in offices · use computers — đúng, an toàn, không cụm nào đáng nhớ", "beyond recognition · starting out · work the land · stay put · a job for life · raise an eyebrow · took for granted · vanish altogether"],
          ["**GRA** — ngữ pháp", "~~work changed~~ / ~~it changed~~ (cần has changed); toàn câu đơn nối and; một câu so sánh", "**it's changed** (HTHT) → **would join / they'd stay** (thói quen xưa) → **has expanded** / **tend to** → **I'd imagine… will** / **I doubt… will**; mệnh đề quan hệ lược that (the security [that] my parents took for granted); **than there used to be**"],
          ["**P** — phát âm", "Nhấn đều mọi từ; “worked” dễ thành hai âm tiết", "Nhấn từ mang nghĩa (**recognition**, **life**, **enormously**, **certainty**); âm yếu (to /tə/, a /ə/, than /ðən/); rút gọn it's · they'd · I'd"],
          ["Nội dung", "Ba chặng, mỗi chặng **một sự thật**", "Ba chặng + **một nhận xét ngược chiều** (mất sự ổn định) + dự đoán **có giới hạn** (offices won't vanish)"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: bốn bước nâng câu trả lời band 6 của chính bạn",
        items: [
          "**Sửa thì trước**: mọi “it changed / it became” không có mốc ⇒ **it's changed / it's become**.",
          "**Đổi một “I think” thành nhận định có mức độ**: I'd say… · I'd imagine… · I doubt…",
          "**Thêm đúng một lần rẽ**: Having said that, … — một mặt trái, một ngoại lệ, một giới hạn.",
          "**Chốt bằng ý mới**, không lặp câu mở: So, all in all, more X, but less Y.",
        ],
      },

      { t: "h", text: "5. So sánh hai nhóm CÙNG THỜI ở band 7 (nâng Tập 2 Ngày 21)" },
      {
        t: "p",
        text: "Tập 2 Ngày 21 đã dạy khung 4 bước: **The main difference is that A…, whereas B… This is probably because… So in short…** — đủ cho band 5.5–6. Ở band 7, giám khảo chờ ba thứ thêm: ① nói **có mức độ** (không phải mọi người trẻ đều giống nhau), ② **lý do** đằng sau khác biệt, ③ nối với **thời gian**: khoảng cách đang rộng ra hay hẹp lại — và thế là bạn dùng luôn khung ba chặng ở mục 2.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "The most striking difference is (probably) that A tend to + V, whereas B are more inclined to + V",
            vi: "Nêu khác biệt chính — tend to / be inclined to giữ cho câu không tuyệt đối.",
            examples: [
              { en: "The most striking difference is probably that younger people tend to treat their phone as their main screen, whereas older people are more inclined to see it as just a phone.", vi: "Khác biệt nổi bật nhất có lẽ là người trẻ thường coi điện thoại là màn hình chính, trong khi người lớn tuổi có xu hướng coi nó chỉ là cái điện thoại." },
            ],
          },
          {
            formula: "A are far more likely to + V than B · B, by contrast, + V · When it comes to N, A …",
            vi: "Ba cách nối hai vế ngoài whereas / while.",
            examples: [
              { en: "City dwellers are far more likely to rent than people in the countryside, who, by contrast, almost always own their homes.", vi: "Người thành phố dễ đi thuê nhà hơn nhiều so với người nông thôn — những người, ngược lại, gần như luôn sở hữu nhà." },
              { en: "When it comes to saving, my parents' generation is much more cautious.", vi: "Nói tới chuyện tiết kiệm thì thế hệ bố mẹ tôi thận trọng hơn nhiều." },
            ],
          },
          {
            formula: "I suppose that's down to + N / the fact that … · That said, the gap is narrowing / has narrowed",
            vi: "Lý do + xu hướng của khoảng cách (HTHT — bài 1).",
            examples: [
              { en: "I suppose that's down to the fact that they didn't grow up with it. That said, the gap has narrowed a lot since the pandemic.", vi: "Tôi đoán đó là vì họ không lớn lên cùng nó. Dù vậy, khoảng cách đã hẹp đi nhiều từ sau đại dịch." },
            ],
          },
        ],
      },
      {
        t: "dialogue",
        title: "Mẫu band 7 (ước tính) — hai nhóm cùng thời, 118 từ",
        lines: [
          { who: "Examiner", role: "examiner", text: "What are the main differences between the way younger and older people use technology?", vi: "Khác biệt chính giữa cách người trẻ và người lớn tuổi dùng công nghệ là gì?" },
          { who: "Candidate", role: "candidate", text: "It's hard to generalise, but the most striking difference is probably one of attitude. People in their twenties tend to assume there's an app for everything, so they'll bank, shop and even see a doctor online without a second thought. My parents' generation, by contrast, are far more cautious — they'd rather speak to a real person, especially where money is involved. I suppose that's down to trust more than ability; they simply didn't grow up with it. That said, the gap has narrowed a lot over the last few years. My mum, for instance, now does all her banking on her phone. So I'd say it's a difference of degree these days rather than a real divide.", vi: "Khó mà nói chung được, nhưng khác biệt nổi bật nhất có lẽ là về thái độ. Người độ tuổi hai mươi thường mặc định việc gì cũng có ứng dụng, nên họ giao dịch ngân hàng, mua sắm, thậm chí khám bệnh trực tuyến mà không cần nghĩ. Thế hệ bố mẹ tôi thì ngược lại, thận trọng hơn nhiều — họ thích nói chuyện với người thật hơn, nhất là khi dính tới tiền. Tôi đoán đó là chuyện lòng tin hơn là năng lực; đơn giản là họ không lớn lên cùng nó. Dù vậy, khoảng cách đã hẹp đi nhiều trong vài năm qua. Mẹ tôi chẳng hạn, giờ làm mọi giao dịch ngân hàng trên điện thoại. Nên tôi cho rằng ngày nay đó là khác biệt về mức độ hơn là một hố ngăn thật sự." },
        ],
      },
      {
        t: "note",
        title: "Phân tích mẫu — sáu thứ đáng mượn",
        items: [
          "**It's hard to generalise, but…** — mở bằng một câu rào: thừa nhận không phải ai cũng thế, rồi vẫn trả lời. Rất “band 7”.",
          "**one of attitude** = a difference of attitude — dùng **one** thay danh từ vừa nói (substitution; học kỹ ở Ngày 13).",
          "**tend to · are far more cautious · they'd rather** — ba cách nói xu hướng, không câu nào tuyệt đối.",
          "**that's down to trust more than ability** — lý do, kèm so sánh hai nguyên nhân.",
          "**That said, the gap has narrowed** — rẽ hướng + HTHT + cụm thời gian mở (over the last few years).",
          "**a difference of degree rather than a real divide** — chốt bằng một ý mới, có từ ít gặp (divide).",
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay gặp khi so sánh hai nhóm",
        items: [
          "~~The young is…~~ → **The young are** / **Young people are** (the + adj = cả nhóm, luôn số nhiều). Tương tự: **the elderly are**, **the wealthy are**.",
          "~~different with~~ / ~~difference of A and B~~ → different **from** · the difference **between** A **and** B.",
          "~~Old people~~ nghe hơi thô trong phòng thi → **older people** · **the older generation** · **people in their sixties and seventies**.",
          "Nhảy qua lại từng chi tiết (A… B… A… B…) làm người nghe rối: nói **trọn bên A**, một cụm chuyển (by contrast / whereas), rồi **trọn bên B**.",
          "Dùng **used to** cho nhóm đang sống cùng thời: ~~Older people used to prefer cash~~ (nếu họ **vẫn** thích tiền mặt) → Older people **prefer** / **still prefer** cash.",
        ],
      },
      {
        t: "rule",
        formula: "It's hard to generalise, but the most striking difference is that A tend to + V, whereas B + V. I suppose that's down to + N. That said, the gap has narrowed / is narrowing.",
        vi: "Hai nhóm cùng thời ở band 7: rào trước → khác biệt có mức độ → lý do → xu hướng của khoảng cách → chốt.",
      },

      { t: "h", text: "6. Phát âm: /ɜː/ và /ə/" },
      {
        t: "p",
        text: "Hai âm này **cùng vị trí lưỡi** (giữa miệng, môi thả lỏng, không tròn môi) — khác nhau ở **độ dài và trọng âm**. **/ɜː/** dài, luôn nằm ở âm tiết **có trọng âm** (w**or**k, pref**er**, res**ear**ch). **/ə/** (schwa — âm “ơ” lướt) cực ngắn, **không bao giờ** mang trọng âm, và là âm xuất hiện nhiều nhất trong tiếng Anh (**a**bout, gener**a**tion, teach**er**). Trong giọng Anh-Anh, chữ **r** sau nguyên âm **không** đọc: work /wɜːk/, không uốn lưỡi.",
      },
      {
        t: "table",
        caption: "Nhận ra /ɜː/ qua chính tả",
        head: ["Chữ viết", "Ví dụ /ɜː/", "Người Việt hay đọc nhầm thành"],
        rows: [
          ["**er** (có trọng âm)", "prefer · term · concern · emerge · alternative", "/e/ hoặc “ơ” ngắn"],
          ["**ir**", "first · thirty · circumstances · firm", "/ia/ (“phớt”)"],
          ["**ur**", "urban · further · purpose · occur · survey", "/u/ (“u-ban”)"],
          ["**or** sau w", "work · world · word · worth · worse", "/ɔː/ — work đọc thành walk"],
          ["**ear** + phụ âm", "research · early · earn · learn", "/ɪə/ (“ia”)"],
          ["**our**", "journey · journal", "/aʊ/"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo tập",
        items: [
          "**/ɜː/**: nói “ơ” tiếng Việt, kéo dài gấp đôi, **giữ nguyên miệng** từ đầu tới cuối — không trượt sang âm khác, không uốn lưỡi. work ≠ walk /wɔːk/; bird ≠ bed /bed/.",
          "**/ə/**: đừng “đọc” nó — chỉ **lướt qua**. a·GO, a·BOUT, gen·e·RA·tion: âm /ə/ càng ngắn, âm có trọng âm càng nổi, câu càng có nhịp.",
          "Cặp đáng tập: **person** /pɜːsn/ (dài – lướt), **further** /fɜːðə/ (dài – lướt), **research** /rɪsɜːtʃ/, **prefer** /prɪfɜː/ → **preference** /prefrəns/ (trọng âm đổi, /ɜː/ biến mất).",
          "Từ chức năng trong câu đọc yếu thành /ə/: to /tə/, than /ðən/, from /frəm/, was /wəz/, were /wə/, are /ə/ — đúng những từ bạn dùng khi so sánh xưa – nay.",
        ],
      },
      {
        t: "phatam",
        id: "t4d3-phat-am",
        title: "Luyện phát âm — /ɜː/ và /ə/",
        note: "Ba dòng đầu là từ rời. Các dòng sau là câu bạn sẽ dùng thật trong Part 3 hôm nay. Máy chấm từng âm — xem /ɜː/ có bị chấm thành /ɔː/ hoặc /e/ không, và các từ yếu (to, than, from) có bị đọc quá rõ không.",
        items: [
          { text: "work, word, world", ipa: "wɜːk wɜːd wɜːld", vi: "làm việc · từ · thế giới" },
          { text: "first, further, research", ipa: "fɜːst fɜːðə rɪsɜːtʃ", vi: "đầu tiên · xa hơn · nghiên cứu" },
          { text: "about, ago, again", ipa: "əbaʊt əɡəʊ əɡen", vi: "về · trước đây · lần nữa" },
          { text: "A generation ago, people worked on farms.", ipa: "ə dʒenəreɪʃn əɡəʊ piːpl wɜːkt ɒn fɑːmz", vi: "Một thế hệ trước, người ta làm việc ở nông trại." },
          { text: "The world of work has changed completely.", ipa: "ðə wɜːld əv wɜːk həz tʃeɪndʒd kəmpliːtli", vi: "Thế giới việc làm đã thay đổi hoàn toàn." },
          { text: "Urban workers earn more than rural farmers.", ipa: "ɜːbən wɜːkəz ɜːn mɔː ðən rʊərəl fɑːməz", vi: "Lao động thành thị kiếm nhiều hơn nông dân nông thôn." },
          { text: "Our parents preferred a permanent career.", ipa: "aʊə peərənts prɪfɜːd ə pɜːmənənt kərɪə", vi: "Bố mẹ chúng ta thích một sự nghiệp ổn định lâu dài." },
          { text: "Research has confirmed the concern.", ipa: "rɪsɜːtʃ həz kənfɜːmd ðə kənsɜːn", vi: "Nghiên cứu đã xác nhận mối lo ngại." },
          { text: "Thirty years from now, it will be a different world.", ipa: "θɜːti jɪəz frəm naʊ ɪt wɪl bi ə dɪfrənt wɜːld", vi: "Ba mươi năm nữa, đó sẽ là một thế giới khác." },
          { text: "The service sector has emerged as the main employer.", ipa: "ðə sɜːvɪs sektə həz ɪmɜːdʒd əz ðə meɪn ɪmplɔɪə", vi: "Khu vực dịch vụ đã nổi lên thành nơi tuyển dụng chính." },
        ],
      },

      { t: "h", text: "7. Luyện tập trước khi ghi âm" },
      {
        t: "quiz",
        id: "t4d3-noi-dien-khung",
        title: "Điền MỘT từ vào câu trả lời mẫu (8 chỗ trống)",
        kind: "fill",
        items: [
          { q: "1. Well, shopping has changed almost beyond ___, I'd say.", answers: ["recognition"], hint: "không nhận ra nổi" },
          { q: "2. If you go ___ a generation, people would buy everything at the local market.", answers: ["back"] },
          { q: "3. They ___ to know every seller by name.", answers: ["used"], hint: "từng" },
          { q: "4. These days, online shopping has ___ second nature to most people.", answers: ["become"] },
          { q: "5. Having ___ that, markets haven't disappeared — older people still rely on them.", answers: ["said"] },
          { q: "6. As ___ the future, I'd imagine most groceries will be delivered.", answers: ["for"] },
          { q: "7. Small shops may ___ struggle to survive.", answers: ["well"], hint: "may ___ = rất có thể" },
          { q: "8. So, all in ___, it's more convenient than it used to be, but a lot less personal.", answers: ["all"] },
        ],
      },
      {
        t: "mcq",
        id: "t4d3-noi-chon",
        title: "Chọn cách nói đúng / hợp nhất (8 câu)",
        items: [
          { q: "1. Examiner: “How has family life changed?” — Câu mở nào đúng ngữ pháp và hợp band 7 nhất?", options: ["Family life changed a lot in my country.", "Well, it's changed quite dramatically, I'd say.", "In conclusion, family life is changing.", "Moreover, family life has been changed."], correct: 1, why: "HTHT (it's changed) cho thay đổi kéo tới nay + Well… I'd say. A thiếu HTHT; C dùng từ chốt của văn viết để mở; D bị động thừa + Moreover không thêm vào ý nào." },
          { q: "2. Chọn cụm đúng: “Fast food is cheap and convenient. ___, it's hardly good for you.”", options: ["On top of that", "What's more", "Having said that", "Take that for instance"], correct: 2, why: "Vế sau NGƯỢC chiều (không tốt cho sức khoẻ) ⇒ cần cụm rẽ hướng: Having said that. On top of that / What's more là thêm ý cùng chiều." },
          { q: "3. “When I was a child, we ___ in a small village near the coast.”", options: ["used to live", "would live", "were used to live", "have lived"], correct: 0, why: "live là trạng thái ⇒ used to live. would chỉ dùng cho hành động lặp lại; were used to + V-ing mới đúng dạng và nghĩa khác (quen với)." },
          { q: "4. Câu dự đoán nào hợp band 7?", options: ["In the future, all people will study online.", "I'd imagine a lot of courses will move online, though I doubt classrooms will disappear.", "Future, online study is popular.", "People will be studied online in the future."], correct: 1, why: "Dự đoán có mức độ (I'd imagine… a lot of…) + giới hạn (though I doubt…). A tuyệt đối (all people); C sai ngữ pháp; D bị động sai nghĩa." },
          { q: "5. “The elderly ___ generally more careful with money than the young.”", options: ["is", "was", "has been", "are"], correct: 3, why: "the + tính từ = cả nhóm người ⇒ động từ số nhiều: The elderly are. Hai nhóm cùng thời ⇒ hiện tại đơn." },
          { q: "6. Cụm nào KHÔNG nên dùng khi nói Part 3?", options: ["Mind you, …", "Then again, …", "Furthermore, it can be argued that…", "What I mean is…"], correct: 2, why: "Furthermore + it can be argued that là văn viết Task 2 — nói ra nghe như đọc bài. Ba cụm còn lại là văn nói tự nhiên." },
          { q: "7. “I suppose that's ___ the fact that they didn't grow up with smartphones.”", options: ["down to", "up to", "because", "owing"], correct: 0, why: "be down to + N / the fact that = là do. because không đi với the fact that trực tiếp (cần because of); up to = tuỳ vào; owing thiếu to." },
          { q: "8. Câu chốt nào tốt nhất cho câu hỏi “How has education changed?”", options: ["…and yeah, that's all.", "So yes, education changed.", "In conclusion, I have mentioned three changes.", "So, all in all, it's far more accessible than it was, even if the pressure is greater."], correct: 3, why: "Chốt bằng một ý mới, có so sánh và nhượng bộ. A treo; B lặp + sai thì; C là văn viết." },
        ],
      },
      {
        t: "p",
        text: "Mỗi câu nói **40–60 giây** theo khung mục 2 (hoặc mục 5 cho câu so sánh hai nhóm). Trước khi bấm ghi, chọn sẵn: **một cụm mở**, **một cụm rẽ**, **một cụm chốt** — không lặp cụm của câu trước. Nghe lại và tự hỏi: có **has changed / has become** không? chặng XƯA có **used to / would** không? dự đoán có **mức độ** không? /ɜː/ trong work · world · prefer có đủ dài không?",
      },
      {
        t: "speak",
        id: "t4d3-noi-thoi-gian-1",
        part: "3",
        questions: [
          "How has the way people communicate changed in your country over the last twenty years?",
          "Is family life different now from what it was when your grandparents were young?",
          "Why has online shopping become so popular in recent years?",
          "Do you think people were happier in the past than they are today?",
        ],
      },
      {
        t: "speak",
        id: "t4d3-noi-thoi-gian-2",
        part: "3",
        questions: [
          "What do you think cities will be like in thirty years' time?",
          "Do you think people will continue to change jobs as often as they do now?",
          "How do you think the way children are educated will change in the future?",
          "Will traditional festivals still be important to the next generation?",
        ],
      },
      {
        t: "speak",
        id: "t4d3-noi-hai-nhom",
        part: "3",
        questions: [
          "What are the main differences between the way younger and older people spend their free time?",
          "How is life in a big city different from life in a small town in your country?",
          "Do men and women in your country tend to choose different kinds of jobs?",
          "In what ways do students today learn differently from their teachers' generation?",
        ],
      },
      {
        t: "note",
        title: "Sổ Speaking — việc sau khi ghi âm",
        items: [
          "Chép lại **một** câu trả lời bạn ưng nhất. Gạch chân mọi động từ: có chỗ nào **kẹt ở hiện tại đơn** khi đang nói chuyện xưa không?",
          "Đếm discourse markers: nếu **I think** > 2 lần trong một câu trả lời, viết lại bằng I'd say / I suppose / I'd imagine.",
          "Ghi vào sổ **3 cụm** từ bảng mục 3 mà bạn **chưa từng dùng**; ngày mai trả lời lại hai câu hỏi cũ và ép mình dùng chúng.",
          "Hôm sau tự đóng vai giám khảo hỏi lại: “Why do you think that is?” — và nói thêm 20 giây (cách làm ở Tập 3 Ngày 2).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 3 ═══════════════════════════ */
  {
    id: "t4d3-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 3",
    goal: "Tự kiểm cả ngày: chọn thì trong câu học thuật (HTHT cho xu hướng, QKHT sau By / khi tường thuật), ghép tiêu đề ý ẩn, dùng đúng discourse markers và phân biệt /ɜː/ – /ə/ — 42 câu có đáp án.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (42 câu)",
        items: [
          "**I** Chia động từ (10) · **II** Trắc nghiệm (8) · **III** Sửa lỗi (5) · **IV** Dịch (6) — ngữ pháp bài 1.",
          "**V** Đọc: ghép tiêu đề cho 4 đoạn (4 câu, 6 phút) — bài 2.",
          "**VI** Discourse markers (5) · **VII** Âm /ɜː/ hay /ə/ (4) — bài 3.",
          "Đạt: **≥ 32/42**. Sai từ 3 câu trở lên ở phần I–IV ⇒ đọc lại bảng ĐÓNG / MỞ (bài 1 mục 1) và khung By (mục 5).",
          "Ghi mọi câu sai vào **sổ lỗi** kèm lý do một dòng: sai vì cụm thời gian nào, vì bẫy nào.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 3 trước khi làm bài",
        center: "Thì trong văn học thuật",
        branches: [
          { label: "HTHT — xu hướng", items: ["has risen steadily since…", "There has been a sharp rise in…", "The past decade has seen…"] },
          { label: "HTHT — nghiên cứu", items: ["Research has shown that + hiện tại", "Little attention has been paid to…"] },
          { label: "QKHT", items: ["By 2000, … had doubled", "reported that … had fallen", "had been + V3 (bị động)"] },
          { label: "Quá khứ đơn", items: ["in 2015 · between … and … · ago", "A 2019 study found…"] },
          { label: "Nói 3 chặng", items: ["used to / would", "has become", "I'd imagine … will"] },
        ],
      },

      { t: "h", text: "I. Chia động từ trong ngoặc (10 câu)" },
      {
        t: "quiz",
        id: "t4d3-bt-chia",
        kind: "fill",
        title: "I. Chia động từ trong ngoặc — chú ý cụm thời gian",
        items: [
          { q: "1. The proportion of electricity generated from wind ___ (triple) since 2012.", answers: ["has tripled"] },
          { q: "2. In 2012, wind ___ (supply) only 6% of the national total.", answers: ["supplied"] },
          { q: "3. By 2018, that figure ___ (climb) to 17%.", answers: ["had climbed"] },
          { q: "4. Over the last few decades, there ___ (be) a steady decline in trade-union membership.", answers: ["has been"] },
          { q: "5. A 2021 survey revealed that two-thirds of respondents ___ (never / hear) of the scheme.", answers: ["had never heard"], hint: "lùi thì sau revealed" },
          { q: "6. Considerable research ___ (carry out — bị động) on the effects of screen time on children.", answers: ["has been carried out"] },
          { q: "7. The factory, which ___ (employ) 4,000 people at its height, closed in 1998.", answers: ["had employed", "employed"], hint: "nhìn lùi về trước 1998 (employed cũng chấp nhận — at its height đã rõ mốc)" },
          { q: "8. Wages ___ (remain) flat for a decade before they finally began to rise in 2016.", answers: ["had remained", "remained"], hint: "had remained hay hơn; có before nên remained cũng chấp nhận (mục 6)" },
          { q: "9. Since the motorway opened, journey times to the capital ___ (fall) by a third.", answers: ["have fallen"] },
          { q: "10. The last fifty years ___ (see) an extraordinary improvement in child survival.", answers: ["have seen"], hint: "chủ ngữ số nhiều" },
        ],
      },

      { t: "h", text: "II. Chọn đáp án đúng (8 câu)" },
      {
        t: "mcq",
        id: "t4d3-bt-chon",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "1. The price of housing ___ sharply in recent years, pushing many young adults out of the market.", options: ["rose", "has been risen", "has risen", "had risen"], correct: 2, why: "in recent years ⇒ HTHT; rise là nội động từ ⇒ không bị động." },
          { q: "2. ___ 1995, fewer than one in a hundred households had access to the internet.", options: ["In", "Since", "Over", "By the past"], correct: 0, why: "Động từ là had (quá khứ đơn của have) + mốc đã đóng ⇒ In 1995. Since cần HTHT ở mệnh đề chính." },
          { q: "3. Recent research ___ that loneliness ___ as harmful to health as smoking.", options: ["suggested / had been", "has suggested / is", "suggests / was", "had suggested / has been"], correct: 1, why: "Recent research (nhiều nghiên cứu, còn giá trị) ⇒ has suggested; kết luận còn đúng ⇒ hiện tại: is." },
          { q: "4. By the time the report was published, the minister ___.", options: ["has already resigned", "already resigned", "was already resigning", "had already resigned"], correct: 3, why: "By the time + quá khứ đơn ⇒ việc từ chức hoàn tất trước đó ⇒ had already resigned." },
          { q: "5. There has been a dramatic increase ___ the number of people living alone, an increase ___ almost 40% in two decades.", options: ["in / of", "of / in", "in / in", "of / by"], correct: 0, why: "an increase IN + cái gì tăng; an increase OF + mức tăng." },
          { q: "6. Archaeologists found that the site ___ long before the Romans arrived.", options: ["has been abandoned", "was abandoning", "had been abandoned", "abandoned"], correct: 2, why: "found (quá khứ) + việc xảy ra trước nữa (long before…) + bị động ⇒ had been abandoned." },
          { q: "7. A number of studies ___ that bilingual children switch between tasks more easily.", options: ["has shown", "have shown", "had shown", "is showing"], correct: 1, why: "A number of + danh từ số nhiều = nhiều ⇒ have shown. (The number of… mới đi với has.)" },
          { q: "8. The company was founded in 1960, ___ rapidly in the 1970s and ___ bankrupt in 1982.", options: ["had expanded / had gone", "has expanded / went", "expanding / had gone", "expanded / went"], correct: 3, why: "Ba việc kể đúng thứ tự xảy ra ⇒ quá khứ đơn cho tất cả; không cần had." },
        ],
      },

      { t: "h", text: "III. Sửa lỗi (5 câu)" },
      {
        t: "quiz",
        id: "t4d3-bt-sua-loi",
        kind: "fill",
        title: "III. Mỗi câu có MỘT lỗi ở cụm trong ngoặc vuông. Viết lại cụm đó cho đúng",
        items: [
          { q: "1. In recent years, the number of electric cars on the road [increased] dramatically.", answers: ["has increased"] },
          { q: "2. By 2010, the proportion of adults who smoked [has fallen] to 20%.", answers: ["had fallen"] },
          { q: "3. Many [researches have] shown that bilingualism delays the onset of dementia.", answers: ["studies have", "research has"], hint: "research không đếm được" },
          { q: "4. Unemployment [has been risen] steadily since the factory closed.", answers: ["has risen", "has been rising"] },
          { q: "5. The survey showed that most residents [have never used] the new cycle lanes.", answers: ["had never used"], hint: "lùi thì sau showed" },
        ],
      },

      { t: "h", text: "IV. Dịch sang tiếng Anh (6 câu)" },
      {
        t: "quiz",
        id: "t4d3-bt-dich",
        kind: "translate",
        title: "IV. Dịch sang tiếng Anh — dùng cấu trúc gợi ý",
        grammar: "HTHT cho xu hướng · By + mốc quá khứ + had V3 · S + V2 + that + S + had V3",
        items: [
          { q: "Hai mươi năm qua đã chứng kiến sự gia tăng mạnh của du lịch quốc tế.", answers: ["The past twenty years have seen a sharp rise in international tourism.", "The last twenty years have seen a sharp rise in international tourism.", "The past twenty years have seen a sharp increase in international tourism.", "The past twenty years have witnessed a sharp rise in international tourism.", "The past two decades have seen a sharp rise in international tourism.", "The last twenty years have seen a sharp increase in international tourism."], hint: "The past twenty years have seen · a sharp rise in" },
          { q: "Đến năm 2020, dân số thành thị của thế giới đã vượt bốn tỉ người.", answers: ["By 2020, the world's urban population had exceeded four billion.", "By 2020, the world's urban population had exceeded four billion people.", "By 2020, the world's urban population had exceeded 4 billion.", "By 2020, the urban population of the world had exceeded four billion.", "By 2020, the world's urban population had passed four billion.", "By 2020, the world's urban population had surpassed four billion."], hint: "By 2020 · the world's urban population · had exceeded" },
          { q: "Nghiên cứu đã cho thấy rằng trẻ học tốt hơn khi được ngủ đủ.", answers: ["Research has shown that children learn better when they get enough sleep.", "Research has shown that children learn better when they have enough sleep.", "Studies have shown that children learn better when they get enough sleep.", "Research has shown that children learn better if they get enough sleep.", "Research has shown that children learn better when they sleep enough."], hint: "Research has shown that · learn (hiện tại) · get enough sleep" },
          { q: "Từ năm 2015, đã có sự sụt giảm đều về số vụ tai nạn giao thông.", answers: ["Since 2015, there has been a steady decline in the number of road accidents.", "Since 2015 there has been a steady decline in the number of road accidents.", "Since 2015, there has been a steady fall in the number of road accidents.", "Since 2015, there has been a steady decline in the number of traffic accidents.", "There has been a steady decline in the number of road accidents since 2015.", "Since 2015, there has been a steady decrease in the number of traffic accidents."], hint: "there has been a steady decline in · road accidents" },
          { q: "Báo cáo kết luận rằng dự án đã thất bại vì người dân địa phương không được hỏi ý kiến.", answers: ["The report concluded that the project had failed because local people had not been consulted.", "The report concluded that the project had failed because local residents had not been consulted.", "The report concluded that the project had failed because local people hadn't been consulted.", "The report concluded that the project had failed because the local people had not been consulted.", "The report concluded that the project had failed because local residents hadn't been consulted."], hint: "concluded that · had failed · had not been consulted (bị động)" },
          { q: "Giá dầu đã ổn định gần một thập kỷ trước khi tăng gấp đôi vào năm 2008.", answers: ["Oil prices had remained stable for almost a decade before doubling in 2008.", "Oil prices had been stable for almost a decade before doubling in 2008.", "Oil prices had remained stable for nearly a decade before doubling in 2008.", "Oil prices had remained stable for almost a decade before they doubled in 2008.", "The price of oil had remained stable for almost a decade before doubling in 2008.", "Oil prices had remained steady for almost a decade before doubling in 2008."], hint: "had remained stable · before doubling" },
        ],
      },

      { t: "h", text: "V. Đọc — ghép tiêu đề (6 phút, 4 câu)" },
      {
        t: "p",
        text: "The passage has four paragraphs, **A–D**. Choose the correct heading for each paragraph from the list below. Write the correct number, **i–vi**. Có **hai** tiêu đề thừa.",
      },
      {
        t: "table",
        caption: "List of Headings",
        head: ["Số", "Heading"],
        rows: [
          ["i", "A dividing line that is fading once more"],
          ["ii", "The disappearance of village festivals"],
          ["iii", "Free time granted on certain conditions"],
          ["iv", "How rest first became something measurable"],
          ["v", "Enjoyment as a product to be purchased"],
          ["vi", "Why workers campaigned for shorter days"],
        ],
      },
      {
        t: "passage",
        title: "A Short History of Free Time",
        intro: "Bài đọc tự soạn (~220 từ).",
        paras: [
          { label: "A", text: "In pre-industrial villages, work and rest were not separate parts of the day. A farmer might stop to talk, sing while harvesting or join a festival that lasted a week, and nobody recorded how many hours had been “lost”. Only when factories began paying by the hour did free time become something that could be counted — and therefore something that could be taken away." },
          { label: "B", text: "The reformers of the nineteenth century, having won shorter working days, at once began to worry about how workers would fill them. Public libraries, parks and brass bands were promoted not simply as pleasures but as alternatives to the pub. Leisure, in other words, was welcome provided that it improved the person who enjoyed it." },
          { label: "C", text: "The twentieth century turned these free hours into a market. Cinemas, package holidays and televised sport offered ready-made entertainment, and spending on recreation grew faster than wages. Some observers have argued that the result was not greater freedom but a new obligation: to consume." },
          { label: "D", text: "More recently, the boundary that the factory created has begun to dissolve again. A phone that carries both a work inbox and a film library means that neither activity ever fully stops. Whether this represents a return to the older, blended pattern or simply the invasion of rest by work remains an open question." },
        ],
      },
      {
        t: "quiz",
        id: "t4d3-bt-doc",
        kind: "fill",
        title: "V. Ghi số La Mã (i–vi)",
        items: [
          { q: "1. Paragraph A ___", answers: ["iv"] },
          { q: "2. Paragraph B ___", answers: ["iii"] },
          { q: "3. Paragraph C ___", answers: ["v"] },
          { q: "4. Paragraph D ___", answers: ["i"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án V",
        items: [
          "**A — iv**. Ý chính ở **câu cuối**, sau “Only when…”: “free time become something that could be **counted**” = became measurable. Bẫy **ii**: festival chỉ là một ví dụ, và bài không nói lễ hội biến mất.",
          "**B — iii**. Câu cuối: “Leisure… was welcome **provided that** it improved the person” = granted on certain conditions (ý ẩn — tiêu đề không lặp chữ nào). Bẫy **vi**: “having won shorter working days” là việc đã xong trước đó (having + V3), đoạn không giải thích vì sao họ đấu tranh.",
          "**C — v**. “turned these free hours into **a market**… ready-made entertainment… to **consume**” = a product to be purchased.",
          "**D — i**. “the **boundary**… has begun to **dissolve again**” = a dividing line that is fading once more (boundary → dividing line; dissolve → fade; again → once more). Để ý thì: **has begun** (HTHT) + More recently.",
        ],
      },

      { t: "h", text: "VI. Discourse markers (5 câu)" },
      {
        t: "p",
        text: "Chọn cụm trong hộp cho mỗi chỗ trống (mỗi cụm dùng một lần): **Having said that** · **As for** · **On top of that** · **all in all** · **If you go back**",
      },
      {
        t: "quiz",
        id: "t4d3-bt-markers",
        kind: "fill",
        title: "VI. Điền cụm từ dẫn mạch",
        items: [
          { q: "1. ___ thirty years, hardly anyone in my town owned a car.", answers: ["If you go back"] },
          { q: "2. Public transport here is cheap. ___, it runs until midnight. (thêm một điểm tốt)", answers: ["On top of that"] },
          { q: "3. Most people my age rent a flat. ___, a few of my friends have managed to buy one. (ý ngược một phần)", answers: ["Having said that"] },
          { q: "4. ___ the future, I'd imagine electric buses will replace the old ones.", answers: ["As for"] },
          { q: "5. So, ___, I'd say travelling has become easier but a lot more crowded.", answers: ["all in all"] },
        ],
      },

      { t: "h", text: "VII. /ɜː/ hay /ə/? (4 câu)" },
      {
        t: "mcq",
        id: "t4d3-bt-phat-am",
        title: "VII. Phần in HOA đọc là âm gì?",
        items: [
          { q: "1. resEARch", options: ["/ɪə/", "/ɜː/", "/eə/", "/ə/"], correct: 1, why: "research /rɪˈsɜːtʃ/ — ear + phụ âm đọc /ɜː/ (như early, learn)." },
          { q: "2. generAtion — âm của chữ E thứ hai (gen-E-ration)", options: ["/e/", "/ɜː/", "/iː/", "/ə/"], correct: 3, why: "generation /ˌdʒenəˈreɪʃn/ — âm tiết thứ hai không có trọng âm ⇒ /ə/." },
          { q: "3. wORld", options: ["/ɜː/", "/ɔː/", "/ɒ/", "/əʊ/"], correct: 0, why: "world /wɜːld/ — or sau w đọc /ɜː/ (work, word, worth); không phải /ɔː/ như walk." },
          { q: "4. prefERence — âm của ER", options: ["/ɜː/", "/eə/", "/ə/ (hoặc không đọc)", "/e/"], correct: 2, why: "preference /ˈprefrəns/ — trọng âm dời về âm tiết đầu nên -er- yếu đi thành /ə/ hoặc rơi hẳn. So với prefer /prɪˈfɜː/." },
        ],
      },
    ],
  },
];
