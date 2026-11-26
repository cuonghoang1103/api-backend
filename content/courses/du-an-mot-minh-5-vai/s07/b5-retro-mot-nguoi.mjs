/**
 * 7.5 — Retro một người: dữ liệu thay cảm giác (dm5-7-5-retro-mot-nguoi).
 * Chương 7 — Iteration 1 từ đầu tới cuối (vòng mẫu chuẩn).
 * Nguồn đã kiểm: Betsy Beyer, Chris Jones, Jennifer Petoff & Niall Richard Murphy, "Site Reliability Engineering" (O'Reilly / Google, 2016 — Ch.15 Postmortem Culture: Learning from Failure);
 * Taiichi Ohno, "Toyota Production System: Beyond Large-Scale Production" (1988 — 5 Whys root-cause method);
 * tài liệu LabFlow AI (labflow-ai.md).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, out, ac, cs, vo, dm, lf, mu, viecLabflow, apDung } from '../_chung.mjs';

const L75 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 7 · Lesson 7.5', 'Chương 7 · Bài 7.5', `
<h2>${t('7.5 — Solo Retrospective: Replacing Gut Feeling with Real Data', '7.5 — Retro một người: dữ liệu thay cảm giác')}</h2>
<p class="lead">${t(
    'When working alone, almost every student skips the Sprint Retrospective. When they do reflect, it usually turns into pure emotion like "I need to try harder." "Trying harder" changes zero habits, so Iteration 2 hits the exact same traps. This lesson teaches the <strong>30-Minute Data-First Solo Retrospective</strong> on CT Work: pull 7 real metrics first, run a blameless 5 Whys, and lock <strong>at most two testable Process Experiments</strong>.',
    'Khi làm một mình, nhiều sinh viên thường bỏ qua buổi Sprint Retrospective. Nếu có nhìn lại, ta cũng dễ than cảm tính kiểu "tuần sau phải cố gắng hơn". Câu đó không sửa thói quen nào, nên Iteration 2 vẫn vấp lỗi cũ. Bài này hướng dẫn <strong>buổi Retro Một Người 30 phút</strong> trên CT Work. Bạn sẽ rút 7 chỉ số thật, chạy 5 Whys không đổ lỗi và chốt tối đa 2 thử nghiệm.')}</p>

<h3>${t('Everyday picture: reviewing gym logs and form videos instead of saying "I felt weak today"', 'Liên tưởng đời thường: soi nhật ký tập gym và video động tác thay vì than "hôm nay thấy yếu quá"')}</h3>
<p>${t(
    'Two athletes want to run a faster 5 km. Athlete A finishes tired and tells themselves, <em>"I felt terrible today, I just need more willpower tomorrow."</em> Athlete B opens their watch log: pace dropped at kilometer 3 because they started 25 seconds/km too fast and only slept 5 hours the night before. Next week Athlete B sets a watch pace alert and goes to bed by 11 PM. That is the entire difference between <strong>gut-feeling regret</strong> and a <strong>Data-First Retrospective</strong>: numbers reveal the broken mechanism; emotion only produces guilt.',
    'Hai người chạy bộ muốn cải thiện thành tích 5 km. Người A chạy xong thấy mệt liền tự nhủ: <em>"Hôm nay cảm giác tệ quá, mai phải quyết tâm hơn."</em> Người B mở đồng hồ xem dữ liệu: tốc độ tụt hẳn từ cây số 3 vì xuất phát nhanh hơn kế hoạch 25 giây/km và đêm trước ngủ có 5 tiếng. Tuần sau Người B đặt cảnh báo nhịp chạy trên đồng hồ và ngủ trước 23 giờ. Đó là toàn bộ khác biệt giữa <strong>dằn vặt cảm tính</strong> và <strong>Retro Dựa Trên Dữ Liệu</strong>: con số phơi bày mắt xích hỏng; cảm giác chỉ tạo ra áy náy.')}</p>

<h3>${t('1. Why blameless, data-driven learning beats "try harder" (real-world engineering culture)', '1. Vì sao học từ dữ liệu không đổ lỗi đánh bại khẩu hiệu "cố gắng hơn" (văn hoá kỹ thuật thật)')}</h3>
<ul>
<li>${t('<strong>Google SRE Blameless Postmortem Culture (Beyer et al., <em>Site Reliability Engineering</em>, O\'Reilly 2016, Ch. 15):</strong> Google\'s reliability teams treat human errors not as moral failures ("this engineer was careless") but as <strong>system and process defects</strong> ("what guardrail was missing that allowed a tired human to make that mistake?"). Even when you are solo, blaming yourself ("I\'m bad at Spring Boot") solves nothing; fixing your <em>process</em> ("add a 5-item API checklist before opening any PR") prevents the error permanently.', '<strong>Văn hoá Hậu kiểm Không Đổ Lỗi của Google SRE (Beyer và cộng sự, sách <em>Site Reliability Engineering</em>, O\'Reilly 2016, Chương 15):</strong> Các đội vận hành của Google không coi lỗi con người là lỗi đạo đức ("kỹ sư này ẩu quá") mà coi đó là <strong>lỗ hổng của hệ thống và quy trình</strong> ("hàng rào bảo vệ nào đang thiếu nên mới để một con người mệt mỏi mắc lỗi đó?"). Kể cả khi làm một mình, tự mắng mình ("mình dốt Spring Boot quá") chẳng giải quyết được gì; sửa <em>quy trình</em> ("thêm checklist 5 dòng cho API trước khi mở PR") mới chặn lỗi đó vĩnh viễn.')}</li>
<li>${t('<strong>Toyota Production System "5 Whys" (Taiichi Ohno, 1988):</strong> Instead of slapping a band-aid on the first symptom ("I missed the deadline"), ask <em>"Why?"</em> up to five times until you hit an actionable root cause you control (e.g., skipping Definition of Ready on un-approved wireframes).', '<strong>Phương pháp "5 Whys" của Hệ thống Sản xuất Toyota (Taiichi Ohno, 1988):</strong> Thay vì dán băng cá nhân lên triệu chứng đầu tiên ("mình bị trễ hạn"), hãy hỏi <em>"Vì sao?"</em> liên tiếp tới năm lần cho đến khi chạm nguyên nhân gốc bạn kiểm soát được (vd bỏ qua bước kiểm Definition of Ready cho wireframe chưa duyệt).')}</li>
</ul>

<p>${t('General team retro formats (Start/Stop/Continue, 4Ls, Mad/Sad/Glad) are taught in ', 'Các khung retro nhóm tổng quát (Start/Stop/Continue, 4Ls, Mad/Sad/Glad) đã có ở ')}${cs('agile-teamwork', 'agl-6-2-planning-retro', 'Agile Teamwork 6.2 — Planning &amp; Retro')} ${t('and ', 'và ')}${cs('agile-teamwork', 'agl-9-3-ket-thuc', 'Agile Teamwork 12.3')}${t('. Here we build the <strong>Solo Data-First Retro Pipeline</strong> tied straight to your CT Work metrics and Day 7 review ritual.', '. Tại đây ta dựng <strong>Đường ống Retro Dữ Liệu Một Người</strong> gắn thẳng vào các con số thật trên CT Work và nhịp review Ngày 7 của bạn.')}</p>

<h3>${t('2. The 4-Step Solo Retro Flow (30–45 minutes every Day 7 / Iteration Close)', '2. Luồng Retro Một Người 4 bước (30–45 phút mỗi Ngày 7 / Cuối Iteration)')}</h3>
<pre><code>  [1. GATHER METRICS (10 min · C1 PM)]
      Pull 7 hard numbers from CT Work reports, TimeLogs, Defects, GitHub CI
               |
               v
  [2. INSPECT BY HAT (10 min · C2/C3/C4/C5)]
      Which hat was the bottleneck? Where did Defects/Leakage enter?
               |
               v
  [3. RUN 5 WHYS ON TOP 1-2 PAINS (10 min)]
      Symptom -&gt; Why #1 -&gt; Why #2 -&gt; Why #3 -&gt; Process Root Cause (NO self-blaming!)
               |
               v
  [4. LOCK &lt;= 2 PROCESS EXPERIMENTS (5-10 min · CT Work "retros")]
      Each experiment = [Exact Rule] + [Owner Hat] + [How we measure in Iter 2]
      -&gt; Pin to top of Iter 2 Sprint Planning!</code></pre>

<h3>${t('3. The 7 Hard Metrics Table (Fillable Template + Illustrative LabFlow Iteration 1 Data)', '3. Bảng 7 Chỉ Số Cứng (Mẫu điền được + Dữ liệu giả định minh hoạ cho LabFlow Iteration 1)')}</h3>
<p>${t('Before writing a single opinion in CT Work <code>retros</code>, fill these 7 rows from real evidence (numbers in the LabFlow column below are an <strong>illustrative example</strong> showing how to read patterns — replace them with your real logs!):', 'Trước khi viết bất kỳ dòng cảm nhận nào vào trang <code>retros</code> trên CT Work, hãy điền đủ 7 dòng này từ bằng chứng thật (các con số ở cột LabFlow bên dưới là <strong>ví dụ giả định minh hoạ</strong> cách đọc tín hiệu — khi làm hãy điền số thật từ nhật ký của bạn!):')}</p>

${bang(
  [t('Metric (General)', 'Chỉ số (Tổng quát)'), t('Where to Pull It', 'Lấy từ đâu'), t('Healthy Target', 'Ngưỡng khoẻ mạnh'), t('Illustrative LabFlow Iter 1 Example', 'Ví dụ giả định LabFlow Iter 1'), t('What This Signal Tells You', 'Con số này nói lên điều gì')],
  [
    [t('<strong>1. Commitment Reliability</strong><br>(Done Reqs / Planned Reqs)', '<strong>1. Độ tin cậy cam kết</strong><br>(Req Done / Req Planned)'), t('CT Work <code>reports</code> / WBS', 'CT Work <code>reports</code> / WBS'), '≥ 85%', t('5 / 7 Reqs Done (71%); 2 stretched to Iter 2', '5 / 7 Req Done (71%); dời 2 màn sang Iter 2'), t('Iter 1 capacity was over-estimated by ~25% — lower Iter 2 planned load.', 'Đã ước lượng quá tay ~25% sức chứa ở Iter 1 — cần giảm tải lập kế hoạch Iter 2.')],
    [t('<strong>2. Estimation Accuracy</strong><br>(Actual Hrs / Est Hrs)', '<strong>2. Độ chính xác ước lượng</strong><br>(Giờ thực tế / Giờ ước lượng)'), t('<code>TimeLogs</code> vs Sprint Plan', '<code>TimeLogs</code> vs Sprint Plan'), '0.85 – 1.20', t('64h actual / 48h est = <strong>1.33×</strong> (BE Security took 2.1×)', '64h thực tế / 48h ước lượng = <strong>1,33×</strong> (BE Security tốn 2,1×)'), t('Apply a 1.3× multiplier on unfamiliar BE/integration tasks in Iter 2.', 'Nhân hệ số 1,3× cho các việc BE/tích hợp mới mẻ ở Iter 2.')],
    [t('<strong>3. Quality Ratio</strong><br>(Internal Defects vs Lecturer Leakage)', '<strong>3. Tỷ lệ chất lượng</strong><br>(Defect tự bắt vs Leakage GV bắt)'), t('CT Work <code>Defects</code> / <code>Leakage</code>', 'CT Work <code>Defects</code> / <code>Leakage</code>'), t('Leakage = 0 (or declining)', 'Leakage = 0 (hoặc giảm dần)'), t('8 Internal Defects caught by C5; <strong>2 Leakage</strong> caught by Lecturer (whitespace search 500 + missing secondary actor)', 'C5 tự bắt 8 Defect; <strong>2 Leakage</strong> do GV bắt (tìm khoảng trắng ra 500 + thiếu secondary actor)'), t('QA checklist missed whitespace search edge case and SRS diagram audit.', 'Checklist QA bị lọt ca tìm kiếm toàn dấu cách và bước soát sơ đồ SRS.')],
    [t('<strong>4. First-Pass CI Green Rate</strong>', '<strong>4. Tỷ lệ CI Xanh ngay lượt đầu</strong>'), t('GitHub Actions history', 'Lịch sử GitHub Actions'), '≥ 75%', t('4 / 7 PRs green on push #1 (57%) — 3 failed ESLint/checkstyle', '4 / 7 PR xanh ngay lần push 1 (57%) — 3 lần trượt ESLint/checkstyle'), t('Developer forgot to run local lint/build before pushing.', 'Dev quên chạy lint/build dưới máy trước khi push.')],
    [t('<strong>5. Cooling-Off &amp; PR Size Compliance</strong>', '<strong>5. Tuân thủ khoảng nghỉ &amp; cỡ PR</strong>'), t('PR timestamps &amp; diff lines', 'Mốc giờ PR &amp; số dòng diff'), t('100% ≥ 1h gap; ≤ 400 lines', '100% nghỉ ≥ 1h; ≤ 400 dòng'), t('6 / 7 PRs respected gap; 1 PR ballooned to 680 lines (<code>S14</code>)', '6 / 7 PR giữ đúng khoảng nghỉ; 1 PR phình tới 680 dòng (<code>S14</code>)'), t('Bundle of BE + FE + upload in 1 PR was too big to review cleanly.', 'Gộp BE + FE + upload trong 1 PR quá to nên khó soi kỹ.')],
    [t('<strong>6. Rework Hours</strong><br>(Hours lost to unclear spec/wireframe)', '<strong>6. Giờ làm lại (Rework)</strong><br>(Giờ mất vì đặc tả/wireframe mơ hồ)'), t('<code>TimeLogs</code> (Type = Updating)', '<code>TimeLogs</code> (Type = Updating)'), '≤ 15% total hrs', t('11h / 64h (17%) — 6h re-building form after wireframe feedback', '11h / 64h (17%) — mất 6h sửa form sau khi GV góp ý wireframe'), t('Never code a screen whose wireframe is still "Pending approval".', 'Tuyệt đối không code màn hình có wireframe còn đang "Chờ duyệt".')],
    [t('<strong>7. Sustainability / Burnout Check</strong>', '<strong>7. Kiểm tra sức bền / kiệt sức</strong>'), t('Daily Log sleep &amp; rest day', 'Daily Log giấc ngủ &amp; ngày nghỉ'), t('Day 7 rested; ≥ 7h sleep', 'Nghỉ trọn Ngày 7; ngủ ≥ 7h'), t('1 late night (2 AM) before demo; Day 7 kept intact', '1 đêm thức khuya (2h sáng) trước demo; giữ được Ngày 7 nghỉ'), t('Enforce 12-hour Demo Freeze before Iter 2 Review to kill late-night rush.', 'Áp luật khoá bản Demo trước 12 giờ cho Iter 2 để xoá cảnh chạy đêm.')]
  ]
)}

<h3>${t('4. From 5 Whys to Max-2 Process Experiments (worked LabFlow example + Fillable Canvas)', '4. Từ 5 Whys ra tối đa 2 Thử nghiệm Quy trình (ví dụ LabFlow + Khung Retro điền được)')}</h3>
<p>${t('Watch how a vague emotional complaint transforms into a sharp, verifiable engineering rule:', 'Xem cách một lời than cảm tính biến thành một luật kỹ thuật sắc nét, kiểm chứng được:')}</p>
<ul>
<li>${t('<em>Symptom:</em> Lecturer caught a 500 error on whitespace search in <code>S13</code> (Leakage #1) and 3 PRs failed CI on push #1.', '<em>Triệu chứng:</em> Giảng viên bắt lỗi 500 khi gõ toàn dấu cách ở ô tìm kiếm <code>S13</code> (Leakage #1) và 3 PR bị CI đỏ ngay lần push đầu.')}</li>
<li>${t('<em>Why #1:</em> Why did whitespace search reach the lecturer? Because C5 QA tested empty string <code>""</code> but did not test spaces <code>"   "</code>.', '<em>Why #1:</em> Vì sao lỗi tìm kiếm toàn dấu cách lọt tới thầy? Vì mũ C5 QA chỉ test chuỗi rỗng <code>""</code> mà không test chuỗi dấu cách <code>"   "</code>.')}</li>
<li>${t('<em>Why #2:</em> Why didn\'t C5 test spaces and why did 3 PRs fail lint? Because C4/C5 relied on memory instead of a written pre-push and unhappy-case checklist.', '<em>Why #2:</em> Vì sao C5 không test dấu cách và 3 PR trượt lint? Vì C4/C5 nhớ bằng đầu thay vì chạy theo checklist viết sẵn.')}</li>
<li>${t('<em>Root Cause:</em> Missing concrete trigger in PR Template and local pre-push routine.', '<em>Nguyên nhân gốc:</em> Thiếu mục kiểm cụ thể trong Mẫu PR và thói quen kiểm dưới máy trước khi push.')}</li>
<li>${t('<em>Resulting Experiments (ONLY 2 — never 10!):</em><br><strong>Experiment #1 [C5 QA]:</strong> Add a mandatory checkbox <em>"Whitespace-only input trimmed &amp; tested on all search/form fields"</em> to <code>PULL_REQUEST_TEMPLATE.md</code>. <em>Success metric in Iter 2:</em> 0 whitespace Leakage bugs.<br><strong>Experiment #2 [C3/C4 Dev]:</strong> Run one local pre-push check (<code>./mvnw test</code> + <code>npm run lint &amp;&amp; npm run build</code>) before every <code>git push</code>. <em>Success metric in Iter 2:</em> First-Pass CI Green Rate ≥ 85%.', '<em>Hai Thử nghiệm chốt ra (CHỈ TỐI ĐA 2 — không bao giờ chốt 10!):</em><br><strong>Thử nghiệm #1 [C5 QA]:</strong> Thêm ô tích bắt buộc <em>"Đã trim &amp; test đầu vào toàn dấu cách cho mọi ô tìm kiếm/form"</em> vào <code>PULL_REQUEST_TEMPLATE.md</code>. <em>Thước đo đạt ở Iter 2:</em> 0 lỗi Leakage dấu cách.<br><strong>Thử nghiệm #2 [C3/C4 Dev]:</strong> Chạy bộ kiểm cục bộ (<code>./mvnw test</code> + <code>npm run lint &amp;&amp; npm run build</code>) trước mọi lệnh <code>git push</code>. <em>Thước đo đạt ở Iter 2:</em> Tỷ lệ CI Xanh ngay lượt đầu ≥ 85%.')}</li>
</ul>

${out(`[DATA-FIRST SOLO RETRO CANVAS — Iteration: ___ | Date: ___ | Hat: C1 PM]
1. HARD NUMBERS (from CT Work + GitHub):
   - Reqs Done/Planned: ___ / ___ | Actual/Est Hrs: ___ / ___ (ratio: ___)
   - Defects (internal): ___ | Leakage (external): ___ | CI 1st-Pass Green: ___%
   - Max PR size: ___ lines | Rework hrs: ___ | Late nights (&gt;midnight): ___
2. KEEP (what worked — protect it):
   - ...
3. PAIN &amp; 5 WHYS (top 1-2 bottlenecks only):
   - Pain: ___ -&gt; Root cause: ___
4. SECURITY RETRO CHECK (1 question):
   - Did any secret, unvalidated input, or missing auth check reach a PR? [ ] No [ ] Yes -&gt; Guardrail added: ___
5. NEXT-ITERATION EXPERIMENTS (MAX 2 — testable!):
   - Exp #1 [Owner Hat ___]: Action: ___ | Verify on Date: ___ | Pass Metric: ___
   - Exp #2 [Owner Hat ___]: Action: ___ | Verify on Date: ___ | Pass Metric: ___`)}

<h3>🕵️ ${t('The security &amp; hacker angle: the 2-minute Security Retro Check', 'Góc bảo mật &amp; hacker: câu hỏi Kiểm Bảo Mật 2 phút cuối mỗi Retro')}</h3>
<p>${t(
    'Most vulnerabilities repeat in patterns inside a codebase: if you forgot an ownership check on <code>S06 Profile</code> in Iteration 1, you are very likely to forget it again on <code>S24 Cancel Reservation</code> in Iteration 2 unless your retrospective turns that near-miss into an automated guardrail (a unit test pattern, a Spring Security annotation rule, or a PR checklist item). Adding ONE mandatory Security Retro Question ensures every iteration leaves your codebase <strong>structurally harder to hack</strong> than the iteration before.',
    'Phần lớn lỗ hổng bảo mật lặp lại theo khuôn mẫu trong cùng một codebase: nếu bạn quên kiểm quyền sở hữu ở màn <code>S06 Profile</code> tại Iteration 1, xác suất rất cao bạn sẽ quên lần nữa ở màn <code>S24 Huỷ đặt phòng</code> tại Iteration 2 trừ khi buổi retro biến cú suýt hớ đó thành hàng rào tự động (một mẫu unit test, một quy tắc annotation Spring Security, hay một ô tích trên mẫu PR). Chỉ cần thêm ĐÚNG MỘT câu hỏi Kiểm Bảo Mật vào mỗi buổi Retro sẽ bảo đảm sau mỗi vòng, hệ thống của bạn <strong>khó bị tấn công hơn về mặt cấu trúc</strong> so với vòng trước.')}</p>

<h3>${t('5. Three Retro anti-patterns to avoid', '5. Ba kiểu làm Retro sai cần tránh')}</h3>
<ul>
<li>${t('<strong>Writing 8 action items and executing 0:</strong> Trying to overhaul eight habits at once guarantees failure. Pick <strong>at most 2</strong> high-leverage experiments and check them at the start of the next Retro.', '<strong>Viết ra 8 mục cải tiến rồi không làm mục nào:</strong> Cố sửa tám thói quen cùng lúc chắc chắn sẽ bỏ cuộc. Chỉ chọn <strong>tối đa 2</strong> thử nghiệm có đòn bẩy lớn nhất và kiểm nghiệm lại ngay đầu buổi Retro kế tiếp.')}</li>
<li>${t('<strong>Emotional self-beating instead of process tuning:</strong> Writing <em>"I was lazy"</em> gives your brain zero instructions for Monday morning. Rewrite it into a concrete trigger: <em>"Start a 25-minute Pomodoro timer at 8:30 AM with phone in another room."</em>', '<strong>Tự trách móc cảm tính thay vì chỉnh quy trình:</strong> Viết <em>"Mình lười quá"</em> không cho não bạn bất kỳ hướng dẫn cụ thể nào cho sáng Thứ Hai. Hãy viết lại thành kích hoạt cụ thể: <em>"Bật đồng hồ Pomodoro 25 phút lúc 8h30 sáng, để điện thoại ở phòng khác."</em>')}</li>
<li>${t('<strong>Skipping Retro when an iteration went well:</strong> Even in a 100%-green sprint, record WHAT made it smooth (e.g., splitting BE/FE PRs early) so you consciously repeat it when Iteration 2 gets harder.', '<strong>Bỏ Retro khi một vòng chạy êm đẹp:</strong> Kể cả trong sprint xanh 100%, hãy ghi lại ĐIỀU GÌ làm nó mượt (vd tách sớm PR BE/FE) để chủ động lặp lại khi Iteration 2 khó hơn gấp đôi.')}</li>
</ul>

${phongVan([
  [t('"Can you give me a real example of something your team (or you) changed after a Sprint Retrospective that you tracked into the next sprint?"', '"Bạn hãy kể một ví dụ thật về một điều đội bạn (hoặc chính bạn) đã thay đổi sau buổi Sprint Retrospective và theo dõi ở sprint kế tiếp?"'), t('<strong>[Template — replace with your real numbers]</strong> After Iteration 1 of my project, my CT Work retro metrics showed two clear bottlenecks: __% of hours went to rework from coding before wireframes were approved, and my first-pass CI green rate was only __% because I skipped local lint/test checks. Instead of writing vague resolutions, I locked two concrete process rules: enforce wireframe approval in Definition of Ready and run local lint+test before every push — then tracked both metrics directly in CT Work during Iteration 2 to verify whether the changes worked.', '<strong>[Mẫu — thay bằng số thật của bạn]</strong> Sau Iteration 1 của dự án, số đo retro trên CT Work cho thấy hai điểm nghẽn rõ ràng: __% thời gian bị mất cho làm lại vì code trước khi wireframe được chốt, và tỷ lệ CI xanh ngay lượt đầu chỉ đạt __% do quên chạy lint/test cục bộ. Thay vì ghi mục tiêu chung chung, em chốt đúng hai luật quy trình: siết duyệt wireframe trong Definition of Ready và chạy lint+test dưới máy trước mỗi lệnh push — rồi theo dõi lại đúng hai chỉ số này trên CT Work ở Iteration 2 để kiểm chứng hiệu quả.')]
], en)}

${apDung([
  [t('Different topic — Multi-vendor E-commerce Marketplace', 'Đề tài khác — Sàn thương mại điện tử nhiều người bán'), t('Pull the exact 7 metrics after Iteration 1 of your marketplace. If your retro exposes recurring floating-point rounding or currency-display bugs, your Experiment #1 becomes adding a Checkstyle/ESLint ban on <code>double</code> in pricing packages + a BigDecimal unit-test template for Iteration 2.', 'Rút đúng 7 chỉ số này sau Iteration 1 của sàn TMĐT. Nếu retro phơi bày lỗi làm tròn số thực hay hiển thị tiền tệ lặp đi lặp lại, Thử nghiệm #1 của bạn sẽ là thêm luật Checkstyle/ESLint cấm dùng <code>double</code> trong package tính giá + mẫu unit test BigDecimal cho Iteration 2.')],
  [t('Real 5-person team (SEP490 Capstone)', 'Đồ án nhóm thật 5 người (SEP490)'), t('Use CT Work <code>retros</code> with anonymous sticky cards for 10 minutes so quiet teammates speak honestly without fear, display the 7 team metrics on screen first (keeping the discussion factual, never personal attacks), vote on the top 2 experiments, and assign ONE named owner per experiment.', 'Dùng trang <code>retros</code> trên CT Work ở chế độ ghi thẻ ẩn danh 10 phút để các bạn ít nói chia sẻ thẳng thắn không ngại đụng chạm, chiếu 7 chỉ số chung lên màn hình trước (giữ buổi họp bám sự thật, không công kích cá nhân), bỏ phiếu chọn tối đa 2 thử nghiệm và gán ĐÚNG MỘT người theo sát mỗi thử nghiệm.')],
  [t('Large enterprise / outsourcing company (FPT Software, 20–100 people)', 'Công ty lớn / dự án outsourcing (FPT Software, 20–100 người)'), t('Teams combine Sprint Retrospectives with formal <strong>Causal Analysis and Resolution (CAR — CMMI Level 5 practice)</strong>: tracking Defect Removal Efficiency (DRE = internal defects / total defects), categorizing root causes (Requirement, Design, Coding, Test), and feeding systemic fixes into organization-wide checklists and CI linters.', 'Các đội kết hợp Sprint Retrospective với quy trình <strong>Phân tích Nguyên nhân Gốc và Khắc phục (CAR — thực hành chuẩn CMMI)</strong>: đo Hiệu suất Bắt Lỗi (DRE = lỗi tự bắt / tổng lỗi), phân nhóm nguyên nhân (Yêu cầu, Thiết kế, Code, Test) và cập nhật thành checklist cùng bộ lint CI chuẩn toàn dự án.')]
], en)}

${viecLabflow([
  [t('On Day 7 at the end of Iteration 1, open CT Work <strong>LF #2</strong> → <code>retros</code>, populate all 7 hard metrics from your REAL TimeLogs/Defects/GitHub Actions, run 5 Whys on your #1 bottleneck, complete the 2-minute Security Retro Check, and pin <strong>at most 2 measurable Process Experiments</strong> to the top of your Iteration 2 Backlog.', 'Vào Ngày 7 cuối Iteration 1, mở CT Work <strong>LF #2</strong> → <code>retros</code>, điền đủ 7 chỉ số cứng từ TimeLogs/Defects/GitHub Actions THẬT của bạn, chạy 5 Whys cho nút thắt số 1, hoàn tất câu hỏi Kiểm Bảo Mật 2 phút và ghim <strong>tối đa 2 Thử nghiệm Quy trình đo được</strong> lên đầu Backlog Iteration 2.'), t('A saved Retro board on CT Work containing real sprint metrics (zero fabricated numbers), 1 blameless root-cause chain, and 1–2 concrete experiments with pass metrics and check dates for Iteration 2.', 'Một bảng Retro lưu trên CT Work chứa số liệu thật (không bịa số), 1 chuỗi nguyên nhân gốc không đổ lỗi và 1–2 thử nghiệm cụ thể có thước đo đạt cùng ngày kiểm nghiệm cho Iteration 2.')]
], en)}

${thuatNgu([
  ['Sprint Retrospective (Buổi cải tiến sau Sprint)', t('A structured review of HOW the team worked (process, tools, quality, habits) — distinct from Sprint Review, which inspects WHAT product was built.', 'Buổi rà soát có cấu trúc về CÁCH làm việc (quy trình, công cụ, chất lượng, thói quen) — khác với Sprint Review vốn kiểm tra SẢN PHẨM làm ra.')],
  ['Blameless Postmortem (Hậu kiểm không đổ lỗi)', t('An engineering culture (popularized by Google SRE &amp; Etsy) focused on fixing weak processes and missing guardrails rather than shaming individuals.', 'Văn hoá kỹ thuật (phổ biến bởi Google SRE &amp; Etsy) tập trung vá quy trình yếu và hàng rào thiếu thay vì đổ lỗi hay chỉ trích cá nhân.')],
  ['5 Whys (5 lần hỏi Vì sao)', t('Toyota Production System root-cause technique asking "Why?" iteratively until uncovering an actionable systemic cause.', 'Kỹ thuật tìm nguyên nhân gốc của Toyota bằng cách hỏi "Vì sao?" lặp lại cho tới khi chạm tới nguyên nhân hệ thống sửa được.')],
  ['Defect Removal Efficiency (DRE)', t('Percentage of bugs caught internally BEFORE release/submission: Internal Defects ÷ (Internal Defects + External Leakage). Higher is better.', 'Tỷ lệ lỗi bắt được nội bộ TRƯỚC KHI phát hành/nộp bài: Lỗi nội bộ ÷ (Lỗi nội bộ + Leakage bên ngoài). Càng cao càng tốt.')],
  ['Process Experiment (Thử nghiệm quy trình)', t('A single small, concrete habit or guardrail change tested for one sprint with a clear owner and pass metric.', 'Một thay đổi nhỏ, cụ thể về thói quen hoặc hàng rào kiểm tra được thử nghiệm trọn một sprint với người chịu trách nhiệm và thước đo đạt rõ ràng.')]
], en)}

${tomTat([
  t('Never skip Retrospective just because you are solo — without data-driven reflection, you repeat the exact same Iteration 1 mistakes in Iteration 2.', 'Đừng bỏ Retro chỉ vì bạn làm một mình — không soi lại bằng dữ liệu, bạn sẽ vấp đúng lỗi của Iteration 1 lặp lại ở Iteration 2.'),
  t('Always pull the <strong>7 Hard Metrics first</strong> (Commitment, Est vs Actual, Defects vs Leakage, CI Green Rate, PR Hygiene, Rework, Burnout) before writing opinions.', 'Luôn rút <strong>7 Chỉ Số Cứng trước</strong> (Độ tin cậy cam kết, Ước lượng vs Thực tế, Defect vs Leakage, Tỷ lệ CI xanh, Vệ sinh PR, Giờ làm lại, Sức bền) trước khi viết cảm nhận.'),
  t('Run a <strong>blameless 5 Whys</strong> (Google SRE + Toyota style) plus the 2-minute Security Retro Check to fix mechanisms instead of blaming yourself.', 'Chạy <strong>5 Whys không đổ lỗi</strong> (kiểu Google SRE + Toyota) kèm câu hỏi Kiểm Bảo Mật 2 phút để sửa cơ chế thay vì tự trách bản thân.'),
  t('Lock <strong>at most 2 concrete, measurable Process Experiments</strong> and review them at the start of Iteration 2 Retro.', 'Chốt <strong>tối đa 2 Thử nghiệm Quy trình cụ thể, đo được</strong> và kiểm lại kết quả ngay đầu buổi Retro của Iteration 2.')
], en)}
<p>${t('Cross-references: ', 'Đọc thêm: ')}${cs('agile-teamwork', 'agl-6-2-planning-retro', 'Agile Teamwork 6.2 — Planning &amp; Retro')} · ${cs('agile-teamwork', 'agl-5-4-postmortem', 'Agile Teamwork 5.4 — Blameless postmortems')} · ${ac('software-testing', 'swt301-bug-lifecycle', 'SWT301 7.6 — Defect metrics')}. ${t('Next: ', 'Bài tiếp: ')}${dm('dm5-7-6-dong-iteration-package-rtm', t('7.6 — Closing the Iteration: Git Tag, Package v1, Weekly Report, Tracking &amp; RTM', '7.6 — Đóng iteration: tag, Package v1, Weekly Report, Tracking &amp; RTM'))}.</p>
`);
};

export default {
  title: '7.5 — Solo Retrospective: Replacing Gut Feeling with Real Data|||7.5 — Retro một người: dữ liệu thay cảm giác',
  slug: 'dm5-7-5-retro-mot-nguoi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quy trình Retro Một Người 30 phút dựa trên dữ liệu thật thay cho tự trách cảm tính: văn hoá hậu kiểm không đổ lỗi Google SRE (2016) & 5 Whys Toyota, bảng 7 chỉ số cứng (Cam kết, Ước lượng, DRE, CI xanh, PR, Rework, Sức bền), kiểm bảo mật 2 phút và khung chốt tối đa 2 Thử nghiệm Quy trình.',
  content: L75(true) + L75(false),
};
