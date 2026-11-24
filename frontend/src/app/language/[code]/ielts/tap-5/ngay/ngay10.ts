/**
 * IELTS Tập 5 — Ngày 10 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, hội thoại, câu bài tập VIẾT MỚI)
 * NGÀY MỔ ĐỀ 9 (nửa sau: Writing + Speaking; Reading + Listening đã mổ ở Ngày 9).
 *   Bài 1 (vocab)     Academic Phrasebank nâng cao — 5 việc bài band 8 phải làm mà khung của Tập 4 chưa có: giới hạn phạm vi ·
 *                     chỉ ra điểm yếu của một lập luận · gọi tên “bản lề” của tranh cãi và phân biệt khái niệm · nhân quả chính
 *                     xác · cân và xếp hạng; + liên kết lặng; + bản NÓI của từng khung                             [VD9]
 *                     — nối Tập 4 Ngày 6 (12 khung nhập môn) · Ngày 21 (8 chức năng) · Tập 5 Ngày 2 (collocation tinh)
 *   Bài 2 (writing)   Mổ Writing Đề 9 (Task 1 map · Task 2 problem–solution: tự chấm, 4 lỗi cố ý trong bài mẫu, luyện câu mới
 *                     cùng loại lỗi) → Discussion band 8: thuật ở dạng mạnh nhất · tìm bản lề · lập trường tinh; mẫu band 7 và
 *                     band 8 cùng đề (thành công nghề nghiệp: nỗ lực hay may mắn + hoàn cảnh gia đình)              [W04]
 *                     — nối Tập 4 Ngày 10 (Discussion band 7: thesis có điều kiện + 5 phép đánh giá) · Ngày 22 (đánh giá giải
 *                       pháp) · Tập 5 Ngày 2 (band 7 vs 8) · Ngày 4 (lập luận sâu) · Ngày 9 (song song, less X than Y)
 *   Bài 3 (speaking)  Mổ Speaking Đề 9 theo 4 tiêu chí: Part 1 câu hỏi “vì sao / xu hướng” · Part 2 thẻ tình huống trừu tượng
 *                     (cơ chế thuyết phục) · Part 3 năm kiểu câu hỏi; luyện lại bằng câu hỏi và thẻ MỚI                  [S06 S17]
 *                     — nối Tập 4 Ngày 26 (khung NEO → NỀN → CẢNH → CÂN) · Tập 5 Ngày 2 · 3 · 6 · 7
 *                     🔊 do / does / did nhấn mạnh + hạ giọng ở câu trích
 *   Bài tập Ngày 10   43 câu có đáp án + 1 thân bài + 1 bài nói
 * Mọi id bắt đầu `t5d10-`. KHÔNG chép lại đề: chỉ trích ngắn chỗ cần mổ. Đề Discussion (hard work vs luck and family background),
 * thẻ Part 2 mới (a time you disagreed with a decision made by a group) và Part 1 mới (Handwriting, Neighbours) chưa dùng ở Tập 3–5
 * và Đề 0–12 (đã grep 24/11). Thẻ “persuaded someone to look at a decision differently” của Đề 9 (đổi 24/11 — thẻ “changed your mind” cũ trùng Tập 4 Ngày 30) chỉ được PHÂN TÍCH, không ra lại làm bài luyện. Mọi nhân vật hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_10: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d10-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Academic Phrasebank nâng cao — giới hạn phạm vi, phê bình một lập luận, gọi tên bản lề, nhân quả chính xác, cân và xếp hạng",
    goal: "Dùng đúng khoảng 45 khung câu học thuật cho năm việc mà bài Task 2 band 8 phải làm (giới hạn phạm vi một nhận định, chỉ ra điểm yếu của một lập luận, gọi tên điều hai bên thật sự bất đồng, nói quan hệ nhân quả đúng mức, cân và xếp hạng), nối đoạn không cần từ nối đầu câu, và đổi được mỗi khung sang bản nói cho Part 3.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        items: [
          "**Academic Phrasebank** = kho khung câu xếp theo ==việc câu đó làm==. Tập 4 đã cho bạn 12 khung nhập môn (Ngày 6) và 8 chức năng của một bài Task 2 (Ngày 21): bối cảnh, ý kiến chung, lập trường, nguyên nhân, ví dụ, nhượng bộ, hệ quả, kết luận.",
          "Ngày 7 thêm 12 cụm cho Task 1 process. Chừng đó đủ cho band 7. Band 8 đòi thêm ==năm việc== mà hôm qua bạn đã thấy trong Passage 3 và trong hai bài mẫu Writing của Đề 9: giới hạn phạm vi · phê bình một lập luận · gọi tên bản lề của tranh cãi · nhân quả chính xác · cân và xếp hạng.",
          "Mỗi việc học 7–9 khung. Khung là ==vỏ==: sau “This argument overlooks…” phải là một điều thật sự bị bỏ sót.",
          "Mục 7 dạy **liên kết lặng**: nối câu bằng khung thay cho Firstly / Moreover. Mục 8 cho **bản nói** của từng khung — dùng ở Bài 3 khi mổ Part 3.",
          "Cuối bài: soi lại bài mẫu Task 2 của Đề 9 xem nó dùng những khung nào.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Kiểm tra đầu bài — 8 chức năng của Tập 4 Ngày 21 (6 câu)" },
      {
        t: "quiz",
        id: "t5d10-on-dau-bai",
        kind: "fill",
        title: "Điền MỘT từ để hoàn chỉnh khung đã học (6 câu)",
        items: [
          { q: "Recent decades have ___ a sharp rise in the number of people working from home.", answers: ["seen", "witnessed"], hint: "Nêu bối cảnh: Recent decades have seen + N." },
          { q: "It is widely ___ that competition improves the quality of public services.", answers: ["believed", "assumed", "thought", "held", "accepted"], hint: "Dẫn ý kiến chung: bị động vô nhân xưng." },
          { q: "The fall in birth rates can largely be attributed ___ the rising cost of housing.", answers: ["to"], hint: "be attributed to + nguyên nhân." },
          { q: "South Korea is a case in ___: its spending on private tuition is among the highest in the world.", answers: ["point"], hint: "a case in point = ví dụ điển hình." },
          { q: "___, online courses are cheaper. Nevertheless, most students fail to finish them.", answers: ["Admittedly", "Granted"], hint: "Nhượng bộ rồi bác." },
          { q: "On ___, the benefits of the scheme appear to outweigh its costs.", answers: ["balance"], hint: "Kết luận có rào đón." },
        ],
      },
      {
        t: "note",
        title: "📌 Đọc điểm",
        items: [
          "**5–6/6**: nền Tập 4 vững, học tiếp.",
          "**≤ 4/6**: mở Tập 4 Ngày 21 mục 7, đọc lại bảng 8 chức năng (5 phút) rồi quay lại đây.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Việc ① — Giới hạn phạm vi: nhận định này đúng tới đâu" },
      {
        t: "p",
        text: "Ngày 1 dạy hedging bằng động từ khuyết thiếu và trạng từ (may, tends to, arguably). Đó là rào đón về ==độ chắc==. Giới hạn phạm vi là việc khác: bạn nói chắc, nhưng nói rõ ==ở đâu, với ai, trong bao lâu== thì nhận định đúng. Giám khảo band 8 tìm đúng điều này — mô tả band 8 viết: tránh khái quát quá mức.",
      },
      {
        t: "vocab",
        items: [
          { w: "to a large extent", pos: "phr", ipa: "/ɪkˈstent/", vi: "ở mức độ lớn, phần lớn", ex: "Success at school depends to a large extent on what happens at home.", exVi: "Thành công ở trường phụ thuộc phần lớn vào những gì diễn ra ở nhà.", more: "to some / a certain / a limited extent · to the extent that + mệnh đề (chừng nào mà)" },
          { w: "at least in the short term", pos: "phr", ipa: "/ʃɔːt tɜːm/", vi: "ít nhất là trong ngắn hạn", ex: "A higher minimum wage raises costs, at least in the short term.", exVi: "Lương tối thiểu cao hơn làm tăng chi phí, ít nhất là trong ngắn hạn.", more: "in the long run · over time · for the time being" },
          { w: "where … is concerned", pos: "phr", ipa: "/kənˈsɜːnd/", vi: "khi nói về…, trong chuyện…", ex: "Where safety is concerned, cost should not be the deciding factor.", exVi: "Khi nói về an toàn, chi phí không nên là yếu tố quyết định.", more: "as far as … is concerned · gọn hơn: when it comes to + N (nói)" },
          { w: "with the possible exception of", pos: "phr", ipa: "/ɪkˈsepʃn/", vi: "có lẽ chỉ trừ", ex: "Every sector, with the possible exception of tourism, has benefited.", exVi: "Mọi ngành, có lẽ chỉ trừ du lịch, đều được lợi.", more: "with few exceptions · a notable exception is…" },
          { w: "this is particularly true of", pos: "phr", ipa: "/pəˈtɪkjələli/", vi: "điều này đặc biệt đúng với", ex: "Commuting is exhausting. This is particularly true of those who travel at peak hours.", exVi: "Đi làm xa rất mệt. Điều này đặc biệt đúng với người đi vào giờ cao điểm.", more: "The same cannot be said of + N (mục 7) — cặp đối của khung này" },
          { w: "hold (true) for", pos: "v phr", ipa: "/həʊld/", vi: "đúng với, áp dụng được cho", ex: "What holds for large firms does not necessarily hold for small ones.", exVi: "Điều đúng với công ty lớn chưa chắc đúng với công ty nhỏ.", more: "hold good · apply to · be the case — KHÔNG nói ~~be right with~~" },
          { w: "provided that", pos: "conj", ipa: "/prəˈvaɪdɪd/", vi: "với điều kiện là", ex: "The scheme could work, provided that employers share the cost.", exVi: "Chương trình có thể hiệu quả, với điều kiện chủ lao động cùng chịu chi phí.", more: "on condition that · so long as · only if + đảo ngữ khi đứng đầu câu (Only if… will…)" },
          { w: "in practice", pos: "phr", ipa: "/ˈpræktɪs/", vi: "trên thực tế (đối lập với lý thuyết / quy định)", ex: "In theory, the course is open to all; in practice, few can afford it.", exVi: "Về lý thuyết, khoá học mở cho mọi người; trên thực tế, ít ai đủ tiền học.", more: "in theory… in practice… / in principle… in practice… — cặp song song nối bằng chấm phẩy (Ngày 9)" },
        ],
      },
      {
        t: "table",
        head: ["Khái quát quá mức (band 7)", "Có phạm vi (band 8)", "Khung"],
        rows: [
          ["Technology makes people lonely.", "Technology can isolate people, **particularly those who** already have few contacts offline.", "this is particularly true of"],
          ["Tourism is good for the economy.", "Tourism benefits the economy **to the extent that** the money stays in local hands.", "to the extent that"],
          ["Online learning is as good as classroom learning.", "**Where** factual knowledge **is concerned**, online learning is as effective; the same cannot be said of practical skills.", "where… is concerned"],
          ["Higher fines will stop speeding.", "Higher fines are likely to reduce speeding, **at least in the short term**.", "at least in the short term"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi giới hạn phạm vi",
        items: [
          "Dùng **in some cases / in some aspects** cho mọi thứ rồi không nói trường hợp nào. Giới hạn phạm vi phải ==gọi tên== phạm vi: ai, ở đâu, khi nào.",
          "~~In some extent~~ → **to** some extent. ~~In the long term run~~ → in the long **term** / in the long **run**.",
          "~~As far as I'm concerned~~ để mở bài Task 2 — cụm này là văn nói và nghĩa là “theo tôi”, không phải “khi nói về”. Trong bài viết dùng In my view.",
          "Giới hạn hai lần trong một câu: ~~To some extent, this is partly true in certain cases.~~ Một nhận định — một giới hạn (như liều lượng hedging ở Ngày 1).",
        ],
      },
      { t: "rule", formula: "nhận định  +  [với ai · ở đâu · trong bao lâu · với điều kiện gì]   —   một nhận định, một giới hạn, gọi tên cụ thể", vi: "Khác hedging: không giảm độ chắc, chỉ khoanh vùng nơi nhận định đúng." },
      {
        t: "quiz",
        id: "t5d10-pham-vi",
        kind: "fill",
        title: "Điền MỘT từ (6 câu)",
        items: [
          { q: "The policy has succeeded ___ a large extent, though rural areas have gained little.", answers: ["to"], hint: "to a large extent." },
          { q: "Where exam results are ___, private schools still have a clear lead.", answers: ["concerned"], hint: "where… is / are concerned." },
          { q: "All age groups, with the possible ___ of the over-75s, now shop online.", answers: ["exception"], hint: "with the possible exception of." },
          { q: "What holds ___ adults does not always apply to children.", answers: ["for", "true for"], hint: "hold (true) for." },
          { q: "In theory, the lanes are reserved for buses; in ___, cars use them all day.", answers: ["practice"], hint: "in theory… in practice…" },
          { q: "Remote work suits most staff. This is particularly ___ of those with long commutes.", answers: ["true"], hint: "This is particularly true of + N." },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Việc ② — Phê bình một lập luận: nó yếu ở đâu" },
      {
        t: "p",
        text: "Tập 4 Ngày 10 cho bạn năm phép đánh giá và vài khung (This reasoning holds for…, This argument rests on the assumption that…). Passage 3 của Đề 9 cho thấy người viết giỏi có nhiều cách hơn để nói ==một lập luận sai ở chỗ nào== mà không cần chữ wrong. Học tám động từ dưới đây là học tám kiểu điểm yếu.",
      },
      {
        t: "vocab",
        items: [
          { w: "overlook", pos: "v", ipa: "/ˌəʊvəˈlʊk/", vi: "bỏ sót (một yếu tố)", ex: "This argument overlooks the cost of training new staff.", exVi: "Lập luận này bỏ sót chi phí đào tạo nhân viên mới.", more: "overlook the fact that… · đồng nghĩa: fail to take account of / take no account of · ↺ Ôn lại — đã học ở Tập 3 Ngày 5 · Tập 4 Ngày 6" },
          { w: "overstate", pos: "v", ipa: "/ˌəʊvəˈsteɪt/", vi: "nói quá, thổi phồng", ex: "Supporters of the ban overstate the danger.", exVi: "Người ủng hộ lệnh cấm nói quá mối nguy.", more: "trái nghĩa: understate · It would be an overstatement to say that… · danh từ: an exaggeration" },
          { w: "take … for granted", pos: "idiom", ipa: "/ˈɡrɑːntɪd/", vi: "mặc nhiên coi là đúng", ex: "The proposal takes it for granted that parents have time to help.", exVi: "Đề xuất này mặc nhiên cho rằng cha mẹ có thời gian giúp.", more: "= assume without question · Đề 9: “a framework that they take for granted”" },
          { w: "conflate", pos: "v", ipa: "/kənˈfleɪt/", vi: "đánh đồng (hai thứ khác nhau)", ex: "Critics conflate being busy with being productive.", exVi: "Những người phê bình đánh đồng bận rộn với năng suất.", more: "conflate A with B · gần nghĩa: confuse A with B / fail to distinguish between A and B" },
          { w: "it does not follow that", pos: "phr", ipa: "/ˈfɒləʊ/", vi: "không có nghĩa là, không suy ra được rằng", ex: "Even if screens harm sleep, it does not follow that they should be banned.", exVi: "Dù màn hình có hại cho giấc ngủ, điều đó không có nghĩa là nên cấm chúng.", more: "Đề 9: “That no sharp boundary exists does not mean that there is no difference.”" },
          { w: "be open to the objection that", pos: "phr", ipa: "/əbˈdʒekʃn/", vi: "có thể bị phản bác rằng", ex: "The plan is open to the objection that it rewards those who are already wealthy.", exVi: "Kế hoạch có thể bị phản bác rằng nó thưởng cho người vốn đã giàu.", more: "raise an objection · the obvious objection is that…" },
          { w: "at best … at worst …", pos: "phr", ipa: "/best wɜːst/", vi: "khá lắm thì… tệ nhất thì…", ex: "Such tests are at best a rough guide and at worst misleading.", exVi: "Những bài kiểm tra như vậy khá lắm là một chỉ dẫn sơ lược, tệ nhất thì gây hiểu lầm.", more: "hai vế phải song song (Ngày 9): at best + adj / N, at worst + adj / N" },
          { w: "cut both ways", pos: "idiom", ipa: "/kʌt bəʊθ weɪz/", vi: "có hai mặt, dùng được cho cả hai phía", ex: "The argument about choice cuts both ways: more options also mean more confusion.", exVi: "Lập luận về quyền lựa chọn có hai mặt: nhiều lựa chọn hơn cũng là rối hơn.", more: "văn viết trung tính — dùng được trong Task 2 và Part 3 · ↺ Ôn lại — đã học ở Tập 4 Ngày 18" },
        ],
      },
      {
        t: "table",
        head: ["Điểm yếu", "Câu hỏi tự đặt", "Khung"],
        rows: [
          ["Bỏ sót một yếu tố", "Còn ai / chi phí gì chưa được tính?", "This view **overlooks / takes no account of** + N."],
          ["Nói quá", "Mức độ có thật lớn như vậy không?", "The risk is real, but it is easily **overstated**."],
          ["Giả định ngầm", "Lập luận coi điều gì là hiển nhiên?", "This **takes it for granted that** + mệnh đề."],
          ["Đánh đồng hai thứ", "Hai khái niệm này có là một không?", "The argument **conflates** A **with** B."],
          ["Kết luận không suy ra từ tiền đề", "Tiền đề đúng thì kết luận có buộc phải đúng?", "Even if this is so, **it does not follow that** + mệnh đề."],
          ["Dao hai lưỡi", "Lý lẽ này có chống lại chính người dùng nó không?", "This argument **cuts both ways**: …"],
        ],
        caption: "Sáu kiểu điểm yếu — mỗi thân bài Discussion dùng MỘT (Bài 2 mục 4)",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: phê bình lập luận, không phê bình người",
        items: [
          "~~People who think so are wrong / are short-sighted.~~ → **This view** overlooks… Chủ ngữ là quan điểm, không phải con người.",
          "Đừng dùng **beg the question** với nghĩa “đặt ra câu hỏi”. Trong văn học thuật nó nghĩa là “lập luận vòng quanh”. Muốn nói “đặt ra câu hỏi” ⇒ **raise the question of** + N.",
          "**conflate** và **it does not follow that** là từ ít gặp có giá trị band 8 — nhưng mỗi bài một lần, và chỉ khi lập luận kia thật sự mắc lỗi đó.",
        ],
      },
      { t: "rule", formula: "This view / argument  +  overlooks N  ·  overstates N  ·  takes it for granted that …  ·  conflates A with B   |   Even if …, it does not follow that …", vi: "Gọi đúng tên điểm yếu = phép đánh giá của Tập 4 Ngày 10, nói bằng một động từ chính xác." },
      {
        t: "quiz",
        id: "t5d10-phe-binh",
        kind: "fill",
        title: "Điền MỘT từ — chữ cái đầu cho sẵn (6 câu)",
        items: [
          { q: "Those who call for more roads o___ the fact that new roads attract new traffic.", answers: ["overlook"], hint: "bỏ sót." },
          { q: "The benefits of homework are real but frequently o___ by its supporters.", answers: ["overstated"], hint: "nói quá — bị động." },
          { q: "The proposal takes it for g___ that every household has a reliable internet connection.", answers: ["granted"], hint: "mặc nhiên coi là đúng." },
          { q: "The report c___ correlation with cause.", answers: ["conflates"], hint: "đánh đồng A with B." },
          { q: "Even if robots can do the work, it does not f___ that they should.", answers: ["follow"], hint: "không suy ra được." },
          { q: "Homeschooling is at b___ an uneven substitute for school and at worst a form of isolation.", answers: ["best"], hint: "at best… at worst…" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Việc ③ — Gọi tên “bản lề” của tranh cãi và phân biệt khái niệm" },
      {
        t: "p",
        text: "Passage 2 của Đề 9 kết bằng một nhận xét: hai phía không bất đồng về dữ kiện; họ bất đồng về ==phạm vi của một từ==. Tiêu đề đúng của đoạn ấy là “A dispute that turns on a definition”. Đây chính là động tác đưa bài Discussion từ 7 lên 8: không chỉ thuật hai bên và chọn một, mà chỉ ra ==hai bên thật sự khác nhau ở điểm nào== — gọi là bản lề.",
      },
      {
        t: "vocab",
        items: [
          { w: "turn on", pos: "phr v", ipa: "/tɜːn ɒn/", vi: "xoay quanh, phụ thuộc vào (một điểm)", ex: "The debate turns on what we mean by a good education.", exVi: "Cuộc tranh luận xoay quanh việc ta hiểu thế nào là một nền giáo dục tốt.", more: "= hinge on / depend on · KHÔNG phải “bật lên” · turn less on A than on B (Ngày 9: less X than Y)" },
          { w: "what is at issue", pos: "phr", ipa: "/ˈɪʃuː/", vi: "điều đang được tranh cãi", ex: "What is at issue is not whether to tax sugar but how heavily.", exVi: "Điều đang tranh cãi không phải có đánh thuế đường hay không mà là đánh nặng đến đâu.", more: "the point at issue · câu chẻ What… is… + cặp not… but… (Ngày 9)" },
          { w: "much depends on what is meant by", pos: "phr", ipa: "/ment/", vi: "phần lớn tuỳ vào việc hiểu … là gì", ex: "Much depends on what is meant by success.", exVi: "Phần lớn tuỳ vào việc hiểu thành công là gì.", more: "It depends (on) how we define N · depending on how N is measured" },
          { w: "distinguish between A and B", pos: "v phr", ipa: "/dɪˈstɪŋɡwɪʃ/", vi: "phân biệt A với B", ex: "We need to distinguish between reading for pleasure and reading for exams.", exVi: "Cần phân biệt đọc để giải trí với đọc để thi.", more: "draw a distinction between · A should not be confused with B · KHÔNG: ~~distinguish A with B~~" },
          { w: "as opposed to", pos: "prep phr", ipa: "/əˈpəʊzd/", vi: "chứ không phải, đối lập với", ex: "The survey measured what people said, as opposed to what they did.", exVi: "Cuộc khảo sát đo điều người ta nói, chứ không phải điều họ làm.", more: "= rather than · hai vế song song" },
          { w: "in the narrow sense", pos: "phr", ipa: "/ˈnærəʊ sens/", vi: "theo nghĩa hẹp", ex: "In the narrow sense, literacy means being able to read; in the broad sense, it means being able to judge what one reads.", exVi: "Theo nghĩa hẹp, biết chữ là đọc được; theo nghĩa rộng, là biết đánh giá điều mình đọc.", more: "in the broad / strict / everyday sense of the word" },
          { w: "by … I mean", pos: "phr", ipa: "/miːn/", vi: "khi nói … tôi muốn nói", ex: "By success, I mean a secure job that a person finds worthwhile.", exVi: "Khi nói thành công, tôi muốn nói một công việc ổn định mà người ta thấy đáng làm.", more: "định nghĩa làm việc — đặt ở mở bài hoặc đầu thân 1, một câu là đủ" },
          { w: "be answering different questions", pos: "phr", ipa: "/ˈkwestʃənz/", vi: "(hai bên) đang trả lời hai câu hỏi khác nhau", ex: "The two sides are, in effect, answering different questions.", exVi: "Trên thực tế, hai bên đang trả lời hai câu hỏi khác nhau.", more: "talk past each other (nói) · be less opposed than they appear (Tập 4 Ngày 10)" },
        ],
      },
      {
        t: "table",
        head: ["Bản lề thường gặp", "Dấu hiệu trong đề", "Câu gọi tên"],
        rows: [
          ["**Định nghĩa**", "success, a good education, art, progress", "Much depends on what is meant by…"],
          ["**Thước đo**", "better, more effective, the best way", "The answer differs according to whether we measure X by A or by B."],
          ["**Ai**", "children, society, individuals, the government", "What benefits the individual does not always benefit society as a whole."],
          ["**Khi nào**", "should, in the future", "The two views differ less in substance than in time-scale: one looks at the next five years, the other at the next fifty."],
          ["**Mặc định**", "should be free / compulsory / banned", "The real question is where the burden of proof should lie."],
        ],
        caption: "Năm loại bản lề — Bài 2 mục 4 dùng lại bảng này",
      },
      { t: "rule", formula: "The disagreement turns (less on A than) on B   ·   What is at issue is not A but B   ·   Much depends on what is meant by N", vi: "Một câu gọi tên bản lề, đặt ở mở bài hoặc đầu đoạn lập trường — một lần cả bài." },
      {
        t: "quiz",
        id: "t5d10-ban-le",
        kind: "fill",
        title: "Điền MỘT từ (6 câu)",
        items: [
          { q: "The dispute turns ___ a single question: who should pay?", answers: ["on"], hint: "turn on = xoay quanh." },
          { q: "What is at ___ is not the aim of the policy but its cost.", answers: ["issue"], hint: "what is at issue." },
          { q: "We should distinguish ___ a lack of ability and a lack of opportunity.", answers: ["between"], hint: "distinguish between A and B." },
          { q: "The study measured attendance, as ___ to learning.", answers: ["opposed"], hint: "as opposed to." },
          { q: "Much depends on what is ___ by a healthy diet.", answers: ["meant"], hint: "what is meant by." },
          { q: "In the ___ sense of the word, a refugee is someone fleeing persecution; in everyday use, the term is much broader.", answers: ["narrow", "strict"], hint: "in the narrow / strict sense." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Việc ④ — Nhân quả chính xác: gây ra, góp phần, hay chỉ đi kèm?" },
      {
        t: "p",
        text: "Band 7 dùng cause / lead to / result in cho mọi quan hệ. Band 8 phân biệt ==mức độ==: nguyên nhân duy nhất, một trong nhiều yếu tố, làm nặng thêm cái đã có, hay hệ quả gián tiếp. Chọn sai mức là khái quát quá tay — đúng lỗi mà đề Task 2 của Đề 9 dễ kéo bạn vào (“the shortage causes all the problems of the economy”).",
      },
      {
        t: "table",
        head: ["Mức", "Khung", "Ví dụ"],
        rows: [
          ["nguyên nhân chính", "**stem from** · **be rooted in** · **be largely attributable to**", "The shortage stems from a loss of prestige rather than a lack of jobs."],
          ["một trong nhiều yếu tố", "**contribute to** · **play a part in** · **be a factor in**", "Long commutes contribute to, but do not fully explain, low birth rates."],
          ["làm nặng thêm cái đã có", "**exacerbate** · **compound** · **reinforce**", "Rising rents have exacerbated an existing shortage of teachers in the capital."],
          ["làm nhẹ đi", "**alleviate** · **ease** · **mitigate**", "Paid apprenticeships would ease the shortage within a few years."],
          ["hệ quả gián tiếp, dây chuyền", "**have a knock-on effect on** · **in turn**", "Delays in housebuilding have a knock-on effect on rents."],
          ["hệ quả ngoài ý muốn", "**a by-product of** · **an unintended consequence of**", "Grade inflation is an unintended consequence of ranking schools by results."],
          ["nền tảng đứng sau", "**underlie** · **lie behind**", "The attitudes that underlie these choices change slowly."],
          ["chỉ đi kèm, chưa chắc là nguyên nhân", "**be associated with** · **go hand in hand with** · **be bound up with**", "Wealth is associated with longer life, though the link is not a simple one."],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "stem from", pos: "phr v", ipa: "/stem frəm/", vi: "bắt nguồn từ", ex: "Most of these errors stem from haste.", exVi: "Phần lớn các lỗi này bắt nguồn từ sự vội vàng.", more: "KHÔNG dùng bị động (~~is stemmed from~~) · không dùng tiếp diễn · ↺ Ôn lại — đã học ở Tập 3 Ngày 18" },
          { w: "compound", pos: "v", ipa: "/kəmˈpaʊnd/", vi: "làm (khó khăn) chồng thêm", ex: "The shortage of housing is compounded by a lack of public transport.", exVi: "Tình trạng thiếu nhà ở càng thêm nặng vì thiếu giao thông công cộng.", more: "thường ở bị động: be compounded by · cùng mức với exacerbate (đã học ở Ngày 4) — tân ngữ phải là thứ XẤU đã tồn tại · động từ nhấn âm hai, danh từ compound nhấn âm đầu · ↺ Ôn lại — đã học ở Tập 3 Ngày 14" },
          { w: "mitigate", pos: "v", ipa: "/ˈmɪtɪɡeɪt/", vi: "giảm nhẹ (tác hại, rủi ro)", ex: "Planting trees along the river would mitigate the risk of flooding.", exVi: "Trồng cây dọc sông sẽ giảm nhẹ nguy cơ lũ.", more: "mitigate the effects / risk / damage — giảm, KHÔNG phải giải quyết hẳn (solve) · cùng mức với alleviate (đã học ở Ngày 6): alleviate poverty / pressure, mitigate risk / damage · ↺ Ôn lại — đã học ở Tập 4 Ngày 2" },
          { w: "a knock-on effect", pos: "n phr", ipa: "/ˈnɒk ɒn ɪfekt/", vi: "tác động dây chuyền", ex: "A strike at the port has a knock-on effect on every factory inland.", exVi: "Một cuộc đình công ở cảng có tác động dây chuyền tới mọi nhà máy trong đất liền.", more: "have a knock-on effect ON · Anh–Anh; Mỹ: a ripple effect" },
          { w: "underlie", pos: "v", ipa: "/ˌʌndəˈlaɪ/", vi: "là nền tảng, nằm đằng sau", ex: "The assumptions that underlie the model are rarely questioned.", exVi: "Các giả định nằm sau mô hình hiếm khi bị đặt câu hỏi.", more: "underlie – underlay – underlain · tính từ: the underlying cause · ↺ Ôn lại — đã học ở Tập 3 Ngày 20" },
          { w: "be bound up with", pos: "phr", ipa: "/baʊnd ʌp/", vi: "gắn chặt với", ex: "A person's sense of worth is often bound up with their work.", exVi: "Cảm giác về giá trị bản thân thường gắn chặt với công việc.", more: "= be closely linked to — nói quan hệ hai chiều, không nói cái nào gây ra cái nào" },
          { w: "an unintended consequence", pos: "n phr", ipa: "/ˌʌnɪnˈtendɪd/", vi: "hệ quả ngoài ý muốn", ex: "Longer queues were an unintended consequence of the new security checks.", exVi: "Hàng chờ dài hơn là hệ quả ngoài ý muốn của các bước kiểm tra an ninh mới.", more: "a by-product of (Đề 9, Passage 1) · a side effect of" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với động từ nhân quả",
        items: [
          "~~contribute to reduce~~ → contribute to **reducing** / to **a reduction in** (to là giới từ).",
          "~~The problem is caused due to…~~ (thừa) → is caused **by** / is **due to**.",
          "~~exacerbate the economy / exacerbate the situation better~~ — exacerbate chỉ đi với thứ xấu, và nghĩa là làm xấu THÊM.",
          "~~result from~~ lẫn với **result in**: A results **in** B (A gây ra B); B results **from** A.",
          "Dùng **lead to** cho quan hệ chỉ là đi kèm: ~~Owning books leads to better grades.~~ → Owning books **is associated with** better grades.",
        ],
      },
      { t: "rule", formula: "nguyên nhân chính: stem from  ·  một yếu tố: contribute to + V-ing / N  ·  làm nặng: exacerbate  ·  làm nhẹ: alleviate  ·  chỉ đi kèm: be associated with", vi: "Chọn động từ theo MỨC của quan hệ; bằng chứng tới đâu, động từ mạnh tới đó." },
      {
        t: "quiz",
        id: "t5d10-nhan-qua",
        kind: "fill",
        title: "Chọn và gõ đúng dạng: stem · contribute · exacerbate · alleviate · associate · underlie (6 câu)",
        items: [
          { q: "Much of the opposition ___ from a misunderstanding of the plan.", answers: ["stems", "stemmed"], hint: "bắt nguồn từ — chủ động." },
          { q: "Poor street lighting ___ to, but is not the main cause of, the rise in accidents.", answers: ["contributes", "has contributed", "contributed"], hint: "một trong nhiều yếu tố." },
          { q: "Building more offices in the centre will only ___ the housing shortage.", answers: ["exacerbate"], hint: "làm nặng thêm thứ xấu đã có." },
          { q: "Free school meals would ___ some of the pressure on low-income families.", answers: ["alleviate"], hint: "làm dịu." },
          { q: "Regular exercise is ___ with better sleep, although the direction of the link is unclear.", answers: ["associated"], hint: "chỉ đi kèm." },
          { q: "The values that ___ a school's rules are rarely explained to pupils.", answers: ["underlie"], hint: "nằm đằng sau — chủ ngữ số nhiều." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Việc ⑤ — Cân và xếp hạng: cái nào nặng hơn, nhanh hơn, bền hơn" },
      {
        t: "p",
        text: "Bài mẫu Task 2 của Đề 9 có một câu làm nên khác biệt giữa 7 và 8: nó ==xếp hạng== hai giải pháp theo hai tiêu chí (cái nào nhanh, cái nào bền). Bài Discussion band 8 cũng cần đúng một câu như thế cho hai quan điểm. Dưới đây là các khung để cân.",
      },
      {
        t: "table",
        head: ["Việc", "Khung", "Ví dụ"],
        rows: [
          ["Xếp hạng hai thứ", "**Of the two, the former / the latter** + V…", "Of the two, the latter is the more realistic."],
          ["Hai tiêu chí, hai kết quả", "A is likely to… **faster**, **although it is** B **that** would…", "Fines would work faster, although it is education that would make the change last."],
          ["Nặng ký hơn", "**carry more weight** (than) · **count for more**", "The second objection carries more weight."],
          ["Cấp bách hơn", "**the more pressing** (of the two) · **take priority over**", "Safety must take priority over speed."],
          ["Thứ yếu", "**be secondary to** · **of secondary importance**", "Cost is secondary to reliability."],
          ["Không kém", "**no less** + adj + **than**", "Working with one's hands is no less worthy than working at a desk."],
          ["Ở chừng mực… thì A; ngoài ra thì B", "**In so far as** …, A; **beyond that**, B", "In so far as the aim is speed, the first plan is better; beyond that, the second wins."],
          ["Chốt sau khi cân", "**On balance** · **All things considered** · **The balance of the argument favours**…", "The balance of the argument favours a gradual approach."],
        ],
      },
      {
        t: "note",
        title: "📌 the former / the latter — bốn điều kiện để dùng an toàn",
        items: [
          "Chỉ dùng khi vừa nêu **đúng hai** thứ, trong câu ngay trước hoặc cùng câu.",
          "**the former** = cái nêu trước; **the latter** = cái nêu sau. Lẫn hai từ này là đảo ngược lập luận.",
          "Không dùng cho ba thứ trở lên (dùng the first / the second / the last).",
          "So sánh hai thứ dùng so sánh HƠN có the: the **more** realistic of the two (không phải ~~the most~~).",
        ],
      },
      { t: "rule", formula: "Of the two, the latter + V …   ·   A works faster, although it is B that lasts   ·   A carries more weight than B   ·   A is no less adj than B", vi: "Một câu xếp hạng trong thân bài hoặc kết bài — theo một TIÊU CHÍ gọi tên được (nhanh, bền, rẻ, công bằng)." },
      {
        t: "quiz",
        id: "t5d10-can-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — cân và xếp hạng (4 câu)",
        grammar: "Of the two… · carry more weight · no less… than · take priority over",
        items: [
          { q: "Trong hai giải pháp, giải pháp sau thực tế hơn.", answers: ["Of the two solutions, the latter is the more realistic.", "Of the two solutions, the latter is more realistic.", "Of the two measures, the latter is the more realistic.", "Of the two solutions, the second is the more realistic."], hint: "Of the two solutions, the latter… the more realistic" },
          { q: "Lập luận thứ hai nặng ký hơn lập luận thứ nhất.", answers: ["The second argument carries more weight than the first.", "The second argument carries more weight than the first one.", "The latter argument carries more weight than the former."], hint: "carry more weight than" },
          { q: "Dạy nghề không kém giá trị so với học đại học.", answers: ["Vocational training is no less valuable than a university education.", "Vocational training is no less valuable than university education.", "Vocational training is no less valuable than a university degree.", "Vocational training is no less worthy than a university education."], hint: "vocational training · no less valuable than" },
          { q: "An toàn của hành khách phải được ưu tiên hơn lợi nhuận.", answers: ["Passenger safety must take priority over profit.", "The safety of passengers must take priority over profit.", "Passenger safety must take priority over profits.", "Passengers' safety must take priority over profit."], hint: "take priority over" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Soi bài mẫu Task 2 của Đề 9 — nó dùng khung nào" },
      {
        t: "table",
        head: ["Chữ trong bài mẫu (trích ngắn)", "Việc nó làm", "Mục hôm nay"],
        rows: [
          ["“with the result that fewer and fewer school leavers train as…”", "nhân quả — nối nguyên nhân với hệ quả trong một câu", "mục 4"],
          ["“The most immediate problem is felt at home.”", "xếp thứ tự vấn đề theo độ gần", "mục 5"],
          ["“Worse, the gap tends to be filled by…”", "tăng cấp — một từ thay cho Moreover", "mục 7"],
          ["“At a national level, … consequences that are harder to see but more serious”", "đổi phạm vi + cân (harder to see but more serious)", "mục 1 · 5"],
          ["“not for want of money, but because…”", "bác một nguyên nhân, nêu nguyên nhân thật", "Ngày 9 mục 3"],
          ["“Since the root of the problem is largely one of prestige, …”", "nhân quả chính xác (largely) → chọn giải pháp trúng gốc", "mục 4"],
          ["“Admittedly, attitudes change slowly, which is why…”", "nhượng bộ rồi dùng chính nó làm lý do cho bước kế", "Tập 4 Ngày 21"],
          ["“Of the two measures, the second is likely to work faster, although it is the first that…”", "xếp hạng theo hai tiêu chí", "mục 5"],
        ],
        caption: "Tám chỗ trong một bài khoảng 360 từ — không khung nào lặp lại, không khung nào dài hơn ý của nó",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Liên kết lặng — nối câu bằng khung, không bằng từ nối đầu câu" },
      {
        t: "p",
        text: "Ngày 2 dạy: band 8 dùng từ nối đầu câu 2–3 lần cả bài. Vậy nối bằng gì? Bằng câu mở ==bám vào câu trước==. Tám khung dưới đây làm việc của Moreover, However, For example mà không gây chú ý.",
      },
      {
        t: "table",
        head: ["Thay cho", "Khung lặng", "Ví dụ"],
        rows: [
          ["Moreover / In addition", "**Worse, …** · **Better still, …** · **Nor is this all.**", "Repairs become slow. Worse, they are often done by unqualified workers."],
          ["However (đổi nhóm)", "**The same cannot be said of** + N.", "Graduates in engineering find work quickly. The same cannot be said of those in the arts."],
          ["Similarly", "**Much the same applies to** + N. · **The same is true of** + N.", "Small shops have lost customers. Much the same applies to local banks."],
          ["However (giới hạn ý vừa nêu)", "**This is not to say that** + mệnh đề.", "Exams cause stress. This is not to say that they should be abolished."],
          ["For example", "**Consider** + N. · **Take** + N.", "Consider a family with a leaking roof."],
          ["Therefore", "**It follows that** + mệnh đề. · **Hence** + N.", "Attitudes change slowly. It follows that no single campaign will be enough."],
          ["On the other hand (chuyển sang bên kia)", "**Those who** + V…, **however, are not denying this.**", "Those who stress luck, however, are not denying any of this."],
          ["In conclusion (ở giữa bài)", "**What emerges from this is** + N / that…", "What emerges from this is a simple pattern."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: mỗi đoạn một khung lặng là đủ",
        items: [
          "Bài 4 đoạn: 3–4 khung lặng + 2–3 từ nối đầu câu quen thuộc. Thay hết mọi However bằng khung lạ thì lại thành phô trương.",
          "**Consider…** và **Take…** là câu mệnh lệnh — chấp nhận được trong văn lập luận, mỗi bài một lần.",
          "**Nor is this all.** có đảo ngữ sau Nor (ôn Tập 4 Ngày 7): Nor **is** all slack useful. (bài đọc Ngày 9, đoạn F.)",
        ],
      },
      {
        t: "quiz",
        id: "t5d10-lien-ket-lang",
        kind: "fill",
        title: "Điền MỘT từ (5 câu)",
        items: [
          { q: "Buses in the capital run every five minutes. The same cannot be ___ of those in rural areas.", answers: ["said"], hint: "The same cannot be said of." },
          { q: "Homework can be tedious. This is not to ___ that it serves no purpose.", answers: ["say"], hint: "This is not to say that." },
          { q: "Local newspapers are closing. Much the same ___ to local radio stations.", answers: ["applies"], hint: "Much the same applies to." },
          { q: "The waiting list is long. ___, it is growing by the month. (tăng cấp theo hướng xấu)", answers: ["Worse"], hint: "Worse, … thay cho Moreover khi ý sau xấu hơn." },
          { q: "Skills take years to acquire. It ___ that the shortage cannot be solved quickly.", answers: ["follows"], hint: "It follows that." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bản nói của từng khung — đổi register cho Part 3" },
      {
        t: "table",
        head: ["Việc", "Viết (Task 2)", "Nói (Part 3)"],
        rows: [
          ["Giới hạn phạm vi", "This holds for A, but not necessarily for B.", "That's true of A, but I'm not sure it works for B."],
          ["Giới hạn phạm vi", "Where safety is concerned, …", "When it comes to safety, …"],
          ["Phê bình", "This view overlooks the cost.", "I think that leaves out the cost, though."],
          ["Phê bình", "The risk is easily overstated.", "I think people make too much of the risk."],
          ["Bản lề", "The debate turns on what is meant by success.", "It really comes down to what you mean by success."],
          ["Bản lề", "What is at issue is not whether but how.", "The question isn't really whether, it's how."],
          ["Nhân quả", "This stems largely from a lack of trust.", "A lot of that's down to people not trusting each other."],
          ["Nhân quả", "This would exacerbate the problem.", "That would just make things worse."],
          ["Cân", "The second argument carries more weight.", "I find the second point more convincing."],
          ["Cân", "On balance, …", "All in all, … / If I had to choose, …"],
        ],
        caption: "Cùng một ý, hai register. Bài mẫu Part 3 của Đề 9 dùng bản nói: “it does depend on…”, “The difficulty is that…”, “So perhaps the fair test is…”",
      },
      {
        t: "mcq",
        id: "t5d10-register",
        title: "Viết hay nói? Chọn câu hợp tình huống (6 câu)",
        items: [
          { q: "1. Task 2 — bạn muốn nói một lập luận bỏ sót chi phí.", options: ["That kind of leaves out the cost.", "This argument overlooks the cost of maintenance.", "They totally forget about the cost.", "People who say this are wrong about the cost."], correct: 1, why: "Văn viết: chủ ngữ là lập luận + động từ chính xác overlook." },
          { q: "2. Part 3 — giám khảo hỏi vì sao người ta ngại đổi việc.", options: ["This is largely attributable to financial insecurity.", "I'd say a lot of it's down to money worries, really.", "The phenomenon stems from insecurity.", "It is widely believed that insecurity underlies this."], correct: 1, why: "Văn nói: a lot of it's down to… Ba câu kia đúng ngữ pháp nhưng là văn viết — nói ra nghe như đọc thuộc." },
          { q: "3. Task 2 — bạn muốn gọi tên bản lề.", options: ["It all comes down to what you mean by fair.", "Much depends on what is meant by fairness.", "Fair is kind of a tricky word.", "Fairness, you know, means different things."], correct: 1, why: "Much depends on what is meant by + N — bản viết." },
          { q: "4. Part 3 — bạn muốn giới hạn phạm vi câu trả lời.", options: ["Where rural areas are concerned, the reverse obtains.", "That's true in cities, but I'm not sure it holds in the countryside.", "This holds for urban but not for rural contexts.", "With the possible exception of rural areas, this is the case."], correct: 1, why: "Bản nói tự nhiên: That's true in…, but I'm not sure…" },
          { q: "5. Task 2 — bạn muốn nối sang ý xấu hơn mà không dùng Moreover.", options: ["And another thing is,", "Worse,", "Plus,", "What's more bad,"], correct: 1, why: "Worse, … là khung lặng của mục 7." },
          { q: "6. Part 3 — bạn muốn cân hai ý rồi chọn.", options: ["On balance, the latter carries more weight.", "The balance of the argument favours the latter.", "If I had to choose, I'd go with the second one.", "Of the two, the latter is the more persuasive."], correct: 2, why: "If I had to choose, I'd go with… — bản nói. the former / the latter gần như không dùng khi nói." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Dùng ngay — năm câu Task 2 với khung hôm nay" },
      {
        t: "examples",
        items: [
          { en: "Much depends on what is meant by a successful career: a high salary and a worthwhile job are not the same thing.", vi: "Phần lớn tuỳ vào việc hiểu thế nào là sự nghiệp thành công: lương cao và công việc đáng làm không phải là một. (bản lề: định nghĩa)" },
          { en: "This view takes it for granted that everyone starts from the same place.", vi: "Quan điểm này mặc nhiên cho rằng mọi người xuất phát từ cùng một chỗ. (phê bình: giả định ngầm)" },
          { en: "Family connections contribute to early success, but they rarely sustain it.", vi: "Quan hệ gia đình góp phần vào thành công ban đầu, nhưng hiếm khi duy trì được nó. (nhân quả: một yếu tố)" },
          { en: "What holds for graduates of the same course does not necessarily hold for society as a whole.", vi: "Điều đúng với sinh viên tốt nghiệp cùng một khoá chưa chắc đúng với cả xã hội. (phạm vi)" },
          { en: "Of the two explanations, the latter accounts for more of what we actually observe.", vi: "Trong hai cách giải thích, cách sau giải thích được nhiều hơn những gì ta thực sự quan sát thấy. (xếp hạng)" },
        ],
      },
      {
        t: "quiz",
        id: "t5d10-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng khung trong gợi ý (5 câu)",
        items: [
          { q: "Lập luận này bỏ sót một thực tế là không phải ai cũng có máy tính ở nhà.", answers: ["This argument overlooks the fact that not everyone has a computer at home.", "This argument overlooks the fact that not everybody has a computer at home.", "The argument overlooks the fact that not everyone has a computer at home."], hint: "This argument overlooks the fact that…" },
          { q: "Cuộc tranh luận xoay quanh việc ai nên trả tiền.", answers: ["The debate turns on who should pay.", "The debate turns on the question of who should pay.", "The dispute turns on who should pay.", "The debate hinges on who should pay."], hint: "The debate turns on…" },
          { q: "Giá thuê nhà tăng đã làm trầm trọng thêm tình trạng thiếu giáo viên ở thủ đô.", answers: ["Rising rents have exacerbated the shortage of teachers in the capital.", "Rising rents have exacerbated the teacher shortage in the capital.", "Rising rents have exacerbated the shortage of teachers in the capital city."], hint: "rising rents · exacerbate · the shortage of teachers" },
          { q: "Thi cử gây căng thẳng. Nói vậy không có nghĩa là nên bỏ thi.", answers: ["Exams cause stress. This is not to say that they should be abolished.", "Examinations cause stress. This is not to say that they should be abolished.", "Exams cause stress. This is not to say that they should be scrapped."], hint: "This is not to say that… · abolish" },
          { q: "Khi nói về an toàn, chi phí là thứ yếu.", answers: ["Where safety is concerned, cost is secondary.", "Where safety is concerned, cost is of secondary importance.", "As far as safety is concerned, cost is secondary."], hint: "Where… is concerned · secondary" },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau bài này",
        items: [
          "Chép **năm khung** bạn chưa từng dùng (mỗi việc một khung) vào trang đầu sổ Writing. Bài 2 hôm nay yêu cầu dùng ít nhất ba.",
          "Từ trong các khối từ vựng tự vào Flashcards bộ “Từ của khoá — Tập 5”. Ôn theo câu ví dụ, không ôn từ rời.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d10-viet",
    kind: "writing",
    title: "Viết: Mổ Writing Đề 9 (map · problem–solution) rồi Discussion band 8 — đánh giá hai góc và lập trường tinh",
    goal: "Tự chấm được hai bài Writing Đề 9 của mình theo bảng band 8, tìm và sửa bốn lỗi cố ý trong bài mẫu rồi không mắc lại loại lỗi đó ở câu mới; viết được bài Discussion band 8: thuật mỗi quan điểm ở dạng mạnh nhất, gọi tên điều hai bên thật sự bất đồng, và nêu một lập trường có điều kiện rõ ràng thay cho “cả hai đều đúng”.",
    minutes: 115,
    blocks: [
      {
        t: "recap",
        items: [
          "Mở hai bài bạn viết cho **Đề 9** (Task 1 map khu cảng · Task 2 thiếu thợ lành nghề) cùng phần AI chấm. Ở Ngày 8 (Bài 2 mục 8) bạn đã đọc bảng chấm và viết lại một đoạn; phần A hôm nay đi tiếp: so từng động tác với bài mẫu và luyện đúng loại lỗi. Phần B học dạng **Discussion** ở mức band 8.",
          "Bài mẫu của đề ở mức band 8–8.5 và ==cố ý giữ 4 lỗi nhỏ== (mỗi bài 2 lỗi). Tìm ra chúng là bài tập đầu tiên. Sau đó bạn luyện đúng loại lỗi ấy bằng câu mới.",
          "**Task 1 map band 8**: overview nói được khu vực ==đổi chức năng== thế nào, không chỉ “có nhiều thay đổi”; thân bài chia theo khu; mỗi động từ thay đổi đi đúng giới từ.",
          "**Problem–solution band 8**: vấn đề là một ==chuỗi hệ quả==; giải pháp nói rõ ai làm · làm gì · vì sao có tác dụng · giới hạn; và có một câu ==xếp hạng== hai giải pháp.",
          "**Discussion band 8** thêm ba động tác vào khung band 7 (Tập 4 Ngày 10): ① thuật ở dạng mạnh nhất · ② tìm bản lề · ③ lập trường tinh.",
          "Cuối bài: viết một bài Discussion (40 phút) và viết lại bài Task 2 Đề 9 của bạn.",
        ],
      },

      /* ══════════ PHẦN A ══════════ */
      { t: "h", text: "A1. Mổ Task 1 Đề 9 (map) — tự chấm bằng 8 câu hỏi" },
      {
        t: "table",
        head: ["#", "Tiêu chí", "Câu hỏi có / không", "Nếu “không”"],
        rows: [
          ["1", "TA", "Overview của tôi có nói khu vực đổi từ loại gì sang loại gì (cảng làm việc → giải trí, du lịch) không?", "viết lại overview theo khung ở A2"],
          ["2", "TA", "Tôi có nêu cái gì ĐƯỢC GIỮ (khu nhà ở, tuyến đường) không?", "thêm nửa câu While… have been retained"],
          ["3", "TA", "Mọi công trình của cả hai bản đồ đều xuất hiện, kể cả đầu phía đông trước đây để trống?", "đếm lại: 7 khối năm 1995, 10 khối hiện nay"],
          ["4", "TA", "Tôi KHÔNG giải thích lý do (to attract tourists) và không thêm năm tháng?", "xoá — Task 1 chỉ tả"],
          ["5", "CC", "Thân bài chia theo KHU (nam đường / bắc đường), không đi từng công trình theo thứ tự nhìn thấy?", "xếp lại: mỗi đoạn một khu, đi một hướng (tây → đông)"],
          ["6", "LR", "Tôi dùng ít nhất 5 động từ thay đổi khác nhau, mỗi động từ đúng giới từ?", "học bảng ở A3"],
          ["7", "LR", "Vị trí nói bằng phương hướng (in the north-east, at the eastern end), không phải on the left / at the top?", "đổi hết sang phương hướng"],
          ["8", "GRA", "Thay đổi tới “today” ở hiện tại hoàn thành bị động; tình trạng 1995 ở quá khứ đơn?", "ôn Tập 5 Ngày 7"],
        ],
        caption: "7–8 câu “có” ≈ band 8 · 5–6 ≈ band 7 · ≤ 4: viết lại bài này trước khi học phần B",
      },

      { t: "h", text: "A2. Overview band 7 và band 8 — khác nhau một động tác" },
      {
        t: "table",
        head: ["", "Overview", "Nhận xét"],
        rows: [
          ["Band 6.5", "Overall, there were many changes in the harbour area between 1995 and today.", "đúng nhưng rỗng: không nói đổi theo hướng nào"],
          ["Band 7", "Overall, the harbour area has become much more modern, with many new facilities for visitors, while the fishing harbour and the warehouses have disappeared.", "có hướng (hiện đại hơn, cho du khách) và có cái mất; chưa gọi tên CHỨC NĂNG; modern là từ chung"],
          ["Band 8 (bài mẫu của đề)", "“…transformed from a working port, organised around fishing and storage, into one devoted largely to leisure and tourism.” + câu về cái được giữ và giao thông", "một câu gói cả bản đồ thành một chuyển đổi chức năng; câu hai nêu cái còn lại"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Overall, + khu vực + has been transformed from + N (chức năng cũ) + into + N (chức năng mới)",
            vi: "Câu 1 của overview: gọi tên chức năng cũ và mới.",
            examples: [
              { en: "Overall, the site has been transformed from an industrial estate into a largely residential district.", vi: "Nhìn chung, khu đất đã chuyển từ khu công nghiệp thành một khu chủ yếu để ở. (bản đồ khác — câu mới)" },
            ],
          },
          {
            formula: "While + N (cái được giữ) + have been retained, + phần còn lại + has been either replaced or put to a new use",
            vi: "Câu 2: cái còn lại + mức độ thay đổi. either… or… song song (Ngày 9).",
            examples: [
              { en: "While the church and the main road remain, almost all the farmland has given way to housing.", vi: "Trong khi nhà thờ và đường chính còn nguyên, gần hết đất nông nghiệp đã nhường chỗ cho nhà ở." },
            ],
          },
        ],
      },
      { t: "rule", formula: "overview map band 8  =  [chức năng cũ → chức năng mới]  +  [cái được giữ]  +  [một thay đổi xuyên suốt: giao thông / mật độ / cây xanh]", vi: "Hỏi: nếu chỉ được nói MỘT câu về hai bản đồ, tôi nói gì?" },

      { t: "h", text: "A3. Hai lỗi cố ý trong bài mẫu Task 1 — tìm, sửa, rồi luyện câu mới" },
      {
        t: "quiz",
        id: "t5d10-viet-t1-loi",
        kind: "fill",
        title: "Gõ lại phần [trong ngoặc] cho đúng (2 câu trích từ bài mẫu Task 1 của Đề 9)",
        items: [
          { q: "North of the road, [the most of] the changes have involved redevelopment.", answers: ["most of"], hint: "most of the + N: KHÔNG có the đứng trước most. “the most” chỉ dùng cho so sánh nhất (the most important change). Lỗi mạo từ — loại dai dẳng của Ngày 3." },
          { q: "…and the fields behind it have [given way for] a block of apartments.", answers: ["given way to"], hint: "give way TO · make way FOR. Hai cụm gần nghĩa, khác giới từ; bài mẫu dùng đúng made way for ở đoạn trên nên càng dễ lẫn." },
        ],
      },
      {
        t: "table",
        head: ["Động từ thay đổi", "Giới từ", "Sắc thái", "Câu mới (bản đồ một khuôn viên đại học)"],
        rows: [
          ["convert / turn A", "**into** B", "đổi công năng, giữ công trình", "The old boiler house has been converted **into** a student café."],
          ["replace A", "**with** B · A is replaced **by** B", "bỏ cũ, đặt mới vào đúng chỗ", "The tennis courts have been replaced **by** a sports hall."],
          ["A make way", "**for** B", "cũ bị dỡ để lấy chỗ cho mới", "Two car parks have made way **for** a science block."],
          ["A give way", "**to** B", "cũ lùi dần, mới chiếm chỗ (thường với đất, cảnh quan)", "The playing fields have given way **to** halls of residence."],
          ["extend / enlarge A", "(to the north) · **by** + mức", "mở rộng cái đã có", "The library has been extended **to** the west."],
          ["build / erect A", "**on the site of** B", "xây trên nền cũ", "A lecture theatre has been built **on the site of** the former workshops."],
          ["relocate / move A", "**to** + nơi · **from** A **to** B", "dời chỗ", "The main entrance has been relocated **to** the southern side."],
          ["pedestrianise A / close A", "**to** traffic", "cấm xe", "The central avenue has been closed **to** traffic."],
        ],
      },
      {
        t: "quiz",
        id: "t5d10-viet-thay-doi",
        kind: "fill",
        title: "Luyện câu MỚI — điền MỘT giới từ / từ (6 câu, bản đồ một ngôi làng)",
        items: [
          { q: "The village school has been converted ___ a community centre.", answers: ["into"], hint: "convert A into B." },
          { q: "The orchard to the east has given way ___ a housing estate.", answers: ["to"], hint: "give way to." },
          { q: "Several cottages were demolished to make way ___ a bypass.", answers: ["for"], hint: "make way for." },
          { q: "A supermarket now stands on the ___ of the old cattle market.", answers: ["site"], hint: "on the site of." },
          { q: "___ of the farmland south of the river has been built on. (phần lớn)", answers: ["Most", "Much"], hint: "Most of the farmland — không có The đứng trước." },
          { q: "The post office has been replaced ___ a row of shops.", answers: ["by", "with"], hint: "be replaced by / with." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở Task 1 map",
        items: [
          "**Thì**: dùng hiện tại đơn cho thay đổi (~~the market becomes a shopping centre~~). Mốc “today” ⇒ has become / has been replaced by.",
          "**Chủ động – bị động**: ~~The warehouses have demolished.~~ → have **been** demolished. Nhưng: The fields **have given way** to… (chủ động — give way không có bị động).",
          "**Mạo từ trước tên công trình**: lần đầu a museum, lần sau the museum; tên riêng không mạo từ (Harbour Road).",
          "**on the left / on the top** khi bản đồ có mũi tên bắc. Dùng in the north-west, to the south of the road, at the eastern end.",
          "**Kể nguyên nhân và cảm xúc**: ~~to attract more tourists~~, ~~which is more beautiful~~. Bản đồ không cho biết lý do.",
        ],
      },

      { t: "h", text: "A4. Mổ Task 2 Đề 9 (problem–solution) — ba động tác của bài mẫu" },
      {
        t: "table",
        head: ["Động tác", "Bài band 7 thường viết", "Bài mẫu của đề làm gì", "Tự soát bài của bạn"],
        rows: [
          ["① **Không kể lại nguyên nhân**", "một thân bài về “vì sao người trẻ thích đại học”", "dùng nguyên nhân (đề đã cho) để CHỌN giải pháp: gốc là vị thế ⇒ nâng vị thế", "Tôi có đoạn nào trả lời câu hỏi đề KHÔNG hỏi không?"],
          ["② **Vấn đề là chuỗi hệ quả**", "This causes many problems. People cannot find workers.", "thiếu thợ ⇒ sửa chữa chậm và đắt ⇒ thợ không bằng cấp lấp chỗ ⇒ nguy hiểm; rồi lên tầng quốc gia", "Mỗi vấn đề của tôi có ít nhất hai mắt xích “⇒” không?"],
          ["③ **Giải pháp bốn phần + xếp hạng**", "The government should encourage young people to learn a trade.", "ai (nhà trường, cố vấn hướng nghiệp; chủ lao động và nhà nước) · làm gì · vì sao có tác dụng · giới hạn (attitudes change slowly) · cái nào nhanh, cái nào bền", "Giải pháp của tôi có chủ ngữ cụ thể không? Có câu so hai giải pháp không?"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Band 7 (đề khác — thiếu giáo viên ở vùng nông thôn): Rural schools cannot find enough teachers. This is a serious problem for students. The government should pay teachers more.", vi: "Ba câu đúng ngữ pháp. Vấn đề chưa thành chuỗi; giải pháp chưa nói ai, bao nhiêu, vì sao có tác dụng, giới hạn ở đâu." },
          { en: "Band 8: When a village school cannot fill a post, the remaining staff teach subjects they were never trained in, and the pupils who most need help are the first to fall behind. A salary supplement for rural posts would attract applicants within a year; it would not keep them, however, unless housing were provided as well.", vi: "Chuỗi: thiếu người ⇒ dạy trái môn ⇒ học sinh yếu tụt lại. Giải pháp: cái gì (phụ cấp), tác dụng nhanh tới đâu (trong một năm), giới hạn (không giữ chân nếu thiếu nhà ở)." },
        ],
      },

      { t: "h", text: "A5. Hai lỗi cố ý trong bài mẫu Task 2 — tìm, sửa, rồi luyện câu mới" },
      {
        t: "quiz",
        id: "t5d10-viet-t2-loi",
        kind: "fill",
        title: "Gõ lại phần [trong ngoặc] cho đúng (2 câu trích từ bài mẫu Task 2 của Đề 9)",
        items: [
          { q: "At a national level, a shortage of such workers [have] consequences that are harder to see but more serious.", answers: ["has"], hint: "Danh từ CHÍNH là a shortage (số ít); workers chỉ là phần sau of. Động từ theo danh từ chính — lỗi hoà hợp chủ – vị khi danh từ chính ở xa (Ngày 3)." },
          { q: "…if careers advisers stopped discouraging able teenagers [to consider] them, attitudes would begin to shift.", answers: ["from considering"], hint: "discourage / prevent / stop / deter + sb + FROM + V-ing. Chỉ encourage + sb + TO + V mới đi với to." },
        ],
      },
      {
        t: "table",
        head: ["Mẫu", "Động từ", "Ví dụ"],
        rows: [
          ["V + sb + **from** + V-ing (ngăn)", "discourage · prevent · stop · deter · dissuade · ban · prohibit", "High fees deter many students **from applying**."],
          ["V + sb + **to** + V (thúc)", "encourage · urge · persuade · enable · allow · require · oblige", "Grants enable firms **to train** more apprentices."],
          ["V + sb + **into** + V-ing (ép, dụ)", "pressure · talk · force · trick", "Parents may pressure teenagers **into choosing** a degree."],
          ["V + V-ing (không tân ngữ người)", "avoid · risk · consider · suggest · recommend", "The report recommends **raising** the wage."],
        ],
        caption: "Bốn mẫu động từ hay lẫn trong đoạn giải pháp — học theo cặp trái nghĩa: encourage to ↔ discourage from",
      },
      {
        t: "quiz",
        id: "t5d10-viet-mau-dong-tu",
        kind: "fill",
        title: "Luyện câu MỚI — chia động từ trong ngoặc / gõ dạng đúng (8 câu)",
        items: [
          { q: "The cost of repairs in older buildings (be) ___ rising faster than wages.", answers: ["is"], hint: "Danh từ chính: The cost (số ít)." },
          { q: "The number of apprentices who complete their training (have) ___ fallen since 2015.", answers: ["has"], hint: "The number of… + động từ số ít. (A number of… + số nhiều.)" },
          { q: "A range of measures (be) ___ needed to reverse the trend.", answers: ["is", "are"], hint: "A range of + N số nhiều: cả is (theo range) và are (theo nghĩa) đều được chấp nhận; trong văn viết trang trọng, is an toàn hơn." },
          { q: "The lack of qualified electricians in rural areas (mean) ___ that simple jobs take weeks.", answers: ["means"], hint: "Danh từ chính: The lack." },
          { q: "Low pay discourages graduates (enter) ___ the profession.", answers: ["from entering"], hint: "discourage sb from + V-ing." },
          { q: "A tax break would encourage small firms (take) ___ on trainees.", answers: ["to take"], hint: "encourage sb to + V." },
          { q: "Nothing prevents a school (invite) ___ local employers to speak to its pupils.", answers: ["from inviting"], hint: "prevent sb from + V-ing." },
          { q: "The new rules oblige employers (provide) ___ at least one day of training a month.", answers: ["to provide"], hint: "oblige sb to + V." },
        ],
      },

      /* ══════════ PHẦN B ══════════ */
      { t: "h", text: "B1. Discussion: band 7 và band 8 khác nhau ở chữ nào" },
      {
        t: "p",
        text: "Problem–solution và Discussion nhìn khác nhau, nhưng điểm số quyết định ở cùng một việc: ==đánh giá==. Ở Đề 9 bạn đánh giá hai giải pháp. Ở Discussion bạn đánh giá hai quan điểm. Tập 4 Ngày 10 đã cho khung band 7: thesis có điều kiện + thuật từng bên + một phép đánh giá mỗi thân bài. Dưới đây là chỗ band 8 đi xa hơn.",
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8", "Động tác tạo khác biệt"],
        rows: [
          ["**TR**", "thuật đủ hai bên, có đánh giá; lập trường rõ nhưng thường là “đồng ý một phần”", "mỗi bên được thuật ở dạng thuyết phục nhất; lập trường chỉ ra hai bên khác nhau ở đâu và mỗi bên đúng trong điều kiện nào", "① thuật mạnh nhất · ② bản lề · ③ lập trường tinh"],
          ["**CC**", "On the one hand / On the other hand / In conclusion", "đoạn sau mở bằng cách bám vào đoạn trước (Those who stress…, however, are not denying this)", "liên kết lặng (Bài 1 mục 7)"],
          ["**LR**", "important factor, play a role, rich families", "decides the order of finishing · accidents of birth · scarcely represented", "từ chính xác + một hình ảnh riêng"],
          ["**GRA**", "câu phức đúng, còn 3–4 lỗi nhỏ", "câu dài vẫn rõ nhờ song song; 0–1 lỗi", "Ngày 9"],
        ],
      },

      { t: "h", text: "B2. Động tác ① — thuật mỗi quan điểm ở dạng MẠNH NHẤT" },
      {
        t: "p",
        text: "Người viết band 7 thường thuật bên mình không chọn một cách yếu ớt để dễ bác. Giám khảo thấy ngay. Band 8 làm ngược lại: nêu lý lẽ ==tốt nhất== của mỗi bên, bằng giọng của người tin nó. Lập trường của bạn chỉ đáng giá khi nó thắng được phiên bản mạnh.",
      },
      {
        t: "table",
        head: ["Quan điểm", "Thuật yếu (band 6.5–7)", "Thuật mạnh (band 8)"],
        rows: [
          ["Thành công là do nỗ lực", "Some people think that if you work hard, you will be successful.", "The case for hard work is strongest when we compare people who started from the same place: among them, effort is usually what separates those who advance from those who do not."],
          ["Thành công là do may mắn và hoàn cảnh", "Other people think that rich children are luckier.", "Those who stress background are not denying that effort matters. Their point is that the starting places themselves are unequal, and that no amount of diligence explains why some begin several years ahead."],
        ],
      },
      {
        t: "note",
        title: "📌 Ba dấu hiệu của một lời thuật mạnh",
        items: [
          "Nó nói ==khi nào== quan điểm ấy đúng nhất (is strongest when… · is most persuasive in the case of…).",
          "Nó đoán trước lời bác dễ dãi và gạt đi (are not denying that… · This is not to say that…).",
          "Nó có một lý lẽ mà chính bạn cũng thấy khó cãi. Nếu bạn cãi được ngay trong một câu, bạn chưa thuật phiên bản mạnh.",
        ],
      },
      { t: "rule", formula: "The case for X is strongest when + mệnh đề   ·   Those who + V …, however, are not denying that …. Their point is that …", vi: "Thuật bằng giọng của người tin quan điểm đó; chưa đánh giá vội." },

      { t: "h", text: "B3. Động tác ② — tìm BẢN LỀ: hai bên thật sự khác nhau ở đâu" },
      {
        t: "p",
        text: "Hôm qua, ở Passage 2 của Đề 9, bạn chọn tiêu đề “A dispute that turns on a definition” cho đoạn G. Tác giả không phân xử ai đúng; ông chỉ ra hai phía đang dùng một từ theo hai nghĩa. Bài Discussion band 8 làm đúng việc đó trong một câu. Bài 1 mục 3 liệt kê năm loại bản lề: định nghĩa · thước đo · ai · khi nào · mặc định.",
      },
      {
        t: "table",
        head: ["Đề (rút gọn)", "Bản lề", "Câu gọi tên"],
        rows: [
          ["Thành công: nỗ lực hay may mắn + hoàn cảnh?", "**ai** — so trong một nhóm hay giữa các nhóm", "The dispute turns less on facts than on what is being explained: why one colleague overtakes another, or why whole groups are absent."],
          ["Nghiên cứu khoa học: nhà nước hay công ty tư nhân?", "**thước đo** — lợi ích lâu dài hay ứng dụng nhanh", "The answer differs according to whether research is judged by its usefulness within five years or within fifty."],
          ["Tin tức: chỉ đưa sự kiện hay có bình luận?", "**định nghĩa** — thế nào là “sự kiện”", "Much depends on what is meant by a fact, since selecting which facts to report is itself a judgement."],
          ["Trẻ nên tự do chọn môn hay học theo chương trình chung?", "**khi nào** — tuổi nào", "The two views differ less in principle than in timing: few would give a seven-year-old the choice, and few would deny it to a seventeen-year-old."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: bản lề không phải là “cả hai đều đúng”",
        items: [
          "~~Both views have their own advantages and disadvantages.~~ — câu này không nói gì. Bản lề phải ==gọi tên== điểm khác nhau.",
          "Không phải đề nào cũng có bản lề đẹp. Khi không tìm ra trong 2 phút dàn ý, dùng khung band 7 (thesis có điều kiện) — vẫn đủ 7.5 nếu đánh giá sâu.",
          "Bản lề nêu một lần: ở mở bài (như một lời hứa) hoặc ở đầu đoạn lập trường (như một phát hiện). Không nêu ở cả hai chỗ bằng cùng một câu.",
        ],
      },
      { t: "rule", formula: "The disagreement turns less on A than on B   ·   The two views differ less in N than in N   ·   The answer differs according to whether …", vi: "less… than… phải song song hai vế (Ngày 9 mục 3)." },

      { t: "h", text: "B4. Động tác ③ — lập trường TINH: bốn khuôn thay cho “I partly agree”" },
      {
        t: "patterns",
        rows: [
          {
            formula: "If the question is + mệnh đề, A is the answer; if it is + mệnh đề, B is",
            vi: "Khuôn TÁCH CÂU HỎI: mỗi bên đúng cho một câu hỏi. Hai vế song song, nối bằng chấm phẩy.",
            examples: [
              { en: "If the question is why one colleague overtakes another, effort is usually the answer; if it is why whole sections of society are scarcely represented in certain professions, background plainly is.", vi: "Nếu câu hỏi là vì sao một đồng nghiệp vượt người khác, câu trả lời thường là nỗ lực; nếu là vì sao cả những tầng lớp gần như vắng mặt trong một số nghề, thì rõ ràng là hoàn cảnh." },
            ],
          },
          {
            formula: "A + V + within + N, but not + N",
            vi: "Khuôn PHẠM VI: A đúng bên trong một giới hạn.",
            examples: [
              { en: "Hard work decides the order of finishing within a group, but not which group one runs in.", vi: "Nỗ lực quyết định thứ tự về đích trong một nhóm, nhưng không quyết định ta chạy trong nhóm nào." },
            ],
          },
          {
            formula: "In the short term, A; in the long term, B",
            vi: "Khuôn THỜI GIAN: như câu xếp hạng giải pháp của Đề 9 (nhanh ↔ bền).",
            examples: [
              { en: "In the short term, private funding brings results sooner; in the long term, only public funding protects research that has no obvious buyer.", vi: "Trong ngắn hạn, vốn tư nhân cho kết quả sớm hơn; về lâu dài, chỉ vốn công mới bảo vệ được nghiên cứu chưa có người mua rõ ràng." },
            ],
          },
          {
            formula: "Individuals are right to + V …, while + governments / employers + ought to + V …",
            vi: "Khuôn AI LÀM GÌ: lời khuyên khác nhau cho từng tầng — biến lập trường thành hệ quả thực tế.",
            examples: [
              { en: "Individuals are right to work as though effort were everything, while employers and governments ought to behave as though it were not.", vi: "Cá nhân có lý khi làm việc như thể nỗ lực là tất cả, trong khi chủ lao động và chính phủ nên hành xử như thể không phải vậy." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: lập trường tinh vẫn là một lập trường",
        items: [
          "Đề viết “give your own opinion”. Lập trường tinh không phải né chọn: nó nói rõ ==bên nào đúng ở đâu==, và người đọc đoán được bạn sẽ khuyên gì.",
          "Phép thử: đọc riêng kết bài. Một người chưa đọc thân bài có biết bạn nghĩ gì không? Nếu kết bài là “both are important” ⇒ chưa có lập trường.",
          "as though effort **were** everything — giả định cách (subjunctive) sau as though; Ngày 19 học kỹ. Hôm nay dùng như một khung.",
        ],
      },
      {
        t: "quiz",
        id: "t5d10-viet-lap-truong-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — bản lề và lập trường tinh (4 câu)",
        grammar: "turn less on A than on B · If the question is…, A; if it is…, B · in the short term…; in the long term…",
        items: [
          { q: "Cuộc tranh cãi xoay quanh thước đo nhiều hơn là quanh dữ kiện.", answers: ["The dispute turns less on the facts than on the measure.", "The dispute turns less on facts than on the measure.", "The debate turns less on the facts than on the measure.", "The dispute turns less on the facts than on how they are measured.", "The dispute turns less on facts than on how they are measured."], hint: "turn less on… than on…" },
          { q: "Lý lẽ ủng hộ đồng phục mạnh nhất khi ta nghĩ tới những gia đình nghèo nhất.", answers: ["The case for school uniforms is strongest when we consider the poorest families.", "The case for uniforms is strongest when we consider the poorest families.", "The case for school uniforms is strongest when we think of the poorest families.", "The case for uniforms is strongest when we think of the poorest families."], hint: "The case for… is strongest when…" },
          { q: "Trong ngắn hạn, phạt tiền có hiệu quả; về lâu dài, chỉ giáo dục mới thay đổi được thói quen.", answers: ["In the short term, fines are effective; in the long term, only education changes habits.", "In the short term, fines are effective; in the long term, only education can change habits.", "In the short term, fines work; in the long term, only education changes habits.", "In the short term, fines work; in the long term, only education can change habits."], hint: "In the short term, …; in the long term, only…" },
          { q: "Những người nhấn mạnh may mắn không phủ nhận rằng nỗ lực là quan trọng.", answers: ["Those who stress luck are not denying that effort matters.", "Those who stress luck are not denying that effort is important.", "Those who emphasise luck are not denying that effort matters.", "Those who stress luck do not deny that effort matters.", "Those who emphasise luck do not deny that effort matters."], hint: "Those who stress… are not denying that…" },
        ],
      },

      { t: "h", text: "B5. Đề hôm nay — phân tích và dàn ý 6 phút" },
      {
        t: "p",
        text: "**ĐỀ:** Some people believe that success in a career is mainly the result of hard work. Others argue that luck and family background play a greater role. Discuss both these views and give your own opinion.",
      },
      {
        t: "table",
        head: ["Bước", "Làm gì", "Với đề này"],
        rows: [
          ["1 · Đếm vế (1′)", "hai quan điểm + ý kiến của bạn; chữ giới hạn", "**mainly** (không phải only) · **a greater role** (so sánh) · bên B có HAI thứ: luck VÀ family background"],
          ["2 · Lý lẽ mạnh nhất mỗi bên (2′)", "một lý lẽ + một minh hoạ thấy được", "A: so người cùng điểm xuất phát; nỗ lực là thứ duy nhất nằm trong tay mình · B: điểm xuất phát không bằng nhau (học thêm, thực tập không lương, quen biết); thời điểm ra trường"],
          ["3 · Bản lề (1′)", "hai bên khác nhau ở đâu?", "A giải thích khác biệt TRONG một nhóm; B giải thích khác biệt GIỮA các nhóm"],
          ["4 · Lập trường tinh (1′)", "chọn một trong bốn khuôn", "tách câu hỏi + ai làm gì"],
          ["5 · Thứ tự đoạn (1′)", "4 đoạn hay 5 đoạn", "mở bài (hứa bản lề) · A · B · lập trường (thành đoạn kết dài)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba bẫy của đề này",
        items: [
          "Bỏ quên **family background**, chỉ viết về luck — bên B có hai thành phần, bài phải chạm cả hai.",
          "Lấy ví dụ người nổi tiếng không kiểm chứng được (~~Bill Gates dropped out and…~~). Ví dụ liên quan của band 8: một tình huống người đọc thấy được (thực tập không lương, ra trường đúng năm suy thoái).",
          "Kết bằng lời khuyên đạo đức (~~Everyone should try their best.~~). Kết bài nhắc lập trường, không rao giảng.",
        ],
      },

      { t: "h", text: "B6. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      {
        t: "p",
        text: "Đọc bài band 7 trước. Nó rõ, đủ hai bên, có ý kiến. Vừa đọc vừa hỏi: ==bên nào được thuật yếu hơn? hai bên khác nhau ở đâu — bài có nói không?==",
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 254 từ",
        paras: [
          { text: "People often disagree about what makes a person successful at work. Some say that hard work is the most important factor, while others think that luck and family background are more important. In my opinion, both are necessary, but hard work matters more." },
          { text: "On the one hand, many people believe that success comes from hard work. Firstly, people who work hard can improve their skills and knowledge, so they will get better jobs and higher salaries. For example, a programmer who spends many hours practising will become better than his colleagues. Secondly, hard work shows employers that a person is reliable. In many companies, the employees who stay late and take on extra tasks are usually the first to be noticed by their managers, so they are more likely to be promoted. Therefore, this view is quite reasonable." },
          { text: "On the other hand, other people argue that luck and family background play a bigger role. Children from rich families can go to good schools, and they have many relationships that help them to find a good job. In addition, some people are lucky because they meet the right person or join a company at the right time. However, I think that luck cannot help a person who is lazy, because he will waste the opportunities that he has." },
          { text: "In conclusion, although family background and luck can help people at the beginning of their career, I believe that hard work is the main reason of success. Everyone should try their best instead of waiting for luck." },
        ],
      },
      {
        t: "p",
        text: "Bây giờ đọc bài band 8. Gần như cùng các lý lẽ. Để ý ba thứ: ==bên B được thuật mạnh thế nào · câu nào gọi tên bản lề · kết bài khuyên ai làm gì.==",
      },
      {
        t: "passage",
        title: "Bài mẫu band 8 (ước tính) — 321 từ",
        paras: [
          { text: "Few questions divide people as reliably as that of why some careers flourish while others stall. One camp credits effort; the other points to accidents of birth and timing. I shall argue that the two are answering slightly different questions, and that once these are separated, each view turns out to be right about one of them." },
          { text: "The case for hard work is strongest when we compare people who started from the same place. Among graduates of a single university course, with similar grades and similar contacts, those who go on to do well are, in my experience, overwhelmingly the ones who kept learning after the lectures ended. Effort also has a quality that luck lacks: it is the only factor that lies within a person's control. To tell a young employee that diligence is irrelevant would be both false and useless." },
          { text: "Those who stress luck and background, however, are not denying any of this. Their point is that the starting places themselves are unequal. A teenager whose parents can pay for extra tuition, tolerate an unpaid internship and introduce her to people in the profession has been handed several years' advantage before her own effort begins to count. Timing matters in the same way: to qualify in a year when firms are hiring, rather than in a recession, is no achievement of one's own. Hard work, on this view, decides the order of finishing within a group, but not which group one runs in." },
          { text: "It seems to me, therefore, that the dispute turns less on facts than on what is being explained. If the question is why one colleague overtakes another, effort is usually the answer; if it is why whole sections of society are scarcely represented in certain professions, background plainly is. Both conclusions have practical force: individuals are right to work as though effort were everything, while employers and governments ought to behave as though it were not." },
        ],
      },

      { t: "h", text: "B7. Chấm hai bài theo bốn tiêu chí" },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 7", "Bài band 8", "Động tác tạo khác biệt"],
        rows: [
          ["**TR**", "Đủ hai bên, có ý kiến. Bên B thuật yếu rồi bị bác bằng một câu (“luck cannot help a person who is lazy”) — bác phiên bản không ai chủ trương. Kết bài thêm lời khuyên.", "Mỗi bên được nói khi nào nó mạnh nhất. Bên B đoán trước lời bác (“are not denying any of this”). Lập trường tách hai câu hỏi và kết bằng hệ quả cho hai tầng (cá nhân · chủ lao động, chính phủ).", "① ② ③"],
          ["**CC**", "On the one hand · Firstly · For example · Secondly · Therefore · On the other hand · In addition · However · In conclusion — 9 từ nối đầu câu", "however (giữa câu) · therefore (giữa câu) — còn lại nối bằng tham chiếu: One camp… the other · Those who… any of this · Their point · on this view · Both conclusions", "liên kết lặng"],
          ["**LR**", "important factor · get better jobs · rich families · ~~many relationships~~ (→ connections) · ~~the main reason of~~ (→ for)", "flourish / stall · accidents of birth and timing · lies within a person's control · has been handed several years' advantage · scarcely represented · practical force", "từ chính xác; một hình ảnh riêng (cuộc chạy đua) dùng nhất quán"],
          ["**GRA**", "câu phức đúng; lỗi: reason of · a person… he (đại từ giới tính) · will ở câu khái quát", "song song ba động từ (pay for…, tolerate… and introduce…) · If… A; if… B · as though… were · To tell… would be both false and useless · 0 lỗi", "Ngày 9: song song giữ câu 40 từ vẫn rõ"],
        ],
      },
      {
        t: "note",
        title: "📌 Đếm trong bài band 8",
        items: [
          "**Khung của Bài 1**: is strongest when (thuật mạnh) · are not denying · Their point is that · on this view · turns less on… than on (bản lề) · within a group, but not… (phạm vi). Sáu khung, không khung nào lặp.",
          "**Song song (Ngày 9)**: One camp credits…; the other points to… · both false and useless · pay for…, tolerate… and introduce… · If the question is…; if it is… · individuals are right to…, while employers… ought to….",
          "**Hedging đúng liều (Ngày 1)**: usually · in my experience · plainly — mỗi nhận định một lần; thesis (“I shall argue”) không rào.",
          "**Độ dài**: 321 từ, 4 đoạn. Đoạn lập trường làm luôn việc của kết bài — không có đoạn “In conclusion” nhắc lại. Cách này an toàn khi đoạn cuối trả lời rõ “give your own opinion”.",
        ],
      },
      {
        t: "mcq",
        id: "t5d10-viet-nhan-dien",
        title: "Nhận diện — câu nào là động tác band 8? (6 câu)",
        items: [
          { q: "1. Câu nào thuật quan điểm “nên cấm quảng cáo cho trẻ em” ở dạng MẠNH NHẤT?", options: ["Some people think advertising is bad for children.", "The case for a ban is strongest in the case of children under eight, who cannot yet tell an advertisement from a programme.", "Many parents hate advertisements because they are annoying.", "A ban is a good idea because children watch too much television."], correct: 1, why: "Nói rõ khi nào lý lẽ mạnh nhất (trẻ dưới tám tuổi) và vì sao (chưa phân biệt được quảng cáo với chương trình)." },
          { q: "2. Câu nào gọi tên BẢN LỀ?", options: ["Both views have advantages and disadvantages.", "There are many different opinions on this issue.", "The two sides differ less about whether cars should be restricted than about who should bear the cost.", "This is a controversial topic nowadays."], correct: 2, why: "differ less about A than about B — chỉ đúng điểm hai bên khác nhau. Ba câu kia đúng với mọi đề nên không nói gì." },
          { q: "3. Câu nào là lập trường TINH?", options: ["I partly agree with both views.", "In my opinion, both are important in different ways.", "For routine decisions, the majority should prevail; for decisions that cannot be undone, expert advice ought to carry more weight.", "I think the second view is better."], correct: 2, why: "Mỗi bên đúng trong một điều kiện gọi tên được (quyết định thường nhật ↔ quyết định không đảo ngược được); hai vế song song." },
          { q: "4. Câu mở thân 2 nào là liên kết lặng?", options: ["On the other hand, other people have a different opinion.", "Secondly, there is another view.", "Supporters of private funding, however, are not disputing the value of basic research; their concern is with who decides what counts as useful.", "Moreover, the second view is also reasonable."], correct: 2, why: "Bám vào đoạn trước (are not disputing…) rồi đưa ý mới; however ở giữa câu." },
          { q: "5. Lời bác nào đang bác một phiên bản YẾU (lỗi band 7)?", options: ["This reasoning holds within a single workplace but says little about who is hired in the first place.", "However, luck cannot help a lazy person.", "The argument takes it for granted that opportunities are evenly spread.", "The benefits, while real, accrue mainly to those who need them least."], correct: 1, why: "Không ai chủ trương “may mắn giúp được người lười”. Bác một ý không ai nêu là thuật yếu để dễ thắng." },
          { q: "6. Kết bài nào đạt band 8?", options: ["In conclusion, both views are right, and people should think carefully.", "To sum up, hard work and luck are both important for success in life.", "In conclusion, I believe hard work is the key, so everyone should try their best.", "Effort, then, explains who rises within a profession; background explains who enters it — and policy should be judged by the second as well as the first."], correct: 3, why: "Nhắc lập trường bằng cặp song song + một hệ quả; không thêm lời khuyên chung chung." },
        ],
      },

      { t: "h", text: "B8. Tám lỗi giữ bài Discussion ở band 7 — bảng tự soát" },
      {
        t: "table",
        head: ["#", "Lỗi", "Sửa bằng"],
        rows: [
          ["1", "Thuật bên kia yếu để dễ bác", "is strongest when… · are not denying that…"],
          ["2", "“Both views have advantages and disadvantages”", "một câu bản lề gọi tên điểm khác nhau"],
          ["3", "Lập trường “I partly agree” không có điều kiện", "một trong bốn khuôn ở B4"],
          ["4", "Bỏ một thành phần của đề (luck AND family background)", "gạch chân mọi danh từ trong đề khi đếm vế"],
          ["5", "9–10 từ nối đầu câu", "giữ 2–3; còn lại dùng This / Such / Those who / Their point"],
          ["6", "Ví dụ người nổi tiếng, số liệu bịa", "tình huống thấy được, không tên, không số"],
          ["7", "Kết bài rao giảng (Everyone should…)", "nhắc lập trường + một hệ quả"],
          ["8", "Lỗi của Ngày 9: gãy song song ở cặp not only… but also, less… than", "soát chữ đứng ngay sau mỗi nửa của cặp"],
        ],
      },

      { t: "h", text: "B9. Viết bài — AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách làm: viết trước, so sau",
        items: [
          "Bài 1 (40 phút): viết đề ở B5 theo dàn ý CỦA BẠN. Được dùng cùng bản lề với bài mẫu, nhưng lý lẽ và minh hoạ phải là của bạn. Dùng ít nhất **ba khung** của Bài 1.",
          "Bài 2 (40 phút): viết lại bài Task 2 **Đề 9** của bạn. Mục tiêu: mỗi vấn đề là một chuỗi hai mắt xích; mỗi giải pháp có chủ ngữ cụ thể; có một câu xếp hạng; 0–1 lỗi.",
          "Soát cuối theo bảng 6 lượt + hai lượt mới của Ngày 9 (song song · chủ ngữ sau dấu phẩy đầu câu).",
        ],
      },
      {
        t: "essay",
        id: "t5d10-viet-bai",
        task: "Task 2",
        prompt: "Some people believe that success in a career is mainly the result of hard work. Others argue that luck and family background play a greater role. Discuss both these views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Mỗi quan điểm: nói khi nào nó MẠNH NHẤT, bằng giọng của người tin nó.",
          "Một câu gọi tên bản lề (turns less on A than on B / are answering different questions).",
          "Lập trường tinh: mỗi bên đúng ở đâu; kết bằng hệ quả, không rao giảng.",
          "Bên B có hai thành phần: luck VÀ family background — chạm cả hai.",
          "Tối đa 3 từ nối đầu câu; soát song song và chủ ngữ treo.",
        ],
      },
      {
        t: "essay",
        id: "t5d10-viet-lai",
        task: "Task 2",
        prompt: "REWRITE (Task 2). On the FIRST line, copy the question of the Task 2 essay you wrote for Test 9 (Online Test): the shortage of skilled manual workers — problems and measures. Then write your improved version (at least 250 words), aiming at band 8: do not write a paragraph about causes (the cause is given); develop each problem as a chain of at least two consequences with one concrete illustration; give two measures, each saying who does what, why it would work and where its limit lies; include one sentence that ranks the two measures by a named criterion; no more than three sentence-initial linking words; at most one grammatical error.",
        minWords: 250,
        tips: [
          "Nguyên nhân đã cho trong đề ⇒ chỉ dùng nó để chọn giải pháp trúng gốc.",
          "Mẫu động từ: discourage / prevent sb FROM doing · encourage / enable sb TO do.",
          "Hoà hợp chủ – vị: a shortage of workers HAS · the number of apprentices HAS.",
          "Câu xếp hạng: Of the two measures, the former…, although it is the latter that….",
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài này",
        items: [
          "Ghi vào sổ Writing: bản lề của đề hôm nay + khuôn lập trường bạn đã dùng. Sau 10 đề, bạn sẽ thấy năm loại bản lề lặp lại.",
          "Ngày 13 học đảo ngữ, câu chẻ và nhượng bộ ở Task 2 band 8; Ngày 14 học nhận dạng đề trộn dạng — khi đó bản lề là công cụ chọn khung.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d10-noi",
    kind: "speaking",
    title: "Nói: Mổ Speaking Đề 9 theo 4 tiêu chí — Part 1 câu hỏi “vì sao / xu hướng”, Part 2 thẻ tình huống trừu tượng, Part 3 năm kiểu câu hỏi",
    goal: "Tự mổ được bản ghi âm Speaking Đề 9 của mình theo bốn tiêu chí bằng cách ĐẾM (chỗ ngừng vì tìm từ, từ lặp, loại cấu trúc, trọng âm sai), hiểu bài mẫu của đề hơn bài band 7 ở động tác nào, rồi trả lời được câu hỏi và thẻ MỚI cùng kiểu: Part 1 có lý do + hình ảnh + câu đúc kết, Part 2 kể được CƠ CHẾ chứ không chỉ kết quả, Part 3 mở đúng khung cho từng kiểu câu hỏi.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        items: [
          "Mở bản ghi âm **Speaking Đề 9** của bạn. Chưa ghi âm? Trước khi đọc tiếp, ghi lại ba câu bằng điện thoại: câu Part 1 “Why do you think some people rarely look at the photographs they have taken?”, thẻ Part 2 của đề, và câu Part 3 “To what extent should politicians be criticised…?”.",
          "Mổ bài nói khác mổ bài đọc: không có đáp án. Bạn ==đếm== bốn thứ, mỗi tiêu chí một thứ, rồi so với bài mẫu của đề.",
          "**Part 1**: Đề 9 cài mỗi chủ đề một câu hỏi “vì sao / xu hướng”. Band 8 trả lời bằng hai lý do có quan hệ + một hình ảnh + một câu đúc kết, trong 30–40 giây.",
          "**Part 2**: thẻ “thuyết phục một người nhìn lại quyết định của họ” là thẻ tình huống + trừu tượng. Điểm nằm ở ==cơ chế==: bạn đã làm gì khiến người kia nghĩ lại — không phải “vì mình đúng”.",
          "**Part 3**: năm câu của đề là năm kiểu (mô tả → nguyên nhân → mức độ → giả định → dự đoán). Mỗi kiểu có một cách mở riêng.",
          "🔊 Phát âm: do / does / did nhấn mạnh và hạ giọng ở câu trích. Luyện lại bằng Part 1 mới (Handwriting, Neighbours), một thẻ Part 2 mới và năm câu Part 3 mới.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Cách mổ bài nói của chính bạn — đếm, đừng đoán" },
      {
        t: "table",
        head: ["Tiêu chí", "Nghe lại và ĐẾM", "Band 7 thường ra", "Đích band 8"],
        rows: [
          ["**FC** — trôi chảy, mạch lạc", "số chỗ ngừng quá 1 giây ==giữa cụm từ== (ngừng vì tìm từ); số lần nói lại câu từ đầu", "6–10 chỗ trong 2 phút Part 2", "≤ 2; các chỗ ngừng còn lại nằm ở ranh giới ý (Ngày 2)"],
          ["**LR** — từ vựng", "từ nội dung lặp quá 3 lần (important, good, people think); số cụm bạn tự thấy là “chính xác”", "3–4 từ lặp; 2–3 cụm chính xác", "≤ 1 từ lặp; 6–8 cụm chính xác; idiom 0–1 lần, đúng chỗ"],
          ["**GRA** — ngữ pháp", "số LOẠI cấu trúc khác nhau (quá khứ hoàn thành, điều kiện, câu chẻ, mệnh đề quan hệ, so sánh…); số lỗi nghe ra được", "3–4 loại; 4–6 lỗi", "6+ loại; ≤ 2 lỗi nhỏ"],
          ["**P** — phát âm", "từ nhấn sai trọng âm; câu nào đều đều không có từ được đẩy lên; âm cuối bị nuốt (-ed, -s)", "3–5 từ sai trọng âm; nhiều câu phẳng", "≤ 1; mỗi cụm một từ nhấn; -ed / -s nghe rõ"],
        ],
        caption: "Bốn phép đếm — ghi kết quả vào sổ Speaking; Ngày 22 (mổ Speaking Đề 10) so lại",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Mổ một câu trả lời trong 10 phút",
        steps: [
          { label: "Nghe lần 1 — không dừng", sub: "ghi ấn tượng một dòng: rõ ý không? có đoạn nào bạn tự thấy ngượng?" },
          { label: "Nghe lần 2 — chép lại nguyên văn", sub: "cả um, cả chỗ nói lại; đánh dấu / ở mỗi chỗ ngừng" },
          { label: "Đếm bốn thứ", sub: "theo bảng trên; khoanh lỗi ngữ pháp, gạch chân từ lặp" },
          { label: "So với bài mẫu của đề", sub: "tìm MỘT động tác mẫu có mà bạn không có" },
          { label: "Ghi âm lại ngay", sub: "cùng câu hỏi, thêm đúng một động tác đó; đếm lại" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba lỗi khi tự mổ — cẩn thận",
        items: [
          "**Chỉ sửa ngữ pháp.** Người Việt quen soát lỗi trên giấy nên chỉ nhìn GRA. Ở band 7 → 8, tiêu chí kéo điểm xuống thường là FC (ngừng vì tìm từ) và P (câu phẳng).",
          "**Học thuộc bài mẫu của đề.** Giám khảo nhận ra bài thuộc lòng qua nhịp nói đều và từ vựng lệch với các câu trả lời khác. Lấy ĐỘNG TÁC, không lấy câu chữ.",
          "**Chép lại bản đẹp hơn điều mình đã nói.** Bản chép phải có cả chỗ vấp. Không có chỗ vấp thì không có gì để mổ.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Mổ Part 1 Đề 9 — câu hỏi “vì sao” và câu hỏi “xu hướng”" },
      {
        t: "table",
        head: ["Câu hỏi của đề", "Kiểu", "Band 7 thường làm", "Band 8 cần làm"],
        rows: [
          ["Do you take a lot of photographs?", "thói quen", "Yes + tần suất + một lý do", "trả lời + một chi tiết riêng (chụp gì, để làm gì) — 15–20 giây là đủ"],
          ["Do you prefer… people or… places?", "lựa chọn", "chọn một + because", "chọn + lý do + nhượng một câu cho bên kia"],
          ["Why do you think some people rarely look at the photographs they have taken?", "**vì sao — về người khác**", "một lý do chung (They are busy.) rồi hết ý", "hai lý do ==có quan hệ== + một hình ảnh cụ thể + câu đúc kết"],
          ["What do people in your country usually celebrate?", "mô tả", "liệt kê lễ, Tết", "chọn 1–2 dịp + nói người ta LÀM gì"],
          ["Do you think celebrations are becoming more or less important…?", "**xu hướng**", "chọn more / less + một lý do", "tách: cái gì giảm, cái gì tăng — rồi nói ý mình"],
        ],
      },
      {
        t: "table",
        head: ["Bước", "Bài mẫu của đề (câu hỏi về ảnh) làm gì", "Chữ đáng học"],
        rows: [
          ["Lý do 1", "chụp ảnh giờ không tốn gì ⇒ quá nhiều ảnh", "“partly because taking them costs nothing now”"],
          ["Hình ảnh", "máy phim của bố mẹ ↔ hai mươi nghìn ảnh trong điện thoại", "“every shot was a decision” · “frankly exhausting”"],
          ["Lý do 2 (sâu hơn)", "mục đích đã chuyển từ tấm ảnh sang hành động chụp", "“I also suspect that… the point isn't really the picture any more”"],
          ["Đúc kết", "tấm ảnh xong việc ngay lúc bấm máy", "“So the photo's done its job the moment you've pressed the button.”"],
        ],
        caption: "Khung bốn bước cho câu hỏi “Why do you think some people…?” ở Part 1 — 35–40 giây",
      },
      {
        t: "dialogue",
        title: "Hai câu hỏi MỚI cùng kiểu — band 7 rồi band 8",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do you think some people keep things they never use?", vi: "Theo bạn vì sao có người giữ những thứ họ không bao giờ dùng?" },
          { who: "Candidate (band 7)", role: "a", text: "I think because they think they will need them one day. For example, my mother keeps a lot of plastic boxes in the kitchen. Also, some things have memories, so people don't want to throw away them. I think it's normal.", vi: "Tôi nghĩ vì họ cho rằng một ngày nào đó sẽ cần. Ví dụ mẹ tôi giữ rất nhiều hộp nhựa trong bếp. Ngoài ra có thứ gắn với kỷ niệm nên người ta không muốn vứt. Tôi nghĩ thế là bình thường. (lỗi: I think × 3 · throw away them → throw them away · hai lý do rời nhau · không có câu đúc kết)" },
          { who: "Candidate (band 8)", role: "candidate", text: "I think it's mostly that throwing something away feels like a decision, whereas keeping it doesn't. You just close the drawer. My mum's got a cupboard full of takeaway boxes she'll never use, and I'm sure it's not that she values them; it's that binning them would mean admitting she never needed them in the first place. Then there's the odd thing with a memory attached, which is a different story altogether. So I'd say it's less about the objects than about not wanting to choose.", vi: "Tôi nghĩ chủ yếu là vì vứt một thứ đi giống như phải ra một quyết định, còn giữ lại thì không. Chỉ cần đóng ngăn kéo. Mẹ tôi có cả một tủ hộp đựng đồ ăn mang về mà bà sẽ chẳng bao giờ dùng, và tôi chắc không phải vì bà quý chúng; mà vì vứt đi là phải thừa nhận ngay từ đầu mình đã không cần. Rồi còn vài món gắn với kỷ niệm, đó lại là chuyện khác hẳn. Nên tôi cho rằng vấn đề nằm ở chỗ không muốn lựa chọn hơn là ở đồ vật." },
          { who: "Examiner", role: "examiner", text: "Do you think people read maps less than they used to?", vi: "Bạn có nghĩ người ta xem bản đồ ít hơn trước không?" },
          { who: "Candidate (band 7)", role: "a", text: "Yes, I think so. Nowadays everyone uses the map on their phone, so they don't need paper maps anymore. It's more convenient and faster. In the future, maybe nobody will use paper maps.", vi: "Có, tôi nghĩ vậy. Ngày nay ai cũng dùng bản đồ trên điện thoại nên không cần bản đồ giấy nữa. Nó tiện và nhanh hơn. Sau này có lẽ không ai dùng bản đồ giấy. (đúng nhưng phẳng: một hướng, một lý do, không có ý riêng)" },
          { who: "Candidate (band 8)", role: "candidate", text: "Paper maps, definitely. I can't remember the last time I unfolded one. But I'd say we actually look at maps more than ever; it's just that the map's on a phone and it does the reading for us. What we've lost, I think, is the sense of where things are in relation to each other. I can get anywhere in my city, but if you asked me to point north, I'd be guessing.", vi: "Bản đồ giấy thì chắc chắn rồi. Tôi không nhớ nổi lần cuối mình mở một tấm ra là khi nào. Nhưng tôi cho rằng thật ra ta nhìn bản đồ nhiều hơn bao giờ hết; chỉ là bản đồ nằm trong điện thoại và nó đọc hộ ta. Cái ta mất, tôi nghĩ, là cảm giác mọi thứ nằm ở đâu so với nhau. Tôi đi được tới bất cứ đâu trong thành phố, nhưng nếu bạn bảo tôi chỉ hướng bắc thì tôi sẽ đoán mò." },
        ],
      },
      {
        t: "table",
        head: ["", "Band 7", "Band 8"],
        rows: [
          ["Câu “vì sao”", "hai lý do đặt cạnh nhau (Also…)", "một lý do chính có cơ chế (vứt = quyết định) + một ngoại lệ; đúc kết bằng less about A than about B"],
          ["Câu “xu hướng”", "một hướng (ít hơn) + tiện, nhanh", "tách: bản đồ giấy giảm, việc nhìn bản đồ tăng; nêu cái MẤT; kết bằng một hình ảnh về chính mình"],
          ["Từ", "convenient, normal, nowadays", "feels like a decision · binning · the odd thing · unfolded · does the reading for us"],
          ["Ngữ pháp", "hiện tại đơn; will", "whereas · it's not that…; it's that… · What we've lost… is… · if you asked me…, I'd be guessing"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở câu hỏi “vì sao / xu hướng” của Part 1",
        items: [
          "**Trả lời về mình khi câu hỏi hỏi về người khác.** “Why do some people…?” ⇒ nói về họ; có thể lấy mình hoặc người nhà làm VÍ DỤ, nhưng câu đầu phải là một lý do chung.",
          "**“It depends.” rồi dừng.** Phải nói tiếp phụ thuộc vào CÁI GÌ, và mỗi trường hợp thì sao.",
          "**Mở bằng “Nowadays, with the development of technology…”.** Đây là câu của bài viết lớp 12. Part 1 là trò chuyện: vào thẳng ý.",
          "**Nói dài như Part 3.** Câu “vì sao” ở Part 1 vẫn chỉ 30–40 giây. Hai lý do, một hình ảnh, một câu chốt — rồi dừng.",
          "**Trật tự cụm động từ**: ~~throw away them~~ → throw **them** away (đại từ đứng giữa).",
        ],
      },
      { t: "rule", formula: "Part 1 “Why do some people…?”  →  mostly / partly because + cơ chế  →  hình ảnh người thật  →  (ngoại lệ)  →  So I'd say it's less about A than about B", vi: "Câu “xu hướng”: tách cái giảm và cái tăng (X, definitely. But I'd say we actually…) rồi nêu cái mất / cái được." },

      /* ── 3 ── */
      { t: "h", text: "3. Mổ Part 2 Đề 9 — thẻ “thuyết phục một người nhìn lại quyết định”: kể CƠ CHẾ" },
      {
        t: "table",
        head: ["Ý trên thẻ", "Bài mẫu của đề làm gì (trích ngắn)", "Lỗi band 7 hay gặp"],
        rows: [
          ["who the person was", "cô em họ + vì sao lời mình đáng nghe: mình đã đi làm lập trình viên hai năm", "chỉ nói my friend; không cho biết vì sao người đó chịu nghe bạn"],
          ["what they had decided to do", "nói lập trường của cô em bằng giọng CHẮC: “She was absolutely set on…”, “To her mind it was obvious”", "một câu nhạt (She wanted a big company.) ⇒ việc thuyết phục sau đó không có sức nặng"],
          ["what you said to them", "MỘT câu trích trực tiếp (một câu hỏi) + một ví dụ mình kể (cả mùa hè sửa chữ trên một trang cài đặt)", "kể kết luận thay cho lời nói (I told her she should choose the small company.)"],
          ["why your words made a difference", "nêu CƠ CHẾ: “I just shifted the question” — từ “cái nào trông đẹp hơn” sang “ở đâu học được nhiều hơn”", "“because I was right” / “because I have more experience” — đó là kết quả, không phải cơ chế"],
          ["(kết)", "kết quả + đảo ngữ “Had I simply told her she was wrong…” + một nhận xét khái quát", "“That's all.” hoặc lặp lại câu mở"],
        ],
      },
      {
        t: "table",
        head: ["Cơ chế thuyết phục", "Bạn đã làm gì", "Câu nói được"],
        rows: [
          ["**Đổi câu hỏi**", "không tranh cãi với câu trả lời của người kia; đưa ra một câu hỏi tốt hơn", "I didn't tell her what to choose; I changed what she was choosing between."],
          ["**Đưa bằng chứng họ chưa có**", "một trải nghiệm, một con số, một ví dụ ngược", "I'd actually tried it, and what happened wasn't what he'd assumed."],
          ["**Không ép**", "nêu ý rồi để người kia tự quyết", "What made the difference was that I left it up to her."],
          ["**Chỉ ra giả định ngầm**", "cho thấy lý lẽ của người kia dựa trên điều chưa chắc đúng", "She'd been taking it for granted that a famous name meant better training."],
        ],
        caption: "Bốn cơ chế — chọn MỘT cho câu chuyện của bạn. Để ý: “đổi câu hỏi” chính là động tác tìm bản lề ở Bài 2.",
      },
      {
        t: "table",
        head: ["Lớp thời gian", "Thì", "Trong bài mẫu của đề"],
        rows: [
          ["cuộc nói chuyện", "quá khứ đơn", "We were having coffee… I asked her… I told her…"],
          ["điều xảy ra TRƯỚC cuộc nói chuyện", "quá khứ hoàn thành", "I'd been working… she'd more or less decided… I'd spent the whole summer…"],
          ["điều đã không xảy ra", "đảo ngữ điều kiện loại 3", "Had I simply told her…, I doubt she'd have listened…"],
          ["bài học còn đúng bây giờ", "hiện tại đơn", "people change their minds far more readily when…"],
        ],
      },
      { t: "h", text: "4. Luyện lại Part 2 — thẻ MỚI cùng kiểu: một lần bạn không đồng ý với quyết định của nhóm" },
      {
        t: "table",
        head: ["Thẻ đề (cue card)"],
        rows: [
          ["**Describe a time when you disagreed with a decision made by a group you belonged to.** You should say: • what the decision was • why the group made it • why you disagreed • and explain what you did about it."],
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — chỉ từ khoá",
        center: "timetable app — chat feature",
        branches: [
          { label: "DECISION", items: ["5 people · 3 weeks left", "add chat · 4 to 1"] },
          { label: "WHY THEM", items: ["other team had one", "ours looked plain"] },
          { label: "WHY ME", items: ["I'd tested it", "login failed 1 in 10"] },
          { label: "WHAT I DID", items: ["list of 6 bugs · no comment", "leader froze the feature"] },
          { label: "LESSON", items: ["opinion → evidence", "let someone else win it"] },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 8 (ước tính) — khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to tell you about a decision my project team made last year, which I argued against and, as it turned out, lost. There were five of us building a timetable app for our faculty, and about three weeks before the deadline we had a working version with four features. The group decided, four to one, to add a fifth, a chat function, because another team had one and ours looked plain by comparison.", vi: "Tôi muốn kể về một quyết định mà nhóm đồ án của tôi đưa ra năm ngoái — tôi đã phản đối và, hoá ra, thua. Nhóm có năm người, làm một ứng dụng thời khoá biểu cho khoa, và khoảng ba tuần trước hạn chúng tôi có bản chạy được với bốn tính năng. Nhóm quyết định, bốn phiếu trên một, thêm tính năng thứ năm là chat, vì một nhóm khác có và ứng dụng của chúng tôi trông đơn điệu khi đặt cạnh." },
          { who: "Candidate", role: "candidate", text: "I could see why. Nobody wants to present the dullest project in the room, and to be fair, the others had done most of the design work, so they cared how it looked. But I'd spent the previous fortnight testing what we already had, and I knew how fragile it was. The login failed about one time in ten. My view was that a plain app that works beats a clever one that crashes in front of the examiners.", vi: "Tôi hiểu vì sao. Không ai muốn trình bày đồ án nhạt nhất phòng, và công bằng mà nói, các bạn kia đã làm phần lớn thiết kế nên họ quan tâm nó trông ra sao. Nhưng tôi đã dành hai tuần trước đó để kiểm thử cái đang có, và tôi biết nó mong manh thế nào. Đăng nhập lỗi khoảng một lần trong mười. Quan điểm của tôi là một ứng dụng đơn giản mà chạy được thì hơn một ứng dụng hay ho mà sập trước mặt giám khảo." },
          { who: "Candidate", role: "candidate", text: "What I did about it is, I think, the interesting part. I'd already said my piece in the meeting and been outvoted, and I didn't want to be the person who keeps reopening a decision. So instead of arguing again, I wrote down the six bugs I knew about, with the steps to reproduce each one, and posted the list in our group chat without any comment. Two days later, the team leader, not me, suggested we freeze the chat feature until the list was empty. We never did get round to it.", vi: "Việc tôi làm sau đó, tôi nghĩ, mới là phần thú vị. Tôi đã nói hết ý trong cuộc họp và bị bỏ phiếu thua, và tôi không muốn là người cứ lật lại một quyết định. Nên thay vì tranh luận lần nữa, tôi ghi ra sáu lỗi mình biết, kèm các bước tái hiện từng lỗi, rồi đăng danh sách lên nhóm chat, không bình luận gì. Hai ngày sau, trưởng nhóm — không phải tôi — đề nghị tạm dừng tính năng chat cho tới khi danh sách trống. Rốt cuộc chúng tôi không bao giờ làm tới nó." },
          { who: "Candidate", role: "candidate", text: "Looking back, I wasn't any more persuasive the second time; I'd simply stopped offering an opinion and offered evidence instead. And it taught me that losing a vote isn't the end of an argument, provided you're willing to let someone else win it for you.", vi: "Nhìn lại, lần thứ hai tôi chẳng thuyết phục hơn chút nào; tôi chỉ thôi đưa ý kiến mà đưa bằng chứng. Và nó dạy tôi rằng thua một cuộc bỏ phiếu chưa phải là hết tranh luận, miễn là bạn sẵn lòng để người khác thắng thay mình." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài này làm gì", "Chỗ đáng chép vào sổ"],
        rows: [
          ["**FC**", "đủ 4 ý đúng thứ tự thẻ; mỗi đoạn mở bằng một mốc tự nhiên (I could see why. · What I did about it is… · Looking back, …); ý “why the group made it” được thuật ở dạng mạnh (Nobody wants…, to be fair…) — cùng động tác với Bài 2", "câu báo trước: “…which I argued against and, as it turned out, lost.”"],
          ["**LR**", "by comparison · the dullest project in the room · fragile · said my piece (nói hết ý — idiom, một lần) · been outvoted · reopening a decision · steps to reproduce · freeze the feature", "said my piece · outvoted · get round to"],
          ["**GRA**", "quá khứ hoàn thành làm nền (I'd spent… · I'd already said… and been outvoted) · mệnh đề quan hệ (a plain app that works beats a clever one that crashes) · instead of + V-ing · did nhấn mạnh (We never did get round to it) · provided + mệnh đề", "I wasn't any more persuasive…; I'd simply stopped… and offered… instead."],
          ["**P**", "nhấn tương phản: a PLAIN app that WORKS… a CLEVER one that CRASHES · the team LEADer, not ME · an oPINion… EVidence; hạ giọng, chậm lại ở câu cuối", "ghi âm riêng ba cặp tương phản này"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo cho mọi thẻ “a time when you…” có người khác trong chuyện",
        items: [
          "Dành ít nhất hai câu cho ==lý lẽ của phía bên kia==, nói cho tử tế (I could see why. · To be fair, …). Câu chuyện chỉ có một phía đúng thì nghe như than phiền.",
          "Ý cuối của thẻ (explain…) nói dài nhất và có ==cơ chế==: việc bạn làm có tác dụng VÌ SAO. Ở đây: ý kiến → bằng chứng; để người khác đề xuất.",
          "Kết bằng một câu về chính bạn ở thì hiện tại hoặc bằng “it taught me that…”. Không kết bằng That's all.",
          "Câu chuyện không cần bạn thắng. Bài mẫu mở bằng việc thua phiếu — và vì thế đáng tin.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Mổ Part 3 Đề 9 — năm câu, năm kiểu, năm cách mở" },
      {
        t: "table",
        head: ["Câu của đề (rút gọn)", "Kiểu", "Câu đầu nên làm gì", "Thân", "Lỗi hay gặp"],
        rows: [
          ["How do people in your country usually react when someone disagrees with them in public?", "**mô tả – khái quát**", "nói ngay là có khác nhau theo bối cảnh: It varies a good deal depending on…", "tách 2 bối cảnh (ở cơ quan ↔ giữa bạn bè, trên mạng) + một điểm chung", "vơ đũa: Vietnamese people always… · kể chuyện cá nhân dài"],
          ["Why do some people find it so hard to admit that they were wrong?", "**nguyên nhân**", "nêu nguyên nhân chính bằng một CƠ CHẾ", "nguyên nhân 2 ở tầng khác (cá nhân → xã hội) + một nhận xét ngược trực giác + giới hạn", "gọi tên mà không giải thích: Because of their ego."],
          ["To what extent should politicians be criticised for changing their position?", "**mức độ**", "nêu MỨC ĐỘ trong năm chữ đầu + điều kiện: Far less than…, although it does depend on…", "tách hai trường hợp theo MỘT tiêu chí → thừa nhận chỗ khó → đề xuất một phép thử", "trả lời yes / no; “It depends” rỗng"],
          ["What would happen if social media showed people only opinions different from their own?", "**giả định**", "phản ứng tức thì bằng would: At first, I think people would…", "hệ quả kế tiếp, thường NGƯỢC với kỳ vọng (I suspect… though) → điều kiện để nó khác đi", "dùng will; bỏ sót chữ only; trả lời “it would be good / bad” rồi hết"],
          ["Do you think it will become easier or harder to change people's minds in the future?", "**dự đoán**", "chọn hướng + độ chắc: Harder, I'd have thought, at least…", "tách: dễ hơn ở mặt nào, khó hơn ở mặt nào → vì sao mặt kia thắng", "will chắc nịch cho mọi thứ; không có lý do"],
        ],
        caption: "Đề 9 xếp năm câu theo độ khó tăng dần — giám khảo dừng ở câu bạn bắt đầu hụt, và đó là band của bạn",
      },
      {
        t: "table",
        head: ["Bước của câu “To what extent…?”", "Bài mẫu của đề nói (trích ngắn)", "Việc nó làm"],
        rows: [
          ["Mức độ + điều kiện", "“Far less than they usually are, in my view, although it does depend on what prompted the change.”", "trả lời xong câu hỏi ngay câu đầu; does nhấn mạnh báo sắp tách trường hợp"],
          ["Trường hợp 1", "“If the evidence has moved on… then changing course is exactly what we'd want…”", "đổi vì bằng chứng ⇒ không đáng chê"],
          ["Trường hợp 2", "“What does deserve criticism… is a change that follows the opinion polls rather than the facts”", "câu chẻ + does: đổi vì thăm dò ⇒ đáng chê"],
          ["Chỗ khó", "“The difficulty is that from the outside the two can look identical.”", "tự phản biện — dấu hiệu band 8"],
          ["Phép thử", "“So perhaps the fair test is whether they're willing to explain the change”", "kết bằng một tiêu chí dùng được, không lặp lại câu mở"],
        ],
        caption: "Khung năm bước: mức độ → trường hợp 1 → trường hợp 2 → chỗ khó → phép thử. Dùng lại cho mọi câu “To what extent / Should…?”",
      },
      {
        t: "dialogue",
        title: "Hai câu hỏi MỚI (mức độ · giả định) — band 7 rồi band 8",
        lines: [
          { who: "Examiner", role: "examiner", text: "To what extent should a team leader follow the opinion of the majority?", vi: "Trưởng nhóm nên theo ý kiến số đông tới mức nào?" },
          { who: "Candidate (band 7)", role: "a", text: "I think a leader should follow the majority in most cases, because it's fair and everyone feels respected. But sometimes the majority is wrong, so the leader should decide by himself. It depends on the situation.", vi: "Tôi nghĩ trưởng nhóm nên theo số đông trong hầu hết trường hợp, vì như vậy công bằng và ai cũng thấy được tôn trọng. Nhưng đôi khi số đông sai, nên trưởng nhóm phải tự quyết. Tuỳ tình huống. (có mức độ, có hai phía — nhưng không nói tình huống NÀO; “It depends” rỗng)" },
          { who: "Candidate (band 8)", role: "candidate", text: "Most of the time, I'd say, but not as a rule. If it's a decision the team will have to carry out themselves, how to split the work, say, then going with the majority makes sense, because people commit to what they've chosen. Where I think a leader has to be prepared to overrule them is when the cost of being wrong falls on someone outside the room, a client or a user. The awkward thing is that every leader who overrules a team believes it's that second kind of case. So maybe the real test is whether they can explain the decision afterwards in a way the team accepts, even if it doesn't agree.", vi: "Phần lớn trường hợp, tôi cho là vậy, nhưng không phải thành nguyên tắc. Nếu là quyết định mà chính nhóm phải thực hiện, chẳng hạn chia việc thế nào, thì theo số đông là hợp lý, vì người ta gắn bó với điều mình đã chọn. Chỗ tôi nghĩ trưởng nhóm phải sẵn sàng gạt ý họ là khi cái giá của việc sai rơi vào người ngoài phòng họp, một khách hàng hay người dùng. Cái khó là trưởng nhóm nào gạt ý nhóm cũng tin đó là trường hợp thứ hai. Nên có lẽ phép thử thật sự là sau đó họ có giải thích được quyết định theo cách nhóm chấp nhận hay không, dù nhóm không đồng ý." },
          { who: "Examiner", role: "examiner", text: "What would happen if every decision at work were put to a vote?", vi: "Chuyện gì sẽ xảy ra nếu mọi quyết định ở nơi làm việc đều đem ra bỏ phiếu?" },
          { who: "Candidate (band 7)", role: "a", text: "I think it will be more democratic and employees will be happier because they can give their opinion. But it will take a lot of time, so the company will work slowly. So I think it's not a good idea for every decision.", vi: "Tôi nghĩ sẽ dân chủ hơn và nhân viên vui hơn vì được nêu ý kiến. Nhưng sẽ mất nhiều thời gian nên công ty làm việc chậm. Nên tôi nghĩ không nên áp dụng cho mọi quyết định. (lỗi: will thay cho would ở câu giả định; hai hệ quả ai cũng nghĩ ra)" },
          { who: "Candidate (band 8)", role: "candidate", text: "In the short run, I think people would love it. You'd feel you had a say, for once. I suspect the novelty would wear off within a month, though, because most decisions at work are frankly boring, and nobody wants to vote on who supplies the printer paper. The more serious problem is that votes are good at choosing between options but hopeless at inventing them; someone still has to come up with the options. So you'd probably end up where you started, with a few people deciding. Only now they'd be deciding what goes on the ballot.", vi: "Trong ngắn hạn, tôi nghĩ mọi người sẽ rất thích. Bạn sẽ thấy cuối cùng mình cũng có tiếng nói. Nhưng tôi ngờ rằng cái mới lạ sẽ phai trong vòng một tháng, vì phần lớn quyết định ở chỗ làm thật ra rất chán, và không ai muốn bỏ phiếu chọn bên cung cấp giấy in. Vấn đề nghiêm trọng hơn là bỏ phiếu giỏi chọn giữa các phương án nhưng vô dụng trong việc nghĩ ra phương án; vẫn phải có ai đó đề xuất. Nên có lẽ bạn sẽ quay về chỗ cũ, vài người quyết định. Chỉ khác là giờ họ quyết định cái gì được đưa lên lá phiếu." },
        ],
      },
      {
        t: "note",
        title: "📌 Bài band 8 làm được gì mà band 7 không",
        items: [
          "**Câu mức độ**: mức độ trong bốn chữ đầu (Most of the time) + giới hạn ngay (but not as a rule) → MỘT tiêu chí tách hai trường hợp (ai chịu hậu quả) → chỗ khó (The awkward thing is…) → phép thử. Đúng khung năm bước của đề.",
          "**Câu giả định**: would / 'd suốt câu trả lời; hệ quả đầu (thích) → hệ quả ngược (chán sau một tháng) → vấn đề sâu hơn (bỏ phiếu không nghĩ ra phương án) → về chỗ cũ. Một ví dụ nhỏ, buồn cười, thấy được: giấy in.",
          "**Khung của Bài 1, bản nói**: in the short run · The more serious problem is… · good at X but hopeless at Y (song song) · the real test is whether….",
          "**Không có** Firstly, Secondly, In conclusion, I think × 4, It depends.",
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở Part 3 band 7 → 8",
        items: [
          "**will cho câu giả định.** What would happen if…? ⇒ would / might / 'd từ đầu tới cuối câu trả lời.",
          "**Trả lời ở mức cá nhân.** Part 3 hỏi về xã hội: people, employers, politicians. “In my family…” chỉ được làm ví dụ một câu.",
          "**Vơ đũa cả nắm về người Việt.** ~~Vietnamese people never disagree in public.~~ → People **tend to** avoid it **in formal settings**, though online it's a different story.",
          "**Đọc khung của bài viết.** “This stems largely from…” khi nói nghe như đọc. Dùng bản nói ở Bài 1 mục 8: A lot of that's down to….",
          "**Kết bằng lặp lại câu đầu.** Band 8 kết bằng một phép thử, một hệ quả, hoặc một giới hạn — thứ gì đó MỚI.",
        ],
      },
      { t: "rule", formula: "mô tả: It varies, depending on …   ·   nguyên nhân: The main reason is + cơ chế   ·   mức độ: [mức] + although it does depend on …   ·   giả định: At first … would …; I suspect …, though   ·   dự đoán: [hướng], I'd have thought, at least …", vi: "Năm cách mở cho năm kiểu câu hỏi Part 3. Nghe câu hỏi, nhận kiểu trong một giây, mở đúng khung." },

      /* ── 6 ── */
      { t: "h", text: "6. Phát âm: do / does / did nhấn mạnh và câu trích" },
      {
        t: "p",
        text: "Bài mẫu Part 3 của Đề 9 có hai chỗ trợ động từ được nhấn: “it **does** depend…” và “What **does** deserve criticism…”. Trong câu khẳng định bình thường không có do / does / did; khi nó xuất hiện, nó ==luôn được nhấn== và mang nghĩa “thật sự là có, trái với điều vừa nói”. Người Việt hay đọc lướt nó như trợ động từ thường — mất luôn nghĩa tương phản. Điều thứ hai: khi trích lời người khác (như câu hỏi của chị họ trong Part 2), giọng ==chậm lại và hạ xuống== một bậc.",
      },
      {
        t: "table",
        head: ["Hiện tượng", "Cách nói", "Ví dụ (CHỮ HOA = nhấn)"],
        rows: [
          ["do / does / did nhấn mạnh", "nhấn trợ động từ, nguyên âm đủ (/duː/ /dʌz/ /dɪd/), động từ chính nhẹ hơn", "it DOES depend · I DO think · we never DID get round to it"],
          ["Câu chẻ có does", "nhấn does; ngừng nhẹ trước is", "What DOES worry me | is the cost."],
          ["Câu trích trực tiếp", "ngừng trước câu trích; nói chậm hơn, thấp hơn; tách hai nhịp", "She asked me, | what do you ACtually want?"],
          ["Sau câu trích", "trở lại cao độ và tốc độ cũ", "…and I couldn't ANswer."],
        ],
      },
      {
        t: "phatam",
        id: "t5d10-phat-am",
        title: "Luyện phát âm — do / does / did nhấn mạnh; chậm và hạ giọng ở câu trích",
        note: "Bốn câu đầu: đẩy trợ động từ lên (CHỮ HOA trong phần dịch). Bốn câu sau: ngừng ở dấu |, nói phần trích chậm và thấp hơn.",
        items: [
          { text: "It does depend on who is asking.", ipa: "ɪt dʌz dɪpend ɒn huː ɪz ɑːskɪŋ", vi: "Nó thật sự còn tuỳ ai hỏi. (it DOES depend)" },
          { text: "I do think they have a point.", ipa: "aɪ duː θɪŋk ðeɪ hæv ə pɔɪnt", vi: "Tôi thật sự nghĩ họ có lý. (I DO think)" },
          { text: "We never did get round to it.", ipa: "wi nevə dɪd ɡet raʊnd tə ɪt", vi: "Rốt cuộc chúng tôi không bao giờ làm tới nó. (never DID)" },
          { text: "What does worry me is the cost.", ipa: "wɒt dʌz wʌri mi ɪz ðə kɒst", vi: "Điều thật sự làm tôi lo là chi phí. (What DOES worry me | is the COST)" },
          { text: "She asked me, what do you actually want?", ipa: "ʃi ɑːskt mi wɒt də ju æktʃuəli wɒnt", vi: "Chị ấy hỏi tôi: em thật sự muốn gì? (She asked me | chậm, thấp: what do you ACtually want)" },
          { text: "He said, I was wrong, and I'm sorry.", ipa: "hi sed aɪ wɒz rɒŋ ənd aɪm sɒri", vi: "Anh ấy nói: tôi đã sai, và tôi xin lỗi. (He said | I was WRONG | and I'm SOrry)" },
          { text: "My view was that a plain app that works beats a clever one that crashes.", ipa: "maɪ vjuː wɒz ðət ə pleɪn æp ðət wɜːks biːts ə klevə wʌn ðət kræʃɪz", vi: "Quan điểm của tôi là ứng dụng đơn giản mà chạy được thì hơn ứng dụng hay ho mà sập. (a PLAIN app that WORKS | a CLEVER one that CRASHes)" },
          { text: "It's not that I disagreed; I just wasn't convinced.", ipa: "ɪts nɒt ðət aɪ dɪsəɡriːd aɪ dʒʌst wɒznt kənvɪnst", vi: "Không phải tôi phản đối; chỉ là tôi chưa bị thuyết phục. (not that I disaGREED ↗ | I just wasn't conVINCED ↘)" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Bảng tự mổ Speaking — 12 câu hỏi có / không" },
      {
        t: "table",
        head: ["#", "Part", "Câu hỏi"],
        rows: [
          ["1", "1", "Câu “vì sao” của tôi có ít nhất một lý do kèm CƠ CHẾ (không chỉ gọi tên)?"],
          ["2", "1", "Có một hình ảnh người thật / việc thật trong 40 giây đó?"],
          ["3", "1", "Tôi kết bằng một câu đúc kết thay vì nhỏ giọng dần?"],
          ["4", "2", "Lập trường / tình huống ban đầu được nói bằng giọng chắc?"],
          ["5", "2", "Có ít nhất một câu trích trực tiếp hoặc một chi tiết thấy được?"],
          ["6", "2", "Ý “explain…” là ý dài nhất và nói về cơ chế?"],
          ["7", "2", "Có quá khứ hoàn thành cho điều xảy ra trước, và một câu kết ở hiện tại / it taught me…?"],
          ["8", "3", "Câu đầu của mỗi câu trả lời khớp KIỂU câu hỏi (mức độ → nêu mức; giả định → would)?"],
          ["9", "3", "Mỗi câu trả lời có một chỗ tôi tự phản biện (The difficulty is… · though)?"],
          ["10", "3", "Tôi kết bằng thứ gì đó mới (phép thử, hệ quả, giới hạn)?"],
          ["11", "cả bài", "Số chỗ ngừng vì tìm từ ≤ 2 mỗi 2 phút?"],
          ["12", "cả bài", "Mỗi cụm có một từ được nhấn; do / does / did nhấn mạnh được nhấn thật?"],
        ],
        caption: "10–12 “có” ≈ band 8 · 7–9 ≈ band 7–7.5 · ≤ 6: ghi âm lại từng Part, mỗi lần chỉ sửa MỘT dòng",
      },
      {
        t: "mcq",
        id: "t5d10-noi-chon",
        title: "Kiểm tra — mổ Speaking Đề 9 (6 câu)",
        items: [
          { q: "1. Giám khảo hỏi ở Part 1: “Why do you think some people never use their kitchens?” Câu mở nào đúng kiểu band 8?", options: ["I always cook at home because it's healthier.", "Nowadays, with the development of society, people are very busy.", "I think it's mostly that cooking for one person feels like more effort than it's worth.", "It depends on each person."], correct: 2, why: "Câu hỏi về người khác ⇒ một lý do chung có cơ chế. Phương án 1 trả lời về mình; 2 là câu mở bài viết; 4 rỗng." },
          { q: "2. Ở thẻ “persuaded someone to look at a decision differently”, câu nào nói CƠ CHẾ thuyết phục?", options: ["She changed her mind because I was right.", "I have more experience than her, so she listened to me.", "I didn't argue with her answer; I changed the question she was asking.", "After that, she chose the small company."], correct: 2, why: "Cơ chế = bạn đã LÀM gì khiến người kia nghĩ lại. Ba câu còn lại là kết quả hoặc lý do chung." },
          { q: "3. “What would happen if schools stopped giving marks?” — câu nào đúng ngữ pháp và đúng kiểu?", options: ["Students will be happier, but they will be lazy.", "At first, I think most students would be relieved; I suspect a fair number would stop revising, though.", "It is a good idea because marks cause stress.", "I think schools should not stop giving marks."], correct: 1, why: "Giả định ⇒ would; hệ quả đầu rồi hệ quả ngược. Phương án 1 dùng will; 3 và 4 trả lời câu hỏi khác (nên hay không nên)." },
          { q: "4. Trong “it DOES depend on what prompted the change”, does được nhấn để", options: ["cho đúng ngữ pháp ngôi thứ ba", "báo rằng câu trả lời vừa nêu có điều kiện, sắp tách trường hợp", "hỏi lại giám khảo", "tỏ ra lịch sự"], correct: 1, why: "do / does / did nhấn mạnh trong câu khẳng định = “thật sự là có” — đối lại vế vừa nói (Far less than they usually are)." },
          { q: "5. Khi tự mổ tiêu chí FC, bạn đếm", options: ["số từ vựng khó", "số lỗi chia động từ", "số chỗ ngừng giữa cụm từ vì tìm từ và số lần nói lại câu", "số từ sai trọng âm"], correct: 2, why: "FC = trôi chảy, mạch lạc. Từ khó thuộc LR; chia động từ thuộc GRA; trọng âm thuộc P." },
          { q: "6. Câu kết Part 3 nào ở mức band 8?", options: ["So that's my opinion.", "So, as I said, it depends on the situation.", "So perhaps the real test is whether the decision can be explained afterwards.", "That's all I want to say."], correct: 2, why: "Kết bằng một phép thử — thứ gì đó mới và dùng được." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện: ghi âm — chép lại — đếm — ghi lại",
        items: [
          "Part 1: sáu câu MỚI, hai chủ đề (Handwriting · Neighbours). Câu thứ ba của mỗi chủ đề là câu “vì sao / xu hướng” — dùng khung ở mục 2.",
          "Part 2: thẻ mới ở mục 4. Một phút ghi từ khoá, nói 2 phút. KHÔNG nói lại chuyện ứng dụng thời khoá biểu — kể chuyện của bạn (nhóm lớp, câu lạc bộ, gia đình, nhóm bạn đi du lịch).",
          "Part 3: năm câu MỚI, đúng năm kiểu của Đề 9 theo thứ tự. Trước mỗi câu, tự gọi tên kiểu rồi mới mở miệng.",
          "Sau khi AI chấm: chép lại MỘT câu trả lời theo mục 1 và đếm bốn thứ.",
        ],
      },
      {
        t: "speak",
        id: "t5d10-noi-p1",
        part: "1",
        questions: [
          "Do you often write by hand?",
          "Is your handwriting easy for other people to read?",
          "Why do you think some people still prefer to take notes on paper?",
          "How well do you know your neighbours?",
          "What makes someone a good neighbour?",
          "Do you think neighbours are becoming more or less important in people's lives?",
        ],
      },
      {
        t: "speak",
        id: "t5d10-noi-p2",
        part: "2",
        questions: [
          "Describe a time when you disagreed with a decision made by a group you belonged to. You should say: what the decision was; why the group made it; why you disagreed; and explain what you did about it.",
        ],
      },
      {
        t: "speak",
        id: "t5d10-noi-p3",
        part: "3",
        questions: [
          "How do groups of students or colleagues in your country usually make decisions?",
          "Why do groups sometimes make worse decisions than individuals would?",
          "To what extent should young employees be allowed to challenge their managers' decisions?",
          "What would happen if students could vote on everything they were taught?",
          "Do you think decisions at work will be made more by groups or more by individuals in the future?",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Kết quả bốn phép đếm của Speaking Đề 9 + MỘT động tác bạn sẽ thêm ở lần ghi âm tới.",
          "Năm cách mở cho năm kiểu câu hỏi Part 3 (ô công thức ở mục 5). Ngày 13 học Part 3 trừu tượng cấp cao; Ngày 22 mổ Speaking Đề 10 và so lại bốn con số.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 10 ═══════════════════════════ */
  {
    id: "t5d10-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 10 — Phrasebank nâng cao · register viết / nói · động từ thay đổi và mẫu động từ · hoà hợp chủ – vị · Discussion band 8 · mổ Speaking",
    goal: "Ôn trọn Ngày 10: dùng đúng khung của năm việc band 8, chọn đúng bản viết hay bản nói, không lẫn giới từ của động từ thay đổi và mẫu discourage from / encourage to, chia đúng động từ khi danh từ chính ở xa, nhận ra lời thuật mạnh – bản lề – lập trường tinh, và mở đúng khung cho từng kiểu câu hỏi Part 3.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "43 câu, khoảng 45 phút. Mục tiêu band 8: **≥ 38/43**.",
          "Phần I–II ôn Bài 1; phần III–VI ôn Bài 2; phần VII ôn Bài 3. Phần VIII (viết) và IX (nói) do AI chấm.",
          "Hôm nay khép phần mổ **Đề 9**. Việc cuối: ghi vào sổ ba điều bạn sẽ làm khác ở **Đề 10** (Ngày 16).",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 10 trong một hình",
        center: "Mổ Đề 9 ②",
        branches: [
          { label: "Phrasebank band 8", items: ["phạm vi", "phê bình", "bản lề", "nhân quả đúng mức", "cân · xếp hạng"] },
          { label: "Writing Đề 9", items: ["overview = đổi chức năng", "give way to · make way for", "chuỗi hệ quả", "xếp hạng giải pháp"] },
          { label: "Discussion band 8", items: ["thuật mạnh nhất", "bản lề", "lập trường tinh"] },
          { label: "Speaking Đề 9", items: ["đếm 4 thứ", "Part 2: cơ chế", "Part 3: 5 cách mở", "DOES nhấn mạnh"] },
        ],
      },

      { t: "h", text: "I. Phrasebank nâng cao — điền MỘT từ (10 câu) — ôn Bài 1 mục 1–7" },
      {
        t: "quiz",
        id: "t5d10-bt-khung",
        kind: "fill",
        title: "I. Điền MỘT từ",
        items: [
          { q: "The scheme has worked, at least in the short ___.", answers: ["term", "run"], hint: "at least in the short term." },
          { q: "This argument takes no ___ of the people who cannot afford a car.", answers: ["account"], hint: "take no account of = overlook." },
          { q: "The danger is real, but it is easily ___. (nói quá)", answers: ["overstated", "exaggerated"], hint: "overstate." },
          { q: "The whole debate ___ on what we mean by a fair wage.", answers: ["turns", "hinges", "depends"], hint: "turn on / hinge on." },
          { q: "The survey recorded what people earn, as opposed ___ what they own.", answers: ["to"], hint: "as opposed to." },
          { q: "Most of the delays ___ from a shortage of drivers.", answers: ["stem", "stemmed", "result", "resulted", "arise", "arose"], hint: "stem from / result from." },
          { q: "Closing the only bank in the village would have a knock-on ___ on its shops.", answers: ["effect"], hint: "a knock-on effect on." },
          { q: "Of the two proposals, the ___ is cheaper, but the former would last longer. (cái nêu sau)", answers: ["latter"], hint: "the former ↔ the latter." },
          { q: "The first objection is minor; the second carries far more ___.", answers: ["weight"], hint: "carry weight." },
          { q: "City schools are well equipped. The same cannot be ___ of those in the mountains.", answers: ["said"], hint: "The same cannot be said of." },
        ],
      },

      { t: "h", text: "II. Viết hay nói? (6 câu) — ôn Bài 1 mục 8" },
      {
        t: "mcq",
        id: "t5d10-bt-register",
        title: "II. Chọn câu hợp tình huống",
        items: [
          { q: "1. Part 3 — nói rằng điều gì đó chủ yếu do thói quen.", options: ["This is largely attributable to habit.", "I think a lot of it's just down to habit.", "Habit underlies this phenomenon.", "This stems from habitual behaviour."], correct: 1, why: "a lot of it's down to… — bản nói." },
          { q: "2. Task 2 — nói rằng một quan điểm coi điều gì là hiển nhiên.", options: ["They just assume everyone's got time.", "This view takes it for granted that every parent has time to help.", "Obviously not everyone has time, right?", "People who say this don't think."], correct: 1, why: "Chủ ngữ là quan điểm + takes it for granted that." },
          { q: "3. Part 3 — giới hạn phạm vi.", options: ["With the possible exception of the elderly, this holds.", "That's probably true for most people — maybe not the older generation, though.", "Where the elderly are concerned, the reverse is the case.", "This does not hold for the elderly."], correct: 1, why: "Bản nói: maybe not…, though." },
          { q: "4. Task 2 — làm nặng thêm một vấn đề.", options: ["That would just make things worse.", "It will make the problem more bad.", "Such a measure would only exacerbate the shortage.", "It makes the shortage very serious, you know."], correct: 2, why: "exacerbate + thứ xấu đã có — bản viết." },
          { q: "5. Part 3 — gọi tên bản lề.", options: ["What is at issue is the definition of privacy.", "The dispute turns on what is meant by privacy.", "I think it really comes down to what you count as private.", "Much depends on the definition."], correct: 2, why: "It comes down to… — bản nói của turn on." },
          { q: "6. Task 2 — nối sang một nhóm không đúng với nhận định vừa nêu.", options: ["But for small firms, no way.", "The same cannot be said of small firms.", "Small firms, though? Not really.", "However the small firms are not same."], correct: 1, why: "Khung lặng của văn viết." },
        ],
      },

      { t: "h", text: "III. Động từ thay đổi và mẫu động từ (6 câu) — ôn Bài 2 mục A3 · A5" },
      {
        t: "quiz",
        id: "t5d10-bt-gioi-tu",
        kind: "fill",
        title: "III. Điền MỘT giới từ hoặc gõ dạng đúng của động từ trong ngoặc",
        items: [
          { q: "The old cinema has been converted ___ flats.", answers: ["into"], hint: "convert into." },
          { q: "The allotments behind the station have given way ___ a car park.", answers: ["to"], hint: "give way to." },
          { q: "Three terraced houses were knocked down to make way ___ the new road.", answers: ["for"], hint: "make way for." },
          { q: "The cost of childcare deters many parents (return) ___ to work.", answers: ["from returning"], hint: "deter sb from + V-ing." },
          { q: "Flexible hours would enable more carers (stay) ___ in employment.", answers: ["to stay"], hint: "enable sb to + V." },
          { q: "The report recommends (raise) ___ the school-leaving age.", answers: ["raising"], hint: "recommend + V-ing." },
        ],
      },

      { t: "h", text: "IV. Hoà hợp chủ – vị khi danh từ chính ở xa (5 câu) — ôn Bài 2 mục A5" },
      {
        t: "quiz",
        id: "t5d10-bt-sva",
        kind: "fill",
        title: "IV. Chia động từ trong ngoặc (hiện tại)",
        items: [
          { q: "The quality of the roads in these districts (have) ___ improved.", answers: ["has"], hint: "Danh từ chính: The quality." },
          { q: "A shortage of nurses and midwives (mean) ___ longer waits for everyone.", answers: ["means"], hint: "Danh từ chính: A shortage." },
          { q: "The reasons behind this decline (be) ___ not hard to find.", answers: ["are"], hint: "Danh từ chính: The reasons (số nhiều)." },
          { q: "The number of students taking physics (be) ___ falling.", answers: ["is"], hint: "The number of… + số ít." },
          { q: "Neither the teachers nor the head (know) ___ when the inspection will take place.", answers: ["knows"], hint: "neither… nor…: động từ theo danh từ GẦN nhất (the head)." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 · Bài 2" },
      {
        t: "quiz",
        id: "t5d10-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng khung trong gợi ý",
        items: [
          { q: "Quan điểm này đúng với các thành phố lớn nhưng chưa chắc đúng với vùng nông thôn.", answers: ["This view holds for large cities but not necessarily for rural areas.", "This view holds for big cities but not necessarily for rural areas.", "This view holds true for large cities but not necessarily for rural areas.", "This view holds for large cities, but not necessarily for rural areas."], hint: "hold for… but not necessarily for…" },
          { q: "Điều đang tranh cãi không phải là có nên đánh thuế hay không mà là đánh bao nhiêu.", answers: ["What is at issue is not whether to tax but how much.", "What is at issue is not whether to tax it but how much.", "What is at issue is not whether to tax but how heavily."], hint: "What is at issue is not whether… but how much" },
          { q: "Lý lẽ ủng hộ lệnh cấm mạnh nhất khi ta nghĩ tới trẻ nhỏ.", answers: ["The case for a ban is strongest when we consider young children.", "The case for the ban is strongest when we consider young children.", "The case for a ban is strongest when we think of young children.", "The case for a ban is strongest when we consider small children."], hint: "The case for… is strongest when…" },
          { q: "Phí cao ngăn nhiều sinh viên nộp đơn.", answers: ["High fees deter many students from applying.", "High fees discourage many students from applying.", "High fees prevent many students from applying.", "High fees stop many students from applying."], hint: "deter / discourage sb from + V-ing" },
          { q: "Trong hai giải pháp, giải pháp đầu có tác dụng nhanh hơn, dù chính giải pháp sau mới bền.", answers: ["Of the two measures, the former would work faster, although it is the latter that would last.", "Of the two solutions, the former would work faster, although it is the latter that would last.", "Of the two measures, the former works faster, although it is the latter that lasts.", "Of the two solutions, the former works faster, although it is the latter that lasts.", "Of the two measures, the first would work faster, although it is the second that would last."], hint: "Of the two…, the former…, although it is the latter that…" },
        ],
      },

      { t: "h", text: "VI. Discussion band 8 — nhận diện (6 câu) — ôn Bài 2 mục B2–B8" },
      {
        t: "mcq",
        id: "t5d10-bt-viet",
        title: "VI. Chọn phương án đúng",
        items: [
          { q: "1. Đề: nghiên cứu khoa học nên do nhà nước hay công ty tư nhân chi tiền? Câu nào thuật bên “công ty tư nhân” ở dạng mạnh nhất?", options: ["Companies have a lot of money, so they can do research.", "Companies only care about profit, but some people support them.", "The case for private funding is strongest where a discovery is close to the market: a firm that must sell what it invents has every reason to finish the job.", "Private companies are better than governments at everything."], correct: 2, why: "Nói khi nào lý lẽ mạnh nhất + cơ chế (phải bán được thì có động lực làm tới nơi)." },
          { q: "2. Với đề trên, câu nào là bản lề?", options: ["Both ways of funding have pros and cons.", "The answer differs according to whether research is judged by what it yields in five years or in fifty.", "Research is very important for every country.", "I partly agree with both sides."], correct: 1, why: "Thước đo: năm năm hay năm mươi năm." },
          { q: "3. Khuôn lập trường nào là “tách theo thời gian”?", options: ["If the question is A, …; if it is B, …", "In the short term, …; in the long term, …", "Individuals should…, while governments ought to…", "A holds within…, but not…"], correct: 1, why: "Bài 2 mục B4, khuôn thứ ba." },
          { q: "4. Trong bài mẫu band 8, cụm “are not denying any of this” có tác dụng gì?", options: ["Nêu ví dụ.", "Kết luận bài.", "Chặn trước lời bác dễ dãi và nối thân 2 vào thân 1.", "Giới thiệu đề."], correct: 2, why: "Vừa là lời thuật mạnh (bên B không phủ nhận nỗ lực) vừa là liên kết lặng (any of this chỉ cả đoạn trước)." },
          { q: "5. Câu nào mắc lỗi song song của Ngày 9?", options: ["The dispute turns less on facts than on definitions.", "The two views differ less in principle than in timing.", "The debate turns less on whether to act than how quickly.", "What is at issue is not the aim but the cost."], correct: 2, why: "less on whether… than ON how quickly — thiếu on ở vế hai." },
          { q: "6. Kết bài nào KHÔNG đạt band 8?", options: ["Basic research, then, needs public money; applied research rarely does.", "In the short term, firms deliver sooner; in the long term, only the state will pay for questions that have no buyer.", "In conclusion, both the government and companies are important, and they should cooperate.", "Who pays should depend on how far a discovery is from the market."], correct: 2, why: "“Both are important and should cooperate” đúng với mọi đề — không nói ai làm gì, khi nào." },
        ],
      },

      { t: "h", text: "VII. Mổ Speaking (5 câu) — ôn Bài 3 mục 2 · 3 · 5 · 6" },
      {
        t: "mcq",
        id: "t5d10-bt-noi",
        title: "VII. Chọn phương án đúng",
        items: [
          { q: "1. “Do you think neighbours are becoming more or less important?” — câu mở nào tách được cái giảm và cái tăng?", options: ["Less important, because people are busy.", "As neighbours, less, I'd say — but I think people rely more than ever on whoever happens to live nearby when something goes wrong.", "It depends on the neighbour.", "Neighbours are very important in Vietnamese culture."], correct: 1, why: "Giảm ở một mặt (quan hệ hàng xóm thường ngày), tăng ở mặt khác (lúc có sự cố)." },
          { q: "2. Kiểu câu hỏi của “Why do groups sometimes make worse decisions than individuals would?” là", options: ["mô tả", "nguyên nhân", "mức độ", "giả định"], correct: 1, why: "Why… ⇒ nguyên nhân: mở bằng cơ chế chính." },
          { q: "3. Câu mở nào hợp với “To what extent should young employees be allowed to challenge their managers?”", options: ["Yes, they should.", "Young employees are very creative nowadays.", "A good deal more than they usually are, I'd say, although it does depend on how they go about it.", "In my company, I never challenge my manager."], correct: 2, why: "Mức độ ngay câu đầu + điều kiện với does nhấn mạnh." },
          { q: "4. Trong thẻ “disagreed with a group's decision”, vì sao bài mẫu dành hai câu cho lý lẽ của nhóm?", options: ["Để đủ hai phút.", "Vì thẻ có ý “why the group made it”, và thuật phía kia cho tử tế làm câu chuyện đáng tin.", "Để dùng thì hiện tại hoàn thành.", "Vì giám khảo thích chuyện dài."], correct: 1, why: "Cùng động tác “thuật ở dạng mạnh nhất” của Bài 2." },
          { q: "5. Chỗ ngừng nào KHÔNG bị tính là lỗi FC?", options: ["I think the… um… the… how to say… the reason is…", "It was very… very… convenient.", "That's a harder question than it sounds. I suppose the honest answer is…", "Because of… because… the people they…"], correct: 2, why: "Ngừng ở ranh giới ý, lấp bằng câu có nghĩa (Ngày 2). Ba câu kia ngừng giữa cụm vì tìm từ." },
        ],
      },

      { t: "h", text: "VIII. Viết đoạn lập trường (110–140 từ) — AI chấm" },
      {
        t: "p",
        text: "Đề: “Some people think that scientific research should be funded and directed by governments. Others believe that private companies should take the lead. Discuss both views and give your own opinion.” Viết **chỉ đoạn cuối** — đoạn nêu bản lề và lập trường của bạn. Bắt buộc: (1) một câu gọi tên bản lề; (2) một trong bốn khuôn lập trường ở Bài 2 mục B4; (3) một cặp song song nối bằng chấm phẩy; (4) không có Both views are important.",
      },
      {
        t: "essay",
        id: "t5d10-bt-viet-doan",
        task: "Task 2",
        prompt: "Topic: Some people think that scientific research should be funded and directed by governments. Others believe that private companies should take the lead. Write ONLY the final paragraph (110–140 words), which states what the disagreement really turns on and gives your own position. Include: one sentence naming the hinge of the dispute; a refined position (each side is right under a named condition); one pair of parallel clauses joined by a semicolon. Do not write 'both views are important'.",
        minWords: 110,
        tips: [
          "Bản lề gợi ý: thước đo (năm năm hay năm mươi năm) hoặc loại nghiên cứu (cơ bản ↔ ứng dụng).",
          "Khuôn: In the short term, …; in the long term, … / If the question is…, A; if it is…, B.",
          "Soát: less… than… song song; không quá một từ nối đầu câu.",
        ],
      },
      {
        t: "note",
        title: "📌 Một đoạn mẫu để so sau khi đã viết (band 8, ước tính) — 5 câu, 5 câu sạch",
        items: [
          "It seems to me that the two sides differ less about who is better at research than about what research is for. Where a discovery is within sight of the market, companies have both the money and the motive to pursue it, and public funds would merely replace what they would have spent anyway. Where no buyer can yet be imagined, as with most work in pure mathematics or the study of rare diseases, the reverse is true: left to firms, such questions would simply not be asked. Governments should therefore pay for what nobody can sell; companies should be left to develop what somebody can. A country that confuses the two will either waste its taxes or neglect its future.",
          "Soi: bản lề (differ less about A than about B — song song) · hai điều kiện gọi tên được (Where… / Where…) · the reverse is true (liên kết lặng) · cặp song song nối bằng chấm phẩy (Governments should… ; companies should…) · either… or… ở câu cuối.",
        ],
      },

      { t: "h", text: "IX. Nói 4 câu Part 3 — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi câu 40–60 giây. Trước khi ghi âm, gọi tên kiểu câu hỏi và nhẩm câu mở (Bài 3 mục 5). Sau khi ghi, đếm chỗ ngừng vì tìm từ.",
      },
      {
        t: "speak",
        id: "t5d10-bt-noi-p3",
        part: "3",
        questions: [
          "How do families in your country usually deal with disagreements between generations?",
          "Why do people often go along with a group even when they privately disagree?",
          "To what extent is it a good thing for children to argue with their parents?",
          "What would happen if nobody ever disagreed with their boss?",
        ],
      },
      {
        t: "note",
        title: "📌 Khép Đề 9 — ba dòng cho Đề 10",
        items: [
          "Viết vào trang cuối sổ lỗi Đề 9: **một** việc sẽ làm khác ở Reading / Listening (từ Ngày 9), **một** việc ở Writing, **một** việc ở Speaking.",
          "Ví dụ: “R: không chọn YES khi chỉ thấy từ trùng · W: mỗi giải pháp có chủ ngữ cụ thể + một câu xếp hạng · S: câu mức độ nêu mức trong năm chữ đầu.”",
          "Đọc lại ba dòng này sáng Ngày 16, trước khi làm Đề 10.",
        ],
      },
    ],
  },
];
