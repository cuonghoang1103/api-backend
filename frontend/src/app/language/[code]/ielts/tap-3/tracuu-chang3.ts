/**
 * Mục TRA CÔNG THỨC của IELTS Tập 3 — chặng 3 (Ngày 13–18). Soạn cùng `ngay/ngay13..18.ts`.
 * `tracuu.ts` ghép mảng này vào `TRA_CONG_THUC_T3.blocks` — tệp tách riêng để các phiên soạn chặng khác không giẫm lên nhau.
 *
 * Mỗi mục: `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`, chép gọn từ bài ngày đó.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG3: Block[] = [
  // ───────── Ngày 13 ─────────
  { t: 'h', text: '(Ngày 13 · mục 2) Bị động ở mọi thì — chỉ chia BE' },
  {
    t: 'table',
    head: ['Thì', 'be chia thành', 'Ví dụ'],
    rows: [
      ['Hiện tại đơn', 'am / is / are + V3', 'Coffee is exported to 80 countries.'],
      ['Hiện tại tiếp diễn', 'am / is / are being + V3', 'A new bridge is being built.'],
      ['Quá khứ đơn', 'was / were + V3', 'The law was passed in 2019.'],
      ['Quá khứ tiếp diễn', 'was / were being + V3', 'The road was being repaired when I visited.'],
      ['Hiện tại hoàn thành', 'have / has been + V3', 'The park has been replaced by flats.'],
      ['Quá khứ hoàn thành', 'had been + V3', 'By 2010 the factory had been closed.'],
      ['Tương lai đơn', 'will be + V3', 'The results will be published in May.'],
      ['be going to', 'am / is / are going to be + V3', 'The stadium is going to be rebuilt.'],
    ],
  },
  { t: 'rule', formula: 'S + be (chia theo thì: is being / was being / has been / had been / will be) + V3', vi: 'Tiếp diễn thêm being, hoàn thành thêm been; V3 không đổi.' },

  { t: 'h', text: '(Ngày 13 · mục 3) Bị động với modal' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + modal + be + V3', vi: 'Hiện tại / tương lai: nên được, có thể được, phải được…', examples: [{ en: 'Stricter laws should be introduced to reduce plastic waste.', vi: 'Nên ban hành luật nghiêm hơn để giảm rác nhựa.' }] },
      { formula: 'S + modal + have been + V3', vi: 'Quá khứ: đáng lẽ đã (không) được…, có lẽ đã được…', examples: [{ en: 'The accident could have been avoided.', vi: 'Tai nạn ấy lẽ ra đã có thể tránh được.' }] },
      { formula: 'S + have to / need to + be + V3', vi: 'Cụm giống modal theo cùng khuôn.', examples: [{ en: 'More research needs to be done in this area.', vi: 'Cần nghiên cứu thêm trong lĩnh vực này.' }] },
    ],
  },
  { t: 'rule', formula: 'S + modal + be + V3 · S + modal + have been + V3 (quá khứ)', vi: 'should be done = nên được làm; should have been done = đáng lẽ đã phải được làm.' },

  { t: 'h', text: '(Ngày 13 · mục 4) to be + V3 · being + V3' },
  {
    t: 'table',
    head: ['Khuôn', 'Ví dụ'],
    rows: [
      ['V (want / expect / need / deserve) + to be + V3', 'The work is expected to be finished in May.'],
      ['giới từ / V (avoid / enjoy / risk) + being + V3', 'After being heated, the mixture is cooled. · Most people dislike being criticised.'],
    ],
  },
  { t: 'rule', formula: 'V + to be + V3 · giới từ / V + being + V3', vi: 'Chủ ngữ chịu hành động ⇒ to V thành to be V3, V-ing thành being V3.' },

  { t: 'h', text: '(Ngày 13 · mục 5) Động từ hai tân ngữ: give · offer · send · pay · show · teach · tell' },
  {
    t: 'table',
    head: ['Kiểu', 'Câu'],
    rows: [
      ['Người làm chủ ngữ (hay dùng)', 'The workers were given a bonus. · I was told to wait. · She was offered a job.'],
      ['Vật làm chủ ngữ', 'A bonus was given to the workers.'],
      ['explain · suggest · describe · say', 'The rules were explained to me. (không: I was explained the rules)'],
    ],
  },
  { t: 'rule', formula: 'Người + be + V3 (given / offered / paid / told / taught / shown / sent) + vật', vi: 'Ưu tiên lấy NGƯỜI làm chủ ngữ; vật làm chủ ngữ thì thêm to + người.' },

  { t: 'h', text: '(Ngày 13 · mục 6–7) by + agent · động từ không có bị động' },
  {
    t: 'table',
    head: ['Điểm', 'Quy tắc'],
    rows: [
      ['by + người làm', 'Chỉ giữ khi là thông tin mới / cần nhấn: was invented by Bell. Bỏ: by people / by them / by someone.'],
      ['with + dụng cụ', 'The window was broken with a hammer.'],
      ['Không có bị động', 'happen · occur · take place · rise · fall · exist · appear · disappear · die · arrive · consist of · belong to'],
      ['Cặp tự nó ↔ có người làm', 'rise (rose) ↔ raise (was raised) · die ↔ kill (were killed)'],
    ],
  },
  { t: 'rule', formula: 'Không có O ⇒ không có bị động: happen · occur · rise · fall · exist · die · consist of', vi: 'Số liệu tự tăng giảm: rose / fell. Có người làm tăng: raised / was raised.' },

  { t: 'h', text: '(Ngày 13 · mục 8) It is believed that… — thuật lại ý kiến chung' },
  {
    t: 'patterns',
    rows: [
      { formula: 'It + is + (widely) + V3 (said / believed / thought / argued / estimated) + that + S + V', vi: 'Người ta nói / tin / cho / lập luận / ước tính rằng… — mở bài Task 2.', examples: [{ en: 'It is often argued that university education should be free.', vi: 'Người ta thường lập luận rằng giáo dục đại học nên miễn phí.' }] },
    ],
  },
  { t: 'rule', formula: 'It + is + (widely) + V3 + that + S + V', vi: 'Thuật lại ý kiến chung mà không cần chủ ngữ “people”.' },

  { t: 'h', text: '(Ngày 13 · Đọc mục 3–4) Multiple choice chọn TWO / THREE — 5 loại bẫy' },
  {
    t: 'table',
    head: ['Bẫy', 'Dấu hiệu'],
    rows: [
      ['Bị phủ nhận / nói ngược', 'no · not · little · by contrast · far from · in fact · once… now'],
      ['Không nhắc', 'Tìm cả vùng không thấy ⇒ loại'],
      ['Sai đối tượng / sai thời', 'Ai nói? Về ai? Lúc nào?'],
      ['Đúng nhưng không trả lời câu hỏi', 'Đọc lại danh từ số nhiều của câu hỏi (problems ≠ benefits)'],
      ['Quá mạnh', 'all · every · always · never · only · permanently'],
    ],
  },
  { t: 'rule', formula: 'Danh từ số nhiều trong câu hỏi → đoạn liệt kê → đánh số ①②③ → so từng phương án → còn đúng 2 (3)', vi: 'Mỗi chữ cái đúng 1 điểm, thứ tự tự do; kiểm cả năm phương án.' },

  { t: 'h', text: '(Ngày 13 · Nghe mục 3 · 6) Part 4 Note completion — từ chỉ đường của giảng viên · /ʃ/ – /ʒ/' },
  {
    t: 'table',
    head: ['Chức năng', 'Cụm hay nghe'],
    rows: [
      ['Dàn bài', "In today's lecture I want to look at… · I'll begin with…, and then move on to…"],
      ['Chuyển phần', "Let's turn now to… · Moving on to… · Another method is… · The third approach is…"],
      ['Định nghĩa', '…, that is, … · in other words, … · what is known as…'],
      ['Mặt trái', 'The trouble is… · The drawback is… · an unfortunate side effect'],
      ['Gạt ý sai (bẫy)', 'You might assume… but · Traditionally…, although nowadays… · not X but Y'],
      ['Tổng kết', 'So, to sum up… · In conclusion…'],
    ],
  },
  { t: 'rule', formula: '-tion / -ssion / phụ âm + sion = /ʃən/ · nguyên âm + sion = /ʒən/ · -stion = /tʃən/', vi: 'erosion, decision, conclusion đọc /ʒ/; solution, discussion, expansion đọc /ʃ/.' },
  // ───────── Ngày 14 ─────────
  { t: 'h', text: '(Ngày 14 · Từ vựng mục 6) Collocation cho Task 2 — 4 kiểu, 12 cụm' },
  {
    t: 'table',
    head: ['Kiểu', 'Ví dụ', 'Lỗi dịch từ tiếng Việt'],
    rows: [
      ['V + N', 'make a decision · do research · take action · gain experience · address a problem', 'do a decision · make research · learn experience'],
      ['adj + N', 'a heavy workload · a high salary · a serious problem · a significant increase', 'a big workload · an expensive salary'],
      ['adv + adj', 'highly competitive · widely believed · well paid · closely related', 'very believed · strongly competitive'],
      ['N + giới từ / N + N', 'an increase in · the cost of living · job security · career prospects', 'an increase of unemployment'],
    ],
  },
  {
    t: 'table',
    head: ['12 cụm', ''],
    rows: [
      ['play a vital role in', 'have a negative impact on'],
      ['pose a threat to', 'raise awareness of'],
      ['take measures to', 'meet the needs of'],
      ['take responsibility for', 'gain experience'],
      ['widen the gap between', 'put pressure on'],
      ['strike a balance between', 'bring benefits to'],
    ],
  },
  { t: 'rule', formula: 'V + (adj) + N + giới từ: play a vital role in · have a negative impact on · pose a threat to · put pressure on', vi: 'Học collocation theo khuôn 4 mảnh — sai động từ hoặc giới từ là thành lỗi LR.' },

  { t: 'h', text: '(Ngày 14 · Viết mục 1) Ba cách hỏi lợi – hại' },
  {
    t: 'table',
    head: ['Câu lệnh', 'Đề đòi gì', 'Ý kiến?'],
    rows: [
      ['What are the advantages and disadvantages of…?', 'Trình bày hai phía', 'Không bắt buộc'],
      ['Do the advantages outweigh the disadvantages?', 'Hai phía + cân bên nào nặng hơn', 'Bắt buộc, ngay mở bài'],
      ['Is this a positive or negative development?', 'Đánh giá xu hướng tốt hay xấu', 'Bắt buộc, ngay mở bài'],
    ],
  },

  { t: 'h', text: '(Ngày 14 · Viết mục 3–4) outweigh — luận điểm, câu bản lề, câu cân' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Although + S + V (phía nhẹ), I believe (that) + the advantages + outweigh + the disadvantages', vi: 'Luận điểm ở mở bài; nhắc lại ở kết bài.', examples: [{ en: 'Although self-employment involves real risks, I believe that its advantages outweigh its disadvantages.', vi: 'Dù tự làm chủ có rủi ro thật, tôi tin rằng lợi ích của nó nặng hơn bất lợi.' }] },
      { formula: 'However, these + N (drawbacks / problems) + are + outweighed + by + N', vi: 'Câu bản lề mở thân bài 2 (phía nặng).', examples: [{ en: 'However, I would argue that these problems are outweighed by two important benefits.', vi: 'Tuy nhiên, tôi cho rằng những vấn đề này bị lấn át bởi hai lợi ích quan trọng.' }] },
      { formula: 'S + can + be + V3 (reduced) + if + S + V', vi: 'Câu cân: phần hại khắc phục được.', examples: [{ en: 'The risks mentioned above can be reduced if people save money before they leave their job.', vi: 'Các rủi ro nêu trên có thể giảm nếu người ta tiết kiệm trước khi nghỉ việc.' }] },
    ],
  },
  {
    t: 'table',
    head: ['Lập trường', 'Cách nói'],
    rows: [
      ['Lợi nặng hơn', 'The benefits are greater than the drawbacks. · On balance, this is a beneficial change.'],
      ['Lợi nặng hơn hẳn', 'The advantages far / clearly / considerably outweigh the disadvantages.'],
      ['Hại nặng hơn', 'The disadvantages outweigh the advantages. · The drawbacks are more serious than the benefits.'],
      ['Có điều kiện', '… outweigh … only if / as long as / provided that…'],
    ],
  },
  { t: 'rule', formula: 'Thân 1 = phía nhẹ → câu bản lề (However, these + N + are outweighed by…) → Thân 2 = phía nặng + 1 câu cân', vi: 'Xếp theo lập trường, không theo thói quen “lợi trước hại sau”.' },

  { t: 'h', text: '(Ngày 14 · Viết mục 8) Is this a positive or negative development? — 3 lập trường' },
  {
    t: 'table',
    head: ['Lập trường', 'Luận điểm', 'Bố cục'],
    rows: [
      ['① Tích cực', 'In my view, this is a positive development, both for … and for …', 'Hai thân bài = hai góc lợi + 1 câu nhượng bộ'],
      ['② Tiêu cực', 'I believe this is largely a negative development, because …', 'Hai thân bài = hai góc hại + 1 câu nhượng bộ'],
      ['③ Tích cực có điều kiện', 'Although this trend has some drawbacks, I believe it is mainly positive, particularly for …', 'Mặt trái (ngắn) → However, on the whole… → mặt tốt (dài)'],
    ],
  },
  { t: 'rule', formula: '(Although + mặt kia,) I believe this is a / mainly a positive / negative development + because + lý do chính', vi: 'Cụm đánh giá: a welcome / beneficial development · a worrying / harmful trend · on the whole · as long as.' },

  { t: 'h', text: '(Ngày 14 · Nói mục 2–3) Part 2 — nơi công cộng: công trình vs vùng đất' },
  {
    t: 'table',
    head: ['Loại', 'Trật tự tả'],
    rows: [
      ['Công trình (library, museum, mall)', 'Ở đâu + xây khi nào → bên ngoài → bên trong → người ta làm gì → vì sao thích'],
      ['Vùng đất (park, lake, square, walking street)', 'Ở đâu + rộng cỡ nào → các khu / vật mốc → theo thời điểm (sáng ↔ tối) → người ta làm gì → vì sao thích'],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + is located in / is surrounded by / is connected to + N', vi: 'Vị trí, xung quanh.', examples: [{ en: 'The lake is surrounded by old trees.', vi: 'Hồ được bao quanh bởi cây cổ thụ.' }] },
      { formula: 'S + was built + in + năm · S + has been + V3 (renovated / turned into)', vi: 'Lịch sử, thay đổi.', examples: [{ en: 'It was built over a hundred years ago and has recently been renovated.', vi: 'Nó được xây hơn một trăm năm trước và mới được tu sửa gần đây.' }] },
      { formula: "It's one of the few places where + S + can + V", vi: 'Lý do thích.', examples: [{ en: "It's one of the few places in the city where you can escape from the noise of the traffic.", vi: 'Đó là một trong số ít nơi trong thành phố mà bạn thoát được tiếng ồn xe cộ.' }] },
    ],
  },
  { t: 'rule', formula: 'Vị trí → trông thế nào → theo thời điểm / ngoài → trong → tôi làm gì → vì sao', vi: 'Đọc động từ của thẻ trước (like to visit / visited / would like to visit / has changed) để chọn thì và góc kể.' },

  { t: 'h', text: '(Ngày 14 · Nói mục 6) Part 3 dạng ưu – nhược' },
  {
    t: 'table',
    head: ['Bước', 'Cụm để nói'],
    rows: [
      ['Mở — báo số ý', 'Well, I think there are two main benefits. · Yes, a couple, I think.'],
      ['Lợi / hại 1–2', 'The most obvious one is… · The other benefit is…, I\'d say. · Another problem is that…'],
      ['Một ý ngược', 'The only real downside is… · Having said that, … · Mind you, …'],
      ['Chốt', "But on the whole, I think the benefits clearly outweigh that. · Overall, I'd say the pros outweigh the cons."],
    ],
  },
  { t: 'rule', formula: 'There are two main benefits. The most obvious one is… The other is… The only real downside is… But on the whole, …', vi: '2 ý chính + 1 ý ngược + chốt, 30–40 giây. pros and cons hơi thân mật — hợp khi nói, tránh trong Task 2.' },

  { t: 'h', text: '(Ngày 14 · Nói mục 7) Phát âm /ɪə/ · /eə/ · /ʊə/' },
  { t: 'rule', formula: '/ɪə/ here · near · clear — /eə/ square · where · air — /ʊə/ tour · sure · rural', vi: 'Ba nguyên âm đôi trượt về /ə/; giọng Anh không đọc r cuối từ, trừ khi nối sang nguyên âm (there is /ðeər ɪz/).' },
  // ───────── Ngày 15 ─────────
  { t: "h", text: "(Ngày 15 · Ngữ pháp mục 1–3) Bốn loại câu điều kiện trên một bảng" },
  {
    t: "table",
    head: ["Loại", "Nói về", "Mệnh đề if", "Mệnh đề chính", "Ví dụ"],
    rows: [
      ["0", "quy luật", "hiện tại đơn", "hiện tại đơn", "If prices **rise**, people **buy** less."],
      ["1", "có thể xảy ra ở tương lai", "hiện tại đơn", "will / can / may + V", "If the city **builds** a metro, traffic **will improve**."],
      ["2", "tưởng tượng, trái hiện tại", "quá khứ đơn / were (văn nói: was)", "would / could / might + V", "If the city **had** a metro, traffic **would be** lighter."],
      ["3", "tưởng tượng, trái quá khứ", "had + V3", "would / could / might + have + V3", "If the city **had built** a metro, traffic **would have improved**."],
    ],
  },
  { t: "rule", formula: "If + S + V-ed / were, S + would / could / might + V", vi: "Loại 2: tưởng tượng trái với hiện tại hoặc khó xảy ra. Mệnh đề if không bao giờ có would." },
  { t: "rule", formula: "If + S + had (not) + V3, S + would / could / might + have + V3", vi: "Loại 3: tưởng tượng trái với một việc đã xong trong quá khứ — nuối tiếc, phê bình, phân tích nguyên nhân." },

  { t: "h", text: "(Ngày 15 · Ngữ pháp mục 4) wish / if only" },
  {
    t: "table",
    head: ["Ước về", "Công thức", "Ví dụ"],
    rows: [
      ["hiện tại", "wish + S + **V-ed / were / could + V**", "I wish I **spoke** English fluently. · I wish I **could** drive."],
      ["quá khứ", "wish + S + **had + V3**", "I wish I **had started** earlier."],
      ["người / vật khác thay đổi", "wish + S khác + **would + V**", "I wish it **would stop** raining."],
      ["điều có thể xảy ra", "**hope** + S + V (không lùi thì)", "I **hope** you pass the exam."],
    ],
  },
  { t: "rule", formula: "wish / if only + S + V-ed (hiện tại) · had V3 (quá khứ) · would V (người khác thay đổi)", vi: "Ước một điều trái thực tế: lùi một thì, như mệnh đề if của loại 2 và loại 3." },

  { t: "h", text: "(Ngày 15 · Ngữ pháp mục 5) would rather · would prefer · it's (high) time" },
  {
    t: "patterns",
    rows: [
      { formula: "S + would rather + V (+ than + V)", vi: "thà / thích … hơn (cùng chủ ngữ)", examples: [{ en: "I'd rather work from home than commute for two hours.", vi: "Tôi thà làm ở nhà còn hơn đi lại hai tiếng." }] },
      { formula: "S + would rather + S khác + V-ed", vi: "muốn người khác làm gì — lùi về quá khứ đơn", examples: [{ en: "I'd rather you didn't smoke in here.", vi: "Tôi muốn bạn đừng hút thuốc ở đây." }] },
      { formula: "S + would prefer + to V (+ rather than + V)", vi: "would prefer đi với to V", examples: [{ en: "I'd prefer to live in a small town rather than in a big city.", vi: "Tôi thích sống ở thị trấn nhỏ hơn là ở thành phố lớn." }] },
      { formula: "It's (high) time + S + V-ed", vi: "đã đến lúc ai đó phải làm (có ý phê bình)", examples: [{ en: "It's high time the government invested in public transport.", vi: "Đã đến lúc chính phủ phải đầu tư vào giao thông công cộng." }] },
    ],
  },
  { t: "rule", formula: "would rather + V (than V) · would rather + S + V-ed · would prefer + to V · it's (high) time + S + V-ed", vi: "Cùng chủ ngữ ⇒ V nguyên mẫu; có chủ ngữ thứ hai ⇒ lùi về quá khứ đơn." },

  { t: "h", text: "(Ngày 15 · Ngữ pháp mục 6) Thay cho if: without · if it weren't for · suppose" },
  {
    t: "patterns",
    rows: [
      { formula: "Without + N, S + would (not) + V", vi: "nếu không có …", examples: [{ en: "Without tourism, the island's economy would collapse.", vi: "Không có du lịch, kinh tế của hòn đảo sẽ sụp đổ." }] },
      { formula: "If it weren't for + N, S + would / could + V", vi: "nếu không nhờ / không vì … (hiện tại)", examples: [{ en: "If it weren't for my scholarship, I couldn't afford university.", vi: "Nếu không nhờ học bổng, tôi không đủ tiền học đại học." }] },
      { formula: "If it hadn't been for + N, S + would have + V3", vi: "nếu không nhờ / không vì … (quá khứ)", examples: [{ en: "If it hadn't been for the vaccine, millions more would have died.", vi: "Nếu không nhờ vắc-xin, hàng triệu người nữa đã chết." }] },
      { formula: "Suppose / Supposing + S + V-ed, what would + S + V?", vi: "giả sử …", examples: [{ en: "Suppose you lost your job tomorrow — what would you do?", vi: "Giả sử mai bạn mất việc — bạn sẽ làm gì?" }] },
    ],
  },
  { t: "rule", formula: "Without / If it weren't for + N, S + would + V · Suppose + S + V-ed, … would …?", vi: "Ba cách mở câu giả định không cần mệnh đề if dài." },

  { t: "h", text: "(Ngày 15 · Nói mục 2, 3 và 6) Khung Part 3 cho câu hỏi giả định “What would happen if…?”" },
  {
    t: "table",
    head: ["Bước", "Khung câu", "Ví dụ"],
    rows: [
      ["① Đánh dấu giả định", "Well, if that happened, I think … would …", "Well, if that happened, I think city centres would look completely different."],
      ["② Hệ quả chính + vì sao", "The biggest / most obvious change would be …, because …", "The most obvious change would be cleaner air, because traffic is the main source of pollution."],
      ["Chuỗi hệ quả", "…, which would mean (that) … could / would …", "The streets would be safer, which would mean more people could cycle."],
      ["③ Mặt trái (hạ mức chắc chắn)", "On the other hand, … might / could …", "On the other hand, shop owners could lose customers."],
      ["④ Kéo về thực tế", "So realistically, I don't think … would … unless … V-ed", "So realistically, I don't think a complete ban would work unless the city had a good metro system."],
      ["Giả định quá khứ", "If I'd …, I would've / might have + V3", "If I'd grown up without the Internet, I would've read more books."],
    ],
  },
  {
    t: "table",
    head: ["Mức chắc chắn", "Cách nói"],
    rows: [
      ["≈ 95 %", "would definitely / certainly + V"],
      ["≈ 75 %", "would probably + V · would be likely to + V"],
      ["≈ 50 %", "might / could + V · might well + V"],
      ["≈ 25 %", "probably wouldn't + V · I doubt (that) … would + V"],
    ],
  },
  { t: "rule", formula: "If that happened, S + would + V, because … → …, which would mean … → On the other hand, S + might + V → So realistically, …", vi: "Soi thì của câu hỏi: hỏi would + V thì đáp loại 2, hỏi would have + V3 thì đáp loại 3." },
  // ───────── Ngày 16 ─────────
  { t: "h", text: "(Ngày 16 · Từ vựng mục 5) Collocation kinh tế cho Task 2 / Part 3" },
  {
    t: "table",
    head: ["Collocation", "Nghĩa", "Ví dụ"],
    rows: [
      ["boost / stimulate the economy", "thúc đẩy nền kinh tế", "Hosting international events can **boost the local economy**."],
      ["create / generate jobs", "tạo việc làm", "New factories **create jobs** for unskilled workers."],
      ["attract foreign investment", "thu hút đầu tư nước ngoài", "Good infrastructure helps a country **attract foreign investment**."],
      ["set up a business · make a profit · do business (with)", "lập doanh nghiệp · có lãi · làm ăn (với)", "Few start-ups **make a profit** in their first two years."],
      ["go bankrupt / go out of business · drive sb out of business", "phá sản · khiến ai phá sản", "Supermarket chains **drive small shops out of business**."],
      ["meet demand (for) · cut costs · gain a competitive edge", "đáp ứng nhu cầu · cắt chi phí · giành lợi thế cạnh tranh", "Companies outsource production in order to **cut costs**."],
      ["raise living standards · lift people out of poverty", "nâng mức sống · đưa người dân thoát nghèo", "Trade has **lifted millions of people out of poverty**."],
      ["widen / narrow the gap between rich and poor", "nới rộng / thu hẹp khoảng cách giàu nghèo", "Critics argue that free trade **widens the gap between rich and poor**."],
    ],
  },
  { t: "rule", formula: "boost the economy · create jobs · attract investment · make a profit · do business · go bankrupt · meet demand · raise living standards", vi: "Tám cụm động từ + danh từ đủ dùng cho hầu hết thân bài Task 2 về kinh tế." },

  { t: "h", text: "(Ngày 16 · Viết mục 2) Pie chart hai năm — tả thay đổi tỉ lệ" },
  {
    t: "patterns",
    rows: [
      { formula: "The share / proportion of + N + rose / fell + from x% to y%", vi: "chủ ngữ là TỈ TRỌNG, không phải tên hạng mục trần", examples: [{ en: "The share of export earnings from services rose from 12% to 26%.", vi: "Tỉ trọng thu nhập xuất khẩu từ dịch vụ tăng từ 12 % lên 26 %." }] },
      { formula: "N + accounted for x% in [năm 1], but this figure had fallen to y% by [năm 2]", vi: "hai năm trong một câu; by + năm ⇒ had + V3", examples: [{ en: "Agriculture accounted for 38% of export earnings in 2000, but this figure had more than halved to 17% by 2020.", vi: "Nông nghiệp chiếm 38 % năm 2000, nhưng con số này đã giảm hơn một nửa xuống 17 % vào năm 2020." }] },
      { formula: "N + rose by x percentage points, making it the largest + N", vi: "điểm phần trăm + cụm V-ing nêu kết quả", examples: [{ en: "The figure for manufactured goods rose by 17 percentage points, making it the largest sector.", vi: "Con số của hàng chế tạo tăng 17 điểm phần trăm, khiến nó thành lĩnh vực lớn nhất." }] },
      { formula: "N1 + overtook + N2 (+ to become + …) · N1 + replaced + N2 + as + …", vi: "đổi thứ hạng", examples: [{ en: "Services overtook agriculture to become the second-largest source of export income.", vi: "Dịch vụ vượt nông nghiệp để thành nguồn thu xuất khẩu lớn thứ hai." }] },
      { formula: "Together, N1 and N2 + made up + …, compared with + … in [năm 1]", vi: "gộp hai lát rồi so hai năm", examples: [{ en: "Together, these two sectors made up less than a third of the total in 2020, compared with well over half twenty years earlier.", vi: "Gộp lại, hai lĩnh vực này chiếm chưa tới một phần ba năm 2020, so với hơn một nửa hẳn hai mươi năm trước." }] },
    ],
  },
  { t: "rule", formula: "The share of + N + rose / fell from x% to y% (by z percentage points) · N1 overtook N2 · N more than doubled / halved", vi: "24 % → 41 % là tăng 17 ĐIỂM phần trăm, không phải “by 17%”." },

  { t: "h", text: "(Ngày 16 · Viết mục 4–6) Ba – bốn pie (nước × năm): chọn một trục" },
  {
    t: "table",
    head: ["Trục chia", "Thân 1 / Thân 2", "Hợp khi"],
    rows: [
      ["Theo nước (an toàn nhất)", "Thân 1 = nước A qua hai năm · Thân 2 = nước B qua hai năm, có so với A", "mỗi nước thay đổi một kiểu"],
      ["Theo hạng mục", "Thân 1 = hạng mục giảm ở cả hai nước · Thân 2 = hạng mục tăng", "hai nước đi cùng hướng, ít hạng mục"],
      ["Theo năm", "Thân 1 = năm đầu, A so với B · Thân 2 = năm sau", "tin chính là khác biệt giữa hai nước, ít thay đổi"],
    ],
  },
  {
    t: "table",
    head: ["Vị trí", "Câu khung"],
    rows: [
      ["Overview (2 pie)", "Overall, … moved away from A towards B. As a result, B replaced A as the largest …"],
      ["Overview (4 pie)", "Overall, … in both countries, while … . However, Country A … far more than Country B, where …"],
      ["Mở thân 2 (4 pie)", "Country B was much more / less … · As in Country A, … · Unlike Country A, …"],
      ["Nhượng bộ", "Although this figure dropped by z percentage points, it still represented …"],
      ["Lát nhỏ / Other", "Other … remained almost unchanged at around x%."],
    ],
  },
  { t: "rule", formula: "3–4 pie ⇒ MỘT trục (nước · hạng mục · năm); overview = điểm chung + điểm khác; thân 2 mở bằng câu so sánh", vi: "Phân vân thì chia theo nước." },

  { t: "h", text: "(Ngày 16 · Nghe mục 1) Bốn kỷ luật của bài Listening" },
  { t: "rule", formula: "Một lần nghe · lỡ thì bỏ · khoảng lặng = đọc câu sắp tới · 2 phút cuối = chính tả + số từ + không để trống", vi: "Lỡ một câu: đánh dấu ?, nhảy ngay sang câu kế, quay lại đoán trong 2 phút kiểm." },

  { t: "h", text: "(Ngày 16 · Nghe mục 6) Trọng âm danh từ – động từ cùng chữ" },
  {
    t: "table",
    head: ["Từ", "Danh từ (nhấn âm 1)", "Động từ (nhấn âm 2)"],
    rows: [
      ["increase · decrease", "an **IN**crease · a **DE**crease", "to in**CREASE** · to de**CREASE**"],
      ["export · import", "**EX**ports · **IM**ports", "to ex**PORT** · to im**PORT**"],
      ["record · produce", "a **RE**cord · fresh **PRO**duce", "to re**CORD** · to pro**DUCE**"],
      ["present · project", "a **PRE**sent · a **PRO**ject", "to pre**SENT** · to pro**JECT**"],
      ["contract · permit · refund", "a **CON**tract · a **PER**mit · a **RE**fund", "to con**TRACT** · to per**MIT** · to re**FUND**"],
      ["KHÔNG đổi", "**PRO**fit · **MAR**ket · **AN**swer · **VI**sit", "re**PORT** · con**TROL** · de**MAND** · re**SULT**"],
    ],
  },
  { t: "rule", formula: "Danh từ: nhấn âm 1 (an INcrease, a REcord) · Động từ: nhấn âm 2 (to inCREASE, to reCORD)", vi: "Nhóm từ hai âm tiết viết giống nhau; âm không nhấn có nguyên âm yếu đi." },
  // ───────── Ngày 17 ─────────
  { t: 'h', text: '(Ngày 17 · mục 2) Mệnh đề quan hệ không xác định — có dấu phẩy' },
  {
    t: 'patterns',
    rows: [
      { formula: 'N (đã rõ) , who / which / whose / where + … , V …', vi: 'Thêm thông tin phụ, chen giữa câu: hai dấu phẩy.', examples: [{ en: 'Ho Chi Minh City, which has over nine million people, suffers from heavy traffic.', vi: 'Thành phố Hồ Chí Minh, nơi có hơn chín triệu dân, chịu cảnh kẹt xe nặng.' }] },
      { formula: 'S + V + N , who / which / whose / where + …', vi: 'Thêm thông tin phụ ở cuối câu: một dấu phẩy.', examples: [{ en: 'The survey was carried out in Da Nang, where tourism is the main industry.', vi: 'Cuộc khảo sát được thực hiện ở Đà Nẵng, nơi du lịch là ngành chính.' }] },
    ],
  },
  { t: 'rule', formula: 'N đã rõ , who / which / whose / where + mệnh đề , V …', vi: 'Thông tin THÊM → có dấu phẩy, không dùng that, không bỏ đại từ quan hệ.' },

  { t: 'h', text: '(Ngày 17 · mục 3) “, which” thay cho cả một ý' },
  {
    t: 'table',
    head: ['Cụm', 'Nghĩa', 'Ví dụ'],
    rows: [
      [', which means (that)…', 'nghĩa là…', 'Rents are rising, **which means** young people cannot move out.'],
      [', which leads to / results in…', 'dẫn tới…', 'Factories release waste into rivers, **which leads to** health problems.'],
      [', which makes it + adj + to V', 'khiến việc… trở nên…', 'The job requires night shifts, **which makes it difficult to** have a family life.'],
      [', which is why…', 'đó là lý do…', 'The exam is in English, **which is why** I started this course.'],
      [', which in turn + V(s/es)', 'đến lượt nó lại…', 'Teenagers sleep less, **which in turn affects** their results.'],
    ],
  },
  { t: 'rule', formula: 'S + V … , which + V(s/es) …  (which = cả ý đứng trước)', vi: 'Gộp “… . This means…” thành một câu. Động từ sau which chia số ít; không viết “, it / , that”.' },

  { t: 'h', text: '(Ngày 17 · mục 4–5) of which / of whom · giới từ + which' },
  {
    t: 'patterns',
    rows: [
      { formula: 'N , most / half / two / 30% + of which / of whom + V …', vi: '“Trong số đó…”. Người: of whom; vật: of which.', examples: [{ en: 'The company employs 400 people, most of whom work remotely.', vi: 'Công ty có 400 nhân viên, phần lớn làm việc từ xa.' }, { en: 'The chart shows five sources of energy, the largest of which is coal.', vi: 'Biểu đồ cho thấy năm nguồn năng lượng, lớn nhất là than.' }] },
      { formula: 'N + giới từ + which / whom + S + V', vi: 'Văn viết: giới từ đứng trước which / whom (in which = where).', examples: [{ en: 'Social media has changed the way in which people communicate.', vi: 'Mạng xã hội đã thay đổi cách mọi người giao tiếp.' }, { en: 'This essay discusses the extent to which advertising influences children.', vi: 'Bài luận này bàn về mức độ quảng cáo ảnh hưởng tới trẻ em.' }] },
    ],
  },
  { t: 'rule', formula: 'the extent to which · the way in which · a situation in which + S + V', vi: 'Không dùng that / who sau giới từ; không lặp giới từ ở cuối mệnh đề.' },

  { t: 'h', text: '(Ngày 17 · mục 6–7) Rút gọn mệnh đề quan hệ: V-ing (chủ động) · V3 (bị động)' },
  {
    t: 'patterns',
    rows: [
      { formula: 'N + who / which / that + V (chủ động)  →  N + V-ing', vi: 'Danh từ TỰ làm hành động.', examples: [{ en: 'People living in big cities often suffer from stress.', vi: 'Người sống ở thành phố lớn thường bị căng thẳng.' }, { en: 'The number of people using buses has doubled.', vi: 'Số người dùng xe buýt đã tăng gấp đôi.' }] },
      { formula: 'N + which / who + be + V3  →  N + V3 (+ by …)', vi: 'Danh từ BỊ / ĐƯỢC làm.', examples: [{ en: 'The data collected in 2020 show a clear trend.', vi: 'Số liệu thu thập năm 2020 cho thấy một xu hướng rõ.' }, { en: 'The bridge being built will open next year.', vi: 'Cây cầu đang được xây sẽ thông xe năm sau.' }] },
      { formula: 'S + V … , V-ing …  (= , which + V)', vi: 'Nêu kết quả ở cuối câu — Task 1 và Task 2.', examples: [{ en: 'Sales rose sharply, reaching a peak of 5 million in 2020.', vi: 'Doanh số tăng mạnh, đạt đỉnh 5 triệu vào năm 2020.' }] },
    ],
  },
  { t: 'rule', formula: 'N + V-ing (tự làm) · N + V3 (bị làm)', vi: 'Chỉ rút gọn khi từ quan hệ là chủ ngữ. Mỗi câu vẫn chỉ một động từ chính được chia.' },

  { t: 'h', text: '(Ngày 17 · mục 9) Khung nói Part 3 với mệnh đề quan hệ' },
  { t: 'rule', formula: 'People + V-ing … + V … , which means (that) + S + V', vi: 'Gọi tên nhóm người bằng V-ing rút gọn, rồi thêm hệ quả bằng “, which means…”. Ngắt hơi trước which.' },

  { t: 'h', text: '(Ngày 17 · Đọc mục 2) Flow-chart + Diagram label — quy trình làm bài' },
  {
    t: 'table',
    head: ['Bước', 'Việc làm'],
    rows: [
      ['①', 'Đọc lời dẫn: ONE WORD ONLY / NO MORE THAN TWO WORDS'],
      ['②', 'Đọc tiêu đề + cả sơ đồ / hình: quy trình đi từ đâu tới đâu'],
      ['③', 'Đoán loại từ từng chỗ trống (sau a / the → danh từ; sau and → cùng loại)'],
      ['④', 'Scan tìm 1–2 đoạn tả quy trình / cấu tạo'],
      ['⑤', 'Dò từng ô theo paraphrase (keep out → prevent; known as → is called)'],
      ['⑥', 'Chép nguyên văn, đúng số từ, đúng số ít / số nhiều'],
    ],
  },
  { t: 'rule', formula: 'Đọc hình → đoán loại từ → tìm đoạn → dò paraphrase → chép nguyên văn, đúng số từ', vi: 'Flow-chart: đáp án thường theo thứ tự bài. Diagram: dò theo vị trí (above, beneath, along the edge).' },

  { t: 'h', text: '(Ngày 17 · Nghe mục 2–3) Part 3: Choose TWO + Flow-chart chọn từ hộp' },
  {
    t: 'table',
    head: ['Tín hiệu', 'Câu hay nghe', 'Nghĩa là'],
    rows: [
      ['✅ xác nhận / đồng ý', 'It kept happening. · Let\'s do that. · That makes sense. · Agreed.', 'phương án ĐÚNG'],
      ['❌ giả định bị bác', 'We thought… but actually… · The forecast said… but in the end…', 'phương án SAI'],
      ['❌ từ chối lịch sự', 'We\'d love to, but… · It\'s a nice idea, only…', 'phương án SAI'],
      ['chuyển bước', 'First of all… · Once that\'s done… · Before you do that… · And finally…', 'sang ô kế tiếp của sơ đồ'],
    ],
  },
  { t: 'rule', formula: 'Choose TWO: nghe đủ 5 phương án → gạch cái bị bác (but / actually / not realistic) → còn lại 2', vi: 'Nghe thấy từ khoá chưa phải đáp án; chờ câu phản ứng của người kia.' },
  // ───────── Ngày 18 ─────────
  { t: 'h', text: '(Ngày 18 · Từ vựng mục 5) Cụm động từ — đặt tân ngữ ở đâu' },
  {
    t: 'table',
    head: ['Kiểu', 'Tân ngữ đứng đâu', 'Ví dụ'],
    rows: [
      ['Không có tân ngữ', '—', 'Prices **went up**. · We **fell out**.'],
      ['Tách được', 'Danh từ: giữa hoặc sau. Đại từ (it / them): BẮT BUỘC ở giữa', 'turn **it** off · look **it** up'],
      ['Không tách được (động từ + giới từ; cụm 3 chữ)', 'Luôn sau cả cụm', 'look after **her** · put up with **the noise**'],
    ],
  },
  { t: 'rule', formula: 'look forward to / end up / give up / put off + V-ing', vi: 'Sau giới từ (look forward to) và sau các cụm end up, give up, put off dùng V-ing, không dùng to V — nhưng không phải cụm nào cũng thế (turn out to be).' },

  { t: 'h', text: '(Ngày 18 · Từ vựng mục 8) Câu khung Task 2 / Part 3: nêu nguyên nhân, tả người, tự tả mình' },
  {
    t: 'patterns',
    rows: [
      { formula: 'N (vấn đề) + stems from + N / the fact that + S + V', vi: 'Nêu nguyên nhân.', examples: [{ en: 'This problem stems from the fact that apps are designed to be addictive.', vi: 'Vấn đề này bắt nguồn từ việc các ứng dụng được thiết kế để gây nghiện.' }] },
      { formula: 'S + comes across as + adj , but in fact + S + V', vi: 'Tả người: ấn tượng ↔ con người thật.', examples: [{ en: 'My uncle comes across as strict, but in fact he is very considerate.', vi: 'Chú tôi tạo cảm giác nghiêm khắc, nhưng thật ra rất chu đáo.' }] },
      { formula: 'I\'d describe myself as + adj , in the sense that + S + V', vi: 'Tự tả mình — tính từ + bằng chứng.', examples: [{ en: 'I\'d describe myself as conscientious, in the sense that I always double-check my work.', vi: 'Tôi tự nhận mình tận tâm, theo nghĩa là tôi luôn kiểm lại việc mình làm.' }] },
    ],
  },
  { t: 'rule', formula: 'tính từ tính cách + in the sense that / because + S + V (việc cụ thể đã làm)', vi: 'Tính từ tính cách không đứng một mình: luôn kèm một việc làm chứng.' },

  { t: 'h', text: '(Ngày 18 · Viết mục 3) Problem / solution: giải pháp gắn đúng nguyên nhân' },
  {
    t: 'table',
    head: ['Phần', 'Câu hỏi tự kiểm', 'Ví dụ'],
    rows: [
      ['Ai', 'Chủ thể cụ thể?', '**Governments** could…'],
      ['Làm gì', 'Hành động cụ thể, làm được?', '…**require companies to switch off** endless scrolling for users under eighteen.'],
      ['Vì sao', 'Nó xử lý nguyên nhân thế nào?', '**If apps stopped** after thirty minutes, most teenagers **would find it easier** to put their phones down.'],
    ],
  },
  { t: 'rule', formula: 'To address + nguyên nhân , AI + could + V . If + S + V2 , S + would + V', vi: 'Mỗi giải pháp gọi lại nguyên nhân nó xử lý, rồi nói ai làm gì và vì sao hiệu quả.' },

  { t: 'h', text: '(Ngày 18 · Viết mục 4) Mở bài nhượng bộ' },
  {
    t: 'patterns',
    rows: [
      { formula: 'While / Although + S + V (mặt tốt) , S + V (vấn đề) , which + V(s/es) …', vi: 'Câu 1: nhượng bộ + paraphrase vấn đề.', examples: [{ en: 'While social media has made it easier than ever for young people to stay in touch, many of them now spend several hours a day online, which is harming both their mental health and their relationships.', vi: 'Dù mạng xã hội giúp người trẻ giữ liên lạc dễ hơn bao giờ hết, nhiều người nay dành vài giờ mỗi ngày trên mạng, điều này gây hại cho cả sức khoẻ tinh thần lẫn các mối quan hệ.' }] },
      { formula: 'Despite + N / V-ing , S + V', vi: 'Despite + cụm danh từ (không + mệnh đề).', examples: [{ en: 'Despite the benefits of working from home, many employees feel isolated.', vi: 'Bất chấp lợi ích của làm việc ở nhà, nhiều nhân viên thấy lẻ loi.' }] },
      { formula: 'This essay will examine two main causes of this problem and suggest a measure to deal with each of them', vi: 'Câu 2: báo đúng các phần đề hỏi.', examples: [{ en: 'This essay will examine two main causes of this problem and suggest a measure to deal with each of them.', vi: 'Bài luận này sẽ xem xét hai nguyên nhân chính và đề xuất một biện pháp cho từng nguyên nhân.' }] },
    ],
  },
  { t: 'rule', formula: 'While + S + V , S + V . This essay will examine … and suggest …', vi: 'Không viết Although… but; không viết Despite + mệnh đề.' },

  { t: 'h', text: '(Ngày 18 · Viết mục 5–6) Chuỗi hệ quả hai tầng · ngôn ngữ giải pháp' },
  {
    t: 'table',
    head: ['Chức năng', 'Cụm', 'Ví dụ'],
    rows: [
      ['Hệ quả 1', 'As a result, · Consequently,', '**As a result,** teenagers often end up scrolling for two hours.'],
      ['Hệ quả 2', ', which (in turn) + V(s/es)', '…**, which in turn lowers** their self-confidence.'],
      ['Động từ nguyên nhân', 'lead sb to V · cause sb to V · make sb V', 'This **leads them to check** their phones constantly.'],
      ['Giải pháp + kết quả', 'S + could + V … , giving / allowing + O …', 'Schools could set up clubs, **giving** students a sense of belonging.'],
      ['Bằng cách', 'By + V-ing … , S + can + V', '**By keeping** phones away from the table, parents can set a good example.'],
      ['Đổi chủ thể', 'N , on the other hand, is better tackled by + N', 'Peer pressure, on the other hand, **is better tackled by** schools.'],
    ],
  },
  { t: 'rule', formula: 'Nguyên nhân . As a result, + S + V , which (in turn) + V(s/es) + hệ quả cuối', vi: 'Mỗi nguyên nhân kéo đúng hai tầng hệ quả; hệ quả cuối chạm vào vấn đề mà đề nêu.' },

  { t: 'h', text: '(Ngày 18 · Nói mục 3–4) Phỏng vấn: tự giới thiệu · điểm mạnh · điểm yếu' },
  {
    t: 'patterns',
    rows: [
      { formula: 'I\'m … . For the past … I\'ve been + V-ing … . That\'s why I\'m now looking for …', vi: 'Tự giới thiệu: Hiện tại → Quá khứ gần → Tương lai.', examples: [{ en: 'I\'m in my final year of a software engineering degree. For the past year I\'ve been working part-time as a tester. That\'s why I\'m now looking for a junior analyst role.', vi: 'Em đang học năm cuối ngành kỹ thuật phần mềm. Một năm qua em làm kiểm thử bán thời gian. Vì thế giờ em tìm vị trí phân tích tập sự.' }] },
      { formula: 'I\'d say I\'m + adj . For instance, when + S + V2 … , I + V2 … , and as a result + S + V2', vi: 'Điểm mạnh: một tính từ + chuyện STAR.', examples: [{ en: 'I\'d say I\'m reliable. For instance, when our group leader fell ill, I took over the report, and as a result we handed it in on time.', vi: 'Em nghĩ mình đáng tin cậy. Chẳng hạn, khi trưởng nhóm ốm, em nhận phần báo cáo, nhờ thế nhóm nộp đúng hạn.' }] },
      { formula: 'I used to + V … . To work on that, I + V2 … . I\'m still not … , but I\'m much more + adj + than I was', vi: 'Điểm yếu: trước đây → việc đã làm để sửa → hiện giờ.', examples: [{ en: 'I used to find it hard to speak up in meetings. To work on that, I joined the debating club. I\'m still not the loudest person in the room, but I\'m much more confident than I was.', vi: 'Trước đây em thấy khó lên tiếng trong họp. Để cải thiện, em tham gia câu lạc bộ tranh biện. Em vẫn chưa phải người nói to nhất, nhưng tự tin hơn trước nhiều.' }] },
    ],
  },
  { t: 'rule', formula: 'S (tình huống) → T (việc phải làm) → A (I + V2) → R (kết quả có con số)', vi: 'Khung STAR cho “Tell me about a time when…” — cũng là khung Part 2 “a time when”.' },

  { t: 'h', text: '(Ngày 18 · Nói mục 6) Hỏi lịch sự — câu hỏi gián tiếp' },
  {
    t: 'patterns',
    rows: [
      { formula: 'I was wondering whether / if + S + could + V …', vi: 'Mở lịch sự nhất.', examples: [{ en: 'I was wondering whether you could tell me a bit more about the team.', vi: 'Em không biết chị có thể nói thêm về nhóm không ạ.' }] },
      { formula: 'Could you tell me + Wh- + S + V … ?', vi: 'Không đảo sau Wh-, không do / does / did.', examples: [{ en: 'Could you tell me what the salary range is?', vi: 'Chị cho em biết khoảng lương là bao nhiêu được không ạ?' }] },
      { formula: 'Would it be possible to + V … ?', vi: 'Xin phép / đề nghị.', examples: [{ en: 'Would it be possible to start in July?', vi: 'Em có thể bắt đầu vào tháng Bảy được không ạ?' }] },
    ],
  },
  { t: 'rule', formula: 'cụm mở đầu lịch sự + Wh- / whether + S + V (trật tự câu kể)', vi: 'Ngữ điệu: bắt đầu cao, lên nhẹ ở cuối câu đề nghị; xuống ấm ở câu cảm ơn.' },
];
