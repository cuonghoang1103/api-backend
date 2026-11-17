/**
 * IELTS Tập 3 — Ngày 15 (band 5.0 → 6.0) — giữa tập.
 * Bài 1 ngữ pháp: câu điều kiện loại 2 & 3 · wish / if only · would rather / it's time (G25 — ôn G16, nối Tập 2 Ngày 13).
 * Bài 2 đọc: Table completion 2 + Short-answer (R03 · R09 — nối Tập 1 Ngày 8, Tập 2 Ngày 8, Tập 3 Ngày 7).
 * Bài 3 nói: Part 3 câu hỏi giả định “What would happen if…?” (S06 — nối Tập 3 Ngày 10 “If… don't…”);
 *   phát âm: would've / could've / should've nối âm.
 * Đề 4 (giữa tập, band 5.5) nằm ở Online Test do phiên khác soạn — ngày này chỉ nhắc người học làm sau khi xong.
 * Mọi bài đọc, câu ví dụ, câu trả lời mẫu đều tự soạn; mốc lịch sử đồng hồ là kiến thức phổ thông.
 */
import type { Lesson } from '../data';

export const NGAY_15: Lesson[] = [
  /* ═══════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════ */
  {
    id: "t3d15-ngu-phap",
    kind: "grammar",
    title: "Câu điều kiện loại 2 & 3 · wish / if only · would rather",
    goal: "Nói và viết đúng câu giả định về hiện tại (loại 2), về quá khứ (loại 3), câu ước với wish / if only và câu would rather / it's time — không đặt would sai chỗ, không lẫn với loại 1 — để trả lời được mọi câu hỏi “What would happen if…?” và viết được câu hệ quả giả định trong Task 2 ở mức GRA band 6.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        items: [
          "**Ôn từ Tập 2 Ngày 13**: loại 0 (quy luật) và loại 1 (khả năng CÓ THẬT ở tương lai). Hôm nay học hai loại **không có thật**: loại 2 (trái với hiện tại) và loại 3 (trái với quá khứ).",
          "**Loại 2**: ==If + quá khứ đơn, would / could / might + V== — động từ lùi một thì để báo “đây chỉ là tưởng tượng”, KHÔNG phải nói về quá khứ.",
          "**Loại 3**: ==If + had + V3, would / could / might + have + V3== — nuối tiếc, phê bình, phân tích một việc đã xong.",
          "**wish / if only**: ước trái hiện tại (+ quá khứ đơn), trái quá khứ (+ had V3), phàn nàn về người khác (+ would V).",
          "**would rather** và **it's (high) time** cũng lùi thì như vậy khi có chủ ngữ thứ hai.",
          "Đẩy tiêu chí **GRA** band 6 (trộn câu đơn + câu phức, lỗi hiếm khi làm sai nghĩa) — và là ngữ pháp bắt buộc của bài Nói hôm nay.",
        ],
      },

      { t: "h", text: "1. Ôn nhanh loại 0 và loại 1 — rồi nhìn cả bốn loại trên một bảng" },
      { t: "p", text: "**Câu điều kiện** (conditional sentence) có hai mệnh đề: **mệnh đề if** (điều kiện) và **mệnh đề chính** (kết quả). Tập 2 Ngày 13 đã dạy loại 0 và loại 1 — hai loại nói về việc **có thật hoặc có thể xảy ra**. Hôm nay thêm hai loại nói về việc **không có thật**: người nói biết rõ điều kiện đó sai với thực tế, họ chỉ đang tưởng tượng. Tiếng Việt dùng chung chữ “nếu” cho cả bốn; tiếng Anh thì **đổi thì của động từ** để báo cho người nghe biết đây là thật hay tưởng tượng." },
      {
        t: "table",
        head: ["Loại", "Nói về", "Mệnh đề if", "Mệnh đề chính", "Ví dụ"],
        rows: [
          ["0 (ôn)", "quy luật, luôn đúng", "hiện tại đơn", "hiện tại đơn", "If prices **rise**, people **buy** less."],
          ["1 (ôn)", "việc CÓ THỂ xảy ra ở tương lai", "hiện tại đơn", "will / can / may + V", "If the city **builds** a metro, traffic **will improve**."],
          ["**2 (mới)**", "tưởng tượng, TRÁI với hiện tại", "**quá khứ đơn**", "**would / could / might + V**", "If the city **had** a metro, traffic **would be** lighter. (thực tế: chưa có)"],
          ["**3 (mới)**", "tưởng tượng, TRÁI với quá khứ", "**had + V3**", "**would / could / might + have + V3**", "If the city **had built** a metro in 2000, traffic **would have improved**. (thực tế: đã không xây)"],
        ],
        caption: "Quy tắc chung: muốn báo “không có thật” thì lùi động từ một thì so với thời điểm đang nói tới.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Chọn loại nào? Hỏi mình hai câu",
        steps: [
          { label: "Điều kiện nói về lúc nào?", sub: "quá khứ đã xong ⇒ xuống bước 3 · hiện tại / tương lai ⇒ bước 2" },
          { label: "Có thể thật không?", sub: "có thể xảy ra ⇒ **loại 1** · tôi biết là không / rất khó ⇒ **loại 2**" },
          { label: "Quá khứ đã xong, không đổi được", sub: "⇒ **loại 3**: If + had V3, would have V3" },
        ],
        caption: "Loại 1 và loại 2 cùng nói về hiện tại – tương lai; khác nhau ở chỗ người nói TIN việc đó có thể xảy ra hay không.",
      },
      { t: "rule", formula: "Thật / có thể ⇒ loại 0, 1 (hiện tại đơn) · Không thật ⇒ lùi một thì: loại 2 (quá khứ đơn) · loại 3 (had V3)", vi: "Động từ lùi thì là tín hiệu “tôi đang tưởng tượng”, không phải tín hiệu thời gian." },

      { t: "h", text: "2. Câu điều kiện loại 2 — tưởng tượng trái với hiện tại" },
      { t: "p", text: "Dùng loại 2 khi điều kiện **không đúng ở hiện tại** hoặc **rất khó xảy ra ở tương lai**. Mệnh đề if dùng **quá khứ đơn** (dù đang nói về bây giờ), mệnh đề chính dùng **would + động từ nguyên mẫu**. Thay would bằng **could** (có thể, có khả năng) hoặc **might** (có lẽ, không chắc) để đổi mức chắc chắn." },
      {
        t: "patterns",
        rows: [
          {
            formula: "If + S + V-ed (quá khứ đơn), S + would + V",
            vi: "Nếu (bây giờ) … thì … sẽ … — thực tế thì không phải vậy",
            examples: [
              { en: "If public transport were free, far fewer people would drive to work.", vi: "Nếu giao thông công cộng miễn phí, số người lái xe đi làm sẽ ít hơn nhiều. (thực tế: không miễn phí)" },
              { en: "If I had more free time, I would learn to play the guitar.", vi: "Nếu tôi có nhiều thời gian rảnh hơn, tôi sẽ học chơi ghi-ta. (thực tế: tôi bận)" },
            ],
          },
          {
            formula: "S + would + V + if + S + V-ed",
            vi: "Đảo hai vế: mệnh đề chính đứng trước thì KHÔNG có dấu phẩy",
            examples: [
              { en: "Many small shops would close if the government raised the rent.", vi: "Nhiều cửa hàng nhỏ sẽ đóng cửa nếu chính phủ tăng tiền thuê." },
            ],
          },
          {
            formula: "If + S + V-ed, S + could / might + V",
            vi: "could = sẽ có thể · might = có lẽ sẽ (kém chắc hơn would)",
            examples: [
              { en: "If schools started later, teenagers could get enough sleep.", vi: "Nếu trường vào học muộn hơn, thanh thiếu niên sẽ có thể ngủ đủ." },
              { en: "If the tax were higher, some companies might move abroad.", vi: "Nếu thuế cao hơn, một số công ty có lẽ sẽ chuyển ra nước ngoài." },
            ],
          },
          {
            formula: "If + S + were + …, S + would + V",
            vi: "Động từ be: văn viết nên dùng were cho MỌI ngôi (I / he / she / it); văn nói thân mật hay gặp was — cũng chấp nhận được",
            examples: [
              { en: "If I were the mayor, I would ban cars from the city centre.", vi: "Nếu tôi là thị trưởng, tôi sẽ cấm ô tô vào trung tâm thành phố." },
              { en: "If I were you, I would apply for the scholarship.", vi: "Nếu tôi là bạn, tôi sẽ nộp đơn xin học bổng. (cách khuyên lịch sự)" },
            ],
          },
          {
            formula: "If + S + could + V, S + would + V",
            vi: "“Nếu … có thể …” — could ở mệnh đề if = were able to",
            examples: [
              { en: "If I could live anywhere, I would choose a small town by the sea.", vi: "Nếu tôi có thể sống ở bất cứ đâu, tôi sẽ chọn một thị trấn nhỏ ven biển." },
            ],
          },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Loại 1 hay loại 2? Cùng một việc, hai thái độ",
        cols: [
          { title: "Loại 1 — tôi nghĩ CÓ THỂ", items: ["If I **get** the job, I **will move** to Da Nang.", "(tôi đã phỏng vấn, có cơ hội thật)", "If the government **invests** in rail, pollution **will fall**.", "(coi như một kế hoạch khả thi)"] },
          { title: "Loại 2 — tôi nghĩ KHÓ / KHÔNG", items: ["If I **got** the job, I **would move** to Da Nang.", "(tôi chưa nộp đơn, chỉ đang mơ)", "If the government **invested** in rail, pollution **would fall**.", "(chính phủ hiện không làm, tôi đang giả định)"] },
        ],
        caption: "Trong Task 2 và Part 3, cả hai đều đúng ngữ pháp — nhưng phải nhất quán: đã chọn loại 2 thì cả hai vế đều lùi thì.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở loại 2",
        items: [
          "Đặt **would** trong mệnh đề if: ~~If I would have more time, I would travel.~~ ⇒ If I **had** more time, I would travel. Mệnh đề if KHÔNG có would.",
          "Trộn nửa loại 1 nửa loại 2: ~~If the government invested more, pollution will fall.~~ ⇒ … pollution **would** fall.",
          "Tưởng quá khứ đơn ở đây là chuyện quá khứ: “If I **had** a car” = nếu BÂY GIỜ tôi có xe, không phải “hồi đó”.",
          "Sau would vẫn chia động từ: ~~it would helps~~ · ~~would to help~~ ⇒ it would **help** (nguyên mẫu không to).",
          "Văn viết học thuật: **If I were / If it were**, không viết ~~If I was~~ (văn nói thân mật chấp nhận was; bài thi viết nên dùng were).",
        ],
      },
      { t: "rule", formula: "If + S + V-ed / were, S + would / could / might + V", vi: "Tưởng tượng trái với hiện tại hoặc khó xảy ra ở tương lai. Mệnh đề if không bao giờ có would." },
      {
        t: "quiz",
        id: "t3d15-loai2-dich",
        title: "Dịch Việt → Anh (5 câu)",
        kind: "translate",
        grammar: "If + S + V-ed / were, S + would / could / might + V",
        items: [
          { q: "Nếu tôi có nhiều tiền hơn, tôi sẽ mua một căn hộ gần trung tâm.", answers: ["If I had more money, I would buy a flat near the centre.", "If I had more money, I would buy an apartment near the centre.", "If I had more money, I'd buy a flat near the centre.", "If I had more money, I would buy a flat near the city centre.", "If I had more money, I would buy an apartment near the city centre."], hint: "have → had · would buy · a flat / an apartment" },
          { q: "Nếu tôi là bạn, tôi sẽ không bỏ công việc đó.", answers: ["If I were you, I would not quit that job.", "If I were you, I wouldn't quit that job.", "If I were you, I would not leave that job.", "If I were you, I wouldn't leave that job.", "If I were you, I wouldn't give up that job."], hint: "If I were you · wouldn't quit / leave" },
          { q: "Nhiều người sẽ đạp xe đi làm nếu đường phố an toàn hơn.", answers: ["Many people would cycle to work if the streets were safer.", "Many people would cycle to work if the roads were safer.", "A lot of people would cycle to work if the streets were safer.", "Many people would ride a bike to work if the streets were safer.", "If the streets were safer, many people would cycle to work.", "If the roads were safer, many people would cycle to work."], hint: "would cycle · were safer — không dấu phẩy" },
          { q: "Nếu trẻ em dành ít thời gian hơn cho điện thoại, chúng có thể ngủ ngon hơn.", answers: ["If children spent less time on their phones, they could sleep better.", "If children spent less time on phones, they could sleep better.", "If children spent less time on their phones, they might sleep better.", "If children spent less time on their phones, they would sleep better."], hint: "spend → spent · could / might sleep" },
          { q: "Nếu không có Internet, cuộc sống của chúng ta sẽ rất khác.", answers: ["If there were no Internet, our lives would be very different.", "If there was no Internet, our lives would be very different.", "If we did not have the Internet, our lives would be very different.", "If we didn't have the Internet, our lives would be very different.", "If there were no Internet, our life would be very different.", "If there were no internet, our lives would be very different."], hint: "If there were no … · would be very different" },
        ],
      },
      {
        t: "mcq",
        id: "t3d15-loai2-luyen",
        title: "Loại 1 hay loại 2? Chọn đáp án đúng (6 câu)",
        items: [
          { q: "If I ______ the president, I would spend more on rural schools.", options: ["am", "would be", "were", "will be"], correct: 2, why: "Tôi không phải tổng thống ⇒ tưởng tượng trái hiện tại ⇒ loại 2: If I were. Mệnh đề if không có would / will." },
          { q: "Look at those clouds. If it ______ this afternoon, we will cancel the picnic.", options: ["rains", "rained", "would rain", "had rained"], correct: 0, why: "Trời đang nhiều mây ⇒ mưa là khả năng có thật ⇒ loại 1: If + hiện tại đơn, will + V." },
          { q: "If people ______ less meat, the demand for farmland would fall.", options: ["eat", "will eat", "would eat", "ate"], correct: 3, why: "Vế chính có would fall ⇒ loại 2 ⇒ mệnh đề if dùng quá khứ đơn: ate." },
          { q: "What ______ if you won a million dollars?", options: ["will you do", "would you do", "did you do", "do you do"], correct: 1, why: "If you won (quá khứ đơn) ⇒ loại 2 ⇒ câu hỏi dùng would you do." },
          { q: "If the bus service were more reliable, I ______ my motorbike at home.", options: ["leave", "will leave", "would leave", "left"], correct: 2, why: "If … were ⇒ loại 2 ⇒ vế chính would + V nguyên mẫu." },
          { q: "Câu nào ĐÚNG ngữ pháp?", options: ["If the rent would be lower, more young people could live in the city.", "If the rent was lower, more young people can live in the city.", "If the rent is lower, more young people would live in the city.", "If the rent were lower, more young people could live in the city."], correct: 3, why: "Loại 2 chuẩn: If + were, could + V. A đặt would trong mệnh đề if; B sai ở vế chính can (loại 1) ghép với vế if loại 2 — chữ was thì văn nói vẫn chấp nhận; C ghép if hiện tại (loại 1) với would." },
        ],
      },

      { t: "h", text: "3. Câu điều kiện loại 3 — tưởng tượng trái với quá khứ" },
      { t: "p", text: "Việc đã xảy ra rồi, không sửa được nữa. Loại 3 để nói “**giá mà hồi đó … thì đã …**”: nuối tiếc, phê bình, hoặc phân tích nguyên nhân một kết quả trong quá khứ. Mệnh đề if dùng **quá khứ hoàn thành** (had + V3), mệnh đề chính dùng **would have + V3**. Lưu ý: nếu thực tế là **đã không làm** thì mệnh đề if ở dạng **khẳng định**; nếu thực tế là **đã làm** thì mệnh đề if ở dạng **phủ định** — câu loại 3 luôn nói NGƯỢC với sự thật." },
      {
        t: "patterns",
        rows: [
          {
            formula: "If + S + had + V3, S + would have + V3",
            vi: "Nếu (hồi đó) đã … thì đã … — thực tế đã không như vậy",
            examples: [
              { en: "If I had studied harder, I would have passed the exam.", vi: "Nếu tôi đã học chăm hơn thì tôi đã đỗ kỳ thi. (thực tế: không học chăm, trượt)" },
              { en: "If the company had listened to its customers, it would not have lost so much money.", vi: "Nếu công ty đã lắng nghe khách hàng thì nó đã không mất nhiều tiền đến vậy." },
            ],
          },
          {
            formula: "If + S + had not + V3, S + would have + V3",
            vi: "Thực tế ĐÃ làm ⇒ mệnh đề if phủ định",
            examples: [
              { en: "If the Internet had not been invented, globalisation would have been much slower.", vi: "Nếu Internet đã không được phát minh thì toàn cầu hoá đã chậm hơn nhiều." },
              { en: "If she hadn't missed the bus, she wouldn't have been late for the interview.", vi: "Nếu cô ấy không lỡ xe buýt thì cô ấy đã không đến phỏng vấn muộn." },
            ],
          },
          {
            formula: "If + S + had + V3, S + could have / might have + V3",
            vi: "could have = lẽ ra đã có thể · might have = có lẽ đã",
            examples: [
              { en: "If the doctors had found the disease earlier, they could have saved him.", vi: "Nếu bác sĩ phát hiện bệnh sớm hơn thì họ lẽ ra đã có thể cứu ông ấy." },
              { en: "If the bridge had been repaired in time, the accident might not have happened.", vi: "Nếu cây cầu được sửa kịp thời thì tai nạn có lẽ đã không xảy ra." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Viết tắt", "Là chữ gì", "Cách nhận ra", "Ví dụ"],
        rows: [
          ["If I**'d** known", "I **had**", "sau 'd là V3", "If I'd known, I'd have told you."],
          ["I**'d** have told", "I **would**", "sau 'd là have / V nguyên mẫu", "I'd have told you."],
          ["would**'ve** / could**'ve**", "would **have** / could **have**", "đọc /wʊdəv/ — KHÔNG phải “would of”", "She would've come if you'd asked."],
        ],
        caption: "Một câu loại 3 nói nhanh có thể có hai chữ 'd khác nghĩa. Bài Nói hôm nay luyện phát âm phần này.",
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi sai kinh điển ở loại 3",
        items: [
          "Dùng quá khứ đơn cho việc quá khứ: ~~If I studied harder last year, I would have passed.~~ ⇒ If I **had studied** harder… (quá khứ đơn sau if là loại 2 = hiện tại).",
          "Đặt would have trong mệnh đề if: ~~If I would have known, I would have come.~~ ⇒ If I **had known**, I would have come.",
          "Quên have hoặc dùng sai dạng: ~~I would passed~~ · ~~I would have pass~~ ⇒ I would **have passed**.",
          "Viết theo âm nghe được: ~~would of~~ · ~~could of~~ ⇒ would **have** / would**'ve**. Lỗi này người bản ngữ cũng mắc, nhưng trong bài thi Viết nó bị tính là lỗi (kéo điểm GRA / LR xuống).",
        ],
      },
      { t: "p", text: "**Nhận biết thêm (học kỹ ở Tập 4): câu trộn.** Đôi khi điều kiện ở quá khứ nhưng kết quả ở hiện tại: If I **had taken** that job (hồi đó), I **would be** in Singapore **now**. Vế nào nói về lúc nào thì dùng dạng của lúc đó. Ở band 6 bạn chỉ cần **nhận ra** khi đọc – nghe; chưa cần chủ động dùng." },
      { t: "rule", formula: "If + S + had (not) + V3, S + would / could / might + have + V3", vi: "Tưởng tượng trái với một việc đã xong trong quá khứ: nuối tiếc, phê bình, phân tích nguyên nhân." },
      {
        t: "quiz",
        id: "t3d15-loai3-dich",
        title: "Dịch Việt → Anh (5 câu)",
        kind: "translate",
        grammar: "If + S + had (not) + V3, S + would / could / might + have + V3",
        items: [
          { q: "Nếu tôi dậy sớm hơn thì tôi đã không lỡ chuyến tàu.", answers: ["If I had got up earlier, I would not have missed the train.", "If I had got up earlier, I wouldn't have missed the train.", "If I had woken up earlier, I would not have missed the train.", "If I had woken up earlier, I wouldn't have missed the train.", "If I'd got up earlier, I wouldn't have missed the train.", "If I'd woken up earlier, I wouldn't have missed the train.", "If I had gotten up earlier, I would not have missed the train.", "If I had woken up earlier, I wouldn't have missed my train.", "If I had got up earlier, I wouldn't have missed my train."], hint: "had got up · wouldn't have missed" },
          { q: "Nếu họ đã đầu tư vào công nghệ thì công ty đã tồn tại được.", answers: ["If they had invested in technology, the company would have survived.", "If they'd invested in technology, the company would have survived.", "If they had invested in technology, the company could have survived.", "If they had invested in technology, the company would've survived.", "If they'd invested in technology, the company would've survived."], hint: "had invested in · would have survived" },
          { q: "Nếu trời không mưa thì chúng tôi đã đi bộ tới bảo tàng.", answers: ["If it had not rained, we would have walked to the museum.", "If it hadn't rained, we would have walked to the museum.", "If it hadn't rained, we'd have walked to the museum.", "If it hadn't rained, we would've walked to the museum."], hint: "hadn't rained · would have walked" },
          { q: "Nếu bạn nói với tôi thì tôi đã có thể giúp bạn.", answers: ["If you had told me, I could have helped you.", "If you'd told me, I could have helped you.", "If you had told me, I would have been able to help you.", "If you had told me, I could've helped you.", "If you'd told me, I could've helped you."], hint: "had told · could have helped" },
          { q: "Nếu chính phủ hành động sớm hơn thì vấn đề có lẽ đã không trở nên nghiêm trọng như vậy.", answers: ["If the government had acted earlier, the problem might not have become so serious.", "If the government had acted sooner, the problem might not have become so serious.", "If the government had acted earlier, the problem might not have become that serious.", "If the government had acted earlier, the problem would not have become so serious.", "If the government had acted sooner, the problem would not have become so serious."], hint: "had acted earlier · might not have become so serious" },
        ],
      },
      {
        t: "quiz",
        id: "t3d15-loai3-luyen",
        title: "Viết dạng đúng của động từ trong ngoặc — loại 2 hay loại 3? (8 câu)",
        kind: "fill",
        items: [
          { q: "If I ______ (know) about the traffic jam, I would have taken a different road.", answers: ["had known", "'d known"], hint: "Vế chính would have taken ⇒ loại 3" },
          { q: "If the museum had been free, more families ______ (visit) it last year.", answers: ["would have visited", "would've visited", "might have visited", "might've visited", "could have visited", "could've visited"], hint: "last year + had been ⇒ loại 3" },
          { q: "If I ______ (be) taller, I would play basketball for the university team.", answers: ["were", "was"], hint: "Nói về hiện tại ⇒ loại 2" },
          { q: "She ______ (not / fail) the driving test yesterday if she had practised more.", answers: ["would not have failed", "wouldn't have failed", "might not have failed"], hint: "yesterday ⇒ loại 3" },
          { q: "If cities ______ (have) more parks, people would exercise more often.", answers: ["had"], hint: "would exercise ⇒ loại 2" },
          { q: "If the factory ______ (not / close) in 2015, hundreds of workers would have kept their jobs.", answers: ["had not closed", "hadn't closed"], hint: "in 2015 ⇒ loại 3, thực tế đã đóng cửa ⇒ phủ định" },
          { q: "If we ______ (leave) ten minutes earlier, we could have caught the last bus.", answers: ["had left", "'d left"], hint: "could have caught ⇒ loại 3" },
          { q: "What would you do if you ______ (lose) your passport abroad?", answers: ["lost"], hint: "would you do ⇒ loại 2" },
        ],
      },

      { t: "h", text: "4. wish / if only — câu ước" },
      { t: "p", text: "**wish** (ước) dùng đúng quy tắc “lùi một thì” của câu điều kiện không có thật, chỉ khác là **không có mệnh đề kết quả**. **If only** nghĩa như I wish nhưng **mạnh hơn, nhiều cảm xúc hơn** (“giá mà…”, “phải chi…”). Có ba kiểu ước, tương ứng ba thời điểm." },
      {
        t: "table",
        head: ["Ước về", "Công thức", "Thực tế", "Ví dụ"],
        rows: [
          ["**hiện tại** (trái với bây giờ)", "S + wish + S + **V-ed / were / could + V**", "bây giờ không như vậy", "I wish I **spoke** English fluently. · I wish I **could** drive. · I wish it **were** cheaper."],
          ["**quá khứ** (nuối tiếc)", "S + wish + S + **had + V3**", "hồi đó đã không / đã lỡ", "I wish I **had started** learning English earlier. · She wishes she **hadn't sold** the house."],
          ["**người / vật khác thay đổi** (phàn nàn, sốt ruột)", "S + wish + S khác + **would + V**", "họ đang không chịu làm", "I wish my neighbours **would turn** the music down. · I wish it **would stop** raining."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "If only + S + V-ed / had V3 / would V",
            vi: "Giá mà… — mạnh hơn I wish, thường đứng một mình",
            examples: [
              { en: "If only I had more time!", vi: "Giá mà tôi có nhiều thời gian hơn!" },
              { en: "If only we had bought the tickets earlier.", vi: "Phải chi chúng tôi mua vé sớm hơn." },
            ],
          },
          {
            formula: "S + hope + (that) + S + V / will V",
            vi: "hope = hy vọng điều CÓ THỂ xảy ra — KHÔNG lùi thì",
            examples: [
              { en: "I hope you pass the exam.", vi: "Tôi hy vọng bạn đỗ kỳ thi. (có thể đỗ)" },
              { en: "I wish I could pass without studying.", vi: "Ước gì tôi đỗ được mà không cần học. (không thể)" },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với wish",
        items: [
          "wish + hiện tại đơn là SAI: ~~I wish I have a car.~~ ⇒ I wish I **had** a car.",
          "Ước về quá khứ phải dùng had V3: ~~I wish I studied harder at school.~~ (nghe như ước về hiện tại) ⇒ I wish I **had studied** harder at school.",
          "Không dùng would cho chính mình: ~~I wish I would be taller.~~ ⇒ I wish I **were** taller. · would chỉ dùng khi chủ ngữ sau wish là **người / vật khác** mà bạn muốn họ thay đổi.",
          "Chúc ai điều tốt thì dùng **hope** hoặc **wish + danh từ**: I hope you have a good trip. · I wish you **luck** / a happy birthday. KHÔNG nói ~~I wish you have a good trip.~~",
          "wish + **to V** = want to (trang trọng): Customers who wish **to complain** should call this number.",
        ],
      },
      { t: "rule", formula: "wish / if only + S + V-ed (hiện tại) · had V3 (quá khứ) · would V (người khác thay đổi)", vi: "Ước một điều trái với thực tế: lùi một thì, y như mệnh đề if của loại 2 và loại 3." },
      {
        t: "quiz",
        id: "t3d15-wish-dich",
        title: "Dịch Việt → Anh (5 câu)",
        kind: "translate",
        grammar: "wish / if only + S + V-ed · had V3 · would V",
        items: [
          { q: "Ước gì tôi sống gần chỗ làm hơn.", answers: ["I wish I lived closer to my workplace.", "I wish I lived closer to work.", "I wish I lived nearer to my workplace.", "I wish I lived nearer to work.", "I wish I lived closer to my office."], hint: "wish + lived · closer to work" },
          { q: "Tôi ước mình đã không tiêu nhiều tiền như vậy tháng trước.", answers: ["I wish I had not spent so much money last month.", "I wish I hadn't spent so much money last month.", "I wish I hadn't spent that much money last month."], hint: "wish + hadn't spent (quá khứ)" },
          { q: "Giá mà tôi biết nói tiếng Nhật!", answers: ["If only I could speak Japanese!", "If only I could speak Japanese.", "If only I spoke Japanese!", "If only I spoke Japanese."], hint: "If only + could speak" },
          { q: "Ước gì hàng xóm của tôi thôi hát karaoke vào ban đêm.", answers: ["I wish my neighbours would stop singing karaoke at night.", "I wish my neighbors would stop singing karaoke at night.", "I wish my neighbours wouldn't sing karaoke at night.", "I wish my neighbour would stop singing karaoke at night."], hint: "wish + người khác + would stop + V-ing" },
          { q: "Cô ấy ước mình đã chọn một ngành học khác.", answers: ["She wishes she had chosen a different major.", "She wishes she had chosen a different subject.", "She wishes she had chosen a different course.", "She wishes she'd chosen a different major.", "She wishes she had chosen another major."], hint: "wishes (ngôi ba) + had chosen" },
        ],
      },
      {
        t: "mcq",
        id: "t3d15-wish-luyen",
        title: "Chọn đáp án đúng (6 câu)",
        items: [
          { q: "I can't swim. I wish I ______.", options: ["can", "could", "would", "had"], correct: 1, why: "Ước trái hiện tại về khả năng ⇒ wish + could. Không dùng would cho chính mình." },
          { q: "I didn't take the job in Singapore. Now I wish I ______ it.", options: ["took", "would take", "had taken", "have taken"], correct: 2, why: "Nuối tiếc việc quá khứ ⇒ wish + had V3." },
          { q: "It has rained for three days. I wish it ______.", options: ["would stop", "stops", "had stopped", "will stop"], correct: 0, why: "Muốn vật khác (trời) thay đổi, sốt ruột ⇒ wish + would V." },
          { q: "Good luck tomorrow! I ______ you get the job.", options: ["wish", "would rather", "if only", "hope"], correct: 3, why: "Việc có thể xảy ra, chúc điều tốt ⇒ hope + hiện tại đơn. wish + mệnh đề chỉ dùng cho điều trái thực tế." },
          { q: "If only the government ______ more attention to rural areas ten years ago.", options: ["paid", "had paid", "would pay", "pays"], correct: 1, why: "ten years ago ⇒ nuối tiếc quá khứ ⇒ if only + had V3." },
          { q: "Câu nào SAI?", options: ["I wish I were better at maths.", "I wish my brother would help with the housework.", "I wish I would have more free time.", "I wish I hadn't said that."], correct: 2, why: "Không dùng wish + I would cho chính mình. Đúng: I wish I had more free time." },
        ],
      },

      { t: "h", text: "5. would rather · would prefer · it's (high) time" },
      { t: "p", text: "Ba cấu trúc này hay gặp trong Speaking (nói về sở thích, lựa chọn) và cũng **lùi thì** khi có chủ ngữ thứ hai — cùng logic “chưa có thật”." },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + would rather + V (+ than + V)",
            vi: "Thà / thích … hơn (cùng một chủ ngữ) — V nguyên mẫu KHÔNG to",
            examples: [
              { en: "I'd rather work from home than commute for two hours.", vi: "Tôi thà làm ở nhà còn hơn đi lại hai tiếng." },
              { en: "I'd rather not talk about my salary.", vi: "Tôi không muốn nói về lương của mình. (phủ định: would rather NOT + V)" },
            ],
          },
          {
            formula: "S + would rather + S khác + V-ed",
            vi: "Muốn NGƯỜI KHÁC làm gì — động từ lùi về quá khứ đơn",
            examples: [
              { en: "I'd rather you didn't smoke in here.", vi: "Tôi muốn bạn đừng hút thuốc ở đây. (lịch sự hơn Don't smoke)" },
              { en: "My parents would rather I studied medicine.", vi: "Bố mẹ tôi muốn tôi học y hơn." },
            ],
          },
          {
            formula: "S + would prefer + to V (+ rather than + V)",
            vi: "would prefer đi với TO V; prefer + V-ing + to + V-ing nói sở thích chung",
            examples: [
              { en: "I'd prefer to live in a small town rather than (live) in a big city.", vi: "Tôi thích sống ở thị trấn nhỏ hơn là ở thành phố lớn." },
              { en: "I prefer reading to watching TV.", vi: "Tôi thích đọc sách hơn xem tivi. (sở thích chung)" },
            ],
          },
          {
            formula: "It's (high / about) time + S + V-ed",
            vi: "Đã đến lúc ai đó phải làm (lẽ ra nên làm rồi) — có ý phê bình",
            examples: [
              { en: "It's high time the government invested in public transport.", vi: "Đã đến lúc chính phủ phải đầu tư vào giao thông công cộng." },
              { en: "It's time to go.", vi: "Đến giờ đi rồi. (It's time + to V: trung tính, không phê bình)" },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai",
        items: [
          "~~I would rather to stay at home.~~ ⇒ I would rather **stay** at home. (would rather + V không to; would **prefer** mới + to V)",
          "~~I'd rather you don't tell anyone.~~ ⇒ I'd rather you **didn't** tell anyone.",
          "~~I'd rather stay at home than to go out.~~ ⇒ … than **go** out.",
          "~~It's time the city builds a new hospital.~~ ⇒ It's time the city **built** a new hospital.",
          "Viết tắt **'d rather** = would rather (không phải had rather).",
        ],
      },
      { t: "rule", formula: "would rather + V (than V) · would rather + S + V-ed · would prefer + to V · it's (high) time + S + V-ed", vi: "Cùng chủ ngữ ⇒ V nguyên mẫu; có chủ ngữ thứ hai ⇒ lùi về quá khứ đơn." },
      {
        t: "quiz",
        id: "t3d15-rather-dich",
        title: "Dịch Việt → Anh (4 câu)",
        kind: "translate",
        grammar: "would rather + V · would rather + S + V-ed · it's time + S + V-ed",
        items: [
          { q: "Tôi thà đi tàu còn hơn đi máy bay.", answers: ["I would rather take the train than fly.", "I'd rather take the train than fly.", "I would rather go by train than fly.", "I'd rather go by train than fly.", "I would rather travel by train than by plane.", "I'd rather travel by train than by plane.", "I would rather go by train than by plane.", "I'd rather go by train than by plane."], hint: "would rather + V + than + V" },
          { q: "Tôi muốn bạn đừng gọi cho tôi sau 10 giờ tối.", answers: ["I would rather you did not call me after 10 p.m.", "I'd rather you didn't call me after 10 p.m.", "I would rather you didn't call me after 10 p.m.", "I'd rather you didn't call me after 10 pm.", "I'd rather you didn't phone me after 10 p.m.", "I'd rather you didn't call me after ten p.m.", "I'd rather you didn't call me after 10pm.", "I'd rather you didn't call me after 10 o'clock at night.", "I'd rather you didn't call me after 10 at night."], hint: "would rather + you + didn't call" },
          { q: "Đã đến lúc các thành phố phải cấm túi ni lông.", answers: ["It is high time cities banned plastic bags.", "It's high time cities banned plastic bags.", "It is time cities banned plastic bags.", "It's time cities banned plastic bags.", "It's about time cities banned plastic bags."], hint: "It's (high) time + cities + banned" },
          { q: "Tôi thích tự nấu ăn hơn là ăn ngoài.", answers: ["I would prefer to cook for myself rather than eat out.", "I'd prefer to cook for myself rather than eat out.", "I would rather cook for myself than eat out.", "I'd rather cook for myself than eat out.", "I prefer cooking for myself to eating out.", "I would rather cook myself than eat out.", "I'd rather cook at home than eat out."], hint: "would prefer to cook … rather than eat out / would rather cook than eat out" },
        ],
      },
      {
        t: "quiz",
        id: "t3d15-rather-luyen",
        title: "Viết dạng đúng của động từ trong ngoặc (6 câu)",
        kind: "fill",
        items: [
          { q: "I'd rather ______ (walk) than wait for the bus.", answers: ["walk"], hint: "would rather + V" },
          { q: "I'd rather you ______ (not / park) in front of my gate.", answers: ["didn't park", "did not park"], hint: "would rather + S khác + V-ed" },
          { q: "It's high time we ______ (take) climate change seriously.", answers: ["took"], hint: "it's high time + S + V-ed" },
          { q: "She would prefer ______ (study) abroad rather than stay in her home town.", answers: ["to study"], hint: "would prefer + to V" },
          { q: "My boss would rather I ______ (finish) the report today.", answers: ["finished"], hint: "would rather + S khác + V-ed" },
          { q: "It's time ______ (leave) — the last train goes in ten minutes.", answers: ["to leave"], hint: "It's time + to V (không có chủ ngữ thứ hai)" },
        ],
      },

      { t: "h", text: "6. Các từ thay cho if trong câu giả định" },
      { t: "p", text: "Bài đọc và bài nghe band 6 không phải lúc nào cũng viết chữ **if**. Nhận ra các cách nói dưới đây giúp bạn bắt đúng câu giả định khi đọc – nghe; ba dòng đầu nên **chủ động dùng** trong Part 3 và Task 2." },
      {
        t: "table",
        head: ["Cách nói", "Nghĩa", "Ví dụ", "Mức dùng"],
        rows: [
          ["**Without** + N, … would …", "Nếu không có …", "**Without** tourism, the island's economy **would collapse**.", "nên dùng"],
          ["**If it weren't for** + N", "Nếu không nhờ / không vì … (hiện tại)", "**If it weren't for** my scholarship, I **couldn't afford** university.", "nên dùng"],
          ["**Suppose / Supposing / Imagine** (that)…", "Giả sử …", "**Suppose** you **lost** your job tomorrow — what **would** you do?", "nên dùng khi nói"],
          ["**If it hadn't been for** + N", "Nếu không nhờ / không vì … (quá khứ)", "**If it hadn't been for** the vaccine, millions more **would have died**.", "nhận biết + thử dùng"],
          ["**unless** + V-ed", "trừ khi … (loại 2, ít gặp)", "I **wouldn't** move abroad **unless** I **had** a job offer.", "nhận biết"],
          ["**Had** + S + V3, … (đảo ngữ)", "= If + S + had V3 (văn viết trang trọng)", "**Had** the warning **been** given earlier, lives **would have been saved**.", "nhận biết (dạy ở Tập 4)"],
          ["**If** + S + **were to** + V", "Nếu (giả sử) … — nhấn mạnh rất khó xảy ra", "**If** the sea level **were to rise** by a metre, the delta **would be** flooded.", "nhận biết"],
        ],
      },
      { t: "rule", formula: "Without / If it weren't for + N, S + would + V · Suppose + S + V-ed, … would …?", vi: "Ba cách mở câu giả định không cần mệnh đề if dài — gọn, tự nhiên, đúng mức band 6." },

      { t: "h", text: "7. Dùng trong bài thi: band 5 → band 6" },
      { t: "p", text: "Câu giả định là cách **phát triển ý** rất mạnh: thay vì chỉ nói “điều này quan trọng”, bạn cho người đọc thấy **chuyện gì sẽ xảy ra nếu không có nó**. Tập 3 Ngày 10 đã dạy “viễn cảnh ngược lại” bằng loại 1 (If… don't…, … will…). Khi viễn cảnh đó trái thực tế, hãy chuyển sang loại 2." },
      {
        t: "table",
        head: ["Chỗ dùng", "Band 5", "Band 6", "Vì sao hơn"],
        rows: [
          ["Task 2 — phát triển ý", "Public libraries are very important for poor students.", "**If** public libraries **were closed**, students from low-income families **would lose** their only quiet place to study.", "Cho thấy hệ quả cụ thể; có câu phức đúng"],
          ["Task 2 — giải pháp", "The government should make buses cheaper. People will use buses.", "**If** bus fares **were halved**, many commuters **would** probably **leave** their motorbikes at home.", "Gộp hai câu đơn; có mức chắc chắn (probably)"],
          ["Task 2 — phản đề", "Some people say we should stop space research. I don't agree.", "**Without** space research, we **would not have** satellite navigation or accurate weather forecasts.", "Lập luận bằng viễn cảnh thay vì chỉ nói “không đồng ý”"],
          ["Part 3 — giả định", "If there is no Internet, people is very bored.", "**If** there **were** no Internet, I think people **would** read more, but most businesses **couldn't** operate.", "Đúng loại 2, hai hệ quả, could cho khả năng"],
          ["Part 2 — kết bài", "I am happy I joined the club.", "**If** I **hadn't joined** that club, I **would never have met** my best friend.", "Loại 3 khép câu chuyện bằng suy ngẫm"],
          ["Part 1 — ước", "I can't play any musical instrument. It is sad.", "**I wish** I **could** play the piano — I never had the chance to learn as a child.", "wish thay cho hai câu đơn"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo tự soát 30 giây cho câu có if",
        items: [
          "Khoanh mọi chữ **if** trong bài. Mệnh đề ngay sau if có **will / would** không? Có ⇒ gần như chắc chắn sai, bỏ đi.",
          "Hai vế có **cùng một loại** không? would + V đi với V-ed; would have V3 đi với had V3; will đi với hiện tại đơn.",
          "Mệnh đề if đứng trước ⇒ có **dấu phẩy**; đứng sau ⇒ không.",
          "Mỗi bài Task 2 chỉ cần **1–2 câu giả định** đặt đúng chỗ (phát triển ý, phản đề). Câu nào cũng if thì bài thành máy móc — tiêu chí CC bị trừ.",
        ],
      },
      {
        t: "mcq",
        id: "t3d15-dk-tong-luyen",
        title: "Tổng hợp: chọn câu ĐÚNG hoặc cách viết lại ĐÚNG (6 câu)",
        items: [
          { q: "Thực tế: I don't have a car, so I take the bus. — Viết lại:", options: ["If I had a car, I wouldn't take the bus.", "If I have a car, I won't take the bus.", "If I had had a car, I wouldn't take the bus.", "If I would have a car, I didn't take the bus."], correct: 0, why: "Trái hiện tại ⇒ loại 2: If + had, wouldn't + V." },
          { q: "Thực tế: She didn't apply, so she didn't get the scholarship. — Viết lại:", options: ["If she applied, she would get the scholarship.", "If she has applied, she would have got the scholarship.", "If she would have applied, she would get the scholarship.", "If she had applied, she might have got the scholarship."], correct: 3, why: "Trái quá khứ ⇒ loại 3: If + had V3, might / would have V3." },
          { q: "Thực tế: I regret that I didn't learn to swim. — Viết lại:", options: ["I wish I learned to swim tomorrow.", "I wish I had learned to swim.", "I wish I would learn to swim.", "I wish I have learned to swim."], correct: 1, why: "Nuối tiếc quá khứ ⇒ wish + had V3." },
          { q: "Câu nào ĐÚNG?", options: ["I'd rather to live in the countryside.", "I'd rather living in the countryside.", "I'd rather live in the countryside.", "I'd rather lived in the countryside."], correct: 2, why: "would rather + V nguyên mẫu không to (cùng chủ ngữ)." },
          { q: "______ antibiotics, many common infections would still be deadly.", options: ["Unless", "Without", "If only", "Supposing"], correct: 1, why: "Without + danh từ = If there were no… Unless / Supposing cần một mệnh đề; If only là câu ước." },
          { q: "Câu nào dùng được trong Task 2 để phát triển ý “công viên quan trọng với người già”?", options: ["If there are no parks, elderly people would had nowhere to exercise.", "If there would be no parks, elderly people have nowhere to exercise.", "If there were no parks, elderly people will have nowhere to exercise.", "If there were no parks, elderly people would have nowhere to exercise."], correct: 3, why: "Loại 2 chuẩn: If there were…, … would have (ở đây have là động từ chính “có”, không phải loại 3)." },
        ],
      },
    ],
  },

  /* ═══════════════════════ BÀI 2 — ĐỌC ═══════════════════════ */
  {
    id: "t3d15-doc",
    kind: "reading",
    title: "Table completion 2 + Short-answer questions — hai dạng trên một bài đọc",
    goal: "Làm đúng ít nhất 10/14 câu (8 câu Table completion + 6 câu Short-answer) trên một bài đọc lịch sử – công nghệ 800 từ trong 20 phút: đọc bảng để biết bài đọc được tổ chức thế nào, đoán loại từ của từng ô, lấy đúng chữ trong bài, và không bị lạc khi nhóm câu thứ hai quay lại đầu bài.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        items: [
          "**Ôn từ Tập 1 Ngày 8** (Table completion lần đầu) và **Tập 2 Ngày 8 · Tập 3 Ngày 7** (Short-answer). Hôm nay ghép hai dạng trên **một bài đọc 800 từ** như đề thật.",
          "Bảng là **bản đồ của bài đọc**: tiêu đề hàng cho biết đọc ĐOẠN nào, tiêu đề cột cho biết tìm LOẠI thông tin gì.",
          "Mỗi ô trống phải **đúng ngữ pháp với chữ quanh nó** và **đúng giới hạn từ** — lấy nguyên chữ trong bài, không đổi dạng.",
          "Khi sang nhóm câu thứ hai, **thứ tự quay lại từ đầu bài** — đây là chỗ người band 5 mất 3–4 phút vì đọc tiếp từ cuối.",
          "Đẩy **Reading từ 15–18 lên 23/40**: hai dạng này là dạng “ăn điểm” — đáp án là chữ có sẵn trong bài, không phải suy luận.",
        ],
      },

      { t: "h", text: "1. Table completion ở band 6 khác lần đầu bạn học chỗ nào?" },
      { t: "p", text: "**Table completion** (hoàn thành bảng) cho một bảng tóm tắt thông tin của bài đọc, có một số ô để trống; bạn điền **chữ lấy từ bài** vào ô, trong giới hạn từ đề cho. Tập 1 Ngày 8 đã làm bảng 7 ô (bài “Keeping Cities Cool”, mỗi hàng là một cách làm mát, tên hàng tìm thấy ngay) và Tập 2 Ngày 5 gặp lại dạng này ở Listening. Lần này, bảng được **viết lại** (paraphrase) mạnh hơn, có **ô bẫy**, và được **ghép với Short-answer** trên cùng một bài như đề thật." },
      {
        t: "table",
        head: ["Điểm so sánh", "Tập 1 Ngày 8 (band 4–5)", "Hôm nay (band 6)"],
        rows: [
          ["Số câu, dạng ghép", "7 ô bảng + 3 câu Sentence completion", "8 ô bảng + 6 câu Short-answer, **giới hạn từ khác nhau** (TWO / THREE)"],
          ["Hàng ↔ đoạn", "mỗi hàng đúng một đoạn, tên hàng (Street trees, Green roofs…) chép từ bài", "phần lớn mỗi hàng một đoạn, nhưng có ô nằm ở **câu đầu đoạn kế tiếp** (câu 7)"],
          ["Chữ trong bảng", "paraphrase nhẹ: đồng nghĩa, đổi vài chữ (the floor beneath it → the floor below)", "đồng nghĩa + đổi loại từ + đổi cấu trúc (flowed more slowly → flow became slower)"],
          ["Thứ tự đáp án", "theo thứ tự bài trong từng hàng", "theo thứ tự bài **trong từng hàng**; hàng theo thứ tự đoạn (hiếm khi đảo)"],
          ["Bẫy", "ít — thường một ứng viên mỗi ô", "hai danh từ cạnh nhau · nhiều mốc năm trong một đoạn · vượt giới hạn từ · số ít – số nhiều"],
        ],
      },
      { t: "p", text: "Vì sao người ra đề thích dạng bảng? Vì nhiều bài đọc học thuật có **cấu trúc so sánh**: nhiều đối tượng (thiết bị, quốc gia, lý thuyết, giai đoạn) được mô tả theo cùng một số mặt (thời gian, cách hoạt động, ưu, nhược). Thấy bảng là biết bài đọc thuộc kiểu này — và biết luôn bài được chia đoạn theo cột đầu tiên." },
      {
        t: "sodo",
        kind: "flow",
        title: "6 bước làm Table completion",
        steps: [
          { label: "1. Đọc đề lệnh", sub: "khoanh giới hạn từ: NO MORE THAN **TWO** WORDS **AND/OR A NUMBER**" },
          { label: "2. Đọc tiêu đề bảng, cột, hàng", sub: "cột = loại thông tin · hàng = đối tượng ⇒ biết đoạn nào chứa hàng nào" },
          { label: "3. Đoán loại từ từng ô", sub: "sau a / the ⇒ danh từ · sau to ⇒ động từ · sau giới từ ⇒ danh từ / V-ing · số, năm" },
          { label: "4. Tìm đoạn bằng tên ở cột đầu", sub: "tên riêng, năm, thuật ngữ không bị paraphrase ⇒ quét (scan) rất nhanh" },
          { label: "5. Đọc kỹ 2–3 câu quanh đó", sub: "tìm chỗ nói CÙNG ý với ô; lấy đúng chữ trong bài" },
          { label: "6. Đọc lại cả ô", sub: "đúng ngữ pháp? đúng số từ? đúng chính tả, số ít – số nhiều?" },
        ],
      },
      {
        t: "table",
        head: ["Chữ quanh ô trống", "Loại từ cần điền", "Ví dụ ô", "Đáp án có dạng"],
        rows: [
          ["a / an / the / its ______", "danh từ (cụm danh từ)", "moved by a ______", "weight · heavy weight"],
          ["used in ______ / made for ______", "danh từ chỉ nơi, nhóm người", "used in ______ to time speakers", "law courts"],
          ["as ______ dropped / when ______ rose", "danh từ làm chủ ngữ", "slowed as ______ dropped", "pressure"],
          ["first built in ______ / by ______", "năm · tên nước · tên người", "designed in ______", "1656"],
          ["could not be used on a ______", "danh từ đếm được số ít", "useless on a ______", "ship"],
          ["affected by ______ / depends on ______", "danh từ (thường không đếm được)", "affected by ______", "temperature"],
        ],
        caption: "Đoán loại từ TRƯỚC khi đọc bài giúp mắt bạn chỉ dừng ở đúng loại chữ đó.",
      },
      {
        t: "note",
        title: "⚠️ Sáu cách mất điểm oan ở Table completion",
        items: [
          "**Vượt giới hạn từ**: đề cho TWO WORDS mà viết “their law courts” (3 từ) ⇒ sai. Bỏ bớt từ không cần: “law courts”.",
          "**Đổi dạng từ**: bài viết “monasteries” mà điền “monastery”. Dạng này lấy **nguyên chữ** trong bài.",
          "**Lặp chữ đã có trong bảng**: ô ghi “a ______” mà điền “a bell” ⇒ thành “a a bell”. Đọc lại cả ô sau khi điền.",
          "**Lấy nhầm danh từ đứng gần**: câu bài có hai danh từ (“the pressure fell and the water flowed more slowly”) — ô hỏi cái gì **giảm** thì phải là pressure, không phải water.",
          "**Điền theo hiểu biết của mình**: bạn biết đồng hồ quả lắc do Galileo nghĩ ra trước? Đề chỉ chấm theo **bài viết gì**.",
          "**Sai chính tả khi chép**: chép từ bài mà vẫn sai (temprature, pendulm) là mất điểm hoàn toàn. Nhìn lại từng chữ cái.",
        ],
      },
      { t: "rule", formula: "Tiêu đề hàng ⇒ ĐOẠN · tiêu đề cột ⇒ LOẠI thông tin · chữ quanh ô ⇒ LOẠI TỪ · đề lệnh ⇒ SỐ TỪ", vi: "Bốn thứ phải đọc trước khi tìm đáp án cho bất kỳ ô nào trong bảng." },

      { t: "h", text: "2. Short-answer — ôn 60 giây và hai điều mới" },
      { t: "p", text: "**Short-answer questions** (câu hỏi trả lời ngắn) đã học kỹ ở Tập 3 Ngày 7: từ hỏi quyết định loại đáp án (Who ⇒ người, When ⇒ thời gian, How much ⇒ lượng…), đáp án lấy **nguyên chữ** trong bài, theo **thứ tự bài**, không vượt giới hạn từ. Hôm nay thêm hai điều chỉ xuất hiện khi đề **ghép nhiều dạng**." },
      {
        t: "table",
        head: ["Điều mới", "Giải thích", "Làm gì"],
        rows: [
          ["**Mỗi nhóm câu bắt đầu lại từ đầu bài**", "Câu 1–8 (bảng) đi từ đoạn A tới G. Câu 9–14 (short-answer) KHÔNG đọc tiếp từ G — chúng lại rải từ đầu bài.", "Xong nhóm 1, quay mắt về đoạn đầu. Dùng ghi chú lề (mỗi đoạn 2–3 chữ) để tìm đoạn nhanh."],
          ["**Hai nhóm hiếm khi hỏi cùng một chi tiết**", "Chi tiết đã là đáp án ở bảng thường không là đáp án lần nữa.", "Câu short-answer rơi vào đoạn nào, tìm ở những câu bạn **chưa gạch chân** khi làm bảng."],
          ["**Giới hạn từ của hai nhóm có thể khác nhau**", "Bảng: TWO WORDS; short-answer: THREE WORDS.", "Đọc lại đề lệnh của TỪNG nhóm; viết giới hạn cạnh số câu."],
          ["**Năm, số gây nhiễu**", "Một đoạn có 2–3 mốc năm; câu hỏi chỉ đúng với một mốc.", "Đọc động từ đi với mỗi năm (designed · tested · became law) rồi mới chọn."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo ghi chú lề cho bài 800–900 từ",
        items: [
          "Lúc skim lần đầu (2 phút), viết cạnh mỗi đoạn 2–3 chữ: A sundial · B water · C mechanical · D pendulum · E sea / Harrison · F railways · G quartz / atomic.",
          "Ghi chú lề chính là **cột đầu tiên của một cái bảng** bạn tự lập — nên với bài có Table completion, ghi chú của bạn và bảng của đề gần như trùng nhau.",
          "Thi trên máy: bôi vàng (highlight) tên riêng và năm ở mỗi đoạn thay cho ghi chú lề.",
        ],
      },

      { t: "h", text: "3. Bài đọc — Questions 1–14 (20 phút)" },
      { t: "p", text: "Đặt đồng hồ **20 phút**. Đọc bảng và 6 câu hỏi trước (1 phút), skim bài và ghi chú lề (2 phút), rồi làm. Chưa xem đáp án cho tới khi hết giờ." },
      {
        t: "passage",
        title: "Keeping Time",
        intro: "You should spend about 20 minutes on Questions 1–14, which are based on the passage below.",
        paras: [
          { label: "A", text: "For most of human history, people needed nothing more than the sun to organise their day. The earliest devices built for the purpose, shadow clocks and sundials, were in use in Egypt by about 1500 BC. A sundial is simply an upright stick or plate whose shadow moves across a marked surface as the sun crosses the sky. It cost almost nothing to make and never needed repairing. Its weakness was equally obvious: it told the time only in daylight, and only when the sky was clear." },
          { label: "B", text: "To measure time after dark, the Egyptians developed the water clock, a stone bowl with a small hole near the base through which water dripped at a roughly steady rate; lines marked on the inside showed how many hours had passed. The oldest surviving example dates from around 1400 BC. The Greeks later borrowed the idea and called the device a clepsydra, or ‘water thief’. They used it in their law courts to make sure that each speaker was given the same amount of time. Water clocks, however, were never very reliable. As the bowl emptied, the pressure fell and the water flowed more slowly, and in cold climates the water simply froze." },
          { label: "C", text: "The first clocks driven by machinery rather than by water appeared in Europe towards the end of the thirteenth century. They were built for monasteries, where monks had to pray at fixed hours, and they were powered by a heavy weight hanging from a rope that slowly unwound. Surprisingly, these early machines had neither a face nor hands. Their only job was to strike a bell — the English word ‘clock’ comes from an old word for bell. They were also poor timekeepers, gaining or losing as much as fifteen minutes a day, so that someone had to reset them regularly using a sundial." },
          { label: "D", text: "The great leap in accuracy came in 1656, when the Dutch scientist Christiaan Huygens designed a clock regulated by a pendulum. Decades earlier Galileo had noticed that a swinging weight takes almost exactly the same time to complete each swing, whether the swing is wide or narrow, but he never produced a working clock. Huygens's design cut the daily error from about fifteen minutes to roughly fifteen seconds. For the first time it made sense to add a minute hand to the clock face, and within a generation pendulum clocks stood in the homes of wealthy families across Europe." },
          { label: "E", text: "A pendulum, however, is useless on a rolling ship, and this mattered a great deal. Sailors could find their latitude from the sun, but to calculate longitude — how far east or west they had travelled — they needed to know the exact time at their home port. An error of a few minutes could put a ship many kilometres off course, and thousands of lives were lost in shipwrecks as a result. In 1714 the British government offered a large prize for a solution. It was eventually claimed not by an astronomer but by John Harrison, a carpenter who had taught himself clockmaking. His fourth design, which looked like an oversized pocket watch, was tested on a voyage to Jamaica in 1761 and lost only five seconds in eighty-one days at sea." },
          { label: "F", text: "On land, clocks remained a local matter for another century. Every town set its clocks by the sun, so that noon in Bristol, in the west of England, came about ten minutes later than noon in London. Nobody minded until the railways arrived. A timetable is impossible to write if every station keeps its own time, and in 1840 the Great Western Railway became the first company to run all its trains on London time. Other companies followed, and in 1880 a single standard time became law throughout Britain. Four years later, an international conference agreed that the line running through Greenwich, in London, would be the prime meridian — the starting point from which longitude and, later, the world's time zones would be measured." },
          { label: "G", text: "The twentieth century replaced moving parts with vibrations. In 1927 engineers in the United States built a clock controlled by a crystal of quartz, which vibrates at an extremely regular rate when an electric current is passed through it. Early quartz clocks filled a small room, but by 1969 the technology had shrunk enough for the first quartz wristwatch to go on sale, and cheap, accurate watches soon became available to everyone. Even quartz, though, is affected by temperature. The most precise clocks of all count the vibrations of atoms instead. The first accurate atomic clock was built in Britain in 1955, and its modern descendants would neither gain nor lose a second in millions of years. Few people ever see one, yet without them satellite navigation would not work: a phone can find its position only because the satellites above it carry atomic clocks." },
        ],
      },
      { t: "p", text: "**Questions 1–8** — Complete the table below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "table",
        head: ["Device", "First appeared", "How it worked / was used", "Main weakness"],
        rows: [
          ["Sundial", "Egypt, by about 1500 BC", "a **1** ______ travels over a marked surface", "no use at night or under cloud"],
          ["Water clock", "oldest example: c. 1400 BC", "water dripped out of a bowl; the Greeks used it in **2** ______ to give speakers equal time", "flow became slower as **3** ______ dropped; water froze"],
          ["Early mechanical clock", "Europe, late 13th century; made for **4** ______", "powered by a heavy weight; its only function was to ring **5** ______", "up to 15 minutes wrong per day"],
          ["Pendulum clock", "designed in 1656", "regular swing kept it accurate; a **6** ______ could now be added to the face", "could not work on a **7** ______"],
          ["Quartz clock", "USA, 1927", "a crystal vibrates when electricity passes through it", "influenced by **8** ______"],
        ],
        caption: "Keeping time: five devices compared",
      },
      {
        t: "quiz",
        id: "t3d15-doc-bang",
        title: "Questions 1–8 — Table completion (NO MORE THAN TWO WORDS AND/OR A NUMBER)",
        kind: "fill",
        items: [
          { q: "1. Sundial — a ______ travels over a marked surface", answers: ["shadow"] },
          { q: "2. Water clock — the Greeks used it in ______ to give speakers equal time", answers: ["law courts", "courts"] },
          { q: "3. Water clock — flow became slower as ______ dropped", answers: ["pressure", "the pressure"] },
          { q: "4. Early mechanical clock — made for ______", answers: ["monasteries"] },
          { q: "5. Early mechanical clock — its only function was to ring ______", answers: ["a bell", "bell"] },
          { q: "6. Pendulum clock — a ______ could now be added to the face", answers: ["minute hand"] },
          { q: "7. Pendulum clock — could not work on a ______", answers: ["ship", "rolling ship"] },
          { q: "8. Quartz clock — influenced by ______", answers: ["temperature"] },
        ],
      },
      { t: "p", text: "**Questions 9–14** — Answer the questions below. Choose **NO MORE THAN THREE WORDS AND/OR A NUMBER** from the passage for each answer. (Nhớ: nhóm câu này bắt đầu lại từ đầu bài.)" },
      {
        t: "quiz",
        id: "t3d15-doc-ngan",
        title: "Questions 9–14 — Short-answer (NO MORE THAN THREE WORDS AND/OR A NUMBER)",
        kind: "fill",
        items: [
          { q: "9. What does the Greek name for the water clock mean in English?", answers: ["water thief", "a water thief"] },
          { q: "10. What was John Harrison's original job?", answers: ["carpenter", "a carpenter"] },
          { q: "11. How much time did Harrison's fourth clock lose during its test at sea?", answers: ["five seconds", "5 seconds", "only five seconds"] },
          { q: "12. What new form of transport made different local times a problem?", answers: ["railways", "the railways"] },
          { q: "13. In which year did one standard time become a legal requirement across Britain?", answers: ["1880", "in 1880"] },
          { q: "14. What modern technology would fail if there were no atomic clocks?", answers: ["satellite navigation"] },
        ],
      },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Câu trong bài (đoạn)", "Paraphrase / bẫy"],
        rows: [
          ["1", "shadow", "A: “…whose **shadow** moves across a marked surface”", "moves across → travels over. Ô có sẵn “a” ⇒ chỉ điền một danh từ số ít."],
          ["2", "law courts", "B: “They used it in their **law courts** to make sure that each speaker was given the same amount of time.”", "the same amount of time → equal time. “their law courts” là 3 từ ⇒ bỏ their."],
          ["3", "pressure", "B: “As the bowl emptied, the **pressure** fell and the water flowed more slowly”", "fell → dropped; flowed more slowly → flow became slower. Bẫy: bowl / water đứng ngay cạnh — nhưng thứ GIẢM là pressure."],
          ["4", "monasteries", "C: “They were built for **monasteries**, where monks had to pray…”", "built for → made for. Giữ số nhiều như bài; “monks” sai vì đồng hồ được làm cho nơi chốn, và bài viết built for monasteries."],
          ["5", "a bell", "C: “Their only job was to strike **a bell**”", "only job → only function; strike → ring. Ô không có mạo từ ⇒ điền “a bell” (hoặc “bell” vẫn chấm đúng)."],
          ["6", "minute hand", "D: “…it made sense to add a **minute hand** to the clock face”", "add … to the clock face → could now be added to the face. Ô có “a” ⇒ không lặp “a”."],
          ["7", "ship", "E: “A pendulum, however, is useless on a rolling **ship**”", "useless on → could not work on. Đáp án nằm ở đoạn E chứ không phải D: một hàng của bảng có thể lấy thông tin từ ĐẦU đoạn kế tiếp."],
          ["8", "temperature", "G: “Even quartz, though, is affected by **temperature**.”", "affected by → influenced by. Bẫy: electric current cũng ở đoạn này nhưng đó là cách hoạt động, không phải điểm yếu."],
          ["9", "water thief", "B: “…called the device a clepsydra, or ‘**water thief**’”", "Chữ “or” sau thuật ngữ = tín hiệu định nghĩa (đã học ở Tập 3 Ngày 7). Không điền clepsydra — đó là tên Hy Lạp, câu hỏi hỏi NGHĨA."],
          ["10", "carpenter", "E: “John Harrison, a **carpenter** who had taught himself clockmaking”", "original job → nghề trước khi làm đồng hồ. Bẫy: astronomer xuất hiện ngay trước nhưng ở dạng phủ định (not by an astronomer)."],
          ["11", "five seconds", "E: “…lost only **five seconds** in eighty-one days at sea”", "How much time ⇒ một khoảng thời gian. Bẫy: eighty-one days là độ dài chuyến đi; fifteen seconds (đoạn D) là sai số mỗi ngày của đồng hồ quả lắc."],
          ["12", "railways", "F: “Nobody minded until the **railways** arrived.”", "made … a problem ← Nobody minded until…. “trains” cũng có trong đoạn nhưng câu nói cái mới XUẤT HIỆN là the railways."],
          ["13", "1880", "F: “in **1880** a single standard time became law throughout Britain”", "became law → legal requirement; throughout → across. Bẫy: 1840 (một công ty đường sắt) và 1884 = “four years later” (hội nghị quốc tế)."],
          ["14", "satellite navigation", "G: “without them **satellite navigation** would not work”", "would not work → would fail; without them → if there were no atomic clocks. Câu loại 2 với without — đúng ngữ pháp bài 1 hôm nay."],
        ],
      },
      {
        t: "note",
        title: "📌 Chấm điểm và đọc lại",
        items: [
          "**12–14 đúng**: bạn đã ở mức band 6.5+ cho hai dạng này. Lần sau rút thời gian xuống 17 phút.",
          "**10–11 đúng**: đạt mục tiêu band 6. Xem lại câu sai: sai vì **không tìm ra đoạn** hay vì **chép sai / quá số từ**?",
          "**Dưới 10**: đọc lại mục 1 và 2, rồi làm lại bài sau 2 ngày. Sai nhiều ở câu 9–14 ⇒ ôn Tập 3 Ngày 7; sai nhiều ở câu 1–8 ⇒ luyện bước “đoán loại từ”.",
          "Chú ý câu 7: đáp án của hàng “Pendulum clock” nằm ở **câu đầu đoạn E**. Bài đọc thật hay nối đoạn như vậy — điểm yếu của thứ cũ là lý do sinh ra thứ mới.",
        ],
      },

      { t: "h", text: "4. Soi lại bài: paraphrase và bẫy số liệu" },
      {
        t: "mcq",
        id: "t3d15-doc-soi",
        title: "Nhìn lại bài Keeping Time (6 câu)",
        items: [
          { q: "Ô số 3 viết “flow became slower as ______ dropped”. Bài viết “the pressure fell and the water flowed more slowly”. Đây là kiểu paraphrase nào?", options: ["Chỉ đổi từ đồng nghĩa", "Đổi loại từ (flowed → flow, more slowly → slower) và từ đồng nghĩa (fell → dropped)", "Đổi chủ động sang bị động", "Không paraphrase"], correct: 1, why: "Động từ flowed thành danh từ flow, trạng từ more slowly thành tính từ slower (cách ② đổi loại từ của Tập 2 Ngày 8), cộng thêm fell thành dropped (cách ① đồng nghĩa) — hai cách chồng lên nhau trong một ô, đúng độ khó band 6." },
          { q: "Vì sao “monks” KHÔNG phải đáp án câu 4 (“made for ______”)?", options: ["Vì monks là số nhiều", "Vì monks không có trong bài", "Vì bài viết đồng hồ được “built for monasteries”; monks chỉ xuất hiện trong mệnh đề giải thích phía sau", "Vì vượt giới hạn từ"], correct: 2, why: "built for = made for, tân ngữ của nó là monasteries. Phải lấy đúng chữ đứng ở vị trí tương ứng trong câu gốc." },
          { q: "Đoạn E có ba con số: 1714, 1761, eighty-one. Câu hỏi “When was Harrison's fourth clock tested?” có đáp án là:", options: ["1761", "1714", "eighty-one days", "five seconds"], correct: 0, why: "Động từ đi với 1761 là “was tested”; 1714 đi với “offered a large prize”. Đọc động từ cạnh mỗi con số." },
          { q: "Câu “its modern descendants would neither gain nor lose a second in millions of years” có nghĩa là:", options: ["Đồng hồ nguyên tử sẽ được dùng trong hàng triệu năm", "Đồng hồ nguyên tử mất một giây mỗi năm", "Đồng hồ nguyên tử chạy trong hàng triệu năm vẫn không lệch quá một giây", "Đồng hồ nguyên tử đã tồn tại hàng triệu năm"], correct: 2, why: "neither gain nor lose = không nhanh cũng không chậm; would = câu giả định (nếu để chạy hàng triệu năm)." },
          { q: "Xong câu 8 (đoạn G), bạn nên tìm đáp án câu 9 ở đâu?", options: ["Tiếp tục ở đoạn G", "Ở đoạn cuối cùng", "Ở bất kỳ đâu — không có quy luật", "Quay lại đầu bài: mỗi nhóm câu đi lại từ đầu theo thứ tự"], correct: 3, why: "Mỗi nhóm câu hỏi có thứ tự riêng, bắt đầu lại từ đầu bài. Câu 9 nằm ở đoạn B." },
          { q: "Đề ghi NO MORE THAN TWO WORDS AND/OR A NUMBER. Đáp án nào SAI luật?", options: ["minute hand", "their law courts", "1656", "15 minutes"], correct: 1, why: "“their law courts” có 3 từ. “15 minutes” = một số + một từ, hợp lệ." },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "device", pos: "n", ipa: "/dɪˈvaɪs/", vi: "thiết bị, dụng cụ", ex: "The earliest devices for telling the time used the sun.", exVi: "Những thiết bị xem giờ sớm nhất dùng mặt trời.", more: "a mobile / electronic / labour-saving **device** · động từ **devise** /dɪˈvaɪz/ = nghĩ ra" },
          { w: "reliable", pos: "adj", ipa: "/rɪˈlaɪəbl/", vi: "đáng tin cậy, chạy ổn định", ex: "Water clocks were never very reliable.", exVi: "Đồng hồ nước chưa bao giờ thật đáng tin cậy.", more: "họ từ: **rely on** (v) · **reliability** (n) · trái nghĩa **unreliable** · a reliable source / service" },
          { w: "accuracy", pos: "n", ipa: "/ˈækjərəsi/", vi: "độ chính xác", ex: "The pendulum brought a great leap in accuracy.", exVi: "Quả lắc mang lại bước nhảy vọt về độ chính xác.", more: "**accurate** (adj) · **accurately** (adv) · trái nghĩa **inaccurate** · with great accuracy" },
          { w: "regulate", pos: "v", ipa: "/ˈreɡjuleɪt/", vi: "điều chỉnh, điều tiết", ex: "The clock was regulated by a pendulum.", exVi: "Chiếc đồng hồ được điều chỉnh bằng một quả lắc.", more: "**regulation** (n) = quy định (Tập 3 Ngày 6) · regulate the temperature / the market" },
          { w: "voyage", pos: "n", ipa: "/ˈvɔɪɪdʒ/", vi: "chuyến đi dài bằng tàu biển (hoặc tàu vũ trụ)", ex: "The clock was tested on a voyage to Jamaica.", exVi: "Chiếc đồng hồ được thử trên một chuyến đi biển tới Jamaica.", more: "khác **journey** (chuyến đi nói chung, hay dùng cho đường bộ) · **trip** (chuyến đi ngắn) · **flight** (bay)" },
          { w: "off course", pos: "phr", ipa: "/ɒf kɔːs/", vi: "lệch hướng, chệch đường", ex: "A small error could put a ship many kilometres off course.", exVi: "Một sai số nhỏ có thể khiến tàu lệch hướng nhiều ki-lô-mét.", more: "trái nghĩa **on course** (for) = đúng hướng, đang trên đà · khác **of course** = tất nhiên" },
          { w: "timetable", pos: "n", ipa: "/ˈtaɪmteɪbl/", vi: "lịch tàu xe; thời khoá biểu", ex: "A timetable is impossible to write if every station keeps its own time.", exVi: "Không thể viết lịch tàu nếu mỗi ga dùng giờ riêng.", more: "Anh–Anh: timetable · Anh–Mỹ: **schedule** · a bus / train / school timetable" },
          { w: "vibrate", pos: "v", ipa: "/vaɪˈbreɪt/", vi: "rung, dao động", ex: "A quartz crystal vibrates at a very regular rate.", exVi: "Tinh thể thạch anh rung với nhịp rất đều.", more: "**vibration** (n) /vaɪˈbreɪʃn/ — trọng âm trước -tion (Tập 3 Ngày 7)" },
          { w: "precise", pos: "adj", ipa: "/prɪˈsaɪs/", vi: "chính xác tới từng chi tiết", ex: "Atomic clocks are the most precise clocks ever built.", exVi: "Đồng hồ nguyên tử là loại chính xác nhất từng được chế tạo.", more: "**precisely** (adv) · **precision** (n) /prɪˈsɪʒn/ · precise measurements / details" },
          { w: "standard", pos: "n / adj", ipa: "/ˈstændəd/", vi: "tiêu chuẩn; (thuộc) chuẩn chung", ex: "In 1880 a single standard time became law.", exVi: "Năm 1880, một giờ chuẩn duy nhất trở thành luật.", more: "living **standards** = mức sống · **standardise** (v) · meet / raise / set a standard" },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học sau bài",
        items: [
          "Chép bảng đáp án cột “Paraphrase / bẫy” của 3 câu bạn sai vào **sổ lỗi** — ghi rõ kiểu lỗi (lạc đoạn · sai loại từ · quá số từ · nhầm số).",
          "Tự lập bảng cho một bài đọc cũ có cấu trúc so sánh (ví dụ “The Box That Shrank the World”, Tập 3 Ngày 3): cột = thời gian · thay đổi · hệ quả. Lập được bảng là đã hiểu bố cục bài.",
          "Tìm trong bài hôm nay 2 câu giả định (would / without) và đọc to — nối với bài Ngữ pháp và bài Nói.",
        ],
      },
    ],
  },

  /* ═══════════════════════ BÀI 3 — NÓI ═══════════════════════ */
  {
    id: "t3d15-noi",
    kind: "speaking",
    title: "Nói Part 3: câu hỏi giả định “What would happen if…?” + nối âm would've / could've",
    goal: "Trả lời câu hỏi giả định của Part 3 trong 5–7 câu (35–45 giây) ở mức band 6: nhận ra câu hỏi đang ở loại 2 hay loại 3 và giữ đúng thì suốt câu trả lời, nêu hệ quả chính + lý do, thêm hệ quả thứ hai hoặc mặt trái với mức chắc chắn phù hợp (would / might / could), kéo về thực tế để chốt — và đọc would've / could've / should've thành một khối nối âm.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        items: [
          "Part 3 thường có **1–2 câu hỏi giả định**: “What would happen if…?”, “How would … change if…?”, “If you could…, what would you…?”. Giám khảo dùng chúng để xem bạn có **ngữ pháp band 6+** không.",
          "**Ôn từ Tập 3 Ngày 10**: “viễn cảnh ngược lại” bằng loại 1 (If… don't…, … will…). Hôm nay viễn cảnh **không có thật** ⇒ loại 2 (would) và loại 3 (would have) của bài Ngữ pháp.",
          "Khung 4 bước: ==đánh dấu giả định → hệ quả chính + vì sao → hệ quả thứ hai / mặt trái → kéo về thực tế==.",
          "Đổi **mức chắc chắn**: would definitely · would probably · might · could — không phải câu nào cũng “would”.",
          "🔊 **would've /wʊdəv/ · could've /kʊdəv/ · should've /ʃʊdəv/**: “have” yếu đi thành /əv/ và dính vào từ trước.",
          "Đẩy **GRA** (câu phức đúng thì) và **FC** (trả lời dài, có tổ chức) từ band 5 lên band 6.",
        ],
      },

      { t: "h", text: "1. Câu hỏi giả định trong Part 3 trông thế nào?" },
      { t: "p", text: "**Câu hỏi giả định** (hypothetical question) hỏi về một tình huống **không có thật**: giám khảo không hỏi điều đang xảy ra, mà hỏi bạn **tưởng tượng** rồi suy ra hệ quả. Dấu hiệu nhận ra: chữ **would** trong câu hỏi, và động từ sau if ở **quá khứ**. Có năm kiểu hay gặp." },
      {
        t: "table",
        head: ["Kiểu", "Câu hỏi mẫu", "Câu trả lời dùng", "Bắt đầu thế nào"],
        rows: [
          ["Hệ quả của một thay đổi", "What would happen if all cars **were banned** from city centres?", "loại 2: would / might + V", "If that happened, I think…"],
          ["Thế giới thiếu một thứ", "How would people's lives be different if there **were** no smartphones?", "loại 2", "Without smartphones, people would…"],
          ["Bạn có quyền quyết định", "If you **could change** one thing about your city, what would it be?", "loại 2: I'd…", "If I could change one thing, I'd…"],
          ["Quá khứ khác đi", "How would your life **have been** different if you **had grown up** in the countryside?", "loại 3: would have + V3", "If I'd grown up there, I would've…"],
          ["Đánh giá một ý tưởng", "Do you think it **would** be a good idea to make university free?", "loại 2: it would… / it might…", "I think it would…, but…"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba cách trả lời hỏng (band 5)",
        items: [
          "**Đổi về thì hiện tại / tương lai**: hỏi “What would happen if cars were banned?” mà đáp “The air **is** clean and people **will** happy.” Giám khảo hiểu ý, nhưng ghi nhận bạn **không dùng được câu điều kiện loại 2** ⇒ GRA kẹt ở 5.",
          "**Né câu hỏi**: “I don't think it will happen.” rồi dừng. Câu hỏi giả định KHÔNG hỏi nó có xảy ra không — nó mời bạn tưởng tượng. Cứ tưởng tượng trước, cuối câu mới nói “thực tế thì khó”.",
          "**Chỉ một hệ quả, một câu**: “People would be healthier. That's all.” Part 3 cần 5–7 câu: hệ quả → vì sao → hệ quả nữa hoặc mặt trái → chốt.",
        ],
      },
      { t: "rule", formula: "Câu hỏi có would + if + V-ed ⇒ trả lời bằng would / might / could + V · câu hỏi có would have ⇒ trả lời bằng would have + V3", vi: "Soi thì của câu hỏi và giữ đúng thì đó: giám khảo hỏi bằng loại nào, bạn đáp bằng loại ấy." },

      { t: "h", text: "2. Khung trả lời 4 bước" },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung 4 bước cho câu hỏi giả định (35–45 giây)",
        steps: [
          { label: "① Đánh dấu giả định", sub: "mua 2 giây + báo “tôi đang tưởng tượng”: Well, if that happened, I think…" },
          { label: "② Hệ quả chính + vì sao", sub: "the biggest change **would** be…, because…" },
          { label: "③ Hệ quả thứ hai hoặc mặt trái", sub: "đổi mức chắc chắn: it **might** also… / on the other hand, some people **could**…" },
          { label: "④ Kéo về thực tế", sub: "So realistically, … / That's why I think… (được dùng thì hiện tại ở bước này)" },
        ],
        caption: "Bước ④ quay về hiện tại thật nên dùng thì hiện tại là ĐÚNG — đó không phải lỗi trộn thì.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "① Well, if that happened, I think + S + would + V",
            vi: "Mở: nhắc lại điều kiện bằng “that” để không phải lặp cả câu hỏi",
            examples: [
              { en: "That's an interesting scenario. Well, if that happened, I think city centres would look completely different.", vi: "Đó là một tình huống thú vị. Nếu điều đó xảy ra, tôi nghĩ trung tâm thành phố sẽ khác hẳn." },
              { en: "It's hard to imagine, but I suppose people would adapt quite quickly.", vi: "Khó mà tưởng tượng, nhưng tôi cho rằng mọi người sẽ thích nghi khá nhanh." },
            ],
          },
          {
            formula: "② The biggest change would be + N / that + S + would + V, because …",
            vi: "Hệ quả chính + lý do (lý do nói về thực tế nên dùng hiện tại)",
            examples: [
              { en: "The most obvious change would be cleaner air, because traffic is the main source of pollution in most cities.", vi: "Thay đổi rõ nhất sẽ là không khí sạch hơn, vì giao thông là nguồn ô nhiễm chính ở hầu hết thành phố." },
            ],
          },
          {
            formula: "…, which would mean (that) + S + would / could + V",
            vi: "Chuỗi hệ quả: việc A kéo theo việc B",
            examples: [
              { en: "The streets would be quieter and safer, which would mean more people could walk or cycle to work.", vi: "Đường phố sẽ yên tĩnh và an toàn hơn, nghĩa là nhiều người có thể đi bộ hoặc đạp xe đi làm hơn." },
            ],
          },
          {
            formula: "③ On the other hand, + S + might / could + V",
            vi: "Mặt trái — hạ mức chắc chắn xuống might / could",
            examples: [
              { en: "On the other hand, it might cause problems for shop owners, who could lose customers.", vi: "Mặt khác, điều đó có thể gây khó cho chủ cửa hàng, những người có thể mất khách." },
            ],
          },
          {
            formula: "④ So realistically, I don't think + S + would + V + unless + S + V-ed",
            vi: "Chốt: kéo về thực tế, có thể thêm điều kiện",
            examples: [
              { en: "So realistically, I don't think a complete ban would work unless the city had a really good metro system first.", vi: "Nên thực tế mà nói, tôi không nghĩ cấm hoàn toàn sẽ hiệu quả trừ khi thành phố có hệ thống metro thật tốt trước đã." },
            ],
          },
        ],
      },
      { t: "rule", formula: "If that happened, S + would + V, because … → …, which would mean … → On the other hand, S + might + V → So realistically, …", vi: "Bốn mảnh ghép thành một câu trả lời Part 3 giả định dài 5–7 câu." },

      { t: "h", text: "3. Mức chắc chắn — không phải câu nào cũng “would”" },
      { t: "p", text: "Người band 5 nói “would” cho mọi hệ quả. Người band 6 biết việc nào **gần như chắc chắn**, việc nào **chỉ có thể**. Đổi được mức chắc chắn là dấu hiệu của tiêu chí LR và GRA band 6 — và làm câu trả lời nghe **thận trọng, chín chắn** hơn." },
      {
        t: "table",
        head: ["Mức", "Cách nói", "Ví dụ"],
        rows: [
          ["Gần như chắc chắn (≈ 95 %)", "would **definitely / certainly** + V", "Prices **would definitely** go up."],
          ["Nhiều khả năng (≈ 75 %)", "would **probably** + V · would be **likely to** + V", "Most people **would probably** complain at first."],
          ["Có thể (≈ 50 %)", "**might** / **could** + V · might **well** + V (nghiêng về có)", "Some small shops **might** close."],
          ["Khó (≈ 25 %)", "**probably wouldn't** + V · **I doubt (that)** … would + V", "**I doubt** older people **would** change their habits."],
          ["Gần như không (≈ 5 %)", "**definitely wouldn't** + V · there's **no way** … would", "Tourists **definitely wouldn't** stop coming."],
        ],
        caption: "Vị trí trạng từ: would + probably + V; nhưng probably + wouldn't + V (trạng từ đứng TRƯỚC wouldn't).",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai",
        items: [
          "~~It would probably to increase.~~ ⇒ It would probably **increase**.",
          "~~People wouldn't probably agree.~~ ⇒ People **probably wouldn't** agree.",
          "~~Maybe it would can help.~~ ⇒ It **might** help. / It **could** help. (không ghép hai modal)",
          "Lạm dụng “maybe” đầu câu: Maybe… Maybe… Maybe… ⇒ thay bằng might / could / probably ở giữa câu.",
        ],
      },

      { t: "h", text: "4. Bí hệ quả? Hỏi “ai bị ảnh hưởng” và “lúc nào”" },
      { t: "p", text: "Tập 3 Ngày 6 đã dạy **bảng góc nhìn** (kinh tế · xã hội · tâm lý) và **bảng trục chia nhóm** (tuổi · thu nhập · vùng) để tìm lý do. Với câu hỏi giả định, dùng lại hai bảng đó dưới dạng hai câu hỏi nhanh: **Ai bị ảnh hưởng?** và **Trước mắt hay lâu dài?** Mỗi ô là một hệ quả có sẵn." },
      {
        t: "table",
        head: ["Câu hỏi: “What would happen if university education were free?”", "Trước mắt", "Lâu dài"],
        rows: [
          ["**Cá nhân** (sinh viên, gia đình)", "more young people **would apply**; poor families **wouldn't have to** borrow money", "graduates **would start** their careers without debt"],
          ["**Tổ chức** (trường, doanh nghiệp)", "universities **would be** overcrowded", "companies **could** choose from a better-educated workforce"],
          ["**Xã hội / nhà nước**", "the government **would have to** raise taxes", "the gap between rich and poor **might** narrow"],
        ],
        caption: "Chọn 2 ô trái chiều (một lợi, một hại) là đủ cho bước ② và ③.",
      },
      {
        t: "quiz",
        id: "t3d15-noi-khung-dich",
        title: "Dịch Việt → Anh — dùng khung câu (5 câu)",
        kind: "translate",
        grammar: "If that happened, S + would + V · which would mean · might / could · would probably",
        items: [
          { q: "Nếu điều đó xảy ra, tôi nghĩ nhiều người sẽ mất việc.", answers: ["If that happened, I think many people would lose their jobs.", "If that happened, I think a lot of people would lose their jobs.", "If that happened, I think lots of people would lose their jobs."], hint: "If that happened · would lose their jobs" },
          { q: "Thay đổi lớn nhất sẽ là cách chúng ta giao tiếp.", answers: ["The biggest change would be the way we communicate.", "The biggest change would be how we communicate.", "The biggest change would be in the way we communicate."], hint: "The biggest change would be + the way we…" },
          { q: "Giá vé sẽ rẻ hơn, nghĩa là nhiều gia đình hơn có thể đi du lịch.", answers: ["Tickets would be cheaper, which would mean more families could travel.", "Tickets would be cheaper, which would mean that more families could travel.", "Ticket prices would be lower, which would mean more families could travel.", "Fares would be cheaper, which would mean more families could travel."], hint: "…, which would mean (that) … could travel" },
          { q: "Mặt khác, một số người lớn tuổi có thể cảm thấy bị bỏ lại phía sau.", answers: ["On the other hand, some older people might feel left behind.", "On the other hand, some elderly people might feel left behind.", "On the other hand, some older people could feel left behind.", "On the other hand, some old people might feel left behind."], hint: "On the other hand · might feel left behind" },
          { q: "Hầu hết mọi người có lẽ sẽ không để ý đâu.", answers: ["Most people probably wouldn't notice.", "Most people probably would not notice.", "Most people would probably not notice."], hint: "probably wouldn't + V" },
        ],
      },

      { t: "h", text: "5. Band 5 và band 6: cùng một câu hỏi" },
      {
        t: "dialogue",
        title: "Câu trả lời band 5 (ước tính) — khoảng 18 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "What would happen if all cars were banned from city centres?", vi: "Chuyện gì sẽ xảy ra nếu mọi ô tô bị cấm vào trung tâm thành phố?" },
          { who: "Candidate", role: "candidate", text: "I think it is good. If cars are banned, the air is more clean and people is more healthy. But people cannot go to work, so they will angry. Maybe the government should ban some cars only. Yes, that's all.", vi: "Tôi nghĩ điều đó tốt. Nếu ô tô bị cấm, không khí sạch hơn và mọi người khoẻ hơn. Nhưng người ta không thể đi làm, nên họ sẽ tức giận. Có lẽ chính phủ chỉ nên cấm một số xe. Vâng, hết ạ." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — khoảng 40 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "What would happen if all cars were banned from city centres?", vi: "Chuyện gì sẽ xảy ra nếu mọi ô tô bị cấm vào trung tâm thành phố?" },
          { who: "Candidate", role: "candidate", text: "Hmm, that's an interesting scenario. Well, if that happened, I think the most obvious change would be cleaner air, because traffic is the main source of pollution in most cities.", vi: "Ừm, đó là một tình huống thú vị. Nếu điều đó xảy ra, tôi nghĩ thay đổi rõ nhất sẽ là không khí sạch hơn, vì giao thông là nguồn ô nhiễm chính ở hầu hết thành phố." },
          { who: "Candidate", role: "candidate", text: "The streets would also be much quieter and safer, which would mean more people would probably walk or cycle.", vi: "Đường phố cũng sẽ yên tĩnh và an toàn hơn nhiều, nghĩa là có lẽ sẽ có nhiều người đi bộ hoặc đạp xe hơn." },
          { who: "Candidate", role: "candidate", text: "On the other hand, it might cause problems for some groups. Shop owners, for example, could lose customers if people couldn't park nearby, and elderly people would find it harder to get around.", vi: "Mặt khác, điều đó có thể gây khó cho một số nhóm. Chủ cửa hàng chẳng hạn, có thể mất khách nếu người ta không đỗ xe gần đó được, và người già sẽ đi lại khó khăn hơn." },
          { who: "Candidate", role: "candidate", text: "So realistically, I don't think a complete ban would work unless the city had a really good bus or metro system first.", vi: "Nên thực tế mà nói, tôi không nghĩ cấm hoàn toàn sẽ hiệu quả trừ khi thành phố có hệ thống xe buýt hoặc metro thật tốt trước đã." },
        ],
      },
      {
        t: "table",
        caption: "So theo 4 tiêu chí Speaking: FC (Fluency & Coherence) · LR (Lexical Resource) · GRA (Grammar) · P (Pronunciation).",
        head: ["Tiêu chí", "Band 5", "Band 6", "Bạn làm gì để chuyển"],
        rows: [
          ["**FC**", "5 câu ngắn rời nhau, hết ý sau 18 giây, kết bằng “that's all”", "4 bước rõ: mở → hệ quả → mặt trái → chốt; có từ dẫn (Well, On the other hand, So realistically)", "Thuộc khung 4 bước; mỗi bước một câu dẫn"],
          ["**LR**", "good, clean, healthy, angry — từ chung chung", "the most obvious change, the main source of pollution, get around, a complete ban", "Học cụm theo chủ đề; đổi “good” thành hệ quả cụ thể"],
          ["**GRA**", "Toàn hiện tại đơn + will; lỗi is more clean, people is, will angry; không có loại 2", "Loại 2 đúng suốt bài (were banned → would be, could lose, couldn't park), mệnh đề which, unless + quá khứ", "Soi thì câu hỏi; luyện would / might / could + V tới khi bật ra tự động"],
          ["**P**", "Đọc rời từng từ, không nối, ngữ điệu phẳng", "Nối would‿also, would‿mean; nhấn từ mang nghĩa (CLEANer AIR, QUIeter)", "Luyện khối nối âm ở mục 8"],
        ],
      },
      {
        t: "note",
        title: "💡 Sửa câu band 5 thành band 6 trong ba bước",
        items: [
          "**Bước 1 — đổi thì**: the air **is** more clean ⇒ the air **would be** cleaner.",
          "**Bước 2 — thêm vì sao**: … cleaner, **because traffic is the main source of pollution**.",
          "**Bước 3 — đổi mức chắc chắn cho mặt trái**: they **will** angry ⇒ some people **might** be angry at first.",
        ],
      },

      { t: "h", text: "6. Giả định về quá khứ: would have" },
      { t: "p", text: "Khi giám khảo hỏi về một **quá khứ khác đi** (“How would your life have been different if…?”, “What would have happened if… had not been invented?”), bạn dùng **loại 3**. Câu trả lời thường ngắn hơn (3–5 câu) và hay kết bằng một câu **quay về hiện tại** — có thể là câu trộn (… so I **wouldn't be** here today)." },
      {
        t: "dialogue",
        title: "Band 6 (ước tính) — giả định về quá khứ",
        lines: [
          { who: "Examiner", role: "examiner", text: "How would your life have been different if you had grown up without the Internet?", vi: "Cuộc sống của bạn sẽ khác thế nào nếu bạn lớn lên mà không có Internet?" },
          { who: "Candidate", role: "candidate", text: "Oh, very different, I think. If I'd grown up without the Internet, I would've spent a lot more time outdoors, playing with the kids in my neighbourhood.", vi: "Ồ, rất khác, tôi nghĩ vậy. Nếu tôi lớn lên không có Internet, tôi hẳn đã dành nhiều thời gian ở ngoài trời hơn, chơi với lũ trẻ trong xóm." },
          { who: "Candidate", role: "candidate", text: "I probably would've read more books as well, because there wouldn't have been any videos to distract me.", vi: "Có lẽ tôi cũng đã đọc nhiều sách hơn, vì đã chẳng có video nào làm tôi xao nhãng." },
          { who: "Candidate", role: "candidate", text: "But I wouldn't have learned English so easily. Most of my English came from watching videos online, so without the Internet I might not have chosen to study IT at all.", vi: "Nhưng tôi đã không học tiếng Anh dễ như vậy. Phần lớn tiếng Anh của tôi đến từ việc xem video trên mạng, nên không có Internet thì có lẽ tôi đã chẳng chọn học công nghệ thông tin." },
        ],
      },
      {
        t: "table",
        head: ["Việc cần nói", "Loại 2 (hiện tại)", "Loại 3 (quá khứ)"],
        rows: [
          ["Mở", "If that happened, …", "If that had happened, … / If I'd grown up there, …"],
          ["Hệ quả chính", "people **would spend** more time…", "I **would've spent** more time…"],
          ["Có lẽ", "they **might / could** + V", "I **might have / could have** + V3"],
          ["Phủ định", "it **wouldn't** work", "I **wouldn't have** learned…"],
          ["Không có …", "**Without** X, we **would** + V", "**Without** X, I **wouldn't have** + V3"],
          ["Ước", "I wish we **had**…", "I wish I **had started** earlier."],
        ],
      },
      {
        t: "mcq",
        id: "t3d15-noi-chon",
        title: "Chọn câu trả lời / câu nối tốt nhất (6 câu)",
        items: [
          { q: "Examiner: “What would happen if people stopped using cash completely?” — Câu mở nào đúng thì?", options: ["I think shopping will be faster and people are happy.", "I think shopping would be faster, and people wouldn't have to carry wallets.", "I think shopping would have been faster.", "I think shopping is faster when people stopped using cash."], correct: 1, why: "Câu hỏi loại 2 (would happen if … stopped) ⇒ đáp bằng would + V. Đáp án C là loại 3 (quá khứ), A và D dùng hiện tại / will." },
          { q: "Bạn muốn thêm một MẶT TRÁI không chắc chắn lắm. Chọn câu:", options: ["On the other hand, some elderly people might struggle with the technology.", "On the other hand, all elderly people would definitely die.", "On the other hand, elderly people struggle.", "On the other hand, elderly people will can't use it."], correct: 0, why: "might + V hạ mức chắc chắn, đúng thì giả định. B quá cực đoan; C là hiện tại; D ghép hai modal." },
          { q: "Examiner: “How would your childhood have been different if you had had no brothers or sisters?” — Câu nào đúng?", options: ["It would be lonelier, I think.", "It will be lonelier, I think.", "It would have been lonelier, I think.", "It had been lonelier, I think."], correct: 2, why: "Câu hỏi loại 3 (would … have been … if you had had) ⇒ would have been." },
          { q: "Câu chốt (bước ④) nào tự nhiên nhất?", options: ["So that's all.", "So if cars would be banned it is good.", "So I don't know.", "So realistically, I think a partial ban would be more sensible."], correct: 3, why: "Kéo về thực tế + nêu quan điểm có mức độ; đúng thì loại 2." },
          { q: "Vị trí trạng từ ĐÚNG:", options: ["People wouldn't probably accept it.", "People probably wouldn't accept it.", "People would accept probably not it.", "Probably people wouldn't to accept it."], correct: 1, why: "probably đứng TRƯỚC wouldn't; sau would thì would probably + V." },
          { q: "Giám khảo hỏi: “If you could change one thing about your city, what would it be?” Bạn mở:", options: ["I change the traffic.", "I will change the traffic because it was terrible.", "I would have changed the traffic.", "If I could change one thing, I'd improve the public transport system."], correct: 3, why: "Lặp lại khung câu hỏi (If I could…, I'd…) — đúng loại 2 và mua được vài giây suy nghĩ." },
        ],
      },

      { t: "h", text: "7. Bảng cụm theo chức năng — chép vào Sổ Speaking" },
      {
        t: "table",
        head: ["Chức năng", "Cụm dùng được", "Ghi chú"],
        rows: [
          ["Mua thời gian + đánh dấu giả định", "That's an interesting scenario. · It's hard to imagine, but… · I've never really thought about that, but I suppose… · Well, if that happened, …", "Chỉ dùng MỘT cụm mỗi câu trả lời; đừng mở mọi câu bằng cùng một cụm"],
          ["Hệ quả chính", "The first thing that would happen is (that)… · The biggest / most obvious change would be… · It would probably lead to…", "lead to + danh từ / V-ing"],
          ["Chuỗi hệ quả", "…, which would mean (that)… · As a result, people would… · In the long run, it would…", "which thay cho cả mệnh đề trước"],
          ["Mặt trái / nhóm khác", "On the other hand, … · At the same time, … · The downside is that… might…", "Hạ xuống might / could"],
          ["Viễn cảnh thiếu vắng", "Without …, we would(n't)… · If it weren't for …, … · Imagine a city with no …: people would…", "Bài Ngữ pháp mục 6"],
          ["Kéo về thực tế", "So realistically, … · In reality, though, … · That said, I don't think it's likely to happen, because…", "Bước này dùng thì hiện tại được"],
          ["Ước / nuối tiếc", "I wish the government would… · If only we had… · It's high time we…", "Dùng khi câu hỏi đụng tới vấn đề bạn thật sự bức xúc"],
        ],
      },

      { t: "h", text: "8. Phát âm: would've / could've / should've — “have” biến thành /əv/" },
      { t: "p", text: "Trong câu loại 3, chữ **have** không mang nghĩa chính nên người bản ngữ đọc **yếu**: /hæv/ rút thành **/əv/** và **dính vào từ trước** thành một khối. Âm /d/ cuối của would nối thẳng sang /ə/: **would've** nghe như “wu-đờv”. Nói thật nhanh còn rụng cả /v/ trước phụ âm: would've been ⇒ /wʊdə bɪn/ (“woulda been”) — bạn chỉ cần **nghe ra**, không cần nói theo. Vì nghe giống “of” nên nhiều người viết sai thành ~~would of~~." },
      {
        t: "table",
        head: ["Viết", "Đọc rời (chậm, nhấn mạnh)", "Đọc nối (tự nhiên)", "Nghe giống"],
        rows: [
          ["would have / would've", "/wʊd hæv/", "/wʊdəv/", "“wu-đờv”"],
          ["could have / could've", "/kʊd hæv/", "/kʊdəv/", "“ku-đờv”"],
          ["should have / should've", "/ʃʊd hæv/", "/ʃʊdəv/", "“su-đờv” (âm đầu là /ʃ/)"],
          ["might have / might've", "/maɪt hæv/", "/maɪtəv/", "“mai-tờv”"],
          ["wouldn't have", "/wʊdnt hæv/", "/wʊdnt əv/", "“wu-đừn-tờv”"],
          ["I'd have / I would've", "/aɪd hæv/", "/aɪdəv/", "“ai-đờv”"],
        ],
        caption: "Chữ L trong would / could / should là chữ câm: không đọc /wʊld/.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai",
        items: [
          "Đọc rõ “have” /hæv/ ở mọi chỗ ⇒ câu nặng nề, mất nhịp. Chỉ đọc rõ khi have là **động từ chính** (I would **have** a car = tôi sẽ CÓ xe).",
          "Bỏ hẳn âm /d/ cuối của would ⇒ thành “wu ờv”. Giữ /d/ và dùng nó để nối: wʊ-**d**əv.",
          "Đọc chữ L: ~~/wʊld/~~, ~~/kʊld/~~ ⇒ /wʊd/, /kʊd/.",
          "Nghe “I'd've gone” mà tưởng thiếu chữ: đó là I would have gone — hai chữ viết tắt liền nhau.",
        ],
      },
      {
        t: "phatam",
        id: "t3d15-phat-am",
        title: "Luyện phát âm — would've / could've / should've nối âm",
        note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Dòng 1–4: đọc dạng rời rồi dạng nối để thấy khác nhau. Dòng 5–10: câu dùng được trong Part 3 — đọc would've thành MỘT khối, không ngắt trước have.",
        items: [
          { text: "would have, would've", ipa: "wʊd hæv wʊdəv", vi: "rời → nối" },
          { text: "could have, could've", ipa: "kʊd hæv kʊdəv", vi: "rời → nối" },
          { text: "should have, should've", ipa: "ʃʊd hæv ʃʊdəv", vi: "rời → nối" },
          { text: "might have, might've", ipa: "maɪt hæv maɪtəv", vi: "rời → nối" },
          { text: "I would've gone.", ipa: "aɪ wʊdəv ɡɒn", vi: "Tôi hẳn đã đi." },
          { text: "She could've helped.", ipa: "ʃi kʊdəv helpt", vi: "Cô ấy lẽ ra đã có thể giúp." },
          { text: "We should've left earlier.", ipa: "wi ʃʊdəv left ɜːliə", vi: "Lẽ ra chúng ta nên đi sớm hơn." },
          { text: "It wouldn't have worked.", ipa: "ɪt wʊdnt əv wɜːkt", vi: "Việc đó hẳn đã không thành." },
          { text: "If I'd known, I would've told you.", ipa: "ɪf aɪd nəʊn aɪ wʊdəv təʊld ju", vi: "Nếu tôi biết thì tôi đã nói với bạn." },
          { text: "Life would've been very different.", ipa: "laɪf wʊdəv bɪn veri dɪfrənt", vi: "Cuộc sống hẳn đã rất khác." },
        ],
      },
      {
        t: "mcq",
        id: "t3d15-noi-am",
        title: "Nghe ra chữ gì? (5 câu)",
        items: [
          { q: "Bạn nghe /aɪ ʃʊdəv kɔːld/. Người nói đã nói:", options: ["I should of called.", "I should call.", "I should've called.", "I shut a cold."], correct: 2, why: "/ʃʊdəv/ = should've = should have. “should of” là cách viết SAI của chính âm này." },
          { q: "Trong “If I'd known, I'd have come”, hai chữ 'd lần lượt là:", options: ["had — would", "would — had", "had — had", "would — would"], correct: 0, why: "Sau 'd thứ nhất là V3 (known) ⇒ had; sau 'd thứ hai là have ⇒ would." },
          { q: "Câu nào chữ “have” phải đọc RÕ /hæv/?", options: ["I would've stayed.", "They could've won.", "She might've forgotten.", "If I were rich, I would have a big garden."], correct: 3, why: "Ở câu D, have là động từ chính (“có”) của loại 2 ⇒ đọc rõ. Ba câu kia have là trợ động từ ⇒ /əv/." },
          { q: "Cách đọc đúng của “could”:", options: ["/kʊld/", "/kʊd/", "/kəʊld/", "/kuːld/"], correct: 1, why: "Chữ L câm: could /kʊd/, would /wʊd/, should /ʃʊd/." },
          { q: "Bạn nghe “It woulda been cheaper”. Viết đúng là:", options: ["It would a been cheaper.", "It would of been cheaper.", "It would be cheaper.", "It would have been cheaper."], correct: 3, why: "“woulda” là would have nói rất nhanh (rụng /v/ trước phụ âm). Khi viết luôn viết would have / would've." },
        ],
      },

      { t: "h", text: "9. Luyện nói Part 3 — ghi âm, AI chấm" },
      { t: "p", text: "Mỗi câu nói **35–45 giây** theo khung 4 bước. Trước khi bấm ghi, nhìn câu hỏi 3 giây và tự hỏi: **loại 2 hay loại 3?** Nghe lại bản ghi: đếm số lần bạn nói **would / might / could** — dưới 3 lần là bạn đã trượt về thì hiện tại." },
      {
        t: "speak", id: "t3d15-noi-p3-hien-tai", part: "3",
        questions: [
          "What would happen if all cars were banned from city centres?",
          "How would people's lives be different if there were no smartphones?",
          "If you could change one thing about the education system in your country, what would it be?",
          "What would happen if everyone worked from home?",
          "Do you think it would be a good idea to make public transport free?",
        ],
      },
      {
        t: "speak", id: "t3d15-noi-p3-qua-khu", part: "3",
        questions: [
          "How would your life have been different if you had grown up without the Internet?",
          "What would have happened if the aeroplane had never been invented?",
          "If you had chosen a different subject to study, what do you think you would be doing now?",
          "Is there anything you wish you had learned when you were younger?",
        ],
      },
      {
        t: "note",
        title: "📌 Sau Ngày 15: làm Đề 4 (giữa tập)",
        items: [
          "Bạn đã đi được nửa Tập 3. Mở **Online Test → Đề 4** (mức band 5.5, đủ 4 kỹ năng) và làm một mạch, đúng giờ, không tra từ.",
          "Mục tiêu giữa tập: Listening và Reading mỗi kỹ năng **19–22/40**; Writing và Speaking **5.5**. Đây là điểm ước tính để bạn biết mình đang ở đâu, không phải điểm thi thật.",
          "Sau khi có kết quả, xem mục “dạng câu sai nhiều” — trang kết quả trỏ thẳng về bài cần ôn (ví dụ sai Table completion ⇒ bài Đọc hôm nay).",
          "Trong phần Speaking của đề, cố dùng ít nhất **hai câu giả định** (một loại 2, một wish hoặc loại 3).",
        ],
      },
    ],
  },

  /* ═══════════════════════ BÀI TẬP ═══════════════════════ */
  {
    id: "t3d15-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 15 — điều kiện loại 2 & 3 · wish · would rather · Table completion · câu hỏi giả định",
    goal: "Tự kiểm cả ngày bằng 40 câu có đáp án và một lượt nói Part 3; đúng từ 28 câu trở lên là đạt — rồi làm Đề 4 ở Online Test.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Cách làm",
        items: [
          "Làm một mạch, không mở lại bài học. Xong mới xem đáp án và lời giải.",
          "Phần I–IV (29 câu) kiểm ngữ pháp; Phần V (6 câu) kiểm Table completion + Short-answer; Phần VI (5 câu) kiểm khung nói và phát âm.",
          "**Đúng ≥ 28/40** là đạt. Sai từ 3 câu trở lên ở một phần ⇒ mở lại mục tương ứng (ghi ở cuối mỗi phần).",
          "Phần VII là bài nói ghi âm — AI chấm theo 4 tiêu chí; cố giữ đúng thì giả định suốt câu trả lời.",
        ],
      },

      { t: "h", text: "Phần I — Chọn đáp án đúng (10 câu)" },
      {
        t: "mcq",
        id: "t3d15-bt-chon",
        title: "Loại 1 · 2 · 3 · wish · would rather",
        items: [
          { q: "If the government ______ fuel taxes, fewer people would drive.", options: ["raises", "raised", "would raise", "had raised"], correct: 1, why: "Vế chính would drive ⇒ loại 2 ⇒ If + quá khứ đơn." },
          { q: "If she ______ the earlier flight, she would have arrived before the storm.", options: ["took", "would take", "has taken", "had taken"], correct: 3, why: "would have arrived ⇒ loại 3 ⇒ If + had V3." },
          { q: "If you heat ice, it ______.", options: ["melts", "would melt", "melted", "would have melted"], correct: 0, why: "Quy luật tự nhiên ⇒ loại 0: hiện tại đơn ở cả hai vế (ôn Tập 2 Ngày 13)." },
          { q: "I wish I ______ more confident when I speak English.", options: ["am", "would be", "were", "will be"], correct: 2, why: "Ước trái hiện tại ⇒ wish + were. Không dùng would cho chính mình." },
          { q: "I'd rather ______ at home tonight. I'm exhausted.", options: ["to stay", "stay", "staying", "stayed"], correct: 1, why: "would rather + V nguyên mẫu không to (cùng chủ ngữ)." },
          { q: "If the company had not cut its prices, it ______ so many customers.", options: ["would not gain", "did not gain", "will not gain", "would not have gained"], correct: 3, why: "If + had not V3 ⇒ loại 3 ⇒ would not have V3." },
          { q: "______ the support of my teachers, I would never have got into university.", options: ["Without", "Unless", "If only", "Suppose"], correct: 0, why: "Without + danh từ, would have V3 = If it hadn't been for…" },
          { q: "It's high time the city ______ something about air pollution.", options: ["does", "will do", "did", "has done"], correct: 2, why: "It's high time + S + quá khứ đơn." },
          { q: "I've applied for three jobs. If I ______ an interview, I'll let you know.", options: ["got", "get", "would get", "had got"], correct: 1, why: "Đã nộp đơn ⇒ khả năng có thật ⇒ loại 1: If + hiện tại đơn, will." },
          { q: "My flatmate never washes up. I wish he ______ his dishes.", options: ["washes", "has washed", "will wash", "would wash"], correct: 3, why: "Phàn nàn, muốn NGƯỜI KHÁC thay đổi ⇒ wish + would V." },
        ],
      },
      { t: "p", text: "Sai từ 3 câu ⇒ xem lại bài Ngữ pháp mục 1–5 (bảng bốn loại ở mục 1 là chỗ bắt đầu)." },

      { t: "h", text: "Phần II — Viết dạng đúng của động từ (8 câu)" },
      {
        t: "quiz",
        id: "t3d15-bt-dang",
        title: "Viết dạng đúng của động từ trong ngoặc",
        kind: "fill",
        items: [
          { q: "If I ______ (not / have) to work on Saturdays, I would join a football club.", answers: ["didn't have", "did not have"], hint: "would join ⇒ loại 2" },
          { q: "If the bridge had been wider, the traffic jam ______ (not / be) so bad last night.", answers: ["would not have been", "wouldn't have been", "might not have been"], hint: "last night ⇒ loại 3" },
          { q: "Many shops ______ (close) if online sales continued to grow at this speed.", answers: ["would close", "might close", "could close"], hint: "continued ⇒ loại 2" },
          { q: "If we ______ (book) the tickets last week, they would have been half the price.", answers: ["had booked", "'d booked"], hint: "would have been ⇒ loại 3" },
          { q: "If I ______ (be) you, I would talk to your manager first.", answers: ["were", "was"], hint: "If I were you (were chuẩn hơn; was chỉ gặp trong văn nói thân mật)" },
          { q: "The team ______ (win) the final if their best player hadn't been injured.", answers: ["would have won", "could have won", "might have won", "would've won", "could've won", "might've won"], hint: "hadn't been ⇒ loại 3" },
          { q: "What would you do if someone ______ (offer) you a job abroad?", answers: ["offered"], hint: "would you do ⇒ loại 2" },
          { q: "If the film ______ (not / be) so long, I would have enjoyed it more.", answers: ["hadn't been", "had not been"], hint: "would have enjoyed ⇒ loại 3" },
        ],
      },

      { t: "h", text: "Phần III — wish · if only · would rather · it's time (6 câu)" },
      {
        t: "quiz",
        id: "t3d15-bt-wish",
        title: "Viết dạng đúng của động từ trong ngoặc",
        kind: "fill",
        items: [
          { q: "I live in a tiny flat. I wish I ______ (have) a garden.", answers: ["had"], hint: "ước trái hiện tại" },
          { q: "I failed the test. If only I ______ (revise) the night before.", answers: ["had revised", "'d revised"], hint: "nuối tiếc quá khứ" },
          { q: "The bus is late again. I wish it ______ (come) on time for once.", answers: ["would come"], hint: "muốn vật khác thay đổi" },
          { q: "I'd rather you ______ (not / tell) my parents about this.", answers: ["didn't tell", "did not tell"], hint: "would rather + S khác + V-ed" },
          { q: "It's about time you ______ (start) saving money.", answers: ["started"], hint: "it's about time + S + V-ed" },
          { q: "She wishes she ______ (can) speak French as well as her sister.", answers: ["could"], hint: "wish + could" },
        ],
      },
      { t: "p", text: "Sai từ 2 câu ở Phần III ⇒ xem lại bài Ngữ pháp mục 4 (bảng ba kiểu ước) và mục 5." },

      { t: "h", text: "Phần IV — Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t3d15-bt-dich",
        title: "Dịch sang tiếng Anh",
        kind: "translate",
        grammar: "Loại 2 · loại 3 · wish · without · would rather",
        items: [
          { q: "Nếu vé tàu rẻ hơn, nhiều người sẽ không đi máy bay nữa.", answers: ["If train tickets were cheaper, many people would stop flying.", "If train tickets were cheaper, many people would no longer fly.", "If train tickets were cheaper, a lot of people would stop flying.", "If train tickets were cheaper, many people would not fly any more.", "If train tickets were cheaper, many people wouldn't fly anymore.", "If train tickets were cheaper, many people would stop travelling by plane."], hint: "were cheaper · would stop flying" },
          { q: "Nếu tôi không gặp cô giáo đó thì tôi đã không học ngành này.", answers: ["If I had not met that teacher, I would not have studied this subject.", "If I hadn't met that teacher, I wouldn't have studied this subject.", "If I hadn't met that teacher, I wouldn't have studied this major.", "If I had not met that teacher, I would not have chosen this subject.", "If I hadn't met that teacher, I wouldn't have chosen this major.", "If I hadn't met that teacher, I wouldn't have chosen this field.", "If I hadn't met that teacher, I wouldn't have studied this field.", "If I hadn't met that teacher, I wouldn't have chosen this course."], hint: "hadn't met · wouldn't have studied / chosen" },
          { q: "Ước gì thành phố của tôi có nhiều cây xanh hơn.", answers: ["I wish my city had more trees.", "I wish there were more trees in my city.", "I wish my city had more green spaces."], hint: "wish + had / there were" },
          { q: "Nếu không có du lịch, nhiều người dân địa phương sẽ không có việc làm.", answers: ["Without tourism, many local people would not have jobs.", "Without tourism, many local people wouldn't have jobs.", "Without tourism, many local people would have no jobs.", "Without tourism, many locals would not have jobs.", "If there were no tourism, many local people would not have jobs.", "Without tourism, many local people would be unemployed."], hint: "Without tourism, … would not have jobs" },
          { q: "Tôi thà trả nhiều tiền hơn còn hơn sống xa trung tâm.", answers: ["I would rather pay more than live far from the centre.", "I'd rather pay more than live far from the centre.", "I would rather pay more money than live far from the centre.", "I'd rather pay more than live far from the city centre.", "I'd rather pay more than live far away from the centre."], hint: "would rather pay more than live…" },
        ],
      },

      { t: "h", text: "Phần V — Table completion + Short-answer: đoạn ngắn (6 câu)" },
      {
        t: "passage",
        title: "From Candle to LED",
        paras: [
          { label: "A", text: "Before the nineteenth century, most homes were lit after dark by candles. The cheapest were made of animal fat, which burned with a smoky flame and an unpleasant smell; cleaner candles made of beeswax were so expensive that only churches and rich households could afford them. Gas lighting changed city life. In 1807 a London street called Pall Mall became the first in the world to be lit by gas lamps, and within a few decades factories could stay open after sunset. Gas, however, had to be delivered through pipes, and leaks sometimes caused explosions." },
          { label: "B", text: "The electric light bulb, made practical by Thomas Edison in 1879, was safer and far more convenient. Its weakness was waste: around ninety per cent of the electricity it used was lost as heat rather than light. That problem was not solved until the 1990s, when engineers finally produced a blue light-emitting diode (LED), the missing piece needed to make white LED light. A modern LED lamp uses a fraction of the power and can last more than twenty times as long as a traditional bulb." },
        ],
      },
      { t: "p", text: "**Questions 1–4** — Complete the table. Write **ONE WORD AND/OR A NUMBER** from the passage. **Questions 5–6** — Answer the questions. Write **NO MORE THAN TWO WORDS** from the passage." },
      {
        t: "table",
        head: ["Type of light", "Key fact", "Problem"],
        rows: [
          ["Candle", "the cheapest kind was made from animal **1** ______", "smoke and a bad smell"],
          ["Gas lamp", "a street was first lit this way in **2** ______", "leaks could lead to **3** ______"],
          ["Electric bulb", "became practical in 1879", "most of the electricity turned into **4** ______"],
        ],
      },
      {
        t: "quiz",
        id: "t3d15-bt-doc",
        title: "Questions 1–6",
        kind: "fill",
        items: [
          { q: "1. Candle — the cheapest kind was made from animal ______", answers: ["fat"] },
          { q: "2. Gas lamp — a street was first lit this way in ______", answers: ["1807"] },
          { q: "3. Gas lamp — leaks could lead to ______", answers: ["explosions"] },
          { q: "4. Electric bulb — most of the electricity turned into ______", answers: ["heat"] },
          { q: "5. What were the more expensive candles made of?", answers: ["beeswax"] },
          { q: "6. Which colour of LED had to be developed before white LED light was possible?", answers: ["blue"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích Phần V",
        items: [
          "**1 fat** — A: “The cheapest were made of animal **fat**”. Ô đã có “animal” ⇒ chỉ điền fat.",
          "**2 1807** — A: “In **1807** a London street… became the first in the world to be lit by gas lamps”. Bẫy: 1879 là năm của bóng đèn điện.",
          "**3 explosions** — A: “leaks sometimes caused **explosions**”. caused → could lead to. Giữ số nhiều như bài.",
          "**4 heat** — B: “around ninety per cent of the electricity it used was lost as **heat** rather than light”. most ← ninety per cent; turned into ← was lost as. Bẫy: light đứng ngay cạnh nhưng sau “rather than”.",
          "**5 beeswax** — A: “cleaner candles made of **beeswax** were so expensive…”. Câu hỏi quay lại đầu bài — nhóm câu mới, thứ tự mới.",
          "**6 blue** — B: “a **blue** light-emitting diode (LED), the missing piece needed to make white LED light”. Bẫy: white là kết quả, không phải thứ phải phát minh trước.",
        ],
      },
      { t: "p", text: "Sai từ 2 câu ở Phần V ⇒ đọc lại bài Đọc mục 1 (6 bước + bảng đoán loại từ) và mục 2." },

      { t: "h", text: "Phần VI — Khung nói giả định và phát âm (5 câu)" },
      {
        t: "mcq",
        id: "t3d15-bt-noi",
        title: "Chọn đáp án tốt nhất",
        items: [
          { q: "Examiner: “What would happen if schools stopped giving homework?” — Câu nào giữ đúng thì?", options: ["Students are happier and they have more time.", "Students will be happier and have more time.", "Students would have more free time, but some might fall behind.", "Students would have had more free time."], correct: 2, why: "Câu hỏi loại 2 ⇒ would / might + V. D là loại 3 (quá khứ)." },
          { q: "Cụm nào dùng để nối sang CHUỖI hệ quả?", options: ["That's all.", "…, which would mean that…", "In my opinion,", "For example, yesterday"], correct: 1, why: "which would mean (that)… nối hệ quả A sang hệ quả B." },
          { q: "Mức chắc chắn THẤP nhất:", options: ["It would definitely happen.", "It would probably happen.", "It might well happen.", "I doubt it would happen."], correct: 3, why: "I doubt … would = tôi không tin là sẽ. might well nghiêng về có; probably ≈ 75 %." },
          { q: "/wʊdnt əv/ là cách đọc tự nhiên của:", options: ["wouldn't have", "would not of", "wouldn't a", "would have not"], correct: 0, why: "wouldn't have: have yếu thành /əv/. Không bao giờ viết “of”." },
          { q: "Bước ④ “kéo về thực tế” được dùng thì nào?", options: ["Bắt buộc would have V3", "Bắt buộc quá khứ đơn", "Thì hiện tại — vì đang nói về thực tế thật", "Không được nói bước này"], correct: 2, why: "So realistically, I don't think it's likely… — nói về thực tế nên dùng hiện tại là đúng, không phải lỗi trộn thì." },
        ],
      },

      { t: "h", text: "Phần VII — Nói Part 3 (ghi âm, AI chấm)" },
      { t: "p", text: "Chọn **hai** câu, mỗi câu nói 35–45 giây theo khung 4 bước: đánh dấu giả định → hệ quả chính + vì sao → hệ quả thứ hai / mặt trái (might / could) → kéo về thực tế. Nghe lại và tự đếm số lần dùng would / might / could." },
      {
        t: "speak", id: "t3d15-bt-noi-ghi-am", part: "3",
        questions: [
          "What would happen if universities stopped holding exams?",
          "How would cities change if most people stopped owning cars?",
          "If you could live in any period of history, which would you choose and why?",
          "What would have happened if mobile phones had never been invented?",
        ],
      },
      {
        t: "note",
        title: "📌 Việc tiếp theo",
        items: [
          "Chép 3 câu giả định hay nhất bạn vừa nói vào **Sổ Speaking** (Tập 3 Ngày 2) — sửa lỗi thì nếu có.",
          "Làm **Đề 4** ở Online Test trước khi sang Ngày 16.",
        ],
      },
    ],
  },
];
