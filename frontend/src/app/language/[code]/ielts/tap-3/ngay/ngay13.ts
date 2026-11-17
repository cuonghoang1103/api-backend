/**
 * IELTS Tập 3 — Ngày 13 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Bị động vòng 3: mọi thì · với modal · to be V3 / being V3 · động từ hai tân ngữ · by + agent   [G24, ôn G09]
 *                     — nối Tập 1 Ngày 15 (bị động các thì cơ bản + modal + by), Tập 2 Ngày 20 (process) · Ngày 22 (map)
 *   Bài 2 (reading)   Multiple choice: một đáp án (ôn) + chọn TWO / THREE; bài đọc ~900 từ (lịch sử hải đăng), 13 câu [R10 R11]
 *                     — nối Tập 2 Ngày 10 (bốn loại câu trắc nghiệm)
 *   Bài 3 (listening) Part 4 — Note completion một bài giảng 5 phút, không có quãng nghỉ giữa bài                     [L06 L07]
 *                     — nối Tập 2 Ngày 19 (Part 4 nhập môn) · 🔊 /ʃ/ /ʒ/ trong -tion / -sion
 *   Bài tập Ngày 13   41 câu có đáp án
 * Mọi id bắt đầu `t3d13-`.
 */
import type { Lesson } from '../data';

export const NGAY_13: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t3d13-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Câu bị động vòng 3 — mọi thì, với modal, hai tân ngữ, by + agent",
    goal: "Viết và nói đúng câu bị động ở 8 thì hay dùng, sau modal (should be done, could have been avoided), ở dạng to be V3 / being V3, với động từ hai tân ngữ (was given…), biết khi nào giữ – khi nào bỏ by + người làm, và không còn viết ~~was happened~~ — đẩy GRA band 6 (trộn câu đơn + câu phức, lỗi không làm sai nghĩa) cho Task 1 process / map và Task 2.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Câu bị động** (passive) = câu mà chủ ngữ **chịu** hành động: The bridge **was built** in 1990. Công thức gốc không đổi: ==be + V3==. Tập 1 Ngày 15 đã học bị động ở các thì cơ bản (hiện tại đơn / tiếp diễn, quá khứ đơn, tương lai, modal + be) và bẫy ~~was happened~~; Tập 2 Ngày 20 · 22 dùng nó để tả quy trình và bản đồ.",
          "Hôm nay mở rộng đủ: **8 thì** hay dùng (thêm quá khứ tiếp diễn, quá khứ hoàn thành, be going to — chỉ cần chia **be**, V3 giữ nguyên) · **modal + have been + V3** (nói về quá khứ) · **to be V3 / being V3**.",
          "Động từ **hai tân ngữ** (give, offer, send, pay…) có hai câu bị động; tiếng Anh thích lấy **người** làm chủ ngữ: Workers **were given** a bonus.",
          "**by + người làm** (agent): chỉ giữ khi người làm là ==thông tin mới, quan trọng==. Khoảng 80 % câu bị động trong bài học thuật **không có by**.",
          "Lỗi band 5 hay gặp nhất: bị động hoá động từ **không có tân ngữ** (~~was happened~~, ~~was risen~~, ~~is existed~~) và quên **be** / quên **been**.",
          "Tiêu chí được đẩy: **GRA** (Writing + Speaking). Bị động dùng đúng chỗ còn giúp **CC**: giữ cùng một chủ đề ở đầu các câu liền nhau.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 1 Ngày 15, Tập 2 Ngày 20 · 22: be + V3 và 3 bước đổi câu" },
      {
        t: "p",
        text: "Câu **chủ động** (active): người làm đứng đầu — **Workers** build the houses. Câu **bị động** (passive): vật / người **chịu** hành động đứng đầu — **The houses** are built (by workers). Tiếng Việt hay dùng “được / bị”; tiếng Anh dùng ==be + V3== (V3 = quá khứ phân từ: built, made, taken, increased).",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Đổi chủ động → bị động: 3 bước",
        steps: [
          { label: "1. Tìm tân ngữ (O)", sub: "The council **closed** ==the library==. → O = the library" },
          { label: "2. Đưa O lên làm chủ ngữ", sub: "The library …" },
          { label: "3. be (đúng thì, đúng số) + V3", sub: "The library **was closed**." },
          { label: "4. Người làm: bỏ, hoặc by + …", sub: "(by the council) — chỉ giữ nếu cần" },
        ],
        caption: "Không có tân ngữ ⇒ không có câu bị động (xem mục 7).",
      },
      {
        t: "table",
        head: ["Thì", "Chủ động", "Bị động"],
        rows: [
          ["Hiện tại đơn", "They collect the rubbish every day.", "The rubbish **is collected** every day."],
          ["Quá khứ đơn", "They opened the airport in 2005.", "The airport **was opened** in 2005."],
        ],
        caption: "Hai thì nền đã học ở Tập 1 Ngày 15 (cùng hiện tại tiếp diễn, tương lai, modal + be). Thì nằm ở be (is / was); V3 không đổi.",
      },
      {
        t: "quiz",
        id: "t3d13-on-bi-dong",
        kind: "fill",
        title: "Kiểm tra đầu bài — chia động từ ở bị động hiện tại đơn / quá khứ đơn (6 câu)",
        items: [
          { q: "Rice ___ (grow) in most provinces of Vietnam.", answers: ["is grown"] },
          { q: "The first metro line ___ (open) in 2021.", answers: ["was opened"] },
          { q: "In the second stage, the bottles ___ (wash) with hot water.", answers: ["are washed"] },
          { q: "Two new car parks ___ (build) next to the station last year.", answers: ["were built"] },
          { q: "English ___ (teach) from primary school in many countries.", answers: ["is taught"] },
          { q: "The old factory ___ (knock) down ten years ago.", answers: ["was knocked"] },
        ],
      },
      { t: "rule", formula: "S (vật / người chịu hành động) + be + V3 (+ by + người làm)", vi: "Thì và số ít / số nhiều nằm ở be; V3 giữ nguyên." },

      /* ── 2 ── */
      { t: "h", text: "2. Bị động ở mọi thì — chỉ chia BE" },
      {
        t: "p",
        text: "Muốn đổi thì của câu bị động, bạn **chỉ đổi be**: is → is being → was → was being → has been → had been → will be. V3 đứng cuối, không bao giờ đổi. Thì tiếp diễn có thêm ==being==, thì hoàn thành có thêm ==been== — hai từ này người Việt hay bỏ quên nhất.",
      },
      {
        t: "table",
        head: ["Thì", "be chia thành", "Ví dụ bị động", "Dùng ở đâu"],
        rows: [
          ["Hiện tại đơn", "am / is / are + V3", "Coffee **is exported** to 80 countries.", "Sự thật, quy trình (Task 1 process)"],
          ["Hiện tại tiếp diễn", "am / is / are **being** + V3", "A new bridge **is being built**.", "Việc đang diễn ra; xu hướng hiện nay"],
          ["Quá khứ đơn", "was / were + V3", "The law **was passed** in 2019.", "Mốc quá khứ; map “trước đây”"],
          ["Quá khứ tiếp diễn", "was / were **being** + V3", "The road **was being repaired** when I visited.", "Việc đang dở tại một lúc trong quá khứ"],
          ["Hiện tại hoàn thành", "have / has **been** + V3", "The park **has been replaced** by flats.", "Thay đổi tới nay; map “so với trước”"],
          ["Quá khứ hoàn thành", "had **been** + V3", "By 2010 the factory **had been closed**.", "Xảy ra trước một mốc quá khứ (By + năm)"],
          ["Tương lai đơn", "will **be** + V3", "The results **will be published** in May.", "Dự báo, kế hoạch"],
          ["be going to", "am / is / are going to **be** + V3", "The stadium **is going to be rebuilt**.", "Kế hoạch đã định; map tương lai"],
        ],
        caption: "8 thì bị động hay dùng. Hai dạng gần như không dùng ở bị động: hoàn thành tiếp diễn (~~has been being built~~) và tương lai tiếp diễn (~~will be being built~~) — nghe rất nặng, hãy đổi sang chủ động.",
      },
      {
        t: "sodo",
        kind: "timeline",
        title: "Cùng một cây cầu — bốn thời điểm",
        marks: [
          { from: -8, label: "had been designed (trước 2015)", kieu: "diem", mau: 3 },
          { from: -5, label: "was opened (2018)", kieu: "diem", mau: 1 },
          { from: -5, to: 0, label: "has been used by 2 million cars", kieu: "doan", mau: 2 },
          { from: 0, label: "is being repaired (lúc này)", kieu: "diem", mau: 1 },
          { from: 6, label: "will be widened (2030)", kieu: "diem", mau: 3 },
        ],
        caption: "Thì nào thì chọn be của thì đó — phần V3 (designed, opened, used, repaired, widened) không đổi.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + am / is / are + being + V3",
            vi: "Đang được làm (ngay lúc này / giai đoạn này).",
            examples: [
              { en: "More and more goods are being bought online.", vi: "Ngày càng nhiều hàng hoá đang được mua trên mạng." },
              { en: "The city centre is being redeveloped at the moment.", vi: "Trung tâm thành phố hiện đang được quy hoạch lại." },
            ],
          },
          {
            formula: "S + have / has + been + V3",
            vi: "Đã được làm (kết quả còn tới bây giờ).",
            examples: [
              { en: "A great deal of money has been spent on public transport.", vi: "Rất nhiều tiền đã được chi cho giao thông công cộng." },
              { en: "The fields to the north have been turned into a housing estate.", vi: "Các cánh đồng phía bắc đã được biến thành khu dân cư." },
            ],
          },
          {
            formula: "S + had + been + V3",
            vi: "Đã được làm trước một mốc quá khứ.",
            examples: [
              { en: "By 2015, all the old trams had been taken out of service.", vi: "Đến năm 2015, toàn bộ tàu điện cũ đã bị ngừng sử dụng." },
            ],
          },
          {
            formula: "S + will + be + V3",
            vi: "Sẽ được làm.",
            examples: [
              { en: "Many office jobs will be replaced by software.", vi: "Nhiều việc văn phòng sẽ bị phần mềm thay thế." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi đổi thì câu bị động",
        items: [
          "Quên **been** ở thì hoàn thành: ~~The school has built in 2001~~ → The school **was built** in 2001 (có năm cụ thể ⇒ quá khứ đơn) / ~~Many trees have cut down~~ → Many trees **have been cut down**.",
          "Quên **being** ở thì tiếp diễn: ~~A new road is building~~ → A new road **is being built**.",
          "Chia sai số: ~~A number of houses was built~~ → **were** built (a number of + N số nhiều ⇒ động từ số nhiều); The number of houses **was**…",
          "Dùng V2 thay V3: ~~was took~~ → was **taken**; ~~has been chose~~ → has been **chosen**; ~~was rose~~ (rise không có bị động — mục 7).",
          "Tiếng Việt không cần “được”: “Ngôi nhà này xây năm 1990” ⇒ tiếng Anh **bắt buộc** bị động: This house **was built** in 1990, không phải ~~This house built in 1990~~.",
        ],
      },
      { t: "rule", formula: "S + be (chia theo thì: is being / was being / has been / had been / will be) + V3", vi: "Tiếp diễn thêm being, hoàn thành thêm been; V3 không đổi." },
      {
        t: "quiz",
        id: "t3d13-moi-thi-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — bị động ở các thì (5 câu)",
        grammar: "S + be (đúng thì) + V3",
        items: [
          { q: "Một bệnh viện mới đang được xây ở phía nam thành phố.", answers: ["A new hospital is being built in the south of the city.", "A new hospital is being built to the south of the city."], hint: "is being built · in the south of" },
          { q: "Hơn 200 cây đã bị chặt kể từ năm 2020.", answers: ["More than 200 trees have been cut down since 2020.", "Over 200 trees have been cut down since 2020."], hint: "have been cut down · since" },
          { q: "Đến năm 2000, nhà máy cũ đã bị đóng cửa.", answers: ["By 2000, the old factory had been closed.", "By 2000 the old factory had been closed.", "The old factory had been closed by 2000.", "By 2000, the old factory had been closed down.", "The old factory had been closed down by 2000."], hint: "By 2000 · had been closed" },
          { q: "Kết quả sẽ được công bố vào tháng sau.", answers: ["The results will be published next month.", "The results will be announced next month.", "The result will be published next month.", "The result will be announced next month."], hint: "will be published / announced" },
          { q: "Con đường đang được sửa khi tôi đến thăm thị trấn.", answers: ["The road was being repaired when I visited the town.", "The road was being fixed when I visited the town."], hint: "was being repaired · when" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Bị động với modal: should be done · could have been avoided" },
      {
        t: "p",
        text: "**Modal** (động từ khuyết thiếu): can, could, may, might, must, should, will, would. Sau modal luôn là động từ nguyên mẫu ⇒ ở bị động là ==be== (không chia). Đây là cấu trúc ăn điểm nhất của Task 2: khi đề hỏi “nên làm gì”, bạn không cần nói **ai** làm — More money **should be invested** in… Nói về **quá khứ** (việc đáng lẽ / có lẽ đã xảy ra) thì dùng ==modal + have been + V3==.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + modal + be + V3",
            vi: "Hiện tại / tương lai: nên được, có thể được, phải được…",
            examples: [
              { en: "Stricter laws should be introduced to reduce plastic waste.", vi: "Nên ban hành luật nghiêm hơn để giảm rác nhựa." },
              { en: "This problem can be solved in two ways.", vi: "Vấn đề này có thể được giải quyết theo hai cách." },
              { en: "Children must be taught how to use the internet safely.", vi: "Trẻ em phải được dạy cách dùng internet an toàn." },
            ],
          },
          {
            formula: "S + modal + have been + V3",
            vi: "Quá khứ: đáng lẽ đã (không) được…, có lẽ đã được…",
            examples: [
              { en: "The accident could have been avoided.", vi: "Tai nạn ấy lẽ ra đã có thể tránh được." },
              { en: "Local residents should have been consulted before the park was sold.", vi: "Đáng lẽ phải hỏi ý kiến người dân trước khi công viên bị bán." },
              { en: "The data may have been collected incorrectly.", vi: "Có thể dữ liệu đã bị thu thập sai." },
            ],
          },
          {
            formula: "S + have to / need to / ought to + be + V3",
            vi: "Các cụm giống modal cũng theo khuôn này.",
            examples: [
              { en: "These forms have to be completed by Friday.", vi: "Các mẫu đơn này phải được điền xong trước thứ Sáu." },
              { en: "More research needs to be done in this area.", vi: "Cần nghiên cứu thêm trong lĩnh vực này." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Ý muốn nói", "Câu chủ động (band 5)", "Câu bị động với modal (band 6)"],
        rows: [
          ["Giải pháp", "The government should build more schools.", "More schools **should be built** in rural areas."],
          ["Khả năng", "We can reduce pollution.", "Pollution **can be reduced** if more people cycle to work."],
          ["Nghĩa vụ", "Companies must pay workers fairly.", "Workers **must be paid** a fair wage."],
          ["Dự đoán", "Robots will do dangerous jobs.", "Dangerous jobs **will** probably **be done** by robots."],
          ["Tiếc về quá khứ", "They should have spent the money on hospitals.", "The money **should have been spent** on hospitals."],
        ],
        caption: "Không phải câu nào cũng cần đổi. Đổi khi bạn muốn câu bắt đầu bằng CHỦ ĐỀ của đoạn (schools, pollution, workers) thay vì “the government / we / they” lặp đi lặp lại.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với modal + bị động",
        items: [
          "Quên **be**: ~~This problem can solved~~ → can **be** solved. ~~Smoking should banned~~ → should **be** banned.",
          "Chia be sau modal: ~~should is done~~ / ~~can been done~~ → should **be** done / can **be** done.",
          "Nhầm hiện tại với quá khứ: “đáng lẽ phải được xây từ 10 năm trước” = **should have been built** ten years ago, không phải ~~should be built ten years ago~~.",
          "Trạng từ đứng **sau modal, trước be**: can **easily** be solved · should **also** be considered · will **probably** be replaced.",
          "**need** có hai cách: The roof needs **to be repaired** = The roof needs **repairing** (cùng nghĩa). Không viết ~~needs to repair~~ khi mái nhà là thứ được sửa.",
        ],
      },
      { t: "rule", formula: "S + modal + be + V3 · S + modal + have been + V3 (quá khứ)", vi: "should be done = nên được làm; should have been done = đáng lẽ đã phải được làm (nhưng không)." },
      {
        t: "quiz",
        id: "t3d13-modal-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — modal + bị động (5 câu)",
        grammar: "S + modal + be + V3 / S + modal + have been + V3",
        items: [
          { q: "Nên chi nhiều tiền hơn cho giao thông công cộng. (Bắt đầu: More money…)", answers: ["More money should be spent on public transport.", "More money should be invested in public transport."], hint: "should be spent on" },
          { q: "Vấn đề này không thể được giải quyết chỉ bởi chính phủ.", answers: ["This problem cannot be solved by the government alone.", "This problem can't be solved by the government alone.", "This problem cannot be solved by governments alone.", "This problem cannot be solved only by the government."], hint: "cannot be solved · by … alone" },
          { q: "Trẻ em phải được bảo vệ khỏi nội dung có hại.", answers: ["Children must be protected from harmful content.", "Children have to be protected from harmful content."], hint: "must be protected from" },
          { q: "Lỗi này lẽ ra đã có thể tránh được.", answers: ["This mistake could have been avoided.", "This error could have been avoided.", "The mistake could have been avoided."], hint: "could have been avoided" },
          { q: "Cần làm thêm nghiên cứu trước khi luật được thay đổi. (Bắt đầu: More research…)", answers: ["More research needs to be done before the law is changed.", "More research must be done before the law is changed.", "More research has to be done before the law is changed.", "More research should be done before the law is changed.", "More research needs to be carried out before the law is changed."], hint: "needs to be done · before the law is changed" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. to be + V3 và being + V3 — bị động sau động từ khác và sau giới từ" },
      {
        t: "p",
        text: "Tập 3 Ngày 7 đã học: sau một số động từ là **to V** (want, expect, hope, need), sau một số khác và sau **giới từ** là **V-ing** (enjoy, avoid, without, after). Khi chủ ngữ là người / vật **chịu** hành động, hai dạng đó đổi thành ==to be + V3== và ==being + V3==.",
      },
      {
        t: "table",
        head: ["Khuôn", "Chủ động", "Bị động"],
        rows: [
          ["to V → to be V3", "Employees want **to know** the truth.", "Employees want **to be told** the truth."],
          ["", "The company expects **to finish** the work in May.", "The work is expected **to be finished** in May."],
          ["V-ing → being V3", "Most people dislike **criticising** others in public.", "Most people dislike **being criticised** in public."],
          ["sau giới từ", "He left without **telling** anyone.", "He left without **being noticed**."],
          ["", "After **heating** the mixture, they cool it.", "After **being heated**, the mixture is cooled."],
        ],
        caption: "“After being + V3” là cụm nối bước rất gọn cho Task 1 process (ôn Tập 2 Ngày 20).",
      },
      {
        t: "examples",
        items: [
          { en: "Sales are expected to be boosted by the new store. (dự báo Task 1 — nối Tập 3 Ngày 5)", vi: "Doanh số được kỳ vọng sẽ được thúc đẩy nhờ cửa hàng mới." },
          { en: "Many young workers complain about being paid less than older colleagues.", vi: "Nhiều lao động trẻ phàn nàn vì bị trả lương thấp hơn đồng nghiệp lớn tuổi." },
          { en: "The bottles are sorted by colour before being crushed into small pieces.", vi: "Chai lọ được phân loại theo màu trước khi bị nghiền thành mảnh nhỏ." },
          { en: "Elderly people deserve to be treated with respect.", vi: "Người cao tuổi xứng đáng được đối xử tôn trọng." },
        ],
      },
      { t: "rule", formula: "V (want / expect / need / deserve) + to be + V3 · giới từ / V (avoid / enjoy / risk) + being + V3", vi: "Chủ ngữ chịu hành động ⇒ to V thành to be V3, V-ing thành being V3." },
      {
        t: "mcq",
        id: "t3d13-to-be-being",
        title: "Chọn dạng đúng: to be V3 hay being V3? (6 câu)",
        items: [
          { q: "After ___, the leaves are packed into boxes.", options: ["being dried", "to be dried", "been dried", "drying them"], correct: 0, why: "Sau giới từ after là V-ing; lá chịu hành động “sấy khô” ⇒ being dried." },
          { q: "Most customers expect ___ within 24 hours.", options: ["being answered", "to be answered", "to answer", "answered"], correct: 1, why: "expect + to V; khách hàng là người ĐƯỢC trả lời ⇒ to be answered." },
          { q: "Some children are afraid of ___ at by their classmates.", options: ["to be laughed", "laughing", "being laughed", "be laughed"], correct: 2, why: "afraid of + V-ing; trẻ bị cười nhạo ⇒ being laughed at (giữ at của laugh at)." },
          { q: "The new airport is expected ___ in 2030.", options: ["completing", "being completed", "to complete", "to be completed"], correct: 3, why: "is expected + to V; sân bay ĐƯỢC hoàn thành ⇒ to be completed." },
          { q: "He was lucky to avoid ___ after the accident.", options: ["being fined", "to be fined", "fined", "be fined"], correct: 0, why: "avoid + V-ing; anh ấy (suýt) BỊ phạt ⇒ being fined." },
          { q: "These documents need ___ before the meeting.", options: ["be checked", "to be checked", "being checked", "to check"], correct: 1, why: "need + to be V3 (hoặc need + V-ing: need checking). “being checked” sai sau need." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Động từ hai tân ngữ: give · offer · send · pay · show · teach · tell" },
      {
        t: "p",
        text: "Một số động từ có **hai tân ngữ**: một **người** nhận và một **vật** được cho — The company gave **the workers** (người) **a bonus** (vật). Vì có hai tân ngữ nên có **hai câu bị động**. Tiếng Anh thường chọn ==người làm chủ ngữ==, vì người là chủ đề tự nhiên của câu.",
      },
      {
        t: "table",
        head: ["Kiểu", "Câu", "Ghi chú"],
        rows: [
          ["Chủ động", "The company gave **the workers** **a bonus**.", "V + người + vật"],
          ["Bị động 1 — người làm chủ ngữ ✅ hay dùng", "**The workers** were given a bonus.", "Vật đứng ngay sau V3, không có giới từ"],
          ["Bị động 2 — vật làm chủ ngữ", "**A bonus** was given **to** the workers.", "Phải có **to** (hoặc **for** với buy / make / find)"],
        ],
      },
      {
        t: "table",
        head: ["Nhóm", "Động từ", "Ví dụ bị động (người làm chủ ngữ)"],
        rows: [
          ["Cho – trao", "give · offer · award · grant · lend · hand", "She **was offered** a job in Singapore. · The school **was awarded** a prize."],
          ["Gửi – trả", "send · pay · owe · bring", "Interns **are paid** very little. · Every customer **was sent** an email."],
          ["Nói – dạy – chỉ", "tell · teach · show · ask · promise", "We **were told** to wait. · Children **are taught** two languages. · I **was asked** three questions."],
        ],
        caption: "Trong Speaking Part 2 (kể chuyện) hãy dùng: I was given… / I was told that… / I was offered… / I was asked to… — bốn câu bị động tự nhiên nhất khi nói.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: explain · suggest · describe · say KHÔNG lấy người làm chủ ngữ",
        items: [
          "Bốn động từ này chỉ có **một** tân ngữ trực tiếp (vật); người phải đi sau **to**: explain something **to** somebody. Vì vậy ~~I was explained the rules~~ là sai.",
          "Đúng: The rules **were explained to** me. · A new plan **was suggested to** the manager. · The process **was described to** the students.",
          "Với **say** ⇒ đổi sang **tell** khi muốn người làm chủ ngữ: ~~I was said that…~~ → I **was told** that…",
          "Bị động 2 không được bỏ **to**: ~~A bonus was given the workers~~ → was given **to** the workers.",
          "Giữ nguyên giới từ của cụm động từ: The children **are looked after** by their grandparents. · The meeting **was put off**. · This issue **has been dealt with**.",
        ],
      },
      { t: "rule", formula: "Người + be + V3 (given / offered / paid / told / taught / shown / sent) + vật", vi: "Động từ hai tân ngữ: ưu tiên lấy NGƯỜI làm chủ ngữ. Vật làm chủ ngữ thì thêm to + người." },
      {
        t: "quiz",
        id: "t3d13-hai-tan-ngu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — động từ hai tân ngữ (4 câu)",
        grammar: "Người + be + V3 + vật",
        items: [
          { q: "Tôi đã được mời làm một công việc ở một công ty phần mềm. (offer)", answers: ["I was offered a job at a software company.", "I was offered a job in a software company.", "I was offered a job with a software company."], hint: "was offered a job" },
          { q: "Thực tập sinh thường được trả lương rất thấp. (pay)", answers: ["Interns are often paid very little.", "Interns are usually paid very little.", "Interns are often paid a very low salary.", "Interns are usually paid a very low salary.", "Interns are often paid very low wages."], hint: "are often paid very little" },
          { q: "Chúng tôi được bảo là phải đợi bên ngoài. (tell)", answers: ["We were told to wait outside.", "We were told that we had to wait outside."], hint: "were told to wait" },
          { q: "Các quy định đã được giải thích cho nhân viên mới. (explain)", answers: ["The rules were explained to the new staff.", "The rules were explained to the new employees.", "The rules were explained to new staff.", "The rules were explained to new employees.", "The regulations were explained to the new staff.", "The regulations were explained to the new employees.", "The rules have been explained to the new staff.", "The rules have been explained to the new employees."], hint: "were explained to (không viết: staff were explained)" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. by + agent — khi nào giữ, khi nào bỏ" },
      {
        t: "p",
        text: "**Agent** = người / vật **làm** hành động, đứng sau **by**. Người học band 5 thường viết by ở mọi câu bị động (by people, by them, by someone). Thật ra ta dùng bị động chính vì người làm **không quan trọng** — nên phần lớn câu bị động **không có by**. Hỏi một câu: “Bỏ cụm by… đi, người đọc có mất thông tin gì không?” Không mất ⇒ bỏ.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Giữ hay bỏ by + agent?",
        cols: [
          {
            title: "BỎ by…",
            items: [
              "Ai cũng biết ai làm: The thief was arrested ~~by the police~~.",
              "Không biết ai làm: My bike was stolen ~~by someone~~.",
              "Người làm chung chung: English is spoken here ~~by people~~.",
              "Quy trình: The beans are roasted ~~by workers~~.",
              "Chính mình (báo cáo): 50 students were interviewed ~~by us~~.",
            ],
          },
          {
            title: "GIỮ by…",
            items: [
              "Người làm là **thông tin mới**: The telephone was invented **by Bell**.",
              "Người làm gây bất ngờ: The report was written **by a 12-year-old**.",
              "So sánh ai làm: 60 % of the work was done **by women**.",
              "Người làm là **vật / nguyên nhân**: The village was destroyed **by a flood**.",
              "Task 1: … is used **by the industrial sector**.",
            ],
          },
        ],
        caption: "Tiếng Anh đặt thông tin mới ở CUỐI câu. Giữ by… khi chính nó là điều bạn muốn nhấn.",
      },
      {
        t: "table",
        head: ["Giới từ", "Dùng cho", "Ví dụ"],
        rows: [
          ["**by**", "Người / lực làm hành động", "The window was broken **by** a boy / **by** the storm."],
          ["**with**", "Dụng cụ, vật liệu mà người làm dùng", "The window was broken **with** a hammer. · The mixture is covered **with** a lid."],
          ["**by + V-ing / by + phương tiện**", "Cách thức", "The water is cleaned **by** passing it through sand. · sent **by** email"],
          ["**in / at / to…** (không phải agent)", "Tính từ gốc V3 có giới từ riêng", "interested **in** · surprised **at** · known **for** · made **of** / **from** · filled **with** · married **to**"],
        ],
        caption: "Nhóm cuối là tính từ + giới từ phụ thuộc (Tập 3 Ngày 9) — đừng tự đổi thành by.",
      },
      {
        t: "note",
        title: "💡 Mẹo: bị động giữ cho đoạn văn một chủ đề (đẩy CC)",
        items: [
          "Chủ động, chủ ngữ nhảy lung tung: **Plastic bags** are cheap. However, **animals** eat them, and **factories** cannot recycle them easily.",
          "Bị động, một chủ đề xuyên suốt: **Plastic bags** are cheap. However, **they** are often eaten by animals and cannot **be recycled** easily.",
          "Quy tắc: câu sau nên **bắt đầu bằng thứ câu trước vừa nói tới**. Nếu thứ đó là tân ngữ của hành động ⇒ dùng bị động để đưa nó lên đầu.",
          "Ngược lại, đừng bị động hoá cả bài. Câu có người làm rõ ràng và quan trọng thì để chủ động: Governments should fund… / Many parents believe… Một bài Task 2 band 6 thường có **3–6 câu bị động**; bài tả quy trình thì gần như câu nào cũng bị động.",
        ],
      },
      { t: "rule", formula: "S + be + V3 (+ by + người làm — CHỈ khi là thông tin mới / cần nhấn)", vi: "by people / by them / by someone ⇒ xoá. with + dụng cụ, by + người hoặc lực." },
      {
        t: "mcq",
        id: "t3d13-by-agent",
        title: "by + agent: giữ, bỏ, hay đổi giới từ? (6 câu)",
        items: [
          { q: "Câu nào viết tự nhiên nhất?", options: ["My phone was stolen by someone on the bus.", "My phone was stolen by a thief on the bus.", "My phone was stolen on the bus.", "My phone stole on the bus."], correct: 2, why: "Không biết ai lấy; “by someone / by a thief” không thêm thông tin ⇒ bỏ. D thiếu be." },
          { q: "Hamlet was written ___ .", options: ["by Shakespeare", "with Shakespeare", "(bỏ trống — không cần agent)", "from Shakespeare"], correct: 0, why: "Người viết chính là thông tin mới và quan trọng ⇒ giữ by Shakespeare." },
          { q: "The lock had been opened ___ a small knife.", options: ["by", "with", "of", "from"], correct: 1, why: "Con dao là DỤNG CỤ (người nào đó dùng nó) ⇒ with." },
          { q: "In the first stage, the olives are picked ___ .", options: ["by them", "by people", "with workers", "by hand"], correct: 3, why: "by hand = bằng tay (cách thức) là thông tin có ích. “by them / by people” thừa; “with workers” sai." },
          { q: "Half of the houses in the town were damaged ___ the earthquake.", options: ["by", "with", "at", "for"], correct: 0, why: "Động đất là lực GÂY ra thiệt hại ⇒ by." },
          { q: "Chọn câu nối mạch tốt nhất sau: “The survey covered 500 students.”", options: ["Researchers from two universities asked the students ten questions.", "Ten questions were asked the students by researchers.", "They were asked ten questions about their sleep.", "Someone asked them ten questions."], correct: 2, why: "Câu trước kết thúc ở students ⇒ câu sau bắt đầu bằng They (students) + bị động: giữ một chủ đề. B sai: với ask, vật làm chủ ngữ phải đi với of (Ten questions were asked of the students — rất trang trọng), và nó đẩy chủ đề sang “questions”. A lại đổi chủ đề sang researchers; D chung chung." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Động từ KHÔNG có bị động — lỗi “was happened”" },
      {
        t: "p",
        text: "Bị động cần một **tân ngữ** để đưa lên đầu. **Nội động từ** (intransitive verb — động từ không có tân ngữ) vì thế **không bao giờ** ở bị động. Người Việt sai nhiều vì tiếng Việt nói “tai nạn **đã xảy ra**”, “giá **đã tăng**” nghe giống có “được / bị”. Đây là lỗi GRA dễ thấy nhất ở Task 1.",
      },
      {
        t: "table",
        head: ["Nhóm nội động từ", "Động từ", "❌ Sai", "✅ Đúng"],
        rows: [
          ["Xảy ra", "happen · occur · take place", "~~The accident was happened~~ in 2019.", "The accident **happened** in 2019."],
          ["Tăng – giảm (tự nó)", "rise · fall · grow · drop · decline · go up", "~~The price was risen~~ to $50.", "The price **rose** to $50."],
          ["Tồn tại – xuất hiện", "exist · appear · disappear · emerge · remain · seem", "~~The lake was disappeared.~~", "The lake **disappeared**."],
          ["Đến – đi – chết", "arrive · come · go · die · live · stay", "~~He was died~~ in 2001.", "He **died** in 2001."],
          ["Gồm – thuộc về", "consist of · belong to · depend on · result from", "~~The team is consisted of~~ five people.", "The team **consists of** five people."],
        ],
      },
      {
        t: "table",
        head: ["Động từ", "Tự nó (không bị động)", "Có người làm (chủ động + O)", "Bị động"],
        rows: [
          ["rise ↔ **raise**", "Taxes **rose** by 5 %.", "The government **raised** taxes.", "Taxes **were raised** by 5 %."],
          ["increase / decrease", "Sales **increased**.", "The firm **increased** prices.", "Prices **were increased**."],
          ["open / close", "The shop **opens** at 9.", "They **opened** a new branch.", "A new branch **was opened**."],
          ["change / develop / improve", "The town **has changed** a lot.", "They **changed** the rules.", "The rules **were changed**."],
          ["die ↔ **kill**", "Ten people **died**.", "The storm **killed** ten people.", "Ten people **were killed**."],
        ],
        caption: "Nhiều động từ dùng được cả hai kiểu. Task 1 biểu đồ: số liệu “tự” tăng giảm ⇒ CHỦ ĐỘNG (rose, fell, increased). Task 1 bản đồ / quy trình: có người làm ⇒ BỊ ĐỘNG (was built, is heated).",
      },
      {
        t: "note",
        title: "⚠️ Lỗi “bị động thừa” người Việt hay viết (và một ngoại lệ)",
        items: [
          "~~The number of cars was increased dramatically.~~ → The number of cars **increased** dramatically. (Biểu đồ không nói ai làm tăng.)",
          "~~A big change was occurred / was taken place.~~ → A big change **occurred / took place**.",
          "~~This problem is existed in many cities.~~ → This problem **exists** in many cities.",
          "Ngoại lệ: I **was born** in 2004 là **đúng** — be born là cụm bị động cố định. Còn ~~I born in 2004~~ sai (thiếu was).",
          "Động từ trạng thái có tân ngữ nhưng vẫn không bị động: have (sở hữu), lack, resemble, suit, fit, cost: ~~A car is had by him~~ ✗ · ~~Experience is lacked by them~~ ✗.",
        ],
      },
      { t: "rule", formula: "Không có O ⇒ không có bị động: happen · occur · rise · fall · exist · appear · die · consist of", vi: "Số liệu tự tăng giảm: rose / fell. Có người làm tăng: raised / was raised." },
      {
        t: "quiz",
        id: "t3d13-khong-bi-dong",
        kind: "fill",
        title: "Chủ động hay bị động? Chia động từ trong ngoặc ở QUÁ KHỨ ĐƠN (8 câu)",
        items: [
          { q: "The number of tourists ___ (rise) sharply in 2019.", answers: ["rose"] },
          { q: "Income tax ___ (raise) to 25 % the following year.", answers: ["was raised"] },
          { q: "The fire ___ (happen) in the middle of the night.", answers: ["happened"] },
          { q: "Three people ___ (kill) in the accident.", answers: ["were killed"] },
          { q: "The old cinema ___ (replace) by a supermarket.", answers: ["was replaced"] },
          { q: "The woodland in the east ___ (disappear) completely.", answers: ["disappeared"] },
          { q: "The first Olympic Games of the modern era ___ (take) place in 1896.", answers: ["took"] },
          { q: "A shopping centre ___ (construct) on the site of the old market.", answers: ["was constructed"] },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Nhập môn: It is believed that… — bị động để thuật lại ý kiến chung" },
      {
        t: "p",
        text: "Trong Task 2 bạn hay cần nói “người ta cho rằng…”. Viết ~~People say that…~~ mãi thì đơn điệu. Cấu trúc bị động với chủ ngữ giả **It** nghe học thuật hơn và không cần nói “người ta” là ai. Hôm nay chỉ học khuôn cơ bản; Tập 4 Ngày 13 sẽ dạy trọn (kể cả dạng S + is said to + V).",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "It + is + V3 (said / believed / thought / argued / estimated / expected) + that + S + V",
            vi: "Người ta nói / tin / cho / lập luận / ước tính / dự kiến rằng…",
            examples: [
              { en: "It is often argued that university education should be free.", vi: "Người ta thường lập luận rằng giáo dục đại học nên miễn phí." },
              { en: "It is estimated that one in three office workers now works from home.", vi: "Ước tính cứ ba nhân viên văn phòng thì một người hiện làm việc tại nhà." },
              { en: "It is widely believed that money cannot buy happiness.", vi: "Nhiều người tin rằng tiền không mua được hạnh phúc." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với It is … that",
        items: [
          "Không bỏ **It**: ~~Is believed that…~~ ✗. Không đổi It thành người: ~~People are believed that…~~ ✗.",
          "Trạng từ đứng giữa is và V3: It is **widely / generally / commonly / often** believed that…",
          "Đây là ý của **người khác**. Ý của bạn thì viết thẳng: I believe that… / In my view,… — đừng giấu ý kiến của mình sau It is believed (đề hỏi ý kiến bạn mà bạn không nêu ⇒ mất điểm TR).",
          "Mỗi bài chỉ nên dùng **1–2 lần** (thường ở mở bài để giới thiệu quan điểm chung).",
        ],
      },
      { t: "rule", formula: "It + is + (widely) + V3 + that + S + V", vi: "Thuật lại ý kiến chung mà không cần chủ ngữ “people”. Dùng ở mở bài Task 2." },
      {
        t: "quiz",
        id: "t3d13-it-is-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — It is … that (3 câu)",
        grammar: "It + is + V3 + that + S + V",
        items: [
          { q: "Người ta thường lập luận rằng trẻ em dành quá nhiều thời gian trên mạng.", answers: ["It is often argued that children spend too much time online.", "It is often argued that children spend too much time on the internet."], hint: "It is often argued that" },
          { q: "Nhiều người tin rằng người trẻ nên sống với bố mẹ. (widely)", answers: ["It is widely believed that young people should live with their parents."], hint: "It is widely believed that" },
          { q: "Ước tính 40 % thực phẩm bị lãng phí.", answers: ["It is estimated that 40% of food is wasted.", "It is estimated that 40 % of food is wasted.", "It is estimated that 40 per cent of food is wasted.", "It is estimated that 40 percent of food is wasted."], hint: "It is estimated that · is wasted" },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Bị động dùng ở đâu trong bài thi IELTS" },
      {
        t: "table",
        head: ["Phần thi", "Mức dùng", "Dạng hay gặp", "Câu mẫu"],
        rows: [
          ["Task 1 — process (quy trình sản xuất)", "Gần như mọi câu", "Hiện tại đơn bị động; after being + V3; once + has been + V3", "Once the clay **has been shaped**, it **is left** to dry."],
          ["Task 1 — map", "Rất nhiều", "Quá khứ đơn / hiện tại hoàn thành / tương lai bị động", "The car park **has been replaced** by a hotel. · A new road **will be built**."],
          ["Task 1 — biểu đồ số liệu", "Ít", "Chủ yếu chủ động (rose, fell); bị động với by / of nhóm người", "Most of the energy **was consumed** by industry."],
          ["Task 2", "3–6 câu / bài", "modal + be + V3; It is argued that; hiện tại hoàn thành bị động", "Stricter rules **should be introduced**."],
          ["Speaking Part 2", "Vài câu", "was built / was given / was told / is located / is known for", "The temple **was built** about 300 years ago."],
          ["Speaking Part 3", "Vài câu", "should be + V3; is seen as; are expected to", "Teachers **should be paid** more, I think."],
          ["Reading / Listening", "Nhận ra", "Câu hỏi đổi chủ động ↔ bị động để paraphrase", "Bài: Farmers abandoned the land. → Câu hỏi: The land **was abandoned**."],
        ],
        caption: "Dòng cuối quan trọng cho bài Đọc hôm nay: đổi chủ động ↔ bị động là một kiểu paraphrase mức 3 (đổi cấu trúc — Tập 3 Ngày 1 · 3).",
      },
      { t: "rule", formula: "Chủ động khi người làm quan trọng · Bị động khi việc được làm / thứ chịu tác động quan trọng hơn", vi: "Không đếm số câu bị động để “ăn điểm”; chọn theo chủ đề của câu." },

      /* ── 10 ── */
      { t: "h", text: "10. Kiểm tra cuối bài (10 câu)" },
      {
        t: "mcq",
        id: "t3d13-np-tong-hop",
        title: "Chọn đáp án đúng (10 câu)",
        items: [
          { q: "A new sports centre ___ in the north of the town at the moment.", options: ["is building", "is being built", "has built", "is been built"], correct: 1, why: "at the moment ⇒ hiện tại tiếp diễn bị động: is being built." },
          { q: "Since 2015, over a thousand jobs ___ in the area.", options: ["have created", "were created", "have been created", "had been created"], correct: 2, why: "Since 2015 ⇒ hiện tại hoàn thành; việc làm ĐƯỢC tạo ra ⇒ have been created." },
          { q: "This kind of waste cannot ___ .", options: ["be recycled", "recycled", "been recycled", "to be recycled"], correct: 0, why: "modal + be + V3." },
          { q: "The unemployment rate ___ to 8 % in 2020.", options: ["was risen", "was rose", "raised", "rose"], correct: 3, why: "rise là nội động từ ⇒ không có bị động; quá khứ: rose. raised cần tân ngữ." },
          { q: "The warning signs ___ years ago, but nobody listened.", options: ["should be noticed", "should have been noticed", "should have noticed", "should been noticed"], correct: 1, why: "Việc đáng lẽ đã phải xảy ra trong quá khứ ⇒ should have been + V3." },
          { q: "Every new employee ___ a laptop on the first day.", options: ["gives", "is gave", "is given", "is given to"], correct: 2, why: "Động từ hai tân ngữ, người làm chủ ngữ: is given + vật, không có to." },
          { q: "By the time the police arrived, the money ___ .", options: ["had been taken", "has been taken", "was being take", "had taken"], correct: 0, why: "Trước một mốc quá khứ ⇒ quá khứ hoàn thành bị động: had been taken." },
          { q: "Nobody enjoys ___ what to do all the time.", options: ["to be told", "telling", "be told", "being told"], correct: 3, why: "enjoy + V-ing; mình là người BỊ bảo ⇒ being told." },
          { q: "The committee ___ of twelve members.", options: ["is consisted", "consists", "is consisting", "was consisted"], correct: 1, why: "consist of không có bị động và không dùng tiếp diễn." },
          { q: "Câu nào NÊN bỏ cụm by…?", options: ["The vaccine was developed by a small team in Germany.", "The bridge was destroyed by a flood.", "Rice is eaten by people all over Asia every day.", "Most of the cooking is done by men in this survey."], correct: 2, why: "“by people” không thêm thông tin ⇒ viết: Rice is eaten all over Asia every day. Ba câu còn lại agent là thông tin chính." },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t3d13-doc",
    kind: "reading",
    title: "Đọc: Multiple choice — một đáp án (ôn) + chọn TWO / THREE",
    goal: "Làm trọn 13 câu trắc nghiệm (4 câu một đáp án + 9 điểm chọn TWO / THREE) trên một bài đọc ~900 từ trong 20 phút: khoanh đúng vùng chứa đáp án, loại phương án theo 5 loại bẫy (bị phủ nhận, không nhắc, sai đối tượng, đúng nhưng không trả lời câu hỏi, quá mạnh) và nhận ra paraphrase đổi chủ động ↔ bị động — mục tiêu ≥ 9/13 (mức Reading band 6).",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "Tập 2 Ngày 10 đã học **trắc nghiệm một đáp án** (chọn A, B, C hoặc D). Hôm nay ôn nhanh rồi học dạng mới: ==Choose TWO letters, A–E== và ==Choose THREE letters, A–G==.",
          "Luật chấm: mỗi chữ cái đúng = **1 điểm**, **thứ tự không quan trọng**. Một câu chọn TWO chiếm **hai số câu** (vd Questions 5–6). Chọn đúng 1 trong 2 vẫn được 1 điểm ⇒ không bao giờ bỏ trống.",
          "Tin tốt: các đáp án của một câu chọn TWO / THREE thường nằm **gần nhau trong 1–2 đoạn**. Việc khó nhất không phải tìm chỗ, mà là **loại 3–4 phương án sai** — hầu hết đều **được nhắc tới** trong bài.",
          "5 loại bẫy: ==bị phủ nhận== · ==không nhắc== · ==sai đối tượng / sai thời== · ==đúng nhưng không trả lời câu hỏi== · ==quá mạnh==.",
          "Nối với bài Ngữ pháp: câu hỏi hay đổi **chủ động ↔ bị động** so với bài đọc (shipowners campaigned against the dues → the dues **were opposed by** shipowners).",
          "Mục tiêu band 6: Reading ≥ 23/40. Dạng trắc nghiệm tốn thời gian nhất ⇒ phải giữ nhịp **1,5 phút / điểm**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 10: trắc nghiệm một đáp án" },
      {
        t: "table",
        head: ["Điều cần nhớ", "Chi tiết"],
        rows: [
          ["Thứ tự", "Câu hỏi đi **theo thứ tự bài đọc**: đáp án câu 2 nằm sau đáp án câu 1."],
          ["Bốn loại câu", "Hỏi **chi tiết** (What / Why / How…) · hỏi **ý chính / mục đích** của đoạn · **suy luận** (What can be inferred / suggested…) · **hoàn thành câu** (The writer mentions X in order to…)."],
          ["Cách làm", "Đọc **thân câu hỏi** trước (chưa đọc A–D) → gạch từ khoá → tìm vùng trong bài → tự trả lời trong đầu → mới so với A–D."],
          ["Phương án đúng", "Luôn là **paraphrase** — gần như không lặp lại từ của bài."],
          ["Phương án sai", "Thường **chép đúng từ** của bài nhưng ghép sai quan hệ (sai người, sai nguyên nhân, sai mức độ)."],
        ],
      },
      { t: "rule", formula: "Thân câu hỏi → vùng trong bài → tự trả lời → so A–D → loại 3", vi: "Phương án giống bài từng chữ thường là bẫy; phương án đúng dùng lời khác." },

      /* ── 2 ── */
      { t: "h", text: "2. Dạng mới: Choose TWO / THREE letters" },
      {
        t: "p",
        text: "Lời dẫn trông như sau: **Questions 5 and 6. Choose TWO letters, A–E. Which TWO difficulties are mentioned in the text?** Bên dưới là một danh sách 5 phương án (chọn TWO) hoặc 7 phương án (chọn THREE). Trên phiếu trả lời, bạn viết **mỗi chữ cái vào một ô** (ô 5: A, ô 6: D — hay ngược lại đều đúng). Thi máy thì tích vào đủ số ô yêu cầu.",
      },
      {
        t: "table",
        head: ["", "Một đáp án (Tập 2 Ngày 10)", "Chọn TWO / THREE (hôm nay)"],
        rows: [
          ["Số phương án", "4 (A–D)", "5 (chọn 2) · 7 (chọn 3)"],
          ["Số điểm", "1 câu = 1 điểm", "1 câu hỏi = 2 hoặc 3 điểm, mỗi chữ 1 điểm"],
          ["Vị trí đáp án", "Một chỗ trong bài", "Thường **cùng 1–2 đoạn**; đôi khi rải cả bài"],
          ["Thứ tự phương án", "Không liên quan", "A–E **không** theo thứ tự xuất hiện trong bài"],
          ["Câu hỏi hay gặp", "What / Why does the writer…?", "Which TWO **reasons / problems / benefits / features**… are mentioned? · Which TWO **claims** does the writer make?"],
          ["Việc chính", "Tìm 1 câu đúng", "**Loại** 3–4 phương án sai, phần lớn đều được nhắc trong bài"],
        ],
      },
      {
        t: "note",
        title: "📌 Hai kiểu câu chọn TWO — nhận ra để biết đọc tới đâu",
        items: [
          "**Kiểu danh sách** (hay gặp nhất): câu hỏi có một danh từ số nhiều — reasons, problems, effects, advantages. Tìm **đoạn liệt kê** những thứ đó; cả hai đáp án ở đấy. Tín hiệu trong bài: firstly, another, a further, also, in addition, as well as.",
          "**Kiểu nhận định**: Which TWO statements are true of X? / Which TWO claims does the writer make about X? — đáp án có thể rải 2–3 đoạn. Tìm mọi chỗ nhắc X rồi kiểm từng phương án.",
          "Câu hỏi ghi **“according to the writer / the passage”** ⇒ chỉ tính điều **bài nói**, không tính điều bạn biết ngoài đời.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Quy trình 6 bước cho một câu chọn TWO / THREE" },
      {
        t: "sodo",
        kind: "flow",
        title: "Chọn TWO / THREE — 6 bước (≈ 3 phút cho 2 điểm)",
        steps: [
          { label: "1. Đọc câu hỏi, khoanh DANH TỪ SỐ NHIỀU", sub: "Which TWO ==difficulties== faced by ==lighthouse builders==…? → cần: khó khăn · của người xây (không phải của thuỷ thủ)" },
          { label: "2. Tìm vùng", sub: "Dựa vào câu hỏi trước / sau (đề đi theo thứ tự) + từ báo liệt kê" },
          { label: "3. Đọc kỹ CẢ vùng một lượt", sub: "Đánh dấu từng thứ được liệt kê: ①, ②, ③…" },
          { label: "4. Đem từng phương án A–E so với ①②③", sub: "Khớp ý (paraphrase) ⇒ ✓ · bị phủ nhận / không có ⇒ ✗" },
          { label: "5. Đếm lại", sub: "Phải còn ĐÚNG hai (ba) phương án ✓. Thừa ⇒ soát lại bẫy mục 4" },
          { label: "6. Ghi đáp án, đi tiếp", sub: "Chưa chắc chữ thứ hai ⇒ vẫn ghi một chữ + đoán chữ còn lại" },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: bài liệt kê BA thứ nhưng đề chỉ hỏi HAI",
        items: [
          "Rất thường gặp: đoạn văn nêu 3–4 trở ngại, nhưng trong A–E chỉ có **hai** cái được diễn đạt đúng. Những cái còn lại hoặc không có trong danh sách, hoặc bị viết **sai đi một chi tiết**.",
          "Vì thế đừng dừng ở phương án đầu tiên “nghe quen”. Kiểm **cả năm**.",
          "Nếu thấy **ba** phương án có vẻ đúng: một trong ba chắc chắn dính bẫy “sai đối tượng” hoặc “quá mạnh”. So lại **từng từ** chỉ người / thời gian / mức độ (all, only, most, never).",
        ],
      },
      { t: "rule", formula: "Danh từ số nhiều trong câu hỏi → đoạn liệt kê → đánh số ①②③ → so từng phương án → còn đúng 2 (3)", vi: "Chọn TWO là bài tập LOẠI: kiểm cả năm phương án, không dừng ở cái đầu tiên nghe quen." },

      /* ── 4 ── */
      { t: "h", text: "4. Năm loại bẫy của phương án sai" },
      {
        t: "p",
        text: "Lấy câu trong bài làm ví dụ: **“Users praise the low price, but many complain that the bikes are heavy. The scheme has reduced crowding on buses, although it has had no effect on car traffic.”** — Câu hỏi: **Which TWO problems do users report?**",
      },
      {
        t: "table",
        head: ["Bẫy", "Phương án sai", "Vì sao sai", "Dấu hiệu trong bài"],
        rows: [
          ["① Bị phủ nhận / nói ngược", "The bikes are expensive to hire.", "Bài: users **praise the low price**", "no · not · little · by contrast · in fact · rather than"],
          ["② Không nhắc", "There are too few bikes in the suburbs.", "Bài không nói gì về ngoại ô", "Tìm cả vùng không thấy ⇒ loại, đừng suy diễn"],
          ["③ Sai đối tượng / sai thời", "Car traffic has become worse.", "Bài nói về car traffic nhưng: **no effect**, và không phải điều users phàn nàn", "Ai nói? Về ai? Lúc nào? (officials ≠ users; at first ≠ now)"],
          ["④ Đúng nhưng không trả lời câu hỏi", "Buses are less crowded.", "Đúng theo bài — nhưng đó là **lợi ích**, câu hỏi hỏi **problems**", "Đọc lại danh từ số nhiều của câu hỏi"],
          ["⑤ Quá mạnh", "All users find the bikes too heavy.", "Bài: **many** complain — không phải all", "all · every · always · never · only · the main"],
        ],
        caption: "Bẫy ④ là bẫy riêng của dạng chọn TWO: phương án ĐÚNG với bài nhưng không thuộc loại câu hỏi đang hỏi.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở dạng chọn TWO / THREE",
        items: [
          "Thấy **từ trùng** giữa phương án và bài là chọn ngay. Từ trùng chỉ cho biết **chỗ cần đọc**, chưa cho biết đúng – sai.",
          "Chọn theo **kiến thức ngoài đời** (“có đèn thì tàu chắc chạy nhanh hơn”) trong khi bài nói ngược lại.",
          "Viết **hai chữ vào một ô** trên phiếu giấy (ô 5: “A, D”) ⇒ ô 6 trống, mất 1 điểm. Mỗi ô **một chữ**.",
          "Viết **ba** chữ cho câu chọn TWO “cho chắc” ⇒ câu đó 0 điểm.",
          "Dành 6–7 phút cho một câu 2 điểm. Quá 3 phút ⇒ ghi phương án chắc nhất, đoán cái còn lại, đánh dấu để quay lại nếu còn giờ.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Khởi động — phân loại 5 phương án" },
      {
        t: "passage",
        title: "A city bike scheme",
        intro: "Đọc đoạn ngắn rồi xét từng phương án A–E của câu hỏi: “Which TWO problems do users of the scheme report?”",
        paras: [
          { text: "When the city introduced its bicycle-sharing scheme, officials expected it to appeal mainly to tourists. In fact, most journeys are made by local office workers, who use the bikes for the last kilometre between the station and their desks. The scheme has clearly reduced crowding on buses at peak times, although it has had no measurable effect on car traffic. Users praise the low price, but many complain that the bikes are heavy and that the docking stations in the centre are often full by nine o'clock, so there is nowhere to leave a bike." },
        ],
      },
      {
        t: "table",
        head: ["", "Which TWO problems do users of the scheme report?"],
        rows: [
          ["**A**", "Hiring a bike costs too much."],
          ["**B**", "The bikes are difficult to ride because of their weight."],
          ["**C**", "There are not enough docking stations in the suburbs."],
          ["**D**", "It can be hard to return a bike in the city centre in the morning."],
          ["**E**", "Buses have become more crowded."],
        ],
      },
      {
        t: "mcq",
        id: "t3d13-doc-khoi-dong",
        title: "Mỗi phương án thuộc loại nào? (5 câu)",
        items: [
          { q: "Phương án A — Hiring a bike costs too much.", options: ["Đúng — chọn", "Sai — bị phủ nhận (nói ngược)", "Sai — không nhắc", "Sai — quá mạnh"], correct: 1, why: "Bài: Users praise the low price ⇒ giá rẻ, ngược với A." },
          { q: "Phương án B — The bikes are difficult to ride because of their weight.", options: ["Đúng — chọn", "Sai — bị phủ nhận", "Sai — không nhắc", "Sai — sai đối tượng"], correct: 0, why: "many complain that the bikes are heavy ⇒ heavy = their weight. Đúng, và là điều users phàn nàn." },
          { q: "Phương án C — There are not enough docking stations in the suburbs.", options: ["Đúng — chọn", "Sai — bị phủ nhận", "Sai — không nhắc", "Sai — đúng nhưng không trả lời câu hỏi"], correct: 2, why: "Bài chỉ nói trạm ở TRUNG TÂM hay đầy; không có câu nào về ngoại ô ⇒ không nhắc." },
          { q: "Phương án D — It can be hard to return a bike in the city centre in the morning.", options: ["Sai — quá mạnh", "Sai — sai thời", "Sai — không nhắc", "Đúng — chọn"], correct: 3, why: "docking stations in the centre are often full by nine o'clock, so there is nowhere to leave a bike ⇒ khó trả xe ở trung tâm buổi sáng. “can be hard” khớp với “often”." },
          { q: "Phương án E — Buses have become more crowded.", options: ["Đúng — chọn", "Sai — không nhắc", "Sai — bị phủ nhận (nói ngược)", "Sai — quá mạnh"], correct: 2, why: "Bài: reduced crowding on buses ⇒ xe buýt BỚT đông. Ngược hẳn (và cũng không phải vấn đề của người dùng xe đạp)." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Luyện trọn bài — Questions 1–13 (20 phút)" },
      {
        t: "p",
        text: "Bấm giờ **20 phút**. 2 phút đầu: đọc tiêu đề + câu đầu mỗi đoạn để biết đoạn nào nói gì (Tập 3 Ngày 1). Rồi làm lần lượt: Questions 1–4 (một đáp án) → 5–6 → 7–8 → 9–11 → 12–13. Các câu đi **theo thứ tự bài đọc**. Chưa xem phần giải thích cho tới khi làm xong cả 13 câu.",
      },
      {
        t: "passage",
        title: "Lights on the Rocks: A Short History of the Lighthouse",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "For as long as people have sailed, the most dangerous part of a voyage has been its end: it is close to land, where rocks and sandbanks lie hidden, that most vessels have been lost. The first warning lights were simply fires lit on hilltops; even the famous Pharos of Alexandria, said to have stood over a hundred metres high, was essentially a fire on a tower. An open fire of wood or coal burned enormous quantities of fuel, gave only a dim, flickering glow, and could be put out altogether by heavy rain or a strong wind — on exactly the nights when it was needed most. Sailors learnt to trust their own knowledge of the coast rather than the lights upon it." },
          { label: "B", text: "Building on a rock far out at sea was even harder, as the Eddystone reef, off the south-west coast of England, shows. The first tower there, made largely of timber, was completed in 1698 and swept away by a great storm five years later. A second wooden tower was destroyed by fire. The engineer given the task of replacing it, John Smeaton, is usually credited with the breakthrough that made rock lighthouses possible. He reasoned that a tower should be shaped like the trunk of an oak tree, wide at the base and narrowing towards the top, and, more importantly, that its heavy stone blocks should be cut so that each one locked into its neighbours and into the rock itself. The tower would then behave not as a pile of stones but as a single solid mass. Completed in 1759, it survived the sea for more than a century." },
          { label: "C", text: "As lighthouses spread over the following century, progress was rarely smooth. A tower on a remote reef was enormously expensive, and the money was usually raised through ‘light dues’, a fee charged to passing ships. Shipowners complained bitterly that these dues were too high and for decades campaigned to have them reduced. Construction was painfully slow: every stone had to be shaped on land before being brought out by boat, and on an exposed rock work could only be carried out at low tide on calm summer days. Finding keepers was a further problem, since few men were willing to spend weeks on a rock with two or three companions. Sailors, by contrast, welcomed every new light, and the authorities, far from standing in the way, usually supported new projects." },
          { label: "D", text: "Meanwhile, the light itself was transformed. In the 1780s far brighter oil lamps appeared, and curved mirrors were placed behind them to throw the light out to sea. The greatest advance came in 1822, when the French physicist Augustin Fresnel designed a lens made of rings of glass prisms, which bent the light into a narrow horizontal beam visible far out at sea. During the same period, each lighthouse was given its own ‘character’ — for example, two flashes every ten seconds — which was printed on sea charts, so a sailor who counted the flashes could tell exactly which stretch of coast lay ahead. The flashes were usually produced by turning the whole lens with clockwork, long before electric lamps came into general use." },
          { label: "E", text: "In the twentieth century the keeper's job itself began to disappear. From the 1960s onwards, lights were gradually automated: lamps were switched on and off by sensors, and any fault was reported by radio to a control centre on land, often hundreds of kilometres away. Repairs are now carried out by teams of technicians who arrive by boat or helicopter. In Britain the last keepers left their posts in 1998, and a profession that had existed for centuries has almost vanished. The lights themselves, however, did not go out. The keepers' cottages stood empty for a time, but many have since been sold and turned into holiday homes, cafés and small museums." },
          { label: "F", text: "The effects of a well-lit coast went far beyond the safety of individual ships. Although vessels were no faster than before, captains no longer had to wait offshore for daylight: a voyage could continue through the night. Insurers, who had charged high fees for ships sailing along unlit coasts, were able to lower their prices. Not everyone gained, however. For some coastal villages, whose people had long gathered whatever was washed ashore from wrecks, the lights meant the loss of a welcome extra income. The number of ships wrecked off Britain's coasts did fall steadily during the nineteenth century, but historians still disagree about how much of this should be credited to lighthouses, since better charts, steam engines and storm warnings were introduced during the same period and their effects are difficult to separate." },
          { label: "G", text: "Today ships find their way by satellite, and some people argue that lighthouses are no longer needed; in several countries, lights that ships rarely use have been switched off. The towers that remain face problems of their own. Salt, wind and spray attack stone and metal constantly, so the buildings have to be repaired and repainted far more often than structures on land, at considerable cost. On soft coasts, the cliffs on which some lighthouses stand are being worn away by the sea, and some towers have had to be moved back from the edge. Fire, which destroyed more than one early tower, is now almost unknown, and lighthouses still attract large numbers of visitors, for whom they remain a symbol of safety at sea." },
        ],
      },
      { t: "p", text: "**Questions 1–4.** Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq",
        id: "t3d13-doc-mot",
        title: "Questions 1–4 — Choose the correct letter, A, B, C or D",
        items: [
          {
            q: "1. According to paragraph A, what was the main weakness of early coastal lights?",
            options: [
              "They were placed too far from the most dangerous parts of the coast.",
              "There were too few people trained to keep them burning.",
              "Their light was weak and could fail when the weather was bad.",
              "Sailors were forbidden to depend on them.",
            ],
            correct: 2,
            why: "Đoạn A: gave only a **dim, flickering glow**, and **could be put out altogether by heavy rain or a strong wind** ⇒ ánh sáng yếu, tắt khi thời tiết xấu (dim = weak; be put out = fail). A, B: không nhắc. D sai chi tiết: bài nói thuỷ thủ **tự chọn** tin vào hiểu biết của mình (learnt to trust their own knowledge), không phải bị cấm.",
          },
          {
            q: "2. What was Smeaton's most important idea?",
            options: [
              "to join the stones so firmly that the tower acted as one piece",
              "to give the tower the shape of a tree trunk",
              "to finish the tower more quickly than earlier builders",
              "to place the light higher than on earlier towers",
            ],
            correct: 0,
            why: "Đoạn B: **more importantly**, … its heavy stone blocks should be cut so that each one **locked into its neighbours** … The tower would then behave … **as a single solid mass** ⇒ A (single solid mass = one piece). B có trong bài nhưng là ý ĐẦU, đứng trước “more importantly” — bẫy “đúng nhưng không phải điều được hỏi”. C, D: không nhắc.",
          },
          {
            q: "3. What does the writer say about the ‘character’ given to each lighthouse?",
            options: [
              "It was invented by Fresnel together with his lens.",
              "It allowed sailors to work out which lighthouse they could see.",
              "It could only be produced once electricity was available.",
              "It had to be changed whenever a new lamp was fitted.",
            ],
            correct: 1,
            why: "Đoạn D: … so a sailor who counted the flashes could **tell exactly which stretch of coast lay ahead** ⇒ biết mình đang nhìn đèn nào (tell = work out). A sai đối tượng: Fresnel làm ra **thấu kính**; ‘character’ chỉ xuất hiện “during the same period”. C bị phủ nhận: flashes were produced by … clockwork, **long before** electric lamps came into general use. D không nhắc.",
          },
          {
            q: "4. What point does the writer make about historians in paragraph F?",
            options: [
              "They agree that lighthouses were the main reason for the fall in shipwrecks.",
              "They believe that steam engines did more for safety than lighthouses.",
              "They have shown that lighthouses had little effect on the number of wrecks.",
              "They find it hard to measure how much lighthouses reduced shipwrecks.",
            ],
            correct: 3,
            why: "Đoạn F: historians **still disagree** about how much of this **should be credited to** lighthouses … their effects are **difficult to separate** ⇒ khó đo phần đóng góp của hải đăng. A sai vì “still disagree”; B, C: bài không kết luận như vậy (steam engines chỉ là một trong ba yếu tố cùng thời).",
          },
        ],
      },
      { t: "p", text: "**Questions 5 and 6.** Choose **TWO** letters, **A–E**. **Which TWO difficulties faced by lighthouse builders are mentioned in paragraph C?** — Gõ hai chữ cái vào ô (vd **A C**), thứ tự nào cũng được." },
      {
        t: "table",
        head: ["", "Difficulty"],
        rows: [
          ["**A**", "resistance from the owners of ships to the charges they had to pay"],
          ["**B**", "a shortage of stone suitable for building towers"],
          ["**C**", "a lack of interest among sailors"],
          ["**D**", "the short periods when building work at sea was possible"],
          ["**E**", "laws passed by governments to limit construction"],
        ],
      },
      {
        t: "quiz",
        id: "t3d13-doc-hai-1",
        kind: "fill",
        title: "Questions 5–6 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(5–6) Two difficulties: ___", answers: ["A D", "AD", "A and D", "A & D", "A/D", "A + D", "A-D", "D A", "DA", "D and A", "D & A", "D/A", "D + A", "D-A"] }],
      },
      { t: "p", text: "**Questions 7 and 8.** Choose **TWO** letters, **A–E**. **Which TWO changes brought about by automation does the writer describe in paragraph E?**" },
      {
        t: "table",
        head: ["", "Change"],
        rows: [
          ["**A**", "Many lights were switched off for good."],
          ["**B**", "Lighthouses came to be supervised from far away."],
          ["**C**", "Keepers were retrained to repair the new equipment."],
          ["**D**", "The keepers' homes were permanently abandoned."],
          ["**E**", "Far fewer people were employed at lighthouses."],
        ],
      },
      {
        t: "quiz",
        id: "t3d13-doc-hai-2",
        kind: "fill",
        title: "Questions 7–8 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(7–8) Two changes: ___", answers: ["B E", "BE", "B and E", "B & E", "B/E", "B + E", "B-E", "E B", "EB", "E and B", "E & B", "E/B", "E + B", "E-B"] }],
      },
      { t: "p", text: "**Questions 9–11.** Choose **THREE** letters, **A–G**. **Which THREE results of a well-lit coast are mentioned in paragraph F?** — Gõ ba chữ cái (vd **A B C**), thứ tự nào cũng được." },
      {
        t: "table",
        head: ["", "Result"],
        rows: [
          ["**A**", "Ships were able to travel at higher speeds."],
          ["**B**", "It became cheaper to insure ships."],
          ["**C**", "Sailors received better pay."],
          ["**D**", "Ships could continue their journeys after dark."],
          ["**E**", "New ports were built on empty stretches of coast."],
          ["**F**", "Some coastal communities lost a source of income."],
          ["**G**", "Shipwrecks stopped happening altogether."],
        ],
      },
      {
        t: "quiz",
        id: "t3d13-doc-ba",
        kind: "fill",
        title: "Questions 9–11 — Choose THREE letters, A–G (gõ ba chữ cái)",
        items: [{ q: "(9–11) Three results: ___", answers: ["B D F", "BDF", "B D and F", "B and D and F", "B & D & F", "B/D/F", "B + D + F", "B-D-F", "B F D", "BFD", "B F and D", "B and F and D", "B & F & D", "B/F/D", "B + F + D", "B-F-D", "D B F", "DBF", "D B and F", "D and B and F", "D & B & F", "D/B/F", "D + B + F", "D-B-F", "D F B", "DFB", "D F and B", "D and F and B", "D & F & B", "D/F/B", "D + F + B", "D-F-B", "F B D", "FBD", "F B and D", "F and B and D", "F & B & D", "F/B/D", "F + B + D", "F-B-D", "F D B", "FDB", "F D and B", "F and D and B", "F & D & B", "F/D/B", "F + D + B", "F-D-B"] }],
      },
      { t: "p", text: "**Questions 12 and 13.** Choose **TWO** letters, **A–E**. **Which TWO present-day problems facing lighthouses are mentioned in paragraph G?**" },
      {
        t: "table",
        head: ["", "Problem"],
        rows: [
          ["**A**", "Few people are interested in visiting them."],
          ["**B**", "Some are threatened by the erosion of the coast."],
          ["**C**", "Fire is still a serious danger to the towers."],
          ["**D**", "There are not enough trained staff to operate them."],
          ["**E**", "Keeping the buildings in good condition is expensive."],
        ],
      },
      {
        t: "quiz",
        id: "t3d13-doc-hai-3",
        kind: "fill",
        title: "Questions 12–13 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(12–13) Two problems: ___", answers: ["B E", "BE", "B and E", "B & E", "B/E", "B + E", "B-E", "E B", "EB", "E and B", "E & B", "E/B", "E + B", "E-B"] }],
      },
      {
        t: "note",
        title: "Giải thích 5–6 (đáp án A, D) — đoạn C nêu BỐN khó khăn, đề chỉ đưa hai",
        items: [
          "**A ✓** — **Shipowners complained bitterly** that these dues were too high … **campaigned** to have them reduced ⇒ **resistance** from the owners of ships to the **charges** (động từ complained / campaigned → danh từ resistance: paraphrase đổi loại từ; dues = charges).",
          "**D ✓** — work **could only be carried out** at low tide **on calm summer days** ⇒ the **short periods** when building work at sea **was possible** (bị động could only be carried out → was possible).",
          "**B ✗ không nhắc** — bài có stone blocks (đoạn B) và every stone had to be shaped (đoạn C) nhưng không hề nói thiếu đá.",
          "**C ✗ bị phủ nhận** — Sailors, **by contrast**, **welcomed** every new light.",
          "**E ✗ bị phủ nhận** — the authorities, **far from standing in the way**, usually **supported** new projects.",
          "Hai khó khăn còn lại (tháp trên đá ngầm **rất đắt** · **khó tìm người gác**) có trong bài nhưng **không có** trong A–E — đúng như mẹo ở mục 3.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 7–8 (đáp án B, E)",
        items: [
          "**B ✓** — any fault **was reported by radio to a control centre on land, often hundreds of kilometres away** ⇒ supervised **from far away**.",
          "**E ✓** — the last keepers **left their posts** … a profession … **has almost vanished** ⇒ far fewer people were employed (đổi chủ ngữ: keepers left → fewer people were employed — chủ động → bị động).",
          "**A ✗ bị phủ nhận** — The lights themselves, however, **did not go out**.",
          "**C ✗ sai đối tượng** — việc sửa chữa do **technicians** (thợ kỹ thuật) đến bằng thuyền / trực thăng làm, không phải người gác được đào tạo lại.",
          "**D ✗ quá mạnh / sai thời** — nhà người gác **stood empty for a time**, nhưng **many have since been sold** và thành nhà nghỉ, quán cà phê, bảo tàng; chữ permanently làm phương án sai.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 9–11 (đáp án B, D, F)",
        items: [
          "**B ✓** — **Insurers** … **were able to lower their prices** ⇒ it became cheaper to insure ships.",
          "**D ✓** — captains **no longer had to wait offshore for daylight** … a voyage **could continue through the night** ⇒ continue their journeys after dark (through the night = after dark).",
          "**F ✓** — For some coastal villages … the new lights meant **the loss of a welcome extra income** ⇒ some coastal communities **lost a source of income** (danh từ the loss of → động từ lost).",
          "**A ✗ bị phủ nhận** — vessels were **no faster than before**. Đây là bẫy kiến thức ngoài đời: đi được ban đêm không có nghĩa là tàu chạy nhanh hơn.",
          "**C ✗ không nhắc** (bài không nói lương thuỷ thủ) · **E ✗ không nhắc** (bài không nói cảng mới) · **G ✗ quá mạnh** — số tàu đắm chỉ **fell steadily** (giảm dần), không phải hết hẳn.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 12–13 (đáp án B, E)",
        items: [
          "**B ✓** — the cliffs on which some lighthouses stand **are being worn away by the sea**, and some towers **have had to be moved back** ⇒ threatened by the **erosion** of the coast (cụm động từ bị động are being worn away → danh từ erosion — đúng từ của bài Nghe hôm nay).",
          "**E ✓** — the buildings **have to be repaired and repainted** far more often … **at considerable cost** ⇒ keeping the buildings in good condition is expensive.",
          "**A ✗ bị phủ nhận** — lighthouses **attract large numbers of visitors**.",
          "**C ✗ bị phủ nhận / sai thời** — Fire, which destroyed more than one **early** tower, **is now almost unknown**. Cháy là chuyện của đoạn B (ngày xưa).",
          "**D ✗ không nhắc.** Vấn đề thứ ba trong bài (có người cho rằng không cần hải đăng nữa vì đã có định vị vệ tinh, một số đèn đã bị tắt) không nằm trong A–E.",
        ],
      },
      {
        t: "table",
        head: ["Số câu đúng / 13", "Mức", "Việc cần làm"],
        rows: [
          ["11–13", "Trên band 6 ở dạng này", "Luyện tốc độ: lần sau đặt 17 phút."],
          ["9–10", "Đạt mục tiêu band 6", "Xem lại câu sai thuộc bẫy nào trong 5 bẫy; ghi vào Sổ lỗi."],
          ["6–8", "Band 5–5.5", "Làm lại mục 4 + 5; khi làm đề, viết ①②③ lên vùng liệt kê trước khi nhìn A–E."],
          ["0–5", "Chưa vững", "Ôn Tập 2 Ngày 10 (trắc nghiệm một đáp án) và Tập 3 Ngày 3 (paraphrase) rồi làm lại bài này sau 3 ngày."],
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Soi lại bài đọc: bị động trong văn bản thật" },
      {
        t: "p",
        text: "Bài “Lights on the Rocks” có gần **30 động từ bị động** (chưa kể dạng rút gọn như fires **lit** on hilltops, a fee **charged** to passing ships — Ngày 17 sẽ học) — vì chủ đề là ngọn đèn, toà tháp, con tàu (những thứ **chịu** hành động), còn ai xây, ai thắp thì phần lớn không quan trọng. Hãy điền lại dạng bị động vào các câu rút từ bài (không nhìn lại bài). Đây cũng là cách luyện mắt để nhận ra paraphrase chủ động ↔ bị động trong câu hỏi.",
      },
      {
        t: "quiz",
        id: "t3d13-doc-bi-dong",
        kind: "fill",
        title: "Điền dạng bị động của động từ trong ngoặc — câu lấy từ bài đọc (7 câu)",
        items: [
          { q: "The first tower on the reef ___ (sweep) away by a great storm five years later.", answers: ["was swept"] },
          { q: "Every stone had to be shaped on land before ___ (bring) out by boat.", answers: ["being brought"] },
          { q: "On an exposed rock, work could only ___ (carry) out at low tide on calm summer days.", answers: ["be carried"] },
          { q: "Each lighthouse ___ (give) its own ‘character’, which was printed on sea charts.", answers: ["was given"] },
          { q: "Many of the keepers' cottages have since ___ (sell) and turned into holiday homes.", answers: ["been sold"] },
          { q: "The cliffs on which some lighthouses stand ___ (wear) away by the sea. (hiện tại tiếp diễn)", answers: ["are being worn"] },
          { q: "Historians disagree about how much of this should ___ (credit) to lighthouses.", answers: ["be credited"] },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "vessel", pos: "n", ipa: "/ˈvesl/", vi: "tàu thuyền (trang trọng)", ex: "Most vessels have been lost close to land, not out at sea.", exVi: "Phần lớn tàu thuyền bị đắm ở gần bờ, không phải ngoài khơi.", more: "a fishing / cargo **vessel** · từ đồng nghĩa hay dùng để paraphrase **ship**" },
          { w: "reef", pos: "n", ipa: "/riːf/", vi: "rạn đá / rạn san hô ngầm", ex: "The first tower on the reef was swept away by a storm.", exVi: "Toà tháp đầu tiên trên rạn đá bị một cơn bão cuốn đi.", more: "a coral **reef** · run onto a **reef** · **off** the coast (ngoài khơi)" },
          { w: "breakthrough", pos: "n", ipa: "/ˈbreɪkθruː/", vi: "bước đột phá", ex: "Smeaton is credited with the breakthrough that made rock lighthouses possible.", exVi: "Smeaton được ghi nhận là người tạo ra bước đột phá giúp xây được hải đăng trên đá ngầm.", more: "make / achieve a **breakthrough** · a **breakthrough in** + lĩnh vực" },
          { w: "obstacle", pos: "n", ipa: "/ˈɒbstəkl/", vi: "trở ngại", ex: "Bad weather was the main obstacle to building on the reef.", exVi: "Thời tiết xấu là trở ngại chính cho việc xây trên rạn đá.", more: "an **obstacle to** + N / V-ing · overcome an **obstacle** · = barrier, difficulty" },
          { w: "beam", pos: "n", ipa: "/biːm/", vi: "chùm tia sáng", ex: "The lens bent the light into a narrow horizontal beam.", exVi: "Thấu kính bẻ ánh sáng thành một chùm tia hẹp nằm ngang.", more: "a **beam of** light · a laser **beam** · (cũng nghĩa là xà nhà: a wooden beam)" },
          { w: "automate", pos: "v", ipa: "/ˈɔːtəmeɪt/", vi: "tự động hoá", ex: "Lights were gradually automated from the 1960s onwards.", exVi: "Từ thập niên 1960 trở đi, các ngọn đèn dần được tự động hoá.", more: "automation (n) /ˌɔːtəˈmeɪʃn/ · automated (adj) · fully **automated**" },
          { w: "maintenance", pos: "n", ipa: "/ˈmeɪntənəns/", vi: "việc bảo trì, bảo dưỡng", ex: "The maintenance of buildings by the sea is very expensive.", exVi: "Việc bảo trì các công trình ven biển rất tốn kém.", more: "maintain (v) /meɪnˈteɪn/ — chính tả đổi: maintain → **mainten**ance · carry out **maintenance** · **maintenance** costs" },
          { w: "credit", pos: "v, n", ipa: "/ˈkredɪt/", vi: "ghi nhận công lao cho; công trạng", ex: "Smeaton is usually credited with the breakthrough.", exVi: "Smeaton thường được ghi nhận là người tạo ra bước đột phá.", more: "be **credited with** + N / V-ing · **credit** sth **to** sb (…should be credited to lighthouses) · give sb **credit for** sth" },
        ],
      },
      {
        t: "note",
        title: "💡 Nhìn lại cả bài — rút kinh nghiệm",
        items: [
          "Cả bốn câu chọn TWO / THREE đều ghi rõ **đoạn** (paragraph C, E, F, G). Đề thật không phải lúc nào cũng ghi, nhưng vì câu hỏi đi theo thứ tự nên bạn vẫn khoanh được vùng.",
          "Trong 13 phương án sai của bốn câu chọn TWO / THREE: **6 bị phủ nhận / nói ngược**, **4 không nhắc**, **2 quá mạnh**, **1 sai đối tượng**. Bẫy “bị phủ nhận” là nhiều nhất ⇒ luôn tìm từ phủ định và từ đổi hướng (by contrast, far from, however, no faster, once… now).",
          "Ba lần đáp án đúng là paraphrase **đổi cấu trúc / loại từ**: complained / campaigned → resistance; the loss of an income → lost a source of income; are being worn away → erosion.",
          "Ghi vào Sổ lỗi theo mẫu: **Câu … — tôi chọn … — đúng là … — bẫy loại … — từ trong bài tôi đọc sót: …**",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t3d13-nghe",
    kind: "listening",
    title: "Nghe Part 4: Note completion — bài giảng 5 phút, không nghỉ giữa bài",
    goal: "Nghe một bài giảng học thuật dài khoảng 5 phút (một người nói, không có quãng nghỉ) và điền đúng ≥ 7/10 chỗ trống trong bảng ghi chú: dùng tiêu đề con làm bản đồ, bám từ chỉ đường của giảng viên (Let's turn to…, The drawback is…), không viết thứ vừa được nhắc rồi bị gạt đi — và đọc đúng /ʃ/ – /ʒ/ trong các từ đuôi -tion / -sion.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "**Part 4** = phần cuối và khó nhất của Listening: **một người** giảng bài học thuật, **10 câu liền**, ==không có quãng nghỉ ở giữa== (Part 1–3 đều có). Tập 2 Ngày 19 đã làm một bài giảng ~4 phút (Rabbits in Australia, ~640 từ) với ghi chú điền ONE WORD; hôm nay là bài **5 phút**, nhịp tự nhiên, nhiều bẫy “nhắc rồi gạt” hơn.",
          "Dạng câu hỏi hay gặp nhất của Part 4: **Note completion** — một trang ghi chú có tiêu đề con và gạch đầu dòng, mỗi chỗ trống thường **ONE WORD ONLY**.",
          "Ba vũ khí: ==tiêu đề con== trong ghi chú (bản đồ) · ==từ chỉ đường== của giảng viên (signposting: First, Let's turn to, To sum up) · ==đoán loại từ== trước khi nghe.",
          "Bẫy band 6 của Part 4: giảng viên nhắc một thứ rồi **gạt đi** — You might assume it's X, **but** in fact… / Traditionally X, **although** now Y. Đáp án là thứ **khớp với dòng ghi chú**, không phải thứ nghe thấy đầu tiên.",
          "Ghi chú viết bằng **danh từ và câu bị động** (sand is trapped…), giảng viên nói bằng **câu đầy đủ** — bài Ngữ pháp hôm nay giúp bạn nối hai cách nói đó.",
          "Mục tiêu band 6: Listening ≥ 23/40 ⇒ Part 4 cần **6–7/10**. Phát âm hôm nay: /ʃ/ và /ʒ/ trong -tion / -sion.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Part 4 ở band 6 — khác gì bài Tập 2 Ngày 19" },
      {
        t: "table",
        head: ["", "Tập 2 Ngày 19 (nhập môn)", "Hôm nay (mức thi thật)"],
        rows: [
          ["Độ dài", "~4 phút, ~640 từ", "~5 phút, ~750–800 từ"],
          ["Tốc độ", "Vừa phải, rõ ràng", "Tự nhiên, ~150 từ / phút"],
          ["Bố cục", "Một mạch, ít chặng, mỗi chặng 1–2 chỗ trống", "Một mạch **4 chặng** có tiêu đề con — đọc trước cả 10 câu, theo dõi đang ở chặng nào"],
          ["Từ vựng", "Chủ đề quen", "Học thuật: thuật ngữ được **định nghĩa ngay** trong bài (that is…, in other words…)"],
          ["Bẫy", "Chủ yếu giới hạn số từ, số ít / số nhiều", "Paraphrase + nhắc rồi gạt đi (5/10 câu)"],
          ["Yêu cầu", "ONE WORD ONLY · NO MORE THAN TWO WORDS (AND/OR A NUMBER)", "ONE WORD ONLY hoặc ONE WORD AND/OR A NUMBER — đọc kỹ lời dẫn"],
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao Part 4 khó — và vì sao vẫn lấy được 7/10",
        items: [
          "Khó: không có người thứ hai hỏi lại, không có khoảng dừng để đọc tiếp câu hỏi, lỡ một câu là dễ lỡ luôn câu sau.",
          "Dễ hơn bạn nghĩ: bài giảng **có cấu trúc rất rõ** (giới thiệu → từng phần → tổng kết), và trang ghi chú **in sẵn cấu trúc đó**. Bạn không cần hiểu 100 % — chỉ cần biết giảng viên **đang ở dòng nào**.",
          "Thuật ngữ lạ (groyne, managed retreat…) bạn **không cần biết trước**: giảng viên luôn giải thích, và đáp án hầu như là **từ thông thường** (beach, wood, tourists).",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Trước khi nghe: 45 giây đọc trang ghi chú" },
      {
        t: "sodo",
        kind: "flow",
        title: "45 giây trước khi băng chạy",
        steps: [
          { label: "1. Đọc tiêu đề + các tiêu đề con (5 giây)", sub: "Causes → Hard engineering → Soft engineering → Managed retreat = 4 chặng của bài giảng" },
          { label: "2. Với mỗi chỗ trống: đoán LOẠI TỪ", sub: "made of ___ → danh từ chất liệu · every ___ years → con số" },
          { label: "3. Gạch từ ngay TRƯỚC và SAU chỗ trống", sub: "Đó là thứ sẽ báo cho bạn “sắp tới rồi” (dù sẽ bị nói bằng lời khác)" },
          { label: "4. Đếm số chỗ trống mỗi chặng", sub: "Chặng có 3 chỗ trống ⇒ phải tập trung hơn chặng có 1" },
        ],
      },
      {
        t: "table",
        head: ["Dòng ghi chú", "Đoán loại từ", "Sẽ nghe thấy tín hiệu gì"],
        rows: [
          ["most damage occurs during winter **___**", "Danh từ (số nhiều?) chỉ hiện tượng mùa đông", "winter · damage / destroy / serious"],
          ["cliffs made of **___** erode fastest", "Danh từ chất liệu / loại đá", "cliffs · soft · quickly / lose metres"],
          ["must be repeated every **___** years", "Con số", "repeat / again / last / every"],
          ["the land flooded is usually **___** of low value", "Danh từ chỉ loại đất", "flood · land · value · housing"],
        ],
        caption: "Ghi chú dùng bị động (is planted, be repeated) và danh từ; giảng viên có thể nói chủ động với chủ ngữ là người (engineers repeat…, they plant…).",
      },
      { t: "rule", formula: "Tiêu đề con = chặng của bài giảng · chỗ trống = loại từ + hai từ hàng xóm", vi: "Vào bài với bản đồ trong tay: biết có mấy chặng, mỗi chặng mấy câu, mỗi câu cần loại từ gì." },

      /* ── 3 ── */
      { t: "h", text: "3. Từ chỉ đường của giảng viên (signposting)" },
      {
        t: "p",
        text: "Giảng viên giỏi luôn **báo trước** mình sắp nói gì và **báo** khi chuyển phần. Những cụm này không chứa đáp án, nhưng cho bạn biết **mắt phải nhảy xuống tiêu đề con nào**. Nghe thấy cụm chuyển phần mà chỗ trống của phần trước chưa điền ⇒ **bỏ**, đi tiếp.",
      },
      {
        t: "table",
        head: ["Chức năng", "Cụm hay nghe", "Việc của bạn"],
        rows: [
          ["Nêu chủ đề, dàn bài", "In today's lecture I want to look at… · I'll begin with…, and then move on to…", "So với các tiêu đề con: khớp ⇒ yên tâm"],
          ["Vào phần đầu", "So, what causes…? · First, … · Let me start with…", "Mắt ở chặng 1"],
          ["Chuyển phần", "Let's turn now to… · Moving on to… · A second… · Another method is… · The third approach is…", "**Nhảy** xuống tiêu đề con kế tiếp"],
          ["Định nghĩa thuật ngữ", "…, that is, … · in other words, … · what is known as… · It's called… and it means…", "Không hoảng khi gặp từ lạ — lời giải thích tới ngay"],
          ["Nêu mặt trái", "The trouble is… · The drawback is… · an unfortunate side effect · however", "Chỗ trống về **nhược điểm** sắp tới"],
          ["Gạt một ý sai", "You might assume… **but** · Traditionally…, **although** nowadays… · not X **but** Y · X is sometimes suggested, **but**…", "⚠️ Bẫy: chờ nghe phần sau but / although"],
          ["Tổng kết", "So, to sum up… · In conclusion…", "Hết câu hỏi — dùng thời gian soát chính tả"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở Note completion Part 4",
        items: [
          "Viết **thứ nghe thấy đầu tiên** thuộc đúng loại từ (granite thay vì clay, glass thay vì construction). Luôn hỏi: “Từ này có **khớp với cả dòng ghi chú** không?”",
          "Viết **hai từ** khi đề ghi ONE WORD ONLY (winter storms ✗ — chữ winter đã in sẵn) ⇒ sai.",
          "Quên **s** số nhiều (storm ✗ — nghe rõ /stɔːmz/; dam ✗ — “dams are built”) hoặc thêm s khi không có.",
          "Mải nghĩ về một câu đã lỡ ⇒ lỡ thêm hai câu sau. Lỡ thì **đoán một từ hợp loại**, nhảy tiếp.",
          "Sai chính tả từ dễ: tourists (~~tourits~~), beach (~~beech~~), construction (~~contruction~~). Sai chính tả = 0 điểm.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Luyện ngắn — Practice 1 (4 câu)" },
      {
        t: "p",
        text: "Một đoạn mở đầu bài giảng dài khoảng 1 phút. Đọc 4 dòng ghi chú trong **20 giây**, đoán loại từ, rồi bấm nghe **một lần**. Chú ý hai chỗ giảng viên nhắc một thứ rồi gạt đi.",
      },
      {
        t: "listen",
        id: "t3d13-nghe-ngan",
        title: "Tidal power — the opening of a lecture",
        dan: { so: "Day 13, Practice 1", boiCanh: "the beginning of a lecture on tidal power.", cau: [1, 4] },
        note: "Khoảng 1 phút, giọng Mỹ (nam). ONE WORD ONLY cho mỗi chỗ trống.",
        lines: [
          { who: "Lecturer", voice: "us-nam", text: "Right, let's get started. This morning's topic is tidal power — that is, electricity generated from the rise and fall of the sea. I'll cover three things: how it works, where it's used, and why it isn't more widespread.", vi: "Nào, ta bắt đầu. Chủ đề sáng nay là điện thuỷ triều — tức là điện được tạo ra từ việc nước biển lên xuống. Tôi sẽ nói ba điều: nó hoạt động thế nào, được dùng ở đâu, và vì sao nó chưa phổ biến hơn." },
          { who: "Lecturer", voice: "us-nam", text: "First, how it works. The basic idea is simple. Water flowing in and out of a river mouth turns a turbine, just as wind turns a windmill. Unlike wind, however, tides are completely predictable. We know exactly when they'll happen years in advance, and that's the technology's greatest strength.", vi: "Đầu tiên, cách hoạt động. Ý tưởng cơ bản rất đơn giản. Nước chảy vào ra ở cửa sông làm quay một tua-bin, giống như gió làm quay cối xay gió. Tuy nhiên, khác với gió, thuỷ triều hoàn toàn dự đoán được. Ta biết chính xác nó xảy ra lúc nào trước nhiều năm, và đó là điểm mạnh nhất của công nghệ này." },
          { who: "Lecturer", voice: "us-nam", text: "Moving on to where it's used. Today the biggest station in the world is in South Korea, but that wasn't the first. The first large station was opened in France, back in 1966.", vi: "Chuyển sang nơi nó được dùng. Ngày nay nhà máy lớn nhất thế giới nằm ở Hàn Quốc, nhưng đó không phải nhà máy đầu tiên. Nhà máy lớn đầu tiên được mở ở Pháp, từ năm 1966." },
          { who: "Lecturer", voice: "us-nam", text: "So why isn't it everywhere? You might assume the technology is the problem, but in fact it's well understood. The main obstacle is cost: a tidal station is far more expensive to build than a wind farm.", vi: "Vậy tại sao nó chưa có ở khắp nơi? Bạn có thể cho rằng công nghệ là vấn đề, nhưng thật ra công nghệ đã được hiểu rõ. Trở ngại chính là chi phí: xây một nhà máy thuỷ triều đắt hơn nhiều so với một trang trại gió." },
        ],
      },
      {
        t: "note",
        title: "Tidal power — notes (Questions 1–4)",
        items: [
          "**How it works:** moving water turns a **1** ___",
          "**Main strength:** tides are **2** ___ (known years in advance)",
          "**Where it is used:** first large station opened in **3** ___ (1966)",
          "**Why it is not widespread:** the main obstacle is **4** ___",
        ],
      },
      {
        t: "quiz",
        id: "t3d13-nghe-ngan-dien",
        kind: "fill",
        title: "Practice 1 — Complete the notes. ONE WORD ONLY (4 câu)",
        items: [
          { q: "1. moving water turns a ___", answers: ["turbine"] },
          { q: "2. tides are ___", answers: ["predictable"] },
          { q: "3. first large station opened in ___", answers: ["France"] },
          { q: "4. the main obstacle is ___", answers: ["cost", "costs", "the cost"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích Practice 1 — bẫy nằm ở đâu",
        items: [
          "**1 turbine** — Water… turns a **turbine**. Ghi chú “moving water” = “water flowing in and out”. (windmill chỉ là phép so sánh với gió.)",
          "**2 predictable** — tides are completely **predictable**… and that's the technology's **greatest strength** = Main strength. Cần tính từ sau are.",
          "**3 France** — South Korea được nói **trước** nhưng là nhà máy **lớn nhất**, “**but** that wasn't the first”. Ghi chú hỏi **first** ⇒ France. Đây là bẫy “nhắc rồi gạt đi”.",
          "**4 cost** — You might assume the **technology** is the problem, **but in fact**… The main obstacle is **cost**. Viết technology là dính bẫy.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — Part 4, Questions 1–10" },
      {
        t: "p",
        text: "Làm như thi thật: **45 giây** đọc trang ghi chú bên dưới (đoán loại từ cho cả 10 chỗ trống), rồi bấm nghe **một lần duy nhất**, không dừng. Viết đáp án ra giấy trong lúc nghe; hết băng mới gõ vào ô và soát chính tả. Lời dẫn: **Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.**",
      },
      {
        t: "note",
        title: "COASTAL EROSION — lecture notes (Questions 1–10)",
        items: [
          "**Causes — natural**",
          "• waves: most damage occurs during winter **1** ___",
          "• type of rock: cliffs made of **2** ___ erode fastest",
          "**Causes — human**",
          "• **3** ___ on rivers stop sand from reaching the coast",
          "• sand is removed from beaches, mainly for the **4** ___ industry",
          "**Hard engineering**",
          "• sea walls: protect buildings but are costly; in time the whole **5** ___ in front of the wall is lost",
          "• groynes: barriers of **6** ___ or rock; trap sand, but the problem is passed on to the next town",
          "**Soft engineering**",
          "• beach nourishment: looks natural; popular with businesses because it brings in **7** ___",
          "  — at one resort, has to be repeated every **8** ___ years",
          "• sand dunes: **9** ___ is planted; its roots hold the sand; must be fenced off",
          "**Managed retreat**",
          "• sea defences are removed; the land flooded is usually **10** ___ of low value",
          "• new salt marsh absorbs wave energy and provides a habitat for birds",
        ],
      },
      {
        t: "listen",
        id: "t3d13-nghe-bai",
        title: "Coastal erosion and how it is managed",
        dan: { so: "Day 13, Recording 1", boiCanh: "part of a lecture on coastal erosion, given to first-year geography students.", cau: [1, 10] },
        note: "Khoảng 5 phút, tốc độ tự nhiên, giọng Anh (nữ). Một người nói, không có quãng nghỉ giữa bài. ONE WORD AND/OR A NUMBER.",
        lines: [
          { who: "Lecturer", voice: "uk-nu", text: "Good morning, everyone. In today's lecture I want to look at coastal erosion — that is, the gradual loss of land to the sea — and at what, if anything, can be done about it. I'll begin with the causes, both natural and human, and then move on to three approaches to managing the problem. To give you an idea of the scale: along one stretch of eastern England, the coastline is retreating by almost two metres a year, and whole villages have been lost over the centuries.", vi: "Chào các bạn. Trong bài giảng hôm nay tôi muốn xem xét hiện tượng xói lở bờ biển — tức là đất liền dần dần bị biển lấn mất — và liệu có thể làm gì với nó. Tôi sẽ bắt đầu bằng các nguyên nhân, cả tự nhiên lẫn do con người, rồi chuyển sang ba hướng xử lý. Để các bạn hình dung quy mô: dọc một đoạn bờ biển phía đông nước Anh, đường bờ đang lùi gần hai mét mỗi năm, và nhiều ngôi làng đã biến mất qua các thế kỷ." },
          { who: "Lecturer", voice: "uk-nu", text: "So, what causes erosion? The most obvious answer is waves. But waves don't do the same amount of damage all year round. In summer the sea is relatively calm, and beaches may actually grow. The serious damage is done during winter storms, when powerful waves hit the base of the cliffs again and again. The type of rock matters too. Hard rocks such as granite can resist the sea for thousands of years, whereas cliffs made of clay are soft and may lose several metres in a single night.", vi: "Vậy cái gì gây ra xói lở? Câu trả lời hiển nhiên nhất là sóng. Nhưng sóng không gây thiệt hại như nhau quanh năm. Mùa hè biển tương đối lặng, bãi biển thậm chí còn bồi thêm. Thiệt hại nghiêm trọng xảy ra trong các cơn bão mùa đông, khi sóng mạnh đập liên tục vào chân vách đá. Loại đá cũng quan trọng. Đá cứng như granit có thể chống chọi với biển hàng nghìn năm, trong khi vách đá bằng đất sét thì mềm và có thể mất vài mét chỉ trong một đêm." },
          { who: "Lecturer", voice: "uk-nu", text: "Natural processes are only part of the story, however. Human activity has made things considerably worse. Beaches are supplied with sand by rivers, which carry it down from the mountains to the coast. When dams are built on those rivers, the sand is trapped behind them and never reaches the sea, so the beaches downstream slowly become thinner. On top of that, enormous quantities of sand are removed directly from beaches and riverbeds. You might assume it's used for making glass, and a little of it is, but the great majority is taken by the construction industry, where it's mixed into concrete.", vi: "Tuy nhiên, các quá trình tự nhiên chỉ là một phần câu chuyện. Hoạt động của con người đã làm mọi thứ tệ hơn đáng kể. Bãi biển được sông cung cấp cát, sông mang cát từ núi xuống bờ biển. Khi đập được xây trên các con sông đó, cát bị giữ lại phía sau đập và không bao giờ ra tới biển, nên các bãi biển ở hạ lưu mỏng dần. Thêm vào đó, một lượng cát khổng lồ bị lấy trực tiếp từ bãi biển và lòng sông. Bạn có thể nghĩ cát được dùng làm thuỷ tinh, và đúng là có một ít, nhưng phần lớn là do ngành xây dựng lấy, để trộn bê tông." },
          { who: "Lecturer", voice: "uk-nu", text: "Let's turn now to solutions, and I'll start with what is known as hard engineering — in other words, building solid structures to hold back the sea. The classic example is the sea wall. Sea walls certainly protect the buildings behind them, but they are extremely expensive, and they have an unfortunate side effect. Because the wall reflects the energy of the waves straight back, the sand at its foot is washed away, and eventually the beach in front of the wall disappears altogether.", vi: "Giờ ta chuyển sang giải pháp, và tôi bắt đầu với cái gọi là công trình cứng — nói cách khác là xây các kết cấu vững chắc để chặn biển. Ví dụ kinh điển là kè biển. Kè biển chắc chắn bảo vệ được các toà nhà phía sau, nhưng cực kỳ đắt, và có một tác dụng phụ đáng tiếc. Vì bức kè dội thẳng năng lượng sóng trở lại, cát ở chân kè bị cuốn đi, và cuối cùng bãi biển phía trước kè biến mất hẳn." },
          { who: "Lecturer", voice: "uk-nu", text: "A second hard structure is the groyne. Groynes are long barriers built at right angles to the shore. Traditionally they were made of wood, although rock is more common nowadays. Their purpose is to trap the sand that is carried along the coast by the current. They do this very well. The trouble is that the sand they trap would otherwise have travelled on to beaches further along the coast, so the problem isn't solved — it's simply passed on to the next town.", vi: "Công trình cứng thứ hai là mỏ hàn. Mỏ hàn là những hàng rào dài xây vuông góc với bờ. Trước đây chúng làm bằng gỗ, dù ngày nay đá phổ biến hơn. Mục đích của chúng là giữ lại cát bị dòng chảy mang dọc bờ biển. Chúng làm việc này rất tốt. Vấn đề là lượng cát chúng giữ lại lẽ ra đã đi tiếp tới các bãi biển xa hơn dọc bờ, nên vấn đề không được giải quyết — nó chỉ bị đẩy sang thị trấn bên cạnh." },
          { who: "Lecturer", voice: "uk-nu", text: "For this reason, many engineers now prefer soft engineering, which works with natural processes rather than against them. The best-known method is beach nourishment: sand is pumped from the seabed onto the beach to replace what has been lost. The result looks completely natural, and it's popular with local businesses, since a wide sandy beach attracts tourists. The drawback is that the sea immediately begins to carry the new sand away. When the technique was first introduced, it was hoped that a beach would last twenty years. In practice, at one resort I've studied, the work has to be repeated every five years, so it's far from cheap in the long run.", vi: "Vì lý do này, nhiều kỹ sư giờ thích giải pháp mềm, tức là làm việc thuận theo các quá trình tự nhiên thay vì chống lại chúng. Phương pháp nổi tiếng nhất là nuôi bãi: cát được bơm từ đáy biển lên bãi để bù phần đã mất. Kết quả trông hoàn toàn tự nhiên, và được các doanh nghiệp địa phương ưa thích, vì một bãi cát rộng thu hút du khách. Nhược điểm là biển lập tức bắt đầu cuốn lớp cát mới đi. Khi kỹ thuật này mới ra đời, người ta hy vọng một bãi biển sẽ giữ được hai mươi năm. Trên thực tế, ở một khu nghỉ dưỡng tôi từng nghiên cứu, việc này phải làm lại cứ năm năm một lần, nên về lâu dài chẳng hề rẻ." },
          { who: "Lecturer", voice: "uk-nu", text: "Another soft method is to strengthen sand dunes, which act as a natural barrier. Trees are sometimes suggested, but they rarely survive the salty wind. What is normally planted is a special kind of grass, whose long roots hold the sand together. It's cheap and effective, but the young plants are easily damaged — not by the sea, but by people walking over them — so the area usually has to be fenced off for a few years.", vi: "Một phương pháp mềm khác là gia cố các cồn cát, vốn đóng vai trò hàng rào tự nhiên. Đôi khi người ta đề xuất trồng cây, nhưng cây hiếm khi sống nổi trong gió mặn. Thứ thường được trồng là một loại cỏ đặc biệt, rễ dài của nó giữ cát lại với nhau. Cách này rẻ và hiệu quả, nhưng cây non dễ bị hư hại — không phải do biển, mà do người đi bộ giẫm lên — nên khu vực thường phải được rào lại vài năm." },
          { who: "Lecturer", voice: "uk-nu", text: "The third approach is the most controversial. It's called managed retreat, and it means accepting that some land cannot be defended. Existing sea defences are deliberately removed, and the sea is allowed to flood the land behind them. Obviously this isn't done where there is housing; the land chosen is usually farmland of fairly low value. Within a few years the flooded area turns into salt marsh, which absorbs the energy of the waves and so protects the land further inland. It also becomes a valuable habitat for birds. The owners, of course, have to be paid compensation, and decisions of this kind are never easy.", vi: "Hướng thứ ba gây tranh cãi nhất. Nó được gọi là rút lui có quản lý, nghĩa là chấp nhận rằng có những vùng đất không thể bảo vệ. Các công trình chắn biển hiện có bị cố ý dỡ bỏ, và biển được phép tràn vào vùng đất phía sau. Dĩ nhiên việc này không làm ở nơi có nhà ở; đất được chọn thường là đất nông nghiệp giá trị khá thấp. Trong vài năm, vùng ngập biến thành đầm lầy mặn, hấp thụ năng lượng sóng và nhờ đó bảo vệ vùng đất sâu hơn bên trong. Nó cũng trở thành nơi cư trú quý giá cho chim. Tất nhiên chủ đất phải được trả tiền đền bù, và những quyết định kiểu này không bao giờ dễ dàng." },
          { who: "Lecturer", voice: "uk-nu", text: "So, to sum up: no single solution is perfect, and each one has to be judged against its cost. Next week we'll look at how governments decide which stretches of coast are worth protecting.", vi: "Vậy, tóm lại: không giải pháp nào hoàn hảo, và mỗi giải pháp phải được cân nhắc so với chi phí của nó. Tuần sau ta sẽ xem các chính phủ quyết định đoạn bờ biển nào đáng bảo vệ như thế nào." },
        ],
      },
      {
        t: "quiz",
        id: "t3d13-nghe-bai-dien",
        kind: "fill",
        title: "Questions 1–10 — Complete the notes. ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. most damage occurs during winter ___", answers: ["storms"] },
          { q: "2. cliffs made of ___ erode fastest", answers: ["clay"] },
          { q: "3. ___ on rivers stop sand from reaching the coast", answers: ["dams"] },
          { q: "4. sand is removed from beaches, mainly for the ___ industry", answers: ["construction"] },
          { q: "5. in time the whole ___ in front of the wall is lost", answers: ["beach"] },
          { q: "6. groynes: barriers of ___ or rock", answers: ["wood"] },
          { q: "7. popular with businesses because it brings in ___", answers: ["tourists"] },
          { q: "8. has to be repeated every ___ years", answers: ["five", "5"] },
          { q: "9. sand dunes: ___ is planted", answers: ["grass"] },
          { q: "10. the land flooded is usually ___ of low value", answers: ["farmland"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích 1–5 — câu trong băng và bẫy",
        items: [
          "**1 storms** — “The serious damage is done during **winter storms**”. Ghi chú: most damage occurs (chủ động) ↔ băng: damage is done (bị động). Phải có **s**. summer được nhắc trước nhưng là lúc biển lặng.",
          "**2 clay** — “Hard rocks such as **granite** can resist… **whereas** cliffs made of **clay** are soft and may lose several metres in a single night”. erode fastest = lose several metres in a single night. granite là bẫy (đá cứng).",
          "**3 dams** — “When **dams** are built on those rivers, the sand is trapped behind them and never reaches the sea”. stop sand from reaching the coast = never reaches the sea.",
          "**4 construction** — “You might assume it's used for making **glass**… **but** the great majority is taken by the **construction** industry”. mainly = the great majority. glass là thứ bị gạt đi; concrete không đứng trước industry.",
          "**5 beach** — “eventually the **beach** in front of the wall disappears altogether”. is lost = disappears; in time = eventually. sand cũng được nhắc (the sand at its foot is washed away) nhưng “the whole ___ … is lost” = “the beach… disappears altogether” (whole = altogether); “the whole sand” cũng không đúng ngữ pháp.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 6–10 — câu trong băng và bẫy",
        items: [
          "**6 wood** — “**Traditionally** they were made of **wood**, **although rock** is more common nowadays”. Ghi chú đã in sẵn rock ⇒ chỗ trống là chất liệu còn lại.",
          "**7 tourists** — “popular with local businesses, since a wide sandy beach attracts **tourists**”. brings in = attracts; because = since.",
          "**8 five / 5** — “it was hoped that a beach would last **twenty** years. **In practice**… the work has to be repeated every **five** years”. twenty là kỳ vọng ban đầu — bẫy đổi số.",
          "**9 grass** — “**Trees** are sometimes suggested, **but** they rarely survive… What is normally planted is a special kind of **grass**”. Ghi chú “is planted” khớp nguyên dạng bị động.",
          "**10 farmland** — “Obviously this isn't done where there is **housing**; the land chosen is usually **farmland** of fairly low value”. housing bị phủ định bằng isn't; “land” đã in sẵn trong ghi chú nên không viết land.",
          "Đếm lại: **5 / 10** câu có bẫy “nhắc rồi gạt” (2, 4, 6, 8, 9) + câu 10 có phủ định. Tín hiệu: whereas · but · although · in practice · isn't.",
        ],
      },
      {
        t: "table",
        head: ["Đúng / 10", "Mức ước tính cho Part 4", "Việc cần làm"],
        rows: [
          ["8–10", "Band 7 trở lên", "Nghe lại không nhìn chữ, nhại theo (shadowing) đoạn 3 và đoạn 6."],
          ["6–7", "Band 6 — đạt mục tiêu", "Mở lời thoại, tô các từ chỉ đường; ghi câu sai vào Sổ lỗi theo loại bẫy."],
          ["4–5", "Band 5–5.5", "Nghe lần 2 có nhìn ghi chú, dừng sau mỗi chặng; rồi nghe lần 3 một mạch."],
          ["0–3", "Chưa vững", "Ôn Tập 2 Ngày 19 (Part 4 nhập môn) và Tập 3 Ngày 9 (bẫy đổi ý), sau đó làm lại bài này."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: lạc giữa bài giảng thì làm gì",
        items: [
          "Dấu hiệu bạn đã lạc: giảng viên nói những từ **không có** trong dòng ghi chú bạn đang nhìn suốt 15–20 giây.",
          "Đừng cố nhớ lại. Nhìn xuống **tiêu đề con kế tiếp** và chờ cụm chuyển phần (Let's turn now to… / Another… / The third…).",
          "Trong lúc chờ, liếc từ đứng trước chỗ trống gần nhất của chặng mới (vd “barriers of”). Nghe thấy nó là bạn đã **bắt lại** được bài.",
          "Câu đã lỡ: cuối bài điền một từ **đúng loại, hợp nghĩa** (đoán). Không bỏ trống — không bị trừ điểm khi sai.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Phát âm: /ʃ/ và /ʒ/ trong -tion / -sion" },
      {
        t: "p",
        text: "Bài giảng hôm nay đầy từ đuôi -tion / -sion: ero**sion**, construc**tion**, solu**tion**, deci**sion**, compensa**tion**. Hai âm cần phân biệt: ==/ʃ/== (như “sh” trong **she** — không rung cổ họng) và ==/ʒ/== (cùng khẩu hình nhưng **rung** cổ họng — như chữ **s** trong **television**; tiếng Việt không có âm này, người Việt hay đọc thành /z/ hoặc /s/). Tập 2 Ngày 2 đã học -tion = /ʃən/; hôm nay thêm quy tắc cho **-sion**.",
      },
      {
        t: "table",
        head: ["Chữ viết", "Đọc", "Ví dụ"],
        rows: [
          ["**-tion**", "/ʃən/", "solution /səˈluːʃən/ · construction /kənˈstrʌkʃən/ · protection · compensation · pollution"],
          ["**-ssion**", "/ʃən/", "discussion /dɪˈskʌʃən/ · permission · profession · emission"],
          ["**phụ âm + -sion** (n, l, r + sion)", "/ʃən/", "expansion /ɪkˈspænʃən/ · tension · pension · version (Anh-Anh /ˈvɜːʃən/)"],
          ["**nguyên âm + -sion**", "==/ʒən/==", "erosion /ɪˈrəʊʒən/ · decision /dɪˈsɪʒən/ · conclusion /kənˈkluːʒən/ · division · television · explosion"],
          ["**-sure / -sual** sau nguyên âm", "==/ʒ/==", "measure /ˈmeʒə/ · pleasure · leisure /ˈleʒə/ · usual /ˈjuːʒuəl/ · casual · visual"],
          ["Ngoại lệ **-stion**", "/tʃən/", "question /ˈkwestʃən/ · suggestion /səˈdʒestʃən/"],
        ],
        caption: "Trọng âm gần như luôn rơi vào âm tiết NGAY TRƯỚC -tion / -sion (Tập 3 Ngày 7): eRO-sion, conSTRUC-tion, compenSA-tion. Ngoại lệ hay gặp: TElevision /ˈtelɪvɪʒən/.",
      },
      {
        t: "note",
        title: "💡 Mẹo tập âm /ʒ/",
        items: [
          "Nói “shhh” thật dài (/ʃ/). Giữ nguyên môi và lưỡi, **bật tiếng** từ cổ họng — đặt tay lên cổ thấy rung ⇒ đó là /ʒ/.",
          "Người Việt hay đọc decision thành ~~/dɪˈsɪzən/~~ hoặc ~~/dɪˈsɪʃən/~~. Tập cặp: **mission** /ʃ/ – **vision** /ʒ/ · **pressure** /ʃ/ – **pleasure** /ʒ/.",
          "Âm /ən/ cuối rất nhẹ: gần như chỉ còn /n/. Đừng đọc rõ thành “sần” hay “sừn”.",
          "Khi **nghe**: bắt được đuôi /ʃən/ – /ʒən/ là biết đó là **danh từ** — có ích khi đoán loại từ cho chỗ trống.",
        ],
      },
      { t: "rule", formula: "-tion / -ssion / phụ âm + sion = /ʃən/ · nguyên âm + sion = /ʒən/ · -stion = /tʃən/", vi: "erosion, decision, conclusion đọc /ʒ/ (rung); solution, discussion, expansion đọc /ʃ/ (không rung)." },
      {
        t: "phatam",
        id: "t3d13-phat-am",
        title: "Luyện phát âm — /ʃ/ và /ʒ/ trong -tion / -sion",
        note: "Câu 1–3: /ʃən/. Câu 4–6: /ʒən/ và /ʒə/ — rung cổ họng. Câu 7–8: trộn cả hai. Nhấn âm tiết ngay trước -tion / -sion.",
        items: [
          { text: "The construction of the station caused pollution.", ipa: "ðə kənstrʌkʃən əv ðə steɪʃən kɔːzd pəluːʃən", vi: "Việc xây nhà ga đã gây ô nhiễm." },
          { text: "We had a long discussion about the solution.", ipa: "wi hæd ə lɒŋ dɪskʌʃən əbaʊt ðə səluːʃən", vi: "Chúng tôi đã thảo luận lâu về giải pháp." },
          { text: "The expansion of the profession needs permission.", ipa: "ði ɪkspænʃən əv ðə prəfeʃən niːdz pəmɪʃən", vi: "Việc mở rộng ngành nghề cần được cho phép." },
          { text: "Erosion is a serious problem on this coast.", ipa: "ɪrəʊʒən ɪz ə sɪəriəs prɒbləm ɒn ðɪs kəʊst", vi: "Xói lở là vấn đề nghiêm trọng ở bờ biển này." },
          { text: "The decision led to a clear conclusion.", ipa: "ðə dɪsɪʒən led tə ə klɪə kənkluːʒən", vi: "Quyết định đó dẫn tới một kết luận rõ ràng." },
          { text: "Watching television is usually a pleasure.", ipa: "wɒtʃɪŋ telɪvɪʒən ɪz juːʒuəli ə pleʒə", vi: "Xem ti vi thường là một thú vui." },
          { text: "A difficult decision about coastal protection.", ipa: "ə dɪfɪkəlt dɪsɪʒən əbaʊt kəʊstl prətekʃən", vi: "Một quyết định khó khăn về việc bảo vệ bờ biển." },
          { text: "In conclusion, there is no perfect solution to erosion.", ipa: "ɪn kənkluːʒən ðeər ɪz nəʊ pɜːfɪkt səluːʃən tu ɪrəʊʒən", vi: "Tóm lại, không có giải pháp hoàn hảo nào cho xói lở." },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d13-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 13",
    goal: "Ôn trọn Ngày 13: chia bị động đúng thì và sau modal, chọn chủ động hay bị động, dùng động từ hai tân ngữ và by + agent, dịch câu Task 2 có bị động, làm câu chọn TWO trên đoạn đọc mới, điền ghi chú một đoạn bài giảng và phân biệt /ʃ/ – /ʒ/.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (41 câu)",
        items: [
          "**I–IV (27 câu)** — ngữ pháp: chia bị động, trắc nghiệm, dịch, sửa lỗi.",
          "**V (4 câu = 6 điểm)** — đọc: hai câu chọn TWO + hai câu một đáp án trên đoạn “Vertical farms”.",
          "**VI (5 câu)** — nghe: điền ghi chú một đoạn bài giảng (giọng Canada).",
          "**VII (5 câu)** — phát âm: /ʃ/ · /ʒ/ · /tʃ/.",
          "Đạt: ≥ 30/41. Sai nhiều ở phần nào thì mở lại đúng mục ghi trong tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 13 trước khi làm bài",
        center: "Ngày 13",
        branches: [
          { label: "Bị động", items: ["be (đúng thì) + V3", "tiếp diễn: being · hoàn thành: been", "modal + be + V3", "modal + have been + V3"] },
          { label: "Cẩn thận", items: ["happen / rise / exist: KHÔNG bị động", "người + was given + vật", "by… chỉ khi là tin mới", "with + dụng cụ"] },
          { label: "Đọc: chọn TWO", items: ["danh từ số nhiều → đoạn liệt kê", "kiểm cả 5 phương án", "bị phủ nhận · không nhắc", "mỗi chữ 1 điểm"] },
          { label: "Nghe Part 4", items: ["tiêu đề con = bản đồ", "từ chỉ đường", "nhắc rồi gạt: but / although", "-sion sau nguyên âm = /ʒən/"] },
        ],
      },

      { t: "h", text: "I. Chia động từ ở dạng bị động đúng thì (8 câu) — ôn Ngữ pháp mục 2–4" },
      {
        t: "quiz",
        id: "t3d13-bt-chia",
        kind: "fill",
        title: "I. Viết dạng bị động của động từ trong ngoặc",
        items: [
          { q: "At the moment, a new runway ___ (build) at the airport.", answers: ["is being built"] },
          { q: "Since 2010, three primary schools ___ (close) in this district.", answers: ["have been closed"] },
          { q: "By the time I arrived, all the tickets ___ (sell).", answers: ["had been sold"] },
          { q: "The winner ___ (announce) at the end of next week.", answers: ["will be announced"] },
          { q: "Plastic bags should ___ (ban) in all supermarkets.", answers: ["be banned"] },
          { q: "The fire could ___ (prevent) if the alarm had worked. (nói về quá khứ)", answers: ["have been prevented"] },
          { q: "After ___ (pick), the tea leaves are left to dry in the sun.", answers: ["being picked"] },
          { q: "The new law is expected ___ (introduce) next year.", answers: ["to be introduced"] },
        ],
      },

      { t: "h", text: "II. Chọn đáp án đúng (8 câu) — ôn Ngữ pháp mục 5–8" },
      {
        t: "mcq",
        id: "t3d13-bt-chon",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "The number of students studying abroad ___ sharply between 2010 and 2020.", options: ["was risen", "was raised", "rose", "has been risen"], correct: 2, why: "Số liệu “tự” tăng ⇒ rise (nội động từ), chủ động: rose." },
          { q: "All applicants ___ a short test before the interview.", options: ["are given", "are given to", "give", "is given"], correct: 0, why: "Người làm chủ ngữ + be given + vật; applicants số nhiều ⇒ are given." },
          { q: "The new system ___ to the staff by the manager.", options: ["explained", "was explained", "was explaining", "were explained"], correct: 1, why: "explain something to somebody ⇒ The system was explained to the staff." },
          { q: "The glass is cut ___ a special tool.", options: ["by", "from", "of", "with"], correct: 3, why: "Dụng cụ ⇒ with." },
          { q: "___ that eating late at night is unhealthy.", options: ["It is widely believed", "It widely believes", "People are believed", "Is widely believed"], correct: 0, why: "It + is + (widely) + V3 + that…" },
          { q: "A serious mistake ___ in the report last month.", options: ["was occurred", "occurred", "has been occurred", "is occurred"], correct: 1, why: "occur là nội động từ ⇒ không có bị động." },
          { q: "Câu nào viết đúng và tự nhiên nhất?", options: ["English is spoken in Australia by people.", "English speaks in Australia.", "English is spoken in Australia.", "English is speaking in Australia."], correct: 2, why: "Bị động hiện tại đơn; “by people” thừa nên bỏ." },
          { q: "The children ___ by their grandparents while their parents are at work.", options: ["look after", "are looking after", "are looked", "are looked after"], correct: 3, why: "Bị động của cụm động từ look after: giữ nguyên after." },
        ],
      },

      { t: "h", text: "III. Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t3d13-bt-dich",
        kind: "translate",
        title: "III. Dịch sang tiếng Anh — dùng cấu trúc bị động gợi ý",
        grammar: "S + be (đúng thì) + V3 · modal + be + V3 · It is + V3 + that…",
        items: [
          { q: "Nhiều việc làm đã bị thay thế bởi máy móc.", answers: ["Many jobs have been replaced by machines.", "A lot of jobs have been replaced by machines.", "Many jobs have been replaced by machinery."], hint: "have been replaced by" },
          { q: "Nên dạy trẻ em cách tiết kiệm tiền. (Bắt đầu: Children…)", answers: ["Children should be taught how to save money.", "Children should be taught to save money."], hint: "should be taught how to" },
          { q: "Một trung tâm mua sắm sẽ được xây ở phía đông thị trấn.", answers: ["A shopping centre will be built in the east of the town.", "A shopping center will be built in the east of the town.", "A shopping centre will be built to the east of the town.", "A shopping mall will be built in the east of the town.", "A shopping centre is going to be built in the east of the town."], hint: "will be built · in the east of" },
          { q: "Tôi được tặng chiếc đồng hồ này vào sinh nhật lần thứ 18.", answers: ["I was given this watch on my 18th birthday.", "I was given this watch on my eighteenth birthday.", "I was given this watch for my 18th birthday.", "I was given this watch for my eighteenth birthday."], hint: "was given this watch" },
          { q: "Người ta thường lập luận rằng quảng cáo nhắm vào trẻ em nên bị cấm.", answers: ["It is often argued that advertising aimed at children should be banned.", "It is often argued that advertisements aimed at children should be banned.", "It is often argued that advertising to children should be banned.", "It is often argued that advertising for children should be banned.", "It is often argued that advertising targeting children should be banned."], hint: "It is often argued that · should be banned" },
          { q: "Giá xăng đã tăng 10 % vào năm ngoái. (không bị động!)", answers: ["The price of petrol rose by 10% last year.", "The price of petrol rose by 10 % last year.", "Petrol prices rose by 10% last year.", "Petrol prices rose by 10 % last year.", "The price of petrol increased by 10% last year.", "The price of petrol increased by 10 % last year.", "Petrol prices increased by 10% last year.", "The price of petrol went up by 10% last year.", "The price of gas rose by 10% last year.", "Gas prices rose by 10% last year."], hint: "rose by 10% (rise: không có bị động)" },
        ],
      },

      { t: "h", text: "IV. Sửa lỗi (5 câu) — ôn các khung ⚠️" },
      {
        t: "quiz",
        id: "t3d13-bt-sua-loi",
        kind: "fill",
        title: "IV. Mỗi câu có MỘT lỗi ở cụm trong ngoặc. Viết lại cụm đó cho đúng",
        items: [
          { q: "The accident (was happened) at about midnight. → ___", answers: ["happened"] },
          { q: "This bridge (has built) in 1995. → ___", answers: ["was built"] },
          { q: "I think this problem (can solved) quite easily. → ___", answers: ["can be solved"] },
          { q: "A new stadium (is building) near the river at the moment. → ___", answers: ["is being built"] },
          { q: "A bonus (was given the staff) at the end of the year. → ___", answers: ["was given to the staff"] },
        ],
      },

      { t: "h", text: "V. Đọc — chọn TWO + một đáp án (4 câu, 6 điểm) — ôn bài Đọc mục 3–4" },
      {
        t: "passage",
        title: "Vertical farms",
        paras: [
          { label: "A", text: "Vertical farms grow crops indoors, on shelves stacked from floor to ceiling, under artificial light. Supporters point out that such farms use up to 95 per cent less water than open fields, because the water is collected and reused. As the plants are protected from insects, no pesticides are needed, and harvests are not affected by storms or drought. Since the farms can be set up inside cities, vegetables reach the shops within hours rather than days." },
          { label: "B", text: "The method is not without its critics, however. The lamps and air-conditioning consume enormous amounts of electricity, and several well-known companies have closed after their energy bills were raised. At present only leafy plants such as lettuce and herbs can be grown at a profit; wheat, rice and potatoes, which feed most of the world, cannot. Labour costs are also higher than was first expected, although it has proved easy to find staff, since the work is clean and indoors." },
        ],
      },
      { t: "p", text: "**Questions 1 and 2.** Choose **TWO** letters, **A–E**. **Which TWO benefits of vertical farms are mentioned in paragraph A?**" },
      {
        t: "table",
        head: ["", "Benefit"],
        rows: [
          ["**A**", "Less water is required."],
          ["**B**", "The crops have a better flavour."],
          ["**C**", "Chemicals to kill insects are unnecessary."],
          ["**D**", "The vegetables are cheaper for shoppers."],
          ["**E**", "More jobs are created in the countryside."],
        ],
      },
      { t: "p", text: "**Questions 3 and 4.** Choose **TWO** letters, **A–E**. **Which TWO difficulties are mentioned in paragraph B?**" },
      {
        t: "table",
        head: ["", "Difficulty"],
        rows: [
          ["**A**", "Workers are hard to recruit."],
          ["**B**", "The farms need a great deal of electricity."],
          ["**C**", "Few types of crop can be grown profitably."],
          ["**D**", "Buildings in cities are expensive to rent."],
          ["**E**", "Customers do not trust food grown indoors."],
        ],
      },
      {
        t: "quiz",
        id: "t3d13-bt-doc-hai",
        kind: "fill",
        title: "V-a. Choose TWO letters (gõ hai chữ cái, thứ tự tự do)",
        items: [
          { q: "(1–2) Two benefits: ___", answers: ["A C", "AC", "A and C", "A & C", "A/C", "A + C", "A-C", "C A", "CA", "C and A", "C & A", "C/A", "C + A", "C-A"] },
          { q: "(3–4) Two difficulties: ___", answers: ["B C", "BC", "B and C", "B & C", "B/C", "B + C", "B-C", "C B", "CB", "C and B", "C & B", "C/B", "C + B", "C-B"] },
        ],
      },
      {
        t: "mcq",
        id: "t3d13-bt-doc-mot",
        title: "V-b. Choose the correct letter, A, B, C or D",
        items: [
          { q: "5. Why have some vertical farming companies gone out of business?", options: ["They could not find enough customers.", "Their crops were damaged by insects.", "They were unable to grow lettuce at a profit.", "The cost of their energy increased."], correct: 3, why: "several well-known companies have closed after their energy bills were raised ⇒ chi phí năng lượng tăng (bị động were raised → chủ động increased)." },
          { q: "6. What does the writer say about labour costs?", options: ["They turned out to be greater than predicted.", "They have fallen because the work is easy.", "They are the main reason for the method's critics.", "They are lower than on traditional farms."], correct: 0, why: "Labour costs are also higher than was first expected ⇒ greater than predicted (expected = predicted)." },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án V",
        items: [
          "**1–2: A, C.** A — use up to 95 per cent less water. C — no pesticides are needed (pesticides = chemicals to kill insects; not needed = unnecessary). B, D: không nhắc (bài nói rau tới cửa hàng NHANH, không nói rẻ hay ngon). E: nói ngược — trang trại đặt trong thành phố.",
          "**3–4: B, C.** B — consume enormous amounts of electricity. C — only leafy plants… can be grown at a profit. A: bị phủ nhận — it has proved easy to find staff. D, E: không nhắc.",
          "**5: D** · **6: A** — xem phần giải thích dưới từng câu.",
        ],
      },

      { t: "h", text: "VI. Nghe — đoạn cuối một bài giảng (5 câu) — ôn bài Nghe mục 2–3" },
      {
        t: "note",
        title: "Recycling a glass bottle — notes",
        items: [
          "• at the sorting centre, bottles are separated by **1** ___",
          "• paper labels are **2** ___ off later",
          "• the glass is crushed, and the pieces are then **3** ___",
          "• the pieces are mixed with **4** ___ and heated in a furnace",
          "• the process uses about **5** ___ per cent less energy than making new glass",
        ],
      },
      {
        t: "listen",
        id: "t3d13-bt-nghe",
        title: "What happens to a glass bottle",
        dan: { so: "Day 13, Homework recording", boiCanh: "the last part of a lecture on recycling.", cau: [1, 5] },
        note: "Khoảng 1 phút, giọng Canada (nữ). ONE WORD AND/OR A NUMBER. Nghe một lần.",
        lines: [
          { who: "Lecturer", voice: "ca-nu", text: "Before we finish, let me quickly go through what happens to a glass bottle after it's been thrown into a recycling bin. First, the bottles are taken by lorry to a sorting centre, where they are separated by colour — not by size, as many people think. Paper labels don't need to be removed by hand; they are simply burnt off later.", vi: "Trước khi kết thúc, tôi điểm nhanh chuyện gì xảy ra với một chai thuỷ tinh sau khi nó bị bỏ vào thùng tái chế. Đầu tiên, chai được xe tải chở tới trung tâm phân loại, ở đó chúng được tách theo màu — không phải theo kích cỡ như nhiều người nghĩ. Nhãn giấy không cần bóc bằng tay; chúng đơn giản là bị đốt cháy sau đó." },
          { who: "Lecturer", voice: "ca-nu", text: "Next, the glass is crushed into small pieces, which are then washed to remove any remaining dirt. After being washed, the pieces are mixed with sand and heated in a furnace to about fifteen hundred degrees. The liquid glass is then poured into moulds and left to cool.", vi: "Tiếp theo, thuỷ tinh được nghiền thành mảnh nhỏ, rồi các mảnh được rửa để loại bỏ bụi bẩn còn sót. Sau khi được rửa, các mảnh được trộn với cát và nung trong lò tới khoảng một nghìn năm trăm độ. Thuỷ tinh lỏng sau đó được rót vào khuôn và để nguội." },
          { who: "Lecturer", voice: "ca-nu", text: "The whole process uses about thirty per cent less energy than making new glass, and — this is the remarkable thing — glass can be recycled again and again without any loss of quality.", vi: "Toàn bộ quy trình dùng ít hơn khoảng ba mươi phần trăm năng lượng so với làm thuỷ tinh mới, và — đây là điều đáng chú ý — thuỷ tinh có thể được tái chế hết lần này đến lần khác mà không giảm chất lượng." },
        ],
      },
      {
        t: "quiz",
        id: "t3d13-bt-nghe-dien",
        kind: "fill",
        title: "VI. Complete the notes — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. bottles are separated by ___", answers: ["colour", "color"] },
          { q: "2. paper labels are ___ off later", answers: ["burnt", "burned"] },
          { q: "3. the pieces are then ___", answers: ["washed"] },
          { q: "4. the pieces are mixed with ___", answers: ["sand"] },
          { q: "5. uses about ___ per cent less energy", answers: ["30", "thirty"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án VI",
        items: [
          "**1 colour** — separated by colour — **not by size**, as many people think (size bị phủ định).",
          "**2 burnt** — don't need to be **removed by hand**; they are simply **burnt off** (removed bị gạt đi; ghi chú có sẵn “off”).",
          "**3 washed** — which are then **washed** (crushed đã in sẵn trong ghi chú).",
          "**4 sand** — mixed with **sand** and heated in a furnace.",
          "**5 30** — about **thirty** per cent less energy (fifteen hundred là nhiệt độ lò — số gây nhiễu).",
          "Cả đoạn là một quy trình ⇒ gần như mọi động từ đều ở **bị động hiện tại đơn** — đúng như Task 1 process.",
        ],
      },

      { t: "h", text: "VII. Phát âm: /ʃ/ · /ʒ/ · /tʃ/ (5 câu) — ôn bài Nghe mục 6" },
      {
        t: "mcq",
        id: "t3d13-bt-phat-am",
        title: "VII. Phần in HOA đọc là âm gì?",
        items: [
          { q: "deciSIon", options: ["/ʃ/", "/ʒ/", "/tʃ/", "/z/"], correct: 1, why: "Nguyên âm + sion ⇒ /ʒən/: /dɪˈsɪʒən/." },
          { q: "expanSIon", options: ["/ʃ/", "/ʒ/", "/tʃ/", "/z/"], correct: 0, why: "Phụ âm n + sion ⇒ /ʃən/: /ɪkˈspænʃən/." },
          { q: "queSTIon", options: ["/ʃ/", "/ʒ/", "/tʃ/", "/z/"], correct: 2, why: "Ngoại lệ -stion ⇒ /tʃən/: /ˈkwestʃən/." },
          { q: "meaSUre", options: ["/ʃ/", "/s/", "/tʃ/", "/ʒ/"], correct: 3, why: "-sure sau nguyên âm ⇒ /ʒə/: /ˈmeʒə/." },
          { q: "Từ nào có âm /ʒ/?", options: ["erosion", "discussion", "pollution", "pension"], correct: 0, why: "erosion /ɪˈrəʊʒən/ (nguyên âm + sion). Ba từ còn lại đọc /ʃən/." },
        ],
      },
    ],
  },
];
