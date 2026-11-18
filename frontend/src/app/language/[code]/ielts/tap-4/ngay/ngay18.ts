/**
 * IELTS Tập 4 — Ngày 18 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, số liệu, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Idiom & register: 24 thành ngữ dùng được khi Nói · 16 động từ trang trọng thay phrasal verb khi Viết ·
 *                     vùng xám (ẩn dụ học thuật) · lỗi sai dạng thành ngữ   [VD7 VD8] — nối Tập 3 Ngày 30 · Tập 4 Ngày 10
 *   Bài 2 (writing)   Task 1 pie 3 — ba pie theo NHÓM (không có trục thời gian), so sánh chéo; band 6 vs band 7 [W10]
 *                     — nối Tập 2 Ngày 12 · Tập 3 Ngày 16
 *   Bài 3 (speaking)  Part 3 band 7: ví dụ cá nhân → xã hội; paraphrase câu hỏi nâng cao [S06 S10] 🔊 ngữ điệu thái độ [S15]
 *   Homework 33 câu · Kiểm tra chặng (Ngày 13–18) `t4d18-kiem-tra`.
 */
import type { Lesson } from '../data';

export const NGAY_18: Lesson[] = [
  {
    id: "t4d18-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Idiom & register — lúc nào dùng (Speaking), lúc nào không (Writing)",
    goal: "Dùng đúng nguyên dạng 24 thành ngữ tự nhiên trong Speaking (19 cụm mới như cut both ways, thrown in at the deep end, in two minds… + 5 cụm ôn Tập 3 có ghi “ôn”), biết vì sao KHÔNG đưa chúng vào Writing, và đổi được câu đời thường sang văn phong học thuật bằng 16 động từ trang trọng (look into → investigate, put up with → tolerate).",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **LR của cả Speaking và Writing**. Band 7 LR ghi: dùng từ ít gặp và thành ngữ **có ý thức về văn phong (style) và collocation**.",
          "**Register** (văn phong) = mức trang trọng của từ. Cùng một nghĩa có ba nấc: kids (thân mật) · children (trung tính) · minors / offspring (trang trọng).",
          "**Speaking**: thân mật → trung tính. Thành ngữ và phrasal verb **được điểm** nếu đúng dạng, đúng chỗ, **1–2 cái mỗi câu trả lời dài**.",
          "**Writing**: trung tính → trang trọng. **Không** thành ngữ đời thường, không viết tắt, không phrasal verb khi có động từ đơn tương đương.",
          "**Vùng xám**: ẩn dụ đã thành ngôn ngữ học thuật (play a pivotal role, pave the way for, strike a balance) **dùng được** trong Task 2.",
          "Thành ngữ sai một chữ là **mất điểm chứ không được điểm**: ~~cost an arm and leg~~, ~~once in a blue moons~~.",
        ],
      },

      { t: "h", text: "1. Register — ba nấc, hai bài thi" },
      { t: "p", text: "Người bản ngữ không nói với giám khảo như viết luận, và không viết luận như nhắn tin. Giám khảo band 7 nghe / đọc xem bạn có **chọn đúng nấc** không. Lỗi điển hình của người học band 6.5: **nói như sách** trong Speaking (Moreover, it is undeniable that…) và **viết như nói** trong Writing (Nowadays kids spend loads of time on their phones)." },
      {
        t: "table",
        head: ["Nghĩa", "Thân mật (bạn bè)", "Trung tính (Speaking · báo chí)", "Trang trọng (Writing Task 2)"],
        rows: [
          ["trẻ em", "kids", "children", "children · minors · young people"],
          ["nhiều", "loads of · tons of", "a lot of · plenty of", "a great deal of · numerous · a considerable number of"],
          ["tìm hiểu", "check out", "look into", "investigate · examine"],
          ["chịu đựng", "—", "put up with", "tolerate"],
          ["tăng", "shoot up", "go up", "rise · increase"],
          ["rất quan trọng", "a big deal", "really important", "of considerable importance · crucial"],
          ["tôi nghĩ", "I reckon", "I think · I'd say", "It can be argued that · In my view"],
          ["vì vậy", "so", "so · that's why", "therefore · consequently · as a result"],
        ],
      },
      {
        t: "sodo", kind: "compare", title: "Nấc nào cho bài nào",
        cols: [
          { title: "🗣 Speaking Part 1–3", items: ["thân mật vừa phải → trung tính", "**nên có**: viết tắt (I'd, it's), phrasal verb, 1–2 thành ngữ, từ đệm (well, I mean)", "**tránh**: Moreover / Furthermore / In conclusion; tiếng lóng nặng (gonna, wanna, ain't)"] },
          { title: "✍️ Writing Task 1 · Task 2", items: ["trung tính → trang trọng", "**nên có**: động từ đơn (investigate), danh hoá, collocation học thuật, hedging", "**tránh**: thành ngữ đời thường, viết tắt, câu hỏi tu từ, thing / stuff / a lot of, dấu chấm than"] },
        ],
      },

      { t: "h", text: "2. “Idiomatic language” trong bảng chấm nghĩa là gì" },
      { t: "p", text: "Nhiều người tưởng band 7 đòi nhét thành ngữ kiểu “raining cats and dogs”. Không phải. **Idiomatic language** là mọi cách nói mà nghĩa không suy ra được từ từng từ, và người bản ngữ dùng **hằng ngày**. Nó gồm bốn loại, xếp từ an toàn nhất tới rủi ro nhất." },
      {
        t: "table",
        head: ["Loại", "Ví dụ", "Rủi ro"],
        rows: [
          ["**Collocation** tự nhiên (Ngày 6)", "make a living · heavy traffic · a tight budget", "thấp — dùng thoải mái"],
          ["**Phrasal verb**", "end up · catch up on · put off · get round to", "thấp — đây là “idiomatic” dễ ghi điểm nhất khi Nói"],
          ["**Cụm cố định**", "to be honest · by and large · more often than not · as far as I can tell", "thấp"],
          ["**Thành ngữ hình ảnh**", "a silver lining · the last straw · out of the blue", "cao — sai một chữ hoặc sai chỗ là lộ"],
        ],
      },
      { t: "note", title: "Ghi nhớ: giám khảo nghe “tự nhiên”, không đếm thành ngữ", items: ["Một câu trả lời Part 3 có **hai phrasal verb đúng + một cụm cố định** đã là “idiomatic”. Thành ngữ hình ảnh là phần thưởng thêm, không phải điều kiện.", "Thành ngữ chỉ ghi điểm khi nó **đúng ý bạn đang nói**. Nói về một buổi hoà nhạc rồi chêm “it was a piece of cake” là sai nghĩa (dễ như ăn bánh ≠ tuyệt vời)."] },

      { t: "h", text: "3. 24 thành ngữ dùng được trong Speaking (19 mới · 5 ôn) — nhóm A: đánh giá, cân nhắc (8)" },
      { t: "p", text: "Ba nhóm dưới đây chọn theo một tiêu chí: người bản ngữ **vẫn đang dùng**, và **hợp chủ đề Part 3** (đánh giá, khó khăn, tiền, thời gian). Phần **more** ghi cách đệm cho tự nhiên và lỗi sai dạng." },
      {
        t: "vocab",
        items: [
          { w: "cut both ways", pos: "idiom", ipa: "/ˌkʌt bəʊθ ˈweɪz/", vi: "có cả lợi lẫn hại; tác động theo cả hai chiều", ex: "Social media cuts both ways: it connects people, but it also spreads rumours.", exVi: "Mạng xã hội có cả hai mặt: nó kết nối mọi người nhưng cũng lan tin đồn.", more: "đệm: **I'd say it cuts both ways, really** · chủ ngữ là sự việc (it / this / technology) · thay cho ~~Every coin has two sides~~ (câu dịch sáo) · cùng nghĩa: a double-edged sword (Tập 3 Ngày 30)." },
          { w: "a silver lining", pos: "idiom", ipa: "/ə ˌsɪlvə ˈlaɪnɪŋ/", vi: "điểm sáng trong chuyện không may", ex: "Losing the contract was a blow, but the silver lining was that I finally had time to study.", exVi: "Mất hợp đồng là một cú sốc, nhưng điểm sáng là cuối cùng tôi cũng có thời gian học.", more: "hay dùng: **the (one) silver lining is / was that…** · **there's a silver lining to** sth · gốc tục ngữ Every cloud has a silver lining — nói cả câu nghe cũ, nói nửa cụm thì tự nhiên · gần nghĩa: a blessing in disguise (Tập 3 Ngày 30)." },
          { w: "the tip of the iceberg", pos: "idiom", ipa: "/ðə ˌtɪp əv ði ˈaɪsbɜːɡ/", vi: "phần nổi của tảng băng chìm", ex: "The complaints we hear about are just the tip of the iceberg.", exVi: "Những lời phàn nàn ta nghe được chỉ là phần nổi của tảng băng.", more: "thường có **just / only** phía trước · sai: ~~the top of the iceberg~~ · **ôn Tập 3 Ngày 30** — giữ lại vì là ví dụ chuẩn của luật “đúng nguyên dạng”." },
          { w: "a drop in the ocean", pos: "idiom", ipa: "/ə ˌdrɒp ɪn ði ˈəʊʃn/", vi: "muối bỏ bể", ex: "Recycling one bottle feels like a drop in the ocean, but it adds up.", exVi: "Tái chế một cái chai có vẻ như muối bỏ bể, nhưng cộng lại thì đáng kể.", more: "Anh-Mỹ: a drop in the bucket · sai: ~~a drop of the ocean~~ · **ôn Tập 3 Ngày 30** — giữ lại vì là ví dụ chuẩn của luật “đúng nguyên dạng”." },
          { w: "food for thought", pos: "idiom", ipa: "/ˌfuːd fə ˈθɔːt/", vi: "điều đáng suy ngẫm", ex: "The documentary gave me plenty of food for thought.", exVi: "Bộ phim tài liệu cho tôi nhiều điều đáng suy ngẫm.", more: "không đếm được: **some / plenty of** food for thought, không ~~a food for thought~~." },
          { w: "sit on the fence", pos: "idiom", ipa: "/ˌsɪt ɒn ðə ˈfens/", vi: "đứng giữa, không chịu chọn bên", ex: "I don't want to sit on the fence, so I'll say yes, on balance it's a good thing.", exVi: "Tôi không muốn lưng chừng, nên tôi nói là có, nhìn chung đó là điều tốt.", more: "hay dùng trong Part 3 trước khi nêu ý kiến rõ." },
          { w: "be in two minds (about)", pos: "idiom", ipa: "/ɪn ˌtuː ˈmaɪndz/", vi: "phân vân, lưỡng lự", ex: "I'm in two minds about working abroad after I graduate.", exVi: "Tôi đang phân vân về việc ra nước ngoài làm sau khi tốt nghiệp.", more: "sai: ~~in two mind~~ · ~~have two minds~~." },
          { w: "a far cry from", pos: "idiom", ipa: "/ə ˌfɑː ˈkraɪ frəm/", vi: "khác xa so với", ex: "City life today is a far cry from what my grandparents knew.", exVi: "Đời sống thành phố ngày nay khác xa những gì ông bà tôi từng biết.", more: "rất hợp câu hỏi **so sánh xưa – nay** của Part 3." },
        ],
      },
      { t: "h", text: "4. Nhóm B: nỗ lực, khó khăn, tiền bạc (8)" },
      {
        t: "vocab",
        items: [
          { w: "be thrown in at the deep end", pos: "idiom", ipa: "/bi ˌθrəʊn ɪn ət ðə ˌdiːp ˈend/", vi: "bị giao việc khó ngay từ đầu, không được hướng dẫn", ex: "On my first day I was thrown in at the deep end and asked to run the meeting.", exVi: "Ngay ngày đầu tôi đã bị giao việc khó: điều hành cuộc họp.", more: "thường ở bị động · đủ cả **in** và **at**: in at the deep end · gần nghĩa: a steep learning curve (Ngày 10)." },
          { w: "find your feet", pos: "idiom", ipa: "/ˌfaɪnd jɔː ˈfiːt/", vi: "dần quen và tự tin ở chỗ mới", ex: "It took me a couple of months to find my feet at university.", exVi: "Tôi mất vài tháng mới quen và vững vàng ở đại học.", more: "đổi tính từ sở hữu: find **my / her / their** feet · sai: ~~find my foot~~ · khác get the hang of sth (Tập 3 Ngày 30): find your feet nói về MÔI TRƯỜNG mới, get the hang of nói về MỘT KỸ NĂNG." },
          { w: "pull your weight", pos: "idiom", ipa: "/ˌpʊl jɔː ˈweɪt/", vi: "làm đủ phần việc của mình (trong nhóm)", ex: "In group projects there's usually one person who doesn't pull their weight.", exVi: "Trong dự án nhóm thường có một người không làm đủ phần của mình.", more: "hay dùng ở phủ định: **not pull your weight** · đổi tính từ sở hữu theo chủ ngữ · khác go the extra mile (Ngày 6 · 8) = làm HƠN mức yêu cầu." },
          { w: "cut corners", pos: "idiom", ipa: "/ˌkʌt ˈkɔːnəz/", vi: "làm ẩu, làm tắt cho nhanh / rẻ", ex: "When builders cut corners, it's the residents who pay later.", exVi: "Khi thợ xây làm ẩu, cư dân là người trả giá về sau.", more: "luôn số nhiều: ~~cut a corner~~ (nghĩa đen: cắt góc đường)." },
          { w: "pull an all-nighter", pos: "idiom", ipa: "/ˌpʊl ən ˌɔːl ˈnaɪtə/", vi: "thức trắng đêm (học, làm việc)", ex: "I pulled an all-nighter before my statistics exam, and I regretted it.", exVi: "Tôi thức trắng đêm trước kỳ thi thống kê, và đã hối hận.", more: "rất thân mật — chỉ khi Nói · số nhiều: pull **all-nighters** · gần nghĩa: burn the midnight oil (Tập 3 Ngày 30) = thức khuya, chưa chắc trắng đêm." },
          { w: "tighten your belt", pos: "idiom", ipa: "/ˌtaɪtn jɔː ˈbelt/", vi: "thắt lưng buộc bụng, chi tiêu dè sẻn", ex: "When rents went up, a lot of young families had to tighten their belts.", exVi: "Khi tiền thuê nhà tăng, nhiều gia đình trẻ phải thắt lưng buộc bụng.", more: "đổi theo chủ ngữ: families tighten **their belts** · Writing dùng **cut back on spending** · gần nghĩa: struggle to make ends meet (Ngày 14)." },
          { w: "cost an arm and a leg", pos: "idiom", ipa: "/ˌkɒst ən ˌɑːm ənd ə ˈleɡ/", vi: "đắt cắt cổ", ex: "A flat in the city centre costs an arm and a leg these days.", exVi: "Dạo này một căn hộ ở trung tâm đắt cắt cổ.", more: "sai: ~~cost an arm and leg~~ · ~~cost arms and legs~~ · chỉ dùng khi Nói · **ôn Tập 3 Ngày 30** — giữ lại vì là ví dụ chuẩn của luật “đúng nguyên dạng”." },
          { w: "the last straw", pos: "idiom", ipa: "/ðə ˌlɑːst ˈstrɔː/", vi: "giọt nước tràn ly", ex: "The rent increase was the last straw, so we moved out.", exVi: "Việc tăng tiền thuê là giọt nước tràn ly, nên chúng tôi dọn đi.", more: "cũng nói **the final straw** · sai: ~~the last drop~~ (dịch từ tiếng Việt)." },
        ],
      },
      { t: "h", text: "5. Nhóm C: thời gian, tần suất, cảm xúc (8)" },
      {
        t: "vocab",
        items: [
          { w: "once in a blue moon", pos: "idiom", ipa: "/ˌwʌns ɪn ə ˌbluː ˈmuːn/", vi: "rất hiếm khi", ex: "I only go to the cinema once in a blue moon.", exVi: "Tôi rất hiếm khi đi xem phim.", more: "trả lời câu **How often…?** của Part 1 · sai: ~~once in a blue moons~~ · ~~one in a blue moon~~ · **ôn Tập 3 Ngày 30** — giữ lại vì là ví dụ chuẩn của luật “đúng nguyên dạng”." },
          { w: "out of the blue", pos: "idiom", ipa: "/ˌaʊt əv ðə ˈbluː/", vi: "bất ngờ, không báo trước", ex: "An old classmate messaged me completely out of the blue.", exVi: "Một bạn học cũ nhắn cho tôi hoàn toàn bất ngờ.", more: "đệm: **completely / totally** out of the blue · hợp kể chuyện Part 2." },
          { w: "in the long run", pos: "idiom", ipa: "/ɪn ðə ˈlɒŋ rʌn/", vi: "về lâu dài", ex: "It's expensive now, but it'll save money in the long run.", exVi: "Bây giờ thì đắt, nhưng về lâu dài sẽ tiết kiệm.", more: "dùng được cả trong Writing (**in the long run / in the long term**) · trái: in the short run · **ôn Tập 3 Ngày 10 · 24** — giữ lại vì là ví dụ chuẩn của luật “đúng nguyên dạng”." },
          { w: "when it comes down to it", pos: "idiom", ipa: "/wen ɪt ˌkʌmz ˈdaʊn tʊ ɪt/", vi: "suy cho cùng, xét đến cùng", ex: "When it comes down to it, it's parents who shape a child's habits.", exVi: "Suy cho cùng, chính cha mẹ định hình thói quen của con.", more: "đứng đầu câu, sau đó là ý chốt · chỉ khi Nói; Writing dùng **ultimately** · cùng nghĩa: at the end of the day (Tập 3 Ngày 30) — đừng lặp một cụm quá một lần." },
          { w: "thrilled to bits", pos: "idiom", ipa: "/ˌθrɪld tə ˈbɪts/", vi: "mừng rơn, vui sướng tột độ", ex: "My mum was thrilled to bits when I got the scholarship.", exVi: "Mẹ tôi mừng rơn khi tôi nhận được học bổng.", more: "Anh-Anh, thân mật · sai: ~~thrilled to bit~~ · không thêm very · cùng nghĩa: over the moon (Tập 3 Ngày 30)." },
          { w: "up in the air", pos: "idiom", ipa: "/ˌʌp ɪn ði ˈeə/", vi: "chưa ngã ngũ, còn bỏ ngỏ", ex: "My plans for next year are still up in the air.", exVi: "Kế hoạch năm tới của tôi vẫn chưa ngã ngũ.", more: "trả lời câu hỏi về **tương lai** khi chưa chắc." },
          { w: "miss the boat", pos: "idiom", ipa: "/ˌmɪs ðə ˈbəʊt/", vi: "lỡ cơ hội", ex: "Firms that ignored online sales have missed the boat.", exVi: "Những công ty phớt lờ bán hàng trực tuyến đã lỡ chuyến đò.", more: "sai: ~~miss the ship~~ · ~~miss the train~~ (nghĩa đen)." },
          { w: "take (sth) for granted", pos: "idiom", ipa: "/ˌteɪk fə ˈɡrɑːntɪd/", vi: "coi là hiển nhiên, không biết quý", ex: "We take clean water for granted until the supply is cut.", exVi: "Ta coi nước sạch là hiển nhiên cho tới khi bị cắt nước.", more: "dùng được cả trong Writing · sai: ~~take it for grant~~ · ~~take for granted it~~." },
        ],
      },

      { t: "h", text: "6. Bốn luật dùng thành ngữ cho tự nhiên" },
      {
        t: "table",
        head: ["Luật", "Sai", "Đúng"],
        rows: [
          ["**Đúng nguyên dạng** — không đổi mạo từ, số ít / nhiều, từ", "~~It costs an arm and leg.~~ · ~~the top of the iceberg~~", "It costs **an arm and a leg**. · **the tip of the iceberg**"],
          ["**Chia động từ, giữ phần còn lại**", "~~We miss the boats last year.~~", "We **missed** the boat last year."],
          ["**Đúng liều** — 1–2 cái trong một câu trả lời dài", "~~When it comes down to it, it cuts both ways and it's the tip of the iceberg.~~", "Một thành ngữ, rồi **giải thích bằng lời thường** ngay sau"],
          ["**Có đệm** như người bản ngữ", "It was a silver lining. (đứng trơ)", "**I suppose the one** silver lining **was that** I had more time to study."],
        ],
      },
      { t: "note", title: "Cẩn thận: thành ngữ “sách giáo khoa” nghe cũ hoặc sáo", items: ["~~It's raining cats and dogs~~ — người bản ngữ gần như không còn nói; dùng **It's pouring / It's chucking it down**.", "~~Every coin has two sides~~ — là câu dịch từ tiếng Việt / Trung. Tiếng Anh nói **There are two sides to every story** hoặc đơn giản **It cuts both ways**.", "~~A piece of cake~~, ~~as easy as ABC~~ — đúng nhưng **ai cũng dùng**; giám khảo nghe hàng chục lần mỗi ngày. Thay bằng **I found it fairly straightforward** hoặc **it was no trouble at all**.", "Tục ngữ dài (~~A friend in need is a friend indeed~~) nghe như đọc thuộc — bỏ."] },
      { t: "rule", formula: "thành ngữ đúng nguyên dạng + đệm (a bit of a / I suppose) + một câu giải thích bằng lời thường", vi: "Khung an toàn cho Speaking: thành ngữ không bao giờ đứng một mình, và không quá hai cái trong một câu trả lời." },
      {
        t: "mcq", id: "t4d18-tv-nghia", title: "Chọn thành ngữ hợp nghĩa (8 câu)",
        items: [
          { q: "Tourism ______ for the island: it brings jobs, but it is also destroying the beaches.", options: ["is a drop in the ocean", "cuts both ways", "is the last straw", "is food for thought"], correct: 1, why: "Vừa lợi vừa hại ⇒ cuts both ways." },
          { q: "The fifty reported cases are just ______; doctors believe thousands more have gone unrecorded.", options: ["the tip of the iceberg", "a far cry", "up in the air", "a silver lining"], correct: 0, why: "Phần thấy được nhỏ hơn phần ẩn ⇒ the tip of the iceberg." },
          { q: "I see my cousins ______ — maybe once every two or three years.", options: ["out of the blue", "in the long run", "when it comes down to it", "once in a blue moon"], correct: 3, why: "Rất hiếm khi ⇒ once in a blue moon. Out of the blue = bất ngờ." },
          { q: "When food prices doubled, most families had to ______ and cut back on holidays.", options: ["cut corners", "miss the boat", "tighten their belts", "sit on the fence"], correct: 2, why: "Chi tiêu dè sẻn ⇒ tighten their belts (đổi your → their theo chủ ngữ)." },
          { q: "Whether the new stadium will be built is still ______; the council votes next month.", options: ["thrilled to bits", "up in the air", "in two minds", "the last straw"], correct: 1, why: "Chưa ngã ngũ (nói về việc, kế hoạch) ⇒ up in the air. In two minds dùng cho NGƯỜI phân vân." },
          { q: "Losing my job was awful, but there was ______: it pushed me to start the business I'd always dreamed of.", options: ["a drop in the ocean", "food for thought", "the last straw", "a silver lining"], correct: 3, why: "Điểm sáng trong chuyện không may ⇒ a silver lining." },
          { q: "The village I grew up in is ______ the noisy city I live in now.", options: ["a far cry from", "the tip of", "out of", "in two minds about"], correct: 0, why: "Khác xa ⇒ a far cry from." },
          { q: "The contractor ______ to finish on time, and the roof started leaking within a year.", options: ["pulled its weight", "found its feet", "cut corners", "took it for granted"], correct: 2, why: "Làm ẩu cho kịp ⇒ cut corners." },
        ],
      },
      {
        t: "quiz", id: "t4d18-tv-dang", kind: "fill", title: "Điền MỘT từ còn thiếu để thành ngữ đúng nguyên dạng (6 câu)",
        items: [
          { q: "Good coffee machines cost an arm and a ___.", answers: ["leg"] },
          { q: "It took me a month to find my ___ in the new job.", answers: ["feet"] },
          { q: "We tend to take free education for ___.", answers: ["granted"] },
          { q: "Her resignation came completely out of the ___.", answers: ["blue"] },
          { q: "I'm in two ___ about whether to accept the offer.", answers: ["minds"] },
          { q: "The third delay was the last ___; passengers demanded a refund.", answers: ["straw"] },
        ],
      },

      { t: "h", text: "7. Writing: tám dấu hiệu “viết như nói” và cách sửa" },
      {
        t: "table",
        head: ["Dấu hiệu", "Band 6 (lẫn văn nói)", "Band 7 (đúng văn phong)"],
        rows: [
          ["Thành ngữ đời thường", "Housing costs an arm and a leg.", "Housing has become **prohibitively expensive**."],
          ["Viết tắt", "It doesn't work and people can't afford it.", "It **does not** work and people **cannot** afford it."],
          ["Phrasal verb có từ đơn thay được", "The government should look into the problem.", "The government should **investigate** the problem."],
          ["Từ mơ hồ", "There are many things that cause this.", "Several **factors** contribute to this."],
          ["a lot of / lots of / kids / guys", "A lot of kids are overweight.", "**A considerable number of children** are overweight."],
          ["Trạng từ tăng cường kiểu nói", "It is really / totally / super important.", "It is **highly significant** / **of great importance**."],
          ["Câu hỏi tu từ · dấu chấm than", "So what can we do about it?", "**Several measures could be taken** to address this."],
          ["And / But / So đầu câu · etc. · and so on", "But this is not fair. They need food, water, etc.", "**However**, this is unfair. They need **essentials such as** food and water."],
        ],
      },
      { t: "p", text: "Phần lớn việc “nâng văn phong” là thay **phrasal verb** bằng **một động từ gốc Latin**. Học 16 cặp dưới đây — chúng xuất hiện ở hầu hết đề Task 2." },
      {
        t: "vocab",
        items: [
          { w: "investigate", pos: "v", ipa: "/ɪnˈvestɪɡeɪt/", vi: "điều tra, xem xét kỹ", ex: "Researchers are investigating the causes of the decline.", exVi: "Các nhà nghiên cứu đang điều tra nguyên nhân của sự sụt giảm.", more: "thay **look into** · danh từ: an **investigation into** (không of)." },
          { w: "tolerate", pos: "v", ipa: "/ˈtɒləreɪt/", vi: "chịu đựng, dung thứ", ex: "Employers should not tolerate bullying in the workplace.", exVi: "Chủ lao động không nên dung thứ nạn bắt nạt nơi làm việc.", more: "thay **put up with** · họ từ: **tolerance · tolerant · intolerable**." },
          { w: "eliminate", pos: "v", ipa: "/ɪˈlɪmɪneɪt/", vi: "loại bỏ hẳn", ex: "No policy can eliminate poverty overnight.", exVi: "Không chính sách nào xoá được đói nghèo qua một đêm.", more: "thay **get rid of** · **eliminate the need for / the risk of**." },
          { w: "establish", pos: "v", ipa: "/ɪˈstæblɪʃ/", vi: "thành lập; xác lập", ex: "The charity was established to support young carers.", exVi: "Tổ chức từ thiện được lập ra để hỗ trợ những người trẻ chăm sóc người thân.", more: "thay **set up** · **establish a link / a reputation**." },
          { w: "postpone", pos: "v", ipa: "/pəˈspəʊn/", vi: "hoãn", ex: "Many couples postpone having children until their thirties.", exVi: "Nhiều cặp đôi hoãn sinh con tới tuổi ba mươi.", more: "thay **put off** · + V-ing: postpone **doing**, không ~~postpone to do~~." },
          { w: "reduce", pos: "v", ipa: "/rɪˈdjuːs/", vi: "giảm, cắt giảm", ex: "Households are being urged to reduce their energy use.", exVi: "Các hộ gia đình được kêu gọi giảm sử dụng năng lượng.", more: "thay **cut down on** · mạnh hơn: **curb · minimise**." },
          { w: "discover", pos: "v", ipa: "/dɪˈskʌvə/", vi: "phát hiện, tìm ra", ex: "The study discovered that most users never read the terms.", exVi: "Nghiên cứu phát hiện đa số người dùng không bao giờ đọc điều khoản.", more: "thay **find out** · trang trọng hơn nữa: **ascertain** (xác minh)." },
          { w: "raise", pos: "v", ipa: "/reɪz/", vi: "nêu ra (vấn đề); nuôi dạy", ex: "The report raises serious questions about safety.", exVi: "Báo cáo nêu những câu hỏi nghiêm túc về an toàn.", more: "thay **bring up** · raise **an issue / concerns / awareness** · khác **rise** (tự tăng, không tân ngữ)." },
          { w: "conduct", pos: "v", ipa: "/kənˈdʌkt/", vi: "tiến hành", ex: "The survey was conducted among 2,000 commuters.", exVi: "Cuộc khảo sát được tiến hành với 2.000 người đi làm.", more: "thay **carry out / do** · conduct **research / a survey / an experiment** (Ngày 6)." },
          { w: "reject", pos: "v", ipa: "/rɪˈdʒekt/", vi: "bác bỏ, từ chối", ex: "Voters rejected the proposal by a narrow margin.", exVi: "Cử tri bác đề xuất với cách biệt sít sao.", more: "thay **turn down** · danh từ: **rejection**." },
          { w: "compensate (for)", pos: "v", ipa: "/ˈkɒmpenseɪt/", vi: "bù lại", ex: "Higher wages do not compensate for the loss of free time.", exVi: "Lương cao hơn không bù được việc mất thời gian rảnh.", more: "thay **make up for** · danh từ: **compensation**." },
          { w: "deteriorate", pos: "v", ipa: "/dɪˈtɪəriəreɪt/", vi: "xấu đi, xuống cấp", ex: "Air quality has deteriorated sharply over the past decade.", exVi: "Chất lượng không khí đã xấu đi rõ rệt trong thập kỷ qua.", more: "thay **get worse** · không có tân ngữ · danh từ: **deterioration**." },
          { w: "exceed", pos: "v", ipa: "/ɪkˈsiːd/", vi: "vượt quá", ex: "Demand for places now exceeds supply.", exVi: "Nhu cầu chỗ học nay vượt nguồn cung.", more: "thay **go over / be more than** · rất hợp Task 1: exports **exceeded** imports." },
          { w: "obtain", pos: "v", ipa: "/əbˈteɪn/", vi: "có được, giành được", ex: "Graduates find it harder to obtain a mortgage.", exVi: "Cử nhân thấy khó vay mua nhà hơn.", more: "thay **get** · gần nghĩa: **acquire** (kỹ năng, tài sản) · **gain** (kinh nghiệm)." },
          { w: "abolish", pos: "v", ipa: "/əˈbɒlɪʃ/", vi: "bãi bỏ (luật, chế độ)", ex: "Some argue that tuition fees should be abolished.", exVi: "Một số người lập luận rằng nên bãi bỏ học phí.", more: "thay **do away with** · danh từ: **abolition**." },
          { w: "encounter", pos: "v", ipa: "/ɪnˈkaʊntə/", vi: "gặp phải (khó khăn)", ex: "New arrivals often encounter language barriers.", exVi: "Người mới tới thường gặp rào cản ngôn ngữ.", more: "thay **come across / run into** · encounter **difficulties / resistance**." },
        ],
      },

      { t: "h", text: "8. Vùng xám — ẩn dụ đã thành ngôn ngữ học thuật (dùng được trong Task 2)" },
      {
        t: "table",
        head: ["Cụm", "Nghĩa", "Ví dụ Task 2"],
        rows: [
          ["**play a pivotal / key role in**", "đóng vai trò then chốt", "Teachers **play a pivotal role in** shaping attitudes."],
          ["**pave the way for**", "mở đường cho", "The reform **paved the way for** wider access to university."],
          ["**strike a balance between**", "cân bằng giữa", "Cities must **strike a balance between** growth and conservation."],
          ["**bridge the gap between**", "thu hẹp khoảng cách", "Scholarships help **bridge the gap between** rich and poor."],
          ["**shed light on**", "làm sáng tỏ", "The findings **shed light on** why the policy failed."],
          ["**a vicious circle**", "vòng luẩn quẩn", "Poverty and poor health form **a vicious circle**."],
        ],
      },
      { t: "note", title: "Mẹo: phép thử “báo cáo của chính phủ”", items: ["Tự hỏi: cụm này có xuất hiện trong một **báo cáo của bộ ngành** hay một **bài xã luận nghiêm túc** không? “pave the way for” — có. “cost an arm and a leg” — không.", "Chưa chắc thì **đừng dùng trong Writing**. Một collocation học thuật đúng (Ngày 6) luôn an toàn hơn một thành ngữ."] },
      { t: "rule", formula: "Speaking: phrasal verb + 1–2 thành ngữ · Writing: động từ đơn + collocation học thuật + ẩn dụ vùng xám", vi: "Cùng một ý, hai bộ từ. Đổi bộ từ theo bài thi chính là “awareness of style” của band 7." },
      {
        t: "mcq", id: "t4d18-tv-register", title: "Câu nào hợp nhất cho Writing Task 2? (6 câu)",
        items: [
          { q: "Ý: nhà ở quá đắt với người trẻ.", options: ["Flats cost an arm and a leg for young people.", "Young people can't afford flats, which is crazy.", "Housing has become unaffordable for many young people.", "Flats are super expensive for the youth nowadays!"], correct: 2, why: "C trung tính – trang trọng, không thành ngữ, không viết tắt. A có thành ngữ đời thường; B viết tắt + crazy; D super + dấu chấm than." },
          { q: "Ý: chính phủ nên xem xét vấn đề.", options: ["The authorities should examine the issue closely.", "The government should look into this thing.", "The government has got to sort this out.", "So what should the government do?"], correct: 0, why: "examine the issue = động từ đơn + danh từ chính xác. B: look into + thing; C: has got to / sort out; D: câu hỏi tu từ." },
          { q: "Ý: internet vừa lợi vừa hại.", options: ["The internet is a piece of cake with two sides.", "Every coin has two sides, and so does the internet.", "The internet is good and bad, to be honest.", "The internet brings considerable benefits, but it also carries significant risks."], correct: 3, why: "D nêu hai mặt bằng collocation học thuật. A sai thành ngữ; B là câu dịch sáo; C có cụm văn nói to be honest." },
          { q: "Ý: nhiều trẻ em thừa cân.", options: ["Loads of kids are overweight.", "A growing proportion of children are overweight.", "Tons of children are getting fat.", "Kids these days are, like, really overweight."], correct: 1, why: "a growing proportion of children — chính xác, trang trọng. Loads of / tons of / kids / like đều là văn nói." },
          { q: "Ý: biện pháp này mở đường cho thay đổi lớn hơn.", options: ["This step could pave the way for wider reform.", "This step is the tip of the iceberg for wider reform.", "This step will kick off bigger changes, hopefully.", "This step is a game changer, no doubt about it."], correct: 0, why: "pave the way for thuộc vùng xám, dùng được. B sai nghĩa; C: kick off + hopefully; D: sáo + cụm văn nói." },
          { q: "Ý: suy cho cùng, trách nhiệm thuộc về cha mẹ.", options: ["At the end of the day, it's down to the parents.", "When all is said and done, parents call the shots.", "Ultimately, responsibility rests with parents.", "Parents are the ones who have to deal with it, basically."], correct: 2, why: "Ultimately + rests with = văn viết. A, B là thành ngữ văn nói; D có basically." },
        ],
      },
      {
        t: "quiz", id: "t4d18-tv-trang-trong", kind: "fill", title: "Thay phrasal verb bằng MỘT động từ trang trọng (đúng dạng) — 8 câu",
        items: [
          { q: "Scientists are (looking into) ___ the link between diet and sleep.", answers: ["investigating", "examining"] },
          { q: "Residents should not have to (put up with) ___ constant noise.", answers: ["tolerate"] },
          { q: "The match was (put off) ___ because of flooding.", answers: ["postponed"] },
          { q: "The new law aims to (get rid of) ___ discrimination at work.", answers: ["eliminate"] },
          { q: "Living standards have (got worse) ___ in many rural areas.", answers: ["deteriorated"] },
          { q: "The college was (set up) ___ in 1964.", answers: ["established"] },
          { q: "The committee (turned down) ___ the application.", answers: ["rejected"] },
          { q: "Several countries have (done away with) ___ the death penalty.", answers: ["abolished"] },
        ],
      },
      {
        t: "quiz", id: "t4d18-tv-dich", kind: "translate", title: "Dịch Việt → Anh — câu 1–2 văn NÓI (có thành ngữ), câu 3–4 văn VIẾT (4 câu)", grammar: "Speaking: idiom đúng nguyên dạng · Writing: động từ trang trọng",
        items: [
          { q: "(Nói) Tôi đang phân vân về việc học thạc sĩ.", answers: ["I'm in two minds about doing a master's degree.", "I'm in two minds about doing a master's.", "I am in two minds about doing a master's degree.", "I'm in two minds about studying for a master's degree.", "I'm in two minds about taking a master's degree.", "I'm in two minds about doing a Master's degree.", "I'm in two minds about doing a Master's."], hint: "be in two minds about + V-ing" },
          { q: "(Nói) Về lâu dài, nó sẽ tiết kiệm tiền.", answers: ["In the long run, it will save money.", "In the long run, it'll save money.", "It'll save money in the long run.", "It will save money in the long run.", "In the long run it will save money.", "In the long run it'll save money."], hint: "in the long run" },
          { q: "(Viết) Chất lượng không khí đã xấu đi đáng kể.", answers: ["Air quality has deteriorated significantly.", "Air quality has deteriorated considerably.", "The air quality has deteriorated significantly.", "The air quality has deteriorated considerably.", "Air quality has significantly deteriorated.", "Air quality has considerably deteriorated."], hint: "deteriorate · significantly / considerably" },
          { q: "(Viết) Giáo viên đóng vai trò then chốt trong việc định hình thái độ.", answers: ["Teachers play a pivotal role in shaping attitudes.", "Teachers play a key role in shaping attitudes.", "Teachers play a crucial role in shaping attitudes.", "Teachers play a vital role in shaping attitudes."], hint: "play a pivotal role in + V-ing" },
        ],
      },
    ],
  },
  {
    id: "t4d18-viet",
    kind: "writing",
    title: "Viết Task 1: pie chart 3 — nhiều pie theo NHÓM, so sánh chéo",
    goal: "Viết trọn bài Task 1 band 7 cho đề ba pie so sánh ba NHÓM ở cùng một thời điểm: overview nêu được quy luật chạy xuyên ba pie, thân bài chia theo hạng mục và so sánh chéo trong từng câu, không còn dùng nhầm ngôn ngữ xu hướng (rose, fell) cho dữ liệu không có thời gian.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **TA + CC + LR của Task 1**. Band 7 TA: **chọn đúng điểm nổi bật, nhóm số liệu, so sánh rõ**.",
          "Ba pie **theo nhóm** (tuổi, nước, thu nhập) ở **một thời điểm** ⇒ **không có xu hướng**. Viết “social media rose to 52%” là lỗi TA.",
          "Tìm **quy luật xuyên pie**: hạng mục nào **tăng dần / giảm dần** theo nhóm, hạng mục nào **gần như không đổi**, đâu là **ngoại lệ**.",
          "Thân bài chia theo **hạng mục** (không theo từng pie) ⇒ mỗi câu đã là một phép so sánh.",
          "Công cụ band 7: **compared with · the figure for A was twice that for B · the reverse was true of · respectively · the older the group, the larger the share**.",
          "Văn phong (nối bài 1): không **the lion's share**, **a huge chunk** — viết **the largest share**, **the bulk of**.",
        ],
      },
      { t: "p", text: "Tập 2 Ngày 12 dạy tả **một pie** và ngôn ngữ tỉ lệ. Tập 3 Ngày 16 dạy **hai pie hai năm** và **bốn pie (nước × năm)** — dữ liệu có thời gian, nên bạn tả thay đổi. Hôm nay là biến thể hay làm thí sinh band 6.5 trượt: **ba pie, ba nhóm, không có năm thứ hai**." },

      { t: "h", text: "1. Có thời gian hay không? — câu hỏi đầu tiên trước mọi đề pie" },
      {
        t: "table",
        head: ["", "Pie theo NĂM (Tập 3 Ngày 16)", "Pie theo NHÓM (hôm nay)"],
        rows: [
          ["Đề nói", "in 2000 and 2020", "by three age groups in 2023 · in three countries"],
          ["Việc cần làm", "tả **thay đổi**", "tả **khác biệt**"],
          ["Động từ", "rose · fell · doubled · remained stable", "**was higher than · accounted for · exceeded · was twice that of**"],
          ["Overview", "hướng dịch chuyển + cái gì lớn nhất lúc cuối", "**quy luật xuyên nhóm** + nhóm nào khác hẳn"],
          ["Lỗi band 6", "liệt kê từng năm", "~~Television increased to 48% in the oldest group~~ (không có gì “tăng” cả)"],
        ],
      },
      { t: "note", title: "Cẩn thận: nhóm tuổi KHÔNG phải trục thời gian", items: ["Ba nhóm tuổi là **ba nhóm người khác nhau** ở cùng năm 2023. Không viết “as people get older, they **switched** to television” — biểu đồ không theo dõi ai già đi.", "Được viết: “the **older** the group, the **greater** its reliance on television” — đây là so sánh giữa các nhóm, không phải thay đổi theo thời gian.", "Thì động từ: đề ghi năm quá khứ (2023) ⇒ **quá khứ đơn** suốt bài."] },

      { t: "h", text: "2. Đề mẫu — đọc ba pie thành một bảng" },
      { t: "p", text: "**Đề:** The pie charts below show the main source of news for people in three age groups in one country in 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant." },
      { t: "figure", fig: { kind: "pie", title: "Aged 18–25 — main source of news, 2023 (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Social media", value: 52 }, { label: "News websites", value: 28 }, { label: "Television", value: 10 }, { label: "Print newspapers", value: 6 }, { label: "Radio", value: 4 }] } },
      { t: "figure", fig: { kind: "pie", title: "Aged 35–50 — main source of news, 2023 (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Social media", value: 22 }, { label: "News websites", value: 34 }, { label: "Television", value: 27 }, { label: "Print newspapers", value: 7 }, { label: "Radio", value: 10 }] } },
      { t: "figure", fig: { kind: "pie", title: "Aged 65 and over — main source of news, 2023 (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Social media", value: 5 }, { label: "News websites", value: 12 }, { label: "Television", value: 48 }, { label: "Print newspapers", value: 20 }, { label: "Radio", value: 15 }] } },
      { t: "p", text: "Việc đầu tiên (1 phút): chép ba pie thành **một bảng nháp**, hàng = hạng mục, cột = nhóm. Quy luật hiện ra ngay khi các số đứng cạnh nhau theo hàng ngang." },
      {
        t: "table",
        head: ["Nguồn tin", "18–25", "35–50", "65+", "Quy luật"],
        rows: [
          ["Social media", "**52**", "22", "5", "giảm mạnh theo tuổi (gấp ~10 lần giữa hai đầu)"],
          ["News websites", "28", "**34**", "12", "cao ở hai nhóm trẻ, thấp ở nhóm già"],
          ["Television", "10", "27", "**48**", "tăng mạnh theo tuổi — **ngược** social media"],
          ["Print newspapers", "6", "7", "20", "thấp, chỉ đáng kể ở 65+"],
          ["Radio", "4", "10", "15", "thấp, tăng nhẹ theo tuổi"],
          ["**Online** (2 dòng đầu)", "80", "56", "17", "⇒ gộp được thành một con số"],
          ["**Truyền thống** (3 dòng cuối)", "20", "44", "83", "⇒ gộp được"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Dàn ý 4 đoạn cho pie theo nhóm",
        steps: [
          { label: "**Mở bài** — paraphrase đề (1 câu)", sub: "compare the principal sources of news… for three age groups" },
          { label: "**Overview** — 2 câu", sub: "quy luật: càng trẻ càng online, càng già càng truyền thống · nhóm giữa nằm giữa, không nguồn nào áp đảo" },
          { label: "**Thân 1 — nguồn online**", sub: "social media + news websites, so ba nhóm trong từng câu" },
          { label: "**Thân 2 — nguồn truyền thống**", sub: "television (ngược lại) + print & radio gộp" },
        ],
      },

      { t: "h", text: "3. Ngôn ngữ so sánh chéo band 7 (nối Ngày 16 mục 3 — respectively, the reverse was true of)" },
      {
        t: "patterns",
        rows: [
          { formula: "N + accounted for x% of A, compared with (only / just) y% of B", vi: "so hai nhóm trong một câu", examples: [{ en: "Television accounted for 48% of the oldest group, compared with just 10% of the youngest.", vi: "Truyền hình chiếm 48 % ở nhóm già nhất, so với chỉ 10 % ở nhóm trẻ nhất." }] },
          { formula: "The figure for A was twice / three times / ten times that for B", vi: "bội số + that for (thay the figure — ôn Tập 3 Ngày 11)", examples: [{ en: "The figure for 18–25-year-olds was more than twice that for the middle group.", vi: "Con số của nhóm 18–25 cao hơn gấp đôi của nhóm giữa." }] },
          { formula: "x% and y% of A and B respectively", vi: "hai số, hai nhóm, đúng thứ tự", examples: [{ en: "News websites were used by 28% and 34% of the two younger groups respectively.", vi: "Trang tin được 28 % và 34 % hai nhóm trẻ hơn sử dụng, theo thứ tự." }] },
          { formula: "The reverse / The opposite was true of N · By contrast, N + V", vi: "hạng mục đi ngược quy luật vừa tả", examples: [{ en: "The reverse was true of television, which was favoured mainly by older viewers.", vi: "Điều ngược lại đúng với truyền hình, thứ chủ yếu được khán giả lớn tuổi chuộng." }] },
          { formula: "The older / younger the group, the + so sánh hơn + N", vi: "quy luật tăng / giảm dần qua các nhóm", examples: [{ en: "The older the group, the larger the share relying on radio.", vi: "Nhóm càng lớn tuổi, tỉ lệ dựa vào radio càng lớn." }] },
          { formula: "Together / Combined, A and B made up x% of …", vi: "gộp hai hạng mục nhỏ", examples: [{ en: "Together, print and radio made up 35% of the oldest group's total.", vi: "Cộng lại, báo in và radio chiếm 35 % tổng của nhóm già nhất." }] },
        ],
      },
      {
        t: "table",
        head: ["Tỉ lệ", "Cách nói band 7", "Lỗi hay gặp"],
        rows: [
          ["52%", "just over half · slightly more than half", "~~a half of people~~ → **half of** the people"],
          ["48%", "almost half · just under half", "~~nearly a half~~"],
          ["34%", "around a third · roughly one in three", "~~one third people~~ → one third **of** people"],
          ["27% · 22%", "roughly a quarter · just over a fifth", "~~a quarter percent~~"],
          ["10%", "one in ten · a tenth", "~~one of ten~~"],
          ["5% · 4%", "a mere 5% · a negligible 4%", "~~a tiny few~~"],
          ["chênh 52 − 22", "30 **percentage points** higher", "~~30% higher~~ (30 % cao hơn nghĩa là 22 × 1,3)"],
        ],
      },
      { t: "note", title: "Cẩn thận: ba lỗi ngữ pháp nhỏ nhưng dai", items: ["**percent** đi sau con số (48 **percent / per cent**); **percentage** đi với the / a: **the percentage of** viewers. ~~the percent of viewers~~.", "**The proportion / percentage of** + danh từ số nhiều + động từ **số ít**: ~~The proportion of young people using social media were high.~~ → The proportion of young people using social media **was** high.", "**respectively** đứng **cuối**, và chỉ dùng khi có **hai danh sách song song** cùng số phần tử."] },
      { t: "rule", formula: "N + accounted for x% of A, compared with y% of B · The figure for A was twice that for B", vi: "Pie theo nhóm: mỗi câu thân bài chứa ít nhất hai nhóm. Câu chỉ nói về một nhóm là câu liệt kê." },
      {
        t: "quiz", id: "t4d18-viet-so-sanh-dich", kind: "translate", title: "Dịch Việt → Anh — dùng số liệu đề mẫu (5 câu)", grammar: "accounted for … compared with · twice that for · respectively · The reverse was true of",
        items: [
          { q: "Mạng xã hội chiếm 52% ở nhóm trẻ nhất, so với chỉ 5% ở nhóm già nhất.", answers: ["Social media accounted for 52% of the youngest group, compared with only 5% of the oldest.", "Social media accounted for 52% of the youngest group, compared with just 5% of the oldest.", "Social media accounted for 52% of the youngest group, compared with only 5% of the oldest group.", "Social media accounted for 52% of the youngest group, compared with just 5% of the oldest group.", "Social media accounted for 52% of the youngest group, compared to only 5% of the oldest.", "Social media accounted for 52% of the youngest group, compared to just 5% of the oldest."], hint: "accounted for … of the youngest group, compared with only … of the oldest" },
          { q: "Con số của nhóm già nhất cao gần gấp đôi của nhóm giữa.", answers: ["The figure for the oldest group was almost twice that for the middle group.", "The figure for the oldest group was nearly twice that for the middle group.", "The figure for the oldest group was almost double that for the middle group.", "The figure for the oldest group was nearly double that for the middle group.", "The figure for the oldest group was almost twice that of the middle group.", "The figure for the oldest group was nearly twice that of the middle group."], hint: "The figure for … was almost twice that for …" },
          { q: "Radio được 4% và 10% của hai nhóm trẻ hơn sử dụng, theo thứ tự.", answers: ["Radio was used by 4% and 10% of the two younger groups respectively.", "Radio was used by 4% and 10% of the two younger groups, respectively.", "The radio was used by 4% and 10% of the two younger groups respectively."], hint: "was used by … and … of the two younger groups respectively" },
          { q: "Điều ngược lại đúng với truyền hình.", answers: ["The reverse was true of television.", "The opposite was true of television.", "The reverse was true for television.", "The opposite was true for television."], hint: "The reverse was true of…" },
          { q: "Nhóm càng lớn tuổi, tỉ lệ đọc báo in càng lớn.", answers: ["The older the group, the larger the share reading print newspapers.", "The older the group, the larger the proportion reading print newspapers.", "The older the group, the higher the proportion reading print newspapers.", "The older the group, the greater the proportion reading print newspapers.", "The older the group, the greater the share reading print newspapers.", "The older the group, the higher the share reading print newspapers.", "The older the group, the larger the share that read print newspapers.", "The older the group, the higher the proportion that read print newspapers."], hint: "The older the group, the larger the share / proportion reading…" },
        ],
      },

      { t: "h", text: "4. Bài mẫu band 6 và band 7 đặt cạnh nhau" },
      { t: "p", text: "Cả hai bài dùng **cùng số liệu**, đều đủ 150 từ, đều đúng số. Đọc bài band 6 trước và tự hỏi: mình biết được **điều gì nổi bật** sau khi đọc xong?" },
      {
        t: "passage", title: "Bài mẫu band 6 (ước tính) — 155 từ",
        paras: [
          { text: "The three pie charts show how people in three age groups got their news in a country in 2023." },
          { text: "In the 18–25 group, social media was the most popular source with 52%. News websites were second with 28%, and television was 10%. Print newspapers and radio were small, with 6% and 4%." },
          { text: "In the 35–50 group, news websites were the highest at 34%. Television rose to 27% and social media fell to 22%. Radio was 10% and print newspapers were 7%." },
          { text: "For people aged 65 and over, television increased to 48%, which was the biggest part of the pie. Print newspapers were 20%, radio was 15% and news websites were 12%. Social media was only 5% in this group." },
          { text: "Overall, young people used social media the most, but old people used television the most. People in the middle group used many different sources. In conclusion, age is a big thing for how people get news." },
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 7 – 7.5 (ước tính) — 186 từ",
        paras: [
          { text: "The pie charts compare the principal sources of news for three age groups in one country in 2023." },
          { text: "Overall, the younger the audience, the more heavily it relied on online sources, whereas traditional media, television in particular, dominated among the oldest group. Those aged 35–50 fell between these two extremes, with no single source accounting for much more than a third of the total." },
          { text: "Social media was the main source for 18–25-year-olds, at just over half (52%), a figure more than twice that for the middle group (22%) and roughly ten times that for the over-65s (5%). News websites were also widely used by the two younger groups (28% and 34% respectively), but by only 12% of the oldest." },
          { text: "The reverse was true of television. It was the chief source for almost half of those aged 65 and over (48%), compared with roughly a quarter of 35–50-year-olds and a mere 10% of the youngest group. Print newspapers and radio followed the same pattern on a smaller scale: together they made up 35% of the oldest group's total, but only 17% and 10% of the other two." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7", "Rút ra"],
        rows: [
          ["**TA**", "kể **đủ 15 con số** theo từng pie; overview ở cuối, đúng nhưng chỉ nêu hai cái lớn nhất; dùng **rose / fell / increased** cho dữ liệu không có thời gian; có **In conclusion** + nhận xét ngoài biểu đồ", "overview ngay sau mở bài, nêu **quy luật** (trẻ → online, già → truyền thống) + vị trí nhóm giữa; chọn số, **gộp** print + radio (35 / 17 / 10)", "Task 1 không có kết luận, không có ý kiến. Overview = quy luật, không phải “cái lớn nhất”"],
          ["**CC**", "chia theo **pie** ⇒ người đọc tự phải so; mỗi câu một con số; nối bằng and", "chia theo **hạng mục** ⇒ so sánh nằm trong câu; **The reverse was true of…** nối hai thân bài; **the same pattern** tham chiếu ngược", "Trục chia thân bài quyết định CC"],
          ["**LR**", "was / were lặp 14 lần; the most popular, the biggest part, **a big thing**", "principal · relied on · dominated · accounting for · a mere · chief · made up · on a smaller scale", "Đổi was thành động từ tỉ lệ; bỏ từ văn nói (nối bài 1)"],
          ["**GRA**", "gần như toàn câu đơn; một mệnh đề which", "the younger…, the more… · whereas · with + N + V-ing · cụm đồng vị (a figure more than twice that for…) · compared with", "Một cụm đồng vị gói được hai phép so sánh"],
        ],
      },
      { t: "note", title: "Cẩn thận: hai lỗi làm bài band 6 không lên được 6.5", items: ["**Ngôn ngữ xu hướng sai chỗ**: “Television **rose to** 27%… **increased to** 48%”. Giám khảo coi đây là hiểu sai dữ liệu.", "**Không chọn lọc**: 15 con số, 15 câu ngắn. Band 7 nêu khoảng 10–12 con số, số còn lại gộp hoặc bỏ."] },

      { t: "h", text: "5. Khi các pie có TỔNG khác nhau — tỉ lệ không phải là số lượng" },
      { t: "p", text: "Đề band 7 hay kèm một dòng dưới mỗi pie: **Total: 2 million / 8 million**. Lúc đó một lát 20 % của pie lớn có thể nhiều người hơn lát 50 % của pie nhỏ. Bạn không cần tính hết, nhưng phải **viết đúng chữ**: nói về **share / proportion** thì chỉ so tỉ lệ; muốn nói “nhiều người hơn” thì phải nhắc tổng." },
      {
        t: "table",
        head: ["Tình huống", "Sai", "Đúng"],
        rows: [
          ["Pie A 50 % (tổng 2 triệu) · Pie B 20 % (tổng 8 triệu)", "~~More people in A chose X than in B.~~", "X accounted for **a far larger share** in A (50% against 20%), **although in absolute terms** the number was greater in B, given its much larger total."],
          ["Đề không cho tổng", "~~Twice as many young people used social media.~~", "The **proportion** of young people using social media was more than twice as high."],
        ],
      },
      {
        t: "mcq", id: "t4d18-viet-chon", title: "Chọn câu tốt nhất — dùng số liệu đề mẫu (6 câu)",
        items: [
          { q: "Overview nào tốt nhất?", options: ["Overall, social media was 52% in the youngest group and television was 48% in the oldest group.", "Overall, online sources dominated among the young, while older people depended mainly on traditional media.", "Overall, the use of television increased steadily over the period.", "Overall, there were many differences between the three pie charts."], correct: 1, why: "B nêu quy luật xuyên nhóm, không cần số. A chỉ liệt kê hai số; C dùng ngôn ngữ thời gian (không có “period”); D đúng nhưng rỗng." },
          { q: "Câu nào dùng SAI ngôn ngữ cho dữ liệu này?", options: ["Television was far more popular among the over-65s than among the young.", "The share relying on radio was highest in the oldest group.", "Social media dropped sharply to 5% in the oldest group.", "News websites were the leading source for 35–50-year-olds."], correct: 2, why: "dropped sharply to = thay đổi theo thời gian. Ba câu còn lại là so sánh giữa các nhóm." },
          { q: "Câu nào so sánh ĐÚNG số liệu?", options: ["Television was almost five times as common among the oldest group as among the youngest.", "Television was twice as common among the oldest group as among the youngest.", "News websites were used by a third of the oldest group.", "Radio accounted for a quarter of the middle group."], correct: 0, why: "48 so với 10 ⇒ gần gấp năm. B sai bội số; C: 12 % không phải một phần ba; D: radio ở nhóm giữa là 10 %." },
          { q: "Chọn cách chia thân bài hợp nhất.", options: ["Thân 1: nhóm 18–25 · Thân 2: nhóm 35–50 và 65+", "Thân 1: năm số lớn nhất · Thân 2: năm số nhỏ nhất", "Mỗi pie một đoạn, ba thân bài", "Thân 1: nguồn online · Thân 2: nguồn truyền thống"], correct: 3, why: "Chia theo hạng mục để mỗi câu so được ba nhóm. Chia theo pie (A, C) buộc người đọc tự so." },
          { q: "Câu nào đúng văn phong Task 1?", options: ["TV took the lion's share among pensioners.", "A huge chunk of old people were glued to the TV.", "Television accounted for the largest share among the oldest group.", "Old folks mostly stuck with the telly."], correct: 2, why: "accounted for the largest share = trung tính, chính xác. A, B, D dùng thành ngữ / từ văn nói (bài 1 mục 7)." },
          { q: "Điền: Social media was the main source for 52% of the youngest group, ______ 30 ______ higher than the figure for the middle group.", options: ["or … percent", "which … percentages", "that … percent points", "some … percentage points"], correct: 3, why: "52 − 22 = 30 percentage points (điểm phần trăm). “30 percent higher” sẽ có nghĩa 22 × 1,3 = 28,6." },
        ],
      },

      { t: "h", text: "6. Câu khung dùng lại và bảng soát trước khi nộp" },
      {
        t: "table",
        head: ["Vị trí", "Câu khung"],
        rows: [
          ["Mở bài", "The pie charts compare … for three [groups] in [place] in [year]."],
          ["Overview 1", "Overall, the [younger / richer] the group, the more … , whereas … dominated among … ."],
          ["Overview 2", "[The middle group] fell between these two extremes, with no single category accounting for more than … ."],
          ["Thân 1", "[A] was the main … for [group 1], at just over half (x%), a figure more than twice that for [group 2] (y%)."],
          ["Chuyển đoạn", "The reverse was true of [B]."],
          ["Gộp hạng mục nhỏ", "[C] and [D] followed the same pattern on a smaller scale: together they made up x% of … , but only y% of … ."],
        ],
      },
      { t: "note", title: "Mẹo: soát 2 phút trước khi nộp Task 1 pie theo nhóm", items: ["Có động từ **rose / fell / increased / dropped** nào không? ⇒ đổi thành **was higher / lower than**.", "Mỗi câu thân bài có **ít nhất hai nhóm** không?", "Overview có đứng **trước** thân bài và **không có số** (hoặc rất ít số) không?", "**percent / percentage / percentage points** đúng chưa? Thì **quá khứ đơn** suốt bài chưa?", "Còn từ văn nói nào (a big thing, a lot of, the biggest part) không?"] },

      { t: "h", text: "7. Viết bài — AI chấm 4 tiêu chí (20 phút)" },
      { t: "p", text: "Đề mới, cùng dạng: ba pie theo **mức thu nhập**. Bấm giờ **20 phút**: 2 phút lập bảng nháp và tìm quy luật, 15 phút viết, 3 phút soát theo bảng ở mục 6." },
      { t: "figure", fig: { kind: "pie", title: "Low-income households — spending by category (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Food", value: 34 }, { label: "Housing", value: 30 }, { label: "Transport", value: 12 }, { label: "Leisure", value: 6 }, { label: "Savings", value: 3 }, { label: "Other", value: 15 }] } },
      { t: "figure", fig: { kind: "pie", title: "Middle-income households — spending by category (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Food", value: 22 }, { label: "Housing", value: 28 }, { label: "Transport", value: 15 }, { label: "Leisure", value: 13 }, { label: "Savings", value: 10 }, { label: "Other", value: 12 }] } },
      { t: "figure", fig: { kind: "pie", title: "High-income households — spending by category (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Food", value: 12 }, { label: "Housing", value: 24 }, { label: "Transport", value: 14 }, { label: "Leisure", value: 22 }, { label: "Savings", value: 20 }, { label: "Other", value: 8 }] } },
      {
        t: "essay", id: "t4d18-viet-bai", task: "Task 1",
        prompt: "The pie charts below show how households in three income groups in one country divided their monthly budget in 2022. Low-income households: food 34%, housing 30%, transport 12%, leisure 6%, savings 3%, other 15%. Middle-income households: food 22%, housing 28%, transport 15%, leisure 13%, savings 10%, other 12%. High-income households: food 12%, housing 24%, transport 14%, leisure 22%, savings 20%, other 8%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Quy luật: thu nhập càng cao, tỉ lệ cho **nhu cầu thiết yếu** (food + housing: 64 → 50 → 36) càng nhỏ, tỉ lệ cho **leisure + savings** (9 → 23 → 42) càng lớn.",
          "**Ổn định**: transport (12–15 %) — một câu là đủ. **Housing** giảm ít (30 → 24), **food** giảm mạnh (34 → 12, gần gấp ba).",
          "Chia thân bài theo **hạng mục**: (1) thiết yếu · (2) tuỳ ý + tiết kiệm; transport và other ghép vào cuối.",
          "Không dùng rose / fell. Không viết “rich people spend less **money** on food” — biểu đồ cho **tỉ lệ ngân sách**, không cho số tiền.",
          "Quá khứ đơn; 170–190 từ; không kết luận, không ý kiến.",
        ],
      },
    ],
  },
  {
    id: "t4d18-noi",
    kind: "speaking",
    title: "Nói: Part 3 band 7 — ví dụ cá nhân hay xã hội; paraphrase câu hỏi; ngữ điệu thái độ",
    goal: "Trả lời Part 3 ở mức band 7: chống đỡ ý bằng ví dụ ở tầm xã hội (và biết bắc cầu từ chuyện của mình sang chuyện chung), mở đầu bằng cách diễn đạt lại câu hỏi thay vì lặp từ của giám khảo, và dùng ngữ điệu để cho thấy mình chắc chắn, dè dặt hay ngạc nhiên.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "Bài này đẩy **FC + LR + P của Speaking Part 3**. Band 7: nói dài không gắng sức, **paraphrase hiệu quả**, có từ ít gặp, ngữ điệu mang nghĩa.",
          "Part 3 hỏi về **xã hội**, không hỏi về bạn. Ví dụ cá nhân chỉ là **điểm tựa**: kể 1 câu rồi **bắc cầu** sang số đông.",
          "Bốn loại ví dụ: **xu hướng chung** · **một nhóm người** (Take students, for instance) · **trường hợp ai cũng biết** · **cá nhân → khái quát**.",
          "Paraphrase câu hỏi (nối Tập 2 Ngày 9, Tập 3 Ngày 27): **đổi từ loại · đổi từ · đổi góc nhìn · nói vòng** khi thiếu từ.",
          "🔊 **Xuống hẳn** = chắc chắn · **xuống rồi lên** = “đúng, nhưng…” · **lên rồi xuống** = ấn tượng mạnh · **bắt đầu cao** = ngạc nhiên.",
        ],
      },

      { t: "h", text: "1. Part 3 hỏi về “people”, không hỏi về “you”" },
      { t: "p", text: "Ở Part 1 giám khảo hỏi **Do you…?** và bạn kể về mình. Ở Part 3 câu hỏi đổi chủ ngữ: **Do people…? · Why do some…? · How has society…?** Thí sinh band 6 vẫn trả lời bằng chuyện của mình (“I usually read news on Facebook…”) rồi dừng. Câu trả lời đó đúng ngữ pháp nhưng **lạc tầm**: nó không trả lời câu hỏi về xã hội, và không cho bạn chỗ để dùng ngôn ngữ khái quát, so sánh, suy đoán — đúng thứ Part 3 chấm." },
      {
        t: "table",
        head: ["Loại ví dụ", "Câu mở", "Ví dụ (câu hỏi: Why do young people prefer online news?)"],
        rows: [
          ["**Xu hướng chung**", "These days, the vast majority of… · There's been a clear shift towards…", "These days the vast majority of people under thirty have their phone within reach all day, so news simply comes to them."],
          ["**Một nhóm người**", "Take university students, for instance. · If you look at commuters…", "Take university students, for instance: hardly any of them would buy a newspaper."],
          ["**Trường hợp ai cũng biết**", "You only have to look at… · A good example would be…", "You only have to look at how quickly a story spreads once a video goes viral."],
          ["**Cá nhân → khái quát**", "Speaking for myself, … and I don't think I'm unusual in that.", "Speaking for myself, I haven't switched on the TV news for years, and I don't think I'm unusual in that."],
          ["**Giả định** (khi không có ví dụ thật)", "Imagine someone who… · Suppose a family…", "Imagine someone who works twelve-hour shifts — they're not going to sit down for the nine o'clock news."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "Speaking for myself, S + V …, and I don't think I'm unusual in that.", vi: "chuyện mình → số đông (1)", examples: [{ en: "Speaking for myself, I skim the headlines on my phone, and I don't think I'm unusual in that.", vi: "Riêng tôi thì lướt tiêu đề trên điện thoại, và tôi không nghĩ mình là ngoại lệ." }] },
          { formula: "I see it in my own family: … . And I suspect that's true of most households.", vi: "chuyện mình → số đông (2)", examples: [{ en: "I see it in my own family: my grandfather still buys a paper every morning. And I suspect that's true of most people his age.", vi: "Tôi thấy ngay trong nhà mình: ông tôi vẫn mua báo mỗi sáng. Và tôi đoán điều đó đúng với đa số người tuổi ông." }] },
          { formula: "That's just my experience, of course, but more generally, …", vi: "tự nhận giới hạn rồi khái quát — cho thấy bạn biết mình đang ở tầm nào", examples: [{ en: "That's just my experience, of course, but more generally, people seem to trust a familiar face over an anonymous website.", vi: "Dĩ nhiên đó chỉ là trải nghiệm của tôi, nhưng nói rộng hơn, người ta có vẻ tin một gương mặt quen hơn một trang web vô danh." }] },
        ],
      },
      { t: "note", title: "Cẩn thận: ba kiểu ví dụ làm tụt điểm", items: ["**Chỉ có chuyện cá nhân, không bắc cầu**: “I use TikTok for news.” (dừng) ⇒ giám khảo sẽ hỏi lại “And people in general?” — bạn mất một lượt.", "**Bịa số liệu**: ~~According to a survey, 78% of…~~ nghe như học thuộc. Nói **most · a good many · hardly any** là đủ.", "**Ví dụ dài hơn ý**: kể chuyện 40 giây mà chưa nêu quan điểm. Thứ tự đúng: **ý → lý do → ví dụ ngắn → chốt**."] },
      { t: "rule", formula: "Ý kiến + lý do + ví dụ ở tầm xã hội (hoặc cá nhân + câu bắc cầu) + chốt / nhượng bộ", vi: "Khung Part 3 của Tập 3 vẫn giữ; band 7 chỉ đổi TẦM của ví dụ." },

      { t: "h", text: "2. Paraphrase câu hỏi — bốn kỹ thuật" },
      { t: "p", text: "Lặp nguyên từ của giám khảo (“Yes, I think people trust the news less than they used to because…”) không sai, nhưng không cho thấy vốn từ. Band 7 LR ghi rõ **paraphrase hiệu quả**. Câu đầu của bạn là chỗ dễ làm nhất: nói lại ý của câu hỏi **bằng chữ khác**, vừa câu được 2 giây suy nghĩ, vừa ghi điểm." },
      {
        t: "table",
        head: ["Kỹ thuật", "Câu hỏi của giám khảo", "Câu mở của bạn"],
        rows: [
          ["**Đổi từ loại**", "Do people **trust** the news less than they used to?", "I'd say there's been a real loss of **trust** in the media, yes. · People are far more **sceptical** than they were."],
          ["**Đổi từ / cụm đồng nghĩa**", "Why do some people **prefer** to get news from **social media**?", "Well, I think a lot of people **find it more convenient** to **pick up the headlines on their feeds**."],
          ["**Đổi góc nhìn** (chủ động ↔ bị động, người ↔ vật)", "How has **technology changed** the way people get news?", "Well, **the way we keep up with events has been transformed**, really."],
          ["**Xác nhận lại bằng lời mình**", "Should governments **regulate** what is published online?", "So, **whether there should be some kind of official control over online content**? That's a tricky one."],
          ["**Nói vòng** khi thiếu từ (circumlocution)", "(bạn quên từ **misinformation**)", "…stories that **look like real news but turn out to be untrue** — I can't think of the exact word."],
        ],
      },
      { t: "note", title: "Mẹo: đừng paraphrase mọi thứ", items: ["Giữ **danh từ chủ đề** nếu không có từ thay tự nhiên (news, education). Paraphrase **động từ và tính từ** dễ hơn và tự nhiên hơn.", "Nói vòng là **kỹ năng được điểm**, không phải lỗi: giám khảo chấm việc bạn **vẫn truyền được ý** khi thiếu từ.", "Khung nói vòng: **the kind of … that …** · **what I mean is …** · **it's when …** · **I'm not sure of the term, but …**"] },
      {
        t: "mcq", id: "t4d18-noi-paraphrase", title: "Câu mở nào paraphrase tốt nhất? (5 câu)",
        items: [
          { q: "Examiner: “Why do many people no longer buy newspapers?”", options: ["Many people no longer buy newspapers because they are expensive.", "I think print has largely fallen out of favour because the same stories are free online.", "Yes, I agree. Newspapers are not bought by many people.", "Newspapers? I don't buy newspapers, to be honest."], correct: 1, why: "B đổi buy newspapers → print has fallen out of favour và trả lời luôn lý do ở tầm xã hội. A lặp nguyên; C trả lời như câu hỏi Yes/No; D chỉ nói về mình." },
          { q: "Examiner: “Is it important for children to follow the news?”", options: ["Yes, it is important for children to follow the news.", "Children follow the news in my country.", "I'd say it does matter that kids have some idea of what's going on in the world, yes.", "Important? Yes. Very important."], correct: 2, why: "important → it does matter; follow the news → have some idea of what's going on in the world. Kids hợp văn nói." },
          { q: "Examiner: “How might the way we get news change in the future?”", options: ["I suspect the way we consume news will become far more personalised.", "The way we get news might change in the future a lot.", "In the future I will get news from my phone.", "It changed a lot already."], correct: 0, why: "get news → consume news; might change → will become far more personalised (đã trả lời). B lặp; C chỉ về mình; D sai thì và không trả lời tương lai." },
          { q: "Bạn quên từ “subscription”. Cách xử lý tốt nhất:", options: ["Im lặng 5 giây để nhớ.", "Nói “I don't know this word, sorry.” rồi dừng.", "Nói một từ tiếng Việt.", "“…where you pay a fixed amount every month to read it — I can't recall the exact term.”"], correct: 3, why: "Nói vòng: tả nghĩa bằng mệnh đề where you pay…, rồi nói tiếp. Đây là paraphrase hiệu quả theo bảng chấm." },
          { q: "Examiner: “Do you think journalists have too much influence?”", options: ["I think journalists have too much influence.", "Hmm, whether the press holds too much sway over public opinion… to some extent, yes.", "Journalists are influential people.", "Too much influence? No."], correct: 1, why: "journalists → the press; have too much influence → holds too much sway over public opinion; kèm mức độ “to some extent”." },
        ],
      },

      { t: "h", text: "3. Band 6 và band 7 — cùng một câu hỏi" },
      {
        t: "dialogue", title: "Câu trả lời band 6 (ước tính) — 62 từ, khoảng 28 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you think people trust the news less than they used to?", vi: "Bạn có nghĩ người ta tin tin tức ít hơn trước không?" },
          { who: "Candidate", role: "candidate", text: "Yes, I think people trust the news less than they used to. For example, I read news on Facebook every day and sometimes I see fake news. Last month I read that a famous singer died, but it was not true. So I don't trust the news very much now. My friends also don't trust it. I think it is a big problem.", vi: "Vâng, tôi nghĩ người ta tin tin tức ít hơn trước. Ví dụ, tôi đọc tin trên Facebook mỗi ngày và đôi khi thấy tin giả. Tháng trước tôi đọc rằng một ca sĩ nổi tiếng mất, nhưng không đúng. Nên giờ tôi không tin tin tức lắm. Bạn tôi cũng không tin. Tôi nghĩ đó là vấn đề lớn." },
        ],
      },
      {
        t: "dialogue", title: "Câu trả lời band 7 – 7.5 (ước tính) — 132 từ, khoảng 55 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you think people trust the news less than they used to?", vi: "Bạn có nghĩ người ta tin tin tức ít hơn trước không?" },
          { who: "Candidate", role: "candidate", text: "On the whole, yes — I'd say people have become far more sceptical. A generation ago there were only a handful of outlets, and if something was in the paper, it was more or less taken as fact. Now anyone can publish anything, so there's an awful lot of content that looks like journalism but simply isn't checked. I see it in my own family, actually: my mum will forward a health story from some site nobody's heard of, and my first reaction is to look up where it came from. And I don't think I'm unusual in that — most people my age have learned the hard way not to take things at face value. Having said that, I wouldn't say trust has collapsed. It's more that people have become choosier about who they believe.", vi: "Nhìn chung là có — tôi cho rằng người ta đã hoài nghi hơn nhiều. Một thế hệ trước chỉ có vài cơ quan báo chí, và cái gì đã lên báo thì gần như được coi là sự thật. Giờ ai cũng đăng được bất cứ thứ gì, nên có vô số nội dung trông như báo chí mà chẳng hề được kiểm chứng. Thật ra tôi thấy ngay trong nhà mình: mẹ tôi hay chuyển một bài sức khoẻ từ trang nào đó không ai biết, và phản ứng đầu tiên của tôi là tra xem nó từ đâu ra. Và tôi không nghĩ mình là ngoại lệ — đa số người tuổi tôi đã học được bài học xương máu là đừng tin vẻ bề ngoài. Dù vậy, tôi không cho là niềm tin đã sụp đổ. Đúng hơn là người ta kén chọn hơn về việc tin ai." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7", "Làm theo"],
        rows: [
          ["**FC**", "6 câu ngắn rời; dừng sau 28 giây; nối bằng So / also", "một mạch 55 giây; **On the whole · actually · And · Having said that · It's more that…**", "kết bằng **nhượng bộ có chỉnh lại**: I wouldn't say X. It's more that Y."],
          ["**LR**", "lặp nguyên **trust the news less than they used to**; fake news, a big problem", "**sceptical · outlets · taken as fact · learned the hard way · take things at face value · choosier**", "paraphrase câu hỏi ở câu 1; một thành ngữ đúng chỗ (learn the hard way)"],
          ["**GRA**", "hiện tại đơn + quá khứ đơn; không câu phức", "**if something was…, it was taken** (bị động) · **content that looks like… but isn't checked** · **will forward** (thói quen) · have learned not to V", "will cho thói quen; mệnh đề quan hệ; hiện tại hoàn thành"],
          ["**Tầm ví dụ**", "chỉ chuyện của mình + “my friends also”", "so sánh **thế hệ trước – nay** → chuyện nhà → **bắc cầu** (most people my age)", "ví dụ cá nhân chiếm 1 câu, không phải cả bài"],
        ],
      },

      { t: "h", text: "4. Thành ngữ trong Part 3 — nối bài 1" },
      { t: "p", text: "Câu band 7 ở trên có đúng **hai** cụm thành ngữ (**learn the hard way**, **take things at face value**) và chúng nằm ở chỗ ý cần chúng. Với chủ đề hôm nay, những cụm bài 1 dùng được tự nhiên: social media **cuts both ways** · the stories we hear about are **just the tip of the iceberg** · I'm **in two minds** about regulation · printed papers are **a far cry from** what they were. Chọn **một**, đệm cho mềm, rồi giải thích bằng lời thường." },

      { t: "h", text: "5. Phát âm: ngữ điệu cho thấy THÁI ĐỘ" },
      { t: "p", text: "Tập 3 Ngày 24 và Tập 4 Ngày 9 dạy ngữ điệu ngắt cụm; Ngày 14 dạy ngữ điệu liệt kê. Hôm nay là lớp trên cùng: cùng một câu chữ, **đường đi của giọng ở từ được nhấn cuối** cho người nghe biết bạn chắc hay ngờ, đồng ý hẳn hay còn chữ “nhưng”. Người Việt hay nói phẳng hoặc xuống ở mọi câu, nên câu “đồng ý một phần” nghe thành “đồng ý hẳn”." },
      {
        t: "table",
        head: ["Đường giọng", "Thái độ", "Ví dụ (từ viết HOA là chỗ giọng đổi hướng)"],
        rows: [
          ["**Xuống hẳn ↘**", "chắc chắn, dứt khoát, đã xong ý", "I think it's a real PROBlem ↘."],
          ["**Xuống rồi lên ↘↗**", "dè dặt: đúng, **nhưng**… / còn điều chưa nói", "It's USEful ↘↗ … (but I wouldn't rely on it)."],
          ["**Lên rồi xuống ↗↘**", "ấn tượng mạnh, nhấn cảm xúc", "It's changed eNORmously ↗↘."],
          ["**Lên ↗**", "chưa xong, đang nghĩ; hoặc hỏi lại", "Whether it should be REgulated ↗ … that's a tricky one ↘."],
          ["**Bắt đầu cao**", "ngạc nhiên, không tin", "↑ NObody buys a paper? I'm not sure that's true."],
          ["**Thấp, phẳng**", "chán, không quan tâm (tránh khi thi)", "it's fine. i suppose."],
        ],
      },
      { t: "note", title: "Mẹo: ba chỗ dùng ngay trong Part 3", items: ["**Nhượng bộ**: To some exTENT ↘↗, yes — rồi mới nói phần “nhưng”.", "**Hỏi lại / nghĩ**: giọng **lên** ở cuối cụm paraphrase, **xuống** ở “That's a tricky one”.", "**Nhấn ý chính**: lên-xuống trên trạng từ mạnh (eNORmously, comPLETEly, ABsolutely). Mỗi câu trả lời một lần là đủ."] },
      {
        t: "phatam", id: "t4d18-phat-am", title: "Luyện phát âm — ngữ điệu thái độ",
        note: "Đọc theo mũi tên trong phần dịch. Thu âm rồi nghe lại: câu ↘↗ có nghe ra chữ “nhưng” chưa nói không?",
        items: [
          { text: "I think it's a real problem.", ipa: "aɪ θɪŋk ɪts ə rɪəl prɒbləm", vi: "Tôi nghĩ đó là vấn đề thật sự. (PROBlem ↘ — chắc chắn)" },
          { text: "It's useful, but I wouldn't rely on it.", ipa: "ɪts juːsfl bət aɪ wʊdnt rɪlaɪ ɒn ɪt", vi: "Nó hữu ích, nhưng tôi sẽ không dựa vào nó. (USEful ↘↗ | reLY on it ↘)" },
          { text: "To some extent, yes.", ipa: "tə sʌm ɪkstent jes", vi: "Ở mức độ nào đó thì có. (exTENT ↘↗ | YES ↘)" },
          { text: "It's changed enormously.", ipa: "ɪts tʃeɪndʒd ɪnɔːməsli", vi: "Nó đã thay đổi ghê gớm. (eNORmously ↗↘ — ấn tượng mạnh)" },
          { text: "Whether it should be regulated, that's a tricky one.", ipa: "weðər ɪt ʃəd bi reɡjuleɪtɪd ðæts ə trɪki wʌn", vi: "Liệu có nên quản lý hay không, câu đó khó đấy. (REgulated ↗ | TRICky one ↘)" },
          { text: "Nobody buys a paper? I'm not sure that's true.", ipa: "nəʊbədi baɪz ə peɪpə aɪm nɒt ʃɔː ðæts truː", vi: "Không ai mua báo ư? Tôi không chắc điều đó đúng. (↑NObody… PAper ↗ | TRUE ↘)" },
          { text: "I wouldn't say trust has collapsed.", ipa: "aɪ wʊdnt seɪ trʌst həz kəlæpst", vi: "Tôi không cho là niềm tin đã sụp đổ. (colLAPSED ↘↗ — còn ý tiếp theo)" },
          { text: "It's more that people have become choosier.", ipa: "ɪts mɔː ðət piːpl həv bɪkʌm tʃuːziə", vi: "Đúng hơn là người ta kén chọn hơn. (CHOOsier ↘ — chốt ý)" },
        ],
      },

      { t: "h", text: "6. Luyện nói — ghi âm, AI chấm" },
      { t: "p", text: "Mỗi câu nói **45–60 giây**. Trước khi bấm ghi, tự nhắc ba việc: (1) câu đầu **paraphrase** câu hỏi; (2) ví dụ ở **tầm xã hội**, nếu kể chuyện mình thì có **câu bắc cầu**; (3) có ít nhất một chỗ giọng **↘↗** khi nhượng bộ." },
      {
        t: "speak", id: "t4d18-noi-part3", part: "3",
        questions: [
          "Why do some people prefer to get their news from social media rather than from newspapers or television?",
          "Do you think people trust the news less than they used to? Why?",
          "Is it important for young people to keep up with what is happening in the world?",
          "Should governments control what is published online, or should people be free to post anything?",
          "How do you think the way we get news will change in the next twenty years?",
        ],
      },
      { t: "p", text: "Bộ thứ hai — chủ đề khác, để tập **bắc cầu** trên nội dung mới (thói quen đọc và thông tin)." },
      {
        t: "speak", id: "t4d18-noi-part3-b", part: "3",
        questions: [
          "Some people say that nobody reads long articles any more. To what extent do you agree?",
          "Do older and younger people look for information in different ways?",
          "What are the advantages and disadvantages of having so much information available?",
          "Is being well informed more important in some jobs than in others?",
        ],
      },
    ],
  },
  {
    id: "t4d18-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 18 — idiom & register · pie theo nhóm · paraphrase câu hỏi · ngữ điệu thái độ",
    goal: "Tự kiểm lại cả ngày: dùng đúng dạng và đúng chỗ thành ngữ, đổi câu văn nói sang văn viết, viết câu so sánh chéo cho ba pie theo nhóm, chọn câu mở paraphrase và đường giọng hợp thái độ.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Cách làm",
        items: [
          "33 câu, 6 phần, khoảng 55 phút. Làm xong mới xem đáp án.",
          "Phần I–II ôn **bài 1**; phần III–IV ôn **bài 2**; phần V–VI ôn **bài 3**.",
          "Xong bài tập này thì nghỉ 15 phút rồi làm **Kiểm tra chặng (Ngày 13–18)** ở bài kế tiếp.",
        ],
      },
      { t: "h", text: "Phần I — Thành ngữ: nghĩa, dạng, chỗ dùng (8 câu · ôn bài 1 mục 3–6)" },
      {
        t: "mcq", id: "t4d18-bt-idiom", title: "I. Chọn đáp án đúng",
        items: [
          { q: "Chọn câu có thành ngữ ĐÚNG nguyên dạng.", options: ["That phone cost me an arm and leg.", "I see them once in a blue moons.", "It was just the tip of the iceberg.", "She was thrilled to bit about the result."], correct: 2, why: "the tip of the iceberg đúng. Đúng của ba câu kia: an arm and A leg · once in a blue MOON · thrilled to BITS." },
          { q: "In my first week I was ______: nobody explained anything and I had to run a project on my own.", options: ["thrown in at the deep end", "a drop in the ocean", "the last straw", "a far cry"], correct: 0, why: "Bị giao việc khó ngay từ đầu, không ai hướng dẫn ⇒ thrown in at the deep end." },
          { q: "Thành ngữ nào dùng được trong CẢ Speaking và Writing Task 2?", options: ["cost an arm and a leg", "in the long run", "thrilled to bits", "when it comes down to it"], correct: 1, why: "in the long run là trung tính. Ba cụm kia chỉ hợp văn nói." },
          { q: "The donation was generous, but compared with what the hospital needs, it's ______.", options: ["food for thought", "a silver lining", "out of the blue", "a drop in the ocean"], correct: 3, why: "Quá nhỏ so với nhu cầu ⇒ a drop in the ocean." },
          { q: "Câu nào nghe TỰ NHIÊN nhất trong Speaking Part 3?", options: ["It cuts both ways and it's the tip of the iceberg, when it comes down to it.", "Every coin has two sides, as the proverb says.", "I'd say it cuts both ways, really — it saves time, but it makes us lazy.", "It is raining cats and dogs of information."], correct: 2, why: "Một thành ngữ, có đệm (I'd say… really), giải thích ngay sau. A nhồi ba cụm; B câu dịch sáo; D sai nghĩa." },
          { q: "“We tend to ______ our parents ______ until we leave home.”", options: ["take … for granted", "take … for grant", "get … for granted", "take … as granted"], correct: 0, why: "take sb / sth for granted." },
          { q: "Firms that failed to move online early have largely ______.", options: ["cut corners", "sat on the fence", "missed the boat", "tightened their belts"], correct: 2, why: "Lỡ cơ hội ⇒ miss the boat." },
          { q: "Câu nào KHÔNG nên xuất hiện trong Task 2?", options: ["Volunteers play a key role in such projects.", "The scheme paved the way for further reform.", "Ultimately, the responsibility rests with employers.", "Bosses who cut corners always get away with it, don't they?"], correct: 3, why: "D: bosses, cut corners, get away with, câu hỏi đuôi — toàn văn nói. A, B thuộc vùng xám; C trang trọng." },
        ],
      },
      { t: "h", text: "Phần II — Từ văn nói sang văn viết (6 câu · ôn bài 1 mục 7)" },
      {
        t: "quiz", id: "t4d18-bt-trang-trong", kind: "fill", title: "II. Thay phần trong ngoặc bằng MỘT động từ trang trọng (đúng dạng)",
        items: [
          { q: "The team (carried out) ___ a survey of 500 households.", answers: ["conducted"] },
          { q: "Spending on rent now (is more than) ___ spending on food.", answers: ["exceeds"] },
          { q: "The report (brings up) ___ concerns about data privacy.", answers: ["raises"] },
          { q: "Migrants often (run into) ___ difficulties when looking for housing.", answers: ["encounter"] },
          { q: "It has become harder to (get) ___ a visa.", answers: ["obtain"] },
          { q: "Extra pay cannot (make up for) ___ for unsafe working conditions.", answers: ["compensate"] },
        ],
      },
      { t: "h", text: "Phần III — Ba pie theo nhóm: điền từ (6 câu · ôn bài 2 mục 3)" },
      { t: "p", text: "Dùng bảng số liệu dưới đây (ba pie đã chép thành bảng): **lý do tới thư viện công cộng của ba nhóm tuổi, năm 2022 (%)**." },
      {
        t: "table", caption: "Main reason for visiting a public library, by age group, 2022 (%) — số liệu tự đặt cho bài luyện",
        head: ["Reason", "Under 25", "25–59", "60 and over"],
        rows: [
          ["Borrowing books", "15", "35", "55"],
          ["Study space", "48", "15", "4"],
          ["Computers / internet", "22", "20", "21"],
          ["Events and classes", "5", "18", "14"],
          ["Other", "10", "12", "6"],
        ],
      },
      {
        t: "quiz", id: "t4d18-bt-pie-dien", kind: "fill", title: "III. Điền MỘT từ",
        items: [
          { q: "Borrowing books ___ for 55% of visits by the over-60s.", answers: ["accounted"] },
          { q: "…, compared ___ only 15% of those by the under-25s.", answers: ["with", "to"] },
          { q: "The figure for study space among the under-25s was twelve times ___ for the oldest group.", answers: ["that"] },
          { q: "Events and classes made up 18% and 14% of visits in the two older groups ___.", answers: ["respectively"] },
          { q: "The ___ was true of study space, which was used mainly by the young.", answers: ["reverse", "opposite"] },
          { q: "At 55%, book borrowing among the over-60s was 20 percentage ___ higher than among those aged 25–59.", answers: ["points"] },
        ],
      },
      { t: "h", text: "Phần IV — Ba pie theo nhóm: chọn câu tốt nhất (5 câu · ôn bài 2 mục 1–5)" },
      {
        t: "mcq", id: "t4d18-bt-pie-chon", title: "IV. Chọn đáp án đúng (dùng bảng ở Phần III)",
        items: [
          { q: "Overview nào tốt nhất?", options: ["Overall, the older the visitors, the more likely they were to come for books, whereas the young mainly wanted somewhere to study.", "Overall, borrowing books rose from 15% to 55% over the period.", "Overall, 48% of under-25s used the study space and 55% of over-60s borrowed books.", "Overall, libraries are important for all ages."], correct: 0, why: "A nêu quy luật xuyên nhóm. B dùng ngôn ngữ thời gian; C chỉ liệt kê số; D là ý kiến ngoài biểu đồ." },
          { q: "Câu nào tả ĐÚNG hạng mục computers / internet?", options: ["Computer use fell slightly and then recovered.", "Computer use was the main reason for the middle group.", "Computer use was twice as high among the young.", "Computer use was almost identical across the three groups, at around a fifth."], correct: 3, why: "22 – 20 – 21 ⇒ gần như bằng nhau, khoảng một phần năm. A dùng ngôn ngữ thời gian." },
          { q: "48% nên viết là", options: ["just over half", "just under half", "a third", "the vast majority"], correct: 1, why: "48 % = just under half / almost half." },
          { q: "Chia thân bài hợp nhất:", options: ["mỗi nhóm tuổi một đoạn", "số lớn trước, số nhỏ sau", "Thân 1: books + study space (hai hạng mục đối nhau theo tuổi) · Thân 2: computers, events, other", "chỉ một thân bài dài"], correct: 2, why: "Chia theo hạng mục; ghép hai hạng mục đi ngược nhau để so sánh trực tiếp." },
          { q: "Câu nào SAI?", options: ["Study space was the leading reason for under-25s.", "The proportion of over-60s who came to study was negligible.", "More people aged 60 and over than under-25s borrowed books.", "Books accounted for over half of visits in the oldest group."], correct: 2, why: "Biểu đồ cho TỈ LỆ, không cho số người; không biết nhóm nào đông hơn (bài 2 mục 5). Phải viết: a larger proportion of…" },
        ],
      },
      { t: "h", text: "Phần V — Dịch Việt → Anh (4 câu · ôn cả ngày)" },
      {
        t: "quiz", id: "t4d18-bt-dich", kind: "translate", title: "V. Dịch sang tiếng Anh", grammar: "idiom đúng dạng · động từ trang trọng · compared with · câu bắc cầu",
        items: [
          { q: "(Nói) Tôi mất vài tháng mới quen được công việc.", answers: ["It took me a few months to find my feet in the job.", "It took me several months to find my feet in the job.", "It took me a few months to find my feet at work.", "It took me a couple of months to find my feet in the job.", "It took me a few months to find my feet in my job.", "It took me a few months to find my feet in the new job."], hint: "It took me … to find my feet…" },
          { q: "(Viết) Chính phủ nên bãi bỏ loại thuế này.", answers: ["The government should abolish this tax.", "The government should abolish the tax.", "Governments should abolish this tax."], hint: "abolish" },
          { q: "(Viết) Mượn sách chiếm 55% ở nhóm già nhất, so với 15% ở nhóm trẻ nhất.", answers: ["Borrowing books accounted for 55% of the oldest group, compared with 15% of the youngest.", "Borrowing books accounted for 55% of the oldest group, compared with 15% of the youngest group.", "Borrowing books accounted for 55% of the oldest group, compared to 15% of the youngest.", "Book borrowing accounted for 55% of the oldest group, compared with 15% of the youngest.", "Borrowing books accounted for 55% in the oldest group, compared with 15% in the youngest."], hint: "accounted for … of the oldest group, compared with … of the youngest" },
          { q: "(Nói) Và tôi không nghĩ mình là ngoại lệ trong chuyện đó.", answers: ["And I don't think I'm unusual in that.", "And I do not think I am unusual in that.", "And I don't think I am unusual in that."], hint: "I don't think I'm unusual in that" },
        ],
      },
      { t: "h", text: "Phần VI — Part 3: ví dụ, paraphrase, ngữ điệu (4 câu · ôn bài 3)" },
      {
        t: "mcq", id: "t4d18-bt-noi", title: "VI. Chọn đáp án đúng",
        items: [
          { q: "Examiner: “Why do people read fewer books than in the past?” Ví dụ nào ở đúng TẦM của Part 3?", options: ["I read two books last year.", "My brother doesn't like reading.", "Take commuters, for instance: where people once opened a paperback, most now scroll through their phones.", "I prefer films, to be honest."], correct: 2, why: "C là ví dụ về một nhóm người trong xã hội. A, B, D chỉ nói về mình / người nhà và không bắc cầu." },
          { q: "Câu bắc cầu nào đưa chuyện cá nhân lên tầm xã hội?", options: ["That's all I can say.", "And I suspect that's true of most people my age.", "I hope you understand.", "It is my personal story."], correct: 1, why: "…that's true of most people my age = khái quát từ mình ra số đông." },
          { q: "“It's CONvenient ↘↗ …” Đường giọng xuống rồi lên cho người nghe biết", options: ["người nói rất chắc chắn và đã xong ý.", "người nói đang ngạc nhiên.", "người nói chán chủ đề này.", "người nói sắp thêm một ý “nhưng”."], correct: 3, why: "Xuống rồi lên (fall-rise) = dè dặt, còn điều chưa nói." },
          { q: "Examiner: “Are libraries still necessary?” Câu mở paraphrase tốt nhất:", options: ["Yes, libraries are still necessary.", "I'd say they still have a real part to play, yes — though not for the reasons they used to.", "Necessary? Yes.", "I go to the library every week."], correct: 1, why: "still necessary → still have a real part to play; có nhượng bộ mở ý tiếp. A lặp nguyên; D chỉ nói về mình." },
        ],
      },
    ],
  },
  {
    id: "t4d18-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 13–18)",
    goal: "Đo lại cả chặng 3 của Tập 4 theo 8 phần — ngữ pháp, từ vựng, dịch, nghe, đọc, viết, nói, phát âm — với ngưỡng đạt ≥ 70 % từng phần, và biết chính xác phần nào hụt thì ôn lại Ngày nào trước khi sang Ngày 19.",
    minutes: 170,
    blocks: [
      {
        t: "recap", title: "Cách làm bài kiểm tra chặng",
        items: [
          "Làm **một mạch** khoảng 2 giờ 50 phút (có thể tách: Phần 1–5 một buổi, Phần 6–8 buổi sau). **Không** mở lại bài học, không tra từ.",
          "Mỗi phần có **ngưỡng đạt ≥ 70 %** ghi ở tiêu đề, kèm **Ngày cần ôn** nếu hụt.",
          "Nghe: mỗi bản ghi nghe **một lần**. Đọc: bấm giờ **15 phút**. Viết: Task 1 **20 phút**, Task 2 **40 phút**.",
          "Chặng này gồm: **N13** hedging · bị động vô nhân xưng · referencing / substitution / ellipsis — **N14** AWL 9 · Volunteering · Money · ưu – nhược “outweigh” — **N15** từ nối đúng liều · nhân quả tinh · nối đuôi câu — **N16** dân số · di cư · bình đẳng · bảng ba chiều · map nhiều tầng — **N17** tường thuật học thuật · causative · flow-chart kỹ thuật — **N18** idiom & register · pie theo nhóm.",
        ],
      },

      { t: "h", text: "Phần 1 — Ngữ pháp (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 13, 15, 17)" },
      {
        t: "mcq", id: "t4d18-kt-ngu-phap-chon", title: "1a. Chọn đáp án đúng (12 câu)",
        items: [
          { q: "Remote working ______ to cut commuting costs, although the evidence is still mixed.", options: ["is proved", "appears", "must", "definitely"], correct: 1, why: "Rào đón: appear to + V (Ngày 13). “although the evidence is mixed” loại các từ chắc chắn." },
          { q: "The virus ______ in bats before spreading to humans.", options: ["is thought to have originated", "is thought that it originated", "thinks to originate", "is thought originating"], correct: 0, why: "S + is thought + to have V3 (Ngày 13 · 17)." },
          { q: "Rents have risen by 40% in five years. ______ has forced many families out of the centre.", options: ["It increase", "Such", "This increase", "These"], correct: 2, why: "Referencing: This + danh từ tóm tắt (Ngày 13)." },
          { q: "Some firms offer flexible hours, but most ______.", options: ["don't offer it them", "aren't", "not", "do not"], correct: 3, why: "Ellipsis: …but most do not (offer flexible hours) (Ngày 13)." },
          { q: "Residents were asked to use less water, and the majority ______.", options: ["did it so", "did so", "so did", "did such"], correct: 1, why: "Substitution: do so thay cả cụm động từ (Ngày 13)." },
          { q: "The scheme was popular with users; ______, it was cancelled after a year.", options: ["nevertheless", "although", "despite", "whereas"], correct: 0, why: "Sau dấu chấm phẩy cần trạng từ nối + dấu phẩy: nevertheless. Although / whereas là liên từ; despite + N (Ngày 15)." },
          { q: "The council closed the centre to traffic, ______ reducing air pollution.", options: ["so that", "which", "thereby", "because"], correct: 2, why: "S + V, thereby + V-ing (Ngày 15)." },
          { q: "The decline of the fishing industry ______ decades of overfishing.", options: ["leads to", "results in", "contributes to", "stems from"], correct: 3, why: "Chủ ngữ là KẾT QUẢ ⇒ cần động từ chỉ ngược về nguyên nhân: stem from (Ngày 15)." },
          { q: "Higher wages raise firms' costs, ______ pushes up prices.", options: ["what in turn", "which in turn", "that in turn", "it in turn"], correct: 1, why: ", which in turn + V — which thay cả mệnh đề trước (Ngày 15)." },
          { q: "The article ______ the risks of the new treatment in detail.", options: ["discusses", "discusses about", "mentions about", "argues about"], correct: 0, why: "discuss + N, không about (Ngày 17)." },
          { q: "Low pay makes many teachers ______ the profession.", options: ["to leave", "leaving", "leave", "left"], correct: 2, why: "make + O + V trần (Ngày 17)." },
          { q: "Employees were made ______ unpaid overtime.", options: ["work", "working", "worked", "to work"], correct: 3, why: "Bị động của make: be made to V (Ngày 17)." },
        ],
      },
      {
        t: "quiz", id: "t4d18-kt-ngu-phap-dien", kind: "fill", title: "1b. Điền MỘT hoặc HAI từ, hoặc dạng đúng của động từ trong ngoặc (6 câu)",
        items: [
          { q: "People believe that the bridge is unsafe. → The bridge is believed ___ ___ unsafe.", answers: ["to be"] },
          { q: "It is likely that prices will rise. → Prices are ___ ___ rise.", answers: ["likely to"] },
          { q: "The 2020 figure was higher than ___ of 2010. (thay “the figure”)", answers: ["that"] },
          { q: "Many young people leave rural areas. ___ a trend is hard to reverse.", answers: ["Such"] },
          { q: "The committee suggested ___ (delay) the launch until spring.", answers: ["delaying"] },
          { q: "The council had the old trees ___ (remove) last winter.", answers: ["removed"] },
        ],
      },

      { t: "h", text: "Phần 2 — Từ vựng (10 + 6 câu · đạt ≥ 12/16 · trượt thì ôn Ngày 14, 16, 18)" },
      {
        t: "mcq", id: "t4d18-kt-tu-vung-chon", title: "2a. Chọn từ đúng (10 câu)",
        items: [
          { q: "The festival ______ with the school holidays, so the town was packed.", options: ["coincided", "confined", "commenced", "converted"], correct: 0, why: "coincide with = trùng thời điểm (AWL 9)." },
          { q: "Public trust has been ______ by a series of scandals.", options: ["refined", "eroded", "attained", "unified"], correct: 1, why: "erode trust = làm xói mòn niềm tin (AWL 9)." },
          { q: "There are risks ______ in any new technology.", options: ["mutual", "manual", "inherent", "intermediate"], correct: 2, why: "inherent in = vốn có trong (AWL 9)." },
          { q: "______ findings suggest the drug is safe; the full results are due next year.", options: ["Passive", "Rigid", "Military", "Preliminary"], correct: 3, why: "preliminary findings = kết quả sơ bộ (AWL 9)." },
          { q: "The food bank relies entirely on ______ from local residents.", options: ["donations", "pensions", "wages", "loans"], correct: 0, why: "donations = đồ / tiền quyên góp (Volunteering)." },
          { q: "Many graduates start their working lives heavily in ______.", options: ["budget", "income", "debt", "profit"], correct: 2, why: "be in debt = mắc nợ (Money)." },
          { q: "As ______ rises, pension systems come under growing strain.", options: ["birth rate", "life expectancy", "brain drain", "social mobility"], correct: 1, why: "life expectancy = tuổi thọ trung bình (Ngày 16)." },
          { q: "Money sent home by people working abroad is known as", options: ["welfare", "influx", "deprivation", "remittances"], correct: 3, why: "remittances = kiều hối (Ngày 16)." },
          { q: "Treating people unfairly because of their age, sex or background is", options: ["discrimination", "diversity", "tolerance", "cohesion"], correct: 0, why: "discrimination = phân biệt đối xử (Ngày 16)." },
          { q: "The cases reported so far are just the tip of the ______.", options: ["ocean", "mountain", "iceberg", "moon"], correct: 2, why: "the tip of the iceberg (Ngày 18)." },
        ],
      },
      {
        t: "quiz", id: "t4d18-kt-tu-vung-dang", kind: "fill", title: "2b. Viết dạng đúng của từ trong ngoặc, hoặc điền từ còn thiếu (6 câu)",
        items: [
          { q: "She works at the shelter on a ___ (volunteer) basis.", answers: ["voluntary"] },
          { q: "The city needs far more ___ (afford) housing.", answers: ["affordable"] },
          { q: "When skilled workers leave for richer countries, it is called a brain ___.", answers: ["drain"] },
          { q: "Education is the main route to social ___ (mobile).", answers: ["mobility"] },
          { q: "Builders who cut ___ put residents at risk.", answers: ["corners"] },
          { q: "(Viết trang trọng) Residents should not have to (put up with) ___ such noise.", answers: ["tolerate"] },
        ],
      },

      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      { t: "p", text: "Mỗi câu ôn một ngày của chặng, theo thứ tự Ngày 13 → 18. Sai câu nào, ôn ngày đó." },
      {
        t: "quiz", id: "t4d18-kt-dich", kind: "translate", title: "3. Dịch sang tiếng Anh", grammar: "tend to · outweigh · stem from · put pressure on · It is often argued that + make O V · three times that of",
        items: [
          { q: "Mạng xã hội có xu hướng làm tăng lo âu ở thanh thiếu niên.", answers: ["Social media tends to increase anxiety among teenagers.", "Social media tends to increase anxiety in teenagers.", "Social media tends to raise anxiety among teenagers.", "Social media tend to increase anxiety among teenagers.", "Social media tends to increase anxiety among adolescents."], hint: "tend to + V (Ngày 13)" },
          { q: "Theo tôi, lợi ích rõ ràng lớn hơn bất lợi.", answers: ["In my view, the benefits clearly outweigh the drawbacks.", "In my view, the advantages clearly outweigh the disadvantages.", "In my opinion, the benefits clearly outweigh the drawbacks.", "In my opinion, the advantages clearly outweigh the disadvantages.", "In my view, the benefits clearly outweigh the disadvantages.", "In my view, the advantages clearly outweigh the drawbacks."], hint: "clearly outweigh (Ngày 14)" },
          { q: "Tắc đường bắt nguồn từ quy hoạch kém.", answers: ["Congestion stems from poor planning.", "Traffic congestion stems from poor planning.", "Traffic jams stem from poor planning.", "Congestion stems from poor urban planning.", "Traffic congestion stems from poor urban planning."], hint: "stem from (Ngày 15)" },
          { q: "Dân số già hoá gây áp lực lên hệ thống y tế.", answers: ["An ageing population puts pressure on the health system.", "An ageing population puts pressure on the healthcare system.", "An ageing population places a strain on the health system.", "An ageing population places a strain on the healthcare system.", "The ageing population puts pressure on the health system.", "An ageing population puts pressure on health services.", "An aging population puts pressure on the healthcare system."], hint: "an ageing population · put pressure on (Ngày 16)" },
          { q: "Người ta thường lập luận rằng quảng cáo khiến trẻ em ăn đồ ăn không lành mạnh.", answers: ["It is often argued that advertising makes children eat unhealthy food.", "It is often argued that advertisements make children eat unhealthy food.", "It is often argued that advertising makes children eat unhealthy foods."], hint: "It is often argued that… makes + O + V (Ngày 17)" },
          { q: "Tỉ lệ chi cho thực phẩm của nhóm thu nhập thấp cao gần gấp ba của nhóm thu nhập cao.", answers: ["The share spent on food by the low-income group was almost three times that of the high-income group.", "The proportion spent on food by the low-income group was almost three times that of the high-income group.", "The share spent on food by the low-income group was nearly three times that of the high-income group.", "The proportion spent on food by the low-income group was nearly three times that of the high-income group.", "The share spent on food by the low-income group was almost three times that for the high-income group.", "The proportion spent on food by the low-income group was almost three times that for the high-income group."], hint: "The share spent on food by … was almost three times that of … (Ngày 18)" },
        ],
      },

      { t: "h", text: "Phần 4 — Nghe (5 + 5 + 3 câu · đạt ≥ 10/13 · trượt thì ôn Ngày 13, 16, 17)" },
      { t: "p", text: "**Bản ghi 1 — cuối một bài giảng (Summary completion).** Nghe một lần. Điền **ONE WORD ONLY**." },
      {
        t: "listen", id: "t4d18-kt-nghe-mat-ong", title: "Why honey keeps",
        dan: { so: "Stage test, Days 13 to 18, Recording 1", boiCanh: "the end of a lecture on food science.", cau: [1, 5] },
        note: "Khoảng 1 phút 20 giây, giọng Canada (nữ).",
        lines: [
          { who: "Lecturer", voice: "ca-nu", text: "Before we finish, a quick puzzle from food science. Why does honey, almost alone among the foods in your kitchen, never seem to go off? There are three reasons, and they work together. The first is that honey contains remarkably little water, less than a fifth by weight. Nectar starts out thin and runny, so once it's in the hive, the bees fan it with their wings, hour after hour, until most of the liquid has evaporated. Bacteria that land in something so dry simply have the water drawn out of them.", vi: "Trước khi kết thúc, một câu đố nhanh từ khoa học thực phẩm. Vì sao mật ong, gần như duy nhất trong các món ở bếp nhà bạn, dường như không bao giờ hỏng? Có ba lý do, và chúng phối hợp với nhau. Thứ nhất, mật ong chứa cực ít nước, chưa tới một phần năm khối lượng. Mật hoa ban đầu loãng, nên khi về tổ, ong quạt nó bằng cánh, giờ này qua giờ khác, tới khi phần lớn chất lỏng bay hơi. Vi khuẩn rơi vào thứ khô như vậy đơn giản là bị rút hết nước." },
          { who: "Lecturer", voice: "ca-nu", text: "The second reason is chemical. As bees process the nectar, they add an enzyme, and one of the things it does is make the honey acidic, roughly as acidic as orange juice, which very few microbes can tolerate. And the third is that the same enzyme slowly releases tiny amounts of hydrogen peroxide, a substance once used to clean wounds.", vi: "Lý do thứ hai là hoá học. Khi ong chế biến mật hoa, chúng thêm một enzyme, và một trong những việc nó làm là khiến mật có tính axit, cỡ như nước cam, thứ rất ít vi sinh vật chịu được. Và thứ ba là chính enzyme đó từ từ giải phóng một lượng rất nhỏ hydrogen peroxide (ô-xy già), chất từng được dùng để rửa vết thương." },
          { who: "Lecturer", voice: "ca-nu", text: "The evidence that this works is striking. Archaeologists have opened jars of honey sealed in Egyptian tombs three thousand years ago and found the contents perfectly edible. One practical point. Old honey often turns cloudy and solid. That isn't decay; the sugar has simply formed crystals. Stand the jar in warm water and it'll clear. Just don't let it get so hot that it's boiled, or you'll destroy the flavour.", vi: "Bằng chứng cho thấy điều này hiệu quả rất ấn tượng. Các nhà khảo cổ đã mở những hũ mật niêm phong trong lăng mộ Ai Cập từ ba nghìn năm trước và thấy bên trong vẫn ăn được hoàn toàn. Một điểm thực tế. Mật cũ thường đục và đặc lại. Đó không phải hư hỏng; chỉ là đường kết tinh. Đặt hũ vào nước ấm là nó trong lại. Chỉ đừng để nóng tới mức bị đun sôi, kẻo mất hương vị." },
        ],
      },
      {
        t: "quiz", id: "t4d18-kt-nghe-mat-ong-cau", kind: "fill", title: "Questions 1–5 — Summary (ONE WORD ONLY)",
        items: [
          { q: "(1) Honey does not spoil mainly because it holds very little ______.", answers: ["water"] },
          { q: "(2) In the hive, bees dry the nectar using their ______.", answers: ["wings"] },
          { q: "(3) An enzyme added by the bees makes honey ______, like orange juice.", answers: ["acidic"] },
          { q: "(4) Honey found in ancient ______ in Egypt could still be eaten.", answers: ["tombs"] },
          { q: "(5) Honey that has gone solid should be warmed, but never ______.", answers: ["boiled"] },
        ],
      },
      { t: "p", text: "**Bản ghi 2 — Part 3: hai sinh viên bàn về một khảo sát.** Nghe một lần. Chọn **A, B hoặc C**." },
      {
        t: "listen", id: "t4d18-kt-nghe-khao-sat", title: "Planning a survey on student volunteering",
        dan: { so: "Stage test, Days 13 to 18, Recording 2", boiCanh: "two students, Tom and Hannah, planning a survey about volunteering.", cau: [6, 10] },
        note: "Khoảng 1 phút 30 giây. Giọng New Zealand (nam) · Anh (nữ).",
        lines: [
          { who: "Tom", voice: "nz-nam", text: "So, our survey on student volunteering. Have you looked at the report last year's group wrote?", vi: "Nào, khảo sát của mình về tình nguyện trong sinh viên. Cậu xem báo cáo của nhóm năm ngoái chưa?" },
          { who: "Hannah", voice: "uk-nu", text: "I have. Their questionnaire was fine, I thought, and they got plenty of replies. The weakness was that they only asked people who were already volunteering, so they couldn't say anything about why most students don't.", vi: "Rồi. Bảng hỏi của họ ổn, tớ nghĩ vậy, và họ nhận được nhiều phiếu. Điểm yếu là họ chỉ hỏi những người đang làm tình nguyện, nên không nói được gì về lý do đa số sinh viên không làm." },
          { who: "Tom", voice: "nz-nam", text: "Right, so we include everyone. I'd assumed the main barrier would be lack of time.", vi: "Ừ, vậy mình hỏi tất cả. Tớ cứ cho là rào cản chính là thiếu thời gian." },
          { who: "Hannah", voice: "uk-nu", text: "That's what everyone says, but the national figures suggest it's more that students simply aren't asked. They don't know what's on offer. Time only comes second.", vi: "Ai cũng nói vậy, nhưng số liệu toàn quốc cho thấy chủ yếu là sinh viên chẳng được ai mời. Họ không biết có những gì. Thời gian chỉ đứng thứ hai." },
          { who: "Tom", voice: "nz-nam", text: "Interesting. How do we reach them, then? The student union mailing list?", vi: "Hay đấy. Vậy mình tiếp cận họ thế nào? Danh sách email của hội sinh viên à?" },
          { who: "Hannah", voice: "uk-nu", text: "It goes to twenty thousand people, but the ones who'd reply are the keen ones again. I'd rather stand outside the library with a tablet and stop people.", vi: "Nó tới hai mươi nghìn người, nhưng người trả lời lại là những người nhiệt tình. Tớ thà đứng ngoài thư viện với máy tính bảng và chặn hỏi mọi người." },
          { who: "Tom", voice: "nz-nam", text: "Fair point. Face to face it is, even if it's slower. And for the write-up, a pie chart for each year group?", vi: "Có lý. Vậy hỏi trực tiếp, dù chậm hơn. Còn phần viết, mỗi khoá một biểu đồ tròn nhé?" },
          { who: "Hannah", voice: "uk-nu", text: "Three pies side by side are hard to compare. I'd put the main results in one table and leave the charts out.", vi: "Ba biểu đồ tròn cạnh nhau khó so lắm. Tớ sẽ đặt kết quả chính vào một bảng và bỏ biểu đồ." },
          { who: "Tom", voice: "nz-nam", text: "OK, a table. What worries me is the deadline. Two weeks isn't long.", vi: "Được, một bảng. Tớ lo cái hạn chót. Hai tuần không dài." },
          { who: "Hannah", voice: "uk-nu", text: "We'll manage that. What I'm less sure of is whether people will be honest. Nobody likes admitting they just can't be bothered.", vi: "Mình xoay được. Điều tớ kém chắc hơn là liệu người ta có thật thà không. Chẳng ai thích thừa nhận là mình đơn giản không buồn làm." },
        ],
      },
      {
        t: "mcq", id: "t4d18-kt-nghe-khao-sat-cau", title: "Questions 6–10",
        items: [
          { q: "6. What was the main weakness of last year's study?", options: ["It received too few responses.", "Its questions were badly worded.", "It surveyed only students who volunteer."], correct: 2, why: "“they only asked people who were already volunteering”. A, B bị bác: questionnaire was fine, plenty of replies." },
          { q: "7. According to national data, the main reason students do not volunteer is that they", options: ["are too busy.", "have not been invited to.", "cannot afford to."], correct: 1, why: "“students simply aren't asked… Time only comes second.”" },
          { q: "8. The students decide to collect their data by", options: ["approaching people in person.", "using the union's mailing list.", "posting a poll online."], correct: 0, why: "“stand outside the library… Face to face it is.” Mailing list bị bác." },
          { q: "9. The main results will be presented in", options: ["a set of pie charts.", "a bar chart.", "a table."], correct: 2, why: "“put the main results in one table and leave the charts out.”" },
          { q: "10. What is Hannah most concerned about?", options: ["meeting the deadline", "whether respondents will tell the truth", "the size of the sample"], correct: 1, why: "“We'll manage that [deadline]. What I'm less sure of is whether people will be honest.”" },
        ],
      },
      { t: "p", text: "**Bản ghi 3 — Part 2: sơ đồ hai tầng (ôn Ngày 16).** Không có hình: nghe một lần và lần theo hướng trong đầu (hoặc vẽ nhanh ra nháp). Chọn **A, B hoặc C**." },
      {
        t: "listen", id: "t4d18-kt-nghe-so-do", title: "Finding your way around the Kestrel Arts Centre",
        dan: { so: "Stage test, Days 13 to 18, Recording 3", boiCanh: "a guide explaining the layout of an arts centre to new visitors.", cau: [11, 13] },
        note: "Khoảng 40 giây. Giọng Úc (nữ).",
        lines: [
          { who: "Guide", voice: "au-nu", text: "Welcome to the Kestrel Arts Centre. You've come in through the main doors on the south side, so you're facing north, and the ticket office is immediately on your right. The café used to be next to it, but it's moved: it's now the last room on your left, at the far end of the ground-floor corridor.", vi: "Chào mừng tới Trung tâm Nghệ thuật Kestrel. Các bạn vào bằng cửa chính ở mặt nam, nên đang quay mặt về bắc, và quầy vé ở ngay bên phải. Quán cà phê trước đây ở cạnh quầy vé, nhưng đã chuyển: giờ nó là phòng cuối cùng bên trái, ở tận cuối hành lang tầng trệt." },
          { who: "Guide", voice: "au-nu", text: "The studios are upstairs. When you step out of the lift on the first floor, you'll be facing south, so remember that left and right are the other way round. The pottery studio is the first door on your left, and the dance studio is directly above the café.", vi: "Các xưởng ở trên lầu. Khi bước ra khỏi thang máy ở tầng một, các bạn sẽ quay mặt về nam, nên nhớ là trái và phải ngược lại. Xưởng gốm là cửa đầu tiên bên trái, còn phòng múa nằm ngay trên quán cà phê." },
        ],
      },
      {
        t: "mcq", id: "t4d18-kt-nghe-so-do-cau", title: "Questions 11–13",
        items: [
          { q: "11. Where is the café now?", options: ["at the far end of the ground-floor corridor, on the left", "next to the ticket office", "on the first floor"], correct: 0, why: "“The café used to be next to it, but it's moved: it's now the last room on your left, at the far end…” — vị trí cũ (next to the ticket office) là bẫy (Ngày 16 · bẫy ②)." },
          { q: "12. In relation to the lift, the pottery studio is", options: ["to the west.", "directly above the ticket office.", "to the east."], correct: 2, why: "Ra khỏi thang quay mặt về NAM ⇒ bên trái là ĐÔNG. Quên đảo trái – phải sẽ chọn nhầm “west” (Ngày 16 · bẫy ①)." },
          { q: "13. The dance studio is", options: ["above the old site of the café, beside the ticket office.", "above the café's present position, at the end of the corridor.", "next to the lift."], correct: 1, why: "“directly above the café” — quán cà phê ĐÃ CHUYỂN, nên phải lấy vị trí mới ở cuối hành lang rồi chiếu lên tầng trên." },
        ],
      },

      { t: "h", text: "Phần 5 — Đọc (4 + 3 + 3 câu · đạt ≥ 7/10 · 15 phút · trượt thì ôn Ngày 13, 15, 17)" },
      {
        t: "passage", title: "Listening at a Distance",
        paras: [
          { label: "A", text: "In the autumn of 1816 a young Parisian physician, René Laennec, was called to examine a woman with the symptoms of heart disease. The usual method was for the doctor to press an ear directly against the patient's chest, a practice Laennec considered both improper and, in a patient who was far from thin, ineffective. He recalled having watched children at play in a courtyard some days earlier: one scratched the end of a long wooden beam with a pin while the others, ears pressed to the far end, heard the sound clearly. Laennec rolled several sheets of paper into a tight tube, set one end over the woman's heart and listened at the other. He was, he later wrote, surprised to hear the heartbeat more distinctly than he ever had before." },
          { label: "B", text: "Over the following three years he refined the idea. Paper was replaced by wood, which he turned on a lathe in his own workshop into a hollow cylinder about twenty-five centimetres long, made in two sections so that it could be carried in a pocket. More importantly, he listened to hundreds of patients, noted what he heard and, when they died, compared his notes with what examination of the body revealed. The treatise he published in 1819 was therefore not merely the description of an instrument; it was a catalogue linking particular sounds to particular diseases of the lungs and heart." },
          { label: "C", text: "The device was not universally welcomed. Some older practitioners dismissed it as a toy, and a few apparently feared that carrying an instrument would make a physician look like a surgeon, then a far less respected occupation. Within a generation, however, it had become standard, and in the 1850s the single tube gave way to a model with flexible rubber tubing and two earpieces, the form still familiar today." },
          { label: "D", text: "Historians of medicine have argued that the stethoscope's real significance lay less in what it detected than in what it did to the consultation. Until then, diagnosis had rested largely on the patient's own account of how he or she felt. Now the doctor could obtain evidence that the patient could neither hear nor dispute. It has been suggested that this shift, whatever its benefits, placed a new distance between the two, a distance measured, quite literally, by the length of the tube." },
          { label: "E", text: "Whether the instrument has a future is less certain. Pocket-sized ultrasound scanners now show the heart rather than merely letting it be heard, and some cardiologists predict that the stethoscope will be obsolete within a generation. Others point out that it is cheap, needs no battery, and may reassure patients simply because it requires the doctor to come close." },
        ],
      },
      { t: "p", text: "**Questions 1–4.** Complete each sentence with the correct ending, **A–F**. · **A** he remembered a game in which sound travelled through wood. · **B** they were worried about its effect on their professional standing. · **C** he judged it unsuitable and unlikely to work in this case. · **D** it let patients describe their symptoms more accurately. · **E** it connected what could be heard with specific illnesses. · **F** it was too costly for ordinary doctors to buy." },
      {
        t: "quiz", id: "t4d18-kt-doc-duoi", kind: "fill", title: "Questions 1–4 — viết chữ cái A–F",
        items: [
          { q: "(1) Laennec was unwilling to use the normal method of examination because ___", answers: ["C"], hint: "đoạn A: “both improper and… ineffective”" },
          { q: "(2) The idea for the instrument came to Laennec when ___", answers: ["A"], hint: "đoạn A: children… a long wooden beam" },
          { q: "(3) The book Laennec published in 1819 was important because ___", answers: ["E"], hint: "đoạn B: “linking particular sounds to particular diseases”" },
          { q: "(4) Some doctors at first refused to use the device because ___", answers: ["B"], hint: "đoạn C: “look like a surgeon, then a far less respected occupation”" },
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Questions 5–7 — How the instrument developed. ONE WORD ONLY from the passage.",
        steps: [
          { label: "1816: first version", sub: "a tube formed from rolled sheets of **5 ______**" },
          { label: "1816–1819: wooden version", sub: "a hollow cylinder shaped on a **6 ______** ; two parts, pocket-sized" },
          { label: "1850s: modern form", sub: "two earpieces joined by tubing made of **7 ______**" },
        ],
      },
      {
        t: "quiz", id: "t4d18-kt-doc-flow", kind: "fill", title: "Questions 5–7 — Flow-chart (ONE WORD ONLY)",
        items: [
          { q: "(5) rolled sheets of ______", answers: ["paper"] },
          { q: "(6) shaped on a ______", answers: ["lathe"], hint: "đoạn B: “which he turned on a …” — thuật ngữ không cần biết nghĩa" },
          { q: "(7) tubing made of ______", answers: ["rubber"] },
        ],
      },
      {
        t: "mcq", id: "t4d18-kt-doc-ynng", title: "Questions 8–10 — Do the statements agree with the claims in the passage? (Yes / No / Not Given)",
        items: [
          { q: "8. Historians consider that the stethoscope mattered chiefly because of the number of conditions it could identify.", options: ["Yes", "No", "Not Given"], correct: 1, why: "Đoạn D: “lay LESS in what it detected THAN in what it did to the consultation” ⇒ ngược lại." },
          { q: "9. Before 1816, patients were generally dissatisfied with the way doctors reached a diagnosis.", options: ["Yes", "No", "Not Given"], correct: 2, why: "Bài chỉ nói chẩn đoán dựa vào lời kể của bệnh nhân; không nói họ hài lòng hay không." },
          { q: "10. It is clear that ultrasound scanners will replace the stethoscope.", options: ["Yes", "No", "Not Given"], correct: 1, why: "Đoạn E: “less certain”; “some… predict” nhưng “Others point out…” ⇒ người viết không coi là chắc chắn (đọc mức chắc chắn — Ngày 13)." },
        ],
      },

      { t: "h", text: "Phần 6 — Viết (5 câu + Task 1 + Task 2 · trượt thì ôn Ngày 14, 16, 18)" },
      {
        t: "mcq", id: "t4d18-kt-viet-chon", title: "6a. Kiến thức viết band 7 (5 câu · đạt ≥ 4/5)",
        items: [
          { q: "Đề: “Do the advantages outweigh the disadvantages?” Câu luận đề nào đạt band 7?", options: ["This essay will discuss the advantages and disadvantages.", "There are both advantages and disadvantages to this trend.", "Although this trend brings certain drawbacks, I believe they are clearly outweighed by its economic and social benefits.", "Some people like it and some people do not."], correct: 2, why: "Đề hỏi bên nào nặng hơn ⇒ luận đề phải nêu rõ lập trường và giữ suốt bài (Ngày 14)." },
          { q: "Một bảng ba chiều có 24 con số. Cách làm band 7:", options: ["chọn khoảng 10–12 số nổi bật, nhóm đối tượng giống nhau vào một đoạn", "chép đủ 24 số theo từng hàng", "chỉ nêu số lớn nhất và nhỏ nhất", "bỏ overview để có chỗ cho số liệu"], correct: 0, why: "Chọn lọc + nhóm = TA band 7 (Ngày 16)." },
          { q: "Ba pie so ba nước trong CÙNG một năm. Câu nào dùng sai ngôn ngữ?", options: ["Hydropower dominated in Country C.", "Coal accounted for over half of the total in Country A.", "The share of nuclear power was highest in Country B.", "Coal fell dramatically to 2% in Country C."], correct: 3, why: "fell dramatically to = thay đổi theo thời gian; dữ liệu không có thời gian (Ngày 18)." },
          { q: "55% so với 35% là cao hơn", options: ["20 percent", "20 percentage points", "20 percentages", "a fifth"], correct: 1, why: "Hiệu của hai tỉ lệ tính bằng percentage points (Ngày 18)." },
          { q: "Câu nào đúng văn phong Task 2?", options: ["Loads of old folks can't make ends meet.", "Pensioners are really struggling, to be honest.", "A growing number of elderly people struggle to cover basic living costs.", "It costs an arm and a leg to grow old these days!"], correct: 2, why: "C trung tính – trang trọng. A, B, D có từ văn nói / thành ngữ đời thường (Ngày 18)." },
        ],
      },
      { t: "p", text: "**6b. Task 1 (20 phút, ≥ 150 từ).** Ba pie theo **nước**, cùng một năm. AI chấm; mục tiêu **≥ 6.5**." },
      { t: "figure", fig: { kind: "pie", title: "Country A — electricity by source, 2020 (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Coal", value: 55 }, { label: "Gas", value: 20 }, { label: "Nuclear", value: 5 }, { label: "Hydro", value: 8 }, { label: "Wind and solar", value: 12 }] } },
      { t: "figure", fig: { kind: "pie", title: "Country B — electricity by source, 2020 (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Coal", value: 10 }, { label: "Gas", value: 35 }, { label: "Nuclear", value: 30 }, { label: "Hydro", value: 5 }, { label: "Wind and solar", value: 20 }] } },
      { t: "figure", fig: { kind: "pie", title: "Country C — electricity by source, 2020 (%)", note: "Số liệu tự đặt cho bài luyện.", slices: [{ label: "Coal", value: 2 }, { label: "Gas", value: 8 }, { label: "Hydro", value: 60 }, { label: "Wind and solar", value: 30 }] } },
      {
        t: "essay", id: "t4d18-kt-viet-task1", task: "Task 1",
        prompt: "The pie charts below show the sources of electricity in three countries in 2020. Country A: coal 55%, gas 20%, nuclear 5%, hydro 8%, wind and solar 12%. Country B: coal 10%, gas 35%, nuclear 30%, hydro 5%, wind and solar 20%. Country C: coal 2%, gas 8%, nuclear 0%, hydro 60%, wind and solar 30%. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Không có trục thời gian ⇒ không rose / fell. Quá khứ đơn.",
          "Gộp: **nhiên liệu hoá thạch** (coal + gas: 75 / 45 / 10) và **tái tạo** (hydro + wind & solar: 20 / 25 / 90). Nuclear chỉ đáng kể ở B.",
          "Overview: A dựa vào hoá thạch, C gần như hoàn toàn tái tạo, B đa dạng nhất.",
        ],
      },
      { t: "p", text: "**6c. Task 2 (40 phút, ≥ 250 từ).** AI chấm; mục tiêu **≥ 6.5**. Đề hỏi “outweigh” ⇒ lập trường rõ từ mở bài tới kết bài." },
      {
        t: "essay", id: "t4d18-kt-viet-task2", task: "Task 2",
        prompt: "In many countries, growing numbers of young adults are leaving rural areas to live and work in large cities. Do the advantages of this development outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Từ vựng Ngày 16: urbanisation · depopulation · ageing population · labour shortage · remittances · affordable housing.",
          "Nhân quả tinh (Ngày 15): …, thereby + V-ing · which in turn · stem from. Hedging (Ngày 13): tend to · is likely to.",
          "Tường thuật (Ngày 17): It is often argued that… · The claim that… overlooks… — tối đa 2–3 câu.",
          "Không thành ngữ đời thường; ≤ 2 trạng từ nối đầu câu mỗi đoạn.",
        ],
      },

      { t: "h", text: "Phần 7 — Nói (Part 2 + 4 câu Part 3 · AI ≥ band 6.5 · trượt thì ôn Ngày 14, 15, 18)" },
      { t: "p", text: "Part 2: 1 phút ghi ý, nói **2 phút**. Part 3: mỗi câu **45–60 giây**; câu đầu paraphrase câu hỏi, ví dụ ở tầm xã hội, câu nhân quả nói thành **chuỗi** (Ngày 15)." },
      { t: "speak", id: "t4d18-kt-noi-p2", part: "2", questions: ["Describe an event in your community that you attended or helped to organise. You should say: what the event was, who organised it, what happened there, and explain why you remember it."] },
      {
        t: "speak", id: "t4d18-kt-noi-p3", part: "3",
        questions: [
          "Why do you think fewer people take part in community events than in the past?",
          "What effect does volunteering have on the people who do it?",
          "Do young people and older people look at money in different ways?",
          "Some people say cities make people less willing to help strangers. To what extent do you agree?",
        ],
      },

      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại khối phát âm của ngày bị sai)" },
      {
        t: "mcq", id: "t4d18-kt-phat-am", title: "8. Chọn đáp án đúng (8 câu)",
        items: [
          { q: "Trong “asked for more details”, đuôi -ed của asked đọc là", options: ["/t/", "/d/", "/ɪd/", "không đọc, và bỏ luôn /k/ lẫn /s/"], correct: 0, why: "Sau âm vô thanh /k/, -ed đọc /t/. Nói nhanh, /t/ kẹp giữa /k/ và /f/ có thể lướt (Ngày 5), nhưng /s/ và /k/ thì phải còn — không được rụng cả cụm (Ngày 13)." },
          { q: "Từ nào kết thúc bằng cụm phụ âm /sts/?", options: ["course", "coast", "costs", "cause"], correct: 2, why: "costs /kɒsts/ — giữ đủ /s/ cuối (Ngày 13)." },
          { q: "“We need time, money and volunteers.” Ngữ điệu liệt kê chuẩn:", options: ["xuống · xuống · xuống", "lên · lên · xuống", "xuống · lên · lên", "phẳng cả câu"], correct: 1, why: "Các mục chưa hết: lên; mục cuối: xuống (Ngày 14)." },
          { q: "Chỗ ngắt nào giúp người nghe tách nguyên nhân và hệ quả?", options: ["Rents | go up so young people move out.", "Rents go up so young | people move out.", "Rents go up so young people move | out.", "Rents go up, | so young people move out."], correct: 3, why: "Ngắt giữa hai mắt xích của chuỗi nhân quả, không ngắt giữa một cụm từ (Ngày 15)." },
          { q: "Khi nói nhanh “Tell him I called”, âm nào thường rơi?", options: ["/h/ của him", "/t/ của tell", "/k/ của called", "/l/ của tell"], correct: 0, why: "/h/ rơi ở he / his / him / her không nhấn: tell 'im (Ngày 16)." },
          { q: "Trọng âm chính của “sustainability” rơi vào", options: ["sus-", "-tain-", "-bi-", "-ty"], correct: 2, why: "Đuôi -ity ⇒ âm ngay trước: sustainaBIlity (Ngày 17)." },
          { q: "Cặp nào ĐỔI vị trí trọng âm?", options: ["manage → management", "economy → economic", "reliable → reliably", "develop → developing"], correct: 1, why: "eCOnomy → ecoNOmic (đuôi -ic kéo trọng âm) (Ngày 17)." },
          { q: "“To some exTENT ↘↗ …” — giọng xuống rồi lên báo hiệu", options: ["người nói đã nói xong.", "người nói ngạc nhiên.", "người nói không quan tâm.", "người nói đồng ý một phần và sắp nêu phần “nhưng”."], correct: 3, why: "Fall-rise = dè dặt, còn ý chưa nói (Ngày 18)." },
        ],
      },

      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table",
        head: ["Phần", "Ngưỡng đạt", "Hụt thì ôn"],
        rows: [
          ["1. Ngữ pháp", "≥ 13/18", "câu 1–5, 1b 1–4: **Ngày 13** · câu 6–9: **Ngày 15** · câu 10–12, 1b 5–6: **Ngày 17**"],
          ["2. Từ vựng", "≥ 12/16", "câu 1–6, 2b 1: **Ngày 14** · câu 7–9, 2b 2–4: **Ngày 16** · câu 10, 2b 5–6: **Ngày 18**"],
          ["3. Dịch", "≥ 5/6", "câu n ⇒ Ngày 12 + n (câu 1 = Ngày 13 … câu 6 = Ngày 18)"],
          ["4. Nghe", "≥ 10/13", "Summary: **Ngày 13** · Part 3 đổi ý: **Ngày 17** (và Ngày 12) · sơ đồ hai tầng (câu 11–13): **Ngày 16**"],
          ["5. Đọc", "≥ 7/10", "nối đuôi câu: **Ngày 15** · flow-chart: **Ngày 17** · mức chắc chắn (YNNG): **Ngày 13**"],
          ["6. Viết", "6a ≥ 4/5 · AI ≥ 6.5", "outweigh: **Ngày 14** · bảng: **Ngày 16** · pie theo nhóm + văn phong: **Ngày 18**"],
          ["7. Nói", "AI ≥ 6.5", "Part 2 sự kiện: **Ngày 14** · chuỗi nhân quả: **Ngày 15** · ví dụ xã hội + paraphrase: **Ngày 18**"],
          ["8. Phát âm", "≥ 6/8", "câu 1–2: N13 · 3: N14 · 4: N15 · 5: N16 · 6–7: N17 · 8: N18"],
        ],
      },
      { t: "note", title: "Ghi nhớ trước khi sang Ngày 19", items: ["Đạt cả 8 phần ⇒ sang **Ngày 19** (mixed conditionals).", "Hụt 1–2 phần ⇒ ôn đúng mục được chỉ, làm lại **riêng phần đó** sau 2 ngày.", "Hụt từ 3 phần ⇒ dành một ngày ôn cả chặng theo bảng trên trước khi học tiếp. Ghi các lỗi lặp lại vào **sổ lỗi**."] },
    ],
  },
];
