/**
 * Testing · Chương 9 · Quiz Chương 9 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-9-6-quiz.
 * Đáp án rải: A ×3 (câu 3, 5, 9) · B ×2 (1, 7) · C ×3 (2, 6, 10) · D ×2 (4, 8).
 * Mọi con số lấy từ output chạy thật của Chương 9 (s09/_ma.mjs, act 0.2.94); phần GitHub ghi theo tài liệu đọc 01/11/2026.
 */
export default {
  title: 'Chapter 9 check — 10 scenario questions|||Kiểm tra Chương 9 — 10 câu tình huống',
  slug: 'tst-9-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 9: service PostgreSQL gọi bằng tên khi job chạy trên runner, npm ci từ chối lockfile lệch, cache npm lưu gì, Playwright thiếu thư viện hệ thống, bản tóm tắt job nói dối, artifact trùng tên, cổng thiếu always() bị bỏ qua mà vẫn tính là đạt, đường ống nuốt mã thoát, chỗ của một test chập chờn, và khi nào chia shard làm CI chậm hơn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Chapter 9 check</h2>
<p class="lead">Ten scenarios about running tests in CI, each based on something measured on LabFlow Lite with act in this chapter — or, where only GitHub can answer, on GitHub’s documentation. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a workflow with npm ci, the npm cache, a PostgreSQL service and Playwright, and rehearse it with act and actionlint.</li>
<li>I can read a red run in order and keep its evidence as reports and artifacts.</li>
<li>I can protect main with one gate job that really fails, and keep flaky tests from blocking.</li>
<li>I can use a matrix for versions and shards, and say when sharding is not worth it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Kiểm tra Chương 9</h2>
<p class="lead">Mười tình huống về chạy test trong CI, câu nào cũng dựa trên một điều đã đo trên LabFlow Lite bằng act trong chương — hoặc, ở chỗ chỉ GitHub trả lời được, dựa trên tài liệu của GitHub. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được workflow có npm ci, cache npm, service PostgreSQL và Playwright, và tổng duyệt nó bằng act và actionlint.</li>
<li>Tôi đọc được một lần chạy đỏ theo thứ tự và giữ bằng chứng của nó bằng báo cáo và artifact.</li>
<li>Tôi bảo vệ được main bằng một job cổng thật sự đỏ, và giữ test chập chờn khỏi chặn ai.</li>
<li>Tôi dùng được matrix cho phiên bản và shard, và nói được khi nào chia shard không đáng.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: "The integration job runs directly on ubuntu-latest (no container:). It has a postgres:17 service with ports 5432:5432 and worked with TEST_DATABASE_URL=postgres://postgres:test@localhost:5432/labflow_test. A teammate changes the host to 'postgres' (copied from another example) and removes the ports. Result: Error: getaddrinfo ENOTFOUND postgres. Why?|||Job integration chạy thẳng trên ubuntu-latest (không có container:). Nó có service postgres:17 với ports 5432:5432 và đã chạy được với TEST_DATABASE_URL=postgres://postgres:test@localhost:5432/labflow_test. Một bạn đổi host thành 'postgres' (chép từ ví dụ khác) và bỏ ports. Kết quả: Error: getaddrinfo ENOTFOUND postgres. Vì sao?",
        options: [
          'The service needs more time to start; increase --health-retries.|||Service cần thêm thời gian khởi động; tăng --health-retries.',
          'The service label works as a hostname only when the job itself runs in a container; a job on the runner reaches the service at localhost on a mapped port.|||Nhãn service chỉ dùng làm tên máy được khi chính job chạy trong container; job chạy trên runner tới service qua localhost ở một cổng đã ánh xạ.',
          'PostgreSQL 17 does not accept connections by name, only by IP address.|||PostgreSQL 17 không nhận kết nối theo tên, chỉ theo địa chỉ IP.',
          'act does not support services; on GitHub the same workflow would pass.|||act không hỗ trợ service; trên GitHub cùng workflow đó sẽ xanh.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: GitHub's documentation: on the runner machine, services are reached at localhost:<port> (with a port mapping); in a container job, the service label is the hostname. ENOTFOUND is a name lookup error — nothing is wrong with timing. Tempting wrong answer — 'act does not support services': act ran the same service and the localhost version passed 11 tests; the ENOTFOUND matches what the documentation predicts for GitHub too.|||VI: Tài liệu GitHub: trên máy runner, service được gọi qua localhost:<cổng> (có ánh xạ cổng); trong job chạy bằng container, nhãn service là tên máy. ENOTFOUND là lỗi tra tên — không liên quan gì tới thời gian. Đáp án sai hấp dẫn — 'act không hỗ trợ service': act chạy đúng service đó và bản localhost xanh 11 test; lỗi ENOTFOUND khớp với điều tài liệu dự đoán cho cả GitHub.",
      },
      {
        question: "CI fails at the very first step after checkout: `npm ci` can only install packages when your package.json and package-lock.json are in sync … Missing: dayjs@1.11.23 from lock file. A teammate proposes changing the workflow to npm install 'so CI stops failing'. What should you do?|||CI đỏ ngay bước đầu sau checkout: `npm ci` can only install packages when your package.json and package-lock.json are in sync … Missing: dayjs@1.11.23 from lock file. Một bạn đề xuất đổi workflow sang npm install 'cho CI hết đỏ'. Bạn nên làm gì?",
        options: [
          'Accept: npm install is the same as npm ci but more tolerant.|||Đồng ý: npm install giống npm ci nhưng dễ tính hơn.',
          'Delete package-lock.json so both commands behave the same.|||Xoá package-lock.json để hai lệnh cư xử như nhau.',
          'Keep npm ci; whoever added dayjs runs npm install locally and commits the updated lockfile.|||Giữ npm ci; người thêm dayjs chạy npm install trên máy và commit lockfile đã cập nhật.',
          'Add --legacy-peer-deps to npm ci.|||Thêm --legacy-peer-deps vào npm ci.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: npm ci refused because the lockfile does not contain what package.json asks for — exactly its job: CI must test the versions that were committed. The fix belongs in the commit, not in CI. Tempting wrong answer — npm install 'is more tolerant': it would silently pick whatever dayjs version matches ^1.11.13 today and may rewrite the lockfile, so CI tests code nobody has on their machine.|||VI: npm ci từ chối vì lockfile không có thứ package.json đòi — đúng việc của nó: CI phải test các phiên bản đã được commit. Cách sửa nằm ở commit, không ở CI. Đáp án sai hấp dẫn — npm install 'dễ tính hơn': nó sẽ lặng lẽ chọn bản dayjs nào khớp ^1.11.13 hôm nay và có thể viết lại lockfile, nên CI test một bộ code không ai có trên máy.",
      },
      {
        question: "With cache: npm on setup-node, act measured npm ci at 49.6 s on the first run (cache miss, then 'Cache saved') and 15.0 s on the second (cache-hit=true). What exactly is cached?|||Với cache: npm trên setup-node, act đo npm ci 49,6 s ở lần đầu (trượt cache, rồi 'Cache saved') và 15,0 s ở lần hai (cache-hit=true). Chính xác thì cái gì được cache?",
        options: [
          "npm's download cache (~/.npm), under a key built from the hash of package-lock.json; npm ci still runs and still builds node_modules.|||Bộ đệm tải về của npm (~/.npm), dưới một khoá dựng từ mã băm package-lock.json; npm ci vẫn chạy và vẫn dựng node_modules.",
          'node_modules, so npm ci is skipped on the second run.|||node_modules, nên npm ci được bỏ qua ở lần hai.',
          'The test results, so unchanged tests are not run again.|||Kết quả test, nên test không đổi sẽ không chạy lại.',
          'The Docker image of the runner.|||Ảnh Docker của runner.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: setup-node's npm cache stores ~/.npm and restores it when the lockfile hash matches; a new lockfile means a new key and one cold run again. The step 'npm ci' still appears and still takes 15 s — it installs from local files instead of downloading. Tempting wrong answer — node_modules: then npm ci would vanish from the log; it did not, and npm ci deletes node_modules anyway.|||VI: Cache npm của setup-node lưu ~/.npm và khôi phục khi mã băm lockfile khớp; lockfile mới là khoá mới và lại một lần lạnh. Bước 'npm ci' vẫn xuất hiện và vẫn mất 15 s — nó cài từ file trên máy thay vì tải về. Đáp án sai hấp dẫn — node_modules: khi đó npm ci đã biến khỏi log; nó không biến, và npm ci vốn xoá node_modules.",
      },
      {
        question: "The e2e job runs `npx playwright install chromium` then `npm run test:e2e`. The 2 setup tests fail in 2.8 s, 7 did not run, and the log says: chrome-headless-shell: error while loading shared libraries: libnspr4.so. The tests pass on your laptop. What is the fix?|||Job e2e chạy `npx playwright install chromium` rồi `npm run test:e2e`. 2 test setup đỏ trong 2,8 s, 7 không chạy, và log ghi: chrome-headless-shell: error while loading shared libraries: libnspr4.so. Trên laptop test xanh. Cách sửa là gì?",
        options: [
          'Add retries: 3 — the browser sometimes fails to start in CI.|||Thêm retries: 3 — trình duyệt thỉnh thoảng khởi động hỏng trong CI.',
          'Cache ~/.cache/ms-playwright so the browser is not downloaded again.|||Cache ~/.cache/ms-playwright để khỏi tải lại trình duyệt.',
          'Increase the test timeout to 60 seconds.|||Tăng timeout của test lên 60 giây.',
          'Install the browser with its system libraries: npx playwright install --with-deps chromium.|||Cài trình duyệt kèm thư viện hệ thống: npx playwright install --with-deps chromium.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: A fresh Ubuntu machine lacks the Linux packages Chromium needs; --with-deps installs them with apt (64 new packages in our run) and then 9 tests passed. The test code was never at fault. Tempting wrong answer — caching the browser: the binary was there; the missing piece is a system library. Playwright's documentation also says caching browser binaries is not recommended.|||VI: Một máy Ubuntu mới thiếu các gói Linux mà Chromium cần; --with-deps cài chúng bằng apt (64 gói mới trong lần chạy của ta) và sau đó 9 test xanh. Code test không hề có lỗi. Đáp án sai hấp dẫn — cache trình duyệt: file trình duyệt đã có; thứ thiếu là thư viện hệ thống. Tài liệu Playwright cũng nói không khuyến khích cache file trình duyệt.",
      },
      {
        question: "On a red pull request (a web test failed), the job summary written by the project's own script said '### ✅ 174 of 174 tests passed'. What happened, and what is the right fix?|||Trên một pull request đỏ (một web test hỏng), job summary do script của dự án ghi ra lại nói '### ✅ 174 of 174 tests passed'. Chuyện gì đã xảy ra, và cách sửa đúng là gì?",
        options: [
          'The script read only the unit report; feed it the web report too (merge the reports) and test the script like any other code.|||Script chỉ đọc báo cáo unit; đưa thêm báo cáo web (gộp các báo cáo) và test script đó như mọi code khác.',
          "GITHUB_STEP_SUMMARY is written before the tests finish; move the step earlier.|||GITHUB_STEP_SUMMARY được ghi trước khi test xong; chuyển bước lên sớm hơn.",
          'The summary step should use if: failure() so it only runs on red runs.|||Bước tóm tắt nên dùng if: failure() để chỉ chạy khi đỏ.',
          'Job summaries are only decoration; delete the step.|||Job summary chỉ để trang trí; xoá bước đó.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: The summary only knew the report it was given (reports/unit.json); the failing test was in the web suite. After mergeReports(unit + web) the same pull request showed '### ❌ 1 of 191 tests failed' with the test listed. A summary is a claim about the run, so it gets tests. Tempting wrong answer — if: failure(): the step did run; the problem was its input, and you also want a summary on green runs.|||VI: Bản tóm tắt chỉ biết báo cáo được đưa cho nó (reports/unit.json); test hỏng nằm ở bộ web. Sau mergeReports(unit + web), cùng pull request hiện '### ❌ 1 of 191 tests failed' kèm tên test. Bản tóm tắt là một lời khẳng định về lần chạy, nên nó cần test. Đáp án sai hấp dẫn — if: failure(): bước đó đã chạy; vấn đề là dữ liệu đầu vào, và bạn cũng muốn có tóm tắt khi xanh.",
      },
      {
        question: "Two legs of a matrix (Node 22 and 24) both upload an artifact named 'reports' with actions/upload-artifact@v4. In act both uploads say Success, and the downloaded zip contains 'tests on Node 24'. What will GitHub do with the same workflow?|||Hai nhánh của một matrix (Node 22 và 24) cùng upload một artifact tên 'reports' bằng actions/upload-artifact@v4. Trong act cả hai lần upload đều Success, và file zip tải về chứa 'tests on Node 24'. GitHub sẽ làm gì với cùng workflow?",
        options: [
          'The same as act: keep the last upload.|||Giống act: giữ lần upload cuối.',
          'Merge both into one artifact automatically.|||Tự gộp cả hai vào một artifact.',
          "Refuse the second upload: v4 does not support uploading to the same artifact from several jobs — put the matrix value into the name.|||Từ chối lần upload thứ hai: v4 không hỗ trợ upload vào cùng một artifact từ nhiều job — đưa giá trị matrix vào tên.",
          'Rename the second one to reports-2.|||Đổi tên cái thứ hai thành reports-2.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: The upload-artifact README (read 01/11/2026): 'uploading to the same artifact via multiple jobs is not supported with v4'; names must be unique. act's local server accepted both and silently kept one, losing Node 22's file — a rehearsal that is more forgiving than the real thing. Tempting wrong answer — 'same as act': that is exactly the trap; never take act's behaviour as GitHub's for artifacts.|||VI: README của upload-artifact (đọc 01/11/2026): 'uploading to the same artifact via multiple jobs is not supported with v4'; tên phải duy nhất. Server trên máy của act nhận cả hai và lặng lẽ giữ một, làm mất file của Node 22 — một buổi tổng duyệt dễ dãi hơn buổi diễn thật. Đáp án sai hấp dẫn — 'giống act': đó chính là cái bẫy; với artifact, đừng lấy hành vi của act làm hành vi của GitHub.",
      },
      {
        question: "Branch protection requires the check 'naive-gate', a job with needs: [unit] and no if:. On a pull request the unit job fails. What happens to the merge button?|||Branch protection đòi check 'naive-gate', một job có needs: [unit] và không có if:. Trên một pull request job unit đỏ. Nút merge sẽ thế nào?",
        options: [
          'Blocked: naive-gate fails because unit failed.|||Bị chặn: naive-gate đỏ vì unit đỏ.',
          'Enabled: naive-gate is skipped, and a skipped required check counts as passed.|||Được bật: naive-gate bị bỏ qua, và một check bắt buộc bị bỏ qua được tính là đạt.',
          'Blocked forever: the check stays “Expected — waiting”.|||Bị chặn mãi: check đứng ở trạng thái “Expected — waiting”.',
          'Enabled only for administrators.|||Chỉ bật cho admin.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: "EN: A job whose needs failed is skipped unless its if: says otherwise (act printed not a single line for naive-gate). GitHub's documentation: required checks must be 'successful, skipped, or neutral', and a job skipped by a conditional 'reports Success'. That is why ci-ok has if: always() and reads needs.*.result. Tempting wrong answer — 'it fails': it never runs, so it cannot fail.|||VI: Job có needs bị đỏ sẽ bị bỏ qua trừ khi if: của nó nói khác (act không in một dòng nào cho naive-gate). Tài liệu GitHub: check bắt buộc phải 'successful, skipped, or neutral', và job bị bỏ qua do điều kiện 'reports Success'. Vì thế ci-ok có if: always() và đọc needs.*.result. Đáp án sai hấp dẫn — 'nó đỏ': nó không hề chạy, nên không thể đỏ.",
      },
      {
        question: "A step runs `npx vitest run src/ --reporter=dot | tee unit.log` with no shell: set. The log shows 'Tests 1 failed | 173 passed (174)', yet the step is ✅. Which change makes the step fail when a test fails?|||Một bước chạy `npx vitest run src/ --reporter=dot | tee unit.log` và không đặt shell:. Log ghi 'Tests 1 failed | 173 passed (174)', vậy mà bước vẫn ✅. Thay đổi nào làm bước đỏ khi có test đỏ?",
        options: [
          'Add continue-on-error: false to the step.|||Thêm continue-on-error: false vào bước.',
          'Use --reporter=junit instead of dot.|||Dùng --reporter=junit thay cho dot.',
          'Add if: always() to the step.|||Thêm if: always() vào bước.',
          "Set shell: bash on the step (GitHub then runs bash --noprofile --norc -eo pipefail), or start the script with set -o pipefail.|||Đặt shell: bash cho bước (khi đó GitHub chạy bash --noprofile --norc -eo pipefail), hoặc mở đầu script bằng set -o pipefail.",
        ],
        correctIndex: 3,
        points: 1,
        explanation: "EN: Without shell:, the step runs with bash -e and a pipe returns the exit code of its LAST command — tee succeeded. With shell: bash, pipefail is on, and act measured the same command turning ❌. Tempting wrong answer — continue-on-error: false: it is already the default; the step did not fail at all, so there is nothing to continue from.|||VI: Không có shell:, bước chạy bằng bash -e và một đường ống trả mã thoát của lệnh CUỐI — tee thành công. Với shell: bash, pipefail được bật, và act đo được cùng lệnh đó chuyển ❌. Đáp án sai hấp dẫn — continue-on-error: false: đó vốn là mặc định; bước không hề đỏ, nên chẳng có gì để 'tiếp tục'.",
      },
      {
        question: "The race test of lesson 8.3 (a real double-booking bug, issue LAB-142, owner an) is red in 13 of 30 local runs. Where should it run in CI until the bug is fixed?|||Test tranh chấp của bài 8.3 (một bug đặt trùng thật, issue LAB-142, người phụ trách an) đỏ 13 trên 30 lần chạy trên máy. Cho tới khi bug được sửa, nó nên chạy ở đâu trong CI?",
        options: [
          "In its own job with continue-on-error: true, NOT in the gate's needs: it reports on every pull request and blocks nobody.|||Trong job riêng có continue-on-error: true, KHÔNG nằm trong needs của cổng: nó báo cáo ở mọi pull request và không chặn ai.",
          'In the unit job with --retry=3, so it is usually green.|||Trong job unit với --retry=3, để nó thường xanh.',
          'Nowhere: delete it until someone has time.|||Không ở đâu cả: xoá nó cho tới khi có người rảnh.',
          "In the gate's needs, so the team is forced to fix it quickly.|||Trong needs của cổng, để cả nhóm bị buộc phải sửa nhanh.",
        ],
        correctIndex: 0,
        points: 1,
        explanation: "EN: Quarantine keeps the evidence without punishing innocent pull requests: one in three PRs would otherwise be blocked by a bug none of them caused, and people would learn to press re-run. It returns to the gate after the fix shows 0 red in 100 shuffled runs. Tempting wrong answer — retries: lesson 8.3 measured retries turning 17 red runs in 50 into 0 while the double booking stayed.|||VI: Cách ly giữ bằng chứng mà không phạt các pull request vô tội: nếu không, một trên ba PR sẽ bị chặn vì một bug không PR nào gây ra, và mọi người học cách bấm chạy lại. Nó quay lại cổng sau khi bản sửa cho 0 lần đỏ trong 100 lần chạy xáo thứ tự. Đáp án sai hấp dẫn — retry: bài 8.3 đo được retry biến 17/50 lần đỏ thành 0 trong khi lỗi đặt trùng vẫn còn.",
      },
      {
        question: "A 10.6 s slow suite was split into 3 shards balanced by time (slowest shard 4.01 s) plus a merge job. In act the whole run took 147 s; the same suite in one job took 36 s. What explains it, and what is the lesson?|||Một bộ test chậm 10,6 s được chia thành 3 shard cân theo thời gian (shard chậm nhất 4,01 s) cộng một job gộp. Trong act cả lượt mất 147 s; cùng bộ đó trong một job mất 36 s. Điều gì giải thích, và bài học là gì?",
        options: [
          'The timing-balanced split was wrong; Vitest --shard would have been faster.|||Cách chia theo thời gian sai; --shard của Vitest sẽ nhanh hơn.',
          'act runs shards one after another; on GitHub sharding is always faster.|||act chạy các shard lần lượt; trên GitHub chia shard luôn nhanh hơn.',
          "Each shard is a new machine that pays checkout, Node and npm ci again (34–41 s each here), plus a merge job; shard only when the tests take much longer than that setup.|||Mỗi shard là một máy mới phải trả lại checkout, Node và npm ci (ở đây 34–41 s mỗi cái), cộng một job gộp; chỉ chia shard khi test lâu hơn hẳn phần dựng máy đó.",
          'Blob reports are slow to merge; use JSON reports instead.|||Báo cáo blob gộp rất chậm; dùng báo cáo JSON thay vào.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: "EN: The split itself worked ('Per blob 4.02s 3.91s 3.50s', the merge step took 0.6 s); the cost is per-job setup, multiplied by the number of shards. On GitHub every shard is also a separate machine with the same setup. Tempting wrong answer — 'act runs shards one after another': the three shard jobs ran at the same time (their npm ci steps overlapped); the setup, not the order, is the cost.|||VI: Bản thân cách chia hoạt động ('Per blob 4.02s 3.91s 3.50s', bước gộp mất 0,6 s); cái giá là phần dựng máy của mỗi job, nhân với số shard. Trên GitHub mỗi shard cũng là một máy riêng với cùng phần dựng đó. Đáp án sai hấp dẫn — 'act chạy shard lần lượt': ba job shard chạy cùng lúc (các bước npm ci chồng lên nhau); cái giá là phần dựng máy, không phải thứ tự.",
      },
    ],
  },
};
