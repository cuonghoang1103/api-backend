/**
 * Đề 8 — Listening, THI CUỐI TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 30). TỰ SOẠN 18/11/2026.
 * Mức band 7.0 — khó hơn Đề 7 nửa bậc: ~165 từ/phút (mục 4.2: Đề 7–9) nhưng lời thoại DÀI hơn Đề 7, đáp án hầu như luôn đứng sau
 * MỘT CHUỖI con số / phương án bị sửa (Part 1: ba mức giá rồi mới ra số cuối), paraphrase mức 4 (ý phải suy: "an accountant
 * stuffing envelopes" = abilities wasted), sơ đồ theo PHƯƠNG HƯỚNG la bàn (T4 N16 "Map phức — phương hướng"), Part 3 người hướng
 * dẫn và sinh viên lật ý nhau nhiều lượt, Part 4 bài giảng dài nhất từ trước tới nay + bảng ba thành phố.
 * Bối cảnh theo mục 4.2: chuyển nhà (giọng Ireland) · hướng dẫn lễ hội · thảo luận luận văn · bài giảng "đô thị thông minh".
 * GIỌNG: Part 1 khách hàng giọng Ireland THẬT (`ie-nam` = en-IE-ConnorNeural, ôn T4 N21 "Giọng Scotland / Ireland") + nhân viên
 * Anh (`uk-nu`) · Part 2 giọng Úc (`au-nu`) · Part 3 sinh viên Mỹ (`us-nam`) + giảng viên Canada (`ca-nu`) · Part 4 giọng New
 * Zealand (`nz-nu`) ⇒ 6 giọng.
 *   Part 1: Form + Sentence completion (T4 N1 "quá dễ để sai", N21; bẫy số chuỗi) · Part 2: MCQ + Map theo la bàn (T4 N4, N16) ·
 *   Part 3: MCQ + chọn TWO + Matching nhận xét từng chương (T4 N5, N12, N28 bẫy) · Part 4: Note + Table (T4 N8, N13, N20, N24).
 * Bẫy chính: Fennelly (double N, double L); fourth → fifth floor; Mallow (double L); 14th → 21st; piano → wardrobe; £690 / £900 →
 * £735; tape → boxes; glass nói chung → mirrors; parking suspension → permit; full payment → deposit; trận derby / thời tiết →
 * sửa cầu; chợ đêm (năm thứ tư) / pháo hoa (bị cấm) → cuộc thi của trường; chỉ cho trẻ em / thu phí → phải đặt trước; bãi đỗ trung
 * tâm / chuyến tàu thêm → xe buýt park-and-ride; đông khách hơn / người cũ bỏ đi → đường diễu hành dài hơn; cổng chính (cũ) →
 * giữa hồ và sân khấu; bên hồ (năm ngoái) → cổng Đông; hồ sơ của tổ chức / đề tài quá rộng → ít nghiên cứu trước; tỉ lệ trả lời
 * thấp / câu hỏi dài → mẫu lệch; thiếu thời gian / mâu thuẫn với nhân viên → tài năng bị phí; bỏ hẳn / thêm chương → làm bối cảnh;
 * organism → machine; install → maintain; privacy (P4 bảng) ≠ surveillance (P4 ghi chú).
 * Dữ kiện đô thị thông minh — kiến thức phổ thông, soạn theo trí nhớ, CHƯA đối chiếu lại nguồn trong phiên này: Songdo (Hàn Quốc)
 * dựng mới trên đất lấn biển gần Incheon, nhiều năm vắng người so với kế hoạch; trung tâm điều hành Rio de Janeiro lập cuối 2010 sau
 * mưa lũ và sạt lở tháng 4/2010, làm cùng IBM; dự án Quayside ở khu ven hồ Toronto của Sidewalk Labs (thuộc Alphabet) bị bỏ tháng
 * 5/2020 — công ty nêu lý do kinh tế, dự án vấp chỉ trích về quyền riêng tư suốt hai năm. Công ty Brightway Removals, lễ hội
 * Riverside Lantern Festival ở Castle Park, sông Lenn, tổ chức thiện nguyện Harbour Food Trust, Dr Okafor và mọi nhân vật trong
 * Part 1–3 đều HƯ CẤU.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong lời thoại + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 * SOÁT CHÉO 24/11/2026 (theo trí nhớ): Songdo (Incheon, đất lấn biển, ống rác ngầm, vắng người) · Rio (trung tâm điều hành cuối 2010
 *   sau lũ + sạt lở tháng 4/2010, > 200 người chết) · Toronto (Sidewalk Labs chọn 2017, rút 5/2020) — khớp.
 */
import type { DeNghe } from './types';

export const NGHE_DE8: DeNghe = {
  id: 'nghe-de8',
  kyNang: 'nghe',
  ten: 'Listening — Đề 8 (thi cuối Tập 4)',
  boDe: 'Đề 8',
  capDo: 'Band 7.0',
  moTa: 'Booking a removal company (Irish + UK) · A lantern festival guide & site map · A student discusses his dissertation with his supervisor · Lecture on smart cities (New Zealand speaker)',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — đặt dịch vụ chuyển nhà ════════════════ */
    {
      so: 1,
      tieuDe: 'Brightway Removals — booking enquiry',
      dan: 'Part 1. You will hear a man telephoning a removal company to arrange a house move. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Declan (giọng Ireland) sắp chuyển từ căn hộ trong thành phố về một ngôi nhà ở làng Ashcombe, gọi công ty chuyển nhà Brightway Removals; nhân viên Sophie nói giọng Anh. Giọng Ireland: "th" trong "three", "third", "think" nghe gần /t/ ("tree", "tird"); chữ "r" sau nguyên âm đọc rõ ("floor", "fourth", "order"); "grand" = ổn, được. Chú ý: anh sửa số tầng, ngày bị đổi vì kín lịch, món đồ lớn thay cho món đã bỏ, giá CUỐI sau ba lần tính; phần câu: thứ được giao miễn phí, thứ bảo hiểm không trả nếu tự gói, giấy cần xin, khoản phải trả để giữ chỗ.',
      docTruoc: 30,
      loi: [
        { ai: 'Sophie', giong: 'uk-nu', s: `Good morning, Brightway Removals, Sophie speaking. How can I help?` },
        { ai: 'Declan', giong: 'ie-nam', s: `Morning, Sophie. I'm moving house in March and I was hoping to get a price from you. A friend of mine used you last year and said you were grand.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `That's nice to hear. I'll take a few details first. Can I have your name?` },
        { ai: 'Declan', giong: 'ie-nam', s: `Declan Fennelly. That's F, E, double N, E, double L, Y.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `F, E, N, N, E, L, L, Y. And where are you moving from, Mr Fennelly?` },
        { ai: 'Declan', giong: 'ie-nam', s: `A flat in the city centre, on Quayside Road. We're on the fourth floor. Sorry, no, I tell a lie, it's the fifth. I always forget that the floor at street level has shops on it, so I don't count it. But it's the fifth.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `Fifth floor. Is there a lift?` },
        { ai: 'Declan', giong: 'ie-nam', s: `There is, but you'd barely get a bicycle into it. The furniture will have to go down the stairs, I'm afraid.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `That's all right, we're used to it. And the new address?` },
        { ai: 'Declan', giong: 'ie-nam', s: `Twenty-seven Mallow Lane, in Ashcombe. Mallow is M, A, double L, O, W, like the town in Cork.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `M, A, L, L, O, W. Lovely. Did you have a date in mind?` },
        { ai: 'Declan', giong: 'ie-nam', s: `Saturday the fourteenth of March, if you can do it.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `Let me look. Oh dear, the fourteenth is completely full, I'm afraid. Saturdays in spring go very quickly. I could do Friday the thirteenth, or the following Saturday, the twenty-first.` },
        { ai: 'Declan', giong: 'ie-nam', s: `I'm not superstitious, but I'm working on the Friday, so it'll have to be the twenty-first. My lease runs until the end of the month, so that's no bother.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `Saturday the twenty-first, then. Now, roughly how much is there? Are there any very large or heavy items?` },
        { ai: 'Declan', giong: 'ie-nam', s: `There was going to be a piano, but my sister's taking that off my hands, thank God. So the big things are two sofas, the fridge-freezer, and an old oak wardrobe that belonged to my grandmother. It weighs a ton, and it doesn't come apart.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `I'll note the wardrobe, so the team bring extra straps. Right, for a two-bedroom flat going about thirty miles, the standard price is six hundred and ninety pounds. If you'd like us to do all the packing as well, that adds two hundred and ten, so nine hundred altogether.` },
        { ai: 'Declan', giong: 'ie-nam', s: `Nine hundred! No, we'll pack ourselves. We've plenty of time.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `Then it's six ninety. Oh, but I should have said: because it's a Saturday, there's a weekend charge of forty-five pounds on top, which brings you to £735.` },
        { ai: 'Declan', giong: 'ie-nam', s: `Seven thirty-five. Well, I can't change the day, so go on, put that down.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `If you're packing yourselves, we'll deliver thirty boxes to the flat a week before, and there's no charge for those. Tape you'll need to buy, I'm afraid, but any hardware shop has it.` },
        { ai: 'Declan', giong: 'ie-nam', s: `Free boxes. That's something. And are things insured if we pack them ourselves? I've a lot of glasses and plates.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `Glasses and plates are covered, as long as they're in our boxes. The one thing we can't insure if you've packed it yourself is mirrors. They crack so easily that we only cover them if our own staff have wrapped them. The team can do that on the day.` },
        { ai: 'Declan', giong: 'ie-nam', s: `Grand. I've only the one big mirror, so they can deal with it. Is there anything else I need to sort out?` },
        { ai: 'Sophie', giong: 'uk-nu', s: `Parking. Is Quayside Road residents only?` },
        { ai: 'Declan', giong: 'ie-nam', s: `It is. You need a permit even to stop there for ten minutes.` },
        { ai: 'Sophie', giong: 'uk-nu', s: `Then you'll need to apply to the council for a temporary parking permit for our van. It's free, but it can take ten days, so please do it soon. People sometimes ask the council to suspend the whole street, but that costs a fortune and you don't need it. A permit is enough.` },
        { ai: 'Declan', giong: 'ie-nam', s: `A permit. I'll do that this week. And how do I confirm the booking? Do you want the whole lot now?` },
        { ai: 'Sophie', giong: 'uk-nu', s: `No, the full amount isn't due until the day of the move. To secure the date, we just ask for a deposit of ten per cent. I'll email you a link this afternoon and you can pay it online.` },
        { ai: 'Declan', giong: 'ie-nam', s: `Perfect. Thanks a million, Sophie.` },
      ],
      nhom: [
        {
          id: 'n1-form', tu: 1, den: 6, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Brightway Removals — Booking Form',
          dong: [
            'Customer: Declan [[1]]',
            'Moving from: flat on Quayside Road, [[2]] floor (lift too small for furniture)',
            'Moving to: 27 [[3]] Lane, Ashcombe',
            'Date of move: Saturday [[4]] March',
            'Large items: two sofas, fridge-freezer, oak [[5]]',
            'Total price (customer packing): £[[6]]',
          ],
        },
        {
          id: 'n1-sentence', tu: 7, den: 10, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'Brightway will supply the customer with [[7]] at no extra cost.',
            'If the customer packs [[8]] himself, they will not be insured.',
            'The customer must obtain a [[9]] from the council for the van.',
            'To reserve the date, the customer must pay a [[10]] online.',
          ],
        },
      ],
    },

    /* ════════════════ PART 2 — hướng dẫn lễ hội đèn lồng (sơ đồ theo la bàn) ════════════════ */
    {
      so: 2,
      tieuDe: 'Riverside Lantern Festival',
      dan: 'Part 2. You will hear the director of a lantern festival talking on a local radio programme. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Kirsty, giám đốc lễ hội đèn lồng Riverside Lantern Festival (giọng Úc), nói trên đài địa phương: vì sao đổi ngày, có gì mới, xưởng làm đèn lồng, đi lại, cần tình nguyện viên vì sao; rồi chỉ các điểm trên sơ đồ công viên Castle Park. Chú ý: mỗi câu trắc nghiệm có hai ý bị bác trước. Sơ đồ: phía BẮC ở trên (sông Lenn chạy dọc phía bắc), cổng chính ở phía NAM; vị trí tả bằng hướng la bàn (north-east…) và mốc (hồ, sân khấu Bandstand, cầu đi bộ đang đóng, cổng Đông). Giọng Úc: "day" nghe gần "die", "night" nghe tròn hơn; nghe kỹ hướng "left / right" khi bước vào CỔNG.',
      docTruoc: 40,
      loi: [
        { ai: 'Kirsty', giong: 'au-nu', s: `Thanks for having me. Yes, the Riverside Lantern Festival is back for its twelfth year, and I know a lot of your listeners have noticed that it's a fortnight later than usual. Some people have assumed that's to avoid the football derby, which was on the same weekend last year, and others think we were scared off by the rain we had in 2024. Neither is right. The footbridge over the river is being strengthened at the moment, and the engineers simply can't finish before the middle of October. Since the bridge is where the whole procession normally crosses, we had no real choice.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `People always ask what's new. The night market isn't, I should say: it's back for the fourth year, with about sixty stalls. We had hoped to end the evening with fireworks this time, but the council turned that down because of the swans nesting on the lake, and quite right too. What is new is a competition. Every primary school in the district has been invited to build a giant lantern, and the winning design will lead the procession. Twenty-two schools have entered, which is far more than we expected.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `Then there are the lantern-making workshops, which are always popular. There's a common belief that they're just for children, and that isn't true: half of the places are kept for adults. Up to last year we charged five dollars a session, but this year a local building society is paying for the materials, so they're free. The one thing I'd stress is that you can't just turn up. Every place has to be reserved on our website beforehand, and once a session is full, it's full.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `Getting there. Please don't drive into the town centre. All three car parks near the park will be closed on the Saturday so that the procession can assemble there. The railway company had promised us an extra late train, but because of engineering work on the line that's no longer happening. So by far the best way to come is the park-and-ride. Buses leave the football stadium every ten minutes from four o'clock until midnight, and the return ticket is just two dollars.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `And finally, we need volunteers, more of them than ever. It isn't that we're expecting bigger crowds. Our forecast is around twenty thousand people, which is about the same as last year. And our regular volunteers have been wonderfully loyal; nearly all of them are coming back. The problem is the bridge again. Because the procession can't cross it, it has to take a much longer way round, through the old town, and the route is now almost twice as long. We need stewards along every metre of it.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `Now, if you've got the festival map in front of you, or you've downloaded it, let me take you round. North is at the top, so the river runs along the top of the map, and the main gate is at the bottom, on the southern side of the park. The bandstand, where the music happens, is right in the centre.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `First, the lantern workshop tent. If you walk north from the bandstand towards the river, you'll find it about halfway between the two, directly opposite the closed footbridge. You can't miss it. It's the tent with the paper dragon on the roof.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `First aid. People tend to look for it beside the bandstand, because that's where it was years ago. These days it's right by the main gate. As you come in through the gate, it's the tent immediately on your right. On your left there's the information desk.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `The night market has moved. Last year we squeezed it in beside the lake, on the western side, and it got far too crowded. This year the stalls are along the eastern edge of the park, next to the East Gate, so you can come straight in from the high street.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `We've also created a quiet zone, for anyone who finds the noise and the crowds too much. Families with young children have asked for this for years. We wanted it as far from the music as possible, so it's in the north-east corner of the park, right beside the river.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `And the point where lost children are looked after. That used to be at the main gate, but parents found it hard to get back through the crowds. So now it's in the middle of the park, between the lake and the bandstand, where stewards from every side can reach it quickly.` },
        { ai: 'Kirsty', giong: 'au-nu', s: `That's the plan. See you all on the eighteenth, and don't forget to book those workshops.` },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 15, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'Why is the festival being held later than usual this year?', chon: [{ k: 'A', t: 'It would have clashed with a sporting event.' }, { k: 'B', t: 'Work is being carried out on a structure the procession uses.' }, { k: 'C', t: 'The weather was poor at last year\'s festival.' }] },
            { n: 12, s: 'What is new at this year\'s festival?', chon: [{ k: 'A', t: 'a night market' }, { k: 'B', t: 'a fireworks display' }, { k: 'C', t: 'a competition for schools' }] },
            { n: 13, s: 'What does the speaker say about the lantern-making workshops?', chon: [{ k: 'A', t: 'Places must be booked in advance.' }, { k: 'B', t: 'They are intended mainly for children.' }, { k: 'C', t: 'There is a small charge for materials.' }] },
            { n: 14, s: 'How does the speaker advise people to travel to the festival?', chon: [{ k: 'A', t: 'by car to the town centre' }, { k: 'B', t: 'by train' }, { k: 'C', t: 'by bus from the stadium' }] },
            { n: 15, s: 'Why does the festival need more volunteers this year?', chon: [{ k: 'A', t: 'More visitors are expected.' }, { k: 'B', t: 'The procession will be longer.' }, { k: 'C', t: 'Many previous volunteers will not return.' }] },
          ],
        },
        {
          id: 'n2-map', tu: 16, den: 20, dang: 'map',
          huongDan: 'Label the map below.\nWrite the correct letter, **A–H**, next to Questions 16–20.',
          tieuDe: 'Riverside Lantern Festival — Castle Park',
          hop: { ds: 'ABCDEFGH'.split('').map((k) => ({ k, t: k })) },
          cau: [
            { n: 16, s: 'Lantern workshop tent' },
            { n: 17, s: 'First aid' },
            { n: 18, s: 'Night market' },
            { n: 19, s: 'Quiet zone' },
            { n: 20, s: 'Lost children point' },
          ],
          hinh: {
            w: 600, h: 420,
            chuThich: 'Map of the festival site (not to scale). North is at the top; the main gate is on the southern side of the park.',
            ve: [
              // Sông phía bắc + cầu đi bộ đang đóng
              { t: 'rect', x: 0, y: 18, w: 600, h: 38, nen: '#d6e6f2', nhan: 'River Lenn' },
              { t: 'rect', x: 280, y: 10, w: 40, h: 54, nen: '#e4e4e4' },
              { t: 'text', x: 300, y: 78, s: 'footbridge (closed)', co: 10, giua: true, nghieng: true },
              // Công viên
              { t: 'rect', x: 20, y: 90, w: 560, h: 280, nen: '#eef3e6' },
              // Hồ phía tây
              { t: 'rect', x: 50, y: 150, w: 120, h: 90, nen: '#cfe0ee', nhan: 'Lake' },
              // Sân khấu giữa
              { t: 'circle', x: 300, y: 230, r: 34, nen: '#f3e7d3', nhan: 'Bandstand' },
              // Cổng chính phía nam, cổng Đông
              { t: 'line', d: [[300, 412], [300, 374]], mui: true },
              { t: 'text', x: 360, y: 404, s: 'Main gate', co: 11, giua: true },
              { t: 'line', d: [[596, 260], [584, 260]], mui: true },
              { t: 'text', x: 556, y: 300, s: 'East Gate', co: 10, giua: true },
              { t: 'text', x: 556, y: 312, s: '(high street)', co: 9, giua: true, nghieng: true },
              // La bàn
              { t: 'line', d: [[560, 140], [560, 104]], mui: true },
              { t: 'text', x: 560, y: 156, s: 'N', co: 12, dam: true, giua: true },
              // Chữ cái
              { t: 'chu', k: 'A', x: 300, y: 130 },
              { t: 'chu', k: 'B', x: 110, y: 300 },
              { t: 'chu', k: 'C', x: 250, y: 340 },
              { t: 'chu', k: 'D', x: 350, y: 340 },
              { t: 'chu', k: 'E', x: 500, y: 120 },
              { t: 'chu', k: 'F', x: 530, y: 260 },
              { t: 'chu', k: 'G', x: 220, y: 200 },
              { t: 'chu', k: 'H', x: 400, y: 230 },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 3 — sinh viên bàn luận văn với người hướng dẫn ════════════════ */
    {
      so: 3,
      tieuDe: 'Discussing a dissertation draft',
      dan: 'Part 3. You will hear a sociology student, Ben, discussing the draft of his dissertation with his supervisor, Dr Okafor. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Ben (sinh viên năm cuối ngành xã hội học, giọng Mỹ) gặp người hướng dẫn, Dr Okafor (nữ, giọng Canada), để bàn bản nháp luận văn về việc vì sao tình nguyện viên RỜI BỎ một tổ chức thiện nguyện ngân hàng thực phẩm (Harbour Food Trust). Chú ý: lý do THẬT khiến Ben đổi đề tài, điều Dr Okafor THẬT SỰ lo về bảng hỏi, phát hiện gây bất ngờ nhất, số phận buổi phỏng vấn giám đốc; hai việc cô yêu cầu làm trước bản nháp sau; nhận xét về TỪNG chương — nhiều ý được nêu rồi mới bị bác.',
      docTruoc: 40,
      loi: [
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `Come in, Ben, sit down. I've read the draft twice, so let's go through it properly. Before we start, remind me why you moved away from your original question. You were going to look at why people start volunteering, weren't you?` },
        { ai: 'Ben', giong: 'us-nam', s: `I was. People assume it's because the Food Trust offered me their records, but honestly that came later, after I'd already changed my mind. And you had said the first topic was too broad, which was fair, but I could have narrowed it down. What really did it was the literature search. There are literally hundreds of studies on why people start volunteering, and almost nothing on why they give up. It felt like a gap that someone ought to fill.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `That's a good reason, and you should say so in exactly those words in the introduction. Now, the survey. I can see you're worried about the response rate, because you apologise for it twice. Don't. Forty-one per cent is very respectable for a postal survey. And the questions themselves are clear and short, so that's not an issue either.` },
        { ai: 'Ben', giong: 'us-nam', s: `So what's the problem? I can tell there is one.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `It's who answered. You sent the survey out through the Trust's mailing list, and nearly everyone on that list is still volunteering. So the people your dissertation is actually about, the ones who left, hardly appear in the survey at all. That needs to be acknowledged, clearly, as a limitation.` },
        { ai: 'Ben', giong: 'us-nam', s: `Right. I hadn't really thought of it like that. But the interviews make up for it a bit, I think, because all twelve of those were people who'd left.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `They do. They're the heart of the dissertation. What came out of them that you didn't expect?` },
        { ai: 'Ben', giong: 'us-nam', s: `Well, I went in assuming that the main reason would be time. People get new jobs, they have kids, that kind of thing. And a few did mention that, but always as a secondary thing, almost an excuse. I also thought there might be friction with the paid staff, but that only came up once. What came up again and again was being given work that had nothing to do with what they could do. One woman was a qualified accountant, and they had her stuffing envelopes for six months. Another was a chef, and he spent every shift carrying boxes.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `Which is a striking finding, and it's well supported. Now, what about the interview with the Trust's director? At the moment it sits in the middle of your findings chapter.` },
        { ai: 'Ben', giong: 'us-nam', s: `I know. I wasn't sure about it. Should I take it out completely?` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `No, don't throw it away. But she's not a volunteer and she's never left, so it can't be evidence for your question. Use it in the introduction, to explain how the Trust is organised and why it relies on volunteers. As background, it's very useful.` },
        { ai: 'Ben', giong: 'us-nam', s: `OK, so it becomes context rather than data. Got it. What else should I do before the next draft?` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `Two things, and they matter. First, you volunteered at the Trust yourself for two years, didn't you? You need to state that clearly in the methodology, and say how you dealt with it, because some of your interviewees knew you personally. Examiners will want to see that you've thought about your own position.` },
        { ai: 'Ben', giong: 'us-nam', s: `I mention it in the acknowledgements.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `That's not enough. It belongs in the methods. Second, the literature review is far too long. It's almost a third of the whole dissertation. I'd like you to cut it by about a third and keep only what you actually use later.` },
        { ai: 'Ben', giong: 'us-nam', s: `I was wondering whether I should compare the Trust with another charity, to make the findings stronger.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `It's a nice idea, but you'd need a whole new set of interviews, and there isn't time before May. Leave that for the section on further research. And before you ask, please don't try to contact more former volunteers through the Trust's newsletter. Their consent forms don't cover that, and the ethics committee would stop you.` },
        { ai: 'Ben', giong: 'us-nam', s: `Fair enough. Could you go through the chapters one at a time? I'd like to know where I stand.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `Of course. The introduction is readable, but most of its second half says the same things as the opening of the literature review, almost word for word in places. One of them has to go.` },
        { ai: 'Ben', giong: 'us-nam', s: `I suspected that. And the methodology?` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `What's there is accurate, but there's hardly anything. Half a page. You don't explain how you chose the twelve interviewees, or how you analysed what they said. It needs to be three or four times the length.` },
        { ai: 'Ben', giong: 'us-nam', s: `Ouch. And the findings?` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `The findings are the best thing in it, by some distance. The quotations are vivid and you organise them well. I wouldn't change much at all.` },
        { ai: 'Ben', giong: 'us-nam', s: `That's a relief. And the conclusion? I was quite pleased with that.` },
        { ai: 'Dr Okafor', giong: 'ca-nu', s: `It's well written, but it goes too far. You interviewed twelve people from one food bank, and the conclusion talks about why volunteers leave charities everywhere. Your evidence can't carry that. Keep the argument, but make the claims fit the data.` },
        { ai: 'Ben', giong: 'us-nam', s: `Understood. I'll have a new draft to you in three weeks.` },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 24, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'Why did Ben change the focus of his dissertation?', chon: [{ k: 'A', t: 'He discovered that little research had been done on the new question.' }, { k: 'B', t: 'He was given access to a charity\'s records.' }, { k: 'C', t: 'His supervisor said that the original topic was too broad.' }] },
            { n: 22, s: 'What is Dr Okafor\'s main criticism of Ben\'s survey?', chon: [{ k: 'A', t: 'Too few people replied to it.' }, { k: 'B', t: 'Some of the questions were difficult to understand.' }, { k: 'C', t: 'It mostly reached people who had not left the charity.' }] },
            { n: 23, s: 'What did Ben find most surprising in his interviews?', chon: [{ k: 'A', t: 'Many volunteers had left because they had too little time.' }, { k: 'B', t: 'Many volunteers felt that their abilities were not being used.' }, { k: 'C', t: 'Many volunteers had disagreed with the paid staff.' }] },
            { n: 24, s: 'What do they decide to do with the interview with the charity\'s director?', chon: [{ k: 'A', t: 'use it to provide background information' }, { k: 'B', t: 'remove it from the dissertation' }, { k: 'C', t: 'keep it as part of the findings' }] },
          ],
        },
        {
          id: 'n3-mcq2', tu: 25, den: 26, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [25, 26],
            s: 'Which TWO things does Dr Okafor ask Ben to do before the next draft?',
            chon: [
              { k: 'A', t: 'carry out a comparison with another charity' },
              { k: 'B', t: 'shorten the review of previous research' },
              { k: 'C', t: 'contact more former volunteers' },
              { k: 'D', t: 'interview the charity\'s director again' },
              { k: 'E', t: 'explain his own connection with the charity' },
            ],
          },
        },
        {
          id: 'n3-match', tu: 27, den: 30, dang: 'match-feature',
          huongDan: 'What comment does Dr Okafor make about each section of Ben\'s draft?\nChoose **FOUR** answers from the box and write the correct letter, **A–F**, next to Questions 27–30.',
          hop: {
            tieuDe: 'Comments',
            ds: [
              { k: 'A', t: 'It is the strongest part of the draft.' },
              { k: 'B', t: 'It repeats material from another section.' },
              { k: 'C', t: 'It should be moved to an earlier position.' },
              { k: 'D', t: 'It relies on sources that are out of date.' },
              { k: 'E', t: 'It makes claims that the evidence cannot support.' },
              { k: 'F', t: 'It does not contain enough detail.' },
            ],
          },
          cau: [
            { n: 27, s: 'Introduction' },
            { n: 28, s: 'Methodology' },
            { n: 29, s: 'Findings' },
            { n: 30, s: 'Conclusion' },
          ],
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng: đô thị thông minh (giọng New Zealand) ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — Smart cities: promise and reality',
      dan: 'Part 4. You will hear part of a lecture in an urban planning course about smart cities. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Một giảng viên quy hoạch đô thị người New Zealand giảng về "đô thị thông minh": hình mẫu ban đầu, ai cổ vũ nó, ba lời phê phán, rồi ba trường hợp — Songdo (Hàn Quốc), Rio de Janeiro (Brazil), Toronto (Canada) — và bài học. Giọng New Zealand: nguyên âm /ɪ/ ngắn nghe gần /ə/ ("city" gần "cuh-ty", "six" gần "sux"), /e/ nghe gần /i/ ("sensor" gần "sinsor", "ten" gần "tin"). Bài giảng dài, không ai hỏi lại: bám tiêu đề nhỏ trong ghi chú và cột của bảng; nhiều đáp án đi sau một từ bị bác ("not… but…").',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'nz-nu', s: `Kia ora, everyone, and welcome back. Last week we looked at how cities have traditionally been planned, on paper, by architects and engineers. Today I want to talk about an idea that dominated discussions of urban planning for about fifteen years, and that you will certainly come across in your careers: the smart city. I'll describe what it promised, look at what has actually happened in three places, and then suggest what we might learn from them.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `The term became popular towards the end of the 2000s, and the basic idea was attractive. Cities generate enormous amounts of information: about traffic, about energy and water use, about crime, about the movement of people. If you could place sensors everywhere and collect all of that information in one place, the argument went, you could manage the city far more efficiently. Later writers sometimes compared the city to a living organism, but that wasn't the image in the early brochures. The comparison you saw again and again was with a machine: measure every part, feed the measurements into a computer, and adjust the controls.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `It's worth asking who was making that argument. It wasn't, on the whole, city governments, and it certainly wasn't urban planners. The idea was promoted above all by large technology companies, which had a great deal to sell: sensors, networks, software and, of course, long contracts to maintain them.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `By the early 2010s, the criticisms were growing, and they fell into three groups. The first was that the people who actually lived in these cities were seldom consulted. Plans were drawn up between officials and companies, and residents found out about them afterwards, often from the newspapers. The second concerned money. Installing the equipment was usually paid for, at least in part, by the companies or by special government grants. What cities discovered was that the real expense came later. A sensor network has to be repaired, updated and eventually replaced, and many cities found that these systems were extremely expensive to maintain, long after the publicity had died down. And the third criticism was the most serious. A network that can count cars can also follow people. Critics warned that the same data could easily be used for the surveillance of ordinary citizens, and in some countries, that is exactly what happened.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `Let's turn to the examples. The first is Songdo, in South Korea, which was probably the most ambitious attempt to build a smart city from nothing. It's a new business district near the city of Incheon, and the whole district was built on land reclaimed from the sea. Every building was to be connected to a central network; rubbish was to be removed through underground pipes rather than by lorries; there were sensors in the roads and screens in the apartments. Technically, much of it worked. The trouble was that people were slow to come. For years, visitors described the district as strangely quiet, and many of the flats and offices remained empty long after they had been finished. A city, it turns out, needs more than infrastructure. It needs reasons for people to want to live there.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `The second example is very different. Rio de Janeiro, in Brazil, didn't try to build a new city. Instead, it built an operations centre, a large room full of screens which brings together information from dozens of city departments: transport, police, weather, the fire service. The centre was set up at the end of 2010, after heavy rain earlier that year had caused serious floods and landslides in which more than two hundred people died. Its achievements are more modest than the advertising suggested, but most observers agree that it has improved the way the emergency services work together, which was the problem it was designed to solve.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `The third case is Toronto, in Canada. In 2017, a company owned by the same group as Google was chosen to develop a neighbourhood on the city's waterfront, on land that had been used for industry. The plans were remarkable: heated pavements, buildings made of timber, traffic lights that responded to pedestrians. But from the start the project was criticised, above all because of concerns about privacy. Who would own the data collected from people walking down the street, and what would be done with it? The arguments went on for more than two years. In May 2020, the company withdrew. It gave economic uncertainty as its reason, but few people believe that the controversy over data had nothing to do with it.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `So what can we learn? I'd suggest three things. First, the most successful projects start with a problem, not with a technology. Rio had a specific problem, coordinating emergencies, and a solution that fitted it. Songdo had a great deal of technology looking for a purpose. Second, the cost of a system is not the cost of installing it. Any proposal you see in your career should include a realistic estimate of what it will cost to run in ten years' time. And third, residents have to be involved from the beginning, not informed at the end. That's partly a matter of fairness, but it's also practical: people who don't trust a system will find ways to avoid it.` },
        { ai: 'Lecturer', giong: 'nz-nu', s: `Next week, we'll look at cities which have taken these lessons on board, and at some smaller projects that have quietly succeeded.` },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 35, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Smart cities',
          dong: [
            '## The original idea',
            '• sensors would collect data so that a city could be managed like a [[31]]',
            '• the idea was mainly promoted by [[32]] companies',
            '## Criticisms',
            '• residents were rarely [[33]] about the plans',
            '• the systems were very costly to [[34]] over time',
            '• the data could be used for the [[35]] of ordinary people',
          ],
        },
        {
          id: 'n4-table', tu: 36, den: 40, dang: 'table',
          huongDan: 'Complete the table below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Three smart city projects',
          bang: {
            dau: ['City', 'Project', 'Outcome'],
            hang: [
              ['Songdo, South Korea', 'a new district built on land taken from the [[36]]', 'for years, many flats and offices were [[37]]'],
              ['Rio de Janeiro, Brazil', 'an operations centre set up after serious [[38]] and landslides in 2010', 'better cooperation between emergency services'],
              ['Toronto, Canada', 'a new neighbourhood planned on the city\'s [[39]]', 'abandoned in 2020 after long arguments about [[40]]'],
            ],
          },
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['Fennelly'], vi: `"Declan Fennelly. That's F, E, double N, E, double L, Y." — Sophie đọc lại từng chữ ⇒ **Fennelly**. Hai chữ đôi ("double N", "double L") là chỗ hay thiếu chữ. Giọng Ireland: "double" có /ʊ/ ngắn, "Y" /waɪ/ rõ. 📘 Ôn Part 1 "quá dễ để sai": Tập 4 Ngày 1; giọng Ireland: Tập 4 Ngày 21.`, ev: `Declan Fennelly. That's F, E, double N, E, double L, Y.` },
    2: { a: ['fifth', '5th', '5'], vi: `"We're on the fourth floor. Sorry, no, I tell a lie, it's the fifth." — "I tell a lie" là cách người Anh – Ireland nói "tôi nói nhầm" ⇒ **fifth**. Sophie xác nhận "Fifth floor". Bẫy sửa số: "fourth" là con số ĐẦU TIÊN bạn nghe. Giọng Ireland: "fourth" có "r" rõ, "th" gần /t/.`, ev: `Sorry, no, I tell a lie, it's the fifth.` },
    3: { a: ['Mallow'], vi: `"Twenty-seven Mallow Lane… Mallow is M, A, double L, O, W" ⇒ **Mallow**. Số 27 đã in sẵn trên phiếu; chỉ điền tên đường. "like the town in Cork" chỉ là lời giải thích thêm.`, ev: `Mallow is M, A, double L, O, W, like the town in Cork.` },
    4: { a: ['21', '21st', 'twenty-first'], vi: `Ngày đầu tiên: "the fourteenth" — "completely full"; Sophie đề nghị thứ Sáu 13 hoặc thứ Bảy 21; Declan bận thứ Sáu ⇒ "it'll have to be the twenty-first" ⇒ **21**. Phiếu in "Saturday ___ March" — đối chiếu "Saturday": 13 là thứ Sáu nên chắc chắn sai.`, ev: `I'm not superstitious, but I'm working on the Friday, so it'll have to be the twenty-first.` },
    5: { a: ['wardrobe'], vi: `"There was going to be a piano, but my sister's taking that… So the big things are two sofas, the fridge-freezer, and an old oak wardrobe" ⇒ **wardrobe** (tủ quần áo). Bẫy: "piano" — món đồ ĐÃ bỏ khỏi danh sách. Phiếu đã có "oak" nên chỉ điền một từ.`, ev: `an old oak wardrobe that belonged to my grandmother` },
    6: { a: ['735'], vi: `Ba con số: £690 (giá chuẩn) → £900 (thêm dịch vụ đóng gói — Declan từ chối: "we'll pack ourselves") → "because it's a Saturday, there's a weekend charge of forty-five pounds on top, which brings you to £735" ⇒ **735**. Phiếu ghi "customer packing" nên loại 900; phải nghe tới phụ phí cuối tuần mới ra số đúng. 📘 Ôn bẫy số chuỗi: Tập 4 Ngày 1, Ngày 28.`, ev: `which brings you to £735` },
    7: { a: ['boxes'], vi: `"we'll deliver thirty boxes to the flat a week before, and there's no charge for those. Tape you'll need to buy" — "at no extra cost" = "no charge" ⇒ **boxes** (số nhiều). Bẫy "tape": thứ khách phải TỰ mua.`, ev: `we'll deliver thirty boxes to the flat a week before, and there's no charge for those` },
    8: { a: ['mirrors'], vi: `Declan hỏi về "glasses and plates" — được bảo hiểm; "The one thing we can't insure if you've packed it yourself is mirrors" ⇒ **mirrors**. Câu đề "If the customer packs ___ himself, they will not be insured" — "they" số nhiều ⇒ "mirrors" có "s". Bẫy "glasses / plates": nhắc trước để gài.`, ev: `The one thing we can't insure if you've packed it yourself is mirrors.` },
    9: { a: ['permit'], vi: `"you'll need to apply to the council for a temporary parking permit for our van… People sometimes ask the council to suspend the whole street, but… you don't need it. A permit is enough." ⇒ **permit**. "obtain… from the council" = "apply to the council for". Bẫy "suspension" (phong toả cả phố) — bị bác ngay.`, ev: `Then you'll need to apply to the council for a temporary parking permit for our van.` },
    10: { a: ['deposit'], vi: `Declan hỏi có phải trả hết không — "the full amount isn't due until the day of the move. To secure the date, we just ask for a deposit of ten per cent… you can pay it online." ⇒ **deposit** (tiền đặt cọc). "To reserve the date" = "To secure the date".`, ev: `To secure the date, we just ask for a deposit of ten per cent.` },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `Trận derby (A) và cơn mưa năm 2024 (C) đều bị bác: "Neither is right." — "The footbridge over the river is being strengthened… Since the bridge is where the whole procession normally crosses" ⇒ **B** ("work… on a structure the procession uses" = cầu đi bộ đang gia cố). Paraphrase mức 4: phương án không có chữ "bridge". 📘 Ôn MCQ dài Part 2: Tập 4 Ngày 4.`, ev: `The footbridge over the river is being strengthened at the moment` },
    12: { a: ['C'], vi: `Chợ đêm "isn't [new]… it's back for the fourth year" (loại A); pháo hoa "the council turned that down" (loại B); "What is new is a competition. Every primary school in the district has been invited to build a giant lantern" ⇒ **C**.`, ev: `What is new is a competition.` },
    13: { a: ['A'], vi: `"There's a common belief that they're just for children, and that isn't true" (loại B); năm nay miễn phí vì có nhà tài trợ trả tiền vật liệu (loại C); "Every place has to be reserved on our website beforehand" ⇒ **A** ("booked in advance" = "reserved… beforehand").`, ev: `Every place has to be reserved on our website beforehand, and once a session is full, it's full.` },
    14: { a: ['C'], vi: `"Please don't drive into the town centre" (loại A); chuyến tàu thêm "is no longer happening" (loại B); "by far the best way to come is the park-and-ride. Buses leave the football stadium every ten minutes" ⇒ **C**. Phải nối "park-and-ride" với câu sau mới thấy "bus from the stadium".`, ev: `So by far the best way to come is the park-and-ride.` },
    15: { a: ['B'], vi: `Lượng khách "about the same as last year" (loại A); tình nguyện viên cũ "nearly all of them are coming back" (loại C); "Because the procession can't cross it, it has to take a much longer way round… the route is now almost twice as long" ⇒ **B**. Câu này nối lại lý do của câu 11 — cây cầu.`, ev: `the route is now almost twice as long` },
    16: { a: ['A'], vi: `"If you walk north from the bandstand towards the river, you'll find it about halfway between the two, directly opposite the closed footbridge" ⇒ **A** (giữa sân khấu và sông, đối diện cầu). 📘 Ôn Map phức — phương hướng: Tập 4 Ngày 16.`, ev: `If you walk north from the bandstand towards the river, you'll find it about halfway between the two, directly opposite the closed footbridge.` },
    17: { a: ['D'], vi: `Bẫy: "People tend to look for it beside the bandstand" (H — chỗ CŨ). "As you come in through the gate, it's the tent immediately on your right" — đi vào từ cổng NAM, mặt hướng bắc ⇒ tay phải là phía ĐÔNG ⇒ **D**. Bên trái (C) là quầy thông tin. Lỗi hay gặp: lấy trái – phải theo tờ bản đồ thay vì theo hướng người bước vào.`, ev: `As you come in through the gate, it's the tent immediately on your right.` },
    18: { a: ['F'], vi: `"Last year we squeezed it in beside the lake, on the western side" (B — chỗ năm ngoái) — "This year the stalls are along the eastern edge of the park, next to the East Gate" ⇒ **F**.`, ev: `This year the stalls are along the eastern edge of the park, next to the East Gate` },
    19: { a: ['E'], vi: `"as far from the music as possible, so it's in the north-east corner of the park, right beside the river" ⇒ **E** (góc đông bắc, cạnh sông). "the music" = sân khấu Bandstand ở giữa — xa nhất là một góc.`, ev: `so it's in the north-east corner of the park, right beside the river` },
    20: { a: ['G'], vi: `"That used to be at the main gate" (C — chỗ cũ) — "now it's in the middle of the park, between the lake and the bandstand" ⇒ **G**. Bẫy H: cũng sát sân khấu nhưng ở phía ĐÔNG, không nằm giữa hồ và sân khấu.`, ev: `now it's in the middle of the park, between the lake and the bandstand` },

    /* ── Part 3 ── */
    21: { a: ['A'], vi: `Ben bác hai lý do người ta tưởng: hồ sơ của tổ chức "came later" (loại B); đề tài quá rộng "was fair, but I could have narrowed it down" (loại C); "What really did it was the literature search… almost nothing on why they give up" ⇒ **A**. "What really did it was…" = câu chẻ báo lý do THẬT. 📘 Ôn Part 3 bẫy đổi ý: Tập 4 Ngày 12, Ngày 28.`, ev: `What really did it was the literature search.` },
    22: { a: ['C'], vi: `Tỉ lệ trả lời 41% "is very respectable" (loại A); câu hỏi "clear and short" (loại B); "It's who answered… nearly everyone on that list is still volunteering. So the people your dissertation is actually about, the ones who left, hardly appear" ⇒ **C**.`, ev: `nearly everyone on that list is still volunteering` },
    23: { a: ['B'], vi: `Thiếu thời gian: "always as a secondary thing, almost an excuse" (loại A); mâu thuẫn với nhân viên "only came up once" (loại C); "What came up again and again was being given work that had nothing to do with what they could do" + kế toán bỏ thư vào phong bì, đầu bếp khuân thùng ⇒ **B**. Paraphrase mức 4: "abilities were not being used" phải suy từ hai ví dụ.`, ev: `What came up again and again was being given work that had nothing to do with what they could do.` },
    24: { a: ['A'], vi: `Ben hỏi có bỏ hẳn không — "No, don't throw it away" (loại B); "it can't be evidence for your question" (loại C — không giữ trong phần kết quả); "Use it in the introduction, to explain how the Trust is organised… As background, it's very useful." — Ben chốt "it becomes context rather than data" ⇒ **A**.`, ev: `OK, so it becomes context rather than data.` },
    25: { a: ['B', 'E'], vi: `Dr Okafor nói "Two things, and they matter": (E) Ben phải nêu rõ trong phần phương pháp việc anh từng làm tình nguyện ở đó hai năm ("Examiners will want to see that you've thought about your own position"); (B) "the literature review is far too long… cut it by about a third". Bị gạt: so sánh với tổ chức khác "there isn't time" (A), liên hệ thêm người cũ qua bản tin "the ethics committee would stop you" (C); phỏng vấn lại giám đốc không hề được đề nghị (D) ⇒ **B, E** (thứ tự nào cũng được). 📘 Ôn chọn TWO: Tập 4 Ngày 4.`, ev: `You need to state that clearly in the methodology, and say how you dealt with it` },
    26: { a: ['B', 'E'], vi: `Đáp án thứ hai của cặp 25–26: (B) "I'd like you to cut it by about a third and keep only what you actually use later" — "shorten the review of previous research" = cắt literature review. Ben tưởng nhắc trong lời cảm ơn là đủ — "That's not enough. It belongs in the methods." ⇒ **B, E**.`, ev: `I'd like you to cut it by about a third and keep only what you actually use later.` },
    27: { a: ['B'], vi: `Introduction: "most of its second half says the same things as the opening of the literature review, almost word for word in places" ⇒ **B** (lặp nội dung phần khác). Bẫy C: "One of them has to go" là bỏ đi, không phải chuyển lên trước. 📘 Ôn Matching ý kiến: Tập 4 Ngày 5.`, ev: `most of its second half says the same things as the opening of the literature review, almost word for word in places` },
    28: { a: ['F'], vi: `Methodology: "What's there is accurate, but there's hardly anything. Half a page… It needs to be three or four times the length." ⇒ **F** (không đủ chi tiết). "accurate" loại các phương án chê nội dung sai.`, ev: `What's there is accurate, but there's hardly anything.` },
    29: { a: ['A'], vi: `Findings: "The findings are the best thing in it, by some distance" ⇒ **A**. "the strongest part" = "the best thing in it"; "by some distance" = hơn hẳn.`, ev: `The findings are the best thing in it, by some distance.` },
    30: { a: ['E'], vi: `Conclusion: phỏng vấn 12 người ở MỘT ngân hàng thực phẩm mà kết luận về "why volunteers leave charities everywhere. Your evidence can't carry that." ⇒ **E** (khẳng định vượt quá bằng chứng). Bẫy: "It's well written" mở đầu — lời khen trước khi chê. Phương án D (nguồn cũ) không được nói về chương nào.`, ev: `Your evidence can't carry that.` },

    /* ── Part 4 ── */
    31: { a: ['machine'], vi: `"Later writers sometimes compared the city to a living organism, but that wasn't the image in the early brochures. The comparison you saw again and again was with a machine" ⇒ **machine**. Bẫy "organism": so sánh của người viết SAU, bị bác bằng "but that wasn't…". 📘 Ôn Note completion Part 4: Tập 4 Ngày 8, Ngày 20.`, ev: `The comparison you saw again and again was with a machine` },
    32: { a: ['technology'], vi: `"It wasn't, on the whole, city governments, and it certainly wasn't urban planners. The idea was promoted above all by large technology companies" ⇒ **technology**. Hai chủ thể bị bác đứng TRƯỚC đáp án.`, ev: `The idea was promoted above all by large technology companies` },
    33: { a: ['consulted'], vi: `"the people who actually lived in these cities were seldom consulted" — "rarely" = "seldom" ⇒ **consulted** (dạng quá khứ phân từ, sau "were").`, ev: `the people who actually lived in these cities were seldom consulted` },
    34: { a: ['maintain'], vi: `Lắp đặt thường được công ty / quỹ chính phủ trả; "the real expense came later… these systems were extremely expensive to maintain" ⇒ **maintain**. Bẫy "install": chi phí lắp đặt KHÔNG phải điều thành phố bất ngờ. "over time" = "long after the publicity had died down".`, ev: `many cities found that these systems were extremely expensive to maintain` },
    35: { a: ['surveillance'], vi: `"Critics warned that the same data could easily be used for the surveillance of ordinary citizens" ⇒ **surveillance** (sự giám sát). Chính tả: s-u-r-v-e-i-l-l-a-n-c-e (hai "l"). "ordinary people" = "ordinary citizens".`, ev: `Critics warned that the same data could easily be used for the surveillance of ordinary citizens` },
    36: { a: ['sea'], vi: `"the whole district was built on land reclaimed from the sea" — "land taken from the ___" = "land reclaimed from the sea" ⇒ **sea**. 📘 Ôn Table completion Part 4: Tập 4 Ngày 13.`, ev: `the whole district was built on land reclaimed from the sea` },
    37: { a: ['empty'], vi: `"many of the flats and offices remained empty long after they had been finished" ⇒ **empty**. Bẫy "quiet": "strangely quiet" là lời tả của khách tham quan về CẢ khu, còn bảng hỏi về căn hộ và văn phòng.`, ev: `many of the flats and offices remained empty long after they had been finished` },
    38: { a: ['floods'], vi: `"after heavy rain earlier that year had caused serious floods and landslides" ⇒ **floods** ("landslides" đã in sẵn trong bảng nên ô trống chỉ còn là floods; chép đúng dạng số nhiều của băng). Bẫy "rain": mưa là NGUYÊN NHÂN của lũ, không phải "serious ___".`, ev: `after heavy rain earlier that year had caused serious floods and landslides in which more than two hundred people died` },
    39: { a: ['waterfront'], vi: `"to develop a neighbourhood on the city's waterfront, on land that had been used for industry" ⇒ **waterfront** (khu ven hồ / ven nước). Một từ ghép, không tách "water front".`, ev: `to develop a neighbourhood on the city's waterfront` },
    40: { a: ['privacy'], vi: `"from the start the project was criticised, above all because of concerns about privacy… The arguments went on for more than two years." ⇒ **privacy**. Bẫy "economic uncertainty": lý do CÔNG TY nêu ra, nhưng bảng hỏi các cuộc tranh cãi kéo dài; bẫy "data" — chủ đề của tranh cãi, nhưng từ người giảng dùng cho mối lo là "privacy".`, ev: `above all because of concerns about privacy` },
  },
};
