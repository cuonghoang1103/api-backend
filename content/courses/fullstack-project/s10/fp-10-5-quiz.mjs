/**
 * 10.5 — Kiểm tra Chương 10 (soạn 25/11/2026, agent trên Mac tiếp quản fsp). BÀI THÊM (không có trong khung), slug mới fp-10-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 10.1–10.4 (act 0.2.98 trên máy nhà, registry cục bộ, cổng git cục bộ).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

export default {
  title: '10.5 — Chapter 10 quiz|||10.5 — Kiểm tra Chương 10',
  slug: 'fp-10-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống từ chính lúc dựng CI cho ChiaSe: test nối nhầm vào Postgres của người khác, cache npm thật ra cache gì, secret lọt log dạng base64, pull_request_target, tag action bị dời (tj-actions 2025), tag ảnh theo mã commit, tên ảnh chữ hoa trên GHCR, vì sao PR không đẩy ảnh, job bị bỏ qua vẫn "đạt", và force push bị cổng từ chối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while ChiaSe got its CI. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>My workflow runs <code>check</code> and <code>test</code> on every PR, with a real Postgres service, and both are green on a clean checkout.</li>
<li>Every <code>uses:</code> is a 40-character SHA, every job has a timeout, the token is <code>contents: read</code> except in the image job.</li>
<li>A push to <code>main</code> builds three images tagged with the commit SHA; a PR builds them without pushing.</li>
<li>I can explain why the required check is <code>ci-xanh</code> and not <code>image</code>.</li>
<li>My Checkpoint 10 passes every criterion.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi dựng CI cho ChiaSe. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Workflow của tôi chạy <code>check</code> và <code>test</code> cho mọi PR, có service Postgres thật, và cả hai xanh trên một bản checkout sạch.</li>
<li>Mọi <code>uses:</code> là SHA 40 ký tự, job nào cũng có timeout, token chỉ <code>contents: read</code> trừ job dựng ảnh.</li>
<li>Push lên <code>main</code> dựng ba ảnh gắn tag mã commit; PR dựng mà không đẩy.</li>
<li>Tôi giải thích được vì sao check bắt buộc là <code>ci-xanh</code> chứ không phải <code>image</code>.</li>
<li>Checkpoint 10 của tôi đạt mọi tiêu chí.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('The test job used TEST_DATABASE_URL=postgresql://chiase:chiase@localhost:${{ job.services.postgres.ports[\'5432\'] }}/chiase and failed with "P1010: User was denied access on the database chiase". The service itself was healthy. What happened?|||Job test dùng TEST_DATABASE_URL=postgresql://chiase:chiase@localhost:${{ job.services.postgres.ports[\'5432\'] }}/chiase và hỏng với "P1010: User was denied access on the database chiase". Bản thân service vẫn healthy. Chuyện gì đã xảy ra?',
        ['The Postgres 18 image changed its default password|||Ảnh Postgres 18 đổi mật khẩu mặc định',
         'Prisma cannot connect to a service container|||Prisma không nối được tới service container',
         'The expression was empty (act leaves job.services null), so the URL fell back to port 5432 — where a DIFFERENT, real Postgres on the same machine answered|||Biểu thức rỗng (act để job.services là null), nên URL rơi về cổng 5432 — nơi một Postgres KHÁC, có thật, trên cùng máy trả lời',
         'The health check had not finished yet|||Health check chưa chạy xong'],
        2,
        'EN: "Denied access" proves something answered. The probe workflow printed services: null, and act\'s job container is on the host network, so localhost:5432 was another user\'s database. With a matching password, the integration tests (TRUNCATE between tests) would have wiped it. A test URL must never be able to fall back to something real.|||VI: "Denied access" chứng tỏ có cái gì đó trả lời. Workflow dò in ra services: null, và container job của act ở mạng máy chủ, nên localhost:5432 là CSDL của người khác. Nếu mật khẩu trùng, test tích hợp (TRUNCATE giữa các test) đã xoá sạch nó. URL test không bao giờ được phép rơi về một thứ có thật.'),
      q('setup-node with cache: npm restored a 169 MB cache, yet npm ci still took 16–20 s instead of 24.8 s. What does that cache contain?|||setup-node với cache: npm khôi phục được cache 169 MB, vậy mà npm ci vẫn mất 16–20 s thay vì 24,8 s. Cache đó chứa gì?',
        ['~/.npm, the download cache keyed by the lockfile hash — npm ci still deletes node_modules, unpacks every package and runs postinstall|||~/.npm, kho tải về khoá theo băm lockfile — npm ci vẫn xoá node_modules, giải nén mọi gói và chạy postinstall',
         'node_modules, so npm ci should have taken 0 s; the cache is broken|||node_modules, nên npm ci lẽ ra mất 0 s; cache hỏng rồi',
         'The Docker layers of the API image|||Các tầng Docker của ảnh API',
         'The compiled dist/ folder|||Thư mục dist/ đã biên dịch'],
        0,
        'EN: It saves the download, not the install. 424 packages still have to be unpacked and prisma generate still runs. On a slow network the gain is larger; measure before promising speed-ups.|||VI: Nó tiết kiệm phần tải về, không phải phần cài. 424 gói vẫn phải giải nén và prisma generate vẫn chạy. Mạng chậm thì lợi nhiều hơn; đo trước khi hứa tăng tốc.'),
      q('A teammate\'s debug step printed $(printf %s "$KEY" | base64) for the production S3 key. The log shows a long base64 string, not ***. What must you do first?|||Bước gỡ lỗi của một đồng đội in $(printf %s "$KEY" | base64) cho khoá S3 production. Log hiện một chuỗi base64 dài, không phải ***. Việc đầu tiên phải làm là gì?',
        ['Nothing — base64 is encryption|||Không cần — base64 là mã hoá',
         'Make the repository private|||Chuyển repo sang riêng tư',
         'Delete the log; that removes the exposure|||Xoá log; như vậy là hết lộ',
         'Rotate (revoke and replace) the key, then delete the log and remove the step|||Xoay khoá (thu hồi và thay khoá mới), rồi xoá log và gỡ bước đó'],
        3,
        'EN: Masking replaces only the exact stored string; base64, reversed or split values print in clear (measured in 10.1). tj-actions/changed-files (March 2025) leaked secrets exactly this way, double base64 in public logs. Once a secret has been visible, assume it is copied: rotate first.|||VI: Che bí mật chỉ thay đúng chuỗi đã lưu; base64, đảo ngược hay cắt đôi đều in rõ (đo ở 10.1). tj-actions/changed-files (03/2025) làm lộ secret đúng kiểu này, base64 hai lần trong log công khai. Secret đã từng hiện ra thì coi như đã bị chép: xoay khoá trước.'),
      q('To label PRs from forks automatically, someone proposes: on: pull_request_target, then actions/checkout with ref: the PR head, then npm ci and npm test. What is wrong?|||Để tự gắn nhãn cho PR từ fork, có người đề xuất: on: pull_request_target, rồi actions/checkout với ref là head của PR, rồi npm ci và npm test. Sai ở đâu?',
        ['Nothing, pull_request_target is the recommended trigger for forks|||Không sai gì, pull_request_target là trigger được khuyên dùng cho fork',
         'The stranger\'s code (its install scripts, its tests) runs with the target repo\'s secrets and a write token — a "pwn request"|||Mã của người lạ (script cài đặt, test của nó) chạy với secret và token ghi của repo đích — một "pwn request"',
         'pull_request_target does not support checkout|||pull_request_target không hỗ trợ checkout',
         'It will run twice for every PR|||Nó sẽ chạy hai lần cho mỗi PR'],
        1,
        'EN: GitHub Security Lab\'s name for it. Ultralytics (December 2024): pull_request_target and a poisoned Actions cache led to malicious 8.3.41/8.3.42 on PyPI. Use pull_request for untrusted code; if you need pull_request_target, never check out or run the PR\'s code.|||VI: Tên do GitHub Security Lab đặt. Ultralytics (12/2024): pull_request_target cộng cache Actions bị đầu độc dẫn tới bản 8.3.41/8.3.42 chứa mã độc trên PyPI. Mã không tin cậy thì dùng pull_request; nếu cần pull_request_target thì không bao giờ checkout hay chạy mã của PR.'),
      q('In March 2025 attackers moved existing tags of tj-actions/changed-files to a malicious commit. Which reference in a workflow was NOT affected?|||Tháng 3/2025 kẻ tấn công dời các tag cũ của tj-actions/changed-files sang một commit độc. Cách tham chiếu nào trong workflow KHÔNG bị ảnh hưởng?',
        ['uses: tj-actions/changed-files@v45|||uses: tj-actions/changed-files@v45',
         'uses: tj-actions/changed-files@<full 40-character commit SHA>|||uses: tj-actions/changed-files@<mã commit đầy đủ 40 ký tự>',
         'uses: tj-actions/changed-files@v45.0.7|||uses: tj-actions/changed-files@v45.0.7',
         'uses: tj-actions/changed-files@main|||uses: tj-actions/changed-files@main'],
        1,
        'EN: Tags and branches are pointers the owner (or a stolen token) can move — even an exact-looking v45.0.7. A commit SHA names content; moving it would need a SHA-1 collision. That is why every uses: in ChiaSe\'s ci.yml is a full SHA with the version in a comment.|||VI: Tag và nhánh là con trỏ mà chủ (hoặc token bị đánh cắp) dời được — kể cả v45.0.7 trông rất cụ thể. Mã commit gọi tên nội dung; muốn dời phải tạo được va chạm SHA-1. Vì thế mọi uses: trong ci.yml của ChiaSe là SHA đầy đủ, phiên bản ghi ở chú thích.'),
      q('Chapter 11 will deploy the API image. Which tag should the deploy step pull?|||Chương 11 sẽ deploy ảnh API. Bước deploy nên kéo tag nào?',
        ['latest, because it is always the newest|||latest, vì nó luôn là bản mới nhất',
         'The branch name, main|||Tên nhánh, main',
         'The full commit SHA that passed CI, e.g. chiase-api:<sha>|||Mã commit đầy đủ đã qua CI, ví dụ chiase-api:<sha>',
         'A date such as 2026-11-25|||Một ngày tháng như 2026-11-25'],
        2,
        'EN: latest moves with every push: "deploy latest" twice may give two different programs, and rolling back to "the previous latest" is impossible. The SHA tag is immutable, ties the running image to exact code (org.opencontainers.image.revision label) and makes rollback = deploy the previous SHA.|||VI: latest dịch chuyển sau mỗi lần push: "deploy latest" hai lần có thể ra hai chương trình khác nhau, và không thể quay về "latest hôm trước". Tag SHA bất biến, gắn ảnh đang chạy với đúng mã nguồn (nhãn org.opencontainers.image.revision) và quay lui = deploy SHA trước đó.'),
      q('The repository owner is "HocVien". The image job builds ghcr.io/HocVien/chiase-api:<sha>. What happens at push time, and what does ChiaSe\'s workflow do about it?|||Chủ repo là "HocVien". Job dựng ảnh tạo ghcr.io/HocVien/chiase-api:<sha>. Lúc đẩy sẽ ra sao, và workflow của ChiaSe xử lý thế nào?',
        ['The push is refused (repository names must be lowercase); the tag step uses ${OWNER,,} to lowercase it|||Bị từ chối (tên repository phải viết thường); bước đặt tag dùng ${OWNER,,} để đổi sang chữ thường',
         'GHCR converts it silently; nothing to do|||GHCR tự đổi âm thầm; không cần làm gì',
         'It works, but only for private packages|||Chạy được, nhưng chỉ với package riêng tư',
         'The build fails before pushing because Dockerfiles cannot contain capitals|||Dựng hỏng trước khi đẩy vì Dockerfile không được có chữ hoa'],
        0,
        'EN: Image references must be lowercase. docker/metadata-action lowercases for you, but it calls GitHub\'s REST API (under act: "Bad credentials"), so ChiaSe computes tags in one shell line — one fewer third-party action to trust.|||VI: Tham chiếu ảnh phải viết thường. docker/metadata-action tự đổi giúp, nhưng nó gọi REST API của GitHub (chạy bằng act: "Bad credentials"), nên ChiaSe tự tính tag bằng một dòng shell — bớt một action bên thứ ba phải tin.'),
      q('Why does the image job use push: ${{ github.event_name == \'push\' }} instead of always pushing?|||Vì sao job dựng ảnh dùng push: ${{ github.event_name == \'push\' }} thay vì lúc nào cũng đẩy?',
        ['Building without pushing is faster on GitHub|||Dựng mà không đẩy thì nhanh hơn trên GitHub',
         'GHCR does not accept images from pull requests|||GHCR không nhận ảnh từ pull request',
         'act cannot push images|||act không đẩy ảnh được',
         'A PR is unreviewed (maybe a fork\'s) code: building it proves the Dockerfile still works, but publishing it would put untrusted code in the registry — and fork PRs get no write token anyway|||PR là mã chưa được duyệt (có thể từ fork): dựng nó chứng minh Dockerfile còn dựng được, nhưng đẩy lên sẽ đưa mã chưa tin cậy vào registry — và PR từ fork cũng không có token ghi'],
        3,
        'EN: Only main, after check + test passed and after review, produces artifacts that Chapter 11 may deploy. packages: write is granted to this job alone.|||VI: Chỉ main, sau khi check + test xanh và sau review, mới tạo ra sản phẩm mà Chương 11 được phép deploy. packages: write chỉ cấp cho riêng job này.'),
      q('A ruleset requires only the check "image (api)". A PR introduces the IDOR bug: test fails. What does GitHub do with the merge button?|||Một ruleset chỉ bắt buộc check "image (api)". Một PR đưa vào lỗi IDOR: test đỏ. GitHub làm gì với nút merge?',
        ['Blocks it, because a failed job always blocks|||Khoá lại, vì job hỏng thì luôn chặn',
         'Blocks it until the image is built manually|||Khoá cho tới khi có người dựng ảnh bằng tay',
         'May allow it: image needs test, so it is skipped, and "skipped" counts as a successful status|||Có thể cho merge: image cần test nên bị bỏ qua, mà "skipped" được tính là trạng thái thành công',
         'Deletes the PR|||Xoá PR'],
        2,
        'EN: GitHub Docs: successful statuses are success, skipped and neutral; a job depending on a failed job is skipped and may not block merging. ChiaSe requires one aggregate job, ci-xanh, with if: always() that fails unless check, test and image are all success.|||VI: GitHub Docs: trạng thái thành công gồm success, skipped và neutral; job phụ thuộc job hỏng bị bỏ qua và có thể không chặn merge. ChiaSe chỉ bắt buộc một job tổng ci-xanh, chạy if: always() và đỏ trừ khi check, test, image đều success.'),
      q('On the local gate, git push -f of a rewritten history to main was refused with "cổng: TỪ CHỐI force push — … không nối tiếp main hiện tại". Which ruleset switch is this equivalent to?|||Ở cổng cục bộ, git push -f một lịch sử viết lại lên main bị từ chối với "cổng: TỪ CHỐI force push — … không nối tiếp main hiện tại". Nó tương đương công tắc nào của ruleset?',
        ['Require status checks to pass|||Require status checks to pass',
         'Block force pushes|||Block force pushes',
         'Restrict deletions|||Restrict deletions',
         'Require a pull request before merging|||Require a pull request before merging'],
        1,
        'EN: Refusing updates that do not continue main = Block force pushes; refusing deletion = Restrict deletions; running CI before accepting = required status checks. The hook checks the first two itself because git applies receive.denyNonFastForwards/denyDeletes only after pre-receive (Checkpoint 10 caught it). Reviews and the merge button are what a platform adds on top.|||VI: Từ chối cập nhật không nối tiếp main = Block force pushes; từ chối xoá = Restrict deletions; chạy CI trước khi nhận = required status checks. Hook tự kiểm hai việc đầu vì git chỉ xét receive.denyNonFastForwards/denyDeletes sau pre-receive (Checkpoint 10 bắt được). Review và nút merge là phần nền tảng thêm vào.'),
    ],
  },
};
