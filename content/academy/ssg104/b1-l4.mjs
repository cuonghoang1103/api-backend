/**
 * Buổi 1 · Bài 4 — Social Comparison (28 slide).
 *
 * Bám bộ slide "Session 1_..._Lesson 4_Social Comparison.pptx". Syllabus hỏi
 * thẳng CQ3.1 về lý thuyết so sánh xã hội; bản Academy cũ có 0 lần nhắc cụm
 * "social comparison". Bài này bù toàn bộ: hướng so sánh, hệ quả, mô hình SEM,
 * bốn yếu tố tình huống, hiệu ứng ao làng và Dunning-Kruger.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's1-l4';

export const b1l4 = [
  walkHead(D, 1, 28,
    'Festinger was named in Lesson 3 slide 7; this deck is that idea in full. The four situational factors (slides 19–23) are the part most likely to appear as a scenario question.',
    'Festinger đã được nhắc ở slide 7 Bài 3; bộ này khai triển trọn ý đó. Bốn yếu tố tình huống (slide 19–23) là phần dễ ra đề tình huống nhất.'),

  slide(D, 1, 'Communication and In-group Working Skills (cont.)',
    `<p class="y-chinh">🎯 Title slide, still Session I.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề, vẫn thuộc Buổi I.</p>`),

  slide(D, 2, 'Chapter outline',
    `<p class="y-chinh">🎯 Outline. The lesson answers four questions: why we compare, what it does to us, how closeness changes it, and when the situation amplifies it.</p>`,
    `<p class="y-chinh">🎯 Mục lục. Bài trả lời bốn câu: vì sao ta so sánh, nó làm gì ta, sự thân thiết đổi nó ra sao, và khi nào tình huống khuếch đại nó.</p>`),

  slide(D, 3, 'Learning objectives (4)',
    `<p class="y-chinh">🎯 Four objectives.</p>
     <ol>
       <li>Understand the reasons people make social comparisons.</li>
       <li>Identify the consequences of social comparison.</li>
       <li>Understand the <strong>Self-Evaluation Maintenance (SEM)</strong> model.</li>
       <li>Explain the situational factors that affect social comparison.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Bốn mục tiêu.</p>
     <ol>
       <li>Hiểu vì sao con người so sánh xã hội.</li>
       <li>Nhận ra các hệ quả của so sánh xã hội.</li>
       <li>Hiểu mô hình <strong>Duy trì tự đánh giá (SEM)</strong>.</li>
       <li>Giải thích các yếu tố tình huống tác động tới so sánh xã hội.</li>
     </ol>`),

  slide(D, 4, 'Introduction of social comparison',
    `<p class="y-chinh">🎯 Divider.</p>
     <p><span class="nhan">Definition to hold on to</span> — social comparison is evaluating yourself by measuring against other people, because many of our qualities have no objective yardstick.</p>
     <p class="meo">💡 Festinger's starting point (Lesson 3 slide 7): when there is no objective measure, people use other people as the measure.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục.</p>
     <p><span class="nhan">Định nghĩa cần nhớ</span> — so sánh xã hội là tự đánh giá bản thân bằng cách đo với người khác, bởi nhiều phẩm chất của ta chẳng có thước đo khách quan nào.</p>
     <p class="meo">💡 Điểm xuất phát của Festinger (slide 7 Bài 3): khi không có thước đo khách quan, người ta lấy người khác làm thước.</p>`),

  slide(D, 5, 'Basics — advertisers already know this',
    `<p class="y-chinh">🎯 The first example is commercial, on purpose.</p>
     <p>Advertisers create <strong>idealised images</strong> that influence how consumers see themselves — and what they feel they must buy in order to be satisfied.</p>
     <p class="meo">💡 The mechanism is the lesson's whole thesis in one line: change the comparison target and you change how a person feels about an unchanged self.</p>`,
    `<p class="y-chinh">🎯 Ví dụ đầu tiên lấy từ quảng cáo, và đó là có chủ ý.</p>
     <p>Nhà quảng cáo tạo ra <strong>hình ảnh lý tưởng hoá</strong> tác động tới cách người tiêu dùng nhìn chính mình — và tới thứ họ thấy buộc phải mua mới thoả mãn.</p>
     <p class="meo">💡 Cơ chế này gói cả luận điểm của bài trong một dòng: đổi đối tượng so sánh là đổi cảm nhận của một người về chính con người không hề thay đổi của họ.</p>`),

  slide(D, 6, 'Basics — similarity matters',
    `<p class="y-chinh">🎯 We do not compare ourselves with just anyone.</p>
     <p>A professional athlete is far more likely to compare his or her performance against <em>other professionals</em> than against an amateur.</p>
     <p class="meo">💡 Practical consequence in a class: you feel your mark against your group, not against every student in the country. Slide 20 ("local") turns this into a named factor.</p>`,
    `<p class="y-chinh">🎯 Ta không so mình với bất kỳ ai.</p>
     <p>Một vận động viên chuyên nghiệp có xu hướng so thành tích với <em>vận động viên chuyên nghiệp khác</em> nhiều hơn hẳn so với dân nghiệp dư.</p>
     <p class="meo">💡 Hệ quả thực tế trong lớp: bạn cảm nhận điểm của mình so với nhóm mình, chứ không so với mọi sinh viên cả nước. Slide 20 ("local") biến điều này thành một yếu tố có tên.</p>`),

  slide(D, 7, 'Relevance and similarity (Festinger, 1954)',
    `<p class="y-chinh">🎯 The comparison dimension must be <strong>relevant to the self</strong>.</p>
     <p>If excelling academically matters more to you than excelling at sport, you will compare yourself with others on academic rather than athletic performance.</p>
     <p class="meo">💡 Test it on yourself: the marks that sting are the ones in subjects you have decided matter. That sting is the definition at work.</p>`,
    `<p class="y-chinh">🎯 Chiều đem ra so phải <strong>có liên quan tới bản thân</strong>.</p>
     <p>Nếu giỏi học quan trọng với bạn hơn giỏi thể thao, bạn sẽ so mình với người khác ở chuyện học chứ không ở chuyện thể thao.</p>
     <p class="meo">💡 Thử ngay trên chính mình: điểm số làm bạn nhói lòng là điểm của môn bạn đã quyết rằng nó quan trọng. Cái nhói đó chính là định nghĩa đang vận hành.</p>`),

  slide(D, 8, 'Direction — upward and downward comparisons',
    `<p class="y-chinh">🎯 Social comparison is <strong>bi-directional</strong>.</p>
     <ul>
       <li><span class="nhan">Upward comparison</span> — with people who are better than us.</li>
       <li><span class="nhan">Downward comparison</span> — with people who are worse off than us.</li>
     </ul>
     <p class="meo">💡 Neither direction is automatically good or bad. Slide 17 shows the same upward comparison producing a threat for one person and a challenge for another.</p>`,
    `<p class="y-chinh">🎯 So sánh xã hội đi <strong>hai chiều</strong>.</p>
     <ul>
       <li><span class="nhan">So sánh lên</span> — với người giỏi hơn ta.</li>
       <li><span class="nhan">So sánh xuống</span> — với người kém hơn ta.</li>
     </ul>
     <p class="meo">💡 Không chiều nào tự nó tốt hay xấu. Slide 17 cho thấy cùng một so sánh lên lại thành mối đe doạ với người này và thành thử thách với người kia.</p>`),

  slide(D, 9, 'Consequences of social comparison (3)',
    `<p class="y-chinh">🎯 Three named effects, each with the slide's own example.</p>
     <ul>
       <li><span class="nhan">Impacts self-esteem</span> — having the best final score in a class can raise it considerably.</li>
       <li><span class="nhan">Leads to regret and envy</span> — someone with thinning hair envying a colleague's thick hair.</li>
       <li><span class="nhan">Produces more competitive behaviour</span> — being in the top 10% on a mid-term makes you feel competitive with the other top students.</li>
     </ul>
     <p class="meo">💡 Note the third: competitiveness rises <em>near the top</em>, not at the bottom. Slide 22 explains why with the proximity-to-a-standard effect.</p>`,
    `<p class="y-chinh">🎯 Ba hệ quả được gọi tên, mỗi cái kèm ví dụ ngay trên slide.</p>
     <ul>
       <li><span class="nhan">Tác động tới lòng tự trọng</span> — được điểm cao nhất lớp có thể nâng nó lên đáng kể.</li>
       <li><span class="nhan">Sinh ra tiếc nuối và ghen tị</span> — người tóc thưa ghen với mái tóc dày của đồng nghiệp.</li>
       <li><span class="nhan">Khiến hành xử cạnh tranh hơn</span> — nằm trong top 10% bài giữa kỳ làm bạn thấy ganh đua với những người đứng đầu khác.</li>
     </ul>
     <p class="meo">💡 Để ý cái thứ ba: tính cạnh tranh dâng lên <em>ở gần đỉnh</em>, không phải ở đáy. Slide 22 giải thích bằng hiệu ứng "gần một chuẩn mốc".</p>`),

  slide(D, 10, 'Consequences — jealousy, regret, or motivation',
    `<p class="y-chinh">🎯 The same comparison can produce jealousy, regret <em>or</em> motivation.</p>
     <p><span class="nhan">Designed use</span> — lapel stickers and online badges saying "I voted" or "I gave blood" deliberately leverage social comparison to produce positive social outcomes.</p>
     <p class="meo">💡 That is the honest version of this lesson: comparison is a lever, and someone is always pulling it. Better to know which direction you are being pulled.</p>`,
    `<p class="y-chinh">🎯 Cùng một phép so sánh có thể sinh ra ghen tị, tiếc nuối <em>hoặc</em> động lực.</p>
     <p><span class="nhan">Cách dùng có chủ đích</span> — huy hiệu cài áo và huy hiệu trực tuyến kiểu "Tôi đã đi bầu" hay "Tôi đã hiến máu" chính là khai thác so sánh xã hội để tạo ra kết quả xã hội tích cực.</p>
     <p class="meo">💡 Đó là phiên bản trung thực của bài học: so sánh là một cái đòn bẩy, và luôn có ai đó đang bẩy nó. Biết mình đang bị bẩy về hướng nào vẫn hơn.</p>`),

  slide(D, 11, 'The Self-Evaluation Maintenance (SEM) model — Tesser, 1988',
    `<p class="y-chinh">🎯 SEM builds on social comparison theory and adds one variable: <strong>how close you are to the other person</strong>.</p>
     <ul>
       <li>SEM points to psychological forces that help maintain our self-evaluation and self-esteem.</li>
       <li>It reveals that <strong>relationship closeness</strong> affects self-evaluation.</li>
       <li><span class="nhan">Self-esteem</span> = the feeling of confidence in one's own abilities or worth.</li>
     </ul>
     <p class="meo">💡 The counter-intuitive prediction: on a dimension that matters to you, a <em>friend's</em> success threatens you more than a stranger's. The next two slides prove it experimentally.</p>`,
    `<p class="y-chinh">🎯 SEM dựng trên lý thuyết so sánh xã hội và thêm một biến: <strong>bạn thân thiết tới đâu với người kia</strong>.</p>
     <ul>
       <li>SEM chỉ ra những lực tâm lý giúp giữ gìn sự tự đánh giá và lòng tự trọng của ta.</li>
       <li>Nó cho thấy <strong>mức độ thân thiết</strong> ảnh hưởng tới cách ta tự đánh giá.</li>
       <li><span class="nhan">Lòng tự trọng</span> = cảm giác tự tin vào năng lực hoặc giá trị của bản thân.</li>
     </ul>
     <p class="meo">💡 Dự đoán ngược trực giác: ở chiều mà bạn coi trọng, thành công của <em>bạn thân</em> đe doạ bạn nhiều hơn thành công của người lạ. Hai slide sau chứng minh bằng thực nghiệm.</p>`),

  slide(D, 12, 'The SEM experiment — Tesser & Smith (1980), setup',
    `<p class="y-chinh">🎯 A word game in which participants could receive clues from a partner.</p>
     <ul>
       <li>Clues helped the player guess the correct word.</li>
       <li>Half were told the game measured <strong>intelligence</strong>; half were not.</li>
       <li>Half were paired with a <strong>close friend</strong>; half with a <strong>stranger</strong>.</li>
     </ul>
     <p class="meo">💡 Two factors crossed = four conditions. Recognising that design is itself an exam-worthy skill: it lets you say which comparison the result rests on.</p>`,
    `<p class="y-chinh">🎯 Một trò chơi đoán chữ trong đó người tham gia có thể nhận gợi ý từ bạn chơi.</p>
     <ul>
       <li>Gợi ý giúp người chơi đoán đúng từ.</li>
       <li>Một nửa được bảo rằng trò này đo <strong>trí thông minh</strong>; nửa kia thì không.</li>
       <li>Một nửa ghép cặp với <strong>bạn thân</strong>; nửa kia với <strong>người lạ</strong>.</li>
     </ul>
     <p class="meo">💡 Hai yếu tố bắt chéo = bốn điều kiện. Nhận ra thiết kế đó tự nó đã là kỹ năng đáng điểm: nó cho phép bạn nói kết quả dựa trên phép so sánh nào.</p>`),

  slide(D, 13, 'The SEM experiment — results',
    `<p class="y-chinh">🎯 The result flips depending on whether the task felt self-relevant.</p>
     <ul>
       <li><span class="nhan">Task = intelligence (self-relevant)</span> — participants gave <strong>harder</strong> clues to a friend than to a stranger. A competitive uptick tied to closeness.</li>
       <li><span class="nhan">Task = irrelevant to the self</span> — participants gave <strong>easier</strong> clues to friends than to strangers.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cốt lõi:</strong> we help friends more — except exactly where their success would outshine us on something we have staked ourselves on.</p>`,
    `<p class="y-chinh">🎯 Kết quả đảo chiều tuỳ theo nhiệm vụ có "dính" tới bản thân hay không.</p>
     <ul>
       <li><span class="nhan">Nhiệm vụ = trí thông minh (dính tới bản thân)</span> — người tham gia đưa gợi ý <strong>khó hơn</strong> cho bạn thân so với người lạ. Một nhịp ganh đua gắn với sự thân thiết.</li>
       <li><span class="nhan">Nhiệm vụ = không liên quan tới bản thân</span> — họ đưa gợi ý <strong>dễ hơn</strong> cho bạn thân so với người lạ.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cốt lõi:</strong> ta giúp bạn bè nhiều hơn — trừ đúng chỗ mà thành công của họ sẽ làm lu mờ ta ở thứ ta đã đặt cược bản thân vào.</p>`),

  slide(D, 14, 'SEM in organisations — hiring below your own level',
    `<p class="y-chinh">🎯 The uncomfortable organisational prediction of SEM.</p>
     <p>Managers may prefer <strong>sub-optimal candidates</strong> who are unlikely to challenge their standing in the organisation.</p>
     <p class="meo">💡 In your group project the same force appears as: the strongest member quietly keeps the most visible task. Naming the mechanism is how a team defuses it.</p>`,
    `<p class="y-chinh">🎯 Dự đoán khó chịu của SEM ở cấp tổ chức.</p>
     <p>Người quản lý có thể thích chọn <strong>ứng viên kém tối ưu</strong>, những người ít có khả năng đe doạ vị thế của họ trong tổ chức.</p>
     <p class="meo">💡 Trong dự án nhóm, lực này hiện ra dưới dạng: thành viên mạnh nhất lặng lẽ ôm phần việc dễ thấy nhất. Gọi tên cơ chế chính là cách nhóm vô hiệu hoá nó.</p>`),

  slide(D, 15, 'Individual differences — mastery goals',
    `<p class="y-chinh">🎯 The effect of comparison depends on personality and individual differences.</p>
     <p>People with <strong>mastery goals</strong> may read an upward comparison not as a threat to the self but as a <em>challenge</em>, and as a hopeful sign that a certain level of performance is reachable.</p>
     <p class="meo">💡 Mastery goal = "I want to get better at this". Performance goal = "I want to look good at this". The first survives an upward comparison; the second does not.</p>`,
    `<p class="y-chinh">🎯 Tác động của so sánh còn tuỳ tính cách và khác biệt cá nhân.</p>
     <p>Người theo <strong>mục tiêu làm chủ (mastery goal)</strong> có thể đọc một so sánh lên không như mối đe doạ mà như một <em>thử thách</em>, và như dấu hiệu đáng hy vọng rằng mức năng lực ấy là với tới được.</p>
     <p class="meo">💡 Mục tiêu làm chủ = "tôi muốn giỏi lên". Mục tiêu thể hiện = "tôi muốn trông giỏi". Cái đầu sống sót qua một so sánh lên; cái sau thì không.</p>`),

  slide(D, 16, 'Individual differences — fixed vs growth mindset (Dweck, 2007)',
    `<p class="y-chinh">🎯 The second individual difference, and the course names its author.</p>
     <ul>
       <li><span class="nhan">Fixed mindset</span> — abilities and talents cannot change. An upward comparison therefore threatens the self and brings the negative consequences: competitive behaviour, envy, unhappiness.</li>
       <li><span class="nhan">Growth mindset</span> — an upward comparison is a challenge and an opportunity to improve.</li>
     </ul>
     <p class="meo">💡 Same event, two readings, two different outcomes. This is the most directly usable idea in the whole lesson.</p>`,
    `<p class="y-chinh">🎯 Khác biệt cá nhân thứ hai, và môn học nêu rõ tác giả.</p>
     <ul>
       <li><span class="nhan">Tư duy cố định</span> — năng lực và tài năng là bất biến. Nên một so sánh lên trở thành mối đe doạ và kéo theo hệ quả tiêu cực: hành xử ganh đua, ghen tị, bất mãn.</li>
       <li><span class="nhan">Tư duy phát triển</span> — so sánh lên là thử thách và là cơ hội để tiến bộ.</li>
     </ul>
     <p class="meo">💡 Cùng một sự việc, hai cách đọc, hai kết cục khác nhau. Đây là ý dùng được ngay nhất trong cả bài.</p>`),

  slide(D, 17, 'Situational factors — the four',
    `<p class="y-chinh">🎯 Four factors, each unpacked on its own slide.</p>
     <ol>
       <li><span class="nhan">Number</span> — how many people you could compare with.</li>
       <li><span class="nhan">Local</span> — how near the comparison is to your daily circle.</li>
       <li><span class="nhan">Proximity to a standard</span> — how close you are to a threshold such as #1.</li>
       <li><span class="nhan">Social category lines</span> — whether the comparison crosses group boundaries.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Bốn yếu tố, mỗi cái được mổ xẻ ở một slide riêng.</p>
     <ol>
       <li><span class="nhan">Số lượng</span> — có bao nhiêu người để bạn so.</li>
       <li><span class="nhan">Tính cục bộ</span> — phép so sánh gần vòng tròn thường ngày của bạn tới đâu.</li>
       <li><span class="nhan">Gần một chuẩn mốc</span> — bạn cách ngưỡng như hạng nhất bao xa.</li>
       <li><span class="nhan">Ranh giới nhóm xã hội</span> — phép so sánh có vượt qua ranh giới nhóm hay không.</li>
     </ol>`),

  slide(D, 18, 'Number — the N-Effect',
    `<p class="y-chinh">🎯 As the number of comparison targets rises, social comparison <strong>decreases</strong>.</p>
     <p><span class="nhan">The slide's race</span> — competitors of similar ability, top 20% win a prize. Do you try harder with 10 runners or 100? The N-Effect (Garcia & Tor, 2009; Tor & Garcia, 2010) says <strong>10</strong>.</p>
     <p>As competitors multiply, comparison — one of the engines of competitive motivation — matters less.</p>
     <p class="meo">💡 The deck's own classroom example: as the number of presenters grows, you feel less comparison pressure.</p>`,
    `<p class="y-chinh">🎯 Số đối tượng để so càng tăng thì so sánh xã hội càng <strong>giảm</strong>.</p>
     <p><span class="nhan">Cuộc đua trên slide</span> — các đối thủ ngang sức, top 20% được thưởng. Bạn cố hơn khi có 10 người chạy hay 100 người? Hiệu ứng N (Garcia & Tor, 2009; Tor & Garcia, 2010) trả lời: <strong>10</strong>.</p>
     <p>Đối thủ càng đông, so sánh — một trong những động cơ của động lực cạnh tranh — càng ít quan trọng.</p>
     <p class="meo">💡 Ví dụ lớp học ngay trên slide: số người thuyết trình càng nhiều thì bạn càng thấy ít áp lực so sánh.</p>`),

  slide(D, 19, 'Local — we compare near, not far',
    `<p class="y-chinh">🎯 People are more influenced by comparisons that are <strong>local</strong> than by broad, general ones.</p>
     <p><span class="nhan">The height example</span> — you could compare your height with a friend, a group of friends, colleagues, or the average for your city. People generally use the local one.</p>
     <p>So being among the tallest in your circle of friends lifts your self-esteem even if you are among the shortest nationally.</p>
     <p class="meo">💡 This is why changing environment changes self-image without changing you: new local reference, same person.</p>`,
    `<p class="y-chinh">🎯 Người ta chịu ảnh hưởng bởi những so sánh <strong>cục bộ</strong> nhiều hơn những so sánh rộng và chung chung.</p>
     <p><span class="nhan">Ví dụ chiều cao</span> — bạn có thể so chiều cao với một người bạn, một nhóm bạn, đồng nghiệp, hay mức trung bình của cả thành phố. Người ta thường dùng cái cục bộ.</p>
     <p>Nên cao nhất trong nhóm bạn bè vẫn nâng lòng tự trọng của bạn, dù xét trên cả nước bạn thuộc nhóm thấp.</p>
     <p class="meo">💡 Đây là lý do đổi môi trường làm đổi hình ảnh bản thân mà không đổi chính bạn: mốc cục bộ mới, vẫn con người cũ.</p>`),

  slide(D, 20, 'Local — comparisons to friends are the most influential',
    `<p class="y-chinh">🎯 Among all local comparisons, comparisons to friends weigh the most.</p>
     <p class="meo">💡 Put this beside the SEM result from slide 13 and you get the lesson's sharpest claim: the people whose success affects you most are the ones closest to you.</p>`,
    `<p class="y-chinh">🎯 Trong mọi so sánh cục bộ, so với bạn bè là nặng ký nhất.</p>
     <p class="meo">💡 Đặt cạnh kết quả SEM ở slide 13, ta có khẳng định sắc nhất của bài: những người mà thành công của họ tác động tới bạn nhiều nhất lại chính là những người gần bạn nhất.</p>`),

  slide(D, 21, 'Proximity to a standard',
    `<p class="y-chinh">🎯 Comparison concerns spike <strong>near a threshold</strong> — a #1 ranking or any qualitative line.</p>
     <p><span class="nhan">Childhood example</span> — shout "first one to the tree is the coolest person in the world" and the children nearest the tree start tugging at each other. Shout "last one there is a rotten egg" and the children in last place do the tugging.</p>
     <p><span class="nhan">Ranking evidence</span> — rivals ranked #2 and #3 are less willing to maximise joint gains if the opponent gains more; rivals ranked #202 and #203 do not mind (Garcia, Tor & Gonzalez, 2006; Garcia & Tor, 2007).</p>
     <p class="meo">💡 So comparison pressure is not about absolute standing but about distance to a line that matters.</p>`,
    `<p class="y-chinh">🎯 Mối bận tâm so sánh vọt lên khi <strong>ở gần một ngưỡng</strong> — hạng nhất, hoặc bất kỳ lằn ranh nào có ý nghĩa.</p>
     <p><span class="nhan">Ví dụ trò trẻ con</span> — hô "ai tới gốc cây đầu tiên là ngầu nhất thế giới" thì mấy đứa gần gốc cây bắt đầu kéo áo nhau. Hô "đứa cuối cùng là trứng thối" thì mấy đứa đang đội sổ mới là đứa giành nhau.</p>
     <p><span class="nhan">Bằng chứng từ bảng xếp hạng</span> — đối thủ hạng 2 và 3 ít chịu tối đa hoá lợi ích chung nếu điều đó làm đối phương lợi hơn; đối thủ hạng 202 và 203 thì chẳng bận tâm (Garcia, Tor & Gonzalez, 2006; Garcia & Tor, 2007).</p>
     <p class="meo">💡 Vậy áp lực so sánh không nằm ở thứ hạng tuyệt đối mà ở khoảng cách tới một lằn ranh có ý nghĩa.</p>`),

  slide(D, 22, 'Social category lines',
    `<p class="y-chinh">🎯 Comparison also happens <strong>between groups</strong>, and it bites hardest across category lines.</p>
     <p><span class="nhan">The prom example</span> — deciding the music by flipping a coin (heads hip-hop, tails pop) is fine while everyone is simply "high school seniors". But if all the boys want hip-hop and all the girls want pop, the coin flip stops being neutral: it now privileges one social category over another (Garcia & Miller, 2007).</p>
     <p class="meo">💡 Same procedure, different meaning, because the line the decision falls on changed. Worth remembering when your group votes on anything.</p>`,
    `<p class="y-chinh">🎯 So sánh còn xảy ra <strong>giữa các nhóm</strong>, và nó cắn mạnh nhất khi vắt qua ranh giới nhóm.</p>
     <p><span class="nhan">Ví dụ tiệc prom</span> — quyết định nhạc bằng tung đồng xu (mặt ngửa hip-hop, mặt sấp pop) thì ổn khi tất cả chỉ đơn giản là "học sinh cuối cấp". Nhưng nếu toàn bộ con trai muốn hip-hop còn toàn bộ con gái muốn pop, tung đồng xu thôi trung lập: giờ nó ưu ái một nhóm xã hội hơn nhóm kia (Garcia & Miller, 2007).</p>
     <p class="meo">💡 Vẫn thủ tục đó, ý nghĩa lại khác, vì lằn ranh mà quyết định rơi vào đã đổi. Đáng nhớ mỗi khi nhóm bạn bỏ phiếu chuyện gì đó.</p>`),

  slide(D, 23, 'Related phenomenon — the frog pond effect',
    `<p class="y-chinh">🎯 "As a frog, would you rather be in a small pond where you are a big frog, or a large pond where you are a small frog?"</p>
     <p>People generally had a <strong>better academic self-concept</strong> as a big frog in a small pond (top student at a local high school) than as a small frog in a large one (one of many good students at an Ivy League university) — Marsh, Trautwein, Lüdtke & Köller (2008).</p>
     <p class="meo">💡 Note what it does and does not say: it is about self-<em>concept</em>, not about which pond teaches you more. Both halves matter when you pick a place to study or work.</p>`,
    `<p class="y-chinh">🎯 "Nếu là ếch, bạn muốn ở ao nhỏ làm ếch to, hay ở ao lớn làm ếch bé?"</p>
     <p>Nhìn chung người ta có <strong>hình ảnh học thuật về bản thân tốt hơn</strong> khi làm ếch to trong ao nhỏ (đứng đầu một trường trung học địa phương) so với làm ếch bé trong ao lớn (một trong nhiều sinh viên giỏi ở đại học Ivy League) — Marsh, Trautwein, Lüdtke & Köller (2008).</p>
     <p class="meo">💡 Để ý nó nói gì và không nói gì: nó nói về <em>hình ảnh bản thân</em>, không nói ao nào dạy bạn được nhiều hơn. Cả hai vế đều đáng cân khi chọn chỗ học hoặc chỗ làm.</p>`),

  slide(D, 24, 'Related phenomenon — the Dunning-Kruger effect',
    `<p class="y-chinh">🎯 The least experienced and least knowledgeable people are <strong>over-confident</strong>.</p>
     <p>They do not know what they do not know, and are therefore more likely to overestimate their own abilities.</p>
     <p class="meo">💡 It belongs in this lesson because the cure is comparison: you cannot gauge your chess ability without someone to measure against — which is exactly the question the next slide opens with.</p>`,
    `<p class="y-chinh">🎯 Người ít kinh nghiệm và ít hiểu biết nhất lại <strong>tự tin thái quá</strong>.</p>
     <p>Họ không biết là mình không biết, nên dễ đánh giá năng lực bản thân cao hơn thực tế.</p>
     <p class="meo">💡 Nó nằm trong bài này vì thuốc chữa chính là so sánh: bạn không thể đo trình cờ vua của mình nếu chẳng có ai để đối chiếu — đúng câu hỏi mà slide sau mở đầu.</p>`),

  slide(D, 25, 'Conclusions',
    `<p class="y-chinh">🎯 The lesson closes by refusing the easy moral.</p>
     <ul>
       <li>Social comparison is a natural psychological tendency with a powerful influence on how we feel and behave.</li>
       <li>It is <strong>not an ugly phenomenon to be avoided</strong>.</li>
       <li>It has many positive aspects.</li>
       <li>Its engine can provide the push you need to rise to the occasion, raise motivation and make progress toward your goals.</li>
     </ul>
     <p class="meo">💡 Exam-safe summary: comparison is a mechanism, and its effect depends on direction (slide 8), mindset (slide 16) and situation (slides 18–22).</p>`,
    `<p class="y-chinh">🎯 Bài kết lại bằng cách từ chối bài học đạo đức dễ dãi.</p>
     <ul>
       <li>So sánh xã hội là xu hướng tâm lý tự nhiên, ảnh hưởng mạnh tới cách ta cảm nhận và hành xử.</li>
       <li>Nó <strong>không phải hiện tượng xấu xí cần né tránh</strong>.</li>
       <li>Nó có nhiều mặt tích cực.</li>
       <li>Cỗ máy so sánh có thể cho bạn cú đẩy cần thiết để vươn lên đúng lúc, tăng động lực và tiến tới mục tiêu.</li>
     </ul>
     <p class="meo">💡 Tóm tắt an toàn khi thi: so sánh là một cơ chế, tác dụng của nó tuỳ hướng (slide 8), tuỳ tư duy (slide 16) và tuỳ tình huống (slide 18–22).</p>`),

  slide(D, 26, 'Discussion questions',
    `<p class="y-chinh">🎯 Three questions, and what each is really testing.</p>
     <p><span class="nhan">1. What do you compare yourself on — and does everyone use the same dimensions?</span> The answer the lesson wants: dimensions differ because relevance to the self differs (slide 7).</p>
     <p><span class="nhan">2. How can comparisons help you?</span> Use slide 15–16: upward comparison as challenge under a mastery goal or growth mindset.</p>
     <p><span class="nhan">3. A time you compared yourself with your own past performance — upward or downward?</span> Comparing with your past self is temporal comparison; label it by whether the past self did better (upward) or worse (downward), and say what it did to your motivation.</p>`,
    `<p class="y-chinh">🎯 Ba câu hỏi, và mỗi câu thực chất đang kiểm cái gì.</p>
     <p><span class="nhan">1. Bạn so mình ở những chiều nào — mọi người có dùng chung các chiều đó không?</span> Câu trả lời bài học muốn nghe: các chiều khác nhau vì mức liên quan tới bản thân khác nhau (slide 7).</p>
     <p><span class="nhan">2. So sánh giúp được gì cho bạn?</span> Dùng slide 15–16: so sánh lên như một thử thách, dưới mục tiêu làm chủ hoặc tư duy phát triển.</p>
     <p><span class="nhan">3. Lần bạn so mình với chính thành tích quá khứ của mình — lên hay xuống?</span> So với bản thân trong quá khứ là so sánh theo thời gian; gán nhãn theo việc con người cũ làm tốt hơn (lên) hay kém hơn (xuống), rồi nói nó tác động thế nào tới động lực của bạn.</p>`),

  slide(D, 27, 'Discussion questions (cont.)',
    `<p class="y-chinh">🎯 Continuation of the discussion block — another Activity-shaped exercise (15% of the subject).</p>`,
    `<p class="y-chinh">🎯 Phần tiếp của khối thảo luận — lại một bài tập đúng dạng Activity (15% điểm môn).</p>`),

  slide(D, 28, 'Q&A',
    `<p class="y-chinh">🎯 Closing slide. Session I is now complete.</p>
     <p><span class="nhan">Session I in four sentences</span></p>
     <ol>
       <li>A team is a cohesive, purposeful work group (Lesson 1).</li>
       <li>Cooperation is rational only when the game repeats or the situation supports it (Lesson 2).</li>
       <li>Groups shape identity and can decide badly in four named ways (Lesson 3).</li>
       <li>We measure ourselves against others, and the effect depends on direction, mindset and situation (Lesson 4).</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết. Buổi I tới đây là trọn vẹn.</p>
     <p><span class="nhan">Buổi I gói trong bốn câu</span></p>
     <ol>
       <li>Đội là một nhóm làm việc gắn kết và có mục đích (Bài 1).</li>
       <li>Hợp tác chỉ hợp lý khi ván chơi lặp lại hoặc khi tình huống nâng đỡ nó (Bài 2).</li>
       <li>Nhóm nhào nặn bản sắc, và có thể quyết định sai theo bốn cách được gọi tên (Bài 3).</li>
       <li>Ta đo mình bằng người khác, và tác động tuỳ hướng so, tuỳ tư duy, tuỳ tình huống (Bài 4).</li>
     </ol>`),

  books([
    ['piercy', 'chương về social comparison và self-evaluation', 'chương về so sánh xã hội và tự đánh giá'],
    ['lumen', 'phần self-concept & motivation', 'phần hình ảnh bản thân & động lực'],
  ]),

  bi(
    `<h3>✅ Why this lesson matters for your own marks</h3>
     <p>Three ideas here describe the room you are sitting in: the N-Effect (a big class lowers comparison pressure), the frog pond effect (your self-concept follows your local group), and SEM (a close friend's success stings more). None of them appeared anywhere in the previous version of this course.</p>`,
    `<h3>✅ Vì sao bài này liên quan trực tiếp tới điểm của bạn</h3>
     <p>Ba ý ở đây mô tả đúng căn phòng bạn đang ngồi: hiệu ứng N (lớp đông làm giảm áp lực so sánh), hiệu ứng ao làng (hình ảnh bản thân bám theo nhóm cục bộ), và SEM (thành công của bạn thân lại nhói hơn). Không ý nào trong số đó từng xuất hiện ở phiên bản cũ của khoá học này.</p>`),
].join('\n');
