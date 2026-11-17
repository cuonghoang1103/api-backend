/**
 * IELTS Tập 3 — Ngày 27 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, câu hỏi, câu trả lời mẫu VIẾT MỚI)
 *   Bài 1 (grammar)   Dấu câu (phẩy · chấm phẩy · hai chấm · gạch ngang · comma splice / run-on) + hệ thống lỗi
 *                     (hoà hợp S–V · song song · dangling modifier · nhất quán thì) + bảng tự soát 6 lượt lần 1   [G32 G43]
 *                     — nối Tập 2 Ngày 17 (run-on, câu lê thê, And/But/So) · Ngày 23 · Ngày 24 (soát cả đoạn biết trước số lỗi)
 *   Bài 2 (reading)   Reading đủ 3 passage · 40 câu · 60 phút — lần 2 (lần 1: Tập 2 Ngày 24)                       [R20]
 *                     — P1 The Humble Pencil · P2 Bees on the Roof · P3 Doing Two Things at Once
 *   Bài 3 (speaking)  Fluency 2: không im > 3 giây · tự sửa đúng cách · paraphrase câu hỏi · kết câu dứt khoát ·
 *                     ghi âm tự chấm                                                                                [S09 S10]
 *                     — nối Tập 3 Ngày 11 (chunks, quên từ) · Tập 2 Ngày 5 · 9 · 13 · 🔊 tự chẩn lại 44 âm (so với Ngày 1)
 *   Bài tập Ngày 27   39 câu có đáp án
 * Mọi id bắt đầu `t3d27-`.
 */
import type { Lesson } from '../data';

export const NGAY_27: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t3d27-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Dấu câu + hệ thống lỗi + bảng tự soát 6 lượt (lần 1)",
    goal: "Đặt đúng dấu phẩy, chấm phẩy, hai chấm, gạch ngang trong câu học thuật; sửa được comma splice và run-on bằng 4 cách; bắt được lỗi hoà hợp chủ ngữ – động từ, lỗi song song, dangling modifier và lỗi đổi thì; rồi tự soát một bài viết theo 6 lượt trong 3–4 phút — đẩy GRA band 6 (lỗi hiếm khi làm sai nghĩa) và chuẩn bị cho mốc band 7 “kiểm soát tốt dấu câu”.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Dấu phẩy**: 5 chỗ PHẢI có và 3 chỗ KHÔNG được có. Sai dấu phẩy là lỗi GRA, không phải lỗi “trình bày”.",
          "**Comma splice / run-on** (ôn Tập 2 Ngày 17): hai câu đủ S–V không được nối chỉ bằng dấu phẩy — có **4 cách sửa**.",
          "**Chấm phẩy ( ; ) · hai chấm ( : ) · gạch ngang ( — )**: mỗi dấu một việc; dùng đúng 1–2 lần trong bài là đủ.",
          "**Hệ thống lỗi**: hoà hợp S–V, song song, dangling modifier, nhất quán thì — bốn lỗi giám khảo đếm nhiều nhất ở band 5.",
          "**Bảng tự soát 6 lượt**: mỗi lượt chỉ tìm MỘT loại lỗi. Soát kiểu “đọc lại xem có sai gì không” thì không bắt được lỗi của chính mình.",
          "Cuối bài: một đoạn bài luận có **đúng 18 lỗi** — biết trước số lỗi, tự chấm theo % (nối Tập 2 Ngày 23 · 24).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 17 · 24: câu là gì, và vì sao dấu câu quyết định điểm GRA" },
      {
        t: "p",
        text: "Ở Tập 2 bạn đã biết: một **câu** (sentence) phải có ít nhất một **mệnh đề độc lập** (independent clause) — tức một cụm có **chủ ngữ + động từ chia thì** và đứng một mình được. Dấu câu là thứ cho người đọc biết mệnh đề nào kết thúc ở đâu. Band 5 bị trừ điểm vì ==hai câu dính vào nhau== hoặc ==nửa câu đứng một mình==; band 7 yêu cầu “kiểm soát tốt dấu câu”. Bài này lấp khoảng giữa.",
      },
      {
        t: "table",
        caption: "Ba khái niệm dùng suốt bài",
        head: ["Thuật ngữ", "Nghĩa", "Ví dụ"],
        rows: [
          ["**Mệnh đề độc lập** (independent clause)", "Có S + V, đứng một mình thành câu", "Cities are growing."],
          ["**Mệnh đề phụ thuộc** (dependent clause)", "Có S + V nhưng mở đầu bằng because / although / when / if / which… → KHÔNG đứng một mình được", "because cities are growing"],
          ["**Cụm từ** (phrase)", "Không đủ S + V", "in recent years · growing rapidly"],
        ],
      },
      {
        t: "mcq",
        id: "t3d27-on-cau",
        title: "Kiểm tra đầu bài — câu nào viết ĐÚNG? (5 câu)",
        items: [
          { q: "1.", options: ["Many people work from home, they save time.", "Many people work from home, so they save time.", "Many people work from home they save time."], correct: 1, why: "Hai mệnh đề độc lập cần **, + so** (liên từ). A là comma splice (chỉ có dấu phẩy); C là run-on (không có gì nối)." },
          { q: "2.", options: ["Because public transport is cheap.", "Because public transport is cheap, and popular.", "Public transport is popular because it is cheap."], correct: 2, why: "Mệnh đề because không đứng một mình được (câu cụt — fragment). C gắn nó vào một mệnh đề độc lập." },
          { q: "3.", options: ["However, the cost is high.", "However the cost, is high.", "However the cost is high."], correct: 0, why: "Từ nối đứng đầu câu (However, Moreover, Therefore…) luôn có **dấu phẩy ngay sau**." },
          { q: "4.", options: ["And this problem is serious.", "So, this problem is serious and.", "This problem is also serious."], correct: 2, why: "Trong bài thi nên tránh mở câu bằng And / But / So (Tập 2 Ngày 17) — giám khảo coi đó là văn nói. Dùng also / In addition / However / Therefore." },
          { q: "5.", options: ["The city built a metro. As a result, traffic fell and new shops opened.", "The city built a metro and the traffic fell and people were happy and shops opened.", "The city built a metro, the traffic fell, people were happy."], correct: 0, why: "B là câu lê thê (3 chữ and nối 4 mệnh đề); C là comma splice hai lần. A tách câu và dùng từ nối đúng vai." },
        ],
      },
      { t: "rule", formula: "Một câu = ít nhất 1 mệnh đề độc lập (S + V) · dấu phẩy KHÔNG đủ sức nối 2 mệnh đề độc lập", vi: "Mọi luật dấu câu trong bài này đều suy ra từ dòng này." },

      /* ── 2 ── */
      { t: "h", text: "2. Dấu phẩy — 5 chỗ PHẢI có" },
      {
        t: "p",
        text: "Tiếng Việt đặt dấu phẩy theo **chỗ ngắt hơi**. Tiếng Anh đặt dấu phẩy theo **cấu trúc câu**. Vì thế người Việt vừa thiếu dấu phẩy ở chỗ bắt buộc, vừa thừa ở chỗ cấm. Học thuộc 5 chỗ sau là đủ cho bài thi.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Mệnh đề phụ / trạng ngữ dài đứng ĐẦU câu + , + S + V",
            vi: "Phần mở đầu (Although…, If…, When…, In recent years, …) xong thì đặt dấu phẩy rồi mới tới chủ ngữ chính. Mệnh đề phụ đứng SAU thì thường không cần phẩy.",
            examples: [
              { en: "Although online courses are cheaper, many students still prefer face-to-face classes.", vi: "Dù khoá học trực tuyến rẻ hơn, nhiều sinh viên vẫn thích lớp học trực tiếp." },
              { en: "Many students still prefer face-to-face classes although online courses are cheaper.", vi: "(Mệnh đề although đứng sau → không cần dấu phẩy.)" },
            ],
          },
          {
            formula: "S + V + , + and / but / so / or / yet + S + V",
            vi: "Nối HAI mệnh đề độc lập bằng liên từ thì đặt phẩy TRƯỚC liên từ. Nếu sau and không có chủ ngữ mới thì không phẩy.",
            examples: [
              { en: "The government raised fuel taxes, but car use did not fall.", vi: "Chính phủ tăng thuế nhiên liệu, nhưng việc dùng ô tô không giảm." },
              { en: "The government raised fuel taxes and invested in buses.", vi: "(Một chủ ngữ, hai động từ → không phẩy trước and.)" },
            ],
          },
          {
            formula: "A, B(,) and C",
            vi: "Liệt kê từ ba thứ trở lên. Dấu phẩy trước and (Oxford comma) có hay không đều đúng — chọn một kiểu và giữ suốt bài.",
            examples: [{ en: "The scheme reduced noise, pollution and congestion.", vi: "Chương trình đã giảm tiếng ồn, ô nhiễm và tắc nghẽn." }],
          },
          {
            formula: "S + , + which / who + thông tin THÊM + , + V",
            vi: "Mệnh đề quan hệ không xác định (Ngày 17): bỏ đi câu vẫn đủ nghĩa → kẹp giữa HAI dấu phẩy. Cụm chêm (however, for example, in fact) giữa câu cũng kẹp hai phẩy.",
            examples: [
              { en: "Singapore, which has very little land, imports most of its food.", vi: "Singapore, nơi có rất ít đất, nhập khẩu phần lớn lương thực." },
              { en: "Older workers, however, may find the change difficult.", vi: "Tuy nhiên, người lao động lớn tuổi có thể thấy thay đổi này khó khăn." },
            ],
          },
          {
            formula: "Từ nối đầu câu + , + S + V",
            vi: "However, / Moreover, / Therefore, / In addition, / For example, / As a result, / Overall, / In conclusion,",
            examples: [{ en: "Overall, the number of visitors rose in all four cities.", vi: "Nhìn chung, số khách tăng ở cả bốn thành phố." }],
          },
        ],
      },
      { t: "rule", formula: "Phẩy sau phần MỞ ĐẦU · trước FANBOYS nối 2 mệnh đề · giữa các mục LIỆT KÊ · KẸP thông tin thêm · sau TỪ NỐI đầu câu", vi: "FANBOYS = for, and, nor, but, or, yet, so — bảy liên từ nối hai mệnh đề ngang hàng." },
      {
        t: "quiz",
        id: "t3d27-phay-dich",
        title: "Dịch sang tiếng Anh — đặt đúng dấu phẩy (5 câu)",
        kind: "translate",
        grammar: "Mở đầu + , + S + V · S + V, but/so + S + V · A, B and C · S, which …, V · However, + S + V",
        items: [
          { q: "Nếu giá vé giảm, nhiều người sẽ đi xe buýt hơn.", hint: "If + fares fall, … will take the bus", answers: ["If fares fall, more people will take the bus.", "If ticket prices fall, more people will take the bus.", "If fares fall, more people will travel by bus.", "If ticket prices fall, more people will travel by bus.", "If fares are reduced, more people will take the bus."] },
          { q: "Thành phố đã xây một sân bay mới, nhưng số du khách không tăng.", hint: "…, but the number of tourists did not rise", answers: ["The city built a new airport, but the number of tourists did not rise.", "The city built a new airport, but the number of tourists did not increase.", "The city built a new airport, but the number of visitors did not rise.", "The city built a new airport, but tourist numbers did not rise."] },
          { q: "Học sinh cần sách, máy tính và giáo viên giỏi.", hint: "need books, computers and good teachers", answers: ["Students need books, computers and good teachers.", "Students need books, computers, and good teachers.", "Pupils need books, computers and good teachers."] },
          { q: "Hà Nội, nơi có hơn tám triệu dân, đang xây thêm các tuyến tàu điện.", hint: "Hanoi, which has …, is building more metro lines", answers: ["Hanoi, which has more than eight million people, is building more metro lines.", "Hanoi, which has over eight million people, is building more metro lines.", "Hanoi, which has more than eight million residents, is building more metro lines.", "Hanoi, which has over eight million residents, is building more metro lines.", "Hanoi, which has more than eight million inhabitants, is building more metro lines."] },
          { q: "Tuy nhiên, chi phí vẫn còn cao.", hint: "However, … remains high", answers: ["However, the cost remains high.", "However, the cost is still high.", "However, costs remain high.", "However, the costs are still high.", "However, costs are still high."] },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Dấu phẩy — 3 chỗ KHÔNG được có (+ 1 chỗ nên bỏ)" },
      {
        t: "table",
        caption: "Ba chỗ cấm + một chỗ nên bỏ — người Việt hay đặt thừa dấu phẩy",
        head: ["Chỗ cấm", "Sai", "Đúng"],
        rows: [
          ["Giữa **chủ ngữ dài** và **động từ**", "~~The number of people who work from home, has doubled.~~", "The number of people who work from home **has doubled**."],
          ["Trước **that** (mệnh đề danh ngữ / quan hệ xác định)", "~~Many people believe, that technology isolates us.~~", "Many people believe **that** technology isolates us."],
          ["Quanh mệnh đề quan hệ **xác định** (bỏ đi thì câu đổi nghĩa)", "~~Students, who study abroad, become more independent.~~", "Students **who study abroad** become more independent."],
          ["(Nên bỏ) Trước **because** đứng sau", "~~Sales fell, because prices rose.~~", "Sales fell **because** prices rose."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: một dấu phẩy đổi nghĩa cả câu",
        items: [
          "Students **who study abroad** become more independent. → chỉ nhóm sinh viên đi du học.",
          "Students**, who study abroad,** become more independent. → MỌI sinh viên đều đi du học (vô lý). Kẹp phẩy = “thông tin thêm cho tất cả”.",
          "Phép thử: bỏ mệnh đề đi. Câu còn đúng ý bạn muốn nói ⇒ kẹp hai phẩy. Câu thành nói về “tất cả” trong khi bạn chỉ nói một nhóm ⇒ không phẩy.",
          "**that** không bao giờ dùng trong mệnh đề có phẩy: ~~Hanoi, that is the capital,~~ → Hanoi, **which** is the capital,",
        ],
      },
      { t: "rule", formula: "KHÔNG phẩy giữa S và V · KHÔNG phẩy trước that · KHÔNG phẩy quanh mệnh đề quan hệ xác định", vi: "Chủ ngữ dài tới đâu cũng không được tách khỏi động từ của nó bằng một dấu phẩy." },
      {
        t: "mcq",
        id: "t3d27-phay-chon",
        title: "Câu nào đặt dấu phẩy ĐÚNG? (6 câu)",
        items: [
          { q: "1.", options: ["In 2020 the figure, stood at 40%.", "In 2020, the figure stood at 40%.", "In 2020 the figure stood, at 40%."], correct: 1, why: "Trạng ngữ thời gian mở đầu + phẩy; không tách S (the figure) khỏi V (stood)." },
          { q: "2.", options: ["People who smoke are more likely to develop heart disease.", "People, who smoke, are more likely to develop heart disease.", "People who smoke, are more likely to develop heart disease."], correct: 0, why: "who smoke xác định nhóm người nào → không phẩy. C tách chủ ngữ khỏi động từ." },
          { q: "3.", options: ["Some experts argue, that robots will create new jobs.", "Some experts argue that, robots will create new jobs.", "Some experts argue that robots will create new jobs."], correct: 2, why: "Không có dấu phẩy nào trước hay sau that." },
          { q: "4.", options: ["The museum, which opened in 1990 attracts two million visitors a year.", "The museum, which opened in 1990, attracts two million visitors a year.", "The museum which opened in 1990, attracts two million visitors a year."], correct: 1, why: "Thông tin thêm phải **kẹp HAI** dấu phẩy — thiếu dấu thứ hai là lỗi rất hay gặp." },
          { q: "5.", options: ["Rents rose sharply, and many families moved out.", "Rents rose sharply and, many families moved out.", "Rents, rose sharply and many families moved out."], correct: 0, why: "Hai mệnh đề độc lập (rents rose · families moved) → phẩy TRƯỚC and." },
          { q: "6.", options: ["Fewer people bought newspapers, because news was free online.", "Fewer people bought newspapers because, news was free online.", "Fewer people bought newspapers because news was free online."], correct: 2, why: "Mệnh đề because đứng sau → thường không phẩy (mục 3)." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Comma splice và run-on — 4 cách sửa" },
      {
        t: "p",
        text: "**Comma splice** = hai mệnh đề độc lập chỉ nối bằng dấu phẩy. **Run-on** = hai mệnh đề độc lập dính liền, không có gì. Tiếng Việt viết “Giá nhà tăng, nhiều người phải thuê nhà” hoàn toàn đúng, nên đây là lỗi dấu câu số một của người Việt. Giám khảo coi mỗi comma splice là một lỗi ngữ pháp.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Gặp hai mệnh đề độc lập đứng cạnh nhau — chọn 1 trong 4 cách",
        steps: [
          { label: "① Dấu chấm", sub: "House prices rose. Many people had to rent." },
          { label: "② , + FANBOYS", sub: "House prices rose, so many people had to rent." },
          { label: "③ Chấm phẩy ( ; )", sub: "House prices rose; many people had to rent." },
          { label: "④ Liên từ phụ thuộc", sub: "Because house prices rose, many people had to rent." },
        ],
        caption: "Sai: ~~House prices rose, many people had to rent.~~ (comma splice) · ~~House prices rose many people had to rent.~~ (run-on)",
      },
      {
        t: "table",
        caption: "Bẫy lớn nhất: however · therefore · moreover KHÔNG phải liên từ",
        head: ["Sai (comma splice)", "Đúng — 2 cách", "Vì sao"],
        rows: [
          ["~~The plan was popular, however it was too expensive.~~", "The plan was popular**. However,** it was too expensive. / The plan was popular**; however,** it was too expensive.", "however là trạng từ nối — nó không có “sức nối” như but."],
          ["~~Fares fell, therefore more people used the bus.~~", "Fares fell**; therefore,** more people used the bus. / Fares fell**, so** more people used the bus.", "Muốn dùng dấu phẩy thì đổi sang so."],
          ["~~Cycling is cheap, moreover it is healthy.~~", "Cycling is cheap**. Moreover,** it is healthy. / Cycling is cheap **and** healthy.", "Câu ngắn thì gộp bằng and gọn hơn."],
          ["~~The number rose, then it fell.~~", "The number rose **and then** fell. / The number rose**; it then** fell.", "then cũng là trạng từ, không phải liên từ."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với comma splice",
        items: [
          "Nối bằng **đại từ**: ~~The government built new roads, it also widened the bridges.~~ → …new roads **and** also widened the bridges. Thấy “, it / , they / , this / , he” giữa câu là phải dừng lại kiểm.",
          "Câu **lê thê** (Tập 2 Ngày 17): sửa comma splice bằng cách thêm and… and… and thì đổi lỗi này lấy lỗi khác. Một câu tối đa **hai** mệnh đề độc lập.",
          "Task 1 hay dính: ~~The figure for cars was 40%, the figure for buses was 25%.~~ → …was 40%**, while** the figure for buses was 25%. / …was 40%**, compared with** 25% for buses.",
          "Sửa bằng liên từ phụ thuộc (because, although, while, whereas) là cách **ăn điểm nhất**: vừa hết lỗi, vừa có câu phức.",
        ],
      },
      { t: "rule", formula: "S + V . S + V  ·  S + V, so/but/and S + V  ·  S + V; S + V  ·  Because/Although S + V, S + V", vi: "Bốn cách sửa comma splice. however / therefore / moreover / then đứng sau dấu chấm hoặc chấm phẩy — không đứng sau dấu phẩy để nối hai câu." },
      {
        t: "quiz",
        id: "t3d27-splice-dich",
        title: "Viết lại cho đúng — dùng từ trong ngoặc (5 câu)",
        kind: "translate",
        grammar: "S + V, so / but + S + V · S + V; however, S + V · Although / Because + S + V, S + V · …, while + S + V",
        items: [
          { q: "Sửa: “The city is crowded, rents are very high.” (so)", hint: "…, so rents are very high", answers: ["The city is crowded, so rents are very high."] },
          { q: "Sửa: “Online shopping is convenient, however it creates a lot of packaging waste.” (dấu chấm phẩy + however)", hint: "…; however, it creates…", answers: ["Online shopping is convenient; however, it creates a lot of packaging waste."] },
          { q: "Sửa: “Electric cars are expensive, more people are buying them.” (Although)", hint: "Although electric cars are expensive, …", answers: ["Although electric cars are expensive, more people are buying them.", "Although electric cars are expensive, more and more people are buying them."] },
          { q: "Sửa: “The figure for men was 60%, the figure for women was 45%.” (while)", hint: "…, while the figure for women was 45%", answers: ["The figure for men was 60%, while the figure for women was 45%.", "The figure for men was 60%, while that for women was 45%."] },
          { q: "Sửa: “Many villages have no doctor, people must travel to the city.” (Because)", hint: "Because many villages have no doctor, …", answers: ["Because many villages have no doctor, people must travel to the city.", "Because many villages have no doctor, people have to travel to the city."] },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Chấm phẩy ( ; ) · hai chấm ( : ) · gạch ngang ( — )" },
      {
        t: "p",
        text: "Ba dấu này ít gặp trong bài band 5 vì người viết sợ sai. Ở band 6–7, dùng đúng **một hoặc hai lần** trong bài cho thấy bạn kiểm soát được dấu câu. Mỗi dấu chỉ có một việc chính.",
      },
      {
        t: "table",
        caption: "Mỗi dấu một việc",
        head: ["Dấu", "Việc chính", "Trước dấu phải là", "Ví dụ"],
        rows: [
          ["**;** chấm phẩy", "Nối hai mệnh đề độc lập **có liên quan chặt** (thay cho dấu chấm)", "Một câu đủ S + V", "Some countries tax sugar**;** others ban advertising aimed at children."],
          ["**; however,**", "Chấm phẩy + trạng từ nối + phẩy", "Một câu đủ S + V", "The drug is effective**; however,** it is expensive."],
          ["**:** hai chấm", "Báo trước một **danh sách**, **lời giải thích** hoặc **ví dụ** cho điều vừa nói", "Một câu ĐÃ ĐỦ NGHĨA", "There are two main causes**:** low wages and high rents."],
          ["**—** gạch ngang", "Chêm thông tin để **nhấn mạnh** (giống hai dấu phẩy nhưng mạnh hơn)", "—", "Three cities **—** Paris, London and Rome **—** attracted most visitors."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Car ownership rose in every region; the increase was greatest in the north.", vi: "Tỉ lệ sở hữu ô tô tăng ở mọi vùng; mức tăng lớn nhất là ở miền bắc. (Task 1: hai ý sát nhau)" },
          { en: "Governments have three options: raise taxes, cut spending or borrow more.", vi: "Chính phủ có ba lựa chọn: tăng thuế, cắt chi tiêu hoặc vay thêm. (Task 2: liệt kê)" },
          { en: "The reason is simple: most people cannot afford to buy a home.", vi: "Lý do rất đơn giản: phần lớn mọi người không đủ tiền mua nhà. (hai chấm = “đó là”)" },
          { en: "Only one country — Japan — saw a fall in population.", vi: "Chỉ một nước — Nhật Bản — có dân số giảm." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi hay sai với ; và :",
        items: [
          "**Hai chấm sau động từ / giới từ**: ~~The main causes are: low wages and high rents.~~ · ~~such as: cars and buses~~ → bỏ dấu hai chấm. Phần TRƯỚC hai chấm phải đứng một mình được.",
          "**Chấm phẩy trước mệnh đề phụ**: ~~Sales fell; because prices rose.~~ → hai bên dấu ; phải là hai câu độc lập.",
          "**Viết hoa sau ; và :** — không. Sau hai dấu này viết chữ thường (trừ tên riêng).",
          "**Gạch ngang** hơi thân mật — trong Writing dùng tối đa một lần; dấu phẩy hoặc ngoặc đơn an toàn hơn. Đừng nhầm với gạch nối ( - ) trong well-known, 20-year-old.",
        ],
      },
      { t: "rule", formula: "S + V ; S + V  ·  S + V (đủ nghĩa) : danh sách / lời giải thích  ·  S — thông tin chêm — V", vi: "Chấm phẩy = “dấu chấm mềm”; hai chấm = “đó là”; gạch ngang = “hai dấu phẩy mạnh”." },
      {
        t: "quiz",
        id: "t3d27-cham-phay-dich",
        title: "Dịch sang tiếng Anh — dùng dấu trong ngoặc (4 câu)",
        kind: "translate",
        grammar: "S + V; S + V · S + V: A, B and C · S + V; however, S + V",
        items: [
          { q: "Có hai giải pháp: tăng thuế và cải thiện giao thông công cộng. ( : )", hint: "There are two solutions: raising… and improving…", answers: ["There are two solutions: raising taxes and improving public transport.", "There are two solutions: to raise taxes and to improve public transport.", "There are two solutions: higher taxes and better public transport."] },
          { q: "Một số người thích sống ở thành phố; những người khác thích nông thôn hơn. ( ; )", hint: "Some people…; others prefer the countryside", answers: ["Some people like living in cities; others prefer the countryside.", "Some people like living in the city; others prefer the countryside.", "Some people enjoy living in cities; others prefer the countryside.", "Some people prefer living in cities; others prefer the countryside.", "Some people like to live in cities; others prefer the countryside."] },
          { q: "Kế hoạch này rẻ; tuy nhiên, nó mất nhiều thời gian. ( ; however, )", hint: "The plan is cheap; however, it takes…", answers: ["The plan is cheap; however, it takes a lot of time.", "This plan is cheap; however, it takes a lot of time.", "The plan is cheap; however, it takes a long time.", "This plan is cheap; however, it takes a long time."] },
          { q: "Lý do rất rõ: giá nhà quá cao. ( : )", hint: "The reason is clear: house prices…", answers: ["The reason is clear: house prices are too high.", "The reason is very clear: house prices are too high.", "The reason is clear: housing prices are too high."] },
        ],
      },
      {
        t: "note",
        title: "📌 Thêm: dấu nháy ( ’ ) — ba luật đủ dùng",
        items: [
          "**Sở hữu**: số ít + ’s (the government**’s** policy); số nhiều tận cùng s + ’ (students**’** results); số nhiều bất quy tắc + ’s (children**’s** health, people**’s** lives).",
          "**its** = của nó (The city lost **its** port). **it’s** = it is — và văn học thuật **không viết tắt** (don’t, it’s, can’t), nên trong Writing gần như không bao giờ có it’s.",
          "Danh từ số nhiều thường **không** có dấu nháy: ~~the 1990’s~~ → the 1990s · ~~car’s are expensive~~ → cars are expensive.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Hoà hợp chủ ngữ – động từ (subject–verb agreement)" },
      {
        t: "p",
        text: "Luật thì đơn giản (chủ ngữ số ít → động từ thêm -s), nhưng trong câu học thuật **chủ ngữ thật** thường nằm xa động từ. Cách soát: gạch chân động từ, rồi hỏi “**cái gì** + động từ này?” và tìm **danh từ chính** — không phải danh từ đứng sát động từ.",
      },
      {
        t: "table",
        caption: "Chín trường hợp hay sai nhất",
        head: ["Chủ ngữ", "Động từ", "Ví dụ"],
        rows: [
          ["**The number of** + N số nhiều", "số ÍT", "The number of cars **has** risen."],
          ["**A number of** + N số nhiều (= nhiều)", "số NHIỀU", "A number of studies **show** this."],
          ["N chính + of / in / with + N khác", "theo N **chính**", "The **cost** of raw materials **is** rising. · The **results** of the survey **are** clear."],
          ["**One of the** + N số nhiều", "số ÍT", "One of the main reasons **is** cost."],
          ["**Each / Every** + N số ít; **everyone, nobody**", "số ÍT", "Every student **has** a laptop."],
          ["Danh từ không đếm được: information, advice, research, traffic, equipment, evidence", "số ÍT", "The evidence **suggests** otherwise."],
          ["**V-ing** / **To V** làm chủ ngữ", "số ÍT", "Learning two languages **improves** memory."],
          ["**There is / are** + N", "theo N đứng SAU", "There **are** several reasons. · There **is** a growing demand."],
          ["N + **who / which / that** + V", "theo N đứng TRƯỚC", "Students who **study** abroad… · A student who **studies** abroad…"],
          ["**people, police, children**; **The + adj** (the rich, the elderly)", "số NHIỀU", "The elderly **need** more care."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai về hoà hợp",
        items: [
          "Quên **-s ngôi ba** khi chủ ngữ là danh từ (không phải he/she/it): ~~The government spend~~ → **spends** · ~~This mean~~ → This **means** · ~~It help~~ → It **helps**.",
          "Bị danh từ gần nhất kéo: ~~The use of mobile phones in classrooms have increased.~~ → **has** (chủ ngữ là the use).",
          "~~The number of tourists are~~ / ~~the percentage of women were~~ trong Task 1 → **is / was**.",
          "Thêm -s cho động từ sau modal hoặc sau to: ~~It can helps~~ · ~~to reduces~~ → can **help**, to **reduce**.",
          "Task 1 quá khứ: was / were là chỗ duy nhất quá khứ còn chia số: The figures **were**… · The figure **was**…",
        ],
      },
      { t: "rule", formula: "Tìm N chính → N số ít / không đếm được / V-ing + V(s/es) · N số nhiều + V", vi: "Bỏ qua mọi cụm of… / in… / who… chen giữa chủ ngữ và động từ." },
      {
        t: "quiz",
        id: "t3d27-hoa-hop",
        title: "Chia động từ trong ngoặc ở HIỆN TẠI ĐƠN hoặc dạng đúng (8 câu)",
        kind: "fill",
        items: [
          { q: "1. The number of people living alone ___ (be) increasing.", answers: ["is"] },
          { q: "2. A number of countries ___ (have) banned plastic bags.", answers: ["have"] },
          { q: "3. One of the biggest problems in large cities ___ (be) air pollution.", answers: ["is"] },
          { q: "4. The information in these reports ___ (suggest) that wages are falling.", answers: ["suggests"] },
          { q: "5. Spending long hours on social media ___ (affect) teenagers’ sleep.", answers: ["affects"] },
          { q: "6. There ___ (be) several reasons for this trend.", answers: ["are"] },
          { q: "7. Children who ___ (read) every day usually have a wider vocabulary.", answers: ["read"] },
          { q: "8. The quality of the products made in these factories ___ (have) improved.", answers: ["has"] },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Cấu trúc song song (parallelism)" },
      {
        t: "p",
        text: "Ở Tập 2 Ngày 17 (mục 8) bạn đã gặp ý này: các thứ nối bằng **and / or / but**, hoặc đứng trong một **danh sách**, phải **cùng dạng ngữ pháp** — cùng là danh từ, cùng là V-ing, cùng là to V, cùng là mệnh đề. Tập 3 nâng nó thành **một lượt soát riêng**: mỗi lần thấy and / or, nhìn sang hai bên xem có “cùng khuôn” không.",
      },
      {
        t: "table",
        caption: "Song song ở 5 vị trí",
        head: ["Vị trí", "Sai", "Đúng"],
        rows: [
          ["Danh sách sau động từ", "~~Students learn to read, writing and how they can count.~~", "Students learn **to read, write and count**."],
          ["Sau giới từ", "~~The city is famous for its food, its history and it has beautiful beaches.~~", "…for **its food, its history and its beaches**."],
          ["Cặp tính từ / danh từ", "~~The process is slow, expensive and wastes energy.~~", "The process is **slow, expensive and wasteful**."],
          ["Cặp liên từ: both…and · either…or · not only…but also", "~~The policy not only reduces traffic but also it is improving air quality.~~", "The policy **not only reduces** traffic **but also improves** air quality."],
          ["So sánh với than / as", "~~Working from home is cheaper than to travel to an office.~~", "**Working** from home is cheaper than **travelling** to an office."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo soát song song trong 20 giây",
        items: [
          "Khoanh mọi chữ **and / or / but / than** trong bài.",
          "Với mỗi chữ, đọc **từ ngay sau nó** và tìm từ **cùng vai** phía trước: reading … and **writing** ✓ · to read … and **writing** ✗.",
          "Task 1 process hay sai: ~~The beans are dried, roasted and then they grind them.~~ → …are **dried, roasted and ground**. (ba V3 dùng chung một chữ are)",
          "Task 2 hay sai: ~~This leads to stress, unhappy and people get sick.~~ → …leads to **stress, unhappiness and illness** (ba danh từ sau to).",
        ],
      },
      { t: "rule", formula: "A and B · A, B and C · not only A but also B · A than B  →  A, B, C cùng dạng (N – N · V-ing – V-ing · to V – V · adj – adj)", vi: "Hai bên của and / or / but / than phải cùng khuôn ngữ pháp." },
      {
        t: "quiz",
        id: "t3d27-song-song",
        title: "Viết dạng đúng của từ trong ngoặc để câu song song (7 câu)",
        kind: "fill",
        items: [
          { q: "1. Regular exercise helps people to lose weight, sleep better and ___ (feeling) less stressed.", answers: ["feel"] },
          { q: "2. The new law aims at reducing waste and ___ (protect) wildlife.", answers: ["protecting"] },
          { q: "3. The water is filtered, heated and then ___ (store) in large tanks.", answers: ["stored"] },
          { q: "4. Teenagers today are more confident, more independent and more ___ (creativity) than before.", answers: ["creative"] },
          { q: "5. Tourism brings both income and ___ (employ) to rural areas.", answers: ["employment"] },
          { q: "6. Cycling to work is healthier than ___ (drive).", answers: ["driving"] },
          { q: "7. Governments should either build more houses or ___ (controlling) rents.", answers: ["control"] },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Dangling modifier — cụm V-ing / V3 đầu câu “treo lơ lửng”" },
      {
        t: "p",
        text: "Ngày 17 bạn đã học rút gọn mệnh đề bằng V-ing / V3. Khi cụm đó đứng **đầu câu**, luật là: ==chủ ngữ ngầm của cụm = chủ ngữ của mệnh đề chính==. Nếu hai chủ ngữ khác nhau, cụm bị “treo” (dangling) và câu nghe buồn cười hoặc sai nghĩa. Tiếng Việt nói “Nhìn vào biểu đồ, số người dùng tăng” rất tự nhiên — tiếng Anh thì không được.",
      },
      {
        t: "table",
        caption: "Ai làm hành động ở đầu câu?",
        head: ["Sai — chủ ngữ không khớp", "Vì sao sai", "Đúng"],
        rows: [
          ["~~Looking at the chart, the number of users rose sharply.~~", "“the number” không biết nhìn biểu đồ.", "**Looking at the chart, we can see** that the number of users rose sharply. / **The chart shows** that…"],
          ["~~After finishing school, a job is hard to find.~~", "“a job” không học xong.", "After finishing school, **young people** find it hard to get a job."],
          ["~~Being very expensive, many families cannot buy houses.~~", "Thứ đắt là nhà, không phải gia đình.", "**Because houses are** very expensive, many families cannot buy them."],
          ["~~Built in 1990, the city opened the stadium to the public.~~", "Thứ được xây là sân vận động.", "Built in 1990, **the stadium** was opened to the public."],
          ["~~To reduce pollution, cars should be banned by the government.~~ (chấp nhận được nhưng yếu)", "Người muốn giảm ô nhiễm là chính phủ.", "To reduce pollution, **the government** should ban cars."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Hai cách sửa — chọn cách dễ hơn",
        items: [
          "**Đổi chủ ngữ mệnh đề chính** cho khớp: After being washed, **the olives** are crushed. (thứ được rửa = ô liu ✓)",
          "**Đổi cụm thành mệnh đề đủ S + V**: ~~Having studied hard, the exam was easy.~~ → **Because she had studied** hard, the exam was easy.",
          "Task 1 **không** mở câu bằng Looking at / Seeing — mở thẳng bằng The chart shows… / It is clear that…",
        ],
      },
      { t: "rule", formula: "V-ing / V3 / To V …, + S (chính là người / vật làm hành động đó) + V", vi: "Trước khi viết cụm V-ing đầu câu, hỏi: “Ai làm?” — câu trả lời phải là chủ ngữ ngay sau dấu phẩy." },
      {
        t: "mcq",
        id: "t3d27-dangling",
        title: "Câu nào KHÔNG bị treo? (5 câu)",
        items: [
          { q: "1.", options: ["Walking to school, the rain started.", "Walking to school, the children got wet in the rain.", "Walking to school, it started to rain."], correct: 1, why: "Người đi bộ là the children — phải là chủ ngữ mệnh đề chính." },
          { q: "2.", options: ["After being picked, the leaves are dried in the sun.", "After being picked, workers dry the leaves in the sun.", "After being picked, the sun dries the leaves."], correct: 0, why: "Thứ được hái là the leaves. B nói công nhân bị hái; C nói mặt trời bị hái." },
          { q: "3.", options: ["Using public transport, pollution can be reduced.", "Using public transport, the air becomes cleaner.", "By using public transport, people can reduce pollution."], correct: 2, why: "Người dùng phương tiện công cộng là people." },
          { q: "4.", options: ["Compared with 2010, the figure was twice as high in 2020.", "Comparing with 2010, the figure was twice as high.", "Compared with 2010, people bought twice as high."], correct: 0, why: "Thứ được so sánh là the figure → V3 **Compared with** + chủ ngữ the figure. Đây là cụm rất hay dùng trong Task 1." },
          { q: "5.", options: ["Having no qualifications, good jobs are difficult to get.", "Having no qualifications, it is difficult to get good jobs.", "Having no qualifications, many young people struggle to get good jobs."], correct: 2, why: "Người không có bằng cấp là many young people." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Nhất quán thì (tense consistency)" },
      {
        t: "p",
        text: "Tiếng Việt không chia thì nên người Việt hay **đổi thì giữa đoạn mà không có lý do**. Luật: chọn một **thì nền** cho đoạn; chỉ đổi thì khi **mốc thời gian đổi** và có từ báo hiệu (in 1990, since then, by 2030, nowadays).",
      },
      {
        t: "table",
        caption: "Thì nền theo loại bài",
        head: ["Bài", "Thì nền", "Được đổi khi"],
        rows: [
          ["Task 1 biểu đồ có năm quá khứ", "**Quá khứ đơn** (rose, stood at, was)", "Câu mở bài: The chart **shows**… (hiện tại) · năm dự báo: **is expected to / will** (Ngày 5)"],
          ["Task 1 không có năm", "**Hiện tại đơn**", "—"],
          ["Task 1 process", "**Hiện tại đơn bị động** (are picked)", "Once it **has been** dried… (hoàn thành để nói bước trước xong)"],
          ["Task 1 map hai năm quá khứ", "**Quá khứ đơn bị động**", "Bản đồ “hiện nay”: **has been** built; kế hoạch: **will be** built (Ngày 28)"],
          ["Task 2", "**Hiện tại đơn** cho ý kiến, sự thật chung", "Ví dụ quá khứ (In 2020, my city **introduced**…); dự đoán (**will / would**)"],
          ["Speaking Part 2 kể chuyện", "**Quá khứ đơn**", "Bối cảnh: was V-ing; việc trước đó: had V3 (Ngày 22)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba kiểu đổi thì sai hay gặp",
        items: [
          "Task 1: ~~In 2010 the figure was 20%, and then it increases to 35% in 2015.~~ → **increased**.",
          "Task 2: ~~Many people think that robots would take our jobs.~~ (không có điều kiện giả định) → **will take**.",
          "Kể chuyện Part 2: ~~I went to Da Lat last year. The weather is cold and we visit a lot of places.~~ → **was** · **visited**.",
        ],
      },
      { t: "rule", formula: "Một đoạn = một thì nền · đổi thì CHỈ khi có mốc thời gian mới (in 1990 → was · since then → has been · by 2030 → will)", vi: "Soát bằng cách gạch chân MỌI động từ chia thì trong đoạn rồi đọc riêng chuỗi động từ đó." },
      {
        t: "quiz",
        id: "t3d27-thi",
        title: "Sửa động từ in trong ngoặc cho nhất quán thì (5 câu)",
        kind: "fill",
        items: [
          { q: "1. In 2005 only 10% of households had internet access, but by 2015 this figure (reaches) ___ 70%.", answers: ["reached", "had reached"] },
          { q: "2. First, the clay is dug out of the ground. Then it (was) ___ mixed with water.", answers: ["is"] },
          { q: "3. Last summer I visited my grandparents. They (live) ___ in a small village then, and we went fishing every day.", answers: ["lived", "were living"] },
          { q: "4. In 1990 the town had two cinemas. Both (are) ___ demolished five years later.", answers: ["were"] },
          { q: "5. Nowadays many young people rent a flat because house prices (were) ___ too high.", answers: ["are"] },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Bảng tự soát 6 lượt — lần 1" },
      {
        t: "p",
        text: "Ở Tập 2 Ngày 24 bạn đã soát bài theo bảng 12 lỗi + 6 lỗi cấp câu trong 3 phút cuối. Từ hôm nay việc soát thành **quy trình 6 lượt**. Ý chính: ==mỗi lượt mắt chỉ tìm MỘT thứ==. Khi đọc lại để “xem có sai gì không”, não bạn đọc **ý**, không đọc **chữ**, nên lỗi của chính mình trượt qua. Sáu lượt nghe nhiều nhưng mỗi lượt chỉ mất 30–40 giây vì bạn chỉ nhìn đúng một loại từ.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "6 lượt soát — 3 đến 4 phút cho một bài Task 2",
        steps: [
          { label: "Lượt 1 · ĐỘNG TỪ", sub: "thì có nhất quán? chủ ngữ số ít có -s? bị động đủ be + V3?" },
          { label: "Lượt 2 · DANH TỪ", sub: "số ít đếm được có a/an/the? số nhiều có -s? không đếm được không thêm -s?" },
          { label: "Lượt 3 · RANH GIỚI CÂU", sub: "comma splice · run-on · câu cụt · dấu phẩy thừa / thiếu · câu > 30 từ" },
          { label: "Lượt 4 · SONG SONG + TỪ LOẠI", sub: "hai bên and/or/than cùng dạng? tính từ hay trạng từ hay danh từ?" },
          { label: "Lượt 5 · LIÊN KẾT", sub: "từ nối đúng vai? this / it / they chỉ cái gì? có lặp một từ nối 3 lần?" },
          { label: "Lượt 6 · CHÍNH TẢ + ĐỀ", sub: "từ hay viết sai, từ dễ nhầm; đủ từ? trả lời đủ mọi vế đề?" },
        ],
      },
      {
        t: "table",
        caption: "Mỗi lượt: nhìn vào đâu — bắt lỗi gì — học ở đâu",
        head: ["Lượt", "Mắt chỉ nhìn", "Lỗi điển hình", "Ôn ở"],
        rows: [
          ["1 Động từ", "Mọi động từ chia thì", "~~The number of cars are~~ · ~~it increase~~ · ~~was happened~~ · đổi thì vô cớ", "Mục 6 · 9; Ngày 1 · 13"],
          ["2 Danh từ", "Mọi danh từ", "~~a information~~ · ~~many student~~ · ~~in the society~~ · thiếu a/the", "Ngày 3 (mạo từ); Ngày 25"],
          ["3 Ranh giới câu", "Mọi dấu phẩy và dấu chấm", "~~…, it…~~ · ~~Because…~~. (câu cụt) · ~~believe, that~~", "Mục 2–5"],
          ["4 Song song + từ loại", "Mọi and / or / than; từ đuôi -ly, -tion, -ive", "~~to read and writing~~ · ~~economic grow~~ · ~~it is importance~~", "Mục 7; Tập 2 Ngày 4"],
          ["5 Liên kết", "Từ đầu mỗi câu; mọi this / it / they", "~~However~~ khi ý không đối lập · ~~On the other hand~~ thay cho In addition · It mơ hồ", "Ngày 21; Tập 2 Ngày 17"],
          ["6 Chính tả + đề", "Từ dài; rồi đọc lại ĐỀ", "~~goverment, enviroment, begining~~ · affect / effect · thiếu ý kiến · thiếu overview", "Ngày 28 (từ dễ nhầm); Ngày 6"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách dùng bảng 6 lượt cho đúng",
        items: [
          "**Khi luyện ở nhà**: làm đủ 6 lượt, mỗi lượt dùng một màu bút. Ghi số lỗi từng lượt vào sổ lỗi (Ngày 2) — sau 5 bài bạn sẽ thấy **2 lượt** nào là của mình.",
          "**Trong phòng thi** (3–4 phút cuối): chỉ làm **lượt 1 + lượt 3 + hai lượt “của mình”**. Không ai kịp cả 6.",
          "Soát **từ câu cuối ngược lên** ở lượt 6 (chính tả) — đọc ngược thì não không đoán trước chữ.",
          "Sửa gọn: gạch một nét, viết lại bên trên. Bài thi máy thì sửa thẳng — nhưng đừng viết lại cả câu khi chỉ còn 2 phút.",
          "Bảng này sẽ dùng lại ở **Ngày 30** (viết lại 2 bài cũ theo sổ lỗi) và nâng thành lần 2 ở Tập 4 Ngày 21.",
        ],
      },
      { t: "rule", formula: "Động từ → Danh từ → Ranh giới câu → Song song + từ loại → Liên kết → Chính tả + đề", vi: "Sáu lượt, mỗi lượt một loại lỗi. Phòng thi: lượt 1 + 3 + hai lượt bạn sai nhiều nhất." },

      /* ── 11 ── */
      { t: "h", text: "11. Thực hành: đoạn bài luận có ĐÚNG 18 lỗi" },
      {
        t: "p",
        text: "**Đề:** Some people think that children should begin learning a foreign language at primary school rather than secondary school. To what extent do you agree or disagree? Dưới đây là bài của một bạn band 5. Bài có **đúng 18 lỗi** — biết trước con số để bạn không dừng lại khi mới tìm được 10. Làm theo 6 lượt, **ghi ra giấy** từng lỗi trước, rồi mới gõ vào ô bên dưới. Mỗi ô đã chỉ sẵn cụm sai: việc của bạn là viết lại cụm đó cho đúng.",
      },
      {
        t: "passage",
        title: "Bài viết cần soát — 18 lỗi (câu đã đánh số)",
        intro: "Phân bố lỗi: lượt 1 có 4 lỗi · lượt 2 có 3 · lượt 3 có 5 · lượt 4 có 3 · lượt 5 có 2 · lượt 6 có 1.",
        paras: [
          { label: "1", text: "(1) Nowadays, the number of primary schools that teach a foreign language are increasing in many countries. (2) Some people believe that young children learn languages easily, they think lessons should start as early as possible. (3) I agree with this view for two main reason." },
          { label: "2", text: "(4) Firstly, young children are good at copying sounds, remembering new words and to speak without fear of mistakes. (5) For example, my younger cousin start learning English when she was six, and now she speak it more confidently than I do. (6) Because her teacher used songs and games instead of grammar rules." },
          { label: "3", text: "(7) However, an early start also has practical benefits for the country. (8) Students who begin at six have ten years of practice before they leave school, therefore they can reach a much higher level. (9) This give them a access to better jobs and to informations from other countries. (10) People, who speak two languages, often earn higher salaries." },
          { label: "4", text: "(11) On the other hand, some parents worry that learning a foreign language too early will effect their children’s mother tongue. (12) Research shows that this fear is not reasonably because children can keep two languages apart. (13) Teachers should speak slowly, use pictures and repeating key words. (14) If the lessons are fun. Children will not feel any pressure." },
          { label: "5", text: "(15) In conclusion, I believe that foreign languages should be taught in primary schools. It will give children more opportunities in the future." },
        ],
      },
      {
        t: "quiz",
        id: "t3d27-soat-18",
        title: "Viết lại cụm sai cho đúng (18 lỗi) — gõ đúng phần thay thế",
        kind: "fill",
        items: [
          { q: "Câu 1 · lượt 1 — “the number of primary schools … **are** increasing” →", answers: ["is", "is increasing"] },
          { q: "Câu 2 · lượt 3 — “learn languages easily**, they** think” → viết lại 3 từ: easily, ___ they", answers: ["so", "easily, so they", "and", "easily, and they"] },
          { q: "Câu 3 · lượt 2 — “two main **reason**” →", answers: ["reasons", "two main reasons"] },
          { q: "Câu 4 · lượt 4 — “copying sounds, remembering new words and **to speak**” →", answers: ["speaking"] },
          { q: "Câu 5 · lượt 1 — “my younger cousin **start** learning English when she was six” →", answers: ["started"] },
          { q: "Câu 5 · lượt 1 — “now she **speak** it more confidently” →", answers: ["speaks"] },
          { q: "Câu 6 · lượt 3 — “**Because** her teacher used songs…” là câu cụt. Viết 2 từ đứng trước because để nó thành câu đủ: ___ ___ because her teacher…", answers: ["This is", "This was", "That is", "That was", "This is because", "This was because", "That is because", "That was because"] },
          { q: "Câu 7 · lượt 5 — “**However,** an early start also has…” (ý BỔ SUNG, không đối lập) → từ nối đúng:", answers: ["Secondly,", "Secondly", "Moreover,", "Moreover", "In addition,", "In addition", "Furthermore,", "Furthermore"] },
          { q: "Câu 8 · lượt 3 — “leave school**, therefore** they can” → viết dấu câu + therefore + dấu câu:", answers: ["; therefore,", ". Therefore,", ";therefore,", "; therefore", ". Therefore"] },
          { q: "Câu 9 · lượt 1 — “This **give** them” →", answers: ["gives"] },
          { q: "Câu 9 · lượt 2 — “**a access** to better jobs” →", answers: ["access"] },
          { q: "Câu 9 · lượt 2 — “to **informations** from other countries” →", answers: ["information"] },
          { q: "Câu 10 · lượt 3 — “People**,** who speak two languages**,** often earn” → viết lại 5 từ đầu, đúng dấu câu:", answers: ["People who speak two languages", "People who speak two languages often earn"] },
          { q: "Câu 11 · lượt 6 — “will **effect** their children’s mother tongue” →", answers: ["affect"] },
          { q: "Câu 12 · lượt 4 — “this fear is not **reasonably**” →", answers: ["reasonable"] },
          { q: "Câu 13 · lượt 4 — “speak slowly, use pictures and **repeating** key words” →", answers: ["repeat"] },
          { q: "Câu 14 · lượt 3 — “If the lessons are fun**. Children** will not feel” → viết lại: fun___ children", answers: [",", "fun, children", ", children"] },
          { q: "Câu 15 · lượt 5 — “**It** will give children more opportunities” (chỉ cả ý câu trước) → đại từ đúng:", answers: ["This", "Doing so", "This change", "This policy", "This approach", "Doing this"] },
        ],
      },
      {
        t: "table",
        caption: "Tự chấm theo % — bạn bắt được bao nhiêu trên 18?",
        head: ["Bắt được", "%", "Nghĩa là", "Việc làm tiếp"],
        rows: [
          ["16–18", "≥ 89%", "Kỹ năng soát ở mức band 6.5–7", "Áp ngay vào bài viết của CHÍNH bạn — khó hơn soát bài người khác nhiều."],
          ["13–15", "72–83%", "Đạt mức Tập 3", "Xem lượt nào sót nhiều nhất → ôn mục tương ứng."],
          ["9–12", "50–67%", "Còn soát theo “cảm giác”", "Làm lại đúng 6 lượt, mỗi lượt một màu bút; ôn mục 4 và 6."],
          ["≤ 8", "< 50%", "Chưa nhận ra lỗi", "Quay lại Tập 2 Ngày 17 · 23 · 24 rồi làm lại bài này sau 3 ngày."],
        ],
      },
      {
        t: "note",
        title: "📌 Bài đã sửa — đọc to một lần để nghe nhịp câu đúng",
        items: [
          "Nowadays, the number of primary schools that teach a foreign language **is** increasing in many countries. Some people believe that young children learn languages easily**, so** they think lessons should start as early as possible. I agree with this view for two main **reasons**.",
          "Firstly, young children are good at copying sounds, remembering new words and **speaking** without fear of mistakes. For example, my younger cousin **started** learning English when she was six, and now she **speaks** it more confidently than I do. **This is because** her teacher used songs and games instead of grammar rules.",
          "**Secondly,** an early start also has practical benefits for the country. Students who begin at six have ten years of practice before they leave school**; therefore,** they can reach a much higher level. This **gives** them **access** to better jobs and to **information** from other countries. **People who speak two languages** often earn higher salaries.",
          "On the other hand, some parents worry that learning a foreign language too early will **affect** their children’s mother tongue. Research shows that this fear is not **reasonable** because children can keep two languages apart. Teachers should speak slowly, use pictures and **repeat** key words. If the lessons are fun**,** children will not feel any pressure.",
          "In conclusion, I believe that foreign languages should be taught in primary schools. **This** will give children more opportunities in the future.",
        ],
      },

      /* ── 12 ── */
      { t: "h", text: "12. Kiểm tra cuối bài (10 câu)" },
      {
        t: "mcq",
        id: "t3d27-np-tong-hop",
        title: "Chọn đáp án đúng (10 câu)",
        items: [
          { q: "1. The price of houses in big cities ___ doubled since 2010.", options: ["have", "has", "are", "were"], correct: 1, why: "Chủ ngữ chính là **the price** (số ít) → has." },
          { q: "2. Câu nào đúng?", options: ["Tourism creates jobs, however it damages the environment.", "Tourism creates jobs however, it damages the environment.", "Tourism creates jobs; however, it damages the environment.", "Tourism creates jobs, however, it damages the environment."], correct: 2, why: "however không nối được hai câu bằng dấu phẩy → **; however,**" },
          { q: "3. There are three stages in the process ___ collecting, sorting and melting.", options: [",", ";", "—and", ":"], correct: 3, why: "Phần trước đã đủ nghĩa và phần sau là danh sách → hai chấm." },
          { q: "4. The scheme helps people to save money, reduce waste and ___ their neighbours.", options: ["meet", "meeting", "to meeting", "they meet"], correct: 0, why: "Song song với save, reduce (động từ nguyên mẫu sau to)." },
          { q: "5. Câu nào KHÔNG bị treo (dangling)?", options: ["Looking at the table, sales were highest in May.", "According to the table, sales were highest in May.", "Seeing the table, the highest sales were in May.", "Looking at the table, May had the highest sales."], correct: 1, why: "According to the table không cần chủ ngữ ngầm. Ba câu kia: sales / May không biết “nhìn”." },
          { q: "6. My hometown, ___ is on the coast, attracts many tourists.", options: ["which", "where", "that", "it"], correct: 0, why: "Mệnh đề có phẩy → which (không dùng that); cần chủ ngữ cho is nên không dùng where." },
          { q: "7. In 1995 the factory employed 500 people; ten years later it ___ only 200.", options: ["employs", "has employed", "is employing", "employed"], correct: 3, why: "Thì nền quá khứ đơn; “ten years later” vẫn là quá khứ." },
          { q: "8. Câu nào đặt dấu phẩy đúng?", options: ["If cities invest in cycling lanes, more people will ride to work.", "If cities invest in cycling lanes more people, will ride to work.", "If cities invest, in cycling lanes more people will ride to work.", "If cities invest in cycling lanes more people will ride, to work."], correct: 0, why: "Mệnh đề If đứng đầu → phẩy ngay sau nó." },
          { q: "9. A number of studies ___ that sleep affects memory.", options: ["shows", "is showing", "show", "has shown"], correct: 2, why: "**A number of** + N số nhiều = nhiều → động từ số nhiều." },
          { q: "10. Lượt soát nào bắt được lỗi “the government spend”?", options: ["Lượt 2 — danh từ", "Lượt 3 — ranh giới câu", "Lượt 5 — liên kết", "Lượt 1 — động từ"], correct: 3, why: "Thiếu -s ngôi ba là lỗi hoà hợp S–V → lượt 1 (động từ)." },
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t3d27-doc",
    kind: "reading",
    title: "Đọc: Reading đủ 3 passage · 40 câu · 60 phút — lần 2",
    goal: "Làm trọn một bài Reading Academic 3 passage (khoảng 2.260 từ, 40 câu, 8 dạng câu hỏi) trong đúng 60 phút theo nhịp 17 – 20 – 23, không bỏ trống câu nào, đạt ít nhất 23/40 (mức band 6.0) — rồi tự phân tích mình mất điểm vì thiếu giờ, vì dạng câu hay vì paraphrase.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "Đây là **lần 2** bạn làm đủ 3 passage (lần 1: Tập 2 Ngày 24, bài ngắn hơn và đích 15–18/40). Lần này bài dài đúng cỡ đề thật và đích là ==23/40 = band 6.0==.",
          "Nhịp **17 – 20 – 23 phút**: Passage 1 dễ nhất nên làm nhanh nhất; 3 phút cuối của Passage 3 để soát và điền hết ô trống.",
          "8 dạng trong đề đều **đã học** ở Tập 3: T/F/NG (N3) · Summary từ trong bài (N25) · Matching headings (N5) · Sentence completion (N9) · Multiple choice (N11) · Y/N/NG (N23) · Matching information (N19) · Summary hộp từ (N9).",
          "**Không tra từ, không dừng đồng hồ, không xem đáp án giữa chừng.** Bấm giờ 60 phút một lần duy nhất.",
          "Làm xong: chấm, quy ra band, rồi điền bảng “mất điểm vì đâu” — phần này quan trọng ngang phần làm bài.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Trước khi bấm giờ — lần 2 khác lần 1 ở đâu" },
      {
        t: "table",
        caption: "Tập 2 Ngày 24 (lần 1) và hôm nay (lần 2)",
        head: ["", "Lần 1 — Tập 2 Ngày 24", "Lần 2 — hôm nay"],
        rows: [
          ["Độ dài", "≈ 2.070 từ (3 bài ~690 từ)", "≈ 2.260 từ (740 – 720 – 800)"],
          ["Paraphrase", "Chủ yếu đổi từ đồng nghĩa", "Đổi **loại từ** và đổi **cấu trúc** (Ngày 3) — ít khi lặp lại chữ của bài"],
          ["Passage 3", "Miêu tả, quan điểm rõ", "Lập luận nhiều bước, có ý kiến tác giả phải suy ra"],
          ["Đích", "15–18/40 (band 5.0)", "**23–26/40 (band 6.0)**"],
          ["Sau bài", "Chép đáp án đúng hình thức", "Phân tích nguyên nhân mất điểm theo 3 nhóm"],
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "60 phút — nhịp 17 · 20 · 23",
        steps: [
          { label: "0:00 – 0:17 · Passage 1", sub: "Câu 1–13 · đích 10–11/13 · đừng “đọc kỹ cho chắc” — đây là chỗ lấy giờ cho Passage 3" },
          { label: "0:17 – 0:37 · Passage 2", sub: "Câu 14–26 · đích 8–9/13 · làm Matching headings SAU khi đã làm các câu chi tiết nếu thấy bí" },
          { label: "0:37 – 0:57 · Passage 3", sub: "Câu 27–40 · đích 6–7/14 · câu nào quá 90 giây thì đoán, đánh dấu, đi tiếp" },
          { label: "0:57 – 1:00 · Soát", sub: "Điền MỌI ô trống · kiểm chính tả từ chép trong bài · kiểm giới hạn số từ" },
        ],
        caption: "Hết giờ của một passage mà chưa xong ⇒ đoán nhanh các câu còn lại và CHUYỂN. Điểm của Passage 3 không đắt hơn điểm của Passage 1.",
      },
      {
        t: "note",
        title: "💡 Mẹo — ba luật giữ nhịp (ôn Ngày 1)",
        items: [
          "**Đọc câu hỏi trước**, gạch từ khoá (tên riêng, số, năm, thuật ngữ) rồi mới quét bài. Riêng Matching headings: đọc bài theo từng đoạn, không đọc câu hỏi chi tiết trước.",
          "**Skim 2 phút**: đọc tiêu đề + câu đầu mỗi đoạn để có “bản đồ” — biết đoạn nào nói gì thì mới quét đúng chỗ.",
          "Dạng điền từ và T/F/NG đi **theo thứ tự bài**; Matching headings, Matching information **không** theo thứ tự.",
          "Không bao giờ để trống: sai không bị trừ điểm.",
        ],
      },
      {
        t: "table",
        caption: "Bản đồ đề — xem 30 giây rồi bấm giờ",
        head: ["Passage", "Câu", "Dạng", "Yêu cầu"],
        rows: [
          ["1 · The Humble Pencil", "1–6", "True / False / Not Given", "chọn một trong ba"],
          ["", "7–13", "Summary completion (từ trong bài)", "ONE WORD ONLY"],
          ["2 · Bees on the Roof", "14–19", "Matching headings", "viết số La Mã i–ix"],
          ["", "20–23", "Sentence completion", "NO MORE THAN TWO WORDS"],
          ["", "24–26", "Multiple choice", "A, B, C hoặc D"],
          ["3 · Doing Two Things at Once", "27–31", "Yes / No / Not Given", "quan điểm của tác giả"],
          ["", "32–35", "Matching information", "viết chữ cái đoạn A–G"],
          ["", "36–40", "Summary completion (hộp từ)", "viết chữ cái A–I"],
        ],
      },

      /* ── P1 ── */
      { t: "h", text: "READING PASSAGE 1 — Questions 1–13 (đề in “about 20 minutes”; nhịp của khoá: 17 phút)" },
      {
        t: "passage",
        title: "The Humble Pencil",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.",
        paras: [
          { label: "A", text: "In 1564, according to a story repeated in almost every history of writing, a violent storm brought down a number of large trees near the village of Borrowdale in the north of England. Among their roots, local shepherds found a strange black substance that was soft and shiny and left a dark mark on anything it touched. At first they used it simply to mark their sheep. Because it looked like the metal lead, people called it “black lead”, a mistake that survives today in the phrase “pencil lead”. In fact the material was graphite, a form of pure carbon, and no pencil has ever contained any lead at all." },
          { label: "B", text: "The Borrowdale deposit was unusual because its graphite was solid enough to be sawn into sticks. These were too soft and dirty to hold, so they were first wrapped in string or sheepskin and later placed inside a hollowed-out piece of wood — the earliest wooden pencils. The material soon proved to have a more profitable use: it was ideal for lining the moulds in which cannonballs were made. As a result, the government took control of the mine, which was opened for only a few weeks each year, and guards searched the miners as they left. Graphite became so valuable that it was smuggled out and sold illegally, while English pencils were exported across Europe at high prices." },
          { label: "C", text: "Other countries had graphite of their own, but it was impure and crumbled into powder. The problem became urgent for France in the 1790s, when war with Britain cut off supplies. The minister of war asked Nicolas-Jacques Conté, an army officer and inventor, to find a substitute. Within a matter of days, it is said, Conté had the answer. He ground low-quality graphite into powder, mixed it with clay and water, pressed the paste into thin rods and baked them in a kiln. The method, patented in 1795, did more than solve a shortage. By changing the proportion of clay, Conté could control how hard the rod was: more clay gave a harder, paler line, while more graphite produced a softer, blacker one. Manufacturers still use essentially the same process, and the familiar grades running from hard “H” to black “B” are a direct result of it." },
          { label: "D", text: "The pencil’s wooden case has a history of its own. For much of the nineteenth century, the best pencils were made from red cedar, a wood from the south-eastern United States that could be sharpened smoothly without splintering. When supplies began to run short in the early 1900s, manufacturers turned to a different cedar from California, which they dyed and perfumed so that it would resemble the wood their customers were used to. The method of assembly has changed little since then. Grooves are cut into a thin wooden slat, the rods are laid in them, a second slat is glued on top, and the resulting “sandwich” is cut into individual pencils. The six-sided shape that is now standard was chosen for practical reasons: a hexagonal pencil does not roll off a desk, and it wastes less wood than a round one." },
          { label: "E", text: "Two additions completed the modern pencil. In 1858 an American, Hymen Lipman, patented a pencil with a rubber eraser fixed to one end. European makers were slow to follow, and pencils without erasers are still common there. Then, at the end of the nineteenth century, a company in Austria-Hungary launched an expensive pencil containing graphite from the Far East, which was thought to be the finest in the world. To signal this origin and the quality that went with it, the firm painted its pencils yellow, a colour associated with royalty in China. Competitors quickly copied the idea, which is why yellow remains the usual colour of pencils in North America today." },
          { label: "F", text: "It might be expected that such an old tool would have disappeared by now. Yet billions of pencils are still produced every year. The reasons are simple: a pencil is cheap, it needs no power, and it works upside down, under water and in extreme cold — conditions in which most pens fail. A single pencil can draw a line many kilometres long, and its marks, unlike ink, can be removed in a second. Carpenters, artists and exam candidates continue to depend on it, and engineers still describe a first rough plan as a “pencil sketch”. Few inventions of the sixteenth century are used in almost exactly the same form today." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–6.** Do the following statements agree with the information given in Reading Passage 1? Chọn **TRUE** nếu câu khớp với thông tin trong bài, **FALSE** nếu câu trái với thông tin trong bài, **NOT GIVEN** nếu bài không có thông tin này.",
      },
      {
        t: "mcq",
        id: "t3d27-doc-p1-tfng",
        title: "Questions 1–6 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "1. The black substance at Borrowdale was discovered after trees had been blown over.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn A: “a violent storm **brought down** a number of large trees… **Among their roots**, local shepherds found a strange black substance”. brought down = blown over (đổi từ đồng nghĩa)." },
          { q: "2. The first pencils contained a small quantity of lead.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn A: “**no pencil has ever contained any lead at all**”. Bẫy: bài có chữ lead, black lead — nhưng nói rõ đó là cách gọi nhầm." },
          { q: "3. Miners at Borrowdale were paid more than miners elsewhere in England.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn B chỉ nói thợ mỏ bị **lính gác khám người** khi ra về. Không có chữ nào về tiền lương ⇒ NOT GIVEN (đừng suy “than chì quý ⇒ lương cao”)." },
          { q: "4. Conté had experimented with graphite before the minister of war approached him.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn C nói ông là “an army officer and inventor” và tìm ra lời giải “within a matter of days” — không nói trước đó ông đã thử với than chì hay chưa." },
          { q: "5. A pencil containing more clay makes a darker line.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn C: “more clay gave a **harder, paler** line”. paler (nhạt hơn) trái với darker." },
          { q: "6. Californian cedar was treated so that it looked and smelt like the wood it replaced.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn D: “which they **dyed and perfumed** so that it would **resemble the wood their customers were used to**”. dyed → looked like; perfumed → smelt like (đổi cấu trúc)." },
        ],
      },
      {
        t: "p",
        text: "**Questions 7–13.** Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer. (Ôn Ngày 25: đáp án là từ **chép nguyên** trong bài, đi theo thứ tự bài; đọc cả câu tóm tắt để biết cần danh từ, động từ hay tính từ.)",
      },
      {
        t: "note",
        title: "How pencils are made — and why they have survived (Questions 7–13)",
        items: [
          "In Conté’s method, poor-quality graphite is first turned into **7 ______** and then combined with clay and water. The mixture is formed into rods, which are heated in a **8 ______**.",
          "How hard a pencil is depends on the **9 ______** of clay it contains.",
          "To make the case, **10 ______** are cut in a slat of wood and the rods are placed inside before a second slat is added. Pencils usually have six sides, partly because this shape will not **11 ______** off a desk.",
          "In North America most pencils are **12 ______**, a colour first used to suggest high quality.",
          "Pencils remain popular because they are cheap and reliable, and because their marks, in contrast to those made with **13 ______**, are easy to remove.",
        ],
      },
      {
        t: "quiz",
        id: "t3d27-doc-p1-tom-tat",
        title: "Questions 7–13 — ONE WORD ONLY from the passage",
        kind: "fill",
        items: [
          { q: "7.", answers: ["powder"] },
          { q: "8.", answers: ["kiln"] },
          { q: "9.", answers: ["proportion"] },
          { q: "10.", answers: ["grooves"] },
          { q: "11.", answers: ["roll"] },
          { q: "12.", answers: ["yellow"] },
          { q: "13.", answers: ["ink"] },
        ],
      },

      /* ── P2 ── */
      { t: "h", text: "READING PASSAGE 2 — Questions 14–26 (20 phút)" },
      {
        t: "passage",
        title: "Bees on the Roof",
        intro: "You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.",
        paras: [
          { label: "A", text: "Twenty years ago, anyone who kept bees in the middle of a large city was regarded as an eccentric. Today hives stand on the roofs of hotels, banks, museums and opera houses from London to Melbourne, and in some cities the number of registered hives has more than doubled within a decade. The change began in the mid-2000s, when newspapers reported that bee colonies were dying in large numbers; keeping a hive seemed a simple way for city dwellers to help. Restaurants now advertise honey produced a few floors above the dining room, and companies install hives as visible proof of their concern for the environment. What was once an unusual hobby has become a fashion." },
          { label: "B", text: "The surprising fact behind this trend is that honeybees often do better in cities than in the countryside. Modern farmland may look green, but for a bee it can be close to a desert: a single crop covers huge areas, flowers for only a few weeks and is frequently sprayed with pesticides. A city, by contrast, contains parks, private gardens, railway embankments and street trees, which between them offer a wide variety of flowers from early spring until late autumn. Urban hives are also slightly warmer in winter. Several studies have found that city colonies produce more honey than rural ones and are more likely to survive the cold months, and a beekeeper in central London can expect a harvest that many in the countryside would envy." },
          { label: "C", text: "Many people assume that honey from a polluted city must itself be polluted. Laboratory tests suggest otherwise. Nectar is hidden deep inside the flower, where it has little contact with dirty air, and the bees filter it further as they turn it into honey. Traces of heavy metals do appear in beeswax and on the insects’ bodies, but the levels found in the honey itself are normally far below legal limits. Indeed, because bees collect from an area of several square kilometres around the hive, some scientists now treat hives as cheap monitoring stations, analysing the wax in order to map pollution across a city." },
          { label: "D", text: "In recent years, however, biologists have begun to question whether more hives are a good thing. The honeybee is only one of thousands of bee species. Most of the others are wild, live alone or in small groups, and receive no help from beekeepers, yet they are just as important in carrying pollen from plant to plant. A single hive may contain 50,000 insects, all collecting from the same flowers as their wild relatives. Where hives are packed closely together, there may simply not be enough food to go round. A study in Paris found that wild pollinators visited flowers less often in districts with many hives, and researchers in Montreal reported a fall in the number of wild bee species as hives multiplied. Honeybees can also pass diseases to wild bees when the two feed on the same flower." },
          { label: "E", text: "This has led some conservationists to argue that keeping honeybees does nothing to “save the bees”. The honeybee, they point out, is a managed animal, closer to a farm chicken than to a wild bird, and it is in no danger of extinction: the number of hives worldwide has risen steadily for half a century. The species that are really declining are the wild ones, and what they need is undisturbed ground, dead wood and native plants rather than wooden boxes on roofs. From this point of view, a company that installs ten hives in order to appear green may be harming the very insects that the public believes it is protecting." },
          { label: "F", text: "Few experts want city beekeeping to be banned. They suggest instead that it should be restricted and better planned. Some cities now recommend a maximum number of hives per square kilometre, and London’s beekeeping association has warned for several years that parts of the capital already have too many. New beekeepers are advised to take a training course, since neglected hives spread disease. Above all, residents who wish to help are urged to plant flowers rather than buy bees: a window box of lavender or a patch of uncut grass feeds every species, wild and managed alike. The lesson of the urban hive, in the end, is that good intentions need to be matched by knowledge." },
        ],
      },
      {
        t: "p",
        text: "**Questions 14–19.** Reading Passage 2 has six paragraphs, **A–F**. Choose the correct heading for each paragraph from the list of headings below. Viết số La Mã **i–ix**. (Có 9 tiêu đề cho 6 đoạn — 3 tiêu đề thừa.)",
      },
      {
        t: "table",
        caption: "List of Headings",
        head: ["Số", "Heading"],
        rows: [
          ["i", "A limit on numbers rather than a ban"],
          ["ii", "Why farmland is sprayed with chemicals"],
          ["iii", "From odd pastime to popular trend"],
          ["iv", "Fears about the purity of city honey answered"],
          ["v", "The cost of setting up a hive"],
          ["vi", "Rivalry with other species of bee"],
          ["vii", "A mistaken idea of what needs protecting"],
          ["viii", "How bees find their way around a city"],
          ["ix", "The advantages of town life for the honeybee"],
        ],
      },
      {
        t: "quiz",
        id: "t3d27-doc-p2-tieu-de",
        title: "Questions 14–19 — viết số La Mã (i–ix)",
        kind: "fill",
        items: [
          { q: "14. Paragraph A", answers: ["iii"] },
          { q: "15. Paragraph B", answers: ["ix"] },
          { q: "16. Paragraph C", answers: ["iv"] },
          { q: "17. Paragraph D", answers: ["vi"] },
          { q: "18. Paragraph E", answers: ["vii"] },
          { q: "19. Paragraph F", answers: ["i"] },
        ],
      },
      {
        t: "p",
        text: "**Questions 20–23.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS** from the passage for each answer.",
      },
      {
        t: "quiz",
        id: "t3d27-doc-p2-cau",
        title: "Questions 20–23 — NO MORE THAN TWO WORDS",
        kind: "fill",
        items: [
          { q: "20. Farmland is a poor environment for bees partly because one ______ is grown over a very wide area.", answers: ["crop", "single crop"] },
          { q: "21. Scientists can examine the ______ taken from hives to find out which parts of a city are polluted.", answers: ["wax", "beeswax"] },
          { q: "22. Some conservationists say that a honeybee has more in common with a ______ than with a wild bird.", answers: ["farm chicken", "chicken"] },
          { q: "23. People in cities who want to help bees are encouraged to ______ instead of acquiring a hive.", answers: ["plant flowers"] },
        ],
      },
      { t: "p", text: "**Questions 24–26.** Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq",
        id: "t3d27-doc-p2-chon",
        title: "Questions 24–26",
        items: [
          { q: "24. What does the writer say about honeybee colonies in cities?", options: ["A. They produce honey over a shorter season than rural colonies.", "B. They have to be kept warm by their owners in winter.", "C. They have a better chance of getting through the winter.", "D. They collect from fewer kinds of flower than rural colonies."], correct: 2, why: "Đoạn B: city colonies “are **more likely to survive the cold months**”. A và D ngược với bài (hoa đa dạng từ đầu xuân tới cuối thu); B: bài nói tổ ở thành phố tự ấm hơn, không nói người nuôi phải sưởi." },
          { q: "25. The studies carried out in Paris and Montreal are mentioned in order to show that", options: ["A. wild bees are responsible for spreading disease.", "B. a large number of hives may be bad for wild bees.", "C. honeybees avoid districts that are crowded.", "D. scientists disagree about the effects of hives."], correct: 1, why: "Đoạn D: ở Paris côn trùng thụ phấn hoang dã ghé hoa ít hơn nơi nhiều tổ; ở Montreal số loài ong hoang giảm khi số tổ tăng ⇒ nhiều tổ gây hại cho ong hoang. A đảo chiều (ong mật truyền bệnh cho ong hoang); C, D không có." },
          { q: "26. What is the writer’s main purpose in the passage as a whole?", options: ["A. to persuade companies to install hives on their roofs", "B. to explain how to keep bees successfully in a city", "C. to argue that keeping bees in cities should be made illegal", "D. to show that a fashionable “green” activity has drawbacks that need managing"], correct: 3, why: "Bài đi từ trào lưu (A–C) sang mặt trái (D–E) rồi giải pháp quản lý (F), kết bằng “good intentions need to be matched by knowledge”. C sai vì đoạn F: “Few experts want city beekeeping to be banned”." },
        ],
      },

      /* ── P3 ── */
      { t: "h", text: "READING PASSAGE 3 — Questions 27–40 (23 phút, gồm 3 phút soát cuối)" },
      {
        t: "passage",
        title: "Doing Two Things at Once",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.",
        paras: [
          { label: "A", text: "Ask a group of office workers whether they are good at multitasking, and most will say yes. The ability to answer email during a meeting, or to write a report while following a conversation, is widely regarded as a sign of efficiency, and job advertisements still list it as a desirable skill. Yet four decades of laboratory research point to an uncomfortable conclusion: for almost any pair of tasks that require thought, the human brain does not do two things at once. What feels like multitasking is in reality rapid switching between tasks, and every switch has a price." },
          { label: "B", text: "The price was first measured precisely in the 1990s. In a typical experiment, volunteers were asked to alternate between two simple activities, such as solving arithmetic problems and classifying shapes. They were consistently slower, and made more mistakes, than when they completed all of one task before starting the other. Psychologists call this difference the “switch cost”. It arises because the brain must first put aside the rules of the old task and then load the rules of the new one. Each switch may take only a few tenths of a second, but over a working day in which a person changes task hundreds of times the lost time adds up. One frequently quoted estimate puts it as high as 40 per cent of productive time, although this figure is based on laboratory tasks and should be treated with caution." },
          { label: "C", text: "Time is not the only thing lost. When people leave a task unfinished, part of their attention stays with it, a phenomenon that the researcher Sophie Leroy has named “attention residue”. In her studies, participants who were interrupted before completing a puzzle performed worse on the next activity than those who had been allowed to finish. This helps to explain why a “quick look” at a message is rarely quick in its effects: the message is read in seconds, but thoughts about it continue to occupy the mind for several minutes afterwards." },
          { label: "D", text: "If switching is so costly, why do people believe they do it well? Part of the answer is that the costs are invisible to the person paying them. A widely cited study at Stanford University compared students who habitually used several media at once with those who rarely did so. The heavy multitaskers were confident of their skills, but in tests they were worse at ignoring irrelevant information and, surprisingly, slower at switching between tasks. In other research, the individuals who rated their own multitasking ability most highly turned out to be among the least capable. The practice appears to attract people who are easily distracted rather than people who are good at it." },
          { label: "E", text: "None of this means that two activities can never be combined. Walking and talking, or listening to music while washing dishes, cause little difficulty, because at least one of the activities is so well practised that it requires almost no conscious control. Problems arise when both tasks compete for the same mental resources — for instance, when both involve language. It is for this reason that a driver’s telephone conversation is dangerous even when a hands-free device is used: the hands are not the issue, the attention is. Experiments in driving simulators show that drivers who are talking on the phone react more slowly and fail to notice a large proportion of the objects in front of them, although they are looking straight at them." },
          { label: "F", text: "It would be wrong, however, to conclude that the solution is simply stronger willpower. Many modern workplaces are designed in ways that make sustained attention difficult. Open offices, instant messaging and the expectation of an immediate reply all push employees towards constant switching, and a worker who ignores messages for two hours may be judged unhelpful rather than focused. Observational studies by Gloria Mark and her colleagues found that office workers spent only a few minutes on a task before changing to another, and that roughly half of the interruptions were self-initiated: people broke off to check something without any outside signal at all." },
          { label: "G", text: "For this reason, the most practical advice concerns the organisation of work rather than the training of the brain. Grouping similar tasks together, checking messages at fixed times instead of continuously, and finishing — or at least writing down the next step of — one job before turning to another all reduce the number of switches and the residue they leave. Some companies have experimented with “quiet hours” in which no meetings or messages are allowed, and report that staff complete demanding work more quickly. Whether such schemes last is another matter, since they depend on managers accepting slower replies. What seems clear is that the admired multitasker is largely a myth, and that in mental work doing one thing at a time remains the fastest way to do two." },
        ],
      },
      {
        t: "p",
        text: "**Questions 27–31.** Do the following statements agree with the claims of the writer in Reading Passage 3? Chọn **YES** nếu câu khớp với quan điểm của tác giả, **NO** nếu câu trái với quan điểm của tác giả, **NOT GIVEN** nếu không thể biết tác giả nghĩ gì về điều này.",
      },
      {
        t: "mcq",
        id: "t3d27-doc-p3-ynng",
        title: "Questions 27–31 — YES / NO / NOT GIVEN",
        items: [
          { q: "27. The impression of carrying out two thinking tasks at the same moment is misleading.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn A: “**What feels like** multitasking is **in reality** rapid switching”. feels like … in reality = impression is misleading (ý ẩn, không lặp chữ)." },
          { q: "28. The estimate that 40 per cent of working time is lost can be relied on for real offices.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: con số này “is based on laboratory tasks and **should be treated with caution**” ⇒ tác giả KHÔNG coi là đáng tin cho văn phòng thật." },
          { q: "29. Hands-free telephones in cars ought to be banned by law.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn E nói nói chuyện điện thoại khi lái xe là nguy hiểm kể cả dùng hands-free — nhưng tác giả không hề nói nên cấm hay không. “Nguy hiểm” ≠ “nên cấm bằng luật”." },
          { q: "30. People who multitask a great deal tend to have too high an opinion of their own ability.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “The heavy multitaskers were **confident of their skills**, but in tests they were **worse**…”; người tự chấm cao nhất lại “among the least capable”." },
          { q: "31. Greater self-discipline on the part of workers would be enough to solve the problem.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F: “**It would be wrong**… to conclude that the solution is **simply stronger willpower**”. willpower = self-discipline; simply = would be enough." },
        ],
      },
      {
        t: "p",
        text: "**Questions 32–35.** Reading Passage 3 has seven paragraphs, **A–G**. Which paragraph contains the following information? Viết chữ cái **A–G**. (Một đoạn có thể dùng hơn một lần.)",
      },
      {
        t: "quiz",
        id: "t3d27-doc-p3-doan",
        title: "Questions 32–35 — viết chữ cái A–G",
        kind: "fill",
        items: [
          { q: "32. examples of pairs of activities that can be carried out together without difficulty", answers: ["E"] },
          { q: "33. a description of the method used to measure what is lost when people change task", answers: ["B"] },
          { q: "34. a doubt about whether a workplace policy will continue", answers: ["G"] },
          { q: "35. the finding that workers frequently interrupt themselves", answers: ["F"] },
        ],
      },
      {
        t: "p",
        text: "**Questions 36–40.** Complete the summary using the list of words, **A–I**, below. Viết chữ cái **A–I**.",
      },
      {
        t: "table",
        caption: "Hộp từ",
        head: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
        rows: [["automatic", "switching", "confident", "residue", "organisation", "willpower", "doubtful", "language", "measuring"]],
      },
      {
        t: "note",
        title: "Summary (Questions 36–40)",
        items: [
          "Research shows that the brain deals with two demanding tasks by **36 ______** between them rather than performing both together.",
          "Each change costs time, and work that has not been completed leaves a **37 ______** of attention behind, so that performance on the following task suffers.",
          "People who multitask a lot are generally **38 ______** about their ability, yet tests show that they are easily distracted.",
          "Two activities can be combined successfully only when one of them has become **39 ______**.",
          "The writer believes the best solution lies in changing the **40 ______** of work, for example by grouping similar tasks.",
        ],
      },
      {
        t: "quiz",
        id: "t3d27-doc-p3-hop-tu",
        title: "Questions 36–40 — viết chữ cái A–I",
        kind: "fill",
        items: [
          { q: "36.", answers: ["B"] },
          { q: "37.", answers: ["D"] },
          { q: "38.", answers: ["C"] },
          { q: "39.", answers: ["A"] },
          { q: "40.", answers: ["E"] },
        ],
      },

      /* ── Giải thích ── */
      { t: "h", text: "Giải thích đáp án — câu chứa đáp án và kiểu paraphrase" },
      {
        t: "note",
        title: "Giải thích 7–13 (Passage 1 — Summary, ONE WORD ONLY)",
        items: [
          "**7 powder** — đoạn C: “He **ground** low-quality graphite **into powder**”. poor-quality = low-quality; turned into = ground into.",
          "**8 kiln** — đoạn C: “**baked** them in a **kiln**”. heated = baked. Không biết kiln (lò nung) vẫn làm được: sau “in a” cần một danh từ chỉ nơi nung.",
          "**9 proportion** — đoạn C: “By changing the **proportion of clay**, Conté could control how hard the rod was”. depends on ⇄ could control by changing (đổi cấu trúc).",
          "**10 grooves** — đoạn D: “**Grooves** are cut into a thin wooden slat”. Chữ are trong câu tóm tắt báo cần danh từ **số nhiều** — viết groove là sai.",
          "**11 roll** — đoạn D: “a hexagonal pencil does not **roll** off a desk”. six sides = hexagonal; sau will not cần động từ nguyên mẫu.",
          "**12 yellow** — đoạn E: “**yellow** remains the usual colour of pencils in North America”. usual = most pencils; suggest high quality = signal… the quality.",
          "**13 ink** — đoạn F: “its marks, **unlike ink**, can be removed in a second”. in contrast to = unlike; easy to remove = removed in a second.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 14–23 (Passage 2 — Headings và Sentence completion)",
        items: [
          "**14 A — iii**: “What was once an **unusual hobby** has become a **fashion**” = from odd pastime to popular trend. Câu chốt đoạn nằm ở CUỐI đoạn.",
          "**15 B — ix**: câu đầu đoạn “honeybees often **do better in cities** than in the countryside”. Bẫy **ii**: thuốc trừ sâu chỉ là MỘT chi tiết trong đoạn, và bài không giải thích “vì sao phun” — ý chính ≠ chi tiết (Ngày 5).",
          "**16 C — iv**: “Many people **assume**… polluted. Laboratory tests **suggest otherwise**” = fears… answered. purity ⇄ polluted (đổi sang từ trái nghĩa).",
          "**17 D — vi**: ong mật “collecting from the **same flowers** as their wild relatives… **not be enough food**” = rivalry with other species.",
          "**18 E — vii**: người ta tưởng nuôi ong mật là “save the bees”, nhưng loài đang giảm là ong hoang ⇒ a mistaken idea of what needs protecting.",
          "**19 F — i**: “**Few experts want… banned**… it should be **restricted**… a **maximum number** of hives”. Thừa: v (chi phí) và viii (tìm đường) không có trong bài.",
          "**20 crop / single crop** — đoạn B: “a **single crop** covers huge areas”. one ⇄ single; very wide area ⇄ huge areas.",
          "**21 wax** — đoạn C: “**analysing the wax** in order to map pollution across a city”. examine = analyse; find out which parts are polluted = map pollution.",
          "**22 farm chicken** — đoạn E: “closer to a **farm chicken** than to a wild bird”. has more in common with = closer to.",
          "**23 plant flowers** — đoạn F: “urged to **plant flowers** rather than buy bees”. encouraged = urged; instead of acquiring a hive = rather than buy bees.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 32–40 (Passage 3 — Matching information và Summary hộp từ)",
        items: [
          "**32 E** — “Walking and talking, or listening to music while washing dishes, **cause little difficulty**”.",
          "**33 B** — “In a typical experiment, volunteers were asked to **alternate between two simple activities**… slower, and made more mistakes” = method used to measure. Đoạn C cũng có thí nghiệm nhưng đo “attention residue”, không phải cách ĐO cái giá lần đầu.",
          "**34 G** — “**Whether such schemes last is another matter**” = a doubt about whether a policy will continue. Từ khoá quiet hours nằm xa câu chứa đáp án 1 câu.",
          "**35 F** — “roughly half of the interruptions were **self-initiated**” = workers interrupt themselves (đổi loại từ: tính từ → động từ + đại từ phản thân).",
          "**36 B switching** — đoạn A “rapid switching between tasks”. I (measuring) hợp ngữ pháp nhưng sai nghĩa.",
          "**37 D residue** — đoạn C “attention residue”. Cần danh từ số ít sau “a”.",
          "**38 C confident** — đoạn D “confident of their skills”. G (doubtful) là từ trái nghĩa, đặt vào hộp để bẫy người chỉ nhìn ngữ pháp.",
          "**39 A automatic** — đoạn E “so well practised that it requires **almost no conscious control**” = automatic. Đây là câu khó nhất: từ trong hộp KHÔNG xuất hiện trong bài.",
          "**40 E organisation** — đoạn G “the most practical advice concerns the **organisation of work** rather than the training of the brain”. F (willpower) là thứ tác giả BÁC ở đoạn F.",
        ],
      },

      /* ── Chấm ── */
      { t: "h", text: "Chấm điểm — bạn đang ở band nào, và mất điểm vì đâu" },
      {
        t: "table",
        caption: "Điểm thô → band Reading Academic (ước tính — bảng quy đổi phổ biến)",
        head: ["Đúng / 40", "Band", "So với đích Tập 3"],
        rows: [
          ["30–32", "7.0", "Vượt xa — mức Tập 4"],
          ["27–29", "6.5", "Vượt đích"],
          ["**23–26**", "**6.0**", "**Đạt đích Tập 3**"],
          ["19–22", "5.5", "Gần tới — xem bảng nguyên nhân bên dưới"],
          ["15–18", "5.0", "Mức cuối Tập 2 — ôn lại Ngày 1 · 3 · 5 trước Ngày 29"],
          ["≤ 14", "≤ 4.5", "Làm lại bài này không bấm giờ để biết mình thiếu giờ hay thiếu kỹ năng"],
        ],
      },
      {
        t: "table",
        caption: "Điền số câu đúng — sai dạng nào thì ôn ngày đó",
        head: ["Câu", "Dạng", "Đích", "Sai nhiều ⇒ ôn"],
        rows: [
          ["1–6", "True / False / Not Given", "≥ 5/6", "Tập 3 Ngày 3 (False khác Not Given)"],
          ["7–13", "Summary — từ trong bài", "≥ 5/7", "Tập 3 Ngày 25; lỗi số ít / số nhiều ⇒ đọc lại câu tóm tắt"],
          ["14–19", "Matching headings", "≥ 4/6", "Tập 3 Ngày 5 (ý chính vs chi tiết)"],
          ["20–23", "Sentence completion", "≥ 3/4", "Tập 3 Ngày 9"],
          ["24–26", "Multiple choice", "≥ 2/3", "Tập 3 Ngày 11 · 13"],
          ["27–31", "Yes / No / Not Given", "≥ 3/5", "Tập 3 Ngày 23 (quan điểm tác giả, từ cực đoan)"],
          ["32–35", "Matching information", "≥ 2/4", "Tập 3 Ngày 19"],
          ["36–40", "Summary — hộp từ", "≥ 3/5", "Tập 3 Ngày 9"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Với MỖI câu sai, xếp vào một trong ba nhóm",
        cols: [
          { title: "⏱ Thiếu giờ", items: ["Chưa kịp đọc tới / đoán bừa", "Dấu hiệu: sai dồn ở câu 33–40", "**Sửa**: Passage 1 phải xong trong 17 phút; luật 90 giây một câu", "Học tiếp: Ngày 29 (900 từ / 20 phút)"] },
          { title: "🔎 Không tìm ra chỗ", items: ["Đọc kịp nhưng không thấy câu chứa đáp án", "Dấu hiệu: sai ở Matching information, Summary", "**Sửa**: skim lấy bản đồ đoạn trước; quét bằng tên riêng, số, từ in nghiêng", "Ôn: Ngày 1 · 19"] },
          { title: "🔁 Tìm ra nhưng hiểu sai", items: ["Thấy đúng câu mà chọn sai", "Dấu hiệu: sai T/F/NG, Y/N/NG, MCQ", "**Sửa**: chép cặp paraphrase vào sổ; kiểm từ phủ định, từ so sánh, từ cực đoan", "Ôn: Ngày 3 · 23"] },
        ],
        caption: "Nhóm nào nhiều nhất thì đó là việc của tuần này — đừng luyện thêm đề khi chưa biết mình sai vì đâu.",
      },
      {
        t: "note",
        title: "📌 Ghi vào sổ paraphrase (Tập 2 Ngày 24) — 8 cặp đáng nhớ của đề này",
        items: [
          "brought down (trees) ⇄ blown over · paler ⇄ (not) darker",
          "dyed and perfumed … resemble ⇄ looked and smelt like",
          "an unusual hobby → a fashion ⇄ from odd pastime to popular trend",
          "urged to ⇄ encouraged to · closer to ⇄ has more in common with",
          "should be treated with caution ⇄ cannot be relied on",
          "simply stronger willpower ⇄ self-discipline would be enough",
          "self-initiated interruptions ⇄ workers interrupt themselves",
          "requires almost no conscious control ⇄ automatic",
        ],
      },

      /* ── Từ vựng ── */
      { t: "h", text: "Từ vựng hữu ích từ ba bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "substance", pos: "n", ipa: "/ˈsʌbstəns/", vi: "chất, vật chất", ex: "Shepherds found a strange black substance among the roots.", exVi: "Những người chăn cừu tìm thấy một chất đen lạ giữa đám rễ cây.", more: "a chemical / harmful / natural **substance** · substantial (adj) = đáng kể" },
          { w: "substitute", pos: "n, v", ipa: "/ˈsʌbstɪtjuːt/", vi: "vật thay thế; thay thế", ex: "The minister asked him to find a substitute for English graphite.", exVi: "Bộ trưởng yêu cầu ông tìm một thứ thay thế cho than chì Anh.", more: "a **substitute for** sth · **substitute** A **for** B (dùng A thay B) · ⚠️ khác replace B **with** A" },
          { w: "proportion", pos: "n", ipa: "/prəˈpɔːʃn/", vi: "tỉ lệ, phần", ex: "The proportion of clay decides how hard the pencil is.", exVi: "Tỉ lệ đất sét quyết định bút chì cứng tới đâu.", more: "a large / small / significant **proportion of** · Task 1: the proportion of women **who**…" },
          { w: "resemble", pos: "v", ipa: "/rɪˈzembl/", vi: "giống với", ex: "The new wood was dyed so that it would resemble red cedar.", exVi: "Loại gỗ mới được nhuộm để trông giống gỗ tuyết tùng đỏ.", more: "⚠️ không có giới từ: ~~resemble to~~ · không dùng tiếp diễn · resemblance (n)" },
          { w: "colony", pos: "n", ipa: "/ˈkɒləni/", vi: "đàn (ong, kiến); thuộc địa", ex: "City colonies are more likely to survive the winter.", exVi: "Đàn ong ở thành phố dễ sống qua mùa đông hơn.", more: "a bee / ant **colony** · a former British **colony** · colonise (v)" },
          { w: "pollinator", pos: "n", ipa: "/ˈpɒləneɪtə/", vi: "loài thụ phấn (ong, bướm…)", ex: "Wild pollinators visited flowers less often in districts with many hives.", exVi: "Các loài thụ phấn hoang dã ghé hoa ít hơn ở những quận có nhiều tổ ong.", more: "pollen (phấn hoa) → pollinate (v) → pollination (n) · nối Ngày 22 (biodiversity)" },
          { w: "extinction", pos: "n", ipa: "/ɪkˈstɪŋkʃn/", vi: "sự tuyệt chủng", ex: "The honeybee is in no danger of extinction.", exVi: "Ong mật không hề có nguy cơ tuyệt chủng.", more: "in danger of / on the verge of **extinction** · become **extinct** (adj) · Ngày 28: ngôn ngữ cũng die out" },
          { w: "restrict", pos: "v", ipa: "/rɪˈstrɪkt/", vi: "hạn chế, giới hạn", ex: "Experts suggest that city beekeeping should be restricted, not banned.", exVi: "Các chuyên gia đề xuất nên hạn chế chứ không cấm nuôi ong ở thành phố.", more: "**restrict** sth **to** · restriction (n): impose / lift **restrictions on** · mức độ: restrict < ban" },
          { w: "alternate", pos: "v, adj", ipa: "/ˈɔːltəneɪt/", vi: "luân phiên, xen kẽ", ex: "Volunteers were asked to alternate between two simple tasks.", exVi: "Tình nguyện viên được yêu cầu làm xen kẽ hai việc đơn giản.", more: "**alternate between** A **and** B · tính từ đọc /ɔːlˈtɜːnət/ · ⚠️ khác alternative (lựa chọn khác)" },
          { w: "habitually", pos: "adv", ipa: "/həˈbɪtʃuəli/", vi: "theo thói quen, thường xuyên", ex: "The study compared students who habitually used several media at once.", exVi: "Nghiên cứu so sánh những sinh viên có thói quen dùng nhiều phương tiện cùng lúc.", more: "habit (n) → habitual (adj) → **habitually** · gần nghĩa: regularly, routinely" },
          { w: "sustained", pos: "adj", ipa: "/səˈsteɪnd/", vi: "kéo dài liên tục, bền bỉ", ex: "Open offices make sustained attention difficult.", exVi: "Văn phòng mở khiến việc tập trung liên tục trở nên khó.", more: "**sustained** attention / effort / growth · sustain (v) · sustainable (adj) = bền vững" },
          { w: "interruption", pos: "n", ipa: "/ˌɪntəˈrʌpʃn/", vi: "sự gián đoạn, sự ngắt quãng", ex: "Roughly half of the interruptions were started by the workers themselves.", exVi: "Khoảng một nửa số lần gián đoạn là do chính người lao động tự gây ra.", more: "constant / frequent **interruptions** · **without interruption** · interrupt (v)" },
        ],
      },
      {
        t: "note",
        title: "💡 Nhìn lại cả bài — rút kinh nghiệm cho Ngày 29",
        items: [
          "Ghi vào sổ: **thời gian thật** cho từng passage (không phải thời gian dự định). Passage 1 quá 18 phút ⇒ đó là vấn đề đầu tiên phải sửa.",
          "Ba câu khó nhất của đề: **39** (từ trong hộp không có trong bài), **29** (nguy hiểm ≠ nên cấm), **15** (heading bẫy bằng chi tiết). Sai cả ba là bình thường ở band 6; đúng hai là dấu hiệu band 6.5.",
          "Ngày 29 sẽ dạy đọc bố cục 900 từ trong 20 phút và cho bạn gặp Passage 3 dài lần đầu — mang theo bảng nguyên nhân hôm nay.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t3d27-noi",
    kind: "speaking",
    title: "Nói: Fluency 2 — không im quá 3 giây, tự sửa đúng cách, kết câu dứt khoát; ghi âm tự chấm",
    goal: "Giữ được mạch nói ở cả ba Part mà không có khoảng lặng nào dài quá 3 giây: biết lấp 4 loại khoảng lặng, tự sửa lỗi một lần rồi đi tiếp, paraphrase câu hỏi thay vì lặp lại chữ của giám khảo, kết câu trả lời dứt khoát — và tự chấm bản ghi âm của mình bằng 6 con số đếm được (đẩy FC band 6: sẵn lòng nói dài, đôi lúc mới mất mạch).",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**FC** (Fluency & Coherence) band 5 → 6: từ “giữ mạch nhờ lặp, tự sửa, nói chậm” lên “sẵn lòng nói dài, chỉ đôi lúc mất mạch”.",
          "**Luật 3 giây**: im quá 3 giây là giám khảo ghi nhận “ngập ngừng vì ngôn ngữ”. Có 4 loại khoảng lặng — mỗi loại một cách lấp.",
          "**Tự sửa đúng cách**: sửa MỘT lần, có từ báo hiệu (I mean, or rather), rồi đi tiếp. Sửa liên tục kéo điểm FC xuống nhanh hơn chính lỗi đó.",
          "**Paraphrase câu hỏi** (ôn Tập 2 Ngày 9): không mở đầu bằng cách lặp nguyên câu của giám khảo.",
          "**Kết dứt khoát**: không treo “…and yeah”, “that’s all”. Một câu chốt ngắn rồi dừng.",
          "Cuối bài: ghi âm 3 Part, **tự chấm bằng 6 con số**, và 🔊 tự chẩn lại 44 âm để so với Ngày 1.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn Ngày 11: bạn đã có gì — và hôm nay thêm gì" },
      {
        t: "table",
        caption: "Fluency qua các bài",
        head: ["Bài", "Đã học", "Hôm nay nâng lên"],
        rows: [
          ["Tập 2 Ngày 5", "Fillers cơ bản (Well, Let me see); Part 1 ngắn – thẳng – dừng", "Dùng filler **có nghĩa**, không lặp một filler"],
          ["Tập 2 Ngày 9 · 13", "Quên từ ⇒ giải nghĩa bằng mệnh đề; xin nhắc lại câu hỏi", "Phân biệt 4 loại khoảng lặng, mỗi loại một công cụ"],
          ["Tập 3 Ngày 11", "30 chunks văn nói; khi không biết / không có trải nghiệm", "Ghép chunks thành **chuỗi** để không im > 3 giây"],
          ["Tập 2 Ngày 9 (nhắc lại)", "Paraphrase câu hỏi giám khảo (S10)", "Paraphrase ngay ở **câu mở đầu** của mọi câu trả lời Part 3"],
          ["**Hôm nay**", "—", "Tự sửa · kết câu · tự chấm bản ghi âm bằng số đếm"],
        ],
      },
      {
        t: "table",
        caption: "FC band 5 và band 6 — nghe khác nhau thế nào",
        head: ["Dấu hiệu", "Band 5", "Band 6"],
        rows: [
          ["Khoảng lặng", "Im 4–6 giây giữa câu để tìm từ / dịch từ tiếng Việt", "Ngắt ngắn; khi cần nghĩ thì **nói ra** là mình đang nghĩ"],
          ["Tự sửa", "Sửa mọi lỗi nhỏ, quay lại đầu câu 2–3 lần", "Sửa lỗi làm sai nghĩa, một lần, rồi đi tiếp"],
          ["Lặp", "Lặp từ của giám khảo, lặp “I think… I think…”", "Đổi cách nói; lặp ít"],
          ["Từ nối", "Firstly / Moreover / In conclusion như bài viết", "because, so, which means, for instance, mind you…"],
          ["Kết câu", "“…and yeah.” / “That’s all.” / nhỏ dần rồi im", "Một câu chốt rõ, xuống giọng"],
          ["Độ dài", "Part 3: 1–2 câu rồi chờ câu hỏi tiếp", "Part 3: 4–6 câu, tự mở rộng"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Đừng hiểu sai: trôi chảy không phải nói nhanh",
        items: [
          "Nói nhanh mà vấp, nuốt âm cuối thì mất cả FC lẫn P. Tốc độ vừa phải, **đều**, là đủ.",
          "Ngắt hơi **ở ranh giới cụm nghĩa** (chunking — Ngày 11) là bình thường. Giám khảo chỉ trừ điểm cho khoảng lặng **giữa cụm**, lúc bạn đang tìm từ.",
          "Filler không xấu. Xấu là **một** filler lặp 15 lần (um… um…) hoặc filler **rỗng nghĩa** ở mọi câu (you know, like).",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Luật 3 giây — bốn loại khoảng lặng, bốn cách lấp" },
      {
        t: "p",
        text: "Hãy tự hỏi: mình im **ở đâu** trong câu trả lời? Bốn chỗ dưới đây có nguyên nhân khác nhau nên cách chữa cũng khác. Người band 5 dùng một cách cho cả bốn (um…), nên không hết.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Bạn im ở đâu?",
        cols: [
          { title: "① Đầu câu — chưa có ý", items: ["Vừa nghe câu hỏi xong", "**Công cụ**: câu câu giờ có nghĩa + paraphrase câu hỏi", "“That’s an interesting question. I suppose…”"] },
          { title: "② Giữa câu — thiếu từ", items: ["Có ý, kẹt một từ", "**Công cụ**: giải nghĩa bằng mệnh đề (Ngày 11)", "“…a kind of — what’s the word — a thing you use to…”"] },
          { title: "③ Cuối ý — hết thứ để nói", items: ["Nói xong 1 câu thì cạn", "**Công cụ**: 3 móc nối: lý do · ví dụ · đối lập", "“…and the reason is… / For instance… / Mind you…”"] },
          { title: "④ Không hiểu câu hỏi", items: ["Chỉ ở Part 3", "**Công cụ**: hỏi lại đúng cách", "“Sorry, do you mean…?”"] },
        ],
      },
      {
        t: "table",
        caption: "① Câu “mua thời gian” có nghĩa — theo từng Part",
        head: ["Part", "Dùng được", "Không dùng"],
        rows: [
          ["Part 1 (câu hỏi dễ, về bản thân)", "Trả lời NGAY. Cùng lắm: **Well,** … / **Actually,** … / **To be honest,** …", "~~That’s a very interesting question.~~ cho câu “Do you like tea?” — nghe học thuộc"],
          ["Part 2 (đã có 1 phút chuẩn bị)", "Mở bằng câu khung: **I’d like to talk about…** / **The one that comes to mind is…**", "Im nhìn giấy; “OK, so, um, my topic is…”"],
          ["Part 3 (câu trừu tượng)", "**That’s a tricky one.** · **I’ve never really thought about that, but…** · **Let me think for a second.** · **It depends, really.**", "Dùng cùng một câu cho mọi câu hỏi"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Câu mua thời gian (2–3 giây) + paraphrase câu hỏi + ý chính",
            vi: "Chuỗi mở đầu Part 3: trong lúc miệng nói 2 câu đầu, đầu bạn kịp tìm ý. Tổng cộng bạn có 5–6 giây mà không im giây nào.",
            examples: [
              { en: "Hmm, that's a tricky one. Whether technology has made people less patient… I'd say it has, to some extent.", vi: "Hừm, câu này khó đấy. Chuyện công nghệ có làm con người kém kiên nhẫn hơn không… tôi cho là có, ở mức độ nào đó." },
            ],
          },
          {
            formula: "Ý chính + , and the reason is… / , which means… / For instance, … / Mind you, …",
            vi: "Ba móc nối kéo dài ý (ôn Ngày 11): LÝ DO → VÍ DỤ → ĐỐI LẬP / NGOẠI LỆ. Cạn ý thì đi tới móc kế tiếp.",
            examples: [
              { en: "I usually study in the library, and the reason is that I get distracted at home. For instance, last night I checked my phone about twenty times. Mind you, the library closes at nine, so it isn't perfect.", vi: "Tôi thường học ở thư viện, lý do là ở nhà tôi dễ xao nhãng. Chẳng hạn tối qua tôi xem điện thoại khoảng hai mươi lần. Nhưng mà thư viện đóng cửa lúc chín giờ nên cũng không hoàn hảo." },
            ],
          },
          {
            formula: "Sorry, do you mean … or …? / Could you explain what you mean by …?",
            vi: "Part 3 được hỏi lại và được xin giải thích một từ (Tập 2 Ngày 13). Hỏi lại tốt hơn im hoặc trả lời lạc đề.",
            examples: [
              { en: "Sorry, do you mean attention at work, or in everyday life?", vi: "Xin lỗi, ý cô là sự tập trung trong công việc hay trong đời sống hằng ngày ạ?" },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi lấp khoảng lặng",
        items: [
          "**Dịch thầm từ tiếng Việt** rồi mới nói → im 5 giây. Chữa: nói ý ĐƠN GIẢN hơn bằng từ mình có sẵn, đừng cố diễn đạt đúng câu tiếng Việt trong đầu.",
          "Kéo dài nguyên âm “I thiiiink… the…” hoặc thêm “ờ”, “à” tiếng Việt. Chữa: thay bằng **well / I mean / let me see** — vẫn là filler nhưng là filler tiếng Anh.",
          "Dùng **How to say…** — sai ngữ pháp. Nói: **How can I put it?** / **What’s the word?** / **I’m not sure how to say this in English, but…**",
          "Lấp khoảng lặng bằng cách **lặp lại nguyên câu hỏi** thật chậm. Chữa: paraphrase (mục 4).",
        ],
      },
      { t: "rule", formula: "Im ở ĐẦU câu → câu mua thời gian + paraphrase · GIỮA câu → giải nghĩa từ · CUỐI ý → lý do / ví dụ / đối lập · KHÔNG HIỂU → hỏi lại", vi: "Không có khoảng lặng nào dài quá 3 giây nếu bạn nói ra điều mình đang làm." },
      {
        t: "mcq",
        id: "t3d27-noi-lap",
        title: "Tình huống — nói gì để không im? (6 câu)",
        items: [
          { q: "1. Part 1: “Do you like reading?” Bạn có ý ngay. Mở đầu tốt nhất:", options: ["That's a very interesting question. Let me think about it.", "Yes, I do, actually — mostly novels.", "Reading… do I like reading… um…", "It depends on many factors."], correct: 1, why: "Part 1 trả lời NGAY. Câu mua thời gian cho câu hỏi dễ nghe như học thuộc." },
          { q: "2. Part 3: “How has technology changed the way people concentrate?” Bạn chưa có ý.", options: ["(im 5 giây) I think technology is bad.", "Technology changed the way people concentrate by… um…", "Hmm, I've never really thought about that, but I suppose the main change is that we're interrupted far more often.", "I don't know."], correct: 2, why: "Câu mua thời gian + paraphrase (concentrate → we're interrupted) + ý chính. B lặp nguyên chữ của giám khảo." },
          { q: "3. Bạn quên từ “deadline” giữa câu.", options: ["I had a — what's the word — a date when the work has to be finished.", "I had a… (im) …sorry, I forget.", "I had a… how to say… a dead time.", "I had a… ờ… deadline tiếng Việt là hạn chót."], correct: 0, why: "Giải nghĩa bằng mệnh đề (a date when…) — vẫn truyền được ý, còn ăn điểm LR vì paraphrase." },
          { q: "4. Bạn vừa nói “I prefer working alone.” rồi cạn ý. Móc nối nào đúng thứ tự tự nhiên nhất?", options: ["…That's all.", "…In conclusion, I prefer working alone.", "…Moreover, working alone is good.", "…and the reason is that I can set my own pace. For instance, …"], correct: 3, why: "Móc LÝ DO rồi VÍ DỤ. B và C là từ nối của bài viết và không thêm ý mới." },
          { q: "5. Part 3: bạn không hiểu “sustained attention”.", options: ["Sorry, could you explain what you mean by “sustained attention”?", "(trả lời về chủ đề khác)", "Repeat.", "I don't understand your question, it is too difficult."], correct: 0, why: "Part 3 được xin giải thích một từ. C cộc lốc; D than phiền chứ không hỏi." },
          { q: "6. Cách nào KHÔNG nên dùng để mua thời gian?", options: ["Let me think for a second.", "That's a tricky one.", "Um… um… um… (4 giây)", "Well, it depends, really."], correct: 2, why: "Một filler rỗng lặp lại = ngập ngừng. Ba câu kia là filler có nghĩa." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Tự sửa đúng cách (self-correction)" },
      {
        t: "p",
        text: "Người bản ngữ cũng nói sai và tự sửa. Bảng mô tả band 6 chấp nhận “đôi lúc tự sửa”; band 5 là “giữ mạch nhờ tự sửa **nhiều**”. Vậy vấn đề không phải có sửa hay không, mà là ==sửa cái gì, mấy lần, và sửa xong có đi tiếp không==.",
      },
      {
        t: "table",
        caption: "Sửa hay bỏ qua?",
        head: ["Loại lỗi", "Làm gì", "Ví dụ"],
        rows: [
          ["Lỗi **làm sai nghĩa** (sai thì, sai từ, sai số, he / she)", "SỬA — một lần, có từ báo hiệu", "I go there last year — **sorry, I went** there last year."],
          ["Lỗi nhỏ **không đổi nghĩa** (thiếu a / the, thiếu -s)", "BỎ QUA — đi tiếp", "She have two brother… (đừng dừng lại; lần sau nói đúng)"],
          ["Chọn từ **chưa hay** nhưng đúng", "Nâng cấp bằng **or rather / I mean** — ăn điểm LR", "It was good — **or rather**, it was really impressive."],
          ["Cả câu **đi sai hướng**", "Mở lại gọn bằng **What I mean is…** / **Let me put that another way.**", "What I mean is, the problem isn’t phones themselves."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "… từ sai — sorry, / I mean, / or rather, + từ đúng … (đi tiếp)",
            vi: "Chỉ lặp lại TỪ bị sai, không quay lại đầu câu.",
            examples: [
              { en: "He told me that she — I mean, he — had already finished the project.", vi: "Anh ấy bảo tôi rằng cô ấy — ý tôi là anh ấy — đã làm xong dự án rồi." },
              { en: "There were about fifteen — sorry, fifty — people in the room.", vi: "Có khoảng mười lăm — xin lỗi, năm mươi — người trong phòng." },
            ],
          },
          {
            formula: "What I mean is, … / Let me put that another way: … / What I'm trying to say is …",
            vi: "Khi cả ý rối: bỏ câu dở, nói lại bằng câu đơn giản hơn.",
            examples: [
              { en: "Phones are bad because people… no, what I mean is, phones make it very easy to stop concentrating.", vi: "Điện thoại có hại vì người ta… không, ý tôi là điện thoại khiến ta rất dễ ngừng tập trung." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Bốn kiểu tự sửa làm tụt điểm",
        items: [
          "**Quay lại đầu câu**: “Yesterday I go… Yesterday I went… Yesterday I went to the… Yesterday I went to a cinema.” → chỉ sửa từ sai: “Yesterday I go — **went** — to the cinema.”",
          "**Sửa đúng thành sai**: “I have lived — I am living — I have been lived here…” Không chắc thì ĐỪNG sửa.",
          "**Xin lỗi nhiều lần**: “Sorry, sorry, my English is not good.” Giám khảo không cần lời xin lỗi; chỉ cần câu kế tiếp.",
          "**Sửa phát âm ba bốn lần** một từ. Nói lại chậm một lần; vẫn chưa được thì đổi từ khác.",
        ],
      },
      { t: "rule", formula: "Lỗi sai nghĩa → sửa 1 lần (I mean / sorry / or rather + từ đúng) → đi tiếp · lỗi nhỏ → bỏ qua", vi: "Tối đa một lần tự sửa cho mỗi câu; không bao giờ quay lại đầu câu." },
      {
        t: "quiz",
        id: "t3d27-noi-tu-sua",
        title: "Dịch sang tiếng Anh — tự sửa đúng cách (5 câu)",
        kind: "translate",
        grammar: "… — I mean, … / — sorry, … / — or rather, … · What I mean is, …",
        items: [
          { q: "Tôi gặp cô ấy hai năm — ý tôi là hai tháng — trước.", hint: "two years — I mean, two months — ago", answers: ["I met her two years — I mean, two months — ago.", "I met her two years, I mean, two months ago.", "I met her two years - I mean, two months - ago.", "I met her two years, I mean two months, ago.", "I met her two years — I mean two months — ago."] },
          { q: "Bộ phim khá hay — hay đúng hơn là xuất sắc.", hint: "quite good — or rather, excellent", answers: ["The film was quite good — or rather, excellent.", "The film was quite good, or rather, excellent.", "The film was quite good - or rather, excellent.", "The movie was quite good — or rather, excellent.", "The movie was quite good, or rather, excellent.", "The film was quite good, or rather excellent."] },
          { q: "Ý tôi là, vấn đề không phải là tiền.", hint: "What I mean is, the problem isn't…", answers: ["What I mean is, the problem isn't money.", "What I mean is, the problem is not money.", "What I mean is the problem isn't money.", "What I mean is that the problem isn't money.", "What I mean is, money isn't the problem."] },
          { q: "Để tôi nói theo cách khác.", hint: "Let me put that…", answers: ["Let me put that another way.", "Let me put it another way.", "Let me say that another way.", "Let me put this another way."] },
          { q: "Anh ấy làm việc ở — xin lỗi, cho — một ngân hàng.", hint: "works at — sorry, for — a bank", answers: ["He works at — sorry, for — a bank.", "He works at, sorry, for a bank.", "He works at - sorry, for - a bank.", "He works at — sorry, for a bank."] },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Paraphrase câu hỏi — không lặp chữ của giám khảo (ôn Tập 2 Ngày 9)" },
      {
        t: "p",
        text: "Lặp nguyên câu hỏi (“Do I think that technology has changed the way people concentrate? Yes, I think technology has changed the way people concentrate.”) tốn 10 giây mà không được điểm nào: giám khảo không tính từ vựng bạn **chép** từ câu hỏi. Đổi cách nói ngay ở câu đầu vừa mua thời gian, vừa ăn điểm LR (“paraphrase nói chung thành công” là mô tả band 6).",
      },
      {
        t: "table",
        caption: "Ba cách đổi — từ dễ tới khó",
        head: ["Cách", "Câu hỏi", "Mở đầu câu trả lời"],
        rows: [
          ["① **Từ đồng nghĩa**", "Do you think children today are **less patient**?", "Yes, I'd say kids nowadays **find it harder to wait** for things."],
          ["② **Đổi loại từ**", "Why do people find it difficult to **concentrate**?", "I think **concentration** is hard mainly because of constant notifications."],
          ["③ **Đổi góc nhìn / khái quát**", "Is it better to **do one thing at a time**?", "**Focusing on a single task** definitely works better for me."],
          ["① + đại từ", "What are the **advantages of working from home**?", "Well, **the main benefit of doing that** is the time you save."],
          ["Thay bằng **that / it / so**", "Do you think **schools should teach time management**?", "I think **so**, yes — **it** would be far more useful than some subjects."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: bảng đổi nhanh cho từ hay gặp trong câu hỏi",
        items: [
          "advantages → **benefits, good points, upsides** · disadvantages → **drawbacks, downsides**",
          "important → **essential, a big deal, it matters a lot** · difficult → **hard, challenging, a struggle**",
          "young people → **youngsters, teenagers, the younger generation** · old people → **the elderly, older generations**",
          "nowadays → **these days, at the moment** · in the past → **back then, a generation ago**",
          "Do you think…? → **I'd say… / I reckon… / As far as I can tell…** (đừng mở mọi câu bằng I think)",
        ],
      },
      { t: "rule", formula: "Câu trả lời = paraphrase câu hỏi (đồng nghĩa / đổi loại từ / so – it – that) + ý chính", vi: "Không lặp quá 2 từ nội dung liền nhau của giám khảo." },
      {
        t: "mcq",
        id: "t3d27-noi-paraphrase",
        title: "Câu mở đầu nào paraphrase tốt nhất? (5 câu)",
        items: [
          { q: "1. “What are the disadvantages of using smartphones?”", options: ["The disadvantages of using smartphones are many.", "There are many disadvantages of using smartphones.", "I'd say the biggest downside of having a phone on you all day is that it's so distracting.", "Using smartphones has disadvantages."], correct: 2, why: "disadvantages → downside; using smartphones → having a phone on you all day. Ba câu kia chép lại câu hỏi." },
          { q: "2. “Do you think people are busier now than in the past?”", options: ["I reckon so — life a generation ago seems to have been much slower.", "Yes, I think people are busier now than in the past.", "People are busier now than in the past, I think.", "Yes, people busier."], correct: 0, why: "so thay cho cả mệnh đề; in the past → a generation ago; busier → much slower (nói ngược lại)." },
          { q: "3. “Why is it important for children to learn to concentrate?”", options: ["It is important for children to learn to concentrate because it is important.", "Because important.", "Children learn to concentrate is important.", "Well, being able to focus matters a lot at school, because every subject depends on it."], correct: 3, why: "concentrate → being able to focus; important → matters a lot." },
          { q: "4. “How can employers help staff to work more efficiently?”", options: ["Employers can help staff to work more efficiently by many ways.", "One thing companies could do to boost productivity is to cut down on meetings.", "Employers help staff work efficiently.", "By help them."], correct: 1, why: "employers → companies; work more efficiently → boost productivity (đổi loại từ)." },
          { q: "5. “Is it a good idea to check emails first thing in the morning?”", options: ["It is a good idea to check emails first thing in the morning.", "I think it is a good idea.", "Personally, I try not to open my inbox straight after I wake up.", "Check emails in the morning is good idea."], correct: 2, why: "check emails → open my inbox; first thing in the morning → straight after I wake up." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Kết câu trả lời dứt khoát" },
      {
        t: "p",
        text: "Nhiều bạn nói tốt 20 giây rồi kết bằng “…and, yeah.” hoặc giọng nhỏ dần rồi nhìn giám khảo. Kết kiểu đó làm cả câu trả lời nghe **chưa xong**. Một câu chốt ngắn + **xuống giọng** cho giám khảo biết bạn kiểm soát được câu trả lời — và cho bạn dừng đúng lúc, trước khi nói lan man.",
      },
      {
        t: "table",
        caption: "Câu chốt theo Part",
        head: ["Part", "Câu chốt dùng được", "Tránh"],
        rows: [
          ["Part 1 (2–3 câu)", "…**so that's why** I prefer it. · …**so yes, I'm a big fan.** · …**but that's just me.**", "~~That's all.~~ · ~~…and yeah.~~ · ~~I finished.~~"],
          ["Part 2 (hết 2 phút)", "**So that's why** it has stayed in my memory. · **Looking back, I'm really glad I did it.** · **All in all, it was** a valuable experience.", "Dừng giữa câu khi giám khảo ngắt; lặp lại câu mở bài"],
          ["Part 3 (4–6 câu)", "**So overall, I'd say** the benefits outweigh the drawbacks. · **So it really depends on** the person. · **…which is why I think** schools should teach it.", "~~In conclusion,~~ (quá “bài viết”) · ~~So, um, yeah, that's my opinion.~~"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: câu chốt = quay về câu hỏi",
        items: [
          "Câu chốt tốt **trả lời lại câu hỏi bằng một dòng**: hỏi “Why…?” ⇒ “…so that's the main reason, I think.”; hỏi “Do you agree…?” ⇒ “…so on the whole, yes, I do.”",
          "**Xuống giọng** ở từ cuối. Lên giọng ở cuối câu nghe như bạn đang hỏi lại giám khảo “đúng không ạ?”.",
          "Chốt xong thì **dừng** và nhìn giám khảo. Đừng thêm ý mới sau câu chốt.",
          "Giám khảo ngắt lời bạn ở Part 2 là **đúng quy trình** (hết giờ), không phải bạn nói sai — cứ dừng lại, không cần xin lỗi.",
        ],
      },
      { t: "rule", formula: "… + So that's why … / So overall, I'd say … / … but that's just me. ↘ (xuống giọng, dừng)", vi: "Mỗi câu trả lời có một câu chốt quay về câu hỏi; không kết bằng and yeah / that's all." },
      {
        t: "quiz",
        id: "t3d27-noi-ket",
        title: "Điền một từ để hoàn thành câu chốt (6 câu)",
        kind: "fill",
        items: [
          { q: "1. …I can read on the bus, in bed, anywhere — so that's ___ I prefer e-books.", answers: ["why"] },
          { q: "2. …some people need silence and others need music, so it really ___ on the person.", answers: ["depends"] },
          { q: "3. …we still talk about that trip. Looking ___, I'm really glad I went.", answers: ["back"] },
          { q: "4. …so ___, I'd say the benefits outweigh the drawbacks.", answers: ["overall"] },
          { q: "5. …I know most people love the city, but I'd rather live by the sea — but that's ___ me.", answers: ["just"] },
          { q: "6. All in ___, it was one of the most useful courses I've taken.", answers: ["all"] },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Nghe và so: band 5 và band 6 cho cùng câu hỏi" },
      {
        t: "p",
        text: "Chủ đề: **sự tập trung** (nối bài đọc Passage 3 hôm nay). Nghe bản band 5 trước, tự đếm: mấy lần im, mấy lần sửa, kết câu thế nào. Rồi nghe bản band 6. Dấu “…” trong lời thoại là chỗ người nói im khoảng 4–5 giây.",
      },
      {
        t: "dialogue",
        title: "Band 5 (ước tính) — Part 1 và Part 3",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you find it easy to concentrate when you study?", vi: "Bạn có thấy dễ tập trung khi học không?" },
          { who: "Candidate", role: "candidate", text: "Um... do I find it easy to concentrate when I study... no, I don't find it easy to concentrate. Because... um... my phone. I always look... I always looking... I always look my phone. And, yeah.", vi: "Ừm… tôi có thấy dễ tập trung khi học không… không, tôi không thấy dễ tập trung. Vì… ừm… điện thoại của tôi. Tôi luôn nhìn… tôi luôn nhìn điện thoại. Và, ừ." },
          { who: "Examiner", role: "examiner", text: "Why do you think many people find it hard to focus on one task nowadays?", vi: "Theo bạn vì sao ngày nay nhiều người thấy khó tập trung vào một việc?" },
          { who: "Candidate", role: "candidate", text: "I think many people find it hard to focus on one task nowadays because... ... because of technology. Firstly, people have smartphone. Moreover, the... the... how to say... the message come many time. Sorry, sorry. The messages comes... come many times. So people cannot focus. That's all.", vi: "Tôi nghĩ ngày nay nhiều người thấy khó tập trung vào một việc vì… … vì công nghệ. Thứ nhất, người ta có điện thoại thông minh. Hơn nữa, cái… cái… nói thế nào nhỉ… tin nhắn đến nhiều lần. Xin lỗi, xin lỗi. Tin nhắn đến nhiều lần. Nên người ta không tập trung được. Hết ạ." },
        ],
      },
      {
        t: "dialogue",
        title: "Band 6 (ước tính) — cùng hai câu hỏi",
        lines: [
          { who: "Examiner", role: "examiner", text: "Do you find it easy to concentrate when you study?", vi: "Bạn có thấy dễ tập trung khi học không?" },
          { who: "Candidate", role: "candidate", text: "Not really, to be honest. I can focus for about twenty minutes, and then I start reaching for my phone. So these days I leave it in another room, which helps a lot.", vi: "Thật lòng thì không hẳn. Tôi tập trung được khoảng hai mươi phút, rồi bắt đầu với lấy điện thoại. Nên dạo này tôi để nó ở phòng khác, cách đó giúp nhiều lắm." },
          { who: "Examiner", role: "examiner", text: "Why do you think many people find it hard to focus on one task nowadays?", vi: "Theo bạn vì sao ngày nay nhiều người thấy khó tập trung vào một việc?" },
          { who: "Candidate", role: "candidate", text: "Hmm, I suppose the main reason is that we're interrupted all the time. I mean, twenty years ago an office worker had a desk and a telephone, whereas now there are emails, group chats and — what's the word — those little alerts on your screen. Notifications, that's it. Every time one appears, you lose your — sorry, you lose track of what you were doing. Mind you, it isn't only technology; a lot of people simply have too much on their plate. So overall, I'd say it's a mix of constant interruptions and too much work.", vi: "Hừm, tôi cho rằng lý do chính là ta bị ngắt quãng suốt. Ý tôi là hai mươi năm trước một nhân viên văn phòng có cái bàn và cái điện thoại bàn, còn bây giờ có email, nhóm chat và — từ gì nhỉ — mấy cái báo nhỏ trên màn hình ấy. Thông báo, đúng rồi. Mỗi lần một cái hiện lên là bạn mất — xin lỗi, bạn quên mất mình đang làm gì. Nhưng mà cũng không chỉ do công nghệ; nhiều người đơn giản là ôm quá nhiều việc. Nên nhìn chung tôi cho là do cả việc bị ngắt quãng liên tục lẫn quá nhiều việc." },
        ],
      },
      {
        t: "table",
        caption: "Chỗ khác nhau theo 4 tiêu chí",
        head: ["Tiêu chí", "Band 5", "Band 6"],
        rows: [
          ["**FC**", "Lặp nguyên câu hỏi hai lần; 2 khoảng lặng dài; quay lại sửa 3 lần; kết “And, yeah.” / “That's all.”; Firstly / Moreover kiểu bài viết", "Trả lời ngay; mua thời gian bằng Hmm, I suppose; kéo dài bằng I mean → whereas → Mind you; **một** lần tự sửa gọn; chốt So overall, I'd say…"],
          ["**LR**", "concentrate / focus chép từ câu hỏi; “how to say”", "we're interrupted all the time · reaching for my phone · lose track of · too much on their plate; quên từ thì tả (those little alerts) rồi tự tìm ra"],
          ["**GRA**", "Câu đơn; lỗi I always looking · look my phone · message come", "Câu phức: whereas · Every time…, you… · which helps a lot; quá khứ – hiện tại đúng"],
          ["**P**", "Ngắt giữa cụm vì tìm từ → mất nhịp", "Ngắt ở ranh giới cụm; xuống giọng ở câu chốt"],
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao bản band 6 chưa phải band 7",
        items: [
          "Vẫn có một lần quên từ và một lần sửa — band 7 “ngắt chỉ khi tìm ý”, hiếm khi vì ngôn ngữ.",
          "Ý còn khá quen (công nghệ, quá nhiều việc); band 7 thường thêm một góc nhìn nữa hoặc ví dụ cụ thể hơn.",
          "Đừng học thuộc câu trả lời này — học **khung**: mua thời gian → lý do chính → so sánh xưa–nay → ngoại lệ → câu chốt.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Ghi âm tự chấm — 6 con số đếm được" },
      {
        t: "p",
        text: "AI chấm cho bạn 4 tiêu chí, nhưng muốn tiến bộ về fluency thì bạn cần **tự nghe lại** và **đếm**. Ghi âm một câu trả lời Part 3 (khoảng 40–50 giây), nghe lại hai lần với giấy bút, điền bảng dưới. Làm việc này mỗi tuần một lần với cùng 3 câu hỏi — con số giảm dần là bằng chứng thật.",
      },
      {
        t: "table",
        caption: "Phiếu tự chấm fluency (cho một câu trả lời ~45 giây)",
        head: ["Đếm cái gì", "Cách đếm", "Band 5", "Đích band 6"],
        rows: [
          ["① Khoảng lặng > 3 giây", "Nghe lại, đếm “một – hai – ba” ở mỗi chỗ im", "3 trở lên", "**0–1**"],
          ["② Số lần um / ờ / à", "Vạch một nét mỗi lần", "8 trở lên", "**≤ 4**"],
          ["③ Số lần tự sửa", "Mọi lần nói lại một từ / quay lại đầu câu", "4 trở lên", "**≤ 2**, không lần nào quay lại đầu câu"],
          ["④ Từ nội dung chép từ câu hỏi", "So với câu hỏi đã in", "Lặp cả cụm", "**≤ 2 từ**"],
          ["⑤ Số câu (ý) nói được", "Đếm dấu chấm", "1–2", "**4–6**"],
          ["⑥ Có câu chốt không", "Có / không", "“and yeah”", "**Có**, xuống giọng"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách luyện 4–3–2 (mỗi ngày 10 phút)",
        items: [
          "Chọn một câu hỏi Part 3. Nói câu trả lời trong **4 phút** (thoải mái, tìm ý).",
          "Nói lại **đúng nội dung đó** trong **3 phút**, rồi lần nữa trong **2 phút**. Vì ý đã có sẵn, não chỉ còn lo việc nói cho trôi — đây là bài tập fluency hiệu quả nhất được nghiên cứu.",
          "Ghi âm lần thứ ba, điền phiếu 6 con số. Chép câu trả lời vào **sổ Speaking** (Ngày 2) rồi hôm sau tự hỏi lại.",
          "Nhớ: mục tiêu là **giảm khoảng lặng**, không phải tăng tốc độ.",
        ],
      },
      { t: "rule", formula: "Ghi âm → nghe lại → đếm 6 số (im > 3 giây · um · tự sửa · từ chép · số câu · câu chốt) → nói lại", vi: "Thứ gì đếm được thì sửa được. Ghi ngày và 6 con số vào sổ Speaking." },

      /* ── 8 ── */
      { t: "h", text: "8. Phát âm: tự chẩn lại 44 âm — so với Ngày 1" },
      {
        t: "p",
        text: "Ngày 1 bạn đã đọc bộ câu chẩn đoán và ghi vào **sổ âm** những âm bị điểm thấp. Sau 26 ngày luyện /æ – e – ʌ/, /ɔː – ɒ – əʊ/, nguyên âm đôi, /ʃ – ʒ/, âm cuối, dark L… hôm nay đọc **bộ câu mới** phủ lại đủ 20 nguyên âm và 24 phụ âm. Bấm vào từng từ để xem điểm từng âm, rồi điền bảng so sánh bên dưới.",
      },
      {
        t: "table",
        caption: "Bảng so sánh — chép vào sổ âm",
        head: ["Nhóm âm", "Câu kiểm (số dòng)", "Điểm Ngày 1", "Điểm hôm nay", "Còn yếu ⇒ luyện lại"],
        rows: [
          ["/θ/ /ð/", "1", "___", "___", "Tập 3 Ngày 4 · 21"],
          ["/s/ /ʃ/ /ʒ/ /z/", "2", "___", "___", "Tập 3 Ngày 13 · 19"],
          ["/tʃ/ /dʒ/ /j/", "3", "___", "___", "Tập 3 Ngày 1 · 4"],
          ["/v/ /w/ /f/", "4", "___", "___", "Tập 3 Ngày 1"],
          ["/r/ /l/ (cả dark L)", "5", "___", "___", "Tập 3 Ngày 3 (linking r) · 26 (dark L — học sau hôm nay một ngày, ôn lại ở đó)"],
          ["/p b t d k g/ cuối từ, /ŋ/ /h/ /m/ /n/", "6", "___", "___", "Tập 2 (âm cuối)"],
          ["/iː/ /ɪ/ · /uː/ /ʊ/", "7", "___", "___", "Tập 1–2"],
          ["/æ/ /e/ /ʌ/ /ɑː/", "8", "___", "___", "Tập 3 Ngày 2"],
          ["/ɔː/ /ɒ/ /ɜː/ /ə/", "9", "___", "___", "Tập 3 Ngày 6"],
          ["/eɪ/ /aɪ/ /ɔɪ/ /əʊ/ /aʊ/", "10", "___", "___", "Tập 3 Ngày 6"],
          ["/ɪə/ /eə/ /ʊə/", "11", "___", "___", "Tập 3 Ngày 14"],
          ["Cụm phụ âm + -ed / -s cuối", "12", "___", "___", "Tập 3 Ngày 19 · 22"],
        ],
      },
      {
        t: "phatam",
        id: "t3d27-phat-am",
        title: "Tự chẩn lại 44 âm — 12 câu",
        note: "Đọc tự nhiên, không đọc chậm từng từ. Sau mỗi câu, bấm vào từ điểm thấp để xem ÂM nào sai và ghi vào bảng so sánh. Âm nào vẫn dưới 70 điểm sau hai lần đọc là âm của tuần này.",
        items: [
          { text: "Both authors think that the weather there is worth thousands.", ipa: "bəʊθ ɔːθəz θɪŋk ðət ðə weðə ðeər ɪz wɜːθ θaʊzəndz", vi: "/θ/ và /ð/ ở đầu, giữa, cuối từ" },
          { text: "She usually measures the size of the fish on special occasions.", ipa: "ʃiː juːʒuəli meʒəz ðə saɪz əv ðə fɪʃ ɒn speʃl əkeɪʒnz", vi: "/s/ /ʃ/ /ʒ/ /z/" },
          { text: "The young manager chose to join a huge yacht club in June.", ipa: "ðə jʌŋ mænɪdʒə tʃəʊz tə dʒɔɪn ə hjuːdʒ jɒt klʌb ɪn dʒuːn", vi: "/tʃ/ /dʒ/ /j/" },
          { text: "Five wives were very worried about the view from the valley.", ipa: "faɪv waɪvz wə veri wʌrid əbaʊt ðə vjuː frəm ðə væli", vi: "/v/ /w/ /f/" },
          { text: "A really careful pilot will always feel the pull of the wheel.", ipa: "ə rɪəli keəfl paɪlət wɪl ɔːlweɪz fiːl ðə pʊl əv ðə wiːl", vi: "/r/, /l/ đầu từ và dark L cuối từ" },
          { text: "He had to grab the big bag, lock the cab and keep singing.", ipa: "hiː hæd tə ɡræb ðə bɪɡ bæɡ lɒk ðə kæb ənd kiːp sɪŋɪŋ", vi: "/p b t d k ɡ/ cuối từ, /ŋ/, /h/" },
          { text: "These six ships could soon move through the deep blue pool.", ipa: "ðiːz sɪks ʃɪps kʊd suːn muːv θruː ðə diːp bluː puːl", vi: "/iː/ – /ɪ/ và /uː/ – /ʊ/" },
          { text: "My aunt packed ten fresh plums and a cup of dark jam in the van.", ipa: "maɪ ɑːnt pækt ten freʃ plʌmz ənd ə kʌp əv dɑːk dʒæm ɪn ðə væn", vi: "/æ/ /e/ /ʌ/ /ɑː/" },
          { text: "The first small shop on the corner sold a lot of work shirts.", ipa: "ðə fɜːst smɔːl ʃɒp ɒn ðə kɔːnə səʊld ə lɒt əv wɜːk ʃɜːts", vi: "/ɔː/ /ɒ/ /ɜː/ /ə/" },
          { text: "They might enjoy going downtown by boat on a noisy day.", ipa: "ðeɪ maɪt ɪndʒɔɪ ɡəʊɪŋ daʊntaʊn baɪ bəʊt ɒn ə nɔɪzi deɪ", vi: "/eɪ/ /aɪ/ /ɔɪ/ /əʊ/ /aʊ/" },
          { text: "Nearly every tourist here wears their hair in the pure air.", ipa: "nɪəli evri tʊərɪst hɪə weəz ðeə heər ɪn ðə pjʊər eə", vi: "/ɪə/ /eə/ /ʊə/" },
          { text: "She asked for six texts, changed the months and fixed the lists.", ipa: "ʃiː ɑːskt fə sɪks teksts tʃeɪndʒd ðə mʌnθs ənd fɪkst ðə lɪsts", vi: "Cụm phụ âm cuối + -ed / -s" },
        ],
      },
      {
        t: "note",
        title: "💡 Đọc kết quả chẩn đoán thế nào",
        items: [
          "Âm **tăng điểm** so với Ngày 1: ghi lại cách bạn đã luyện — đó là cách hợp với bạn.",
          "Âm **vẫn thấp**: chọn tối đa **2 âm** cho bốn ngày cuối tập. Luyện 44 âm cùng lúc thì không âm nào tiến.",
          "Âm cuối (-s, -ed, -t, -k) thấp ảnh hưởng tới cả điểm **ngữ pháp** khi nói: giám khảo không nghe thấy -ed thì coi như bạn nói sai thì.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện nói — ghi âm, AI chấm, rồi tự đếm" },
      {
        t: "p",
        text: "Làm theo thứ tự: Part 1 (trả lời ngay, 2–3 câu, có câu chốt) → Part 2 (chuẩn bị 1 phút, nói đủ 2 phút, chốt bằng Looking back… / So that's why…) → Part 3 (mua thời gian + paraphrase + 3 móc nối + câu chốt). Sau mỗi phần, nghe lại và điền phiếu 6 con số ở mục 7.",
      },
      {
        t: "speak",
        id: "t3d27-noi-part1",
        part: "1",
        questions: [
          "Do you find it easy to concentrate when you study or work?",
          "Where do you usually go when you need to focus on something?",
          "Do you like to listen to music while you are working?",
          "What kinds of things distract you most easily?",
          "Were you better at concentrating when you were a child?",
        ],
      },
      {
        t: "speak",
        id: "t3d27-noi-part2",
        part: "2",
        questions: [
          "Describe a time when you had to do several things at the same time. You should say: what you had to do, why you had to do them together, how you managed it, and explain how you felt about the experience.",
        ],
      },
      {
        t: "speak",
        id: "t3d27-noi-part3",
        part: "3",
        questions: [
          "Why do you think many people find it hard to focus on one task nowadays?",
          "Do you think technology has made people less patient?",
          "Is it better to do one thing at a time or several things at once?",
          "How can schools help children to improve their concentration?",
          "Do you agree that being busy is the same as being productive?",
        ],
      },
      {
        t: "note",
        title: "📌 Tự chấm sau khi ghi âm",
        items: [
          "Có khoảng lặng nào **quá 3 giây** không? Ở loại nào trong 4 loại (đầu câu · giữa câu · cuối ý · không hiểu)?",
          "Bạn tự sửa mấy lần? Có lần nào **quay lại đầu câu** không?",
          "Câu mở đầu Part 3 có **paraphrase** câu hỏi không, hay chép lại?",
          "Mỗi câu trả lời có **câu chốt** và xuống giọng không?",
          "Part 2 có nói đủ **2 phút** không? Hết ý ở giây thứ mấy?",
          "Ghi 6 con số + ngày hôm nay vào sổ Speaking. Ngày 30 (giám khảo AI 14 phút lần 2) so lại.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d27-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 27 — dấu câu · hệ thống lỗi · soát 6 lượt · đọc ngắn · fluency",
    goal: "Tự kiểm cả ngày bằng 39 câu có đáp án: đặt đúng dấu câu, sửa comma splice, hoà hợp – song song – dangling, soát một đoạn Task 1 có 8 lỗi biết trước, làm 7 câu đọc trên một đoạn mới và chọn cách nói giữ mạch — đúng từ 28 câu trở lên là đạt.",
    minutes: 50,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (39 câu)",
        items: [
          "**I** Dấu câu — chọn câu đúng (8 câu) · **II** Sửa comma splice / run-on (5 câu) · **III** Hoà hợp · song song · dangling (6 câu).",
          "**IV** Soát đoạn Task 1 có **đúng 8 lỗi** (8 câu) — làm theo 6 lượt, không đọc “cho biết”.",
          "**V** Đọc đoạn ngắn: T/F/NG + Summary (7 câu) · **VI** Fluency: chọn cách nói (5 câu).",
          "Đích: **≥ 28/39**. Phần nào dưới 70% ⇒ xem lại mục ghi ở tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 27 trước khi làm bài",
        center: "Ngày 27",
        branches: [
          { label: "Dấu phẩy", items: ["sau phần mở đầu", "trước FANBOYS", "kẹp thông tin thêm", "KHÔNG giữa S và V"] },
          { label: "Nối 2 câu", items: ["dấu chấm", ", so / but", "; (however,)", "Because / Although"] },
          { label: "Hệ thống lỗi", items: ["the number of + V số ít", "and / or: cùng dạng", "V-ing đầu câu: ai làm?", "một đoạn một thì nền"] },
          { label: "6 lượt", items: ["động từ", "danh từ", "ranh giới câu", "song song", "liên kết", "chính tả + đề"] },
          { label: "Fluency", items: ["không im > 3 giây", "sửa 1 lần", "paraphrase câu hỏi", "câu chốt"] },
        ],
      },

      { t: "h", text: "I. Dấu câu — chọn câu viết ĐÚNG (8 câu) — ôn Ngữ pháp mục 2 · 3 · 5" },
      {
        t: "mcq",
        id: "t3d27-bt-dau-cau",
        title: "I. Chọn câu đặt dấu câu đúng",
        items: [
          { q: "1.", options: ["Overall the figures, rose in all three countries.", "Overall, the figures rose in all three countries.", "Overall the figures rose, in all three countries.", "Overall; the figures rose in all three countries."], correct: 1, why: "Từ nối đầu câu + phẩy; không tách chủ ngữ khỏi động từ." },
          { q: "2.", options: ["The report shows, that crime has fallen.", "The report shows that, crime has fallen.", "The report, shows that crime has fallen.", "The report shows that crime has fallen."], correct: 3, why: "Không có dấu phẩy trước / sau that, cũng không giữa S và V." },
          { q: "3.", options: ["Japan, which has an ageing population, needs more care workers.", "Japan which has an ageing population, needs more care workers.", "Japan, which has an ageing population needs more care workers.", "Japan, that has an ageing population, needs more care workers."], correct: 0, why: "Thông tin thêm kẹp HAI phẩy; mệnh đề có phẩy không dùng that." },
          { q: "4.", options: ["The city needs three things: more housing, better transport and cleaner air.", "The city needs: more housing, better transport and cleaner air.", "The city needs three things; more housing, better transport and cleaner air.", "The city needs three things, more housing, better transport and cleaner air."], correct: 0, why: "Phần trước hai chấm phải đủ nghĩa (needs three things). B đặt hai chấm ngay sau động từ." },
          { q: "5.", options: ["Wages rose slowly, prices rose quickly.", "Wages rose slowly; prices rose quickly.", "Wages rose slowly prices rose quickly.", "Wages rose slowly; and prices, rose quickly."], correct: 1, why: "Hai mệnh đề độc lập liên quan chặt → chấm phẩy. A là comma splice, C là run-on." },
          { q: "6.", options: ["Employees, who work night shifts, are paid more.", "Employees who work night shifts, are paid more.", "Employees who work night shifts are paid more.", "Employees who, work night shifts are paid more."], correct: 2, why: "Chỉ nhóm nhân viên làm ca đêm → mệnh đề xác định, không phẩy." },
          { q: "7.", options: ["When the factory closed many people, lost their jobs.", "When the factory closed many people lost, their jobs.", "When the factory closed; many people lost their jobs.", "When the factory closed, many people lost their jobs."], correct: 3, why: "Mệnh đề When đứng đầu → phẩy ngay sau nó. Chấm phẩy không đứng sau mệnh đề phụ." },
          { q: "8.", options: ["The governments' policy has improved childrens' health.", "The governments policy has improved childrens health.", "The government's policy has improved children's health.", "The government's policy has improved childrens' health."], correct: 2, why: "Số ít + ’s (government's); số nhiều bất quy tắc + ’s (children's)." },
        ],
      },

      { t: "h", text: "II. Sửa comma splice / run-on (5 câu) — ôn Ngữ pháp mục 4" },
      {
        t: "quiz",
        id: "t3d27-bt-splice",
        title: "II. Viết lại cả câu — dùng từ / dấu trong ngoặc",
        kind: "translate",
        grammar: "S + V, but / so + S + V · S + V; however, S + V · Although + S + V, S + V · …, whereas + S + V",
        items: [
          { q: "“The museum is free, few people visit it.” (but)", hint: "…, but few people visit it", answers: ["The museum is free, but few people visit it."] },
          { q: "“Rents are rising many students live with their parents.” (so)", hint: "Rents are rising, so…", answers: ["Rents are rising, so many students live with their parents."] },
          { q: "“Nuclear power is clean, however it is expensive to build.” (; however,)", hint: "…; however, it is…", answers: ["Nuclear power is clean; however, it is expensive to build."] },
          { q: "“The town is small, it has three universities.” (Although)", hint: "Although the town is small, …", answers: ["Although the town is small, it has three universities."] },
          { q: "“Men spent 20% on transport, women spent 12%.” (whereas)", hint: "…, whereas women spent 12%", answers: ["Men spent 20% on transport, whereas women spent 12%.", "Men spent 20% on transport whereas women spent 12%."] },
        ],
      },

      { t: "h", text: "III. Hoà hợp · song song · dangling (6 câu) — ôn Ngữ pháp mục 6 · 7 · 8" },
      {
        t: "mcq",
        id: "t3d27-bt-he-thong",
        title: "III. Chọn đáp án đúng",
        items: [
          { q: "1. The number of students who study online ___ every year.", options: ["grow", "are growing", "grows", "have grown"], correct: 2, why: "The number of + N số nhiều → động từ số ít." },
          { q: "2. The advice given by the two experts ___ very different.", options: ["were", "was", "are", "have been"], correct: 1, why: "advice không đếm được → số ít; bỏ qua “the two experts” chen giữa." },
          { q: "3. A good manager listens carefully, explains clearly and ___ fairly.", options: ["to decide", "deciding", "decision", "decides"], correct: 3, why: "Song song với listens, explains (V + s)." },
          { q: "4. The course teaches students how to plan a project, manage a budget and ___ a report.", options: ["write", "writing", "they write", "written"], correct: 0, why: "Song song với plan, manage sau how to." },
          { q: "5. Câu nào KHÔNG bị treo?", options: ["Having finished the survey, the results were published.", "Being a small country, tourism is very important.", "Having finished the survey, the researchers published the results.", "After leaving university, a job was hard to find."], correct: 2, why: "Người làm xong khảo sát = the researchers = chủ ngữ mệnh đề chính." },
          { q: "6. There ___ a significant increase in the number of visitors last year.", options: ["were", "are", "have", "was"], correct: 3, why: "There + be theo danh từ đứng sau: a significant increase (số ít), last year → was." },
        ],
      },

      { t: "h", text: "IV. Soát đoạn Task 1 — đúng 8 lỗi (8 câu) — ôn Ngữ pháp mục 10 · 11" },
      {
        t: "p",
        text: "Đoạn dưới tả một biểu đồ đường về số khách tới hai bảo tàng (2010–2020). Có **đúng 8 lỗi**: lượt 1 có 3 lỗi · lượt 2 có 1 · lượt 3 có 2 · lượt 4 có 1 · lượt 5 có 1. Tìm ra giấy trước, rồi gõ phần sửa.",
      },
      {
        t: "passage",
        title: "Đoạn cần soát — 8 lỗi",
        paras: [
          { text: "(1) The line graph shows the number of visitors to two museums between 2010 and 2020. (2) Overall the number of visitors to the Science Museum were higher than that of the Art Museum throughout the period. (3) In 2010, the Science Museum received 400,000 visitor, the Art Museum received only 250,000. (4) Over the next five years, the figure for the Science Museum rises steadily to 550,000, however the figure for the Art Museum remained stable. (5) After 2015, visitor numbers at the Art Museum grew quickly, reached 400,000 in 2018 and then levelling off. (6) Moreover, the Science Museum saw a slight fall in the final two years. (7) Looking at the last year, the gap between the two museums have narrowed to just 100,000." },
        ],
      },
      {
        t: "quiz",
        id: "t3d27-bt-soat",
        title: "IV. Viết lại cụm sai cho đúng (8 lỗi)",
        kind: "fill",
        items: [
          { q: "Câu 2 · lượt 1 — “the number of visitors … **were** higher” →", answers: ["was"] },
          { q: "Câu 3 · lượt 2 — “400,000 **visitor**” →", answers: ["visitors"] },
          { q: "Câu 3 · lượt 3 — “400,000 visitors**, the** Art Museum received” → thêm một từ nối sau dấu phẩy: , ___ the Art Museum", answers: ["while", "whereas", "but", "and"] },
          { q: "Câu 4 · lượt 1 — “the figure … **rises** steadily” →", answers: ["rose"] },
          { q: "Câu 4 · lượt 3 — “to 550,000**, however** the figure” → viết dấu câu + however + dấu câu:", answers: ["; however,", ". However,", "; however", ". However"] },
          { q: "Câu 5 · lượt 4 — “grew quickly, reached 400,000 in 2018 and then **levelling** off” →", answers: ["levelled", "leveled"] },
          { q: "Câu 6 · lượt 5 — “**Moreover,** the Science Museum saw a slight fall” (ý ĐỐI LẬP với đoạn trước) →", answers: ["In contrast,", "By contrast,", "However,", "In contrast", "By contrast", "However", "Meanwhile,", "Meanwhile"] },
          { q: "Câu 7 · lượt 1 — “the gap between the two museums **have** narrowed” (năm 2020 đã qua) →", answers: ["had", "had narrowed", "narrowed"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích IV — và hai chỗ “chưa sai ngữ pháp nhưng nên sửa”",
        items: [
          "Câu 2: chủ ngữ chính **the number** → was. Câu 7: chủ ngữ chính **the gap**, mốc 2020 là quá khứ → had narrowed / narrowed.",
          "Câu 3: hai mệnh đề độc lập nối bằng dấu phẩy → thêm **while / whereas**. Câu 4: however không nối được bằng dấu phẩy.",
          "Câu 5: grew, reached và **levelled** phải cùng dạng quá khứ (song song).",
          "Câu 6: Moreover = thêm ý cùng chiều; ở đây Science Museum **giảm** trong khi Art Museum tăng → In contrast.",
          "Chưa tính là lỗi nhưng nên sửa: câu 2 thiếu dấu phẩy sau **Overall**; câu 7 **Looking at the last year,** là dangling (the gap không biết “nhìn”) → **By 2020,** the gap… Bạn tìm ra hai chỗ này là đã soát ở mức band 7.",
        ],
      },

      { t: "h", text: "V. Đọc — T/F/NG + Summary (7 câu) — ôn bài Đọc" },
      {
        t: "passage",
        title: "The Return of the Fountain Pen",
        paras: [
          { label: "A", text: "When the ballpoint pen became cheap in the 1950s, most people assumed that the fountain pen was finished. A ballpoint needed no bottle of ink, did not leak in a pocket and cost a fraction of the price. Within twenty years, the older instrument had almost disappeared from offices, and several famous manufacturers closed." },
          { label: "B", text: "In the last decade, however, sales of fountain pens have risen in a number of countries, and the buyers are not collectors but students and young professionals. Some say that writing by hand with a nib forces them to slow down, which helps them to think before they write. Others simply enjoy the wide choice of ink colours. Environmental concerns play a part as well: a pen that can be refilled for decades produces far less plastic waste than a box of disposable ones." },
          { label: "C", text: "Teachers in some schools have noticed a further benefit. Because a fountain pen needs only light pressure, pupils who use one tend to grip it less tightly, and their handwriting often becomes more regular. Whether this improves their marks has not yet been tested." },
        ],
      },
      {
        t: "mcq",
        id: "t3d27-bt-doc-tfng",
        title: "V-a. TRUE / FALSE / NOT GIVEN (3 câu)",
        items: [
          { q: "1. Ballpoint pens were more expensive than fountain pens in the 1950s.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn A: bút bi “cost **a fraction of the price**” (chỉ bằng một phần nhỏ giá) ⇒ rẻ hơn." },
          { q: "2. Most people who buy fountain pens today are collectors.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn B: “the buyers are **not collectors but** students and young professionals”." },
          { q: "3. Pupils who write with fountain pens get higher marks.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn C: “Whether this improves their marks **has not yet been tested**” ⇒ bài không cho biết." },
        ],
      },
      {
        t: "note",
        title: "Summary (Questions 4–7) — ONE WORD ONLY from the passage",
        items: [
          "Fountain pens nearly vanished after the 1950s because ballpoints were cheaper and did not **4 ______**.",
          "Recently they have become popular again. Some users find that a nib makes them write more slowly and gives them time to **5 ______**. A refillable pen also creates less **6 ______** than disposable pens.",
          "In schools, pupils hold a fountain pen with less **7 ______**, which may lead to neater handwriting.",
        ],
      },
      {
        t: "quiz",
        id: "t3d27-bt-doc-tom-tat",
        title: "V-b. Summary — ONE WORD ONLY (4 câu)",
        kind: "fill",
        items: [
          { q: "4.", answers: ["leak"] },
          { q: "5.", answers: ["think"] },
          { q: "6.", answers: ["waste"] },
          { q: "7.", answers: ["pressure"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án V-b",
        items: [
          "**4 leak** — đoạn A “did not **leak** in a pocket”. Sau did not cần động từ nguyên mẫu.",
          "**5 think** — đoạn B “helps them to **think** before they write”. gives them time to = helps them to.",
          "**6 waste** — đoạn B “far less plastic **waste**”. ONE WORD ONLY nên không viết plastic waste.",
          "**7 pressure** — đoạn C “needs only light **pressure**… grip it less tightly”. with less pressure ⇄ light pressure (đổi cấu trúc).",
        ],
      },

      { t: "h", text: "VI. Fluency — chọn cách nói (5 câu) — ôn bài Nói mục 2–5" },
      {
        t: "mcq",
        id: "t3d27-bt-noi",
        title: "VI. Chọn cách nói tốt nhất",
        items: [
          { q: "1. Bạn nói nhầm “fifteen” thay vì “fifty”. Sửa thế nào?", options: ["Sorry, sorry, I am wrong. Let me say again from the beginning.", "…about fifteen — sorry, fifty — people.", "(không sửa, dù số sai hẳn nghĩa)", "…fifteen, no, fifty, no, fifteen… fifty."], correct: 1, why: "Lỗi sai nghĩa → sửa MỘT lần, chỉ lặp từ sai, rồi đi tiếp." },
          { q: "2. Câu chốt tốt nhất cho câu hỏi “Why do you prefer studying in the morning?”", options: ["That's all.", "…and yeah.", "In conclusion, I prefer studying in the morning.", "…so that's really why mornings work best for me."], correct: 3, why: "Câu chốt quay về câu hỏi (Why → that's why), không dùng từ nối bài viết." },
          { q: "3. “Do you think young people read less than in the past?” — câu mở paraphrase tốt nhất:", options: ["I'd say so — teenagers these days seem to spend far more time on screens than on books.", "Yes, I think young people read less than in the past.", "Young people read less than in the past, yes.", "I think yes."], correct: 0, why: "so thay mệnh đề; young people → teenagers; in the past → these days (đổi góc)." },
          { q: "4. Bạn cạn ý sau một câu ở Part 3. Làm gì?", options: ["Im và chờ giám khảo hỏi tiếp.", "Nói “I have no idea more.”", "Thêm một ví dụ: “For instance, …” rồi một ngoại lệ: “Mind you, …”", "Lặp lại câu vừa nói chậm hơn."], correct: 2, why: "Ba móc nối: lý do → ví dụ → đối lập / ngoại lệ." },
          { q: "5. Lỗi nào KHÔNG cần dừng lại sửa khi đang nói?", options: ["Nói “he” khi kể về chị gái.", "Nói “I go there last year”.", "Nói “two hundred” thay vì “two thousand”.", "Thiếu “the” trong “I went to cinema”."], correct: 3, why: "Thiếu mạo từ không đổi nghĩa → bỏ qua, giữ mạch. Ba lỗi kia làm sai nghĩa (người, thì, con số)." },
        ],
      },
      {
        t: "note",
        title: "📌 Chấm điểm và việc làm tiếp",
        items: [
          "**≥ 28/39**: đạt. Dưới 28 ⇒ xem phần nào dưới 70% và ôn mục ghi ở tiêu đề phần đó.",
          "Việc bắt buộc tối nay: lấy **một bài Task 2 cũ của chính bạn**, soát đủ 6 lượt bằng 6 màu, ghi số lỗi từng lượt vào sổ lỗi. Ngày 30 sẽ viết lại bài đó.",
          "Ghi âm lại một câu Part 3 ở bài Nói và điền phiếu 6 con số.",
        ],
      },
    ],
  },
];
