/**
 * Tiếng Anh giao tiếp — NGÀY 11 (chặng 2 "Đời sống", B1): kể chuyện đã xảy ra.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd11-`.
 * Ngữ pháp trong câu: quá khứ đơn (V-ed / bất quy tắc thông dụng · didn't + V · Did…?) · was / were
 * · nối câu bằng `first`, `then`, `after that`, `in the end` (+ suddenly, luckily).
 * Cảnh: Tùng — sinh viên IT năm 3 — thực tập ở một văn phòng tại Thủ Đức, TP.HCM, đồng nghiệp người Mỹ, Ireland, Canada, Anh.
 * Sáng thứ Hai kể chuyện mưa ngập đường Nguyễn Hữu Thọ, xe chết máy ("my bike died" bị hiểu là tai nạn); giờ trưa nghe Maeve
 * kể chuyện thuyền hỏng ở chợ nổi Cái Răng (người bán dứa kéo thuyền); chiều kể lại cho quản lý chuyện quên ba lô có laptop trên xe Grab.
 * Khác podcast en-cs-a2-01 (năm đầu xa nhà, mì gói, học nấu ăn), en-cs-b1-02 (tàu dừng, lỡ phỏng vấn, cốc trà),
 * en-b1-01 (lương đầu tiên): ở đây là kể chuyện xảy ra hôm qua, hôm kia, đúng trình tự, và cách NGƯỜI NGHE phản ứng.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_11: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd11-nghe',
    kind: 'listening',
    title: 'Kể chuyện đã xảy ra: trình tự & phản ứng người nghe',
    goal: 'Nghe ba câu chuyện kể lại trong một ngày ở văn phòng: theo kịp chuyện gì xảy ra trước, sau, kết thúc ra sao, và nghe ra người nghe phản ứng bằng câu gì.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Tùng**, sinh viên IT năm 3, thực tập ở một văn phòng tại **Thủ Đức, TP.HCM**. Hôm nay là thứ Hai, ai cũng có chuyện cuối tuần để kể.',
          'Từ Ngày 1 tới Ngày 10, phần lớn câu bạn nói là chuyện **bây giờ** hoặc **sắp tới**. Hôm nay là chuyện **đã xảy ra**: động từ đổi dạng (went, left, stopped) và câu chuyện có **trình tự**.',
          'Nghe ba thứ trong mỗi cảnh: **chuyện gì xảy ra trước**, **rồi sao**, **kết thúc thế nào**. Ghi ra giấy bằng mũi tên: mưa → trú → ngập → chết máy → …',
          'Nghe cả **người nghe**: họ chen "Uh-oh", "No way!", "Then what?". Kể chuyện bằng tiếng Anh là việc của hai người.',
          'Tốc độ đã nhanh hơn chặng 1 (khoảng 145 từ/phút). Ngày 6 bạn đã học **first, then** để chỉ đường; hôm nay thêm **after that, in the end** để kể chuyện.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Sáng thứ Hai: "my bike died"' },
      {
        t: 'canh',
        anh: ['cloud-with-rain', 'motor-scooter', 'water-wave', 'man-technologist', 'woman-technologist', 'hot-beverage'],
        caption: '9 giờ sáng thứ Hai. **Maddie**, trưởng nhóm kiểm thử người Mỹ, hỏi Tùng cuối tuần thế nào. Tùng kể chuyện tối Chủ nhật đi ăn ở nhà anh họ về thì gặp mưa ngập. Có một câu của Tùng làm Maddie hết hồn.',
      },
      {
        t: 'listen',
        id: 'gtd11-nghe-canh1',
        title: 'Scene 1 — A Monday morning story',
        note: 'Nghe xem Tùng làm gì đầu tiên khi trời mưa to, vì sao Maddie hoảng, và Tùng về nhà lúc mấy giờ.',
        lines: [
          { who: 'Maddie', voice: 'us-nu', text: 'Morning, Tung! How was your weekend?', vi: 'Chào Tùng! Cuối tuần của em thế nào?' },
          { who: 'Tùng', voice: 'us-nam', text: 'Long story. Saturday was fine, but Sunday evening was a disaster.', vi: 'Chuyện dài lắm chị. Thứ Bảy thì ổn, nhưng tối Chủ nhật là một thảm hoạ.' },
          { who: 'Maddie', voice: 'us-nu', text: 'Uh-oh. What happened?', vi: 'Ối. Chuyện gì thế?' },
          { who: 'Tùng', voice: 'us-nam', text: "I went to my cousin's place in District 7 for dinner. When I left, it was raining really hard.", vi: 'Em sang nhà anh họ ở Quận 7 ăn tối. Lúc em về thì trời đang mưa rất to.' },
          { who: 'Maddie', voice: 'us-nu', text: 'Oh, the rain last night was crazy. I heard it from my apartment.', vi: 'Ôi, trận mưa tối qua kinh khủng thật. Ở căn hộ chị còn nghe thấy.' },
          { who: 'Tùng', voice: 'us-nam', text: 'Yeah. First, I waited under an overpass for half an hour. Then I decided to just go home.', vi: 'Vâng. Đầu tiên em trú dưới cầu vượt nửa tiếng. Sau đó em quyết định cứ thế về nhà.' },
          { who: 'Tùng', voice: 'us-nam', text: 'But the street was completely flooded. The water came up to my knees, and my bike died.', vi: 'Nhưng đường ngập hết. Nước lên tới đầu gối, và xe em "chết".' },
          { who: 'Maddie', voice: 'us-nu', text: 'Oh my God! Were you okay? Did you fall?', vi: 'Trời ơi! Em có sao không? Em có bị ngã không?' },
          { who: 'Tùng', voice: 'us-nam', text: 'No, no, I was fine. I mean the engine died. It just stopped.', vi: 'Không, không ạ, em không sao. Ý em là máy chết. Nó tự tắt.' },
          { who: 'Maddie', voice: 'us-nu', text: 'Oh, phew! You mean it stalled. You scared me there. So what did you do?', vi: 'Ôi, may quá! Ý em là xe chết máy. Em làm chị hết hồn. Thế em làm gì?' },
          { who: 'Tùng', voice: 'us-nam', text: 'I pushed it for about a kilometre. After that, I found a guy who fixes bikes on the street.', vi: 'Em dắt xe khoảng một cây số. Sau đó em gặp một chú sửa xe ở ven đường.' },
          { who: 'Maddie', voice: 'us-nu', text: 'At ten o\'clock at night? In the rain?', vi: 'Lúc mười giờ đêm? Giữa trời mưa á?' },
          { who: 'Tùng', voice: 'us-nam', text: 'Yes! He was sitting under a big umbrella. He took out a small part, dried it, and the engine started again in five minutes.', vi: 'Vâng! Chú ấy ngồi dưới một cái ô to. Chú tháo một bộ phận nhỏ ra, lau khô, và năm phút sau máy nổ lại.' },
          { who: 'Maddie', voice: 'us-nu', text: 'No way! How much did he charge you?', vi: 'Không thể tin được! Chú ấy lấy em bao nhiêu?' },
          { who: 'Tùng', voice: 'us-nam', text: 'Only fifty thousand dong. I gave him a hundred. He really saved my night.', vi: 'Chỉ năm mươi nghìn. Em đưa chú một trăm. Chú ấy cứu cả buổi tối của em.' },
          { who: 'Maddie', voice: 'us-nu', text: "That's so sweet. So did you get home okay?", vi: 'Dễ thương quá. Thế em về nhà ổn chứ?' },
          { who: 'Tùng', voice: 'us-nam', text: "In the end, I got home at eleven, completely wet. And this morning I couldn't find dry shoes, so I'm wearing sandals.", vi: 'Cuối cùng em về tới nhà lúc mười một giờ, ướt sũng. Sáng nay em không tìm được đôi giày nào khô, nên em đi dép.' },
          { who: 'Maddie', voice: 'us-nu', text: "Ha! I wondered about the sandals. Well, I'm glad you're safe.", vi: 'Ha! Chị đang thắc mắc sao em đi dép. Thôi, em an toàn là chị mừng rồi.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd11-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Khi trời mưa to, Tùng làm gì ĐẦU TIÊN?',
            options: ['Dắt xe về nhà', 'Trú dưới cầu vượt nửa tiếng', 'Quay lại nhà anh họ', 'Gọi xe ôm công nghệ'],
            correct: 1,
            why: '"**First**, I waited under an overpass for half an hour. **Then** I decided to just go home." Nghe từ nối first, then là biết thứ tự.',
          },
          {
            q: 'Vì sao Maddie hỏi "Were you okay? Did you fall?"',
            options: ['Vì Tùng nói mình bị ngã', 'Vì "my bike died" làm chị tưởng Tùng gặp tai nạn', 'Vì Tùng đến muộn', 'Vì Tùng đi dép'],
            correct: 1,
            why: '"My bike **died**" nghe rất nặng, như xe nát sau tai nạn. Người bản xứ nói **my bike stalled** (chết máy) hoặc **broke down** (hỏng giữa đường). Maddie sửa lại: "You mean it stalled."',
          },
          {
            q: 'Chú sửa xe lấy bao nhiêu, Tùng đưa bao nhiêu?',
            options: ['Lấy 100.000, Tùng đưa 100.000', 'Lấy 50.000, Tùng đưa 100.000', 'Lấy 50.000, Tùng đưa 50.000', 'Không lấy tiền'],
            correct: 1,
            why: '"Only **fifty thousand** dong. I gave him **a hundred**." Tùng đưa dư để cảm ơn.',
          },
          {
            q: 'Câu chuyện kết thúc thế nào?',
            options: ['Tùng ngủ lại nhà anh họ', 'Tùng về nhà lúc 11 giờ, ướt sũng, sáng nay phải đi dép', 'Tùng về nhà lúc 10 giờ', 'Xe lại chết máy lần nữa'],
            correct: 1,
            why: '"**In the end**, I got home at eleven, completely wet." In the end mở ra phần kết của chuyện.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Giờ ăn trưa: chiếc thuyền hỏng ở chợ nổi' },
      {
        t: 'canh',
        anh: ['canoe', 'sunrise', 'pineapple', 'woman-office-worker', 'man-office-worker', 'fork-and-knife-with-plate'],
        caption: 'Giờ ăn trưa. **Maeve**, nhà thiết kế người Ireland, cuối tuần vừa đi Cần Thơ xem **chợ nổi Cái Răng**. Ngồi cùng bàn có Tùng và **Wes**, lập trình viên người Canada. Lần này Tùng là **người nghe**, và có một đoạn Tùng nghe không kịp.',
      },
      {
        t: 'listen',
        id: 'gtd11-nghe-canh2',
        title: 'Scene 2 — The floating market',
        note: 'Nghe xem chuyện gì xảy ra giữa sông, ai đã giúp, và tối hôm đó Maeve ăn tối ở đâu. Chú ý câu Tùng dùng khi lạc mạch chuyện.',
        lines: [
          { who: 'Wes', voice: 'ca-nam', text: 'So, Maeve, how was Can Tho? Did you see the floating market?', vi: 'Thế Maeve, Cần Thơ thế nào? Chị có xem chợ nổi không?' },
          { who: 'Maeve', voice: 'ie-nu', text: 'We did, eventually! But you won\'t believe what happened.', vi: 'Có, nhưng mãi mới tới! Mà mọi người không tin nổi chuyện gì đã xảy ra đâu.' },
          { who: 'Tùng', voice: 'us-nam', text: 'Oh no. What happened?', vi: 'Ôi không. Chuyện gì vậy chị?' },
          { who: 'Maeve', voice: 'ie-nu', text: 'So, we got up at half four, because the market starts really early. Then we took a little boat from the pier.', vi: 'Chuyện là, bọn chị dậy lúc bốn rưỡi, vì chợ họp rất sớm. Rồi bọn chị đi một chiếc thuyền nhỏ từ bến.' },
          { who: 'Maeve', voice: 'ie-nu', text: 'About twenty minutes later, the engine made a horrible noise and stopped. Right in the middle of the river.', vi: 'Khoảng hai mươi phút sau, máy kêu một tiếng kinh khủng rồi tắt. Ngay giữa sông.' },
          { who: 'Wes', voice: 'ca-nam', text: 'Seriously? What did the driver do?', vi: 'Thật á? Thế người lái làm gì?' },
          { who: 'Maeve', voice: 'ie-nu', text: 'He tried to fix it for ages. Nothing. Then a woman with a boat full of pineapples came past, and she shouted something to him.', vi: 'Chú ấy loay hoay sửa mãi. Không ăn thua. Rồi một cô chở đầy dứa trên thuyền đi ngang qua, và cô ấy gọi to gì đó với chú.' },
          { who: 'Tùng', voice: 'us-nam', text: 'Sorry, I lost you there. Was she the driver\'s friend, or just a stranger?', vi: 'Xin lỗi, đoạn này em không theo kịp. Cô ấy là bạn của người lái hay chỉ là người lạ ạ?' },
          { who: 'Maeve', voice: 'ie-nu', text: 'A total stranger! She tied a rope to our boat and pulled us all the way to the market.', vi: 'Người lạ hoàn toàn! Cô ấy buộc dây vào thuyền bọn chị rồi kéo cả đoạn tới chợ.' },
          { who: 'Wes', voice: 'ca-nam', text: "No way! That's amazing.", vi: 'Không thể nào! Tuyệt thật.' },
          { who: 'Maeve', voice: 'ie-nu', text: 'And of course after that, we felt we had to buy something from her. So we bought six pineapples.', vi: 'Và tất nhiên sau đó, bọn chị thấy phải mua gì đó của cô ấy. Thế là mua sáu quả dứa.' },
          { who: 'Tùng', voice: 'us-nam', text: 'Six! What did you do with six pineapples?', vi: 'Sáu quả! Chị làm gì với sáu quả dứa?' },
          { who: 'Maeve', voice: 'ie-nu', text: 'We ate one on the boat. She cut it for us with a huge knife. Best pineapple of my life.', vi: 'Bọn chị ăn một quả ngay trên thuyền. Cô ấy gọt cho bằng một con dao to tướng. Quả dứa ngon nhất đời chị.' },
          { who: 'Wes', voice: 'ca-nam', text: 'And the other five?', vi: 'Còn năm quả kia?' },
          { who: 'Maeve', voice: 'ie-nu', text: 'We gave them to the family at our homestay. In the end, they invited us to their dinner that night.', vi: 'Bọn chị biếu gia đình chủ homestay. Cuối cùng họ mời bọn chị ăn tối cùng nhà luôn tối hôm đó.' },
          { who: 'Tùng', voice: 'us-nam', text: 'So in a way, the broken engine was good luck.', vi: 'Vậy tính ra cái máy hỏng lại là may.' },
          { who: 'Maeve', voice: 'ie-nu', text: 'Totally. It was the best part of the whole trip.', vi: 'Đúng thế. Đó là đoạn hay nhất của cả chuyến đi.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd11-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao Maeve dậy lúc 4 giờ 30?',
            options: ['Vì phải ra sân bay', 'Vì chợ nổi họp rất sớm', 'Vì homestay ồn', 'Vì thuyền hỏng'],
            correct: 1,
            why: '"We got up at **half four**, because the market starts really early." **half four** (Anh, Ireland) = 4 giờ 30, không phải 3 rưỡi. Người Mỹ nói **four thirty**.',
          },
          {
            q: 'Ai kéo thuyền của Maeve tới chợ?',
            options: ['Người lái thuyền', 'Một người bạn của người lái', 'Một cô bán dứa không quen biết', 'Gia đình chủ homestay'],
            correct: 2,
            why: 'Tùng hỏi lại cho chắc, Maeve đáp: "**A total stranger!** She tied a rope to our boat and pulled us…"',
          },
          {
            q: 'Câu "Sorry, I lost you there" của Tùng có tác dụng gì?',
            options: ['Xin lỗi vì đến muộn', 'Báo mình lạc mạch chuyện, rồi hỏi đúng chỗ chưa rõ', 'Nói mình bị lạc đường', 'Đổi sang chủ đề khác'],
            correct: 1,
            why: '**I lost you there** = tôi theo không kịp đoạn vừa rồi. Tùng nói ngay sau đó chỗ mình chưa rõ (bạn hay người lạ), nên Maeve chỉ cần trả lời một ý rồi kể tiếp.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Buổi chiều: kể cho quản lý nghe chuyện chiếc ba lô' },
      {
        t: 'canh',
        anh: ['office-building', 'man-office-worker', 'man-technologist', 'backpack', 'laptop', 'oncoming-taxi'],
        caption: '3 giờ chiều. **Graham**, quản lý dự án người Anh, nghe Wes kể rằng tối thứ Sáu Tùng suýt mất chiếc laptop của công ty. Graham gọi Tùng vào hỏi chuyện. Lần này kể chuyện không phải để vui: phải **đúng thứ tự** và **rõ ràng**.',
      },
      {
        t: 'listen',
        id: 'gtd11-nghe-canh3',
        title: 'Scene 3 — Telling the manager',
        note: 'Nghe xem Tùng để quên ba lô ở đâu, Tùng làm hai việc gì theo thứ tự nào, và Graham phản ứng ra sao.',
        lines: [
          { who: 'Graham', voice: 'uk-nam', text: 'Tung, have you got a minute? Wes said something happened with your laptop on Friday.', vi: 'Tùng, em rảnh một phút không? Wes bảo tối thứ Sáu có chuyện gì đó với laptop của em.' },
          { who: 'Tùng', voice: 'us-nam', text: "Yes, sorry. I wanted to tell you this morning. It's fine now, but I nearly lost it.", vi: 'Vâng, em xin lỗi. Em định báo anh sáng nay. Giờ thì ổn rồi, nhưng em suýt làm mất nó.' },
          { who: 'Graham', voice: 'uk-nam', text: 'Right. Tell me from the beginning.', vi: 'Được. Kể anh nghe từ đầu.' },
          { who: 'Tùng', voice: 'us-nam', text: "On Friday I left the office at seven and took a Grab car to my friend's birthday party.", vi: 'Thứ Sáu em rời văn phòng lúc bảy giờ và đi xe Grab tới tiệc sinh nhật của bạn em.' },
          { who: 'Tùng', voice: 'us-nam', text: 'I put my backpack on the back seat. When I got out, I forgot it. The laptop was inside.', vi: 'Em để ba lô ở ghế sau. Lúc xuống xe em quên mất. Laptop ở trong đó.' },
          { who: 'Graham', voice: 'uk-nam', text: 'Oh dear. When did you notice?', vi: 'Chết thật. Lúc nào em mới phát hiện?' },
          { who: 'Tùng', voice: 'us-nam', text: "About ten minutes later, at the party. I reached for my bag, and it wasn't there.", vi: 'Khoảng mười phút sau, ở bữa tiệc. Em với tay lấy túi thì không thấy đâu.' },
          { who: 'Graham', voice: 'uk-nam', text: 'What did you do then?', vi: 'Rồi em làm gì?' },
          { who: 'Tùng', voice: 'us-nam', text: "First, I called the driver through the app, but he didn't answer. Then I reported a lost item in the app.", vi: 'Đầu tiên em gọi tài xế qua ứng dụng, nhưng anh ấy không nghe máy. Sau đó em báo mất đồ trong ứng dụng.' },
          { who: 'Graham', voice: 'uk-nam', text: 'Hang on. So you called him first, and after that you reported it?', vi: 'Khoan đã. Vậy là em gọi anh ta trước, rồi sau đó mới báo mất đồ?' },
          { who: 'Tùng', voice: 'us-nam', text: "Yes, exactly. After that, I just waited. I couldn't eat anything at the party.", vi: 'Vâng, đúng vậy. Sau đó em chỉ biết chờ. Ở bữa tiệc em không nuốt nổi miếng nào.' },
          { who: 'Graham', voice: 'uk-nam', text: 'I bet. And when did he get back to you?', vi: 'Anh hiểu mà. Thế khi nào anh ta liên lạc lại với em?' },
          { who: 'Tùng', voice: 'us-nam', text: 'At around eleven. He finished his last trip and found the bag. He brought it to my house on Saturday morning.', vi: 'Khoảng mười một giờ. Anh ấy chạy xong cuốc cuối thì thấy cái túi. Sáng thứ Bảy anh ấy mang tới tận nhà em.' },
          { who: 'Graham', voice: 'uk-nam', text: "Well, that's a relief. Did you give him something?", vi: 'Thế thì may quá. Em có gửi anh ta chút gì không?' },
          { who: 'Tùng', voice: 'us-nam', text: 'Yes, I gave him two hundred thousand dong and thanked him about ten times.', vi: 'Có ạ, em gửi anh ấy hai trăm nghìn và cảm ơn chắc phải mười lần.' },
          { who: 'Graham', voice: 'uk-nam', text: "Good man. Next time, keep the bag on your lap. And send IT a quick note, just so it's on record.", vi: 'Tốt lắm. Lần sau để túi trên đùi nhé. Và nhắn bộ phận IT một dòng, để họ có ghi nhận.' },
          { who: 'Tùng', voice: 'us-nam', text: "I will. I'm really sorry, Graham.", vi: 'Em sẽ làm ạ. Em thật sự xin lỗi anh.' },
          { who: 'Graham', voice: 'uk-nam', text: 'Honestly, these things happen. I once left mine on a train in Leeds.', vi: 'Thật mà, chuyện thường thôi. Anh từng để quên laptop trên tàu ở Leeds đấy.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd11-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Câu đầu tiên Tùng nói với Graham là gì, và vì sao nó hay?',
            options: [
              'Kể ngay từ lúc rời văn phòng, cho đúng thứ tự',
              '"It\'s fine now, but I nearly lost it." — báo kết quả trước để sếp yên tâm, rồi mới kể',
              'Xin nghỉ một ngày',
              'Đổ lỗi cho tài xế',
            ],
            correct: 1,
            why: 'Với sếp, người bản xứ nói **kết quả trước** (It\'s fine now), rồi mới kể từ đầu khi được hỏi ("Tell me from the beginning"). Sếp không phải ngồi lo suốt câu chuyện.',
          },
          {
            q: 'Tùng làm hai việc theo thứ tự nào?',
            options: ['Báo trong ứng dụng → gọi tài xế', 'Gọi tài xế → báo mất đồ trong ứng dụng', 'Gọi Graham → gọi tài xế', 'Gọi cảnh sát → báo trong ứng dụng'],
            correct: 1,
            why: '"**First**, I called the driver… **Then** I reported a lost item." Graham còn hỏi lại cho chắc: "So you called him first, and **after that** you reported it?"',
          },
          {
            q: 'Graham kết thúc thế nào?',
            options: ['Trách Tùng bất cẩn', 'Bảo Tùng trả lại laptop', 'Bảo đó là chuyện thường, và kể mình từng quên laptop trên tàu', 'Bảo Tùng viết bản kiểm điểm'],
            correct: 2,
            why: '"**These things happen.** I once left mine on a train in Leeds." Kể một chuyện nhỏ của mình là cách người Anh làm người kia bớt ngại.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Chú ý đuôi **-ed** rất nhẹ (pushed, waited) và từ nối đứng đầu câu. Số có thể viết bằng chữ hoặc số.',
      },
      {
        t: 'dictation',
        id: 'gtd11-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — mở đầu chuyện', spell: 'Sunday evening was a disaster.', answer: 'Sunday evening was a disaster.' },
          { label: 'Câu 2 — nước ngập', spell: 'The water came up to my knees.', answer: 'The water came up to my knees.' },
          { label: 'Câu 3 — dắt xe', spell: 'I pushed it for about a kilometre.', answer: 'I pushed it for about a kilometre.', alt: ['I pushed it for about a kilometer.', 'I pushed it for about a km.', 'I pushed it for about 1 km.', 'I pushed it for about one kilometre.', 'I pushed it for about one kilometer.'] },
          { label: 'Câu 4 — dứa', spell: 'So we bought six pineapples.', answer: 'So we bought six pineapples.', alt: ['So we bought 6 pineapples.'] },
          { label: 'Câu 5 — lạc mạch chuyện', spell: 'Sorry, I lost you there.', answer: 'Sorry, I lost you there.' },
          { label: 'Câu 6 — câu hỏi của quản lý', spell: 'When did you notice?', answer: 'When did you notice?' },
          { label: 'Câu 7 — kết chuyện', spell: 'In the end, I got home at eleven.', answer: 'In the end, I got home at eleven.', alt: ['In the end I got home at eleven.', 'In the end, I got home at 11.', 'In the end I got home at 11.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Long story.', 'Chuyện dài lắm (và tôi sắp kể đây). Không phải từ chối kể.', 'Oh? Go on.'],
          ["You won't believe what happened.", 'Câu mở màn: chuẩn bị nghe chuyện bất ngờ.', 'Oh no, what happened? · Go on!'],
          ['Uh-oh.', 'Linh cảm chuyện không hay sắp tới.', '(kể tiếp)'],
          ['You scared me there.', 'Bạn làm tôi hết hồn (vì tôi hiểu nhầm).', 'Sorry! I mean…'],
          ['for ages', 'rất lâu. **Không** liên quan tới tuổi.', '—'],
          ['I bet.', 'Tôi hiểu mà, chắc chắn là vậy. **Không** phải cá cược.', '(kể tiếp)'],
          ['Good man. (Anh)', 'Làm tốt lắm. Khen, dù câu nghe lạ.', 'Thanks.'],
          ['These things happen.', 'Chuyện thường thôi, đừng tự trách.', 'Thanks for understanding.'],
          ['No way!', 'Không thể tin được! (ngạc nhiên, thường là vui). **Không** phải "không được".', '(cười, kể tiếp)'],
        ],
        caption: 'Phần lớn câu trên là của **người nghe**. Chúng không thêm thông tin gì, nhưng thiếu chúng thì người kể tưởng bạn không quan tâm.',
      },
      {
        t: 'note',
        title: 'Mẹo: không theo kịp câu chuyện thì làm gì',
        items: [
          'Đừng cắt ngang giữa câu. Chờ người kể **ngừng một nhịp** (thường sau "then…", "and…") rồi mới hỏi.',
          'Nói **"Sorry, I lost you there."** rồi hỏi **đúng một chỗ**: "Was she the driver\'s friend, or a stranger?" Câu hỏi có hai lựa chọn giúp người kể trả lời nhanh rồi kể tiếp.',
          'Hoặc **nhắc lại phần bạn đã hiểu** và để người kia nói nốt: "So the engine stopped, and then…?" Cách này cho thấy bạn đang nghe chứ không phải mất tập trung.',
          'Bám vào **từ nối**: first, then, after that, in the end, suddenly. Lạc ở giữa thì chờ từ nối tiếp theo để bắt lại mạch.',
          'Không cần hiểu từng chữ. Chỉ cần nắm: **ai — làm gì — rồi sao — kết thúc thế nào.** Đúng như cách Graham hỏi Tùng.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh / Ireland', 'Mỹ / Canada', 'Úc'],
        rows: [
          ['Ngạc nhiên', 'No way! · Blimey!', 'No way! · Oh my God!', 'No way! · Crikey! (nghe vui, hơi cổ)'],
          ['Thất vọng', "I was gutted.", 'I was so bummed.', 'I was gutted. · Bummer.'],
          ['Rất tức', 'I was fuming.', 'I was so mad.', 'I was ropeable.'],
          ['Mở chuyện', 'So, basically…', 'So, like…', 'So, anyway…'],
          ['Xe chết máy', 'My bike cut out.', 'My bike stalled.', 'My bike conked out.'],
          ['Lốp xẹp', 'a flat tyre · a puncture', 'a flat tire', 'a flat tyre'],
          ['4 giờ 30', 'half four', 'four thirty', 'half past four · four thirty'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi kể chuyện. **mad** ở Mỹ là "tức", ở Anh hay hiểu là "điên". **half four** của Maeve là 4 giờ 30, người Việt hay nghe nhầm thành 3 rưỡi.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-cs-a2-01 · My First Year Away From Home** — Mai kể năm đầu xa nhà: cô đơn, mì gói, học nấu ăn qua điện thoại. Rất nhiều quá khứ đơn, tốc độ chậm.',
          '**en-cs-b1-02 · The Woman With the Flask of Tea** — một người kể lại buổi sáng tàu dừng giữa đường và một câu nói thay đổi đời cô. Nghe cách dùng **then, after an hour, two weeks later**.',
          '**en-b2-03 · The Year I Failed** — khó hơn (B2): một câu chuyện dài cả năm. Nghe sau khi học xong bài Nói hôm nay.',
          'Ba tập là ba chuyện khác với bài hôm nay. Khi nghe, thử ghi trình tự bằng mũi tên như đã làm ở cảnh 1.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd11-noi',
    kind: 'speaking',
    title: 'Kể một chuyện 1 phút (quá khứ + từ nối thời gian)',
    goal: 'Kể một chuyện đời thường trong 1 phút đúng thì quá khứ, có mở – diễn biến – kết bằng first / then / after that / in the end, và phản ứng tự nhiên khi người khác kể.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** chia ba nhóm: **mở chuyện** · **nối các đoạn** · **phản ứng khi nghe**. Bấm loa từng câu, nói to theo.',
          'Một điểm ngữ pháp: **quá khứ đơn** (waited, went, didn\'t answer, Did you…?) và **was / were**.',
          'Nối câu: **first → then → after that → in the end**, thêm **suddenly, luckily, unfortunately** để có cảm xúc.',
          'Cười khi kể chuyện xui, im lặng khi nghe: hai thói quen của người Việt dễ bị hiểu lầm.',
          'Cuối bài bạn có **một câu chuyện 1 phút** của chính mình, nhập vai với Gia sư AI.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Học theo đường đi của một câu chuyện: **mở → bối cảnh → sự cố → diễn biến → kết**, và một nhóm riêng cho **người nghe**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: "You won't believe what happened.", pos: 'phr', ipa: '/ju woʊnt bɪˈliːv wʌt ˈhæpənd/', vi: 'Bạn không tin nổi chuyện gì đã xảy ra đâu.', ex: "You won't believe what happened on Sunday.", exVi: 'Bạn không tin nổi chuyện hôm Chủ nhật đâu.', more: 'Câu mở màn quen thuộc nhất. Người nghe sẽ đáp **What happened?**' },
          { w: 'Guess what happened to me.', pos: 'phr', ipa: '/ˈɡes wʌt ˈhæpənd tə mi/', vi: 'Đoán xem chuyện gì xảy ra với mình.', ex: 'Guess what happened to me at the market.', exVi: 'Đoán xem mình gặp chuyện gì ở chợ.' },
          { w: 'Long story short,…', pos: 'phr', ipa: '/ˌlɔːŋ ˌstɔːri ˈʃɔːrt/', vi: 'Nói ngắn gọn thì…', ex: 'Long story short, I got home at eleven.', exVi: 'Nói gọn là mình về đến nhà lúc mười một giờ.', more: 'Dùng khi muốn nhảy thẳng tới kết. Anh hay nói **to cut a long story short**.' },
          { w: 'So, last Sunday…', pos: 'phr', ipa: '/soʊ ˌlæst ˈsʌndeɪ/', vi: 'Chuyện là, Chủ nhật vừa rồi…', ex: 'So, last Sunday, I went to my cousin\'s place.', exVi: 'Chuyện là Chủ nhật vừa rồi mình sang nhà anh họ.', more: '**last** + thời gian, **không** có "the" và "on": last Sunday, last week, last month.' },
          { w: 'It was raining really hard.', pos: 'phr', ipa: '/ɪt wəz ˈreɪnɪŋ ˈrɪəli ˈhɑːrd/', vi: 'Lúc đó trời đang mưa rất to.', ex: 'When I left, it was raining really hard.', exVi: 'Lúc mình về, trời đang mưa rất to.', more: 'Câu bối cảnh: **was / were + V-ing** tả cái đang diễn ra lúc chuyện bắt đầu.', anh: 'cloud-with-rain' },
          { w: 'two days ago', pos: 'phr', ipa: '/ˌtuː deɪz əˈɡoʊ/', vi: 'cách đây hai ngày', ex: 'Two days ago, I left my bag in a car.', exVi: 'Hai hôm trước mình để quên túi trên xe.', more: '**ago** đứng SAU khoảng thời gian: an hour ago, a week ago.' },
          { w: 'First,…', pos: 'adv', ipa: '/fɝːst/', vi: 'Đầu tiên…', ex: 'First, I waited under an overpass.', exVi: 'Đầu tiên mình trú dưới cầu vượt.' },
          { w: 'Then…', pos: 'adv', ipa: '/ðen/', vi: 'Rồi… / Sau đó…', ex: 'Then I decided to go home.', exVi: 'Rồi mình quyết định về nhà.', more: 'Không cần dấu phẩy sau Then.' },
          { w: 'After that,…', pos: 'phr', ipa: '/ˌæftər ˈðæt/', vi: 'Sau đó…', ex: 'After that, I found a guy who fixes bikes.', exVi: 'Sau đó mình tìm được một chú sửa xe.' },
          { w: 'Suddenly,…', pos: 'adv', ipa: '/ˈsʌdnli/', vi: 'Bỗng nhiên…', ex: 'Suddenly, the engine stopped.', exVi: 'Bỗng nhiên máy tắt.', more: 'Đặt trước **sự cố**. Đọc chậm lại và nhấn: SUD-den-ly.' },
          { w: 'Luckily,…', pos: 'adv', ipa: '/ˈlʌkɪli/', vi: 'May mà…', ex: 'Luckily, the driver found my bag.', exVi: 'May mà tài xế tìm thấy túi của mình.' },
          { w: 'Unfortunately,…', pos: 'adv', ipa: '/ʌnˈfɔːrtʃənətli/', vi: 'Không may là…', ex: "Unfortunately, he didn't answer.", exVi: 'Không may là anh ấy không nghe máy.' },
          { w: 'In the end,…', pos: 'phr', ipa: '/ɪn ði ˈend/', vi: 'Cuối cùng (kết quả sau cả quá trình)…', ex: 'In the end, they invited us to dinner.', exVi: 'Cuối cùng họ mời bọn mình ăn tối.', more: 'Khác **at the end of** + N (ở cuối cái gì): at the end of the street.' },
          { w: 'eventually', pos: 'adv', ipa: '/ɪˈventʃuəli/', vi: 'rốt cuộc, mãi rồi cũng', ex: 'We saw the market eventually.', exVi: 'Mãi rồi bọn mình cũng thấy chợ.', more: 'Nghĩa là **sau một thời gian dài, cuối cùng thì**. **Không** có nghĩa "có lẽ, có thể".' },
          { w: 'My bike stalled.', pos: 'phr', ipa: '/maɪ ˈbaɪk stɔːld/', vi: 'Xe mình chết máy.', ex: 'The water came up to my knees, and my bike stalled.', exVi: 'Nước lên tới đầu gối và xe mình chết máy.', anh: 'motor-scooter' },
          { w: 'It broke down.', pos: 'phr', ipa: '/ɪt ˌbroʊk ˈdaʊn/', vi: 'Nó hỏng (giữa đường).', ex: 'The boat broke down in the middle of the river.', exVi: 'Con thuyền hỏng giữa sông.', anh: 'canoe' },
          { w: 'I got stuck in traffic.', pos: 'phr', ipa: '/aɪ ˌɡɑːt ˈstʌk ɪn ˈtræfɪk/', vi: 'Mình bị kẹt xe.', ex: 'I got stuck in traffic for an hour.', exVi: 'Mình kẹt xe cả tiếng.' },
          { w: 'I left my bag in the car.', pos: 'phr', ipa: '/aɪ ˈleft maɪ ˈbæɡ ɪn ðə kɑːr/', vi: 'Mình để quên túi trên xe.', ex: 'I left my bag in the car. The laptop was inside.', exVi: 'Mình để quên túi trên xe. Laptop ở trong đó.', more: 'Quên đồ ở đâu: **leave + đồ + nơi**. "forget" không đi với nơi chốn.', anh: 'backpack' },
          { w: 'I realised…', pos: 'v', ipa: '/aɪ ˈriːəlaɪzd/', vi: 'Mình nhận ra…', ex: "I realised my bag wasn't there.", exVi: 'Mình nhận ra túi không còn ở đó.', more: 'Anh: realised · Mỹ: realized. Đọc như nhau.' },
          { w: 'I missed the bus.', pos: 'phr', ipa: '/aɪ ˈmɪst ðə bʌs/', vi: 'Mình lỡ chuyến xe buýt.', ex: 'I missed the bus, so I walked.', exVi: 'Mình lỡ xe buýt nên đi bộ.', anh: 'bus' },
          { w: 'Oh no! What happened?', pos: 'phr', ipa: '/oʊ ˈnoʊ wʌt ˈhæpənd/', vi: 'Ôi không! Chuyện gì vậy?', ex: 'Sunday was a disaster. — Oh no! What happened?', exVi: 'Chủ nhật là một thảm hoạ. — Ôi không! Chuyện gì vậy?' },
          { w: 'Then what?', pos: 'phr', ipa: '/ˌðen ˈwʌt/', vi: 'Rồi sao nữa?', ex: 'The engine stopped. — Then what?', exVi: 'Máy tắt. — Rồi sao nữa?', more: 'Lịch sự hơn: **What happened next?** · **What did you do?**' },
          { w: 'No way!', pos: 'phr', ipa: '/ˌnoʊ ˈweɪ/', vi: 'Không thể tin được!', ex: 'She pulled our boat to the market. — No way!', exVi: 'Cô ấy kéo thuyền bọn mình tới chợ. — Không thể tin được!' },
          { w: 'Seriously?', pos: 'adv', ipa: '/ˈsɪriəsli/', vi: 'Thật á?', ex: 'The engine stopped in the middle of the river. — Seriously?', exVi: 'Máy tắt ngay giữa sông. — Thật á?' },
          { w: 'That sounds scary!', pos: 'phr', ipa: '/ðæt ˌsaʊndz ˈskeri/', vi: 'Nghe sợ thật!', ex: 'The water came up to my knees. — That sounds scary!', exVi: 'Nước lên tới đầu gối. — Nghe sợ thật!', more: 'Đổi tính từ: That sounds **awful / amazing / stressful / fun**.' },
          { w: 'That was lucky!', pos: 'phr', ipa: '/ðæt wəz ˈlʌki/', vi: 'May thật đấy!', ex: 'He found the bag at eleven. — That was lucky!', exVi: 'Mười một giờ anh ấy tìm thấy túi. — May thật đấy!' },
          { w: "I'm glad you're okay.", pos: 'phr', ipa: '/aɪm ˈɡlæd jʊr oʊˈkeɪ/', vi: 'Bạn không sao là mừng rồi.', ex: "I'm glad you're okay. That rain was crazy.", exVi: 'Bạn không sao là mừng rồi. Trận mưa đó kinh khủng thật.' },
          { w: "That's hilarious!", pos: 'phr', ipa: '/ðæts hɪˈleriəs/', vi: 'Buồn cười quá!', ex: "So you wore sandals to work? That's hilarious!", exVi: 'Vậy là bạn đi dép đi làm à? Buồn cười quá!', anh: 'face-with-tears-of-joy' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Kể chuyện với **bạn bè** thì cường điệu, nhiều cảm xúc. Kể với **đồng nghiệp** vẫn vui nhưng gọn. Kể với **sếp, khách** (thường là báo một sự cố) thì nói **kết quả trước**, đúng thứ tự, ít cảm xúc.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Mở chuyện', 'Dude, you won\'t believe this.', "You won't believe what happened on Sunday.", "Something unexpected happened on Friday evening, but it's resolved now."],
          ['Bắt đầu kể', 'So basically…', 'So, on Sunday evening…', 'On Friday at about seven, I…'],
          ['Ngạc nhiên', 'No way! · Shut up!', 'Really? · Seriously?', "That's surprising."],
          ['Hỏi tiếp', 'And then?', 'What happened next?', 'What did you do after that?'],
          ['Đồng cảm', 'Ugh, that sucks.', "Oh no, that's awful.", "I'm sorry to hear that."],
          ['Kết chuyện', 'Anyway, yeah.', "Anyway, that's my weekend.", "That's everything that happened."],
        ],
        caption: '**Shut up!** giữa bạn thân người Mỹ là "Không thể nào!" (ngạc nhiên, vui), **không** phải bảo im. Nhưng đừng nói với sếp hay người mới quen.',
      },
      {
        t: 'note',
        title: 'Mẹo: kể với sếp khác kể với bạn',
        items: [
          'Với bạn: giữ bí mật kết thúc tới cuối cho hấp dẫn.',
          'Với sếp: câu đầu tiên là **kết quả**: "It\'s fine now, but I nearly lost my laptop." Rồi mới kể khi được hỏi. Đó là cách Tùng làm ở cảnh 3.',
          'Với sếp: bỏ cảm xúc dài dòng ("I was so scared, I wanted to cry"), giữ **mốc giờ** và **việc bạn đã làm** (I called… I reported…).',
          'Phần kỹ thuật (báo sự cố hệ thống, viết incident report) ở khoá **Technical English at Work**. Hôm nay chỉ là kể chuyện đời thường.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Tiếng Việt dùng **từ chỉ thời gian** để báo quá khứ: "hôm qua mình **đi**". Động từ không đổi. Tiếng Anh thì **động từ phải đổi**: go → **went**, kể cả khi đã có "yesterday". Đó là toàn bộ bí mật của hôm nay.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + V-ed (động từ có quy tắc)',
            vi: 'Phần lớn động từ chỉ cần thêm -ed. Dùng cho mọi ngôi, không có -s.',
            examples: [
              { en: 'I waited under an overpass.', vi: 'Mình trú dưới cầu vượt.' },
              { en: 'The engine stopped.', vi: 'Máy tắt.' },
              { en: 'We decided to go home.', vi: 'Bọn mình quyết định về nhà.' },
            ],
          },
          {
            formula: 'S + V2 (động từ bất quy tắc)',
            vi: 'Khoảng 20 động từ hay dùng nhất lại bất quy tắc. Học thuộc bảng ngay dưới.',
            examples: [
              { en: "I went to my cousin's place.", vi: 'Mình sang nhà anh họ.' },
              { en: 'I left my bag in the car.', vi: 'Mình để quên túi trên xe.' },
              { en: 'We bought six pineapples.', vi: 'Bọn mình mua sáu quả dứa.' },
            ],
          },
          {
            formula: "S + didn't + V (nguyên mẫu)",
            vi: 'Phủ định: didn\'t lo phần quá khứ, động từ quay về nguyên mẫu.',
            examples: [
              { en: "He didn't answer.", vi: 'Anh ấy không nghe máy.' },
              { en: "I didn't see the bag.", vi: 'Mình không thấy cái túi.' },
              { en: "We didn't have any cash.", vi: 'Bọn mình không có tiền mặt.' },
            ],
          },
          {
            formula: 'Did + S + V…? · Wh- + did + S + V?',
            vi: 'Câu hỏi: đưa did lên trước chủ ngữ, động từ vẫn nguyên mẫu.',
            examples: [
              { en: 'Did you fall?', vi: 'Bạn có bị ngã không?' },
              { en: 'What did you do then?', vi: 'Rồi bạn làm gì?' },
              { en: 'When did you notice?', vi: 'Lúc nào bạn mới phát hiện?' },
            ],
          },
          {
            formula: 'S + was / were + adj / nơi / V-ing',
            vi: 'Tả bối cảnh và cảm xúc trong quá khứ. I / he / she / it → was; you / we / they → were.',
            examples: [
              { en: 'The street was completely flooded.', vi: 'Đường ngập hết.' },
              { en: 'We were in the middle of the river.', vi: 'Bọn mình đang ở giữa sông.' },
              { en: 'It was raining really hard.', vi: 'Trời đang mưa rất to.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Nguyên mẫu', 'Quá khứ', 'Câu trong cảnh hôm nay'],
        rows: [
          ['go', 'went', "I went to my cousin's place."],
          ['get', 'got', 'I got home at eleven.'],
          ['leave', 'left', 'I left the office at seven.'],
          ['take', 'took', 'We took a little boat from the pier.'],
          ['come', 'came', 'The water came up to my knees.'],
          ['buy', 'bought', 'We bought six pineapples.'],
          ['find', 'found', 'He found the bag.'],
          ['bring', 'brought', 'He brought it to my house.'],
          ['give', 'gave', 'I gave him a hundred.'],
          ['eat', 'ate', 'We ate one on the boat.'],
          ['forget', 'forgot', 'When I got out, I forgot it.'],
          ['feel', 'felt', 'We felt we had to buy something.'],
          ['lose', 'lost', 'Sorry, I lost you there.'],
          ['can', 'could', "I couldn't find dry shoes."],
        ],
        caption: '14 động từ bất quy tắc xuất hiện ngay trong ba cảnh hôm nay. Thuộc chúng là kể được 80 % chuyện đời thường.',
      },
      {
        t: 'rule',
        formula: "S + V-ed / V2 · S + didn't + V · Did + S + V? · was / were",
        vi: 'Quá khứ chỉ đánh dấu MỘT lần: hoặc ở động từ (went), hoặc ở did / didn\'t (didn\'t go). Không bao giờ cả hai (~~didn\'t went~~).',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: first · then · after that · in the end',
        items: [
          'Bốn từ này là **khung xương** của câu chuyện: **First** (việc đầu) → **Then** (việc tiếp) → **After that** (việc sau nữa) → **In the end** (kết quả).',
          '**In the end** = cuối cùng, sau cả một quá trình: "In the end, I got home at eleven." Khác **at the end of** + N = ở cuối cái gì: "at the end of the street", "at the end of the month".',
          '**Finally** cũng là "cuối cùng", hay dùng khi đã chờ lâu ("Finally, the engine started!") hoặc cho việc cuối trong một danh sách.',
          'Thêm cảm xúc bằng **Suddenly** (bỗng nhiên), **Luckily** (may mà), **Unfortunately** (không may) đặt ở đầu câu.',
          'Đừng nối mọi câu bằng "and then… and then… and then". Đổi luân phiên, và tách thành câu ngắn.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd11-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "S + V-ed / V2 · didn't + V · Did…? · In the end",
        items: [
          { q: 'Hôm qua mình lỡ chuyến xe buýt.', hint: 'miss, the bus', answers: ['I missed the bus yesterday.', 'Yesterday I missed the bus.', 'Yesterday, I missed the bus.'] },
          { q: 'Bạn có bị ngã không?', hint: 'did, fall', answers: ['Did you fall?', 'Did you fall over?', 'Did you fall down?'] },
          { q: 'Tài xế không nghe máy.', hint: "didn't, answer", answers: ["The driver didn't answer.", "The driver didn't answer the phone.", "The driver didn't answer his phone.", "The driver didn't pick up.", 'The driver did not answer.'] },
          { q: 'Sau đó bạn làm gì?', hint: 'what, did, after that / then', answers: ['What did you do after that?', 'What did you do then?', 'What did you do next?', 'Then what did you do?', 'After that, what did you do?'] },
          { q: 'Cuối cùng, mình về tới nhà lúc mười một giờ.', hint: 'in the end, get home', answers: ['In the end, I got home at eleven.', 'In the end I got home at eleven.', 'In the end, I got home at 11.', 'In the end I got home at 11.', "In the end, I got home at eleven o'clock.", 'In the end, I got home at 11 pm.', 'In the end, I arrived home at eleven.'] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi kể chuyện',
        items: [
          '~~Yesterday I go to the office late.~~ → **Yesterday I got to the office late.** Tiếng Việt có "hôm qua" là đủ. Tiếng Anh thì động từ phải đổi, kể cả khi đã có yesterday. Đây là lỗi số một.',
          '~~I didn\'t went.~~ · ~~Did you went?~~ → **I didn\'t go. · Did you go?** Có did / didn\'t rồi thì động từ về nguyên mẫu.',
          '~~I losed my bag.~~ → **I lost my bag.** Động từ bất quy tắc không thêm -ed. Hay gặp: ~~buyed~~ → bought, ~~leaved~~ → left, ~~goed~~ → went.',
          '~~Before two days, I…~~ → **Two days ago, I…** "Hai ngày trước" là **ago**, và ago đứng **sau**. "before" cần một mốc: before Friday, before the party.',
          '~~At the end, the driver found my bag.~~ → **In the end, the driver found my bag.** "at the end" phải có **of + cái gì** đi sau.',
          '~~Yesterday I am very tired.~~ → **Yesterday I was really tired.** be cũng đổi: am / is → **was**, are → **were**.',
          '~~The engine was died.~~ · ~~I was forgot.~~ → **The engine died. · I forgot.** Đừng thêm was trước động từ quá khứ. Câu có V2 rồi thì không cần be.',
          '(Im lặng suốt khi người khác kể) → **Oh no! · Really? · Then what?** Người Việt lịch sự bằng cách ngồi im nghe. Người Anh – Mỹ – Úc thì nghĩ bạn chán hoặc không hiểu.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi kể và khi nghe' },
      {
        t: 'p',
        text: 'Câu chuyện hay hay dở một nửa nằm ở **mặt và tay**. Người kể cần thấy bạn đang theo. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi kể chuyện',
        items: [
          { anh: 'face-with-open-mouth', w: 'No way!', ro: '/ˌnoʊ ˈweɪ/', vi: 'Mở to mắt, nhướn mày khi tới đoạn bất ngờ. Người kể thấy là kể hăng hơn.' },
          { anh: 'face-with-raised-eyebrow', w: 'Seriously?', ro: '/ˈsɪriəsli/', vi: 'Nhướn một bên mày: nửa ngạc nhiên nửa đùa. Dùng với bạn bè, đồng nghiệp thân.' },
          { anh: 'open-hands', w: 'The water came up to here!', ro: '', vi: 'Dùng tay chỉ độ cao, kích thước, hướng đi. Người bản xứ kể chuyện bằng tay rất nhiều.' },
          { anh: 'person-facepalming', w: 'And then I forgot the bag. Classic me.', ro: '', vi: 'Vỗ trán khi kể đoạn mình hớ. Tự cười mình một chút làm người nghe thấy dễ gần.' },
          { anh: 'grinning-face-with-sweat', w: "It's fine now, but…", ro: '', vi: '**Cẩn thận**: người Việt hay cười để đỡ ngượng khi kể chuyện xui. Với chuyện nghiêm (mất đồ công ty, tai nạn), cười dễ bị hiểu là bạn không coi trọng. Giữ mặt nghiêm.' },
          { anh: 'eyes', w: 'Mm-hm. Right.', ro: '/mˈhm raɪt/', vi: 'Khi nghe: nhìn người kể, gật nhẹ, chen "mm-hm", "right" mỗi vài câu.' },
          { anh: 'person-bowing', w: 'Right… right…', ro: '', vi: 'Đồng nghiệp Nhật gật đầu và nói "hai" liên tục khi nghe (aizuchi). Đó là "tôi đang nghe", **không** phải "tôi đồng ý".' },
          { anh: 'face-with-tears-of-joy', w: "That's hilarious!", ro: '/ðæts hɪˈleriəs/', vi: 'Cười to khi tới đoạn buồn cười, nhưng chờ người kể tới đó. Cười trước khi họ kể xong là phá chuyện.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Khi người khác kể', 'Im lặng nghe là lễ phép.', 'Phản hồi liên tục: mm-hm, really?, oh no. Im lâu = chán.', 'Gật và nói "hai" rất nhiều (aizuchi).'],
          ['Chen câu hỏi', 'Đợi kể xong mới hỏi.', 'Hỏi ngắn giữa chừng là bình thường: "Wait, who?"', 'Hầu như không cắt ngang.'],
          ['Cười khi kể chuyện xui', 'Hay cười để giảm ngượng.', 'Dễ bị hiểu là không nghiêm túc, nhất là chuyện mất mát.', 'Có cười ngượng, nhưng ít hơn.'],
          ['Kể chuyện của mình ở công sở', 'Ít kể, sợ bị coi là khoe.', 'Kể thoải mái, thích tự giễu mình.', 'Kể ít, chọn chuyện an toàn.'],
          ['Báo sự cố với sếp', 'Kể từ đầu, kết quả để cuối.', 'Kết quả trước, rồi kể.', 'Xin lỗi trước, rồi kể.'],
        ],
        caption: 'Với đồng nghiệp nước ngoài, thói quen dễ sửa nhất và hiệu quả nhất: **thêm phản hồi khi nghe**. Một câu "Oh no!" đúng lúc làm câu chuyện của họ ấm lên ngay.',
      },

      { t: 'h', text: '6. Phát âm: đuôi -ed có ba cách đọc' },
      {
        t: 'p',
        text: 'Đuôi **-ed** không bao giờ đọc là "ét". Sau **/t/, /d/** đọc thành âm tiết riêng **/ɪd/** (wait-ed, decid-ed). Sau âm **không rung** (/p/, /k/, /s/, /ʃ/, /tʃ/) đọc **/t/** (stopped, pushed). Còn lại đọc **/d/** (called, rained). Hai cách sau **không thêm âm tiết**: stopped chỉ một âm tiết. Nghe mẫu rồi đọc theo.',
      },
      {
        t: 'phatam',
        id: 'gtd11-phat-am',
        title: 'Luyện phát âm — đuôi -ed và nhịp kể chuyện',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ rõ âm cuối, nhất là /t/ và /d/ rất nhẹ ở cuối động từ.',
        items: [
          { text: 'I waited under an overpass.', ipa: 'aɪ weɪtɪd ʌndər ən oʊvərpæs', vi: 'waited = WAY-tid, hai âm tiết · nối under‿an‿overpass' },
          { text: 'We decided to go home.', ipa: 'wi dɪsaɪdɪd tə ɡoʊ hoʊm', vi: 'decided: -ed đọc /ɪd/ vì trước nó là /d/ · to đọc nhẹ /tə/' },
          { text: 'The engine stopped.', ipa: 'ði endʒɪn stɑːpt', vi: 'stopped = /stɑːpt/ một âm tiết, không đọc "stóp-pét" · the đọc /ði/ trước nguyên âm' },
          { text: 'I pushed it for a kilometre.', ipa: 'aɪ pʊʃt ɪt fər ə kɪlɑːmɪtər', vi: 'nối pushed‿it nghe như "push-tit" · kilometre Mỹ nhấn ki-LO-mơ-tơ' },
          { text: 'It rained all night.', ipa: 'ɪt reɪnd ɔːl naɪt', vi: 'rained = /reɪnd/ một âm tiết · nối rained‿all' },
          { text: 'He called the driver.', ipa: 'hi kɔːld ðə draɪvər', vi: 'called = /kɔːld/, /d/ rất nhẹ rồi sang the' },
          { text: "I didn't notice.", ipa: 'aɪ dɪdnt noʊtɪs', vi: "didn't = /dɪdnt/, chữ t cuối gần như nuốt · nhấn NO-tice" },
          { text: 'Suddenly, the engine stopped!', ipa: 'sʌdnli ði endʒɪn stɑːpt', vi: 'kể chuyện: ngừng một nhịp sau **Suddenly**, nhấn **stopped** — đây là đoạn kịch tính' },
        ],
      },

      { t: 'h', text: '7. Câu chuyện 1 phút của bạn' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Khung chuyện 1 phút: 5 bước, 6–8 câu',
        caption: 'Bước 2 dùng **was / were**. Bước 3–5 dùng **quá khứ đơn** và từ nối. Kết bằng cảm xúc hoặc bài học.',
        steps: [
          { label: 'Mở: khi nào, ở đâu', sub: 'So, last semester, on the day of my final exam…' },
          { label: 'Bối cảnh', sub: 'I was really nervous, and it was very hot.' },
          { label: 'Sự cố', sub: 'Suddenly, I realised I was in the wrong room.' },
          { label: 'Diễn biến', sub: 'First… Then… After that…' },
          { label: 'Kết + cảm xúc', sub: 'In the end, … I was so relieved.' },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: 'So, last semester, on the morning of my final exam, I got to school really early.', vi: 'Chuyện là học kỳ trước, sáng hôm thi cuối kỳ, mình tới trường rất sớm.' },
          { en: 'I was nervous, so I sat down and read my notes again.', vi: 'Mình hồi hộp nên ngồi xuống đọc lại ghi chép.' },
          { en: 'At five past seven, I suddenly realised that nobody in the room had my subject code.', vi: 'Bảy giờ năm phút, mình bỗng nhận ra không ai trong phòng thi cùng mã môn với mình.' },
          { en: 'I was in the wrong building! First, I grabbed my bag. Then I ran to Building B.', vi: 'Mình ngồi nhầm toà nhà! Đầu tiên mình vớ lấy cặp. Rồi mình chạy sang toà B.' },
          { en: 'After that, I explained everything to the invigilator, and luckily, she let me in.', vi: 'Sau đó mình giải thích hết với giám thị, và may mà cô cho mình vào.' },
          { en: 'In the end, I started ten minutes late, but I passed. Now I always check the room twice.', vi: 'Cuối cùng mình bắt đầu muộn mười phút nhưng vẫn qua môn. Giờ mình luôn xem lại phòng thi hai lần.' },
        ],
      },
      {
        t: 'p',
        text: 'Giờ chọn **một chuyện thật** của bạn: lần lạc đường, mất đồ, lỡ xe, xe hỏng, một ngày thi hay một chuyến đi có sự cố. Viết 6–8 câu theo khung trên, đọc to 2 lần, lần 3 **bấm giờ 60 giây và không nhìn giấy**. Quá 60 giây thì bỏ bớt chi tiết ở bước 4, đừng bỏ bước 5.',
      },

      { t: 'h', text: '8. Nhập vai: kể chuyện cho bạn cùng nhà' },
      {
        t: 'dialogue',
        title: 'Buổi sáng — Tùng kể cho Kendra (bạn cùng thuê nhà, người Mỹ) chuyện tối qua',
        lines: [
          { who: 'Tùng', role: 'a', text: "Kendra, you won't believe what happened last night.", vi: 'Kendra, cậu không tin nổi chuyện tối qua đâu.' },
          { who: 'Kendra', role: 'b', text: 'Uh-oh. What did you do this time?', vi: 'Ối. Lần này cậu lại làm gì thế?' },
          { who: 'Tùng', role: 'a', text: 'I locked myself out. My keys were on the table inside.', vi: 'Mình tự khoá mình ở ngoài. Chìa khoá để trên bàn bên trong.' },
          { who: 'Kendra', role: 'b', text: 'Oh no! What time was it?', vi: 'Ôi không! Lúc đó mấy giờ?' },
          { who: 'Tùng', role: 'a', text: "Almost midnight. First, I called you, but you didn't answer.", vi: 'Gần nửa đêm. Đầu tiên mình gọi cậu, nhưng cậu không nghe máy.' },
          { who: 'Kendra', role: 'b', text: 'Sorry! I was asleep. So what did you do?', vi: 'Xin lỗi! Lúc đó mình ngủ rồi. Thế cậu làm gì?' },
          { who: 'Tùng', role: 'a', text: "Then I asked the security guard downstairs. He didn't have a spare key.", vi: 'Rồi mình hỏi bác bảo vệ dưới nhà. Bác ấy không có chìa dự phòng.' },
          { who: 'Kendra', role: 'b', text: 'Seriously? So where did you sleep?', vi: 'Thật á? Thế cậu ngủ ở đâu?' },
          { who: 'Tùng', role: 'a', text: 'After that, I called a locksmith. He came at one and opened the door in two minutes.', vi: 'Sau đó mình gọi thợ khoá. Một giờ anh ấy tới, mở cửa trong hai phút.' },
          { who: 'Kendra', role: 'b', text: 'Two minutes! How much did he charge you?', vi: 'Hai phút! Anh ấy lấy cậu bao nhiêu?' },
          { who: 'Tùng', role: 'a', text: 'Three hundred thousand. In the end, I went to bed at two.', vi: 'Ba trăm nghìn. Cuối cùng hai giờ sáng mình mới đi ngủ.' },
          { who: 'Kendra', role: 'b', text: "Ha! Expensive lesson. I'm glad you didn't sleep on the stairs, though.", vi: 'Ha! Bài học đắt giá. Nhưng mừng là cậu không phải ngủ ngoài cầu thang.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd11-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt kể của Tùng (5 câu)',
        items: [
          { vi: 'Kendra, cậu không tin nổi chuyện tối qua đâu.', chips: ['You', "won't", 'believe', 'what', 'happened', 'last', 'night.', 'the', 'did'], answer: ['You', "won't", 'believe', 'what', 'happened', 'last', 'night.'] },
          { vi: 'Chìa khoá của mình để trên bàn bên trong.', chips: ['My', 'keys', 'were', 'on', 'the', 'table', 'inside.', 'was', 'at'], answer: ['My', 'keys', 'were', 'on', 'the', 'table', 'inside.'] },
          { vi: 'Đầu tiên mình gọi cậu, nhưng cậu không nghe máy.', chips: ['First,', 'I', 'called', 'you,', 'but', 'you', "didn't", 'answer.', 'answered', 'call'], answer: ['First,', 'I', 'called', 'you,', 'but', 'you', "didn't", 'answer.'] },
          { vi: 'Bác bảo vệ không có chìa dự phòng.', chips: ['The', 'guard', "didn't", 'have', 'a', 'spare', 'key.', 'had', 'any'], answer: ['The', 'guard', "didn't", 'have', 'a', 'spare', 'key.'] },
          { vi: 'Cuối cùng hai giờ mình mới đi ngủ.', chips: ['In', 'the', 'end,', 'I', 'went', 'to', 'bed', 'at', 'two.', 'At', 'go'], answer: ['In', 'the', 'end,', 'I', 'went', 'to', 'bed', 'at', 'two.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd11-noi-tra-loi',
        part: '1',
        questions: [
          'What did you do last weekend?',
          'Tell me about a time you lost something important.',
          'When was the last time you got lost? What happened?',
          'What was the funniest thing that happened to you this year?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Kendra, a friendly American who shares a flat with me in Ho Chi Minh City. It is Monday morning in the kitchen. Ask me how my weekend was. I will tell you a short story about something that happened to me. React naturally while I talk (Oh no! Really? Then what?) and ask me 3–4 follow-up questions in the past simple (What did you do? When did you notice? How did it end?). Use B1-level English, not too fast. If I use a wrong past form, for example \'I go\' instead of \'I went\', repeat my sentence correctly in your answer without stopping the conversation. After about 10 turns, tell me in Vietnamese two things I did well and the past-tense mistakes I made."',
          'Làm **2 lượt**. Lượt hai đổi vai: AI kể chuyện, bạn là người nghe, và bạn phải dùng ít nhất **5 câu phản ứng** khác nhau (No way! · Seriously? · Then what? · That sounds scary! · I\'m glad you\'re okay).',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd11-doc',
    kind: 'reading',
    title: 'Chuyện ngắn đời thường, tin nhắn kể chuyện',
    goal: 'Đọc hiểu bốn câu chuyện ngắn ở bốn dạng chữ thật (tin nhắn nhóm, bài đăng cảm ơn, mẩu chuyện trong bản tin công ty, đánh giá homestay): nắm trình tự, nhận ra giọng điệu và các cụm hay dùng khi kể bằng chữ.',
    minutes: 18,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Bốn câu chuyện người ta **viết** ra: chuỗi tin nhắn trong nhóm chat, bài đăng cảm ơn người lạ, mẩu chuyện trong bản tin nội bộ, đánh giá một homestay.',
          'Mỗi chuyện đều có **trình tự**. Đọc xong phải trả lời được: việc gì xảy ra trước, việc gì sau, kết thúc ra sao.',
          'Học nhận ra **giọng điệu**: chữ thường và "lol" khác hẳn một bài đăng cảm ơn nghiêm túc.',
          'Nhặt 10 cụm kể chuyện bằng chữ (turns out, long story short, update…) để dùng trong tin nhắn của chính bạn.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn mẩu sau' },
      {
        t: 'canh',
        anh: ['mobile-phone', 'speech-balloon', 'newspaper', 'house-with-garden', 'folded-hands'],
        caption: 'Tối thứ Hai, Tùng lướt điện thoại: nhóm chat của văn phòng, một nhóm cộng đồng người nước ngoài ở TP.HCM, bản tin nội bộ của công ty, và bài đánh giá Maeve vừa viết cho homestay ở Cần Thơ.',
      },
      {
        t: 'passage',
        title: 'Four short stories',
        intro: 'Đọc một lượt, chưa tra từ. Gạch chân mọi từ nối thời gian bạn gặp.',
        paras: [
          {
            label: 'A',
            text: '**#random — Wes Moreau** 6:12 pm: ok so funny story 😅 · this morning my Grab driver took me to the **WRONG** Vincom · there are like five Vincoms in this city?? · first he dropped me in District 1, then I realised my dentist was in Thao Dien · got a second Grab, arrived 25 mins late · **turns out** the dentist was running even later 🙃 · so **in the end** nobody noticed lol',
          },
          {
            label: 'B',
            text: '**Expats in Saigon (group post) — Bethany W.** · **THANK YOU** to the kind xe ôm driver on Vo Van Tan Street yesterday afternoon. I paid for a coffee, put my wallet on the seat of my scooter and rode off. **Two blocks later**, I heard someone shouting behind me. He followed me all the way to the traffic lights and handed me the wallet. My passport, my cards and my rent money were all inside. I tried to give him something, but he just smiled and drove away. If anyone knows him, please tell him he made my week. 🙏',
          },
          {
            label: 'C',
            text: '**Brightline News · Story of the week — "The laptop that went to Edinburgh"** · Five years ago, our project manager Graham Price fell asleep on the 7:40 train from Leeds. He woke up at his stop, jumped off **in a hurry**, and left his laptop on the seat. **By the time** he realised, the train was on its way to Scotland. He called the train company, filled in a lost property form and **expected the worst**. Three days later, a parcel arrived at the office. Inside was his laptop, a note from a ticket inspector — "Sleep well next time!" — and a small bar of Scottish shortbread. Graham still has the note on his desk.',
          },
          {
            label: 'D',
            text: '**Review ★★★★★ — Song Hau Riverside Homestay, Can Tho · by Maeve O.** · We came for the floating market. **We left with a new family.** Our boat broke down on the way there (a long story — ask me!), and we arrived at the homestay with five pineapples. We gave them to Mrs Tam, the owner, and that evening she invited us to cook dinner with her family. Her son showed us how to make bánh xèo, and we failed **badly** — but nobody cared. The room is simple and clean, the fan works, and breakfast is huge. **Highly recommended**, especially if your boat breaks down. 😄',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd11-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Trong (A), việc gì xảy ra TRƯỚC?',
            options: ['Wes gọi chiếc Grab thứ hai', 'Tài xế thả Wes ở Quận 1', 'Wes tới phòng khám muộn 25 phút', 'Wes biết nha sĩ còn muộn hơn'],
            correct: 1,
            why: '"**first** he dropped me in District 1, **then** I realised…" Rồi mới gọi xe thứ hai, tới muộn, và cuối cùng biết nha sĩ còn muộn hơn.',
          },
          {
            q: '"turns out the dentist was running even later" nghĩa là gì?',
            options: ['Nha sĩ đang chạy bộ', 'Hoá ra nha sĩ còn trễ lịch hơn cả Wes', 'Nha sĩ đã về', 'Wes phải đổi nha sĩ'],
            correct: 1,
            why: '**turns out** = hoá ra (điều bất ngờ mới biết). **running late** = đang trễ giờ, không liên quan tới chạy.',
          },
          {
            q: 'Giọng điệu của (A) thế nào?',
            options: ['Trang trọng, như báo cáo', 'Thân mật, tự cười mình', 'Tức giận, phàn nàn công ty xe', 'Lo lắng'],
            correct: 1,
            why: 'Dấu hiệu: chữ thường, "ok so funny story", "like five Vincoms", emoji 😅 🙃, "lol". Chữ **WRONG** viết hoa để nhấn mạnh, không phải tức giận.',
          },
          {
            q: 'Vì sao Bethany viết bài (B)?',
            options: ['Để tìm ví bị mất', 'Để cảm ơn và mong người tài xế biết được', 'Để phàn nàn về xe ôm', 'Để rao bán ví'],
            correct: 1,
            why: 'Mở bằng **THANK YOU**, kết bằng "If anyone knows him, please tell him **he made my week**" (anh ấy làm cả tuần của tôi vui).',
          },
          {
            q: 'Trong (B), Bethany để quên ví ở đâu?',
            options: ['Trong quán cà phê', 'Trên yên xe máy của mình', 'Trên xe ôm', 'Ở đèn giao thông'],
            correct: 1,
            why: '"put my wallet **on the seat of my scooter** and rode off" — để ví trên yên xe rồi phóng đi, ví rơi dọc đường.',
          },
          {
            q: 'Trong (C), "By the time he realised, the train was on its way to Scotland" cho biết điều gì?',
            options: ['Graham nhận ra ngay khi xuống tàu', 'Lúc Graham nhận ra thì tàu đã đi mất', 'Graham cố ý gửi laptop đi Scotland', 'Tàu bị hỏng'],
            correct: 1,
            why: '**By the time** + việc A, việc B (đã xảy ra rồi): khi Graham kịp nhận ra thì đã muộn.',
          },
          {
            q: 'Ai gửi trả laptop cho Graham?',
            options: ['Graham tự lên Scotland lấy', 'Một nhân viên soát vé', 'Một hành khách', 'Công ty Brightline'],
            correct: 1,
            why: '"a note from **a ticket inspector** — \'Sleep well next time!\'"',
          },
          {
            q: 'Trong (D), "We left with a new family" ý Maeve là gì?',
            options: ['Họ nhận nuôi một đứa trẻ', 'Họ thân với gia đình chủ homestay như người nhà', 'Họ đi cùng một gia đình khác về', 'Họ chuyển tới ở hẳn'],
            correct: 1,
            why: 'Lối nói hình ảnh trong bài đánh giá: bà chủ mời nấu cơm cùng, con trai dạy làm bánh xèo. Đây là cái kết của chuyện thuyền hỏng ở Cảnh 2.',
          },
        ],
      },

      { t: 'h', text: '2. 10 cụm hay gặp khi kể chuyện bằng chữ' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Gặp ở đâu'],
        rows: [
          ['ok so… / funny story', 'chuyện là… / có chuyện buồn cười', 'Tin nhắn thân mật'],
          ['turns out…', 'hoá ra…', 'Tin nhắn, bài đăng'],
          ['long story short · (a long story — ask me!)', 'nói gọn là · chuyện dài lắm, gặp kể', 'Tin nhắn, đánh giá'],
          ['two blocks later · three days later', 'đi thêm hai dãy nhà · ba ngày sau', 'Mọi kiểu chuyện'],
          ['by the time + S + V2', 'đến lúc… thì (đã muộn)', 'Chuyện viết dài hơn'],
          ['in a hurry', 'vội vàng', 'Mọi kiểu chuyện'],
          ['expected the worst', 'đã nghĩ tới điều tệ nhất', 'Chuyện viết'],
          ['He made my week / my day.', 'Anh ấy làm tôi vui cả tuần / cả ngày.', 'Bài cảm ơn'],
          ['Update: …', 'Cập nhật: (chuyện có diễn biến mới)', 'Bài đăng, nhóm chat'],
          ['Highly recommended.', 'Rất nên thử / nên tới.', 'Đánh giá'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc một câu chuyện viết bằng chữ',
        items: [
          '**Tin nhắn kể chuyện** thường tách thành nhiều dòng ngắn, chữ thường, bỏ chủ ngữ ("got a second Grab, arrived 25 mins late"). Đó là văn nói viết ra, không phải lỗi.',
          'Một từ **VIẾT HOA HẾT** (WRONG) là nhấn mạnh như khi nói to lên. Cả câu viết hoa mới là hét.',
          'Đọc nhanh bằng cách tìm **mốc thời gian** và **từ nối**: first, then, two blocks later, by the time, three days later, that evening. Chúng là bộ xương của chuyện.',
          'Bài đăng cảm ơn người lạ (B) là kiểu bài rất phổ biến trong nhóm cộng đồng. Muốn viết một bài như thế: **THANK YOU + ai + ở đâu, khi nào → chuyện gì xảy ra → họ đã làm gì → bạn cảm thấy thế nào.**',
        ],
      },

      { t: 'h', text: '3. Kể lại chuyện của Graham' },
      {
        t: 'quiz',
        id: 'gtd11-doc-dien',
        title: 'Điền động từ ở thì quá khứ (6 câu)',
        kind: 'fill',
        grammar: "V-ed · V2 bất quy tắc · didn't + V",
        items: [
          { q: 'Graham ___ asleep on the train from Leeds. (fall)', answers: ['fell'] },
          { q: 'He ___ up at his stop and jumped off in a hurry. (wake)', answers: ['woke'] },
          { q: 'He ___ his laptop on the seat. (leave)', answers: ['left'] },
          { q: 'He ___ the train company and filled in a form. (call)', answers: ['called'] },
          { q: "He ___ think he would see the laptop again. (not — dạng rút gọn)", answers: ["didn't", 'didn’t', 'did not'] },
          { q: 'Three days later, a parcel ___ at the office. (arrive)', answers: ['arrived'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd11-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 11',
    goal: 'Làm 35 câu có đáp án để chắc thì quá khứ đơn, từ nối thời gian và câu phản ứng khi nghe kể chuyện; có câu ôn Ngày 6–10.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền động từ quá khứ · dịch · nghe chép · ghép câu.',
          'Có vài câu ôn **Ngày 6–10** (chỉ đường, sức khoẻ, nhà ở, gọi điện, hẹn hò). Gặp thì nhớ lại đúng ngày đó.',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 12.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd11-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Đồng nghiệp kể: "And then the lift stopped between two floors." Bạn đáp:',
            options: ['Okay.', 'Oh no! What did you do?', 'The lift is old.', 'I know.'],
            correct: 1,
            why: 'Phản ứng + hỏi tiếp: **Oh no! What did you do?** "Okay." làm câu chuyện chết.',
          },
          {
            q: 'Bạn muốn báo sếp chuyện bạn suýt lỡ chuyến bay công tác hôm qua (giờ đã ổn). Câu mở đầu tốt nhất:',
            options: [
              'So, yesterday morning, I woke up and it was raining…',
              "Everything's fine now, but I nearly missed my flight yesterday.",
              'I am very bad yesterday.',
              'You won\'t believe this, dude!',
            ],
            correct: 1,
            why: 'Với sếp: **kết quả trước** (Everything\'s fine now), rồi mới kể. (Bài Nói, mục 2)',
          },
          {
            q: 'Câu nào đúng?',
            options: ['I didn\'t saw him.', "I didn't see him.", 'I not saw him.', 'I no see him.'],
            correct: 1,
            why: "**didn't + V nguyên mẫu**. Quá khứ chỉ đánh dấu một lần.",
          },
          {
            q: '"Hai ngày trước tôi gặp cô ấy." Câu đúng:',
            options: ['Before two days, I met her.', 'I met her two days ago.', 'I met her ago two days.', 'I meet her two days before.'],
            correct: 1,
            why: '**khoảng thời gian + ago**, đứng sau: two days ago.',
          },
          {
            q: 'Bạn đang nghe người khác kể và lạc mạch ở đoạn giữa. Bạn nói:',
            options: ['Stop!', 'Sorry, I lost you there. Who called the police?', 'What? Again!', '(gật đầu cho qua)'],
            correct: 1,
            why: '**Sorry, I lost you there.** + hỏi đúng một chỗ. Gật đầu cho qua thì lát nữa bạn không hiểu kết chuyện.',
          },
          {
            q: 'Câu nào nói về KẾT QUẢ sau cả quá trình?',
            options: ['At the end, we found a taxi.', 'In the end, we found a taxi.', 'In the end of the street, we found a taxi.', 'End, we found a taxi.'],
            correct: 1,
            why: '**In the end** = cuối cùng. "at the end" cần **of + N**: at the end of the street.',
          },
          {
            q: 'Bạn của bạn người Anh nói: "I was gutted." Bạn ấy cảm thấy:',
            options: ['Rất đói', 'Rất thất vọng, buồn', 'Rất vui', 'Bị đau bụng'],
            correct: 1,
            why: '**gutted** (Anh, Úc) = cực kỳ thất vọng. Người Mỹ hay nói **bummed**.',
          },
          {
            q: '(Ôn Ngày 7) Đồng nghiệp kể: "I\'ve had a headache since this morning." Lời khuyên tự nhiên:',
            options: ['You must go to hospital.', 'You should take a break and drink some water.', 'You should to rest.', 'Why you headache?'],
            correct: 1,
            why: '**should + V**, không "to". Đau đầu thì không ai bảo đi bệnh viện (Ngày 7).',
          },
          {
            q: '(Ôn Ngày 9) Bạn đang kể chuyện thì điện thoại công việc reo. Bạn nói với bạn mình:',
            options: ['Sorry, I take this call.', "Sorry, I'll just take this. One sec.", 'Wait me.', 'I will to answer.'],
            correct: 1,
            why: "Quyết định ngay lúc nói: **I'll + V** (Ngày 9).",
          },
          {
            q: '(Ôn Ngày 6) Bạn kể lại đường đi tới homestay. Câu nào đúng thì quá khứ?',
            options: ['First, we turn left at the bridge.', 'First, we turned left at the bridge. Then we went straight for 2 km.', 'First, we turning left.', 'First, we did turned left.'],
            correct: 1,
            why: 'Ngày 6 dùng câu mệnh lệnh để **chỉ đường** (Turn left). Khi **kể lại** đường mình đã đi thì chuyển sang quá khứ: turned, went.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền động từ ở dạng đúng' },
      {
        t: 'quiz',
        id: 'gtd11-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: "V-ed / V2 · didn't · Did · was / were · ago · In the end",
        items: [
          { q: 'Last Saturday we ___ (take) a boat to the market.', answers: ['took'] },
          { q: 'The street ___ completely flooded. (be)', answers: ['was'] },
          { q: 'We ___ really tired after the trip. (be)', answers: ['were'] },
          { q: '___ you call the driver? — Yes, but he didn\'t answer.', answers: ['Did', 'did'] },
          { q: 'She ___ (buy) six pineapples from the woman.', answers: ['bought'] },
          { q: 'I met Graham three months ___.', answers: ['ago'] },
          { q: 'He ___ (not find) his keys, so he called a locksmith. (dạng rút gọn)', answers: ["didn't find", 'didn’t find', 'did not find'] },
          { q: 'In the ___, everything was fine.', answers: ['end'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd11-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "quá khứ đơn · first, then, after that, in the end · No way! · Then what?",
        items: [
          { q: 'Bạn không tin nổi chuyện gì đã xảy ra đâu.', hint: "won't believe", answers: ["You won't believe what happened.", 'You will not believe what happened.'] },
          { q: 'Mình để quên điện thoại trên xe buýt.', hint: 'leave, on the bus', answers: ['I left my phone on the bus.', 'I left my phone on a bus.'] },
          { q: 'Rồi sao nữa?', hint: 'then / next', answers: ['Then what?', 'What happened next?', 'And then?', 'What happened then?'] },
          { q: 'Đầu tiên mình gọi cho cô ấy, sau đó mình nhắn tin.', hint: 'first, call, then / after that, text', answers: ['First, I called her, and then I texted her.', 'First, I called her. Then I texted her.', 'First, I called her. After that, I texted her.', 'First I called her, then I texted her.', 'First, I called her, then I texted her.', 'First, I called her, and after that I texted her.', 'First, I called her. Then I sent her a message.', 'First, I called her. After that, I sent her a message.'] },
          { q: 'Bỗng nhiên mất điện.', hint: 'suddenly, the power, go out', answers: ['Suddenly, the power went out.', 'Suddenly the power went out.', 'Suddenly, the electricity went out.', 'Suddenly, the lights went out.', 'Suddenly the lights went out.', 'Suddenly, the power went off.', 'Suddenly the power went off.'] },
          { q: 'May mà không ai bị thương.', hint: 'luckily, nobody, hurt', answers: ['Luckily, nobody was hurt.', 'Luckily nobody was hurt.', 'Luckily, no one was hurt.', 'Luckily no one was hurt.', 'Luckily, nobody got hurt.', 'Luckily, no one got hurt.'] },
          { q: 'Bạn không sao là mừng rồi.', hint: 'glad, okay', answers: ["I'm glad you're okay.", "I'm glad you're OK.", 'I am glad you are okay.', "I'm glad you're all right.", "I'm so glad you're okay."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd11-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'I locked myself out last night.', answer: 'I locked myself out last night.' },
          { label: 'Câu 2', spell: 'What did you do after that?', answer: 'What did you do after that?' },
          { label: 'Câu 3', spell: "Unfortunately, he didn't answer.", answer: "Unfortunately, he didn't answer.", alt: ['Unfortunately he did not answer.', 'Unfortunately, he did not answer.', "Unfortunately he didn't answer."] },
          { label: 'Câu 4', spell: 'We decided to wait an hour.', answer: 'We decided to wait an hour.', alt: ['We decided to wait 1 hour.', 'We decided to wait one hour.'] },
          { label: 'Câu 5', spell: 'That sounds scary!', answer: 'That sounds scary!' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd11-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Lúc mình về, trời đang mưa rất to.', chips: ['When', 'I', 'left,', 'it', 'was', 'raining', 'really', 'hard.', 'rained', 'is'], answer: ['When', 'I', 'left,', 'it', 'was', 'raining', 'really', 'hard.'] },
          { vi: 'Bạn phát hiện ra lúc nào?', chips: ['When', 'did', 'you', 'notice?', 'noticed', 'do'], answer: ['When', 'did', 'you', 'notice?'] },
          { vi: 'Sau đó mình tìm được một chú sửa xe.', chips: ['After', 'that,', 'I', 'found', 'a', 'mechanic.', 'find', 'the'], answer: ['After', 'that,', 'I', 'found', 'a', 'mechanic.'] },
          { vi: 'Cô ấy kéo thuyền bọn mình tới chợ.', chips: ['She', 'pulled', 'our', 'boat', 'to', 'the', 'market.', 'pull', 'us'], answer: ['She', 'pulled', 'our', 'boat', 'to', 'the', 'market.'] },
          { vi: 'Cuối cùng chẳng ai để ý.', chips: ['In', 'the', 'end,', 'nobody', 'noticed.', 'At', 'notice'], answer: ['In', 'the', 'end,', 'nobody', 'noticed.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Kể **câu chuyện 1 phút** của bạn 3 lần. Lần ba ghi âm và bấm giờ.',
          'Nghe lại bản ghi, đếm xem bạn nói **sai thì** bao nhiêu chỗ (go thay cho went…). Ghi số đó lại, mai kể lại xem có giảm không.',
          'Ngày 12: khen, cảm ơn, xin lỗi, chia buồn, chúc mừng — nói đúng cảm xúc, đúng mức. Cuối Ngày 12 có **bài kiểm tra chặng 2** (Ngày 7–12).',
        ],
      },
    ],
  },
];
