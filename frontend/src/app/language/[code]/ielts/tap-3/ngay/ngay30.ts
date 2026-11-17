/**
 * IELTS Tập 3 — Ngày 30 (band 5.0 → 6.0) — NGÀY CUỐI TẬP. Mục lục: docs/ielts-lo-trinh-0-8.md mục 3.3.
 *   Bài 1 Từ vựng   — 30 idiom tự nhiên cho Speaking (5 nhóm × 6) + văn phong nói / viết
 *                     + ôn 30 bộ thẻ chủ đề Tập 1–3 [VD7]
 *   Bài 2 Viết      — Viết lại 2 bài cũ theo sổ lỗi (1 Task 2 + 1 Task 1): đếm mã, 6 lượt soát (N27), 3 phiên bản (N2);
 *                     hai cặp mẫu band 5 ↔ band 6 [W19]
 *   Bài 3 Nói       — Giám khảo AI 14 phút lần 2: mẫu band 5 ↔ 6 ba Part, bảng soát 12 điều, phiếu so lần 1 – lần 2 [S17]
 *                     + 🔊 nhịp và nối âm trong idiom
 *   Bài tập         — 36 câu + một lượt ghi âm Part 3.
 *   Kiểm tra chặng  — t3d30-kiem-tra (Ngày 25–30), 8 phần, ngưỡng ≥ 70 % từng phần.
 * Đề 5 (thi cuối Tập 3, band 6.0) nằm ở Online Test. Bài Nói hôm nay thi phần Speaking của Đề 5 (`noi-de5`, chế độ thi thật);
 * ba kỹ năng còn lại làm sau bài kiểm tra chặng.
 * Mọi bài đọc, kịch bản nghe, bài mẫu, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

/* ───────────────────────── Bài 1 — Từ vựng ───────────────────────── */
const D30_TU_VUNG: Lesson = {
  id: "t3d30-tu-vung",
  kind: "vocab",
  title: "Từ vựng: 30 idiom tự nhiên cho Speaking + ôn 30 bộ thẻ chủ đề của Tập 1 – 3",
  goal: "Dùng đúng lúc, đúng nguyên dạng 30 thành ngữ thông dụng trong Speaking (mỗi câu trả lời 1 cái là đủ), biết đổi chúng sang cách nói trang trọng khi viết; rồi ôn lại 30 bộ thẻ chủ đề đã học từ Tập 1 tới Tập 3 bằng một bảng “3 cụm mỗi chủ đề” và tự kiểm 40 câu (LR band 6).",
  minutes: 90,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Idiom** (thành ngữ) = cụm cố định mà nghĩa **không** suy ra được từ từng chữ: a piece of cake không phải “một miếng bánh” mà là “dễ ợt”.",
        "Band 6 – 7 Speaking (tiêu chí **LR**) cần “dám dùng từ ít gặp và thành ngữ, dù chưa hoàn hảo”. ==1 idiom đúng chỗ== trong một câu trả lời đáng giá hơn 5 idiom nhồi.",
        "Luật vàng: idiom dùng khi **NÓI**; trong Writing Task 1 / Task 2 thì **không** — hôm nay học luôn cách đổi sang cách nói trang trọng.",
        "30 idiom chia 5 nhóm × 6: cảm xúc · học và làm · tiền và thời gian · con người · bàn luận (Part 3).",
        "Nửa sau: ==ôn 30 bộ thẻ chủ đề== (Tập 1 → Tập 3) — mỗi chủ đề 3 cụm phải bật ra được trong 5 giây. Đây là lượt ôn từ vựng cuối trước **Đề 5**.",
      ],
    },

    /* ── 0 ── */
    { t: "h", text: "1. Dùng idiom thế nào cho ra band 6 — 5 luật" },
    {
      t: "table",
      caption: "Năm luật dùng idiom",
      head: ["Luật", "Sai", "Đúng"],
      rows: [
        ["**1. Chỉ khi nói**", "(Task 2) Housing in big cities costs an arm and a leg.", "(Task 2) Housing in big cities is **extremely expensive**. · (Part 1) Rent here **costs an arm and a leg**."],
        ["**2. Giữ nguyên từng chữ**", "~~a slice of cake~~ · ~~cost a hand and a leg~~ · ~~once in a blue month~~", "a **piece** of cake · cost an **arm** and a leg · once in a blue **moon**"],
        ["**3. Vẫn chia thì, đổi ngôi**", "~~She get on my nerves.~~ · ~~I am over the moon yesterday.~~ · ~~It gets on the nerves of me.~~", "She **gets** on **my** nerves. · I **was** over the moon. · It **took** me a while to get the hang of it."],
        ["**4. Mỗi câu trả lời 1 cái**", "I was over the moon and on cloud nine because the test was a piece of cake…", "The test turned out to be **a piece of cake**, so I was really pleased."],
        ["**5. Đặt sau một ý thường, rồi giải thích**", "Over the moon. (đứng một mình)", "I was **over the moon** — I'd been waiting for that result for months."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận: idiom “sách giáo khoa” nên tránh",
      items: [
        "~~It's raining cats and dogs.~~ — người bản xứ ngày nay hầu như không nói; giám khảo nghe là biết học thuộc. Nói: **It's pouring.** / **It's absolutely chucking it down.**",
        "~~Every coin has two sides.~~ — dịch từ tiếng Việt / tiếng Trung, không tự nhiên. Nói: **It's a double-edged sword.** / **There are two sides to this.**",
        "~~As busy as a bee · as easy as ABC · kill two birds with one stone~~ ở mọi câu — nghe trẻ con hoặc sáo. Dùng các cụm trong bài hôm nay: đời thường, người lớn nói hằng ngày.",
        "Không chắc 100 % từng chữ thì **đừng dùng** — nói ý đó bằng từ thường. Một idiom sai chữ (**LR**) lộ hơn một câu đơn giản.",
      ],
    },
    {
      t: "rule",
      formula: "Ý thường (1 câu) + idiom đúng nguyên dạng + because / — giải thích",
      vi: "Chỉ dùng khi nói, mỗi câu trả lời tối đa 1 idiom, luôn kèm một câu giải thích để giám khảo thấy bạn hiểu nghĩa.",
    },

    /* ── A ── */
    { t: "h", text: "2. Nhóm A — Cảm xúc và sức khoẻ (6 idiom)" },
    {
      t: "vocab",
      items: [
        { w: "over the moon", pos: "idiom", ipa: "/ˌəʊvə ðə ˈmuːn/", vi: "vui sướng tột độ", ex: "I was over the moon when I got the scholarship.", exVi: "Tôi sướng phát điên khi nhận được học bổng.", more: "be over the moon **about / with** sth · viết: be delighted, be extremely pleased" },
        { w: "under the weather", pos: "idiom", ipa: "/ˌʌndə ðə ˈweðə/", vi: "hơi mệt, không khoẻ (ốm nhẹ)", ex: "I was feeling a bit under the weather, so I stayed at home.", exVi: "Tôi thấy hơi mệt nên ở nhà.", more: "feel / be **a bit** under the weather · không dùng cho bệnh nặng" },
        { w: "get on someone's nerves", pos: "idiom", ipa: "/ɡet ɒn ˈsʌmwʌnz nɜːvz/", vi: "làm ai bực mình, khó chịu", ex: "The noise from the building site really gets on my nerves.", exVi: "Tiếng ồn từ công trường làm tôi rất bực.", more: "đổi ngôi: on **my / her / their** nerves · viết: irritate, annoy" },
        { w: "be fed up with", pos: "idiom", ipa: "/bi ˌfed ˈʌp wɪð/", vi: "chán ngấy, hết chịu nổi", ex: "A lot of commuters are fed up with the traffic jams.", exVi: "Nhiều người đi làm chán ngấy cảnh kẹt xe.", more: "fed up with + N / V-ing · viết: be dissatisfied with, be tired of" },
        { w: "feel at home", pos: "idiom", ipa: "/fiːl ət ˈhəʊm/", vi: "thấy thoải mái như ở nhà", ex: "My host family made me feel at home from the first day.", exVi: "Gia đình chủ nhà khiến tôi thấy thoải mái ngay từ ngày đầu.", more: "make sb feel at home (causative, Ngày 29) · viết: feel comfortable, settle in" },
        { w: "let off steam", pos: "idiom", ipa: "/let ɒf ˈstiːm/", vi: "xả stress, giải toả bức bối", ex: "I play football twice a week to let off steam.", exVi: "Tôi đá bóng hai buổi một tuần để xả stress.", more: "Mỹ: blow off steam · viết: relieve stress, release tension" },
      ],
    },

    /* ── B ── */
    { t: "h", text: "3. Nhóm B — Học và làm việc (6 idiom)" },
    {
      t: "vocab",
      items: [
        { w: "a piece of cake", pos: "idiom", ipa: "/ə ˌpiːs əv ˈkeɪk/", vi: "dễ ợt", ex: "I thought the driving test would be hard, but it was a piece of cake.", exVi: "Tôi tưởng thi bằng lái khó, hoá ra dễ ợt.", more: "be a piece of cake · viết: be straightforward, be very easy" },
        { w: "from scratch", pos: "idiom", ipa: "/frəm ˈskrætʃ/", vi: "từ con số không, từ đầu", ex: "I learned to code from scratch using free online courses.", exVi: "Tôi học lập trình từ con số không bằng các khoá miễn phí trên mạng.", more: "start / build / learn sth from scratch · viết: from the very beginning" },
        { w: "learn the ropes", pos: "idiom", ipa: "/lɜːn ðə ˈrəʊps/", vi: "học cho biết việc (khi mới vào nghề)", ex: "It took me about a month to learn the ropes in my new job.", exVi: "Tôi mất khoảng một tháng để quen việc ở chỗ làm mới.", more: "show sb the ropes = chỉ việc cho ai · viết: become familiar with the job" },
        { w: "burn the midnight oil", pos: "idiom", ipa: "/bɜːn ðə ˌmɪdnaɪt ˈɔɪl/", vi: "thức khuya học / làm", ex: "Before the final exams, most of my classmates burn the midnight oil.", exVi: "Trước kỳ thi cuối kỳ, hầu hết bạn cùng lớp tôi thức khuya học.", more: "viết: study / work late into the night" },
        { w: "get the hang of", pos: "idiom", ipa: "/ɡet ðə ˈhæŋ əv/", vi: "nắm được cách làm, bắt đầu quen tay", ex: "Cooking was hard at first, but I soon got the hang of it.", exVi: "Lúc đầu nấu ăn khó, nhưng tôi quen tay khá nhanh.", more: "get the hang of + N / V-ing · viết: master, become competent at" },
        { w: "call it a day", pos: "idiom", ipa: "/ˌkɔːl ɪt ə ˈdeɪ/", vi: "nghỉ thôi, dừng làm (cho hôm nay)", ex: "We had been revising for five hours, so we decided to call it a day.", exVi: "Chúng tôi đã ôn năm tiếng nên quyết định nghỉ.", more: "Let's call it a day. · viết: stop working, finish for the day" },
      ],
    },

    /* ── C ── */
    { t: "h", text: "4. Nhóm C — Tiền bạc và thời gian (6 idiom)" },
    {
      t: "vocab",
      items: [
        { w: "cost an arm and a leg", pos: "idiom", ipa: "/kɒst ən ˌɑːm ən ə ˈleɡ/", vi: "đắt cắt cổ", ex: "A flat in the city centre costs an arm and a leg these days.", exVi: "Dạo này một căn hộ ở trung tâm đắt cắt cổ.", more: "cost – cost – cost · viết: be extremely expensive, be unaffordable" },
        { w: "make ends meet", pos: "idiom", ipa: "/meɪk ˌendz ˈmiːt/", vi: "kiếm đủ sống, xoay đủ chi tiêu", ex: "Many students take part-time jobs just to make ends meet.", exVi: "Nhiều sinh viên đi làm thêm chỉ để đủ sống.", more: "struggle to make ends meet · viết: cover basic living costs" },
        { w: "once in a blue moon", pos: "idiom", ipa: "/wʌns ɪn ə ˌbluː ˈmuːn/", vi: "năm thì mười hoạ, rất hiếm khi", ex: "I only eat fast food once in a blue moon.", exVi: "Năm thì mười hoạ tôi mới ăn đồ ăn nhanh.", more: "trả lời “How often…?” ở Part 1 · viết: very rarely, on rare occasions" },
        { w: "in the nick of time", pos: "idiom", ipa: "/ɪn ðə ˌnɪk əv ˈtaɪm/", vi: "vừa kịp lúc, sát nút", ex: "We got to the station in the nick of time — the train left a minute later.", exVi: "Chúng tôi tới ga vừa kịp — một phút sau tàu chạy.", more: "hợp kể chuyện Part 2 · viết: just in time" },
        { w: "lose track of time", pos: "idiom", ipa: "/luːz ˌtræk əv ˈtaɪm/", vi: "mải mê quên cả giờ giấc", ex: "When I'm reading a good novel, I completely lose track of time.", exVi: "Khi đọc một cuốn tiểu thuyết hay, tôi quên hết giờ giấc.", more: "lose – lost – lost · keep track of = theo dõi" },
        { w: "around the clock", pos: "idiom", ipa: "/əˌraʊnd ðə ˈklɒk/", vi: "suốt ngày đêm, 24/24", ex: "Doctors were working around the clock during the outbreak.", exVi: "Bác sĩ làm việc suốt ngày đêm trong đợt dịch.", more: "= round the clock · viết: 24 hours a day, continuously" },
      ],
    },

    /* ── D ── */
    { t: "h", text: "5. Nhóm D — Con người và quan hệ (6 idiom)" },
    {
      t: "vocab",
      items: [
        { w: "keep in touch", pos: "idiom", ipa: "/kiːp ɪn ˈtʌtʃ/", vi: "giữ liên lạc", ex: "Social media helps me keep in touch with friends who live abroad.", exVi: "Mạng xã hội giúp tôi giữ liên lạc với bạn bè sống ở nước ngoài.", more: "keep / stay in touch **with** sb ≠ lose touch with (Ngày 18) · viết: maintain contact" },
        { w: "see eye to eye", pos: "idiom", ipa: "/siː ˌaɪ tə ˈaɪ/", vi: "đồng quan điểm, hợp ý nhau", ex: "My father and I don't always see eye to eye on my career plans.", exVi: "Bố tôi và tôi không phải lúc nào cũng đồng ý với nhau về kế hoạch nghề nghiệp của tôi.", more: "thường dùng ở **phủ định**: don't see eye to eye **on** sth / **with** sb · viết: agree" },
        { w: "break the ice", pos: "idiom", ipa: "/breɪk ði ˈaɪs/", vi: "phá tan không khí ngượng ngùng lúc mới gặp", ex: "The teacher started with a game to break the ice.", exVi: "Giáo viên mở đầu bằng một trò chơi để phá băng.", more: "an ice-breaker (n) · viết: help people feel relaxed" },
        { w: "give someone a hand", pos: "idiom", ipa: "/ɡɪv ˌsʌmwʌn ə ˈhænd/", vi: "giúp ai một tay", ex: "My neighbours always give us a hand when we need it.", exVi: "Hàng xóm luôn giúp chúng tôi một tay khi cần.", more: "give sb a hand **with** sth · Could you give me a hand? · viết: help, assist" },
        { w: "run in the family", pos: "idiom", ipa: "/rʌn ɪn ðə ˈfæməli/", vi: "di truyền trong nhà, cả nhà đều có", ex: "Musical talent seems to run in the family — my mother and my sister both play the piano.", exVi: "Năng khiếu âm nhạc hình như là di truyền — mẹ và chị tôi đều chơi piano.", more: "chủ ngữ là tài năng / bệnh / tính cách · viết: be inherited" },
        { w: "a couch potato", pos: "idiom", ipa: "/ə ˈkaʊtʃ pəˌteɪtəʊ/", vi: "người lười vận động, suốt ngày nằm xem TV", ex: "I used to be a couch potato, but now I go jogging every morning.", exVi: "Trước đây tôi lười vận động, giờ sáng nào cũng chạy bộ.", more: "số nhiều: couch potatoes · viết: an inactive person, lead a sedentary lifestyle" },
      ],
    },

    /* ── E ── */
    { t: "h", text: "6. Nhóm E — Bàn luận ở Part 3 (6 idiom)" },
    {
      t: "vocab",
      items: [
        { w: "a double-edged sword", pos: "idiom", ipa: "/ə ˌdʌbl edʒd ˈsɔːd/", vi: "con dao hai lưỡi", ex: "Tourism is a double-edged sword: it creates jobs but damages the environment.", exVi: "Du lịch là con dao hai lưỡi: tạo việc làm nhưng hại môi trường.", more: "mở câu trả lời ưu – nhược · viết: have both benefits and drawbacks" },
        { w: "the tip of the iceberg", pos: "idiom", ipa: "/ðə ˌtɪp əv ði ˈaɪsbɜːɡ/", vi: "phần nổi của tảng băng chìm", ex: "The plastic we see on beaches is just the tip of the iceberg.", exVi: "Rác nhựa ta thấy trên bãi biển mới chỉ là phần nổi của tảng băng.", more: "**just / only** the tip of the iceberg · viết: only a small part of a much larger problem" },
        { w: "a drop in the ocean", pos: "idiom", ipa: "/ə ˌdrɒp ɪn ði ˈəʊʃn/", vi: "muối bỏ bể", ex: "Recycling at home is a drop in the ocean compared with what factories produce.", exVi: "Tái chế ở nhà chỉ như muối bỏ bể so với lượng nhà máy thải ra.", more: "Mỹ: a drop in the bucket · viết: a very small amount compared with what is needed" },
        { w: "a blessing in disguise", pos: "idiom", ipa: "/ə ˌblesɪŋ ɪn dɪsˈɡaɪz/", vi: "trong cái rủi có cái may", ex: "Losing that job was a blessing in disguise, because it pushed me to go back to university.", exVi: "Mất việc đó hoá ra lại may, vì nó thúc tôi quay lại học đại học.", more: "hợp đề Part 2 “a difficult time” · viết: an apparent misfortune that has good results" },
        { w: "the best of both worlds", pos: "idiom", ipa: "/ðə ˌbest əv bəʊθ ˈwɜːldz/", vi: "được cả đôi đường", ex: "Working from home three days a week gives me the best of both worlds.", exVi: "Làm ở nhà ba ngày một tuần giúp tôi được cả đôi đường.", more: "have / get / enjoy the best of both worlds · viết: combine the advantages of both" },
        { w: "at the end of the day", pos: "idiom", ipa: "/ət ði ˌend əv ðə ˈdeɪ/", vi: "suy cho cùng, rốt cuộc", ex: "At the end of the day, parents are responsible for their children's behaviour.", exVi: "Suy cho cùng, cha mẹ chịu trách nhiệm về hành vi của con.", more: "mở câu chốt của câu trả lời Part 3 · viết: ultimately" },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Nói thì idiom — viết thì trang trọng (register)" },
    {
      t: "p",
      text: "**Register** = mức độ trang trọng của ngôn ngữ. Speaking là hội thoại nên idiom hợp; Writing là văn học thuật nên idiom làm tụt **LR** (“từ không hợp văn phong”). Cùng một ý, bạn phải có **hai** cách nói. Bảng dưới là 10 cặp hay cần nhất.",
    },
    {
      t: "table",
      caption: "Một ý — hai văn phong",
      head: ["Khi nói (Part 1 – 3)", "Khi viết (Task 2)"],
      rows: [
        ["Rent **costs an arm and a leg**.", "Rents are **extremely high / unaffordable** for many young people."],
        ["Lots of families **struggle to make ends meet**.", "Many families **struggle to cover basic living costs**."],
        ["Tourism is **a double-edged sword**.", "Tourism **has both benefits and drawbacks**."],
        ["That's just **the tip of the iceberg**.", "This is **only a small part of a much wider problem**."],
        ["It's **a drop in the ocean**.", "This amount is **insignificant compared with what is needed**."],
        ["**At the end of the day**, it's up to parents.", "**Ultimately**, the responsibility lies with parents."],
        ["People are **fed up with** traffic jams.", "Residents are **increasingly dissatisfied with** congestion."],
        ["It gives you **the best of both worlds**.", "It **combines the advantages of both** approaches."],
        ["They work **around the clock**.", "They work **24 hours a day / continuously**."],
        ["It was **a piece of cake**.", "The task was **straightforward**."],
      ],
    },
    {
      t: "dialogue",
      title: "Mẫu Speaking — mỗi câu trả lời đúng MỘT idiom",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you often eat out?", vi: "Bạn có hay ăn ngoài không?" },
        { who: "Candidate", role: "candidate", text: "Not really. Eating out in my city costs an arm and a leg, so I usually cook at home. I only go to a proper restaurant on special occasions, like a birthday.", vi: "Không hẳn. Ăn ngoài ở thành phố tôi đắt cắt cổ nên tôi thường nấu ở nhà. Chỉ dịp đặc biệt như sinh nhật tôi mới đi nhà hàng tử tế." },
        { who: "Examiner", role: "examiner", text: "Was it difficult to learn to cook?", vi: "Học nấu ăn có khó không?" },
        { who: "Candidate", role: "candidate", text: "At first, yes — I had to learn from scratch, because I'd never even boiled an egg. But after a few weeks I got more confident, and now I actually enjoy it.", vi: "Lúc đầu thì có — tôi phải học từ con số không vì trước đó còn chưa luộc nổi quả trứng. Nhưng sau vài tuần tôi tự tin hơn, và giờ tôi thực sự thích." },
        { who: "Examiner", role: "examiner", text: "Do you think working from home is a good thing for society?", vi: "Bạn nghĩ làm việc tại nhà có tốt cho xã hội không?" },
        { who: "Candidate", role: "candidate", text: "I'd say it's a double-edged sword. On the one hand, people save hours of commuting; on the other hand, they can feel quite isolated. So a mix of home and office is probably the ideal solution.", vi: "Tôi cho đó là con dao hai lưỡi. Một mặt người ta tiết kiệm hàng giờ đi lại; mặt khác họ có thể thấy khá cô lập. Nên kết hợp cả nhà lẫn văn phòng có lẽ là lý tưởng." },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Luyện 30 idiom" },
    {
      t: "mcq",
      id: "t3d30-idiom-nghia",
      title: "8a. Chọn idiom đúng với tình huống (12 câu)",
      items: [
        { q: "You passed the exam you had worried about for months. You are…", options: ["under the weather", "over the moon", "fed up", "a couch potato"], correct: 1, why: "**over the moon** = vui sướng tột độ." },
        { q: "You have a slight cold and don't feel like going out. You are feeling…", options: ["at home", "over the moon", "under the weather", "in the nick of time"], correct: 2, why: "**under the weather** = hơi mệt, ốm nhẹ." },
        { q: "The new phone is far too expensive. It…", options: ["costs an arm and a leg", "makes ends meet", "is a piece of cake", "runs in the family"], correct: 0, why: "**cost an arm and a leg** = đắt cắt cổ." },
        { q: "You visit your grandparents' village about once every three years. You go there…", options: ["around the clock", "from scratch", "in the nick of time", "once in a blue moon"], correct: 3, why: "**once in a blue moon** = rất hiếm khi." },
        { q: "Your salary is just enough for rent and food. You can only just…", options: ["call it a day", "make ends meet", "break the ice", "let off steam"], correct: 1, why: "**make ends meet** = đủ sống." },
        { q: "It's your first week in a new job and a colleague is showing you how things work. You are…", options: ["learning the ropes", "burning the midnight oil", "losing track of time", "seeing eye to eye"], correct: 0, why: "**learn the ropes** = học cho quen việc." },
        { q: "You and your sister disagree about almost everything. You don't…", options: ["keep in touch", "feel at home", "see eye to eye", "get the hang of it"], correct: 2, why: "**(not) see eye to eye** = không đồng quan điểm." },
        { q: "A government gives $1 million to solve a problem that needs $10 billion. The money is…", options: ["the best of both worlds", "a blessing in disguise", "the tip of the iceberg", "a drop in the ocean"], correct: 3, why: "**a drop in the ocean** = muối bỏ bể (quá ít so với cần). The tip of the iceberg = phần **thấy được** của một vấn đề lớn." },
        { q: "Reported cases of online fraud are only a small visible part of the real problem. They are…", options: ["a double-edged sword", "the tip of the iceberg", "a piece of cake", "a drop in the ocean"], correct: 1, why: "**the tip of the iceberg** = phần nổi của tảng băng." },
        { q: "You missed a flight, and because of that you met your future business partner. Missing it was…", options: ["a blessing in disguise", "a couch potato", "around the clock", "from scratch"], correct: 0, why: "**a blessing in disguise** = trong rủi có may." },
        { q: "Living in a small town near a big city: quiet life, city jobs. You get…", options: ["the tip of the iceberg", "a drop in the ocean", "the best of both worlds", "under the weather"], correct: 2, why: "**the best of both worlds** = được cả đôi đường." },
        { q: "You have worked for ten hours and decide to stop. You say: “Let's…”", options: ["break the ice", "burn the midnight oil", "give a hand", "call it a day"], correct: 3, why: "**call it a day** = nghỉ thôi." },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-idiom-dien",
      title: "8b. Điền MỘT từ còn thiếu của idiom (10 câu)",
      kind: "fill",
      items: [
        { q: "I'd never played the guitar, so I had to start from ___.", answers: ["scratch"], hint: "từ con số không" },
        { q: "Driving in a foreign country was strange, but I soon got the ___ of it.", answers: ["hang"], hint: "quen tay" },
        { q: "The loud music from next door really gets on my ___.", answers: ["nerves"], hint: "làm bực mình" },
        { q: "I was so absorbed in the game that I lost ___ of time.", answers: ["track"], hint: "quên giờ giấc" },
        { q: "We caught the last bus in the ___ of time.", answers: ["nick"], hint: "vừa kịp" },
        { q: "The teacher told a joke to break the ___.", answers: ["ice"], hint: "phá không khí ngượng" },
        { q: "Could you give me a ___ with these boxes?", answers: ["hand"], hint: "giúp một tay" },
        { q: "Everyone in my family is tall — it runs in the ___.", answers: ["family"], hint: "di truyền" },
        { q: "At the ___ of the day, health is more important than money.", answers: ["end"], hint: "suy cho cùng" },
        { q: "Social media is a double-edged ___: it connects people but wastes their time.", answers: ["sword"], hint: "con dao hai lưỡi" },
      ],
    },
    {
      t: "mcq",
      id: "t3d30-idiom-register",
      title: "8c. Nói hay viết? — chọn câu ĐÚNG văn phong (6 câu)",
      items: [
        { q: "Câu nào hợp cho **Writing Task 2**?", options: ["University fees cost an arm and a leg.", "University fees are a real pain in the neck.", "University fees are unaffordable for many families.", "University fees are, like, crazy expensive."], correct: 2, why: "Task 2 cần văn phong trang trọng: **unaffordable for many families**. Ba câu còn lại là văn nói." },
        { q: "Câu nào hợp cho **Speaking Part 1** (How often do you go to the cinema?)", options: ["Once in a blue moon, to be honest — tickets are quite pricey.", "The frequency of my cinema attendance is extremely low.", "Cinema attendance has declined significantly.", "I attend cinematic screenings on rare occasions."], correct: 0, why: "Part 1 là trò chuyện: idiom + “to be honest” tự nhiên. Ba câu kia nghe như bài viết." },
        { q: "Câu nào dùng idiom **đúng nguyên dạng**?", options: ["The test was a slice of cake.", "The test was a piece of cake.", "The test was a piece of the cake.", "The test was piece of cakes."], correct: 1, why: "Cố định: **a piece of cake**." },
        { q: "Câu nào chia idiom **đúng ngữ pháp**?", options: ["My brother get on my nerves.", "My brother gets on nerves.", "My brother is getting on the nerve.", "My brother gets on my nerves."], correct: 3, why: "Chia động từ (gets) + đổi sở hữu (my) + nerves số nhiều." },
        { q: "Trong Task 2, thay “This is just the tip of the iceberg” bằng:", options: ["This is only a small part of a much wider problem.", "This is a drop in the ocean.", "This is a piece of cake.", "This is the iceberg's top."], correct: 0, why: "Diễn đạt trang trọng cùng nghĩa. B là idiom khác nghĩa (quá ít so với cần)." },
        { q: "Một câu trả lời Part 3 dài 4 câu nên có bao nhiêu idiom?", options: ["Càng nhiều càng tốt", "Ít nhất 3", "0 hoặc 1 — đúng chỗ, có giải thích", "Mỗi câu 1 cái"], correct: 2, why: "Nhồi idiom nghe học thuộc; band 6 – 7 chỉ cần **thỉnh thoảng** dùng đúng." },
      ],
    },
    {
      t: "speak",
      id: "t3d30-idiom-noi",
      part: "1",
      questions: [
        "How often do you eat out? (try: once in a blue moon / cost an arm and a leg)",
        "What do you do to relax after studying? (try: let off steam / lose track of time)",
        "Was it easy to learn to use a computer? (try: from scratch / get the hang of it / a piece of cake)",
        "How do you keep in contact with your old friends? (try: keep in touch)",
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Ôn 30 bộ thẻ chủ đề — Tập 1 → Tập 3" },
    {
      t: "p",
      text: "Từ Tập 1 tới hôm nay bạn đã học **28 chủ đề IELTS** + 2 bộ kỹ năng (AWL và cụm động từ) = **30 bộ thẻ**. Trước Đề 5, không ôn lại từng từ — chỉ kiểm **3 cụm đại diện** mỗi chủ đề. Cách làm: che cột “3 cụm phải bật ra”, nhìn tên chủ đề, **nói to 3 cụm + 1 câu** trong 10 giây. Không nói được ⇒ đánh dấu, tối nay mở đúng bộ đó trong **Flashcards** (bộ “Từ của khoá — Tập 1 / 2 / 3”) hoặc mục **Tra cứu từ vựng**, lọc theo ngày.",
    },
    {
      t: "table",
      caption: "Bộ 1 – 10",
      head: ["#", "Chủ đề", "Học ở", "3 cụm phải bật ra"],
      rows: [
        ["1", "Social media & communication", "T1 N1 · T3 N18", "go viral · echo chamber · face-to-face interaction"],
        ["2", "Education & society", "T1 N3 · T3 N2", "curriculum · rote learning · broaden one's horizons"],
        ["3", "Work & careers", "T1 N5, N7 · T3 N14", "job security · work–life balance · minimum wage"],
        ["4", "Volunteering & community", "T1 N9", "do voluntary work · raise money for charity · a sense of community"],
        ["5", "Charts & trends (Task 1)", "T1 N11 · T2 N10 · T3 N11", "rise sharply · level off · twice as high as"],
        ["6", "Online vs traditional learning", "T1 N13 · T3 N2", "distance learning · face-to-face lessons · self-discipline"],
        ["7", "Maps & processes (Task 1)", "T1 N15 · T2 N20 · N22 · T3 N28", "be replaced by · in the next stage · be converted into"],
        ["8", "Environment, climate & pollution", "T2 N2", "carbon emissions · renewable energy · tackle climate change"],
        ["9", "Health, diet & fitness", "T2 N4", "a balanced diet · a sedentary lifestyle · take regular exercise"],
        ["10", "Technology & innovation", "T2 N6", "artificial intelligence · keep up with · labour-saving devices"],
      ],
    },
    {
      t: "table",
      caption: "Bộ 11 – 20",
      head: ["#", "Chủ đề", "Học ở", "3 cụm phải bật ra"],
      rows: [
        ["11", "Transport & urban life", "T2 N8 · T3 N20", "traffic congestion · commute · congestion charge"],
        ["12", "Food & agriculture", "T2 N12", "processed food · food safety · locally grown produce"],
        ["13", "Travel, tourism & culture", "T2 N14 · T3 N26", "mass tourism · heritage site · language barrier"],
        ["14", "Money, shopping & consumerism", "T2 N16", "consumer society · impulse buying · value for money"],
        ["15", "Media, news & advertising", "T2 N18", "target audience · fake news · be exposed to advertising"],
        ["16", "Sport, leisure & entertainment", "T2 N20", "keep fit · team spirit · take up a hobby"],
        ["17", "Family & generations", "T2 N22", "generation gap · extended family · bring up children"],
        ["18", "Housing, architecture & cities", "T2 N24 · T3 N8", "affordable housing · urban sprawl · high-rise"],
        ["19", "Crime, law & punishment", "T3 N4", "deterrent · rehabilitation · reoffend"],
        ["20", "Government & public spending", "T3 N6", "public spending · allocate a budget to · taxpayers' money"],
      ],
    },
    {
      t: "table",
      caption: "Bộ 21 – 30",
      head: ["#", "Chủ đề", "Học ở", "3 cụm phải bật ra"],
      rows: [
        ["21", "Science, research & space", "T3 N10", "make a breakthrough · conduct research into · space exploration"],
        ["22", "History, archaeology & heritage", "T3 N12", "preserve cultural heritage · artefact · date back to"],
        ["23", "Business, economy & globalisation", "T3 N16", "multinational · economic growth · cost of living"],
        ["24", "Personality & relationships", "T3 N18", "conscientious · fall out with · a sense of belonging"],
        ["25", "Animals, nature & biodiversity", "T3 N22", "endangered species · natural habitat · become extinct"],
        ["26", "Energy & resources", "T3 N24", "fossil fuels · solar power · run out of"],
        ["27", "Language, culture & identity", "T3 N28", "mother tongue · bilingual · minority language"],
        ["28", "Books, reading & literature", "T3 N28", "fiction and non-fiction · e-book · read between the lines"],
        ["29", "AWL sublist 1 – 6 (360 họ từ)", "T2 N2 · 4 · 10 · 14 · T3 N2 · 8 · 14 · 20", "demonstrate · subsequent · facilitate"],
        ["30", "150 cụm động từ + collocation Task 2", "T3 N14 · N18", "bring about · stem from · play a vital role in"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Lịch ôn 30 bộ thẻ trong 3 buổi trước Đề 5",
      caption: "Mỗi buổi 25 phút. Chỉ mở Flashcards cho bộ bị đánh dấu.",
      steps: [
        { label: "**Buổi 1 — bộ 1 – 10**", sub: "Che cột 3 cụm, nói to. Đánh dấu bộ không bật ra được." },
        { label: "**Buổi 2 — bộ 11 – 20**", sub: "Làm như buổi 1 + ôn lại bộ đã đánh dấu hôm trước." },
        { label: "**Buổi 3 — bộ 21 – 30**", sub: "Xong thì làm bài 9a – 9b bên dưới." },
        { label: "**Trước Đề 5**", sub: "Chỉ lật thẻ của ≤ 5 bộ yếu nhất, chế độ Việt → Anh." },
      ],
    },
    {
      t: "note",
      title: "💡 Mẹo ôn theo chủ đề cho cả Viết và Nói",
      items: [
        "Mỗi chủ đề tự hỏi **một câu Part 3** và **một đề Task 2** — rồi nói 3 câu có đủ 3 cụm. Ví dụ bộ 19: “Should prison be the main punishment?” → deterrent · rehabilitation · reoffend.",
        "Bộ nào bạn **nhận ra** nghĩa nhưng không **tự nói** ra được ⇒ lật thẻ chiều **Việt → Anh**, không lật Anh → Việt.",
        "Từ gặp lại trong Reading / Listening của Đề 5 mà quên ⇒ ghi vào sổ lỗi kèm số bộ (#1 – #30).",
      ],
    },
    {
      t: "mcq",
      id: "t3d30-on-chu-de-chon",
      title: "9a. Ôn 30 chủ đề — chọn từ đúng (14 câu)",
      items: [
        { q: "(Crime) Long prison sentences are meant to act as a ___ to other criminals.", options: ["deterrent", "determination", "detention", "detergent"], correct: 0, why: "**a deterrent** = thứ răn đe (Ngày 4)." },
        { q: "(Government) The council decided to ___ a larger budget to public transport.", options: ["locate", "allocate", "allow", "collect"], correct: 1, why: "**allocate a budget to** (Ngày 6)." },
        { q: "(Education) ___ learning means memorising facts without really understanding them.", options: ["Distance", "Critical", "Rote", "Vocational"], correct: 2, why: "**rote learning** = học vẹt (Ngày 2)." },
        { q: "(Housing) Cities are spreading into the countryside — a process known as urban ___.", options: ["spread", "spring", "sprout", "sprawl"], correct: 3, why: "**urban sprawl** (Ngày 8)." },
        { q: "(Science) The team made a major ___ in cancer research.", options: ["breakdown", "breakthrough", "outbreak", "break-in"], correct: 1, why: "**make a breakthrough** = đột phá (Ngày 10)." },
        { q: "(History) The temple ___ back to the eleventh century.", options: ["dates", "goes", "turns", "takes"], correct: 0, why: "**date back to** (Ngày 12)." },
        { q: "(Work) Many young workers value job ___ more than a high salary.", options: ["safety", "secure", "security", "safe"], correct: 2, why: "**job security** = sự ổn định việc làm (Ngày 14)." },
        { q: "(Business) Salaries have not kept up with the rising cost of ___.", options: ["life", "alive", "lives", "living"], correct: 3, why: "**the cost of living** (Ngày 16)." },
        { q: "(Relationships) She ___ out with her best friend over money and they stopped talking.", options: ["fell", "broke", "went", "ran"], correct: 0, why: "**fall out with** = cãi nhau, giận nhau (Ngày 18)." },
        { q: "(Transport) Drivers must pay a congestion ___ to enter the city centre.", options: ["fare", "charge", "fine", "wage"], correct: 1, why: "**congestion charge** (Ngày 20). fare = tiền vé; fine = tiền phạt." },
        { q: "(Animals) Destroying forests removes the natural ___ of many species.", options: ["habit", "inhabitant", "habitat", "heritage"], correct: 2, why: "**natural habitat** = môi trường sống tự nhiên (Ngày 22)." },
        { q: "(Energy) Coal, oil and gas are known as ___ fuels.", options: ["fossil", "solar", "fuel", "renewable"], correct: 0, why: "**fossil fuels** = nhiên liệu hoá thạch (Ngày 24)." },
        { q: "(Language) A child who grows up speaking two languages is ___.", options: ["literate", "fluent", "native", "bilingual"], correct: 3, why: "**bilingual** = song ngữ (Ngày 28)." },
        { q: "(AWL) The new law will ___ trade between the two countries. (= make easier)", options: ["fluctuate", "facilitate", "fabricate", "fascinate"], correct: 1, why: "**facilitate** = tạo thuận lợi (AWL 5, Ngày 14)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-on-chu-de-dien",
      title: "9b. Ôn 30 chủ đề — điền MỘT từ để hoàn thành cụm (10 câu)",
      kind: "fill",
      items: [
        { q: "(Social media) The video went ___ and was watched by ten million people.", answers: ["viral"], hint: "bộ 1" },
        { q: "(Education) Travelling abroad can broaden your ___.", answers: ["horizons"], hint: "bộ 2" },
        { q: "(Work) It is hard to achieve a good work–life ___.", answers: ["balance"], hint: "bộ 3" },
        { q: "(Environment) Wind and solar power are forms of ___ energy.", answers: ["renewable"], hint: "bộ 8" },
        { q: "(Health) Office workers often have a ___ lifestyle and need more exercise.", answers: ["sedentary"], hint: "bộ 9" },
        { q: "(Family) The generation ___ between teenagers and their parents can cause conflict.", answers: ["gap"], hint: "bộ 17" },
        { q: "(Crime) Education in prison reduces the chance that offenders will ___ after release.", answers: ["reoffend"], hint: "bộ 19" },
        { q: "(Government) Critics say the project is a waste of taxpayers' ___.", answers: ["money"], hint: "bộ 20" },
        { q: "(Phrasal verbs) Many health problems stem ___ a poor diet.", answers: ["from"], hint: "bộ 30" },
        { q: "(Collocation) Teachers play a vital ___ in shaping children's attitudes.", answers: ["role", "part"], hint: "bộ 30" },
      ],
    },
    {
      t: "table",
      caption: "Tự chấm bài từ vựng hôm nay (52 câu máy chấm: 8a – 8c · 9a – 9b)",
      head: ["Điểm", "Nghĩa là", "Việc cần làm"],
      rows: [
        ["**≥ 44**", "Vốn từ Tập 3 đã chắc", "Chỉ ôn ≤ 5 bộ đã đánh dấu."],
        ["**36 – 43**", "Đạt", "Phần 9 sai câu nào thì mở đúng Ngày ghi trong lời giải."],
        ["**≤ 35**", "Chưa đạt", "Thêm 3 buổi Flashcards theo lịch ở sơ đồ trên rồi làm lại 9a – 9b."],
      ],
    },
  ],
};
/* ───────────────────────── Bài 2 — Viết ───────────────────────── */
const D30_VIET: Lesson = {
  id: "t3d30-viet",
  kind: "writing",
  title: "Viết: Viết lại 2 bài cũ theo sổ lỗi — một Task 2 và một Task 1, từ band 5 lên band 6",
  goal: "Đếm sổ lỗi của 29 ngày để biết hai mã lỗi nặng nhất của mình, rồi viết lại (rewrite) hai bài cũ — một Task 2 và một Task 1 — theo quy trình 3 phiên bản: sửa câu theo mã, sửa ý theo đề, nộp AI chấm và so band trước – sau; nhìn một bài band 5 và nói được vì sao bản viết lại đạt band 6 theo TR/TA · CC · LR · GRA.",
  minutes: 110,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "**Rewrite** = lấy một bài bạn **đã viết**, sửa có hệ thống rồi viết lại trọn bài. Một bài viết lại đúng cách dạy bạn nhiều hơn ba bài mới viết vội — vì lỗi cũ không lặp lại.",
        "Nối **Ngày 2** (bảng tự chấm 12 câu · 8 mã lỗi A S T P W L C I · viết lại qua 3 phiên bản) và **Tập 2 Ngày 24** (12 lỗi mất điểm oan). Hôm nay bạn làm **trọn bài**, không chỉ một đoạn.",
        "Hôm nay viết lại ==2 bài==: **1 Task 2 + 1 Task 1** có band AI thấp nhất (hoặc nhiều lỗi nhất) trong Tập 3.",
        "Bài học có hai cặp mẫu **band 5 → band 6** đặt cạnh nhau (Task 2: giao thông công cộng; Task 1: biểu đồ cột) kèm bảng chú thích từng chỗ sửa.",
        "Đích: bản viết lại ==cao hơn bản gốc ≥ 0.5 band== ở ít nhất 2 tiêu chí, và số lỗi của hai mã nặng nhất **giảm một nửa**.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Vì sao viết lại — và viết lại KHÁC chép lại ở đâu" },
    {
      t: "sodo",
      kind: "compare",
      title: "Ba cách dùng một bài viết cũ",
      caption: "Chỉ cột thứ ba làm band tăng.",
      cols: [
        { title: "Cất đi, viết bài mới", items: ["Lỗi cũ lặp lại nguyên xi", "Mỗi bài mất 40 phút", "Band đứng yên nhiều tuần"] },
        { title: "Chép lại + sửa chính tả", items: ["Chỉ sạch lỗi nhỏ", "Ý vẫn nông, dàn ý vẫn cũ", "Lên tối đa ~0.5 ở GRA"] },
        { title: "Viết lại theo sổ lỗi", items: ["Sửa câu theo **mã**", "Sửa ý theo **đề**", "Viết mới từ dàn ý đã sửa", "So band trước – sau"] },
      ],
    },
    {
      t: "p",
      text: "Ở band 5, bài viết mất điểm vì **hai nhóm** nguyên nhân: nhóm **câu** (mạo từ, số nhiều, thì, giới từ, từ, từ nối, câu cụt — mã A S T P W L C) và nhóm **ý** (không trả lời đủ vế đề, ý không được giải thích, ví dụ chung chung, lập trường không rõ — mã I). Ngày 2 đã cho thấy: sửa hết nhóm câu chỉ đưa bài lên ~5.5; muốn lên 6 phải sửa cả nhóm ý. Viết lại là lúc bạn làm **cả hai**, có thứ tự.",
    },

    /* ── 2 ── */
    { t: "h", text: "2. Bước 0 — đếm sổ lỗi, chọn 2 bài" },
    {
      t: "table",
      caption: "Bảng đếm mã lỗi — điền số của bạn (ví dụ một học viên sau 29 ngày)",
      head: ["Mã", "Loại lỗi", "Số lần (ví dụ)", "Ôn ở đâu"],
      rows: [
        ["**A**", "Mạo từ", "**23** ← nặng nhất", "Tập 3 N3"],
        ["**S**", "Số ít – số nhiều, chủ – vị", "**17** ← nặng nhì", "Tập 2 N23 · Tập 3 N25 (động từ theo danh từ chính)"],
        ["**T**", "Thì", "6", "Tập 3 N1 · N5"],
        ["**P**", "Giới từ", "9", "Tập 3 N9"],
        ["**W**", "Từ sai, dạng từ, collocation", "11", "Các bài từ vựng ngày chẵn · N28 (từ dễ nhầm)"],
        ["**L**", "Từ nối thừa / sai vai", "8", "Tập 3 N21"],
        ["**C**", "Câu cụt, câu lê thê, dấu câu", "7", "Tập 3 N27"],
        ["**I**", "Ý: thiếu vế đề, thiếu giải thích / ví dụ, lập trường mờ", "12", "Tập 3 N2 · N6 · N10 · N14 · N18 · N22"],
      ],
    },
    {
      t: "note",
      title: "📌 Cách chọn 2 bài để viết lại",
      items: [
        "Mở lại các bài Viết của Tập 3 đã nộp AI chấm. Chọn **1 bài Task 2** và **1 bài Task 1** có band thấp nhất — hoặc bài bạn thấy “ngượng” nhất khi đọc lại.",
        "Ưu tiên bài viết **cách đây ≥ 2 tuần**: bạn đã quên câu chữ cũ nên nhìn ra lỗi dễ hơn.",
        "Chưa có sổ lỗi? Dùng luôn **phản hồi của AI** ở bài đó: mỗi lỗi AI nêu, gắn một mã, đếm.",
        "Hai mã có số lần cao nhất = ==hai mã mục tiêu==. Hôm nay khi soát, bạn săn **đúng hai mã đó** trước.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Quy trình viết lại một bài — 45 phút" },
    {
      t: "sodo",
      kind: "flow",
      title: "Viết lại theo sổ lỗi",
      caption: "Bản 1 = bài gốc · Bản 2 = sửa câu · Bản 3 = sửa ý rồi viết lại trọn bài.",
      steps: [
        { label: "**Đọc lại ĐỀ (2')**", sub: "Đếm vế đề (Ngày 6). Bài gốc trả lời đủ chưa?" },
        { label: "**Tự chấm 12 câu (5')**", sub: "Bảng Ngày 2: đoán band từng tiêu chí, ghi ra giấy." },
        { label: "**Gạch lỗi theo mã (8')**", sub: "Hai mã mục tiêu trước, mỗi lượt đọc chỉ săn MỘT mã." },
        { label: "**Sửa dàn ý (5')**", sub: "Mỗi thân bài: 1 ý chính + vì sao + ví dụ cụ thể + câu chốt." },
        { label: "**Viết lại trọn bài (20')**", sub: "Viết từ dàn ý mới, không chép câu cũ." },
        { label: "**Nộp AI + so band (5')**", sub: "Ghi band trước – sau và số lỗi từng mã vào sổ." },
      ],
    },
    {
      t: "table",
      caption: "Bước “gạch lỗi” dùng bảng tự soát 6 lượt của Ngày 27 — mỗi lượt bắt mã nào",
      head: ["Lượt (Ngày 27)", "Mắt chỉ nhìn", "Bắt mã"],
      rows: [
        ["1 · Động từ", "Mọi động từ chia thì", "**T** · **S** (chủ – vị)"],
        ["2 · Danh từ", "Mọi danh từ", "**A** · **S** (số nhiều)"],
        ["3 · Ranh giới câu", "Mọi dấu phẩy, dấu chấm", "**C**"],
        ["4 · Song song + từ loại", "and / or / than; đuôi -ly, -tion, -ive", "**W**"],
        ["5 · Liên kết", "Từ đầu mỗi câu; this / it / they", "**L**"],
        ["6 · Chính tả + đề", "Từ dài; rồi đọc lại ĐỀ", "**W** (chính tả, từ dễ nhầm) · **I**"],
      ],
    },
    {
      t: "note",
      title: "💡 Mẹo: hai mã mục tiêu ⇒ hai lượt “của mình”",
      items: [
        "Mã nặng nhất là **A** ⇒ lượt 2 (danh từ) làm **đầu tiên** và làm chậm. Mã nặng nhì là **S** ⇒ lượt 1 làm thứ hai.",
        "Ở nhà hôm nay: làm **đủ 6 lượt** cho bài gốc, mỗi lượt một màu bút. Trong phòng thi: lượt 1 + lượt 3 + hai lượt của mình (Ngày 27).",
      ],
    },
    {
      t: "note",
      title: "⚠️ Bốn cách viết lại sai — tốn công mà band không tăng",
      items: [
        "**Chỉ sửa chính tả rồi chép lại**: giám khảo không chấm “bài sạch”, họ chấm ý có được phát triển không.",
        "**Đổi sang đề khác cho dễ**: vậy là viết bài mới, lỗi ở bài cũ vẫn còn nguyên.",
        "**Viết dài gấp đôi**: 400 chữ nhiều lỗi thấp điểm hơn 270 chữ sạch. Task 2 giữ 260 – 290 chữ, Task 1 giữ 160 – 190 chữ.",
        "**Học thuộc bài mẫu rồi chép vào**: bài thuộc lòng bị phát hiện và không dạy bạn gì. Mượn **khung câu**, không mượn câu.",
      ],
    },
    {
      t: "rule",
      formula: "Đếm mã → chọn 2 mã mục tiêu → Bản 2: sửa CÂU (A S T P W L C) → Bản 3: sửa Ý (I) → nộp AI → so band trước – sau",
      vi: "Thứ tự không đổi: câu trước, ý sau. Viết lại trọn bài từ dàn ý mới, không vá từng chữ trên bài cũ.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Mẫu Task 2 — bài gốc band 5" },
    {
      t: "p",
      text: "**Đề (tự soạn):** Some people think that governments should spend money on public transport rather than on building new roads. To what extent do you agree or disagree?",
    },
    {
      t: "note",
      title: "📌 Phân tích đề — đếm vế",
      items: [
        "Chủ đề: tiền của **chính phủ** cho giao thông. Hai lựa chọn được đặt lên cân: **public transport** ↔ **new roads**.",
        "Từ khoá **rather than** ⇒ bài phải nói về **cả hai**: vì sao nên chi cho phương tiện công cộng **và** vì sao (không) nên chi cho đường mới.",
        "Dạng **To what extent…** ⇒ lập trường có mức độ (hoàn toàn / phần lớn / một phần đồng ý), nêu ở mở bài và giữ tới kết bài (Ngày 6).",
      ],
    },
    {
      t: "passage",
      title: "Bản 1 — bài gốc (khoảng band 5)",
      intro: "Đọc và tự gạch lỗi trước khi xem bảng chú thích. Thử đếm: bao nhiêu lỗi mã A, bao nhiêu lỗi mã S?",
      paras: [
        { label: "Mở", text: "Nowadays, traffic is a big problem in many cities. Some people think government should spend money for public transport instead of build new roads. I agree with this opinion." },
        { label: "TB1", text: "Firstly, public transport is good for environment. Buses and trains can carry many people so there are less cars on the road. Moreover, the air will be more clean and people will be more healthy. For example, in my city there are a lot of motorbikes and the air is very dirty. Furthermore, public transport is cheap. People don't need to buy car and they can save money. In addition, students and old people can use bus easily because they cannot drive." },
        { label: "TB2", text: "Secondly, build new roads is not a good solution. When government build new roads, more people will buy cars and the roads will be crowded again. Besides, new roads cost a lot of money and they destroy many houses and trees. It also take a long time to build. However, some people say that roads are important for economy because trucks need roads to carry goods. I think it is true but public transport is more important." },
        { label: "Kết", text: "In conclusion, public transport have many advantages such as good for environment and cheap. Government should spend money for it and people should use public transport more. If everyone use bus, the traffic problem will be solved." },
      ],
    },
    {
      t: "table",
      caption: "Gạch lỗi theo mã — bài gốc",
      head: ["Mã", "Lỗi trong bài gốc", "Sửa"],
      rows: [
        ["**A** (×9)", "government should · good for environment (×2) · buy car · use bus (×2) · When government build · for economy · Government should", "**the** government / governments · **the** environment · buy **a** car · use **the** bus / buses · **the** economy"],
        ["**S** (×5)", "less cars · government build · It also take · public transport have · everyone use", "**fewer** cars · governments build / the government build**s** · It also take**s** · public transport **has** · everyone use**s**"],
        ["**P** (×2)", "spend money for (×2)", "spend money **on**"],
        ["**W** (×4)", "instead of build · build new roads is · more clean · more healthy", "instead of build**ing** · build**ing** new roads is · clean**er** · health**ier**"],
        ["**L** (×6)", "Firstly, Moreover, Furthermore, In addition, Secondly, Besides — sáu từ nối “thêm ý” trong hai đoạn", "Giữ 1 – 2 từ; thay bằng nối theo nghĩa: As a result · which means · by contrast"],
        ["**I** (×5)", "① “I agree” — không nói mức độ. ② TB1 có 3 ý lẻ (môi trường, rẻ, người không lái xe), không ý nào được giải thích. ③ Ví dụ “my city… air is dirty” không chứng minh được gì cho xe buýt. ④ Kết bài thêm ý mới (people should use…) và hứa quá (will be solved). ⑤ Bài chỉ khoảng 225 chữ — **thiếu 250 chữ** là bị trừ TR.", "Thesis có mức độ · 1 ý chính + chuỗi nhân quả + ví dụ cụ thể · phản đề được **trả lời** · kết bài chỉ nhắc lại lập trường"],
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Mẫu Task 2 — bản viết lại band 6, đặt cạnh bản gốc" },
    {
      t: "passage",
      title: "Bản 3 — viết lại (khoảng band 6 – 6.5)",
      intro: "Cùng đề, cùng lập trường, cùng các ý — nhưng mỗi ý được đẩy tới nơi. Khoảng 265 chữ.",
      paras: [
        { label: "Mở", text: "Traffic congestion has become a serious problem in many cities, and some people argue that governments should invest in public transport rather than build more roads. I largely agree with this view, although I accept that some new roads are still necessary." },
        { label: "TB1", text: "The main reason for prioritising public transport is that it reduces the number of private vehicles. A single bus can carry around fifty passengers, which means fifty fewer motorbikes or cars on the road. As a result, journeys become faster and the air becomes cleaner. In Ho Chi Minh City, for example, the first metro line has already allowed thousands of commuters to leave their motorbikes at home. Public transport is also affordable, so it enables students and elderly people, who cannot drive, to travel independently." },
        { label: "TB2", text: "Building new roads, by contrast, rarely solves congestion in the long term. When a new road opens, driving becomes more convenient, so more people decide to buy cars, and within a few years the road is as crowded as before. In addition, road projects are extremely expensive and often require houses to be demolished; the money would arguably achieve more if it were spent on bus lanes or new train lines. Admittedly, roads are essential for transporting goods, because lorries cannot use railways for every journey. However, this need can be met by improving existing roads rather than constantly adding new ones." },
        { label: "Kết", text: "In conclusion, I believe that most transport spending should go to buses and trains, since they reduce both congestion and pollution, while road building should be limited to routes that are needed for freight." },
      ],
    },
    {
      t: "table",
      caption: "Đặt cạnh nhau — từng phần của bài",
      head: ["Phần", "Band 5 (bản gốc)", "Band 6 (viết lại)", "Sửa gì"],
      rows: [
        ["**Mở bài**", "Nowadays, traffic is a big problem… I agree with this opinion.", "Traffic congestion has become a serious problem… **I largely agree** with this view, **although I accept that** some new roads are still necessary.", "Paraphrase đề bằng từ của mình (invest in, rather than build); lập trường **có mức độ**."],
        ["**Câu chủ đề TB1**", "Firstly, public transport is good for environment.", "**The main reason for** prioritising public transport **is that** it reduces the number of private vehicles.", "Câu chủ đề nêu **một** lý do rõ; bỏ Firstly."],
        ["**Phát triển TB1**", "…carry many people so there are less cars… Moreover… Furthermore… In addition…", "A single bus can carry around fifty passengers, **which means**… **As a result**, journeys become faster and the air becomes cleaner.", "Ba ý lẻ → **một chuỗi nhân quả** (ít xe → nhanh hơn → sạch hơn)."],
        ["**Ví dụ**", "in my city there are a lot of motorbikes and the air is very dirty", "In Ho Chi Minh City, **for example**, the first metro line has already **allowed** thousands of commuters **to leave** their motorbikes at home.", "Ví dụ có **nơi, vật, kết quả** — và chứng minh đúng ý của đoạn."],
        ["**Câu chủ đề TB2**", "Secondly, build new roads is not a good solution.", "Building new roads, **by contrast**, rarely solves congestion **in the long term**.", "V-ing làm chủ ngữ; **rarely / in the long term** thay cho “not good” tuyệt đối."],
        ["**Phản đề**", "However, some people say that roads are important for economy… I think it is true but public transport is more important.", "**Admittedly**, roads are essential for transporting goods… **However, this need can be met by** improving existing roads…", "Bản gốc nêu phản đề rồi **bỏ lửng**. Bản mới **trả lời** nó bằng một giải pháp."],
        ["**Kết bài**", "…Government should… people should use public transport more. If everyone use bus, the traffic problem will be solved.", "…most transport spending should go to buses and trains, **since**…, **while** road building should be limited to…", "Không thêm ý mới; nhắc lại **đúng lập trường mở bài** (phần lớn — không phải tất cả)."],
      ],
    },
    {
      t: "table",
      caption: "Vì sao hơn một band — bốn tiêu chí",
      head: ["Tiêu chí", "Band 5 (bản gốc)", "Band 6 (viết lại)"],
      rows: [
        ["**TR** — trả lời đề", "Có lập trường nhưng không nói mức độ; vế “new roads” có nhắc nhưng phản đề bỏ lửng; ý liệt kê, ít giải thích; kết bài thêm ý lạ.", "Đủ **cả hai vế** (public transport · new roads); lập trường “largely agree” giữ từ đầu tới cuối; mỗi ý có giải thích + ví dụ."],
        ["**CC** — mạch lạc", "Chia đoạn đúng nhưng **lạm dụng** từ nối liệt kê (6 từ); các câu trong đoạn không nối nghĩa với nhau.", "Mỗi đoạn một ý trung tâm; nối theo **nghĩa** (which means · As a result · by contrast · Admittedly… However); dùng **this need / this view** để tham chiếu."],
        ["**LR** — từ vựng", "Từ đơn giản, lặp: good · problem · a lot of · cheap · important; sai dạng từ (more clean).", "Đủ rộng cho đề: congestion · invest in · prioritise · private vehicles · commuters · affordable · freight · demolished."],
        ["**GRA** — ngữ pháp", "Gần như toàn câu đơn / câu ghép bằng and, so; lỗi mạo từ và chủ – vị ở hầu hết các câu.", "Trộn câu đơn – phức: mệnh đề quan hệ (**, which means** · **, who cannot drive,**), nhượng bộ (**although**), bị động (**can be met · to be demolished**), causative (**allowed… to leave · enables… to travel**). Lỗi hiếm."],
      ],
    },
    {
      t: "note",
      title: "💡 Nhìn kỹ: bản band 6 KHÔNG dùng từ gì ghê gớm",
      items: [
        "Bản viết lại dài hơn bản gốc chỉ khoảng 40 chữ (và nhờ thế mới đủ 250). Nó **bớt** hai ý lẻ, **thêm** một chuỗi nhân quả và một ví dụ cụ thể.",
        "Mọi cấu trúc trong đó bạn đều đã học ở Tập 3: , which means (N17) · although (N21) · bị động với modal (N13) · allow / enable + O + to V (N29) · cụm danh từ “the number of private vehicles” (N25).",
        "Không có idiom nào (bài 1 hôm nay): **cost an arm and a leg** → extremely expensive.",
      ],
    },
    {
      t: "rule",
      formula: "Thân bài band 6 = câu chủ đề (1 lý do) + , which means / As a result (hệ quả) + for example (nơi · vật · kết quả) + câu nối về lập trường",
      vi: "Một ý được đẩy tới hệ quả và ví dụ ăn điểm hơn ba ý chỉ được nêu tên.",
    },

    /* ── 6 ── */
    { t: "h", text: "6. Mẫu Task 1 — bản gốc band 5 và bản viết lại band 6" },
    {
      t: "p",
      text: "**Đề (tự soạn):** The bar chart shows the average number of hours per week that teenagers and adults in one European country spent on four leisure activities in 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    },
    {
      t: "chart",
      kind: "bar",
      title: "Average hours per week spent on four leisure activities, 2022",
      unit: "hours",
      labels: ["Watching TV", "Social media", "Sport", "Reading"],
      series: [
        { name: "Teenagers", values: [10, 21, 6, 3] },
        { name: "Adults", values: [16, 9, 4, 7] },
      ],
    },
    {
      t: "table",
      caption: "Hai bài đặt cạnh nhau",
      head: ["Phần", "Band 5 (bản gốc — 114 chữ)", "Band 6 (viết lại — khoảng 157 chữ)"],
      rows: [
        ["**Mở bài**", "The bar chart show how many hours teenagers and adults spend for four leisure activities per week in one European country in 2022.", "The bar chart compares the average number of hours per week that teenagers and adults in one European country spent on four leisure activities in 2022."],
        ["**Overview**", "(không có)", "Overall, teenagers devoted the most time to social media, whereas television was the main leisure activity for adults. In both groups, the least time was spent on sport and reading, although the order differed."],
        ["**Thân bài 1**", "Teenagers spent 10 hours for watching TV and adults spent 16 hours. For social media, teenagers spent 21 hours and adults spent 9 hours. Teenagers spent 6 hours for sport and adults spent 4 hours. For reading, teenagers spent 3 hours and adults spent 7 hours.", "Teenagers spent 21 hours a week on social media, which was more than twice the figure for adults (9 hours). This made it by far the most time-consuming activity in the chart. Teenagers were also slightly more active, doing 6 hours of sport compared with 4 hours for adults, for whom sport was the least popular pastime."],
        ["**Thân bài 2**", "Social media is the most popular activity of teenagers because they like to use phone. Reading is the lowest. Adults like watching TV the most and they do not like sport.", "By contrast, adults watched far more television than teenagers, at 16 hours against 10. Reading showed a similar pattern: adults read for 7 hours a week, while the figure for teenagers was only 3 hours, the lowest in the chart."],
        ["**Kết**", "In conclusion, teenagers and adults have different hobbies and teenagers should read more books.", "(không cần — overview đã làm việc của kết bài)"],
      ],
    },
    {
      t: "table",
      caption: "Vì sao hơn một band — bốn tiêu chí Task 1",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**TA** — hoàn thành yêu cầu", "**Không có overview**; đọc lại cả 8 con số theo thứ tự, không chọn lọc; **giải thích nguyên nhân** (because they like to use phone) và **nêu ý kiến** (should read more) — Task 1 cấm cả hai; chỉ 114 chữ — thiếu 150.", "Overview rõ **2 điểm chính** (hoạt động đứng đầu của mỗi nhóm · hai hoạt động thấp nhất); số liệu được **chọn và so sánh**; không ý kiến; đủ độ dài."],
        ["**CC**", "Thân bài 1 là 4 câu cùng một khuôn; không có từ so sánh, đối lập.", "Chia thân bài theo **nhóm thắng**: TB1 = hoạt động thiếu niên nhiều hơn, TB2 = hoạt động người lớn nhiều hơn; nối bằng whereas · By contrast · while · a similar pattern."],
        ["**LR**", "spent … hours lặp 8 lần; “the lowest” đứng trơ trọi.", "devoted time to · the main leisure activity · the figure for · at 16 hours against 10 · more than twice."],
        ["**GRA**", "show (thiếu -s) · spend (sai thì — số liệu năm 2022) · spend for (sai giới từ) · use phone (thiếu mạo từ); toàn câu đơn.", "Quá khứ đơn nhất quán; so sánh bội số (**more than twice the figure for**, N11); mệnh đề quan hệ (**, which was…**); cụm danh từ (**the average number of hours per week that…**, N25)."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Sáu lỗi Task 1 hay gặp nhất khi soát bài cũ",
      items: [
        "**Không có overview** hoặc overview có số liệu chi tiết → band TA không qua 5.",
        "**Sai thì**: biểu đồ có năm quá khứ mà viết hiện tại đơn (spend, is).",
        "**Kể hết mọi con số** theo thứ tự trong hình, không nhóm, không so sánh.",
        "**Giải thích nguyên nhân / nêu ý kiến** — Task 1 chỉ **tả**.",
        "**Đơn vị sai hoặc thiếu**: 21 (gì?) → 21 hours a week; % ↔ số tuyệt đối.",
        "**Dưới 150 chữ** — đếm lại trước khi nộp.",
      ],
    },
    {
      t: "rule",
      formula: "Task 1 viết lại = thêm Overall (2 điểm chính, không số) + nhóm số liệu theo “ai hơn ai” + mỗi câu một phép so sánh + bỏ nguyên nhân / ý kiến",
      vi: "Thứ đầu tiên phải kiểm ở mọi bài Task 1 cũ: có overview chưa, đúng thì chưa.",
    },

    /* ── 7 ── */
    { t: "h", text: "7. Luyện trước khi viết lại bài của bạn" },
    {
      t: "mcq",
      id: "t3d30-viet-ma-loi",
      title: "7a. Lỗi này thuộc mã nào? Sửa theo lượt nào? (8 câu)",
      items: [
        { q: "“Government should build more hospital in the countryside.” — hai lỗi thuộc mã:", options: ["A và S", "T và P", "L và C", "W và I"], correct: 0, why: "**The** government / Governments (A) · more hospital**s** (S)." },
        { q: "“The chart shows that in 2010, the figure is 20% and then it rises to 35% in 2020.” — mã gì?", options: ["A — mạo từ", "P — giới từ", "T — thì", "L — từ nối"], correct: 2, why: "Mốc quá khứ ⇒ **was… rose** → mã T." },
        { q: "“Firstly, … Secondly, … Thirdly, … Moreover, … Furthermore, …” trong một đoạn 90 chữ — mã gì?", options: ["I", "L", "S", "W"], correct: 1, why: "Lạm dụng từ nối liệt kê → mã **L** (CC band 5: “overuse of cohesive devices”)." },
        { q: "Thân bài chỉ có: “Online learning is convenient. It is also cheap. It is flexible.” — mã gì?", options: ["C — câu", "A — mạo từ", "T — thì", "I — ý không được phát triển"], correct: 3, why: "Ba ý được **nêu tên**, không ý nào có vì sao / ví dụ → mã **I**." },
        { q: "Đề hỏi “Discuss both views and give your own opinion”, bài chỉ bàn một quan điểm. Sửa ở lượt nào?", options: ["Lượt sửa câu (bản 2)", "Lượt sửa ý (bản 3) — phải viết thêm một thân bài", "Không cần sửa", "Chỉ cần thêm một câu ở kết bài"], correct: 1, why: "Thiếu **vế đề** là lỗi TR nặng nhất — phải sửa dàn ý rồi viết lại, không vá được bằng một câu." },
        { q: "Bài Task 1 của bạn có câu: “I think young people use social media too much.” Làm gì?", options: ["Giữ — cho bài có chiều sâu", "Chuyển lên overview", "Xoá — Task 1 không nêu ý kiến", "Đổi thành In my opinion"], correct: 2, why: "Task 1 chỉ tả và so sánh số liệu." },
        { q: "Thứ tự đúng khi viết lại:", options: ["Sửa ý → sửa câu → nộp AI", "Nộp AI → sửa câu → sửa ý", "Chép lại → sửa chính tả", "Sửa câu theo mã → sửa ý theo đề → viết lại trọn bài → nộp AI"], correct: 3, why: "Câu trước, ý sau (Ngày 2): sửa ý trước thì câu mới viết ra vẫn mang lỗi cũ." },
        { q: "Bản viết lại Task 2 của bạn dài 410 chữ. Nhận xét đúng nhất:", options: ["Quá dài — dễ thêm lỗi và hết giờ; cắt về 260 – 290 chữ, giữ 2 thân bài sâu", "Càng dài điểm càng cao", "Phải cắt còn đúng 250 chữ", "Không sao miễn là đúng ngữ pháp"], correct: 0, why: "Trong 40 phút thi, 410 chữ nghĩa là không có giờ soát. Band 6 cần **sâu**, không cần dài." },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-viet-sua-cau",
      title: "7b. Viết lại câu band 5 thành câu band 6 (6 câu — dùng gợi ý)",
      kind: "translate",
      grammar: "Sửa lỗi + nâng cấu trúc theo gợi ý",
      items: [
        { q: "Public transport is good for environment. → (sửa mạo từ; đổi good for → reduce pollution)", answers: ["Public transport reduces pollution.", "Public transport helps to reduce pollution.", "Public transport helps reduce pollution.", "Public transport is good for the environment because it reduces pollution.", "Public transport reduces air pollution."], hint: "Public transport reduces…" },
        { q: "Build new roads is not a good solution. → (V-ing làm chủ ngữ + rarely solves the problem)", answers: ["Building new roads rarely solves the problem.", "Building new roads rarely solves this problem."], hint: "Building new roads rarely…" },
        { q: "Buses carry many people. There are fewer cars on the road. → (nối bằng , which means)", answers: ["Buses carry many people, which means there are fewer cars on the road.", "Buses carry many people, which means that there are fewer cars on the road.", "Buses carry many people, which means fewer cars on the road."], hint: "…, which means (that) there are…" },
        { q: "I agree with this opinion. → (đồng ý phần lớn — largely)", answers: ["I largely agree with this view.", "I largely agree with this opinion.", "I largely agree with this idea."], hint: "I largely agree with…" },
        { q: "The bar chart show how many hours teenagers spend for sport. → (sửa chủ – vị, thì quá khứ, giới từ)", answers: ["The bar chart shows how many hours teenagers spent on sport.", "The bar chart shows how many hours teenagers spent on sports."], hint: "shows … spent on" },
        { q: "Teenagers spent 21 hours on social media and adults spent 9 hours. → (more than twice the figure for)", answers: ["Teenagers spent 21 hours on social media, which was more than twice the figure for adults.", "Teenagers spent 21 hours on social media, more than twice the figure for adults.", "Teenagers spent 21 hours on social media, which was more than twice the figure for adults (9 hours).", "Teenagers spent 21 hours on social media, more than twice the figure for adults (9 hours)."], hint: "…, which was more than twice the figure for adults" },
      ],
    },
    {
      t: "table",
      caption: "12 câu khung dùng lại khi viết lại — chép vào sổ",
      head: ["Dùng để", "Câu khung"],
      rows: [
        ["Thesis có mức độ", "I largely / partly agree with this view, although I accept that …"],
        ["Câu chủ đề", "The main reason for + V-ing … is that …"],
        ["Đẩy tới hệ quả", "…, which means (that) … · As a result, …"],
        ["Ví dụ cụ thể", "In + nơi, for example, … has already allowed … to …"],
        ["Chuyển sang vế kia", "…, by contrast, rarely / seldom …"],
        ["Nêu phản đề", "Admittedly, … · It is true that …"],
        ["Trả lời phản đề", "However, this need / problem can be met / solved by + V-ing …"],
        ["Kết bài", "In conclusion, I believe that …, since …, while …"],
        ["Task 1 mở bài", "The chart compares the + N + of … in / between …"],
        ["Task 1 overview", "Overall, … the most …, whereas … · In both …, the least …"],
        ["Task 1 so sánh", "…, which was more than twice the figure for … · at X against Y"],
        ["Task 1 đối lập", "By contrast, … · … showed a similar pattern: …"],
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Đến lượt bạn — viết lại 2 bài (AI chấm)" },
    {
      t: "p",
      text: "Làm đúng quy trình mục 3 cho **từng bài**. Ở ô viết, **dòng đầu tiên chép lại đề cũ** (để AI biết bạn trả lời đề nào), xuống dòng rồi viết bản mới. Nếu chưa có bài cũ nào, dùng đề dự phòng ghi sẵn trong ô và coi bài viết hôm nay là **bản 1** — tuần sau viết lại nó.",
    },
    {
      t: "essay",
      id: "t3d30-viet-lai-task2",
      task: "Task 2",
      prompt: "REWRITE (Task 2). On the FIRST line, copy the question of one of your old Task 2 essays from this course. Then write your improved version (at least 250 words). — If you have no old essay, answer this question instead: “Some people think that governments should spend money on public transport rather than on building new roads. To what extent do you agree or disagree?”",
      minWords: 250,
      tips: [
        "Trước khi viết: đếm vế đề, sửa dàn ý — mỗi thân bài 1 ý chính + hệ quả + ví dụ cụ thể + câu chốt.",
        "Lập trường có mức độ ở mở bài, nhắc lại đúng lập trường ấy ở kết bài, không thêm ý mới.",
        "Soát hai lượt cuối cho đúng HAI mã mục tiêu của bạn (ví dụ: A rồi S).",
        "Xong thì so band AI với bài gốc theo từng tiêu chí và ghi vào sổ lỗi.",
      ],
    },
    {
      t: "essay",
      id: "t3d30-viet-lai-task1",
      task: "Task 1",
      prompt: "REWRITE (Task 1). On the FIRST line, copy the question of one of your old Task 1 reports from this course and list its key figures. Then write your improved report (at least 150 words). — If you have no old report, use the bar chart in section 6 of this lesson: “The bar chart shows the average number of hours per week that teenagers and adults in one European country spent on four leisure activities in 2022 (Teenagers: TV 10, social media 21, sport 6, reading 3; Adults: TV 16, social media 9, sport 4, reading 7). Summarise the information by selecting and reporting the main features, and make comparisons where relevant.” Do not copy the model answer.",
      minWords: 150,
      tips: [
        "Kiểm trước hai thứ: có đoạn Overall (2 điểm chính, không số liệu) chưa? Thì đã đúng với năm trong hình chưa?",
        "Nhóm số liệu theo “ai hơn ai” hoặc “tăng – giảm”, không kể theo thứ tự trong hình.",
        "Mỗi câu thân bài có một phép so sánh: whereas · twice as … as · the figure for · compared with.",
        "Không giải thích nguyên nhân, không nêu ý kiến, không kết luận kiểu khuyên nhủ.",
      ],
    },
    {
      t: "table",
      caption: "Phiếu so trước – sau (điền cho từng bài)",
      head: ["", "Bản gốc", "Bản viết lại", "Chênh"],
      rows: [
        ["Band TR / TA", "…", "…", "…"],
        ["Band CC", "…", "…", "…"],
        ["Band LR", "…", "…", "…"],
        ["Band GRA", "…", "…", "…"],
        ["Số lỗi mã mục tiêu 1 (vd A)", "…", "…", "giảm ≥ một nửa?"],
        ["Số lỗi mã mục tiêu 2 (vd S)", "…", "…", "giảm ≥ một nửa?"],
      ],
    },
    {
      t: "note",
      title: "📌 Sau hai bài viết lại",
      items: [
        "Bản viết lại **không cao hơn** bản gốc? Xem tiêu chí nào đứng yên: TR / TA đứng yên ⇒ dàn ý chưa đổi thật (ôn Ngày 6 · 10 · 14 · 18 · 22 theo dạng đề); GRA đứng yên ⇒ hai mã mục tiêu vẫn còn — làm lại bài dịch của Ngày tương ứng.",
        "Giữ thói quen **mỗi tuần viết lại một bài** suốt Tập 4 (lịch tự học ở Ngày 2). Ở Tập 4 Ngày 30 bạn sẽ viết lại 3 bài với mục tiêu ≤ 3 lỗi mỗi bài.",
        "Phần Writing của **Đề 5** (Task 1 process · Task 2 two-part question) làm **sau** khi đã xong hai bài viết lại hôm nay, để lỗi cũ không theo vào phòng thi.",
      ],
    },
  ],
};
/* ───────────────────────── Bài 3 — Nói ───────────────────────── */
const D30_NOI: Lesson = {
  id: "t3d30-noi",
  kind: "speaking",
  title: "Nói: Giám khảo AI 14 phút lần 2 — thi trọn 3 Part ở mức band 6",
  goal: "Khởi động bằng ba câu trả lời mẫu band 5 – band 6 cho Part 1, 2, 3, soát bảng 12 điều của band 6, rồi làm một bài thi nói đủ 3 Part (11 – 14 phút) với giám khảo AI lần 2; đọc phản hồi theo FC · LR · GRA · P, so với lần 1 (Tập 2 Ngày 23) và chọn đúng hai việc cần sửa trước Đề 5 (Speaking band 6).",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì — đẩy band nào",
      items: [
        "Đây là lần **thứ hai** bạn thi nói trọn bài với **giám khảo AI** (lần đầu: Tập 2 Ngày 23, mức band 5, ~11 phút). Lần này nhắm ==band 6==, đủ 11 – 14 phút.",
        "Band 6 Speaking (ôn Ngày 2): **sẵn lòng nói dài**, có lúc ngập ngừng hay tự sửa nhưng vẫn mạch lạc; từ đủ để bàn kỹ một chủ đề, có **paraphrase**; trộn câu đơn – phức; phát âm nhìn chung dễ hiểu.",
        "Trước khi vào phòng thi: 15 phút khởi động với mẫu band 5 ↔ band 6 + bảng soát 12 điều gom từ cả Tập 3.",
        "Sau khi thi: đọc phản hồi theo 4 tiêu chí, ==so với lần 1==, ghi **2 việc** cần sửa vào sổ Speaking (Ngày 2).",
        "Phát âm hôm nay: **nhịp và nối âm trong idiom** — đọc cả cụm một hơi (nối bài 1).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Bài thi 14 phút gồm những gì" },
    {
      t: "table",
      caption: "Ba Part của bài thi Speaking",
      head: ["Part", "Thời gian", "Giám khảo làm gì", "Band 6 cần gì"],
      rows: [
        ["**Mở đầu**", "~30 giây", "Chào, hỏi tên, xem giấy tờ", "Trả lời ngắn, tự nhiên: “My name's … You can call me …”"],
        ["**Part 1**", "4 – 5 phút", "9 – 12 câu về 2 – 3 chủ đề quen (nhà, học, sở thích…)", "Mỗi câu **2 – 4 câu**: trả lời thẳng + lý do / chi tiết + ví dụ nhỏ"],
        ["**Part 2**", "3 – 4 phút", "Đưa thẻ đề; 1 phút chuẩn bị; bạn nói 1 – 2 phút; 1 – 2 câu hỏi chốt", "Nói **đủ gần 2 phút**, có mở – thân – kết, kể bằng thì quá khứ đúng"],
        ["**Part 3**", "4 – 5 phút", "4 – 6 câu bàn luận trừu tượng nối với đề Part 2", "Mỗi câu **4 – 6 câu**: ý kiến có mức độ + lý do + ví dụ + mặt còn lại"],
      ],
    },
    {
      t: "table",
      caption: "Lần 1 và lần 2 — khác nhau ở đích",
      head: ["", "Lần 1 (Tập 2 Ngày 23)", "Lần 2 (hôm nay)"],
      rows: [
        ["**Đích**", "Band 5 — nói được trọn bài, không bỏ cuộc", "Band 6 — nói dài, có mức độ, tự sửa đúng cách"],
        ["**Part 1**", "Trả lời đủ câu", "Dùng được **12 khung câu hỏi** (Ngày 3), có 1 – 2 idiom đúng chỗ"],
        ["**Part 2**", "Đủ 1 phút 30", "Gần **2 phút**, có quá khứ hoàn thành / “, which…” / một câu điều kiện loại 3"],
        ["**Part 3**", "Mỗi câu ≥ 3 câu", "Đủ **5 kiểu câu hỏi**: Why · Do you agree · What would happen if · Some people say · Is it a good thing"],
        ["**Khi bí**", "Im lặng hoặc “I don't know”", "Câu mua giờ + đoán có mức độ; **không im quá 3 giây** (Ngày 27)"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Band 5 và band 6 đặt cạnh nhau — ba Part" },
    {
      t: "p",
      text: "Đọc to cả hai bản của từng Part. Đừng học thuộc bản band 6 — hãy tìm **nó làm thêm việc gì** so với bản band 5 (cột cuối bảng).",
    },
    {
      t: "table",
      caption: "Part 1 — “Do you like getting up early?”",
      head: ["Band 5", "Band 6", "Khác ở đâu"],
      rows: [
        [
          "No, I don't like. I usually get up at 7 o'clock because I have class. In the weekend I get up late. I think get up early is good for health but it is very difficult for me.",
          "Not really, to be honest. I'm more of a night person, so getting up before seven is a real struggle for me. On weekdays I have to, because my first class starts at half past seven, but at the weekend I usually sleep in until nine or ten.",
          "**FC**: mở bằng cụm tự nhiên (Not really, to be honest) thay vì “No, I don't like” (thiếu tân ngữ). **LR**: a night person · a real struggle · sleep in. **GRA**: V-ing làm chủ ngữ đúng (getting up…), giới từ đúng (**at** the weekend). **P**: ngắt theo cụm, không đọc từng từ.",
        ],
      ],
    },
    {
      t: "p",
      text: "**Thẻ đề Part 2:** Describe a time when you helped someone. You should say: **who** you helped · **what** the problem was · **how** you helped · and explain **how you felt** about it.",
    },
    {
      t: "table",
      caption: "Part 2 — cùng một chuyện, hai mức",
      head: ["Band 5 (~85 chữ, 45 giây)", "Band 6 (~230 chữ, gần 2 phút)"],
      rows: [
        [
          "I want to talk about I helped my neighbour. She is old woman and she live alone. Last year her phone is broken and she cannot call her son. I go to her house and I fix the phone for her. I delete many photo and then the phone work again. She was very happy and she say thank you to me. I feel happy too because I can help people. I think help other people is very good. That's all.",
          "I'd like to talk about a time when I helped an elderly neighbour of mine, Mrs Lan, who lives alone two doors away from my family. It happened about a year ago, during the rainy season. One evening I was coming home from university when I saw her standing outside her house, looking really worried. It turned out that her phone had stopped working, and she'd been trying to call her son in Da Nang for two days. She had no idea what was wrong, and she couldn't walk to the repair shop because of her knee. So I had a look at it. I'm not an expert, but I realised the phone was simply full — she had thousands of photos and videos that relatives had sent her. I backed everything up on my laptop, deleted the old files and updated the software. Then I showed her how to make a video call and wrote the steps on a piece of paper in big letters, which she stuck on her fridge. When she finally saw her grandson's face on the screen, she was over the moon, and honestly, so was I. What struck me was how small the problem was for me and how big it was for her. If I hadn't stopped that evening, she might have been cut off from her family for much longer.",
        ],
      ],
    },
    {
      t: "table",
      caption: "Part 2 — bản band 6 làm thêm những gì",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**FC**", "Hết ý sau 45 giây; kết bằng “That's all.”", "Đi đủ 4 gạch đầu dòng theo thứ tự; có mốc chuyện (One evening… It turned out that… So… Then… When she finally…); kết bằng một suy nghĩ."],
        ["**LR**", "happy (×2) · fix · very good", "an elderly neighbour · looking really worried · backed everything up · **over the moon** (1 idiom) · be cut off from"],
        ["**GRA**", "Lẫn hiện tại – quá khứ (is broken, I go, she say); thiếu mạo từ, -s", "Quá khứ tiếp diễn + đơn (was coming… when I saw) · quá khứ hoàn thành (had stopped) · QKHT tiếp diễn (she'd been trying) · mệnh đề quan hệ (, which she stuck…) · **điều kiện loại 3** (If I hadn't stopped…, she might have been…) · What struck me was…"],
        ["**P**", "Đều đều, bỏ âm cuối -ed", "Nhấn từ mang nghĩa (really WORRIED · simply FULL); đọc rõ -ed: stopped /t/ · realised /d/ · deleted /ɪd/"],
      ],
    },
    {
      t: "table",
      caption: "Part 3 — “Do you think people today help each other less than in the past?”",
      head: ["Band 5", "Band 6", "Khác ở đâu"],
      rows: [
        [
          "Yes, I think so. Today people are very busy and they don't have time. In the past people live in village and they know each other. Now people live in city and don't know neighbour. So they help less.",
          "To some extent, yes. In the past, most people lived in small communities where everyone knew each other, so helping a neighbour was just a normal part of life. In big cities today, by contrast, people often don't even know who lives next door, which makes it less likely that they'll offer help. That said, I wouldn't say people have become less kind. They help in different ways — donating online, for example, or volunteering through organisations — so the help is still there; it's just less visible.",
          "**FC**: ý kiến **có mức độ** (To some extent) → so sánh xưa – nay → **mặt còn lại** (That said…) → câu chốt. **LR**: small communities · offer help · donating · less visible. **GRA**: quá khứ đúng (lived, knew), **, which makes it less likely that…**, mệnh đề danh ngữ (who lives next door). **P**: ngữ điệu đối lập ở by contrast / That said (Ngày 23).",
        ],
      ],
    },
    {
      t: "rule",
      formula: "Part 3 band 6 = To some extent / I'd say … + lý do (so / because) + by contrast / for example + That said, … + câu chốt",
      vi: "Bốn bước cho mọi câu Part 3: ý kiến có mức độ → vì sao → ví dụ hoặc so sánh → mặt còn lại.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Bảng soát 12 điều của band 6 — gom từ cả Tập 3" },
    {
      t: "table",
      caption: "Trước khi bấm “Bắt đầu thi”, đọc to bảng này một lượt",
      head: ["#", "Điều cần làm", "Câu / khung mẫu", "Học ở"],
      rows: [
        ["1", "Part 1: không trả lời một chữ; 2 – 4 câu", "Not really, to be honest. … because … For example, …", "N3 (12 khung)"],
        ["2", "Câu hỏi “What kind of…?”", "I like all kinds of…, but if I had to choose one, I'd say…", "N3"],
        ["3", "Mua giờ khi bí", "That's an interesting question. Let me think… · I've never really thought about that, but I'd say…", "N11 · N27"],
        ["4", "Quên từ ⇒ tả vòng", "I can't remember the word, but it's a kind of… / it's the thing you use to…", "N11"],
        ["5", "Tự sửa đúng cách", "…he go — sorry, he **went**… (sửa một lần rồi đi tiếp, không xin lỗi dài)", "N27"],
        ["6", "Part 2: 1 phút ghi **từ khoá** theo 4 gạch đầu dòng, không viết câu", "who · problem · how · felt", "N7 · N14 · N22 · N26"],
        ["7", "Part 2: kể bằng quá khứ + một câu “trước đó”", "It turned out that … had + V3", "N22"],
        ["8", "Part 3 “Why…?”", "I think there are two main reasons. The first is… The second is…", "N6"],
        ["9", "Part 3 “Do you agree…?”", "I agree up to a point. … However, …", "N10"],
        ["10", "Part 3 giả định", "If + V-ed, … would … · If that happened, …", "N15"],
        ["11", "Part 3 thuật ý người khác", "Some people argue that…, but I'm not convinced, because…", "N19"],
        ["12", "Part 3 đánh giá", "It's a good thing in the sense that…, but the downside is that…", "N23"],
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận: năm thói quen kéo điểm xuống band 5",
      items: [
        "**Im lặng quá 3 giây** để tìm từ hoàn hảo. Nói ý đó bằng từ đơn giản hơn rồi đi tiếp.",
        "**Đọc thuộc lòng** một đoạn chuẩn bị sẵn — giám khảo (kể cả AI) nhận ra qua nhịp đều và sẽ hỏi lệch đi.",
        "**Nhồi idiom**: mỗi câu trả lời tối đa 1 cái (bài 1).",
        "**Trả lời Part 3 như Part 1** — kể chuyện bản thân thay vì bàn về **xã hội**. Part 3 hỏi “people”, không hỏi “you”.",
        "**Bỏ âm cuối** -s, -ed, /t/, /k/ — lỗi phát âm số một của người Việt; người nghe phải đoán thì.",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Khởi động 10 phút — nói thử từng Part (AI chấm từng câu)" },
    {
      t: "speak",
      id: "t3d30-noi-p1",
      part: "1",
      questions: [
        "Do you like getting up early? Why / Why not?",
        "What do you usually do at the weekend?",
        "Is there anything you would like to change about your daily routine?",
        "Do you prefer to study alone or with other people?",
      ],
    },
    {
      t: "speak",
      id: "t3d30-noi-p2",
      part: "2",
      questions: [
        "Describe a time when you helped someone. You should say: who you helped; what the problem was; how you helped; and explain how you felt about it. (Chuẩn bị 1 phút — ghi từ khoá — rồi nói gần 2 phút.)",
      ],
    },
    {
      t: "speak",
      id: "t3d30-noi-p3",
      part: "3",
      questions: [
        "Do you think people today help each other less than in the past?",
        "Why do some people do voluntary work without being paid?",
        "Some people say that the government, not individuals, should look after people in need. Do you agree?",
        "What would happen if schools made community service compulsory for all students?",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Vào phòng thi — giám khảo AI lần 2" },
    {
      t: "p",
      text: "Khoá có **Phòng thi Speaking** với **giám khảo AI**: giám khảo chào, hỏi Part 1, đưa thẻ đề Part 2 (1 phút chuẩn bị, nói tối đa 2 phút), hỏi câu chốt rồi hỏi Part 3. Xong bài, AI chấm **FC · LR · GRA · P**, cho nghe lại từng câu, hiện chữ bạn đã nói, lỗi + câu sửa. Hôm nay thi **Speaking — Đề 5 (thi cuối Tập 3, band 6.0)** ở **chế độ thi thật**: `/language/en/ielts/thi-may/noi?de=noi-de5` (Online Test → Speaking → Đề 5). Đề này bạn chưa gặp nên kết quả đo đúng trình — và đây chính là phần Speaking của Đề 5: sau bài kiểm tra chặng, bạn làm riêng Listening · Reading · Writing của Đề 5 (Online Test cho làm từng kỹ năng); nếu làm cả bộ thì lượt Speaking trong bộ là **lần 3** để so tiến bộ. Muốn khởi động thêm trước khi thi thật: một lượt `noi?de=noi-de4&che=luyen` (Đề 4, chế độ luyện).",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Các bước của buổi thi nói hôm nay",
      caption: "Tổng cộng khoảng 30 phút: 14 phút thi + 15 phút đọc phản hồi.",
      steps: [
        { label: "**Chuẩn bị (2')**", sub: "Phòng yên, tai nghe có micro, giấy bút cho Part 2. Tắt thông báo." },
        { label: "**Thi một mạch (11 – 14')**", sub: "Không dừng, không làm lại câu. Bí thì dùng câu mua giờ." },
        { label: "**Đọc điểm 4 tiêu chí (3')**", sub: "Ghi FC · LR · GRA · P vào sổ, cạnh điểm lần 1." },
        { label: "**Nghe lại 3 câu yếu nhất (7')**", sub: "Đọc câu AI sửa, nói lại câu đó 2 lần." },
        { label: "**Chọn 2 việc cần sửa (3')**", sub: "Ghi vào sổ Speaking — không ghi quá 2." },
      ],
    },
    {
      t: "note",
      title: "💡 Mẹo cho lần 2",
      items: [
        "Không nghe rõ câu hỏi: **“Sorry, could you say that again, please?”** — được phép, không mất điểm. Không hiểu một từ: **“Sorry, what does … mean?”** (Part 3 được hỏi lại nghĩa; Part 1 thường chỉ được nhắc lại câu hỏi).",
        "Part 2: nhìn giấy ghi chú **khi chuyển ý**, không cúi đọc. Nếu hết ý trước 1 phút 30: thêm “**What struck me was…**” hoặc “**Looking back, …**” rồi nói cảm nghĩ.",
        "Bị giám khảo ngắt ở Part 2 hay Part 3 là **bình thường** — nghĩa là bạn đã nói đủ dài.",
        "Đừng nhìn đồng hồ. Việc của bạn là nói; giữ giờ là việc của giám khảo.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Đọc phản hồi — biến điểm thành việc làm" },
    {
      t: "table",
      caption: "Tiêu chí thấp nhất của bạn là gì? → làm gì trong tuần tới",
      head: ["Thấp nhất", "Dấu hiệu trong bản ghi", "Việc làm (10 phút mỗi ngày)", "Ôn"],
      rows: [
        ["**FC**", "Câu trả lời ngắn; nhiều quãng im; lặp “and… and…”", "Mỗi ngày 1 thẻ Part 2 nói đủ 2 phút + 3 câu Part 3 theo khung 4 bước", "N11 · N27"],
        ["**LR**", "Lặp good / bad / important / a lot of; không paraphrase câu hỏi", "Trước khi trả lời, đổi 1 từ của câu hỏi; mỗi ngày ôn 1 bộ thẻ chủ đề (bài 1, mục 9)", "N3 · bài từ vựng ngày chẵn"],
        ["**GRA**", "Sai thì khi kể chuyện; thiếu -s; toàn câu đơn", "Kể lại một việc hôm qua trong 1 phút, thu âm, nghe đếm lỗi thì; thêm 1 câu “, which…” và 1 câu if", "N1 · N15 · N17"],
        ["**P**", "AI ghi nhiều từ “không nghe rõ”; mất âm cuối", "Đọc lại khối phát âm của ngày có âm yếu nhất; tự chẩn 44 âm (Ngày 27)", "N1 · N27 + khối phát âm mỗi ngày"],
      ],
    },
    {
      t: "table",
      caption: "Phiếu so lần 1 – lần 2",
      head: ["", "Lần 1 (T2 N23)", "Lần 2 (hôm nay)", "Đích Tập 3"],
      rows: [
        ["FC", "…", "…", "6.0"],
        ["LR", "…", "…", "6.0"],
        ["GRA", "…", "…", "5.5 – 6.0"],
        ["P", "…", "…", "6.0"],
        ["Part 2 nói được", "… giây", "… giây", "≥ 1 phút 45"],
        ["Số lần im > 3 giây", "…", "…", "≤ 2"],
      ],
    },
    {
      t: "note",
      title: "📌 Sổ Speaking — ghi ngay sau buổi thi",
      items: [
        "Chép **3 câu AI sửa** mà bạn thấy “đúng là mình hay nói sai thế”. Ngày mai tự đóng vai giám khảo hỏi lại đúng 3 câu hỏi đó (cách dùng sổ Speaking, Ngày 2).",
        "Ghi **2 việc cần sửa** — ví dụ: “kể chuyện giữ thì quá khứ” và “Part 3 thêm mặt còn lại”. Đọc lại hai dòng này ngay trước buổi thi nói tiếp theo (lượt Speaking trong bộ Đề 5, hoặc Đề 6 đầu Tập 4).",
        "Điểm trung bình 4 tiêu chí ≥ 5.75 ⇒ làm tròn **band 6.0**: bạn đã đạt đích Speaking của Tập 3.",
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Phát âm: nhịp và nối âm trong idiom — đọc cả cụm một hơi" },
    {
      t: "p",
      text: "Idiom là **một khối**. Nếu đọc rời từng từ (a — piece — of — cake) thì nghe như đang đánh vần, và người nghe không nhận ra thành ngữ. Ba việc cần làm: (1) **nối** phụ âm cuối vào nguyên âm đầu (piece‿of · tip‿of · end‿of · hang‿of‿it); (2) đọc **yếu** các từ a / an / of / the / and thành /ə/, /ən/, /əv/, /ðə/; (3) **nhấn** vào danh từ cuối cụm (CAKE · MOON · LEG · DAY).",
    },
    {
      t: "table",
      caption: "Nối ở đâu — nhấn ở đâu",
      head: ["Idiom", "Nói liền", "Nhấn"],
      rows: [
        ["a piece of cake", "ə-pee-səv-**CAKE**", "cake"],
        ["cost an arm and a leg", "co-stə-**NARM**-ə-nə-**LEG**", "arm · leg"],
        ["once in a blue moon", "wʌn-sɪ-nə-bluː-**MOON**", "moon"],
        ["at the end of the day", "ət-ði-**EN**-dəv-ðə-**DAY**", "end · day"],
        ["get the hang of it", "get-ðə-**HANG**-ə-vɪt", "hang"],
      ],
    },
    {
      t: "phatam",
      id: "t3d30-phat-am",
      title: "Luyện phát âm — nhịp và nối âm trong idiom",
      note: "Đọc mỗi câu một hơi; từ ngữ pháp (a, an, of, the, and) đọc nhẹ. Máy chấm từng từ: chú ý âm cuối /s/ /k/ /d/ /ɡ/.",
      items: [
        { text: "It was a piece of cake.", ipa: "ɪt wəz ə piːs əv keɪk", vi: "Chuyện đó dễ ợt." },
        { text: "It costs an arm and a leg.", ipa: "ɪt kɒsts ən ɑːm ən ə leɡ", vi: "Nó đắt cắt cổ." },
        { text: "I was over the moon.", ipa: "aɪ wəz əʊvə ðə muːn", vi: "Tôi sướng phát điên." },
        { text: "I only go once in a blue moon.", ipa: "aɪ əʊnli ɡəʊ wʌns ɪn ə bluː muːn", vi: "Năm thì mười hoạ tôi mới đi." },
        { text: "I soon got the hang of it.", ipa: "aɪ suːn ɡɒt ðə hæŋ əv ɪt", vi: "Tôi quen tay khá nhanh." },
        { text: "It's just the tip of the iceberg.", ipa: "ɪts dʒʌst ðə tɪp əv ði aɪsbɜːɡ", vi: "Đó mới là phần nổi của tảng băng." },
        { text: "We don't always see eye to eye.", ipa: "wi dəʊnt ɔːlweɪz siː aɪ tə aɪ", vi: "Chúng tôi không phải lúc nào cũng hợp ý nhau." },
        { text: "At the end of the day, it's up to you.", ipa: "ət ði end əv ðə deɪ ɪts ʌp tə juː", vi: "Suy cho cùng, tuỳ bạn quyết định." },
      ],
    },
    {
      t: "rule",
      formula: "Khởi động 3 Part → soát 12 điều → thi một mạch 11 – 14 phút → đọc 4 tiêu chí → so với lần 1 → ghi 2 việc cần sửa",
      vi: "Mỗi lần thi với giám khảo AI chỉ có giá trị khi bạn ghi lại được hai việc cụ thể sẽ sửa ở lần sau.",
    },
  ],
};
/* ───────────────────────── Bài tập ───────────────────────── */
const D30_BAI_TAP: Lesson = {
  id: "t3d30-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 30 — 30 idiom · văn phong nói / viết · 30 bộ thẻ chủ đề · viết lại theo sổ lỗi · chuẩn bị giám khảo AI",
  goal: "Tự kiểm cả ngày bằng 36 câu có đáp án (idiom, đổi văn phong, từ theo chủ đề, sửa câu theo mã lỗi, chiến thuật thi nói) và một câu trả lời Part 3 ghi âm; đúng từ 26 câu trở lên là đạt — rồi làm bài kiểm tra chặng và Đề 5.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay",
      items: [
        "**Phần A** — idiom: 8 câu điền + 6 câu chọn câu tự nhiên.",
        "**Phần B** — đổi văn phong nói → viết: 4 câu.",
        "**Phần C** — ôn 30 bộ thẻ chủ đề: 6 câu.",
        "**Phần D** — viết lại theo mã lỗi: 6 câu.",
        "**Phần E** — thi nói: 6 câu chiến thuật + 1 lượt ghi âm Part 3.",
        "Đạt: ==≥ 26/36==. Xong thì làm **Kiểm tra chặng (Ngày 25 – 30)** ngay bên dưới, rồi **Đề 5** ở Online Test.",
      ],
    },

    { t: "h", text: "Phần A — 30 idiom (14 câu)" },
    {
      t: "quiz",
      id: "t3d30-bt-idiom-dien",
      title: "A1. Điền MỘT từ còn thiếu (8 câu)",
      kind: "fill",
      items: [
        { q: "Tickets for the concert cost an arm and a ___.", answers: ["leg"], hint: "đắt cắt cổ" },
        { q: "I'm feeling a bit under the ___ today, so I'll stay in bed.", answers: ["weather"], hint: "hơi mệt" },
        { q: "With rent rising every year, many young couples struggle to make ___ meet.", answers: ["ends"], hint: "đủ sống" },
        { q: "It took me a few weeks to learn the ___ at my new job.", answers: ["ropes"], hint: "quen việc" },
        { q: "We keep in ___ by video call every Sunday.", answers: ["touch"], hint: "giữ liên lạc" },
        { q: "Nurses were working around the ___ to look after the patients.", answers: ["clock"], hint: "suốt ngày đêm" },
        { q: "Failing that exam was a blessing in ___: it made me change to a subject I love.", answers: ["disguise"], hint: "trong rủi có may" },
        { q: "After a long day of lectures, I go for a run to let off ___.", answers: ["steam"], hint: "xả stress" },
      ],
    },
    {
      t: "mcq",
      id: "t3d30-bt-idiom-chon",
      title: "A2. Câu nào dùng idiom ĐÚNG và tự nhiên? (6 câu)",
      items: [
        { q: "Chọn câu đúng:", options: ["I see my cousins once in a blue moon.", "I see my cousins once in a blue month.", "I see my cousins one time in blue moon.", "I see my cousins once on a blue moon."], correct: 0, why: "Cố định: **once in a blue moon**." },
        { q: "Chọn câu đúng:", options: ["My flatmate's music get on my nerve.", "My flatmate's music gets on my nerves.", "My flatmate's music gets in my nerves.", "My flatmate's music is on my nerves."], correct: 1, why: "**get on sb's nerves** — chia gets, nerves số nhiều." },
        { q: "Chọn câu đúng:", options: ["I learned Japanese from the scratch.", "I learned Japanese by scratch.", "I learned Japanese from scratch.", "I learned Japanese from scratches."], correct: 2, why: "**from scratch** — không mạo từ." },
        { q: "Chọn câu trả lời Part 1 tự nhiên nhất cho “Do you like cooking?”", options: ["Cooking is a piece of cake, a double-edged sword and the best of both worlds.", "Yes. Piece of cake.", "I am over the moon about cooking around the clock.", "I do, actually. I had to learn from scratch when I moved out, but I soon got the hang of it."], correct: 3, why: "Hai idiom gắn với một câu chuyện thật, có giải thích. A – C nhồi hoặc sai nghĩa." },
        { q: "Chọn câu đúng:", options: ["My sister and I don't see eye to eye on politics.", "My sister and I don't see eyes to eyes about politics.", "My sister and I don't look eye to eye on politics.", "My sister and I aren't eye to eye in politics."], correct: 0, why: "**see eye to eye (on sth)**." },
        { q: "“A drop in the ocean” dùng đúng trong câu nào?", options: ["The exam was a drop in the ocean — I finished in ten minutes.", "The $100 donation is a drop in the ocean compared with the $2 million they need.", "I was a drop in the ocean when I heard the news.", "He is a drop in the ocean; he never does any exercise."], correct: 1, why: "= quá ít so với cần. A cần a piece of cake; C over the moon; D a couch potato." },
      ],
    },

    { t: "h", text: "Phần B — Nói thì idiom, viết thì trang trọng (4 câu)" },
    {
      t: "mcq",
      id: "t3d30-bt-register",
      title: "B. Chọn câu thay thế hợp với Writing Task 2 (4 câu)",
      items: [
        { q: "Childcare costs an arm and a leg.", options: ["Childcare costs a bomb.", "Childcare is a rip-off.", "Childcare is prohibitively expensive for many families.", "Childcare is super pricey."], correct: 2, why: "Trang trọng: **prohibitively / extremely expensive**." },
        { q: "At the end of the day, it's up to parents.", options: ["Ultimately, the responsibility lies with parents.", "When all is said and done, it's parents' business.", "In the end of the day, parents must do it.", "Basically, parents, right?"], correct: 0, why: "**Ultimately** + cụm danh từ trang trọng." },
        { q: "Banning plastic bags is just a drop in the ocean.", options: ["Banning plastic bags is a piece of cake.", "Banning plastic bags is peanuts.", "Banning plastic bags is the tip of the iceberg.", "Banning plastic bags alone will have only a minor effect on the problem."], correct: 3, why: "Diễn đạt nghĩa “quá ít so với cần” bằng từ thường." },
        { q: "People are fed up with the traffic.", options: ["People are sick and tired of the traffic.", "Residents are increasingly dissatisfied with traffic congestion.", "People can't stand the traffic any more.", "Everyone hates the traffic."], correct: 1, why: "**increasingly dissatisfied with** + danh từ học thuật (congestion)." },
      ],
    },

    { t: "h", text: "Phần C — 30 bộ thẻ chủ đề (6 câu)" },
    {
      t: "quiz",
      id: "t3d30-bt-chu-de",
      title: "C. Điền MỘT từ để hoàn thành cụm (6 câu)",
      kind: "fill",
      items: [
        { q: "(Housing) The government should build more affordable ___ for young families.", answers: ["housing", "homes"], hint: "bộ 18" },
        { q: "(Science) Universities should conduct more ___ into renewable energy.", answers: ["research"], hint: "bộ 21" },
        { q: "(Heritage) Tourism revenue can be used to preserve cultural ___.", answers: ["heritage"], hint: "bộ 22" },
        { q: "(Animals) The tiger is an endangered ___.", answers: ["species"], hint: "bộ 25" },
        { q: "(Energy) One day the world will run ___ of oil.", answers: ["out"], hint: "bộ 26" },
        { q: "(Phrasal verbs) The new policy brought ___ a sharp fall in smoking.", answers: ["about"], hint: "bộ 30" },
      ],
    },

    { t: "h", text: "Phần D — Viết lại theo mã lỗi (6 câu)" },
    {
      t: "p",
      text: "Mỗi câu có **hai lỗi** thuộc mã ghi trong ngoặc. Viết lại **cả câu** cho đúng.",
    },
    {
      t: "quiz",
      id: "t3d30-bt-viet-lai",
      title: "D. Sửa hai lỗi trong mỗi câu (6 câu)",
      kind: "translate",
      grammar: "Mã A · S · T · P · W · L · C (Ngày 2)",
      items: [
        { q: "(A + S) Government should build more school in rural areas.", answers: ["The government should build more schools in rural areas.", "Governments should build more schools in rural areas."], hint: "the government · schools" },
        { q: "(P + W) Parents should spend more time for their children instead of work late.", answers: ["Parents should spend more time with their children instead of working late."], hint: "spend time with · instead of + V-ing" },
        { q: "(T + P) In 2010, the figure is 20% and it rose to 35% on 2020.", answers: ["In 2010, the figure was 20% and it rose to 35% in 2020.", "In 2010, the figure was 20%, and it rose to 35% in 2020."], hint: "was · in 2020" },
        { q: "(S + W) The number of tourists are increasing rapid.", answers: ["The number of tourists is increasing rapidly."], hint: "The number … is · rapidly" },
        { q: "(L + C) Although online shopping is convenient, but it has some risks, for example fraud.", answers: ["Although online shopping is convenient, it has some risks, such as fraud.", "Although online shopping is convenient, it has some risks, for example, fraud.", "Online shopping is convenient, but it has some risks, such as fraud.", "Although online shopping is convenient, it has some risks, for example fraud.", "Although online shopping is convenient, it has some risks such as fraud."], hint: "bỏ but · such as fraud" },
        { q: "(A + S) The air pollution cause many health problem in big cities.", answers: ["Air pollution causes many health problems in big cities."], hint: "Ø Air pollution · causes · problems" },
      ],
    },

    { t: "h", text: "Phần E — Thi nói với giám khảo AI (6 câu + ghi âm)" },
    {
      t: "mcq",
      id: "t3d30-bt-noi",
      title: "E1. Chiến thuật thi nói band 6 (6 câu)",
      items: [
        { q: "Part 1 hỏi “Do you like your hometown?”. Câu trả lời tốt nhất dài:", options: ["Một từ: Yes.", "2 – 4 câu: trả lời thẳng + lý do + chi tiết nhỏ", "1 phút rưỡi", "Càng dài càng tốt"], correct: 1, why: "Part 1: 2 – 4 câu. Dài hơn sẽ bị ngắt, ngắn hơn không đủ để chấm." },
        { q: "Đang nói Part 2 thì quên từ “máy hút bụi”. Làm gì?", options: ["Im lặng nghĩ tới khi nhớ ra", "Nói từ tiếng Việt", "Bỏ luôn câu chuyện", "Tả vòng: “the machine you use to clean the floor” rồi nói tiếp"], correct: 3, why: "Paraphrase khi thiếu từ là kỹ năng được **cộng điểm** LR (Ngày 11)." },
        { q: "Bạn vừa nói “she go to…”. Tự sửa thế nào?", options: ["“she go — sorry, she went to…” rồi nói tiếp", "Xin lỗi dài và nói lại cả câu từ đầu", "Không bao giờ được sửa", "Dừng lại hỏi giám khảo dạng đúng"], correct: 0, why: "Sửa **một lần**, ngắn, rồi đi tiếp (Ngày 27)." },
        { q: "Part 3: “Why do people volunteer?” — mở đầu nào đúng mức band 6?", options: ["I volunteer every Sunday at…", "I don't know.", "I think there are two main reasons. The first is…", "Volunteer is good."], correct: 2, why: "Part 3 hỏi về **người ta nói chung**; khung 2 lý do (Ngày 6). A là trả lời kiểu Part 1." },
        { q: "Sau buổi thi với giám khảo AI, việc quan trọng nhất là:", options: ["Xem band tổng rồi đóng lại", "Thi lại ngay cùng đề cho điểm cao hơn", "Chép toàn bộ bản ghi", "Ghi 2 việc cần sửa + nói lại 3 câu AI đã sửa"], correct: 3, why: "Phản hồi chỉ có giá trị khi thành việc làm cụ thể." },
        { q: "Trong một câu trả lời Part 3, idiom nên:", options: ["Xuất hiện ở mọi câu", "Tối đa 1 cái, đúng nghĩa, có giải thích", "Không bao giờ dùng", "Đứng một mình thành một câu"], correct: 1, why: "Luật “1 idiom / câu trả lời” (bài 1)." },
      ],
    },
    {
      t: "speak",
      id: "t3d30-bt-noi-ghi-am",
      part: "3",
      questions: [
        "Is it better to give money to charity or to give your time? (To some extent… → lý do → ví dụ → That said…)",
        "Do you think technology has made people more helpful or less helpful to each other?",
      ],
    },
    {
      t: "note",
      title: "📌 Bạn vừa học xong 30 ngày của Tập 3 — việc tiếp theo",
      items: [
        "Làm **Kiểm tra chặng (Ngày 25 – 30)** — bài ngay sau bài tập này. Phần nào dưới 70 % thì ôn đúng Ngày được chỉ.",
        "Rồi mở **Online Test → Đề 5** — đề thi cuối Tập 3, mức band 6.0. Speaking bạn đã thi ở bài Nói hôm nay; làm nốt Listening · Reading · Writing một mạch, đúng giờ, không tra từ.",
        "Đạt band 6.0 ở Đề 5 (không kỹ năng nào dưới 5.5) ⇒ sang **Tập 4 (6.0 → 7.0)**. Chưa đạt ⇒ xem phiếu điểm, ôn chặng yếu nhất rồi thi lại sau 1 – 2 tuần.",
      ],
    },
  ],
};

/* ───────────────────────── Kiểm tra chặng (Ngày 25–30) ───────────────────────── */
const D30_KIEM_TRA: Lesson = {
  id: "t3d30-kiem-tra",
  kind: "review",
  title: "Kiểm tra chặng (Ngày 25–30)",
  goal: "Tự đo đã nắm chắc Ngày 25–30 của Tập 3 chưa — cụm danh từ và danh hoá, dấu câu và bảng tự soát, causative; từ vựng du lịch – ngôn ngữ – sách – từ dễ nhầm – idiom; Summary / Sentence completion và Passage 3; nghe Short answer và bẫy đổi ý; Task 1 quy trình, viết lại theo sổ lỗi; Part 2 đồ vật và fluency — mỗi phần đạt ≥ 70 %, phần nào trượt thì biết ôn Ngày nào trước khi thi Đề 5.",
  minutes: 165,
  blocks: [
    {
      t: "recap",
      title: "Bài kiểm tra chặng 5 — chặng cuối của Tập 3",
      items: [
        "Gom **6 ngày cuối** (Ngày 25 – 30): 8 phần — ngữ pháp · từ vựng · dịch · nghe · đọc · viết · nói · phát âm.",
        "Ngưỡng đạt: ==≥ 70 % từng phần==. Không cộng gộp — một phần trượt là một phần cần ôn.",
        "Làm **không mở bài cũ**, không tra từ. Phần Nghe: nghe **một lần**. Phần Đọc: bấm **20 phút**.",
        "Cuối bài có bảng “trượt phần nào ⇒ ôn Ngày nào”. Ôn xong mới thi **Đề 5** (thi cuối Tập 3) ở Online Test.",
        "Tổng thời gian khoảng 2 giờ 45 phút — có thể chia hai buổi: Phần 1 – 5 và Phần 6 – 8.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Chặng Ngày 25–30 đã học gì",
      center: "Ngày 25 – 30",
      branches: [
        { label: "**Ngữ pháp**", items: ["N25 cụm danh từ · danh hoá", "N27 dấu câu · 6 lượt soát", "N29 causative · 24 điểm"] },
        { label: "**Từ vựng**", items: ["N26 Travel & culture", "N28 Language · Books · từ dễ nhầm", "N30 30 idiom · 30 bộ thẻ"] },
        { label: "**Đọc**", items: ["N25 Summary · Sentence", "N27 3 passage 60 phút", "N29 Passage 3 · 900 từ / 20 phút"] },
        { label: "**Nghe**", items: ["N25 Part 3 + 4 · 5 loại bẫy", "N28 Part 2 + 4 · Short answer", "N29 đề 40 câu"] },
        { label: "**Viết**", items: ["N26 báo cáo ngắn · 7 dạng Task 1", "N28 process · map band 6", "N30 viết lại theo sổ lỗi"] },
        { label: "**Nói**", items: ["N26 Part 2 đồ vật · đề lạ", "N27 fluency · tự sửa", "N30 giám khảo AI lần 2"] },
      ],
    },
    {
      t: "table",
      caption: "Tám phần — số câu và ngưỡng đạt",
      head: ["Phần", "Số câu", "Đạt", "Thời gian"],
      rows: [
        ["1. Ngữ pháp", "15 + 9", "≥ 17/24", "20 phút"],
        ["2. Từ vựng", "12 + 6", "≥ 13/18", "12 phút"],
        ["3. Dịch Việt → Anh", "6", "≥ 5/6", "8 phút"],
        ["4. Nghe", "6 + 7", "≥ 9/13", "10 phút"],
        ["5. Đọc", "13", "≥ 9/13", "20 phút"],
        ["6. Viết", "6 + Task 1 + Task 2", "≥ 5/6 · AI ≥ 5.5", "65 phút"],
        ["7. Nói", "Part 2 + 3 câu Part 3", "AI ≥ 5.5", "12 phút"],
        ["8. Phát âm", "8", "≥ 6/8", "6 phút"],
      ],
    },

    /* ── Phần 1 ── */
    { t: "h", text: "Phần 1 — Ngữ pháp (15 + 9 câu · đạt ≥ 17/24 · trượt thì ôn Ngày 25, 27, 29)" },
    {
      t: "mcq",
      id: "t3d30-kt-ngu-phap-chon",
      title: "1a. Chọn đáp án đúng (15 câu)",
      items: [
        { q: "The number of people working from home ___ sharply since 2020.", options: ["have risen", "has risen", "are rising", "rise"], correct: 1, why: "Danh từ chính là **The number** (số ít) ⇒ **has risen** (N25)." },
        { q: "Chọn cụm danh từ đúng trật tự:", options: ["a government five-year plan new", "a five-years new government plan", "a new five-year government plan", "a plan five-year government new"], correct: 2, why: "từ hạn định + adj + (số-N số ít) + N bổ nghĩa + N chính: **a new five-year government plan** (N25)." },
        { q: "There was ___ the number of visitors last year.", options: ["a sharp rise in", "a sharply rise of", "a sharp rising on", "sharp rise at"], correct: 0, why: "Danh hoá: **a + adj + rise + in** + thứ thay đổi (N25)." },
        { q: "Exports saw a rise ___ 12% between 2015 and 2020.", options: ["in", "at", "by", "of"], correct: 3, why: "**of** + con số; **in** + thứ thay đổi: a rise **of** 12% **in** exports (N25)." },
        { q: "The ___ of free bus travel led to a fall in car use.", options: ["introduce", "introduction", "introducing of", "introduced"], correct: 1, why: "the + danh từ danh hoá + of: **the introduction of** (N25)." },
        { q: "Câu nào chấm câu ĐÚNG?", options: ["Fuel prices rose, many people stopped driving.", "Fuel prices rose many people stopped driving.", "Fuel prices rose, so many people stopped driving.", "Fuel prices rose, therefore many people stopped driving."], correct: 2, why: "Hai mệnh đề độc lập: **, so** (liên từ). A và D là comma splice; B là run-on (N27)." },
        { q: "Câu nào ĐÚNG?", options: ["Many people believe, that cars should be banned.", "Many people believe that, cars should be banned.", "Many people, believe that cars should be banned.", "Many people believe that cars should be banned."], correct: 3, why: "Không đặt dấu phẩy trước / sau **that** của mệnh đề danh ngữ, cũng không tách chủ ngữ khỏi động từ (N27)." },
        { q: "The course teaches students to plan a budget, ___ and to manage their time.", options: ["to cook simple meals", "cooking simple meals", "they cook simple meals", "cook of simple meals"], correct: 0, why: "Song song: to plan…, **to cook**… and to manage… (N27)." },
        { q: "Câu nào KHÔNG bị “dangling modifier”?", options: ["Walking to school, the rain started.", "Walking to school, I got caught in the rain.", "Walking to school, my bag got wet.", "Walking to school, it began to rain."], correct: 1, why: "Chủ ngữ của mệnh đề chính phải là người **đang đi**: **I** (N27)." },
        { q: "Prices rose sharply ___ as a result, sales fell.", options: [",", "and,", ";", ":,"], correct: 2, why: "Trước trạng từ nối (as a result, however) dùng **chấm phẩy** hoặc dấu chấm (N27)." },
        { q: "I ___ last week — it looks much better now.", options: ["had my hair cut", "had cut my hair by the barber", "cut my hair at the salon", "had my hair to cut"], correct: 0, why: "Nhờ dịch vụ: **had + my hair + cut** (N29)." },
        { q: "Our teacher made us ___ the essay three times.", options: ["to rewrite", "rewriting", "rewritten", "rewrite"], correct: 3, why: "**make + O + V** không to (N29)." },
        { q: "Students ___ to leave the campus during lunch.", options: ["are not let", "are not allowed", "do not allow", "are not allow"], correct: 1, why: "let không có bị động ⇒ **are not allowed to** (N29)." },
        { q: "How can we get more people ___ public transport?", options: ["use", "used", "to use", "using"], correct: 2, why: "**get + người + to V** (N29)." },
        { q: "The roof is leaking. It needs ___.", options: ["to repair", "repair", "repaired", "repairing"], correct: 3, why: "Vật + **need + V-ing** = need to be repaired (N29)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-kt-ngu-phap-dien",
      title: "1b. Viết dạng đúng của từ trong ngoặc / điền MỘT từ (9 câu)",
      kind: "fill",
      items: [
        { q: "There has been a steady ___ (grow) in online sales.", answers: ["growth"], hint: "N25 — danh hoá" },
        { q: "The ___ (reduce) of working hours improved staff health.", answers: ["reduction"], hint: "N25 — danh hoá" },
        { q: "The quality of the roads in rural areas ___ (be) very poor. (hiện tại)", answers: ["is"], hint: "N25 — chia theo danh từ chính quality" },
        { q: "There was a dramatic fall ___ the number of smokers. (giới từ)", answers: ["in"], hint: "N25 — a fall in + thứ thay đổi" },
        { q: "She enjoys reading, swimming and ___ (cook).", answers: ["cooking"], hint: "N27 — song song" },
        { q: "Each of the students ___ (have) a personal tutor. (hiện tại)", answers: ["has"], hint: "N27 — each of + số nhiều + V số ít" },
        { q: "We had the documents ___ (translate) into English.", answers: ["translated"], hint: "N29 — have + vật + V3" },
        { q: "The children were made ___ (apologise) to their neighbour.", answers: ["to apologise", "to apologize"], hint: "N29 — be made + to V" },
        { q: "The Internet enables people ___ (learn) at any time.", answers: ["to learn"], hint: "N29 — enable + O + to V" },
      ],
    },

    /* ── Phần 2 ── */
    { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 26, 28, 30)" },
    {
      t: "mcq",
      id: "t3d30-kt-tu-vung-chon",
      title: "2a. Chọn từ đúng (12 câu)",
      items: [
        { q: "(Travel) The old town has become a tourist ___: overpriced, crowded and not very authentic.", options: ["trick", "trap", "track", "trade"], correct: 1, why: "**a tourist trap** = điểm “chặt chém” du khách (N26)." },
        { q: "(Culture) Visitors should learn the local ___ first — for example, taking off their shoes before entering a home.", options: ["customs", "costumes", "customers", "custody"], correct: 0, why: "**customs** = phong tục (N26); costumes = trang phục, customers = khách hàng." },
        { q: "(Language) Vietnamese is my mother ___.", options: ["speech", "language's", "tongue", "voice"], correct: 2, why: "**mother tongue** = tiếng mẹ đẻ (N28)." },
        { q: "(Language) Children who grow up with two languages become ___.", options: ["literate", "fluently", "native", "bilingual"], correct: 3, why: "**bilingual** = song ngữ (N28)." },
        { q: "(Books) I prefer ___ — novels and short stories — to books about real events.", options: ["non-fiction", "fiction", "biography", "manuals"], correct: 1, why: "**fiction** = truyện hư cấu; non-fiction = sách về sự thật (N28)." },
        { q: "(Từ dễ nhầm) Lack of sleep can seriously ___ your concentration.", options: ["affect", "effect", "effective", "affection"], correct: 0, why: "**affect** (v) — effect (n): have an effect on (N28)." },
        { q: "(Từ dễ nhầm) The government plans to ___ taxes next year.", options: ["rise", "arise", "raise", "risen"], correct: 2, why: "**raise + tân ngữ** (ai đó nâng); **rise** không có tân ngữ: taxes will rise (N28)." },
        { q: "(Từ dễ nhầm) The country is facing a serious ___ crisis.", options: ["economical", "economy", "economics", "economic"], correct: 3, why: "**economic** = thuộc kinh tế; economical = tiết kiệm (N28)." },
        { q: "(Idiom) I only go to the theatre once in a blue ___.", options: ["sky", "moon", "sun", "star"], correct: 1, why: "**once in a blue moon** (N30)." },
        { q: "(Idiom) Online learning is a double-edged ___: it is flexible but lonely.", options: ["sword", "knife", "coin", "blade"], correct: 0, why: "**a double-edged sword** (N30)." },
        { q: "(Idiom) After two weeks I finally got the ___ of the new software.", options: ["hand", "hold", "hang", "habit"], correct: 2, why: "**get the hang of** (N30)." },
        { q: "(Văn phong) Câu nào hợp với Task 2?", options: ["Flats here cost an arm and a leg.", "Flats here are a rip-off.", "Flats here are crazy expensive.", "Housing here is unaffordable for most young people."], correct: 3, why: "Không dùng idiom trong bài viết học thuật (N30)." },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-kt-tu-vung-dang",
      title: "2b. Điền MỘT từ (6 câu)",
      kind: "fill",
      items: [
        { q: "Smoking has a harmful ___ on health. (affect / effect)", answers: ["effect"], hint: "N28 — have an effect on" },
        { q: "House prices ___ by 10% last year. (rise / raise — quá khứ)", answers: ["rose"], hint: "N28 — rise – rose – risen" },
        { q: "A small car is more ___ than a big one because it uses less fuel. (economic / economical)", answers: ["economical"], hint: "N28 — tiết kiệm" },
        { q: "Many families struggle to make ends ___.", answers: ["meet"], hint: "N30" },
        { q: "The problems we know about are just the tip of the ___.", answers: ["iceberg"], hint: "N30" },
        { q: "My host family made me feel at ___ from the first day.", answers: ["home"], hint: "N30" },
      ],
    },

    /* ── Phần 3 ── */
    { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
    {
      t: "quiz",
      id: "t3d30-kt-dich",
      title: "3. Dịch sang tiếng Anh",
      kind: "translate",
      grammar: "N25 cụm danh từ · N27 dấu câu · N29 causative · N30 idiom",
      items: [
        { q: "Đã có một sự tăng mạnh về số lượng khách du lịch.", answers: ["There has been a sharp rise in the number of tourists.", "There has been a sharp increase in the number of tourists.", "There was a sharp rise in the number of tourists.", "There was a sharp increase in the number of tourists."], hint: "There has been a sharp rise in the number of…" },
        { q: "Số lượng xe hơi trong thành phố đang tăng.", answers: ["The number of cars in the city is increasing.", "The number of cars in the city is rising.", "The number of cars in the city is growing."], hint: "The number of … is (số ít)" },
        { q: "Giá tăng, vì vậy người ta mua ít hơn. (một câu, dùng so)", answers: ["Prices rose, so people bought less.", "Prices increased, so people bought less.", "Prices went up, so people bought less."], hint: "…, so … (dấu phẩy trước so)" },
        { q: "Tôi vừa đem điện thoại đi sửa.", answers: ["I have just had my phone repaired.", "I've just had my phone repaired.", "I have just had my phone fixed.", "I've just had my phone fixed.", "I have just got my phone repaired.", "I've just got my phone fixed.", "I have just got my phone fixed.", "I've just got my phone repaired."], hint: "have just had + my phone + V3" },
        { q: "Học sinh nên được phép chọn môn học của mình.", answers: ["Students should be allowed to choose their subjects.", "Students should be allowed to choose their own subjects."], hint: "should be allowed + to V" },
        { q: "Thuê nhà ở trung tâm thành phố đắt cắt cổ. (văn nói — dùng idiom)", answers: ["Renting a flat in the city centre costs an arm and a leg.", "Renting a house in the city centre costs an arm and a leg.", "Rent in the city centre costs an arm and a leg.", "Renting in the city centre costs an arm and a leg.", "Renting a flat in the city center costs an arm and a leg.", "Renting a house in the city center costs an arm and a leg.", "Rent in the city center costs an arm and a leg."], hint: "… costs an arm and a leg" },
      ],
    },

    /* ── Phần 4 ── */
    { t: "h", text: "Phần 4 — Nghe (6 + 7 câu · đạt ≥ 9/13 · trượt thì ôn Ngày 25, 28, 29)" },
    {
      t: "p",
      text: "Hai bản ghi, mỗi bản nghe **một lần**. Đọc câu hỏi 30 giây trước khi bấm. **Recording 1** (kiểu Part 2, giọng Úc): Short-answer questions — trả lời bằng **NO MORE THAN TWO WORDS AND/OR A NUMBER**.",
    },
    {
      t: "table",
      caption: "Questions 1–6 — Answer the questions",
      head: ["#", "Question"],
      rows: [
        ["1", "How long will today's tour last?"],
        ["2", "Where will the tour end?"],
        ["3", "In which year was the tower completed?"],
        ["4", "What must visitors NOT use inside the cathedral?"],
        ["5", "Which place does the guide recommend for the break?"],
        ["6", "Where should people wait if they lose the group?"],
      ],
    },
    {
      t: "listen",
      id: "t3d30-kt-nghe-tham-quan",
      title: "Recording 1 — A walking tour",
      note: "Nghe MỘT lần. Giọng Úc. Chú ý chỗ người nói tự sửa.",
      dan: { so: "Day 30, Checkpoint Recording 1 (Listening Part 2)", boiCanh: "a guide talking to a group of tourists at the start of a walking tour.", cau: [1, 6] },
      lines: [
        { who: "Guide", voice: "au-nam", text: "Good morning, everyone, and welcome to the Old Town walking tour. My name's Ben. Before we set off, a few practical points." },
        { who: "Guide", voice: "au-nam", text: "The tour usually takes two hours, but today it'll be about three hours, because the cathedral is open and we can go inside. And we'll finish, not back here at the tourist office, but at the fish market, which is a great place for lunch." },
        { who: "Guide", voice: "au-nam", text: "Our first stop is the clock tower. It was built in 1764 — sorry, let me correct that. The tower was finished in 1746; 1764 is when the clock itself was added." },
        { who: "Guide", voice: "au-nam", text: "From there we walk along the river to the cathedral. You don't need to pay to go in, and you're welcome to take photographs, but please don't use a flash, because it damages the paintings." },
        { who: "Guide", voice: "au-nam", text: "After the cathedral there's a fifteen-minute break in Market Square. There's a café there, but I'd recommend the bakery on the corner instead — it's cheaper, and their apple cake is famous." },
        { who: "Guide", voice: "au-nam", text: "Two last things. Parts of the old town have very uneven stone streets, so I hope you're all wearing comfortable shoes. And if you get separated from the group, don't try to find us. Just go to the fountain in Market Square and wait there — I walk past it every twenty minutes or so." },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-kt-nghe-tham-quan-cau",
      title: "Questions 1–6 — NO MORE THAN TWO WORDS AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "1. How long will today's tour last?", answers: ["3 hours", "three hours", "about 3 hours", "about three hours"] },
        { q: "2. Where will the tour end?", answers: ["fish market", "the fish market"] },
        { q: "3. In which year was the tower completed?", answers: ["1746", "in 1746"] },
        { q: "4. What must visitors NOT use inside the cathedral?", answers: ["flash", "a flash", "the flash"] },
        { q: "5. Which place does the guide recommend for the break?", answers: ["bakery", "the bakery", "a bakery"] },
        { q: "6. Where should people wait if they lose the group?", answers: ["fountain", "the fountain"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích Recording 1",
      items: [
        "**1 three hours** — “usually takes **two** hours, **but today**… about **three** hours”: thông tin sau cùng.",
        "**2 fish market** — “**not** back here at the tourist office, **but** at the fish market”.",
        "**3 1746** — người nói **tự sửa**: 1764 là năm lắp đồng hồ; tháp xong năm **1746** (bẫy đổi ý, N25).",
        "**4 flash** — được chụp ảnh, **không** được dùng flash. Câu hỏi có NOT — đọc kỹ đề.",
        "**5 bakery** — café được nhắc trước rồi bị gạt: “I'd recommend the **bakery**… **instead**”.",
        "**6 fountain** — “go to the **fountain** in Market Square and wait there”. “Market Square fountain” là 3 từ ⇒ quá giới hạn; chỉ ghi fountain.",
      ],
    },
    {
      t: "p",
      text: "**Recording 2** (kiểu Part 3, giọng Mỹ + Anh): hai sinh viên bàn về kết quả một khảo sát thói quen đọc sách. **Questions 7 – 10**: chọn A, B hoặc C. **Questions 11 – 13**: hoàn thành câu, **ONE WORD ONLY**.",
    },
    {
      t: "listen",
      id: "t3d30-kt-nghe-khao-sat",
      title: "Recording 2 — A survey of reading habits",
      note: "Nghe MỘT lần. Amy (giọng Mỹ) và Tom (giọng Anh).",
      dan: { so: "Day 30, Checkpoint Recording 2 (Listening Part 3)", boiCanh: "two students, Amy and Tom, discussing the results of a survey on students' reading habits.", cau: [7, 13] },
      lines: [
        { who: "Amy", voice: "us-nu", text: "Tom, have you looked at the results of our reading survey yet?" },
        { who: "Tom", voice: "uk-nam", text: "I have. The big surprise for me was the format question. I was sure most students would say they read e-books now." },
        { who: "Amy", voice: "us-nu", text: "Me too. But nearly two-thirds still prefer printed books. E-books came second, and audiobooks were a long way behind." },
        { who: "Tom", voice: "uk-nam", text: "Why do you think that is? Price?" },
        { who: "Amy", voice: "us-nu", text: "That's not what they said. Second-hand paperbacks and e-books cost about the same. The most common reason was that they spend all day looking at a screen and they want a rest from it." },
        { who: "Tom", voice: "uk-nam", text: "That makes sense. And what stops them reading more? I guessed it would be social media." },
        { who: "Amy", voice: "us-nu", text: "It came up, but the top answer was coursework. They say that after reading textbooks all week, they have no energy left for novels." },
        { who: "Tom", voice: "uk-nam", text: "OK. So, for the presentation — shall we start with the methodology?" },
        { who: "Amy", voice: "us-nu", text: "I'd rather not. People switch off if you begin with method. Let's open with one striking figure, and then explain how we got it." },
        { who: "Tom", voice: "uk-nam", text: "Fine — the two-thirds figure, then. Now, the slides. I think we need a chart for the format question." },
        { who: "Amy", voice: "us-nu", text: "Agreed, a simple pie chart. And for the reasons, let's use short quotations from the students instead of another graph." },
        { who: "Tom", voice: "uk-nam", text: "Good idea. One problem: we only have ten minutes, and the section on genres is very long." },
        { who: "Amy", voice: "us-nu", text: "Then let's put the genre table in the handout and just mention it." },
        { who: "Tom", voice: "uk-nam", text: "Great. I'll make the handout tonight." },
      ],
    },
    {
      t: "mcq",
      id: "t3d30-kt-nghe-khao-sat-chon",
      title: "Questions 7–10 — A, B or C",
      items: [
        { q: "7. What surprised both students?", options: ["Most students prefer printed books.", "Audiobooks are more popular than e-books.", "Fewer students read than they expected."], correct: 0, why: "Cả hai **tưởng** là e-book; “nearly two-thirds still prefer **printed books**”. Audiobook đứng cuối." },
        { q: "8. What is the main reason for this preference?", options: ["Printed books are cheaper.", "Printed books are easier to borrow.", "Students want a break from screens."], correct: 2, why: "Giá: “That's **not** what they said… cost about the same”; “they **want a rest from** [a screen]”." },
        { q: "9. What mainly prevents students from reading for pleasure?", options: ["social media", "coursework", "part-time jobs"], correct: 1, why: "Social media “came up, **but** the top answer was **coursework**”." },
        { q: "10. How will they begin the presentation?", options: ["by explaining their method", "with a quotation from a student", "with a surprising statistic"], correct: 2, why: "“I'd rather not [start with methodology]… open with **one striking figure**”. Quotation dùng cho phần lý do, không phải mở đầu." },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-kt-nghe-khao-sat-dien",
      title: "Questions 11–13 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "11. The results of the format question will be shown in a pie ___.", answers: ["chart"] },
        { q: "12. The reasons will be presented using short ___ from students.", answers: ["quotations"] },
        { q: "13. The table about genres will be put in the ___.", answers: ["handout"] },
      ],
    },

    /* ── Phần 5 ── */
    { t: "h", text: "Phần 5 — Đọc (5 + 3 + 3 + 2 câu · đạt ≥ 9/13 · 20 phút · trượt thì ôn Ngày 25, 27, 29)" },
    {
      t: "p",
      text: "Bấm **20 phút**. Hai phút đầu đọc bố cục và ghi bản đồ đoạn (Ngày 29). Summary và Sentence completion lấy từ **nguyên văn trong bài** (Ngày 25).",
    },
    {
      t: "passage",
      title: "The Return of the Doorstep Bottle",
      paras: [
        { label: "A", text: "Fifty years ago, most households in Britain began the day with a bottle of milk on the doorstep, delivered before dawn by a small electric van known as a milk float. Over the following decades the service almost disappeared. Supermarkets sold milk in plastic containers at prices that delivery firms could not match, and as more families bought large fridges, a weekly shop replaced the daily delivery. One dairy after another closed its rounds, arguing that they no longer covered their costs." },
        { label: "B", text: "Yet the doorstep bottle has returned. Since the late 2010s, several delivery companies have reported sharp increases in customer numbers, and some have hired new staff for the first time in decades. Most of the new customers are younger than the traditional ones, and many order through an app rather than by leaving a note in an empty bottle." },
        { label: "C", text: "Three developments explain this revival. The first is concern about plastic waste: a glass bottle can be washed and refilled many times, and television documentaries about plastic in the oceans persuaded many viewers to change their habits. The second is convenience, since customers can now pause or change a delivery in a matter of seconds. The third is trust: many rounds sell milk from farms in the same county, so buyers know exactly where their food comes from." },
        { label: "D", text: "It would be a mistake, however, to assume that the revival will continue without difficulty. Glass bottles are heavy, so a van carries fewer of them and uses more energy on each round. Every bottle must also be collected, taken back to the dairy and cleaned, which adds labour at each stage. Customers are not always careful either, and a bottle that is broken or thrown away has to be replaced. Demand is not the main limit — some rounds even have waiting lists. The real obstacle is finding drivers who are willing to start work at three o'clock in the morning." },
        { label: "E", text: "In my view, doorstep delivery will remain a small service rather than a serious rival to the supermarket. Even so, its return shows that a habit once written off as old-fashioned can attract new customers when people's values change." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1 – 5.** Complete the summary. Choose **ONE WORD ONLY** from the passage for each answer.",
    },
    {
      t: "p",
      text: "Doorstep milk delivery declined because supermarkets sold cheaper milk and families bought bigger **(1) ___**, and dairies said their rounds no longer covered their **(2) ___**. The revival has three causes. Many people now worry about **(3) ___** waste; a delivery can be changed in a matter of **(4) ___**; and buyers trust milk that comes from local **(5) ___**.",
    },
    {
      t: "quiz",
      id: "t3d30-kt-doc-tom-tat",
      title: "Questions 1–5 — Summary (ONE WORD ONLY)",
      kind: "fill",
      items: [
        { q: "1. families bought bigger ___", answers: ["fridges"] },
        { q: "2. no longer covered their ___", answers: ["costs"] },
        { q: "3. worry about ___ waste", answers: ["plastic"] },
        { q: "4. changed in a matter of ___", answers: ["seconds"] },
        { q: "5. milk that comes from local ___", answers: ["farms"] },
      ],
    },
    {
      t: "quiz",
      id: "t3d30-kt-doc-cau",
      title: "Questions 6–8 — Sentence completion (NO MORE THAN TWO WORDS from the passage)",
      kind: "fill",
      items: [
        { q: "6. Every bottle has to be returned to the ___ to be cleaned.", answers: ["dairy"] },
        { q: "7. Bottles that customers break or throw away must be ___.", answers: ["replaced"] },
        { q: "8. According to the writer, the main difficulty is finding drivers who will start work at ___ in the morning.", answers: ["three o'clock", "3 o'clock", "three o’clock", "3 o’clock"] },
      ],
    },
    {
      t: "mcq",
      id: "t3d30-kt-doc-ynng",
      title: "Questions 9–11 — Yes / No / Not Given (theo quan điểm tác giả)",
      items: [
        { q: "9. A lack of demand is the main threat to doorstep delivery.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn D: “**Demand is not the main limit**… The real obstacle is finding drivers…” ⇒ NO." },
        { q: "10. The growth of doorstep delivery may run into problems.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “It would be **a mistake**… to assume that the revival will continue **without difficulty**” ⇒ YES." },
        { q: "11. Supermarkets ought to sell more milk in glass bottles.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói siêu thị bán sữa trong hộp nhựa (đoạn A); tác giả **không** nêu siêu thị nên làm gì ⇒ NOT GIVEN." },
      ],
    },
    {
      t: "mcq",
      id: "t3d30-kt-doc-chon",
      title: "Questions 12–13 — Multiple choice",
      items: [
        { q: "12. According to paragraph D, why does each delivery round use more energy?", options: ["The bottles are washed in hot water.", "Heavy bottles mean each van carries a smaller load.", "Rounds now cover more homes than before.", "Too few customers order milk."], correct: 1, why: "“Glass bottles are **heavy**, so a van **carries fewer of them** and **uses more energy** on each round.” A: bài có nói rửa chai nhưng không nói về năng lượng; C không được nói; D bị bác (“Demand is not the main limit”)." },
        { q: "13. What is the writer's main point in paragraph E?", options: ["Doorstep delivery will soon replace supermarkets.", "Old-fashioned habits cannot survive.", "Dairies were wrong to close their rounds.", "An old habit can win customers back when people's values change."], correct: 3, why: "“a habit once written off as old-fashioned **can attract new customers when people's values change**”. A trái với “rather than a serious rival to the supermarket”; C tác giả không nhận xét." },
      ],
    },
    {
      t: "note",
      title: "Giải thích Phần 5 (câu 1–8)",
      items: [
        "**1 fridges** — A: “as more families bought **large fridges**, a weekly shop replaced the daily delivery”. bigger = large.",
        "**2 costs** — A: “they no longer **covered their costs**”. **3 plastic** — C: “concern about **plastic** waste” (concern → worry about).",
        "**4 seconds** — C: “pause or change a delivery **in a matter of seconds**”. **5 farms** — C: “milk from **farms** in the same county” (same county → local).",
        "**6 dairy** — D: “collected, **taken back to the dairy** and cleaned” (taken back → returned). **7 replaced** — D: “a bottle that is broken or thrown away **has to be replaced**”.",
        "**8 three o'clock** — D: “The **real obstacle** is finding drivers who are willing to start work at **three o'clock** in the morning” (real obstacle → main difficulty). Bẫy: “Demand is not the main limit” đứng ngay trước.",
      ],
    },

    /* ── Phần 6 ── */
    { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 26, 28, 30)" },
    {
      t: "mcq",
      id: "t3d30-kt-viet-chon",
      title: "6a. Kiến thức viết band 6 (6 câu · đạt ≥ 5/6)",
      items: [
        { q: "Overview của một bài **process** (quy trình) nên nêu:", options: ["Số bước, điểm bắt đầu và điểm kết thúc của quy trình", "Chi tiết của bước 1", "Ý kiến của bạn về quy trình", "Nguyên nhân vì sao cần quy trình"], correct: 0, why: "Process không có số liệu: overview = **bao nhiêu giai đoạn, từ đâu tới đâu** (N28)." },
        { q: "Thì và thể chủ đạo khi tả quy trình sản xuất:", options: ["Quá khứ đơn chủ động", "Tương lai đơn", "Hiện tại đơn bị động (is collected, are sorted)", "Hiện tại hoàn thành tiếp diễn"], correct: 2, why: "Quy trình lặp lại ⇒ hiện tại đơn; không cần biết ai làm ⇒ bị động (N28 · N13)." },
        { q: "Bài **map** có hai mốc quá khứ và một mốc hiện tại. Dùng thì nào?", options: ["Toàn bộ hiện tại đơn", "Toàn bộ tương lai", "Chỉ quá khứ hoàn thành", "Quá khứ đơn cho thay đổi giữa hai mốc cũ; hiện tại hoàn thành cho thay đổi tới nay"], correct: 3, why: "Mỗi mốc một thì (N28)." },
        { q: "Trong 7 dạng Task 1, dạng nào KHÔNG có số liệu nên không dùng rise / fall?", options: ["Line graph và bar chart", "Process và map", "Pie chart và table", "Mixed charts"], correct: 1, why: "Process tả các bước, map tả thay đổi vị trí — không phải xu hướng số liệu (N26 ôn 7 dạng)." },
        { q: "Khi viết lại một bài cũ, thứ tự đúng là:", options: ["Sửa ý → sửa câu", "Chép lại → nộp AI", "Sửa câu theo mã → sửa ý theo đề → viết lại trọn bài", "Đổi đề cho dễ hơn"], correct: 2, why: "Câu trước, ý sau (N2 · N30)." },
        { q: "Bài Task 1 cũ của bạn có câu “I think the government should recycle more.” Khi viết lại:", options: ["Xoá — Task 1 không nêu ý kiến hay khuyến nghị", "Giữ làm kết bài", "Chuyển lên overview", "Đổi thành In my opinion"], correct: 0, why: "Task 1 chỉ tả; ý kiến làm tụt TA (N30)." },
      ],
    },
    {
      t: "p",
      text: "**6b. Task 1 (20 phút, ≥ 150 chữ).** The diagram below shows how fresh rice noodles are made in a small factory. (Quy trình KHÁC bài mẫu giấy tái chế và sơ đồ trà của Ngày 28 — bạn phải tự viết, không chép khung câu có sẵn.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "How fresh rice noodles are made",
      caption: "Sơ đồ quy trình cho đề 6b (tự soạn, giản lược).",
      steps: [
        { label: "**1. Soaking**", sub: "rice soaked in water for 6–8 hours → grains soften" },
        { label: "**2. Grinding**", sub: "soaked rice ground with water by machine → smooth white batter" },
        { label: "**3. Steaming**", sub: "thin layer of batter spread on a cloth over boiling water; steamed for 1 minute" },
        { label: "**4. Drying**", sub: "sheets lifted off and laid on bamboo racks; dried in the sun for 2–3 hours" },
        { label: "**5. Cutting**", sub: "sheets cut into long thin strips by machine" },
        { label: "**6. Packing**", sub: "noodles weighed and packed in plastic bags → delivered to markets and restaurants" },
      ],
    },
    {
      t: "essay",
      id: "t3d30-kt-viet-task1",
      task: "Task 1",
      prompt: "The diagram shows how fresh rice noodles are made in a small factory, in six stages: (1) Soaking — rice is soaked in water for 6–8 hours so that the grains soften; (2) Grinding — the soaked rice is ground with water by machine into a smooth white batter; (3) Steaming — a thin layer of batter is spread on a cloth over boiling water and steamed for one minute; (4) Drying — the sheets are lifted off, laid on bamboo racks and dried in the sun for 2–3 hours; (5) Cutting — the sheets are cut into long thin strips by machine; (6) Packing — the noodles are weighed, packed in plastic bags and delivered to markets and restaurants. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      minWords: 150,
      tips: [
        "Mở bài: paraphrase đề (illustrates the process by which…).",
        "Overview (N28): loại quy trình (linear, man-made) + số giai đoạn + bắt đầu bằng… + kết thúc bằng… — không số liệu.",
        "Thân bài: hiện tại đơn bị động + từ nối trình tự; nêu mục đích của bước khi có thể (so that the grains soften); gộp bước bằng After being… / before being… (N28 mục 4); chỉ dùng số có trong hình (6–8 hours, one minute).",
        "Không ý kiến, không đánh giá món ăn, không thêm bước ngoài hình.",
      ],
    },
    {
      t: "p",
      text: "**6c. Task 2 (40 phút, ≥ 250 chữ).** Viết bài bên dưới, rồi tự soát bằng **hai lượt “của mình”** trước khi nộp.",
    },
    {
      t: "essay",
      id: "t3d30-kt-viet-task2",
      task: "Task 2",
      prompt: "Some people believe that reading printed books is a better way to learn than reading on screens. Others think that digital reading has more advantages. Discuss both views and give your own opinion. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Đếm vế: quan điểm 1 (sách in) · quan điểm 2 (đọc trên màn hình) · ý kiến của bạn — thiếu một vế là tụt TR.",
        "Mỗi thân bài: 1 ý chính + hệ quả (, which means…) + ví dụ cụ thể.",
        "Dùng ít nhất một cụm danh từ danh hoá (a sharp rise in the use of e-readers) và một câu causative (enable students to…).",
        "Không dùng idiom. Soát theo hai mã mục tiêu trong sổ lỗi.",
      ],
    },

    /* ── Phần 7 ── */
    { t: "h", text: "Phần 7 — Nói (Part 2 + 3 câu Part 3 · AI ≥ band 5.5 · trượt thì ôn Ngày 26, 27, 30)" },
    {
      t: "p",
      text: "Thẻ Part 2 thuộc nhóm **đồ vật** (Ngày 26): chuẩn bị 1 phút bằng từ khoá, nói gần 2 phút. Sau đó trả lời 3 câu Part 3 — mỗi câu 4 – 6 câu theo khung “ý kiến có mức độ → lý do → ví dụ → mặt còn lại”. Khi ghi âm, áp **luật 3 giây** và tự sửa đúng cách (Ngày 27).",
    },
    {
      t: "speak",
      id: "t3d30-kt-noi-p2",
      part: "2",
      questions: [
        "Describe a book you enjoyed reading. You should say: what the book was; when and why you read it; what it was about; and explain why you enjoyed it.",
      ],
    },
    {
      t: "speak",
      id: "t3d30-kt-noi-p3",
      part: "3",
      questions: [
        "Do you think people read less nowadays than in the past? Why?",
        "Some people say printed books will disappear in the future. Do you agree?",
        "How can parents get their children to read more?",
      ],
    },
    {
      t: "note",
      title: "Tự chấm phần Nói",
      items: [
        "Part 2 có đủ **4 gạch đầu dòng** và dài ≥ 1 phút 45 không? Có ít nhất một câu quá khứ hoàn thành hoặc “, which…” không?",
        "Part 3: mỗi câu có **mặt còn lại** (That said… / However…) không? Câu 3 có dùng được **get + O + to V** hoặc **make / let** không?",
        "Đếm số lần im > 3 giây (đích ≤ 2) và số idiom (đích 1 – 2 cho cả phần, đúng nguyên dạng).",
        "AI chấm trung bình ≥ 5.5 là đạt; ≥ 6.0 là đúng đích Tập 3.",
      ],
    },

    /* ── Phần 8 ── */
    { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm của Ngày 25–30)" },
    {
      t: "mcq",
      id: "t3d30-kt-phat-am",
      title: "8. Nhấn ở đâu? Nối ở đâu? Âm nào? (8 câu)",
      items: [
        { q: "Danh từ ghép “bar chart” nhấn ở đâu? (N25)", options: ["BAR chart", "bar CHART", "nhấn đều hai từ", "không nhấn từ nào"], correct: 0, why: "Danh từ ghép N + N nhấn từ **thứ nhất**." },
        { q: "Cụm “a sharp rise” (tính từ + danh từ) nhấn chính ở đâu? (N25)", options: ["A sharp rise", "a sharp RISE", "a SHARP rise", "nhấn chữ a"], correct: 1, why: "Tính từ + danh từ: nhấn chính ở **danh từ**." },
        { q: "Trong “school” và “people”, âm /l/ cuối là: (N26)", options: ["/l/ sáng như trong “light”", "âm câm", "dark L — lưỡi lùi về sau, nghe gần như /ʊ/", "/n/"], correct: 2, why: "/l/ đứng **cuối** âm tiết là dark L; không bỏ mất và không đọc thành /n/." },
        { q: "“I had it fixed.” — đọc nhanh, “had it” nối thành: (N29)", options: ["had / it — ngắt rõ", "ha-it (mất /d/)", "hat-it", "ha-dit"], correct: 3, why: "Phụ âm cuối /d/ nối sang nguyên âm đầu của it." },
        { q: "“We were made **to** wait.” — từ “to” đọc là: (N29)", options: ["/tə/ — âm yếu", "/tuː/ — nhấn mạnh", "/təʊ/", "không đọc"], correct: 0, why: "Từ ngữ pháp không nhấn ⇒ âm yếu /tə/." },
        { q: "“a piece of cake” — nhấn chính ở: (N30)", options: ["piece", "CAKE", "of", "a"], correct: 1, why: "Idiom là một khối: nối piece‿of, nhấn danh từ cuối **cake**." },
        { q: "“cost an arm and a leg” — “and a” đọc tự nhiên là: (N30)", options: ["/ænd eɪ/ — rõ từng từ", "/ɑːnd ɑː/", "/ən ə/ — yếu, lướt", "bỏ hẳn"], correct: 2, why: "and → /ən/, a → /ə/." },
        { q: "Đang nói thì nhận ra mình nói sai thì. Cách xử lý ít mất điểm nhất: (N27)", options: ["Dừng 5 giây để nghĩ", "Bắt đầu lại cả câu trả lời", "Bỏ qua mọi lỗi, không bao giờ sửa", "Sửa một lần, ngắn (“— sorry, went”), giữ nhịp nói"], correct: 3, why: "Tự sửa một lần được tính là kiểm soát ngôn ngữ; im lặng hoặc nói lại từ đầu làm tụt FC." },
      ],
    },
    {
      t: "note",
      title: "Sau 8 câu trên — đọc lại các khối có máy chấm",
      items: [
        "Mở lại khối **Luyện phát âm** của Ngày 25 (trọng âm cụm danh từ), Ngày 26 (dark L), Ngày 29 (nối âm causative), Ngày 30 (nhịp idiom) — mỗi khối đọc một lượt, đích ≥ 80 điểm.",
        "Làm lại **12 câu tự chẩn 44 âm** của Ngày 27 và so với lần ở Ngày 1: âm nào vẫn đỏ thì luyện riêng 5 phút mỗi ngày tới hôm thi Đề 5.",
      ],
    },

    /* ── Kết ── */
    { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
    {
      t: "table",
      caption: "Trượt phần nào ⇒ ôn Ngày nào",
      head: ["Phần chưa đạt", "Ôn lại", "Làm gì"],
      rows: [
        ["1. Ngữ pháp", "Ngày 25 · 27 · 29", "Câu 1 – 5 và 1b 1 – 4 ⇒ N25; câu 6 – 10 và 1b 5 – 6 ⇒ N27; câu 11 – 15 và 1b 7 – 9 ⇒ N29. Làm lại bài dịch của mục sai."],
        ["2. Từ vựng", "Ngày 26 · 28 · 30", "Lật thẻ Việt → Anh của ngày sai nhiều nhất; idiom: làm lại bài 8a – 8b của Ngày 30."],
        ["3. Dịch", "Ngày 25 · 29", "Chép 6 câu đáp án, che đi, dịch lại sau 1 giờ."],
        ["4. Nghe", "Ngày 25 (bẫy) · 28 (Short answer) · 29 (2 phút kiểm)", "Nghe lại kèm lời, shadowing câu chứa đáp án."],
        ["5. Đọc", "Ngày 25 (Summary · Sentence) · 29 (Y / N / NG · MCQ trên bài lập luận)", "Tìm lại câu chứa đáp án và gọi tên kiểu paraphrase."],
        ["6. Viết", "Ngày 26 · 28 · 30", "Task 1 thiếu overview / sai thể bị động ⇒ N28; Task 2 thiếu vế ⇒ N10; viết lại bài này theo quy trình N30 sau một tuần."],
        ["7. Nói", "Ngày 26 · 27 · 30", "Part 2 < 1 phút 45 ⇒ N26; nhiều quãng im ⇒ N27; Part 3 ngắn ⇒ khung 4 bước N30."],
        ["8. Phát âm", "Khối phát âm Ngày 25 · 26 · 29 · 30", "Mỗi khối một lượt mỗi ngày trong 3 ngày."],
      ],
    },
    {
      t: "note",
      title: "📌 Thi cuối Tập 3 — Đề 5 (band 6.0)",
      items: [
        "Khi cả 8 phần đều đạt (hoặc đã ôn xong phần trượt): mở **Online Test → Đề 5** — Listening · Reading · Writing làm trong một buổi, đúng giờ, không tra từ, Listening nghe một lần (Speaking của Đề 5 đã thi ở bài Nói Ngày 30; chưa thi thì thi luôn sau phần Writing).",
        "Trước khi thi 10 phút: đọc lại **hai mã lỗi mục tiêu** (Writing) và bảng **2 phút kiểm** (Listening); nếu còn phải thi Speaking thì đọc thêm **hai việc cần sửa**.",
        "Kết quả: Overall **6.0** và không kỹ năng nào dưới 5.5 ⇒ bạn đã hoàn thành Tập 3 — sang **Tập 4 (6.0 → 7.0)**. Chưa đạt ⇒ xem phiếu điểm, ôn đúng chặng yếu (kiểm tra chặng Ngày 6 · 12 · 18 · 24 · 30), thi lại sau 1 – 2 tuần.",
      ],
    },
    {
      t: "note",
      title: "💡 Mẹo giữ phong độ sau Tập 3",
      items: [
        "Mỗi tuần: **1 bài viết lại** theo sổ lỗi · **1 lượt giám khảo AI** · **1 passage 20 phút** · Flashcards 10 phút mỗi ngày.",
        "Đừng bỏ sổ lỗi khi sang Tập 4 — ở band 7, điểm nằm ở **độ chính xác**, và sổ lỗi chính là bản đồ của nó.",
        "Bạn đã đi từ band 5.0 tới ngưỡng 6.0 trong 30 ngày học. Nghỉ một ngày thật sự trước khi thi Đề 5.",
      ],
    },
  ],
};

export const NGAY_30: Lesson[] = [D30_TU_VUNG, D30_VIET, D30_NOI, D30_BAI_TAP, D30_KIEM_TRA];
