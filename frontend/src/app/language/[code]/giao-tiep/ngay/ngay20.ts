/**
 * Tiếng Anh giao tiếp — NGÀY 20 (chặng 4 "Giao tiếp sâu", B1+ → B2): đón khách nước ngoài, giới thiệu Việt Nam.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd20-`.
 * Ngữ pháp trong câu: bị động đơn giản (is made from · is eaten with · was built in · isn't allowed).
 * Nối câu: which · which means · also known as.
 * Cảnh: Lộc — sinh viên IT năm 3 đang OJT ở một công ty phần mềm tại Hà Nội — được chị Nora (quản lý, người Anh) giao đón
 * hai khách của công ty khách hàng sang thăm văn phòng: Fergus (Dublin, lần đầu tới châu Á) và Lauren (Calgary, ăn chay).
 * Ba cảnh: sân bay Nội Bài (tấm biển ghi nhầm hai tên thành một người, qua đường, tiền Việt) · bữa tối (Lộc đặt chả cá
 * rồi mới nhớ ra Lauren ăn chay, đổi sang quán chay) · Văn Miếu buổi sáng (lịch sử ngắn, bia tiến sĩ, kế hoạch đi lăng
 * mà mặc quần đùi).
 * Khác podcast en-a2-03 (hai bạn Việt lên kế hoạch đi Đà Lạt): hôm nay người Việt là CHỦ NHÀ giải thích Việt Nam cho khách.
 * Dữ kiện lịch sử, món ăn, phong tục đã soát; chỗ không chắc (giờ mở cửa lăng, giá Grab) nói chung chung.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_20: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd20-nghe',
    kind: 'listening',
    title: 'Đón khách nước ngoài: giới thiệu Việt Nam',
    goal: 'Nghe hiểu ba cảnh đón khách ở Hà Nội: ở sân bay, ở bữa tối và ở một di tích; nghe ra khách cần gì, khách ngại gì, và cách chủ nhà giải thích món ăn, phong tục, lịch sử bằng câu bị động.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn là chủ nhà',
        items: [
          'Ngày 19 bạn đi gặp người lạ. Hôm nay người lạ tới **nhà mình**: bạn theo **Lộc**, sinh viên IT năm 3 đang OJT ở Hà Nội, được giao đón hai khách của công ty khách hàng trong ba ngày.',
          'Khách là **Fergus** (người Ireland, lần đầu tới châu Á) và **Lauren** (người Canada, ăn chay). Họ hỏi đủ thứ: qua đường thế nào, tiền nào là tiền nào, món này làm bằng gì, cái đền này xây năm nào.',
          'Bạn sẽ nghe rất nhiều câu **bị động**: "It\'s **made from** rice", "It **was built** in 1070", "You **aren\'t allowed** to touch them". Khi giới thiệu đất nước mình, đây là kiểu câu dùng nhiều nhất.',
          'Tốc độ vẫn khoảng **160 từ/phút**. Fergus nói giọng Ireland: chú ý "th" của anh hay nghe như "t" (**three** gần như "tree").',
          'Nghe mỗi cảnh **2 lần**. Lần 1 ghi ra: khách hỏi gì, Lộc trả lời bằng thông tin gì (năm, món, quy định).',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Sân bay Nội Bài: một tấm biển, hai vị khách' },
      {
        t: 'canh',
        anh: ['airplane-arrival', 'placard', 'man-office-worker', 'man-beard', 'woman-blonde-hair', 'luggage'],
        caption: '6 giờ sáng ở sảnh đến quốc tế. **Lộc** giơ tấm biển ghi **LAUREN FERGUS** vì chị Nora nhắn "pick up Lauren Fergus" qua điện thoại. Một người đàn ông râu đỏ và một chị tóc vàng cùng đi tới, cười.',
      },
      {
        t: 'listen',
        id: 'gtd20-nghe-canh1',
        title: 'Scene 1 — Arrivals',
        note: 'Nghe xem Lộc hiểu nhầm điều gì, xe đi vào thành phố mất bao lâu, và Lộc dặn khách gì về qua đường và tiền.',
        lines: [
          { who: 'Fergus', voice: 'ie-nam', text: "Morning! I think that sign's for us. I'm Fergus, and this is Lauren.", vi: 'Chào buổi sáng! Hình như tấm biển đó là cho bọn tôi. Tôi là Fergus, còn đây là Lauren.' },
          { who: 'Lộc', voice: 'us-nam', text: "Oh! I'm so sorry. I thought Lauren Fergus was one person. Welcome to Hanoi! I'm Lộc.", vi: 'Ôi! Em xin lỗi. Em tưởng Lauren Fergus là một người. Chào mừng anh chị tới Hà Nội! Em là Lộc.' },
          { who: 'Lauren', voice: 'ca-nu', text: "Ha, don't worry. Honestly, it's a great name. Maybe we should share it." },
          { who: 'Lộc', voice: 'us-nam', text: "How was your flight? You must be exhausted.", vi: 'Chuyến bay thế nào ạ? Chắc anh chị mệt lắm.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Long. Dublin to Doha, then Doha to here. But I slept for about three hours, so I'm grand.", vi: 'Dài. Dublin đi Doha, rồi Doha sang đây. Nhưng tôi ngủ được khoảng ba tiếng nên ổn cả.' },
          { who: 'Lộc', voice: 'us-nam', text: "Let me take that for you. The car's just outside. It's about forty-five minutes to your hotel, a bit more in rush hour.", vi: 'Để em cầm giúp. Xe ở ngay ngoài. Về khách sạn mất khoảng bốn mươi lăm phút, giờ cao điểm thì lâu hơn chút.' },
          { who: 'Lauren', voice: 'ca-nu', text: "Wow, look at all those motorbikes. Is it always like this?", vi: 'Ôi, nhìn bao nhiêu xe máy kìa. Lúc nào cũng thế này à?' },
          { who: 'Lộc', voice: 'us-nam', text: "Pretty much. Motorbikes are used for everything here: going to work, school runs, even moving a fridge.", vi: 'Gần như vậy. Ở đây xe máy được dùng vào mọi việc: đi làm, đưa con đi học, thậm chí chở cả tủ lạnh.' },
          { who: 'Fergus', voice: 'ie-nam', text: "So how do we cross the road without dying?", vi: 'Vậy bọn tôi qua đường kiểu gì để khỏi chết?' },
          { who: 'Lộc', voice: 'us-nam', text: "Walk slowly and keep going at the same speed. Don't run, and don't stop suddenly. The riders will go around you.", vi: 'Đi chậm và giữ đều tốc độ. Đừng chạy, đừng dừng đột ngột. Người đi xe sẽ tránh anh chị.' },
          { who: 'Lauren', voice: 'ca-nu', text: "That's terrifying. Okay. And money? I changed some at the airport, but there are so many zeros.", vi: 'Nghe đáng sợ thật. Thôi được. Còn tiền thì sao? Tôi đổi một ít ở sân bay, mà nhiều số không quá.' },
          { who: 'Lộc', voice: 'us-nam', text: "Be careful with the blue ones. The twenty-thousand note and the five-hundred-thousand note look quite similar.", vi: 'Cẩn thận mấy tờ màu xanh. Tờ hai mươi nghìn với tờ năm trăm nghìn trông khá giống nhau.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Good to know. How much is that in euros?", vi: 'May mà biết. Tờ đó bằng bao nhiêu euro?' },
          { who: 'Lộc', voice: 'us-nam', text: "Five hundred thousand is somewhere under twenty euros. And a lot of places take QR codes or cards now, so you won't need much cash.", vi: 'Năm trăm nghìn thì dưới hai mươi euro một chút. Và giờ nhiều chỗ nhận mã QR hoặc thẻ nên anh chị không cần nhiều tiền mặt đâu.' },
          { who: 'Lauren', voice: 'ca-nu', text: "Should we tip the driver?", vi: 'Có nên boa cho tài xế không?' },
          { who: 'Lộc', voice: 'us-nam', text: "Tips aren't expected here, but they're always appreciated. Rounding up is fine.", vi: 'Ở đây người ta không trông chờ tiền boa, nhưng có thì ai cũng quý. Làm tròn số lên là được.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Perfect. Lộc, you're a better guide than my phone already." },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd20-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Lộc hiểu nhầm điều gì?',
            options: ['Nhầm giờ máy bay hạ cánh', 'Tưởng "Lauren Fergus" là tên của một người', 'Nhầm Fergus là người Mỹ', 'Đón nhầm sân bay'],
            correct: 1,
            why: '"I thought **Lauren Fergus was one person**." Bài học thật: nhận tên khách qua tin nhắn thì hỏi lại "Is that one person or two?" trước khi in biển.',
          },
          {
            q: 'Fergus nói "I\'m grand." Nghĩa là gì?',
            options: ['Tôi rất quan trọng', 'Tôi ổn cả', 'Tôi rất mệt', 'Tôi đói'],
            correct: 1,
            why: 'Ở Ireland, **grand** = ổn, được (không phải "vĩ đại"). "I\'m grand, thanks" là câu rất hay nghe.',
          },
          {
            q: 'Lộc khuyên qua đường thế nào?',
            options: ['Chạy thật nhanh', 'Giơ tay chặn xe lại', 'Đi chậm, giữ đều tốc độ, không chạy, không dừng đột ngột', 'Chờ hết xe mới đi'],
            correct: 2,
            why: '"Walk slowly and **keep going at the same speed**. Don\'t run, and don\'t stop suddenly." Người đi xe đoán được hướng đi của bạn nên sẽ tránh.',
          },
          {
            q: '"Tips aren\'t expected here, but they\'re always appreciated." Ý là gì?',
            options: ['Bắt buộc boa 10%', 'Cấm boa', 'Không ai đòi tiền boa, nhưng boa thì người ta quý', 'Chỉ boa bằng thẻ'],
            correct: 2,
            why: 'Hai câu **bị động**: aren\'t **expected** (không được trông chờ) · are **appreciated** (được trân trọng). Khác hẳn ở Mỹ, nơi tiền boa gần như bắt buộc.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Bữa tối: "Is there fish sauce in this?"' },
      {
        t: 'canh',
        anh: ['shallow-pan-of-food', 'fish', 'herb', 'leafy-green', 'grinning-face-with-sweat', 'beer-mug'],
        caption: '7 giờ tối. Lộc đã đặt bàn ở một quán **chả cá** gần phố cổ. Đang đi bộ tới quán thì Lauren hỏi một câu làm Lộc toát mồ hôi.',
      },
      {
        t: 'listen',
        id: 'gtd20-nghe-canh2',
        title: 'Scene 2 — Dinner plans',
        note: 'Nghe xem chả cá được làm thế nào, vì sao Lộc đổi kế hoạch, và ở quán mới các món được làm từ gì.',
        lines: [
          { who: 'Lauren', voice: 'ca-nu', text: "So what are we having tonight? I'm starving.", vi: 'Tối nay mình ăn gì thế? Tôi đói lả rồi.' },
          { who: 'Lộc', voice: 'us-nam', text: "It's a Hanoi speciality called chả cá. The fish is marinated in turmeric, then it's cooked at your table with lots of dill and spring onions.", vi: 'Một đặc sản Hà Nội tên là chả cá. Cá được ướp nghệ, rồi được nấu ngay tại bàn với rất nhiều thì là và hành lá.' },
          { who: 'Fergus', voice: 'ie-nam', text: "That sounds class. What's it eaten with?", vi: 'Nghe tuyệt đấy. Ăn kèm với gì?' },
          { who: 'Lộc', voice: 'us-nam', text: "Rice noodles, peanuts, fresh herbs, and a dipping sauce. There's even a street in the Old Quarter that's named after the dish.", vi: 'Bún, lạc, rau thơm và nước chấm. Phố cổ còn có hẳn một con phố được đặt theo tên món này.' },
          { who: 'Lauren', voice: 'ca-nu', text: "Oh. Um, Lộc… I should've said this earlier. I'm vegetarian. I don't eat fish either.", vi: 'Ôi. Ừm, Lộc… lẽ ra tôi phải nói sớm hơn. Tôi ăn chay. Tôi cũng không ăn cá.' },
          { who: 'Lộc', voice: 'us-nam', text: "Oh no, of course. That's my fault. Nora did tell me. Give me one minute.", vi: 'Ôi không, đúng rồi. Lỗi của em. Chị Nora có dặn em rồi. Chờ em một phút.' },
          { who: 'Lauren', voice: 'ca-nu', text: "Please don't go to any trouble. I can just have rice and vegetables.", vi: 'Đừng bày vẽ gì nhé. Tôi ăn cơm với rau là được.' },
          { who: 'Lộc', voice: 'us-nam', text: "The thing is, a lot of vegetable dishes here are cooked with fish sauce, so they aren't really vegetarian.", vi: 'Có điều là ở đây nhiều món rau được nấu với nước mắm, nên thật ra không chay.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Is fish sauce in everything?" },
          { who: 'Lộc', voice: 'us-nam', text: "Almost. But there's a really good vegetarian restaurant near a pagoda, ten minutes from here. Is that okay with you, Fergus? We can do chả cá another night.", vi: 'Gần như vậy. Nhưng có một quán chay rất ngon gần một ngôi chùa, cách đây mười phút. Anh Fergus thấy được không? Hôm khác mình đi chả cá.' },
          { who: 'Fergus', voice: 'ie-nam', text: "I'm easy. I'll try anything once.", vi: 'Tôi sao cũng được. Món gì tôi cũng thử một lần.' },
          { who: 'Lộc', voice: 'us-nam', text: "Lots of people here eat vegetarian on the first and fifteenth days of the lunar month. That's why vegetarian places are usually found near pagodas.", vi: 'Nhiều người ở đây ăn chay vào mùng một và ngày rằm âm lịch. Vì thế quán chay thường nằm gần chùa.' },
          { who: 'Lauren', voice: 'ca-nu', text: "Wait, is this pork? It looks exactly like pork.", vi: 'Khoan, đây là thịt lợn à? Trông y hệt thịt lợn.' },
          { who: 'Lộc', voice: 'us-nam', text: "It's made from tofu and mushrooms. It's made to look like meat, which is a bit of a tradition in vegetarian restaurants here.", vi: 'Nó được làm từ đậu phụ và nấm. Nó được làm cho giống thịt, cũng là một kiểu truyền thống ở các quán chay ở đây.' },
          { who: 'Fergus', voice: 'ie-nam', text: "And these crispy rolls?" },
          { who: 'Lộc', voice: 'us-nam', text: "In the north they're called nem. In the south, they're called chả giò. Same idea, different name.", vi: 'Ở miền Bắc gọi là nem. Ở miền Nam gọi là chả giò. Cùng một kiểu, khác tên.' },
          { who: 'Lauren', voice: 'ca-nu', text: "This is amazing. Thank you for changing everything for me.", vi: 'Ngon tuyệt. Cảm ơn em đã đổi hết kế hoạch vì tôi.' },
          { who: 'Lộc', voice: 'us-nam', text: "My pleasure. Next time, I'll read Nora's messages more carefully. Twice." },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd20-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Chả cá được làm thế nào theo lời Lộc?',
            options: ['Cá luộc chấm nước mắm', 'Cá ướp nghệ, nấu tại bàn với thì là và hành lá', 'Cá nướng than ăn với cơm', 'Cá sống thái lát'],
            correct: 1,
            why: '"The fish **is marinated** in turmeric, then it\'s **cooked** at your table with lots of dill and spring onions." Hai động từ bị động: is marinated, is cooked.',
          },
          {
            q: 'Vì sao Lộc không để Lauren chỉ ăn cơm với rau ở quán chả cá?',
            options: ['Quán không có rau', 'Nhiều món rau ở đây được nấu với nước mắm, nên không chay thật', 'Rau ở đó đắt', 'Lauren không thích rau'],
            correct: 1,
            why: '"A lot of vegetable dishes here **are cooked with fish sauce**, so they aren\'t really vegetarian." Với khách ăn chay, đây là điều quan trọng nhất cần biết.',
          },
          {
            q: 'Fergus nói "I\'m easy." Ý anh là gì?',
            options: ['Tôi dễ tính, sao cũng được', 'Việc đó dễ', 'Tôi rảnh', 'Tôi mệt'],
            correct: 0,
            why: '**I\'m easy** = tôi sao cũng được, không kén. Đi kèm "I\'ll try anything once" = món gì cũng thử một lần.',
          },
          {
            q: 'Vì sao quán chay thường ở gần chùa, theo Lộc?',
            options: ['Vì nhà chùa mở quán', 'Vì nhiều người ăn chay vào mùng một và ngày rằm âm lịch', 'Vì gần chùa giá rẻ', 'Vì luật quy định'],
            correct: 1,
            why: '"Lots of people here eat vegetarian on **the first and fifteenth days of the lunar month**. **That\'s why**…" (từ nối Ngày 19).',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Văn Miếu: lịch sử trong mười phút' },
      {
        t: 'canh',
        anh: ['classical-building', 'turtle', 'scroll', 'graduation-cap', 'shorts'],
        caption: '8 giờ sáng hôm sau ở **Văn Miếu – Quốc Tử Giám**. Fergus mặc quần đùi, áo ba lỗ. Anh định chiều nay đi **lăng Chủ tịch Hồ Chí Minh**.',
      },
      {
        t: 'listen',
        id: 'gtd20-nghe-canh3',
        title: 'Scene 3 — At the Temple of Literature',
        note: 'Nghe các năm (1070, 1076, 1010) và xem vì sao Fergus phải về khách sạn thay đồ.',
        lines: [
          { who: 'Lauren', voice: 'ca-nu', text: "This place is so peaceful. How old is it?", vi: 'Chỗ này yên bình quá. Nó bao nhiêu tuổi rồi?' },
          { who: 'Lộc', voice: 'us-nam', text: "It was built in 1070, so more than nine hundred and fifty years old. It's called the Temple of Literature, and it's dedicated to Confucius.", vi: 'Nó được xây năm 1070, tức là hơn chín trăm năm mươi năm. Nó được gọi là Văn Miếu, và được lập để thờ Khổng Tử.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Confucius? I thought he was Chinese.", vi: 'Khổng Tử à? Tôi tưởng ông ấy là người Trung Quốc.' },
          { who: 'Lộc', voice: 'us-nam', text: "He was. But his ideas about learning were followed in Vietnam for centuries. In 1076, the country's first university was opened right here.", vi: 'Đúng vậy. Nhưng tư tưởng về học hành của ông được theo ở Việt Nam suốt nhiều thế kỷ. Năm 1076, trường đại học đầu tiên của đất nước được mở ngay tại đây.' },
          { who: 'Lauren', voice: 'ca-nu', text: "And what are these stones on the turtles?", vi: 'Còn mấy tấm đá đặt trên lưng rùa này là gì?' },
          { who: 'Lộc', voice: 'us-nam', text: "They're called steles. There are eighty-two of them. The names of people who passed the highest royal exams were carved on them, from 1442 to 1779.", vi: 'Chúng được gọi là bia. Có tám mươi hai tấm. Tên những người đỗ khoa thi cao nhất của triều đình được khắc lên đó, từ năm 1442 tới 1779.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Can I touch the turtle's head? For luck?", vi: 'Tôi sờ đầu rùa được không? Lấy may ấy?' },
          { who: 'Lộc', voice: 'us-nam', text: "Students used to do that before exams, but now the steles are protected, so you aren't allowed to touch them.", vi: 'Ngày trước học sinh hay làm vậy trước kỳ thi, nhưng giờ bia được bảo vệ, nên không được sờ nữa.' },
          { who: 'Lauren', voice: 'ca-nu', text: "Was Hanoi always the capital?", vi: 'Hà Nội lúc nào cũng là thủ đô à?' },
          { who: 'Lộc', voice: 'us-nam', text: "Not always. The capital was moved here in 1010. Back then the city was called Thăng Long, which means \"rising dragon\". In the 1800s the kings moved to Huế, and Hanoi became the capital again in the twentieth century.", vi: 'Không phải lúc nào cũng vậy. Kinh đô được dời về đây năm 1010. Hồi đó thành phố tên là Thăng Long, nghĩa là "rồng bay lên". Thế kỷ 19 các vua dời kinh đô vào Huế, và sang thế kỷ 20 Hà Nội mới lại thành thủ đô.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Brilliant. So this afternoon, the mausoleum. Is it far?", vi: 'Hay thật. Thế chiều nay đi lăng. Có xa không?' },
          { who: 'Lộc', voice: 'us-nam', text: "Not far. But, um, there's a dress code. Shorts and sleeveless tops aren't allowed. You'll need to cover your knees and shoulders.", vi: 'Không xa. Nhưng, ừm, có quy định trang phục. Quần đùi và áo sát nách không được phép. Anh cần che đầu gối và vai.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Ah. So I'm dressed for the beach, basically.", vi: 'À. Tức là tôi đang ăn mặc như đi biển, nói gọn là vậy.' },
          { who: 'Lộc', voice: 'us-nam', text: "A little bit. Also, I think it's only open in the mornings, and it closes for a couple of months every year for maintenance. Let me check online before we go.", vi: 'Hơi hơi ạ. Với lại, em nghĩ là lăng chỉ mở buổi sáng, và mỗi năm đóng cửa khoảng hai tháng để bảo trì. Để em kiểm trên mạng trước khi mình đi.' },
          { who: 'Lauren', voice: 'ca-nu', text: "And photos inside?" },
          { who: 'Lộc', voice: 'us-nam', text: "Not allowed. And people stay quiet and keep their hands out of their pockets. It's very formal.", vi: 'Không được phép. Và mọi người giữ im lặng, không đút tay vào túi. Rất trang nghiêm.' },
          { who: 'Fergus', voice: 'ie-nam', text: "Right. Hotel first, then. I'll find some trousers." },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd20-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Văn Miếu được xây năm nào?',
            options: ['1010', '1070', '1076', '1442'],
            correct: 1,
            why: '"It **was built in 1070**." 1076 là năm mở trường đại học (Quốc Tử Giám), 1010 là năm dời kinh đô về Thăng Long.',
          },
          {
            q: 'Trên các tấm bia đặt trên lưng rùa có gì?',
            options: ['Lời dạy của Khổng Tử', 'Tên những người đỗ khoa thi cao nhất', 'Tên các vua', 'Bản đồ Hà Nội xưa'],
            correct: 1,
            why: '"The names of people who passed the highest royal exams **were carved** on them, from 1442 to 1779."',
          },
          {
            q: 'Vì sao Fergus phải về khách sạn trước khi đi lăng?',
            options: ['Quên vé', 'Quần đùi và áo sát nách không được phép; phải che vai và đầu gối', 'Lăng đóng cửa buổi chiều', 'Anh mệt'],
            correct: 1,
            why: '"Shorts and sleeveless tops **aren\'t allowed**. You\'ll need to cover your knees and shoulders." Fergus đùa: "I\'m dressed for the beach".',
          },
          {
            q: 'Khi không chắc giờ mở cửa, Lộc làm gì?',
            options: ['Đoán đại một giờ', 'Nói "I think…" rồi hứa kiểm trên mạng', 'Bảo khách tự tra', 'Không nói gì'],
            correct: 1,
            why: '"**I think** it\'s only open in the mornings… **Let me check online** before we go." Chủ nhà tốt **không bịa**: nói mức chắc chắn của mình rồi kiểm lại.',
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Lịch sử Hà Nội ngắn gọn — từng mốc là một câu bị động',
        caption: 'Khách nước ngoài không cần mười mốc. Ba–bốn mốc kèm một câu chuyện (rồng bay, trả gươm, bia tiến sĩ) là họ nhớ cả chuyến đi.',
        steps: [
          { label: '1010', sub: 'The capital **was moved** to Thăng Long ("rising dragon").' },
          { label: '1070', sub: 'The Temple of Literature **was built**.' },
          { label: '1076', sub: "Vietnam's first university **was opened** there." },
          { label: '1428', sub: 'Lê Lợi became king. In the legend, his magic sword **was returned** to a golden turtle in the lake, which is why it\'s **called** Hoàn Kiếm, "returned sword".' },
          { label: '1442–1779', sub: "Doctors' names **were carved** on stone steles." },
          { label: '2010', sub: "Hanoi's 1,000th birthday **was celebrated**." },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Câu bị động có **was / is / are** đọc rất nhẹ, dễ nghe sót. Năm đọc theo **cặp số**: 1070 = "ten seventy", 1010 = "ten ten", 1442 = "fourteen forty-two". Viết năm bằng số cũng được tính đúng.',
      },
      {
        t: 'dictation',
        id: 'gtd20-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — xe máy', spell: 'Motorbikes are used for everything here.', answer: 'Motorbikes are used for everything here.' },
          { label: 'Câu 2 — tiền boa', spell: "Tips aren't expected, but they're appreciated.", answer: "Tips aren't expected, but they're appreciated.", alt: ['Tips are not expected, but they are appreciated.', "Tips aren't expected but they're appreciated."] },
          { label: 'Câu 3 — chả cá', spell: "It's cooked at your table with lots of dill.", answer: "It's cooked at your table with lots of dill.", alt: ['It is cooked at your table with lots of dill.'] },
          { label: 'Câu 4 — món chay', spell: "It's made from tofu and mushrooms.", answer: "It's made from tofu and mushrooms.", alt: ['It is made from tofu and mushrooms.'] },
          { label: 'Câu 5 — Văn Miếu (năm 1070)', spell: 'It was built in 1070.', answer: 'It was built in 1070.', alt: ['It was built in ten seventy.'] },
          { label: 'Câu 6 — bia', spell: "You aren't allowed to touch them.", answer: "You aren't allowed to touch them.", alt: ['You are not allowed to touch them.', "You're not allowed to touch them."] },
          { label: 'Câu 7 — trang phục', spell: "You'll need to cover your knees and shoulders.", answer: "You'll need to cover your knees and shoulders.", alt: ['You will need to cover your knees and shoulders.'] },
        ],
      },

      { t: 'h', text: 'Khách nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Khách nói', 'Nghĩa thật', 'Chủ nhà đáp'],
        rows: [
          ["I'm easy. / I don't mind.", 'Sao cũng được, bạn chọn đi. Đừng hỏi lại năm lần.', "Okay, let's try… then."],
          ["Please don't go to any trouble.", 'Đừng bày vẽ vì tôi. Thường là lịch sự, nhưng cũng có thể thật sự ngại.', "It's no trouble at all."],
          ["I'll try anything once.", 'Tôi dám thử, cứ gọi món lạ.', 'Then you have to try…'],
          ["Hmm, it's… interesting.", 'Nhiều khả năng là **không hợp khẩu vị**. Đừng ép ăn tiếp.', 'No worries, try this one instead.'],
          ["It's an acquired taste.", 'Món phải ăn quen mới thích (mắm tôm, sầu riêng…).', 'Ha, true! Most Vietnamese kids hate it at first too.'],
          ["I'm a bit jet-lagged.", 'Tôi lệch múi giờ, mệt. Đừng xếp lịch dày.', "Let's keep it light today."],
          ["Can we play it by ear?", 'Để tuỳ tình hình, đừng chốt lịch chặt quá.', 'Sure. Just message me when you\'re ready.'],
          ['I\'m grand. (Ireland)', 'Tôi ổn.', 'Great!'],
        ],
        caption: 'Khách phương Tây **ít khi nói thẳng "tôi không thích"** khi được mời. Nghe ra "interesting", "not really my thing", "I\'m okay, thanks" là đổi món, đừng gắp thêm.',
      },
      {
        t: 'note',
        title: 'Mẹo: khách hỏi điều bạn không biết, hoặc nói nhanh quá',
        items: [
          'Khách hỏi năm, giá, giờ mở cửa mà bạn không chắc: **đừng bịa**. Nói mức chắc của mình: "**I think** it\'s…, but **let me check**." hoặc "**I\'m not 100% sure.** I\'ll look it up." Khách tin bạn hơn, không kém đi.',
          'Câu hỏi khó (lịch sử, chính trị, tôn giáo): mua thời gian bằng "**Good question. Let me think how to explain it.**" Rồi trả lời ngắn, đúng những gì bạn chắc.',
          'Không nghe kịp câu hỏi dài: **nhắc lại phần bạn nghe được** để khách bổ sung: "So you\'re asking **why the turtles are there**?"',
          'Giọng Ireland của Fergus: "th" nghe gần như "t" (**three** ≈ "tree", **think** ≈ "tink"), và hay nói **grand** (ổn), **class** (tuyệt), **sound** (được, người tốt). Không chắc thì hỏi: "Sorry, what does \'class\' mean here?"',
          'Tên món, tên đường tiếng Việt: **viết ra** cho khách (có dấu) thay vì đánh vần. Tài xế, người bán hàng đọc chữ có dấu nhanh hơn nghe khách đọc.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh / Ireland', 'Mỹ', 'Úc / Canada'],
        rows: [
          ['Hoá đơn ở quán ăn', 'the bill', 'the check', 'the bill'],
          ['Mang về', 'takeaway', 'takeout · to go', 'takeaway (Úc) · takeout (Canada)'],
          ['Vỉa hè', 'pavement', 'sidewalk', 'footpath (Úc) · sidewalk (Canada)'],
          ['Nhà vệ sinh', 'the toilet · the loo', 'the restroom · the bathroom', 'the toilet (Úc) · the washroom (Canada)'],
          ['Xe máy', 'motorbike', 'motorcycle · scooter', 'motorbike'],
          ['Ngon tuyệt', 'lovely · class (Ireland)', 'awesome · so good', 'delicious · beaut (Úc)'],
          ['Ổn cả', "I'm grand. (Ireland) · I'm fine.", "I'm good.", "I'm good. · No worries."],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc – Canada khi đi ăn, đi lại. Lauren người Canada nên hỏi "Where\'s the **washroom**?", một từ Mỹ ít dùng.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-a2-03 · A Weekend in Da Lat** — hai bạn Việt lên kế hoạch đi Đà Lạt bằng xe khách đêm. Cùng chủ đề du lịch, nhưng ở đó người Việt là khách đi chơi; hôm nay bạn là chủ nhà.',
          '**en-ds-a2-01 · Checking In** — nhận phòng khách sạn: nghe để biết khách của bạn sẽ gặp những câu gì ở quầy lễ tân.',
          '**en-ds-a1-04 · Where To?** — đi taxi, nói điểm đến: dễ, nghe lại để ôn câu chỉ đường trước khi viết tin hướng dẫn cho khách ở bài Viết.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd20-noi',
    kind: 'speaking',
    title: 'Giải thích món ăn, phong tục, lịch sử ngắn',
    goal: 'Giải thích một món ăn Việt trong 4 câu, nói rõ một phong tục và lý do của nó, kể một đoạn lịch sử ngắn bằng câu bị động, nhắc khách quy định mà không ra lệnh, và nói thật khi mình không chắc.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** của một chủ nhà: đón khách, giới thiệu món ăn, nhắc phong tục, kể lịch sử, nói "tôi không chắc".',
          'Ngữ pháp: **bị động đơn giản**. Khi giới thiệu đất nước, cái quan trọng là **món ăn, ngôi đền, phong tục**, không phải "ai làm ra nó", nên câu bị động tự nhiên hơn.',
          'Nối câu: **which · which means · also known as** để thêm lời giải thích ngay sau tên tiếng Việt.',
          'Ngôn ngữ cơ thể **của người Việt** mà khách hay hiểu nhầm: vẫy tay gọi, cười khi ngại, gắp thức ăn cho khách.',
          'Ôn Ngày 19: khách cũng là người bạn đang **networking**. Hỏi nối tiếp về quê họ để cuộc nói chuyện thành hai chiều.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo thứ tự một chuyến tiếp khách: **đón → ăn → phong tục → lịch sử → dặn dò**. Bấm loa, nói to theo, rồi **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Welcome to Hanoi!', pos: 'phr', ipa: '/ˈwelkəm tə hæˈnɔɪ/', vi: 'Chào mừng tới Hà Nội!', ex: "Welcome to Hanoi! I'm Lộc. I'll be looking after you this week.", exVi: 'Chào mừng tới Hà Nội! Em là Lộc. Tuần này em sẽ lo cho anh chị.', more: '**look after** = chăm lo, đón tiếp.' },
          { w: 'You must be exhausted.', pos: 'phr', ipa: '/ju ˈmʌst bi ɪɡˈzɔːstɪd/', vi: 'Chắc bạn mệt lắm.', ex: 'Fourteen hours? You must be exhausted.', exVi: 'Mười bốn tiếng à? Chắc anh mệt lắm.' },
          { w: 'Let me take that for you.', pos: 'phr', ipa: '/let mi ˈteɪk ðæt fər ju/', vi: 'Để tôi cầm giúp.', ex: "Let me take that for you. The car's just outside.", exVi: 'Để em cầm giúp. Xe ở ngay ngoài.', anh: 'luggage' },
          { w: "It's about … to the city, depending on traffic.", pos: 'phr', ipa: '/ɪts əˈbaʊt … tə ðə ˈsɪti dɪˈpendɪŋ ɑːn ˈtræfɪk/', vi: 'Vào thành phố mất khoảng …, tuỳ đường đông hay vắng.', ex: "It's about forty-five minutes to the city, depending on traffic.", exVi: 'Vào thành phố mất khoảng bốn lăm phút, tuỳ đường.' },
          { w: 'Is there anything you don\'t eat?', pos: 'phr', ipa: '/ɪz ðer ˈeniθɪŋ ju ˈdoʊnt ˈiːt/', vi: 'Có món gì bạn không ăn không?', ex: "Before I book dinner: is there anything you don't eat?", exVi: 'Trước khi em đặt bàn: có món gì anh chị không ăn không?', more: 'Hỏi **trước khi đặt bàn**, không phải khi đã ngồi vào bàn như Lộc.' },
          { w: 'Are you okay with spicy food?', pos: 'phr', ipa: '/ər ju oʊˈkeɪ wɪð ˈspaɪsi fuːd/', vi: 'Bạn ăn cay được không?', ex: "Are you okay with spicy food? This sauce has fresh chilli.", exVi: 'Chị ăn cay được không? Nước chấm này có ớt tươi.', anh: 'hot-pepper' },
          { w: "It's called…", pos: 'phr', ipa: '/ɪts ˈkɔːld/', vi: 'Nó được gọi là… / Món này tên là…', ex: "It's called bánh cuốn. It's a Hanoi breakfast.", exVi: 'Món này tên là bánh cuốn. Bữa sáng của người Hà Nội.', more: 'Giữ **tên tiếng Việt**, rồi giải thích. Đừng dịch tên món từng chữ.' },
          { w: "It's made from…", pos: 'phr', ipa: '/ɪts ˈmeɪd frəm/', vi: 'Nó được làm từ… (nguyên liệu biến đổi hẳn)', ex: "Phở noodles are made from rice flour.", exVi: 'Bánh phở được làm từ bột gạo.', more: '**made from** = nguyên liệu đã biến đổi, nhìn không ra (gạo → bánh phở). **made with** = có những thứ này bên trong (made with pork and mushrooms).' },
          { w: "It's usually eaten with…", pos: 'phr', ipa: '/ɪts ˈjuːʒuəli ˈiːtn wɪð/', vi: 'Nó thường được ăn kèm với…', ex: "It's usually eaten with fresh herbs and lime.", exVi: 'Món này thường ăn kèm rau thơm và chanh.', anh: 'herb' },
          { w: "It's a bit like…", pos: 'phr', ipa: '/ɪts ə ˈbɪt laɪk/', vi: 'Nó hơi giống…', ex: "Bánh xèo is a bit like a crispy pancake, but it's made with rice flour.", exVi: 'Bánh xèo hơi giống bánh kếp giòn, nhưng làm bằng bột gạo.', more: 'So với món **khách đã biết** là cách giải thích nhanh nhất.' },
          { w: 'Would you like to try some?', pos: 'phr', ipa: '/wʊd ju ˌlaɪk tə ˈtraɪ sʌm/', vi: 'Bạn có muốn thử một chút không?', ex: "Would you like to try some? It's okay if it's not for you.", exVi: 'Anh có muốn thử một chút không? Không hợp thì cũng không sao.' },
          { w: "It's not for everyone.", pos: 'phr', ipa: '/ɪts ˈnɑːt fər ˈevriwʌn/', vi: 'Không phải ai cũng hợp (món này).', ex: "This is mắm tôm, fermented shrimp paste. It's not for everyone.", exVi: 'Đây là mắm tôm. Không phải ai cũng ăn được.', more: 'Nói trước câu này thì khách thoải mái từ chối, không ngại.' },
          { w: 'It was built in…', pos: 'phr', ipa: '/ɪt wəz ˈbɪlt ɪn/', vi: 'Nó được xây năm…', ex: 'The temple was built in 1070.', exVi: 'Ngôi đền được xây năm 1070.', anh: 'classical-building' },
          { w: "It's dedicated to…", pos: 'phr', ipa: '/ɪts ˈdedɪkeɪtɪd tə/', vi: 'Nó được lập để thờ / dành cho…', ex: "The Temple of Literature is dedicated to Confucius.", exVi: 'Văn Miếu được lập để thờ Khổng Tử.' },
          { w: "It's said that…", pos: 'phr', ipa: '/ɪts ˈsed ðæt/', vi: 'Người ta kể rằng… (truyền thuyết)', ex: "It's said that the king returned a magic sword to a golden turtle in this lake.", exVi: 'Người ta kể rằng nhà vua trả thanh gươm thần cho rùa vàng ở hồ này.', more: 'Dùng cho **truyền thuyết**, để khách biết đây là chuyện kể, không phải sử chép.' },
          { w: 'Legend has it that…', pos: 'phr', ipa: '/ˈledʒənd hæz ɪt ðæt/', vi: 'Truyền thuyết kể rằng…', ex: 'Legend has it that a dragon rose up here, so the city was named Thăng Long.', exVi: 'Truyền thuyết kể rằng có rồng bay lên ở đây, nên thành phố được đặt tên là Thăng Long.', anh: 'dragon' },
          { w: 'It\'s a custom here to…', pos: 'phr', ipa: '/ɪts ə ˈkʌstəm hɪr tə/', vi: 'Ở đây có phong tục…', ex: "It's a custom here to take your shoes off before going into someone's home.", exVi: 'Ở đây có phong tục cởi giày trước khi vào nhà người khác.', anh: 'mans-shoe' },
          { w: "It's considered rude to…", pos: 'phr', ipa: '/ɪts kənˈsɪdərd ˈruːd tə/', vi: '… bị coi là bất lịch sự.', ex: "It's considered rude to touch an adult's head.", exVi: 'Chạm vào đầu người lớn bị coi là bất lịch sự.' },
          { w: "… aren't allowed.", pos: 'phr', ipa: '/ɑːrnt əˈlaʊd/', vi: '… không được phép.', ex: "Photos aren't allowed inside the mausoleum.", exVi: 'Trong lăng không được chụp ảnh.', anh: 'no-entry' },
          { w: "You'll need to cover your shoulders and knees.", pos: 'phr', ipa: '/jul ˈniːd tə ˈkʌvər jər ˈʃoʊldərz ən ˈniːz/', vi: 'Bạn cần che vai và đầu gối.', ex: "For the pagoda, you'll need to cover your shoulders and knees.", exVi: 'Đi chùa thì chị cần che vai và đầu gối.', more: '**You\'ll need to** mềm hơn "You must", nghe như báo trước chứ không ra lệnh.' },
          { w: 'Would you mind taking your shoes off?', pos: 'phr', ipa: '/wʊd ju ˈmaɪnd ˈteɪkɪŋ jər ˈʃuːz ɔːf/', vi: 'Bạn vui lòng cởi giày nhé?', ex: "Would you mind taking your shoes off? There are slippers here.", exVi: 'Anh vui lòng cởi giày nhé? Có dép đi trong nhà ở đây.', more: 'Ngày 15: Would you mind + V-ing. Nhờ khách thì dùng câu này, không dùng mệnh lệnh.' },
          { w: 'Walk slowly and keep going.', pos: 'phr', ipa: '/ˈwɔːk ˈsloʊli ən ˌkiːp ˈɡoʊɪŋ/', vi: 'Đi chậm và cứ đi đều.', ex: "To cross the road, walk slowly and keep going. Don't run.", exVi: 'Qua đường thì đi chậm và cứ đi đều. Đừng chạy.', anh: 'person-walking' },
          { w: "Tips aren't expected, but they're appreciated.", pos: 'phr', ipa: '/ˈtɪps ɑːrnt ɪkˈspektɪd bət ðer əˈpriːʃieɪtɪd/', vi: 'Không ai đòi tiền boa, nhưng boa thì người ta quý.', ex: "Tips aren't expected, but they're appreciated. Rounding up is fine.", exVi: 'Không ai đòi tiền boa, nhưng có thì người ta quý. Làm tròn lên là được.' },
          { w: "I'm not 100% sure, but I think…", pos: 'phr', ipa: '/aɪm ˈnɑːt wʌn ˈhʌndrəd pərˈsent ʃʊr bət aɪ ˈθɪŋk/', vi: 'Tôi không chắc hẳn, nhưng tôi nghĩ là…', ex: "I'm not 100% sure, but I think it closes at five.", exVi: 'Em không chắc hẳn, nhưng em nghĩ là năm giờ đóng cửa.' },
          { w: 'Let me check that for you.', pos: 'phr', ipa: '/let mi ˈtʃek ðæt fər ju/', vi: 'Để tôi kiểm giúp bạn.', ex: 'Good question. Let me check that for you.', exVi: 'Câu hỏi hay. Để em kiểm giúp anh.' },
          { w: 'Shall I write it down for you?', pos: 'phr', ipa: '/ʃəl aɪ ˈraɪt ɪt ˈdaʊn fər ju/', vi: 'Tôi viết ra giúp bạn nhé?', ex: "The street name is hard to say. Shall I write it down for you?", exVi: 'Tên phố khó đọc lắm. Em viết ra giúp anh nhé?', anh: 'writing-hand' },
          { w: 'Is there anything like this in Ireland?', pos: 'phr', ipa: '/ɪz ðer ˈeniθɪŋ laɪk ðɪs ɪn ˈaɪərlənd/', vi: 'Ở Ireland có gì giống thế này không?', ex: 'We have a lot of legends about turtles. Is there anything like this in Ireland?', exVi: 'Bọn em có nhiều truyền thuyết về rùa. Ở Ireland có gì giống vậy không?', more: 'Câu hỏi nối tiếp (Ngày 19): kéo khách kể về **nước họ**, để chuyện thành hai chiều.' },
          { w: "If you need anything, just message me.", pos: 'phr', ipa: '/ɪf ju ˈniːd ˈeniθɪŋ dʒəst ˈmesɪdʒ mi/', vi: 'Cần gì cứ nhắn tôi.', ex: "I'll pick you up at nine. If you need anything, just message me.", exVi: 'Chín giờ em đón. Cần gì anh chị cứ nhắn em.' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Khách cùng tuổi đi chơi buổi tối khác với giám đốc khách hàng đi thăm văn phòng. Lộc nói với Fergus và Lauren ở cột **giữa**; với sếp lớn của họ thì sang cột phải.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (khách trẻ, đi chơi)', 'Trung tính (khách công ty)', 'Trang trọng (giám đốc, khách lớn tuổi)'],
        rows: [
          ['Chào đón', 'Hey, welcome! Good flight?', 'Welcome to Hanoi! How was your flight?', "Welcome to Vietnam, Ms Harper. I hope you had a comfortable flight."],
          ['Hỏi ăn uống', 'Anything you hate?', "Is there anything you don't eat?", 'Do you have any dietary requirements?'],
          ['Giới thiệu món', "This is bánh cuốn. You'll love it.", "It's called bánh cuốn. It's made from steamed rice batter.", 'This is bánh cuốn, a traditional Hanoi breakfast made from steamed rice batter.'],
          ['Mời thử', 'Try some!', 'Would you like to try some?', 'Perhaps you would like to try some?'],
          ['Nhắc quy định', 'No shorts in there, by the way.', "You'll need to cover your knees and shoulders.", 'Please note that visitors are asked to dress modestly.'],
          ['Không chắc', 'No idea, let me google it.', "I'm not 100% sure. Let me check.", "I'm afraid I'm not certain. I'll find out and let you know."],
          ['Dặn liên lạc', 'Text me if you need anything!', "If you need anything, just message me.", 'Please do not hesitate to contact me if you need anything.'],
        ],
        caption: 'Cột phải dùng nhiều bị động (**visitors are asked to…**) vì nó nghe khách quan, không chỉ thẳng vào người nghe.',
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Giải thích một món ăn trong 4 câu',
        caption: 'Bốn câu, khoảng 20 giây. Thiếu câu 4 thì thành bài thuyết trình; có câu 4 thì thành lời mời.',
        steps: [
          { label: 'Tên + nó là gì', sub: "It's called phở cuốn. It's a Hanoi dish." },
          { label: 'Làm từ gì / thế nào', sub: "Sheets of fresh rice noodle are rolled around beef and herbs." },
          { label: 'Ăn thế nào / giống gì', sub: "It's eaten with a sweet and sour sauce. It's a bit like a fresh spring roll." },
          { label: 'Mời', sub: "Would you like to try one? It's not spicy." },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: giới thiệu Việt Nam mà khách nhớ',
        items: [
          '**Ít mốc, nhiều chuyện.** Khách không nhớ năm 1442, nhưng nhớ "the names were carved on turtles". Mỗi mốc lịch sử kèm **một hình ảnh**.',
          '**So với thứ họ biết**: "It\'s a bit like…", "It\'s like your Christmas, but for the Lunar New Year." Đừng giả định họ biết Khổng Tử hay Tết là gì.',
          '**Nói đúng mức chắc chắn**: sử thì "was built in…", truyền thuyết thì "Legend has it…", ý kiến thì "I think…". Câu "Vietnam has 4,000 years of history" nên nói "**According to legend**, …" vì đó là cách nói truyền thống, không phải con số sử học.',
          '**Hỏi lại về nước họ** (Ngày 19): "Is there anything like this in Canada?" Khách thích kể về quê mình, và bạn học thêm được.',
          'Phần **tiếp khách hàng trong công việc** (họp, demo, thương thảo hợp đồng) ở khoá **Technical English at Work**. Hôm nay chỉ là phần ngoài giờ: ăn, đi, xem.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Tiếng Việt nói "Văn Miếu **xây** năm 1070", "phở **làm** từ gạo" mà không cần "được". Tiếng Anh thì **bắt buộc**: món ăn không tự làm ra mình, ngôi đền không tự xây mình. Công thức: **be + V3** (quá khứ phân từ). Chia **be** theo thời: is / are (bây giờ, sự thật), was / were (quá khứ).',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + is / are + V3 (+ from / with / in…)',
            vi: 'Sự thật, cách làm, phong tục **bây giờ**.',
            examples: [
              { en: 'Phở noodles are made from rice flour.', vi: 'Bánh phở được làm từ bột gạo.' },
              { en: "It's usually eaten for breakfast.", vi: 'Món này thường được ăn vào bữa sáng.' },
              { en: 'Motorbikes are used for everything here.', vi: 'Ở đây xe máy được dùng vào mọi việc.' },
            ],
          },
          {
            formula: 'S + was / were + V3 + in + năm',
            vi: 'Lịch sử: việc **đã xảy ra** với nơi chốn, đồ vật.',
            examples: [
              { en: 'The Temple of Literature was built in 1070.', vi: 'Văn Miếu được xây năm 1070.' },
              { en: 'The capital was moved here in 1010.', vi: 'Kinh đô được dời về đây năm 1010.' },
              { en: 'Their names were carved on stone steles.', vi: 'Tên họ được khắc trên bia đá.' },
            ],
          },
          {
            formula: 'S + is / was + called / known as + tên',
            vi: 'Gọi tên. Hay dùng nhất khi giới thiệu Việt Nam.',
            examples: [
              { en: "In the north they're called nem.", vi: 'Ở miền Bắc chúng được gọi là nem.' },
              { en: 'The city was called Thăng Long.', vi: 'Thành phố hồi đó tên là Thăng Long.' },
              { en: 'Hoàn Kiếm Lake is also known as Sword Lake.', vi: 'Hồ Hoàn Kiếm còn được gọi là hồ Gươm.' },
            ],
          },
          {
            formula: "S + is / are + (not) allowed (to + V)",
            vi: 'Quy định: được phép / không được phép.',
            examples: [
              { en: "Photos aren't allowed inside.", vi: 'Bên trong không được chụp ảnh.' },
              { en: "You aren't allowed to touch the steles.", vi: 'Không được sờ vào bia.' },
              { en: 'Are we allowed to go in with shoes on?', vi: 'Mình có được đi giày vào không?' },
            ],
          },
          {
            formula: '… + by + người làm (khi người làm quan trọng)',
            vi: 'Chỉ thêm **by** khi tên người làm là thông tin đáng nói.',
            examples: [
              { en: 'It was built by King Lý Thánh Tông.', vi: 'Nó được vua Lý Thánh Tông cho xây.' },
              { en: 'This dish was made by my grandmother.', vi: 'Món này do bà em nấu.' },
              { en: 'The design was chosen by the whole team.', vi: 'Thiết kế này do cả nhóm chọn.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Động từ', 'V3', 'Câu bị động hôm nay'],
        rows: [
          ['make', '**made**', "It's made from tofu and mushrooms."],
          ['eat', '**eaten** /ˈiːtn/', "It's eaten with rice noodles."],
          ['build', '**built**', 'It was built in 1070.'],
          ['know', '**known**', "It's also known as Sword Lake."],
          ['take', '**taken**', 'Shoes are taken off at the door.'],
          ['find', '**found**', 'Vegetarian restaurants are usually found near pagodas.'],
          ['hold', '**held**', 'The festival is held every autumn.'],
          ['carve · call · cook · move', 'carved · called · cooked · moved', 'Động từ có quy tắc: thêm **-ed**.'],
        ],
        caption: 'Tám V3 bất quy tắc dùng nhiều nhất khi giới thiệu đất nước. Có quy tắc thì chỉ thêm -ed. Sai phổ biến nhất: quên **be** ("It built in 1070"), hoặc dùng V nguyên mẫu ("It was build").',
      },
      {
        t: 'rule',
        formula: 'S + is / are / was / were + V3 (+ by …)',
        vi: 'Khi điều quan trọng là món ăn, nơi chốn, phong tục, không phải ai làm ra nó, thì dùng bị động. Luôn có be, và be chia theo thời. Chỉ thêm by khi người làm đáng nói.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: which · which means · also known as',
        items: [
          'Tên tiếng Việt cần giải thích ngay. **which means** + nghĩa: "The city was called Thăng Long, **which means** \"rising dragon\"."',
          '**, which** + câu = thêm thông tin về điều vừa nói: "We\'re going to a vegetarian place, **which** is near a pagoda." Có dấu phẩy trước which khi chỉ thêm thông tin.',
          '**also known as** (viết tắt a.k.a.) = còn gọi là: "Hoàn Kiếm Lake, **also known as** Sword Lake, is in the middle of the city."',
          'Ghép với bị động: "It\'s called bún, **which is made from** rice flour." Hai cấu trúc hôm nay trong một câu.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd20-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: 'is / are + V3 · was / were + V3 · called · which means · allowed',
        items: [
          { q: 'Bánh phở được làm từ bột gạo.', hint: 'made from, rice flour', answers: ['Phở noodles are made from rice flour.', 'Pho noodles are made from rice flour.', 'Phở noodles are made of rice flour.', 'Pho noodles are made of rice flour.'] },
          { q: 'Ngôi chùa này được xây năm 1049.', hint: 'pagoda, built', answers: ['This pagoda was built in 1049.', 'The pagoda was built in 1049.'] },
          { q: 'Món này thường được ăn kèm rau thơm.', hint: 'usually eaten with, herbs', answers: ["It's usually eaten with herbs.", 'It is usually eaten with herbs.', "It's usually eaten with fresh herbs.", 'This dish is usually eaten with herbs.', 'This dish is usually eaten with fresh herbs.', 'It is usually eaten with fresh herbs.'] },
          { q: 'Trong lăng không được chụp ảnh.', hint: "photos, allowed, inside", answers: ["Photos aren't allowed inside the mausoleum.", 'Photos are not allowed inside the mausoleum.', "Photos aren't allowed in the mausoleum.", "You aren't allowed to take photos inside the mausoleum.", 'Taking photos is not allowed inside the mausoleum.'] },
          { q: 'Thành phố hồi đó tên là Thăng Long, nghĩa là "rồng bay lên".', hint: 'was called, which means', answers: ['The city was called Thăng Long, which means "rising dragon".', 'The city was called Thang Long, which means "rising dragon".', 'Back then the city was called Thăng Long, which means "rising dragon".', 'Back then the city was called Thang Long, which means "rising dragon".', 'The city was called Thang Long, which means rising dragon.', 'The city was called Thăng Long, which means rising dragon.'] },
        ],
      },
      {
        t: 'note',
        title: 'Ghi chú cho câu 2',
        items: [
          '1049 là năm dựng **chùa Một Cột** ở Hà Nội. Muốn giới thiệu kèm hình ảnh: "It was built in 1049, and it\'s designed to look like a lotus flower rising out of the water." (Được thiết kế giống bông sen mọc lên khỏi mặt nước.)',
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi tiếp khách',
        items: [
          '~~This temple built in 1070.~~ → **This temple was built in 1070.** Tiếng Việt không cần "được" nên rất hay quên **be**. Câu sai nghe như "ngôi đền tự đi xây cái gì đó năm 1070".',
          '~~The temple was build in 1070.~~ → **was built**. Sau be của câu bị động là **V3**, không phải nguyên mẫu. Tương tự: was ~~make~~ → was **made**, is ~~eat~~ → is **eaten**.',
          '~~Phở is make by rice.~~ → **Phở noodles are made from rice flour.** Nguyên liệu đi với **from** (hoặc of), không đi với **by**. by dành cho **người** làm.',
          '~~"Bún chả" is "noodle pork sausage".~~ → **It\'s called bún chả: grilled pork with rice noodles.** Giữ tên tiếng Việt, giải thích sau. Dịch từng chữ làm món ăn nghe kỳ và sai.',
          '~~You must eat this! Eat more, eat more!~~ (gắp liên tục vào bát khách) → **Would you like to try some? It\'s okay if it\'s not for you.** Hiếu khách kiểu Việt dễ thành ép khách. Khách phương Tây quen tự lấy và ăn vừa đủ.',
          '~~Take off your shoes.~~ (mệnh lệnh với khách) → **Would you mind taking your shoes off? It\'s a custom here.** Nhờ khách thì kèm **lý do**, khách sẽ vui vẻ làm theo.',
          '~~Vietnam has 4,000 years of history.~~ (nói như số liệu) → **According to legend, Vietnamese history goes back about 4,000 years.** Đó là cách nói truyền thống. Khách hỏi lại "Really? Since 2000 BC?" thì bạn khó đỡ.',
          '~~Do you like Vietnam? Is Vietnam beautiful?~~ (mười phút sau khi khách hạ cánh) → **Is this your first time in Asia? · What are you hoping to see while you\'re here?** Khách chưa kịp thấy gì; câu hỏi mở dễ trả lời hơn.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể: những cử chỉ Việt mà khách hay hiểu nhầm' },
      {
        t: 'p',
        text: 'Hôm nay ngược lại với Ngày 1: không phải bạn học cử chỉ của người nước ngoài, mà là **giải thích cử chỉ của người Việt** cho khách, và nhắc khách vài điều để họ khỏi lỡ lời.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi tiếp khách',
        items: [
          { anh: 'palm-down-hand', w: 'Come this way, please.', ro: '/ˈkʌm ðɪs ˈweɪ pliːz/', vi: 'Người Việt gọi người lại bằng **bàn tay úp**, vẫy xuống. Khách phương Tây quen ngửa tay, ngoắc ngón trỏ. Ở Việt Nam kiểu ngoắc ngón trỏ bị coi là gọi con vật: nhắc khách nhẹ nhàng.' },
          { anh: 'grinning-face-with-sweat', w: "Sorry, that's my mistake.", ro: '', vi: 'Người Việt hay **cười khi ngại** hoặc khi xin lỗi. Khách có thể tưởng bạn không coi chuyện là nghiêm túc. Khi xin lỗi, nói rõ lời xin lỗi và cười nhẹ thôi.' },
          { anh: 'mans-shoe', w: "Would you mind taking your shoes off?", ro: '', vi: 'Cởi giày khi vào **nhà người Việt** và một số gian thờ trong chùa. Nhìn thấy dép xếp ở cửa là dấu hiệu.' },
          { anh: 'shorts', w: "You'll need to cover your knees and shoulders.", ro: '', vi: 'Đi chùa, đền, lăng: che vai và đầu gối. Ở lăng còn phải giữ im lặng, không đút tay túi quần, không chụp ảnh bên trong.' },
          { anh: 'folded-hands', w: 'People come here to pray for good luck.', ro: '', vi: 'Thấy người đang khấn vái: đứng lùi lại, **không chụp ảnh cận mặt** họ khi chưa hỏi.' },
          { anh: 'raised-back-of-hand', w: "It's considered rude to touch someone's head.", ro: '', vi: 'Xoa đầu trẻ con, vỗ đầu người lớn: ở Việt Nam đầu là phần trang trọng, chạm vào dễ gây khó chịu (nhất là với người lớn).' },
          { anh: 'chopsticks', w: "You can take it yourself. No pressure!", ro: '', vi: 'Chủ nhà Việt hay **gắp thức ăn vào bát khách** để tỏ quý. Khách phương Tây quen tự lấy. Gắp một lần cho món đầu là đủ, sau đó để khách tự chọn.' },
          { anh: 'person-walking', w: "Walk slowly and keep going.", ro: '', vi: 'Qua đường: đi chậm, đều, nhìn vào người đi xe. Có thể giơ nhẹ một tay để báo "tôi đang đi". Đừng chạy, đừng lùi lại bất ngờ.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam (chủ nhà)', 'Khách Anh · Mỹ · Úc · Canada', 'Khách Nhật'],
        rows: [
          ['Trả tiền bữa ăn', 'Chủ nhà giành trả, coi là phép lịch sự.', 'Quen chia đôi hoặc mỗi người trả phần mình. Nói trước: "This one\'s on us, you\'re our guests."', 'Thường muốn trả lại vào lần sau. Nhận lời cảm ơn trang trọng.'],
          ['Gắp thức ăn', 'Gắp cho khách để tỏ quý.', 'Thích tự lấy. Gắp nhiều làm họ khó từ chối.', 'Quen ăn phần của mình; dùng đầu đũa kia để gắp chung.'],
          ['Giờ hẹn', 'Trễ 5–10 phút với bạn bè là thường.', 'Đúng giờ; trễ thì nhắn trước.', 'Rất đúng giờ, thường tới sớm 5 phút.'],
          ['Khen chê món ăn', 'Hỏi "Ngon không?" nhiều lần.', 'Ít khi chê thẳng. Nói "interesting" là có thể không thích.', 'Khen lịch sự, hiếm khi chê.'],
          ['Hỏi chuyện riêng', 'Hỏi tuổi, gia đình, lương là thân thiện.', 'Tránh hỏi tuổi, lương, tôn giáo, chính trị khi mới gặp.', 'Rất dè dặt với chuyện riêng.'],
        ],
        caption: 'Bạn không cần đổi văn hoá của mình. Chỉ cần **báo trước** cho khách ("In Vietnam, the host usually pays") để khách khỏi bối rối.',
      },

      { t: 'h', text: '6. Phát âm: -ed, V3 và đọc năm' },
      {
        t: 'p',
        text: 'Câu bị động đứng hay ngã ở **âm cuối của V3**: built /t/, called /d/, expected /ɪd/, eaten /n/. Người Việt hay bỏ âm cuối, nên "It\'s call bún" nghe thành sai ngữ pháp dù bạn biết đúng. Và **was / are** đọc nhẹ /wəz/, /ər/; nhấn vào **V3**. Năm đọc theo cặp: 1070 = **ten seventy**, 1010 = **ten ten**, 1442 = **fourteen forty-two**.',
      },
      {
        t: 'phatam',
        id: 'gtd20-phat-am',
        title: 'Luyện phát âm — âm cuối V3, nhấn câu bị động, đọc năm',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ rõ âm cuối của V3, đọc nhẹ was / is / are.',
        items: [
          { text: 'It was built in 1070.', ipa: 'ɪt wəz bɪlt ɪn ten sevənti', vi: 'was nhẹ /wəz/ · built‿in nối thành "bil-tin" · năm: ten seventy' },
          { text: "It's called chả cá.", ipa: 'ɪts kɔːld tʃɑː kɑː', vi: 'called có /d/ cuối · đừng đọc "it\'s call"' },
          { text: "It's made from rice flour.", ipa: 'ɪts meɪd frəm raɪs flaʊər', vi: 'made có /d/ · from nhẹ /frəm/ · rice /s/ rõ' },
          { text: "It's usually eaten with herbs.", ipa: 'ɪts juːʒuəli iːtn wɪð ɝːbz', vi: 'eaten /ˈiːtn/, âm /t/ gần như nuốt · herbs: Mỹ không đọc h, Anh đọc h' },
          { text: 'The capital was moved here in 1010.', ipa: 'ðə kæpɪtl wəz muːvd hɪr ɪn ten ten', vi: 'moved /muːvd/ · năm: ten ten' },
          { text: "Tips aren't expected.", ipa: 'tɪps ɑːrnt ɪkspektɪd', vi: 'expected có /ɪd/ cuối vì gốc tận cùng /t/' },
          { text: "Photos aren't allowed inside.", ipa: 'foʊtoʊz ɑːrnt əlaʊd ɪnsaɪd', vi: 'allowed /əˈlaʊd/ · allowed‿inside nối' },
          { text: 'Their names were carved in 1442.', ipa: 'ðer neɪmz wər kɑːrvd ɪn fɔːrtiːn fɔːrti tuː', vi: 'were nhẹ /wər/ · carved /kɑːrvd/ · năm: fourteen forty-two' },
        ],
      },

      { t: 'h', text: '7. Nhập vai: bữa sáng đầu tiên của khách' },
      {
        t: 'dialogue',
        title: 'Lộc đưa Ingrid, một khách người Na Uy, đi ăn bánh cuốn gần khách sạn',
        lines: [
          { who: 'Lộc', role: 'a', text: "Good morning, Ingrid! Did you sleep okay?", vi: 'Chào buổi sáng chị Ingrid! Chị ngủ ngon không?' },
          { who: 'Ingrid', role: 'b', text: "Not really. I'm a bit jet-lagged. But I'm very hungry.", vi: 'Không lắm. Tôi hơi lệch múi giờ. Nhưng đói lắm.' },
          { who: 'Lộc', role: 'a', text: "Then you're in the right place. This is called bánh cuốn. It's a very typical Hanoi breakfast.", vi: 'Vậy thì chị tới đúng chỗ rồi. Món này tên là bánh cuốn. Bữa sáng rất Hà Nội.' },
          { who: 'Ingrid', role: 'b', text: "It looks so thin. What's it made from?", vi: 'Trông mỏng quá. Nó làm từ gì vậy?' },
          { who: 'Lộc', role: 'a', text: "It's made from rice batter. It's steamed on a cloth, then it's filled with minced pork and wood ear mushrooms.", vi: 'Nó làm từ bột gạo. Bột được tráng hấp trên một tấm vải, rồi cuốn nhân thịt băm và mộc nhĩ.' },
          { who: 'Ingrid', role: 'b', text: "And this sauce?", vi: 'Còn nước chấm này?' },
          { who: 'Lộc', role: 'a', text: "It's fish sauce mixed with water, sugar and lime. It's eaten with fried shallots on top. Are you okay with chilli?", vi: 'Nước mắm pha với nước, đường và chanh. Ăn kèm hành phi rắc lên trên. Chị ăn ớt được không?' },
          { who: 'Ingrid', role: 'b', text: "A little. We don't eat much spicy food in Norway.", vi: 'Một chút thôi. Ở Na Uy bọn tôi không ăn cay nhiều.' },
          { who: 'Lộc', role: 'a', text: "Then just one slice. Is there anything like this in Norway?", vi: 'Vậy chỉ một lát thôi. Ở Na Uy có món nào giống thế này không?' },
          { who: 'Ingrid', role: 'b', text: "Not really. Our breakfast is bread, cheese and fish. Cold fish.", vi: 'Không hẳn. Bữa sáng của bọn tôi là bánh mì, phô mai và cá. Cá nguội.' },
          { who: 'Lộc', role: 'a', text: "Cold fish for breakfast? What's that like?", vi: 'Cá nguội cho bữa sáng ạ? Ăn thế nào ạ?' },
          { who: 'Ingrid', role: 'b', text: "Ha! It's an acquired taste. A bit like this fish sauce, I guess.", vi: 'Ha! Phải ăn quen mới thích. Chắc cũng như nước mắm này.' },
          { who: 'Lộc', role: 'a', text: "Fair enough! I'll pick you up at nine for the office. If you need anything, just message me.", vi: 'Công nhận! Chín giờ em đón chị lên văn phòng. Cần gì chị cứ nhắn em.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd20-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Lộc (5 câu)',
        items: [
          { vi: 'Ingrid: "What\'s it made from?" → Bạn: Nó được làm từ bột gạo.', chips: ["It's", 'made', 'from', 'rice', 'batter.', 'make', 'by'], answer: ["It's", 'made', 'from', 'rice', 'batter.'] },
          { vi: 'Bạn: Món này thường được ăn vào bữa sáng.', chips: ["It's", 'usually', 'eaten', 'for', 'breakfast.', 'eat', 'ate'], answer: ["It's", 'usually', 'eaten', 'for', 'breakfast.'] },
          { vi: 'Bạn: Chị ăn ớt được không?', chips: ['Are', 'you', 'okay', 'with', 'chilli?', 'Do', 'for'], answer: ['Are', 'you', 'okay', 'with', 'chilli?'] },
          { vi: 'Bạn: Ở Na Uy có món nào giống thế này không?', chips: ['Is', 'there', 'anything', 'like', 'this', 'in', 'Norway?', 'Are', 'same'], answer: ['Is', 'there', 'anything', 'like', 'this', 'in', 'Norway?'] },
          { vi: 'Bạn: Cần gì chị cứ nhắn em.', chips: ['If', 'you', 'need', 'anything,', 'just', 'message', 'me.', 'will', 'to'], answer: ['If', 'you', 'need', 'anything,', 'just', 'message', 'me.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd20-noi-tra-loi',
        part: '1',
        questions: [
          "I'm visiting your city for the first time. What dish should I try, and what's it made from?",
          'Is there a custom in Vietnam that visitors often get wrong?',
          'Tell me about one old building or place in your hometown. When was it built?',
          "How do people celebrate the Lunar New Year where you're from?",
          "If I only have one free afternoon, what would you suggest?",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Ms Harper, a 55-year-old Australian director visiting our software company in Vietnam for the first time. I am a Vietnamese intern who is looking after you for one evening. We are walking to dinner. Ask me about the food (what it is made from, how it is eaten), one local custom, and a little history of the city. Speak at normal speed, B1+/B2 level. You don\'t eat pork, but only tell me if I ask whether there is anything you don\'t eat. Ask one difficult question that I may not know the answer to, and see if I admit it politely instead of guessing. After about 12 turns, thank me. Then, in Vietnamese, tell me: whether my passive sentences were correct (is made from, was built in), whether I asked about your diet early enough, and one way to sound more welcoming."',
          'Làm **2 lượt**. Lượt hai bạn là người dẫn khách đi **một nơi ở quê bạn** (đình, chùa, chợ, món đặc sản) thay vì Hà Nội. Chuẩn bị trước 3 câu bị động về nơi đó, và chỉ nói dữ kiện bạn chắc chắn.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd20-viet',
    kind: 'writing',
    title: 'Lịch trình gợi ý cho khách, tin nhắn hướng dẫn',
    goal: 'Viết được một lịch trình gợi ý nửa ngày – một ngày cho khách, và các tin nhắn hướng dẫn ngắn (đi từ khách sạn tới văn phòng, dặn trước khi đi đền chùa), ở cả mức thân mật và trang trọng.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao phải viết ra',
        items: [
          'Khách nghe bạn giải thích ở bữa tối, sáng hôm sau quên nửa. **Một tin nhắn** để họ mở lại lúc đứng trước cổng đền hay lúc gọi xe là thứ cứu chuyến đi.',
          'Hôm nay viết 3 loại: **lịch trình gợi ý** (Fergus có một ngày rảnh) · **hướng dẫn đường đi** (khách sạn → văn phòng) · **dặn trước** khi đi lăng, chùa.',
          'Mỗi loại có hai bản đặt cạnh nhau: **thân mật** (Fergus, Lauren) và **trang trọng** (Ms Harper, giám đốc khách hàng).',
          'Dùng lại: câu bị động (**is called · was built · aren\'t allowed**), **which means**, và khung xác nhận Ngày 2 (on + ngày, at + giờ).',
        ],
      },

      { t: 'h', text: '1. Ba mẫu tin, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Lịch trình gợi ý cho một ngày rảnh',
        caption: 'Bản thân mật: gạch đầu dòng, emoji, câu ngắn. Bản trang trọng: đoạn văn ngắn, câu đủ, không emoji. Cả hai đều có **giờ, nơi, vì sao nên đi** và một câu "đổi được".',
        cols: [
          {
            title: 'Thân mật (nhắn Fergus)',
            anh: 'speech-balloon',
            items: [
              'Hi Fergus! Here\'s my plan for your free Saturday 🙂',
              '8:00 · Bánh cuốn near your hotel (it\'s made fresh every morning)',
              '9:00 · Temple of Literature (you\'ve seen it, so maybe skip?)',
              '10:30 · Hoàn Kiếm Lake + Ngọc Sơn Temple: walk across the red bridge',
              '12:30 · Lunch: phở cuốn by Trúc Bạch Lake',
              '17:00 · Water puppet show near the lake (book online, it sells out)',
              'Evening · Old Quarter night market (Fri–Sun only)',
              'Totally flexible. Happy to change anything!',
            ],
          },
          {
            title: 'Trang trọng (email cho Ms Harper)',
            anh: 'e-mail',
            items: [
              'Dear Ms Harper,',
              'As you have a free afternoon on Friday, I would like to suggest a short programme.',
              'At 2:00 pm we could visit the Temple of Literature, which was built in 1070 and is often called Vietnam\'s first university.',
              'At 4:00 pm, a short walk around Hoàn Kiếm Lake, also known as Sword Lake.',
              'At 5:00 pm, a water puppet performance, a traditional art from the Red River Delta.',
              'Please let me know if you would prefer a lighter schedule.',
              'Kind regards,',
              'Nguyen Huu Loc',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Hướng dẫn đường đi: khách sạn → văn phòng',
        caption: 'Chia thành **bước đánh số**, mỗi bước một hành động. Ghi địa chỉ **có dấu** để khách chỉ cho tài xế xem.',
        cols: [
          {
            title: 'Thân mật (nhắn Lauren)',
            anh: 'mobile-phone',
            items: [
              'Morning Lauren! Getting to the office:',
              '1. Open Grab and paste this address: [địa chỉ văn phòng, có dấu]',
              '2. Choose GrabCar (motorbikes are faster, but maybe not on day 2 😄)',
              '3. The price is shown before you book, so no haggling.',
              '4. It\'s the glass building with a bank on the ground floor. Our office is on the 9th floor.',
              'Text me when you\'re downstairs and I\'ll come and get you!',
            ],
          },
          {
            title: 'Trang trọng (email cho Ms Harper)',
            anh: 'e-mail',
            items: [
              'Dear Ms Harper,',
              'A car has been booked to collect you from your hotel at 8:30 am tomorrow.',
              'The driver, Mr Tuấn, will wait in the lobby with a sign.',
              'The journey usually takes around 20 minutes.',
              'On arrival, visitors are asked to show photo ID at reception, so please bring your passport.',
              'I will meet you at reception.',
              'Kind regards,',
              'Nguyen Huu Loc',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Dặn trước khi đi lăng, chùa',
        caption: 'Nói **quy định + lý do + cách xử lý**. Không chắc giờ mở cửa thì ghi rõ là mình sẽ kiểm lại, đừng ghi giờ đoán.',
        cols: [
          {
            title: 'Thân mật (nhắn Fergus)',
            anh: 'shorts',
            items: [
              'Quick heads-up for tomorrow 🙏',
              'Shorts and sleeveless tops aren\'t allowed at the mausoleum, so trousers + a T-shirt is perfect.',
              'Photos aren\'t allowed inside, and people stay very quiet.',
              'I think it\'s only open in the morning. I\'ll double-check tonight and confirm.',
              'Meet in your lobby at 7:30?',
            ],
          },
          {
            title: 'Trang trọng (email cho Ms Harper)',
            anh: 'memo',
            items: [
              'Dear Ms Harper,',
              'Please note that visitors to the Ho Chi Minh Mausoleum are asked to dress modestly, with shoulders and knees covered.',
              'Photography is not permitted inside, and visitors are expected to remain silent.',
              'Opening hours vary by season, so I will confirm the exact time with you this evening.',
              'Kind regards,',
              'Nguyen Huu Loc',
            ],
          },
        ],
      },
      {
        t: 'note',
        title: 'Ghi chú về dữ kiện trong bài mẫu',
        items: [
          '**Chợ đêm phố cổ** ở Hà Nội họp tối thứ Sáu, thứ Bảy, Chủ nhật. **Múa rối nước** là nghệ thuật dân gian của vùng đồng bằng sông Hồng; nhà hát gần hồ Hoàn Kiếm hay hết vé vào cuối tuần, nên đặt trước.',
          '**Phở cuốn** gắn với khu Ngũ Xã – Trúc Bạch. **Đền Ngọc Sơn** nằm trên đảo nhỏ trong hồ Hoàn Kiếm, đi vào bằng **cầu Thê Húc** sơn đỏ.',
          '**Giờ mở cửa lăng** thay đổi theo mùa và có đợt đóng cửa bảo trì. Bài mẫu cố ý **không ghi giờ**: khi viết thật, tra trang chính thức hôm trước rồi mới gửi.',
          'Giá Grab: app hiện giá **trước khi đặt**, nên không cần ghi con số trong tin nhắn (giá đổi theo giờ, theo mưa).',
        ],
      },

      { t: 'h', text: '2. Khung câu để viết lịch trình và hướng dẫn' },
      {
        t: 'patterns',
        rows: [
          {
            formula: "I'd suggest + V-ing / We could + V",
            vi: 'Gợi ý, không áp đặt. "We could" trang trọng hơn khi viết cho khách lớn.',
            examples: [
              { en: "I'd suggest starting early, before it gets hot.", vi: 'Em gợi ý đi sớm, trước khi trời nóng.' },
              { en: 'We could visit the Temple of Literature at 2:00 pm.', vi: 'Mình có thể đi Văn Miếu lúc 2 giờ chiều.' },
              { en: "I'd suggest booking the puppet show online.", vi: 'Em gợi ý đặt vé múa rối trên mạng.' },
            ],
          },
          {
            formula: '[Nơi], which was built in… / which is famous for…',
            vi: 'Thêm một câu "vì sao nên đi" ngay sau tên nơi.',
            examples: [
              { en: 'Ngọc Sơn Temple, which is on a small island in the lake', vi: 'Đền Ngọc Sơn, nằm trên một đảo nhỏ giữa hồ' },
              { en: 'The Temple of Literature, which was built in 1070', vi: 'Văn Miếu, được xây năm 1070' },
              { en: 'Trúc Bạch Lake, which is famous for phở cuốn', vi: 'Hồ Trúc Bạch, nổi tiếng với phở cuốn' },
            ],
          },
          {
            formula: 'Visitors are asked to… / … is not permitted. / A car has been booked…',
            vi: 'Bị động trong thư trang trọng: nói quy định mà không chỉ tay vào người đọc.',
            examples: [
              { en: 'Visitors are asked to dress modestly.', vi: 'Khách tham quan được đề nghị ăn mặc kín đáo.' },
              { en: 'Photography is not permitted inside.', vi: 'Không được chụp ảnh bên trong.' },
              { en: 'A car has been booked to collect you at 8:30 am.', vi: 'Đã đặt xe đón anh/chị lúc 8 giờ 30.' },
            ],
          },
          {
            formula: 'Happy to change anything! / Please let me know if you would prefer…',
            vi: 'Câu chốt để khách biết lịch có thể đổi.',
            examples: [
              { en: 'Totally flexible. Happy to change anything!', vi: 'Hoàn toàn linh hoạt. Đổi gì cũng được!' },
              { en: 'Please let me know if you would prefer a lighter schedule.', vi: 'Xin chị cho em biết nếu chị muốn lịch nhẹ hơn.' },
              { en: "If you're tired, we can skip the market.", vi: 'Nếu anh mệt, mình bỏ chợ đêm cũng được.' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Giờ · Nơi (, which…) · Một lý do · Câu "đổi được"',
        vi: 'Một dòng lịch trình tốt có giờ, nơi, một lý do nên đi. Cuối lịch luôn có câu cho khách quyền đổi.',
      },
      {
        t: 'table',
        head: ['Viết gì', 'Nên viết', 'Tránh', 'Vì sao'],
        rows: [
          ['Tên nơi', 'Temple of Literature (Văn Miếu)', 'Van Mieu (không giải thích)', 'Khách tra bản đồ bằng tên tiếng Anh, hỏi đường bằng tên tiếng Việt: ghi cả hai.'],
          ['Địa chỉ', 'Có dấu, đủ số nhà, phố, phường', 'Không dấu, viết tắt', 'Tài xế và người dân đọc chữ có dấu nhanh và đúng hơn.'],
          ['Giờ', '17:00 · 5:00 pm', '5h chiều', 'Chữ "h" là kiểu Việt (Ngày 2).'],
          ['Giá', 'around 50,000 VND (about 2 USD)', '50k', '"k" khách hiểu, nhưng kèm quy đổi thì họ hình dung được ngay.'],
          ['Điều không chắc', "I think…, I'll double-check.", 'Ghi giờ, giá đoán như sự thật', 'Khách tới nơi thấy đóng cửa là mất cả buổi.'],
          ['Món ăn', 'phở cuốn (fresh rice noodle rolls)', 'pho roll (tự dịch)', 'Giữ tên Việt để gọi món, thêm giải thích để khách biết mình ăn gì.'],
        ],
        caption: 'Lịch trình và hướng dẫn viết cho **người đang đứng ngoài đường**, mở điện thoại một tay. Ngắn, có số, có tên Việt có dấu.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd20-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Em gợi ý đi sớm, trước khi trời nóng.', chips: ["I'd", 'suggest', 'starting', 'early,', 'before', 'it', 'gets', 'hot.', 'to', 'start'], answer: ["I'd", 'suggest', 'starting', 'early,', 'before', 'it', 'gets', 'hot.'] },
          { vi: 'Khách tham quan được đề nghị ăn mặc kín đáo.', chips: ['Visitors', 'are', 'asked', 'to', 'dress', 'modestly.', 'ask', 'is'], answer: ['Visitors', 'are', 'asked', 'to', 'dress', 'modestly.'] },
          { vi: 'Giá hiện ra trước khi bạn đặt xe.', chips: ['The', 'price', 'is', 'shown', 'before', 'you', 'book.', 'show', 'after'], answer: ['The', 'price', 'is', 'shown', 'before', 'you', 'book.'] },
          { vi: 'Đã đặt xe đón chị lúc 8 giờ 30.', chips: ['A', 'car', 'has', 'been', 'booked', 'to', 'collect', 'you', 'at', '8:30.', 'was', 'book'], answer: ['A', 'car', 'has', 'been', 'booked', 'to', 'collect', 'you', 'at', '8:30.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd20-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: 'be + V3 · which · I\'d suggest + V-ing',
        items: [
          { q: 'The Temple of Literature, ___ was built in 1070, is a short walk from your hotel.', answers: ['which'] },
          { q: "Photos aren't ___ inside. (cho phép)", answers: ['allowed', 'permitted'] },
          { q: "I'd suggest ___ the puppet show online. (book)", answers: ['booking'] },
          { q: 'Hoàn Kiếm Lake is also ___ as Sword Lake.', answers: ['known'] },
          { q: 'Visitors are ___ to show photo ID at reception. (ask)', answers: ['asked'] },
          { q: 'Totally flexible. Happy to ___ anything!', answers: ['change'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd20-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "I'd suggest · which · be + V3 · Text me when…",
        items: [
          { q: '(Nhắn khách) Em gợi ý ăn sáng bánh cuốn gần khách sạn.', hint: "I'd suggest, having", answers: ["I'd suggest having bánh cuốn for breakfast near your hotel.", "I'd suggest having banh cuon for breakfast near your hotel.", 'I would suggest having bánh cuốn for breakfast near your hotel.', 'I would suggest having banh cuon for breakfast near your hotel.', "I'd suggest having bánh cuốn near your hotel for breakfast.", "I'd suggest having banh cuon near your hotel for breakfast."] },
          { q: 'Chợ đêm chỉ họp từ thứ Sáu tới Chủ nhật.', hint: 'night market, only, Friday to Sunday', answers: ['The night market is only open from Friday to Sunday.', 'The night market is only on from Friday to Sunday.', 'The night market only opens from Friday to Sunday.', 'The night market is only open Friday to Sunday.', 'The night market only runs from Friday to Sunday.'] },
          { q: 'Khi nào tới dưới sảnh thì nhắn em, em xuống đón.', hint: "text me when, I'll come and get you", answers: ["Text me when you're downstairs and I'll come and get you.", "Text me when you're downstairs, and I'll come and get you.", "Message me when you're downstairs and I'll come and get you.", "Text me when you're in the lobby and I'll come and get you.", "Text me when you're downstairs and I'll come down to get you."] },
          { q: '(Trang trọng) Xin chị mang theo hộ chiếu.', hint: 'please bring', answers: ['Please bring your passport.', 'Please remember to bring your passport.', 'Please bring your passport with you.'] },
          { q: 'Em sẽ kiểm lại giờ mở cửa tối nay và báo anh.', hint: "double-check, opening hours, let you know", answers: ["I'll double-check the opening hours tonight and let you know.", 'I will double-check the opening hours tonight and let you know.', "I'll check the opening hours tonight and let you know.", "I'll double-check the opening times tonight and let you know.", "I'll check the opening times tonight and let you know."] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi gửi lịch trình cho khách',
        items: [
          '**Có quá dày không?** Khách vừa bay 15 tiếng thì 3 điểm một ngày là đủ. Để trống một buổi chiều cho họ nghỉ hoặc tự đi.',
          '**Mỗi dữ kiện đã kiểm chưa?** Giờ mở cửa, ngày họp chợ, giá vé: tra hôm trước. Không chắc thì viết "I\'ll double-check".',
          '**Có tên tiếng Việt có dấu chưa?** Khách cần nó để chỉ cho tài xế, người bán hàng.',
          '**Có câu "đổi được" chưa?** Happy to change anything! / Please let me know if you would prefer… Khách thấy được tôn trọng, không thấy bị xếp lịch.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd20-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 20',
    goal: 'Làm 35 câu có đáp án để chắc câu bị động, cách giới thiệu món ăn – phong tục – lịch sử, cách nhắc quy định và cách nói khi không chắc; ôn used to (Ngày 19) và ngữ pháp Ngày 15–18.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền bị động · dịch · nghe chép · ghép câu.',
          'Có **5 câu ôn** Ngày 15–19, đánh dấu "(ôn)".',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 21 (phàn nàn và giải quyết vấn đề).',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd20-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Câu nào đúng ngữ pháp?',
            options: ['This temple built in 1070.', 'This temple was build in 1070.', 'This temple was built in 1070.', 'This temple is built in 1070.'],
            correct: 2,
            why: 'Việc đã xảy ra: **was + V3** (built). Thiếu be, hoặc dùng V nguyên mẫu, hoặc dùng is cho năm quá khứ đều sai.',
          },
          {
            q: 'Khách hỏi: "What\'s phở made from?" Bạn đáp:',
            options: ['It makes from rice.', "It's made from rice noodles and beef broth.", 'It made by rice.', 'Rice made it.'],
            correct: 1,
            why: '**is made from** + nguyên liệu. Không dùng **by** cho nguyên liệu.',
          },
          {
            q: 'Trước khi đặt bàn ăn tối cho khách, câu nên hỏi nhất là:',
            options: ['Are you hungry?', "Is there anything you don't eat?", 'Do you like Vietnam?', 'How much can you pay?'],
            correct: 1,
            why: 'Hỏi **chế độ ăn** trước khi đặt bàn: chay, dị ứng, không ăn thịt lợn… Lộc quên hỏi nên phải đổi quán phút chót.',
          },
          {
            q: 'Khách nếm mắm tôm rồi nói: "Hmm, it\'s… interesting." Bạn nên:',
            options: ['Gắp thêm cho khách', 'Hỏi "Delicious, right? Eat more!"', 'Cười và mời món khác: "No worries, it\'s not for everyone. Try this one."', 'Giải thích mãi đến khi khách thích'],
            correct: 2,
            why: '"Interesting" về món ăn thường là **không hợp khẩu vị**. Đổi món, đừng ép.',
          },
          {
            q: 'Muốn khách cởi giày khi vào nhà, câu lịch sự nhất:',
            options: ['Take off your shoes.', 'Shoes! Off!', "Would you mind taking your shoes off? It's a custom here.", 'You must take off shoes.'],
            correct: 2,
            why: '**Would you mind + V-ing** (Ngày 15) + **lý do**. Khách hiểu và làm theo vui vẻ.',
          },
          {
            q: 'Khách hỏi giờ đóng cửa của bảo tàng, bạn không chắc. Bạn nói:',
            options: ['Five o\'clock. (đoán)', "I don't know.", "I'm not 100% sure, but I think it's five. Let me check.", "Don't worry about it."],
            correct: 2,
            why: 'Nói **mức chắc** của mình và **kiểm lại**. Đoán như thật thì khách có thể tới nơi thấy cửa đóng.',
          },
          {
            q: 'Câu nào giới thiệu truyền thuyết đúng cách?',
            options: ['A turtle took the sword in 1428. It is a fact.', 'Legend has it that the king returned a magic sword to a golden turtle in this lake.', 'The turtle is the king.', 'Hoàn Kiếm means turtle.'],
            correct: 1,
            why: '**Legend has it that…** / **It\'s said that…** cho khách biết đây là chuyện kể. Hoàn Kiếm nghĩa là "trả gươm" (returned sword).',
          },
          {
            q: '(ôn Ngày 19) Fergus kể: "I used to work on a farm." Câu hỏi nối tiếp hay nhất:',
            options: ['What is your hobby?', 'Really? What was that like?', 'Do you like phở?', 'How old are you?'],
            correct: 1,
            why: 'Bám vào chi tiết vừa nghe (từng làm ở nông trại) rồi hỏi sâu: **What was that like?**',
          },
          {
            q: '(ôn Ngày 16) Bạn phải giải thích vì sao đổi nhà hàng. Câu nào tự nhiên nhất?',
            options: ["We change restaurant because Lauren is vegetarian.", "We're going somewhere else, since Lauren doesn't eat fish.", 'Because vegetarian. Change.', 'Lauren vegetarian so change.'],
            correct: 1,
            why: 'Nêu lý do bằng **since / because / as** + câu đủ chủ ngữ, động từ.',
          },
          {
            q: '(ôn Ngày 17) Dặn khách trước khi đi chùa:',
            options: ["If you wear shorts, you'll need to bring a sarong or long trousers.", 'If you will wear shorts, you need bring trousers.', 'If you wore shorts, you need trousers.', 'You wear shorts, no go.'],
            correct: 0,
            why: 'Điều kiện loại 1: **If + hiện tại đơn, … will / \'ll need to + V**. Không dùng will ở mệnh đề if.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền dạng bị động' },
      {
        t: 'quiz',
        id: 'gtd20-bt-bi-dong',
        title: 'Phần II — Điền be + V3 (8 câu)',
        kind: 'fill',
        grammar: 'is / are + V3 (bây giờ) · was / were + V3 (quá khứ)',
        items: [
          { q: 'Bún ___ from rice flour. (make)', answers: ['is made'] },
          { q: 'The Temple of Literature ___ in 1070. (build)', answers: ['was built'] },
          { q: 'These rolls ___ nem in the north. (call)', answers: ['are called'] },
          { q: 'In Hanoi, phở ___ for breakfast. (usually eat)', answers: ['is usually eaten'] },
          { q: 'The names of the doctors ___ on stone steles. (carve)', answers: ['were carved'] },
          { q: "Photos ___ inside the mausoleum. (not allow)", answers: ["aren't allowed", 'are not allowed'] },
          { q: 'The capital ___ to Thăng Long in 1010. (move)', answers: ['was moved'] },
          { q: 'Vegetarian restaurants ___ near pagodas. (often find)', answers: ['are often found'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd20-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'be + V3 · which means · would you mind + V-ing · used to',
        items: [
          { q: 'Chào mừng anh tới Hà Nội! Chuyến bay thế nào ạ?', hint: 'welcome, how was', answers: ['Welcome to Hanoi! How was your flight?', 'Welcome to Hà Nội! How was your flight?', 'Welcome to Ha Noi! How was your flight?'] },
          { q: 'Có món gì chị không ăn không?', hint: "anything you don't eat", answers: ["Is there anything you don't eat?", 'Is there anything you do not eat?'] },
          { q: 'Món này thường được ăn kèm bún.', hint: 'usually eaten with, rice noodles', answers: ["It's usually eaten with rice noodles.", 'It is usually eaten with rice noodles.', 'This dish is usually eaten with rice noodles.', "It's usually eaten with rice vermicelli.", 'This is usually eaten with rice noodles.'] },
          { q: 'Hồ Hoàn Kiếm còn được gọi là hồ Gươm.', hint: 'also known as / also called', answers: ['Hoàn Kiếm Lake is also known as Sword Lake.', 'Hoan Kiem Lake is also known as Sword Lake.', 'Hoàn Kiếm Lake is also called Sword Lake.', 'Hoan Kiem Lake is also called Sword Lake.'] },
          { q: 'Ở đây không ai đòi tiền boa, nhưng boa thì người ta quý.', hint: "tips, expected, appreciated", answers: ["Tips aren't expected here, but they're appreciated.", 'Tips are not expected here, but they are appreciated.', "Tips aren't expected here, but they're always appreciated.", "Tips aren't expected here but they're appreciated.", "Here, tips aren't expected, but they're appreciated."] },
          { q: 'Anh vui lòng cởi giày nhé? Đó là phong tục ở đây.', hint: "would you mind, custom", answers: ["Would you mind taking your shoes off? It's a custom here.", 'Would you mind taking off your shoes? It is a custom here.', "Would you mind taking off your shoes? It's a custom here.", 'Would you mind taking your shoes off? It is a custom here.', "Would you mind taking your shoes off? It's the custom here."] },
          { q: '(ôn Ngày 19) Ngày trước học sinh hay sờ đầu rùa trước kỳ thi.', hint: 'used to, touch', answers: ["Students used to touch the turtles' heads before exams.", "Students used to touch the turtle's head before exams.", "Students used to touch the turtles' heads before their exams.", 'Students used to touch the heads of the turtles before exams.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd20-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Let me take that for you.', answer: 'Let me take that for you.' },
          { label: 'Câu 2', spell: "It's a bit like a crispy pancake.", answer: "It's a bit like a crispy pancake.", alt: ['It is a bit like a crispy pancake.'] },
          { label: 'Câu 3', spell: "It's considered rude to touch someone's head.", answer: "It's considered rude to touch someone's head.", alt: ["It is considered rude to touch someone's head."] },
          { label: 'Câu 4', spell: 'Visitors are asked to dress modestly.', answer: 'Visitors are asked to dress modestly.' },
          { label: 'Câu 5', spell: 'Shall I write it down for you?', answer: 'Shall I write it down for you?' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd20-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Món này được làm từ đậu phụ và nấm.', chips: ["It's", 'made', 'from', 'tofu', 'and', 'mushrooms.', 'by', 'make'], answer: ["It's", 'made', 'from', 'tofu', 'and', 'mushrooms.'] },
          { vi: 'Văn Miếu được lập để thờ Khổng Tử.', chips: ['The', 'temple', 'is', 'dedicated', 'to', 'Confucius.', 'for', 'dedicate'], answer: ['The', 'temple', 'is', 'dedicated', 'to', 'Confucius.'] },
          { vi: 'Thành phố tên là Thăng Long, nghĩa là "rồng bay lên".', chips: ['The', 'city', 'was', 'called', 'Thăng Long,', 'which', 'means', '"rising dragon".', 'that', 'call'], answer: ['The', 'city', 'was', 'called', 'Thăng Long,', 'which', 'means', '"rising dragon".'] },
          { vi: 'Anh cần che đầu gối và vai.', chips: ["You'll", 'need', 'to', 'cover', 'your', 'knees', 'and', 'shoulders.', 'must', 'covering'], answer: ["You'll", 'need', 'to', 'cover', 'your', 'knees', 'and', 'shoulders.'] },
          { vi: 'Em không chắc hẳn, nhưng em nghĩ là năm giờ đóng cửa.', chips: ["I'm", 'not', '100%', 'sure,', 'but', 'I', 'think', 'it', 'closes', 'at', 'five.', 'close', 'in'], answer: ["I'm", 'not', '100%', 'sure,', 'but', 'I', 'think', 'it', 'closes', 'at', 'five.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (10 phút)',
        items: [
          'Chọn **một món ăn quê bạn**. Nói to 4 câu theo khung: tên → làm từ gì → ăn thế nào / giống gì → mời. Ghi âm, nghe lại xem đã rõ âm cuối **made, called, eaten** chưa.',
          'Chọn **một nơi ở quê bạn** (đình, chùa, cầu, chợ). Tra **hai dữ kiện chắc chắn** (năm xây, vì sao nổi tiếng) rồi viết 3 câu bị động. Không tìm được nguồn thì dùng "It\'s said that…".',
          'Viết một tin nhắn lịch trình nửa ngày cho một người bạn nước ngoài tưởng tượng: 3 điểm, có giờ, có tên Việt có dấu, có câu "Happy to change anything!".',
          'Ngày 21: khi mọi thứ **không suôn sẻ**: phàn nàn lịch sự và giải quyết vấn đề.',
        ],
      },
    ],
  },
];
