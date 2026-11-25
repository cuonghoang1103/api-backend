/**
 * 9.5 — Kiểm tra Chương 9 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 9.1–9.4
 * (git 2.55, Node 18–24, npm 10, Verdaccio 6, Maven 3.9 + JDK 25, Docker). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '9.5 — Chapter 9 quiz|||9.5 — Kiểm tra Chương 9',
  slug: 'dbg-9-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: mã thoát 125 và ≥128 của bisect run, bisect bằng npm test đổ lỗi cho commit thêm test, timeout 124 bị tính là bad, Maven trả 1 khi lỗi biên dịch, --first-parent, hai chuỗi trông giống hệt sau khi cài lại (NBSP), .dockerignore bỏ lockfile + npm install, CRLF ⇒ "no such file or directory", hai bản một gói làm hỏng instanceof, nearest wins ⇒ NoClassDefFoundError.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from runs in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a bisect check script that lives outside the repository and uses 0, 1 and 125 correctly.</li>
<li>I know what <code>timeout</code>, <code>npm</code> and <code>mvn</code> exit with, and what git does with each code.</li>
<li>I can fingerprint two environments and turn "works on my machine" into a diff.</li>
<li>I can tell from a lockfile diff and <code>npm ls</code> which library changed, and bisect its versions.</li>
<li>I can explain Maven's "nearest wins" and fix it with dependencyManagement.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các lần chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được script kiểm cho bisect nằm ngoài kho và dùng đúng 0, 1 và 125.</li>
<li>Tôi biết <code>timeout</code>, <code>npm</code> và <code>mvn</code> thoát với mã nào, và git làm gì với từng mã.</li>
<li>Tôi lấy được vân tay hai môi trường và biến "máy em chạy mà" thành một bản diff.</li>
<li>Từ diff lockfile và <code>npm ls</code>, tôi biết thư viện nào đã đổi, và chia đôi được các phiên bản của nó.</li>
<li>Tôi giải thích được "nearest wins" của Maven và sửa bằng dependencyManagement.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Your bisect check script finds that the module of the current commit cannot even be loaded (leftover merge-conflict markers). Which exit code should it return?|||Script kiểm của bạn thấy module ở commit hiện tại còn không nạp được (sót dấu xung đột merge). Script nên trả mã thoát nào?',
        options: [
          '1 — the commit is broken, so it is bad|||1 — commit bị hỏng nên là bad',
          '125 — this commit cannot be judged, git will skip it and test a neighbour|||125 — commit này không phán được, git sẽ bỏ qua và thử commit kế bên',
          '0 — it is not the bug we are looking for, so it is good|||0 — không phải lỗi đang tìm nên là good',
          '255 — so that git stops and asks you|||255 — để git dừng lại hỏi bạn',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: 125 means "skip". 1 would blame a commit for a different problem; 0 is a lie (you do not know); 255 (≥128) aborts the whole bisect. Lesson 9.1: two conflict-marker commits were skipped and the right commit was still found.|||VI: 125 nghĩa là "bỏ qua". Trả 1 sẽ đổ lỗi cho commit vì một chuyện khác; 0 là nói dối (bạn đâu biết); 255 (≥128) huỷ cả phiên bisect. Bài 9.1: hai commit còn dấu xung đột bị bỏ qua mà vẫn tìm đúng commit.',
      },
      {
        question: 'You run git bisect run npm test between v1.3.0 (good) and HEAD (bad). The answer is the commit "test(csv): reproduce ticket #912". What most likely happened?|||Bạn chạy git bisect run npm test giữa v1.3.0 (good) và HEAD (bad). Đáp án là commit "test(csv): tái hiện ticket #912". Nhiều khả năng chuyện gì đã xảy ra?',
        options: [
          'The test itself contains the bug|||Chính test chứa lỗi',
          'npm test is too slow for bisect|||npm test quá chậm cho bisect',
          'The test did not exist in older commits, so npm test passed there; bisect found the commit that added the test|||Test chưa tồn tại ở các commit cũ nên npm test qua; bisect tìm ra commit đã thêm test',
          'Bisect cannot handle merge commits|||Bisect không xử lý được commit merge',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The project\'s tests change with the history being searched. Keep the check outside the repository so it is identical at every commit (lesson 9.1).|||VI: Test của dự án thay đổi theo chính lịch sử đang tìm. Đặt phép kiểm ngoài kho để nó giống hệt nhau ở mọi commit (bài 9.1).',
      },
      {
        question: 'Your script is "timeout 10 node check.mjs". Some commits hang on import. Bisect blames a commit that added a busy-wait loop, not the CSV refactor you were looking for. Why?|||Script của bạn là "timeout 10 node check.mjs". Vài commit treo khi nạp module. Bisect đổ lỗi cho commit thêm vòng lặp chờ bận, không phải commit refactor CSV bạn đang tìm. Vì sao?',
        options: [
          'timeout exits 124 on a hang, which git counts as "bad"; map 124 to 125|||timeout thoát 124 khi treo, git tính là "bad"; phải đổi 124 thành 125',
          'timeout exits 0 on a hang|||timeout thoát 0 khi treo',
          '10 seconds is too short; use 60|||10 giây quá ngắn; dùng 60',
          'git bisect run cannot run shell scripts|||git bisect run không chạy được script shell',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: 124 is in 1–127, so every hang was marked bad and bisect walked into the hanging range (lesson 9.1, commit 54df41a). With -s KILL you get 137 and bisect aborts instead.|||VI: 124 nằm trong 1–127, nên mọi lần treo bị đánh bad và bisect đi vào dải treo (bài 9.1, commit 54df41a). Với -s KILL thì ra 137 và bisect huỷ luôn.',
      },
      {
        question: 'On a Maven project, "git bisect run mvn -q test" blames the commit "rename tongKet to tinhTongKet". The real bug is a rounding change ten commits later. What is the fix to the script?|||Trên dự án Maven, "git bisect run mvn -q test" đổ lỗi cho commit "đổi tên tongKet thành tinhTongKet". Lỗi thật là thay đổi làm tròn mười commit sau đó. Sửa script thế nào?',
        options: [
          'Add -DskipTests|||Thêm -DskipTests',
          'Use mvn clean install instead|||Dùng mvn clean install',
          'Run the bisect with --first-parent|||Chạy bisect với --first-parent',
          'Run "mvn compile || exit 125" first, then the test copied in from outside the repository|||Chạy "mvn compile || exit 125" trước, rồi mới chạy test chép vào từ ngoài kho',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Maven exits 1 for compile errors and failing tests alike. Separate them: non-compiling commits become 125 (skipped), only the test decides 0/1 (lesson 9.1: the right commit "perf(diem)" after 10 runs).|||VI: Maven thoát 1 cho cả lỗi biên dịch lẫn test đỏ. Tách ra: commit không biên dịch được thành 125 (bỏ qua), chỉ test quyết định 0/1 (bài 9.1: đúng commit "perf(diem)" sau 10 lượt).',
      },
      {
        question: 'Your team merges every PR with a merge commit. You want to know which PR to revert. Which bisect option helps most?|||Nhóm bạn merge mọi PR bằng commit merge. Bạn muốn biết nên revert PR nào. Tuỳ chọn bisect nào giúp nhất?',
        options: [
          '--no-checkout|||--no-checkout',
          '--first-parent: walk only the main line, the answer is the merge commit of the PR|||--first-parent: chỉ đi dòng chính, đáp án là commit merge của PR',
          '--term-old/--term-new|||--term-old/--term-new',
          'git bisect replay|||git bisect replay',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: --first-parent (git 2.29+) answers at PR level (lesson 9.1: "Merge branch \'feature/gon-csv\'"). You can then bisect inside that branch if you need the exact commit.|||VI: --first-parent (git 2.29+) trả lời ở mức PR (bài 9.1: "Merge branch \'feature/gon-csv\'"). Cần đúng commit thì bisect tiếp bên trong nhánh đó.',
      },
      {
        question: 'After "rm -rf node_modules package-lock.json && npm install", a test fails: expected \'150.000 ₫\', actual \'150.000 ₫\' — they look identical. Best next step?|||Sau "rm -rf node_modules package-lock.json && npm install", một test trượt: expected \'150.000 ₫\', actual \'150.000 ₫\' — trông y hệt nhau. Bước tiếp theo tốt nhất?',
        options: [
          'Re-run the test until it passes|||Chạy lại test tới khi qua',
          'Change the test to use includes() instead of equal|||Đổi test sang includes() thay vì equal',
          'Print the code points of both strings and diff package-lock.json against git to see which library version changed|||In mã điểm Unicode của hai chuỗi và diff package-lock.json với git để xem bản thư viện nào đã đổi',
          'Delete node_modules again|||Xoá node_modules lần nữa',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 9.3: the library jumped 1.4.1 → 1.7.0 through "^1.2.0", and the new version returns U+00A0 (a0) instead of a space (20). Bisecting versions then pointed at 1.5.0.|||VI: Bài 9.3: thư viện nhảy 1.4.1 → 1.7.0 qua "^1.2.0", và bản mới trả U+00A0 (a0) thay cho khoảng trắng (20). Chia đôi phiên bản sau đó chỉ ra 1.5.0.',
      },
      {
        question: 'Dev laptops are correct, the Docker image built from the same commit is not. .dockerignore contains package-lock.json and the Dockerfile runs npm install. What is the root cause and fix?|||Laptop dev đúng, ảnh Docker build từ cùng commit thì sai. .dockerignore có package-lock.json và Dockerfile chạy npm install. Nguyên nhân gốc và cách sửa?',
        options: [
          'The image resolves version ranges fresh and gets newer libraries; copy the lockfile into the image and use npm ci|||Ảnh giải lại khoảng phiên bản và nhận thư viện mới hơn; chép lockfile vào ảnh và dùng npm ci',
          'node:22-alpine is broken; switch to node:22-slim|||node:22-alpine bị lỗi; đổi sang node:22-slim',
          'Docker caches layers; add --no-cache|||Docker cache layer; thêm --no-cache',
          'The container runs in UTC; set TZ|||Container chạy UTC; đặt TZ',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lab 9.4: npm ls showed 2.3.2 on the laptop and 2.6.0 in the container; 2.4.0 changed the default week start. Fix the build (npm ci + lockfile) and pass the option explicitly.|||VI: Lab 9.4: npm ls cho thấy 2.3.2 trên laptop và 2.6.0 trong container; 2.4.0 đổi mặc định đầu tuần. Sửa bản build (npm ci + lockfile) và truyền tuỳ chọn tường minh.',
      },
      {
        question: 'A teammate on Windows mounts the project into a Linux container. Docker prints "exec /app/chay.sh: no such file or directory" although the file is there. Most likely cause?|||Một bạn dùng Windows mount dự án vào container Linux. Docker in "exec /app/chay.sh: no such file or directory" dù tệp vẫn có đó. Nguyên nhân khả dĩ nhất?',
        options: [
          'The file is not executable|||Tệp chưa có quyền chạy',
          'The volume path is wrong|||Đường dẫn volume sai',
          'Alpine has no /bin/sh|||Alpine không có /bin/sh',
          'The script has CRLF line endings, so the kernel looks for the interpreter "/bin/sh\\r"; fix with .gitattributes eol=lf|||Script có xuống dòng CRLF, nên kernel đi tìm trình thông dịch "/bin/sh\\r"; sửa bằng .gitattributes eol=lf',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 9.2: the same CRLF file gave four messages — not found, no such file or directory, ^M: bad interpreter, set: Illegal option -. core.autocrlf=true on Windows creates it; .gitattributes fixes it for everyone (add the file before --renormalize).|||VI: Bài 9.2: cùng một tệp CRLF cho bốn thông báo — not found, no such file or directory, ^M: bad interpreter, set: Illegal option -. core.autocrlf=true trên Windows sinh ra nó; .gitattributes sửa cho mọi người (add tệp trước khi --renormalize).',
      },
      {
        question: 'An error handler does "e instanceof LoiNghiepVu ? 400 : 500". After upgrading a library, invalid input returns 500. npm ls shows @labflow/loi@2.0.0 at the root and @labflow/loi@1.0.0 nested under the library. Why?|||Bộ xử lý lỗi làm "e instanceof LoiNghiepVu ? 400 : 500". Sau khi nâng một thư viện, đầu vào sai trả 500. npm ls cho thấy @labflow/loi@2.0.0 ở gốc và @labflow/loi@1.0.0 lồng dưới thư viện. Vì sao?',
        options: [
          'instanceof does not work with ES modules|||instanceof không chạy với ES module',
          'Two copies of the package mean two different classes; the error comes from the nested copy|||Hai bản của gói nghĩa là hai lớp khác nhau; lỗi được tạo từ bản lồng bên trong',
          'Version 2.0.0 removed the class|||Bản 2.0.0 đã xoá lớp đó',
          'The lockfile is corrupt|||Lockfile bị hỏng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 9.3: npm explain showed who required ^1.0.0. overrides made one copy (deduped ⇒ 400); the proper fix is a peerDependency in the library, or checking e.name/e.code across package boundaries.|||VI: Bài 9.3: npm explain cho thấy ai đòi ^1.0.0. overrides gộp thành một bản (deduped ⇒ 400); cách sửa đúng là peerDependency trong thư viện, hoặc kiểm e.name/e.code khi bắt lỗi xuyên ranh giới gói.',
      },
      {
        question: 'A two-module Maven build compiles, but running the app throws NoClassDefFoundError: org/apache/commons/lang3/Strings. The library module declares commons-lang3 3.18.0, the app module declares 3.16.0. What happened?|||Bản build Maven hai module biên dịch được, nhưng chạy ứng dụng thì ném NoClassDefFoundError: org/apache/commons/lang3/Strings. Module thư viện khai báo commons-lang3 3.18.0, module app khai báo 3.16.0. Chuyện gì đã xảy ra?',
        options: [
          'Maven always picks the lowest version|||Maven luôn chọn bản thấp nhất',
          'The JAR of 3.18.0 is corrupt in ~/.m2|||Tệp JAR 3.18.0 trong ~/.m2 bị hỏng',
          '"Nearest wins": the app\'s direct 3.16.0 beats the transitive 3.18.0, and Strings does not exist in 3.16.0|||"Gần nhất thắng": 3.16.0 khai báo trực tiếp ở app thắng 3.18.0 bắc cầu, mà Strings không có trong 3.16.0',
          'You must run mvn install before running|||Phải chạy mvn install trước khi chạy',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Each module compiles against its own declaration, but the run-time classpath has one version, chosen by nearest definition (lesson 9.3). Fix: remove the stale direct declaration, manage one version in dependencyManagement.|||VI: Mỗi module biên dịch với khai báo của chính nó, nhưng classpath lúc chạy chỉ có một bản, chọn theo khai báo gần nhất (bài 9.3). Sửa: bỏ khai báo trực tiếp đã cũ, quản lý một bản trong dependencyManagement.',
      },
    ],
  },
};
