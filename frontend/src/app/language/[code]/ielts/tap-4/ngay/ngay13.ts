/**
 * IELTS Tập 4 — Ngày 13 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Hedging (rào đón) 4 nhóm công cụ + modal suy đoán có have + impersonal passive (It is thought that… /
 *                     X is thought to…) + cohesion nâng cao: referencing (this + danh từ tóm tắt, such, the former / the latter,
 *                     respectively, that / those of), substitution (one, do so, so / not), ellipsis             [G39 G40]
 *                     — ôn G03 (đại từ, it, one — Tập 1 Ngày 3, Tập 2 Ngày 13) · G28 (modal suy đoán — Tập 3 Ngày 19)
 *                     — nối Tập 4 Ngày 7 (thang chắc chắn khi NÓI) · Ngày 12 (this / such trong bài Viết)
 *   Bài 2 (reading)   Reading đủ 3 passage · 40 câu · 60 phút — lần 1 của Tập 4 (≈ 2.500 từ, 8 dạng câu hỏi)      [R20]
 *                     — nối Tập 2 Ngày 24, Tập 3 Ngày 27 · 29 (nhịp 17 – 20 – 23), Tập 4 Ngày 1 (bố cục Passage 3)
 *   Bài 3 (listening) Part 4 — bài giảng 7 phút, Table completion + Summary completion, câu 31–40, giọng Úc     [L06 L08 L10]
 *                     — nối Tập 2 Ngày 5 (Table), Tập 3 Ngày 24 (Summary + Table), Tập 4 Ngày 8 (Note + Sentence)
 *                     🔊 âm cuối trong chuỗi từ
 *   Bài tập Ngày 13   44 câu có đáp án + 1 đoạn viết
 * Mọi id bắt đầu `t4d13-`.
 */
import type { Lesson } from '../data';

export const NGAY_13: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t4d13-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Rào đón (hedging), bị động vô nhân xưng và liên kết nâng cao — referencing, substitution, ellipsis",
    goal: "Viết được câu học thuật “nói đúng mức mình chứng minh được”: rào đón bằng bốn nhóm công cụ (may / tend to / appear to · arguably / largely · It is likely that… · to some extent), dùng đúng hai khuôn bị động vô nhân xưng (It is believed that… · X is believed to have…), và nối câu không lặp từ bằng this + danh từ tóm tắt, such, the former / the latter, one, do so và lược bỏ — đúng yêu cầu TR, CC và GRA band 7 của Writing Task 2.",
    minutes: 105,
    blocks: [
      {
        t: "recap",
        items: [
          "**Hedging** (rào đón) = nói một nhận định ==đúng mức chắc chắn mà mình có bằng chứng==. Band 7 TR còn bị ghi “ý đôi chỗ **khái quát quá**” — rào đón là cách chữa trực tiếp lỗi này.",
          "Bốn nhóm công cụ: **động từ** (may, tend to, appear to) · **trạng từ** (arguably, largely, presumably) · **khuôn It…** (It is likely that…) · **cụm giới hạn phạm vi** (to some extent, in most cases).",
          "**Bị động vô nhân xưng** (impersonal passive): **It is widely believed that** S + V… / **S is believed to** V… — thuật ý kiến chung mà không cần “people say”.",
          "**Referencing** (quy chiếu): this + ==danh từ tóm tắt==, such + N, the former / the latter, respectively, that / those of.",
          "**Substitution** (thay thế): one / ones, do so, so / not. **Ellipsis** (lược bỏ): bỏ phần lặp sau and / but / than và sau trợ động từ.",
          "Ngày 7 (Nói) bạn đã học thang chắc chắn để **nói** dự đoán; Ngày 12 (Viết · mục 3–4) đã dùng this / such + danh từ tóm, the former / the latter, one, do so để nối câu. Hôm nay: rào đón và vô nhân xưng cho ==văn viết==, ôn nhanh quy chiếu của Ngày 12 rồi học phần MỚI — respectively, that of, so / not, if so, lược bỏ — và soát lỗi tinh.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao câu “quá chắc” lại mất điểm — và rào đón là gì" },
      {
        t: "p",
        text: "Người học ở band 6 hay viết: ~~Social media makes teenagers depressed.~~ Câu này đúng ngữ pháp nhưng **sai về lập luận**: nó nói về ==mọi== thiếu niên, ==luôn luôn==, như một sự thật đã chứng minh. Giám khảo gọi đó là “over-generalise” (khái quát quá mức). Mô tả band 7 TR vẫn ghi “có thể có xu hướng khái quát quá” — nghĩa là lỗi này không đánh tụt bạn xuống 6, nhưng nó ==chặn đường lên 8== và, khi cả bài toàn câu tuyệt đối không có chống đỡ, ý “không được phát triển đủ” kéo TR về 6. Người viết band 7 viết: **Heavy use of social media appears to be linked to low mood in some teenagers.** Vẫn là ý đó, nhưng bốn chỗ đã được chỉnh cho ==vừa với bằng chứng==.",
      },
      {
        t: "table",
        head: ["Chỗ chỉnh", "Câu band 6", "Câu band 7", "Tác dụng"],
        rows: [
          ["Phạm vi chủ ngữ", "Social media", "**Heavy use of** social media", "chỉ nói về dùng nhiều, không phải mọi kiểu dùng"],
          ["Động từ", "makes", "**appears to be linked to**", "quan hệ có vẻ có, chưa khẳng định là nguyên nhân"],
          ["Kết quả", "depressed", "**low mood**", "mức nhẹ hơn, đúng với điều quan sát được"],
          ["Đối tượng", "teenagers", "**some** teenagers", "không phải tất cả"],
        ],
        caption: "Rào đón không phải là “viết cho yếu đi”. Nó là viết cho chính xác.",
      },
      {
        t: "note",
        title: "Cẩn thận: rào đón KHÔNG dùng cho ý kiến của chính bạn ở thesis",
        items: [
          "Thesis (câu luận điểm) phải **rõ**: I believe that the benefits outweigh the drawbacks. Đừng viết ~~I think maybe the benefits might possibly outweigh…~~ — band 7 đòi “ý kiến rõ suốt bài”.",
          "Rào đón dùng cho **nhận định về thế giới** (nguyên nhân, hệ quả, xu hướng, dự đoán) — những điều bạn không thể chứng minh trong 250 từ.",
          "Quy tắc nhớ: ==lập trường thì chắc, dữ kiện thì dè dặt==.",
        ],
      },
      {
        t: "quiz",
        id: "t4d13-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 3 Ngày 19 (modal suy đoán) và đại từ (6 câu)",
        items: [
          { q: "1. The streets are wet. It ___ have rained during the night. (chắc chắn — gõ 1 từ)", answers: ["must"], hint: "must have + V3: suy đoán chắc chắn về quá khứ" },
          { q: "2. She ___ have missed the train — she left an hour early. (chắc chắn KHÔNG — gõ 1 từ)", answers: ["can't", "cannot", "couldn't"], hint: "can't have + V3" },
          { q: "3. The data ___ have been entered incorrectly; we are not sure. (có thể — gõ 1 từ)", answers: ["may", "might", "could"], hint: "may / might / could have + V3" },
          { q: "4. ___ is difficult to predict how the market will react. (chủ ngữ giả — 1 từ)", answers: ["It"], hint: "it chủ ngữ giả" },
          { q: "5. This laptop is too slow. I need a faster ___. (1 từ thay cho laptop)", answers: ["one"], hint: "one thay danh từ đếm được số ít" },
          { q: "6. Prices rose sharply. ___ forced many families to cut their spending. (1 từ chỉ lại cả câu trước)", answers: ["This"], hint: "this chỉ lại cả ý vừa nêu" },
        ],
      },
      { t: "rule", formula: "nhận định về thế giới = phạm vi vừa đủ + động từ dè dặt + đối tượng không tuyệt đối", vi: "Lập trường của bạn thì viết chắc; nguyên nhân, hệ quả, xu hướng thì viết đúng mức bằng chứng." },

      /* ── 2 ── */
      { t: "h", text: "2. Công cụ 1 — động từ rào đón: may / might / could · tend to · appear to / seem to" },
      {
        t: "p",
        text: "Đây là nhóm dùng nhiều nhất. **may / might / could** = có khả năng. **can** = đôi khi xảy ra (khả năng chung, không phải dự đoán). **tend to + V** = thường có xu hướng. **appear to / seem to + V** = có vẻ, theo những gì quan sát được. **suggest / indicate (that)** = (số liệu, nghiên cứu) cho thấy, gợi ý rằng — nhẹ hơn **prove / show**.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + may / might / could + V", vi: "Có thể (xảy ra, là đúng). might hơi yếu hơn may.", examples: [{ en: "Raising fuel taxes may encourage some drivers to switch to public transport.", vi: "Tăng thuế nhiên liệu có thể khuyến khích một số tài xế chuyển sang phương tiện công cộng." }, { en: "Such a policy could prove unpopular with rural voters.", vi: "Chính sách như vậy có thể không được cử tri nông thôn ủng hộ." }] },
          { formula: "S + can + V", vi: "Đôi khi / về nguyên tắc có thể — nói khả năng chung.", examples: [{ en: "Working from home can lead to a sense of isolation.", vi: "Làm việc ở nhà có thể dẫn tới cảm giác cô lập." }] },
          { formula: "S + tend to + V  ·  There is a tendency for + N + to V", vi: "Thường có xu hướng — thay cho always / usually.", examples: [{ en: "Children who read for pleasure tend to perform better at school.", vi: "Trẻ đọc sách vì thích thường học tốt hơn ở trường." }, { en: "There is a tendency for young graduates to move to large cities.", vi: "Sinh viên mới ra trường có xu hướng chuyển tới thành phố lớn." }] },
          { formula: "S + appear to / seem to + V  ·  It appears / seems that + S + V", vi: "Có vẻ như — dựa trên quan sát.", examples: [{ en: "Remote working appears to have little effect on productivity.", vi: "Làm việc từ xa có vẻ ít ảnh hưởng tới năng suất." }, { en: "It seems that consumers are becoming more price-sensitive.", vi: "Có vẻ như người tiêu dùng đang nhạy cảm hơn về giá." }] },
          { formula: "S (evidence / research / figures) + suggest / indicate + that + S + V", vi: "Bằng chứng cho thấy — không dùng prove trừ khi thật sự đã chứng minh.", examples: [{ en: "Recent surveys suggest that most employees would prefer a shorter working week.", vi: "Các khảo sát gần đây cho thấy phần lớn nhân viên thích tuần làm việc ngắn hơn." }] },
          { formula: "S + may / might / could / must + have + V3", vi: "Suy đoán về QUÁ KHỨ (ôn Tập 3 Ngày 19).", examples: [{ en: "The decline in sales may have been caused by the unusually cold summer.", vi: "Doanh số giảm có thể là do mùa hè lạnh bất thường." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai",
        items: [
          "~~This maybe the main reason.~~ → This **may be** the main reason. (**maybe** viết liền là trạng từ, đứng đầu câu, và là từ của văn nói; **may be** là động từ.)",
          "~~People tend spending more.~~ / ~~tend to spending~~ → People **tend to spend** more. (tend **to + V nguyên mẫu**)",
          "~~It seems the government to ignore…~~ → **It seems that** the government ignores… HOẶC The government **seems to** ignore…",
          "~~Technology can replace all teachers in 2050.~~ — dự đoán một sự kiện cụ thể thì dùng **may / might / could**, không dùng can. (can = khả năng chung: Technology can be distracting.)",
          "~~The figures prove that…~~ trong bài luận 250 từ gần như luôn là nói quá → **suggest / indicate that…**",
          "Phủ định: **may not** = có thể không; **cannot / could not** = không thể. ~~It could not be true~~ (= chắc chắn sai) khác **It may not be true** (= có thể sai).",
        ],
      },
      { t: "rule", formula: "S + may / might / could + V  ·  S + tend to + V  ·  S + appear to / seem to + V", vi: "Ba khuôn động từ rào đón dùng nhiều nhất trong Task 2. Sau to luôn là V nguyên mẫu." },
      {
        t: "quiz",
        id: "t4d13-dong-tu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — động từ rào đón (5 câu)",
        grammar: "S + may / might / could + V · S + tend to + V · S + appear to + V · … suggest that …",
        items: [
          { q: "1. Người trẻ thường có xu hướng tiêu nhiều hơn số họ kiếm được.", answers: ["Young people tend to spend more than they earn.", "Young people tend to spend more money than they earn."], hint: "tend to · spend · earn" },
          { q: "2. Lệnh cấm có vẻ đã làm giảm tiếng ồn ở trung tâm thành phố.", answers: ["The ban appears to have reduced noise in the city centre.", "The ban seems to have reduced noise in the city centre.", "The ban appears to have reduced noise in the city center.", "The ban seems to have reduced noise in the city center."], hint: "appear to have + V3 · ban · reduce" },
          { q: "3. Đây có thể là lý do chính khiến sinh viên bỏ học.", answers: ["This may be the main reason why students drop out.", "This may be the main reason students drop out.", "This might be the main reason why students drop out.", "This could be the main reason why students drop out."], hint: "may be (hai từ) · drop out" },
          { q: "4. Nghiên cứu cho thấy giấc ngủ ảnh hưởng tới trí nhớ.", answers: ["Research suggests that sleep affects memory.", "Research indicates that sleep affects memory.", "Research suggests sleep affects memory."], hint: "Research suggests that · affect" },
          { q: "5. Vụ tai nạn có thể đã do lỗi con người gây ra.", answers: ["The accident may have been caused by human error.", "The accident might have been caused by human error.", "The accident could have been caused by human error."], hint: "may have been + V3 · human error" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Công cụ 2 · 3 · 4 — trạng từ, khuôn It…, và cụm giới hạn phạm vi" },
      {
        t: "table",
        head: ["Nhóm", "Từ / cụm", "Ví dụ"],
        rows: [
          ["Trạng từ độ chắc", "**probably · possibly · presumably · arguably · apparently**", "This is **arguably** the most serious challenge facing cities today. (= có thể lập luận rằng)"],
          ["Trạng từ phạm vi", "**largely · mainly · generally · typically · relatively · partly**", "The decline is **largely** the result of automation."],
          ["Khuôn It…", "**It is likely / unlikely / possible / probable that…** · **It could be argued that…**", "**It is unlikely that** fines alone will change behaviour."],
          ["S + be likely to", "**be likely / unlikely / bound to + V**", "Rents **are likely to** continue rising."],
          ["Giới hạn mức độ", "**to some extent · to a certain degree · up to a point · in part**", "The criticism is justified **to some extent**."],
          ["Giới hạn trường hợp", "**in most cases · in many respects · as a rule · on the whole · under certain conditions**", "**In most cases**, the benefits appear within a year."],
          ["Giới hạn số lượng", "**some · many · most · a minority of · the majority of** (thay cho all / every)", "**Most** employers value experience over qualifications."],
          ["Danh từ dè dặt", "**a possibility · a tendency · a likelihood · an indication**", "There is **a real possibility that** the scheme will fail."],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ba mức của cùng một nhận định",
        cols: [
          { title: "Quá chắc (band 6)", items: ["Advertising **makes** children unhealthy.", "**All** students cheat when they can.", "This **will** destroy local shops."] },
          { title: "Vừa đủ (band 7)", items: ["Advertising **may contribute to** unhealthy eating among children.", "**Some** students **are likely to** cheat if the risk is low.", "This **could well** damage **many** local shops."] },
          { title: "Rào quá tay (cũng mất điểm)", items: ["It **might perhaps possibly** be that advertising **could maybe** affect…", "It **seems** that it **may** be **possible** that some…", "Người đọc không còn biết bạn nghĩ gì"] },
        ],
        caption: "Mỗi nhận định ==một lớp rào== là đủ; nhiều nhất là hai (một ở chủ ngữ, một ở động từ).",
      },
      {
        t: "note",
        title: "⚠️ Lỗi tinh ở band 6.5",
        items: [
          "**arguably** không có nghĩa “gây tranh cãi” — nghĩa là “có đủ lý lẽ để nói rằng”. Arguably the best = có thể nói là tốt nhất.",
          "**apparently** = “nghe nói / theo những gì thấy được” (chưa chắc đúng), không phải “rõ ràng” (= clearly, obviously).",
          "~~It is likely to rain~~ đúng; nhưng ~~It is possible to rain~~ sai → **It is possible that it will rain** / It **may** rain. (possible không đi với to V theo nghĩa “có khả năng xảy ra”.)",
          "~~Most of people~~ → **Most people** / **Most of the** people (in the survey). ~~The most people~~ sai nghĩa.",
          "Đừng trộn rào đón với từ tuyệt đối trong cùng câu: ~~It may always be the case that everyone…~~",
          "**Booster** (từ tăng độ chắc: clearly, undoubtedly, certainly) dùng cho điều hiển nhiên hoặc cho ==lập trường của bạn==; dùng cho dự đoán thì thành nói quá.",
        ],
      },
      { t: "rule", formula: "It is likely / unlikely / possible that + S + V  ·  S + be likely to + V  ·  …, to some extent / in most cases", vi: "Mỗi nhận định một lớp rào, tối đa hai. Rào ở chủ ngữ (some, most) hoặc ở động từ, hoặc bằng cụm phạm vi cuối câu." },
      {
        t: "quiz",
        id: "t4d13-rao-viet-lai",
        kind: "fill",
        title: "Viết lại cho đúng mức — gõ CẢ câu, dùng từ trong ngoặc (6 câu)",
        items: [
          { q: "1. Online courses will replace universities. (unlikely — bắt đầu bằng It is)", answers: ["It is unlikely that online courses will replace universities."], hint: "It is unlikely that + S + will V" },
          { q: "2. Tourism destroys local culture. (tend / in some cases — tend to damage)", answers: ["Tourism tends to damage local culture in some cases.", "In some cases, tourism tends to damage local culture.", "In some cases tourism tends to damage local culture."], hint: "S + tends to + V … in some cases" },
          { q: "3. The government is responsible for the housing shortage. (largely)", answers: ["The government is largely responsible for the housing shortage."], hint: "trạng từ đứng sau be" },
          { q: "4. Rents will continue to rise. (likely — chủ ngữ Rents)", answers: ["Rents are likely to continue to rise.", "Rents are likely to continue rising.", "Rents are likely to keep rising."], hint: "S + are likely to + V" },
          { q: "5. This is the most important invention of the century. (arguably)", answers: ["This is arguably the most important invention of the century.", "Arguably, this is the most important invention of the century."], hint: "arguably đứng sau be" },
          { q: "6. The criticism is fair. (to some extent — đặt cuối câu)", answers: ["The criticism is fair to some extent."], hint: "cụm phạm vi đứng cuối" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bị động vô nhân xưng — It is believed that… / X is believed to…" },
      {
        t: "p",
        text: "Khi muốn thuật một ý kiến chung mà không nêu ai nói, band 6 viết **People say that… / Many people think that…** lặp đi lặp lại. Band 7 dùng **bị động vô nhân xưng** (impersonal passive — câu bị động không có “người làm”) với các động từ thuật: **say, think, believe, consider, know, report, expect, estimate, claim, assume, argue, accept, acknowledge, fear, understand**. Có ==hai khuôn==, nghĩa như nhau.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "It + is / was + V3 + that + S + V", vi: "Khuôn 1: giữ nguyên mệnh đề sau that. Dễ, an toàn.", examples: [{ en: "It is widely believed that a university degree guarantees a good job.", vi: "Nhiều người tin rằng bằng đại học bảo đảm một việc làm tốt." }, { en: "It has been estimated that a third of all food produced is wasted.", vi: "Người ta ước tính một phần ba lượng thực phẩm sản xuất ra bị lãng phí." }] },
          { formula: "S + is / are + V3 + to V", vi: "Khuôn 2: đưa chủ ngữ của mệnh đề lên đầu. Hành động cùng thời với lúc thuật.", examples: [{ en: "A university degree is widely believed to guarantee a good job.", vi: "Bằng đại học được nhiều người tin là bảo đảm một việc làm tốt." }] },
          { formula: "S + is / are + V3 + to have + V3", vi: "Hành động xảy ra TRƯỚC lúc thuật (quá khứ).", examples: [{ en: "The fire is thought to have started in the kitchen.", vi: "Đám cháy được cho là đã bắt đầu từ nhà bếp." }] },
          { formula: "S + is / are + V3 + to be + V-ing", vi: "Hành động ĐANG diễn ra.", examples: [{ en: "Sea levels are known to be rising faster than predicted.", vi: "Mực nước biển được biết là đang dâng nhanh hơn dự đoán." }] },
          { formula: "S + is / are + V3 + to be + V3", vi: "Mệnh đề gốc đã là bị động.", examples: [{ en: "The drug is expected to be approved next year.", vi: "Thuốc này được kỳ vọng sẽ được phê duyệt năm tới." }] },
          { formula: "There + is / are + V3 + to be + N", vi: "Khi mệnh đề gốc là There is / are…", examples: [{ en: "There are thought to be over 7,000 languages in the world.", vi: "Người ta cho rằng có hơn 7.000 ngôn ngữ trên thế giới." }] },
        ],
      },
      {
        t: "table",
        head: ["Câu gốc", "Khuôn 1", "Khuôn 2"],
        rows: [
          ["People think that he **works** abroad.", "It is thought that he works abroad.", "He is thought **to work** abroad."],
          ["People think that he **worked** abroad.", "It is thought that he worked abroad.", "He is thought **to have worked** abroad."],
          ["People think that he **is working** abroad.", "It is thought that he is working abroad.", "He is thought **to be working** abroad."],
          ["People think that he **will work** abroad.", "It is thought that he will work abroad.", "He is **expected to work** abroad. (đổi động từ thuật)"],
          ["People **thought** that he **worked** abroad.", "It was thought that he worked abroad.", "He **was** thought **to work** abroad."],
        ],
        caption: "Chọn dạng sau to bằng cách so thời gian của hành động với thời gian của động từ thuật.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai",
        items: [
          "~~It is believed the Earth to be…~~ → trộn hai khuôn. Hoặc **It is believed that the Earth is…**, hoặc **The Earth is believed to be…**",
          "~~People is said that…~~ / ~~It said that…~~ → **It is said that…** (phải có is + V3).",
          "~~He is said that he is rich.~~ → **He is said to be rich.** (khuôn 2 không có that.)",
          "~~The tomb is believed to be built in 1400.~~ → việc xây đã xong trong quá khứ: **to have been built**.",
          "~~It is thought by people that…~~ — thêm by people là thừa; cả mục đích của khuôn này là bỏ “people”.",
          "Thêm trạng từ để nói mức phổ biến: It is **widely / generally / commonly / often / sometimes** believed that… — đó cũng là một lớp rào đón.",
          "Đừng dùng **It is said that** cho ý kiến của CHÍNH BẠN. Ý của bạn: I would argue that… / In my view,…",
        ],
      },
      { t: "rule", formula: "It is + V3 + that + S + V   =   S + is + V3 + to V / to have V3 / to be V-ing", vi: "Hai khuôn thuật ý kiến chung không cần “people”. Việc đã xảy ra trước ⇒ to have + V3." },
      {
        t: "quiz",
        id: "t4d13-impersonal-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — bị động vô nhân xưng (5 câu)",
        grammar: "It is + V3 + that + S + V · S + is + V3 + to V / to have V3",
        items: [
          { q: "1. Nhiều người tin rằng tiền không mua được hạnh phúc. (bắt đầu bằng It)", answers: ["It is widely believed that money cannot buy happiness.", "It is widely believed that money can't buy happiness.", "It is commonly believed that money cannot buy happiness.", "It is generally believed that money cannot buy happiness."], hint: "It is widely believed that" },
          { q: "2. Bức tranh được cho là đã bị đánh cắp vào năm 1990. (bắt đầu bằng The painting)", answers: ["The painting is thought to have been stolen in 1990.", "The painting is believed to have been stolen in 1990."], hint: "is thought to have been + V3" },
          { q: "3. Dân số được dự kiến sẽ đạt 10 tỉ người vào năm 2060. (bắt đầu bằng The population)", answers: ["The population is expected to reach 10 billion by 2060.", "The population is expected to reach ten billion by 2060.", "The population is expected to reach 10 billion in 2060.", "The population is expected to reach ten billion in 2060."], hint: "is expected to + V · by 2060" },
          { q: "4. Người ta ước tính rằng một nửa số ngôn ngữ sẽ biến mất. (bắt đầu bằng It)", answers: ["It is estimated that half of all languages will disappear.", "It is estimated that half of the languages will disappear.", "It has been estimated that half of all languages will disappear.", "It is estimated that half of the world's languages will disappear.", "It is estimated that half the languages will disappear."], hint: "It is estimated that · half of all languages" },
          { q: "5. Công ty được đưa tin là đang lên kế hoạch đóng cửa ba nhà máy. (bắt đầu bằng The company)", answers: ["The company is reported to be planning to close three factories."], hint: "is reported to be + V-ing" },
        ],
      },
      {
        t: "quiz",
        id: "t4d13-impersonal-viet-lai",
        kind: "fill",
        title: "Viết lại — gõ CẢ câu, bắt đầu bằng từ cho sẵn (6 câu)",
        items: [
          { q: "1. People say that the old bridge is unsafe. → The old bridge …", answers: ["The old bridge is said to be unsafe."], hint: "is said to be" },
          { q: "2. People believe that the virus came from bats. → The virus …", answers: ["The virus is believed to have come from bats."], hint: "to have + V3 (come)" },
          { q: "3. Experts expect that unemployment will fall. → Unemployment …", answers: ["Unemployment is expected to fall."], hint: "is expected to + V" },
          { q: "4. People know that the minister is considering a new tax. → The minister …", answers: ["The minister is known to be considering a new tax."], hint: "to be + V-ing" },
          { q: "5. The lake is thought to contain rare fish. → It …", answers: ["It is thought that the lake contains rare fish.", "It is thought the lake contains rare fish."], hint: "It is thought that + S + V(s)" },
          { q: "6. People think that there are several causes. → There …", answers: ["There are thought to be several causes."], hint: "There are thought to be" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Referencing — chỉ lại điều đã nói mà không lặp từ" },
      {
        t: "p",
        text: "**Referencing** (quy chiếu) = dùng một từ ngắn để chỉ lại một người, vật hoặc ==cả một ý== đã nêu. Band 6 lặp danh từ hoặc lạm dụng từ nối (Moreover, Furthermore). Band 7 nối câu bằng chính ==nội dung==: câu sau “cầm” lấy ý câu trước rồi đi tiếp. Ngày 12 (Viết · mục 3–4) bạn đã dùng this / such + danh từ tóm và the former / the latter để nối câu trong đoạn văn. Bảng dưới gom TOÀN BỘ công cụ quy chiếu vào một chỗ — phần ==mới hôm nay== là **respectively**, **that of / those of** trong so sánh, **the same · the above · the following**, và cách phân biệt **it** với **this**.",
      },
      {
        t: "table",
        head: ["Công cụ", "Chỉ lại cái gì", "Ví dụ"],
        rows: [
          ["**this / these + danh từ tóm tắt**", "cả câu / cả ý trước, gọi tên nó bằng một danh từ", "Many graduates cannot find work in their field. **This mismatch** wastes years of training."],
          ["**such + (a/an) + N**", "loại vừa nêu (“… như vậy”)", "Some firms track employees' keystrokes. **Such practices** damage trust."],
          ["**the former / the latter**", "cái thứ nhất / cái thứ hai trong HAI cái vừa nêu", "Both taxes and subsidies can change behaviour; **the former** punish, while **the latter** reward."],
          ["**respectively**", "ghép hai danh sách theo đúng thứ tự", "Rents in Hanoi and Da Nang rose by 12% and 7% **respectively**."],
          ["**that of / those of**", "thay danh từ trong so sánh", "The cost of living in the capital is far higher than **that of** rural areas."],
          ["**the same · the above · the following**", "điều giống hệt / điều ở trên / điều sắp nêu", "Small firms face **the same** pressure."],
          ["**it** vs **this**", "it = một danh từ cụ thể · this = cả một tình huống", "The app is free. **It** has ten million users. **This** explains its influence."],
        ],
      },
      {
        t: "note",
        title: "💡 Ôn kho danh từ tóm (summary nouns) của Ngày 12 · mục 3 — 20 từ dùng nhiều nhất trong Task 2",
        items: [
          "Trung tính: **this trend · this situation · this approach · this process · this issue · this development · this practice · this pattern · this shift**",
          "Mang đánh giá (ghi thêm điểm LR): **this problem · this risk · this imbalance · this mismatch · this assumption · this argument · this view · this claim · this decline · this progress · this concern**",
          "Danh từ tóm tắt cho thấy bạn ==hiểu== câu trước là loại gì: một lập luận (argument), một giả định (assumption) hay một rủi ro (risk). Chọn sai là lộ.",
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai",
        items: [
          "(Ôn Ngày 12) **This** đứng một mình mà không rõ chỉ gì: ~~Prices rise, wages fall and people move away. This is bad.~~ → **These changes** are harmful. Khi câu trước có nhiều hơn một ý, luôn thêm danh từ.",
          "(Ôn Ngày 12) ~~such problem~~ → **such a problem** (đếm được số ít cần a/an) · **such problems** · **such behaviour** (không đếm được, không a).",
          "~~the such problems~~ / ~~such these problems~~ → sai; such không đi cùng the / these.",
          "**the former / the latter** chỉ dùng cho ==hai== thứ. Ba thứ trở lên: the first / the second / the last (of these).",
          "~~The population of Vietnam is bigger than Thailand.~~ → so dân số với một nước là sai lô-gic: … than **that of** Thailand. Số nhiều: The salaries of doctors are higher than **those of** nurses.",
          "~~respectively~~ dùng khi chỉ có một danh sách là vô nghĩa; phải có hai danh sách cùng số phần tử.",
          "Đại từ phải rõ chỉ cái gì: ~~The council criticised the company because it had ignored the rules.~~ — it là hội đồng hay công ty? → … because **the company** had ignored the rules. Hai danh từ cùng số đứng gần nhau thì nhắc lại danh từ.",
        ],
      },
      { t: "rule", formula: "This / These + danh từ tóm tắt + V …  ·  Such + (a/an) + N …  ·  … than that of / those of + N", vi: "Câu sau cầm lấy ý câu trước bằng một danh từ gọi tên nó. this một mình chỉ dùng khi câu trước có đúng một ý." },
      {
        t: "quiz",
        id: "t4d13-ref-dien",
        kind: "fill",
        title: "Điền MỘT từ (6 câu)",
        items: [
          { q: "1. Many cities have banned cars from their centres. ___ a policy would be difficult to introduce in smaller towns.", answers: ["Such"], hint: "… như vậy" },
          { q: "2. Coal and solar power differ greatly: the former pollutes heavily, whereas the ___ is clean but unreliable.", answers: ["latter"], hint: "cái thứ hai trong hai" },
          { q: "3. The average wage in the north is lower than ___ of the south.", answers: ["that"], hint: "thay cho the average wage" },
          { q: "4. Teenagers now sleep an hour less than in 1990. This ___ has worried doctors. (xu hướng — 1 từ)", answers: ["trend", "decline", "pattern", "change", "development"], hint: "danh từ tóm tắt" },
          { q: "5. Boys and girls scored 62% and 71% ___.", answers: ["respectively"], hint: "theo đúng thứ tự" },
          { q: "6. The working hours of nurses are longer than ___ of teachers.", answers: ["those"], hint: "thay cho the working hours (số nhiều)" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Substitution — thay cả một cụm bằng một từ: one · do so (ôn Ngày 12) · so / not · if so · do the same (mới)" },
      {
        t: "patterns",
        rows: [
          { formula: "adj + one / ones   ·   the one(s) + that …", vi: "Thay một danh từ ĐẾM ĐƯỢC đã nêu.", examples: [{ en: "Short-term solutions are cheaper than long-term ones.", vi: "Giải pháp ngắn hạn rẻ hơn giải pháp dài hạn." }, { en: "The most effective policies are the ones that reward good behaviour.", vi: "Chính sách hiệu quả nhất là những chính sách thưởng cho hành vi tốt." }] },
          { formula: "S + do / does / did + so", vi: "Thay cả cụm động từ (động từ + tân ngữ) đã nêu — trang trọng, hợp văn viết.", examples: [{ en: "Parents are urged to limit screen time, but few actually do so.", vi: "Cha mẹ được kêu gọi hạn chế thời gian dùng màn hình, nhưng ít người thực sự làm vậy." }, { en: "Those who wish to appeal must do so within 30 days.", vi: "Ai muốn khiếu nại phải làm trong vòng 30 ngày." }] },
          { formula: "think / believe / hope / expect / suppose + so   ·   if so   ·   if not", vi: "so / not thay cả một mệnh đề.", examples: [{ en: "Will prices fall next year? Most analysts do not think so.", vi: "Năm tới giá có giảm không? Phần lớn nhà phân tích không nghĩ vậy." }, { en: "Is the scheme affordable? If so, it should be extended; if not, it should be scrapped.", vi: "Chương trình có đủ tiền chi trả không? Nếu có, nên mở rộng; nếu không, nên bỏ." }] },
          { formula: "S + V + the same   ·   do likewise", vi: "Làm điều tương tự.", examples: [{ en: "Norway taxed plastic bags in the 1990s, and many countries have since done the same.", vi: "Na Uy đánh thuế túi nhựa từ thập niên 1990, và nhiều nước sau đó đã làm theo." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai",
        items: [
          "~~I prefer fresh milk to canned one.~~ → milk không đếm được, không dùng one: … to **canned milk** / to the canned **kind**.",
          "~~a one~~ sai khi không có tính từ: I need a pen. Have you got **one**? (không phải ~~a one~~). Có tính từ thì được: **a blue one**.",
          "(Ôn Ngày 12) **do so** chỉ thay hành động có chủ ý. ~~Prices rose and wages did so~~ → … and **so did** wages / and wages **did too**.",
          "**do it** = làm đúng việc cụ thể đó (văn nói); **do so** = làm như vậy (văn viết). Trong Task 2 chọn **do so**.",
          "~~I think so that…~~ sai; so đã thay cho cả mệnh đề. Phủ định: I **don't think so** (thường dùng) · I **hope not** (không nói ~~I don't hope so~~).",
          "~~If yes, …~~ là lỗi rất phổ biến → **If so, …**; ~~If no, …~~ → **If not, …**",
        ],
      },
      { t: "rule", formula: "adj + one / ones  ·  do so  ·  if so / if not  ·  do the same", vi: "one cho danh từ đếm được; do so cho cả cụm động từ có chủ ý; so / not cho cả một mệnh đề." },
      {
        t: "quiz",
        id: "t4d13-sub-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — substitution (4 câu)",
        grammar: "adj + ones · do so · if so · the same",
        items: [
          { q: "1. Các công ty lớn trả lương cao hơn các công ty nhỏ. (không lặp companies)", answers: ["Large companies pay higher salaries than small ones.", "Large companies pay more than small ones.", "Big companies pay higher salaries than small ones.", "Large companies pay higher wages than small ones."], hint: "small ones" },
          { q: "2. Người dân được khuyến khích tái chế, nhưng nhiều người không làm vậy.", answers: ["People are encouraged to recycle, but many do not do so.", "People are encouraged to recycle, but many fail to do so.", "People are encouraged to recycle, but many don't do so.", "Residents are encouraged to recycle, but many do not do so."], hint: "do so" },
          { q: "3. Kế hoạch có khả thi không? Nếu có, nó nên bắt đầu ngay.", answers: ["Is the plan feasible? If so, it should start immediately.", "Is the plan feasible? If so, it should begin immediately.", "Is the plan feasible? If so, it should start at once."], hint: "If so · feasible" },
          { q: "4. Phần Lan giảm bài tập về nhà, và các nước khác có thể làm điều tương tự.", answers: ["Finland reduced homework, and other countries could do the same.", "Finland reduced homework, and other countries may do the same.", "Finland has reduced homework, and other countries could do the same.", "Finland reduced homework, and other countries might do the same."], hint: "do the same" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Ellipsis — lược bỏ phần người đọc tự hiểu" },
      {
        t: "p",
        text: "**Ellipsis** (lược bỏ) = bỏ hẳn những từ mà người đọc tự điền lại được. Nó làm câu gọn và là dấu hiệu của người viết tự tin. Nhưng chỉ được bỏ khi phần bị bỏ ==giống hệt về dạng== với phần đã có.",
      },
      {
        t: "table",
        head: ["Vị trí", "Đầy đủ", "Lược bỏ"],
        rows: [
          ["Sau **and / but / or** — cùng chủ ngữ", "The firm cut costs and **the firm** raised prices.", "The firm cut costs **and raised** prices."],
          ["Sau **and / but** — cùng chủ ngữ + trợ động từ", "Fees have risen and **fees have** discouraged applicants.", "Fees have risen **and discouraged** applicants."],
          ["Sau **trợ động từ**", "Some employees want flexible hours, but most do not **want flexible hours**.", "…, but most **do not**."],
          ["Sau **to**", "They could invest more, but they choose not to **invest more**.", "…, but they **choose not to**."],
          ["Sau **than / as**", "Sales were higher than **they had been** expected.", "Sales were higher **than expected**."],
          ["Sau **if / when / while / although** — cùng chủ ngữ + be", "If **it is** necessary, the law can be changed. · While **they are** studying, students…", "**If necessary**, … · **While studying**, students…"],
          ["Câu trả lời song song", "Men spent 10 hours a week online; women **spent** 12 **hours a week online**.", "Men spent 10 hours a week online; **women, 12**."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi tinh — bỏ khi dạng KHÔNG giống",
        items: [
          "~~The government has never and will never accept this.~~ → sau has cần **accepted**, sau will cần **accept**; hai dạng khác nhau nên không bỏ được: has never **accepted** and will never **accept** this.",
          "~~She is interested and good at maths.~~ → interested **in**, good **at**: She is interested **in** and good **at** maths.",
          "~~While walking to work, the rain started.~~ → chủ ngữ bị lược (người đi bộ) khác chủ ngữ chính (the rain) ⇒ **While I was walking** to work, the rain started.",
          "~~Fees have risen and discouraging applicants.~~ → hai động từ nối bằng and phải ==cùng dạng==: risen and **discouraged**.",
          "Sau **than**: Sales were higher than **expected / predicted / necessary / usual** — đây là cụm cố định, không cần it was.",
          "Đừng lược trong câu dễ hiểu sai: ~~Cats like fish more than dogs.~~ (hơn chó thích, hay hơn thích chó?) → … more than dogs **do**.",
        ],
      },
      { t: "rule", formula: "S + V … and / but + V …   ·   …, but most do not.   ·   higher than expected   ·   If necessary, …", vi: "Chỉ lược khi phần bị bỏ giống hệt về dạng và cùng chủ ngữ với phần còn lại." },
      {
        t: "quiz",
        id: "t4d13-ellipsis",
        kind: "fill",
        title: "Viết lại cho gọn — gõ CẢ câu, bỏ phần lặp (5 câu)",
        items: [
          { q: "1. The council closed the library and the council sold the building.", answers: ["The council closed the library and sold the building."], hint: "bỏ chủ ngữ lặp" },
          { q: "2. Many people say they will exercise more, but few people exercise more. (dùng do)", answers: ["Many people say they will exercise more, but few do.", "Many people say they will exercise more, but few do so."], hint: "…, but few do." },
          { q: "3. The results were better than they had been expected.", answers: ["The results were better than expected."], hint: "than expected" },
          { q: "4. If it is possible, students should live near the campus.", answers: ["If possible, students should live near the campus."], hint: "If possible," },
          { q: "5. Employees can work from home, but most employees prefer not to work from home.", answers: ["Employees can work from home, but most prefer not to."], hint: "… prefer not to." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Ghép lại: một đoạn band 6 và chính đoạn đó ở band 7" },
      {
        t: "p",
        text: "Đề: “Some people think that governments should tax unhealthy food.” Đọc hai đoạn thân bài dưới đây. Ý ==giống hệt nhau==; chỉ khác cách rào đón và cách nối.",
      },
      {
        t: "examples",
        items: [
          { en: "BAND 6 — People say that a tax on unhealthy food will make people healthier. Moreover, people will buy less unhealthy food because unhealthy food is expensive. Furthermore, the government gets money from the tax and the government can spend the money on hospitals. However, poor people buy unhealthy food more than rich people buy unhealthy food, so the tax is bad for poor people.", vi: "Lặp people 6 lần, unhealthy food 5 lần; ba từ nối đứng đầu câu; mọi nhận định đều tuyệt đối (will make, will buy, is bad)." },
          { en: "BAND 7 — It is often argued that a tax on unhealthy food would improve public health. Higher prices tend to reduce demand, and there is some evidence that sugary-drink taxes have done so in several countries. Such a tax would also raise revenue, which could be spent on hospitals. Its burden, however, is likely to fall most heavily on low-income households, since they spend a larger share of their budget on processed food than wealthier ones do. This imbalance is arguably the strongest objection to the policy.", vi: "It is often argued that (vô nhân xưng) · tend to (rào) · have done so (thay thế) · Such a tax (quy chiếu) · Its burden (quy chiếu) · is likely to (rào) · wealthier ones do (one + lược bỏ) · This imbalance (danh từ tóm tắt) · arguably (rào)." },
        ],
      },
      {
        t: "table",
        head: ["Dùng ở đâu", "Công cụ hợp nhất", "Liều lượng"],
        rows: [
          ["Task 2 — câu thuật quan điểm người khác", "It is often argued that… · X is widely believed to…", "1–2 lần / bài"],
          ["Task 2 — câu nêu nguyên nhân, hệ quả", "may · tend to · is likely to · largely", "gần như mọi câu hệ quả, mỗi câu một lớp"],
          ["Task 2 — câu thứ hai của đoạn", "This + danh từ tóm tắt · Such + N", "2–4 lần / bài, thay cho Moreover / Furthermore"],
          ["Task 1 — số liệu dự báo", "is expected / projected / predicted to + V", "mọi số liệu tương lai"],
          ["Task 1 — so sánh", "that of / those of · respectively · the former / the latter", "1–2 lần / bài"],
          ["Speaking Part 3", "tend to · I'd say · if so · I don't think so · …, but most don't", "tự nhiên; không dùng the former / respectively khi nói"],
        ],
      },
      {
        t: "note",
        title: "📌 Ghi nhớ khi Reading và Listening",
        items: [
          "Trong câu YES / NO / NOT GIVEN, người viết nói **may** mà câu hỏi nói **will** / **always** ⇒ thường là NO hoặc NOT GIVEN. Bài Đọc hôm nay có hai câu bẫy kiểu này (câu 29 và 36).",
          "Trong bài đọc, **this + danh từ** và **such** là sợi dây nối hai câu — đáp án của câu điền từ hay nằm ở câu ==trước== nó.",
          "Trong bài giảng Part 4, **It is thought that… / is believed to have…** báo hiệu “đây là giả thuyết”, còn **We now know that…** báo “đây là sự thật” — phần Table hôm nay hỏi đúng chỗ khác nhau đó.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Kiểm tra cuối bài (18 câu)" },
      {
        t: "mcq",
        id: "t4d13-np-chon",
        title: "Chọn phương án đúng (10 câu)",
        items: [
          { q: "1. Which sentence is correctly hedged for an academic essay?", options: ["Maybe video games makes children violent.", "Video games may make some children more aggressive.", "Video games might perhaps possibly make children violent.", "Video games always make children violent."], correct: 1, why: "B có một lớp rào ở động từ (may) và một ở đối tượng (some). A dùng maybe (văn nói) và sai chia động từ; C rào ba lớp; D tuyệt đối." },
          { q: "2. The temple ___ in the ninth century.", options: ["is believed to build", "is believed to be built", "believes to have been built", "is believed to have been built"], correct: 3, why: "Việc xây xảy ra trước lúc thuật và là bị động ⇒ to have been + V3." },
          { q: "3. ___ that a third of adults do not get enough sleep.", options: ["It is estimated", "It estimates", "People is estimated", "It is estimating"], correct: 0, why: "Khuôn 1: It + is + V3 + that…" },
          { q: "4. Unemployment and inflation both rose. ___ worried the central bank more.", options: ["The former ones", "The latter", "Such", "Respectively"], correct: 1, why: "the latter = cái thứ hai trong hai (inflation). The former không đi với ones." },
          { q: "5. Wages have fallen while rents have doubled. This ___ has pushed many young people out of the city.", options: ["imbalance", "balance", "argument", "claim"], correct: 0, why: "Câu trước mô tả sự mất cân đối giữa lương và tiền thuê ⇒ danh từ tóm tắt imbalance. argument / claim dùng cho một ý kiến." },
          { q: "6. The birth rate of Japan is lower than ___.", options: ["France", "those of France", "that of France", "the France's one"], correct: 2, why: "So sánh birth rate với birth rate ⇒ that of (số ít)." },
          { q: "7. Citizens are asked to save water, but in practice few ___.", options: ["do it so", "are so", "do so", "so do"], correct: 2, why: "do so thay cho save water. so do + S dùng để nói “cũng vậy”." },
          { q: "8. Which sentence is correct?", options: ["She is interested and good at physics.", "The company has never and will never pay bribes.", "While driving home, the engine failed.", "The costs were lower than expected."], correct: 3, why: "than expected là lược bỏ đúng. A thiếu in; B: has never paid…; C: chủ ngữ bị lược khác chủ ngữ chính." },
          { q: "9. Is public transport reliable in your city? ___, far more people would use it.", options: ["If yes", "If so", "If it", "If such"], correct: 1, why: "If so = nếu đúng vậy. If yes là lỗi phổ biến." },
          { q: "10. “Apparently, the factory is closing.” The speaker means:", options: ["It is obvious that the factory is closing.", "The factory is definitely closing.", "The factory will not close.", "I have heard that the factory is closing, but I am not certain."], correct: 3, why: "apparently = nghe nói / có vẻ như, chưa chắc — không phải “rõ ràng”." },
        ],
      },
      {
        t: "quiz",
        id: "t4d13-np-viet-lai",
        kind: "fill",
        title: "Điền MỘT từ vào mỗi chỗ trống (8 câu)",
        items: [
          { q: "1. Children from wealthier families ___ to stay in education longer. (thường có xu hướng)", answers: ["tend"], hint: "tend to + V" },
          { q: "2. It is ___ believed that breakfast is the most important meal of the day. (rộng rãi)", answers: ["widely", "commonly", "generally"], hint: "trạng từ trước believed" },
          { q: "3. The suspect is thought to ___ left the country last week.", answers: ["have"], hint: "to have + V3" },
          { q: "4. Some employers read their staff's private emails. ___ behaviour is unacceptable.", answers: ["Such", "This"], hint: "… như vậy" },
          { q: "5. Public schools are free; private ___ can cost thousands a year.", answers: ["ones", "schools"], hint: "thay cho schools" },
          { q: "6. The scheme is, to some ___, a success.", answers: ["extent", "degree"], hint: "to some …" },
          { q: "7. The new road is ___ to reduce journey times by a third. (được kỳ vọng)", answers: ["expected", "predicted", "projected", "likely"], hint: "is … to + V" },
          { q: "8. Visitors may take photographs if they wish to ___ so.", answers: ["do"], hint: "do so" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t4d13-doc",
    kind: "reading",
    title: "Đọc: Reading đủ 3 passage · 40 câu · 60 phút — lần 1 của Tập 4",
    goal: "Làm trọn một bài Reading Academic ba passage (khoảng 2.500 từ, 40 câu, 8 dạng câu hỏi, Passage 3 là văn lập luận) trong đúng 60 phút theo nhịp 17 – 20 – 23, không bỏ trống câu nào, đạt ít nhất 27/40 (≈ band 6.5), và biết chính xác mình mất điểm ở dạng nào, vì kiểu bẫy nào — để hai lần sau (Ngày 21 · 27) lên 30/40.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        items: [
          "Đây là **lần 1** trong ba lần làm đủ 3 passage của Tập 4 (lần 2: Ngày 21 · lần 3: Ngày 27). Mục tiêu hôm nay ==27/40== (band 6.5); cuối tập 30/40 (band 7).",
          "Nhịp giờ đã học ở Tập 2 Ngày 24 và Tập 3 Ngày 27 · 29: ==17 – 20 – 23== phút. Passage 3 khó nhất nên được nhiều giờ nhất — đừng để Passage 1 ăn mất.",
          "Tám dạng câu hỏi hôm nay bạn đều đã học riêng: TFNG, Notes, Matching headings, Matching features, Sentence completion, Multiple choice, YNNG, Summary có hộp từ.",
          "Passage 3 là văn **lập luận có rào đón**: người viết nói may / appears / it is not unreasonable to suppose. Câu hỏi sẽ thử xem bạn có để ý ==mức chắc chắn== không — đúng điểm ngữ pháp vừa học ở Bài 1.",
          "Luật của buổi làm đủ: **không dừng đồng hồ**, không tra từ, không bỏ trống. Hết giờ là dừng bút.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Trước khi bấm giờ — kế hoạch 60 phút ở band 7" },
      {
        t: "table",
        head: ["Passage", "Câu", "Giờ", "Mục tiêu hôm nay", "Mục tiêu cuối tập"],
        rows: [
          ["1 — mô tả, sự kiện (≈ 900 từ)", "1–13", "17 phút", "≥ 11/13", "≥ 12/13"],
          ["2 — mô tả + ý kiến chuyên gia (≈ 800 từ)", "14–26", "20 phút", "≥ 9/13", "≥ 10/13"],
          ["3 — lập luận (≈ 870 từ)", "27–40", "23 phút (gồm 3 phút soát)", "≥ 7/14", "≥ 9/14"],
          ["**Tổng**", "40", "60 phút", "**≥ 27** (band 6.5)", "**≥ 30** (band 7)"],
        ],
        caption: "Điểm dễ nhất nằm ở Passage 1. Ở band 7, Passage 1 sai quá 1–2 câu là không còn đường lên 30.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Mỗi passage làm theo cùng một trình tự",
        steps: [
          { label: "30 giây", sub: "Đọc tiêu đề + lướt các dạng câu hỏi, đếm số câu mỗi dạng" },
          { label: "2 phút", sub: "Đọc câu đầu mỗi đoạn, ghi 2–3 chữ bên lề: đoạn này nói gì" },
          { label: "Làm theo dạng", sub: "Dạng theo thứ tự bài (TFNG, điền từ, MCQ) làm trước; Matching headings làm sau cùng của passage đó" },
          { label: "Kẹt quá 90 giây", sub: "Chọn đáp án khả dĩ nhất, đánh dấu ?, đi tiếp" },
          { label: "Hết giờ passage", sub: "Chuyển passage — kể cả khi còn câu ?" },
        ],
      },
      {
        t: "note",
        title: "📌 Bốn điều khác Tập 3",
        items: [
          "**Passage 2 hôm nay có Matching headings + Matching features** — hai dạng tốn giờ nhất đứng cạnh nhau. Đọc lướt bố cục trước (2 phút) là bắt buộc, không phải tuỳ chọn.",
          "**Passage 3** không còn kể sự kiện: mỗi đoạn là một bước lập luận (thừa nhận → vấn đề → bằng chứng 1 → bằng chứng 2 → phản bác → mở rộng → kết). Ghi bên lề ==vai trò== của đoạn, không chỉ chủ đề.",
          "Câu **YES / NO / NOT GIVEN** hỏi quan điểm người viết. Người viết rào đón (may, thin evidence) mà câu hỏi nói chắc (firmly established) ⇒ **NO**.",
          "Chép đáp án điền từ ==đúng nguyên dạng trong bài== (số ít / số nhiều) và đúng giới hạn số từ.",
        ],
      },
      {
        t: "p",
        text: "Chuẩn bị: giấy nháp, đồng hồ đếm ngược **60:00**. Ghi giờ thực tế bạn rời mỗi passage vào giấy (ví dụ: P1 xong lúc 42:10) — cuối bài sẽ dùng tới. ==Bấm giờ rồi mới kéo xuống.==",
      },

      /* ══ PASSAGE 1 ══ */
      { t: "h", text: "READING PASSAGE 1 — Questions 1–13 (17 phút)" },
      {
        t: "passage",
        title: "The Rise of the Umbrella",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1. (Văn bản tự soạn để luyện tập; chi tiết lịch sử đã được giản lược.)",
        paras: [
          { label: "A", text: "In the 1750s a London merchant named Jonas Hanway began to do something that his fellow citizens found faintly ridiculous: when it rained, he walked through the streets beneath an umbrella. Hanway had spent several years trading in Russia and Persia, and he may well have seen umbrellas in use there, but in London the object had an unfortunate reputation. A man who carried one was assumed to be either French or effeminate, and quite possibly both. Passers-by laughed openly at the sight. Hanway, a stubborn man who later campaigned on behalf of orphans and the boys who were sent up chimneys to clean them, simply ignored them. He is said to have carried an umbrella in all weathers for nearly thirty years, and by the time of his death in 1786 the habit had spread so widely that an umbrella was sometimes known simply as a “Hanway”." },
          { label: "B", text: "The object itself was far from new. For several thousand years umbrellas had been used in Egypt, Assyria, India and China, but chiefly as protection from the sun, and often as a mark of rank: at some courts only the ruler, or those he chose to honour, was permitted to walk beneath one. The English word reflects this history. It comes, by way of Italian, from the Latin umbra, meaning “shade”, and for a long time it referred to a sunshade rather than to anything carried in the rain. In China, where umbrellas were sometimes made of oiled paper, they could also keep off a shower, and by the seventeenth century similar designs had reached Europe, where they were carried mainly by fashionable women." },
          { label: "C", text: "Hanway's critics were not only offended by the look of the thing. The fiercest opposition came from the drivers of hackney coaches, London's carriages for hire, for whom a wet day had always been a profitable one: a pedestrian caught in a downpour had little choice but to pay for a ride. An umbrella threatened that income, and coachmen are reported to have shouted insults at Hanway and to have driven deliberately through puddles in order to splash him. Their fears were understandable, but the early umbrella was hardly a convincing rival. Its ribs were usually made of whalebone, its cover of oiled silk or cotton, and its handle of solid wood. Once wet, it became extremely heavy, and it was inclined both to leak and to turn inside out in a strong wind." },
          { label: "D", text: "The device was transformed by Samuel Fox, an industrialist who owned a mill near Sheffield that drew steel into wire. In 1852 Fox introduced what he called the Paragon frame, in which each rib was a thin strip of steel bent into a U-shape along its length. According to one account, the idea came to him because he had a large stock of the steel strip used to stiffen women's corsets and was looking for another way to sell it. Whatever its origin, the design was a remarkable success. The U-shaped section made each rib unusually rigid for its weight, so that the whole umbrella became both lighter and stronger, and when it was closed it could be rolled into a slim, neat shape. Fox became an extremely wealthy man, and the principle behind his ribs survives in a great many umbrellas today." },
          { label: "E", text: "With a reliable frame, the umbrella completed its journey from eccentricity to respectability. By the second half of the nineteenth century, few well-dressed men in a British city would have been seen without one, and specialist shops flourished. One of them, James Smith & Sons, was founded in 1830 and moved in 1857 to the premises in New Oxford Street that it still occupies, where umbrellas are still made by hand. In the twentieth century the tightly rolled black umbrella, carried even on dry days, became part of the unofficial uniform of the London businessman, as recognisable as the bowler hat." },
          { label: "F", text: "The next important change came from Germany. In 1928 Hans Haupt, a former soldier who had been badly wounded in the First World War and needed a walking stick, found it awkward to manage an umbrella as well. His solution was a telescopic design: the shaft slid into itself and the ribs folded at a hinge, producing an umbrella short enough to fit inside a briefcase or a handbag. It went into production a few years later under the name Knirps, a German word for a small child. Folding umbrellas did not replace the traditional kind, but they changed when people carried one: no longer only when rain was expected, but every day, just in case." },
          { label: "G", text: "Today the umbrella is one of the cheapest manufactured objects most people own, and also one of the most easily discarded. It has been estimated that hundreds of millions are produced every year, many of them sold for little more than the price of a cup of coffee. Such umbrellas are not designed to last. Their ribs are thin, their joints are fixed with rivets or made of plastic, and when one part breaks, repair is usually impossible, so the whole umbrella is thrown away. They are also among the items most frequently left behind on buses and trains. A handful of craftsmen still mend expensive umbrellas, and some designers have begun to produce models with replaceable parts. For most buyers, however, the umbrella has become something Hanway's neighbours could never have imagined: an object so ordinary that it is hardly noticed at all." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–6** — Do the following statements agree with the information given in Reading Passage 1? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, or **NOT GIVEN** if there is no information on this.",
      },
      {
        t: "mcq",
        id: "t4d13-doc-p1-tfng",
        title: "Questions 1–6 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "1. Londoners who saw Hanway with his umbrella regarded him as a figure of fun.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn A: người London thấy việc này “faintly ridiculous” và “Passers-by laughed openly at the sight”. laughed openly / ridiculous = regarded him as a figure of fun (bị coi là trò cười)." },
          { q: "2. Hanway gave up carrying an umbrella after a few years because of the mockery he received.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn A: ông “simply ignored them” và “is said to have carried an umbrella in all weathers for nearly thirty years”. nearly thirty years ↔ after a few years. Bẫy đổi khoảng thời gian." },
          { q: "3. The English word ‘umbrella’ originally referred to protection from rain.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn B: từ này gốc là umbra = “shade”, “for a long time it referred to a sunshade rather than to anything carried in the rain”. Trái hẳn với câu hỏi." },
          { q: "4. The Chinese were the first people to make umbrellas that could keep off the rain.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn B chỉ nói ở Trung Quốc ô giấy dầu “could also keep off a shower”; không nói họ có phải người ĐẦU TIÊN hay không. Bẫy “the first” — bài không so sánh." },
          { q: "5. Coach drivers objected to umbrellas because they were afraid of losing customers.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn C: ngày mưa là ngày đắt khách của xà ích; “An umbrella threatened that income”. threatened that income = afraid of losing customers." },
          { q: "6. Umbrellas with Fox's frame cost more than those with whalebone ribs.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn D nói khung Paragon nhẹ hơn, chắc hơn và thành công lớn; bài không hề nhắc giá của hai loại." },
        ],
      },
      {
        t: "p",
        text: "**Questions 7–13** — Complete the notes below. Choose **ONE WORD AND/OR A NUMBER** from the passage for each answer.",
      },
      {
        t: "note",
        title: "The modern umbrella — notes",
        items: [
          "**Early rain umbrellas:** ribs usually made of **7** ___ · became very heavy when wet and tended to leak",
          "**Fox's Paragon frame:** introduced in **8** ___ · each rib a thin strip of **9** ___ with a U-shaped section · lighter and stronger than earlier frames",
          "**Respectability:** a London umbrella shop that still exists was founded in **10** ___",
          "**Folding umbrella (1928):** its designer used a walking **11** ___ after a war injury · short enough to go into a handbag or a **12** ___",
          "**Cheap modern umbrellas:** joints fixed with rivets or made of plastic, so **13** ___ is rarely possible",
        ],
      },
      {
        t: "quiz",
        id: "t4d13-doc-p1-ghi-chu",
        kind: "fill",
        title: "Questions 7–13 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "7", answers: ["whalebone", "whale-bone"], hint: "Đoạn C: “Its ribs were usually made of whalebone, its cover of oiled silk or cotton”. silk / cotton là vải bọc, không phải nan ô." },
          { q: "8", answers: ["1852"], hint: "Đoạn D: “In 1852 Fox introduced what he called the Paragon frame”." },
          { q: "9", answers: ["steel"], hint: "Đoạn D: “each rib was a thin strip of steel bent into a U-shape”. U-shaped đã có sẵn trong ghi chú ⇒ chỉ điền steel." },
          { q: "10", answers: ["1830"], hint: "Đoạn E: “was founded in 1830 and moved in 1857 to the premises in New Oxford Street” — 1857 là năm CHUYỂN cửa hàng. Bẫy hai con số trong một câu." },
          { q: "11", answers: ["stick"], hint: "Đoạn F: “a former soldier who had been badly wounded… and needed a walking stick”. walking đã có trong ghi chú." },
          { q: "12", answers: ["briefcase"], hint: "Đoạn F: “short enough to fit inside a briefcase or a handbag”. handbag đã có trong ghi chú ⇒ còn briefcase." },
          { q: "13", answers: ["repair"], hint: "Đoạn G: “repair is usually impossible”. usually impossible = rarely possible (đổi khẳng định ↔ phủ định). Danh từ repair, không phải repaired." },
        ],
      },

      /* ══ PASSAGE 2 ══ */
      { t: "h", text: "READING PASSAGE 2 — Questions 14–26 (20 phút)" },
      {
        t: "passage",
        title: "Desire Paths",
        intro: "You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2. (Văn bản tự soạn; tên các nhà nghiên cứu là hư cấu.)",
        paras: [
          { label: "A", text: "Walk across almost any university campus, housing estate or city park and you will find, somewhere, a strip of bare earth cutting diagonally across a lawn while a neatly paved footpath a few metres away takes the long way round. Planners call such tracks “desire paths” or “desire lines”: routes that nobody designed and that exist only because enough people chose to walk there. They form with surprising speed. It has been claimed that as few as fifteen crossings are enough to leave a visible line on grass, and once a line can be seen, later walkers tend to follow it, wearing it deeper." },
          { label: "B", text: "The obvious explanation is that people are in a hurry, and distance certainly matters. Helena Voss, a transport geographer who filmed pedestrians on three campuses, found that most would tolerate a paved route only about ten per cent longer than the direct one before abandoning it. But her footage also showed something less expected. Walkers left the paving to avoid a short flight of steps, to stay out of a puddle that formed after rain, or simply to keep their destination in view. In a number of cases the route they chose was, when measured, no shorter than the official one. What mattered, Voss concluded, was not the saving itself but the impression of one." },
          { label: "C", text: "For most of the twentieth century, the standard response of those who managed public land was to treat such paths as a form of misbehaviour. Fences went up, hedges were planted and signs instructed visitors to keep off the grass. These measures have a poor record. The landscape architect Daniel Okafor, who has surveyed dozens of sites where barriers were installed, reports that in the majority of them walkers simply went round the obstacle, so that one narrow track was replaced by two and the area of worn ground increased. “It is an argument,” he remarks, “that the designer always loses, and pays to lose.”" },
          { label: "D", text: "A different philosophy turns the problem on its head. Instead of deciding in advance where people ought to walk, the designer waits to see where they do. Several American universities are said to have opened new sites with no paths at all, allowed students to cross the grass freely for a year, and then paved whatever lines had appeared. Whether or not every version of this story is true, the principle has been widely adopted. In Finland, planners are reported to visit parks after the first snowfall of the winter, when footprints reveal the routes that residents actually use, before any decision is taken about where paving should go." },
          { label: "E", text: "Snow has turned out to be informative in another way. After a heavy fall, the parts of a road junction that remain white for days are, by definition, the parts over which no vehicle has passed. Priya Raman, a street designer, has collected hundreds of photographs of these untouched patches and uses them to argue that the space could be handed over to people on foot, in the form of wider pavements or shorter crossings, without inconveniencing a single driver. Where there is no snow, there is data. Anonymous location records from mobile phones and fitness applications can now be turned into maps on which the most heavily used routes glow brightest, and a number of city authorities consult them before redesigning a square or a park." },
          { label: "F", text: "Not everyone is persuaded that worn grass should be read as an instruction. A desire path, critics point out, records only the wishes of those who were able to make it. A track that climbs a steep bank is of no use to someone in a wheelchair or a parent pushing a buggy, and paving it may direct money away from the gentler route on which such users depend. Nor is every shortcut harmless. The ecologist Tomas Lind has shown that informal trails in nature reserves divide the habitat of ground-nesting birds into fragments too small to be of use, and he argues that in protected areas these trails ought to be closed and replanted, not adopted. The crowd, in other words, is a source of evidence, not of authority." },
          { label: "G", text: "The idea has nevertheless proved too attractive to stay in the park. Software designers speak of “paving the cowpaths”: observing how customers actually use a product, including the ways its makers never intended, and then building those habits into the next version. Several features of today's messaging and social media services are widely thought to have begun in exactly this way, as conventions invented by users which the companies later made official. The same caution applies, however. What people do when left to themselves tells a designer what is convenient; it does not, by itself, reveal what is good for them, or for everyone else." },
        ],
      },
      {
        t: "p",
        text: "**Questions 14–19** — Reading Passage 2 has seven paragraphs, **A–G**. Choose the correct heading for paragraphs **B–G** from the list of headings below. Write the correct number, **i–ix**. — Example: Paragraph **A** — **vii**",
      },
      {
        t: "table",
        head: ["Số", "List of Headings"],
        rows: [
          ["i", "A metaphor that has travelled beyond the park"],
          ["ii", "Measuring the time that shortcuts save"],
          ["iii", "Barriers that make matters worse"],
          ["iv", "Why the paved route is rejected"],
          ["v", "Whose wishes do the paths record?"],
          ["vi", "Designing after watching, not before"],
          ["vii", "A familiar sight and how quickly it appears"],
          ["viii", "Evidence from untouched snow and from digital records"],
          ["ix", "The first planned footpaths"],
        ],
      },
      {
        t: "quiz",
        id: "t4d13-doc-p2-tieu-de",
        kind: "fill",
        title: "Questions 14–19 — viết số La Mã (i–ix)",
        items: [
          { q: "14. Paragraph B", answers: ["iv"], hint: "Cả đoạn trả lời “vì sao người đi bộ bỏ lối lát”: khoảng cách, bậc thang, vũng nước, tầm nhìn. ii sai: đoạn nói lối tắt nhiều khi KHÔNG ngắn hơn, và không đo thời gian." },
          { q: "15. Paragraph C", answers: ["iii"], hint: "Hàng rào, bờ giậu, biển cấm ⇒ “one narrow track was replaced by two and the area of worn ground increased”." },
          { q: "16. Paragraph D", answers: ["vi"], hint: "“Instead of deciding in advance… the designer waits to see where they do.” Đoạn có nhắc tuyết, nhưng tuyết chỉ là một ví dụ của nguyên tắc chờ-rồi-lát ⇒ không phải viii." },
          { q: "17. Paragraph E", answers: ["viii"], hint: "Nửa đầu: mảng tuyết không xe nào chạm tới (untouched patches); nửa sau: dữ liệu vị trí từ điện thoại. Tiêu đề phải phủ CẢ HAI nửa." },
          { q: "18. Paragraph F", answers: ["v"], hint: "“records only the wishes of those who were able to make it” — và câu chốt “a source of evidence, not of authority”." },
          { q: "19. Paragraph G", answers: ["i"], hint: "“too attractive to stay in the park” ⇒ ý tưởng được giới phần mềm mượn: paving the cowpaths." },
        ],
      },
      {
        t: "p",
        text: "**Questions 20–23** — Look at the following statements and the list of people below. Match each statement with the correct person, **A–D**. — **A** Helena Voss · **B** Daniel Okafor · **C** Priya Raman · **D** Tomas Lind",
      },
      {
        t: "quiz",
        id: "t4d13-doc-p2-nguoi",
        kind: "fill",
        title: "Questions 20–23 — viết chữ cái A–D",
        items: [
          { q: "20. Trying to block an informal path tends to enlarge the damaged area.", answers: ["B"], hint: "Okafor, đoạn C: “the area of worn ground increased”. enlarge the damaged area = area of worn ground increased." },
          { q: "21. A shortcut may be taken even when it offers no real saving in distance.", answers: ["A"], hint: "Voss, đoạn B: “no shorter than the official one… not the saving itself but the impression of one”." },
          { q: "22. In certain locations an informal path should be removed and not made permanent.", answers: ["D"], hint: "Lind, đoạn F: “ought to be closed and replanted, not adopted”. certain locations = protected areas." },
          { q: "23. Signs of where vehicles never go can justify giving pedestrians more room.", answers: ["C"], hint: "Raman, đoạn E: mảng tuyết không xe nào chạy qua ⇒ “could be handed over to people on foot”." },
        ],
      },
      {
        t: "p",
        text: "**Questions 24–26** — Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer. — **24** According to one claim, a line becomes visible on grass after as few as ___ crossings. · **25** Planners in Finland are reported to look at footprints after the ___ of each winter. · **26** In software design, building on what users already do is described as paving the ___ .",
      },
      {
        t: "quiz",
        id: "t4d13-doc-p2-cau",
        kind: "fill",
        title: "Questions 24–26 — NO MORE THAN TWO WORDS",
        items: [
          { q: "24", answers: ["fifteen", "15"], hint: "Đoạn A: “as few as fifteen crossings are enough to leave a visible line”." },
          { q: "25", answers: ["first snowfall"], hint: "Đoạn D: “after the first snowfall of the winter, when footprints reveal the routes”. Điền đủ hai từ; chỉ snowfall vẫn hợp ngữ pháp nhưng mất chữ first là thiếu ý." },
          { q: "26", answers: ["cowpaths"], hint: "Đoạn G: “Software designers speak of ‘paving the cowpaths’”." },
        ],
      },

      /* ══ PASSAGE 3 ══ */
      { t: "h", text: "READING PASSAGE 3 — Questions 27–40 (23 phút, gồm 3 phút soát cuối)" },
      {
        t: "passage",
        title: "The Price of Convenience",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3.",
        paras: [
          { label: "A", text: "Convenience is arguably the most powerful and least examined force shaping modern life. Few of us would describe it as a value in the way that we describe freedom or fairness as values, and yet, when we choose between two products, two services or two ways of spending an evening, it is very often convenience that decides. What is being removed is sometimes called “friction”: the waiting, the effort and the small decisions that stand between wanting something and having it. Over the past century, and with particular speed over the past two decades, friction has been engineered out of one activity after another." },
          { label: "B", text: "It would be perverse to regret all of this. The washing machine alone is estimated to have saved the average household several hours of heavy labour each week, and the time released was, for millions of women, the precondition of education and paid work. Those who speak nostalgically about a slower age have seldom had to wash sheets by hand. Any honest account of convenience must begin by acknowledging that much of the effort it abolished was drudgery, and that the people most eager to praise that drudgery were rarely the ones who had to perform it." },
          { label: "C", text: "The difficulty is that the logic which removed drudgery does not know where to stop. A technology that saves us from scrubbing floors is easily distinguished from one that saves us from cooking a meal, finding our own way across a city, or remembering a friend's birthday; but the market makes no such distinction. Each is simply a task, and a task is a cost to be reduced. The result is that activities which may once have been sources of competence, and even of pleasure, tend to be reclassified as inconveniences and then quietly eliminated." },
          { label: "D", text: "Why should this matter, if the outcome – the meal, the arrival, the birthday greeting – is the same? One answer comes from psychology. In a well-known series of experiments, participants who had assembled a simple piece of furniture themselves valued it more highly than an identical item assembled by someone else, and were willing to pay more to keep it. The researchers concluded that labour, at least when it leads to a completed result, appears to generate attachment. It is tempting to draw sweeping conclusions from such findings, and the temptation should be resisted: the tasks were brief, the participants were volunteers, and nobody has shown that the effect survives a lifetime of unwanted chores. Still, the experiments suggest that effort is not merely a price we pay for an outcome. It may, under certain conditions, be part of what makes the outcome ours." },
          { label: "E", text: "A second answer concerns skill. Abilities that are not exercised tend to weaken, and there is some evidence that this applies to the capacities which convenient technologies replace. Studies of drivers who rely heavily on satellite navigation, for instance, indicate that they form less detailed mental maps of the places they travel through than drivers who do not. Whether this constitutes a loss depends on what one thinks a mental map is for. If its only function is to get us to a destination, the device does the job better. If, however, knowing a city is part of what it means to belong to it, then something has been traded away, and traded so smoothly that the exchange was never noticed." },
          { label: "F", text: "It is at this point that defenders of convenience make their strongest objection. Nobody, they point out, is compelled to use these tools. A person who wishes to bake bread, read a paper map or write letters by hand remains entirely free to do so. This is true, but it underestimates how choices are made. When the effortless option is always present, choosing the effortful one ceases to be the normal course of action and becomes a deliberate act of self-denial, to be repeated every single day. Most people, most of the time, will not make it – not because they have weighed the alternatives and preferred ease, but because ease is what happens when nothing is decided." },
          { label: "G", text: "There is, in addition, a social dimension that individual choice cannot reach. Many inconvenient activities were also shared ones. Queuing at a counter, asking a stranger for directions, borrowing a tool from a neighbour: none of these was valued for its own sake, and few will be missed. Yet each involved a brief dependence on another person, and it is not unreasonable to suppose that a society in which such encounters become unnecessary will, over time, find them more difficult. This remains a hypothesis; the evidence that convenience causes isolation, as opposed to merely accompanying it, is thin." },
          { label: "H", text: "None of this amounts to an argument for making life harder. It is an argument for noticing that convenience has a price, which is paid not in money but in capacities and connections that are hard to measure and therefore easy to ignore. A sensible response would be neither to reject labour-saving tools nor to accept every one of them by default, but to ask of each a question the market never asks: is this an effort I am better off without, or one I would do well to keep?" },
        ],
      },
      {
        t: "p",
        text: "**Questions 27–31** — Choose the correct letter, **A**, **B**, **C** or **D**.",
      },
      {
        t: "mcq",
        id: "t4d13-doc-p3-chon",
        title: "Questions 27–31 — Multiple choice",
        items: [
          { q: "27. In the first paragraph, the writer suggests that convenience", options: ["is openly regarded as a value by most people.", "affects our decisions more than is generally recognised.", "has only begun to influence daily life in the last twenty years.", "is of greater interest to economists than to consumers."], correct: 1, why: "Đoạn A: “the most powerful and least examined force” + “it is very often convenience that decides”. A ngược (Few of us would describe it as a value). C sai: “Over the past century”, hai thập kỷ gần đây chỉ là nhanh hơn. D không có trong bài." },
          { q: "28. The writer refers to the washing machine in order to", options: ["show that some labour-saving devices have been genuinely liberating.", "argue that household technology has benefited men more than women.", "illustrate how recently friction has been removed from the home.", "suggest that critics of convenience are deliberately dishonest."], correct: 0, why: "Câu hỏi mục đích của ví dụ. Đoạn B mở bằng “It would be perverse to regret all of this”; máy giặt là bằng chứng cho phần lợi thật (precondition of education and paid work). D quá tay: người viết chỉ nói họ ít khi phải tự giặt, không nói họ cố ý dối." },
          { q: "29. What does the writer say about the furniture experiments?", options: ["They prove that effort always increases satisfaction.", "They were so badly designed that their results can be ignored.", "They show that people distrust objects made by others.", "Their results are suggestive but should not be pushed too far."], correct: 3, why: "Đoạn D: “the temptation [to draw sweeping conclusions] should be resisted… Still, the experiments suggest…”. A: prove / always trái với appears to / may, under certain conditions. B: nêu hạn chế nhưng vẫn dùng kết quả." },
          { q: "30. According to the writer, the argument that people are free not to use convenient tools", options: ["is false, because companies remove the alternatives.", "is accurate and therefore answers the criticism.", "is correct but overlooks how the easy option becomes the default.", "forgets that most people compare the options carefully."], correct: 2, why: "Đoạn F: “This is true, but it underestimates how choices are made… ease is what happens when nothing is decided.” D nói ngược: người viết bảo đa số KHÔNG cân nhắc." },
          { q: "31. Which of the following best describes the writer's overall position?", options: ["Labour-saving technology should be restricted by law.", "Each convenience should be judged by what the lost effort was worth.", "Worries about convenience are largely exaggerated.", "Only governments can protect people from the effects of convenience."], correct: 1, why: "Đoạn H: “neither to reject… nor to accept every one of them by default, but to ask of each… is this an effort I am better off without, or one I would do well to keep?” A và D không có; C trái với cả bài." },
        ],
      },
      {
        t: "p",
        text: "**Questions 32–36** — Do the following statements agree with the views of the writer in Reading Passage 3? Choose **YES** if the statement agrees with the views of the writer, **NO** if the statement contradicts the views of the writer, or **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t4d13-doc-p3-ynng",
        title: "Questions 32–36 — YES / NO / NOT GIVEN",
        items: [
          { q: "32. People who are nostalgic for a slower way of life have usually done hard domestic work themselves.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: họ “have seldom had to wash sheets by hand” và “were rarely the ones who had to perform it”. seldom / rarely ↔ usually ⇒ NO." },
          { q: "33. The market regards every task as a cost, whether or not it once gave people satisfaction.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn C: “the market makes no such distinction. Each is simply a task, and a task is a cost to be reduced” — kể cả những việc “may once have been sources of… pleasure”." },
          { q: "34. Drivers who depend on satellite navigation are involved in more accidents than other drivers.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn E chỉ nói họ có bản đồ trong đầu kém chi tiết hơn; không nói gì về tai nạn. Đừng suy diễn từ hiểu biết ngoài bài." },
          { q: "35. Whether weaker mental maps count as a loss depends on what purpose we think they serve.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn E: “Whether this constitutes a loss depends on what one thinks a mental map is for.” constitutes a loss = count as a loss; is for = purpose." },
          { q: "36. It has been firmly established that convenience makes people more isolated.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn G: “This remains a hypothesis; the evidence that convenience causes isolation… is thin.” Người viết rào đón, câu hỏi nói chắc ⇒ NO. Đây là bẫy mức chắc chắn (Bài 1)." },
        ],
      },
      {
        t: "p",
        text: "**Questions 37–40** — Complete the summary using the list of words, **A–H**, below. — **Choice and company** — Those who defend convenience point out that no one is **37** ___ to use labour-saving tools. The writer accepts this, but argues that when an easy option is always available, taking the harder one demands repeated **38** ___, which most people will not show. Many inconvenient tasks also involved a moment of **39** ___ on other people. The writer suspects that a society without such moments may find contact with others harder, while admitting that there is little **40** ___ for this idea.",
      },
      {
        t: "table",
        head: ["A", "B", "C", "D", "E", "F", "G", "H"],
        rows: [["support", "forced", "self-control", "reliance", "encouraged", "pleasure", "demand", "competition"]],
      },
      {
        t: "quiz",
        id: "t4d13-doc-p3-hop-tu",
        kind: "fill",
        title: "Questions 37–40 — viết chữ cái A–H",
        items: [
          { q: "37", answers: ["B"], hint: "Đoạn F: “Nobody… is compelled to use these tools.” compelled = forced. encouraged (E) hợp ngữ pháp nhưng sai nghĩa." },
          { q: "38", answers: ["C"], hint: "Đoạn F: “a deliberate act of self-denial, to be repeated every single day”. self-denial ≈ self-control." },
          { q: "39", answers: ["D"], hint: "Đoạn G: “each involved a brief dependence on another person”. dependence = reliance (cùng đi với on)." },
          { q: "40", answers: ["A"], hint: "Đoạn G: “the evidence… is thin” = little support. demand (G) không hợp nghĩa." },
        ],
      },

      /* ── Chấm ── */
      { t: "h", text: "Hết 60 phút — chấm điểm và đọc kết quả" },
      {
        t: "table",
        head: ["Số câu đúng / 40", "Band Reading (ước tính)", "Nghĩa là"],
        rows: [
          ["33–36", "7.5 – 8.0", "Vượt mục tiêu tập; hai lần sau giữ ổn định"],
          ["30–32", "7.0", "Đạt mục tiêu cuối tập ngay lần 1"],
          ["27–29", "6.5", "Đạt mục tiêu hôm nay"],
          ["23–26", "6.0", "Xem bảng dưới: mất điểm ở passage nào, dạng nào"],
          ["≤ 22", "≤ 5.5", "Ôn lại Tập 3 Ngày 27 · 29 trước khi làm lần 2"],
        ],
        caption: "Bảng quy đổi phổ biến của Reading Academic; band chỉ là ước tính.",
      },
      {
        t: "table",
        head: ["Bạn sai ở", "Nguyên nhân thường gặp", "Ôn lại"],
        rows: [
          ["Câu 1–6 (TFNG)", "Nhầm FALSE với NOT GIVEN; không để ý thời điểm (câu 2)", "Tập 4 Ngày 5"],
          ["Câu 7–13 (Notes)", "Chép thừa từ đã có trong ghi chú (walking stick, handbag); lấy nhầm con số thứ hai trong câu (1857 — câu 10)", "Tập 4 Ngày 11"],
          ["Câu 14–19 (Headings)", "Chọn tiêu đề theo MỘT từ khoá (snow ⇒ viii cho đoạn D)", "Tập 4 Ngày 3"],
          ["Câu 20–23 (Features)", "Dò tên người mà không đọc trọn ý của họ", "Tập 3 Ngày 21"],
          ["Câu 27–31 (MCQ)", "Chọn phương án “đúng trong bài nhưng không trả lời câu hỏi”; bỏ qua từ rào đón", "Tập 4 Ngày 7 · Bài 1 hôm nay"],
          ["Câu 32–36 (YNNG)", "Không so mức chắc chắn (hypothesis ↔ firmly established)", "Tập 4 Ngày 5 · Bài 1 hôm nay"],
          ["Câu 37–40 (Summary)", "Chọn từ hợp ngữ pháp nhưng không khớp nghĩa đoạn gốc", "Tập 3 Ngày 9"],
          ["Không kịp Passage 3", "Passage 1 quá 17 phút hoặc kẹt ở Matching headings", "mục 1 bài này · Tập 3 Ngày 29"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: ba kiểu paraphrase đã gặp trong đề hôm nay",
        items: [
          "**Đổi loại từ / đổi cấu trúc**: compelled → forced · dependence on → reliance on · laughed openly / ridiculous → a figure of fun · threatened that income → afraid of losing customers.",
          "**Đổi mức chắc chắn (bẫy)**: appears to generate / may, under certain conditions ↔ prove / always (câu 29) · remains a hypothesis / thin ↔ firmly established (câu 36).",
          "**Đổi thời điểm hoặc phạm vi (bẫy)**: for nearly thirty years ↔ after a few years (câu 2) · over the past century ↔ only in the last twenty years (câu 27).",
        ],
      },

      /* ── Soi lại ── */
      { t: "h", text: "Soi lại Passage 3: người viết rào đón ở đâu" },
      {
        t: "p",
        text: "Passage 3 dùng gần hết công cụ của Bài 1. Tìm lại trong bài và điền **MỘT từ** đúng như bài viết. Làm xong, bạn sẽ thấy vì sao các câu 29 và 36 không thể là phương án “chắc chắn”.",
      },
      {
        t: "quiz",
        id: "t4d13-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ Passage 3 (6 câu)",
        items: [
          { q: "1. Đoạn A: Convenience is ___ the most powerful and least examined force…", answers: ["arguably"], hint: "trạng từ rào đón: có thể nói là" },
          { q: "2. Đoạn B: The washing machine alone is ___ to have saved the average household several hours…", answers: ["estimated"], hint: "bị động vô nhân xưng khuôn 2: is + V3 + to have + V3" },
          { q: "3. Đoạn C: activities which may once have been sources of competence… ___ to be reclassified as inconveniences", answers: ["tend"], hint: "tend to" },
          { q: "4. Đoạn D: labour, at least when it leads to a completed result, ___ to generate attachment", answers: ["appears"], hint: "appears to + V" },
          { q: "5. Đoạn F: remains entirely free to do ___ (thay cho bake bread, read a paper map…)", answers: ["so"], hint: "do so — substitution" },
          { q: "6. Đoạn G: This remains a ___ ; the evidence… is thin.", answers: ["hypothesis"], hint: "danh từ tóm tắt cho ý vừa nêu" },
        ],
      },

      /* ── Từ vựng ── */
      { t: "h", text: "Từ vựng hữu ích từ ba bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "stubborn", pos: "adj", ipa: "/ˈstʌbən/", vi: "bướng bỉnh; kiên trì không chịu bỏ", ex: "A stubborn inventor ignored years of public ridicule.", exVi: "Một nhà phát minh bướng bỉnh phớt lờ nhiều năm bị thiên hạ chế giễu.", more: "a **stubborn** refusal / resistance / problem (vấn đề dai dẳng) · stubbornly (adv) · sắc thái: stubborn hơi chê, **persistent** / **determined** là khen" },
          { w: "rival", pos: "n / v", ipa: "/ˈraɪvl/", vi: "đối thủ; sánh ngang", ex: "The early umbrella was hardly a convincing rival to the coach.", exVi: "Chiếc ô thời đầu khó mà là đối thủ đáng gờm của xe ngựa.", more: "a **rival** firm / product · **rival** sth in + N (sánh ngang về…): Few cities rival Paris in beauty. · rivalry (n — sự kình địch)" },
          { w: "flourish", pos: "v", ipa: "/ˈflʌrɪʃ/", vi: "phát đạt, phát triển mạnh", ex: "Specialist umbrella shops flourished in Victorian London.", exVi: "Các cửa hàng ô chuyên doanh phát đạt ở London thời Victoria.", more: "businesses / the arts / plants **flourish** · a **flourishing** trade / economy · gần nghĩa: thrive, prosper" },
          { w: "discard", pos: "v", ipa: "/dɪˈskɑːd/", vi: "vứt bỏ, loại bỏ", ex: "Cheap umbrellas are easily discarded when one part breaks.", exVi: "Ô rẻ tiền dễ bị vứt đi khi hỏng một bộ phận.", more: "**discard** old clothes / packaging / a theory · trang trọng hơn throw away · discarded (adj): discarded plastic" },
          { w: "tolerate", pos: "v", ipa: "/ˈtɒləreɪt/", vi: "chịu được, chấp nhận", ex: "Most walkers will tolerate only a short detour.", exVi: "Phần lớn người đi bộ chỉ chấp nhận đi vòng một đoạn ngắn.", more: "tolerance (n) · tolerant **of** · intolerable (adj — không chịu nổi)" },
          { w: "obstacle", pos: "n", ipa: "/ˈɒbstəkl/", vi: "vật cản; trở ngại", ex: "Cost remains the main obstacle to reform.", exVi: "Chi phí vẫn là trở ngại chính của cải cách.", more: "an **obstacle to** + N / V-ing · overcome / remove / face an obstacle" },
          { w: "adopt", pos: "v", ipa: "/əˈdɒpt/", vi: "áp dụng, tiếp nhận (ý tưởng, cách làm)", ex: "The principle has been widely adopted by city planners.", exVi: "Nguyên tắc này đã được các nhà quy hoạch đô thị áp dụng rộng rãi.", more: "**adopt** an approach / a policy / a measure · adoption (n) · ⚠️ khác **adapt** (điều chỉnh cho hợp)" },
          { w: "drudgery", pos: "n", ipa: "/ˈdrʌdʒəri/", vi: "việc nặng nhọc, nhàm chán", ex: "Machines freed many households from domestic drudgery.", exVi: "Máy móc giải phóng nhiều gia đình khỏi việc nhà nặng nhọc.", more: "không đếm được · the **drudgery of** housework / data entry" },
          { w: "precondition", pos: "n", ipa: "/ˌpriːkənˈdɪʃn/", vi: "điều kiện tiên quyết", ex: "Reliable childcare is a precondition of full employment.", exVi: "Dịch vụ trông trẻ đáng tin cậy là điều kiện tiên quyết để mọi người có việc làm.", more: "a **precondition of / for** + N · gần nghĩa: prerequisite" },
          { w: "competence", pos: "n", ipa: "/ˈkɒmpɪtəns/", vi: "năng lực, sự thành thạo", ex: "Practical tasks give children a sense of competence.", exVi: "Việc thực hành cho trẻ cảm giác mình có năng lực.", more: "competent (adj) **at / in** · ≠ competition (cạnh tranh)" },
          { w: "compel", pos: "v", ipa: "/kəmˈpel/", vi: "buộc, ép buộc", ex: "Nobody is compelled to use these services.", exVi: "Không ai bị buộc phải dùng những dịch vụ này.", more: "be **compelled to** + V · compulsory (adj) · compelling (adj — thuyết phục): a compelling argument" },
          { w: "by default", pos: "phrase", ipa: "/baɪ dɪˈfɔːlt/", vi: "theo mặc định; vì không ai chọn khác đi", ex: "Most users accept the settings by default.", exVi: "Phần lớn người dùng chấp nhận cài đặt theo mặc định.", more: "the **default** option / setting · win by default (thắng vì đối thủ không ra sân)" },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau buổi làm đủ",
        items: [
          "Ghi vào sổ lỗi: số câu đúng từng passage, giờ rời từng passage, và ==loại lỗi== của từng câu sai (theo bảng ở trên).",
          "Không làm lại ngay. Hai ngày sau đọc lại riêng Passage 3, tự tóm tắt vai trò của tám đoạn bằng tám dòng.",
          "Lần 2 (Ngày 21) so với hôm nay: Passage 3 phải tăng ít nhất 1–2 câu.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t4d13-nghe",
    kind: "listening",
    title: "Nghe Part 4: Table completion + Summary completion — bài giảng 7 phút, giọng Úc",
    goal: "Nghe một bài giảng đại học khoảng 7 phút (~165 từ/phút, giọng Úc, không quãng nghỉ) và làm đúng ít nhất 8/10 câu Part 4 gồm Table completion (đọc bảng theo hàng, theo đúng thứ tự người giảng) và Summary completion (đoán loại từ, nghe paraphrase), không sập bẫy “nêu con số / ý sai trước rồi mới sửa”; đồng thời phát âm đủ âm cuối khi các từ đứng liền nhau.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        items: [
          "**Table completion** đã học ở Tập 2 Ngày 5 và Tập 3 Ngày 24; **Summary completion** ở Tập 3 Ngày 24. Tập 4 Ngày 8 bạn đã nghe bài giảng 6 phút với Note + Sentence. Hôm nay: ==bảng so sánh 3 phương pháp + đoạn tóm tắt==, dài hơn, paraphrase nặng hơn.",
          "Bảng ở Part 4 band 7 không còn là bảng giờ – giá. Nó là bảng **khái niệm**: mỗi hàng một phương pháp, mỗi cột một tiêu chí (cách làm · dùng cho · điểm yếu).",
          "Người giảng đi ==theo hàng==, từ trái sang phải. Tiêu đề hàng (tên phương pháp) là cột mốc để bạn biết mình đang ở đâu.",
          "Bẫy chính: người giảng ==nêu điều người ta hay tưởng== (People often assume… / You might expect…) rồi mới nói điều đúng. Đáp án là phần đứng SAU.",
          "Người giảng cũng rào đón như Bài 1: is believed to have held, are thought to have died, it's often claimed that… — nghe được các khuôn này là biết câu nào là sự thật, câu nào là ước đoán.",
          "🔊 Phát âm hôm nay: **âm cuối trong chuỗi từ** — most crops, kept cold, tested twice.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bảng ở Part 4 band 7 — đọc trong 30 giây thế nào" },
      {
        t: "table",
        head: ["", "Tập 2 – 3", "Tập 4 (hôm nay)"],
        rows: [
          ["**Nội dung bảng**", "lịch, giá, tên lớp, địa điểm", "khái niệm: phương pháp · cách làm · ưu / nhược"],
          ["**Từ cần điền**", "số, tên, danh từ cụ thể", "danh từ trừu tượng (income, land), phân từ (dried), số có bẫy"],
          ["**Từ trong bảng so với lời nói**", "gần như giống", "paraphrase: vulnerable to ↔ are exposed / what curators fear"],
          ["**Bẫy**", "đổi giờ, đổi giá", "nêu điều người ta hay tưởng rồi bác; hai danh từ cùng loại đứng gần nhau"],
          ["**Tốc độ**", "~150 từ/phút, có quãng nghỉ", "~165 từ/phút, không nghỉ; chuyển dạng giữa chừng không báo"],
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "30 giây đọc bảng",
        steps: [
          { label: "Tiêu đề bảng", sub: "Bài giảng so sánh cái gì?" },
          { label: "Tiêu đề cột", sub: "Mỗi cột hỏi gì: cách làm? dùng cho? điểm yếu?" },
          { label: "Tiêu đề hàng", sub: "Khoanh tên từng phương pháp — đây là cột mốc khi nghe" },
          { label: "Chiều đánh số", sub: "31 → 35 đi theo hàng hay theo cột? (gần như luôn theo hàng)" },
          { label: "Đoán từng ô", sub: "Loại từ + nghĩa: sau and là từ cùng loại với từ trước and" },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi mất điểm ở Table completion band 7",
        items: [
          "**Lạc hàng**: người giảng sang phương pháp thứ hai mà bạn còn chờ đáp án của hàng một. Nghe thấy tên hàng mới (The second method is…) ⇒ ==bỏ ô chưa điền==, nhảy theo.",
          "**Điền từ đã có trong ô**: ô ghi “minus ___ degrees” mà viết minus 18 ⇒ sai. Chỉ điền phần thiếu.",
          "**Sai dạng từ**: ô “seeds are ___ and then frozen” cần phân từ (dried), không phải dry / drying.",
          "**Lấy con số bị bác**: “people often assume minus five would do. It wouldn't…” — minus five là bẫy.",
          "**Số ít / số nhiều**: disease and ___ — nghe storms thì viết storms, không viết storm.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Summary completion ở Part 4 — nghe ý, không nghe chữ" },
      {
        t: "p",
        text: "Đoạn tóm tắt viết lại 1–2 phút bài giảng bằng ==lời khác==. Từ cần điền là từ người giảng nói ra, nhưng mọi thứ xung quanh nó đã bị paraphrase. Vì vậy trước khi nghe phải đoán được **loại từ** và **nghĩa đại khái** của từng chỗ trống.",
      },
      {
        t: "table",
        head: ["Trong đoạn tóm tắt", "Đoán", "Người giảng có thể nói"],
        rows: [
          ["acts as a ___ for seed banks", "danh từ đếm được số ít (sau a), chỉ vai trò", "What it is, quite simply, is a …"],
          ["built inside a ___", "danh từ chỉ nơi chốn tự nhiên", "tunnelled into the side of a …"],
          ["staff are not permitted to ___ them", "động từ nguyên mẫu (sau to)", "aren't allowed to … them"],
          ["a collection in ___ could not be reached", "tên riêng — nước / thành phố", "held near …, in … — cẩn thận các tên khác nhắc sau đó"],
          ["got into the entrance ___", "danh từ đi sau entrance", "ran into the entrance …"],
        ],
        caption: "Đây chính là năm chỗ trống của bài chính hôm nay — đoán trước như vậy là đã làm được một nửa.",
      },
      {
        t: "note",
        title: "💡 Mẹo: bốn câu báo hiệu “điều sắp nói mới là đáp án”",
        items: [
          "**People often assume… / You might expect… / The press likes to call it…** ⇒ điều theo sau là quan niệm sai; đáp án ở câu kế.",
          "**It's not really that. / It isn't… either.** ⇒ đang loại phương án; chờ **What it is… is…** (câu chẻ — Ngày 7).",
          "**As for… / When it comes to…** ⇒ chuyển sang cột kế tiếp của bảng.",
          "**One point that's often misunderstood is…** ⇒ chỗ này gần như chắc chắn có câu hỏi.",
        ],
      },
      { t: "rule", formula: "quan niệm sai (People often assume…) → bác (It's not… / It wouldn't…) → điều đúng (What it is… is… / the standard is…)", vi: "Ở Part 4 band 7, đáp án nằm ở bước thứ ba. Nghe thấy bước một thì đừng viết vội." },

      /* ── 3 ── */
      { t: "h", text: "3. Phát âm: âm cuối trong chuỗi từ" },
      {
        t: "p",
        text: "Người Việt quen bỏ âm cuối vì tiếng Việt không bật âm cuối. Nói từng từ thì còn nhớ, nhưng khi các từ đứng ==liền nhau== thì âm cuối rơi hàng loạt: most crops thành “mô crop” (rụng cả /s/ của most lẫn /s/ của crops), kept cold thành “kép côn” (rụng /d/ cuối cụm). Giám khảo Speaking nghe ra ngay, và chính bạn cũng nghe sót -s, -ed khi làm Listening (seed hay seeds? test hay tested?). Năm tình huống:",
      },
      {
        t: "table",
        head: ["Tình huống", "Cách phát âm", "Ví dụ"],
        rows: [
          ["Âm cuối + **nguyên âm** đầu từ sau", "nối âm cuối sang từ sau — dễ nhất", "seed**s a**re /siːd·zə/ · drie**d a**nd /draɪ·dənd/ · bank**s o**f /bæŋk·səv/"],
          ["Âm cuối là **/s/ /z/** + phụ âm", "/s/ /z/ ==không bao giờ bỏ== — nó mang nghĩa số nhiều, ngôi ba", "cro**ps** kept · ban**ks** need · stor**ms** and pe**sts**"],
          ["Âm tắc **/p t k b d g/** + phụ âm", "đặt lưỡi / môi đúng vị trí, giữ một nhịp, không bật hơi — nhưng VẪN có", "see**d b**ank · drie**d s**eeds · bi**g ch**ange — riêng /t/ /d/ kẹp GIỮA hai phụ âm (mos(t) crops, kep(t) cold) thì được lướt, xem Ngày 5"],
          ["Hai âm **giống nhau** gặp nhau", "nói một lần, kéo dài hơn", "la**st t**ime · thi**s s**eason · fiel**d d**ata"],
          ["Cụm cuối **ba phụ âm**", "/sts/ /sks/ /nθs/ — nói chậm lại, đủ cả ba", "te**sts** · ri**sks** · mo**nths**"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Hai cách sửa sai của người Việt — đều không đúng",
        items: [
          "**Thêm nguyên âm đệm** để bật cho rõ: kept cold → ~~“kép-tơ côn-đơ”~~. Âm tắc cuối chỉ cần ==chặn hơi==, không cần bật.",
          "**Bỏ luôn**: crops → ~~“crop”~~, tested → ~~“test”~~. Thà nói chậm mà đủ còn hơn nhanh mà rụng.",
          "Ngày 5 đã học: /t/ /d/ kẹp GIỮA hai phụ âm được lướt — las(t) night, mos(t) crops, kep(t) cold. Đó là lướt ==có quy tắc==, đúng chỗ người bản ngữ cũng lướt. Còn /s/ /z/ cuối từ, và /t/ /d/ đứng trước nguyên âm hoặc cuối câu (kept it, cold.) thì không bao giờ được bỏ.",
        ],
      },
      {
        t: "phatam",
        id: "t4d13-phat-am",
        title: "Luyện phát âm — âm cuối trong chuỗi từ",
        note: "Đọc chậm lần đầu, đủ mọi âm cuối in trong phiên âm; lần hai đọc ở tốc độ tự nhiên mà không rụng âm nào. Máy chấm từng từ.",
        items: [
          { text: "Most crops are kept cold.", ipa: "məʊst krɒps ə kept kəʊld", vi: "Phần lớn cây trồng được giữ lạnh." },
          { text: "The seeds are dried and then frozen.", ipa: "ðə siːdz ə draɪd ənd ðen frəʊzn", vi: "Hạt được sấy khô rồi đông lạnh." },
          { text: "Each batch is tested every five years.", ipa: "iːtʃ bætʃ ɪz testɪd evri faɪv jɪəz", vi: "Mỗi lô được kiểm tra năm năm một lần." },
          { text: "Field gene banks need lots of land.", ipa: "fiːld dʒiːn bæŋks niːd lɒts əv lænd", vi: "Ngân hàng gen ngoài đồng cần rất nhiều đất." },
          { text: "Storms and pests are constant risks.", ipa: "stɔːmz ənd pests ə kɒnstənt rɪsks", vi: "Bão và sâu bệnh là rủi ro thường trực." },
          { text: "The vault holds a million samples.", ipa: "ðə vɔːlt həʊldz ə mɪljən sɑːmplz", vi: "Hầm lưu giữ một triệu mẫu." },
          { text: "Farmers switched to modern wheat.", ipa: "fɑːməz swɪtʃt tə mɒdn wiːt", vi: "Nông dân chuyển sang giống lúa mì hiện đại." },
          { text: "It lasted months, not weeks.", ipa: "ɪt lɑːstɪd mʌnθs nɒt wiːks", vi: "Nó kéo dài nhiều tháng chứ không phải vài tuần." },
        ],
      },
      {
        t: "mcq",
        id: "t4d13-nghe-am-cuoi",
        title: "Âm cuối báo gì? (5 câu)",
        items: [
          { q: "1. Bạn nghe /ðə siːdz ə testɪd/. Người nói nói:", options: ["The seed is tested.", "The seeds are tested.", "The seeds are test.", "The seed are testing."], correct: 1, why: "/siːdz/ có /z/ ⇒ số nhiều; /ə/ = are yếu; /testɪd/ có /ɪd/ ⇒ tested." },
          { q: "2. Cụm nào có hai âm giống nhau gặp nhau, chỉ nói MỘT lần kéo dài?", options: ["kept cold", "most crops", "last time", "seeds are"], correct: 2, why: "last time: /t/ + /t/ ⇒ một /t/ giữ lâu hơn. Các cụm khác là hai phụ âm khác nhau hoặc phụ âm + nguyên âm." },
          { q: "3. Trong “banks need”, âm nào KHÔNG được bỏ?", options: ["/s/ của banks", "/k/ của banks có thể bỏ và /s/ cũng bỏ", "/n/ của need", "không âm nào quan trọng"], correct: 0, why: "/s/ cuối mang nghĩa số nhiều; bỏ đi thành bank need — sai ngữ pháp trong tai người nghe." },
          { q: "4. “dried and then frozen” — dried nối sang and thế nào?", options: ["/draɪ ænd/ — bỏ /d/", "/draɪdə ænd/ — thêm /ə/", "/draɪt ænd/", "/draɪ·dənd/ — /d/ nối sang and"], correct: 3, why: "Âm cuối + nguyên âm ⇒ nối: drie·dand. Không bỏ, không thêm nguyên âm đệm." },
          { q: "5. Từ nào kết thúc bằng cụm ba phụ âm?", options: ["tested", "months", "frozen", "million"], correct: 1, why: "months /mʌnθs/ = /n/ + /θ/ + /s/. tested kết thúc /ɪd/; frozen /zn/; million /ən/." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Khởi động — Practice 1 (5 câu Summary completion)" },
      {
        t: "p",
        text: "Một giảng viên dặn dò cuối buổi về chuyến tham quan. Đọc đoạn tóm tắt trong 20 giây, đoán loại từ, rồi nghe **một lần**. Viết **ONE WORD AND/OR A NUMBER** cho mỗi chỗ trống. — The university herbarium contains about **1** ___ sheets of dried plants. Today the **2** ___ attached to the sheets are more useful to researchers than the plants themselves, because they make it possible to study changes in the timing of **3** ___. Students should meet at the main **4** ___ and should bring a **5** ___ to write with.",
      },
      {
        t: "listen",
        id: "t4d13-nghe-ngan",
        title: "A visit to the herbarium",
        dan: { so: "Day 13, Recording 1", boiCanh: "a lecturer giving information about a class visit.", cau: [1, 5] },
        note: "Khoảng 1 phút, giọng Úc (nam). Có hai chỗ nêu thông tin sai trước rồi sửa.",
        lines: [
          { who: "Lecturer", voice: "au-nam", text: "Before we finish, a quick word about next week's visit to the university herbarium. A herbarium, if you haven't come across one, is a collection of dried plants, each pressed flat and mounted on a sheet of card. Ours holds roughly forty thousand sheets. I'd originally been told sixty thousand, but that turned out to include duplicates." },
          { who: "Lecturer", voice: "au-nam", text: "The oldest date from the 1840s. Now, what makes them valuable today isn't so much the plants as the labels, which record exactly where and when each one was picked. Researchers are using those dates to work out how much earlier flowering is taking place as the climate warms." },
          { who: "Lecturer", voice: "au-nam", text: "We'll meet at ten o'clock at the main entrance, not the side door on Park Street, which is being repaired. Please don't bring any food, because insects are the single biggest threat to the collection. And do bring a pencil. Pens aren't permitted anywhere near the specimens." },
        ],
      },
      {
        t: "quiz",
        id: "t4d13-nghe-ngan-dien",
        kind: "fill",
        title: "Practice 1 — Questions 1–5. ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1", answers: ["40,000", "40000", "40 000", "forty thousand"], hint: "“roughly forty thousand sheets. I'd originally been told sixty thousand, but…” — sixty thousand là con số bị sửa." },
          { q: "2", answers: ["labels"], hint: "“isn't so much the plants as the labels” — cấu trúc not so much A as B: B mới là ý chính. Số nhiều." },
          { q: "3", answers: ["flowering"], hint: "“how much earlier flowering is taking place” = changes in the timing of flowering." },
          { q: "4", answers: ["entrance"], hint: "“at the main entrance, not the side door” — door là bẫy." },
          { q: "5", answers: ["pencil"], hint: "“do bring a pencil. Pens aren't permitted” — pen là bẫy." },
        ],
      },
      {
        t: "note",
        title: "📌 Rút ra từ Practice 1",
        items: [
          "Hai lần sửa: sixty thousand → **forty thousand**; side door → **main entrance**. Cả hai lần thông tin sai đều nằm trong câu có **but / not**.",
          "**not so much A as B** (không hẳn là A mà là B) là cách người giảng nhấn — B là đáp án.",
          "Câu 3 cần danh từ sau of; người giảng nói flowering is taking place — cùng từ, khác vai trong câu.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — Part 4, Questions 31–40" },
      {
        t: "p",
        text: "Bạn sẽ nghe một bài giảng môn Nông nghiệp và An ninh lương thực về việc ==bảo tồn sự đa dạng của cây trồng==. Trước khi nghe có 45 giây đọc câu hỏi: dùng 30 giây cho bảng, 15 giây cho đoạn tóm tắt. Nghe **một lần**, không dừng.",
      },
      {
        t: "p",
        text: "**Questions 31–35:** Complete the table below. Write **ONE WORD AND/OR A NUMBER** for each answer.",
      },
      {
        t: "table",
        head: ["Method", "How it works", "Main weaknesses"],
        rows: [
          ["**Seed bank**", "seeds are **31** ___ and then frozen · kept at minus **32** ___ degrees", "samples must be tested every few years; costly to renew"],
          ["**Field gene bank**", "living plants grown outdoors · used for crops with no storable seeds, e.g. bananas", "needs a great deal of **33** ___ · at risk from disease and **34** ___"],
          ["**On-farm conservation**", "farmers go on growing traditional varieties · crops continue to adapt", "farmers stop unless the old variety provides enough **35** ___"],
        ],
        caption: "Conserving crop diversity — three methods",
      },
      {
        t: "p",
        text: "**Questions 36–40:** Complete the summary below. Write **ONE WORD ONLY** for each answer. — **The Svalbard Global Seed Vault** — The vault, which opened in 2008, is best understood as a **36** ___ for seed banks elsewhere in the world. It was constructed inside a **37** ___ so that it will remain dry even if sea levels rise. Boxes of seeds belong to the organisations that send them, and the vault's staff are not permitted to **38** ___ them. The first withdrawal took place in 2015, when war made it impossible to reach a collection in **39** ___. In 2016 water entered the entrance **40** ___, although no seeds were harmed.",
      },
      {
        t: "listen",
        id: "t4d13-nghe-bai",
        title: "Keeping seeds for the future: how crop diversity is conserved",
        dan: { so: "Day 13, Recording 2", boiCanh: "part of a lecture on agriculture and food security, about the conservation of crop diversity.", cau: [31, 40] },
        note: "Khoảng 7 phút, ~165 từ/phút, giọng Úc (nữ). Một người nói, không quãng nghỉ. Câu 31–35: ONE WORD AND/OR A NUMBER · câu 36–40: ONE WORD ONLY.",
        lines: [
          { who: "Lecturer", voice: "au-nu", text: "Good morning, everyone. Last week we looked at how a handful of crops came to feed most of the world. Today I want to turn to the other side of that story: what we've lost along the way, and what's being done to hold on to what's left. I'll start with why crop diversity matters. Then I'll compare three ways of conserving it — you've got a table for that on your handout — and I'll finish with the best-known seed store in the world, the vault at Svalbard, and one or two things about it that the newspapers tend to get wrong." },
          { who: "Lecturer", voice: "au-nu", text: "So, why does diversity matter? Well, a field in which every plant is genetically identical is wonderfully efficient, right up until a disease arrives that the variety can't resist. The classic example is Ireland in the 1840s. Most of the poor depended on a single variety of potato, and when a new disease reached the island, the crop failed several years running. Around a million people are thought to have died. Now, it's often claimed that about three-quarters of the crop varieties grown a century ago have since disappeared from farmers' fields. That figure's been questioned, and I wouldn't lean on it too heavily, but nobody seriously disputes the direction of the trend. And every lost variety may have carried a gene — for drought tolerance, say, or resistance to some pest — that a plant breeder will one day need." },
          { who: "Lecturer", voice: "au-nu", text: "The first person to grasp this on a global scale was the Russian botanist Nikolai Vavilov. In the 1920s and thirties he travelled across five continents collecting seeds, and by 1940 his institute in Leningrad is believed to have held the largest collection in the world. What happened next is one of the more remarkable episodes in the history of science. During the siege of the city, which lasted more than two years, the staff of the institute guarded the collection round the clock. Several of them died of hunger, surrounded by sacks of rice and wheat and peas that they refused to eat. They understood, you see, that those seeds couldn't be replaced. Vavilov himself didn't live to see the collection survive. He'd fallen out with the authorities, and he died in prison in 1943." },
          { who: "Lecturer", voice: "au-nu", text: "Right, so let's go to the table. The first method, and by far the commonest, is the seed bank. The principle is simple. Seeds are dried, until their moisture content is down to around five per cent, and then they're frozen. Dry, cold seeds are in a kind of suspended state, and for many crops — wheat and rice, for instance — they'll stay alive for decades, possibly for centuries. As for the temperature: people often assume that a freezer at about minus five would do. It wouldn't, not for long-term storage. The international standard is minus eighteen degrees. The weakness of seed banks is that seeds don't live for ever. Every few years a sample from each batch has to be tested to see how many still germinate, and if the figure falls too low, the whole batch has to be planted out and fresh seed harvested. That's slow and it's expensive, and in underfunded banks it sometimes simply doesn't get done." },
          { who: "Lecturer", voice: "au-nu", text: "The second method is the field gene bank, which is really just a living collection: the plants themselves, growing in the ground. Why bother? Because not every crop can be stored as seed. Bananas, the kind we eat, produce no seeds at all. And some species, cocoa and mango among them, have seeds that die if you dry them. So for these you have no choice but to keep the plants alive. The drawbacks are obvious enough. To begin with, you need an enormous amount of land. A single coconut collection can cover hundreds of hectares. And the plants are exposed. You might expect insects to be the main worry, and they are a nuisance, but what curators really fear, after disease, is storms. One hurricane can flatten a collection that took fifty years to assemble." },
          { who: "Lecturer", voice: "au-nu", text: "The third approach doesn't involve a bank at all. It's known as on-farm conservation, and it means supporting farmers who carry on growing traditional varieties in the places where those varieties developed. Its great advantage is that the crops don't stand still. A seed in a freezer is the same seed in fifty years' time. A variety in a farmer's field goes on adapting, to new pests, to a changing climate. The difficulty is a human one. Farmers aren't curators. They'll keep an old variety only as long as it gives them a decent income, and when a modern variety offers a bigger harvest, most will switch, and you can hardly blame them. So schemes of this kind usually depend on finding a market that'll pay a bit extra for the traditional crop." },
          { who: "Lecturer", voice: "au-nu", text: "Now, Svalbard. The Global Seed Vault opened in 2008 on a Norwegian island about thirteen hundred kilometres from the North Pole. The press likes to call it the doomsday vault, as if it were waiting for the end of the world. It's not really that. And it isn't a research centre, either. No scientists work there. What it is, quite simply, is a backup. Every seed in it is a duplicate of one held in an ordinary seed bank somewhere else, so that if that bank is lost — to fire, to flood, to a power cut — the material isn't. The site was chosen with care. The vault is tunnelled into the side of a mountain, well above the shoreline, so it should stay dry however far the sea rises. And the frozen rock means that even if the cooling system failed, the seeds would remain below zero for a very long time." },
          { who: "Lecturer", voice: "au-nu", text: "One point that's often misunderstood is who owns the seeds. Norway owns the building, but not the contents. The boxes arrive sealed, and they remain the property of the institution that sent them. The staff at the vault aren't allowed to open them, and nobody else can take them out. It works, in other words, rather like a safety deposit box." },
          { who: "Lecturer", voice: "au-nu", text: "And has it ever been needed? Yes, and sooner than anyone expected. In 2015 an international research institute asked for some of its seeds back. Its main collection was held near Aleppo, in Syria, and because of the war the staff could no longer get to it. So boxes were sent from Svalbard to the institute's new sites in Lebanon and Morocco, the seeds were planted, and fresh copies have since been returned to the vault. One last thing. In 2016, after an unusually warm autumn, meltwater ran into the entrance tunnel. The seeds themselves were never at risk. The water froze long before it got near them. But it was an uncomfortable reminder that even this building was designed for a climate that may no longer exist. The tunnel's since been made waterproof. Next week, we'll look at what plant breeders actually do with all this material." },
        ],
      },
      {
        t: "quiz",
        id: "t4d13-nghe-bang",
        kind: "fill",
        title: "Questions 31–35 — Complete the table. ONE WORD AND/OR A NUMBER",
        items: [
          { q: "31", answers: ["dried"], hint: "“Seeds are dried, until their moisture content is down to around five per cent, and then they're frozen.” Cần phân từ; five (per cent) không phải đáp án của ô này." },
          { q: "32", answers: ["18", "eighteen"], hint: "“people often assume that a freezer at about minus five would do. It wouldn't… The international standard is minus eighteen degrees.” minus five = quan niệm sai." },
          { q: "33", answers: ["land"], hint: "“To begin with, you need an enormous amount of land.” a great deal of = an enormous amount of. hectares là đơn vị trong ví dụ, không phải đáp án." },
          { q: "34", answers: ["storms"], hint: "“You might expect insects to be the main worry… but what curators really fear, after disease, is storms.” insects = bẫy; hurricane là ví dụ đứng sau." },
          { q: "35", answers: ["income"], hint: "“They'll keep an old variety only as long as it gives them a decent income.” harvest thuộc về giống mới, không phải giống cũ." },
        ],
      },
      {
        t: "quiz",
        id: "t4d13-nghe-tom-tat",
        kind: "fill",
        title: "Questions 36–40 — Complete the summary. ONE WORD ONLY",
        items: [
          { q: "36", answers: ["backup", "back-up"], hint: "“It's not really that [doomsday vault]. And it isn't a research centre, either… What it is, quite simply, is a backup.” Hai phương án bị loại trước." },
          { q: "37", answers: ["mountain"], hint: "“tunnelled into the side of a mountain, well above the shoreline, so it should stay dry however far the sea rises.”" },
          { q: "38", answers: ["open"], hint: "“The staff at the vault aren't allowed to open them.” aren't allowed to = are not permitted to." },
          { q: "39", answers: ["Syria"], hint: "“held near Aleppo, in Syria, and because of the war the staff could no longer get to it.” Lebanon và Morocco là nơi hạt được gửi TỚI. (Aleppo cũng là một từ, nhưng tóm tắt viết “a collection in ___” sau khi nói “war” — tên nước là đáp án chuẩn.)" },
          { q: "40", answers: ["tunnel"], hint: "“meltwater ran into the entrance tunnel.” water entered = meltwater ran into." },
        ],
      },
      {
        t: "table",
        head: ["Câu", "Trên giấy", "Người giảng nói", "Kiểu bẫy / paraphrase"],
        rows: [
          ["32", "kept at minus ___ degrees", "people often assume… minus five… It wouldn't… minus eighteen", "quan niệm sai → bác → đúng"],
          ["33", "needs a great deal of", "you need an enormous amount of", "đổi cụm lượng từ"],
          ["34", "at risk from disease and", "what curators really fear, after disease, is", "at risk from ↔ fear; insects bị bác"],
          ["35", "provides enough", "gives them a decent", "provide ↔ give; enough ↔ decent"],
          ["36", "is best understood as a", "What it is, quite simply, is a", "câu chẻ sau hai phương án bị loại"],
          ["38", "are not permitted to", "aren't allowed to", "đồng nghĩa"],
          ["39", "war made it impossible to reach", "because of the war the staff could no longer get to it", "đổi cấu trúc + ba tên nước"],
        ],
      },
      {
        t: "note",
        title: "📌 Người giảng đã rào đón thế nào — và vì sao nó quan trọng",
        items: [
          "**Around a million people are thought to have died** — con số ước đoán ⇒ bị động vô nhân xưng + to have V3.",
          "**it's often claimed that about three-quarters… That figure's been questioned, and I wouldn't lean on it too heavily** — người giảng tự giữ khoảng cách với con số. Nếu đề hỏi “The lecturer is confident that 75% of varieties have been lost” ⇒ sai.",
          "**is believed to have held the largest collection** — không ai đo chính xác ⇒ believed.",
          "**every lost variety may have carried a gene** — suy đoán về quá khứ: may have + V3.",
          "**a climate that may no longer exist** — câu kết cũng rào đón. Người làm khoa học nói như vậy; bài viết Task 2 của bạn cũng nên như vậy.",
        ],
      },
      {
        t: "table",
        head: ["Đúng / 10", "Đánh giá", "Việc cần làm"],
        rows: [
          ["9–10", "Vững Part 4 band 7+", "Nghe lại không nhìn chữ, ghi 10 cụm paraphrase vào sổ"],
          ["8", "Đạt mục tiêu hôm nay", "Xem lại câu sai thuộc kiểu bẫy nào trong bảng trên"],
          ["6–7", "Còn sập bẫy quan niệm sai hoặc lạc hàng", "Nghe lại đoạn 4–6, tay chỉ theo từng ô của bảng"],
          ["≤ 5", "Chưa theo kịp tốc độ", "Ôn Tập 4 Ngày 8 (bốn lớp tín hiệu), rồi nghe lại bài này có mở lời thoại"],
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Từ vựng hữu ích từ bài giảng" },
      {
        t: "vocab",
        items: [
          { w: "variety", pos: "n", ipa: "/vəˈraɪəti/", vi: "giống (cây trồng); sự đa dạng", ex: "Farmers switched to a modern variety with a higher yield.", exVi: "Nông dân chuyển sang một giống hiện đại cho năng suất cao hơn.", more: "a **variety of** wheat / rice · a wide variety of + N số nhiều (nhiều loại)" },
          { w: "germinate", pos: "v", ipa: "/ˈdʒɜːmɪneɪt/", vi: "nảy mầm", ex: "Old seeds may fail to germinate.", exVi: "Hạt cũ có thể không nảy mầm.", more: "germination (n): the germination rate" },
          { w: "resistance", pos: "n", ipa: "/rɪˈzɪstəns/", vi: "sức kháng (bệnh, sâu)", ex: "The gene gives the plant resistance to drought.", exVi: "Gen này giúp cây chịu được hạn.", more: "**resistance to** + N · resistant (adj) **to** · resist (v)" },
          { w: "duplicate", pos: "n / v", ipa: "/ˈdjuːplɪkət/", vi: "bản sao; sao lại", ex: "Every sample in the vault is a duplicate of one held elsewhere.", exVi: "Mọi mẫu trong hầm đều là bản sao của một mẫu lưu ở nơi khác.", more: "động từ đọc /ˈdjuːplɪkeɪt/ · in duplicate (làm hai bản)" },
          { w: "curator", pos: "n", ipa: "/kjʊəˈreɪtə/", vi: "người phụ trách bộ sưu tập", ex: "The curator is responsible for more than 5,000 living plants.", exVi: "Người phụ trách chịu trách nhiệm hơn 5.000 cây sống.", more: "a museum / collection **curator** · curate (v)" },
          { w: "siege", pos: "n", ipa: "/siːdʒ/", vi: "cuộc bao vây", ex: "The city was under siege for more than two years.", exVi: "Thành phố bị bao vây hơn hai năm.", more: "be **under siege** · lay siege to a city" },
          { w: "underfunded", pos: "adj", ipa: "/ˌʌndəˈfʌndɪd/", vi: "thiếu kinh phí", ex: "Underfunded hospitals struggle to keep staff.", exVi: "Bệnh viện thiếu kinh phí khó giữ chân nhân viên.", more: "chronically / seriously **underfunded** · funding (n)" },
          { w: "withdrawal", pos: "n", ipa: "/wɪðˈdrɔːəl/", vi: "việc rút ra (tiền, mẫu, quân)", ex: "The first withdrawal from the vault took place in 2015.", exVi: "Lần rút mẫu đầu tiên khỏi hầm diễn ra năm 2015.", more: "withdraw (v): withdrew – withdrawn · make a withdrawal" },
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài này",
        items: [
          "Mở lời thoại, gạch chân mọi chỗ người giảng dùng **People often assume… / You might expect… / What it is… is…** — đó là khuôn của bẫy Part 4.",
          "Đọc to đoạn về seed bank (đoạn 4), để ý âm cuối: see**ds** are drie**d** · the**y'll** stay alive for deca**des** · has to be teste**d**.",
          "Bài tập Ngày 13 phần VII có một đoạn nghe ngắn cùng dạng bảng.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 13 ═══════════════════════════ */
  {
    id: "t4d13-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 13 — rào đón · bị động vô nhân xưng · referencing / substitution / ellipsis · đọc mức chắc chắn · Part 4 bảng · âm cuối",
    goal: "Ôn trọn Ngày 13: chọn đúng công cụ rào đón, viết lại câu bằng hai khuôn bị động vô nhân xưng, nối câu bằng this + danh từ tóm tắt / such / that of / one / do so / lược bỏ, sửa sáu lỗi tinh của người Việt, đọc một đoạn lập luận và trả lời câu YES / NO / NOT GIVEN có bẫy mức chắc chắn, nghe một đoạn so sánh ba phương pháp để điền bảng — 47 câu có đáp án và một đoạn viết AI chấm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "47 câu, 8 phần. Làm một mạch, chấm, rồi quay lại đúng mục của bài mà phần đó ghi.",
          "Phần I–V ôn **Bài 1** (ngữ pháp); phần VI ôn **Bài 2** (đọc mức chắc chắn); phần VII–VIII ôn **Bài 3** (nghe bảng, âm cuối); phần IX viết một thân bài.",
          "Mốc đạt: ==mỗi phần ≥ 70 %==. Phần nào dưới mốc ⇒ đọc lại mục ghi ở tiêu đề phần đó trước khi sang Ngày 14.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 13 trong một hình",
        center: "Nói đúng mức · nối không lặp",
        branches: [
          { label: "Rào đón", items: ["may · tend to · appear to", "arguably · largely", "It is likely that…", "to some extent"] },
          { label: "Vô nhân xưng", items: ["It is believed that…", "X is believed to V", "to have V3 · to be V-ing"] },
          { label: "Quy chiếu", items: ["this + danh từ tóm tắt", "such + N", "the former / the latter", "that of / those of"] },
          { label: "Thay thế · lược bỏ", items: ["one / ones", "do so · if so", "than expected", "…, but few do"] },
        ],
      },

      { t: "h", text: "I. Rào đón — điền từ trong hộp (8 câu) — ôn Bài 1 mục 2–3" },
      {
        t: "note",
        title: "Hộp từ (mỗi từ dùng một lần)",
        items: ["**appears · arguably · extent · largely · likely · may · suggest · tend**"],
      },
      {
        t: "quiz",
        id: "t4d13-bt-rao",
        kind: "fill",
        title: "I. Điền từ trong hộp",
        items: [
          { q: "1. People who grow up in large families ___ to be more sociable.", answers: ["tend"], hint: "___ to + V: thường có xu hướng" },
          { q: "2. The fall in crime ___ to be connected with better street lighting.", answers: ["appears"], hint: "chủ ngữ số ít ⇒ động từ có -s" },
          { q: "3. Early figures ___ that the scheme has reduced traffic by a fifth.", answers: ["suggest"], hint: "figures (số nhiều) + V nguyên mẫu + that" },
          { q: "4. Electric cars are ___ to become cheaper over the next decade.", answers: ["likely"], hint: "are ___ to + V" },
          { q: "5. The success of the project was ___ due to one determined teacher.", answers: ["largely"], hint: "trạng từ phạm vi: phần lớn" },
          { q: "6. This is ___ the most difficult decision the council has faced.", answers: ["arguably"], hint: "có thể nói là" },
          { q: "7. Higher taxes on sugar ___ not change eating habits on their own.", answers: ["may"], hint: "modal + not + V" },
          { q: "8. To a certain ___, the critics are right.", answers: ["extent"], hint: "To a certain ___" },
        ],
      },

      { t: "h", text: "II. Bị động vô nhân xưng — viết lại (6 câu) — ôn Bài 1 mục 4" },
      {
        t: "quiz",
        id: "t4d13-bt-vo-nhan-xung",
        kind: "fill",
        title: "II. Gõ CẢ câu, bắt đầu bằng từ cho sẵn",
        items: [
          { q: "1. People believe that stress causes many illnesses. → Stress …", answers: ["Stress is believed to cause many illnesses."], hint: "is believed to + V" },
          { q: "2. People say that the author wrote the novel in six weeks. → The author …", answers: ["The author is said to have written the novel in six weeks."], hint: "to have + V3" },
          { q: "3. Experts estimate that the repairs will cost two million dollars. → It …", answers: ["It is estimated that the repairs will cost two million dollars.", "It is estimated that the repairs will cost $2 million.", "It is estimated that the repairs will cost 2 million dollars."], hint: "It is estimated that…" },
          { q: "4. People think that the company is losing money. → The company …", answers: ["The company is thought to be losing money."], hint: "to be + V-ing" },
          { q: "5. People know that there are risks. → There …", answers: ["There are known to be risks."], hint: "There are known to be" },
          { q: "6. People once thought that the Earth was flat. → It …", answers: ["It was once thought that the Earth was flat.", "It was once thought that the earth was flat."], hint: "It was once thought that…" },
        ],
      },

      { t: "h", text: "III. Referencing · substitution · ellipsis (8 câu) — ôn Bài 1 mục 5–7" },
      {
        t: "mcq",
        id: "t4d13-bt-lien-ket",
        title: "III. Chọn phương án đúng",
        items: [
          { q: "1. House prices have tripled, yet salaries have barely moved. This ___ explains why so few young people can buy a home.", options: ["gap", "claim", "progress", "approach"], correct: 0, why: "Câu trước mô tả khoảng cách giữa giá nhà và lương ⇒ this gap. claim = lời khẳng định; progress = tiến bộ; approach = cách tiếp cận." },
          { q: "2. Some airlines charge passengers for hand luggage. ___ charges are deeply unpopular.", options: ["Such a", "The such", "Such", "So"], correct: 2, why: "such + danh từ số nhiều, không a, không the." },
          { q: "3. The climate of the coast is milder than ___ the mountains.", options: ["those of", "one of", "it of", "that of"], correct: 3, why: "that of thay cho the climate (số ít)." },
          { q: "4. Trains and coaches both serve the route; the former are faster, but ___ are far cheaper.", options: ["the latter", "the later", "the last", "the second ones"], correct: 0, why: "the latter = cái sau trong hai. later = muộn hơn (sai chính tả nghĩa)." },
          { q: "5. Paper tickets are being replaced by digital ___.", options: ["one", "ones", "them", "those ones"], correct: 1, why: "ones thay tickets (số nhiều) sau tính từ." },
          { q: "6. Customers were invited to give feedback, but only a handful ___.", options: ["did it so", "were so", "did so", "so did"], correct: 2, why: "did so = gave feedback." },
          { q: "7. The damage was less serious than ___.", options: ["it feared", "feared", "was fear", "fearing"], correct: 1, why: "than feared = than (had been) feared — lược bỏ sau than. it feared sai vì thiếu bị động." },
          { q: "8. Which sentence is correct?", options: ["The firm has always and will always respect its customers.", "While reading the report, several errors were found.", "Is it legal? If yes, we can go ahead.", "Unless otherwise stated, prices include tax."], correct: 3, why: "Unless (it is) otherwise stated = lược bỏ đúng. A: has always respected…; B: chủ ngữ lệch; C: If so." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–6" },
      {
        t: "quiz",
        id: "t4d13-bt-dich",
        kind: "translate",
        title: "IV. Dịch — dùng từ trong gợi ý",
        grammar: "tend to · It is widely believed that · is expected to · such + N · do so",
        items: [
          { q: "1. Người lớn tuổi thường có xu hướng tiết kiệm nhiều hơn người trẻ.", answers: ["Older people tend to save more than younger people.", "Older people tend to save more than young people.", "Older people tend to save more than younger ones.", "Older people tend to save more than the young."], hint: "tend to save" },
          { q: "2. Nhiều người tin rằng trẻ em học ngoại ngữ nhanh hơn người lớn. (bắt đầu bằng It)", answers: ["It is widely believed that children learn foreign languages faster than adults.", "It is widely believed that children learn languages faster than adults.", "It is widely believed that children learn foreign languages more quickly than adults.", "It is commonly believed that children learn foreign languages faster than adults."], hint: "It is widely believed that" },
          { q: "3. Cây cầu mới được kỳ vọng sẽ mở cửa vào năm tới. (bắt đầu bằng The new bridge)", answers: ["The new bridge is expected to open next year."], hint: "is expected to + V" },
          { q: "4. Những biện pháp như vậy hiếm khi có hiệu quả.", answers: ["Such measures are rarely effective.", "Such measures are seldom effective."], hint: "Such measures" },
          { q: "5. Người lao động có thể khiếu nại, nhưng ít người làm vậy.", answers: ["Workers can complain, but few do so.", "Employees can complain, but few do so.", "Workers can complain, but few do.", "Workers may complain, but few do so."], hint: "few do so" },
        ],
      },

      { t: "h", text: "V. Sửa lỗi — gõ lại phần trong ngoặc vuông cho đúng (6 câu) — ôn các ô ⚠️ của Bài 1" },
      {
        t: "quiz",
        id: "t4d13-bt-sua-loi",
        kind: "fill",
        title: "V. Mỗi câu một lỗi ở phần [trong ngoặc]",
        items: [
          { q: "1. This [maybe] the result of poor planning.", answers: ["may be", "might be", "could be"], hint: "động từ: hai từ" },
          { q: "2. The castle is believed [to be built] in 1750.", answers: ["to have been built"], hint: "việc xây đã xong trước lúc thuật" },
          { q: "3. Older employees tend [to earning] more.", answers: ["to earn"], hint: "tend to + V nguyên mẫu" },
          { q: "4. The price of rice is higher than [this] of wheat.", answers: ["that"], hint: "that of" },
          { q: "5. [Such a] policies are rarely popular.", answers: ["Such"], hint: "danh từ số nhiều không a" },
          { q: "6. Is the plan affordable? [If yes], we should proceed.", answers: ["If so"], hint: "so thay cả mệnh đề" },
        ],
      },

      { t: "h", text: "VI. Đọc — mức chắc chắn của người viết (5 câu) — ôn Bài 2, câu 29 · 32–36" },
      {
        t: "passage",
        title: "Does Homework Help?",
        paras: [
          { text: "The belief that homework improves achievement is so widespread that it is rarely examined. The evidence, however, is less clear than is commonly assumed. Among secondary pupils, those who do more homework tend to obtain higher grades, although it is not certain that the former causes the latter: able and motivated students may simply be more willing to do extra work. Among children under eleven, the link appears to be weak or absent, and at least one large review found no measurable benefit at all." },
          { text: "Supporters of homework reply that test scores are not the only thing that matters. Regular tasks completed alone, they argue, teach children to organise their time. This may well be so, but it has seldom been tested, and it could equally be argued that the same habits are acquired through sport, music or household duties." },
          { text: "What does seem reasonably well established is that the quality of a task matters more than its length. A short exercise that requires pupils to recall what they learned earlier in the week is likely to be of more use than an hour spent copying from a textbook. Schools that wish to keep homework would therefore do well to set less of it, and to set it more carefully." },
        ],
      },
      {
        t: "mcq",
        id: "t4d13-bt-doc",
        title: "VI. Do the statements agree with the views of the writer? YES / NO / NOT GIVEN",
        items: [
          { q: "1. The idea that homework raises achievement is frequently questioned.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“so widespread that it is rarely examined” — rarely ↔ frequently." },
          { q: "2. For secondary pupils, it has been shown that doing more homework causes higher grades.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“it is not certain that the former causes the latter” — có tương quan (tend to obtain higher grades) nhưng chưa chắc là nguyên nhân. Bẫy mức chắc chắn." },
          { q: "3. Homework is of greater benefit to girls than to boys.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài không so nam – nữ." },
          { q: "4. Little research has been done on whether homework teaches children to manage their time.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“This may well be so, but it has seldom been tested.” seldom tested = little research." },
          { q: "5. A brief task that makes pupils remember earlier lessons is probably more useful than a long copying task.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“A short exercise that requires pupils to recall… is likely to be of more use than an hour spent copying.” is likely to = probably — mức chắc chắn khớp." },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: năm chỗ rào đón và thay thế trong đoạn văn trên",
        items: [
          "**tend to obtain** · **appears to be weak** · **may well be so** · **it could equally be argued that** · **is likely to be** — rào đón.",
          "**the former causes the latter** (former = doing more homework; latter = higher grades) — quy chiếu.",
          "**This may well be so** — so thay cho cả mệnh đề “regular tasks teach children to organise their time”.",
          "**to set less of it** — it = homework.",
        ],
      },

      { t: "h", text: "VII. Nghe — bảng so sánh ba phương pháp (5 câu) — ôn Bài 3 mục 1–2" },
      {
        t: "p",
        text: "Một giảng viên tóm tắt ba cách lưu giữ kho báo cũ của thư viện. Đọc bảng trong 20 giây rồi nghe **một lần**. Viết **ONE WORD AND/OR A NUMBER**.",
      },
      {
        t: "table",
        head: ["Method", "Advantage", "Drawback"],
        rows: [
          ["Original paper copies", "readers see the real thing", "pages become fragile because of the **1** ___ in the paper, after about **2** ___ years"],
          ["Microfilm", "lasts around **3** ___ years", "cannot be **4** ___"],
          ["Digital scans", "can be read from home", "files have to be **5** ___ to new systems regularly"],
        ],
        caption: "Preserving the newspaper archive",
      },
      {
        t: "listen",
        id: "t4d13-bt-nghe",
        title: "Three ways to keep old newspapers",
        dan: { so: "Day 13, Recording 3", boiCanh: "the end of a talk about a library's newspaper archive.", cau: [1, 5] },
        note: "Khoảng 1 phút 10 giây, giọng Anh (nữ). Có hai chỗ nêu điều người ta hay tưởng rồi bác.",
        lines: [
          { who: "Lecturer", voice: "uk-nu", text: "So, to sum up the three options the library considered for its newspaper archive. The first was simply to keep the original paper copies. The attraction is obvious: readers get the real thing. But there's a problem with newsprint. I'd always assumed damp was the main enemy, but it's actually the acid in the paper itself, and after about fifty years the pages become too fragile to handle." },
          { who: "Lecturer", voice: "uk-nu", text: "The second option, microfilm, was the standard solution for most of the last century. Stored properly, film is expected to last around five hundred years, which is remarkable. Its drawback is that it can't be searched. You have to scroll through every single page." },
          { who: "Lecturer", voice: "uk-nu", text: "The third option is digital scanning. Here the great advantage is access, since anyone can read the archive from home. The weakness isn't the cost of scanning, as you might think. It's that file formats change, so the files have to be copied to new systems every decade or so. In the end, the library decided to do both film and scans." },
        ],
      },
      {
        t: "quiz",
        id: "t4d13-bt-nghe-dien",
        kind: "fill",
        title: "VII. Questions 1–5 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1", answers: ["acid"], hint: "“I'd always assumed damp was the main enemy, but it's actually the acid in the paper itself.” damp = quan niệm sai." },
          { q: "2", answers: ["50", "fifty"], hint: "“and after about fifty years the pages become too fragile to handle” — nói ngay sau acid." },
          { q: "3", answers: ["500", "five hundred"], hint: "“film is expected to last around five hundred years”." },
          { q: "4", answers: ["searched"], hint: "“it can't be searched” — cần V3 sau be." },
          { q: "5", answers: ["copied"], hint: "“the files have to be copied to new systems every decade or so”. cost of scanning = điều bị bác." },
        ],
      },

      { t: "h", text: "VIII. Âm cuối trong chuỗi từ (4 câu) — ôn Bài 3 mục 3" },
      {
        t: "mcq",
        id: "t4d13-bt-am-cuoi",
        title: "VIII. Chọn phương án đúng",
        items: [
          { q: "1. Trong “most crops are kept cold”, từ nào nối sang nguyên âm của từ sau?", options: ["most", "crops", "kept", "cold"], correct: 1, why: "crops + are: /krɒp·sə/. Các từ khác đứng trước phụ âm hoặc cuối câu." },
          { q: "2. Cách đọc “kept cold” đúng nhất:", options: ["/kep kəʊl/ — bỏ cả hai âm cuối", "/keptə kəʊldə/ — thêm nguyên âm đệm", "/kept kəʊld/ — /t/ chặn hơi, không bật; /d/ cuối vẫn có", "/ket kəʊd/"], correct: 2, why: "C là cách đọc cẩn thận: /p/ /t/ chặn hơi, không bật, không thêm nguyên âm; /d/ cuối cụm vẫn phát đủ. (Nói nhanh, /t/ kẹp giữa /p/ và /k/ được lướt thành /kep kəʊld/ — Ngày 5. A sai vì mất luôn /d/ cuối; B thêm nguyên âm đệm; D mất /p/ và /l/.)" },
          { q: "3. Bạn nghe /ðə test wəz rɪpiːtɪd/. Số ít hay số nhiều?", options: ["Không thể biết", "Số nhiều: tests were", "Số nhiều: tests was", "Số ít: the test was"], correct: 3, why: "/test/ không có /s/ + /wəz/ = was ⇒ số ít. Hai tín hiệu khớp nhau." },
          { q: "4. Cụm nào có /s/ cuối từ KHÔNG được bỏ dù đứng trước phụ âm?", options: ["banks need", "last night", "next day", "must be"], correct: 0, why: "banks: /s/ là dấu số nhiều. Ba cụm còn lại là /t/ kẹt giữa phụ âm — được lướt (Ngày 5)." },
        ],
      },

      { t: "h", text: "IX. Viết một thân bài có rào đón và liên kết (100–130 từ) — AI chấm" },
      {
        t: "p",
        text: "Viết **một** thân bài cho đề dưới đây. Yêu cầu bắt buộc: (1) câu chủ đề nêu ý rõ; (2) ít nhất **ba** chỗ rào đón thuộc ba nhóm khác nhau (động từ · trạng từ · cụm phạm vi); (3) **một** câu bị động vô nhân xưng; (4) **một** lần This / Such + danh từ; (5) **một** lần one / do so / lược bỏ. Viết xong tự gạch chân năm thứ đó trước khi bấm chấm.",
      },
      {
        t: "essay",
        id: "t4d13-bt-viet-doan",
        task: "Task 2",
        prompt: "Topic: Many people believe that social media has made young people less able to concentrate. To what extent do you agree or disagree? — Write ONLY ONE body paragraph (100–130 words) explaining one reason why this may be true. Include: at least three hedges of different kinds (e.g. tend to / arguably / to some extent), one impersonal passive (It is often claimed that… / … is thought to …), one “This / Such + noun” link, and one use of “one(s)”, “do so” or ellipsis.",
        minWords: 100,
        tips: [
          "Câu chủ đề chắc (lập trường), các câu về nguyên nhân – hệ quả thì rào: may, tend to, is likely to.",
          "Không rào hai lớp trên cùng một động từ: ~~may possibly~~.",
          "Câu thứ hai hoặc thứ ba mở bằng This habit / This pattern / Such interruptions…",
          "Soát: maybe ↔ may be · tend to + V · It is said that (không phải It said that).",
        ],
      },
      {
        t: "note",
        title: "📌 Một thân bài mẫu để so sau khi đã viết (band 7, ước tính)",
        items: [
          "One reason for this concern is that social media platforms are designed to interrupt. **It is often claimed that** the average user checks a phone dozens of times a day, and although such figures should be treated with caution, **frequent switching between tasks appears to** make sustained reading more difficult. **This habit** is **arguably** most damaging during homework, when a student who intends to study for an hour **may** in practice manage only a few uninterrupted minutes. Older generations faced distractions too, but theirs were easier to switch off than the **ones** young people carry today. **To some extent**, therefore, the problem lies less in young people themselves than in the tools they have been given.",
          "Đếm: 1 vô nhân xưng (It is often claimed that) · 4 rào đón (appears to · arguably · may · To some extent) · 1 This + danh từ (This habit) · 1 ones.",
        ],
      },
    ],
  },
];
