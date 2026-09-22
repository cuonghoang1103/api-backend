/**
 * NWC204 · Chapter 15 — Network Security Fundamentals (Cisco Module 16).
 * FLM buổi 49 (15.1 + 15.2) và buổi 50 (15.3 + 15.4 + 15.5).
 * LO: buổi 49 = CLO7 + CLO9; buổi 50 = CLO7 + **CLO10**.
 *
 * Slide: scripts/slides-src/nwc204-ch15.mjs → deck 'nwc204-ch15', 26 ảnh.
 *
 * ⚠️ Buổi 50 là buổi DUY NHẤT trong cả 60 buổi có CLO10 trong cột LO — đã nêu
 *    trong cả hai bài.
 *
 * ★ = phần cuongthai.com bổ sung ngoài Module 16, lấy từ việc vận hành một VPS
 *   công khai chạy Docker + nginx + Postgres (ghi trong CLAUDE.md, 18/09/2026):
 *   - siết sshd bằng drop-in 01-no-password.conf: PasswordAuthentication no,
 *     KbdInteractiveAuthentication no, PermitRootLogin prohibit-password
 *   - BẪY THỨ TỰ drop-in: sshd_config giữ GIÁ TRỊ ĐỌC ĐƯỢC ĐẦU TIÊN, glob *.conf
 *     duyệt theo thứ tự chữ cái ⇒ một file 70- nói ngược 50-cloud-init.conf là
 *     vô nghĩa. Triệu chứng đã gặp thật: PermitRootLogin ăn, PasswordAuthentication
 *     KHÔNG ăn — nửa ăn nửa trượt là dấu hiệu va chạm thứ tự chứ không phải sai cú pháp.
 *   - nghiệm thu bằng `sshd -T | grep ^passwordauthentication`, KHÔNG bằng `cat`
 *   - fail2ban chỉ là lớp giảm ồn, không phải ổ khoá
 *   - đừng publish cổng 5432 của Postgres — nối về Chương 10 (172.18.0.0/16 là
 *     RFC 1918, không router nào trên Internet mang tuyến tới nó)
 *   - container chạy non-root thì KHÔNG bind được cổng dưới 1024
 *
 * ⚠️ Bất thường của bảng gốc, đã nêu trong bài, KHÔNG tự sửa bảng gốc:
 *   - Buổi 49 mang CQ17.1 "Why basic security measure are necessary on network
 *     devices?" → khớp mục 15.4 Device Security, tức nội dung buổi 50.
 *   - Buổi 50 mang CQ17.2 "How to detect vulnerabilities on the network and
 *     technical mitigation?" → khớp 15.1–15.3, tức cả hai buổi.
 *   - Ba câu khác của chương này rơi vào buổi của CHƯƠNG 16: buổi 52 CQ18.1,
 *     buổi 54 CQ18.3, buổi 55 CQ19.1. (Buổi 51 CQ17.3 và buổi 53 CQ18.2 cũng
 *     là nội dung chương 15, nêu kèm.)
 *   - Buổi 49 ghi LO "CLO7, CLO9" còn buổi 50 ghi "CLO7, CLO10" — lệch CLO9/CLO10
 *     giữa hai nửa của cùng một chương.
 *
 * ⚠️ Đây là bài PHÒNG THỦ. Không có hướng dẫn tấn công: nêu kiểu tấn công đủ để
 *    NHẬN RA và CHẶN, không đưa công cụ hay lệnh để thực hiện lên hệ thống người khác.
 *
 * ⚠️ File này CHỈ chứa chương 15. Đừng sửa NWC204.mjs ở đây.
 * ⚠️ Mỗi khối content PHẢI kết thúc bằng `].join('\n'),` — nếu không thì
 *    lesson.content là ARRAY và academy-ra-soat.mjs đổ ở dòng 52.
 */
import { registerDeck, walk, walkHead, bi, cq } from './_slides.mjs';

const D = registerDeck('nwc204-ch15', {
  code: 'NWC204',
  en: 'Network Security Fundamentals',
  vi: 'Nền tảng an ninh mạng',
  total: 26,
});

/* ──────────────────────── Lesson 15.1 — session 49 ─────────────────────── */

const L1 = {
  title: '15.1 - Threats, vulnerabilities and the three families of network attack (FLM session 49)|||15.1 - Mối đe doạ, lỗ hổng và ba họ tấn công mạng (buổi 49 của FLM)',
  slug: 'nwc204-15-1-moi-de-doa-va-cac-kieu-tan-cong',
  type: 'DOCUMENT',
  description: 'Buổi 49: năm từ không đồng nghĩa (tài sản, lỗ hổng, mối đe doạ, cách khai thác, rủi ro), ba loại lỗ hổng theo Cisco (công nghệ, cấu hình, chính sách) và vì sao loại giữa là loại bạn sửa được ngay hôm nay, mã độc phân theo thứ nó cần ở bạn — riêng worm thì không cần gì cả, rồi ba họ tấn công theo đúng thứ tự xảy ra: do thám, truy cập, từ chối dịch vụ. Viết từ phía phòng thủ: nhận ra trong log và chặn, không có hướng dẫn tấn công. Kèm phần ★ của cuongthai.com về mặt trong và mặt ngoài của một máy chủ công khai.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 15 · Lesson 15.1 · FLM session 49 of 60 · CLO7, CLO9 · Cisco Module 16</span>
<h2>The chapter that assumes somebody is already looking</h2>
<p class="lead">After this lesson you can use the words asset, vulnerability, threat, exploit and risk without blurring them, sort any incident into one of three attack families and say what that classification rules out, and explain why a firewall is blind to the traffic that worries an experienced administrator most.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 49 — "15. Network Security Fundamentals · 15.1 Security Threats and Vulnerabilities · 15.2 Network Attacks"; LO: CLO7, CLO9; ITU: T; tài liệu "Module 16: Network Security Fundamentals", nhiệm vụ "Read Module 16"</p>
<p><strong>Opening question.</strong> A server with a public address has been online for a week. Nobody has announced it, nobody has linked to it, and the only people who know it exists are you. You open the authentication log and find this shape of entry, over and over, from addresses in a dozen countries:</p>
<pre><code class="language-plaintext">Failed password for invalid user admin from 45.x.x.x port 51244 ssh2
Failed password for invalid user test from 193.x.x.x port 40112 ssh2
Failed password for root from 61.x.x.x port 58330 ssh2</code></pre>
<p>Nobody told them. So: how did they find it, is this an attack, and which of the two possible fixes — banning the addresses, or removing passwords entirely — actually ends it?</p>
<div class="callout"><strong>This chapter is where CLO7 lives.</strong> Read it in full: <em>"Implement basic security measures by applying device hardening and configuration techniques to protect network devices and communications."</em> The verb is <strong>implement</strong>, and the object is <strong>device hardening and configuration</strong>. Nothing in that sentence is about recognising attack names — it is about the state a device is left in. Lesson 15.2 is where that verb gets exercised; this lesson gives you the vocabulary you need to justify each change.</div>
<div class="note-ct"><p><strong>How this lesson is written.</strong> Everything in section 15.2 is presented from the <strong>defending</strong> side: what an attack looks like in your logs, what it abuses, and which configuration removes it. There are no tools or commands for carrying one out. That is a deliberate limit, not an omission — recognising and blocking is the examinable skill and the useful one.</p></div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 16, drawn from running a public VPS rather than quoted from a book.</p>`,
      `<span class="eyebrow">NWC204 · Chương 15 · Bài 15.1 · Buổi 49/60 của FLM · CLO7, CLO9 · Cisco Module 16</span>
<h2>Chương giả định rằng đã có người đang nhìn vào bạn</h2>
<p class="lead">Học xong bài này bạn dùng được năm chữ tài sản, lỗ hổng, mối đe doạ, cách khai thác và rủi ro mà không làm nhoè chúng vào nhau, xếp được một sự cố bất kỳ vào một trong ba họ tấn công và nói được cách xếp đó loại trừ điều gì, và giải thích được vì sao tường lửa mù trước đúng thứ lưu lượng làm người quản trị có kinh nghiệm lo nhất.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 49 — "15. Network Security Fundamentals · 15.1 Security Threats and Vulnerabilities · 15.2 Network Attacks"; LO: CLO7, CLO9; ITU: T; tài liệu "Module 16: Network Security Fundamentals", nhiệm vụ "Read Module 16"</p>
<p><strong>Câu hỏi mở đầu.</strong> Một máy chủ có địa chỉ công khai đã chạy được một tuần. Không ai thông báo, không ai đặt liên kết tới, và người duy nhất biết nó tồn tại là bạn. Bạn mở nhật ký đăng nhập và thấy dạng dòng này, lặp đi lặp lại, từ địa chỉ của cả chục quốc gia:</p>
<pre><code class="language-plaintext">Failed password for invalid user admin from 45.x.x.x port 51244 ssh2
Failed password for invalid user test from 193.x.x.x port 40112 ssh2
Failed password for root from 61.x.x.x port 58330 ssh2</code></pre>
<p>Chẳng ai mách họ cả. Vậy: họ tìm ra nó bằng cách nào, đây có phải một cuộc tấn công không, và trong hai cách sửa khả dĩ — chặn các địa chỉ đó, hay bỏ hẳn đăng nhập bằng mật khẩu — cách nào mới thật sự chấm dứt chuyện này?</p>
<div class="callout"><strong>Chương này là chỗ CLO7 nằm.</strong> Đọc đủ nguyên văn: <em>"Implement basic security measures by applying device hardening and configuration techniques to protect network devices and communications."</em> Động từ là <strong>implement</strong> (thực hiện), còn tân ngữ là <strong>device hardening and configuration</strong> (làm cứng và cấu hình thiết bị). Không có chữ nào trong câu đó nói về việc thuộc tên các kiểu tấn công — nó nói về TRẠNG THÁI mà thiết bị được để lại. Bài 15.2 là nơi động từ ấy được thực hành; bài này cho bạn bộ từ vựng để biện hộ cho từng thay đổi.</div>
<div class="note-ct"><p><strong>Bài này được viết theo hướng nào.</strong> Toàn bộ mục 15.2 được trình bày từ phía <strong>PHÒNG THỦ</strong>: một cuộc tấn công hiện ra thế nào trong log của bạn, nó lợi dụng điều gì, và cấu hình nào gỡ bỏ được điều đó. Không có công cụ hay câu lệnh nào để thực hiện tấn công. Đó là một giới hạn cố ý chứ không phải thiếu sót — nhận ra và chặn mới là kỹ năng được chấm, và cũng là kỹ năng dùng được.</p></div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 16, lấy từ việc vận hành một VPS công khai chứ không trích lại sách.</p>`,
    ),

    walkHead('nwc204-ch15', 1, 10,
      'Slides 1-10 cover FLM session 49: 15.1 Security Threats and Vulnerabilities, and 15.2 Network Attacks.',
      'Slide 1-10 là buổi 49 của FLM: 15.1 Mối đe doạ và lỗ hổng, và 15.2 Các kiểu tấn công mạng.'),

    walk('nwc204-ch15', [
      [1, 'Cover - Chapter 15, Network Security Fundamentals',
        `<p>Chapter 15 is <strong>Cisco Module 16</strong>, and FPT gives it two sessions, both marked <strong>ITU: T</strong> (theory). There is no lab attached to it.</p>
<ul>
<li>Session 49 — 15.1 Security Threats and Vulnerabilities, 15.2 Network Attacks. LO: <strong>CLO7, CLO9</strong>.</li>
<li>Session 50 — 15.3 Network Attack Mitigation, 15.4 Device Security, 15.5 Integrate AI Tools (self learning). LO: <strong>CLO7, CLO10</strong>.</li>
<li>Student materials and task for both: "Module 16: Network Security Fundamentals" and "Read Module 16".</li>
</ul>
<p><strong>Why this chapter matters more than its two sessions suggest.</strong> Every chapter before it explained how to make something work. This is the first one about keeping it working when somebody would prefer it did not — and for anyone who runs a machine with a public address, it is the most immediately useful chapter in the course.</p>`,
        `<p>Chương 15 là <strong>Module 16 của Cisco</strong>, và trường xếp cho nó hai buổi, cả hai đều đánh <strong>ITU: T</strong> (lý thuyết). Không có bài lab nào kèm theo.</p>
<ul>
<li>Buổi 49 — 15.1 Mối đe doạ và lỗ hổng, 15.2 Các kiểu tấn công mạng. LO: <strong>CLO7, CLO9</strong>.</li>
<li>Buổi 50 — 15.3 Giảm thiểu tấn công, 15.4 An ninh thiết bị, 15.5 Dùng công cụ AI (tự học). LO: <strong>CLO7, CLO10</strong>.</li>
<li>Tài liệu và nhiệm vụ của cả hai buổi: "Module 16: Network Security Fundamentals" và "Read Module 16".</li>
</ul>
<p><strong>Vì sao chương này quan trọng hơn hai buổi của nó.</strong> Mọi chương trước đều giải thích cách làm cho một thứ chạy được. Đây là chương đầu tiên nói về việc giữ cho nó chạy khi có người muốn nó đừng chạy — và với bất kỳ ai đang vận hành một cái máy có địa chỉ công khai, đây là chương dùng được ngay nhất của cả môn.</p>`],

      [2, 'Two sessions, and the only CLO10 in the course',
        `<p>Read the two LO lines side by side. Session 49: <strong>CLO7, CLO9</strong>. Session 50: <strong>CLO7, CLO10</strong>. One chapter, two days apart, and the AI outcome changes between them.</p>
<p><strong>Session 50 is the only session out of sixty whose LO column names CLO10.</strong> That is worth knowing because of what CLO10 says: <em>"Students use AI and digital tools to collaborate, design, and present small network projects. The approach blends dialogue-based assessment with self-directed learning."</em> It is the outcome about <em>presenting and defending</em>, assessed by conversation rather than by a written answer.</p>
<p><strong>What to do with that.</strong> Prepare section 15.4 to be spoken aloud. In a dialogue-based assessment you are asked "why", then asked "why" again about your answer — and a hardening step you cannot justify twice will not survive it. Every command in Lesson 15.2 is therefore paired with the verification that proves it took effect, because "I ran it" is a weaker answer than "I ran it and here is what the device then reported".</p>
<p class="ghi-chu">Quoted as published. The syllabus is not corrected here, only described.</p>`,
        `<p>Đọc hai dòng LO cạnh nhau. Buổi 49: <strong>CLO7, CLO9</strong>. Buổi 50: <strong>CLO7, CLO10</strong>. Cùng một chương, cách nhau hai ngày, mà chuẩn đầu ra về AI thì đổi.</p>
<p><strong>Buổi 50 là buổi DUY NHẤT trong sáu mươi buổi có CLO10 ở cột LO.</strong> Điều đó đáng biết vì nội dung của CLO10: <em>"Students use AI and digital tools to collaborate, design, and present small network projects. The approach blends dialogue-based assessment with self-directed learning."</em> Đó là chuẩn đầu ra về việc <em>trình bày và bảo vệ</em>, được chấm bằng đối thoại chứ không bằng bài viết.</p>
<p><strong>Làm gì với điều đó.</strong> Hãy chuẩn bị mục 15.4 để NÓI THÀNH LỜI. Trong một buổi chấm bằng đối thoại, bạn bị hỏi "vì sao", rồi lại bị hỏi "vì sao" về chính câu trả lời vừa rồi — và một bước làm cứng mà bạn không biện hộ được tới lần thứ hai thì không qua nổi. Vì vậy mọi câu lệnh ở bài 15.2 đều đi kèm phép nghiệm thu chứng minh nó đã có hiệu lực, bởi "tôi đã chạy lệnh đó" là câu trả lời yếu hơn "tôi đã chạy, và đây là thứ thiết bị báo lại sau đó".</p>
<p class="ghi-chu">Trích nguyên văn như đã công bố. Ở đây không sửa syllabus, chỉ mô tả lại.</p>`],

      [3, '15.1 Where a threat comes from decides what can stop it',
        `<p>Module 16 sorts threats by <strong>origin</strong>, and the reason is practical rather than tidy: origin decides which of your defences is even in a position to see the traffic.</p>
<p><strong>External</strong> means no account and no foothold yet. The attacker arrives over the Internet, over wireless, or over a VPN, and must cross a boundary you control. This is the traffic a firewall exists for.</p>
<p><strong>Internal</strong> means already inside — an employee, a contractor, a guest on the Wi-Fi, a laptop that came back from a cafe carrying something, or a credential that was stolen last month and still works. The perimeter has already been passed, legitimately.</p>
<p><strong>The sentence to remember: a firewall filters what CROSSES it, and two machines on the same LAN never cross it.</strong> That single fact is the entire reason section 15.4 Device Security exists. If the network cannot protect a device from its neighbours, the device has to protect itself — which means being configured so that merely being on the same network is not enough to log in.</p>
<p>★ On a single VPS the distinction collapses in a way worth noticing: every container is "internal" to the host that runs it, which is exactly why Lesson 15.2 spends time on what a container may and may not reach.</p>`,
        `<p>Module 16 phân loại mối đe doạ theo <strong>nguồn gốc</strong>, và lý do là thực dụng chứ không phải cho gọn: nguồn gốc quyết định lớp phòng thủ nào của bạn còn ở vị trí nhìn thấy được luồng lưu lượng đó.</p>
<p><strong>Bên ngoài</strong> nghĩa là chưa có tài khoản, chưa có chỗ đặt chân. Kẻ tấn công đến qua Internet, qua sóng không dây, hoặc qua VPN, và buộc phải vượt một ranh giới do bạn kiểm soát. Đây chính là thứ lưu lượng mà tường lửa sinh ra để lo.</p>
<p><strong>Bên trong</strong> nghĩa là đã ở trong rồi — một nhân viên, một người làm thuê ngoài, một khách dùng nhờ Wi-Fi, một cái laptop mang về từ quán cà phê kèm theo thứ gì đó, hoặc một thông tin đăng nhập bị lấy cắp tháng trước mà vẫn còn dùng được. Vành đai đã bị vượt qua rồi, và vượt một cách hợp lệ.</p>
<p><strong>Câu cần nhớ: tường lửa lọc thứ ĐI QUA nó, mà hai cái máy trên cùng một LAN thì không bao giờ đi qua nó.</strong> Đúng một sự thật đó là toàn bộ lý do mục 15.4 An ninh thiết bị tồn tại. Nếu mạng không bảo vệ nổi một thiết bị trước chính láng giềng của nó, thì thiết bị phải tự bảo vệ mình — nghĩa là phải được cấu hình sao cho việc chỉ cần nằm cùng mạng là không đủ để đăng nhập.</p>
<p>★ Trên một con VPS đơn lẻ, ranh giới này sụp đổ theo một cách đáng để ý: mọi container đều là "bên trong" đối với cái host đang chạy nó, và đó đúng là lý do bài 15.2 dành thời gian cho chuyện một container được và không được với tới cái gì.</p>`],

      [4, '15.1 Five words that are not synonyms',
        `<p>These five are used interchangeably in conversation and they are not interchangeable at all. Keeping them apart is what turns a worry into a task.</p>
<ul>
<li><strong>Asset</strong> — anything worth protecting. A database, a service, a device, a reputation.</li>
<li><strong>Vulnerability</strong> — a weakness. It exists whether or not anybody has noticed it. Discovering one does not create it.</li>
<li><strong>Threat</strong> — someone or something that could act on that weakness. A threat with no vulnerability to act on is harmless.</li>
<li><strong>Exploit</strong> — the concrete method that turns the weakness into an entry.</li>
<li><strong>Risk</strong> — likelihood combined with impact. It is the only one of the five you can decide to <em>accept</em> on purpose, and accepting it deliberately is a legitimate answer.</li>
</ul>
<p><strong>Why precision pays.</strong> "The server is vulnerable" cannot be acted on: nothing in it says what to change. "Password login is enabled on a host with a public address, and the log shows attempts every hour" names the vulnerability, the threat and the evidence in one line — and the fix follows from the sentence itself.</p>`,
        `<p>Năm chữ này bị dùng lẫn lộn trong lúc nói chuyện, mà chúng hoàn toàn không thay thế được cho nhau. Giữ chúng tách bạch chính là thứ biến một nỗi lo thành một việc cụ thể.</p>
<ul>
<li><strong>Tài sản (asset)</strong> — bất cứ thứ gì đáng bảo vệ. Một cơ sở dữ liệu, một dịch vụ, một thiết bị, một uy tín.</li>
<li><strong>Lỗ hổng (vulnerability)</strong> — một điểm yếu. Nó tồn tại bất kể có ai nhận ra hay không. Việc phát hiện ra nó không tạo ra nó.</li>
<li><strong>Mối đe doạ (threat)</strong> — ai đó hoặc thứ gì đó có thể ra tay lên điểm yếu ấy. Một mối đe doạ mà không có lỗ hổng nào để ra tay thì vô hại.</li>
<li><strong>Cách khai thác (exploit)</strong> — phương pháp cụ thể biến điểm yếu thành một lối vào.</li>
<li><strong>Rủi ro (risk)</strong> — khả năng xảy ra nhân với mức thiệt hại. Đây là thứ duy nhất trong năm cái mà bạn có thể quyết định <em>chấp nhận</em> một cách có chủ ý, và chấp nhận có cân nhắc là một câu trả lời hợp lệ.</li>
</ul>
<p><strong>Vì sao nói cho chính xác thì được lợi.</strong> Câu "máy chủ có lỗ hổng" không hành động được: trong đó không có gì nói phải đổi cái gì. Câu "đăng nhập bằng mật khẩu đang bật trên một máy có địa chỉ công khai, và log cho thấy có người thử mỗi giờ" gọi tên cả lỗ hổng, mối đe doạ lẫn bằng chứng trong một dòng — và cách sửa tự suy ra từ chính câu đó.</p>`],

      [5, '15.1 Cisco groups vulnerabilities into three kinds',
        `<p>Module 16 uses three categories, and the value of the split is that each category is fixed by a different kind of work.</p>
<ul>
<li><strong>Technological</strong> — a flaw in a protocol or an operating system. Fixed by patching, and by preferring protocols that authenticate.</li>
<li><strong>Configuration</strong> — a default password still in place, an unused service still listening, a management interface reachable from anywhere. Fixed by hardening, which is section 15.4.</li>
<li><strong>Policy</strong> — no rule about who gets access, or no rule about removing it when someone leaves. Fixed by people and process; no command helps.</li>
</ul>
<p><strong>The middle row is the one you can fix today, on every device you own, for nothing.</strong> It needs no vendor, no purchase and no permission. And in small networks it is where most real incidents begin — not at an exotic protocol flaw, but at something that was left as it came out of the box. That is precisely why the syllabus gives a whole section to device hardening and none at all to writing exploits.</p>
<p class="ghi-chu">Notice also that the three categories map onto three different people. Technological is the vendor's problem until you patch. Configuration is yours. Policy is the organisation's.</p>`,
        `<p>Module 16 dùng ba nhóm, và cái hay của cách chia này là mỗi nhóm được sửa bằng một loại công việc khác nhau.</p>
<ul>
<li><strong>Công nghệ</strong> — một khiếm khuyết trong giao thức hoặc hệ điều hành. Sửa bằng vá lỗi, và bằng cách ưu tiên những giao thức có xác thực.</li>
<li><strong>Cấu hình</strong> — mật khẩu mặc định còn nguyên, một dịch vụ không dùng vẫn đang nghe, một giao diện quản trị với tới được từ khắp nơi. Sửa bằng làm cứng thiết bị, tức mục 15.4.</li>
<li><strong>Chính sách</strong> — không có quy định ai được cấp quyền, hoặc không có quy định thu hồi quyền khi có người nghỉ. Sửa bằng con người và quy trình; không câu lệnh nào giúp được.</li>
</ul>
<p><strong>Hàng giữa là hàng bạn sửa được ngay hôm nay, trên mọi thiết bị bạn có, mà không tốn đồng nào.</strong> Nó không cần nhà cung cấp, không cần mua, không cần xin phép. Và trong các mạng nhỏ thì phần lớn sự cố thật bắt đầu ở đó — không phải ở một khiếm khuyết giao thức kỳ lạ nào, mà ở một thứ được để nguyên như lúc mới bóc hộp. Đó đúng là lý do syllabus dành hẳn một mục cho việc làm cứng thiết bị và không dành mục nào cho việc viết mã khai thác.</p>
<p class="ghi-chu">Cũng để ý rằng ba nhóm này ứng với ba người khác nhau. Công nghệ là việc của nhà cung cấp, cho tới khi bạn vá. Cấu hình là việc của bạn. Chính sách là việc của tổ chức.</p>`],

      [6, '15.1 Malware, sorted by what it needs from you',
        `<p>The usual list — virus, worm, trojan — is easier to remember if you sort it by what it requires from a human being.</p>
<ul>
<li><strong>Virus</strong> — attaches itself to a file and needs somebody to run it. Human action required.</li>
<li><strong>Worm</strong> — <strong>spreads by itself</strong> across the network. No click, no human, no mistake needed.</li>
<li><strong>Trojan</strong> — arrives disguised as something the user wanted. Human action required, and freely given.</li>
<li><strong>Ransomware</strong> — arrives by any of the above, then encrypts. Backups are the only defence that works after the fact.</li>
<li><strong>Spyware</strong> — installs quietly and reports outwards. Its giveaway is outbound connections nobody asked for.</li>
</ul>
<p><strong>The row that changes network design is worm.</strong> Because it needs no click, "our users are careful" is not a defence against it, and neither is training. What does work is <strong>segmentation</strong>: a worm can only reach what the network permits it to reach. This is the first place in the course where a security requirement changes a topology rather than a setting.</p>
<p>It is also the argument for the last row of the mitigation table in Lesson 15.2: outbound filtering. Spyware and a compromised host are both visible on the way <em>out</em>, and a firewall that only inspects inbound traffic will never see either.</p>`,
        `<p>Danh sách quen thuộc — virus, worm, trojan — dễ nhớ hơn nhiều nếu bạn sắp nó theo thứ mà nó cần ở một con người.</p>
<ul>
<li><strong>Virus</strong> — bám vào một tệp và cần có người chạy tệp đó. Bắt buộc phải có hành động của người.</li>
<li><strong>Worm (sâu mạng)</strong> — <strong>tự lan</strong> qua mạng. Không cần cú bấm nào, không cần người nào, không cần ai phạm sai lầm nào.</li>
<li><strong>Trojan</strong> — đến trong lốt một thứ mà người dùng đang muốn. Vẫn cần hành động của người, và người ta tự nguyện làm.</li>
<li><strong>Ransomware (mã độc tống tiền)</strong> — vào bằng bất kỳ đường nào ở trên, rồi mã hoá dữ liệu. Sau khi đã dính thì bản sao lưu là cách chống duy nhất còn tác dụng.</li>
<li><strong>Spyware (phần mềm gián điệp)</strong> — cài đặt lặng lẽ rồi báo cáo ra ngoài. Dấu hiệu lộ ra của nó là những kết nối đi RA mà không ai yêu cầu.</li>
</ul>
<p><strong>Hàng làm thay đổi cách thiết kế mạng là worm.</strong> Vì nó không cần cú bấm nào, câu "người dùng của mình cẩn thận" không phải là một lớp phòng thủ trước nó, và tập huấn cũng vậy. Thứ có tác dụng là <strong>phân đoạn mạng</strong>: một con worm chỉ với tới được đúng những gì mạng cho phép nó với tới. Đây là chỗ đầu tiên trong cả môn mà một yêu cầu an ninh làm đổi cấu trúc mạng chứ không chỉ đổi một thiết lập.</p>
<p>Nó cũng là lý lẽ cho hàng cuối của bảng giảm thiểu ở bài 15.2: lọc chiều đi ra. Cả spyware lẫn một máy đã bị chiếm đều lộ ra ở chiều <em>ra</em>, và một tường lửa chỉ soi lưu lượng đi vào sẽ không bao giờ thấy cái nào trong hai.</p>`],

      [7, '15.2 Three families of attack, in the order they happen',
        `<p>Module 16 sorts attacks into three families: <strong>reconnaissance</strong>, <strong>access</strong> and <strong>denial of service</strong>. They are not three unrelated lists — for the first two, they are usually three stages of the same effort.</p>
<p><strong>Why the order matters to a defender: step 1 is noisy and harmless, step 2 is quiet and fatal.</strong> Reconnaissance produces failed lookups and refused connections; it breaks nothing, and it is the only free warning you ever get. Access produces almost nothing in the logs, because a successful login looks exactly like a successful login.</p>
<p><strong>A consequence worth thinking about.</strong> A firewall that silently DROPs rather than REJECTs is quieter on the wire, and it also removes your own early warning — you no longer see the probe, because nothing answers it. Neither choice is wrong; the point is that it is a choice, with a cost on both sides.</p>
<p><strong>Denial of service is the odd one out.</strong> It skips both earlier stages entirely: no reconnaissance is needed, no credential is needed, nothing is entered. That is exactly why it is the hardest of the three to prevent, and why the defence for it looks nothing like the defence for the other two.</p>`,
        `<p>Module 16 xếp các cuộc tấn công vào ba họ: <strong>do thám</strong>, <strong>truy cập</strong> và <strong>từ chối dịch vụ</strong>. Đó không phải ba danh sách rời nhau — với hai họ đầu, chúng thường là ba giai đoạn của cùng một nỗ lực.</p>
<p><strong>Vì sao thứ tự quan trọng với người phòng thủ: bước 1 thì ồn ào mà vô hại, bước 2 thì im lặng mà chí tử.</strong> Do thám sinh ra những lần tra cứu hỏng và những kết nối bị từ chối; nó không làm hỏng gì cả, và nó là lời cảnh báo miễn phí duy nhất bạn từng nhận được. Truy cập thì gần như không để lại gì trong log, bởi một lần đăng nhập thành công trông y hệt một lần đăng nhập thành công.</p>
<p><strong>Một hệ quả đáng nghĩ.</strong> Một tường lửa lặng lẽ DROP thay vì REJECT thì êm hơn trên đường truyền, và nó cũng xoá luôn hệ thống cảnh báo sớm của chính bạn — bạn không còn thấy cú dò nữa, vì không có gì đáp lại nó. Không lựa chọn nào sai; điều đáng nói là đó là một LỰA CHỌN, và cả hai phía đều có cái giá.</p>
<p><strong>Từ chối dịch vụ là kẻ lạc loài.</strong> Nó bỏ qua hoàn toàn cả hai giai đoạn trước: không cần do thám, không cần thông tin đăng nhập, không ai vào bên trong cả. Đó đúng là lý do nó khó ngăn nhất trong ba họ, và là lý do cách chống nó chẳng giống gì cách chống hai họ kia.</p>`],

      [8, '15.2 Reconnaissance, seen from the defending side',
        `<p>Reconnaissance is mapping what exists before touching anything: which addresses answer, which ports are open, which versions are running.</p>
<p><strong>The uncomfortable part is that it uses ordinary tools.</strong> The school's own constructive question <strong>CQ18.2</strong> asks which attack type "may involve the use of tools such as <code>nslookup</code> and <code>fping</code>" — and both of those are diagnostic tools you met in Chapter 12 and Chapter 14. A tool is not an attack. Pointing it at something that is not yours is.</p>
<p><strong>What it looks like in your logs:</strong> many refused connections from one source, or one probe each to many ports, or name lookups for hosts that do not exist. ★ On a public VPS this is constant background noise rather than a targeted event — which is the honest answer to the opening question of this lesson. Nobody told them your address; they enumerated it, along with everybody else's.</p>
<p><strong>What actually reduces it:</strong> expose fewer things. A service that is not reachable cannot be surveyed, and a port that is not published does not appear in anyone's list. That is the whole of the least-exposure argument, and Lesson 15.2 turns it into a concrete rule about database ports.</p>`,
        `<p>Do thám là việc vẽ ra bản đồ những gì đang tồn tại trước khi động vào bất cứ thứ gì: địa chỉ nào có đáp, cổng nào đang mở, phiên bản nào đang chạy.</p>
<p><strong>Phần khó chịu là nó dùng toàn công cụ bình thường.</strong> Chính câu hỏi kiến tạo <strong>CQ18.2</strong> của trường hỏi kiểu tấn công nào "may involve the use of tools such as <code>nslookup</code> and <code>fping</code>" — mà cả hai đều là công cụ chẩn đoán bạn đã gặp ở Chương 12 và Chương 14. Một công cụ không phải là một cuộc tấn công. Chĩa nó vào thứ không phải của mình thì mới là.</p>
<p><strong>Nó hiện ra thế nào trong log của bạn:</strong> rất nhiều kết nối bị từ chối từ một nguồn, hoặc mỗi cổng một cú dò trên rất nhiều cổng, hoặc những lần tra tên cho các máy không tồn tại. ★ Trên một VPS công khai thì đây là tiếng ồn nền liên tục chứ không phải một sự kiện nhắm vào bạn — và đó là câu trả lời thành thật cho câu hỏi mở đầu bài này. Không ai mách họ địa chỉ của bạn cả; họ quét ra nó, cùng với địa chỉ của tất cả mọi người khác.</p>
<p><strong>Thứ thật sự làm nó giảm đi:</strong> phơi ra ít thứ hơn. Một dịch vụ không với tới được thì không thể bị khảo sát, và một cổng không được công bố thì không xuất hiện trong danh sách của ai cả. Đó là toàn bộ lý lẽ phơi-ra-ít-nhất, và bài 15.2 biến nó thành một quy tắc cụ thể về cổng cơ sở dữ liệu.</p>`],

      [9, '15.2 Access attacks - four shapes worth recognising',
        `<p>Access attacks use what reconnaissance found in order to get in. Four shapes cover most of them, and each has a configuration answer.</p>
<ul>
<li><strong>Password attacks</strong> abuse guessable or reused credentials. Removed by keys instead of passwords, and reduced by rate limits.</li>
<li><strong>Trust exploitation</strong> abuses hosts that are trusted because of <em>where they are</em> rather than <em>who they are</em>. Removed by authenticating every hop and trusting no address.</li>
<li><strong>Port redirection</strong> uses one compromised host as a stepping stone to reach a second one the attacker could not reach directly. Removed by segmentation and by least privilege per host.</li>
<li><strong>On-path attacks</strong> abuse traffic that can be read or altered in transit. Removed by encryption with a verified identity — encryption alone is not enough if you do not check who you encrypted <em>to</em>.</li>
</ul>
<p><strong>Read the right-hand column and notice what it is made of: configuration.</strong> Every one of those answers is something you set once and leave set. That is the whole argument of section 15.4 — hardening is not a reaction to an attack, it is the state a device should already be in before anything happens.</p>
<p>Spoofing runs underneath all four, at every layer, and for the same reason each time: ARP has no authentication (Chapter 8), IP never verifies its source field (Chapter 7), plain TCP carries no proof of identity (Chapter 13), and a DNS record is unsigned. None of those are bugs. Each protocol was designed for a trusted network and says so, which is why security here is always something <strong>added on top</strong>.</p>`,
        `<p>Tấn công truy cập dùng những gì do thám tìm được để vào bên trong. Bốn dạng dưới đây phủ gần hết, và mỗi dạng có một câu trả lời bằng cấu hình.</p>
<ul>
<li><strong>Tấn công mật khẩu</strong> lợi dụng thông tin đăng nhập đoán được hoặc dùng lại. Gỡ bỏ bằng cách dùng khoá thay mật khẩu, và giảm bớt bằng giới hạn nhịp thử.</li>
<li><strong>Lợi dụng quan hệ tin cậy</strong> lợi dụng những máy được tin vì <em>chúng nằm ở đâu</em> chứ không phải vì <em>chúng là ai</em>. Gỡ bỏ bằng cách xác thực ở từng chặng và không tin địa chỉ nào cả.</li>
<li><strong>Chuyển hướng cổng</strong> dùng một máy đã bị chiếm làm bàn đạp để với tới một máy thứ hai mà kẻ tấn công không với thẳng tới được. Gỡ bỏ bằng phân đoạn mạng và đặc quyền tối thiểu cho từng máy.</li>
<li><strong>Tấn công xen giữa (on-path)</strong> lợi dụng lưu lượng có thể bị đọc hoặc bị sửa trên đường đi. Gỡ bỏ bằng mã hoá CÓ kiểm danh tính — chỉ mã hoá thôi thì chưa đủ nếu bạn không kiểm xem mình đã mã hoá để gửi cho AI THẬT SỰ LÀ AI.</li>
</ul>
<p><strong>Đọc cột bên phải và để ý nó làm bằng gì: bằng cấu hình.</strong> Mọi câu trả lời ở đó đều là thứ bạn đặt một lần rồi để nguyên. Đó là toàn bộ lý lẽ của mục 15.4 — làm cứng thiết bị không phải phản ứng trước một cuộc tấn công, nó là trạng thái mà thiết bị lẽ ra phải ở sẵn trước khi có chuyện gì xảy ra.</p>
<p>Giả mạo (spoofing) chạy bên dưới cả bốn dạng, ở mọi tầng, và mỗi lần đều vì cùng một lý do: ARP không có xác thực nào (Chương 8), IP không bao giờ kiểm trường nguồn (Chương 7), TCP trần không mang bằng chứng danh tính nào (Chương 13), còn một bản ghi DNS thì không được ký. Không cái nào trong đó là lỗi. Mỗi giao thức đều được thiết kế cho một mạng đáng tin và nói thẳng ra điều đó, nên an ninh ở đây luôn là thứ được <strong>thêm vào bên trên</strong>.</p>`],

      [10, '15.2 Denial of service - and why the extra D changes everything',
        `<p>A denial-of-service attack makes a resource unusable by the people entitled to use it. It does not require an account, and it does not require anything to be broken into.</p>
<p><strong>DoS</strong> comes from one source. That makes mitigation genuinely easy: one address to block, one rule, done.</p>
<p><strong>DDoS</strong> — distributed — comes from many sources, and here is the part that matters: <strong>none of those sources is the attacker</strong>. They are real machines belonging to real people, infected and directed. Blocking them blocks innocent users too, and there may be tens of thousands of them.</p>
<p><strong>Why the defence has to happen somewhere else.</strong> If the volume is large enough to fill your link, then by the time the traffic reaches your firewall it has already consumed the thing you were trying to protect. A rule on your own box arrives too late by definition. The defence is capacity and filtering <em>upstream</em>, at the provider, which is why DDoS mitigation is bought rather than configured.</p>
<p class="ghi-chu">Note which property of the three this attacks: availability. Encryption does not help, authentication does not help, and a hardened device is still unreachable. It is the clearest demonstration in the chapter that controls are not interchangeable.</p>`,
        `<p>Tấn công từ chối dịch vụ làm cho một tài nguyên không dùng được đối với những người có quyền dùng nó. Nó không cần tài khoản, và cũng không cần đột nhập vào đâu cả.</p>
<p><strong>DoS</strong> đến từ một nguồn. Điều đó làm việc giảm thiểu thật sự dễ: một địa chỉ để chặn, một luật, xong.</p>
<p><strong>DDoS</strong> — phân tán — đến từ rất nhiều nguồn, và đây mới là chỗ đáng nói: <strong>không nguồn nào trong số đó là kẻ tấn công</strong>. Chúng là những cái máy có thật của những người có thật, bị nhiễm và bị điều khiển. Chặn chúng là chặn luôn người dùng vô tội, mà số ấy có thể lên tới hàng vạn.</p>
<p><strong>Vì sao việc phòng thủ buộc phải diễn ra ở chỗ khác.</strong> Nếu lưu lượng đủ lớn để lấp đầy đường truyền của bạn, thì tới lúc nó chạm tới tường lửa của bạn, nó đã tiêu thụ xong đúng cái thứ bạn đang cố bảo vệ. Một luật đặt trên chính máy của bạn, theo định nghĩa, là đã tới muộn. Cách chống là dung lượng và lọc ở <em>phía trên</em>, tại nhà cung cấp — và đó là lý do chống DDoS là thứ người ta MUA chứ không phải thứ người ta cấu hình.</p>
<p class="ghi-chu">Để ý nó tấn công vào tính chất nào trong ba: tính sẵn sàng. Mã hoá không giúp gì, xác thực không giúp gì, và một thiết bị đã làm cứng thì vẫn cứ là không với tới được. Đây là minh hoạ rõ nhất trong cả chương cho chuyện các biện pháp kiểm soát không thay thế lẫn nhau được.</p>`],
    ]),

    bi(
      `<h3>🗺️ Which family is this, and what does the answer rule out</h3>
<pre><code class="language-mermaid">graph TD
  A["Something odd in the logs"] --&gt; B{"Did anything actually get IN?"}
  B --&gt;|"no, only refused attempts"| C["RECONNAISSANCE · noisy, harmless, constant"]
  B --&gt;|"yes, a session succeeded"| D["ACCESS · check what that account can reach"]
  B --&gt;|"nothing got in, nothing works"| E["DENIAL OF SERVICE · availability, not entry"]
  C --&gt; F["Fix: expose less"]
  D --&gt; G["Fix: revoke, then remove the way in"]
  E --&gt; H["Fix: capacity upstream"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class B ask
  class A,C,F,G,H act
  class D,E bad</code></pre>
<p>The question in the diamond is the only one that matters, and it is answerable from a log. Everything else follows from it — including the fact that the three fixes have nothing in common.</p>`,
      `<h3>🗺️ Đây là họ nào, và câu trả lời loại trừ được điều gì</h3>
<pre><code class="language-mermaid">graph TD
  A["Có gì đó lạ trong log"] --&gt; B{"Có thứ gì thật sự VÀO được không?"}
  B --&gt;|"không, chỉ toàn lần bị từ chối"| C["DO THÁM · ồn ào, vô hại, liên tục"]
  B --&gt;|"có, một phiên đã thành công"| D["TRUY CẬP · xem tài khoản đó với tới được gì"]
  B --&gt;|"không ai vào, mà cũng không chạy"| E["TỪ CHỐI DỊCH VỤ · tính sẵn sàng, không phải lối vào"]
  C --&gt; F["Sửa: phơi ra ít hơn"]
  D --&gt; G["Sửa: thu hồi, rồi bịt đường vào"]
  E --&gt; H["Sửa: dung lượng ở phía trên"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class B ask
  class A,C,F,G,H act
  class D,E bad</code></pre>
<p>Câu hỏi trong hình thoi là câu duy nhất quan trọng, và nó trả lời được chỉ bằng một cái log. Mọi thứ còn lại suy ra từ nó — kể cả sự thật rằng ba cách sửa chẳng có gì chung với nhau.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm - what is actually exposed, and what is knocking</h3>
<p>Three questions, three commands, on a machine you own. None of them touch anybody else's system.</p>
<pre><code class="language-bash">ss -tlnp                                   # what is listening, and on which address
sudo lastb | head -20                       # failed logins that reached this host
sudo journalctl -u ssh --since "1 hour ago" | grep -c "Failed password"</code></pre>
<p>Read <code>ss -tlnp</code> by the <em>address</em> column, not the port:</p>
<pre><code class="language-plaintext">LISTEN 0 4096   0.0.0.0:22     users:(("sshd",pid=812,fd=3))
LISTEN 0 4096 127.0.0.1:5432   users:(("postgres",pid=944,fd=5))</code></pre>
<div class="callout ok"><strong>What each result proves.</strong> <code>0.0.0.0:22</code> means "every interface, including the public one" — reachable from the Internet. <code>127.0.0.1:5432</code> means loopback only — not reachable from anywhere else at all, no firewall needed. That one column is the difference between an asset that is exposed and one that is not, and it is a far more reliable answer than reading a firewall config. A non-zero count from the third command is reconnaissance and password attempts, and on a public host it will never be zero.</div>
<p class="ghi-chu">★ If a service you thought was private shows <code>0.0.0.0</code>, you have found a configuration vulnerability in the Cisco sense of the term — the middle row of the three categories, the free one to fix.</p>`,
      `<h3>🔍 Cách tự kiểm - thực ra đang phơi ra cái gì, và ai đang gõ cửa</h3>
<p>Ba câu hỏi, ba câu lệnh, trên một cái máy của chính bạn. Không câu nào đụng tới hệ thống của người khác.</p>
<pre><code class="language-bash">ss -tlnp                                   # cái gì đang nghe, và nghe trên địa chỉ nào
sudo lastb | head -20                       # những lần đăng nhập hỏng đã tới được máy này
sudo journalctl -u ssh --since "1 hour ago" | grep -c "Failed password"</code></pre>
<p>Đọc <code>ss -tlnp</code> theo cột <em>địa chỉ</em>, đừng đọc theo cổng:</p>
<pre><code class="language-plaintext">LISTEN 0 4096   0.0.0.0:22     users:(("sshd",pid=812,fd=3))
LISTEN 0 4096 127.0.0.1:5432   users:(("postgres",pid=944,fd=5))</code></pre>
<div class="callout ok"><strong>Mỗi kết quả chứng minh điều gì.</strong> <code>0.0.0.0:22</code> nghĩa là "mọi giao diện, kể cả giao diện công khai" — với tới được từ Internet. <code>127.0.0.1:5432</code> nghĩa là chỉ loopback — hoàn toàn không với tới được từ bất cứ đâu khác, không cần tường lửa nào. Đúng một cột đó là ranh giới giữa một tài sản đang bị phơi ra và một tài sản thì không, và nó là câu trả lời đáng tin hơn nhiều so với việc đọc file cấu hình tường lửa. Câu lệnh thứ ba trả về một số khác 0 nghĩa là đang có do thám và thử mật khẩu, và trên một máy công khai thì nó sẽ không bao giờ bằng 0.</div>
<p class="ghi-chu">★ Nếu một dịch vụ bạn tưởng là riêng tư lại hiện <code>0.0.0.0</code> thì bạn vừa tìm ra một lỗ hổng cấu hình theo đúng nghĩa của Cisco — hàng giữa trong ba nhóm, cái nhóm sửa không mất tiền.</p>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 - reading a log full of failed logins as "we are under attack".</strong> <b>Symptom:</b> an urgent escalation over what is, on any public address, permanent background noise. It is reconnaissance plus automated password attempts, aimed at everyone. The question that decides whether it matters is not "how many" but "could any of them possibly succeed" — and if passwords are disabled, the answer is no, at any volume.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 - treating the firewall as the whole defence.</strong> <b>Symptom:</b> a network where every machine trusts every other machine, because "we have a firewall". The firewall only sees what crosses it; two hosts on one LAN never do. This is the assumption that trust exploitation and worms are both built on.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 - confusing vulnerability with risk.</strong> <b>Symptom:</b> a list of forty findings with no order to work through them, so nothing gets fixed. A vulnerability on an isolated test box and the same vulnerability on the public database are the same vulnerability and completely different risks. Sort by likelihood times impact, then start.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 - assuming training defends against worms.</strong> <b>Symptom:</b> money spent on awareness while flat networks stay flat. A worm needs no click, so nobody has to make a mistake for it to spread. Segmentation is the control; training is for trojans and phishing, which is a different row of the table.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 - thinking "nobody knows this address" is a control.</strong> <b>Symptom:</b> a service deployed with defaults because it is "not published anywhere". ★ Measured reality on a public VPS: probes arrive within hours of the address first answering, because address space is enumerated continuously and indiscriminately. Obscurity is not a control; it is the absence of one.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 - đọc một cái log đầy lần đăng nhập hỏng thành "mình đang bị tấn công".</strong> <b>Triệu chứng:</b> một cuộc báo động khẩn cấp về thứ mà trên bất kỳ địa chỉ công khai nào cũng là tiếng ồn nền vĩnh viễn. Đó là do thám cộng với thử mật khẩu tự động, nhắm vào tất cả mọi người. Câu hỏi quyết định chuyện đó có đáng lo hay không không phải "bao nhiêu lần" mà là "có lần nào có khả năng thành công không" — và nếu mật khẩu đã bị tắt thì câu trả lời là không, ở bất kỳ số lượng nào.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 - coi tường lửa là toàn bộ lớp phòng thủ.</strong> <b>Triệu chứng:</b> một mạng mà máy nào cũng tin máy nào, vì "mình có tường lửa rồi". Tường lửa chỉ nhìn thấy thứ ĐI QUA nó; hai máy trên cùng một LAN thì không bao giờ đi qua. Đây chính là giả định mà cả lợi dụng quan hệ tin cậy lẫn worm đều dựng lên trên đó.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 - lẫn lộn lỗ hổng với rủi ro.</strong> <b>Triệu chứng:</b> một danh sách bốn mươi phát hiện mà không có thứ tự nào để làm, nên rốt cuộc không sửa được gì. Một lỗ hổng trên máy thử nghiệm cô lập và đúng lỗ hổng đó trên cơ sở dữ liệu công khai là CÙNG một lỗ hổng mà là hai rủi ro hoàn toàn khác nhau. Hãy sắp theo khả năng xảy ra nhân mức thiệt hại, rồi bắt đầu.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 - tưởng tập huấn người dùng chống được worm.</strong> <b>Triệu chứng:</b> tiền đổ vào đào tạo nhận thức trong khi mạng phẳng vẫn phẳng. Worm không cần cú bấm nào, nên không ai phải phạm sai lầm thì nó mới lan. Biện pháp đúng là phân đoạn mạng; tập huấn là để chống trojan và lừa đảo, mà đó là hàng khác trong bảng.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 - tưởng "không ai biết địa chỉ này" là một biện pháp bảo vệ.</strong> <b>Triệu chứng:</b> một dịch vụ được dựng lên với toàn cấu hình mặc định vì nó "có công bố ở đâu đâu". ★ Thực tế đo được trên một VPS công khai: các cú dò tới trong vòng vài giờ kể từ lúc địa chỉ bắt đầu đáp, bởi không gian địa chỉ bị quét liên tục và không phân biệt ai với ai. Giấu địa chỉ không phải một biện pháp bảo vệ; nó là sự vắng mặt của biện pháp.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> Classify each of these into asset, vulnerability, threat, exploit or risk, and then say which single one of the five you would report to a manager. (a) The database holds every customer record. (b) Password login is enabled on the public SSH port. (c) Automated scanners probe that port hourly. (d) A working credential-guessing script. (e) "If they get in, we lose every record."</p>
<div class="dap-an"><p>(a) <b>asset</b> · (b) <b>vulnerability</b> · (c) <b>threat</b> · (d) <b>exploit</b> · (e) <b>risk</b>.</p>
<p><b>What you report is (e), the risk</b> — because it is the only one of the five that carries both likelihood and impact, and therefore the only one a manager can make a decision about. Reporting (b) alone invites "how bad is that?" and you have to start again. Reporting (e) alone with no (b) invites "so what do we change?" — so the useful sentence contains both: <em>"password login is open to the Internet and is being probed hourly; if one succeeds we lose every customer record; disabling password login removes it entirely and costs nothing."</em></p>
<p class="ghi-chu">Notice the fix landed on (b). You never fix a risk directly — you fix the vulnerability, and the risk changes as a result.</p></div>

<p><b>E2.</b> A colleague proposes: "Let us install fail2ban to stop the SSH attacks." A second colleague proposes: "Let us turn off password authentication." Both are cheap. Which one ends the problem, and what exactly does the other one buy?</p>
<div class="dap-an"><p><b>Turning off password authentication ends it.</b> With <code>PasswordAuthentication no</code>, the number of guesses that could ever succeed is zero — from every address, immediately and permanently. The attempts still arrive; they can no longer lead anywhere.</p>
<p><b>What fail2ban buys is real but different:</b> smaller logs, less CPU spent refusing connections, and fewer entries to read past when you are looking for something else. That is noise reduction, and it is worth having.</p>
<p><b>What it does not buy is protection.</b> A ban after five failures still permits five guesses per window, forever, from every address on Earth. If passwords are enabled, fail2ban slows an attack down; it does not close it. So the order is: <b>keys first, then fail2ban</b> — never fail2ban instead of keys.</p>
<p class="ghi-chu">There is also a failure mode worth naming: a ban list on a password-enabled host <em>feels</em> like protection, which makes the real fix feel less urgent. A control that reduces the sense of risk more than the risk itself is worse than none.</p></div>

<p><b>E3.</b> ★ A small company has one router with a firewall, and behind it a flat network of forty machines: laptops, two servers, and the printers. One laptop returns from a conference infected with a worm. Explain what the firewall does about it, and name the one change that would have contained the damage.</p>
<div class="dap-an"><p><b>What the firewall does: nothing at all.</b> The infected laptop is now <em>inside</em>. Every packet it sends to the other thirty-nine machines stays on the local network and never crosses the router, so the firewall never inspects a single one of them. The perimeter was not breached — the threat walked in through the front door in a bag.</p>
<p><b>Why a worm specifically.</b> A trojan would need somebody on each machine to run something. A worm needs nothing: it spreads by itself, so "our staff are careful" changes nothing about the outcome.</p>
<p><b>The one change: segmentation.</b> Put the servers in one segment, user laptops in another, printers in a third, and permit only the specific flows that are actually needed between them. The worm can then only reach what the network lets it reach — typically the other laptops, not the servers.</p>
<p><b>The two supporting changes</b>, because segmentation alone is rarely enough: device hardening on the servers (section 15.4), so that reaching a server is not the same as logging into it; and a tested backup, so that if a server is reached the answer is a restore rather than a negotiation.</p>
<p class="ghi-chu">This exercise is the whole of slide 3 in one story: the firewall filters what crosses it, and the traffic that hurt you never crossed it.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Xếp mỗi thứ sau vào tài sản, lỗ hổng, mối đe doạ, cách khai thác hay rủi ro, rồi nói trong năm cái đó bạn sẽ báo cáo cái nào cho người quản lý. (a) Cơ sở dữ liệu chứa toàn bộ hồ sơ khách hàng. (b) Đăng nhập bằng mật khẩu đang bật trên cổng SSH công khai. (c) Máy quét tự động dò cổng đó mỗi giờ. (d) Một đoạn mã đoán mật khẩu đang chạy được. (e) "Nếu họ vào được thì mình mất sạch hồ sơ."</p>
<div class="dap-an"><p>(a) <b>tài sản</b> · (b) <b>lỗ hổng</b> · (c) <b>mối đe doạ</b> · (d) <b>cách khai thác</b> · (e) <b>rủi ro</b>.</p>
<p><b>Thứ bạn báo cáo là (e), tức rủi ro</b> — vì nó là cái duy nhất trong năm cái mang theo cả khả năng xảy ra lẫn mức thiệt hại, nên cũng là cái duy nhất mà người quản lý ra quyết định được. Báo mỗi (b) thì sẽ bị hỏi "thế nó tệ đến đâu?" và bạn phải bắt đầu lại. Báo mỗi (e) mà không có (b) thì sẽ bị hỏi "vậy đổi cái gì?" — nên câu nói dùng được phải chứa cả hai: <em>"đăng nhập bằng mật khẩu đang mở ra Internet và bị dò mỗi giờ; nếu một lần trúng thì mình mất sạch hồ sơ khách hàng; tắt đăng nhập bằng mật khẩu là gỡ bỏ hoàn toàn chuyện đó và không tốn gì."</em></p>
<p class="ghi-chu">Để ý cách sửa rơi vào (b). Bạn không bao giờ sửa được rủi ro một cách trực tiếp — bạn sửa lỗ hổng, và rủi ro thay đổi theo.</p></div>

<p><b>E2.</b> Một đồng nghiệp đề xuất: "Cài fail2ban để chặn mấy cuộc tấn công SSH." Đồng nghiệp thứ hai đề xuất: "Tắt xác thực bằng mật khẩu đi." Cả hai đều rẻ. Cái nào chấm dứt được vấn đề, và cái còn lại mua được chính xác cái gì?</p>
<div class="dap-an"><p><b>Tắt xác thực bằng mật khẩu mới chấm dứt.</b> Với <code>PasswordAuthentication no</code>, số lần đoán có khả năng thành công là không — từ mọi địa chỉ, ngay lập tức và vĩnh viễn. Các lần thử vẫn tới; chúng không còn dẫn tới đâu nữa.</p>
<p><b>Thứ fail2ban mua được là có thật nhưng khác:</b> log nhỏ lại, CPU đỡ tốn vào việc từ chối kết nối, và ít dòng phải lướt qua hơn khi bạn đang tìm một thứ khác. Đó là giảm ồn, và nó đáng có.</p>
<p><b>Thứ nó KHÔNG mua được là sự bảo vệ.</b> Một lệnh cấm sau năm lần hỏng thì vẫn cho phép năm lần đoán mỗi cửa sổ thời gian, mãi mãi, từ mọi địa chỉ trên Trái Đất. Nếu mật khẩu vẫn bật thì fail2ban làm cuộc tấn công chậm lại; nó không đóng cửa. Nên thứ tự là: <b>khoá trước, fail2ban sau</b> — đừng bao giờ dùng fail2ban THAY CHO khoá.</p>
<p class="ghi-chu">Còn một kiểu hỏng nữa đáng gọi tên: một danh sách cấm trên cái máy vẫn bật mật khẩu thì <em>cho cảm giác</em> đã được bảo vệ, khiến cách sửa thật sự trông bớt gấp đi. Một biện pháp làm giảm CẢM GIÁC rủi ro nhiều hơn giảm rủi ro thật thì còn tệ hơn là không có.</p></div>

<p><b>E3.</b> ★ Một công ty nhỏ có một router kèm tường lửa, phía sau là một mạng phẳng gồm bốn mươi máy: laptop, hai máy chủ, và mấy cái máy in. Một chiếc laptop đi hội thảo về, mang theo một con worm. Hãy giải thích tường lửa làm được gì trong chuyện này, và gọi tên MỘT thay đổi lẽ ra đã khoanh được thiệt hại.</p>
<div class="dap-an"><p><b>Tường lửa làm được gì: hoàn toàn không gì cả.</b> Cái laptop nhiễm bệnh giờ đang ở <em>bên trong</em>. Mọi gói tin nó gửi tới ba mươi chín máy kia đều nằm lại trên mạng nội bộ và không bao giờ đi qua router, nên tường lửa không soi lấy một gói nào. Vành đai không hề bị chọc thủng — mối đe doạ đi thẳng qua cửa chính, trong một cái cặp.</p>
<p><b>Vì sao lại là worm.</b> Một con trojan sẽ cần có người ở từng máy chạy một thứ gì đó. Worm thì không cần gì: nó tự lan, nên câu "nhân viên bên mình cẩn thận" không làm đổi kết cục.</p>
<p><b>Một thay đổi: phân đoạn mạng.</b> Đặt máy chủ vào một phân đoạn, laptop người dùng vào phân đoạn khác, máy in vào phân đoạn thứ ba, và chỉ cho phép đúng những luồng thật sự cần giữa chúng. Khi đó worm chỉ với tới được những gì mạng cho phép nó với tới — thường là các laptop khác, không phải máy chủ.</p>
<p><b>Hai thay đổi bổ trợ</b>, vì chỉ phân đoạn thì hiếm khi đủ: làm cứng thiết bị trên máy chủ (mục 15.4), để việc với tới được một máy chủ không đồng nghĩa với việc đăng nhập được vào nó; và một bản sao lưu đã thử phục hồi, để nếu máy chủ bị với tới thì câu trả lời là phục hồi chứ không phải thương lượng.</p>
<p class="ghi-chu">Bài tập này chính là toàn bộ slide 3 kể thành một câu chuyện: tường lửa lọc thứ đi qua nó, còn thứ làm bạn đau thì chưa bao giờ đi qua nó.</p></div>`,
    ),

    cq(49, [
      ['CQ17.1', 'Why basic security measure are necessary on network devices? <em>- this matches section <strong>15.4 Device Security</strong>, which the school teaches in session 50, not in this one. Answered in full in Lesson 15.2.</em>',
        'Why basic security measure are necessary on network devices? <em>- câu này khớp mục <strong>15.4 Device Security</strong>, mà trường dạy ở buổi 50 chứ không phải buổi này. Trả lời đầy đủ ở bài 15.2.</em>'],
    ]),

    bi(
      `<div class="note-ct"><p><strong>About this question.</strong> Quoted exactly as published, including the grammar. It asks about <strong>15.4 Device Security</strong> — which belongs to session 50, tomorrow — while session 49 teaches 15.1 and 15.2.</p>
<p>This is the same drift reported since session 19: the constructive-question numbering runs about one chapter behind the session plan, and inside this chapter it is off by one session as well. A short answer, so that you are not left without one today: basic measures are necessary because the network cannot defend a device from its own neighbours. A firewall only inspects traffic that crosses it, and traffic between two hosts on the same segment never does. That leaves the device itself as the last line of defence, so it has to be configured such that merely being on the same network is not sufficient to log in — no default credentials, no unused services listening, encrypted management only, and a login that requires something that cannot be guessed.</p>
<p>The full treatment, with the commands and the verification for each one, is Lesson 15.2.</p></div>`,
      `<div class="note-ct"><p><strong>Về câu hỏi này.</strong> Trích nguyên văn như đã công bố, kể cả chỗ sai ngữ pháp. Nó hỏi về <strong>15.4 Device Security</strong> — vốn thuộc buổi 50, tức ngày mai — trong khi buổi 49 dạy 15.1 và 15.2.</p>
<p>Đây vẫn là độ trôi đã nêu từ buổi 19: cách đánh số câu hỏi kiến tạo chạy chậm hơn kế hoạch buổi học khoảng một chương, và ngay trong chương này thì nó còn lệch thêm một buổi nữa. Trả lời ngắn, để hôm nay bạn không bị bỏ trống: các biện pháp cơ bản là cần thiết vì mạng không bảo vệ nổi một thiết bị trước chính láng giềng của nó. Tường lửa chỉ soi lưu lượng đi qua nó, mà lưu lượng giữa hai máy trong cùng một phân đoạn thì không bao giờ đi qua. Thành thử bản thân thiết bị là tuyến phòng thủ cuối cùng, nên nó phải được cấu hình sao cho việc chỉ cần nằm cùng mạng là chưa đủ để đăng nhập — không còn thông tin đăng nhập mặc định, không còn dịch vụ thừa đang nghe, chỉ quản trị bằng kênh mã hoá, và một cơ chế đăng nhập đòi thứ không đoán được.</p>
<p>Phần đầy đủ, kèm câu lệnh và phép nghiệm thu cho từng bước, nằm ở bài 15.2.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────── Lesson 15.2 — session 50 ─────────────────────── */

const L2 = {
  title: '15.2 - Mitigation, device hardening and the only CLO10 session (FLM session 50)|||15.2 - Giảm thiểu, làm cứng thiết bị và buổi CLO10 duy nhất (buổi 50 của FLM)',
  slug: 'nwc204-15-2-giam-thieu-va-lam-cung-thiet-bi',
  type: 'DOCUMENT',
  description: 'Buổi 50: phòng thủ nhiều lớp và ba tính chất bị tấn công (bí mật, toàn vẹn, sẵn sàng) cùng lý do các biện pháp KHÔNG thay thế nhau được, bộ công cụ giảm thiểu mà Module 16 gọi tên, ba thói quen rẻ tiền vượt mặt mọi thiết bị đắt tiền, rồi danh sách làm cứng thiết bị và cấu hình Cisco đủ từ enable với SSH thay Telnet. Kèm phần ★ trên máy chủ Linux thật: khoá thay mật khẩu, BẪY THỨ TỰ drop-in của sshd, nghiệm thu bằng sshd -T chứ không bằng cat, fail2ban chỉ là lớp giảm ồn, đừng publish cổng 5432, và vì sao container non-root không bind được cổng dưới 1024. Buổi 50 là buổi DUY NHẤT trong 60 buổi có CLO10.',
  content: [
    bi(
      `<span class="eyebrow">NWC204 · Chapter 15 · Lesson 15.2 · FLM session 50 of 60 · CLO7, CLO10 · Cisco Module 16</span>
<h2>The state a device should already be in</h2>
<p class="lead">After this lesson you can build a mitigation argument from the property being protected rather than from a product list, harden a Cisco device from <code>enable</code> onwards with SSH and no Telnet, harden a Linux host so that password login cannot succeed at all, and — the part that separates the two — <strong>prove</strong> each change took effect instead of trusting the file you just wrote.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 50 — "15.3 Network Attack Mitigation · 15.4 Device Security · 15.5 Integrate AI Tools for Explaining Concepts (Self Learning)"; LO: CLO7, CLO10; ITU: T; tài liệu "Module 16: Network Security Fundamentals", nhiệm vụ "Read Module 16"</p>
<p><strong>Opening question.</strong> On a real server, a drop-in file was written to disable password login. The syntax checker passed, the reload succeeded, and the command returned 0:</p>
<pre><code class="language-bash">sudo sshd -t              # exit 0
sudo systemctl reload ssh # exit 0</code></pre>
<p>Then the effective configuration was queried, and it said the opposite of the file:</p>
<pre><code class="language-plaintext">passwordauthentication yes</code></pre>
<p>Nothing errored. Nothing warned. One directive in the same file <em>had</em> applied, and the other had not. What kind of mistake produces a result that is half applied — and what does that tell you about every "I already hardened it" you will ever hear?</p>
<div class="callout warn"><strong>This is the only session in all sixty that carries CLO10.</strong> <em>"Students use AI and digital tools to collaborate, design, and present small network projects. The approach blends dialogue-based assessment with self-directed learning."</em> Dialogue-based means you say the answer out loud and are then asked why. Every configuration in this lesson is therefore given together with the command that proves it worked — because in that format, "I ran it" is a much weaker answer than "I ran it, and here is what the device reported afterwards".</div>
<p class="note">★ marks material added by cuongthai.com beyond Cisco Module 16, taken from hardening a public VPS that runs Docker, nginx and PostgreSQL.</p>`,
      `<span class="eyebrow">NWC204 · Chương 15 · Bài 15.2 · Buổi 50/60 của FLM · CLO7, CLO10 · Cisco Module 16</span>
<h2>Trạng thái mà một thiết bị lẽ ra phải ở sẵn</h2>
<p class="lead">Học xong bài này bạn dựng được một lý lẽ giảm thiểu đi từ TÍNH CHẤT đang được bảo vệ chứ không đi từ danh sách sản phẩm, làm cứng được một thiết bị Cisco đủ từ <code>enable</code> với SSH và không còn Telnet, làm cứng được một máy Linux tới mức đăng nhập bằng mật khẩu không thể thành công, và — phần tách bạch hai loại người — <strong>CHỨNG MINH</strong> được từng thay đổi đã có hiệu lực thay vì tin vào cái file mình vừa ghi.</p>
<p class="nhan">Nguồn: FLM · Syllabus 14520 · buổi 50 — "15.3 Network Attack Mitigation · 15.4 Device Security · 15.5 Integrate AI Tools for Explaining Concepts (Self Learning)"; LO: CLO7, CLO10; ITU: T; tài liệu "Module 16: Network Security Fundamentals", nhiệm vụ "Read Module 16"</p>
<p><strong>Câu hỏi mở đầu.</strong> Trên một máy chủ thật, người ta ghi một file drop-in để tắt đăng nhập bằng mật khẩu. Bộ kiểm cú pháp qua, lệnh nạp lại chạy xong, và lệnh trả về 0:</p>
<pre><code class="language-bash">sudo sshd -t              # thoát 0
sudo systemctl reload ssh # thoát 0</code></pre>
<p>Rồi người ta hỏi lại cấu hình đang có hiệu lực, và nó nói ngược hẳn với cái file:</p>
<pre><code class="language-plaintext">passwordauthentication yes</code></pre>
<p>Không có lỗi nào. Không có cảnh báo nào. Một chỉ thị trong chính cái file đó thì <em>đã</em> ăn, chỉ thị kia thì không. Loại sai lầm nào sinh ra một kết quả nửa ăn nửa trượt như vậy — và điều đó nói gì về mọi câu "tôi làm cứng rồi" mà bạn sẽ còn nghe suốt đời?</p>
<div class="callout warn"><strong>Đây là buổi DUY NHẤT trong cả sáu mươi buổi mang CLO10.</strong> <em>"Students use AI and digital tools to collaborate, design, and present small network projects. The approach blends dialogue-based assessment with self-directed learning."</em> Chấm bằng đối thoại nghĩa là bạn nói câu trả lời thành lời rồi bị hỏi vì sao. Vì vậy mọi cấu hình trong bài này đều đi kèm câu lệnh chứng minh nó đã chạy — bởi ở định dạng đó, "tôi đã chạy lệnh" là câu trả lời yếu hơn hẳn "tôi đã chạy, và đây là thứ thiết bị báo lại sau đó".</div>
<p class="note">★ đánh dấu phần cuongthai.com bổ sung ngoài Cisco Module 16, lấy từ việc làm cứng một VPS công khai chạy Docker, nginx và PostgreSQL.</p>`,
    ),

    walkHead('nwc204-ch15', 11, 26,
      'Slides 11-26 cover FLM session 50: 15.3 Network Attack Mitigation, 15.4 Device Security and 15.5 AI tools.',
      'Slide 11-26 là buổi 50 của FLM: 15.3 Giảm thiểu tấn công, 15.4 An ninh thiết bị và 15.5 Công cụ AI.'),

    walk('nwc204-ch15', [
      [11, '15.3 Defence in depth - the layer model of mitigation',
        `<p>Defence in depth means no single layer is trusted to hold. Each layer is designed on the assumption that the one outside it has already been bypassed.</p>
<ul>
<li><strong>Perimeter</strong> — firewall, VPN, IPS: what may cross the boundary at all.</li>
<li><strong>Network</strong> — segmentation and access lists: what may talk to what, once inside.</li>
<li><strong>Device</strong> — section 15.4 hardening: who may log in to this box, and how.</li>
<li><strong>Data</strong> — least privilege, encryption at rest, and backups.</li>
</ul>
<p><strong>How to use the model rather than just draw it.</strong> Read it downwards as a question: <em>"if the layer above this one is already bypassed, what still stops the attack here?"</em> An answer of "nothing" at any level is the finding, and the whole exercise costs one sheet of paper.</p>
<p>★ A VPS with a single public address has a very thin perimeter layer — often just the provider's filtering and whatever the host itself refuses. That thinness is not a flaw to apologise for; it is a fact that moves the weight onto the device layer, which is the layer you fully control. That is why the rest of this lesson lives there.</p>`,
        `<p>Phòng thủ nhiều lớp nghĩa là không lớp nào được tin là sẽ trụ. Mỗi lớp được thiết kế với giả định rằng lớp bên ngoài nó ĐÃ bị vượt qua rồi.</p>
<ul>
<li><strong>Vành đai</strong> — tường lửa, VPN, IPS: cái gì được phép đi qua ranh giới.</li>
<li><strong>Mạng</strong> — phân đoạn và danh sách kiểm soát truy cập: khi đã vào trong thì ai được nói chuyện với ai.</li>
<li><strong>Thiết bị</strong> — làm cứng theo mục 15.4: ai được đăng nhập vào cái máy này, và bằng cách nào.</li>
<li><strong>Dữ liệu</strong> — đặc quyền tối thiểu, mã hoá khi lưu trữ, và sao lưu.</li>
</ul>
<p><strong>Dùng mô hình này thế nào cho ra việc, thay vì chỉ vẽ ra.</strong> Đọc từ trên xuống như một câu hỏi: <em>"nếu lớp ở trên đã bị vượt qua rồi thì ở đây còn gì chặn được cuộc tấn công này?"</em> Câu trả lời "không còn gì" ở bất kỳ tầng nào chính là phát hiện cần tìm, và cả bài tập này tốn đúng một tờ giấy.</p>
<p>★ Một con VPS với một địa chỉ công khai duy nhất có lớp vành đai rất mỏng — thường chỉ là phần lọc của nhà cung cấp cộng với những gì chính cái máy từ chối. Sự mỏng đó không phải khuyết điểm cần xin lỗi; nó là một sự thật đẩy sức nặng xuống lớp thiết bị, mà lớp thiết bị lại là lớp bạn kiểm soát hoàn toàn. Đó là lý do phần còn lại của bài này sống ở đó.</p>`],

      [12, '15.3 What is being protected: the three properties',
        `<p>Before choosing a control, name the property you are protecting. There are three.</p>
<ul>
<li><strong>Confidentiality</strong> — only the intended reader can read it. Broken by on-path attacks and by plaintext protocols such as Telnet.</li>
<li><strong>Integrity</strong> — it arrives unaltered, and you can tell that it did. Broken by spoofing and by unsigned data.</li>
<li><strong>Availability</strong> — it is there when entitled users need it. Broken by denial of service, and just as often by your own bad change.</li>
</ul>
<p><strong>Why naming the property first is not pedantry.</strong> Encryption buys confidentiality, and with a signature it buys integrity. It buys <strong>no availability at all</strong> — a denial-of-service attack against an encrypted service works exactly as well as against a plaintext one. Controls are not interchangeable, and matching the wrong control to the wrong property is the most common design error in this chapter.</p>
<p>It also gives you a way to argue for boring work. A tested backup is an availability and integrity control; it protects nothing about confidentiality. An access control list is a confidentiality control; it protects nothing about availability. Saying which one you are buying makes it obvious when a gap has been left open.</p>`,
        `<p>Trước khi chọn một biện pháp, hãy gọi tên tính chất mà bạn đang bảo vệ. Có ba tính chất.</p>
<ul>
<li><strong>Tính bí mật</strong> — chỉ người nhận được nhắm tới mới đọc được. Bị phá bởi tấn công xen giữa và bởi những giao thức chạy trần như Telnet.</li>
<li><strong>Tính toàn vẹn</strong> — nó tới nơi nguyên vẹn, và bạn biết được là nó nguyên vẹn. Bị phá bởi giả mạo và bởi dữ liệu không được ký.</li>
<li><strong>Tính sẵn sàng</strong> — nó có mặt khi người có quyền cần tới. Bị phá bởi tấn công từ chối dịch vụ, và cũng thường xuyên bị phá bởi chính một thay đổi hỏng của bạn.</li>
</ul>
<p><strong>Vì sao gọi tên tính chất trước không phải là chuyện câu nệ chữ nghĩa.</strong> Mã hoá mua được tính bí mật, và kèm chữ ký thì mua thêm tính toàn vẹn. Nó <strong>không mua được chút tính sẵn sàng nào</strong> — một cuộc tấn công từ chối dịch vụ nhằm vào dịch vụ có mã hoá hiệu quả y hệt như nhằm vào dịch vụ chạy trần. Các biện pháp không thay thế nhau được, và ghép nhầm biện pháp với tính chất là lỗi thiết kế hay gặp nhất của chương này.</p>
<p>Nó cũng cho bạn cách biện hộ cho những việc nhàm chán. Một bản sao lưu đã thử phục hồi là biện pháp cho tính sẵn sàng và tính toàn vẹn; nó không bảo vệ chút nào cho tính bí mật. Một danh sách kiểm soát truy cập là biện pháp cho tính bí mật; nó không bảo vệ chút nào cho tính sẵn sàng. Nói rõ mình đang mua cái nào thì lỗ hổng còn để ngỏ lập tức lộ ra.</p>`],

      [13, '15.3 The mitigation toolkit Module 16 names',
        `<p>The tools in Module 16, with the job each one actually does and the property it serves:</p>
<ul>
<li><strong>Firewall</strong> — decides what may cross a boundary. Confidentiality and availability.</li>
<li><strong>VPN</strong> — an encrypted tunnel across an untrusted path. Confidentiality and integrity.</li>
<li><strong>IPS</strong> — inspects traffic and can block a known pattern. Integrity and availability.</li>
<li><strong>ESA and WSA</strong> — email and web content filtering, aimed at the trojan and phishing rows of the malware table.</li>
<li><strong>AAA</strong> — authentication, authorization and accounting: who are you, what may you do, and what did you do. It serves all three properties, and it is the only one that leaves an audit trail.</li>
</ul>
<p><strong>The school's questions point at the first row, twice.</strong> <strong>CQ18.1</strong> asks for "one of the most effective security tools available for protecting users from external threats", and <strong>CQ18.3</strong> asks which component "is designed to protect against unauthorized communications to and from a computer". Both answers are the <strong>firewall</strong>.</p>
<p>Read the wording of CQ18.3 carefully, though: <em>to and from</em>. Outbound filtering is the half people forget, and it is the half that catches a host which is already compromised — spyware reporting outwards, or a machine that has become part of somebody else's botnet.</p>`,
        `<p>Các công cụ mà Module 16 gọi tên, kèm việc thật sự của từng cái và tính chất nó phục vụ:</p>
<ul>
<li><strong>Tường lửa</strong> — quyết định cái gì được đi qua một ranh giới. Tính bí mật và tính sẵn sàng.</li>
<li><strong>VPN</strong> — một đường hầm mã hoá đi qua đường truyền không đáng tin. Tính bí mật và tính toàn vẹn.</li>
<li><strong>IPS</strong> — soi lưu lượng và chặn được một mẫu đã biết. Tính toàn vẹn và tính sẵn sàng.</li>
<li><strong>ESA và WSA</strong> — lọc nội dung thư điện tử và web, nhắm vào hàng trojan và lừa đảo trong bảng mã độc.</li>
<li><strong>AAA</strong> — xác thực, phân quyền và ghi nhận: bạn là ai, bạn được làm gì, và bạn đã làm gì. Nó phục vụ cả ba tính chất, và là cái duy nhất để lại dấu vết kiểm toán.</li>
</ul>
<p><strong>Câu hỏi của trường chỉ vào hàng đầu tiên, tới hai lần.</strong> <strong>CQ18.1</strong> hỏi "one of the most effective security tools available for protecting users from external threats", còn <strong>CQ18.3</strong> hỏi thành phần nào "is designed to protect against unauthorized communications to and from a computer". Cả hai đáp án đều là <strong>tường lửa</strong>.</p>
<p>Nhưng hãy đọc kỹ chữ trong CQ18.3: <em>to and from</em> — vào VÀ ra. Lọc chiều ra là nửa mà người ta hay quên, và nó chính là nửa bắt được một cái máy đã bị chiếm rồi — spyware đang báo cáo ra ngoài, hay một cái máy đã trở thành một phần trong mạng máy tính ma của kẻ khác.</p>`],

      [14, '15.3 Three habits that outrank every appliance',
        `<p>Module 16 lists three approaches that come before any product, and they are the three that cost nothing but attention.</p>
<ul>
<li><strong>Backup — and restore one.</strong> An untested backup is a belief, not a control. It is also the only defence against ransomware that does not depend on catching anything in advance.</li>
<li><strong>Update and patch.</strong> Most exploited vulnerabilities are old and already fixed by the vendor. Patching converts a technological vulnerability into no vulnerability at all — the only category of the three that can be removed outright.</li>
<li><strong>Authenticate.</strong> Every device, every service, every hop. Trust by network position is exactly what trust exploitation eats, and it is the assumption underneath most flat-network incidents.</li>
</ul>
<p><strong>Why they outrank the appliances.</strong> A network with an IPS and no tested backup is worse defended than one with tested backups and no IPS, because the first has a control that <em>might</em> catch an attack and no answer for the case where it does not. Spending follows attention here, not the other way round.</p>
<p class="ghi-chu">The word "tested" is doing all the work in the first bullet. A backup job that reports success every night and has never been restored is an untested belief with a green light on it.</p>`,
        `<p>Module 16 liệt kê ba cách tiếp cận đứng trước mọi sản phẩm, và cả ba đều không tốn gì ngoài sự chú ý.</p>
<ul>
<li><strong>Sao lưu — và phục hồi thử một bản.</strong> Một bản sao lưu chưa từng phục hồi thử là một NIỀM TIN, không phải một biện pháp. Nó cũng là cách chống ransomware duy nhất không phụ thuộc vào việc phải bắt được thứ gì từ trước.</li>
<li><strong>Cập nhật và vá lỗi.</strong> Phần lớn lỗ hổng bị khai thác đều cũ và đã được nhà cung cấp vá rồi. Vá lỗi biến một lỗ hổng công nghệ thành không còn lỗ hổng nào — nhóm duy nhất trong ba nhóm có thể gỡ bỏ hẳn.</li>
<li><strong>Xác thực.</strong> Mọi thiết bị, mọi dịch vụ, mọi chặng. Tin nhau vì vị trí trong mạng đúng là thứ mà lợi dụng quan hệ tin cậy ăn vào, và nó là giả định nằm dưới phần lớn sự cố của các mạng phẳng.</li>
</ul>
<p><strong>Vì sao chúng đứng trên các thiết bị đắt tiền.</strong> Một mạng có IPS mà không có bản sao lưu đã thử phục hồi thì phòng thủ kém hơn một mạng có sao lưu đã thử mà không có IPS, vì cái thứ nhất có một biện pháp <em>có thể</em> bắt được cuộc tấn công và không có câu trả lời nào cho trường hợp nó không bắt được. Ở đây tiền nên đi theo sự chú ý, chứ không phải ngược lại.</p>
<p class="ghi-chu">Chữ "đã thử" gánh toàn bộ ý nghĩa của gạch đầu dòng thứ nhất. Một tác vụ sao lưu báo thành công mỗi đêm mà chưa từng được phục hồi lần nào là một niềm tin chưa kiểm chứng, có kèm đèn xanh.</p>`],

      [15, '15.4 Device security - the hardening checklist',
        `<p>Section 15.4 is the practical core of CLO7. Six steps, in this order, on any device that has a management interface:</p>
<ol>
<li>Change every default credential, and remove accounts nobody uses.</li>
<li>Turn off services that are not needed. Each one is an entrance you are not watching.</li>
<li>Replace plaintext management with encrypted: <strong>SSH, never Telnet</strong>.</li>
<li>Restrict who may connect, and from where.</li>
<li>Log, keep the logs somewhere else, and read them.</li>
<li>Patch the device software on a schedule, not on an incident.</li>
</ol>
<p><strong>Step 5 has a reason for the words "somewhere else".</strong> Logs kept only on the device are logs an attacker with access to that device can edit. Shipping them off the box is what turns them from a diary into evidence.</p>
<p><strong>This is the list CQ17.1 is asking about</strong> — "why basic security measure are necessary on network devices" — even though the school prints that question against session 49, a day before section 15.4 is taught. The answer is the one from slide 3: the network cannot protect a device from its own neighbours, so the device has to be able to protect itself.</p>`,
        `<p>Mục 15.4 là phần lõi thực hành của CLO7. Sáu bước, theo đúng thứ tự này, trên mọi thiết bị có giao diện quản trị:</p>
<ol>
<li>Đổi mọi thông tin đăng nhập mặc định, và xoá các tài khoản không ai dùng.</li>
<li>Tắt những dịch vụ không cần. Mỗi cái là một lối vào mà bạn không canh.</li>
<li>Thay kênh quản trị chạy trần bằng kênh mã hoá: <strong>SSH, không bao giờ Telnet</strong>.</li>
<li>Giới hạn ai được kết nối, và từ đâu.</li>
<li>Ghi log, giữ log ở CHỖ KHÁC, và đọc chúng.</li>
<li>Vá phần mềm thiết bị theo lịch, chứ không phải theo sự cố.</li>
</ol>
<p><strong>Bước 5 có lý do cho ba chữ "ở chỗ khác".</strong> Log chỉ nằm trên chính thiết bị là log mà một kẻ đã vào được thiết bị đó có thể sửa. Đẩy chúng ra khỏi cái máy là thứ biến chúng từ một cuốn nhật ký thành một bằng chứng.</p>
<p><strong>Đây chính là danh sách mà CQ17.1 đang hỏi</strong> — "why basic security measure are necessary on network devices" — dù trường in câu hỏi đó ở buổi 49, tức trước một ngày so với lúc dạy mục 15.4. Câu trả lời là câu ở slide 3: mạng không bảo vệ nổi một thiết bị trước chính láng giềng của nó, nên thiết bị phải tự bảo vệ được mình.</p>`],

      [16, '15.4 Hardening a Cisco device, from enable onwards',
        `<p>The configuration is written from <code>enable</code> so that nothing is assumed about which mode you are in. Each line has a job.</p>
<pre><code class="language-bash">enable
configure terminal
! a secret for privileged mode - hashed, not reversible
enable secret &lt;strong-secret&gt;
! encrypt the remaining plaintext passwords in the running config
service password-encryption
! a minimum length, so a weak one cannot be typed by accident
security passwords min-length 10
! lock the console port too - physical access is still access
line console 0
 password &lt;console-password&gt;
 login
 exec-timeout 5 0
! a banner: no welcome, just notice of authorised use only
banner motd #Authorized access only#</code></pre>
<p><strong>Why <code>enable secret</code> rather than <code>enable password</code>.</strong> The older <code>enable password</code> is stored reversibly, so anybody who can read the configuration can recover it. <code>enable secret</code> stores a hash. The difference is not cosmetic — configurations get backed up, emailed and pasted into tickets.</p>
<p><strong>Step 4 is the one people skip.</strong> An unlocked console means everything above it is decoration for anyone standing in the room, and <code>exec-timeout</code> is what closes a session that somebody walked away from.</p>
<p class="ghi-chu"><code>service password-encryption</code> is obfuscation, not real encryption — Cisco says so. It stops a shoulder-glance, not an analyst. Use it, and do not count it as a control.</p>`,
        `<p>Cấu hình được viết từ <code>enable</code> để không giả định gì về việc bạn đang ở chế độ nào. Mỗi dòng có một việc.</p>
<pre><code class="language-bash">enable
configure terminal
! mật khẩu cho chế độ đặc quyền - lưu dạng băm, không đảo ngược được
enable secret &lt;mat-khau-manh&gt;
! mã hoá những mật khẩu còn để trần trong cấu hình đang chạy
service password-encryption
! đặt độ dài tối thiểu, để không ai lỡ tay gõ một mật khẩu yếu
security passwords min-length 10
! khoá cả cổng console - tiếp cận vật lý vẫn là tiếp cận
line console 0
 password &lt;mat-khau-console&gt;
 login
 exec-timeout 5 0
! biểu ngữ: không chào mừng, chỉ báo rằng chỉ người có phép mới được dùng
banner motd #Authorized access only#</code></pre>
<p><strong>Vì sao dùng <code>enable secret</code> chứ không phải <code>enable password</code>.</strong> Cái cũ <code>enable password</code> lưu ở dạng đảo ngược được, nên ai đọc được file cấu hình là khôi phục lại được mật khẩu. <code>enable secret</code> lưu dạng băm. Khác biệt này không phải chuyện hình thức — file cấu hình thì hay bị sao lưu, gửi qua thư, và dán vào phiếu hỗ trợ.</p>
<p><strong>Bước 4 là bước người ta hay bỏ.</strong> Một cổng console không khoá làm cho mọi thứ ở trên nó thành đồ trang trí đối với bất kỳ ai đang đứng trong phòng, còn <code>exec-timeout</code> là thứ đóng lại một phiên mà người ta bỏ đi quên mất.</p>
<p class="ghi-chu"><code>service password-encryption</code> là che mắt chứ không phải mã hoá thật — chính Cisco nói vậy. Nó chặn được cái liếc qua vai, không chặn được một người phân tích. Cứ bật, nhưng đừng tính nó là một biện pháp bảo vệ.</p>`],

      [17, '15.4 SSH instead of Telnet, and proving it took',
        `<p>Telnet sends the password across the network in cleartext. SSH is not an upgrade over it; SSH is the baseline, and Telnet is a protocol that should not be reachable at all.</p>
<pre><code class="language-bash">hostname R1
ip domain-name example.local
crypto key generate rsa modulus 2048
ip ssh version 2
username admin secret &lt;strong-secret&gt;
line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0</code></pre>
<p><strong>The line that matters is <code>transport input ssh</code>.</strong> Configuring SSH while leaving Telnet permitted changes nothing about your exposure: an attacker simply uses the door that is still open, and the encrypted door sits beside it unused. <code>transport input ssh</code> is what closes the other one.</p>
<p><strong>Then verify — do not trust the configuration you just typed.</strong></p>
<pre><code class="language-bash">show ip ssh
show run | section line vty</code></pre>
<pre><code class="language-plaintext">SSH Enabled - version 2.0
 transport input ssh</code></pre>
<p>Asking the device what it believes is a different act from reading what you wrote, and the next four slides are about how far apart those two can be.</p>`,
        `<p>Telnet gửi mật khẩu đi qua mạng ở dạng chữ trần. SSH không phải một bản nâng cấp của nó; SSH là mức nền, còn Telnet là một giao thức lẽ ra không nên với tới được từ đâu cả.</p>
<pre><code class="language-bash">hostname R1
ip domain-name example.local
crypto key generate rsa modulus 2048
ip ssh version 2
username admin secret &lt;mat-khau-manh&gt;
line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0</code></pre>
<p><strong>Dòng quan trọng là <code>transport input ssh</code>.</strong> Cấu hình SSH mà vẫn để Telnet được phép thì không làm đổi chút nào mức độ phơi ra của bạn: kẻ tấn công cứ dùng cái cửa còn mở, còn cái cửa mã hoá nằm cạnh đó không ai đụng tới. <code>transport input ssh</code> chính là thứ đóng cái cửa kia lại.</p>
<p><strong>Rồi nghiệm thu — đừng tin vào cấu hình bạn vừa gõ.</strong></p>
<pre><code class="language-bash">show ip ssh
show run | section line vty</code></pre>
<pre><code class="language-plaintext">SSH Enabled - version 2.0
 transport input ssh</code></pre>
<p>Hỏi thiết bị xem nó đang tin cái gì là một hành động KHÁC với việc đọc lại thứ mình vừa ghi, và bốn slide kế tiếp nói về chuyện hai thứ đó có thể xa nhau tới mức nào.</p>`],

      [18, 'The same idea on a Linux server you actually run',
        `<p>★ Beyond Module 16. The Cisco checklist step "authenticate with something that cannot be guessed" has an exact equivalent on a Linux host, and it is three lines:</p>
<pre><code class="language-ini"># /etc/ssh/sshd_config.d/01-no-password.conf
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password</code></pre>
<ul>
<li><strong>Line 1</strong> — no password may be offered at all. Only a key is accepted.</li>
<li><strong>Line 2</strong> — closes the keyboard-interactive route, which is a second way of being asked for one. Setting line 1 without line 2 is a common half-measure.</li>
<li><strong>Line 3</strong> — root may log in <strong>by key</strong>, and never by password.</li>
</ul>
<p><strong>The cost, stated honestly.</strong> Lose the key and there is no password door left to rescue you. Enrol a second key — from a second machine — <em>before</em> you apply this, and test that the second key works before you close the session that made the change. Never make this change and then log out to see what happens.</p>
<p>★ The filename begins with <code>01-</code> on purpose. The next slide is about why, and it is the most useful thing in this chapter.</p>`,
        `<p>★ Ngoài Module 16. Bước "xác thực bằng thứ không đoán được" trong danh sách của Cisco có một bản tương đương chính xác trên máy Linux, và nó gồm ba dòng:</p>
<pre><code class="language-ini"># /etc/ssh/sshd_config.d/01-no-password.conf
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password</code></pre>
<ul>
<li><strong>Dòng 1</strong> — không được phép đưa ra mật khẩu nào cả. Chỉ khoá mới được chấp nhận.</li>
<li><strong>Dòng 2</strong> — đóng đường keyboard-interactive, vốn là con đường thứ hai để bị hỏi mật khẩu. Đặt dòng 1 mà quên dòng 2 là một kiểu làm nửa vời rất hay gặp.</li>
<li><strong>Dòng 3</strong> — root được đăng nhập <strong>bằng khoá</strong>, và không bao giờ bằng mật khẩu.</li>
</ul>
<p><strong>Cái giá, nói thẳng.</strong> Mất khoá là không còn cánh cửa mật khẩu nào cứu bạn nữa. Hãy nạp một khoá thứ hai — từ một cái máy thứ hai — <em>trước khi</em> áp dụng, và thử cho chắc là khoá thứ hai vào được trước khi đóng phiên vừa thực hiện thay đổi. Tuyệt đối đừng làm thay đổi này rồi thoát ra xem sao.</p>
<p>★ Tên file bắt đầu bằng <code>01-</code> là có chủ ý. Slide kế tiếp nói vì sao, và đó là thứ hữu dụng nhất trong cả chương này.</p>`],

      [19, 'Why the obvious version of that change does nothing',
        `<p>★ This happened on a production server on 18 September 2026, and it is written down because the failure is completely silent.</p>
<p>The file was first written as <code>70-no-password.conf</code>, containing <code>PasswordAuthentication no</code>. <code>sshd -t</code> passed. <code>systemctl reload</code> succeeded. And password authentication remained enabled.</p>
<p><strong>The cause is one sentence of sshd's own rules: for most keywords, the FIRST value obtained is the one used.</strong> Not the last, and not the most specific. Meanwhile <code>Include /etc/ssh/sshd_config.d/*.conf</code> expands in alphabetical order. The machine already had <code>50-cloud-init.conf</code> — 27 bytes, one line, <code>PasswordAuthentication yes</code>, written when the machine was first created.</p>
<p>So <code>50-</code> was read first and won. <code>70-</code> was read second and was silently ignored. The fix is not to argue with the sort — it is to win it, with <code>01-</code>, which sorts before <code>10-</code>, <code>50-</code> and <code>60-</code> alike.</p>
<p><strong>The tell-tale symptom is the valuable part: it was half applied.</strong> <code>PermitRootLogin</code> from the same file <em>did</em> take effect — because cloud-init never declared that keyword, so nothing outranked it. <strong>Half applied is the signature of an ordering clash, not of a syntax error.</strong> A syntax error fails everything; a clash fails exactly the keywords somebody else also claimed.</p>
<p class="ghi-chu">Why <code>01-</code> rather than editing the cloud-init file: rebuilding the machine makes cloud-init write <code>50-</code> again, and <code>01-</code> still wins. Fixing the collision beats winning an argument with a file that will come back.</p>`,
        `<p>★ Chuyện này xảy ra thật trên một máy chủ sản xuất ngày 18/09/2026, và được ghi lại vì kiểu hỏng của nó hoàn toàn câm lặng.</p>
<p>File ban đầu được đặt tên <code>70-no-password.conf</code>, bên trong ghi <code>PasswordAuthentication no</code>. <code>sshd -t</code> qua. <code>systemctl reload</code> chạy xong. Và xác thực bằng mật khẩu vẫn cứ bật.</p>
<p><strong>Nguyên nhân nằm trong một câu luật của chính sshd: với phần lớn từ khoá, GIÁ TRỊ ĐỌC ĐƯỢC ĐẦU TIÊN là giá trị được dùng.</strong> Không phải giá trị cuối, cũng không phải giá trị cụ thể nhất. Trong khi đó <code>Include /etc/ssh/sshd_config.d/*.conf</code> bung ra theo thứ tự chữ cái. Cái máy đã sẵn có <code>50-cloud-init.conf</code> — 27 byte, đúng một dòng, <code>PasswordAuthentication yes</code>, do lúc dựng máy ghi ra.</p>
<p>Thành thử <code>50-</code> được đọc trước và thắng. <code>70-</code> được đọc sau và bị bỏ qua trong im lặng. Cách sửa không phải là cãi nhau với thứ tự sắp xếp — mà là THẮNG nó, bằng tiền tố <code>01-</code>, vốn sắp trước cả <code>10-</code>, <code>50-</code> lẫn <code>60-</code>.</p>
<p><strong>Triệu chứng chỉ điểm mới là phần đáng giá: nó ăn có một nửa.</strong> <code>PermitRootLogin</code> trong cùng cái file ấy thì <em>đã</em> có hiệu lực — vì cloud-init không khai từ khoá đó, nên không ai tranh với nó cả. <strong>Nửa ăn nửa trượt là chữ ký của một va chạm thứ tự, không phải của một lỗi cú pháp.</strong> Lỗi cú pháp làm hỏng tất cả; một va chạm thì chỉ làm trượt đúng những từ khoá mà người khác cũng đã khai.</p>
<p class="ghi-chu">Vì sao dùng <code>01-</code> thay vì sửa thẳng file của cloud-init: dựng lại máy là cloud-init ghi lại <code>50-</code>, mà <code>01-</code> thì vẫn thắng. Sửa cho hết va chạm hơn hẳn việc thắng một cuộc cãi với cái file sẽ quay lại.</p>`],

      [20, 'Verify by asking the daemon, never by reading the file',
        `<p>★ The command that ends the argument:</p>
<pre><code class="language-bash">sshd -T | grep ^passwordauthentication
sshd -T | grep ^permitrootlogin</code></pre>
<pre><code class="language-plaintext">passwordauthentication no
permitrootlogin prohibit-password</code></pre>
<p><strong>What makes <code>sshd -T</code> different from <code>cat</code>.</strong> It prints the settings <em>in force</em> after every include, every override and every ordering rule have been applied. <code>cat</code> prints one file's wishes. In the incident on the previous slide, the file said the right thing, the syntax check passed, the reload returned 0 — and the setting was not applied. Three green results and a wrong outcome.</p>
<p><strong>The last step is to check from outside, because a daemon can also be wrong about itself:</strong></p>
<pre><code class="language-bash">ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no user@host</code></pre>
<pre><code class="language-plaintext">Permission denied (publickey).</code></pre>
<p>That message is the proof. It says the server would accept a key and will not even discuss a password.</p>
<div class="callout warn"><strong>The general rule, and it is much bigger than SSH.</strong> "Written" does not mean "in effect", and "exit code 0" does not mean "in effect". The same lesson appears three times in this project's own history: an nginx config replaced with <code>mv</code> that the container never saw because a single-file bind mount follows the inode; cache headers set in a framework config and then stripped by nginx; and this. Always verify with the thing that will do the work, not with the file you hoped it would read.</div>`,
        `<p>★ Câu lệnh chấm dứt mọi tranh cãi:</p>
<pre><code class="language-bash">sshd -T | grep ^passwordauthentication
sshd -T | grep ^permitrootlogin</code></pre>
<pre><code class="language-plaintext">passwordauthentication no
permitrootlogin prohibit-password</code></pre>
<p><strong>Điều làm <code>sshd -T</code> khác <code>cat</code>.</strong> Nó in ra các thiết lập <em>đang có hiệu lực</em> sau khi mọi lệnh include, mọi phép đè và mọi luật thứ tự đã được áp dụng xong. <code>cat</code> in ra nguyện vọng của một cái file. Trong sự cố ở slide trước, file nói đúng thứ cần nói, phép kiểm cú pháp qua, lệnh nạp lại trả về 0 — và thiết lập thì không có hiệu lực. Ba kết quả xanh và một kết cục sai.</p>
<p><strong>Bước cuối là kiểm TỪ BÊN NGOÀI, vì một tiến trình cũng có thể nói sai về chính nó:</strong></p>
<pre><code class="language-bash">ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no user@host</code></pre>
<pre><code class="language-plaintext">Permission denied (publickey).</code></pre>
<p>Dòng thông báo đó mới là bằng chứng. Nó nói rằng máy chủ chấp nhận khoá và thậm chí không buồn bàn về mật khẩu.</p>
<div class="callout warn"><strong>Quy tắc chung, và nó lớn hơn chuyện SSH rất nhiều.</strong> "Đã ghi" không có nghĩa là "đã có hiệu lực", và "lệnh trả về 0" cũng không có nghĩa là "đã có hiệu lực". Đúng bài học này xuất hiện ba lần trong lịch sử của chính dự án web này: một file cấu hình nginx được thay bằng <code>mv</code> mà container không bao giờ thấy, vì bind-mount một file đơn đi theo inode; các header cache đặt trong cấu hình framework rồi bị nginx gỡ sạch; và chuyện này. Luôn nghiệm thu bằng chính cái thứ sẽ làm việc, chứ không bằng cái file mà bạn hy vọng nó sẽ đọc.</div>`],

      [21, 'fail2ban is noise reduction, not the lock',
        `<p>★ This slide exists because the two things are constantly swapped for one another.</p>
<ul>
<li><strong>What fail2ban does:</strong> reads the authentication log and firewalls an address after N failures in M minutes.</li>
<li><strong>What that genuinely buys:</strong> smaller logs, less CPU spent refusing connections, fewer lines to read past when you are looking for something else. All real.</li>
<li><strong>What it does not buy:</strong> protection, once passwords are already disabled — every attempt fails anyway, so banning the source changes nothing about the outcome.</li>
</ul>
<p><strong>Do the arithmetic, because it is the whole argument.</strong> A ban after five failures still permits five guesses per window, forever, from every address on Earth. With <code>PasswordAuthentication no</code>, the number of guesses that could ever succeed is <strong>zero</strong>, from everywhere, immediately. One of those is a rate limit. The other is a closed door.</p>
<p><strong>So the order is: keys first, then fail2ban.</strong> Never fail2ban instead of keys. And be alert to the failure mode: a ban list on a password-enabled host <em>feels</em> like protection, which makes the real fix feel less urgent. A control that reduces the sense of risk faster than the risk itself is worse than having none.</p>
<p class="ghi-chu">A second, smaller reason to be careful: fail2ban acts on your own logs, so a misconfigured rule can ban you. Keep a second way in before you turn it on.</p>`,
        `<p>★ Slide này tồn tại vì hai thứ này bị đánh tráo cho nhau liên tục.</p>
<ul>
<li><strong>fail2ban làm gì:</strong> đọc nhật ký xác thực rồi chặn một địa chỉ ở tường lửa sau N lần hỏng trong M phút.</li>
<li><strong>Thứ đó mua được gì thật sự:</strong> log nhỏ lại, CPU đỡ tốn cho việc từ chối kết nối, ít dòng phải lướt qua hơn khi bạn đang tìm một thứ khác. Đều có thật.</li>
<li><strong>Thứ nó không mua được:</strong> sự bảo vệ, một khi mật khẩu đã bị tắt — mọi lần thử đằng nào cũng hỏng, nên chặn nguồn không làm đổi kết cục.</li>
</ul>
<p><strong>Hãy làm phép tính, vì đó là toàn bộ lý lẽ.</strong> Cấm sau năm lần hỏng thì vẫn cho phép năm lần đoán mỗi cửa sổ thời gian, mãi mãi, từ mọi địa chỉ trên Trái Đất. Với <code>PasswordAuthentication no</code>, số lần đoán có khả năng thành công là <strong>không</strong>, từ mọi nơi, ngay lập tức. Một cái là giới hạn nhịp. Cái kia là một cánh cửa đóng.</p>
<p><strong>Nên thứ tự là: khoá trước, fail2ban sau.</strong> Đừng bao giờ dùng fail2ban THAY CHO khoá. Và hãy cảnh giác với kiểu hỏng này: một danh sách cấm trên cái máy vẫn bật mật khẩu thì <em>cho cảm giác</em> đã được bảo vệ, khiến cách sửa thật sự trông bớt gấp đi. Một biện pháp làm giảm cảm giác rủi ro nhanh hơn giảm rủi ro thật thì còn tệ hơn là không có.</p>
<p class="ghi-chu">Còn một lý do nhỏ nữa để cẩn thận: fail2ban hành động dựa trên log của chính bạn, nên một luật đặt sai có thể cấm luôn bạn. Hãy giữ sẵn một đường vào thứ hai trước khi bật nó.</p>`],

      [22, 'Least exposure: do not publish the database port',
        `<p>★ Least exposure, made concrete. In a compose file, this one line is not a setting — it is a routing decision:</p>
<pre><code class="language-plaintext">ports:
  - "5432:5432"</code></pre>
<p>It binds PostgreSQL to the host's public address. The database is now reachable from the Internet, and the only thing between it and everyone is a password. Reconnaissance will find it, because port 5432 is on every scanner's list.</p>
<p><strong>Leave the line out entirely and the database exists only on the container network.</strong> The backend container reaches it by service name over <code>172.18.0.0/16</code>; nothing outside the host can address it at all.</p>
<p><strong>Why that holds, and this is the part that connects back to Chapter 10:</strong> <code>172.16.0.0/12</code> is RFC 1918 private address space. <strong>No router on the public Internet carries a route to it.</strong> A packet addressed to 172.18.0.2 from outside does not get dropped by your firewall — it never has a path to your machine in the first place. Chapter 10 taught that as a property of the address plan; here it stops being a fact and becomes a control you deliberately rely on.</p>
<p><strong>The password on the database is the second lock.</strong> Not publishing the port is the first, and the first one is the one that removes the attempt rather than surviving it.</p>`,
        `<p>★ Phơi ra ít nhất, nói cho cụ thể. Trong một file compose, đúng một dòng này không phải một thiết lập — nó là một quyết định về định tuyến:</p>
<pre><code class="language-plaintext">ports:
  - "5432:5432"</code></pre>
<p>Nó gắn PostgreSQL vào địa chỉ công khai của máy chủ. Cơ sở dữ liệu giờ với tới được từ Internet, và thứ duy nhất đứng giữa nó với tất cả mọi người là một cái mật khẩu. Do thám sẽ tìm ra nó, bởi cổng 5432 nằm trong danh sách của mọi máy quét.</p>
<p><strong>Bỏ hẳn dòng đó đi thì cơ sở dữ liệu chỉ tồn tại trên mạng container.</strong> Container backend với tới nó bằng tên dịch vụ qua dải <code>172.18.0.0/16</code>; không thứ gì bên ngoài máy chủ đánh địa chỉ tới nó được.</p>
<p><strong>Vì sao điều đó đứng vững, và đây là chỗ nối về Chương 10:</strong> <code>172.16.0.0/12</code> là không gian địa chỉ riêng theo RFC 1918. <strong>Không router nào trên Internet công cộng mang tuyến tới dải đó.</strong> Một gói tin từ bên ngoài gửi tới 172.18.0.2 không phải bị tường lửa của bạn vứt đi — nó ngay từ đầu đã không có đường nào tới máy bạn cả. Chương 10 dạy điều đó như một tính chất của kế hoạch địa chỉ; ở đây nó thôi là một sự thật và trở thành một biện pháp bảo vệ mà bạn cố ý dựa vào.</p>
<p><strong>Mật khẩu của cơ sở dữ liệu là ổ khoá thứ hai.</strong> Việc không công bố cổng ra ngoài mới là ổ khoá thứ nhất, và ổ thứ nhất là ổ xoá bỏ luôn cú thử chứ không phải sống sót qua nó.</p>`],

      [23, 'Least privilege, and the port number that proves it',
        `<p>★ Least privilege means holding only the rights the job needs, for only as long as it needs them. On Linux, there is a number that makes the principle visible.</p>
<pre><code class="language-bash">RUN adduser --system --uid 10001 app
USER app
EXPOSE 3000        # not 80: an unprivileged process cannot bind below 1024</code></pre>
<ul>
<li><strong>The rule:</strong> ports 1 to 1023 may only be bound by a privileged process.</li>
<li><strong>The consequence:</strong> a container running as a normal user <strong>cannot</strong> listen on 80 or 443. By design.</li>
<li><strong>The right answer:</strong> listen on a high port, and let the reverse proxy own 443 and forward inwards.</li>
<li><strong>The wrong answer:</strong> run the container as root so that the number looks tidy — which trades a real security property for an aesthetic one.</li>
</ul>
<p><strong>So "Permission denied" when binding port 80 is not a bug to work around.</strong> It is least privilege reporting that it is switched on. The same principle is what <code>enable secret</code> and <code>exec-timeout</code> are doing on the Cisco side: hold fewer rights, and hold them for less time.</p>
<p class="ghi-chu">There is a second reason beyond the port number. If the application is ever compromised, the attacker inherits exactly the rights the process had. A non-root process is a much smaller inheritance.</p>`,
        `<p>★ Đặc quyền tối thiểu nghĩa là chỉ giữ đúng những quyền mà công việc cần, và chỉ giữ trong đúng khoảng thời gian cần. Trên Linux có một con số làm nguyên tắc ấy hiện ra thành hình.</p>
<pre><code class="language-bash">RUN adduser --system --uid 10001 app
USER app
EXPOSE 3000        # không phải 80: tiến trình không đặc quyền không bind được dưới 1024</code></pre>
<ul>
<li><strong>Luật:</strong> cổng 1 tới 1023 chỉ tiến trình có đặc quyền mới bind được.</li>
<li><strong>Hệ quả:</strong> một container chạy dưới người dùng thường <strong>không thể</strong> nghe trên cổng 80 hay 443. Đó là thiết kế, không phải lỗi.</li>
<li><strong>Cách làm đúng:</strong> nghe trên một cổng cao, và để reverse proxy sở hữu cổng 443 rồi chuyển tiếp vào trong.</li>
<li><strong>Cách làm sai:</strong> cho container chạy bằng root để con số nhìn cho gọn — đổi một tính chất an ninh có thật lấy một tính chất thẩm mỹ.</li>
</ul>
<p><strong>Vậy nên dòng "Permission denied" khi bind cổng 80 không phải một con bọ cần đi vòng qua.</strong> Nó là đặc quyền tối thiểu đang báo rằng nó đang bật. Cũng đúng nguyên tắc ấy là thứ mà <code>enable secret</code> và <code>exec-timeout</code> đang làm ở phía Cisco: giữ ít quyền hơn, và giữ trong thời gian ngắn hơn.</p>
<p class="ghi-chu">Còn một lý do thứ hai ngoài con số cổng. Nếu ứng dụng có ngày bị chiếm, kẻ tấn công thừa hưởng đúng bộ quyền mà tiến trình đang có. Một tiến trình không phải root là một phần thừa kế nhỏ hơn hẳn.</p>`],

      [24, '15.5 AI tools for this chapter - and one hard limit',
        `<p>Section 15.5 is "Integrate AI Tools for Explaining Concepts (Self Learning)" — the same closing section almost every chapter of this syllabus has.</p>
<p><strong>Good use.</strong> "Explain why sshd keeps the first value it reads." "What does an on-path attack abuse at layer 2, and why does the protocol allow it?" "Turn Module 16 into a hardening checklist I can tick off." These are explanation tasks, and a model is good at them.</p>
<p><strong>Bad use.</strong> Asking for — or accepting — a security change that you cannot verify yourself with one command afterwards. In this chapter that limit is unusually sharp, because a wrong security change does not announce itself: it looks exactly like a right one until the day it does not.</p>
<p><strong>And the dialogue point, which is CLO10.</strong> Session 50 is assessed by conversation: you present, and then you are asked why, and then you are asked why about that. A borrowed answer runs out at the second why. The defence is to run the verification yourself — <code>sshd -T</code>, <code>show ip ssh</code>, <code>ss -tlnp</code> — so that the reason you give is one you measured rather than one you were told.</p>
<p class="ghi-chu">This is also the honest version of the whole chapter: the commands are easy, and the examinable skill is knowing what their output rules out.</p>`,
        `<p>Mục 15.5 là "Integrate AI Tools for Explaining Concepts (Self Learning)" — đúng cái mục kết thúc mà gần như chương nào của syllabus này cũng có.</p>
<p><strong>Dùng tốt.</strong> "Giải thích vì sao sshd giữ giá trị đọc được đầu tiên." "Tấn công xen giữa lợi dụng điều gì ở tầng 2, và vì sao giao thức cho phép chuyện đó?" "Biến Module 16 thành một danh sách làm cứng mà tôi tick được." Đó là những việc giải thích, và mô hình làm tốt.</p>
<p><strong>Dùng dở.</strong> Yêu cầu — hoặc chấp nhận — một thay đổi an ninh mà sau đó bạn không tự nghiệm thu được bằng một câu lệnh. Ở chương này cái giới hạn ấy sắc bén khác thường, vì một thay đổi an ninh sai không tự báo mình ra: nó trông y hệt một thay đổi đúng, cho tới cái ngày nó không còn giống nữa.</p>
<p><strong>Và phần đối thoại, tức CLO10.</strong> Buổi 50 được chấm bằng trò chuyện: bạn trình bày, rồi bị hỏi vì sao, rồi lại bị hỏi vì sao về câu vừa rồi. Một câu trả lời đi mượn thì cạn ở lần "vì sao" thứ hai. Cách phòng là tự chạy phép nghiệm thu — <code>sshd -T</code>, <code>show ip ssh</code>, <code>ss -tlnp</code> — để lý do bạn đưa ra là lý do bạn ĐO ĐƯỢC chứ không phải lý do người ta bảo bạn.</p>
<p class="ghi-chu">Đây cũng là phiên bản thành thật của cả chương: câu lệnh thì dễ, còn kỹ năng được chấm là biết kết quả của nó loại trừ được điều gì.</p>`],

      [25, 'The school\'s question table drifts hardest here',
        `<p>The constructive-question table has been running about one chapter behind the session plan since session 19. For Chapter 15 the drift is at its worst, so here is the whole picture, quoted as published.</p>
<ul>
<li><strong>Session 49 — CQ17.1</strong>: "Why basic security measure are necessary on network devices?" That is section <strong>15.4</strong>, taught in session 50.</li>
<li><strong>Session 50 — CQ17.2</strong>: "How to detect vulnerabilities on the network and technical mitigation?" That is <strong>15.1 to 15.3</strong> — both sessions at once.</li>
<li><strong>Session 51 — CQ17.3</strong>: "Why do we need to mitigate security threats on a network devices?" That is <strong>15.3</strong>, but session 51 is a project session.</li>
<li><strong>Session 52 — CQ18.1</strong> and <strong>session 54 — CQ18.3</strong>: both are the <strong>firewall</strong>, section 15.3. Session 54 teaches Chapter 16.</li>
<li><strong>Session 55 — CQ19.1</strong>: "Which type of network threat is intended to prevent authorized users from accessing resources?" That is <strong>denial of service</strong>, section 15.2, and session 55 also teaches Chapter 16.</li>
</ul>
<p><strong>Also worth listing: CQ18.2 at session 53</strong> asks which attack type "may involve the use of tools such as nslookup and fping" — reconnaissance, section 15.2 — and session 53 is "Review Modules 8-15".</p>
<p><strong>What to do about it: answer by topic, not by the session number printed beside the question.</strong> The table is not corrected here, only mapped. If you are asked one of these in class, you have already read the answer — it is just filed under a different day.</p>`,
        `<p>Bảng câu hỏi kiến tạo đã chạy chậm hơn kế hoạch buổi học khoảng một chương kể từ buổi 19. Với Chương 15 thì độ trôi ở mức tệ nhất, nên đây là toàn cảnh, trích nguyên văn như đã công bố.</p>
<ul>
<li><strong>Buổi 49 — CQ17.1</strong>: "Why basic security measure are necessary on network devices?" Đó là mục <strong>15.4</strong>, dạy ở buổi 50.</li>
<li><strong>Buổi 50 — CQ17.2</strong>: "How to detect vulnerabilities on the network and technical mitigation?" Đó là <strong>15.1 tới 15.3</strong> — tức cả hai buổi gộp lại.</li>
<li><strong>Buổi 51 — CQ17.3</strong>: "Why do we need to mitigate security threats on a network devices?" Đó là <strong>15.3</strong>, nhưng buổi 51 lại là buổi làm đồ án.</li>
<li><strong>Buổi 52 — CQ18.1</strong> và <strong>buổi 54 — CQ18.3</strong>: cả hai đều là <strong>tường lửa</strong>, mục 15.3. Mà buổi 54 dạy Chương 16.</li>
<li><strong>Buổi 55 — CQ19.1</strong>: "Which type of network threat is intended to prevent authorized users from accessing resources?" Đó là <strong>từ chối dịch vụ</strong>, mục 15.2, và buổi 55 cũng dạy Chương 16.</li>
</ul>
<p><strong>Cũng đáng liệt kê: CQ18.2 ở buổi 53</strong> hỏi kiểu tấn công nào "may involve the use of tools such as nslookup and fping" — do thám, mục 15.2 — mà buổi 53 là "Review Modules 8-15".</p>
<p><strong>Làm gì với chuyện này: trả lời theo CHỦ ĐỀ, đừng trả lời theo số buổi in bên cạnh câu hỏi.</strong> Ở đây bảng gốc không bị sửa, chỉ được đối chiếu lại. Nếu bị hỏi một trong những câu đó trên lớp thì bạn đã đọc câu trả lời rồi — nó chỉ được xếp nhầm ngày.</p>`],

      [26, 'What you can do now, and what comes next',
        `<p>After Chapter 15 you should be able to do all of the following without looking anything up:</p>
<ul>
<li><strong>Separate</strong> asset, vulnerability, threat, exploit and risk — and say which one you are actually fixing.</li>
<li><strong>Classify</strong> an incident as reconnaissance, access or denial of service, and say what that classification rules out.</li>
<li><strong>Explain</strong> why spoofing works at every layer, and why security here is always an addition rather than a repair.</li>
<li><strong>Harden</strong> a Cisco device from <code>enable</code> onwards, ending at <code>transport input ssh</code>.</li>
<li><strong>Harden</strong> ★ a Linux host to key-only login, with the drop-in named so that it wins the sort.</li>
<li><strong>Verify</strong> ★ with <code>sshd -T</code> and <code>show ip ssh</code> — never by re-reading what you wrote.</li>
<li><strong>Argue</strong> ★ why fail2ban, an unpublished database port and a non-root container are three different controls serving three different purposes.</li>
</ul>
<p><strong>Next: Chapter 16 — Build a Small Network</strong> (sessions 54-55, Cisco Module 17): devices in a small network, the protocols they run, scaling to larger networks, verifying connectivity, host and IOS commands, and a troubleshooting methodology. It is the chapter where everything from Chapters 1 to 15 is assembled into one working design — and, as slide 25 showed, it is also where three of this chapter's own questions were filed.</p>`,
        `<p>Sau Chương 15, bạn nên làm được tất cả những việc sau mà không cần tra lại:</p>
<ul>
<li><strong>Tách bạch</strong> tài sản, lỗ hổng, mối đe doạ, cách khai thác và rủi ro — và nói được mình đang sửa cái nào.</li>
<li><strong>Xếp loại</strong> một sự cố thành do thám, truy cập hay từ chối dịch vụ, và nói cách xếp đó loại trừ được điều gì.</li>
<li><strong>Giải thích</strong> vì sao giả mạo chạy được ở mọi tầng, và vì sao an ninh ở đây luôn là thứ THÊM VÀO chứ không phải một phép sửa chữa.</li>
<li><strong>Làm cứng</strong> một thiết bị Cisco đủ từ <code>enable</code>, kết thúc ở <code>transport input ssh</code>.</li>
<li><strong>Làm cứng</strong> ★ một máy Linux tới mức chỉ vào được bằng khoá, với file drop-in đặt tên sao cho thắng được thứ tự sắp xếp.</li>
<li><strong>Nghiệm thu</strong> ★ bằng <code>sshd -T</code> và <code>show ip ssh</code> — không bao giờ bằng cách đọc lại thứ mình vừa ghi.</li>
<li><strong>Biện hộ</strong> ★ vì sao fail2ban, một cổng cơ sở dữ liệu không công bố, và một container không chạy root là ba biện pháp khác nhau phục vụ ba mục đích khác nhau.</li>
</ul>
<p><strong>Tiếp theo: Chương 16 — Dựng một mạng nhỏ</strong> (buổi 54-55, Cisco Module 17): các thiết bị trong một mạng nhỏ, các giao thức chúng chạy, mở rộng lên mạng lớn hơn, kiểm tra kết nối, các lệnh trên host và trên IOS, và một phương pháp luận gỡ lỗi. Đó là chương gom mọi thứ từ Chương 1 tới Chương 15 thành một thiết kế chạy được — và, như slide 25 đã cho thấy, cũng là chỗ ba câu hỏi của chính chương này bị xếp nhầm vào.</p>`],
    ]),

    bi(
      `<h3>🗺️ Hardening order, and where each step can silently fail</h3>
<pre><code class="language-mermaid">graph TD
  A["Device reachable on a network"] --&gt; B["1. no default credentials"]
  B --&gt; C["2. unused services off"]
  C --&gt; D["3. encrypted management only"]
  D --&gt; E{"Did it take effect?"}
  E --&gt;|"asked the daemon"| F["sshd -T / show ip ssh · this is proof"]
  E --&gt;|"re-read the file"| G["cat / show run only · this is NOT proof"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class E ask
  class A,B,C,D act
  class F ok
  class G bad</code></pre>
<p>Steps 1 to 3 are the part everybody does. The diamond is the part that separates a hardened device from a device somebody believes is hardened.</p>`,
      `<h3>🗺️ Thứ tự làm cứng, và chỗ từng bước có thể trượt trong im lặng</h3>
<pre><code class="language-mermaid">graph TD
  A["Thiết bị với tới được từ mạng"] --&gt; B["1. hết thông tin đăng nhập mặc định"]
  B --&gt; C["2. tắt dịch vụ không dùng"]
  C --&gt; D["3. chỉ quản trị bằng kênh mã hoá"]
  D --&gt; E{"Nó đã có hiệu lực chưa?"}
  E --&gt;|"hỏi chính tiến trình"| F["sshd -T / show ip ssh · đây là bằng chứng"]
  E --&gt;|"đọc lại cái file"| G["cat / chỉ show run · đây KHÔNG phải bằng chứng"]
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef ok fill:#eefaf4,stroke:#1f9d6b,stroke-width:2px,color:#14532d
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class E ask
  class A,B,C,D act
  class F ok
  class G bad</code></pre>
<p>Bước 1 tới 3 là phần ai cũng làm. Cái hình thoi mới là phần tách một thiết bị ĐÃ làm cứng khỏi một thiết bị mà người ta TIN là đã làm cứng.</p>`,
    ),

    bi(
      `<h3>🗺️ Which control removes which attack — they are not interchangeable</h3>
<pre><code class="language-mermaid">graph TD
  A{"What is being protected?"} --&gt;|"secrecy of the traffic"| B["encryption with verified identity · SSH, VPN, TLS"]
  A --&gt;|"who may connect at all"| C["hardening + least exposure · keys, no published port"]
  A --&gt;|"the service staying up"| D["capacity and upstream filtering · plus a tested backup"]
  B --&gt; E["does NOT help availability"]
  C --&gt; E
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class A ask
  class B,C,D act
  class E bad</code></pre>
<p>The bottom node is the point of the diagram. Two very strong controls converge on the same admission: neither of them does anything at all about a denial-of-service attack.</p>`,
      `<h3>🗺️ Biện pháp nào gỡ được kiểu tấn công nào — chúng KHÔNG thay nhau được</h3>
<pre><code class="language-mermaid">graph TD
  A{"Đang bảo vệ cái gì?"} --&gt;|"tính kín của lưu lượng"| B["mã hoá có kiểm danh tính · SSH, VPN, TLS"]
  A --&gt;|"ai được phép kết nối"| C["làm cứng + phơi ra ít nhất · khoá, không công bố cổng"]
  A --&gt;|"dịch vụ còn sống"| D["dung lượng và lọc ở phía trên · cộng một bản sao lưu đã thử"]
  B --&gt; E["KHÔNG giúp gì cho tính sẵn sàng"]
  C --&gt; E
  classDef ask fill:#fff8e8,stroke:#b4690e,stroke-width:2px,color:#7a4708
  classDef act fill:#eaf3fc,stroke:#1b5fa8,stroke-width:2px,color:#0f2a4a
  classDef bad fill:#fdeeee,stroke:#d94b4b,stroke-width:2px,color:#8f2c2c
  class A ask
  class B,C,D act
  class E bad</code></pre>
<p>Nút dưới cùng mới là ý của sơ đồ. Hai biện pháp rất mạnh cùng dẫn tới một lời thú nhận: cả hai đều không làm được gì trước một cuộc tấn công từ chối dịch vụ.</p>`,
    ),

    bi(
      `<h3>🔍 Cách tự kiểm - prove the hardening, do not describe it</h3>
<p>Four commands, in this order, on a host you own. Each one asks a different thing, and the last one asks from outside.</p>
<pre><code class="language-bash">sshd -T | grep -E '^(passwordauthentication|permitrootlogin|kbdinteractiveauthentication)'
ss -tlnp | grep -E ':(22|5432|3000)\\b'
docker compose ps --format '{{.Service}} {{.Ports}}'
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no user@host</code></pre>
<p>What a hardened host answers:</p>
<pre><code class="language-plaintext">passwordauthentication no
kbdinteractiveauthentication no
permitrootlogin prohibit-password
LISTEN 0 4096   0.0.0.0:22       users:(("sshd",pid=812,fd=3))
Permission denied (publickey).</code></pre>
<div class="callout ok"><strong>What each result proves, and what it does not.</strong> Line 1 is the effective config, so it survives include order — unlike <code>cat</code>. The absence of <code>0.0.0.0:5432</code> in the listening list is the proof that the database is not published; a compose file saying so is not proof, because a stale container keeps the ports it was created with. And <code>Permission denied (publickey)</code> is the only one of the four that was answered from <em>outside</em> the machine — the server has just told a stranger that it will not discuss passwords.</div>
<div class="callout warn"><strong>Before you run the third of these on a session you need.</strong> Open a second terminal and keep it logged in while you change SSH settings. If the change locks you out, the old session is the only way back. This costs nothing and has saved every administrator who has done it once.</div>`,
      `<h3>🔍 Cách tự kiểm - hãy CHỨNG MINH việc làm cứng, đừng mô tả nó</h3>
<p>Bốn câu lệnh, theo đúng thứ tự này, trên một máy của chính bạn. Mỗi câu hỏi một thứ khác nhau, và câu cuối hỏi từ bên ngoài.</p>
<pre><code class="language-bash">sshd -T | grep -E '^(passwordauthentication|permitrootlogin|kbdinteractiveauthentication)'
ss -tlnp | grep -E ':(22|5432|3000)\\b'
docker compose ps --format '{{.Service}} {{.Ports}}'
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no user@host</code></pre>
<p>Một máy đã làm cứng sẽ trả lời thế này:</p>
<pre><code class="language-plaintext">passwordauthentication no
kbdinteractiveauthentication no
permitrootlogin prohibit-password
LISTEN 0 4096   0.0.0.0:22       users:(("sshd",pid=812,fd=3))
Permission denied (publickey).</code></pre>
<div class="callout ok"><strong>Mỗi kết quả chứng minh điều gì, và không chứng minh điều gì.</strong> Dòng 1 là cấu hình đang có hiệu lực, nên nó sống sót qua thứ tự include — khác hẳn <code>cat</code>. Việc KHÔNG thấy <code>0.0.0.0:5432</code> trong danh sách đang nghe mới là bằng chứng cơ sở dữ liệu không bị công bố; một file compose nói vậy thì chưa phải bằng chứng, vì một container cũ vẫn giữ nguyên bộ cổng lúc nó được tạo ra. Và <code>Permission denied (publickey)</code> là cái duy nhất trong bốn cái được trả lời từ <em>bên ngoài</em> cái máy — máy chủ vừa nói với một người lạ rằng nó sẽ không bàn chuyện mật khẩu.</div>
<div class="callout warn"><strong>Trước khi chạy mấy thứ này trên một phiên mà bạn đang cần.</strong> Hãy mở một cửa sổ terminal thứ hai và giữ nó đang đăng nhập trong lúc bạn đổi cấu hình SSH. Nếu thay đổi khoá bạn ở ngoài, cái phiên cũ là đường quay về duy nhất. Việc này không tốn gì và đã cứu mọi người quản trị từng làm nó một lần.</div>`,
    ),

    bi(
      `<div class="pitfall co-tieu-de"><strong>Trap 1 - verifying with <code>cat</code> instead of the daemon.</strong> <b>Symptom:</b> the file says exactly what you wanted, the syntax check passes, the reload returns 0, and the setting is not in force. ★ Measured: <code>70-no-password.conf</code> lost to <code>50-cloud-init.conf</code>, and only <code>sshd -T</code> revealed it. The tell-tale is that it was <em>half</em> applied — one keyword took, the other did not.</div>
<div class="pitfall co-tieu-de"><strong>Trap 2 - configuring SSH but leaving Telnet permitted.</strong> <b>Symptom:</b> a device that passes "we use SSH" in a review and still accepts a cleartext login on port 23. Without <code>transport input ssh</code> the old door is open beside the new one, and an attacker will use the open one. The check is <code>show run | section line vty</code>, not the memory of having configured SSH.</div>
<div class="pitfall co-tieu-de"><strong>Trap 3 - disabling password login while holding exactly one key.</strong> <b>Symptom:</b> a server you can no longer reach, with no password path left to rescue you. Enrol a second key from a second machine, test it, and keep a second session open while making the change. Recovery afterwards means the provider's console, or a rebuild.</div>
<div class="pitfall co-tieu-de"><strong>Trap 4 - treating fail2ban as the fix.</strong> <b>Symptom:</b> a ban list that grows every day on a host that still accepts passwords, and a feeling of safety that delays the actual fix. Five guesses per window forever is a rate limit; <code>PasswordAuthentication no</code> is a closed door. Keys first, then fail2ban.</div>
<div class="pitfall co-tieu-de"><strong>Trap 5 - running a container as root so it can bind port 80.</strong> <b>Symptom:</b> the port number looks tidy and a real security property has quietly been traded away — if the application is ever compromised, the attacker inherits root. Listen high and let the reverse proxy own 443. "Permission denied" on port 80 is least privilege working, not a bug.</div>`,
      `<div class="pitfall co-tieu-de"><strong>Bẫy 1 - nghiệm thu bằng <code>cat</code> thay vì hỏi chính tiến trình.</strong> <b>Triệu chứng:</b> file ghi đúng y thứ bạn muốn, phép kiểm cú pháp qua, lệnh nạp lại trả về 0, mà thiết lập thì không có hiệu lực. ★ Đo thật: <code>70-no-password.conf</code> thua <code>50-cloud-init.conf</code>, và chỉ <code>sshd -T</code> mới lộ ra chuyện đó. Dấu hiệu chỉ điểm là nó ăn có <em>một nửa</em> — từ khoá này ăn, từ khoá kia không.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 2 - cấu hình SSH nhưng vẫn để Telnet được phép.</strong> <b>Triệu chứng:</b> một thiết bị qua được mục "bên mình dùng SSH" khi rà soát mà vẫn nhận đăng nhập chữ trần ở cổng 23. Thiếu <code>transport input ssh</code> thì cửa cũ vẫn mở bên cạnh cửa mới, và kẻ tấn công sẽ dùng cái đang mở. Phép kiểm là <code>show run | section line vty</code>, chứ không phải trí nhớ rằng mình đã cấu hình SSH.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 3 - tắt đăng nhập mật khẩu khi trong tay chỉ có đúng MỘT khoá.</strong> <b>Triệu chứng:</b> một máy chủ bạn không còn vào được, và không còn đường mật khẩu nào để cứu. Hãy nạp khoá thứ hai từ một máy thứ hai, thử cho chắc, và giữ một phiên thứ hai đang mở trong lúc đổi. Cứu vãn sau đó nghĩa là dùng console của nhà cung cấp, hoặc dựng lại máy.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 4 - coi fail2ban là cách sửa.</strong> <b>Triệu chứng:</b> một danh sách cấm dài thêm mỗi ngày trên cái máy vẫn nhận mật khẩu, kèm một cảm giác an toàn làm chậm cách sửa thật sự. Năm lần đoán mỗi cửa sổ thời gian, mãi mãi, là một giới hạn nhịp; <code>PasswordAuthentication no</code> là một cánh cửa đóng. Khoá trước, fail2ban sau.</div>
<div class="pitfall co-tieu-de"><strong>Bẫy 5 - cho container chạy bằng root để nó bind được cổng 80.</strong> <b>Triệu chứng:</b> con số cổng nhìn gọn mắt còn một tính chất an ninh có thật thì vừa bị lặng lẽ đem đổi — nếu ứng dụng có ngày bị chiếm, kẻ tấn công thừa hưởng quyền root. Hãy nghe ở cổng cao và để reverse proxy sở hữu 443. Dòng "Permission denied" ở cổng 80 là đặc quyền tối thiểu đang chạy, không phải một con bọ.</div>`,
    ),

    bi(
      `<h3>Exercises</h3>
<p><b>E1.</b> A device review reports: "SSH configured, keys generated, version 2, admin user created." Name the one line that is missing, explain what an attacker does about it, and give the command that would have caught the gap.</p>
<div class="dap-an"><p><b>The missing line is <code>transport input ssh</code> on the vty lines.</b> Everything in the report is true and none of it closes Telnet. The vty lines still accept <code>transport input all</code> by default on many images, so port 23 continues to answer.</p>
<p><b>What an attacker does about it: nothing clever.</b> They connect by Telnet, because it is open, and the password crosses the network in cleartext where anyone on the path can read it. The SSH configuration sits beside it, correct and unused.</p>
<p><b>The command that catches it:</b></p>
<pre><code class="language-bash">show run | section line vty</code></pre>
<p>If the output does not contain <code>transport input ssh</code>, the review was wrong. Note the shape of this answer: the report described what had been <em>configured</em>, and the command asks what the device will <em>accept</em>. Those are different questions, and only the second one is a security statement.</p></div>

<p><b>E2.</b> ★ You write <code>/etc/ssh/sshd_config.d/70-hardening.conf</code> containing two directives: <code>PasswordAuthentication no</code> and <code>PermitRootLogin prohibit-password</code>. After a reload, root login by password is refused but ordinary users can still log in with a password. Nothing errored. What happened, and what is the fix?</p>
<div class="dap-an"><p><b>An ordering clash, not a syntax error — and the half-applied result is exactly how you tell the two apart.</b></p>
<p><b>The mechanism.</b> For most keywords, sshd uses the <b>first</b> value it obtains, and <code>Include /etc/ssh/sshd_config.d/*.conf</code> expands in alphabetical order. The machine already carried <code>50-cloud-init.conf</code> with <code>PasswordAuthentication yes</code> in it, written at build time. <code>50-</code> sorts before <code>70-</code>, so <code>yes</code> was read first and won; your <code>no</code> was read second and discarded in silence.</p>
<p><b>Why the other directive worked.</b> Nothing else on the system declared <code>PermitRootLogin</code>, so there was no competing first value and yours was the first. <b>One keyword applying while another from the same file does not is the signature of a collision</b> — a genuine syntax error would have failed the whole file and <code>sshd -t</code> would have said so.</p>
<p><b>The fix: rename the file so it sorts first.</b></p>
<pre><code class="language-bash">sudo mv /etc/ssh/sshd_config.d/70-hardening.conf /etc/ssh/sshd_config.d/01-no-password.conf
sudo sshd -t &amp;&amp; sudo systemctl reload ssh
sshd -T | grep ^passwordauthentication</code></pre>
<p>The third line is the acceptance test, and it must print <code>passwordauthentication no</code>. <b>Do not accept <code>cat</code> as the verification</b> — the file was already correct when the setting was wrong.</p>
<p><b>Why <code>01-</code> and not editing the cloud-init file:</b> rebuilding the machine makes cloud-init write <code>50-</code> again. <code>01-</code> keeps winning; an edit does not survive.</p></div>

<p><b>E3.</b> ★ A small web application runs in Docker on one public VPS: nginx, a Node backend, and PostgreSQL. Write down the four controls you would apply, say which of the three properties each one protects, and name the command that proves each is in place.</p>
<div class="dap-an"><p><b>1. Key-only SSH.</b> Protects <b>confidentiality</b> of administrative access, and indirectly everything else, since a stolen shell is a stolen system. Proof: <code>sshd -T | grep ^passwordauthentication</code> must print <code>no</code>, and a password attempt from outside must return <code>Permission denied (publickey)</code>.</p>
<p><b>2. Do not publish 5432.</b> Protects <b>confidentiality</b> and <b>integrity</b> of the data. The database then lives only on <code>172.18.0.0/16</code>, which is RFC 1918 space that no Internet router carries a route to, so the packet has no path rather than being filtered. Proof: <code>ss -tlnp | grep 5432</code> shows nothing on <code>0.0.0.0</code>.</p>
<p><b>3. Non-root containers.</b> Protects <b>integrity</b> by bounding what a compromised application inherits. Proof: <code>docker compose exec backend id</code> must not print <code>uid=0</code>. Expect the application to listen on a high port, and let nginx own 443.</p>
<p><b>4. A tested backup.</b> Protects <b>availability</b> and <b>integrity</b>, and it is the only one of the four that helps after something has already gone wrong. Proof: a restore into a scratch database, plus a row count compared against production. A backup job reporting success is not proof.</p>
<p><b>What is deliberately not on the list, and why.</b> fail2ban — it reduces log noise, but with passwords disabled it protects nothing, so it is an optional fifth rather than one of the four. And DDoS protection, because nothing you configure on this VPS changes the outcome once the link is full; that control lives upstream at the provider.</p>
<p class="ghi-chu">Notice that three of the four are <b>configuration</b> vulnerabilities in the Cisco sense — the middle category, the one you fix for free. That is the pattern the whole chapter is built on.</p></div>`,
      `<h3>Bài tập</h3>
<p><b>E1.</b> Một biên bản rà soát thiết bị ghi: "Đã cấu hình SSH, đã sinh khoá, phiên bản 2, đã tạo người dùng admin." Hãy gọi tên MỘT dòng còn thiếu, giải thích kẻ tấn công làm gì với chỗ thiếu đó, và cho câu lệnh lẽ ra đã bắt được lỗ hổng này.</p>
<div class="dap-an"><p><b>Dòng còn thiếu là <code>transport input ssh</code> trên các đường vty.</b> Mọi thứ trong biên bản đều đúng và không thứ nào đóng Telnet lại. Trên nhiều bản IOS, các đường vty vẫn mặc định nhận <code>transport input all</code>, nên cổng 23 vẫn cứ đáp.</p>
<p><b>Kẻ tấn công làm gì với chỗ đó: không cần khôn khéo gì cả.</b> Họ kết nối bằng Telnet, vì nó đang mở, và mật khẩu đi qua mạng ở dạng chữ trần, ai trên đường đi cũng đọc được. Phần cấu hình SSH thì nằm cạnh đó, đúng đắn và không ai dùng.</p>
<p><b>Câu lệnh bắt được chuyện này:</b></p>
<pre><code class="language-bash">show run | section line vty</code></pre>
<p>Nếu kết xuất không chứa <code>transport input ssh</code> thì biên bản rà soát đã sai. Hãy để ý hình dạng của câu trả lời này: biên bản mô tả thứ đã được <em>cấu hình</em>, còn câu lệnh hỏi thứ thiết bị sẽ <em>chấp nhận</em>. Đó là hai câu hỏi khác nhau, và chỉ cái thứ hai mới là một phát biểu về an ninh.</p></div>

<p><b>E2.</b> ★ Bạn ghi file <code>/etc/ssh/sshd_config.d/70-hardening.conf</code> gồm hai chỉ thị: <code>PasswordAuthentication no</code> và <code>PermitRootLogin prohibit-password</code>. Sau khi nạp lại, root đăng nhập bằng mật khẩu thì bị từ chối, mà người dùng thường vẫn vào được bằng mật khẩu. Không có lỗi nào. Chuyện gì đã xảy ra, và sửa thế nào?</p>
<div class="dap-an"><p><b>Một va chạm thứ tự, không phải lỗi cú pháp — và chính cái kết quả nửa ăn nửa trượt là cách phân biệt hai thứ đó.</b></p>
<p><b>Cơ chế.</b> Với phần lớn từ khoá, sshd dùng giá trị <b>ĐẦU TIÊN</b> nó đọc được, mà <code>Include /etc/ssh/sshd_config.d/*.conf</code> bung ra theo thứ tự chữ cái. Cái máy đã sẵn mang <code>50-cloud-init.conf</code> với dòng <code>PasswordAuthentication yes</code> bên trong, ghi từ lúc dựng máy. <code>50-</code> sắp trước <code>70-</code>, nên <code>yes</code> được đọc trước và thắng; chữ <code>no</code> của bạn được đọc sau và bị vứt đi trong im lặng.</p>
<p><b>Vì sao chỉ thị kia lại ăn.</b> Không có gì khác trên hệ thống khai <code>PermitRootLogin</code>, nên không có giá trị đầu tiên nào tranh với nó và giá trị của bạn chính là giá trị đầu tiên. <b>Một từ khoá có hiệu lực trong khi từ khoá kia cùng file thì không, đó là chữ ký của một va chạm</b> — một lỗi cú pháp thật sự sẽ làm hỏng cả file và <code>sshd -t</code> đã phải báo rồi.</p>
<p><b>Cách sửa: đổi tên file cho nó sắp trước.</b></p>
<pre><code class="language-bash">sudo mv /etc/ssh/sshd_config.d/70-hardening.conf /etc/ssh/sshd_config.d/01-no-password.conf
sudo sshd -t &amp;&amp; sudo systemctl reload ssh
sshd -T | grep ^passwordauthentication</code></pre>
<p>Dòng thứ ba là phép nghiệm thu, và nó phải in ra <code>passwordauthentication no</code>. <b>Đừng chấp nhận <code>cat</code> làm phép nghiệm thu</b> — cái file đã đúng sẵn từ lúc thiết lập còn đang sai.</p>
<p><b>Vì sao dùng <code>01-</code> chứ không sửa thẳng file cloud-init:</b> dựng lại máy là cloud-init ghi lại <code>50-</code>. <code>01-</code> thì vẫn cứ thắng; một lần sửa file thì không sống sót.</p></div>

<p><b>E3.</b> ★ Một ứng dụng web nhỏ chạy trong Docker trên một con VPS công khai: nginx, một backend Node, và PostgreSQL. Hãy viết ra bốn biện pháp bạn sẽ áp dụng, nói mỗi biện pháp bảo vệ tính chất nào trong ba tính chất, và gọi tên câu lệnh chứng minh từng cái đã ở đúng chỗ.</p>
<div class="dap-an"><p><b>1. SSH chỉ bằng khoá.</b> Bảo vệ <b>tính bí mật</b> của đường quản trị, và gián tiếp bảo vệ mọi thứ còn lại, vì một cái shell bị lấy là cả hệ thống bị lấy. Bằng chứng: <code>sshd -T | grep ^passwordauthentication</code> phải in <code>no</code>, và một lần thử bằng mật khẩu từ bên ngoài phải trả về <code>Permission denied (publickey)</code>.</p>
<p><b>2. Không công bố cổng 5432.</b> Bảo vệ <b>tính bí mật</b> và <b>tính toàn vẹn</b> của dữ liệu. Khi đó cơ sở dữ liệu chỉ sống trên <code>172.18.0.0/16</code>, vốn là không gian RFC 1918 mà không router Internet nào mang tuyến tới, nên gói tin không có đường đi chứ không phải bị lọc. Bằng chứng: <code>ss -tlnp | grep 5432</code> không hiện gì trên <code>0.0.0.0</code>.</p>
<p><b>3. Container không chạy root.</b> Bảo vệ <b>tính toàn vẹn</b> bằng cách giới hạn thứ mà một ứng dụng bị chiếm thừa hưởng được. Bằng chứng: <code>docker compose exec backend id</code> không được in ra <code>uid=0</code>. Hãy chuẩn bị tinh thần rằng ứng dụng sẽ nghe ở một cổng cao, và để nginx sở hữu cổng 443.</p>
<p><b>4. Một bản sao lưu đã thử phục hồi.</b> Bảo vệ <b>tính sẵn sàng</b> và <b>tính toàn vẹn</b>, và là cái duy nhất trong bốn cái còn giúp được sau khi chuyện đã xảy ra. Bằng chứng: phục hồi vào một cơ sở dữ liệu tạm, rồi đếm số dòng và so với bản sản xuất. Một tác vụ sao lưu báo thành công thì chưa phải bằng chứng.</p>
<p><b>Thứ cố ý KHÔNG có trong danh sách, và vì sao.</b> fail2ban — nó giảm ồn cho log, nhưng khi mật khẩu đã tắt thì nó không bảo vệ gì, nên nó là cái thứ năm tuỳ chọn chứ không phải một trong bốn. Và chống DDoS, vì không thứ gì bạn cấu hình trên con VPS này làm đổi được kết cục một khi đường truyền đã đầy; biện pháp đó sống ở phía trên, tại nhà cung cấp.</p>
<p class="ghi-chu">Để ý ba trong bốn cái đều là lỗ hổng <b>cấu hình</b> theo đúng nghĩa của Cisco — nhóm ở giữa, nhóm sửa không mất tiền. Đó là mô-típ mà cả chương này dựng lên trên đó.</p></div>`,
    ),

    cq(50, [
      ['CQ17.2', 'How to detect vulnerabilities on the network and technical mitigation? <em>- this spans sections <strong>15.1 to 15.3</strong>, which is both sessions of this chapter rather than this one alone.</em>',
        'How to detect vulnerabilities on the network and technical mitigation? <em>- câu này trải từ mục <strong>15.1 tới 15.3</strong>, tức cả hai buổi của chương chứ không riêng buổi này.</em>'],
    ]),

    bi(
      `<div class="note-ct"><p><strong>About this question, and the four others that belong to this chapter.</strong> CQ17.2 is quoted exactly as published. It covers 15.1, 15.2 and 15.3 at once — so it is really a question for the whole chapter, printed against its second half.</p>
<p><strong>A direct answer, in two halves.</strong> <em>Detect:</em> ask the device what it is exposing rather than reading a document about it — <code>ss -tlnp</code> for what is listening and on which address, <code>sshd -T</code> for the authentication settings actually in force, <code>show run | section line vty</code> for what a Cisco device will accept, and the authentication log for what is already knocking. <em>Mitigate:</em> work down the defence-in-depth layers and, at each one, name the property you are protecting before choosing the control, because encryption cannot buy availability and a backup cannot buy confidentiality.</p>
<p><strong>The rest of this chapter's questions are filed elsewhere.</strong> CQ17.1 at session 49 is section 15.4, answered in this lesson. CQ17.3 at session 51 (a project session) is 15.3. CQ18.1 at session 52 and CQ18.3 at session 54 are both the firewall, 15.3. CQ18.2 at session 53 is reconnaissance, 15.2. CQ19.1 at session 55 is denial of service, 15.2 — and sessions 54 and 55 teach Chapter 16. The table is quoted as published and is not corrected here; answer by topic, not by the session number beside the question.</p></div>`,
      `<div class="note-ct"><p><strong>Về câu hỏi này, và bốn câu khác cũng thuộc chương này.</strong> CQ17.2 được trích nguyên văn như đã công bố. Nó phủ cả 15.1, 15.2 và 15.3 cùng lúc — nên thực chất nó là câu hỏi cho cả chương, mà lại được in ở nửa sau.</p>
<p><strong>Trả lời thẳng, chia hai nửa.</strong> <em>Phát hiện:</em> hãy HỎI thiết bị xem nó đang phơi ra cái gì thay vì đọc một tài liệu nói về chuyện đó — <code>ss -tlnp</code> cho biết cái gì đang nghe và nghe trên địa chỉ nào, <code>sshd -T</code> cho biết thiết lập xác thực nào thật sự đang có hiệu lực, <code>show run | section line vty</code> cho biết một thiết bị Cisco sẽ chấp nhận cái gì, và nhật ký xác thực cho biết ai đang gõ cửa. <em>Giảm thiểu:</em> đi xuống lần lượt các lớp phòng thủ, và ở mỗi lớp hãy gọi tên tính chất bạn đang bảo vệ TRƯỚC khi chọn biện pháp, bởi mã hoá không mua được tính sẵn sàng và sao lưu không mua được tính bí mật.</p>
<p><strong>Các câu còn lại của chương này bị xếp ở chỗ khác.</strong> CQ17.1 ở buổi 49 là mục 15.4, đã trả lời trong bài này. CQ17.3 ở buổi 51 (một buổi làm đồ án) là 15.3. CQ18.1 ở buổi 52 và CQ18.3 ở buổi 54 đều là tường lửa, 15.3. CQ18.2 ở buổi 53 là do thám, 15.2. CQ19.1 ở buổi 55 là từ chối dịch vụ, 15.2 — mà buổi 54 và 55 thì dạy Chương 16. Bảng gốc được trích nguyên văn và không bị sửa ở đây; hãy trả lời theo chủ đề, đừng theo số buổi in bên cạnh câu hỏi.</p></div>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ─────────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 15 — Network Security Fundamentals|||Quiz Chương 15 — Nền tảng an ninh mạng',
  slug: 'nwc204-ch15-quiz',
  type: 'QUIZ',
  description: '12 câu song ngữ cho chương 15: lỗ hổng khác rủi ro, tường lửa mù trước lưu lượng cùng LAN, worm không cần người nên phải phân đoạn mạng, ba nhóm lỗ hổng và nhóm sửa không mất tiền, xếp loại do thám, vì sao mọi nguồn DDoS đều vô tội, mã hoá không mua được tính sẵn sàng, transport input ssh mới là dòng đóng cửa Telnet, enable secret khác enable password, bẫy thứ tự drop-in của sshd, nghiệm thu bằng sshd -T chứ không bằng cat, fail2ban chỉ giảm ồn, và vì sao đừng publish cổng 5432.',
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('The same missing patch exists on an isolated test box and on the public database server. What differs?|||Cùng một bản vá còn thiếu, tồn tại trên một máy thử nghiệm cô lập và trên máy chủ cơ sở dữ liệu công khai. Khác nhau ở đâu?',
        ['The risk|||Rủi ro', 'The exploit|||Cách khai thác', 'Nothing differs|||Không có gì khác', 'The vulnerability|||Lỗ hổng'],
        0,
        'The vulnerability is identical - it is the same weakness in the same software. Risk is likelihood combined with impact, and both differ enormously between an isolated box and a public database. This is why a list of findings with no ordering never gets worked through: sort by risk, not by count. Note also that you never fix a risk directly. You fix the vulnerability, and the risk changes as a result.|||Lỗ hổng thì giống hệt nhau - cùng một điểm yếu trong cùng một phần mềm. Rủi ro là khả năng xảy ra nhân với mức thiệt hại, và cả hai thứ đó khác nhau rất xa giữa một máy cô lập và một cơ sở dữ liệu công khai. Đó là lý do một danh sách phát hiện không có thứ tự thì không bao giờ làm xong: hãy sắp theo rủi ro chứ đừng sắp theo số lượng. Cũng lưu ý là bạn không bao giờ sửa rủi ro một cách trực tiếp. Bạn sửa lỗ hổng, và rủi ro đổi theo.'),

      q('A laptop returns from a conference infected and is plugged into a flat office network. What does the perimeter firewall do about it?|||Một laptop đi hội thảo về mang theo mã độc và được cắm vào một mạng văn phòng phẳng. Tường lửa ở vành đai làm được gì?',
        ['It alerts on the new MAC address|||Nó cảnh báo về địa chỉ MAC mới', 'It blocks the infected traffic|||Nó chặn luồng lưu lượng nhiễm độc', 'Nothing - that traffic never crosses it|||Không gì cả - luồng đó không bao giờ đi qua nó', 'It quarantines the laptop|||Nó cách ly cái laptop'],
        2,
        'A firewall filters what CROSSES it. Packets from the laptop to the other machines on the same LAN stay local and never reach the router, so the firewall never inspects one. The perimeter was not breached - the threat walked in through the front door. This single fact is the entire reason section 15.4 Device Security exists: if the network cannot protect a device from its neighbours, the device has to protect itself.|||Tường lửa lọc thứ ĐI QUA nó. Gói tin từ cái laptop tới các máy khác trên cùng LAN nằm lại nội bộ và không bao giờ tới router, nên tường lửa không soi lấy một gói. Vành đai không hề bị chọc thủng - mối đe doạ đi thẳng qua cửa chính. Đúng một sự thật đó là toàn bộ lý do mục 15.4 An ninh thiết bị tồn tại: nếu mạng không bảo vệ nổi một thiết bị trước láng giềng của nó thì thiết bị phải tự bảo vệ mình.'),

      q('Why is user training not a defence against a worm?|||Vì sao tập huấn người dùng không phải là cách chống worm?',
        ['Worms are encrypted|||Worm được mã hoá', 'Training takes too long|||Tập huấn mất quá nhiều thời gian', 'Worms only attack servers|||Worm chỉ tấn công máy chủ', 'A worm spreads by itself, so nobody has to make a mistake|||Worm tự lan, nên không ai phải phạm sai lầm nào cả'],
        3,
        'Sort malware by what it needs from a human. A virus needs somebody to run a file; a trojan needs somebody to want it. A worm needs nothing at all - it spreads across the network by itself. So "our users are careful" changes nothing about the outcome, and training belongs to the trojan and phishing rows. The control that works against a worm is SEGMENTATION: it can only reach what the network permits it to reach. This is the first place in the course where a security requirement changes a topology rather than a setting.|||Hãy sắp mã độc theo thứ nó cần ở con người. Virus cần có người chạy một tệp; trojan cần có người muốn nó. Worm thì không cần gì cả - nó tự lan qua mạng. Nên câu "người dùng bên mình cẩn thận" không làm đổi kết cục, và tập huấn thuộc về hàng trojan và lừa đảo. Biện pháp có tác dụng trước worm là PHÂN ĐOẠN MẠNG: nó chỉ với tới được đúng những gì mạng cho phép. Đây là chỗ đầu tiên trong cả môn mà một yêu cầu an ninh làm đổi cấu trúc mạng chứ không chỉ đổi một thiết lập.'),

      q('Which of the three Cisco vulnerability categories can you fix today, on every device you own, for free?|||Trong ba nhóm lỗ hổng của Cisco, nhóm nào bạn sửa được ngay hôm nay, trên mọi thiết bị của mình, mà không tốn tiền?',
        ['Technological|||Công nghệ', 'Configuration|||Cấu hình', 'Policy|||Chính sách', 'All three equally|||Cả ba như nhau'],
        1,
        'Technological vulnerabilities are the vendor problem until a patch exists. Policy vulnerabilities need people and process, and no command helps. Configuration vulnerabilities - a default password still in place, an unused service still listening, a management interface reachable from anywhere - need no vendor, no purchase and no permission. In small networks this is where most real incidents begin, which is exactly why the syllabus gives a whole section to device hardening.|||Lỗ hổng công nghệ là việc của nhà cung cấp cho tới khi có bản vá. Lỗ hổng chính sách cần con người và quy trình, không câu lệnh nào giúp được. Lỗ hổng cấu hình - mật khẩu mặc định còn nguyên, dịch vụ thừa vẫn đang nghe, giao diện quản trị với tới được từ khắp nơi - thì không cần nhà cung cấp, không cần mua, không cần xin phép. Trong các mạng nhỏ thì phần lớn sự cố thật bắt đầu từ đây, và đó đúng là lý do syllabus dành hẳn một mục cho việc làm cứng thiết bị.'),

      q('Your log shows hundreds of refused connections from many addresses, and no session ever succeeded. Which family is this?|||Log của bạn hiện hàng trăm kết nối bị từ chối từ rất nhiều địa chỉ, và chưa phiên nào thành công. Đây là họ nào?',
        ['Reconnaissance|||Do thám', 'Denial of service|||Từ chối dịch vụ', 'On-path attack|||Tấn công xen giữa', 'Access attack|||Tấn công truy cập'],
        0,
        'Nothing got in and nothing stopped working, so it is neither access nor denial of service. It is reconnaissance plus automated attempts, and on a public address it is permanent background noise aimed at everybody rather than a targeted event. The question that decides whether it matters is not how many attempts there are but whether any of them could possibly succeed - and with password authentication disabled the answer is no, at any volume. Reconnaissance is also the only free warning you get: step one is noisy and harmless, step two is quiet and fatal.|||Không có gì vào được và không có gì ngừng chạy, nên nó không phải truy cập cũng không phải từ chối dịch vụ. Đó là do thám cộng với thử tự động, và trên một địa chỉ công khai thì nó là tiếng ồn nền vĩnh viễn nhắm vào tất cả mọi người chứ không phải một sự kiện nhắm vào bạn. Câu hỏi quyết định chuyện đó có đáng lo không, không phải là có bao nhiêu lần thử, mà là có lần nào có khả năng thành công không - và khi đã tắt xác thực bằng mật khẩu thì câu trả lời là không, ở bất kỳ số lượng nào. Do thám cũng là lời cảnh báo miễn phí duy nhất bạn nhận được: bước một ồn ào mà vô hại, bước hai im lặng mà chí tử.'),

      q('Why is blocking the source addresses a poor answer to a DDoS attack?|||Vì sao chặn các địa chỉ nguồn là một câu trả lời tồi trước một cuộc tấn công DDoS?',
        ['Firewalls cannot block by address|||Tường lửa không chặn được theo địa chỉ', 'It requires a router reboot|||Việc đó đòi phải khởi động lại router', 'The addresses change too fast|||Các địa chỉ đổi quá nhanh', 'None of the sources is the attacker - they are real machines, and there may be thousands|||Không nguồn nào trong số đó là kẻ tấn công - chúng là máy thật, và có thể có hàng nghìn cái'],
        3,
        'In a distributed attack the sources are real machines belonging to real people, infected and directed. Blocking them blocks innocent users too, and the list can run to tens of thousands. Worse, if the volume is large enough to fill your link then by the time the traffic reaches your firewall it has already consumed the thing you were protecting - a rule on your own box arrives too late by definition. The defence is capacity and filtering UPSTREAM at the provider, which is why DDoS mitigation is bought rather than configured. Note which property this attacks: availability. Encryption and hardening do nothing for it.|||Trong một cuộc tấn công phân tán, các nguồn là máy thật của người thật, bị nhiễm và bị điều khiển. Chặn chúng là chặn luôn người dùng vô tội, và danh sách có thể lên tới hàng vạn. Tệ hơn, nếu lưu lượng đủ lớn để lấp đầy đường truyền thì tới lúc nó chạm tường lửa của bạn, nó đã tiêu thụ xong đúng cái bạn đang bảo vệ - một luật trên chính máy bạn, theo định nghĩa, là đã tới muộn. Cách chống là dung lượng và lọc Ở PHÍA TRÊN tại nhà cung cấp, và đó là lý do chống DDoS là thứ người ta MUA chứ không phải cấu hình. Để ý nó đánh vào tính chất nào: tính sẵn sàng. Mã hoá và làm cứng không giúp gì cả.'),

      q('You encrypt everything end to end with verified identities. Which property is still completely unprotected?|||Bạn mã hoá đầu-cuối mọi thứ và có kiểm danh tính. Tính chất nào vẫn hoàn toàn không được bảo vệ?',
        ['All three are now protected|||Cả ba giờ đều được bảo vệ', 'Confidentiality|||Tính bí mật', 'Availability|||Tính sẵn sàng', 'Integrity|||Tính toàn vẹn'],
        2,
        'Encryption buys confidentiality, and with a signature it buys integrity. It buys no availability at all: a denial-of-service attack against an encrypted service works exactly as well as against a plaintext one. This is the clearest demonstration in the chapter that controls are not interchangeable. Name the property before choosing the control - a tested backup is an availability and integrity control that does nothing for confidentiality, and an access list is the reverse.|||Mã hoá mua được tính bí mật, và kèm chữ ký thì mua thêm tính toàn vẹn. Nó không mua được chút tính sẵn sàng nào: một cuộc tấn công từ chối dịch vụ nhằm vào dịch vụ mã hoá hiệu quả y hệt như nhằm vào dịch vụ chạy trần. Đây là minh hoạ rõ nhất trong chương cho chuyện các biện pháp không thay thế nhau được. Hãy gọi tên tính chất trước khi chọn biện pháp - một bản sao lưu đã thử là biện pháp cho tính sẵn sàng và toàn vẹn mà không làm gì cho tính bí mật, còn danh sách kiểm soát truy cập thì ngược lại.'),

      q('SSH is configured on a router, keys generated, version 2 set. Telnet still works. What line is missing?|||Router đã cấu hình SSH, đã sinh khoá, đặt phiên bản 2. Telnet vẫn vào được. Thiếu dòng nào?',
        ['ip ssh version 2|||ip ssh version 2', 'transport input ssh on the vty lines|||transport input ssh trên các đường vty', 'crypto key generate rsa|||crypto key generate rsa', 'service password-encryption|||service password-encryption'],
        1,
        'Everything in the description is true and none of it closes Telnet. Without transport input ssh the vty lines keep accepting the old protocol, so port 23 answers and the password crosses the network in cleartext where anyone on the path can read it. The encrypted door sits beside it, correct and unused, and an attacker simply uses the one that is open. Verify with show run | section line vty - notice that the report described what was CONFIGURED while the command asks what the device will ACCEPT, and only the second is a security statement.|||Mọi thứ trong mô tả đều đúng và không thứ nào đóng Telnet lại. Thiếu transport input ssh thì các đường vty vẫn nhận giao thức cũ, nên cổng 23 vẫn đáp và mật khẩu đi qua mạng ở dạng chữ trần, ai trên đường đi cũng đọc được. Cánh cửa mã hoá nằm cạnh đó, đúng đắn và không ai dùng, còn kẻ tấn công thì cứ dùng cái đang mở. Nghiệm thu bằng show run | section line vty - để ý rằng biên bản mô tả thứ đã được CẤU HÌNH còn câu lệnh hỏi thứ thiết bị sẽ CHẤP NHẬN, và chỉ cái thứ hai mới là một phát biểu về an ninh.'),

      q('You write 70-no-password.conf with PasswordAuthentication no. sshd -t passes, reload returns 0, and password login still works. Why?|||Bạn ghi 70-no-password.conf với PasswordAuthentication no. sshd -t qua, reload trả về 0, mà đăng nhập bằng mật khẩu vẫn chạy. Vì sao?',
        ['The directive is spelled wrongly|||Chỉ thị bị viết sai chính tả', 'Drop-in files require a full reboot|||File drop-in đòi phải khởi động lại cả máy', 'The reload did not actually restart sshd|||Lệnh reload thật ra không khởi động lại sshd', 'An earlier file, 50-cloud-init.conf, already set it to yes - and sshd keeps the FIRST value it reads|||Một file trước đó, 50-cloud-init.conf, đã đặt nó thành yes - mà sshd giữ giá trị ĐỌC ĐƯỢC ĐẦU TIÊN'],
        3,
        'For most keywords sshd uses the FIRST value it obtains, not the last, and Include /etc/ssh/sshd_config.d/*.conf expands in alphabetical order. 50- sorts before 70-, so cloud-init won and your file was ignored in silence. The tell-tale is that it was HALF applied: PermitRootLogin in the same file did take effect, because nothing else declared that keyword. Half applied is the signature of an ordering clash, never of a syntax error - a syntax error fails the whole file and sshd -t says so. The fix is to win the sort with a 01- prefix, which also survives a rebuild that makes cloud-init write 50- again.|||Với phần lớn từ khoá, sshd dùng giá trị ĐẦU TIÊN nó đọc được chứ không phải giá trị cuối, mà Include /etc/ssh/sshd_config.d/*.conf bung ra theo thứ tự chữ cái. 50- sắp trước 70-, nên cloud-init thắng và file của bạn bị bỏ qua trong im lặng. Dấu hiệu chỉ điểm là nó ăn có MỘT NỬA: PermitRootLogin trong cùng file thì lại có hiệu lực, vì không có gì khác khai từ khoá đó. Nửa ăn nửa trượt là chữ ký của va chạm thứ tự, không bao giờ là lỗi cú pháp - lỗi cú pháp làm hỏng cả file và sshd -t đã phải báo. Cách sửa là thắng thứ tự bằng tiền tố 01-, mà nó còn sống sót qua cả lần dựng lại máy khiến cloud-init ghi lại 50-.'),

      q('Which command proves that password authentication is actually disabled?|||Câu lệnh nào chứng minh rằng xác thực bằng mật khẩu thật sự đã bị tắt?',
        ['sshd -T | grep ^passwordauthentication|||sshd -T | grep ^passwordauthentication', 'systemctl status ssh|||systemctl status ssh', 'sshd -t|||sshd -t', 'cat /etc/ssh/sshd_config.d/01-no-password.conf|||cat /etc/ssh/sshd_config.d/01-no-password.conf'],
        0,
        'sshd -T prints the settings IN FORCE after every include, override and ordering rule has been applied. cat prints one file wishes. sshd -t only checks syntax, and systemctl status only says the service is running. In the real incident all three of the weak checks passed while the setting was not applied. The strongest verification of all comes from outside the machine: an attempt forced to use a password must return Permission denied (publickey). The general rule is far bigger than SSH - written does not mean in effect, and exit code 0 does not mean in effect.|||sshd -T in ra các thiết lập ĐANG CÓ HIỆU LỰC sau khi mọi lệnh include, mọi phép đè và mọi luật thứ tự đã áp dụng xong. cat in ra nguyện vọng của một cái file. sshd -t chỉ kiểm cú pháp, còn systemctl status chỉ nói dịch vụ đang chạy. Trong sự cố thật, cả ba phép kiểm yếu đó đều qua trong khi thiết lập thì không có hiệu lực. Phép nghiệm thu mạnh nhất đến từ bên ngoài cái máy: một lần thử bị ép dùng mật khẩu phải trả về Permission denied (publickey). Quy tắc chung lớn hơn chuyện SSH rất nhiều - đã ghi không có nghĩa là đã có hiệu lực, và lệnh trả về 0 cũng không có nghĩa là đã có hiệu lực.'),

      q('Passwords are already disabled on your SSH server. What does adding fail2ban buy you?|||Máy chủ SSH của bạn đã tắt mật khẩu rồi. Thêm fail2ban vào thì mua được gì?',
        ['It replaces the need for keys|||Nó thay thế được việc phải dùng khoá', 'It closes the remaining way in|||Nó đóng nốt đường vào còn lại', 'Smaller logs and less CPU - noise reduction, not protection|||Log nhỏ hơn và đỡ tốn CPU - giảm ồn, không phải bảo vệ', 'It encrypts the session|||Nó mã hoá phiên làm việc'],
        2,
        'With PasswordAuthentication no, every attempt fails anyway, so banning the source changes nothing about the outcome. What fail2ban genuinely buys is smaller logs, less CPU spent refusing connections, and fewer lines to read past - all real and worth having. Do the arithmetic to see the difference: a ban after five failures still permits five guesses per window, forever, from every address on Earth; disabling passwords makes the number of guesses that could ever succeed zero, everywhere, immediately. One is a rate limit, the other is a closed door. So keys first, then fail2ban - never fail2ban instead of keys, because a ban list on a password-enabled host feels like protection and delays the real fix.|||Với PasswordAuthentication no thì đằng nào mọi lần thử cũng hỏng, nên chặn nguồn không làm đổi kết cục. Thứ fail2ban thật sự mua được là log nhỏ lại, CPU đỡ tốn cho việc từ chối kết nối, và ít dòng phải lướt qua hơn - đều có thật và đều đáng có. Hãy làm phép tính để thấy khác biệt: cấm sau năm lần hỏng thì vẫn cho phép năm lần đoán mỗi cửa sổ thời gian, mãi mãi, từ mọi địa chỉ trên Trái Đất; tắt mật khẩu thì số lần đoán có khả năng thành công là không, ở mọi nơi, ngay lập tức. Một cái là giới hạn nhịp, cái kia là cánh cửa đóng. Nên khoá trước, fail2ban sau - đừng bao giờ dùng fail2ban THAY CHO khoá, vì một danh sách cấm trên máy vẫn bật mật khẩu cho cảm giác đã được bảo vệ và làm chậm cách sửa thật.'),

      q('Why does leaving the ports 5432:5432 line out of a compose file protect PostgreSQL so strongly?|||Vì sao bỏ dòng ports 5432:5432 ra khỏi file compose lại bảo vệ PostgreSQL mạnh đến thế?',
        ['Docker encrypts container traffic|||Docker mã hoá lưu lượng giữa các container', 'The database then lives only on RFC 1918 space that no Internet router has a route to|||Khi đó cơ sở dữ liệu chỉ sống trên không gian RFC 1918 mà không router Internet nào có tuyến tới', 'PostgreSQL refuses remote connections by default|||PostgreSQL mặc định từ chối kết nối từ xa', 'The port becomes randomised|||Số hiệu cổng trở thành ngẫu nhiên'],
        1,
        'That one line is a routing decision, not a setting: it binds PostgreSQL to the host public address, and then the only thing between the database and everybody is a password. Leave it out and the database exists only on the container network - 172.18.0.0/16, inside 172.16.0.0/12, which is RFC 1918 private space. No router on the public Internet carries a route to it, so a packet from outside is not dropped by your firewall, it never has a path to your machine at all. Chapter 10 taught that as a property of the address plan; here it becomes a control. The database password is the second lock; not publishing the port is the first, and the first one removes the attempt rather than surviving it.|||Đúng một dòng đó là một quyết định về định tuyến chứ không phải một thiết lập: nó gắn PostgreSQL vào địa chỉ công khai của máy chủ, và rồi thứ duy nhất đứng giữa cơ sở dữ liệu với tất cả mọi người là một cái mật khẩu. Bỏ dòng đó đi thì cơ sở dữ liệu chỉ tồn tại trên mạng container - 172.18.0.0/16, nằm trong 172.16.0.0/12, tức không gian riêng theo RFC 1918. Không router nào trên Internet công cộng mang tuyến tới dải đó, nên một gói tin từ bên ngoài không phải bị tường lửa của bạn vứt đi, mà nó ngay từ đầu đã không có đường nào tới máy bạn. Chương 10 dạy điều đó như một tính chất của kế hoạch địa chỉ; ở đây nó trở thành một biện pháp bảo vệ. Mật khẩu của cơ sở dữ liệu là ổ khoá thứ hai; không công bố cổng mới là ổ thứ nhất, và ổ thứ nhất xoá bỏ luôn cú thử chứ không phải sống sót qua nó.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 15 — Network Security Fundamentals (FLM sessions 49-50)|||Chương 15 — Nền tảng an ninh mạng (buổi 49-50 của FLM)',
    slug: 'nwc204-chuong-15-an-ninh-mang',
    description: 'Cisco Module 16 theo đúng buổi 49-50 của FLM, chương thực dụng nhất với người vận hành máy chủ: năm chữ không đồng nghĩa (tài sản, lỗ hổng, mối đe doạ, cách khai thác, rủi ro), ba nhóm lỗ hổng và nhóm cấu hình là nhóm sửa không mất tiền, mã độc phân theo thứ nó cần ở con người, rồi ba họ tấn công theo đúng thứ tự xảy ra — do thám, truy cập, từ chối dịch vụ — viết hoàn toàn từ phía phòng thủ, không có hướng dẫn tấn công. Buổi 50 thêm phòng thủ nhiều lớp, ba tính chất bị tấn công và lý do các biện pháp không thay nhau được, bộ công cụ giảm thiểu, ba thói quen rẻ tiền vượt mặt mọi thiết bị đắt tiền, danh sách làm cứng thiết bị và cấu hình Cisco đủ từ enable với SSH thay Telnet. Kèm phần ★ đo trên máy chủ thật: khoá thay mật khẩu, BẪY THỨ TỰ drop-in của sshd làm một thay đổi "thành công" mà không có hiệu lực, nghiệm thu bằng sshd -T chứ không bằng cat, fail2ban chỉ là lớp giảm ồn, đừng publish cổng 5432, và vì sao container non-root không bind được cổng dưới 1024. Buổi 50 là buổi DUY NHẤT trong 60 buổi có CLO10. Slide tiếng Anh do cuongthai.com dựng, giảng song ngữ.',
    lessons: [L1, L2, QUIZ],
  },
];
