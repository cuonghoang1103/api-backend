/**
 * Đề 7 — Speaking, GIỮA TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 15). TỰ SOẠN 18/11/2026.
 * Part 1: Books + Time management (Part 1 band 7: chi tiết + từ ít gặp — T4 N2) — 6 câu · Part 2: Describe a rule (cue card 3 ý
 * + explain; kể có câu chuyện nhỏ như T4 N6, N14) · Part 3: 5 câu khó dần fact → nguyên nhân–hệ quả "Why do some…?" (T4 N15) →
 * mức độ "To what extent…?" (T4 N11) → so xưa–nay (T4 N3) → dự đoán tương lai có hedging "How do you think… will change in the
 * future?" (T4 N7), nối chủ đề "quy tắc".
 * Khó hơn Đề 5 một bậc rưỡi: Part 1 có câu hỏi so sánh và câu hỏi về thói quen xấu của chính mình; Part 3 đòi lập luận chuỗi
 * nguyên nhân → hệ quả, nêu MỨC ĐỘ đồng ý và dự đoán có dè dặt. `mau`: câu trả lời mẫu band 7.0–7.5 (đích kế tiếp của người đang
 * ở 6.5) — dùng cấu trúc Tập 4 đã dạy (cụm danh từ phức N1, thì học thuật N3, phân từ N5, câu chẻ + đảo ngữ N7, hedging N7 + N13,
 * mệnh đề danh ngữ N11, tham chiếu N12, từ nối đúng liều N15); phân tích FC · LR · GRA · P bằng tiếng Việt. Phiên âm theo
 * Anh–Anh; chỉ nêu trọng âm của những từ thông dụng.
 */
import type { DeNoi } from './types';

export const NOI_DE7: DeNoi = {
  id: 'noi-de7',
  kyNang: 'noi',
  ten: 'Speaking — Đề 7 (giữa Tập 4)',
  boDe: 'Đề 7',
  capDo: 'Band 6.5',
  moTa: 'Part 1: books · time management · Part 2: a rule you had to follow at school or at work · Part 3: rules for children, rules in society',
  phut: 13,
  part1: [
    {
      chuDe: 'Books',
      cau: [
        'What kinds of books do you enjoy reading?',
        'Do you prefer reading on paper or on a screen?',
        'Is there a book that you would like to read again?',
      ],
    },
    {
      chuDe: 'Time management',
      cau: [
        'How do you plan your time when you have a lot to do?',
        'Are you ever late for things?',
        'What do you tend to waste time on?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a rule that you had to follow at school or at work.\n\nYou should say:\n• what the rule was\n• who made it\n• how people reacted to it\n\nand explain whether you think it was a good rule.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ (what · who · reactions · good or not), thêm MỘT chi tiết cụ thể (một buổi sáng, một người, một câu nói) để bài có câu chuyện nhỏ (Tập 4 Ngày 6).',
      'Chọn MỘT quy tắc thật và hơi "có vấn đề" thì dễ nói hơn quy tắc hiển nhiên: nộp điện thoại đầu giờ, đến sớm 15 phút để đọc sách, chỉ nói tiếng Anh trong giờ, không ăn ở bàn làm việc, mặc đồng phục. Quy tắc gây tranh cãi cho bạn nhiều thứ để kể ở ý 3 và ý 4.',
      'Thì: quá khứ đơn + "had to / were supposed to / weren\'t allowed to" cho quy tắc; "would" cho việc lặp lại ("anyone who was late would have to…"); hiện tại cho đánh giá bây giờ ("Looking back, I think…").',
      'Ý "whether it was a good rule" nói DÀI NHẤT và nên CÂN hai mặt rồi mới chốt (kể rồi cân — band 7): "On balance, yes — although the way it was enforced was a mistake." Tách QUY TẮC khỏi CÁCH THỰC THI là một cách đánh giá tinh tế.',
      'Thêm một cấu trúc band 7: câu chẻ "What annoyed people most was…" (Ngày 7), phân từ "Looking back, …" (Ngày 5), hoặc điều kiện loại 3 "If it hadn\'t been for that rule, I doubt I would have…". Câu kết: "So, all in all, it was a rule I resented at the time but I\'m grateful for now."',
    ],
    cauChot: [
      'Do you still follow that rule today?',
      'Did anyone ever break it?',
    ],
  },
  part3: [
    {
      chuDe: 'Rules for children and teenagers',
      cau: [
        'What kinds of rules do parents in your country usually set for their children?',
        'Why do some teenagers break rules even when they understand the reasons for them?',
        'To what extent should children be involved in making the rules they have to follow?',
      ],
    },
    {
      chuDe: 'Rules in society',
      cau: [
        'Do you think there are more rules in everyday life now than there were in the past?',
        'How do you think the rules about using technology will change in the future?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'How do you plan your time when you have a lot to do?',
      band: 'Band 7.0–7.5',
      s: 'I\'m a bit old-fashioned about it, actually — I write everything down on paper. Whenever things start to pile up, I make a list the night before and put the task I\'m dreading most right at the top, because if I leave it until the afternoon, I\'ll find any excuse not to do it. I also try to be realistic about how long things take, which I used to be hopeless at. I\'d assume an essay would take two hours, and it would swallow the whole day. So these days I more or less double my first estimate, and that tends to work out about right.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời thẳng bằng một nhận xét về bản thân ("I\'m a bit old-fashioned about it") rồi nêu HAI cách làm cụ thể, mỗi cách có lý do; có so xưa – nay ("which I used to be hopeless at… So these days…"). Khoảng 35 giây — Part 1 band 7 dài hơn band 6 nhờ CHI TIẾT, không nhờ thêm ý (Tập 4 Ngày 2). Từ đệm tự nhiên: "actually", "more or less".',
        '**LR (từ vựng)**: "things start to pile up" (việc dồn lại), "the task I\'m dreading most" (việc ngại nhất), "find any excuse not to do it", "hopeless at" (rất kém), "swallow the whole day" (nuốt cả ngày — ẩn dụ), "double my first estimate", "work out about right". Đây là từ "ít gặp" đúng nghĩa của band 7: không hiếm, nhưng người band 6 chỉ nói "I make a plan and do important things first".',
        '**GRA (ngữ pháp)**: cụm danh từ có mệnh đề quan hệ rút gọn "the task I\'m dreading most"; điều kiện loại 1 "if I leave it…, I\'ll find…"; mệnh đề quan hệ không xác định thay cả ý trước ", which I used to be hopeless at" (giới từ đứng cuối — văn nói); "would" cho thói quen quá khứ "I\'d assume… and it would swallow…"; "tends to" làm nhẹ khẳng định.',
        '**P (phát âm)**: nhấn tương phản "TWO hours… the WHOLE day"; "realistic" /ˌrɪəˈlɪstɪk/ nhấn âm ba; "estimate" (danh từ) /ˈestɪmət/ — đuôi /ət/, khác động từ /ˈestɪmeɪt/; "dreading" /ˈdredɪŋ/; nối âm "pile‿up", "work‿out‿about"; âm yếu "used to" /ˈjuːst tə/.',
        '**Muốn lên band 8**: thêm một cụm thành ngữ dùng đúng chỗ ("I eat the frog first, as they say") và một câu tự giễu ngắn ("…which sounds very organised, but half the list usually gets carried over to the next day").',
      ],
    },
    {
      part: 2,
      cau: 'Describe a rule that you had to follow at school or at work.',
      band: 'Band 7.0–7.5',
      s: 'I\'m going to talk about a rule from my secondary school, which was that every student had to be in the classroom fifteen minutes before the first lesson for what they called "silent reading".\n\nThe rule was brought in by a new head teacher when I was about fourteen. The idea was simple: you had to bring a book of your own choice — it couldn\'t be a textbook or a comic — and read it without talking until the bell rang. Anyone who turned up late would have to stand outside and miss it.\n\nAs you can imagine, it wasn\'t popular at first. We all groaned, because it meant getting up earlier, and I remember a lot of parents complaining at a meeting that their children were already exhausted. What annoyed people most, I think, was that nobody had been consulted. It was simply announced one Monday morning. For the first few weeks, half the class just stared at the same page.\n\nBut gradually something changed. Once it had become routine, people stopped fighting it, and you\'d hear classmates swapping books and arguing about endings, which had never happened before.\n\nLooking back, I think it was a good rule, on balance. I\'d hardly read anything for pleasure before that, and those fifteen minutes turned me into a reader — if it hadn\'t been for that rule, I doubt I would have picked up a novel until university. Where I think the school went wrong was the punishment. Making latecomers stand outside meant that the students who most needed to read were the ones who missed it, which rather defeated the purpose.\n\nSo, all in all, it was a rule I resented at the time but I\'m grateful for now.',
      phanTich: [
        '**FC**: đủ 4 ý trên thẻ theo thứ tự (quy tắc gì → ai đặt → mọi người phản ứng ra sao → có tốt không), và phần phản ứng có DIỄN BIẾN: phản đối lúc đầu → "But gradually something changed" → thành nếp. Chuyển ý rõ: "As you can imagine…", "What annoyed people most…", "Looking back…", "Where I think the school went wrong was…", "So, all in all…". Phần đánh giá dài nhất và cân hai mặt (quy tắc tốt, cách phạt sai). Nói thong thả khoảng 2 phút; câu kết báo đã xong.',
        '**LR**: "was brought in" (được ban hành), "of your own choice", "turned up late", "We all groaned" (rên rỉ phản đối), "nobody had been consulted" (không ai được hỏi ý), "stared at the same page", "swapping books", "read for pleasure", "turned me into a reader", "defeated the purpose" (phản tác dụng), "resented" (bực bội vì). Band 6 thường chỉ có "students didn\'t like it / it was useful".',
        '**GRA**: bị động quá khứ "was brought in", quá khứ hoàn thành bị động "nobody had been consulted"; "would have to" cho hệ quả lặp lại; câu chẻ (Tập 4 Ngày 7) "What annoyed people most… was that…", "Where I think the school went wrong was…"; phân từ mở câu "Looking back, …" (Ngày 5); "Once it had become routine" (quá khứ hoàn thành trong mệnh đề thời gian); điều kiện loại 3 dạng "if it hadn\'t been for…, I doubt I would have…"; mệnh đề quan hệ không xác định ", which had never happened before", ", which rather defeated the purpose".',
        '**P**: ngữ điệu kể chuyện (Tập 4 Ngày 6): chậm lại và hạ giọng ở "It was simply announced / one Monday morning", lên giọng ở "But gradually / something changed"; trọng âm: "consulted" /kənˈsʌltɪd/ âm hai, "exhausted" /ɪɡˈzɔːstɪd/ âm hai, "punishment" /ˈpʌnɪʃmənt/ âm đầu, "resented" /rɪˈzentɪd/ — chữ "s" đọc /z/; -ed: "groaned" /d/, "stopped" /t/, "announced" /t/; ngắt ý (Ngày 15): "Looking back, / I think it was a good rule, / on balance."',
        '**Muốn lên band 8**: thêm một chi tiết giác quan (sự im lặng lạ lùng của bốn mươi đứa trẻ lúc bảy giờ sáng), một câu đảo ngữ ("Not once were we asked what we thought") và một nhận xét khái quát ở cuối ("which is probably true of most rules — the idea is fine, it\'s the enforcement that ruins it").',
      ],
    },
    {
      part: 3,
      cau: 'To what extent should children be involved in making the rules they have to follow?',
      band: 'Band 7.0–7.5',
      s: 'To a considerable extent, I\'d say, though not completely. On everyday matters — how much screen time is reasonable, what time homework gets done — I think children ought to have a real say, because people of any age are far more likely to stick to a rule they\'ve helped to shape. It also teaches them to negotiate, which is a skill in itself. Where I\'d draw the line is anything to do with safety. A seven-year-old simply can\'t judge the risk of crossing a busy road, so there the adult has to decide, and explain why afterwards. So it\'s a sliding scale, really: the older the child and the lower the stakes, the more of a voice they should have.',
      phanTich: [
        '**FC**: dạng "To what extent…?" (Tập 4 Ngày 11) ⇒ nêu MỨC ĐỘ ngay câu đầu ("To a considerable extent… though not completely") → vùng ĐỒNG Ý + hai lý do → giới hạn ("Where I\'d draw the line is…") + ví dụ cụ thể (đứa trẻ bảy tuổi qua đường) → kết luận gói lại bằng một nguyên tắc ("a sliding scale"). Không trả lời "Yes, they should" rồi liệt kê.',
        '**LR**: "have a real say" (có tiếng nói thật sự), "stick to a rule", "helped to shape", "a skill in itself", "draw the line" (đặt giới hạn), "judge the risk", "a sliding scale" (thang trượt — mức độ thay đổi theo hoàn cảnh), "the lower the stakes" (việc càng ít hệ trọng), "have a voice". Nhiều cụm cố định dùng đúng ngữ cảnh — dấu hiệu LR band 7.',
        '**GRA**: lập luận nguyên nhân – hệ quả trong một câu dài không lỗi (Ngày 15): "…ought to have a real say, because people… are far more likely to stick to a rule they\'ve helped to shape"; câu chẻ "Where I\'d draw the line is…" (Ngày 7); mệnh đề quan hệ không xác định ", which is a skill in itself"; so sánh kép ba vế "the older the child and the lower the stakes, the more of a voice they should have"; "ought to" thay "should" cho đa dạng.',
        '**P**: nhấn từ chỉ mức độ: "To a conSIDerable extent… though NOT completely"; trọng âm tương phản (Ngày 11): "there the ADULT has to decide"; "negotiate" /nɪˈɡəʊʃieɪt/ nhấn âm hai; "considerable" /kənˈsɪdərəbl/ âm hai; ngắt hơi trước giới hạn: "…a skill in itself. / Where I\'d draw the line / is anything to do with safety."',
        '**Muốn lên band 8**: thêm một câu thừa nhận phản đề ("Some would argue that this undermines parental authority, but I think the opposite is true") và một ví dụ từ kinh nghiệm riêng về một quy tắc bạn từng được thương lượng.',
      ],
    },
    {
      part: 3,
      cau: 'How do you think the rules about using technology will change in the future?',
      band: 'Band 7.0–7.5',
      s: 'It\'s hard to say with any certainty, but my guess is that they\'ll become a good deal stricter. At the moment the law is lagging behind — things like AI-generated images, or the data that apps collect on children, are barely regulated in most countries. I suspect that\'s unlikely to last, because once there\'s been a serious scandal, governments tend to come under pressure to act. We may well see age limits on social media being enforced properly, for instance. Whether those rules will actually work is another matter, since technology has a habit of moving faster than the people who are trying to control it.',
      phanTich: [
        '**FC**: dạng dự đoán tương lai (Tập 4 Ngày 7) ⇒ mở bằng mức chắc chắn ("It\'s hard to say with any certainty, but my guess is…") → hiện trạng làm căn cứ ("At the moment the law is lagging behind") → cơ chế dẫn tới thay đổi (bê bối → sức ép → chính phủ hành động: lập luận chuỗi, Ngày 15) → một ví dụ dự đoán cụ thể → câu dè dặt cuối về hiệu quả. Dự đoán có CĂN CỨ và có GIỚI HẠN — khác hẳn "I think there will be more rules".',
        '**LR**: "a good deal stricter", "lagging behind" (tụt lại sau), "barely regulated" (hầu như chưa được quản lý), "come under pressure to act", "enforced properly" (thực thi nghiêm), "is another matter", "has a habit of + V-ing". Hedging đa dạng (Ngày 7, Ngày 13): "my guess is", "I suspect", "is unlikely to", "tend to", "may well" — năm cách nói dè dặt, không lặp "maybe".',
        '**GRA**: tương lai với nhiều mức chắc chắn: "they\'ll become" → "is unlikely to last" → "may well see"; hiện tại hoàn thành trong mệnh đề thời gian "once there\'s been a serious scandal"; bị động tiếp diễn sau "see + tân ngữ": "see age limits… being enforced"; mệnh đề danh ngữ làm chủ ngữ "Whether those rules will actually work is another matter" (Ngày 11); mệnh đề quan hệ "the data that apps collect on children", "the people who are trying to control it".',
        '**P**: ngắt nhóm ý (Ngày 15): "It\'s hard to say with any certainty, / but my guess is / that they\'ll become a good deal stricter."; "regulated" /ˈreɡjuleɪtɪd/ nhấn âm đầu; "scandal" /ˈskændl/; "certainty" /ˈsɜːtnti/ — âm /ɜː/ dài (Ngày 3); "technology" /tekˈnɒlədʒi/ âm hai; nối âm /w/ (Ngày 7): "to‿act" /tuːwækt/.',
        '**Muốn lên band 8**: thêm một so sánh lịch sử ngắn ("much as happened with cars — seat belts only became compulsory decades after the danger was obvious") và một cấu trúc đảo ngữ ("Only when the harm becomes visible do politicians tend to act").',
      ],
    },
  ],
};
