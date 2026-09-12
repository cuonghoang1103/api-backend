/**
 * Buổi 3 · Bài 13 — Handling stress in groups (22 slide).
 *
 * Bám bộ "Session 3_..._Lesson 13_Handling stress in groups.pptx". Syllabus
 * dành buổi 28 cho chủ đề này và hỏi CQ10.1–10.3; bản Academy cũ có 0 lần
 * nhắc chữ "stress". Slide 19 là ảnh poster dịch vụ tư vấn của trường — ảnh
 * mặt sinh viên trên đó ĐÃ ĐƯỢC LÀM MỜ trước khi đăng, giữ lại phần thông tin
 * dịch vụ vì đó là thông tin công khai và hữu ích.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's3-l13';

export const b3l13 = [
  walkHead(D, 1, 22,
    'The shortest theory in this session and the most directly useful. Two distinctions carry the exam weight: positive vs negative stress (slides 7–8) and acute vs chronic stress (slide 10).',
    'Phần lý thuyết ngắn nhất của buổi này và cũng dùng được ngay nhất. Hai cặp phân biệt gánh phần trọng số khi thi: stress tích cực và tiêu cực (slide 7–8), stress cấp tính và mạn tính (slide 10).'),

  slide(D, 1, 'Session III — Group & Team Theory (cont.)',
    `<p class="y-chinh">🎯 Title slide.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>`),

  slide(D, 2, 'Handling Stress in Groups',
    `<p class="y-chinh">🎯 Section divider — the last lesson of Session III.</p>
     <p class="meo">💡 Why it sits in a teamwork course: group conflict (Lesson 12) and group deadlines are two of the biggest stressors a student meets, and stressed members are the ones who stop communicating first.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục — bài cuối của Buổi III.</p>
     <p class="meo">💡 Vì sao nó nằm trong môn làm việc nhóm: xung đột nhóm (Bài 12) và hạn chót của nhóm là hai nguồn căng thẳng lớn nhất với sinh viên, mà người đang căng thẳng lại chính là người ngừng giao tiếp đầu tiên.</p>`),

  slide(D, 3, 'Learning objectives (3)',
    `<p class="y-chinh">🎯 Three objectives.</p>
     <ol>
       <li>Identify sources of stress, <strong>particularly for college students</strong>.</li>
       <li>Describe the symptoms and effects of <strong>chronic</strong> stress.</li>
       <li>List healthy ways of managing stress <strong>that fit your current lifestyle</strong>.</li>
     </ol>
     <p class="meo">💡 Objective 3 says "fit your lifestyle" — the point is a plan you will actually follow, not the ideal list.</p>`,
    `<p class="y-chinh">🎯 Ba mục tiêu.</p>
     <ol>
       <li>Nhận diện nguồn gây căng thẳng, <strong>nhất là với sinh viên</strong>.</li>
       <li>Mô tả triệu chứng và tác động của căng thẳng <strong>mạn tính</strong>.</li>
       <li>Liệt kê những cách quản lý căng thẳng lành mạnh <strong>phù hợp với lối sống hiện tại của bạn</strong>.</li>
     </ol>
     <p class="meo">💡 Mục tiêu 3 nói "phù hợp với lối sống của bạn" — trọng tâm là một kế hoạch bạn thật sự làm được, không phải danh sách lý tưởng.</p>`),

  slide(D, 4, 'Opening quotation',
    `<p class="y-chinh">🎯 "Being in control of your life and having realistic expectations about your day-to-day challenges are the keys to stress management" — Marilu Henner.</p>
     <p class="meo">💡 Two levers named in one sentence: <em>control</em> and <em>expectations</em>. Most of the techniques later in this deck move one or the other.</p>`,
    `<p class="y-chinh">🎯 "Làm chủ được đời mình và có kỳ vọng thực tế về những thử thách hằng ngày là chìa khoá của việc quản lý căng thẳng" — Marilu Henner.</p>
     <p class="meo">💡 Một câu nêu hai đòn bẩy: <em>quyền kiểm soát</em> và <em>kỳ vọng</em>. Phần lớn kỹ thuật ở cuối bộ slide này đều tác động vào một trong hai.</p>`),

  slide(D, 5, 'Causes of stress — the definition',
    `<p class="y-chinh">🎯 Stress is <strong>a condition characterised by symptoms of physical or emotional tension</strong>.</p>
     <p>What students may not know: it is a <em>natural response</em> of the mind and body to a situation in which a person feels threatened or anxious.</p>
     <p class="meo">💡 "Natural response" matters for objective 3: the goal is not to have no stress response, it is to keep the response proportionate and short.</p>`,
    `<p class="y-chinh">🎯 Căng thẳng là <strong>một trạng thái đặc trưng bởi các triệu chứng căng về thể chất hoặc cảm xúc</strong>.</p>
     <p>Thứ sinh viên có thể chưa biết: đó là <em>phản ứng tự nhiên</em> của tâm trí và cơ thể trước tình huống mà con người cảm thấy bị đe doạ hoặc lo âu.</p>
     <p class="meo">💡 Cụm "phản ứng tự nhiên" rất quan trọng với mục tiêu 3: đích đến không phải là không còn phản ứng căng thẳng, mà là giữ cho phản ứng ấy cân xứng và ngắn.</p>`),

  slide(D, 6, 'Causes of stress (cont.) — when normal becomes a problem',
    `<p class="y-chinh">🎯 The line between a normal reaction and something that needs help.</p>
     <ul>
       <li>Strong emotions such as fear, sadness or other symptoms of depression are <strong>normal</strong> — as long as they are temporary and do not interfere with daily activities.</li>
       <li>If those emotions last too long or cause other problems, it is a different story.</li>
       <li>Stress makes you feel <strong>overwhelmed and out of control</strong>.</li>
     </ul>
     <p class="meo">💡 Two tests, both practical: <em>how long</em>, and <em>does it stop you doing ordinary things</em>. Those are the two questions to ask yourself or a teammate.</p>`,
    `<p class="y-chinh">🎯 Ranh giới giữa phản ứng bình thường và thứ cần được giúp đỡ.</p>
     <ul>
       <li>Những cảm xúc mạnh như sợ hãi, buồn bã hay các dấu hiệu trầm cảm khác là <strong>bình thường</strong> — miễn là tạm thời và không cản trở sinh hoạt hằng ngày.</li>
       <li>Nếu các cảm xúc ấy kéo dài quá lâu hoặc gây ra vấn đề khác thì lại là chuyện khác.</li>
       <li>Căng thẳng khiến bạn thấy <strong>quá tải và mất kiểm soát</strong>.</li>
     </ul>
     <p class="meo">💡 Hai phép thử, đều rất thực dụng: <em>kéo dài bao lâu</em>, và <em>nó có chặn bạn làm những việc thường ngày không</em>. Đó là hai câu nên tự hỏi mình hoặc hỏi đồng đội.</p>`),

  slide(D, 7, 'Negative stress',
    `<p class="y-chinh">🎯 Stress can arrive when you least expect it.</p>
     <ul>
       <li>Before a test, after losing a job, during conflict in a relationship.</li>
       <li>Everyone experiences stress at times, but a <strong>prolonged bout</strong> can affect your health and your ability to cope with life.</li>
     </ul>
     <p class="meo">💡 Note the word doing the damage is "prolonged", not "strong". Duration is the risk factor, which is why slide 10 treats chronic stress separately.</p>`,
    `<p class="y-chinh">🎯 Căng thẳng có thể ập tới lúc bạn ít ngờ nhất.</p>
     <ul>
       <li>Trước một kỳ thi, sau khi mất việc, trong lúc quan hệ đang xung đột.</li>
       <li>Ai cũng có lúc căng thẳng, nhưng một đợt <strong>kéo dài</strong> có thể ảnh hưởng tới sức khoẻ và khả năng xoay xở với cuộc sống.</li>
     </ul>
     <p class="meo">💡 Để ý chữ gây hại là "kéo dài", không phải "mạnh". Thời lượng mới là yếu tố nguy cơ, và đó là lý do slide 10 tách riêng căng thẳng mạn tính.</p>`),

  slide(D, 8, 'Positive stress',
    `<p class="y-chinh">🎯 Stress can be positive.</p>
     <ul>
       <li>It can help you develop the skills needed to manage potentially challenging or threatening situations in life.</li>
       <li><span class="nhan">The slide's example</span> — preparing for a holiday trip.</li>
     </ul>
     <p class="meo">💡 Same shape as conflict in Lesson 12: the inverted-U applies here too. A little pressure before a presentation sharpens attention; a lot of it destroys recall.</p>`,
    `<p class="y-chinh">🎯 Căng thẳng có thể mang tính tích cực.</p>
     <ul>
       <li>Nó giúp bạn rèn những kỹ năng cần thiết để xoay xở với các tình huống có thể gây thách thức hay đe doạ trong đời.</li>
       <li><span class="nhan">Ví dụ trên slide</span> — chuẩn bị cho một chuyến đi nghỉ.</li>
     </ul>
     <p class="meo">💡 Cùng hình dạng với xung đột ở Bài 12: đường chữ U ngược cũng áp dụng ở đây. Một chút áp lực trước buổi thuyết trình làm sắc sự tập trung; quá nhiều thì phá luôn trí nhớ.</p>`),

  slide(D, 9, 'Signs and effects of stress — the common symptoms',
    `<p class="y-chinh">🎯 Sixteen common symptoms, grouped here so they are easier to hold.</p>
     <p><span class="nhan">Emotional</span> — disbelief and shock · tension and irritability · fear and anxiety about the future · anger · sadness and other symptoms of depression · feeling powerless · crying · being numb to one's feelings.</p>
     <p><span class="nhan">Cognitive</span> — difficulty making decisions · trouble concentrating · nightmares and recurring thoughts about the event.</p>
     <p><span class="nhan">Behavioural and physical</span> — loss of interest in normal activities · loss or increase of appetite · increased use of alcohol and drugs · sleep problems · headaches, back pains and stomach problems.</p>
     <p class="meo">💡 The grouping is mine, to make the list memorable; the items are exactly those on the slide.</p>`,
    `<p class="y-chinh">🎯 Mười sáu triệu chứng thường gặp, gom nhóm lại cho dễ nhớ.</p>
     <p><span class="nhan">Về cảm xúc</span> — hoài nghi và sốc · căng thẳng và cáu kỉnh · sợ hãi, lo âu về tương lai · giận dữ · buồn bã và các dấu hiệu trầm cảm khác · cảm giác bất lực · khóc · chai lì với cảm xúc của chính mình.</p>
     <p><span class="nhan">Về nhận thức</span> — khó ra quyết định · khó tập trung · ác mộng và những ý nghĩ lặp đi lặp lại về sự việc.</p>
     <p><span class="nhan">Về hành vi và thể chất</span> — mất hứng thú với sinh hoạt thường ngày · chán ăn hoặc ăn nhiều bất thường · dùng rượu và chất kích thích nhiều hơn · rối loạn giấc ngủ · đau đầu, đau lưng, vấn đề dạ dày.</p>
     <p class="meo">💡 Cách gom nhóm là của tôi, để danh sách dễ nhớ; còn các mục thì đúng nguyên như trên slide.</p>`),

  slide(D, 10, 'Chronic stress',
    `<p class="y-chinh">🎯 Chronic stress can <strong>impair your immune system and disrupt almost all of your body's processes</strong>, raising the risk of numerous health problems.</p>
     <p><span class="nhan">The seven listed</span></p>
     <ul class="hai-cot">
       <li>Anxiety</li>
       <li>Depression</li>
       <li>Digestive problems</li>
       <li>Heart disease</li>
       <li>Sleep problems</li>
       <li>Weight gain</li>
       <li>Memory and concentration impairment</li>
     </ul>
     <p>"That's why it's so important to learn healthy ways of coping with the stressors in your life."</p>
     <p class="pitfall co-tieu-de"><strong>Chú ý mục cuối:</strong> memory and concentration impairment means chronic stress attacks exactly the faculties you need to study your way out of the situation causing it.</p>`,
    `<p class="y-chinh">🎯 Căng thẳng mạn tính có thể <strong>làm suy yếu hệ miễn dịch và rối loạn gần như mọi quá trình của cơ thể</strong>, làm tăng nguy cơ hàng loạt vấn đề sức khoẻ.</p>
     <p><span class="nhan">Bảy thứ được liệt kê</span></p>
     <ul class="hai-cot">
       <li>Lo âu</li>
       <li>Trầm cảm</li>
       <li>Rối loạn tiêu hoá</li>
       <li>Bệnh tim</li>
       <li>Rối loạn giấc ngủ</li>
       <li>Tăng cân</li>
       <li>Suy giảm trí nhớ và khả năng tập trung</li>
     </ul>
     <p>"Chính vì thế mà học được những cách ứng phó lành mạnh với các tác nhân gây căng thẳng trong đời là điều rất quan trọng."</p>
     <p class="pitfall co-tieu-de"><strong>Để ý mục cuối:</strong> suy giảm trí nhớ và tập trung nghĩa là căng thẳng mạn tính tấn công đúng những năng lực bạn cần để học mà thoát ra khỏi chính hoàn cảnh gây ra nó.</p>`),

  slide(D, 11, 'Ways of managing stress — the six',
    `<p class="y-chinh">🎯 "The best strategy for managing stress is by taking care of yourself" — six ways, each on its own slide.</p>
     <ol>
       <li>Avoid drugs and alcohol</li>
       <li>Manage your time</li>
       <li>Connect socially</li>
       <li>Slow down and cut out distractions for a while</li>
       <li>Take care of your health</li>
       <li>Find support</li>
     </ol>`,
    `<p class="y-chinh">🎯 "Chiến lược tốt nhất để quản lý căng thẳng là chăm sóc chính mình" — sáu cách, mỗi cách một slide.</p>
     <ol>
       <li>Tránh chất kích thích và rượu bia</li>
       <li>Quản lý thời gian</li>
       <li>Kết nối xã hội</li>
       <li>Chậm lại và cắt bớt thứ gây phân tâm một thời gian</li>
       <li>Chăm sóc sức khoẻ</li>
       <li>Tìm chỗ dựa</li>
     </ol>`),

  slide(D, 12, 'Avoid drugs and alcohol',
    `<p class="y-chinh">🎯 They may seem a temporary fix to feel better.</p>
     <p>But in the long run they can <strong>create more problems and add to your stress</strong> — instead of taking it away.</p>
     <p class="meo">💡 The pattern is worth naming: anything that reduces the feeling without touching the cause tends to raise the total amount of stress over time.</p>`,
    `<p class="y-chinh">🎯 Chúng trông như một cách chữa tạm để thấy dễ chịu hơn.</p>
     <p>Nhưng về lâu dài, chúng có thể <strong>tạo thêm vấn đề và cộng thêm vào căng thẳng của bạn</strong> — thay vì lấy bớt nó đi.</p>
     <p class="meo">💡 Cái khuôn mẫu này đáng gọi tên: bất cứ thứ gì làm dịu cảm giác mà không đụng tới nguyên nhân đều có xu hướng làm tổng lượng căng thẳng tăng lên theo thời gian.</p>`),

  slide(D, 13, 'Manage your time',
    `<p class="y-chinh">🎯 Work on prioritising and scheduling your commitments.</p>
     <p>This helps you feel in <strong>better control of your life</strong>, which in turn means less stress.</p>
     <p class="meo">💡 This is the "control" lever from slide 4, and it is the one a group can help with directly: a clear task split (Lesson 12, prevention strategy 2) removes the uncertainty that produces the stress.</p>`,
    `<p class="y-chinh">🎯 Hãy sắp thứ tự ưu tiên và lên lịch cho các cam kết của mình.</p>
     <p>Việc này giúp bạn thấy <strong>làm chủ cuộc sống hơn</strong>, và nhờ đó bớt căng thẳng.</p>
     <p class="meo">💡 Đây chính là đòn bẩy "quyền kiểm soát" ở slide 4, và là chỗ nhóm giúp được trực tiếp: chia việc rõ ràng (Bài 12, chiến lược phòng ngừa số 2) sẽ gỡ đi sự bất định vốn sinh ra căng thẳng.</p>`),

  slide(D, 14, 'Connect socially',
    `<p class="y-chinh">🎯 When you feel stressed it is easy to isolate yourself — <strong>resist that impulse</strong>.</p>
     <ul>
       <li>Make time to enjoy being with classmates, friends and family.</li>
       <li>Try to schedule study breaks you can take <em>with other people</em>.</li>
     </ul>
     <p class="meo">💡 Ties straight back to Lesson 3: groups provide information, assistance and social support. Withdrawing from the group removes the third one exactly when it is needed most.</p>`,
    `<p class="y-chinh">🎯 Khi căng thẳng, người ta rất dễ tự cô lập — <strong>hãy cưỡng lại thôi thúc đó</strong>.</p>
     <ul>
       <li>Dành thời gian tận hưởng việc ở bên bạn học, bạn bè và gia đình.</li>
       <li>Cố sắp những quãng nghỉ học mà bạn có thể nghỉ <em>cùng người khác</em>.</li>
     </ul>
     <p class="meo">💡 Nối thẳng về Bài 3: nhóm mang lại thông tin, sự trợ giúp và chỗ dựa xã hội. Rút khỏi nhóm là tự cắt mất thứ thứ ba, đúng lúc cần nó nhất.</p>`),

  slide(D, 15, 'Slow down and cut out distractions',
    `<p class="y-chinh">🎯 Take a break from your phone, email and social media.</p>
     <p class="meo">💡 Note this is the same advice as Lesson 5–6 slide 17 gave for creativity — letting the mind wander. The two lessons agree: uninterrupted quiet is a working condition, not a luxury.</p>`,
    `<p class="y-chinh">🎯 Tạm nghỉ điện thoại, email và mạng xã hội một thời gian.</p>
     <p class="meo">💡 Để ý đây đúng là lời khuyên mà slide 17 Bài 5–6 đưa ra cho sáng tạo — để đầu óc lang thang. Hai bài đồng ý với nhau: khoảng lặng không bị ngắt quãng là điều kiện làm việc, không phải thứ xa xỉ.</p>`),

  slide(D, 16, 'Take care of your health',
    `<p class="y-chinh">🎯 Five concrete actions.</p>
     <ul>
       <li>Eat a healthy, well-balanced diet.</li>
       <li>Exercise regularly.</li>
       <li>Get plenty of sleep.</li>
       <li>Try a relaxation technique such as meditation or yoga, or treat yourself to a massage.</li>
       <li><strong>Maintain a normal routine.</strong></li>
     </ul>
     <p class="meo">💡 The last one is the least obvious and often the most effective: a routine restores predictability, which is the "realistic expectations" lever from slide 4.</p>`,
    `<p class="y-chinh">🎯 Năm hành động cụ thể.</p>
     <ul>
       <li>Ăn uống lành mạnh, cân bằng.</li>
       <li>Tập thể dục đều đặn.</li>
       <li>Ngủ đủ.</li>
       <li>Thử một kỹ thuật thư giãn như thiền hay yoga, hoặc tự thưởng cho mình một buổi mát-xa.</li>
       <li><strong>Duy trì nhịp sinh hoạt bình thường.</strong></li>
     </ul>
     <p class="meo">💡 Cái cuối ít hiển nhiên nhất mà thường hiệu quả nhất: nhịp sinh hoạt đều đặn khôi phục tính dễ đoán, tức là đòn bẩy "kỳ vọng thực tế" ở slide 4.</p>`),

  slide(D, 17, 'Meditation',
    `<p class="y-chinh">🎯 Illustration slide for the relaxation technique named on the previous slide.</p>
     <p class="meo">💡 Any technique that slows breathing and narrows attention will do. The requirement is regularity, not the specific method.</p>`,
    `<p class="y-chinh">🎯 Slide minh hoạ cho kỹ thuật thư giãn vừa nêu ở slide trước.</p>
     <p class="meo">💡 Kỹ thuật nào làm chậm nhịp thở và thu hẹp sự chú ý đều được. Yêu cầu nằm ở sự đều đặn, không nằm ở phương pháp cụ thể.</p>`),

  slide(D, 18, 'Find support',
    `<p class="y-chinh">🎯 Where to look, and why it works.</p>
     <ul>
       <li>Seek help from a friend, family member, partner, counsellor, doctor or clergy person.</li>
       <li><strong>Having a sympathetic listening ear and talking about your problems really can lighten the burden.</strong></li>
     </ul>
     <p><span class="nhan">Places listed</span> — counselling/therapy centre · hospital · online counselling · hotline · family and friends.</p>`,
    `<p class="y-chinh">🎯 Tìm ở đâu, và vì sao cách đó có tác dụng.</p>
     <ul>
       <li>Tìm sự giúp đỡ từ bạn bè, người thân, bạn đời, chuyên viên tham vấn, bác sĩ hoặc người tu hành.</li>
       <li><strong>Có một người chịu lắng nghe với sự cảm thông, và được nói ra vấn đề của mình, thật sự làm gánh nặng nhẹ đi.</strong></li>
     </ul>
     <p><span class="nhan">Những nơi được liệt kê</span> — trung tâm tham vấn/trị liệu · bệnh viện · tham vấn trực tuyến · đường dây nóng · gia đình và bạn bè.</p>`),

  slide(D, 19, 'Example — free counselling service from your university',
    `<p class="y-chinh">🎯 The slide shows the university's own counselling room ("Phòng Tư vấn Tâm lý Cóc Kể") with its location, phone, email and Facebook page.</p>
     <p><span class="nhan">Riêng tư</span> — the group photograph of students on this slide has been <strong>blurred</strong> in the Academy copy. The service's own contact details are left visible because they are published by the university and are the useful part of the slide.</p>
     <p class="meo">💡 The practical point: this service is free and already paid for by your tuition. Using it is not an escalation.</p>`,
    `<p class="y-chinh">🎯 Slide giới thiệu chính phòng tham vấn của trường ("Phòng Tư vấn Tâm lý Cóc Kể") kèm địa điểm, số điện thoại, email và trang Facebook.</p>
     <p><span class="nhan">Riêng tư</span> — bức ảnh chụp nhóm sinh viên trên slide này đã được <strong>làm mờ</strong> trong bản đăng ở Academy. Phần thông tin liên hệ của dịch vụ thì giữ nguyên, vì đó là thông tin do trường công bố và là phần hữu ích của slide.</p>
     <p class="meo">💡 Điểm thực tế: dịch vụ này miễn phí và học phí của bạn đã trả cho nó rồi. Dùng nó không phải là chuyện gì to tát.</p>`),

  slide(D, 20, 'When self-care is not enough',
    `<p class="y-chinh">🎯 The explicit permission slide.</p>
     <p>If the self-care techniques listed above are not enough and stress is <strong>seriously interfering with your studies or life</strong>, do not be afraid to get help. The student health centre and college counsellors are both good resources.</p>
     <p class="meo">💡 "Seriously interfering with your studies or life" is the same threshold as slide 6. If you cross it, the list on slides 12–18 is no longer the right tool.</p>`,
    `<p class="y-chinh">🎯 Slide cho phép một cách dứt khoát.</p>
     <p>Nếu các cách tự chăm sóc kể trên vẫn chưa đủ và căng thẳng đang <strong>cản trở nghiêm trọng việc học hoặc cuộc sống của bạn</strong>, đừng ngại tìm người giúp. Phòng y tế sinh viên và các chuyên viên tham vấn của trường đều là chỗ dựa tốt.</p>
     <p class="meo">💡 "Cản trở nghiêm trọng việc học hoặc cuộc sống" chính là ngưỡng đã nêu ở slide 6. Vượt qua ngưỡng đó thì danh sách ở slide 12–18 không còn là công cụ đúng nữa.</p>`),

  slide(D, 21, 'Activity — relaxation',
    `<p class="y-chinh">🎯 In-class relaxation activity.</p>
     <p class="meo">💡 Treat it as data, not as a break: notice which technique actually lowers your tension. Objective 3 asks for methods that fit <em>your</em> lifestyle, and this is the cheapest way to find out which ones do.</p>`,
    `<p class="y-chinh">🎯 Hoạt động thư giãn trên lớp.</p>
     <p class="meo">💡 Hãy coi đó là dữ liệu chứ không phải giờ nghỉ: để ý xem kỹ thuật nào thật sự làm bạn giãn ra. Mục tiêu 3 đòi những cách hợp với lối sống <em>của bạn</em>, và đây là cách rẻ nhất để biết cách nào hợp.</p>`),

  slide(D, 22, 'End of Session III',
    `<p class="y-chinh">🎯 Session III complete.</p>
     <ol>
       <li>Power lives in relationships; five bases, and status is perceived, not owned (Lesson 9).</li>
       <li>Leadership is a relationship, not a title; culture differs along six dimensions (Lessons 10–11).</li>
       <li>Conflict has three conditions, four stages, five resolution modes (Lesson 12).</li>
       <li>Stress is natural; duration is what makes it dangerous, and six self-care routes exist before you need help (this lesson).</li>
     </ol>`,
    `<p class="y-chinh">🎯 Buổi III hoàn tất.</p>
     <ol>
       <li>Quyền lực sống trong các mối quan hệ; năm nền tảng, và địa vị là thứ được nhìn nhận chứ không phải thứ sở hữu (Bài 9).</li>
       <li>Lãnh đạo là một mối quan hệ, không phải chức danh; văn hoá khác nhau theo sáu chiều (Bài 10–11).</li>
       <li>Xung đột có ba điều kiện, bốn giai đoạn, năm cách giải quyết (Bài 12).</li>
       <li>Căng thẳng là tự nhiên; thời lượng mới làm nó nguy hiểm, và có sáu hướng tự chăm sóc trước khi cần tới trợ giúp chuyên môn (bài này).</li>
     </ol>`),

  books([
    ['lumen', 'chương Health and Stress — sources, symptoms, coping', 'chương Health and Stress — nguồn gốc, triệu chứng, cách ứng phó'],
    ['wig', 'phần về stress và cohesion trong nhóm', 'phần về căng thẳng và sự gắn kết trong nhóm'],
  ]),

  bi(
    `<h3>✅ A gap that was total</h3>
     <p>The syllabus gives session 28 to handling stress in groups and asks CQ10.1–10.3 about it. In the previous version of this Academy course the word "stress" appeared zero times — this lesson is entirely new content, taken from the lecturer's own deck.</p>`,
    `<h3>✅ Một lỗ hổng trống hoàn toàn</h3>
     <p>Syllabus dành buổi 28 cho chủ đề xử lý căng thẳng trong nhóm và hỏi CQ10.1–10.3 về nó. Ở phiên bản cũ của khoá học này, chữ "stress" xuất hiện đúng 0 lần — bài này là nội dung hoàn toàn mới, dựng từ chính bộ slide của giảng viên.</p>`),
].join('\n');
