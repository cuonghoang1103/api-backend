/**
 * 5.1 — README giúp người khác chạy được ngay (agl-5-1-readme). Soạn 24/11/2026, agent agt.
 * Lab chạy THẬT: scratchpad/agt/lab/ch5/chay-readme.mjs (container node:22-alpine --network none --memory 2g), kb-ban-do.sh,
 * mau/labflow/scripts/{ban-do,kiem-moi-truong}.mjs, kb-bai-tap.sh — qua ./_ma.mjs.
 * Phát hiện thật khi soạn: chính "npm test" của repo mẫu hỏng (node --test test/ không nhận thư mục ở Node 22) — README chạy thử bắt được.
 * Ranh giới: 5 câu README bảo trì ⇒ doc-code-cu 1.5; README portfolio ⇒ git mốc 16; đọc README tiếng Anh ⇒ tak 1.4.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, bash, js, out, ag, cs, ac, vo } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

const lan = (n) => RA.readme.split(/\n(?=\$ node chay-readme)/)[n];

export const L51 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 5 · Lesson 5.1', 'Chương 5 · Bài 5.1', `
<h2>${t('5.1 — READMEs that get people running', '5.1 — README giúp người khác chạy được ngay')}</h2>
<p class="lead">${t(
    'A team README has one job: a person who has never seen the repo gets it running on a clean machine, in about half an hour, without asking anyone. Most student READMEs fail that job and nobody notices — because the people who wrote them never start from a clean machine. In this lesson you test a README the way you test code: by running it.',
    'README của nhóm có đúng một việc: một người chưa từng thấy repo chạy được nó trên máy sạch, trong khoảng nửa giờ, không phải hỏi ai. Phần lớn README của sinh viên trượt việc đó mà không ai biết — vì người viết không bao giờ bắt đầu từ máy sạch. Bài này kiểm README như kiểm mã: bằng cách chạy nó.')}</p>
${note(t('What a maintenance README must answer (five questions, only verified facts) is in ', 'README bảo trì phải trả lời gì (năm câu, chỉ ghi điều đã kiểm chứng) có ở ') + cs('doc-code-cu-va-refactor', 'lgc-1-5-readme', t('Reading legacy code 1.5', 'Đọc code cũ 1.5')) + t('; a portfolio README for recruiters is ', '; README làm portfolio cho nhà tuyển dụng ở ') + cs('git', 'git-moc-16', t('Git project milestone 16', 'Git mốc dự án 16')) + t('; reading English READMEs fast is ', '; đọc nhanh README tiếng Anh ở ') + cs('tieng-anh-ky-thuat-di-lam', 'tak-1-4-lab', t('Technical English 1.4', 'Tiếng Anh kỹ thuật 1.4')) + t('. This lesson is the <em>team</em> README: onboarding five people, keeping "who owns which screen" true, and making the build fail when the README lies.', '. Bài này là README của <em>nhóm</em>: đưa năm người vào việc, giữ "ai phụ trách màn nào" luôn đúng, và làm CI đỏ khi README nói sai.'))}

<h3>${t('Everyday picture: a recipe for your roommate', 'Liên tưởng đời thường: công thức nấu ăn cho bạn cùng phòng')}</h3>
<p>${t(
    '"Add salt to taste, cook until done" works for you because you have cooked it twenty times. Your roommate needs "one teaspoon of salt; after 8 minutes the onion turns golden — that is done". A README is a recipe for someone who has never cooked your dish: exact quantities (versions), exact steps (commands), and how to know each step worked ("Done when").',
    '"Nêm muối vừa ăn, nấu tới khi chín" ổn với bạn vì bạn đã nấu hai mươi lần. Bạn cùng phòng cần "một thìa cà phê muối; sau 8 phút hành vàng là được". README là công thức cho người chưa từng nấu món của bạn: định lượng chính xác (phiên bản), bước chính xác (lệnh), và cách biết mỗi bước đã đúng ("Đúng khi").')}</p>

<h3>${t('Who actually reads a team README', 'Ai thật sự đọc README của nhóm')}</h3>
${bang([t('Reader', 'Người đọc'), t('When', 'Lúc nào'), t('What they need', 'Họ cần gì')], [
    [t('A member in week 1', 'Thành viên tuần 1'), t('Sprint 0', 'Sprint 0'), t('Run FE + BE + DB the first time', 'Chạy FE + BE + CSDL lần đầu')],
    [t('A member whose laptop died in week 8', 'Thành viên hỏng laptop tuần 8'), t('The worst week', 'Tuần tệ nhất'), t('Reinstall fast, without the leader', 'Cài lại nhanh, không cần trưởng nhóm')],
    [t('Your supervisor', 'Giảng viên hướng dẫn'), t('Before a review', 'Trước buổi review'), t('Run the demo themselves; see who did which screen', 'Tự chạy demo; xem ai làm màn nào')],
    [t('The defence committee', 'Hội đồng bảo vệ'), t('Final week', 'Tuần cuối'), t('Structure, decisions, ownership', 'Cấu trúc, quyết định, phân công')],
    [t('You, at OJT', 'Bạn, khi đi OJT'), t('Day 1 at the company', 'Ngày 1 ở công ty'), t('The same thing — on a repo you did not write', 'Đúng những thứ đó — trên repo bạn không viết')],
  ])}

<h3>${t('Six sections of a team README', 'Sáu phần của README nhóm')}</h3>
${bang(['#', t('Section', 'Phần'), t('The rule that makes it useful', 'Luật làm nó có ích')], [
    ['1', t('Prerequisites', 'Cần có trên máy'), t('Exact versions + the command that checks each one.', 'Phiên bản chính xác + lệnh kiểm từng cái.')],
    ['2', t('First run', 'Chạy lần đầu'), t('Copy-pasteable commands; every step ends with "Done when: …".', 'Lệnh chép-dán được; mỗi bước kết thúc bằng "Đúng khi: …".')],
    ['3', t('Sample accounts', 'Tài khoản mẫu'), t('One per role, dev database only — never a real password.', 'Mỗi vai một tài khoản, chỉ CSDL dev — không bao giờ mật khẩu thật.')],
    ['4', t('Screen map', 'Bản đồ màn hình'), t('Screen → folder → owner, <strong>generated</strong> from the assignment file.', 'Màn → thư mục → người phụ trách, <strong>sinh tự động</strong> từ tệp phân công.')],
    ['5', t('Contributing', 'Đóng góp'), t('One paragraph + links to CONTRIBUTING and the ADRs (lessons 3.1, 5.2).', 'Một đoạn + liên kết tới CONTRIBUTING và ADR (bài 3.1, 5.2).')],
    ['6', t('Stuck?', 'Kẹt ở đâu'), t('Error text → meaning → fix; and when to ask, with what.', 'Chữ lỗi → nghĩa → cách sửa; và khi nào hỏi, gửi kèm gì.')],
  ])}

<h3>${t('Lab: run the README on a clean machine', 'Lab: chạy README trên máy sạch')}</h3>
<p>${t(
    'The script below reads every <code>&#96;&#96;&#96;bash</code> block of a README and runs them in order inside a fresh <code>node:22-alpine</code> container: no network, 2 GB RAM, and only the files git would give a new member (so no <code>.env</code>). It stops at the first broken block and reports the README line. A block preceded by <code>&lt;!-- nen --&gt;</code> runs in the background, like "open another terminal and leave it running".',
    'Script dưới đây đọc mọi khối <code>&#96;&#96;&#96;bash</code> của README và chạy lần lượt trong một container <code>node:22-alpine</code> mới tinh: không mạng, 2 GB RAM, và chỉ có những tệp git đưa cho người mới (nên không có <code>.env</code>). Nó dừng ở khối hỏng đầu tiên và báo dòng của README. Khối có <code>&lt;!-- nen --&gt;</code> ngay trước thì chạy nền, như "mở terminal khác và để nó chạy".')}</p>
${js(MA.chayReadme)}
<p>${t('The README a team usually writes on day one:', 'README nhóm thường viết ngày đầu:')}</p>
${out(MA.readmeV1)}
${out(lan(0))}
<p>${t(
    'The author always typed <code>npm run dev</code> in another project and never noticed this one calls it <code>start</code>. Fix that one word and run again:',
    'Tác giả quen gõ <code>npm run dev</code> ở dự án khác và không để ý dự án này gọi là <code>start</code>. Sửa đúng một chữ đó rồi chạy lại:')}</p>
${out(lan(1))}
<p>${t(
    'On the author’s laptop <code>.env</code> has existed since week 1, so the step "copy .env.example" never felt like a step. That is the core problem: <strong>the person who wrote the README is the one person who cannot test it by reading</strong>.',
    'Trên laptop tác giả, <code>.env</code> đã có từ tuần 1, nên bước "chép .env.example" chưa bao giờ giống một bước. Đó là vấn đề gốc: <strong>người viết README là người duy nhất không thể kiểm nó bằng cách đọc</strong>.')}</p>

<h4>${t('The team version — and what it caught on its first run', 'Bản của nhóm — và lần chạy đầu nó bắt được gì')}</h4>
${out(MA.readmeV2)}
<p>${t(
    'The first time this README ran on a clean machine it found a bug that was not in the README at all — the project’s own <code>npm test</code> was broken (real output, Node 22 inside the container):',
    'Lần đầu README này chạy trên máy sạch, nó tìm ra một lỗi không nằm trong README — chính <code>npm test</code> của dự án hỏng (output thật, Node 22 trong container):')}</p>
${out(RA.readmeLanDau.split('\n[khối 4')[0].split('\n').filter((d) => !/^  # +(at|node:|throw|\^)/.test(d)).join('\n'))}
<p>${t(
    '<code>node --test test/</code> did not accept a directory on this Node version, so <code>"test"</code> became <code>node --test test/*.test.mjs</code>. Nobody had run the tests from <code>npm test</code> — everyone ran single files from the editor. After the fix:',
    '<code>node --test test/</code> không nhận thư mục ở bản Node này, nên <code>"test"</code> đổi thành <code>node --test test/*.test.mjs</code>. Chưa ai chạy test qua <code>npm test</code> — mọi người chạy từng tệp trong trình soạn thảo. Sau khi sửa:')}</p>
${out(lan(2))}
${cl('tip', `<p>${t(
    'Make this script a CI job that runs on every PR touching README, <code>package.json</code> or <code>.env.example</code>. The spring-boot side does the same with a <code>maven:3.9-eclipse-temurin-21</code> container and a Postgres service; the idea is identical. And once per iteration, ask someone <em>outside</em> the team to follow the README with a timer — machines catch broken commands, humans catch confusing ones.',
    'Biến script này thành một job CI chạy với mọi PR chạm README, <code>package.json</code> hoặc <code>.env.example</code>. Phía Spring Boot làm y hệt với container <code>maven:3.9-eclipse-temurin-21</code> và một dịch vụ Postgres. Và mỗi iteration một lần, nhờ một người <em>ngoài</em> nhóm làm theo README, bấm giờ — máy bắt lệnh hỏng, người bắt chỗ khó hiểu.')}</p>`)}

<h3>${t('A screen map that cannot go stale', 'Bản đồ màn hình không thể lỗi thời')}</h3>
<p>${t(
    'SWP391 grades each person by the screens they own (see ', 'SWP391 chấm từng người theo màn họ phụ trách (xem ') + ac('software-development-project', 'swp391-4-complexity-loc-grade', 'SWP391 — complexity, LOC') + t('), and assignments change mid-term. A hand-written table in the README is wrong within a month. Keep one source of truth — <code>docs/phan-cong.csv</code> from lesson 2.2 — and generate the table:', '), và phân công đổi giữa kỳ. Bảng gõ tay trong README sẽ sai sau một tháng. Giữ một nguồn sự thật — <code>docs/phan-cong.csv</code> từ bài 2.2 — và sinh bảng:')}</p>
${js(MA.banDo)}
${out(RA.banDo)}
<p>${t(
    'The <code>--kiem</code> mode is what CI runs: the team changed the plan in a meeting, someone edited the CSV, nobody touched the README — and the build said so with the exact line to add.',
    'Chế độ <code>--kiem</code> là thứ CI chạy: nhóm đổi việc trong buổi họp, ai đó sửa CSV, không ai đụng README — và CI nói ra đúng dòng phải thêm.')}</p>

<h3>${t('.env.example is a contract', '.env.example là một hợp đồng')}</h3>
<p>${t(
    'Every key the app needs lives in <code>.env.example</code> with a safe sample value; real values live only in each machine’s <code>.env</code>, which is in <code>.gitignore</code>. A tiny checker compares the two:',
    'Mọi khoá ứng dụng cần nằm trong <code>.env.example</code> với giá trị mẫu an toàn; giá trị thật chỉ nằm ở <code>.env</code> của từng máy, đã có trong <code>.gitignore</code>. Một script nhỏ so hai tệp:')}</p>
${js(MA.kiemMoiTruong)}
${cl('warn', `<p><strong>${t('Exercise 5.1', 'Bài tập 5.1')}</strong> — ${t(
    'C2 adds <code>DB_URL</code> to <code>.env.example</code> in a PR. C5 still has the <code>.env</code> from week 1. What does C5 see, and what should C2’s PR have contained so C5 never wastes an evening on it?',
    'C2 thêm <code>DB_URL</code> vào <code>.env.example</code> trong một PR. Máy C5 vẫn giữ <code>.env</code> từ tuần 1. C5 thấy gì, và PR của C2 lẽ ra phải có gì để C5 không mất một buổi tối vì nó?')}</p>
${giai(t('Real output and answer', 'Output thật và đáp án'), `${out(RA.baiTap.split('### BT 5.2')[0].replace(/^### [^\n]*\n/, ''))}
<p>${t(
    'The checker names the missing key instead of letting the app fail later with a confusing database error. C2’s PR should: (1) add the key with a safe sample to <code>.env.example</code>; (2) add a row to the README "Stuck?" table; (3) say in the PR description "after merging, run <code>npm run kiem-moi-truong</code>, add DB_URL to your .env"; (4) post the same line in the team channel. Changing configuration is a change for <em>everyone’s machine</em>, not just the code.',
    'Script nêu đúng khoá thiếu thay vì để ứng dụng hỏng muộn với lỗi CSDL khó hiểu. PR của C2 lẽ ra phải: (1) thêm khoá với giá trị mẫu an toàn vào <code>.env.example</code>; (2) thêm một dòng vào bảng "Kẹt ở đâu" của README; (3) ghi trong mô tả PR "sau khi merge, chạy <code>npm run kiem-moi-truong</code>, thêm DB_URL vào .env"; (4) nhắn đúng câu đó ở kênh nhóm. Đổi cấu hình là đổi <em>máy của mọi người</em>, không chỉ đổi mã.')}</p>`)}`)}

<h3>${t('Incident corner: what a README must never contain', 'Góc sự cố: README không bao giờ được chứa gì')}</h3>
<p>${t(
    'The fastest way to make onboarding "easy" is to paste the real database password or API key into the README. Toyota’s T-Connect (disclosed October 2022) had an access key sitting in a public GitHub repository for almost five years — the full story and how to scan your own history are in ',
    'Cách nhanh nhất làm việc vào dự án "dễ" là dán mật khẩu CSDL hay khoá API thật vào README. Toyota T-Connect (công bố 10/2022) để một khoá truy cập nằm trong repo GitHub công khai gần năm năm — câu chuyện đầy đủ và cách quét lịch sử repo của bạn ở ')
    + ag('agl-10-7-su-co-that', t('lesson 10.7', 'bài 10.7')) + t(
    '. Rules for the team README: sample accounts only for the dev database; secrets only in <code>.env</code> and in the CI secret store; the README tells people <em>where to ask</em> for a secret, never the secret.',
    '. Luật cho README nhóm: tài khoản mẫu chỉ của CSDL dev; bí mật chỉ ở <code>.env</code> và kho bí mật của CI; README chỉ nói <em>hỏi ai</em> để lấy bí mật, không bao giờ ghi bí mật.')}</p>

<h3>${t('At work: the environment setup guide', 'Khi đi làm: tài liệu dựng môi trường')}</h3>
<p>${t(
    'On outsourcing projects, especially Japanese ones, the README’s role is often played by an "environment setup guide" in Word or Excel (環境構築手順書), with screenshots per step. A very common first task for an OJT trainee: follow it on a new machine and update every step that no longer works. Do it the way this lesson does — note exactly which step failed, the error text, and the fix — and you will have contributed in week one. In the daily report (lesson ',
    'Ở dự án outsourcing, nhất là dự án Nhật, vai của README thường do "tài liệu dựng môi trường" dạng Word/Excel (環境構築手順書) đảm nhận, có ảnh chụp từng bước. Việc đầu tiên rất hay giao cho thực tập sinh OJT: làm theo nó trên máy mới và cập nhật mọi bước không còn đúng. Làm như bài này — ghi đúng bước nào hỏng, chữ lỗi, cách sửa — là bạn đã đóng góp ngay tuần đầu. Trong báo cáo ngày (bài ')
    + ag('agl-9-7-bao-cao-hourensou', '9.7') + t(') write it as facts: "Step 4 fails on Node 22; fixed by …; guide updated, please review."', ') ghi thành sự thật: "Bước 4 hỏng trên Node 22; sửa bằng …; đã cập nhật tài liệu, nhờ anh/chị review."')}</p>

${phongVan([
    [t('"How do you know your README is correct?"', '"Làm sao biết README của bạn đúng?"'), t('By running it, not reading it. We ran every command block in a clean container on each PR that touched setup files, and once per iteration someone outside the team followed it with a timer. The first run found a broken npm test script nobody had noticed.', 'Bằng cách chạy, không phải đọc. Nhóm chạy mọi khối lệnh trong container sạch ở mỗi PR chạm tệp cài đặt, và mỗi iteration nhờ một người ngoài nhóm làm theo, bấm giờ. Lần chạy đầu đã bắt một script npm test hỏng mà không ai để ý.')],
    [t('"What goes into a good README for a team project?"', '"README tốt cho dự án nhóm có gì?"'), t('Prerequisites with versions and a check command, first-run steps each with a "done when", sample accounts for dev, a generated map of who owns which module, how to contribute, and a table of common errors with fixes.', 'Yêu cầu kèm phiên bản và lệnh kiểm, các bước chạy lần đầu có "đúng khi", tài khoản mẫu cho dev, bản đồ ai phụ trách mô-đun nào được sinh tự động, cách đóng góp, và bảng lỗi thường gặp kèm cách sửa.')],
    [t('"How do you share secrets with new team members?"', '"Bạn chia bí mật cho thành viên mới thế nào?"'), t('Never through the README or the repo. .env.example lists the keys with safe samples; real values go through a password manager or the CI secret store, and the README says whom to ask.', 'Không bao giờ qua README hay repo. .env.example liệt kê khoá với giá trị mẫu an toàn; giá trị thật đi qua trình quản lý mật khẩu hoặc kho bí mật của CI, README chỉ nói hỏi ai.')],
    [t('"Your first week at a new company, the setup guide is outdated. What do you do?"', '"Tuần đầu ở công ty mới, tài liệu dựng môi trường đã cũ. Bạn làm gì?"'), t('Follow it step by step, record exactly where and how it fails, ask for help with the exact error after a time box, then submit the corrections for review. It helps the next person and shows I can work carefully on day one.', 'Làm theo từng bước, ghi đúng chỗ hỏng và hỏng ra sao, quá một khoảng thời gian thì hỏi kèm nguyên văn lỗi, rồi gửi bản sửa để review. Nó giúp người sau và cho thấy mình làm việc cẩn thận ngay ngày đầu.')],
  ], en)}

${thuatNgu([
    ['README', t('The first file a reader sees; for a team: how to run, who owns what, how to contribute.', 'Tệp đầu tiên người đọc thấy; với nhóm: chạy thế nào, ai phụ trách gì, đóng góp ra sao.')],
    ['onboarding', t('Getting a new person productive.', 'Đưa người mới vào làm được việc.')],
    [t('clean machine', 'máy sạch'), t('An environment with only what git gives you — the honest test of a README.', 'Môi trường chỉ có những gì git đưa — phép thử trung thực cho README.')],
    ['.env / .env.example', t('Real local config (never committed) / the committed list of keys with safe samples.', 'Cấu hình thật trên máy (không commit) / danh sách khoá kèm giá trị mẫu an toàn (có commit).')],
    [t('single source of truth', 'nguồn sự thật duy nhất'), t('One file the others are generated from, so they cannot disagree.', 'Một tệp mà các tệp khác sinh ra từ nó, nên không thể lệch nhau.')],
  ], en)}

${tomTat([
    t('A team README is tested by running it on a clean machine, not by reading it — the author is the worst tester.', 'README nhóm được kiểm bằng cách chạy trên máy sạch, không phải đọc — tác giả là người kiểm kém nhất.'),
    t('Every step has a "Done when"; every prerequisite has a version and a check command.', 'Mỗi bước có "Đúng khi"; mỗi yêu cầu có phiên bản và lệnh kiểm.'),
    t('The real run caught "npm run dev" (no such script), a missing .env, and a broken npm test in the project itself.', 'Lần chạy thật bắt được "npm run dev" (không có script đó), thiếu .env, và npm test hỏng ngay trong dự án.'),
    t('Generate the screen → folder → owner table from the assignment CSV; CI fails when they disagree.', 'Sinh bảng màn → thư mục → người từ CSV phân công; CI đỏ khi hai bên lệch.'),
    t('Secrets never in the README; .env.example is the contract, changing it is a change for everyone’s machine.', 'Bí mật không bao giờ ở README; .env.example là hợp đồng, đổi nó là đổi máy của mọi người.'),
  ], en)}
<p>${t('Next: ', 'Bài tiếp: ')}${ag('agl-5-2-adr', t('5.2 — Architecture decision records', '5.2 — Ghi quyết định kiến trúc (ADR)'))}.</p>
`);
};

export default {
  title: '5.1 — READMEs that get people running|||5.1 — README giúp người khác chạy được ngay',
  slug: 'agl-5-1-readme',
  type: 'LESSON',
  isFreePreview: true,
  description: 'README của nhóm kiểm bằng cách CHẠY: script chạy mọi khối lệnh của README trong container sạch (không mạng, không .env) — bắt "npm run dev" sai tên, thiếu .env, và cả npm test hỏng của chính dự án; sáu phần README nhóm với "Đúng khi"; bảng màn → thư mục → người sinh từ phan-cong.csv, CI bắt README lỗi thời; .env.example là hợp đồng; không để bí mật trong README; tài liệu dựng môi trường khi đi OJT.',
  content: L51(true) + L51(false),
};
