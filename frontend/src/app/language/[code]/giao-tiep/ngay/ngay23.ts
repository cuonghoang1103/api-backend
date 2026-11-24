/**
 * Tiếng Anh giao tiếp — NGÀY 23 (chặng 4 "Giao tiếp sâu", B1+ → B2): chuyện thời sự — kể lại tin và bình luận.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd23-`.
 * Ngữ pháp trong câu: tường thuật khi kể tin (S + said (that) + lùi thì · told + O + (not) to V · asked if / wh-…)
 * · KHÔNG lùi thì khi nguồn còn đó (The article says… · They're saying…) · gắn "nhãn độ chắc": apparently · it seems
 * · according to · supposedly. Nối câu: mind you · then again · to be fair.
 * Cảnh: Khải — sinh viên IT năm 3 đang OJT ở Copperleaf, một công ty phần mềm tại Đà Nẵng — trong tuần có tin bão:
 * sáng thứ Hai ở pantry ba người kể ba phiên bản khác nhau của cùng một tin (nhóm chat người nước ngoài, một bài báo,
 * dự báo chính thức) và mẹ Khải gọi điện từ quê; bữa trưa có tiêu đề "giá cà phê gấp đôi" mà bài báo nói khác hẳn, và tin
 * "điện thoại sạc đầy trong hai phút"; chiều thứ Ba Khải nghe quản lý văn phòng thông báo rồi kể lại cho trưởng nhóm đang
 * làm ở nhà (tường thuật đủ kiểu: câu kể, câu bảo, câu hỏi).
 * Tin trong bài là loại chung chung (bão, giá cả, công nghệ, thể thao), KHÔNG có sự kiện thật có tên người, ngày tháng.
 * Khác podcast en-c1-01 (AI có làm ta lười nghĩ — phỏng vấn nhà tâm lý học) và en-ds-b1-02 (thời tiết để mở chuyện ở trạm
 * xe buýt): hôm nay là KỂ LẠI tin, nói rõ tin chắc tới đâu, hỏi nguồn, và đọc tiêu đề báo.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ, bản tin đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_23: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd23-nghe',
    kind: 'listening',
    title: 'Chuyện thời sự: kể lại tin và bình luận',
    goal: 'Nghe hiểu ba cảnh người ta kể tin cho nhau ở công ty: ai nói, nghe từ đâu, chắc tới mức nào; nhận ra tin đồn, tiêu đề phóng đại và lời kể lại một thông báo.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay: một tin, ba phiên bản',
        items: [
          'Ngày 19–22 bạn đã ra ngoài công ty: networking, đón khách, phàn nàn, thương lượng. Hôm nay là thứ người ta nói ở bàn cà phê mỗi sáng: **chuyện thời sự**.',
          'Bạn theo **Khải**, sinh viên IT năm 3 đang OJT ở **Copperleaf**, một công ty phần mềm tại Đà Nẵng, trong tuần có **tin bão**. Mỗi người trong văn phòng nghe tin từ một nguồn, và mỗi nguồn nói một kiểu.',
          'Bạn cần nghe ra ba thứ: **tin là gì**, **ai nói / đọc ở đâu**, và **người kể chắc tới mức nào**. Người bản xứ luôn gắn "nhãn độ chắc" vào tin: **apparently, it seems, I read that, according to…**',
          'Cảnh 3 có một thông báo **gốc** rồi một lời **kể lại**. So hai bản là thấy ngay ngữ pháp tường thuật của hôm nay: is → was, can → could, "Take your laptops" → told us to take…',
          'Tốc độ khoảng **165 từ/phút**. Câu dễ không có dịch. Nghe mỗi cảnh **2 lần**: lần 1 ghi ra giấy "tin gì · nguồn nào · chắc không", lần 2 mở lời thoại.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Sáng thứ Hai ở pantry: ba phiên bản của một cơn bão' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'cloud-with-lightning-and-rain', 'mobile-phone', 'man-technologist', 'woman-office-worker', 'soccer-ball'],
        caption: '8 giờ 40 sáng thứ Hai. **Malik** (người Anh, thiết kế), **Freya** (người Úc, trưởng nhóm của Khải) và **Khải** đứng chờ máy pha cà phê. Malik còn đang tiếc trận bóng đêm qua thì Freya mở điện thoại ra với một tin "nóng".',
      },
      {
        t: 'listen',
        id: 'gtd23-nghe-canh1',
        title: 'Scene 1 — Monday morning by the coffee machine',
        note: 'Nghe xem: Freya nghe tin ở đâu và tin đó nói gì; Malik đọc thấy gì; nguồn chính thức nói gì; mẹ Khải dặn gì.',
        lines: [
          { who: 'Malik', voice: 'uk-nam', text: 'Morning. Did either of you catch the match last night?', vi: 'Chào. Có ai xem trận đêm qua không?' },
          { who: 'Khải', voice: 'us-nam', text: 'Only the first half, I\'m afraid. I fell asleep on the sofa. Who won?' },
          { who: 'Malik', voice: 'uk-nam', text: "We lost. Two–one, in the last minute. Don't ask.", vi: 'Đội tôi thua. Hai–một, ở phút cuối. Đừng hỏi nữa.' },
          { who: 'Freya', voice: 'au-nu', text: "Forget the football. Have you seen this? Apparently there's a massive storm heading straight for us.", vi: 'Quên bóng đá đi. Hai người thấy cái này chưa? Nghe nói có một cơn bão cực lớn đang lao thẳng về phía mình.' },
          { who: 'Khải', voice: 'us-nam', text: 'Really? Where did you hear that?' },
          { who: 'Freya', voice: 'au-nu', text: "It's all over the expat group. Someone said the airport would be closed for three days.", vi: 'Nhóm chat người nước ngoài nói ầm lên. Có người bảo sân bay sẽ đóng cửa ba ngày.' },
          { who: 'Malik', voice: 'uk-nam', text: "Hang on, that's not what I read. The article I saw said it was going to hit further north, and probably not until Thursday.", vi: 'Khoan, tôi đọc thấy khác. Bài báo tôi xem nói nó sẽ đổ bộ xa hơn về phía bắc, và chắc phải tới thứ Năm.' },
          { who: 'Khải', voice: 'us-nam', text: "Let me check the official forecast… Okay. According to the national weather service, it's a tropical storm now, not a typhoon. It seems it weakened overnight.", vi: 'Để em xem dự báo chính thức… Rồi. Theo cơ quan khí tượng quốc gia, giờ nó là bão nhiệt đới thôi, không còn là siêu bão. Hình như nó đã yếu đi trong đêm.' },
          { who: 'Freya', voice: 'au-nu', text: "Oh. So the airport's not closing?" },
          { who: 'Khải', voice: 'us-nam', text: "Not as far as I can tell. They're saying heavy rain from Wednesday night and strong winds along the coast. Nothing about the airport.", vi: 'Theo những gì em thấy thì không. Họ nói mưa to từ đêm thứ Tư và gió mạnh dọc bờ biển. Không có gì về sân bay cả.' },
          { who: 'Freya', voice: 'au-nu', text: "Well, that's a relief. I've got friends flying in on Friday.", vi: 'Ôi, nhẹ cả người. Tôi có bạn bay tới vào thứ Sáu.' },
          { who: 'Malik', voice: 'uk-nam', text: "Mind you, I wouldn't trust that group for anything. Last month someone there claimed all the beaches were closed for the summer. They weren't.", vi: 'Mà nói thật, tôi chẳng tin nhóm đó chuyện gì. Tháng trước có người trong đó khẳng định mọi bãi biển đóng cửa cả mùa hè. Làm gì có.' },
          { who: 'Khải', voice: 'us-nam', text: 'My mum rang this morning, actually. She said people in her village were already moving things upstairs, just in case.', vi: 'Sáng nay mẹ em cũng gọi. Mẹ bảo người trong làng đã chuyển đồ lên tầng trên rồi, phòng khi có chuyện.' },
          { who: 'Freya', voice: 'au-nu', text: 'Is her village near the river?' },
          { who: 'Khải', voice: 'us-nam', text: "Pretty close, yeah. It floods most years, so they don't take any chances. She told me not to ride my motorbike if the wind gets bad.", vi: 'Khá gần ạ. Năm nào cũng ngập nên mọi người không dám chủ quan. Mẹ dặn em đừng đi xe máy nếu gió to.' },
          { who: 'Malik', voice: 'uk-nam', text: "Sensible woman. To be honest, I'd listen to her over the expat group any day.", vi: 'Mẹ cậu chí lý. Nói thật, tôi tin mẹ cậu hơn cái nhóm chat kia nhiều.' },
          { who: 'Freya', voice: 'au-nu', text: "Fair enough. I'll stop spreading panic, then.", vi: 'Công nhận. Vậy tôi thôi gieo hoảng loạn nhé.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd23-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Freya nghe tin "sân bay đóng cửa ba ngày" ở đâu?',
            options: ['Trên bản tin truyền hình', 'Trong nhóm chat của người nước ngoài ở thành phố', 'Từ cơ quan khí tượng', 'Từ mẹ của Khải'],
            correct: 1,
            why: '"It\'s **all over the expat group**. **Someone said** the airport would be closed…" — "someone" là một người không rõ ai. Nguồn yếu nhất trong cả cảnh.',
          },
          {
            q: 'Theo nguồn chính thức Khải kiểm tra, tình hình thế nào?',
            options: ['Siêu bão sẽ đổ bộ sáng thứ Hai', 'Bão đã yếu đi; mưa to từ đêm thứ Tư, gió mạnh ven biển, không nói gì về sân bay', 'Sân bay đóng cửa từ thứ Sáu', 'Không có bão nào cả'],
            correct: 1,
            why: '"**According to** the national weather service, it\'s a tropical storm now… **It seems** it weakened overnight… heavy rain from Wednesday night… Nothing about the airport."',
          },
          {
            q: 'Malik nói "Mind you, I wouldn\'t trust that group for anything." Từ "Mind you" làm gì trong câu?',
            options: ['Nhắc Freya phải chú ý', 'Thêm một ý ngược lại / dè dặt sau câu vừa rồi, kiểu "mà nói thật…"', 'Xin lỗi Freya', 'Đổi sang chuyện bóng đá'],
            correct: 1,
            why: '**Mind you** (hay dùng ở Anh) = "nhưng mà, phải nói thêm là…": đưa thêm một ý làm nhẹ hoặc đi ngược ý trước. Không có nghĩa "hãy để ý".',
          },
          {
            q: 'Mẹ Khải dặn gì?',
            options: ['Về quê ngay', 'Đừng đi xe máy nếu gió to', 'Mang máy tính về nhà', 'Đừng tin tin trên mạng'],
            correct: 1,
            why: '"She **told me not to ride** my motorbike if the wind gets bad." — câu dặn "Đừng…" khi kể lại thành **told + O + not to + V**.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Bữa trưa: tiêu đề nói một đằng, bài báo nói một nẻo' },
      {
        t: 'canh',
        anh: ['fork-and-knife-with-plate', 'newspaper', 'chart-increasing', 'hot-beverage', 'mobile-phone', 'face-with-monocle'],
        caption: '12 giờ 15. **Skye** (người Canada, kiểm thử) vừa ăn vừa lướt tin thì kêu lên. Khải có một thói quen bị cả nhóm trêu: tin gì cũng mở ra **đọc hết bài**, không dừng ở tiêu đề.',
      },
      {
        t: 'listen',
        id: 'gtd23-nghe-canh2',
        title: 'Scene 2 — Lunch, headlines and a miracle phone',
        note: 'Nghe xem: tiêu đề nói gì và bài báo thật ra nói gì; tin về chiếc điện thoại chắc tới đâu; ai tin, ai không tin.',
        lines: [
          { who: 'Skye', voice: 'ca-nu', text: 'Oh no. Have you seen this? "Coffee prices to double." That\'s it, I\'m switching to tea.', vi: 'Ôi không. Thấy cái này chưa? "Giá cà phê sắp tăng gấp đôi." Thôi xong, tôi chuyển sang uống trà.' },
          { who: 'Khải', voice: 'us-nam', text: "Double? Can I see? Hmm. The headline says double, but the article's a bit different." },
          { who: 'Skye', voice: 'ca-nu', text: 'Different how?' },
          { who: 'Khải', voice: 'us-nam', text: 'It says bean prices on the world market have gone up a lot this year, and that some cafés might put their prices up by ten to twenty percent.', vi: 'Bài nói giá hạt trên thị trường thế giới năm nay tăng nhiều, và một số quán có thể tăng giá thêm mười đến hai mươi phần trăm.' },
          { who: 'Skye', voice: 'ca-nu', text: 'So not double at all.' },
          { who: 'Khải', voice: 'us-nam', text: 'No. One expert said prices could double if bad harvests continued for several more years. That\'s a big "if".', vi: 'Không. Có một chuyên gia nói giá có thể gấp đôi nếu mất mùa kéo dài thêm vài năm nữa. "Nếu" đó to lắm.' },
          { who: 'Malik', voice: 'uk-nam', text: 'Classic. The headline grabs the scariest word in the whole article and runs with it.', vi: 'Kinh điển. Tiêu đề chộp lấy chữ đáng sợ nhất cả bài rồi cứ thế mà giật.' },
          { who: 'Skye', voice: 'ca-nu', text: "Okay, crisis over. Oh, and have you heard about the phone that charges fully in two minutes?" },
          { who: 'Malik', voice: 'uk-nam', text: "Supposedly. My brother sent me the video. I'll believe it when I see it.", vi: 'Người ta bảo thế. Em trai tôi gửi video cho tôi rồi. Bao giờ tận mắt thấy tôi mới tin.' },
          { who: 'Khải', voice: 'us-nam', text: "I saw that too. It seems it's only a prototype in a lab. The company said it wouldn't be in shops for at least three years.", vi: 'Em cũng thấy tin đó. Hình như nó mới là mẫu thử trong phòng thí nghiệm. Công ty nói ít nhất ba năm nữa mới có bán.' },
          { who: 'Skye', voice: 'ca-nu', text: "Three years? By then my phone'll be in a museum." },
          { who: 'Malik', voice: 'uk-nam', text: 'Apparently the battery gets really hot, too. Or so the comments say.', vi: 'Nghe nói pin còn nóng ran nữa. Ít ra là phần bình luận nói vậy.' },
          { who: 'Khải', voice: 'us-nam', text: "I'd take the comments with a pinch of salt. Half of them haven't read the article.", vi: 'Em thì không tin hết phần bình luận đâu. Một nửa trong số đó còn chưa đọc bài.' },
          { who: 'Skye', voice: 'ca-nu', text: 'Says the only person in Đà Nẵng who reads every article to the end.', vi: 'Nói bởi người duy nhất ở Đà Nẵng đọc bài nào cũng tới dòng cuối.' },
          { who: 'Khải', voice: 'us-nam', text: 'Someone has to!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd23-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Bài báo về cà phê thật ra nói gì?',
            options: ['Giá cà phê ở mọi quán sẽ gấp đôi từ tháng sau', 'Giá hạt tăng nhiều; một số quán có thể tăng giá 10–20 %; gấp đôi chỉ là kịch bản xấu nhất', 'Cà phê sẽ hết hàng', 'Giá cà phê đang giảm'],
            correct: 1,
            why: '"some cafés **might** put their prices up by ten to twenty percent" — "prices **could** double **if** bad harvests continued…". Tiêu đề bỏ hết "might", "could", "if".',
          },
          {
            q: '"That\'s a big \'if\'." Khải muốn nói gì?',
            options: ['Câu đó sai ngữ pháp', 'Điều kiện đó khó xảy ra, nên đừng coi kết quả là chắc chắn', 'Chuyện đó rất quan trọng', 'Khải không hiểu bài'],
            correct: 1,
            why: '**a big if** = một điều kiện lớn, chưa chắc xảy ra. Dùng khi ai đó coi một kịch bản "nếu…" như sự thật.',
          },
          {
            q: 'Ai nghi ngờ tin chiếc điện thoại sạc hai phút ngay từ đầu, và nói bằng câu nào?',
            options: ['Skye: "Okay, crisis over."', 'Malik: "Supposedly… I\'ll believe it when I see it."', 'Khải: "Someone has to!"', 'Không ai nghi ngờ'],
            correct: 1,
            why: '**Supposedly** = "người ta bảo thế" kèm chút nghi ngờ; **I\'ll believe it when I see it** = chưa thấy tận mắt thì chưa tin. Khải thì kiểm tin và thấy đó chỉ là mẫu thử.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Chiều thứ Ba: nghe thông báo, rồi kể lại cho người vắng mặt' },
      {
        t: 'canh',
        anh: ['loudspeaker', 'office-building', 'umbrella-with-rain-drops', 'laptop', 'woman-office-worker', 'spiral-calendar'],
        caption: '2 giờ chiều thứ Ba. **Gideon** (người New Zealand, quản lý văn phòng) đứng giữa phòng thông báo về cơn bão. Freya làm ở nhà và họp cả chiều nên **không nghe được**. Lát sau Freya gọi video cho Khải.',
      },
      {
        t: 'listen',
        id: 'gtd23-nghe-canh3',
        title: 'Scene 3 — The announcement, then the retelling',
        note: 'Phần đầu là lời gốc của Gideon, phần sau là lời Khải kể lại. Nghe xem: toà nhà đóng lúc mấy giờ, thứ Năm có bắt buộc làm ở nhà không, Gideon dặn gì và hỏi gì.',
        lines: [
          { who: 'Gideon', voice: 'nz-nam', text: 'Sorry to interrupt, everyone. Quick update about the storm.' },
          { who: 'Gideon', voice: 'nz-nam', text: "Building management have just told me they're closing the building at three tomorrow afternoon.", vi: 'Ban quản lý toà nhà vừa báo tôi là họ sẽ đóng cửa toà nhà lúc ba giờ chiều mai.' },
          { who: 'Gideon', voice: 'nz-nam', text: "You can work from home on Thursday if the roads are flooded. You don't have to come in.", vi: 'Thứ Năm nếu đường ngập thì mọi người có thể làm ở nhà. Không bắt buộc phải lên văn phòng.' },
          { who: 'Gideon', voice: 'nz-nam', text: "Please take your laptops home tonight, and don't leave anything on the floor near the windows.", vi: 'Tối nay nhớ mang máy tính về, và đừng để đồ gì dưới sàn gần cửa sổ.' },
          { who: 'Gideon', voice: 'nz-nam', text: 'Does anyone need a lift home tomorrow? Let me know by lunchtime.', vi: 'Mai có ai cần đi nhờ xe về không? Báo tôi trước giờ trưa nhé.' },
          { who: 'Freya', voice: 'au-nu', text: "Hey, Khải. I've been in calls all afternoon. Did I miss anything?" },
          { who: 'Khải', voice: 'us-nam', text: "Yeah, actually. Gideon made an announcement about the storm. He said they were closing the building at three tomorrow afternoon.", vi: 'Có ạ. Anh Gideon vừa thông báo về cơn bão. Anh ấy nói toà nhà sẽ đóng cửa lúc ba giờ chiều mai.' },
          { who: 'Freya', voice: 'au-nu', text: "Three? That's early. Did he say why?" },
          { who: 'Khải', voice: 'us-nam', text: 'He said building management had told him. I guess they want everyone home before the rain starts.', vi: 'Anh ấy nói là ban quản lý toà nhà báo. Em đoán họ muốn mọi người về nhà trước khi mưa.' },
          { who: 'Freya', voice: 'au-nu', text: 'Makes sense. And Thursday? Do we have to work from home?' },
          { who: 'Khải', voice: 'us-nam', text: "No. He said we could work from home if the roads were flooded, but we didn't have to. So it's up to us.", vi: 'Không ạ. Anh ấy nói mình có thể làm ở nhà nếu đường ngập, nhưng không bắt buộc. Tuỳ mình chọn.' },
          { who: 'Freya', voice: 'au-nu', text: 'Okay, good to know. Anything else?' },
          { who: 'Khải', voice: 'us-nam', text: 'He told us to take our laptops home tonight, and not to leave anything on the floor near the windows.', vi: 'Anh ấy dặn mọi người tối nay mang máy tính về, và đừng để đồ dưới sàn gần cửa sổ.' },
          { who: 'Freya', voice: 'au-nu', text: "Mine's here with me, so that's fine. Oh, could you grab my headset from my desk? It's the blue one." },
          { who: 'Khải', voice: 'us-nam', text: 'Sure. Oh, and he asked if anyone needed a lift tomorrow. You have to tell him by lunchtime.', vi: 'Vâng ạ. À, anh ấy còn hỏi mai có ai cần đi nhờ xe không. Phải báo anh ấy trước giờ trưa.' },
          { who: 'Freya', voice: 'au-nu', text: "I'm fine, thanks. Honestly, I think they're being a bit over-cautious, but I suppose it's better to be safe than sorry.", vi: 'Chị không cần, cảm ơn em. Nói thật chị thấy họ hơi cẩn thận quá, nhưng thôi, cẩn thận vẫn hơn.' },
          { who: 'Khải', voice: 'us-nam', text: "That seems to be the general feeling. Nobody's complaining about going home early, anyway." },
          { who: 'Freya', voice: 'au-nu', text: 'Ha, I bet they\'re not. Thanks for filling me in, Khải. Stay dry!', vi: 'Ha, chắc chắn là không rồi. Cảm ơn em đã kể lại cho chị, Khải. Giữ người cho khô ráo nhé!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd23-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Toà nhà đóng cửa khi nào?',
            options: ['Ba giờ chiều nay', 'Ba giờ chiều mai (thứ Tư)', 'Cả ngày thứ Năm', 'Gideon chưa biết'],
            correct: 1,
            why: 'Gốc: "they\'re closing the building at three **tomorrow afternoon**". Khải kể lại: "He said they **were closing**…" — thì hiện tại tiếp diễn lùi thành quá khứ tiếp diễn.',
          },
          {
            q: 'Thứ Năm có bắt buộc làm ở nhà không?',
            options: ['Có, ai cũng phải ở nhà', 'Không bắt buộc: được làm ở nhà nếu đường ngập, tuỳ mỗi người', 'Phải lên văn phòng như thường', 'Chỉ trưởng nhóm được ở nhà'],
            correct: 1,
            why: 'Gốc: "You **can** work from home… You **don\'t have to** come in." Kể lại: "we **could** work from home… but we **didn\'t have to**". Nghe nhầm can / have to là hiểu sai cả thông báo.',
          },
          {
            q: 'Câu gốc của Gideon "Does anyone need a lift home tomorrow?" được Khải kể lại thế nào?',
            options: ['He said does anyone need a lift.', 'He asked if anyone needed a lift tomorrow.', 'He asked did anyone need a lift.', 'He told anyone a lift.'],
            correct: 1,
            why: 'Câu hỏi có / không khi kể lại: **asked if + S + V (lùi thì)**, không đảo trợ động từ, không còn dấu hỏi.',
          },
          {
            q: 'Freya nghĩ gì về quyết định đóng cửa sớm?',
            options: ['Rất đúng, phải đóng sớm hơn nữa', 'Hơi quá cẩn thận, nhưng thà cẩn thận còn hơn', 'Vô lý, chị sẽ phàn nàn', 'Không quan tâm'],
            correct: 1,
            why: '"I think they\'re being **a bit over-cautious**, but I suppose **it\'s better to be safe than sorry**." Bình luận có ý riêng nhưng nói mềm: I think… a bit… but I suppose…',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 8 câu khó' },
      {
        t: 'p',
        text: 'Hôm nay có nhiều **từ nhỏ đọc lướt** (that, to, had, were) và **âm cuối dính nhau** (asked if, told us, seems it\'s). Nghe kỹ những chỗ đó. Viết hoa, dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd23-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — kể tin nghe được', spell: "Apparently there's a massive storm heading straight for us.", answer: "Apparently there's a massive storm heading straight for us.", alt: ["Apparently, there's a massive storm heading straight for us.", 'Apparently there is a massive storm heading straight for us.'] },
          { label: 'Câu 2 — dẫn nguồn chính thức', spell: "According to the national weather service, it's a tropical storm now.", answer: "According to the national weather service, it's a tropical storm now.", alt: ['According to the national weather service, it is a tropical storm now.', "According to the National Weather Service, it's a tropical storm now."] },
          { label: 'Câu 3 — nói chắc vừa phải', spell: 'It seems it weakened overnight.', answer: 'It seems it weakened overnight.' },
          { label: 'Câu 4 — kể lại lời dặn', spell: 'She told me not to ride my motorbike if the wind gets bad.', answer: 'She told me not to ride my motorbike if the wind gets bad.' },
          { label: 'Câu 5 — nghi ngờ', spell: "I'd take the comments with a pinch of salt.", answer: "I'd take the comments with a pinch of salt.", alt: ['I would take the comments with a pinch of salt.'] },
          { label: 'Câu 6 — kể lại thông báo', spell: 'He said they were closing the building at three tomorrow afternoon.', answer: 'He said they were closing the building at three tomorrow afternoon.', alt: ['He said they were closing the building at 3 tomorrow afternoon.'] },
          { label: 'Câu 7 — kể lại câu hỏi', spell: 'He asked if anyone needed a lift tomorrow.', answer: 'He asked if anyone needed a lift tomorrow.' },
          { label: 'Câu 8 — cảm ơn người kể lại', spell: 'Thanks for filling me in.', answer: 'Thanks for filling me in.' },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Apparently, …', 'Tôi nghe nói vậy, **chưa chắc**, tôi không chịu trách nhiệm cho tin này.', 'Really? Where did you hear that?'],
          ['Supposedly, …', 'Người ta bảo thế, và **tôi hơi nghi**.', "Yeah, I'll believe it when I see it, too."],
          ["It's all over the group / social media.", 'Ai cũng chia sẻ. **Chưa nói gì** về chuyện đúng hay sai.', 'Is there anything official yet?'],
          ["That's not what I read.", 'Tôi đọc thấy khác. Phản bác nhẹ, không gay gắt.', 'Oh? What did you read?'],
          ['Not as far as I can tell.', 'Theo những gì tôi thấy thì không (có thể tôi chưa thấy hết).', 'Okay, good. Let me know if you hear anything.'],
          ['That\'s a big "if".', 'Điều kiện đó khó xảy ra, đừng coi là chắc.', "True. It's just a worst-case scenario."],
          ['…, or so they say.', 'Người ta nói thế (còn tôi không chắc).', 'Ha, we\'ll see.'],
          ['Better safe than sorry.', 'Cẩn thận thừa còn hơn hối hận.', 'Exactly.'],
          ['Thanks for filling me in.', 'Cảm ơn đã kể lại / cập nhật cho tôi.', 'No problem.'],
          ['Says the guy who…', 'Câu trêu: "nói vậy mà là người…". Thân mật, không phải chê thật.', '(cười) Someone has to!'],
        ],
        caption: 'Ba từ **apparently, supposedly, it seems** là "nhãn độ chắc". Nghe thấy chúng thì hiểu: người nói đang kể lại, không khẳng định.',
      },
      {
        t: 'note',
        title: 'Mẹo: nghe tin mà không kịp thì làm gì',
        items: [
          'Tin thời sự dày **số, ngày, tên nơi**. Đừng cố nghe hết. Bắt đủ **3 thứ**: chuyện gì · ở đâu · khi nào. Hỏi lại đúng chỗ thiếu bằng câu có hai lựa chọn: "Sorry, did you say **Wednesday or Thursday**?"',
          'Xin **ý chính** thay vì xin nhắc lại cả đoạn: "Sorry, what\'s **the gist**?" hoặc tự tóm lại rồi hỏi: "So basically, the building closes early tomorrow. Is that right?"',
          'Xin **nguồn để tự đọc**: "Could you send me the link?" Đọc chậm luôn dễ hơn nghe nhanh, và bạn tự kiểm được tin như Khải.',
          'Vào giữa câu chuyện mà không biết đang nói gì: "Sorry, I missed the beginning. What happened?" Người ta sẽ kể lại từ đầu, ngắn hơn.',
          'Nghe bản tin radio, TV: câu **đầu tiên** của mỗi tin thường đã chứa ý chính (ai, gì, ở đâu), phần sau chỉ là chi tiết. Lỡ câu đầu thì đợi tin tóm tắt cuối bản tin.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Bão nhiệt đới rất mạnh', 'Ít gặp; bão mạnh ở Anh được đặt tên kiểu "Storm + tên"', 'hurricane (Đại Tây Dương)', 'cyclone'],
          ['Bão mạnh ở Việt Nam, Philippines…', 'typhoon', 'typhoon', 'typhoon'],
          ['Cơ quan dự báo thời tiết', 'the Met Office', 'the National Weather Service', 'the Bureau (BOM)'],
          ['Bóng đá', 'football', 'soccer', 'soccer (footy thường là bóng bầu dục kiểu Úc)'],
          ['Tỉ số 2–0', 'two–nil', 'two–nothing · two to zero', 'two–nil'],
          ['Xăng', 'petrol', 'gas', 'petrol'],
          ['Đừng tin hết', 'take it with a pinch of salt', 'take it with a grain of salt', 'a pinch of salt'],
          ['Đi nhờ xe', 'a lift', 'a ride', 'a lift'],
        ],
        caption: 'typhoon, hurricane, cyclone là **cùng một loại bão**, chỉ khác vùng biển. Người Mỹ nghe "typhoon" vẫn hiểu, bạn không cần đổi từ.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-c1-01 · Is AI Making Us Think Less?** — vì sao tự nghĩ trước rồi mới hỏi máy; cùng tinh thần với thói quen "đọc hết bài" của Khải.',
          '**en-c1-02 · The Courage to Change Your Mind** — thiên kiến xác nhận: vì sao ta dễ tin tin hợp với điều mình đã nghĩ sẵn.',
          '**en-ds-b1-02 · Crazy Weather, Isn\'t It?** — thời tiết như cánh cửa mở chuyện với người lạ (mức dễ hơn, nghe để thả lỏng tai).',
          'Ba tập là ba chuyện khác với bài hôm nay. Nghe xong, thử kể lại nội dung một tập cho bạn bằng **He said that… / Apparently…**',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd23-noi',
    kind: 'speaking',
    title: 'Nói chắc vừa phải: I think, it seems, apparently',
    goal: 'Kể lại một tin trong 45 giây có dẫn nguồn và có "nhãn độ chắc", kể lại lời người khác bằng said / told / asked, hỏi nguồn mà không làm ai mất mặt, và bình luận ngắn gọn.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** để mở chuyện tin tức, kể tin, nói chắc tới đâu, hỏi nguồn, bình luận và cảm ơn người kể. Bấm loa, **nói to theo**.',
          '**Thang độ chắc**: cùng một tin, nói từ "chắc chắn" tới "nghe đồn" bằng câu khác nhau.',
          'Ngữ pháp: **kể lại lời người khác** (said that + lùi thì · told me to… · asked if…) và **khi nào KHÔNG lùi thì**. Ngày 21 bạn đã gặp I was told that…; hôm nay đủ ba loại câu: kể, bảo, hỏi.',
          'Cử chỉ khi kể tin: nhún vai, nhướn mày, đưa điện thoại cho người khác xem; và một cử chỉ "chúc may mắn" của phương Tây mà ở Việt Nam bị hiểu khác.',
          'Cuối bài: **kể một tin trong 45 giây** và nhập vai với Gia sư AI.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo thứ tự một cuộc nói chuyện về tin: **mở chuyện → kể tin + nguồn → nói chắc tới đâu → hỏi nguồn / nghi ngờ → bình luận → kết**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Did you see the news about…?', pos: 'phr', ipa: '/dɪdʒə ˈsiː ðə ˈnuːz əˌbaʊt/', vi: 'Bạn xem tin về… chưa?', ex: 'Did you see the news about the storm?', exVi: 'Bạn xem tin về cơn bão chưa?', more: '**the news** là danh từ số ít: The news **is** bad, không phải "the news are".', anh: 'newspaper' },
          { w: 'Have you heard about…?', pos: 'phr', ipa: '/həv ju ˈhɝːd əˌbaʊt/', vi: 'Bạn nghe chuyện… chưa?', ex: 'Have you heard about the phone that charges in two minutes?', exVi: 'Nghe chuyện cái điện thoại sạc hai phút chưa?' },
          { w: 'apparently', pos: 'adv', ipa: '/əˈpærəntli/', vi: 'nghe nói (là), hình như (tin nghe lại, chưa kiểm)', ex: "Apparently there's a big storm coming.", exVi: 'Nghe nói có một cơn bão lớn sắp tới.', more: 'Đứng **đầu câu** hoặc **cuối câu**: The airport\'s closing, apparently.' },
          { w: 'It seems (that)…', pos: 'phr', ipa: '/ɪt ˈsiːmz ðət/', vi: 'Có vẻ như…', ex: 'It seems it weakened overnight.', exVi: 'Có vẻ như nó đã yếu đi trong đêm.', more: 'Gần nghĩa: **It looks like…** (dựa vào thứ mình nhìn thấy).' },
          { w: 'according to + nguồn', pos: 'phr', ipa: '/əˈkɔːrdɪŋ tə/', vi: 'theo (nguồn nào đó)', ex: "According to the weather service, it's a tropical storm now.", exVi: 'Theo cơ quan khí tượng, giờ nó là bão nhiệt đới.', more: 'Chỉ dùng cho nguồn **bên ngoài**. Ý mình thì nói **In my opinion / I think**, không nói "according to me".' },
          { w: 'supposedly', pos: 'adv', ipa: '/səˈpoʊzɪdli/', vi: 'người ta bảo là (và mình hơi nghi)', ex: 'Supposedly it charges in two minutes.', exVi: 'Người ta bảo nó sạc trong hai phút.' },
          { w: 'I read somewhere that…', pos: 'phr', ipa: '/aɪ ˈred ˈsʌmwer ðət/', vi: 'Mình đọc ở đâu đó rằng…', ex: 'I read somewhere that coffee prices are going up.', exVi: 'Mình đọc đâu đó là giá cà phê đang tăng.', more: '**read** quá khứ đọc là /red/, giống màu đỏ.' },
          { w: "I'm not a hundred percent sure, but…", pos: 'phr', ipa: '/aɪm ˈnɑːt ə ˈhʌndrəd pərˈsent ˈʃʊr bət/', vi: 'Mình không chắc trăm phần trăm, nhưng…', ex: "I'm not a hundred percent sure, but I think the office closes at three.", exVi: 'Mình không chắc lắm, nhưng hình như văn phòng đóng lúc ba giờ.' },
          { w: 'As far as I know, …', pos: 'phr', ipa: '/əz ˈfɑːr əz aɪ ˈnoʊ/', vi: 'Theo mình biết thì…', ex: "As far as I know, the airport's still open.", exVi: 'Theo mình biết thì sân bay vẫn mở.' },
          { w: "Don't quote me on that.", pos: 'phr', ipa: '/ˈdoʊnt ˈkwoʊt mi ɑːn ˈðæt/', vi: 'Đừng lấy lời mình làm chắc nhé. (mình chỉ đoán)', ex: "I think it's on Thursday, but don't quote me on that.", exVi: 'Mình nghĩ là thứ Năm, nhưng đừng tin chắc lời mình nhé.' },
          { w: 'Not as far as I can tell.', pos: 'phr', ipa: '/ˈnɑːt əz ˈfɑːr əz aɪ kən ˈtel/', vi: 'Theo những gì mình thấy thì không.', ex: "Is the airport closing? — Not as far as I can tell.", exVi: 'Sân bay đóng à? — Theo mình thấy thì không.' },
          { w: 'Where did you hear that?', pos: 'phr', ipa: '/ˈwer dɪdʒə ˈhɪr ðæt/', vi: 'Bạn nghe tin đó ở đâu?', ex: 'Really? Where did you hear that?', exVi: 'Thật à? Bạn nghe ở đâu thế?', more: 'Nói với giọng **tò mò**, không phải tra hỏi. Thêm "Really?" ở trước cho mềm.' },
          { w: 'a reliable source', pos: 'n', ipa: '/ə rɪˈlaɪəbl ˈsɔːrs/', vi: 'nguồn đáng tin', ex: 'Is that from a reliable source?', exVi: 'Tin đó từ nguồn đáng tin không?', anh: 'magnifying-glass-tilted-left' },
          { w: 'headline', pos: 'n', ipa: '/ˈhedlaɪn/', vi: 'tiêu đề bài báo', ex: "The headline says double, but the article's different.", exVi: 'Tiêu đề nói gấp đôi, nhưng bài báo nói khác.', anh: 'newspaper' },
          { w: 'misleading', pos: 'adj', ipa: '/ˌmɪsˈliːdɪŋ/', vi: 'gây hiểu lầm', ex: 'That headline is really misleading.', exVi: 'Cái tiêu đề đó gây hiểu lầm thật.' },
          { w: 'clickbait', pos: 'n', ipa: '/ˈklɪkbeɪt/', vi: 'tiêu đề câu view', ex: "Don't worry, it's just clickbait.", exVi: 'Đừng lo, chỉ là tiêu đề câu view thôi.', anh: 'fishing-pole' },
          { w: 'go viral', pos: 'v', ipa: '/ɡoʊ ˈvaɪrəl/', vi: 'lan truyền chóng mặt trên mạng', ex: 'The video went viral overnight.', exVi: 'Video đó lan khắp mạng chỉ sau một đêm.', anh: 'mobile-phone' },
          { w: 'the forecast', pos: 'n', ipa: '/ðə ˈfɔːrkæst/', vi: 'dự báo (thời tiết)', ex: 'The forecast says heavy rain from Wednesday night.', exVi: 'Dự báo nói mưa to từ đêm thứ Tư.', more: 'heavy rain (mưa to) · strong winds (gió mạnh) · a heatwave (đợt nắng nóng) · flooding (ngập lụt)', anh: 'umbrella-with-rain-drops' },
          { w: 'go up / put up (prices) by…', pos: 'v', ipa: '/ɡoʊ ˈʌp · pʊt ˈʌp baɪ/', vi: '(giá) tăng / (ai đó) tăng giá thêm…', ex: 'Some cafés might put their prices up by ten percent.', exVi: 'Một số quán có thể tăng giá thêm mười phần trăm.', more: '**by** + mức tăng: go up **by** 10 %. Không nói "increase 10 %" khi nói.', anh: 'chart-increasing' },
          { w: "It's hard to say.", pos: 'phr', ipa: '/ɪts ˈhɑːrd tə ˈseɪ/', vi: 'Khó nói lắm.', ex: "Will prices really double? — It's hard to say.", exVi: 'Giá có gấp đôi thật không? — Khó nói lắm.' },
          { w: "It's too early to tell.", pos: 'phr', ipa: '/ɪts ˈtuː ˈɝːli tə ˈtel/', vi: 'Còn quá sớm để biết.', ex: "Will it hit the city? — It's too early to tell.", exVi: 'Nó có vào thành phố không? — Còn sớm quá, chưa biết được.' },
          { w: "I'd be surprised if…", pos: 'phr', ipa: '/aɪd bi sərˈpraɪzd ɪf/', vi: 'Mình sẽ ngạc nhiên nếu… (= mình nghĩ là không)', ex: "I'd be surprised if the airport actually closed.", exVi: 'Sân bay mà đóng thật thì mình ngạc nhiên đấy.', more: 'Cách nói "chắc là không" rất mềm.' },
          { w: "That's a big if.", pos: 'phr', ipa: '/ðæts ə ˈbɪɡ ˈɪf/', vi: '"Nếu" đó to lắm. (khó xảy ra)', ex: 'Prices could double if the bad weather continues. That\'s a big if.', exVi: 'Giá có thể gấp đôi nếu thời tiết xấu kéo dài. Mà "nếu" đó to lắm.' },
          { w: 'take it with a pinch of salt', pos: 'phr', ipa: '/ˈteɪk ɪt wɪð ə ˈpɪntʃ əv ˈsɔːlt/', vi: 'đừng tin hết', ex: "I'd take that with a pinch of salt.", exVi: 'Mình thì không tin hết chuyện đó đâu.', more: 'Mỹ: **a grain of salt**.', anh: 'salt' },
          { w: "That's a bit over the top.", pos: 'phr', ipa: '/ðæts ə ˈbɪt ˌoʊvər ðə ˈtɑːp/', vi: 'Hơi quá đà / phóng đại.', ex: 'Closing the airport for three days? That sounds a bit over the top.', exVi: 'Đóng sân bay ba ngày á? Nghe hơi quá.' },
          { w: 'better safe than sorry', pos: 'phr', ipa: '/ˈbetər ˈseɪf ðən ˈsɑːri/', vi: 'cẩn thận vẫn hơn', ex: "They're closing early, but better safe than sorry.", exVi: 'Họ đóng cửa sớm, nhưng cẩn thận vẫn hơn.' },
          { w: "What's your take on it?", pos: 'phr', ipa: '/ˈwʌts jər ˈteɪk ɑːn ɪt/', vi: 'Bạn thấy chuyện đó thế nào?', ex: "Everyone's talking about it. What's your take on it?", exVi: 'Ai cũng bàn chuyện đó. Bạn thấy sao?', more: 'Thân hơn: **Thoughts?** · Trang trọng hơn: **What\'s your view on this?**' },
          { w: 'Thanks for filling me in.', pos: 'phr', ipa: '/ˈθæŋks fər ˈfɪlɪŋ mi ˈɪn/', vi: 'Cảm ơn đã kể lại / cập nhật cho mình.', ex: 'I missed the meeting. Thanks for filling me in.', exVi: 'Mình lỡ buổi họp. Cảm ơn bạn đã kể lại.', more: 'Nhờ người khác kể: **Can you fill me in?**' },
        ],
      },

      { t: 'h', text: '2. Thang độ chắc: cùng một tin, sáu cách nói' },
      {
        t: 'p',
        text: 'Ở Việt Nam, tin trong nhóm chat hay được chuyển tiếp nguyên văn như sự thật. Trong tiếng Anh, người nói cẩn thận luôn cho người nghe biết **mình chắc tới đâu**. Nói tin đồn như sự thật, mà tin sai, thì lần sau người ta bớt tin bạn.',
      },
      {
        t: 'table',
        head: ['Độ chắc', 'Câu', 'Dùng khi'],
        rows: [
          ['Chắc chắn (≈ 100 %)', "The office **is** closing at three. It's been confirmed.", 'Tin chính thức, bạn đã thấy tận mắt.'],
          ['Khá chắc (≈ 80 %)', "I'm pretty sure it closes at three. · It'll **probably** close early.", 'Bạn nghe từ nguồn tốt nhưng chưa thấy văn bản.'],
          ['Có vẻ (≈ 60 %)', '**It seems** the storm has weakened. · **I think** it closes at three.', 'Bạn suy ra từ thông tin đang có.'],
          ['Có thể (≈ 40 %)', 'It **might** close early. · It **could** hit on Thursday.', 'Một khả năng, chưa ai biết.'],
          ['Nghe nói (không rõ)', '**Apparently** the airport is closing. · **I heard** that… · **Supposedly**, …', 'Bạn chỉ kể lại điều người khác nói.'],
          ['Gần như không', "**I doubt it.** · **I'd be surprised if** the airport closed.", 'Bạn nghĩ tin đó sai.'],
        ],
        caption: 'Hai dòng dưới cùng **không cần tranh cãi**: chỉ cần một từ (apparently, I doubt it) là người nghe hiểu bạn đứng ở đâu.',
      },
      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Mở chuyện tin', 'Did you see this?!', 'Did you see the news about the storm?', "I'm not sure if you've seen the news, but…"],
          ['Kể tin nghe lại', 'Apparently…', 'I read that…', 'According to + nguồn, …'],
          ['Hỏi nguồn', 'Says who?', 'Where did you hear that?', 'Do you know where that information came from?'],
          ['Nghi ngờ', "Yeah, right.", "I'm not so sure about that.", "I'd be a little cautious about that figure."],
          ['Bình luận', 'Crazy, huh?', "It's a bit worrying, isn't it?", "It's certainly something to keep an eye on."],
          ['Hỏi ý kiến', 'Thoughts?', "What's your take on it?", "What's your view on this?"],
          ['Không biết', 'No idea.', "It's hard to say.", "I'm afraid I don't know enough to comment."],
        ],
        caption: '"Says who?" và "Yeah, right." chỉ dùng với bạn rất thân. Nói với đồng nghiệp mới, hai câu này nghe như bạn đang **bắt bẻ**.',
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Kể tin = kể lại lời người khác. Có **ba loại** lời gốc: câu **kể** (They\'re closing…), câu **bảo** (Take your laptops…), câu **hỏi** (Does anyone need…?). Mỗi loại có một khung riêng. Ngày 21 bạn mới dùng loại đầu.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + said (that) + S + V (lùi một thì)',
            vi: 'Kể lại câu kể. Lời gốc ở hiện tại thì lùi về quá khứ; will → would, can → could.',
            examples: [
              { en: 'He said they were closing the building at three.', vi: 'Anh ấy nói họ sẽ đóng toà nhà lúc ba giờ.' },
              { en: "The company said it wouldn't be in shops for three years.", vi: 'Công ty nói ba năm nữa mới có bán.' },
              { en: 'She said people were already moving things upstairs.', vi: 'Mẹ nói mọi người đã chuyển đồ lên tầng.' },
            ],
          },
          {
            formula: 'S + told + O + (not) to + V',
            vi: 'Kể lại lời dặn, lời bảo. Có người nghe sau told; "Đừng…" thành not to.',
            examples: [
              { en: 'He told us to take our laptops home.', vi: 'Anh ấy dặn bọn mình mang máy tính về.' },
              { en: 'She told me not to ride my motorbike.', vi: 'Mẹ dặn mình đừng đi xe máy.' },
              { en: 'They told everyone to stay indoors.', vi: 'Họ bảo mọi người ở trong nhà.' },
            ],
          },
          {
            formula: 'S + asked + if / whether + S + V · S + asked + wh- + S + V',
            vi: 'Kể lại câu hỏi. Không đảo trợ động từ, không còn dấu hỏi.',
            examples: [
              { en: 'He asked if anyone needed a lift.', vi: 'Anh ấy hỏi có ai cần đi nhờ xe không.' },
              { en: 'Freya asked why the building was closing so early.', vi: 'Freya hỏi sao toà nhà đóng sớm thế.' },
              { en: 'Skye asked whether prices would really double.', vi: 'Skye hỏi giá có gấp đôi thật không.' },
            ],
          },
          {
            formula: 'The article / The forecast + says (that) + giữ nguyên thì',
            vi: 'Nguồn còn đó (bài báo, dự báo, thông báo dán trên tường) hoặc tin vẫn đúng ⇒ dùng says, không lùi thì.',
            examples: [
              { en: 'The article says some cafés might put their prices up.', vi: 'Bài báo nói một số quán có thể tăng giá.' },
              { en: "They're saying heavy rain from Wednesday night.", vi: 'Họ đang nói là mưa to từ đêm thứ Tư.' },
              { en: 'The sign says the lift is out of order.', vi: 'Biển ghi thang máy đang hỏng.' },
            ],
          },
          {
            formula: 'Apparently / It seems (that) / According to + nguồn, + câu',
            vi: 'Gắn "nhãn độ chắc" vào tin. Không cần said: bản thân từ đó đã cho biết bạn đang kể lại.',
            examples: [
              { en: "Apparently the airport's closing.", vi: 'Nghe nói sân bay sắp đóng.' },
              { en: 'It seems it weakened overnight.', vi: 'Có vẻ nó đã yếu đi trong đêm.' },
              { en: "According to the weather service, it's a tropical storm.", vi: 'Theo cơ quan khí tượng, đó là bão nhiệt đới.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Lời gốc', 'Kể lại (hôm sau)'],
        rows: [
          ["They're closing the building.", 'He said they **were** closing the building.'],
          ["It's a tropical storm.", "She said it **was** a tropical storm."],
          ["It won't be in shops for three years.", "They said it **wouldn't** be in shops…"],
          ['You can work from home.', 'He said we **could** work from home.'],
          ["You don't have to come in.", "He said we **didn't have to** come in."],
          ['Management have told me.', 'He said management **had** told him.'],
          ['Take your laptops home.', 'He told us **to take** our laptops home.'],
          ['Does anyone need a lift?', 'He asked **if anyone needed** a lift.'],
        ],
        caption: 'Lùi **một bước** về quá khứ, và đổi người: you → we/I, me → him. Nhưng nếu kể ngay lúc đó và tin vẫn đúng, nói "He says they\'re closing at three" cũng hoàn toàn tự nhiên.',
      },
      {
        t: 'rule',
        formula: 'said (that) + lùi thì · told + O + (not) to V · asked if / wh- + S + V · says + giữ thì (nguồn còn đó)',
        vi: 'Kể lại lời người khác: chọn đúng khung theo loại câu gốc (kể, bảo, hỏi), rồi gắn apparently / it seems / according to để người nghe biết bạn chắc tới đâu.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: mind you · then again · to be fair',
        items: [
          '**Mind you, …** (hay nghe ở Anh): thêm một ý làm nhẹ hoặc đi ngược ý trước. "The forecast looks bad. **Mind you**, they said the same last year."',
          '**Then again, …**: "nhưng nghĩ lại thì…", tự cân nhắc phía bên kia. "Three years is a long time. **Then again**, phones change fast."',
          '**To be fair, …**: công bằng mà nói, bênh một bên vừa bị chê. "The headline was silly. **To be fair**, the article was quite good."',
          'Ba từ này giúp bình luận nghe **cân bằng**, không một chiều. Đặt ở đầu câu, ngắt nhẹ sau nó.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd23-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: 'said (that) + lùi thì · told + O + (not) to V · asked if · apparently / it seems / according to',
        items: [
          { q: 'Nghe nói giá xăng sắp tăng.', hint: 'apparently, petrol prices, go up', answers: ['Apparently petrol prices are going up.', 'Apparently, petrol prices are going up.', 'Apparently petrol prices are going to go up.', 'Apparently petrol prices are going to rise.', 'Apparently gas prices are going up.', 'Apparently, gas prices are going up.', 'Apparently fuel prices are going up.', 'Petrol prices are going up, apparently.'] },
          { q: 'Anh ấy nói văn phòng sẽ đóng cửa sớm.', hint: 'said, would / was closing', answers: ['He said the office would close early.', 'He said that the office would close early.', 'He said the office was closing early.', 'He said that the office was closing early.', 'He said the office would be closing early.'] },
          { q: 'Chị ấy dặn tôi đừng ra ngoài.', hint: 'told, not to', answers: ['She told me not to go out.', 'She told me not to go outside.'] },
          { q: 'Họ hỏi tôi có cần đi nhờ xe không.', hint: 'asked, if, needed a lift', answers: ['They asked me if I needed a lift.', 'They asked if I needed a lift.', 'They asked me whether I needed a lift.', 'They asked whether I needed a lift.', 'They asked me if I needed a ride.', 'They asked if I needed a ride.'] },
          { q: 'Theo dự báo, chiều nay sẽ mưa to.', hint: 'according to, forecast, heavy rain', answers: ["According to the forecast, there'll be heavy rain this afternoon.", 'According to the forecast, there will be heavy rain this afternoon.', "According to the forecast, it's going to rain heavily this afternoon.", 'According to the forecast, there is going to be heavy rain this afternoon.', "According to the forecast, there's going to be heavy rain this afternoon.", 'According to the forecast, it will rain heavily this afternoon.'] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 7 lỗi thật',
        items: [
          '~~According to me, the headline is wrong.~~ → **In my opinion / I think** the headline is wrong. "According to" chỉ dùng cho **nguồn bên ngoài** (the forecast, the article, my mum). Dịch thẳng "theo tôi" là sai.',
          '~~The news say the storm is coming.~~ → **The news says…** "news" là danh từ **số ít**, dù có chữ s ở cuối. Tương tự: "Is there any news?", không phải "Are there any news?".',
          '~~He asked me where was the meeting.~~ → He asked me **where the meeting was**. Câu hỏi khi kể lại **không đảo** (giống câu hỏi gián tiếp Ngày 15).',
          '~~He said me that the office closes.~~ → He **told me** that… / He **said** that… Có người nghe thì dùng **told**; "said" không đi thẳng với me / us.',
          '~~Prices will increase double.~~ → Prices **could double**. · Prices **will go up by 10 %**. "double" tự nó là động từ; mức tăng đi với **by**.',
          '~~I am not sure 100%.~~ → **I\'m not a hundred percent sure.** Con số đứng **trước** "sure", và khi nói đọc thành chữ.',
          '~~Apparently, I saw it on the official website.~~ → **I saw it on the official website.** Bạn tận mắt thấy thì không dùng "apparently". Từ này dành cho tin **nghe lại**, dùng sai làm tin chính thức nghe như tin đồn.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi kể tin' },
      {
        t: 'p',
        text: 'Khi kể tin, mặt và tay của bạn cũng nói "chắc tới đâu". Người nghe đọc cử chỉ nhanh hơn đọc chữ. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi kể và nghe tin',
        items: [
          { anh: 'person-shrugging', w: "Apparently. Don't quote me on that.", ro: '/əˈpærəntli ˈdoʊnt ˈkwoʊt mi ɑːn ˈðæt/', vi: 'Nhún vai nhẹ = "tôi chỉ kể lại, không chắc". Đi cùng apparently rất tự nhiên.' },
          { anh: 'face-with-raised-eyebrow', w: 'Supposedly.', ro: '/səˈpoʊzɪdli/', vi: 'Nhướn một bên mày = nghi ngờ. Không cần nói thêm, người nghe đã hiểu bạn không tin lắm.' },
          { anh: 'mobile-phone', w: 'Can I show you something?', ro: '/kən aɪ ˈʃoʊ ju ˈsʌmθɪŋ/', vi: 'Muốn đưa điện thoại cho người ta xem: **hỏi trước**, đưa ở tầm tay, đừng dí sát mặt. Đừng tự cầm điện thoại người khác để xem.' },
          { anh: 'raised-hand', w: "Hang on, that's not what I read.", ro: '/ˈhæŋ ɑːn ðæts ˈnɑːt wʌt aɪ ˈred/', vi: 'Giơ nửa bàn tay lên = "khoan đã". Giữ ngắn, kèm nụ cười, không chỉ tay vào người đang nói.' },
          { anh: 'grimacing-face', w: "Oof. That doesn't sound good.", ro: '/ʊf ðæt ˈdʌznt saʊnd ˈɡʊd/', vi: 'Nhăn mặt nhẹ khi nghe tin xấu = đồng cảm. Với tin có người bị thương, đừng cười dù là cười ngượng (xem bảng dưới).' },
          { anh: 'crossed-fingers', w: "Fingers crossed it's not too bad.", ro: '/ˈfɪŋɡərz ˈkrɔːst ɪts ˈnɑːt tuː ˈbæd/', vi: 'Bắt chéo ngón trỏ và ngón giữa: ở Anh, Mỹ, Úc = "cầu cho may mắn". Ở Việt Nam một số người coi cử chỉ này là **khiếm nhã**, nên với người Việt chỉ nói câu, đừng làm động tác.' },
          { anh: 'thinking-face', w: "Hmm. It's hard to say.", ro: '/ɪts ˈhɑːrd tə ˈseɪ/', vi: 'Chạm tay lên cằm, ngừng một nhịp = bạn đang nghĩ thật, không né câu hỏi.' },
          { anh: 'eyes', w: "Really? Where did you hear that?", ro: '/ˈrɪəli ˈwer dɪdʒə ˈhɪr ðæt/', vi: 'Hỏi nguồn mà vẫn nhìn người kia, mặt tò mò. Nhìn đi chỗ khác khi hỏi dễ bị hiểu là bạn đang coi thường tin của họ.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Chuyển tiếp tin chưa kiểm', 'Rất phổ biến trong nhóm Zalo, Facebook gia đình.', 'Vẫn có, nhưng ở công sở dễ bị hỏi lại "Source?". Nên kèm apparently hoặc link.', 'Thận trọng; ít khi bàn tin đồn ở chỗ làm.'],
          ['Cười khi kể tin xấu', 'Có người cười ngượng để giảm căng thẳng.', 'Dễ bị hiểu là **vô cảm**. Giữ mặt nghiêm, nói "That\'s awful."', 'Cũng có cười ngượng, nhưng chuyện buồn thì giữ im lặng, giọng nhỏ.'],
          ['Đưa điện thoại cho xem', 'Dí sát, kéo người kia lại gần.', 'Hỏi trước, giữ khoảng cách một sải tay (Ngày 1).', 'Hỏi trước, lịch sự, ít chạm.'],
          ['Tin chính trị, thiên tai có thương vong', 'Hay bàn sôi nổi, đùa cũng có.', 'Nói chung chung, **không đùa**. Không chắc thì chỉ hỏi "Is your family okay?"', 'Rất ít bàn ở chỗ làm.'],
        ],
        caption: 'Quy tắc dễ nhất: tin có người chịu thiệt thì **không đùa, không đoán**, chỉ hỏi thăm.',
      },

      { t: 'h', text: '7. Phát âm: said, asked, told và nhãn "apparently"' },
      {
        t: 'p',
        text: 'Ba lỗi hay gặp: đọc **said** thành /seɪd/ (đúng là /sed/), **nuốt mất âm cuối** của asked /æskt/ và told /toʊld/, và đọc **apparently** sai trọng âm (đúng: a-**PA**-rent-ly, 4 âm tiết). Câu nói chắc vừa phải thường **lên giọng nhẹ** ở từ nhãn, ngừng một nhịp, rồi mới vào tin.',
      },
      {
        t: 'phatam',
        id: 'gtd23-phat-am',
        title: 'Luyện phát âm — âm cuối của said / asked / told và ngữ điệu nói chắc vừa phải',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ rõ /d/, /kt/, /ld/ ở cuối từ; ngắt nhẹ sau apparently, according to…',
        items: [
          { text: "Apparently, there's a storm coming.", ipa: 'əpærəntli ðerz ə stɔːrm kʌmɪŋ', vi: 'a-PA-rent-ly · ngắt nhẹ sau dấu phẩy · storm có /r/ nhẹ kiểu Mỹ' },
          { text: 'It seems it weakened overnight.', ipa: 'ɪt siːmz ɪt wiːkənd oʊvərnaɪt', vi: 'seems‿it nối âm /z/ · weakened chỉ 2 âm tiết, /d/ cuối rất nhẹ' },
          { text: 'According to the forecast, it might rain.', ipa: 'əkɔːrdɪŋ tə ðə fɔːrkæst ɪt maɪt reɪn', vi: 'to đọc yếu /tə/ · FORE-cast nhấn âm đầu' },
          { text: 'He said they were closing at three.', ipa: 'hi sed ðeɪ wər kloʊzɪŋ ət θriː', vi: 'said = /sed/, không phải "xây-đ" · were đọc yếu /wər/ · three: /θ/ lưỡi giữa răng' },
          { text: 'She told me not to ride my bike.', ipa: 'ʃi toʊld mi nɑːt tə raɪd maɪ baɪk', vi: 'told có /ld/ cuối · not to: hai /t/ dính thành một nhịp' },
          { text: 'He asked if anyone needed a lift.', ipa: 'hi æskt ɪf eniwʌn niːdɪd ə lɪft', vi: 'asked‿if nối: "ás-típ" · needed có thêm âm tiết /ɪd/' },
          { text: "I'm not a hundred percent sure.", ipa: 'aɪm nɑːt ə hʌndrəd pərsent ʃʊr', vi: 'not‿a nối: "na-tơ" · per-CENT nhấn âm sau' },
          { text: "That's a big if.", ipa: 'ðæts ə bɪɡ ɪf', vi: 'nhấn mạnh vào "if" (nhấn tương phản) · big‿if nối âm /ɡ/' },
        ],
      },

      { t: 'h', text: '8. Kể một tin trong 45 giây' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Năm bước, 45 giây',
        caption: 'Bước 4 là thứ phân biệt người nói chuyện đáng tin với người "chuyển tiếp tin". Bước 5 trả lượt cho người nghe.',
        steps: [
          { label: 'Mở chuyện', sub: 'Did you see the news about…?' },
          { label: 'Tin + nguồn', sub: 'According to… / I read that…' },
          { label: 'Một chi tiết', sub: 'They said (that)… / He told people to…' },
          { label: 'Chắc tới đâu', sub: "It seems… · I'm not a hundred percent sure, but…" },
          { label: 'Bình luận + hỏi lại', sub: "I think it's… What's your take on it?" },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: 'Did you see the news about the heatwave next week?', vi: 'Bạn xem tin về đợt nắng nóng tuần sau chưa?' },
          { en: 'According to the forecast, it could reach thirty-nine degrees.', vi: 'Theo dự báo, nhiệt độ có thể lên tới ba mươi chín độ.' },
          { en: 'They said people should avoid going out in the middle of the day.', vi: 'Họ nói mọi người nên tránh ra ngoài giữa trưa.' },
          { en: "I'm not a hundred percent sure, but I think the company might let us start earlier.", vi: 'Mình không chắc lắm, nhưng hình như công ty có thể cho mình vào làm sớm hơn.' },
          { en: "Honestly, I think that's a good idea. What's your take on it?", vi: 'Thật lòng mình thấy vậy là hay. Bạn thấy sao?' },
        ],
      },
      {
        t: 'p',
        text: 'Đến lượt bạn: chọn **một tin bạn đọc tuần này** (thời tiết, giá cả, công nghệ, thể thao). Ghép năm bước, đọc to 2 lần có nhìn giấy, lần 3 **không nhìn**. Bấm giờ: dưới 45 giây là đạt.',
      },

      { t: 'h', text: '9. Nhập vai: ở quán cà phê làm việc chung' },
      {
        t: 'dialogue',
        title: 'Khải ngồi cạnh Nell, một nhà thiết kế tự do người Anh, ở quán cà phê có chỗ làm việc chung',
        lines: [
          { who: 'Nell', role: 'b', text: "Sorry, can I ask you something? Did you see they're expecting a heatwave next week?", vi: 'Xin lỗi, cho tôi hỏi chút. Bạn có thấy người ta dự báo đợt nắng nóng tuần sau không?' },
          { who: 'Khải', role: 'a', text: 'I did, yeah. According to the forecast, it could get up to thirty-nine degrees.', vi: 'Có ạ. Theo dự báo, nhiệt độ có thể lên tới ba mươi chín độ.' },
          { who: 'Nell', role: 'b', text: 'Thirty-nine! A friend told me the power might go off in some areas. Is that true?', vi: 'Ba mươi chín! Một người bạn bảo tôi có thể bị cắt điện ở vài khu. Thật không?' },
          { who: 'Khải', role: 'a', text: "Hmm, I'm not a hundred percent sure. Apparently it happened a few years ago, but I haven't seen anything official this time.", vi: 'Hừm, tôi không chắc lắm. Nghe nói vài năm trước có xảy ra, nhưng lần này tôi chưa thấy thông báo chính thức nào.' },
          { who: 'Nell', role: 'b', text: "Okay. I'll take it with a pinch of salt, then. Where do you usually check?", vi: 'Ừ. Vậy tôi không tin hết. Bạn thường xem tin ở đâu?' },
          { who: 'Khải', role: 'a', text: "The national weather service. The local groups are fun, but they're not always reliable.", vi: 'Cơ quan khí tượng quốc gia. Mấy nhóm địa phương thì vui, nhưng không phải lúc nào cũng đáng tin.' },
          { who: 'Nell', role: 'b', text: 'Good tip. And what do people here actually do in a heatwave?', vi: 'Mẹo hay đấy. Mà người ở đây thật ra làm gì khi nắng nóng?' },
          { who: 'Khải', role: 'a', text: 'Most people stay inside at midday. My mum always told me to drink water before I felt thirsty.', vi: 'Phần lớn ở trong nhà buổi trưa. Mẹ tôi lúc nào cũng dặn uống nước trước khi thấy khát.' },
          { who: 'Nell', role: 'b', text: "Sensible. Then again, this café's air conditioning is pretty good. I might just move in.", vi: 'Hợp lý. Mà nghĩ lại thì điều hoà quán này khá tốt. Chắc tôi dọn vào đây ở luôn.' },
          { who: 'Khải', role: 'a', text: "Ha! You won't be the only one. What's the weather like in England at the moment?", vi: 'Ha! Chị sẽ không phải người duy nhất đâu. Giờ thời tiết ở Anh thế nào ạ?' },
        ],
      },
      {
        t: 'build',
        id: 'gtd23-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu trả lời của Khải (5 câu)',
        items: [
          { vi: 'Nell: "Did you see the heatwave news?" → Bạn: Có. Theo dự báo, có thể lên tới ba mươi chín độ.', chips: ['According', 'to', 'the', 'forecast,', 'it', 'could', 'get', 'up', 'to', 'thirty-nine', 'degrees.', 'me,', 'will'], answer: ['According', 'to', 'the', 'forecast,', 'it', 'could', 'get', 'up', 'to', 'thirty-nine', 'degrees.'] },
          { vi: 'Nell: "Is that true?" → Bạn: Tôi không chắc trăm phần trăm.', chips: ["I'm", 'not', 'a', 'hundred', 'percent', 'sure.', '100%', 'sure', 'very'], answer: ["I'm", 'not', 'a', 'hundred', 'percent', 'sure.'] },
          { vi: '→ Bạn: Nghe nói chuyện đó xảy ra vài năm trước.', chips: ['Apparently', 'it', 'happened', 'a', 'few', 'years', 'ago.', 'happens', 'before'], answer: ['Apparently', 'it', 'happened', 'a', 'few', 'years', 'ago.'] },
          { vi: '→ Bạn: Mẹ tôi dặn tôi uống nước trước khi thấy khát.', chips: ['My', 'mum', 'told', 'me', 'to', 'drink', 'water', 'before', 'I', 'felt', 'thirsty.', 'said', 'drinking'], answer: ['My', 'mum', 'told', 'me', 'to', 'drink', 'water', 'before', 'I', 'felt', 'thirsty.'] },
          { vi: '→ Bạn: Bạn thấy chuyện đó thế nào?', chips: ["What's", 'your', 'take', 'on', 'it?', 'How', 'think', 'about'], answer: ["What's", 'your', 'take', 'on', 'it?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd23-noi-tra-loi',
        part: '1',
        questions: [
          'Have you seen any interesting news this week? Tell me about it.',
          'Where do you usually get your news from? Do you trust it?',
          'Has a news story ever turned out to be wrong after you believed it?',
          "What's your take on news that goes viral on social media?",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Nell, a friendly British freelance designer working in a co-working café in Da Nang. Start a conversation with me about a news story: a heatwave, rising prices, a new gadget or a football result (choose one and make up general details, no real names or dates). Sometimes repeat a rumour you heard from a friend, and see whether I ask where you heard it. Ask me to tell you something I heard or read this week. Speak naturally at B2 level, about 160 words per minute. When I state a rumour as a fact, gently ask \'Where did you hear that?\'. After 10 turns, tell me in Vietnamese how well I used apparently / it seems / according to and said / told / asked, with two concrete corrections."',
          'Làm **2 lượt**. Lượt hai bạn là người kể một tin đồn, AI là người hỏi nguồn; bạn phải tự sửa câu của mình từ "nói chắc" thành "nói chắc vừa phải".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd23-doc',
    kind: 'reading',
    title: 'Tin ngắn, tiêu đề báo — cách đọc',
    goal: 'Đọc hiểu tiêu đề báo tiếng Anh viết theo kiểu rút gọn, đọc nhanh năm bản tin ngắn, tách tin chắc khỏi phỏng đoán, và đổi một tiêu đề thành câu nói tự nhiên khi kể cho người khác.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Tiêu đề báo tiếng Anh có **"luật riêng"** (người ta gọi đùa là headlinese): bỏ a / the, bỏ be, dùng hiện tại cho việc đã xảy ra, dùng **to + V** cho việc sắp xảy ra.',
          'Đọc **năm tin ngắn** kiểu bản tin buổi sáng trên ứng dụng: thời tiết, giá cả, công nghệ, thể thao, giao thông.',
          'Tìm các chữ **giữ khoảng cách** trong bài: is expected to, could, said, according to. Tiêu đề hay bỏ mất chúng (như vụ "giá cà phê gấp đôi" của Skye).',
          'Cuối bài: đổi tiêu đề thành **câu nói** để kể lại ở bàn cà phê.',
        ],
      },

      { t: 'h', text: '1. Tám luật đọc tiêu đề' },
      {
        t: 'table',
        head: ['Luật', 'Tiêu đề', 'Câu đầy đủ'],
        rows: [
          ['Hiện tại đơn = việc **vừa xảy ra**', 'Storm hits central coast', 'A storm **has hit** the central coast.'],
          ['**to + V** = việc **sắp** xảy ra', 'Coffee prices to rise', 'Coffee prices **are going to** rise.'],
          ['V3 đứng một mình = **bị động**, bỏ be', 'Two hurt in bus crash', 'Two people **were hurt** in a bus crash.'],
          ['Bỏ a / the và be', 'New bridge open by spring', '**The** new bridge **will be** open by spring.'],
          ['Dấu phẩy = **and**', 'Rain, wind batter coast', 'Rain **and** wind have battered the coast.'],
          ['Dấu hai chấm = **ai đó nói**', 'Forecasters: more rain on the way', 'Forecasters **say** more rain is on the way.'],
          ['Ngoặc kép = **lời của người khác**, chưa phải sự thật', "Heatwave 'worst in a decade'", 'Someone **says** this heatwave is the worst in ten years.'],
          ['Danh từ chồng danh từ', 'City bus fare rise plan', 'A **plan** to **raise** bus fares in the city.'],
        ],
        caption: 'Đọc tiêu đề danh từ chồng nhau thì đọc **từ phải sang trái**: plan ← rise ← fare ← bus ← city.',
      },
      {
        t: 'table',
        head: ['Từ báo', 'Nghĩa trên tiêu đề', 'Câu nói thường'],
        rows: [
          ['hike', 'tăng (giá, thuế)', 'a price hike = prices go up'],
          ['slash', 'cắt giảm mạnh', 'slash prices = cut prices a lot'],
          ['soar', 'tăng vọt', 'costs soar = costs go up fast'],
          ['eye', 'đang tính tới', 'shops eye price rise = shops are thinking about raising prices'],
          ['bid', 'nỗ lực, cố gắng', 'in bid to = trying to'],
          ['set to', 'sắp', 'set to open = going to open soon'],
          ['axe', 'cắt bỏ, huỷ', 'axe a service = cancel a service'],
          ['probe', 'cuộc điều tra', 'probe into delays = an investigation into delays'],
          ['vow', 'hứa chắc', 'vow to fix = promise to fix'],
          ['sink · edge', '(thể thao) đánh bại · thắng sát nút', 'late goal sinks visitors = the visitors lost because of a late goal'],
        ],
        caption: 'Báo chọn từ **ngắn và mạnh** cho vừa dòng. Khi nói, đổi về từ thường ở cột phải; nói "slash" ngoài đời nghe như đang đọc báo.',
      },

      { t: 'h', text: '2. Đọc năm tin ngắn' },
      {
        t: 'canh',
        anh: ['newspaper', 'mobile-phone', 'cloud-with-lightning-and-rain', 'chart-increasing', 'soccer-ball', 'fuel-pump'],
        caption: 'Sáng thứ Tư, ứng dụng tin tức của Khải gửi **bản tin buổi sáng**. Mỗi tin một tiêu đề và hai, ba câu. Tên người, tên đội, tên công ty đều đã lược.',
      },
      {
        t: 'passage',
        title: 'Morning briefing',
        intro: 'Đọc tiêu đề trước, đoán nội dung, rồi đọc phần dưới để kiểm. Chỗ in đậm là cụm đáng nhớ.',
        paras: [
          {
            label: 'A',
            text: '**Tropical storm to bring heavy rain to central coast** — The storm, which weakened overnight, **is expected to** reach land late on Wednesday. Forecasters said some areas **could** see 200 to 300 mm of rain over two days. Residents in low-lying areas **have been advised to** move valuables to higher ground. **It is not yet clear whether** schools will close.',
          },
          {
            label: 'B',
            text: "**Cafés eye price hike as bean costs soar** — Wholesale coffee bean prices have risen sharply this year after poor harvests in several growing regions. A number of café owners told us they **were considering** raising prices **by up to** 20 percent. One analyst warned that prices **could** double 'in the worst case', but said this was 'unlikely in the short term'.",
          },
          {
            label: 'C',
            text: "**Two-minute phone charge 'years away', say researchers** — A video showing a phone battery charging fully in two minutes **went viral** this week. **According to** the research team, the battery is still a lab prototype and **is unlikely to** reach shops **for at least** three years. The team **denied** claims that the battery overheats.",
          },
          {
            label: 'D',
            text: '**Late goal sinks visitors in cup thriller** — A header in the final minute gave the home side a 2–1 win on Sunday night. The visitors **had led** for most of the second half. Their coach **said** the team was "gutted" but **vowed to** bounce back next week.',
          },
          {
            label: 'E',
            text: '**Fuel prices cut for second week running** — Petrol prices **were cut** again at midnight, the second fall **in a row**. The decrease is small, about two percent, and **experts say** prices **may** rise again **if** global oil costs go up.',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd23-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Tiêu đề A "Tropical storm **to bring** heavy rain…" cho biết mưa to…',
            options: ['đã xảy ra hôm qua', 'sắp xảy ra', 'đang xảy ra lúc này', 'chắc chắn không xảy ra'],
            correct: 1,
            why: '**to + V** trên tiêu đề = sắp xảy ra (= is going to bring). Bài viết cũng nói "**is expected to** reach land late on Wednesday".',
          },
          {
            q: 'Trong tin A, điều nào **chưa** được quyết định?',
            options: ['Cơn bão đã yếu đi', 'Có nên đóng cửa trường học không', 'Người dân vùng trũng được khuyên chuyển đồ', 'Bão vào đất liền tối thứ Tư'],
            correct: 1,
            why: '"**It is not yet clear whether** schools will close." = chưa rõ có đóng trường hay không. Gặp câu này là biết: chưa có quyết định.',
          },
          {
            q: '"Cafés **eye** price hike" nghĩa là gì?',
            options: ['Các quán đã tăng giá', 'Các quán đang tính tới chuyện tăng giá', 'Các quán phản đối tăng giá', 'Các quán theo dõi đối thủ'],
            correct: 1,
            why: 'Trên tiêu đề, **eye** = đang cân nhắc. Bài viết xác nhận: "they **were considering** raising prices".',
          },
          {
            q: 'Theo tin B, "giá gấp đôi" là…',
            options: ['điều chắc chắn sẽ xảy ra tháng sau', 'kịch bản xấu nhất mà chính chuyên gia nói là khó xảy ra trong ngắn hạn', 'giá đã gấp đôi rồi', 'lời của chủ quán'],
            correct: 1,
            why: '"could double \'**in the worst case**\', but said this was \'**unlikely in the short term**\'". Đây đúng là chỗ tiêu đề kiểu "Coffee prices to double" cắt bỏ.',
          },
          {
            q: 'Ngoặc kép trong tiêu đề C "Two-minute phone charge \'years away\'" báo hiệu gì?',
            options: ['Đó là tên sản phẩm', 'Đó là lời của nhóm nghiên cứu, báo chỉ trích lại', 'Báo đang mỉa mai', 'Đó là lỗi đánh máy'],
            correct: 1,
            why: 'Ngoặc kép trên tiêu đề = **lời của người khác**. Phần "say researchers" cho biết ai nói.',
          },
          {
            q: 'Trong tin C, nhóm nghiên cứu "**denied** claims that the battery overheats". Nghĩa là…',
            options: ['Họ xác nhận pin bị nóng', 'Họ bác bỏ tin pin bị quá nóng', 'Họ chưa trả lời', 'Họ không biết'],
            correct: 1,
            why: '**deny** = phủ nhận. Tin đồn "pin nóng ran" mà Malik đọc trong phần bình luận đã bị chính nhóm nghiên cứu bác bỏ.',
          },
          {
            q: 'Tin D: đội khách thua thế nào?',
            options: ['Thua đậm từ đầu trận', 'Dẫn trước gần hết hiệp hai rồi bị thua 1–2 bởi bàn thắng phút cuối', 'Thua trên chấm phạt đền', 'Hoà 2–2'],
            correct: 1,
            why: '"The visitors **had led** for most of the second half" và "A header in the final minute gave the home side a 2–1 win". **sinks** trên tiêu đề = làm đội đó thua.',
          },
          {
            q: 'Tin nào có giọng **chắc chắn nhất** (ít "could", "may", "expected")?',
            options: ['A — bão', 'B — giá cà phê', 'D — bóng đá', 'C — điện thoại'],
            correct: 2,
            why: 'Tin D kể kết quả **đã xảy ra** (gave, had led, said) nên không cần chữ giữ khoảng cách. Tin dự báo (A, B, C) luôn có could, expected, unlikely.',
          },
        ],
      },

      { t: 'h', text: '3. Cụm hay gặp trong tin ngắn' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Báo hiệu'],
        rows: [
          ['is expected to + V', 'được dự đoán là sẽ', 'Dự báo, chưa xảy ra'],
          ['could / may + V', 'có thể', 'Một khả năng'],
          ['is unlikely to + V', 'khó có khả năng', 'Gần như không'],
          ['It is not yet clear whether…', 'Chưa rõ có… hay không', 'Chưa có quyết định'],
          ['have been advised to + V', 'được khuyên nên', 'Lời khuyên chính thức, chưa bắt buộc'],
          ['according to + nguồn', 'theo…', 'Tin có nguồn'],
          ['X said / told us / warned / denied', 'X nói / nói với chúng tôi / cảnh báo / phủ nhận', 'Lời trích dẫn'],
          ['by up to 20 percent', 'tối đa 20 %', 'Mức trần, không phải mức chắc chắn'],
          ['for the second week running · in a row', 'tuần thứ hai liên tiếp', 'Xu hướng'],
          ['so far', 'cho tới giờ', 'Tin còn đang diễn ra'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc tin trong 30 giây',
        items: [
          '**Tiêu đề** cho bạn chủ đề, **câu đầu** cho bạn tin chính, **câu cuối** hay là điều còn chưa chắc. Ba chỗ đó là đủ để kể lại.',
          'Gạch chân **mọi chữ giữ khoảng cách** (could, may, expected, unlikely, according to). Tiêu đề càng giật, bài càng nhiều chữ này.',
          'Thấy **ngoặc kép** trên tiêu đề thì đọc là "có người nói…", không phải "báo khẳng định…".',
          'Thấy số kèm **up to** thì đó là mức cao nhất. "Up to 20 %" có thể chỉ là 5 % ở hầu hết các quán.',
        ],
      },

      { t: 'h', text: '4. Đổi tiêu đề thành câu nói' },
      {
        t: 'p',
        text: 'Ở bàn cà phê không ai nói bằng tiêu đề. Đổi về câu đầy đủ, thêm "nhãn độ chắc". Ví dụ: "Cafés eye price hike" → "**Apparently** some cafés **are thinking about** putting their prices up."',
      },
      {
        t: 'quiz',
        id: 'gtd23-doc-doi-cau',
        title: 'Viết lại tiêu đề thành câu đầy đủ (6 câu)',
        kind: 'translate',
        grammar: 'hiện tại → has + V3 / quá khứ · to + V → is / are going to · V3 → was / were + V3 · dấu phẩy → and',
        items: [
          { q: 'Storm hits coast', hint: 'a storm, has hit / hit', answers: ['A storm has hit the coast.', 'A storm hit the coast.', 'The storm has hit the coast.', 'The storm hit the coast.'] },
          { q: 'Bus fares to rise', hint: 'are going to', answers: ['Bus fares are going to rise.', 'Bus fares are going to go up.', 'Bus fares will rise.', 'Bus fares will go up.', 'Bus fares are set to rise.'] },
          { q: 'Three hurt in kitchen fire', hint: 'three people, were hurt', answers: ['Three people were hurt in a kitchen fire.', 'Three people have been hurt in a kitchen fire.', 'Three people were injured in a kitchen fire.', 'Three people have been injured in a kitchen fire.'] },
          { q: 'Coach quits after defeat', hint: 'the coach, has quit', answers: ['The coach has quit after a defeat.', 'The coach quit after a defeat.', 'The coach has quit after the defeat.', 'The coach quit after the defeat.', 'The coach has resigned after a defeat.', 'The coach resigned after the defeat.'] },
          { q: 'Rain, wind batter city', hint: 'and, have battered', answers: ['Rain and wind have battered the city.', 'Rain and wind battered the city.', 'Rain and wind are battering the city.'] },
          { q: "(Kể với đồng nghiệp, có nhãn) Cafés eye price hike", hint: 'apparently, thinking about, putting their prices up', answers: ['Apparently some cafés are thinking about putting their prices up.', 'Apparently, some cafés are thinking about putting their prices up.', 'Apparently some cafés are thinking about raising their prices.', 'Apparently, some cafés are thinking about raising their prices.', 'Apparently some cafés are thinking of putting their prices up.', 'Apparently some cafes are thinking about putting their prices up.', 'Apparently some cafés are considering raising their prices.'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd23-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 23',
    goal: 'Làm 34 câu có đáp án để kể lại tin bằng said / told / asked, gắn đúng "nhãn độ chắc", hỏi nguồn lịch sự, đọc tiêu đề báo, và ôn lại Ngày 19–22.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu.',
          'Có **5 câu ôn** Ngày 19–22 (ghi rõ trong câu). Sai câu ôn thì mở lại đúng ngày đó.',
          'Làm không nhìn bài. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 24.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd23-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn đọc trong nhóm chat là văn phòng sẽ đóng cửa cả tuần, nhưng chưa thấy thông báo chính thức. Bạn kể với đồng nghiệp:',
            options: ['The office is closed all week.', "Apparently the office is closing all week, but I haven't seen anything official.", 'According to me, the office closes.', 'The news say the office closes.'],
            correct: 1,
            why: 'Tin nghe lại + chưa kiểm ⇒ **Apparently** + nói rõ "chưa thấy gì chính thức".',
          },
          {
            q: 'Đồng nghiệp: "Prices are going to double!" Bạn muốn hỏi nguồn một cách lịch sự:',
            options: ['Says who?', 'You are wrong.', 'Really? Where did you hear that?', 'Prove it.'],
            correct: 2,
            why: '**Really? Where did you hear that?** — tò mò, không bắt bẻ. "Says who?" chỉ dùng với bạn thân.',
          },
          {
            q: 'Sếp hỏi: "Will the storm hit on Thursday?" Bạn không biết chắc. Câu hợp nhất:',
            options: ["Yes, definitely.", "It's too early to tell, but the forecast says it could.", 'I think not.', "I don't care."],
            correct: 1,
            why: 'Không chắc ⇒ **It\'s too early to tell** + dẫn nguồn + could. "I think not" nghe cổ và cứng.',
          },
          {
            q: 'Thông báo gốc: "You don\'t have to come in tomorrow." Bạn kể lại cho người vắng mặt:',
            options: ["He said we mustn't come in tomorrow.", "He said we didn't have to come in tomorrow.", "He said we don't have come.", 'He told we not come.'],
            correct: 1,
            why: '**don\'t have to** (không bắt buộc) → **didn\'t have to**. Đổi thành "mustn\'t" (cấm) là sai hẳn nghĩa.',
          },
          {
            q: 'Bạn lỡ một buổi họp, đồng nghiệp kể lại hết cho bạn. Bạn nói:',
            options: ['Thanks for filling me in.', 'Thanks for telling.', 'You are very informative.', 'Okay, enough.'],
            correct: 0,
            why: '**Thanks for filling me in** = cảm ơn đã cập nhật cho mình.',
          },
          {
            q: 'Một tiêu đề: "Shops to cut opening hours". Nghĩa là các cửa hàng…',
            options: ['đã giảm giờ mở cửa từ năm ngoái', 'sắp giảm giờ mở cửa', 'đang tranh cãi về giờ mở cửa', 'cắt giảm nhân viên'],
            correct: 1,
            why: '**to + V** trên tiêu đề = sắp xảy ra.',
          },
          {
            q: '(Ôn Ngày 19) Ở một meetup, người kia nói: "I used to be a chef." Câu hỏi nối tiếp hay nhất:',
            options: ['Okay.', 'What made you switch to tech?', 'Do you use to cook?', 'Chef is good job.'],
            correct: 1,
            why: 'Câu hỏi nối tiếp lấy đúng chi tiết vừa nghe: **What made you…?** (Ngày 19).',
          },
          {
            q: '(Ôn Ngày 20) Khách hỏi về bánh xèo. Câu giải thích đúng:',
            options: ['It makes from rice flour.', "It's made from rice flour and it's eaten with herbs.", 'It is make by rice.', 'It made rice flour.'],
            correct: 1,
            why: 'Bị động **is made from** · **is eaten with** (Ngày 20).',
          },
          {
            q: '(Ôn Ngày 21) Khách sạn hứa đổi phòng mà chưa đổi. Bạn nói với lễ tân:',
            options: ["I was told I'd be moved to a quieter room this morning.", 'You lie to me.', 'I tell you yesterday!', 'Why you not change?'],
            correct: 0,
            why: '**I was told (that)…** + lùi thì: kể lại lời hứa mà không đổ lỗi đích danh (Ngày 21).',
          },
          {
            q: '(Ôn Ngày 22) Bạn muốn đề xuất một phương án ở giữa khi hai bên chưa thống nhất:',
            options: ['Do it my way.', 'What if we met halfway and split the cost?', 'I win.', 'No discussion.'],
            correct: 1,
            why: '**What if we + V-ed…?** đưa đề xuất mềm, mở đường thương lượng (Ngày 22).',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd23-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: 'said · told · asked · if · was / were · would · could · according · apparently · seems',
        items: [
          { q: 'Gốc: "The building is closing early." → He said the building ___ closing early.', answers: ['was'] },
          { q: 'Gốc: "It will rain tonight." → She said it ___ rain tonight.', answers: ['would'] },
          { q: 'Gốc: "You can leave at two." → He said we ___ leave at two.', answers: ['could'] },
          { q: 'Gốc: "Don\'t park near the river." → They ___ us not to park near the river.', answers: ['told'] },
          { q: 'Gốc: "Is the airport open?" → She asked ___ the airport was open.', answers: ['if', 'whether'] },
          { q: '___ to the weather service, the storm has weakened.', answers: ['According', 'according'] },
          { q: 'It ___ the storm weakened overnight. (có vẻ như)', answers: ['seems'] },
          { q: '___, the phone charges in two minutes, but I don\'t believe it. (nghe nói)', answers: ['Apparently', 'apparently', 'Supposedly', 'supposedly'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd23-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: 'apparently · it seems · according to · said / told / asked · I\'m not a hundred percent sure',
        items: [
          { q: 'Bạn xem tin về đợt nắng nóng chưa?', hint: 'did you see, the news about, heatwave', answers: ['Did you see the news about the heatwave?', 'Have you seen the news about the heatwave?', 'Did you see the news about the heat wave?'] },
          { q: 'Mình không chắc trăm phần trăm, nhưng hình như cuộc họp bị huỷ rồi.', hint: "I'm not a hundred percent sure, I think, cancelled", answers: ["I'm not a hundred percent sure, but I think the meeting has been cancelled.", "I'm not a hundred percent sure, but I think the meeting was cancelled.", "I'm not 100% sure, but I think the meeting has been cancelled.", "I'm not a hundred percent sure, but I think the meeting's been cancelled.", "I'm not a hundred percent sure, but I think the meeting has been canceled.", "I'm not a hundred percent sure, but I think the meeting was canceled."] },
          { q: 'Chị ấy hỏi tôi tại sao văn phòng đóng cửa sớm.', hint: 'asked me why, the office was closing', answers: ['She asked me why the office was closing early.', 'She asked me why the office closed early.', 'She asked me why the office was closing so early.', 'She asked why the office was closing early.'] },
          { q: 'Đừng tin hết, đó chỉ là tiêu đề câu view thôi.', hint: 'take it with a pinch of salt, clickbait', answers: ["Take it with a pinch of salt. It's just clickbait.", "Take it with a pinch of salt, it's just clickbait.", 'Take it with a pinch of salt. It is just clickbait.', "Take it with a grain of salt. It's just clickbait.", "Don't believe it. It's just clickbait.", "Take it with a pinch of salt. It's only clickbait."] },
          { q: 'Anh ấy dặn chúng tôi mang máy tính về nhà.', hint: 'told us to', answers: ['He told us to take our laptops home.', 'He told us to take our computers home.', 'He told us to bring our laptops home.'] },
          { q: 'Bạn thấy chuyện đó thế nào?', hint: "what's your take", answers: ["What's your take on it?", "What's your take on that?", 'What is your take on it?', 'What do you make of it?', 'What do you think about it?'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd23-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "I'm not a hundred percent sure, but I think it's on Thursday.", answer: "I'm not a hundred percent sure, but I think it's on Thursday.", alt: ["I'm not 100% sure, but I think it's on Thursday.", 'I am not a hundred percent sure, but I think it is on Thursday.'] },
          { label: 'Câu 2', spell: 'The article says some cafés might put their prices up.', answer: 'The article says some cafés might put their prices up.', alt: ['The article says some cafes might put their prices up.'] },
          { label: 'Câu 3', spell: 'He told us not to leave anything near the windows.', answer: 'He told us not to leave anything near the windows.' },
          { label: 'Câu 4', spell: "I'd be surprised if the airport actually closed.", answer: "I'd be surprised if the airport actually closed.", alt: ['I would be surprised if the airport actually closed.'] },
          { label: 'Câu 5', spell: 'She asked whether prices would really double.', answer: 'She asked whether prices would really double.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd23-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Theo những gì mình thấy thì không.', chips: ['Not', 'as', 'far', 'as', 'I', 'can', 'tell.', 'know', 'so'], answer: ['Not', 'as', 'far', 'as', 'I', 'can', 'tell.'] },
          { vi: 'Anh ấy nói ban quản lý đã báo anh ấy.', chips: ['He', 'said', 'management', 'had', 'told', 'him.', 'me', 'has', 'say'], answer: ['He', 'said', 'management', 'had', 'told', 'him.'] },
          { vi: 'Có vẻ như nó chỉ là một mẫu thử.', chips: ['It', 'seems', "it's", 'only', 'a', 'prototype.', 'look', 'seem'], answer: ['It', 'seems', "it's", 'only', 'a', 'prototype.'] },
          { vi: 'Mà nói thật, họ cũng nói y như vậy năm ngoái.', chips: ['Mind', 'you,', 'they', 'said', 'the', 'same', 'last', 'year.', 'told', 'say'], answer: ['Mind', 'you,', 'they', 'said', 'the', 'same', 'last', 'year.'] },
          { vi: 'Tiêu đề đó gây hiểu lầm thật.', chips: ['That', 'headline', 'is', 'really', 'misleading.', 'mislead', 'title'], answer: ['That', 'headline', 'is', 'really', 'misleading.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Mở một ứng dụng tin tức bằng tiếng Anh, chọn **một tin thời tiết hoặc giá cả**. Đọc tiêu đề, đoán nội dung, rồi đọc câu đầu để kiểm.',
          'Kể lại tin đó thành tiếng trong **45 giây** theo năm bước của bài Nói. Có ít nhất một **according to** và một **said / told / asked**.',
          'Ngày 24 (cuối chặng 4): **khác biệt văn hoá** — nói thẳng hay nói vòng, đùa thế nào, và lỡ lời thì chữa ra sao. Sau đó là **Kiểm tra chặng 4**.',
        ],
      },
    ],
  },
];
