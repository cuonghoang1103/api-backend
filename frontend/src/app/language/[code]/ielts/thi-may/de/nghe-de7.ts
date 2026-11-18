/**
 * Đề 7 — Listening, GIỮA TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 15). TỰ SOẠN 18/11/2026.
 * Mức band 6.5 — khó hơn Đề 5 một bậc rưỡi: ~165 từ/phút (mục 4.2: Đề 7–9), lượt lời dài, hầu như mọi đáp án đứng SAU hai
 * phương án bị bác, paraphrase mức 3–4 (ý phải suy ra — "one person should have had the final say" = given one person overall
 * responsibility); Part 2 là sơ đồ HAI TẦNG (vị trí tầng trên tả theo phòng tầng dưới); Part 3 có BỐN người nói ngang hàng,
 * bốn giọng; Part 4 bài giảng dày số liệu, giọng Ireland.
 * Bối cảnh theo mục 4.2: hội thảo · toà nhà mới (map tầng) · 4 người đánh giá đồ án · bài giảng "trí nhớ".
 * GIỌNG: bảng 4.2 ghi "Scotland" cho Part 4 nhưng máy chủ KHÔNG có giọng Scotland (mục 5.1 #8) ⇒ dùng giọng Ireland thật
 * (`ie-nu`), không giả giọng; lời giải thích cũng chỉ nói "giọng Ireland".
 *   Part 1: Form + Table (T4 N1 "quá dễ để sai", N9; giọng US + NZ) · Part 2: MCQ dài + Plan hai tầng (T4 N4, N9; giọng UK) ·
 *   Part 3: MCQ + Matching ý kiến 4 người + chọn TWO (T4 N5, N12; giọng UK, US, AU, CA) · Part 4: Note + Summary (T4 N8, N13; giọng IE).
 * Bẫy chính: Tours → Cycles; £240, £180 → £195; vegetarian → nuts; car → train; 25 → 16; tablet → laptop; Harbour → Orchard;
 * manager → inspector; museum → aquarium; thời tiết / tiền → đổi thiết kế; vật liệu tái chế / quy mô → tự sản xuất năng lượng;
 * người trên 60 / sinh viên → người do bác sĩ giới thiệu; trả phí / chỉ cho nhân viên → phải đặt trước; quầy đón / lái xe →
 * khu vườn; cạnh quán cà phê → bên trái cửa vào; X-ray ↔ phòng khám nhi; số người đăng ký / thiết kế cốc → dữ liệu; cốc giao
 * muộn / quán đổi ý → chờ trường duyệt; ngại tham gia / cần đào tạo → góp ý cải tiến; tiền cọc thấp / mùa thi → chưa giải thích
 * được; họp nhiều hơn → cần một người chịu trách nhiệm; đọc tài liệu → gặp cố vấn sớm; mở rộng / tăng cọc / app → đổi nắp + giảm
 * giá; canoes → boats; hit ↔ smashed; four / five → quarter.
 * Dữ kiện về trí nhớ là kiến thức tâm lý học phổ biến, soạn theo trí nhớ — CHƯA đối chiếu lại nguồn trong phiên này: Bartlett
 * (Cambridge, sách 1932, truyện "The War of the Ghosts": ngắn lại, canoes → boats, săn hải cẩu → câu cá, bỏ chi tiết ma; schema);
 * Loftus & Palmer 1974 (phim tai nạn xe; "smashed" ≈ 41 dặm/giờ, "contacted" ≈ 32; một tuần sau khoảng 1/3 nhóm "smashed" nhớ có
 * kính vỡ, hơn gấp đôi nhóm "hit"); nghiên cứu "lạc ở trung tâm mua sắm" 1995 (4 sự kiện, 1 bịa, khoảng 1/4 người tin); Neisser
 * và vụ tàu con thoi Challenger 1986 (viết lại sau 2,5 năm; khoảng 1/4 sai gần hết, vẫn rất tự tin); khoảng 70% án oan được DNA
 * minh oan ở Mỹ có nhân chứng nhận nhầm người. Hội thảo Coastal Tourism Conference, công ty Tidewater Cycles, trung tâm Ferndale,
 * Dr Abara và mọi nhân vật trong Part 1–3 đều HƯ CẤU.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong lời thoại + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeNghe } from './types';

export const NGHE_DE7: DeNghe = {
  id: 'nghe-de7',
  kyNang: 'nghe',
  ten: 'Listening — Đề 7 (giữa Tập 4)',
  boDe: 'Đề 7',
  capDo: 'Band 6.5',
  moTa: 'Registering for a conference (US + NZ) · A new health centre & two-floor plan · Four students evaluate their project · Lecture on the reliability of memory (Irish speaker)',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — đăng ký dự hội thảo ════════════════ */
    {
      so: 1,
      tieuDe: 'Coastal Tourism Conference — registration',
      dan: 'Part 1. You will hear a man telephoning the office of a conference to register as a participant. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Callum (giọng New Zealand), chủ một công ty du lịch xe đạp nhỏ, gọi văn phòng hội thảo Coastal Tourism Conference để đăng ký; nhân viên Dana nói giọng Mỹ. Chú ý: tên công ty HIỆN NAY, mức phí anh thật sự phải trả, thứ anh KHÔNG ăn được, cách đi lại sau khi đổi ý; phần bảng: số chỗ SAU khi cắt giảm, thứ bắt buộc mang theo, phòng MỚI, nghề thật của người dẫn, nơi tổ chức bữa tối NĂM NAY.',
      docTruoc: 30,
      loi: [
        { ai: 'Dana', giong: 'us-nu', s: `Good afternoon, Coastal Tourism Conference office. This is Dana.` },
        { ai: 'Callum', giong: 'nz-nam', s: `Oh, hi. I'd like to register for the conference in March, please. I tried to do it online, but the form kept freezing on me.` },
        { ai: 'Dana', giong: 'us-nu', s: `I'm sorry about that. You're not the first. I can take your details over the phone. Could I have your name?` },
        { ai: 'Callum', giong: 'nz-nam', s: `Callum Haldane. That's H, A, L, D, A, N, E.` },
        { ai: 'Dana', giong: 'us-nu', s: `H, A, L, D, A, N, E. And which organisation are you with, Mr Haldane?` },
        { ai: 'Callum', giong: 'nz-nam', s: `Tidewater Cycles. You may have us on your list from two years ago as Tidewater Tours. We changed the name when we dropped the walking holidays and went over entirely to bikes. So it's Tidewater Cycles now.` },
        { ai: 'Dana', giong: 'us-nu', s: `Cycles. I'll update that. Now, the registration fee. The standard rate for the two days is £240.` },
        { ai: 'Callum', giong: 'nz-nam', s: `I thought there was an early rate. £180, wasn't it?` },
        { ai: 'Dana', giong: 'us-nu', s: `There was, but it closed last Friday, I'm afraid. How many staff does your company have?` },
        { ai: 'Callum', giong: 'nz-nam', s: `Seven, including me.` },
        { ai: 'Dana', giong: 'us-nu', s: `Then you qualify as a small business, and that brings it down to £195.` },
        { ai: 'Callum', giong: 'nz-nam', s: `Well, that's something. Go ahead with that.` },
        { ai: 'Dana', giong: 'us-nu', s: `Lunch is included on both days. Do you have any dietary requirements? Are you vegetarian, for instance?` },
        { ai: 'Callum', giong: 'nz-nam', s: `No, I eat meat and fish. The one thing I can't have is nuts. It's a proper allergy, so please do put it down.` },
        { ai: 'Dana', giong: 'us-nu', s: `I've written "no nuts", and the kitchen will be told. And how will you be travelling? I ask because parking at the venue is very limited.` },
        { ai: 'Callum', giong: 'nz-nam', s: `I was planning to drive up, but if parking's going to be a headache, I'll leave the car at home and come by train. The station's not far from the venue, is it?` },
        { ai: 'Dana', giong: 'us-nu', s: `Ten minutes on foot. Now, as well as the main talks, you can sign up for workshops. Were there any that you had in mind?` },
        { ai: 'Callum', giong: 'nz-nam', s: `Yes. The one about marketing on social media, on Thursday morning.` },
        { ai: 'Dana', giong: 'us-nu', s: `Let me check whether there's room. The programme says twenty-five places, but the trainer has asked us to cut that to sixteen, so that she can give everybody individual help. You're in luck: there are two left. You will need to bring a laptop with you, though. People ask if a tablet will do, and it won't, because the software she uses doesn't run on them.` },
        { ai: 'Callum', giong: 'nz-nam', s: `A laptop's fine. And on Thursday afternoon I'd like to do the one called "Dealing with complaints".` },
        { ai: 'Dana', giong: 'us-nu', s: `Good choice. That one's always popular. Make a note that it's moved, though. It was going to be in the Harbour Room, but we need that for the exhibition, so it'll be upstairs, in the Orchard Room.` },
        { ai: 'Callum', giong: 'nz-nam', s: `Orchard Room. And who's running it? The programme only gives a name, Joanna Reeve. I assumed she was a hotel manager.` },
        { ai: 'Dana', giong: 'us-nu', s: `A lot of people assume that. In fact, she spent twenty years as a hotel inspector, so she's seen every complaint there is.` },
        { ai: 'Callum', giong: 'nz-nam', s: `Even better. And is the dinner on Friday included in the fee?` },
        { ai: 'Dana', giong: 'us-nu', s: `It is. It starts at half past seven. Last year we held it at the museum, and some people found that rather cold, so this year it's at the town's aquarium. You eat surrounded by the tanks.` },
        { ai: 'Callum', giong: 'nz-nam', s: `As long as they're not serving fish.` },
        { ai: 'Dana', giong: 'us-nu', s: `I couldn't possibly say. I'll email your confirmation this afternoon, Mr Haldane.` },
      ],
      nhom: [
        {
          id: 'n1-form', tu: 1, den: 5, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Coastal Tourism Conference — Registration Form',
          dong: [
            'Name: Callum [[1]]',
            'Organisation: Tidewater [[2]]',
            'Fee to pay (two days): £[[3]]',
            'Lunch included — dietary requirement: no [[4]]',
            'Will travel to the conference by [[5]]',
          ],
        },
        {
          id: 'n1-table', tu: 6, den: 10, dang: 'table',
          huongDan: 'Complete the table below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Sessions booked',
          bang: {
            dau: ['Session', 'When / where', 'Notes'],
            hang: [
              ['Marketing on social media', 'Thursday morning', 'limited to [[6]] people; participants must bring a [[7]]'],
              ['Dealing with complaints', 'Thursday afternoon, in the [[8]] Room', 'led by a former hotel [[9]]'],
              ['Conference dinner', 'Friday, 7.30 p.m.', 'takes place at the town\'s [[10]]'],
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 2 — trung tâm y tế – sức khoẻ mới (sơ đồ hai tầng) ════════════════ */
    {
      so: 2,
      tieuDe: 'Ferndale Health and Wellbeing Centre',
      dan: 'Part 2. You will hear the manager of a new health centre talking to a group of volunteers before the building opens. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Graham, quản lý Trung tâm Sức khoẻ Ferndale sắp mở cửa, nói với nhóm tình nguyện viên: vì sao mở muộn, toà nhà có gì đặc biệt, thẻ phòng tập, bãi đỗ xe, chỗ đang thiếu người; rồi chỉ các phòng trên sơ đồ HAI tầng. Chú ý: mỗi câu trắc nghiệm có hai ý bị bác trước khi tới đáp án. Phần sơ đồ: tầng trệt bên trái, tầng một bên phải; cửa chính ở phía dưới, thang máy ở phía sau (phía trên hình); vị trí phòng tầng một được tả theo phòng NGAY BÊN DƯỚI nó ở tầng trệt ("directly above…").',
      docTruoc: 40,
      loi: [
        { ai: 'Graham', giong: 'uk-nam', s: `Good evening, and thank you all for coming. My name's Graham Ellis, and I'm the manager of the Ferndale Health and Wellbeing Centre, which finally opens its doors a week on Monday. As you've volunteered to help us, I'd like to tell you a little about the building, and then show you round it on the plan.` },
        { ai: 'Graham', giong: 'uk-nam', s: `I say "finally" because, as you'll know, we should have opened last autumn. I've heard people blame the wet winter, but in fact the builders lost barely a week to the weather. Nor was it a question of money. Unusually for a public project, we've come in slightly under budget. What held us up was the consultation with local residents. As a result of what you told us, the architects added a second lift and moved the main entrance so that it faces the square, and redrawing the plans cost us nearly five months. I think it was worth it.` },
        { ai: 'Graham', giong: 'uk-nam', s: `The building has had quite a lot of attention in the press. One article described it as being made entirely of recycled materials, which I'm afraid is an exaggeration: the timber in the café is second-hand, but that's all. And it certainly isn't big. There are only two floors. What does make it unusual is that, with the solar panels on the roof and a system that draws heat from the ground, it will produce the greater part of the energy it uses.` },
        { ai: 'Graham', giong: 'uk-nam', s: `Upstairs there's a small gym, and I should explain how membership works, because you'll be asked. Anyone can join at the full price. There's also a cheaper off-peak membership, and places on that are limited. We did consider reserving them for the over-sixties, or for students, as other centres do. In the end, we decided that first choice should go to people who've been sent to us by their own doctor: someone recovering from a heart operation, say. If there are places left over, they'll be offered to everybody else.` },
        { ai: 'Graham', giong: 'uk-nam', s: `Now, parking, which is the question I'm asked more than any other. The car park has only forty spaces. We were under some pressure to charge for it, and we've decided not to: it's free, however long you stay. And it isn't restricted to staff or to drivers with a disability, although some of the spaces by the door are marked for them. The condition is that you reserve your space on our website before you set out. Without a booking, the barrier won't lift.` },
        { ai: 'Graham', giong: 'uk-nam', s: `And so to you, our volunteers. A lot of you put your names down for the welcome desk, and thanks to that, we now have more than enough people there. We also asked for drivers for the minibus, but it turns out that the insurance requires a professional licence, so we'll be paying for those. Where we're really short of help is outdoors. There's a garden at the back for patients and visitors, and at the moment we have exactly two people to look after it. If any of you could spare a morning a week, please see me afterwards.` },
        { ai: 'Graham', giong: 'uk-nam', s: `Right. If you look at the plan, you'll see the two floors side by side, with the ground floor on the left. You come in through the main entrance, at the bottom. Reception is straight ahead of you, in the middle. The lift and the stairs are at the back, and the café is at the front, on your right.` },
        { ai: 'Graham', giong: 'uk-nam', s: `A lot of people expect to find the pharmacy next to the café. It isn't there. It's on the other side of the entrance: as you walk in, it's the first room on your left, in the front corner.` },
        { ai: 'Graham', giong: 'uk-nam', s: `Go on past reception towards the lift, and there's a room in each of the back corners. The one on the left is the X-ray department, which most visitors won't need. The children's clinic is the one on the right, at the back, behind the café. It has its own waiting area, with toys.` },
        { ai: 'Graham', giong: 'uk-nam', s: `Now take the lift up to the first floor. The gym I mentioned is at the front, directly above the pharmacy. Beside it, in the middle at the front, there's a smaller room with a large window looking out over the square. It sits right above the main entrance, and that's the community meeting room, which local groups can hire in the evenings.` },
        { ai: 'Graham', giong: 'uk-nam', s: `The counselling rooms need to be quiet and private, so we've put them as far from the gym as we could. They're at the back, in the corner directly above the children's clinic. The other back corner, above X-ray, is taken up by staff offices.` },
        { ai: 'Graham', giong: 'uk-nam', s: `Finally, the health library, where anyone can come and read about a medical condition or use a computer. That's at the front of the first floor, but not on the gym side. It's in the opposite corner, over the café.` },
        { ai: 'Graham', giong: 'uk-nam', s: `Do have a walk around after this. The staff will be happy to answer any questions.` },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 15, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'What was the main reason why the centre opened later than planned?', chon: [{ k: 'A', t: 'Bad weather interrupted the building work.' }, { k: 'B', t: 'Changes were made to the design.' }, { k: 'C', t: 'There was not enough money.' }] },
            { n: 12, s: 'According to the speaker, what is unusual about the building?', chon: [{ k: 'A', t: 'It will generate most of its own power.' }, { k: 'B', t: 'It is built entirely from recycled materials.' }, { k: 'C', t: 'It is larger than other centres of its kind.' }] },
            { n: 13, s: 'Who will be offered off-peak gym membership first?', chon: [{ k: 'A', t: 'people over the age of sixty' }, { k: 'B', t: 'students' }, { k: 'C', t: 'people recommended by a doctor' }] },
            { n: 14, s: 'What does the speaker say about the car park?', chon: [{ k: 'A', t: 'A space has to be booked in advance.' }, { k: 'B', t: 'A charge is made for long stays.' }, { k: 'C', t: 'It is reserved for staff and disabled drivers.' }] },
            { n: 15, s: 'Which job does the centre most need volunteers for?', chon: [{ k: 'A', t: 'welcoming visitors' }, { k: 'B', t: 'looking after the garden' }, { k: 'C', t: 'driving the minibus' }] },
          ],
        },
        {
          id: 'n2-map', tu: 16, den: 20, dang: 'map',
          huongDan: 'Label the plan below.\nWrite the correct letter, **A–G**, next to Questions 16–20.',
          tieuDe: 'Ferndale Health and Wellbeing Centre — ground floor and first floor',
          hop: { ds: 'ABCDEFG'.split('').map((k) => ({ k, t: k })) },
          cau: [
            { n: 16, s: 'Pharmacy' },
            { n: 17, s: 'Children\'s clinic' },
            { n: 18, s: 'Community meeting room' },
            { n: 19, s: 'Counselling rooms' },
            { n: 20, s: 'Health library' },
          ],
          hinh: {
            w: 600, h: 400,
            chuThich: 'Plan of the two floors (not to scale). The front of the building, with the main entrance, is at the bottom; the lift is at the back.',
            ve: [
              { t: 'text', x: 155, y: 40, s: 'GROUND FLOOR', co: 12, dam: true, giua: true },
              { t: 'text', x: 445, y: 40, s: 'FIRST FLOOR', co: 12, dam: true, giua: true },
              // ── Tầng trệt (trái) ──
              { t: 'rect', x: 30, y: 60, w: 250, h: 280, nen: '#f6f3ea' },
              { t: 'rect', x: 30, y: 60, w: 90, h: 100 },
              { t: 'rect', x: 120, y: 60, w: 70, h: 50, nen: '#e4e4e4', nhan: 'Lift' },
              { t: 'rect', x: 190, y: 60, w: 90, h: 100 },
              { t: 'rect', x: 120, y: 180, w: 70, h: 40, nen: '#dbe7f3', nhan: 'Reception' },
              { t: 'rect', x: 30, y: 240, w: 90, h: 100 },
              { t: 'rect', x: 190, y: 240, w: 90, h: 100, nen: '#f3e7d3', nhan: 'Café' },
              { t: 'line', d: [[155, 392], [155, 346]], mui: true },
              { t: 'text', x: 222, y: 384, s: 'Main entrance', co: 11, giua: true },
              // ── Tầng một (phải) ──
              { t: 'rect', x: 320, y: 60, w: 250, h: 280, nen: '#f6f3ea' },
              { t: 'rect', x: 320, y: 60, w: 90, h: 100 },
              { t: 'rect', x: 410, y: 60, w: 70, h: 50, nen: '#e4e4e4', nhan: 'Lift' },
              { t: 'rect', x: 480, y: 60, w: 90, h: 100 },
              { t: 'rect', x: 320, y: 240, w: 90, h: 100, nen: '#e3ecd6', nhan: 'Gym' },
              { t: 'rect', x: 410, y: 280, w: 70, h: 60 },
              { t: 'rect', x: 480, y: 240, w: 90, h: 100 },
              { t: 'text', x: 445, y: 384, s: '(square in front of the building)', co: 10, giua: true, nghieng: true },
              // Chữ cái
              { t: 'chu', k: 'A', x: 75, y: 290 },
              { t: 'chu', k: 'B', x: 75, y: 110 },
              { t: 'chu', k: 'C', x: 235, y: 110 },
              { t: 'chu', k: 'D', x: 365, y: 110 },
              { t: 'chu', k: 'E', x: 525, y: 110 },
              { t: 'chu', k: 'F', x: 525, y: 290 },
              { t: 'chu', k: 'G', x: 445, y: 310 },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 3 — bốn sinh viên tự đánh giá đồ án nhóm ════════════════ */
    {
      so: 3,
      tieuDe: 'Evaluating a group project',
      dan: 'Part 3. You will hear four students, Priya, Jake, Lachlan and Megan, evaluating a project in which they tested a scheme for reusable cups in two university cafés. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Bốn sinh viên ngang hàng — Priya (nữ, giọng Anh), Jake (nam, giọng Mỹ), Lachlan (nam, giọng Úc), Megan (nữ, giọng Canada) — tự đánh giá đồ án vừa làm xong: thử nghiệm cốc dùng lại (có đặt cọc) ở hai quán cà phê trong trường, để viết báo cáo đánh giá. Bốn người, hai nam hai nữ: phải theo TÊN được gọi và giọng. Chú ý: điểm mạnh cả nhóm ĐỒNG Ý, lý do thật khiến đồ án trễ, điều gây NGẠC NHIÊN ở nhân viên quán, kết luận về tỉ lệ trả cốc thấp; mỗi người nêu MỘT điều lẽ ra nên làm khác; hai khuyến nghị được CHỐT.',
      docTruoc: 40,
      loi: [
        { ai: 'Priya', giong: 'uk-nu', s: `Right. The evaluation report's due on the fifteenth, so let's work out what we actually think of our own project before we write anything. Shall we start with what went well?` },
        { ai: 'Jake', giong: 'us-nam', s: `Well, I'd have said the take-up. Four hundred and something people signed up for a cup in the first week.` },
        { ai: 'Megan', giong: 'ca-nu', s: `Signed up, yes, Jake, but fewer than half of them used it more than twice. I don't think we can call that a success.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `And I wouldn't boast about the cup itself, either. I thought the design was great until the complaints about the lid started coming in.` },
        { ai: 'Priya', giong: 'uk-nu', s: `What nobody can criticise is the data. Because every cup was scanned when it went out and again when it came back, we know exactly what happened to each one, day by day.` },
        { ai: 'Jake', giong: 'us-nam', s: `OK, I'll give you that. Dr Abara said she'd never had a student project with figures that complete.` },
        { ai: 'Megan', giong: 'ca-nu', s: `Agreed. So that's our strong point: the quality of the data.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `Yep, no argument from me.` },
        { ai: 'Priya', giong: 'uk-nu', s: `Now the difficult part. We started three weeks late. How do we explain that?` },
        { ai: 'Lachlan', giong: 'au-nam', s: `Wasn't it the cups? I remember us waiting around for a delivery.` },
        { ai: 'Megan', giong: 'ca-nu', s: `No, Lachlan. The cups came early, if anything. They sat in my room for a fortnight. And the cafés never caused us any trouble. Both managers said yes at the first meeting and never went back on it.` },
        { ai: 'Jake', giong: 'us-nam', s: `It was the paperwork. The university wouldn't let us handle people's deposits until the finance office and the ethics committee had both signed the project off, and that dragged on and on.` },
        { ai: 'Priya', giong: 'uk-nu', s: `That's right. So: waiting for the university's permission.` },
        { ai: 'Megan', giong: 'ca-nu', s: `Speaking of the cafés, can we say something about the staff? Because I'd been dreading that part. I assumed they'd see the whole thing as extra work and want nothing to do with it, and they couldn't have been more helpful.` },
        { ai: 'Jake', giong: 'us-nam', s: `And we set aside a whole afternoon to train them, remember? They'd got the hang of the scanner in about ten minutes.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `What I hadn't expected was how many ideas they'd have. It was one of the baristas who told us to put the return bin by the exit rather than at the counter. Returns went up by a third at that café the following week.` },
        { ai: 'Priya', giong: 'uk-nu', s: `That's what struck me, too: that they improved the scheme. Let's make that a point in the report. Then there's the big question. Why did so few cups come back at the library café?` },
        { ai: 'Jake', giong: 'us-nam', s: `To me, it's obvious. The deposit was a pound. Nobody's going to walk back across campus for a pound.` },
        { ai: 'Megan', giong: 'ca-nu', s: `But the deposit was a pound at the science café as well, and they got eighty per cent of their cups back. So it can't simply be that.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `Exams, then? People stop caring about anything else.` },
        { ai: 'Priya', giong: 'uk-nu', s: `The trouble is, the numbers at the library began to fall in week two, and exams didn't start until week four.` },
        { ai: 'Jake', giong: 'us-nam', s: `Hm. So neither explanation really holds up.` },
        { ai: 'Megan', giong: 'ca-nu', s: `Then I think we have to be honest and say that we can't account for it from what we've got. We'd need to go back and interview the people who kept their cups.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `Fair enough. Better that than pretending.` },
        { ai: 'Priya', giong: 'uk-nu', s: `Fine. Now, Dr Abara wants each of us to say what the group should have done differently. I'll start. I know some people on the course say that groups ought to meet more, but we met twice a week, and frankly, that was plenty. What we never had was somebody in charge. Every decision had to be argued out by all four of us, and some never got made at all. One person should have had the final say.` },
        { ai: 'Jake', giong: 'us-nam', s: `Mine's different. We launched in two cafés at once, for four weeks, without ever having tried the idea out anywhere. If we'd run it for just a few days at a single counter first, we'd have found out about the leaking lid before we'd handed out four hundred cups.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `For me, it's the statistics. We spent weeks reading articles, which I don't regret. But we didn't go near the statistics adviser until week six, and she told us in half an hour that our sample was arranged wrongly. We should have gone to her at the very beginning.` },
        { ai: 'Megan', giong: 'ca-nu', s: `And I'd say our problem was memory, basically. We'd agree something on a Monday, and by Thursday none of us could say for certain what it was. Nobody ever wrote anything down. A simple log of what we'd decided, and why, would have saved us a lot of arguments.` },
        { ai: 'Priya', giong: 'uk-nu', s: `Good. That's four different answers. Last thing: recommendations. I'd like to say that the scheme should go into every café on campus.` },
        { ai: 'Jake', giong: 'us-nam', s: `With a return rate that we can't explain? I think that's too soon, Priya.` },
        { ai: 'Priya', giong: 'uk-nu', s: `Hm. I suppose you're right. Leave it out.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `What about raising the deposit to two pounds?` },
        { ai: 'Megan', giong: 'ca-nu', s: `We've just agreed that we've no evidence the deposit was the problem.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `True. Scrap that. But the lid has to change. Forty-one written complaints. We can't ignore those.` },
        { ai: 'Megan', giong: 'ca-nu', s: `Definitely. A new lid goes in.` },
        { ai: 'Jake', giong: 'us-nam', s: `I still like the idea of an app instead of a deposit. You'd just scan your phone.` },
        { ai: 'Priya', giong: 'uk-nu', s: `It'd cost more than the entire project budget, Jake. Dr Abara would laugh.` },
        { ai: 'Jake', giong: 'us-nam', s: `OK, OK. Then how about what the manager of the science café suggested: ten pence off every drink if you bring the cup?` },
        { ai: 'Megan', giong: 'ca-nu', s: `Yes. It costs the café almost nothing, and it rewards people every single time rather than once.` },
        { ai: 'Lachlan', giong: 'au-nam', s: `I'm for that.` },
        { ai: 'Priya', giong: 'uk-nu', s: `Me too. So that's our two recommendations. I'll draft the introduction tonight.` },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 24, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'What do the students agree was the strongest aspect of their project?', chon: [{ k: 'A', t: 'the number of people who used the scheme' }, { k: 'B', t: 'the design of the cup' }, { k: 'C', t: 'the information that was collected' }] },
            { n: 22, s: 'Why did the project begin later than planned?', chon: [{ k: 'A', t: 'Official approval took a long time.' }, { k: 'B', t: 'The cups were delivered late.' }, { k: 'C', t: 'The cafés were slow to agree.' }] },
            { n: 23, s: 'What surprised the students about the café staff?', chon: [{ k: 'A', t: 'their unwillingness to take part' }, { k: 'B', t: 'their suggestions for improving the scheme' }, { k: 'C', t: 'the amount of training they needed' }] },
            { n: 24, s: 'What do the students conclude about the low return rate at the library café?', chon: [{ k: 'A', t: 'The deposit was too small.' }, { k: 'B', t: 'It was caused by the examination period.' }, { k: 'C', t: 'They lack the information to explain it.' }] },
          ],
        },
        {
          id: 'n3-match', tu: 25, den: 28, dang: 'match-feature',
          huongDan: 'What does each student think the group should have done differently?\nChoose **FOUR** answers from the box and write the correct letter, **A–F**, next to Questions 25–28.',
          hop: {
            tieuDe: 'The group should have',
            ds: [
              { k: 'A', t: 'held meetings more frequently' },
              { k: 'B', t: 'tested the scheme on a small scale first' },
              { k: 'C', t: 'given one person overall responsibility' },
              { k: 'D', t: 'asked for expert advice sooner' },
              { k: 'E', t: 'spent less time on background reading' },
              { k: 'F', t: 'kept a record of what was agreed' },
            ],
          },
          cau: [
            { n: 25, s: 'Priya' },
            { n: 26, s: 'Jake' },
            { n: 27, s: 'Lachlan' },
            { n: 28, s: 'Megan' },
          ],
        },
        {
          id: 'n3-mcq2', tu: 29, den: 30, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [29, 30],
            s: 'Which TWO recommendations do the students decide to include in their report?',
            chon: [
              { k: 'A', t: 'extending the scheme to every café on campus' },
              { k: 'B', t: 'replacing the lid of the cup' },
              { k: 'C', t: 'increasing the deposit' },
              { k: 'D', t: 'developing a phone app' },
              { k: 'E', t: 'giving a discount to people who use the cup' },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng: trí nhớ đáng tin tới đâu (giọng Ireland) ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — How reliable is memory?',
      dan: 'Part 4. You will hear part of a psychology lecture about the reliability of human memory. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Một giảng viên tâm lý học người Ireland giảng về độ tin cậy của trí nhớ: thí nghiệm kể lại truyện của Bartlett, thí nghiệm phim tai nạn xe của Loftus và Palmer, ký ức bị "cấy", rồi "ký ức chớp sáng" và hệ quả ở toà án. Giọng Ireland: phát âm rõ chữ "r" sau nguyên âm ("car", "word", "later"), "th" đôi khi nghe gần /t/ – /d/ ("think" gần "tink"), nguyên âm trong "film" có thể thành hai âm tiết ("fil-um"). Bài giảng không ai hỏi lại: bám tiêu đề nhỏ trong ghi chú; chú ý các con số gần nhau (four · five · a quarter · a third) và hai động từ "hit" / "smashed".',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'ie-nu', s: `Good afternoon. Last week we looked at how much we forget. Today I want to ask a more uncomfortable question: how accurate is the part that we do remember? Most of us think of memory as a kind of recording, a film stored somewhere in the head that we can play back whenever we like. I hope to persuade you that a better comparison is with a story, which we rewrite slightly every time we tell it.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `The first person to demonstrate this was the British psychologist Frederic Bartlett, who worked at Cambridge. In a book published in 1932, he described what happened when he gave his English students a Native American folk tale and asked them to retell it, sometimes days later and sometimes after several years. You might expect that they would simply lose details, and they did: the story got shorter. But what interested Bartlett was that it also changed. Things that were unfamiliar became familiar. The canoes of the original turned into boats, and the characters who had gone to hunt seals went fishing instead. And the ghosts in the tale, the part that his students found hardest to make sense of, were frequently left out altogether.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `Bartlett's conclusion was that we don't store events as they happened. We fit them into what he called a schema, by which he meant a framework made up of the things we already know and expect.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `His work was largely ignored for forty years. What brought it back was a series of experiments in the 1970s by the American psychologist Elizabeth Loftus. In the best known of them, carried out with John Palmer in 1974, students watched short films of car accidents and then answered questions. The key question was about speed, and it was worded differently for different groups. Some were asked how fast the cars were going when they hit each other. For others, the word was "smashed". Nothing else was altered: the verb was the only difference. Yet the "smashed" group gave an average estimate of nearly forty-one miles an hour, compared with about thirty-two for the mildest word that was tried. A single word had changed what people believed they'd seen.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `And it went further. A week later, the same students were asked whether they had seen any broken glass in the film. There wasn't any. But about a third of those who had heard the word "smashed" said yes, which was more than twice the proportion in the "hit" group. Now, it would be easy to assume that these people were just guessing, or trying to please the researcher. Loftus's argument was that the information supplied after the event had actually become part of the memory itself.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `She later showed that it's possible to go beyond altering a memory, and to create one. In a study published in 1995, volunteers were given a booklet describing four events from their childhood, which had been supplied by a relative. Three were true. The fourth, about being lost in a shopping centre at the age of five, had been invented. About a quarter of the volunteers came to accept it as real, and some added details of their own: what the person who found them had been wearing, for instance.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `What about memories that feel especially vivid, such as where you were when you heard a shocking piece of news? Psychologists call these flashbulb memories, and people are often certain that theirs are exact. In 1986, on the morning after the American space shuttle Challenger exploded, the psychologist Ulric Neisser asked his students to write down how they had heard about it. Two and a half years later, he asked them again. For around a quarter of them, the second account was wrong in almost every respect. A student who had originally been told by classmates now clearly remembered watching it on television with a roommate.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `What did not decline was their confidence. Shown the earlier version in their own handwriting, some of them insisted that it must be mistaken. So how sure a person feels tells us very little about whether that person is right.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `This matters outside the laboratory, and nowhere more than in the courts. Juries find a confident eyewitness extremely persuasive. Yet in the United States, of the convictions that have later been overturned by DNA evidence, around seventy per cent involved a witness who had identified the wrong person.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `In response, many police forces have changed their procedures. The officer who conducts an identification should now be someone who doesn't know which person is the suspect, so that he or she can't give anything away, even without meaning to. And the witness's level of certainty is written down immediately, before anything can happen to increase it.` },
        { ai: 'Lecturer', giong: 'ie-nu', s: `One last point, for those of you with exams approaching. None of this means that memory is hopeless. The same flexibility that allows it to be distorted is what allows us to update what we know. But it is a good reason to rely on your notes rather than on your impression of what was said, and that includes what I've said today.` },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 35, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'How reliable is memory?',
          dong: [
            '## Bartlett (1932)',
            '• students retold a folk tale: it grew shorter, and unfamiliar details were replaced (e.g. canoes became [[31]])',
            '• \'schema\' = a framework of existing knowledge and expectations',
            '## Loftus and Palmer (1974)',
            '• students watched films of car accidents and were asked to estimate the cars\' [[32]]',
            '• the question was the same for every group except for the [[33]] that was used',
            '• a week later, many of the \'smashed\' group reported seeing broken [[34]]',
            '## Creating a memory (1995)',
            '• volunteers read about four childhood events, one of which was false',
            '• approximately a [[35]] of them believed that the false event had happened',
          ],
        },
        {
          id: 'n4-summary', tu: 36, den: 40, dang: 'summary',
          huongDan: 'Complete the summary below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Flashbulb memories and the law',
          dong: [
            'A \'flashbulb memory\' is a vivid memory of the moment when a person heard some dramatic [[36]]. After the Challenger disaster, Neisser collected two accounts from each of his students, more than two years apart. Many of the later accounts were very different, but the students\' [[37]] in them remained high. This finding is especially important in the [[38]], where a mistaken [[39]] has played a part in many wrongful convictions. As a result, the police officer who carries out an identification is now often a person who does not know the identity of the [[40]].',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['Haldane'], vi: `"Callum Haldane. That's H, A, L, D, A, N, E." — Dana đọc lại đúng từng chữ ⇒ **Haldane**. Giọng New Zealand: chữ "A" /eɪ/ nghe hơi dẹt, chữ "E" /iː/ dễ nghe thành "I" nếu chưa quen — hãy đối chiếu với lượt Dana (giọng Mỹ) nhắc lại. 📘 Ôn Part 1 "quá dễ để sai": Tập 4 Ngày 1.`, ev: `Callum Haldane. That's H, A, L, D, A, N, E.` },
    2: { a: ['Cycles'], vi: `"Tidewater Cycles. You may have us on your list from two years ago as Tidewater Tours. We changed the name… So it's Tidewater Cycles now." ⇒ **Cycles** (có "s"). Bẫy tên CŨ: "Tours" là tên hai năm trước. Thiếu "s" là sai — đây là kiểu lỗi số nhiều mà Tập 4 Ngày 1 luyện.`, ev: `So it's Tidewater Cycles now.` },
    3: { a: ['195'], vi: `Ba mức phí: £240 (giá chuẩn), £180 (giá sớm — "it closed last Friday"), và vì công ty chỉ có bảy người: "you qualify as a small business, and that brings it down to £195" ⇒ **195**. Phải nghe tới "Go ahead with that" mới chắc đây là mức anh trả.`, ev: `Then you qualify as a small business, and that brings it down to £195.` },
    4: { a: ['nuts'], vi: `Dana gợi ý "vegetarian" — Callum: "No, I eat meat and fish. The one thing I can't have is nuts." — Dana ghi "no nuts" ⇒ **nuts** (số nhiều). Phiếu in sẵn "no ___" nên chỉ điền danh từ.`, ev: `The one thing I can't have is nuts.` },
    5: { a: ['train'], vi: `"I was planning to drive up, but if parking's going to be a headache, I'll leave the car at home and come by train." ⇒ **train**. Bẫy đổi ý: "drive / car" là kế hoạch BAN ĐẦU; "on foot" chỉ là quãng từ ga tới nơi họp.`, ev: `I'll leave the car at home and come by train.` },
    6: { a: ['16', 'sixteen'], vi: `"The programme says twenty-five places, but the trainer has asked us to cut that to sixteen" ⇒ **16**. Bẫy: 25 là con số IN trong chương trình; "two left" là số chỗ còn trống. Ở tốc độ này "sixteen" /ˌsɪksˈtiːn/ dễ lẫn "sixty" /ˈsɪksti/ — nghe trọng âm rơi vào âm cuối. 📘 Ôn Table completion khi nghe: Tập 3 Ngày 15, Tập 4 Ngày 13.`, ev: `The programme says twenty-five places, but the trainer has asked us to cut that to sixteen, so that she can give everybody individual help.` },
    7: { a: ['laptop'], vi: `"You will need to bring a laptop with you, though. People ask if a tablet will do, and it won't" ⇒ **laptop**. "must bring" = "will need to bring"; "tablet" bị bác ngay sau đó vì phần mềm không chạy.`, ev: `You will need to bring a laptop with you, though.` },
    8: { a: ['Orchard'], vi: `"It was going to be in the Harbour Room, but we need that for the exhibition, so it'll be upstairs, in the Orchard Room." — Callum nhắc lại "Orchard Room" ⇒ **Orchard**. Bẫy phòng CŨ: Harbour. Chính tả: o-r-c-h-a-r-d ("ch" đọc /tʃ/).`, ev: `so it'll be upstairs, in the Orchard Room` },
    9: { a: ['inspector'], vi: `Callum đoán "hotel manager" — Dana: "A lot of people assume that. In fact, she spent twenty years as a hotel inspector" ⇒ **inspector**. "former" = "spent twenty years as". "In fact" báo thông tin sửa lại điều vừa đoán.`, ev: `In fact, she spent twenty years as a hotel inspector, so she's seen every complaint there is.` },
    10: { a: ['aquarium'], vi: `"Last year we held it at the museum, and some people found that rather cold, so this year it's at the town's aquarium." ⇒ **aquarium** (chính tả: a-q-u-a-r-i-u-m). Bẫy quá khứ: "museum" là NĂM NGOÁI.`, ev: `so this year it's at the town's aquarium` },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `Thời tiết: "the builders lost barely a week" (loại A); tiền: "we've come in slightly under budget" (loại C); "What held us up was the consultation…: the architects added a second lift and moved the main entrance…, and redrawing the plans cost us nearly five months" — thay đổi THIẾT KẾ ⇒ **B**. Đáp án không dùng chữ "design": phải suy từ "added… moved… redrawing the plans". 📘 Ôn MCQ dài, phương án paraphrase: Tập 4 Ngày 4.`, ev: `What held us up was the consultation with local residents.` },
    12: { a: ['A'], vi: `"made entirely of recycled materials… is an exaggeration" (loại B — chỉ gỗ quán cà phê là đồ cũ); "it certainly isn't big" (loại C); "What does make it unusual is that… it will produce the greater part of the energy it uses" — "generate most of its own power" = "produce the greater part of the energy it uses" ⇒ **A**.`, ev: `it will produce the greater part of the energy it uses` },
    13: { a: ['C'], vi: `"We did consider reserving them for the over-sixties, or for students… In the end, we decided that first choice should go to people who've been sent to us by their own doctor" — "recommended by a doctor" = "sent to us by their own doctor"; "offered… first" = "first choice" ⇒ **C**. A và B là phương án ĐÃ CÂN NHẮC rồi bỏ ("We did consider… In the end…").`, ev: `In the end, we decided that first choice should go to people who've been sent to us by their own doctor` },
    14: { a: ['A'], vi: `Không thu phí: "it's free, however long you stay" (loại B); "it isn't restricted to staff or to drivers with a disability" (loại C); "The condition is that you reserve your space on our website before you set out. Without a booking, the barrier won't lift." ⇒ **A**. "booked in advance" = "reserve… before you set out".`, ev: `The condition is that you reserve your space on our website before you set out.` },
    15: { a: ['B'], vi: `Quầy đón: "we now have more than enough people there" (loại A); lái minibus cần bằng chuyên nghiệp nên trung tâm thuê người (loại C); "Where we're really short of help is outdoors. There's a garden at the back… we have exactly two people to look after it." ⇒ **B**. Phải nối "outdoors" với câu sau mới ra "garden".`, ev: `Where we're really short of help is outdoors.` },
    16: { a: ['A'], vi: `"A lot of people expect to find the pharmacy next to the café. It isn't there. It's on the other side of the entrance: as you walk in, it's the first room on your left, in the front corner." ⇒ **A** (tầng trệt, góc trước bên trái). Bẫy: "next to the café" là điều người ta TƯỞNG. 📘 Ôn Map / plan labelling: Tập 3 Ngày 12, Tập 4 Ngày 9.`, ev: `as you walk in, it's the first room on your left, in the front corner` },
    17: { a: ['C'], vi: `"there's a room in each of the back corners. The one on the left is the X-ray department… The children's clinic is the one on the right, at the back, behind the café." ⇒ **C** (tầng trệt, góc sau bên phải). Bẫy B: góc sau bên TRÁI là phòng X-quang — được nhắc trước để gài.`, ev: `The children's clinic is the one on the right, at the back, behind the café.` },
    18: { a: ['G'], vi: `Lên tầng một: phòng tập ở phía trước, trên hiệu thuốc; "Beside it, in the middle at the front, there's a smaller room… It sits right above the main entrance, and that's the community meeting room" ⇒ **G** (phòng nhỏ giữa, phía trước, ngay trên cửa chính). Phải ghép hai mốc: cạnh phòng tập + trên cửa chính.`, ev: `It sits right above the main entrance, and that's the community meeting room, which local groups can hire in the evenings.` },
    19: { a: ['E'], vi: `"we've put them as far from the gym as we could. They're at the back, in the corner directly above the children's clinic." — phòng khám nhi là C (góc sau phải tầng trệt) ⇒ phòng ngay phía trên là **E**. Bẫy D: góc sau còn lại, "above X-ray", là văn phòng nhân viên. Câu này buộc bạn nhớ đáp án câu 17 — sai câu 17 dễ sai luôn câu 19.`, ev: `They're at the back, in the corner directly above the children's clinic.` },
    20: { a: ['F'], vi: `"That's at the front of the first floor, but not on the gym side. It's in the opposite corner, over the café." ⇒ **F** (tầng một, góc trước bên phải, trên quán cà phê). "over" = "above". Bẫy G: cũng ở phía trước nhưng là phòng họp cộng đồng.`, ev: `It's in the opposite corner, over the café.` },

    /* ── Part 3 ── */
    21: { a: ['C'], vi: `Jake nêu số người đăng ký — Megan bác: chưa tới một nửa dùng quá hai lần (loại A); Lachlan: thiết kế bị phàn nàn về nắp (loại B); Priya: "What nobody can criticise is the data" — Jake: "I'll give you that", Megan: "Agreed… the quality of the data", Lachlan: "no argument from me" ⇒ cả bốn đồng ý ⇒ **C** ("the information that was collected" = "the data"). 📘 Ôn Part 3 bốn người nói: Tập 4 Ngày 5.`, ev: `So that's our strong point: the quality of the data.` },
    22: { a: ['A'], vi: `Lachlan đoán do cốc — Megan: "The cups came early, if anything" (loại B) và hai quản lý quán "said yes at the first meeting and never went back on it" (loại C); Jake: "It was the paperwork. The university wouldn't let us handle people's deposits until the finance office and the ethics committee had both signed the project off, and that dragged on and on." — Priya chốt: "waiting for the university's permission" ⇒ **A**.`, ev: `So: waiting for the university's permission.` },
    23: { a: ['B'], vi: `Megan TƯỞNG họ sẽ không muốn tham gia nhưng "they couldn't have been more helpful" (loại A); Jake: dành cả buổi chiều để đào tạo mà họ quen máy quét sau mười phút (loại C — bất ngờ là cần ÍT đào tạo, không phải nhiều); Lachlan: "What I hadn't expected was how many ideas they'd have" + ví dụ thùng trả cốc đặt ở lối ra; Priya: "That's what struck me, too: that they improved the scheme." ⇒ **B**.`, ev: `What I hadn't expected was how many ideas they'd have.` },
    24: { a: ['C'], vi: `Jake: tiền cọc một bảng quá thấp — Megan bác: quán khoa học cũng cọc một bảng mà thu về 80% (loại A); Lachlan: mùa thi — Priya bác: số liệu giảm từ tuần 2, thi tới tuần 4 mới bắt đầu (loại B); Jake: "neither explanation really holds up"; Megan: "we have to be honest and say that we can't account for it from what we've got" ⇒ **C**. "lack the information to explain it" = "can't account for it from what we've got". 📘 Ôn bẫy đổi ý, paraphrase nặng: Tập 4 Ngày 12.`, ev: `Then I think we have to be honest and say that we can't account for it from what we've got.` },
    25: { a: ['C'], vi: `Priya: "we met twice a week, and frankly, that was plenty (bác A). What we never had was somebody in charge… One person should have had the final say." — "given one person overall responsibility" ⇒ **C**. Paraphrase mức 4: không có chữ "responsibility" trong lời thoại. 📘 Ôn Matching ý kiến: Tập 4 Ngày 5.`, ev: `One person should have had the final say.` },
    26: { a: ['B'], vi: `Jake: "We launched in two cafés at once… without ever having tried the idea out anywhere. If we'd run it for just a few days at a single counter first, we'd have found out about the leaking lid…" — "tested the scheme on a small scale first" = chạy thử vài ngày ở MỘT quầy trước ⇒ **B**. Câu điều kiện loại 3 ("If we'd run… we'd have found out") là dấu hiệu "lẽ ra nên".`, ev: `If we'd run it for just a few days at a single counter first, we'd have found out about the leaking lid before we'd handed out four hundred cups.` },
    27: { a: ['D'], vi: `Lachlan: "We spent weeks reading articles, which I don't regret (bác E). But we didn't go near the statistics adviser until week six… We should have gone to her at the very beginning." — "asked for expert advice sooner" ⇒ **D**. Bẫy E: việc đọc tài liệu được nhắc nhưng anh nói rõ KHÔNG tiếc.`, ev: `We should have gone to her at the very beginning.` },
    28: { a: ['F'], vi: `Megan: "Nobody ever wrote anything down. A simple log of what we'd decided, and why, would have saved us a lot of arguments." — "kept a record of what was agreed" = "a simple log of what we'd decided" ⇒ **F**. Bẫy A: họ thống nhất vào thứ Hai rồi quên vào thứ Năm — vấn đề là không GHI lại, không phải họp ít.`, ev: `A simple log of what we'd decided, and why, would have saved us a lot of arguments.` },
    29: { a: ['B', 'E'], vi: `Hai khuyến nghị được chốt: (B) "the lid has to change" — Megan: "Definitely. A new lid goes in."; (E) giảm 10 xu mỗi đồ uống nếu mang cốc — Megan, Lachlan, Priya đều đồng ý. Ba ý bị gạt: mở rộng ra mọi quán ("too soon… Leave it out"), tăng tiền cọc ("no evidence… Scrap that"), làm app ("cost more than the entire project budget") ⇒ **B, E** (thứ tự nào cũng được). 📘 Ôn chọn TWO: Tập 4 Ngày 4.`, ev: `Definitely. A new lid goes in.` },
    30: { a: ['B', 'E'], vi: `Đáp án thứ hai của cặp 29–30: (E) "ten pence off every drink if you bring the cup" — "giving a discount to people who use the cup"; Megan: "it rewards people every single time rather than once", Lachlan: "I'm for that", Priya: "Me too. So that's our two recommendations." Mỗi đề xuất đều được NÊU rồi mới bị bác hoặc nhận — phải nghe phản ứng của người khác, không chỉ lời đề xuất ⇒ **B, E**.`, ev: `Then how about what the manager of the science café suggested: ten pence off every drink if you bring the cup?` },

    /* ── Part 4 ── */
    31: { a: ['boats'], vi: `"Things that were unfamiliar became familiar. The canoes of the original turned into boats, and the characters who had gone to hunt seals went fishing instead." — "became" = "turned into" ⇒ **boats** (số nhiều, theo "canoes"). Giọng Ireland: "boats" có nguyên âm /oː/ thẳng, không lướt như giọng Anh. 📘 Ôn Note completion Part 4: Tập 4 Ngày 8.`, ev: `The canoes of the original turned into boats, and the characters who had gone to hunt seals went fishing instead.` },
    32: { a: ['speed'], vi: `"The key question was about speed" — sinh viên phải ước lượng xe chạy nhanh bao nhiêu ("how fast the cars were going") ⇒ **speed**. Ghi chú đổi câu hỏi "how fast" thành danh từ.`, ev: `The key question was about speed, and it was worded differently for different groups.` },
    33: { a: ['verb', 'word'], vi: `Một nhóm nghe "hit", nhóm khác nghe "smashed": "Nothing else was altered: the verb was the only difference." — "the same… except for the ___ that was used" = "the only difference" ⇒ **verb** ("word" cũng được chấp nhận vì giảng viên nói "the word was 'smashed'" và "A single word had changed…").`, ev: `Nothing else was altered: the verb was the only difference.` },
    34: { a: ['glass'], vi: `"A week later, the same students were asked whether they had seen any broken glass in the film. There wasn't any. But about a third of those who had heard the word 'smashed' said yes" ⇒ **glass**. Ghi chú đã có "broken". Chú ý "a third" (1/3) ở đây khác "a quarter" (1/4) của câu 35.`, ev: `A week later, the same students were asked whether they had seen any broken glass in the film.` },
    35: { a: ['quarter'], vi: `"About a quarter of the volunteers came to accept it as real" — "approximately a ___ of them believed that the false event had happened" ⇒ **quarter**. Bẫy số: "four events", "the fourth", "the age of five" đứng ngay trước; "a third" thuộc thí nghiệm kính vỡ. 📘 Ôn số liệu trong bài giảng: Tập 4 Ngày 8.`, ev: `About a quarter of the volunteers came to accept it as real` },
    36: { a: ['news'], vi: `"memories that feel especially vivid, such as where you were when you heard a shocking piece of news" — "dramatic" = "shocking" ⇒ **news** (danh từ không đếm được, luôn có "s"). 📘 Ôn Summary completion khi nghe: Tập 4 Ngày 13.`, ev: `such as where you were when you heard a shocking piece of news` },
    37: { a: ['confidence'], vi: `"What did not decline was their confidence." — bản tóm tắt: "the students' ___ in them remained high" = "did not decline" ⇒ **confidence**. Câu chẻ "What did not decline was…" đẩy đáp án xuống CUỐI câu. Không điền "confident" (tính từ) — sau sở hữu cách cần danh từ.`, ev: `What did not decline was their confidence.` },
    38: { a: ['courts', 'court', 'courtroom'], vi: `"This matters outside the laboratory, and nowhere more than in the courts." — "especially important in the ___" = "nowhere more than in" ⇒ **courts**. Bẫy: "laboratory" — bài nói điều này quan trọng BÊN NGOÀI phòng thí nghiệm.`, ev: `This matters outside the laboratory, and nowhere more than in the courts.` },
    39: { a: ['witness', 'eyewitness'], vi: `"around seventy per cent involved a witness who had identified the wrong person" — "a mistaken ___" = "a witness who had identified the wrong person"; "wrongful convictions" = án bị DNA lật lại ⇒ **witness** ("eyewitness" — một từ, giảng viên cũng dùng — được chấp nhận).`, ev: `around seventy per cent involved a witness who had identified the wrong person` },
    40: { a: ['suspect'], vi: `"The officer who conducts an identification should now be someone who doesn't know which person is the suspect" — "does not know the identity of the ___" ⇒ **suspect** (danh từ, nhấn âm ĐẦU /ˈsʌspekt/; động từ nhấn âm hai). Bẫy: "witness" — nhân chứng là người đi nhận diện, không phải người bị giấu danh tính.`, ev: `The officer who conducts an identification should now be someone who doesn't know which person is the suspect` },
  },
};
