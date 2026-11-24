/**
 * IELTS Tập 5 — Ngày 27 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, câu hỏi, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Ôn tổng ngữ pháp 5 tập — bảng 44 điểm G01–G44 gom 9 cụm; bài chẩn đoán 44 câu (mỗi câu một mã, chỉ rõ ôn
 *                     ở Tập/Ngày nào); bản đồ lỗi cá nhân; sáu cụm hay mất điểm nhất ở band 7 → 8 (mốc thời gian · danh từ–mạo
 *                     từ–hoà hợp · giới từ phụ thuộc · câu phức không gãy · giả định & mức chắc · mạch & dấu câu); đoạn band 7
 *                     có 8 lỗi biết trước đặt cạnh đoạn band 8                                                     [G01–G44]
 *                     — nối toàn bộ cột "Tập vòng 1 / Vòng 2 / Vòng 3" của bảng 2.1 (Tập 1 → Tập 5 Ngày 25)
 *   Bài 2 (reading)   Reading đủ 3 passage · 40 câu · 55 phút — LẦN 3 của Tập 5 (mục tiêu 35+/40): cống ngầm London và “Mùa hè
 *                     thối” 1858 (Note + TFNG) · cuộc tìm nơi lươn châu Âu đẻ trứng (Matching information + Matching features +
 *                     Summary có hộp từ) · thí nghiệm Libet và ý chí tự do (MCQ + YNNG + Choose TWO + tiêu đề)          [R20]
 *                     — nối Tập 5 Ngày 13 (lần 1) · Ngày 19 (lần 2) · Ngày 21 (đọc một lần, không quay lại)
 *   Bài 3 (speaking)  Sprint Part 3: 12 đề × 3 câu, sáu chức năng câu hỏi và động tác band 8 cho mỗi chức năng; mẫu band 7 và
 *                     band 8 cạnh nhau; 🔊 cụm “mua thời gian” nói nhanh, giọng thấp                                  [S06 S08]
 *                     — nối Tập 5 Ngày 6 · 13 · 19 · 23 (Part 3 band 8) · Tập 4 Ngày 23 (ngữ pháp nói)
 *   Bài tập Ngày 27   38 câu có đáp án + 1 đoạn viết lại không lỗi (AI chấm) + 3 câu Part 3 ghi âm
 * Mọi id bắt đầu `t5d27-`. Đã grep tap-3…5/ngay + thi-may/de trước khi chọn đề tài: Bazalgette / Great Stink / Sargasso / eels /
 * Libet / readiness potential / free will = 0 kết quả (Chappe đã có ở Ngày 25, fog harvesting ở Ngày 9, Goodhart ở Đề 12 ⇒ không chọn).
 * Dữ kiện có thật (soạn theo trí nhớ, làm tròn / làm mờ chỗ không chắc): London giữa thế kỷ 19 hơn hai triệu dân, hố phân, bồn cầu
 * xả nước làm tràn hố; dịch tả 1848–49 và 1853–54; John Snow và cây bơm phố Broad (1854), thuyết “khí độc” (miasma); Ban Công trình
 * Đô thị (1855), Joseph Bazalgette; mùa hè 1858, rèm Nghị viện tẩm vôi clo, luật thông qua trong khoảng hơn hai tuần, vay 3 triệu
 * bảng; cống chặn chạy song song sông, trạm bơm Crossness (1865) và Abbey Mills, cửa xả ở hạ lưu; kè Victoria; Bazalgette làm ống
 * to gấp đôi tính toán; dịch 1866 ở phía đông, vùng chưa nối; đường hầm Tideway giữa thập niên 2020. Aristotle (lươn sinh từ bùn),
 * Freud mổ khoảng 400 con lươn ở Trieste (1876), Grassi & Calandruccio (1896, ấu trùng lá liễu), Johannes Schmidt (từ 1904, kết
 * luận Sargasso đầu thập niên 1920), nghiên cứu gắn thẻ vệ tinh từ Azores (2022), lươn châu Âu “cực kỳ nguy cấp” (IUCN), buôn lậu
 * lươn thuỷ tinh. Libet (1983), readiness potential (Kornhuber & Deecke 1965), quyền phủ quyết, nghiên cứu fMRI ~60 % (2008),
 * Schurger (2012), nghiên cứu quyết định có cân nhắc (2019). Con số không chắc đều viết dạng “khoảng / theo một số ước tính”.
 * Nhân vật trong bài tập (Minh, Lan…) là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_27: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d27-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Ôn tổng 5 tập — bảng 44 điểm G01–G44, bài chẩn đoán 44 câu và sáu cụm hay mất điểm nhất ở band 7 → 8",
    goal: "Tự chẩn đoán cả 44 điểm ngữ pháp của khoá bằng 44 câu (mỗi câu một mã), tô được bản đồ lỗi của chính mình theo 9 cụm, rồi sửa dứt điểm sáu cụm hay làm người band 7 mất điểm GRA — mốc thời gian, danh từ–mạo từ–hoà hợp, giới từ phụ thuộc, câu phức không gãy, giả định và mức chắc, mạch và dấu câu — để ba ngày cuối khoá chỉ còn ôn đúng chỗ yếu.",
    minutes: 115,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **GRA 7 → 8** ở cả Viết lẫn Nói. Band 8 đòi ==nhiều cấu trúc, đa số câu không lỗi==; ở mức này người học không thiếu cấu trúc nữa — họ mất điểm vì **vài lỗi lặp lại** ở những điểm tưởng đã học xong từ Tập 2–3.",
          "Hôm nay KHÔNG học điểm mới. Ta đi **một vòng cả 44 điểm** (bảng 2.1 của lộ trình): mỗi điểm một câu chẩn đoán, có ghi mã và ngày cần ôn.",
          "44 điểm gom thành ==9 cụm==. Sai từ 2 câu trong một cụm ⇒ cụm đó vào danh sách ôn của Ngày 28–30.",
          "Sáu cụm hay mất điểm nhất ở band 7 được giảng lại gọn: **mốc thời gian · danh từ–mạo từ–hoà hợp · giới từ phụ thuộc · câu phức không gãy · giả định & mức chắc · mạch & dấu câu**.",
          "Cuối bài: một đoạn band 7 có **8 lỗi biết trước** đặt cạnh đoạn band 8 — tìm đủ 8 lỗi là dấu hiệu bạn đã soát được bài của chính mình.",
          "Bài 2 (Reading lần 3) và Bài 3 (Sprint Part 3) đều có phần soi ngữ pháp — dùng chính bản đồ lỗi hôm nay.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Cách dùng bài này — chẩn đoán trước, ôn sau" },
      {
        t: "p",
        text: "Ôn tổng mà đọc lại từ đầu 44 điểm thì mất ba ngày và gần như vô ích: ==bạn sẽ đọc kỹ những gì đã biết và lướt qua đúng chỗ đang sai==. Cách làm của bài này ngược lại: làm 44 câu chẩn đoán trước, không xem lại gì; chấm; tô bản đồ; rồi chỉ đọc kỹ cụm nào bị tô đỏ. Mỗi câu chẩn đoán có 💡 ghi **mã G** và **ngày đã dạy** để bạn mở đúng bài cũ.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Một vòng ôn tổng — 115 phút",
        steps: [
          { label: "Làm 44 câu chẩn đoán", sub: "25 phút · không mở 💡, không xem bài cũ" },
          { label: "Chấm + tô bản đồ 9 cụm", sub: "10 phút · mục 3" },
          { label: "Đọc kỹ cụm đỏ trong mục 4–9", sub: "50 phút · làm bài dịch của cụm đó" },
          { label: "Đoạn 8 lỗi biết trước", sub: "15 phút · mục 10" },
          { label: "Kiểm tra cuối bài", sub: "15 phút · mục 11" },
        ],
        caption: "Câu sai hôm nay ⇒ chép vào Sổ lỗi kèm mã G; làm lại đúng câu đó sau 3 ngày",
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bảng 44 điểm — gom thành 9 cụm" },
      {
        t: "p",
        text: "Bảng dưới là toàn bộ ngữ pháp của khoá IELTS từ Tập 1 đến Tập 5. Cột cuối nói band 8 cần gì ở cụm đó — không phải “biết”, mà là ==dùng đúng trong câu dài, lúc đang chịu áp lực thời gian==.",
      },
      {
        t: "table",
        head: ["Cụm", "Mã", "Gồm", "Band 8 cần gì"],
        rows: [
          ["**A** Câu & thì", "G01 G02 G06 G12 G13 G20 G22 G23", "mẫu câu gốc · hiện tại đơn · quá khứ · hiện tại hoàn thành · tương lai · used to / would · 12 thì · tương lai hoàn thành", "mỗi đoạn giữ **một mốc thời gian**; đổi thì chỉ khi mốc đổi"],
          ["**B** Danh từ & giới từ", "G03 G04 G07 G10 G11", "đại từ & one · đếm / không đếm · there is / are · mạo từ · giới từ phụ thuộc", "mạo từ và giới từ **không còn lỗi lặp** (increase **in**, the + danh từ có hậu bổ ngữ)"],
          ["**C** Tính từ & so sánh", "G05 G14 G21 G33", "tính từ / trạng từ · so sánh · so / such / too / enough · so sánh nâng cao", "so sánh có **mức độ** (far, slightly, three times as… as)"],
          ["**D** Động từ đặc biệt & câu hỏi", "G08 G15 G19 G27 G28 G34", "modal · V-ing / to V · câu hỏi gián tiếp · tường thuật · suy đoán quá khứ · causative", "chọn đúng **mẫu động từ** sau remember / deny / suggest / have sth done"],
          ["**E** Câu phức", "G17 G26 G30 G31 G35", "mệnh đề quan hệ · giới từ + which · mệnh đề danh ngữ · danh hoá · mệnh đề phân từ", "câu dài **không gãy**: rút gọn đúng chủ ngữ, giới từ đặt đúng chỗ"],
          ["**F** Điều kiện & giả định", "G16 G25 G38 G42", "loại 0–1 · loại 2–3, wish · hỗn hợp · thức giả định", "thời gian của giả định và hệ quả **khớp nhau** (Tập 5 Ngày 19)"],
          ["**G** Bị động & nhấn mạnh", "G09 G24 G36 G37", "bị động đơn · bị động mọi thì, với modal · câu chẻ · đảo ngữ", "dùng **vừa đủ**: 1 câu chẻ hoặc đảo ngữ mỗi bài là nhiều"],
          ["**H** Lập luận & mạch", "G18 G29 G32 G39 G40 G41", "từ nối · nhượng bộ / nguyên nhân · dấu câu · rào đón · quy chiếu & thay thế · danh hoá & văn phong", "**mức chắc khớp bằng chứng**; dấu câu theo cấu trúc; this + danh từ thay vì lặp"],
          ["**I** Hệ thống lỗi & nói", "G43 G44", "bảng tự soát 6 lượt · ngữ pháp nói", "soát được lỗi CỦA MÌNH trong 4 phút; nói có tỉnh lược tự nhiên"],
        ],
        caption: "9 cụm = 44 mã. Thứ tự cụm đi từ nền (A) đến kỹ năng soát (I)",
      },
      { t: "rule", formula: "Chẩn đoán → tô cụm → ôn đúng cụm đỏ → làm lại câu sai sau 3 ngày", vi: "Ôn tổng là ôn có chọn lọc; đọc lại cả 44 điểm là cách tốn thời gian nhất để không tiến bộ." },

      /* ── 2 ── */
      { t: "h", text: "2. Bài chẩn đoán 44 câu — mỗi câu một mã (25 phút)" },
      {
        t: "p",
        text: "Làm liền bốn phần dưới, **không mở 💡** và không xem “why” cho tới khi xong cả 44 câu. Câu nào phân vân thì đánh dấu — câu đoán trúng vẫn tính là câu cần ôn. Câu 1–13: cụm A–B · câu 14–23: cụm C–D · câu 24–36: cụm E–G · câu 37–44: cụm H–I.",
      },
      {
        t: "quiz",
        id: "t5d27-chan-doan-a",
        kind: "fill",
        title: "Phần A — cụm A + B: viết dạng đúng của từ trong ngoặc / điền MỘT từ (13 câu)",
        items: [
          { q: "1. Although the results seem ___ (convince), the sample was too small to generalise from.", answers: ["convincing"], hint: "G01 · động từ nối seem / look / sound / remain + TÍNH TỪ, không phải trạng từ. Ôn: Tập 1 Ngày 1 · Tập 3 Ngày 1." },
          { q: "2. The figure for 2020 ___ (include) part-time staff, whereas the earlier figures do not.", answers: ["includes"], hint: "G02 · include là động từ trạng thái ⇒ hiện tại đơn, không dùng is including; chủ ngữ the figure số ít ⇒ -s. Ôn: Tập 2 Ngày 1 · Tập 3 Ngày 1." },
          { q: "3. In 2009, unemployment ___ (rise) to its highest level in a decade.", answers: ["rose"], hint: "G06 · rise – rose – risen (nội động từ). Đừng lẫn với raise – raised (ngoại động từ). Ôn: Tập 2 Ngày 3 · Tập 3 Ngày 1." },
          { q: "4. Since the law was introduced, the number of road deaths ___ (fall) by almost a third.", answers: ["has fallen"], hint: "G12 · since + mốc quá khứ ⇒ vế chính hiện tại hoàn thành. Ôn: Tập 2 Ngày 5 · Tập 4 Ngày 3." },
          { q: "5. I can't join the meeting on Friday — I ___ (fly) to Da Nang that morning; the tickets are already booked.", answers: ["am flying", "'m flying", "am going to fly", "'m going to fly"], hint: "G13 · kế hoạch đã sắp xếp (vé đã đặt) ⇒ hiện tại tiếp diễn là tự nhiên nhất. Ôn: Tập 2 Ngày 7 · Tập 3 Ngày 5." },
          { q: "6. When I was a child, my grandfather ___ take me fishing every Sunday. (MỘT từ)", answers: ["would"], hint: "G20 · would + V cho hành động lặp lại trong quá khứ (used to cần hai từ). Ôn: Tập 2 Ngày 21 · Tập 3 Ngày 1." },
          { q: "7. By the time the ambulance arrived, the injured cyclist ___ (already / leave) the scene.", answers: ["had already left"], hint: "G22 · việc xảy ra TRƯỚC một mốc quá khứ khác ⇒ quá khứ hoàn thành. Ôn: Tập 3 Ngày 1 · Tập 4 Ngày 3 · Tập 5 Ngày 1." },
          { q: "8. By 2040, the proportion of people aged over 65 ___ (rise) to almost a quarter of the population.", answers: ["will have risen", "is expected to have risen", "is projected to have risen", "is predicted to have risen"], hint: "G23 · By + mốc tương lai ⇒ tương lai hoàn thành (Task 1 có năm dự báo). Ôn: Tập 3 Ngày 5 · Tập 4 Ngày 9." },
          { q: "9. Many students still prefer printed textbooks to digital ___ . (MỘT từ)", answers: ["ones"], hint: "G03 · one / ones thay cho danh từ đếm được đã nhắc (textbooks ⇒ ones). Ôn: Tập 2 Ngày 13 · Tập 4 Ngày 13." },
          { q: "10. There is ___ evidence that the scheme works; most studies have found no effect at all. (MỘT từ)", answers: ["little"], hint: "G04 · little (gần như không — nghĩa tiêu cực) ≠ a little (một ít — tích cực). Câu sau “no effect” ⇒ little. Ôn: Tập 2 Ngày 7 · Tập 4 Ngày 1." },
          { q: "11. There ___ (be) a growing number of people who work entirely from home.", answers: ["are"], hint: "G07 · a (growing) number of + danh từ số nhiều ⇒ động từ số nhiều (khác: THE number of … IS). Ôn: Tập 2 Ngày 11 · Tập 5 Ngày 17." },
          { q: "12. ___ Mekong Delta is home to roughly seventeen million people. (MỘT từ)", answers: ["The"], hint: "G10 · tên sông, đồng bằng sông, biển, dãy núi ⇒ the (the Mekong, the Mekong Delta, the Alps). Ôn: Tập 3 Ngày 3 · Tập 4 Ngày 1." },
          { q: "13. There has been a sharp increase ___ the cost of renting a flat in the city centre. (MỘT từ)", answers: ["in"], hint: "G11 · an increase / a rise / a fall IN + thứ thay đổi; an increase OF + lượng (an increase of 20%). Ôn: Tập 3 Ngày 9 · Tập 4 Ngày 7." },
        ],
      },
      {
        t: "mcq",
        id: "t5d27-chan-doan-b",
        title: "Phần B — cụm C + D: chọn phương án đúng (10 câu)",
        items: [
          { q: "14. They have moved into ___ house on the edge of the village.", options: ["a beautiful old wooden", "an old beautiful wooden", "a wooden beautiful old", "a beautiful wooden old"], correct: 0, why: "G05 · thứ tự tính từ: ý kiến (beautiful) → tuổi (old) → chất liệu (wooden). Ôn: Tập 2 Ngày 9 · Tập 3 Ngày 7." },
          { q: "15. Housing in the capital is ___ expensive than in the provinces.", options: ["far more", "very more", "more far", "much most"], correct: 0, why: "G14 · nhấn so sánh hơn bằng far / much / considerably / slightly; KHÔNG dùng very. Ôn: Tập 2 Ngày 9 · Tập 4 Ngày 9." },
          { q: "16. It was ___ difficult a question that nobody in the room attempted it.", options: ["so", "such", "too", "very"], correct: 0, why: "G21 · so + tính từ + a + danh từ (so difficult a question) = such a difficult question. too… that sai. Ôn: Tập 2 Ngày 23 · Tập 3 Ngày 23." },
          { q: "17. Coffee production in 2020 was ___ that in 2000.", options: ["three times as high as", "three times higher as", "three times as higher than", "as three times high as"], correct: 0, why: "G33 · bội số + as + tính từ nguyên + as. Ôn: Tập 3 Ngày 29 · Tập 4 Ngày 9." },
          { q: "18. Staff ___ wear a uniform on Fridays, but most of them choose to.", options: ["don't have to", "mustn't", "can't", "shouldn't"], correct: 0, why: "G08 · don't have to = không bắt buộc; mustn't = cấm. Vế sau “most of them choose to” ⇒ không bắt buộc. Ôn: Tập 2 Ngày 15 · Tập 3 Ngày 19." },
          { q: "19. I clearly remember ___ the door, so I can't understand why it was open.", options: ["locking", "to lock", "lock", "to have been locked"], correct: 0, why: "G15 · remember + V-ing = nhớ đã làm (ký ức); remember + to V = nhớ để làm. Ôn: Tập 2 Ngày 11 · Tập 4 Ngày 11." },
          { q: "20. Could you tell me ___ ?", options: ["where the nearest pharmacy is", "where is the nearest pharmacy", "where the nearest pharmacy is it", "the nearest pharmacy where is"], correct: 0, why: "G19 · câu hỏi gián tiếp giữ trật tự câu kể: wh- + S + V. Ôn: Tập 2 Ngày 19 · Tập 3 Ngày 25." },
          { q: "21. At the press conference, the minister ___ that the policy had failed.", options: ["denied", "refused", "rejected", "objected"], correct: 0, why: "G27 · deny + that-clause / V-ing; refuse + to V; reject + danh từ; object + to. Ôn: Tập 3 Ngày 19 · Tập 4 Ngày 17." },
          { q: "22. The pavements are completely wet — it ___ rained during the night.", options: ["must have", "should have", "can have", "must"], correct: 0, why: "G28 · suy đoán chắc chắn về quá khứ: must have V3. should have = lẽ ra nên. Ôn: Tập 3 Ngày 19 · Tập 4 Ngày 13." },
          { q: "23. Before submitting it, we had the report ___ by a professional editor.", options: ["checked", "check", "to check", "checking"], correct: 0, why: "G34 · have + tân ngữ + V3 (nhờ / thuê người khác làm). Ôn: Tập 3 Ngày 29 · Tập 4 Ngày 17." },
        ],
      },
      {
        t: "quiz",
        id: "t5d27-chan-doan-c",
        kind: "fill",
        title: "Phần C — cụm E + F + G: viết dạng đúng / điền MỘT từ (13 câu)",
        items: [
          { q: "24. The engineer ___ design was eventually adopted had been dismissed as a dreamer for years. (MỘT từ)", answers: ["whose"], hint: "G17 · whose + danh từ = của người đó. Ôn: Tập 2 Ngày 15 · Tập 4 Ngày 5." },
          { q: "25. The committee, ___ which the final decision rests, meets only twice a year. (MỘT từ)", answers: ["on", "with"], hint: "G26 · giới từ của cụm động từ đi lên trước which: the decision rests ON / WITH the committee ⇒ on which / with which. Ôn: Tập 3 Ngày 17 · Tập 5 Ngày 7." },
          { q: "26. ___ the new policy will reduce congestion remains to be seen. (MỘT từ)", answers: ["Whether"], hint: "G30 · mệnh đề danh ngữ làm chủ ngữ: Whether… (không dùng If ở đầu câu). Ôn: Tập 3 Ngày 23 · Tập 4 Ngày 11." },
          { q: "27. Prices rose rapidly, which alarmed consumers. → The rapid ___ in prices alarmed consumers. (MỘT danh từ)", answers: ["rise", "increase"], hint: "G31 · danh hoá: rose rapidly ⇒ the rapid rise / increase in prices. Ôn: Tập 3 Ngày 25 · Tập 4 Ngày 1 · Tập 5 Ngày 1." },
          { q: "28. ___ (face) with rising energy costs, many small bakeries have had to close.", answers: ["Faced"], hint: "G35 · mệnh đề phân từ bị động: (Being) faced with… — chủ ngữ ngầm là many small bakeries. Ôn: Tập 4 Ngày 5 · Tập 5 Ngày 7." },
          { q: "29. ___ the funding is renewed, the project will have to close in May. (MỘT từ, nghĩa “trừ khi”)", answers: ["Unless"], hint: "G16 · unless = if… not; sau unless KHÔNG thêm not. Ôn: Tập 2 Ngày 13 · Tập 3 Ngày 15." },
          { q: "30. Many residents now wish the council ___ (consult) them before it approved the plan.", answers: ["had consulted"], hint: "G25 · wish về việc QUÁ KHỨ ⇒ had V3. Ôn: Tập 3 Ngày 15 · Tập 4 Ngày 19." },
          { q: "31. If I ___ (not / take) that statistics module in my first year, I wouldn't be working in data science now.", answers: ["hadn't taken", "had not taken"], hint: "G38 · hỗn hợp quá khứ → hiện tại: If had V3, would (now) V. Ôn: Tập 4 Ngày 19 · Tập 5 Ngày 19." },
          { q: "32. The report recommends that every secondary school ___ (appoint) a mental-health lead.", answers: ["appoint", "should appoint"], hint: "G42 · recommend / insist / it is essential that + S + V nguyên mẫu trần (KHÔNG appoints). Ôn: Tập 4 Ngày 27 · Tập 5 Ngày 19." },
          { q: "33. The original bridge ___ (build) in 1998 by a Japanese consortium.", answers: ["was built"], hint: "G09 · bị động quá khứ đơn: was / were + V3. Ôn: Tập 1 Ngày 15 · Tập 2 Ngày 21 · Tập 3 Ngày 13." },
          { q: "34. The figures ___ (should / check) before they were published, but nobody did.", answers: ["should have been checked"], hint: "G24 · bị động với modal hoàn thành: should have been V3 (lẽ ra phải được…). Ôn: Tập 3 Ngày 13 · Tập 4 Ngày 5." },
          { q: "35. ___ worries most residents is not the cost of the project but the noise. (MỘT từ)", answers: ["What"], hint: "G36 · câu chẻ What-cleft: What + V + is + X. Ôn: Tập 4 Ngày 7 · Tập 5 Ngày 13." },
          { q: "36. Not only ___ the scheme cut costs, but it also improved staff morale. (MỘT từ)", answers: ["did"], hint: "G37 · Not only đứng đầu ⇒ đảo trợ động từ: Not only did + S + V. Ôn: Tập 4 Ngày 7 · Tập 5 Ngày 13." },
        ],
      },
      {
        t: "mcq",
        id: "t5d27-chan-doan-d",
        title: "Phần D — cụm H + I: chọn phương án đúng (8 câu)",
        items: [
          { q: "37. The trial was far more expensive than expected. ___, it was abandoned after a year.", options: ["Consequently", "Although", "Despite this fact that", "Whereas"], correct: 0, why: "G18 · từ nối cấp câu chỉ kết quả: Consequently, / As a result,. Although và Whereas nối HAI vế trong một câu. Ôn: Tập 2 Ngày 17 · Tập 4 Ngày 15." },
          { q: "38. ___ having very little experience, she was offered the post.", options: ["Despite", "Although", "In spite", "Even though"], correct: 0, why: "G29 · Despite / In spite OF + V-ing / danh từ; Although / Even though + mệnh đề. Ôn: Tập 3 Ngày 21 · Tập 5 Ngày 13." },
          { q: "39. Which sentence is punctuated correctly?", options: ["The data were collected in 2019; however, they were not published until 2022.", "The data were collected in 2019, however, they were not published until 2022.", "The data were collected in 2019 however they were not published until 2022.", "The data were collected in 2019, however they were not published until 2022."], correct: 0, why: "G32 · however nối hai mệnh đề độc lập ⇒ ; however, — dùng phẩy là comma splice. Ôn: Tập 3 Ngày 27 · Tập 4 Ngày 21 · Tập 5 Ngày 19." },
          { q: "40. Which is the best band-8 claim when the evidence is limited? “A congestion charge ___ reduce traffic in the city centre.”", options: ["is likely to", "will definitely", "must", "is certain to"], correct: 0, why: "G39 · mức chắc khớp bằng chứng: bằng chứng hạn chế ⇒ is likely to / would probably. Ôn: Tập 4 Ngày 13 · Tập 5 Ngày 1." },
          { q: "41. Some argue that cities should ban cars from their centres; others believe that ___ would harm local shops.", options: ["doing so", "doing it so", "so doing it", "to do"], correct: 0, why: "G40 · thay thế cả cụm động từ đã nêu bằng doing so (= banning cars). Ôn: Tập 4 Ngày 13 · Tập 5 Ngày 13." },
          { q: "42. Which sentence suits a Task 2 essay best?", options: ["Young people now spend a considerable amount of time on their phones.", "Kids these days are glued to their phones.", "Young people use their phones a lot, you know.", "Young guys are always on their phones."], correct: 0, why: "G41 · văn phong trang trọng vừa phải: không kids, guys, you know, thành ngữ suồng sã. Ôn: Tập 4 Ngày 21 · Tập 5 Ngày 1 · Ngày 15." },
          { q: "43. Which sentence contains NO error?", options: ["Having read the evidence, I find the policy sensible.", "Having read the evidence, the policy seems sensible.", "The number of complaints have doubled since May.", "Neither of the two plans are affordable."], correct: 0, why: "G43 · B: dangling modifier (chính sách không đọc bằng chứng); C: THE number… HAS; D: Neither of… IS (văn viết). Ôn: Tập 3 Ngày 27 · Tập 4 Ngày 21 · Tập 5 Ngày 23 · 25." },
          { q: "44. Examiner: “Do you enjoy cooking?” — Which answer start sounds most natural at band 8?", options: ["I do, actually — though only when I'm not in a rush.", "Yes, I enjoy cooking.", "Yes, I do enjoy cooking very much because cooking is enjoyable.", "I am enjoy cooking."], correct: 0, why: "G44 · tỉnh lược hội thoại (I do) + chunk (actually) + nhượng bộ ngắn. B đúng nhưng cứng; C lặp từ. Ôn: Tập 3 Ngày 11 · Tập 4 Ngày 23 · Tập 5 Ngày 11." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Chấm và tô bản đồ lỗi" },
      {
        t: "table",
        head: ["Cụm", "Câu", "Số câu", "Sai ≥ 2 ⇒ đọc kỹ"],
        rows: [
          ["A Câu & thì", "1–8", "8", "mục 4"],
          ["B Danh từ & giới từ", "9–13", "5", "mục 5 · mục 6"],
          ["C Tính từ & so sánh", "14–17", "4", "Tập 4 Ngày 9 (bài đã dạy)"],
          ["D Động từ đặc biệt & câu hỏi", "18–23", "6", "Tập 4 Ngày 11 · 13 · 17"],
          ["E Câu phức", "24–28", "5", "mục 7"],
          ["F Điều kiện & giả định", "29–32", "4", "mục 8"],
          ["G Bị động & nhấn mạnh", "33–36", "4", "Tập 5 Ngày 7 · 13"],
          ["H Lập luận & mạch", "37–42", "6", "mục 8 (rào đón) · mục 9"],
          ["I Hệ thống lỗi & nói", "43–44", "2", "mục 10 · Bài 3 hôm nay"],
        ],
        caption: "Tô đỏ cụm sai ≥ 2 câu (hoặc sai 1 câu ở cụm chỉ có 2–4 câu), tô vàng cụm sai đúng 1 câu",
      },
      {
        t: "table",
        head: ["Tổng đúng / 44", "Nghĩa là (ước tính)", "Việc tiếp"],
        rows: [
          ["42–44", "GRA 8 trong tầm tay — lỗi còn lại là lỗi sơ ý", "đọc lướt mục 4–9, làm thẳng mục 10–11"],
          ["38–41", "GRA 7.5 — một hai cụm còn lỗ", "đọc kỹ đúng các cụm đỏ, bỏ qua cụm xanh"],
          ["33–37", "GRA 7 — lỗi lặp ở điểm nền", "đọc hết mục 4–9; Ngày 28–29 làm lại câu sai mỗi ngày"],
          ["dưới 33", "điểm nền chưa chắc", "mở lại đúng ngày ghi trong 💡; đừng cố học cấu trúc mới"],
        ],
        caption: "Đây là bài tự chẩn đoán trên câu tự soạn — chỉ để biết chỗ yếu, không phải điểm thi",
      },
      {
        t: "note",
        title: "📌 Ghi vào Sổ lỗi — mẫu một dòng",
        items: [
          "Câu 13 · **G11** · tôi viết ~~increase of the cost~~ → increase **in** the cost · quy tắc: increase IN thứ thay đổi, OF lượng · làm lại: Ngày 30.",
          "Câu đoán trúng cũng ghi — câu đoán trúng hôm nay là câu sai ở phòng thi.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Cụm A — giữ một mốc thời gian cho mỗi đoạn (G12 · G22 · G23 · nhất quán thì G43)" },
      {
        t: "p",
        text: "Người band 7 hầu như không chia sai một thì đứng riêng. Họ sai khi ==câu thứ ba quên mất mốc thời gian của câu thứ nhất==: đoạn đang kể quá khứ thì chen một câu hiện tại hoàn thành; đoạn Task 1 có năm dự báo thì quên đổi sang will / is expected to. Cách sửa không phải học lại thì, mà là **khoá mốc** trước khi viết đoạn.",
      },
      {
        t: "table",
        head: ["Mốc của đoạn", "Thì chính", "Đổi thì khi nào", "Lỗi band 7 hay gặp"],
        rows: [
          ["Sự thật chung (Task 2)", "hiện tại đơn", "ví dụ quá khứ cụ thể (In 2019, …) ⇒ quá khứ đơn rồi QUAY LẠI", "~~People have become…~~ cho một sự thật chung không có mốc thay đổi"],
          ["Thay đổi đến nay", "hiện tại hoàn thành", "khi nêu thời điểm đã xong (in 2010) ⇒ quá khứ đơn", "~~Since 2010 the number rose~~ → has risen"],
          ["Task 1 quá khứ", "quá khứ đơn", "việc xảy ra TRƯỚC một mốc khác ⇒ had V3 (by 2005 it had…)", "~~By 2005 it reached~~ → had reached"],
          ["Task 1 có dự báo", "will / is expected to / is projected to", "By + năm tương lai ⇒ will have V3", "quên đổi thì khi đường biểu đồ bước sang năm dự báo"],
        ],
        caption: "Khoá mốc trước, chọn thì sau",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — ba chỗ hay trượt mốc",
        items: [
          "Mở bài Task 2 nói “In recent years…” (hiện tại hoàn thành) rồi thân bài viết toàn quá khứ đơn mà không có năm cụ thể.",
          "Câu ví dụ kể chuyện quá khứ, câu SAU nó vẫn ở quá khứ trong khi đã quay về lập luận chung: ~~This showed that people were more careful.~~ → This **shows** that people **are** more careful (khi bạn rút ra kết luận chung).",
          "Overview Task 1 có số dự báo: “~~The figure rose and reached its peak in 2030~~” → is expected to peak in 2030.",
        ],
      },
      { t: "rule", formula: "Khoá mốc của đoạn → thì chính → đổi thì CHỈ khi mốc đổi → quay lại thì chính", vi: "Mỗi lần đổi thì phải chỉ ra được chữ nào trong câu báo mốc mới (in 2019, by 2040, since…)." },
      {
        t: "quiz",
        id: "t5d27-moc-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — giữ đúng mốc thời gian (4 câu)",
        grammar: "Khoá mốc trước khi chọn thì (Tập 3 Ngày 1 · Tập 4 Ngày 3 · Tập 5 Ngày 1)",
        items: [
          { q: "1. Kể từ khi đường sắt đô thị mở cửa, số người đi xe máy vào trung tâm đã giảm khoảng một phần năm.", answers: ["Since the metro opened, the number of people riding motorbikes into the city centre has fallen by about a fifth.", "Since the urban railway opened, the number of people who ride motorbikes into the centre has dropped by around a fifth.", "Since the metro opened, the number of people commuting into the city centre by motorbike has fallen by roughly a fifth."], hint: "since + quá khứ đơn → vế chính has fallen / has dropped; by about a fifth." },
          { q: "2. Đến năm 2005, sản lượng đã đạt mức cao nhất, rồi sau đó giảm đều.", answers: ["By 2005, production had reached its highest level, and it then fell steadily.", "By 2005 output had reached its peak, after which it declined steadily.", "By 2005, production had peaked, and it then decreased steadily."], hint: "By + mốc quá khứ ⇒ had reached / had peaked; việc sau mốc ⇒ quá khứ đơn." },
          { q: "3. Đến năm 2040, tỷ lệ này được dự đoán sẽ tăng gần gấp đôi.", answers: ["By 2040, this proportion is expected to have almost doubled.", "By 2040, the proportion is projected to have nearly doubled.", "By 2040, this proportion will have almost doubled."], hint: "By + năm tương lai ⇒ is expected to have V3 / will have V3." },
          { q: "4. Năm 2019, một thành phố đã thử cấm ô tô ở khu phố cổ; điều đó cho thấy những lệnh cấm như vậy có thể được người dân chấp nhận.", answers: ["In 2019, one city tried banning cars from its old quarter; this shows that such bans can be accepted by residents.", "In 2019 a city experimented with a car ban in its historic centre, which shows that residents can accept such bans.", "In 2019, a city tried to ban cars from its old town; this suggests that such bans can win residents' acceptance."], hint: "Ví dụ có năm ⇒ quá khứ đơn; kết luận chung rút ra ⇒ quay về hiện tại (shows / suggests)." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Cụm B — danh từ, mạo từ, hoà hợp chủ–vị (G04 · G10 · G43)" },
      {
        t: "p",
        text: "Ba điểm này đi cùng nhau vì chúng cùng một gốc: ==người Việt không đánh dấu số và tính xác định trên danh từ==, nên phải **quyết định có ý thức** ở mỗi danh từ: đếm được hay không? số ít hay nhiều? người đọc đã biết là cái nào chưa? Band 8 không cần quy tắc mới — cần một lượt soát riêng cho danh từ.",
      },
      {
        t: "table",
        head: ["Tình huống", "Sai", "Đúng", "Vì sao"],
        rows: [
          ["Danh từ trừu tượng chung", "~~The education is important.~~", "Education is important.", "nói chung ⇒ không mạo từ"],
          ["Trừu tượng + hậu bổ ngữ", "~~Education of girls has improved.~~", "**The** education of girls has improved.", "of + … đã xác định nó ⇒ the"],
          ["Danh từ không đếm được", "~~many researches / an evidence~~", "much research / a piece of evidence", "research, evidence, advice, equipment, information không số nhiều"],
          ["a number / the number", "~~The number of cars are rising.~~", "The number of cars **is** rising · A number of cars **are**…", "chủ ngữ thật: the number (số ít) / cars (số nhiều)"],
          ["Chủ ngữ dài", "~~The cost of the new buildings are high.~~", "The cost … **is** high", "tìm danh từ đầu cụm, bỏ qua of + …"],
          ["Mệnh đề làm chủ ngữ", "~~What we need are more teachers.~~ (văn viết)", "What we need **is** more teachers.", "mệnh đề what- làm chủ ngữ ⇒ thường số ít"],
          ["each / every / one of", "~~Each of the students have…~~", "Each of the students **has**…", "each / every / one of ⇒ số ít"],
        ],
        caption: "Lượt soát danh từ: gạch chân mọi danh từ trong đoạn, hỏi ba câu — đếm được? số? đã xác định?",
      },
      { t: "rule", formula: "Danh từ: đếm được? → số ít / nhiều? → đã xác định (the) hay nói chung (Ø / a)? → động từ khớp DANH TỪ ĐẦU CỤM", vi: "Bốn câu hỏi cho mỗi danh từ trong lượt soát — làm khi soát, không làm khi đang viết." },
      {
        t: "quiz",
        id: "t5d27-danh-tu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — mạo từ và hoà hợp (4 câu)",
        grammar: "the + danh từ có hậu bổ ngữ · không đếm được · the number IS / a number ARE",
        items: [
          { q: "1. Việc giáo dục trẻ em ở vùng nông thôn vẫn còn thiếu kinh phí.", answers: ["The education of children in rural areas is still underfunded.", "The education of children in rural areas remains underfunded.", "The education of rural children is still short of funding."], hint: "The education of… (có hậu bổ ngữ) · underfunded · is (chủ ngữ là education)." },
          { q: "2. Số lượng người cao tuổi sống một mình đang tăng nhanh.", answers: ["The number of elderly people living alone is rising rapidly.", "The number of older people who live alone is increasing quickly.", "The number of elderly people who live on their own is growing fast."], hint: "The number of… IS rising." },
          { q: "3. Có rất ít bằng chứng cho thấy chương trình này hiệu quả.", answers: ["There is very little evidence that this programme is effective.", "There is very little evidence that the programme works.", "There is very little evidence to show that this scheme is effective."], hint: "evidence không đếm được ⇒ little evidence, There IS." },
          { q: "4. Chi phí xây dựng các bệnh viện mới cao hơn nhiều so với dự tính.", answers: ["The cost of building the new hospitals is far higher than expected.", "The cost of building new hospitals is much higher than was expected.", "The cost of constructing the new hospitals is far higher than predicted."], hint: "Chủ ngữ the cost (số ít) ⇒ is; far / much higher than expected." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Cụm B — giới từ phụ thuộc: 20 cặp hay sai nhất trong bài viết band 7 (G07 · G11)" },
      {
        t: "p",
        text: "Giới từ phụ thuộc không suy ra được bằng logic, nên ==chỉ có thể nhớ theo cụm==. Bảng dưới là 20 cụm mà bài viết band 7 sai nhiều nhất — gom theo từ đứng trước. Ở band 8, sai một cụm trong bảng này là lỗi “không đáng có” mà giám khảo đếm.",
      },
      {
        t: "table",
        head: ["Danh từ + giới từ", "Động từ + giới từ", "Tính từ + giới từ"],
        rows: [
          ["an increase / a rise / a fall **in** (thứ thay đổi)", "contribute **to** + V-ing / N", "responsible **for**"],
          ["an impact / an effect / an influence **on**", "depend / rely / focus **on**", "aware **of** · capable **of**"],
          ["a solution / an approach / access **to**", "benefit **from** · result **in** · result **from**", "dependent **on** · reliant **on**"],
          ["a reason / a demand / a need **for**", "account **for** (chiếm / giải thích)", "similar **to** · different **from**"],
          ["an emphasis / a ban / a tax **on**", "object **to** + V-ing · be committed **to** + V-ing", "familiar **with** (người) · familiar **to** (với ai đó)"],
          ["a cause **of** · the role **of** X **in** Y", "invest **in** · participate **in**", "concerned **about** (lo) · concerned **with** (liên quan)"],
        ],
        caption: "Mỗi ô là một lỗi thật hay gặp — chép ba cụm bạn hay sai nhất lên đầu Sổ lỗi",
      },
      {
        t: "note",
        title: "⚠️ Hay nhầm — bốn cụm có TO là giới từ (theo sau là V-ing)",
        items: [
          "contribute to **reducing** (~~contribute to reduce~~)",
          "be committed to **improving** · be used to **working** (đã quen)",
          "object to **paying** · look forward to **hearing**",
          "the key to **solving** · an alternative to **driving**",
        ],
      },
      { t: "rule", formula: "N / V / adj + giới từ cố định → nếu giới từ là TO thì sau nó là V-ing / N", vi: "Nhớ giới từ theo CỤM, không theo nghĩa của giới từ." },
      {
        t: "quiz",
        id: "t5d27-gioi-tu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — giới từ phụ thuộc (4 câu)",
        grammar: "increase in · impact on · access to · contribute to + V-ing · responsible for",
        items: [
          { q: "1. Mạng xã hội có tác động lớn đến cách người trẻ nhận tin tức.", answers: ["Social media has a major impact on the way young people get their news.", "Social media has a significant impact on how young people receive news.", "Social media has a big effect on the way young people obtain news."], hint: "have an impact / effect ON + the way…" },
          { q: "2. Nhiều gia đình ở vùng sâu vùng xa vẫn chưa được tiếp cận internet tốc độ cao.", answers: ["Many families in remote areas still do not have access to high-speed internet.", "Many households in remote areas still lack access to fast internet.", "Many families in remote regions still have no access to high-speed internet."], hint: "have access TO + N." },
          { q: "3. Các công ty công nghệ nên chịu trách nhiệm về nội dung họ quảng bá.", answers: ["Technology companies should be responsible for the content they promote.", "Tech companies should be held responsible for the content that they promote.", "Technology firms should take responsibility for the content they promote."], hint: "be (held) responsible FOR · take responsibility FOR." },
          { q: "4. Thuế mới có thể góp phần làm giảm lượng rác nhựa.", answers: ["The new tax could contribute to reducing plastic waste.", "The new tax may contribute to reducing the amount of plastic waste.", "A new tax could help contribute to reducing plastic waste."], hint: "contribute TO + V-ing (reducing)." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Cụm E — câu phức không gãy (G17 · G26 · G30 · G35 + lỗi treo chủ ngữ)" },
      {
        t: "p",
        text: "Câu dài là chỗ band 8 ghi điểm và cũng là chỗ band 7 mất điểm. Bốn lỗi dưới đây chiếm phần lớn “câu gãy” trong bài viết ở mức 7: ==rút gọn mà chủ ngữ ngầm sai, giới từ lạc chỗ, mệnh đề danh ngữ thiếu động từ chính, và which chỉ lơ lửng cả câu trước==.",
      },
      {
        t: "table",
        head: ["Lỗi", "Sai", "Đúng"],
        rows: [
          ["① Rút gọn treo chủ ngữ", "~~Having been built in 1890, engineers now consider the bridge unsafe.~~", "Having been built in 1890, **the bridge** is now considered unsafe by engineers."],
          ["② Giới từ của động từ bị rơi", "~~the system which people depend~~", "the system **on which** people depend / the system (which) people depend **on**"],
          ["③ Mệnh đề danh ngữ thiếu động từ chính", "~~Whether the scheme will work.~~ (đứng một mình như câu)", "Whether the scheme will work **is still unclear**."],
          ["④ which lơ lửng sau cả câu", "~~Prices rose sharply which was a problem.~~", "Prices rose sharply, which **caused hardship for** low-income families. / This rise was a problem."],
          ["⑤ Hai động từ chính, không liên từ", "~~Many people move to cities, they want better jobs.~~", "Many people move to cities **because** they want… / **, hoping to find**…"],
        ],
        caption: "Khi soát câu dài: tìm ĐỘNG TỪ CHÍNH trước — có đúng một? chủ ngữ của nó là gì?",
      },
      { t: "rule", formula: "Câu dài = MỘT động từ chính + chủ ngữ thật của nó; V-ing / V3 đầu câu có chủ ngữ = chủ ngữ của mệnh đề chính", vi: "Soát câu dài bằng hai câu hỏi: động từ chính đâu? cụm rút gọn đầu câu nói về ai?" },
      {
        t: "quiz",
        id: "t5d27-cau-phuc-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu phức không gãy (4 câu)",
        grammar: "mệnh đề phân từ đúng chủ ngữ · giới từ + which · mệnh đề danh ngữ làm chủ ngữ",
        items: [
          { q: "1. Đối mặt với chi phí tăng cao, nhiều trường đại học đã tăng học phí.", answers: ["Faced with rising costs, many universities have increased their tuition fees.", "Faced with rising costs, many universities have raised tuition fees.", "Confronted with rising costs, many universities have put up their fees."], hint: "Faced with… — chủ ngữ ngầm phải là many universities." },
          { q: "2. Hệ thống mà hàng triệu người phụ thuộc vào đã gần như sụp đổ trong cơn bão.", answers: ["The system on which millions of people depend almost collapsed during the storm.", "The system that millions of people depend on nearly collapsed in the storm.", "The system which millions of people rely on almost broke down during the storm."], hint: "depend ON ⇒ on which / … depend on." },
          { q: "3. Liệu chính sách này có công bằng hay không vẫn đang được tranh luận.", answers: ["Whether this policy is fair is still being debated.", "Whether or not the policy is fair is still under debate.", "Whether this policy is fair remains a matter of debate."], hint: "Whether + S + V làm chủ ngữ + động từ chính (is still being debated)." },
          { q: "4. Giá thuê nhà tăng mạnh, điều này buộc nhiều người trẻ phải sống xa nơi làm việc.", answers: ["Rents have risen sharply, which has forced many young people to live far from where they work.", "Rents rose sharply, which forced many young people to live a long way from their workplaces.", "Rents have increased sharply, forcing many young people to live far from their workplaces."], hint: ", which + động từ có tân ngữ rõ ràng · hoặc , forcing…" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Cụm F + H — giả định và mức chắc (G25 · G38 · G39 · G42)" },
      {
        t: "p",
        text: "Ở band 8, câu giả định và câu rào đón là cùng một kỹ năng: ==nói đúng MỨC chắc chắn của mình==. Người band 7 có hai lỗi đối xứng: **nói quá chắc** (will definitely, it is obvious that) khi bằng chứng mỏng, và **rào quá dày** (it might perhaps be possible that…) khi ý rất rõ. Cả hai đều làm TR và GRA khó lên 8.",
      },
      {
        t: "table",
        head: ["Mức", "Khung", "Dùng khi"],
        rows: [
          ["Chắc (có bằng chứng rõ)", "X **will** / **has been shown to** / **clearly**", "số liệu, sự thật đã được kiểm"],
          ["Khá chắc", "X **is likely to** / **would probably** / **tends to**", "lập luận hợp lý, có ví dụ"],
          ["Có thể", "X **may** / **could** / **might well**", "dự đoán, khả năng"],
          ["Giả định (không thật)", "**If** S V-ed / were, S **would**… · **Were** S to V, …", "chính sách chưa có, tình huống tưởng tượng"],
          ["Giả định hỗn hợp", "**Had** S V3, S **would now**…", "quyết định quá khứ → hệ quả hôm nay"],
          ["Đề xuất", "It is essential / vital **that** S **be** / V (nguyên mẫu trần)", "một câu đề xuất mạnh mỗi bài"],
        ],
        caption: "Mỗi luận điểm chọn MỘT mức; đừng chồng may + possibly + perhaps trong một câu",
      },
      {
        t: "note",
        title: "⚠️ Sai kinh điển — bốn câu người band 7 vẫn viết",
        items: [
          "~~If the government would invest more, …~~ → If the government **invested** more, … (không would ở vế if).",
          "~~It is essential that every school has a counsellor.~~ → that every school **have** a counsellor (văn viết trang trọng).",
          "~~This will definitely solve the problem.~~ → This **would go a long way towards** solving the problem.",
          "~~It might possibly perhaps help.~~ → It **may well** help. (một từ rào là đủ)",
        ],
      },
      { t: "rule", formula: "Bằng chứng mạnh → will / clearly · vừa → is likely to · yếu → may / could · không thật → would · đề xuất → that S + V nguyên mẫu", vi: "Mức chắc của câu phải bằng mức chắc của bằng chứng — không hơn, không kém." },
      {
        t: "quiz",
        id: "t5d27-gia-dinh-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — giả định và mức chắc (4 câu)",
        grammar: "is likely to · would · Had S V3, S would now · It is essential that S + V",
        items: [
          { q: "1. Nếu vé xe buýt được miễn phí, nhiều người có lẽ sẽ để xe máy ở nhà.", answers: ["If bus travel were free, many people would probably leave their motorbikes at home.", "If buses were free, many people would probably leave their motorbikes at home.", "Were bus fares free, many people would probably leave their motorbikes at home."], hint: "If + were / V-ed → would probably + V." },
          { q: "2. Giá như thành phố đã quy hoạch tốt hơn từ ba mươi năm trước, bây giờ chúng ta đã không bị ngập mỗi mùa mưa.", answers: ["Had the city been planned better thirty years ago, we would not now be flooded every rainy season.", "If the city had been planned better thirty years ago, we would not be flooded every rainy season now.", "Had the city planned more carefully thirty years ago, we would not now suffer floods every rainy season."], hint: "Had + V3 (quá khứ) → would not now + V (hiện tại)." },
          { q: "3. Điều cốt yếu là mọi công ty phải công bố khoảng cách lương theo giới.", answers: ["It is essential that every company publish its gender pay gap.", "It is essential that every company should publish its gender pay gap.", "It is vital that every company publish its gender pay gap."], hint: "It is essential that + S + V nguyên mẫu (publish, KHÔNG publishes)." },
          { q: "4. Lệnh cấm này nhiều khả năng sẽ giảm ô nhiễm, dù tác động của nó lên việc làm vẫn chưa rõ.", answers: ["The ban is likely to reduce pollution, although its effect on jobs remains unclear.", "This ban is likely to cut pollution, although its impact on employment is still unclear.", "The ban will probably reduce pollution, though its effect on jobs is not yet clear."], hint: "is likely to + V · although + mệnh đề · effect ON jobs." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Cụm H — mạch và dấu câu (G18 · G29 · G32 · G40)" },
      {
        t: "p",
        text: "CC 8 đòi ==liên kết tự nhiên, không lộ cơ chế==. Lỗi của band 7 không phải thiếu từ nối mà là **dùng từ nối sai loại** (However như liên từ, Although… but…) và **lặp danh từ** thay vì quy chiếu. Dấu câu đi cùng: từ nối nào thì dấu câu nấy.",
      },
      {
        t: "table",
        head: ["Loại", "Từ", "Dấu câu đúng", "Sai hay gặp"],
        rows: [
          ["Trạng từ nối (nối hai CÂU)", "however · therefore · moreover · nevertheless", "**.** However, … hoặc **;** however, …", "~~…, however, they…~~ (comma splice)"],
          ["Liên từ phụ thuộc (nối hai VẾ)", "although · whereas · while · because · unless", "Although X, Y. / Y although X.", "~~Although X, but Y.~~"],
          ["Giới từ (theo sau là danh từ / V-ing)", "despite · in spite of · due to · owing to", "Despite + N / V-ing, …", "~~Despite it was raining~~ · ~~due to it is~~"],
          ["Quy chiếu", "this + danh từ tóm · such · the former / the latter · doing so", "This **trend** / Such **measures**", "~~This~~ đứng trơ trọi khi người đọc không biết this là gì"],
        ],
        caption: "Hỏi: từ nối này nối hai câu, hai vế, hay đứng trước một danh từ?",
      },
      { t: "rule", formula: "Trạng từ nối → . / ; trước, phẩy sau · liên từ → một câu, không but · giới từ → + N / V-ing · this → + danh từ tóm", vi: "Chọn dấu câu theo LOẠI từ nối, không theo cảm giác ngắt hơi." },
      {
        t: "quiz",
        id: "t5d27-mach-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — từ nối đúng loại và quy chiếu (4 câu)",
        grammar: "; however, · Although (không but) · Despite + V-ing · this + danh từ tóm",
        items: [
          { q: "1. Thuế đường bộ đã được tăng; tuy nhiên, lượng xe vẫn không giảm.", answers: ["Road tax has been increased; however, traffic has not fallen.", "Road tax has been raised; however, the volume of traffic has not decreased.", "Road taxes have been increased. However, the amount of traffic has not gone down."], hint: "; however, hoặc dấu chấm + However," },
          { q: "2. Mặc dù có ít kinh nghiệm, cô ấy vẫn được chọn dẫn dắt dự án.", answers: ["Despite having little experience, she was chosen to lead the project.", "Although she had little experience, she was chosen to lead the project.", "In spite of having little experience, she was selected to lead the project."], hint: "Despite + V-ing / Although + mệnh đề — KHÔNG thêm but." },
          { q: "3. Nhiều thành phố đã cấm xe ô tô vào trung tâm. Biện pháp này được người đi bộ ủng hộ nhưng bị chủ cửa hàng phản đối.", answers: ["Many cities have banned cars from their centres. This measure is supported by pedestrians but opposed by shopkeepers.", "Many cities have banned cars from their centres. This measure has been welcomed by pedestrians but opposed by shop owners.", "Many cities have banned cars from their centres; this measure is popular with pedestrians but opposed by shopkeepers."], hint: "This + danh từ tóm (measure) thay cho việc lặp lại cả câu." },
          { q: "4. Một số người muốn đánh thuế đồ uống có đường, trong khi những người khác cho rằng làm như vậy là bất công với người nghèo.", answers: ["Some people want to tax sugary drinks, whereas others argue that doing so is unfair to poorer people.", "Some people want sugary drinks to be taxed, while others argue that doing so would be unfair on the poor.", "Some people want a tax on sugary drinks, whereas others believe that doing so is unfair to low-income people."], hint: "whereas / while nối hai vế · doing so thay cho to tax sugary drinks." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Đoạn band 7 có 8 lỗi biết trước — đặt cạnh đoạn band 8" },
      {
        t: "p",
        text: "Đề: **In many countries, the number of people living alone is rising. Is this a positive or negative development?** Đọc đoạn band 7, tìm đủ **8 lỗi** (mỗi lỗi thuộc một cụm khác nhau) TRƯỚC khi đọc đoạn band 8 và bảng soi.",
      },
      {
        t: "passage",
        title: "Đoạn thân bài band 7 (ước tính) — 117 từ, có 8 lỗi",
        paras: [
          { text: "On the negative side, the number of people who live alone have increased the pressure on housing. Since a single person needs almost as much space as a couple, the demand of small flats has risen sharply, and this pushed rents up in the past ten years. Having moved out of their family homes, the cost of living becomes a burden for many young graduates. Moreover, a person who lives alone is more likely to suffer from the loneliness, especially in old age, however, this problem is rarely discussed. If governments would recognise this trend earlier, cities will now have more housing suitable for single occupants. It is essential that each local council reviews its housing plans." },
        ],
      },
      {
        t: "passage",
        title: "Đoạn thân bài band 8 (ước tính) — 121 từ",
        paras: [
          { text: "On the negative side, the growing number of single-person households has added considerably to the pressure on housing. Since one person needs almost as much space as a couple, the demand for small flats has risen sharply, and this has pushed rents up over the past decade. For many young graduates who have moved out of their family homes, the cost of living has consequently become a serious burden. A further concern is loneliness, particularly in old age; however, this problem is rarely discussed in public debate. Had governments recognised the trend earlier, cities would now have far more housing suited to single occupants. It is therefore essential that every local council review its housing plans with this group in mind." },
        ],
      },
      {
        t: "table",
        head: ["#", "Band 7 viết", "Band 8 sửa", "Cụm / mã"],
        rows: [
          ["1", "the number of people… ~~have~~ increased", "the number… **has** · hoặc đổi chủ ngữ (the growing number of single-person households has added…)", "B · G43 hoà hợp"],
          ["2", "the demand ~~of~~ small flats", "the demand **for** small flats", "B · G11 giới từ"],
          ["3", "~~this pushed~~ rents up in the past ten years", "this **has pushed** rents up **over** the past decade", "A · G12 mốc đến nay"],
          ["4", "~~Having moved out…, the cost of living~~ becomes", "For many young graduates **who have moved out**…, the cost of living has become", "E · G35 treo chủ ngữ"],
          ["5", "suffer from ~~the~~ loneliness", "loneliness (nói chung, không mạo từ)", "B · G10 mạo từ"],
          ["6", "…old age~~, however,~~ this problem", "old age**; however,** this problem", "H · G32 comma splice"],
          ["7", "If governments ~~would recognise~~…, cities ~~will now have~~", "**Had** governments **recognised**…, cities **would now have**", "F · G38 hỗn hợp"],
          ["8", "each local council ~~reviews~~", "every local council **review**", "F · G42 thức giả định"],
        ],
        caption: "Band 8 còn thêm: considerably, consequently, A further concern is — liên kết bằng từ mang nội dung, không bằng Moreover",
      },
      {
        t: "note",
        title: "💡 Mẹo — soát 4 phút theo đúng thứ tự của bảng này",
        items: [
          "Phút 1: **động từ chính** của mỗi câu — hoà hợp (1), thì theo mốc (3).",
          "Phút 2: **danh từ** — mạo từ (5), giới từ sau danh từ (2).",
          "Phút 3: **đầu câu và chỗ nối** — cụm rút gọn (4), however (6).",
          "Phút 4: **câu giả định / đề xuất** — if / would (7), that + V nguyên mẫu (8).",
        ],
      },
      { t: "rule", formula: "Soát 4 phút: động từ chính → danh từ → đầu câu & chỗ nối → câu giả định", vi: "Thứ tự đi từ lỗi phổ biến nhất đến lỗi hiếm nhưng đắt nhất." },

      /* ── 11 ── */
      { t: "h", text: "11. Kiểm tra cuối bài (12 câu)" },
      {
        t: "mcq",
        id: "t5d27-np-chon",
        title: "Chọn phương án đúng cho một bài viết band 8 (6 câu)",
        items: [
          { q: "1. “By the end of the period, the figure ___ to just under 40%.” (Task 1, quá khứ)", options: ["had fallen", "has fallen", "will have fallen", "was falling"], correct: 0, why: "By the end of the period (mốc quá khứ) ⇒ had V3. Cụm A · G22." },
          { q: "2. “A lack of affordable housing ___ many graduates to stay with their parents.”", options: ["forces", "force", "are forcing", "have forced"], correct: 0, why: "Chủ ngữ thật là A lack (số ít) ⇒ forces. Cụm B · G43." },
          { q: "3. “Governments should focus ___ improving public transport.”", options: ["on", "in", "to", "at"], correct: 0, why: "focus ON + V-ing. Cụm B · G11." },
          { q: "4. Which sentence is correct?", options: ["Built in the 1960s, the tower now needs major repairs.", "Built in the 1960s, engineers say the tower needs major repairs.", "Built in the 1960s, it is necessary to repair the tower.", "Built in the 1960s, the repairs to the tower are urgent."], correct: 0, why: "Cụm rút gọn Built… phải nói về the tower. Cụm E · G35." },
          { q: "5. “Were the tax ___ , demand for petrol would almost certainly fall.”", options: ["doubled", "double", "to doubled", "doubling"], correct: 0, why: "Were + S + V3 (bị động) = If the tax were doubled. Cụm F · G37 / G38." },
          { q: "6. “Some experts favour higher taxes; ___ argue that education is more effective.”", options: ["others", "the others", "another", "other"], correct: 0, why: "Some… ; others… (đại từ số nhiều, không xác định). Cụm B · G03." },
        ],
      },
      {
        t: "quiz",
        id: "t5d27-np-sua",
        kind: "fill",
        title: "Mỗi câu một lỗi — gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "1. Since 2015, the price of electricity [rose] by 30%.", answers: ["has risen", "has increased"], hint: "Since + mốc ⇒ hiện tại hoàn thành. Cụm A." },
          { q: "2. There [is] a number of reasons for this trend.", answers: ["are"], hint: "a number of + danh từ số nhiều ⇒ are. Cụm B." },
          { q: "3. This policy could contribute to [reduce] traffic.", answers: ["reducing"], hint: "contribute TO + V-ing. Cụm B." },
          { q: "4. The region [which] many migrants come is very poor.", answers: ["from which", "where"], hint: "come FROM ⇒ from which / where. Cụm E." },
          { q: "5. [Although] the high cost, the scheme was a success.", answers: ["Despite", "In spite of"], hint: "Trước danh từ ⇒ Despite / In spite of. Cụm H." },
          { q: "6. It is vital that the law [is] enforced consistently.", answers: ["be"], hint: "It is vital that + S + be V3. Cụm F." },
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài này — việc phải làm",
        items: [
          "Chép mọi câu sai của bài chẩn đoán vào Sổ lỗi theo mẫu ở mục 3 (mã G + quy tắc một dòng).",
          "Ngày 28 và 29: mỗi ngày làm lại ĐÚNG các câu sai, không làm lại câu đã đúng.",
          "Ngày 30 (viết lại bài yếu nhất): soát theo thứ tự 4 phút ở mục 10 và đánh dấu từng lỗi đã sửa bằng mã G.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d27-doc",
    kind: "reading",
    title: "Đọc: Reading đủ 3 passage · 40 câu · 55 phút — lần 3 của Tập 5 (mục tiêu 35+/40, ba lần liên tiếp đo tiến bộ)",
    goal: "Làm trọn bài Reading Academic thứ ba của Tập 5 (khoảng 3.000 từ, 40 câu, chín dạng câu hỏi, Passage 3 là văn lập luận về khoa học thần kinh và triết học) trong 55 phút theo nhịp 15 – 18 – 20 + 2 phút soát, đạt ít nhất 35/40 (≈ band 8.0), và đặt ba điểm Ngày 13 · 19 · 27 cạnh nhau để biết kỹ năng đã ổn định hay chỉ là một lần may.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này làm gì · đẩy tiêu chí nào",
        items: [
          "Lần 3 — lần cuối — trong chuỗi Reading đủ đề của Tập 5 (Ngày 13 · 19 · **27**). Mục tiêu của tập: ==35/40 ba lần liên tiếp==; hôm nay là lần quyết định.",
          "Ba đề tài: lịch sử kỹ thuật (cống ngầm London và mùa hè 1858) · sinh học còn bỏ ngỏ (lươn châu Âu đẻ ở đâu) · khoa học thần kinh gặp triết học (thí nghiệm Libet và ý chí tự do).",
          "Chín dạng: Note · TFNG · Matching information · Matching features · Summary có hộp từ · MCQ · YNNG · Choose TWO · chọn tiêu đề. Năm dạng — Matching information · Matching features · Summary có hộp từ · Choose TWO · chọn tiêu đề — không có ở lần 2 (Ngày 19): đề hôm nay đo đúng thứ lần 2 chưa đo.",
          "Nhịp giữ nguyên: ==15 – 18 – 20 + 2 phút soát==, đọc mỗi passage MỘT lần kỹ (Tập 5 Ngày 1 · 21), không quay lại đọc cả bài.",
          "Bẫy band 8 hôm nay: **lý do được trình bày ≠ niềm tin của một người** (cống ngầm) · **suy luận ≠ quan sát** (lươn) · **con số gây chú ý ≠ độ chính xác** và **điều người viết mô tả ≠ điều người viết khuyên** (Libet).",
          "Sau khi chấm: ghi nhãn K / P / S / C như hai lần trước, đặt ba điểm cạnh nhau, rồi soi Passage 1–3 bằng bản đồ ngữ pháp của Bài 1.",
        ],
      },
      { t: "h", text: "1. Trước khi bấm giờ — kế hoạch 55 phút, lần 3" },
      {
        t: "table",
        head: ["Mốc", "Việc", "Nếu trễ"],
        rows: [
          ["0:00 – 15:00", "Passage 1: Note (theo thứ tự bài) → TFNG", "15:00 chưa xong: đoán, đánh dấu, sang Passage 2"],
          ["15:00 – 33:00", "Passage 2: đọc 5 câu Matching information TRƯỚC, ghi lề mỗi đoạn một chữ; rồi Matching features (quét tên) và Summary", "Matching information kẹt: làm hai dạng sau trước — chúng chỉ đường về đúng đoạn"],
          ["33:00 – 53:00", "Passage 3: MCQ → YNNG → Choose TWO → tiêu đề (làm cuối cùng)", "Câu tiêu đề: loại phương án chỉ đúng một đoạn"],
          ["53:00 – 55:00", "Soát: câu trống, chính tả, số từ, chữ cái viết đúng (B chứ không phải b nếu đề yêu cầu chữ hoa)", "Không đọc lại passage nào"],
        ],
        caption: "Ghi giờ thật ở mỗi mốc — Ngày 29 sẽ dùng để chốt nhịp ngày thi",
      },
      {
        t: "note",
        title: "📌 Từ Ngày 13 và 19 sang hôm nay — sửa đúng chỗ",
        items: [
          "Nhãn **K** (không tìm ra chỗ) còn nhiều ⇒ Matching information 14–18 là phép thử: câu hỏi KHÔNG theo thứ tự bài. Ghi lề một chữ cho mỗi đoạn ngay khi đọc xong.",
          "Nhãn **S** (suy quá mức / nhầm chủ thể) còn nhiều ⇒ Passage 3 có ba giọng: Libet, các nhà nghiên cứu sau ông, và người viết. Khoanh “it seems to me”, “in other words”, “the lesson is”.",
          "Nhãn **P** (hiểu sai paraphrase) còn nhiều ⇒ Summary 23–26 có hộp từ: từ đúng hầu như không bao giờ là từ có trong bài — đọc nghĩa của câu, không dò chữ.",
        ],
      },
      { t: "p", text: "Chuẩn bị đồng hồ đếm ngược **55 phút**. Không tra từ điển. Không mở 💡 hay xem “why” trước khi hết giờ. Bấm giờ rồi bắt đầu." },

      /* ───────────── PASSAGE 1 ───────────── */
      { t: "h", text: "READING PASSAGE 1 — Questions 1–13 (15 phút)" },
      {
        t: "passage",
        title: "The Summer London Could Not Ignore",
        intro: "You should spend about 15 minutes on Questions 1–13, which are based on Reading Passage 1.",
        paras: [
          { text: "In the summer of 1858, the River Thames became, for a few weeks, the most discussed object in Britain. June and July were unusually hot and dry, the level of the river fell, and the mud along its banks, thick with the waste of well over two million people, began to bake in the sun. The stench that rose from it was so overpowering that newspapers named the episode the Great Stink. In the new Houses of Parliament, which stood directly on the river, curtains were soaked in chloride of lime in an attempt to make the air breathable, and members seriously discussed moving their business elsewhere. What the crisis produced, within a matter of weeks, was something that years of argument had failed to produce: a decision to rebuild the drainage of an entire city." },
          { text: "The problem had been growing for half a century. Until the early 1800s, most London houses disposed of their waste in cesspools, brick-lined pits beneath or behind the building that were emptied, irregularly and at some cost, by night-soil men, who sold what they collected to farmers as fertiliser. Two changes broke this arrangement. The first was the spread of the flush toilet, which sent far larger volumes of water into pits that had been designed to receive very little, so that many of them overflowed. The second was a set of regulations introduced in the late 1840s that required houses to connect their drains to the sewers. The sewers, however, had been built to carry rainwater, and they emptied directly into the Thames — the same river from which several private water companies drew the supply that Londoners drank." },
          { text: "The consequences were deadly, although most people at the time misunderstood them. Cholera swept through London in 1848–49 and again in 1853–54, killing tens of thousands. The prevailing medical view held that disease was spread by miasma, a poisonous vapour given off by decaying matter, and smell was therefore treated as the danger itself. A doctor named John Snow disagreed. During the 1854 outbreak he mapped the deaths in one district of Soho and found that they clustered around a single public water pump in Broad Street; when the handle of the pump was removed, the outbreak, which was already declining, came to an end. Snow argued that cholera was carried in contaminated water, but his view won few converts in his lifetime, and he died in June 1858, in the very weeks when the river was at its worst." },
          { text: "A body capable of acting already existed. The Metropolitan Board of Works had been created in 1855, and its chief engineer, Joseph Bazalgette, had drawn up a plan for a network of intercepting sewers. The principle was straightforward: rather than allowing hundreds of local sewers to empty into the river within the city, new sewers running roughly parallel to the Thames would intercept their contents and carry them several miles downstream, beyond the eastern edge of the built-up area. For three years the plan was argued over — about its cost, about where the outfalls should be placed, and about whether the national government or the Board should pay. The summer of 1858 ended the argument. A bill giving the Board the powers it needed, and allowing it to borrow three million pounds, passed through Parliament in a little over two weeks, an almost unheard-of speed for legislation of its size." },
          { text: "The system that Bazalgette built over the following decade and a half was enormous by any standard. Around eighty miles of large intercepting sewers, fed by more than a thousand miles of smaller street sewers, were laid beneath the city, and the work is said to have used more than three hundred million bricks. Much of the network ran downhill, but London is too flat for gravity to do all the work, and at several points pumping stations lifted the sewage so that it could continue its journey east. The largest of these, at Crossness on the south bank and Abbey Mills on the north, were housed in buildings so richly decorated that they were later nicknamed cathedrals of sewage. At the outfalls, the waste was held in reservoirs and released into the river only when the tide was going out, so that it would be carried towards the sea rather than back towards the city." },
          { text: "Two decisions made the system last. One was the construction of the Victoria Embankment along the north bank of the river, which reclaimed land from the Thames and contained, within a single structure, the main low-level sewer, a new road above it and, between the two, a tunnel for an underground railway. The other was a matter of arithmetic. Having estimated the volume of waste that each sewer would have to carry, Bazalgette is reported to have doubled the diameter of the pipes, on the grounds that the work would only be done once and that no city could predict its own growth. It was a piece of foresight for which later generations had reason to be grateful: London's population more than tripled in the century that followed, and much of his network is still in use." },
          { text: "It would be pleasing to report that the new sewers were built to stop cholera. They were not. The scheme had been justified to Parliament almost entirely in terms of smell; it worked against cholera because, by removing sewage from the stretch of river from which drinking water was drawn, it also removed the disease's main route of infection. The point was demonstrated, grimly, in 1866, when cholera returned to London. The deaths were concentrated in the east of the city, in an area whose connection to the new system had not yet been completed and whose water company, it later emerged, had been supplying water that was not properly filtered. Elsewhere, the outbreak barely registered. The system was not perfect: the outfalls simply moved the problem downstream, and it was not until the 1880s that sewage began to be treated before it entered the river. Yet when, in the 2010s, engineers began a new tunnel beneath the Thames to capture the overflows of Bazalgette's network, they were extending his design, not replacing it." },
        ],
      },
      { t: "p", text: "**Questions 1–6** — Complete the notes below. Choose **ONE WORD AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "note",
        title: "London's drainage before and during 1858",
        items: [
          "**The crisis of 1858:** in the Houses of Parliament, **1** ___ were treated with chloride of lime.",
          "**Before the 1800s ended:** most houses stored waste in **2** ___ ; the men who emptied them sold it to **3** ___ .",
          "**The old sewers:** originally built to carry **4** ___ ; they emptied into the Thames.",
          "**Medical opinion:** disease was thought to spread through a poisonous vapour called **5** ___ .",
          "**The Metropolitan Board of Works:** set up in **6** ___ ; chief engineer Joseph Bazalgette.",
        ],
      },
      {
        t: "quiz",
        id: "t5d27-doc-p1-ghi-chu",
        kind: "fill",
        title: "Questions 1–6 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1", answers: ["curtains"], hint: "Đoạn 1: “curtains were soaked in chloride of lime”. treated with ≈ soaked in." },
          { q: "2", answers: ["cesspools"], hint: "Đoạn 2: “disposed of their waste in cesspools, brick-lined pits”. Một từ: cesspools (pits là từ giải thích, không phải tên). Nhiễu C: viết sai chính tả cesspols." },
          { q: "3", answers: ["farmers"], hint: "Đoạn 2: “sold what they collected to farmers as fertiliser”. Nhiễu: fertiliser là THỨ được bán, không phải người mua." },
          { q: "4", answers: ["rainwater", "rain"], hint: "Đoạn 2: “The sewers, however, had been built to carry rainwater”. originally built ≈ had been built." },
          { q: "5", answers: ["miasma"], hint: "Đoạn 3: “disease was spread by miasma, a poisonous vapour”. Bài định nghĩa ngay sau dấu phẩy — đó là dấu hiệu đáp án." },
          { q: "6", answers: ["1855"], hint: "Đoạn 4: “The Metropolitan Board of Works had been created in 1855”. set up ≈ created. Nhiễu: 1858 là năm của cuộc khủng hoảng." },
        ],
      },
      {
        t: "p",
        text: "**Questions 7–13** — Do the following statements agree with the information given in Reading Passage 1? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.",
      },
      {
        t: "mcq",
        id: "t5d27-doc-p1-tfng",
        title: "Questions 7–13 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "7. Snow's explanation of how cholera spread was widely accepted before his death.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn 3: “his view won few converts in his lifetime”. few converts ↔ widely accepted. Bẫy: chi tiết cây bơm được tháo tay cầm làm người đọc tưởng ông đã thắng." },
          { q: "8. Before 1858, there was disagreement about who should pay for Bazalgette's plan.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn 4: “the plan was argued over… about whether the national government or the Board should pay”. disagreement ≈ argued over." },
          { q: "9. The 1858 bill took longer to pass than most laws of a similar size.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn 4: “passed… in a little over two weeks, an almost unheard-of speed for legislation of its size”. unheard-of speed = nhanh bất thường ⇒ ngược với took longer." },
          { q: "10. Some of the buildings that housed pumping stations were highly decorated.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn 5: “housed in buildings so richly decorated that they were later nicknamed cathedrals of sewage”. highly ≈ richly." },
          { q: "11. Local residents opposed the construction of the Victoria Embankment.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn 6 chỉ nói kè chứa những gì (cống, đường, đường hầm tàu). Không có chữ nào về ý kiến của người dân. Bẫy: “argued over” ở đoạn 4 nói về KẾ HOẠCH CỐNG, không phải về kè." },
          { q: "12. The 1866 outbreak was most severe in an area that had not yet been connected to the new sewers.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn 7: “The deaths were concentrated in the east…, in an area whose connection to the new system had not yet been completed”. most severe ≈ deaths were concentrated." },
          { q: "13. Bazalgette himself believed that cholera was spread by bad air.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn 7 nói kế hoạch được BIỆN HỘ trước Nghị viện bằng mùi (“justified to Parliament… in terms of smell”) — đó là lý do được trình bày, không phải niềm tin của riêng Bazalgette. Bài không nói ông nghĩ gì về bệnh tả. Bẫy S: suy từ niềm tin chung của thời đại sang một người cụ thể." },
        ],
      },

      /* ───────────── PASSAGE 2 ───────────── */
      { t: "h", text: "READING PASSAGE 2 — Questions 14–26 (18 phút)" },
      {
        t: "passage",
        title: "The Fish That Kept Its Secret",
        intro: "You should spend about 18 minutes on Questions 14–26, which are based on Reading Passage 2.",
        paras: [
          { label: "A", text: "For a creature found in rivers, lakes and ditches across most of Europe, the European eel has been remarkably elusive about how its life begins. Fishermen caught eels by the million, cooked them, smoked them and sold them, yet for more than two thousand years nobody could say where they came from, because nobody had ever found an eel carrying eggs. Aristotle, who examined eels with his usual care, concluded that they had no sex at all and arose spontaneously from the mud, or from what he called the guts of the earth. Later writers offered other theories — that eels grew from horse hairs dropped into water, or from the morning dew — and the absence of any better explanation kept such ideas alive for centuries." },
          { label: "B", text: "Science did not do much better at first. In 1876 a young medical student working at a research station in Trieste was given the task of settling whether male eels had testes. Over several weeks he dissected around four hundred of them and found nothing that he could confidently identify. The student was Sigmund Freud, and the episode has sometimes been mentioned, half seriously, in accounts of how he came to study the human mind instead. His difficulty had a simple cause, although nobody knew it at the time: the reproductive organs of an eel remain small and undeveloped for most of its life and mature only when it sets out on its final journey, by which time it has left the rivers where scientists were looking." },
          { label: "C", text: "The life cycle that was eventually pieced together is one of the strangest among fishes. An eel begins as a transparent larva, flat and shaped like a willow leaf, which drifts in the open ocean. As it approaches the coasts of Europe it changes into a glass eel, a small, see-through version of the adult, and then darkens as it moves up rivers. There it may remain for anything from five to twenty years, or even longer, as a yellow eel, feeding and growing. Then, for reasons that are still only partly understood, it undergoes a second metamorphosis: its eyes grow larger, its skin turns silver, its digestive system shrinks and it stops eating altogether. Having become what is known as a silver eel, it leaves fresh water for good and heads out to sea, living on the energy it has stored." },
          { label: "D", text: "The larva had in fact been described long before anyone knew what it was. Small leaf-shaped fish caught at sea had been given their own scientific name and classified as a separate species. In 1896 two Italian zoologists, Giovanni Battista Grassi and Salvatore Calandruccio, kept some of these creatures alive in tanks of sea water near Messina and watched them shrink and change into young eels. Where the larvae came from was a separate question, and it was taken up by the Danish biologist Johannes Schmidt. From 1904 onwards, Schmidt spent the best part of two decades persuading the captains of merchant ships, as well as research vessels, to tow fine nets across the Atlantic and to send him what they caught. His reasoning was simple: the smaller the larvae, the closer they must be to where they hatched. Year after year the smallest larvae came from further west and south, until, in the early 1920s, he announced that they were to be found in the Sargasso Sea, a region of the western Atlantic thousands of kilometres from the nearest European river." },
          { label: "E", text: "Schmidt's conclusion entered the textbooks, but it rested on an inference rather than on an observation. No one had seen an adult European eel in the Sargasso Sea, let alone one spawning there, and a few scientists continued to ask whether European eels actually completed the journey or whether the larvae came from somewhere else. Following an eel across an ocean proved extraordinarily difficult. Satellite tags, which detach from an animal at a programmed time and float to the surface to transmit their data, were tried repeatedly, but many came off far too early, and others revealed only that the eel carrying them had been eaten by a larger predator. In 2022, however, a team working from the Azores reported that several of the eels they had tagged had been tracked all the way to the region Schmidt had identified. It was the first direct evidence that adult eels reach the area, nearly a century after he had drawn his conclusion." },
          { label: "F", text: "The timing of that confirmation is uncomfortable, because the European eel is now in serious trouble. The number of glass eels arriving on European coasts has fallen, by most estimates, by more than ninety per cent since the early 1980s, and the species is classed as critically endangered. The causes are disputed. Dams and weirs block the routes up and down rivers; hydroelectric turbines kill eels on their way out to sea; a parasite accidentally introduced from Asia damages the organ that eels use to control their buoyancy; and changes in ocean currents may be carrying larvae off course. Which of these matters most is still debated, and the answer may differ from one river to the next." },
          { label: "G", text: "Commercial pressure adds a further complication. Eels are highly valued as food, particularly in parts of East Asia, but no one has yet found a way to breed them in captivity on a commercial scale, so every eel raised on a farm begins life as a wild glass eel caught at the coast. That has made young eels extremely valuable, and a large illicit trade has grown up in which glass eels are smuggled out of Europe, sometimes in ordinary suitcases. Protecting the species is therefore not only a scientific problem but a matter of law enforcement and of cooperation between countries that share a single, wandering population. It is a strange position to be in: we are trying to save an animal whose breeding has still never been observed in the wild." },
        ],
      },
      { t: "p", text: "**Questions 14–18** — Reading Passage 2 has seven paragraphs, **A–G**. Which paragraph contains the following information? Write the correct letter, **A–G**. **NB** You may use any letter more than once." },
      {
        t: "quiz",
        id: "t5d27-doc-p2-thong-tin",
        kind: "fill",
        title: "Questions 14–18 — Matching information (gõ chữ cái A–G)",
        items: [
          { q: "14. an explanation of why a search for reproductive organs was unsuccessful", answers: ["B"], hint: "B: “His difficulty had a simple cause… the reproductive organs of an eel remain small and undeveloped”. search ≈ settling whether… had testes; unsuccessful ≈ found nothing." },
          { q: "15. a list of possible causes of a decline whose relative importance is uncertain", answers: ["F"], hint: "F: dams · turbines · parasite · ocean currents + “Which of these matters most is still debated”. relative importance ≈ which matters most." },
          { q: "16. a method of locating a place by comparing the sizes of specimens", answers: ["D"], hint: "D: “the smaller the larvae, the closer they must be to where they hatched”. specimens ≈ larvae. Bẫy K: chữ Sargasso có ở cả D, E — câu hỏi hỏi PHƯƠNG PHÁP, chỉ D có." },
          { q: "17. a description of physical changes that prepare an animal for a long journey", answers: ["C"], hint: "C: “eyes grow larger, its skin turns silver, its digestive system shrinks… heads out to sea”. Bẫy: D cũng có “change into young eels” nhưng đó là biến đổi ấu trùng, không phải chuẩn bị cho chuyến đi." },
          { q: "18. a reference to equipment that often failed to provide useful information", answers: ["E"], hint: "E: “Satellite tags… many came off far too early, and others revealed only that the eel… had been eaten”. equipment ≈ satellite tags." },
        ],
      },
      { t: "p", text: "**Questions 19–22** — Look at the following statements and the list of people below. Match each statement with the correct person or people, **A–E**." },
      {
        t: "table",
        head: ["", "List of People"],
        rows: [
          ["A", "Aristotle"],
          ["B", "Sigmund Freud"],
          ["C", "Grassi and Calandruccio"],
          ["D", "Johannes Schmidt"],
          ["E", "the 2022 research team"],
        ],
      },
      {
        t: "quiz",
        id: "t5d27-doc-p2-nguoi",
        kind: "fill",
        title: "Questions 19–22 — Matching features (gõ chữ cái A–E)",
        items: [
          { q: "19. watched one stage of the eel's life turn into another", answers: ["C"], hint: "D: “watched them shrink and change into young eels”. one stage → another ≈ larva → young eel." },
          { q: "20. relied on help from people who were not scientists", answers: ["D"], hint: "D: “persuading the captains of merchant ships… to tow fine nets… and to send him what they caught”. Thuyền trưởng tàu buôn = không phải nhà khoa học." },
          { q: "21. believed that eels did not come from parents", answers: ["A"], hint: "A: “they had no sex at all and arose spontaneously from the mud”. arose spontaneously = tự sinh ra, không có bố mẹ." },
          { q: "22. produced the first direct evidence that adult eels reach their presumed breeding area", answers: ["E"], hint: "E: “It was the first direct evidence that adult eels reach the area”. Bẫy S: Schmidt (D) đưa ra KẾT LUẬN bằng suy luận — “rested on an inference rather than on an observation”." },
        ],
      },
      { t: "p", text: "**Questions 23–26** — Complete the summary using the list of words, **A–H**, below." },
      {
        t: "note",
        title: "Pressures on the European eel",
        items: [
          "Eels are especially valued as **23** ___ in parts of East Asia. Because nobody can yet **24** ___ them in captivity on a commercial scale, every farmed eel starts life as a wild glass eel.",
          "This has encouraged widespread **25** ___ , and protecting the species now depends partly on **26** ___ between the countries that share it.",
        ],
      },
      {
        t: "table",
        head: ["", "Words"],
        rows: [
          ["A", "food"], ["B", "breed"], ["C", "export"], ["D", "smuggling"],
          ["E", "fishing"], ["F", "cooperation"], ["G", "competition"], ["H", "medicine"],
        ],
      },
      {
        t: "quiz",
        id: "t5d27-doc-p2-hop-tu",
        kind: "fill",
        title: "Questions 23–26 — Summary (gõ chữ cái A–H)",
        items: [
          { q: "23", answers: ["A"], hint: "G: “Eels are highly valued as food”. H (medicine) không có trong bài." },
          { q: "24", answers: ["B"], hint: "G: “no one has yet found a way to breed them in captivity”. C (export) đúng ngữ pháp nhưng sai nghĩa: “export them in captivity” vô nghĩa." },
          { q: "25", answers: ["D"], hint: "G: “a large illicit trade… glass eels are smuggled out of Europe”. Bẫy E (fishing): bắt lươn thuỷ tinh có thể hợp pháp — điều bài nhấn là BUÔN LẬU." },
          { q: "26", answers: ["F"], hint: "G: “a matter of law enforcement and of cooperation between countries”. G (competition) là nghĩa ngược." },
        ],
      },

      /* ───────────── PASSAGE 3 ───────────── */
      { t: "h", text: "READING PASSAGE 3 — Questions 27–40 (20 phút + 2 phút soát)" },
      {
        t: "passage",
        title: "The Half-Second Before You Choose",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3.",
        paras: [
          { text: "In the early 1980s the American neuroscientist Benjamin Libet asked volunteers to do something almost absurdly simple. Seated in front of a screen on which a spot of light travelled round a clock face, completing a circuit roughly every two and a half seconds, they were to flex a wrist whenever they felt like doing so and afterwards report where the spot had been at the moment they first became aware of the urge to move. Meanwhile, electrodes on the scalp recorded the brain's electrical activity. Libet was interested in a slow build-up of activity, first described in the 1960s and known as the readiness potential, that reliably precedes voluntary movements. His result, published in 1983, has been described ever since as one of the most unsettling findings in neuroscience: on average, the readiness potential began about half a second before the wrist moved, but the volunteers reported becoming aware of their intention only about a fifth of a second before. The brain, it seemed, had started to act some three hundred milliseconds before its owner had decided to." },
          { text: "It is not difficult to see why the finding travelled. If a decision is under way before we are conscious of making it, then consciousness looks less like the author of our actions than like a commentator who arrives after the event, and the ordinary belief that we freely choose what we do begins to look like an illusion. Headlines and popular books drew precisely that conclusion. Libet himself did not. He suggested that, although the impulse to act might arise unconsciously, the conscious mind retained the power to stop it during the brief interval before the movement, a capacity that later writers nicknamed “free won't”. Whether such a veto would itself have unconscious causes is a question he never fully answered." },
          { text: "Later studies appeared to push the gap wider. In 2008 a team using brain scanning reported that patterns of activity could predict which of two buttons a person would press up to several seconds before the person reported deciding. The figure attracted attention; the accuracy attracted rather less. The predictions were correct roughly sixty per cent of the time, where guessing would have achieved fifty. That is a genuine signal, and an interesting one, but it is a long way from the picture, common in press coverage, of a machine that knows your choice before you do." },
          { text: "Other researchers turned their attention to the method itself, and found it weaker than its fame suggested. Judging the position of a moving spot at the instant of a feeling is a task people perform inconsistently, and the reported moment of awareness can be shifted by apparently minor details of the procedure. More seriously, the readiness potential is too small to be seen in a single trial; it appears only when dozens of recordings are lined up by the moment of movement and averaged. In 2012 Aaron Schurger and his colleagues proposed that what this averaging reveals may not be a decision at all. On their account, the brain's activity drifts up and down at random, and a movement occurs when the drift happens to cross a threshold. If one averages only the moments that ended in a movement, a gradual rise before each one is exactly what one would expect to find, even if nothing had been decided until the threshold was crossed. The ramp, in other words, may be a product of how the data are selected rather than a sign of a choice already made." },
          { text: "There is also the matter of what the volunteers were deciding. Flexing a wrist at a moment of one's choosing, for no reason and with nothing at stake, is about as far from a serious decision as an action can be. A study published in 2019 compared such arbitrary choices with deliberate ones, in which participants decided which of two charities should receive a real donation. The familiar build-up of activity appeared before the arbitrary choices but was largely absent before the deliberate ones. If that result holds, the most famous evidence against free will concerns exactly the kind of action in which free will was never thought to be much involved." },
          { text: "Even if every one of these objections were set aside, it seems to me that the experiments would show less than is usually claimed, because they test a conception of free will that few philosophers defend. That conception pictures a free choice as an uncaused spark: a moment of pure conscious decision with nothing in the brain before it. Most contemporary philosophers who think we have free will do not believe in such sparks. They hold that an action is free when it flows from the agent's own reasons, values and deliberation, and when it would have been different had those reasons been different. On this view it is no surprise that brain processes come before awareness; something in the brain must underlie deliberation, and nothing requires that we be conscious of every step. The discovery that the brain prepares an action before we notice ourselves deciding would threaten free will only if freedom had to begin with that moment of noticing." },
          { text: "None of this makes Libet's work insignificant. It has shown, at the very least, that our sense of when we decided is a post hoc reconstruction rather than a direct reading, and that is worth knowing; courts, for example, rely heavily on people's accounts of what they intended and when. It has also shown how readily a striking measurement can be stretched into a philosophical verdict. The lesson is not that neuroscience has nothing to say about freedom, but that the question it can answer — when does the brain begin to prepare a movement? — is not the question most people think it has answered. Half a second, it turns out, tells us a good deal about how we report our decisions and rather little about whether we make them." },
        ],
      },
      { t: "p", text: "**Questions 27–31** — Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq",
        id: "t5d27-doc-p3-chon",
        title: "Questions 27–31 — Multiple choice",
        items: [
          { q: "27. What does the writer say about the task given to Libet's volunteers?", options: ["A  It required several weeks of training.", "B  It was extremely simple.", "C  It involved choosing between two buttons.", "D  It was designed to put them under pressure."], correct: 1, why: "Đoạn 1: “to do something almost absurdly simple”. C là nhiệm vụ của nghiên cứu 2008 (đoạn 3) — bẫy nhầm thí nghiệm." },
          { q: "28. What was Libet's own interpretation of his results?", options: ["A  Free will is an illusion created by the brain.", "B  The readiness potential was caused by faulty equipment.", "C  Conscious awareness always comes before brain activity.", "D  The conscious mind may still be able to cancel an action."], correct: 3, why: "Đoạn 2: “Libet himself did not… the conscious mind retained the power to stop it” (free won't). A là kết luận của báo chí — “Headlines… drew precisely that conclusion. Libet himself did not.”" },
          { q: "29. Why does the writer mention the accuracy of the 2008 predictions?", options: ["A  to suggest that the results were less impressive than reports implied", "B  to show that brain scanning is more reliable than electrodes", "C  to prove that decisions are made without awareness", "D  to explain why the study was widely ignored"], correct: 0, why: "Đoạn 3: “The figure attracted attention; the accuracy attracted rather less… a long way from the picture, common in press coverage”. D ngược: nghiên cứu “attracted attention”." },
          { q: "30. According to Schurger and his colleagues, the gradual rise in activity before a movement", options: ["A  shows a decision gradually being formed.", "B  can be observed clearly in a single trial.", "C  occurs only before deliberate decisions.", "D  may result from the way the recordings are selected and averaged."], correct: 3, why: "Đoạn 4: “If one averages only the moments that ended in a movement, a gradual rise… is exactly what one would expect… a product of how the data are selected”. B ngược (“too small to be seen in a single trial”)." },
          { q: "31. What is the significance of the 2019 study, according to the writer?", options: ["A  It used the same method as Libet with more volunteers.", "B  It suggests the famous findings may not apply to choices that matter.", "C  It proved that people make better decisions when money is involved.", "D  It showed that donations are made without conscious thought."], correct: 1, why: "Đoạn 5: “largely absent before the deliberate ones… the most famous evidence against free will concerns exactly the kind of action in which free will was never thought to be much involved”." },
        ],
      },
      {
        t: "p",
        text: "**Questions 32–37** — Do the following statements agree with the claims of the writer in Reading Passage 3? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t5d27-doc-p3-ynng",
        title: "Questions 32–37 — YES / NO / NOT GIVEN",
        items: [
          { q: "32. In Libet's experiment, the volunteers had nothing to gain or lose from their choices.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn 5: “for no reason and with nothing at stake”. nothing to gain or lose ≈ nothing at stake." },
          { q: "33. Press reports of the 2008 study exaggerated what it had shown.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn 3: “a long way from the picture, common in press coverage, of a machine that knows your choice before you do”." },
          { q: "34. People are generally reliable at judging the exact moment they become aware of an urge.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn 4: “a task people perform inconsistently”." },
          { q: "35. Most neuroscientists now accept Libet's idea of a conscious veto.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn 2 chỉ nói ý tưởng được đặt biệt danh và Libet chưa trả lời trọn một câu hỏi về nó. Không có thông tin về mức chấp nhận của giới khoa học." },
          { q: "36. Most philosophers who defend free will believe that a free choice must have no cause in the brain.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn 6: “Most contemporary philosophers who think we have free will do not believe in such sparks” (uncaused spark). Bẫy: câu hỏi mô tả đúng quan niệm mà người viết nói ÍT người bảo vệ." },
          { q: "37. Courts should stop relying on people's accounts of their own intentions.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn 7: người viết chỉ MÔ TẢ “courts… rely heavily on people's accounts” để nói vì sao phát hiện đáng biết; không khuyên toà làm gì. Bẫy S: mô tả ≠ khuyến nghị." },
        ],
      },
      { t: "p", text: "**Questions 38–39** — Choose **TWO** letters, **A–E**. Which **TWO** weaknesses of Libet-style experiments does the writer mention?" },
      {
        t: "table",
        head: ["", "Options"],
        rows: [
          ["A", "The volunteers were not paid for taking part."],
          ["B", "People report the timing of their awareness inconsistently."],
          ["C", "The equipment was too expensive for other laboratories to use."],
          ["D", "The actions studied were of no importance to the volunteers."],
          ["E", "Too few volunteers took part in the original study."],
        ],
      },
      {
        t: "quiz",
        id: "t5d27-doc-p3-hai",
        kind: "fill",
        title: "Questions 38–39 — Choose TWO (gõ hai chữ cái, thứ tự nào cũng được)",
        items: [
          { q: "38–39. Two letters", answers: ["B D", "D B", "BD", "DB", "B, D", "D, B", "B,D", "D,B", "B and D", "D and B"], hint: "B — đoạn 4: “Judging the position of a moving spot… a task people perform inconsistently”. D — đoạn 5: “for no reason and with nothing at stake… far from a serious decision”. E là bẫy: bài nói tín hiệu nhỏ phải lấy trung bình nhiều lần đo, KHÔNG nói ít người tham gia." },
        ],
      },
      { t: "p", text: "**Question 40** — Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq",
        id: "t5d27-doc-p3-tieu-de",
        title: "Question 40 — The best title",
        items: [
          { q: "40. Which of the following is the most suitable title for Reading Passage 3?", options: ["A  A Machine That Reads Minds", "B  Why Neuroscience Has Disproved Free Will", "C  What a Famous Measurement Does and Does Not Show", "D  The Life and Work of Benjamin Libet"], correct: 2, why: "Câu chốt cả bài (đoạn 7): “the question it can answer… is not the question most people think it has answered”. A chỉ là hình ảnh báo chí bị bác ở đoạn 3; B ngược quan điểm người viết; D quá rộng (bài không kể đời Libet)." },
        ],
      },

      /* ───────────── CHẤM ───────────── */
      { t: "h", text: "Hết 55 phút — chấm điểm, đặt ba lần cạnh nhau" },
      {
        t: "table",
        head: ["Số câu đúng / 40", "Band Reading (ước tính)", "Nghĩa là"],
        rows: [
          ["39–40", "9.0", "Ổn định ở mức cao nhất; Ngày 29 chỉ cần giữ nhịp."],
          ["37–38", "8.5", "Vượt đích. Nếu Ngày 19 cũng ≥ 35 thì đích của tập đã đạt."],
          ["35–36", "8.0", "Đạt đích hôm nay. Ba lần đều ≥ 35 ⇒ kỹ năng đã ổn định; một lần dưới ⇒ xem lần đó trễ ở passage nào."],
          ["33–34", "7.5", "Chưa ổn định. Xem nhãn lỗi: nếu một nhãn chiếm ≥ 3 câu, Ngày 29 ôn đúng nhãn đó."],
          ["30–32", "7.0", "Có thể là nhịp chứ không phải kỹ năng: Passage 3 có bị cắt giờ không?"],
          ["dưới 30", "≤ 6.5", "Làm lại Passage 2 sau 3 ngày, 18 phút; ghi chỗ hết giờ."],
        ],
        caption: "Quy đổi theo bảng công khai của Academic Reading — chỉ là ước tính trên một đề tự soạn",
      },
      {
        t: "table",
        head: ["Lần", "Ngày 13", "Ngày 19", "Ngày 27", "Đọc bảng thế nào"],
        rows: [
          ["Điểm / 40", "…", "…", "…", "ba số cùng ≥ 35 = đích “3 đề liên tiếp” của Tập 5"],
          ["Nhãn nhiều nhất", "…", "…", "…", "cùng một nhãn ba lần = lỗi thói quen, không phải lỗi đề"],
          ["Passage trễ giờ", "…", "…", "…", "trễ cùng một passage = nhịp, không phải kỹ năng"],
        ],
        caption: "Tự điền vào Sổ lỗi — bảng này là thứ duy nhất cần mang sang Ngày 29",
      },
      {
        t: "table",
        head: ["Nhãn lỗi", "Câu dễ dính hôm nay", "Vì sao", "Ôn ở đâu"],
        rows: [
          ["**K — không tìm ra chỗ**", "Matching information 14–18", "câu hỏi không theo thứ tự bài; chữ Sargasso có ở D lẫn E", "Tập 5 Ngày 15 (match-info band 8) · Ngày 21"],
          ["**P — hiểu sai paraphrase**", "Note 1 · 4, TFNG 9 · 10, Summary 24 · 25", "treated with ↔ soaked in; unheard-of speed ↔ took longer; smuggled ↔ illicit trade", "Tập 4 Ngày 15 · Tập 5 Ngày 6"],
          ["**S — suy quá mức / nhầm chủ thể**", "TFNG 11 · 13, Features 22, MCQ 28, YNNG 35 · 37", "lý do biện hộ ≠ niềm tin của Bazalgette; suy luận của Schmidt ≠ bằng chứng 2022; báo chí ≠ Libet; mô tả ≠ khuyên", "Tập 5 Ngày 3 · 9 · 23"],
          ["**C — chính tả / quá số từ**", "Note 2 · 6, Choose TWO 38–39", "cesspools; 1855 không phải 1858; Choose TWO phải đủ hai chữ", "chép đúng chữ trong bài; đọc lệnh"],
        ],
        caption: "Ghi nhãn cạnh từng câu sai, rồi điền hàng “Nhãn nhiều nhất” ở bảng trên",
      },
      {
        t: "note",
        title: "💡 Mẹo: ba kiểu bẫy band 8 có trong đề hôm nay",
        items: [
          "**Lý do được trình bày ≠ niềm tin của một người** (câu 13): Nghị viện được thuyết phục bằng mùi; bài không nói Bazalgette tin gì. Khi câu hỏi gắn niềm tin cho MỘT người, tìm chữ believed / thought / argued đi với chính tên người đó.",
          "**Suy luận ≠ quan sát** (câu 22): “rested on an inference rather than on an observation” là câu chìa khoá của đoạn E. first direct evidence thuộc về người quan sát, không thuộc về người suy luận.",
          "**Mô tả ≠ khuyến nghị** (câu 37): người viết nhắc toà án để nói vì sao phát hiện đáng biết. YES chỉ khi người viết nói should / ought / it would be better if.",
        ],
      },

      { t: "h", text: "Soi lại ba passage bằng bản đồ ngữ pháp của Bài 1" },
      { t: "p", text: "Ba bài đọc dùng đúng những cụm bạn vừa ôn: mệnh đề phân từ (cụm E), giới từ + which (cụm E), mệnh đề danh ngữ làm chủ ngữ (cụm E), giả định và thức giả định (cụm F). Điền MỘT từ lấy nguyên văn từ bài." },
      {
        t: "quiz",
        id: "t5d27-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ ba passage (6 câu)",
        items: [
          { q: "1. Mệnh đề phân từ (Passage 1, đoạn 6): “___ estimated the volume of waste that each sewer would have to carry, Bazalgette is reported to have doubled…”", answers: ["Having"], hint: "Having + V3 — chủ ngữ ngầm là Bazalgette (đúng chủ ngữ của mệnh đề chính). Bài 1 mục 7." },
          { q: "2. Giới từ + which (Passage 1, đoạn 2): “the same river ___ which several private water companies drew the supply”", answers: ["from"], hint: "draw water FROM a river ⇒ from which. Bài 1 mục 7, lỗi ②." },
          { q: "3. Mệnh đề danh ngữ làm chủ ngữ (Passage 2, đoạn D): “___ the larvae came from was a separate question”", answers: ["Where"], hint: "Where + S + V làm chủ ngữ của was. Bài 1 cụm E · G30." },
          { q: "4. Giả định nhượng bộ (Passage 3, đoạn 6): “Even if every one of these objections ___ set aside, it seems to me…”", answers: ["were"], hint: "Even if + were (không thật) → would show. Bài 1 mục 8." },
          { q: "5. Thức giả định (Passage 3, đoạn 6): “nothing requires that we ___ conscious of every step”", answers: ["be"], hint: "require that + S + be (nguyên mẫu trần). Bài 1 mục 8 · G42." },
          { q: "6. Đảo ngữ thay if (Passage 3, đoạn 6): “it would have been different had those reasons ___ different”", answers: ["been"], hint: "had + S + V3 = if those reasons had been different. Bài 1 cụm G · G37 / G38." },
        ],
      },

      { t: "h", text: "Từ vựng hữu ích từ ba bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "stench", pos: "n", ipa: "/stentʃ/", vi: "mùi hôi thối nồng nặc", ex: "The stench from the river was so overpowering that MPs considered moving elsewhere.", exVi: "Mùi hôi thối từ dòng sông nồng nặc đến mức các nghị sĩ tính chuyện dời đi nơi khác.", more: "an overpowering / unbearable stench · the stench of rotting food · mạnh hơn smell, odour" },
          { w: "sewage", pos: "n", ipa: "/ˈsuːɪdʒ/", vi: "nước thải, chất thải (trong cống)", ex: "Untreated sewage was still being released into the river decades later.", exVi: "Nước thải chưa xử lý vẫn bị xả ra sông hàng chục năm sau.", more: "không đếm được · sewage treatment / sewage works · ⚠️ sewer = đường cống; sewage = thứ chảy trong cống" },
          { w: "outfall", pos: "n", ipa: "/ˈaʊtfɔːl/", vi: "cửa xả (nơi cống / sông đổ ra)", ex: "The outfalls simply moved the problem further downstream.", exVi: "Các cửa xả chỉ đơn giản là dời vấn đề xuống hạ lưu.", more: "a sewage outfall · an outfall pipe" },
          { w: "intercept", pos: "v", ipa: "/ˌɪntəˈsept/", vi: "chặn lại (giữa đường)", ex: "New sewers would intercept the waste before it reached the river.", exVi: "Các cống mới sẽ chặn chất thải lại trước khi nó ra tới sông.", more: "intercept a message / a ball / a shipment · danh từ interception" },
          { w: "foresight", pos: "n", ipa: "/ˈfɔːsaɪt/", vi: "tầm nhìn xa", ex: "Doubling the pipe size was a piece of foresight that later generations benefited from.", exVi: "Làm ống to gấp đôi là một tầm nhìn xa mà các thế hệ sau được hưởng lợi.", more: "have the foresight to V · show great foresight · trái nghĩa: hindsight (nhìn lại sau)" },
          { w: "elusive", pos: "adj", ipa: "/iˈluːsɪv/", vi: "khó nắm bắt, khó tìm ra", ex: "The eel's breeding ground remained elusive for centuries.", exVi: "Nơi lươn sinh sản vẫn khó tìm ra suốt nhiều thế kỷ.", more: "an elusive goal / answer / quality · prove elusive" },
          { w: "spawn", pos: "v / n", ipa: "/spɔːn/", vi: "(cá) đẻ trứng; trứng cá", ex: "No one has ever seen a European eel spawn in the wild.", exVi: "Chưa ai từng thấy lươn châu Âu đẻ trứng ngoài tự nhiên.", more: "spawning ground (bãi đẻ) · nghĩa bóng: spawn imitators = làm nảy sinh hàng loạt bản bắt chước" },
          { w: "metamorphosis", pos: "n", ipa: "/ˌmetəˈmɔːfəsɪs/", vi: "sự biến hình, biến thái (sinh học); sự lột xác", ex: "Before its final journey, the eel undergoes a second metamorphosis.", exVi: "Trước chuyến đi cuối cùng, con lươn trải qua lần biến thái thứ hai.", more: "undergo a metamorphosis · số nhiều metamorphoses /-siːz/ · nghĩa bóng: the city's metamorphosis into a tech hub" },
          { w: "illicit", pos: "adj", ipa: "/ɪˈlɪsɪt/", vi: "bất hợp pháp, trái phép", ex: "An illicit trade in glass eels has grown up between Europe and Asia.", exVi: "Một đường dây buôn bán lươn thuỷ tinh trái phép đã hình thành giữa châu Âu và châu Á.", more: "illicit trade / drugs / funds · ⚠️ khác elicit /ɪˈlɪsɪt/ (khơi gợi) — đọc giống hệt" },
          { w: "buoyancy", pos: "n", ipa: "/ˈbɔɪənsi/", vi: "sức nổi; (kinh tế) sự sôi động", ex: "The parasite damages the organ that eels use to control their buoyancy.", exVi: "Ký sinh trùng làm hỏng cơ quan mà lươn dùng để điều chỉnh sức nổi.", more: "tính từ buoyant · a buoyant economy / market = kinh tế sôi động" },
          { w: "threshold", pos: "n", ipa: "/ˈθreʃhəʊld/", vi: "ngưỡng", ex: "A movement occurs when random activity happens to cross a threshold.", exVi: "Một cử động xảy ra khi hoạt động ngẫu nhiên tình cờ vượt qua một ngưỡng.", more: "cross / reach / exceed a threshold · the poverty threshold · ⚠️ đọc /ˈθreʃhəʊld/ — chỉ một h ở giữa" },
          { w: "post hoc", pos: "adj / adv", ipa: "/ˌpəʊst ˈhɒk/", vi: "(làm) sau khi sự việc đã xảy ra, hồi cứu", ex: "Our sense of when we decided is a post hoc reconstruction.", exVi: "Cảm nhận về lúc ta quyết định là một sự dựng lại sau khi việc đã xảy ra.", more: "a post hoc explanation / justification · văn học thuật; khi nói: after the fact" },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau buổi làm đủ",
        items: [
          "Điền bảng ba lần (Ngày 13 · 19 · 27) vào Sổ lỗi. Đây là bảng Ngày 29 sẽ dùng để chọn dạng câu cần ôn trong checklist 16 dạng.",
          "Chọn passage bạn sai nhiều nhất, làm lại sau 3 ngày đúng số phút của nó, KHÔNG xem đáp án cũ.",
          "Chép 4 câu “bẫy” (13 · 22 · 35 · 37) và tự viết một câu giải thích vì sao phương án nhiễu hấp dẫn.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d27-noi",
    kind: "speaking",
    title: "Nói: Sprint Part 3 — 12 đề × 3 câu, sáu chức năng câu hỏi và động tác band 8 cho mỗi chức năng; 🔊 cụm “mua thời gian” nói nhanh, giọng thấp",
    goal: "Nhận ra trong 2 giây câu hỏi Part 3 thuộc chức năng nào (ý kiến · so sánh · nguyên nhân · dự đoán · đánh giá chính sách · giả định), mở câu trả lời bằng đúng động tác band 8 của chức năng đó, và nói 40–50 giây cho mỗi câu của 12 đề hay gặp mà không lặp một khung — với cụm “mua thời gian” nói nhanh, giọng thấp, không kéo dài âm “ờ”.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **FC 7 → 8** và **LR 7 → 8**. Band 8 ở Part 3: ==ngắt vì đang nghĩ NỘI DUNG, không vì tìm từ==; phát triển ý mạch lạc; đổi hướng khi giám khảo hỏi vặn.",
          "Part 3 thật đổi chủ đề nhanh: 4–6 câu, mỗi câu một chức năng khác. Thuộc ý cho một đề không giúp được gì; thứ cần luyện là **chuyển chức năng nhanh**.",
          "Sáu chức năng: ==O ý kiến · C so sánh · W nguyên nhân · P dự đoán · E đánh giá chính sách · H giả định==. Mỗi chức năng có một động tác band 8 và một khung mở.",
          "12 đề × 3 câu = 36 câu, phủ những chủ đề Part 3 hay gặp nhất: công nghệ, giáo dục, việc làm, nhà ở, môi trường, tin tức, du lịch, sức khoẻ, gia đình, quảng cáo, thể thao, khoa học.",
          "🔊 Cụm mua thời gian (That's an interesting one…) phải ==nói nhanh, giọng thấp, liền hơi== — nói chậm và rõ từng từ nghe như đọc thuộc lòng.",
          "Ngữ pháp nói (G44 — Bài 1 câu 44) dùng ngay ở đây: tỉnh lược, chunk, nhượng bộ ngắn.",
        ],
      },
      { t: "h", text: "1. Sprint Part 3 là gì — ba vòng, 50 phút" },
      {
        t: "table",
        head: ["Vòng", "Làm gì", "Thời gian"],
        rows: [
          ["① Nhận dạng", "đọc 36 câu ở mục 4, gắn nhãn chức năng O / C / W / P / E / H cho từng câu — không nói", "10 phút"],
          ["② Nói", "ba lượt ghi âm ở mục 7 (mỗi lượt 6 câu); mỗi câu 40–50 giây, không chuẩn bị giữa các câu", "25 phút"],
          ["③ Soát", "nghe lại; chấm từng câu theo bảng 4 tiêu chí ở mục 3; viết lại MỘT câu yếu nhất thành câu band 8", "15 phút"],
        ],
        caption: "Sprint = nhiều câu, nhanh, đổi chức năng liên tục — giống nhịp phòng thi",
      },
      {
        t: "note",
        title: "💡 Vì sao sprint mà không luyện sâu một đề",
        items: [
          "Giám khảo Part 3 không hỏi theo kịch bản cố định của bạn. Câu thứ hai thường là **câu hỏi vặn** (But isn't it true that…?) hoặc chuyển trục (What about older people?).",
          "Người band 7 trả lời tốt câu đầu, rồi lặp đúng khung đó cho mọi câu sau (I think… because… for example…). Giám khảo nghe ra khuôn, và FC dừng ở 7.",
          "Sprint buộc bạn đổi động tác mỗi câu — đó chính là “linh hoạt” trong mô tả band 8.",
        ],
      },

      { t: "h", text: "2. Sáu chức năng câu hỏi Part 3 — và động tác band 8 của mỗi chức năng" },
      {
        t: "table",
        head: ["Chức năng", "Nhận ra bằng", "Động tác band 8", "Khung mở"],
        rows: [
          ["**O** Ý kiến", "Do you think… · Is it right / fair… · To what extent…", "lập trường CÓ MỨC + một giới hạn", "Broadly, yes — though I'd draw the line at…"],
          ["**C** So sánh", "How is X different from… · compared with the past · Who… more, X or Y?", "chọn TRỤC so sánh + một điểm giống bất ngờ", "The obvious difference is…, but what's changed less than people assume is…"],
          ["**W** Nguyên nhân", "Why do… · What makes… · What are the reasons…", "hai tầng: lý do bề mặt → lý do sâu hơn", "On the surface it's…, but I think what's really driving it is…"],
          ["**P** Dự đoán", "Will… in the future · How might… change · Do you expect…", "xu hướng + ĐIỀU KIỆN + mức chắc", "I'd expect…, provided that…; what's much harder to predict is…"],
          ["**E** Đánh giá / Should", "Should the government… · Who should be responsible… · Is it a good idea…", "tiêu chí → ai làm → cái giá", "It depends what we're trying to achieve. If the aim is…, then…"],
          ["**H** Giả định", "What would happen if… · Imagine… · If X were banned…", "hệ quả bậc 1 → hệ quả bậc 2 (knock-on)", "The immediate effect would be…; the knock-on effect, though, might be…"],
        ],
        caption: "Nhãn một chữ — gắn trong đầu ngay khi giám khảo dứt câu",
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + would + V …; the knock-on effect, though, might be + N / that S V", vi: "H — hai bậc hệ quả: bậc 1 hiển nhiên, bậc 2 mới là điểm.", examples: [{ en: "If plastic packaging were banned outright, the immediate effect would be higher food prices; the knock-on effect, though, might be far more food waste, because fresh produce would spoil faster.", vi: "Nếu bao bì nhựa bị cấm hoàn toàn, tác động trước mắt sẽ là giá thực phẩm tăng; nhưng hệ quả dây chuyền có thể là lãng phí thực phẩm nhiều hơn hẳn, vì rau quả tươi sẽ hỏng nhanh hơn." }] },
          { formula: "I'd expect + N / S to V, provided that + S + V; what's harder to predict is + wh-clause", vi: "P — dự đoán có điều kiện và có chỗ mình KHÔNG chắc.", examples: [{ en: "I'd expect far more people to work part of the week from home, provided that broadband keeps improving; what's much harder to predict is whether cities will adapt their offices.", vi: "Tôi đoán sẽ có nhiều người làm việc ở nhà một phần tuần hơn hẳn, miễn là internet tiếp tục tốt lên; điều khó đoán hơn nhiều là liệu các thành phố có điều chỉnh văn phòng hay không." }] },
          { formula: "On the surface it's + N; but what's really driving it, I think, is + N / that S V", vi: "W — tầng bề mặt rồi tầng sâu; tầng sâu là chỗ ghi điểm.", examples: [{ en: "On the surface it's about price, but what's really driving it, I think, is the fear of missing out on what everyone else seems to have.", vi: "Bề ngoài là chuyện giá cả, nhưng tôi nghĩ thứ thật sự thúc đẩy nó là nỗi sợ bỏ lỡ những gì người khác dường như đều có." }] },
        ],
      },
      { t: "rule", formula: "Nghe câu hỏi → gọi tên chức năng (O / C / W / P / E / H) → mở bằng khung của chức năng → một ví dụ cụ thể → câu chốt có giới hạn", vi: "Năm bước, 40–50 giây; khung đổi theo chức năng nên không bao giờ lặp một khuôn." },

      { t: "h", text: "3. Một câu hỏi, hai mức — band 7 và band 8 (ước tính)" },
      {
        t: "dialogue",
        title: "Chức năng W — nguyên nhân",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do some young people trust information on social media more than traditional news?", vi: "Vì sao một số người trẻ tin thông tin trên mạng xã hội hơn tin tức truyền thống?" },
          { who: "Candidate (band 7)", role: "a", text: "I think there are many reasons. Firstly, social media is very convenient and young people use it every day. Secondly, the news on social media is short and easy to understand. For example, my friends watch TikTok to know what is happening. So I think social media will be more popular than newspapers in the future.", vi: "Tôi nghĩ có nhiều lý do. Thứ nhất, mạng xã hội rất tiện và người trẻ dùng mỗi ngày. Thứ hai, tin trên mạng xã hội ngắn và dễ hiểu. Ví dụ bạn tôi xem TikTok để biết chuyện gì đang xảy ra. Nên tôi nghĩ mạng xã hội sẽ phổ biến hơn báo trong tương lai." },
          { who: "Candidate (band 8)", role: "candidate", text: "On the surface it's convenience — the news simply arrives in the same feed as everything else. But what's really driving it, I think, is that it feels personal. A video from someone your own age, talking straight to the camera, comes across as honest in a way that a polished news report doesn't, even when the report is far better sourced. And there's a certain logic to it: if you've grown up hearing that big media organisations have their own agendas, a single person with nothing obvious to sell can seem more trustworthy. The irony, of course, is that many of those individuals have far stronger incentives to exaggerate than a newspaper does.", vi: "Bề ngoài là sự tiện lợi — tin tức đến ngay trong cùng một dòng với mọi thứ khác. Nhưng tôi nghĩ thứ thật sự thúc đẩy là cảm giác gần gũi. Một video của người cùng tuổi, nói thẳng vào máy quay, nghe có vẻ thật lòng theo cách mà một bản tin được dàn dựng kỹ không có được, kể cả khi bản tin có nguồn tốt hơn nhiều. Và điều đó cũng có lý của nó: nếu bạn lớn lên với việc nghe rằng các hãng truyền thông lớn đều có mục đích riêng, thì một cá nhân không có gì rõ ràng để bán có thể trông đáng tin hơn. Mỉa mai thay, nhiều cá nhân như vậy lại có động cơ phóng đại mạnh hơn nhiều so với một tờ báo." },
        ],
      },
      {
        t: "dialogue",
        title: "Chức năng E — đánh giá chính sách (có câu hỏi vặn)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Should popular tourist destinations limit the number of visitors?", vi: "Các điểm du lịch nổi tiếng có nên giới hạn số khách không?" },
          { who: "Candidate (band 8)", role: "candidate", text: "It depends what we're trying to protect. If the aim is to stop a fragile place being physically worn away — an ancient site, a coral reef — then yes, a cap seems unavoidable, and a booking system is probably the fairest way to run it. If the aim is to keep a city pleasant for the people who live there, I'm less sure a cap works; spreading visitors across the year and across neighbourhoods might do more good.", vi: "Còn tuỳ ta đang muốn bảo vệ điều gì. Nếu mục tiêu là giữ một nơi mong manh khỏi bị bào mòn — một di tích cổ, một rạn san hô — thì đúng, giới hạn có vẻ là không tránh được, và hệ thống đặt chỗ trước có lẽ là cách vận hành công bằng nhất. Nếu mục tiêu là giữ một thành phố dễ sống cho người dân ở đó, tôi kém chắc hơn rằng giới hạn có tác dụng; dàn khách ra cả năm và ra nhiều khu có thể có ích hơn." },
          { who: "Examiner", role: "examiner", text: "But wouldn't a limit just mean only rich people can visit?", vi: "Nhưng chẳng phải giới hạn sẽ chỉ khiến người giàu mới đi được sao?" },
          { who: "Candidate (band 8)", role: "candidate", text: "That's the real risk, yes — if the limit is enforced through price. A lottery or a fixed share of cheaper tickets would avoid that, at least in principle. So I'd say the question isn't really whether to limit numbers, but how.", vi: "Đó đúng là rủi ro thật — nếu giới hạn được áp bằng giá. Bốc thăm hoặc dành một phần cố định vé rẻ sẽ tránh được điều đó, ít nhất là trên nguyên tắc. Nên tôi cho rằng câu hỏi thật ra không phải có nên giới hạn hay không, mà là giới hạn bằng cách nào." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["FC", "dùng Firstly / Secondly như bài viết; kết bằng một dự đoán không liên quan câu hỏi", "mở bằng động tác của chức năng (surface → really driving); chuyển ý bằng And / The irony is — tự nhiên như nói"],
          ["LR", "convenient, popular, easy to understand — đúng nhưng chung", "comes across as · far better sourced · agendas · incentives to exaggerate — chính xác, đúng ngữ cảnh"],
          ["GRA", "câu đơn nối bằng and / so; một lỗi to know what is happening", "a way that… doesn't · if you've grown up hearing that… · far stronger incentives… than — phức mà không lỗi"],
          ["Câu hỏi vặn", "lặp lại ý cũ to hơn", "nhận rủi ro (That's the real risk, yes) → nêu điều kiện → chuyển câu hỏi thành “how” — vặn là cơ hội, không phải bị bắt lỗi"],
        ],
        caption: "Band 8 không dài hơn nhiều — nó cụ thể hơn và đổi hướng có chủ ý",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — bốn thói quen giữ người ta ở band 7 trong Part 3",
        items: [
          "Mở mọi câu bằng **I think there are many reasons** — giám khảo nghe ra khuôn từ câu thứ hai.",
          "**Firstly / Secondly / In conclusion** khi nói: đúng ngữ pháp nhưng là văn viết; FC bị đánh giá là “máy móc”.",
          "Kể chuyện cá nhân dài (my friend…) cho câu hỏi về XÃ HỘI. Part 3 hỏi về người nói chung; ví dụ cá nhân chỉ một câu.",
          "Gặp câu hỏi vặn thì lùi hẳn (Yes, you're right, I agree) — mất lập trường. Band 8 nhận phần đúng rồi giữ phần còn lại.",
        ],
      },

      { t: "h", text: "4. 12 đề sprint — 36 câu (O ý kiến · C so sánh · W nguyên nhân · P dự đoán · E đánh giá · H giả định)" },
      { t: "p", text: "Vòng ①: che cột cuối, tự gắn nhãn chức năng cho 36 câu, rồi so với nhãn trong ngoặc. Cột cuối là **một góc nghĩ band 8** — không phải câu trả lời mẫu; dùng nó khi bí ý, không học thuộc." },
      {
        t: "table",
        head: ["#", "Chủ đề", "Ba câu hỏi", "Góc nghĩ band 8"],
        rows: [
          ["1", "Technology & privacy", "Do you think people worry enough about their personal data? (O) · Why are people willing to give up privacy for convenience? (W) · Should companies be allowed to charge different customers different prices based on their data? (E)", "lợi ích đến NGAY, cái giá đến SAU và vô hình — the bill arrives later"],
          ["2", "Education & exams", "How has the way students prepare for exams changed since your parents' time? (C) · Are exams the fairest way to judge what students have learned? (O) · What would happen if universities stopped using entrance exams altogether? (H)", "thi không công bằng nhất, nhưng KHÓ GIAN LẬN nhất — fairness vs. accuracy"],
          ["3", "Work & automation", "Which jobs will be most affected by AI in the next ten years? (P) · Why do some people resist new technology at work? (W) · Who should pay to retrain workers whose jobs disappear? (E)", "AI thay NHIỆM VỤ trước khi thay NGHỀ; deskill vs. upskill"],
          ["4", "Cities & housing", "Why can't many young people afford a home in big cities? (W) · Should governments control how much landlords charge? (E) · Is city life better for young people or for older people? (C)", "giá nhà = cung bị trói (quy hoạch) + nhà như tài sản đầu tư"],
          ["5", "Environment & the individual", "Can individuals make a real difference, or is it mainly up to governments? (O) · What would happen if plastic packaging were banned completely? (H) · Will people be willing to fly less in the future? (P)", "cá nhân tạo ÁP LỰC chính trị hơn là giảm phát thải trực tiếp"],
          ["6", "News & trust", "Why do some people trust social media more than traditional news? (W) · How is getting the news today different from twenty years ago? (C) · Should platforms be responsible for false information posted by users? (E)", "tin = cảm giác gần gũi, không phải nguồn tốt — mẫu ở mục 3"],
          ["7", "Tourism & local culture", "Does tourism protect local culture or damage it? (O) · Should popular destinations limit visitor numbers? (E) · How might tourism change as travel becomes more expensive? (P)", "văn hoá biến thành MÀN TRÌNH DIỄN cho khách — overtourism, gentrification"],
          ["8", "Health & lifestyle", "Why is it hard to keep healthy habits even when we know the benefits? (W) · Is it the government's job to make people live more healthily? (E) · Are people healthier today than fifty years ago? (C)", "môi trường quyết định hơn ý chí — nanny state hay thiết kế mặc định?"],
          ["9", "Family & generations", "How are relationships between grandparents and grandchildren different now? (C) · Why do some young adults live with their parents for longer? (W) · If every working parent could work from home, how would family life change? (H)", "ở với bố mẹ lâu hơn = kinh tế, không phải lười; không còn là rite of passage"],
          ["10", "Advertising & consumers", "Is advertising aimed at children acceptable? (O) · Why do people buy things they don't really need? (W) · Will influencers become more powerful than traditional advertising? (P)", "quảng cáo bán CẢM GIÁC thuộc về một nhóm, không bán đồ vật"],
          ["11", "Sport & competition", "Is competition in sport good for children? (O) · Should governments spend public money on hosting major sporting events? (E) · Why do some sports attract far more money than others? (W)", "tiền theo khán giả truyền hình; the lion's share đi về vài môn"],
          ["12", "Science & public money", "Should governments fund research with no obvious practical use? (E) · Should scientists be free to study whatever interests them? (O) · What would happen if all research were funded by private companies? (H)", "nghiên cứu cơ bản là the public good — không công ty nào trả tiền cho thứ ai cũng dùng được"],
        ],
        caption: "36 câu: 7 O · 5 C · 8 W · 4 P · 8 E · 4 H (W và E nhiều nhất — đúng như đề thật)",
      },

      { t: "h", text: "5. Từ vựng cho 12 đề — dùng đúng chỗ, mỗi lượt nói tối đa hai từ" },
      {
        t: "vocab",
        items: [
          { w: "overtourism", pos: "n", ipa: "/ˌəʊvəˈtʊərɪzəm/", vi: "tình trạng du lịch quá tải", ex: "Overtourism has pushed rents so high that locals can no longer afford to live in the old town.", exVi: "Du lịch quá tải đã đẩy giá thuê lên cao tới mức người địa phương không còn ở nổi trong phố cổ.", more: "tackle / suffer from overtourism · đề 7" },
          { w: "the public good", pos: "n", ipa: "/ðə ˌpʌblɪk ˈɡʊd/", vi: "lợi ích chung của xã hội", ex: "Basic research is a public good: once it is published, everyone can use it.", exVi: "Nghiên cứu cơ bản là một lợi ích chung: một khi đã công bố thì ai cũng dùng được.", more: "for the public good · (kinh tế học) a public good = hàng hoá công · đề 12" },
          { w: "zero-sum", pos: "adj", ipa: "/ˌzɪərəʊ ˈsʌm/", vi: "được–mất bằng nhau (bên này được thì bên kia mất)", ex: "Learning is not a zero-sum game; one student's progress does not hold another back.", exVi: "Học không phải trò chơi được–mất; tiến bộ của bạn này không kéo bạn khác lùi lại.", more: "a zero-sum game / view of the world · đề 2, 11" },
          { w: "a rite of passage", pos: "n", ipa: "/ə ˌraɪt əv ˈpæsɪdʒ/", vi: "nghi thức / cột mốc đánh dấu bước sang giai đoạn mới", ex: "Moving out at eighteen used to be a rite of passage; now it is often a luxury.", exVi: "Ra ở riêng năm mười tám tuổi từng là một cột mốc trưởng thành; giờ thường là điều xa xỉ.", more: "số nhiều rites of passage · đề 9" },
          { w: "nanny state", pos: "n", ipa: "/ˈnæni steɪt/", vi: "“nhà nước bảo mẫu” (can thiệp quá sâu vào lựa chọn cá nhân)", ex: "Critics call sugar taxes an example of the nanny state.", exVi: "Người phản đối gọi thuế đường là một ví dụ của nhà nước bảo mẫu.", more: "mang sắc thái CHÊ — dùng khi thuật lời người phản đối · đề 8" },
          { w: "gentrification", pos: "n", ipa: "/ˌdʒentrɪfɪˈkeɪʃn/", vi: "quá trình “quý tộc hoá” một khu (người khá giả dọn đến, người cũ bị đẩy đi)", ex: "Gentrification brings new cafés but often forces long-term residents out.", exVi: "Quý tộc hoá mang tới quán cà phê mới nhưng thường đẩy cư dân lâu năm đi.", more: "động từ gentrify · a gentrified neighbourhood · đề 4, 7" },
          { w: "a race to the bottom", pos: "n", ipa: "/ə ˌreɪs tə ðə ˈbɒtəm/", vi: "cuộc đua xuống đáy (cạnh tranh bằng cách hạ chuẩn)", ex: "Without regulation, platforms may enter a race to the bottom on content standards.", exVi: "Không có quy định, các nền tảng có thể lao vào cuộc đua hạ chuẩn nội dung.", more: "trigger / lead to a race to the bottom on wages / taxes / safety · đề 3, 6" },
          { w: "bear the brunt of", pos: "v phr", ipa: "/ˌbeə ðə ˈbrʌnt əv/", vi: "gánh chịu phần nặng nề nhất của", ex: "Older workers often bear the brunt of automation.", exVi: "Người lao động lớn tuổi thường gánh phần nặng nhất của tự động hoá.", more: "bear / take the brunt of the cuts / the storm · đề 3, 5" },
          { w: "the lion's share", pos: "n", ipa: "/ðə ˌlaɪənz ˈʃeə/", vi: "phần lớn nhất, phần của sư tử", ex: "Football takes the lion's share of sponsorship money.", exVi: "Bóng đá chiếm phần lớn nhất tiền tài trợ.", more: "the lion's share of + N · đề 11" },
          { w: "deskill", pos: "v", ipa: "/ˌdiːˈskɪl/", vi: "làm mất / làm giảm kỹ năng (công việc hoặc người làm)", ex: "Some software deskills a job, turning experts into button-pressers.", exVi: "Một số phần mềm làm công việc mất kỹ năng, biến chuyên gia thành người bấm nút.", more: "deskilling (n) · đối lập upskill · đề 3" },
        ],
      },

      { t: "h", text: "6. 🔊 Phát âm: cụm “mua thời gian” — nhanh, giọng thấp, liền hơi" },
      {
        t: "p",
        text: "Cụm mua thời gian là hợp lệ ở band 8 — người bản ngữ cũng dùng. Điều làm nó nghe giả là **cách nói**: chậm, rõ từng từ, lên giọng như đọc thuộc. Nói đúng là ==nhanh hơn phần còn lại của câu, giọng thấp hơn, nối âm liền một hơi==, rồi mới nhấn vào ý chính. Mỗi lượt trả lời chỉ một cụm, và đừng dùng cùng một cụm hai lần.",
      },
      {
        t: "table",
        head: ["Cụm", "Cách nói", "Lưu ý"],
        rows: [
          ["That's an interesting one", "thats‿ən‿interesting‿wʌn — một hơi, không nhấn interesting", "đừng dùng cho mọi câu — nghe như né"],
          ["I suppose it depends on…", "nhấn depends, phần trước lướt", "phải nói tiếp depends on WHAT — không thì rỗng"],
          ["Off the top of my head", "of‿the‿top‿of‿my‿head — nối phụ âm với nguyên âm", "chỉ dùng khi sắp nêu 1–2 ý ngắn"],
          ["Let me put it this way", "nhấn way, hạ giọng ở put it this", "dùng trước một ví dụ / so sánh"],
        ],
        caption: "Âm “ờ” kéo dài (ơơơ) bị tính vào FC — cụm ngắn nói nhanh thay được nó",
      },
      {
        t: "phatam",
        id: "t5d27-phat-am",
        title: "Luyện phát âm — cụm mua thời gian: nói nhanh, giọng thấp, nối âm liền một hơi",
        note: "Mỗi câu đọc ba lần: lần một chậm để máy chấm từng âm, lần hai nhanh hơn, lần ba ở tốc độ nói thật và hạ giọng ở phần đầu. Chú ý nối phụ âm cuối với nguyên âm đầu của từ sau (an‿interesting, of‿it).",
        items: [
          { text: "That's an interesting one, actually.", ipa: "ðæts ən ɪntrəstɪŋ wʌn æktʃuəli", vi: "Câu này hay đấy. (interesting chỉ ba âm tiết: IN-tres-ting)" },
          { text: "I suppose it depends on what you mean by success.", ipa: "aɪ səpəʊz ɪt dɪpendz ɒn wɒt juː miːn baɪ səkses", vi: "Tôi cho là còn tuỳ bạn hiểu thành công là gì." },
          { text: "Off the top of my head, I'd say two things.", ipa: "ɒf ðə tɒp əv maɪ hed aɪd seɪ tuː θɪŋz", vi: "Nghĩ ngay thì tôi sẽ nói hai điều." },
          { text: "Let me put it this way.", ipa: "let miː pʊt ɪt ðɪs weɪ", vi: "Để tôi nói thế này. (put it nối thành pu-tit)" },
          { text: "It's hard to generalise, but on the whole, yes.", ipa: "ɪts hɑːd tə dʒenrəlaɪz bət ɒn ðə həʊl jes", vi: "Khó nói chung chung, nhưng nhìn chung thì có." },
          { text: "The short answer is yes, but it's a bit more complicated than that.", ipa: "ðə ʃɔːt ɑːnsə ɪz jes bət ɪts ə bɪt mɔː kɒmplɪkeɪtɪd ðən ðæt", vi: "Trả lời ngắn là có, nhưng nó phức tạp hơn thế một chút." },
          { text: "I hadn't really thought about it before, but probably not.", ipa: "aɪ hædnt rɪəli θɔːt əbaʊt ɪt bɪfɔː bət prɒbəbli nɒt", vi: "Trước giờ tôi chưa thật sự nghĩ tới, nhưng có lẽ là không." },
          { text: "What I would say, though, is this.", ipa: "wɒt aɪ wʊd seɪ ðəʊ ɪz ðɪs", vi: "Nhưng điều tôi muốn nói là thế này. (though hạ giọng, this nhấn)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d27-noi-chuc-nang",
        title: "Gọi tên chức năng — chọn động tác mở phù hợp nhất (6 câu)",
        items: [
          { q: "1. “What would happen if every city made public transport free?”", options: ["The immediate effect would be fuller buses; the knock-on effect might be…", "On the surface it's about money, but…", "The obvious difference is…", "Broadly, yes — though…"], correct: 0, why: "What would happen if… = H (giả định) ⇒ hai bậc hệ quả." },
          { q: "2. “Why do so many people check their phones first thing in the morning?”", options: ["I'd expect that…, provided that…", "On the surface it's habit, but what's really driving it, I think, is…", "It depends what we're trying to achieve.", "The immediate effect would be…"], correct: 1, why: "Why… = W ⇒ tầng bề mặt rồi tầng sâu." },
          { q: "3. “Do you think shops will still exist in twenty years?”", options: ["Broadly, no — though I'd make an exception for…", "I'd expect far fewer of them, provided that delivery stays cheap; what's harder to predict is…", "The obvious difference is that…", "On the surface it's convenience…"], correct: 1, why: "will… in twenty years = P ⇒ xu hướng + điều kiện + chỗ không chắc. A trả lời như câu ý kiến." },
          { q: "4. “Should employers be allowed to monitor what staff do online?”", options: ["It depends what they're monitoring for. If the aim is security, then…", "The knock-on effect might be…", "On the surface it's about trust…", "The obvious difference is…"], correct: 0, why: "Should… be allowed = E ⇒ tiêu chí → ai → cái giá." },
          { q: "5. “How is shopping different for young people and for older people?”", options: ["The obvious difference is where they shop, but what's changed less than people assume is…", "I'd expect…, provided that…", "The immediate effect would be…", "It depends what we're trying to achieve."], correct: 0, why: "How is X different for A and B = C ⇒ chọn trục + một điểm giống bất ngờ." },
          { q: "6. “Is it fair that footballers earn more than nurses?”", options: ["The immediate effect would be…", "Fair, no — understandable, yes. Let me put it this way…", "I'd expect…, provided that…", "On the surface it's about…"], correct: 1, why: "Is it fair… = O ⇒ lập trường có mức + giới hạn (tách “công bằng” khỏi “dễ hiểu”)." },
        ],
      },

      { t: "h", text: "7. Luyện nói — ba lượt sprint, ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện: không dừng giữa các câu",
        items: [
          "Mỗi lượt 6 câu liền, như giám khảo hỏi thật: nghe câu → 2 giây gọi tên chức năng → nói 40–50 giây → câu tiếp. Không chuẩn bị trên giấy.",
          "Lượt A trộn đề 1–6, lượt B đề 7–12, lượt C toàn câu khó (E và H) và có câu hỏi vặn.",
          "Sau mỗi lượt nghe lại: đếm khung mở — nếu hai câu cùng một khung, lượt sau đổi.",
        ],
      },
      { t: "speak", id: "t5d27-noi-luot-a", part: "3", questions: ["Why are people often willing to give up their privacy in exchange for convenience?", "Are exams the fairest way to judge what students have learned?", "Which jobs do you think will be most affected by artificial intelligence in the next ten years?", "Should governments control how much landlords can charge in rent?", "What would happen if plastic packaging were banned completely?", "How is the way people get their news today different from twenty years ago?"] },
      { t: "speak", id: "t5d27-noi-luot-b", part: "3", questions: ["Does tourism help to protect local culture, or does it damage it?", "Is it the government's job to make people live more healthily?", "Why do some young adults choose to live with their parents for longer than in the past?", "Why do people buy things they don't really need?", "Should governments spend public money on hosting major sporting events?", "Should scientists be free to study whatever they find interesting?"] },
      { t: "speak", id: "t5d27-noi-luot-c", part: "3", questions: ["Who should pay to retrain workers whose jobs disappear — governments, companies or the workers themselves?", "But isn't it the workers' own responsibility to keep their skills up to date?", "What would happen if universities stopped using entrance exams altogether?", "If every working parent could work from home, how would family life change?", "What would happen if all scientific research were funded by private companies?", "Some people say that individuals cannot make any real difference to climate change. How would you respond to that?"] },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Chép 6 khung mở của mục 2 lên một trang; mỗi lần luyện, đánh dấu khung đã dùng.",
          "Chọn câu trả lời yếu nhất của ba lượt, viết lại thành 80–100 từ band 8 (mượn mẫu mục 3), rồi nói lại câu đó không nhìn giấy.",
          "Ngày 30 (giám khảo AI 14 phút): Part 3 sẽ có ít nhất một câu E và một câu H — hôm nay là lượt tập cuối cho hai chức năng này.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d27-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 27 — 44 điểm ngữ pháp theo cụm · sửa lỗi theo mã · đọc một bài lập luận ngắn · gọi tên chức năng Part 3 · từ vựng của ngày",
    goal: "Ôn trọn Ngày 27: sửa đúng lỗi của sáu cụm hay mất điểm, chọn đúng cấu trúc của ba cụm còn lại (so sánh, mẫu động từ, bị động – nhấn mạnh), đọc một bài lập luận ngắn để biết ý người viết, gọi đúng chức năng câu hỏi Part 3 — 38 câu có đáp án, một đoạn viết lại không lỗi do AI chấm và ba câu Part 3 ghi âm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài tập này ôn gì",
        items: [
          "Bài 1: ==sáu cụm hay mất điểm== (mốc thời gian · danh từ – mạo từ – hoà hợp · giới từ · câu phức · giả định & mức chắc · mạch & dấu câu) + ba cụm C · D · G.",
          "Bài 2: đọc ý người viết — YES / NO / NOT GIVEN với bẫy **mô tả ≠ khuyến nghị**.",
          "Bài 3: sáu chức năng câu hỏi Part 3 và khung mở của từng chức năng.",
          "Làm trong 70 phút, không mở 💡 trước khi xong một phần. Câu sai ⇒ ghi mã G vào Sổ lỗi.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 27 trong một hình",
        center: "Ôn tổng · Reading lần 3 · Sprint Part 3",
        branches: [
          { label: "44 điểm → 9 cụm", items: ["chẩn đoán trước, ôn sau", "sai ≥ 2 / cụm ⇒ đỏ", "câu đoán trúng vẫn ôn"] },
          { label: "Soát 4 phút", items: ["động từ chính", "danh từ", "đầu câu & chỗ nối", "giả định / đề xuất"] },
          { label: "Reading lần 3", items: ["35+ ba lần liên tiếp", "lý do ≠ niềm tin", "suy luận ≠ quan sát", "mô tả ≠ khuyên"] },
          { label: "Part 3: O C W P E H", items: ["khung mở theo chức năng", "hai tầng nguyên nhân", "hai bậc hệ quả", "vặn ⇒ nhận rồi giữ"] },
        ],
      },
      { t: "h", text: "I. Sửa lỗi theo mã — gõ lại phần [trong ngoặc] cho đúng (10 câu) — ôn Bài 1 mục 4–9" },
      {
        t: "quiz",
        id: "t5d27-bt-sua",
        kind: "fill",
        title: "I. Mỗi câu một lỗi — gõ lại phần [trong ngoặc]",
        items: [
          { q: "1. Over the past decade, the city [built] three new bridges.", answers: ["has built"], hint: "over the past decade (đến nay) ⇒ hiện tại hoàn thành. Mục 4 · G12." },
          { q: "2. By 1990, most factories in the area [closed].", answers: ["had closed", "had been closed"], hint: "By + mốc quá khứ ⇒ had V3. Mục 4 · G22." },
          { q: "3. [The] unemployment remains a serious problem in the region.", answers: ["Unemployment"], hint: "Danh từ trừu tượng nói chung ⇒ không mạo từ. Mục 5 · G10." },
          { q: "4. The quality of the roads [are] getting worse every year.", answers: ["is"], hint: "Chủ ngữ thật: the quality (số ít). Mục 5 · G43." },
          { q: "5. The new rules have had a huge impact [to] small businesses.", answers: ["on"], hint: "an impact ON. Mục 6 · G11." },
          { q: "6. Many parents object to [let] their children use phones at school.", answers: ["letting"], hint: "object TO + V-ing. Mục 6." },
          { q: "7. [Walking] into the room, the smell of fresh paint was overwhelming.", answers: ["As I walked", "When I walked", "As we walked", "When we walked"], hint: "Treo chủ ngữ: mùi sơn không đi vào phòng ⇒ đổi thành mệnh đề có chủ ngữ. Mục 7 · G35." },
          { q: "8. If the scheme [would be] cheaper, more councils would adopt it.", answers: ["were", "was"], hint: "Không would ở vế if ⇒ If… were. Mục 8 · G25." },
          { q: "9. The committee insisted that the report [is] published in full.", answers: ["be"], hint: "insist that + S + be V3. Mục 8 · G42." },
          { q: "10. Fuel prices rose sharply[, however,] demand barely changed.", answers: ["; however,", ". However,"], hint: "however nối hai mệnh đề ⇒ chấm phẩy hoặc dấu chấm trước. Mục 9 · G32." },
        ],
      },
      { t: "h", text: "II. Cụm C · D · G — chọn câu đúng (6 câu) — ôn Bài 1 mục 2 (câu 14–23, 33–36)" },
      {
        t: "mcq",
        id: "t5d27-bt-cum",
        title: "II. Chọn câu đúng",
        items: [
          { q: "1. Which sentence is correct?", options: ["The new model is twice as fast as the old one.", "The new model is twice faster than the old one.", "The new model is as twice fast as the old one.", "The new model is two times as faster as the old one."], correct: 0, why: "Bội số + as + tính từ nguyên + as. Cụm C · G33." },
          { q: "2. Which sentence is correct?", options: ["She stopped to buy coffee on her way to work, so she was late.", "She stopped buy coffee on her way to work.", "She stopped to buying coffee on her way to work.", "She stopped for buy coffee on her way to work."], correct: 0, why: "stop to V = dừng lại ĐỂ làm việc khác (stop V-ing = thôi làm). Cụm D · G15." },
          { q: "3. Which sentence is correct?", options: ["He suggested that we take the earlier train.", "He suggested us to take the earlier train.", "He suggested to take the earlier train.", "He suggested us taking the earlier train."], correct: 0, why: "suggest that + S + V nguyên mẫu / suggest + V-ing; KHÔNG suggest sb to V. Cụm D · G27 / G42." },
          { q: "4. Which sentence is correct?", options: ["The results are expected to be announced next week.", "The results are expected to announce next week.", "The results expect to be announced next week.", "The results are expecting to be announced next week."], correct: 0, why: "Bị động kép: be expected to be V3. Cụm G · G24." },
          { q: "5. Which sentence is correct?", options: ["Only when the data were checked did the error become clear.", "Only when the data were checked the error became clear.", "Only when were the data checked did the error become clear.", "Only when the data were checked became the error clear."], correct: 0, why: "Only when + mệnh đề thường, rồi đảo ở mệnh đề CHÍNH: did the error become. Cụm G · G37." },
          { q: "6. Which sentence is correct?", options: ["It was the cost, not the design, that the residents objected to.", "It was the cost, not the design, what the residents objected to.", "It was the cost, not the design, which the residents objected.", "What the residents objected was the cost, not the design."], correct: 0, why: "Câu chẻ It was X that… + giữ giới từ objected TO. Cụm G · G36." },
        ],
      },
      { t: "h", text: "III. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 4–9" },
      {
        t: "quiz",
        id: "t5d27-bt-dich",
        kind: "translate",
        title: "III. Dịch — dùng cấu trúc trong gợi ý",
        grammar: "Mỗi câu một cụm của Bài 1 — xem gợi ý",
        items: [
          { q: "1. Kể từ năm 2015, số người làm việc tự do đã tăng gần gấp đôi.", answers: ["Since 2015, the number of people working freelance has almost doubled.", "Since 2015, the number of self-employed people has nearly doubled.", "Since 2015 the number of freelancers has almost doubled."], hint: "Cụm A + B: Since… → has V3; the number… HAS." },
          { q: "2. Chính phủ nên tập trung vào việc cải thiện giao thông công cộng thay vì xây thêm đường.", answers: ["The government should focus on improving public transport rather than building more roads.", "Governments should focus on improving public transport instead of building more roads.", "The government should concentrate on improving public transport rather than on building more roads."], hint: "Cụm B: focus ON + V-ing · rather than + V-ing." },
          { q: "3. Được xây vào thập niên 1960, nhiều toà chung cư này hiện cần sửa chữa lớn.", answers: ["Built in the 1960s, many of these apartment blocks now need major repairs.", "Built in the 1960s, many of these blocks of flats are now in need of major repairs.", "Having been built in the 1960s, many of these apartment buildings now need major repairs."], hint: "Cụm E: Built… — chủ ngữ của mệnh đề chính phải là các toà nhà." },
          { q: "4. Điều cốt yếu là mọi trẻ em được học bơi.", answers: ["It is essential that every child be taught to swim.", "It is essential that every child should be taught to swim.", "It is essential that every child learn to swim."], hint: "Cụm F: It is essential that + S + be V3 / V nguyên mẫu." },
          { q: "5. Mặc dù có nhiều lợi ích, chính sách này vẫn bị chỉ trích; tuy nhiên, rất ít người đưa ra phương án thay thế.", answers: ["Despite its many benefits, the policy has still been criticised; however, very few people have offered an alternative.", "Despite having many benefits, this policy is still criticised; however, few people have proposed an alternative.", "In spite of its many benefits, the policy is still criticised; however, very few people have suggested an alternative."], hint: "Cụm H: Despite + N · ; however, ." },
        ],
      },
      { t: "h", text: "IV. Đọc — một bài lập luận ngắn (5 câu · 6 phút) — ôn Bài 2 (YNNG, bẫy mô tả ≠ khuyến nghị)" },
      {
        t: "passage",
        title: "In Defence of Concrete",
        paras: [
          { text: "Few buildings are as easy to dislike as the large concrete structures put up in many cities between the 1950s and the 1970s. The style, usually called brutalism, takes its name not from brutality but from the French béton brut, meaning raw concrete — concrete left as it came out of its wooden moulds, with the grain of the timber still visible on its surface. The British critic Reyner Banham helped to popularise the term in the 1950s, and for a time the style was associated with optimism: with public housing, universities and libraries built quickly for a growing population." },
          { text: "That optimism faded, and many of these buildings have since been demolished, often with public approval. I think we have been too quick. Concrete stains and weathers badly, and some of the housing was poorly maintained, but neglect is a reason to repair a building, not proof that its design has failed. Demolition also carries a cost that is rarely counted: the energy and emissions involved in making a new building are considerable, and a sound structure that is knocked down after fifty years wastes most of what went into it. Some cities have begun to refurbish rather than replace, and in several cases the results have been popular with residents. Not every brutalist building deserves to survive. But the burden of proof should lie with those who want to destroy, not with those who want to keep." },
        ],
      },
      {
        t: "mcq",
        id: "t5d27-bt-doc",
        title: "IV. Do the statements agree with the claims of the writer? YES / NO / NOT GIVEN",
        items: [
          { q: "1. The name of the style refers to the material it uses rather than to its appearance of cruelty.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“takes its name not from brutality but from the French béton brut, meaning raw concrete”." },
          { q: "2. Brutalist buildings were more expensive to build than other buildings of the period.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói xây NHANH (“built quickly”), không so sánh chi phí xây." },
          { q: "3. Poor maintenance shows that a building's design was a mistake.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“neglect is a reason to repair a building, not proof that its design has failed”." },
          { q: "4. The environmental cost of demolition is usually given too little attention.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“Demolition also carries a cost that is rarely counted: the energy and emissions…”. rarely counted ≈ given too little attention." },
          { q: "5. Every brutalist building should be protected by law.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“Not every brutalist building deserves to survive.” Bẫy: người viết bênh vực phong cách nhưng KHÔNG đòi giữ tất cả — “every” mâu thuẫn trực tiếp." },
        ],
      },
      { t: "h", text: "V. Gọi tên chức năng câu hỏi Part 3 (6 câu) — ôn Bài 3 mục 2" },
      {
        t: "mcq",
        id: "t5d27-bt-chuc-nang",
        title: "V. Câu hỏi thuộc chức năng nào?",
        items: [
          { q: "1. “How might the way we shop change over the next twenty years?”", options: ["P — dự đoán", "C — so sánh", "W — nguyên nhân", "E — đánh giá"], correct: 0, why: "How might… change over the next… = dự đoán ⇒ xu hướng + điều kiện + chỗ không chắc." },
          { q: "2. “Why do young people move to big cities?”", options: ["O — ý kiến", "W — nguyên nhân", "H — giả định", "P — dự đoán"], correct: 1, why: "Why… = nguyên nhân ⇒ tầng bề mặt rồi tầng sâu." },
          { q: "3. “Should museums be free to enter?”", options: ["C — so sánh", "H — giả định", "E — đánh giá", "W — nguyên nhân"], correct: 2, why: "Should… = đánh giá chính sách ⇒ tiêu chí → ai trả → cái giá." },
          { q: "4. “What would happen if cars were banned from city centres?”", options: ["H — giả định", "O — ý kiến", "P — dự đoán", "C — so sánh"], correct: 0, why: "What would happen if… = giả định ⇒ hệ quả bậc 1, bậc 2." },
          { q: "5. “Do older and younger people spend their free time differently?”", options: ["W — nguyên nhân", "C — so sánh", "E — đánh giá", "H — giả định"], correct: 1, why: "differently (hai nhóm) = so sánh ⇒ chọn trục + điểm giống bất ngờ." },
          { q: "6. “Is it right that celebrities earn so much money?”", options: ["P — dự đoán", "H — giả định", "O — ý kiến", "W — nguyên nhân"], correct: 2, why: "Is it right… = ý kiến ⇒ lập trường có mức + giới hạn." },
        ],
      },
      { t: "h", text: "VI. Từ vựng của ngày (6 câu) — ôn Bài 2 và Bài 3 mục từ vựng" },
      {
        t: "quiz",
        id: "t5d27-bt-tu-vung",
        kind: "fill",
        title: "VI. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "1. The answer to the problem remained e___ for decades.", answers: ["elusive"], hint: "khó tìm ra — Bài 2." },
          { q: "2. The police seized a shipment of i___ drugs at the port.", answers: ["illicit"], hint: "trái phép — Bài 2 (⚠️ khác elicit)." },
          { q: "3. Low-income families tend to bear the b___ of rising food prices.", answers: ["brunt"], hint: "bear the brunt of — Bài 3." },
          { q: "4. Critics dismissed the sugar tax as yet another example of the n___ state.", answers: ["nanny"], hint: "nanny state — Bài 3." },
          { q: "5. Leaving home for university is often seen as a r___ of passage.", answers: ["rite"], hint: "a rite of passage — Bài 3." },
          { q: "6. The city had the f___ to reserve land for parks before it was built over.", answers: ["foresight"], hint: "have the foresight to V — Bài 2." },
        ],
      },
      { t: "h", text: "VII. Viết lại một đoạn không lỗi (100–140 từ) — AI chấm — ôn Bài 1 mục 10" },
      {
        t: "p",
        text: "Đoạn dưới có **7 lỗi** (mỗi lỗi một cụm). Viết lại cả đoạn vào ô, sửa đủ 7 lỗi, giữ nguyên ý. Dòng cuối, liệt kê 7 mã G bạn đã sửa. ==“Many young people now spend the majority of their income for rent, which mean they cannot save. Having paid their rent, there is little money left for anything else. The governments in many countries has tried to solve this problem, however, most of the policies failed. If the authorities would build more social housing in the past, rents will be lower today. It is important that each city sets a limit on how fast rents can rise.”==",
      },
      {
        t: "essay",
        id: "t5d27-bt-viet-lai",
        task: "Task 2",
        prompt: "Rewrite the paragraph above (100–140 words) so that it contains no grammatical errors. Keep the original ideas, but you may add one sentence of explanation or example. On the last line, list the seven grammar codes (G…) of the errors you corrected.",
        minWords: 100,
        tips: [
          "Bảy lỗi: giới từ sau spend (G11) · which mean (G43) · treo chủ ngữ Having paid (G35) · The governments… has (G43 / G10) · comma splice however (G32) · If… would build… will be (G38) · each city sets (G42).",
          "Soát theo thứ tự 4 phút: động từ chính → danh từ → đầu câu & chỗ nối → câu giả định / đề xuất.",
        ],
      },
      {
        t: "note",
        title: "📌 Một đoạn mẫu để so SAU khi đã viết (band 8, ước tính) — 102 từ",
        items: [
          "Many young people now spend the majority of their income on rent, which means that they are unable to save. Once they have paid their rent, there is little money left for anything else, let alone a deposit for a home of their own. Governments in many countries have tried to tackle this problem; however, most of their policies have failed. Had the authorities built more social housing in the past, rents would almost certainly be lower today. It is therefore essential that every city set a limit on how fast rents can rise, at least until supply catches up with demand. (G11 · G43 · G35 · G10 / G43 · G32 · G38 · G42)",
        ],
      },
      { t: "h", text: "VIII. Nói 3 câu Part 3 — ghi âm, AI chấm — ôn Bài 3" },
      { t: "p", text: "Ba câu, ba chức năng khác nhau. Trước mỗi câu, nói thầm nhãn chức năng; mở bằng đúng khung của nhãn đó." },
      { t: "speak", id: "t5d27-bt-noi-p3", part: "3", questions: ["Why do you think so many old buildings are demolished rather than repaired?", "Should governments decide which buildings are protected, or should local people decide?", "What would happen if no new buildings were allowed in city centres for ten years?"] },
    ],
  },
];
