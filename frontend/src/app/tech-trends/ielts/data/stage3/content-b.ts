/**
 * Chặng 3 — phần BỔ SUNG (đợt 5).
 *
 * Vì sao có file này thay vì viết thêm vào `content.ts`: chặng 3 và 4 ban đầu
 * mỗi kỹ năng chỉ có 1–2 đầu mục, mỏng hơn hẳn hai chặng đầu (chặng 1 có 5 bài
 * đọc, chặng 3 có 1). Đợt này bù cho đủ: +2 bài đọc · +3 bài nghe phủ trọn
 * Section 1–4 · +2 đề viết · +2 chủ đề nói. Tách file để `content.ts` không
 * phình quá 1.000 dòng; `index.ts` gộp hai file lại nên bundle không đổi hình.
 *
 * Quy ước giữ nguyên từ ba đợt trước:
 *  - KHÔNG chép đề Cambridge / British Council — tự viết theo đúng DẠNG.
 *  - Mỗi câu hỏi có `why` (vì sao đúng) và `whyNot` (vì sao phương án kia sai).
 *  - Transcript nghe TỰ VIẾT, trình duyệt đọc bằng speechSynthesis.
 *  - Text tiếng Anh KHÔNG dùng dấu lược (apostrophe) vì chuỗi bọc nháy đơn.
 */
import type {
  ReadingPassage, ListeningExercise, WritingTask, SpeakingTopic,
} from '../types';

/* ══════════════════════ ĐỌC ══════════════════════ */

export const READINGS3B: ReadingPassage[] = [
  {
    id: 's3r2',
    title: 'The Return of the Night Train',
    titleVi: 'Tàu đêm trở lại',
    level: 'B2+ — độ khó passage 2 của đề thật, nhiều dạng Heading',
    words: 579,
    minutes: 16,
    paragraphs: [
      { label: 'A', text: 'For most of the twentieth century the sleeper train was simply how people crossed Europe. A traveller boarded in one capital after dinner and stepped out in another before breakfast, having paid for a bed and a journey at the same time. By the early 2000s, however, most of these services had been withdrawn. Budget airlines were selling seats for less than the price of a berth, and the carriages themselves were ageing badly, with maintenance costs that no operator wanted to carry.' },
      { label: 'B', text: 'The recovery, when it came, was led by a state railway rather than by a new company. In 2016 the Austrian operator agreed to take over a fleet of sleeping cars that the German railway had decided to abandon, along with several of the routes they ran on. The decision looked eccentric at the time. It rested on an unfashionable calculation: that the equipment still had years of life in it, and that demand had not disappeared so much as gone unmeasured, since a service nobody advertises will always appear unpopular.' },
      { label: 'C', text: 'The economics remain awkward, and it is worth being precise about why. Aviation fuel is not taxed in the way that road or rail energy is, which flatters the price of a short flight. A night train, meanwhile, occupies an expensive slot on the network for eight or nine hours while carrying fewer passengers than a single aircraft, and it needs staff on board throughout. Rail managers describe the result as an unusual product: one that customers say they want, that sells out repeatedly, and that still struggles to cover what it costs to run.' },
      { label: 'D', text: 'Distance turns out to be the decisive variable. Dr Marta Lindqvist, who studies transport demand, argues that the sleeper works only within a narrow band, roughly between six hundred and fifteen hundred kilometres. Below that range the journey is too short to fill a night, and passengers arrive exhausted at five in the morning. Above it, the train is still travelling at midday and the time advantage collapses. Within the band, however, the traveller exchanges a hotel room and an early alarm for a berth, and the comparison with flying becomes far less obvious than the ticket price suggests.' },
      { label: 'E', text: 'The environmental argument is the one most often made and the one most often overstated. Emissions per passenger on a sleeper are a small fraction of those from an equivalent flight, and nobody disputes the figure. Professor Adam Keller nevertheless cautions that the total number of people carried remains tiny beside the aviation market, so the direct saving is, in his phrase, closer to symbolic than to material. Supporters do not really contest the arithmetic. They argue instead that the effect works through expectation: once an overnight service exists and is visibly full, slower travel stops being seen as an eccentric choice, and that shift is worth more than the emissions saved on any single route.' },
      { label: 'F', text: 'What limits the revival now is neither demand nor policy but manufacturing. Sleeping cars are built in small numbers by a handful of firms, and an order placed today may not be delivered for four or five years. Operators who would like to add routes are therefore waiting for vehicles rather than for passengers, and second-hand carriages that were nearly worthless a decade ago now change hands at prices their former owners would find difficult to believe. The pace of the return, in other words, is being set inside factories rather than at ticket offices.' },
    ],
    glossary: [
      { en: 'berth', ipa: '/bɜːθ/', vi: 'giường nằm trên tàu/thuyền' },
      { en: 'withdraw (a service)', ipa: '/wɪðˈdrɔː/', vi: 'ngừng khai thác (một tuyến)' },
      { en: 'eccentric', ipa: '/ɪkˈsentrɪk/', vi: 'lập dị, khác người' },
      { en: 'flatter (a price)', ipa: '/ˈflætə/', vi: 'làm cho đẹp hơn thực tế' },
      { en: 'decisive variable', ipa: '/dɪˈsaɪsɪv ˈveəriəbl/', vi: 'biến số quyết định' },
      { en: 'overstate', ipa: '/ˌəʊvəˈsteɪt/', vi: 'nói quá lên' },
      { en: 'second-hand', ipa: '/ˌsekəndˈhænd/', vi: 'đã qua sử dụng' },
    ],
    questions: [
      { kind: 'HEADING', q: 'Chọn tiêu đề đúng cho Đoạn C.', options: ['Why the numbers do not add up', 'An unexpected rescuer', 'The range in which it works', 'A bottleneck nobody predicted'], answer: 'Why the numbers do not add up', why: 'Đoạn C giải thích vì sao tàu đêm khó hoà vốn: nhiên liệu bay không bị đánh thuế, tàu chiếm đường ray 8–9 tiếng, chở ít khách mà vẫn phải có nhân viên suốt hành trình.', whyNot: '"An unexpected rescuer" là đoạn B (hãng nhà nước Áo), "The range in which it works" là đoạn D (khoảng 600–1.500 km), "A bottleneck" là đoạn F (thiếu toa xe).' },
      { kind: 'HEADING', q: 'Chọn tiêu đề đúng cho Đoạn F.', options: ['A bottleneck nobody predicted', 'Why the numbers do not add up', 'How it used to be', 'A claim that is often exaggerated'], answer: 'A bottleneck nobody predicted', why: 'Đoạn F: thứ chặn đà hồi sinh không phải nhu cầu hay chính sách mà là NĂNG LỰC SẢN XUẤT — đặt toa hôm nay bốn năm năm nữa mới có.', whyNot: '"How it used to be" là đoạn A, "A claim that is often exaggerated" là đoạn E (lập luận môi trường).' },
      { kind: 'HEADING', q: 'Chọn tiêu đề đúng cho Đoạn D.', options: ['The range in which it works', 'An unexpected rescuer', 'A bottleneck nobody predicted', 'How it used to be'], answer: 'The range in which it works', why: 'Đoạn D nói về khoảng cách quyết định: dưới 600 km thì đêm quá ngắn, trên 1.500 km thì mất lợi thế thời gian.', whyNot: 'Mẹo làm Heading: đọc câu ĐẦU và câu CUỐI mỗi đoạn trước, đúng chỗ đặt ý chính.' },
      { kind: 'TFNG', q: 'Night trains were removed from most European routes because passengers stopped enjoying them.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', why: 'Đoạn A nêu hai lý do khác hẳn: hãng bay giá rẻ bán vé rẻ hơn giường nằm, và toa xe cũ nát tốn phí bảo trì. Không hề nói khách hết thích.', whyNot: 'Chọn NOT GIVEN là bẫy hay gặp — bài CÓ nói về nguyên nhân, chỉ là nguyên nhân khác, nên phải là FALSE.' },
      { kind: 'TFNG', q: 'The Austrian operator bought the sleeping cars from a company that had planned to stop using them.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', why: 'Đoạn B: hãng Áo nhận lại đội toa nằm mà đường sắt Đức "had decided to abandon" — đúng nghĩa đã định bỏ.', whyNot: 'Paraphrase: "abandon" ↔ "stop using". Đề thật gần như luôn đổi từ như vậy.' },
      { kind: 'TFNG', q: 'Second-hand sleeping cars are now worth more than they were ten years ago.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', why: 'Đoạn F: toa cũ mười năm trước gần như vô giá trị nay sang tay ở mức giá chủ cũ khó tin nổi.', whyNot: 'Câu này nằm ở gần cuối bài — dạng TFNG KHÔNG đi theo thứ tự đoạn nếu đề trộn nhiều dạng, nên phải quét từ khoá "second-hand".' },
      { kind: 'MATCH', q: 'Ai cho rằng lợi ích môi trường trực tiếp mang tính biểu tượng nhiều hơn là thực chất?', options: ['Professor Adam Keller', 'Dr Marta Lindqvist', 'The writer', 'Rail managers'], answer: 'Professor Adam Keller', why: 'Đoạn E: Keller lưu ý số khách chở được quá nhỏ so với thị trường hàng không nên khoản tiết kiệm "closer to symbolic than to material".', whyNot: 'Lindqvist bàn về KHOẢNG CÁCH (đoạn D), không bàn về môi trường.' },
      { kind: 'MCQ', q: 'Theo đoạn D, vì sao chặng dưới 600 km không hợp với tàu đêm?', options: ['Vé quá đắt so với máy bay', 'Hành trình quá ngắn nên khách phải xuống tàu lúc năm giờ sáng', 'Đường ray không đủ tốt', 'Không có toa nằm cho chặng ngắn'], answer: 'Hành trình quá ngắn nên khách phải xuống tàu lúc năm giờ sáng', why: 'Đoạn D: "the journey is too short to fill a night, and passengers arrive exhausted at five in the morning".', whyNot: 'Ba phương án kia đều là chuyện có thật ngoài đời nhưng bài KHÔNG nói ở đoạn D — bẫy quen thuộc của MCQ.' },
      { kind: 'GAP', q: 'Aviation fuel is not ____________ in the way that road or rail energy is.', answer: 'taxed', why: 'Đoạn C câu thứ hai: "Aviation fuel is not taxed in the way that…".', whyNot: 'Điền đúng MỘT từ và giữ nguyên dạng bị động — viết "tax" là sai dạng.' },
      { kind: 'GAP', q: 'Operators wanting new routes are now waiting for ____________ rather than for passengers.', answer: 'vehicles', why: 'Đoạn F: "Operators who would like to add routes are therefore waiting for vehicles rather than for passengers".', whyNot: 'Viết "carriages" hay "trains" đều KHÔNG được tính: dạng GAP bắt chép ĐÚNG từ trong bài.' },
    ],
    strategy: [
      'Bài này nặng dạng Heading. Làm Heading TRƯỚC các dạng khác: đọc câu đầu và câu cuối mỗi đoạn, đó là chỗ đặt ý chính; phần giữa chỉ là ví dụ.',
      'Mỗi tiêu đề chỉ dùng cho MỘT đoạn. Chọn xong thì gạch tiêu đề đó đi — làm vậy ba câu cuối gần như tự ra.',
      'Phân biệt FALSE với NOT GIVEN: bài CÓ nói tới chủ đề nhưng nói KHÁC thì là FALSE; bài không hề đụng tới thì mới NOT GIVEN.',
      'Với dạng GAP, chép nguyên văn từ trong bài. Đồng nghĩa không được tính, kể cả khi nghĩa đúng — đây là chỗ mất điểm oan nhiều nhất ở band 6.0.',
    ],
    translation:
      'A. Suốt phần lớn thế kỷ XX, tàu giường nằm đơn giản là cách người ta băng qua châu Âu. Khách lên tàu ở một thủ đô sau bữa tối và bước xuống ở một thủ đô khác trước bữa sáng, trả tiền cho một cái giường và một chuyến đi cùng lúc. Tuy nhiên tới đầu những năm 2000, phần lớn các tuyến này đã bị ngừng. Các hãng bay giá rẻ bán ghế còn rẻ hơn giá một giường nằm, và bản thân các toa xe thì xuống cấp nặng, với chi phí bảo trì mà không nhà khai thác nào muốn gánh.\n\n'
      + 'B. Sự hồi phục, khi nó đến, lại do một hãng đường sắt nhà nước dẫn đầu chứ không phải một công ty mới. Năm 2016, nhà khai thác của Áo đồng ý tiếp nhận đội toa nằm mà đường sắt Đức đã quyết định bỏ, cùng với vài tuyến chúng đang chạy. Quyết định đó khi ấy trông có vẻ lập dị. Nó dựa trên một phép tính không hợp thời: rằng thiết bị vẫn còn nhiều năm sử dụng, và nhu cầu không biến mất mà chỉ là không được đo — vì một dịch vụ không ai quảng cáo thì bao giờ cũng trông có vẻ ế.\n\n'
      + 'C. Bài toán kinh tế vẫn khó, và cần nói chính xác vì sao. Nhiên liệu hàng không không bị đánh thuế theo cách áp cho năng lượng đường bộ hay đường sắt, và điều đó làm giá một chuyến bay ngắn đẹp hơn thực tế. Trong khi đó, một chuyến tàu đêm chiếm một khe giờ đắt đỏ trên mạng lưới suốt tám chín tiếng mà chở ít khách hơn một chiếc máy bay, lại cần nhân viên trên tàu suốt hành trình. Giới quản lý đường sắt mô tả kết quả là một sản phẩm kỳ lạ: khách nói là họ muốn, vé bán hết liên tục, mà vẫn chật vật bù nổi chi phí vận hành.\n\n'
      + 'D. Hoá ra khoảng cách mới là biến số quyết định. Tiến sĩ Marta Lindqvist, người nghiên cứu nhu cầu vận tải, cho rằng tàu nằm chỉ ăn trong một dải hẹp, khoảng từ sáu trăm tới một nghìn năm trăm ki-lô-mét. Dưới dải đó, hành trình quá ngắn để lấp đầy một đêm, và khách xuống tàu lúc năm giờ sáng trong tình trạng kiệt sức. Trên dải đó, tàu vẫn đang chạy vào giữa trưa và lợi thế thời gian sụp đổ. Nhưng trong dải đó, khách đổi một phòng khách sạn cộng một lần báo thức sớm lấy một cái giường, và phép so sánh với đi máy bay trở nên khó phân định hơn nhiều so với những gì giá vé gợi ra.\n\n'
      + 'E. Lập luận môi trường là lập luận hay được nêu nhất và cũng hay bị nói quá nhất. Lượng phát thải trên mỗi hành khách của tàu nằm chỉ bằng một phần nhỏ so với chuyến bay tương đương, và không ai tranh cãi con số đó. Dù vậy, giáo sư Adam Keller cảnh báo rằng tổng số người chở được vẫn rất bé bên cạnh thị trường hàng không, nên khoản tiết kiệm trực tiếp, theo cách ông nói, gần với biểu tượng hơn là thực chất. Phía ủng hộ thật ra không phản bác phép tính đó. Họ lập luận rằng tác động đi theo đường KỲ VỌNG: một khi tuyến đêm tồn tại và trông thấy rõ là kín chỗ, việc đi chậm thôi bị coi là lựa chọn lập dị — và cú dịch chuyển ấy đáng giá hơn phần phát thải tiết kiệm được trên bất kỳ tuyến đơn lẻ nào.\n\n'
      + 'F. Thứ đang giới hạn đà hồi sinh bây giờ không phải nhu cầu cũng không phải chính sách, mà là năng lực sản xuất. Toa nằm được vài hãng làm với số lượng nhỏ, và một đơn hàng đặt hôm nay có thể bốn hay năm năm nữa mới giao. Vì thế những nhà khai thác muốn mở thêm tuyến đang chờ PHƯƠNG TIỆN chứ không phải chờ khách, còn những toa xe cũ gần như vô giá trị một thập kỷ trước nay sang tay ở mức giá mà chủ cũ của chúng khó lòng tin nổi. Nói cách khác, nhịp độ của sự trở lại đang được định đoạt trong các nhà máy chứ không phải ở quầy bán vé.',
  },
  {
    id: 's3r3',
    title: 'The Crops We Stopped Growing',
    titleVi: 'Những cây lương thực ta đã thôi trồng',
    level: 'B2+ — dạng nối thông tin với đoạn, summary completion',
    words: 634,
    minutes: 17,
    paragraphs: [
      { label: 'A', text: 'Roughly two thirds of the calories eaten by human beings now come from three plants: rice, wheat and maize. This is a recent arrangement, and by the standards of agricultural history a very sudden one. A farmer in the same region two centuries ago would have grown perhaps a dozen staple crops, choosing between them according to the soil in a particular field and the weather of a particular year. Many of those plants have no commercial market today and survive only in gardens, in the seed collections of research institutes, and in the memory of people old enough to have eaten them as children.' },
      { label: 'B', text: 'The narrowing was not the result of any decision, and no committee ever chose the three crops that now feed the world. Plants that respond well to fertiliser, ripen at the same time and travel long distances without spoiling are simply easier to trade, and those advantages compound: a crop that is widely traded attracts research funding, funding improves the variety, a better variety increases the area planted, and a larger area makes the crop still easier to trade. Within a few decades the gap between a crop inside that cycle and one outside it becomes enormous. The crops left outside were not inferior in any biological sense. They simply never entered the cycle, and after two or three generations the practical knowledge of how to grow, store and cook them thinned out until it was held by almost nobody under sixty.' },
      { label: 'C', text: 'Finger millet is a useful example. It tolerates poor soil, needs about half the water that maize does, and stores for years without refrigeration because its grains are small and hard. Set against that, it takes far longer to process, and until recently no machine did the work well, which meant that every meal carried an invisible cost in somebody labour, almost always a woman.' },
      { label: 'D', text: 'That last point explains a great deal about why these crops disappeared, and it complicates the case for bringing them back. Dr Ngozi Ademola, an agricultural economist, warns that campaigns which present forgotten crops as simply better tend to be led by people who will never have to prepare them. In her view the technical problem must be solved first: if a household has to choose between an hour of grinding and a cheaper bag of milled maize, nutrition arguments will lose, and they should.' },
      { label: 'E', text: 'Where processing has been mechanised, the picture changes quickly. Small mills adapted for millet have spread across parts of southern India over the past decade, and consumption in those districts has risen without any campaign to persuade people of the health benefits. Professor Ravi Menon, who has followed the change, notes that this order of events is the opposite of what most food policy assumes: the machinery came first and the enthusiasm followed, rather than the other way round. He adds a warning that is easy to miss. The mills are useful only where the crop is already grown nearby, so investment in machinery without a matching investment in seed supply tends to produce equipment that stands idle within two seasons.' },
      { label: 'F', text: 'The strongest argument for diversity is not nutritional but statistical. A food system resting on three crops is exposed to anything that damages those three, whether that is a new disease, a change in rainfall or a war in a single exporting region, and warming makes such shocks more likely rather than less. Varieties that ripen in a shorter season, tolerate drought or resist a fungus that is currently spreading may matter enormously within a decade, and none of them can be created at short notice once the need becomes obvious. The cheapest time to keep such crops available is therefore now, while the seed still exists and while somebody still knows how to grow them.' },
    ],
    glossary: [
      { en: 'staple crop', ipa: '/ˈsteɪpl krɒp/', vi: 'cây lương thực chính' },
      { en: 'compound (v)', ipa: '/kəmˈpaʊnd/', vi: 'cộng dồn, càng lúc càng mạnh' },
      { en: 'tolerate', ipa: '/ˈtɒləreɪt/', vi: 'chịu được' },
      { en: 'refrigeration', ipa: '/rɪˌfrɪdʒəˈreɪʃn/', vi: 'sự làm lạnh, bảo quản lạnh' },
      { en: 'mechanise', ipa: '/ˈmekənaɪz/', vi: 'cơ giới hoá' },
      { en: 'be exposed to', ipa: '/bi ɪkˈspəʊzd tuː/', vi: 'chịu rủi ro trước' },
      { en: 'fungus', ipa: '/ˈfʌŋɡəs/', vi: 'nấm (gây bệnh cây)' },
    ],
    questions: [
      { kind: 'MATCH', q: 'Đoạn nào nêu một trường hợp mà thiết bị xuất hiện TRƯỚC rồi nhu cầu mới tăng theo?', options: ['Đoạn E', 'Đoạn B', 'Đoạn C', 'Đoạn F'], answer: 'Đoạn E', why: 'Đoạn E: máy xay nhỏ lan ra trước, lượng tiêu thụ tăng mà không cần chiến dịch thuyết phục nào — Menon gọi đó là thứ tự ngược với giả định của chính sách thực phẩm.', whyNot: 'Dạng Matching Information hỏi Ý NẰM Ở ĐOẠN NÀO, khác Matching Features (nối với NGƯỜI). Đọc kỹ đề trước khi quét.' },
      { kind: 'MATCH', q: 'Đoạn nào giải thích cơ chế khiến vài loại cây ngày càng chiếm ưu thế?', options: ['Đoạn B', 'Đoạn A', 'Đoạn D', 'Đoạn E'], answer: 'Đoạn B', why: 'Đoạn B mô tả vòng cộng dồn: cây dễ buôn bán → hút được tiền nghiên cứu → giống tốt lên → diện tích trồng tăng.', whyNot: 'Đoạn A chỉ nêu HIỆN TRẠNG (ba loại cây chiếm hai phần ba calo), không nêu cơ chế.' },
      { kind: 'MATCH', q: 'Đoạn nào cảnh báo về những người vận động cho cây bị lãng quên?', options: ['Đoạn D', 'Đoạn C', 'Đoạn F', 'Đoạn B'], answer: 'Đoạn D', why: 'Đoạn D: Ademola cảnh báo các chiến dịch coi cây bị lãng quên là "đơn giản tốt hơn" thường do những người sẽ không bao giờ phải tự chế biến chúng dẫn dắt.', whyNot: 'Đoạn C có nói tới công sức chế biến nhưng không hề nói tới người vận động.' },
      { kind: 'TFNG', q: 'Finger millet requires more water than maize.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', why: 'Đoạn C nói ngược: kê cần khoảng MỘT NỬA lượng nước so với ngô.', whyNot: 'Bẫy đảo chiều so sánh — dạng TFNG rất hay dùng. Đọc kỹ "half the water that maize does".' },
      { kind: 'TFNG', q: 'The crops that were abandoned produced less nutritious food than rice, wheat and maize.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', why: 'Đoạn B: "The crops left outside this cycle were not inferior. They simply never entered it."', whyNot: 'NOT GIVEN sai vì bài có nói thẳng — chỉ là nói ngược lại với câu hỏi.' },
      { kind: 'TFNG', q: 'Small mills for millet have been introduced in several countries in Africa.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN', why: 'Đoạn E chỉ nói tới các vùng ở MIỀN NAM ẤN ĐỘ. Bài không nhắc gì tới châu Phi trong chuyện máy xay.', whyNot: 'Có tên một nhà nghiên cứu nghe như tên châu Phi ở đoạn D — đúng bẫy khiến người đọc lướt tưởng bài có nói.' },
      { kind: 'GAP', q: 'Hoàn thành tóm tắt: About two thirds of human calories come from just ____________ plants.', answer: 'three', alt: ['3'], why: 'Đoạn A câu đầu: "come from three plants: rice, wheat and maize".', whyNot: 'Dạng Summary Completion thường bắt điền số — viết chữ hay viết số đều được, miễn đúng.' },
      { kind: 'GAP', q: 'Hoàn thành tóm tắt: Millet grains store for years without ____________ because they are small and hard.', answer: 'refrigeration', why: 'Đoạn C: "stores for years without refrigeration because its grains are small and hard".', whyNot: 'Chép nguyên văn một từ. Viết "a fridge" là sai vì không có trong bài.' },
      { kind: 'MCQ', q: 'Theo Dr Ademola, việc gì phải giải quyết TRƯỚC?', options: ['Thuyết phục người dân về lợi ích dinh dưỡng', 'Vấn đề kỹ thuật trong khâu chế biến', 'Giá bán ngô xay sẵn', 'Việc lưu giữ hạt giống'], answer: 'Vấn đề kỹ thuật trong khâu chế biến', why: 'Đoạn D: "the technical problem must be solved first" — nếu hộ gia đình phải chọn giữa một giờ giã hạt và một bao ngô xay rẻ hơn thì lập luận dinh dưỡng sẽ thua.', whyNot: 'A là thứ Ademola cho là KHÔNG hiệu quả nếu làm trước, chứ không phải việc cần làm trước.' },
      { kind: 'MCQ', q: 'Theo đoạn F, lý do mạnh nhất để giữ đa dạng cây trồng là gì?', options: ['Vì các cây đó bổ dưỡng hơn', 'Vì một hệ thống dựa vào ba loại cây chịu rủi ro trước bất cứ thứ gì hại tới ba loại đó', 'Vì nông dân muốn vậy', 'Vì chúng rẻ hơn để trồng'], answer: 'Vì một hệ thống dựa vào ba loại cây chịu rủi ro trước bất cứ thứ gì hại tới ba loại đó', why: 'Đoạn F mở thẳng: lập luận mạnh nhất "is not nutritional but statistical" — rủi ro tập trung.', whyNot: 'A bị bài loại trực tiếp bằng cụm "not nutritional". Đây là dạng câu hỏi mà đọc đúng MỘT cụm là loại được ngay một phương án.' },
    ],
    strategy: [
      'Matching Information (nối ý với ĐOẠN) khác Matching Features (nối ý với NGƯỜI). Bài này có cả hai kiểu tên riêng lẫn nhãn đoạn — đọc kỹ đề hỏi cái nào.',
      'Với Matching Information, đọc TẤT CẢ câu hỏi trước rồi mới quét bài một lượt. Quét đi quét lại từng câu là cách chắc chắn hết giờ.',
      'Câu NOT GIVEN ở bài này gài bằng một cái tên nghe như tên châu Phi. Đừng suy từ tên người ra địa điểm — chỉ tính những gì bài viết ra.',
      'Summary Completion: đọc cả đoạn tóm tắt trước khi điền, vì ngữ pháp của câu quyết định dạng từ cần điền.',
    ],
    translation:
      'A. Khoảng hai phần ba lượng calo mà loài người ăn hiện nay đến từ ba loại cây: lúa gạo, lúa mì và ngô. Đây là một sắp xếp mới có gần đây, và xét theo thước đo của lịch sử nông nghiệp thì rất đột ngột. Một nông dân ở cùng vùng đất ấy hai thế kỷ trước hẳn đã trồng cỡ một tá cây lương thực chính, chọn giữa chúng tuỳ theo chất đất của từng thửa ruộng và thời tiết của từng năm. Nhiều loài trong số đó nay không còn thị trường thương mại và chỉ sống sót trong vườn nhà, trong bộ sưu tập hạt giống của các viện nghiên cứu, và trong ký ức của những người đủ già để từng ăn chúng hồi bé.\n\n'
      + 'B. Sự thu hẹp đó không phải kết quả của quyết định nào cả, và chưa hội đồng nào từng chọn ra ba loại cây hiện đang nuôi cả thế giới. Những cây đáp ứng tốt với phân bón, chín cùng lúc và đi xa mà không hỏng thì đơn giản là dễ buôn bán hơn, và các lợi thế ấy cộng dồn: cây được buôn bán rộng thì hút được tiền nghiên cứu, tiền nghiên cứu cải thiện giống, giống tốt hơn làm tăng diện tích trồng, mà diện tích lớn hơn lại khiến cây càng dễ buôn bán. Chỉ sau vài thập kỷ, khoảng cách giữa một cây nằm trong vòng xoáy đó và một cây nằm ngoài trở nên rất lớn. Những cây bị bỏ lại bên ngoài không hề kém hơn về mặt sinh học. Chúng chỉ đơn giản chưa bao giờ bước vào vòng xoáy ấy, và sau hai ba thế hệ thì hiểu biết thực hành về cách trồng, cách trữ và cách nấu chúng cứ mỏng dần cho tới khi gần như không còn ai dưới sáu mươi tuổi nắm được.\n\n'
      + 'C. Kê ngón (finger millet) là một ví dụ hữu ích. Nó chịu được đất xấu, cần khoảng một nửa lượng nước so với ngô, và để được nhiều năm mà không cần bảo quản lạnh vì hạt nhỏ và cứng. Đổi lại, nó mất nhiều thời gian chế biến hơn hẳn, và cho tới gần đây chưa máy nào làm tốt việc đó — nghĩa là mỗi bữa ăn đều mang một chi phí vô hình tính bằng công sức của ai đó, và gần như luôn là một người phụ nữ.\n\n'
      + 'D. Chính điểm cuối ấy giải thích rất nhiều về việc vì sao những cây này biến mất, và nó làm phức tạp thêm lập luận đòi mang chúng trở lại. Tiến sĩ Ngozi Ademola, một nhà kinh tế nông nghiệp, cảnh báo rằng các chiến dịch trình bày cây bị lãng quên như thể đơn giản là tốt hơn thường do những người sẽ chẳng bao giờ phải tự chế biến chúng dẫn dắt. Theo bà, vấn đề kỹ thuật phải được giải quyết trước: nếu một hộ gia đình phải chọn giữa một tiếng đồng hồ giã hạt và một bao ngô xay sẵn rẻ hơn, lập luận dinh dưỡng sẽ thua — và đáng ra phải thua.\n\n'
      + 'E. Ở nơi khâu chế biến đã được cơ giới hoá, bức tranh đổi rất nhanh. Những máy xay nhỏ cải tiến cho kê đã lan ra nhiều vùng ở miền nam Ấn Độ trong thập kỷ qua, và mức tiêu thụ ở các huyện đó tăng lên mà không cần chiến dịch nào thuyết phục người dân về lợi ích sức khoẻ. Giáo sư Ravi Menon, người theo dõi thay đổi này, lưu ý rằng trình tự ấy ngược với điều mà phần lớn chính sách thực phẩm giả định: máy móc đến trước, còn sự hào hứng theo sau, chứ không phải ngược lại. Ông thêm một cảnh báo dễ bị bỏ qua. Máy xay chỉ hữu ích ở nơi cây đã được trồng sẵn quanh đó, nên đầu tư vào máy móc mà không đầu tư tương ứng vào nguồn giống thường dẫn tới việc thiết bị nằm không chỉ sau hai vụ.\n\n'
      + 'F. Lập luận mạnh nhất cho tính đa dạng không phải là dinh dưỡng mà là thống kê. Một hệ thống lương thực đặt trên ba loại cây thì chịu rủi ro trước bất cứ thứ gì gây hại cho ba loại đó — một dịch bệnh mới, một thay đổi về lượng mưa, hay một cuộc chiến ở đúng một vùng xuất khẩu — và khí hậu ấm lên khiến những cú sốc như vậy dễ xảy ra hơn chứ không ít đi. Những giống chín trong mùa vụ ngắn hơn, chịu được hạn, hay kháng được một loại nấm đang lan có thể trở nên cực kỳ quan trọng trong vòng một thập kỷ, và không giống nào trong số đó tạo ra kịp khi nhu cầu đã lộ rõ. Vì thế thời điểm rẻ nhất để giữ những cây ấy còn sẵn đó chính là bây giờ, khi hạt giống vẫn còn và khi vẫn còn người biết cách trồng chúng.',
  },
];

/* ══════════════════════ NGHE ══════════════════════ */

export const LISTENINGS3B: ListeningExercise[] = [
  {
    id: 's3l2',
    title: 'Booking a Place on a Photography Course',
    titleVi: 'Giữ chỗ khoá nhiếp ảnh buổi tối',
    kind: 'Section 1 — điền biểu mẫu, hai người nói',
    level: 'Vừa · nhưng đúng chỗ mất điểm oan: số, tên riêng, tiền',
    context:
      'Section 1 luôn là một cuộc trao đổi đời thường có ghi chép: đăng ký, đặt chỗ, hỏi dịch vụ. Nội dung dễ, '
      + 'điểm mất lại nhiều — vì đáp án là SỐ, TÊN RIÊNG đánh vần và MỨC TIỀN, và người nói hay tự sửa lại giữa chừng. '
      + 'Nghe được mà viết sai chính tả vẫn 0 điểm.',
    lines: [
      { who: 'Nhân viên', text: 'Good afternoon, Adult Learning Centre. How can I help?' },
      { who: 'Khách', text: 'Hello. I would like to enrol on the evening photography course, if there are places left.' },
      { who: 'Nhân viên', text: 'There are. Could I take your full name?' },
      { who: 'Khách', text: 'It is Hoang Minh Trang. The family name is Hoang, H-O-A-N-G.' },
      { who: 'Nhân viên', text: 'Thank you. And a contact number?' },
      { who: 'Khách', text: 'It is oh nine one four, double two six, four seven three.' },
      { who: 'Nhân viên', text: 'Let me read that back. Oh nine one four, double two six, four seven three. Now, the course runs on Wednesdays.' },
      { who: 'Khách', text: 'Wednesdays? I was told it was Tuesdays.' },
      { who: 'Nhân viên', text: 'It was Tuesdays last term. From September it moves to Wednesdays, seven until nine.' },
      { who: 'Khách', text: 'That is fine. And how much is it?' },
      { who: 'Nhân viên', text: 'The full fee is ninety-five pounds for ten weeks. With a student card it comes down to seventy.' },
      { who: 'Khách', text: 'I have a student card, so seventy. Do I pay today?' },
      { who: 'Nhân viên', text: 'A deposit of twenty secures the place, and the rest is due on the first evening.' },
      { who: 'Khách', text: 'Is there anything I need to bring?' },
      { who: 'Nhân viên', text: 'Any camera you have, including a phone. The centre lends tripods, but not memory cards, so bring your own.' },
      { who: 'Khách', text: 'Where does it meet?' },
      { who: 'Nhân viên', text: 'Room fourteen in the Fielding Building. That is F-I-E-L-D-I-N-G. It is behind the main library.' },
      { who: 'Khách', text: 'And who teaches it?' },
      { who: 'Nhân viên', text: 'A tutor called Sara Whitlock, spelt W-H-I-T-L-O-C-K. She will email you the reading list before the first session.' },
    ],
    questions: [
      { q: 'Family name: ____________', answer: 'Hoang', why: 'Người gọi đánh vần rõ H-O-A-N-G. Section 1 gần như luôn có một tên được đánh vần — viết đúng từng chữ.' },
      { q: 'Contact number: ____________', answer: '0914226473', alt: ['0914 226 473', '091 422 6473'], why: '"oh nine one four, double two six, four seven three". "double two" = 22. Nhân viên đọc lại một lần để kiểm — đó là cơ hội soát của bạn.' },
      { q: 'Day of the course: ____________', answer: 'Wednesday', alt: ['Wednesdays', 'Wednesday evening'], why: 'Bẫy chính: Tuesdays là học kỳ TRƯỚC. Từ tháng Chín chuyển sang thứ Tư. Đáp án luôn là thông tin ĐÃ SỬA.' },
      { q: 'Time: from ____________ to nine', answer: '7', alt: ['seven', '7pm', '7 pm'], why: '"seven until nine". Ghi số cho nhanh, nhưng phải rõ ràng.' },
      { q: 'Fee with a student card: £____________', answer: '70', alt: ['seventy'], why: 'Phí đầy đủ là 95, có thẻ sinh viên còn 70. Đề hỏi mức CÓ THẺ — đọc kỹ đề trước khi nghe.' },
      { q: 'Deposit: £____________', answer: '20', alt: ['twenty'], why: '"A deposit of twenty secures the place". Ba con số tiền trong một đoạn là bẫy cố ý của Section 1.' },
      { q: 'Item students must bring themselves: ____________', answer: 'memory cards', alt: ['memory card', 'a memory card'], why: 'Trung tâm CHO MƯỢN chân máy nhưng KHÔNG có thẻ nhớ. Nghe "but not…" là biết đáp án nằm ngay sau.' },
      { q: 'Room: ____________ , Fielding Building', answer: '14', alt: ['fourteen', 'Room 14'], why: '"Room fourteen in the Fielding Building". Cẩn thận fourteen (14) và forty (40) — hai từ này khác nhau ở TRỌNG ÂM.' },
      { q: 'Name of the tutor: Sara ____________', answer: 'Whitlock', why: 'Đánh vần W-H-I-T-L-O-C-K. Chép từng chữ ngay lúc nghe, đừng đợi nghe xong mới nhớ lại.' },
    ],
    listenFor: ['double two (= 22)', 'It was Tuesdays LAST TERM (thông tin cũ)', 'With a student card it comes down to…', 'but not memory cards', 'spelt W-H-I-T-L-O-C-K'],
    tips: [
      'Ba bẫy kinh điển của Section 1 đều có trong bài: (1) tự sửa thông tin — thứ Ba đổi thành thứ Tư; (2) nhiều mức tiền liền nhau; (3) tên riêng phải chép theo đánh vần.',
      '"double two" = 22, "treble/triple five" = 555. Nghe quen thì nhanh hơn hẳn.',
      'fourteen–forty, fifteen–fifty, sixteen–sixty phân biệt bằng TRỌNG ÂM: fourTEEN nhấn cuối, FORty nhấn đầu.',
      'Đọc trước biểu mẫu và đoán loại dữ liệu từng dòng (số? tên? tiền?). Biết trước cần loại gì thì tai bắt nhanh hơn nhiều.',
    ],
  },
  {
    id: 's3l3',
    title: 'Welcome Talk at Rowan Community Farm',
    titleVi: 'Buổi giới thiệu tại nông trại cộng đồng',
    kind: 'Section 2 — độc thoại + BẢN ĐỒ (Map Labelling)',
    level: 'Khó vừa · dạng bản đồ là chỗ mất điểm tập trung nhất',
    context:
      'Section 2 là độc thoại về một địa điểm hoặc dịch vụ, và rất hay kèm bản đồ. Cách làm: đặt ngón tay ở MỐC XUẤT PHÁT '
      + 'mà người nói nêu, rồi di theo lời chỉ dẫn. Không di theo thì chỉ hai câu là lạc.',
    figure: {
      kind: 'map',
      title: 'Rowan Community Farm — điền tên vào các ô viền đứt (A–E)',
      note: 'Bắt đầu từ Main gate ở phía dưới. Vừa nghe vừa DI NGÓN TAY theo lời chỉ dẫn.',
      map: {
        cols: 12,
        rows: 9,
        paths: [
          { x: 1, y: 5, w: 10, h: 1, label: 'main path' },
          { x: 5.5, y: 1, w: 1, h: 4, label: '' },
        ],
        boxes: [
          { x: 1, y: 3, w: 2.5, h: 2, label: 'Car park' },
          { x: 4, y: 3, w: 1.5, h: 2, blank: 'A' },
          { x: 6.5, y: 3, w: 2, h: 2, blank: 'B' },
          { x: 9, y: 3, w: 2, h: 2, label: 'Greenhouse' },
          { x: 3.5, y: 1, w: 2.5, h: 1.5, blank: 'C' },
          { x: 6.5, y: 1, w: 2, h: 1.5, blank: 'D' },
          { x: 9, y: 1, w: 2, h: 1.5, label: 'Orchard' },
          { x: 4, y: 6.5, w: 2.5, h: 1.5, blank: 'E' },
          { x: 7.5, y: 6.5, w: 2.5, h: 1.5, label: 'Compost yard' },
        ],
        pins: [
          { x: 3.6, y: 8.4, label: 'Main gate (bạn đang ở đây)' },
        ],
      },
    },
    lines: [
      { who: 'Hướng dẫn viên', text: 'Welcome to Rowan Community Farm. Before we walk round, let me point out where everything is, using the map on your sheet.' },
      { who: 'Hướng dẫn viên', text: 'We are standing at the main gate, at the bottom of the map. The wide path in front of you runs left to right across the whole site.' },
      { who: 'Hướng dẫn viên', text: 'Just to your right, on this side of the main path, is the tool store. That is where you collect gloves and spades, and it is the first thing you will need on a working day.' },
      { who: 'Hướng dẫn viên', text: 'Next to the tool store, further along to the right, is the compost yard, which is clearly marked already.' },
      { who: 'Hướng dẫn viên', text: 'Now cross the main path. On the far side, immediately to the right of the car park, you will find the seed shed, which is the smallest building on the site.' },
      { who: 'Hướng dẫn viên', text: 'To the right of the seed shed, between it and the greenhouse, is the volunteer kitchen. Tea is available there all day, and lunch on Saturdays.' },
      { who: 'Hướng dẫn viên', text: 'The large building at the end of that row, on the far right, is the greenhouse. That one is labelled for you.' },
      { who: 'Hướng dẫn viên', text: 'Behind the seed shed, at the top left of the map, is the wildlife pond. Please keep dogs away from it in spring.' },
      { who: 'Hướng dẫn viên', text: 'And directly behind the volunteer kitchen, at the top of the map, is the classroom, where school groups are taught. The orchard is beyond it, on the right.' },
      { who: 'Hướng dẫn viên', text: 'A few practical points. Sessions run from ten until one on Tuesdays, Thursdays and Saturdays. You do not need to book for Tuesday or Thursday, but Saturday fills up, so please sign up online by the Friday.' },
      { who: 'Hướng dẫn viên', text: 'Everything harvested is shared between the volunteers who worked that day and the food bank in town, and the split is decided by whoever is leading the session.' },
      { who: 'Hướng dẫn viên', text: 'One last thing. The site has no drinking water beyond the kitchen tap, so bring a bottle, and wear boots rather than trainers — the ground stays wet well into June.' },
    ],
    questions: [
      { q: 'A = ____________', answer: 'seed shed', alt: ['the seed shed'], why: '"On the far side, immediately to the right of the car park, you will find the seed shed" — phải sang bên kia lối đi chính rồi mới tính từ bãi xe sang phải.' },
      { q: 'B = ____________', answer: 'volunteer kitchen', alt: ['the volunteer kitchen', 'kitchen'], why: '"To the right of the seed shed, between it and the greenhouse, is the volunteer kitchen" — định vị bằng HAI mốc cùng lúc, dạng chỉ dẫn khó nhất của Section 2.' },
      { q: 'C = ____________', answer: 'wildlife pond', alt: ['the wildlife pond', 'pond'], why: '"Behind the seed shed, at the top left of the map, is the wildlife pond."' },
      { q: 'D = ____________', answer: 'classroom', alt: ['the classroom'], why: '"directly behind the volunteer kitchen, at the top of the map, is the classroom".' },
      { q: 'E = ____________', answer: 'tool store', alt: ['the tool store'], why: '"Just to your right, on this side of the main path, is the tool store." Đây là ô ĐẦU TIÊN được nhắc — nếu bỏ lỡ thì lệch cả bài.' },
      { q: 'Sessions finish at ____________ o clock.', answer: '1', alt: ['one', '1pm', 'one o clock'], why: '"Sessions run from ten until one".' },
      { q: 'You must sign up online by the ____________ for Saturday sessions.', answer: 'Friday', why: '"Saturday fills up, so please sign up online by the Friday." Thứ Ba và thứ Năm thì KHÔNG cần đặt trước — bẫy nếu nghe lướt.' },
      { q: 'Harvested food is shared with the volunteers and the ____________ in town.', answer: 'food bank', alt: ['the food bank'], why: '"shared between the volunteers who worked that day and the food bank in town".' },
      { q: 'Visitors should wear ____________ rather than trainers.', answer: 'boots', why: '"wear boots rather than trainers — the ground stays wet well into June".' },
    ],
    listenFor: ['on this side of / on the far side (bên nào của lối đi)', 'opposite / next to / behind / at the end of', 'in the middle of that row', 'but Saturday fills up', 'rather than'],
    tips: [
      'Trước khi nghe, tìm MỐC đã ghi sẵn trên bản đồ (ở đây là Car park, Greenhouse, Orchard, Compost yard) — người nói sẽ dùng chính chúng để định vị các ô trống.',
      'Xác định hướng ngay câu đầu: "We are standing at the main gate, at the bottom of the map". Không biết mình đứng đâu thì mọi chỉ dẫn trái/phải đều vô nghĩa.',
      'Từ chỉ vị trí phải thuộc lòng: opposite (đối diện), next to (kế bên), behind (phía sau), beyond (xa hơn nữa), at the end of (cuối dãy), in the middle of (giữa dãy), on this/the far side of (bên này/bên kia).',
      'Bản đồ đi THEO THỨ TỰ lời nói chứ không theo thứ tự A, B, C. Bài này nhắc E trước A — đó là lý do phải di ngón tay chứ không dò chữ cái.',
    ],
  },
  {
    id: 's3l4',
    title: 'Lecture: Trees and City Temperature',
    titleVi: 'Bài giảng: cây xanh và nhiệt độ đô thị',
    kind: 'Section 4 — bài giảng, điền ghi chú',
    level: 'Khó · nói liên tục, không nhắc lại',
    context:
      'Section 4 là bài giảng một người nói liên tục, không có ai hỏi lại và không nhắc lại lần nào. Ghi chú in sẵn '
      + 'theo ĐÚNG thứ tự bài nói. Việc quan trọng nhất làm trước khi nghe: đọc hết ghi chú và đoán LOẠI TỪ cho từng chỗ trống.',
    lines: [
      { who: 'Giảng viên', text: 'This morning we are looking at urban heat, and specifically at what trees do and do not do about it.' },
      { who: 'Giảng viên', text: 'Cities are warmer than the countryside around them. The difference is called the urban heat island, and in a large city it typically reaches four degrees, though on still nights it can be considerably more.' },
      { who: 'Giảng viên', text: 'Two mechanisms explain most of it. First, hard surfaces such as asphalt absorb heat during the day and release it slowly after dark, which is why the gap is widest at night rather than at noon.' },
      { who: 'Giảng viên', text: 'Second, a city has very little evaporation. In a field, a large share of the energy arriving from the sun is spent turning water into vapour instead of raising the temperature. Drain the water away through pipes, as cities do, and that cooling simply does not happen.' },
      { who: 'Giảng viên', text: 'Trees address both mechanisms at once. They shade the surfaces that would otherwise store heat, and they move water from the soil into the air through their leaves, a process called transpiration. A mature street tree can release several hundred litres on a hot day.' },
      { who: 'Giảng viên', text: 'The measured effect is significant but smaller than people expect. Under a well-shaded canopy, air temperature is typically two degrees lower than on an exposed street nearby. What people actually feel, however, is a much bigger difference, because direct sunlight on the skin matters more to comfort than air temperature does.' },
      { who: 'Giảng viên', text: 'There is an important qualification. Trees only cool while they have access to water. During the severe drought of recent summers, street trees in several European cities closed their pores to conserve moisture, and their cooling effect fell by roughly half at precisely the moment it was needed most.' },
      { who: 'Giảng viên', text: 'That has consequences for planting policy. A tree planted and then forgotten will often survive but do very little, because it never develops the root system that heavy transpiration requires. Watering for the first three years is therefore not a luxury; it is what determines whether the tree works.' },
      { who: 'Giảng viên', text: 'Finally, placement. The greatest benefit comes not from parks, valuable though they are, but from trees on narrow residential streets, where shade falls directly on walls and windows and where the people most vulnerable to heat actually live.' },
    ],
    questions: [
      { q: 'The temperature difference between a city and the surrounding area is called the urban ____________ island.', answer: 'heat', why: '"The difference is called the urban heat island."' },
      { q: 'In a large city the difference typically reaches ____________ degrees.', answer: '4', alt: ['four'], why: '"in a large city it typically reaches four degrees". Chú ý "typically" — con số điển hình, không phải cực đại.' },
      { q: 'The gap is widest at ____________ rather than at noon.', answer: 'night', why: 'Bề mặt cứng nhả nhiệt chậm sau khi trời tối, nên chênh lệch lớn nhất vào ban đêm.' },
      { q: 'Cities have very little ____________ because water is drained away through pipes.', answer: 'evaporation', why: '"a city has very little evaporation… Drain the water away through pipes, as cities do, and that cooling simply does not happen."' },
      { q: 'Trees move water into the air through their leaves in a process called ____________.', answer: 'transpiration', why: '"a process called transpiration" — thuật ngữ được nêu thẳng, dạng Section 4 rất hay hỏi vào đó.' },
      { q: 'Under a shaded canopy, air temperature is about ____________ degrees lower.', answer: '2', alt: ['two'], why: '"air temperature is typically two degrees lower than on an exposed street nearby". Bẫy: bài có HAI con số độ (4 và 2) cho hai ý khác nhau.' },
      { q: 'During severe drought, the cooling effect fell by roughly ____________.', answer: 'half', why: '"their cooling effect fell by roughly half at precisely the moment it was needed most".' },
      { q: 'Newly planted trees need watering for the first ____________ years.', answer: '3', alt: ['three'], why: '"Watering for the first three years is therefore not a luxury."' },
      { q: 'The greatest benefit comes from trees on narrow ____________ streets.', answer: 'residential', why: '"from trees on narrow residential streets, where shade falls directly on walls and windows".' },
    ],
    listenFor: ['a process called… (báo hiệu thuật ngữ)', 'typically (con số điển hình)', 'There is an important qualification (sắp có hạn định)', 'not a luxury; it is what determines…', 'Finally, placement'],
    tips: [
      'Đọc hết ghi chú TRƯỚC và đoán loại từ: chỗ "the urban ___ island" chắc chắn là danh từ; "fell by roughly ___" là số hoặc lượng. Đoán được loại từ thì tai bắt nhanh hơn nhiều.',
      'Bài có bốn con số (4 độ, 2 độ, một nửa, 3 năm) gắn với bốn ý khác nhau — đây là bẫy chính. Bám vào NGỮ CẢNH quanh số, đừng chỉ chờ nghe thấy số.',
      '"There is an important qualification" là cụm báo hiệu rất mạnh: sắp có một điều kiện làm hẹp lại điều vừa nói. Section 4 gần như luôn có ít nhất một chỗ như vậy.',
      'Ghi chú Section 4 đi ĐÚNG thứ tự bài giảng. Lỡ một câu thì bỏ luôn câu đó và bám lấy câu kế tiếp — cố quay lại là mất thêm hai câu nữa.',
    ],
  },
];

/* ══════════════════════ VIẾT ══════════════════════ */

export const WRITINGS3B: WritingTask[] = [
  {
    id: 's3w3',
    task: 'Task 1 (Academic)',
    title: 'Biểu đồ tròn — lý do chọn học trực tuyến',
    figure: {
      kind: 'pie',
      title: 'Main reason given for choosing an online course (% of respondents)',
      note: 'Số liệu tự đặt cho bài luyện. Biểu đồ tròn chỉ có MỘT thời điểm — không có xu hướng, nên tuyệt đối không dùng từ tăng/giảm.',
      unit: '%',
      slices: [
        { label: 'A timetable that fits around work', value: 38 },
        { label: 'Lower cost than attending in person', value: 24 },
        { label: 'No suitable course available locally', value: 16 },
        { label: 'Required by an employer', value: 13 },
        { label: 'Other reasons', value: 9 },
      ],
    },
    prompt: 'The pie chart below shows the main reason given by adult learners for choosing an online course rather than a course taught in person. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    promptVi: 'Biểu đồ tròn cho biết lý do chính mà người học trưởng thành đưa ra khi chọn khoá học trực tuyến thay vì khoá học trực tiếp. Tóm tắt bằng cách chọn và tường thuật các đặc điểm chính, có so sánh khi cần.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Câu mở', what: 'Viết lại đề. Với biểu đồ tròn, nêu rõ đây là TỶ LỆ PHẦN TRĂM của một nhóm tại MỘT thời điểm — chính chỗ này phân biệt người biết đọc biểu đồ và người không.' },
      { part: 'Câu tổng quan', what: 'BẮT BUỘC, không số liệu. Với biểu đồ tròn, tổng quan gần như luôn là: phần lớn nhất là gì, và các phần còn lại xếp thế nào so với nó.' },
      { part: 'Thân 1', what: 'Hai phần lớn nhất (38% và 24%) — cộng lại đã quá nửa. Nêu con số cộng dồn là cách CHỌN LỌC, không phải liệt kê.' },
      { part: 'Thân 2', what: 'Ba phần nhỏ (16%, 13%, 9%). Nhóm chúng lại, đừng dành mỗi phần một câu riêng.' },
    ],
    phrases: [
      { en: 'The pie chart shows the proportion of learners who…', vi: 'Biểu đồ tròn cho biết tỷ lệ người học…' },
      { en: 'accounted for just over a third', vi: 'chiếm hơn một phần ba một chút' },
      { en: 'made up almost a quarter', vi: 'chiếm gần một phần tư' },
      { en: 'Taken together, these two reasons…', vi: 'Gộp lại, hai lý do này…' },
      { en: 'The remaining three categories…', vi: 'Ba nhóm còn lại…' },
      { en: 'the least frequently cited reason', vi: 'lý do ít được nêu nhất' },
    ],
    sample: {
      band: 'Mức 7.0 — nhóm được các phần, có con số cộng dồn',
      text: 'The pie chart shows the proportion of adult learners giving each of five reasons for studying online rather than in person.\n\nOverall, convenience and cost dominated the responses: together they were cited by well over half of those surveyed, while the three remaining reasons attracted far smaller and fairly similar shares.\n\nA timetable that fits around work was by far the most common reason, accounting for 38% of respondents, and lower cost came second at 24%. Taken together, these two practical considerations were given by 62% of learners, which is close to two thirds of the sample.\n\nThe remaining three categories were much less prominent. The absence of a suitable local course was mentioned by 16%, and an employer requirement by 13%, so these two were separated by only three percentage points. Other reasons made up the smallest share at 9%, meaning that fewer than one learner in ten gave a reason outside the four named categories.',
      note: '158 từ. Ba chỗ ăn điểm ở band 7.0: (1) câu tổng quan gộp hai lý do lớn thành MỘT ý ("convenience and cost") thay vì đọc lại số lớn nhất; (2) cộng 38 + 24 = 62% rồi diễn giải thành "gần hai phần ba" — đó là chọn lọc và so sánh, đúng yêu cầu đề; (3) ba phần nhỏ được nhóm vào một đoạn và nêu KHOẢNG CÁCH giữa chúng (3 điểm phần trăm) thay vì đọc từng số.',
    },
    weakSample: {
      band: 'Mức 6.0 — đọc lần lượt từng phần, dùng nhầm từ xu hướng',
      text: 'The pie chart shows the reasons why people choose online courses. There are five reasons in the chart.\n\nThe first reason is a timetable that fits around work, which is 38%. The second reason is lower cost, which is 24%. The third reason is no suitable course available locally, which is 16%. The fourth reason is required by an employer, which is 13%. The last reason is other reasons, which is 9%.\n\nAs we can see from the chart, the number of people choosing a flexible timetable increased to 38%, while other reasons decreased to 9%. In conclusion, online courses are becoming more and more popular nowadays.',
      problems: [
        'Đọc lần lượt năm phần theo đúng thứ tự chú giải — đây là "đọc biểu đồ thành lời", không phải chọn lọc.',
        'Dùng "increased" và "decreased" cho biểu đồ tròn. Biểu đồ tròn chỉ có MỘT thời điểm nên không có tăng giảm nào cả — lỗi này báo ngay cho giám khảo là người viết không hiểu loại biểu đồ.',
        'Không có câu tổng quan thật sự; câu "There are five reasons" chỉ đếm lại chú giải.',
        'Không có so sánh nào, trong khi đề yêu cầu rõ "make comparisons where relevant".',
        'Câu kết nêu ý kiến ("online courses are becoming more popular") — vừa là bình luận ngoài Task 1, vừa là thông tin KHÔNG có trong biểu đồ.',
        'Lặp cấu trúc "The … reason is …, which is …%" năm lần liền.',
      ],
    },
    mistakes: [
      { wrong: 'The number of people choosing a flexible timetable increased to 38%.', right: 'A flexible timetable accounted for 38% of responses.', why: 'Biểu đồ tròn là một lát cắt tại MỘT thời điểm. Mọi từ chỉ xu hướng (increase, decrease, rise, fall) đều sai ở đây, dù câu văn nghe trôi chảy.' },
      { wrong: 'Liệt kê lần lượt cả năm phần, mỗi phần một câu.', right: 'Gộp hai phần lớn (38 + 24 = 62%) rồi gộp ba phần nhỏ vào một đoạn.', why: 'Cộng dồn và nhóm là cách thể hiện "selecting the main features". Đọc đủ năm số mà không nhóm thì trần điểm khoảng 6.0.' },
      { wrong: 'The chart shows 38 percent, 24 percent, 16 percent…', right: '…accounted for just over a third, almost a quarter, and roughly one in six respectively.', why: 'Ở band 7.0 nên xen kẽ số phần trăm với cách nói phân số (a third, a quarter, one in six). Dùng một kiểu suốt bài bị chấm là hạn chế về diễn đạt.' },
      { wrong: 'In conclusion, online courses are becoming more popular.', right: '(Bỏ hẳn — Task 1 không có kết luận và không suy diễn ngoài biểu đồ.)', why: 'Task 1 chỉ tường thuật cái CÓ trong hình. Thông tin về xu hướng phổ biến không hề nằm trong biểu đồ này.' },
    ],
  },
  {
    id: 's3w4',
    task: 'Task 2 (Thảo luận hai quan điểm)',
    title: 'Lao động cộng đồng: bắt buộc hay tự nguyện',
    prompt: 'Some people believe that every young adult should spend a period of time doing unpaid work for the community. Others think that this should remain a personal choice. Discuss both views and give your own opinion. Write at least 250 words.',
    promptVi: 'Một số người cho rằng mọi thanh niên nên dành một khoảng thời gian làm việc không lương phục vụ cộng đồng. Số khác cho rằng đây nên là lựa chọn cá nhân. Thảo luận cả hai quan điểm và nêu ý kiến của bạn.',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài', what: 'Viết lại đề bằng từ khác + nêu ngay lập trường của mình. Dạng "Discuss both views" vẫn BẮT BUỘC có ý kiến riêng — bỏ quên là mất điểm Task Response nặng nhất.' },
      { part: 'Thân 1 — Quan điểm A', what: 'Trình bày phía ủng hộ bắt buộc CHO CÔNG BẰNG, kể cả khi bạn không theo phía đó. Một lý do, giải thích sâu, có ví dụ.' },
      { part: 'Thân 2 — Quan điểm B', what: 'Phía ủng hộ tự nguyện. Cũng một lý do được giải thích sâu — không phải danh sách.' },
      { part: 'Thân 3 hoặc Kết bài — Ý kiến', what: 'Lập trường của bạn phải NHẤT QUÁN với hai đoạn trên và nêu điều kiện đi kèm. Đây là chỗ phân biệt 6.5 với 6.0.' },
    ],
    phrases: [
      { en: 'Those who favour a compulsory scheme point out that…', vi: 'Những người ủng hộ chương trình bắt buộc chỉ ra rằng…' },
      { en: 'The opposing view rests on…', vi: 'Quan điểm đối lập dựa trên…' },
      { en: 'There is force in both positions.', vi: 'Cả hai lập trường đều có sức nặng.' },
      { en: 'My own view is closer to the second, though with one qualification.', vi: 'Quan điểm của tôi gần với phía thứ hai hơn, dù có một điểm hạn định.' },
      { en: 'What makes the difference is whether…', vi: 'Điều tạo ra khác biệt là liệu…' },
      { en: 'in practice', vi: 'trên thực tế' },
    ],
    sample: {
      band: 'Mức 6.5–7.0 — hai phía cân nhau, ý kiến có điều kiện',
      text: 'It is sometimes proposed that all young adults should be required to complete a period of unpaid community service, while others maintain that volunteering only means anything if it is freely chosen. Both positions have force, though I believe the second is closer to the truth once the practical details are examined.\n\nThose who favour a compulsory scheme point out that voluntary participation is never evenly spread. In most countries the young people who volunteer are already the most advantaged: they hear about opportunities through their families, and they can afford to work without pay for several months. A universal requirement removes that filter, so a young person from a poorer background gains the same experience and the same line on a curriculum vitae as everyone else. Supporters also argue that mixing young people from different backgrounds is valuable in itself, and that this rarely happens by accident.\n\nThe opposing view rests on what compulsion does to the work. A hospital or charity that receives unwilling helpers must supervise them, and supervision consumes the time of experienced staff, which can leave an organisation worse off than before. There is also a question of honesty: work performed under obligation is not really service, and calling it so teaches young people that the label matters more than the intention behind it.\n\nMy own view is closer to the second position, though with one qualification. If the aim is genuinely to widen access rather than to produce free labour, the sensible policy is to pay young volunteers a modest allowance and keep participation optional. That removes the financial barrier the first group correctly identifies, without creating the resentment that compulsion reliably produces.',
      note: '288 từ. Bốn thứ đưa bài này lên 6.5–7.0: (1) mở bài nêu LẬP TRƯỜNG ngay, không hoãn tới kết bài; (2) mỗi phía chỉ MỘT lý do nhưng được giải thích tới tầng hệ quả; (3) đoạn ý kiến không lặp lại hai đoạn trên mà đưa ra một giải pháp thứ ba xử lý được điểm đúng của cả hai phía; (4) câu cuối nối thẳng về lý lẽ của phía thứ nhất ("removes the financial barrier the first group correctly identifies") — đó là mạch lạc thật, không phải từ nối.',
    },
    weakSample: {
      band: 'Mức 5.5–6.0 — hai danh sách rời, quên nêu ý kiến rõ ràng',
      text: 'Nowadays, community service is a controversial topic. Some people think young adults should do unpaid work, but other people disagree. This essay will discuss both views.\n\nOn the one hand, unpaid work has many advantages. Firstly, young people can learn new skills. Secondly, they can help poor people in their community. Thirdly, it looks good on their CV. Fourthly, they can make new friends.\n\nOn the other hand, there are also disadvantages. Some young people are very busy with their studies. Also, they may not be interested in the work. Moreover, some organisations do not need help. In addition, forcing people is not good.\n\nIn conclusion, both views have advantages and disadvantages. I think the government should consider this issue carefully and make a suitable decision for everyone.',
      problems: [
        'KHÔNG nêu ý kiến riêng. "The government should consider this carefully" là né tránh — đề bắt buộc "give your own opinion", nên đây là lỗi nặng nhất của bài.',
        'Bốn ý mỗi phía, mỗi ý đúng một câu, không ý nào được giải thích hay có ví dụ.',
        'Hai đoạn thân là hai danh sách song song, không hề đối thoại với nhau.',
        'Mở bài dùng "Nowadays… is a controversial topic" — công thức học thuộc, không viết lại đề.',
        'Lặp nhãn từ nối: Firstly, Secondly, Thirdly, Fourthly, Also, Moreover, In addition.',
        'Chỉ 128 từ, chưa tới nửa mức tối thiểu 250 — riêng điều này đã chặn trần dưới 6.0.',
      ],
    },
    mistakes: [
      { wrong: 'In conclusion, both views have advantages and disadvantages.', right: 'My own view is closer to the second position, though with one qualification: …', why: 'Dạng "Discuss both views AND give your own opinion" có HAI yêu cầu. Bỏ yêu cầu thứ hai là mất điểm Task Response nặng, dù phần thảo luận viết tốt.' },
      { wrong: 'Firstly… Secondly… Thirdly… Fourthly…', right: 'Một lý do được triển khai đủ ba lớp: nêu → giải thích → hệ quả hoặc ví dụ.', why: 'Bốn ý nông không bằng một ý sâu. Đây là khác biệt rõ nhất giữa 5.5 và 6.5 ở Task 2.' },
      { wrong: 'Nêu quan điểm A ở thân 1, quan điểm B ở thân 2, rồi kết bài nói chung chung.', right: 'Đoạn ý kiến phải NỐI về lý lẽ đã nêu ở hai đoạn trên, chỉ rõ mình giữ lại điểm đúng nào của mỗi phía.', why: 'Coherence chấm việc các đoạn có nói chuyện với nhau không. Ba đoạn rời nhau bị chấm là danh sách, không phải bài luận.' },
      { wrong: 'Some people think… but other people disagree.', right: 'It is sometimes proposed that all young adults should be required to…, while others maintain that…', why: 'Viết lại đề bằng cấu trúc và từ vựng của mình chính là cơ hội ăn điểm sớm nhất trong bài.' },
    ],
  },
];

/* ══════════════════════ NÓI ══════════════════════ */

export const SPEAKINGS3B: SpeakingTopic[] = [
  {
    id: 's3sp2',
    part: 'Part 2 — Cue card (nói 2 phút)',
    title: 'A skill you learned outside school',
    titleVi: 'Một kỹ năng bạn học được ngoài nhà trường',
    phrases: [
      { en: 'I suppose the obvious one would be…', vi: 'Tôi nghĩ cái rõ nhất chắc là…' },
      { en: 'I picked it up more or less by accident.', vi: 'Tôi học được nó gần như tình cờ.' },
      { en: 'What made it difficult at first was…', vi: 'Thứ khiến nó khó lúc đầu là…' },
      { en: 'Looking back, the turning point was…', vi: 'Nhìn lại, bước ngoặt là…' },
      { en: 'It has been useful in ways I did not expect.', vi: 'Nó hữu ích theo những cách tôi không ngờ.' },
    ],
    questions: [
      {
        q: 'Describe a skill you learned outside school. You should say: what the skill is; how and when you learned it; how difficult it was to learn; and explain how it has been useful to you.',
        qVi: 'Mô tả một kỹ năng bạn học được ngoài nhà trường. Nói rõ: đó là kỹ năng gì; học khi nào và bằng cách nào; học có khó không; và giải thích nó đã hữu ích với bạn ra sao.',
        weak: 'I want to talk about cooking. I learned it from my mother when I was a child. It was quite difficult at first but now I can cook many dishes. It is useful because I can save money and eat healthy food. Thank you.',
        good: 'I suppose the obvious one would be cooking, though what I actually learned was something slightly different — how to cook without a recipe. I picked it up in my second year at university, mostly because I was living away from home for the first time and eating badly. My mother would talk me through a dish on the phone, and she never measured anything, so instead of quantities I ended up learning what a sauce should look like at each stage. What made it difficult at first was exactly that: I wanted numbers, and there were not any. I ruined a lot of food for about two months. Looking back, the turning point was the evening I realised I had made something reasonable out of whatever was left in the fridge, without planning it at all. Since then it has been useful in ways I did not expect. The money side is obvious, but the bigger thing is that cooking for people turns out to be the easiest way to keep a friendship going when everyone is busy. And I think it changed how I learn other things too, because I stopped expecting instructions for everything.',
        goodVi: 'Tôi nghĩ cái rõ nhất chắc là nấu ăn, dù thứ tôi thật sự học được hơi khác một chút — đó là nấu mà không cần công thức. Tôi học được nó vào năm hai đại học, chủ yếu vì lần đầu sống xa nhà và ăn uống rất tệ. Mẹ tôi hay chỉ tôi từng món qua điện thoại, mà bà chẳng bao giờ đong đếm gì, nên thay vì học định lượng thì tôi rốt cuộc học được một loại nước sốt trông phải ra sao ở từng giai đoạn. Thứ khiến nó khó lúc đầu chính là chỗ đó: tôi muốn có con số, mà lại chẳng có con số nào. Tôi làm hỏng khá nhiều đồ ăn trong khoảng hai tháng. Nhìn lại, bước ngoặt là buổi tối tôi nhận ra mình đã nấu được một món tạm ổn từ bất cứ thứ gì còn trong tủ lạnh, hoàn toàn không lên kế hoạch trước. Từ đó tới nay nó hữu ích theo những cách tôi không ngờ. Chuyện tiền bạc thì rõ rồi, nhưng điều lớn hơn là hoá ra nấu cho người khác ăn là cách dễ nhất để giữ một tình bạn khi ai cũng bận. Và tôi nghĩ nó còn đổi cả cách tôi học những thứ khác, vì tôi thôi trông chờ có hướng dẫn cho mọi việc.',
        why: 'Câu yếu trả lời đủ bốn gạch đầu dòng trong 45 giây rồi hết chuyện — đó là lý do thí sinh hay bị dừng sớm. Câu tốt làm bốn việc: (1) THU HẸP đề thành một thứ cụ thể hơn ("nấu mà không cần công thức") nên có cái để nói sâu; (2) mỗi gạch đầu dòng đều gắn với một chi tiết thật (điện thoại của mẹ, hai tháng làm hỏng đồ ăn) — chi tiết cụ thể là thứ giám khảo ghi nhận ở Lexical Resource; (3) có một bước ngoặt kể được thành câu chuyện; (4) phần "hữu ích ra sao" đi xa hơn câu trả lời hiển nhiên (tiền) sang một ý bất ngờ (giữ tình bạn, cách học nói chung). Chính vế cuối này kéo bài lên band 7.',
      },
      {
        q: 'Follow-up: Do you think it is better to learn practical skills from a person or from videos online?',
        qVi: 'Câu hỏi nối: học kỹ năng thực hành từ một người hay từ video trên mạng thì tốt hơn?',
        weak: 'I think from a person is better because they can correct you. Videos are also good because they are free and you can watch them many times.',
        good: 'They are good at different stages, I think. A video is better at the very beginning, because you can stop it, watch the same thirty seconds ten times, and nobody is waiting for you. But a video cannot see what you are doing wrong, and with most practical skills the mistake is something you cannot detect yourself — you are holding the knife at the wrong angle and it feels perfectly normal to you. That is when you need a person, even for ten minutes. So if I had to put it simply, I would say learn the steps from a video and get the habits corrected by someone who can watch you.',
        goodVi: 'Tôi nghĩ hai cách tốt ở hai giai đoạn khác nhau. Video tốt hơn ở lúc mới bắt đầu, vì bạn dừng được, xem đi xem lại đúng ba mươi giây đó mười lần, và chẳng ai phải chờ bạn cả. Nhưng video không nhìn thấy bạn đang làm sai chỗ nào, mà với phần lớn kỹ năng thực hành thì cái sai lại là thứ bạn không tự phát hiện được — bạn cầm dao sai góc mà cảm giác vẫn hoàn toàn bình thường. Đó là lúc cần một con người, dù chỉ mười phút. Nên nếu phải nói gọn, tôi sẽ bảo: học các bước từ video, còn thói quen thì nhờ người xem mình làm để sửa.',
        why: 'Kỹ thuật ở đây là TÁCH THEO GIAI ĐOẠN thay vì chọn một bên. Nó cho phép trả lời cả hai vế mà không mâu thuẫn, và ví dụ "cầm dao sai góc mà vẫn thấy bình thường" là loại chi tiết cụ thể khiến câu trả lời nghe như trải nghiệm thật chứ không phải ý kiến chung chung.',
      },
    ],
  },
  {
    id: 's3sp3',
    part: 'Part 3',
    title: 'Travel, time and distance',
    titleVi: 'Đi lại, thời gian và khoảng cách',
    phrases: [
      { en: 'It is easy to forget that…', vi: 'Người ta dễ quên rằng…' },
      { en: 'I would question the assumption that…', vi: 'Tôi nghi ngờ giả định rằng…' },
      { en: 'The cost is real, but it is not the one people usually mention.', vi: 'Cái giá phải trả là có thật, nhưng không phải cái mà người ta hay nhắc.' },
      { en: 'In my parents generation, …', vi: 'Ở thế hệ cha mẹ tôi,…' },
      { en: 'That is changing, though slowly.', vi: 'Điều đó đang thay đổi, dù chậm.' },
    ],
    questions: [
      {
        q: 'Why do people seem to value speed so much when they travel?',
        qVi: 'Vì sao người ta có vẻ coi trọng tốc độ đến thế khi đi lại?',
        weak: 'Because people are very busy nowadays. They do not have much time, so they want to arrive quickly and save time for their work and family.',
        good: 'The obvious answer is that people are busy, but I would question that slightly, because we do not actually use the time we save for anything in particular. I think it is more that speed has become the way we measure whether a journey is good. A trip is described as three hours, not as pleasant or unpleasant, so anything that shortens it looks like an improvement by definition. It is easy to forget that a slower journey can be time you actually use — you can read, or sleep, or talk to somebody — whereas the fast version is often two hours of queuing and security checks that you cannot use for anything at all.',
        goodVi: 'Câu trả lời hiển nhiên là người ta bận, nhưng tôi hơi nghi ngờ điều đó, vì thật ra ta chẳng dùng phần thời gian tiết kiệm được vào việc gì cụ thể cả. Tôi nghĩ đúng hơn là tốc độ đã trở thành thước đo xem một chuyến đi có tốt hay không. Người ta mô tả một chuyến đi là "ba tiếng", chứ không phải "dễ chịu" hay "khó chịu", nên bất cứ thứ gì rút ngắn nó thì mặc nhiên trông như một cải thiện. Người ta dễ quên rằng một chuyến đi chậm có thể là khoảng thời gian bạn thật sự dùng được — đọc sách, ngủ, hay trò chuyện với ai đó — trong khi bản đi nhanh thường là hai tiếng xếp hàng và kiểm tra an ninh mà bạn chẳng dùng được vào việc gì.',
        why: 'Bài mẫu bắt đầu bằng cách CÔNG NHẬN câu trả lời hiển nhiên rồi phản biện nó ("but I would question that slightly"). Đây là cách nhanh nhất để thoát khỏi câu trả lời ai cũng nói. Ý "ta đo chuyến đi bằng số giờ nên rút ngắn mặc nhiên là tốt" là một quan sát ở tầng khái niệm — đúng thứ Part 3 chấm.',
      },
      {
        q: 'Do you think governments should invest in railways rather than airports?',
        qVi: 'Bạn có nghĩ chính phủ nên đầu tư cho đường sắt thay vì sân bay không?',
        weak: 'Yes, I think trains are better because they are more environmentally friendly than planes and they are more comfortable.',
        good: 'For some distances, clearly yes — up to about a thousand kilometres a train competes on time once you count getting to the airport and waiting there, and it emits far less. Beyond that range the comparison stops working, and pretending otherwise weakens the argument. So I would put it as a question of matching the mode to the distance rather than choosing a side. The part that is usually left out is the timescale: a railway takes fifteen years to build and lasts a century, whereas a government is thinking about the next election, which is probably the real reason airports keep winning.',
        goodVi: 'Với một số cự ly thì rõ ràng là nên — tới khoảng một nghìn ki-lô-mét, tàu cạnh tranh được về thời gian một khi bạn tính cả việc ra sân bay và chờ ở đó, mà phát thải lại ít hơn nhiều. Vượt quá dải đó thì phép so sánh không còn đứng vững, và vờ như nó vẫn đúng chỉ làm lập luận yếu đi. Nên tôi sẽ đặt vấn đề thành chuyện KHỚP phương tiện với cự ly chứ không phải chọn phe. Phần thường bị bỏ quên là thang thời gian: một tuyến đường sắt mất mười lăm năm để xây và dùng được cả trăm năm, trong khi một chính phủ thì đang nghĩ tới kỳ bầu cử tới — và đó có lẽ mới là lý do thật khiến sân bay cứ thắng.',
        why: 'Ba dấu hiệu band 6.5–7: (1) trả lời CÓ ĐIỀU KIỆN theo cự ly thay vì gật hoặc lắc; (2) tự nêu giới hạn lập luận của chính mình ("beyond that range the comparison stops working") — giám khảo đọc đó là dấu hiệu tư duy chín; (3) chỉ ra một yếu tố người khác hay bỏ quên (thang thời gian chính trị). Câu này cũng lấy lại ý từ bài đọc "The Return of the Night Train" — học đọc và học nói nên dùng chung một kho ý.',
      },
    ],
  },
];
