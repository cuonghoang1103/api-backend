/**
 * IELTS Tập 5 — Ngày 6 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, đề viết / nói VIẾT MỚI)
 *   Bài 1 (vocab)     Paraphrase & sắc thái band 8: bốn mức paraphrase · bốn trục sắc thái (độ mạnh · thái độ · văn phong ·
 *                     collocation) · 28 từ · sáu phép đổi cấu trúc · paraphrase đề không lệch nghĩa             [VD4 VD8]
 *                     — nối Tập 2 Ngày 8 · Tập 3 Ngày 3 · Tập 4 Ngày 3 (paraphrase 3 cách → ý ẩn) · Tập 5 Ngày 2 (collocation tinh)
 *                     · Ngày 4 (bốn phép thử từ ít gặp)
 *   Bài 2 (writing)   Task 1 mixed charts band 8 (bar + pie; mẫu band 7 và band 8 cạnh nhau) + hai đề lạ: so sánh HAI VẬT ·
 *                     các GIAI ĐOẠN PHÁT TRIỂN của một vật                                                    [W12 W02]
 *                     — nối Tập 3 Ngày 24 · Tập 4 Ngày 24 (mixed: mở bài 2 câu, overview mỗi hình một ý, mỗi khổ một hình)
 *   Bài 3 (speaking)  Part 3 band 8: phản biện, nhượng bộ thật, hedging khi nói                               [S06 G39]
 *                     — nối Tập 4 Ngày 2 (“Granted… but…”) · Tập 5 Ngày 1 (hedging đúng liều) · Ngày 2 (ngắt vì nội dung)
 *                     🔊 ngữ điệu thái độ: fall-rise dè dặt · high fall chắc chắn [S15]
 *   Bài tập Ngày 6    43 câu có đáp án + 1 bài viết + 1 lượt nói
 *   Kiểm tra chặng    `t5d6-kiem-tra` — gom Ngày 1–6 (ngữ pháp · từ vựng · dịch · nghe · đọc · viết · nói · phát âm)
 * Mọi id bắt đầu `t5d6-`. Biểu đồ, bảng số liệu, hai chiếc ấm, ba đời bàn là, tên Marlow / Oakdale / Kelso đều là hư cấu (số
 * liệu tự đặt). Dữ kiện có thật trong bài kiểm tra: Norton, Mochon & Ariely (2012) — “hiệu ứng IKEA”; cầu Millennium ở London
 * (mở 6/2000, đóng sau hai ngày, mở lại 2/2002).
 */
import type { Lesson } from '../data';

export const NGAY_6: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d6-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Paraphrase & sắc thái band 8 — đổi cách nói mà không đổi nghĩa; chọn từ đúng độ mạnh, thái độ, văn phong",
    goal: "Paraphrase một câu ở cả bốn mức (đồng nghĩa → đổi loại từ → đổi cấu trúc → ý ẩn) mà không làm lệch mức độ, phạm vi hay thái độ của câu gốc; chọn đúng từ trong 28 từ gần nghĩa theo bốn trục sắc thái — đúng mô tả LR band 8: “vốn từ rộng, dùng trôi chảy, chuyển nghĩa chính xác”.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **LR Writing / Speaking 7 → 8** và **Reading / Listening 35+**: cả bốn kỹ năng ở band 8 đều là bài thi về ==paraphrase==.",
          "Band 7: “dùng từ ít gặp, có ý thức về văn phong và collocation, **đôi chỗ chọn từ chưa chính xác**”. Band 8: “**chuyển nghĩa chính xác**”. Khác nhau ở chỗ: từ đồng nghĩa của band 8 phải ==đồng cả sắc thái==.",
          "**Bốn mức paraphrase** (ôn Tập 2 Ngày 8 · Tập 3 Ngày 3 · Tập 4 Ngày 3): đồng nghĩa → đổi loại từ → đổi cấu trúc → ý ẩn.",
          "**Bốn trục sắc thái**: độ mạnh · thái độ (khen / chê) · văn phong (viết / nói) · collocation. Lệch một trục là “chọn từ chưa chính xác”.",
          "**28 từ** theo bốn nhóm — học theo CẶP hoặc theo THANG, không học lẻ.",
          "Ba luật paraphrase đề: không đổi **mức độ**, không đổi **phạm vi**, không thay **từ kỹ thuật**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bốn mức paraphrase — một câu gốc đi qua cả bốn" },
      {
        t: "table",
        head: ["Mức", "Cách làm", "Câu gốc: “Many young people cannot afford to buy a home.”"],
        rows: [
          ["**1 — đồng nghĩa**", "thay từ bằng từ cùng nghĩa", "A large number of young adults are unable to purchase a house."],
          ["**2 — đổi loại từ**", "động từ ↔ danh từ ↔ tính từ", "Home ownership is unaffordable for many young adults."],
          ["**3 — đổi cấu trúc**", "đổi chủ ngữ, chủ động ↔ bị động, khẳng định ↔ phủ định", "House prices have put ownership beyond the reach of many of the young."],
          ["**4 — ý ẩn**", "nói hệ quả / biểu hiện của ý gốc, không nói thẳng", "A growing share of people in their twenties and thirties expect to rent for life."],
        ],
        caption: "Đề thi band 8 hỏi bằng mức 3–4; bài viết band 8 dùng mức 2–3",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — mức 4 dùng để ĐỌC và NGHE, không dùng để mở bài",
        items: [
          "Trong **Reading / Listening**, câu hỏi và đáp án cách nhau bằng mức 3–4. Bạn phải ==nhận ra==.",
          "Trong **Writing**, paraphrase đề bằng mức 4 là **đổi nghĩa đề**: “cannot afford to buy” ≠ “expect to rent for life”. Mở bài chỉ dùng mức 1–3.",
          "Trong **Speaking Part 3**, mức 2–3 để không lặp từ của giám khảo (Tập 2 Ngày 9 · Tập 3 Ngày 27).",
        ],
      },
      { t: "rule", formula: "Viết / Nói: paraphrase mức 1–3 (giữ nguyên nghĩa)   ·   Đọc / Nghe: nhận ra mức 3–4 (ý ẩn)", vi: "Tự paraphrase thì không được đổi nghĩa; đi tìm đáp án thì phải chấp nhận đáp án nói bằng hệ quả." },

      /* ── 2 ── */
      { t: "h", text: "2. Vì sao “đồng nghĩa” hiếm khi đồng nghĩa — bốn trục sắc thái" },
      {
        t: "p",
        text: "Từ điển đồng nghĩa xếp big, substantial, massive, considerable vào một dòng. Giám khảo thì không. Hai từ được coi là thay được cho nhau chỉ khi chúng trùng trên ==cả bốn trục== dưới đây.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Bốn trục sắc thái",
        cols: [
          { title: "① Độ mạnh", items: ["a **slight** / **modest** / **marked** / **dramatic** rise", "Hỏi: số liệu / bằng chứng có đỡ nổi từ này không?"] },
          { title: "② Thái độ", items: ["**thrifty** (khen) — **stingy** (chê)", "Hỏi: người nói đang khen, chê hay trung tính?"] },
          { title: "③ Văn phong", items: ["**ascertain** (viết) — **find out** (nói)", "Hỏi: Task 2 hay Part 1?"] },
          { title: "④ Collocation", items: ["**alleviate** poverty ✓ · ~~alleviate a mistake~~ → **rectify** a mistake", "Hỏi: từ này đi với danh từ nào?"] },
        ],
        caption: "Lệch một trục = “occasional inaccuracies in word choice” = band 7",
      },
      {
        t: "examples",
        items: [
          { en: "~~The price of bread soared by 2%.~~ → The price of bread **edged up** by 2%.", vi: "Lệch trục ①: soar là tăng vọt; 2% không đỡ nổi." },
          { en: "~~My grandfather is very stingy; I admire the way he never wastes anything.~~ → My grandfather is very **thrifty**…", vi: "Lệch trục ②: stingy là chê (keo kiệt); câu sau lại khen." },
          { en: "~~Governments should find out why kids quit school.~~ (Task 2) → Governments should **ascertain** why children **leave** school early.", vi: "Lệch trục ③: find out, kids, quit là văn nói." },
          { en: "~~The new law will alleviate crime.~~ → The new law will **reduce** crime. / …will **alleviate** overcrowding in prisons.", vi: "Lệch trục ④: alleviate đi với nỗi khổ, áp lực, triệu chứng (poverty, suffering, pressure, congestion), không đi với hành vi." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Nhóm A — độ mạnh: thang cho số lượng và thay đổi (7 từ)" },
      {
        t: "p",
        text: "Các tập trước đã cho bạn marginal, modest, considerable, substantial. Bảy từ dưới đây lấp các nấc còn thiếu ở hai đầu thang — chỗ người band 7 hay dùng very small và very big.",
      },
      {
        t: "table",
        head: ["Nấc", "Tính từ / trạng từ", "Động từ tăng", "Động từ giảm"],
        rows: [
          ["gần như không", "**negligible** · marginal", "edge up", "dip · edge down"],
          ["nhỏ, từng bước", "modest · **incremental**", "creep up", "ease"],
          ["đáng kể", "**sizeable** · considerable · substantial", "climb", "decline"],
          ["rõ, dễ thấy", "**pronounced** · marked", "surge", "**slump**"],
          ["rất mạnh, đột ngột", "**drastic** · dramatic", "**soar** · rocket", "plummet · collapse"],
        ],
        caption: "Thang độ mạnh — chọn theo con số, không theo cảm giác (từ in đậm là từ mới hôm nay)",
      },
      {
        t: "vocab",
        items: [
          { w: "negligible", pos: "adj", ipa: "/ˈneɡlɪdʒəbl/", vi: "nhỏ tới mức bỏ qua được", ex: "The difference between the two groups was negligible.", exVi: "Chênh lệch giữa hai nhóm nhỏ tới mức không đáng kể.", more: "a negligible effect / amount / risk · gốc: neglect (bỏ qua). Mạnh hơn small: hàm ý “không đáng tính”." },
          { w: "incremental", pos: "adj", ipa: "/ˌɪŋkrəˈmentl/", vi: "tăng / thay đổi từng nấc nhỏ", ex: "Progress has been incremental rather than revolutionary.", exVi: "Tiến bộ diễn ra từng bước nhỏ chứ không phải đột phá.", more: "incremental change / improvements · increment (n): nấc tăng (lương) · trái: radical, sweeping" },
          { w: "sizeable", pos: "adj", ipa: "/ˈsaɪzəbl/", vi: "khá lớn", ex: "A sizeable minority of voters remain undecided.", exVi: "Một thiểu số khá lớn cử tri vẫn chưa quyết định.", more: "a sizeable minority / proportion / sum · cũng viết sizable · nhẹ hơn substantial một chút" },
          { w: "pronounced", pos: "adj", ipa: "/prəˈnaʊnst/", vi: "rõ rệt, dễ nhận thấy", ex: "The gap is most pronounced among the over-65s.", exVi: "Khoảng cách rõ rệt nhất ở nhóm trên 65 tuổi.", more: "a pronounced difference / effect / accent · chỉ đứng trước danh từ trừu tượng, không nói ~~a pronounced building~~" },
          { w: "drastic", pos: "adj", ipa: "/ˈdræstɪk/", vi: "quyết liệt, mạnh tay (thường kèm ý rủi ro)", ex: "The council took drastic action to cut its debts.", exVi: "Hội đồng đã có hành động mạnh tay để cắt nợ.", more: "drastic measures / cuts / action · khác dramatic: drastic nói về BIỆN PHÁP có chủ ý; dramatic nói về mức thay đổi gây ấn tượng" },
          { w: "slump", pos: "v / n", ipa: "/slʌmp/", vi: "sụt mạnh; đợt sụt giảm", ex: "Sales slumped by a third after the scandal.", exVi: "Doanh số sụt một phần ba sau vụ bê bối.", more: "slump **by** 30% · a slump **in** demand · chỉ dùng cho thứ đáng lẽ nên cao (sales, profits, morale)" },
          { w: "soar", pos: "v", ipa: "/sɔː/", vi: "tăng vọt", ex: "Rents have soared since the university expanded.", exVi: "Giá thuê tăng vọt từ khi trường đại học mở rộng.", more: "soar to a record high · soaring costs · không dùng cho mức tăng dưới ~20–30%" },
        ],
      },
      {
        t: "quiz",
        id: "t5d6-tv-do-manh",
        kind: "fill",
        title: "Nhóm A — chọn từ đúng độ mạnh, gõ MỘT từ trong ngoặc (6 câu)",
        items: [
          { q: "Unemployment rose from 5.1% to 5.2% — a (negligible / pronounced) change.", answers: ["negligible"], hint: "0,1 điểm phần trăm: bỏ qua được." },
          { q: "House prices (edged up / soared) from $200,000 to $410,000 in four years.", answers: ["soared"], hint: "Hơn gấp đôi → tăng vọt." },
          { q: "The reform was (incremental / drastic): one small rule was changed each year for a decade.", answers: ["incremental"], hint: "Từng nấc nhỏ." },
          { q: "Faced with bankruptcy, the firm took the (modest / drastic) step of closing half its branches.", answers: ["drastic"], hint: "Đóng một nửa chi nhánh: biện pháp mạnh tay." },
          { q: "At 38%, renters form a (negligible / sizeable) share of the city's households.", answers: ["sizeable"], hint: "38% là khá lớn nhưng chưa phải đa số." },
          { q: "Car sales (dipped / slumped) by 45% during the fuel crisis.", answers: ["slumped"], hint: "45%: sụt mạnh; dip chỉ là giảm nhẹ." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Nhóm B — thái độ: cùng một sự thật, hai màu (10 từ = 5 cặp)" },
      {
        t: "p",
        text: "Mỗi cặp dưới đây tả ==cùng một hành vi==. Từ bên trái cho thấy người nói tán thành; từ bên phải cho thấy người nói chê. Trong Reading, đây chính là thứ câu hỏi YES / NO / NOT GIVEN và câu hỏi về “the writer's attitude” kiểm tra.",
      },
      {
        t: "table",
        head: ["Hành vi", "Khen (+)", "Chê (−)", "Trung tính"],
        rows: [
          ["tiêu ít tiền", "**thrifty** · frugal", "**stingy** · miserly", "careful with money"],
          ["không đổi ý", "**resolute** · determined", "**obstinate** · stubborn", "firm"],
          ["giỏi tính toán", "**shrewd** · astute", "**cunning** · calculating", "clever"],
          ["hay hỏi, hay tìm hiểu", "**inquisitive** · curious", "**nosy** · prying", "interested"],
          ["nhiều người biết tới", "**renowned** · celebrated", "**notorious** · infamous", "well known"],
        ],
        caption: "Năm cặp — học cả hàng, không học từng ô",
      },
      {
        t: "vocab",
        items: [
          { w: "thrifty", pos: "adj", ipa: "/ˈθrɪfti/", vi: "tằn tiện, biết tiết kiệm (khen)", ex: "A thrifty shopper compares prices before buying.", exVi: "Người mua sắm tằn tiện so giá trước khi mua.", more: "thrift (n) · gần nghĩa frugal (đã học) — frugal trang trọng hơn" },
          { w: "stingy", pos: "adj", ipa: "/ˈstɪndʒi/", vi: "keo kiệt (chê, văn nói)", ex: "He is too stingy to buy his own coffee.", exVi: "Anh ta keo tới mức không tự mua cà phê.", more: "stingy **with** money / praise · văn viết: miserly, mean (Anh – Anh)" },
          { w: "resolute", pos: "adj", ipa: "/ˈrezəluːt/", vi: "kiên quyết (khen)", ex: "She remained resolute in the face of criticism.", exVi: "Cô ấy vẫn kiên quyết trước những lời chỉ trích.", more: "resolute **in** + N / V-ing · resolve (n): quyết tâm · trái: irresolute" },
          { w: "obstinate", pos: "adj", ipa: "/ˈɒbstɪnət/", vi: "ngoan cố, cứng đầu (chê)", ex: "The minister's obstinate refusal to listen cost him his job.", exVi: "Việc ngài bộ trưởng ngoan cố không chịu nghe đã khiến ông mất chức.", more: "an obstinate refusal · obstinacy (n) · trang trọng hơn stubborn" },
          { w: "shrewd", pos: "adj", ipa: "/ʃruːd/", vi: "sắc sảo, biết tính toán (khen)", ex: "Buying the land before the railway arrived was a shrewd investment.", exVi: "Mua mảnh đất trước khi có đường sắt là một khoản đầu tư sắc sảo.", more: "a shrewd judge of character / move / investor" },
          { w: "cunning", pos: "adj / n", ipa: "/ˈkʌnɪŋ/", vi: "xảo quyệt, ranh mãnh (chê)", ex: "The scheme was a cunning way of avoiding tax.", exVi: "Kế hoạch đó là một cách ranh mãnh để né thuế.", more: "a cunning plan / trick · đạt mục đích bằng cách lừa" },
          { w: "inquisitive", pos: "adj", ipa: "/ɪnˈkwɪzətɪv/", vi: "ham tìm hiểu (khen)", ex: "Good science teachers keep children inquisitive.", exVi: "Giáo viên khoa học giỏi giữ cho trẻ luôn ham tìm hiểu.", more: "an inquisitive mind / child · inquiry (n)" },
          { w: "nosy", pos: "adj", ipa: "/ˈnəʊzi/", vi: "tọc mạch (chê, văn nói)", ex: "I don't want to sound nosy, but how much did it cost?", exVi: "Tôi không muốn tỏ ra tọc mạch, nhưng nó giá bao nhiêu vậy?", more: "nosy neighbours · văn viết: intrusive, prying" },
          { w: "renowned", pos: "adj", ipa: "/rɪˈnaʊnd/", vi: "lừng danh (vì điều tốt)", ex: "The city is renowned for its medical school.", exVi: "Thành phố lừng danh về trường y.", more: "renowned **for** + N · a world-renowned surgeon" },
          { w: "notorious", pos: "adj", ipa: "/nəʊˈtɔːriəs/", vi: "khét tiếng (vì điều xấu)", ex: "The junction is notorious for accidents.", exVi: "Ngã tư đó khét tiếng vì tai nạn.", more: "notorious **for** + N · notoriously difficult / unreliable — trạng từ này dùng rất nhiều trong văn học thuật" },
        ],
      },
      {
        t: "mcq",
        id: "t5d6-tv-thai-do",
        title: "Nhóm B — chọn từ đúng thái độ (8 câu)",
        items: [
          { q: "1. The region is ___ for its cheese, which is exported all over the world.", options: ["notorious", "renowned", "infamous", "cunning"], correct: 1, why: "Nổi tiếng vì điều tốt → renowned." },
          { q: "2. The writer calls the chairman's refusal to compromise “obstinate”. The writer's attitude is:", options: ["approving", "neutral", "critical", "amused"], correct: 2, why: "obstinate là từ chê. Nếu tán thành, người viết sẽ dùng resolute / firm." },
          { q: "3. Thanks to her ___ management of a small budget, the charity doubled its work.", options: ["stingy", "miserly", "thrifty", "cunning"], correct: 2, why: "Câu khen (Thanks to, doubled its work) → thrifty." },
          { q: "4. Tabloid newspapers are ___ unreliable on scientific matters.", options: ["thriftily", "notoriously", "shrewdly", "resolutely"], correct: 1, why: "notoriously + tính từ xấu: collocation cố định." },
          { q: "5. She asked so many questions about my salary that I found her rather ___ .", options: ["inquisitive", "resolute", "nosy", "shrewd"], correct: 2, why: "Người nói khó chịu (rather, about my salary) → nosy." },
          { q: "6. Selling the shares just before prices fell was a ___ decision.", options: ["shrewd", "nosy", "obstinate", "notorious"], correct: 0, why: "Quyết định khôn ngoan → shrewd." },
          { q: "7. In a Task 2 essay, which sentence keeps a neutral, academic tone?", options: ["Bosses are often too stingy to train their staff.", "Employers are often reluctant to invest in training.", "Employers are notoriously cunning about training.", "Bosses are obstinate about training budgets."], correct: 1, why: "Văn học thuật tránh từ chê cảm tính; reluctant to invest là trung tính và đo được." },
          { q: "8. “The firm found a ___ way round the regulations.” Người viết muốn ngầm chê. Từ đúng là:", options: ["shrewd", "resolute", "cunning", "renowned"], correct: 2, why: "Lách luật bằng mánh → cunning (chê). shrewd sẽ thành khen." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Nhóm C — văn phong: sáu động từ của Task 2 và từ thường tương ứng" },
      {
        t: "table",
        head: ["Viết (Task 1 · 2)", "Nói (Part 1–3)", "Đi với"],
        rows: [
          ["**alleviate**", "ease · make … less bad", "poverty · pressure · congestion · suffering · symptoms"],
          ["**ascertain**", "find out · work out", "the cause · whether… · the facts"],
          ["**deem**", "think · consider", "be deemed necessary / unsafe / a success"],
          ["**forgo**", "go without · give up", "a holiday · income · the right to…"],
          ["**warrant**", "justify · call for", "attention · further study · an investigation"],
          ["**rectify**", "put right · fix", "a mistake · the situation · an imbalance"],
        ],
        caption: "Sáu cặp viết – nói. Trong Speaking, dùng cột giữa; dùng cột trái là “viết ra miệng”",
      },
      {
        t: "vocab",
        items: [
          { w: "alleviate", pos: "v", ipa: "/əˈliːvieɪt/", vi: "làm dịu, giảm bớt (nỗi khổ, áp lực)", ex: "A new bridge would alleviate congestion in the centre.", exVi: "Một cây cầu mới sẽ giảm bớt ùn tắc ở trung tâm.", more: "alleviate poverty / pressure / symptoms · không ~~alleviate crime~~ · alleviation (n)" },
          { w: "ascertain", pos: "v", ipa: "/ˌæsəˈteɪn/", vi: "xác định, tìm hiểu cho chắc", ex: "It is difficult to ascertain whether the scheme has worked.", exVi: "Khó xác định được chương trình có hiệu quả hay không.", more: "ascertain the cause / whether… / that… · nhấn ở âm cuối" },
          { w: "deem", pos: "v", ipa: "/diːm/", vi: "cho là, coi là (trang trọng)", ex: "The bridge was deemed unsafe and closed.", exVi: "Cây cầu bị cho là không an toàn và bị đóng.", more: "be deemed + adj / to be · không dùng ở thì tiếp diễn" },
          { w: "forgo", pos: "v", ipa: "/fɔːˈɡəʊ/", vi: "bỏ qua, nhịn (thứ mình muốn / được hưởng)", ex: "Many parents forgo holidays to pay school fees.", exVi: "Nhiều bậc cha mẹ nhịn đi nghỉ để trả học phí.", more: "forgo – forwent – forgone · forgone income · khác forget" },
          { w: "warrant", pos: "v", ipa: "/ˈwɒrənt/", vi: "đáng để, biện minh cho", ex: "The rise in cases warrants further investigation.", exVi: "Số ca tăng đáng được điều tra thêm.", more: "warrant attention / concern / a response · unwarranted (adj): vô cớ" },
          { w: "rectify", pos: "v", ipa: "/ˈrektɪfaɪ/", vi: "sửa cho đúng, khắc phục", ex: "The error was rectified before the report was published.", exVi: "Lỗi đã được khắc phục trước khi báo cáo công bố.", more: "rectify a mistake / an imbalance / the situation" },
        ],
      },
      {
        t: "quiz",
        id: "t5d6-tv-van-phong",
        kind: "fill",
        title: "Nhóm C — viết lại cho đúng văn phong Task 2: điền MỘT động từ của mục 5, chia đúng dạng (6 câu)",
        items: [
          { q: "More buses would (make less bad) ___ the pressure on the city's roads.", answers: ["alleviate"], hint: "alleviate pressure." },
          { q: "Researchers have yet to (find out) ___ why the disease spreads faster in winter.", answers: ["ascertain"], hint: "ascertain why…" },
          { q: "The building was (thought) ___ too dangerous to enter.", answers: ["deemed"], hint: "be deemed + adj." },
          { q: "Workers who retire early (give up) ___ part of their pension.", answers: ["forgo"], hint: "forgo income / pension. Chủ ngữ số nhiều." },
          { q: "A problem on this scale (calls for) ___ a national response.", answers: ["warrants"], hint: "warrant a response; chủ ngữ số ít." },
          { q: "The company promised to (put right) ___ the mistake within a week.", answers: ["rectify"], hint: "rectify a mistake." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Nhóm D — động từ tường thuật: người viết tin tới đâu (5 từ)" },
      {
        t: "p",
        text: "Tập 3 Ngày 19 và Tập 4 Ngày 17 đã dạy claim, argue, suggest, acknowledge, concede. Năm từ dưới đây cho biết thêm một điều: ==người tường thuật có tin lời được tường thuật hay không==. Đây là chỗ câu hỏi YES / NO / NOT GIVEN band 8 đặt bẫy.",
      },
      {
        t: "table",
        head: ["Động từ", "Người được tường thuật làm gì", "Người viết ngầm cho biết"],
        rows: [
          ["**contend** that", "khẳng định trong một cuộc tranh luận", "đây là một phía; có phía khác"],
          ["**allege** that", "cáo buộc, chưa có bằng chứng", "chưa được chứng minh — tôi không bảo đảm"],
          ["**refute**", "CHỨNG MINH điều gì là sai", "tôi coi phản bác đó là thành công"],
          ["**downplay**", "làm cho có vẻ ít quan trọng hơn", "thật ra nó quan trọng hơn họ nói"],
          ["**insinuate** that", "nói bóng gió điều khó chịu", "tôi thấy cách nói đó không đàng hoàng"],
        ],
        caption: "Năm động từ tường thuật có thái độ",
      },
      {
        t: "vocab",
        items: [
          { w: "contend", pos: "v", ipa: "/kənˈtend/", vi: "cho rằng, khẳng định (trong tranh luận)", ex: "Critics contend that the tax hits the poorest hardest.", exVi: "Giới phê bình cho rằng khoản thuế đánh nặng nhất vào người nghèo nhất.", more: "contend that… · contention (n): luận điểm · contend with (đương đầu với) là nghĩa khác" },
          { w: "allege", pos: "v", ipa: "/əˈledʒ/", vi: "cáo buộc (chưa được chứng minh)", ex: "The report alleges that safety checks were skipped.", exVi: "Bản báo cáo cáo buộc rằng các bước kiểm tra an toàn đã bị bỏ qua.", more: "it is alleged that… · the alleged fraud · allegation (n) · allegedly (adv)" },
          { w: "refute", pos: "v", ipa: "/rɪˈfjuːt/", vi: "bác bỏ bằng chứng cứ, chứng minh là sai", ex: "Later studies refuted the claim that the drug was harmless.", exVi: "Các nghiên cứu sau đã bác bỏ nhận định rằng thuốc vô hại.", more: "refute a claim / theory · KHÔNG phải “phủ nhận”: chỉ nói “tôi không đồng ý” thì dùng deny / reject / dispute" },
          { w: "downplay", pos: "v", ipa: "/ˌdaʊnˈpleɪ/", vi: "làm nhẹ đi, nói giảm tầm quan trọng", ex: "Officials downplayed the risk of flooding.", exVi: "Các quan chức nói giảm nguy cơ lũ lụt.", more: "downplay the risk / importance / significance · = play down · trái: overstate, exaggerate" },
          { w: "insinuate", pos: "v", ipa: "/ɪnˈsɪnjueɪt/", vi: "nói bóng gió (điều khó chịu)", ex: "The article insinuates that the minister lied.", exVi: "Bài báo bóng gió rằng ngài bộ trưởng đã nói dối.", more: "insinuate that… · insinuation (n) · mạnh và xấu hơn imply / hint" },
        ],
      },
      {
        t: "mcq",
        id: "t5d6-tv-tuong-thuat",
        title: "Nhóm D — động từ tường thuật (6 câu)",
        items: [
          { q: "1. “The company's lawyers refuted the accusation.” Theo người viết, lời buộc tội:", options: ["vẫn chưa ngã ngũ", "đã bị chứng minh là sai", "là đúng", "bị công ty lờ đi"], correct: 1, why: "refute = chứng minh là sai. Nếu chỉ “phủ nhận”, người viết sẽ dùng denied / rejected." },
          { q: "2. A journalist cannot prove a claim and wants to avoid being sued. The safest verb is:", options: ["proves", "shows", "alleges", "refutes"], correct: 2, why: "allege: nêu cáo buộc mà không bảo đảm nó đúng." },
          { q: "3. “The minister downplayed the figures.” The writer implies that the figures were:", options: ["more serious than the minister suggested", "less serious than reported", "invented", "accurate and reassuring"], correct: 0, why: "downplay: làm cho có vẻ nhẹ hơn thực tế." },
          { q: "4. Câu nào dùng contend đúng?", options: ["The data contend a fall in demand.", "Economists contend that the policy will raise prices.", "He contended the meeting.", "She contended me to stay."], correct: 1, why: "contend that + mệnh đề; chủ ngữ là người / nhóm người đang tranh luận." },
          { q: "5. Trong Task 2, câu nào quá mạnh so với việc bạn chỉ đang nêu ý kiến ngược lại?", options: ["I would dispute this view.", "I reject this view.", "This view is open to question.", "I refute this view."], correct: 3, why: "refute đòi hỏi bằng chứng dứt khoát. Một bài luận 250 từ chỉ dispute / question / reject được." },
          { q: "6. “Some commentators insinuate that the award was bought.” Thái độ của người viết với các commentators:", options: ["tán thành", "không tán thành cách họ nói", "trung tính", "biết ơn"], correct: 1, why: "insinuate mang nghĩa xấu: nói bóng gió, không nói thẳng, không đưa bằng chứng." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Paraphrase mức 3 — sáu phép đổi cấu trúc" },
      {
        t: "patterns",
        rows: [
          {
            formula: "X causes Y   ↔   Y stems from / is attributable to X",
            vi: "① đảo chủ ngữ nguyên nhân – kết quả",
            examples: [{ en: "Poor diet causes many health problems. → Many health problems are attributable to poor diet.", vi: "Chế độ ăn kém gây ra nhiều vấn đề sức khoẻ." }],
          },
          {
            formula: "S + V + adv   ↔   There + be + adj + N   /   N + V",
            vi: "② danh hoá (Ngày 1 mục 6) — nhớ đổi trạng từ thành tính từ",
            examples: [{ en: "Sales fell sharply. → There was a sharp fall in sales. / Sales saw a sharp fall.", vi: "Doanh số giảm mạnh." }],
          },
          {
            formula: "adj   ↔   not + adj trái nghĩa   (not uncommon · far from clear)",
            vi: "③ phủ định của từ trái nghĩa — nhẹ hơn câu gốc nửa bậc, coi chừng",
            examples: [{ en: "Such cases are common. → Such cases are by no means rare.", vi: "Những trường hợp như vậy là phổ biến." }],
          },
          {
            formula: "If + S + do not V …   ↔   Without + N / Unless + S + V …",
            vi: "④ điều kiện ↔ cụm giới từ",
            examples: [{ en: "If governments do not invest, the system will fail. → Without public investment, the system will fail.", vi: "Nếu chính phủ không đầu tư, hệ thống sẽ sụp." }],
          },
          {
            formula: "A is cheaper than B   ↔   B costs more than A   ↔   A is not as expensive as B",
            vi: "⑤ đảo chiều so sánh",
            examples: [{ en: "Rail is slower than air travel. → Flying takes less time than going by train.", vi: "Tàu hoả chậm hơn máy bay." }],
          },
          {
            formula: "People + V + O   ↔   O + be + V3   ↔   It is + V3 + that …",
            vi: "⑥ chủ động ↔ bị động ↔ chủ ngữ giả",
            examples: [{ en: "Many people believe that prisons do not work. → Prisons are widely believed to be ineffective. / It is widely believed that prisons are ineffective.", vi: "Nhiều người tin rằng nhà tù không hiệu quả." }],
          },
        ],
      },
      { t: "rule", formula: "đổi chủ ngữ + đổi loại từ + giữ nguyên mức độ (many → many, không thành most)", vi: "Paraphrase tốt đổi ít nhất HAI thứ (cấu trúc + từ) và giữ nguyên ba thứ: mức độ, phạm vi, thái độ." },
      {
        t: "quiz",
        id: "t5d6-tv-cau-truc-dich",
        kind: "translate",
        title: "Viết lại câu tiếng Anh bằng phép đổi trong gợi ý (5 câu)",
        grammar: "X causes Y ↔ Y is attributable to X · danh hoá · Without + N · bị động + to be",
        items: [
          { q: "Viết lại bắt đầu bằng “Much of the rise…”: Cheap credit caused much of the rise in house prices.", answers: ["Much of the rise in house prices is attributable to cheap credit.", "Much of the rise in house prices was attributable to cheap credit.", "Much of the rise in house prices stemmed from cheap credit.", "Much of the rise in house prices was caused by cheap credit."], hint: "is / was attributable to · stemmed from" },
          { q: "Viết lại bắt đầu bằng “There has been…”: The number of applicants has increased considerably.", answers: ["There has been a considerable increase in the number of applicants.", "There has been a considerable rise in the number of applicants."], hint: "a considerable increase in" },
          { q: "Viết lại bắt đầu bằng “Without…”: If teachers do not receive proper training, the new curriculum will fail.", answers: ["Without proper training for teachers, the new curriculum will fail.", "Without proper teacher training, the new curriculum will fail.", "Without properly trained teachers, the new curriculum will fail."], hint: "Without + N" },
          { q: "Viết lại bắt đầu bằng “Remote work is…”: Many people think that remote work reduces stress.", answers: ["Remote work is widely thought to reduce stress.", "Remote work is widely believed to reduce stress.", "Remote work is thought by many to reduce stress."], hint: "is widely thought / believed to + V" },
          { q: "Viết lại bắt đầu bằng “Renting…”: Buying a flat in the centre is more expensive than renting one.", answers: ["Renting a flat in the centre is cheaper than buying one.", "Renting a flat in the centre is less expensive than buying one.", "Renting a flat in the centre costs less than buying one.", "Renting a flat in the centre is not as expensive as buying one."], hint: "đảo chiều so sánh" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Paraphrase đề Writing — ba luật không được phạm" },
      {
        t: "table",
        head: ["Luật", "Đề", "✗ Paraphrase lệch", "✓ Paraphrase đúng"],
        rows: [
          ["Không đổi **mức độ**", "**Some** people think…", "It is generally believed… / Everyone agrees…", "It is sometimes argued… / According to one view…"],
          ["Không đổi **phạm vi**", "…**children** should learn a foreign language at **primary school**", "…students should study languages at school", "…language teaching should begin in the first years of schooling"],
          ["Không thay **từ kỹ thuật**", "**public transport** · **renewable energy** · **unemployment**", "common vehicles · new power · having no jobs", "giữ nguyên, hoặc chỉ dùng từ đã cố định: mass transit · renewables · joblessness"],
          ["Không đổi **thái độ**", "the **growth** of online shopping", "the invasion of online shopping", "the rise / spread of online shopping"],
        ],
        caption: "Bốn cách paraphrase đề làm lệch nghĩa — và mất điểm TR ngay câu đầu",
      },
      {
        t: "mcq",
        id: "t5d6-tv-paraphrase-de",
        title: "Bản paraphrase nào GIỮ NGUYÊN nghĩa của đề? (6 câu)",
        items: [
          { q: "1. Đề: “Some people believe that unpaid community service should be a compulsory part of high school programmes.”", options: ["Everyone agrees that teenagers must do volunteer work.", "It is sometimes argued that secondary schools should require their students to do voluntary work in the community.", "Many believe that schools should encourage students to help their communities.", "Some argue that university students should be paid for community work."], correct: 1, why: "Some → sometimes argued ✓ · compulsory → require ✓ · unpaid → voluntary ✓ · high school → secondary schools ✓. A đổi mức độ. C đổi compulsory thành encourage. D đổi phạm vi và unpaid." },
          { q: "2. Đề: “In many countries, the proportion of older people is steadily increasing.”", options: ["The number of elderly people is exploding everywhere.", "Older people now form the majority in most countries.", "The share of the population made up of the elderly is rising gradually in a large number of countries.", "People in many countries are living longer than ever."], correct: 2, why: "proportion → share ✓ · steadily → gradually ✓ · many → a large number of ✓. A lệch độ mạnh và phạm vi. B thêm ý majority. D là nguyên nhân (mức 4), không phải ý của đề." },
          { q: "3. Đề: “Advertising aimed at children should be banned.”", options: ["Advertisements seen by children should be controlled.", "All advertising is harmful to children and should be stopped.", "Marketing that targets children ought to be prohibited.", "Children should be banned from watching advertisements."], correct: 2, why: "aimed at → targets ✓ · banned → prohibited ✓. A: seen by ≠ aimed at, controlled ≠ banned. B thêm All và harmful. D đảo đối tượng bị cấm." },
          { q: "4. Đề: “The main cause of traffic congestion is the low cost of driving.”", options: ["Cheap motoring is one of several reasons for traffic jams.", "Traffic jams are chiefly attributable to how cheap it is to drive.", "Driving is cheap, and there is a lot of traffic.", "The only cause of congestion is cheap petrol."], correct: 1, why: "the main cause → chiefly attributable to ✓. A hạ xuống one of several. C mất quan hệ nhân quả. D đổi main thành only và thu hẹp thành petrol." },
          { q: "5. Đề: “Some employers now allow staff to work from home for part of the week.”", options: ["Most companies have closed their offices.", "A number of employers currently permit their employees to spend some of their working week at home.", "Some workers refuse to come to the office.", "Employers now force staff to work remotely."], correct: 1, why: "Some → A number of ✓ · allow → permit ✓ · part of the week → some of their working week ✓." },
          { q: "6. Đề: “Governments spend large amounts on space exploration.” Từ nào KHÔNG nên thay?", options: ["Governments", "spend", "large amounts", "space exploration"], correct: 3, why: "space exploration là từ kỹ thuật của đề. Governments → states / the authorities; spend → devote / allocate; large amounts → vast sums." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Kiểm tra cuối bài (10 câu)" },
      {
        t: "mcq",
        id: "t5d6-tv-kiem-tra",
        title: "Chọn phương án đúng (10 câu)",
        items: [
          { q: "1. Bài đọc: “The scheme attracted only a handful of applicants.” Câu hỏi nào là paraphrase đúng?", options: ["The scheme was oversubscribed.", "Interest in the scheme was negligible.", "The scheme was notorious.", "Applicants found the scheme drastic."], correct: 1, why: "only a handful → negligible interest (mức 2–3)." },
          { q: "2. A 3% rise is best described as:", options: ["a surge", "a soaring increase", "a modest increase", "a drastic increase"], correct: 2, why: "3%: modest." },
          { q: "3. Which word shows the writer approves?", options: ["cunning", "obstinate", "nosy", "shrewd"], correct: 3, why: "shrewd là khen." },
          { q: "4. It is hard to ___ how many people were affected.", options: ["alleviate", "ascertain", "forgo", "warrant"], correct: 1, why: "ascertain how many…: xác định." },
          { q: "5. Students who work part-time often ___ sleep in order to finish assignments.", options: ["forgo", "rectify", "deem", "allege"], correct: 0, why: "forgo sleep: nhịn ngủ." },
          { q: "6. The evidence does not ___ such a strong conclusion.", options: ["contend", "downplay", "warrant", "insinuate"], correct: 2, why: "warrant a conclusion: đủ để biện minh cho kết luận." },
          { q: "7. “Pollution has worsened markedly.” → There has been a ___ deterioration in air quality.", options: ["markedly", "marked", "marking", "mark"], correct: 1, why: "Danh hoá: trạng từ markedly → tính từ marked." },
          { q: "8. Người viết dùng “alleged benefits” để cho thấy họ:", options: ["chắc chắn lợi ích có thật", "nghi ngờ lợi ích đó", "đã chứng minh lợi ích đó sai", "không quan tâm"], correct: 1, why: "alleged: được cho là, chưa chứng minh → người viết giữ khoảng cách." },
          { q: "9. Trong Speaking Part 1, câu nào tự nhiên hơn?", options: ["I endeavour to ascertain the bus times beforehand.", "I usually try to find out the bus times beforehand.", "I deem it necessary to rectify my timetable.", "I forgo breakfast owing to time constraints."], correct: 1, why: "Part 1 là văn nói: find out, try. Ba câu kia là “viết ra miệng”." },
          { q: "10. Đề nói “most”. Trong mở bài bạn viết “all”. Bạn đã phạm luật nào?", options: ["đổi phạm vi", "đổi mức độ", "thay từ kỹ thuật", "đổi thái độ"], correct: 1, why: "most → all: đổi mức độ; cả bài sẽ trả lời một đề khác." },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học 28 từ này",
        items: [
          "Chép vào sổ theo **hàng** của bảng mục 3–6 (cả thang, cả cặp), không chép từng từ.",
          "Mỗi từ viết **một câu về chính bạn hoặc nơi bạn sống** — câu có thật thì nhớ được sắc thái.",
          "28 từ tự vào mục Tra từ vựng của Tập 5 và Flashcards của khoá. Ôn ngày 1 · 3 · 7; Ngày 18 (Idiom & sắc thái vòng cuối) sẽ kiểm lại.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d6-viet",
    kind: "writing",
    title: "Viết Task 1: mixed charts band 8 + hai đề lạ — so sánh hai vật · các giai đoạn phát triển",
    goal: "Viết trọn một bài Task 1 hai biểu đồ khác loại ở mức band 8 trong 20 phút (overview không số, bao cả hai hình và nêu được điểm nối giữa chúng; thân bài gộp nhóm, tính được tỉ lệ từ số thô); và không bị bất ngờ trước hai đề lạ — hình vẽ so sánh hai vật, hình vẽ các đời của một vật — nhờ hai khung dựng sẵn.",
    minutes: 110,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **TA Task 1 7 → 8**: band 7 “nêu rõ các đặc điểm chính nhưng có thể triển khai đầy đủ hơn”; band 8 “==trình bày, làm nổi bật và minh hoạ đủ== các đặc điểm chính”.",
          "Nối **Tập 3 Ngày 24 · Tập 4 Ngày 24**: khung mixed vẫn thế — mở bài 2 vế, overview mỗi hình một ý, mỗi khổ một hình, mỗi hình một thì.",
          "Ba thứ thêm ở band 8: ① overview có ==điểm nối giữa hai hình== (một quan sát thấy được, không suy diễn) · ② ==tính== từ số thô (tổng, tỉ lệ, bội số) · ③ gộp nhóm, không đi từng cột.",
          "**Đề lạ ①** — hình vẽ hai vật: overview = giống nhau ở chức năng, khác nhau ở cơ chế; thân bài = từng vật, hoặc giống / khác.",
          "**Đề lạ ②** — các giai đoạn phát triển: overview = hướng thay đổi chung; thân bài theo từng giai đoạn; thì quá khứ + ngôn ngữ thay thế (gave way to, the addition of).",
          "Đề lạ không cần từ kỹ thuật. Cần ==gọi tên bộ phận bằng từ trên hình== và ==ngôn ngữ so sánh== bạn đã có.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Task Achievement — band 7 và band 8 khác nhau ở chữ nào" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8", "Việc phải làm"],
        rows: [
          ["**TA**", "overview rõ; nêu đặc điểm chính nhưng còn kể lần lượt", "làm nổi bật và minh hoạ đủ; chi tiết được chọn", "gộp nhóm; mỗi nhận định một số liệu chứng minh"],
          ["**CC**", "tổ chức logic; từ nối đa dạng, đôi chỗ máy móc (Looking at… / Regarding…)", "xâu chuỗi tự nhiên; quy chiếu tốt", "nối bằng by contrast, the latter, a further 19%, this figure"],
          ["**LR**", "increased · decreased · the biggest", "tripled · more than halved · edged up · accounting for", "động từ chính xác theo độ mạnh (Bài 1 mục 3)"],
          ["**GRA**", "câu ghép dài nối bằng and / but", "mệnh đề quan hệ, phân từ, with + N; đa số câu sạch", "1–2 câu nhiều tầng mỗi khổ (Ngày 5)"],
        ],
        caption: "Task 1 — bốn tiêu chí, hai band",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Đề mẫu mixed — đọc hai hình trong 3 phút" },
      {
        t: "p",
        text: "**Đề:** The bar chart below shows the number of journeys made on the Marlow tram network in 2010, 2017 and 2024, by type of ticket. The pie chart shows the main reason passengers gave for travelling by tram in 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      },
      {
        t: "figure",
        fig: {
          kind: "bar",
          title: "Journeys on the Marlow tram network by type of ticket (millions)",
          note: "Số liệu tự đặt cho bài luyện; Marlow là thành phố hư cấu.",
          unit: "million journeys",
          categories: ["2010", "2017", "2024"],
          series: [
            { name: "Single tickets", values: [14, 11, 6] },
            { name: "Day passes", values: [5, 6, 7] },
            { name: "Season tickets", values: [9, 13, 15] },
            { name: "Contactless pay-as-you-go", values: [0, 8, 24] },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Main reason for travelling by tram, 2024 (% of passengers surveyed)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Commuting to work", value: 41 },
            { label: "Education", value: 19 },
            { label: "Leisure & visiting friends", value: 17 },
            { label: "Shopping", value: 15 },
            { label: "Other", value: 8 },
          ],
        },
      },
      {
        t: "table",
        head: ["Việc làm trong 3 phút đầu", "Kết quả với đề này"],
        rows: [
          ["① Hai hình đo gì, đơn vị gì, thì gì?", "cột: số chuyến (triệu), 3 mốc → quá khứ · tròn: % lý do, một năm → quá khứ"],
          ["② TÍNH tổng mỗi năm (đề không cho)", "28 → 38 → 52 triệu: gần gấp đôi"],
          ["③ Nhóm tăng / nhóm giảm", "tăng: contactless (0 → 24), season (9 → 15), day pass (5 → 7) · giảm: single (14 → 6)"],
          ["④ Tỉ lệ đáng nói", "contactless 2024 = 24/52 ≈ gần một nửa · work + education = 60% = ba trên năm"],
          ["⑤ Điểm nối hai hình", "cùng năm 2024: mạng tàu điện phục vụ chủ yếu chuyến đi thường ngày"],
        ],
        caption: "Năm việc trước khi viết — việc ② và ④ là chỗ band 8 khác band 7",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — “điểm nối” không phải là suy diễn",
        items: [
          "✓ Thấy được: “In 2024, when most journeys were paid for by contactless or season ticket, three in five passengers were travelling to work or to a place of education.” — hai dữ kiện cùng năm đặt cạnh nhau.",
          "✗ Suy diễn: ~~“Contactless payment became popular **because** commuters wanted to save time.”~~ — hình không nói vì sao. Task 1 không có because của bạn.",
          "Không tìm ra điểm nối tự nhiên → overview mỗi hình một ý là đủ band 8. Đừng ép.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 189 từ",
        paras: [
          { text: "The bar chart shows how many journeys were made on the Marlow tram network with four types of ticket in 2010, 2017 and 2024, and the pie chart shows the reasons why people used the tram in 2024." },
          { text: "Overall, the total number of journeys increased over the period. Contactless payment became the most popular type of ticket, while single tickets decreased. Most people used the tram to go to work." },
          { text: "Looking at the bar chart, in 2010 there were 14 million journeys with single tickets, 9 million with season tickets and 5 million with day passes, and there was no contactless payment. In 2017, single tickets fell to 11 million, but season tickets rose to 13 million and day passes rose to 6 million, and contactless payment started at 8 million. In 2024, contactless payment increased dramatically to 24 million. Season tickets and day passes also increased to 15 million and 7 million respectively, whereas single tickets dropped to 6 million." },
          { text: "Regarding the pie chart, commuting to work was the biggest reason at 41%. Education was 19%, leisure was 17% and shopping was 15%. Other reasons were only 8%." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 221 từ",
        paras: [
          { text: "The bar chart compares the number of journeys made on the Marlow tram network in 2010, 2017 and 2024 according to the type of ticket used, while the pie chart shows why passengers were travelling in the final year." },
          { text: "Overall, tram use almost doubled over the period, an increase driven largely by contactless payment and, to a lesser extent, season tickets, whereas single tickets fell out of favour. By 2024 the network was serving mainly routine journeys, with work and education together accounting for three in five trips." },
          { text: "In 2010, single tickets were the commonest way to pay, at 14 million journeys, ahead of season tickets (9 million) and day passes (5 million). Contactless payment, which was not yet available, had reached 8 million journeys by 2017 and then tripled to 24 million, almost half of the 2024 total of 52 million. Season-ticket journeys also rose, though far less steeply, to 15 million, and day passes edged up by a million at each stage. Single tickets, by contrast, more than halved to 6 million, ending as the least used option." },
          { text: "As for the purpose of travel, 41% of the passengers surveyed in 2024 were commuting to work and a further 19% were going to school or university. Leisure trips (17%) slightly outnumbered shopping (15%), and the remaining 8% gave other reasons." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 7", "Bài band 8"],
        rows: [
          ["**TA**", "overview có, nhưng “increased” không nói tăng bao nhiêu; **“Most people… to work” sai** (41% chưa phải most); thân bài chép đủ 12 con số theo từng năm", "overview: almost doubled · driven largely by · three in five; thân bài chọn số, có số TÍNH ra (52 million, almost half, tripled, more than halved)"],
          ["**CC**", "Looking at the bar chart… / Regarding the pie chart… / In 2017… In 2024…", "đi theo NHÓM vé; nối bằng by contrast · a further 19% · the remaining 8% · ending as…"],
          ["**LR**", "increased · rose · fell · dropped · the biggest reason; **“started at 8 million”** chưa chính xác (2017 không phải năm bắt đầu)", "fell out of favour · tripled · edged up · outnumbered · accounting for"],
          ["**GRA**", "câu 43 từ nối bằng but… and… and…; đúng nhưng ngang hàng", "mệnh đề quan hệ + quá khứ hoàn thành (which was not yet available, had reached… by 2017) · phân từ (ending as…) · with + N + V-ing"],
        ],
        caption: "Vì sao hai bài cách nhau một band — cả hai đều không sai ngữ pháp",
      },
      {
        t: "note",
        title: "💡 Sáu thứ mượn được từ bài band 8",
        items: [
          "**an increase driven largely by X and, to a lesser extent, Y** — nêu hai nguyên động lực theo thứ bậc (đây là mô tả số liệu, không phải giải thích nguyên nhân).",
          "**with A and B together accounting for three in five trips** — gộp hai lát của hình tròn.",
          "**X, which was not yet available, had reached … by 2017** — xử lý con số 0 ở năm đầu.",
          "**almost half of the 2024 total of 52 million** — tự tính tổng và tỉ lệ.",
          "**edged up by a million at each stage** — một câu cho cả ba mốc của nhóm ít biến động.",
          "**a further 19% · the remaining 8%** — đọc hình tròn không lặp “X was … %”.",
        ],
      },
      { t: "rule", formula: "Overall, [xu hướng tổng] , an increase driven largely by A , whereas B … . By [năm], [hình 2: nhóm gộp] accounting for [tỉ lệ].", vi: "Overview band 8 cho mixed: hai câu, không số thô, mỗi hình một ý, có thể thêm một điểm nối thấy được." },
      {
        t: "quiz",
        id: "t5d6-viet-dien-mau",
        kind: "fill",
        title: "Gập bài mẫu band 8 lại — điền MỘT từ (7 chỗ trống)",
        items: [
          { q: "Overall, tram use almost ___ over the period…", answers: ["doubled"], hint: "28 → 52 triệu." },
          { q: "…an increase ___ largely by contactless payment…", answers: ["driven"], hint: "driven by: phân từ bị động rút gọn." },
          { q: "…whereas single tickets fell out of ___ .", answers: ["favour", "favor"], hint: "fall out of favour: không còn được chuộng." },
          { q: "…with work and education together ___ for three in five trips.", answers: ["accounting"], hint: "with + N + V-ing; account for." },
          { q: "Contactless payment… had reached 8 million journeys by 2017 and then ___ to 24 million…", answers: ["tripled", "trebled"], hint: "8 → 24: gấp ba." },
          { q: "…and day passes ___ up by a million at each stage.", answers: ["edged"], hint: "edge up: nhích lên (Bài 1 mục 3)." },
          { q: "Leisure trips (17%) slightly ___ shopping (15%)…", answers: ["outnumbered"], hint: "outnumber: đông hơn." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Đề lạ ① — hình vẽ so sánh HAI VẬT" },
      {
        t: "p",
        text: "Thỉnh thoảng Task 1 không cho biểu đồ, cũng không cho quy trình hay bản đồ, mà cho ==hình vẽ hai đồ vật có chú thích== (hai loại nhà, hai công cụ, hai thiết kế của cùng một thứ). Người chỉ luyện sáu dạng quen thường mất 5 phút hoảng. Thật ra đây là bài **so sánh tĩnh** — giống bar chart không có thời gian — chỉ khác ở chỗ dữ liệu là bộ phận và thông số.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung cho đề “hai vật”",
        steps: [
          { label: "Mở bài", sub: "The diagrams compare two designs of X, one … and one …" },
          { label: "Overview", sub: "giống ở CHỨC NĂNG / hình dáng chung · khác ở CƠ CHẾ chính · vật nào hơn ở điểm gì (2 câu, không thông số)" },
          { label: "Thân 1 — vật A", sub: "vật liệu → bộ phận → cách dùng → thông số" },
          { label: "Thân 2 — vật B, viết THEO ĐỐI CHIẾU", sub: "by contrast · unlike A · the same quantity in less than half the time · a feature absent from A" },
        ],
      },
      {
        t: "p",
        text: "**Đề:** The diagrams below show two designs of kettle used for boiling water at home. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. (Trong đề thật bạn nhận hai hình vẽ có chú thích; ở đây thông tin trên hình được chép thành bảng.)",
      },
      {
        t: "table",
        head: ["Chú thích trên hình", "Kettle A — stove-top", "Kettle B — electric"],
        rows: [
          ["Capacity", "2.5 litres", "1.7 litres"],
          ["Body", "stainless steel", "glass"],
          ["Handle", "fixed, over the top", "at the side"],
          ["Lid", "removable", "hinged; opened by a button"],
          ["Heat source", "external: gas or electric hob", "internal heating element, 2,200 W"],
          ["Base", "—", "separate base with power cord"],
          ["Time to boil 1 litre", "about 6 minutes", "about 2.5 minutes"],
          ["When the water boils", "whistle in the spout sounds", "switches off automatically"],
          ["Water-level scale", "none", "on the side"],
          ["Weight (empty)", "0.9 kg", "1.1 kg"],
        ],
        caption: "Thông tin trên hai hình vẽ của đề (hình và số liệu tự đặt cho bài luyện)",
      },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — đề hai chiếc ấm, 210 từ",
        paras: [
          { text: "The diagrams compare two designs of kettle, one heated on a stove and one powered by electricity." },
          { text: "Overall, although both are vessels of a similar shape with a handle, a lid and a spout, they differ fundamentally in where the heat comes from. The electric model is the faster and more automated of the two, albeit with a smaller capacity." },
          { text: "The stove-top kettle is a stainless-steel vessel holding 2.5 litres, with a fixed handle arching over a removable lid. Having no heat source of its own, it must be placed on a gas or electric hob, where it takes about six minutes to boil a litre of water. A whistle fitted in the spout sounds once boiling point is reached, so the user has to take the kettle off the heat by hand." },
          { text: "The electric kettle, by contrast, has a glass body with a side handle and a hinged lid released by a button. It stands on a separate corded base and contains a 2,200-watt element, which boils the same quantity of water in less than half the time. It also switches itself off automatically and has a scale showing the water level, a feature absent from the stove-top design. It is, however, slightly heavier and holds only 1.7 litres." },
        ],
      },
      {
        t: "table",
        head: ["Việc cần nói", "Câu khung", "Ghi chú"],
        rows: [
          ["cấu tạo", "X **consists of** … · X **is fitted with** / **is equipped with** … · a handle **arching over** the lid", "bị động và phân từ; không cần từ kỹ thuật ngoài hình"],
          ["giống nhau", "**Both** … · **Like A, B** … · **In both designs**, …", "đặt ở overview hoặc đầu thân 1"],
          ["khác nhau", "**Unlike A, B** … · B, **by contrast**, … · **whereas** A …, B …", "mỗi câu một trục so sánh"],
          ["hơn kém có số", "**in less than half the time** · **slightly heavier** · **holds only** 1.7 litres", "tính bội số từ thông số: 6 phút và 2,5 phút"],
          ["có / không có", "a feature **absent from** A · A **lacks** … · B **has no** …", "tránh lặp does not have"],
          ["cách dùng", "it **must be placed** on… · the user **has to**… · it **switches itself off**", "hiện tại đơn: vật vẫn đang tồn tại"],
        ],
        caption: "Ngôn ngữ cho đề “hai vật” — toàn thứ bạn đã có",
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi hay gặp ở đề “hai vật”",
        items: [
          "**Đưa ý kiến**: ~~“The electric kettle is clearly the better choice for a modern family.”~~ Task 1 không khuyên mua. Chỉ nói faster · more automated · smaller.",
          "**Suy diễn ngoài hình**: ~~“It saves energy.”~~ Hình không cho số điện năng tiêu thụ.",
          "**Tả xong A rồi tả B như hai bài riêng**: thân 2 phải có từ đối chiếu ở hầu hết các câu, nếu không là thiếu “make comparisons”.",
        ],
      },
      { t: "rule", formula: "although both …, they differ in [cơ chế]   ·   B, by contrast, …, a feature absent from A", vi: "Đề hai vật = so sánh tĩnh: overview nêu giống ở chức năng + khác ở cơ chế; thân 2 viết theo đối chiếu." },

      /* ── 5 ── */
      { t: "h", text: "5. Đề lạ ② — các GIAI ĐOẠN PHÁT TRIỂN của một vật" },
      {
        t: "p",
        text: "Dạng này cho ba, bốn hình vẽ cùng một vật ở các mốc thời gian. Nó nằm giữa **process** (có trình tự) và **map** (trước – sau). Mượn của map thì đúng hơn: bạn ==tả thay đổi==, không tả các bước làm ra sản phẩm.",
      },
      {
        t: "table",
        head: ["", "Process (Ngày 12)", "Map (Ngày 18)", "Giai đoạn phát triển (hôm nay)"],
        rows: [
          ["Tả gì", "các bước nối tiếp", "một nơi ở hai, ba mốc", "một VẬT ở ba, bốn mốc"],
          ["Thì", "hiện tại đơn, bị động", "quá khứ · hiện tại hoàn thành", "quá khứ đơn · quá khứ hoàn thành (By 1950, … had been replaced)"],
          ["Overview", "số bước · bắt đầu – kết thúc", "thay đổi lớn nhất", "HƯỚNG thay đổi chung (nhẹ hơn, nhiều chức năng hơn) + bước ngoặt lớn nhất"],
          ["Thân bài", "theo chặng", "theo khu vực hoặc theo mốc", "theo mốc; mỗi mốc: cái gì THAY, cái gì THÊM, cái gì GIỮ"],
        ],
        caption: "Đề “giai đoạn phát triển” đứng ở đâu giữa các dạng quen",
      },
      {
        t: "p",
        text: "**Đề:** The diagrams below show three stages in the development of the household iron. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      },
      {
        t: "table",
        head: ["Chú thích trên hình", "c. 1900 — flat iron", "c. 1950 — electric iron", "c. 2000 — steam iron"],
        rows: [
          ["Heating", "placed on a stove; cools during use", "internal electric element; power cord", "internal electric element; power cord"],
          ["Temperature control", "none", "dial with three settings", "dial + steam control"],
          ["Body", "solid cast iron", "metal body, steel soleplate", "plastic body; aluminium soleplate with non-stick coating and steam holes"],
          ["Handle", "iron (held with a cloth)", "plastic", "plastic, with spray and steam buttons"],
          ["Water", "—", "—", "300 ml tank"],
          ["Weight", "3 kg", "1.8 kg", "1.2 kg"],
        ],
        caption: "Thông tin trên ba hình vẽ của đề (hình và số liệu tự đặt cho bài luyện)",
      },
      {
        t: "table",
        head: ["Việc cần nói", "Câu khung band 8"],
        rows: [
          ["Overview", "Overall, the iron became **progressively lighter and easier to control**, the most significant changes being **the move from external to internal heating** and, later, **the addition of steam**."],
          ["Mốc đầu", "The earliest model, dating from around 1900, was **a solid block of cast iron** which **had to be heated on a stove** and **cooled as it was used**."],
          ["Thay thế", "By about 1950, the stove **had given way to** an electric element… · The iron handle **had been replaced by** a plastic one."],
          ["Thêm vào", "The final stage **saw the addition of** a 300 ml water tank… · **A further refinement was** a non-stick coating."],
          ["Giữ nguyên", "The basic shape of the soleplate **remained unchanged throughout**."],
          ["Số liệu", "…**whose weight had fallen to** 1.2 kg, **well under half that of** the original."],
        ],
        caption: "Sáu câu khung — mỗi câu dùng lại được cho mọi đề “giai đoạn”",
      },
      {
        t: "note",
        title: "💡 Dàn ý 3 phút cho đề bàn là",
        items: [
          "**Mở bài**: The diagrams illustrate how the household iron developed in three stages between about 1900 and 2000.",
          "**Overview**: nhẹ dần (3 → 1,2 kg) + dễ điều khiển hơn · hai bước ngoặt: tự sinh nhiệt (1950), thêm hơi nước (2000).",
          "**Thân 1**: 1900 (tả) → 1950 (thay: nguồn nhiệt, tay cầm · thêm: núm chỉnh ba mức · nhẹ đi gần một nửa).",
          "**Thân 2**: 2000 (thêm: bình nước, lỗ hơi, nút phun · thay: thân nhựa, đế nhôm chống dính · nhẹ nhất).",
          "Thì: quá khứ đơn cho từng mốc, quá khứ hoàn thành khi nhìn từ mốc sau về mốc trước.",
        ],
      },
      { t: "rule", formula: "By + mốc, A had given way to B   ·   The final stage saw the addition of C   ·   D remained unchanged throughout", vi: "Mỗi mốc trả lời ba câu: cái gì bị thay, cái gì được thêm, cái gì giữ nguyên." },
      {
        t: "quiz",
        id: "t5d6-viet-khung-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu khung của hai đề lạ (5 câu)",
        grammar: "although both…, they differ in… · by contrast · had given way to · saw the addition of · well under half that of",
        items: [
          { q: "Mặc dù cả hai đều có tay cầm và nắp, chúng khác nhau về nguồn nhiệt.", answers: ["Although both have a handle and a lid, they differ in their heat source.", "Although both have a handle and a lid, they differ in the source of heat.", "Although both have a handle and a lid, they differ in where the heat comes from."], hint: "Although both… · differ in" },
          { q: "Ngược lại, ấm điện tự tắt, một tính năng mà thiết kế kia không có.", answers: ["The electric kettle, by contrast, switches itself off, a feature absent from the other design.", "By contrast, the electric kettle switches itself off, a feature absent from the other design.", "By contrast, the electric kettle switches itself off automatically, a feature absent from the other design."], hint: "by contrast · switches itself off · a feature absent from" },
          { q: "Đến khoảng năm 1950, bếp lò đã nhường chỗ cho một bộ phận làm nóng bằng điện.", answers: ["By about 1950, the stove had given way to an electric heating element.", "By around 1950, the stove had given way to an electric heating element.", "By about 1950, the stove had given way to an electric element."], hint: "By about 1950 · had given way to" },
          { q: "Giai đoạn cuối chứng kiến việc bổ sung một bình nước.", answers: ["The final stage saw the addition of a water tank."], hint: "saw the addition of" },
          { q: "Mẫu mới nhất chỉ nặng 1,2 kg, chưa bằng một nửa mẫu đầu tiên.", answers: ["The latest model weighs only 1.2 kg, well under half that of the original.", "The latest model weighed only 1.2 kg, well under half the weight of the original.", "The latest model weighed only 1.2 kg, less than half the weight of the first."], hint: "weighed only · well under half" },
        ],
      },
      {
        t: "mcq",
        id: "t5d6-viet-chon",
        title: "Kiểm tra — Task 1 band 8 và đề lạ (7 câu)",
        items: [
          { q: "1. Overview nào đạt mức band 8 cho đề Marlow?", options: ["Overall, there were many changes in ticket types, and people travelled for different reasons.", "Overall, contactless journeys rose from 0 to 24 million and commuting was 41%.", "Overall, tram use almost doubled, driven largely by contactless payment, while single tickets declined; most 2024 trips were for work or education.", "Overall, contactless payment is the best ticket and the tram is mainly for workers."], correct: 2, why: "C: xu hướng tổng + nhóm tăng / giảm + ý của hình tròn, không số thô. A mơ hồ. B là số thô. D đưa ý kiến (the best) và sai (41% không phải mainly)." },
          { q: "2. Hình tròn: work 41%, education 19%. Cách nói nào ĐÚNG và hay nhất?", options: ["Most passengers were commuting to work.", "Work and education together accounted for three in five trips.", "The majority of passengers were students.", "Work was twice as common as all other reasons."], correct: 1, why: "41 + 19 = 60% = ba trên năm. A sai: 41% chưa phải most." },
          { q: "3. Câu nào được phép có trong Task 1?", options: ["Contactless payment grew because it is more convenient.", "The council should abolish single tickets.", "By 2024, contactless payment accounted for almost half of all journeys.", "In my opinion the tram is too expensive."], correct: 2, why: "Chỉ C là mô tả tính được từ hình (24/52). Ba câu kia là lý do, đề xuất, ý kiến." },
          { q: "4. Với đề “hai vật”, overview nên nói gì?", options: ["Vật nào bạn sẽ mua", "Toàn bộ thông số của cả hai", "Giống nhau ở chức năng, khác nhau ở cơ chế chính, vật nào hơn ở điểm gì", "Lịch sử của hai vật"], correct: 2, why: "Overview = điểm giống + điểm khác lớn nhất, không thông số, không ý kiến." },
          { q: "5. Với đề “giai đoạn phát triển”, thì nào là thì chính?", options: ["hiện tại đơn", "quá khứ đơn, thêm quá khứ hoàn thành khi nhìn ngược về mốc trước", "tương lai đơn", "hiện tại tiếp diễn"], correct: 1, why: "Các mốc đều trong quá khứ: was / had · By 1950, … had been replaced." },
          { q: "6. Câu nào dùng đúng “give way to”?", options: ["The electric element gave way the stove.", "By 1950, the stove had given way to an electric element.", "The stove was given way to by 1950.", "The stove gave way from an electric element."], correct: 1, why: "A gives way to B = A nhường chỗ cho B (cái cũ làm chủ ngữ)." },
          { q: "7. Ấm A đun 1 lít mất 6 phút, ấm B mất 2,5 phút. Câu nào chính xác?", options: ["B is twice as fast as A.", "B boils the same quantity in less than half the time.", "B is slightly faster than A.", "A is half as fast as B."], correct: 1, why: "2,5 < 3 → less than half the time. “twice as fast” sẽ là 3 phút; nhanh hơn thế nên A và D chưa chính xác, C lệch độ mạnh." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Phân giờ 20 phút và bảng tự soát band 8" },
      {
        t: "sodo",
        kind: "flow",
        title: "20 phút cho Task 1 — bản band 8",
        steps: [
          { label: "3 phút — đọc và TÍNH", sub: "đơn vị, thì, tổng, tỉ lệ, nhóm tăng / giảm; với đề lạ: 2–3 trục so sánh" },
          { label: "2 phút — viết mở bài + overview", sub: "overview viết NGAY sau mở bài; không số thô" },
          { label: "11 phút — hai thân bài", sub: "mỗi hình / mỗi vật / mỗi mốc một khổ; 170–200 từ là đủ" },
          { label: "4 phút — soát", sub: "số có khớp hình? most / majority có đúng trên 50%? thì? năm câu hỏi của Ngày 5 cho câu dài" },
        ],
      },
      {
        t: "note",
        title: "Sau khi AI chấm — năm câu hỏi của band 8",
        items: [
          "Overview có ý của **cả hai** hình (hoặc cả hai vật / mọi giai đoạn) không?",
          "Có ít nhất **hai con số tự tính** (tổng, tỉ lệ, bội số) không?",
          "Có câu nào **chép lần lượt** quá ba con số không? → gộp lại.",
          "Có từ nào **lệch độ mạnh** (soar cho 5%, most cho 41%) không?",
          "Có **ý kiến / lý do / đề xuất** nào lọt vào không? → xoá.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Viết bài — AI chấm 4 tiêu chí (mỗi bài 20 phút)" },
      {
        t: "figure",
        fig: {
          kind: "line",
          title: "Devices used to go online at home in Oakdale (% of households)",
          note: "Số liệu tự đặt cho bài luyện; Oakdale là thị trấn hư cấu.",
          unit: "% of households",
          categories: ["2012", "2016", "2020", "2024"],
          series: [
            { name: "Desktop computer", values: [68, 51, 34, 22] },
            { name: "Laptop", values: [55, 63, 66, 61] },
            { name: "Smartphone", values: [31, 70, 88, 94] },
            { name: "Smart TV", values: [4, 18, 41, 63] },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "How time online at home was spent in Oakdale, 2024 (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Video streaming", value: 38 },
            { label: "Social media", value: 22 },
            { label: "Work & study", value: 17 },
            { label: "Games", value: 12 },
            { label: "Shopping & banking", value: 6 },
            { label: "Other", value: 5 },
          ],
        },
      },
      {
        t: "essay",
        id: "t5d6-viet-mixed",
        task: "Task 1",
        prompt: "The line graph shows the percentage of households in the town of Oakdale that used four types of device to go online at home between 2012 and 2024. The pie chart shows how the time spent online at home was divided in 2024. (Desktop computer: 68 – 51 – 34 – 22; Laptop: 55 – 63 – 66 – 61; Smartphone: 31 – 70 – 88 – 94; Smart TV: 4 – 18 – 41 – 63, for 2012, 2016, 2020 and 2024. Pie chart, 2024: video streaming 38%, social media 22%, work and study 17%, games 12%, shopping and banking 6%, other 5%.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Chú ý: các đường là % hộ gia đình, cộng lại HƠN 100 (một nhà dùng nhiều thiết bị) — không cộng, không nói “share of the market”.",
          "Nhóm: giảm đều (desktop) · gần như đứng yên (laptop) · tăng mạnh (smartphone, smart TV). Điểm giao: tới 2016 smartphone đã vượt cả laptop lẫn desktop; tới 2020 smart TV đã vượt desktop.",
          "Hình tròn: gộp streaming + social media = 60%; work & study chỉ khoảng một phần sáu.",
          "Điểm nối thấy được (nếu muốn): cùng năm 2024, thiết bị phổ biến nhất và hoạt động chiếm nhiều thời gian nhất. Không viết because.",
        ],
      },
      {
        t: "essay",
        id: "t5d6-viet-giai-doan",
        task: "Task 1",
        prompt: "The diagrams show three stages in the development of the household iron. (c. 1900 — flat iron: solid cast iron; heated on a stove, cools during use; no temperature control; iron handle held with a cloth; 3 kg. c. 1950 — electric iron: internal electric element with power cord; dial with three settings; metal body with steel soleplate; plastic handle; 1.8 kg. c. 2000 — steam iron: internal electric element with power cord; dial plus steam control; plastic body, aluminium soleplate with non-stick coating and steam holes; plastic handle with spray and steam buttons; 300 ml water tank; 1.2 kg.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Dùng dàn ý 3 phút ở mục 5. Overview: hướng thay đổi chung + hai bước ngoặt.",
          "Mỗi mốc: cái gì thay · cái gì thêm · cái gì giữ.",
          "Ít nhất một câu quá khứ hoàn thành (By about 1950, … had …) và một con số tự tính (well under half).",
          "Không viết “people prefer…”, “it is more convenient…” — hình không nói.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d6-noi",
    kind: "speaking",
    title: "Nói Part 3 band 8: phản biện, nhượng bộ thật, hedging khi nói — và ngữ điệu thái độ",
    goal: "Trả lời câu hỏi Part 3 trong 45–60 giây theo bốn bước (lập trường có giới hạn → lý do + ví dụ thấy được → nhượng bộ thật → chốt lại sắc hơn), phản biện lịch sự khi giám khảo đẩy ngược, rào đón đúng liều bằng cụm của văn nói, và dùng ngữ điệu xuống – lên để nghe ra sự dè dặt.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **FC + LR + GRA Speaking 7 → 8**. Part 3 là nơi giám khảo ==chốt band==: họ hỏi khó dần tới khi bạn hết ngôn ngữ.",
          "Band 7 nêu ý kiến + lý do + “However, some people think…”. Band 8 ==đánh giá== ý ngược lại (đúng tới đâu, sai ở đâu) rồi quay về lập trường **sắc hơn lúc đầu**.",
          "**Nhượng bộ thật**: nhận một điểm đúng CỤ THỂ của phía kia (nối Tập 4 Ngày 2 “Granted… but…”).",
          "**Phản biện lịch sự**: giám khảo sẽ đẩy ngược (“But some would say…”). Đó là lời mời nói tiếp, không phải lời chê.",
          "**Hedging khi nói** khác khi viết (Ngày 1): I'd imagine · by and large · as far as I know. Rào ==dữ kiện==, không rào ==ý kiến của mình==.",
          "🔊 **Ngữ điệu thái độ**: xuống – lên (↘↗) = “đúng, nhưng…”; xuống cao (↘) = chắc chắn. Nói đúng từ mà sai giọng thì người nghe hiểu sai thái độ.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Part 3 ở band 7 và band 8 — khác nhau ở đâu" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["**FC**", "nói dài không gắng sức; discourse markers linh hoạt", "phát triển ý ==mạch lạc và đúng trọng tâm==; ngắt vì nghĩ nội dung"],
          ["**LR**", "có từ ít gặp, idiom; paraphrase hiệu quả", "dùng ==khéo==, chính xác sắc thái; rất ít chỗ chọn từ lệch"],
          ["**GRA**", "nhiều cấu trúc phức, thường không lỗi", "linh hoạt; đa số câu không lỗi — kể cả câu điều kiện, câu nhượng bộ nói nhanh"],
          ["**Nội dung** (không chấm riêng, nhưng kéo cả ba tiêu chí)", "ý kiến + lý do + ví dụ + “some people disagree”", "lập trường có giới hạn → cơ chế → nhượng bộ có đánh giá → chốt lại sắc hơn"],
        ],
        caption: "Part 3 — band 7 và band 8",
      },
      {
        t: "note",
        title: "📌 Giám khảo làm gì ở Part 3",
        items: [
          "Hỏi từ cụ thể tới trừu tượng: chuyện của bạn → xã hội → nguyên tắc.",
          "**Đẩy ngược** câu trả lời của bạn: “But isn't it true that…?” · “Some people would say the opposite.” Người band 7 đổi ý ngay hoặc lặp lại ý cũ. Người band 8 nhận phần đúng rồi giữ lập trường.",
          "Ngắt lời khi bạn nói quá dài hoặc lạc. Không sao cả — dừng, nghe câu mới.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Khung bốn bước — 45 đến 60 giây" },
      {
        t: "sodo",
        kind: "flow",
        title: "Một câu trả lời Part 3 band 8",
        steps: [
          { label: "① Lập trường có giới hạn (5 giây)", sub: "In some respects, yes — though I'd be wary of saying it across the board." },
          { label: "② Lý do + ví dụ THẤY ĐƯỢC (20 giây)", sub: "Where I think it's true is… · In my neighbourhood, hardly any child…" },
          { label: "③ Nhượng bộ thật (15 giây)", sub: "Now, I take the point that… and I wouldn't dismiss that. But…" },
          { label: "④ Chốt lại sắc hơn (10 giây)", sub: "So it's less a question of how much… than of where…" },
        ],
      },
      {
        t: "table",
        head: ["Bước", "Band 7 hay làm", "Band 8 làm"],
        rows: [
          ["①", "Yes, I think so. / It depends.", "nói ngay ĐÚNG Ở ĐÂU và KHÔNG ĐÚNG Ở ĐÂU"],
          ["②", "ví dụ chung chung: “for example, many parents…”", "một chi tiết nhìn thấy được: nơi chốn, độ tuổi, con số ước chừng"],
          ["③", "“However, some people think X.” rồi bỏ đó", "nói X đúng tới đâu, rồi vì sao vẫn chưa đủ để đổi ý"],
          ["④", "lặp lại câu ①: “So I think yes.”", "một phân biệt mới: less A than B · not whether but how"],
        ],
        caption: "Cùng bốn bước — hai cách đi",
      },
      { t: "rule", formula: "In some respects, yes — though …   →   Where it's true is …   →   I take the point that …, but …   →   So it's less a question of A than of B.", vi: "Bốn bước: lập trường có giới hạn → ví dụ thấy được → nhượng bộ có đánh giá → chốt bằng một phân biệt mới." },

      /* ── 3 ── */
      { t: "h", text: "3. Nhượng bộ thật — ba bậc" },
      {
        t: "patterns",
        rows: [
          {
            formula: "There's something in that. / That's a fair point. + But …",
            vi: "Bậc 1 — nhận nhẹ: ý kia có lý một phần",
            examples: [
              { en: "There's something in that — a degree does open doors. But it doesn't follow that everyone needs one.", vi: "Điều đó có phần đúng — tấm bằng quả có mở ra cơ hội. Nhưng không thể vì thế mà nói ai cũng cần." },
            ],
          },
          {
            formula: "I take the point that + S + V, and I wouldn't dismiss that. Even so, …",
            vi: "Bậc 2 — nhận rõ: nhắc lại điểm đúng CỤ THỂ của phía kia",
            examples: [
              { en: "I take the point that traffic's heavier than it used to be, and I wouldn't dismiss that. Even so, the risk is smaller than people assume.", vi: "Tôi đồng ý là xe cộ đông hơn trước, và tôi không gạt điều đó đi. Dù vậy, rủi ro nhỏ hơn người ta tưởng." },
            ],
          },
          {
            formula: "If + S + were / did …, I'd agree. As it is, …",
            vi: "Bậc 3 — nhận có điều kiện: ý kia đúng trong một hoàn cảnh khác",
            examples: [
              { en: "If public transport were reliable here, I'd agree that cars should be banned from the centre. As it is, people have no alternative.", vi: "Nếu giao thông công cộng ở đây đáng tin, tôi sẽ đồng ý cấm xe hơi vào trung tâm. Còn như hiện nay, người ta không có lựa chọn nào khác." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Nhượng bộ giả — ba kiểu giám khảo nghe ra ngay",
        items: [
          "**Nhắc rồi bỏ**: “However, some people disagree. Anyway, I think…” — không nói họ đúng ở đâu.",
          "**Người rơm**: “Some people think children should never go outside.” — không ai nghĩ vậy; bác một ý không ai nêu thì không phải phản biện.",
          "**Nhượng hết**: “Yes, you're right, maybe I was wrong.” — giám khảo đẩy ngược để nghe bạn lập luận, không phải để bạn đầu hàng.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Phản biện lịch sự — khi giám khảo đẩy ngược" },
      {
        t: "table",
        head: ["Việc", "Cụm band 8", "Tránh"],
        rows: [
          ["Không đồng ý hẳn", "I'm not sure I'd go that far. · I'd put it slightly differently.", "No, that's wrong. · I totally disagree."],
          ["Nghi ngờ một giả định", "That assumes that…, and I'm not convinced it does. · I'd question whether…", "That's not true."],
          ["Tách trường hợp", "It depends what we mean by… · That may hold for X, but less so for Y.", "It depends. (rồi dừng)"],
          ["Đảo lại câu hỏi", "I'd actually turn that round: it's not that A causes B, it's that B…", "—"],
          ["Giữ lập trường", "I can see why people say that, but I'd still maintain that…", "As I said before…"],
        ],
        caption: "Năm việc khi bị đẩy ngược — và cụm để làm",
      },
      {
        t: "dialogue",
        title: "Giám khảo đẩy ngược — cách đáp band 8",
        lines: [
          { who: "Examiner", role: "examiner", text: "You said people should be free to take risks. But isn't it true that society pays when they get hurt?", vi: "Bạn nói người ta nên được tự do mạo hiểm. Nhưng chẳng phải xã hội phải trả giá khi họ bị thương sao?" },
          { who: "Candidate", role: "candidate", text: "That's a fair point, and for something like riding without a helmet I'd accept it — the hospital bill isn't only yours. But I'd question whether it applies across the board. If we banned everything that might cost the health service money, we'd have to start with sitting on the sofa. So I'd still say the default should be freedom, with rules only where the cost to others is direct and large.", vi: "Ý đó xác đáng, và với những việc như đi xe không đội mũ bảo hiểm thì tôi chấp nhận — hoá đơn viện phí không chỉ của riêng bạn. Nhưng tôi ngờ rằng nó không áp dụng cho mọi trường hợp. Nếu cấm mọi thứ có thể làm tốn tiền của ngành y, ta phải bắt đầu từ việc ngồi sofa. Nên tôi vẫn cho rằng mặc định phải là tự do, chỉ đặt luật ở chỗ cái giá người khác phải chịu là trực tiếp và lớn." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Hedging khi nói — rào dữ kiện, không rào ý kiến" },
      {
        t: "table",
        head: ["Rào cái gì", "Viết (Ngày 1 mục 5)", "Nói"],
        rows: [
          ["một xu hướng chung", "tend to · generally", "by and large · on the whole · more often than not"],
          ["một dữ kiện mình không chắc", "It is estimated that… · reportedly", "as far as I know · from what I've read · I may be wrong, but"],
          ["một phỏng đoán", "It is likely that… · may well", "I'd imagine · I suspect · my guess is"],
          ["một nhận định về nhóm người", "many · a majority of", "a fair number of · most people I know"],
          ["mức đồng ý", "to some extent", "up to a point · in some respects"],
        ],
        caption: "Cùng năm việc rào đón — cụm của văn viết và cụm của văn nói",
      },
      {
        t: "examples",
        items: [
          { en: "~~Maybe I think perhaps it could possibly be a good idea, kind of.~~", vi: "Rào bốn lần cho một ý kiến của chính mình: nghe như không có ý kiến." },
          { en: "I think it's a good idea. Whether it would work here, I'm less sure — as far as I know, it's only been tried in much smaller cities.", vi: "Ý kiến: nói thẳng. Dữ kiện mình không chắc: rào một lần, nói rõ vì sao không chắc." },
        ],
      },
      { t: "rule", formula: "Ý kiến của mình: I think / I'd say + nói thẳng   ·   Dữ kiện: as far as I know / I'd imagine + một lần", vi: "Người band 8 nghe dứt khoát về điều mình nghĩ và thận trọng về điều mình không biết chắc." },
      {
        t: "quiz",
        id: "t5d6-noi-khung-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — cụm nhượng bộ, phản biện, rào đón (6 câu)",
        grammar: "I take the point that… · I'm not sure I'd go that far · That assumes that… · by and large · as far as I know · less a question of A than of B",
        items: [
          { q: "Tôi đồng ý là chi phí rất cao, nhưng tôi không nghĩ đó là vấn đề chính.", answers: ["I take the point that the cost is very high, but I don't think that's the main issue.", "I take the point that the cost is very high, but I don't think that's the main problem.", "I take the point that it's very expensive, but I don't think that's the main issue."], hint: "I take the point that · the main issue" },
          { q: "Tôi không chắc là mình sẽ nói tới mức đó.", answers: ["I'm not sure I'd go that far.", "I am not sure I would go that far.", "I'm not sure I'd go quite that far."], hint: "go that far" },
          { q: "Điều đó giả định rằng mọi người đều có lựa chọn, và tôi không tin là như vậy.", answers: ["That assumes that everyone has a choice, and I'm not convinced they do.", "That assumes that everyone has a choice, and I'm not convinced that they do.", "That assumes everyone has a choice, and I'm not convinced they do."], hint: "That assumes that · I'm not convinced" },
          { q: "Nhìn chung, người trẻ ở nước tôi cẩn thận hơn thế hệ trước.", answers: ["By and large, young people in my country are more careful than the previous generation.", "By and large, young people in my country are more cautious than the previous generation.", "On the whole, young people in my country are more cautious than the previous generation."], hint: "By and large · more cautious / careful" },
          { q: "Theo như tôi biết, luật đó chưa bao giờ được thực thi.", answers: ["As far as I know, that law has never been enforced.", "As far as I know, the law has never been enforced."], hint: "As far as I know · has never been enforced" },
          { q: "Vấn đề không hẳn là bao nhiêu tiền mà là tiền được tiêu vào đâu.", answers: ["It's less a question of how much money than of where it's spent.", "It's less a question of how much money than of where it is spent.", "It is less a question of how much money than of where the money is spent."], hint: "less a question of A than of B" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Band 7 và band 8 đặt cạnh nhau — cùng một câu hỏi" },
      { t: "p", text: "Câu hỏi: **Would you say parents nowadays protect their children too much?** (Bạn đã gặp ý này ở Tập 4 Ngày 22 — hôm nay nâng câu trả lời lên band 8.) Đọc bản band 7, tự tìm bốn bước của mục 2 trong đó, rồi đọc bản band 8." },
      {
        t: "dialogue",
        title: "Bản band 7 (ước tính) — khoảng 40 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Would you say parents nowadays protect their children too much?", vi: "Bạn có cho rằng cha mẹ ngày nay bảo bọc con quá mức không?" },
          { who: "Candidate", role: "candidate", text: "Yes, I think so. Nowadays parents worry a lot about their children. For example, in my city most parents drive their kids to school even if it's very near, because they think the roads are dangerous. When I was young, I walked to school alone. I think this is not good for children because they can't learn to be independent. However, some people say the world is more dangerous now, so parents have to do that. But in my opinion children should have more freedom.", vi: "Có, tôi nghĩ vậy. Ngày nay cha mẹ lo cho con rất nhiều. Ví dụ, ở thành phố tôi phần lớn cha mẹ chở con đi học dù rất gần, vì họ nghĩ đường sá nguy hiểm. Hồi nhỏ tôi tự đi bộ đến trường. Tôi nghĩ điều này không tốt cho trẻ vì chúng không học được tính tự lập. Tuy nhiên, có người nói thế giới giờ nguy hiểm hơn nên cha mẹ phải làm vậy. Nhưng theo tôi trẻ em nên có nhiều tự do hơn." },
        ],
      },
      {
        t: "dialogue",
        title: "Bản band 8 (ước tính) — khoảng 55 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Would you say parents nowadays protect their children too much?", vi: "Bạn có cho rằng cha mẹ ngày nay bảo bọc con quá mức không?" },
          { who: "Candidate", role: "candidate", text: "In some respects, yes — though I'd be wary of saying it across the board. Where I think it's true is physical independence: in my neighbourhood, hardly any child under twelve walks to school alone any more, whereas for my generation that was just what you did. Now, I take the point that traffic's heavier than it was, and I wouldn't dismiss that. But the danger parents seem to fear most, strangers, is — as far as I know — no greater than it used to be; it's just far more visible. So I'd say children are overprotected from the unlikely dangers and, if anything, underprotected from the likely ones, like spending the whole evening online with nobody checking. It's less a question of how much protection than of where it's aimed.", vi: "Ở một số mặt thì có — dù tôi sẽ dè dặt khi nói thế cho mọi trường hợp. Chỗ tôi thấy đúng là sự tự lập về đi lại: ở khu tôi, hầu như không còn đứa trẻ dưới mười hai tuổi nào tự đi bộ đến trường, trong khi với thế hệ tôi đó là chuyện đương nhiên. Tôi đồng ý là xe cộ đông hơn trước, và tôi không gạt điều đó đi. Nhưng mối nguy cha mẹ có vẻ sợ nhất, người lạ, thì — theo như tôi biết — không lớn hơn trước; chỉ là nó được nhìn thấy nhiều hơn hẳn. Nên tôi cho rằng trẻ được bảo bọc quá mức trước những mối nguy khó xảy ra và, nếu có gì đáng nói, lại thiếu bảo vệ trước những mối nguy dễ xảy ra, như ngồi trên mạng cả tối mà không ai để mắt. Vấn đề không hẳn là bảo vệ bao nhiêu mà là bảo vệ nhắm vào đâu." },
        ],
      },
      {
        t: "table",
        head: ["Bước", "Bản band 7", "Bản band 8"],
        rows: [
          ["① Lập trường", "Yes, I think so.", "In some respects, yes — though I'd be wary of saying it across the board."],
          ["② Ví dụ", "most parents drive their kids to school", "hardly any child under twelve walks to school alone any more, whereas for my generation…"],
          ["③ Nhượng bộ", "However, some people say the world is more dangerous now… (rồi bỏ)", "I take the point that traffic's heavier… But the danger parents fear most… is — as far as I know — no greater…"],
          ["④ Chốt", "children should have more freedom (lặp ①)", "overprotected from the unlikely dangers… underprotected from the likely ones · less a question of how much than of where"],
          ["Hedging", "không có", "as far as I know · seem to · if anything — rào dữ kiện, không rào ý kiến"],
          ["Lỗi", "this is not good (nên: I don't think this is good) · kids (được, văn nói)", "không"],
        ],
        caption: "Cùng một quan điểm — band 8 không “đồng ý hơn”, chỉ ==phân biệt kỹ hơn==",
      },
      {
        t: "mcq",
        id: "t5d6-noi-chon",
        title: "Kiểm tra — Part 3 band 8 (7 câu)",
        items: [
          { q: "1. Câu mở nào là “lập trường có giới hạn”?", options: ["Yes, definitely.", "It depends.", "Up to a point, yes — mainly where money is concerned.", "That's a difficult question."], correct: 2, why: "C nói ngay đúng tới đâu (up to a point) và ở chỗ nào (where money is concerned). B chưa nói phụ thuộc vào gì." },
          { q: "2. Câu nào là nhượng bộ THẬT?", options: ["However, some people disagree.", "I take the point that fees put poorer students off, and that does worry me. Even so, free tuition mostly benefits the better-off.", "Some people think universities should be closed.", "Maybe you're right, I'm not sure any more."], correct: 1, why: "B nhắc điểm đúng cụ thể của phía kia, rồi nói vì sao vẫn giữ lập trường. A nhắc rồi bỏ; C người rơm; D nhượng hết." },
          { q: "3. Giám khảo: “But surely technology has made people lazier?” Câu đáp band 8:", options: ["No, I totally disagree with you.", "Yes, you're right.", "I'm not sure I'd go that far. It's made some tasks effortless, certainly, but people fill the time they save with other work.", "As I said before, technology is good."], correct: 2, why: "Phản biện lịch sự + nhận phần đúng (certainly) + lý do." },
          { q: "4. Câu nào rào đón ĐÚNG chỗ?", options: ["Maybe I kind of think it's possibly wrong.", "I think it's wrong. As far as I know, though, no country has actually banned it.", "It is perhaps arguably the case that I disagree.", "I might believe that it could be wrong, sort of."], correct: 1, why: "Ý kiến nói thẳng; dữ kiện không chắc thì rào một lần." },
          { q: "5. “That assumes that everyone can afford it.” Người nói đang:", options: ["đồng ý hoàn toàn", "chỉ ra một giả định ngầm của ý kia", "đổi chủ đề", "xin giám khảo nhắc lại"], correct: 1, why: "That assumes that…: nêu giả định ngầm để nghi ngờ nó." },
          { q: "6. Cụm nào thuộc văn NÓI (không dùng trong Task 2)?", options: ["It is widely believed that", "by and large", "to a considerable extent", "It could be argued that"], correct: 1, why: "by and large là cụm nói / bán trang trọng; ba cụm kia là văn viết học thuật." },
          { q: "7. Câu chốt nào đưa ra “một phân biệt mới”?", options: ["So, yes, I agree.", "That's all I can think of.", "So it's not whether we use phones in class but what we use them for.", "So phones are good and bad."], correct: 2, why: "not whether… but what…: chuyển câu hỏi sang một trục chính xác hơn." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. 🔊 Phát âm: ngữ điệu thái độ — cùng một câu, hai nghĩa" },
      {
        t: "p",
        text: "Tập 3 Ngày 24 và Tập 4 Ngày 20 đã dạy ngữ điệu lên / xuống cho câu hỏi, liệt kê, đối lập. Ở band 8 bạn cần thêm một nét: ==xuống – lên (fall-rise ↘↗)== trên từ chính. Người bản ngữ nghe nét này là hiểu “còn nữa, có chữ nhưng đằng sau”. Nói “It's a good idea” bằng giọng xuống thẳng = tán thành. Nói đúng năm từ đó với giọng xuống – lên trên good = “ý hay đấy… nhưng tôi chưa tin”.",
      },
      {
        t: "table",
        head: ["Nét giọng", "Nghe ra", "Dùng khi", "Ví dụ (từ in HOA mang nét giọng)"],
        rows: [
          ["**xuống – lên ↘↗**", "dè dặt, đồng ý một phần, sắp có “but”", "nhượng bộ · rào đón · phản biện lịch sự", "Well, it de↘↗PENDS. · That's true to SOME ↘↗extent."],
          ["**xuống cao ↘**", "chắc chắn, dứt khoát", "nêu lập trường · câu chốt", "↘ABsolutely. · I'd STILL say ↘NO."],
          ["**lên thấp ↗**", "chưa xong, đang cân nhắc; hoặc hỏi lại lịch sự", "liệt kê · “Really?”", "↗REALly? I'd have thought the ↘OPposite."],
          ["**phẳng →**", "chán, không quan tâm", "KHÔNG dùng", "người Việt hay rơi vào nét này khi tập trung tìm từ"],
        ],
        caption: "Bốn nét giọng và thái độ người nghe suy ra",
      },
      {
        t: "phatam",
        id: "t5d6-phat-am",
        title: "Luyện phát âm — ngữ điệu thái độ: xuống – lên cho dè dặt, xuống cao cho chắc chắn",
        note: "Máy chấm từng âm; nét giọng bạn tự nghe lại bản ghi. Câu 1–6 và nửa đầu câu 8: xuống – lên trên từ ghi trong ngoặc. Câu 7: xuống cao, dứt khoát.",
        items: [
          { text: "Well, it depends.", ipa: "wel ɪt dɪpendz", vi: "À, còn tuỳ. (↘↗ trên dePENDS — người nghe chờ bạn nói tiếp)" },
          { text: "I take your point, but I'm not convinced.", ipa: "aɪ teɪk jɔː pɔɪnt bət aɪm nɒt kənvɪnst", vi: "Tôi hiểu ý bạn, nhưng tôi chưa bị thuyết phục. (↘↗ trên POINT · ↘ trên conVINCED)" },
          { text: "That's true to some extent.", ipa: "ðæts truː tə sʌm ɪkstent", vi: "Điều đó đúng ở một mức nào đó. (↘↗ trên SOME)" },
          { text: "I wouldn't go quite that far.", ipa: "aɪ wʊdnt ɡəʊ kwaɪt ðæt fɑː", vi: "Tôi sẽ không nói tới mức đó. (↘↗ trên THAT)" },
          { text: "Really? I'd have thought the opposite.", ipa: "rɪəli aɪd əv θɔːt ði ɒpəzɪt", vi: "Thật à? Tôi lại nghĩ ngược lại. (↗ trên REALly · ↘ trên OPposite)" },
          { text: "It's not impossible, I suppose.", ipa: "ɪts nɒt ɪmpɒsəbl aɪ səpəʊz", vi: "Tôi cho là cũng không phải không thể. (↘↗ trên imPOSsible)" },
          { text: "Absolutely. No question about it.", ipa: "æbsəluːtli nəʊ kwestʃən əbaʊt ɪt", vi: "Hoàn toàn đúng. Không có gì phải bàn. (↘ cao trên ABsolutely và QUEStion)" },
          { text: "It may work in theory, but in practice it rarely does.", ipa: "ɪt meɪ wɜːk ɪn θɪəri bət ɪn præktɪs ɪt reəli dʌz", vi: "Trên lý thuyết có thể được, nhưng thực tế hiếm khi được. (↘↗ trên THEory · ↘ trên PRACtice và DOES)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d6-noi-ngu-dieu",
        title: "Ngữ điệu thái độ — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. Giám khảo nêu một ý. Bạn nói “That's an interesting idea” với giọng xuống – lên trên INTeresting. Người nghe hiểu:", options: ["bạn rất tán thành", "bạn sắp nêu một dè dặt", "bạn không nghe rõ", "bạn muốn kết thúc"], correct: 1, why: "↘↗ = “đúng, nhưng…”. Muốn tán thành thật thì xuống thẳng." },
          { q: "2. Câu chốt “So I'd still say no.” nên nói với nét giọng nào trên no?", options: ["lên ↗", "xuống – lên ↘↗", "xuống cao ↘", "phẳng →"], correct: 2, why: "Câu chốt lập trường: xuống cao, dứt khoát." },
          { q: "3. Trong “It may work in THEory, but in PRACtice it rarely does”, nét xuống – lên đặt ở:", options: ["THEory", "PRACtice", "does", "rarely"], correct: 0, why: "Vế nhượng bộ (in theory) mang ↘↗, báo trước vế but; vế chính xuống." },
          { q: "4. Nói cả câu trả lời bằng giọng phẳng khiến giám khảo nghĩ:", options: ["bạn rất tự tin", "bạn đang đọc thuộc hoặc không quan tâm", "bạn đang nhượng bộ", "bạn nói giọng Anh chuẩn"], correct: 1, why: "Giọng phẳng nghe như đọc thuộc — ảnh hưởng cả tiêu chí Pronunciation lẫn ấn tượng về Fluency." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện hôm nay",
        items: [
          "Mỗi câu **45–60 giây**. Trước khi bấm ghi, nói nhỏ bước ① thành tiếng — có lập trường có giới hạn rồi thì ba bước sau tự ra.",
          "Lượt 1: trả lời bình thường. Lượt 2: tự đóng vai giám khảo, nói “But some people would say the opposite” rồi đáp lại chính mình trong 20 giây.",
          "Nghe lại: có ít nhất **một** nhượng bộ thật, **một** cụm rào dữ kiện, **một** chỗ xuống – lên không? Thiếu thứ nào thì ghi lại câu đó.",
        ],
      },
      {
        t: "speak",
        id: "t5d6-noi-p3-rui-ro",
        part: "3",
        questions: [
          "Do you think people today are more cautious than previous generations were?",
          "Should adults be free to do dangerous sports even if they might be seriously injured?",
          "Why do some people enjoy taking risks while others avoid them?",
          "Some people say that children learn more from failing than from succeeding. What do you think?",
          "Is it the government's job to protect people from their own bad decisions?",
        ],
      },
      {
        t: "speak",
        id: "t5d6-noi-p3-chuyen-gia",
        part: "3",
        questions: [
          "In your country, do people generally trust the advice of experts?",
          "Why might ordinary people sometimes be right when experts are wrong?",
          "Should important decisions be made by specialists or by the public as a whole?",
          "Has the internet made it easier or harder to know whose advice to follow?",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 6 ═══════════════════════════ */
  {
    id: "t5d6-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 6 — độ mạnh · thái độ · văn phong · động từ tường thuật · paraphrase · Task 1 đề lạ · nhượng bộ và ngữ điệu",
    goal: "Ôn trọn Ngày 6: chọn đúng từ theo bốn trục sắc thái, paraphrase không lệch nghĩa, dùng đúng câu khung của Task 1 mixed và hai đề lạ, nhận ra nhượng bộ thật và nét giọng xuống – lên; viết một bài “hai vật” và nói một lượt Part 3.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay",
        items: [
          "**43 câu** có đáp án + 1 bài Task 1 + 1 lượt Part 3 (AI chấm).",
          "Phần I–IV ôn Bài 1 · Phần V–VI ôn Bài 2 · Phần VII–VIII ôn Bài 3.",
          "Làm xong, nghỉ 15 phút rồi sang **Kiểm tra chặng (Ngày 1–6)** — bài cuối của ngày.",
        ],
      },

      { t: "h", text: "I. Độ mạnh (6 câu) — ôn Bài 1 mục 3" },
      {
        t: "quiz",
        id: "t5d6-bt-do-manh",
        kind: "fill",
        title: "I. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "The side effects were n___ : fewer than one patient in a thousand reported any. (nhỏ tới mức bỏ qua được)", answers: ["negligible"], hint: "negligible." },
          { q: "A s___ minority — around 40% — voted against the plan. (khá lớn)", answers: ["sizeable", "sizable"], hint: "a sizeable minority." },
          { q: "The difference in pay is most p___ in the finance sector. (rõ rệt)", answers: ["pronounced"], hint: "most pronounced." },
          { q: "Profits s___ by 60% when the factory burned down. (sụt mạnh — quá khứ)", answers: ["slumped"], hint: "slump by 60%." },
          { q: "Energy bills have s___ to a record high this winter. (tăng vọt — V3)", answers: ["soared"], hint: "soar to a record high." },
          { q: "Change in the school system has been i___ : a little each year. (từng nấc)", answers: ["incremental"], hint: "incremental change." },
        ],
      },

      { t: "h", text: "II. Thái độ (6 câu) — ôn Bài 1 mục 4" },
      {
        t: "mcq",
        id: "t5d6-bt-thai-do",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. Người viết KHEN một chính trị gia không đổi ý trước áp lực. Từ đúng:", options: ["obstinate", "resolute", "cunning", "nosy"], correct: 1, why: "resolute: kiên quyết (khen)." },
          { q: "2. The prison is ___ for overcrowding.", options: ["renowned", "celebrated", "notorious", "shrewd"], correct: 2, why: "Điều xấu → notorious for." },
          { q: "3. “Her inquisitive nature made her an excellent researcher.” Thái độ của người viết:", options: ["chê", "khen", "trung tính", "mỉa mai"], correct: 1, why: "inquisitive là khen; câu sau (excellent researcher) xác nhận." },
          { q: "4. Từ nào KHÔNG cùng thái độ với ba từ còn lại?", options: ["thrifty", "shrewd", "resolute", "stingy"], correct: 3, why: "stingy là chê; ba từ kia là khen." },
          { q: "5. A ___ negotiator, she got the price down by a third without upsetting anyone.", options: ["cunning", "shrewd", "nosy", "notorious"], correct: 1, why: "without upsetting anyone → khen → shrewd." },
          { q: "6. Bài đọc viết “the company's notoriously slow complaints procedure”. Câu “The writer thinks the procedure works well” là:", options: ["YES", "NO", "NOT GIVEN", "không xác định được"], correct: 1, why: "notoriously slow = khét tiếng chậm → người viết chê → NO." },
        ],
      },

      { t: "h", text: "III. Văn phong và động từ tường thuật (7 câu) — ôn Bài 1 mục 5–6" },
      {
        t: "quiz",
        id: "t5d6-bt-van-phong",
        kind: "fill",
        title: "III. Điền MỘT từ ở dạng đúng (chữ đầu cho sẵn)",
        items: [
          { q: "Charities work to a___ poverty in the region. (làm dịu)", answers: ["alleviate"], hint: "alleviate poverty." },
          { q: "The school was d___ to be failing and was closed. (bị cho là)", answers: ["deemed"], hint: "be deemed to be." },
          { q: "It took months to a___ the cause of the fire. (xác định)", answers: ["ascertain"], hint: "ascertain the cause." },
          { q: "The findings w___ a closer look at how the data were collected. (đáng để)", answers: ["warrant"], hint: "chủ ngữ số nhiều → warrant." },
          { q: "Opponents c___ that the scheme wastes public money. (cho rằng)", answers: ["contend"], hint: "contend that." },
          { q: "The report a___ that officials ignored repeated warnings, though no proof has been published. (cáo buộc)", answers: ["alleges", "alleged"], hint: "allege: chưa có bằng chứng." },
          { q: "The firm tried to d___ the scale of the data leak. (nói giảm)", answers: ["downplay"], hint: "downplay the scale." },
        ],
      },

      { t: "h", text: "IV. Paraphrase — viết lại câu (5 câu) — ôn Bài 1 mục 7" },
      {
        t: "quiz",
        id: "t5d6-bt-paraphrase",
        kind: "translate",
        title: "IV. Viết lại bằng từ mở đầu cho sẵn, giữ nguyên nghĩa",
        grammar: "đảo nguyên nhân – kết quả · danh hoá · Without · bị động + to V · đảo chiều so sánh",
        items: [
          { q: "Bắt đầu bằng “There was…”: Tourist numbers dropped dramatically in 2020.", answers: ["There was a dramatic drop in tourist numbers in 2020.", "There was a dramatic fall in tourist numbers in 2020."], hint: "a dramatic drop in" },
          { q: "Bắt đầu bằng “Most of the delays…”: Staff shortages caused most of the delays.", answers: ["Most of the delays were attributable to staff shortages.", "Most of the delays stemmed from staff shortages.", "Most of the delays were caused by staff shortages.", "Most of the delays were due to staff shortages."], hint: "were attributable to / stemmed from" },
          { q: "Bắt đầu bằng “Without…”: If people do not have access to clean water, disease spreads quickly.", answers: ["Without access to clean water, disease spreads quickly.", "Without clean water, disease spreads quickly."], hint: "Without access to" },
          { q: "Bắt đầu bằng “Sugar is…”: Many scientists believe that sugar is addictive.", answers: ["Sugar is widely believed to be addictive.", "Sugar is believed by many scientists to be addictive.", "Sugar is thought by many scientists to be addictive."], hint: "is widely believed to be" },
          { q: "Bắt đầu bằng “Cycling…”: Driving in the city centre is slower than cycling.", answers: ["Cycling in the city centre is faster than driving.", "Cycling is faster than driving in the city centre.", "Cycling in the city centre is quicker than driving."], hint: "đảo chiều so sánh" },
        ],
      },

      { t: "h", text: "V. Task 1 mixed — số liệu và overview (6 câu) — ôn Bài 2 mục 2–3" },
      {
        t: "table",
        head: ["Greenfield Leisure Centre — visits (thousands)", "2015", "2020", "2025"],
        rows: [
          ["Swimming pool", "60", "55", "50"],
          ["Gym", "30", "45", "90"],
          ["Sports hall", "25", "24", "26"],
          ["Climbing wall", "0", "6", "14"],
          ["**Total**", "115", "130", "180"],
        ],
        caption: "Số liệu tự đặt cho bài luyện. Hình thứ hai của đề (không in ở đây): tuổi người dùng năm 2025 — under 18: 22% · 18–34: 46% · 35–54: 21% · 55+: 11%",
      },
      {
        t: "mcq",
        id: "t5d6-bt-task1",
        title: "V. Chọn phương án đúng",
        items: [
          { q: "1. Gym visits, 2020 → 2025:", options: ["edged up", "doubled", "tripled", "more than halved"], correct: 1, why: "45 → 90: gấp đôi." },
          { q: "2. Sports hall, cả giai đoạn:", options: ["soared", "slumped", "remained broadly stable", "rose incrementally to a record high"], correct: 2, why: "25 – 24 – 26: gần như đứng yên." },
          { q: "3. Gym năm 2025 chiếm bao nhiêu tổng lượt tới?", options: ["a quarter", "a third", "exactly half", "three quarters"], correct: 2, why: "90 / 180 = 50%." },
          { q: "4. Câu nào xử lý đúng số 0 của climbing wall?", options: ["The climbing wall increased from 0 to 14.", "The climbing wall, which had not yet opened in 2015, attracted 14,000 visits by 2025.", "Nobody liked the climbing wall in 2015.", "The climbing wall started at 6 in 2020."], correct: 1, why: "which had not yet opened…: mệnh đề quan hệ + quá khứ hoàn thành. D sai: 2020 không chắc là năm bắt đầu." },
          { q: "5. Người dùng 18–34 tuổi chiếm 46%. Cách nói đúng:", options: ["the majority of users", "most users", "almost half of users", "a negligible share of users"], correct: 2, why: "46% < 50% → không phải majority / most." },
          { q: "6. Overview band 8:", options: ["Overall, visits rose from 115,000 to 180,000 and the gym was 90,000.", "Overall, total visits grew by more than half, driven mainly by the gym, while the pool slowly lost users; in 2025 nearly half of all users were young adults.", "Overall, the gym is the most popular because young people like exercise.", "Overall, there were some increases and some decreases."], correct: 1, why: "B: xu hướng tổng (115 → 180 ≈ +57%) + động lực + nhóm giảm + ý của hình hai, không số thô. C suy diễn nguyên nhân." },
        ],
      },

      { t: "h", text: "VI. Hai đề lạ — câu khung (5 câu) — ôn Bài 2 mục 4–5" },
      {
        t: "quiz",
        id: "t5d6-bt-de-la",
        kind: "fill",
        title: "VI. Điền MỘT từ",
        items: [
          { q: "Although ___ tents sleep four people, they differ in how they are put up.", answers: ["both"], hint: "Although both…" },
          { q: "The newer tent, by ___ , can be put up by one person in two minutes.", answers: ["contrast"], hint: "by contrast." },
          { q: "It has a built-in groundsheet, a feature ___ from the older design.", answers: ["absent", "missing"], hint: "a feature absent from." },
          { q: "By about 1980, wooden poles had given ___ to aluminium ones.", answers: ["way"], hint: "give way to." },
          { q: "The final stage saw the ___ of a second door at the rear. (danh từ của add)", answers: ["addition"], hint: "saw the addition of." },
        ],
      },

      { t: "h", text: "VII. Nhượng bộ, phản biện, hedging (6 câu) — ôn Bài 3 mục 2–5" },
      {
        t: "mcq",
        id: "t5d6-bt-noi",
        title: "VII. Chọn phương án đúng",
        items: [
          { q: "1. Điền: “I take the ___ that it's expensive, but so is doing nothing.”", options: ["idea", "point", "opinion", "mind"], correct: 1, why: "take the point that…" },
          { q: "2. Điền: “By and ___ , people here are fairly cautious with money.”", options: ["big", "wide", "large", "far"], correct: 2, why: "by and large: nhìn chung." },
          { q: "3. Câu nào là “người rơm”?", options: ["I take the point that cars pollute.", "Some people think nobody should ever be allowed to drive.", "There's something in that.", "If buses were reliable, I'd agree."], correct: 1, why: "Bịa ra một ý cực đoan không ai nêu để bác." },
          { q: "4. Chọn câu chốt band 8 cho câu hỏi “Should schools teach cooking?”", options: ["So yes, schools should teach cooking.", "So I'd say it's less about cooking as such than about knowing what's in your food.", "So that's my opinion.", "So cooking is important and schools are important."], correct: 1, why: "less about A than about B: một phân biệt mới." },
          { q: "5. “If rents were lower, I'd agree. As it is, …” Cụm As it is nghĩa là:", options: ["như đã nói", "còn trong thực tế hiện nay", "vì thế", "giống như vậy"], correct: 1, why: "As it is = trong tình hình thật hiện nay (ngược với giả định vừa nêu)." },
          { q: "6. Câu nào rào quá liều?", options: ["I'd imagine most people would agree.", "As far as I know, it's never been tried.", "I think perhaps it might possibly be sort of true, maybe.", "By and large, it works."], correct: 2, why: "Năm lần rào cho một ý: mất luôn lập trường." },
        ],
      },

      { t: "h", text: "VIII. Ngữ điệu thái độ (2 câu) — ôn Bài 3 mục 7" },
      {
        t: "mcq",
        id: "t5d6-bt-ngu-dieu",
        title: "VIII. Chọn phương án đúng",
        items: [
          { q: "1. “That's ONE way of looking at it” với nét xuống – lên trên ONE nghĩa là:", options: ["đó là cách nhìn duy nhất đúng", "còn cách nhìn khác, và tôi nghiêng về cách khác", "tôi không hiểu", "tôi hoàn toàn đồng ý"], correct: 1, why: "↘↗ trên ONE: ngầm đối lập với “another way”." },
          { q: "2. Nét giọng nào hợp với “I couldn't agree more.”?", options: ["xuống – lên", "phẳng", "xuống cao", "lên thấp"], correct: 2, why: "Tán thành mạnh → xuống cao, dứt khoát." },
        ],
      },

      { t: "h", text: "IX. Viết Task 1 — đề “hai vật” (20 phút) — AI chấm" },
      {
        t: "table",
        head: ["Chú thích trên hình", "Tent A — ridge tent (1970s)", "Tent B — dome tent (today)"],
        rows: [
          ["Sleeps", "4 people", "4 people"],
          ["Shape", "triangular, straight sides", "rounded dome"],
          ["Poles", "2 wooden upright poles", "2 flexible aluminium poles crossing at the top"],
          ["Fabric", "cotton canvas", "polyester"],
          ["Groundsheet", "separate", "sewn in"],
          ["Held up by", "poles + 12 guy ropes and pegs", "poles; 4 pegs only"],
          ["Time to put up", "about 25 minutes, two people", "about 8 minutes, one person"],
          ["Headroom", "1.8 m at the centre only", "1.5 m over most of the floor"],
          ["Weight", "14 kg", "5 kg"],
        ],
        caption: "Thông tin trên hai hình vẽ của đề (hình và số liệu tự đặt cho bài luyện)",
      },
      {
        t: "essay",
        id: "t5d6-bt-viet-hai-vat",
        task: "Task 1",
        prompt: "The diagrams show two designs of four-person tent. Tent A — ridge tent (1970s): triangular with straight sides; 2 wooden upright poles; cotton canvas; separate groundsheet; held up by the poles plus 12 guy ropes and pegs; about 25 minutes to put up, two people; headroom 1.8 m at the centre only; 14 kg. Tent B — dome tent (today): rounded dome; 2 flexible aluminium poles crossing at the top; polyester; groundsheet sewn in; held up by the poles with only 4 pegs; about 8 minutes to put up, one person; headroom 1.5 m over most of the floor; 5 kg. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Overview: giống (cùng ngủ bốn người, cùng hai cột chống) · khác (hình dáng + cách đứng vững) · B nhẹ hơn và dựng nhanh hơn.",
          "Tự tính: 5 kg so với 14 kg (khoảng một phần ba) · 8 phút so với 25 phút (chưa tới một phần ba).",
          "Chú ý một điểm A hơn B: chiều cao ở giữa lều — bài band 8 không bỏ sót điểm đi ngược xu hướng.",
          "Không viết “Tent B is better” hay “campers prefer…”.",
        ],
      },

      { t: "h", text: "X. Nói 4 câu Part 3 — ghi âm, AI chấm" },
      {
        t: "speak",
        id: "t5d6-bt-noi-p3",
        part: "3",
        questions: [
          "Has modern life become too convenient?",
          "Do people value things more when they have had to work for them?",
          "Some people say that technology has made us less patient. Would you agree?",
          "In the future, do you think people will still want to make or repair things themselves?",
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG (NGÀY 1–6) ═══════════════════════════ */
  {
    id: "t5d6-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 1–6)",
    goal: "Đo lại cả chặng 1 của Tập 5 theo 8 phần — ngữ pháp, từ vựng, dịch, nghe, đọc, viết, nói, phát âm — với ngưỡng đạt ≥ 70 % từng phần, và biết chính xác phải ôn lại Ngày nào trước khi sang chặng 2 (Ngày 7–12, có Đề 9 ở Ngày 8).",
    minutes: 180,
    blocks: [
      {
        t: "recap",
        title: "Cách làm bài kiểm tra chặng",
        items: [
          "**8 phần**, khoảng 3 giờ. Làm một mạch được thì tốt; không thì chia hai buổi: Phần 1–5 (90 phút) và Phần 6–8 (90 phút).",
          "Không tra từ, không mở lại bài. Nghe **một lần**. Đọc **đúng giờ**.",
          "Ngưỡng đạt: ==≥ 70 % từng phần== — không cộng bù phần này cho phần kia. Viết / Nói: AI ước tính ≥ band 7.5.",
          "Trượt phần nào → ôn đúng **Ngày** ghi ở tiêu đề phần đó, làm lại riêng phần ấy sau 2 ngày.",
          "Ghi kết quả vào Sổ lỗi: điểm thô từng phần + tỉ lệ câu sạch của hai bài viết. Bạn sẽ so với Kiểm tra chặng 2 (Ngày 12).",
        ],
      },

      /* ── Phần 1 ── */
      { t: "h", text: "Phần 1 — Ngữ pháp (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 1, 3, 5)" },
      {
        t: "mcq",
        id: "t5d6-kt-ngu-phap-chon",
        title: "1a. Chọn đáp án đúng (12 câu)",
        items: [
          { q: "1. Since 2010, the number of people working from home ___ steadily.", options: ["rose", "has risen", "had risen", "rises"], correct: 1, why: "Since + mốc → hiện tại hoàn thành (Ngày 1 mục 3)." },
          { q: "2. By 2035, the city ___ its last coal-fired power station.", options: ["will close", "closes", "will have closed", "has closed"], correct: 2, why: "By + mốc tương lai → will have + V3 (Ngày 1 mục 3)." },
          { q: "3. Once the results ___ published, the committee will meet again.", options: ["will be", "are", "would be", "were"], correct: 1, why: "Mệnh đề thời gian tương lai dùng hiện tại đơn (Ngày 1 mục 3)." },
          { q: "4. Câu nào rào đón ĐÚNG liều?", options: ["This may possibly perhaps suggest a link.", "This suggests that diet may play a part.", "This proves that diet causes the disease.", "It could be said that arguably I disagree."], correct: 1, why: "Một nhận định, một lần rào (may). A rào ba lần; C không rào trong khi bằng chứng chưa đủ; D rào ý kiến của chính mình (Ngày 1 mục 5)." },
          { q: "5. The ___ of the factory led to protests across the town.", options: ["close", "closing down that", "closure", "closed"], correct: 2, why: "Danh hoá: close → closure (Ngày 1 mục 6)." },
          { q: "6. The number of applicants from overseas ___ fallen for the third year running.", options: ["have", "has", "are", "were"], correct: 1, why: "The number of + Ns + V số ít (Ngày 3 mục 3)." },
          { q: "7. A number of recent studies ___ this assumption.", options: ["challenges", "has challenged", "have challenged", "is challenging"], correct: 2, why: "A number of + Ns + V số nhiều (Ngày 3 mục 3)." },
          { q: "8. ___ unemployment remains a serious problem among ___ young.", options: ["The / the", "Ø / the", "An / Ø", "Ø / Ø"], correct: 1, why: "Danh từ trừu tượng nói chung: không mạo từ; the + adj = nhóm người (Ngày 3 mục 4)." },
          { q: "9. The committee will ___ at its next meeting.", options: ["discuss about the proposal", "discuss the proposal", "discuss on the proposal", "discuss for the proposal"], correct: 1, why: "discuss + O, không giới từ (Ngày 3 mục 6)." },
          { q: "10. Having reviewed all the applications, ___ .", options: ["the best candidate was chosen", "it was easy to choose", "the panel chose the best candidate", "the choice was made by the panel"], correct: 2, why: "Người review là the panel → the panel phải làm chủ ngữ (Ngày 5 mục 4, 7)." },
          { q: "11. The extent ___ pupils benefit from smaller classes is still debated.", options: ["that", "which", "to which", "to that"], correct: 2, why: "the extent to which (Ngày 5 mục 3)." },
          { q: "12. What matters most to commuters ___ reliable trains, not fast ones.", options: ["are", "is", "were", "being"], correct: 1, why: "What-clause làm chủ ngữ → số ít (Ngày 5 mục 5)." },
        ],
      },
      {
        t: "quiz",
        id: "t5d6-kt-ngu-phap-dien",
        kind: "fill",
        title: "1b. Điền MỘT từ hoặc viết dạng đúng của từ trong ngoặc (6 câu)",
        items: [
          { q: "There was a 10% increase ___ sales last year. (giới từ)", answers: ["in"], hint: "an increase in + thứ tăng · an increase of + mức tăng (Ngày 3 mục 5)." },
          { q: "The scheme has contributed to (reduce) ___ youth crime.", answers: ["reducing"], hint: "contribute to + V-ing (Ngày 3 mục 6)." },
          { q: "(Complete) ___ in 1998, the tunnel now carries 20,000 vehicles a day.", answers: ["Completed"], hint: "Bị động → V3 (Ngày 5 mục 4)." },
          { q: "Half the staff resigned, ___ forced the firm to end its night shift.", answers: ["which"], hint: ", which + V: bình luận cả ý (Ngày 5 mục 3)." },
          { q: "No one has yet found a solution ___ the housing shortage. (giới từ)", answers: ["to"], hint: "a solution to (Ngày 3 mục 5)." },
          { q: "Each of the proposals (have) ___ its critics.", answers: ["has"], hint: "Each of + Ns + V số ít (Ngày 3 mục 3)." },
        ],
      },

      /* ── Phần 2 ── */
      { t: "h", text: "Phần 2 — Từ vựng (10 + 6 câu · đạt ≥ 12/16 · trượt thì ôn Ngày 2, 4, 6)" },
      {
        t: "mcq",
        id: "t5d6-kt-tu-vung-chon",
        title: "2a. Chọn từ đúng (10 câu)",
        items: [
          { q: "1. After its landslide victory, the new government claimed a clear ___ for reform.", options: ["mandate", "referendum", "coalition", "scrutiny"], correct: 0, why: "a mandate for reform: sự uỷ nhiệm của cử tri (Ngày 2 mục 9)." },
          { q: "2. Spending on schools was ___ , so it could not be used for anything else.", options: ["repealed", "devolved", "ring-fenced", "lobbied"], correct: 2, why: "ring-fence a budget: khoanh riêng (Ngày 2 mục 9)." },
          { q: "3. Critics dismissed the exhibition as ___ : nothing in it had not been done before.", options: ["visceral", "derivative", "immersive", "understated"], correct: 1, why: "derivative: sao chép, thiếu sáng tạo (Ngày 2 mục 10)." },
          { q: "4. The drought ___ an already serious food shortage.", options: ["bolstered", "exacerbated", "circumvented", "substantiated"], correct: 1, why: "exacerbate + điều xấu: làm trầm trọng thêm (Ngày 4)." },
          { q: "5. The evidence linking the two events is ___ at best.", options: ["tangible", "salient", "tenuous", "conducive"], correct: 2, why: "a tenuous link: mong manh (Ngày 4)." },
          { q: "6. Tax cuts may help, but they are no ___ for a weak economy.", options: ["panacea", "caveat", "impetus", "onus"], correct: 0, why: "be no panacea for: không phải thuốc chữa bách bệnh (Ngày 4)." },
          { q: "7. The ___ is on the employer to show that the dismissal was fair.", options: ["propensity", "discrepancy", "onus", "dichotomy"], correct: 2, why: "the onus is on sb to V (Ngày 4)." },
          { q: "8. A 0.2% change in the figure is best described as ___ .", options: ["pronounced", "drastic", "sizeable", "negligible"], correct: 3, why: "Độ mạnh: 0,2% là không đáng kể (Ngày 6 mục 3)." },
          { q: "9. The writer describes a banker as “cunning”. The writer's attitude is ___ .", options: ["admiring", "critical", "neutral", "sympathetic"], correct: 1, why: "cunning là từ chê; khen thì dùng shrewd (Ngày 6 mục 4)." },
          { q: "10. “Later research refuted the theory” means that the theory was ___ .", options: ["questioned by some", "shown to be false", "politely rejected", "made famous"], correct: 1, why: "refute = chứng minh là sai (Ngày 6 mục 6)." },
        ],
      },
      {
        t: "quiz",
        id: "t5d6-kt-tu-vung-dien",
        kind: "fill",
        title: "2b. Điền MỘT từ, hoặc viết dạng đúng của từ in HOA (6 câu)",
        items: [
          { q: "Small firms complain that red ___ makes it hard to hire staff. (thủ tục rườm rà)", answers: ["tape"], hint: "red tape (Ngày 2 mục 9)." },
          { q: "The plan was approved, with the c___ that costs be reviewed every year. (điều kiện kèm theo)", answers: ["caveat"], hint: "with the caveat that (Ngày 4)." },
          { q: "Constant interruptions are hardly conducive ___ deep work. (giới từ)", answers: ["to"], hint: "conducive to (Ngày 4)." },
          { q: "The new bypass should a___ congestion in the town centre. (làm dịu)", answers: ["alleviate"], hint: "alleviate congestion (Ngày 6 mục 5)." },
          { q: "The bridge was d___ unsafe and closed to traffic. (bị cho là)", answers: ["deemed"], hint: "be deemed + adj (Ngày 6 mục 5)." },
          { q: "The (SIGNIFY) ___ of the discovery was not recognised for decades.", answers: ["significance"], hint: "AWL: signify → significance (Ngày 2 mục 1–5)." },
        ],
      },

      /* ── Phần 3 ── */
      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      {
        t: "quiz",
        id: "t5d6-kt-dich",
        kind: "translate",
        title: "3. Dịch sang tiếng Anh",
        grammar: "Mỗi câu ôn một ngày: thì (N1) · giới từ + mạo từ (N3) · What-clause (N5) · từ band 8 (N4) · hedging nói (N6) · Task 1 (N6)",
        items: [
          { q: "Từ năm 2015, số người đạp xe đi làm đã tăng gấp đôi.", answers: ["Since 2015, the number of people cycling to work has doubled.", "Since 2015, the number of people who cycle to work has doubled.", "The number of people cycling to work has doubled since 2015."], hint: "Since 2015 · the number of · has doubled" },
          { q: "Một trong những lý do chính của vấn đề này là thiếu đầu tư.", answers: ["One of the main reasons for this problem is a lack of investment.", "One of the main reasons for this problem is the lack of investment."], hint: "One of the main reasons for · a lack of" },
          { q: "Điều khiến tôi ngạc nhiên là rất ít người biết về chương trình đó.", answers: ["What surprised me was that very few people knew about the scheme.", "What surprised me was that very few people knew about the programme.", "What surprised me was that so few people knew about the scheme."], hint: "What surprised me was that · very few" },
          { q: "Biện pháp này có thể làm trầm trọng thêm bất bình đẳng thay vì giảm nó.", answers: ["This measure may exacerbate inequality rather than reduce it.", "This measure may exacerbate inequality instead of reducing it.", "This measure could exacerbate inequality rather than reduce it."], hint: "may exacerbate · rather than reduce" },
          { q: "Theo như tôi biết, chưa có nước nào cấm hẳn việc đó.", answers: ["As far as I know, no country has banned it completely.", "As far as I know, no country has banned it outright.", "As far as I know, no country has completely banned it."], hint: "As far as I know · no country has banned" },
          { q: "Đến năm 2024, thanh toán không tiếp xúc chiếm gần một nửa tổng số chuyến đi.", answers: ["By 2024, contactless payment accounted for almost half of all journeys.", "By 2024, contactless payment accounted for nearly half of all journeys.", "By 2024, contactless payment had come to account for almost half of all journeys."], hint: "By 2024 · accounted for · almost half of all journeys" },
        ],
      },

      /* ── Phần 4 ── */
      { t: "h", text: "Phần 4 — Nghe (5 + 5 câu · đạt ≥ 7/10 · trượt thì ôn Ngày 1, 4, 5)" },
      { t: "p", text: "Hai đoạn, mỗi đoạn nghe **một lần**. Đọc câu hỏi 20 giây trước mỗi đoạn." },
      {
        t: "listen",
        id: "t5d6-kt-nghe-piano",
        title: "Arranging a visit from a piano tuner",
        dan: { so: "Day 6, Recording 1", boiCanh: "a telephone conversation between a piano tuner and a customer.", cau: [1, 5] },
        note: "Khoảng 1 phút 10 giây, tốc độ thật. Declan: giọng Ireland (nam). Khách: giọng Canada (nữ).",
        lines: [
          { who: "Declan", voice: "ie-nam", text: "Hello, Declan speaking, piano tuning." },
          { who: "Customer", voice: "ca-nu", text: "Oh, hi. I've just inherited my aunt's piano and it sounds awful. Could you come and take a look at it?" },
          { who: "Declan", voice: "ie-nam", text: "I'm sure I can. Is it a grand or an upright?" },
          { who: "Customer", voice: "ca-nu", text: "As a kid I always called it the baby grand, but no, it's an upright. It's against the wall in the hallway." },
          { who: "Declan", voice: "ie-nam", text: "Right you are. And when was it last tuned, do you know?" },
          { who: "Customer", voice: "ca-nu", text: "My aunt always said four years ago, but there's a card inside the lid with the date on it, and by my count it's six." },
          { who: "Declan", voice: "ie-nam", text: "Six years. Then it may well need two visits. The first one's eighty-five pounds. My regular customers pay seventy, but that's only from the second year on." },
          { who: "Customer", voice: "ca-nu", text: "That's fine. Are you free on Tuesday?" },
          { who: "Declan", voice: "ie-nam", text: "Tuesday I'm over in Galway all day. I could do Wednesday morning, around ten." },
          { who: "Customer", voice: "ca-nu", text: "Wednesday's good. Oh, sorry, what was your surname? I need to leave it with the front desk." },
          { who: "Declan", voice: "ie-nam", text: "It's Tierney. T-I-E-R-N-E-Y." },
          { who: "Customer", voice: "ca-nu", text: "Got it. And don't worry about the lift, it's tiny, but we're on the ground floor." },
          { who: "Declan", voice: "ie-nam", text: "Even better. See you Wednesday, so." },
        ],
      },
      {
        t: "quiz",
        id: "t5d6-kt-nghe-piano-cau",
        kind: "fill",
        title: "Questions 1–5 — ONE WORD OR A NUMBER",
        items: [
          { q: "1. Type of piano: ___", answers: ["upright"], hint: "“I always called it the baby grand, but no, it's an upright.”" },
          { q: "2. Last tuned: ___ years ago", answers: ["6", "six"], hint: "“My aunt always said four… by my count it's six.” → “Six years.”" },
          { q: "3. Cost of first visit: £ ___", answers: ["85", "eighty-five"], hint: "seventy là giá cho khách quen từ năm thứ hai." },
          { q: "4. Day of visit: ___", answers: ["Wednesday"], hint: "Tuesday: anh ấy ở Galway." },
          { q: "5. Tuner's surname: ___", answers: ["Tierney"], hint: "T-I-E-R-N-E-Y." },
        ],
      },
      {
        t: "listen",
        id: "t5d6-kt-nghe-cau",
        title: "A lecture extract — the bridge that swayed",
        dan: { so: "Day 6, Recording 2", boiCanh: "part of a lecture on engineering failures.", cau: [6, 10] },
        note: "Khoảng 1 phút 20 giây, ~175 từ/phút. Giọng Ireland (nữ).",
        lines: [
          { who: "Lecturer", voice: "ie-nu", text: "Let me give you one example of engineers being caught out. The Millennium Bridge in London, a footbridge across the Thames, opened in June 2000. On the first day something like ninety thousand people crossed it, and it began to sway. Not up and down, which is the movement the designers had checked for, but sideways. It was closed two days later." },
          { who: "Lecturer", voice: "ie-nu", text: "Now, the newspapers said the crowd had been marching in step, like soldiers. That wasn't it; nobody was marching. What actually happened is subtler. Any bridge moves very slightly. When the deck shifts a little to the left, the people on it widen their stance and adjust their steps to keep their balance, exactly as you do on a moving train. But in doing so they push the deck further the same way. More sway, more adjustment, and within a minute hundreds of strangers are walking in time without ever intending to." },
          { who: "Lecturer", voice: "ie-nu", text: "The cure wasn't to stiffen the bridge, which would have ruined its appearance. Instead, dampers were fitted underneath, devices that work much like the shock absorbers on a car, to soak up the movement. The work took almost two years and cost about five million pounds, and the bridge reopened in February 2002. Since then, the rules for footbridges around the world have been rewritten. And that's my point: the failure taught the profession more than a dozen successes would have." },
        ],
      },
      {
        t: "quiz",
        id: "t5d6-kt-nghe-cau-cau",
        kind: "fill",
        title: "Questions 6–10 — ONE WORD OR A NUMBER",
        items: [
          { q: "6. The bridge moved ___ , a direction the designers had not checked.", answers: ["sideways"], hint: "“Not up and down… but sideways.”" },
          { q: "7. Newspapers wrongly reported that the crowd had been ___ in step.", answers: ["marching"], hint: "“the newspapers said… marching in step… That wasn't it”." },
          { q: "8. People changed the way they walked in order to keep their ___ .", answers: ["balance"], hint: "“adjust their steps to keep their balance”." },
          { q: "9. The problem was solved by fitting ___ under the deck.", answers: ["dampers"], hint: "“The cure wasn't to stiffen the bridge… Instead, dampers were fitted underneath”. Số nhiều." },
          { q: "10. The repairs cost about £ ___ million.", answers: ["5", "five"], hint: "two years là thời gian; ninety thousand là số người ngày đầu." },
        ],
      },

      /* ── Phần 5 ── */
      { t: "h", text: "Phần 5 — Đọc (4 + 5 + 3 câu · đạt ≥ 9/12 · 16 phút · trượt thì ôn Ngày 1, 3, 5)" },
      {
        t: "passage",
        title: "The Value of Our Own Labour",
        paras: [
          { label: "A", text: "When instant cake mixes first went on sale in the United States, the story goes, they sold badly until manufacturers took out the powdered egg and asked customers to add a fresh one: a cake that needed nothing but water was too easy to feel like baking. The tale is repeated in countless business books and is poorly documented, but the intuition behind it has since been tested properly, and it has largely held up." },
          { label: "B", text: "In a series of studies published in 2012, Michael Norton, Daniel Mochon and Dan Ariely asked volunteers to assemble plain storage boxes, fold paper animals or build small sets of plastic bricks, and then to say how much they would pay to keep the result. Builders consistently offered more for their own creations than other people were prepared to offer for the very same objects, and in some cases valued their amateur efforts almost as highly as versions made by experts. The researchers named the pattern after the Swedish furniture retailer whose customers finish the manufacturing at home." },
          { label: "C", text: "What makes the finding more than a curiosity is its limits. The premium vanished when participants were stopped before the task was finished, and it vanished again when they completed an object and were then told to take it apart. Effort alone, in other words, produced nothing; what people prized was effort that had ended in something whole. This fits an older body of work suggesting that the sense of having done a thing competently is rewarding in itself, and it sits awkwardly with the simpler view that we overvalue our work merely to justify the time spent on it." },
          { label: "D", text: "For companies the lesson has seemed obvious: give customers something to do. Yet the same research implies a narrow margin for error. A task that is too trivial confers no sense of achievement, while one that defeats the customer leaves an unfinished object and, presumably, resentment. Nor is it clear that the effect survives in markets where the buyer has no wish to build anything; nobody has shown that people would rather assemble their own cars." },
          { label: "E", text: "The more uncomfortable implications lie elsewhere. A manager who has devised a procedure, or the author of a report, is a builder too, and there is every reason to expect such people to judge their own constructions as generously as the volunteers judged their lopsided paper frogs. If so, the bias matters less in the shop than in the meeting room, where the person best placed to defend an idea is frequently the one least able to see what it is worth." },
        ],
      },
      { t: "p", text: "**Questions 1–4** — Choose the correct heading for paragraphs **B–E** from the list below. Write the correct number, **i–vii**." },
      {
        t: "table",
        head: ["", "List of Headings"],
        rows: [
          ["i", "Why customers resent doing a company's work"],
          ["ii", "Where the tendency may do most harm"],
          ["iii", "Conditions under which the effect disappears"],
          ["iv", "An anecdote that has never been tested"],
          ["v", "A commercial opportunity with little room for mistakes"],
          ["vi", "Evidence that makers overrate what they have made"],
          ["vii", "Proof that the work of experts is undervalued"],
        ],
      },
      {
        t: "quiz",
        id: "t5d6-kt-doc-tieu-de",
        kind: "fill",
        title: "Questions 1–4 — ghi số La Mã (i–vii)",
        items: [
          { q: "1. Paragraph B", answers: ["vi"], hint: "“Builders consistently offered more for their own creations than other people were prepared to offer” → makers overrate. vii là bẫy: bài không nói đồ của chuyên gia bị đánh giá thấp." },
          { q: "2. Paragraph C", answers: ["iii"], hint: "“The premium vanished when… and it vanished again when…” → conditions under which the effect disappears." },
          { q: "3. Paragraph D", answers: ["v"], hint: "“give customers something to do. Yet… a narrow margin for error” → opportunity with little room for mistakes. i chỉ đúng cho một chữ resentment." },
          { q: "4. Paragraph E", answers: ["ii"], hint: "“the bias matters less in the shop than in the meeting room” → where it may do most harm." },
        ],
      },
      { t: "p", text: "**Questions 5–9** — Do the following statements agree with the claims of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq",
        id: "t5d6-kt-doc-ynng",
        title: "Questions 5–9 — YES / NO / NOT GIVEN",
        items: [
          { q: "5. The cake-mix story is well supported by historical records, although the idea behind it has turned out to be mistaken.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Hai vế đều ngược: “poorly documented” và “the intuition… has largely held up”. Một vế ✗ là đủ NO (Ngày 3 Bài 2 mục 2)." },
          { q: "6. In the 2012 studies, people who had made an object were willing to pay more for it than others would pay for the identical item.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“offered more for their own creations than other people were prepared to offer for the very same objects”." },
          { q: "7. The effect was stronger among volunteers who had previous experience of assembling furniture.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài không nói gì về kinh nghiệm trước đó của người tham gia." },
          { q: "8. The findings described in paragraph C support the view that people overvalue their work mainly to justify the time they have spent on it.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“it sits awkwardly with the simpler view that we overvalue our work merely to justify the time spent” — sits awkwardly with = không khớp." },
          { q: "9. The writer thinks the bias is likely to affect how professionals assess their own proposals.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“there is every reason to expect such people to judge their own constructions as generously…” — every reason to expect = likely." },
        ],
      },
      {
        t: "mcq",
        id: "t5d6-kt-doc-mcq",
        title: "Questions 10–12 — Choose the correct letter",
        items: [
          { q: "10. The writer mentions cars in paragraph D in order to", options: ["A  show that the effect is strongest for expensive products.", "B  suggest that the effect may not apply to every kind of purchase.", "C  criticise car manufacturers for ignoring the research.", "D  give an example of a task that defeats the customer."], correct: 1, why: "“Nor is it clear that the effect survives in markets where the buyer has no wish to build anything”." },
          { q: "11. The phrase “a narrow margin for error” in paragraph D refers to the fact that", options: ["A  customers make many mistakes when assembling products.", "B  companies earn little profit from such products.", "C  the task set must be neither too easy nor too difficult.", "D  the research was based on a small number of volunteers."], correct: 2, why: "Câu ngay sau: “too trivial… no sense of achievement, while one that defeats the customer leaves an unfinished object”." },
          { q: "12. What is the writer's main purpose in the passage?", options: ["A  To advise companies on how to increase their sales.", "B  To show that a famous marketing story is false.", "C  To argue that a well-known bias has clearer limits and wider relevance than is usually recognised.", "D  To explain why home-made objects are of better quality."], correct: 2, why: "C–D: giới hạn của hiệu ứng; E: ý nghĩa rộng hơn (phòng họp). A chỉ là đoạn D. B sai: câu chuyện “poorly documented”, không phải false." },
        ],
      },

      /* ── Phần 6 ── */
      { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 2, 4, 6)" },
      {
        t: "mcq",
        id: "t5d6-kt-viet-chon",
        title: "6a. Kiến thức viết band 8 (6 câu · đạt ≥ 5/6)",
        items: [
          { q: "1. Trong chuỗi bốn mắt xích của một thân bài band 8 (Ngày 2 mục 5), câu nào là mắt xích “cơ chế” (vì sao)?", options: ["Free museums attract more visitors.", "This is because the entrance fee, however small, forces people to decide in advance whether a visit is worth it.", "In my city, visits doubled after fees were dropped.", "Free entry will not, of course, help those who live far from any museum."], correct: 1, why: "B giải thích VÌ SAO. A là nhận định, C là bằng chứng, D là giới hạn." },
          { q: "2. Cách nối câu nào là “liên kết không gây chú ý” (Ngày 2 mục 6)?", options: ["Moreover, furthermore, in addition, rents rose.", "Rents rose sharply. This increase pushed many families out of the centre.", "Rents rose sharply. Secondly, families left.", "Rents rose sharply and, and then, families left."], correct: 1, why: "This + danh từ tóm (increase) mở câu sau bằng thứ vừa nói." },
          { q: "3. Ví dụ nào “liên quan và cụ thể” (Ngày 4)?", options: ["For example, many countries have this problem.", "For instance, everyone knows that education is important.", "In a town where the only cinema has closed, for instance, teenagers have little reason to stay in the centre after dark.", "For example, as a famous person once said, knowledge is power."], correct: 2, why: "C là một tình huống cụ thể thấy được và đúng phạm vi lập luận. A, B khái quát; D là câu trích học thuộc." },
          { q: "4. Thesis nào đúng mức band 8 cho đề “To what extent do you agree?”", options: ["This essay will discuss both sides.", "I agree, provided that the policy is limited to city centres.", "Maybe I partly agree and partly disagree, it depends.", "There are advantages and disadvantages."], correct: 1, why: "Lập trường rõ + điều kiện cụ thể; không rào đón ý kiến của mình (Ngày 1 mục 5 · Ngày 4)." },
          { q: "5. Trong Task 1, lát lớn nhất của hình tròn là 41%. Viết thế nào?", options: ["Most people…", "The majority of people…", "The largest single group, at 41%, …", "Nearly everyone…"], correct: 2, why: "41% chưa quá nửa → không dùng most / majority (Ngày 6 Bài 2)." },
          { q: "6. Overview cho đề “hai vật” nên có:", options: ["mọi thông số", "ý kiến vật nào tốt hơn", "điểm giống về chức năng và điểm khác về cơ chế", "lịch sử phát minh"], correct: 2, why: "Ngày 6 Bài 2 mục 4." },
        ],
      },
      {
        t: "figure",
        fig: {
          kind: "line",
          title: "Passengers using Kelso Airport (millions)",
          note: "Số liệu tự đặt cho bài luyện; Kelso Airport ở đây là sân bay hư cấu.",
          unit: "million passengers",
          categories: ["2005", "2010", "2015", "2020", "2025"],
          series: [
            { name: "Domestic flights", values: [2.1, 2.6, 2.4, 1.9, 2.2] },
            { name: "International flights", values: [0.8, 1.5, 2.9, 1.2, 3.6] },
          ],
        },
      },
      {
        t: "figure",
        fig: {
          kind: "pie",
          title: "Main purpose of international trips from Kelso Airport, 2025 (%)",
          note: "Số liệu tự đặt cho bài luyện.",
          slices: [
            { label: "Holiday", value: 54 },
            { label: "Visiting family or friends", value: 21 },
            { label: "Business", value: 16 },
            { label: "Study", value: 6 },
            { label: "Other", value: 3 },
          ],
        },
      },
      {
        t: "essay",
        id: "t5d6-kt-viet-task1",
        task: "Task 1",
        prompt: "The line graph shows the number of passengers using Kelso Airport on domestic and international flights between 2005 and 2025, in millions. The pie chart shows the main purpose of international trips from the airport in 2025. (Domestic: 2.1 – 2.6 – 2.4 – 1.9 – 2.2; International: 0.8 – 1.5 – 2.9 – 1.2 – 3.6, for 2005, 2010, 2015, 2020 and 2025. Pie chart, 2025: holiday 54%, visiting family or friends 21%, business 16%, study 6%, other 3%.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (20 minutes)",
        minWords: 150,
        tips: [
          "Tính trước: tổng 2005 = 2,9 triệu; tổng 2025 = 5,8 triệu → gấp đôi. Quốc tế: gấp 4,5 lần. Nội địa: gần như đứng yên.",
          "Điểm phải nói: quốc tế vượt nội địa vào 2015; cả hai cùng lõm ở 2020, quốc tế lõm sâu hơn nhiều rồi lên mức cao nhất.",
          "Hình tròn: holiday hơn một nửa (được dùng majority); holiday + thăm thân = ba phần tư.",
          "Không giải thích vì sao 2020 giảm — hình không nói.",
        ],
      },
      {
        t: "essay",
        id: "t5d6-kt-viet-task2",
        task: "Task 2",
        prompt: "Some people argue that it is better to make important decisions quickly, relying on instinct, than to spend a long time analysing them. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words. (40 minutes)",
        minWords: 250,
        tips: [
          "Đếm vế: đề so sánh HAI cách quyết định (nhanh, theo trực giác — chậm, có phân tích) và có chữ “important” và “better” — lập trường phải nói rõ cách nào hơn, với loại quyết định nào.",
          "Mỗi thân bài đủ bốn mắt xích: nhận định → cơ chế → ví dụ đúng phạm vi → giới hạn (Ngày 2 · Ngày 4).",
          "1–2 câu ba tầng mỗi đoạn, xen câu ngắn (Ngày 5). 4–6 từ ít gặp đã qua bốn phép thử (Ngày 4 · Ngày 6).",
          "5 phút cuối: soát theo quy tắc cá nhân trong Sổ lỗi (Ngày 3 mục 7); đếm câu sạch.",
        ],
      },

      /* ── Phần 7 ── */
      { t: "h", text: "Phần 7 — Nói (4 câu Part 1 + Part 2 + 4 câu Part 3 · AI ≥ band 7.5 ước tính · trượt thì ôn Ngày 2, 3, 6)" },
      {
        t: "speak",
        id: "t5d6-kt-noi-p1",
        part: "1",
        questions: [
          "Is the place where you live noisy or quiet?",
          "What kinds of noise bother you most?",
          "Do you like to have music or other sound on while you work or study?",
          "Do you think cities are getting noisier?",
        ],
      },
      {
        t: "speak",
        id: "t5d6-kt-noi-p2",
        part: "2",
        questions: [
          "Describe a risk you took that turned out well. You should say: what the risk was; why you decided to take it; what happened; and explain how you feel about that decision now.",
        ],
      },
      {
        t: "speak",
        id: "t5d6-kt-noi-p3",
        part: "3",
        questions: [
          "Do you think young people are more willing to take risks than older people?",
          "Is it possible to teach someone to make good decisions?",
          "Why do some people find it hard to admit that a decision they made was wrong?",
          "Should governments stop people from making choices that are bad for them?",
        ],
      },
      {
        t: "note",
        title: "Tự chấm phần Nói — nghe lại bản ghi và trả lời có / không",
        items: [
          "**Part 1**: mỗi câu 2–3 câu nói liền, ba nhịp (thẳng → thu hẹp → một chi tiết riêng)? Có 1–2 cụm thành ngữ đúng dạng? (Ngày 3)",
          "**Part 2**: nói đủ gần 2 phút, mọi chỗ ngắt rơi ở ranh giới ý chứ không giữa cụm từ? (Ngày 2)",
          "**Part 3**: mỗi câu có lập trường có giới hạn + một nhượng bộ thật + câu chốt sắc hơn? Rào dữ kiện, không rào ý kiến? (Ngày 6)",
          "Từ ba câu “không” trở lên → ôn đúng Ngày ghi trong ngoặc, ghi âm lại sau hai ngày.",
        ],
      },

      /* ── Phần 8 ── */
      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm của Ngày 1–6)" },
      {
        t: "mcq",
        id: "t5d6-kt-phat-am",
        title: "8. Chọn đáp án đúng (8 câu)",
        items: [
          { q: "1. Giọng Mỹ đọc “a metal ladder”. Âm /t/ trong metal nghe gần:", options: ["/t/ rõ", "/d/ (flap)", "/s/", "không có âm nào"], correct: 1, why: "nguyên âm + t + nguyên âm không nhấn → flap (Ngày 1)." },
          { q: "2. Trong “button” và “cotton”, nhiều người bản ngữ thay /t/ bằng:", options: ["flap", "tiếng ngắt thanh hầu (glottal stop)", "/d/ rõ", "/θ/"], correct: 1, why: "-tton → [ʔ] (Ngày 1)." },
          { q: "3. Chỗ ngắt nào ĐÚNG ranh giới cụm (tone unit)?", options: ["The reason | I chose | this course is that it's | practical", "The reason I chose this course | is that it's practical", "The | reason I chose this | course is that it's practical", "The reason I | chose this course is | that it's practical"], correct: 1, why: "Ngắt giữa chủ ngữ dài và vị ngữ; không ngắt giữa cụm (Ngày 2 mục 7)." },
          { q: "4. Từ nào có nguyên âm đôi /əʊ/?", options: ["cost", "caught", "coast", "court"], correct: 2, why: "coast /kəʊst/. Người Việt hay đọc thành /ɔː/ → nghe như court / caught (Ngày 3 mục 5)." },
          { q: "5. Trọng âm của “commensurate” rơi vào âm tiết:", options: ["thứ nhất", "thứ hai", "thứ ba", "thứ tư"], correct: 1, why: "com-MEN-su-rate (Ngày 4)." },
          { q: "6. Bạn nghe “ə-lɒ-tə-vɪ-tɪz”. Đó là:", options: ["a lot of it is", "a lottery tease", "allotted it is", "a lot fit is"], correct: 0, why: "Chuỗi nối âm phụ âm + nguyên âm (Ngày 5 mục 3)." },
          { q: "7. Giọng Anh – Úc đọc “the idea of it” thường chêm:", options: ["/j/", "/w/", "/r/", "/h/"], correct: 2, why: "/r/ chêm sau /ə/ trước nguyên âm (Ngày 5 mục 3)." },
          { q: "8. “That's true to SOME extent” với nét xuống – lên trên SOME cho người nghe biết:", options: ["bạn đồng ý hoàn toàn", "bạn đồng ý một phần và sắp nói “but”", "bạn đang hỏi lại", "bạn đã nói xong"], correct: 1, why: "↘↗ = dè dặt, còn vế sau (Ngày 6 Bài 3 mục 7)." },
        ],
      },

      /* ── Xong ── */
      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table",
        head: ["Phần", "Ngưỡng đạt", "Trượt thì ôn", "Điểm của bạn"],
        rows: [
          ["1. Ngữ pháp", "13/18", "Ngày 1 (thì · hedging · danh hoá) · Ngày 3 (chủ – vị · mạo từ · giới từ) · Ngày 5 (câu ba tầng)", "___"],
          ["2. Từ vựng", "12/16", "Ngày 2 (AWL · Chính phủ · Nghệ thuật) · Ngày 4 (50 từ band 8) · Ngày 6 (sắc thái)", "___"],
          ["3. Dịch", "5/6", "xem gợi ý từng câu — mỗi câu ghi một Ngày", "___"],
          ["4. Nghe", "7/10", "Ngày 1 (Part 1 tốc độ thật) · Ngày 4 (Part 2 + 3) · Ngày 5 (Part 4, biển báo)", "___"],
          ["5. Đọc", "9/12", "Ngày 1 (đọc một lần) · Ngày 3 (chẻ vế) · Ngày 5 (tiêu đề chức năng)", "___"],
          ["6. Viết", "5/6 + AI ≥ 7.5", "Ngày 2 (band 8 trông thế nào) · Ngày 4 (Opinion) · Ngày 6 (Task 1)", "___"],
          ["7. Nói", "AI ≥ 7.5", "Ngày 2 (ngắt vì nội dung) · Ngày 3 (Part 1) · Ngày 6 (Part 3)", "___"],
          ["8. Phát âm", "6/8", "khối máy chấm của Ngày 1–6", "___"],
        ],
        caption: "Bảng kết quả chặng 1 — chép vào Sổ lỗi",
      },
      {
        t: "note",
        title: "📌 Sang chặng 2 (Ngày 7–12)",
        items: [
          "**Đạt cả 8 phần**: sang Ngày 7. Ngày 8 bạn làm **Đề 9** ở Online Test — đề đủ 4 kỹ năng đầu tiên của Tập 5 (mức band 7.0–7.5).",
          "**Trượt 1–2 phần**: vẫn sang Ngày 7, nhưng mỗi ngày dành 20 phút ôn Ngày đã ghi; làm lại riêng phần trượt trước Ngày 8.",
          "**Trượt từ 3 phần**: dừng hai ngày để ôn. Làm Đề 9 khi nền chưa chắc chỉ cho bạn một con số thấp mà không cho biết vì sao.",
          "Band AI chấm là **ước tính** — dùng để so mình hôm nay với mình sáu ngày trước, không dùng để đoán điểm thi thật.",
        ],
      },
    ],
  },
];
