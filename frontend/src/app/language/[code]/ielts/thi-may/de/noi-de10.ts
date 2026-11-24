/**
 * Đề 10 — Speaking, TẬP 5 · NGÀY 16 (docs/ielts-lo-trinh-0-8.md mục 4.2: "Colours, Weekends · Describe a tradition"). TỰ SOẠN
 * 24/11/2026. Người học sẽ MỔ bài nói này ở Tập 5 Ngày 22 ("Mổ Speaking Đề 10 + paraphrase tinh").
 * Part 1: Colours + Weekends — 6 câu (T5 N3 "Part 1 band 8: tự nhiên, idiom khéo") · Part 2: Describe a tradition — thẻ hẹp lại
 * thành "một truyền thống trong gia đình hoặc cộng đồng mà bạn mong được giữ" (T5 N7 kể có chi tiết cảm quan; T5 N14 đề hiếm) ·
 * Part 3: 5 câu khó dần, nối chủ đề truyền thống: fact → nguyên nhân "Why do some…?" → mức độ / chính sách "To what extent
 * should…?" (T5 N13 "Part 3 trừu tượng cấp cao: triết lý, chính sách") → đạo đức "Is it ever right to…?" → dự đoán có hedging
 * "Do you think… in the future?" (T5 N6 phản biện, nhượng bộ, hedging).
 * Khó hơn Đề 8 một bậc: Part 1 có câu đòi giải thích một liên tưởng văn hoá (màu sắc) và câu so sánh với quá khứ; Part 3 có câu
 * chính sách (tiêu tiền công) và câu đạo đức về việc BỎ một truyền thống — đòi nêu tiêu chí, nhượng bộ rồi mới kết luận.
 * `mau`: câu trả lời mẫu band 8.0–8.5 — "ngắt vì nội dung, không vì ngôn ngữ" (T5 N2), idiom dùng MỘT lần đúng chỗ (T5 N11),
 * cấu trúc phức tự nhiên + ellipsis (T5 N11), hedging đa dạng; phân tích FC · LR · GRA · P bằng tiếng Việt. Phiên âm theo
 * Anh–Anh; chỉ nêu trọng âm của những từ thông dụng. Bài mẫu Part 2 kể một ngày giỗ trong gia đình Việt — chi tiết là hư cấu
 * điển hình, không phải chuyện của một người thật.
 */
import type { DeNoi } from './types';

export const NOI_DE10: DeNoi = {
  id: 'noi-de10',
  kyNang: 'noi',
  ten: 'Speaking — Đề 10 (Tập 5 · Ngày 16)',
  boDe: 'Đề 10',
  capDo: 'Band 7.5',
  moTa: 'Part 1: colours · weekends · Part 2: a tradition in your family or community that you hope will continue · Part 3: why traditions survive or die out, traditions and the modern world',
  phut: 14,
  part1: [
    {
      chuDe: 'Colours',
      cau: [
        'Is there a colour you would never choose for your clothes?',
        'Do colours affect your mood at all?',
        'Are any colours thought to be lucky or unlucky in your country?',
      ],
    },
    {
      chuDe: 'Weekends',
      cau: [
        'How do you usually spend your weekends?',
        'Do you prefer to plan your weekends or to leave them free?',
        'Are your weekends now different from the ones you had as a child?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a tradition in your family or community that you hope will continue.\n\nYou should say:\n• what the tradition is\n• when and how it is carried out\n• who takes part in it\n\nand explain why you hope it will continue.',
    goiY: [
      'Bạn có 1 phút chuẩn bị. Chọn MỘT truyền thống NHỎ và cụ thể mà bạn kể được bằng mắt – tai – mũi (Tập 5 Ngày 7: chi tiết cảm quan): ngày giỗ, gói bánh đêm cuối năm, bữa cơm Chủ nhật ở nhà bà, phiên chợ quê, lễ ra quân của đội bóng xóm… Truyền thống "cả nước" (Tết nói chung) dễ thành bài giới thiệu văn hoá học thuộc — giám khảo band 8 muốn nghe chuyện của BẠN.',
      'Ghi 4 từ khoá cho 4 ý (what · when/how · who · why) + 2 chi tiết cảm quan (mùi hương, tiếng dao thớt, màu mâm cỗ) + 1 câu nói của một người (bà, bác). Ý "why you hope it will continue" nói DÀI NHẤT — khoảng 40 giây cuối.',
      'Thì: hiện tại đơn cho việc lặp lại hằng năm ("we all go back…", "my aunts take over the kitchen"); "will" / "tend to" cho thói quen ("someone will always…"); quá khứ đơn cho MỘT lần đáng nhớ; hiện tại hoàn thành cho điều đã đổi ("fewer of us have been able to come"); điều kiện loại 2 cho nỗi lo tương lai ("If it stopped, I doubt we\'d…").',
      'Từ cho truyền thống (không lặp "tradition" mười lần): custom, ritual, an occasion, a gathering, to be handed down, to keep it going / keep it alive, to die out, the older generation, to pay our respects, an ancestor, an altar, incense.',
      'Band 8 = có SUY NGẪM, không chỉ kể: nói thật một điều bạn từng thấy phiền (phải về quê, ngồi nghe hỏi chuyện lương) rồi vì sao giờ bạn nghĩ khác. Một idiom đúng register, dùng MỘT lần (Tập 5 Ngày 11): "it\'s the glue that holds us together", "out of sight, out of mind", "I took it for granted".',
    ],
    cauChot: [
      'Do younger members of your family feel the same way about it?',
      'Has the tradition changed at all since you were a child?',
    ],
  },
  part3: [
    {
      chuDe: 'Why traditions survive or die out',
      cau: [
        'How do children in your country usually learn about traditional customs?',
        'Why do some traditions survive for centuries while others die out within a generation?',
        'To what extent should governments spend public money on keeping traditions alive?',
      ],
    },
    {
      chuDe: 'Traditions and the modern world',
      cau: [
        'Is it ever right to give up a tradition that some people still value?',
        'Do you think traditions around the world will become more alike in the future?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Are any colours thought to be lucky or unlucky in your country?',
      band: 'Band 8.0–8.5',
      s: 'Oh, definitely. Red\'s the obvious one — it\'s everywhere at New Year and at weddings, on the envelopes, the decorations, even the fruit people choose for the altar, because it\'s meant to bring good fortune. White\'s more complicated. To a lot of Westerners it suggests weddings, but for us it\'s traditionally the colour of mourning, so you wouldn\'t turn up at someone\'s house at New Year dressed head to toe in white. That said, I think it\'s loosening up. Most people my age wear whatever they like, and nobody bats an eyelid — it\'s really only my grandmother\'s generation who\'d say anything.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời thẳng ("Oh, definitely") rồi đưa HAI màu theo hai hướng: đỏ = may (ba ví dụ dồn nhanh: bao lì xì, đồ trang trí, trái cây trên bàn thờ) → trắng = phức tạp hơn (so với phương Tây) → một ghi chú về thay đổi theo thế hệ ("That said, I think it\'s loosening up"). Khoảng 35–40 giây; chỗ ngắt là ngắt để CHỌN Ý, không phải tìm từ — đúng mô tả band 8 (Tập 5 Ngày 2).',
        '**LR (từ vựng)**: "bring good fortune", "the colour of mourning" (màu tang), "turn up at someone\'s house", "dressed head to toe in white" (từ đầu tới chân), "loosening up" (bớt khắt khe), "nobody bats an eyelid" (không ai bận tâm — idiom duy nhất, đúng register nói; Tập 5 Ngày 3, Ngày 11). Từ nối văn nói: "Oh, definitely", "That said", "it\'s really only…".',
        '**GRA (ngữ pháp)**: rút gọn tự nhiên "Red\'s the obvious one", "White\'s more complicated"; bị động "it\'s meant to bring…", "(are) thought to be"; "would" giả định cho chuẩn mực "you wouldn\'t turn up…", "who\'d say anything"; mệnh đề quan hệ rút gọn "the fruit people choose for the altar"; câu chẻ "it\'s really only my grandmother\'s generation who\'d say anything"; cụm phân từ "dressed head to toe in white".',
        '**P (phát âm)**: nhấn tương phản hai màu "RED\'s the obvious one… WHITE\'s more complicated"; "mourning" /ˈmɔːnɪŋ/ (đọc như "morning" trong Anh–Anh), "envelopes" /ˈenvələʊps/ nhấn âm đầu, "decorations" /ˌdekəˈreɪʃnz/ nhấn âm ba, "traditionally" /trəˈdɪʃənəli/ nhấn âm hai; nối âm "turn‿up‿at", "head to toe‿in white", "bats‿an‿eyelid"; giọng xuống ở "…dressed head to toe in white." rồi lên nhẹ ở "That said,".',
        '**Muốn lên band 9**: thêm một chi tiết rất riêng ("my mum still won\'t let me give anyone a white flower") và một câu khái quát có hedging ("I suppose colours only mean what a community agrees they mean, which is why the meanings can fade so fast").',
      ],
    },
    {
      part: 2,
      cau: 'Describe a tradition in your family or community that you hope will continue.',
      band: 'Band 8.0–8.5',
      s: 'The tradition I\'d like to talk about is a very ordinary one where I come from, but it matters a great deal to me. Every year, on the anniversary of my great-grandfather\'s death, the whole of my father\'s side of the family goes back to my grandparents\' house in the countryside for a memorial meal.\n\nIt falls in the third lunar month, so the date moves around, and someone will always ring round a few weeks beforehand to make sure nobody\'s forgotten. On the day itself, my aunts take over the kitchen from about five in the morning. By the time I get there, the house smells of incense and fried shallots, and there\'s that steady knocking of knives on chopping boards. The food is laid out on the altar first; my grandfather lights the incense and says a few words, and only when the sticks have burned down do we carry everything to the mats on the floor and eat.\n\nThere are usually forty or so of us, from my grandmother, who\'s nearly ninety, down to cousins\' babies I\'ve never met. And to be honest, as a teenager I found the whole thing a bit of a chore — three hours on a bus, and then every uncle asking about my marks. It\'s only since I moved to the city for university that I\'ve seen what it\'s for. None of us ever met my great-grandfather. The man himself is almost beside the point. What the day really does is put all of us in the same room once a year, and I honestly doubt some of my cousins and I would know each other otherwise.\n\nThat\'s why I hope it carries on. Fewer of us have been able to come in recent years, and I do worry about what happens when my grandparents are gone. If it stopped, I don\'t think anything would replace it — a group chat certainly wouldn\'t. So I\'ve told my father that when it\'s our generation\'s turn, I\'ll be the one ringing round.',
      phanTich: [
        '**FC**: đủ 4 ý theo thứ tự thẻ (là gì → khi nào, diễn ra thế nào → ai tham gia → vì sao mong giữ), nhưng không đánh số; chuyển ý bằng chính nội dung: "It falls in…", "On the day itself…", "There are usually forty or so of us…", "That\'s why I hope it carries on." Có một ĐIỂM XOAY trung thực (hồi nhỏ thấy phiền → giờ hiểu nó để làm gì) nên ý "why" có chiều sâu chứ không phải lời ca ngợi. Câu kết quay lại chi tiết "ringing round" ở đầu — khép vòng tự nhiên, không cần "That\'s all".',
        '**LR**: "the anniversary of my great-grandfather\'s death", "a memorial meal", "ring round" (gọi điện báo khắp lượt), "take over the kitchen", "incense", "fried shallots", "chopping boards", "the altar", "a bit of a chore" (việc phải làm cho xong), "beside the point" (không còn là điều chính), "carries on". Chi tiết cảm quan (mùi hương, tiếng dao thớt) đúng bài Tập 5 Ngày 7. Từ ước lượng văn nói: "forty or so", "a few weeks beforehand". Không lặp "tradition": dùng "the whole thing", "the day", "it".',
        '**GRA**: "will" chỉ thói quen "someone will always ring round"; mệnh đề thời gian "By the time I get there, the house smells of…"; ĐẢO NGỮ dùng đúng một lần, đúng chỗ nhấn: "only when the sticks have burned down do we carry everything…" (Tập 5 Ngày 13); mệnh đề quan hệ không xác định "my grandmother, who\'s nearly ninety"; câu chẻ "It\'s only since I moved… that I\'ve seen what it\'s for" và "What the day really does is put all of us in the same room"; điều kiện loại 2 "If it stopped, I don\'t think anything would replace it"; ellipsis (Tập 5 Ngày 11) "a group chat certainly wouldn\'t [replace it]".',
        '**P**: giọng kể — chậm lại và hạ giọng ở cảnh bàn thờ ("my grandfather lights the incense / and says a few words"), nhanh và nhẹ hơn ở đoạn tự giễu ("three hours on a bus, / and then every uncle asking about my marks"); trọng âm "anniversary" /ˌænɪˈvɜːsəri/ âm ba, "memorial" /məˈmɔːriəl/ âm hai, "incense" /ˈɪnsens/ âm đầu, "shallots" /ʃəˈlɒts/ âm hai, "altar" /ˈɔːltə/ (đọc như "alter"); nối âm "laid‿out‿on the altar", "burned down"; nhấn tương phản "NONE of us ever met him… what the day really does is put ALL of us in the same room".',
        '**Muốn lên band 9**: thêm một câu nói nguyên văn của một người ("My grandmother always says a family that eats together stays together — in Vietnamese it rhymes") và một nhận xét khái quát có hedging ("I suspect most traditions survive not because of what they commemorate but because of who they bring together").',
      ],
    },
    {
      part: 3,
      cau: 'Why do some traditions survive for centuries while others die out within a generation?',
      band: 'Band 8.0–8.5',
      s: 'I think it mostly comes down to whether a tradition still does a job for the people who keep it. The ones that last tend to be tied to something people need anyway — getting the family together, marking the end of the harvest, giving everyone an excuse for a holiday. Even when the original meaning fades, the function is still there, so the custom carries on, sometimes in a slightly different form. The ones that vanish are often those that depended on a way of life that\'s gone. A lot of village crafts and work songs, for instance, disappeared not because anyone decided to abandon them, but simply because the work they went with was mechanised. There\'s also a question of cost, I suppose. If a tradition asks a lot — days off work, a long journey, a great deal of money — it\'s vulnerable the moment people\'s lives get busier. So it\'s less about how old or how beautiful a tradition is than about how well it fits the life people actually lead.',
      phanTich: [
        '**FC**: câu hỏi NGUYÊN NHÂN có hai vế (survive ↔ die out) ⇒ nêu MỘT tiêu chí ngay câu đầu ("whether a tradition still does a job for the people who keep it") rồi áp cho từng vế: truyền thống còn sống (gắn với nhu cầu, ba ví dụ dồn) → truyền thống mất (lối sống đã đổi, ví dụ nghề làng + hò lao động) → thêm một yếu tố ("There\'s also a question of cost") → câu kết khái quát đối lập ("less about… than about…"). Lập luận chuỗi, không lặp câu hỏi — band 8 (Tập 5 Ngày 13).',
        '**LR**: "comes down to" (rốt cuộc là do), "does a job for", "tied to", "marking the end of the harvest", "an excuse for a holiday", "the original meaning fades", "carries on", "vanish", "depended on a way of life", "village crafts", "mechanised", "vulnerable", "fits the life people actually lead". Paraphrase câu hỏi liên tục (Tập 5 Ngày 22): survive → last / carries on; die out → vanish / disappeared.',
        '**GRA**: mệnh đề danh ngữ sau giới từ "comes down to whether…"; mệnh đề quan hệ rút gọn / không rút gọn xen kẽ "The ones that last", "the work they went with"; "not because… but simply because…"; bị động "was mechanised"; nhượng bộ "Even when the original meaning fades"; "the moment + mệnh đề" (ngay khi); so sánh kép ở câu kết "less about how old… than about how well it fits…". Hedging: "I think it mostly", "tend to", "often", "I suppose".',
        '**P**: ngắt nhóm ý trước ví dụ dồn và đọc ba ví dụ với ngữ điệu liệt kê (lên – lên – xuống): "getting the family together, ↗ / marking the end of the harvest, ↗ / giving everyone an excuse for a holiday. ↘"; nhấn tương phản "the ones that LAST… the ones that VANISH"; trọng âm "generation" /ˌdʒenəˈreɪʃn/ âm ba, "mechanised" /ˈmekənaɪzd/ âm đầu (ch đọc /k/), "vulnerable" /ˈvʌlnərəbl/ âm đầu, "original" /əˈrɪdʒənl/ âm hai.',
        '**Muốn lên band 9**: thêm một phản ví dụ để tự thử tiêu chí của mình ("Admittedly, some traditions survive precisely because they\'re inconvenient — the effort is part of the point") rồi dung hoà nó trong một câu.',
      ],
    },
    {
      part: 3,
      cau: 'Is it ever right to give up a tradition that some people still value?',
      band: 'Band 8.0–8.5',
      s: 'Yes, I think it can be, though the bar ought to be high. The fact that people are attached to something isn\'t, on its own, a reason to keep it — plenty of customs that harmed people had devoted supporters right up to the end. So the test I\'d apply is whether the tradition does real damage to someone who has no say in it. If it puts animals through suffering, say, or shuts girls out of school, then the feelings of those who love it don\'t outweigh that, and it should go, or at least change. Where I\'d be much more cautious is when the only objection is that a custom looks old-fashioned or gets in the way of efficiency. That isn\'t harm; it\'s just impatience. And in practice, the choice is rarely between keeping a tradition exactly as it is and scrapping it. Most of the ones worth having have been quietly adapted many times already, so I\'d always look for a way of keeping the heart of it before I gave it up altogether.',
      phanTich: [
        '**FC**: câu hỏi ĐẠO ĐỨC "Is it ever right…?" ⇒ lập trường có mức độ ngay câu đầu ("Yes… though the bar ought to be high") → bác một lý lẽ phổ biến (gắn bó chưa phải là lý do) → nêu PHÉP THỬ ("whether the tradition does real damage to someone who has no say in it") + hai ví dụ → trường hợp ngược lại cần thận trọng ("Where I\'d be much more cautious is…") → vượt khỏi lối nhị phân của câu hỏi (giữ nguyên ↔ bỏ hẳn) bằng ý "điều chỉnh". Nhượng bộ – phản bác – điều kiện: đúng khung Tập 5 Ngày 6 và Ngày 23.',
        '**LR**: "the bar ought to be high" (chuẩn phải cao), "attached to", "devoted supporters", "has no say in it" (không có tiếng nói), "puts animals through suffering", "shuts girls out of school", "outweigh", "gets in the way of efficiency", "impatience", "scrapping it" (bỏ hẳn — văn nói), "quietly adapted", "the heart of it". Từ trừu tượng dùng đúng, không khoa trương.',
        '**GRA**: nhượng bộ rút gọn "though the bar ought to be high"; chủ ngữ là cả một mệnh đề "The fact that people are attached to something isn\'t, on its own, a reason…"; mệnh đề danh ngữ "whether the tradition does real damage…"; điều kiện có chen "say" (= chẳng hạn) "If it puts animals through suffering, say, or…"; câu chẻ "Where I\'d be much more cautious is when…"; quá khứ giả định sau "before" trong câu "would" ("before I gave it up altogether" — Tập 5 Ngày 19); hiện tại hoàn thành bị động "have been quietly adapted".',
        '**P**: nhấn tương phản là chìa khoá của câu trả lời này: "That isn\'t HARM; / it\'s just imPATience." và "between KEEPING a tradition exactly as it is / and SCRAPPING it"; ngắt trước "say" và hạ giọng ở phần chen; trọng âm "efficiency" /ɪˈfɪʃnsi/ âm hai, "impatience" /ɪmˈpeɪʃns/ âm hai, "cautious" /ˈkɔːʃəs/ âm đầu, "altogether" /ˌɔːltəˈɡeðə/ âm ba; âm yếu "ought to be" /ˈɔːtə bi/.',
        '**Muốn lên band 9**: thêm câu hỏi "ai có quyền quyết định" ("The harder question is who gets to decide — outsiders rarely persuade a community, so change that comes from within tends to last") — mở thêm một tầng mà giám khảo có thể hỏi tiếp.',
      ],
    },
  ],
};
