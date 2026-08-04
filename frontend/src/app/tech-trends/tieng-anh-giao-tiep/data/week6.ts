/**
 * TUẦN 6 — Tiền bạc & đàm phán (Ngày 26–30).
 *
 * Tuần khó nói nhất với người Việt, vì văn hoá ngại nhắc tiền. Nhưng làm
 * freelance hay nhận dự án nước ngoài thì đây chính là nhóm câu quyết định
 * bạn được trả bao nhiêu. Nguyên tắc xuyên suốt: nói về GIÁ TRỊ trước, con số
 * sau; và không bao giờ hạ giá mà không cắt bớt phạm vi.
 */
import type { WeekBlock } from './types';

export const WEEK_6: WeekBlock = {
  week: 6,
  title: 'Tiền bạc & đàm phán',
  subtitle:
    'Báo giá, thương lượng, từ chối yêu cầu vô lý, xử lý khiếu nại và chốt hợp đồng — ' +
    'nhóm câu quyết định bạn được trả bao nhiêu.',
  days: [
    {
      day: 26,
      icon: '💰',
      title: 'Báo giá & nói về tiền',
      goal: 'Đưa ra con số một cách tự tin, không xin lỗi, không vòng vo.',
      qa: [
        {
          q: { en: 'What’s your rate?', vi: 'Giá của bạn là bao nhiêu?', ipa: '/jɔːr reɪt/' },
          answers: [
            { en: 'My rate is 35 dollars an hour.', vi: 'Giá của tôi là 35 đô một giờ.', ipa: '/ən ˈaʊər/', note: 'Nói thẳng con số. ĐỪNG thêm "sorry" hay "is that okay?" — nghe như đang xin.' },
            { en: 'For a project like this, I’d quote around 3,000 dollars.', vi: 'Với dự án như thế này, tôi báo khoảng 3.000 đô.', ipa: '/kwəʊt/' },
            { en: 'It depends on the scope. Can you tell me more about what you need?', vi: 'Còn tuỳ phạm vi. Bạn nói rõ hơn về nhu cầu được không?', ipa: '/ðə skəʊp/', note: 'ĐỪNG báo giá trước khi hiểu phạm vi.' },
          ],
        },
        {
          q: { en: 'That’s more than we budgeted.', vi: 'Cao hơn ngân sách của chúng tôi.', ipa: '/ˈbʌdʒɪtɪd/' },
          answers: [
            { en: 'I understand. What budget did you have in mind?', vi: 'Tôi hiểu. Ngân sách bạn dự tính là bao nhiêu?', ipa: '/hæd ɪn maɪnd/', note: 'Hỏi ngược để biết con số thật của họ trước khi nhượng bộ.' },
            { en: 'We could reduce the scope to fit that budget.', vi: 'Chúng ta có thể thu hẹp phạm vi cho vừa ngân sách.', ipa: '/rɪˈdjuːs ðə skəʊp/', note: 'QUY TẮC VÀNG: giảm giá thì phải giảm việc.' },
            { en: 'I can be flexible on the timeline, but not on the rate.', vi: 'Tôi linh hoạt được về tiến độ, nhưng không về đơn giá.', ipa: '/ˈfleksəbl/' },
          ],
        },
        {
          q: { en: 'Can you give us a discount?', vi: 'Bạn giảm giá được không?', ipa: '/ˈdɪskaʊnt/' },
          answers: [
            { en: 'I can offer 10% off if we sign for six months.', vi: 'Tôi giảm 10% nếu ký hợp đồng sáu tháng.', ipa: '/saɪn fɔːr/', note: 'Đổi giảm giá lấy thứ khác — thời hạn dài hơn, trả trước, giới thiệu khách.' },
            { en: 'My rate is fixed, but I can prioritize your work.', vi: 'Đơn giá cố định, nhưng tôi ưu tiên việc của bạn.', ipa: '/praɪˈɒrɪtaɪz/' },
          ],
        },
        {
          q: { en: 'How do you want to be paid?', vi: 'Bạn muốn thanh toán thế nào?', ipa: '/tuː biː peɪd/' },
          answers: [
            { en: '50% upfront and 50% on delivery.', vi: '50% trả trước và 50% khi bàn giao.', ipa: '/ʌpˈfrʌnt/', note: '"upfront" = trả trước. Luôn nên có phần trả trước.' },
            { en: 'Monthly invoices, net 15.', vi: 'Hoá đơn hằng tháng, thanh toán trong 15 ngày.', ipa: '/net fɪfˈtiːn/', note: '"net 15" = trả trong vòng 15 ngày sau hoá đơn.' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Quoting a project',
          titleVi: 'Báo giá một dự án',
          lines: [
            { who: 'Client', en: 'What would something like this cost?', vi: 'Cái này khoảng bao nhiêu tiền?' },
            { who: 'Cuong', en: 'It depends on the scope. Do you need the admin panel too?', vi: 'Còn tuỳ phạm vi. Bạn có cần cả trang quản trị không?' },
            { who: 'Client', en: 'Yes, and user login.', vi: 'Có, và cả đăng nhập người dùng.' },
            { who: 'Cuong', en: 'For that scope, I’d quote around 3,000 dollars, 50% upfront.', vi: 'Với phạm vi đó, tôi báo khoảng 3.000 đô, trả trước 50%.' },
            { who: 'Client', en: 'That’s more than we budgeted.', vi: 'Cao hơn ngân sách của chúng tôi.' },
            { who: 'Cuong', en: 'I understand. What budget did you have in mind?', vi: 'Tôi hiểu. Ngân sách bạn dự tính bao nhiêu?' },
            { who: 'Client', en: 'Around 2,000.', vi: 'Khoảng 2.000.' },
            { who: 'Cuong', en: 'We could do that by dropping the admin panel to phase two.', vi: 'Được, nếu dời trang quản trị sang giai đoạn hai.' },
          ],
        },
      ],
      vocab: [
        { en: 'rate', ipa: '/reɪt/', vi: 'đơn giá', pos: 'n' },
        { en: 'quote', ipa: '/kwəʊt/', vi: 'báo giá', pos: 'v/n' },
        { en: 'upfront', ipa: '/ʌpˈfrʌnt/', vi: 'trả trước', pos: 'adv/adj' },
        { en: 'invoice', ipa: '/ˈɪnvɔɪs/', vi: 'hoá đơn', pos: 'n' },
        { en: 'budget', ipa: '/ˈbʌdʒɪt/', vi: 'ngân sách', pos: 'n/v' },
        { en: 'scope', ipa: '/skəʊp/', vi: 'phạm vi công việc', pos: 'n' },
        { en: 'flexible', ipa: '/ˈfleksəbl/', vi: 'linh hoạt', pos: 'adj' },
        { en: 'milestone', ipa: '/ˈmaɪlstəʊn/', vi: 'mốc bàn giao', pos: 'n' },
        { en: 'retainer', ipa: '/rɪˈteɪnər/', vi: 'phí giữ chỗ hằng tháng', pos: 'n' },
        { en: 'net 15 / net 30', ipa: '/net/', vi: 'trả trong 15/30 ngày', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Nói con số mà không xin lỗi',
          explain:
            'Người Việt hay chèn "sorry", "maybe", "is that okay?" khi nói giá — nghe như đang xin xỏ và ' +
            'mời người ta mặc cả. Hãy nói con số như nói một sự thật.',
          formula: 'My rate is [số]. · For that scope, I’d quote [số].',
          examples: [
            { en: 'My rate is 35 dollars an hour.', vi: 'Giá của tôi là 35 đô một giờ. ✅' },
            { en: 'Sorry, maybe around 35 dollars? Is that okay?', vi: 'Xin lỗi, khoảng 35 đô được không ạ? ❌' },
          ],
          mistake: 'Nói giá rồi im lặng chờ. Đừng vội lấp khoảng lặng bằng việc tự hạ giá.',
        },
        {
          title: 'Đổi nhượng bộ — không cho không',
          explain: 'Mỗi lần bạn giảm gì đó, phải nhận lại thứ khác. Nếu không, giá của bạn mất giá trị.',
          formula: 'I can [nhượng bộ] if [điều kiện].',
          examples: [
            { en: 'I can offer 10% off if we sign for six months.', vi: 'Tôi giảm 10% nếu ký sáu tháng.' },
            { en: 'I can start next week if we confirm today.', vi: 'Tôi bắt đầu tuần sau nếu hôm nay chốt.' },
          ],
        },
      ],
      practice: [
        'Nói to 10 lần: "My rate is ___ dollars an hour." — không thêm bất kỳ từ xin lỗi nào.',
        'Viết 3 câu nhượng bộ có điều kiện theo mẫu "I can … if …".',
        'Tập trả lời "That\'s too expensive" bằng 3 cách khác nhau mà không hạ giá ngay.',
      ],
    },

    {
      day: 27,
      icon: '📜',
      title: 'Hợp đồng & phạm vi công việc',
      goal: 'Nói rõ cái gì có trong hợp đồng, cái gì không — chặn "phình việc" từ đầu.',
      qa: [
        {
          q: { en: 'What’s included in the price?', vi: 'Giá đó bao gồm những gì?', ipa: '/ɪnˈkluːdɪd/' },
          answers: [
            { en: 'It includes development, testing, and two rounds of revisions.', vi: 'Bao gồm phát triển, kiểm thử và hai lượt chỉnh sửa.', ipa: '/rɪˈvɪʒnz/', note: 'Giới hạn SỐ LƯỢT sửa — nếu không sẽ sửa vô tận.' },
            { en: 'Hosting and domain are not included.', vi: 'Không bao gồm hosting và tên miền.', ipa: '/nɒt ɪnˈkluːdɪd/', note: 'Nói rõ cái KHÔNG bao gồm cũng quan trọng như cái có.' },
          ],
        },
        {
          q: { en: 'Can you add this one small thing?', vi: 'Bạn thêm giúp cái nhỏ này được không?', ipa: '/wʌn smɔːl θɪŋ/', note: 'Câu nguy hiểm nhất — "phình việc" luôn bắt đầu từ đây.' },
          answers: [
            { en: 'That’s outside the current scope, but I can quote it separately.', vi: 'Cái đó nằm ngoài phạm vi hiện tại, nhưng tôi báo giá riêng được.', ipa: '/ˈaʊtsaɪd ðə skəʊp/', note: 'Không từ chối — chuyển thành việc có giá.' },
            { en: 'Happy to. It would add about four hours to the estimate.', vi: 'Sẵn sàng. Sẽ thêm khoảng bốn giờ vào ước lượng.', ipa: '/ˈestɪmət/' },
            { en: 'Let’s add it to the list for phase two.', vi: 'Ta đưa nó vào danh sách giai đoạn hai nhé.', ipa: '/feɪz tuː/' },
          ],
        },
        {
          q: { en: 'When can you start?', vi: 'Khi nào bạn bắt đầu được?', ipa: '/wen kæn juː stɑːt/' },
          answers: [
            { en: 'I can start once the contract is signed and the deposit clears.', vi: 'Tôi bắt đầu ngay khi hợp đồng được ký và tiền cọc về.', ipa: '/dɪˈpɒzɪt klɪəz/', note: 'Ràng buộc rõ điều kiện bắt đầu.' },
            { en: 'My next opening is in two weeks.', vi: 'Chỗ trống gần nhất của tôi là hai tuần nữa.', ipa: '/ˈəʊpənɪŋ/' },
          ],
        },
        {
          q: { en: 'What if we need changes later?', vi: 'Nếu sau này cần thay đổi thì sao?', ipa: '/tʃeɪndʒɪz/' },
          answers: [
            { en: 'Changes after sign-off are billed hourly.', vi: 'Thay đổi sau khi nghiệm thu sẽ tính theo giờ.', ipa: '/saɪn ɒf/' },
            { en: 'Two rounds of revisions are included; after that we re-estimate.', vi: 'Hai lượt sửa nằm trong giá; sau đó chúng ta ước lượng lại.', ipa: '/ˌriːˈestɪmeɪt/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Handling scope creep',
          titleVi: 'Chặn "phình việc"',
          lines: [
            { who: 'Client', en: 'Can you also add a chat feature? It’s small.', vi: 'Bạn thêm cả tính năng chat nhé? Nhỏ thôi mà.' },
            { who: 'Cuong', en: 'Happy to. That’s outside the current scope though — it would add about 20 hours.', vi: 'Sẵn sàng. Nhưng cái đó ngoài phạm vi hiện tại — sẽ thêm khoảng 20 giờ.' },
            { who: 'Client', en: 'Oh, I thought it was included.', vi: 'Ồ, tôi tưởng nó có sẵn trong giá rồi.' },
            { who: 'Cuong', en: 'The contract covers development, testing and two rounds of revisions. Chat wasn’t in the original list.', vi: 'Hợp đồng gồm phát triển, kiểm thử và hai lượt sửa. Chat không có trong danh sách ban đầu.' },
            { who: 'Client', en: 'I see. Can we do it later?', vi: 'Tôi hiểu. Làm sau được không?' },
            { who: 'Cuong', en: 'Absolutely — let’s add it to phase two and I’ll send a separate quote.', vi: 'Hoàn toàn được — ta đưa vào giai đoạn hai và tôi gửi báo giá riêng.' },
          ],
        },
      ],
      vocab: [
        { en: 'scope creep', ipa: '/skəʊp kriːp/', vi: 'phình việc ngoài phạm vi', pos: 'n' },
        { en: 'revision', ipa: '/rɪˈvɪʒn/', vi: 'lượt chỉnh sửa', pos: 'n' },
        { en: 'deposit', ipa: '/dɪˈpɒzɪt/', vi: 'tiền cọc', pos: 'n' },
        { en: 'sign-off', ipa: '/ˈsaɪn ɒf/', vi: 'nghiệm thu', pos: 'n' },
        { en: 'billed hourly', ipa: '/bɪld ˈaʊəli/', vi: 'tính theo giờ', pos: 'phr' },
        { en: 'deliverable', ipa: '/dɪˈlɪvərəbl/', vi: 'hạng mục bàn giao', pos: 'n' },
        { en: 'estimate', ipa: '/ˈestɪmət/', vi: 'ước lượng', pos: 'n' },
        { en: 'terms', ipa: '/tɜːmz/', vi: 'điều khoản', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Từ chối bằng cách định giá, không bằng chữ "no"',
          explain:
            'Khách xin thêm việc thì đừng nói "no". Nói "được, và nó tốn thêm X" — quyền quyết định trở về '
            + 'phía họ, còn bạn không mất lòng mà cũng không làm không công.',
          formula: 'Happy to. That’s outside the current scope — it would add [thời gian/chi phí].',
          examples: [
            { en: 'Happy to. That would add about four hours.', vi: 'Sẵn sàng. Sẽ thêm khoảng bốn giờ.' },
          ],
        },
        {
          title: 'Bị động để nói điều khoản khách quan',
          explain: 'Điều khoản nói ở thể bị động nghe như quy định chung, không phải bạn đang làm khó khách.',
          formula: 'Changes are billed hourly. · Work is delivered in two milestones.',
          examples: [
            { en: 'Changes after sign-off are billed hourly.', vi: 'Thay đổi sau nghiệm thu được tính theo giờ.' },
          ],
        },
      ],
      practice: [
        'Viết danh sách "bao gồm" và "KHÔNG bao gồm" cho một dịch vụ bạn cung cấp.',
        'Học thuộc: "That\'s outside the current scope, but I can quote it separately."',
        'Tập trả lời 3 lần yêu cầu thêm việc mà không nói "no".',
      ],
    },

    {
      day: 28,
      icon: '🚫',
      title: 'Từ chối & đặt giới hạn',
      goal: 'Nói không với deadline vô lý, việc ngoài giờ, và yêu cầu bất khả thi.',
      qa: [
        {
          q: { en: 'Can you finish this by tomorrow?', vi: 'Mai bạn xong được không?', ipa: '/baɪ təˈmɒrəʊ/' },
          answers: [
            { en: 'Not with the current quality bar. I could do a rough version by tomorrow, or a proper one by Friday.', vi: 'Không, nếu giữ chất lượng như hiện tại. Tôi làm bản thô cho mai, hoặc bản chỉn chu cho thứ Sáu.', ipa: '/rʌf ˈvɜːʒn/', note: 'Đưa HAI phương án thay vì một chữ "không".' },
            { en: 'That’s not realistic. Here’s what I can commit to.', vi: 'Không khả thi. Đây là điều tôi cam kết được.', ipa: '/ˌriːəˈlɪstɪk/' },
          ],
        },
        {
          q: { en: 'Could you work this weekend?', vi: 'Cuối tuần bạn làm được không?', ipa: '/ðɪs ˈwiːkend/' },
          answers: [
            { en: 'I’d rather not. Is Monday morning early enough?', vi: 'Tôi không muốn lắm. Sáng thứ Hai có kịp không?', ipa: '/aɪd ˈrɑːðə nɒt/', note: '"I\'d rather not" = từ chối lịch sự mà rõ ràng.' },
            { en: 'I can if it’s urgent, but I’ll need to shift Monday’s task.', vi: 'Tôi làm được nếu gấp, nhưng phải dời việc thứ Hai.', ipa: '/ʃɪft/', note: 'Đồng ý kèm cái giá — người kia sẽ tự cân nhắc.' },
          ],
        },
        {
          q: { en: 'This is urgent!', vi: 'Việc này gấp lắm!', ipa: '/ˈɜːdʒənt/' },
          answers: [
            { en: 'Understood. What should I deprioritize to make room?', vi: 'Đã rõ. Vậy tôi nên hạ ưu tiên việc nào để có chỗ?', ipa: '/diːpraɪˈɒrɪtaɪz/', note: 'Câu này buộc người kia đối mặt với đánh đổi thật.' },
            { en: 'I can look at it now, but the report will slip to Thursday.', vi: 'Tôi xem ngay được, nhưng báo cáo sẽ trễ tới thứ Năm.', ipa: '/slɪp/' },
          ],
        },
        {
          q: { en: 'Sorry to ask again, but…', vi: 'Xin lỗi lại làm phiền, nhưng…', ipa: '/tuː ɑːsk əˈɡen/' },
          answers: [
            { en: 'No problem. Just so you know, I’m at capacity until Friday.', vi: 'Không sao. Chỉ để bạn nắm: tôi kín việc tới thứ Sáu.', ipa: '/æt kəˈpæsəti/', note: '"at capacity" = đã kín lịch. Cách nói chuyên nghiệp.' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Saying no to an unrealistic deadline',
          titleVi: 'Từ chối deadline bất khả thi',
          lines: [
            { who: 'Manager', en: 'Can you finish the whole module by tomorrow?', vi: 'Mai bạn xong cả module được không?' },
            { who: 'Cuong', en: 'Not with the quality we need. Let me give you two options.', vi: 'Không, nếu giữ chất lượng cần thiết. Để tôi đưa hai phương án.' },
            { who: 'Manager', en: 'Go ahead.', vi: 'Nói đi.' },
            { who: 'Cuong', en: 'A rough version tomorrow with known gaps, or a tested version Friday.', vi: 'Bản thô ngày mai còn thiếu sót, hoặc bản đã kiểm thử vào thứ Sáu.' },
            { who: 'Manager', en: 'We need something tomorrow for the demo.', vi: 'Chúng ta cần có gì đó ngày mai để demo.' },
            { who: 'Cuong', en: 'Then let’s do the rough version, and I’ll finish properly by Friday. What should I deprioritize?', vi: 'Vậy làm bản thô, và tôi hoàn thiện trước thứ Sáu. Tôi nên hạ ưu tiên việc nào?' },
          ],
        },
      ],
      vocab: [
        { en: "I'd rather not", ipa: '/aɪd ˈrɑːðə nɒt/', vi: 'Tôi không muốn lắm', pos: 'phr' },
        { en: 'at capacity', ipa: '/æt kəˈpæsəti/', vi: 'đã kín việc', pos: 'phr' },
        { en: 'deprioritize', ipa: '/diːpraɪˈɒrɪtaɪz/', vi: 'hạ ưu tiên', pos: 'v' },
        { en: 'realistic', ipa: '/ˌriːəˈlɪstɪk/', vi: 'khả thi', pos: 'adj' },
        { en: 'commit to', ipa: '/kəˈmɪt tuː/', vi: 'cam kết', pos: 'phr' },
        { en: 'slip (a deadline)', ipa: '/slɪp/', vi: 'bị trễ', pos: 'v' },
        { en: 'bandwidth', ipa: '/ˈbændwɪdθ/', vi: 'khả năng nhận thêm việc', pos: 'n', ex: "I don't have the bandwidth this week.", exVi: 'Tuần này tôi không kham thêm được.' },
        { en: 'workload', ipa: '/ˈwɜːkləʊd/', vi: 'khối lượng việc', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Từ chối bằng hai phương án',
          explain:
            'Một chữ "không" làm bế tắc. Hai phương án giữ cho cuộc trao đổi tiếp tục và cho người kia '
            + 'cảm giác được chọn.',
          formula: 'Not [như yêu cầu]. I could either [A] or [B]. Which works better?',
          examples: [
            { en: 'I could do a rough version tomorrow, or a tested one Friday. Which works better?', vi: 'Tôi làm bản thô ngày mai, hoặc bản đã kiểm thử thứ Sáu. Cái nào hợp hơn?' },
          ],
        },
        {
          title: '"would rather" — nói ý muốn một cách nhẹ',
          explain: 'Diễn đạt sự lựa chọn/mong muốn mà không nghe cứng nhắc.',
          formula: 'S + would rather + V(nguyên thể) · would rather not + V',
          examples: [
            { en: "I'd rather not work this weekend.", vi: 'Tôi không muốn làm cuối tuần này.' },
            { en: "I'd rather finish this first.", vi: 'Tôi muốn làm xong cái này trước.' },
          ],
          mistake: '❌ "I would rather to work" → ✅ "I would rather work" (không có "to").',
        },
      ],
      practice: [
        'Viết 3 lời từ chối theo mẫu hai phương án cho các yêu cầu bạn hay gặp.',
        'Học thuộc: "I\'d rather not", "I\'m at capacity", "What should I deprioritize?".',
        'Tập nói "không" 5 lần mà không dùng từ "no".',
      ],
    },

    {
      day: 29,
      icon: '😤',
      title: 'Xử lý khiếu nại & khách không hài lòng',
      goal: 'Giữ được khách khi có sự cố — quan trọng hơn cả việc không bao giờ mắc lỗi.',
      qa: [
        {
          q: { en: 'This is not what we agreed on.', vi: 'Cái này không giống thoả thuận.', ipa: '/nɒt wɒt wiː əˈɡriːd/' },
          answers: [
            { en: 'You’re right, let me look into it right away.', vi: 'Bạn nói đúng, để tôi kiểm tra ngay.', ipa: '/lʊk ˈɪntuː/', note: 'Công nhận trước, điều tra sau. Đừng cãi lúc họ đang bực.' },
            { en: 'Let me pull up the spec so we’re looking at the same thing.', vi: 'Để tôi mở bản đặc tả ra để hai bên nhìn cùng một thứ.', ipa: '/spek/', note: 'Đưa về tài liệu — tránh tranh cãi dựa trên trí nhớ.' },
          ],
        },
        {
          q: { en: 'We’re very disappointed.', vi: 'Chúng tôi rất thất vọng.', ipa: '/ˌdɪsəˈpɔɪntɪd/' },
          answers: [
            { en: 'I’m sorry — that’s not the experience I want you to have.', vi: 'Tôi xin lỗi — đó không phải trải nghiệm tôi muốn bạn nhận.', ipa: '/ɪkˈspɪəriəns/', note: 'Xin lỗi về TRẢI NGHIỆM, dù nguyên nhân chưa rõ.' },
            { en: 'Thank you for telling me directly. Here’s how I’ll fix it.', vi: 'Cảm ơn bạn đã nói thẳng. Đây là cách tôi sẽ khắc phục.', ipa: '/dəˈrektli/' },
          ],
        },
        {
          q: { en: 'We want a refund.', vi: 'Chúng tôi muốn hoàn tiền.', ipa: '/ˈriːfʌnd/' },
          answers: [
            { en: 'I understand. Before that, would you let me fix it at no extra cost?', vi: 'Tôi hiểu. Trước khi vậy, bạn cho tôi khắc phục miễn phí được không?', ipa: '/nəʊ ˈekstrə kɒst/', note: 'Đề nghị sửa trước khi bàn tới hoàn tiền.' },
            { en: 'If that’s what you need, I’ll process it. Can we talk about what went wrong first?', vi: 'Nếu đó là điều bạn cần, tôi sẽ xử lý. Ta nói về chuyện đã sai trước được không?', ipa: '/ˈprəʊses/' },
          ],
        },
        {
          q: { en: 'How will you make sure this doesn’t happen again?', vi: 'Bạn làm sao để không tái diễn?', ipa: '/meɪk ʃʊər/' },
          answers: [
            { en: 'Three things: a checklist before delivery, a test run, and a weekly update to you.', vi: 'Ba việc: một danh mục kiểm tra trước bàn giao, một lần chạy thử, và cập nhật hằng tuần cho bạn.', ipa: '/ˈtʃeklɪst/', note: 'Cam kết CỤ THỂ, đếm được — không nói chung chung "tôi sẽ cẩn thận hơn".' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Recovering an unhappy client',
          titleVi: 'Giữ lại khách hàng đang thất vọng',
          lines: [
            { who: 'Client', en: 'This is not what we agreed on. We’re very disappointed.', vi: 'Cái này không giống thoả thuận. Chúng tôi rất thất vọng.' },
            { who: 'Cuong', en: 'I’m sorry — that’s not the experience I want you to have. Let me pull up the spec.', vi: 'Tôi xin lỗi — đó không phải trải nghiệm tôi muốn bạn nhận. Để tôi mở bản đặc tả.' },
            { who: 'Client', en: 'The report was supposed to be daily, not weekly.', vi: 'Báo cáo lẽ ra phải hằng ngày, không phải hằng tuần.' },
            { who: 'Cuong', en: 'You’re right, that’s on me — I misread it. I can have the daily version by Wednesday at no extra cost.', vi: 'Bạn nói đúng, đó là lỗi của tôi — tôi đọc nhầm. Tôi làm bản hằng ngày xong trước thứ Tư, không tính thêm phí.' },
            { who: 'Client', en: 'And how do we avoid this next time?', vi: 'Và làm sao tránh lần sau?' },
            { who: 'Cuong', en: 'I’ll send a one-page summary for you to confirm before I start each phase.', vi: 'Tôi sẽ gửi bản tóm tắt một trang để bạn xác nhận trước mỗi giai đoạn.' },
          ],
        },
      ],
      vocab: [
        { en: 'disappointed', ipa: '/ˌdɪsəˈpɔɪntɪd/', vi: 'thất vọng', pos: 'adj' },
        { en: 'look into', ipa: '/lʊk ˈɪntuː/', vi: 'xem xét, điều tra', pos: 'phr' },
        { en: 'spec', ipa: '/spek/', vi: 'bản đặc tả', pos: 'n' },
        { en: 'at no extra cost', ipa: '/nəʊ ˈekstrə kɒst/', vi: 'không tính thêm phí', pos: 'phr' },
        { en: 'misread', ipa: '/ˌmɪsˈriːd/', vi: 'đọc nhầm', pos: 'v' },
        { en: 'make it right', ipa: '/meɪk ɪt raɪt/', vi: 'khắc phục cho đúng', pos: 'phr' },
        { en: 'goodwill', ipa: '/ˌɡʊdˈwɪl/', vi: 'thiện chí', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Xin lỗi đúng cách — 4 bước',
          explain:
            'Xin lỗi hời hợt làm khách bực thêm. Bốn bước: xin lỗi về trải nghiệm → nhận phần đúng của họ '
            + '→ nêu cách khắc phục CÓ MỐC → nêu cách phòng ngừa.',
          formula: 'I’m sorry… + You’re right… + I’ll [khắc phục] by [mốc] + To prevent this, I’ll [biện pháp].',
          examples: [
            { en: "I'm sorry. You're right — I misread the spec. I'll fix it by Wednesday, and I'll send a summary for you to confirm before each phase.", vi: 'Tôi xin lỗi. Bạn nói đúng — tôi đọc nhầm đặc tả. Tôi sửa xong trước thứ Tư, và sẽ gửi bản tóm tắt để bạn xác nhận trước mỗi giai đoạn.' },
          ],
          mistake: '"Sorry for any inconvenience" nghe như thư máy — quá chung chung, không ai cảm động.',
        },
      ],
      practice: [
        'Viết một lời xin lỗi đủ 4 bước cho một sự cố bạn từng gặp.',
        'Học thuộc: "That\'s not the experience I want you to have" và "Let me look into it right away".',
        'Tập biến "tôi sẽ cẩn thận hơn" thành một cam kết CỤ THỂ đếm được.',
      ],
    },

    {
      day: 30,
      icon: '🤝',
      title: 'Chốt hợp đồng & giữ quan hệ dài hạn',
      goal: 'Kết thúc đàm phán thành hợp đồng, và biến khách một lần thành khách lâu dài.',
      qa: [
        {
          q: { en: 'So, are we good to go?', vi: 'Vậy chốt được chưa?', ipa: '/ɡʊd tuː ɡəʊ/' },
          answers: [
            { en: 'Yes. I’ll send the contract today, and we start once it’s signed.', vi: 'Vâng. Tôi gửi hợp đồng hôm nay, và bắt đầu khi ký xong.', ipa: '/ðə ˈkɒntrækt/' },
            { en: 'Almost — I just need confirmation on the timeline.', vi: 'Gần rồi — tôi chỉ cần xác nhận về tiến độ.', ipa: '/ˌkɒnfəˈmeɪʃn/' },
          ],
        },
        {
          q: { en: 'We’ll think about it and get back to you.', vi: 'Chúng tôi cân nhắc rồi phản hồi bạn.', ipa: '/ɡet bæk tuː juː/', note: 'Thường là dấu hiệu do dự. Đừng để trôi — hãy chốt mốc.' },
          answers: [
            { en: 'Of course. Would it help if I sent a one-page summary?', vi: 'Tất nhiên. Tôi gửi bản tóm tắt một trang có giúp gì không?', ipa: '/wʊd ɪt help/' },
            { en: 'Sure. Can I follow up on Thursday?', vi: 'Được. Thứ Năm tôi hỏi lại nhé?', ipa: '/ˈfɒləʊ ʌp/', note: 'Luôn chốt một mốc cụ thể để theo dõi.' },
          ],
        },
        {
          q: { en: 'It was great working with you.', vi: 'Rất vui được làm việc với bạn.', ipa: '/ɡreɪt ˈwɜːkɪŋ/' },
          answers: [
            { en: 'Likewise! If anything comes up, you know where to find me.', vi: 'Tôi cũng vậy! Có việc gì cứ liên hệ tôi.', ipa: '/ˈlaɪkwaɪz/' },
            { en: 'Thank you. Would you be open to writing a short testimonial?', vi: 'Cảm ơn bạn. Bạn viết giúp một nhận xét ngắn được không?', ipa: '/ˌtestɪˈməʊniəl/', note: 'Xin nhận xét ngay lúc khách đang hài lòng nhất.' },
          ],
        },
        {
          q: { en: 'Do you know anyone else who might need this?', vi: 'Bạn có biết ai khác cần dịch vụ này không?', ipa: '/ˈeniwʌn els/' },
          answers: [
            { en: 'That’s kind of you to ask — I’d really appreciate a referral.', vi: 'Bạn tốt quá khi hỏi vậy — tôi rất trân trọng nếu được giới thiệu.', ipa: '/rɪˈfɜːrəl/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Closing the deal',
          titleVi: 'Chốt hợp đồng',
          lines: [
            { who: 'Client', en: 'We’ll think about it and get back to you.', vi: 'Chúng tôi cân nhắc rồi phản hồi bạn.' },
            { who: 'Cuong', en: 'Of course. Would it help if I sent a one-page summary of the scope and price?', vi: 'Tất nhiên. Tôi gửi bản tóm tắt một trang về phạm vi và giá có giúp gì không?' },
            { who: 'Client', en: 'That would be useful, yes.', vi: 'Có, sẽ hữu ích.' },
            { who: 'Cuong', en: 'I’ll send it today. Can I follow up on Thursday?', vi: 'Tôi gửi hôm nay. Thứ Năm tôi hỏi lại nhé?' },
            { who: 'Client', en: 'Thursday works.', vi: 'Thứ Năm được.' },
            { who: 'Cuong', en: 'Great. And whatever you decide, thanks for considering us.', vi: 'Tuyệt. Và dù bạn quyết thế nào, cảm ơn đã cân nhắc chúng tôi.' },
          ],
        },
      ],
      vocab: [
        { en: 'good to go', ipa: '/ɡʊd tuː ɡəʊ/', vi: 'sẵn sàng, chốt được', pos: 'phr' },
        { en: 'testimonial', ipa: '/ˌtestɪˈməʊniəl/', vi: 'lời nhận xét của khách', pos: 'n' },
        { en: 'referral', ipa: '/rɪˈfɜːrəl/', vi: 'sự giới thiệu khách', pos: 'n' },
        { en: 'contract', ipa: '/ˈkɒntrækt/', vi: 'hợp đồng', pos: 'n' },
        { en: 'confirmation', ipa: '/ˌkɒnfəˈmeɪʃn/', vi: 'sự xác nhận', pos: 'n' },
        { en: 'long-term', ipa: '/lɒŋ tɜːm/', vi: 'dài hạn', pos: 'adj' },
        { en: 'onboard (a client)', ipa: '/ɒnˈbɔːd/', vi: 'tiếp nhận khách mới', pos: 'v' },
      ],
      grammar: [
        {
          title: 'Không bao giờ để cuộc trao đổi kết thúc mở',
          explain:
            'Khi khách nói "để tôi nghĩ đã", nếu bạn chỉ đáp "vâng" thì 80% sẽ im luôn. Hãy đề nghị giúp '
            + 'thêm một bước, rồi chốt một mốc theo dõi cụ thể.',
          formula: 'Would it help if I [hành động]? + Can I follow up on [ngày]?',
          examples: [
            { en: 'Would it help if I sent a summary? Can I follow up on Thursday?', vi: 'Tôi gửi bản tóm tắt có giúp không? Thứ Năm tôi hỏi lại nhé?' },
          ],
        },
      ],
      practice: [
        'Viết kịch bản chốt hợp đồng cho dịch vụ của bạn, kết bằng một mốc theo dõi.',
        'Học thuộc: "Would it help if I…?", "Can I follow up on…?", "I\'d appreciate a referral".',
        'ÔN TUẦN 6: đóng vai trọn một vòng — báo giá, bị chê đắt, thương lượng phạm vi, chốt hợp đồng.',
      ],
    },
  ],
};
