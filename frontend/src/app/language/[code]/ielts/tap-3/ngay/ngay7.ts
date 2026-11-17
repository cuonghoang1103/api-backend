/**
 * IELTS Tập 3 — Ngày 7 (band 5.0 → 6.0).
 * Bài 1 ngữ pháp: verb patterns nâng cao + tính từ -ed / -ing (ôn G15 · G05 — nối Tập 2 Ngày 11 và Tập 1 Ngày 7; Tập 2 Ngày 9 chỉ nhắc so sánh more bored).
 * Bài 2 đọc: Short-answer questions 2 + văn bản khoa học tự nhiên (R09 · R21 — nối Tập 2 Ngày 8).
 * Bài 3 nói: Part 2 Describe a person vòng 2 — người có ảnh hưởng, ngân hàng tính cách band 6 (S05 — nối Tập 2 Ngày 3);
 *   phát âm: trọng âm theo hậu tố -tion / -ic / -ity (S12).
 * Mọi bài đọc, câu ví dụ, bài nói mẫu đều tự soạn; số liệu khoa học là kiến thức phổ thông.
 */
import type { Lesson } from '../data';

export const NGAY_7: Lesson[] = [
  /* ═══════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════ */
  {
    id: "t3d7-ngu-phap",
    kind: "grammar",
    title: "Verb patterns nâng cao + tính từ -ed / -ing",
    goal: "Chọn đúng V-ing / to V / V nguyên mẫu sau 60 động từ, danh từ và giới từ hay gặp trong bài thi, dùng được dạng bị động và hoàn thành của chúng, và không còn nhầm bored / boring.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "**Ôn từ Tập 2 Ngày 11**: 40 động từ + V-ing / to V và cặp đổi nghĩa remember / forget / regret / stop / try. Hôm nay nâng lên band 6: thêm **go on, mean, need** và dùng cả nhóm **đổi nghĩa** trong câu học thuật.",
          "**Động từ + tân ngữ + to V** (enable, encourage, require…) — xương sống của câu nguyên nhân – kết quả trong Task 2; và **make / let / have + V**.",
          "Dạng **bị động và hoàn thành**: to be done · being done · to have done; cấu trúc **is said / expected to V**.",
          "**Giới từ + V-ing**, kể cả chữ **to là giới từ** (look forward to, be committed to, contribute to + V-ing).",
          "**Tính từ -ed / -ing** (ôn Tập 1 Ngày 7): -ed = người cảm thấy, -ing = thứ gây ra cảm giác; phân từ làm tính từ cho Task 1 (rising prices, increased demand).",
          "Đẩy tiêu chí **GRA** (trộn câu đơn + phức, lỗi hiếm khi làm sai nghĩa) ở cả Writing lẫn Speaking.",
        ],
      },

      { t: "h", text: "1. Ôn nhanh: 4 khuôn đã học ở Tập 2" },
      { t: "p", text: "**Verb pattern** (khuôn động từ) là quy tắc: sau một động từ, động từ thứ hai phải ở dạng nào. Tiếng Việt nói “thích bơi”, “muốn bơi”, “bắt nó bơi” — động từ sau không đổi dạng. Tiếng Anh thì mỗi động từ đứng trước **đòi** một dạng riêng. Tập 2 Ngày 11 đã dạy 4 khuôn dưới đây; nếu bảng này còn lạ, mở lại Tập 2 Ngày 11 trước." },
      {
        t: "table",
        head: ["Khuôn", "Động từ tiêu biểu", "Ví dụ"],
        rows: [
          ["V + **V-ing**", "enjoy, avoid, consider, suggest, finish, keep, mind, practise, risk, delay, deny, admit, involve, postpone", "Many people **avoid using** public transport."],
          ["V + **to V**", "want, decide, hope, plan, agree, refuse, manage, afford, promise, tend, fail, aim, attempt, seem, appear", "Prices **tend to rise** in summer."],
          ["V + tân ngữ + **to V**", "want, ask, tell, allow, advise, encourage, expect, teach", "Parents **encourage children to read**."],
          ["V + tân ngữ + **V** (không to)", "make, let", "Schools should **let students choose**."],
        ],
      },
      { t: "rule", formula: "V + V-ing · V + to V · V + O + to V · make / let + O + V", vi: "Bốn khuôn nền — mọi mục dưới đây là phần mở rộng của bốn khuôn này." },

      { t: "h", text: "2. Tám động từ đổi nghĩa theo dạng đứng sau" },
      { t: "p", text: "Với nhóm này, V-ing và to V **đều đúng ngữ pháp** nhưng **nghĩa khác nhau**. Mẹo chung: **V-ing nhìn về việc đã / đang có thật**; **to V nhìn về việc sẽ làm, cần làm**." },
      {
        t: "patterns",
        rows: [
          { formula: "remember / forget + V-ing", vi: "nhớ / quên một việc ĐÃ xảy ra (ký ức)", examples: [{ en: "I still remember meeting my first teacher.", vi: "Tôi vẫn nhớ lần gặp cô giáo đầu tiên." }, { en: "I'll never forget visiting Hue for the first time.", vi: "Tôi sẽ không bao giờ quên lần đầu thăm Huế." }] },
          { formula: "remember / forget + to V", vi: "nhớ / quên PHẢI làm một việc (nhiệm vụ)", examples: [{ en: "Remember to check your spelling before you submit.", vi: "Nhớ soát chính tả trước khi nộp." }, { en: "He forgot to attach the file.", vi: "Anh ấy quên đính kèm tệp." }] },
          { formula: "regret + V-ing", vi: "hối tiếc vì ĐÃ làm", examples: [{ en: "Many graduates regret choosing their degree too quickly.", vi: "Nhiều cử nhân hối tiếc vì đã chọn ngành quá vội." }] },
          { formula: "regret + to say / inform / announce", vi: "lấy làm tiếc PHẢI báo (thư trang trọng)", examples: [{ en: "We regret to inform you that the flight has been cancelled.", vi: "Chúng tôi rất tiếc phải báo rằng chuyến bay đã bị huỷ." }] },
          { formula: "stop + V-ing", vi: "ngừng hẳn việc đang làm", examples: [{ en: "The factory stopped using coal in 2015.", vi: "Nhà máy ngừng dùng than vào năm 2015." }] },
          { formula: "stop + to V", vi: "dừng lại ĐỂ làm việc khác", examples: [{ en: "We stopped to buy some water.", vi: "Chúng tôi dừng lại để mua nước." }] },
          { formula: "try + to V", vi: "cố gắng làm (việc khó)", examples: [{ en: "Governments are trying to reduce traffic congestion.", vi: "Các chính phủ đang cố gắng giảm tắc đường." }] },
          { formula: "try + V-ing", vi: "thử làm xem có hiệu quả không", examples: [{ en: "If you can't sleep, try reading a paper book.", vi: "Nếu không ngủ được, hãy thử đọc sách giấy." }] },
          { formula: "go on + V-ing", vi: "tiếp tục việc đang làm", examples: [{ en: "Prices went on rising throughout the decade.", vi: "Giá tiếp tục tăng suốt thập kỷ." }] },
          { formula: "go on + to V", vi: "làm tiếp một việc KHÁC (bước kế tiếp)", examples: [{ en: "She studied biology and went on to become a surgeon.", vi: "Cô ấy học sinh học rồi sau đó trở thành bác sĩ phẫu thuật." }] },
          { formula: "mean + to V", vi: "có ý định", examples: [{ en: "I meant to call you, but I ran out of time.", vi: "Tôi định gọi cho bạn nhưng hết thời gian." }] },
          { formula: "S (việc) + mean + V-ing", vi: "đồng nghĩa với việc, kéo theo việc", examples: [{ en: "Living in the suburbs means commuting for two hours a day.", vi: "Sống ở ngoại ô đồng nghĩa với việc đi lại hai tiếng mỗi ngày." }] },
          { formula: "S (vật) + need + V-ing", vi: "cần ĐƯỢC làm (= need to be V3)", examples: [{ en: "Many old bridges need repairing.", vi: "Nhiều cây cầu cũ cần được sửa." }] },
        ],
      },
      {
        t: "sodo", kind: "compare", title: "V-ing nhìn lại · to V nhìn tới",
        cols: [
          { title: "+ V-ing: việc ĐÃ / ĐANG có thật", items: ["remember **locking** the door — nhớ là đã khoá", "regret **saying** that — tiếc vì đã nói", "stop **smoking** — bỏ thuốc", "try **restarting** it — thử khởi động lại", "go on **talking** — nói tiếp"] },
          { title: "+ to V: việc SẼ / CẦN làm", items: ["remember **to lock** the door — nhớ phải khoá", "regret **to say** — tiếc phải nói", "stop **to smoke** — dừng lại để hút thuốc", "try **to restart** it — cố khởi động lại", "go on **to talk** about… — chuyển sang nói về…"] },
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai", items: ["~~I stopped to smoke last year.~~ (nghĩa thành “dừng lại để hút”) → I **stopped smoking** last year.", "~~Remember locking the door when you leave.~~ → **Remember to lock** the door when you leave. (việc chưa làm)", "~~The house needs to repair.~~ → The house **needs repairing** / **needs to be repaired**. (nhà không tự sửa)", "**go on to + V** rất hay trong Speaking Part 2 khi kể đời một người: He **went on to study** medicine. Đừng nhầm với go on + V-ing."] },
      { t: "rule", formula: "remember / forget / regret / stop / try / go on + V-ing (đã, đang) ≠ + to V (sẽ, cần, để)", vi: "V-ing nhìn lại việc có thật; to V nhìn tới việc phải làm hoặc mục đích." },
      {
        t: "quiz", id: "t3d7-vp-nghia-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "remember / regret / stop / go on / mean + V-ing hoặc to V",
        items: [
          { q: "Tôi vẫn nhớ lần đầu gặp ông ấy vào năm 2019.", answers: ["I still remember meeting him for the first time in 2019.", "I still remember first meeting him in 2019.", "I still remember meeting him in 2019 for the first time."], hint: "remember + V-ing · for the first time" },
          { q: "Nhiều người hối tiếc vì đã không học ngoại ngữ sớm hơn.", answers: ["Many people regret not learning a foreign language earlier.", "A lot of people regret not learning a foreign language earlier.", "Many people regret not having learned a foreign language earlier.", "Many people regret not having learnt a foreign language earlier."], hint: "regret + not + V-ing" },
          { q: "Thành phố đã ngừng xây đường mới vào năm 2020.", answers: ["The city stopped building new roads in 2020."], hint: "stop + V-ing" },
          { q: "Cô ấy học luật rồi sau đó trở thành thẩm phán.", answers: ["She studied law and went on to become a judge.", "She studied law and then went on to become a judge."], hint: "go on + to V · judge" },
          { q: "Làm việc ở nhà đồng nghĩa với việc tốn ít tiền đi lại hơn.", answers: ["Working from home means spending less money on travel.", "Working from home means spending less on travel.", "Working at home means spending less money on travel.", "Working from home means spending less money on commuting."], hint: "mean + V-ing · spend … on travel" },
        ],
      },
      {
        t: "mcq", id: "t3d7-vp-nghia-luyen", title: "Chọn dạng đúng theo NGHĨA (6 câu)",
        items: [
          { q: "I'm sure I locked the door. I clearly remember ___ the key.", options: ["to turn", "turning", "turn", "turned"], correct: 1, why: "Việc **đã** xảy ra (ký ức) → remember + **V-ing**." },
          { q: "Please remember ___ your passport tomorrow.", options: ["bringing", "bring", "to bring", "brought"], correct: 2, why: "Việc **chưa** làm, là nhiệm vụ → remember + **to V**." },
          { q: "After his speech on pollution, the minister went on ___ a new recycling scheme.", options: ["to announce", "announcing", "announce", "announced"], correct: 0, why: "Chuyển sang **việc khác kế tiếp** → go on + **to V**." },
          { q: "The windows are very dirty. They need ___.", options: ["to clean", "clean", "cleaned", "cleaning"], correct: 3, why: "Vật + need + **V-ing** = cần được làm (need to be cleaned)." },
          { q: "The medicine didn't help, so the doctor suggested I try ___ more water.", options: ["to drink", "drinking", "drink", "drank"], correct: 1, why: "**Thử** một cách xem có hiệu quả không → try + **V-ing**." },
          { q: "Accepting the job would mean ___ to another city.", options: ["to move", "move", "moving", "moved"], correct: 2, why: "mean = kéo theo việc → **V-ing**. (mean + to V = có ý định, chủ ngữ là người.)" },
        ],
      },

      { t: "h", text: "3. Động từ + tân ngữ + to V — và make / let / have / help" },
      { t: "p", text: "Đây là khuôn **ăn điểm nhất trong Task 2**: nó cho phép bạn viết “A khiến / giúp / buộc B làm gì” bằng một câu gọn, thay vì hai câu nối bằng because. **Tân ngữ** (object, viết tắt O) là người hoặc vật chịu tác động." },
      {
        t: "table",
        caption: "20 động từ + O + to V, xếp theo nghĩa",
        head: ["Nghĩa", "Động từ", "Ví dụ Task 2"],
        rows: [
          ["Cho phép, tạo điều kiện", "**allow · enable · permit**", "Online courses **enable students to study** at their own pace."],
          ["Khuyến khích, thuyết phục", "**encourage · persuade · motivate · inspire · urge**", "Lower fares would **encourage commuters to leave** their cars at home."],
          ["Buộc, yêu cầu", "**force · require · oblige · order**", "The law **requires companies to publish** their emissions."],
          ["Khiến (hệ quả)", "**cause · lead**", "Rising rents **lead young people to move** further from the centre."],
          ["Khuyên, nhắc, cảnh báo", "**advise · remind · warn** (O not to V)", "Doctors **warn patients not to rely** on online advice."],
          ["Mong đợi, dạy", "**expect · teach · train**", "Employers **expect graduates to work** in teams."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "make / let / have + O + V", vi: "bắt / cho phép / nhờ ai làm — KHÔNG có to", examples: [{ en: "Strict deadlines make employees work late.", vi: "Hạn chót gắt khiến nhân viên phải làm muộn." }, { en: "Some parents let their children use phones at dinner.", vi: "Một số phụ huynh cho con dùng điện thoại lúc ăn tối." }] },
          { formula: "help + O + (to) V", vi: "giúp ai làm — có to hay không đều đúng", examples: [{ en: "Part-time jobs help students (to) develop soft skills.", vi: "Việc làm thêm giúp sinh viên phát triển kỹ năng mềm." }] },
          { formula: "prevent / stop / discourage / ban + O + from + V-ing", vi: "ngăn / cấm ai làm gì", examples: [{ en: "High prices prevent many families from buying a home.", vi: "Giá cao khiến nhiều gia đình không mua được nhà." }, { en: "The city banned lorries from entering the centre.", vi: "Thành phố cấm xe tải vào trung tâm." }] },
          { formula: "see / hear / watch / notice + O + V", vi: "chứng kiến TRỌN hành động", examples: [{ en: "I watched her give the whole presentation.", vi: "Tôi xem cô ấy thuyết trình từ đầu đến cuối." }] },
          { formula: "see / hear / watch / notice + O + V-ing", vi: "bắt gặp hành động ĐANG diễn ra", examples: [{ en: "I often see him helping new students.", vi: "Tôi hay thấy anh ấy đang giúp sinh viên mới." }] },
          { formula: "suggest / recommend + V-ing · suggest (that) + S + (should) + V", vi: "đề nghị — KHÔNG dùng suggest + O + to V", examples: [{ en: "Experts recommend reducing sugar.", vi: "Chuyên gia khuyên giảm đường." }, { en: "I would suggest that the council build more cycle lanes.", vi: "Tôi đề nghị hội đồng thành phố xây thêm làn xe đạp." }] },
        ],
      },
      { t: "note", title: "⚠️ Bốn lỗi sai kinh điển của người Việt", items: ["~~My parents made me to study medicine.~~ → My parents **made me study** medicine. (make + O + V, không to)", "~~The teacher suggested me to read more.~~ → The teacher **suggested (that) I read** more / **suggested reading** more. (suggest không nhận “O + to V”; nhưng **advised me to read** thì đúng)", "~~Technology helps people working faster.~~ → helps people **(to) work** faster.", "~~It prevents people to buy houses.~~ → prevents people **from buying** houses.", "Ở **bị động**, make lấy lại chữ to: I **was made to study** medicine. Còn let không có bị động — dùng **was allowed to**."] },
      { t: "rule", formula: "S + enable / encourage / require / lead + O + to V · make / let + O + V · prevent + O + from + V-ing", vi: "Ba khuôn “A tác động lên B” — dùng cho câu nguyên nhân, kết quả, giải pháp trong Task 2 và Part 3." },
      {
        t: "quiz", id: "t3d7-vp-tan-ngu-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "V + O + to V · make / let + O + V · prevent + O + from + V-ing",
        items: [
          { q: "Internet cho phép mọi người làm việc từ bất cứ đâu.", answers: ["The internet enables people to work from anywhere.", "The internet allows people to work from anywhere.", "The Internet enables people to work from anywhere.", "The Internet allows people to work from anywhere."], hint: "enable / allow + O + to V" },
          { q: "Chính phủ nên khuyến khích người dân dùng phương tiện công cộng.", answers: ["The government should encourage people to use public transport.", "Governments should encourage people to use public transport.", "The government should encourage citizens to use public transport."], hint: "encourage + O + to V" },
          { q: "Bố mẹ bắt tôi tập piano mỗi ngày.", answers: ["My parents made me practise the piano every day.", "My parents made me practice the piano every day.", "My parents made me practise piano every day.", "My parents made me practice piano every day."], hint: "make + O + V (không to)" },
          { q: "Tiếng ồn khiến nhiều cư dân không ngủ được.", answers: ["The noise prevents many residents from sleeping.", "Noise prevents many residents from sleeping.", "The noise stops many residents from sleeping.", "Noise stops many residents from sleeping."], hint: "prevent + O + from + V-ing · residents" },
          { q: "Cô giáo đề nghị chúng tôi làm việc theo cặp.", answers: ["The teacher suggested that we work in pairs.", "The teacher suggested we work in pairs.", "The teacher suggested that we should work in pairs.", "The teacher suggested working in pairs.", "Our teacher suggested that we work in pairs.", "Our teacher suggested working in pairs."], hint: "suggest (that) + S + V · in pairs" },
        ],
      },
      {
        t: "quiz", id: "t3d7-vp-tan-ngu-luyen", title: "Viết dạng đúng của động từ trong ngoặc (8 câu)", kind: "fill",
        items: [
          { q: "Scholarships enable poorer students ___ (go) to university.", answers: ["to go"] },
          { q: "The new manager lets staff ___ (leave) early on Fridays.", answers: ["leave"] },
          { q: "Heavy traffic discourages people from ___ (cycle) to work.", answers: ["cycling"] },
          { q: "The rise in rents has forced many shops ___ (close).", answers: ["to close"] },
          { q: "In the past, pupils were made ___ (stand) when a teacher came in.", answers: ["to stand"] },
          { q: "A good teacher makes a difficult subject ___ (seem) easy.", answers: ["seem"] },
          { q: "Doctors advise adults ___ (not / eat) too much salt.", answers: ["not to eat"] },
          { q: "As I walked past, I noticed two men ___ (repair) the roof. (đang sửa)", answers: ["repairing"] },
        ],
      },

      { t: "h", text: "4. Dạng bị động và hoàn thành: to be done · being done · to have done" },
      { t: "p", text: "Ở band 5 bạn chỉ dùng to do / doing. Band 6 cần thêm ba dạng nữa để nói **“được làm”** (bị động) và **“đã làm trước đó”** (hoàn thành). **V3** là cột ba của động từ (done, written, seen)." },
      {
        t: "table",
        head: ["Dạng", "Công thức", "Nghĩa", "Ví dụ"],
        rows: [
          ["to V bị động", "**to be + V3**", "được làm", "Students expect **to be treated** fairly."],
          ["V-ing bị động", "**being + V3**", "(việc) bị / được làm", "Most people dislike **being criticised** in public."],
          ["to V hoàn thành", "**to have + V3**", "đã làm (trước đó)", "The number seems **to have doubled** since 2010."],
          ["V-ing hoàn thành", "**having + V3**", "(việc) đã làm trước đó", "He admitted **having copied** the essay."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + is / are + said / believed / thought / known / reported / expected + to V", vi: "Người ta nói / tin / cho rằng S… (hiện tại hoặc tương lai)", examples: [{ en: "Finland is said to have one of the best school systems.", vi: "Người ta nói Phần Lan có một trong những hệ thống trường học tốt nhất." }, { en: "The population is expected to reach ten million by 2040.", vi: "Dân số được dự báo đạt mười triệu vào năm 2040." }] },
          { formula: "S + is / are + said / believed / thought + to have + V3", vi: "Người ta cho rằng S ĐÃ… (việc trong quá khứ)", examples: [{ en: "The temple is believed to have been built in the eleventh century.", vi: "Ngôi đền được cho là đã được xây vào thế kỷ 11." }] },
        ],
      },
      { t: "note", title: "📌 Vì sao đáng học", items: ["**is expected / projected to + V** là câu dự báo của Task 1 (Tập 2 Ngày 4, Tập 3 Ngày 5) — bạn sẽ dùng lại ngay ở Ngày 8.", "**is said / believed to…** giúp bạn nêu ý “người ta cho rằng” mà không lặp People say that… — đây là cách viết khách quan của văn học thuật.", "~~Children enjoy to be praised.~~ → Children enjoy **being praised**. (enjoy + V-ing, và trẻ **được** khen nên phải bị động)"] },
      { t: "rule", formula: "V + to be V3 / being V3 · seem + to have V3 · S + is said / expected + to V", vi: "Chọn to V hay V-ing theo động từ đứng trước, rồi mới thêm be + V3 (bị động) hoặc have + V3 (đã xảy ra)." },
      {
        t: "quiz", id: "t3d7-vp-dang-dich", title: "Dịch Việt → Anh (4 câu)", kind: "translate", grammar: "to be V3 · being V3 · is said / expected to V",
        items: [
          { q: "Không ai thích bị phớt lờ.", answers: ["Nobody likes being ignored.", "No one likes being ignored.", "Nobody likes to be ignored.", "No one likes to be ignored."], hint: "like + being + V3 · ignore" },
          { q: "Nhân viên muốn được trả lương công bằng.", answers: ["Employees want to be paid fairly.", "Workers want to be paid fairly.", "Staff want to be paid fairly."], hint: "want + to be + V3" },
          { q: "Người ta nói Nhật Bản có tuổi thọ cao nhất thế giới.", answers: ["Japan is said to have the highest life expectancy in the world.", "Japan is said to have the world's highest life expectancy."], hint: "is said to + V · life expectancy" },
          { q: "Giá nhà được dự báo sẽ tăng 5% vào năm tới.", answers: ["House prices are expected to rise by 5% next year.", "House prices are expected to increase by 5% next year.", "House prices are projected to rise by 5% next year.", "House prices are expected to rise by 5 percent next year.", "House prices are expected to rise by 5 per cent next year."], hint: "are expected to + V · by 5%" },
        ],
      },
      {
        t: "quiz", id: "t3d7-vp-dang-luyen", title: "Viết dạng đúng (6 câu)", kind: "fill",
        items: [
          { q: "Young children need ___ (protect) from online dangers.", answers: ["to be protected", "protecting"] },
          { q: "He avoided ___ (ask) difficult questions by leaving early. (bị hỏi)", answers: ["being asked"] },
          { q: "The company appears ___ (lose) a lot of money last year.", answers: ["to have lost"] },
          { q: "The first tools are thought ___ (make) over two million years ago.", answers: ["to have been made"] },
          { q: "The new airport is expected ___ (open) in 2030.", answers: ["to open", "to be opened"] },
          { q: "I don't mind ___ (tell) what to do if the reason is clear. (bị bảo)", answers: ["being told"] },
        ],
      },

      { t: "h", text: "5. Giới từ + V-ing — kể cả khi giới từ là chữ “to”" },
      { t: "p", text: "Quy tắc nền (Tập 2 Ngày 11): **sau giới từ, động từ luôn là V-ing**. Chỗ band 6 hay ngã là chữ **to**: có lúc nó là một phần của to V (want **to go**), có lúc nó là **giới từ** (look forward **to going**). Cách thử: thay động từ bằng một danh từ. Nói được “look forward to **the trip**” ⇒ to là giới từ ⇒ dùng V-ing. Không nói được “want to the trip” ⇒ to V." },
      {
        t: "table",
        caption: "to là GIỚI TỪ ⇒ + V-ing (8 cụm phải thuộc)",
        head: ["Cụm", "Nghĩa", "Ví dụ"],
        rows: [
          ["look forward to", "mong chờ", "I look forward to **hearing** from you."],
          ["be / get used to", "quen với", "City residents are used to **living** with noise."],
          ["be committed / dedicated to", "cam kết, tận tâm với", "She is committed to **helping** poorer students."],
          ["contribute to", "góp phần vào", "Fast food contributes to **rising** obesity rates."],
          ["object to", "phản đối", "Many residents object to **paying** higher taxes."],
          ["in addition to", "ngoài việc", "In addition to **teaching**, he runs a charity."],
          ["with a view to", "nhằm", "The road was closed with a view to **reducing** pollution."],
          ["when it comes to", "khi nói tới việc", "When it comes to **choosing** a career, salary is not everything."],
        ],
      },
      {
        t: "table",
        caption: "Danh từ / tính từ / cụm cố định — nhớ theo cặp",
        head: ["+ to V", "+ giới từ + V-ing", "Cụm cố định + V-ing"],
        rows: [
          ["the **ability / chance / opportunity / right** to V", "**difficulty (in)** V-ing · the **risk / possibility / advantage / way** of V-ing", "**It is (not) worth** V-ing"],
          ["a **decision / attempt / effort / tendency** to V", "an **interest in** V-ing · a **reason for** V-ing", "**There is no point (in)** V-ing"],
          ["a **need / failure / refusal** to V", "**capable of** · **responsible for** · **keen on** · **good at** V-ing", "**spend / waste** time V-ing"],
          ["be **likely / willing / able / reluctant** to V", "**succeed in** · **insist on** · **depend on** · **concentrate on** V-ing", "**have trouble / difficulty** V-ing · **can't help** V-ing"],
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận ba cặp dễ nhầm", items: ["**used to + V** (ngày trước thường làm — Tập 2 Ngày 21) ≠ **be used to + V-ing** (đã quen với): I **used to live** alone. / I **am used to living** alone.", "~~I look forward to hear from you.~~ → I look forward to **hearing** from you. (câu kết thư phải đúng)", "~~Students have difficulty to find a job.~~ → have difficulty **(in) finding** a job. Nhưng: it is **difficult to find** a job.", "~~She succeeded to pass.~~ → She **succeeded in passing** / **managed to pass**."] },
      { t: "rule", formula: "giới từ (in / on / of / for / to…) + V-ing · danh từ khả năng / cơ hội + to V", vi: "Thử thay bằng danh từ: thay được ⇒ to là giới từ ⇒ V-ing." },
      {
        t: "quiz", id: "t3d7-vp-gioi-tu-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "giới từ + V-ing · danh từ + to V · It is worth V-ing",
        items: [
          { q: "Tôi đã quen với việc dậy sớm.", answers: ["I am used to getting up early.", "I'm used to getting up early.", "I am used to waking up early.", "I'm used to waking up early."], hint: "be used to + V-ing" },
          { q: "Hút thuốc góp phần làm tăng chi phí y tế.", answers: ["Smoking contributes to increasing healthcare costs.", "Smoking contributes to rising healthcare costs.", "Smoking contributes to increasing health care costs.", "Smoking contributes to raising healthcare costs.", "Smoking contributes to increasing medical costs."], hint: "contribute to + V-ing · healthcare costs" },
          { q: "Nhiều sinh viên gặp khó khăn trong việc tìm chỗ ở giá phải chăng.", answers: ["Many students have difficulty finding affordable accommodation.", "Many students have difficulty in finding affordable accommodation.", "Many students have trouble finding affordable accommodation."], hint: "have difficulty (in) + V-ing · affordable accommodation" },
          { q: "Rất đáng để dành thời gian đọc đề cẩn thận.", answers: ["It is worth spending time reading the question carefully.", "It's worth spending time reading the question carefully.", "It is worth taking time to read the question carefully.", "It's worth taking time to read the question carefully."], hint: "It is worth + V-ing · spend time + V-ing" },
          { q: "Mọi người đều có quyền bày tỏ ý kiến của mình.", answers: ["Everyone has the right to express their opinion.", "Everyone has the right to express their opinions.", "Everybody has the right to express their opinion.", "Everyone has the right to express his or her opinion."], hint: "the right + to V · express" },
        ],
      },
      {
        t: "mcq", id: "t3d7-vp-gioi-tu-luyen", title: "Chọn đáp án đúng (6 câu)",
        items: [
          { q: "The charity is dedicated to ___ homeless people find work.", options: ["help", "helping", "helped", "be helping"], correct: 1, why: "dedicated **to** — to là giới từ (dedicated to this cause) → **V-ing**." },
          { q: "My grandfather ___ walk five kilometres to school every day.", options: ["was used to", "is used to", "used to", "got used to"], correct: 2, why: "Sau chỗ trống là **walk** (nguyên mẫu) → **used to + V** = ngày trước thường. be used to phải + walking." },
          { q: "There is no point ___ a law that nobody will obey.", options: ["to pass", "pass", "of pass", "in passing"], correct: 3, why: "Cụm cố định: There is no point **(in) + V-ing**." },
          { q: "Cities need to give residents the opportunity ___ in green spaces.", options: ["to relax", "of relax", "relaxing", "for relax"], correct: 0, why: "the opportunity **to V** (cũng có: the opportunity of relaxing, nhưng “of relax” sai)." },
          { q: "The team succeeded ___ the cost of the project by a third.", options: ["to reduce", "in reducing", "reducing", "for reducing"], correct: 1, why: "succeed **in + V-ing**. (manage **to reduce** mới dùng to V.)" },
          { q: "When it comes to ___ a flat, location matters more than size.", options: ["rent", "rented", "renting", "be rented"], correct: 2, why: "when it comes **to** — giới từ → **V-ing**." },
        ],
      },

      { t: "h", text: "6. Tính từ -ed / -ing (ôn Tập 1 Ngày 7, nâng lên band 6)" },
      { t: "p", text: "Nhiều tính từ chỉ cảm xúc đi theo cặp. **-ed** nói **ai cảm thấy thế nào** (thường là người). **-ing** nói **cái gì gây ra** cảm giác đó (việc, vật, hoặc người gây ra cảm giác cho người khác)." },
      {
        t: "sodo", kind: "compare", title: "-ed = người cảm thấy · -ing = thứ gây ra",
        cols: [
          { title: "-ed: CẢM THẤY", items: ["I am **bored**. — Tôi (thấy) chán.", "She was **confused** by the map.", "We were **disappointed** with the result.", "Voters feel **frustrated**."] },
          { title: "-ing: GÂY RA cảm giác", items: ["The lecture is **boring**. — Bài giảng (gây) chán.", "The map was **confusing**.", "The result was **disappointing**.", "The delays are **frustrating**."] },
        ],
      },
      {
        t: "table",
        caption: "18 cặp band 6 + giới từ đi sau dạng -ed",
        head: ["-ed (+ giới từ)", "-ing", "Nghĩa"],
        rows: [
          ["interested **in**", "interesting", "hứng thú / thú vị"],
          ["bored **with**", "boring", "chán"],
          ["excited **about**", "exciting", "háo hức / gây háo hức"],
          ["worried **about**", "worrying", "lo lắng / đáng lo"],
          ["surprised **at / by**", "surprising", "ngạc nhiên / đáng ngạc nhiên"],
          ["disappointed **with / by**", "disappointing", "thất vọng / đáng thất vọng"],
          ["satisfied **with**", "satisfying", "hài lòng / đem lại sự thoả mãn"],
          ["confused **about / by**", "confusing", "bối rối / khó hiểu"],
          ["frustrated **with / by**", "frustrating", "bực bội / gây bực"],
          ["exhausted **by / from**", "exhausting", "kiệt sức / làm kiệt sức"],
          ["embarrassed **about / by**", "embarrassing", "ngượng / gây ngượng"],
          ["impressed **by / with**", "impressive (không có “impressing”)", "ấn tượng / gây ấn tượng"],
          ["inspired **by**", "inspiring", "được truyền cảm hứng / truyền cảm hứng"],
          ["motivated **by**", "motivating", "có động lực / tạo động lực"],
          ["overwhelmed **by**", "overwhelming", "choáng ngợp / áp đảo"],
          ["fascinated **by**", "fascinating", "bị cuốn hút / rất cuốn hút"],
          ["annoyed **with** (người) / **about** (việc)", "annoying", "bực mình / gây bực mình"],
          ["stressed **about**", "stressful (không dùng “stressing”)", "căng thẳng / gây căng thẳng"],
        ],
      },
      { t: "note", title: "⚠️ Lỗi làm sai nghĩa — giám khảo nghe là biết band 5", items: ["~~I am very boring in this class.~~ (= tôi là người nhạt nhẽo!) → I am very **bored** in this class.", "~~I am interesting in history.~~ → I am **interested in** history.", "~~The film was very excited.~~ → The film was very **exciting**. (phim không có cảm xúc)", "~~My job is stressed.~~ → My job is **stressful**. / I feel **stressed**.", "Người cũng có thể nhận **-ing** khi họ **gây ra** cảm giác: My teacher is **inspiring** (cô truyền cảm hứng cho người khác) — I feel **inspired** (tôi được truyền cảm hứng). Bạn sẽ dùng cặp này ở bài Nói hôm nay."] },
      { t: "p", text: "**Phân từ làm tính từ trước danh từ — rất cần cho Task 1 và Task 2.** V-ing = **đang** diễn ra, chủ động; V3 = **đã** xong hoặc **bị** tác động." },
      {
        t: "table",
        head: ["V-ing + N (đang, chủ động)", "V3 + N (đã, bị động)"],
        rows: [
          ["**rising** prices — giá đang tăng", "**increased** demand — nhu cầu đã tăng lên"],
          ["a **growing** number of people — ngày càng nhiều người", "**reduced** costs — chi phí đã được giảm"],
          ["an **ageing** population — dân số đang già đi", "**improved** living standards — mức sống đã cải thiện"],
          ["**developing** countries — nước đang phát triển", "**developed** countries — nước đã phát triển"],
          ["**falling** birth rates — tỉ lệ sinh đang giảm", "**limited** resources — nguồn lực có hạn"],
          ["a **time-consuming** process — quy trình tốn thời gian", "a **well-paid** job · **highly skilled** workers"],
        ],
      },
      { t: "rule", formula: "S (người) + be + adj-ed + giới từ + N · S (việc / vật) + be + adj-ing · V-ing / V3 + N", vi: "-ed: cảm thấy; -ing: gây ra. Trước danh từ: V-ing = đang, V3 = đã / bị." },
      {
        t: "quiz", id: "t3d7-ed-ing-dich", title: "Dịch Việt → Anh (5 câu)", kind: "translate", grammar: "adj-ed + giới từ · adj-ing · V-ing / V3 + N",
        items: [
          { q: "Nhiều người trẻ lo lắng về chi phí nhà ở đang tăng.", answers: ["Many young people are worried about rising housing costs.", "Many young people are worried about the rising cost of housing.", "Many young people are worried about the rising housing costs.", "Many young people are worried about increasing housing costs."], hint: "worried about · rising + N" },
          { q: "Kết quả cuộc khảo sát thật đáng ngạc nhiên.", answers: ["The results of the survey were surprising.", "The survey results were surprising.", "The result of the survey was surprising.", "The results of the survey are surprising.", "The survey results are surprising."], hint: "surprising (kết quả gây ngạc nhiên)" },
          { q: "Tôi rất ấn tượng bởi sự kiên nhẫn của cô ấy.", answers: ["I was very impressed by her patience.", "I am very impressed by her patience.", "I was very impressed with her patience.", "I was really impressed by her patience.", "I'm very impressed by her patience."], hint: "impressed by · patience" },
          { q: "Làm ca đêm rất mệt mỏi (làm kiệt sức).", answers: ["Working night shifts is exhausting.", "Working the night shift is exhausting.", "Working night shifts is very exhausting.", "Working at night is exhausting."], hint: "V-ing làm chủ ngữ · exhausting" },
          { q: "Ngày càng nhiều người đang chuyển về các thành phố lớn.", answers: ["A growing number of people are moving to big cities.", "A growing number of people are moving to large cities.", "An increasing number of people are moving to big cities.", "A growing number of people are moving to major cities."], hint: "a growing number of + N số nhiều + are" },
        ],
      },
      {
        t: "quiz", id: "t3d7-ed-ing-luyen", title: "-ed hay -ing? Viết dạng đúng của từ trong ngoặc (8 câu)", kind: "fill",
        items: [
          { q: "Commuters are ___ (frustrate) with the constant delays.", answers: ["frustrated"] },
          { q: "The instructions were so ___ (confuse) that nobody could follow them.", answers: ["confusing"] },
          { q: "Her life story is truly ___ (inspire).", answers: ["inspiring"] },
          { q: "I felt ___ (embarrass) when I forgot his name.", answers: ["embarrassed"] },
          { q: "The ___ (age) population puts pressure on hospitals.", answers: ["ageing", "aging"] },
          { q: "There is ___ (increase) demand for flats near the centre. (đã tăng lên)", answers: ["increased"] },
          { q: "It was a ___ (disappoint) result for the home team.", answers: ["disappointing"] },
          { q: "New employees often feel ___ (overwhelm) by the amount of information.", answers: ["overwhelmed"] },
        ],
      },

      { t: "h", text: "7. Dùng trong bài thi: band 5 → band 6" },
      {
        t: "table",
        head: ["Band 5 (hai câu rời, lặp because)", "Band 6 (một câu, đúng verb pattern)"],
        rows: [
          ["People use cars less. Because the government makes petrol expensive.", "Higher petrol taxes **discourage people from using** their cars."],
          ["Students can study at home because of the internet.", "The internet **enables students to study** from home."],
          ["Many people think Singapore is very clean.", "Singapore **is said to be** one of the cleanest cities in Asia."],
          ["I like my teacher. She make me to love English.", "My teacher **made me fall** in love with English; she **encouraged me to read** in English every day."],
          ["Live in a big city is very stress.", "**Living** in a big city can be **stressful**, and many residents feel **exhausted** by the daily commute."],
        ],
      },
      { t: "note", title: "💡 Mẹo tự soát 30 giây cuối bài viết", items: ["Tìm mọi chữ **to** trong bài: đứng sau look forward / used / contribute / addition / committed thì động từ sau phải là **V-ing**.", "Tìm **make / let / help**: sau tân ngữ không có to (make them **work**).", "Tìm **suggest / recommend**: không có “suggest + người + to V”.", "Tìm tính từ cảm xúc: chủ ngữ là **người cảm thấy** ⇒ -ed; là **việc / vật** ⇒ -ing."] },
      {
        t: "mcq", id: "t3d7-vp-tong-luyen", title: "Tìm câu ĐÚNG ngữ pháp (5 câu)",
        items: [
          { q: "Câu nào đúng?", options: ["The new law makes drivers to pay a daily charge.", "The new law requires drivers to pay a daily charge.", "The new law requires drivers paying a daily charge.", "The new law makes drivers paying a daily charge."], correct: 1, why: "**require + O + to V**. make + O + V (không to, không -ing)." },
          { q: "Câu nào đúng?", options: ["I am looking forward to start my new job.", "I am interesting in starting my new job.", "I am excited about starting my new job.", "I am exciting to start my new job."], correct: 2, why: "Người cảm thấy → **excited**; about + **V-ing**. look forward to + **starting**; **interested** in." },
          { q: "Câu nào đúng?", options: ["Free museums encourage families to visit more often.", "Free museums encourage families visiting more often.", "Free museums encourage families visit more often.", "Free museums encourage that families visit more often."], correct: 0, why: "**encourage + O + to V**." },
          { q: "Câu nào đúng?", options: ["The castle is believed to build in 1350.", "The castle is believed building in 1350.", "The castle believes to have been built in 1350.", "The castle is believed to have been built in 1350."], correct: 3, why: "Việc **đã** xảy ra + lâu đài **được** xây → **is believed to have been built**." },
          { q: "Câu nào đúng?", options: ["Expensive tickets stop many fans to attend matches.", "Expensive tickets stop many fans from attending matches.", "Expensive tickets stop many fans attend matches.", "Expensive tickets stop many fans of attending matches."], correct: 1, why: "**stop / prevent + O + from + V-ing**." },
        ],
      },
    ],
  },

  /* ═══════════════════════ BÀI 2 — ĐỌC ═══════════════════════ */
  {
    id: "t3d7-doc",
    kind: "reading",
    title: "Short-answer questions 2 + đọc văn bản khoa học tự nhiên",
    goal: "Làm đúng ít nhất 9/13 câu Short-answer trên một bài khoa học tự nhiên 800 từ trong 18 phút: xác định loại đáp án từ từ hỏi, lấy đúng chữ trong bài, không vượt giới hạn từ.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        items: [
          "**Ôn từ Tập 2 Ngày 8**: Short-answer = trả lời câu hỏi Wh- bằng **chữ lấy nguyên từ bài**, trong giới hạn số từ; câu hỏi đi **theo thứ tự bài**.",
          "Lên band 6: bài dài **800 từ**, câu hỏi **paraphrase mạnh hơn**, và trong câu chứa đáp án thường có **hai ứng viên** (hai con số, hai danh từ) — phải đọc kỹ từ hỏi.",
          "**Từ hỏi quyết định loại đáp án**: What proportion → tỉ lệ; Which gas → tên chất khí; In which year → năm.",
          "**Văn bản khoa học tự nhiên** (R21): thuật ngữ lạ luôn **được giải nghĩa ngay trong bài** — học 5 tín hiệu định nghĩa để không hoảng.",
          "Dạng này đếm vào **điểm thô Reading** (band 6 ≈ 23/40). Short-answer là dạng “dễ ăn” nếu bạn không viết thừa từ.",
        ],
      },

      { t: "h", text: "1. Short-answer ở band 6 khác band 5 chỗ nào?" },
      { t: "p", text: "Đề ghi, ví dụ: Answer the questions below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer. Nghĩa là: tối đa **hai từ**, có thể kèm (hoặc chỉ gồm) **một con số**; chữ phải **có trong bài**, không tự đổi dạng từ, không tự nghĩ ra từ đồng nghĩa." },
      {
        t: "table",
        head: ["Điểm", "Tập 2 Ngày 8 (band 5)", "Hôm nay (band 6)"],
        rows: [
          ["Độ dài bài", "450–550 từ", "**800–900 từ**, 7 đoạn"],
          ["Từ khoá trong câu hỏi", "thường lặp lại y nguyên trong bài", "**paraphrase** gần hết; chỉ tên riêng và con số còn nguyên"],
          ["Câu chứa đáp án", "một ứng viên", "**hai ứng viên** cùng loại (200 metres / 1,000 metres) — một cái là bẫy"],
          ["Thuật ngữ", "từ đời thường", "thuật ngữ khoa học, **có định nghĩa kèm** trong bài"],
          ["Thời gian", "không tính giờ", "**18 phút cho 13 câu** (≈ 1 phút 20 giây / câu)"],
        ],
      },
      {
        t: "table",
        caption: "Từ hỏi → loại đáp án phải tìm (đoán TRƯỚC khi đọc bài)",
        head: ["Câu hỏi bắt đầu bằng", "Đáp án là", "Ví dụ đáp án"],
        rows: [
          ["**Who** / Which scientist", "tên người, nghề, nhóm người", "Raphaël Dubois · local farmers"],
          ["**When** / In which year / decade", "năm, thập kỷ, thời điểm", "2008 · the 1880s"],
          ["**Where** / In which country", "nơi chốn", "California · the surface"],
          ["**How many / much / far / long / deep**", "con số (+ đơn vị)", "40 · 1,000 metres · seventeen years"],
          ["**What proportion / percentage**", "tỉ lệ, phân số", "90 per cent · three-quarters"],
          ["**What / Which + danh từ** (gas, colour, animal…)", "một tên thuộc đúng loại danh từ đó", "oxygen · red · jellyfish"],
          ["**What** (đứng một mình)", "danh từ / cụm danh từ — đọc động từ của câu hỏi để biết là vật, chất hay hiện tượng", "glowing fluid · heat"],
          ["**Why** (hiếm)", "cụm danh từ chỉ lý do", "lack of funding"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "5 bước làm Short-answer",
        steps: [
          { label: "1 · Đọc đề: giới hạn từ", sub: "Khoanh NO MORE THAN … WORDS AND/OR A NUMBER" },
          { label: "2 · Đọc câu hỏi: gạch từ hỏi + từ khoá", sub: "Ghi bên lề loại đáp án: số? chất? người? năm?" },
          { label: "3 · Quét bài tìm vùng", sub: "Tên riêng, số, chữ in nghiêng không đổi; còn lại tìm theo NGHĨA" },
          { label: "4 · Đọc kỹ 2–3 câu quanh đó", sub: "Có hai ứng viên? Đối chiếu lại từ hỏi và điều kiện (at least, no … at all, first)" },
          { label: "5 · Chép đúng chữ, đếm từ", sub: "Bỏ a / the nếu thừa; kiểm chính tả, số ít / số nhiều" },
        ],
        caption: "Câu hỏi theo thứ tự bài ⇒ đáp án câu 5 nằm giữa đáp án câu 4 và câu 6.",
      },
      { t: "note", title: "⚠️ Sáu cách mất điểm oan (đã đúng ý mà vẫn sai)", items: ["**Vượt số từ**: đề cho TWO WORDS mà viết “a cloud of glowing fluid” (5 từ) → sai. Viết **glowing fluid**.", "**Đổi dạng từ**: bài viết heat, bạn viết “heating” hay “hot” → rủi ro. Chép nguyên chữ trong bài.", "**Tự dịch ý**: bài viết video footage, bạn viết “films” → sai, vì đề yêu cầu chữ **from the passage**.", "**Sai chính tả** khi chép (silhouette, bacteria) → sai. Nhìn lại từng chữ cái.", "**Thiếu đơn vị** khi câu hỏi không nêu sẵn: Below what depth…? → **1,000 metres**; chỉ ghi “1,000” thường vẫn được nhưng ghi đủ là an toàn nhất.", "**Lấy ứng viên đầu tiên nhìn thấy**: thấy “200 metres” là chép ngay, không đọc tiếp tới “1,000 metres”."] },
      { t: "p", text: "**Một từ là gì?** Số viết bằng chữ số (1,000 · 2008 · 90) tính là **một số**, không tính vào số từ. Từ có gạch nối (blue-green, light-producing) tính **một từ**. “90 per cent” = một số + hai từ ⇒ hợp lệ với TWO WORDS AND/OR A NUMBER; viết “90%” cũng đúng." },
      { t: "rule", formula: "Từ hỏi → loại đáp án → quét vùng → đọc kỹ 2–3 câu → chép nguyên chữ, đếm từ", vi: "Không đọc cả bài rồi mới làm; câu hỏi dẫn đường cho mắt." },

      { t: "h", text: "2. Đọc văn bản khoa học tự nhiên mà không sợ thuật ngữ" },
      { t: "p", text: "Bài Reading Academic lấy từ sách báo phổ biến khoa học cho người **không chuyên**. Vì thế người viết **luôn giải nghĩa** thuật ngữ ngay khi dùng lần đầu. Việc của bạn không phải là biết sẵn thuật ngữ, mà là **nhận ra chỗ giải nghĩa**." },
      {
        t: "table",
        caption: "5 tín hiệu định nghĩa trong bài khoa học",
        head: ["Tín hiệu", "Ví dụ", "Thuật ngữ = ?"],
        rows: [
          ["**known as / called / termed**", "a light-producing molecule **known as** luciferin", "luciferin = phân tử phát sáng"],
          ["**ngoặc đơn ( )**", "an enzyme **(a protein that speeds up a reaction)**", "enzyme = protein làm phản ứng nhanh lên"],
          ["**gạch ngang — … —**", "ostracods **— relatives of the shrimp —**", "ostracods = họ hàng của tôm"],
          ["**that is / in other words / or**", "symbiosis, **that is**, a partnership that helps both sides", "symbiosis = quan hệ đôi bên cùng lợi"],
          ["**dấu nháy ‘ ’** + giải thích sau because / since", "‘cold light’, **because** very little of the energy is lost as heat", "cold light = ánh sáng gần như không toả nhiệt"],
        ],
      },
      {
        t: "table",
        caption: "4 loại thông tin của bài khoa học — và từ báo hiệu",
        head: ["Loại", "Từ báo hiệu", "Câu hỏi hay nhắm vào"],
        rows: [
          ["**Cơ chế** (cái gì xảy ra, theo bước)", "when · as · in the form of · is released · combines with", "What is needed…? What is produced…?"],
          ["**Nguyên nhân – lý do**", "because · since · therefore · which allows · so that · the reason is", "Which colour…? Why…?"],
          ["**Số đo, mốc thời gian**", "about · roughly · at least · between … and · in the 1880s", "How many…? What proportion…? When…?"],
          ["**Mức chắc chắn**", "suggests · it is likely · may · is believed (≠ found · showed)", "TFNG / YNNG (ôn Ngày 3)"],
        ],
      },
      { t: "note", title: "💡 Mẹo đọc bài khoa học", items: ["Gặp thuật ngữ lạ, **đừng dừng lại tra nghĩa**: đọc tiếp 5–10 chữ, 90 % là có giải thích.", "Tên Latin, tên chất, tên nhà khoa học **không bao giờ bị paraphrase** — đó là mốc quét tốt nhất.", "Câu có **by contrast / whereas / however** thường chứa **hai ứng viên** (red ↔ blue; bioluminescence ↔ light bulb). Đọc cả hai vế rồi mới chọn.", "Phân biệt **found / showed** (đã chứng minh) với **suggests / likely** (suy đoán) — Ngày 3 đã dạy cho TFNG, bài khoa học dùng rất nhiều."] },

      { t: "h", text: "3. Bài đọc — Questions 1–13 (18 phút)" },
      { t: "p", text: "Đặt đồng hồ **18 phút**. Trước khi đọc bài: đọc 13 câu hỏi, ghi bên lề loại đáp án của từng câu (số? chất? màu? sinh vật? năm?). Rồi mới đọc bài và làm theo thứ tự." },
      {
        t: "passage",
        title: "Living Light",
        intro: "You should spend about 18 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "For most of history, people assumed that the deep ocean was a world of total darkness. Sunlight fades quickly under water: below about 200 metres there is only a dim blue glow, and beyond 1,000 metres no sunlight arrives at all. Yet when the crew of a research submarine switch off their lamps at these depths, they do not see blackness. Instead, sparks, flashes and slow pulses of light appear on every side. This is bioluminescence — light that is made by living organisms. On land it is unusual, found mainly in fireflies, glow-worms and a few fungi. In the open ocean, however, it is the rule rather than the exception. One survey off the coast of California, which analysed video footage collected over seventeen years, found that roughly three-quarters of the animals observed were able to produce light." },
          { label: "B", text: "The chemistry behind this light is surprisingly simple. Two ingredients are needed: a light-producing molecule known as luciferin, and an enzyme (a protein that speeds up a reaction) called luciferase. When luciferin combines with oxygen, energy is released in the form of light, and luciferase makes the reaction happen quickly enough to be useful. Both names were invented in the 1880s by the French scientist Raphaël Dubois, who was studying a glowing clam. He prepared two extracts from the animal and showed that light appeared only when they were mixed; one of the two substances, he found, was destroyed by heat, while the other was not. Bioluminescence is often described as ‘cold light’, because very little of the energy involved is lost as heat. A traditional light bulb, by contrast, wastes about 90 per cent of its energy as heat." },
          { label: "C", text: "Most light made in the sea is blue or blue-green, and the reason is physical rather than biological. Sea water absorbs red light within a few metres, whereas blue light travels furthest before it disappears. An animal that wants its signal to be seen from a distance therefore does best to glow blue, and the eyes of most deep-sea creatures have become sensitive to this colour alone. A small number of species have turned this limitation into a weapon. Certain dragonfish give off red light, which their neighbours cannot detect. In effect, they carry a private torch: they can light up their prey without warning the prey — or alerting larger hunters — that they are there." },
          { label: "D", text: "Why do so many animals spend valuable energy on making light? One answer is food. The female anglerfish has a long spine growing from her head, rather like a fishing rod, with a glowing tip that hangs just in front of her mouth. Smaller fish that come to investigate the light are swallowed whole. Interestingly, the anglerfish does not manufacture this light herself. It is produced by bacteria that live inside the lure. The fish supplies them with nutrients and a safe home, and in return they provide the bait — an arrangement from which both partners benefit." },
          { label: "E", text: "A second answer is defence. In the ‘twilight zone’ between 200 and 1,000 metres, hunters often look upwards, searching for the dark outline of an animal against the faint light from the surface. The hatchetfish has a remarkable solution. Rows of light organs along its underside give off a glow that matches the brightness of the water above, so that, seen from below, its silhouette simply vanishes. Other species prefer to confuse their enemies. Since a cloud of black ink would be useless in the dark, certain deep-sea shrimp spit out a cloud of glowing fluid and escape while the attacker is distracted. Some microscopic plankton go further: when disturbed, they flash brightly, and this ‘burglar alarm’ attracts bigger predators which may eat the animal that was attacking them." },
          { label: "F", text: "Light is also a language. Among ostracods — relatives of the shrimp that are no bigger than a sesame seed — the males release tiny glowing dots into the water as they swim, leaving a trail behind them. The spacing and timing of the dots differ from one species to the next, which allows a female to pick out a partner of her own kind in the darkness." },
          { label: "G", text: "Biologists calculate that the ability to make light has evolved independently at least 40 times, which suggests how valuable it is. It has proved valuable to humans as well. In the 1960s, the Japanese chemist Osamu Shimomura isolated a glowing substance, green fluorescent protein, from a jellyfish. Researchers later learned to attach it to other proteins as a visible label, making it possible to watch processes inside living cells, such as the spread of cancer, as they happen. The work was recognised with a Nobel Prize in 2008. Even so, the science is far from complete. The deep sea is difficult and expensive to reach, and many delicate animals are damaged, or simply stop glowing, when they are brought to the surface. It is therefore likely that a great many light-producing species are still waiting to be discovered." },
        ],
      },
      { t: "p", text: "**Questions 1–13.** Answer the questions below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "quiz", id: "t3d7-doc-cau-hoi", title: "Questions 1–13 — NO MORE THAN TWO WORDS AND/OR A NUMBER", kind: "fill",
        items: [
          { q: "(1) Below what depth does the sea receive no sunlight whatsoever?", answers: ["1,000 metres", "1000 metres", "1,000 meters", "1000 meters", "1,000 m", "1000 m", "1,000", "1000"] },
          { q: "(2) What type of recordings did the Californian study examine?", answers: ["video footage", "video"] },
          { q: "(3) Which gas does luciferin have to react with in order to give off light?", answers: ["oxygen"] },
          { q: "(4) What did Dubois discover could ruin one of the two substances he had extracted?", answers: ["heat"] },
          { q: "(5) What proportion of the energy used by an old-style light bulb is lost?", answers: ["90 per cent", "90%", "90 percent", "about 90%"] },
          { q: "(6) Which colour of light is taken in by sea water most rapidly?", answers: ["red", "red light"] },
          { q: "(7) What living things actually generate the glow in the anglerfish's lure?", answers: ["bacteria"] },
          { q: "(8) What does the hatchetfish cause to disappear by glowing on its lower surface?", answers: ["silhouette", "its silhouette"] },
          { q: "(9) What do some shrimp release instead of ink to distract an enemy?", answers: ["glowing fluid"] },
          { q: "(10) What is the name given to the plankton's method of calling in larger hunters?", answers: ["burglar alarm", "‘burglar alarm’", "'burglar alarm'"] },
          { q: "(11) Which creatures send out light signals in patterns that vary between species?", answers: ["ostracods", "male ostracods"] },
          { q: "(12) What is the minimum number of occasions on which bioluminescence is thought to have developed separately?", answers: ["40", "forty"] },
          { q: "(13) From what sea animal was green fluorescent protein first taken?", answers: ["jellyfish", "a jellyfish"] },
        ],
      },
      {
        t: "table",
        caption: "Đáp án + câu chứa đáp án + kiểu paraphrase",
        head: ["Câu", "Đáp án", "Câu trong bài", "Đề nói lại thế nào · bẫy"],
        rows: [
          ["1", "**1,000 metres**", "A: beyond 1,000 metres **no sunlight arrives at all**", "no sunlight whatsoever = no sunlight at all. **Bẫy**: 200 metres — ở đó vẫn còn “a dim blue glow”."],
          ["2", "**video footage**", "A: One survey off the coast of California, which **analysed video footage**", "study = survey; examine = analyse; type of recordings = loại đáp án là danh từ chỉ bản ghi."],
          ["3", "**oxygen**", "B: When luciferin **combines with oxygen**, energy is released in the form of light", "react with = combine with; give off light = energy is released in the form of light. **Bẫy**: luciferase là enzyme, không phải gas."],
          ["4", "**heat**", "B: one of the two substances… **was destroyed by heat**", "ruin = destroy; extracted = prepared two extracts."],
          ["5", "**90 per cent**", "B: A traditional light bulb… **wastes about 90 per cent** of its energy as heat", "old-style = traditional; is lost = wastes. Chữ **by contrast** báo có hai vế: ‘very little … is lost as heat’ là của ánh sáng sinh học."],
          ["6", "**red**", "C: Sea water **absorbs red light within a few metres**, whereas blue light travels furthest", "taken in = absorbs; most rapidly = within a few metres. **Bẫy**: blue — vế sau whereas, nghĩa ngược lại."],
          ["7", "**bacteria**", "D: the anglerfish does not manufacture this light herself. **It is produced by bacteria**", "generate = produce / manufacture; living things = loại đáp án là sinh vật. **Bẫy**: the (female) anglerfish — bị phủ định bằng does not."],
          ["8", "**silhouette**", "E: seen from below, **its silhouette simply vanishes**", "disappear = vanish; lower surface = underside. “dark outline” ở câu trước nói về con mồi nói chung, không phải câu về hatchetfish."],
          ["9", "**glowing fluid**", "E: Since a cloud of black ink would be useless…, certain deep-sea shrimp **spit out a cloud of glowing fluid**", "release = spit out; distract an enemy = while the attacker is distracted. Giới hạn 2 từ ⇒ bỏ “a cloud of”."],
          ["10", "**burglar alarm**", "E: they flash brightly, and **this ‘burglar alarm’ attracts bigger predators**", "calling in larger hunters = attracts bigger predators; the name given to = chữ trong dấu nháy."],
          ["11", "**ostracods**", "F: Among **ostracods**… the males release tiny glowing dots… The spacing and timing… **differ from one species to the next**", "vary between species = differ from one species to the next; light signals = glowing dots."],
          ["12", "**40**", "G: has **evolved independently at least 40 times**", "minimum number = at least; developed separately = evolved independently; occasions = times."],
          ["13", "**jellyfish**", "G: isolated… green fluorescent protein, **from a jellyfish**", "taken = isolated; sea animal = loại đáp án. Không nhầm với Shimomura (người) hay 1960s (thời gian)."],
        ],
      },
      { t: "note", title: "📌 Chấm điểm và đọc lại", items: ["**11–13 đúng**: bạn đã ở mức band 6.5 cho dạng này. **9–10**: đạt mục tiêu hôm nay. **≤ 8**: xem lại mục 1 (từ hỏi → loại đáp án) và làm lại bài Short-answer của Tập 2 Ngày 8.", "Sai vì **viết thừa từ** hay **chép sai chính tả**? Ghi vào Sổ lỗi — đây là lỗi kỷ luật, sửa được ngay.", "Sai vì **chọn nhầm ứng viên** (200 metres, blue, anglerfish)? Tập thói quen đọc hết câu có **whereas / by contrast / does not** rồi mới chép.", "Lưu ý câu 5: vế “very little of the energy… is lost as heat” không chứa đáp án vì đề hỏi **old-style light bulb**; vế đó nói về ánh sáng sinh học. Viết “about 90 per cent” (3 từ + số) là **vượt giới hạn** — bỏ about."] },

      { t: "h", text: "4. Soi lại bài: tín hiệu định nghĩa và mức chắc chắn" },
      {
        t: "mcq", id: "t3d7-doc-khoa-hoc", title: "Đọc kiểu nhà khoa học (6 câu — nhìn lại bài Living Light)",
        items: [
          { q: "Trong đoạn B, bài giải nghĩa chữ **enzyme** bằng tín hiệu nào?", options: ["known as", "ngoặc đơn ( )", "gạch ngang —", "that is"], correct: 1, why: "an enzyme **(a protein that speeds up a reaction)** — định nghĩa nằm trong ngoặc đơn." },
          { q: "Chữ **ostracods** (đoạn F) nghĩa là gì theo bài?", options: ["một loại sinh vật phù du phát sáng khi bị quấy rầy", "một loại cá có que phát sáng", "họ hàng rất nhỏ của tôm", "một loại vi khuẩn sống trong mồi nhử"], correct: 2, why: "ostracods **— relatives of the shrimp** that are no bigger than a sesame seed — định nghĩa giữa hai gạch ngang." },
          { q: "Câu nào trong bài là **suy đoán**, chưa phải sự thật đã chứng minh?", options: ["It is therefore likely that a great many light-producing species are still waiting to be discovered.", "Sea water absorbs red light within a few metres.", "The work was recognised with a Nobel Prize in 2008.", "It is produced by bacteria that live inside the lure."], correct: 0, why: "**It is likely that…** = có lẽ. Ba câu còn lại nêu sự việc bằng hiện tại đơn / quá khứ đơn, không có từ rào đón." },
          { q: "Vì sao phần lớn sinh vật biển phát ánh sáng **xanh**?", options: ["Vì ánh sáng xanh tốn ít năng lượng nhất.", "Vì vi khuẩn chỉ tạo được ánh sáng xanh.", "Vì kẻ săn mồi không thấy ánh sáng xanh.", "Vì ánh sáng xanh đi xa nhất trong nước biển."], correct: 3, why: "C: blue light **travels furthest** before it disappears… **therefore** does best to glow blue. Chữ therefore nối nguyên nhân với kết quả." },
          { q: "Cụm **an arrangement from which both partners benefit** (đoạn D) nói về quan hệ giữa…", options: ["cá cần câu và con mồi", "cá cần câu và vi khuẩn", "cá cần câu cái và cá đực", "vi khuẩn và con mồi"], correct: 1, why: "The fish supplies **them** (bacteria) with nutrients and a safe home, and in return **they** provide the bait." },
          { q: "“In effect, they carry a **private torch**” (đoạn C). “private” vì…", options: ["chỉ cá rồng mới phát sáng ở độ sâu đó", "ánh sáng của nó rất yếu", "các loài khác không nhìn thấy ánh sáng đỏ", "nó chỉ bật sáng khi ở một mình"], correct: 2, why: "Certain dragonfish give off red light, **which their neighbours cannot detect** ⇒ “đèn pin riêng”." },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "organism", pos: "n", ipa: "/ˈɔːɡənɪzəm/", vi: "sinh vật", ex: "Bioluminescence is light made by living organisms.", exVi: "Phát quang sinh học là ánh sáng do sinh vật sống tạo ra.", more: "living / marine / single-celled **organism** · họ từ: organic (adj), organ (n)" },
          { w: "absorb", pos: "v", ipa: "/əbˈzɔːb/", vi: "hấp thụ", ex: "Sea water absorbs red light within a few metres.", exVi: "Nước biển hấp thụ ánh sáng đỏ trong vòng vài mét.", more: "**absorb** heat / light / water / information · danh từ: absorption" },
          { w: "release", pos: "v, n", ipa: "/rɪˈliːs/", vi: "giải phóng, thải ra", ex: "Energy is released in the form of light.", exVi: "Năng lượng được giải phóng dưới dạng ánh sáng.", more: "**release** energy / gases / a statement · Task 1 process: is released into the air" },
          { w: "detect", pos: "v", ipa: "/dɪˈtekt/", vi: "phát hiện, dò thấy", ex: "Most deep-sea animals cannot detect red light.", exVi: "Hầu hết động vật biển sâu không phát hiện được ánh sáng đỏ.", more: "**detect** a change / a signal / a disease early · detection (n), detector (n)" },
          { w: "predator", pos: "n", ipa: "/ˈpredətə(r)/", vi: "động vật săn mồi", ex: "The flash attracts bigger predators.", exVi: "Tia chớp thu hút những kẻ săn mồi lớn hơn.", more: "trái nghĩa: **prey** /preɪ/ (con mồi — không đếm được) · natural predator" },
          { w: "evolve", pos: "v", ipa: "/ɪˈvɒlv/", vi: "tiến hoá, phát triển dần", ex: "The ability has evolved independently at least 40 times.", exVi: "Khả năng này đã tiến hoá độc lập ít nhất 40 lần.", more: "**evolve** from / into · evolution (n), evolutionary (adj)" },
          { w: "isolate", pos: "v", ipa: "/ˈaɪsəleɪt/", vi: "tách ra, phân lập; cô lập", ex: "He isolated a glowing protein from a jellyfish.", exVi: "Ông phân lập một protein phát sáng từ một con sứa.", more: "**isolate** a substance / a patient · isolated villages · isolation (n)" },
          { w: "substance", pos: "n", ipa: "/ˈsʌbstəns/", vi: "chất", ex: "One of the two substances was destroyed by heat.", exVi: "Một trong hai chất bị nhiệt phá huỷ.", more: "a chemical / toxic / natural **substance**" },
          { w: "emit / give off", pos: "v", ipa: "/iˈmɪt/ · /ɡɪv ɒf/", vi: "phát ra (ánh sáng, khí, nhiệt)", ex: "Certain dragonfish give off red light.", exVi: "Một số loài cá rồng phát ra ánh sáng đỏ.", more: "**emit** light / carbon dioxide · emission (n) — carbon emissions" },
          { w: "independently", pos: "adv", ipa: "/ˌɪndɪˈpendəntli/", vi: "một cách độc lập", ex: "The two teams reached the same result independently.", exVi: "Hai nhóm đạt cùng kết quả một cách độc lập.", more: "independent (adj) **of** · independence (n) **from**" },
        ],
      },
      { t: "note", title: "💡 Cách học sau bài", items: ["Chép 13 cặp paraphrase ở bảng đáp án vào **sổ paraphrase** (thói quen từ Tập 2 Ngày 8): react with = combine with · ruin = destroy · taken in = absorb…", "Tìm trong bài **5 verb pattern** của bài ngữ pháp hôm nay: wants its signal **to be seen** · prefer **to confuse** · learned **to attach** · making it possible **to watch** · stop **glowing**.", "Đọc to đoạn E một lần, chú ý ngắt hơi ở dấu phẩy — luyện luôn độ trôi chảy."] },
    ],
  },

  /* ═══════════════════════ BÀI 3 — NÓI ═══════════════════════ */
  {
    id: "t3d7-noi",
    kind: "speaking",
    title: "Part 2: Describe a person vòng 2 — người có ảnh hưởng tới bạn",
    goal: "Nói trọn 2 phút về một người có ảnh hưởng tới bạn ở mức band 6: hai tính cách, mỗi tính cách một câu chuyện chứng minh, nêu rõ bạn đã thay đổi thế nào, và đặt đúng trọng âm các từ đuôi -tion / -ic / -ity.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        items: [
          "**Ôn từ Tập 2 Ngày 3**: thẻ đề 4 dòng, 1 phút ghi chú, khung 4 phần, ngân hàng tính cách mức nhập (patient, generous, hard-working…).",
          "Vòng 2 — band 6: đề hỏi **ảnh hưởng** (influence), không chỉ tả người. Phải nói được **trước kia tôi thế nào → nhờ họ tôi đổi ra sao**.",
          "**Ngân hàng tính cách band 6**: 10 tính cách, mỗi cái có **2 cách nói + 1 chuyện chứng minh** theo công thức Tính cách → Chuyện → Tác động lên tôi.",
          "Dùng ngay **verb patterns** của bài 1: She **encouraged me to** apply · He **taught me to** stay calm · She **made me realise**…",
          "So mẫu **band 5 và band 6** cho cùng một người — chỉ rõ khác nhau ở FC · LR · GRA · P.",
          "🔊 Trọng âm theo hậu tố: -**tion** / -**ic** / -**ity** ⇒ nhấn âm tiết **ngay trước** hậu tố (determiNAtion · optiMIStic · geneROSity).",
        ],
      },

      { t: "h", text: "1. Part 2 ở band 6 cần thêm gì so với band 5?" },
      { t: "p", text: "Nhắc lại thể lệ (Tập 2 Ngày 3): giám khảo đưa một **thẻ đề** (cue card) có 4 dòng gợi ý, bạn có **1 phút** ghi chú rồi nói **1–2 phút**; giám khảo ngắt khi đủ 2 phút và hỏi thêm 1–2 câu ngắn. **FC** = Fluency & Coherence (trôi chảy, mạch lạc), **LR** = Lexical Resource (từ vựng), **GRA** = ngữ pháp, **P** = phát âm." },
      {
        t: "table",
        head: ["Tiêu chí", "Band 5", "Band 6 — đích hôm nay"],
        rows: [
          ["**FC**", "nói được nhưng hết ý sau ~1 phút; nối bằng and, so, because; hay dừng lâu", "**sẵn lòng nói dài** tới khi bị ngắt; có từ dẫn chuyện (What I admire most…, As for…, All in all…) dù đôi lúc lặp hoặc tự sửa"],
          ["**LR**", "kind, good, nice, hard-working lặp lại", "tính cách **cụ thể** (resilient, down-to-earth) + **paraphrase** được (never gives up)"],
          ["**GRA**", "câu đơn hiện tại; quá khứ hay quên -ed", "**trộn** đơn + phức: mệnh đề quan hệ, used to, verb + O + to V; còn lỗi nhưng không gây hiểu sai"],
          ["**P**", "trọng âm từ dài hay sai, đều đều", "trọng âm **từ dài** phần lớn đúng; có nhấn từ khoá; nhìn chung dễ hiểu"],
        ],
      },
      { t: "note", title: "📌 Điều giám khảo cần nghe ở đề “người”", items: ["**Không phải** danh sách tính từ: ~~She is kind, friendly, helpful and nice.~~ Bốn tính từ không có bằng chứng = band 5.", "**Mà là** một con người cụ thể: 2 tính cách, mỗi cái có **một việc họ đã làm** (thì quá khứ) + **điều đó tác động lên bạn** thế nào.", "Bạn có quyền **bịa chi tiết** — giám khảo chấm tiếng Anh, không kiểm tra sự thật. Nhưng chọn **người thật** thì dễ nhớ chuyện hơn."] },

      { t: "h", text: "2. Đọc đề: động từ của thẻ quyết định trọng tâm" },
      {
        t: "table",
        caption: "Thẻ đề hôm nay",
        head: ["Describe a person who has had an important influence on your life."],
        rows: [
          ["You should say:"],
          ["• who this person is"],
          ["• how long you have known him or her"],
          ["• what qualities this person has"],
          ["• and explain how this person has influenced you."],
        ],
      },
      { t: "p", text: "Tập 2 Ngày 7 và Ngày 15 đã dạy: **đọc động từ của thẻ** để chọn góc nói. Ở đây động từ chính là **has influenced** — thì hiện tại hoàn thành, nghĩa là ảnh hưởng **kéo dài tới bây giờ**. Vì vậy dòng cuối (explain how…) phải chiếm **khoảng 1/3 bài nói**, và phải có cấu trúc **trước → sau**: I used to… → Now I… / Thanks to him, I've become…" },
      {
        t: "sodo", kind: "flow", title: "Chia 2 phút cho đề “người có ảnh hưởng”",
        steps: [
          { label: "15 giây — Who + how long", sub: "tên, quan hệ, tuổi / nghề; quen từ khi nào, thân từ khi nào" },
          { label: "35 giây — Tính cách 1 + chuyện", sub: "What I admire most about him is… + một việc đã xảy ra" },
          { label: "20 giây — Tính cách 2 + chi tiết", sub: "He's also really… Even though…, he never…" },
          { label: "40 giây — Ảnh hưởng: trước → sau", sub: "I used to… / He taught me to… / Thanks to him, I've become…" },
          { label: "10 giây — Chốt", sub: "So, all in all, … a role model for me" },
        ],
        caption: "Nếu giám khảo chưa ngắt mà bạn hết ý: thêm một câu về tương lai (I hope I can… one day).",
      },

      { t: "h", text: "3. Ngân hàng tính cách band 6 — mỗi tính cách một chuyện chứng minh" },
      { t: "p", text: "Ngân hàng Tập 2 Ngày 3 có 6 tính cách cơ bản (patient, generous, hard-working, funny, easy-going, determined). Hôm nay thêm **10 tính cách mức band 6**. Đừng học cả 10: chọn **3–4 cái đúng với người thật bạn định kể**, thuộc 2 cách nói và chuẩn bị sẵn chuyện của riêng bạn." },
      {
        t: "table",
        head: ["Tính cách", "2 cách nói", "Chuyện chứng minh (mẫu)"],
        rows: [
          ["**Kiên cường** (ngã rồi đứng dậy)", "resilient · bounces back from setbacks", "His first business failed and he lost his savings, but within three years he had gone on to become a team leader."],
          ["**Giản dị, không khoe**", "down-to-earth · never shows off", "Even though she runs a big company, she still takes the bus and has lunch with the cleaners."],
          ["**Tận tâm, kỹ lưỡng**", "conscientious · pays attention to every detail", "She marked every essay by hand and wrote a comment on each paragraph, even with forty students."],
          ["**Cởi mở**", "open-minded · willing to listen to different views", "When I told him I wanted to study art instead of medicine, he asked questions for an hour before giving his opinion."],
          ["**Luôn ủng hộ**", "supportive · always there for me", "The night before my interview, she stayed up until midnight helping me practise my answers."],
          ["**Tháo vát**", "resourceful · good at finding a way", "When the projector broke, he drew the whole diagram on the board from memory and carried on."],
          ["**Chu đáo**", "considerate · thinks about other people's feelings", "He noticed I was too shy to ask questions, so he started checking with me quietly after class."],
          ["**Có nguyên tắc**", "principled · stands up for what is right", "She refused to give a rich parent's son a higher mark, although it nearly cost her the job."],
          ["**Bình tĩnh**", "level-headed · stays calm under pressure", "When our server crashed an hour before the deadline, he just said, “OK, one problem at a time.”"],
          ["**Đầy nhiệt huyết**", "passionate about (teaching) · enthusiastic", "He talks about history as if he had been there himself; nobody ever fell asleep in his class."],
        ],
      },
      { t: "rule", formula: "Tính cách (từ band 6) → For instance, + chuyện quá khứ → That (really) + tác động lên tôi", vi: "Ba bước cho mỗi tính cách: gọi tên — chứng minh — nói nó có nghĩa gì với bạn." },
      {
        t: "examples",
        items: [
          { en: "She's incredibly conscientious. For instance, she used to write a comment on every single paragraph of our essays. That made me realise how much she cared, so I started taking my homework seriously.", vi: "Cô cực kỳ tận tâm. Ví dụ, cô từng viết nhận xét cho từng đoạn trong bài luận của chúng tôi. Điều đó khiến tôi nhận ra cô quan tâm tới mức nào, nên tôi bắt đầu làm bài tập nghiêm túc." },
          { en: "My grandfather is very down-to-earth. Even though he was a well-known doctor, he never showed off; he still rode an old bicycle to the hospital. That taught me not to judge people by what they own.", vi: "Ông tôi rất giản dị. Dù là bác sĩ có tiếng, ông không bao giờ khoe khoang; ông vẫn đạp chiếc xe cũ tới bệnh viện. Điều đó dạy tôi đừng đánh giá người khác qua thứ họ sở hữu." },
        ],
      },
      { t: "note", title: "⚠️ Cẩn thận — từ tính cách hay dùng sai", items: ["~~He is very sympathy.~~ → He is very **sympathetic** (biết cảm thông). sympathy là danh từ.", "~~She is a confident.~~ / ~~She has confident.~~ → She is **confident** / She has a lot of **confidence**.", "**sensible** (biết điều, khôn ngoan) ≠ **sensitive** (nhạy cảm, dễ tổn thương).", "~~He is very boring / interesting person~~ thiếu mạo từ → He is **a** very interesting person.", "Người truyền cảm hứng: She is **inspiring**. Tôi được truyền cảm hứng: I feel **inspired by** her. (bài ngữ pháp hôm nay, mục 6)"] },
      {
        t: "mcq", id: "t3d7-noi-tinh-cach", title: "Tính cách ↔ chuyện chứng minh (6 câu)",
        items: [
          { q: "“My coach is very **resilient**.” Câu nào chứng minh đúng nhất?", options: ["He is tall and strong.", "He broke his leg twice in his career, and both times he trained his way back into the national team.", "He trains us three times a week.", "He is strict but fair."], correct: 1, why: "resilient = gặp thất bại / chấn thương rồi **vực dậy** — chuyện gãy chân hai lần mà vẫn trở lại đội tuyển." },
          { q: "Cách nói thứ hai của **down-to-earth** là…", options: ["always there for me", "stays calm under pressure", "never shows off", "pays attention to every detail"], correct: 2, why: "down-to-earth = giản dị, thực tế, **không khoe khoang** (never shows off)." },
          { q: "“When the bus broke down in the mountains, she organised lifts for forty students in half an hour using only her phone.” Tính cách nào?", options: ["resourceful", "principled", "passionate", "considerate"], correct: 0, why: "resourceful = **tháo vát**, tìm ra cách giải quyết với những gì có trong tay." },
          { q: "Câu nào có bước 3 (tác động lên tôi) tốt nhất?", options: ["He is very open-minded and I like him.", "He is open-minded. He is also kind.", "He is open-minded, for example he listens.", "He listened to my plan for an hour without judging. That gave me the courage to change my degree."], correct: 3, why: "Có **chuyện** (listened for an hour) + **tác động** (That gave me the courage to…)." },
          { q: "Chọn câu ĐÚNG ngữ pháp:", options: ["She made me to believe in myself.", "She encouraged me to believe in myself.", "She suggested me to believe in myself.", "She let me to believe in myself."], correct: 1, why: "**encourage + O + to V**. make / let + O + V (không to); suggest không đi với O + to V." },
          { q: "“I really ___ him” (= ngưỡng mộ, kính trọng người lớn hơn). Chọn cụm đúng:", options: ["look after", "look down on", "look up to", "look forward to"], correct: 2, why: "**look up to** = ngưỡng mộ, kính trọng. look down on = coi thường; look after = chăm sóc." },
        ],
      },

      { t: "h", text: "4. Khung câu nói về ảnh hưởng" },
      {
        t: "patterns",
        rows: [
          { formula: "What I admire most about + O + is + N / the way S + V", vi: "Điều tôi ngưỡng mộ nhất ở … là … (mở phần tính cách)", examples: [{ en: "What I admire most about her is the way she treats everyone equally.", vi: "Điều tôi ngưỡng mộ nhất ở cô là cách cô đối xử bình đẳng với mọi người." }] },
          { formula: "S + is the kind of person who + V(s/es)", vi: "… là kiểu người mà …", examples: [{ en: "He's the kind of person who never complains.", vi: "Anh ấy là kiểu người không bao giờ than phiền." }] },
          { formula: "S + taught / encouraged / inspired / pushed + me + to V", vi: "… đã dạy / khuyến khích / truyền cảm hứng / thúc tôi làm …", examples: [{ en: "She encouraged me to apply for the scholarship.", vi: "Cô khuyến khích tôi nộp đơn xin học bổng." }, { en: "He taught me to break a big problem down into smaller steps.", vi: "Anh dạy tôi chia một vấn đề lớn thành các bước nhỏ." }] },
          { formula: "S + made me realise (that) + S + V", vi: "… khiến tôi nhận ra rằng …", examples: [{ en: "He made me realise that failing once is not the end.", vi: "Anh khiến tôi nhận ra rằng thất bại một lần không phải là hết." }] },
          { formula: "I used to + V, but thanks to + O, I've become + adj-er / I've started + V-ing", vi: "Trước kia tôi…, nhưng nhờ … tôi đã trở nên … (trước → sau)", examples: [{ en: "I used to give up easily, but thanks to him, I've become much more patient.", vi: "Trước kia tôi dễ bỏ cuộc, nhưng nhờ anh ấy tôi đã kiên nhẫn hơn nhiều." }] },
          { formula: "S + has had a huge impact on + the way I + V", vi: "… đã ảnh hưởng rất lớn tới cách tôi …", examples: [{ en: "She has had a huge impact on the way I study.", vi: "Cô ấy đã ảnh hưởng rất lớn tới cách tôi học." }] },
          { formula: "If it hadn't been for + O, I would never have + V3", vi: "Nếu không nhờ …, tôi đã chẳng bao giờ … (học kỹ ở Ngày 15 — hôm nay thuộc như một cụm)", examples: [{ en: "If it hadn't been for my aunt, I would never have studied abroad.", vi: "Nếu không nhờ dì tôi, tôi đã chẳng bao giờ đi du học." }] },
        ],
      },
      {
        t: "table",
        caption: "Cụm “người ảnh hưởng” — thay cho I like him very much",
        head: ["Cụm", "Nghĩa", "Ví dụ"],
        rows: [
          ["**look up to** sb", "ngưỡng mộ, kính trọng", "I've always looked up to my older sister."],
          ["a **role model**", "hình mẫu để noi theo", "He's a role model for a lot of young engineers."],
          ["**set a good example**", "làm gương tốt", "She sets a good example by always arriving early."],
          ["**be there for** sb", "luôn ở bên khi cần", "He was there for me when I failed my exam."],
          ["**bring out the best in** sb", "khơi ra mặt tốt nhất của ai", "She really brings out the best in her students."],
          ["**follow in** sb's **footsteps**", "nối nghiệp, đi theo con đường của ai", "I decided to follow in his footsteps and study IT."],
          ["**have a lot in common**", "có nhiều điểm chung", "We don't have a lot in common, but we get on well."],
          ["**I owe** sb **a lot**", "tôi mang ơn ai rất nhiều", "I owe her a lot — she changed how I see myself."],
        ],
      },
      {
        t: "quiz", id: "t3d7-noi-khung-dich", title: "Dịch Việt → Anh — dùng khung câu (5 câu)", kind: "translate", grammar: "What I admire most… · taught / encouraged me to V · made me realise · I used to…, but thanks to…",
        items: [
          { q: "Điều tôi ngưỡng mộ nhất ở bố tôi là sự trung thực của ông.", answers: ["What I admire most about my father is his honesty.", "What I admire most about my dad is his honesty.", "What I admire the most about my father is his honesty."], hint: "What I admire most about … is … · honesty" },
          { q: "Cô ấy khuyến khích tôi tham gia câu lạc bộ tranh biện.", answers: ["She encouraged me to join the debating club.", "She encouraged me to join the debate club."], hint: "encourage + O + to V · debating club" },
          { q: "Ông ấy khiến tôi nhận ra rằng tiền không phải là tất cả.", answers: ["He made me realise that money is not everything.", "He made me realize that money is not everything.", "He made me realise that money isn't everything.", "He made me realize that money isn't everything.", "He made me realise money isn't everything."], hint: "make + O + V · realise that" },
          { q: "Trước kia tôi rất nhút nhát, nhưng nhờ cô ấy tôi đã tự tin hơn nhiều.", answers: ["I used to be very shy, but thanks to her, I've become much more confident.", "I used to be very shy, but thanks to her I have become much more confident.", "I used to be very shy, but thanks to her, I have become much more confident.", "I used to be very shy, but thanks to her I've become much more confident.", "I used to be really shy, but thanks to her, I've become much more confident."], hint: "used to + V · thanks to · I've become" },
          { q: "Anh ấy là kiểu người luôn giữ lời hứa.", answers: ["He is the kind of person who always keeps his promises.", "He's the kind of person who always keeps his promises.", "He is the kind of person who always keeps his word.", "He's the kind of person who always keeps his word.", "He is the kind of person who always keeps his promise."], hint: "the kind of person who + V-s · keep one's promises" },
        ],
      },

      { t: "h", text: "5. Ghi chú 1 phút" },
      { t: "p", text: "Vẫn là **4 ô từ khoá** như Tập 2 Ngày 3 — nhưng ô 3 ghi theo công thức **tính cách → chuyện**, ô 4 ghi **trước → sau**. Chỉ ghi **từ khoá**, không ghi câu." },
      {
        t: "table",
        head: ["Ô", "Ghi chú mẫu (cousin Minh)"],
        rows: [
          ["**1 · Who / how long**", "cousin Minh · +8 yrs · software eng, Da Nang · close since 15 (maths)"],
          ["**2 · Quality 1 + story**", "RESILIENT → app company failed, lost savings → evenings study → team leader 3 yrs"],
          ["**3 · Quality 2 + detail**", "DOWN-TO-EARTH → never shows off, explains, not make me feel stupid"],
          ["**4 · Influence: before → after**", "used to avoid difficult → taught: break down problem · encouraged: apply CS → patient, confident · role model"],
        ],
      },

      { t: "h", text: "6. Hai bài nói mẫu cho cùng một người: band 5 và band 6" },
      { t: "p", text: "Nghe bài **band 5** trước, tự hỏi: thiếu gì? Rồi nghe bài **band 6** và đối chiếu bằng bảng bên dưới. Bài band 5 **cố ý để nguyên lỗi** — đừng học theo." },
      {
        t: "dialogue",
        title: "Bài mẫu band 5 (khoảng 50 giây, 124 từ — hết ý sớm)",
        lines: [
          { who: "Examiner", role: "examiner", text: "All right? Remember, you have one to two minutes for this. I'll tell you when the time is up. Can you start speaking now, please?", vi: "Được chưa? Nhớ là bạn có một đến hai phút. Tôi sẽ báo khi hết giờ. Mời bạn bắt đầu." },
          { who: "Candidate", role: "candidate", text: "I want to talk about my cousin. His name is Minh. He is thirty years old and he is a software engineer. He work in Da Nang. I know him long time because he is my cousin. He is very good person. He is very kind and very hard-working and very clever. He always help me. When I was student in high school, he help me to study maths. He make me to like computer. He had a company before, but it is not success. After that, he work in another company. I like him very much because he is very good. He teach me many thing. I am very interesting in his job. So I want to become engineer like him. That's all.", vi: "Tôi muốn nói về anh họ tôi. Tên anh là Minh. Anh ba mươi tuổi và là kỹ sư phần mềm. Anh làm ở Đà Nẵng. Tôi biết anh lâu rồi vì anh là anh họ tôi. Anh là người rất tốt. Anh rất tử tế, rất chăm chỉ và rất thông minh. Anh luôn giúp tôi. Khi tôi học cấp ba, anh giúp tôi học toán. Anh làm tôi thích máy tính. Anh từng có một công ty nhưng không thành công. Sau đó anh làm ở công ty khác. Tôi rất quý anh vì anh rất tốt. Anh dạy tôi nhiều thứ. Tôi rất thích công việc của anh. Nên tôi muốn thành kỹ sư như anh. Hết ạ." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài mẫu band 6 (khoảng 2 phút, 276 từ) + một câu hỏi thêm của giám khảo",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about my cousin Minh, who has probably had the biggest influence on my life so far. He's eight years older than me, and he works as a software engineer for a company in Da Nang. I've known him all my life, of course, but we only became close when I was about fifteen, because that's when he started helping me with maths.", vi: "Tôi muốn nói về anh họ tôi, anh Minh, người có lẽ ảnh hưởng tới cuộc đời tôi nhiều nhất cho tới giờ. Anh hơn tôi tám tuổi và làm kỹ sư phần mềm cho một công ty ở Đà Nẵng. Dĩ nhiên tôi biết anh từ bé, nhưng chúng tôi chỉ thân từ lúc tôi khoảng mười lăm tuổi, vì đó là lúc anh bắt đầu kèm toán cho tôi." },
          { who: "Candidate", role: "candidate", text: "What I admire most about him is how resilient he is. A few years ago, he and two friends set up a small company making a food-delivery app. Unfortunately, it failed after about a year and he lost most of his savings. A lot of people would have given up, but he didn't. He went back to work, spent his evenings learning new skills, and he went on to become a team leader within three years.", vi: "Điều tôi ngưỡng mộ nhất ở anh là sự kiên cường. Vài năm trước, anh và hai người bạn lập một công ty nhỏ làm ứng dụng giao đồ ăn. Tiếc là nó thất bại sau khoảng một năm và anh mất gần hết tiền tiết kiệm. Nhiều người hẳn đã bỏ cuộc, nhưng anh thì không. Anh đi làm lại, dành buổi tối học kỹ năng mới, và sau đó trở thành trưởng nhóm trong vòng ba năm." },
          { who: "Candidate", role: "candidate", text: "He's also really down-to-earth. Even though he's quite successful now, he never shows off, and he's always willing to explain things to me without making me feel stupid.", vi: "Anh cũng rất giản dị. Dù bây giờ khá thành công, anh không bao giờ khoe khoang, và luôn sẵn lòng giải thích cho tôi mà không khiến tôi thấy mình ngốc." },
          { who: "Candidate", role: "candidate", text: "As for how he's influenced me, well, I used to be the kind of student who avoided anything difficult. Whenever I got stuck on a problem, I just stopped trying. Minh taught me to break a big problem down into smaller steps, and he encouraged me to apply for computer science, which I'd never have considered on my own. Thanks to him, I've become much more patient and, I think, more confident.", vi: "Còn về việc anh ảnh hưởng tới tôi thế nào, thì trước kia tôi là kiểu học sinh né mọi thứ khó. Hễ kẹt ở một bài là tôi thôi không cố nữa. Anh Minh dạy tôi chia một vấn đề lớn thành các bước nhỏ, và khuyến khích tôi đăng ký ngành khoa học máy tính — điều mà tự tôi sẽ chẳng bao giờ nghĩ tới. Nhờ anh, tôi kiên nhẫn hơn nhiều và, tôi nghĩ, tự tin hơn." },
          { who: "Candidate", role: "candidate", text: "So, all in all, he's not just a relative — he's a kind of role model for me, and I'd be really happy if I ended up being half as determined as he is.", vi: "Nên nhìn chung, anh không chỉ là người thân — anh là một hình mẫu của tôi, và tôi sẽ rất vui nếu sau này quyết tâm được bằng một nửa anh." },
          { who: "Examiner", role: "examiner", text: "Thank you. Do your friends know him as well?", vi: "Cảm ơn bạn. Bạn bè của bạn có biết anh ấy không?" },
          { who: "Candidate", role: "candidate", text: "A couple of them do, yes. He helped two of my classmates prepare for a coding competition last year, so they think he's great.", vi: "Vài người có ạ. Năm ngoái anh giúp hai bạn cùng lớp tôi chuẩn bị cho một cuộc thi lập trình, nên họ quý anh lắm." },
        ],
      },
      {
        t: "table",
        caption: "Khác nhau ở đâu — theo 4 tiêu chí",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6"],
        rows: [
          ["**FC**", "50 giây rồi “That's all”; câu ngắn rời nhau; nối bằng so, because", "gần đủ 2 phút; có **biển chỉ đường**: What I admire most… · He's also… · As for how he's influenced me… · So, all in all…"],
          ["**LR**", "good (3 lần), kind, clever — không có bằng chứng; ~~I am very interesting in~~", "**resilient · down-to-earth · shows off · role model · got stuck · given up** — mỗi tính cách có chuyện; paraphrase resilient = “A lot of people would have given up, but he didn't”"],
          ["**GRA**", "~~He work~~ · ~~he help me~~ · ~~make me to like~~ · ~~it is not success~~ · thiếu a / an; toàn câu đơn", "mệnh đề quan hệ (who has had…, which I'd never have considered) · **used to** · **taught me to break** · **encouraged me to apply** · **went on to become** · Even though… — có trộn đơn và phức"],
          ["**P**", "đọc đều, từ dài dễ sai trọng âm (enGIneer)", "nhấn từ khoá (**MOST** · **reSILient** · **NEver**); trọng âm đúng: enginEER · inFLUenced · deTERmined"],
          ["**Trả lời đề**", "kể người, gần như **không nói ảnh hưởng** (chỉ “I want to become engineer like him”)", "phần ảnh hưởng chiếm ~1/3, có **trước (I used to…) → sau (I've become…)**"],
        ],
      },
      { t: "note", title: "💡 Mẹo nâng bài của chính bạn từ 5 lên 6", items: ["Gạch mọi chữ **good / nice / kind** trong ghi chú; thay bằng một tính cách ở mục 3 + một chuyện.", "Thêm đúng **3 biển chỉ đường**: What I admire most about … is… / … is also really… / As for how … has influenced me,…", "Bài mẫu band 6 vẫn chưa hoàn hảo (lặp he… he…, từ nối còn đơn giản) — band 6 **không đòi** hoàn hảo, chỉ đòi **nói dài, có chuyện, có câu phức**.", "Mượn câu chốt: I'd be really happy if I ended up being **half as + adj + as** he is."] },

      { t: "h", text: "7. Một người — năm thẻ đề" },
      { t: "p", text: "Cùng một câu chuyện (cousin Minh) dùng được cho nhiều thẻ. Chỉ đổi **câu mở** và **phần nhấn** cho khớp động từ của thẻ. Đây là bước chuẩn bị cho “kho 5 câu chuyện” (Tập 2 Ngày 23)." },
      {
        t: "table",
        head: ["Thẻ đề", "Nhấn vào", "Câu mở"],
        rows: [
          ["a person who has **influenced** you", "trước → sau của bạn", "…who has probably had the biggest influence on my life so far."],
          ["a person you **admire**", "2 tính cách + chuyện (dài hơn)", "The person I admire most is probably my cousin Minh."],
          ["a person who **helped** you", "một lần giúp cụ thể (kèm toán, luyện phỏng vấn)", "I'd like to talk about the time my cousin helped me through a difficult year at school."],
          ["a family member you **spend time with**", "hoạt động làm chung, tần suất", "The relative I spend the most time with is my cousin Minh."],
          ["a person who is **good at their job**", "công việc, kỹ năng, người khác nói gì", "I'm going to describe my cousin, who is the best software engineer I know."],
        ],
      },

      { t: "h", text: "8. Phát âm: trọng âm theo hậu tố -tion / -sion · -ic · -ity" },
      { t: "p", text: "Từ tả tính cách band 6 thường **dài** (determination, enthusiastic, generosity). Đặt sai trọng âm thì giám khảo khó nhận ra từ, dù bạn dùng đúng. May là có quy tắc: với ba hậu tố **-tion / -sion**, **-ic**, **-ity**, trọng âm rơi vào **âm tiết đứng ngay trước hậu tố** — và thường **dời chỗ** so với từ gốc. (Tập 2 Ngày 11 · 13 đã học trọng âm từ 2–3 âm tiết; đây là bước kế tiếp.)" },
      {
        t: "table",
        head: ["Hậu tố", "Từ gốc → từ có hậu tố (CHỮ HOA = nhấn)", "Thêm ví dụ"],
        rows: [
          ["**-tion / -sion**", "EDucate → edu**CA**tion · deTERmine → determi**NA**tion · inSPIRE → inspi**RA**tion · deCIDE → de**CI**sion", "moti**VA**tion · communi**CA**tion · con**CLU**sion · dis**CUS**sion"],
          ["**-ic**", "ENergy → ener**GET**ic · OPtimist → opti**MIS**tic · enTHUsiasm → enthusi**AS**tic · REal → rea**LIS**tic", "sympa**THET**ic · aca**DEM**ic · eco**NOM**ic · scien**TIF**ic"],
          ["**-ity**", "PERson → perso**NAL**ity · GENerous → gene**ROS**ity · creATE → crea**TIV**ity · reSPONsible → responsi**BIL**ity", "a**BIL**ity · curi**OS**ity · oppor**TU**nity · uni**VER**sity"],
        ],
      },
      { t: "note", title: "⚠️ Người Việt hay sai", items: ["Nhấn vào âm cuối: ~~educaTION~~, ~~personaliTY~~ → edu**CA**tion, perso**NAL**ity. Âm cuối -tion đọc rất nhẹ /ʃn/.", "Giữ trọng âm của từ gốc: ~~ENergetic~~ → ener**GET**ic; ~~GENerosity~~ → gene**ROS**ity.", "Âm không nhấn đọc lướt thành /ə/: per-sə-**NAL**-ə-ti, không đọc rõ từng chữ “per-son-na-li-ty”."] },
      {
        t: "phatam", id: "t3d7-phat-am", title: "Luyện phát âm — trọng âm theo hậu tố -tion / -ic / -ity",
        note: "Bấm “Nghe mẫu”, gõ tay xuống bàn ở âm tiết nhấn, rồi “Đọc & chấm”. Dòng 1–6: cặp từ gốc → từ có hậu tố; dòng 7–10: câu dùng được trong bài Part 2.",
        items: [
          { text: "educate, education", ipa: "edʒukeɪt edʒukeɪʃn", vi: "EDucate → eduCAtion" },
          { text: "determine, determination", ipa: "dɪtɜːmɪn dɪtɜːmɪneɪʃn", vi: "deTERmine → determiNAtion" },
          { text: "energy, energetic", ipa: "enədʒi enədʒetɪk", vi: "ENergy → enerGETic" },
          { text: "optimist, optimistic", ipa: "ɒptɪmɪst ɒptɪmɪstɪk", vi: "OPtimist → optiMIStic" },
          { text: "person, personality", ipa: "pɜːsn pɜːsənæləti", vi: "PERson → persoNALity" },
          { text: "generous, generosity", ipa: "dʒenərəs dʒenərɒsəti", vi: "GENerous → geneROSity" },
          { text: "He is energetic, optimistic and realistic.", ipa: "hiː ɪz enədʒetɪk ɒptɪmɪstɪk ənd riːəlɪstɪk", vi: "ba từ -ic: nhấn GET · MIS · LIS" },
          { text: "Her determination and generosity changed my life.", ipa: "hɜː dɪtɜːmɪneɪʃn ənd dʒenərɒsəti tʃeɪndʒd maɪ laɪf", vi: "determiNAtion · geneROSity" },
          { text: "What I admire most is his sense of responsibility.", ipa: "wɒt aɪ ədmaɪə məʊst ɪz hɪz sens əv rɪspɒnsəbɪləti", vi: "responsiBILity — 6 âm tiết, nhấn BIL" },
          { text: "She gave me the opportunity and the motivation to continue my education.", ipa: "ʃiː ɡeɪv miː ði ɒpətjuːnəti ənd ðə məʊtɪveɪʃn tə kəntɪnjuː maɪ edʒukeɪʃn", vi: "opporTUnity · motiVAtion · eduCAtion" },
        ],
      },
      {
        t: "mcq", id: "t3d7-noi-trong-am", title: "Âm tiết nào được nhấn? (6 câu)",
        items: [
          { q: "enthusiastic", options: ["EN-thu-si-as-tic", "en-THU-si-as-tic", "en-thu-si-AS-tic", "en-thu-si-as-TIC"], correct: 2, why: "-ic ⇒ nhấn âm tiết ngay trước: enthusi**AS**tic. (Danh từ: en**THU**siasm.)" },
          { q: "creativity", options: ["cre-a-TIV-i-ty", "CRE-a-tiv-i-ty", "cre-A-tiv-i-ty", "cre-a-tiv-i-TY"], correct: 0, why: "-ity ⇒ crea**TIV**ity. (Động từ: cre**ATE**; tính từ: cre**A**tive.)" },
          { q: "communication", options: ["COM-mu-ni-ca-tion", "com-MU-ni-ca-tion", "com-mu-ni-ca-TION", "com-mu-ni-CA-tion"], correct: 3, why: "-tion ⇒ communi**CA**tion. (Động từ: com**MU**nicate.)" },
          { q: "sympathetic", options: ["SYM-pa-thet-ic", "sym-pa-THET-ic", "sym-PA-thet-ic", "sym-pa-thet-IC"], correct: 1, why: "-ic ⇒ sympa**THET**ic. (Danh từ: **SYM**pathy.)" },
          { q: "curiosity", options: ["CU-ri-os-i-ty", "cu-RI-os-i-ty", "cu-ri-OS-i-ty", "cu-ri-os-i-TY"], correct: 2, why: "-ity ⇒ curi**OS**ity. (Tính từ: **CU**rious.)" },
          { q: "decision", options: ["de-CI-sion", "DE-ci-sion", "de-ci-SION", "cả ba đều được"], correct: 0, why: "-sion ⇒ de**CI**sion /dɪˈsɪʒn/. (Động từ: de**CIDE**.)" },
        ],
      },

      { t: "h", text: "9. Luyện nói — ghi âm, AI chấm" },
      { t: "p", text: "Cách luyện: (1) bấm giờ **1 phút**, ghi 4 ô từ khoá về **người thật của bạn**; (2) ghi âm, nói tới khi đủ **2 phút**; (3) nghe lại, tự đánh dấu: có 2 tính cách + 2 chuyện chưa? có **I used to… → I've become…** chưa? có ít nhất 2 câu **verb + me + to V** chưa? (4) ghi lại lần hai. Chép bài nói tốt nhất vào **sổ Speaking** (thói quen từ Ngày 2)." },
      {
        t: "speak", id: "t3d7-noi-part2", part: "2",
        questions: [
          "Describe a person who has had an important influence on your life. You should say: who this person is, how long you have known him or her, what qualities this person has, and explain how this person has influenced you.",
          "Describe a teacher who helped you a lot. You should say: what subject he or she taught, when he or she taught you, what he or she was like, and explain how this teacher helped you.",
          "Describe a person you know who is good at their job. You should say: who this person is, what job he or she does, how you know this person, and explain why you think he or she is good at this job.",
        ],
      },
      {
        t: "speak", id: "t3d7-noi-hoi-them", part: "3",
        questions: [
          "Who usually has more influence on young people: their parents or their friends?",
          "What qualities does a person need to be a good role model?",
          "Do you think famous people have a responsibility to set a good example?",
        ],
      },
      { t: "note", title: "📌 Câu hỏi nối sang Part 3 — gợi ý ngắn", items: ["Parents or friends? → **It depends on their age**: children are mostly influenced by parents, whereas teenagers tend to listen to friends. (trục chia nhóm theo tuổi — Ngày 6)", "Good role model? → 2 tính cách trong ngân hàng + lý do: I'd say a role model needs to be **principled** and **down-to-earth**, because young people copy what you do, not what you say.", "Famous people? → đồng ý một phần: To some extent, yes, because… However, … (học kỹ ở Ngày 10)."] },
    ],
  },

  /* ═══════════════════════ BÀI TẬP VỀ NHÀ ═══════════════════════ */
  {
    id: "t3d7-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 7 — verb patterns · -ed / -ing · Short-answer · trọng âm hậu tố",
    goal: "Tự kiểm cả ngày bằng 40 câu có đáp án và một bài nói Part 2; đúng từ 28 câu trở lên là đạt.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Cách làm",
        items: [
          "Làm một mạch, **không mở lại bài học**. Chấm xong mới xem giải thích.",
          "Phần I–IV: ngữ pháp bài 1 (29 câu). Phần V: Short-answer trên một đoạn khoa học ngắn (6 câu). Phần VI: trọng âm (5 câu). Phần VII: nói.",
          "Đích: **≥ 28/40**. Phần nào dưới 70 % ⇒ học lại đúng mục ghi ở cuối phần đó.",
          "Câu sai chép vào **Sổ lỗi** kèm câu đúng — hôm sau làm lại riêng những câu đó.",
        ],
      },

      { t: "h", text: "Phần I — Chọn dạng đúng (10 câu)" },
      {
        t: "mcq", id: "t3d7-bt-chon", title: "V-ing · to V · V nguyên mẫu",
        items: [
          { q: "Cheaper flights have enabled millions of people ___ abroad.", options: ["travel", "to travel", "travelling", "travelled"], correct: 1, why: "enable + O + **to V**." },
          { q: "I regret ___ so much time on social media last year.", options: ["to waste", "waste", "wasting", "to be wasted"], correct: 2, why: "Hối tiếc việc **đã** làm → regret + **V-ing**." },
          { q: "The teacher made the whole class ___ the test again.", options: ["take", "to take", "taking", "took"], correct: 0, why: "make + O + **V** (không to)." },
          { q: "Many employees object to ___ at weekends.", options: ["work", "be working", "worked", "working"], correct: 3, why: "object **to** — giới từ → **V-ing**." },
          { q: "The bridge is believed ___ by the Romans.", options: ["to build", "to have been built", "building", "to have built"], correct: 1, why: "Việc đã xảy ra + cầu **được** xây → **to have been built**." },
          { q: "High rents prevent young couples ___ a family.", options: ["to start", "starting to", "from starting", "of starting"], correct: 2, why: "prevent + O + **from + V-ing**." },
          { q: "After working as a nurse for ten years, she went on ___ a doctor.", options: ["to become", "becoming", "become", "became"], correct: 0, why: "Chuyển sang giai đoạn kế tiếp → go on + **to V**." },
          { q: "It's not worth ___ a car if you live in the city centre.", options: ["to buy", "buy", "bought", "buying"], correct: 3, why: "It is (not) worth + **V-ing**." },
          { q: "My doctor suggested ___ less coffee.", options: ["me to drink", "drinking", "to drink", "me drinking"], correct: 1, why: "suggest + **V-ing** (hoặc suggest that I drink). Không có suggest + O + to V." },
          { q: "Most children hate ___ what to do.", options: ["telling", "to tell", "being told", "be told"], correct: 2, why: "Trẻ **bị** bảo → bị động của V-ing: **being told**." },
        ],
      },
      { t: "p", text: "Sai từ 4 câu ⇒ học lại bài 1, mục 2–5." },

      { t: "h", text: "Phần II — Viết dạng đúng của động từ (8 câu)" },
      {
        t: "quiz", id: "t3d7-bt-dang", title: "Viết dạng đúng của động từ trong ngoặc", kind: "fill",
        items: [
          { q: "Don't forget ___ (lock) the door when you leave.", answers: ["to lock"] },
          { q: "City life means ___ (deal) with noise and crowds every day.", answers: ["dealing"] },
          { q: "The government has failed ___ (reduce) youth unemployment.", answers: ["to reduce"] },
          { q: "Older workers are not used to ___ (learn) new software so quickly.", answers: ["learning"] },
          { q: "Zoos let children ___ (see) animals they would never meet in the wild.", answers: ["see"] },
          { q: "The number of visitors is expected ___ (double) by 2035.", answers: ["to double"] },
          { q: "These old flats need ___ (renovate) before anyone can live in them.", answers: ["renovating", "to be renovated"] },
          { q: "She has difficulty ___ (understand) fast speech.", answers: ["understanding", "in understanding"] },
        ],
      },

      { t: "h", text: "Phần III — -ed hay -ing? (6 câu)" },
      {
        t: "quiz", id: "t3d7-bt-ed-ing", title: "Viết dạng tính từ đúng của từ trong ngoặc", kind: "fill",
        items: [
          { q: "I was ___ (surprise) by how friendly the neighbours were.", answers: ["surprised"] },
          { q: "Long meetings are ___ (exhaust) for everyone.", answers: ["exhausting"] },
          { q: "Are you ___ (interest) in architecture?", answers: ["interested"] },
          { q: "The ___ (rise) cost of living worries many families.", answers: ["rising"] },
          { q: "He gave a very ___ (motivate) speech to the new students.", answers: ["motivating"] },
          { q: "Customers were not ___ (satisfy) with the service.", answers: ["satisfied"] },
        ],
      },
      { t: "p", text: "Sai từ 2 câu ⇒ học lại bài 1, mục 6." },

      { t: "h", text: "Phần IV — Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz", id: "t3d7-bt-dich", title: "Dịch sang tiếng Anh", kind: "translate", grammar: "verb + O + to V · giới từ + V-ing · is said to · adj-ed / adj-ing",
        items: [
          { q: "Công nghệ cho phép bác sĩ phát hiện bệnh sớm hơn.", answers: ["Technology enables doctors to detect diseases earlier.", "Technology allows doctors to detect diseases earlier.", "Technology enables doctors to detect illnesses earlier.", "Technology allows doctors to detect disease earlier.", "Technology enables doctors to detect disease earlier."], hint: "enable / allow + O + to V · detect" },
          { q: "Thuế cao ngăn nhiều người mua ô tô.", answers: ["High taxes prevent many people from buying cars.", "High taxes stop many people from buying cars.", "High taxes prevent many people from buying a car.", "High taxes discourage many people from buying cars."], hint: "prevent + O + from + V-ing" },
          { q: "Người ta nói đi bộ là bài tập tốt nhất cho người cao tuổi.", answers: ["Walking is said to be the best exercise for elderly people.", "Walking is said to be the best exercise for older people.", "Walking is said to be the best exercise for the elderly.", "Walking is said to be the best form of exercise for older people."], hint: "S + is said to + V" },
          { q: "Tôi rất mong được làm việc với anh.", answers: ["I am looking forward to working with you.", "I'm looking forward to working with you.", "I look forward to working with you.", "I am really looking forward to working with you.", "I'm really looking forward to working with you."], hint: "look forward to + V-ing" },
          { q: "Bài giảng dài và khó hiểu đến mức nhiều sinh viên thấy chán.", answers: ["The lecture was so long and confusing that many students felt bored.", "The lecture was so long and confusing that many students were bored.", "The lecture was so long and confusing that many students got bored.", "The lecture was so long and confusing that a lot of students felt bored."], hint: "so … that · confusing (bài giảng) · bored (sinh viên)" },
        ],
      },

      { t: "h", text: "Phần V — Short-answer: đoạn khoa học ngắn (6 câu)" },
      {
        t: "passage",
        title: "Why Leaves Change Colour",
        paras: [
          { text: "Leaves are green because they contain chlorophyll, the pigment (a coloured substance) that captures the sunlight a leaf uses to turn water and carbon dioxide into sugar. Throughout spring and summer, a tree goes on producing fresh chlorophyll, so the green colour hides everything else. As the days shorten in autumn, however, the tree stops making it, and the chlorophyll that remains breaks down within a few weeks. Yellow and orange pigments known as carotenoids, which have been present in the leaf all year, then become visible." },
          { text: "Red is different. It comes from pigments called anthocyanins, which many trees manufacture mainly in autumn, using sugar trapped in the leaf. Because sunny days increase the amount of sugar and cool nights prevent it from leaving the leaf, the brightest reds follow a period of bright, dry weather. Scientists are still debating why trees invest energy in red leaves; one suggestion is that the pigment works as a sunscreen, protecting the leaf while the tree recovers useful nutrients from it." },
        ],
      },
      { t: "p", text: "Answer the questions below. Choose **NO MORE THAN THREE WORDS** from the passage for each answer." },
      {
        t: "quiz", id: "t3d7-bt-doc", title: "Questions 1–6 — NO MORE THAN THREE WORDS", kind: "fill",
        items: [
          { q: "(1) What does a leaf make out of water and carbon dioxide?", answers: ["sugar"] },
          { q: "(2) How long does it take for the leftover chlorophyll to disappear?", answers: ["a few weeks"] },
          { q: "(3) What is the name of the yellow and orange pigments that are in the leaf all year?", answers: ["carotenoids"] },
          { q: "(4) In which season do many trees produce anthocyanins?", answers: ["autumn", "in autumn"] },
          { q: "(5) What kind of nights keep sugar inside the leaf?", answers: ["cool", "cool nights"] },
          { q: "(6) According to one theory, what does the red pigment act as?", answers: ["a sunscreen", "sunscreen"] },
        ],
      },
      { t: "note", title: "Giải thích Phần V", items: ["**(1) sugar** — “the sunlight a leaf uses to **turn water and carbon dioxide into sugar**”; make out of = turn … into. (Chlorophyll chỉ **bắt ánh sáng**; lá dùng năng lượng đó để làm ra đường.)", "**(2) a few weeks** — “the chlorophyll that remains **breaks down within a few weeks**”; leftover = that remains; disappear = breaks down. Đừng bỏ “a”: few weeks = “chẳng mấy tuần”, đổi nghĩa.", "**(3) carotenoids** — tín hiệu định nghĩa **known as**; in the leaf all year = have been present in the leaf all year. Bẫy: anthocyanins (màu đỏ, chỉ có vào mùa thu).", "**(4) autumn** — “manufacture **mainly in autumn**”; produce = manufacture.", "**(5) cool (nights)** — “**cool nights prevent it from leaving** the leaf”; keep inside = prevent from leaving (verb pattern của bài 1!). Bẫy: sunny days — làm **tăng** lượng đường, không giữ đường.", "**(6) (a) sunscreen** — “**one suggestion** is that the pigment **works as a sunscreen**”; theory = suggestion; act as = work as."] },
      { t: "p", text: "Sai từ 3 câu ⇒ học lại bài 2, mục 1 (từ hỏi → loại đáp án) và mục 2 (tín hiệu định nghĩa)." },

      { t: "h", text: "Phần VI — Trọng âm theo hậu tố (5 câu)" },
      {
        t: "mcq", id: "t3d7-bt-trong-am", title: "Chọn từ có trọng âm đặt ĐÚNG (chữ hoa = nhấn)",
        items: [
          { q: "motivation", options: ["MO-ti-va-tion", "mo-TI-va-tion", "mo-ti-VA-tion", "mo-ti-va-TION"], correct: 2, why: "-tion ⇒ nhấn âm tiết ngay trước: moti**VA**tion." },
          { q: "realistic", options: ["RE-a-lis-tic", "re-a-LIS-tic", "re-A-lis-tic", "re-a-lis-TIC"], correct: 1, why: "-ic ⇒ rea**LIS**tic." },
          { q: "opportunity", options: ["op-por-TU-ni-ty", "OP-por-tu-ni-ty", "op-POR-tu-ni-ty", "op-por-tu-NI-ty"], correct: 0, why: "-ity ⇒ oppor**TU**nity." },
          { q: "academic", options: ["A-ca-dem-ic", "a-CA-dem-ic", "a-ca-dem-IC", "a-ca-DEM-ic"], correct: 3, why: "-ic ⇒ aca**DEM**ic. (Danh từ: a**CAD**emy.)" },
          { q: "responsibility", options: ["re-SPON-si-bil-i-ty", "re-spon-si-BIL-i-ty", "RE-spon-si-bil-i-ty", "re-spon-si-bil-I-ty"], correct: 1, why: "-ity ⇒ responsi**BIL**ity. (Tính từ: re**SPON**sible.)" },
        ],
      },

      { t: "h", text: "Phần VII — Nói Part 2 (ghi âm, AI chấm)" },
      { t: "p", text: "1 phút ghi chú 4 ô, nói đủ 2 phút. Bắt buộc có: **2 tính cách band 6 + 2 chuyện**, một câu **I used to…, but thanks to…**, hai câu **verb + me + to V**." },
      {
        t: "speak", id: "t3d7-bt-noi", part: "2",
        questions: [
          "Describe an older person you respect. You should say: who this person is, how you know him or her, what he or she is like, and explain why you respect this person.",
        ],
      },
    ],
  },
];
