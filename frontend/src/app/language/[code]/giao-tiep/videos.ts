/**
 * 🎬 Video YouTube của khoá Tiếng Anh giao tiếp — khoá = id bài (`gtdN-…`), hiện đầu bài (VideoBai.tsx).
 * Cách chọn + kiểm: `docs/video-youtube-tieng-anh.md` (`node scripts/yt-check.mjs <id…>`).
 * Bài homework/review không gắn; bài không có video khớp thì để trống (không gắn video chung chung).
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI_GT: Record<string, LessonVideo[]> = {
  'gtd1-nghe': [
    {"id":"I_tRSrPru94","credit":"BBC Learning English — How to introduce yourself: Easy English Conversations 💬 Episode 1","dur":"2:38","lang":"en","note":"Hội thoại BBC rất ngắn: hai người gặp lần đầu, chào và giới thiệu tên; nghe một lượt không phụ đề, lượt hai bật phụ đề và nhại theo từng câu."},
    {"id":"31y2Bq1RYQA","credit":"BBC Learning English — Saying where you're from: Easy English Conversations 💬 Episode 2","dur":"5:03","lang":"en","note":"Tập 2 cùng loạt: hỏi và trả lời \"Where are you from?\" theo nhiều cách; dừng sau mỗi câu hỏi để tự trả lời về quê mình trước khi nghe người trong video."},
  ],
  'gtd1-noi': [
    {"id":"1AmS9h8g3E4","credit":"BBC Learning English — Introduce yourself and make some friends - 04 - English at Work","dur":"4:02","lang":"en","note":"Cảnh ngày đầu ở công ty (English at Work): tự giới thiệu, giới thiệu người khác, bắt chuyện; chú ý đoạn tổng kết cụm câu cuối video rồi tự nói lại bản 30 giây của mình."},
    {"id":"_qA0rQCV1kM","credit":"Rachel's English — How to Respond to “How are you?”","dur":"14:58","lang":"en","note":"Rachel's English: người bản xứ trả lời \"How are you?\" thật ra thế nào (Good, you? / Not bad…) và nhịp nói tự nhiên; nhại theo các câu trả lời ngắn, nhớ luôn hỏi lại."},
  ],
  'gtd2-nghe': [
    {"id":"_HIGukY0mKg","credit":"Learn English with Gill · engVid — Polite English: How to ask people to repeat themselves","dur":"11:50","lang":"en","note":"engVid: các câu xin nhắc lại lịch sự (Sorry, could you repeat that? / I didn't catch…) và câu nên tránh; ghi các câu vào sổ, đánh dấu câu dùng với sếp và với bạn."},
    {"id":"rrjWWZud-B8","credit":"Crown Academy of English — English listening and spelling quiz - People's names","dur":"5:45","lang":"en","note":"Bài nghe đánh vần tên người: nghe và viết tên ra giấy, dừng video trước khi đáp án hiện để tự kiểm tra."},
  ],
  'gtd2-noi': [
    {"id":"iBvEVGjDqQw","credit":"Woodward English — How to say an email address in English | ESOL Vocabulary lesson | Speak English","dur":"11:18","lang":"en","note":"Cách đọc địa chỉ email (at, dot, underscore, hyphen…) và đánh vần; dừng ở mỗi ví dụ, đọc to địa chỉ trước khi giáo viên đọc."},
    {"id":"tAR4AJgJIrs","credit":"BBC Learning English — Checking information - 09 - English at Work checks that things are correct","dur":"4:16","lang":"en","note":"English at Work: cảnh kiểm tra lại thông tin cho đúng (So that's…, Can I just check…); tập đọc lại số điện thoại, giờ hẹn theo các mẫu câu xác nhận trong video."},
  ],
  'gtd3-nghe': [
    {"id":"sMg4vj6ugSs","credit":"BBC Learning English — Describing the weather where you are: Easy English Conversations 💬 Episode 8","dur":"3:19","lang":"en","note":"Hội thoại dễ về thời tiết nơi mình sống; nghe ra các tính từ (sunny, humid, chilly…) và cách hỏi lại \"What's the weather like where you are?\"."},
    {"id":"lrTRNbC3BDQ","credit":"BBC Learning English — Talking about weekend plans 🏊‍♀️🚴💃 Real Easy English","dur":"4:44","lang":"en","note":"Người thật kể kế hoạch cuối tuần (Real Easy English); nghe xem mỗi người làm gì, bật phụ đề lượt hai và ghi các câu \"I'm going to… / I might…\"."},
  ],
  'gtd3-noi': [
    {"id":"blUuMcKuzQE","credit":"mmmEnglish — SMALL TALK | How to keep a conversation going in English","dur":"13:05","lang":"en","note":"mmmEnglish: kỹ thuật giữ câu chuyện — hỏi tiếp, kể thêm chi tiết, phản hồi; khớp công thức \"phản hồi + trả lời + kể thêm + hỏi lại\" của bài, làm theo các lượt luyện trong video."},
    {"id":"BB7PJl3souA","credit":"British Council | English — How to keep a conversation going in English","dur":"4:29","lang":"en","note":"British Council: cảnh nói chuyện phiếm ngắn và mẹo giữ chuyện không bị đứt; xem rồi tự đóng vai với một chủ đề sở thích."},
  ],
  'gtd4-nghe': [
    {"id":"bgfdqVmVjfk","credit":"Easy English — At the Restaurant Conversation","dur":"4:49","lang":"en","note":"Hội thoại gọi món ở nhà hàng từ lúc vào bàn tới lúc trả tiền; nghe một lượt nắm diễn biến, lượt hai ghi các câu của phục vụ (Are you ready to order? / Anything else?)."},
    {"id":"2VeQTuSSiI0","credit":"English Panda — English Conversation at a Café (Coffee Shop) | Useful Phrases","dur":"4:08","lang":"en","note":"Cảnh ở quán cà phê với cụm câu hay dùng; chú ý đoạn hỏi cỡ ly, ăn tại chỗ hay mang đi, tính tiền."},
  ],
  'gtd4-noi': [
    {"id":"uUMPULuwdLI","credit":"Learn English with Bob the Canadian — How to Order Food at a Restaurant in English","dur":"7:32","lang":"en","note":"Bob the Canadian gọi món thật trong nhà hàng và giải thích từng câu (I'll have… / Could I get… / Can we get the bill?); dừng video, nói câu gọi món của mình trước khi Bob nói."},
    {"id":"3R3uTv1xJT0","credit":"BBC Learning English — How to complain politely - English In A Minute","dur":"1:03","lang":"en","note":"BBC \"English In A Minute\": phàn nàn nhẹ mà lịch sự (I'm afraid… / I'm sorry, but…); xem hai lần rồi tự phàn nàn món nguội, món sai."},
  ],
  'gtd5-nghe': [
    {"id":"2mnL9jPVzsk","credit":"BBC Learning English — Talking about clothes shopping: Easy English Conversations Episode 19","dur":"7:41","lang":"en","note":"Hội thoại BBC khi mua quần áo: hỏi cỡ, thử đồ, hỏi giá; nghe không phụ đề trước rồi kiểm tra lại."},
    {"id":"9nVKK0OlMR4","credit":"BBC Learning English — Learning Circles - Market: English vocabulary to use when buying and returning things","dur":"2:25","lang":"en","note":"BBC Learning Circles: từ và câu khi mua và đổi trả hàng (receipt, refund, exchange); ghi các câu đổi trả vào sổ."},
  ],
  'gtd5-noi': [
    {"id":"b7WcAmzNZ88","credit":"Easy English — Everyday CONVERSATIONS and VOCABULARY for Shopping | Easy English 227","dur":"8:25","lang":"en","note":"Easy English quay người thật ở cửa hàng: hỏi giá, hỏi giảm giá, trả tiền; nhại theo các câu ngắn của người bán và người mua."},
    {"id":"rvjkuEuEOmw","credit":"English with Morgan — Shopping in English: Asking about Prices (Basic ESL)","dur":"2:50","lang":"en","note":"Mẫu hỏi giá cơ bản (How much is…? / Is it on sale?); dùng làm khởi động trước khi tập mặc cả và đổi trả trong bài."},
  ],
  'gtd6-nghe': [
    {"id":"SHXPpsIJTb0","credit":"BBC Learning English — Asking for and giving directions: Easy English Conversations 💬 Episode 5","dur":"3:58","lang":"en","note":"Hội thoại BBC hỏi và chỉ đường; vẽ đường đi ra giấy theo lời chỉ, rồi xem lại có đúng không."},
    {"id":"juPlEnOKl48","credit":"Sunshine English — At the airport English conversation | Travel English |  Learn English  |  Sunshine English","dur":"5:57","lang":"en","note":"Cảnh ở sân bay: check-in, hành lý, cửa ra máy bay; nghe ra các câu nhân viên hỏi (Window or aisle? / Any bags to check?)."},
  ],
  'gtd6-noi': [
    {"id":"DPYJQSA-x50","credit":"Easy English — Asking for and Giving Directions","dur":"6:42","lang":"en","note":"Easy English hỏi đường người thật trên phố — nói nhanh, không diễn; nghe họ chỉ đường bằng go straight, turn left, it's on your right… rồi tự chỉ đường quanh nhà mình."},
    {"id":"7W2eUcFMCU4","credit":"Speak English With Vanessa — How to Give Directions in English: Advanced English Lesson","dur":"13:50","lang":"en","note":"Speak English With Vanessa: cụm chỉ đường tự nhiên hơn sách (a couple of blocks, you can't miss it…); xem để nâng cấp câu chỉ đường của mình."},
  ],
  'gtd6-viet': [
    {"id":"61tey0auDIk","credit":"English by Giovana — Useful phrases when taking a taxi/Uber","dur":"8:12","lang":"en","note":"Cụm câu khi đi taxi/Uber (I'm at…, Could you drop me off at…, Can you wait a minute?); chính những câu này dùng để nhắn tài xế Grab — chép 5 câu vào mẫu tin nhắn của bài."},
  ],
  'gtd7-nghe': [
    {"id":"Cj9DKRWp-ek","credit":"EverydayEnglish — At the Doctors 🏥 English Conversation Practice","dur":"7:01","lang":"en","note":"Hội thoại ở phòng khám: mô tả triệu chứng, bác sĩ hỏi bệnh và dặn dò; nghe một lượt rồi ghi các triệu chứng nghe được."},
    {"id":"ma8Yd25t1fE","credit":"EverydayEnglish — English Conversation at the Pharmacy 🧑🏻‍⚕️","dur":"4:37","lang":"en","note":"Hội thoại ở hiệu thuốc: hỏi thuốc, dược sĩ hỏi dị ứng và dặn liều dùng; chú ý câu \"take two tablets twice a day\"."},
  ],
  'gtd7-noi': [
    {"id":"RaB5Bydz8rE","credit":"Oxford Online English — How to Talk About Illness and Medicine in English","dur":"16:17","lang":"en","note":"Oxford Online English: nói về ốm đau và thuốc ở nhiều mức (I've got a sore throat / I've been feeling…); dừng sau mỗi đoạn hội thoại mẫu để tự nói về lần ốm gần nhất."},
    {"id":"kK99NlPe0-0","credit":"EverydayEnglish — Making a Doctor's Appointment  | English Conversation","dur":"5:04","lang":"en","note":"Hội thoại đặt lịch khám qua điện thoại; nhập vai người gọi, nói trước câu của bệnh nhân rồi nghe video."},
  ],
  'gtd8-nghe': [
    {"id":"0TBsMgwQaE8","credit":"Easy English — Renting an apartment","dur":"8:01","lang":"en","note":"Easy English đi xem nhà thuê thật: hỏi giá thuê, tiền cọc, điện nước; nghe giọng tự nhiên, bật phụ đề lượt hai."},
    {"id":"vKTCzjgkzrQ","credit":"Oxford Online English — Renting a House or Apartment in English - Vocabulary and Conversation","dur":"12:50","lang":"en","note":"Oxford Online English: từ vựng và hội thoại thuê nhà (deposit, lease, landlord, bills included); khớp phần hợp đồng và báo hỏng của bài."},
  ],
  'gtd8-noi': [
    {"id":"mBIjFC_4me0","credit":"ChannelCIES — Calling About a Problem with Your Apartment","dur":"2:09","lang":"en","note":"Cảnh gọi chủ nhà báo hỏng đồ trong căn hộ; nghe cách mô tả sự cố và hỏi khi nào sửa, rồi tự gọi báo hỏng vòi nước."},
    {"id":"Te-UyphkKRk","credit":"BBC Learning English — Describing your home: Easy English Conversations Episode 20","dur":"6:25","lang":"en","note":"Hội thoại BBC mô tả nhà mình; dùng để tập nói chuyện với hàng xóm, người mới quen về chỗ ở."},
  ],
  'gtd8-viet': [
    {"id":"7LYhNAqTehU","credit":"EnglishMania — How to write a formal email (asking for information)","dur":"2:16","lang":"en","note":"Mẫu email trang trọng xin thông tin: mở đầu, nêu câu hỏi, kết thư; áp đúng khung này cho email hỏi thuê phòng trong bài."},
  ],
  'gtd9-nghe': [
    {"id":"Qo6VHK5n_LU","credit":"BBC Learning English — Taking telephone messages - 53 - English at Work helps you note it down","dur":"4:57","lang":"en","note":"English at Work: nhận lời nhắn qua điện thoại và ghi lại; nghe và tự ghi lời nhắn ra giấy như nhân vật."},
    {"id":"W7ukm-PhQJY","credit":"LINC Videos - English in Vancouver — Leaving a Message - Lesson 09 - English in Vancouver","dur":"2:49","lang":"en","note":"Cảnh để lại lời nhắn khi người cần gặp vắng mặt; nghe ra tên, số điện thoại, lý do gọi."},
  ],
  'gtd9-noi': [
    {"id":"9h4tbY4pnrI","credit":"Rachel's English — English Phone Conversation: How to Start and End","dur":"13:32","lang":"en","note":"Rachel's English: mở đầu và kết thúc cuộc gọi tự nhiên (Hi, this is… / I'll let you go…); nhại theo đoạn hội thoại thật."},
    {"id":"CKBIobXLrrc","credit":"mmmEnglish — Telephone Conversations: 45 Essential Phrases To Speak On The Phone in English","dur":"8:54","lang":"en","note":"mmmEnglish: 45 cụm điện thoại — xin gặp ai, chuyển máy, nhờ nhắn lại, kết thúc cuộc gọi; đánh dấu các cụm chuyển máy và để lại lời nhắn."},
  ],
  'gtd10-nghe': [
    {"id":"kKH33PAfLYU","credit":"BBC Learning English — How to... make polite invitations","dur":"5:56","lang":"en","note":"BBC \"How to…\": mời lịch sự và nhận lời; nghe các mẫu Would you like to… / I'd love to."},
    {"id":"D58LCh_1jmM","credit":"BBC Learning English — How to... say ‘no’ to invitations","dur":"6:01","lang":"en","note":"BBC \"How to…\": từ chối lời mời mà không mất lòng (I'd love to, but… / Maybe another time?)."},
  ],
  'gtd10-noi': [
    {"id":"Qf7B6jI1UoI","credit":"English with Emma · engVid — 7 Ways to Say “NO” Politely in English","dur":"12:06","lang":"en","note":"engVid: 7 cách nói \"không\" lịch sự — cảm ơn, lý do ngắn, đề nghị thay thế; tập từ chối ba lời mời trong bài theo đúng công thức đó."},
  ],
  'gtd10-viet': [
    {"id":"53zY45UH8Ew","credit":"Mad English TV — How to Reschedule an Appointment in English","dur":"9:38","lang":"en","note":"Câu dời lịch hẹn (Would it be possible to reschedule… / Does … work for you?); chép các câu này vào tin nhắn đổi lịch của bài."},
  ],
  'gtd11-nghe': [
    {"id":"kTf0V4HyFtM","credit":"BBC Learning English — Talk about what you did last weekend: Easy English Conversations 💬 Episode 13","dur":"4:53","lang":"en","note":"Hội thoại BBC kể cuối tuần đã làm gì (quá khứ đơn); nghe xem người nghe phản ứng thế nào (Really? / That sounds fun!)."},
    {"id":"NH2GfNTfqsE","credit":"Learn English with Bob the Canadian — How to Tell a Story in English","dur":"8:00","lang":"en","note":"Bob the Canadian chỉ cách kể một câu chuyện theo trình tự cho người nghe dễ theo; chú ý từ nối thời gian."},
  ],
  'gtd11-noi': [
    {"id":"m04lQ5BUAn0","credit":"Oxford Online English — How to Tell a Story in English - Using Past Tense","dur":"17:44","lang":"en","note":"Oxford Online English: kể chuyện bằng các thì quá khứ, mở đầu – diễn biến – kết; làm theo các bước rồi tự kể một chuyện 1 phút."},
    {"id":"sFrHK7cHzkA","credit":"English with Emma · engVid — How to use sequencers in English: FIRST, THEN, NEXT, AFTER THAT, FINALLY","dur":"8:31","lang":"en","note":"engVid: từ nối trình tự first, then, after that, finally; tập chèn đúng các từ này khi kể."},
  ],
  'gtd11-doc': [
    {"id":"bro4oV83lzM","credit":"BBC Learning English — Abdu in the traffic jam - The Storytellers","dur":"7:48","lang":"en","note":"BBC The Storytellers: một chuyện đời thường kể chậm có hình (kẹt xe); xem kèm phụ đề như đọc truyện ngắn, ghi các động từ quá khứ."},
  ],
  'gtd12-nghe': [
    {"id":"qR34I4S9qUA","credit":"BBC Learning English — Saying you're sorry - 07 - English at Work shows you how to apologise","dur":"4:18","lang":"en","note":"English at Work: xin lỗi ở chỗ làm ở nhiều mức; nghe xem lời xin lỗi nào nhẹ, nào nặng."},
    {"id":"HN5akpqjm9Q","credit":"BBC Learning English — Saying 'well done!' - 08 - English at Work tells you how to give praise","dur":"4:25","lang":"en","note":"English at Work: khen và chúc mừng đồng nghiệp (Well done! / Congratulations on…); nghe cách người được khen đáp lại."},
  ],
  'gtd12-noi': [
    {"id":"BIlbp2YK86o","credit":"mmmEnglish — DON'T SAY \"SORRY!\" | Better English vocabulary | How to Apologise","dur":"8:25","lang":"en","note":"mmmEnglish: thay \"sorry\" bằng câu xin lỗi đúng mức; tập nói lại từng câu theo từng mức nghiêm trọng."},
    {"id":"ajycErxpR_I","credit":"Oxford Online English — How to Compliment Someone in English - Spoken English Lesson","dur":"9:12","lang":"en","note":"Oxford Online English: khen ngợi tự nhiên và cách đáp lại lời khen; dừng ở mỗi tình huống để tự khen trước."},
  ],
  'gtd12-viet': [
    {"id":"0KUQ1I_jl4U","credit":"LearningEnglishPRO — How to Write a Thank You Note  English | Simple Thank You | Email | English Writing | Job Interview","dur":"5:20","lang":"en","note":"Cách viết lời cảm ơn ngắn (mở đầu, nói cảm ơn vì điều gì cụ thể, kết); áp khung này cho thiệp cảm ơn trong bài."},
  ],
  'gtd13-nghe': [
    {"id":"5lb71OuQBtM","credit":"Learn English with Jessica — English Conversation First Day to Work | Speaking English at the office","dur":"8:28","lang":"en","note":"Hội thoại ngày đầu đi làm: chào hỏi, làm quen cả nhóm, được dẫn đi xem văn phòng; nghe một lượt, lượt hai nhại lời nhân viên mới."},
    {"id":"nM7FoW9MUys","credit":"English Together — First Day at Work English Conversation Workplace English for Greeting Colleagues & Lunch Invitations","dur":"5:03","lang":"en","note":"Cảnh ngày đầu đi làm: chào đồng nghiệp và nhận lời rủ ăn trưa; ghi các câu đồng nghiệp hỏi người mới."},
  ],
  'gtd13-noi': [
    {"id":"NYEf_b_0H7Y","credit":"Adriana Girdler — How to Introduce Yourself to a New Team (CONFIDENTLY AND EFFECTIVELY)","dur":"3:35","lang":"en","note":"Cách tự giới thiệu với nhóm mới ngắn gọn, tự tin (tên, vai trò, mong muốn); viết bản 4–5 câu của mình rồi nói lại."},
  ],
  'gtd14-nghe': [
    {"id":"O6h8qq5rBi0","credit":"BBC Learning English — Talking about the office 💻👨‍💼🖇 Real Easy English","dur":"5:18","lang":"en","note":"Real Easy English: người thật nói về văn phòng, giờ nghỉ, đồng nghiệp; nghe ra các câu small talk ở chỗ làm."},
    {"id":"4zXys7i8Zrc","credit":"Learn English with Bob the Canadian — Learn English Small Talk to use at Work and with Friends, Family and Strangers","dur":"8:52","lang":"en","note":"Bob the Canadian: câu small talk dùng ở chỗ làm (How was your weekend? / Busy day?) và cách đáp; nhại theo."},
  ],
  'gtd14-noi': [
    {"id":"aSZ_eLxuLAs","credit":"Extra English Practice — Appropriate Topics for Small Talk -- Conversation Skills","dur":"6:26","lang":"en","note":"Chủ đề nên và không nên nói khi nói chuyện phiếm; đối chiếu với danh sách \"chủ đề an toàn / nên tránh\" của bài."},
    {"id":"t4wDLC_m4lg","credit":"BBC Learning English — Subjects to avoid in British small talk: Politics","dur":"2:20","lang":"en","note":"BBC: vì sao chính trị là chủ đề nên tránh khi small talk với người Anh và cách lái sang chuyện khác."},
  ],
  'gtd15-nghe': [
    {"id":"NzYxS_Xy0oM","credit":"BBC Learning English — How to offer help - 06 - English at Work is here to help","dur":"3:46","lang":"en","note":"English at Work: đề nghị giúp đồng nghiệp (Can I give you a hand? / Would you like me to…?)."},
    {"id":"AG2kYShBZl0","credit":"BBC Learning English — Asking for help – 21 – English at Work gets you the help you need","dur":"5:46","lang":"en","note":"English at Work: nhờ giúp ở chỗ làm và hỏi ý kiến; nghe xem câu nhờ nào lịch sự hơn."},
  ],
  'gtd15-noi': [
    {"id":"QWBwCoecvkM","credit":"BBC Learning English — Make polite requests - 05 - English at Work would like you to watch","dur":"4:02","lang":"en","note":"English at Work: yêu cầu lịch sự Could you…? / Would you mind…? / I was wondering if…; khớp bậc lịch sự của bài, tập đổi một câu nhờ qua ba mức."},
    {"id":"73liE9Vz_U4","credit":"Professor Korten | English Language Academy  — English Modal Verbs for Requests: CAN, COULD, WOULD | Polite Requests in English for Beginners","dur":"5:13","lang":"en","note":"Giải thích ngắn can / could / would trong câu nhờ và độ lịch sự của từng từ; xem như phần ngữ pháp đi kèm."},
  ],
  'gtd15-doc': [
    {"id":"cAS8DUDcFVs","credit":"Worldwide Speak — Email | How to ask for something POLITELY | 2021","dur":"7:25","lang":"en","note":"Cách nhờ việc lịch sự trong email/tin nhắn và câu nào đọc lên nghe cộc; dùng để đọc giọng điệu các tin nhắn trong bài."},
  ],
  'gtd16-nghe': [
    {"id":"-pPjMrDcfak","credit":"Caribou English — How to Call in Sick to Work – Professional & Polite English Phrases","dur":"2:31","lang":"en","note":"Cụm câu báo ốm với quản lý (I'm not feeling well… / I won't be able to come in today); nghe rồi nói theo."},
  ],
  'gtd16-viet': [
    {"id":"3Tu1jN65slw","credit":"English with Alex · engVid — How to write professional emails in English","dur":"18:30","lang":"en","note":"engVid: khung email công việc — lời chào, nêu lý do, đề nghị, câu kết; áp vào email xin nghỉ, báo trễ của bài (xem phần mở đầu và kết thư kỹ nhất)."},
  ],
  'gtd17-nghe': [
    {"id":"PLhAzAymMsY","credit":"Maria Sheeran — 40 English Phrases You Need for Online Meetings","dur":"5:15","lang":"en","note":"40 câu dùng trong cuộc họp online: kết nối, mic, chia sẻ màn hình, xin nói; nghe và đánh dấu các câu đã gặp trong bài."},
  ],
  'gtd17-noi': [
    {"id":"XoculEcyQdo","credit":"BBC Learning English — Language for video calls","dur":"2:07","lang":"en","note":"BBC: câu cho cuộc gọi video (You're on mute / Can you see my screen? / You froze); tập nói từng câu theo."},
    {"id":"T7Y29rZVuTQ","credit":"Breathe English Education — What to Say in Online Meetings | English for Video Calls","dur":"9:26","lang":"en","note":"Nói gì trong cuộc họp online từ lúc vào tới lúc kết thúc, cả khi bị nói chồng lời; nhập vai lại các tình huống trong video."},
  ],
  'gtd18-nghe': [
    {"id":"AGYPb0eeIs8","credit":"VOA Learning English — Let's Learn English Lesson 37: Let's Agree to Disagree","dur":"5:01","lang":"en","note":"VOA Let's Learn English: hội thoại đồng ý và không đồng ý (\"Let's agree to disagree\"); nghe ra các câu nêu ý kiến."},
    {"id":"fQcga26aoL8","credit":"British Council | English — How to agree or disagree in English","dur":"4:23","lang":"en","note":"British Council: các mức đồng ý / không đồng ý trong trò chuyện; ghi câu nào mạnh, câu nào mềm."},
  ],
  'gtd18-noi': [
    {"id":"HakpWDCIXTw","credit":"Speak Confident English — How to Disagree in English Politely | English Conversation Skills","dur":"18:43","lang":"en","note":"Phản đối lịch sự trong hội thoại thật — làm mềm, nêu lý do, đưa ý khác; khớp 3 mức không đồng ý của bài, tập lại từng mẫu."},
    {"id":"MuOSDO4qtjg","credit":"Accent's Way English with Hadar — Use these phrases when you want to *politely* DISAGREE with someone","dur":"6:05","lang":"en","note":"Cụm câu phản đối khéo (I see your point, but… / I'm not sure I agree…) và ngữ điệu đi kèm; nhại theo ngữ điệu."},
  ],
  'gtd18-viet': [
    {"id":"eQkEBwRa_s8","credit":"Business English Benjamin · engVid — Polite English Conversation: How to take feedback","dur":"11:05","lang":"en","note":"engVid: đón nhận góp ý lịch sự (cảm ơn, hỏi rõ, nói sẽ sửa); các câu này dùng được khi trả lời góp ý trong nhóm chat."},
  ],
  'gtd19-nghe': [
    {"id":"Qk-69B86pEo","credit":"BBC Learning English — Networking - 48 - English at Work gets you the contacts","dur":"5:52","lang":"en","note":"English at Work: cảnh networking ở sự kiện — bắt chuyện, giới thiệu, xin liên lạc."},
    {"id":"NWxDh0rQZcQ","credit":"Speak Confident English — Networking in English | Easy, Effective Conversation Strategies","dur":"12:26","lang":"en","note":"Chiến lược trò chuyện khi networking bằng tiếng Anh (câu mở lời, câu hỏi tiếp, cách thoát ra); nghe các ví dụ hội thoại."},
  ],
  'gtd19-noi': [
    {"id":"itATuQDfReA","credit":"Speak English With Vanessa — How to START a Conversation in English with Anyone","dur":"11:45","lang":"en","note":"Speak English With Vanessa: mở lời với người lạ bằng câu tự nhiên; chọn 3 câu mở lời dùng cho meetup."},
    {"id":"Z-AOshRnJEY","credit":"Kara Ronin — HOW TO START A CONVERSATION AT A NETWORKING EVENT: Tips for Non-Awkward Conversations","dur":"7:03","lang":"en","note":"Mẹo bắt chuyện ở sự kiện networking mà không gượng; người bản xứ nói nhanh, bật phụ đề tiếng Anh."},
  ],
  'gtd20-nghe': [
    {"id":"wqLIIakNHbY","credit":"Eater — How Vietnam’s Banh Mi Sandwich Changes from the North to South — Regions","dur":"7:46","lang":"en","note":"Video tiếng Anh (Eater) giải thích bánh mì Việt Nam khác nhau Bắc – Nam; nghe cách họ mô tả món Việt bằng tiếng Anh để mượn câu khi đón khách."},
    {"id":"SdQBKXnaWGQ","credit":"Learn English with Bob the Canadian — How to Describe Food in English - Two English Teachers Try Food From Around the World. 🍪🦐🍅","dur":"15:30","lang":"en","note":"Hai giáo viên bản xứ thử món nhiều nước và tả vị; nghe các từ tả vị và cảm nhận tự nhiên."},
  ],
  'gtd20-noi': [
    {"id":"_4w_MGX_O84","credit":"Speak Confident English — Describe Food in English — Ultimate List of Taste & Texture Words","dur":"19:46","lang":"en","note":"Từ tả vị và kết cấu món ăn (savory, tangy, chewy, crispy…); dùng để giải thích phở, bún chả, bánh xèo cho khách."},
  ],
  'gtd21-nghe': [
    {"id":"v3Bcy9IVr_Y","credit":"English Speaking Course — At the Hotel Conversation - Making Complaint | English Speaking Practice","dur":"8:50","lang":"en","note":"Hội thoại khách phàn nàn ở khách sạn và lễ tân xử lý; nghe ra vấn đề, cách xin lỗi và cách giải quyết."},
    {"id":"X7nDkvYSbfs","credit":"BBC Learning English — Complaining – 26 – English at Work tells you how to complain","dur":"5:40","lang":"en","note":"English at Work: phàn nàn chắc mà lịch sự với nhà cung cấp; chú ý câu nêu vấn đề và câu yêu cầu giải pháp."},
  ],
  'gtd21-noi': [
    {"id":"j3NWmpbpw0Q","credit":"Speak Confident English — Make a Complaint Politely in English and Get What You Want","dur":"9:06","lang":"en","note":"Phàn nàn lịch sự mà vẫn đạt được điều mình muốn — nêu vấn đề, hậu quả, giải pháp mong muốn; khớp công thức phàn nàn của bài."},
    {"id":"3YcMtlTUN1k","credit":"Cloud English — Customer Service English Expressions for Handling Angry Customers","dur":"12:31","lang":"en","note":"Phía bị phàn nàn: câu xử lý khách đang bực (I completely understand… / Let me look into that…); tập vai nhân viên."},
  ],
  'gtd21-doc': [
    {"id":"ZAQvqQXCde4","credit":"Mónica Redondo Arias — How to Write a COMPELLING COMPLAINT LETTER in English!","dur":"9:37","lang":"en","note":"Cách viết thư/email khiếu nại: bố cục, giọng chắc mà lịch sự, yêu cầu cụ thể; dùng để đọc hiểu email khiếu nại trong bài."},
  ],
  'gtd22-nghe': [
    {"id":"-HZrTUNJKCs","credit":"BBC Learning English — Negotiating - 30 - English at Work negotiates the best deal","dur":"4:37","lang":"en","note":"English at Work: thương lượng — đưa đề nghị, mặc cả, nhượng bộ; ghi lại các câu đề nghị và nhượng bộ."},
    {"id":"o9KEaQCWqDg","credit":"BBC Learning English — Negotiating a deal - 32 - English at Work helps you get the best deal","dur":"5:44","lang":"en","note":"English at Work: chốt một thoả thuận có lợi cho cả hai; nghe cách nhượng bộ và chốt."},
  ],
  'gtd22-noi': [
    {"id":"zM6j8XU7P0I","credit":"English with Emma · engVid — EASY ENGLISH CONVERSATION: “Let’s...”, “How about...”, “Why don’t we...?”","dur":"13:05","lang":"en","note":"engVid: đưa đề xuất Let's… / How about…? / Why don't we…? và cách đáp; tập đề xuất kế hoạch đi chơi cho nhóm."},
    {"id":"7wT7BzAoyj0","credit":"Oxford Online English — Making Suggestions in English - Spoken English Lesson","dur":"10:16","lang":"en","note":"Oxford Online English: đề xuất, phản hồi đề xuất và đi tới thống nhất qua hội thoại mẫu; dừng để tự đề xuất trước."},
  ],
  'gtd23-nghe': [
    {"id":"M03vuos_nLI","credit":"BBC Learning English — Talking about the news: 📰📱 Real Easy English","dur":"5:57","lang":"en","note":"Real Easy English: người thật nói họ theo dõi tin tức thế nào và kể lại tin; nghe các câu \"I read that… / Apparently…\"."},
    {"id":"sFcWuQzA3DQ","credit":"British Council | English — How to respond to news in English","dur":"4:29","lang":"en","note":"British Council: phản ứng khi nghe tin (Really? / That's terrible! / No way!); nhại theo ngữ điệu."},
  ],
  'gtd23-noi': [
    {"id":"b3vESZio_9A","credit":"English Speaking 360 — Sound More POLITE and PROFESSIONAL in English | Hedging Language Explained Clearly with examples","dur":"12:19","lang":"en","note":"Ngôn ngữ nói chắc vừa phải (I think, it seems, apparently, I might be wrong but…); khớp trọng tâm bài, tập làm mềm 5 câu khẳng định."},
  ],
  'gtd23-doc': [
    {"id":"2lKHdlc5RPQ","credit":"English with Jennifer — How to Read News Headlines and Improve Your English 📰 Learn with JenniferESL","dur":"9:16","lang":"en","note":"Cách đọc tiêu đề báo tiếng Anh (bỏ mạo từ, thì hiện tại cho chuyện đã xảy ra, to + V cho tương lai); khớp phần \"cách đọc tiêu đề\" của bài."},
  ],
  'gtd24-nghe': [
    {"id":"owzPL9jaSU8","credit":"English with Lucy — What English people SAY vs What English people MEAN! | Passive Aggressive Business English!","dur":"9:13","lang":"en","note":"English with Lucy: người Anh nói vậy nhưng nghĩa thật là gì (nói vòng, lịch sự kiểu Anh); nghe và đoán nghĩa trước khi Lucy giải thích."},
    {"id":"yhMg0rkkvog","credit":"Kara Ronin — Direct vs Indirect Communication. Dealing with Different Communication Types in Workplace","dur":"10:56","lang":"en","note":"Kiểu giao tiếp nói thẳng và nói vòng ở chỗ làm, hiểu lầm giữa hai kiểu; đối chiếu với cách nói của người Việt."},
  ],
  'gtd24-noi': [
    {"id":"qv2F7DIHnEs","credit":"Espresso English — Say This - English Phrases For Embarrassing Moments","dur":"4:27","lang":"en","note":"Câu dùng khi lỡ lời hay gặp tình huống ngượng; học thuộc 3 câu chữa ngượng hay nhất."},
    {"id":"2zgWC3w6DOI","credit":"English with Benen — How to change the topic in English conversation","dur":"4:25","lang":"en","note":"Cách đổi chủ đề khéo (By the way… / Speaking of…, / Anyway…); tập đổi chủ đề khỏi một câu hỏi tế nhị."},
  ],
  'gtd25-nghe': [
    {"id":"HzvsfOE2Vx8","credit":"English with Lucy — YES, you can understand fast spoken English","dur":"14:51","lang":"en","note":"English with Lucy: vì sao người bản xứ nói nhanh khó nghe (nối âm, nuốt âm, rút gọn) và cách luyện; làm các bài nghe trong video."},
    {"id":"jBUSWWM0JO4","credit":"Rachel's English — REAL English Conversation | FAST English!","dur":"10:15","lang":"en","note":"Rachel's English: phân tích một đoạn hội thoại thật tốc độ tự nhiên — nghe trước, rồi xem Rachel chỉ từng chỗ nối âm, gonna/wanna."},
  ],
  'gtd25-noi': [
    {"id":"ZZTV0Gwyo_Q","credit":"English with Lucy — The 4 Secrets to Speaking Quickly & Fluently - CONNECTED SPEECH","dur":"8:36","lang":"en","note":"English with Lucy: 4 bí quyết nói nhanh và trôi (nối âm, nuốt âm, âm yếu); nhại theo từng ví dụ."},
    {"id":"-stGMAQTibc","credit":"Rachel's English — How to Pronounce 'gonna' and 'gotta':  Reduction and Linking in American English","dur":"13:09","lang":"en","note":"Rachel's English: phát âm gonna, gotta và nối âm kiểu Mỹ; nhại theo từng câu luyện."},
  ],
  'gtd25-doc': [
    {"id":"sOV0ztexBA0","credit":"BBC Learning English — What does 'lowkey' mean? The English We Speak","dur":"3:55","lang":"en","note":"The English We Speak (BBC): một từ lóng giới trẻ (\"lowkey\") trong hội thoại ngắn; xem cách hiểu tiếng lóng qua ngữ cảnh."},
    {"id":"HclqADvf35Y","credit":"linguamarina — Learn 15 Common English Idioms (With Examples)","dur":"8:03","lang":"en","note":"15 thành ngữ hay gặp kèm ví dụ trong câu; đoán nghĩa từ ví dụ trước khi nghe giải thích."},
  ],
  'gtd26-nghe': [
    {"id":"ce8u2OFrrXM","credit":"Learn English with Rebecca · engVid — Conversation Skills - How to END a conversation politely","dur":"3:18","lang":"en","note":"engVid: kết thúc cuộc trò chuyện lịch sự (It's been great talking to you… / I'll let you go); nghe và chép các câu kết."},
    {"id":"Wwv4IgL0aJY","credit":"mmmEnglish — Common English Phrases to Keep Your Conversation Going!","dur":"14:01","lang":"en","note":"mmmEnglish: cụm câu giữ mạch và quay lại ý trong cuộc trò chuyện dài; nghe các đoạn mẫu và đánh dấu cụm mới."},
  ],
  'gtd26-noi': [
    {"id":"aJvx6azxjYs","credit":"JForrest English — 50+ Transition Words For English Conversations","dur":"12:31","lang":"en","note":"JForrest: từ chuyển ý trong hội thoại (Speaking of…, Anyway…, Going back to…); dùng ngay khi tập nói 3 phút."},
    {"id":"DrLfR2lzEkg","credit":"Speak Confident English — Use Linking Words for Smooth Transitions When Speaking English","dur":"16:57","lang":"en","note":"Từ nối để chuyển ý mượt khi nói; chọn 5 từ nối và cài vào bài nói 3 phút của mình."},
  ],
  'gtd26-viet': [
    {"id":"llqPvcciKEM","credit":"English with Alex · engVid — How to write informal emails in English","dur":"15:46","lang":"en","note":"engVid: viết email thân mật cho bạn — mở đầu, kể chuyện, hỏi thăm, kết thư; áp vào email kể chuyện cho bạn nước ngoài."},
  ],
  'gtd27-nghe': [
    {"id":"vn_L4OPU_rg","credit":"Charisma on Command — The Art Of Funny Storytelling","dur":"11:59","lang":"en","note":"Phân tích vì sao một câu chuyện kể lại buồn cười (dựng tình huống, nhịp, cao trào); người bản xứ nói nhanh, bật phụ đề tiếng Anh."},
  ],
  'gtd27-noi': [
    {"id":"LNFw1XcRu_E","credit":"English with Lucy — British Humour Explained (with examples)","dur":"16:32","lang":"en","note":"English with Lucy: kiểu đùa của người Anh (mỉa nhẹ, tự giễu, nói giảm) và cách đáp lại; xem để hiểu khi nào người ta đang đùa."},
  ],
  'gtd28-nghe': [
    {"id":"rc-M4PtgYug","credit":"Oxford Online English — How to Answer 'Tell Me About Yourself' - Spoken English Lesson","dur":"12:32","lang":"en","note":"Oxford Online English: cách dựng câu trả lời \"Tell me about yourself\" kèm câu mẫu; dừng ở mỗi phần để tự nói phần của mình."},
    {"id":"HMQlA-TIAsk","credit":"Easy English — Tell Me About Yourself - Job Interview","dur":"8:08","lang":"en","note":"Easy English: nhiều người trả lời \"Tell me about yourself\" theo cách khác nhau; nghe để thấy câu nói tự nhiên ngoài sách."},
  ],
  'gtd28-noi': [
    {"id":"xLzy3-CQIls","credit":"English with Lucy — Tell Me About Yourself - An Excellent Answer to this Interview Question","dur":"8:46","lang":"en","note":"English with Lucy: dựng câu chuyện về bản thân thật gọn kèm câu mẫu; viết bản 2 phút của mình theo khung này rồi nói."},
    {"id":"JS9KpbF_804","credit":"Learn English with Bob the Canadian — How to Talk About Your Goals and Dreams in English","dur":"5:30","lang":"en","note":"Bob the Canadian: nói về mục tiêu và ước mơ (I'd like to… / I'm hoping to… / My goal is…); dùng cho phần mục tiêu nghề nghiệp."},
  ],
  'gtd28-viet': [
    {"id":"gSbV3q_MMbg","credit":"Jeff Su — Write a PERFECT Interview Thank You Email!","dur":"5:41","lang":"en","note":"Mẫu tin nhắn/email cảm ơn sau buổi gặp, buổi phỏng vấn: ngắn, nhắc lại một điểm cụ thể, kết lịch sự."},
  ],
  'gtd29-nghe': [
    {"id":"LAGLxkrsUxM","credit":"English with Emma · engVid — Conversation Skills: Interrupting politely in English","dur":"11:33","lang":"en","note":"engVid: ngắt lời lịch sự và giữ lượt nói (Sorry to interrupt… / Let me finish…); khớp tình huống bị ngắt lời của bài."},
    {"id":"QIy2yqsy044","credit":"BBC Learning English — Learning Circles - Ambulance. Useful English phrases for calling an ambulance","dur":"2:49","lang":"en","note":"BBC Learning Circles: câu khi gọi cấp cứu — nói rõ chuyện gì, ở đâu; nghe và nói theo."},
  ],
  'gtd29-noi': [
    {"id":"bDVrNLKG1bg","credit":"BBC Learning English — Explaining a misunderstanding – 19 – English at Work helps you explain a mix-up","dur":"3:55","lang":"en","note":"English at Work: gỡ hiểu lầm (I think there's been a misunderstanding… / What I meant was…); tập lại đoạn giải thích."},
    {"id":"N_wjnJiDB3I","credit":"BBC Learning English — Language for emergencies – 24 – English at Work gets you out of danger","dur":"4:28","lang":"en","note":"English at Work: ngôn ngữ trong tình huống khẩn cấp (gọi giúp đỡ, báo nguy hiểm); tập nói rõ và chắc."},
  ],
  'gtd30-nghe': [
    {"id":"AmQeSza-68Y","credit":"Miss Honey 🍯  — How to Speak English | Real-Life Role Play (B1–B2)","dur":"26:36","lang":"en","note":"Chuỗi nhập vai đời thường mức B1–B2 (nhiều cảnh nối nhau); nghe như một ngày sống bằng tiếng Anh, dừng sau mỗi cảnh tóm tắt bằng một câu."},
  ],
  'gtd30-noi': [
    {"id":"FlAyCnxwEEQ","credit":"Speak English With Vanessa — Speak With Me in English: Intermediate Speaking Lesson","dur":"27:29","lang":"en","note":"Speak English With Vanessa: luyện nói cùng — Vanessa hỏi, bạn trả lời thành tiếng trong khoảng dừng; khởi động trước buổi nhập vai 15 phút với Gia sư AI."},
  ],
};
