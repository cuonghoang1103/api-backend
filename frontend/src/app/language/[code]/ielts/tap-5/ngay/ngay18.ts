/**
 * IELTS Tập 5 — Ngày 18 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, kịch bản nghe, câu bài tập VIẾT MỚI)
 * ✅ NGÀY KIỂM TRA CHẶNG 3 (Ngày 13–18). Khuôn N mod 4 = 2 ⇒ vocab · writing · speaking · homework · review.
 *   Bài 1 (vocab)     Idiom & sắc thái vòng cuối [VD7 VD8] — 48 mục `vocab` MỚI (đã đối chiếu mọi khối vocab Tập 3–5: không trùng):
 *                     12 idiom để lập luận · 10 để kể · 10 từ / idiom thương lượng · 8 tính từ “một tính cách, hai màu” · 8 khuôn
 *                     nói giảm (understatement). Nối Tập 3 Ngày 30 · Tập 4 Ngày 6 · 8 · 10 · Tập 5 Ngày 3 · 6 · 11.
 *   Bài 2 (writing)   Task 1 map band 8 [W14] + mốc tương lai theo mục 3.6 (is to be · is due to · is expected / likely to · will have
 *                     been) + biến thể sơ đồ mặt bằng. Đề mẫu: khu ga Wexcombe hiện nay ↔ kế hoạch 2032 (hư cấu), band 7 và band 8
 *                     đặt cạnh nhau; đề 2: trạm cứu hoả cũ → trung tâm nghệ thuật 2028 (hư cấu). Nối Tập 2 Ngày 22 · Tập 3 Ngày 28
 *                     (Saltby ba mốc) · Tập 5 Ngày 8 (Ashby Mill) · Ngày 10 (mổ map Đề 9) — KHÔNG dạy lại, có kiểm tra đầu bài.
 *   Bài 3 (speaking)  Đàm phán & phản biện lịch sự — PHẦN 2 của E10 [S16 E10] (phần 1 = Ngày 15 Bài 3: thang 5 nấc, một vòng năm
 *                     bước, thương lượng hạn giao Sarah – Minh). Phần 2 KHÔNG lặp: khi đề xuất đầu bị từ chối (bốn nước đi), lập
 *                     trường ↔ lợi ích, hedging giao tiếp đúng liều, ba người (Lan – Tom – Meera: thêm tính năng trả góp trước ngày
 *                     ra mắt), Part 3 khi giám khảo đẩy HAI lần / diễn giải sai; khối phatam: ngữ điệu mở ↗ / đóng ↘.
 *   Bài tập            45 câu có đáp án + 1 essay (map tả bằng bảng) + 2 speak; bài nghe giọng Anh – Mỹ (hư cấu).
 *   Kiểm tra chặng     `t5d18-kiem-tra` — 8 phần gom Ngày 13–18, mọi câu MỚI (bài đọc “The Meeting Problem”: nhà nghiên cứu HƯ CẤU,
 *                     có ghi rõ; hai bài nghe; map Marlbrook Cross; Task 2 trộn dạng). Không có khối phatam (ngày đã có 1 khối ở Bài 3).
 * Đã grep tap-3…tap-5/ngay + thi-may/de: Wexcombe, goods yard, signal box, fire station, Marlbrook, Larkfield, instalment = 0 kết quả.
 * Thẻ Part 2 mới: a time when you had to reach an agreement with someone. Part 1 mới: Prices / bargaining · Lending things.
 */
import type { Lesson } from '../data';

export const NGAY_18: Lesson[] = [
  /* ════════════════ BÀI 1 — TỪ VỰNG ════════════════ */
  {
    id: "t5d18-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Idiom & sắc thái vòng cuối — 48 mục: idiom để lập luận, để kể, để thương lượng; cặp từ “một tính cách, hai màu”; nói giảm kiểu Anh",
    goal: "Dùng đúng nguyên dạng và đúng chỗ 32 idiom mới thuộc ba việc cụ thể (lập luận ở Part 3, kể chuyện ở Part 2, thương lượng trong công việc), phân biệt 8 tính từ khen – chê cùng một tính cách, và nói giảm được một nhận xét khó nghe bằng 8 khuôn understatement — đủ để Lexical Resource của Speaking chạm mô tả band 8: dùng thành ngữ và từ ít gặp một cách khéo léo, chỉ thỉnh thoảng thiếu chính xác.",
    minutes: 100,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Lexical Resource** (Speaking) lên band 8: ==uses less common and idiomatic vocabulary skilfully==. Chữ quan trọng là skilfully: đúng dạng, đúng chỗ, đúng liều.",
          "Đây là **vòng cuối** của idiom. Vòng trước: Tập 3 Ngày 30 (30 cụm cơ bản), Tập 4 Ngày 6 · 8 · 10 (tính cách, nơi chốn, sở thích), Tập 5 Ngày 3 (12 cụm Part 1) và Ngày 11 (14 idiom + bốn phép thử). Hôm nay không lặp cụm nào.",
          "Idiom hôm nay xếp theo ==việc phải làm==, không theo chủ đề: 12 cụm để **lập luận**, 10 cụm để **kể**, 10 cụm để **thương lượng** (dùng ngay ở Bài 3).",
          "**Sắc thái vòng cuối** (nối Ngày 6): 8 tính từ khen – chê cùng một tính cách, và 8 khuôn **nói giảm** — thứ làm tiếng Anh của bạn nghe lịch sự mà không yếu.",
          "Mọi mục đều vào Flashcards. Cuối bài có 10 câu kiểm tra; bài kiểm tra chặng hôm nay cũng hỏi nhóm này.",
        ],
      },

      { t: "h", text: "Vòng trước đã học gì — kiểm nhanh trước khi lên vòng cuối" },
      {
        t: "quiz", id: "t5d18-on-dau-bai", kind: "fill",
        title: "Kiểm tra đầu bài — idiom vòng trước (6 câu, điền MỘT từ)",
        items: [
          { q: "1. Finishing the app in two weeks is a tall ___.", answers: ["order"], hint: "a tall order — Tập 5 Ngày 11" },
          { q: "2. The client rejected the design, so we were back to ___ one.", answers: ["square"], hint: "back to square one — Ngày 11" },
          { q: "3. I'd take those reviews with a pinch of ___.", answers: ["salt"], hint: "take sth with a pinch of salt — Ngày 11" },
          { q: "4. Good internships are few and far ___.", answers: ["between"], hint: "few and far between — Ngày 11" },
          { q: "5. I'm in two ___ about taking the job.", answers: ["minds"], hint: "in two minds — Ngày 3" },
          { q: "6. Online learning is a double-edged ___.", answers: ["sword"], hint: "a double-edged sword — Tập 3 Ngày 30" },
        ],
      },
      { t: "p", text: "Đúng 5–6: sang mục 1. Sai từ 2 câu: lướt lại bảng idiom của **Tập 5 Ngày 11 Bài 3 mục 3** trong 10 phút." },

      { t: "h", text: "1. Bốn luật của vòng cuối" },
      {
        t: "table",
        head: ["Luật", "Nghĩa là", "Sai → đúng"],
        rows: [
          ["① **Đúng nguyên dạng**", "idiom là cụm đóng: không đổi mạo từ, số, giới từ", "~~elephant in room~~ → **the** elephant in **the** room · ~~pay lips service~~ → pay lip service"],
          ["② **Đúng chỗ**", "Part 1–3 và giao tiếp: có. Task 2: gần như không (trừ vài cụm trung tính ở mục 7)", "~~This policy is the thin end of the wedge.~~ (Task 2) → may set a precedent for wider restrictions"],
          ["③ **Đúng liều**", "một câu trả lời Part 3 dài: 1 idiom, nhiều nhất 2", "ba idiom trong bốn câu nghe như đọc danh sách"],
          ["④ **Làm mềm** (mới)", "người bản ngữ ít khi nói idiom “trần”: họ thêm a bit of / something of / kind of, hoặc rút gọn", "It's a wake-up call. → It was **a bit of** a wake-up call, to be honest."],
        ],
      },
      { t: "rule", formula: "idiom band 8  =  nguyên dạng  +  đúng việc (lập luận / kể / thương lượng)  +  1 cụm mỗi câu trả lời  +  một chữ làm mềm", vi: "Không chắc nguyên dạng thì đừng dùng: một idiom sai dạng mất điểm nhiều hơn không dùng." },

      { t: "h", text: "2. Nhóm A — idiom để LẬP LUẬN (12 cụm cho Part 3 và thảo luận)" },
      { t: "p", text: "Mỗi cụm gọi tên ==một kiểu lập luận hoặc một kiểu vấn đề==. Dùng chúng thay cho một câu giải thích dài: thay vì nói “đây là bước đầu nhỏ dẫn tới thứ tệ hơn nhiều”, bạn nói the thin end of the wedge." },
      {
        t: "vocab",
        items: [
          { w: "the thin end of the wedge", pos: "idiom", ipa: "/ðə θɪn end əv ðə wedʒ/", vi: "bước đầu nhỏ của một thứ sẽ lớn và tệ hơn nhiều", ex: "Critics see the small fee as the thin end of the wedge.", exVi: "Người phê bình coi khoản phí nhỏ này là bước đầu của một thứ tệ hơn.", more: "Dùng khi PHẢN ĐỐI một thay đổi nhỏ. Người dùng cụm này thường bị đáp lại: I don't think it's a slippery slope at all." },
          { w: "the elephant in the room", pos: "idiom", ipa: "/ði ˈelɪfənt ɪn ðə ruːm/", vi: "vấn đề lớn ai cũng thấy nhưng không ai dám nhắc", ex: "Cost is the elephant in the room whenever we talk about healthcare.", exVi: "Chi phí là điều ai cũng thấy mà không ai nhắc mỗi khi bàn về y tế.", more: "address / ignore the elephant in the room · luôn có hai chữ the" },
          { w: "move the goalposts", pos: "idiom", ipa: "/muːv ðə ˈɡəʊlpəʊsts/", vi: "đổi luật / đổi yêu cầu giữa chừng (một cách không công bằng)", ex: "Every time we meet the target, management moves the goalposts.", exVi: "Cứ mỗi lần chúng tôi đạt chỉ tiêu, ban quản lý lại đổi yêu cầu.", more: "goalposts luôn số nhiều · dùng nhiều trong công việc, thương lượng (Bài 3)" },
          { w: "the jury is still out (on)", pos: "idiom", ipa: "/ðə ˈdʒʊəri ɪz stɪl aʊt/", vi: "chưa ngã ngũ, chưa ai biết chắc", ex: "The jury is still out on whether remote work makes teams more productive.", exVi: "Vẫn chưa ngã ngũ chuyện làm từ xa có giúp nhóm năng suất hơn không.", more: "Một cách hedging rất tự nhiên ở Part 3 · rút gọn khi nói: The jury's still out on that one." },
          { w: "throw money at (a problem)", pos: "idiom", ipa: "/θrəʊ ˈmʌni æt/", vi: "đổ tiền vào (một vấn đề) mà không nghĩ kỹ", ex: "You can't fix schools just by throwing money at them.", exVi: "Không thể sửa trường học chỉ bằng cách đổ tiền vào.", more: "Luôn mang ý CHÊ. Trung tính: invest in · increase funding for" },
          { w: "paper over the cracks", pos: "idiom", ipa: "/ˈpeɪpər əʊvə ðə kræks/", vi: "che vấn đề đi thay vì giải quyết tận gốc", ex: "The bonus only papers over the cracks; the real problem is the workload.", exVi: "Khoản thưởng chỉ che tạm vấn đề; vấn đề thật là khối lượng công việc.", more: "Gần nghĩa: a sticking-plaster solution · a quick fix. Trái: tackle the root cause" },
          { w: "a knee-jerk reaction", pos: "idiom", ipa: "/ə ˈniː dʒɜːk riˈækʃn/", vi: "phản ứng tức thì, không suy nghĩ", ex: "Banning phones outright strikes me as a knee-jerk reaction.", exVi: "Cấm hẳn điện thoại, với tôi, là một phản ứng thiếu suy nghĩ.", more: "a knee-jerk response / decision · dùng để PHÊ BÌNH một chính sách vội vàng" },
          { w: "pay lip service to", pos: "idiom", ipa: "/peɪ ˈlɪp sɜːvɪs tu/", vi: "nói ủng hộ ngoài miệng mà không làm gì", ex: "Many firms pay lip service to diversity without changing how they hire.", exVi: "Nhiều công ty ủng hộ đa dạng ngoài miệng mà không đổi cách tuyển người.", more: "lip (số ít) · pay lip service TO sth · trái: put your money where your mouth is" },
          { w: "a red herring", pos: "idiom", ipa: "/ə red ˈherɪŋ/", vi: "thứ đánh lạc hướng khỏi vấn đề chính", ex: "The debate about screen time is a bit of a red herring; what matters is what children watch.", exVi: "Cuộc tranh luận về thời gian dùng màn hình hơi lạc đề; điều quan trọng là trẻ xem gì.", more: "Dùng để SỬA TRỌNG TÂM câu hỏi (Ngày 15: It's not so much… as…)." },
          { w: "play devil's advocate", pos: "idiom", ipa: "/pleɪ ˌdevlz ˈædvəkət/", vi: "cố tình nói ngược để thử một lập luận", ex: "Let me play devil's advocate: what if the cheaper option is good enough?", exVi: "Để tôi thử nói ngược lại: nếu phương án rẻ hơn đã đủ tốt thì sao?", more: "Không có the / a trước devil's · cho phép bạn phản đối mà không gây căng (Bài 3)." },
          { w: "a foregone conclusion", pos: "idiom", ipa: "/ə ˌfɔːɡɒn kənˈkluːʒn/", vi: "kết quả đã biết trước, chắc chắn xảy ra", ex: "It's far from a foregone conclusion that robots will replace teachers.", exVi: "Còn lâu mới chắc chắn là robot sẽ thay giáo viên.", more: "Hay dùng ở dạng phủ định để rào đón: by no means / far from a foregone conclusion" },
          { w: "a wake-up call", pos: "idiom", ipa: "/ə ˈweɪk ʌp kɔːl/", vi: "hồi chuông cảnh tỉnh", ex: "The flood was a wake-up call for the city's planners.", exVi: "Trận lụt là hồi chuông cảnh tỉnh cho các nhà quy hoạch của thành phố.", more: "a wake-up call FOR sb · serve as a wake-up call · đủ trung tính để dùng trong Task 2" },
        ],
      },
      {
        t: "quiz", id: "t5d18-lap-luan", kind: "fill",
        title: "Điền MỘT từ để hoàn thành idiom của mục 2 (8 câu)",
        items: [
          { q: "1. Nobody mentioned the budget, although it was clearly the ___ in the room.", answers: ["elephant"], hint: "the elephant in the room" },
          { q: "2. The jury is still ___ on whether the new exam is fairer.", answers: ["out"], hint: "the jury is still out" },
          { q: "3. Some people fear that ID checks online are the thin end of the ___.", answers: ["wedge"], hint: "the thin end of the wedge" },
          { q: "4. The council pays lip ___ to cycling but keeps building car parks.", answers: ["service"], hint: "pay lip service to" },
          { q: "5. A new coat of paint just papers over the ___.", answers: ["cracks"], hint: "paper over the cracks" },
          { q: "6. We agreed on March, and now they've moved the ___ again.", answers: ["goalposts"], hint: "move the goalposts (số nhiều, viết liền)" },
          { q: "7. Let me play devil's ___ for a moment.", answers: ["advocate"], hint: "play devil's advocate" },
          { q: "8. The result was by no means a ___ conclusion.", answers: ["foregone"], hint: "a foregone conclusion" },
        ],
      },

      { t: "h", text: "3. Nhóm B — idiom để KỂ (10 cụm cho Part 2: căng thẳng, quyết định, nhẹ nhõm)" },
      { t: "p", text: "Ở Bài 3 của Ngày 17 bạn học kể một lần cụ thể. Mười cụm dưới đây gọi tên ==cảm giác ở từng chặng== của câu chuyện: lúc chờ, lúc tệ nhất, lúc quyết, lúc thoát." },
      {
        t: "vocab",
        items: [
          { w: "at the eleventh hour", pos: "idiom", ipa: "/æt ði ɪˈlevnθ aʊə/", vi: "vào phút chót", ex: "The venue cancelled at the eleventh hour, so we held the event outside.", exVi: "Địa điểm huỷ vào phút chót nên chúng tôi tổ chức ngoài trời.", more: "an eleventh-hour decision / change · trang trọng hơn at the last minute" },
          { w: "touch and go", pos: "idiom", ipa: "/ˌtʌtʃ ən ˈɡəʊ/", vi: "bấp bênh, chưa biết có qua được không", ex: "It was touch and go whether we'd finish before the deadline.", exVi: "Lúc đó rất bấp bênh, không biết chúng tôi có kịp hạn không.", more: "It was touch and go whether / for a while · chỉ dùng sau be" },
          { w: "my heart sank", pos: "idiom", ipa: "/maɪ hɑːt sæŋk/", vi: "tôi hụt hẫng, thất vọng tràn trề (ngay lúc đó)", ex: "My heart sank when I saw the queue.", exVi: "Tôi hụt hẫng khi nhìn thấy hàng người.", more: "sink – sank – sunk · ~~my heart was sunk~~ · câu ngắn, hợp làm điểm thấp nhất của chuyện" },
          { w: "take sth in your stride", pos: "idiom", ipa: "/teɪk ɪn jɔː straɪd/", vi: "bình thản đón nhận (điều khó) mà không rối", ex: "She took the bad news in her stride and started again.", exVi: "Cô ấy bình thản đón tin xấu và bắt đầu lại.", more: "Đổi tính từ sở hữu theo chủ ngữ: took it in HIS / MY stride" },
          { w: "bite the bullet", pos: "idiom", ipa: "/baɪt ðə ˈbʊlɪt/", vi: "cắn răng làm điều khó chịu nhưng phải làm", ex: "In the end I bit the bullet and told my manager I'd made a mistake.", exVi: "Cuối cùng tôi cắn răng nói với sếp rằng mình đã sai.", more: "bite – bit – bitten · hay đi với in the end / finally" },
          { w: "a weight off your shoulders", pos: "idiom", ipa: "/ə weɪt ɒf jɔː ˈʃəʊldəz/", vi: "trút được gánh nặng", ex: "Handing in the thesis was a huge weight off my shoulders.", exVi: "Nộp xong luận văn, tôi như trút được gánh nặng.", more: "cũng nói: a weight off my mind · It was such a weight off." },
          { w: "keep a straight face", pos: "idiom", ipa: "/kiːp ə streɪt feɪs/", vi: "nhịn cười, giữ mặt nghiêm", ex: "I could hardly keep a straight face when he started singing.", exVi: "Tôi gần như không nhịn được cười khi anh ấy bắt đầu hát.", more: "thường đi với could hardly / couldn't / tried to" },
          { w: "hit the ground running", pos: "idiom", ipa: "/hɪt ðə ɡraʊnd ˈrʌnɪŋ/", vi: "bắt tay vào việc ngay và làm tốt từ đầu", ex: "Thanks to the internship, I hit the ground running in my first job.", exVi: "Nhờ kỳ thực tập, tôi bắt nhịp ngay ở công việc đầu tiên.", more: "hit – hit – hit · hay dùng trong phỏng vấn xin việc" },
          { w: "get cold feet", pos: "idiom", ipa: "/ɡet kəʊld fiːt/", vi: "chùn bước vào phút chót", ex: "I'd signed up for the talent show, but I got cold feet the night before.", exVi: "Tôi đã đăng ký thi tài năng nhưng đêm trước lại chùn.", more: "get / have cold feet about sth · ~~cold foot~~" },
          { w: "a close call", pos: "idiom", ipa: "/ə ˌkləʊs ˈkɔːl/", vi: "một phen suýt (gặp nạn, thất bại)", ex: "We caught the last ferry with two minutes to spare — it was a close call.", exVi: "Chúng tôi kịp chuyến phà cuối khi còn hai phút — suýt thì lỡ.", more: "cũng nói: a close shave · a narrow escape" },
        ],
      },
      {
        t: "table", caption: "Mười cụm trên đường cong của một câu chuyện Part 2",
        head: ["Chặng", "Cảm giác", "Cụm"],
        rows: [
          ["trước sự việc", "muốn rút lui", "get cold feet"],
          ["sự cố ập tới", "phút chót · hụt hẫng", "at the eleventh hour · my heart sank"],
          ["giữa chừng", "bấp bênh · phải cố tỏ ra bình thường", "touch and go · keep a straight face"],
          ["quyết định", "cắn răng làm", "bite the bullet"],
          ["kết quả", "suýt hỏng · nhẹ người", "a close call · a weight off my shoulders"],
          ["nhìn lại", "đón nhận bình thản · vào việc ngay", "take it in your stride · hit the ground running"],
        ],
      },
      {
        t: "quiz", id: "t5d18-ke-chuyen", kind: "fill",
        title: "Điền MỘT từ để hoàn thành idiom của mục 3 (6 câu)",
        items: [
          { q: "1. My heart ___ when the screen went black in the middle of the demo.", answers: ["sank"], hint: "my heart sank (quá khứ của sink)" },
          { q: "2. It was touch and ___ whether the bus would arrive in time.", answers: ["go"], hint: "touch and go" },
          { q: "3. I nearly got cold ___ before the interview.", answers: ["feet"], hint: "get cold feet" },
          { q: "4. Passing the driving test was a real weight off my ___.", answers: ["shoulders", "mind"], hint: "a weight off my shoulders / mind" },
          { q: "5. The funding was approved at the eleventh ___.", answers: ["hour"], hint: "at the eleventh hour" },
          { q: "6. She took the criticism in her ___ and carried on.", answers: ["stride"], hint: "take sth in your stride" },
        ],
      },

      { t: "h", text: "4. Nhóm C — từ và idiom của THƯƠNG LƯỢNG (10 mục, dùng ngay ở Bài 3)" },
      {
        t: "vocab",
        items: [
          { w: "a sticking point", pos: "n", ipa: "/ə ˈstɪkɪŋ pɔɪnt/", vi: "điểm vướng, chỗ hai bên chưa thống nhất được", ex: "The delivery date is the main sticking point.", exVi: "Ngày giao hàng là điểm vướng chính.", more: "the main / only / one remaining sticking point · gần nghĩa: a stumbling block (vật cản nói chung)" },
          { w: "common ground", pos: "n", ipa: "/ˌkɒmən ˈɡraʊnd/", vi: "điểm chung, chỗ hai bên cùng đồng ý", ex: "Let's start with the common ground: we both want to launch in May.", exVi: "Hãy bắt đầu từ điểm chung: cả hai ta đều muốn ra mắt vào tháng Năm.", more: "find / establish common ground · không đếm được: ~~a common ground~~" },
          { w: "meet sb halfway", pos: "idiom", ipa: "/miːt ˌhɑːfˈweɪ/", vi: "mỗi bên nhượng một nửa", ex: "I can't do Friday, but I'm willing to meet you halfway — say, Monday noon?", exVi: "Tôi không làm kịp thứ Sáu, nhưng sẵn lòng mỗi bên nhường một nửa — trưa thứ Hai nhé?", more: "Ngày 15 dạy meet in the middle (hai bên cùng làm). meet YOU halfway = TÔI chủ động nhượng." },
          { w: "give and take", pos: "n", ipa: "/ˌɡɪv ən ˈteɪk/", vi: "sự có đi có lại, nhường nhịn lẫn nhau", ex: "Any long-term partnership needs a bit of give and take.", exVi: "Quan hệ đối tác lâu dài nào cũng cần có đi có lại.", more: "a bit of / some give and take · không đếm được" },
          { w: "dig your heels in", pos: "idiom", ipa: "/dɪɡ jɔː hiːlz ɪn/", vi: "khăng khăng không chịu nhượng", ex: "The more we pushed, the more the supplier dug their heels in.", exVi: "Chúng tôi càng ép, nhà cung cấp càng khăng khăng.", more: "dig – dug – dug · mang ý CHÊ nhẹ (cứng đầu). Khen thì dùng stand your ground." },
          { w: "stand your ground", pos: "idiom", ipa: "/stænd jɔː ɡraʊnd/", vi: "giữ vững lập trường (một cách chính đáng)", ex: "She stood her ground on quality, and the client respected that.", exVi: "Cô ấy giữ vững lập trường về chất lượng, và khách hàng tôn trọng điều đó.", more: "cũng nói: hold your ground · cặp sắc thái với dig your heels in" },
          { w: "iron out", pos: "phr v", ipa: "/ˌaɪən ˈaʊt/", vi: "giải quyết nốt (những vướng mắc nhỏ)", ex: "We still need to iron out a few details before signing.", exVi: "Chúng ta vẫn cần giải quyết nốt vài chi tiết trước khi ký.", more: "iron out differences / problems / details · chỉ dùng cho việc NHỎ còn lại" },
          { w: "a deal-breaker", pos: "n", ipa: "/ə ˈdiːl breɪkə/", vi: "điều kiện mà thiếu nó thì không thoả thuận", ex: "For us, data security is a deal-breaker.", exVi: "Với chúng tôi, bảo mật dữ liệu là điều kiện không thể thiếu.", more: "It's not a deal-breaker (= vẫn thương lượng được) · trang trọng hơn: non-negotiable (adj)" },
          { w: "leeway", pos: "n", ipa: "/ˈliːweɪ/", vi: "khoảng xê dịch, độ linh động được phép", ex: "There's some leeway on the timing, but none on the budget.", exVi: "Về thời gian thì còn xê dịch được, về ngân sách thì không.", more: "some / a little / no leeway ON sth · thân mật hơn: wiggle room · không đếm được" },
          { w: "off the table", pos: "idiom", ipa: "/ɒf ðə ˈteɪbl/", vi: "không còn được xét tới, bị loại khỏi bàn thương lượng", ex: "A price cut is off the table, but we could extend the support period.", exVi: "Giảm giá thì không bàn nữa, nhưng chúng tôi có thể kéo dài thời gian hỗ trợ.", more: "trái: on the table (đang được đề xuất) · take sth off the table" },
        ],
      },
      {
        t: "quiz", id: "t5d18-thuong-luong", kind: "fill",
        title: "Điền MỘT từ của mục 4 (6 câu, chữ đầu cho sẵn)",
        items: [
          { q: "1. We agree on most things; the only s___ point is who pays for training.", answers: ["sticking"], hint: "a sticking point" },
          { q: "2. I can't accept that price, but I'm happy to meet you h___.", answers: ["halfway"], hint: "meet sb halfway" },
          { q: "3. Let's begin with the c___ ground before we turn to the differences.", answers: ["common"], hint: "common ground" },
          { q: "4. There are just a few small issues to i___ out.", answers: ["iron"], hint: "iron out" },
          { q: "5. Is there any l___ on the start date?", answers: ["leeway"], hint: "leeway on sth" },
          { q: "6. Working weekends is a deal-b___ for me.", answers: ["breaker"], hint: "a deal-breaker" },
        ],
      },

      { t: "h", text: "5. Nhóm D — một tính cách, hai màu (8 tính từ)" },
      { t: "p", text: "Ở Ngày 6 bạn học năm cặp thái độ (thrifty / stingy · resolute / obstinate…). Vòng cuối thêm sáu cặp dùng khi ==nhận xét về cách một người nói và làm việc== — đúng thứ bạn cần ở Part 3 và trong phản hồi công việc." },
      {
        t: "table",
        head: ["Tính cách", "Khen (+)", "Chê (−)", "Khác nhau ở"],
        rows: [
          ["nói rõ điều mình muốn", "assertive", "**pushy**", "pushy = ép người khác, không nghe"],
          ["thận trọng", "cautious", "**timid**", "timid = sợ nên không dám làm"],
          ["tin vào điều tốt đẹp", "idealistic", "**naive**", "naive = thiếu kinh nghiệm nên tin quá dễ"],
          ["kỹ lưỡng", "thorough", "**pedantic**", "pedantic = bắt bẻ tiểu tiết không quan trọng"],
          ["khéo ăn nói", "**tactful**", "**evasive**", "evasive = né câu hỏi, không trả lời thẳng"],
          ["thẳng thắn", "**candid**", "**tactless**", "tactless = nói thật mà không nghĩ tới người nghe"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "pushy", pos: "adj", ipa: "/ˈpʊʃi/", vi: "hay ép, lấn tới (chê)", ex: "The salesman was so pushy that I walked out.", exVi: "Người bán hàng ép quá nên tôi bỏ đi.", more: "pushy parents / salespeople · khen thì dùng assertive (Tập 4 Ngày 10)" },
          { w: "timid", pos: "adj", ipa: "/ˈtɪmɪd/", vi: "rụt rè, nhút nhát (chê nhẹ)", ex: "The government's response has been timid at best.", exVi: "Phản ứng của chính phủ, nói nhẹ nhất, là rụt rè.", more: "a timid response / reform · khen thì dùng cautious, measured" },
          { w: "naive", pos: "adj", ipa: "/naɪˈiːv/", vi: "ngây thơ, thiếu thực tế (chê)", ex: "It would be naive to think that technology alone can fix education.", exVi: "Sẽ là ngây thơ nếu nghĩ chỉ riêng công nghệ có thể sửa được giáo dục.", more: "It would be naive to think / assume that… — khuôn bác một quan điểm rất hợp Task 2 và Part 3" },
          { w: "pedantic", pos: "adj", ipa: "/pɪˈdæntɪk/", vi: "bắt bẻ tiểu tiết, câu nệ (chê)", ex: "I don't want to be pedantic, but the figure is 14 per cent, not 40.", exVi: "Tôi không muốn bắt bẻ, nhưng con số là 14 %, không phải 40.", more: "I don't want to be pedantic, but… — cách xin phép trước khi sửa ai đó" },
          { w: "tactful", pos: "adj", ipa: "/ˈtæktfl/", vi: "khéo léo, tế nhị (khen)", ex: "She found a tactful way of saying the design needed more work.", exVi: "Cô ấy tìm được cách nói tế nhị rằng bản thiết kế cần làm thêm.", more: "N: tact · adv: tactfully · trái: tactless" },
          { w: "evasive", pos: "adj", ipa: "/ɪˈveɪsɪv/", vi: "lảng tránh, không trả lời thẳng (chê)", ex: "When asked about the delay, the manager was evasive.", exVi: "Khi được hỏi về việc chậm trễ, người quản lý trả lời lảng tránh.", more: "an evasive answer · V: evade a question · rào đón QUÁ liều thì nghe evasive (Bài 3 mục 3)" },
          { w: "candid", pos: "adj", ipa: "/ˈkændɪd/", vi: "thẳng thắn, nói thật (khen)", ex: "To be candid, I don't think the plan is realistic.", exVi: "Nói thẳng, tôi không nghĩ kế hoạch này khả thi.", more: "a candid discussion / assessment · To be candid, … trang trọng hơn To be honest, …" },
          { w: "tactless", pos: "adj", ipa: "/ˈtæktləs/", vi: "vô ý, thiếu tế nhị (chê)", ex: "It was tactless of him to mention her exam results in front of everyone.", exVi: "Anh ấy thật thiếu tế nhị khi nhắc điểm thi của cô ấy trước mặt mọi người.", more: "It was tactless of sb to V · mạnh hơn: blunt (Tập 4), rude" },
        ],
      },
      {
        t: "mcq", id: "t5d18-hai-mau", title: "Một tính cách, hai màu — chọn từ đúng thái độ (6 câu)",
        items: [
          { q: "1. (khen) Our new team lead is ___: she tells you exactly where you stand.", options: ["tactless", "candid", "pushy"], correct: 1, why: "candid = thẳng thắn theo nghĩa tốt. tactless là chê." },
          { q: "2. (chê) He asked three times whether I'd signed yet. I found him rather ___.", options: ["assertive", "thorough", "pushy"], correct: 2, why: "pushy = ép người khác. assertive là khen." },
          { q: "3. (chê) The minister gave an ___ answer and changed the subject.", options: ["evasive", "tactful", "cautious"], correct: 0, why: "evasive = lảng tránh. tactful và cautious là khen." },
          { q: "4. (chê) It would be ___ to assume that every user reads the instructions.", options: ["idealistic", "naive", "candid"], correct: 1, why: "It would be naive to assume… — khuôn bác một giả định." },
          { q: "5. (khen) She was ___ enough not to mention the price in front of the client.", options: ["timid", "evasive", "tactful"], correct: 2, why: "tactful = tế nhị. timid là nhút nhát." },
          { q: "6. (chê) Correcting every comma in a chat message is a bit ___.", options: ["pedantic", "thorough", "candid"], correct: 0, why: "pedantic = bắt bẻ tiểu tiết. thorough là khen." },
        ],
      },

      { t: "h", text: "6. Nhóm E — nói giảm kiểu Anh (understatement): tám khuôn" },
      { t: "p", text: "Người Anh ít khi nói thẳng một nhận xét tiêu cực. Họ nói ==ít hơn điều họ nghĩ==, và người nghe tự hiểu phần còn lại. Với người Việt, đây là chỗ dễ hiểu nhầm nhất: “not exactly cheap” không có nghĩa là “hơi đắt”, mà là “đắt”." },
      {
        t: "table",
        head: ["Nói thẳng", "Nói giảm", "Người nghe hiểu"],
        rows: [
          ["The plan is bad.", "The plan is **less than ideal**.", "kế hoạch có vấn đề thật"],
          ["The report is poor.", "The report **leaves something to be desired**.", "báo cáo chưa đạt"],
          ["You need to improve.", "There's **room for improvement**.", "phải làm tốt hơn"],
          ["It's expensive.", "It's **not exactly** cheap. · It's **on the pricey side**.", "đắt"],
          ["That's not believable.", "That's **a bit of a stretch**.", "khó tin, gượng ép"],
          ["He lied.", "He was **economical with the truth**.", "anh ta không nói hết sự thật"],
          ["She's unemployed.", "She's **between jobs** at the moment.", "đang thất nghiệp (nói tránh)"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "less than ideal", pos: "phrase", ipa: "/les ðən aɪˈdiːəl/", vi: "chưa ổn, có vấn đề (nói giảm)", ex: "The timing is less than ideal, but we can make it work.", exVi: "Thời điểm chưa thật ổn, nhưng chúng ta xoay được.", more: "khuôn less than + adj tích cực: less than helpful · less than convinced · less than happy" },
          { w: "leave something to be desired", pos: "idiom", ipa: "/liːv ˈsʌmθɪŋ tə bi dɪˈzaɪəd/", vi: "còn chỗ chưa đạt (nói giảm)", ex: "The hotel was fine, but the service left something to be desired.", exVi: "Khách sạn thì ổn, nhưng dịch vụ còn chỗ chưa đạt.", more: "mạnh hơn: leave a lot / a great deal to be desired" },
          { w: "room for improvement", pos: "phrase", ipa: "/ruːm fər ɪmˈpruːvmənt/", vi: "còn có thể làm tốt hơn (nói giảm)", ex: "Your essay is clear, though there's room for improvement in the conclusion.", exVi: "Bài luận của bạn rõ ràng, dù phần kết còn có thể tốt hơn.", more: "there is (still) some / plenty of room for improvement · room không đếm được" },
          { w: "not exactly", pos: "phrase", ipa: "/nɒt ɪɡˈzæktli/", vi: "chẳng… gì cho cam (phủ định mỉa nhẹ)", ex: "The office is not exactly close to the station.", exVi: "Văn phòng chẳng gần ga gì cho cam.", more: "not exactly + adj / N: He's not exactly an expert. Nghĩa thật: ngược hẳn lại." },
          { w: "a bit of a stretch", pos: "idiom", ipa: "/ə bɪt əv ə stretʃ/", vi: "hơi gượng ép, khó tin (nói giảm)", ex: "Calling it a revolution is a bit of a stretch.", exVi: "Gọi đó là một cuộc cách mạng thì hơi quá.", more: "It's a stretch to say / to call… · khác a stretch of road (Ngày 17)" },
          { w: "on the … side", pos: "phrase", ipa: "/ɒn ðə saɪd/", vi: "hơi… (về phía…)", ex: "The portions are on the small side, and the prices are on the high side.", exVi: "Khẩu phần hơi ít, còn giá thì hơi cao.", more: "on the pricey / long / late / heavy side · luôn có the" },
          { w: "economical with the truth", pos: "idiom", ipa: "/ˌiːkəˈnɒmɪkl wɪð ðə truːθ/", vi: "không nói hết sự thật (nói tránh cho “nói dối”)", ex: "The advert was, shall we say, economical with the truth.", exVi: "Quảng cáo ấy, nói thế nào nhỉ, đã không nói hết sự thật.", more: "Giọng mỉa, hơi trang trọng · hay đi với shall we say / let's say" },
          { w: "between jobs", pos: "phrase", ipa: "/bɪˈtwiːn dʒɒbz/", vi: "đang chưa có việc (nói tránh)", ex: "My cousin is between jobs, so he's helping at the family shop.", exVi: "Anh họ tôi đang chưa có việc nên phụ giúp cửa hàng của gia đình.", more: "Các lời nói tránh khác: let sb go (cho nghỉ việc) · pass away (qua đời) · senior citizens (người cao tuổi)" },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — ba lỗi khi nói giảm",
        items: [
          "**Hiểu theo nghĩa đen.** Sếp nói “This leaves something to be desired” nghĩa là bạn phải làm lại, không phải “gần đạt rồi”. “Not bad at all” thì ngược lại: đó là lời khen.",
          "**Nói giảm ở chỗ cần rõ.** Lỗi an toàn, con số, hạn chót ⇒ nói thẳng: The figure is wrong. Nói giảm chỉ dành cho NHẬN XÉT.",
          "**Chồng nhiều lớp.** ~~It might perhaps be slightly less than ideal, sort of.~~ Một lớp là đủ.",
        ],
      },
      { t: "rule", formula: "less than + adj tốt   ·   not exactly + adj tốt   ·   on the + adj + side   ·   leave something to be desired   ·   room for improvement", vi: "Nói ít hơn điều mình nghĩ một nấc; để người nghe tự hiểu nấc còn lại." },
      {
        t: "quiz", id: "t5d18-noi-giam-dich", kind: "translate", grammar: "less than + adj · not exactly · on the … side · leave something to be desired · a bit of a stretch",
        title: "Dịch sang tiếng Anh — nói giảm, dùng cụm trong gợi ý (4 câu)",
        items: [
          { q: "Kết nối mạng ở đây chưa thật ổn. (less than)", answers: ["The internet connection here is less than ideal.", "The connection here is less than ideal.", "The network connection here is less than ideal."], hint: "less than ideal" },
          { q: "Căn hộ thì đẹp nhưng hơi nhỏ. (on the … side)", answers: ["The flat is nice but on the small side.", "The apartment is nice but on the small side.", "The flat is nice, but it is on the small side.", "The flat is nice, but it's on the small side.", "The apartment is nice, but it is on the small side.", "The apartment is nice, but it's on the small side.", "The flat is lovely but on the small side."], hint: "on the small side" },
          { q: "Phần kiểm thử còn chỗ chưa đạt. (leave)", answers: ["The testing leaves something to be desired.", "The testing left something to be desired.", "The testing still leaves something to be desired."], hint: "leave something to be desired" },
          { q: "Nói rằng ứng dụng này đã sẵn sàng thì hơi quá. (stretch)", answers: ["Saying that this app is ready is a bit of a stretch.", "Saying this app is ready is a bit of a stretch.", "It is a bit of a stretch to say that this app is ready.", "It's a bit of a stretch to say that this app is ready.", "It's a bit of a stretch to say this app is ready.", "To say that this app is ready is a bit of a stretch."], hint: "a bit of a stretch" },
        ],
      },

      { t: "h", text: "7. Dùng “khéo” — làm mềm, rút gọn, và idiom nào vào được bài viết" },
      {
        t: "table", caption: "Ba cách người bản ngữ “bẻ” idiom mà vẫn đúng",
        head: ["Cách", "Dạng sách", "Dạng nói tự nhiên"],
        rows: [
          ["thêm chữ làm mềm", "It was a wake-up call.", "It was **a bit of** a wake-up call. · It's **something of** a red herring."],
          ["rút gọn, bỏ nửa sau", "The jury is still out on that question.", "**The jury's still out** on that one."],
          ["phủ định / hỏi", "It is a foregone conclusion.", "It's **hardly** a foregone conclusion, is it?"],
          ["nhắc tới idiom thay vì nói trọn", "This is the thin end of the wedge.", "People worry it's **the thin end of the wedge**, and I can see why."],
        ],
      },
      {
        t: "table", caption: "Idiom và bài viết — ba mức",
        head: ["Mức", "Ví dụ", "Dùng ở Task 2?"],
        rows: [
          ["trung tính, đã thành từ vựng học thuật", "a wake-up call · a vicious circle · a grey area · common ground · a double-edged sword", "được, tối đa một lần mỗi bài"],
          ["khẩu ngữ rõ", "throw money at · paper over the cracks · move the goalposts · a knee-jerk reaction", "thay bằng từ trang trọng: invest indiscriminately in · conceal the underlying problem · change the criteria · an ill-considered response"],
          ["chuyện kể, cảm xúc", "my heart sank · get cold feet · a close call · bite the bullet", "không"],
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — lỗi của người Việt với idiom ở band 7",
        items: [
          "**Dịch thành ngữ tiếng Việt.** ~~water flows, stone wears~~ · ~~near the ink you are black~~. Giám khảo không hiểu; mất điểm LR.",
          "**Sai một chữ nhỏ**: ~~the elephant in a room~~ · ~~move the goalpost~~ · ~~pay a lip service~~ · ~~bite a bullet~~ · ~~the jury is still outside~~.",
          "**Sai thì**: idiom vẫn chia theo câu. Yesterday my heart ~~sinks~~ → sank · they ~~dig~~ → dug their heels in.",
          "**Nhồi vào Part 1.** Câu hỏi “Do you like coffee?” không cần the jury is still out. Idiom nhóm A dành cho Part 3; nhóm B cho Part 2.",
          "**Dùng để khoe, không để nói.** Phép thử của Ngày 11: bỏ idiom đi, câu có mất nghĩa không? Không mất ⇒ đừng dùng.",
        ],
      },

      { t: "h", text: "8. Kiểm tra cuối bài (10 câu)" },
      {
        t: "mcq", id: "t5d18-tv-kiem", title: "Chọn phương án đúng (10 câu)",
        items: [
          { q: "1. “Free bus travel for students today, free travel for everyone tomorrow — it's ___.”", options: ["a red herring", "the thin end of the wedge", "a close call"], correct: 1, why: "Bước nhỏ đầu tiên dẫn tới thứ lớn hơn ⇒ the thin end of the wedge." },
          { q: "2. Examiner: “Will AI make doctors unnecessary?” — Câu mở hợp nhất:", options: ["My heart sank.", "I think the jury's still out on that one.", "That is off the table."], correct: 1, why: "Chưa ngã ngũ ⇒ the jury's still out — một cách hedging tự nhiên ở Part 3." },
          { q: "3. Dạng nào ĐÚNG?", options: ["pay a lip service to", "pay lips service to", "pay lip service to"], correct: 2, why: "Nguyên dạng: pay lip service to — không a, không -s." },
          { q: "4. The company gave everyone a small bonus instead of hiring more staff. It was just ___.", options: ["papering over the cracks", "hitting the ground running", "standing its ground"], correct: 0, why: "Che vấn đề thay vì giải quyết gốc ⇒ paper over the cracks." },
          { q: "5. Kể chuyện: “I'd agreed to give the speech, but the night before I ___.”", options: ["bit the bullet", "got cold feet", "kept a straight face"], correct: 1, why: "but + đêm trước ⇒ chùn bước: got cold feet. bit the bullet = cắn răng LÀM." },
          { q: "6. Trong thương lượng: “Price we can discuss. Security, I'm afraid, is ___.”", options: ["a deal-breaker", "common ground", "give and take"], correct: 0, why: "Điều kiện không thể thiếu ⇒ a deal-breaker." },
          { q: "7. Câu nào KHEN?", options: ["She dug her heels in.", "She stood her ground.", "She was pushy."], correct: 1, why: "stand your ground = giữ lập trường chính đáng. dig your heels in và pushy là chê." },
          { q: "8. Sếp viết: “The documentation leaves something to be desired.” Nghĩa thật:", options: ["Tài liệu gần hoàn hảo.", "Tài liệu chưa đạt, cần làm lại.", "Tài liệu thiếu một trang."], correct: 1, why: "Nói giảm: còn chỗ chưa đạt = chưa tốt." },
          { q: "9. “The café is not exactly quiet.” Nghĩa là:", options: ["Quán khá yên tĩnh.", "Quán ồn.", "Quán yên tĩnh vừa phải."], correct: 1, why: "not exactly + adj tốt = ngược lại hẳn: quán ồn." },
          { q: "10. Câu nào hợp cho Writing Task 2?", options: ["Governments keep throwing money at the problem.", "The floods should serve as a wake-up call for planners.", "My heart sank when I read the statistics."], correct: 1, why: "a wake-up call đã trung tính, dùng được trong bài viết. Hai câu còn lại là khẩu ngữ / chuyện kể." },
        ],
      },
      {
        t: "note", title: "📌 Sau bài này",
        items: [
          "Chọn ==sáu cụm== bạn thấy hợp miệng nhất (hai cụm mỗi nhóm A, B, C). Viết cho mỗi cụm một câu thật về mình. Sáu cụm dùng chắc tay hơn ba mươi cụm biết lơ mơ.",
          "Bài 3 hôm nay dùng nhóm C và nhóm E trong thương lượng nhiều vòng. Bài kiểm tra chặng (cuối ngày) hỏi cả nhóm A–E.",
          "Flashcards: bộ “Từ của khoá — Tập 5” đã có 48 mục này. Ôn ở chế độ Việt → Anh để luyện nguyên dạng.",
        ],
      },
    ],
  },
  /* ════════════════ BÀI 2 — VIẾT TASK 1: MAP BAND 8 ════════════════ */
  {
    id: "t5d18-viet",
    kind: "writing",
    title: "Viết Task 1: Map band 8 — bản đồ có MỐC TƯƠNG LAI (is to be · is due to · is expected to · will have been) và biến thể sơ đồ mặt bằng",
    goal: "Viết trọn một bài Task 1 map “hiện trạng ↔ kế hoạch” trong 20 phút ở band 8: overview gọi tên hướng thay đổi về CHỨC NĂNG và cái được giữ, thân bài chia theo khu, mỗi bản đồ một thì, tương lai diễn đạt bằng ít nhất bốn khuôn khác nhau đúng mức chắc chắn (không will ở mọi câu), hai thay đổi cùng chỗ gói trong một câu; và xử lý được biến thể sơ đồ mặt bằng một toà nhà.",
    minutes: 110,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Task Achievement** và **GRA** của Task 1 lên band 8. TA band 8: ==covers all requirements… presents, highlights and illustrates key features clearly and appropriately==. Với map: overview phải nói được khu vực ĐỔI CHỨC NĂNG thế nào.",
          "Nối lại: Tập 2 Ngày 22 (nhập môn map), Tập 3 Ngày 28 (map ba mốc, map chọn địa điểm), Tập 5 Ngày 8 (ngôn ngữ bản đồ — khu Ashby Mill) và Ngày 10 (mổ map Đề 9: overview chức năng, động từ thay đổi + giới từ). Hôm nay ==không dạy lại== những thứ đó; có một bài kiểm tra đầu bài để chắc bạn còn nhớ.",
          "Phần mới ①: **mốc tương lai**. Tập 3 chỉ cho bạn will be / is going to be. Band 8 cần tám khuôn và biết khuôn nào chắc tới đâu.",
          "Phần mới ②: **gói thay đổi có tương lai** — cleared to make way for · freeing the land for · will have become… by the time.",
          "Phần mới ③: **sơ đồ mặt bằng** (floor plan) — cùng kỹ năng, khác từ vựng.",
          "Hai bài mẫu band 7 và band 8 đặt cạnh nhau cho cùng một đề; hai đề để viết, AI chấm.",
        ],
      },

      { t: "h", text: "1. Map ở band 7 và band 8 — khác nhau ở chữ nào" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["Task Achievement", "overview có nhưng chung: “the area will change a lot”; kể đủ mọi công trình", "overview gọi tên ==hướng== thay đổi (đất bỏ hoang → nhà ở; xe hơi → giao thông công cộng) và ==cái được giữ==; chi tiết được chọn và gom"],
          ["Coherence & Cohesion", "đi lần lượt từng công trình; nối bằng also, in addition", "chia theo KHU (bắc / nam tuyến đường); trong khu đi từ thay đổi lớn tới nhỏ; nối bằng vị trí (North of the line, …)"],
          ["Lexical Resource", "replace, build, change into — lặp", "be cleared · make way for · be earmarked for · be relocated · give way to · on half its footprint"],
          ["Grammar", "will be + V3 ở mọi câu", "is to be · is due to be · is expected to be · will have become… by · mệnh đề rút gọn (converted into a café, freeing the land for…)"],
        ],
      },
      {
        t: "note", title: "📌 Hai câu hỏi mọi overview map band 8 phải trả lời",
        items: [
          "**Khu vực đang / sẽ chuyển từ loại nào sang loại nào?** (công nghiệp → dân cư; phục vụ xe hơi → phục vụ người đi bộ; một chức năng → nhiều chức năng)",
          "**Cái gì KHÔNG đổi?** (trục đường, toà nhà chính, con sông). Người chấm coi đây là dấu hiệu bạn đã nhìn cả bản đồ.",
        ],
      },

      { t: "h", text: "2. Kiểm tra đầu bài — ngôn ngữ bản đồ đã học (6 câu)" },
      {
        t: "quiz", id: "t5d18-viet-on", kind: "fill",
        title: "Điền MỘT từ — ôn Tập 3 Ngày 28 · Tập 5 Ngày 8 · Ngày 10",
        items: [
          { q: "1. The old cinema has been converted ___ a gym.", answers: ["into"], hint: "convert A into B" },
          { q: "2. Several houses were demolished to make way ___ a ring road.", answers: ["for"], hint: "make way for" },
          { q: "3. A hotel now stands on the ___ of the former bus depot.", answers: ["site"], hint: "on the site of" },
          { q: "4. The farmland to the north has given way ___ housing.", answers: ["to"], hint: "give way to" },
          { q: "5. The church and the main road have been ___ . (được giữ lại, 8 chữ cái, bắt đầu bằng r)", answers: ["retained"], hint: "have been retained" },
          { q: "6. The park lies ___ the north-east of the station. (ở phía)", answers: ["to"], hint: "to the north-east of (bên ngoài, về phía) · in the north-east of (bên trong khu)" },
        ],
      },
      {
        t: "table", caption: "Ôn 60 giây — một bảng cho mọi bản đồ",
        head: ["Việc", "Ngôn ngữ", "Học ở"],
        rows: [
          ["Vị trí", "to the north of · in the south-west corner · adjacent to · opposite · alongside · at the eastern end", "Tập 3 Ngày 28"],
          ["Giữ nguyên", "remain unchanged · be retained · still stand", "Tập 5 Ngày 8"],
          ["Giữ vỏ, đổi công năng", "be converted into · be turned into · now serve as", "Tập 5 Ngày 8"],
          ["Bỏ cũ, xây mới", "be replaced by · make way for · give way to · on the site of", "Tập 5 Ngày 10"],
          ["Mở rộng / thu nhỏ", "be extended (eastwards) · be enlarged · be reduced in size · be halved", "Tập 5 Ngày 10"],
          ["Overview", "has been transformed from A into B · While X has been retained, …", "Tập 5 Ngày 10"],
        ],
      },
      { t: "p", text: "Sai từ 2 câu: mở lại **Tập 5 Ngày 10 Bài 2 mục A2–A3** (bảng động từ thay đổi + giới từ) trước khi học tiếp." },

      { t: "h", text: "3. Mốc tương lai — tám khuôn và thang chắc chắn" },
      { t: "p", text: "Khi đề cho một bản đồ “proposed”, “planned” hay ghi một năm chưa tới, người band 7 viết will be + V3 mười lần. Điều đó không sai, nhưng nó cho thấy bạn chỉ có ==một== cách nói tương lai. Tiếng Anh viết về quy hoạch có cả một thang." },
      {
        t: "table",
        head: ["Khuôn", "Nghĩa / mức chắc", "Ví dụ"],
        rows: [
          ["**is to be + V3**", "kế hoạch chính thức, đã quyết — khuôn “chuẩn” của văn quy hoạch", "The warehouse is to be demolished."],
          ["**is due to be + V3** · **is scheduled to be + V3**", "đã có lịch", "The bridge is due to be completed by 2030."],
          ["**is set to + V**", "sắp xảy ra, gần như chắc", "The car park is set to shrink by half."],
          ["**will be + V3**", "tương lai trung tính", "A cycle path will be laid along the track."],
          ["**is planned** · **there are plans to + V** · **the plan is to + V**", "nêu rõ đây là ý định", "There are plans to extend the station eastwards."],
          ["**is earmarked for + N** · **is designated as + N**", "khu đất được dành cho mục đích gì", "The waste ground is earmarked for a cycle hub."],
          ["**is expected to + V** · **is likely to + V**", "DỰ BÁO: hệ quả hoặc việc chưa chắc — dùng khi đề viết expected / possible / projected", "The work is expected to be finished by 2032."],
          ["**will have + V3 / will have been + V3 + by…**", "nhìn lại từ mốc tương lai: tới lúc đó thì đã xong", "By 2032, the forecourt will have become a public square."],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Thang chắc chắn — từ đã quyết tới dự báo",
        steps: [
          { label: "is to be · is due to be", sub: "đã quyết, có lịch" },
          { label: "is set to · will be", sub: "gần như chắc / trung tính" },
          { label: "is planned · there are plans to", sub: "ý định" },
          { label: "is expected to", sub: "dự báo có cơ sở" },
          { label: "is likely to", sub: "dự báo, kém chắc nhất" },
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + is / are + to be + V3", vi: "Khuôn nền cho mọi thay đổi đã nằm trong kế hoạch.", examples: [{ en: "The two cottages are to be knocked down and the land sold.", vi: "Hai ngôi nhà nhỏ sẽ bị phá và khu đất được bán." }] },
          { formula: "By + năm, + S + will have been + V3", vi: "Dùng MỘT lần, ở thay đổi lớn nhất, để nhìn từ mốc cuối.", examples: [{ en: "By 2040, most of the industrial estate will have been replaced by housing.", vi: "Tới năm 2040, phần lớn khu công nghiệp sẽ đã được thay bằng nhà ở." }] },
          { formula: "S, + currently / at present + N / V3, + is to be + V3", vi: "Gói hiện trạng và kế hoạch vào một câu bằng cụm chen.", examples: [{ en: "The field, currently used for grazing, is to be turned into a visitor car park.", vi: "Cánh đồng, hiện dùng để chăn thả, sẽ được chuyển thành bãi xe cho khách." }] },
          { formula: "the proposed / planned + N", vi: "Gọi tên công trình chưa có bằng tính từ, khỏi cần động từ tương lai.", examples: [{ en: "The proposed footbridge would link the two halves of the park.", vi: "Cây cầu đi bộ được đề xuất sẽ nối hai nửa công viên." }] },
        ],
      },
      {
        t: "note", title: "⚠️ Hay sai — sáu lỗi của người Việt với mốc tương lai",
        items: [
          "**will ở mọi câu.** Đổi ít nhất bốn câu sang khuôn khác. Giữ will cho 2–3 câu là tự nhiên.",
          "**be going to** trong Task 1: ~~The school is going to be built~~. Đây là khuôn nói; văn tường thuật dùng is to be / will be.",
          "~~is planned to build~~ → **is planned** (bị động trọn) / **there are plans to build** / **is to be built**.",
          "**Quên bị động**: ~~The warehouse is to demolish~~ → is to **be demolished**. Công trình không tự phá mình.",
          "**Suy diễn ngoài bản đồ**: ~~which will attract more tourists~~ · ~~so the area will be more beautiful~~. is expected / is likely to chỉ dùng cho thứ đề đã ghi là dự kiến, không dùng để đoán lợi ích.",
          "**In the future** chung chung. Bản đồ có năm thì viết năm: by 2032 · over the next decade · once the work is complete.",
        ],
      },
      { t: "rule", formula: "kế hoạch đã quyết: is to be + V3 · is due to be + V3      |      dự báo: is expected / likely to + V      |      nhìn từ mốc cuối: By 2032, S will have been + V3", vi: "Một bài 180–200 từ: bốn khuôn khác nhau là đủ. Mỗi khuôn một lý do, không rải đều cho đẹp." },
      {
        t: "quiz", id: "t5d18-viet-tuong-lai-dich", kind: "translate", grammar: "is to be + V3 · is due to be + V3 · is earmarked for · will have been + V3 by",
        title: "Dịch sang tiếng Anh — mốc tương lai (5 câu)",
        items: [
          { q: "Nhà kho sẽ bị phá để lấy chỗ cho một khách sạn. (is to be)", answers: ["The warehouse is to be demolished to make way for a hotel.", "The warehouse is to be knocked down to make way for a hotel.", "The warehouse is to be pulled down to make way for a hotel."], hint: "is to be demolished · to make way for" },
          { q: "Cây cầu mới dự kiến hoàn thành trước năm 2030. (is due)", answers: ["The new bridge is due to be completed by 2030.", "The new bridge is due to be finished by 2030.", "The new bridge is due for completion by 2030."], hint: "is due to be completed · by 2030" },
          { q: "Khu đất trống này được dành cho một trường tiểu học. (earmarked)", answers: ["This waste ground is earmarked for a primary school.", "The waste ground is earmarked for a primary school.", "This vacant land is earmarked for a primary school.", "This empty land is earmarked for a primary school.", "This empty site is earmarked for a primary school.", "This vacant site is earmarked for a primary school."], hint: "is earmarked for + N" },
          { q: "Tới năm 2035, bãi đỗ xe sẽ đã được thay bằng một công viên. (will have been)", answers: ["By 2035, the car park will have been replaced by a park.", "By 2035 the car park will have been replaced by a park.", "By 2035, the car park will have been replaced with a park."], hint: "By 2035, … will have been replaced by" },
          { q: "Có kế hoạch mở rộng thư viện về phía bắc.", answers: ["There are plans to extend the library northwards.", "There are plans to extend the library to the north.", "The library is to be extended northwards.", "The library is to be extended to the north.", "There are plans to extend the library towards the north."], hint: "There are plans to extend… northwards" },
        ],
      },

      { t: "h", text: "4. Một thì cho mỗi bản đồ — và cụm thời gian báo hiệu" },
      {
        t: "table",
        head: ["Cặp bản đồ", "Bản đồ 1", "Bản đồ 2", "Cụm báo hiệu"],
        rows: [
          ["quá khứ ↔ nay", "quá khứ đơn: there was · stood · was occupied by", "hiện tại hoàn thành bị động: has been converted", "In 1990 · Since then · Today"],
          ["nay ↔ kế hoạch (hôm nay)", "hiện tại đơn: lies · is occupied by · is taken up by", "khuôn tương lai của mục 3", "At present · Currently · Under the plan · By 2032 · Once the work is complete"],
          ["quá khứ ↔ nay ↔ kế hoạch", "quá khứ đơn", "hiện tại hoàn thành → rồi tương lai", "ba cụm, ba lần đổi thì — Tập 3 Ngày 28 mục 6"],
        ],
      },
      { t: "p", text: "Lỗi lộ nhất ở dạng “nay ↔ kế hoạch”: dùng hiện tại hoàn thành cho bản đồ tương lai (~~the car park has been replaced~~). Nó CHƯA xảy ra. Và ngược lại: dùng tương lai cho thứ đang có (~~there will be a station~~ khi nhà ga đã ở đó)." },
      { t: "rule", formula: "At present, S + V(s/es) …   →   Under the plan / By + năm, S + is to be + V3 …", vi: "Mỗi lần đổi bản đồ phải có một cụm thời gian. Không có cụm ấy, người đọc không biết bạn đang ở năm nào." },

      { t: "h", text: "5. Đề mẫu — đọc hai bản đồ trong 3 phút" },
      { t: "p", text: "**The maps below show the area around Wexcombe railway station as it is now and a plan for its redevelopment, which is due for completion in 2032. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.** (Wexcombe là địa điểm hư cấu cho bài luyện.)" },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Wexcombe Station area — now",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 14, rows: 10,
            paths: [
              { x: 0, y: 3.6, w: 14, h: 0.8, label: "Railway line" },
              { x: 0, y: 8.8, w: 14, h: 0.9, label: "Station Road" },
            ],
            boxes: [
              { x: 0.5, y: 0.4, w: 6.3, h: 2.5, label: "Goods yard (disused)" },
              { x: 7.4, y: 0.4, w: 3.6, h: 2.5, label: "Waste ground" },
              { x: 11.5, y: 1.7, w: 2, h: 1.2, label: "Signal box" },
              { x: 0.5, y: 4.8, w: 4.2, h: 3.6, label: "Car park" },
              { x: 5, y: 4.8, w: 4, h: 1.6, label: "Station building" },
              { x: 5, y: 7, w: 1.9, h: 1.4, label: "Taxi rank" },
              { x: 7.1, y: 7, w: 1.9, h: 1.4, label: "Bus stop" },
              { x: 11, y: 4.8, w: 2.5, h: 3.6, label: "Warehouse" },
            ],
            pins: [{ x: 7, y: 4, label: "Footbridge" }],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Wexcombe Station area — planned for 2032",
          note: "Bản đồ tự đặt cho bài luyện (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 14, rows: 10,
            paths: [
              { x: 0, y: 3.1, w: 14, h: 0.4, label: "Cycle path" },
              { x: 0, y: 3.6, w: 14, h: 0.8, label: "Railway line" },
              { x: 0, y: 8.8, w: 14, h: 0.9, label: "Station Road" },
            ],
            boxes: [
              { x: 0.5, y: 0.4, w: 3.6, h: 2.5, label: "Apartments" },
              { x: 4.4, y: 0.4, w: 2.4, h: 2.5, label: "Park" },
              { x: 7.4, y: 0.4, w: 3.6, h: 2.5, label: "Cycle hub (500 spaces)" },
              { x: 11.5, y: 1.7, w: 2, h: 1.2, label: "Café (old signal box)" },
              { x: 0.5, y: 4.8, w: 2, h: 3.6, label: "Multi-storey car park" },
              { x: 2.8, y: 4.8, w: 1.9, h: 3.6, label: "Bus interchange" },
              { x: 5, y: 4.8, w: 5.6, h: 1.6, label: "Station building (extended)" },
              { x: 5, y: 7, w: 4, h: 1.4, label: "Public square" },
              { x: 9.3, y: 7, w: 1.3, h: 1.4, label: "Taxi rank" },
              { x: 11, y: 4.8, w: 2.5, h: 3.6, label: "Offices and shops" },
            ],
            pins: [{ x: 7, y: 4, label: "Footbridge" }],
          },
        },
      },
      {
        t: "table", caption: "3 phút đọc bản đồ — phân loại trước khi viết",
        head: ["Loại", "Trên bản đồ Wexcombe", "Khuôn hợp"],
        rows: [
          ["**Giữ nguyên**", "tuyến đường sắt · Station Road · cầu đi bộ · lõi nhà ga", "are to be retained · will remain"],
          ["**Giữ vỏ, đổi công năng**", "signal box → café", "will survive, converted into · is to be turned into"],
          ["**Bỏ cũ, xây mới**", "goods yard → apartments + park · warehouse → offices and shops", "is to be cleared to make way for · will give way to"],
          ["**Đất trống được dùng**", "waste ground → cycle hub", "is earmarked for"],
          ["**Thu nhỏ + chia đất**", "car park → multi-storey (nửa diện tích) + bus interchange", "is due to be replaced by… on half its footprint, freeing… for"],
          ["**Mở rộng**", "station building kéo dài về phía đông", "is expected to be extended eastwards"],
          ["**Di dời**", "taxi rank sang cạnh phần mở rộng; bus stop nhập vào interchange", "is to be relocated"],
          ["**Mới hẳn**", "cycle path dọc đường ray · public square trước ga", "is to be laid · will have become"],
          ["**Hướng thay đổi**", "bắc: đất bỏ hoang → nhà ở + giải trí · nam: xe hơi → giao thông công cộng + người đi bộ", "câu overview"],
        ],
      },

      { t: "h", text: "6. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      {
        t: "passage", title: "Bài mẫu band 7 (ước tính) — 188 từ",
        paras: [
          { text: "The two maps show the area around Wexcombe Station now and the plans for its development by 2032." },
          { text: "Overall, the area will change a lot. There will be many new buildings, and the station will be bigger." },
          { text: "At present, there is a disused goods yard and some waste ground to the north of the railway line, and there is a signal box in the north-east. In the future, the goods yard will be replaced by apartments and a park. The waste ground will become a cycle hub, and the signal box will be changed into a café. A cycle path will also be built next to the railway." },
          { text: "To the south of the railway, there is a large car park in the west, a warehouse in the east, and a taxi rank and a bus stop in front of the station. By 2032, the car park will be replaced by a multi-storey car park and a bus interchange. The station building will be extended. The taxi rank will move to the east and there will be a public square. The warehouse will be replaced by offices and shops." },
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 8 (ước tính) — 233 từ",
        paras: [
          { text: "The maps compare the present layout of the area around Wexcombe Station with the redevelopment that is planned for completion by 2032." },
          { text: "Overall, the scheme is intended to bring the derelict land north of the railway back into use for housing and leisure, and to reorganise the southern side around public transport and pedestrians rather than private cars. The station building itself, the footbridge and both transport corridors are to be retained." },
          { text: "North of the line, the disused goods yard is to be cleared to make way for apartments and a small park, while the adjoining waste ground is earmarked for a 500-space cycle hub. The old signal box will survive, converted into a café, and a cycle path is to be laid along the full length of the track." },
          { text: "South of the line, the most striking change concerns parking: the surface car park, which currently occupies the whole south-western corner, is due to be replaced by a multi-storey building on half its footprint, freeing the remaining land for a bus interchange. The station building is expected to be extended eastwards, and the forecourt, at present taken up by a taxi rank and a bus stop, will have become a public square by the time the work is finished. The taxi rank is to be relocated beside the extension, and the warehouse at the eastern end will give way to offices and shops." },
        ],
      },
      {
        t: "table", caption: "Khác nhau ở đâu — bốn tiêu chí",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["TA — overview", "“will change a lot… many new buildings” — đúng với mọi bản đồ trên đời", "hai hướng thay đổi theo CHỨC NĂNG (đất bỏ hoang → nhà ở, giải trí; xe hơi → giao thông công cộng, người đi bộ) + ba thứ được giữ"],
          ["TA — chi tiết", "đủ, nhưng mỗi công trình một câu ngang hàng nhau", "nêu cái nổi bật: “the most striking change concerns parking”; số liệu duy nhất trên bản đồ (500 chỗ) được dùng; “on half its footprint” là một so sánh"],
          ["CC", "At present… In the future… — đúng; trong đoạn chỉ liệt kê", "mở đoạn bằng vị trí (North of the line, · South of the line,); trong đoạn đi từ lớn tới nhỏ; không có also"],
          ["LR", "replace × 3 · become · changed into · move", "be cleared · make way for · be earmarked for · survive · be laid · footprint · forecourt · be relocated · give way to"],
          ["GRA", "will be + V3 × 9; there is / there will be", "are to be retained · is to be cleared · is earmarked for · is due to be replaced · is expected to be extended · will have become… by the time · hai mệnh đề rút gọn (converted into… · freeing…)"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — vì sao bài band 8 không dùng is likely to",
        items: [
          "Đề viết “a plan… due for completion in 2032”: đây là kế hoạch đã quyết, không phải dự báo. Vì thế bài dùng is to be / is due to be là chính.",
          "**is expected to** xuất hiện một lần (phần mở rộng nhà ga) để đổi khuôn; vẫn hợp vì mọi kế hoạch đều là điều được trông đợi.",
          "**is likely to** để dành cho đề có chữ possible, proposed options, hoặc bản đồ dự báo (ví dụ đường bờ biển năm 2050). Dùng nó ở đề này là tự hạ mức chắc mà đề không cho.",
        ],
      },

      { t: "h", text: "7. Gói thay đổi có tương lai — sáu khuôn band 8" },
      {
        t: "table",
        head: ["Khuôn", "Gói được gì", "Ví dụ (bản đồ một bến xe hư cấu)"],
        rows: [
          ["S is to be cleared / demolished **to make way for** + N", "bỏ cũ + xây mới", "The depot is to be demolished to make way for a market hall."],
          ["S is to be replaced by N **on half / a third of its footprint**", "thay + thu nhỏ", "The car park is to be replaced by a smaller one on a third of its footprint."],
          ["…, **freeing (up)** + N + **for** + N", "hệ quả về đất", "…, freeing up the northern strip for a row of trees."],
          ["S **will survive, converted into** + N", "giữ vỏ + đổi công năng", "The clock tower will survive, converted into a viewing platform."],
          ["S, **at present taken up by** + N, **will have become** + N **by**…", "hiện trạng + kết quả nhìn từ mốc cuối", "The yard, at present taken up by parked coaches, will have become a garden by 2030."],
          ["**With** + N + V3 / V-ing, S + V", "thay đổi phụ làm nền cho thay đổi chính", "With the ticket office moved indoors, the forecourt is to be pedestrianised."],
        ],
      },
      {
        t: "quiz", id: "t5d18-viet-goi", kind: "fill",
        title: "Điền MỘT từ để hoàn thành câu gói (6 câu, bản đồ một khu chợ hư cấu)",
        items: [
          { q: "1. The old market hall is to be cleared to make ___ for a library.", answers: ["way"], hint: "make way for" },
          { q: "2. The lorry park is to be halved in size, ___ up space for a playground.", answers: ["freeing"], hint: "…, freeing up + N + for" },
          { q: "3. The water tower will survive, ___ into a restaurant.", answers: ["converted", "turned"], hint: "survive, converted into" },
          { q: "4. The square, at present taken ___ by stalls, will have become a garden by 2031.", answers: ["up"], hint: "taken up by = bị chiếm bởi" },
          { q: "5. The northern strip is ___ for housing. (được dành cho)", answers: ["earmarked", "designated", "reserved"], hint: "is earmarked for" },
          { q: "6. By 2031, a tram stop will ___ been built beside the entrance.", answers: ["have"], hint: "will have been built" },
        ],
      },

      { t: "h", text: "8. Biến thể — sơ đồ mặt bằng (floor plan) của một toà nhà" },
      { t: "p", text: "Đề có thể không cho một khu phố mà cho ==mặt bằng một toà nhà== trước và sau cải tạo. Mọi thứ ở trên vẫn dùng được; chỉ đổi từ vựng: không còn road, field, estate mà là room, wall, corridor." },
      {
        t: "table",
        head: ["Việc", "Từ vựng floor plan", "Ví dụ"],
        rows: [
          ["Vị trí trong nhà", "at the front / rear · on the left-hand side · adjoining · opposite · off the corridor · in the centre", "The kitchen is at the rear, adjoining the store room."],
          ["Chia một phòng", "be divided into · be partitioned into · be split into", "The hall is to be divided into two studios."],
          ["Gộp hai phòng", "be knocked through · be merged · be combined to form", "The two offices are to be knocked through to form a café."],
          ["Đổi công năng", "be converted into · be fitted out as · serve as", "The dormitory will be fitted out as a rehearsal room."],
          ["Mở ra ngoài", "open onto · give access to · lead to", "The café will open onto a terrace."],
          ["Lối vào", "the main entrance · be moved to · a new doorway is to be made in", "The main entrance is to be moved to the south wall."],
          ["Ngoài trời", "yard · courtyard · terrace · garden", "The yard is to be landscaped as a garden."],
        ],
      },
      {
        t: "note", title: "📌 Overview của floor plan",
        items: [
          "Vẫn hai câu hỏi của mục 1: toà nhà đổi từ ==chức năng== gì sang gì; cái gì giữ (tường ngoài, hình dáng, vị trí các khu).",
          "Thêm một trục riêng: ==không gian kín → mở== hay ==ít phòng lớn → nhiều phòng nhỏ== (hoặc ngược lại).",
          "Ví dụ: Overall, the building is to be converted from a workplace into a public venue: its outer walls will remain, but the large internal spaces are to be subdivided and the yard opened to visitors.",
        ],
      },
      { t: "rule", formula: "floor plan:  be divided into  ·  be knocked through to form  ·  be fitted out as  ·  open onto      +      khuôn tương lai của mục 3", vi: "Chia thân bài theo KHU của toà nhà (phía trước / phía sau / ngoài trời), không theo từng phòng." },

      { t: "h", text: "9. Kiểm tra cuối bài (6 câu)" },
      {
        t: "mcq", id: "t5d18-viet-kiem", title: "Chọn phương án đúng",
        items: [
          { q: "1. Overview nào đạt mức band 8 cho bản đồ “hiện trạng ↔ kế hoạch”?", options: ["Overall, there will be many changes in the area.", "Overall, the plan would turn a largely industrial site into a residential one, while keeping the main road and the church.", "Overall, I think the new plan is much better for residents."], correct: 1, why: "B gọi tên hướng thay đổi về chức năng + cái được giữ. A rỗng. C nêu ý kiến — Task 1 không có ý kiến." },
          { q: "2. Câu nào đúng ngữ pháp?", options: ["The factory is to demolish next year.", "The factory is planned to demolish.", "The factory is to be demolished next year."], correct: 2, why: "is to be + V3 (bị động). A thiếu be; B sai khuôn is planned to + V." },
          { q: "3. Đề ghi “the plan, due for completion in 2030”. Khuôn nào KHÔNG hợp làm khuôn chính?", options: ["is to be + V3", "is likely to be + V3", "is due to be + V3"], correct: 1, why: "Kế hoạch đã quyết ⇒ không hạ xuống mức dự báo kém chắc. is likely to dành cho đề có chữ possible / projected." },
          { q: "4. Bản đồ 1 là hiện trạng, bản đồ 2 là kế hoạch. Câu nào dùng thì SAI?", options: ["At present, a car park occupies the western side.", "Under the plan, the car park has been replaced by a hotel.", "By 2030, the car park will have been replaced by a hotel."], correct: 1, why: "Kế hoạch CHƯA xảy ra ⇒ không dùng hiện tại hoàn thành. Dùng is to be replaced / will have been replaced by 2030." },
          { q: "5. “The hall is to be ___ two studios.”", options: ["divided into", "knocked through", "opened onto"], correct: 0, why: "Chia một phòng thành hai ⇒ be divided into. knock through = đục thông hai phòng thành một." },
          { q: "6. Câu nào suy diễn NGOÀI bản đồ (phải xoá)?", options: ["The signal box will survive, converted into a café.", "A cycle hub with 500 spaces is planned north of the line.", "The new square is likely to make the area far more attractive to tourists."], correct: 2, why: "Bản đồ không nói gì về du khách hay độ hấp dẫn. Task 1 chỉ tả cái nhìn thấy." },
        ],
      },

      { t: "h", text: "10. Viết bài — AI chấm 4 tiêu chí (mỗi bài 20 phút)" },
      {
        t: "table", caption: "Phân giờ 20 phút cho map band 8",
        head: ["Phút", "Việc", "Sản phẩm"],
        rows: [
          ["0–3", "đọc đề + hai bản đồ; phân loại như bảng ở mục 5", "5–6 dòng ghi chú; một dòng “hướng thay đổi”"],
          ["3–5", "viết mở bài (paraphrase đề) + overview hai câu", "≈ 60 từ"],
          ["5–16", "hai thân bài theo khu; mỗi đoạn mở bằng một cụm vị trí", "≈ 130 từ; ít nhất bốn khuôn tương lai"],
          ["16–20", "soát bốn lượt của Bài 1 Ngày 17 (danh từ → động từ → giới từ → dấu phẩy) + kiểm thì từng bản đồ", "không quá một câu có lỗi"],
        ],
      },
      {
        t: "essay", id: "t5d18-viet-bai", task: "Task 1", minWords: 150,
        prompt: "The maps show the area around Wexcombe railway station as it is now and a plan for its redevelopment, which is due for completion in 2032. NOW — north of the railway line: a disused goods yard (west), waste ground (centre), a signal box (north-east). South of the line: a large surface car park (south-west), the station building (centre) with a taxi rank and a bus stop in front of it, a warehouse (east). A footbridge crosses the line; Station Road runs along the southern edge. PLAN FOR 2032 — north of the line: apartments and a park on the goods yard; a 500-space cycle hub on the waste ground; the signal box converted into a café; a cycle path along the whole length of the track. South of the line: a multi-storey car park on half the old car park, with a bus interchange on the other half; the station building extended eastwards; a public square in front of the station; the taxi rank moved to the east, beside the extension; offices and shops in place of the warehouse. The railway line, Station Road and the footbridge remain. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview hai câu: (1) hai hướng thay đổi về chức năng; (2) cái được giữ.",
          "Thân 1: phía bắc đường ray. Thân 2: phía nam. Mỗi đoạn mở bằng North / South of the line, …",
          "Hiện trạng: hiện tại đơn. Kế hoạch: is to be · is due to be · is earmarked for · will have… by — ít nhất bốn khuôn.",
          "Không giải thích lý do, không khen chê, không đoán lợi ích.",
          "Đã đọc bài mẫu band 8 thì đóng nó lại trước khi viết; viết xong mới so.",
        ],
      },
      { t: "p", text: "**Đề 2 — sơ đồ mặt bằng.** The plans below show the ground floor of a disused fire station as it is now and as it will look after its planned conversion into a community arts centre in 2028. (Toà nhà hư cấu.)" },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Former fire station, ground floor — now",
          note: "Sơ đồ tự đặt cho bài luyện (toà nhà hư cấu). Phía bắc ở trên; Bridge Street ở phía nam.",
          map: {
            cols: 12, rows: 9,
            paths: [{ x: 0, y: 7.4, w: 12, h: 0.9, label: "Bridge Street" }],
            boxes: [
              { x: 0.5, y: 0.3, w: 11, h: 1.4, label: "Drill yard (open air)" },
              { x: 0.5, y: 2, w: 6, h: 4.6, label: "Engine bay" },
              { x: 6.8, y: 2, w: 2.3, h: 2, label: "Watch room" },
              { x: 9.4, y: 2, w: 2.1, h: 2, label: "Kitchen" },
              { x: 6.8, y: 4.4, w: 4.7, h: 2.2, label: "Dormitory" },
            ],
            pins: [{ x: 3.5, y: 6.9, label: "Vehicle doors" }, { x: 9.2, y: 6.9, label: "Side door" }],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Community arts centre, ground floor — planned for 2028",
          note: "Sơ đồ tự đặt cho bài luyện (toà nhà hư cấu). Phía bắc ở trên.",
          map: {
            cols: 12, rows: 9,
            paths: [{ x: 0, y: 7.4, w: 12, h: 0.9, label: "Bridge Street" }],
            boxes: [
              { x: 0.5, y: 0.3, w: 6.8, h: 1.4, label: "Sculpture garden" },
              { x: 7.6, y: 0.3, w: 3.9, h: 1.4, label: "Café terrace" },
              { x: 0.5, y: 2, w: 4, h: 4.6, label: "Performance hall (150 seats)" },
              { x: 4.7, y: 2, w: 1.8, h: 4.6, label: "Foyer and box office" },
              { x: 6.8, y: 2, w: 4.7, h: 2, label: "Café" },
              { x: 6.8, y: 4.4, w: 2.3, h: 2.2, label: "Studio 1" },
              { x: 9.3, y: 4.4, w: 2.2, h: 2.2, label: "Studio 2" },
            ],
            pins: [{ x: 5.6, y: 6.9, label: "Main entrance" }],
          },
        },
      },
      {
        t: "essay", id: "t5d18-viet-bai-2", task: "Task 1", minWords: 150,
        prompt: "The plans show the ground floor of a disused fire station as it is now and as it will look after its planned conversion into a community arts centre in 2028. NOW — a large engine bay occupies the western two-thirds of the building, with vehicle doors onto Bridge Street to the south. On the eastern side there are a watch room and a kitchen at the rear and a dormitory at the front, reached by a side door. Behind the building, along its whole northern side, is an open-air drill yard. PLAN FOR 2028 — the engine bay is divided into a 150-seat performance hall (west) and a foyer with a box office (east of the hall); the vehicle doors are replaced by a single main entrance into the foyer, and the side door is removed. The watch room and kitchen are combined into a café; the dormitory is divided into two studios. The drill yard becomes a sculpture garden (west) and a café terrace (east). The outer walls are unchanged. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: nơi làm việc khép kín → nơi công cộng; tường ngoài giữ nguyên; không gian lớn bị chia nhỏ, sân sau mở cho khách.",
          "Chia thân bài theo khu: nửa tây (engine bay) · nửa đông (ba phòng) · ngoài trời (yard).",
          "Từ vựng mục 8: be divided into · be knocked through / combined to form · open onto · the main entrance is to be moved.",
          "Hiện trạng: hiện tại đơn. Kế hoạch: bốn khuôn tương lai. Một câu By 2028, … will have been…",
        ],
      },
      {
        t: "note", title: "📌 Bảng tự soát band 8 cho map (2 phút)",
        items: [
          "Overview có nói ==hướng thay đổi về chức năng== và ==cái được giữ== không?",
          "Mỗi bản đồ một thì? Mỗi lần đổi bản đồ có cụm thời gian (At present · Under the plan · By 2032)?",
          "Đếm will: nhiều hơn ba ⇒ đổi bớt sang is to be / is due to be / is earmarked for.",
          "Có câu nào suy diễn ngoài bản đồ (lý do, lợi ích, cảm nhận) không? Xoá.",
          "Mọi động từ thay đổi đã bị động và đúng giới từ (converted into · replaced by · make way for · give way to)?",
        ],
      },
    ],
  },
  /* ════════════════ BÀI 3 — NÓI: ĐÀM PHÁN & PHẢN BIỆN LỊCH SỰ (E10 PHẦN 2) ════════════════ */
  {
    id: "t5d18-noi",
    kind: "speaking",
    title: "Nói: Đàm phán và phản biện lịch sự — phần 2 (E10): khi đề xuất đầu bị từ chối, thương lượng nhiều vòng có người thứ ba, hedging giao tiếp đúng liều; Part 3 khi giám khảo đẩy hai lần",
    goal: "Đi tiếp được một cuộc thương lượng sau khi đề xuất đầu tiên bị từ chối mà không lặp lại cũng không nhượng hết: hỏi ra lợi ích thật sau lập trường, đổi một thứ lấy một thứ, nêu giới hạn đỏ bằng sự kiện, tạm dừng có hẹn; biết rào lời đề nghị và tin xấu đúng liều (không cộc, không lảng tránh); giữ được lượt lời và làm đồng minh khi có người thứ ba; và ở Part 3 giữ vững ý khi giám khảo đẩy lần thứ hai hoặc diễn giải sai ý mình.",
    minutes: 90,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đây là **phần 2** của mã E10. Phần 1 (**Ngày 15 Bài 3**) đã dạy thang năm nấc phản đối, ngữ điệu xuống–lên và năm bước của MỘT vòng thương lượng (công nhận → ràng buộc → đề xuất có điều kiện → kiểm tra → chốt). Hôm nay không dạy lại; có năm câu kiểm tra đầu bài.",
          "Phần 2 bắt đầu đúng chỗ phần 1 dừng: bạn đã đề xuất, và bên kia nói ==“I'm afraid that won't work.”== Làm gì tiếp?",
          "Bốn nước đi của vòng hai: **hỏi lý do thật** · **đổi một thứ lấy một thứ** · **nêu giới hạn đỏ** · **tạm dừng có hẹn**.",
          "**Hedging giao tiếp đúng liều**: rào lời đề nghị và tin xấu; KHÔNG rào con số, hạn chót, giới hạn đỏ. Nối Ngày 6 (rào dữ kiện khi lập luận) và Bài 1 hôm nay (nói giảm).",
          "**Ba người**: chen lời lịch sự, giữ lượt lời, làm đồng minh, tóm lại hai lập trường.",
          "Đẩy **Fluency & Coherence** và **Lexical Resource** của Speaking Part 3: band 8 giữ được ý khi bị đẩy lần hai, và sửa được khi giám khảo diễn giải sai (“So you're saying…?”).",
        ],
      },

      { t: "h", text: "1. Ôn 2 phút — phần 1 đã cho bạn những gì" },
      {
        t: "table",
        head: ["Phần 1 (Ngày 15)", "Khung nhớ nhanh"],
        rows: [
          ["Thang phản đối", "① That's true up to a point, but… → ② I'm not sure it's quite that simple. → ③ I see it rather differently. → ④ I'm afraid I really can't agree."],
          ["Sửa trọng tâm", "It's not so much X as Y. · If anything, …"],
          ["Năm bước một vòng", "I can see why that matters → What worries me is + sự kiện → If you could…, I'd be able to… → Would that work for you? → I'll put it in writing."],
          ["Ngữ điệu", "xuống–lên ở phần công nhận; xuống ở ý của mình"],
        ],
      },
      {
        t: "mcq", id: "t5d18-noi-on", title: "Kiểm tra đầu bài — ôn Ngày 15 Bài 3 (5 câu mới)",
        items: [
          { q: "1. Đồng nghiệp: “Unit tests are a waste of time on a small project.” Bạn đồng ý một phần. Câu hợp nhất:", options: ["You're wrong.", "There's something in that for a prototype, though I'd say they pay off as soon as two people touch the code.", "Yes, maybe, I don't know."], correct: 1, why: "Nấc ①: công nhận phần đúng rồi rẽ. A cộc; C không có lập trường." },
          { q: "2. Bước ② của một vòng thương lượng (nêu ràng buộc) nên là:", options: ["You gave us too little time.", "What worries me is that the server hasn't been load-tested yet.", "I feel very stressed about this."], correct: 1, why: "Ràng buộc nêu bằng SỰ KIỆN, chủ ngữ không phải you, không phải cảm xúc." },
          { q: "3. “___ you could give me until Monday, I'd be able to include the test results.”", options: ["Unless", "If", "Although"], correct: 1, why: "Đề xuất có điều kiện: If you could…, I'd be able to…" },
          { q: "4. “It's not so ___ a question of cost as of trust.”", options: ["much", "many", "far"], correct: 0, why: "not so much A as B — sửa trọng tâm." },
          { q: "5. Câu “That's true up to a point” nên kết thúc bằng giọng:", options: ["xuống hẳn", "xuống rồi lên", "ngang"], correct: 1, why: "Xuống–lên báo còn chữ but phía sau." },
        ],
      },
      { t: "p", text: "Sai từ 2 câu: làm lại **Ngày 15 Bài 3 mục 2 và mục 5** (20 phút) rồi quay lại. Phần 2 xây thẳng trên hai mục ấy." },

      { t: "h", text: "2. Khi đề xuất đầu tiên bị từ chối — bốn nước đi của vòng hai" },
      { t: "p", text: "Bên kia vừa nói: “I'm afraid that won't work for us.” Người chưa quen thương lượng thường làm một trong hai việc: ==nói lại đề xuất cũ, to hơn== (thành cãi), hoặc ==nhượng hết== (“OK, we'll try”) rồi giao hàng lỗi. Người thương lượng giỏi có bốn nước đi khác." },
      {
        t: "table",
        head: ["Nước đi", "Để làm gì", "Khung câu", "Lỗi cần tránh"],
        rows: [
          ["① **Hỏi lý do thật**", "tìm LỢI ÍCH sau lập trường (mục 3)", "Can I ask what's behind the date? · Help me understand what the main concern is. · What would a good outcome look like for you?", "hỏi “Why?” trần — nghe như chất vấn"],
          ["② **Đổi một thứ lấy một thứ**", "nhượng có điều kiện, không nhượng không", "I could move on X if you could move on Y. · If we dropped A from this release, I could have B ready by… · What if we looked at the two together?", "nhượng trước, xin sau: “OK I'll do it… but can you maybe…?”"],
          ["③ **Nêu giới hạn đỏ**", "nói rõ thứ KHÔNG đổi được, bằng sự kiện", "That's the one thing I can't move on, I'm afraid. · …is off the table, because + sự kiện. · I'd be misleading you if I said we could.", "rào giới hạn đỏ (“maybe it's a bit difficult”) ⇒ bên kia tưởng còn ép được"],
          ["④ **Tạm dừng có hẹn**", "không quyết khi chưa đủ thông tin / quyền", "Can I come back to you on that by Thursday? · I'd need to check with the team before I commit. · Let's park that and come back to it.", "im lặng, hoặc hứa bừa cho xong cuộc họp"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "I could + V (nhượng) + if + you could + V (đổi lại)", vi: "Trao đổi: cả hai vế cùng dùng could — chưa ai cam kết.", examples: [{ en: "I could bring the date forward a week if you could freeze the design today.", vi: "Tôi có thể đẩy ngày lên sớm một tuần nếu hôm nay anh chốt thiết kế." }] },
          { formula: "Can I ask what's behind + N?  /  Help me understand + wh- + S + V", vi: "Hỏi lý do mà không chất vấn.", examples: [{ en: "Help me understand why the report has to be weekly.", vi: "Giúp tôi hiểu vì sao báo cáo phải theo tuần." }] },
          { formula: "N + is off the table, because + sự kiện.  But + phương án khác", vi: "Giới hạn đỏ: nói thẳng, kèm lý do đo được, rồi mở ngay một cửa khác.", examples: [{ en: "A full refund is off the table, because the licence has already been used. But we could offer three months' free support.", vi: "Hoàn tiền toàn bộ thì không được, vì giấy phép đã dùng rồi. Nhưng chúng tôi có thể tặng ba tháng hỗ trợ." }] },
          { formula: "Can I come back to you (on that) + by + mốc?", vi: "Tạm dừng có hẹn — luôn kèm một mốc.", examples: [{ en: "Can I come back to you on the price by Friday noon?", vi: "Tôi trả lời anh về giá trước trưa thứ Sáu được không?" }] },
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở vòng hai",
        items: [
          "**“Yes” nghĩa là “tôi nghe rồi”.** Trong tiếng Anh, Yes / OK / Sure là LỜI CAM KẾT. Chưa đồng ý thì nói I see. / Right. / I hear you.",
          "**Nhượng để giữ hoà khí** rồi về kể khó với đồng đội. Bên kia không biết bạn đã nhượng quá sức; họ chỉ biết bạn đã hứa.",
          "**Từ chối bằng lý do mơ hồ**: It's difficult. Người bản ngữ hiểu difficult = làm được nếu cố. Muốn nói không, nói: That's not possible, because…",
          "**Coi tạm dừng là mất mặt.** “Can I come back to you by Thursday?” là câu của người có trách nhiệm, không phải của người yếu.",
        ],
      },
      { t: "rule", formula: "bị từ chối  →  ① Can I ask what's behind…?  →  ② I could… if you could…  →  ③ X is off the table, because…  →  ④ Can I come back to you by…?", vi: "Không lặp lại đề xuất cũ. Không nhượng mà không lấy lại gì. Mọi lời hẹn có mốc." },
      {
        t: "quiz", id: "t5d18-noi-vong-hai", kind: "fill",
        title: "Điền MỘT từ để hoàn thành khung của vòng hai (8 câu)",
        items: [
          { q: "1. Can I ask what's ___ the deadline?", answers: ["behind"], hint: "what's behind + N = lý do đằng sau" },
          { q: "2. Help me ___ what the main concern is.", answers: ["understand"], hint: "Help me understand…" },
          { q: "3. I could move ___ the price if you could commit to two years.", answers: ["on"], hint: "move on sth = nhượng về điểm đó" },
          { q: "4. A discount is ___ the table, I'm afraid, but free delivery isn't.", answers: ["off"], hint: "off the table — Bài 1 mục 4" },
          { q: "5. That's the one thing I can't ___ on.", answers: ["move", "budge", "compromise"], hint: "can't move on" },
          { q: "6. Can I come ___ to you on that by Monday?", answers: ["back"], hint: "come back to you" },
          { q: "7. Let's ___ that for now and come back to it at the end.", answers: ["park"], hint: "park an issue = tạm gác" },
          { q: "8. I'd need to check with the team before I ___ to a date.", answers: ["commit"], hint: "commit to a date" },
        ],
      },

      { t: "h", text: "3. Lập trường và lợi ích — hỏi để tìm cái bên kia thật sự cần" },
      { t: "p", text: "**Lập trường** (position) là điều người ta ĐÒI: “phải có trước thứ Sáu”. **Lợi ích** (interest) là lý do sau nó: “thứ Sáu tôi phải trình bày với hội đồng”. Hai lập trường thường chọi nhau; hai lợi ích thì hay ==xếp vừa được cả hai==. Nước đi ① tồn tại để lôi lợi ích ra." },
      {
        t: "table",
        head: ["Họ nói (lập trường)", "Bạn hỏi", "Lợi ích lộ ra", "Phương án mở ra"],
        rows: [
          ["We need the whole feature by Friday.", "Can I ask what's happening on Friday?", "một buổi trình diễn với nhà đầu tư", "bản chạy được cho đúng kịch bản trình diễn"],
          ["We want a 20 per cent discount.", "What would the discount let you do?", "ngân sách năm nay đã hết", "giữ giá, chuyển một phần hoá đơn sang quý sau"],
          ["I want to present without slides.", "What are you hoping it'll change?", "sợ cả nhóm đọc slide, không nhìn khán giả", "ba slide chỉ có hình, không chữ"],
          ["The report must be weekly.", "Help me understand who reads it.", "sếp chỉ cần biết khi nào có rủi ro", "báo hai tuần một lần + báo ngay khi có rủi ro"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — ba câu hỏi mở không nghe như chất vấn",
        items: [
          "**Can I ask what's behind…?** — xin phép + what, không phải why.",
          "**What would a good outcome look like for you?** — hỏi về đích, không hỏi về đòi hỏi.",
          "**I may be missing something, but…** — nhận phần thiếu về mình trước khi hỏi (mục 4).",
          "Tránh **Why do you need that?** Câu hỏi why + you trực diện khiến người kia phải tự bào chữa.",
        ],
      },

      { t: "h", text: "4. Hedging giao tiếp đúng liều — rào cái gì, không rào cái gì" },
      { t: "p", text: "Ở Ngày 6 bạn học: khi lập luận, ==rào dữ kiện, không rào ý kiến==. Trong giao tiếp công việc, luật đổi một chút: ==rào lời đề nghị và tin xấu; không rào con số, hạn chót và giới hạn đỏ==." },
      {
        t: "table",
        head: ["Tình huống", "Quá ít (cộc)", "Đúng liều", "Quá nhiều (lảng tránh)"],
        rows: [
          ["Xin một việc", "Send me the logs.", "I was wondering if you could send me the logs.", "I don't know if it's possible, but maybe, if you have time, perhaps the logs…?"],
          ["Báo tin xấu", "The demo failed.", "I'm afraid the demo didn't go quite as planned — the login step failed twice.", "There may possibly have been one or two slight issues, sort of."],
          ["Sửa người khác", "You're wrong, it's 14.", "I may be wrong, but I think the figure's 14, not 40.", "(không nói gì, để con số sai đi tiếp)"],
          ["Góp ý", "This design is bad.", "The layout leaves a bit to be desired on mobile — could we look at the menu?", "It's nice, really, it's fine… maybe… no, it's fine."],
          ["Nêu hạn chót", "—", "I need it by Thursday at five. (==không rào==)", "It would be sort of nice to maybe have it around Thursday-ish."],
        ],
      },
      {
        t: "table", caption: "Năm công cụ rào của giao tiếp — mỗi câu chỉ dùng MỘT",
        head: ["Công cụ", "Khuôn", "Ví dụ"],
        rows: [
          ["Thì lùi", "I was wondering if… · I was hoping to… · I wanted to ask…", "I was hoping we could move the meeting to three."],
          ["Phủ định + câu hỏi", "Wouldn't it be simpler to…? · I don't suppose you could…? · You couldn't…, could you?", "I don't suppose you could look at this before lunch?"],
          ["Nhận phần sai về mình", "I may be missing something, but… · Correct me if I'm wrong, but… · Maybe I've misunderstood, but…", "Correct me if I'm wrong, but didn't we agree on two rounds of testing?"],
          ["Chữ thu nhỏ", "a bit · slightly · just · a little · quite", "Could I just add one thing? · That's slightly more than we budgeted."],
          ["Nói giảm (Bài 1 nhóm E)", "less than ideal · not exactly · on the … side · leaves something to be desired", "The timing's less than ideal, but it's workable."],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — khi hedging thành lảng tránh",
        items: [
          "Rào **con số, ngày, tiền, lỗi an toàn** là nguy hiểm: người nghe không biết đâu là sự thật. Nói thẳng: The server will be down from two to four.",
          "Rào **giới hạn đỏ** là tự hại: “It might be a bit difficult” được nghe thành “ép thêm chút nữa là được”.",
          "Chồng ba lớp rào trong một câu ⇒ bạn nghe **evasive** (Bài 1 mục 5). Một câu, một công cụ.",
          "Ở Speaking Part 3, giám khảo không chấm lịch sự; họ chấm độ rõ. Rào mọi câu bằng maybe / perhaps / I'm not sure làm mất FC. Rào ==một lần, đúng chỗ==.",
        ],
      },
      { t: "rule", formula: "RÀO: lời đề nghị · tin xấu · lời sửa · góp ý        KHÔNG RÀO: con số · hạn chót · giới hạn đỏ · điều đã thống nhất", vi: "Một câu, một công cụ rào. Chồng nhiều lớp là lảng tránh." },
      {
        t: "quiz", id: "t5d18-noi-hedge-dich", kind: "translate", grammar: "I was wondering if… · I may be missing something, but… · I don't suppose you could…?",
        title: "Dịch sang tiếng Anh — rào đúng liều (4 câu)",
        items: [
          { q: "Tôi đang tự hỏi liệu chúng ta có thể dời cuộc họp sang thứ Năm không.", answers: ["I was wondering if we could move the meeting to Thursday.", "I was wondering whether we could move the meeting to Thursday.", "I was wondering if we could postpone the meeting to Thursday.", "I was wondering if we could reschedule the meeting for Thursday."], hint: "I was wondering if we could…" },
          { q: "Có thể tôi bỏ sót điều gì, nhưng tôi nghĩ con số này sai.", answers: ["I may be missing something, but I think this figure is wrong.", "I may be missing something, but I think the figure is wrong.", "I might be missing something, but I think this figure is wrong.", "I may be missing something, but I think this number is wrong."], hint: "I may be missing something, but…" },
          { q: "E là điều đó không thực hiện được, vì hợp đồng đã ký rồi. (không rào giới hạn đỏ)", answers: ["I'm afraid that's not possible, because the contract has already been signed.", "I'm afraid that is not possible, because the contract has already been signed.", "I'm afraid that's not possible because the contract has already been signed.", "I'm afraid that isn't possible, because the contract has already been signed.", "I'm afraid that's not possible, because the contract has been signed."], hint: "I'm afraid that's not possible, because + sự kiện" },
          { q: "Tôi trả lời anh về chuyện này trước thứ Sáu được không?", answers: ["Can I come back to you on this by Friday?", "Can I come back to you on that by Friday?", "Could I come back to you on this by Friday?", "Can I get back to you on this by Friday?", "Could I get back to you on this by Friday?", "Can I come back to you about this by Friday?"], hint: "Can I come back to you on this by Friday?" },
        ],
      },

      { t: "h", text: "5. Khi có người thứ ba — chen lời, giữ lượt, làm đồng minh" },
      {
        t: "table",
        head: ["Việc", "Khung câu", "Ghi chú"],
        rows: [
          ["Chen lời lịch sự", "Sorry to cut in — … · Could I just come in here? · Before we move on, can I add one thing?", "xin lỗi + lý do ngắn; nói xong trả lượt: Sorry, go on."],
          ["Giữ lượt khi bị ngắt", "Could I just finish this point? · If I could just finish — … · I'll come to that in a second.", "giọng bình thường, không cao lên; just là chữ làm mềm"],
          ["Làm đồng minh", "Building on what Lan said, … · I'd echo that. · That fits with what we're seeing on our side.", "nhắc tên người kia ⇒ họ được ghi nhận"],
          ["Tóm lại hai lập trường", "Can I check I've understood both positions? · So, if I've got this right, you need X and we need Y.", "người tóm tắt là người dẫn cuộc họp"],
          ["Kéo hai bên lại gần", "I think we're closer than it sounds. · It sounds as if the real sticking point is…", "gọi tên điểm vướng DUY NHẤT còn lại"],
          ["Tạm gác", "Let's park that and come back to it. · Can we take that offline?", "take sth offline = bàn riêng sau cuộc họp"],
        ],
      },

      { t: "h", text: "6. Hội thoại mẫu — ba người, ba vòng" },
      { t: "canh", anh: ["woman-technologist", "man-office-worker", "woman-office-worker"], caption: "Một công ty phần mềm ở Đà Nẵng làm ứng dụng đặt lịch cho một chuỗi phòng khám ở Anh. Hai tuần trước ngày ra mắt, Tom (phụ trách sản phẩm bên khách hàng) muốn thêm tính năng trả góp. Lan là trưởng nhóm lập trình; Meera là quản lý khách hàng của công ty Lan." },
      {
        t: "dialogue", title: "Hội thoại mẫu — “Can I ask what's behind the date?”",
        lines: [
          { who: "Tom", role: "a", text: "Lan, thanks for making time. I'll get straight to it: we'd like instalment payments in the app for launch. Our clinics are asking for it.", vi: "Lan, cảm ơn chị đã dành thời gian. Tôi vào thẳng việc: chúng tôi muốn có thanh toán trả góp trong ứng dụng khi ra mắt. Các phòng khám đang đòi." },
          { who: "Lan", role: "b", text: "Thanks, Tom. I can see why — it'd be a real selling point. I was wondering, though, whether it has to be there on launch day itself. What if we shipped it three weeks after?", vi: "Cảm ơn Tom. Tôi hiểu vì sao — đó sẽ là điểm bán hàng thật sự. Tôi chỉ đang tự hỏi liệu nó có nhất thiết phải có đúng ngày ra mắt không. Nếu mình phát hành sau đó ba tuần thì sao?" },
          { who: "Tom", role: "a", text: "I'm afraid that won't work. Three weeks after launch is too late for us.", vi: "Tôi e là không được. Ba tuần sau ra mắt là quá muộn với chúng tôi." },
          { who: "Lan", role: "b", text: "OK. Can I ask what's behind the date? I may be missing something, but I'd assumed the clinics could start without it.", vi: "Vâng. Tôi hỏi được không, đằng sau cái ngày ấy là gì? Có thể tôi bỏ sót điều gì, nhưng tôi vẫn nghĩ các phòng khám có thể bắt đầu mà chưa cần nó." },
          { who: "Tom", role: "a", text: "Most could. The problem is the two largest groups. They've made it a condition of signing, and they sign on the twentieth.", vi: "Phần lớn thì được. Vấn đề là hai chuỗi lớn nhất. Họ đặt nó làm điều kiện ký hợp đồng, và họ ký ngày hai mươi." },
          { who: "Meera", role: "c", text: "Sorry to cut in — that's really useful, Tom. So it's not so much launch day as those two contracts.", vi: "Xin lỗi cho tôi chen vào — thông tin đó rất có ích, Tom. Vậy vấn đề không hẳn là ngày ra mắt mà là hai hợp đồng đó." },
          { who: "Tom", role: "a", text: "Exactly.", vi: "Chính xác." },
          { who: "Lan", role: "b", text: "That changes things a bit. To be candid, building it properly for everyone in two weeks is off the table — the payment provider's approval alone takes ten working days, and that's the one thing I can't move on. But suppose we switched it on for those two groups only, as a pilot. I could have that ready by the nineteenth if we could drop the reminder emails from this release.", vi: "Vậy thì chuyện hơi khác. Nói thẳng, làm đàng hoàng cho tất cả trong hai tuần là không thể — riêng việc bên cổng thanh toán duyệt đã mất mười ngày làm việc, và đó là thứ tôi không xê dịch được. Nhưng giả sử mình bật nó chỉ cho hai chuỗi đó, như một bản thử. Tôi có thể xong trước ngày mười chín nếu mình bỏ phần email nhắc lịch khỏi đợt này." },
          { who: "Tom", role: "a", text: "Hmm. The emails I can live without for a month. A pilot, though — would those two groups see the same screens as everyone else will later?", vi: "Hừm. Email thì tôi chờ một tháng được. Còn bản thử — hai chuỗi đó có thấy cùng màn hình như mọi người sau này không?" },
          { who: "Lan", role: "b", text: "The same screens, yes. The only difference is that we'd approve each payment plan by hand for the first few weeks. It's not exactly elegant, but it's safe.", vi: "Cùng màn hình. Khác biệt duy nhất là vài tuần đầu chúng tôi duyệt từng kế hoạch trả góp bằng tay. Không đẹp đẽ gì cho cam, nhưng an toàn." },
          { who: "Meera", role: "c", text: "And building on that, Tom — we could put the pilot in writing for the two groups, so they've got something to sign against.", vi: "Và tiếp ý đó, Tom — chúng tôi có thể viết bản thử thành văn bản cho hai chuỗi, để họ có cái mà ký." },
          { who: "Tom", role: "a", text: "That would help. Right, I think we're closer than I expected. Can I come back to you by Thursday? I need to check they'd accept a pilot.", vi: "Thế thì đỡ nhiều. Được, tôi nghĩ chúng ta gần nhau hơn tôi tưởng. Tôi trả lời trước thứ Năm được không? Tôi cần hỏi xem họ có chấp nhận bản thử." },
          { who: "Lan", role: "b", text: "Of course. Just so we're clear on what I'm offering: instalments for two groups by the nineteenth, approved by hand; reminder emails move to next month; full version three weeks after launch.", vi: "Tất nhiên. Để rõ tôi đang đề xuất gì: trả góp cho hai chuỗi trước ngày mười chín, duyệt bằng tay; email nhắc lịch dời sang tháng sau; bản đầy đủ ba tuần sau ra mắt." },
          { who: "Tom", role: "a", text: "That's my understanding too. Thanks, both.", vi: "Tôi cũng hiểu như vậy. Cảm ơn cả hai." },
        ],
      },
      {
        t: "table", caption: "Mổ hội thoại — câu nào làm nước đi nào",
        head: ["Vòng", "Câu", "Nước đi", "Vì sao hiệu quả"],
        rows: [
          ["1", "I was wondering, though, whether it has to be there on launch day itself. What if we shipped it three weeks after?", "đề xuất đầu (phần 1)", "thì lùi + What if + quá khứ: thăm dò, chưa cam kết"],
          ["1", "I'm afraid that won't work.", "(bị từ chối)", "—"],
          ["2", "Can I ask what's behind the date? I may be missing something, but…", "① hỏi lý do thật", "không lặp đề xuất cũ; nhận phần thiếu về mình ⇒ Tom không phải tự vệ"],
          ["2", "So it's not so much launch day as those two contracts.", "người thứ ba tóm lại", "Meera đổi LẬP TRƯỜNG (ngày ra mắt) thành LỢI ÍCH (hai hợp đồng) bằng khung not so much… as… của Ngày 15"],
          ["3", "…is off the table — the provider's approval alone takes ten working days, and that's the one thing I can't move on.", "③ giới hạn đỏ", "không rào; lý do là một con số ngoài tầm kiểm soát của Lan; To be candid xin phép nói thẳng"],
          ["3", "But suppose we switched it on for those two groups only… I could have that ready by the nineteenth if we could drop the reminder emails.", "② đổi một thứ lấy một thứ", "phương án khớp đúng lợi ích; could… if we could…; mốc ngày 19 trước ngày ký 20"],
          ["3", "It's not exactly elegant, but it's safe.", "nói giảm (Bài 1 nhóm E)", "tự nêu điểm yếu của phương án trước khi bị hỏi ⇒ đáng tin"],
          ["3", "And building on that, Tom — we could put the pilot in writing…", "đồng minh", "Meera thêm giá trị cho đúng nỗi lo của Tom (hai chuỗi cần cái để ký)"],
          ["kết", "Can I come back to you by Thursday?", "④ tạm dừng có hẹn (phía Tom)", "không ai bị ép quyết tại chỗ"],
          ["kết", "Just so we're clear on what I'm offering: …", "chốt", "ba mục, ba mốc; không còn chữ could nào"],
        ],
      },

      { t: "h", text: "7. Part 3 — khi giám khảo đẩy HAI lần và diễn giải sai ý bạn" },
      { t: "p", text: "Ở Ngày 15, giám khảo đẩy một lần. Ở band 8, họ có thể đẩy lần hai, hoặc ==nói lại ý bạn theo cách cực đoan hơn== (“So you're saying…?”) để xem bạn có sửa được không. Câu hỏi mẫu: **“Is compromise always the best way to settle a disagreement?”**" },
      {
        t: "dialogue", title: "Band 7 (ước tính) — giữ ý bằng cách lặp lại",
        lines: [
          { who: "Examiner", role: "examiner", text: "Is compromise always the best way to settle a disagreement?" },
          { who: "Candidate", role: "candidate", text: "I think compromise is usually the best way, because both sides can get something. If nobody compromises, the problem cannot be solved and the relationship will be damaged. For example, in my group project we had different ideas, and finally we chose the middle one." },
          { who: "Examiner", role: "examiner", text: "But surely someone who always compromises will be taken advantage of?" },
          { who: "Candidate", role: "candidate", text: "Yes, maybe. But I still think compromise is good. People should compromise, but not too much." },
          { who: "Examiner", role: "examiner", text: "So you're saying people should refuse to give way?" },
          { who: "Candidate", role: "candidate", text: "Yes, sometimes they should refuse." },
        ],
      },
      {
        t: "dialogue", title: "Band 8 (ước tính) — mỗi lần bị đẩy là một lần ý rõ thêm",
        lines: [
          { who: "Examiner", role: "examiner", text: "Is compromise always the best way to settle a disagreement?" },
          { who: "Candidate", role: "candidate", text: "Usually, but I wouldn't say always. It works well when the two sides want different things — you get the date, I get the budget. It works badly when it's a question of fact or of safety. If one engineer says a bridge needs ten supports and another says six, building eight isn't a compromise. It's just a different mistake.", vi: "Thường thì có, nhưng tôi sẽ không nói là luôn luôn. Nó hiệu quả khi hai bên muốn hai thứ khác nhau — anh được ngày, tôi được ngân sách. Nó tệ khi đó là chuyện sự thật hay an toàn. Nếu một kỹ sư nói cây cầu cần mười trụ và người kia nói sáu, xây tám trụ không phải thoả hiệp. Đó chỉ là một sai lầm khác." },
          { who: "Examiner", role: "examiner", text: "But surely someone who always compromises will be taken advantage of?" },
          { who: "Candidate", role: "candidate", text: "There's something in that. If you give way every time, people learn to open with a bigger demand. That said, I'd draw a line between giving way and trading. Giving way is “fine, have it your way”. Trading is “I can move on this if you can move on that”. The second doesn't get you taken advantage of — if anything, it earns you a bit of respect.", vi: "Ý đó có phần đúng. Nếu lần nào bạn cũng nhượng, người ta học được cách mở đầu bằng đòi hỏi lớn hơn. Dù vậy, tôi sẽ tách nhượng bộ với trao đổi. Nhượng bộ là “thôi được, theo ý anh”. Trao đổi là “tôi xê dịch được điểm này nếu anh xê dịch được điểm kia”. Kiểu thứ hai không khiến bạn bị lợi dụng — có chăng nó còn khiến bạn được nể." },
          { who: "Examiner", role: "examiner", text: "So you're saying people should refuse to give way?" },
          { who: "Candidate", role: "candidate", text: "Not quite — I'd put it differently. I'm saying they should know in advance the one or two things they can't move on, and be generous about everything else. In my experience, the people who dig their heels in on every point are usually the ones who haven't worked out which point matters.", vi: "Không hẳn — tôi sẽ nói khác đi. Ý tôi là họ nên biết trước một hai thứ mình không xê dịch được, và rộng rãi với mọi thứ còn lại. Theo kinh nghiệm của tôi, người khăng khăng ở mọi điểm thường là người chưa tìm ra điểm nào mới quan trọng." },
        ],
      },
      {
        t: "table", caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["Fluency & Coherence", "lần đẩy 1: lặp lại lập trường; lần đẩy 2: nhận luôn cách diễn giải của giám khảo (Yes) dù nó sai ý mình", "mỗi lượt thêm một phân biệt mới: (khác thứ muốn ↔ sự thật) → (nhượng ↔ trao đổi) → (giới hạn đỏ ↔ phần còn lại); lần 2 SỬA cách diễn giải"],
          ["Lexical Resource", "good · not too much · the middle one", "open with a bigger demand · draw a line between · have it your way · dig their heels in · move on (Bài 1 nhóm C)"],
          ["Grammar", "câu đơn và câu because", "It works well when… It works badly when… (song song) · if anything · the ones who haven't worked out which point matters"],
          ["Pronunciation (dự đoán)", "đều", "nhấn tương phản TRADing / GIVing way; xuống–lên ở There's something in THAT"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — ba câu khi giám khảo diễn giải sai (“So you're saying…?”)",
        items: [
          "**Not quite — I'd put it differently.** rồi nói lại bằng một câu NGẮN hơn câu trước.",
          "**I'd go part of the way with that.** — nhận một nửa, rồi nêu nửa bạn không nhận.",
          "**That's a stronger claim than I'd want to make.** — khi họ đẩy ý bạn thành tuyệt đối (always, never, everyone).",
          "Đừng nói Yes cho xong. Nhận một cách diễn giải sai là tự đổi lập trường giữa chừng — mất điểm Coherence.",
        ],
      },

      { t: "h", text: "8. 🔊 Ngữ điệu mở và đóng — lên nhẹ ở đề xuất thăm dò, xuống chắc ở giới hạn" },
      { t: "p", text: "Ngày 15 dạy xuống–lên để làm mềm lời phản đối. Vòng hai cần thêm hai giọng nữa. Đề xuất thăm dò (What if…? · I could… if you could…) kết bằng giọng ==lên nhẹ==: cửa còn mở. Giới hạn đỏ và lời chốt kết bằng giọng ==xuống chắc, chậm==: cửa đóng. Nói giới hạn đỏ bằng giọng lên là mời bên kia ép tiếp." },
      {
        t: "phatam", id: "t5d18-phat-am", title: "Luyện phát âm — ngữ điệu mở (↗) và đóng (↘) trong thương lượng",
        note: "Câu 1, 2, 5, 7: lên nhẹ ở từ in HOA cuối câu (cửa mở). Câu 4, 6, 8: xuống hẳn, chậm lại (cửa đóng). Câu 3: xuống–lên ở SOMEthing, rồi xuống ở withOUT it. Thu âm và nghe lại: giới hạn đỏ của bạn có nghe như một câu hỏi không?",
        items: [
          { text: "What if we shipped it three weeks later?", ipa: "wɒt ɪf wi ʃɪpt ɪt θriː wiːks leɪtə", vi: "Nếu mình phát hành muộn hơn ba tuần thì sao? (three weeks ↗LAter — mở)" },
          { text: "Can I ask what's behind the date?", ipa: "kæn aɪ ɑːsk wɒts bɪhaɪnd ðə deɪt", vi: "Tôi hỏi được không, đằng sau cái ngày ấy là gì? (behind the ↗DATE — mở, mời trả lời)" },
          { text: "I may be missing something, but I'd assumed they could start without it.", ipa: "aɪ meɪ bi mɪsɪŋ sʌmθɪŋ bʌt aɪd əsjuːmd ðeɪ kʊd stɑːt wɪðaʊt ɪt", vi: "Có thể tôi bỏ sót điều gì, nhưng tôi vẫn nghĩ họ bắt đầu được mà chưa cần nó. (↘↗SOMEthing | with↘OUT it)" },
          { text: "That's the one thing I can't move on.", ipa: "ðæts ðə wʌn θɪŋ aɪ kɑːnt muːv ɒn", vi: "Đó là thứ duy nhất tôi không xê dịch được. (the ONE thing | can't ↘MOVE on — đóng, chậm)" },
          { text: "I could move on the date, if you could move on the scope.", ipa: "aɪ kʊd muːv ɒn ðə deɪt ɪf ju kʊd muːv ɒn ðə skəʊp", vi: "Tôi xê dịch được ngày, nếu anh xê dịch được phạm vi. (the ↗DATE | the ↗SCOPE — nhấn tương phản, cuối câu vẫn mở)" },
          { text: "It's not exactly elegant, but it's safe.", ipa: "ɪts nɒt ɪɡzæktli elɪɡənt bʌt ɪts seɪf", vi: "Không đẹp đẽ gì cho cam, nhưng an toàn. (↘↗ELegant | it's ↘SAFE)" },
          { text: "Sorry to cut in, could I just finish this point?", ipa: "sɒri tu kʌt ɪn kʊd aɪ dʒʌst fɪnɪʃ ðɪs pɔɪnt", vi: "Xin lỗi chen ngang, cho tôi nói nốt ý này được không? (this ↗POINT — lịch sự, không gắt)" },
          { text: "Not quite, I'd put it differently.", ipa: "nɒt kwaɪt aɪd pʊt ɪt dɪfrəntli", vi: "Không hẳn, tôi sẽ nói khác đi. (not ↘↗QUITE | ↘DIFferently)" },
        ],
      },
      {
        t: "mcq", id: "t5d18-noi-ngu-dieu", title: "Ngữ điệu mở và đóng — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. “A refund is off the table, I'm afraid.” Câu này nên kết bằng giọng:", options: ["lên, cho lịch sự", "xuống, chắc", "ngang"], correct: 1, why: "Giới hạn đỏ ⇒ đóng: xuống chắc. Lên giọng làm nó nghe như còn thương lượng được." },
          { q: "2. “What if we started with the login page?” là đề xuất thăm dò. Giọng cuối câu:", options: ["lên nhẹ", "xuống mạnh", "xuống rồi dừng đột ngột"], correct: 0, why: "Thăm dò ⇒ mở: lên nhẹ, mời bên kia phản hồi." },
          { q: "3. Khi bị ngắt lời và nói “Could I just finish this point?”, bạn nên:", options: ["nói to và nhanh hơn người ngắt", "giữ âm lượng bình thường, chậm lại một chút", "im lặng chờ họ nói xong"], correct: 1, why: "Âm lượng bình thường + chậm = bình tĩnh và chắc. Nói to hơn thành tranh giành." },
          { q: "4. Trong câu “I could move on the DATE if you could move on the SCOPE”, hai từ in hoa được nhấn vì:", options: ["chúng là danh từ", "chúng là hai thứ đem ra đổi cho nhau", "chúng đứng cuối mỗi vế"], correct: 1, why: "Nhấn tương phản (Ngày 14): hai thứ được đặt lên bàn cân." },
        ],
      },

      { t: "h", text: "9. Kiểm tra — chọn câu đáp hợp nhất (6 câu)" },
      {
        t: "mcq", id: "t5d18-noi-chon", title: "Vòng hai, hedging, ba người",
        items: [
          { q: "1. Bạn đề xuất giao thứ Hai. Khách: “Monday's no good for us.” Câu tiếp theo hợp nhất:", options: ["But Monday is the best I can do, as I said.", "OK, Friday then.", "Can I ask what's happening before Monday on your side?"], correct: 2, why: "Nước đi ①: hỏi lý do thật. A lặp lại; B nhượng không điều kiện." },
          { q: "2. Bạn có thể giảm giá nếu họ ký hai năm. Câu hợp nhất:", options: ["I'll give you ten per cent off. Maybe you can sign for two years?", "I could move on the price if you could commit to two years.", "The price is the price."], correct: 1, why: "Trao đổi: could… if you could… A nhượng trước, xin sau." },
          { q: "3. Hạn duyệt của bên thứ ba là 10 ngày, không rút được. Câu hợp nhất:", options: ["It might perhaps be a little bit difficult.", "That's the one thing I can't move on: the approval takes ten working days.", "Impossible."], correct: 1, why: "Giới hạn đỏ: không rào, kèm sự kiện. A rào quá ⇒ bị ép tiếp; C cộc, không lý do." },
          { q: "4. Sếp hỏi một con số bạn chưa chắc. Câu hợp nhất:", options: ["About… maybe… forty? I think.", "I don't have the exact figure with me. Can I send it to you by two o'clock?", "Forty. (đoán)"], correct: 1, why: "Con số không rào, không đoán: nói chưa có + hẹn mốc." },
          { q: "5. Hai đồng nghiệp tranh luận mười phút. Bạn muốn kéo họ lại:", options: ["You're both wrong.", "Can I check I've understood both positions? It sounds as if the only sticking point is who signs off the release.", "Let's just vote."], correct: 1, why: "Tóm lại hai lập trường + gọi tên điểm vướng duy nhất." },
          { q: "6. Giám khảo: “So you're saying technology has ruined family life?” Bạn chỉ nói nó làm bữa tối ngắn hơn. Câu hợp nhất:", options: ["Yes.", "That's a stronger claim than I'd want to make. I'd say it's changed one part of family life — mealtimes.", "No, I didn't say that!"], correct: 1, why: "Sửa cách diễn giải cực đoan bằng một câu bình tĩnh rồi nói lại ý mình, hẹp hơn." },
        ],
      },

      { t: "h", text: "10. Luyện nói — ghi âm" },
      {
        t: "note", title: "📌 Cách luyện",
        items: [
          "**Part 1**: 2–3 câu mỗi câu hỏi, giọng trò chuyện. Thử cài một cụm nói giảm của Bài 1 (on the … side · not exactly).",
          "**Part 3**: mỗi câu 40–60 giây. Câu 4 và câu 5 là câu “bị đẩy” và câu “bị diễn giải sai” — bắt buộc dùng một khung của mục 7.",
          "**Đóng vai**: mỗi tình huống có hai lượt. Lượt A: bạn đề xuất. Lượt B: bên kia đã từ chối — bạn đi ít nhất hai trong bốn nước đi của mục 2. Luyện một mình thì để 3 giây im lặng cho vai kia.",
          "Nghe lại: giới hạn đỏ có xuống giọng không? Có câu nào chồng hai lớp rào không? Có lần nào bạn nói Yes khi chưa đồng ý không?",
        ],
      },
      {
        t: "speak", id: "t5d18-noi-part1", part: "1",
        questions: [
          "Let's talk about prices. Do you ever try to get a lower price when you buy something?",
          "Is bargaining common where you live?",
          "Do you find it easy to say that something is too expensive?",
          "Now let's talk about working with other people. Do you prefer to make decisions alone or with others?",
          "What do you usually do when a friend wants to do something that you don't want to do?",
          "Have you ever changed a plan to suit somebody else?",
        ],
      },
      {
        t: "speak", id: "t5d18-noi-part3", part: "3",
        questions: [
          "Why do some people find it difficult to ask for what they want, for example a higher salary?",
          "Do you think negotiation skills should be taught at school or university?",
          "In a negotiation, is it more important to get a good result or to keep a good relationship?",
          "Some people would say that being flexible is just a sign of weakness. What would you say to that?",
          "So you're saying that people should never insist on what they want?",
        ],
      },
      {
        t: "speak", id: "t5d18-noi-dong-vai", part: "3",
        questions: [
          "ROLE-PLAY 1 (about 90 seconds). You offered to deliver a university group report on Monday instead of Friday. Your teammate has replied: ‘Monday is too late.’ Find out the real reason, then trade one thing for another, and agree a time to confirm.",
          "ROLE-PLAY 2 (about 90 seconds). A client wants your team to support an extra language in the app at no extra cost. You have already said you could do it next quarter, and they have refused. State the one thing you cannot change, offer something else, and say when you will come back with an answer.",
          "ROLE-PLAY 3 (about 90 seconds). You are in a meeting with two colleagues who disagree about whether to rewrite an old module or patch it. Cut in politely, summarise both positions, name the one sticking point, and suggest a way forward.",
        ],
      },
      {
        t: "table", caption: "Tự chấm sau khi nghe lại",
        head: ["Kiểm", "Có / Chưa", "Nếu chưa"],
        rows: [
          ["Sau khi bị từ chối, tôi HỎI trước khi đề xuất lại", "", "mục 2 — nước đi ①"],
          ["Mỗi nhượng bộ của tôi có một chữ if", "", "mục 2 — nước đi ②"],
          ["Giới hạn đỏ không có maybe / a bit / perhaps, và xuống giọng", "", "mục 4 · mục 8"],
          ["Mỗi câu chỉ một lớp rào", "", "mục 4"],
          ["Tôi kết bằng một câu chốt có mốc thời gian", "", "mục 2 — nước đi ④ · Ngày 15 mục 5"],
          ["Part 3: khi bị diễn giải sai, tôi sửa chứ không nói Yes", "", "mục 7"],
        ],
      },
      {
        t: "note", title: "📌 E10 đã xong — dùng ở đâu tiếp",
        items: [
          "**Ngày 22** (mổ Speaking Đề 10): soi lại phần Part 3 của bạn xem có lần nào bị đẩy mà chỉ lặp lại.",
          "**Ngày 23** (Part 3 phản biện giám khảo khéo): dùng lại ba câu “So you're saying…?” của mục 7 ở tốc độ thi.",
          "Trong công việc: chép bốn nước đi của mục 2 lên một tờ giấy dán cạnh màn hình. Lần họp tới, thử đúng MỘT nước đi.",
        ],
      },
    ],
  },
  /* ════════════════ BÀI TẬP NGÀY 18 ════════════════ */
  {
    id: "t5d18-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 18 — idiom ba việc · một tính cách hai màu · nói giảm · map có mốc tương lai · thương lượng vòng hai · hedging đúng liều",
    goal: "Ôn trọn Ngày 18 trong 60 phút: điền đúng nguyên dạng idiom để lập luận, kể và thương lượng, chọn đúng tính từ khen – chê, hiểu và viết được câu nói giảm, dùng bốn khuôn tương lai cho map, đi đúng nước ở vòng hai của một cuộc thương lượng, và nghe một cuộc mặc cả ngắn giọng Anh – Mỹ — 45 câu có đáp án, một bài Task 1 và một lượt đóng vai AI chấm.",
    minutes: 60,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay",
        items: [
          "Phần I–IV ôn **Bài 1** (48 mục từ vựng). Phần V–VI ôn **Bài 2** (map có mốc tương lai). Phần VII–VIII ôn **Bài 3** (vòng hai, hedging, nghe một cuộc thương lượng).",
          "Phần IX: viết một bài Task 1 từ một bản đồ tả bằng bảng (20 phút). Phần X: đóng vai hai lượt — AI chấm.",
          "Làm xong bài tập rồi mới sang **Kiểm tra chặng (Ngày 13–18)** ở bài kế tiếp. Nên nghỉ ít nhất 30 phút giữa hai bài.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 18 trong một hình", center: "Nói và viết đúng mức chắc, đúng mức mềm",
        branches: [
          { label: "Idiom theo việc", items: ["lập luận: the jury's still out", "kể: my heart sank", "thương lượng: a sticking point"] },
          { label: "Sắc thái", items: ["candid ↔ tactless", "tactful ↔ evasive", "less than ideal", "not exactly"] },
          { label: "Map tương lai", items: ["is to be + V3", "is due to be", "is earmarked for", "will have been… by"] },
          { label: "Vòng hai", items: ["① hỏi lý do thật", "② could… if you could…", "③ giới hạn đỏ", "④ hẹn có mốc"] },
        ],
      },

      { t: "h", text: "I. Idiom để lập luận — điền MỘT từ (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "quiz", id: "t5d18-bt-lap-luan", kind: "fill", title: "I. Nguyên dạng",
        items: [
          { q: "1. Building more roads is a knee-___ reaction to congestion.", answers: ["jerk"], hint: "a knee-jerk reaction" },
          { q: "2. The argument about school uniforms is a red ___; the real issue is funding.", answers: ["herring"], hint: "a red herring" },
          { q: "3. The data breach was a ___-up call for the whole industry.", answers: ["wake"], hint: "a wake-up call" },
          { q: "4. Ministers keep ___ money at the problem instead of asking why it exists.", answers: ["throwing"], hint: "throw money at" },
          { q: "5. The jury is ___ out on whether four-day weeks improve productivity.", answers: ["still"], hint: "the jury is still out" },
          { q: "6. Whether the law will pass is far from a foregone ___.", answers: ["conclusion"], hint: "a foregone conclusion" },
        ],
      },

      { t: "h", text: "II. Idiom để kể và để thương lượng — chọn phương án đúng (6 câu) — ôn Bài 1 mục 3–4" },
      {
        t: "mcq", id: "t5d18-bt-ke", title: "II. Đúng cụm, đúng chặng",
        items: [
          { q: "1. The visa arrived ___, the day before my flight.", options: ["at the eleventh hour", "in my stride", "on the table"], correct: 0, why: "Phút chót ⇒ at the eleventh hour." },
          { q: "2. I'd practised for weeks, but when I saw the audience, ___.", options: ["I hit the ground running", "my heart sank", "I stood my ground"], correct: 1, why: "but + thấy khán giả ⇒ hụt hẫng: my heart sank." },
          { q: "3. For a few minutes it was ___ whether the file could be recovered.", options: ["give and take", "touch and go", "a deal-breaker"], correct: 1, why: "Bấp bênh ⇒ touch and go whether…" },
          { q: "4. In the end I ___ and phoned the client to apologise.", options: ["got cold feet", "bit the bullet", "kept a straight face"], correct: 1, why: "In the end + làm điều khó ⇒ bit the bullet." },
          { q: "5. We agree on scope and price. Timing is the only ___.", options: ["sticking point", "common ground", "leeway"], correct: 0, why: "Điểm còn vướng ⇒ sticking point." },
          { q: "6. (chê nhẹ) The supplier ___ and refused to discuss any change at all.", options: ["stood their ground", "met us halfway", "dug their heels in"], correct: 2, why: "Khăng khăng, không chịu bàn ⇒ dug their heels in (chê). stood their ground là khen." },
        ],
      },

      { t: "h", text: "III. Một tính cách hai màu và nói giảm — chọn phương án đúng (6 câu) — ôn Bài 1 mục 5–6" },
      {
        t: "mcq", id: "t5d18-bt-sac-thai", title: "III. Sắc thái",
        items: [
          { q: "1. (khen) He was ___ about the risks, which I appreciated.", options: ["tactless", "candid", "evasive"], correct: 1, why: "candid = thẳng thắn (khen)." },
          { q: "2. (chê) The reform is too ___ to make any real difference.", options: ["cautious", "timid", "thorough"], correct: 1, why: "timid = rụt rè, không dám làm đủ (chê). cautious là khen." },
          { q: "3. “The hotel was on the noisy side.” Nghĩa là:", options: ["Khách sạn nằm ở phía ồn của phố.", "Khách sạn hơi ồn.", "Khách sạn rất yên tĩnh."], correct: 1, why: "on the + adj + side = hơi…" },
          { q: "4. Câu nào là lời KHEN?", options: ["Your code is not bad at all.", "Your code leaves something to be desired.", "Your code is less than ideal."], correct: 0, why: "not bad at all = khá tốt (nói giảm của lời khen). Hai câu kia là chê nhẹ." },
          { q: "5. “To say the app is finished is ___.”", options: ["a bit of a stretch", "room for improvement", "between jobs"], correct: 0, why: "Hơi quá, khó tin ⇒ a bit of a stretch." },
          { q: "6. Chỗ nào KHÔNG nên nói giảm?", options: ["nhận xét về bản thiết kế của đồng nghiệp", "thông báo giờ máy chủ ngừng hoạt động", "góp ý về bài thuyết trình"], correct: 1, why: "Giờ, con số, hạn chót ⇒ nói thẳng. Nói giảm dành cho nhận xét." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–6" },
      {
        t: "quiz", id: "t5d18-bt-dich", kind: "translate", grammar: "idiom nguyên dạng · It would be naive to… · less than ideal",
        title: "IV. Dịch — dùng cụm trong ngoặc",
        items: [
          { q: "Vẫn chưa ngã ngũ chuyện ô tô điện có thật sự sạch hơn không. (the jury)", answers: ["The jury is still out on whether electric cars are really cleaner.", "The jury is still out on whether electric cars are actually cleaner.", "The jury's still out on whether electric cars are really cleaner.", "The jury is still out on whether electric cars really are cleaner."], hint: "The jury is still out on whether…" },
          { q: "Sẽ là ngây thơ nếu nghĩ rằng tiền phạt một mình nó sẽ giải quyết được vấn đề. (naive)", answers: ["It would be naive to think that fines alone will solve the problem.", "It would be naive to think that fines alone would solve the problem.", "It would be naive to think fines alone will solve the problem.", "It would be naive to think that fines alone can solve the problem.", "It would be naive to assume that fines alone will solve the problem."], hint: "It would be naive to think that… alone…" },
          { q: "Giá cả là điểm vướng duy nhất còn lại. (sticking)", answers: ["Price is the only remaining sticking point.", "The price is the only remaining sticking point.", "Price is the only sticking point left.", "The price is the only sticking point left.", "The price is the only sticking point that remains."], hint: "the only remaining sticking point" },
          { q: "Tôi như trút được gánh nặng khi nộp xong báo cáo. (weight)", answers: ["It was a weight off my shoulders when I handed in the report.", "Handing in the report was a weight off my shoulders.", "It was a weight off my mind when I handed in the report.", "Handing in the report was a weight off my mind.", "It was a real weight off my shoulders when I handed in the report.", "Submitting the report was a weight off my shoulders."], hint: "a weight off my shoulders" },
          { q: "Thời điểm này chưa thật ổn, nhưng chúng ta có một chút linh động về ngày. (less than · leeway)", answers: ["The timing is less than ideal, but we have some leeway on the date.", "The timing is less than ideal, but we have a little leeway on the date.", "The timing is less than ideal, but there is some leeway on the date.", "The timing is less than ideal, but we have a bit of leeway on the date."], hint: "less than ideal · some leeway on the date" },
        ],
      },

      { t: "h", text: "V. Map — mốc tương lai: điền MỘT từ (6 câu) — ôn Bài 2 mục 3 · 7" },
      {
        t: "quiz", id: "t5d18-bt-tuong-lai", kind: "fill", title: "V. Khuôn tương lai",
        items: [
          { q: "1. The petrol station is ___ be demolished next year.", answers: ["to"], hint: "is to be + V3" },
          { q: "2. The new terminal is ___ to open in 2031. (đã có lịch, 3 chữ cái)", answers: ["due", "set"], hint: "is due to / is set to" },
          { q: "3. The eastern field is earmarked ___ a solar farm.", answers: ["for"], hint: "be earmarked for" },
          { q: "4. By 2040, the quarry will have ___ filled in and planted with trees.", answers: ["been"], hint: "will have been + V3" },
          { q: "5. There are ___ to widen the road on its northern side.", answers: ["plans", "proposals"], hint: "There are plans to + V" },
          { q: "6. The barn will survive, ___ into a visitor centre.", answers: ["converted", "turned"], hint: "survive, converted into" },
        ],
      },

      { t: "h", text: "VI. Map — thì, overview, suy diễn (5 câu) — ôn Bài 2 mục 1 · 4 · 6" },
      {
        t: "mcq", id: "t5d18-bt-map", title: "VI. Chọn phương án đúng",
        items: [
          { q: "1. Hai bản đồ: 1995 và hôm nay. Câu nào đúng thì?", options: ["The cinema is to be converted into flats.", "The cinema has been converted into flats.", "The cinema will have been converted into flats."], correct: 1, why: "Quá khứ ↔ nay ⇒ hiện tại hoàn thành bị động. Hai câu kia dành cho kế hoạch." },
          { q: "2. Hai bản đồ: hôm nay và kế hoạch 2035. Câu nào tả HIỆN TRẠNG?", options: ["A car park occupies the northern half of the site.", "A car park has occupied the northern half.", "A car park will occupy the northern half."], correct: 0, why: "Hiện trạng ⇒ hiện tại đơn." },
          { q: "3. Overview nào tốt nhất cho “hôm nay ↔ kế hoạch”?", options: ["Overall, the site will look very different in the future.", "Overall, the plan would replace most of the site's industrial buildings with housing, while the canal and the main road are to be kept.", "Overall, the plan is a good idea because the area needs more homes."], correct: 1, why: "Hướng thay đổi về chức năng + cái được giữ. A rỗng; C có ý kiến." },
          { q: "4. Câu nào dùng ĐÚNG khuôn?", options: ["A school is planned to build on the field.", "A school is going to be build on the field.", "A school is to be built on the field."], correct: 2, why: "is to be + V3. A sai khuôn; B sai dạng (built) và là khuôn nói." },
          { q: "5. Trong sơ đồ mặt bằng, “The two offices are to be knocked through” nghĩa là:", options: ["hai văn phòng bị phá bỏ hoàn toàn", "bức tường giữa hai văn phòng bị dỡ để thành một phòng", "mỗi văn phòng bị chia đôi"], correct: 1, why: "knock through = đục thông hai phòng thành một." },
        ],
      },

      { t: "h", text: "VII. Vòng hai và hedging — điền MỘT từ (6 câu) — ôn Bài 3 mục 2 · 4 · 5" },
      {
        t: "quiz", id: "t5d18-bt-vong-hai", kind: "fill", title: "VII. Khung câu",
        items: [
          { q: "1. Help me understand what's ___ the request.", answers: ["behind"], hint: "what's behind" },
          { q: "2. I could move ___ the deadline if you could reduce the scope.", answers: ["on"], hint: "move on sth" },
          { q: "3. I may be ___ something, but wasn't the budget approved last week?", answers: ["missing"], hint: "I may be missing something, but…" },
          { q: "4. Sorry to ___ in — could I add one thing?", answers: ["cut", "butt", "jump"], hint: "cut in" },
          { q: "5. ___ on what Hoa said, I think the same applies to testing.", answers: ["Building"], hint: "Building on what… said" },
          { q: "6. I think we're ___ than it sounds; the only difference is the date.", answers: ["closer"], hint: "We're closer than it sounds." },
        ],
      },

      { t: "h", text: "VIII. Nghe — một cuộc mặc cả ngắn (5 câu) — ôn Bài 3 mục 2–3" },
      { t: "p", text: "Nghe MỘT lần. Một nhà thiết kế tự do (giọng Anh) và chủ một quán cà phê (giọng Mỹ). Để ý: đề xuất đầu bị từ chối ở đâu, và ai hỏi ra lý do thật." },
      {
        t: "listen", id: "t5d18-bt-nghe", title: "A logo for the Copper Kettle",
        dan: { so: "Day 18, Recording 1", boiCanh: "a freelance designer, Harriet, talking to a café owner, Miguel, about a job.", cau: [1, 5] },
        lines: [
          { who: "Miguel", voice: "us-nam", text: "Harriet, I love the sketches. Here's the thing, though: I need the final logo by the fifth." },
          { who: "Harriet", voice: "uk-nu", text: "The fifth. That's nine days. I'd pencilled in the nineteenth — would the twelfth work as a halfway point?" },
          { who: "Miguel", voice: "us-nam", text: "I'm afraid not. The twelfth's too late." },
          { who: "Harriet", voice: "uk-nu", text: "Right. Can I ask what's happening on the fifth?" },
          { who: "Miguel", voice: "us-nam", text: "The sign company. If they don't have the artwork by the fifth, the sign won't be up for opening day." },
          { who: "Harriet", voice: "uk-nu", text: "I see. So it's really the sign you need, not the whole package — the menus and the cups could follow." },
          { who: "Miguel", voice: "us-nam", text: "I guess that's true." },
          { who: "Harriet", voice: "uk-nu", text: "Then here's what I could do. The logo for the sign by the fourth, in one colour. The full set, with menus and cups, by the nineteenth as planned. What I can't move on is the number of revision rounds — two, not three — or I won't make the fourth." },
          { who: "Miguel", voice: "us-nam", text: "Two rounds I can live with. And the fee stays at six hundred?" },
          { who: "Harriet", voice: "uk-nu", text: "Six fifty, I'm afraid, for the rush on the sign. But I'll include the file for the window sticker at no charge." },
          { who: "Miguel", voice: "us-nam", text: "Deal. Send me that in an email?" },
          { who: "Harriet", voice: "uk-nu", text: "Within the hour." },
        ],
      },
      {
        t: "mcq", id: "t5d18-bt-nghe-chon", title: "VIII. Questions 1–5 — chọn phương án đúng",
        items: [
          { q: "1. What was Harriet's first counter-offer for the deadline?", options: ["A  the fifth", "B  the twelfth", "C  the nineteenth"], correct: 1, why: "“would the twelfth work as a halfway point?” — ngày 19 là kế hoạch gốc, ngày 5 là yêu cầu của Miguel." },
          { q: "2. Why does Miguel need the logo so early?", options: ["A  The café opens on the fifth.", "B  The menus have to be printed.", "C  The sign company needs the artwork."], correct: 2, why: "“If they don't have the artwork by the fifth, the sign won't be up for opening day.” Lợi ích thật = cái biển." },
          { q: "3. What does Harriet agree to deliver by the fourth?", options: ["A  the whole package", "B  a one-colour logo for the sign", "C  the menus and cups"], correct: 1, why: "“The logo for the sign by the fourth, in one colour.” Bộ đầy đủ vẫn ngày 19." },
          { q: "4. What is Harriet NOT willing to change?", options: ["A  the number of revision rounds", "B  the date of the full set", "C  the colour of the logo"], correct: 0, why: "“What I can't move on is the number of revision rounds — two, not three.” Giới hạn đỏ, kèm lý do." },
          { q: "5. What is the final fee?", options: ["A  $600", "B  $650", "C  $650 plus a charge for the sticker file"], correct: 1, why: "“Six fifty, I'm afraid… But I'll include the file for the window sticker at no charge.”" },
        ],
      },
      {
        t: "table", caption: "Bốn nước đi trong 200 từ",
        head: ["Nước đi", "Câu của Harriet"],
        rows: [
          ["① hỏi lý do thật", "Can I ask what's happening on the fifth?"],
          ["lập trường → lợi ích", "So it's really the sign you need, not the whole package."],
          ["② đổi một thứ lấy một thứ", "logo một màu trước ngày 4 ↔ chỉ hai vòng sửa; phí 650 ↔ tặng tệp nhãn dán cửa kính"],
          ["③ giới hạn đỏ", "What I can't move on is the number of revision rounds… or I won't make the fourth."],
          ["chốt", "Send me that in an email? — Within the hour."],
        ],
      },

      { t: "h", text: "IX. Viết Task 1 — bản đồ tả bằng bảng (20 phút, ≥ 150 từ) — AI chấm — ôn Bài 2" },
      { t: "p", text: "**The maps show Larkfield Leisure Park as it is now and the changes planned for 2030.** Bản đồ được tả bằng bảng dưới đây (công viên hư cấu). Phía bắc ở trên; hồ nằm giữa; đường vào ở phía nam." },
      {
        t: "table", caption: "Larkfield Leisure Park — now and planned for 2030",
        head: ["Khu", "Hiện nay", "Kế hoạch 2030"],
        rows: [
          ["Giữa", "Lake", "Lake (unchanged) + new boardwalk around it"],
          ["Bắc hồ", "Woodland", "Woodland (unchanged) + nature trail"],
          ["Tây hồ", "Tennis courts (4)", "Indoor sports hall"],
          ["Đông hồ", "Boat shed (disused)", "Lakeside café (in the old boat shed)"],
          ["Tây nam", "Car park (200 spaces)", "Car park (100 spaces) + cycle parking"],
          ["Đông nam", "Open grass", "Adventure playground"],
          ["Nam", "Entrance on Park Lane", "Entrance (unchanged) + bus stop"],
        ],
      },
      {
        t: "essay", id: "t5d18-bt-viet-map", task: "Task 1", minWords: 150,
        prompt: "The maps show Larkfield Leisure Park as it is now and the changes planned for 2030. NOW — a lake in the centre; woodland to the north of the lake; four tennis courts to the west; a disused boat shed to the east; a 200-space car park in the south-west; open grass in the south-east; the entrance on Park Lane in the south. PLAN FOR 2030 — the lake and the woodland are unchanged, but a boardwalk is added around the lake and a nature trail through the woodland; the tennis courts are replaced by an indoor sports hall; the boat shed is converted into a lakeside café; the car park is reduced to 100 spaces, with cycle parking on the land released; an adventure playground is built on the open grass; a bus stop is added beside the entrance. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: công viên giữ lõi tự nhiên (hồ, rừng) và lối vào; phần còn lại chuyển sang nhiều tiện ích hơn, bớt chỗ cho xe hơi.",
          "Thân 1: cái được giữ + thứ thêm vào quanh nó (boardwalk, trail). Thân 2: cái bị thay / đổi công năng / thu nhỏ.",
          "Bốn khuôn tương lai khác nhau; một câu By 2030, … will have been…; một câu gói (halved, freeing space for…).",
          "200 → 100 chỗ: is to be halved / reduced by half — một so sánh bằng số duy nhất của đề, đừng bỏ.",
        ],
      },

      { t: "h", text: "X. Đóng vai hai lượt + 2 câu Part 3 — ghi âm, AI chấm — ôn Bài 3" },
      { t: "p", text: "Lượt A: nêu đề xuất đầu (năm bước của Ngày 15). Lượt B: bên kia đã từ chối — đi ít nhất hai nước của vòng hai, có một giới hạn đỏ không rào và một lời hẹn có mốc." },
      {
        t: "speak", id: "t5d18-bt-dong-vai", part: "3",
        questions: [
          "ROLE-PLAY, TURN A (about 1 minute). Your landlord wants to raise your rent by 15 per cent from next month. Acknowledge, state your constraint as a fact, and make a conditional offer.",
          "ROLE-PLAY, TURN B (about 1 minute). The landlord has said: ‘I'm afraid that doesn't work for me.’ Find out what is behind the increase, trade one thing for another, state the one thing you cannot accept, and agree when you will speak again.",
        ],
      },
      {
        t: "speak", id: "t5d18-bt-noi-p3", part: "3",
        questions: [
          "Do you think people in your country negotiate differently at work and in the family?",
          "Some people say that the best negotiators are the ones who talk least. Would you agree?",
        ],
      },
    ],
  },

  /* ════════════════ KIỂM TRA CHẶNG 3 (NGÀY 13–18) ════════════════ */
  {
    id: "t5d18-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 13–18)",
    goal: "Đo lại cả chặng 3 của Tập 5 theo 8 phần — ngữ pháp, từ vựng, dịch, nghe, đọc, viết, nói, phát âm — với ngưỡng đạt ≥ 70 % từng phần, và biết chính xác phải ôn lại Ngày nào trước khi sang chặng 4 (Ngày 19–24, có Đề 11).",
    minutes: 180,
    blocks: [
      {
        t: "recap", title: "Cách làm bài kiểm tra này",
        items: [
          "**8 phần**, khoảng 3 giờ. Làm một mạch được thì tốt; không thì chia hai buổi: Phần 1–5 (95 phút) và Phần 6–8 (85 phút).",
          "Không tra từ, không mở lại bài. Nghe **một lần**. Đọc **đúng giờ** (16 phút).",
          "Ngưỡng đạt: ==≥ 70 % từng phần== — không lấy phần này bù phần kia. Viết / Nói: AI ước tính ≥ band 7.5.",
          "Mọi câu ở đây là câu MỚI; không câu nào lặp lại bài tập của Ngày 13–18. Bài đọc dùng tên nhà nghiên cứu hư cấu.",
          "Trước khi làm: mở **Sổ lỗi**, đọc lướt 2 phút những lỗi ghi từ Đề 10 (Ngày 16–17). Sau khi làm: điền bảng cuối bài.",
        ],
      },

      { t: "h", text: "Phần 1 — Ngữ pháp (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 13, 15, 17)" },
      {
        t: "mcq", id: "t5d18-kt-ngu-phap-chon", title: "1a. Chọn đáp án đúng (12 câu)",
        items: [
          { q: "1. ___ the cost of the scheme that worries residents; it is the noise.", options: ["It is not", "What is not", "Not"], correct: 0, why: "Câu chẻ phủ định: It is not X that…; it is Y. — Ngày 13 mục 2." },
          { q: "2. Only when the data are published ___ judge the policy fairly.", options: ["we can", "can we", "we could"], correct: 1, why: "Only when + mệnh đề ⇒ đảo ở mệnh đề CHÍNH: can we. — Ngày 13 mục 3." },
          { q: "3. Expensive ___ the scheme is, it has clearly reduced congestion.", options: ["though", "however", "despite"], correct: 0, why: "Adj + though / as + S + V = nhượng bộ khuôn hiếm. — Ngày 13 mục 4." },
          { q: "4. Car ownership has doubled in a decade. ___ has put pressure on parking.", options: ["This growth", "These", "It's"], correct: 0, why: "this + danh từ tóm tắt nối hai câu không cần từ nối. — Ngày 13 mục 5." },
          { q: "5. Câu nào hợp nhất với Writing Task 2?", options: ["Kids these days are glued to their phones.", "Many children now spend a considerable amount of time on their phones.", "It is with great concern that one observes the devotion of the young to telephony."], correct: 1, why: "A suồng sã; C trang trọng giả. B formal vừa đủ. — Ngày 15 mục 1 · 3." },
          { q: "6. “There is a ___ of reasons for this trend.” Từ tự nhiên nhất trong Task 2:", options: ["plethora", "number", "myriad"], correct: 1, why: "plethora / myriad là “trang trọng giả” khi dùng cho ý thường. — Ngày 15 mục 3." },
          { q: "7. Câu nào hợp nhất với Speaking Part 3?", options: ["Moreover, I am of the opinion that it depends.", "I'd say it depends, really — on how old the kids are.", "It is argued that it depends."], correct: 1, why: "Part 3: neutral, có viết tắt, mạch nói. — Ngày 15 mục 5." },
          { q: "8. Nhận định chưa có bằng chứng trong Task 2: “This policy ___ lead to higher prices.”", options: ["will definitely", "may well", "is one hundred per cent going to"], correct: 1, why: "Tone đo được: may well. — Ngày 15 mục 4." },
          { q: "9. ___ has shown that sleep affects memory.", options: ["A research", "Researches", "Research"], correct: 2, why: "research không đếm được. — Ngày 17 mục 3." },
          { q: "10. Prices rose ___ 8 per cent to a peak ___ 120 dollars.", options: ["by · of", "with · at", "of · in"], correct: 0, why: "V + by + mức · a peak of + giá trị. — Ngày 17 mục 4." },
          { q: "11. The city is committed ___ emissions by 2035.", options: ["to cut", "to cutting", "for cutting"], correct: 1, why: "be committed to + V-ing. — Ngày 17 mục 4." },
          { q: "12. Câu nào chấm phẩy đúng?", options: ["Demand fell, however prices stayed high.", "Demand fell; however, prices stayed high.", "Demand fell however, prices stayed high."], correct: 1, why: "; however, nối hai câu đủ. — Ngày 17 mục 5." },
        ],
      },
      {
        t: "quiz", id: "t5d18-kt-ngu-phap-dien", kind: "fill", title: "1b. Điền MỘT từ, hoặc gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "1. Not only ___ the scheme save money; it also cut waiting times. (quá khứ)", answers: ["did"], hint: "Not only + did + S + V — Ngày 13" },
          { q: "2. What the report fails to explain ___ why costs rose so sharply.", answers: ["is"], hint: "What… is… — Ngày 13" },
          { q: "3. (Task 2) The council [got rid of] the parking fee in 2021. — gõ MỘT động từ trang trọng", answers: ["abolished", "removed", "eliminated"], hint: "cụm động từ → động từ đơn — Ngày 15" },
          { q: "4. (Task 2) Many [kids] learn faster outdoors.", answers: ["children"], hint: "register — Ngày 15" },
          { q: "5. One of the main [advantage] is flexibility.", answers: ["advantages"], hint: "one of the + số nhiều — Ngày 17" },
          { q: "6. Success depends on the extent ___ which staff are trained.", answers: ["to"], hint: "the extent to which — Ngày 17" },
        ],
      },

      { t: "h", text: "Phần 2 — Từ vựng (10 + 6 câu · đạt ≥ 12/16 · trượt thì ôn Ngày 14, 16, 18)" },
      {
        t: "mcq", id: "t5d18-kt-tu-vung-chon", title: "2a. Chọn từ đúng (10 câu)",
        items: [
          { q: "1. The stadium cost a fortune and is now hardly used: a classic ___.", options: ["underdog", "white elephant", "governing body"], correct: 1, why: "white elephant = công trình tốn kém, vô dụng. — Ngày 14" },
          { q: "2. Judging medieval rulers by modern standards is an ___.", options: ["anachronism", "aftermath", "endorsement"], correct: 0, why: "anachronism = sai lệch thời đại. — Ngày 14" },
          { q: "3. People notice the evidence that supports what they already believe. This is ___.", options: ["loss aversion", "confirmation bias", "herd behaviour"], correct: 1, why: "confirmation bias. — Ngày 14" },
          { q: "4. The museum could not establish the ___ of the vase, so it declined to buy it.", options: ["provenance", "commemoration", "continuity"], correct: 0, why: "provenance = nguồn gốc, lai lịch hiện vật. — Ngày 14" },
          { q: "5. Whether you get the treatment depends on where you live — a ___.", options: ["postcode lottery", "green belt", "carbon sink"], correct: 0, why: "postcode lottery. — Ngày 16" },
          { q: "6. Solar power is ___: output stops when the sun goes down.", options: ["intermittent", "self-paced", "disruptive"], correct: 0, why: "intermittent = không liên tục. — Ngày 16" },
          { q: "7. Parents who supervise every minute of a child's day are accused of ___.", options: ["code-switching", "helicopter parenting", "content moderation"], correct: 1, why: "helicopter parenting. — Ngày 16" },
          { q: "8. Nobody mentioned redundancies, though it was clearly ___.", options: ["the elephant in the room", "a close call", "common ground"], correct: 0, why: "the elephant in the room. — Ngày 18" },
          { q: "9. A lower price is ___, I'm afraid; free delivery is not.", options: ["on the small side", "off the table", "touch and go"], correct: 1, why: "off the table = không bàn nữa. — Ngày 18" },
          { q: "10. (chê) His emails are ___: he rarely answers the question he was asked.", options: ["candid", "tactful", "evasive"], correct: 2, why: "evasive = lảng tránh. — Ngày 18" },
        ],
      },
      {
        t: "quiz", id: "t5d18-kt-tu-vung-dien", kind: "fill", title: "2b. Điền MỘT từ (chữ đầu cho sẵn) (6 câu)",
        items: [
          { q: "1. Athletes caught d___ are banned for four years.", answers: ["doping"], hint: "Ngày 14" },
          { q: "2. With h___, the decision looks obvious, but at the time it was not.", answers: ["hindsight"], hint: "Ngày 14" },
          { q: "3. Many graduates now have a p___ career, combining several part-time roles.", answers: ["portfolio"], hint: "Ngày 16" },
          { q: "4. Demand for coal has begun to t___ off.", answers: ["taper"], hint: "Ngày 16" },
          { q: "5. The service left s___ to be desired.", answers: ["something"], hint: "Ngày 18" },
          { q: "6. We need to i___ out a few details before we sign.", answers: ["iron"], hint: "Ngày 18" },
        ],
      },

      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      {
        t: "quiz", id: "t5d18-kt-dich", kind: "translate", title: "3. Dịch sang tiếng Anh",
        items: [
          { q: "Chỉ khi giá vé giảm thì nhiều người mới bỏ xe hơi. (Only when)", answers: ["Only when fares fall will more people give up their cars.", "Only when fares are reduced will more people give up their cars.", "Only when fares fall will more people give up driving.", "Only when ticket prices fall will more people give up their cars.", "Only when fares fall will more people abandon their cars."], hint: "Only when + S V + will + S + V — Ngày 13" },
          { q: "Chính phủ nên bãi bỏ khoản phí này. (mức Task 2, không dùng get rid of)", answers: ["The government should abolish this fee.", "The government should abolish this charge.", "The government should remove this fee.", "The government should eliminate this fee.", "The government should remove this charge.", "The government ought to abolish this fee."], hint: "abolish · fee / charge — Ngày 15" },
          { q: "Hầu hết bằng chứng cho thấy cách tiếp cận này hiệu quả.", answers: ["Most of the evidence suggests that this approach is effective.", "Most evidence suggests that this approach is effective.", "Most of the evidence shows that this approach is effective.", "Most of the evidence suggests that this approach works.", "Most evidence suggests this approach is effective.", "Most of the evidence indicates that this approach is effective."], hint: "most (of the) evidence + suggests — Ngày 17" },
          { q: "Nhìn lại thì quyết định đó là một sai lầm. (hindsight)", answers: ["With hindsight, the decision was a mistake.", "In hindsight, the decision was a mistake.", "With hindsight, that decision was a mistake.", "In hindsight, that decision was a mistake.", "With the benefit of hindsight, the decision was a mistake."], hint: "With hindsight, … — Ngày 14" },
          { q: "Lợi ích thì ngắn hạn, trong khi tổn thất thì không thể đảo ngược.", answers: ["The benefits are short-term, whereas the losses are irreversible.", "The benefits are short-term, while the losses are irreversible.", "The benefits are short-term, whereas the losses cannot be reversed.", "The benefits are short-lived, whereas the losses are irreversible.", "The benefits are temporary, whereas the losses are irreversible."], hint: "câu cân: whereas · irreversible — Ngày 16" },
          { q: "Nhà máy sẽ bị phá để lấy chỗ cho một trung tâm y tế. (is to be)", answers: ["The factory is to be demolished to make way for a health centre.", "The factory is to be knocked down to make way for a health centre.", "The factory is to be pulled down to make way for a health centre.", "The factory is to be demolished to make way for a medical centre."], hint: "is to be demolished · make way for — Ngày 18" },
        ],
      },

      { t: "h", text: "Phần 4 — Nghe (5 + 5 câu · đạt ≥ 7/10 · trượt thì ôn Ngày 13, 16, 17)" },
      { t: "p", text: "Hai đoạn, mỗi đoạn nghe **một lần**. Đọc câu hỏi 20 giây trước mỗi đoạn." },
      {
        t: "listen", id: "t5d18-kt-nghe-xe-dap", title: "A proposal for a campus bike-share",
        dan: { so: "Day 18, Review 1", boiCanh: "two students, Ben and Aroha, discussing a proposal they are writing.", cau: [1, 5] },
        lines: [
          { who: "Ben", voice: "uk-nam", text: "So, the bike-share proposal. I've read your draft, Aroha, and I can't say I disagree with any of it, but I think the numbers need another look." },
          { who: "Aroha", voice: "nz-nu", text: "Go on." },
          { who: "Ben", voice: "uk-nam", text: "You've got forty bikes. The quote I got yesterday was for forty, but that was before the union said it would only pay half. Realistically we're looking at twenty-five." },
          { who: "Aroha", voice: "nz-nu", text: "Twenty-five's not nothing. And it's not as if nobody would use them — two hundred and thirty people answered the survey, and only fifteen said they wouldn't." },
          { who: "Ben", voice: "uk-nam", text: "Fair enough. My worry isn't demand, it's where they go. The space outside the library was my first thought, but security won't allow anything on that side." },
          { who: "Aroha", voice: "nz-nu", text: "Then the sports centre. It's not ideal, but it's hardly out of the way." },
          { who: "Ben", voice: "uk-nam", text: "Agreed. And the fee — you've put two dollars a ride." },
          { who: "Aroha", voice: "nz-nu", text: "I had three, originally. I brought it down because the first-years told me they'd never pay that much." },
          { who: "Ben", voice: "uk-nam", text: "I'd keep it at two, then. Shall I rewrite the costs while you do the map?" },
          { who: "Aroha", voice: "nz-nu", text: "Deal. Friday?" },
          { who: "Ben", voice: "uk-nam", text: "Thursday, if you can. The committee meets on Friday morning." },
        ],
      },
      {
        t: "mcq", id: "t5d18-kt-nghe-xe-dap-cau", title: "Questions 1–5 — Choose the correct letter, A, B or C",
        items: [
          { q: "1. What does Ben think of Aroha's draft?", options: ["A  He disagrees with most of it.", "B  He agrees with it but wants the figures checked.", "C  He has not finished reading it."], correct: 1, why: "“I can't say I disagree with any of it” = phủ định kép ⇒ đồng ý; “the numbers need another look”. — Ngày 16 mục 4." },
          { q: "2. How many bikes can they realistically afford?", options: ["A  40", "B  25", "C  20"], correct: 1, why: "40 là báo giá cũ; “Realistically we're looking at twenty-five”. Con số bị đổi — Ngày 16 mục 3." },
          { q: "3. How many people in the survey said they would NOT use the bikes?", options: ["A  15", "B  215", "C  230"], correct: 0, why: "230 người trả lời; “only fifteen said they wouldn't”." },
          { q: "4. Where do they decide to put the bikes?", options: ["A  outside the library", "B  next to the security office", "C  at the sports centre"], correct: 2, why: "Thư viện bị bác (security won't allow). “Then the sports centre… hardly out of the way” + “Agreed.”" },
          { q: "5. When does Ben want the map finished?", options: ["A  by Thursday", "B  by Friday morning", "C  by Friday evening"], correct: 0, why: "Aroha đề xuất Friday; Ben sửa: “Thursday, if you can. The committee meets on Friday morning.”" },
        ],
      },
      { t: "p", text: "**Questions 6–10.** Complete the sentences. Write **ONE WORD OR A NUMBER** for each answer." },
      {
        t: "listen", id: "t5d18-kt-nghe-ao", title: "The pond at the end of the road",
        dan: { so: "Day 18, Review 2", boiCanh: "a man describing a place he remembers from his childhood.", cau: [6, 10] },
        lines: [
          { who: "Luc", voice: "ca-nam", text: "Where I grew up, there was a pond at the end of our road, and every winter, once the ice was thick enough, the neighbours would clear it for skating. Nobody organised it. Somebody would turn up with a shovel, and by the weekend there'd be a rink. It wasn't, as you might think, the kids who used it most. It was the grandparents, in the mornings, before school was out." },
          { who: "Luc", voice: "ca-nam", text: "The night I remember, I was about eleven. We'd lost the puck in a snowbank, it was getting dark, and my father had already called us in twice. And then all the house lights along the road went out — a power cut — and for the first time I saw how many stars there were. Nobody said anything. We just stood there on the ice. The pond's been fenced off since 2015, because of the insurance, they say. I understand that. I'd still give a lot to stand on it once more." },
        ],
      },
      {
        t: "quiz", id: "t5d18-kt-nghe-ao-cau", kind: "fill", title: "Questions 6–10 — ONE WORD OR A NUMBER",
        items: [
          { q: "6. The neighbours cleared the pond once the ice was ___ enough.", answers: ["thick"], hint: "once the ice was thick enough" },
          { q: "7. The people who used the rink most were the ___.", answers: ["grandparents"], hint: "It wasn't, as you might think, the kids… It was the grandparents. — câu chẻ sửa một điều tưởng (Ngày 17 mục 2)." },
          { q: "8. On the evening he describes, the children had lost the ___.", answers: ["puck"], hint: "We'd lost the puck in a snowbank. p-u-c-k" },
          { q: "9. When the lights went out, the speaker noticed the ___ for the first time.", answers: ["stars"], hint: "I saw how many stars there were." },
          { q: "10. The pond has been closed to the public since ___.", answers: ["2015"], hint: "fenced off since 2015" },
        ],
      },

      { t: "h", text: "Phần 5 — Đọc (4 + 5 + 3 câu · đạt ≥ 9/12 · 16 phút · trượt thì ôn Ngày 13, 15, 17)" },
      {
        t: "passage", title: "The Meeting Problem", intro: "Các nhà nghiên cứu được nêu tên trong bài là hư cấu, dùng cho bài kiểm tra.",
        paras: [
          { label: "A", text: "Ask the employees of almost any large organisation what wastes most of their time, and the answer comes back at once: meetings. Yet the same employees go on calling them. I have come to think that the usual explanation, that people simply enjoy the sound of their own voices, does not survive a close look, and that the remedies built on it have failed for that reason." },
          { label: "B", text: "The explanation with the longest history is that meetings grow to fill whatever time is set aside for them. Halvorsen, who timed several hundred meetings in an insurance company, found that those booked for an hour lasted, on average, fifty-eight minutes, whatever was on the agenda; when the same teams were given thirty-minute slots, they finished in twenty-nine, and their decisions were judged to be no worse. It is a striking result, and I do not doubt it. But it tells us how long meetings last, not why there are so many." },
          { label: "C", text: "A second line of research concerns what gets discussed. Adeyemi observed that a committee approving a budget spent longer on the cost of new chairs than on a contract worth a hundred times as much. Her conclusion was that people speak most on the matters they understand, and that the largest decisions, being the hardest to grasp, pass almost without comment. Castellan, repeating the study a decade later, obtained the same pattern but read it differently: in his view the members stayed silent on the large contract not because it baffled them but because none of them wished to be the one who had questioned it if things went wrong." },
          { label: "D", text: "Castellan's reading seems to me the more persuasive of the two, and it points to an answer to the question that Halvorsen's work leaves open. A decision taken by one person has an owner. A decision taken in a meeting belongs to everybody present, which is to say to nobody. Seen in this light, the meeting is not a failed attempt to share information, as its critics assume. It is a largely successful device for sharing blame." },
          { label: "E", text: "If that is right, the fashionable cures are aimed at the wrong target. Shorter slots, standing meetings and strict agendas all make meetings quicker; none of them makes a manager any more willing to decide alone. Organisations that really want fewer meetings will have to make it safe to be wrong, and that is a far harder thing to arrange than a smaller room." },
        ],
      },
      { t: "p", text: "**Questions 1–4** — Look at the following statements and the list of researchers. Match each statement with the correct researcher: **A** Halvorsen · **B** Adeyemi · **C** Castellan. Một chữ cái có thể dùng nhiều lần." },
      {
        t: "quiz", id: "t5d18-kt-doc-nguoi", kind: "fill", title: "Questions 1–4 — gõ chữ cái A–C",
        items: [
          { q: "1. believed that people keep quiet for fear of being held responsible later", answers: ["C"], hint: "Đoạn C: “none of them wished to be the one who had questioned it if things went wrong”." },
          { q: "2. showed that cutting the time available did not lead to poorer outcomes", answers: ["A"], hint: "Đoạn B: “given thirty-minute slots… their decisions were judged to be no worse”." },
          { q: "3. thought that how much people say depends on how well they understand a subject", answers: ["B"], hint: "Đoạn C: “people speak most on the matters they understand”." },
          { q: "4. confirmed an earlier finding while disagreeing about its cause", answers: ["C"], hint: "Đoạn C: “obtained the same pattern but read it differently”." },
        ],
      },
      { t: "p", text: "**Questions 5–9** — Do the following statements agree with the claims of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq", id: "t5d18-kt-doc-ynng", title: "Questions 5–9 — YES / NO / NOT GIVEN",
        items: [
          { q: "5. People call meetings chiefly because they like to hear themselves talk.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A: lời giải thích ấy “does not survive a close look” ⇒ tác giả bác ⇒ NO." },
          { q: "6. Halvorsen's finding about the length of meetings can be trusted.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “It is a striking result, and I do not doubt it.” Phê bình (But…) ≠ phủ nhận ⇒ YES. — Ngày 17 Bài 2 mục 5." },
          { q: "7. Halvorsen's research accounts for the large number of meetings that are held.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: “it tells us how long meetings last, not why there are so many” ⇒ NO. Khuôn X, not Y." },
          { q: "8. Adeyemi's study was carried out in a larger organisation than Castellan's.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài không so quy mô hai nơi nghiên cứu ⇒ NOT GIVEN." },
          { q: "9. Making meetings shorter is likely to reduce how many of them are held.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn E: các cách ấy “make meetings quicker; none of them makes a manager any more willing to decide alone” — nhắm sai đích ⇒ NO." },
        ],
      },
      {
        t: "mcq", id: "t5d18-kt-doc-mcq", title: "Questions 10–12 — Choose the correct letter",
        items: [
          { q: "10. According to the writer, what do meetings chiefly achieve?", options: ["A  They pass information between departments.", "B  They spread responsibility for decisions.", "C  They give managers an audience."], correct: 1, why: "Đoạn D: “a largely successful device for sharing blame”. A là điều người phê bình TƯỞNG (as its critics assume)." },
          { q: "11. Why does the writer mention the cost of new chairs?", options: ["A  to show that committees waste money on furniture", "B  to illustrate that minor items can receive more attention than major ones", "C  to prove that Adeyemi's method was unsound"], correct: 1, why: "Đoạn C: ghế ↔ hợp đồng gấp trăm lần: ví dụ cho việc chuyện nhỏ được bàn lâu hơn chuyện lớn." },
          { q: "12. What does the writer suggest an organisation must do if it wants fewer meetings?", options: ["A  impose stricter agendas", "B  hold meetings in smaller rooms", "C  ensure that people are not punished for mistakes"], correct: 2, why: "Đoạn E: “make it safe to be wrong”. A và B là các “fashionable cures” bị bác." },
        ],
      },

      { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 14, 16, 18)" },
      {
        t: "mcq", id: "t5d18-kt-viet-chon", title: "6a. Kiến thức viết band 8 (6 câu · đạt ≥ 5/6)",
        items: [
          { q: "1. Đề: “More and more people are choosing to live alone. Why is this happening? Is it a positive or a negative development?” Đề giao:", options: ["một nhiệm vụ: nêu ý kiến", "hai nhiệm vụ: nguyên nhân + đánh giá", "ba nhiệm vụ: nguyên nhân + giải pháp + ý kiến"], correct: 1, why: "Hai câu hỏi khác loại ⇒ hai nhiệm vụ. — Ngày 14 mục 2–3." },
          { q: "2. Thesis nào trả lời ĐỦ đề ở câu 1?", options: ["This essay will discuss the reasons and give my opinion.", "This trend is driven chiefly by later marriage and greater financial independence, and, although it brings real freedom, I regard it as a mixed development because of the isolation it can cause in old age.", "Living alone is becoming very popular in many countries nowadays."], correct: 1, why: "Thesis hai vế: vế nguyên nhân + vế đánh giá có lập trường. — Ngày 14 mục 7." },
          { q: "3. “Ba quả cân” của bài advantages / disadvantages band 8 là:", options: ["số ý bên lợi, số ý bên hại, số ví dụ", "ai chịu · bao lâu · có đảo ngược được không", "kinh tế · xã hội · môi trường"], correct: 1, why: "Cân bằng tiêu chí, không đếm ý. — Ngày 16 mục A2." },
          { q: "4. Câu nào là một câu CÂN (không phải câu đếm)?", options: ["There are three advantages and two disadvantages.", "The savings are real, but they go to the company, whereas the costs fall on its staff.", "Firstly, it saves money. Secondly, it saves time."], correct: 1, why: "Câu cân nói AI hưởng, AI chịu. — Ngày 16 mục A3." },
          { q: "5. Đề map ghi “a plan due for completion in 2032”. Câu nào hợp nhất?", options: ["The depot is likely to be perhaps demolished.", "The depot is to be demolished to make way for housing.", "The depot is going to be demolish."], correct: 1, why: "Kế hoạch đã quyết ⇒ is to be + V3. — Ngày 18 Bài 2 mục 3." },
          { q: "6. Overview map band 8 phải có:", options: ["mọi công trình của cả hai bản đồ", "hướng thay đổi về chức năng + cái được giữ", "ý kiến về kế hoạch"], correct: 1, why: "Ngày 10 mục A2 · Ngày 18 Bài 2 mục 1." },
        ],
      },
      { t: "p", text: "**6b. Task 1 (20 phút, ≥ 150 từ).** Hai bản đồ dưới đây cho thấy trung tâm làng Marlbrook Cross hiện nay và kế hoạch cho năm 2035 (làng hư cấu). Viết theo khung của Ngày 18 Bài 2." },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Marlbrook Cross village centre — now",
          note: "Bản đồ tự đặt cho bài kiểm tra (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 12, rows: 9,
            paths: [
              { x: 0, y: 0, w: 12, h: 0.8, label: "River Marl" },
              { x: 0, y: 4, w: 12, h: 0.9, label: "High Street" },
            ],
            boxes: [
              { x: 0.5, y: 1.3, w: 5.1, h: 2.4, label: "Farmland" },
              { x: 6, y: 1.3, w: 2.6, h: 2.4, label: "Primary school" },
              { x: 9.4, y: 1.3, w: 2.1, h: 2.4, label: "Petrol station" },
              { x: 0.5, y: 5.3, w: 2.6, h: 2.6, label: "Village hall" },
              { x: 3.5, y: 5.3, w: 3, h: 2.6, label: "Shops" },
              { x: 7, y: 5.3, w: 2, h: 2.6, label: "Car park" },
              { x: 9.4, y: 5.3, w: 2.1, h: 2.6, label: "Factory (closed)" },
            ],
          },
        },
      },
      {
        t: "figure",
        fig: {
          kind: "map",
          title: "Marlbrook Cross village centre — planned for 2035",
          note: "Bản đồ tự đặt cho bài kiểm tra (địa điểm hư cấu). Phía bắc ở trên.",
          map: {
            cols: 12, rows: 9,
            paths: [
              { x: 0, y: 0, w: 12, h: 0.8, label: "River Marl" },
              { x: 0, y: 0.85, w: 12, h: 0.35, label: "Riverside footpath" },
              { x: 0, y: 4, w: 12, h: 0.9, label: "High Street" },
            ],
            boxes: [
              { x: 0.5, y: 1.3, w: 3.1, h: 2.4, label: "Housing estate" },
              { x: 3.8, y: 1.3, w: 1.9, h: 2.4, label: "Playing field" },
              { x: 6, y: 1.3, w: 3.2, h: 2.4, label: "Primary school (extended)" },
              { x: 9.6, y: 1.3, w: 1.9, h: 2.4, label: "EV charging point" },
              { x: 0.5, y: 5.3, w: 2.6, h: 2.6, label: "Village hall" },
              { x: 3.5, y: 5.3, w: 3, h: 2.6, label: "Shops" },
              { x: 7, y: 5.3, w: 2, h: 2.6, label: "Health centre" },
              { x: 9.4, y: 5.3, w: 2.1, h: 2.6, label: "Business units" },
            ],
          },
        },
      },
      {
        t: "essay", id: "t5d18-kt-viet-task1", task: "Task 1", minWords: 150,
        prompt: "The maps show the centre of the village of Marlbrook Cross as it is now and as it is planned to look in 2035. NOW — the River Marl runs along the northern edge and the High Street crosses the middle from west to east. North of the High Street: farmland (west), a primary school (centre), a petrol station (east). South of the High Street: a village hall (west), shops (centre), a car park and a closed factory (east). PLAN FOR 2035 — a footpath along the river; the farmland replaced by a housing estate and a playing field; the primary school extended eastwards; the petrol station replaced by a smaller electric-vehicle charging point; the village hall and the shops unchanged; a health centre on the site of the car park; the factory replaced by business units. The river and the High Street remain. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        tips: [
          "Overview: phía bắc từ đất nông nghiệp sang nhà ở và tiện ích cho trẻ em; phía đông nam từ chỗ đỗ xe + nhà máy bỏ không sang dịch vụ và việc làm; lõi làng (hall, shops, đường, sông) được giữ.",
          "Thân bài chia theo khu: bắc High Street / nam High Street.",
          "Hiện trạng: hiện tại đơn. Kế hoạch: ít nhất bốn khuôn tương lai; một câu By 2035, … will have been…",
          "Không nêu lý do, không đánh giá kế hoạch.",
        ],
      },
      {
        t: "essay", id: "t5d18-kt-viet-task2", task: "Task 2", minWords: 250,
        prompt: "In many countries, people now change jobs several times during their working lives instead of staying with one employer. Why is this happening? Do the advantages of this development outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        tips: [
          "Đếm nhiệm vụ trước (Ngày 14): nguyên nhân + cân lợi – hại. Thesis hai vế.",
          "Phần cân dùng ba quả cân của Ngày 16: ai hưởng / ai chịu · ngắn hay dài hạn · đảo ngược được không.",
          "Cấu trúc nhấn mạnh đúng liều (Ngày 13): một câu chẻ HOẶC một đảo ngữ, một nhượng bộ thật.",
          "Soát bốn lượt của Ngày 17 trước khi nộp: danh từ → động từ → giới từ → dấu phẩy.",
        ],
      },

      { t: "h", text: "Phần 7 — Nói (4 câu Part 1 + Part 2 + 4 câu Part 3 · AI ≥ band 7.5 ước tính · trượt thì ôn Ngày 14, 15, 17, 18)" },
      {
        t: "speak", id: "t5d18-kt-noi-p1", part: "1",
        questions: [
          "Do you often lend things to your friends?",
          "Is there anything you would never lend to anyone?",
          "How do you feel when someone returns something late?",
          "Do you think people share things more or less than they used to?",
        ],
      },
      {
        t: "speak", id: "t5d18-kt-noi-p2", part: "2",
        questions: [
          "Describe a time when you had to reach an agreement with someone. You should say: who the person was; what you needed to agree about; how you reached the agreement; and explain how you felt about the result.",
          "Would you handle it in the same way today?",
        ],
      },
      {
        t: "speak", id: "t5d18-kt-noi-p3", part: "3",
        questions: [
          "Why do some agreements between people break down after a short time?",
          "Is a written agreement always better than a spoken one?",
          "Some people would say that an agreement nobody is completely happy with is a bad agreement. What do you think?",
          "So you're saying that people should accept whatever they are offered?",
        ],
      },
      {
        t: "note", title: "Tự chấm phần Nói — nghe lại bản ghi và trả lời có / không",
        items: [
          "**Part 1:** giọng trò chuyện, có viết tắt, không moreover / furthermore? Có một cụm nói giảm hoặc một idiom đúng dạng? (Ngày 15 · 18)",
          "**Part 2:** có bốn chặng và một câu “nhìn lại” (Ngày 14)? Có một cảnh cụ thể với had + V3 và một câu thoại, câu chốt xuống giọng (Ngày 17)?",
          "**Part 3:** câu 3 có công nhận trước khi phản đối (Ngày 15)? Câu 4 — tôi có SỬA cách diễn giải của giám khảo thay vì nói Yes (Ngày 18 Bài 3 mục 7)?",
          "**Ngữ điệu:** lời phản đối có xuống–lên (Ngày 15)? Liệt kê có lên – lên – xuống (Ngày 17)?",
        ],
      },

      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm của Ngày 13–18)" },
      {
        t: "mcq", id: "t5d18-kt-phat-am", title: "8. Chọn đáp án đúng (8 câu)",
        items: [
          { q: "1. “What matters most | is not the cost | but who pays it.” Chỗ ngừng mang nghĩa rõ nhất nên đặt:", options: ["sau What", "trước but", "sau pays"], correct: 1, why: "Ngừng trước vế tương phản để người nghe chờ ý chính. — Ngày 13 mục 3." },
          { q: "2. “I didn't say the train was late; I said it was cancelled.” Hai từ được nhấn mạnh nhất:", options: ["train · said", "late · cancelled", "didn't · was"], correct: 1, why: "Nhấn tương phản: hai từ đối nhau. — Ngày 14 mục 7." },
          { q: "3. “That's true up to a POINT…” nói bằng giọng xuống–lên báo cho người nghe:", options: ["câu đã xong", "sắp có chữ but", "đây là câu hỏi"], correct: 1, why: "Fall-rise = còn ý ngược phía sau. — Ngày 15 mục 4." },
          { q: "4. “It's not that I DON'T want to go.” Người nói:", options: ["không muốn đi", "muốn đi, nhưng có lý do khác cản trở", "chưa quyết định"], correct: 1, why: "Phủ định kép + nhấn DON'T: tôi có muốn; vấn đề nằm chỗ khác. — Ngày 16 mục 4." },
          { q: "5. Kể chuyện: “We got to the gate, showed our tickets, and went in.” Giọng ở gate và tickets:", options: ["xuống", "lên", "ngang"], correct: 1, why: "Vế chưa xong ⇒ lên; chỉ xuống ở went in. — Ngày 17 Bài 3 mục 3." },
          { q: "6. “The venue, which nobody had bothered to check, was closed.” Phần giữa hai dấu phẩy nên nói:", options: ["cao và to hơn", "thấp và lướt nhanh hơn", "chậm nhất câu"], correct: 1, why: "Lời chen ⇒ hạ giọng. — Ngày 17 Bài 3 mục 3." },
          { q: "7. “That's the one thing I can't move on.” (giới hạn đỏ) kết bằng giọng:", options: ["lên", "xuống chắc", "xuống rồi lên"], correct: 1, why: "Cửa đóng ⇒ xuống chắc. — Ngày 18 Bài 3 mục 8." },
          { q: "8. “What if we delivered it in two stages?” (thăm dò) kết bằng giọng:", options: ["lên nhẹ", "xuống mạnh", "ngang, đều"], correct: 0, why: "Cửa mở ⇒ lên nhẹ. — Ngày 18 Bài 3 mục 8." },
        ],
      },

      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table",
        head: ["Phần", "Ngưỡng đạt", "Trượt thì ôn", "Điểm của bạn"],
        rows: [
          ["1. Ngữ pháp", "≥ 13/18", "Ngày 13 (câu 1–4, 1b.1–2) · Ngày 15 (câu 5–8, 1b.3–4) · Ngày 17 (câu 9–12, 1b.5–6)", "…… /18"],
          ["2. Từ vựng", "≥ 12/16", "Ngày 14 (câu 1–4, 2b.1–2) · Ngày 16 (câu 5–7, 2b.3–4) · Ngày 18 (câu 8–10, 2b.5–6)", "…… /16"],
          ["3. Dịch", "≥ 5/6", "Câu 1 → Ngày 13 · 2 → Ngày 15 · 3 → Ngày 17 · 4 → Ngày 14 · 5 → Ngày 16 · 6 → Ngày 18", "…… /6"],
          ["4. Nghe", "≥ 7/10", "Câu 1–5 (phủ định kép, con số bị đổi, ai đồng ý) → Ngày 13 · 16 · Câu 6–10 (bài kể) → Ngày 17", "…… /10"],
          ["5. Đọc", "≥ 9/12", "Câu 1–4 (matching features) → Ngày 15 · Câu 5–9 (YNNG: phê bình ≠ phủ nhận) → Ngày 17 · Câu 10–12 → Ngày 13 (Passage 3)", "…… /12"],
          ["6. Viết", "6a ≥ 5/6 · AI ≥ 7.5", "Task 1 → Ngày 18 · Task 2 → Ngày 14 (nhận dạng) · Ngày 16 (cân) · câu 1–2 → Ngày 14 · 3–4 → Ngày 16 · 5–6 → Ngày 18", "…… /6 · T1 …… · T2 ……"],
          ["7. Nói", "AI ≥ 7.5", "Part 1 → Ngày 15 · Part 2 → Ngày 14 · 17 · Part 3 → Ngày 13 · 15 · 18", "P1 …… · P2 …… · P3 ……"],
          ["8. Phát âm", "≥ 6/8", "Câu 1 → Ngày 13 · 2 → Ngày 14 · 3 → Ngày 15 · 4 → Ngày 16 · 5–6 → Ngày 17 · 7–8 → Ngày 18", "…… /8"],
        ],
      },
      {
        t: "note", title: "📌 Sang chặng 4 (Ngày 19–24)",
        items: [
          "**Đạt cả 8 phần:** sang Ngày 19 (mixed conditionals, subjunctive, dấu câu vòng 3; Reading đủ 3 passage 55 phút lần 2).",
          "**Trượt 1–2 phần:** ôn đúng Ngày ghi trong bảng (chỉ mục liên quan), làm lại riêng phần đó sau 48 giờ. Vẫn được học tiếp Ngày 19 song song.",
          "**Trượt từ 3 phần:** dừng 2 ngày để ôn. Chặng 4 có **Đề 11** (Ngày 24, band 8.0); vào đề khi nền chặng 3 còn hổng thì kết quả không phản ánh đúng sức.",
          "Ghi mọi câu sai của bài này vào **Sổ lỗi** theo ba cột: sai gì → vì sao → câu đúng. So với trang sổ lỗi Đề 10: lỗi nào **lặp lại** là lỗi dai dẳng — đưa lên đầu danh sách soát của Ngày 23 (bảng tự soát 6 lượt lần 3).",
        ],
      },
    ],
  },
];
