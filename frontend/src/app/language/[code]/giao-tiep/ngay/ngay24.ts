/**
 * Tiếng Anh giao tiếp — NGÀY 24 (chặng 4 "Giao tiếp sâu", B2): khác biệt văn hoá — nói thẳng / nói vòng, đùa, chủ đề nhạy cảm;
 * khi lỡ lời thì chữa ngượng, đổi chủ đề. + KIỂM TRA CHẶNG 4 (Ngày 19–24).
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework · review `gtd24-kiem-tra`. Mọi id bắt đầu `gtd24-`.
 * Ngữ pháp trong câu: might / could / would làm mềm câu (It might be worth + V-ing · Could you maybe…? · That could be a bit…
 * · I'd suggest / I'd say · Would it be okay if I + V-ed?). Nối câu: that said · to be honest · on a lighter note.
 * Cảnh: Trâm — sinh viên IT năm 3 đang OJT ở Wildmoor, một công ty phần mềm tại TP.HCM có team đa quốc gia — chuẩn bị
 * bài nói về Tết cho buổi "Culture Friday": Joris (Hà Lan) góp ý thẳng tuột làm Trâm chùng xuống, Tamsin (Anh) nói đúng ý đó
 * bằng "Just a thought, but it might be worth…"; bữa trưa Trâm hiểu câu mỉa mai mặt lạnh của Tamsin theo nghĩa đen và bị Wade
 * (Úc) trêu; bữa tối Trâm đùa về người Úc và bia — Wade không uống rượu — rồi chữa ngượng, đổi chủ đề; Joris hỏi thẳng lương
 * thực tập, Trâm né khéo bằng một câu đùa.
 * Khác podcast en-ds-c1-01 (What They Say vs. What They Mean: nói giảm kiểu Anh, từ chối, nhận lời khen, nhận xét cân nặng):
 * hôm nay là góp ý kiểu Hà Lan, mỉa mai mặt lạnh, trêu kiểu Úc, và QUY TRÌNH chữa ngượng sau khi lỡ lời. Khác Ngày 14 (bản đồ
 * chủ đề nên tránh) và Ngày 19 (chê nhầm bài của diễn giả).
 * Những nhận xét về văn hoá từng nước là XU HƯỚNG CHUNG, bài nói rõ mỗi người mỗi khác.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_24: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd24-nghe',
    kind: 'listening',
    title: 'Khác biệt văn hoá: nói thẳng / vòng, đùa, chủ đề nhạy cảm',
    goal: 'Nghe hiểu ba cảnh trong một team đa quốc gia: góp ý thẳng kiểu Hà Lan và vòng kiểu Anh, câu mỉa mai mặt lạnh và câu trêu kiểu Úc, một câu đùa lỡ lời và cách chữa; nhận ra câu nói thật ra mang ý gì.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay: cùng một ý, mỗi nước nói một kiểu',
        items: [
          'Ngày cuối chặng 4. Bạn đã kết bạn, đón khách, phàn nàn, thương lượng, kể tin. Hôm nay là thứ khó thấy nhất: **cùng một câu tiếng Anh, người mỗi nước hiểu khác nhau**.',
          'Bạn theo **Trâm**, sinh viên IT năm 3 đang OJT ở **Wildmoor**, một công ty phần mềm tại TP.HCM. Team của Trâm có **Joris** (Hà Lan), **Tamsin** (Anh) và **Wade** (Úc). Thứ Sáu này Trâm nói 10 phút về **Tết** ở buổi "Culture Friday" của công ty.',
          'Bạn cần nghe ra: câu nào là **góp ý thật**, câu nào là **đùa**, câu nào là **mỉa**, và khi Trâm **lỡ lời** thì cô ấy gỡ bằng những câu gì.',
          'Tốc độ khoảng **165 từ/phút**, câu dễ không dịch. Câu đùa và câu mỉa thường **không đổi giọng**: phải nghe ngữ cảnh, không chỉ nghe từ.',
          'Mọi nhận xét về "người Hà Lan, người Anh, người Úc" trong bài là **xu hướng chung**. Mỗi người mỗi khác, đừng dùng nó để đoán một người cụ thể.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Thứ Tư: góp ý thẳng tuột và góp ý vòng vèo' },
      {
        t: 'canh',
        anh: ['laptop', 'woman-technologist', 'man-office-worker', 'framed-picture', 'pensive-face'],
        caption: 'Thứ Tư, 4 giờ chiều. **Trâm** mở bộ slide về Tết đã làm suốt cuối tuần và nhờ **Joris** (người Hà Lan, kỹ sư lâu năm) xem giúp. Lát sau **Tamsin** (người Anh, quản lý dự án) đi ngang.',
      },
      {
        t: 'listen',
        id: 'gtd24-nghe-canh1',
        title: 'Scene 1 — Feedback, two ways',
        note: 'Nghe xem: Joris góp ý những gì; vì sao Trâm im lặng; Tamsin nói lại cùng ý đó thế nào; Trâm rút ra điều gì về câu "just a thought".',
        lines: [
          { who: 'Trâm', voice: 'us-nu', text: "Joris, have you got a minute? Could you look over my slides for Culture Friday?", vi: 'Joris, anh rảnh một phút không? Anh xem giúp em mấy slide cho buổi Culture Friday được không?' },
          { who: 'Joris', voice: 'ca-nam', text: "Sure. Let's see. Okay, slide three is too long. Nobody will read all that text.", vi: 'Được. Xem nào. Rồi, slide ba dài quá. Không ai đọc hết chỗ chữ đó đâu.' },
          { who: 'Trâm', voice: 'us-nu', text: 'Oh. Okay.' },
          { who: 'Joris', voice: 'ca-nam', text: 'And the photo on slide five is blurry. Replace it. The rest is fine.', vi: 'Còn ảnh ở slide năm bị mờ. Thay đi. Phần còn lại ổn.' },
          { who: 'Trâm', voice: 'us-nu', text: 'Right. Thanks.' },
          { who: 'Joris', voice: 'ca-nam', text: "Is something wrong? You've gone very quiet.", vi: 'Có chuyện gì à? Tự nhiên em im hẳn.' },
          { who: 'Trâm', voice: 'us-nu', text: "No, no. It's just… I spent the whole weekend on these.", vi: 'Không, không ạ. Chỉ là… em làm mấy cái này cả cuối tuần.' },
          { who: 'Joris', voice: 'ca-nam', text: "Ah. I didn't say they were bad. Honestly, the structure is really good. Where I'm from, if something needs fixing, you just say it. It's not personal.", vi: 'À. Anh đâu có nói chúng tệ. Thật lòng, bố cục rất tốt. Ở chỗ anh, cái gì cần sửa thì nói thẳng. Không phải nhắm vào người.' },
          { who: 'Trâm', voice: 'us-nu', text: "I see. In Vietnam, we'd usually start with something positive. Hearing 'too long' first felt a bit harsh.", vi: 'Em hiểu rồi. Ở Việt Nam, bọn em thường mở đầu bằng điều tích cực. Nghe "dài quá" đầu tiên thấy hơi nặng.' },
          { who: 'Joris', voice: 'ca-nam', text: "That's fair. I'll try to remember that. So, the good news first: your story about your grandmother's kitchen is the best part.", vi: 'Có lý. Anh sẽ cố nhớ. Vậy tin vui trước: chuyện về gian bếp của bà em là phần hay nhất.' },
          { who: 'Trâm', voice: 'us-nu', text: "Thank you! That's much easier to hear." },
          { who: 'Tamsin', voice: 'uk-nu', text: 'Ooh, are these the Tết slides? They look lovely. Just a thought, but it might be worth trimming slide three a touch?', vi: 'Ồ, đây là slide về Tết à? Đẹp quá. Chỉ là một ý thôi, nhưng có lẽ nên cắt bớt slide ba một chút?' },
          { who: 'Trâm', voice: 'us-nu', text: "Ha! Joris just said exactly the same thing. Only he said 'too long'.", vi: 'Ha! Anh Joris vừa nói y hệt. Có điều anh ấy nói "dài quá".' },
          { who: 'Tamsin', voice: 'uk-nu', text: "Did he? Well, he's not wrong. I just took a bit longer to say it.", vi: 'Thế à? Ừ thì anh ấy nói đúng. Chị chỉ mất thêm chút thời gian để nói ra thôi.' },
          { who: 'Joris', voice: 'ca-nam', text: 'About twenty seconds longer.', vi: 'Lâu hơn khoảng hai mươi giây.' },
          { who: 'Trâm', voice: 'us-nu', text: "So when you say 'just a thought', you actually mean 'please change it'?", vi: 'Vậy khi chị nói "chỉ là một ý thôi", thật ra ý chị là "làm ơn sửa đi"?' },
          { who: 'Tamsin', voice: 'uk-nu', text: "Pretty much, yes. Don't tell anyone.", vi: 'Gần như vậy. Đừng kể với ai nhé.' },
        ],
      },
      {
        t: 'note',
        title: 'Về giọng đọc trong cảnh này',
        items: [
          'Joris là người **Hà Lan**. Kho giọng của bài không có giọng Hà Lan nên dùng một giọng chuẩn. Người Hà Lan thật nói tiếng Anh thường **rất trôi chảy**; dễ nhận ra ở âm /s/ cuối từ đọc gần như /s/ cả khi phải là /z/, âm "th" đôi khi thành /t/ hoặc /d/, và câu **ngắn, ít từ đệm**.',
          'Nghe người Hà Lan, Đức hay Bắc Âu góp ý: câu ngắn và thẳng **không có nghĩa là họ giận**. Hãy nghe nội dung, đừng nghe "nhiệt độ".',
        ],
      },
      {
        t: 'mcq',
        id: 'gtd24-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Joris góp ý hai điểm nào?',
            options: ['Màu sắc và phông chữ', 'Slide ba quá nhiều chữ, ảnh ở slide năm bị mờ', 'Bài quá ngắn và thiếu ảnh', 'Câu chuyện về bà của Trâm quá dài'],
            correct: 1,
            why: '"slide three is too long… the photo on slide five is blurry." Còn câu chuyện về gian bếp của bà thì Joris khen là "the best part".',
          },
          {
            q: 'Vì sao Trâm im lặng?',
            options: ['Trâm không hiểu tiếng Anh của Joris', 'Trâm buồn vì làm cả cuối tuần mà nghe chê trước, không có câu khen nào mở đầu', 'Trâm giận Joris vì anh nói sai', 'Trâm đang bận'],
            correct: 1,
            why: '"I spent the whole weekend on these… In Vietnam, we\'d usually **start with something positive**. Hearing \'too long\' first felt a bit harsh."',
          },
          {
            q: 'Tamsin nói "Just a thought, but it might be worth trimming slide three a touch?" Ý thật là gì?',
            options: ['Một gợi ý tuỳ ý, không sửa cũng được', 'Lời đề nghị lịch sự nhưng rõ ràng: nên cắt bớt slide ba', 'Tamsin khen slide ba', 'Tamsin không chắc slide ba có vấn đề'],
            correct: 1,
            why: 'Chính Tamsin xác nhận "Just a thought" = "please change it" (**Pretty much, yes**). Lối nói vòng kiểu Anh: **Just a thought · might be worth · a touch** làm câu nhẹ đi, nhưng thông điệp vẫn là "sửa đi".',
          },
          {
            q: '"About twenty seconds longer." Joris đang làm gì?',
            options: ['Phàn nàn Tamsin nói dài', 'Đùa mặt lạnh: góp ý vòng chỉ tốn thêm vài giây', 'Tính giờ cho bài nói của Trâm', 'Xin lỗi Trâm'],
            correct: 1,
            why: 'Một câu đùa khô nối tiếp câu "I just took a bit longer to say it" của Tamsin. Không có tiếng cười, không đổi giọng; phải hiểu từ ngữ cảnh.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Thứ Năm, giờ trưa: câu mỉa mai và câu trêu' },
      {
        t: 'canh',
        anh: ['bowl-with-spoon', 'woman-office-worker', 'man-office-worker', 'expressionless-face', 'winking-face'],
        caption: 'Thứ Năm, 12 giờ 10, ở bàn ăn trưa của văn phòng. **Tamsin** vừa xem lịch họp. **Wade** (người Úc, kiểm thử) mang hộp cơm tới ngồi cùng.',
      },
      {
        t: 'listen',
        id: 'gtd24-nghe-canh2',
        title: 'Scene 2 — Sarcasm and a bit of teasing',
        note: 'Nghe xem: câu nào Tamsin nói ngược ý mình; Trâm hiểu nhầm thế nào; Wade trêu Trâm chuyện gì và nói thật ra sao; cuối cảnh Trâm làm gì khiến Wade khen.',
        lines: [
          { who: 'Tamsin', voice: 'uk-nu', text: 'Oh, marvellous. Another seven a.m. call with the London office tomorrow. My favourite thing in the world.', vi: 'Ôi, tuyệt vời. Mai lại một cuộc gọi bảy giờ sáng với văn phòng London. Thứ chị thích nhất trên đời.' },
          { who: 'Trâm', voice: 'us-nu', text: "Really? I thought you didn't like early meetings.", vi: 'Thật ạ? Em tưởng chị không thích họp sớm.' },
          { who: 'Tamsin', voice: 'uk-nu', text: "I don't! That was sarcasm. I'm absolutely dreading it.", vi: 'Có thích đâu! Chị mỉa đấy. Chị sợ cuộc gọi đó muốn chết.' },
          { who: 'Trâm', voice: 'us-nu', text: "Oh! Sorry. Your face didn't change at all." },
          { who: 'Tamsin', voice: 'uk-nu', text: "That's the trick. A proper British joke comes with a straight face.", vi: 'Bí quyết là thế. Câu đùa đúng kiểu Anh phải đi kèm khuôn mặt tỉnh bơ.' },
          { who: 'Wade', voice: 'au-nam', text: "Here she is, the slide queen! Heard Joris tore your presentation to pieces.", vi: 'Nữ hoàng slide đây rồi! Nghe nói Joris xé nát bài thuyết trình của em.' },
          { who: 'Trâm', voice: 'us-nu', text: 'What? Who told you that? He only had two comments.', vi: 'Gì cơ? Ai bảo anh thế? Anh ấy chỉ góp có hai ý.' },
          { who: 'Wade', voice: 'au-nam', text: "Relax, I'm pulling your leg. Joris told me it was the best draft he'd seen all year.", vi: 'Bình tĩnh, anh đùa thôi. Joris bảo anh đó là bản nháp tốt nhất anh ấy thấy từ đầu năm.' },
          { who: 'Trâm', voice: 'us-nu', text: "He said that? He didn't say that to me!" },
          { who: 'Wade', voice: 'au-nam', text: "Course not. Compliments to your face? Way too risky. He sends them through a third party.", vi: 'Tất nhiên rồi. Khen thẳng mặt á? Liều quá. Anh ấy khen qua người thứ ba.' },
          { who: 'Tamsin', voice: 'uk-nu', text: 'Wade, stop winding her up.', vi: 'Wade, đừng trêu con bé nữa.' },
          { who: 'Wade', voice: 'au-nam', text: "Sorry, sorry. Back home, if we give you a hard time, it means we like you. If we're super polite, that's when you should worry.", vi: 'Xin lỗi, xin lỗi. Ở bên anh, trêu em tức là quý em. Còn lịch sự quá mức thì lúc đó mới đáng lo.' },
          { who: 'Trâm', voice: 'us-nu', text: "Okay… so should I be worried that Tamsin is always so polite to me?", vi: 'Ra vậy… thế em có nên lo vì chị Tamsin lúc nào cũng lịch sự với em không?' },
          { who: 'Wade', voice: 'au-nam', text: "Ha! Good one. See? She's learning.", vi: 'Ha! Câu hay. Thấy chưa? Con bé học nhanh đấy.' },
          { who: 'Tamsin', voice: 'uk-nu', text: "Lovely. I'll be terribly polite to both of you for the rest of the week, then.", vi: 'Hay lắm. Vậy chị sẽ lịch sự kinh khủng với cả hai đứa tới hết tuần.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd24-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: '"Oh, marvellous… My favourite thing in the world." Tamsin thật ra cảm thấy thế nào về cuộc gọi bảy giờ sáng?',
            options: ['Rất thích', 'Rất ngại, sợ cuộc gọi đó', 'Không quan tâm', 'Hồi hộp vì vui'],
            correct: 1,
            why: '"That was **sarcasm**. I\'m absolutely **dreading** it." Mỉa mai = nói điều ngược với ý mình, thường bằng từ khen (marvellous, lovely, brilliant) với giọng phẳng.',
          },
          {
            q: 'Wade nói "Relax, I\'m pulling your leg." nghĩa là gì?',
            options: ['Anh ấy đang kéo chân Trâm', 'Anh ấy chỉ đùa, câu "Joris xé nát bài" không có thật', 'Anh ấy xin lỗi thật lòng', 'Anh ấy muốn Trâm đi cùng'],
            correct: 1,
            why: '**pull someone\'s leg** = trêu, nói đùa cho người ta tin. Sự thật là Joris khen bản nháp.',
          },
          {
            q: 'Theo Wade, ở Úc bị trêu nghĩa là gì?',
            options: ['Người ta không thích bạn', 'Người ta quý bạn; lịch sự quá mức mới đáng lo', 'Bạn làm sai việc', 'Bạn phải trêu lại ngay'],
            correct: 1,
            why: '"if we give you a hard time, it means we like you. If we\'re super polite, that\'s when you should worry." Kiểu trêu thân này người Úc hay gọi là **banter**.',
          },
          {
            q: 'Cuối cảnh, vì sao Wade khen "Good one. She\'s learning."?',
            options: ['Vì Trâm cảm ơn đúng cách', 'Vì Trâm trêu lại bằng chính "luật" của Wade: lo vì Tamsin luôn lịch sự', 'Vì Trâm đổi chủ đề', 'Vì Trâm từ chối trả lời'],
            correct: 1,
            why: 'Trâm dùng lại logic của Wade để đùa một câu nhẹ về Tamsin. Đáp câu trêu bằng một câu trêu nhẹ là cách **hoà vào nhóm** nhanh nhất.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Thứ Sáu, bữa tối sau Culture Friday: lỡ lời' },
      {
        t: 'canh',
        anh: ['fork-and-knife-with-plate', 'clinking-glasses', 'man-office-worker', 'grimacing-face', 'tropical-drink', 'coin'],
        caption: 'Thứ Sáu, 7 giờ tối. Bài nói về Tết của Trâm được cả công ty vỗ tay. Cả team đi ăn mừng ở một quán ăn Việt. Trâm đang rất vui, và **hơi quá tự tin** sau vụ trêu lại Wade hôm qua.',
      },
      {
        t: 'listen',
        id: 'gtd24-nghe-canh3',
        title: 'Scene 3 — The dinner and the joke that missed',
        note: 'Nghe xem: câu đùa nào của Trâm hỏng và vì sao; Trâm gỡ bằng những câu nào; Joris hỏi câu gì khiến Tamsin kêu lên; Trâm né thế nào; cuối bữa Trâm nhờ Joris điều gì.',
        lines: [
          { who: 'Wade', voice: 'au-nam', text: "Right, who's ordering what? I'm starving." },
          { who: 'Trâm', voice: 'us-nu', text: "Wade, you're Australian, so you'll want, what, five beers? Shall I just order a whole crate?", vi: 'Wade, anh là người Úc, vậy chắc anh muốn, cỡ, năm chai bia nhỉ? Em gọi luôn nguyên két nhé?' },
          { who: 'Wade', voice: 'au-nam', text: "Ha… actually, I don't drink. Haven't for about six years.", vi: 'Ha… thật ra anh không uống rượu bia. Khoảng sáu năm nay rồi.' },
          { who: 'Trâm', voice: 'us-nu', text: "Oh. Oh no. Sorry, that came out completely wrong. I was trying to be funny, and it really didn't work.", vi: 'Ôi. Ôi không. Em xin lỗi, câu đó nói ra sai hoàn toàn. Em cố đùa mà hỏng hẳn.' },
          { who: 'Wade', voice: 'au-nam', text: "Honestly, don't worry about it. I get that one a lot.", vi: 'Thật đấy, đừng lo. Anh nghe câu đó suốt.' },
          { who: 'Trâm', voice: 'us-nu', text: "I shouldn't have assumed. That was a lazy joke.", vi: 'Lẽ ra em không nên mặc định như thế. Câu đùa đó dễ dãi quá.' },
          { who: 'Wade', voice: 'au-nam', text: "No harm done. Actually, could you recommend something without alcohol? Something local?", vi: 'Không sao cả. À, em gợi ý giúp anh món gì không cồn được không? Món địa phương ấy?' },
          { who: 'Trâm', voice: 'us-nu', text: "Yes! You might like sugarcane juice with kumquat. Or salted lemonade. It sounds strange, but it's really refreshing.", vi: 'Có ạ! Chắc anh sẽ thích nước mía tắc. Hoặc chanh muối. Nghe thì lạ nhưng uống mát lắm.' },
          { who: 'Wade', voice: 'au-nam', text: 'Salted lemonade? Now that I have to try.', vi: 'Chanh muối á? Cái đó thì anh phải thử.' },
          { who: 'Joris', voice: 'ca-nam', text: 'Trâm, can I ask you something? How much do they pay interns here?', vi: 'Trâm, anh hỏi em một câu được không? Ở đây thực tập sinh được trả bao nhiêu?' },
          { who: 'Tamsin', voice: 'uk-nu', text: 'Joris!' },
          { who: 'Joris', voice: 'ca-nam', text: "What? Back home that's a normal question. Well… fairly normal.", vi: 'Sao? Ở bên anh đó là câu hỏi bình thường. Thì… cũng khá bình thường.' },
          { who: 'Trâm', voice: 'us-nu', text: 'Ha, it covers my rent and my milk tea habit. Just about.', vi: 'Ha, đủ trả tiền nhà với tiền trà sữa của em. Vừa khít.' },
          { who: 'Joris', voice: 'ca-nam', text: 'Fair enough. Sorry, that was a bit personal.', vi: 'Hiểu rồi. Xin lỗi, câu đó hơi riêng tư.' },
          { who: 'Trâm', voice: 'us-nu', text: 'No worries. So, on a lighter note, what did everyone think of the talk today?', vi: 'Không sao ạ. Thôi, chuyện vui hơn nhé: mọi người thấy bài nói hôm nay thế nào?' },
          { who: 'Tamsin', voice: 'uk-nu', text: 'Loved it. Especially slide three. Beautifully short.', vi: 'Thích lắm. Nhất là slide ba. Ngắn đẹp.' },
          { who: 'Joris', voice: 'ca-nam', text: 'You see? My feedback worked.' },
          { who: 'Trâm', voice: 'us-nu', text: 'It did. Next time, though, could you maybe start with the good news?', vi: 'Đúng thế. Nhưng lần sau, anh có thể mở đầu bằng tin vui được không?' },
          { who: 'Joris', voice: 'ca-nam', text: "I'll think about it. That's a Dutch yes, by the way.", vi: 'Anh sẽ suy nghĩ. Nói luôn, đó là chữ "có" kiểu Hà Lan.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd24-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao câu đùa của Trâm hỏng?',
            options: ['Wade không hiểu tiếng Anh của Trâm', 'Trâm đùa dựa vào quốc tịch, mà Wade không uống rượu bia', 'Quán không bán bia', 'Wade không thích đùa'],
            correct: 1,
            why: 'Đùa kiểu "người nước X thì chắc…" dựa trên **khuôn mẫu** (stereotype). Trúng thì vô duyên, trật thì ngượng. Trâm tự nhận: "**I shouldn\'t have assumed.**"',
          },
          {
            q: 'Trâm gỡ ngượng theo trình tự nào?',
            options: ['Xin lỗi thật dài, giải thích vì sao người Việt hay đùa như vậy', 'Nhận ngay một câu ngắn, nhận lỗi đúng chỗ, rồi chuyển sang việc mới (gợi ý đồ uống)', 'Cười to rồi coi như không có gì', 'Đổ lỗi cho Wade quá nhạy cảm'],
            correct: 1,
            why: '"**Sorry, that came out completely wrong.**" → "**I shouldn\'t have assumed.**" → gợi ý "sugarcane juice with kumquat". Ngắn, thật, rồi mở một cửa mới.',
          },
          {
            q: 'Joris hỏi lương thực tập. Trâm xử lý thế nào?',
            options: ['Nói con số cụ thể', 'Né bằng một câu đùa nhẹ, không nói số, không làm Joris mất mặt', 'Giận và bỏ đi', 'Hỏi lại lương của Joris'],
            correct: 1,
            why: '"It covers my rent and my **milk tea habit**. Just about." Câu đùa tự giễu trả lời "ý" mà không trả lời "số". Joris tự hiểu: "Sorry, that was a bit personal."',
          },
          {
            q: '"I\'ll think about it. That\'s a Dutch yes, by the way." Joris muốn nói gì?',
            options: ['Anh ấy sẽ không bao giờ làm', 'Đùa: với anh ấy câu đó nghĩa là "có", ngược với lối nói vòng (ở nhiều nơi "I\'ll think about it" lại là "không")', 'Anh ấy chưa hiểu câu hỏi', 'Anh ấy giận Trâm'],
            correct: 1,
            why: 'Ở nhiều văn hoá nói vòng, "I\'ll think about it" là từ chối nhẹ. Joris đùa ngược lại: anh ấy nói thẳng nên câu đó là "có thật". Cả cảnh khép lại bằng một câu đùa về chính chủ đề nói thẳng – nói vòng.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Các câu hôm nay có nhiều **từ làm mềm** đọc rất nhẹ (might, could, a touch, just) và **cụm cố định** (pulling your leg, came out wrong). Nghe kỹ những từ nhỏ. Viết hoa, dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd24-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — góp ý vòng kiểu Anh', spell: 'Just a thought, but it might be worth trimming slide three a touch.', answer: 'Just a thought, but it might be worth trimming slide three a touch.', alt: ['Just a thought, but it might be worth trimming slide 3 a touch.'] },
          { label: 'Câu 2 — nói về câu đùa kiểu Anh', spell: 'A proper British joke comes with a straight face.', answer: 'A proper British joke comes with a straight face.' },
          { label: 'Câu 3 — báo là đang đùa', spell: "Relax, I'm pulling your leg.", answer: "Relax, I'm pulling your leg.", alt: ['Relax, I am pulling your leg.'] },
          { label: 'Câu 4 — gỡ ngượng', spell: 'Sorry, that came out completely wrong.', answer: 'Sorry, that came out completely wrong.' },
          { label: 'Câu 5 — nhận lỗi', spell: "I shouldn't have assumed.", answer: "I shouldn't have assumed.", alt: ['I should not have assumed.'] },
          { label: 'Câu 6 — né câu hỏi bằng câu đùa', spell: 'It covers my rent and my milk tea habit.', answer: 'It covers my rent and my milk tea habit.' },
          { label: 'Câu 7 — nhờ khéo', spell: 'Next time, could you maybe start with the good news?', answer: 'Next time, could you maybe start with the good news?' },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Just a thought, but… (Anh)', 'Làm ơn sửa / đổi đi. Câu mềm nhưng ý rõ.', "Good point. I'll change it."],
          ['It might be worth + V-ing (Anh)', 'Bạn **nên** làm việc đó.', "Thanks, I'll do that."],
          ['…a touch / a tad / slightly (Anh)', 'Có khi là "khá nhiều". Từ "nhỏ" để giảm nhẹ.', '(hiểu là cần sửa thật)'],
          ['Slide three is too long. (Hà Lan, Đức…)', 'Đúng nghĩa đen. Chê **bài**, không chê **người**.', 'Thanks. What would you cut?'],
          ['Oh, marvellous. / Brilliant. (giọng phẳng)', 'Mỉa: thật ra là **tệ**.', '(cười nhẹ) Ugh, I know.'],
          ["I'm pulling your leg. · I'm having you on. (Anh, Úc)", 'Tôi đùa thôi.', 'Ha, you got me!'],
          ['Stop winding her up. (Anh, Úc)', 'Đừng trêu cô ấy nữa.', '—'],
          ['Good one!', 'Câu đùa của bạn hay đấy.', 'Thanks, I learned from the best.'],
          ['That would be a little difficult. (Nhật)', 'Thường là **không được**, nói vòng cho đỡ mất lòng.', "I understand. Is there another option?"],
          ["I'll think about it.", 'Tuỳ người: có khi là "không" lịch sự, có khi là "để tôi nghĩ thật". Không chắc thì hỏi lại nhẹ.', 'Sure. Shall I check with you on Monday?'],
        ],
        caption: 'Hai câu cùng ý "slide ba dài quá" có thể nghe **rất khác** tuỳ người nói. Đừng chấm điểm câu nói theo "độ dễ nghe"; chấm theo **nội dung**.',
      },
      {
        t: 'note',
        title: 'Người Nhật nói vòng thế nào (không có giọng Nhật trong bài, mô tả bằng chữ)',
        items: [
          'Đồng nghiệp hoặc khách **Nhật** nói tiếng Anh thường rất lịch sự và **ít khi nói "no" thẳng**. Những câu như "That would be a little difficult", "We will consider it", "Hmm…" kèm một khoảng **im lặng** thường là từ chối.',
          'Cách nghe tiếng Anh của người Nhật: âm /l/ và /r/ hay lẫn, hay thêm nguyên âm sau phụ âm cuối ("desk" nghe như "desuku"), nhịp đều từng âm tiết. Nghe **từ khoá** và **khoảng lặng**, đừng nghe từng âm.',
          'Đừng ép họ trả lời "yes or no" trước mặt nhiều người. Hỏi riêng, hoặc đưa hai phương án: "Would option A or option B be easier for you?"',
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: không biết người ta đùa hay nói thật thì làm gì',
        items: [
          'Câu đùa kiểu Anh, Úc thường **không đổi giọng**. Dấu hiệu: điều họ nói **quá mức** so với thực tế (Joris "tore it to pieces" chỉ với hai góp ý), hoặc **ngược** với điều bạn biết về họ (Tamsin "thích" họp sớm).',
          'Không chắc thì hỏi lại, kèm nụ cười: "**Wait, are you joking?**" · "**Was that sarcasm?**" · "**Sorry, I can\'t tell if you\'re serious.**" Không ai thấy phiền, nhiều người còn thích vì bạn hỏi thẳng.',
          'Hiểu chậm vài giây cũng không sao: "**Oh! I just got it.**" và cười. Người ta chỉ ngượng khi bạn **im lặng nghiêm mặt**.',
          'An toàn nhất khi chưa chắc: một tiếng "**Ha!**" nhẹ, rồi nói tiếp chuyện chính. Đừng cười quá to với câu bạn chưa hiểu, lỡ đó là chuyện nghiêm túc.',
        ],
      },
      {
        t: 'table',
        head: ['Kiểu', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Góp ý chê', 'Rất vòng, nhiều từ giảm nhẹ: might be worth, a touch, just a thought.', 'Hay mở bằng khen, rồi mới chê, rồi khen: "Great job! One thing I\'d change…"', 'Khá thẳng, kèm đùa cho nhẹ: "Mate, slide three\'s a novel."'],
          ['Đùa', 'Mỉa mai mặt lạnh, nói giảm (understatement), tự giễu.', 'Đùa rõ ràng hơn, thường có tín hiệu (cười, "just kidding").', 'Trêu chọc thân (banter), đặt biệt danh, trêu càng nhiều càng thân.'],
          ['Báo là đang đùa', "I'm having you on.", "Just kidding! · I'm messing with you.", "I'm pulling your leg. · Yeah, nah, just joking."],
          ['Khen', 'Kiệm lời; "rather good" đã là khen tốt.', 'Khen nhiều, nhiệt tình: "Awesome!", "Amazing!"', 'Khen ngắn, hơi ngại khen to: "Good on ya."'],
          ['Lỡ lời rồi gỡ', "Oh gosh, sorry, that came out wrong.", "Oops, my bad! That didn't come out right.", "Ah, sorry mate, that was a bit off."],
        ],
        caption: 'Bảng nói về **xu hướng chung**, không phải luật. Một người Anh vẫn có thể rất thẳng, một người Mỹ vẫn có thể rất kiệm lời.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-c1-01 · What They Say vs. What They Mean** — nói giảm kiểu Anh, từ chối mà không nói "không", nhận lời khen (bài hôm nay không lặp phần đó; nghe tập này để có đủ bức tranh).',
          '**en-b1-02 · The Missing Part** — một bạn trong nhóm chưa nộp phần việc: nên nói thẳng với thầy hay hỏi chuyện riêng trước. Nghe để thấy "nói thẳng" và "nói khéo" trong một nhóm sinh viên.',
          '**en-ds-a2-04 · I\'d Love To, But…** — mời và từ chối không làm mất lòng (mức dễ, nghe thả lỏng).',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd24-noi',
    kind: 'speaking',
    title: 'Khi lỡ lời: chữa ngượng, đổi chủ đề',
    goal: 'Gỡ ngượng trong 10 giây khi lỡ lời, né khéo một câu hỏi nhạy cảm, đổi chủ đề tự nhiên, và dùng might / could / would để góp ý hay nhờ việc mà không ai thấy nặng nề.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu**: gỡ ngượng, nhận lỗi, đáp lại khi người khác lỡ lời, né câu hỏi, đổi chủ đề, góp ý mềm, nhận ra câu đùa.',
          '**Quy trình 4 bước chữa ngượng** trong 10 giây: thấy tín hiệu → nhận ngay → một câu sửa → mở cửa mới.',
          'Ngữ pháp: **might, could, would** làm mềm câu. Câu thẳng "Change it." thành "Could you maybe change it?" chỉ bằng hai từ.',
          'Ngôn ngữ cơ thể khi ngượng: cười che miệng, chắp tay xin lỗi, nháy mắt khi đùa. Người Việt, Anh – Mỹ – Úc và Nhật hiểu mỗi cử chỉ khác nhau.',
          'Cuối bài nhập vai: bạn lỡ một câu về quê của người đối diện, rồi gỡ.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Chia năm nhóm: **gỡ khi mình lỡ lời → đáp khi người khác lỡ lời → né và đổi chủ đề → góp ý, nhờ việc mềm → nhận ra và đáp câu đùa**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'That came out wrong.', pos: 'phr', ipa: '/ðæt ˌkeɪm aʊt ˈrɔːŋ/', vi: 'Câu đó mình nói ra sai rồi. (ý không như vậy)', ex: 'Sorry, that came out completely wrong.', exVi: 'Xin lỗi, câu đó mình nói ra sai hoàn toàn.', more: 'Mỹ hay nói: **That didn\'t come out right.**' },
          { w: 'Let me rephrase that.', pos: 'phr', ipa: '/ˌlet mi riːˈfreɪz ðæt/', vi: 'Để mình nói lại cho đúng.', ex: 'Hmm, let me rephrase that. I meant the slides were very detailed.', exVi: 'Hừm, để mình nói lại. Ý mình là slide rất chi tiết.' },
          { w: "I was trying to be funny, and it didn't work.", pos: 'phr', ipa: '/aɪ wəz ˈtraɪɪŋ tə bi ˈfʌni ən ɪt ˈdɪdnt ˈwɝːk/', vi: 'Mình cố đùa mà hỏng mất.', ex: "Sorry, I was trying to be funny, and it didn't work.", exVi: 'Xin lỗi, mình cố đùa mà hỏng mất.' },
          { w: "I shouldn't have assumed.", pos: 'phr', ipa: '/aɪ ˈʃʊdnt əv əˈsuːmd/', vi: 'Lẽ ra mình không nên mặc định như vậy.', ex: "I shouldn't have assumed you drink.", exVi: 'Lẽ ra mình không nên mặc định là bạn uống rượu bia.', more: 'should have + V3 của Ngày 21, dùng để nhận lỗi về mình.' },
          { w: "I didn't mean to make things awkward.", pos: 'phr', ipa: '/aɪ ˈdɪdnt ˈmiːn tə ˌmeɪk θɪŋz ˈɔːkwərd/', vi: 'Mình không cố ý làm không khí ngượng.', ex: "Sorry, I didn't mean to make things awkward.", exVi: 'Xin lỗi, mình không cố ý làm mọi người ngượng.' },
          { w: "I think I've put my foot in it.", pos: 'phr', ipa: '/aɪ ˈθɪŋk aɪv ˌpʊt maɪ ˈfʊt ɪn ɪt/', vi: 'Hình như mình lỡ lời rồi. (thành ngữ)', ex: "Oh dear, I think I've put my foot in it.", exVi: 'Chết, hình như mình lỡ miệng rồi.', more: 'Mỹ hay nói: **put my foot in my mouth**.' },
          { w: 'I take that back.', pos: 'phr', ipa: '/aɪ ˈteɪk ðæt ˈbæk/', vi: 'Mình rút lại câu đó.', ex: "That's a silly thing to say. I take that back.", exVi: 'Nói vậy thật ngớ ngẩn. Mình rút lại.' },
          { w: 'Forget I asked.', pos: 'phr', ipa: '/fərˈɡet aɪ ˈæskt/', vi: 'Coi như mình chưa hỏi.', ex: "Oh, sorry, that's personal. Forget I asked.", exVi: 'Ôi, xin lỗi, chuyện riêng mà. Coi như mình chưa hỏi.' },
          { w: 'No harm done.', pos: 'phr', ipa: '/ˌnoʊ ˈhɑːrm ˈdʌn/', vi: 'Không sao cả. (đáp khi người khác xin lỗi)', ex: "Sorry about that! — No harm done.", exVi: 'Xin lỗi nhé! — Không sao cả.' },
          { w: "I get that a lot.", pos: 'phr', ipa: '/aɪ ˈɡet ðæt ə ˈlɑːt/', vi: 'Mình nghe câu đó suốt. (đáp nhẹ, cho người kia đỡ ngượng)', ex: "Don't worry, I get that a lot.", exVi: 'Đừng lo, mình nghe câu đó suốt mà.' },
          { w: "It's not personal.", pos: 'phr', ipa: '/ɪts ˈnɑːt ˈpɝːsənl/', vi: 'Không phải nhắm vào bạn đâu.', ex: "It's about the slide, not about you. It's not personal.", exVi: 'Mình nói về slide, không phải về bạn. Không nhắm vào bạn đâu.' },
          { w: 'On a lighter note, …', pos: 'phr', ipa: '/ɑːn ə ˈlaɪtər ˈnoʊt/', vi: 'Chuyện vui hơn nhé, … (đổi chủ đề sau chuyện nặng nề)', ex: 'On a lighter note, what did everyone think of the talk?', exVi: 'Chuyện vui hơn nhé, mọi người thấy bài nói thế nào?' },
          { w: 'Changing the subject, …', pos: 'phr', ipa: '/ˈtʃeɪndʒɪŋ ðə ˈsʌbdʒekt/', vi: 'Đổi chủ đề chút nhé, …', ex: 'Changing the subject, have you tried the coconut coffee here?', exVi: 'Đổi chủ đề chút, bạn uống thử cà phê cốt dừa ở đây chưa?' },
          { w: 'That might be a conversation for another time.', pos: 'phr', ipa: '/ðæt maɪt bi ə ˌkɑːnvərˈseɪʃn fər əˈnʌðər ˈtaɪm/', vi: 'Chuyện đó chắc để dịp khác nói.', ex: "Ha, that might be a conversation for another time. How's your week been?", exVi: 'Ha, chuyện đó để dịp khác nhé. Tuần này của bạn thế nào?', more: 'Né một chủ đề nặng (chính trị, tôn giáo, tiền) mà không nói "no".' },
          { w: "I'll keep that one to myself.", pos: 'phr', ipa: '/aɪl ˈkiːp ðæt wʌn tə maɪˈself/', vi: 'Chuyện đó mình xin giữ riêng.', ex: "My salary? Ha, I'll keep that one to myself.", exVi: 'Lương của mình á? Ha, cái đó mình xin giữ riêng.' },
          { w: 'Just a thought, but…', pos: 'phr', ipa: '/ˈdʒʌst ə ˈθɔːt bət/', vi: 'Chỉ là một ý thôi, nhưng… (góp ý rất mềm)', ex: 'Just a thought, but we could start ten minutes earlier.', exVi: 'Chỉ là một ý thôi, nhưng mình có thể bắt đầu sớm hơn mười phút.' },
          { w: 'It might be worth + V-ing', pos: 'phr', ipa: '/ɪt maɪt bi ˈwɝːθ/', vi: 'Có lẽ nên…', ex: 'It might be worth checking the menu first.', exVi: 'Có lẽ nên xem thực đơn trước.' },
          { w: 'Could you maybe…?', pos: 'phr', ipa: '/kʊdʒu ˈmeɪbi/', vi: 'Bạn có thể… được không? (nhờ rất nhẹ)', ex: 'Could you maybe start with the good news next time?', exVi: 'Lần sau anh có thể mở đầu bằng tin vui được không?' },
          { w: "That could be a bit tricky.", pos: 'phr', ipa: '/ðæt kʊd bi ə ˈbɪt ˈtrɪki/', vi: 'Cái đó có thể hơi khó. (= chắc không được)', ex: 'Friday at seven? That could be a bit tricky for me.', exVi: 'Bảy giờ thứ Sáu à? Giờ đó với mình có thể hơi khó.' },
          { w: "I'd suggest + V-ing", pos: 'phr', ipa: '/aɪd səɡˈdʒest/', vi: 'Mình gợi ý là…', ex: "I'd suggest cutting the last part.", exVi: 'Mình gợi ý cắt phần cuối.' },
          { w: 'Would it be okay if I + V-ed?', pos: 'phr', ipa: '/wʊd ɪt bi oʊˈkeɪ ɪf aɪ/', vi: 'Mình… có được không? (xin phép mềm)', ex: 'Would it be okay if I sent you a new version tonight?', exVi: 'Tối nay mình gửi bạn bản mới có được không?', more: 'Sau **would it be okay if** dùng **quá khứ** (sent, left, asked) dù nói về bây giờ: nghe lịch sự hơn.' },
          { w: 'Can I be honest with you?', pos: 'phr', ipa: '/kən aɪ bi ˈɑːnɪst wɪð ju/', vi: 'Mình nói thật nhé? (báo trước sắp góp ý thẳng)', ex: "Can I be honest with you? The photo's a bit blurry.", exVi: 'Mình nói thật nhé? Ảnh hơi mờ.' },
          { w: "I'm pulling your leg.", pos: 'phr', ipa: '/aɪm ˈpʊlɪŋ jər ˈleɡ/', vi: 'Mình đùa thôi.', ex: "Relax, I'm pulling your leg.", exVi: 'Bình tĩnh, mình đùa thôi.', more: 'Mỹ hay nói: **Just kidding! · I\'m messing with you.**' },
          { w: 'Are you having me on?', pos: 'phr', ipa: '/ɑːr ju ˈhævɪŋ mi ˈɑːn/', vi: 'Bạn đang đùa mình à? (Anh, Úc)', ex: 'Joris said that? Are you having me on?', exVi: 'Joris nói thế á? Anh đang đùa em à?' },
          { w: 'Was that sarcasm?', pos: 'phr', ipa: '/wəz ðæt ˈsɑːrkæzəm/', vi: 'Câu đó là mỉa đúng không?', ex: "Sorry, was that sarcasm? I can't tell.", exVi: 'Xin lỗi, câu đó là mỉa à? Mình không nhận ra.' },
          { w: 'with a straight face', pos: 'phr', ipa: '/wɪð ə ˌstreɪt ˈfeɪs/', vi: 'với vẻ mặt tỉnh bơ (khi đùa)', ex: 'She said it with a completely straight face.', exVi: 'Chị ấy nói câu đó với vẻ mặt tỉnh bơ hoàn toàn.', anh: 'expressionless-face' },
          { w: 'wind someone up', pos: 'v', ipa: '/ˌwaɪnd ˈsʌmwʌn ˈʌp/', vi: 'trêu ai cho họ tức / tin thật (Anh, Úc)', ex: "Stop winding her up, Wade.", exVi: 'Đừng trêu con bé nữa, Wade.' },
          { w: 'Good one!', pos: 'phr', ipa: '/ˈɡʊd ˈwʌn/', vi: 'Câu (đùa) hay đấy!', ex: 'Ha! Good one. You got me.', exVi: 'Ha! Câu hay đấy. Bạn lừa được mình rồi.' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Gỡ khi lỡ lời', "Oops, that came out wrong!", "Sorry, that came out wrong. I meant…", "I apologise, that wasn't what I intended to say."],
          ['Nhận lỗi', 'My bad.', "I shouldn't have said that.", "I'm sorry, that was inappropriate of me."],
          ['Đáp khi người khác lỡ lời', 'All good!', "Don't worry about it.", "That's quite all right."],
          ['Né câu hỏi riêng', "Ha, nice try!", "I'll keep that one to myself.", "If you don't mind, I'd rather keep that private."],
          ['Đổi chủ đề', 'Anyway! Food?', 'On a lighter note, …', 'If I may change the subject for a moment, …'],
          ['Góp ý', "Mate, slide three's a bit long.", 'It might be worth shortening slide three.', 'I wonder if slide three could be shortened slightly.'],
          ['Báo là đang đùa', 'Kidding!', "I'm only joking.", "I'm sorry, I was only joking."],
        ],
        caption: 'Với khách và sếp lớn: **tránh đùa** về người, nước, tôn giáo hẳn đi. Mức trang trọng không cần đùa để thân.',
      },

      { t: 'h', text: '3. Quy trình 10 giây khi lỡ lời' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Lỡ lời rồi thì gỡ thế nào',
        caption: 'Sai lầm hay gặp nhất của người Việt: **xin lỗi quá dài** hoặc **giải thích văn hoá** cả phút. Càng nói dài, không khí càng ngượng.',
        steps: [
          { label: '1. Thấy tín hiệu', sub: 'Im lặng · cười gượng · "Ha… well…" · "Actually…"' },
          { label: '2. Nhận ngay', sub: 'Sorry, that came out wrong.' },
          { label: '3. Một câu sửa', sub: "I shouldn't have assumed. / I meant…" },
          { label: '4. Mở cửa mới', sub: 'On a lighter note… / Could you recommend…?' },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Gỡ đúng và gỡ hỏng',
        caption: 'Bên phải không thiếu thành ý, nhưng nó bắt người kia phải an ủi lại bạn, nên càng ngượng.',
        cols: [
          {
            title: 'Gỡ đúng (Trâm)',
            anh: 'slightly-smiling-face',
            items: ['Sorry, that came out completely wrong.', "I shouldn't have assumed.", '(nghe Wade đáp)', 'You might like sugarcane juice with kumquat.'],
          },
          {
            title: 'Gỡ hỏng',
            anh: 'anxious-face-with-sweat',
            items: ["Sorry sorry sorry, I'm so stupid!", 'In Vietnam we always joke like this, because…', '(giải thích thêm 1 phút)', "Are you angry? Please don't be angry!"],
          },
        ],
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Thêm **might, could** hoặc **would** vào câu là câu tự mềm đi một nấc, vì nó biến "sự thật / mệnh lệnh" thành "khả năng / đề nghị". Thêm một từ nhỏ (**a bit, maybe, just, slightly**) là mềm thêm nấc nữa.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'It might be worth + V-ing · You might want to + V',
            vi: 'Khuyên mà không ra lệnh.',
            examples: [
              { en: 'It might be worth trimming slide three.', vi: 'Có lẽ nên cắt bớt slide ba.' },
              { en: 'You might want to check the menu first.', vi: 'Có khi bạn nên xem thực đơn trước.' },
              { en: 'It might be worth asking Wade before you order.', vi: 'Có lẽ nên hỏi Wade trước khi gọi món.' },
            ],
          },
          {
            formula: 'Could you (maybe / possibly) + V?',
            vi: 'Nhờ việc. Thêm maybe / possibly là rất nhẹ.',
            examples: [
              { en: 'Could you maybe start with the good news?', vi: 'Anh có thể mở đầu bằng tin vui không?' },
              { en: 'Could you possibly send me the photo again?', vi: 'Chị gửi lại giúp em tấm ảnh được không?' },
              { en: 'Could you recommend something without alcohol?', vi: 'Bạn gợi ý món gì không cồn được không?' },
            ],
          },
          {
            formula: 'That could be + a bit / a little + adj',
            vi: 'Nói "không ổn" hoặc "không được" một cách mềm.',
            examples: [
              { en: 'That could be a bit tricky.', vi: 'Cái đó có thể hơi khó.' },
              { en: 'It could come across as rude.', vi: 'Câu đó có thể bị hiểu là bất lịch sự.' },
              { en: 'Five beers could be a little too many.', vi: 'Năm chai bia có thể hơi nhiều.' },
            ],
          },
          {
            formula: "I'd (= I would) + say / suggest / avoid… · I wouldn't + V",
            vi: 'Nêu ý kiến, lời khuyên như "nếu là mình thì…".',
            examples: [
              { en: "I'd say the photo is a bit blurry.", vi: 'Mình thấy ảnh hơi mờ.' },
              { en: "I'd suggest cutting the last part.", vi: 'Mình gợi ý cắt phần cuối.' },
              { en: "I wouldn't ask about salaries at dinner.", vi: 'Nếu là mình thì mình không hỏi chuyện lương trong bữa tối.' },
            ],
          },
          {
            formula: 'Would it be okay if I + V-ed? · Would you mind if I + V-ed?',
            vi: 'Xin phép. Động từ sau if để ở quá khứ dù nói về bây giờ.',
            examples: [
              { en: 'Would it be okay if I left a bit early?', vi: 'Em về sớm một chút có được không ạ?' },
              { en: 'Would you mind if I asked where you are from?', vi: 'Mình hỏi bạn quê ở đâu có phiền không?' },
              { en: 'Would it be okay if we skipped that topic?', vi: 'Mình bỏ qua chủ đề đó được không?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu thẳng', 'Câu mềm', 'Đã thêm'],
        rows: [
          ['This slide is too long.', 'This slide **might be a bit** long.', 'might + a bit'],
          ['Change the photo.', '**Could you maybe** change the photo?', 'could + maybe, thành câu hỏi'],
          ["You're wrong.", "**I might be wrong**, but **I'd** see it a bit differently.", 'might + would'],
          ["That won't work.", '**That could be a bit tricky.**', 'could + a bit'],
          ["Don't ask about salary.", "**I wouldn't** ask about salary.", 'would'],
          ['I want to leave early.', '**Would it be okay if I left** a bit early?', 'would + quá khứ'],
        ],
        caption: 'Đừng thêm **quá nhiều**: "I just might possibly maybe suggest…" nghe như bạn sợ hãi. Một modal + một từ nhỏ là đủ.',
      },
      {
        t: 'rule',
        formula: 'might / could + V (khả năng) · Could you maybe…? (nhờ) · I\'d + say / suggest (ý kiến) · Would it be okay if I + V-ed? (xin phép)',
        vi: 'Muốn câu mềm đi: đổi câu khẳng định hoặc mệnh lệnh thành khả năng (might, could) hay "nếu là tôi" (would), rồi thêm một từ nhỏ như a bit, maybe, just.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: that said · to be honest · on a lighter note',
        items: [
          '**That said, …** = "nói vậy chứ…": khen rồi góp ý, hoặc góp ý rồi khen. "The structure is great. **That said**, slide three might be a bit long."',
          '**To be honest, …** = nói thật thì: báo trước một ý thẳng hơn bình thường. Dùng ít thôi; câu nào cũng "to be honest" nghe như những câu khác không thật.',
          '**On a lighter note, …** = chuyển sang chuyện vui hơn sau một chuyện nặng nề hay ngượng. Là "lối thoát" đẹp nhất khi vừa lỡ lời.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd24-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh, nói cho mềm (5 câu)',
        kind: 'translate',
        grammar: 'It might be worth + V-ing · Could you maybe…? · That could be a bit… · I\'d suggest + V-ing · Would it be okay if I + V-ed?',
        items: [
          { q: 'Có lẽ nên hỏi chị ấy trước.', hint: 'might be worth, asking', answers: ['It might be worth asking her first.', 'It might be worth asking her beforehand.', 'It could be worth asking her first.', 'You might want to ask her first.'] },
          { q: 'Anh gửi lại giúp em tấm ảnh được không?', hint: 'could you maybe / possibly, send', answers: ['Could you maybe send me the photo again?', 'Could you possibly send me the photo again?', 'Could you send me the photo again?', 'Could you maybe send the photo again?', 'Could you possibly send the photo again?', 'Could you maybe resend the photo?'] },
          { q: 'Tám giờ tối thứ Sáu thì có thể hơi khó với mình.', hint: 'could be a bit tricky', answers: ['Eight on Friday evening could be a bit tricky for me.', '8 pm on Friday could be a bit tricky for me.', 'Friday at eight could be a bit tricky for me.', 'Eight on Friday could be a bit tricky for me.', 'Eight pm on Friday could be a bit tricky for me.', 'Friday at 8 could be a bit tricky for me.', '8 on Friday evening could be a bit tricky for me.'] },
          { q: 'Mình gợi ý cắt phần cuối.', hint: "I'd suggest, cutting", answers: ["I'd suggest cutting the last part.", 'I would suggest cutting the last part.', "I'd suggest cutting the final part.", "I'd suggest cutting the end."] },
          { q: 'Em về sớm một chút có được không ạ?', hint: 'would it be okay if, left', answers: ['Would it be okay if I left a bit early?', 'Would it be okay if I left a little early?', 'Would it be OK if I left a bit early?', 'Would it be alright if I left a bit early?', 'Would it be all right if I left a bit early?', 'Would it be okay if I left early?'] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 7 lỗi thật',
        items: [
          '~~You must change slide three.~~ → **You might want to** change slide three. "must" là **bắt buộc**, rất nặng. Dịch "phải" hay "nên" của tiếng Việt thành "must" làm câu góp ý nghe như ra lệnh.',
          '~~I was joking only.~~ → I was **only** joking. / I was **just** kidding. "only / just" đứng **trước** động từ.',
          '~~Please don\'t angry.~~ → **I hope I didn\'t upset you.** / Please don\'t be offended. "angry" là tính từ, cần **be**; và hỏi thẳng "đừng giận" khiến người kia phải nói "tôi không giận", càng ngượng.',
          '~~Sorry, sorry, I\'m so stupid, in Vietnam we always…~~ → **Sorry, that came out wrong.** + một câu sửa. Xin lỗi dài và tự chê mình bắt người kia phải dỗ lại bạn.',
          '~~It\'s just a joke, why so serious?~~ → **Sorry, bad joke.** Câu đùa hỏng là lỗi của câu đùa, đừng đổ cho người nghe "không biết đùa".',
          '~~You\'re Australian, so you must love beer.~~ → hỏi thay vì đoán: **What would you like to drink?** Đùa dựa trên quốc tịch, giới tính, tuổi, ngoại hình rất dễ trật.',
          '~~I think you are wrong.~~ (với khách, sếp) → **I might be wrong, but** I see it a bit differently. Câu đầu đúng ngữ pháp nhưng nghe như kết luận. Ngày 18 dạy ba mức không đồng ý; hôm nay thêm might để mềm thêm.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi ngượng, khi đùa' },
      {
        t: 'p',
        text: 'Lúc lỡ lời, cơ thể bạn phản ứng **trước** cả câu xin lỗi. Một số phản ứng rất tự nhiên với người Việt lại bị người nước ngoài hiểu khác. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi ngượng, khi xin lỗi, khi đùa',
        items: [
          { anh: 'face-with-hand-over-mouth', w: 'Oops. Sorry, that came out wrong.', ro: '/ʊps ˈsɑːri ðæt ˌkeɪm aʊt ˈrɔːŋ/', vi: 'Người Việt hay **che miệng cười** khi ngượng. Người Anh – Mỹ – Úc có thể tưởng bạn đang **cười chuyện đó**. Bỏ tay xuống, nói câu xin lỗi, mặt nghiêm lại một nhịp.' },
          { anh: 'grimacing-face', w: "I think I've put my foot in it.", ro: '/aɪ ˈθɪŋk aɪv ˌpʊt maɪ ˈfʊt ɪn ɪt/', vi: 'Nhăn mặt nhẹ = "chết, mình lỡ rồi". Người nghe thấy bạn nhận ra thì họ dễ bỏ qua.' },
          { anh: 'folded-hands', w: 'Sorry!', ro: '/ˈsɑːri/', vi: 'Chắp tay xin lỗi: quen ở Việt Nam, Thái, Nhật. Người phương Tây hiểu, nhưng thấy hơi **nặng nề** cho chuyện nhỏ. Một câu xin lỗi bằng lời là đủ. Trong tin nhắn, 🙏 có người đọc là "cảm ơn", có người đọc là "cầu xin".' },
          { anh: 'person-bowing', w: 'I apologise.', ro: '/aɪ əˈpɑːlədʒaɪz/', vi: 'Với đồng nghiệp, khách **Nhật**: cúi đầu nhẹ khi xin lỗi là tự nhiên và được đánh giá cao.' },
          { anh: 'expressionless-face', w: 'Oh, marvellous.', ro: '/oʊ ˈmɑːrvələs/', vi: 'Mặt **tỉnh bơ** + từ khen = mỉa mai kiểu Anh. Đừng vội cảm ơn; nhìn ngữ cảnh.' },
          { anh: 'winking-face', w: 'Just kidding!', ro: '/ˈdʒʌst ˈkɪdɪŋ/', vi: 'Nháy mắt = "đùa thôi". Người Mỹ, Úc hay dùng. Với khách lớn tuổi hoặc người châu Á, nháy mắt có thể bị coi là **suồng sã**.' },
          { anh: 'slightly-smiling-face', w: 'No harm done.', ro: '/ˌnoʊ ˈhɑːrm ˈdʌn/', vi: 'Khi người khác lỡ lời với bạn: mỉm cười, nói một câu ngắn, rồi tự bạn **đổi chủ đề** giúp họ. Đó là phép lịch sự đẹp nhất.' },
          { anh: 'raised-hand', w: 'Sorry, can I just say something?', ro: '/ˈsɑːri kən aɪ ˈdʒʌst ˈseɪ ˈsʌmθɪŋ/', vi: 'Giơ nhẹ bàn tay mở để xin nói, nhất là khi muốn đính chính một câu bị hiểu nhầm. Không giơ ngón trỏ.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Hà Lan · Đức', 'Nhật'],
        rows: [
          ['Góp ý chê', 'Vòng, giữ thể diện, thường riêng tư.', 'Anh vòng nhất; Mỹ kẹp giữa hai lời khen; Úc thẳng kèm đùa.', 'Thẳng, ngắn, có thể trước mặt người khác. Không phải giận.', 'Rất vòng, ít khi chê trực tiếp.'],
          ['Đùa ở chỗ làm', 'Trêu ngoại hình, tuổi khá thường.', 'Đùa nhiều; tránh đùa ngoại hình, chủng tộc, tôn giáo.', 'Đùa khô, ít; công việc là công việc.', 'Ít đùa với người chưa thân.'],
          ['Im lặng', 'Ngượng thì cười cho qua.', 'Im lặng lâu = có vấn đề. Người ta sẽ nói gì đó để lấp.', 'Im lặng bình thường.', 'Im lặng = đang nghĩ, tôn trọng. Đừng vội lấp.'],
          ['Xin lỗi', 'Xin lỗi nhiều lần, kèm giải thích.', 'Một lần, ngắn, rồi sửa.', 'Ngắn, thực tế.', 'Xin lỗi kỹ, cúi chào.'],
        ],
        caption: 'Xu hướng chung, mỗi người mỗi khác. Khi làm việc với người mới: **quan sát họ góp ý, đùa với nhau thế nào trong tuần đầu**, rồi chỉnh theo.',
      },

      { t: 'h', text: '7. Phát âm: dạng yếu của could, would, should have' },
      {
        t: 'p',
        text: 'Câu mềm chỉ mềm thật khi **từ làm mềm đọc nhẹ**: could you → /kʊdʒu/, would it → /wʊdɪt/, shouldn\'t have → /ʃʊdntəv/. Đọc tách từng từ rõ ràng "cút – du" lại làm câu nghe cứng. Ngữ điệu: câu nhờ, câu góp ý thường **xuống rồi lên** (fall-rise) ở từ cuối, như để ngỏ cho người kia trả lời.',
      },
      {
        t: 'phatam',
        id: 'gtd24-phat-am',
        title: 'Luyện phát âm — could / would / should have đọc nhẹ và ngữ điệu câu mềm',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nói liền, từ làm mềm đọc nhanh và nhẹ; nhấn vào từ mang ý chính.',
        items: [
          { text: 'Could you maybe start with the good news?', ipa: 'kʊdʒu meɪbi stɑːrt wɪð ðə ɡʊd nuːz', vi: 'could you nối thành /kʊdʒu/ · nhấn GOOD NEWS · lên giọng cuối câu' },
          { text: 'It might be worth trimming it a bit.', ipa: 'ɪt maɪt bi wɝːθ trɪmɪŋ ɪt ə bɪt', vi: 'worth có /θ/ cuối, lưỡi giữa răng · trimming‿it‿a nối liền' },
          { text: 'Would it be okay if I left early?', ipa: 'wʊd ɪt bi oʊkeɪ ɪf aɪ left ɝːli', vi: 'would‿it nối /wʊdɪt/ · left có /ft/ cuối' },
          { text: 'That could be a bit tricky.', ipa: 'ðæt kʊd bi ə bɪt trɪki', vi: 'could đọc nhẹ /kəd/ · xuống rồi lên ở TRI-cky' },
          { text: 'Sorry, that came out wrong.', ipa: 'sɑːri ðæt keɪm aʊt rɔːŋ', vi: 'came‿out nối · wrong không đọc chữ w, chỉ /r/' },
          { text: "I shouldn't have assumed.", ipa: 'aɪ ʃʊdnt əv əsuːmd', vi: "shouldn't have → /ʃʊdntəv/ · assumed nhấn âm sau, /d/ cuối" },
          { text: "I'm only pulling your leg.", ipa: 'aɪm oʊnli pʊlɪŋ jər leɡ', vi: 'your đọc yếu /jər/ · leg có /ɡ/ cuối, đừng thành "lét"' },
          { text: 'On a lighter note, how was your weekend?', ipa: 'ɑːn ə laɪtər noʊt haʊ wəz jər wiːkend', vi: 'on‿a nối · ngắt nhẹ sau "note" · was đọc yếu /wəz/' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: lỡ lời về quê của người đối diện' },
      {
        t: 'dialogue',
        title: 'Ở sự kiện giao lưu cuối tháng — Trâm nói chuyện với Esme, một đồng nghiệp mới chuyển sang từ văn phòng Ireland',
        lines: [
          { who: 'Esme', role: 'b', text: "Hi, I don't think we've met. I'm Esme. I've just moved over from our Cork office.", vi: 'Chào, hình như mình chưa gặp nhau. Mình là Esme. Mình vừa chuyển từ văn phòng Cork sang.' },
          { who: 'Trâm', role: 'a', text: "Nice to meet you, Esme. I'm Trâm. Cork, so you're basically British, right?", vi: 'Rất vui được gặp chị, Esme. Em là Trâm. Cork, vậy tức là chị người Anh nhỉ?' },
          { who: 'Esme', role: 'b', text: "Ha… well, not quite. Cork's in Ireland. The Republic of Ireland's a separate country.", vi: 'Ha… à, không hẳn. Cork ở Ireland. Cộng hoà Ireland là một nước riêng.' },
          { who: 'Trâm', role: 'a', text: "Oh no, sorry, that came out wrong. I knew that, I just didn't think before I spoke.", vi: 'Ôi, em xin lỗi, em nói sai rồi. Em biết mà, chỉ là em chưa nghĩ đã nói.' },
          { who: 'Esme', role: 'b', text: "Don't worry, I get that a lot. Northern Ireland is part of the UK, which confuses people.", vi: 'Đừng lo, mình nghe suốt. Bắc Ireland thuộc Vương quốc Anh, nên nhiều người nhầm.' },
          { who: 'Trâm', role: 'a', text: "That makes sense. Would you mind if I asked what Cork is like? I've never been to Ireland.", vi: 'Em hiểu rồi. Em hỏi Cork như thế nào có phiền chị không? Em chưa đến Ireland bao giờ.' },
          { who: 'Esme', role: 'b', text: "Not at all. It's small, friendly, and it rains a lot. The food scene is great, though.", vi: 'Không phiền đâu. Nhỏ, thân thiện, và mưa nhiều. Nhưng đồ ăn thì tuyệt.' },
          { who: 'Trâm', role: 'a', text: "Then you might like the food stalls near the office. I'd suggest trying the broken rice first.", vi: 'Vậy chắc chị sẽ thích mấy quầy ăn gần văn phòng. Em gợi ý chị thử cơm tấm trước.' },
          { who: 'Esme', role: 'b', text: "Broken rice? Is that a joke, or is it actually broken?", vi: 'Cơm "vỡ"? Em đùa hay nó vỡ thật?' },
          { who: 'Trâm', role: 'a', text: "It's actually broken! I'm not pulling your leg. Could we maybe go together at lunch on Monday?", vi: 'Vỡ thật đấy ạ! Em không đùa đâu. Thứ Hai mình đi ăn trưa cùng được không chị?' },
        ],
      },
      {
        t: 'build',
        id: 'gtd24-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Trâm (5 câu)',
        items: [
          { vi: '(Lỡ lời) Ôi, xin lỗi, câu đó em nói sai rồi.', chips: ['Oh', 'no,', 'sorry,', 'that', 'came', 'out', 'wrong.', 'go', 'false'], answer: ['Oh', 'no,', 'sorry,', 'that', 'came', 'out', 'wrong.'] },
          { vi: 'Em chỉ là chưa nghĩ đã nói.', chips: ['I', 'just', "didn't", 'think', 'before', 'I', 'spoke.', 'speak', 'after'], answer: ['I', 'just', "didn't", 'think', 'before', 'I', 'spoke.'] },
          { vi: 'Em hỏi Cork như thế nào có phiền chị không?', chips: ['Would', 'you', 'mind', 'if', 'I', 'asked', 'what', 'Cork', 'is', 'like?', 'ask', 'how'], answer: ['Would', 'you', 'mind', 'if', 'I', 'asked', 'what', 'Cork', 'is', 'like?'] },
          { vi: 'Em gợi ý chị thử cơm tấm trước.', chips: ["I'd", 'suggest', 'trying', 'the', 'broken', 'rice', 'first.', 'try', 'to'], answer: ["I'd", 'suggest', 'trying', 'the', 'broken', 'rice', 'first.'] },
          { vi: 'Thứ Hai mình đi ăn trưa cùng được không chị?', chips: ['Could', 'we', 'maybe', 'go', 'together', 'at', 'lunch', 'on', 'Monday?', 'must', 'in'], answer: ['Could', 'we', 'maybe', 'go', 'together', 'at', 'lunch', 'on', 'Monday?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd24-noi-tra-loi',
        part: '1',
        questions: [
          'Have you ever said something that came out wrong? What happened, and how did you fix it?',
          'In your culture, how do people usually give negative feedback?',
          'What kind of jokes are safe at work, and what kind are not?',
          "Someone asks you a question you'd rather not answer. What do you say?",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Esme, a friendly Irish colleague who has just moved to our Ho Chi Minh City office from Cork. We meet at a monthly team social. During the conversation, set up three tricky moments: (1) let me say something slightly wrong about Ireland or the UK and react with a short awkward pause; (2) say something sarcastic with a straight face and see if I notice; (3) ask me a slightly personal question (rent or salary) to see how I deflect. Speak naturally at B2 level, about 165 words per minute. After 12 turns, tell me in Vietnamese: did I repair my mistake quickly (short apology, one fix, new topic)? Did I use might / could / would to soften? Give two concrete corrections."',
          'Làm **2 lượt**. Lượt hai đổi vai: **AI lỡ lời** với bạn về Việt Nam (ví dụ nhầm Việt Nam với một nước khác), bạn đáp sao cho người kia **đỡ ngượng** rồi tự đổi chủ đề giúp họ.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd24-viet',
    kind: 'writing',
    title: 'Trả lời khéo một tin nhắn khó',
    goal: 'Viết được bốn loại tin khó ở cả mức thân mật và trang trọng: chữa một tin bị hiểu lầm, góp ý thật mà không làm buồn, né câu hỏi riêng tư, và trả lời người đang bực.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao tin nhắn khó hơn nói',
        items: [
          'Khi nói, người ta nghe **giọng** và thấy **mặt** bạn. Tin nhắn thì không: một câu đùa có thể đọc thành chê, một chữ "Fine." có thể đọc thành giận.',
          'Hôm nay viết **4 loại tin khó**: chữa tin bị hiểu lầm · góp ý thật · né câu hỏi riêng · trả lời người đang bực.',
          'Mỗi loại hai bản đặt cạnh nhau: **thân mật** (bạn, đồng nghiệp) và **trang trọng** (sếp, khách, chủ nhà).',
          'Khung chung: **Nhận → Một câu chính (mềm) → Mở lối tiếp**. Dùng lại might / could / would của bài Nói và should have của Ngày 21.',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu tin, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Chữa một tin bị hiểu lầm',
        caption: 'Tình huống: Trâm viết "Who made these slides?? 😂" vào nhóm để khen (slide quá đẹp), nhưng người làm slide đọc thành chê. Nhận ngay, nói rõ ý thật, không giải thích dài.',
        cols: [
          {
            title: 'Thân mật (nhóm chat team)',
            anh: 'speech-balloon',
            items: [
              'Sorry, that came across wrong!',
              'I meant the slides were amazing, not funny.',
              'Seriously, the timeline one is brilliant 🙌',
            ],
          },
          {
            title: 'Trang trọng (email cho người ngoài team)',
            anh: 'e-mail',
            items: [
              'Dear Ms Nakamura,',
              'I am afraid my previous message may have come across the wrong way.',
              'I meant to say that I was very impressed by the slides.',
              'Apologies for any confusion.',
              'Best regards,',
              'Nguyen Ngoc Tram',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Góp ý thật khi được nhờ nhận xét',
        caption: 'Tình huống: một người nhờ bạn xem thiết kế thiệp mời tiệc cuối năm của họ. Khen một điều cụ thể, góp **một** điều quan trọng nhất bằng might / could, đề nghị giúp.',
        cols: [
          {
            title: 'Thân mật (bạn cùng nhóm)',
            anh: 'mobile-phone',
            items: [
              'Love the colours!',
              'One small thing: the date might be a bit hard to read on a phone.',
              'Could you maybe make it bigger?',
              'Happy to look again later 😊',
            ],
          },
          {
            title: 'Trang trọng (chị trưởng phòng)',
            anh: 'memo',
            items: [
              'Hi Linda,',
              'Thank you for sharing the draft. Overall, it looks great.',
              'I would suggest making the date and time a little larger, as they could be hard to read on a phone screen.',
              'Please let me know if I can help with anything else.',
              'Best,',
              'Tram',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Né câu hỏi riêng tư trong tin nhắn',
        caption: 'Tình huống: có người nhắn hỏi lương thực tập / tiền nhà của bạn. Không cần nói dối, không cần giảng giải. Giữ riêng một cách nhẹ nhàng, rồi đưa một chủ đề khác.',
        cols: [
          {
            title: 'Thân mật (bạn mới quen)',
            anh: 'zipper-mouth-face',
            items: [
              "Ha, I'll keep that one a mystery! 😄",
              "Let's just say I'm not buying a house any time soon.",
              'How are you finding the new job?',
            ],
          },
          {
            title: 'Trang trọng (khách, người lớn tuổi)',
            anh: 'envelope',
            items: [
              'Thank you for asking.',
              "I'd prefer to keep that private, if that's all right.",
              "I'd be happy to tell you more about the project, though.",
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Trả lời người đang bực',
        caption: 'Tình huống: bạn lỡ kể với cả nhóm chuyện bất ngờ sinh nhật của bạn mình / bạn về khuya làm ồn ở homestay. Nhận lỗi rõ (should have), không "nhưng mà", đưa một việc cụ thể để sửa.',
        cols: [
          {
            title: 'Thân mật (bạn bè)',
            anh: 'pensive-face',
            items: [
              "I'm really sorry. I didn't realise it was a secret.",
              'I should have checked with you first.',
              'Can I make it up to you? Coffee on me tomorrow ☕',
            ],
          },
          {
            title: 'Trang trọng (chủ homestay)',
            anh: 'house',
            items: [
              'Dear Mrs Hughes,',
              'I am very sorry about the noise last night.',
              'I should have been much quieter when I came in.',
              'It will not happen again.',
              'Kind regards,',
              'Tram',
            ],
          },
        ],
      },

      { t: 'h', text: '2. Khung câu cho tin nhắn khó' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'Sorry, that came across wrong. I meant (that) + S + V.',
            vi: 'Chữa tin bị hiểu lầm. came across = (tin nhắn) bị đọc thành.',
            examples: [
              { en: 'Sorry, that came across wrong. I meant the slides were amazing.', vi: 'Xin lỗi, tin đó bị hiểu sai. Ý mình là slide rất tuyệt.' },
              { en: 'My last message may have come across the wrong way.', vi: 'Tin nhắn trước của tôi có thể đã bị hiểu sai.' },
              { en: 'I meant to say that I was impressed.', vi: 'Ý tôi muốn nói là tôi rất ấn tượng.' },
            ],
          },
          {
            formula: 'Khen cụ thể + One small thing: … might / could … + Could you maybe…?',
            vi: 'Góp ý thật mà không làm buồn: một lời khen thật, một điều quan trọng nhất, một đề nghị.',
            examples: [
              { en: 'Love the colours! One small thing: the date might be hard to read.', vi: 'Màu đẹp quá! Một điều nhỏ: ngày tháng có thể hơi khó đọc.' },
              { en: 'I would suggest making the date a little larger.', vi: 'Tôi gợi ý làm ngày tháng to hơn một chút.' },
              { en: 'Could you maybe move the logo to the top?', vi: 'Bạn chuyển logo lên trên được không?' },
            ],
          },
          {
            formula: "I'd prefer to keep that private, if that's all right. · I'll keep that one a mystery!",
            vi: 'Né câu hỏi riêng (trang trọng / thân).',
            examples: [
              { en: "I'd prefer to keep that private, if that's all right.", vi: 'Tôi xin phép giữ riêng chuyện đó.' },
              { en: "Ha, I'll keep that one a mystery!", vi: 'Ha, cái đó để bí mật nhé!' },
              { en: "I'd be happy to tell you about the project, though.", vi: 'Nhưng tôi rất vui được kể về dự án.' },
            ],
          },
          {
            formula: "I'm really sorry about… I should have + V3. + việc sửa cụ thể",
            vi: 'Trả lời người đang bực: nhận lỗi rõ, không "but", có hành động.',
            examples: [
              { en: 'I should have checked with you first.', vi: 'Lẽ ra mình phải hỏi bạn trước.' },
              { en: 'I should have been much quieter when I came in.', vi: 'Lẽ ra tôi phải giữ yên lặng hơn nhiều khi về.' },
              { en: 'Can I make it up to you?', vi: 'Mình bù cho bạn được không?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Nhận (Sorry / Thank you for…) → Một câu chính mềm (might / could / should have) → Mở lối tiếp (câu hỏi / đề nghị)',
        vi: 'Tin khó tốt chỉ cần 2–4 câu. Dài hơn thì người đọc bắt đầu đọc "giữa các dòng" và dễ hiểu sai thêm.',
      },
      {
        t: 'table',
        head: ['Chi tiết', 'Có thể bị đọc thành', 'An toàn hơn'],
        rows: [
          ['😂 sau câu về việc của người khác', 'Cười nhạo', '🙌 · 👏 · hoặc viết rõ "amazing"'],
          ['"Fine." · "OK." (có dấu chấm, một mình)', 'Đang giận, cụt lủn (nhất là với người trẻ)', '"Sounds good!" · "Okay, thanks!"'],
          ['👍 một mình trả lời tin dài', 'Lạnh nhạt, cho xong', '"Got it, thanks!" + 👍'],
          ['🙏', 'Người Việt, Nhật: cảm ơn / xin lỗi; vài người phương Tây: cầu xin hoặc đập tay', 'Viết "Thanks so much!"'],
          ['Viết HOA cả câu', 'Đang hét', 'Bôi đậm hoặc viết thường'],
          ['Nhiều dấu chấm hỏi "??"', 'Mất kiên nhẫn', 'Một dấu hỏi + "when you get a chance"'],
        ],
        caption: 'Không có luật cứng: mỗi nhóm có thói quen riêng. Khi viết cho người **chưa thân** hoặc **đang bực**, chọn cột phải.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd24-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Xin lỗi, tin đó bị hiểu sai rồi!', chips: ['Sorry,', 'that', 'came', 'across', 'wrong!', 'come', 'cross'], answer: ['Sorry,', 'that', 'came', 'across', 'wrong!'] },
          { vi: 'Một điều nhỏ: chữ có thể hơi khó đọc.', chips: ['One', 'small', 'thing:', 'the', 'text', 'might', 'be', 'a', 'bit', 'hard', 'to', 'read.', 'must', 'reading'], answer: ['One', 'small', 'thing:', 'the', 'text', 'might', 'be', 'a', 'bit', 'hard', 'to', 'read.'] },
          { vi: 'Tôi xin phép giữ riêng chuyện đó.', chips: ["I'd", 'prefer', 'to', 'keep', 'that', 'private.', 'secret', 'keeping'], answer: ["I'd", 'prefer', 'to', 'keep', 'that', 'private.'] },
          { vi: 'Lẽ ra mình phải hỏi bạn trước.', chips: ['I', 'should', 'have', 'checked', 'with', 'you', 'first.', 'check', 'must'], answer: ['I', 'should', 'have', 'checked', 'with', 'you', 'first.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd24-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: 'came across · meant · might · could · should have · prefer',
        items: [
          { q: 'Sorry, that came ___ wrong! (bị hiểu)', answers: ['across'] },
          { q: 'I ___ the slides were amazing, not funny. (ý mình là)', answers: ['meant'] },
          { q: 'The date ___ be a bit hard to read on a phone. (có thể)', answers: ['might', 'could', 'may'] },
          { q: '___ you maybe make it bigger?', answers: ['Could', 'could', 'Can', 'can'] },
          { q: 'I should ___ checked with you first.', answers: ['have'] },
          { q: "I'd ___ to keep that private, if that's all right.", answers: ['prefer'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd24-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: 'came across wrong · I meant… · might / could · I\'d prefer to… · should have + V3',
        items: [
          { q: '(Nhắn nhóm) Xin lỗi, tin lúc nãy bị hiểu sai! Ý mình là món đó rất ngon.', hint: 'came across wrong, I meant', answers: ['Sorry, that came across wrong! I meant the food was really good.', 'Sorry, that came across wrong! I meant the dish was really good.', 'Sorry, my message came across wrong! I meant the food was really good.', 'Sorry, that came across wrong. I meant the food was delicious.', 'Sorry, that came across wrong! I meant the dish was delicious.', 'Sorry, that came across wrong! I meant that the food was really good.'] },
          { q: '(Góp ý bạn) Ảnh đẹp lắm! Một điều nhỏ: chữ có thể hơi nhỏ.', hint: 'love, one small thing, might be a bit small', answers: ['Love the photo! One small thing: the text might be a bit small.', 'Great photo! One small thing: the text might be a bit small.', 'I love the photo! One small thing: the text might be a bit small.', 'Love the photo! One small thing: the text could be a bit small.', 'Love the photo! One small thing: the writing might be a bit small.', 'Love the picture! One small thing: the text might be a bit small.'] },
          { q: '(Trang trọng) Tôi xin phép giữ riêng chuyện đó, nếu không phiền.', hint: "I'd prefer to keep, if that's all right", answers: ["I'd prefer to keep that private, if that's all right.", "I would prefer to keep that private, if that's all right.", "I'd prefer to keep that private, if you don't mind.", "I would prefer to keep that private, if you don't mind.", "I'd rather keep that private, if that's all right.", "I'd prefer to keep that private if that's all right."] },
          { q: '(Nhắn bạn) Mình xin lỗi thật. Lẽ ra mình phải hỏi bạn trước.', hint: "I'm really sorry, should have asked", answers: ["I'm really sorry. I should have asked you first.", "I'm really sorry. I should have checked with you first.", 'I am really sorry. I should have asked you first.', "I'm so sorry. I should have asked you first.", "I'm really sorry, I should have asked you first."] },
          { q: '(Nhắn chủ nhà) Tối mai tôi về muộn một chút có được không ạ?', hint: 'would it be okay if, came back', answers: ['Would it be okay if I came back a bit late tomorrow evening?', 'Would it be okay if I came back a little late tomorrow night?', 'Would it be okay if I came back a bit late tomorrow night?', 'Would it be OK if I came back a bit late tomorrow evening?', 'Would it be all right if I came back a bit late tomorrow evening?', 'Would it be okay if I came home a bit late tomorrow evening?', 'Would it be alright if I came back a bit late tomorrow night?'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi gửi một tin khó',
        items: [
          '**Đọc to bằng giọng khó chịu nhất có thể.** Nếu câu vẫn ổn khi đọc bằng giọng đó, người nhận sẽ không hiểu sai.',
          '**Bỏ chữ "but" sau lời xin lỗi.** "Sorry, but…" làm lời xin lỗi biến mất.',
          '**Chỉ góp ý một điều** quan trọng nhất trong tin nhắn. Còn nhiều điều thì hẹn nói trực tiếp: "Shall we have a quick chat later?"',
          '**Tin quá khó thì đừng nhắn**: chuyện nhạy cảm, người đang rất bực, chuyện có thể làm họ mất mặt trước nhóm. Nhắn riêng một câu: "Could we talk in person?"',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd24-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 24',
    goal: 'Làm 34 câu có đáp án để nhận ra câu nói thẳng, nói vòng, câu đùa; gỡ ngượng và đổi chủ đề đúng lúc; làm mềm câu bằng might / could / would; ôn Ngày 21–23.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu.',
          'Có **4 câu ôn** Ngày 21–23 (ghi rõ trong câu).',
          'Làm không nhìn bài. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **27/34** trở lên thì làm **Kiểm tra chặng 4** ngay sau bài này.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd24-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn lỡ đùa "Japanese people never take holidays, right?" với một đồng nghiệp người Nhật, và người đó im lặng. Câu gỡ tốt nhất:',
            options: ['Why are you so quiet? It was a joke.', "Sorry, that came out wrong. I shouldn't have generalised. Are you planning any trips this year?", "Sorry sorry sorry, I'm so stupid, in Vietnam we always joke like this because…", '(cười to rồi nói chuyện khác)'],
            correct: 1,
            why: 'Đủ 3 bước: nhận ngay · một câu sửa (shouldn\'t have generalised) · mở cửa mới (hỏi về chuyến đi).',
          },
          {
            q: 'Đồng nghiệp người Anh nhìn bản kế hoạch của bạn và nói: "Interesting. It might be worth double-checking the budget." Ý họ là:',
            options: ['Kế hoạch rất hay, không cần sửa', 'Phần ngân sách nhiều khả năng có vấn đề, bạn nên kiểm lại', 'Họ không quan tâm', 'Họ muốn bạn hỏi người khác'],
            correct: 1,
            why: '**It might be worth + V-ing** kiểu Anh = bạn nên làm. Nghe nhẹ nhưng ý là "kiểm lại đi".',
          },
          {
            q: 'Đồng nghiệp người Hà Lan nói: "This paragraph is unclear." Bạn đáp thế nào cho chuyên nghiệp?',
            options: ['Why are you so rude?', 'Thanks. Which part is unclear? What would you change?', '(im lặng cả buổi)', 'Your English is unclear too.'],
            correct: 1,
            why: 'Góp ý thẳng = nói về **bài**, không về **người**. Hỏi cụ thể để sửa là cách đáp tốt nhất.',
          },
          {
            q: 'Một người Úc nói: "Nice one, you\'ve only spilled coffee twice today!" và nháy mắt. Đây là:',
            options: ['Lời chê thật', 'Câu trêu thân thiện', 'Lời khen thật', 'Lời cảnh cáo'],
            correct: 1,
            why: 'Nháy mắt + nói quá = **trêu** (banter). Đáp nhẹ: "Ha! Give me time, it\'s only ten o\'clock."',
          },
          {
            q: 'Ai đó hỏi bạn trong bữa tối với team: "So who did you vote for?" Câu né khéo nhất:',
            options: ['That is none of your business!', 'Ha, that might be a conversation for another time. How was your trip last week?', 'I hate politics and people who talk about it.', '(bỏ đi)'],
            correct: 1,
            why: 'Né mà không làm người hỏi mất mặt + tự mở chủ đề mới.',
          },
          {
            q: 'Bạn muốn xin về sớm 30 phút. Câu mềm nhất:',
            options: ['I leave early today.', 'Would it be okay if I left half an hour early today?', 'I must leave early.', 'Can I leave early? Yes?'],
            correct: 1,
            why: '**Would it be okay if I + V-ed?** = xin phép mềm.',
          },
          {
            q: 'Bạn nhắn "Who wrote this?? 😂" vào nhóm, định khen nhưng người viết hiểu là chê. Tin chữa tốt nhất:',
            options: ['Relax, it was a joke.', "Sorry, that came across wrong! I meant it was brilliant, not funny.", "You don't understand jokes.", '(xoá tin, không nói gì)'],
            correct: 1,
            why: '**came across wrong** + nói rõ ý thật. Xoá tin mà không giải thích làm người kia càng nghĩ nhiều.',
          },
          {
            q: '(Ôn Ngày 23) Đồng nghiệp: "Apparently the office is moving next year." Câu đáp tự nhiên:',
            options: ['You are lying.', 'Really? Where did you hear that?', 'According to me, no.', 'The news say no.'],
            correct: 1,
            why: '"Apparently" = nghe nói, chưa chắc ⇒ hỏi nguồn một cách tò mò.',
          },
          {
            q: '(Ôn Ngày 22) Người bán đưa giá 600 nghìn. Bạn muốn trả giá mềm:',
            options: ['Too expensive. 300.', 'If you could do it for 450, I would take two.', 'Give me cheaper.', 'No.'],
            correct: 1,
            why: 'Điều kiện loại 2 **If you could…, I would…** là cách thương lượng mềm (Ngày 22).',
          },
          {
            q: '(Ôn Ngày 21) Bạn đến nhận phòng, khách sạn bảo hết phòng như đã đặt. Câu hợp nhất:',
            options: ['You are terrible!', 'I was told my room would be ready at two. Could I speak to the duty manager, please?', 'Why you do this?', 'I want my money now.'],
            correct: 1,
            why: '**I was told (that)… would…** kể lại lời hứa + xin gặp quản lý trực ca: chắc mà lịch sự (Ngày 21).',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd24-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: 'might · could · would · came · harm · lighter · pulling · should',
        items: [
          { q: 'It ___ be worth asking Joris first. (có lẽ nên)', answers: ['might', 'could', 'may'] },
          { q: '___ you maybe send me the file again?', answers: ['Could', 'could', 'Can', 'can'] },
          { q: '___ it be okay if I joined the call a bit late?', answers: ['Would', 'would'] },
          { q: 'Sorry, that ___ out wrong.', answers: ['came'] },
          { q: 'Sorry about that! — No ___ done.', answers: ['harm'] },
          { q: 'On a ___ note, how was your weekend?', answers: ['lighter'] },
          { q: "Relax, I'm ___ your leg.", answers: ['pulling'] },
          { q: "I ___n't have assumed you drink beer.", answers: ['should'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd24-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: 'came out wrong · shouldn\'t have · might / could / would · on a lighter note',
        items: [
          { q: 'Xin lỗi, câu đó mình nói ra sai rồi.', hint: 'came out wrong', answers: ['Sorry, that came out wrong.', 'Sorry, that came out completely wrong.', "Sorry, that didn't come out right.", 'I am sorry, that came out wrong.', "I'm sorry, that came out wrong."] },
          { q: 'Lẽ ra mình không nên nói vậy.', hint: "shouldn't have said", answers: ["I shouldn't have said that.", 'I should not have said that.'] },
          { q: 'Có lẽ nên cắt bớt phần này một chút.', hint: 'might be worth, cutting / shortening', answers: ['It might be worth cutting this part a bit.', 'It might be worth shortening this part a bit.', 'It might be worth cutting this part a little.', 'It might be worth shortening this part a little.', 'It might be worth trimming this part a bit.', 'It might be worth cutting this section a bit.', 'It could be worth shortening this part a bit.'] },
          { q: 'Câu đó có thể bị hiểu là bất lịch sự.', hint: 'could come across as rude', answers: ['That could come across as rude.', 'It could come across as rude.', 'That might come across as rude.', 'It might come across as rude.', 'That could sound rude.', 'It could sound rude.'] },
          { q: 'Mình đùa thôi. Câu đùa dở quá, xin lỗi nhé.', hint: 'only joking, bad joke', answers: ["I was only joking. Bad joke, sorry.", "I was only joking. Sorry, bad joke.", "I was just joking. Bad joke, sorry.", "I was just kidding. Sorry, bad joke.", "I was only joking. Sorry, that was a bad joke.", "I'm only joking. Bad joke, sorry.", 'Just kidding. Sorry, bad joke.'] },
          { q: 'Chuyện vui hơn nhé, cuối tuần của bạn thế nào?', hint: 'on a lighter note', answers: ['On a lighter note, how was your weekend?', 'On a lighter note, how was your weekend', 'So, on a lighter note, how was your weekend?'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd24-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "I think I've put my foot in it.", answer: "I think I've put my foot in it.", alt: ['I think I have put my foot in it.'] },
          { label: 'Câu 2', spell: 'That might be a conversation for another time.', answer: 'That might be a conversation for another time.' },
          { label: 'Câu 3', spell: 'Would it be okay if I left a bit early?', answer: 'Would it be okay if I left a bit early?', alt: ['Would it be OK if I left a bit early?'] },
          { label: 'Câu 4', spell: "Sorry, was that sarcasm? I can't tell.", answer: "Sorry, was that sarcasm? I can't tell.", alt: ['Sorry, was that sarcasm? I cannot tell.'] },
          { label: 'Câu 5', spell: "I'd prefer to keep that private, if that's all right.", answer: "I'd prefer to keep that private, if that's all right.", alt: ["I would prefer to keep that private, if that's all right.", "I'd prefer to keep that private, if that's alright."] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd24-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Mình cố đùa mà hỏng mất.', chips: ['I', 'was', 'trying', 'to', 'be', 'funny,', 'and', 'it', "didn't", 'work.', 'fun', 'try'], answer: ['I', 'was', 'trying', 'to', 'be', 'funny,', 'and', 'it', "didn't", 'work.'] },
          { vi: 'Cái đó có thể hơi khó.', chips: ['That', 'could', 'be', 'a', 'bit', 'tricky.', 'must', 'very'], answer: ['That', 'could', 'be', 'a', 'bit', 'tricky.'] },
          { vi: 'Nếu là mình thì mình không hỏi chuyện đó.', chips: ['I', "wouldn't", 'ask', 'about', 'that.', "won't", 'asking'], answer: ['I', "wouldn't", 'ask', 'about', 'that.'] },
          { vi: 'Bố cục rất tốt. Nói vậy chứ, slide ba có thể hơi dài.', chips: ['The', 'structure', 'is', 'great.', 'That', 'said,', 'slide', 'three', 'might', 'be', 'a', 'bit', 'long.', 'But', 'must'], answer: ['The', 'structure', 'is', 'great.', 'That', 'said,', 'slide', 'three', 'might', 'be', 'a', 'bit', 'long.'] },
          { vi: 'Đừng lo, mình nghe câu đó suốt.', chips: ["Don't", 'worry,', 'I', 'get', 'that', 'a', 'lot.', 'hear', 'many'], answer: ["Don't", 'worry,', 'I', 'get', 'that', 'a', 'lot.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Nhớ lại **một lần bạn lỡ lời** (bằng tiếng Việt cũng được). Nói lại cảnh đó bằng tiếng Anh theo 4 bước: tín hiệu → nhận → một câu sửa → mở cửa mới. Ghi âm 45 giây.',
          'Viết lại một tin nhắn bạn từng gửi mà người kia hiểu sai, theo khung **Nhận → Một câu chính mềm → Mở lối tiếp**.',
          'Tiếp theo: **Kiểm tra chặng 4** (Ngày 19–24). Đạt rồi mới sang Ngày 25, chặng 5 "Tự nhiên": nghe người bản xứ nói nhanh.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG 4 ═══════════════════════════ */
  {
    id: 'gtd24-kiem-tra',
    kind: 'review',
    title: 'Kiểm tra chặng 4 (Ngày 19–24)',
    goal: 'Tự đo mức nắm chắc chặng 4 "Giao tiếp sâu" (Ngày 19–24): nghe một bữa tối tiếp khách mới, chọn câu hợp cảnh, dùng đúng ngữ pháp từng ngày và tự viết tin nhắn khó. Đạt ≥ 70 % từng phần mới sang chặng 5.',
    minutes: 45,
    blocks: [
      {
        t: 'recap',
        title: 'Bài kiểm tra này đo gì',
        items: [
          '**4 phần, 46 câu, khoảng 45 phút**: Nghe · Mẫu câu hợp cảnh · Ngữ pháp · Viết tin nhắn. Toàn bộ là kiến thức **Ngày 19–24**.',
          '**Đạt** = từ **70 %** trở lên ở **từng phần**. Trượt phần nào thì ôn đúng Ngày ghi ở bảng dưới, không cần học lại cả chặng.',
          'Mọi câu đều **mới**: người mới, cảnh mới, câu mới. Nhớ đáp án cũ không giúp được.',
          'Mỗi câu có ghi **(Ngày N)** để bạn biết câu sai thuộc ngày nào.',
          'Chặng 5 (Ngày 25–30) là **nói tự nhiên**: nghe nhanh, nối âm, trò chuyện dài, kể chuyện, đùa. Bài nghe sẽ lên khoảng 180 từ/phút.',
        ],
      },
      {
        t: 'sodo',
        kind: 'mindmap',
        title: 'Chặng 4 (Ngày 19–24) — những gì sẽ bị kiểm',
        center: 'Ngày 19–24',
        branches: [
          { label: 'N19 Networking', items: ['used to · Did you use to…?', 'What made you…? (hỏi nối tiếp)', 'vào nhóm, thoát chuyện, xin liên lạc'], anh: 'handshake' },
          { label: 'N20 Đón khách', items: ['is made from · was built in', 'which · which means', 'giải thích món ăn, phong tục'], anh: 'world-map' },
          { label: 'N21 Phàn nàn', items: ['I was told (that)…', 'should have + V3', 'leo thang lịch sự, bị phàn nàn'], anh: 'bellhop-bell' },
          { label: 'N22 Thương lượng', items: ['If we + V-ed, we could…', 'How about…? · What if…?', 'đề xuất, nhượng bộ, chốt'], anh: 'balance-scale' },
          { label: 'N23 Thời sự', items: ['said / told / asked if', 'apparently · it seems · according to', 'đọc tiêu đề báo'], anh: 'newspaper' },
          { label: 'N24 Văn hoá', items: ['might · could · would làm mềm', 'came out wrong · on a lighter note', 'nói thẳng / vòng, đùa'], anh: 'globe-showing-asia-australia' },
        ],
        caption: 'Mỗi nhánh là kiến thức của một ngày. Câu sai nằm ở nhánh nào thì ôn đúng ngày đó.',
      },
      {
        t: 'note',
        title: 'Cách làm bài',
        items: [
          '**Gập sách**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm.',
          'Thời gian gợi ý: Nghe 12′ · Mẫu câu 10′ · Ngữ pháp 8′ · Viết tin nhắn 15′.',
          'Phần **Nghe**: đọc câu hỏi trước, nghe **tối đa 2 lần**, chưa mở lời thoại cho tới khi trả lời xong. Bài nghe không có dịch ở câu dễ.',
          'Phần **Viết**: cố **không bấm 💡 Gợi ý**. Bấm thì tự trừ câu đó khi tính điểm.',
          'Làm xong phần nào thì **ghi điểm ra giấy** rồi mới sang phần sau. Cuối bài đối chiếu bảng dưới.',
        ],
      },
      {
        t: 'table',
        caption: 'Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần',
        head: ['Phần', 'Số câu', 'Đạt khi', 'Chưa đạt thì ôn lại'],
        rows: [
          ['1. Nghe', '8 + 4', '≥ 9/12 (cộng hai khối)', 'Ngày 19 · Nghe (networking) — Ngày 21 · Nghe (phàn nàn) — Ngày 22 · Nghe (thương lượng) — Ngày 23 · Nghe (kể lại thông báo) — Ngày 24 · Nghe (lỡ lời và chữa)'],
          ['2. Mẫu câu hợp cảnh', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục "câu dùng được ngay" và bảng ba mức lịch sự'],
          ['3. Ngữ pháp', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục 🧱 Câu này ghép thế nào'],
          ['4. Viết tin nhắn', '6 + 4', '≥ 7/10 (cộng hai khối)', 'Ngày 20 · Viết (lịch trình cho khách) — Ngày 21 · Đọc (email khiếu nại) — Ngày 22 · Viết (tin thuyết phục nhóm) — Ngày 24 · Viết (tin nhắn khó)'],
        ],
      },

      /** ───────────── 1. Nghe ───────────── **/
      { t: 'h', text: 'Phần 1 — Nghe (12 câu · đạt ≥ 9 · trượt thì ôn Ngày 19, 21, 23, 24)' },
      {
        t: 'canh',
        anh: ['fork-and-knife-with-plate', 'woman-office-worker', 'man-office-worker', 'bellhop-bell', 'umbrella-with-rain-drops', 'microphone'],
        caption: 'Tối thứ Ba ở **Huế**. **Hằng**, thực tập sinh năm 3, được giao tiếp **Brent**, khách hàng từ Auckland (New Zealand) sang dự buổi làm việc hai ngày. Bữa tối có đủ chuyện: làm quen, một lỗi đặt bàn, giải thích món ăn, tin thời tiết và một câu nói hớ.',
      },
      {
        t: 'listen',
        id: 'gtd24-kt-nghe',
        title: 'Test — Dinner with a client in Huế',
        note: 'Nghe tối đa 2 lần. Ghi ra giấy: trước đây Hằng làm gì; nhà hàng mắc lỗi gì và đề nghị gì; món ăn làm từ gì; dự báo và hãng bay nói gì; Hằng lỡ lời câu gì và gỡ ra sao; hai người hẹn gì.',
        lines: [
          { who: 'Brent', voice: 'nz-nam', text: 'So, how long have you been with the company, Hằng?' },
          { who: 'Hằng', voice: 'ca-nu', text: "About four months. I used to work part-time at a hotel, actually. That's probably why my manager asked me to look after you." },
          { who: 'Brent', voice: 'nz-nam', text: 'Lucky me. What made you switch from hotels to software?' },
          { who: 'Hằng', voice: 'ca-nu', text: 'I kept fixing the booking system when it crashed, and one day I realised I enjoyed that more than the front desk.', vi: 'Em cứ sửa hệ thống đặt phòng mỗi lần nó sập, rồi một hôm em nhận ra em thích việc đó hơn đứng quầy lễ tân.' },
          { who: 'Waiter', voice: 'us-nam', text: "Good evening. I'm so sorry, but I'm afraid we don't have a table by the river tonight." },
          { who: 'Hằng', voice: 'ca-nu', text: 'Oh? I was told this morning that we had a table by the river at seven.', vi: 'Ơ? Sáng nay em được báo là bọn em có bàn cạnh sông lúc bảy giờ.' },
          { who: 'Waiter', voice: 'us-nam', text: "You're right. There was a mix-up with the booking. If you waited about fifteen minutes, we could give you the best table, and the drinks would be on us.", vi: 'Chị nói đúng. Có nhầm lẫn khi đặt bàn. Nếu anh chị chờ khoảng mười lăm phút, bên em có thể dành bàn đẹp nhất, và đồ uống nhà hàng mời.' },
          { who: 'Brent', voice: 'nz-nam', text: "How about we wait at the bar? I'm in no hurry." },
          { who: 'Hằng', voice: 'ca-nu', text: 'Sounds good. Thank you for sorting it out.' },
          { who: 'Brent', voice: 'nz-nam', text: "This looks amazing. What's it called?" },
          { who: 'Hằng', voice: 'ca-nu', text: "It's called bánh khoái. It's made from rice flour, and it's usually eaten with a thick peanut sauce, which is a Huế speciality.", vi: 'Món này là bánh khoái. Làm từ bột gạo, thường ăn với nước chấm đậu phộng sệt, một đặc sản Huế.' },
          { who: 'Brent', voice: 'nz-nam', text: "Delicious. Oh, did you see the news? Apparently there's a heavy rain warning for tomorrow. My flight's at four." },
          { who: 'Hằng', voice: 'ca-nu', text: "I saw that. According to the forecast, it seems the rain will ease off by lunchtime. And the airline said flights would probably go ahead as normal.", vi: 'Em có thấy. Theo dự báo, có vẻ mưa sẽ ngớt trước giờ trưa. Và hãng bay nói các chuyến chắc vẫn bay bình thường.' },
          { who: 'Brent', voice: 'nz-nam', text: "That's a relief. My colleague told me to try karaoke while I'm here. She said it was a national sport." },
          { who: 'Hằng', voice: 'ca-nu', text: 'Ha, it is! But you look really tired. Is it the jet lag, or do you always look like this?', vi: 'Ha, đúng thế! Nhưng trông anh mệt lắm. Do lệch múi giờ, hay lúc nào anh cũng trông như vậy?' },
          { who: 'Brent', voice: 'nz-nam', text: "Ha… I'll go with jet lag." },
          { who: 'Hằng', voice: 'ca-nu', text: "Oh, sorry, that came out wrong! I just meant it's been a really long day for you. Would it be okay if we finished a bit earlier tonight?", vi: 'Ôi, em xin lỗi, em nói sai rồi! Ý em chỉ là hôm nay anh đã có một ngày rất dài. Tối nay mình kết thúc sớm một chút có được không ạ?' },
          { who: 'Brent', voice: 'nz-nam', text: 'No harm done. And yes, that might be a good idea. Could we maybe do karaoke on Thursday instead?' },
          { who: 'Hằng', voice: 'ca-nu', text: "Deal. I'll book somewhere, and this time I'll check the booking twice." },
          { who: 'Brent', voice: 'nz-nam', text: 'Ha! Good plan.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd24-kt-nghe-hieu',
        title: 'Phần 1a — Hiểu ý (8 câu)',
        items: [
          {
            q: 'Trước khi làm phần mềm, Hằng làm gì, và vì sao đổi nghề?',
            options: ['Làm hướng dẫn viên; vì thích đi lại', 'Làm bán thời gian ở khách sạn; vì hay sửa hệ thống đặt phòng và thấy thích việc đó hơn', 'Làm bồi bàn; vì lương thấp', 'Làm kế toán; vì chán số liệu'],
            correct: 1,
            why: '"I **used to** work part-time at a hotel" + trả lời câu hỏi nối tiếp "**What made you** switch…?" (Ngày 19).',
          },
          {
            q: 'Hằng phản ứng thế nào khi nhà hàng nói không có bàn cạnh sông?',
            options: ['Giận dữ đòi gặp chủ', 'Bình tĩnh kể lại điều đã được báo: có bàn cạnh sông lúc bảy giờ', 'Bỏ sang quán khác', 'Không nói gì'],
            correct: 1,
            why: '"**I was told** this morning that we **had** a table by the river at seven." — kể lại lời hứa, không đổ lỗi đích danh (Ngày 21).',
          },
          {
            q: 'Nhà hàng đề nghị gì?',
            options: ['Giảm nửa giá bữa ăn', 'Chờ khoảng 15 phút để có bàn đẹp nhất, đồ uống miễn phí', 'Ngồi trong nhà ngay', 'Hẹn hôm khác'],
            correct: 1,
            why: '"**If you waited** about fifteen minutes, **we could** give you the best table, and the drinks **would be** on us." — điều kiện loại 2 để đưa đề nghị (Ngày 22). **on us** = chúng tôi mời.',
          },
          {
            q: 'Brent đáp lại đề nghị bằng câu nào?',
            options: ['"No, thanks."', '"How about we wait at the bar?"', '"That\'s a big if."', '"Forget I asked."'],
            correct: 1,
            why: '**How about we + V?** = đề xuất nhẹ, chốt luôn phương án (Ngày 22).',
          },
          {
            q: 'Hằng giải thích bánh khoái thế nào?',
            options: ['Làm từ bột mì, ăn với nước mắm', 'Làm từ bột gạo, thường ăn với nước chấm đậu phộng sệt, đặc sản Huế', 'Làm từ gạo nếp, ăn với đường', 'Không giải thích'],
            correct: 1,
            why: '"It\'s **made from** rice flour, and it\'s usually **eaten with** a thick peanut sauce, **which is** a Huế speciality." — bị động + which (Ngày 20).',
          },
          {
            q: 'Tin thời tiết và tin hãng bay chắc tới mức nào?',
            options: ['Chắc chắn: chuyến bay bị huỷ', 'Có vẻ mưa ngớt trước trưa; hãng bay nói các chuyến chắc vẫn bay bình thường', 'Không ai biết gì', 'Brent phải đổi vé'],
            correct: 1,
            why: '"**According to** the forecast, **it seems** the rain will ease off…" và "the airline **said** flights **would probably** go ahead". Nhãn độ chắc + tường thuật lùi thì (Ngày 23).',
          },
          {
            q: 'Hằng lỡ lời ở câu nào, và gỡ ra sao?',
            options: ['Chê món ăn; xin lỗi nhà hàng', 'Nói Brent trông mệt "lúc nào cũng thế"; gỡ bằng "that came out wrong", nói rõ ý, rồi đề nghị kết thúc sớm', 'Hỏi lương của Brent; đổi chủ đề sang karaoke', 'Không có câu nào lỡ lời'],
            correct: 1,
            why: 'Nhận ngay (**Sorry, that came out wrong!**) → một câu sửa (**I just meant…**) → mở cửa mới (**Would it be okay if we finished a bit earlier?**) (Ngày 24).',
          },
          {
            q: 'Cuối cùng hai người hẹn gì?',
            options: ['Đi karaoke ngay tối nay', 'Kết thúc sớm tối nay, đi karaoke vào thứ Năm', 'Huỷ chuyến bay', 'Ăn sáng cùng nhau'],
            correct: 1,
            why: 'Brent: "that **might** be a good idea. **Could we maybe** do karaoke on Thursday instead?" — đề nghị mềm bằng might / could (Ngày 24).',
          },
        ],
      },
      {
        t: 'dictation',
        id: 'gtd24-kt-chinh-ta',
        title: 'Phần 1b — Nghe và gõ lại (4 câu)',
        items: [
          { label: 'Câu 1 (Ngày 19)', spell: 'I used to work part-time at a hotel.', answer: 'I used to work part-time at a hotel.', alt: ['I used to work part time at a hotel.'] },
          { label: 'Câu 2 (Ngày 21)', spell: 'I was told this morning that we had a table by the river.', answer: 'I was told this morning that we had a table by the river.' },
          { label: 'Câu 3 (Ngày 23)', spell: 'The airline said flights would probably go ahead as normal.', answer: 'The airline said flights would probably go ahead as normal.' },
          { label: 'Câu 4 (Ngày 24)', spell: 'Would it be okay if we finished a bit earlier tonight?', answer: 'Would it be okay if we finished a bit earlier tonight?', alt: ['Would it be OK if we finished a bit earlier tonight?'] },
        ],
      },

      /** ───────────── 2. Mẫu câu hợp cảnh ───────────── **/
      { t: 'h', text: 'Phần 2 — Mẫu câu hợp cảnh (12 câu · đạt ≥ 9 · trượt thì ôn bài Nói của Ngày ghi trong câu)' },
      {
        t: 'mcq',
        id: 'gtd24-kt-mau-cau',
        title: 'Phần 2 — Chọn câu hợp cảnh nhất (12 câu)',
        items: [
          {
            q: '(Ngày 19) Ở một hội thảo, ba người đang nói chuyện ở bàn đứng. Bạn muốn nhập nhóm:',
            options: ['Hello, I am here.', "Mind if I join you? I couldn't help overhearing you mention testing.", 'Move, please.', '(đứng cạnh, im lặng)'],
            correct: 1,
            why: '**Mind if I join you?** + một lý do liên quan tới chuyện họ đang nói giúp bạn nhập nhóm tự nhiên.',
          },
          {
            q: '(Ngày 19) Bạn muốn kết thúc cuộc nói chuyện và xin liên lạc:',
            options: ['Bye. Give me your phone.', "I should get going. It was great talking to you. Would you mind if I connected with you on LinkedIn?", 'I am bored now.', 'Finish.'],
            correct: 1,
            why: '**I should get going** = câu đệm chào ra về lịch sự, rồi xin kết nối bằng **Would you mind if I connected…?** (Ngày 19).',
          },
          {
            q: '(Ngày 20) Khách hỏi về áo dài. Câu giải thích tự nhiên:',
            options: ["It's traditional dress, which means people often wear it at weddings and on Tết.", 'It wear by women.', 'Áo dài is clothes.', 'It is make for party.'],
            correct: 0,
            why: '**which means** nối lời giải thích. Câu B sai bị động (is worn by).',
          },
          {
            q: '(Ngày 20) Bạn gợi ý lịch đi chơi cho khách:',
            options: ["I'd suggest going to the market early, which means you'll avoid the crowds.", 'You must go early.', 'Go market.', 'Market is crowded, so no.'],
            correct: 0,
            why: '**I\'d suggest + V-ing** + lý do bằng which means.',
          },
          {
            q: '(Ngày 21) Lễ tân không giải quyết được vấn đề, bạn muốn gặp người có quyền hơn:',
            options: ['Call your boss now!', 'Could I speak to the duty manager, please?', 'You are useless.', 'I want big boss.'],
            correct: 1,
            why: 'Leo thang **chắc mà lịch sự**: xin gặp quản lý trực ca.',
          },
          {
            q: '(Ngày 21) Bạn gom tiền đặt áo cho lớp và lỡ đặt sai cỡ. Một bạn phàn nàn. Bạn đáp:',
            options: ["It's not my fault.", "You're right, I should have double-checked the sizes. Let me sort it out.", 'Then do it yourself.', 'Sizes are not important.'],
            correct: 1,
            why: 'Bị phàn nàn: nhận lỗi bằng **should have + V3** và đưa việc sửa.',
          },
          {
            q: '(Ngày 22) Bạn muốn đề xuất một phương án ở giữa:',
            options: ['My way or nothing.', 'What if we met halfway and left at seven?', 'You are wrong.', 'No, no, no.'],
            correct: 1,
            why: '**What if we + V-ed…?** = đề xuất mềm.',
          },
          {
            q: '(Ngày 22) Hai bên đã gần thống nhất. Bạn chốt:',
            options: ['So, shall we call it 450, then?', 'Finish now.', 'OK, I win.', 'Fine, whatever.'],
            correct: 0,
            why: '**Shall we call it… then?** = chốt nhẹ nhàng, người kia chỉ cần nói "Deal."',
          },
          {
            q: '(Ngày 23) Bạn đọc thấy tin trên mạng nhưng chưa kiểm:',
            options: ['The company is closing.', "Apparently the company's opening a new office, but I haven't seen anything official.", 'According to me, the company moves.', 'The news say new office.'],
            correct: 1,
            why: '**Apparently** + nói rõ chưa có gì chính thức.',
          },
          {
            q: '(Ngày 23) Bạn lỡ buổi họp, đồng nghiệp kể lại cho bạn. Bạn nói:',
            options: ['Thanks for filling me in.', 'Thanks for your information.', 'OK, enough.', 'Why you not tell before?'],
            correct: 0,
            why: '**Thanks for filling me in.**',
          },
          {
            q: '(Ngày 24) Bạn muốn góp ý slide của trưởng nhóm có quá nhiều chữ:',
            options: ['Too much text. Change it.', 'Just a thought, but it might be worth cutting some of the text on slide two.', 'Your slide is bad.', 'Nobody will read this.'],
            correct: 1,
            why: '**Just a thought** + **might be worth + V-ing** + chỉ đúng chỗ.',
          },
          {
            q: '(Ngày 24) Một đồng nghiệp lỡ nói nhầm Việt Nam với Thái Lan rồi xin lỗi. Bạn đáp:',
            options: ['How can you not know?', "No harm done, I get that a lot! Have you been to either?", 'You should study geography.', '(im lặng)'],
            correct: 1,
            why: 'Người khác lỡ lời: đáp ngắn cho họ đỡ ngượng, rồi **tự bạn mở chủ đề mới** giúp họ.',
          },
        ],
      },

      /** ───────────── 3. Ngữ pháp ───────────── **/
      { t: 'h', text: 'Phần 3 — Ngữ pháp (12 câu · đạt ≥ 9 · trượt thì ôn mục 🧱 của Ngày ghi trong câu)' },
      {
        t: 'quiz',
        id: 'gtd24-kt-ngu-phap',
        title: 'Phần 3 — Điền một từ (12 câu)',
        kind: 'fill',
        grammar: 'used · Did · is · built · told · have · left · How · would · told · might · Would',
        items: [
          { q: '(Ngày 19) I ___ to live in Huế, but now I live in Đà Nẵng.', answers: ['used'] },
          { q: '(Ngày 19) ___ you use to play an instrument when you were a kid?', answers: ['Did', 'did'] },
          { q: '(Ngày 20) Phở ___ usually eaten for breakfast.', answers: ['is'] },
          { q: '(Ngày 20) The citadel was ___ in the nineteenth century. (build)', answers: ['built'] },
          { q: '(Ngày 21) I was ___ that the room would be ready by two.', answers: ['told'] },
          { q: '(Ngày 21) You should ___ told me about the extra fee.', answers: ['have'] },
          { q: '(Ngày 22) If we ___ (leave) at six, we could avoid the traffic.', answers: ['left'] },
          { q: '(Ngày 22) ___ about meeting halfway?', answers: ['How', 'how'] },
          { q: '(Ngày 23) Gốc: "The shop will be closed." → He said the shop ___ be closed.', answers: ['would'] },
          { q: '(Ngày 23) Gốc: "Don\'t worry." → She ___ me not to worry.', answers: ['told'] },
          { q: '(Ngày 24) It ___ be worth checking the menu first. (có lẽ nên)', answers: ['might', 'could', 'may'] },
          { q: '(Ngày 24) ___ it be okay if I left a bit early?', answers: ['Would', 'would'] },
        ],
      },

      /** ───────────── 4. Viết tin nhắn ───────────── **/
      { t: 'h', text: 'Phần 4 — Viết tin nhắn (10 câu · đạt ≥ 7 · trượt thì ôn bài Đọc / Viết của Ngày 20, 21, 22, 24)' },
      {
        t: 'quiz',
        id: 'gtd24-kt-viet',
        title: 'Phần 4a — Tự viết 6 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "It was great meeting you… · which · I was told… · If we…, we could… · Apparently… · Sorry, that came across wrong",
        items: [
          { q: '(Ngày 19 — tin xin kết nối) Rất vui được gặp anh ở hội thảo hôm qua. Mình kết nối nhé?', hint: 'great meeting you, shall we connect', answers: ['It was great meeting you at the conference yesterday. Shall we connect?', 'Great meeting you at the conference yesterday. Shall we connect?', 'It was great to meet you at the conference yesterday. Shall we connect?', 'It was nice meeting you at the conference yesterday. Shall we connect?', 'It was great meeting you at the conference yesterday. Shall we stay in touch?', "It was great meeting you at the conference yesterday. Let's connect!"] },
          { q: '(Ngày 20 — nhắn khách) Mai mình đi chợ Đông Ba, chợ này được xây từ thế kỷ 19.', hint: "we'll visit, which was built in", answers: ["Tomorrow we'll visit Dong Ba Market, which was built in the 19th century.", "Tomorrow we'll visit Đông Ba Market, which was built in the 19th century.", "Tomorrow we'll visit Dong Ba Market, which was built in the nineteenth century.", 'Tomorrow we will visit Dong Ba Market, which was built in the 19th century.', "Tomorrow we're visiting Dong Ba Market, which was built in the 19th century.", "We'll visit Dong Ba Market tomorrow, which was built in the 19th century."] },
          { q: '(Ngày 21 — email khiếu nại) Tôi được báo là khoản hoàn tiền sẽ về trong năm ngày.', hint: 'I was told, refund, would arrive', answers: ['I was told that the refund would arrive within five days.', 'I was told the refund would arrive within five days.', 'I was told that the refund would arrive in five days.', 'I was told the refund would arrive in five days.', 'I was told that my refund would arrive within five days.', 'I was told my refund would arrive within five days.'] },
          { q: '(Ngày 22 — nhắn nhóm) Nếu mình đi sớm hơn, mình có thể tránh tắc đường.', hint: 'if we left, could avoid the traffic', answers: ['If we left earlier, we could avoid the traffic.', 'If we left earlier, we could avoid traffic.', 'If we left a bit earlier, we could avoid the traffic.', 'If we went earlier, we could avoid the traffic.', 'If we left earlier we could avoid the traffic.'] },
          { q: '(Ngày 23 — nhắn đồng nghiệp) Nghe nói mai văn phòng đóng cửa sớm.', hint: 'apparently, closing early', answers: ["Apparently the office is closing early tomorrow.", "Apparently, the office is closing early tomorrow.", "Apparently the office closes early tomorrow.", "Apparently the office will close early tomorrow.", "Apparently the office is going to close early tomorrow.", "The office is closing early tomorrow, apparently."] },
          { q: '(Ngày 24 — nhắn nhóm) Xin lỗi, tin lúc nãy bị hiểu sai! Ý mình là bài nói rất hay.', hint: 'came across wrong, I meant', answers: ['Sorry, that came across wrong! I meant the talk was really good.', 'Sorry, that came across wrong! I meant the talk was great.', 'Sorry, my message came across wrong! I meant the talk was really good.', 'Sorry, that came across wrong. I meant the talk was really good.', 'Sorry, that came across wrong! I meant the presentation was really good.', 'Sorry, that came across wrong! I meant that the talk was really good.'] },
        ],
      },
      {
        t: 'build',
        id: 'gtd24-kt-viet-ghep',
        title: 'Phần 4b — Sắp xếp câu trong tin nhắn (4 câu)',
        items: [
          { vi: '(Ngày 20) Món này được ăn với rau thơm.', chips: ['This', 'dish', 'is', 'eaten', 'with', 'fresh', 'herbs.', 'eat', 'by'], answer: ['This', 'dish', 'is', 'eaten', 'with', 'fresh', 'herbs.'] },
          { vi: '(Ngày 21) Lẽ ra đơn hàng phải tới từ thứ Hai.', chips: ['The', 'order', 'should', 'have', 'arrived', 'by', 'Monday.', 'arrive', 'must'], answer: ['The', 'order', 'should', 'have', 'arrived', 'by', 'Monday.'] },
          { vi: '(Ngày 22) Thế mình chia đôi tiền thì sao?', chips: ['How', 'about', 'we', 'split', 'the', 'cost?', 'What', 'splitting', 'if'], answer: ['How', 'about', 'we', 'split', 'the', 'cost?'] },
          { vi: '(Ngày 24) Tối nay mình gửi bản mới có được không?', chips: ['Would', 'it', 'be', 'okay', 'if', 'I', 'sent', 'a', 'new', 'version', 'tonight?', 'send', 'will'], answer: ['Would', 'it', 'be', 'okay', 'if', 'I', 'sent', 'a', 'new', 'version', 'tonight?'] },
        ],
      },

      { t: 'h', text: 'Sau khi làm xong' },
      {
        t: 'note',
        title: 'Đạt hay chưa đạt — làm gì tiếp',
        items: [
          '**Đạt cả 4 phần**: sang **Ngày 25**, chặng 5 "Tự nhiên". Trước khi sang, ghi âm **1 phút kể lại một tin** (Ngày 23) và **gỡ một câu lỡ lời** (Ngày 24), so với bản ghi 1 phút nêu ý kiến ở cuối chặng 3: câu dài hơn chưa, có nói chắc vừa phải chưa?',
          '**Trượt Nghe**: nghe lại cảnh 2 của **Ngày 19** (meetup), cảnh 1 của **Ngày 21** (khách sạn), cảnh 2 của **Ngày 22** (mặc cả với chủ cabin), cảnh 3 của **Ngày 23** (thông báo và lời kể lại), cảnh 3 của **Ngày 24** (bữa tối). Mỗi cảnh 2 lần, lần 2 bật lời thoại và nhắc lại từng câu thành tiếng. Làm lại Phần 1 sau một ngày.',
          '**Trượt Mẫu câu**: mỗi câu sai ghi một (Ngày N). Mở bài **Nói** ngày đó, đọc lại bảng **ba mức lịch sự**, rồi làm phần "Nhập vai với Gia sư AI" của ngày đó một lượt.',
          '**Trượt Ngữ pháp**: mở mục **🧱 Câu này ghép thế nào** của ngày có câu sai. Hay nhầm nhất ở chặng này: **used to / Did you use to** (Ngày 19), **is made from / was built** (Ngày 20), **should have + V3** (Ngày 21), **If + quá khứ, could** (Ngày 22), **lùi thì khi kể lại** (Ngày 23), **would it be okay if + quá khứ** (Ngày 24).',
          '**Trượt Viết**: làm lại phần **Tập viết** của bài Viết Ngày 22 và 24, rồi viết 3 tin thật trong tuần này: một tin xin kết nối sau một buổi gặp, một tin chữa một câu bị hiểu lầm, một tin góp ý thật cho bạn bè.',
          'Chỉ làm lại **phần trượt**, không cần làm lại cả bài. Đạt rồi thì sang Ngày 25, đừng đợi điểm tuyệt đối.',
        ],
      },
    ],
  },
];
