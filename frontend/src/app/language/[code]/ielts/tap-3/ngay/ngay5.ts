/**
 * IELTS Tập 3 — Ngày 5 (tự soạn 18/11/2026; mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI):
 *   Bài 1 · Grammar   — Tương lai tiếp diễn · tương lai hoàn thành (+ hoàn thành tiếp diễn) · dự báo Task 1 có năm tương lai [G23, ôn G13]
 *   Bài 2 · Reading   — Matching headings 2: ý chính vs chi tiết, 6 bẫy; bài đọc ~800 từ, 13 câu [R12]
 *   Bài 3 · Listening — Số liệu phức: thập phân, %, phân số, số lớn, năm, đơn vị; bẫy sửa số [L01] 🔊 thirteen / thirty
 *   Bài tập           — 38 câu.
 * Nối: Tập 2 Ngày 7 (4 cách nói tương lai, is expected to) · Tập 2 Ngày 4 (line graph có năm dự báo) ·
 *      Tập 2 Ngày 12 (Matching headings lần đầu) · Tập 2 Ngày 3 (nghe số, ngày, giá) · Tập 3 Ngày 1 (hệ 12 thì).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T3D5_GRAMMAR: Lesson = {
  id: "t3d5-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Tương lai tiếp diễn · tương lai hoàn thành · dự báo trong Task 1",
  goal: "Dùng đúng will be V-ing (đang diễn ra tại một mốc tương lai) và will have V3 (đã xong trước một mốc tương lai), rồi viết được đoạn Task 1 có năm dự báo bằng is projected to, a projected rise to, before being expected to reach — nhóm câu đẩy GRA và TA lên band 6.",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Tập 2 Ngày 7 bạn đã có **4 cách nói tương lai** (will · be going to · hiện tại tiếp diễn · hiện tại đơn lịch trình). Hôm nay thêm **ba thì tương lai còn lại** trong hệ 12 thì (Tập 3 Ngày 1): tương lai tiếp diễn, tương lai hoàn thành, tương lai hoàn thành tiếp diễn.",
        "**Tương lai tiếp diễn** (future continuous): ==will be + V-ing== — tại một mốc tương lai, việc đó **đang diễn ra**. “This time next year I **will be studying** in Sydney.”",
        "**Tương lai hoàn thành** (future perfect): ==will have + V3== — tới một mốc tương lai, việc đó **đã xong**. Từ báo hiệu số 1: **by** + mốc thời gian. “By 2040 the figure **will have doubled**.”",
        "**Dự báo trong Writing Task 1**: số liệu tương lai là dự đoán của người khác → **is expected / projected / forecast to + V**, dạng danh từ **a projected rise to…**, và đổi thì ngay giữa câu: **rose to 30% in 2020, before being expected to reach 45% by 2040**.",
        "Đẩy band: **GRA band 6** (trộn câu đơn + câu phức, đủ dải thì) và **TA band 6** ở Task 1 (biểu đồ có năm tương lai mà viết toàn quá khứ là sai thông tin).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Ôn 60 giây: bốn cách nói tương lai đã học (Tập 2 Ngày 7)" },
    {
      t: "table",
      caption: "Bốn cách cũ — nhìn lại trước khi học cách mới",
      head: ["Cách nói", "Dùng khi", "Ví dụ"],
      rows: [
        ["**will + V**", "quyết định ngay lúc nói · dự đoán theo ý kiến · hứa", "I think prices **will rise** next year."],
        ["**be going to + V**", "dự định đã có · dự đoán có bằng chứng trước mắt", "We **are going to move** to Da Nang in June."],
        ["**am / is / are + V-ing**", "kế hoạch đã hẹn, đã đặt", "I **am meeting** my supervisor at 3 p.m. tomorrow."],
        ["**hiện tại đơn**", "lịch trình cố định (tàu xe, lớp học)", "The lecture **starts** at nine."],
      ],
    },
    {
      t: "p",
      text: "Bốn cách trên đều nhìn việc tương lai như **một sự kiện trọn vẹn**: “sẽ làm”. Tiếng Anh còn hai góc nhìn nữa mà tiếng Việt không có dạng riêng: “**lúc đó đang làm dở**” và “**lúc đó đã làm xong rồi**”. Người Việt thường dịch cả ba thành “sẽ…”, nên bài viết band 5 gần như chỉ có **will + V**. Band 6 bắt đầu khi bạn chọn đúng góc nhìn.",
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Ba góc nhìn về cùng một mốc tương lai (8 giờ tối mai)",
      caption: "Mốc = 8 giờ tối mai. ① will cook: bắt đầu nấu lúc đó. ② will be cooking: lúc đó đang nấu dở. ③ will have cooked: lúc đó đã nấu xong.",
      marks: [
        { from: 5, label: "① I **will cook** at 8 (sự kiện tại mốc)", kieu: "diem", mau: 1 },
        { from: 3, to: 7, label: "② I **will be cooking** at 8 (đang dở quanh mốc)", kieu: "doan", mau: 2 },
        { from: 1, to: 5, label: "③ I **will have cooked** by 8 (xong TRƯỚC mốc)", kieu: "doan", mau: 3 },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Tương lai tiếp diễn: will be + V-ing" },
    {
      t: "p",
      text: "**Tương lai tiếp diễn** (future continuous) ghép **will be** với **động từ thêm -ing**. Chủ ngữ nào cũng dùng **will be** — không chia. Thì này có **ba việc** chính, xếp theo mức hay gặp trong IELTS.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + will be + V-ing (+ at / this time + mốc tương lai)",
          vi: "Việc ① — tại một mốc tương lai, hành động **đang diễn ra** (bắt đầu trước mốc, chưa xong tại mốc).",
          examples: [
            { en: "This time next week I will be sitting my IELTS test.", vi: "Giờ này tuần sau tôi đang ngồi thi IELTS." },
            { en: "At 9 a.m. tomorrow the team will be presenting the results.", vi: "9 giờ sáng mai nhóm sẽ đang trình bày kết quả." },
          ],
        },
        {
          formula: "S + will be + V-ing (+ in + khoảng thời gian / in the future)",
          vi: "Việc ② — **xu hướng kéo dài** ở tương lai: “lúc đó người ta sẽ (đang) sống / làm việc như thế”. Rất hợp Speaking Part 3 và Task 2.",
          examples: [
            { en: "In twenty years' time, most people will be working from home at least part of the week.", vi: "Hai mươi năm nữa, đa số mọi người sẽ làm việc ở nhà ít nhất một phần trong tuần." },
            { en: "Cities will be relying far more on renewable energy by then.", vi: "Tới lúc đó các thành phố sẽ dựa vào năng lượng tái tạo nhiều hơn hẳn." },
          ],
        },
        {
          formula: "Will + S + be + V-ing …?",
          vi: "Việc ③ — hỏi **lịch trình của người khác một cách lịch sự** (không ép, không nhờ vả). Hay gặp trong Listening Part 1–2 và email công việc.",
          examples: [
            { en: "Will you be using the meeting room this afternoon?", vi: "Chiều nay anh có dùng phòng họp không ạ?" },
            { en: "The guide will be waiting for you at the main entrance.", vi: "Hướng dẫn viên sẽ đợi quý khách ở cổng chính." },
          ],
        },
        {
          formula: "S + won't be + V-ing",
          vi: "Phủ định: **will not be = won't be** + V-ing.",
          examples: [{ en: "I won't be using my laptop tonight, so you can borrow it.", vi: "Tối nay tôi không dùng laptop, bạn mượn được." }],
        },
      ],
    },
    {
      t: "table",
      caption: "will + V hay will be + V-ing? — nghĩa đổi theo thì",
      head: ["Câu", "Nghĩa"],
      rows: [
        ["When you arrive, we **will have** dinner.", "Bạn đến **rồi** chúng ta mới ăn (hai việc nối tiếp)."],
        ["When you arrive, we **will be having** dinner.", "Bạn đến thì chúng tôi **đang ăn dở** (đã bắt đầu trước)."],
        ["**Will you come** to the meeting?", "Lời **mời / yêu cầu** — người nghe thấy bị hỏi ý muốn."],
        ["**Will you be coming** to the meeting?", "Chỉ **hỏi kế hoạch** — lịch sự, trung tính hơn."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với will be + V-ing",
      items: [
        "Thiếu **be**: ~~I will working at that time.~~ → I **will be working** at that time.",
        "Thêm **-ing** sau will: ~~I will be work~~ / ~~I will working~~. Công thức luôn đủ ba mảnh: **will + be + V-ing**.",
        "Động từ **trạng thái** (know, believe, own, need, understand, like…) không dùng tiếp diễn: ~~By then I will be knowing the result.~~ → By then I **will know** the result.",
        "Sau **when / while / as soon as** nói về tương lai vẫn dùng **hiện tại** (Tập 2 Ngày 13): ~~When you will be arriving…~~ → **When you arrive**, I will be waiting outside.",
        "Đừng dùng thì này cho mọi câu tương lai. Chỉ dùng khi có **mốc** (at 8, this time next year) hoặc khi tả **một xu hướng đang diễn ra** ở tương lai.",
      ],
    },
    {
      t: "rule",
      formula: "S + will be + V-ing + mốc tương lai (at 8 p.m. / this time next year / in 2040)",
      vi: "Tại mốc tương lai đó, việc đang diễn ra (chưa xong). Cũng dùng để tả xu hướng tương lai và hỏi lịch trình lịch sự.",
    },
    {
      t: "quiz",
      id: "t3d5-tiep-dien-dich",
      title: "Dịch sang tiếng Anh — tương lai tiếp diễn (4 câu)",
      kind: "translate",
      grammar: "S + will be + V-ing + mốc tương lai · Will + S + be + V-ing…? · when + hiện tại đơn",
      items: [
        {
          q: "Giờ này ngày mai tôi đang bay tới Singapore.",
          hint: "This time tomorrow, I will be flying, to Singapore",
          answers: ["This time tomorrow I will be flying to Singapore.", "This time tomorrow, I will be flying to Singapore.", "This time tomorrow I'll be flying to Singapore.", "This time tomorrow, I'll be flying to Singapore.", "I will be flying to Singapore this time tomorrow.", "I'll be flying to Singapore this time tomorrow.", "At this time tomorrow I will be flying to Singapore.", "At this time tomorrow, I will be flying to Singapore."],
        },
        {
          q: "Mười năm nữa, nhiều người sẽ đang lái xe điện.",
          hint: "In ten years' time, many people, will be driving, electric cars",
          answers: ["In ten years' time, many people will be driving electric cars.", "In ten years' time many people will be driving electric cars.", "In ten years, many people will be driving electric cars.", "In ten years many people will be driving electric cars.", "Ten years from now, many people will be driving electric cars.", "In ten years' time, a lot of people will be driving electric cars.", "In ten years, a lot of people will be driving electric cars.", "Many people will be driving electric cars in ten years' time.", "Many people will be driving electric cars in ten years."],
        },
        {
          q: "Tối nay bạn có dùng máy in không? (hỏi lịch sự)",
          hint: "Will you be using, the printer, this evening / tonight",
          answers: ["Will you be using the printer this evening?", "Will you be using the printer tonight?"],
        },
        {
          q: "Khi bạn đến, tôi sẽ đang đợi ở cổng chính.",
          hint: "When you arrive (hiện tại đơn), I will be waiting, at the main entrance / gate",
          answers: ["When you arrive, I will be waiting at the main entrance.", "When you arrive, I'll be waiting at the main entrance.", "When you arrive, I will be waiting at the main gate.", "When you arrive, I'll be waiting at the main gate.", "I will be waiting at the main entrance when you arrive.", "I'll be waiting at the main entrance when you arrive.", "I will be waiting at the main gate when you arrive.", "I'll be waiting at the main gate when you arrive."],
        },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Tương lai hoàn thành: will have + V3" },
    {
      t: "p",
      text: "**Tương lai hoàn thành** (future perfect) ghép **will have** với **quá khứ phân từ** (V3 / V-ed — cột ba của bảng động từ bất quy tắc). Nó trả lời câu hỏi: “**Tính tới mốc đó thì đã xong chưa / đã được bao nhiêu?**”. Bạn đứng ở mốc tương lai rồi **nhìn ngược lại**. Đây là anh em của hiện tại hoàn thành (nhìn từ bây giờ ngược lại) và quá khứ hoàn thành (Tập 3 Ngày 1 — nhìn từ một mốc quá khứ ngược lại).",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + will have + V3 + by + mốc thời gian",
          vi: "Tới mốc đó, việc **đã hoàn thành**. **by** = “chậm nhất là, tính tới”.",
          examples: [
            { en: "By 2040, the number of people aged over 65 will have doubled.", vi: "Tới năm 2040, số người trên 65 tuổi sẽ tăng gấp đôi rồi." },
            { en: "I will have finished the report by Friday.", vi: "Tôi sẽ xong bản báo cáo chậm nhất là thứ Sáu." },
          ],
        },
        {
          formula: "By the time + S + V(s/es), S + will have + V3",
          vi: "**By the time** (vào lúc mà) + **hiện tại đơn** — không dùng will ở vế này.",
          examples: [
            { en: "By the time the new line opens, the city will have spent over two billion dollars.", vi: "Vào lúc tuyến mới mở, thành phố sẽ chi hết hơn hai tỉ đô rồi." },
            { en: "By the time you read this, I will have left.", vi: "Lúc bạn đọc tin này thì tôi đã đi rồi." },
          ],
        },
        {
          formula: "S + will have + V3 + for + khoảng thời gian (+ by + mốc)",
          vi: "Tính tới mốc đó, trạng thái **đã kéo dài được bao lâu** (hay gặp với be, know, live, work).",
          examples: [{ en: "Next March we will have lived here for ten years.", vi: "Tháng Ba tới là chúng tôi sống ở đây tròn mười năm." }],
        },
        {
          formula: "S + won't have + V3 · Will + S + have + V3 …?",
          vi: "Phủ định và câu hỏi.",
          examples: [
            { en: "The builders won't have finished by the end of the month.", vi: "Thợ xây sẽ chưa xong kịp vào cuối tháng." },
            { en: "Will you have completed the survey by then?", vi: "Tới lúc đó bạn làm xong khảo sát chưa?" },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Từ báo hiệu tương lai hoàn thành",
      head: ["Từ báo hiệu", "Nghĩa", "Ví dụ"],
      rows: [
        ["**by** + năm / ngày / giờ", "tính tới, chậm nhất là", "**by 2050** · **by next Monday** · **by 6 p.m.**"],
        ["**by the end of** + khoảng", "tới cuối…", "**by the end of the decade** · by the end of this year"],
        ["**by then / by that time**", "tới lúc đó", "The project will have ended **by then**."],
        ["**by the time** + S + V hiện tại", "vào lúc mà…", "**By the time she graduates**, she will have written three papers."],
        ["**in** + khoảng + **'s time**", "sau … nữa", "**In five years' time** prices will have risen by a third."],
        ["**within** + khoảng", "trong vòng…", "The species will have disappeared **within a generation**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với will have + V3",
      items: [
        "Dùng **V nguyên mẫu** sau have: ~~will have finish~~ / ~~will have rise~~ → will have **finished** / will have **risen**.",
        "Chia **has** theo chủ ngữ số ít: ~~The figure will has doubled~~ → will **have** doubled (sau will luôn là nguyên mẫu **have**).",
        "Đặt **will** sau by the time: ~~By the time he will arrive…~~ → By the time he **arrives**, we will have left.",
        "Nhầm **by** (tính tới — đã xong trước mốc) với **in / at** (tại mốc): “The bridge **will open in** 2030” (mở năm 2030) ≠ “The bridge **will have opened by** 2030” (tới 2030 thì đã mở rồi, có thể mở từ 2028).",
        "Nhầm **by** với **until**: by = hạn chót của một việc **xong**; until = một việc **kéo dài tới**. “I will have finished **by** six.” · “I will be working **until** six.”",
        "Lạm dụng: việc bình thường sẽ xảy ra thì cứ **will + V**. Chỉ dùng will have + V3 khi câu có **mốc hạn** (by…) và ý “**đã xong trước đó**”.",
      ],
    },
    {
      t: "rule",
      formula: "S + will have + V3 + by + mốc tương lai · By the time + S + V(s/es), S + will have + V3",
      vi: "Tính tới mốc tương lai đó, việc đã hoàn thành. Vế by the time dùng hiện tại đơn, không will.",
    },
    {
      t: "quiz",
      id: "t3d5-hoan-thanh-dich",
      title: "Dịch sang tiếng Anh — tương lai hoàn thành (4 câu)",
      kind: "translate",
      grammar: "S + will have + V3 + by + mốc · By the time + S + V hiện tại đơn, S + will have + V3",
      items: [
        {
          q: "Tới năm 2035, dân số thành phố sẽ đạt mốc 12 triệu người rồi.",
          hint: "By 2035, the city's population, will have reached, 12 million",
          answers: ["By 2035, the city's population will have reached 12 million.", "By 2035 the city's population will have reached 12 million.", "By 2035, the population of the city will have reached 12 million.", "By 2035 the population of the city will have reached 12 million.", "The city's population will have reached 12 million by 2035.", "The population of the city will have reached 12 million by 2035.", "By 2035, the city's population will have reached 12 million people.", "The city's population will have reached 12 million people by 2035."],
        },
        {
          q: "Tôi sẽ viết xong bài luận trước 10 giờ tối nay.",
          hint: "I will have finished (writing), the essay, by 10 p.m. / by ten tonight",
          answers: ["I will have finished the essay by 10 p.m. tonight.", "I will have finished the essay by ten tonight.", "I will have finished the essay by 10 tonight.", "I will have finished writing the essay by 10 p.m. tonight.", "I will have finished writing the essay by ten tonight.", "I will have written the essay by 10 p.m. tonight.", "I will have written the essay by ten tonight.", "I'll have finished the essay by 10 p.m. tonight.", "I'll have finished the essay by ten tonight.", "I will have finished my essay by 10 p.m. tonight.", "I will have finished my essay by ten tonight.", "I will have finished the essay by 10 p.m.", "I will have finished the essay by 10 pm tonight."],
        },
        {
          q: "Tính tới lúc tốt nghiệp, cô ấy sẽ học tiếng Anh được sáu năm rồi.",
          hint: "By the time she graduates (hiện tại đơn), she will have studied / learned English, for six years",
          answers: ["By the time she graduates, she will have studied English for six years.", "By the time she graduates, she will have learned English for six years.", "By the time she graduates, she will have learnt English for six years.", "By the time she graduates, she will have been studying English for six years.", "By the time she graduates, she will have been learning English for six years.", "She will have studied English for six years by the time she graduates.", "She will have been studying English for six years by the time she graduates.", "She will have been learning English for six years by the time she graduates."],
        },
        {
          q: "Họ sẽ chưa xây xong cây cầu vào cuối năm nay.",
          hint: "They won't have finished building / won't have built, the bridge, by the end of this year",
          answers: ["They won't have finished building the bridge by the end of this year.", "They will not have finished building the bridge by the end of this year.", "They won't have built the bridge by the end of this year.", "They will not have built the bridge by the end of this year.", "They won't have finished the bridge by the end of this year.", "They will not have finished the bridge by the end of this year.", "They won't have completed the bridge by the end of this year.", "They will not have completed the bridge by the end of this year.", "They won't have finished building the bridge by the end of the year.", "They won't have built the bridge by the end of the year."],
        },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Tương lai hoàn thành tiếp diễn: will have been + V-ing" },
    {
      t: "p",
      text: "Thì thứ 12 của hệ 12 thì. Ý nghĩa: **tính tới mốc tương lai đó, một hành động đã kéo dài liên tục được bao lâu** (và có thể vẫn tiếp tục). Thường đi với **for + khoảng thời gian**. Thì này hiếm — ở band 6 bạn cần **nhận ra khi đọc, nghe** và dùng được **một câu chắc** khi nói về mình.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "By + mốc, S + will have been + V-ing + for + khoảng thời gian",
          vi: "Tới mốc đó, hành động đã kéo dài được … (nhấn độ dài).",
          examples: [
            { en: "By next June, I will have been learning English for eight years.", vi: "Tới tháng Sáu tới, tôi học tiếng Anh được tám năm." },
            { en: "By the time the factory closes, it will have been operating for a century.", vi: "Vào lúc nhà máy đóng cửa, nó sẽ hoạt động được tròn một thế kỷ." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "will have V3 hay will have been V-ing?",
      head: ["Muốn nhấn", "Dùng", "Ví dụ"],
      rows: [
        ["**kết quả, số lượng** đã đạt", "will have + V3", "By Friday I **will have written** four reports."],
        ["**độ dài** của hoạt động", "will have been + V-ing", "By Friday I **will have been writing** reports for two weeks."],
        ["động từ **trạng thái** (know, be, have)", "will have + V3 (không -ing)", "By May we **will have known** each other for ten years."],
      ],
    },
    {
      t: "rule",
      formula: "By + mốc, S + will have been + V-ing + for + khoảng thời gian",
      vi: "Tính tới mốc tương lai, hành động đã kéo dài bao lâu. Hiếm — nhận ra là chính, dùng một câu về bản thân là đủ.",
    },
    {
      t: "quiz",
      id: "t3d5-httd-dien",
      title: "Điền dạng đúng: will have V3 hoặc will have been V-ing (4 câu)",
      kind: "fill",
      items: [
        { q: "By the end of this course, we ___ (study) together for six months. — nhấn độ dài", answers: ["will have been studying", "'ll have been studying"] },
        { q: "By the end of this course, we ___ (complete) thirty lessons. — nhấn số lượng", answers: ["will have completed", "'ll have completed"] },
        { q: "Next year my parents ___ (be) married for thirty years.", answers: ["will have been", "'ll have been"] },
        { q: "By 2030 the company ___ (make) phones for half a century. — nhấn độ dài", answers: ["will have been making", "'ll have been making"] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Chọn đúng: will do · will be doing · will have done" },
    {
      t: "sodo",
      kind: "flow",
      title: "Ba câu hỏi để chọn thì",
      caption: "Hỏi lần lượt từ trái sang. Không có mốc thời gian và không nhấn “đang dở / đã xong” ⇒ cứ will + V.",
      steps: [
        { label: "Câu có **by + mốc** và ý “đã xong trước đó”?", sub: "→ will have + V3" },
        { label: "Câu có **mốc** và ý “lúc đó đang dở”, hoặc tả xu hướng?", sub: "→ will be + V-ing" },
        { label: "Chỉ nói việc sẽ xảy ra / dự đoán?", sub: "→ will + V" },
      ],
    },
    {
      t: "table",
      caption: "Cùng một động từ, ba nghĩa",
      head: ["Thì", "Câu", "Nghĩa tiếng Việt"],
      rows: [
        ["will + V", "The government **will build** 5,000 homes next year.", "Năm sau chính phủ **sẽ xây** 5.000 căn nhà."],
        ["will be + V-ing", "This time next year the government **will be building** the homes.", "Giờ này năm sau chính phủ **đang xây** (chưa xong)."],
        ["will have + V3", "By 2030 the government **will have built** 5,000 homes.", "Tới 2030 chính phủ **đã xây xong** 5.000 căn."],
        ["will have been + V-ing", "By 2030 the government **will have been building** homes there for ten years.", "Tới 2030 chính phủ xây nhà ở đó **được mười năm**."],
      ],
    },
    {
      t: "mcq",
      id: "t3d5-chon-thi",
      title: "Chọn thì đúng (8 câu)",
      items: [
        { q: "Don't phone me at seven. I ___ dinner with my host family.", options: ["A will have", "B will be having", "C will have had", "D have"], correct: 1, why: "Có mốc “at seven” và ý **đang ăn dở** lúc đó → will be having." },
        { q: "By the end of this year, I ___ in this company for exactly five years.", options: ["A will work", "B will be working", "C am working", "D will have worked"], correct: 3, why: "**By the end of this year** + **for five years** → tính tới mốc, đã được bao lâu → will have worked." },
        { q: "By the time the film ___, we will have eaten all the popcorn.", options: ["A starts", "B will start", "C will have started", "D will be starting"], correct: 0, why: "Sau **by the time** dùng **hiện tại đơn**, không will." },
        { q: "In 2050, many more people ___ in cities than today.", options: ["A will have been lived", "B will living", "C will be living", "D will have live"], correct: 2, why: "Xu hướng đang diễn ra ở mốc tương lai → will be living. B thiếu be; D sai V3; A sai dạng." },
        { q: "The price of solar panels ___ by a further 20% by 2030, according to the forecast.", options: ["A will have fallen", "B will be fall", "C falls", "D will falling"], correct: 0, why: "**by 2030** + ý đã giảm xong tính tới mốc → will have fallen (fall – fell – fallen)." },
        { q: "___ the car tomorrow morning? I'd like to borrow it if you don't need it.", options: ["A Will you have used", "B Do you use", "C Will you use to", "D Will you be using"], correct: 3, why: "Hỏi **lịch trình** một cách lịch sự trước khi nhờ → Will you be using…?" },
        { q: "I'm sure she ___ the exam. She has worked so hard.", options: ["A will be passing", "B will pass", "C will have been passing", "D passes"], correct: 1, why: "Dự đoán theo ý kiến, không có mốc “đang dở / đã xong” → will pass." },
        { q: "By next month, the team ___ on this project for a whole year.", options: ["A will work", "B is working", "C will have been working", "D will be worked"], correct: 2, why: "**By next month** + **for a whole year** + nhấn độ dài của hoạt động → will have been working." },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Dự báo trong Writing Task 1: biểu đồ có năm tương lai" },
    {
      t: "p",
      text: "Một phần đáng kể đề Task 1 theo thời gian có **năm sau hiện tại** (2030, 2040, 2050). Tập 2 Ngày 4 và Ngày 7 đã cho bạn mức nhập: **is expected to + V** và **will + V**. Band 6 cần thêm ba việc: (1) **đủ loại khung dự báo** để không lặp; (2) **dạng danh từ** “a projected rise to…”; (3) **đổi thì ngay trong một câu** khi một đường đi từ quá khứ sang tương lai.",
    },
    {
      t: "note",
      title: "Vì sao không viết toàn will? Vì sao không viết quá khứ?",
      items: [
        "Số liệu tương lai **chưa xảy ra** — nó là **dự đoán của người làm biểu đồ**. Viết quá khứ (~~In 2040 the figure rose to 32%~~) là **sai thông tin** → mất điểm Task Achievement.",
        "Viết toàn **will** thì đúng ngữ pháp nhưng (a) lặp, (b) nghe như **bạn** cam đoan. Văn học thuật dùng **bị động dự báo**: is expected / projected / predicted / forecast to — “được dự kiến”, ý nói có người dự báo.",
        "Bước đầu tiên khi nhận đề: **khoanh năm hiện tại** trên trục. Mọi thứ bên trái = quá khứ đơn; bên phải = ngôn ngữ dự báo.",
      ],
    },
    {
      t: "chart",
      kind: "line",
      title: "Share of electricity from three sources in one country, 2000–2040 (figures for 2030 and 2040 are projections)",
      unit: "%",
      labels: ["2000", "2010", "2020", "2030*", "2040*"],
      series: [
        { name: "Coal", values: [48, 42, 31, 22, 14] },
        { name: "Solar", values: [1, 4, 15, 26, 35] },
        { name: "Nuclear", values: [20, 21, 19, 20, 20] },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + is / are + expected / projected / predicted / forecast / anticipated + to + V",
          vi: "Khung ① — bị động dự báo (ôn Tập 2 Ngày 4 và Ngày 7, thêm **anticipated**). Năm từ gần nghĩa: luân phiên để không lặp.",
          examples: [
            { en: "The share of solar power is projected to reach 35% by 2040.", vi: "Tỉ trọng điện mặt trời được dự phóng đạt 35% vào năm 2040." },
            { en: "Coal is forecast to fall to just 14%.", vi: "Than được dự báo giảm xuống chỉ còn 14%." },
          ],
        },
        {
          formula: "S + is / are + likely / set + to + V",
          vi: "Khung ② — **likely to** (có khả năng) · **set to** (sắp, gần như chắc chắn — hay gặp trong báo chí kinh tế).",
          examples: [
            { en: "Nuclear power is likely to remain stable at around 20%.", vi: "Điện hạt nhân có khả năng giữ ổn định quanh mức 20%." },
            { en: "Solar is set to overtake coal before 2030.", vi: "Điện mặt trời sắp vượt than trước năm 2030." },
          ],
        },
        {
          formula: "It is + expected / predicted / estimated + that + S + will + V",
          vi: "Khung ③ — chủ ngữ giả **It** + mệnh đề that. Trong mệnh đề that dùng **will**.",
          examples: [{ en: "It is predicted that solar power will account for over a third of electricity in 2040.", vi: "Người ta dự đoán điện mặt trời sẽ chiếm hơn một phần ba sản lượng điện vào năm 2040." }],
        },
        {
          formula: "S + will have + V3 + by + năm",
          vi: "Khung ④ — tương lai hoàn thành: nhấn **kết quả tích luỹ** tới năm cuối (đã tăng gấp đôi, đã giảm một nửa).",
          examples: [{ en: "By 2040, the share of coal will have more than halved compared with 2020.", vi: "Tới năm 2040, tỉ trọng than sẽ giảm còn chưa tới một nửa so với năm 2020." }],
        },
        {
          formula: "…, followed by a projected / predicted / forecast + rise / fall + to + số",
          vi: "Khung ⑤ — **dạng danh từ** (mới): biến động từ dự báo thành tính từ đứng trước danh từ xu hướng. Gọn, nối hai giai đoạn trong một câu.",
          examples: [
            { en: "Solar power grew to 15% in 2020, followed by a projected rise to 35% by 2040.", vi: "Điện mặt trời tăng lên 15% năm 2020, tiếp theo là mức tăng dự báo lên 35% vào năm 2040." },
            { en: "Coal stood at 31% in 2020, with a projection of 14% for 2040.", vi: "Than ở mức 31% năm 2020, với con số dự báo 14% cho năm 2040." },
          ],
        },
        {
          formula: "S + V2 (quá khứ) …, before being expected / projected + to + V",
          vi: "Khung ⑥ — **đổi thì giữa câu** (mới): vế đầu quá khứ đơn, vế sau **before being expected to** (trước khi được dự kiến sẽ…). Tả trọn một đường trong một câu.",
          examples: [
            { en: "The figure for coal fell steadily to 31% in 2020, before being expected to drop to 14% by 2040.", vi: "Số liệu của than giảm đều xuống 31% năm 2020, trước khi được dự kiến tụt xuống 14% vào năm 2040." },
            { en: "Solar power rose from 1% to 15% and is projected to continue climbing to 35%.", vi: "Điện mặt trời tăng từ 1% lên 15% và được dự phóng tiếp tục leo lên 35%." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Dạng động từ → dạng danh từ của ngôn ngữ dự báo",
      head: ["Động từ (bị động)", "Tính từ + danh từ", "Danh từ"],
      rows: [
        ["is **projected** to rise", "a **projected** rise / increase / fall", "a **projection** of 35% · **projections** suggest that…"],
        ["is **predicted** to fall", "a **predicted** fall / decline", "a **prediction** · according to **predictions**"],
        ["is **forecast** to reach", "the **forecast** figure / level", "a **forecast** of 14% · the **forecast** shows…"],
        ["is **expected** to remain", "the **expected** level · an expected rise", "**expectations** are that…"],
        ["is **estimated** to be", "an **estimated** 20%", "an **estimate** of 20%"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — 6 lỗi dự báo làm mất điểm Task 1",
      items: [
        "**forecast** là động từ bất quy tắc: forecast – **forecast** – **forecast** (forecasted có tồn tại nhưng hiếm). Viết: is **forecast** to rise.",
        "Thiếu **to**: ~~is expected reach~~ → is expected **to reach**. Thiếu **be**: ~~Solar expected to rise~~ → Solar **is** expected to rise.",
        "Thừa will: ~~is expected to will rise~~ / ~~will is expected~~. Chọn **một**: will rise **hoặc** is expected to rise.",
        "Dùng chủ động: ~~The figure expects to rise~~ (con số không tự “mong đợi”) → The figure **is expected** to rise.",
        "**predict / project** + that: ~~It is predicted to solar will rise~~ → It is predicted **that** solar **will** rise.",
        "Overview phải bao **cả hai giai đoạn**: “Overall, solar power **has grown and is expected to continue growing**, while coal **has declined and is forecast to keep falling**.” Overview chỉ nói quá khứ = bỏ sót nửa biểu đồ.",
      ],
    },
    {
      t: "p",
      text: "**Đoạn mẫu band 6 (thân bài cho biểu đồ trên, khoảng 100 từ).** Chú ý: mỗi đường **một câu trọn** đi từ quá khứ sang dự báo; năm khung dự báo khác nhau (⑥ before being expected to · ⑤ followed by a projected rise · ③ It is predicted that · ② is likely to · ④ will have + V3), không khung nào lặp.",
    },
    {
      t: "examples",
      items: [
        { en: "In 2000, coal produced almost half of the country's electricity (48%), but its share fell steadily to 31% in 2020, before being expected to drop to just 14% by 2040.", vi: "Năm 2000 than tạo ra gần một nửa sản lượng điện (48%), nhưng tỉ trọng giảm đều xuống 31% năm 2020, trước khi được dự kiến tụt xuống chỉ còn 14% vào năm 2040." },
        { en: "Solar power, by contrast, grew from only 1% to 15% over the first two decades, followed by a projected rise to 35% at the end of the period.", vi: "Ngược lại, điện mặt trời tăng từ chỉ 1% lên 15% trong hai thập kỷ đầu, tiếp theo là mức tăng dự báo lên 35% vào cuối giai đoạn." },
        { en: "It is predicted that solar will overtake coal shortly before 2030.", vi: "Người ta dự đoán điện mặt trời sẽ vượt than ngay trước năm 2030." },
        { en: "Nuclear power remained close to 20% throughout and is likely to stay at this level.", vi: "Điện hạt nhân giữ quanh mức 20% suốt giai đoạn và có khả năng vẫn ở mức này." },
        { en: "By 2040, therefore, the share of coal will have more than halved compared with 2020.", vi: "Vì vậy tới năm 2040, tỉ trọng than sẽ giảm còn chưa tới một nửa so với năm 2020." },
      ],
    },
    {
      t: "rule",
      formula: "S + V2 … in 2020, before being projected to + V … by 2040 · …, followed by a projected rise to + số",
      vi: "Một đường – một câu: quá khứ đơn cho phần đã xảy ra, ngôn ngữ dự báo (bị động hoặc dạng danh từ) cho phần tương lai.",
    },
    {
      t: "quiz",
      id: "t3d5-du-bao-dich",
      title: "Dịch sang tiếng Anh — dự báo Task 1 (5 câu)",
      kind: "translate",
      grammar: "is projected / expected / forecast to + V · It is predicted that + S + will + V · followed by a projected rise to · before being expected to + V · will have + V3 by",
      items: [
        {
          q: "Số người dùng xe buýt được dự báo giảm xuống 2 triệu vào năm 2035.",
          hint: "The number of bus users / passengers, is forecast to fall, to 2 million, by 2035",
          answers: ["The number of bus users is forecast to fall to 2 million by 2035.", "The number of bus passengers is forecast to fall to 2 million by 2035.", "The number of bus users is projected to fall to 2 million by 2035.", "The number of bus users is expected to fall to 2 million by 2035.", "The number of bus users is predicted to fall to 2 million by 2035.", "The number of bus passengers is projected to fall to 2 million by 2035.", "The number of bus passengers is expected to fall to 2 million by 2035.", "The number of bus passengers is predicted to fall to 2 million by 2035.", "The number of bus users is forecast to drop to 2 million by 2035.", "The number of bus users is expected to drop to 2 million by 2035.", "The number of bus users is forecast to decrease to 2 million by 2035.", "The number of bus users is expected to decrease to 2 million by 2035.", "The number of people using buses is forecast to fall to 2 million by 2035.", "The number of people using buses is expected to fall to 2 million by 2035."],
        },
        {
          q: "Người ta dự đoán rằng giá nhà sẽ tiếp tục tăng.",
          hint: "It is predicted that, house prices, will continue to rise / increase",
          answers: ["It is predicted that house prices will continue to rise.", "It is predicted that house prices will continue to increase.", "It is predicted that house prices will continue rising.", "It is predicted that house prices will keep rising.", "It is expected that house prices will continue to rise.", "It is expected that house prices will continue to increase.", "It is predicted that housing prices will continue to rise.", "It is predicted that the price of houses will continue to rise.", "It is forecast that house prices will continue to rise."],
        },
        {
          q: "Con số này tăng lên 40% vào năm 2020, tiếp theo là một mức tăng dự báo lên 55% vào năm 2040.",
          hint: "The figure rose to 40% in 2020, followed by a projected rise to 55% by / in 2040",
          answers: ["The figure rose to 40% in 2020, followed by a projected rise to 55% by 2040.", "The figure rose to 40% in 2020, followed by a projected rise to 55% in 2040.", "This figure rose to 40% in 2020, followed by a projected rise to 55% by 2040.", "This figure rose to 40% in 2020, followed by a projected rise to 55% in 2040.", "The figure increased to 40% in 2020, followed by a projected rise to 55% by 2040.", "The figure increased to 40% in 2020, followed by a projected increase to 55% by 2040.", "The figure rose to 40% in 2020, followed by a projected increase to 55% by 2040.", "The figure rose to 40% in 2020, followed by a predicted rise to 55% by 2040.", "The figure rose to 40% in 2020, followed by a forecast rise to 55% by 2040.", "This figure increased to 40% in 2020, followed by a projected rise to 55% by 2040.", "This figure increased to 40% in 2020, followed by a projected increase to 55% by 2040."],
        },
        {
          q: "Doanh số giảm xuống 3 triệu năm 2022, trước khi được dự kiến phục hồi lên 5 triệu vào năm 2030.",
          hint: "Sales fell to 3 million in 2022, before being expected to recover to 5 million by 2030",
          answers: ["Sales fell to 3 million in 2022, before being expected to recover to 5 million by 2030.", "Sales fell to 3 million in 2022 before being expected to recover to 5 million by 2030.", "Sales fell to 3 million in 2022, before being projected to recover to 5 million by 2030.", "Sales fell to 3 million in 2022, before being predicted to recover to 5 million by 2030.", "Sales fell to 3 million in 2022, before being forecast to recover to 5 million by 2030.", "Sales dropped to 3 million in 2022, before being expected to recover to 5 million by 2030.", "Sales decreased to 3 million in 2022, before being expected to recover to 5 million by 2030.", "Sales declined to 3 million in 2022, before being expected to recover to 5 million by 2030.", "Sales fell to 3 million in 2022, before being expected to recover to 5 million in 2030."],
        },
        {
          q: "Tới năm 2050, số người trên 65 tuổi sẽ tăng gấp ba rồi.",
          hint: "By 2050, the number of people (aged) over 65, will have tripled",
          answers: ["By 2050, the number of people over 65 will have tripled.", "By 2050 the number of people over 65 will have tripled.", "By 2050, the number of people aged over 65 will have tripled.", "By 2050 the number of people aged over 65 will have tripled.", "The number of people over 65 will have tripled by 2050.", "The number of people aged over 65 will have tripled by 2050.", "By 2050, the number of people over 65 will have trebled.", "By 2050, the number of people aged over 65 will have trebled.", "By 2050, the number of over-65s will have tripled.", "By 2050, the number of people over the age of 65 will have tripled."],
        },
      ],
    },
    {
      t: "quiz",
      id: "t3d5-du-bao-dien",
      title: "Điền MỘT từ vào đoạn mô tả biểu đồ có dự báo (8 chỗ trống)",
      kind: "fill",
      items: [
        { q: "1. The number of online shoppers ___ (động từ quá khứ của rise) from 10 million in 2010 to 25 million in 2020.", answers: ["rose"] },
        { q: "2. It is ___ to reach 40 million by 2035. (được dự kiến — bắt đầu bằng e)", answers: ["expected"] },
        { q: "3. High-street sales fell to £50 billion in 2020, followed by a ___ fall to £35 billion in 2035. (tính từ, bắt đầu bằng p)", answers: ["projected", "predicted"] },
        { q: "4. It is predicted ___ online sales will overtake high-street sales in 2027.", answers: ["that"] },
        { q: "5. Catalogue sales stood at £5 billion in 2020, before ___ expected to disappear almost completely.", answers: ["being"] },
        { q: "6. By 2035, online sales will ___ quadrupled compared with 2010.", answers: ["have"] },
        { q: "7. Spending on delivery is forecast ___ rise sharply.", answers: ["to"] },
        { q: "8. Overall, online shopping has grown and is ___ to continue growing. (có khả năng — bắt đầu bằng l)", answers: ["likely"] },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Dùng khi nói: Speaking Part 3 “How will … change in the future?”" },
    {
      t: "p",
      text: "Giám khảo Part 3 rất hay hỏi dự đoán. Câu trả lời band 5 thường là một chuỗi **will + V**. Band 6 trộn: **will probably** (ý kiến) + **will be V-ing** (xu hướng lúc đó) + **will have V3** (thứ đã thay đổi xong) + một câu **mức độ chắc** (is likely to / may well / I doubt… will).",
    },
    {
      t: "dialogue",
      title: "Một câu trả lời Part 3 dùng đủ ba thì tương lai",
      lines: [
        { who: "Examiner", role: "examiner", text: "How do you think the way people shop will change over the next twenty years?", vi: "Bạn nghĩ cách mọi người mua sắm sẽ thay đổi thế nào trong hai mươi năm tới?" },
        { who: "Candidate", role: "candidate", text: "I think the biggest change is that most people will be doing nearly all of their shopping online. By 2045, a lot of traditional shops will probably have closed, especially the small ones that can't compete on price. That said, I doubt physical shops will disappear completely, because people will still want to try clothes on. So shopping centres are likely to become places for eating and entertainment rather than just buying things.", vi: "Tôi nghĩ thay đổi lớn nhất là đa số mọi người sẽ mua gần như mọi thứ qua mạng. Tới năm 2045, nhiều cửa hàng truyền thống có lẽ đã đóng cửa rồi, nhất là các cửa hàng nhỏ không cạnh tranh nổi về giá. Tuy vậy, tôi không nghĩ cửa hàng thật sẽ biến mất hẳn, vì người ta vẫn muốn thử quần áo. Nên trung tâm thương mại có khả năng trở thành nơi ăn uống, giải trí chứ không chỉ để mua đồ." },
      ],
    },
    {
      t: "table",
      caption: "Thang độ chắc — nâng từ Tập 2 Ngày 7",
      head: ["Mức", "Cụm band 6", "Ví dụ"],
      rows: [
        ["Rất chắc", "will certainly / is bound to", "Technology **is bound to** play a bigger role."],
        ["Khá chắc", "will probably / is likely to / may well", "Prices **may well** rise again."],
        ["50–50", "may / might / could", "Some jobs **could** disappear."],
        ["Khó xảy ra", "is unlikely to / I doubt (that)… will", "**I doubt** cash **will** disappear completely."],
      ],
    },
    {
      t: "rule",
      formula: "In + N + years' time, S + will be + V-ing · By then, S + will (probably) have + V3 · S + is likely to + V",
      vi: "Khung trả lời câu hỏi dự đoán ở Part 3: xu hướng lúc đó + thứ đã thay đổi xong + mức độ chắc.",
    },

    /* ── 8 ── */
    { t: "h", text: "8. Luyện tổng hợp" },
    {
      t: "quiz",
      id: "t3d5-chia-dong-tu",
      title: "Chia động từ trong ngoặc: will V · will be V-ing · will have V3 · hiện tại đơn (10 câu)",
      kind: "fill",
      items: [
        { q: "1. This time next month, I ___ (travel) around Japan.", answers: ["will be travelling", "will be traveling", "'ll be travelling", "'ll be traveling"] },
        { q: "2. By the time we ___ (get) to the station, the train will have left.", answers: ["get"] },
        { q: "3. By 2030, the company ___ (open) fifty new stores.", answers: ["will have opened", "'ll have opened"] },
        { q: "4. Don't worry, I ___ (help) you with the slides. — lời hứa ngay lúc nói", answers: ["will help", "'ll help"] },
        { q: "5. At 10 a.m. tomorrow, the students ___ (take) their final exam.", answers: ["will be taking", "'ll be taking"] },
        { q: "6. Scientists believe that by the end of the century sea levels ___ (rise) by up to one metre.", answers: ["will have risen", "'ll have risen"] },
        { q: "7. ___ (you / pass) the post office on your way home? Could you post this for me? — hỏi lịch trình lịch sự", answers: ["Will you be passing", "will you be passing"] },
        { q: "8. In fifty years' time, people ___ (live) much longer than they do today.", answers: ["will be living", "will live", "'ll be living"] },
        { q: "9. She ___ (not finish) her thesis by June; she needs at least until September.", answers: ["won't have finished", "will not have finished"] },
        { q: "10. As soon as the results ___ (be) ready, we will email you.", answers: ["are"] },
      ],
    },
    {
      t: "mcq",
      id: "t3d5-sua-loi",
      title: "Câu nào ĐÚNG? (6 câu)",
      items: [
        { q: "1.", options: ["A By 2040 the population will has doubled.", "B By 2040 the population will have doubled.", "C By 2040 the population will have double.", "D By 2040 the population will doubled."], correct: 1, why: "will + **have** (nguyên mẫu) + **V3** (doubled)." },
        { q: "2.", options: ["A The figure is expected reach 60%.", "B The figure expects to reach 60%.", "C The figure is expected to will reach 60%.", "D The figure is expected to reach 60%."], correct: 3, why: "Bị động dự báo: **is expected + to + V**. Không thiếu to, không thêm will, không dùng chủ động." },
        { q: "3.", options: ["A This time tomorrow I will be lying on the beach.", "B This time tomorrow I will lying on the beach.", "C This time tomorrow I will be lie on the beach.", "D This time tomorrow I am lie on the beach."], correct: 0, why: "**will be + V-ing**; lie → lying." },
        { q: "4.", options: ["A By the time she will retire, she will have taught for 40 years.", "B By the time she retires, she will teach for 40 years.", "C By the time she retires, she will have taught for 40 years.", "D By the time she retired, she will have taught for 40 years."], correct: 2, why: "by the time + **hiện tại đơn**; vế chính **will have taught**." },
        { q: "5.", options: ["A Sales fell in 2020, before being projected to recover.", "B Sales fell in 2020, before be projected to recover.", "C Sales fell in 2020, before projecting to recover.", "D Sales fell in 2020, before are projected to recover."], correct: 0, why: "Sau giới từ **before** là **V-ing**: before **being** projected to + V." },
        { q: "6.", options: ["A In 2040 the share of solar rose to 35%.", "B In 2040 the share of solar is rising to 35%.", "C In 2040 the share of solar has risen to 35%.", "D In 2040 the share of solar is forecast to rise to 35%."], correct: 3, why: "2040 là tương lai → ngôn ngữ dự báo. A (quá khứ) và C (hiện tại hoàn thành) nói như việc đã xảy ra — sai thông tin; B (hiện tại tiếp diễn) không phải cách tả số dự báo." },
      ],
    },
    {
      t: "note",
      title: "Mẹo tự soát sau khi viết",
      items: [
        "Gạch chân mọi **by + năm tương lai** trong bài → động từ của câu đó nên là **will have + V3** hoặc **is expected to + V**, không phải quá khứ.",
        "Gạch chân mọi **will** → ngay sau phải là **nguyên mẫu** (will be / will have / will rise), không bao giờ là V-s, V-ed, V-ing.",
        "Đếm: bài Task 1 có dự báo nên có **ít nhất 3 khung dự báo khác nhau**; câu trả lời Part 3 về tương lai nên có **ít nhất một** will be V-ing hoặc will have V3.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Đọc ─────────────────────────── */

const T3D5_DOC: Lesson = {
  id: "t3d5-doc",
  kind: "reading",
  title: "Đọc: Matching headings 2 — ý chính và chi tiết",
  goal: "Tách được ý chính của một đoạn 100–130 từ khỏi các chi tiết minh hoạ, loại được 6 kiểu tiêu đề bẫy, và làm 7 câu Matching headings + 6 câu chi tiết của một bài đọc ~800 từ trong 20 phút với ít nhất 9/13 câu đúng — mức Reading band 6.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Matching headings** (ghép tiêu đề với đoạn) là dạng hỏi **ý chính** của từng đoạn. Tập 2 Ngày 12 bạn đã làm lần đầu với bài ~530 từ, 6 đoạn, 8 tiêu đề (thừa 2).",
        "Mức band 6: bài **~800 từ**, **7 đoạn**, **10 tiêu đề** (thừa 3), tiêu đề **không trùng chữ** với bài mà paraphrase, và tiêu đề bẫy lấy **một chi tiết có thật** trong đoạn.",
        "Kỹ năng lõi hôm nay: ==ý chính== (đoạn này nói **điều gì** về chủ đề) khác ==chi tiết== (ví dụ, con số, tên riêng dùng để **chứng minh** ý chính).",
        "Bốn kiểu đoạn văn và chỗ ý chính nằm · quy trình 6 bước · **6 bẫy** (trùng chữ, chi tiết, đúng một nửa, quá rộng, trái nghĩa, đúng cho đoạn khác).",
        "Đẩy band: **Reading 5.0 → 6.0**. Matching headings thường đứng **đầu** bộ câu hỏi của Passage 2 hoặc 3; làm đúng dạng này bạn cũng có luôn **bản đồ bài đọc** cho các câu sau.",
      ],
    },

    { t: "h", text: "1. Ôn nhanh: Matching headings là gì? (Tập 2 Ngày 12)" },
    {
      t: "p",
      text: "Đề cho một **List of Headings** đánh số La Mã (i, ii, iii…) và yêu cầu chọn tiêu đề đúng cho mỗi đoạn A, B, C… **Số tiêu đề luôn nhiều hơn số đoạn**; mỗi tiêu đề dùng **tối đa một lần**. Khác mọi dạng khác, câu hỏi nằm **trước** bài đọc, và đáp án **không nằm ở một câu** mà ở **cả đoạn**.",
    },
    {
      t: "table",
      caption: "Tập 2 → Tập 3: cùng một dạng, khó lên ở đâu?",
      head: ["", "Tập 2 Ngày 12 (band 5)", "Tập 3 Ngày 5 (band 6)"],
      rows: [
        ["Độ dài bài", "~530 từ, 6 đoạn", "~800 từ, 7 đoạn 90–130 từ"],
        ["Tiêu đề", "8, thừa 2", "10, thừa 3"],
        ["Chữ trong tiêu đề", "hay gần chữ trong bài", "**paraphrase** — gần như không trùng chữ"],
        ["Chỗ ý chính", "thường câu đầu", "câu đầu · sau **However / Yet** · câu cuối · rải cả đoạn"],
        ["Bẫy", "trùng chữ", "trùng chữ + **chi tiết có thật** + đúng một nửa + trái nghĩa"],
      ],
    },

    { t: "h", text: "2. Ý chính và chi tiết — phân biệt thế nào?" },
    {
      t: "p",
      text: "Mỗi đoạn văn học thuật trả lời **một câu hỏi** về chủ đề của bài. Câu trả lời đó là **ý chính** (main idea). Mọi thứ còn lại — ví dụ, số liệu, tên người, năm tháng, lời giải thích — là **chi tiết hỗ trợ** (supporting details). Phép thử nhanh: ==che chi tiết đó đi, đoạn văn còn đứng được không?== Còn đứng được ⇒ nó là chi tiết. Một tiêu đề đúng phải **đúng cho gần hết các câu trong đoạn**, không chỉ một câu.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Ý chính vs chi tiết",
      cols: [
        { title: "Ý chính (main idea)", items: ["Trả lời: đoạn này **nói gì** về chủ đề?", "Câu **khái quát**: chủ ngữ rộng, động từ nhận định", "Thường ở câu chủ đề (topic sentence)", "Che đi ⇒ đoạn **mất hướng**", "**Tiêu đề đúng paraphrase cái này**"] },
        { title: "Chi tiết (supporting detail)", items: ["Trả lời: **bằng chứng** nào? ví dụ nào?", "Câu **cụ thể**: tên riêng, năm, con số, for example", "Nằm sau câu chủ đề", "Che đi ⇒ đoạn **vẫn hiểu được**", "**Tiêu đề bẫy lấy chữ ở đây**"] },
      ],
    },
    {
      t: "table",
      caption: "Bốn kiểu đoạn văn — ý chính nằm ở đâu",
      head: ["Kiểu đoạn", "Dấu hiệu", "Ý chính ở"],
      rows: [
        ["① **Nêu rồi chứng minh**", "Câu đầu khái quát; sau đó For example, such as, số liệu", "**Câu đầu**"],
        ["② **Đảo chiều**", "Câu đầu nêu ý cũ / ý nhiều người nghĩ; rồi **However, Yet, But, In fact**", "**Ngay sau từ đảo chiều** — câu đầu chỉ là bước đệm"],
        ["③ **Dẫn rồi kết**", "Mở bằng một câu chuyện, ví dụ, câu hỏi; cuối đoạn mới khái quát (**therefore, this shows, in short**)", "**Câu cuối**"],
        ["④ **Hai nửa**", "Nửa đầu một ý, nửa sau một ý liên quan (nguyên nhân → hệ quả; vấn đề → giải pháp)", "**Cả hai** — tiêu đề đúng phải bao cả hai nửa (hoặc nửa được nhấn mạnh hơn)"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: tìm “câu hỏi ẩn” của đoạn",
      items: [
        "Đọc xong một đoạn, tự hỏi bằng tiếng Việt: **“Đoạn này trả lời câu hỏi gì?”** — vì sao? thế nào? hậu quả gì? giải pháp gì? hạn chế gì?",
        "Tiêu đề thường bắt đầu bằng đúng loại chữ đó: **Why…** / **How…** / **The effects of…** / **A solution to…** / **The limits of…**. Loại câu hỏi không khớp ⇒ loại tiêu đề.",
        "Ví dụ: đoạn giải thích **vì sao** chi phí tăng mà tiêu đề lại là **How costs are calculated** (tính thế nào) ⇒ sai loại câu hỏi, dù cùng chữ cost.",
      ],
    },

    { t: "h", text: "3. Quy trình 6 bước mức band 6" },
    {
      t: "sodo",
      kind: "flow",
      title: "Matching headings — 6 bước",
      caption: "Khoảng 1,5 phút mỗi đoạn. Bước 5 là bước người band 5 hay bỏ: chưa chắc thì ghi HAI ứng viên rồi đi tiếp.",
      steps: [
        { label: "① Đọc **tiêu đề** trước", sub: "gạch từ khoá, đoán loại câu hỏi (why / how / problem / solution)" },
        { label: "② Nhóm các tiêu đề **giống nhau**", sub: "hai tiêu đề cùng chữ ⇒ một cái là bẫy" },
        { label: "③ Đọc **đoạn dễ nhất** trước", sub: "câu đầu + câu cuối + từ đảo chiều" },
        { label: "④ Tự tóm tắt **3–6 từ**", sub: "bằng tiếng Việt cũng được, TRƯỚC khi nhìn lại danh sách" },
        { label: "⑤ Ghép · chưa chắc thì ghi **2 ứng viên**", sub: "vd: C = v / iv ?" },
        { label: "⑥ Gạch tiêu đề đã dùng · quay lại đoạn treo", sub: "mỗi tiêu đề dùng một lần" },
      ],
    },
    {
      t: "note",
      title: "Vì sao phải tự tóm tắt TRƯỚC khi nhìn danh sách?",
      items: [
        "Nếu vừa đọc đoạn vừa nhìn danh sách, mắt bạn sẽ **bắt chữ trùng** và chọn theo chữ — đúng cái bẫy người ra đề đặt.",
        "Tự tóm tắt trước buộc bạn nắm **ý**; sau đó chỉ việc tìm tiêu đề **cùng ý** với tóm tắt của mình.",
        "Tóm tắt tốt có **động từ hoặc quan hệ**: “chi phí **tăng** vì khó tiếp cận người dân” — không chỉ là “chi phí”.",
      ],
    },

    { t: "h", text: "4. Sáu kiểu tiêu đề bẫy" },
    {
      t: "table",
      caption: "Nhận mặt bẫy — đoạn mẫu: “Cycling to work has become far more common in the city. The main reason is not health but money: a monthly bus pass now costs twice what it did in 2015, while a second-hand bike pays for itself within weeks. Dutch cities, where 40% of trips are by bike, show how far the trend could go.”",
      head: ["Bẫy", "Tiêu đề bẫy", "Vì sao sai"],
      rows: [
        ["① **Trùng chữ**", "The price of a monthly bus pass", "Lấy đúng chữ trong đoạn, nhưng đó chỉ là **một bằng chứng**"],
        ["② **Chi tiết / ví dụ**", "Cycling in Dutch cities", "Hà Lan chỉ là **ví dụ** ở câu cuối"],
        ["③ **Đúng một nửa**", "Health and financial reasons for cycling", "Đoạn nói **không phải** sức khoẻ mà là tiền"],
        ["④ **Quá rộng**", "Transport in modern cities", "Đúng chủ đề nhưng đoạn nào của bài cũng vừa — không nói được **điều riêng** của đoạn này"],
        ["⑤ **Trái nghĩa**", "Why fewer people are choosing to cycle", "Ngược hướng: đoạn nói **nhiều người hơn**"],
        ["⑥ **Đúng cho đoạn khác**", "What the city is doing to support cyclists", "Có thể là ý của **đoạn sau** — đoạn này chưa nói tới chính quyền"],
        ["✅ **Đúng**", "The economic motive behind a growing habit", "growing habit = far more common; economic motive = not health but money"],
      ],
    },
    {
      t: "rule",
      formula: "Tiêu đề đúng = paraphrase của Ý CHÍNH, đúng cho gần hết cả đoạn · Tiêu đề bẫy = chữ trùng với MỘT chi tiết",
      vi: "Thấy tiêu đề trùng nhiều chữ với một câu trong đoạn thì nghi trước, tin sau.",
    },

    { t: "h", text: "5. Khởi động: ba đoạn ngắn" },
    {
      t: "p",
      text: "Mỗi đoạn dưới đây dài 50–70 từ. Đọc, **tự tóm tắt 3–6 từ**, rồi mới chọn tiêu đề. Phần giải thích ghi rõ bạn vừa tránh bẫy số mấy.",
    },
    {
      t: "mcq",
      id: "t3d5-doc-khoi-dong",
      title: "Chọn tiêu đề đúng nhất (3 đoạn)",
      items: [
        {
          q: "1. “For decades, nutrition advice assumed that all calories were equal. Recent studies, however, suggest that when we eat may matter almost as much as what we eat. Volunteers who consumed most of their food before 3 p.m. lost more weight than those who ate the same meals later, even though their total intake was identical.”",
          options: ["A The assumption that all calories are equal", "B The importance of meal timing", "C How to count the calories in a meal", "D Why volunteers took part in diet studies"],
          correct: 1,
          why: "Đoạn kiểu ② **đảo chiều**: ý chính nằm sau **however** — “when we eat may matter” = meal timing. A là ý cũ ở câu đệm (bẫy trùng chữ). C, D không có trong đoạn.",
        },
        {
          q: "2. “In 2019 a small town in Wales replaced every street light with low-energy lamps that dim after midnight. Within a year its electricity bill had fallen by 60%, and local astronomers reported seeing stars that had been invisible for a generation. The experiment shows that modest technical changes can bring benefits far beyond the savings that justified them.”",
          options: ["A A Welsh town and its street lights", "B How astronomers study the night sky", "C The falling cost of electricity", "D Small changes with unexpectedly wide benefits"],
          correct: 3,
          why: "Đoạn kiểu ③ **dẫn rồi kết**: câu cuối “The experiment shows that modest technical changes can bring benefits far beyond…” = small changes, wide benefits. A là bẫy **chi tiết / ví dụ**; C bẫy trùng chữ (hoá đơn giảm, không phải giá điện giảm).",
        },
        {
          q: "3. “Remote working has removed the daily commute for millions of employees, giving them back an average of an hour a day. Many spend that hour not on rest, however, but on extra work, and surveys report rising levels of loneliness among those who rarely see colleagues in person.”",
          options: ["A The time saved by not commuting", "B Why employers dislike remote working", "C A gain in time that comes at a personal cost", "D Loneliness in modern society"],
          correct: 2,
          why: "Đoạn kiểu ④ **hai nửa**: lợi (được thêm thời gian) → mặt trái (làm thêm, cô đơn). Chỉ C bao **cả hai nửa**. A **đúng một nửa**; D **quá rộng**; B không có.",
        },
      ],
    },

    { t: "h", text: "6. Bài đọc luyện tập — Questions 1–13 (20 phút)" },
    {
      t: "p",
      text: "Bài đọc soạn riêng cho khoá, khoảng **800 từ**, **7 đoạn A–G**, chủ đề **xã hội – nhà nước**: điều tra dân số (census — cuộc đếm toàn bộ dân cư của một nước). Đúng như Passage 2 của đề thật. Bấm giờ **20 phút**: Questions 1–7 trước, rồi 8–13.",
    },
    {
      t: "p",
      text: "**Questions 1–7.** The reading passage has seven paragraphs, **A–G**. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, **i–x**.",
    },
    {
      t: "table",
      caption: "List of Headings",
      head: ["Số", "Heading"],
      rows: [
        ["i", "The first census in recorded history"],
        ["ii", "Making use of records that already exist"],
        ["iii", "Figures that decide where money and power go"],
        ["iv", "Why some people refuse to answer census questions"],
        ["v", "An operation that keeps getting more expensive"],
        ["vi", "A practice that is changing rather than disappearing"],
        ["vii", "From counting taxpayers to planning services"],
        ["viii", "The groups most likely to be left out"],
        ["ix", "Why the new approach will not work everywhere"],
        ["x", "The end of the need for population data"],
      ],
    },
    {
      t: "passage",
      title: "Counting Everyone: Does the Census Have a Future?",
      intro: "Bài đọc tự soạn (~800 từ). Đọc câu hỏi 1–7 trước khi đọc bài.",
      paras: [
        { label: "A", text: "Governments have counted their people for thousands of years. Clay tablets from ancient Babylon record numbers of people and livestock, and the Roman state regularly listed its citizens together with their property. The purpose of these early counts was narrow: rulers wanted to know how much tax they could collect and how many men they could send to war. Ordinary people, understandably, had little reason to welcome the counters. The modern census, which emerged during the late eighteenth and nineteenth centuries, has a very different aim. Rather than serving the ruler, it is meant to describe a whole society — its size, ages, occupations and living conditions — so that public services can be designed for the people who will actually use them." },
        { label: "B", text: "Today the results of a census reach into almost every area of public life. In many countries, the number of seats that each region holds in parliament is adjusted after every count, so a district that has grown gains political influence while a shrinking one loses it. Funding follows the same logic: central governments share out billions in grants for roads, schools and hospitals according to how many people live in each area and how old they are. Businesses rely on the figures too when deciding where to open a supermarket or a factory. An error in the count is therefore not a mere technical matter; it moves both resources and representation from one community to another for the following ten years." },
        { label: "C", text: "Collecting this information, however, has become a heavy burden on public budgets. A traditional census requires a questionnaire for every household, a temporary workforce of hundreds of thousands and years of preparation. The most recent count in the United States cost more than fourteen billion dollars — far more, even after allowing for inflation, than the counts of a generation earlier. Part of the explanation is that people have become harder to reach. Fewer households return the form voluntarily, so more staff must be sent to knock on doors, sometimes several times. Each additional visit adds to a bill that statisticians expect to keep climbing." },
        { label: "D", text: "Even with this level of spending, no census counts everybody. Research carried out after each count consistently shows that certain sections of the population are under-represented: very young children, people who rent rather than own their homes, recent migrants and those living in remote rural areas. Some are missed because they move frequently; others because they distrust officials or cannot read the form. The consequences are serious, since the communities that are overlooked are often the ones with the greatest need for public support. If the children of a neighbourhood are not counted, the school places and clinics they require will not be paid for." },
        { label: "E", text: "Faced with rising costs and incomplete results, a number of countries have abandoned the questionnaire altogether. In 1981, Denmark became the first nation to conduct a census drawn entirely from administrative registers — the databases that the state already keeps on addresses, employment, tax and education. Its Nordic neighbours followed. Because every resident has a personal identification number that links these separate files, statisticians can produce population figures every year instead of every decade, and at a small fraction of the cost. Nobody has to fill in a form, and nobody has to knock on a door." },
        { label: "F", text: "Yet this model cannot simply be copied elsewhere. It depends on registers that are complete, accurate and updated whenever someone moves house or changes job, and systems of that kind take decades to build. In much of the world, many births are never officially recorded, let alone changes of address. There is also the question of trust. Linking a person's tax, health and housing records is efficient, but in societies where citizens are suspicious of the state it may be politically unacceptable, and in some places the law forbids it. A register-based count is only as good as the records behind it and the public's willingness to be recorded." },
        { label: "G", text: "For these reasons, most experts predict a mixture of methods rather than a single solution. Several national statistical offices now combine register data with a much smaller survey, which is used to check the records and to ask questions that no database can answer, such as how people travel to work or which languages they speak at home. By the middle of this century, the door-to-door count familiar to earlier generations will probably have vanished from many wealthy nations, while satellite images and mobile-phone data will be helping poorer ones to estimate their populations between counts. What will not vanish is the need itself. As long as governments must decide where to spend limited funds, they will have to know how many people there are, and where they live." },
      ],
    },
    {
      t: "quiz",
      id: "t3d5-doc-tieu-de",
      title: "Questions 1–7 — ghi số La Mã (i–x)",
      kind: "fill",
      items: [
        { q: "1. Paragraph A ___", answers: ["vii"] },
        { q: "2. Paragraph B ___", answers: ["iii"] },
        { q: "3. Paragraph C ___", answers: ["v"] },
        { q: "4. Paragraph D ___", answers: ["viii"] },
        { q: "5. Paragraph E ___", answers: ["ii"] },
        { q: "6. Paragraph F ___", answers: ["ix"] },
        { q: "7. Paragraph G ___", answers: ["vi"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 1–7 — ý chính ở đâu, bẫy nào",
      items: [
        "**A — vii** (From counting taxpayers to planning services). Đoạn kiểu ④ **hai nửa**: nửa đầu “how much **tax** they could collect” (counting taxpayers) → nửa sau “**a very different aim**… so that **public services can be designed**” (planning services). Bẫy **i**: Babylon chỉ là **một ví dụ** ở câu 2, và đoạn không hề nói đó là cuộc điều tra **đầu tiên** (bẫy chi tiết).",
        "**B — iii** (Figures that decide where money and power go). Câu đầu khái quát “reach into almost every area of public life”; hai bằng chứng: **seats in parliament** = power, **grants** = money; câu cuối chốt “moves both **resources and representation**”. Paraphrase đổi loại từ: representation → power, resources / grants → money.",
        "**C — v** (An operation that keeps getting more expensive). **however** ở câu 1 nối với đoạn B (B nói lợi ích → C chuyển sang chi phí), nên ý chính nằm ngay **câu đầu** — “a heavy burden on public budgets”; câu cuối “a bill that statisticians expect to **keep climbing**” = keeps getting more expensive. Bẫy **iv**: “fewer households return the form” là **nguyên nhân phụ** của chi phí, và đoạn không nói **vì sao** họ không trả lời.",
        "**D — viii** (The groups most likely to be left out). Câu chủ đề: “certain sections of the population are **under-represented**” + danh sách bốn nhóm; left out = missed = overlooked = not counted. Bẫy **iv** lần hai: “they distrust officials” chỉ là **một** trong ba lý do, nằm trong **một** câu.",
        "**E — ii** (Making use of records that already exist). “administrative registers — the databases that the state **already keeps**” = records that already exist. Denmark, 1981, Nordic là chi tiết.",
        "**F — ix** (Why the new approach will not work everywhere). Câu đầu sau **Yet**: “this model **cannot simply be copied elsewhere**”; hai lý do: register chưa đủ tốt + lòng tin. new approach = this model; not work everywhere = cannot be copied elsewhere.",
        "**G — vi** (A practice that is changing rather than disappearing). Việc đếm dân **đổi cách làm** — “a **mixture of methods**”, register + “a much smaller survey”, cách đếm từng nhà “will probably have vanished” — nhưng **không mất đi**: “**What will not vanish is the need itself**… they will have to know how many people there are”. Bẫy **x** (The end of the need for population data) là bẫy **trái nghĩa**: đoạn nói nhu cầu **không** biến mất.",
        "Ba tiêu đề thừa: **i**, **iv**, **x**. Cả ba đều dùng chữ **có thật trong bài** (Babylon, form/distrust, need) — đúng kiểu bẫy band 6.",
      ],
    },
    {
      t: "p",
      text: "**Questions 8–11.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer.",
    },
    {
      t: "quiz",
      id: "t3d5-doc-hoan-thanh",
      title: "Questions 8–11 — Sentence completion (NO MORE THAN TWO WORDS)",
      kind: "fill",
      items: [
        { q: "8. In ancient times, rulers used population counts to work out the amount of ___ they could raise and the size of their armies.", answers: ["tax"] },
        { q: "9. After a census, a region whose population has risen may be given more ___ in the national parliament.", answers: ["seats"] },
        { q: "10. When forms are not sent back, census workers go to people's homes, and every extra ___ increases the total cost.", answers: ["visit"] },
        { q: "11. In Denmark and its neighbours, separate government files are connected through each resident's personal ___.", answers: ["identification number"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 12–13.** Choose the correct letter, **A, B, C or D**.",
    },
    {
      t: "mcq",
      id: "t3d5-doc-chon",
      title: "Questions 12–13 — Multiple choice",
      items: [
        { q: "12. According to paragraph F, a census based on registers may be rejected in some societies because", options: ["A it is more expensive than a questionnaire.", "B it cannot be carried out every year.", "C statisticians there lack the necessary skills.", "D people do not want the state to connect their records."], correct: 3, why: "“in societies where citizens are **suspicious of the state** it may be **politically unacceptable**” — linking records = connect their records. A ngược với đoạn E (a small fraction of the cost); B ngược (every year); C không được nhắc (Not Given)." },
        { q: "13. What point does the writer make about the future in paragraph G?", options: ["A Small surveys will no longer be necessary.", "B Governments will still require information about population.", "C Poorer countries will stop counting their people.", "D Satellite images will replace registers in rich countries."], correct: 1, why: "“**What will not vanish is the need itself**… they will have to know how many people there are”. A sai: register **kết hợp** với “a much smaller survey”. C sai: vệ tinh **giúp ước tính giữa các lần đếm**. D đánh tráo: vệ tinh giúp nước **nghèo**, không phải nước giàu." },
      ],
    },
    {
      t: "note",
      title: "Giải thích 8–11 — câu chứa đáp án và kiểu paraphrase",
      items: [
        "**8 — tax** (đoạn A): “rulers wanted to know **how much tax they could collect** and how many men they could send to war”. collect → raise (đồng nghĩa); how many men… to war → the size of their armies (**đổi cấu trúc**, mức 3).",
        "**9 — seats** (đoạn B): “**the number of seats** that each region holds in parliament is adjusted… a district that has grown **gains political influence**”. has grown → whose population has risen.",
        "**10 — visit** (đoạn C): “more staff must be sent to knock on doors… **Each additional visit adds to a bill**”. knock on doors → go to people's homes; adds to a bill → increases the total cost. Câu hỏi đã có **every extra** (= each additional) nên chỉ điền **visit**; viết “additional visit” thành “every extra additional visit” — thừa chữ, sai câu.",
        "**11 — identification number** (đoạn E): “every resident has a **personal identification number that links these separate files**”. links → are connected through (**chủ động → bị động**); files → government files.",
        "Chú ý thứ tự: câu 8 → 11 đi **theo thứ tự bài** (A → B → C → E). Bạn đã có bản đồ đoạn từ câu 1–7 nên biết ngay tìm ở đâu.",
      ],
    },
    {
      t: "table",
      caption: "Tự chấm (13 câu)",
      head: ["Kết quả", "Mức", "Việc nên làm"],
      rows: [
        ["Headings 6–7/7 · còn lại 5–6/6", "Vững band 6+", "Sang bài Nghe"],
        ["Headings 5/7 · tổng ≥ 9/13", "Đạt mục tiêu band 6", "Xem hai đoạn sai: bạn dính bẫy số mấy ở mục 4? Ghi vào sổ lỗi"],
        ["Headings ≤ 4/7", "Chưa đạt", "Làm lại bước ④: viết tóm tắt 3–6 từ cho cả 7 đoạn rồi mới ghép; ôn Tập 2 Ngày 12 mục 1; làm lại sau 1 ngày"],
      ],
    },

    { t: "h", text: "7. Phân tích sau khi làm: mỗi đoạn thuộc kiểu nào?" },
    {
      t: "table",
      caption: "Bảy đoạn của bài đọc — kiểu đoạn và chỗ ý chính",
      head: ["Đoạn", "Kiểu", "Câu mang ý chính", "Tóm tắt 3–6 từ"],
      rows: [
        ["A", "④ hai nửa", "câu 3 + câu 5–6", "xưa: thuế, lính → nay: dịch vụ"],
        ["B", "① nêu rồi chứng minh", "câu 1 + câu cuối", "số liệu chia tiền, chia ghế"],
        ["C", "① nêu rồi chứng minh (however ở câu 1 nối với đoạn B)", "câu 1 + câu cuối", "ngày càng tốn kém"],
        ["D", "① nêu rồi chứng minh", "câu 1–2", "ai bị đếm sót"],
        ["E", "① nêu rồi chứng minh", "câu 1–2", "dùng sổ sách có sẵn"],
        ["F", "② đảo chiều (Yet)", "câu 1", "không nước nào cũng làm được"],
        ["G", "③ dẫn rồi kết", "câu 1 + hai câu cuối", "đổi cách đếm, vẫn phải đếm"],
      ],
    },
    {
      t: "note",
      title: "Ngữ pháp hôm nay trong bài đọc",
      items: [
        "Đoạn G: “the door-to-door count… **will probably have vanished** from many wealthy nations” — tương lai hoàn thành: tới giữa thế kỷ thì **đã** biến mất.",
        "Đoạn G: “satellite images and mobile-phone data **will be helping** poorer ones” — tương lai tiếp diễn: lúc đó **đang** giúp (xu hướng).",
        "Nhận ra hai thì này giúp bạn loại đáp án C, D ở câu 13 nhanh hơn: “will be helping… to estimate **between counts**” nghĩa là vẫn còn các cuộc đếm.",
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "census", pos: "n", ipa: "/ˈsensəs/", vi: "cuộc điều tra dân số", ex: "The census is carried out every ten years.", exVi: "Cuộc điều tra dân số được tiến hành mười năm một lần.", more: "**conduct / carry out a census** · census **data / figures**. Số nhiều: censuses." },
        { w: "household", pos: "n", ipa: "/ˈhaʊshəʊld/", vi: "hộ gia đình", ex: "Every household receives a questionnaire.", exVi: "Mỗi hộ gia đình nhận một phiếu hỏi.", more: "**household income** (thu nhập hộ) · **low-income households**." },
        { w: "grant", pos: "n", ipa: "/ɡrɑːnt/", vi: "khoản trợ cấp, tiền tài trợ (nhà nước cấp)", ex: "The council received a grant to repair local roads.", exVi: "Hội đồng địa phương nhận một khoản tài trợ để sửa đường.", more: "**a government grant** · **research grant**. Động từ **grant** = cấp, ban cho." },
        { w: "burden", pos: "n", ipa: "/ˈbɜːdn/", vi: "gánh nặng", ex: "Health care is a growing burden on public budgets.", exVi: "Y tế là gánh nặng ngày càng lớn lên ngân sách công.", more: "**a burden on** taxpayers · **the tax burden** · **ease the burden**." },
        { w: "under-represented", pos: "adj", ipa: "/ˌʌndə ˌreprɪˈzentɪd/", vi: "có mặt ít hơn thực tế, chưa được đại diện đủ", ex: "Young renters are under-represented in the data.", exVi: "Người trẻ thuê nhà xuất hiện trong số liệu ít hơn thực tế.", more: "Trái nghĩa **over-represented**. Họ từ: represent (v) · representation (n) · representative (n, adj)." },
        { w: "overlook", pos: "v", ipa: "/ˌəʊvəˈlʊk/", vi: "bỏ sót, không để ý tới", ex: "Rural communities are often overlooked by planners.", exVi: "Các cộng đồng nông thôn thường bị người lập kế hoạch bỏ sót." },
        { w: "register", pos: "n, v", ipa: "/ˈredʒɪstə/", vi: "sổ đăng ký, cơ sở dữ liệu đăng ký; đăng ký", ex: "The state keeps a register of every address.", exVi: "Nhà nước giữ một sổ đăng ký mọi địa chỉ.", more: "**register a birth** (đăng ký khai sinh) · **registration** (n) · **administrative registers**." },
        { w: "abandon", pos: "v", ipa: "/əˈbændən/", vi: "từ bỏ, bỏ hẳn", ex: "Several countries have abandoned the paper questionnaire.", exVi: "Vài nước đã bỏ hẳn phiếu hỏi giấy.", more: "**abandon a plan / a policy / an attempt**. AWL sublist 8." },
        { w: "suspicious", pos: "adj", ipa: "/səˈspɪʃəs/", vi: "nghi ngờ, không tin", ex: "Some citizens are suspicious of the state.", exVi: "Một số công dân nghi ngờ nhà nước.", more: "**be suspicious of** sb/sth. Họ từ: suspect (v) · suspicion (n)." },
        { w: "estimate", pos: "v, n", ipa: "/ˈestɪmeɪt/", vi: "ước tính; con số ước tính", ex: "Satellite images help experts to estimate the population.", exVi: "Ảnh vệ tinh giúp chuyên gia ước tính dân số.", more: "Danh từ đọc /ˈestɪmət/. **an estimated 2 million people** · **a rough estimate**. AWL sublist 1." },
      ],
    },
    {
      t: "note",
      title: "Mẹo thời gian cho ngày thi",
      items: [
        "Matching headings đứng **đầu** bộ câu hỏi ⇒ làm **trước** các dạng khác của passage đó; nó cho bạn bản đồ đoạn.",
        "Khoảng **9–10 phút** cho 7 tiêu đề. Đoạn nào quá 2 phút chưa xong ⇒ ghi hai ứng viên, đi tiếp.",
        "Đoạn **đầu tiên và cuối cùng** của bài thường dễ nhất (giới thiệu · kết luận) ⇒ làm trước để loại bớt tiêu đề.",
        "Không bao giờ bỏ trống: hết giờ thì điền tiêu đề **còn lại** hợp lý nhất.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nghe ─────────────────────────── */

const T3D5_NGHE: Lesson = {
  id: "t3d5-nghe",
  kind: "listening",
  title: "Nghe: Số liệu phức — thập phân, phần trăm, phân số, số lớn, năm, đơn vị",
  goal: "Nghe và ghi đúng ngay lần đầu các con số khó của Listening: số thập phân, phần trăm, phân số, số hàng nghìn – triệu – tỉ, năm, số đo kèm đơn vị, phân biệt -teen / -ty và không dính bẫy người nói sửa số — để không mất 3–5 câu “dễ” ở Part 1, 2 và 4.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Tập 1 Ngày 7 và Tập 2 Ngày 3 bạn đã nghe **số điện thoại, giá tiền, ngày tháng, giờ**. Hôm nay là **số liệu phức** của band 6: số thập phân, %, phân số, số lớn, năm, đơn vị đo.",
        "Một đề Listening thường có **6–10 đáp án là số**. Đây là điểm “rẻ” nhất — không cần hiểu ý sâu — nhưng người band 5 vẫn rơi vì **nghe được mà viết sai dạng**.",
        "Ba luật viết: ==số thập phân dùng dấu CHẤM, số hàng nghìn dùng dấu PHẨY== (ngược tiếng Việt); **đề đã in đơn vị thì không viết lại**; số viết bằng **chữ số** cho nhanh và khỏi sai chính tả.",
        "**thirteen / thirty**: phân biệt bằng **trọng âm** và âm /n/ cuối — có khối luyện phát âm (Azure chấm).",
        "Bẫy đặc trưng: người nói **sửa số**, nêu **hai số cho hai thứ**, nói số **xấp xỉ** (just under, roughly) rồi mới nói số đúng.",
        "Ba bài nghe: 10 câu, mỗi câu một con số (4 giọng) · một bài nói kiểu Part 2 có 10 chỗ trống, 9 là số liệu (giọng Úc) · một cuộc gọi kiểu Part 1 có 6 chỗ trống số, hai lần sửa số (giọng Mỹ + Anh).",
      ],
    },

    { t: "h", text: "1. Số thập phân (decimals)" },
    {
      t: "p",
      text: "Dấu thập phân tiếng Anh là **dấu chấm**, đọc là **point**. Các chữ số **sau** dấu chấm đọc **từng số một**. Số 0 trước dấu chấm: giọng Anh hay đọc **nought** /nɔːt/, giọng Mỹ đọc **zero**; sau dấu chấm thường đọc **oh** /əʊ/ hoặc zero.",
    },
    {
      t: "table",
      caption: "Đọc số thập phân",
      head: ["Viết", "Đọc", "Ghi chú"],
      rows: [
        ["0.5", "nought point five / zero point five / point five", "ba cách đều gặp"],
        ["3.75", "three point **seven five**", "KHÔNG đọc “point seventy-five”"],
        ["12.08", "twelve point **oh eight** / zero eight", "oh = số 0"],
        ["2.4 million", "two point four million", "số lớn hay rút gọn kiểu này"],
        ["£3.75", "three pounds **seventy-five** / three seventy-five", "**tiền** là ngoại lệ: đọc như hai số"],
        ["1.5 km", "one point five kilometres / one **and a half** kilometres", "“and a half” = .5"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: chấm và phẩy ngược với tiếng Việt",
      items: [
        "Tiếng Việt viết **1.500,5** (chấm ngăn hàng nghìn, phẩy thập phân). Tiếng Anh viết **1,500.5** (phẩy ngăn hàng nghìn, chấm thập phân).",
        "Trong bài thi: nghe “three point seven five” mà viết ~~3,75~~ ⇒ **sai**. Phải viết **3.75**.",
        "Số hàng nghìn: viết **6,450** hoặc **6450** đều được chấm đúng; đừng viết ~~6.450~~ (người chấm đọc thành 6.45 — sáu phẩy bốn lăm).",
      ],
    },

    { t: "h", text: "2. Phần trăm và phân số" },
    {
      t: "table",
      caption: "Phần trăm (per cent) và phân số (fractions)",
      head: ["Viết", "Đọc", "Ghi chú"],
      rows: [
        ["14.6%", "fourteen point six per cent", "per cent /pə ˈsent/ — nhấn **cent**"],
        ["½", "a half / one half", "half of the students"],
        ["⅓ · ⅔", "a third / one third · two thirds", "tử số > 1 ⇒ mẫu số thêm **-s**"],
        ["¼ · ¾", "a quarter · three quarters", "Mỹ còn nói a fourth, three fourths"],
        ["⅕ · ⅖", "a fifth · two fifths", "mẫu số = số thứ tự"],
        ["1/10", "a tenth / one in ten", "one in ten = 10%"],
        ["9/10", "nine out of ten", "= 90%"],
        ["2½", "two and a half", ""],
      ],
    },
    {
      t: "table",
      caption: "Phân số ↔ phần trăm — đề hay nói kiểu này, câu hỏi viết kiểu kia",
      head: ["Nghe", "Bằng", "Nghe", "Bằng"],
      rows: [
        ["a half", "50%", "one in five", "20%"],
        ["a third", "≈ 33%", "one in four", "25%"],
        ["two thirds", "≈ 67%", "three in ten", "30%"],
        ["a quarter", "25%", "nine out of ten", "90%"],
        ["three quarters", "75%", "double / twice", "× 2"],
        ["a fifth", "20%", "halve", "÷ 2"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: từ xấp xỉ đi trước con số",
      items: [
        "**just under / almost / nearly** 40% = hơi dưới 40 · **just over / slightly more than** = hơi trên · **roughly / around / approximately / about** = khoảng.",
        "Nếu chỗ trống cần **con số**, ghi con số (40). Từ xấp xỉ thường đã in sẵn trong câu hỏi dưới dạng khác (about, approximately).",
        "Người nói hay nêu số xấp xỉ rồi **nói lại số đúng**: “about a third — thirty-four per cent to be exact”. Câu hỏi cần loại nào? Nhìn đơn vị in sẵn (có % hay không).",
      ],
    },

    { t: "h", text: "3. Số lớn: nghìn, triệu, tỉ" },
    {
      t: "table",
      caption: "Đọc số lớn",
      head: ["Viết", "Đọc", "Ghi chú"],
      rows: [
        ["350", "three hundred **and** fifty", "giọng Anh có **and**; giọng Mỹ thường bỏ"],
        ["6,450", "six thousand four hundred and fifty", ""],
        ["1,200", "one thousand two hundred / **twelve hundred**", "twelve hundred hay gặp ở giọng Mỹ"],
        ["65,000", "sixty-five thousand", "thousand **không** thêm -s"],
        ["250,000", "two hundred and fifty thousand / **a quarter of a million**", ""],
        ["500,000", "five hundred thousand / **half a million**", ""],
        ["1,500,000", "one and a half million / one point five million", "viết 1.5 million hoặc 1,500,000"],
        ["2,300,000", "two point three million", ""],
        ["7,000,000,000", "seven billion", "billion = **tỉ** (10⁹)"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi ghi số lớn",
      items: [
        "Thêm -s: ~~five millions people~~ → five **million** people. (Chỉ có -s khi không có số: **millions of** people.)",
        "Thiếu / thừa số 0: “sixty-five thousand” = **65,000** (ba số 0). Hãy viết theo cụm: nghe “thousand” ⇒ ghi dấu phẩy và ba chỗ.",
        "Nghe “two point three million” mà chỗ trống đã in chữ **million** ⇒ chỉ viết **2.3**. Chưa in ⇒ viết **2.3 million** hoặc **2,300,000**.",
        "“**a hundred and fifty**” (150) hay bị nghe thành “a hundred and **fifteen**” (115) — xem mục 6.",
      ],
    },

    { t: "h", text: "4. Năm, thập kỷ, thế kỷ" },
    {
      t: "table",
      caption: "Đọc năm",
      head: ["Viết", "Đọc", "Ghi chú"],
      rows: [
        ["1908", "nineteen **oh** eight", "oh = 0"],
        ["1900", "nineteen hundred", ""],
        ["1987", "nineteen eighty-seven", "chia đôi: 19 | 87"],
        ["2000", "two thousand", ""],
        ["2008", "two thousand **and** eight", "Mỹ: two thousand eight"],
        ["2015", "twenty fifteen / two thousand and fifteen", "cả hai đều gặp"],
        ["2030", "twenty thirty", ""],
        ["the 1990s", "the nineteen nineties", "thập kỷ 1990–1999"],
        ["the mid-1980s", "the mid nineteen eighties", "giữa thập kỷ: ~1984–86"],
        ["the 19th century", "the nineteenth century", "≈ **the 1800s** (những năm 18xx), không phải 1900s"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: thế kỷ lệch một số",
      items: [
        "**the 18th century** = những năm **17**xx. **the 21st century** = những năm 20xx.",
        "Câu hỏi viết “in the **1800s**”, băng nói “in the **nineteenth century**” — đây là paraphrase, không phải hai thông tin.",
        "**the early / mid / late** 1990s = đầu / giữa / cuối thập niên 90.",
      ],
    },

    { t: "h", text: "5. Số đo và đơn vị" },
    {
      t: "table",
      caption: "Đơn vị hay gặp trong Listening",
      head: ["Ký hiệu", "Đọc", "Đo cái gì"],
      rows: [
        ["km · m · cm · mm", "kilometres · metres · centimetres · millimetres", "chiều dài (Mỹ: -meters)"],
        ["km/h · mph", "kilometres per hour (an hour) · miles per hour", "tốc độ"],
        ["m² · km²", "square metres · square kilometres", "diện tích"],
        ["ha", "hectares /ˈhekteəz/", "diện tích đất"],
        ["kg · g · t", "kilograms (kilos) · grams · tonnes /tʌnz/", "khối lượng"],
        ["l · ml", "litres /ˈliːtəz/ · millilitres", "thể tích"],
        ["°C", "degrees Celsius / degrees", "nhiệt độ; **minus five** = −5"],
        ["kW · MW", "kilowatts · megawatts", "công suất điện"],
        ["dB", "decibels", "độ ồn"],
      ],
    },
    {
      t: "rule",
      formula: "Đề ĐÃ in đơn vị (… ___ km) → chỉ viết SỐ · Đề CHƯA in đơn vị → viết số + đơn vị nếu giới hạn từ cho phép",
      vi: "Luôn đọc phần chữ trước và sau chỗ trống: có ký hiệu £, %, km, million chưa? Viết lặp đơn vị (80 metres metres) có thể bị tính sai.",
    },
    {
      t: "note",
      title: "Mẹo: đoán trước dạng số từ ngữ cảnh",
      items: [
        "Trước khi băng chạy, ghi nhỏ cạnh mỗi chỗ trống: **năm?** · **%?** · **tiền?** · **số lớn?** · **thập phân?**",
        "“opened in ___” ⇒ năm. “___ % of visitors” ⇒ số 0–100, có thể thập phân. “cost: £ ___ million” ⇒ số nhỏ, hay có point. “height: ___ metres” ⇒ số đo.",
        "Biết trước dạng ⇒ tai bạn chờ đúng loại âm, không bị giật mình khi nghe “point”.",
      ],
    },

    { t: "h", text: "6. thirteen hay thirty? — nghe và phát âm" },
    {
      t: "table",
      caption: "-teen và -ty khác nhau ở ba chỗ",
      head: ["", "-teen (13–19)", "-ty (30–90)"],
      rows: [
        ["Trọng âm", "nhấn âm **sau**: thir**TEEN** (khi đứng một mình / cuối câu)", "nhấn âm **đầu**: **THIR**ty"],
        ["Nguyên âm cuối", "dài /iːn/", "ngắn /i/"],
        ["Âm cuối", "có **/n/** rõ", "không có /n/"],
        ["Âm /t/", "rõ /t/", "giọng Mỹ, Úc: /t/ mềm thành gần /d/ — “thirdy”"],
      ],
    },
    {
      t: "note",
      title: "Mẹo khi vẫn không chắc",
      items: [
        "Nghe **ngữ cảnh**: giá một cốc cà phê không thể là 50 bảng; một lớp học hiếm khi 90 người.",
        "Người nói thật cũng hay bị hỏi lại, nên băng thường **xác nhận**: “fifteen — one five” / “fifty — five oh”. Nghe cụm xác nhận này là chắc nhất.",
        "Trước danh từ, -teen có thể **dời trọng âm về đầu** (THIRteen PEOple) ⇒ khi đó dựa vào âm **/n/ cuối** và nguyên âm dài.",
      ],
    },
    {
      t: "phatam",
      id: "t3d5-phat-am-teen-ty",
      title: "Luyện phát âm: thirteen / thirty — fourteen / forty — … — nineteen / ninety",
      note: "Đọc rõ trọng âm: -TEEN nhấn sau, kéo dài /iːn/ và có /n/; -ty nhấn đầu, kết thúc ngắn /i/. Máy chấm từng âm — xem âm cuối của bạn có bị mất không.",
      items: [
        { text: "thirteen, thirty", ipa: "θɜːtiːn θɜːti", vi: "13 · 30" },
        { text: "fourteen, forty", ipa: "fɔːtiːn fɔːti", vi: "14 · 40" },
        { text: "fifteen, fifty", ipa: "fɪftiːn fɪfti", vi: "15 · 50" },
        { text: "sixteen, sixty", ipa: "sɪkstiːn sɪksti", vi: "16 · 60" },
        { text: "seventeen, seventy", ipa: "sevntiːn sevnti", vi: "17 · 70" },
        { text: "eighteen, eighty", ipa: "eɪtiːn eɪti", vi: "18 · 80" },
        { text: "nineteen, ninety", ipa: "naɪntiːn naɪnti", vi: "19 · 90" },
        { text: "The room holds sixty people, not sixteen.", ipa: "ðə ruːm həʊldz sɪksti piːpl nɒt sɪkstiːn", vi: "Phòng chứa 60 người, không phải 16." },
        { text: "It costs fourteen pounds fifty.", ipa: "ɪt kɒsts fɔːtiːn paʊndz fɪfti", vi: "Giá 14 bảng 50 xu." },
        { text: "Thirty per cent of the thirteen schools closed in nineteen ninety.", ipa: "θɜːti pə sent əv ðə θɜːtiːn skuːlz kləʊzd ɪn naɪntiːn naɪnti", vi: "30% trong số 13 trường đóng cửa năm 1990." },
      ],
    },

    { t: "h", text: "7. Bài nghe 1 — mười con số (4 giọng)" },
    {
      t: "p",
      text: "Mười câu ngắn, mỗi câu **một con số**. Bốn giọng: Anh, Mỹ, Úc, Canada. Nghe **một lần**, viết bằng **chữ số**; đơn vị hay ký hiệu nào **đã in sẵn** ở câu hỏi (cm, %, °C, km) thì không viết lại.",
    },
    {
      t: "listen",
      id: "t3d5-nghe-muoi-so",
      title: "Ten numbers",
      dan: { so: "Day 5, Practice 1", boiCanh: "ten short sentences. Write the number you hear in each one.", cau: [1, 10] },
      note: "Khoảng 1 phút rưỡi. Mỗi câu đọc một lần. Giọng Anh (nữ), Mỹ (nam), Úc (nữ), Canada (nam).",
      lines: [
        { who: "1", voice: "uk-nu", text: "One. The average rainfall last month was nought point seven five centimetres.", vi: "Lượng mưa trung bình tháng trước là 0,75 cm." },
        { who: "2", voice: "us-nam", text: "Two. Unemployment in the region now stands at fourteen point six per cent.", vi: "Tỉ lệ thất nghiệp của vùng hiện ở mức 14,6%." },
        { who: "3", voice: "au-nu", text: "Three. The museum welcomed two point three million visitors last year.", vi: "Bảo tàng đón 2,3 triệu khách năm ngoái." },
        { who: "4", voice: "ca-nam", text: "Four. The original bridge was completed in nineteen oh eight.", vi: "Cây cầu ban đầu hoàn thành năm 1908." },
        { who: "5", voice: "uk-nu", text: "Five. Three quarters of the students said they preferred online lectures.", vi: "Ba phần tư sinh viên nói họ thích bài giảng trực tuyến hơn." },
        { who: "6", voice: "us-nam", text: "Six. The storage room must be kept at seventeen degrees Celsius.", vi: "Phòng lưu trữ phải được giữ ở 17 độ C." },
        { who: "7", voice: "au-nu", text: "Seven. The stadium has seats for six thousand four hundred and fifty people.", vi: "Sân vận động có chỗ ngồi cho 6.450 người." },
        { who: "8", voice: "ca-nam", text: "Eight. The campus is one and a half kilometres from the station.", vi: "Khuôn viên cách nhà ga một cây số rưỡi." },
        { who: "9", voice: "uk-nu", text: "Nine. The first survey had ninety questions, which was far too many.", vi: "Khảo sát đầu tiên có 90 câu hỏi, quá nhiều." },
        { who: "10", voice: "us-nam", text: "Ten. About a quarter of a million people live in the city centre.", vi: "Khoảng một phần tư triệu người sống ở trung tâm thành phố." },
      ],
    },
    {
      t: "quiz",
      id: "t3d5-nghe-muoi-so-cau",
      title: "Questions 1–10 — viết con số bằng chữ số",
      kind: "fill",
      items: [
        { q: "1. Rainfall: ___ cm", answers: ["0.75", ".75"] },
        { q: "2. Unemployment: ___ %", answers: ["14.6"] },
        { q: "3. Visitors last year: ___ (viết đủ số hoặc dạng … million)", answers: ["2.3 million", "2,300,000", "2300000", "2.3m"] },
        { q: "4. Bridge completed in ___", answers: ["1908"] },
        { q: "5. Students who preferred online lectures: ___ (phân số hoặc %)", answers: ["3/4", "75%", "three quarters", "¾"] },
        { q: "6. Temperature: ___ °C", answers: ["17"] },
        { q: "7. Seats: ___", answers: ["6,450", "6450"] },
        { q: "8. Distance from the station: ___ km", answers: ["1.5", "1 1/2", "1½"] },
        { q: "9. Questions in the first survey: ___", answers: ["90"] },
        { q: "10. People in the city centre: about ___", answers: ["250,000", "250000", "0.25 million", "a quarter of a million", "1/4 million"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích — chỗ hay sai",
      items: [
        "**1.** “nought point seven five” = **0.75** (nought = 0, giọng Anh). Viết 0,75 là sai dấu.",
        "**2.** “fourteen point six” — **fourteen**, không phải forty: nghe /n/ cuối và trọng âm sau.",
        "**4.** “nineteen **oh** eight” = 1908, không phải 1980 (nineteen **eighty**).",
        "**5.** three quarters = ¾ = 75%.",
        "**6.** “seventeen” — có /n/ cuối; phòng lưu trữ 70 °C là vô lý (dùng ngữ cảnh).",
        "**8.** “one and a half” = 1.5.",
        "**9.** “**ninety** questions… far too many” — trọng âm đầu, không /n/ cuối; ngữ cảnh “quá nhiều” cũng ủng hộ 90.",
        "**10.** a quarter of a million = 1,000,000 ÷ 4 = **250,000**.",
      ],
    },

    { t: "h", text: "8. Bài nghe 2 — bài nói kiểu Part 2: Harlow Ridge Wind Farm (giọng Úc)" },
    {
      t: "p",
      text: "**Questions 11–20.** Complete the notes below. Write **ONE WORD AND/OR A NUMBER** for each answer. Đọc ghi chú **45 giây** trước khi nghe; ghi nhỏ cạnh mỗi chỗ trống bạn đang chờ **loại số** nào. Nghe **một lần** như thi thật (lần hai để chữa bài).",
    },
    {
      t: "table",
      caption: "Harlow Ridge Wind Farm — visitor notes",
      head: ["Mục", "Ghi chú"],
      rows: [
        ["History", "Opened in **11** ___ (two years later than planned)"],
        ["Size", "Number of turbines operating today: **12** ___"],
        ["Each turbine", "Tower height: 80 metres · length of one blade: **13** ___ metres"],
        ["Output", "Supplies electricity to **14** ___ homes"],
        ["", "This is about a **15** ___ of all homes in the county"],
        ["Operation", "Turbines switch off when wind speed is above **16** ___ km per hour"],
        ["Cost", "Total cost of the project: £ **17** ___ million"],
        ["Land", "Total area: 620 hectares · turbines and roads use only **18** ___ % of it"],
        ["", "The rest is still used for farming, mainly **19** ___"],
        ["Future", "By 2030, **20** ___ more turbines will have been added"],
      ],
    },
    {
      t: "listen",
      id: "t3d5-nghe-wind-farm",
      title: "A visit to Harlow Ridge Wind Farm",
      dan: { so: "Day 5, Practice 2 (Listening Part 2)", boiCanh: "a guide talking to a group of visitors at a wind farm.", cau: [11, 20] },
      note: "Khoảng 2 phút rưỡi, một người nói, giọng Úc (nữ). Gần như câu nào người nói cũng nêu hai con số — chỉ một số đúng với câu hỏi.",
      lines: [
        { who: "Guide", voice: "au-nu", text: "Good morning, everyone, and welcome to Harlow Ridge. Before we walk up to the turbines, let me give you a few facts and figures. The wind farm was first proposed back in the nineteen nineties, and the plan was to start generating power in two thousand and seven. In the end, though, there were delays with the planning permission, and we didn't actually open until two thousand and nine.", vi: "Chào buổi sáng mọi người, chào mừng tới Harlow Ridge. Trước khi đi bộ lên chỗ các tua-bin, tôi xin nêu vài số liệu. Trang trại gió được đề xuất lần đầu từ những năm 1990, và kế hoạch là bắt đầu phát điện năm 2007. Nhưng rốt cuộc việc cấp phép bị chậm, và phải tới 2009 chúng tôi mới mở cửa." },
        { who: "Guide", voice: "au-nu", text: "The original design had sixty turbines. Local residents were worried about the view, so the number was reduced, and today there are forty-eight in operation. Each one stands on a tower eighty metres tall. The blades are enormous, too. A single blade measures forty-two point five metres from end to end, which is longer than the wing of most passenger planes.", vi: "Thiết kế ban đầu có 60 tua-bin. Người dân địa phương lo về cảnh quan nên con số được giảm, và hôm nay có 48 tua-bin đang hoạt động. Mỗi cái đứng trên một trụ cao 80 mét. Cánh quạt cũng khổng lồ. Một cánh dài 42,5 mét từ đầu này tới đầu kia, dài hơn cánh của đa số máy bay chở khách." },
        { who: "Guide", voice: "au-nu", text: "So, how much electricity do we produce? On an average day, enough for sixty-five thousand homes. To put that in context, there are roughly two hundred thousand homes in the county, so we supply about a third of them.", vi: "Vậy chúng tôi sản xuất bao nhiêu điện? Một ngày trung bình, đủ cho 65.000 hộ. Để dễ hình dung, cả hạt có khoảng 200.000 hộ, nên chúng tôi cấp điện cho khoảng một phần ba số đó." },
        { who: "Guide", voice: "au-nu", text: "People often ask whether the turbines work in any weather. They don't. They need a wind speed of at least thirteen kilometres per hour to start turning, and for safety they shut down automatically if the wind goes above ninety kilometres per hour. That happens only a few days a year.", vi: "Mọi người hay hỏi tua-bin có chạy trong mọi thời tiết không. Không. Chúng cần tốc độ gió ít nhất 13 km/giờ để bắt đầu quay, và để an toàn chúng tự tắt nếu gió vượt 90 km/giờ. Chuyện đó chỉ xảy ra vài ngày một năm." },
        { who: "Guide", voice: "au-nu", text: "The whole project cost seventy-four point five million pounds. That's slightly less than the eighty million in the first budget, mainly because we built fewer turbines.", vi: "Cả dự án tốn 74,5 triệu bảng. Con số đó thấp hơn một chút so với 80 triệu trong ngân sách đầu tiên, chủ yếu vì chúng tôi xây ít tua-bin hơn." },
        { who: "Guide", voice: "au-nu", text: "The site covers six hundred and twenty hectares, but the turbines and the access roads take up just two point five per cent of that land. The remaining ninety-seven point five per cent is still farmed exactly as before. You'll see a few cattle near the entrance, but most of it is used for sheep.", vi: "Khu đất rộng 620 héc-ta, nhưng tua-bin và đường nội bộ chỉ chiếm 2,5% diện tích. 97,5% còn lại vẫn được canh tác y như trước. Các bạn sẽ thấy vài con bò gần cổng, nhưng phần lớn dùng để nuôi cừu." },
        { who: "Guide", voice: "au-nu", text: "Finally, a word about the future. We've just received permission to expand. Building starts next spring, and by twenty thirty we will have added fifteen more turbines. That's fifteen, one five, not fifty as one newspaper reported. Right, if you'd like to follow me, we'll go and look at turbine number one.", vi: "Cuối cùng, vài lời về tương lai. Chúng tôi vừa được phép mở rộng. Mùa xuân tới bắt đầu xây, và tới năm 2030 chúng tôi sẽ lắp thêm xong 15 tua-bin. Là mười lăm, một năm, chứ không phải năm mươi như một tờ báo đã đưa. Nào, mời mọi người theo tôi đi xem tua-bin số một." },
      ],
    },
    {
      t: "quiz",
      id: "t3d5-nghe-wind-farm-cau",
      title: "Questions 11–20 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "11. Opened in ___", answers: ["2009"] },
        { q: "12. Number of turbines operating today: ___", answers: ["48", "forty-eight"] },
        { q: "13. Length of one blade: ___ metres", answers: ["42.5"] },
        { q: "14. Supplies electricity to ___ homes", answers: ["65,000", "65000"] },
        { q: "15. About a ___ of all homes in the county", answers: ["third"] },
        { q: "16. Turbines switch off when wind speed is above ___ km per hour", answers: ["90", "ninety"] },
        { q: "17. Total cost: £ ___ million", answers: ["74.5"] },
        { q: "18. Turbines and roads use only ___ % of the land", answers: ["2.5"] },
        { q: "19. The rest is used for farming, mainly ___", answers: ["sheep"] },
        { q: "20. By 2030, ___ more turbines will have been added", answers: ["15", "fifteen"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 11–20 — bẫy nằm ở đâu",
      items: [
        "**11 — 2009.** Bẫy hai số: “the plan was… two thousand and seven. **In the end, though**… didn't actually open until **two thousand and nine**”. Câu hỏi in sẵn “two years later than planned” để bạn kiểm: 2007 + 2 = 2009. 1990s là năm **đề xuất**.",
        "**12 — 48.** “The original design had **sixty**… the number was reduced, and **today** there are **forty-eight** in operation”. Từ khoá câu hỏi: **operating today**.",
        "**13 — 42.5.** “forty-two **point five** metres”. Đơn vị đã in ⇒ chỉ viết số. 80 là chiều cao trụ (đã in sẵn).",
        "**14 — 65,000.** “enough for **sixty-five thousand** homes”. 200,000 là tổng số hộ của hạt.",
        "**15 — third.** “we supply **about a third** of them”. Chỗ trống đứng sau **about a** và trước **of all homes** ⇒ cần một phân số dạng chữ: **third**. Không viết 200,000 (tổng số hộ) hay 65,000 (đã dùng ở câu 14).",
        "**16 — 90.** Hai số cho **hai thứ**: thirteen = tốc độ **tối thiểu để quay**; **ninety** = mức **tự tắt** (“shut down… if the wind goes above ninety”). Câu hỏi hỏi **switch off… above**.",
        "**17 — 74.5.** “seventy-four point five million pounds”; eighty million là **ngân sách ban đầu**. Chữ million đã in.",
        "**18 — 2.5.** “take up just **two point five** per cent”; 97.5 là phần **còn lại**.",
        "**19 — sheep.** “a few **cattle** near the entrance, **but most of it** is used for **sheep**”. mainly = most of it.",
        "**20 — 15.** “fifteen more turbines. That's **fifteen, one five, not fifty**” ⇒ cụm đánh vần **one five** xác nhận 15; fifty là con số báo đưa sai. Câu này còn có **tương lai hoàn thành** của bài ngữ pháp: “by twenty thirty we **will have added**…” (câu hỏi đổi sang bị động: will have been added).",
      ],
    },

    { t: "h", text: "9. Bài nghe 3 — cuộc gọi kiểu Part 1: đặt in áp phích (giọng Mỹ + Anh)" },
    {
      t: "p",
      text: "**Questions 21–26.** Complete the form below. Write **A NUMBER** for each answer. Trong cuộc gọi này, nhân viên nghe nhầm và người nói phải **sửa số** hai lần; hai chỗ khác có **hai con số** (giá theo số lượng, giảm giá cũ và mới). Chỉ ghi con số **cuối cùng** đúng với câu hỏi, được hai bên xác nhận.",
    },
    {
      t: "table",
      caption: "CampusPrint — order form",
      head: ["Mục", "Chi tiết"],
      rows: [
        ["Customer", "Daniel Reeve — Department of Geography"],
        ["Item", "A2 conference posters, colour"],
        ["Number of copies", "**21** ___"],
        ["Paper weight", "**22** ___ grams"],
        ["Price per copy", "£ **23** ___"],
        ["Student discount", "**24** ___ %"],
        ["Total to pay", "£ **25** ___"],
        ["Ready for collection", "**26** ___ March, after 2 p.m."],
      ],
    },
    {
      t: "listen",
      id: "t3d5-nghe-in-ap-phich",
      title: "Ordering conference posters",
      dan: { so: "Day 5, Practice 3 (Listening Part 1)", boiCanh: "a telephone conversation between a student and an assistant at a university print shop.", cau: [21, 26] },
      note: "Khoảng 2 phút, hai giọng: nhân viên (Mỹ, nữ) và sinh viên (Anh, nam).",
      lines: [
        { who: "Assistant", voice: "us-nu", text: "CampusPrint, good afternoon. How can I help?", vi: "CampusPrint xin nghe. Tôi giúp gì được ạ?" },
        { who: "Daniel", voice: "uk-nam", text: "Hi, I'd like to order some posters for a conference. My name's Daniel Reeve, from Geography.", vi: "Chào chị, tôi muốn đặt in áp phích cho một hội thảo. Tôi là Daniel Reeve, khoa Địa lý." },
        { who: "Assistant", voice: "us-nu", text: "Sure. How many copies do you need?", vi: "Vâng. Anh cần bao nhiêu bản?" },
        { who: "Daniel", voice: "uk-nam", text: "A hundred and fifteen, please.", vi: "Một trăm mười lăm bản ạ." },
        { who: "Assistant", voice: "us-nu", text: "A hundred and fifty. OK.", vi: "Một trăm năm mươi. Được rồi." },
        { who: "Daniel", voice: "uk-nam", text: "No, sorry, fifteen. One one five. There are a hundred and fifteen people registered.", vi: "Không, xin lỗi, mười lăm. Một một năm. Có 115 người đăng ký." },
        { who: "Assistant", voice: "us-nu", text: "Got it, one one five. And which paper would you like? Our standard poster paper is a hundred and thirty-five grams, or there's a heavier one at a hundred and seventy.", vi: "Rõ rồi, một một năm. Anh muốn giấy nào? Giấy áp phích tiêu chuẩn là 135 gam, hoặc có loại dày hơn 170 gam." },
        { who: "Daniel", voice: "uk-nam", text: "They'll be on the wall for a week, so I'd better take the heavier one.", vi: "Chúng sẽ dán trên tường cả tuần, nên tôi lấy loại dày hơn." },
        { who: "Assistant", voice: "us-nu", text: "Good choice. On that paper, the price is ninety-five pence a copy up to a hundred copies, and above a hundred it drops to eighty-five pence.", vi: "Chọn hợp lý. Với giấy đó, giá là 95 xu một bản cho tới 100 bản, và trên 100 bản thì giảm còn 85 xu." },
        { who: "Daniel", voice: "uk-nam", text: "So for me that's eighty-five pence each. Is there a student discount on top of that?", vi: "Vậy với tôi là 85 xu một bản. Có giảm giá sinh viên nữa không?" },
        { who: "Assistant", voice: "us-nu", text: "There is. It used to be ten per cent, but since January it's been twelve point five per cent.", vi: "Có ạ. Trước đây là 10%, nhưng từ tháng Một là 12,5%." },
        { who: "Daniel", voice: "uk-nam", text: "Great. So what does that come to altogether?", vi: "Tuyệt. Vậy tổng cộng là bao nhiêu?" },
        { who: "Assistant", voice: "us-nu", text: "Let me see. Before the discount it's ninety-seven seventy-five, and with the discount, eighty-five pounds fifty-three.", vi: "Để tôi xem. Trước giảm giá là 97 bảng 75, và sau giảm giá là 85 bảng 53 xu." },
        { who: "Daniel", voice: "uk-nam", text: "Eighty-five fifty-three. Fine. The conference is on the second of April. Could they be ready by the thirtieth of March?", vi: "85 bảng 53. Được. Hội thảo vào ngày 2 tháng Tư. Có thể xong trước ngày 30 tháng Ba không?" },
        { who: "Assistant", voice: "us-nu", text: "The thirteenth? That's very soon.", vi: "Ngày 13 ạ? Thế thì gấp quá." },
        { who: "Daniel", voice: "uk-nam", text: "No, the thirtieth. Three zero.", vi: "Không, ngày 30. Ba không." },
        { who: "Assistant", voice: "us-nu", text: "Oh, the thirtieth. Yes, no problem. You can pick them up any time after two p.m.", vi: "À, ngày 30. Vâng, không vấn đề. Anh lấy bất cứ lúc nào sau 2 giờ chiều." },
      ],
    },
    {
      t: "quiz",
      id: "t3d5-nghe-in-ap-phich-cau",
      title: "Questions 21–26 — A NUMBER",
      kind: "fill",
      items: [
        { q: "21. Number of copies: ___", answers: ["115"] },
        { q: "22. Paper weight: ___ grams", answers: ["170"] },
        { q: "23. Price per copy: £ ___", answers: ["0.85", ".85"] },
        { q: "24. Student discount: ___ %", answers: ["12.5"] },
        { q: "25. Total to pay: £ ___", answers: ["85.53"] },
        { q: "26. Ready for collection: ___ March", answers: ["30", "30th"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích 21–26",
      items: [
        "**21 — 115.** Nhân viên nghe nhầm thành 150; Daniel sửa: “No, sorry, **fifteen. One one five**”. Luôn chờ cụm **đánh vần từng số**.",
        "**22 — 170.** Hai lựa chọn 135 và 170; Daniel không nói con số mà nói “**the heavier one**” ⇒ phải hiểu heavier = 170. Đây là bẫy band 6: đáp án được chọn bằng **paraphrase**, không bằng lặp số.",
        "**23 — 0.85.** 95 xu là giá **tới 100 bản**; Daniel đặt 115 bản ⇒ “above a hundred it drops to **eighty-five pence**”. Chỗ trống có ký hiệu £ ⇒ viết **0.85** (85 xu = 0.85 bảng); viết “85p” sau £ là sai.",
        "**24 — 12.5.** “It **used to be** ten per cent, but **since January** it's been **twelve point five**”. used to = ngày trước (Tập 2 Ngày 21).",
        "**25 — 85.53.** 97.75 là giá **trước** giảm; “with the discount, **eighty-five pounds fifty-three**”. Tiền đọc như hai số, không có “point”.",
        "**26 — 30.** “the thirtieth” bị nghe thành “the thirteenth”; Daniel xác nhận “**Three zero**”. Ngày 2 tháng Tư là ngày **hội thảo**.",
      ],
    },
    {
      t: "table",
      caption: "Tự chấm cả ba bài (26 câu)",
      head: ["Kết quả", "Mức", "Việc nên làm"],
      rows: [
        ["23–26", "Số liệu không còn là điểm yếu", "Sang Bài tập"],
        ["18–22", "Đạt mục tiêu band 6", "Xem câu sai thuộc loại nào: -teen/-ty · point · số lớn · hai số cho hai thứ → ghi sổ lỗi"],
        ["≤ 17", "Chưa đạt", "Nghe lại bài 1 và chép chính tả cả câu; luyện khối phát âm mục 6; ôn Tập 2 Ngày 3; làm lại sau 1 ngày"],
      ],
    },
    {
      t: "note",
      title: "Mẹo 2 phút kiểm đáp án (thi máy) — riêng cho các câu số",
      items: [
        "Số thập phân dùng **dấu chấm** chưa? Số hàng nghìn có **đủ ba số 0** chưa?",
        "Có **lặp đơn vị** đã in sẵn không (£, %, km, million)?",
        "Năm có **bốn chữ số** chưa? 1908 hay 1980?",
        "Số có **hợp lý** với ngữ cảnh không (giá, tuổi, nhiệt độ, số người)?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T3D5_BAI_TAP: Lesson = {
  id: "t3d5-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 5",
  goal: "Củng cố tương lai tiếp diễn – hoàn thành, ngôn ngữ dự báo Task 1, chọn tiêu đề theo ý chính và ghi số liệu phức — 38 câu có đáp án + một bài Task 1 có năm dự báo để AI chấm.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**38 câu** chia 6 phần: chọn thì (8) · chia động từ (6) · điền đoạn Task 1 có dự báo (6) · dịch Việt → Anh (6) · chọn tiêu đề (4) · đọc số (8).",
        "Cuối bài: **một bài Task 1 trọn vẹn** về biểu đồ có năm dự báo — AI chấm 4 tiêu chí.",
        "Làm **gập sách**. Sai phần nào thì mở lại đúng mục: I–IV → bài Ngữ pháp (mục 2–6) · V → bài Đọc (mục 2–4) · VI → bài Nghe (mục 1–5).",
        "Mục tiêu: **≥ 30/38**. Câu sai ghi vào **sổ lỗi** (Tập 3 Ngày 2) kèm lý do sai.",
      ],
    },

    { t: "h", text: "Phần I — Chọn thì đúng (8 câu)" },
    {
      t: "mcq",
      id: "t3d5-bt-chon-thi",
      title: "I. will V · will be V-ing · will have V3 · hiện tại đơn",
      items: [
        { q: "1. By the end of next year, the university ___ two new laboratories.", options: ["A will have built", "B will be build", "C builds", "D will building"], correct: 0, why: "**By the end of next year** + việc đã xong tính tới mốc → will have built." },
        { q: "2. Please don't call between two and three. I ___ a presentation.", options: ["A will have given", "B give", "C will be giving", "D will gave"], correct: 2, why: "Trong khoảng 2–3 giờ việc **đang diễn ra** → will be giving." },
        { q: "3. By the time the minister ___, the protesters will have gone home.", options: ["A will arrive", "B arrives", "C will be arriving", "D arrived"], correct: 1, why: "by the time + **hiện tại đơn**." },
        { q: "4. In thirty years' time, robots ___ most of the dangerous jobs in factories.", options: ["A are doing", "B will have do", "C will doing", "D will be doing"], correct: 3, why: "Xu hướng đang diễn ra tại mốc tương lai → will be doing." },
        { q: "5. The number of students is ___ to rise to 40,000 by 2035.", options: ["A expecting", "B expected", "C expect", "D expects"], correct: 1, why: "Bị động dự báo: **is expected to + V**." },
        { q: "6. Next month, my grandparents ___ married for fifty years.", options: ["A will have been", "B will be being", "C are", "D will been"], correct: 0, why: "Tính tới mốc, trạng thái đã kéo dài 50 năm → will have been." },
        { q: "7. Bus use fell to 20% in 2020, ___ expected to drop to 12% by 2040.", options: ["A before be", "B before it being", "C before being", "D before is"], correct: 2, why: "Sau giới từ before là V-ing: **before being expected to**." },
        { q: "8. ___ the library this evening? If so, could you return this book for me?", options: ["A Will you have gone to", "B Do you going to", "C Will you went to", "D Will you be going to"], correct: 3, why: "Hỏi lịch trình lịch sự trước khi nhờ → Will you be going…?" },
      ],
    },

    { t: "h", text: "Phần II — Chia động từ trong ngoặc (6 câu)" },
    {
      t: "quiz",
      id: "t3d5-bt-chia",
      title: "II. Viết dạng đúng của động từ",
      kind: "fill",
      items: [
        { q: "9. By 2050, the world's population ___ (reach) almost ten billion.", answers: ["will have reached"] },
        { q: "10. This time next week, we ___ (sit) on a beach in Phu Quoc.", answers: ["will be sitting", "'ll be sitting"] },
        { q: "11. I ___ (not finish) the report by five o'clock. Can I send it tomorrow morning?", answers: ["won't have finished", "will not have finished"] },
        { q: "12. When the new airport ___ (open), journey times will fall.", answers: ["opens"] },
        { q: "13. By the end of this term, she ___ (teach) at the school for twenty years.", answers: ["will have taught", "will have been teaching"] },
        { q: "14. Experts believe that in 2040 most families ___ (use) solar panels.", answers: ["will be using", "will use"] },
      ],
    },

    { t: "h", text: "Phần III — Điền đoạn Task 1 có dự báo (6 chỗ trống)" },
    {
      t: "chart",
      kind: "line",
      title: "Number of people (millions) using two types of transport to commute in one city, 2005–2035 (2030 and 2035 are forecasts)",
      unit: "triệu người",
      labels: ["2005", "2010", "2015", "2020", "2025", "2030*", "2035*"],
      series: [
        { name: "Car", values: [3.2, 3.5, 3.6, 3.3, 3.0, 2.6, 2.2] },
        { name: "Metro", values: [0.4, 0.8, 1.5, 2.1, 2.7, 3.2, 3.6] },
      ],
    },
    {
      t: "quiz",
      id: "t3d5-bt-doan-du-bao",
      title: "III. Điền MỘT từ hoặc MỘT con số vào mỗi chỗ trống",
      kind: "fill",
      items: [
        { q: "15. The number of car commuters peaked at ___ million in 2015.", answers: ["3.6"] },
        { q: "16. It then fell to 3 million in 2025, before ___ expected to decline further to 2.2 million in 2035.", answers: ["being"] },
        { q: "17. Metro use rose steadily from 0.4 million to 2.7 million, followed by a ___ rise to 3.6 million by 2035. (tính từ bắt đầu bằng p)", answers: ["projected", "predicted"] },
        { q: "18. It is predicted ___ the metro will overtake the car between 2025 and 2030.", answers: ["that"] },
        { q: "19. By 2035, the number of metro users will ___ increased ninefold compared with 2005.", answers: ["have"] },
        { q: "20. Overall, car use has fallen since 2015 and is ___ to keep falling, while the metro is set to become the main way of commuting. (được dự báo — một từ)", answers: ["forecast", "expected", "projected", "predicted", "likely"] },
      ],
    },

    { t: "h", text: "Phần IV — Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t3d5-bt-dich",
      title: "IV. Dịch sang tiếng Anh",
      kind: "translate",
      grammar: "will be + V-ing · will have + V3 + by · by the time + hiện tại đơn · is expected / projected to + V · It is predicted that… will",
      items: [
        {
          q: "21. Giờ này năm sau tôi sẽ đang làm việc ở Singapore.",
          hint: "This time next year, I will be working, in Singapore",
          answers: ["This time next year I will be working in Singapore.", "This time next year, I will be working in Singapore.", "This time next year I'll be working in Singapore.", "This time next year, I'll be working in Singapore.", "I will be working in Singapore this time next year.", "I'll be working in Singapore this time next year.", "At this time next year, I will be working in Singapore.", "At this time next year I will be working in Singapore."],
        },
        {
          q: "22. Tới năm 2040, giá năng lượng mặt trời sẽ giảm còn một nửa rồi.",
          hint: "By 2040, the price / cost of solar energy / power, will have halved",
          answers: ["By 2040, the price of solar energy will have halved.", "By 2040 the price of solar energy will have halved.", "By 2040, the price of solar power will have halved.", "By 2040, the cost of solar energy will have halved.", "By 2040, the cost of solar power will have halved.", "The price of solar energy will have halved by 2040.", "The price of solar power will have halved by 2040.", "The cost of solar energy will have halved by 2040.", "The cost of solar power will have halved by 2040.", "By 2040, the price of solar energy will have fallen by half.", "By 2040, the price of solar power will have fallen by half.", "By 2040, the cost of solar energy will have fallen by half.", "By 2040, solar energy prices will have halved."],
        },
        {
          q: "23. Lúc chúng tôi tới nơi (việc sắp tới) thì cuộc họp đã bắt đầu rồi.",
          hint: "By the time we arrive / get there, the meeting, will have started / begun",
          answers: ["By the time we arrive, the meeting will have started.", "By the time we arrive, the meeting will have begun.", "By the time we get there, the meeting will have started.", "By the time we get there, the meeting will have begun.", "The meeting will have started by the time we arrive.", "The meeting will have begun by the time we arrive.", "The meeting will have started by the time we get there.", "The meeting will have begun by the time we get there."],
        },
        {
          q: "24. Tỉ lệ người cao tuổi được dự phóng sẽ đạt 25% vào năm 2050.",
          hint: "The proportion / percentage of elderly / older people, is projected to reach, 25%, by 2050",
          answers: ["The proportion of elderly people is projected to reach 25% by 2050.", "The proportion of older people is projected to reach 25% by 2050.", "The percentage of elderly people is projected to reach 25% by 2050.", "The percentage of older people is projected to reach 25% by 2050.", "The proportion of elderly people is expected to reach 25% by 2050.", "The proportion of older people is expected to reach 25% by 2050.", "The proportion of elderly people is predicted to reach 25% by 2050.", "The proportion of elderly people is forecast to reach 25% by 2050.", "The percentage of elderly people is expected to reach 25% by 2050.", "The proportion of the elderly is projected to reach 25% by 2050.", "The proportion of old people is projected to reach 25% by 2050.", "The proportion of elderly people is projected to reach 25 per cent by 2050.", "The proportion of elderly people is projected to reach 25 percent by 2050."],
        },
        {
          q: "25. Người ta dự đoán rằng số người làm việc tại nhà sẽ tăng gấp đôi.",
          hint: "It is predicted that, the number of people working from home, will double",
          answers: ["It is predicted that the number of people working from home will double.", "It is predicted that the number of people who work from home will double.", "It is expected that the number of people working from home will double.", "It is expected that the number of people who work from home will double.", "It is forecast that the number of people working from home will double.", "It is predicted that the number of home workers will double.", "It is predicted that the number of people working at home will double."],
        },
        {
          q: "26. Hai mươi năm nữa, hầu hết mọi người sẽ đang dùng xe buýt điện.",
          hint: "In twenty years' time, most people, will be using, electric buses",
          answers: ["In twenty years' time, most people will be using electric buses.", "In twenty years' time most people will be using electric buses.", "In twenty years, most people will be using electric buses.", "In twenty years most people will be using electric buses.", "In 20 years' time, most people will be using electric buses.", "In 20 years, most people will be using electric buses.", "Twenty years from now, most people will be using electric buses.", "Most people will be using electric buses in twenty years' time.", "Most people will be using electric buses in twenty years."],
        },
      ],
    },

    { t: "h", text: "Phần V — Chọn tiêu đề theo ý chính (4 câu)" },
    {
      t: "p",
      text: "Mỗi đoạn có một tiêu đề đúng và ba tiêu đề bẫy (trùng chữ · chi tiết · đúng một nửa · trái nghĩa). Tự tóm tắt 3–6 từ trước khi chọn.",
    },
    {
      t: "mcq",
      id: "t3d5-bt-tieu-de",
      title: "V. Choose the best heading",
      items: [
        {
          q: "27. “Bees are usually praised for the honey they make, but their real economic value lies elsewhere. Around a third of the food crops we eat depend on insects to carry pollen from flower to flower, and bees do most of this work. Without them, farmers would have to pay people to do the job by hand, as already happens in a few orchards.”",
          options: ["A How honey is produced", "B Bees' hidden contribution to farming", "C Workers who replace bees in orchards", "D Why food crops are becoming more expensive"],
          correct: 1,
          why: "Đảo chiều sau **but**: “their real economic value lies elsewhere” → thụ phấn cho cây trồng = hidden contribution to farming. A lấy chữ honey ở câu đệm; C là chi tiết cuối đoạn; D không có.",
        },
        {
          q: "28. “When the city introduced a small charge for plastic bags, critics predicted that shoppers would simply pay and carry on as before. Instead, the number of bags handed out fell by 80% within a year. A fee of only a few pence had done what a decade of advertising campaigns had failed to do.”",
          options: ["A A decade of advertising campaigns", "B Why shoppers ignored the new charge", "C The cost of producing plastic bags", "D A small fee with a large effect"],
          correct: 3,
          why: "Câu cuối chốt: phí vài xu làm được điều quảng cáo không làm nổi → small fee, large effect. B **trái nghĩa** (người mua đã thay đổi); A trùng chữ; C không có.",
        },
        {
          q: "29. “Learning a second language in childhood brings clear advantages: children pick up pronunciation easily and feel little embarrassment. Adults, on the other hand, have their own strengths. They can read, they understand grammar explanations, and they know how to organise their study. Research suggests that, hour for hour, adult learners often progress faster at first.”",
          options: ["A Different strengths at different ages", "B Why children are better language learners", "C How adults organise their study", "D The role of pronunciation in language learning"],
          correct: 0,
          why: "Đoạn **hai nửa**: trẻ em có lợi thế này, người lớn có lợi thế kia → Different strengths at different ages. B **đúng một nửa** (và bị nửa sau phản lại); C, D là chi tiết.",
        },
        {
          q: "30. “The town's new library cost twice the original estimate and opened three years late. Yet visitor numbers have been far higher than expected, the café is always full, and local schools use the building every day. Few residents now complain about the price.”",
          options: ["A A project that went over budget", "B Why the library opened late", "C An expensive building that has proved its worth", "D How local schools use the library"],
          correct: 2,
          why: "Ý chính sau **Yet** + câu cuối: đắt và chậm nhưng thành công → has proved its worth. A **đúng một nửa** (chỉ câu đầu); B sai loại câu hỏi (đoạn không giải thích vì sao); D chi tiết.",
        },
      ],
    },

    { t: "h", text: "Phần VI — Đọc số: viết bằng chữ số (8 câu)" },
    {
      t: "quiz",
      id: "t3d5-bt-so",
      title: "VI. Viết con số bạn sẽ ghi vào phiếu trả lời",
      kind: "fill",
      items: [
        { q: "31. “nought point oh five” → ___", answers: ["0.05", ".05"] },
        { q: "32. “three thousand and sixty” → ___", answers: ["3,060", "3060"] },
        { q: "33. “nineteen oh four” (năm) → ___", answers: ["1904"] },
        { q: "34. “twenty-seven point five per cent” → ___ %", answers: ["27.5"] },
        { q: "35. “half a million” → ___", answers: ["500,000", "500000", "0.5 million"] },
        { q: "36. “two thirds” = khoảng ___ % (làm tròn số nguyên)", answers: ["67"] },
        { q: "37. “one point two five billion” → ___ billion", answers: ["1.25"] },
        { q: "38. “the eighteenth century” = the ___ (viết kiểu 1500s)", answers: ["1700s"] },
      ],
    },

    { t: "h", text: "Viết thêm — Task 1 có năm dự báo (AI chấm)" },
    {
      t: "p",
      text: "Dùng biểu đồ **Car / Metro** ở Phần III. Viết **trọn bài** ít nhất 150 từ trong **20 phút**: mở bài (paraphrase đề) → overview bao **cả quá khứ lẫn dự báo** → thân bài 1 (Car) → thân bài 2 (Metro). Mỗi đường **một câu trọn** đi từ quá khứ sang dự báo.",
    },
    {
      t: "essay",
      id: "t3d5-bt-viet-du-bao",
      task: "Task 1",
      prompt: "The line graph shows the number of people (in millions) who commuted by car and by metro in one city between 2005 and 2025, together with forecasts for 2030 and 2035. (Car: 3.2 – 3.5 – 3.6 – 3.3 – 3.0 – 2.6* – 2.2*; Metro: 0.4 – 0.8 – 1.5 – 2.1 – 2.7 – 3.2* – 3.6*; * = forecast.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Overview **không số**, bao hai giai đoạn: car **has fallen and is expected to keep falling**; metro **has grown and is set to overtake** the car.",
        "Phần 2005–2025: **quá khứ đơn**. Phần 2030–2035: ít nhất **3 khung dự báo khác nhau** (is projected to · It is predicted that… will · followed by a projected rise to · before being expected to · will have + V3).",
        "Nêu **điểm cắt**: metro vượt car trong khoảng 2025–2030.",
        "Soát: không có động từ quá khứ nào đi với năm 2030 / 2035; số thập phân dùng dấu chấm (3.6 million); million không thêm -s.",
      ],
    },
  ],
};

export const NGAY_5: Lesson[] = [T3D5_GRAMMAR, T3D5_DOC, T3D5_NGHE, T3D5_BAI_TAP];
