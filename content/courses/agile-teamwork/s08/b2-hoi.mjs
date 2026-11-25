/**
 * 8.2 — Hỏi câu hỏi tốt (agl-8-2-hoi — slug + title GIỮ theo khung). Soạn 24/11/2026, agent agt.
 * Ranh giới: câu tiếng Anh khi hỏi lại ⇒ tak-4-2-hoi-lai; "nohello"/tin nhắn tự đủ ⇒ agl-6-4; hỏi khách qua Q&A list ⇒ agl-9-5;
 * khoanh vùng/tái hiện lỗi chuyên sâu ⇒ dbg-1-2, dbg-1-3. Bài này dạy hỏi NGƯỜI TRONG ĐỘI khi mới vào: cấu trúc câu hỏi, XY, rút gọn lỗi, khi nào hỏi.
 * Lab THẬT (scratchpad/agt/lab/ch8): npm ci trong container node:22-alpine (--memory 2g --cpus 2): không mạng ⇒ EAI_AGAIN; có mạng ⇒ EUSAGE
 * lock lệch; --force vẫn EUSAGE; npm install sửa lock ⇒ npm ci được. soat-cau-hoi.mjs (8 luật) trên 4 câu hỏi; rut-gon.sh thu lỗi sort()
 * về một dòng; tong-ket-hoi.mjs trên nhật ký hỏi 2 tuần (dữ liệu minh hoạ — ghi rõ trong bài).
 * Nguồn: xyproblem.info, Eric S. Raymond "How To Ask Questions The Smart Way", Meli et al. NDSS 2019 (bí mật lộ trên GitHub).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ng, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L82 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 8 · Lesson 8.2', 'Chương 8 · Bài 8.2', `
<h2>${t('8.2 — Asking good questions', '8.2 — Hỏi câu hỏi tốt')}</h2>
<p class="lead">${t(
    'Every newcomer has to ask. What separates the ones people love to help is not how rarely they ask but how cheap their questions are to answer: the person helping should be able to reply in one message without asking anything back. This lesson builds that habit on a real error, gives you a script that checks a question before you send it, shows the one mistake no script can catch (asking about your solution instead of your problem), and uses a question log to answer "when should I ask?" with numbers.',
    'Người mới nào cũng phải hỏi. Điều làm một số người được giúp vui vẻ không phải là họ ít hỏi, mà là câu hỏi của họ rẻ để trả lời: người giúp trả lời được bằng một tin nhắn mà không phải hỏi ngược lại gì. Bài này luyện thói quen đó trên một lỗi thật, cho bạn một script soát câu hỏi trước khi gửi, chỉ ra lỗi duy nhất không script nào bắt được (hỏi về cách giải của mình thay vì vấn đề thật), và dùng nhật ký hỏi để trả lời "khi nào nên hỏi?" bằng con số.')}</p>

<h3>${t('Everyday picture: seeing a doctor', 'Liên tưởng đời thường: đi khám bệnh')}</h3>
<p>${t(
    '"Doctor, I feel bad" starts ten minutes of questions: where, since when, what did you eat, which medicine have you already taken, any allergies? A patient who walks in saying "stomach pain on the right since last night, worse after eating, I took paracetamol at 8 am, no fever" gets a diagnosis in two minutes. Your mentor is the doctor; the error message, versions and what you tried are the symptoms.',
    '"Bác sĩ ơi em thấy mệt" mở đầu mười phút hỏi han: đau đâu, từ bao giờ, ăn gì, đã uống thuốc gì, có dị ứng không? Bệnh nhân bước vào nói "đau bụng bên phải từ tối qua, ăn xong đau hơn, 8 giờ sáng đã uống paracetamol, không sốt" được chẩn đoán trong hai phút. Mentor là bác sĩ; thông báo lỗi, phiên bản và những gì đã thử là triệu chứng.')}</p>

<h3>${t('The eight things a helper needs', 'Tám thứ người giúp cần')}</h3>
${bang([t('Part', 'Phần'), t('Why the helper needs it', 'Vì sao người giúp cần'), t('Example', 'Ví dụ')], [
    [t('Goal', 'Mục tiêu'), t('Many "how do I…" questions have a better path to the real goal', 'Nhiều câu "làm sao để…" có đường tốt hơn tới mục tiêu thật'), t('"to run the project before taking LH-212"', '"để chạy dự án trước khi nhận LH-212"')],
    [t('Where', 'Vị trí'), t('Same command, different branch ⇒ different answer', 'Cùng lệnh, khác nhánh ⇒ khác câu trả lời'), t('repo, branch, commit, ticket', 'repo, nhánh, commit, ticket')],
    [t('Environment', 'Môi trường'), t('Half of "it works for me" is a version difference', 'Một nửa câu "máy anh chạy được" là khác phiên bản'), 'Node v22.23.5, npm 10.9.9'],
    [t('Exact error', 'Lỗi nguyên văn'), t('Error codes are searchable; paraphrases are not', 'Mã lỗi tra cứu được; lời kể lại thì không'), t('the first error line, copied', 'dòng lỗi đầu tiên, chép nguyên')],
    [t('What you tried', 'Đã thử gì'), t('Saves the helper from suggesting it, shows effort', 'Người giúp khỏi gợi ý lại, cho thấy bạn đã cố'), t('"deleted node_modules, same error"', '"xoá node_modules, vẫn lỗi"')],
    [t('What you read', 'Đã đọc gì'), t('Tells the team where the docs are missing', 'Cho nhóm biết tài liệu thiếu ở đâu'), t('"README and the onboarding wiki: no proxy"', '"README và wiki onboarding: không có proxy"')],
    [t('A specific question', 'Câu hỏi cụ thể'), t('Something answerable, ideally yes/no or "where"', 'Thứ trả lời được, tốt nhất là có/không hoặc "ở đâu"'), t('"Is it the proxy, and where is its config?"', '"Có phải do proxy không, cấu hình lấy ở đâu?"')],
    [t('No secrets', 'Không bí mật'), t('Chat is logged, searchable and shared', 'Chat được lưu, tìm được, chia sẻ được'), t('never paste tokens, passwords, .env', 'không dán token, mật khẩu, .env')],
  ])}
<p>${t('Classic references worth reading once: ', 'Hai tài liệu kinh điển nên đọc một lần: ')}${ng('http://www.catb.org/~esr/faqs/smart-questions.html', 'Eric S. Raymond — How To Ask Questions The Smart Way')}${t(' and ', ' và ')}${ng('https://xyproblem.info/', 'xyproblem.info')}. ${t('Writing it in English: ', 'Viết bằng tiếng Anh: ')}${cs('tieng-anh-ky-thuat-di-lam', 'tak-4-2-hoi-lai', t('Technical English 4.2', 'Tiếng Anh kỹ thuật 4.2'))}; ${t('one self-contained message instead of "hello?": ', 'một tin nhắn tự đủ thay vì "anh ơi?": ')}${ag('agl-6-4-tu-xa', t('lesson 6.4', 'bài 6.4'))}.</p>

<h3>${t('Lab 1: a real day-2 error, four ways to ask about it', 'Lab 1: một lỗi ngày thứ 2 có thật, bốn cách hỏi')}</h3>
<p>${t(
    'The company repo <code>lich-hen-api</code> (a sample built for this chapter). README step 2 says <code>npm ci</code>. Run in a clean <code>node:22-alpine</code> container — first as on an office network that cannot resolve the public registry (<code>--network none</code>), then with network:',
    'Repo công ty <code>lich-hen-api</code> (repo mẫu dựng cho chương này). Bước 2 của README là <code>npm ci</code>. Chạy trong container <code>node:22-alpine</code> sạch — lần đầu như trên mạng văn phòng không phân giải được registry công khai (<code>--network none</code>), lần sau có mạng:')}</p>
${js(MA.pkg)}
${bash('docker run --rm --network none --memory 2g --memory-swap 2g --cpus 2 -v "$PWD":/app -w /app node:22-alpine sh -c \'node -v; npm -v; npm ci\'')}
${out(RA.npmCi)}
${bash('docker run --rm --memory 2g --memory-swap 2g --cpus 2 -v "$PWD":/app -w /app node:22-alpine npm ci')}
${out(RA.npmCiMang.split('\n').slice(0, 6).join('\n') + '\n… (npm in tiếp phần hướng dẫn dùng lệnh) …\nma=1')}
<p>${t(
    'Two different problems hide behind "npm is broken": a network one (<code>EAI_AGAIN</code> from <code>getaddrinfo</code> — DNS cannot resolve the registry, typical behind a corporate proxy) and a repository one (<code>EUSAGE</code> — <code>package.json</code> asks for <code>dayjs</code> but <code>package-lock.json</code> does not contain it). Here are four questions a newcomer actually sends, checked by a script before sending:',
    'Hai vấn đề khác nhau nấp sau câu "npm hỏng rồi": một của mạng (<code>EAI_AGAIN</code> từ <code>getaddrinfo</code> — DNS không phân giải được registry, hay gặp sau proxy công ty) và một của repo (<code>EUSAGE</code> — <code>package.json</code> đòi <code>dayjs</code> nhưng <code>package-lock.json</code> không có). Đây là bốn câu hỏi người mới hay gửi thật, được script soát trước khi gửi:')}</p>
${out('── 1-voi.txt\n' + MA.hoi1)}
${out('── 2-dan-bi-mat.txt\n' + MA.hoi2)}
${out('── 3-tot.txt\n' + MA.hoi3)}
${out('── 4-xy.txt\n' + MA.hoi4)}
${js(MA.soatCauHoi)}
${out('$ node soat-cau-hoi.mjs cau-hoi/*.txt\n' + RA.soatCauHoi)}
<ul>
  <li>${t('<strong>1 — "help me":</strong> 1/8. The helper must ask seven questions back; across time zones that is a day.', '<strong>1 — "giúp em với":</strong> 1/8. Người giúp phải hỏi ngược bảy câu; khác múi giờ là mất một ngày.')}</li>
  <li>${t('<strong>2 — good, but blocked:</strong> 7/8 and a token pasted from <code>.npmrc</code>. The script refuses — see the hacker corner below.', '<strong>2 — tốt, nhưng bị chặn:</strong> 7/8 và dán nguyên token từ <code>.npmrc</code>. Script từ chối — xem góc hacker bên dưới.')}</li>
  <li>${t('<strong>3 — answerable in one message:</strong> "Yes, use the company registry: <code>npm config set registry …</code>, it is on wiki page X." The asker even guessed the cause.', '<strong>3 — trả lời được bằng một tin:</strong> "Đúng, dùng registry công ty: <code>npm config set registry …</code>, có ở trang wiki X." Người hỏi còn đoán được nguyên nhân.')}</li>
  <li>${t('<strong>4 — passes, and is still a bad question.</strong> It scores 7/8 and asks how to <em>disable the lock-file check</em>. That is the XY problem: the asker wants X (install dependencies), has guessed a solution Y (bypass the check), and asks about Y.', '<strong>4 — qua, mà vẫn là câu hỏi tồi.</strong> Nó được 7/8 và hỏi cách <em>tắt kiểm tra lock file</em>. Đó là vấn đề XY: người hỏi muốn X (cài được thư viện), đã đoán một cách giải Y (né phép kiểm), và hỏi về Y.')}</li>
</ul>

<h3>${t('The XY problem: why question 4 is dangerous', 'Vấn đề XY: vì sao câu 4 nguy hiểm')}</h3>
<p>${t('xyproblem.info defines it as "asking about your attempted solution rather than your actual problem". Trying Y for real:', 'xyproblem.info định nghĩa nó là "hỏi về cách giải mình đang thử thay vì vấn đề thật của mình". Thử Y thật:')}</p>
${out(RA.npmSua)}
<p>${t('The lock file is not an obstacle to bypass; it is the record of exactly which versions the team tested. The real fix is to bring it back in sync — and commit it:', 'Lock file không phải chướng ngại để né; nó là bản ghi chính xác các phiên bản nhóm đã test. Cách sửa thật là đồng bộ nó lại — và commit nó:')}</p>
${out(RA.lockDiff)}
<p>${t(
    'And the most useful part of the answer is the question behind it: <em>why</em> was the lock out of sync on <code>main</code>? (In the log of this chapter: a merged PR, LH-198, changed <code>package.json</code> without the lock file.) An asker who states the goal ("I want to install dependencies to run the project") lets the helper see both. A rule of thumb: if your question starts with "how do I disable / bypass / force…", rewrite it as "I want to … and I get …".',
    'Và phần có ích nhất của câu trả lời là câu hỏi đằng sau: <em>vì sao</em> lock lại lệch trên <code>main</code>? (Trong nhật ký của chương này: một PR đã merge, LH-198, đổi <code>package.json</code> mà không đổi lock file.) Người hỏi nêu mục tiêu ("em muốn cài thư viện để chạy dự án") giúp người trả lời thấy cả hai. Mẹo nhớ: câu hỏi bắt đầu bằng "làm sao để tắt / né / ép…" thì viết lại thành "em muốn … và gặp …".')}</p>
${cl('warn', `<p>${t('<strong>The script cannot detect XY.</strong> It checks that the parts are present, not that you are asking about the right thing. That judgement — "what am I actually trying to do?" — is yours.', '<strong>Script không phát hiện được XY.</strong> Nó kiểm các phần có mặt, không kiểm bạn có hỏi đúng thứ cần hỏi không. Phán đoán đó — "rốt cuộc mình đang muốn làm gì?" — là việc của bạn.')}</p>`)}

<h3>${t('Lab 2: shrink the bug until it fits in one line', 'Lab 2: thu nhỏ lỗi tới khi nó vừa một dòng')}</h3>
<p>${t('The report "top 5 longest waits" misses a visit that waited 120 minutes:', 'Báo cáo "5 lượt chờ lâu nhất" bỏ sót một lượt chờ 120 phút:')}</p>
${js(MA.thongKe)}
${out(RA.thongKe)}
<p>${t('Before asking, remove one thing at a time and check the bug is still there (a <em>minimal reproduction</em>):', 'Trước khi hỏi, bỏ từng thứ một và kiểm lỗi vẫn còn (<em>tái hiện tối giản</em>):')}</p>
${bash(MA.rutGon)}
${out(RA.rutGon)}
<p>${t(
    'At step 3 the question is one line: "why does <code>[9, 45, 120, 8].sort()</code> return <code>[120, 45, 8, 9]</code>?" — and you can answer it yourself: <code>Array.prototype.sort()</code> without a compare function converts elements to strings, and "120" &lt; "45" &lt; "8" &lt; "9" alphabetically. In the question log below, this question cost 25 minutes and zero minutes of anyone else’s time. When shrinking does not answer it, the one-line repro is the best question you can send. More on reproducing and narrowing down: ',
    'Tới bước 3 câu hỏi chỉ còn một dòng: "vì sao <code>[9, 45, 120, 8].sort()</code> trả về <code>[120, 45, 8, 9]</code>?" — và bạn tự trả lời được: <code>Array.prototype.sort()</code> không có hàm so sánh sẽ đổi phần tử thành chuỗi, và theo thứ tự chữ "120" &lt; "45" &lt; "8" &lt; "9". Trong nhật ký hỏi bên dưới, câu này tốn 25 phút và không tốn phút nào của ai khác. Khi thu nhỏ vẫn chưa ra, bản tái hiện một dòng là câu hỏi tốt nhất bạn có thể gửi. Tái hiện và khoanh vùng sâu hơn: ')}${cs('debug-co-phuong-phap', 'dbg-1-2-tai-hien', t('Debugging 1.2', 'Debug 1.2'))}, ${cs('debug-co-phuong-phap', 'dbg-1-3-khoanh-vung', '1.3')}.</p>

<h3>${t('Lab 3: when to ask — what a two-week log says', 'Lab 3: khi nào nên hỏi — nhật ký hai tuần nói gì')}</h3>
<p>${t(
    'A fresher logged every question of their first two weeks: minutes stuck alone before asking, minutes the helper spent, and whether the answer was already in the docs. (Illustrative data in the world of this chapter; the analysis script is real.)',
    'Một fresher ghi mọi câu hỏi trong hai tuần đầu: số phút tự kẹt trước khi hỏi, số phút người giúp bỏ ra, và câu trả lời đã có trong tài liệu chưa. (Dữ liệu minh hoạ trong thế giới của chương này; script phân tích là thật.)')}</p>
${out(MA.nhatKyHoi)}
${js(MA.tongKetHoi)}
${out(RA.tongKetHoi)}
<p>${t(
    'The numbers contradict the newcomer’s instinct. Asking "too early" cost the team 14 minutes in total — cheap — but the same two questions asked twice look careless: write the answer in your own notes the first time. Asking too late cost <strong>330 minutes of the fresher’s day to save 11 minutes of someone else’s</strong>. The expensive mistake is silence, not asking. Hence the rule most teams use:',
    'Con số đi ngược bản năng của người mới. Hỏi "quá sớm" tốn của cả nhóm 14 phút — rẻ — nhưng hỏi lại cùng một câu hai lần thì trông cẩu thả: lần đầu hãy ghi câu trả lời vào sổ tay. Hỏi quá muộn tốn <strong>330 phút của fresher để tiết kiệm 11 phút của người khác</strong>. Sai lầm đắt là im lặng, không phải là hỏi. Vì vậy hầu hết các đội dùng quy tắc:')}</p>
${cl('tip', `<p>${t(
    '<strong>The 15–30 minute rule.</strong> Search the docs, the README, the team chat history and the code for up to 15–30 focused minutes (less if you are fully blocked, a bit more if you are clearly making progress). Then ask, with the eight parts. If the answer was in the docs, note where; if it was not, the log tells you which PR to open — five topics here, including the two that cost hours.',
    '<strong>Quy tắc 15–30 phút.</strong> Tìm trong tài liệu, README, lịch sử chat của nhóm và trong code tối đa 15–30 phút tập trung (ít hơn nếu bị chặn hoàn toàn, lâu hơn chút nếu rõ ràng đang tiến). Rồi hỏi, đủ tám phần. Nếu câu trả lời có trong tài liệu, ghi lại chỗ đó; nếu không có, nhật ký cho bạn biết nên mở PR nào — ở đây là năm chủ đề, trong đó có hai chủ đề tốn hàng giờ.')}</p>`)}
<p>${t(
    '<strong>Where to ask:</strong> in the team channel or the ticket, not in a private message, unless it is personal or sensitive. Public answers are searchable for the next newcomer, and someone other than your mentor may answer faster.',
    '<strong>Hỏi ở đâu:</strong> trong kênh chung của nhóm hoặc trong ticket, không nhắn riêng, trừ khi là chuyện riêng tư hay nhạy cảm. Câu trả lời công khai thì người mới sau tìm được, và người khác ngoài mentor có thể trả lời nhanh hơn.')}</p>

<h3>🕵️ ${t('Hacker’s corner: the token in question 2', 'Góc hacker: token trong câu hỏi số 2')}</h3>
<p>${t(
    'Pasting configuration "so they can see everything" is how secrets leave a company. A study of public GitHub (Meli, McNiece, Reaves — NDSS 2019) found secret leakage "affecting over 100,000 repositories" and "thousands of new, unique secrets are leaked every day" (',
    'Dán nguyên cấu hình "cho anh xem đủ" là cách bí mật rời khỏi công ty. Một nghiên cứu trên GitHub công khai (Meli, McNiece, Reaves — NDSS 2019) thấy bí mật bị lộ "ở hơn 100.000 repo" và "mỗi ngày có hàng nghìn bí mật mới, khác nhau bị lộ" (')}${ng('https://www.ndss-symposium.org/ndss-paper/how-bad-can-it-git-characterizing-secret-leakage-in-public-github-repositories/', 'How Bad Can It Git?, NDSS 2019')}${t(
    '). Chat tools, ticket comments, Stack Overflow posts and public AI chats are the same kind of place: copied, indexed, retained. If you did paste a token: <strong>revoke and rotate it first</strong>, then delete the message, then tell your mentor — deleting alone is not enough, someone or something may already have read it. Replace secrets with <code>***</code> before sending; the helper never needs the value, only the fact that it is set. More: ',
    '). Công cụ chat, bình luận ticket, bài Stack Overflow và chat AI công cộng cũng là loại chỗ như vậy: bị chép, bị lập chỉ mục, bị lưu lại. Nếu bạn đã lỡ dán token: <strong>thu hồi và đổi nó trước</strong>, rồi mới xoá tin nhắn, rồi báo mentor — chỉ xoá thôi là không đủ, có thể người hoặc máy đã đọc rồi. Thay bí mật bằng <code>***</code> trước khi gửi; người giúp không bao giờ cần giá trị, chỉ cần biết nó đã được đặt. Xem thêm: ')}${ag('agl-10-5-tai-khoan', '10.5')}, ${ag('agl-10-3-du-lieu-khach', '10.3')}.</p>

<h3>${t('At work (OJT, outsourcing)', 'Khi đi làm (OJT, outsourcing)')}</h3>
<p>${t(
    'Two kinds of questions, two channels. <strong>Internal</strong> (setup, code, process) go to your mentor or team channel using the eight parts. <strong>Questions about the customer’s requirement</strong> never go straight to the customer from a fresher: they go into the Q&amp;A list, reviewed by the leader or BrSE (', 'Hai loại câu hỏi, hai kênh. <strong>Câu hỏi nội bộ</strong> (cài đặt, code, quy trình) gửi mentor hoặc kênh nhóm theo đủ tám phần. <strong>Câu hỏi về yêu cầu của khách</strong> thì fresher không bao giờ hỏi thẳng khách: chúng vào Q&amp;A list, được leader hoặc BrSE duyệt (')}${ag('agl-9-5-qa-cr', '9.5')}${t(
    '). In Japanese-style teams, "consult before deciding" (sōdan in hourensou, ', '). Ở đội theo phong cách Nhật, "thảo luận trước khi tự quyết" (sōdan trong hourensou, ')}${ag('agl-9-7-bao-cao-hourensou', '9.7')}${t(
    ') means: when you have two options and the choice is not obviously yours, ask before choosing — and bring your proposal, as in question 3.',
    ') nghĩa là: khi có hai phương án và quyền chọn không rõ ràng là của bạn, hãy hỏi trước khi chọn — và mang theo đề xuất của mình, như câu hỏi số 3.')}</p>

<h3>🧪 ${t('Practice (30 minutes)', 'Thực hành (30 phút)')}</h3>
<ol>
  <li>${t('Rewrite question 4 so that it states the goal and passes the script — and ask the real question about the lock file.', 'Viết lại câu 4 sao cho nêu mục tiêu và qua script — và hỏi câu hỏi thật về lock file.')}</li>
  <li>${t('In Lab 2 the second test case printed <code>C A</code> for two visits of 30 minutes. Shrink it to one line too: which part of <code>topChoLau</code> causes it?', 'Ở Lab 2, trường hợp hai lượt cùng 30 phút in ra <code>C A</code>. Thu nhỏ nó về một dòng: phần nào của <code>topChoLau</code> gây ra?')}</li>
  <li>${t('Run <code>tong-ket-hoi.mjs</code> with thresholds 15 and 30. Which questions move category? Write the one-paragraph PR description for the onboarding doc from the "propose" list.', 'Chạy <code>tong-ket-hoi.mjs</code> với ngưỡng 15 và 30. Câu nào đổi nhóm? Viết mô tả PR một đoạn cho tài liệu onboarding từ danh sách "đề xuất".')}</li>
</ol>
${giai(t('Solution hints', 'Gợi ý lời giải'), `<p>${t(
    '1: "I want to install dependencies to run lich-hen-api (main, d9f8f5a)… <code>npm ci</code> says <code>Missing: dayjs@1.11.23 from lock file</code>… <code>--force</code> gives the same error… I read README step 2. Should I run <code>npm install</code> and commit the updated lock file in a separate PR, or is someone already fixing <code>main</code>?" 2: two causes together — sorting the <em>numbers</em> as strings, and mapping back with <code>ds.find(… === p)</code>, which returns the first visit with that value every time, so equal values repeat one visit. Sorting the visits themselves (<code>[...ds].sort((a, b) =&gt; b.phutCho - a.phutCho)</code>) removes both — that is the fix in lesson 8.3. 3: the "early" list does not change (all six were under 5 minutes); "stuck long" grows from 2 to 5 questions — <code>npm ci EUSAGE</code> (40), TZ of staging (35), sample data (45) join — 450 minutes alone vs 44 minutes of help.',
    '1: "Em muốn cài thư viện để chạy lich-hen-api (main, d9f8f5a)… <code>npm ci</code> báo <code>Missing: dayjs@1.11.23 from lock file</code>… <code>--force</code> vẫn lỗi y vậy… Em đã đọc README bước 2. Em nên chạy <code>npm install</code> rồi commit lock file mới trong một PR riêng, hay đã có ai đang sửa <code>main</code> rồi ạ?" 2: hai nguyên nhân cộng lại — xếp <em>các con số</em> như chuỗi, và ánh xạ ngược bằng <code>ds.find(… === p)</code>, hàm này luôn trả lượt ĐẦU TIÊN có giá trị đó, nên giá trị trùng lặp lại một lượt. Xếp chính các lượt (<code>[...ds].sort((a, b) =&gt; b.phutCho - a.phutCho)</code>) bỏ được cả hai — đó là bản sửa ở bài 8.3. 3: danh sách "sớm" không đổi (cả sáu câu đều dưới 5 phút); "kẹt lâu" tăng từ 2 lên 5 câu — thêm <code>npm ci EUSAGE</code> (40), TZ của staging (35), dữ liệu mẫu (45) — 450 phút tự kẹt so với 44 phút được giúp.')}</p>`)}

${phongVan([
    [t('"When do you ask for help, and when do you keep trying?"', '"Khi nào bạn nhờ giúp, khi nào bạn tự cố tiếp?"'), t('I time-box: 15–30 focused minutes on docs, chat history and code, less if I am fully blocked. Then I ask with the error, versions, what I tried and a specific question. When I logged my first two weeks, the two times I waited too long cost me 330 minutes to save the helper 11.', 'Tôi giới hạn thời gian: 15–30 phút tập trung vào tài liệu, lịch sử chat và code, ít hơn nếu bị chặn hẳn. Rồi tôi hỏi kèm lỗi, phiên bản, đã thử gì và một câu hỏi cụ thể. Khi tôi ghi nhật ký hai tuần đầu, hai lần chờ quá lâu tốn của tôi 330 phút để tiết kiệm cho người giúp 11 phút.')],
    [t('"What is the XY problem?"', '"Vấn đề XY là gì?"'), t('Asking about my attempted solution instead of my goal — e.g. "how do I disable npm ci’s lock check" when the goal is installing dependencies and the real fix is syncing and committing the lock file. I avoid it by stating the goal first.', 'Hỏi về cách giải mình đang thử thay vì mục tiêu — ví dụ "làm sao tắt kiểm tra lock của npm ci" khi mục tiêu là cài thư viện và cách sửa thật là đồng bộ và commit lock file. Tôi tránh bằng cách nêu mục tiêu trước.')],
    [t('"How do you report a bug to a senior so they can help quickly?"', '"Bạn báo lỗi cho người có kinh nghiệm thế nào để họ giúp nhanh?"'), t('A minimal reproduction: I remove things until the bug fits in a few lines, with expected vs actual. Often that alone answers it — sort() comparing strings was one line.', 'Một bản tái hiện tối giản: tôi bỏ dần cho tới khi lỗi vừa vài dòng, kèm mong đợi và thực tế. Thường chỉ vậy đã ra câu trả lời — sort() so chuỗi chỉ còn một dòng.')],
    [t('"You accidentally pasted a token in Slack. What now?"', '"Bạn lỡ dán token lên Slack. Giờ làm gì?"'), t('Revoke and rotate it immediately, then delete the message and tell my lead or security contact. Deleting is not enough on its own.', 'Thu hồi và đổi ngay, rồi xoá tin nhắn và báo leader hoặc đầu mối bảo mật. Chỉ xoá thôi là không đủ.')],
  ], en)}

${thuatNgu([
    [t('XY problem', 'vấn đề XY'), t('Asking about your guessed solution Y instead of your goal X.', 'Hỏi về cách giải Y mình đoán thay vì mục tiêu X.')],
    [t('minimal reproduction', 'tái hiện tối giản'), t('The smallest input/code that still shows the bug.', 'Đầu vào/đoạn mã nhỏ nhất vẫn còn thấy lỗi.')],
    ['time-box', t('A fixed amount of time for an attempt before changing approach.', 'Khoảng thời gian cố định cho một lần thử trước khi đổi cách.')],
    ['lock file', t('package-lock.json / similar: exact tested versions; commit it, keep it in sync.', 'package-lock.json và tương tự: phiên bản chính xác đã test; commit nó, giữ nó đồng bộ.')],
    ['EAI_AGAIN', t('DNS lookup failure — usually network/proxy, not the project.', 'Lỗi phân giải DNS — thường do mạng/proxy, không phải do dự án.')],
  ], en)}

${tomTat([
    t('A good question can be answered in one message: goal, where, environment, exact error, tried, read, specific ask, no secrets.', 'Câu hỏi tốt trả lời được bằng một tin: mục tiêu, vị trí, môi trường, lỗi nguyên văn, đã thử, đã đọc, hỏi cụ thể, không bí mật.'),
    t('A checklist cannot catch XY — state the goal before the solution you guessed.', 'Danh sách kiểm không bắt được XY — nêu mục tiêu trước cách giải mình đoán.'),
    t('Shrink the bug to one line; it often answers itself.', 'Thu nhỏ lỗi về một dòng; nhiều khi tự ra đáp án.'),
    t('Silence is the expensive mistake: 330 minutes stuck vs 11 minutes of help.', 'Im lặng mới là sai lầm đắt: 330 phút kẹt so với 11 phút được giúp.'),
    t('Pasted a secret? Rotate first, delete second.', 'Lỡ dán bí mật? Đổi trước, xoá sau.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-8-3-viec-dau', t('8.3 — Your first tickets', '8.3 — Những ticket đầu tiên'))}.</p>
`);
};

export default {
  title: '8.2 — Asking good questions|||8.2 — Hỏi câu hỏi tốt',
  slug: 'agl-8-2-hoi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hỏi để người giúp trả lời được bằng một tin: tám phần của câu hỏi; lab chạy thật npm ci trong container — EAI_AGAIN (mạng/proxy) và EUSAGE (lock lệch), --force vẫn lỗi, npm install + commit lock mới đúng; soat-cau-hoi.mjs chấm 4 câu hỏi (1/8, chặn vì dán token, 8/8, câu XY vẫn qua 7/8 — máy không bắt được XY); thu nhỏ lỗi sort() về một dòng; nhật ký hỏi 2 tuần: kẹt lâu 330 phút để tiết kiệm 11 phút người khác, quy tắc 15–30 phút; lộ bí mật (NDSS 2019): đổi trước, xoá sau.',
  content: L82(true) + L82(false),
};
