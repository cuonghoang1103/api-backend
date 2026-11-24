/**
 * Đề 9 — Listening, TẬP 5 · NGÀY 8 (docs/ielts-lo-trinh-0-8.md mục 4.2: "tốc độ thật, giọng trộn"). TỰ SOẠN 24/11/2026.
 * Mức band 7.0–7.5 — đề ĐẦU của Tập 5: ~165 từ/phút (mục 4.2: Đề 7–9), lời thoại dày hơn Đề 8, người nói ngắt lời và sửa nhau như
 * hội thoại thật; gần như MỌI đáp án đứng sau ít nhất một phương án bị bác ("People tend to assume… But that's not what was behind
 * it"), paraphrase mức 4 (phương án không trùng chữ với lời nói: "eaten away" = worn away; "you can't generalise" = too few replies),
 * Part 3 ba người nói ba giọng, Part 4 bài giảng ~900 từ không có đoạn nghỉ giữa.
 * Bối cảnh (mục 4.2 không ấn định — tự chọn, KHÔNG trùng Đề 0–8 và bài nghe Tập 3–4; đã grep 24/11: kennel, allotment, weir,
 * citizen science, Galaxy Zoo = 0 kết quả): gửi chó ở trại trông thú · buổi đón thành viên mới của khu vườn thuê (allotments) ·
 * hai sinh viên địa lý + giảng viên bàn báo cáo thực địa sau khi dỡ một đập tràn · bài giảng "khoa học công dân".
 * GIỌNG TRỘN (T5 N1 "Part 1 tốc độ thật, giọng trộn"; T5 N4 "Part 2+3, nhiều người nói"; T5 N5 "Part 4 chuyên sâu"): Part 1 khách
 * Canada gốc Quebec (`ca-nam`) + nhân viên Anh (`uk-nu`) · Part 2 Úc (`au-nam`) · Part 3 sinh viên Mỹ (`us-nu`) + sinh viên Anh
 * (`uk-nam`) + giảng viên Ireland (`ie-nu`) · Part 4 New Zealand (`nz-nam`) ⇒ 7 giọng.
 *   Part 1: Form + Note completion · Part 2: MCQ + Matching (tiện ích của khu vườn) · Part 3: MCQ + chọn TWO + Flow-chart ·
 *   Part 4: Note + Sentence completion.
 * Bẫy chính: Thibault (đánh vần, chữ H câm + AULT); tám tuổi (vợ đoán) → sáu (sổ thú y); bay ngày 18 → gửi ngày 17; standard /
 * deluxe → garden; £24 / £29 → £26 (giá ở dài); hai tuần → 12 tháng; giường, bát, đồ chơi → blanket; hộp chia thuốc → original box;
 * bath → grooming; ảnh mỗi ngày → video; giảm danh sách chờ / hội đồng yêu cầu → ô lớn bị bỏ hoang; dọn cả ô / buổi tập huấn → một
 * phần tư; cấm hẳn / buổi tối bất kỳ → chỉ tháng 11–2; rau xà lách / dâu → khoai tây; gọi điện / sổ sự cố → nhóm trực tuyến; nhà kho
 * "không mất tiền" + đặt cọc → cần chìa khoá; quầy bán "do tình nguyện viên" → chỉ cuối tuần; máy xới "miễn phí" → phải ghi tên;
 * lớn lên gần đó / báo đưa tin → có dữ liệu trước khi dỡ đập; sỏi trở lại / cá tăng → bờ hạ lưu bị xói; câu hỏi dẫn dắt / làm trực
 * tuyến → 19 phiếu quá ít; drone / ảnh khác mùa → hai mặt cắt; đo thêm / gặp lại tổ chức / thêm tài liệu → viết hạn chế + cắt phần
 * nền; ruler / length → width; scale card → coin; trò chơi → contribution; developers / farmers → collectors.
 * Dữ kiện Part 4 — kiến thức phổ thông, soạn theo trí nhớ, CHƯA đối chiếu lại nguồn trong phiên này: Christmas Bird Count do Frank
 * Chapman đề xuất năm 1900 thay cho cuộc săn chim ngày Giáng sinh, 27 người tham gia năm đầu; Galaxy Zoo mở tháng 7/2007 (Oxford,
 * khoảng một triệu thiên hà của Sloan Digital Sky Survey; một nghiên cứu sinh tự phân loại 50.000 ảnh trong một tuần; trong 24 giờ
 * đầu khoảng 70.000 lượt phân loại mỗi giờ); Hanny van Arkel, giáo viên Hà Lan, phát hiện "Hanny's Voorwerp" (đám khí được chiếu
 * sáng bởi một quasar đã tắt). Chuyện cây lan bị đào sau khi lộ vị trí là ví dụ MINH HOẠ (hiện tượng có thật, chi tiết không gắn
 * với một vụ cụ thể). Hollybank Kennels, Fernhill Allotments, đập Millbrook, Dr Brennan và mọi nhân vật Part 1–3 đều HƯ CẤU.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong lời thoại + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeNghe } from './types';

export const NGHE_DE9: DeNghe = {
  id: 'nghe-de9',
  kyNang: 'nghe',
  ten: 'Listening — Đề 9 (Tập 5 · Ngày 8)',
  boDe: 'Đề 9',
  capDo: 'Band 7.0 → 7.5',
  moTa: 'Booking a dog into boarding kennels (Canadian + UK) · Welcome talk for new allotment holders (Australian speaker) · Two students and their tutor discuss a river fieldwork report (US + UK + Irish) · Lecture on citizen science (New Zealand speaker)',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — gửi chó ở trại trông thú ════════════════ */
    {
      so: 1,
      tieuDe: 'Hollybank Kennels — booking enquiry',
      dan: 'Part 1. You will hear a man telephoning a boarding kennels to arrange for his dog to stay there while he is on holiday. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Marc (người Canada gốc Quebec, sống ở Anh) gọi tới Hollybank Kennels — nơi trông chó khi chủ đi vắng — để gửi con chó Juno trong kỳ nghỉ tháng Bảy; nhân viên Alison nói giọng Anh. Giọng Canada: "about" nghe gần "a-boat", "sure" /ʃɜːr/, chữ "t" giữa hai nguyên âm thành /d/ ("better" → "bedder"), gọi sân sau là "yard", mũi tiêm là "shots". Tốc độ thật: hai người không chờ nhau nói hết câu, con số đúng thường là con số THỨ BA.',
      docTruoc: 30,
      loi: [
        { ai: 'Alison', giong: 'uk-nu', s: `Hollybank Kennels, Alison speaking.` },
        { ai: 'Marc', giong: 'ca-nam', s: `Oh, hi there. I'm calling to see if you've got space for a dog in July. We're going to be away for a couple of weeks, and a neighbour of ours recommended you.` },
        { ai: 'Alison', giong: 'uk-nu', s: `July's busy, but let me take your details and we'll see. Can I start with your surname?` },
        { ai: 'Marc', giong: 'ca-nam', s: `Sure, it's Thibault. That's T, H, I, B, A, U, L, T.` },
        { ai: 'Alison', giong: 'uk-nu', s: `T, H, I, B, A, U, L, T. Is that a French name?` },
        { ai: 'Marc', giong: 'ca-nam', s: `French-Canadian, yeah. My family's from Quebec, although I've been over here nine years now. Nobody ever spells it right, so don't worry.` },
        { ai: 'Alison', giong: 'uk-nu', s: `I think I've got it. And the dog's name?` },
        { ai: 'Marc', giong: 'ca-nam', s: `Juno. J, U, N, O. She's a collie cross.` },
        { ai: 'Alison', giong: 'uk-nu', s: `Lovely. And how old is Juno?` },
        { ai: 'Marc', giong: 'ca-nam', s: `Well, that's a good question. She was a rescue, so nobody really knows. My wife's convinced she's about eight, because she's getting a bit grey around the face. But the vet's records say six, so I guess that's the official figure.` },
        { ai: 'Alison', giong: 'uk-nu', s: `We go by the vet's records, so I'll put six. Now, which dates were you thinking of?` },
        { ai: 'Marc', giong: 'ca-nam', s: `We fly out on Saturday the eighteenth of July, but it's a seven a.m. flight, so there's no way I can bring her that morning. Could I drop her off the day before?` },
        { ai: 'Alison', giong: 'uk-nu', s: `Friday the seventeenth. Yes, that's fine. Arrivals are between two and four in the afternoon. And when are you back?` },
        { ai: 'Marc', giong: 'ca-nam', s: `We land on the Sunday, the second of August, so I could pick her up that day, or on the Monday if you're closed.` },
        { ai: 'Alison', giong: 'uk-nu', s: `No, we're open on Sunday mornings. So that's sixteen nights. Now, we have three kinds of kennel. The standard ones are indoors, and the dogs go out to the exercise field twice a day. Then there are the garden kennels, which each have their own little outdoor run, so the dog can go in and out as she likes. And there are two deluxe rooms, which are heated and have a sofa and a radio, believe it or not.` },
        { ai: 'Marc', giong: 'ca-nam', s: `A radio! No, I don't think Juno needs heating in July, or a sofa. But she hates being shut in. At home she's in and out of the yard all day. So I think the garden one would suit her.` },
        { ai: 'Alison', giong: 'uk-nu', s: `The garden kennel. Good choice. Now, the prices. The standard is twenty-four pounds a night, and the garden kennel is normally twenty-nine.` },
        { ai: 'Marc', giong: 'ca-nam', s: `OK. Twenty-nine times sixteen. That adds up.` },
        { ai: 'Alison', giong: 'uk-nu', s: `It does, but because you're staying more than fourteen nights, you get our long-stay rate, which for the garden kennel is £26 a night.` },
        { ai: 'Marc', giong: 'ca-nam', s: `Twenty-six. That's better. I'll take that.` },
        { ai: 'Alison', giong: 'uk-nu', s: `Now, vaccinations. Is Juno up to date?` },
        { ai: 'Marc', giong: 'ca-nam', s: `She had all her regular shots in the spring. Is there anything else she needs?` },
        { ai: 'Alison', giong: 'uk-nu', s: `The important one for us is kennel cough, which isn't always included. She must have had it within the past twelve months, and, this is what catches people out, not less than two weeks before she arrives, because it takes a while to work.` },
        { ai: 'Marc', giong: 'ca-nam', s: `Right. I'm fairly sure she hasn't had that one, so I'll call the vet today. Two weeks before, at the latest.` },
        { ai: 'Alison', giong: 'uk-nu', s: `Exactly. And bring the certificate with you when you come.` },
        { ai: 'Marc', giong: 'ca-nam', s: `Will do. And what should I bring for her? Her bed, her bowls?` },
        { ai: 'Alison', giong: 'uk-nu', s: `No need for either. We provide beds and bowls, and we wash them every day, so we'd actually rather you didn't. What we do suggest is a blanket from home. Something that smells familiar helps them settle on the first night.` },
        { ai: 'Marc', giong: 'ca-nam', s: `A blanket. Easy. What about toys? She has a rubber ball she's crazy about.` },
        { ai: 'Alison', giong: 'uk-nu', s: `I'd leave toys at home, honestly. They get chewed, or they end up in the wrong kennel, and then we have a very upset owner.` },
        { ai: 'Marc', giong: 'ca-nam', s: `Fair enough. Now, she's on tablets for her joints, one a day. I was going to count them out into one of those plastic organisers with the days of the week on.` },
        { ai: 'Alison', giong: 'uk-nu', s: `I'm afraid we can't accept them like that. Any medication has to come in the original box, with the vet's label on it, so that our staff can check the dose.` },
        { ai: 'Marc', giong: 'ca-nam', s: `The original box. OK. Now, when we collect her, she's going to smell of kennel, I guess. Could you give her a bath on the last day?` },
        { ai: 'Alison', giong: 'uk-nu', s: `We don't do a bath by itself, but you can book her in for grooming on her last morning. That's a wash, a brush and her nails trimmed, for fifteen pounds.` },
        { ai: 'Marc', giong: 'ca-nam', s: `Go on, then, put her down for the grooming. My wife will thank you. One last thing. Will we hear how she's doing? My daughter's going to worry.` },
        { ai: 'Alison', giong: 'uk-nu', s: `Of course. Some kennels send a photo every day, but we found that people just got a picture of a dog asleep. So what we do is send a short video every three days, by text, and there's no charge for it.` },
        { ai: 'Marc', giong: 'ca-nam', s: `A video every three days. She'll love that. Great, let's go ahead and book.` },
      ],
      nhom: [
        {
          id: 'n1-form', tu: 1, den: 6, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Hollybank Kennels — Booking Form',
          dong: [
            'Owner\'s surname: [[1]]',
            'Dog: Juno (collie cross) — age on vet\'s records: [[2]]',
            'Arrival: Friday [[3]] July, 2–4 p.m. · Collection: Sunday 2 August',
            'Type of kennel: [[4]] kennel',
            'Price per night: £[[5]]',
            'Kennel cough vaccine: given within the past [[6]] months (and at least two weeks before arrival)',
          ],
        },
        {
          id: 'n1-note', tu: 7, den: 10, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Notes for the owner',
          dong: [
            '• Bring: a [[7]] from home (beds and bowls are provided)',
            '• Medication: must be in its original [[8]], with the vet\'s label',
            '• Last morning: [[9]] booked (£15)',
            '• Updates: a [[10]] will be sent every three days',
          ],
        },
      ],
    },

    /* ════════════════ PART 2 — đón thành viên mới của khu vườn thuê ════════════════ */
    {
      so: 2,
      tieuDe: 'Fernhill Allotments — welcome talk for new members',
      dan: 'Part 2. You will hear the secretary of an allotment association talking to a group of new members. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Greg (giọng Úc), thư ký của hội Fernhill Allotments — khu đất chia thành nhiều ô nhỏ cho người dân thuê trồng rau — nói chuyện với 14 thành viên mới trước khi dẫn họ đi xem ô đất. Nửa đầu: quy định (5 câu trắc nghiệm); nửa sau: năm tiện ích dùng chung (nối). Giọng Úc: "day" nghe gần "die", "no" kéo dài, hay nuốt âm cuối. Mỗi câu trắc nghiệm đều có MỘT phương án "đúng là có thật" nhưng không phải lý do / quy định chính.',
      docTruoc: 30,
      loi: [
        { ai: 'Greg', giong: 'au-nam', s: `Right, good morning everyone, and welcome to Fernhill Allotments. I'm Greg, the site secretary, and I'll take about ten minutes to tell you how the place works before we walk round. There are fourteen of you starting this spring, which is the biggest group of new members we've ever had.` },
        { ai: 'Greg', giong: 'au-nam', s: `One reason there are so many of you is that last year we cut most of the full-sized plots in two. People tend to assume we did that to bring the waiting list down, and it has helped, there's no denying it. The council would probably have asked us to do it sooner or later as well. But that's not what was behind it. A full plot is two hundred and fifty square metres, and for somebody with a job and a family, that's simply too much. Every summer we had a dozen of them disappearing under weeds, and the people on either side were fed up. A half plot is something you can actually keep on top of.` },
        { ai: 'Greg', giong: 'au-nam', s: `Now, what do we expect from you? Don't panic when you see your plot this morning. Some of them haven't been touched for two years, and nobody's asking you to clear the whole thing by June. The rule is that by your three-month inspection, a quarter of the plot should have something growing in it. That's all. We do run a beginners' session on the first Sunday of every month, and I'd recommend it, but whether you come is entirely up to you.` },
        { ai: 'Greg', giong: 'au-nam', s: `A word about bonfires, because they cause more arguments than anything else. A few years back you could light one any evening you liked, and the houses on Mill Lane complained, quite rightly. The committee came very close to banning fires altogether. What we settled on in the end is this: fires are allowed from the start of November to the end of February, and at no other time. In those months you can burn on any day of the week, as long as it's dry material and you stay with it.` },
        { ai: 'Greg', giong: 'au-nam', s: `People always ask me what to plant first. Everyone wants to begin with salad, lettuce and so on, because it's quick. Well, on this site the slugs will have it before you do. Others dream of raspberries and strawberries, and you should grow them eventually, but you'll wait a couple of years for a decent crop. My advice is boring: put in potatoes. They break up the ground for you, they more or less look after themselves, and it's very hard to get them wrong. Once you've had one good harvest, you'll have the confidence to try the rest.` },
        { ai: 'Greg', giong: 'au-nam', s: `And if something goes wrong, say you find your shed's been broken into, or there's a tap left running. Please don't ring me, because I'm at work all day and I won't pick up. There's still an incident book in the trading hut, but nobody opens it until Saturday. The quickest way by far is to put a message in the members' online group. Someone on the committee will see it within the hour.` },
        { ai: 'Greg', giong: 'au-nam', s: `OK, let me run through the facilities, because several things have changed this year.` },
        { ai: 'Greg', giong: 'au-nam', s: `First, the tool shed, the green one by the main gate. It's full of spades, forks and wheelbarrows that anyone can borrow, and there's nothing to pay. It used to be left open, but after we lost three wheelbarrows in one winter, it's now locked. So before you can use it, you'll need to get a key from me, and I ask for a ten-pound deposit, which you get back when you leave.` },
        { ai: 'Greg', giong: 'au-nam', s: `The water tanks. There are four big tanks along the central path, filled from a borehole. Unfortunately the pump packed up a fortnight ago, and the part won't arrive until the end of the month. So for now the tanks are empty and you can't use them, I'm sorry to say. In the meantime there's a mains tap by the gate, but go easy on it, because we pay for that water.` },
        { ai: 'Greg', giong: 'au-nam', s: `The compost bays. If you came to the open day last autumn, you'll remember them just inside the gate, on the left. They're not there any more. We had complaints about the smell from the houses, so over the winter we rebuilt them at the far end of the site, behind the orchard. It's a longer walk with a wheelbarrow, but it keeps the peace.` },
        { ai: 'Greg', giong: 'au-nam', s: `Then there's the trading hut, where you can buy seeds, compost and canes at about half the price of a garden centre. It's run entirely by volunteers, and no, I'm not asking any of you to volunteer in your first year. Because of that, it's only open on Saturday and Sunday mornings, nine till twelve. Don't turn up on a Wednesday and expect to find anyone.` },
        { ai: 'Greg', giong: 'au-nam', s: `Lastly, the rotavator, which is a petrol machine for digging over rough ground, and believe me, you'll want it. There's only one, and it's very popular in spring. You don't pay anything, and we supply the fuel, but you do have to write your name on the sheet on the noticeboard beforehand, and you can have it for one day at a time. If your name's not on the sheet, you don't get it. It's as simple as that.` },
        { ai: 'Greg', giong: 'au-nam', s: `Right. Let's go and find your plots.` },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 15, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'Why did the association divide most of its full-sized plots?', chon: [{ k: 'A', t: 'The waiting list had become too long.' }, { k: 'B', t: 'Many of the larger plots were not being looked after.' }, { k: 'C', t: 'The council had told the association to create more plots.' }] },
            { n: 12, s: 'What must new members do during their first three months?', chon: [{ k: 'A', t: 'bring part of their plot into use' }, { k: 'B', t: 'remove all the weeds from their plot' }, { k: 'C', t: 'attend a session for beginners' }] },
            { n: 13, s: 'What is the association\'s current rule about bonfires?', chon: [{ k: 'A', t: 'They are not allowed at any time.' }, { k: 'B', t: 'They may be lit on any evening.' }, { k: 'C', t: 'They are permitted only during part of the year.' }] },
            { n: 14, s: 'What does the speaker advise beginners to grow first?', chon: [{ k: 'A', t: 'potatoes' }, { k: 'B', t: 'salad leaves' }, { k: 'C', t: 'soft fruit' }] },
            { n: 15, s: 'How should members report a problem on the site?', chon: [{ k: 'A', t: 'by telephoning the secretary' }, { k: 'B', t: 'by writing in a book in the trading hut' }, { k: 'C', t: 'by posting in the members\' online group' }] },
          ],
        },
        {
          id: 'n2-match', tu: 16, den: 20, dang: 'match-feature',
          huongDan: 'What does the speaker say about each of the following facilities?\nChoose **FIVE** answers from the box and write the correct letter, **A–G**, next to Questions 16–20.',
          hop: {
            tieuDe: 'Information',
            ds: [
              { k: 'A', t: 'It cannot be used at present.' },
              { k: 'B', t: 'Members need to obtain a key for it.' },
              { k: 'C', t: 'It is available only at weekends.' },
              { k: 'D', t: 'Members have to put their name down in advance.' },
              { k: 'E', t: 'It is in a different place from before.' },
              { k: 'F', t: 'There is a charge each time it is used.' },
              { k: 'G', t: 'New members are expected to help run it.' },
            ],
          },
          cau: [
            { n: 16, s: 'Tool shed' },
            { n: 17, s: 'Water tanks' },
            { n: 18, s: 'Compost bays' },
            { n: 19, s: 'Trading hut' },
            { n: 20, s: 'Rotavator' },
          ],
        },
      ],
    },

    /* ════════════════ PART 3 — báo cáo thực địa sau khi dỡ đập tràn ════════════════ */
    {
      so: 3,
      tieuDe: 'Discussing a river fieldwork report',
      dan: 'Part 3. You will hear two geography students, Priya and Callum, discussing the draft of their fieldwork report with their tutor, Dr Brennan. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Priya (giọng Mỹ) và Callum (giọng Anh), sinh viên địa lý, gặp giảng viên hướng dẫn Dr Brennan (nữ, giọng Ireland) để bàn bản nháp báo cáo thực địa về một con sông hai năm sau khi người ta DỠ đập tràn Millbrook (weir = đập thấp chắn ngang sông). Ba người, ba giọng: nhận ra AI nói là một nửa bài — câu hỏi 23 hỏi ý của Dr Brennan chứ không phải nỗi lo của Priya; câu 24 Callum đề xuất hai cách và cả hai đều bị bác. Cuối bài hai sinh viên kể lại quy trình khảo sát đáy sông (lưu đồ).',
      docTruoc: 40,
      loi: [
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Come in, Priya, Callum. I've had a look at the draft of the river report. Before we get into it, remind me how you ended up with the Millbrook weir. There must be a dozen rivers closer to campus.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Well, I grew up about ten minutes from it, so I knew the place, but honestly that's not why we picked it.` },
        { ai: 'Priya', giong: 'us-nu', s: `No. What decided it was the data. The rivers trust had been surveying that stretch for three years before the weir came out, so we had something to compare our results with. Most removal projects don't have that.` },
        { ai: 'Callum', giong: 'uk-nam', s: `And then it was all over the local news, which was nice, but we'd already chosen it by then.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Good. A proper baseline is rare, so make more of it in the introduction. Now, the results. Was there anything you didn't expect?` },
        { ai: 'Priya', giong: 'us-nu', s: `Not upstream. Everything we'd read said that once a weir goes, the mud gets washed away and the gravel bed comes back, and that's exactly what we found.` },
        { ai: 'Callum', giong: 'uk-nam', s: `And the fish numbers were up, which again is what the textbooks tell you. The thing that did take us by surprise was below the weir. There's a bend about two hundred metres down, and the bank there has been eaten away, quite badly. There's a footpath that's now about a metre from the edge.` },
        { ai: 'Priya', giong: 'us-nu', s: `We think it's all the sediment that was released, changing where the current runs. Nobody had predicted that.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Then that's your most interesting finding, and at the moment it's hidden on page nine. Bring it forward. Now, the questionnaire for local residents. Priya, you wrote in the margin that you were worried about it.` },
        { ai: 'Priya', giong: 'us-nu', s: `Yeah. I thought some of the questions were kind of leading. Like, "How has the river improved?" assumes that it has improved.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `I looked for that, and in fact I thought the wording was fair. You did offer "it has got worse" as a choice. My concern is different. How many replies did you get?` },
        { ai: 'Callum', giong: 'uk-nam', s: `Nineteen.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Nineteen. So when you write "most residents welcomed the change", you're talking about ten or eleven people. You simply can't generalise from that. Quote what they said, by all means, but don't turn it into percentages.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Should we have done it online? We might have reached more people.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Possibly, but that's not the issue now. Just be honest about the number. Next, the presentation. How are you going to show the audience what's happened to the channel?` },
        { ai: 'Callum', giong: 'uk-nam', s: `I'd love to use drone footage. You'd see the whole bend from above.` },
        { ai: 'Priya', giong: 'us-nu', s: `Callum, we've been through this. We don't have permission to fly there, and half the river's under trees anyway.` },
        { ai: 'Callum', giong: 'uk-nam', s: `OK, OK. Then the photographs. We've got a set from the trust and a set of our own.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Taken at the same time of year?` },
        { ai: 'Priya', giong: 'us-nu', s: `No, that's the trouble. Theirs are from August, when the river's low, and ours are from March. They look like two different rivers, and it has nothing to do with the weir.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Then I wouldn't rely on them. What about your own measurements?` },
        { ai: 'Priya', giong: 'us-nu', s: `We could draw two cross-sections of the channel at the bend, one from the trust's figures and one from ours, and put them side by side. You'd see straight away how much bank has gone.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `That's the one. Simple, and it's your own data. Now, what's left to do before you hand it in?` },
        { ai: 'Callum', giong: 'uk-nam', s: `I was wondering if we should go back and take another set of readings, so we've got two seasons.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `In an ideal world, yes. But the river's far too high at the moment, and you've got three weeks. Leave it. What I do want is a proper section on the weaknesses of your method. There isn't one, and examiners look for it.` },
        { ai: 'Priya', giong: 'us-nu', s: `OK. Should we talk to the trust again? The officer offered.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `You've got their full report, haven't you? I don't think another conversation would add much. And your reference list is fine, by the way, there's plenty there. The other thing is the background section. It's twelve hundred words out of four thousand. Cut it by half.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Ouch. All right.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Now, for the presentation you'll need one slide on how you surveyed the riverbed. Talk me through it as you'd tell the audience.` },
        { ai: 'Priya', giong: 'us-nu', s: `Sure. So first we choose a spot and stretch a tape across the river, from one bank to the other, fixed to a post on each side. That gives us our line.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Then one of us wades along it, and every half metre they reach down, without looking, and pick up whichever stone their finger touches first. A hundred stones for each line.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `And you measure them how?` },
        { ai: 'Callum', giong: 'uk-nam', s: `With a ruler, on the bank. The first day we got that wrong, actually. We were measuring the longest side of each stone, and it's not the length you want, it's the width, the middle dimension, because that's what decides whether the stone will go through a sieve.` },
        { ai: 'Priya', giong: 'us-nu', s: `So we had to do the first forty again. After that, we take a photograph of the bed at each point, looking straight down. You're supposed to put a scale card in the picture, but we left ours in the lab, so we used a coin instead. It works just as well.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Say that in the presentation. It's honest, and people remember it.` },
        { ai: 'Callum', giong: 'uk-nam', s: `And then back at the flat, everything gets typed into a spreadsheet, which works out the average size for each line, and we compare that with the trust's numbers.` },
        { ai: 'Dr Brennan', giong: 'ie-nu', s: `Good. Tape, stones, photograph, spreadsheet. Keep it to that, and don't read it off the slide.` },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 24, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'Why did the students choose the Millbrook weir for their project?', chon: [{ k: 'A', t: 'One of them was already familiar with the area.' }, { k: 'B', t: 'Information collected before the removal was available.' }, { k: 'C', t: 'The removal had attracted attention in the media.' }] },
            { n: 22, s: 'Which of their findings did the students not expect?', chon: [{ k: 'A', t: 'The riverbed above the weir had returned to gravel.' }, { k: 'B', t: 'The number of fish had risen.' }, { k: 'C', t: 'Part of the bank below the weir had been worn away.' }] },
            { n: 23, s: 'What is Dr Brennan\'s criticism of the residents\' questionnaire?', chon: [{ k: 'A', t: 'Too few people answered it to support general claims.' }, { k: 'B', t: 'Some questions pushed people towards a particular answer.' }, { k: 'C', t: 'It ought to have been carried out online.' }] },
            { n: 24, s: 'How do they decide to show the change in the river channel in their presentation?', chon: [{ k: 'A', t: 'with film taken from the air' }, { k: 'B', t: 'with a pair of diagrams based on measurements' }, { k: 'C', t: 'with photographs taken before and after' }] },
          ],
        },
        {
          id: 'n3-mcq2', tu: 25, den: 26, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [25, 26],
            s: 'Which TWO things does Dr Brennan tell the students to do before they submit the report?',
            chon: [
              { k: 'A', t: 'take further measurements at the river' },
              { k: 'B', t: 'discuss the limitations of their method' },
              { k: 'C', t: 'speak to the rivers trust again' },
              { k: 'D', t: 'add more sources to the reference list' },
              { k: 'E', t: 'make the background section shorter' },
            ],
          },
        },
        {
          id: 'n3-flow', tu: 27, den: 30, dang: 'flow',
          huongDan: 'Complete the flow-chart below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'How the riverbed was surveyed',
          dong: [
            '→ a [[27]] is fixed across the river between two posts',
            '→ every half metre, a stone is picked up without looking (100 stones per line)',
            '→ the [[28]] of each stone is measured on the bank',
            '→ the riverbed is photographed from above, with a [[29]] included to show the scale',
            '→ all the figures are entered into a [[30]], which calculates the average size',
          ],
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng "khoa học công dân" ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture: citizen science',
      dan: 'Part 4. You will hear part of a lecture about citizen science, in which members of the public help to carry out research. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Một giảng viên (giọng New Zealand) giảng về "citizen science" — nghiên cứu khoa học có người dân tham gia: cuộc đếm chim Giáng sinh (1900), dự án phân loại thiên hà Galaxy Zoo (2007), vì sao người ta tham gia, hai vấn đề (độ chính xác, độ lệch của dữ liệu), câu hỏi đạo đức và tương lai. Giọng New Zealand: /e/ nghe gần /ɪ/ ("ten" → "tin", "record" → "ricord"), /ɪ/ nghe gần /ə/ ("fish" → "fush"). Bài giảng ~5 phút, KHÔNG có đoạn nghỉ giữa: mười câu đi liền nhau, đọc trước cả hai nhóm câu hỏi.',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'nz-nam', s: `Good afternoon. Today's topic is what's usually called citizen science, meaning research in which some of the work is done by members of the public rather than by paid scientists. It's often presented as something new, a product of the internet. In fact, it's the paid scientist who is the recent invention. Until the late nineteenth century, almost everyone who studied nature did so in their spare time.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Let me begin with the example that's usually treated as the starting point of the modern movement. In North America in the eighteen hundreds, there was a popular tradition on Christmas Day in which teams of men went out with guns and competed to see who could kill the most birds. It was simply a hunt. In nineteen hundred, an ornithologist called Frank Chapman suggested that people might go out and count the birds instead. Twenty-seven people took part that first year. The Christmas Bird Count has been held every winter since, and tens of thousands now join in.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Chapman couldn't have known how valuable this would become. Because the count has been done in the same way for more than a century, researchers have been able to show that the winter ranges of many species have shifted steadily north, by hundreds of kilometres in some cases, as the climate has warmed. No professional survey has anything like that length of record.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `The second example is from two thousand and seven. A group of astronomers at Oxford had images of about a million galaxies from a survey telescope, and they needed each one sorted according to its shape, essentially whether it was a spiral or a smooth, rounded blob. Computers at that time were poor at this. One research student had done fifty thousand himself in a week and, understandably, didn't fancy doing the rest. So they put the images on a website, called it Galaxy Zoo, and asked for help. They thought it might take a few years. Within a day, they were receiving something like seventy thousand classifications an hour. And because every galaxy was looked at by dozens of people, the combined answer turned out to be as reliable as an expert's.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Something else happened that nobody had planned for. A Dutch teacher called Hanny van Arkel noticed a strange glowing patch beside one galaxy and asked on the forum what it was. Nobody knew. It proved to be a completely new kind of object, a cloud of gas lit up by a galaxy that has since gone dark, and it's still known by the Dutch name she gave it. A computer wouldn't have asked the question. That's the real strength of volunteers: not only that there are many of them, but that they're curious.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Why do people do it? You might guess it's because the websites are designed to feel like games. But when the volunteers were surveyed, the commonest answer by far was the wish to make a contribution to real research. Entertainment came a long way down the list.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Now, the problems. The obvious one is accuracy, and it's actually the easier one to deal with. Beginners do make mistakes, but if you train people, ask for a photograph, and have unusual records checked by an experienced reviewer, the error rate becomes very low.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `The harder problem is bias. Volunteers go where it's convenient and pleasant to go. So the records are concentrated near cities and along roads, they're made at weekends, and in good weather. People also report what excites them. Nobody bothers to record a sparrow, but everybody records an eagle. The result is that a map which claims to show where the birds are is partly a map of where the birdwatchers are.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `There are ways of correcting for this. The most useful has been to ask volunteers to report not just the highlights but everything they saw, and, crucially, to state how much time they spent looking. Once you know how long someone was out there, a record of nothing becomes informative: it tells you the bird probably wasn't there.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `There are ethical questions as well. These projects rely on millions of hours of unpaid work. Some researchers now list volunteers as authors on their papers. Critics reply that this is a small reward, and that universities are in effect treating the public as free labour, to do work for which they'd otherwise have to hire assistants. I have some sympathy with that view.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `A different kind of risk comes from openness itself. When a volunteer posted the exact position of a rare orchid on one platform, the plants had been dug up within days. The threat wasn't from developers or farmers, it was from collectors. Most platforms now automatically blur the location of sensitive species.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Finally, where is this heading? Software can now classify galaxies and identify birds from photographs remarkably well, and it learned to do so, of course, from the examples that volunteers had labelled. So is the volunteer no longer needed? I don't think so. The human role is moving towards the difficult cases, the ones the machine isn't sure about. And there's a benefit that has nothing to do with data. People who've taken part in research understand how uncertain and how careful it is, and I'd argue that this is one of the few things that reliably builds public trust in science.` },
        { ai: 'Lecturer', giong: 'nz-nam', s: `Next week, we'll look at how these projects are designed.` },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 36, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Citizen science',
          dong: [
            '## The Christmas Bird Count (from 1900)',
            '• proposed as an alternative to a traditional [[31]]',
            '• its long record shows that birds\' winter ranges have moved [[32]]',
            '## Galaxy Zoo (2007)',
            '• volunteers were asked to classify a million galaxies by [[33]]',
            '• a [[34]] from the Netherlands found a new type of object',
            '• survey: most volunteers want to make a [[35]] to research',
            '## Problems',
            '• accuracy: can be dealt with by training and checking',
            '• bias: most records are made near [[36]] and roads, at weekends, in good weather',
          ],
        },
        {
          id: 'n4-sentence', tu: 37, den: 40, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'To reduce bias, volunteers are asked to say how much [[37]] they spent on their observations.',
            'Critics claim that universities are using volunteers as free [[38]].',
            'The locations of some rare species are hidden because of the danger from [[39]].',
            'The lecturer believes that taking part in research increases people\'s [[40]] in science.',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['Thibault'], vi: `"it's Thibault. That's T, H, I, B, A, U, L, T." — Alison đọc lại từng chữ ⇒ **Thibault**. Tên gốc Pháp: nghe như "Tee-bo", chữ H và đuôi -AULT không phát âm ⇒ KHÔNG thể đoán chính tả, phải chép theo lần đánh vần (bạn có hai lần nghe). 📘 Ôn Part 1 tốc độ thật, giọng trộn: Tập 5 Ngày 1.`, ev: `Sure, it's Thibault. That's T, H, I, B, A, U, L, T.` },
    2: { a: ['6', 'six'], vi: `Hai con số: vợ Marc "convinced she's about eight"; "But the vet's records say six" — phiếu ghi "age on vet's records" và Alison chốt "I'll put six" ⇒ **6**. Bẫy: "eight" được nói TRƯỚC và kèm lý do nghe rất thuyết phục (lông mặt đã bạc).`, ev: `But the vet's records say six, so I guess that's the official figure.` },
    3: { a: ['17', '17th', 'seventeenth'], vi: `"We fly out on Saturday the eighteenth of July… Could I drop her off the day before?" — Alison: "Friday the seventeenth" ⇒ **17**. Phiếu in sẵn "Friday" ⇒ loại 18 (thứ Bảy). Bẫy: ngày bay là con số nghe ĐẦU TIÊN.`, ev: `Friday the seventeenth. Yes, that's fine.` },
    4: { a: ['garden'], vi: `Ba loại: standard (trong nhà), garden (có sân riêng), deluxe (có sưởi, sofa, radio). Marc bác deluxe ("I don't think Juno needs heating in July, or a sofa"), và vì Juno "hates being shut in" ⇒ "I think the garden one would suit her" ⇒ **garden**.`, ev: `So I think the garden one would suit her.` },
    5: { a: ['26'], vi: `Ba mức giá: £24 (standard) → £29 (garden, giá thường) → ở hơn 14 đêm được "long-stay rate, which for the garden kennel is £26 a night" ⇒ **26**. Marc còn nhẩm "Twenty-nine times sixteen" để gài bạn viết 29. 📘 Bẫy số chuỗi: Tập 4 Ngày 28; Tập 5 Ngày 15 sẽ luyện tiếp "số liệu đổi".`, ev: `you get our long-stay rate, which for the garden kennel is £26 a night` },
    6: { a: ['12', 'twelve'], vi: `"She must have had it within the past twelve months, and… not less than two weeks before she arrives" ⇒ ô trống đi với "months" ⇒ **12**. Bẫy "two": số tuần tối thiểu TRƯỚC khi đến — đã in sẵn trong ngoặc trên phiếu; Marc còn nhắc lại "Two weeks before".`, ev: `She must have had it within the past twelve months` },
    7: { a: ['blanket'], vi: `Marc hỏi mang "Her bed, her bowls?" — "No need for either… What we do suggest is a blanket from home." ⇒ **blanket**. Bẫy: bed, bowls (trại đã có), toys (nên để ở nhà).`, ev: `What we do suggest is a blanket from home.` },
    8: { a: ['box'], vi: `Marc định chia thuốc vào hộp nhựa theo ngày ("plastic organisers") — "I'm afraid we can't accept them like that. Any medication has to come in the original box, with the vet's label on it" ⇒ **box**. "organiser(s)" là phương án bị từ chối.`, ev: `Any medication has to come in the original box, with the vet's label on it` },
    9: { a: ['grooming'], vi: `Marc xin tắm ("a bath on the last day") — "We don't do a bath by itself, but you can book her in for grooming on her last morning… for fifteen pounds" và Marc đồng ý "put her down for the grooming" ⇒ **grooming** (dịch vụ tắm – chải – cắt móng). Viết "bath" là sai: đó là thứ trại KHÔNG nhận làm riêng.`, ev: `you can book her in for grooming on her last morning` },
    10: { a: ['video'], vi: `"Some kennels send a photo every day, but… what we do is send a short video every three days" ⇒ **video**. Bẫy "photo": việc của các trại KHÁC, và là "every day" chứ không phải "every three days".`, ev: `So what we do is send a short video every three days, by text, and there's no charge for it.` },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `Danh sách chờ (A) "has helped", hội đồng thành phố (C) "would probably have asked us" — cả hai có thật nhưng "that's not what was behind it". Lý do thật: ô lớn quá sức, "Every summer we had a dozen of them disappearing under weeds" ⇒ **B** ("not being looked after" = bị cỏ dại nuốt). 📘 Ôn Part 2 + 3 tốc độ thật: Tập 5 Ngày 4; MCQ câu hỏi dài: Tập 4 Ngày 4.`, ev: `Every summer we had a dozen of them disappearing under weeds` },
    12: { a: ['A'], vi: `"nobody's asking you to clear the whole thing" (loại B); buổi cho người mới "whether you come is entirely up to you" (loại C — có thật nhưng KHÔNG bắt buộc); "by your three-month inspection, a quarter of the plot should have something growing in it" ⇒ **A** ("bring part of their plot into use" = một phần tư ô có cây trồng).`, ev: `The rule is that by your three-month inspection, a quarter of the plot should have something growing in it.` },
    13: { a: ['C'], vi: `"any evening you liked" là quy định CŨ (loại B); "came very close to banning fires altogether" — suýt cấm, chưa cấm (loại A); "fires are allowed from the start of November to the end of February, and at no other time" ⇒ **C** ("only during part of the year"). Câu hỏi có chữ "current" — chú ý thì của từng câu Greg nói.`, ev: `fires are allowed from the start of November to the end of February, and at no other time` },
    14: { a: ['A'], vi: `Rau xà lách: "the slugs will have it before you do" (loại B); dâu, mâm xôi (= soft fruit): "you'll wait a couple of years" (loại C); "My advice is boring: put in potatoes." ⇒ **A**. Paraphrase: "soft fruit" không hề được nói ra — bạn phải tự gom raspberries + strawberries.`, ev: `My advice is boring: put in potatoes.` },
    15: { a: ['C'], vi: `"Please don't ring me" (loại A); sổ sự cố ở quầy "nobody opens it until Saturday" (loại B); "The quickest way by far is to put a message in the members' online group." ⇒ **C**.`, ev: `The quickest way by far is to put a message in the members' online group.` },
    16: { a: ['B'], vi: `Nhà kho dụng cụ: "it's now locked. So before you can use it, you'll need to get a key from me" ⇒ **B**. Bẫy F (mất phí): "there's nothing to pay" — 10 bảng chỉ là tiền ĐẶT CỌC, trả lại khi rời hội, không phải phí mỗi lần dùng. 📘 Ôn matching khi nghe: Tập 4 Ngày 21.`, ev: `So before you can use it, you'll need to get a key from me` },
    17: { a: ['A'], vi: `Bồn nước: máy bơm hỏng hai tuần trước, "for now the tanks are empty and you can't use them" ⇒ **A** ("cannot be used at present"). "pay for that water" nói về vòi nước máy ở cổng, không phải bồn (bẫy F).`, ev: `So for now the tanks are empty and you can't use them, I'm sorry to say.` },
    18: { a: ['E'], vi: `Ô ủ phân: trước ở ngay trong cổng, "They're not there any more… we rebuilt them at the far end of the site, behind the orchard" ⇒ **E** ("in a different place from before").`, ev: `we rebuilt them at the far end of the site, behind the orchard` },
    19: { a: ['C'], vi: `Quầy bán vật tư: "it's only open on Saturday and Sunday mornings" ⇒ **C**. Bẫy G: "run entirely by volunteers" nhưng "I'm not asking any of you to volunteer in your first year" — thành viên mới KHÔNG phải giúp.`, ev: `it's only open on Saturday and Sunday mornings, nine till twelve` },
    20: { a: ['D'], vi: `Máy xới đất: "You don't pay anything" (loại F), "but you do have to write your name on the sheet on the noticeboard beforehand" ⇒ **D** ("put their name down in advance").`, ev: `you do have to write your name on the sheet on the noticeboard beforehand` },

    /* ── Part 3 ── */
    21: { a: ['B'], vi: `Callum lớn lên gần đó nhưng "that's not why we picked it" (loại A); tin tức đến SAU: "we'd already chosen it by then" (loại C). Priya: "What decided it was the data. The rivers trust had been surveying that stretch for three years before the weir came out" ⇒ **B**. 📘 Ôn Part 3 bẫy đổi ý: Tập 4 Ngày 12, Ngày 28.`, ev: `The rivers trust had been surveying that stretch for three years before the weir came out` },
    22: { a: ['C'], vi: `Sỏi trở lại ở thượng lưu "that's exactly what we found" (đúng dự đoán — loại A); cá tăng "is what the textbooks tell you" (loại B). "The thing that did take us by surprise was below the weir… the bank there has been eaten away" ⇒ **C** ("worn away" = "eaten away"). Câu hỏi có "not expect" — hai phương án kia đều là kết quả THẬT nhưng đã lường trước.`, ev: `There's a bend about two hundred metres down, and the bank there has been eaten away, quite badly.` },
    23: { a: ['A'], vi: `Câu hỏi dẫn dắt là nỗi lo của PRIYA; Dr Brennan: "I thought the wording was fair" (loại B). "My concern is different… Nineteen… You simply can't generalise from that." ⇒ **A**. Làm trực tuyến: "that's not the issue now" (loại C). Câu hỏi hỏi ý của AI — đọc kỹ chủ ngữ.`, ev: `You simply can't generalise from that.` },
    24: { a: ['B'], vi: `Drone: không có giấy phép, sông nằm dưới tán cây (loại A); ảnh: chụp khác mùa, "I wouldn't rely on them" (loại C). Priya: "We could draw two cross-sections of the channel… one from the trust's figures and one from ours" — Dr Brennan: "That's the one." ⇒ **B** ("a pair of diagrams based on measurements" = hai mặt cắt).`, ev: `We could draw two cross-sections of the channel at the bend, one from the trust's figures and one from ours, and put them side by side.` },
    25: { a: ['B', 'E'], vi: `Dr Brennan: "What I do want is a proper section on the weaknesses of your method." ⇒ **B** ("limitations" = "weaknesses"). Loại A (đo thêm: "Leave it"), C (gặp lại tổ chức: "I don't think another conversation would add much"), D (tài liệu tham khảo: "is fine… there's plenty there"). 📘 Ôn chọn TWO: Tập 3 Ngày 17, Tập 4 Ngày 12.`, ev: `What I do want is a proper section on the weaknesses of your method.` },
    26: { a: ['B', 'E'], vi: `Việc thứ hai: "The other thing is the background section. It's twelve hundred words out of four thousand. Cut it by half." ⇒ **E**. Hai đáp án là **B, E** — thứ tự không quan trọng.`, ev: `The other thing is the background section. It's twelve hundred words out of four thousand. Cut it by half.` },
    27: { a: ['tape'], vi: `"first we choose a spot and stretch a tape across the river, from one bank to the other, fixed to a post on each side" ⇒ **tape** (thước dây). "fixed… between two posts" = "fixed to a post on each side". 📘 Ôn flow-chart khi nghe: Tập 4 Ngày 12.`, ev: `stretch a tape across the river, from one bank to the other, fixed to a post on each side` },
    28: { a: ['width'], vi: `Ngày đầu đo sai: "We were measuring the longest side of each stone, and it's not the length you want, it's the width" ⇒ **width**. Bẫy: "length" (cách đo SAI) và "ruler" (dụng cụ — không hợp ngữ pháp với "the ___ of each stone").`, ev: `it's not the length you want, it's the width` },
    29: { a: ['coin'], vi: `"You're supposed to put a scale card in the picture, but we left ours in the lab, so we used a coin instead." ⇒ **coin**. Bẫy "card": thứ ĐÁNG LẼ phải dùng nhưng họ quên mang.`, ev: `we left ours in the lab, so we used a coin instead` },
    30: { a: ['spreadsheet'], vi: `"everything gets typed into a spreadsheet, which works out the average size for each line" ⇒ **spreadsheet** (viết liền, một từ). "entered into" = "typed into"; "calculates" = "works out". Dr Brennan nhắc lại cả bốn bước: "Tape, stones, photograph, spreadsheet."`, ev: `everything gets typed into a spreadsheet, which works out the average size for each line` },

    /* ── Part 4 ── */
    31: { a: ['hunt'], vi: `Truyền thống ngày Giáng sinh: các đội mang súng thi bắn chim — "It was simply a hunt." — rồi Chapman đề nghị "count the birds instead" ⇒ cuộc đếm ra đời để THAY cho một cuộc săn ⇒ **hunt**. 📘 Ôn Part 4 bài giảng chuyên sâu: Tập 5 Ngày 5; note completion: Tập 4 Ngày 8.`, ev: `It was simply a hunt.` },
    32: { a: ['north', 'northwards', 'northward'], vi: `"the winter ranges of many species have shifted steadily north… as the climate has warmed" ⇒ **north**. "have moved" = "have shifted".`, ev: `the winter ranges of many species have shifted steadily north` },
    33: { a: ['shape'], vi: `"they needed each one sorted according to its shape, essentially whether it was a spiral or a smooth, rounded blob" ⇒ **shape**. "classify… by" = "sorted according to". Đừng viết "spiral": đó là MỘT trong hai loại hình dạng.`, ev: `they needed each one sorted according to its shape` },
    34: { a: ['teacher'], vi: `"A Dutch teacher called Hanny van Arkel noticed a strange glowing patch" ⇒ **teacher** ("from the Netherlands" = "Dutch"). Bẫy "student": người tự phân loại 50.000 ảnh là nghiên cứu sinh ở Oxford, không phải người phát hiện vật thể mới.`, ev: `A Dutch teacher called Hanny van Arkel noticed a strange glowing patch beside one galaxy` },
    35: { a: ['contribution'], vi: `Tưởng là vì trang web giống trò chơi ("games") nhưng khảo sát cho thấy "the commonest answer by far was the wish to make a contribution to real research" ⇒ **contribution**. Sau "make a" phải là danh từ — không viết "contribute".`, ev: `the commonest answer by far was the wish to make a contribution to real research` },
    36: { a: ['cities'], vi: `"the records are concentrated near cities and along roads, they're made at weekends, and in good weather" ⇒ **cities** (số nhiều). Chính tả: city → cit**ies**.`, ev: `So the records are concentrated near cities and along roads` },
    37: { a: ['time'], vi: `"to report not just the highlights but everything they saw, and, crucially, to state how much time they spent looking" ⇒ **time**. Ý đứng sau chữ "crucially" — tín hiệu rằng điều quan trọng nhất sắp tới; "everything they saw" là yêu cầu thứ nhất, không điền được vào "how much ___".`, ev: `to state how much time they spent looking` },
    38: { a: ['labour', 'labor'], vi: `"universities are in effect treating the public as free labour" ⇒ **labour** (Anh) / **labor** (Mỹ) — cả hai được chấp nhận. Bẫy "assistants": người mà trường LẼ RA phải thuê.`, ev: `universities are in effect treating the public as free labour` },
    39: { a: ['collectors'], vi: `Vị trí cây lan hiếm bị lộ, vài ngày sau cây bị đào: "The threat wasn't from developers or farmers, it was from collectors." ⇒ **collectors**. Hai danh từ bị bác đứng ngay trước đáp án.`, ev: `The threat wasn't from developers or farmers, it was from collectors.` },
    40: { a: ['trust'], vi: `"this is one of the few things that reliably builds public trust in science" ⇒ **trust**. "increases" = "builds". Câu chốt của bài giảng — đừng buông bút khi nghe "Finally".`, ev: `this is one of the few things that reliably builds public trust in science` },
  },
};
