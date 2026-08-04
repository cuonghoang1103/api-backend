/**
 * TUẦN 4 — Tiếng Anh nơi làm việc (Ngày 16–20).
 *
 * Tuần này bắc cầu từ giao tiếp đời thường sang môi trường công sở, để sau 20
 * ngày bạn bước thẳng được vào phần "Cho Dev" (phỏng vấn, họp khách hàng,
 * quay video) mà không hụt.
 */
import type { WeekBlock } from './types';

export const WEEK_4: WeekBlock = {
  week: 4,
  title: 'Tiếng Anh nơi làm việc',
  subtitle:
    'Trao đổi công việc, họp hành, email, small talk công sở và kể chuyện — bước đệm sang ' +
    'phần phỏng vấn và làm việc với khách hàng.',
  days: [
    /* ══════════════════ NGÀY 16 ══════════════════ */
    {
      day: 16,
      icon: '💼',
      title: 'Công việc hằng ngày',
      goal: 'Báo cáo tiến độ, hỏi việc, nói về deadline và khối lượng công việc.',
      qa: [
        {
          q: { en: 'How’s the project going?', vi: 'Dự án thế nào rồi?', ipa: '/haʊz ðə ˈprɒdʒekt/' },
          answers: [
            { en: 'It’s going well. We’re on track.', vi: 'Đang ổn. Chúng tôi đúng tiến độ.', ipa: '/ɒn træk/' },
            { en: 'We’re a bit behind, but catching up.', vi: 'Chúng tôi hơi chậm, nhưng đang bắt kịp.', ipa: '/bɪˈhaɪnd/' },
            { en: 'Almost done — just testing now.', vi: 'Gần xong rồi — giờ chỉ còn kiểm thử.', ipa: '/ˈɔːlməʊst dʌn/' },
          ],
        },
        {
          q: { en: 'What are you working on?', vi: 'Bạn đang làm gì?', ipa: '/ˈwɜːkɪŋ ɒn/' },
          answers: [
            { en: 'I’m working on the login feature.', vi: 'Tôi đang làm tính năng đăng nhập.', ipa: '/ˈfiːtʃər/' },
            { en: 'I’m fixing a bug in the payment flow.', vi: 'Tôi đang sửa lỗi trong luồng thanh toán.', ipa: '/ˈpeɪmənt fləʊ/' },
            { en: 'I just picked up a new task this morning.', vi: 'Sáng nay tôi vừa nhận một việc mới.', ipa: '/pɪkt ʌp/' },
          ],
        },
        {
          q: { en: 'When can you have it ready?', vi: 'Khi nào bạn xong?', ipa: '/hæv ɪt ˈredi/' },
          answers: [
            { en: 'I should have it done by Friday.', vi: 'Tôi sẽ xong trước thứ Sáu.', ipa: '/baɪ ˈfraɪdeɪ/' },
            { en: 'Give me two more days.', vi: 'Cho tôi thêm hai ngày.', ipa: '/tuː mɔːr deɪz/' },
            { en: 'I’ll need to check and get back to you.', vi: 'Tôi cần kiểm tra rồi báo lại bạn.', ipa: '/ɡet bæk tuː juː/' },
          ],
        },
        {
          q: { en: 'Do you need any help with that?', vi: 'Bạn có cần giúp gì không?', ipa: '/niːd ˈeni help/' },
          answers: [
            { en: 'Actually, yes. Could you review my code?', vi: 'Thật ra là có. Bạn xem lại code giúp tôi được không?', ipa: '/rɪˈvjuː/' },
            { en: 'No thanks, I’ve got it under control.', vi: 'Không, cảm ơn. Tôi kiểm soát được.', ipa: '/ˈʌndər kənˈtrəʊl/' },
          ],
        },
        {
          q: { en: 'I’m running behind on this.', vi: 'Tôi đang bị chậm việc này.', ipa: '/ˈrʌnɪŋ bɪˈhaɪnd/', note: 'Báo sớm luôn tốt hơn im lặng rồi trễ hạn.' },
          answers: [
            { en: 'That’s okay. What’s blocking you?', vi: 'Không sao. Cái gì đang cản bạn?', ipa: '/ˈblɒkɪŋ juː/' },
            { en: 'How much more time do you need?', vi: 'Bạn cần thêm bao lâu?', ipa: '/haʊ mʌtʃ mɔːr/' },
          ],
        },
        {
          q: { en: 'Could you take a look at this when you have time?', vi: 'Khi nào rảnh bạn xem giúp cái này nhé?', ipa: '/teɪk ə lʊk/' },
          answers: [
            { en: 'Sure, I’ll check it this afternoon.', vi: 'Được, chiều nay tôi xem.', ipa: '/aɪl tʃek ɪt/' },
            { en: 'Can you send it over?', vi: 'Bạn gửi qua được không?', ipa: '/send ɪt ˈəʊvər/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Daily standup',
          titleVi: 'Họp đứng hằng ngày',
          lines: [
            { who: 'Lead', en: 'Cuong, what did you work on yesterday?', vi: 'Cường, hôm qua bạn làm gì?' },
            { who: 'Cuong', en: 'I finished the login API and wrote the tests.', vi: 'Tôi hoàn thành API đăng nhập và viết kiểm thử.' },
            { who: 'Lead', en: 'Great. What are you working on today?', vi: 'Tốt. Hôm nay bạn làm gì?' },
            { who: 'Cuong', en: 'I’m fixing a bug in the payment flow.', vi: 'Tôi đang sửa lỗi trong luồng thanh toán.' },
            { who: 'Lead', en: 'Any blockers?', vi: 'Có gì cản trở không?' },
            { who: 'Cuong', en: 'Yes, I’m waiting for access to the staging server.', vi: 'Có, tôi đang đợi được cấp quyền vào máy chủ staging.' },
            { who: 'Lead', en: 'I’ll sort that out today. Thanks!', vi: 'Hôm nay tôi sẽ xử lý. Cảm ơn!' },
          ],
        },
      ],
      vocab: [
        { en: 'on track', ipa: '/ɒn træk/', vi: 'đúng tiến độ', pos: 'phr' },
        { en: 'behind schedule', ipa: '/bɪˈhaɪnd ˈʃedjuːl/', vi: 'chậm tiến độ', pos: 'phr' },
        { en: 'blocker', ipa: '/ˈblɒkər/', vi: 'thứ cản trở công việc', pos: 'n' },
        { en: 'deadline', ipa: '/ˈdedlaɪn/', vi: 'hạn chót', pos: 'n' },
        { en: 'task', ipa: '/tɑːsk/', vi: 'đầu việc', pos: 'n' },
        { en: 'feature', ipa: '/ˈfiːtʃər/', vi: 'tính năng', pos: 'n' },
        { en: 'review', ipa: '/rɪˈvjuː/', vi: 'xem xét, duyệt', pos: 'v/n' },
        { en: 'pick up (a task)', ipa: '/pɪk ʌp/', vi: 'nhận việc', pos: 'phr' },
        { en: 'sort out', ipa: '/sɔːt aʊt/', vi: 'xử lý, giải quyết', pos: 'phr' },
        { en: 'under control', ipa: '/ˈʌndər kənˈtrəʊl/', vi: 'trong tầm kiểm soát', pos: 'phr' },
        { en: 'workload', ipa: '/ˈwɜːkləʊd/', vi: 'khối lượng công việc', pos: 'n' },
      ],
      grammar: [
        {
          title: '"by" và "until" với hạn chót',
          explain:
            '"by" = trước hoặc đúng thời điểm đó (hành động xảy ra MỘT lần). "until" = kéo dài LIÊN TỤC tới lúc đó.',
          formula: 'by + mốc (hoàn thành trước) · until + mốc (kéo dài đến)',
          examples: [
            { en: "I'll finish it by Friday.", vi: 'Tôi sẽ xong trước thứ Sáu.' },
            { en: "I'll be working until 6 p.m.", vi: 'Tôi sẽ làm việc đến 6 giờ chiều.' },
          ],
          mistake: '❌ "I will finish until Friday" → ✅ "by Friday".',
        },
        {
          title: 'should / have to / need to',
          explain:
            '"should" = nên (lời khuyên). "have to" = phải (do quy định bên ngoài). "need to" = cần (do nhu cầu).',
          formula: 'S + should / have to / need to + V(nguyên thể)',
          examples: [
            { en: 'You should test it first.', vi: 'Bạn nên kiểm thử trước.' },
            { en: 'I have to finish this today.', vi: 'Tôi phải xong việc này hôm nay.' },
            { en: 'I need to check with the team.', vi: 'Tôi cần hỏi lại nhóm.' },
          ],
        },
      ],
      sound: {
        sound: '/ɜː/',
        how: 'Miệng thả lỏng, lưỡi ở giữa khoang miệng, kéo DÀI. Giống "ơ" nhưng dài và tròn hơn.',
        words: [
          { en: 'work', ipa: '/wɜːk/', vi: 'làm việc' },
          { en: 'first', ipa: '/fɜːst/', vi: 'đầu tiên' },
          { en: 'learn', ipa: '/lɜːn/', vi: 'học' },
          { en: 'service', ipa: '/ˈsɜːvɪs/', vi: 'dịch vụ' },
          { en: 'search', ipa: '/sɜːtʃ/', vi: 'tìm kiếm' },
        ],
        sentence: { en: 'I learn the service search work first.', vi: 'Tôi học phần tìm kiếm dịch vụ trước.' },
        trap: 'Đừng đọc ngắn cụt. /ɜː/ phải KÉO DÀI.',
      },
      practice: [
        'Viết bản báo cáo standup của bạn hôm nay bằng tiếng Anh (hôm qua / hôm nay / vướng mắc).',
        'Học thuộc 3 câu: "We\'re on track", "I\'m running behind", "Any blockers?".',
        'Viết 5 câu dùng đúng "by" và "until".',
        'Luyện /ɜː/: đọc "work – first – learn – service – search".',
      ],
    },

    /* ══════════════════ NGÀY 17 ══════════════════ */
    {
      day: 17,
      icon: '🗣️',
      title: 'Họp hành & nêu ý kiến',
      goal: 'Phát biểu trong họp, đồng tình, phản đối lịch sự, xin nói và chốt vấn đề.',
      qa: [
        {
          q: { en: 'What do you think about this approach?', vi: 'Bạn nghĩ sao về cách làm này?', ipa: '/əˈprəʊtʃ/' },
          answers: [
            { en: 'I think it makes sense.', vi: 'Tôi thấy nó hợp lý.', ipa: '/meɪks sens/' },
            { en: 'I see your point, but I have a concern.', vi: 'Tôi hiểu ý bạn, nhưng tôi có một băn khoăn.', ipa: '/kənˈsɜːn/', note: 'Cách phản đối lịch sự nhất.' },
            { en: 'I’m not sure. Could we explore other options?', vi: 'Tôi chưa chắc. Chúng ta xem thêm phương án khác được không?', ipa: '/ɪkˈsplɔːr/' },
          ],
        },
        {
          q: { en: 'Can I add something here?', vi: 'Tôi bổ sung một chút được không?', ipa: '/æd ˈsʌmθɪŋ/', note: 'Cách xin nói mà không cắt lời thô lỗ.' },
          answers: [
            { en: 'Sure, go ahead.', vi: 'Được, mời bạn.', ipa: '/ɡəʊ əˈhed/' },
            { en: 'Please do.', vi: 'Mời bạn cứ nói.', ipa: '/pliːz duː/' },
          ],
        },
        {
          q: { en: 'Does everyone agree?', vi: 'Mọi người đồng ý chứ?', ipa: '/əˈɡriː/' },
          answers: [
            { en: 'Sounds good to me.', vi: 'Tôi thấy ổn.', ipa: '/saʊndz ɡʊd/' },
            { en: 'I agree with Sarah on this.', vi: 'Tôi đồng ý với Sarah về việc này.', ipa: '/aɪ əˈɡriː wɪð/' },
            { en: 'I’d like to hear more before deciding.', vi: 'Tôi muốn nghe thêm trước khi quyết.', ipa: '/dɪˈsaɪdɪŋ/' },
          ],
        },
        {
          q: { en: 'Sorry, could you clarify that?', vi: 'Xin lỗi, bạn nói rõ hơn được không?', ipa: '/ˈklærɪfaɪ/' },
          answers: [
            { en: 'Of course. What I mean is…', vi: 'Tất nhiên. Ý tôi là…', ipa: '/wɒt aɪ miːn ɪz/' },
            { en: 'Let me put it another way.', vi: 'Để tôi diễn đạt cách khác.', ipa: '/əˈnʌðər weɪ/' },
          ],
        },
        {
          q: { en: 'Let’s move on to the next item.', vi: 'Chuyển sang mục tiếp theo nhé.', ipa: '/muːv ɒn/' },
          answers: [
            { en: 'Sure. Before we do, one quick note…', vi: 'Được. Trước khi chuyển, một ghi chú nhanh…', ipa: '/kwɪk nəʊt/' },
          ],
        },
        {
          q: { en: 'So, what are the next steps?', vi: 'Vậy các bước tiếp theo là gì?', ipa: '/nekst steps/', note: 'Câu chốt cuối buổi họp — luôn nên hỏi.' },
          answers: [
            { en: 'I’ll send a summary after the meeting.', vi: 'Tôi sẽ gửi tóm tắt sau buổi họp.', ipa: '/ˈsʌməri/' },
            { en: 'Let’s follow up on Friday.', vi: 'Thứ Sáu chúng ta trao đổi tiếp.', ipa: '/ˈfɒləʊ ʌp/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Team meeting',
          titleVi: 'Họp nhóm',
          lines: [
            { who: 'Lead', en: 'So, what do you think about using PostgreSQL for this?', vi: 'Vậy mọi người nghĩ sao về việc dùng PostgreSQL cho phần này?' },
            { who: 'Cuong', en: 'I think it makes sense. It handles our data well.', vi: 'Tôi thấy hợp lý. Nó xử lý dữ liệu của chúng ta tốt.' },
            { who: 'Sarah', en: 'I see your point, but I have a concern about the cost.', vi: 'Tôi hiểu ý bạn, nhưng tôi băn khoăn về chi phí.' },
            { who: 'Cuong', en: 'That’s fair. Can I add something here?', vi: 'Ý kiến hợp lý. Tôi bổ sung một chút được không?' },
            { who: 'Lead', en: 'Please do.', vi: 'Mời bạn.' },
            { who: 'Cuong', en: 'We could start small and scale later if needed.', vi: 'Chúng ta có thể bắt đầu nhỏ rồi mở rộng sau nếu cần.' },
            { who: 'Lead', en: 'Sounds good to me. So, what are the next steps?', vi: 'Tôi thấy ổn. Vậy các bước tiếp theo là gì?' },
            { who: 'Cuong', en: 'I’ll send a summary after the meeting and we can follow up on Friday.', vi: 'Tôi sẽ gửi tóm tắt sau buổi họp và thứ Sáu ta trao đổi tiếp.' },
          ],
        },
      ],
      vocab: [
        { en: 'approach', ipa: '/əˈprəʊtʃ/', vi: 'cách tiếp cận', pos: 'n' },
        { en: 'concern', ipa: '/kənˈsɜːn/', vi: 'băn khoăn, lo ngại', pos: 'n' },
        { en: 'clarify', ipa: '/ˈklærɪfaɪ/', vi: 'làm rõ', pos: 'v' },
        { en: 'make sense', ipa: '/meɪk sens/', vi: 'hợp lý', pos: 'phr' },
        { en: 'follow up', ipa: '/ˈfɒləʊ ʌp/', vi: 'trao đổi tiếp, theo dõi', pos: 'phr' },
        { en: 'move on', ipa: '/muːv ɒn/', vi: 'chuyển sang', pos: 'phr' },
        { en: 'summary', ipa: '/ˈsʌməri/', vi: 'bản tóm tắt', pos: 'n' },
        { en: 'agenda', ipa: '/əˈdʒendə/', vi: 'chương trình họp', pos: 'n' },
        { en: 'next steps', ipa: '/nekst steps/', vi: 'các bước tiếp theo', pos: 'n' },
        { en: 'scale', ipa: '/skeɪl/', vi: 'mở rộng quy mô', pos: 'v' },
      ],
      grammar: [
        {
          title: 'Phản đối lịch sự — công thức đệm',
          explain:
            'Không bao giờ nói thẳng "You are wrong". Luôn CÔNG NHẬN trước rồi mới nêu ý khác.',
          formula: 'I see your point, but… · That’s a good idea, however… · I agree, although…',
          examples: [
            { en: 'I see your point, but I have a concern about the cost.', vi: 'Tôi hiểu ý bạn, nhưng tôi băn khoăn về chi phí.' },
            { en: "That's fair, however we should test it first.", vi: 'Hợp lý, tuy nhiên chúng ta nên kiểm thử trước.' },
          ],
        },
        {
          title: 'Câu điều kiện loại 1 và 2',
          explain:
            'Loại 1: điều kiện CÓ THỂ xảy ra. Loại 2: giả định KHÔNG/khó xảy ra — dùng nhiều khi bàn phương án.',
          formula: 'Loại 1: If + hiện tại đơn, will + V · Loại 2: If + quá khứ đơn, would + V',
          examples: [
            { en: 'If we start now, we will finish by Friday.', vi: 'Nếu bắt đầu bây giờ, chúng ta sẽ xong trước thứ Sáu.' },
            { en: 'If we had more time, we would rewrite it.', vi: 'Nếu có thêm thời gian, chúng tôi sẽ viết lại. (nhưng không có)' },
          ],
          mistake: '❌ "If we will start…" → ✅ "If we start…". Sau "if" KHÔNG dùng "will".',
        },
      ],
      sound: {
        sound: 'Nhấn câu (sentence stress)',
        how:
          'Trong câu, chỉ NHẤN từ mang nội dung (danh từ, động từ, tính từ). Từ chức năng ' +
          '(a, the, of, to, is) đọc lướt. Đây là thứ tạo ra "nhạc điệu" tiếng Anh.',
        words: [
          { en: 'I THINK it MAKES SENSE.', ipa: '/aɪ θɪŋk ɪt meɪks sens/', vi: 'Tôi thấy nó hợp lý.' },
          { en: 'We should TEST it FIRST.', ipa: '/wiː ʃʊd test ɪt fɜːst/', vi: 'Chúng ta nên kiểm thử trước.' },
          { en: "What are the NEXT STEPS?", ipa: '/wɒt ɑːr ðə nekst steps/', vi: 'Các bước tiếp theo là gì?' },
        ],
        sentence: { en: 'I aGREE with SARah on THIS.', vi: 'Tôi đồng ý với Sarah về việc này.' },
        trap: 'Đọc đều mọi từ khiến câu nghe như máy. Hãy nhấn 2–3 từ quan trọng nhất mỗi câu.',
      },
      practice: [
        'Viết 3 cách phản đối lịch sự cho cùng một ý kiến bạn không đồng tình.',
        'Học thuộc: "I see your point, but…", "Can I add something here?", "What are the next steps?".',
        'Viết 5 câu điều kiện loại 1 về công việc của bạn.',
        'Luyện nhấn câu: đọc 5 câu, cố ý nhấn mạnh 2 từ quan trọng nhất.',
      ],
    },

    /* ══════════════════ NGÀY 18 ══════════════════ */
    {
      day: 18,
      icon: '✉️',
      title: 'Email & tin nhắn công việc',
      goal: 'Viết email chuyên nghiệp: mở đầu, nội dung, kết thúc — và các mẫu dùng lại được ngay.',
      qa: [
        {
          q: { en: 'How do I start a professional email?', vi: 'Mở đầu email chuyên nghiệp thế nào?', ipa: '/prəˈfeʃənl/' },
          answers: [
            { en: 'Hi Sarah, / Dear Ms. Johnson,', vi: 'Chào Sarah, / Kính gửi bà Johnson,', note: '"Hi + tên" cho đồng nghiệp; "Dear + Mr./Ms. + họ" cho khách hàng mới.' },
            { en: 'I hope this email finds you well.', vi: 'Hy vọng email này đến lúc bạn vẫn khoẻ.', note: 'Câu mở đầu an toàn nhất.' },
            { en: 'Thanks for your quick reply.', vi: 'Cảm ơn bạn đã phản hồi nhanh.' },
          ],
        },
        {
          q: { en: 'How do I ask for something politely in an email?', vi: 'Nhờ việc trong email sao cho lịch sự?', ipa: '/pəˈlaɪtli/' },
          answers: [
            { en: 'Could you please send me the file?', vi: 'Bạn vui lòng gửi tôi tệp đó được không?' },
            { en: 'I would appreciate it if you could review this.', vi: 'Tôi rất cảm kích nếu bạn xem lại giúp.' },
            { en: 'Would it be possible to move the meeting?', vi: 'Có thể dời cuộc họp được không?' },
          ],
        },
        {
          q: { en: 'How do I report a delay?', vi: 'Báo trễ hạn thế nào?', ipa: '/dɪˈleɪ/' },
          answers: [
            {
              en: 'I wanted to let you know that the delivery will be delayed by two days due to an unexpected issue. We are working on it and will update you by Thursday.',
              vi: 'Tôi muốn báo bạn biết rằng việc bàn giao sẽ trễ hai ngày do một vấn đề phát sinh. Chúng tôi đang xử lý và sẽ cập nhật bạn trước thứ Năm.',
              note: 'CÔNG THỨC: báo sớm + lý do ngắn + đang làm gì + mốc cập nhật mới. TUYỆT ĐỐI không im lặng.',
            },
          ],
        },
        {
          q: { en: 'How do I end an email?', vi: 'Kết thúc email thế nào?', ipa: '/end ən ˈiːmeɪl/' },
          answers: [
            { en: 'Best regards, / Kind regards,', vi: 'Trân trọng,', note: 'An toàn cho mọi tình huống công việc.' },
            { en: 'Thanks again, / Looking forward to hearing from you.', vi: 'Cảm ơn lần nữa, / Mong sớm nhận hồi âm của bạn.' },
            { en: 'Let me know if you have any questions.', vi: 'Hãy cho tôi biết nếu bạn có thắc mắc.' },
          ],
        },
        {
          q: { en: 'How do I follow up when someone doesn’t reply?', vi: 'Nhắc lại khi ai đó không trả lời?', ipa: '/ˈfɒləʊ ʌp/' },
          answers: [
            {
              en: 'Hi Sarah, just following up on my previous email. Let me know if you need any more information from my side.',
              vi: 'Chào Sarah, tôi nhắc lại email trước. Cho tôi biết nếu bạn cần thêm thông tin gì từ phía tôi.',
              note: 'Lịch sự, không trách móc, mở đường cho họ trả lời.',
            },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Email template: asking for clarification',
          titleVi: 'Mẫu email: hỏi cho rõ yêu cầu',
          lines: [
            { who: 'Subject', en: 'Question about the login requirements', vi: 'Hỏi về yêu cầu tính năng đăng nhập' },
            { who: 'Mở', en: 'Hi Sarah,', vi: 'Chào Sarah,' },
            { who: 'Thân', en: 'I hope this email finds you well. I’m working on the login feature and I have a question.', vi: 'Hy vọng bạn vẫn khoẻ. Tôi đang làm tính năng đăng nhập và có một câu hỏi.' },
            { who: 'Thân', en: 'Could you please clarify whether users should stay logged in for 7 days or 30 days?', vi: 'Bạn vui lòng nói rõ giúp: người dùng nên duy trì đăng nhập 7 ngày hay 30 ngày?' },
            { who: 'Thân', en: 'This will affect how I design the session handling.', vi: 'Điều này ảnh hưởng tới cách tôi thiết kế phần quản lý phiên.' },
            { who: 'Kết', en: 'Looking forward to hearing from you. Best regards, Cuong', vi: 'Mong sớm nhận hồi âm của bạn. Trân trọng, Cường' },
          ],
        },
        {
          title: 'Email template: reporting a delay',
          titleVi: 'Mẫu email: báo trễ hạn',
          lines: [
            { who: 'Subject', en: 'Update on the delivery timeline', vi: 'Cập nhật về tiến độ bàn giao' },
            { who: 'Mở', en: 'Hi Sarah,', vi: 'Chào Sarah,' },
            { who: 'Thân', en: 'I wanted to let you know that the delivery will be delayed by two days.', vi: 'Tôi muốn báo bạn biết việc bàn giao sẽ trễ hai ngày.' },
            { who: 'Thân', en: 'We ran into an unexpected issue with the payment integration.', vi: 'Chúng tôi gặp một vấn đề phát sinh với phần tích hợp thanh toán.' },
            { who: 'Thân', en: 'The team is working on it, and I will update you again by Thursday.', vi: 'Nhóm đang xử lý, và tôi sẽ cập nhật lại bạn trước thứ Năm.' },
            { who: 'Kết', en: 'Sorry for the inconvenience. Best regards, Cuong', vi: 'Xin lỗi vì sự bất tiện. Trân trọng, Cường' },
          ],
        },
      ],
      vocab: [
        { en: 'regarding', ipa: '/rɪˈɡɑːdɪŋ/', vi: 'về việc', pos: 'prep' },
        { en: 'attached', ipa: '/əˈtætʃt/', vi: 'đính kèm', pos: 'adj', ex: 'Please find the file attached.', exVi: 'Vui lòng xem tệp đính kèm.' },
        { en: 'follow up', ipa: '/ˈfɒləʊ ʌp/', vi: 'nhắc lại, theo dõi', pos: 'phr' },
        { en: 'delay', ipa: '/dɪˈleɪ/', vi: 'sự trì hoãn', pos: 'n' },
        { en: 'inconvenience', ipa: '/ˌɪnkənˈviːniəns/', vi: 'sự bất tiện', pos: 'n' },
        { en: 'clarify', ipa: '/ˈklærɪfaɪ/', vi: 'làm rõ', pos: 'v' },
        { en: 'confirm', ipa: '/kənˈfɜːm/', vi: 'xác nhận', pos: 'v' },
        { en: 'as soon as possible', ipa: '/æz suːn æz ˈpɒsəbl/', vi: 'sớm nhất có thể', pos: 'phr' },
        { en: 'Best regards', ipa: '/best rɪˈɡɑːdz/', vi: 'Trân trọng', pos: 'phr' },
        { en: 'run into (an issue)', ipa: '/rʌn ˈɪntuː/', vi: 'gặp phải (vấn đề)', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Câu bị động — giọng văn khách quan',
          explain:
            'Email công việc hay dùng bị động để nhấn vào SỰ VIỆC thay vì đổ lỗi cho ai. Rất hữu ích khi báo lỗi.',
          formula: 'be + V3 (past participle)',
          examples: [
            { en: 'The file was sent yesterday.', vi: 'Tệp đã được gửi hôm qua.' },
            { en: 'The issue has been fixed.', vi: 'Vấn đề đã được khắc phục.' },
            { en: 'The meeting was rescheduled.', vi: 'Cuộc họp đã được dời lịch.' },
          ],
        },
        {
          title: 'Mức trang trọng trong email',
          explain:
            'Cùng một ý, ba mức khác nhau. Với khách hàng mới, luôn chọn mức trang trọng nhất.',
          formula: 'Send me the file (suồng sã) → Could you send me the file? (lịch sự) → I would appreciate it if you could send me the file (trang trọng)',
          examples: [
            { en: 'Could you please confirm the deadline?', vi: 'Bạn vui lòng xác nhận hạn chót được không?' },
            { en: 'I would appreciate it if you could review the document.', vi: 'Tôi rất cảm kích nếu bạn xem lại tài liệu.' },
          ],
        },
      ],
      practice: [
        'Viết một email hỏi cho rõ yêu cầu, dùng đủ 3 phần: mở đầu – nội dung – kết thúc.',
        'Viết một email báo trễ hạn theo công thức 4 bước.',
        'Học thuộc 3 câu mở đầu và 3 câu kết thúc email.',
        'Viết lại 3 câu suồng sã thành câu trang trọng.',
      ],
    },

    /* ══════════════════ NGÀY 19 ══════════════════ */
    {
      day: 19,
      icon: '☕',
      title: 'Small talk nơi công sở',
      goal:
        'Nói chuyện phiếm với đồng nghiệp và khách hàng — kỹ năng quyết định việc bạn được ' +
        'xem là "dễ làm việc cùng" hay không.',
      qa: [
        {
          q: { en: 'Did you have a good weekend?', vi: 'Cuối tuần bạn vui chứ?', ipa: '/ɡʊd ˈwiːkend/' },
          answers: [
            { en: 'Yes, it was relaxing. How about yours?', vi: 'Vâng, khá thư giãn. Còn của bạn?', ipa: '/rɪˈlæksɪŋ/' },
            { en: 'Too short, as always!', vi: 'Ngắn quá, như mọi khi!', ipa: '/tuː ʃɔːt/', note: 'Câu đùa an toàn, ai cũng đồng cảm.' },
          ],
        },
        {
          q: { en: 'Any plans for the holiday?', vi: 'Bạn có kế hoạch gì cho kỳ nghỉ không?', ipa: '/ˈhɒlədeɪ/' },
          answers: [
            { en: 'I’m going back to my hometown.', vi: 'Tôi về quê.', ipa: '/ˈhəʊmtaʊn/' },
            { en: 'Nothing big, just resting at home.', vi: 'Không có gì lớn, chỉ nghỉ ở nhà.', ipa: '/ˈnʌθɪŋ bɪɡ/' },
          ],
        },
        {
          q: { en: 'How was your trip?', vi: 'Chuyến đi của bạn thế nào?', ipa: '/jɔːr trɪp/' },
          answers: [
            { en: 'It was great! The food was amazing.', vi: 'Tuyệt lắm! Đồ ăn ngon vô cùng.', ipa: '/əˈmeɪzɪŋ/' },
            { en: 'Tiring, but worth it.', vi: 'Mệt, nhưng đáng.', ipa: '/wɜːθ ɪt/' },
          ],
        },
        {
          q: { en: 'Have you tried the new coffee place?', vi: 'Bạn thử quán cà phê mới chưa?', ipa: '/hæv juː traɪd/' },
          answers: [
            { en: 'Not yet, is it good?', vi: 'Chưa, có ngon không?', ipa: '/ɪz ɪt ɡʊd/' },
            { en: 'Yes! We should go together sometime.', vi: 'Rồi! Hôm nào mình đi cùng nhé.', ipa: '/təˈɡeðər/' },
          ],
        },
        {
          q: { en: 'It’s been a long week, hasn’t it?', vi: 'Tuần này dài nhỉ?', ipa: '/ə lɒŋ wiːk/', note: 'Câu đồng cảm — luôn hiệu quả vào thứ Năm, thứ Sáu.' },
          answers: [
            { en: 'Tell me about it!', vi: 'Còn phải nói!', ipa: '/tel miː əˈbaʊt ɪt/', note: 'KHÔNG phải "hãy kể tôi nghe" — mà là "tôi hoàn toàn đồng ý".' },
            { en: 'Definitely. I’m ready for the weekend.', vi: 'Chắc chắn rồi. Tôi sẵn sàng cho cuối tuần.', ipa: '/ˈredi fɔːr/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Coffee break chat',
          titleVi: 'Trò chuyện giờ giải lao',
          lines: [
            { who: 'Sarah', en: 'Morning! It’s been a long week, hasn’t it?', vi: 'Chào buổi sáng! Tuần này dài nhỉ?' },
            { who: 'Cuong', en: 'Tell me about it! I’m ready for the weekend.', vi: 'Còn phải nói! Tôi sẵn sàng cho cuối tuần rồi.' },
            { who: 'Sarah', en: 'Any plans?', vi: 'Có kế hoạch gì không?' },
            { who: 'Cuong', en: 'Nothing big, just resting at home. How about you?', vi: 'Không có gì lớn, chỉ nghỉ ở nhà. Còn bạn?' },
            { who: 'Sarah', en: 'I’m going hiking with some friends.', vi: 'Tôi đi leo núi với vài người bạn.' },
            { who: 'Cuong', en: 'That sounds fun! Have you tried the new coffee place downstairs?', vi: 'Nghe vui đấy! Bạn thử quán cà phê mới ở tầng dưới chưa?' },
            { who: 'Sarah', en: 'Not yet. Is it good?', vi: 'Chưa. Có ngon không?' },
            { who: 'Cuong', en: 'Really good. We should go together sometime.', vi: 'Ngon lắm. Hôm nào mình đi cùng nhé.' },
          ],
        },
      ],
      vocab: [
        { en: 'Tell me about it!', ipa: '/tel miː əˈbaʊt ɪt/', vi: 'Còn phải nói!', pos: 'phr' },
        { en: 'worth it', ipa: '/wɜːθ ɪt/', vi: 'đáng công', pos: 'phr' },
        { en: 'hometown', ipa: '/ˈhəʊmtaʊn/', vi: 'quê nhà', pos: 'n' },
        { en: 'relaxing', ipa: '/rɪˈlæksɪŋ/', vi: 'thư giãn', pos: 'adj' },
        { en: 'tiring', ipa: '/ˈtaɪərɪŋ/', vi: 'mệt mỏi (gây mệt)', pos: 'adj' },
        { en: 'catch a break', ipa: '/kætʃ ə breɪk/', vi: 'được nghỉ ngơi', pos: 'phr' },
        { en: 'downstairs', ipa: '/ˌdaʊnˈsteəz/', vi: 'tầng dưới', pos: 'adv' },
        { en: 'hiking', ipa: '/ˈhaɪkɪŋ/', vi: 'leo núi, đi bộ đường dài', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Ba chủ đề small talk AN TOÀN và ba chủ đề nên TRÁNH',
          explain:
            'AN TOÀN: thời tiết, cuối tuần/kỳ nghỉ, đồ ăn – quán xá, thể thao, phim ảnh. ' +
            'NÊN TRÁNH khi chưa thân: lương, tuổi tác, cân nặng, tình trạng hôn nhân, chính trị, tôn giáo. ' +
            'Ở Việt Nam hỏi tuổi và lương là bình thường, nhưng với người phương Tây đó là chuyện riêng tư.',
          formula: 'An toàn: weather · weekend · food · travel · sports — Tránh: salary · age · weight · politics · religion',
          examples: [
            { en: 'Did you have a good weekend?', vi: 'Cuối tuần bạn vui chứ? ✅' },
            { en: 'How old are you? / How much do you make?', vi: 'Bạn bao nhiêu tuổi? / Lương bạn bao nhiêu? ❌' },
          ],
        },
        {
          title: 'Câu cảm thán ngắn để giữ mạch',
          explain:
            'Người bản xứ liên tục chèn các câu ngắn thể hiện đang lắng nghe. Im lặng hoàn toàn bị coi là thờ ơ.',
          formula: 'Really? · That sounds fun! · No way! · Same here. · Good for you!',
          examples: [
            { en: 'That sounds fun!', vi: 'Nghe vui đấy!' },
            { en: 'Same here.', vi: 'Tôi cũng vậy.' },
          ],
        },
      ],
      practice: [
        'Chuẩn bị sẵn 3 câu trả lời cho "How was your weekend?" để dùng mọi thứ Hai.',
        'Học thuộc 5 câu cảm thán ngắn và dùng chúng trong hội thoại hôm nay.',
        'Viết một đoạn small talk 8 câu với đồng nghiệp.',
        'Liệt kê 3 chủ đề bạn hay hỏi mà người phương Tây coi là riêng tư — và tìm câu thay thế.',
      ],
    },

    /* ══════════════════ NGÀY 20 ══════════════════ */
    {
      day: 20,
      icon: '🎓',
      title: 'Kể chuyện & tổng ôn 20 ngày',
      goal:
        'Ghép mọi thứ đã học thành câu chuyện dài — kỹ năng cuối cùng cần có trước khi bước ' +
        'sang phần phỏng vấn và quay video.',
      qa: [
        {
          q: { en: 'Can you tell me about a challenge you faced?', vi: 'Bạn kể về một khó khăn bạn từng gặp được không?', ipa: '/ə ˈtʃælɪndʒ/', note: 'Câu phỏng vấn kinh điển — trả lời theo cấu trúc STAR ở phần ngữ pháp.' },
          answers: [
            {
              en: 'Sure. Last year, our website went down during a big launch. I was responsible for finding the cause. I checked the logs, found a database issue, and fixed it within an hour. After that, we set up monitoring so it would not happen again.',
              vi: 'Vâng. Năm ngoái, website của chúng tôi sập trong một đợt ra mắt lớn. Tôi chịu trách nhiệm tìm nguyên nhân. Tôi kiểm tra log, phát hiện lỗi cơ sở dữ liệu, và sửa trong vòng một tiếng. Sau đó chúng tôi thiết lập giám sát để chuyện đó không tái diễn.',
              note: 'Đây chính là cấu trúc STAR: Tình huống → Nhiệm vụ → Hành động → Kết quả.',
            },
          ],
        },
        {
          q: { en: 'What happened next?', vi: 'Rồi sao nữa?', ipa: '/wɒt ˈhæpənd nekst/' },
          answers: [
            { en: 'After that, we set up monitoring.', vi: 'Sau đó, chúng tôi thiết lập giám sát.', ipa: '/ˈɑːftər ðæt/' },
            { en: 'In the end, everything worked out fine.', vi: 'Cuối cùng, mọi thứ đều ổn.', ipa: '/ɪn ðə end/' },
          ],
        },
        {
          q: { en: 'What did you learn from that?', vi: 'Bạn học được gì từ đó?', ipa: '/lɜːn frɒm/' },
          answers: [
            { en: 'I learned to always check the logs first.', vi: 'Tôi học được là luôn kiểm tra log trước.', ipa: '/ˈɔːlweɪz tʃek/' },
            { en: 'It taught me the value of monitoring.', vi: 'Nó dạy tôi giá trị của việc giám sát.', ipa: '/ðə ˈvæljuː/' },
          ],
        },
        {
          q: { en: 'Where do you see yourself in five years?', vi: 'Bạn thấy mình ở đâu sau 5 năm?', ipa: '/faɪv jɪəz/' },
          answers: [
            {
              en: 'I’d like to become a senior developer and lead a small team. I also want to keep creating educational content in English.',
              vi: 'Tôi muốn trở thành lập trình viên cao cấp và dẫn dắt một nhóm nhỏ. Tôi cũng muốn tiếp tục làm nội dung giáo dục bằng tiếng Anh.',
            },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Telling a story with STAR',
          titleVi: 'Kể một câu chuyện theo cấu trúc STAR',
          lines: [
            { who: 'S (Tình huống)', en: 'Last year, our website went down during a big product launch.', vi: 'Năm ngoái, website của chúng tôi sập trong đợt ra mắt sản phẩm lớn.' },
            { who: 'T (Nhiệm vụ)', en: 'I was responsible for finding the cause as quickly as possible.', vi: 'Tôi chịu trách nhiệm tìm nguyên nhân nhanh nhất có thể.' },
            { who: 'A (Hành động)', en: 'First I checked the server logs, then I found a database connection issue, and I fixed the configuration.', vi: 'Đầu tiên tôi kiểm tra log máy chủ, rồi phát hiện lỗi kết nối cơ sở dữ liệu, và tôi sửa lại cấu hình.' },
            { who: 'R (Kết quả)', en: 'The site was back up within an hour, and we set up monitoring so it wouldn’t happen again.', vi: 'Trang web hoạt động lại trong vòng một tiếng, và chúng tôi thiết lập giám sát để không tái diễn.' },
          ],
        },
      ],
      vocab: [
        { en: 'challenge', ipa: '/ˈtʃælɪndʒ/', vi: 'thử thách', pos: 'n' },
        { en: 'responsible for', ipa: '/rɪˈspɒnsəbl fɔːr/', vi: 'chịu trách nhiệm về', pos: 'adj' },
        { en: 'cause', ipa: '/kɔːz/', vi: 'nguyên nhân', pos: 'n' },
        { en: 'go down (website)', ipa: '/ɡəʊ daʊn/', vi: 'sập, ngừng hoạt động', pos: 'phr' },
        { en: 'work out', ipa: '/wɜːk aʊt/', vi: 'ổn thoả, có kết quả tốt', pos: 'phr' },
        { en: 'in the end', ipa: '/ɪn ðə end/', vi: 'cuối cùng', pos: 'phr' },
        { en: 'monitoring', ipa: '/ˈmɒnɪtərɪŋ/', vi: 'giám sát', pos: 'n' },
        { en: 'lead a team', ipa: '/liːd ə tiːm/', vi: 'dẫn dắt một nhóm', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Cấu trúc STAR — khung kể chuyện vạn năng',
          explain:
            'Dùng cho MỌI câu hỏi phỏng vấn hành vi, và cũng dùng để kể chuyện đời thường cho mạch lạc. ' +
            'Bốn bước, mỗi bước 1–2 câu là đủ.',
          formula:
            'S (Situation): Bối cảnh · T (Task): Việc bạn phải làm · A (Action): Bạn đã làm gì · R (Result): Kết quả ra sao',
          examples: [
            { en: 'Last year, our website went down. (S)', vi: 'Năm ngoái, website chúng tôi sập.' },
            { en: 'I was responsible for finding the cause. (T)', vi: 'Tôi chịu trách nhiệm tìm nguyên nhân.' },
            { en: 'I checked the logs and fixed the config. (A)', vi: 'Tôi kiểm tra log và sửa cấu hình.' },
            { en: 'The site was back up within an hour. (R)', vi: 'Trang web hoạt động lại trong một tiếng.' },
          ],
        },
        {
          title: 'Từ nối thời gian khi kể chuyện',
          explain: 'Giúp người nghe theo được mạch. Thiếu chúng, câu chuyện nghe rời rạc.',
          formula: 'First… → Then… → After that… → Finally… / In the end…',
          examples: [
            { en: 'First I checked the logs, then I found the bug, and finally I fixed it.', vi: 'Đầu tiên tôi xem log, rồi tìm ra lỗi, và cuối cùng sửa nó.' },
          ],
        },
      ],
      practice: [
        '🎯 BÀI THI CUỐI: Nói liên tục 3 phút, không dừng — giới thiệu bản thân, kể một ngày điển hình, kể một khó khăn theo STAR, và nói kế hoạch 5 năm tới.',
        'Ghi âm bài trên, nghe lại và đếm số lần bạn ngập ngừng. Lặp lại tới khi dưới 5 lần.',
        'Viết câu chuyện STAR của riêng bạn về một lỗi kỹ thuật bạn từng sửa.',
        'Ôn lại 20 âm đã luyện: đọc mỗi âm 3 từ, kiểm tra bằng từ điển có phát âm.',
        '✅ Xong 20 ngày — chuyển sang tab "Cho Dev" để học phỏng vấn, họp khách hàng và quay video.',
      ],
    },
  ],
};
