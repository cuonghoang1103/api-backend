/**
 * Đề 5 — Speaking, THI CUỐI TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 30). TỰ SOẠN 18/11/2026.
 * Part 1: Music + Sleep (12 khung câu hỏi Part 1 — T3 N3) — 6 câu · Part 2: Describe a change (cue card 3 ý + explain; kể
 * "trước – sau" như T3 N22) · Part 3: 5 câu khó dần fact → "Why do you think…?" (T3 N6) → tường thuật ý người khác "Some people
 * say…" (T3 N19) → đánh giá "Is it a good thing that…?" (T3 N23) → giả định "What would happen if…?" (T3 N15), nối chủ đề
 * "thay đổi".
 * Khó hơn Đề 4 một bậc: Part 1 có câu hỏi ý kiến ("Do you think everyone should…?"); Part 3 đòi tường thuật – phản biện ý
 * người khác và đánh giá hai mặt. `mau`: câu trả lời mẫu band 6.5–7.0 (đích kế tiếp của người đang ở 6.0) — dùng cấu trúc Tập 3
 * đã dạy (used to + hiện tại hoàn thành tiếp diễn N1, verb patterns N7, so sánh nâng cao N11, chunks N11, điều kiện loại 2–3
 * N15, mệnh đề quan hệ không xác định N17, tường thuật N19, nhượng bộ N21, mệnh đề danh ngữ N23); phân tích FC · LR · GRA · P
 * bằng tiếng Việt. Phiên âm theo Anh–Anh; chỉ nêu trọng âm của những từ thông dụng.
 */
import type { DeNoi } from './types';

export const NOI_DE5: DeNoi = {
  id: 'noi-de5',
  kyNang: 'noi',
  ten: 'Speaking — Đề 5 (thi cuối Tập 3)',
  boDe: 'Đề 5',
  capDo: 'Band 6.0',
  moTa: 'Part 1: music · sleep · Part 2: a positive change you made in your life · Part 3: change in people\'s lives, change in society',
  phut: 13,
  part1: [
    {
      chuDe: 'Music',
      cau: [
        'What kind of music do you usually listen to?',
        'Has the music you like changed since you were a child?',
        'Do you think everyone should learn to play a musical instrument?',
      ],
    },
    {
      chuDe: 'Sleep',
      cau: [
        'How many hours do you usually sleep at night?',
        'Do you ever have a nap during the day?',
        'What do you do when you can\'t fall asleep?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a positive change that you made in your life.\n\nYou should say:\n• what the change was\n• when you made it\n• why you decided to make it\n\nand explain how this change has affected your life.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ (what · when · why · effect), thêm 1 chi tiết "trước" và 1 chi tiết "sau" để dễ so sánh.',
      'Chọn MỘT thay đổi thật, do CHÍNH BẠN quyết định: dậy sớm, bỏ mạng xã hội, bắt đầu chạy bộ, đổi ngành học, chuyển ra ở riêng, ăn uống lành mạnh. Thay đổi nhỏ nhưng kể cụ thể vẫn hơn thay đổi lớn mà kể chung chung.',
      'Thì: "used to" cho thói quen CŨ ("I used to stay up until 2 a.m."), quá khứ đơn cho lúc quyết định, và hiện tại hoàn thành (tiếp diễn) cho kết quả kéo tới nay: "I\'ve been getting up at six ever since." (Tập 3 Ngày 1).',
      'Ý "how this change has affected your life" nói DÀI NHẤT: 2 tác động (vd. sức khoẻ + việc học), mỗi tác động có ví dụ. Dùng so sánh nâng cao (Ngày 11): "far more focused", "nowhere near as tired as I used to be".',
      'Thêm một câu giả định để ghi điểm ngữ pháp (Ngày 15): "If I hadn\'t made that change, I would probably have failed the course." Câu kết: "So that\'s a change I\'m really glad I made."',
    ],
    cauChot: [
      'Was it easy to make this change?',
      'Would you recommend this change to other people?',
    ],
  },
  part3: [
    {
      chuDe: 'Change in people\'s lives',
      cau: [
        'What are the biggest changes that people in your country go through in their twenties?',
        'Why do you think some people find it hard to accept change?',
        'Some people say that older people cannot change their habits. What do you think?',
      ],
    },
    {
      chuDe: 'Change in society',
      cau: [
        'Is it a good thing that technology is changing the way we live so quickly?',
        'What would happen if people refused to change their lifestyle to protect the environment?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Has the music you like changed since you were a child?',
      band: 'Band 6.5–7.0',
      s: 'Yes, it\'s changed completely. When I was little, I just listened to whatever my parents played in the car, which was mostly old love songs from the nineties. As a teenager I got into pop and a bit of hip-hop, mainly because that\'s what all my classmates were listening to. These days I\'ve been listening to a lot of instrumental music, like piano or lo-fi, because I can\'t concentrate on my work if there are lyrics. So I suppose my taste has followed my lifestyle, really.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời thẳng ("Yes, it\'s changed completely") rồi đi theo BA mốc thời gian: "When I was little…" → "As a teenager…" → "These days…", mỗi mốc có lý do; câu cuối rút ra nhận xét chung ("my taste has followed my lifestyle"). Câu hỏi về thay đổi luôn theo khung xưa – nay – lý do. Khoảng 30 giây — vừa đủ cho Part 1.',
        '**LR (từ vựng)**: "got into" (bắt đầu thích — cụm động từ tự nhiên hơn "started to like"), "instrumental music" (nhạc không lời), "lyrics" (lời bài hát), "my taste" (gu). "whatever my parents played" — "whatever" giúp câu nghe như người bản ngữ. Chunk văn nói (Tập 3 Ngày 11): "I suppose…", "…, really."',
        '**GRA (ngữ pháp)**: hiện tại hoàn thành cho thay đổi tới nay ("it\'s changed", "has followed"); hiện tại hoàn thành tiếp diễn cho thói quen gần đây ("I\'ve been listening to…" — Tập 3 Ngày 1); mệnh đề quan hệ không xác định "…in the car, which was mostly old love songs" (Ngày 17); "that\'s what all my classmates were listening to" (mệnh đề danh ngữ + quá khứ tiếp diễn).',
        '**P (phát âm)**: "listened" /ˈlɪsnd/ — chữ "t" câm, đuôi -ed đọc /d/; "lyrics" /ˈlɪrɪks/ nhấn âm đầu; "instrumental" /ˌɪnstrəˈmentl/ nhấn âm ba; "concentrate" /ˈkɒnsntreɪt/ nhấn âm đầu; nối âm: "got‿into", "a bit‿of".',
        '**Muốn lên 7.5**: thêm một từ ít gặp hơn ("nostalgic", "catchy", "background music") và một chi tiết cảm xúc ("I still know every word of those old songs, though").',
      ],
    },
    {
      part: 2,
      cau: 'Describe a positive change that you made in your life.',
      band: 'Band 6.5–7.0',
      s: 'I\'d like to talk about a change to my daily routine, which was becoming a morning person.\n\nI made this change about a year and a half ago, at the start of my second year at university. Before that, I used to stay up until two or three in the morning, scrolling on my phone or watching videos, and then drag myself out of bed five minutes before class. I was always tired, and I kept missing breakfast.\n\nWhat made me decide to change was actually a bad exam result. I failed a mid-term test in a subject I normally enjoy, and I realised I couldn\'t remember anything from the morning lectures because I\'d been half asleep in all of them. So I set myself a simple rule: phone off at eleven, alarm at six.\n\nThe first two weeks were awful, to be honest. I felt worse, not better. But I kept going, and after about a month my body got used to it.\n\nAs for how it has affected my life, the biggest difference is my energy. I\'m nowhere near as tired as I used to be, and I can concentrate for far longer. I also have a quiet hour before anyone else in my house is awake, which I use for exercise or for reviewing my notes. My grades have improved as well. If I hadn\'t changed my sleeping habits, I would probably have failed that course at the end of the year.\n\nThe only disadvantage is that I\'m useless at parties now, because I start yawning at ten o\'clock. But overall, it\'s a change I\'m really glad I made.',
      phanTich: [
        '**FC**: đủ 4 ý trên thẻ theo thứ tự (thay đổi gì → khi nào → vì sao → ảnh hưởng), có đoạn "trước" (thức tới 2–3 giờ) để làm nền cho "sau". Chuyển ý bằng cụm rõ ràng: "Before that…", "What made me decide to change was…", "As for how it has affected my life…", "But overall…". Phần ảnh hưởng dài nhất, có ba tác động + một nhược điểm hài hước. Nói thong thả khoảng 2 phút. Câu kết báo đã xong.',
        '**LR**: "a morning person" (người dậy sớm), "stay up" (thức khuya), "scrolling on my phone" (lướt điện thoại), "drag myself out of bed" (lê khỏi giường — hình ảnh), "half asleep", "set myself a simple rule", "got used to it", "I\'m useless at parties". Từ nối thái độ: "actually", "to be honest". Band 5–6 thường chỉ có "sleep late / wake up early / feel better".',
        '**GRA**: "used to stay up" cho thói quen cũ; quá khứ hoàn thành tiếp diễn "I\'d been half asleep" cho việc kéo dài TRƯỚC lúc nhận ra; verb patterns (Tập 3 Ngày 7): "kept missing", "decide to change", "kept going", "start yawning"; câu chẻ "What made me decide to change was…"; so sánh nâng cao (Ngày 11): "nowhere near as tired as I used to be", "for far longer"; mệnh đề quan hệ không xác định ", which I use for exercise"; điều kiện loại 3 "If I hadn\'t changed…, I would probably have failed…" (Ngày 15).',
        '**P**: "used to" /ˈjuːst tə/ — âm /s/; "would have" đọc nối /ˈwʊdəv/; -ed: "failed" /feɪld/ → /d/ (một âm tiết), "realised" /ˈrɪəlaɪzd/ → /d/, "improved" /ɪmˈpruːvd/ → /d/; trọng âm: "routine" /ruːˈtiːn/ âm hai, "concentrate" /ˈkɒnsntreɪt/ âm đầu, "disadvantage" /ˌdɪsədˈvɑːntɪdʒ/ âm ba; ngắt hơi sau cụm mở: "As for how it has affected my life, / the biggest difference is my energy".',
        '**Muốn lên 7.5**: thêm một thành ngữ vừa phải ("it was a real wake-up call", "I turned over a new leaf"), một câu nhượng bộ ("Even though it sounds like a small thing, it changed almost everything else") và chi tiết giác quan của buổi sáng yên tĩnh.',
      ],
    },
    {
      part: 3,
      cau: 'Some people say that older people cannot change their habits. What do you think?',
      band: 'Band 6.5–7.0',
      s: 'I can see why people say that, but I think it\'s an exaggeration. It\'s true that habits get stronger the longer you have them, so someone who has drunk coffee at six every morning for forty years is unlikely to stop. But "cannot" is too strong. My grandmother, for instance, had never touched a smartphone until she was seventy, and now she video-calls us every evening and even pays her bills online. What made the difference was that she had a strong reason to learn. So I\'d say older people can change, but they need to see the point of it, whereas young people will often try something new just because it\'s new.',
      phanTich: [
        '**FC**: dạng tường thuật ý người khác "Some people say…" (Tập 3 Ngày 19) ⇒ khung: thừa nhận ("I can see why people say that") → nêu lập trường ("but I think it\'s an exaggeration") → phần đúng của ý kia ("It\'s true that…") → phản biện có ví dụ cụ thể (bà ngoại) → kết luận có điều kiện. Không chỉ nói "I disagree" rồi dừng.',
        '**LR**: "an exaggeration" (nói quá), "is unlikely to stop", "\'cannot\' is too strong" (bình luận chính TỪ NGỮ của câu hỏi — dấu hiệu band 7), "video-calls us", "see the point of it" (thấy được ý nghĩa). Chunks: "I can see why…", "I\'d say…", "for instance".',
        '**GRA**: so sánh kép "habits get stronger the longer you have them" (Tập 3 Ngày 11); hiện tại hoàn thành trong mệnh đề quan hệ "someone who has drunk coffee… for forty years"; quá khứ hoàn thành "had never touched a smartphone until she was seventy"; câu chẻ "What made the difference was that…"; đối lập bằng "whereas" (Ngày 21).',
        '**P**: nhấn tương phản vào từ bị bàn: "but \'CANNOT\' is too strong"; "exaggeration" /ɪɡˌzædʒəˈreɪʃn/ nhấn âm bốn; "unlikely" /ʌnˈlaɪkli/ âm hai; /s/ – /z/ cuối (Ngày 19): "habits" /s/, "pays" /z/, "bills" /z/; ngắt hơi trước "whereas".',
        '**Muốn lên 7.5**: thêm ý trừu tượng hơn ("the older we get, the more we have invested in our routines, so change feels like a loss") và một cách nói giảm ("I wouldn\'t go as far as to say…").',
      ],
    },
    {
      part: 3,
      cau: 'Is it a good thing that technology is changing the way we live so quickly?',
      band: 'Band 6.5–7.0',
      s: 'On the whole, yes, although the speed worries me a little. The benefits are obvious: we can work from anywhere, see a doctor online, or learn almost anything for free, which simply wasn\'t possible twenty years ago. What concerns me is that not everyone can keep up. Many older people, and people in rural areas, struggle with apps that the rest of us take for granted, so they can end up being left behind. It\'s also hard for the law to react in time, as we\'ve seen with online privacy. So I think it\'s a good thing in itself, but it would be better if the changes were introduced a bit more carefully.',
      phanTich: [
        '**FC**: dạng đánh giá "Is it a good thing that…?" (Tập 3 Ngày 23) ⇒ lập trường có mức độ ngay câu đầu ("On the whole, yes, although…") → mặt tốt + ba ví dụ → mặt đáng lo ("What concerns me is that…") + hai nhóm bị ảnh hưởng + một ví dụ về luật → kết luận hai vế. Đánh giá CẢ HAI mặt rồi mới chốt là thứ band 6.5+ cần.',
        '**LR**: "On the whole" (nhìn chung), "keep up" (theo kịp), "take for granted" (coi là hiển nhiên), "end up being left behind" (rốt cuộc bị bỏ lại), "react in time", "online privacy", "in itself" (tự thân nó). Đều là cụm cố định — học cả cụm.',
        '**GRA**: nhượng bộ "although the speed worries me" (Tập 3 Ngày 21); mệnh đề quan hệ không xác định thay cả ý trước: ", which simply wasn\'t possible twenty years ago" (Ngày 17); mệnh đề danh ngữ làm chủ ngữ "What concerns me is that not everyone can keep up" (Ngày 23); "end up + V-ing" + bị động "being left behind"; điều kiện loại 2 "it would be better if the changes were introduced…" (Ngày 15).',
        '**P**: ngữ điệu đối lập (Tập 3 Ngày 23): lên giọng ở "On the whole, YES", hạ và chậm lại ở "although the speed worries me"; "technology" /tekˈnɒlədʒi/ nhấn âm hai; "privacy" /ˈprɪvəsi/ (Anh–Anh) nhấn âm đầu; "obvious" /ˈɒbviəs/ ba âm tiết; nối âm "end‿up", "left‿behind".',
        '**Muốn lên 7.5**: thêm một ví dụ có tên cụ thể (thanh toán không tiền mặt, AI trong lớp học) và một cấu trúc cân nhắc: "The benefits clearly outweigh the drawbacks, provided that nobody is excluded."',
      ],
    },
  ],
};
