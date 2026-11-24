/**
 * IELTS Tập 5 — Ngày 19 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Câu điều kiện hỗn hợp band 8 (bốn hướng thời gian, dạng tiếp diễn, điều kiện NGẦM không có if) · thức giả định
 *                     (mandative, were, cụm cố định) · dấu câu vòng 3 (tám quy tắc làm rõ cấu trúc)               [G38 G42 G32]
 *                     — nối Tập 4 Ngày 19 (hỗn hợp, từ thay if, đảo ngữ) · Tập 4 Ngày 27 (subjunctive) · Tập 3 Ngày 27 ·
 *                       Tập 4 Ngày 21 · Tập 5 Ngày 9 (dấu câu)
 *   Bài 2 (reading)   Reading đủ 3 passage · 40 câu · 55 phút — LẦN 2 của Tập 5 (mục tiêu 34–35/40): đồ hộp ra đời (Short answer +
 *                     TFNG + Flow-chart) · mạng nấm dưới rừng (Headings + Summary + MCQ) · thí nghiệm tưởng tượng (MCQ + YNNG +
 *                     Sentence endings)                                                                           [R20]
 *                     — nối Tập 5 Ngày 13 (lần 1, nhãn lỗi K/P/S/C) · Tập 4 Ngày 13 · 21 · 27 (60 phút)
 *   Bài 3 (speaking)  Bảng 3.5 ghi 🎧 “Đề nhỏ Part 3+4 tốc độ thật [L05 L06]”; khuôn N mod 4 = 3 buộc kind speaking ⇒ đề nhỏ 20 câu làm
 *                     ĐẦU VÀO (Part 3: nghiên cứu chỗ ngồi trong giảng đường, giọng Úc · Canada · Anh, ~860 từ; Part 4: Darwin và
 *                     giun đất, giọng New Zealand, ~950 từ; cả hai ~175 từ/phút), rồi NÓI Part 3 band 8 bằng ba động tác tóm –
 *                     phản hồi – giả định                                                                  [L05 L06 · S06]
 *                     — nối Tập 4 Ngày 19 (Part 3 giả định band 7) · Tập 5 Ngày 13 (nghe → nói) · 🔊 dạng yếu would've / if I'd
 *   Bài tập Ngày 19   44 câu có đáp án + 1 đoạn viết + 3 câu nói
 * Mọi id bắt đầu `t5d19-`. Đã grep tap-3…5/ngay + thi-may/de trước khi chọn đề tài: Appert / canning / can opener, mycorrhiza /
 * wood wide web, thought experiment, earthworm, lecture seating / front row = chưa dùng làm đề tài chính.
 * Dữ kiện có thật (soạn theo trí nhớ, đã làm tròn / làm mờ chỗ không chắc): Nicolas Appert, giải thưởng 12.000 franc năm 1810, sách
 * cùng năm; bằng sáng chế của Peter Durand (1810) bán cho Bryan Donkin và John Hall, xưởng ở Bermondsey; đồ mở hộp có bằng sáng chế ở
 * Mỹ năm 1858; Pasteur giải thích vi sinh vật thập niên 1860; Isaac Solomon thêm canxi clorua (1861). Suzanne Simard và thí nghiệm
 * đồng vị carbon bạch dương – linh sam (Nature, 1997); bài tổng quan năm 2023 về bằng chứng thực địa. Galileo (Two New Sciences,
 * 1638), Einstein đuổi theo tia sáng, Frank Jackson (1982), Philippa Foot (1967), John Norton và James Robert Brown, nghiên cứu hiệu
 * ứng thứ tự ở các nhà triết học chuyên nghiệp. Darwin, sách về giun đất năm 1881, ước tính của ông về lượng đất giun đưa lên, thí
 * nghiệm với đàn piano và lá cây; giun ngoại lai ở rừng Bắc Mỹ. Con số nào không chắc đều viết dạng “khoảng / theo ước tính của ông”.
 * Nhân vật trong bài nghe và bài tập (Dr Okafor, Leah, Sam, Dr Harker…) là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_19: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d19-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Câu điều kiện hỗn hợp, thức giả định và dấu câu — vòng 3: giả định đúng thời gian, đúng mức chắc chắn, dấu câu làm rõ cấu trúc",
    goal: "Viết và nói không lỗi bốn hướng thời gian của câu điều kiện hỗn hợp (kể cả dạng tiếp diễn và điều kiện ngầm không có if), dùng đúng thức giả định trong câu đề xuất chính sách và ba cụm cố định trang trọng, và đặt đúng tám dấu câu làm rõ cấu trúc của một câu dài — đủ để đoạn đề xuất trong Task 2 đạt GRA 8 (nhiều cấu trúc phức, đa số câu không lỗi).",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **GRA 7 → 8** ở cả Writing lẫn Speaking. Band 8 đòi ==cấu trúc phức linh hoạt, đa số câu không lỗi==; lỗi thời gian trong câu giả định và lỗi dấu câu ở câu dài là hai lỗi hay còn sót nhất ở người band 7.",
          "**Điều kiện hỗn hợp** (Tập 4 Ngày 19) hôm nay lên vòng 3: bốn hướng thời gian, dạng tiếp diễn (would now be facing), và câu giả định ==không có chữ if== (But for…, Otherwise…, A ban would…).",
          "**Thức giả định** (Tập 4 Ngày 27): sau recommend / essential / insistence dùng ==động từ nguyên mẫu trần cho MỌI chủ ngữ== (that every school **be** required…); thêm ba cụm cố định dùng được trong bài viết.",
          "**Dấu câu vòng 3** (Tập 3 Ngày 27 · Tập 4 Ngày 21 · Tập 5 Ngày 9): tám quy tắc — không phẩy giữa chủ ngữ dài và động từ, ; however, · dấu hai chấm sau mệnh đề đủ · gạch nối của tính từ ghép · số kiểu Anh 1,500 / 2.5.",
          "Liều cho một bài Task 2: ==1–2 câu điều kiện hỗn hợp hoặc ngầm · 0–1 câu giả định · dấu câu thì luôn đúng==.",
          "Bài 2 hôm nay (Passage 3) và Bài 3 (bài nghe) đều chứa đúng những cấu trúc này — cuối mỗi bài có phần soi lại.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Kiểm tra đầu bài — ôn Tập 4 Ngày 19 · Tập 4 Ngày 27 · Tập 5 Ngày 9 (6 câu)" },
      { t: "p", text: "Làm trong 3 phút, không xem lại bài cũ. Sai từ 2 câu trở lên ở một nhóm thì đọc lại đúng ngày ghi trong 💡 trước khi sang mục 1." },
      {
        t: "quiz",
        id: "t5d19-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — viết dạng đúng của từ trong ngoặc / điền MỘT từ (6 câu)",
        items: [
          { q: "1. If the city had built the metro in the 1990s, traffic ___ (not be) so bad today.", answers: ["would not be", "wouldn't be"], hint: "Quá khứ khác đi → HIỆN TẠI khác đi: vế chính would + V (Tập 4 Ngày 19 mục 2)." },
          { q: "2. ___ it not for tourism, the island would have no economy at all. (MỘT từ)", answers: ["Were"], hint: "Đảo ngữ thay if của hiện tại không thật: Were it not for… (Tập 4 Ngày 19 mục 6)." },
          { q: "3. The committee recommended that the rule ___ (apply) to every member, including the chair.", answers: ["apply", "should apply"], hint: "Mandative subjunctive: động từ nguyên mẫu trần, KHÔNG chia applies (Tập 4 Ngày 27 mục 2)." },
          { q: "4. It is high time the government ___ (take) the problem seriously.", answers: ["took"], hint: "It is (high) time + S + V-ed: quá khứ không thật (Tập 4 Ngày 27 mục 3)." },
          { q: "5. Prices rose sharply; ___, demand did not fall. (MỘT từ nối)", answers: ["however", "nevertheless", "nonetheless"], hint: "Hai mệnh đề độc lập nối bằng however ⇒ chấm phẩy trước, phẩy sau: ; however, (Tập 4 Ngày 21 · Tập 5 Ngày 9 mục 8)." },
          { q: "6. ___ (provide) that the funding continues, the project will finish on time.", answers: ["Provided", "Providing"], hint: "Provided / Providing that = với điều kiện là (Tập 4 Ngày 19 mục 5)." },
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vòng 3 khác gì — ba câu hỏi band 8 đặt cho mỗi câu giả định" },
      {
        t: "p",
        text: "Ở Tập 4, câu điều kiện hỗn hợp và câu giả định là ==thứ để có==: viết được một câu là đã thêm độ đa dạng cho GRA 7. Ở band 8, giám khảo không đếm cấu trúc; họ xem cấu trúc đó có **đúng thời gian**, **đúng mức chắc chắn** và **đúng dấu câu** hay không. Một câu hỗn hợp sai thì của would làm hỏng cả luận điểm, vì người đọc không còn biết bạn nói về quá khứ hay hiện tại.",
      },
      {
        t: "table",
        head: ["Câu hỏi", "Band 7 (ước tính)", "Band 8 (ước tính)"],
        rows: [
          ["① Việc giả định xảy ra **lúc nào**, hệ quả rơi vào **lúc nào**?", "chỉ biết loại 2 và loại 3, ép mọi ý vào một trong hai", "chọn đúng hướng: quá khứ → nay · nay → quá khứ · quá khứ → tương lai; có **now / today / still** để chỉ mốc"],
          ["② Hệ quả **chắc** đến đâu?", "would ở mọi câu", "would (chắc) · might / could (có thể) · would probably / would almost certainly — **mức chắc khớp bằng chứng**"],
          ["③ Có cần **if** không?", "If… ở mọi câu giả định", "But for… · Without… · Otherwise… · A ban would… — giả định nằm trong danh từ, cụm giới từ, trạng từ"],
          ["Đề xuất chính sách", "The government should… lặp ba lần", "một câu giả định đúng chỗ: **It is essential that every landlord be required to…**"],
          ["Dấu câu ở câu dài", "phẩy giữa chủ ngữ và động từ, however, nối hai câu", "dấu câu đi theo **cấu trúc**: ; however, · cặp phẩy quanh chêm · dấu hai chấm sau mệnh đề đủ"],
        ],
        caption: "Cùng loại câu — hai mức kiểm soát",
      },
      { t: "rule", formula: "Thời gian giả định → thời gian hệ quả → mức chắc → (có cần if?) → dấu câu", vi: "Năm câu hỏi kiểm cho mọi câu giả định trước khi viết tiếp." },

      /* ── 2 ── */
      { t: "h", text: "2. Điều kiện hỗn hợp band 8 — bốn hướng thời gian" },
      {
        t: "p",
        text: "Câu điều kiện hỗn hợp tách **vế if** và **vế chính** ra hai mốc thời gian khác nhau. Ở Tập 4 bạn đã học hai hướng chính. Band 8 thêm hai hướng ít gặp hơn và ==dạng tiếp diễn== để nói về một tình trạng đang kéo dài — rất hợp với đề Task 2 kiểu “vấn đề hôm nay là hậu quả của quyết định hôm qua”.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "If S had V3 (quá khứ), S would / might + V (nay)", vi: "Quá khứ khác đi → hiện tại khác đi. Thêm now / today / still để mốc rõ.", examples: [{ en: "If cities had invested in public transport decades ago, far fewer people would depend on cars today.", vi: "Nếu các thành phố đầu tư vào giao thông công cộng từ vài thập kỷ trước, hôm nay đã ít người phụ thuộc vào ô tô hơn nhiều." }] },
          { formula: "If S had V3, S would now be V-ing", vi: "Dạng tiếp diễn: hệ quả là một tình trạng ĐANG diễn ra.", examples: [{ en: "Had the warnings been heeded, we would not now be facing such severe water shortages.", vi: "Nếu những cảnh báo được lắng nghe, giờ đây chúng ta đã không phải đối mặt với tình trạng thiếu nước nghiêm trọng như vậy." }] },
          { formula: "If S V-ed / were (nay, lâu dài), S would have V3 (quá khứ)", vi: "Một đặc điểm thường trực khác đi → một việc quá khứ đã khác đi.", examples: [{ en: "If the region were less dependent on a single industry, the closure of the factory would not have been so devastating.", vi: "Nếu vùng này không quá phụ thuộc vào một ngành, việc nhà máy đóng cửa đã không tàn khốc đến thế." }] },
          { formula: "If S had V3 (quá khứ), S would + V (tương lai, có mốc)", vi: "Quá khứ khác đi → một việc SẮP tới khác đi. Cần mốc tương lai (next year, by 2030).", examples: [{ en: "If the bridge had been approved last spring, it would open to traffic next year.", vi: "Nếu cây cầu được duyệt từ mùa xuân năm ngoái, nó đã thông xe vào năm sau." }] },
        ],
      },
      {
        t: "table",
        head: ["Mức chắc chắn", "Vế chính", "Ví dụ"],
        rows: [
          ["Gần như chắc", "would almost certainly + V / have V3", "Without the subsidy, the service would almost certainly have closed."],
          ["Khá chắc", "would probably / would be likely to + V", "A higher fuel tax would probably reduce traffic in city centres."],
          ["Có thể", "might / could + V / have V3", "Earlier screening might have saved thousands of lives."],
          ["Có khả năng làm được", "could + V / have V3", "If the data were shared, researchers could identify risks much sooner."],
        ],
        caption: "would không phải mặc định — chọn theo độ mạnh của bằng chứng (nối Tập 5 Ngày 1 · hedging)",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — năm lỗi người band 7 vẫn mắc ở câu hỗn hợp",
        items: [
          "~~If the government would have acted earlier, …~~ → If the government **had acted** earlier, … Không có would trong vế if (trừ nghĩa “sẵn lòng”: If you would follow me, …).",
          "~~If we had invested in renewables, we would have had cheaper electricity now.~~ → we **would have** cheaper electricity **now**. Có now thì vế chính là would + V.",
          "~~If it wasn't for the internet, …~~ trong bài viết → If it **were not** for / **Were it not for** the internet, … (was chấp nhận khi nói thân mật, were an toàn trong văn trang trọng).",
          "~~Unless the warnings had been ignored, the flood would not have happened.~~ Unless gần như không dùng cho chuyện trái với quá khứ. → **If** the warnings **had not been** ignored, …",
          "Lẫn hai mốc: ~~If he had studied harder, he would pass the exam last week.~~ → would **have passed** (kỳ thi đã qua). Hỏi lại câu ① ở mục 1: hệ quả rơi vào lúc nào?",
        ],
      },
      { t: "rule", formula: "If S had V3 → S would (now) V / would now be V-ing   ·   If S V-ed / were → S would have V3", vi: "Vế if giữ thời gian của điều giả định, vế chính giữ thời gian của hệ quả; would / might / could theo mức chắc." },
      {
        t: "quiz",
        id: "t5d19-hon-hop-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — điều kiện hỗn hợp (4 câu)",
        grammar: "If S had V3, S would (now) V · would now be V-ing · If S were / V-ed, S would have V3 · might / could",
        items: [
          { q: "Nếu các nhà máy bị kiểm soát chặt hơn từ những năm 1990, con sông bây giờ đã sạch hơn nhiều.", answers: ["If factories had been more tightly controlled in the 1990s, the river would be much cleaner now.", "If factories had been regulated more strictly in the 1990s, the river would be much cleaner now.", "If factories had been more strictly controlled in the 1990s, the river would now be much cleaner."], hint: "be more tightly controlled · much cleaner now" },
          { q: "Nếu chính phủ hành động sớm hơn, giờ đây chúng ta đã không phải đối phó với khủng hoảng nhà ở này.", answers: ["If the government had acted earlier, we would not now be dealing with this housing crisis.", "Had the government acted earlier, we would not now be dealing with this housing crisis.", "If the government had acted sooner, we would not now be dealing with this housing crisis.", "If the government had acted earlier, we wouldn't be dealing with this housing crisis now."], hint: "act earlier · would not now be dealing with" },
          { q: "Nếu thị trấn này không quá phụ thuộc vào du lịch, đại dịch đã không gây hại cho nó nặng nề như vậy.", answers: ["If the town were not so dependent on tourism, the pandemic would not have harmed it so badly.", "If the town were less dependent on tourism, the pandemic would not have harmed it so badly.", "If this town were not so dependent on tourism, the pandemic would not have hurt it so badly.", "If the town were not so dependent on tourism, the pandemic would not have damaged it so badly."], hint: "be dependent on · harm sth so badly" },
          { q: "Việc sàng lọc sớm hơn có thể đã cứu được hàng nghìn người.", answers: ["Earlier screening might have saved thousands of people.", "Earlier screening could have saved thousands of people.", "Earlier screening might have saved thousands of lives.", "Earlier screening could have saved thousands of lives."], hint: "might / could have V3 — giả định nằm trong chủ ngữ, không cần if" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Điều kiện ngầm — giả định không có chữ if" },
      {
        t: "p",
        text: "Người viết band 8 hiếm khi dùng quá hai chữ if trong một bài. Phần lớn giả định của họ ==nằm trong một cụm khác==: một cụm giới từ (Without…, But for…), một trạng từ nối (Otherwise…), một chủ ngữ là danh từ hoặc to V (A ban would…, To abandon the scheme now would…). Đây là chỗ GRA 8 và CC 8 gặp nhau: câu ngắn hơn, nối với câu trước chặt hơn.",
      },
      {
        t: "table",
        head: ["Khuôn", "Nghĩa", "Ví dụ Task 2 / Part 3"],
        rows: [
          ["**But for / Without + N**, S would (have) V3", "nếu không có…", "But for the vaccine, the disease would still be killing millions every year."],
          ["…; **otherwise**, S would (have) V3", "nếu không thì…", "The rules were relaxed in 2015; otherwise, the company would have moved abroad."],
          ["**N** (chủ ngữ) + would / could", "giả định nằm trong danh từ", "A complete ban would simply push the trade underground."],
          ["**To V** (chủ ngữ) + would", "việc làm X sẽ…", "To abandon the scheme now would waste ten years of work."],
          ["**Supposing / Assuming (that)** + S V", "giả sử", "Assuming that funding stays the same, the waiting list will double."],
          ["**In the event of + N / In the event that** S V", "trong trường hợp (trang trọng)", "In the event of a power cut, the backup system starts automatically."],
          ["**Had / Were / Should** + S + … (đảo ngữ)", "if trang trọng (Tập 4 Ngày 19)", "Should the policy fail, the cost will fall on taxpayers."],
        ],
        caption: "Bảy cách giả định mà không viết If",
      },
      {
        t: "note",
        title: "⚠️ Hay sai — ba chỗ người Việt dịch thẳng “nếu không có”",
        items: [
          "~~Without the internet, we cannot work from home.~~ Nếu đang tưởng tượng một thế giới không có internet ⇒ **could not**. Cannot chỉ đúng khi bạn nói về một sự thật: không có internet (thật) thì không làm được.",
          "~~But for the government helps, many farmers would go bankrupt.~~ But for + **danh từ**, không + mệnh đề → But for **government support**, …",
          "~~Otherwise, they will have closed.~~ Otherwise trỏ về quá khứ trái thật ⇒ **would have closed**. Sau otherwise, thì động từ đi theo thời gian của việc giả định.",
        ],
      },
      { t: "rule", formula: "But for / Without + N, S would (have) V3   ·   …; otherwise, S would (have) V3   ·   N / To V + would V", vi: "Khi đã có một if trong đoạn, chuyển giả định sau vào cụm danh từ, cụm giới từ hoặc otherwise." },
      {
        t: "quiz",
        id: "t5d19-ngam-dien",
        kind: "fill",
        title: "Điều kiện ngầm — điền MỘT từ hoặc dạng đúng của động từ trong ngoặc (6 câu)",
        items: [
          { q: "1. ___ for the volunteers, the festival would have been cancelled years ago. (MỘT từ)", answers: ["But"], hint: "But for + N = nếu không có." },
          { q: "2. The bridge was strengthened in 2010; ___, it would not have survived the earthquake. (MỘT từ)", answers: ["otherwise"], hint: "otherwise = nếu không (làm vậy) thì." },
          { q: "3. A four-day week ___ (probably / reduce) burnout, but it would not suit every industry.", answers: ["would probably reduce"], hint: "Chủ ngữ là danh từ mang giả định ⇒ would + probably + V." },
          { q: "4. Without proper ventilation, the classrooms ___ (become) unbearable in summer. (giả định hiện tại)", answers: ["would become"], hint: "Without + N tưởng tượng ⇒ would + V." },
          { q: "5. To cut the budget at this stage ___ (undo) everything the programme has achieved.", answers: ["would undo"], hint: "To V làm chủ ngữ mang giả định ⇒ would + V." },
          { q: "6. ___ that demand keeps rising, the city will need a second airport by 2040. (MỘT từ)", answers: ["Assuming", "Supposing"], hint: "Assuming / Supposing (that) = giả sử. Thì sau nó: hiện tại vì đây là giả định có thật." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Thức giả định — câu đề xuất, câu ước, và ba cụm cố định" },
      {
        t: "p",
        text: "Thức giả định (subjunctive) không có đuôi chia: ==that every child **be** taught==, không phải is taught; ==that she **attend**==, không phải attends. Trong Task 2, nó sống ở đúng một chỗ: **câu đề xuất** của thân bài giải pháp hoặc kết bài. Một câu là đủ. Hai câu trở lên trong một bài làm văn bản nặng như văn bản pháp luật.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "S recommend / insist / propose / demand that S (not) V", vi: "Sau động từ đề xuất: V nguyên mẫu trần cho mọi chủ ngữ; phủ định là not + V (không don't).", examples: [{ en: "The report recommends that every new building be fitted with solar panels.", vi: "Bản báo cáo đề xuất rằng mọi toà nhà mới đều phải được lắp tấm pin mặt trời." }] },
          { formula: "It is essential / vital / imperative that S (not) V", vi: "Sau tính từ chỉ sự cần thiết.", examples: [{ en: "It is vital that patients not be discharged before a follow-up appointment has been arranged.", vi: "Điều sống còn là bệnh nhân không được cho xuất viện trước khi lịch tái khám được sắp xếp." }] },
          { formula: "N (insistence / requirement / recommendation) that S V", vi: "Sau danh từ cùng họ — kiểu câu danh hoá rất hợp văn học thuật.", examples: [{ en: "The requirement that every applicant have a degree excludes many talented people.", vi: "Yêu cầu mọi ứng viên phải có bằng đại học loại ra nhiều người tài." }] },
          { formula: "It is (high) time S V-ed · would rather S V-ed · as if / as though S were", vi: "Quá khứ không thật — nói về HIỆN TẠI.", examples: [{ en: "It is high time that cities treated cycling as transport rather than leisure.", vi: "Đã đến lúc các thành phố coi đạp xe là phương tiện đi lại chứ không phải trò giải trí." }] },
        ],
      },
      {
        t: "table",
        head: ["Cụm cố định", "Nghĩa", "Dùng ở đâu"],
        rows: [
          ["**Be that as it may**, …", "dù sao đi nữa (nhận rồi gạt sang bên)", "Writing + Speaking trang trọng; đầu câu sau một ý đối lập"],
          ["**Suffice it to say (that)** …", "chỉ cần nói rằng…", "Speaking Part 3, kết một ví dụ dài; Writing dè dặt"],
          ["**If need be**, …", "nếu cần", "Writing + Speaking; chen giữa câu"],
          ["**Come what may**, …", "dù chuyện gì xảy ra", "chủ yếu khi nói, kể chuyện"],
          ["**Far be it from me to** V, but …", "tôi không dám…, nhưng…", "chỉ khi nói, giọng hơi đùa; KHÔNG dùng trong Task 2"],
        ],
        caption: "Năm cụm giả định đông cứng — mỗi bài tối đa một cụm",
      },
      {
        t: "note",
        title: "⚠️ Sai kinh điển của người Việt ở câu giả định",
        items: [
          "~~The doctor suggested that he takes a break.~~ → he **take** (Mỹ, trang trọng) hoặc he **should take** (Anh). ~~suggested him to take~~ luôn sai: suggest không đi với tân ngữ + to V.",
          "~~It is essential that the law is enforced.~~ Không sai hẳn trong tiếng Anh-Anh thân mật, nhưng trong Task 2 band 8 hãy viết **be enforced** hoặc **should be enforced**.",
          "~~They demanded that the company doesn't raise prices.~~ → that the company **not raise** prices. Phủ định của giả định là **not + V**.",
          "~~I wish I can speak French.~~ → I wish I **could** speak French. Ước về hiện tại dùng quá khứ; ước về quá khứ dùng had V3.",
        ],
      },
      { t: "rule", formula: "recommend / essential / insistence + that + S + (not) V   ·   It is high time S V-ed", vi: "Một câu giả định cho phần đề xuất của bài; V nguyên mẫu trần cho mọi chủ ngữ, phủ định là not + V." },
      {
        t: "quiz",
        id: "t5d19-gia-dinh-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — thức giả định (4 câu)",
        grammar: "recommend / insist / essential that S (not) V · It is high time S V-ed · Be that as it may",
        items: [
          { q: "Ủy ban đề xuất rằng mọi trường học phải được kiểm tra hằng năm.", answers: ["The committee recommended that every school be inspected every year.", "The committee recommended that every school be inspected annually.", "The committee recommended that every school should be inspected every year.", "The committee recommends that every school be inspected every year."], hint: "recommend that + S + be V3" },
          { q: "Điều thiết yếu là trẻ em không bị bỏ lại một mình với màn hình hàng giờ liền.", answers: ["It is essential that children not be left alone with screens for hours.", "It is essential that children not be left alone with screens for hours on end.", "It is essential that children should not be left alone with screens for hours.", "It is essential that children not be left alone in front of screens for hours."], hint: "It is essential that + S + not be V3 · for hours (on end)" },
          { q: "Đã đến lúc chúng ta ngừng coi rác là chuyện của riêng người khác.", answers: ["It is high time we stopped treating waste as someone else's problem.", "It's high time we stopped treating waste as somebody else's problem.", "It is high time that we stopped treating waste as someone else's problem.", "It is time we stopped treating waste as someone else's problem."], hint: "It is high time + S + V-ed · treat sth as" },
          { q: "Dù sao đi nữa, phần lớn người dân vẫn ủng hộ kế hoạch này.", answers: ["Be that as it may, most residents still support the plan.", "Be that as it may, most people still support the plan.", "Be that as it may, the majority of residents still support the plan.", "Be that as it may, most residents still support this plan."], hint: "Be that as it may — đầu câu, có phẩy" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Dấu câu vòng 3 — tám quy tắc làm rõ cấu trúc" },
      {
        t: "p",
        text: "Dấu câu ở band 8 không phải phép lịch sự; nó là ==bản đồ của câu==. Ngày 9 bạn đã học ba dấu giữ cho câu dài vẫn rõ. Hôm nay gom đủ tám quy tắc mà giám khảo thấy sai nhiều nhất ở bài band 7, trong đó hai quy tắc cuối riêng người Việt hay vấp vì tiếng Việt làm ngược lại.",
      },
      {
        t: "table",
        head: ["Quy tắc", "Sai", "Đúng"],
        rows: [
          ["① Không phẩy giữa **chủ ngữ dài** và động từ", "~~The number of people who work from home at least once a week, has doubled.~~", "The number of people who work from home at least once a week **has** doubled."],
          ["② Mệnh đề If / When / Although **đứng đầu**: có phẩy; đứng sau: thường không", "~~Prices will fall if, demand drops.~~", "If demand drops**,** prices will fall. · Prices will fall if demand drops."],
          ["③ **however** nối hai mệnh đề: **; however,** — giữa câu: cặp phẩy", "~~Costs rose, however demand stayed high.~~", "Costs rose**; however,** demand stayed high. · Demand**, however,** stayed high."],
          ["④ Mệnh đề quan hệ **không xác định**: cặp phẩy, không dùng that", "~~My brother that lives in Hue is a doctor.~~ (khi bạn chỉ có một anh trai)", "My brother**, who** lives in Hue**,** is a doctor."],
          ["⑤ Dấu hai chấm **sau một mệnh đề đủ**", "~~The main causes are: cost, distance and time.~~", "There are three main causes**:** cost, distance and time."],
          ["⑥ **Cặp gạch ngang** cho phần chêm — 0–1 lần mỗi bài", "~~The policy — which was popular, failed.~~ (mở gạch, đóng phẩy)", "The policy **—** popular as it was **—** failed within a year."],
          ["⑦ **Gạch nối** tính từ ghép đứng TRƯỚC danh từ; không gạch sau -ly", "~~a long term plan · in the long-term · a highly-paid job~~", "a **long-term** plan · in the **long term** · a **highly paid** job"],
          ["⑧ **Số và sở hữu** kiểu Anh", "~~1.500 people · 2,5% · the 1990's · it's own · the countries policies~~", "**1,500** people · **2.5%** · the **1990s** · **its** own · the **countries'** policies"],
        ],
        caption: "Tám quy tắc — ① ⑦ ⑧ là ba lỗi người Việt mắc nhiều nhất",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — vì sao ⑧ là bẫy riêng của người Việt",
        items: [
          "Tiếng Việt viết **1.500** (nghìn) và **2,5** (thập phân). Tiếng Anh làm ngược lại: **1,500** và **2.5**. Trong Task 1, viết 2,5 million là sai số liệu chứ không chỉ sai dấu.",
          "Sở hữu của danh từ số nhiều có s: **the countries' policies** (nhiều nước), **the country's policies** (một nước). Đọc lại mọi chữ countries / companies / parents trong bài.",
          "**its** = của nó; **it's** = it is. Bài viết học thuật không dùng it's, nên thấy dấu ' cạnh it là gần như chắc sai.",
        ],
      },
      { t: "rule", formula: "S dài + V (không phẩy)  ·  If…, S V  ·  S V; however, S V  ·  mệnh đề đủ: a, b and c  ·  long-term N  ·  1,500 / 2.5", vi: "Đặt dấu câu theo cấu trúc của câu, không theo chỗ bạn ngừng thở." },
      {
        t: "mcq",
        id: "t5d19-dau-cau-chon",
        title: "Câu nào đúng dấu câu? (8 câu)",
        items: [
          { q: "1. Chọn câu đúng.", options: ["The proportion of households that own a car, fell slightly.", "The proportion of households that own a car fell slightly.", "The proportion of households, that own a car fell slightly."], correct: 1, why: "Quy tắc ①: chủ ngữ dài “The proportion of households that own a car” không tách khỏi động từ fell bằng dấu phẩy." },
          { q: "2. Chọn câu đúng.", options: ["Fees were introduced in 2012; however, enrolment continued to rise.", "Fees were introduced in 2012, however, enrolment continued to rise.", "Fees were introduced in 2012 however enrolment continued to rise."], correct: 0, why: "Quy tắc ③: hai mệnh đề độc lập + however ⇒ ; however, — dùng phẩy là lỗi comma splice." },
          { q: "3. Chọn câu đúng.", options: ["There are two reasons for this: cost and convenience.", "The reasons for this are: cost and convenience.", "The reasons for this include: cost and convenience."], correct: 0, why: "Quy tắc ⑤: dấu hai chấm đứng sau mệnh đề ĐỦ (There are two reasons for this). Sau are / include thì không dùng dấu hai chấm." },
          { q: "4. Trong Task 1, số “hai phẩy năm triệu” viết đúng là:", options: ["2,5 million", "2.5 million", "2.5 millions"], correct: 1, why: "Quy tắc ⑧: thập phân dùng dấu chấm; million sau số không thêm s." },
          { q: "5. Chọn câu đúng.", options: ["This is a long-term problem that needs a long-term solution.", "This is a long term problem that needs a long-term solution.", "In the long-term, this problem needs a solution."], correct: 0, why: "Quy tắc ⑦: long-term có gạch nối khi đứng trước danh từ; “in the long term” (danh từ) không gạch." },
          { q: "6. Bạn chỉ có MỘT người mẹ. Chọn câu đúng.", options: ["My mother who is a nurse works night shifts.", "My mother, that is a nurse, works night shifts.", "My mother, who is a nurse, works night shifts."], correct: 2, why: "Quy tắc ④: mệnh đề chỉ thêm thông tin về một người duy nhất ⇒ không xác định ⇒ cặp phẩy + who, không that." },
          { q: "7. Chọn câu đúng.", options: ["Each of the three companies' profits rose.", "The three companies' profits all rose.", "The three company's profits all rose."], correct: 1, why: "Quy tắc ⑧: sở hữu của danh từ số nhiều đã có s ⇒ companies'. Câu A sai ngữ pháp (Each of … profits)." },
          { q: "8. Chọn câu đúng.", options: ["If the scheme is extended, more families will benefit.", "If the scheme is extended more families, will benefit.", "More families will benefit, if, the scheme is extended."], correct: 0, why: "Quy tắc ②: mệnh đề If đứng đầu ⇒ một dấu phẩy ở ranh giới hai mệnh đề." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Ba thứ trong một đoạn — đoạn đề xuất band 7 và band 8 đặt cạnh nhau" },
      {
        t: "p",
        text: "Đề: “Many cities suffer from severe air pollution. What are the causes, and what measures could be taken?” Dưới đây là đoạn **giải pháp** của hai bài. Cùng ý, cùng độ dài gần bằng nhau. Đọc, rồi xem bảng so sánh.",
      },
      {
        t: "passage",
        title: "Đoạn giải pháp band 7 (ước tính) — 110 từ",
        paras: [
          { text: "The government should take some measures to solve this problem. Firstly, the government should ban old cars from city centres. If they did this ten years ago, the air would be cleaner now. Secondly, the government should invest more money in public transport, however this is very expensive. If there is no good public transport, people will continue to use their cars. Finally, the number of factories in the city, should be reduced. It is important that factories are moved to rural areas. In conclusion, if the government would follow these measures, the problem of air pollution would be solved and people would have a better life in the future." },
        ],
      },
      {
        t: "passage",
        title: "Đoạn giải pháp band 8 (ước tính) — 116 từ",
        paras: [
          { text: "The most effective measures would target the vehicles responsible for most emissions. A low-emission zone, charging older diesel vehicles to enter the centre, would cut pollution quickly; had such zones been introduced a decade ago, many cities would not now be breaching safe limits on most winter days. Charges alone, however, would merely penalise those with no alternative. It is therefore essential that the revenue be spent on frequent, affordable buses, since without a credible alternative, drivers would simply pay and continue as before. Industrial emissions require a different approach: rather than relocating factories, which would only move the problem, governments could tie permits to measurable reductions, imposing fines on firms that fail to meet them." },
        ],
      },
      {
        t: "table",
        head: ["Điểm", "Band 7", "Band 8"],
        rows: [
          ["Điều kiện hỗn hợp", "If they **did** this ten years ago (sai thì: quá khứ phải là had done)", "**had such zones been introduced** a decade ago … would not **now be** breaching — hỗn hợp + tiếp diễn, đúng mốc"],
          ["Giả định ngầm", "If there is no good public transport… (lặp if)", "**without** a credible alternative, drivers **would** simply pay · A low-emission zone… **would** cut — giả định nằm trong cụm"],
          ["Thức giả định", "It is important that factories **are** moved", "It is essential that the revenue **be** spent — đúng một câu"],
          ["Dấu câu", "phẩy trước should (①), however nối hai câu bằng phẩy (③)", "however đặt giữa câu với cặp phẩy: “Charges alone**, however,** would…” (③) · dấu hai chấm sau mệnh đề đủ (⑤)"],
          ["Mức chắc", "would ở mọi câu, kể cả kết “would be solved”", "would (chắc) · **could** tie permits (có thể) · merely / simply giới hạn"],
          ["Lỗi khác", "if… **would** follow (sai) · từ nối lộ Firstly / Secondly / Finally", "từ nối ẩn: Charges alone · Industrial emissions require a different approach"],
        ],
        caption: "Cùng ba công cụ — khác ở thời gian, mức chắc và dấu câu",
      },
      {
        t: "note",
        title: "💡 Mẹo — kiểm đoạn giải pháp trong 60 giây",
        items: [
          "Gạch dưới mọi **would / could / might**. Mỗi cái có trả lời được “nếu cái gì?” không? Nếu câu trả lời nằm trong câu đó (without…, a ban…, had…) là tốt.",
          "Đếm **if**: quá hai trong một đoạn ⇒ đổi một cái sang But for / Without / otherwise / chủ ngữ danh từ.",
          "Tìm câu đề xuất có **that**: động từ sau nó đã ở dạng nguyên mẫu trần chưa (be spent, not be discharged)?",
          "Lướt dấu phẩy: có cái nào nằm giữa chủ ngữ và động từ không? Có however nào bị kẹp giữa hai phẩy mà nối hai câu không?",
        ],
      },
      { t: "rule", formula: "N / without N + would V  ·  had S V3 … would now be V-ing  ·  It is essential that S be V3  ·  S, however, V", vi: "Một đoạn giải pháp band 8: mỗi công cụ một lần, đúng thời gian, đúng dấu." },

      /* ── 7 ── */
      { t: "h", text: "7. Kiểm tra cuối bài (14 câu)" },
      {
        t: "mcq",
        id: "t5d19-np-chon",
        title: "Chọn phương án tốt nhất cho một bài viết band 8 (8 câu)",
        items: [
          { q: "1. If the dam had not been built, the valley ___ a thriving farming area today.", options: ["would have been", "would still be", "will still be", "had still been"], correct: 1, why: "Quá khứ khác đi (had not been built) → hiện tại khác đi (today) ⇒ would + V; still nhấn tình trạng kéo dài." },
          { q: "2. If the city were not built on a flood plain, last year's storm ___ so much damage.", options: ["would not cause", "will not have caused", "would not have caused", "did not cause"], correct: 2, why: "Đặc điểm thường trực (were not built on) → việc quá khứ (last year's storm) ⇒ would have V3." },
          { q: "3. ___ the subsidy, most rural bus routes would have disappeared.", options: ["But for", "Unless", "If not", "Despite"], correct: 0, why: "But for + N = nếu không có. Unless / If not cần mệnh đề; Despite sai nghĩa." },
          { q: "4. The panel insisted that the results ___ before the election.", options: ["are not published", "not be published", "do not publish", "were not publishing"], correct: 1, why: "insist that + S + not + V (bị động: not be published)." },
          { q: "5. Câu nào dùng mức chắc chắn hợp với bằng chứng “một số nghiên cứu nhỏ cho thấy”?", options: ["Smaller classes would definitely improve results.", "Smaller classes might improve results, at least for younger pupils.", "Smaller classes will improve results.", "Smaller classes improve results."], correct: 1, why: "Bằng chứng yếu ⇒ might + giới hạn phạm vi (at least for…). Các phương án kia khẳng định quá mạnh." },
          { q: "6. Câu nào đúng?", options: ["It is high time governments take this seriously.", "It is high time governments took this seriously.", "It is high time governments would take this seriously.", "It is high time for governments taking this seriously."], correct: 1, why: "It is high time + S + V-ed (quá khứ không thật, nghĩa hiện tại)." },
          { q: "7. Câu nào đúng dấu câu?", options: ["The scheme, which began in 2018 has been extended.", "The scheme which began in 2018, has been extended.", "The scheme, which began in 2018, has been extended.", "The scheme which, began in 2018 has been extended."], correct: 2, why: "Mệnh đề không xác định phải có ĐỦ cặp phẩy (mở và đóng)." },
          { q: "8. Đoạn đã có hai câu If. Câu thứ ba nên viết thế nào?", options: ["If there were no tax, people would buy more.", "Without the tax, consumption would almost certainly rise.", "If there is no tax, people will buy more.", "If the tax did not exist, people would have bought more."], correct: 1, why: "Chuyển giả định vào cụm Without + N, thêm mức chắc (almost certainly). D sai thời gian." },
        ],
      },
      {
        t: "quiz",
        id: "t5d19-np-sua",
        kind: "fill",
        title: "Mỗi câu một lỗi — gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "1. If the company [would have listened] to its customers, it would still exist.", answers: ["had listened"], hint: "Không có would trong vế if: had V3 cho quá khứ trái thật." },
          { q: "2. If we had started recycling earlier, landfills [would have been] less full now.", answers: ["would be"], hint: "Có now ⇒ hệ quả ở hiện tại: would + V." },
          { q: "3. The inspector recommended that the school [improves] its safety procedures.", answers: ["improve", "should improve"], hint: "recommend that + S + V nguyên mẫu trần." },
          { q: "4. They demanded that the factory [doesn't reopen] until repairs were complete.", answers: ["not reopen", "should not reopen"], hint: "Phủ định của giả định: not + V." },
          { q: "5. Without the new law, many more workers [cannot] claim compensation.", answers: ["could not", "couldn't", "would not be able to"], hint: "Tưởng tượng không có luật mới ⇒ could not." },
          { q: "6. The decision was taken in [the 1990's], before the internet became widespread.", answers: ["the 1990s"], hint: "Thập niên viết 1990s, không có dấu '." },
        ],
      },
      {
        t: "note",
        title: "Sau bài này — việc phải làm với bài viết của bạn",
        items: [
          "Mở bài Task 2 gần nhất (Ngày 16 · 14 · 10). Gạch mọi would / could / might, ghi “nếu cái gì?” bên cạnh. Câu nào không trả lời được là câu cần viết lại.",
          "Tìm một câu đề xuất trong bài, viết lại thành một câu giả định (It is essential that… be…). Chỉ một câu.",
          "Chép ba lỗi dấu câu bạn hay mắc nhất (theo số ① – ⑧) vào Sổ lỗi; từ nay thêm một lượt “lướt dấu phẩy” vào bảng tự soát 6 lượt.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d19-doc",
    kind: "reading",
    title: "Đọc: Reading đủ 3 passage · 40 câu · 55 phút — lần 2 của Tập 5 (mục tiêu 34–35/40, sửa đúng nhãn lỗi của Ngày 13)",
    goal: "Làm trọn bài Reading Academic thứ hai của Tập 5 (khoảng 2.850 từ, 40 câu, tám dạng câu hỏi, Passage 3 là văn lập luận triết học) trong 55 phút theo nhịp 15 – 18 – 20 + 2 phút soát, đạt ít nhất 34/40 (≈ band 7.5–8.0), và cho thấy hai nhãn lỗi nhiều nhất của Ngày 13 đã giảm — để Ngày 27 lên 35+ một cách ổn định.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Lần 2 trong ba lần của Tập 5 (Ngày 13 · **19** · 27). Mục tiêu hôm nay: ==34/40 trở lên==, và quan trọng hơn: **nhãn lỗi nhiều nhất của Ngày 13 phải giảm**.",
          "Ba đề tài khác hẳn nhau: lịch sử kỹ thuật (đồ hộp ra đời) · khoa học còn tranh cãi (mạng nấm nối các cây trong rừng) · triết học (thí nghiệm tưởng tượng dạy ta được gì).",
          "Tám dạng: Short answer · TFNG · Flow-chart · Matching headings · Summary · MCQ · YNNG · Sentence endings. Bốn dạng sau khác Ngày 13 — đây là chủ ý, để đề hôm nay đo thứ Ngày 13 chưa đo.",
          "Nhịp: ==15 – 18 – 20 + 2 phút soát==. Đọc mỗi passage MỘT lần kỹ (Tập 5 Ngày 1), không quay lại đọc lại cả bài.",
          "Bẫy band 8 hôm nay: **khả năng ≠ khẳng định** (might have travelled), **người được thuật ≠ người viết** (Norton, Brown), **chi tiết của đoạn ≠ ý chính của đoạn** (Headings).",
          "Sau khi chấm: ghi nhãn K / P / S / C như Ngày 13, so hai lần, rồi soi Passage 3 bằng ngữ pháp Bài 1.",
        ],
      },
      { t: "h", text: "1. Trước khi bấm giờ — kế hoạch 55 phút, lần 2" },
      {
        t: "table",
        head: ["Mốc", "Việc", "Nếu trễ"],
        rows: [
          ["0:00 – 15:00", "Passage 1: Short answer → TFNG → Flow-chart (câu hỏi đi theo thứ tự bài)", "15:00 mà chưa xong: đoán, đánh dấu, sang Passage 2"],
          ["15:00 – 33:00", "Passage 2: đọc Headings TRƯỚC, đọc từng đoạn rồi chọn ngay; Summary và MCQ sau", "Headings kẹt 2 đoạn: để trống, làm Summary rồi quay lại"],
          ["33:00 – 53:00", "Passage 3: MCQ → YNNG → Sentence endings", "Sentence endings: loại đuôi sai ngữ pháp trước, rồi mới xét nghĩa"],
          ["53:00 – 55:00", "Soát: câu trống, chính tả, số từ, chữ cái viết đúng kiểu (iv chứ không phải 4)", "Không đọc lại passage nào"],
        ],
        caption: "Cùng nhịp Ngày 13 — lần này ghi lại giờ thật ở mỗi mốc",
      },
      {
        t: "note",
        title: "📌 Từ Ngày 13 sang hôm nay — sửa đúng chỗ",
        items: [
          "Ngày 13 nhãn **K** (không tìm ra chỗ) nhiều nhất ⇒ hôm nay ghi lề một chữ cho MỖI đoạn ngay khi đọc xong đoạn đó. Headings 14–20 sẽ cho bạn biết cách này có hiệu quả không.",
          "Ngày 13 nhãn **S** (suy quá mức / nhầm chủ thể) nhiều nhất ⇒ Passage 3 hôm nay thuật ý của ba người (Norton, Brown, các nhà triết học thực nghiệm) bên cạnh ý người viết. Khoanh chữ “seems to me”, “I”, “too hasty” — đó là giọng người viết.",
          "Ngày 13 nhãn **C** (chính tả / quá số từ) ⇒ mỗi dạng hôm nay có giới hạn số từ KHÁC nhau. Đọc lệnh, khoanh con số.",
        ],
      },
      { t: "p", text: "Chuẩn bị đồng hồ đếm ngược **55 phút**. Không tra từ điển. Không mở 💡 hay xem “why” trước khi hết giờ. Bấm giờ rồi bắt đầu." },

      /* ───────────── PASSAGE 1 ───────────── */
      { t: "h", text: "READING PASSAGE 1 — Questions 1–13 (15 phút)" },
      {
        t: "passage",
        title: "Food That Could Wait",
        intro: "You should spend about 15 minutes on Questions 1–13, which are based on Reading Passage 1.",
        paras: [
          { text: "For most of human history, keeping food meant changing it. Meat was dried, salted or smoked; vegetables were pickled in vinegar; fruit was boiled with sugar until it would last through the winter. Each method worked, but each altered the taste and texture of what it preserved, and none could be relied upon during a long sea voyage or a military campaign. Armies in particular were limited by what they could carry and by what they could take from the land around them. It is often said that the French government, at war with much of Europe at the end of the eighteenth century, offered a prize for a better method. The details of that offer are less certain than the story suggests, but it is clear that the authorities took a close interest in the man who eventually found one." },
          { text: "Nicolas Appert was a Parisian confectioner, a maker of sweets and fruit preserves, who began experimenting in the 1790s. His method, refined over roughly fifteen years, was simple to describe. Food, sometimes partly cooked, was placed in a thick glass bottle. The mouth of the bottle was closed with a cork, which was tied down with wire and covered with a seal of wax, and the bottle was then lowered into a pan of boiling water and left there for a period that depended on the kind of food inside. Peas needed less time than meat, and Appert recorded the times he had found to work for dozens of different foods. Samples were sent to sea with the French navy several years before he was rewarded, and officers who opened them months later reported that the contents were in good condition. In 1810 the government awarded Appert 12,000 francs on condition that he make his method public, and a book describing it appeared the same year." },
          { text: "What Appert could not do was explain why his bottles worked. He believed that the enemy was air, and that sealing it out was what kept food from going bad; heating, in his account, served mainly to drive out whatever air remained. He was wrong, though in a way that hardly mattered. It was not until the 1860s that Louis Pasteur showed that spoilage was caused by microscopic organisms, which heat destroys and which a sealed container keeps out. Appert's method succeeded for reasons he did not understand, and had he understood them, he might well have shortened some of his heating times considerably." },
          { text: "Glass had obvious disadvantages for an army on the march. In the same year that Appert received his award, a British merchant named Peter Durand was granted a patent for preserving food in containers of glass, pottery, tin or other metals. Durand did not go into production himself; he sold the patent to two engineers, Bryan Donkin and John Hall, who by 1813 had set up a factory in Bermondsey, in south London. Their containers were made of iron coated with a thin layer of tin, which prevented rusting, and the Royal Navy and several Arctic expeditions were among their earliest customers. The word canister, soon shortened to can, came into use for the new containers." },
          { text: "The first cans were a long way from the light containers of today. Each was made by hand: a skilled tinsmith cut the metal, shaped it and soldered the seams, and could produce perhaps sixty cans in a working day. The cans were heavy, sometimes weighing more than the food they held, and they were costly enough that canned food remained, for several decades, a supply for sailors, soldiers and explorers rather than for ordinary households. Opening them was a problem of its own. Instructions printed on some early cans advised the user to cut round the top with a chisel and hammer, and soldiers are said to have used bayonets or simply shot them open. A purpose-made opener was not patented until 1858, almost half a century after the can itself." },
          { text: "Several developments in the second half of the nineteenth century turned the can into an everyday object. Machines took over much of the cutting and shaping of metal, so that a factory could turn out thousands of cans where a workshop had made dozens. Processing became faster too. In 1861 an American canner, Isaac Solomon, found that adding calcium chloride to the water raised its boiling point well above 100 degrees Celsius, which cut the time needed to heat a batch of cans from several hours to less than one. Later, sealed pressure vessels known as retorts allowed temperatures to be controlled more precisely still. Demand from armies, above all during the American Civil War, introduced canned food to large numbers of men who went on buying it when they returned home." },
          { text: "The can has not been without its critics. Early cans were sealed with lead solder, and it has long been suggested that lead from cans contributed to the deaths of the men on John Franklin's Arctic expedition of 1845, although later research has questioned how large a part the cans actually played. Modern cans are sealed mechanically, without solder, and many are lined to stop the contents reacting with the metal. Yet the principle on which they depend is still Appert's: heat the food enough to destroy whatever would spoil it, and seal it so that nothing can get back in. The same principle lies behind the sterilised pouches and cartons that are now replacing the can on many supermarket shelves, which may be the best measure of how much one Parisian confectioner got right without knowing why." },
        ],
      },
      { t: "p", text: "**Questions 1–4** — Answer the questions below. Choose **NO MORE THAN THREE WORDS AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "quiz",
        id: "t5d19-doc-p1-tra-loi",
        kind: "fill",
        title: "Questions 1–4 — NO MORE THAN THREE WORDS AND/OR A NUMBER",
        items: [
          { q: "1. Before canning, what was fruit boiled with so that it would keep through the winter?", answers: ["sugar"], hint: "Đoạn 1: “fruit was boiled with sugar until it would last through the winter”. keep ≈ last. Nhiễu: vinegar là của rau (vegetables)." },
          { q: "2. What was Appert's trade before he began his experiments?", answers: ["confectioner", "a confectioner", "a Parisian confectioner", "Parisian confectioner"], hint: "Đoạn 2: “Nicolas Appert was a Parisian confectioner”. trade = nghề. Chép đúng chính tả confectioner." },
          { q: "3. How much money did the French government award Appert in 1810?", answers: ["12,000 francs", "12000 francs", "12 000 francs"], hint: "Đoạn 2: “awarded Appert 12,000 francs”. Viết đủ đơn vị francs; 12,000 kiểu Anh (Bài 1 quy tắc ⑧)." },
          { q: "4. Which two tools did instructions on some early cans recommend for opening them?", answers: ["chisel and hammer", "a chisel and hammer", "a chisel and a hammer", "hammer and chisel"], hint: "Đoạn 5: “cut round the top with a chisel and hammer”. Nhiễu: bayonets là chuyện lính làm, không phải lời hướng dẫn in trên hộp." },
        ],
      },
      {
        t: "p",
        text: "**Questions 5–9** — Do the following statements agree with the information given in Reading Passage 1? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.",
      },
      {
        t: "mcq",
        id: "t5d19-doc-p1-tfng",
        title: "Questions 5–9 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "5. Appert correctly understood why his method prevented food from going bad.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn 3: “What Appert could not do was explain why… He believed that the enemy was air… He was wrong”. Câu chẻ What… could not do mở đầu chính là phủ định." },
          { q: "6. Appert's preserved food was tested at sea before the government rewarded him.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn 2: “Samples were sent to sea with the French navy several years before he was rewarded… reported that the contents were in good condition”. tested at sea ≈ sent to sea… opened them months later." },
          { q: "7. Peter Durand ran a factory that produced canned food.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn 4: “Durand did not go into production himself; he sold the patent to… Donkin and… Hall, who… had set up a factory”. Bẫy: tên Durand đứng ngay cạnh chữ factory." },
          { q: "8. Early tin cans cost less to manufacture than glass bottles.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài nói hộp sắt “costly” (đoạn 5) và thuỷ tinh có “obvious disadvantages” (đoạn 4), nhưng KHÔNG so giá làm hộp với giá làm chai. Hai thông tin đúng không cộng thành một phép so sánh." },
          { q: "9. Adding a chemical to the water reduced the time needed to process cans.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn 6: “adding calcium chloride to the water raised its boiling point… which cut the time needed to heat a batch of cans from several hours to less than one”. a chemical = calcium chloride; reduced = cut." },
        ],
      },
      { t: "p", text: "**Questions 10–13** — Complete the flow-chart below. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "sodo",
        kind: "flow",
        title: "Appert's method of preserving food",
        steps: [
          { label: "Food (sometimes partly cooked) is put into a thick glass bottle" },
          { label: "The bottle is closed with a **10** ___", sub: "câu 10" },
          { label: "This is fastened with **11** ___ and sealed with wax", sub: "câu 11" },
          { label: "The bottle is placed in a pan of **12** ___ water", sub: "câu 12" },
          { label: "The time it stays there depends on the **13** ___ of food", sub: "câu 13" },
        ],
      },
      {
        t: "quiz",
        id: "t5d19-doc-p1-luu-do",
        kind: "fill",
        title: "Questions 10–13 — ONE WORD ONLY",
        items: [
          { q: "10", answers: ["cork"], hint: "Đoạn 2: “The mouth of the bottle was closed with a cork”." },
          { q: "11", answers: ["wire"], hint: "Đoạn 2: “which was tied down with wire”. fastened ≈ tied down. Nhiễu: wax đã có sẵn trong ô." },
          { q: "12", answers: ["boiling"], hint: "Đoạn 2: “lowered into a pan of boiling water”. placed in ≈ lowered into." },
          { q: "13", answers: ["kind"], hint: "Đoạn 2: “a period that depended on the kind of food inside”. Chỉ MỘT từ: không viết type (không có trong bài)." },
        ],
      },

      /* ───────────── PASSAGE 2 ───────────── */
      { t: "h", text: "READING PASSAGE 2 — Questions 14–26 (18 phút)" },
      {
        t: "passage",
        title: "The Network Beneath the Forest",
        intro: "You should spend about 18 minutes on Questions 14–26, which are based on Reading Passage 2.",
        paras: [
          { label: "A", text: "Beneath almost any forest floor lies a dense tangle of fungal threads. Many of them belong to mycorrhizal fungi, which grow into or around the fine roots of plants and form a partnership that is at least four hundred million years old. The arrangement is, in broad terms, a trade. The fungus, whose threads are far thinner than any root and can reach into tiny spaces in the soil, gathers water and minerals such as phosphorus and passes some of them to the plant. In return the plant, which can make sugars from sunlight while the fungus cannot, supplies it with carbon. The great majority of plant species form partnerships of this kind, and many could not grow well without them." },
          { label: "B", text: "That much has been known for a long time. What made the subject famous was a further possibility: because a single fungus can attach itself to the roots of several trees at once, the trees themselves might be linked through it, and resources might pass from one tree to another. In 1997 the forest ecologist Suzanne Simard and her colleagues published a study in the journal Nature that seemed to show exactly this. Working in British Columbia, they exposed paper birch and Douglas fir seedlings to air containing two different forms of carbon, each of which could be traced, and found that carbon taken in by one species turned up in the other. More of it moved towards the fir when the fir was growing in deep shade, as though the network were directing help to where it was most needed." },
          { label: "C", text: "The finding travelled far beyond the scientific literature. The journal's cover is usually credited with the phrase a wood-wide web, and in the decades that followed the picture grew more elaborate. Large old trees came to be described as mother trees that recognised their own offspring and fed them through the network; dying trees were said to pass their remaining resources to their neighbours; forests, in some popular accounts, became communities that cooperated rather than competed. Books on the subject sold in very large numbers, and the idea found its way into novels, documentaries and at least one major film. Simard herself has generally been more cautious than many of those who quote her, although she too has argued that forests are more cooperative places than the older picture of competition allowed." },
          { label: "D", text: "In 2023 a group of researchers led by Justine Karst published a review that set out to examine three of the most widely repeated claims: that such networks are widespread in forests, that resources move through them in quantities that matter, and that mature trees use them to favour young ones. The reviewers did not argue that the networks are imaginary. Their conclusion, rather, was that the field evidence for each claim was thinner, and more open to other interpretations, than the confidence with which the claims were made. Few studies had shown that a network physically connected the particular trees involved, and carbon that moved between plants might have travelled through the soil rather than through fungal threads. The review also reported that studies with positive findings had been cited far more often than those that found little effect, so that the published literature, read as a whole, appeared more certain than the research beneath it." },
          { label: "E", text: "Part of the difficulty is simply that the subject is hidden. A fungal thread may be a small fraction of the width of a human hair, and the soil it grows through is opaque, fragile and endlessly variable. To show that two particular trees share the same fungus, researchers must identify the fungus on each root, usually from its DNA, and even then they cannot easily follow the thread from one to the other. Experiments that cut through the soil to break possible connections also damage roots and alter the movement of water, so that any later difference in the trees' growth may have more than one cause. And many of the most striking results came from seedlings grown in pots or small plots, which do not necessarily behave like a mature forest." },
          { label: "F", text: "None of this calls the partnership itself into question. That mycorrhizal fungi exchange minerals for carbon is not in doubt, and nor is the fact that a single fungus can connect more than one plant. What remains uncertain is how often resources actually move between trees in natural forests, in what amounts, and whether the young trees that receive them are any better off as a result. Some careful field studies have found benefits for seedlings growing near older trees of the same kind; others have found none, or have found that competition for light and water outweighs whatever help arrives from below." },
          { label: "G", text: "The debate has practical consequences, because the image of the cooperating forest has been used to argue for changes in how forests are managed, such as leaving large old trees standing when an area is logged rather than clearing it completely. Critics of the network claims have generally not opposed such practices. Old trees shelter seedlings, store carbon, provide homes for wildlife and hold soil in place; there are good reasons to protect them whatever does or does not travel through the fungi beneath them. The lesson the reviewers drew concerned the way in which science reaches the public. A hypothesis that is attractive and partly supported can come to be treated as settled long before the evidence allows, and correcting it afterwards is far harder than stating it carefully in the first place." },
        ],
      },
      { t: "p", text: "**Questions 14–20** — Reading Passage 2 has seven paragraphs, **A–G**. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, **i–x**." },
      {
        t: "table",
        head: ["", "List of Headings"],
        rows: [
          ["i", "The practical obstacles to studying the subject"],
          ["ii", "An appealing idea spreads beyond the scientists"],
          ["iii", "How old trees identify their own seedlings"],
          ["iv", "Good forestry for reasons that do not depend on the debate"],
          ["v", "An exchange of benefits with a very long history"],
          ["vi", "Damage caused to trees by harmful fungi"],
          ["vii", "A review that weighed the evidence"],
          ["viii", "The commercial value of forest fungi"],
          ["ix", "A finding that pointed to a wider possibility"],
          ["x", "Agreement on the basics, uncertainty about the details"],
        ],
      },
      {
        t: "quiz",
        id: "t5d19-doc-p2-tieu-de",
        kind: "fill",
        title: "Questions 14–20 — viết số La Mã i–x",
        items: [
          { q: "14. Paragraph A", answers: ["v"], hint: "A: “a partnership that is at least four hundred million years old… in broad terms, a trade” → exchange of benefits + very long history." },
          { q: "15. Paragraph B", answers: ["ix"], hint: "B: câu chủ đề “What made the subject famous was a further possibility” + nghiên cứu 1997 “seemed to show exactly this”. Không phải iii: B chưa nói chuyện nhận ra cây con." },
          { q: "16. Paragraph C", answers: ["ii"], hint: "C: “The finding travelled far beyond the scientific literature” → spreads beyond the scientists. BẪY iii: mother trees “recognised their own offspring” chỉ là MỘT chi tiết trong danh sách những gì câu chuyện phổ biến thêm vào — không phải ý của đoạn." },
          { q: "17. Paragraph D", answers: ["vii"], hint: "D: “published a review that set out to examine three… claims… the field evidence… was thinner”." },
          { q: "18. Paragraph E", answers: ["i"], hint: "E: “Part of the difficulty is simply that the subject is hidden” + soil opaque, DNA, experiments damage roots → obstacles." },
          { q: "19. Paragraph F", answers: ["x"], hint: "F: “None of this calls the partnership itself into question… What remains uncertain is…” → đồng ý phần nền, chưa chắc phần chi tiết." },
          { q: "20. Paragraph G", answers: ["iv"], hint: "G: “there are good reasons to protect them whatever does or does not travel through the fungi” → lý do không phụ thuộc cuộc tranh luận." },
        ],
      },
      { t: "p", text: "**Questions 21–23** — Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "note",
        title: "The 1997 study",
        items: [
          "Simard and her colleagues reported their work in the journal **21** ___ . They gave birch and fir seedlings air containing two traceable forms of **22** ___ , which later appeared in the other species.",
          "The quantity reaching the fir increased when that tree was in deep **23** ___ .",
        ],
      },
      {
        t: "quiz",
        id: "t5d19-doc-p2-tom-tat",
        kind: "fill",
        title: "Questions 21–23 — ONE WORD ONLY",
        items: [
          { q: "21", answers: ["Nature"], hint: "B: “published a study in the journal Nature”." },
          { q: "22", answers: ["carbon"], hint: "B: “air containing two different forms of carbon, each of which could be traced”. traceable = could be traced." },
          { q: "23", answers: ["shade"], hint: "B: “More of it moved towards the fir when the fir was growing in deep shade”. Chỉ một từ: shade (deep đã có sẵn)." },
        ],
      },
      { t: "p", text: "**Questions 24–26** — Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq",
        id: "t5d19-doc-p2-chon",
        title: "Questions 24–26 — Multiple choice",
        items: [
          { q: "24. According to paragraph D, the 2023 review concluded that", options: ["A  the networks described in earlier studies do not exist.", "B  the evidence for the popular claims was weaker than their confidence implied.", "C  carbon cannot move between trees through the soil.", "D  studies with negative results had been deliberately hidden."], correct: 1, why: "“the field evidence for each claim was thinner… than the confidence with which the claims were made”. A bị bác thẳng (“did not argue that the networks are imaginary”); C ngược (“might have travelled through the soil” = có thể); D quá mức: ít được TRÍCH DẪN, không phải bị GIẤU." },
          { q: "25. The writer mentions seedlings grown in pots in order to show that", options: ["A  pot experiments are cheaper to carry out.", "B  fungi grow more quickly in small spaces.", "C  some results may not apply to mature forests.", "D  field experiments always damage roots."], correct: 2, why: "E: “seedlings grown in pots or small plots, which do not necessarily behave like a mature forest”. D có ý trong đoạn (cắt đất làm hỏng rễ) nhưng là lý do KHÁC và always là quá mức." },
          { q: "26. What is the writer's main point in paragraph G?", options: ["A  Critics of the network claims want old trees to be removed.", "B  Protecting old trees can be justified without relying on the network claims.", "C  Forests are managed better today than in the past.", "D  Scientists should avoid discussing uncertain ideas in public."], correct: 1, why: "“there are good reasons to protect them whatever does or does not travel through the fungi”. A ngược (“have generally not opposed”); D quá mức — bài nói nên nói CẨN THẬN (“stating it carefully”), không nói nên im." },
        ],
      },

      /* ───────────── PASSAGE 3 ───────────── */
      { t: "h", text: "READING PASSAGE 3 — Questions 27–40 (20 phút + 2 phút soát)" },
      {
        t: "passage",
        title: "The Laboratory of the Mind",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3.",
        paras: [
          { text: "In a well-known passage of his Two New Sciences, published in 1638, Galileo set out to refute the ancient view that heavier bodies fall faster than lighter ones, and he did so without dropping anything at all. Suppose, he argued, that a heavy stone does fall faster than a light one. Now tie the two together. The light stone, falling more slowly, ought to hold the heavy one back, so the pair should fall more slowly than the heavy stone alone; yet the pair is heavier than the heavy stone, so it ought to fall faster. Since it cannot do both, the original assumption must be false, and bodies of different weights must fall at the same rate. Whether Galileo ever dropped anything from the Leaning Tower of Pisa is doubtful. What is beyond doubt is that this argument, conducted entirely in the imagination, persuaded readers who had never seen the experiment it replaced." },
          { text: "Thought experiments of this kind raise a puzzle that philosophers have argued over for decades. A real experiment teaches us something because the world pushes back: we do not get to decide what the instrument reads. A thought experiment involves no instrument and no new observation. If it nonetheless tells us something about the world that we did not know before, where has the knowledge come from? Two answers have dominated the discussion, and they could hardly be further apart." },
          { text: "The first, defended most fully by the philosopher James Robert Brown, holds that certain thought experiments give us a kind of direct insight into the laws of nature, much as, on one traditional view, we grasp mathematical truths without observing anything. On this account Galileo did not merely derive a conclusion from premises; he saw, in a single act of understanding, how falling bodies must behave. The second answer, associated with the philosopher of science John Norton, is deliberately deflationary. A thought experiment, Norton argues, is an argument in picturesque dress. Strip away the stones and the string, and what remains is a set of premises and a chain of reasoning, and the conclusion can be no more reliable than the premises with which it began. Were it not for the vivid scenery, he suggests, we would recognise thought experiments for what they are and judge them as we judge any other argument." },
          { text: "Norton's view has the considerable merit of explaining when thought experiments go wrong. They fail precisely where arguments fail: when a premise that seemed innocent turns out to be false. Many imagined cases have failed in just this way. Aristotle's own reasoning about motion was full of plausible scenarios, and a good deal of nineteenth-century physics rested on thought experiments about the ether, a medium that later work abandoned altogether. Yet the deflationary account seems to me to miss something about what thought experiments are for. If they were merely arguments, it would be hard to see why scientists reach for them so often at moments of crisis, when the existing concepts of a field have begun to strain. Einstein recalled that at sixteen he had wondered what he would see if he could travel alongside a beam of light. The question proved nothing, but it exposed a conflict between two well-established theories that he spent the next decade resolving. The value of the exercise lay less in any conclusion than in revealing which of our beliefs could not all be true at once." },
          { text: "Philosophy relies on imagined cases even more heavily than physics does, and here the difficulties are sharper. In 1967 Philippa Foot asked her readers to picture the driver of a runaway tram who can steer onto a track where one person will be killed instead of five; in 1982 Frank Jackson described a scientist who knows every physical fact about colour but has spent her whole life in a black-and-white room, and asked whether she learns something new when she first sees red. Cases like these are not settled by reasoning alone. Their force depends on the reader's intuition: the immediate sense that the driver ought to turn, or that the scientist does learn something. And intuitions, unlike premises, can be studied." },
          { text: "In recent years a movement known as experimental philosophy has done exactly that, presenting well-known cases to large numbers of people and recording how they respond. Some early studies reported that judgements varied between cultures, although later and larger studies have frequently failed to confirm those differences. Other findings have proved more robust. Responses can shift with the order in which cases are presented, and one study found that professional philosophers were no less affected by such ordering than anyone else. It would be tempting to conclude that intuitions are worthless as evidence. That conclusion seems to me too hasty. An instrument that is sensitive to irrelevant conditions is not therefore useless; it needs to be calibrated, and its readings need to be checked against one another. What the experimental work has shown is not that philosophers should stop consulting intuitions, but that it is essential that the conditions under which an intuition is produced be reported as carefully as the intuition itself." },
          { text: "Where, then, does this leave the laboratory of the mind? Not, certainly, as a substitute for the real one. Where an experiment can be performed, it should be; had Aristotle's followers tested more of their imagined scenarios, physics might well be centuries further on than it is. But many of the questions that matter most, in ethics, in the foundations of physics, in the design of institutions that do not yet exist, cannot be put to any experiment. For those questions, imagined cases are not a luxury; they are much of what we have. The proper response to their weaknesses is the one we apply to any instrument: to use them in full knowledge of how they can mislead, and to trust them most when several of them point in the same direction." },
        ],
      },
      { t: "p", text: "**Questions 27–30** — Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq",
        id: "t5d19-doc-p3-chon",
        title: "Questions 27–30 — Multiple choice",
        items: [
          { q: "27. Why does the writer describe Galileo's argument in the first paragraph?", options: ["A  to show that Galileo avoided real experiments", "B  to give an example of an imagined case that changed what people believed", "C  to cast doubt on the story of the Leaning Tower of Pisa", "D  to explain why heavy objects fall more quickly"], correct: 1, why: "Câu chốt đoạn: “this argument, conducted entirely in the imagination, persuaded readers who had never seen the experiment it replaced”. C có chữ trong bài (“doubtful”) nhưng chỉ là câu bên lề; D ngược kết luận của Galileo." },
          { q: "28. According to the second paragraph, what is puzzling about thought experiments?", options: ["A  They rarely persuade working scientists.", "B  They require more skill than real experiments.", "C  They seem to provide knowledge of the world without any new observation.", "D  Their conclusions are usually less reliable than those of real experiments."], correct: 2, why: "“A thought experiment involves no instrument and no new observation. If it nonetheless tells us something… where has the knowledge come from?”. D là ý của Norton ở đoạn sau, và cũng không phải “câu đố”." },
          { q: "29. What does Norton mean when he calls a thought experiment “an argument in picturesque dress”?", options: ["A  Its imagery adds nothing to what can be justified by its premises.", "B  It is more convincing than a real experiment.", "C  It can only be understood by trained philosophers.", "D  It offers direct insight into the laws of nature."], correct: 0, why: "“Strip away the stones and the string, and what remains is a set of premises… the conclusion can be no more reliable than the premises”. D là quan điểm của Brown — bẫy nhầm chủ thể." },
          { q: "30. The writer refers to Einstein's question about a beam of light in order to", options: ["A  show how quickly a thought experiment can lead to a result.", "B  support Norton's account of thought experiments.", "C  prove that intuitions are a reliable form of evidence.", "D  show that a thought experiment can reveal a conflict between beliefs."], correct: 3, why: "“The question proved nothing, but it exposed a conflict between two well-established theories… revealing which of our beliefs could not all be true at once”. B ngược: ví dụ này dùng để nói Norton “miss something”." },
        ],
      },
      {
        t: "p",
        text: "**Questions 31–35** — Do the following statements agree with the claims of the writer in Reading Passage 3? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t5d19-doc-p3-ynng",
        title: "Questions 31–35 — YES / NO / NOT GIVEN",
        items: [
          { q: "31. Norton's account helps to explain why some thought experiments lead to false conclusions.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“Norton's view has the considerable merit of explaining when thought experiments go wrong.” Người viết khen điểm này dù không đồng ý toàn bộ." },
          { q: "32. Thought experiments are best understood as arguments and nothing more.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“the deflationary account seems to me to miss something about what thought experiments are for”. seems to me = giọng người viết; nothing more = đúng điều người viết bác." },
          { q: "33. Foot's case has been discussed more widely than Jackson's.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Hai ví dụ được kể cạnh nhau; bài không so mức độ được bàn luận. Bẫy: Foot được nêu trước không có nghĩa là nổi tiếng hơn." },
          { q: "34. It has been firmly established that people from different cultures respond differently to the same cases.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“later and larger studies have frequently failed to confirm those differences” — trái với firmly established. Bẫy S: dừng ở “Some early studies reported…” là chọn YES." },
          { q: "35. Philosophers ought to report the circumstances in which an intuition was obtained.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“it is essential that the conditions under which an intuition is produced be reported as carefully as the intuition itself”. ought to ≈ it is essential that; circumstances ≈ conditions. Câu giả định của Bài 1." },
        ],
      },
      { t: "p", text: "**Questions 36–40** — Complete each sentence with the correct ending, **A–G**, below." },
      {
        t: "note",
        title: "Sentence beginnings",
        items: [
          "**36** Brown believes that certain thought experiments ___",
          "**37** According to Norton, the conclusion of a thought experiment ___",
          "**38** Nineteenth-century thought experiments about the ether ___",
          "**39** Experimental philosophers have found that responses to a case ___",
          "**40** The writer argues that imagined cases should be trusted most ___",
        ],
      },
      {
        t: "table",
        head: ["", "Endings"],
        rows: [
          ["A", "can be influenced by the sequence in which cases are shown."],
          ["B", "give a form of understanding like that found in mathematics."],
          ["C", "should be replaced by surveys of public opinion."],
          ["D", "when a number of them support one another."],
          ["E", "can be no more dependable than the assumptions it starts from."],
          ["F", "are more common in physics than in philosophy."],
          ["G", "relied on ideas that were later given up."],
        ],
      },
      {
        t: "quiz",
        id: "t5d19-doc-p3-ket-cau",
        kind: "fill",
        title: "Questions 36–40 — viết chữ cái A–G",
        items: [
          { q: "36", answers: ["B"], hint: "Đoạn 3: “direct insight into the laws of nature, much as… we grasp mathematical truths”." },
          { q: "37", answers: ["E"], hint: "Đoạn 3: “the conclusion can be no more reliable than the premises with which it began”. dependable ≈ reliable; assumptions ≈ premises." },
          { q: "38", answers: ["G"], hint: "Đoạn 4: “thought experiments about the ether, a medium that later work abandoned altogether”. given up ≈ abandoned." },
          { q: "39", answers: ["A"], hint: "Đoạn 6: “Responses can shift with the order in which cases are presented”. sequence ≈ order; shown ≈ presented. Loại C: người viết nói intuitions cần hiệu chỉnh, không nói thay bằng khảo sát." },
          { q: "40", answers: ["D"], hint: "Đoạn 7: “to trust them most when several of them point in the same direction”. Kiểm ngữ pháp: chỉ D bắt đầu bằng when, khớp với “trusted most ___”. F ngược đoạn 5 (“Philosophy relies on imagined cases even more heavily than physics”)." },
        ],
      },

      /* ───────────── CHẤM ───────────── */
      { t: "h", text: "Hết 55 phút — chấm điểm, so với Ngày 13" },
      {
        t: "table",
        head: ["Số câu đúng / 40", "Band Reading (ước tính)", "Nghĩa là"],
        rows: [
          ["39–40", "9.0", "Giữ nhịp; Ngày 27 thử 50 phút."],
          ["37–38", "8.5", "Vượt đích. Xem 2–3 câu sai có cùng một nhãn không."],
          ["35–36", "8.0", "Đúng đích của tập — lần 2 đã chạm. Ngày 27 cần lặp lại."],
          ["33–34", "7.5", "Đạt mục tiêu hôm nay. So nhãn lỗi với Ngày 13: nhãn nào giảm, nhãn nào không?"],
          ["30–32", "7.0", "Chưa nhích so với đầu tập. Xem bảng phân loại; có thể là nhịp chứ không phải kỹ năng."],
          ["dưới 30", "≤ 6.5", "Ghi lại passage nào bạn hết giờ. Làm lại Passage 3 sau 3 ngày, 20 phút."],
        ],
        caption: "Quy đổi theo bảng công khai của Academic Reading — chỉ là ước tính trên một đề tự soạn",
      },
      {
        t: "table",
        head: ["Nhãn lỗi", "Câu dễ dính hôm nay", "Vì sao", "Ôn ở đâu"],
        rows: [
          ["**K — không tìm ra chỗ**", "Headings 15 · 16, Sentence endings 38", "đoạn B và C chuyển ý ngay câu đầu; ether nằm giữa đoạn 4", "Tập 5 Ngày 5 (headings 4) · Ngày 9 mục Headings"],
          ["**P — hiểu sai paraphrase**", "TFNG 6 · 9, Summary 22, Endings 37 · 39", "tested at sea ↔ sent to sea… opened; dependable ↔ reliable; sequence ↔ order", "Tập 4 Ngày 15 · Tập 5 Ngày 6"],
          ["**S — suy quá mức / nhầm chủ thể**", "TFNG 7 · 8, MCQ 24 · 29, YNNG 32 · 34", "Durand ≠ người mở xưởng; hai thông tin ≠ một phép so sánh; Brown ≠ Norton; dừng ở “Some early studies”", "Tập 5 Ngày 3 (TFNG band 8) · Ngày 9 (YNNG)"],
          ["**C — chính tả / quá số từ**", "Short answer 2 · 3 · 4, Flow-chart 13", "confectioner; 12,000 francs; ba từ “chisel and hammer”; kind chứ không type", "chép đúng chữ trong bài; đếm từ theo lệnh"],
        ],
        caption: "Ghi nhãn cạnh từng câu sai, rồi đặt hai hàng số Ngày 13 / Ngày 19 cạnh nhau trong Sổ lỗi",
      },
      {
        t: "note",
        title: "💡 Mẹo: ba kiểu bẫy band 8 có trong đề hôm nay",
        items: [
          "**Khả năng bị đọc thành khẳng định:** câu 24 C — bài viết “might have travelled through the soil”, phương án viết “cannot move”. might / may / could trong bài thì phương án tuyệt đối gần như luôn sai.",
          "**Chi tiết nổi bật không phải ý của đoạn:** câu 16 — mother trees nhận ra con là chi tiết hút mắt nhất của đoạn C, nhưng đoạn nói về việc câu chuyện LAN RA ngoài giới khoa học. Hỏi: “câu đầu đoạn nói gì?”.",
          "**Quan điểm được thuật bị gán cho người viết:** câu 29 D và 32 — Brown nói direct insight, Norton nói argument; người viết đứng giữa, và giọng của họ lộ ra ở “seems to me”.",
        ],
      },

      { t: "h", text: "Soi lại Passage 3 bằng ngữ pháp Bài 1 — người viết dùng giả định và dấu câu thế nào" },
      { t: "p", text: "Passage 3 dài gần 1.000 từ và chỉ có ==một đảo ngữ thay if, một câu điều kiện hỗn hợp, một câu giả định==, cộng ba chỗ chấm phẩy nối hai mệnh đề. Tìm chúng: điền MỘT từ lấy nguyên văn từ bài." },
      {
        t: "quiz",
        id: "t5d19-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ Passage 3 (6 câu)",
        items: [
          { q: "1. Đảo ngữ thay if (đoạn 3): “___ it not for the vivid scenery, he suggests, we would recognise thought experiments…”", answers: ["Were"], hint: "Were it not for = If it were not for — Bài 1 mục 3, bảng dòng cuối." },
          { q: "2. Câu giả định (đoạn 6): “it is essential that the conditions under which an intuition is produced ___ reported”", answers: ["be"], hint: "It is essential that + S + be V3 — Bài 1 mục 4. Bài không viết “are reported”." },
          { q: "3. Hỗn hợp quá khứ → hiện tại (đoạn 7): “had Aristotle's followers tested more of their imagined scenarios, physics might well ___ centuries further on than it is”", answers: ["be"], hint: "had V3 (quá khứ) → might well be (hiện tại) — Bài 1 mục 2, thêm mức chắc might well." },
          { q: "4. Giả định hiện tại (đoạn 4): “If they ___ merely arguments, it would be hard to see why scientists reach for them…”", answers: ["were"], hint: "Người viết không tin chúng CHỈ là lập luận ⇒ were (không thật)." },
          { q: "5. Câu tường thuật một giả định (đoạn 4): “he had wondered what he ___ see if he could travel alongside a beam of light”", answers: ["would"], hint: "would + V trong câu hỏi gián tiếp về một tình huống tưởng tượng." },
          { q: "6. Chấm phẩy nối hai mệnh đề (đoạn 7): “For those questions, imagined cases are not a ___; they are much of what we have.”", answers: ["luxury"], hint: "Hai mệnh đề độc lập, ý thứ hai sửa ý thứ nhất ⇒ nối bằng chấm phẩy, không dùng phẩy (Bài 1 quy tắc ③)." },
        ],
      },

      { t: "h", text: "Từ vựng hữu ích từ ba bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "spoilage", pos: "n", ipa: "/ˈspɔɪlɪdʒ/", vi: "sự hư hỏng (của thực phẩm)", ex: "Pasteur showed that spoilage was caused by microscopic organisms.", exVi: "Pasteur chỉ ra rằng sự hư hỏng là do các vi sinh vật gây ra.", more: "food spoilage · prevent / reduce spoilage · động từ spoil (go off khi nói)" },
          { w: "solder", pos: "n / v", ipa: "/ˈsəʊldə(r)/", vi: "(n) chất hàn thiếc; (v) hàn", ex: "A skilled tinsmith soldered the seams by hand.", exVi: "Một thợ thiếc lành nghề hàn các mối nối bằng tay.", more: "lead solder · solder a joint / seam · ⚠️ chữ l thường câm trong cách đọc Mỹ /ˈsɑːdər/" },
          { w: "sterilise", pos: "v", ipa: "/ˈsterəlaɪz/", vi: "tiệt trùng", ex: "Sterilised pouches are replacing cans on many shelves.", exVi: "Túi đã tiệt trùng đang thay thế đồ hộp trên nhiều kệ hàng.", more: "sterilise equipment / milk · sterile (adj) · sterilisation (n) · Mỹ: sterilize" },
          { w: "on condition that", pos: "conj", ipa: "/ɒn kənˈdɪʃn ðət/", vi: "với điều kiện là", ex: "The government paid Appert on condition that he make his method public.", exVi: "Chính phủ trả tiền cho Appert với điều kiện ông công bố phương pháp của mình.", more: "sau nó có thể dùng thức giả định (he make) hoặc hiện tại (he makes) · gần nghĩa: provided that (Tập 4 Ngày 19) · make sth public = công bố" },
          { w: "tangle", pos: "n", ipa: "/ˈtæŋɡl/", vi: "mớ rối, đám chằng chịt", ex: "A dense tangle of fungal threads lies beneath the forest floor.", exVi: "Một mớ sợi nấm chằng chịt nằm dưới mặt đất rừng.", more: "a tangle of wires / roots / regulations · tangled (adj) · get tangled up in" },
          { w: "in broad terms", pos: "phr", ipa: "/ɪn ˌbrɔːd ˈtɜːmz/", vi: "nói một cách khái quát", ex: "In broad terms, the arrangement is a trade.", exVi: "Nói khái quát thì mối quan hệ này là một cuộc trao đổi.", more: "gần nghĩa: broadly speaking, by and large · dùng tốt đầu câu Part 3 trước khi đi vào chi tiết" },
          { w: "opaque", pos: "adj", ipa: "/əʊˈpeɪk/", vi: "mờ đục, không nhìn xuyên qua được; khó hiểu", ex: "The soil is opaque, fragile and endlessly variable.", exVi: "Đất thì mờ đục, dễ vỡ và biến đổi vô tận.", more: "nghĩa bóng: an opaque process / decision (thiếu minh bạch) · trái: transparent · opacity (n)" },
          { w: "deflationary", pos: "adj", ipa: "/ˌdiːˈfleɪʃənri/", vi: "(lập luận) hạ nhiệt, giảm bớt tầm quan trọng mà người khác gán cho", ex: "Norton's account is deliberately deflationary.", exVi: "Cách giải thích của Norton cố ý hạ nhiệt vấn đề.", more: "nghĩa kinh tế: giảm phát (deflation) · a deflationary view / reading of sth" },
          { w: "beyond doubt", pos: "phr", ipa: "/bɪˌjɒnd ˈdaʊt/", vi: "chắc chắn, không còn nghi ngờ", ex: "What is beyond doubt is that the argument persuaded readers.", exVi: "Điều chắc chắn là lập luận ấy đã thuyết phục người đọc.", more: "prove sth beyond doubt · beyond reasonable doubt (pháp lý) · trái: open to question" },
          { w: "strain", pos: "v / n", ipa: "/streɪn/", vi: "căng ra, quá tải; (n) sức ép", ex: "Scientists reach for thought experiments when existing concepts begin to strain.", exVi: "Các nhà khoa học tìm đến thí nghiệm tưởng tượng khi các khái niệm hiện có bắt đầu quá tải.", more: "put a strain on (resources / services) · under strain · strained relations" },
          { w: "hasty", pos: "adj", ipa: "/ˈheɪsti/", vi: "vội vàng, hấp tấp", ex: "That conclusion seems to me too hasty.", exVi: "Kết luận đó với tôi có vẻ quá vội vàng.", more: "a hasty decision / conclusion / generalisation · hastily (adv) · làm dịu phản bác ở Part 3: That might be a little hasty." },
          { w: "thought experiment", pos: "n phr", ipa: "/ˈθɔːt ɪkˌsperɪmənt/", vi: "thí nghiệm tưởng tượng (làm trong đầu)", ex: "Galileo's argument was a thought experiment conducted entirely in the imagination.", exVi: "Lập luận của Galileo là một thí nghiệm tưởng tượng thực hiện hoàn toàn trong đầu.", more: "conduct / devise a thought experiment · Part 3: Let's do a quick thought experiment: suppose…" },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau buổi làm đủ",
        items: [
          "Chép số câu đúng từng passage và giờ thật ở ba mốc (15 · 33 · 53) vào Sổ lỗi, cạnh số của Ngày 13.",
          "Câu sai nhãn **S**: viết lại câu trong bài mà bạn đã đọc thiếu (ví dụ “later and larger studies have frequently failed to confirm…”), gạch chân chữ làm đổi đáp án.",
          "Câu sai nhãn **K** ở Headings: đọc lại đúng câu đầu và câu cuối của đoạn đó, viết một dòng tiếng Việt “đoạn này nói…”, so với heading đúng.",
          "Ngày 27 là lần 3 — mục tiêu 35+. Để dành bài này: sau Ngày 27, làm lại riêng Passage 3 trong 18 phút.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI (đầu vào: đề nhỏ Nghe Part 3 + 4) ═══════════════════════════ */
  {
    id: "t5d19-noi",
    kind: "speaking",
    title: "Nói Part 3 band 8 từ đầu vào nghe: đề nhỏ Part 3 + Part 4 tốc độ thật (20 câu) → tóm – phản hồi – giả định; 🔊 would've / wouldn't have / if I'd",
    goal: "Làm một đề nghe nhỏ gồm Part 3 (thảo luận ba người, giọng Úc · Canada · Anh) và Part 4 (bài giảng, giọng New Zealand) ở tốc độ thật ~175 từ/phút, đúng ít nhất 17/20; rồi dùng chính nội dung vừa nghe để trả lời năm câu Speaking Part 3 band 8 bằng ba động tác — tóm ý người khác, phản hồi có giới hạn, giả định đúng thời gian — với dạng yếu would've / wouldn't have / if I'd nói tự nhiên.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Bảng 3.5 ghi ô này là 🎧 **đề nhỏ Part 3 + 4 tốc độ thật**; khuôn của Ngày 19 là bài **Nói**. Nên hôm nay: ==làm đề nghe 20 câu trước, rồi nói về chính những gì vừa nghe==.",
          "Nghe: Part 3 bẫy ở **ai nói** và **ai đổi ý** (giảng viên sửa sinh viên); Part 4 bẫy ở **chữ bị bác ngay sau khi nói** (“not the base — the tip”).",
          "Nói Part 3 band 8 = **FC 8 + LR 8 + GRA 8**: không chỉ nêu ý mình, mà ==tóm một ý khác, phản hồi có giới hạn, rồi giả định== (If… had…, we would now…).",
          "Ba động tác này là thứ giám khảo nghe thấy ở người band 8 khi họ hỏi câu “Some people say… What do you think?”.",
          "🔊 Dạng yếu trong câu giả định: **would've /wʊdəv/ · wouldn't have /wʊdntəv/ · if I'd /ɪf aɪd/** — nói đủ âm thì nghe như đọc, nuốt mất thì nghe như sai thì.",
          "Nối Tập 4 Ngày 19 (Part 3 giả định band 7) · Tập 5 Ngày 13 (nghe → nói) · Bài 1 hôm nay (điều kiện hỗn hợp).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Đề nhỏ Part 3 + 4 — làm thế nào trong 12 phút" },
      {
        t: "table",
        head: ["", "Part 3 (21–30)", "Part 4 (31–40)"],
        rows: [
          ["Ai nói", "2–3 người, thường 2 sinh viên + giảng viên", "một người, bài giảng có cấu trúc"],
          ["Bẫy chính", "ý của sinh viên bị giảng viên SỬA; một người đổi ý giữa chừng", "từ được nói rồi bác ngay (“not X but Y”), số liệu nhắc hai lần"],
          ["Đọc đề trước", "30 giây: gạch tên người trong câu hỏi, đọc hết các lựa chọn A–G", "45 giây: đọc tiêu đề nhỏ của ghi chú — đó là xương sống bài giảng"],
          ["Trong lúc nghe", "kẻ cột theo người; ghi chữ cái cạnh tên", "theo tiêu đề; câu hỏi đi theo thứ tự bài"],
          ["Khi lỡ một câu", "bỏ qua ngay, đợi câu tín hiệu “Now, the draft…”", "nhìn tiêu đề kế tiếp, bắt lại nhịp"],
        ],
        caption: "Hai Part cuối — hai kiểu bẫy khác nhau",
      },
      {
        t: "note",
        title: "💡 Cách ghi khi nghe ba người",
        items: [
          "Kẻ ba cột viết tắt: **Dr O | Leah | Sam**. Mỗi khi ai đó nói một ý trùng với lựa chọn trong đề, ghi chữ cái vào cột người đó.",
          "Khi giảng viên nói “I'd be careful, though” hoặc “I was going to say… but…”, ==gạch ý trước đó==: đáp án thường là ý ĐẾN SAU.",
          "Câu hỏi 26–30 hỏi ý của giảng viên — sinh viên nói gì chỉ là nhiễu.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Đề nhỏ — Part 3, Questions 21–30 (≈ 5 phút)" },
      { t: "p", text: "Bạn có 30 giây đọc câu 21–25, rồi 30 giây đọc câu 26–30. Nghe MỘT lần. Không dừng bài." },
      {
        t: "listen",
        id: "t5d19-nghe-p3",
        title: "Part 3 — A study of where students sit in lectures",
        dan: { so: "Day 19, Recording 1", boiCanh: "two students, Leah and Sam, discussing their research project on lecture seating with their tutor, Dr Okafor.", cau: [21, 30] },
        note: "Khoảng 5 phút, ~175 từ/phút. Dr Okafor: giọng Úc; Leah: giọng Canada; Sam: giọng Anh.",
        lines: [
          { who: "Dr Okafor", voice: "au-nam", text: "Come in, both of you, grab a chair. So, the seating project. Before we get to the draft, remind me how it started." },
          { who: "Leah", voice: "ca-nu", text: "Well, it started with a lecturer complaining, actually. In our first-year statistics course Dr Harker kept saying the front rows were always empty, and he said it as if that explained why some people failed. That annoyed me a bit, so I went looking, and I found a couple of published studies that do claim students near the front get better marks. That's really what made us want to test it, whether those findings would hold up here." },
          { who: "Sam", voice: "uk-nam", text: "And it looked like a project where the data would be easy to get, which turned out to be wildly optimistic." },
          { who: "Dr Okafor", voice: "au-nam", text: "Why optimistic?" },
          { who: "Sam", voice: "uk-nam", text: "Our first plan was to photograph the lecture theatre from the front at the start of each lecture and work out who was sitting where. Technically it was simple, and the pictures were perfectly clear. But the ethics committee wasn't happy about taking photographs of people who hadn't agreed to it, and to be fair, they had a point. So we switched to asking lecturers to pass round a seating plan, just a sheet with the rows drawn on it, and students wrote their ID number in the box where they were sitting." },
          { who: "Dr Okafor", voice: "au-nam", text: "And did people actually fill it in?" },
          { who: "Leah", voice: "ca-nu", text: "Most did. About eighty-five per cent in the end. The ones who didn't were mainly people who came in late, which is a bias in itself, obviously." },
          { who: "Dr Okafor", voice: "au-nam", text: "Obviously. So what did you find?" },
          { who: "Leah", voice: "ca-nu", text: "The headline result is that people in the first four rows did have higher marks on average, by about six per cent. So on the surface, the earlier studies were right." },
          { who: "Sam", voice: "uk-nam", text: "But this is the interesting part. When we looked at attendance, the front-row people were also the ones who came to almost every lecture. Once we compared students with similar attendance, the gap more or less disappeared. It went down to under one per cent, which is nothing." },
          { who: "Dr Okafor", voice: "au-nam", text: "That's a nice piece of analysis. And how do you interpret it?" },
          { who: "Sam", voice: "uk-nam", text: "Well, I'd say the seat doesn't do anything at all. Keen people sit at the front, keen people come to lectures, and keen people get good marks." },
          { who: "Dr Okafor", voice: "au-nam", text: "That's one reading. I'd be careful, though. You can't actually tell from this data that the seat does nothing. What you've shown is that you can't separate the seat from the kind of person who chooses it. People pick their own seats, so the two groups were never comparable to begin with." },
          { who: "Leah", voice: "ca-nu", text: "Self-selection." },
          { who: "Dr Okafor", voice: "au-nam", text: "Exactly. If you want to know what the seat itself does, you have to take the choice away from people." },
          { who: "Leah", voice: "ca-nu", text: "We did talk about that. We'd thought about a questionnaire asking people why they sit where they do, but that only tells you what people say about themselves. Then Dr Harker offered us one of his seminar groups next term, thirty students. We'd give them seats at random each week, so everyone spends some weeks at the front and some at the back, and then we'd compare their quiz scores." },
          { who: "Sam", voice: "uk-nam", text: "I wasn't keen at first. I assumed people would just swap. But if the lecturer reads out the seating plan, I don't think many will argue." },
          { who: "Dr Okafor", voice: "au-nam", text: "I think that's an excellent addition. Get it approved before term starts, though. Now, the draft. Let me go through it section by section. The introduction." },
          { who: "Sam", voice: "uk-nam", text: "Is it too long? I did wonder about moving the whole literature review into an appendix." },
          { who: "Dr Okafor", voice: "au-nam", text: "No, the reader needs it up front. It's what makes the question make sense. But it is too long. Two pages would do it, and you've got five." },
          { who: "Leah", voice: "ca-nu", text: "Fair enough. And the method?" },
          { who: "Dr Okafor", voice: "au-nam", text: "The method's clear, and I like that you explain the seating sheet and why you dropped the photographs. But there's no mention anywhere that the study went through the ethics committee. Examiners look for that, and you did go through it, so say so." },
          { who: "Leah", voice: "ca-nu", text: "What about the results? We weren't sure whether to put attendance first or the seat comparison first." },
          { who: "Dr Okafor", voice: "au-nam", text: "I was going to say you had them the wrong way round, but reading it again, no, the order works. The simple result, then the complication. What it's crying out for is a picture. A plan of the lecture theatre with the average marks shaded row by row would make the point in a second." },
          { who: "Sam", voice: "uk-nam", text: "And the discussion?" },
          { who: "Dr Okafor", voice: "au-nam", text: "That's where I'd push hardest. You write that sitting at the front has no effect on learning. Your data can't support that. Say that the advantage disappears once attendance is taken into account, which is true, and save the causal claim for after the experiment." },
          { who: "Sam", voice: "uk-nam", text: "And the appendix? It's mostly the raw counts." },
          { who: "Dr Okafor", voice: "au-nam", text: "It's fine. Clearly labelled, easy to find things. I wouldn't touch it." },
          { who: "Leah", voice: "ca-nu", text: "Great. Thanks, that's really helpful." },
        ],
      },
      { t: "p", text: "**Questions 21–25** — Choose the correct letter, **A, B or C**." },
      {
        t: "mcq",
        id: "t5d19-nghe-p3-chon",
        title: "Questions 21–25 — Multiple choice",
        items: [
          { q: "21. Why did the students choose this topic?", options: ["A  A lecturer asked them to investigate empty front rows.", "B  They wanted to check claims made in earlier research.", "C  They expected the data to be easy to collect."], correct: 1, why: "Leah: “I found a couple of published studies that do claim… That's really what made us want to test it”. A: Dr Harker chỉ phàn nàn, không giao việc. C: Sam nói dữ liệu “looked” dễ lấy — nhưng đó không phải lý do, và còn “wildly optimistic”." },
          { q: "22. What problem did they have with their first method?", options: ["A  It took too long to carry out.", "B  The photographs were not clear enough.", "C  It raised concerns about consent."], correct: 2, why: "“the ethics committee wasn't happy about taking photographs of people who hadn't agreed to it”. consent ≈ agreed. B bị bác thẳng: “the pictures were perfectly clear”." },
          { q: "23. What did they find about students who sat near the front?", options: ["A  Their advantage was largely explained by their attendance.", "B  They tended to arrive late to lectures.", "C  Their marks were lower than the earlier studies suggested."], correct: 0, why: "“Once we compared students with similar attendance, the gap more or less disappeared.” B: người đến muộn là những người KHÔNG điền phiếu." },
          { q: "24. What is Dr Okafor's view of the results?", options: ["A  They prove that seat position has no effect.", "B  They are based on too few students.", "C  They cannot show whether seat position matters."], correct: 2, why: "“You can't actually tell from this data that the seat does nothing… you can't separate the seat from the kind of person who chooses it.” A là ý của Sam — chính ý giảng viên sửa." },
          { q: "25. What do the students decide to add to their study?", options: ["A  a questionnaire about why students choose their seats", "B  an experiment in which seats are allocated randomly", "C  interviews with lecturers about seating"], correct: 1, why: "“We'd give them seats at random each week… compare their quiz scores” — Dr Okafor: “an excellent addition”. A bị loại: “that only tells you what people say about themselves”." },
        ],
      },
      { t: "p", text: "**Questions 26–30** — What comment does Dr Okafor make about each section of the students' report? Choose **FIVE** answers from the list, **A–G**." },
      {
        t: "table",
        head: ["", "Comments"],
        rows: [
          ["A", "It needs to be shorter."],
          ["B", "It would benefit from a diagram."],
          ["C", "It is in the wrong order."],
          ["D", "It should mention ethical approval."],
          ["E", "Its claims are too strong."],
          ["F", "It is well organised."],
          ["G", "It should be moved to the appendix."],
        ],
      },
      {
        t: "quiz",
        id: "t5d19-nghe-p3-ghep",
        kind: "fill",
        title: "Questions 26–30 — viết chữ cái A–G",
        items: [
          { q: "26. Introduction", answers: ["A"], hint: "“the reader needs it up front… But it is too long. Two pages would do it”. Bẫy G: Sam đề xuất chuyển vào phụ lục, giảng viên nói No." },
          { q: "27. Method", answers: ["D"], hint: "“there's no mention anywhere that the study went through the ethics committee… so say so”." },
          { q: "28. Results", answers: ["B"], hint: "“I was going to say you had them the wrong way round, but… no, the order works… What it's crying out for is a picture.” Bẫy C: ý bị chính người nói rút lại." },
          { q: "29. Discussion", answers: ["E"], hint: "“You write that sitting at the front has no effect on learning. Your data can't support that.” too strong = khẳng định nhân quả quá mức." },
          { q: "30. Appendix", answers: ["F"], hint: "“Clearly labelled, easy to find things. I wouldn't touch it.” well organised ≈ clearly labelled, easy to find things." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Đề nhỏ — Part 4, Questions 31–40 (≈ 6 phút)" },
      { t: "p", text: "Bạn có 45 giây đọc ghi chú. Đọc các tiêu đề nhỏ trước: đó là bốn phần của bài giảng. Mỗi câu **ONE WORD ONLY**." },
      {
        t: "listen",
        id: "t5d19-nghe-p4",
        title: "Part 4 — Lecture: Darwin and the earthworm",
        dan: { so: "Day 19, Recording 2", boiCanh: "part of a lecture in a soil science course about Charles Darwin's work on earthworms and what has been learned since.", cau: [31, 40] },
        note: "Khoảng 5 phút 30 giây, ~175 từ/phút. Giảng viên: giọng New Zealand (nữ).",
        lines: [
          { who: "Lecturer", voice: "nz-nu", text: "Good morning. Today I want to look at a book that most people have never heard of, by an author everyone has heard of. In 1881, about six months before he died, Charles Darwin published a book about earthworms. It sounds like a small, rather eccentric subject for the man who had given us the theory of evolution, but Darwin had been thinking about worms for more than forty years, and the book made an argument that was every bit as ambitious as his better-known work: that these small, unglamorous animals had shaped the landscape of England." },
          { who: "Lecturer", voice: "nz-nu", text: "Let me start with the experiments, because they're wonderful, and many of them were carried out on a table in his study with help from his family. Darwin kept worms in pots of soil and simply watched what they did. He found that although worms have no eyes, they react to strong light. Shine a bright lamp on a worm at night and it will rush back into its burrow, though not every time, and not to a dim light. Hearing was a different matter. Darwin had his son play the bassoon to the worms, he whistled at them, he shouted, and he reported that they took no notice whatsoever. But when he placed their pots on top of the piano and struck a note, the worms withdrew at once. They weren't hearing the sound. What they responded to was the vibration travelling through the wood." },
          { who: "Lecturer", voice: "nz-nu", text: "The experiment Darwin seems to have enjoyed most concerned the way worms drag leaves into their burrows to block the entrance and to feed on. You might expect a worm to seize a leaf anywhere, or by the stalk, the obvious handle. Darwin found that worms usually pulled leaves in by the tip, the narrow end, which is the end that fits most easily into a narrow hole. To find out whether this was just a reflex triggered by the shape of particular leaves, he cut out triangles of paper, rubbed them with fat so the worms would take an interest, and scattered them on the soil. The worms mostly took hold of the triangles at the sharpest corner. From this Darwin concluded, rather daringly, that worms showed a degree of intelligence. Not much, he was careful to say, but more than a mere automatic response." },
          { who: "Lecturer", voice: "nz-nu", text: "Now, the second part of the book moves from the pot to the landscape. Worms swallow soil and leave it on the surface as small piles called casts. Darwin collected and weighed these casts over many years and estimated that worms were bringing many tonnes of fine earth to the surface of every acre each year. Over time, that layer of new soil buries whatever lies on top of it. To measure how quickly, Darwin and his family set a heavy stone in the garden, and his son Horace, who was an engineer, built an instrument that measured how far the stone sank into the ground. It was very slow, a couple of millimetres a year, but steady. This, Darwin argued, explained something that had puzzled visitors to ancient sites: why the floors of Roman buildings, sometimes with their mosaics still intact, were found well below the surface, even where the tops of the walls were still standing. People had assumed the floors had been deliberately buried, or covered by floods. Darwin's answer was that worms had buried them, a little at a time, over centuries." },
          { who: "Lecturer", voice: "nz-nu", text: "The book sold remarkably well, and then, as a scientific subject, earthworms went rather quiet for a long time. If Darwin's successors had followed his lead, I suspect soil science would be a good deal more advanced than it is today. But they have come back. Let me give you two examples. The first is a practice in the southern United States called worm grunting. People drive a wooden stake into the ground and rub it with a flat piece of metal, which sends a strong vibration through the soil, and within minutes hundreds of worms come up to the surface, where they're collected and sold as fishing bait. For a long time the explanation people offered was that the vibration felt like rain. In 2008, though, a biologist showed that the vibrations closely resemble those made by moles digging underground. Moles eat worms. So the worms are coming up to escape a predator that isn't there. Darwin, who had put worms on a piano, would have loved it." },
          { who: "Lecturer", voice: "nz-nu", text: "The second example is less cheerful. Ecologists now describe earthworms as ecosystem engineers, because they change the physical structure of the soil itself, and an engineer, of course, can do damage as well as good. In much of the north of North America, glaciers during the last ice age seem to have wiped out native earthworms, and the forests that grew back developed without them. European worms have since arrived, carried in the soil of imported plants and released by people fishing. In those forests, the worms consume the thick layer of leaf litter on the forest floor, and plants and animals that depend on that layer have declined. So the same animal that Darwin praised for building the soil of English fields is, in another place, taking a forest's soil apart. Which brings me to the question for next week's reading: is there any such thing as a beneficial species, or only a species in the right place?" },
        ],
      },
      {
        t: "note",
        title: "Darwin and the earthworm — notes",
        items: [
          "**Darwin's experiments:** worms have no eyes, but react to strong **31** ___ · did not respond to music, but reacted to **32** ___ when their pots were placed on a piano",
          "**Leaves:** usually pulled into burrows by the **33** ___ · tested using triangles of **34** ___ · Darwin concluded worms show a degree of **35** ___",
          "**Worms and the landscape:** an instrument built by Darwin's **36** ___ measured how fast a stone sank · explained why the **37** ___ of Roman buildings lie below the surface",
          "**Modern research:** in worm grunting, vibrations are similar to those made by **38** ___ · worms are now called ecosystem **39** ___ · in northern North American forests, introduced worms consume the leaf **40** ___",
        ],
      },
      {
        t: "quiz",
        id: "t5d19-nghe-p4-ghi-chu",
        kind: "fill",
        title: "Questions 31–40 — ONE WORD ONLY",
        items: [
          { q: "31", answers: ["light"], hint: "“although worms have no eyes, they react to strong light”. Nhiễu: dim light (yếu) thì KHÔNG phản ứng." },
          { q: "32", answers: ["vibration", "vibrations"], hint: "“They weren't hearing the sound. What they responded to was the vibration travelling through the wood.” Bẫy: sound / note được nói trước rồi bị bác." },
          { q: "33", answers: ["tip"], hint: "“You might expect… by the stalk, the obvious handle. Darwin found… by the tip, the narrow end”. stalk là chữ bị bác." },
          { q: "34", answers: ["paper"], hint: "“he cut out triangles of paper, rubbed them with fat”. Nhiễu: fat (thứ bôi lên, không phải vật liệu)." },
          { q: "35", answers: ["intelligence"], hint: "“Darwin concluded, rather daringly, that worms showed a degree of intelligence.” Chép đúng chính tả: hai chữ l." },
          { q: "36", answers: ["son"], hint: "“his son Horace, who was an engineer, built an instrument”. Nhiễu: family (cả nhà đặt đá; con trai làm dụng cụ). Lưu ý: một người con khác thổi kèn bassoon ở đoạn đầu." },
          { q: "37", answers: ["floors"], hint: "“the floors of Roman buildings… were found well below the surface, even where the tops of the walls were still standing”. Bẫy walls: tường vẫn đứng trên mặt đất — thứ bị chôn là sàn. mosaics nằm TRÊN sàn, không phải thứ bị hỏi." },
          { q: "38", answers: ["moles"], hint: "“the vibrations closely resemble those made by moles digging underground”. Bẫy: rain là lời giải thích CŨ bị bác (“For a long time the explanation… was… rain. In 2008, though…”)." },
          { q: "39", answers: ["engineers"], hint: "“Ecologists now describe earthworms as ecosystem engineers”. Số nhiều theo câu ghi chú (worms are now called…)." },
          { q: "40", answers: ["litter"], hint: "“the worms consume the thick layer of leaf litter on the forest floor”." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Chấm 20 câu — và bẫy nằm ở đâu" },
      {
        t: "table",
        head: ["Đúng / 20", "Nghĩa là (ước tính, quy về Part 3 + 4 của một đề thật)", "Việc tiếp"],
        rows: [
          ["19–20", "mức band 8.5+ ở hai Part khó nhất", "Ngày 20 nghe bài giảng 10 phút giọng vùng — giữ nhịp."],
          ["17–18", "đúng đích band 8", "Xem câu sai là Part 3 hay Part 4; đọc lại lời thoại đúng đoạn đó."],
          ["14–16", "band 7–7.5", "Gần như chắc bị bẫy “ý bị rút lại” (26 · 28) hoặc “chữ bị bác” (32 · 33 · 38)."],
          ["dưới 14", "≤ band 6.5 ở Part 3 + 4", "Nghe lại từng đoạn có lời thoại, ghi chữ tín hiệu: though · but · no, · actually."],
        ],
        caption: "Hai Part cuối chiếm 20/40 câu và là nơi người band 7 mất điểm nhiều nhất",
      },
      {
        t: "table",
        head: ["Kiểu bẫy", "Câu", "Chữ tín hiệu"],
        rows: [
          ["Ý của sinh viên bị giảng viên sửa", "24 · 26", "“That's one reading. I'd be careful, though.” · “No, the reader needs it up front.”"],
          ["Người nói tự rút lại ý của mình", "28", "“I was going to say…, but reading it again, no, …”"],
          ["Chữ được nói rồi bác", "22 · 32 · 33 · 38", "perfectly clear · They weren't hearing the sound · You might expect… · For a long time the explanation… though"],
          ["Hai thứ cùng loại, đề hỏi một", "36 · 37", "family / son · walls / floors — tường còn đứng, sàn bị chôn"],
        ],
        caption: "Ghi kiểu bẫy cạnh từng câu sai trong Sổ lỗi",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Từ nghe sang nói — ba động tác của câu trả lời Part 3 band 8" },
      {
        t: "p",
        text: "Dr Okafor không chỉ nói ý mình. Ông ==tóm ý của Sam (“That's one reading”), phản hồi có giới hạn (“I'd be careful, though”), rồi giả định (“If you want to know…, you have to…”)==. Giảng viên bài Part 4 cũng làm vậy: nêu cách giải thích cũ, bác bằng bằng chứng, rồi giả định (“If Darwin's successors had followed his lead…”). Đó chính là khuôn một câu trả lời Part 3 band 8 khi câu hỏi có dạng “Some people say… What do you think?” hoặc “Why do you think…?”.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Một câu trả lời Part 3 — 40 đến 50 giây",
        steps: [
          { label: "Tóm", sub: "nêu lại cách nhìn phổ biến bằng lời của bạn" },
          { label: "Phản hồi có giới hạn", sub: "đúng đến đâu · sai ở chỗ nào" },
          { label: "Lý do / ví dụ", sub: "một cơ chế hoặc một ví dụ cụ thể" },
          { label: "Giả định", sub: "If… had… would now… / Without… would…" },
          { label: "Chốt", sub: "một câu ngắn, giữ lập trường" },
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "The usual assumption is that S V, and there's something in that.", vi: "Tóm một cách nhìn rồi thừa nhận phần đúng.", examples: [{ en: "The usual assumption is that sitting at the front makes you a better student, and there's something in that.", vi: "Người ta thường cho rằng ngồi bàn đầu khiến bạn học tốt hơn, và điều đó cũng có phần đúng." }] },
          { formula: "That's true up to a point, but what it leaves out is N / that S V.", vi: "Phản hồi có giới hạn — dùng câu chẻ của Ngày 13.", examples: [{ en: "That's true up to a point, but what it leaves out is the kind of person who chooses that seat.", vi: "Điều đó đúng ở một mức, nhưng cái nó bỏ sót là kiểu người chọn chỗ ngồi đó." }] },
          { formula: "If S had V3, S would (probably) now V / be V-ing.", vi: "Giả định quá khứ → hiện tại (Bài 1 mục 2).", examples: [{ en: "If schools had taught basic statistics earlier, people would probably be much less easily fooled by headlines now.", vi: "Nếu trường học dạy thống kê cơ bản sớm hơn, giờ đây có lẽ người ta đã ít bị các dòng tít đánh lừa hơn nhiều." }] },
          { formula: "Without N, S would V. / Take away N and S V.", vi: "Giả định ngầm — gọn hơn if khi nói.", examples: [{ en: "Take away the choice, and you find out what the seat itself does.", vi: "Bỏ quyền chọn đi, và bạn sẽ biết chỗ ngồi tự nó có tác dụng gì." }] },
          { formula: "So, on balance, I'd say S V — at least until N.", vi: "Chốt có giới hạn thời gian / bằng chứng.", examples: [{ en: "So, on balance, I'd say the seat matters far less than people think, at least until someone runs a proper experiment.", vi: "Vậy nhìn chung, tôi cho rằng chỗ ngồi ít quan trọng hơn người ta nghĩ nhiều, ít nhất là cho tới khi có ai làm một thí nghiệm đàng hoàng." }] },
        ],
      },
      { t: "rule", formula: "The usual assumption is… → true up to a point, but what it leaves out is… → because / for example… → If S had V3, S would now V → So, on balance, …", vi: "Năm bước, 40–50 giây; mỗi câu Part 3 chỉ cần MỘT câu giả định." },
      {
        t: "dialogue",
        title: "Cùng một câu hỏi — band 7 và band 8 (ước tính)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do you think people so often assume that one thing causes another, just because the two happen together?", vi: "Theo bạn vì sao người ta hay cho rằng cái này gây ra cái kia chỉ vì hai thứ xảy ra cùng lúc?" },
          { who: "Candidate (band 7)", role: "a", text: "I think it's because people are busy and they don't have time to check everything. For example, if they read that people who drink coffee live longer, they will believe that coffee makes them live longer. If they would think more carefully, they will understand that maybe there are other reasons. So I think education is very important to solve this problem.", vi: "Tôi nghĩ vì người ta bận và không có thời gian kiểm mọi thứ. Ví dụ đọc thấy người uống cà phê sống lâu hơn thì họ tin cà phê làm họ sống lâu. Nếu họ nghĩ kỹ hơn họ sẽ hiểu có thể có lý do khác. Nên tôi nghĩ giáo dục rất quan trọng để giải quyết vấn đề này." },
          { who: "Candidate (band 8)", role: "candidate", text: "I suppose the usual explanation is that people are lazy thinkers, and there's something in that. But what it leaves out is that a cause is simply a better story. If you read that students in the front row get higher marks, “the seat helps” is a neat explanation, whereas “keen students choose the front, and keen students do well anyway” is much less satisfying, even though it's probably closer to the truth. And I think the media make it worse. Had newspapers been in the habit of saying “linked to” rather than “causes”, I suspect we'd now be a lot more sceptical as readers. So, on balance, it's less about laziness than about preferring stories, at least until someone shows us the experiment.", vi: "Tôi cho rằng cách giải thích thường gặp là người ta lười suy nghĩ, và điều đó cũng có phần đúng. Nhưng cái nó bỏ sót là một nguyên nhân thì đơn giản là một câu chuyện hay hơn. Nếu bạn đọc rằng sinh viên ngồi hàng đầu được điểm cao hơn, “chỗ ngồi có ích” là một lời giải thích gọn gàng, còn “sinh viên chăm chọn ngồi trên, và sinh viên chăm vốn đã học tốt” thì kém hấp dẫn hơn nhiều, dù nó có lẽ gần sự thật hơn. Và tôi nghĩ báo chí làm cho chuyện tệ thêm. Giá như báo chí quen viết “có liên quan tới” thay vì “gây ra”, tôi đoán giờ đây chúng ta đã là những người đọc hoài nghi hơn nhiều. Vậy nhìn chung, chuyện này ít do lười hơn là do thích câu chuyện, ít nhất cho tới khi có người cho ta xem thí nghiệm." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["FC", "một ý (bận) + một ví dụ + kết luận chung chung (education)", "tóm → phản hồi có giới hạn → cơ chế → giả định → chốt; mạch không đứt"],
          ["LR", "check everything · other reasons · very important", "lazy thinkers · a neat explanation · much less satisfying · in the habit of · sceptical"],
          ["GRA", "If they **would** think…, they **will** understand (sai thì)", "câu chẻ what it leaves out is · whereas · đảo ngữ **Had newspapers been…, we'd now be…** (hỗn hợp)"],
          ["P", "đọc đều, would nói đủ /wʊd/", "we'd now be /wiːd naʊ biː/ — dạng yếu, nhấn vào now và sceptical"],
        ],
        caption: "Khác nhau không ở độ dài mà ở ba động tác",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — ba cách “giả định” làm mất điểm khi nói",
        items: [
          "~~If they would think more carefully, they will understand.~~ Hai lỗi trong một câu. Nói: **If they thought** more carefully, they **would** understand.",
          "Giả định không có thật mà dùng thì hiện tại: ~~If schools teach statistics, people are not fooled.~~ — nghe như bạn đang kể một sự thật.",
          "Dồn ba câu If liền nhau. Một câu If là đủ; câu sau đổi sang **Without… / Take away… and…**.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. 🔊 Phát âm: dạng yếu trong câu giả định — would've · wouldn't have · if I'd" },
      {
        t: "p",
        text: "Khi nói, người bản ngữ gần như không bao giờ nói đủ “would have”. Họ nói ==/wʊdəv/== (would've), ==/wʊdntəv/== (wouldn't have), ==/aɪd/== (I'd = I would hoặc I had). Người Việt hay nói đủ từng chữ, nghe chậm và như đọc; hoặc nuốt mất cả have, nghe như sai thì (would go thay vì would've gone). Hai lỗi đều làm giảm điểm P và FC.",
      },
      {
        t: "table",
        head: ["Viết đủ", "Nói", "Lưu ý"],
        rows: [
          ["would have", "**would've** /wʊdəv/", "have → /əv/; không viết “would of” trong bài viết"],
          ["wouldn't have", "**wouldn't have** /wʊdntəv/", "t gần như nuốt vào âm /ə/ sau"],
          ["could have · might have · should have", "/kʊdəv/ · /maɪtəv/ · /ʃʊdəv/", "nhấn vào V3 phía sau, không nhấn have"],
          ["I had (known) · I would (go)", "**I'd** /aɪd/ cho cả hai", "phân biệt bằng động từ sau: I'd known (had) / I'd go (would)"],
          ["Had I known…", "**Had** đọc mạnh /hæd/", "đảo ngữ: trợ động từ đứng đầu thì KHÔNG đọc yếu"],
        ],
        caption: "Dạng yếu — nghe được mới nghe kịp bài nghe, nói được mới tự nhiên",
      },
      {
        t: "phatam",
        id: "t5d19-phat-am",
        title: "Luyện phát âm — dạng yếu của would have / had trong câu giả định",
        note: "Mỗi câu đọc hai lần: lần một chậm, cố ý nói /əv/ thay cho have; lần hai ở tốc độ nói thường. Máy chấm từng âm — xem lại âm có bị đọc đủ /hæv/ không.",
        items: [
          { text: "If I'd known, I'd have told you.", ipa: "ɪf aɪd nəʊn aɪd əv təʊld juː", vi: "Nếu tôi biết thì tôi đã nói với bạn rồi. (I'd thứ nhất = I had, thứ hai = I would)" },
          { text: "She would've come if she'd been asked.", ipa: "ʃiː wʊdəv kʌm ɪf ʃiːd biːn ɑːskt", vi: "Cô ấy đã đến nếu được mời." },
          { text: "We wouldn't have noticed without the data.", ipa: "wiː wʊdnt əv nəʊtɪst wɪðaʊt ðə deɪtə", vi: "Không có dữ liệu thì chúng tôi đã không nhận ra." },
          { text: "It might have been different if we'd started earlier.", ipa: "ɪt maɪt əv biːn dɪfrənt ɪf wiːd stɑːtɪd ɜːliə", vi: "Mọi chuyện có thể đã khác nếu chúng ta bắt đầu sớm hơn." },
          { text: "They could have sat at the front.", ipa: "ðeɪ kʊd əv sæt ət ðə frʌnt", vi: "Họ lẽ ra đã có thể ngồi ở hàng đầu." },
          { text: "If it weren't for the rain, we'd be outside.", ipa: "ɪf ɪt wɜːnt fə ðə reɪn wiːd biː aʊtsaɪd", vi: "Nếu không vì mưa thì chúng tôi đã ở ngoài trời." },
          { text: "I'd rather you didn't.", ipa: "aɪd rɑːðə juː dɪdnt", vi: "Tôi mong là bạn đừng làm vậy. (would rather + quá khứ)" },
          { text: "Had I known, I wouldn't have gone.", ipa: "hæd aɪ nəʊn aɪ wʊdnt əv ɡɒn", vi: "Giá mà tôi biết, tôi đã không đi. (Had đọc mạnh)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d19-noi-dang-yeu",
        title: "Dạng yếu — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. Bạn nghe: “I'd gone home by then.” I'd ở đây là:", options: ["A  I would", "B  I had", "C  I did"], correct: 1, why: "Sau I'd là V3 (gone) ⇒ I had. Sau I'd là V nguyên mẫu (go) ⇒ I would." },
          { q: "2. Cách nói tự nhiên nhất của “We should have checked” là:", options: ["A  /wiː ʃʊd hæv tʃekt/ — đủ âm, nhấn have", "B  /wiː ʃʊdəv tʃekt/ — have yếu, nhấn checked", "C  /wiː ʃʊd tʃek/ — bỏ have"], correct: 1, why: "have yếu thành /əv/, trọng âm rơi vào động từ chính. C bỏ have làm câu đổi nghĩa (lời khuyên hiện tại)." },
          { q: "3. Trong bài viết, câu nào đúng?", options: ["A  If we had known, we would of acted.", "B  If we had known, we would've acted.", "C  If we had known, we would have acted."], correct: 2, why: "would of là lỗi chính tả do nghe dạng yếu; would've là dạng nói, tránh trong Task 2. Viết đủ would have." },
          { q: "4. “Had they asked, we'd have helped.” Chữ nào đọc mạnh?", options: ["A  Had và asked, helped", "B  have", "C  we'd"], correct: 0, why: "Trợ động từ đảo lên đầu (Had) đọc mạnh; hai động từ chính mang nội dung. have ở giữa đọc /əv/." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện: mượn nội dung bài nghe, không mượn lời",
        items: [
          "Câu 1 và 2 dùng được nghiên cứu chỗ ngồi; câu 3 và 4 dùng được bài giảng về giun đất. Mượn Ý, nói bằng lời của bạn — giám khảo không biết bạn vừa nghe gì.",
          "Mỗi câu 40–50 giây, đủ năm bước. Câu 4 bắt buộc có một câu điều kiện hỗn hợp.",
          "Nghe lại bản ghi: đếm số câu If. Quá hai trong một câu trả lời ⇒ nói lại, đổi một câu sang Without / Take away… and….",
        ],
      },
      { t: "speak", id: "t5d19-noi-p3", part: "3", questions: ["Why do you think people so often assume that one thing causes another, simply because the two happen together?", "How much does the physical environment of a classroom affect how well people learn?", "Why do you think small, unglamorous creatures receive far less attention than large animals?", "If scientists had paid more attention to soil a century ago, how might farming be different today?", "Is it better for a scientist to spend decades on one narrow question, or to move between many different topics?"] },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Chép nguyên văn câu giả định hay nhất của bạn hôm nay (một câu). Hôm sau đọc lại, tự hỏi: “nếu cái gì — lúc nào — hệ quả lúc nào?”.",
          "Chép một cách mở đầu “tóm” và một cách “phản hồi có giới hạn” mà bạn chưa từng dùng, ví dụ “There's something in that, but…”.",
          "Ghi số câu đúng của đề nhỏ (…/20) và kiểu bẫy đã dính.",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Từ vựng hữu ích từ hai bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "self-selection", pos: "n", ipa: "/ˌself sɪˈlekʃn/", vi: "sự tự chọn (người tham gia tự quyết định vào nhóm nào, làm lệch kết quả)", ex: "Self-selection means the two groups were never comparable.", exVi: "Sự tự chọn khiến hai nhóm ngay từ đầu đã không so sánh được với nhau.", more: "self-selection bias · a self-selected sample · Part 3: That might just be self-selection." },
          { w: "wildly optimistic", pos: "adj phr", ipa: "/ˌwaɪldli ɒptɪˈmɪstɪk/", vi: "lạc quan quá mức", ex: "Our first estimate turned out to be wildly optimistic.", exVi: "Ước tính đầu tiên của chúng tôi hoá ra lạc quan quá mức.", more: "wildly inaccurate / exaggerated · trái: overly cautious · nói đùa về chính mình rất tự nhiên" },
          { w: "on the surface", pos: "phr", ipa: "/ɒn ðə ˈsɜːfɪs/", vi: "thoạt nhìn, bề ngoài", ex: "On the surface, the earlier studies were right.", exVi: "Thoạt nhìn thì các nghiên cứu trước đúng.", more: "báo hiệu “nhưng thật ra…” sắp tới · gần nghĩa: at first sight, superficially" },
          { w: "be crying out for", pos: "phr v", ipa: "/biː ˈkraɪɪŋ aʊt fə(r)/", vi: "rất cần, đang “gào lên” đòi", ex: "The results section is crying out for a diagram.", exVi: "Phần kết quả đang rất cần một sơ đồ.", more: "This city is crying out for better public transport. · dùng khi nói, Part 3; tránh trong Task 2" },
          { w: "unglamorous", pos: "adj", ipa: "/ʌnˈɡlæmərəs/", vi: "không hào nhoáng, ít ai chú ý", ex: "Worms are small, unglamorous animals that shaped the landscape.", exVi: "Giun là loài vật nhỏ bé, chẳng hào nhoáng mà đã định hình cảnh quan.", more: "an unglamorous job / task · glamorous (adj) · glamour (n)" },
          { w: "burrow", pos: "n / v", ipa: "/ˈbʌrəʊ/", vi: "hang (đào dưới đất); đào hang", ex: "Shine a bright light and the worm rushes back into its burrow.", exVi: "Chiếu đèn sáng là con giun vội chui lại vào hang.", more: "burrow into the soil · rabbits live in burrows · nghĩa bóng: burrow into a pile of papers" },
          { w: "ecosystem engineer", pos: "n phr", ipa: "/ˈiːkəʊsɪstəm ˌendʒɪˈnɪə(r)/", vi: "loài “kỹ sư hệ sinh thái” (làm thay đổi môi trường sống vật lý)", ex: "Ecologists describe earthworms and beavers as ecosystem engineers.", exVi: "Các nhà sinh thái học gọi giun đất và hải ly là kỹ sư hệ sinh thái.", more: "khác keystone species (loài then chốt — Ngày 20) · dùng tốt trong Task 2 về môi trường" },
          { w: "leaf litter", pos: "n phr", ipa: "/ˈliːf ˌlɪtə(r)/", vi: "lớp lá rụng phủ mặt đất rừng", ex: "Introduced worms consume the leaf litter on the forest floor.", exVi: "Giun ngoại lai ăn mất lớp lá rụng trên mặt đất rừng.", more: "⚠️ litter một mình (không có leaf) = rác vứt bừa ở nơi công cộng" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d19-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 19 — điều kiện hỗn hợp · điều kiện ngầm · thức giả định · dấu câu · đọc ý người viết · nghe ai đổi ý · dạng yếu would've",
    goal: "Ôn trọn Ngày 19: chia đúng thời gian trong câu điều kiện hỗn hợp, viết giả định không có if, dùng thức giả định trong câu đề xuất, đặt đúng tám dấu câu của câu dài, đọc một bài lập luận ngắn để biết ý người viết, nghe một đoạn hội thoại có người đổi ý — 44 câu có đáp án, một đoạn đề xuất AI chấm và ba câu Part 3 ghi âm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay",
        items: [
          "Phần I–V ôn Bài 1 (30 câu): hỗn hợp · ngầm · giả định · dấu câu · dịch.",
          "Phần VI ôn Bài 2 (5 câu): một bài lập luận ngắn — YES / NO / NOT GIVEN theo ý người viết.",
          "Phần VII ôn Bài 3 (4 câu): nghe hai người, một người đổi ý. Phần VIII: từ vựng của ngày (5 câu).",
          "Phần IX: viết một đoạn đề xuất 120–150 từ (AI chấm). Phần X: nói ba câu Part 3 có giả định.",
          "Đạt: ≥ 35/44. Dưới 70 % ở phần nào thì mở lại mục ghi trong tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 19 trong một hình",
        center: "Giả định **đúng thời gian** + dấu câu **đúng cấu trúc**",
        branches: [
          { label: "Điều kiện hỗn hợp", items: ["had V3 → would now V", "would now be V-ing", "were → would have V3"] },
          { label: "Điều kiện ngầm", items: ["But for / Without + N", "; otherwise,", "A ban would…"] },
          { label: "Thức giả định", items: ["recommend that S be V3", "that S not V", "It is high time S V-ed"] },
          { label: "Dấu câu", items: ["S dài + V (không phẩy)", "; however,", "1,500 · 2.5 · long-term"] },
          { label: "Nói Part 3", items: ["tóm → phản hồi → giả định", "would've /wʊdəv/", "if I'd /ɪf aɪd/"] },
        ],
      },

      { t: "h", text: "I. Điều kiện hỗn hợp — viết dạng đúng của động từ trong ngoặc (8 câu) — ôn Bài 1 mục 2" },
      {
        t: "quiz",
        id: "t5d19-bt-hon-hop",
        kind: "fill",
        title: "I. Viết dạng đúng của động từ trong ngoặc",
        grammar: "If S had V3 → S would (now) V · would now be V-ing · If S were / V-ed → S would have V3",
        items: [
          { q: "1. If the council had planted trees along this road twenty years ago, it ___ (be) much cooler today.", answers: ["would be"], hint: "quá khứ → hiện tại (today)." },
          { q: "2. If she ___ (not / move) to Hanoi, she would never have met her business partner.", answers: ["had not moved", "hadn't moved"], hint: "Việc trái thật trong quá khứ ⇒ had not V3." },
          { q: "3. Had the warnings been taken seriously, thousands of families ___ (not / live) in temporary shelters now.", answers: ["would not be living", "wouldn't be living"], hint: "Tình trạng đang kéo dài ⇒ would not be V-ing." },
          { q: "4. If I ___ (be) more confident, I would have applied for the scholarship last year.", answers: ["were", "was"], hint: "Đặc điểm hiện tại (không tự tin) → việc quá khứ ⇒ were (văn trang trọng) / was (khi nói)." },
          { q: "5. If the company were better managed, it ___ (not / lose) so many customers last year.", answers: ["would not have lost", "wouldn't have lost"], hint: "hiện tại → quá khứ (last year) ⇒ would not have V3." },
          { q: "6. If they had booked earlier, they ___ (sit) in the front row tonight.", answers: ["would be sitting", "would sit"], hint: "quá khứ → tương lai gần (tonight) ⇒ would be sitting (tiếp diễn tự nhiên hơn)." },
          { q: "7. If the region ___ (not / depend) so heavily on coal, the mine's closure would not have hit it so hard.", answers: ["did not depend", "didn't depend"], hint: "Đặc điểm thường trực ⇒ quá khứ đơn (did not depend)." },
          { q: "8. Earlier treatment ___ (might / save) his sight, but nobody noticed the symptoms in time.", answers: ["might have saved"], hint: "Giả định nằm trong chủ ngữ; quá khứ + mức có thể ⇒ might have V3." },
        ],
      },

      { t: "h", text: "II. Điều kiện ngầm — chọn phương án đúng (5 câu) — ôn Bài 1 mục 3" },
      {
        t: "mcq",
        id: "t5d19-bt-ngam",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. ___ the generosity of local donors, the library would have closed in 2019.", options: ["Without", "Unless", "Despite", "Except"], correct: 0, why: "Without + N = nếu không có. Unless cần mệnh đề; Despite / Except sai nghĩa." },
          { q: "2. The deadline was extended; ___, half the teams would not have finished.", options: ["however", "otherwise", "therefore", "moreover"], correct: 1, why: "otherwise = nếu không (gia hạn) thì." },
          { q: "3. A sudden ban on plastic packaging ___ chaos for small food businesses.", options: ["causes", "will have caused", "would cause", "had caused"], correct: 2, why: "Chủ ngữ là danh từ mang giả định ⇒ would + V." },
          { q: "4. Which sentence is correct?", options: ["But for the government helps, many farms would close.", "But for government support, many farms would close.", "But for government supported, many farms would close.", "But for that government support, many farms close."], correct: 1, why: "But for + cụm danh từ. D sai thì (would close)." },
          { q: "5. ___ the train be delayed, passengers will receive a full refund.", options: ["Should", "Would", "Had", "Unless"], correct: 0, why: "Should + S + V = If S V (trang trọng, điều kiện có thể xảy ra)." },
        ],
      },

      { t: "h", text: "III. Thức giả định — viết dạng đúng của từ trong ngoặc (6 câu) — ôn Bài 1 mục 4" },
      {
        t: "quiz",
        id: "t5d19-bt-gia-dinh",
        kind: "fill",
        title: "III. Viết dạng đúng của động từ trong ngoặc",
        grammar: "recommend / insist / essential that + S + (not) V · It is (high) time S V-ed · would rather S V-ed",
        items: [
          { q: "1. The doctor insisted that the patient ___ (stay) in hospital for another week.", answers: ["stay", "should stay"], hint: "insist that + S + V nguyên mẫu trần." },
          { q: "2. It is vital that every child ___ (teach) how to swim.", answers: ["be taught", "should be taught"], hint: "Bị động của giả định: be + V3." },
          { q: "3. The union demanded that the factory ___ (not / close) before an agreement was reached.", answers: ["not close", "should not close"], hint: "Phủ định: not + V." },
          { q: "4. It's high time the city ___ (do) something about the traffic.", answers: ["did"], hint: "It's high time + S + V-ed." },
          { q: "5. I'd rather you ___ (not / tell) anyone about this yet.", answers: ["did not tell", "didn't tell"], hint: "would rather + S + V-ed (quá khứ không thật)." },
          { q: "6. The recommendation that all new homes ___ (fit) with heat pumps has been controversial.", answers: ["be fitted", "should be fitted"], hint: "Danh từ recommendation + that + S + be V3." },
        ],
      },

      { t: "h", text: "IV. Dấu câu — câu nào đúng? (6 câu) — ôn Bài 1 mục 5" },
      {
        t: "mcq",
        id: "t5d19-bt-dau-cau",
        title: "IV. Chọn câu đúng dấu câu",
        items: [
          { q: "1.", options: ["Everyone who attended the workshop, received a certificate.", "Everyone who attended the workshop received a certificate.", "Everyone, who attended the workshop received a certificate."], correct: 1, why: "① Không phẩy giữa chủ ngữ dài và động từ; who attended… là mệnh đề xác định, không phẩy." },
          { q: "2.", options: ["The scheme was popular; however, it was expensive to run.", "The scheme was popular, however it was expensive to run.", "The scheme was popular however, it was expensive to run."], correct: 0, why: "③ ; however, nối hai mệnh đề độc lập." },
          { q: "3.", options: ["Three factors explain this: cost, distance and habit.", "The factors are: cost, distance and habit.", "Factors such as: cost, distance and habit explain this."], correct: 0, why: "⑤ Dấu hai chấm sau mệnh đề đủ; không đặt sau are / such as." },
          { q: "4. Task 1: “Doanh số đạt 3,75 triệu đơn vị năm 2020.”", options: ["Sales reached 3,75 million units in 2020.", "Sales reached 3.75 million units in 2020.", "Sales reached 3.75 millions units in 2020."], correct: 1, why: "⑧ Thập phân dùng dấu chấm; million không thêm s sau số." },
          { q: "5.", options: ["It was a well thought out plan.", "It was a well-thought-out plan.", "The plan was well-thought-out and well-funded in the long-term."], correct: 1, why: "⑦ Tính từ ghép đứng trước danh từ có gạch nối; sau động từ be thường không gạch, và in the long term không gạch." },
          { q: "6.", options: ["The city and it's residents benefited.", "The city and its residents benefited.", "The city and its' residents benefited."], correct: 1, why: "⑧ its = của nó; it's = it is; its' không tồn tại." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–5" },
      {
        t: "quiz",
        id: "t5d19-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng cấu trúc trong gợi ý",
        items: [
          { q: "Nếu tôi chọn ngành khác hồi năm 2022, giờ này tôi đã đi làm rồi.", answers: ["If I had chosen a different major in 2022, I would be working now.", "If I had chosen a different major in 2022, I would already be working now.", "If I had chosen another major in 2022, I would be working by now.", "If I had chosen a different major in 2022, I would already be working."], hint: "had V3 → would (already) be working (now)" },
          { q: "Nếu không có bản đồ trên điện thoại, chúng tôi đã lạc từ lâu rồi.", answers: ["Without the map on our phones, we would have got lost long ago.", "Without the map on our phones, we would have gotten lost long ago.", "Without the phone map, we would have got lost long ago.", "Without the maps on our phones, we would have got lost long ago."], hint: "Without + N → would have V3" },
          { q: "Báo cáo đề xuất rằng giá vé không được tăng trong năm nay.", answers: ["The report recommends that ticket prices not be raised this year.", "The report recommended that ticket prices not be raised this year.", "The report recommends that ticket prices should not be raised this year.", "The report recommends that fares not be raised this year."], hint: "recommend that + S + not be V3 · raise" },
          { q: "Chi phí tăng mạnh; tuy vậy, số người đăng ký vẫn tăng.", answers: ["Costs rose sharply; however, the number of applicants still increased.", "Costs rose sharply; however, the number of people registering still rose.", "Costs increased sharply; however, the number of applicants still rose.", "Costs rose sharply; however, the number of applicants continued to rise."], hint: "; however, — chấm phẩy trước, phẩy sau" },
          { q: "Đã đến lúc chúng ta coi giấc ngủ là một phần của sức khoẻ.", answers: ["It is high time we treated sleep as part of our health.", "It's high time we treated sleep as part of health.", "It is high time that we treated sleep as a part of our health.", "It is time we treated sleep as part of our health."], hint: "It is high time + S + V-ed · treat sth as" },
        ],
      },

      { t: "h", text: "VI. Đọc — một bài lập luận ngắn (5 câu · 6 phút) — ôn Bài 2 (YNNG, Passage 3)" },
      {
        t: "passage",
        title: "In Defence of the Messy Desk",
        paras: [
          { text: "Few office rules are enforced with as much moral conviction as the clean-desk policy. A tidy desk, we are told, reveals a tidy mind, and a cluttered one a person who has lost control of their work. There is some truth in the second half of that claim. Someone who cannot find a contract when a client calls has a problem, and no amount of creativity will solve it." },
          { text: "But the policy rests on an assumption that is rarely examined: that order is the same thing as visible order. Many people who work in apparent chaos can locate a single sheet of paper within seconds, because the pile on the left holds what is urgent and the pile on the right holds what can wait. Their system is not absent; it is simply not legible to anyone else. Had their managers asked how the piles worked, I suspect fewer of these people would now be spending their Friday afternoons filing papers they will need again on Monday." },
          { text: "None of this means that employers should abandon the rule entirely. Where desks are shared, or where documents are confidential, it is reasonable that they be cleared at the end of each day. What I would ask is that the rule be justified by those needs, rather than by a belief about what a good mind looks like." },
        ],
      },
      {
        t: "mcq",
        id: "t5d19-bt-doc",
        title: "VI. Do the statements agree with the claims of the writer? YES / NO / NOT GIVEN",
        items: [
          { q: "1. Being unable to find important documents can be a genuine problem.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“There is some truth in the second half of that claim. Someone who cannot find a contract… has a problem”." },
          { q: "2. People with messy desks usually have no system for organising their work.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“Their system is not absent; it is simply not legible to anyone else.”" },
          { q: "3. Messy desks are more common among creative workers.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "creativity được nhắc một lần nhưng bài không so ai hay bừa bộn hơn." },
          { q: "4. Clean-desk rules should be dropped in every workplace.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“None of this means that employers should abandon the rule entirely… it is reasonable that they be cleared”." },
          { q: "5. Rules about desks should be based on practical needs such as confidentiality.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“What I would ask is that the rule be justified by those needs” — câu giả định của Bài 1 chở ý chính của người viết." },
        ],
      },

      { t: "h", text: "VII. Nghe — hai người, một người đổi ý (4 câu) — ôn Bài 3 mục 2" },
      {
        t: "listen",
        id: "t5d19-bt-nghe",
        title: "A conversation — choosing a venue for a class reunion",
        dan: { so: "Day 19, Recording 3", boiCanh: "two former classmates, Aoife and Marcus, deciding where to hold a class reunion.", cau: [1, 4] },
        note: "Khoảng 1 phút 20 giây, ~175 từ/phút. Aoife: giọng Ireland; Marcus: giọng Mỹ.",
        lines: [
          { who: "Aoife", voice: "ie-nu", text: "So, the reunion. I still think the old school hall is the obvious place. It's free, it's big enough, and people would love seeing it again." },
          { who: "Marcus", voice: "us-nam", text: "I'd have agreed with you a month ago. But I rang the school, and they can only let us have it until eight in the evening. If we'd asked in the spring we might have got a later booking, but now it's too late." },
          { who: "Aoife", voice: "ie-nu", text: "Eight? That's hopeless. Half the people won't even arrive until seven. What about the restaurant by the river?" },
          { who: "Marcus", voice: "us-nam", text: "The food's good, but they want a deposit of five hundred, and we'd lose it if fewer than forty people turn up." },
          { who: "Aoife", voice: "ie-nu", text: "Forty's a lot. Supposing we only get thirty?" },
          { who: "Marcus", voice: "us-nam", text: "Then we'd lose the lot. Which is why I'm now leaning towards the rowing club. It's cheaper than the restaurant, there's no deposit, and they'll stay open as late as we like." },
          { who: "Aoife", voice: "ie-nu", text: "The rowing club. Honestly, I'd never have thought of it, but you're right. Let's book that." },
        ],
      },
      {
        t: "mcq",
        id: "t5d19-bt-nghe-chon",
        title: "VII. Questions 1–4 — chọn phương án đúng",
        items: [
          { q: "1. Why can't they use the school hall?", options: ["A  It is too small.", "B  It closes too early.", "C  It is too expensive."], correct: 1, why: "“they can only let us have it until eight in the evening” — Aoife: “That's hopeless.” A, C bị bác từ đầu (big enough, free)." },
          { q: "2. What would have allowed them to book the hall later in the evening?", options: ["A  asking earlier in the year", "B  paying a deposit", "C  inviting more people"], correct: 0, why: "“If we'd asked in the spring we might have got a later booking” — câu điều kiện loại 3 với might." },
          { q: "3. What is the problem with the restaurant?", options: ["A  The food is poor.", "B  It cannot hold forty people.", "C  They could lose money if too few people come."], correct: 2, why: "“we'd lose it if fewer than forty people turn up”." },
          { q: "4. What do they finally choose?", options: ["A  the school hall", "B  the restaurant", "C  the rowing club"], correct: 2, why: "Marcus: “I'm now leaning towards the rowing club” — Aoife đổi ý: “I'd never have thought of it, but you're right. Let's book that.”" },
        ],
      },

      { t: "h", text: "VIII. Từ vựng của ngày (5 câu) — ôn Bài 2 và Bài 3 mục từ vựng" },
      {
        t: "quiz",
        id: "t5d19-bt-tu-vung",
        kind: "fill",
        title: "VIII. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. Refrigeration greatly reduced food s___ in hot countries.", answers: ["spoilage"], hint: "Bài 2 — spoilage (n): sự hư hỏng của thực phẩm." },
          { q: "2. The two groups were not comparable because of self-s___: people chose which group to join.", answers: ["selection"], hint: "Bài 3 — self-selection." },
          { q: "3. That conclusion is a little h___; we only have data from one year.", answers: ["hasty"], hint: "Bài 2 — hasty (adj): vội vàng." },
          { q: "4. The decision-making process was o___, so nobody knew who had approved the plan.", answers: ["opaque"], hint: "Bài 2 — opaque: nghĩa bóng = thiếu minh bạch." },
          { q: "5. Our first budget turned out to be w___ optimistic.", answers: ["wildly"], hint: "Bài 3 — wildly optimistic." },
        ],
      },

      { t: "h", text: "IX. Viết một đoạn đề xuất (120–150 từ) — AI chấm — ôn Bài 1 mục 6" },
      {
        t: "p",
        text: "Viết **đoạn giải pháp** cho đề dưới đây. Bắt buộc có: **một** câu điều kiện hỗn hợp hoặc đảo ngữ Had…, **một** giả định không có if (Without… / otherwise / chủ ngữ danh từ + would), **một** câu thức giả định (It is essential that… be…), **một** chỗ ; however, — và không quá hai chữ if.",
      },
      {
        t: "essay",
        id: "t5d19-bt-viet-doan",
        task: "Task 2",
        prompt: "(Chỉ viết đoạn GIẢI PHÁP, 120–150 từ) In many cities, older residents are becoming increasingly isolated. What are the causes of this problem, and what measures could be taken to address it?",
        minWords: 120,
        tips: [
          "Câu chủ đề: giải pháp hiệu quả nhất nhắm vào nguyên nhân nào.",
          "Hỗn hợp: Had cities kept… / If… had…, many older people would not now be…",
          "Giả định ngầm: A scheme that… would… · Without…, … would…",
          "Một câu giả định cho phần đề xuất: It is essential that… be…",
          "Soát dấu câu theo tám quy tắc trước khi nộp.",
        ],
      },
      {
        t: "note",
        title: "📌 Một đoạn mẫu để so SAU khi đã viết (band 8, ước tính) — 138 từ",
        items: [
          "The most effective response would target the loss of everyday contact rather than loneliness in the abstract. Had cities protected the corner shops, post offices and bus routes that once brought neighbours together, many older people would not now be going days without a conversation. Some of this can still be rebuilt: a library that opened its reading room as a daytime meeting place would cost little; without such spaces, befriending schemes have nowhere to bring people. Funding, however, cannot be left to volunteers. It is essential that councils be required to map where isolated residents live, since services that cannot find people cannot help them. Technology has a role; however, a video call is a supplement to human contact, not a substitute for it, and policies that treat it as one would merely move the problem online.",
          "Soi: Had cities protected… would not now be going (hỗn hợp, tiếp diễn) · a library that opened… would cost (giả định ngầm) · without such spaces (ngầm) · It is essential that councils be required (giả định) · Funding, however, (cặp phẩy) · ; however, (nối hai mệnh đề) · không có chữ if nào.",
        ],
      },

      { t: "h", text: "X. Nói 3 câu Part 3 — ghi âm, AI chấm — ôn Bài 3 mục 5–6" },
      { t: "p", text: "Mỗi câu 40–50 giây, đủ năm bước (tóm → phản hồi → lý do → giả định → chốt). Ít nhất một câu có would've / wouldn't have nói ở dạng yếu." },
      { t: "speak", id: "t5d19-bt-noi-p3", part: "3", questions: ["Some people say that the decisions made by previous generations explain most of the problems we face today. What do you think?", "If the internet had never been invented, how different would education be now?", "Should governments insist that every citizen learn basic first aid?"] },
    ],
  },
];
