/**
 * Authentication — Progress Test 3 (Chương 9 → Chương 12).
 *
 * Đề tự soạn, bám sát `content/courses/authentication/s09-phan-quyen.mjs` …
 * `s12-chan-doan.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong
 * phòng thi.
 *
 * ⚠️ MỌI con số trong đề này đều ĐO THẬT trên **Node.js v22.21.0** (macOS,
 * darwin arm64, 10/09/2026), bằng `node:crypto` và bằng chính các lệnh grep
 * mà giáo trình dùng, chạy trên chính kho mã này. Không gói ngoài, không gọi
 * ra Internet, không đọc `.env`, không đụng cơ sở dữ liệu. Mọi khoá và mọi
 * token trong đề là giá trị GIẢ ghi rõ là giả; không in khối khoá riêng nào.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ NĂM CHỖ MÁY KHÁC GIÁO TRÌNH — đề THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. Bài 12.2 kết luận "cửa sổ ±1 bước dùng được với độ lệch từ −60s tới
 *    +59s". Đo thật: khoảng chấp nhận PHỤ THUỘC vị trí của T trong bước.
 *        T mod 30 =  0  →  −30s … +59s
 *        T mod 30 =  1  →  −31s … +58s
 *        T mod 30 = 15  →  −45s … +44s
 *        T mod 30 = 29  →  −59s … +30s
 *    Giao của tất cả, tức khoảng BẢO ĐẢM cho mọi thời điểm, chỉ là
 *    **−30s … +29s**. Câu 29 hỏi theo phép đo này chứ không theo con số −60.
 *    (Bảng đo trong chính bài 12.2 cũng chỉ đúng cho MỘT giá trị T cụ thể:
 *    nó ghi −45s là "từ chối", còn ở T mod 30 = 15 thì −45s được CHẤP NHẬN.)
 *
 * 2. Bài 9.1 đếm được 939 endpoint trong 73 tệp route. Đếm lại hôm nay bằng
 *    đúng lệnh ấy: **979 endpoint** trong **77 tệp**, trong đó 22 tệp có một
 *    dòng `router.use(`. Kho mã lớn lên, con số đi theo — và đó chính là điều
 *    bài học nói: một con số như vậy phải ĐO LẠI chứ không chép lại. Câu 1
 *    dùng số đo hôm nay.
 *
 * 3. Bài 12.4 chạy năm lệnh grep tìm dấu hiệu đỏ và in ra 0 · 7 · 4 · 2 · 10.
 *    Chạy lại hôm nay trên cùng kho mã: **0 · 7 · 4 · 2 · 7**. Bốn con số đầu
 *    khớp từng cái; con số thứ năm (bí mật có giá trị mặc định dự phòng) nay
 *    là 7. Kết luận của bài không đổi. Câu 31 hỏi cách ĐỌC kết quả grep.
 *
 * 4. Bài 11.1 đo 155 biến môi trường được đọc trong `src/`, 135 biến khai
 *    trong `.env.example`, 84 biến đọc mà không khai. Đo lại hôm nay:
 *    **161 · 136 · 89**. Khoảng lệch rộng ra, đúng như bài học dự đoán khi
 *    danh sách được gõ tay thay vì sinh ra từ mã. Câu 18 dùng số đo hôm nay.
 *
 * 5. Bài 10.3 đếm 897 gói trong `package-lock.json` của backend và 1.159 của
 *    frontend, tổng 2.056. Đo lại bằng `Object.keys(packages).length`:
 *    **898 · 1.160 · tổng 2.058** — chênh đúng hai, vì bảng `packages` có
 *    thêm mục gốc `""` cho chính dự án. Số trong `package.json` thì khớp tuyệt
 *    đối: backend 73 + 21, frontend 85 + 11. Câu 14 hỏi cơ chế, không hỏi số.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 *
 *   node -e "import('./content/exams/AUTHENTICATION-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Hai câu lập trình đều CHẠY THẬT và khớp `expectedOutput` từng dòng; cả hai
 * đã chạy ba lượt rồi diff. Câu 31 bắn năm request ĐỒNG THỜI bằng
 * `Promise.all` vào cùng một mã khôi phục — cuộc đua đó là nội dung của câu
 * hỏi, và kết quả vẫn tất định vì đồng hồ, dữ liệu và thứ tự đều cho sẵn.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/AUTHENTICATION-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/authentication-exam-kit.mjs';

export default {
  course: { slug: 'authentication' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 9 to 12 (authorization, the attacks, running it, diagnosis)',
        'Kiểm tra tiến độ 3 — Chương 9 đến 12 (phân quyền, các cú tấn công, vận hành, chẩn đoán)',
      ),
      description: B(
        'The last third of the Authentication course: who may do what, the attacks that succeed against correct code, the operational half that decides whether correct code stays correct, and the four questions that find an authentication bug in five minutes. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Authentication: ai được làm gì, những cú tấn công thành công trước cả mã nguồn đúng, nửa vận hành quyết định việc mã đúng có còn đúng sau một năm, và bốn câu hỏi tìm ra một con lỗi xác thực trong năm phút. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '9–12'),
      questions: [
        // ── Chương 9 — Mô hình phân quyền ───────────────────────────────
        mcq({
          prompt: B(
            'Counted on this very repository today: <b>979</b> endpoints across <b>77</b> route files, with <b>22</b> of those files carrying a <code>router.use(</code> line. Some endpoints declare a guard inline, some inherit one from the file, and some have neither. What is the actual problem with that shape?',
            'Đếm thật trên chính kho mã này hôm nay: <b>979</b> endpoint nằm trong <b>77</b> tệp route, trong đó <b>22</b> tệp có một dòng <code>router.use(</code>. Có endpoint khai lớp chắn ngay tại chỗ, có cái thừa hưởng từ cả tệp, và có cái không có gì cả. Vấn đề THẬT của hình dạng đó là gì?',
          ),
          options: [
            B(
              'The count itself: no product should expose nine hundred endpoints, and consolidating them is the fix',
              'Chính con số đó: không sản phẩm nào nên phơi ra chín trăm endpoint, và gộp chúng lại mới là cách sửa',
            ),
            B(
              'Two mechanisms for one job means an unguarded endpoint is ambiguous — deliberately public, or forgotten — and neither the compiler nor the tests can tell them apart, so the difference lives in a reviewer\'s attention across all 979',
              'Hai cơ chế cho cùng một việc khiến một endpoint không có lớp chắn trở nên MẬP MỜ — cố ý công khai, hay bị quên — mà cả trình biên dịch lẫn bộ kiểm thử đều không phân biệt được, nên khác biệt ấy nằm trong sự chú ý của người review, trải trên cả 979 đường',
            ),
            B(
              'Inline guards run after the router-level ones, so an endpoint carrying both is checked twice and the second check overrides the first',
              'Lớp chắn tại chỗ chạy sau lớp ở cấp router, nên endpoint mang cả hai bị kiểm hai lượt và lượt sau ghi đè lượt trước',
            ),
            B(
              'A <code>router.use(</code> guard does not apply to routes declared above it in the file, so the 22 files each have a silent gap at the top',
              'Lớp chắn kiểu <code>router.use(</code> không áp cho các route khai TRƯỚC nó trong tệp, nên mỗi tệp trong số 22 tệp đó đều có một khoảng trống câm ở phần đầu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Most of the unguarded endpoints in a repository like this are public on purpose — a course listing, a blog post — and that is fine. What is not fine is that finding out requires reading each one, because "no marking" and "deliberately open" look identical. The fix is not more discipline across a growing number; it is making the public case explicit, so an endpoint with no declared policy fails to compile or fails a startup assertion, and a public one carries a written reason a reviewer can disagree with. Note the numbers themselves moved since the lesson measured them — 939 endpoints in 73 files then, 979 in 77 now — which is exactly why a figure like this has to be re-measured rather than quoted. (Ordering does matter for <code>router.use</code>, so routes above it really are unguarded; that is a separate, narrower bug and not what makes the shape dangerous.)',
            'Phần lớn các endpoint không có lớp chắn trong một kho như thế này là CỐ Ý công khai — danh sách khoá học, một bài blog — và như vậy là đúng. Thứ không ổn là muốn biết điều đó thì phải đọc từng đường một, vì "không đánh dấu gì" và "cố tình mở" trông giống hệt nhau. Cách sửa không phải là kỷ luật nhiều hơn trên một con số đang lớn dần; mà là làm cho trường hợp CÔNG KHAI trở nên tường minh, để một endpoint không khai chính sách thì không biên dịch được hoặc chết ở một phép khẳng định lúc khởi động, còn một endpoint công khai thì mang theo một lý do bằng chữ để người review có thể phản bác. Để ý bản thân các con số đã dịch chuyển từ lúc bài học đo — khi ấy 939 endpoint trong 73 tệp, giờ là 979 trong 77 — và đó đúng là lý do một con số như vậy phải ĐO LẠI chứ không phải chép lại. (Thứ tự khai báo có ảnh hưởng thật với <code>router.use</code>, nên route nằm trên nó đúng là không được chắn; đó là một con lỗi riêng và hẹp hơn, không phải thứ làm cho hình dạng này nguy hiểm.)',
          ),
        }),

        mcq({
          prompt: B(
            'A team replaces sequential integer ids with UUIDs everywhere, on the grounds that an attacker can no longer guess another user\'s invoice id. What does that change?',
            'Một nhóm thay toàn bộ mã số tuần tự bằng UUID, với lý lẽ rằng kẻ tấn công không đoán nổi mã hoá đơn của người khác nữa. Việc đó thay đổi được gì?',
          ),
          options: [
            B(
              'It makes the vulnerability worse, because a UUID cannot be validated and so reaches the query unchecked',
              'Nó làm lỗ hổng nặng hơn, vì UUID không kiểm tính hợp lệ được nên đi thẳng vào câu truy vấn mà không qua chốt nào',
            ),
            B(
              'It closes the vulnerability, because an unguessable identifier is exactly what a capability-based design relies on',
              'Nó bịt được lỗ hổng, vì một định danh không đoán nổi chính là thứ mà thiết kế dựa trên năng lực dựa vào',
            ),
            B(
              'It raises the cost of finding an id and removes nothing: ids leak through shared links, exports, referrers and support tickets, so the missing ownership clause is still the vulnerability',
              'Nó làm việc tìm ra một mã tốn kém hơn và không xoá bỏ được gì: mã số vẫn rò ra qua đường dẫn chia sẻ, bản xuất dữ liệu, header referrer và phiếu hỗ trợ, nên mệnh đề kiểm quyền sở hữu còn thiếu vẫn là lỗ hổng',
            ),
            B(
              'It has no effect at all, because the database compares both forms the same way',
              'Nó chẳng có tác dụng gì, vì cơ sở dữ liệu so sánh hai dạng đó y như nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Random identifiers are a real mitigation and are worth having — they remove the version of the attack that needs no work at all, which is incrementing a number in a URL. They are not the control, because the flaw is that the query does not ask who owns the row, and an id is not a secret: it appears in a link someone pasted into a chat, in a CSV export, in the <code>Referer</code> sent to a third-party script, and in the screenshot attached to a support ticket. An "unguessable URL" is a legitimate design for an unlisted document, but the moment you rely on it, it is a bearer credential with all four consequences from Chapter 1. The control is <code>where: { id, userId }</code> — ownership inside the query, so no later refactor can drop it — answering 404 rather than 403 so the endpoint does not confirm which ids exist.',
            'Định danh ngẫu nhiên là một biện pháp giảm nhẹ có thật và đáng có — nó xoá đi phiên bản tấn công chẳng tốn công gì, tức là tăng một con số trong URL. Nhưng nó không phải LỚP KIỂM SOÁT, vì khiếm khuyết nằm ở chỗ câu truy vấn không hỏi ai sở hữu hàng đó, mà một cái mã thì không phải bí mật: nó xuất hiện trong một đường dẫn ai đó dán vào khung chat, trong một bản xuất CSV, trong header <code>Referer</code> gửi tới một script bên thứ ba, và trong tấm ảnh chụp màn hình đính kèm một phiếu hỗ trợ. "URL không đoán nổi" là một thiết kế chính đáng cho một tài liệu không niêm yết, nhưng khoảnh khắc bạn DỰA vào nó thì nó là một tín vật mang theo, kèm đủ bốn hệ quả ở chương 1. Lớp kiểm soát là <code>where: { id, userId }</code> — quyền sở hữu nằm TRONG câu truy vấn, để không lần tái cấu trúc nào sau này bỏ sót nó — và trả về 404 chứ không phải 403, để endpoint không xác nhận mã nào có thật.',
          ),
        }),

        mcq({
          prompt: B(
            'A user-role join table is declared with <code>@@id([userId, roleId])</code> rather than its own primary key. What does that composite key buy?',
            'Bảng nối người dùng với vai trò được khai bằng <code>@@id([userId, roleId])</code> thay vì có khoá chính riêng. Cặp khoá ghép ấy mua được gì?',
          ),
          options: [
            B(
              'It lets one person hold only one role, which is what makes the model easy to display in an interface',
              'Nó khiến mỗi người chỉ giữ được một vai trò, và đó là thứ làm cho mô hình dễ hiển thị trên giao diện',
            ),
            B(
              'It makes the table smaller, which matters because the role lookup runs on every request',
              'Nó làm bảng nhẹ hơn, điều này quan trọng vì phép tra vai trò chạy ở mọi request',
            ),
            B(
              'It makes a duplicate grant impossible at the database level, so granting a role is idempotent and a retried request cannot leave a row that a later revoke misses',
              'Nó làm cho việc cấp trùng một vai trò trở nên BẤT KHẢ ở tầng cơ sở dữ liệu, nên cấp vai trò là thao tác lặp lại vô hại, và một request thử lại không thể để sót một hàng mà lệnh thu hồi sau đó bỏ quên',
            ),
            B(
              'It forces the roles to be checked in code by name, because a composite key cannot be joined to a permission table',
              'Nó buộc phải kiểm vai trò trong mã theo TÊN, vì một khoá ghép thì không join được với bảng quyền',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The join table is what makes the relationship many-to-many in the first place — one person is an editor of one thing and an admin of another, and a single <code>role</code> column forces someone to choose, with the workaround always being a new combined role. The composite key adds the guarantee on top: the same pair cannot be inserted twice, so a duplicated request is harmless and a revoke that deletes "the" row cannot leave a second copy behind granting the same access. Size is irrelevant at this scale. And joining is unaffected — permissions hang off the role, which is the point of stage three, and code should ask about a permission rather than naming a role.',
            'Chính cái bảng nối mới là thứ làm cho quan hệ trở thành nhiều-nhiều — một người vừa là biên tập viên của thứ này vừa là quản trị của thứ kia, còn một cột <code>role</code> đơn lẻ thì buộc ai đó phải chọn, và cách chữa cháy bao giờ cũng là đẻ ra một vai trò ghép mới. Khoá ghép thêm vào đó một BẢO ĐẢM: cùng một cặp không chèn được hai lần, nên một request bị lặp là vô hại, và một lệnh thu hồi xoá "cái" hàng đó không thể để sót một bản sao thứ hai vẫn đang cấp đúng quyền ấy. Kích thước thì chẳng đáng kể ở quy mô này. Còn chuyện join thì không bị ảnh hưởng — quyền treo vào vai trò, đó chính là ý nghĩa của giai đoạn ba, và mã nên hỏi về QUYỀN thay vì gọi tên vai trò.',
          ),
        }),

        mcq({
          prompt: B(
            'To save a database round trip, a team puts the user\'s role list into the access token at login. Access tokens live fifteen minutes and refresh tokens thirty days. What did that cost?',
            'Để tiết kiệm một lượt gọi cơ sở dữ liệu, một nhóm nhét danh sách vai trò của người dùng vào access token lúc đăng nhập. Access token sống mười lăm phút, refresh token ba mươi ngày. Cái giá phải trả là gì?',
          ),
          options: [
            B(
              'Nothing: the token is signed, so the role list inside it is as trustworthy as the database row it came from',
              'Chẳng mất gì: token đã được ký, nên danh sách vai trò bên trong đáng tin đúng bằng hàng dữ liệu mà nó lấy ra',
            ),
            B(
              'Only size: a role list is a few hundred bytes, which matters solely because the token travels on every request',
              'Chỉ tốn kích thước: một danh sách vai trò là vài trăm byte, và nó chỉ đáng kể vì token đi theo mọi request',
            ),
            B(
              'Correctness on the next login only, since a role change takes effect the next time the user signs in',
              'Chỉ sai ở lần đăng nhập kế tiếp, vì thay đổi vai trò có hiệu lực vào lần người dùng đăng nhập sau',
            ),
            B(
              'A cache with no invalidation: the roles are as stale as the token is old, so a revoked role stays effective for the whole access-token window — and if the roles are baked in at login rather than at refresh, for the whole thirty days',
              'Một cái cache không có đường vô hiệu hoá: vai trò cũ đúng bằng tuổi của token, nên một vai trò vừa bị thu hồi vẫn còn hiệu lực trọn cửa sổ access token — và nếu vai trò được nhồi vào lúc ĐĂNG NHẬP chứ không phải lúc refresh thì là trọn ba mươi ngày',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A signature proves the issuer wrote those claims; it says nothing about whether they are still true. Permissions inside a token are a cache, and the one thing this cache does not have is an invalidation path — which is Chapter 5\'s revocation problem arriving in authorization clothes. The severity depends entirely on where the claims are refreshed: minted at every refresh, the staleness is bounded by the access lifetime, and that is the honest fifteen-minute window; minted once at login and copied forward, a demoted administrator stays an administrator for a month. A permission lookup is normally one indexed join and cheap enough to do per request — measure before optimising. When it genuinely is not, cache the computed set in Redis with a TTL of seconds and delete the key on any role change, so the stale window is one you chose.',
            'Chữ ký chứng minh rằng nơi phát hành đã viết ra những claim đó; nó không nói gì về việc chúng CÒN đúng hay không. Quyền nằm bên trong một token là một cái CACHE, và thứ duy nhất cái cache này không có là đường vô hiệu hoá — đúng bài toán thu hồi ở chương 5, khoác áo phân quyền. Mức độ nghiêm trọng phụ thuộc hoàn toàn vào chỗ các claim được làm mới: nếu đúc lại ở MỖI lượt refresh thì độ cũ bị chặn bởi vòng đời access token, và đó là cửa sổ mười lăm phút trung thực; nếu đúc một lần lúc đăng nhập rồi chép tiếp thì một quản trị viên vừa bị hạ quyền vẫn là quản trị viên suốt một tháng. Một lượt tra quyền bình thường chỉ là một phép join có chỉ mục và đủ rẻ để chạy mỗi request — hãy đo trước khi tối ưu. Khi nó thật sự không rẻ, hãy cache tập quyền đã tính trong Redis với TTL vài giây và xoá khoá đó ở mọi lần đổi vai trò, để cửa sổ dữ liệu cũ là cửa sổ do bạn chọn.',
          ),
        }),

        mcq({
          prompt: B(
            'An authorization rule is written as a function of subject, action, object and context — ownership, department, document state, time of day. It is correct and readable. Which two things does that shape make hard?',
            'Một luật phân quyền được viết thành hàm của chủ thể, hành động, đối tượng và bối cảnh — quyền sở hữu, phòng ban, trạng thái tài liệu, giờ trong ngày. Nó đúng và dễ đọc. Hình dạng đó làm HAI việc nào trở nên khó?',
          ),
          options: [
            B(
              'Answering "who can edit this?" and filtering a list efficiently — the rule only runs forwards, and the database cannot help because the logic lives in application code',
              'Trả lời câu "ai sửa được cái này?" và lọc một danh sách cho hiệu quả — luật chỉ chạy được theo chiều xuôi, và cơ sở dữ liệu không giúp được vì phần logic nằm trong mã ứng dụng',
            ),
            B(
              'Expressing ownership and expressing time — both need a relationship table that a function cannot represent',
              'Diễn đạt quyền sở hữu và diễn đạt thời gian — cả hai đều cần một bảng quan hệ mà một hàm thì không biểu diễn nổi',
            ),
            B(
              'Auditing and caching — an attribute rule cannot produce a reason and its result cannot be memoised',
              'Kiểm toán và cache — một luật theo thuộc tính thì không sinh ra được lý do, và kết quả của nó thì không ghi nhớ lại được',
            ),
            B(
              'Denying by default and returning 404 — a function that evaluates attributes must return a boolean, so it cannot carry a status code',
              'Từ chối theo mặc định và trả về 404 — một hàm đánh giá thuộc tính buộc phải trả về giá trị đúng-sai nên không mang theo được mã trạng thái',
            ),
          ],
          correct: 0,
          explanation: EX(
            'An attribute rule takes a specific pair and returns allow or deny, which is exactly what a request needs and exactly the wrong shape for the two questions a product also asks. "Who can edit document 42?" means evaluating the rule against every user, which is why systems built this way rarely have a good sharing dialog. "Show me the documents I can edit" means fetching and filtering in application code — fine for ten rows, unacceptable for a hundred thousand, because the condition never reaches SQL. Ownership and time are precisely what this model expresses well. Reasons and caching are available too. The two hard parts are the reverse query and the list filter, and they are worth checking before committing to a model — relationships stored as tuples answer both directions from the same data, which is what makes them the right shape for per-object access.',
            'Một luật theo thuộc tính nhận một cặp cụ thể rồi trả về cho phép hay từ chối, đúng thứ một request cần và đúng hình dạng SAI cho hai câu hỏi mà sản phẩm cũng đặt ra. "Ai sửa được tài liệu 42?" nghĩa là chạy luật ấy với MỌI người dùng, và đó là lý do các hệ thống dựng theo lối này hiếm khi có một hộp thoại chia sẻ tử tế. "Cho tôi xem những tài liệu tôi sửa được" nghĩa là nạp về rồi lọc trong mã ứng dụng — ổn với mười hàng, không chấp nhận được với một trăm nghìn, vì điều kiện chẳng bao giờ xuống tới SQL. Quyền sở hữu và thời gian thì chính là thứ mô hình này diễn đạt tốt. Lý do và cache cũng có được. Hai chỗ khó là câu truy vấn ngược và phép lọc danh sách, và đáng kiểm tra trước khi chốt mô hình — quan hệ lưu dạng bộ ba trả lời được CẢ HAI chiều từ cùng một dữ liệu, và đó là thứ khiến chúng đúng hình dạng cho quyền truy cập theo từng đối tượng.',
          ),
        }),

        mcq({
          prompt: B(
            'A relationship-based check walks the graph from an object upwards: owner, then container, then container of container. It is instant on the ten fixtures in the test suite. What happens on a real workspace, and what does a real implementation add?',
            'Một phép kiểm dựa trên quan hệ đi ngược cây từ đối tượng lên: chủ sở hữu, rồi vật chứa, rồi vật chứa của vật chứa. Trên mười bộ dữ liệu mẫu trong bộ kiểm thử nó chạy tức thì. Trên một không gian làm việc thật thì sao, và một bản cài đặt thật phải thêm gì?',
          ),
          options: [
            B(
              'It stays fast because the graph is shallow; the addition needed is a unique index on the tuple table',
              'Nó vẫn nhanh vì đồ thị nông; thứ cần thêm là một chỉ mục duy nhất trên bảng bộ ba',
            ),
            B(
              'It slows down only for administrators, because they are members of every container, so the fix is to short-circuit the admin case',
              'Nó chỉ chậm với quản trị viên, vì họ là thành viên của mọi vật chứa, nên cách sửa là rẽ tắt cho trường hợp quản trị',
            ),
            B(
              'It returns wrong answers because a graph walk cannot express denial, so an explicit deny tuple has to be added',
              'Nó trả lời SAI vì một phép đi đồ thị không diễn đạt được sự từ chối, nên phải thêm một bộ ba từ chối tường minh',
            ),
            B(
              'It becomes one query per edge on every request, and an imported cycle makes it recurse forever — so it needs a visited set, a depth limit, batched lookups and a cache keyed on the tuple version',
              'Nó biến thành một câu truy vấn cho mỗi cạnh, ở MỌI request, và một vòng lặp do nhập dữ liệu tạo ra sẽ làm nó đệ quy mãi mãi — nên nó cần một tập đã-thăm, một trần độ sâu, các lượt tra gộp lô, và một cache khoá theo phiên bản của bộ ba',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nested folders, group memberships and groups containing groups turn one authorization decision into hundreds of small lookups, and that runs on every request rather than once. Cycles are not hypothetical either — an import script that sets a parent without checking creates one, and the naive walk never returns. The list is what a production implementation carries: a visited set for cycles, a depth limit as the backstop, batched queries instead of one per edge, and a cache invalidated by a version rather than by a timer. That is precisely why Zanzibar exists as a service rather than as a library, and why adopting this model usually means adopting an implementation. A tuple table with an index on both directions and a hand-written walk with a depth limit is a legitimate choice for shallow hierarchies — just know that you are choosing it.',
            'Thư mục lồng nhau, tư cách thành viên nhóm, và nhóm chứa nhóm biến MỘT quyết định phân quyền thành hàng trăm lượt tra nhỏ, và chúng chạy ở MỌI request chứ không phải một lần. Vòng lặp cũng chẳng phải chuyện giả định — một script nhập dữ liệu đặt vật chứa cha mà không kiểm là tạo ra ngay, và phép đi ngây thơ sẽ không bao giờ quay về. Cái danh sách kia chính là thứ một bản cài đặt production phải mang theo: một tập đã-thăm để chặn vòng, một trần độ sâu làm lưới đỡ, các truy vấn gộp lô thay vì mỗi cạnh một câu, và một cache vô hiệu hoá theo PHIÊN BẢN chứ không theo đồng hồ. Đó đúng là lý do Zanzibar tồn tại dưới dạng một DỊCH VỤ chứ không phải một thư viện, và là lý do chọn mô hình này thường có nghĩa là chọn một bản cài đặt có sẵn. Một bảng bộ ba với chỉ mục cả hai chiều cộng một phép đi tự viết kèm trần độ sâu là lựa chọn chính đáng cho cây phân cấp nông — chỉ cần biết rằng mình đang CHỌN nó.',
          ),
        }),

        mcq({
          prompt: B(
            'In a multi-tenant product, which of these is the most dangerous missing tenant filter, and why is it the least likely to be caught in review?',
            'Trong một sản phẩm nhiều tenant, phép lọc tenant bị thiếu ở chỗ nào là nguy hiểm nhất, và vì sao nó ít có khả năng bị bắt ở khâu review nhất?',
          ),
          options: [
            B(
              'A detail endpoint fetching one row by id, because a single leaked record is the smallest unit of a breach',
              'Một endpoint chi tiết nạp một hàng theo mã, vì một bản ghi lọt ra là đơn vị nhỏ nhất của một vụ rò rỉ',
            ),
            B(
              'An aggregate — a count, a sum, a chart — because it reveals a competitor\'s numbers without displaying a single row, and nobody reviews a reporting query as security-sensitive',
              'Một phép tổng hợp — đếm, cộng, hay một biểu đồ — vì nó để lộ con số của đối thủ mà không hiển thị lấy một hàng dữ liệu, và chẳng ai review một câu truy vấn báo cáo như một thứ nhạy cảm về bảo mật',
            ),
            B(
              'A write path, because an <code>UPDATE</code> without a tenant filter corrupts data rather than merely disclosing it',
              'Một đường ghi, vì một lệnh <code>UPDATE</code> thiếu bộ lọc tenant sẽ làm HỎNG dữ liệu chứ không chỉ tiết lộ nó',
            ),
            B(
              'The login query, because it runs before the tenant is known and therefore cannot be filtered at all',
              'Câu truy vấn đăng nhập, vì nó chạy trước khi biết tenant nên không thể lọc được',
            ),
          ],
          correct: 1,
          explanation: EX(
            'All of these are real, and the aggregate is the one that combines maximum disclosure with minimum visibility: a chart of overdue invoices across every tenant is a competitor\'s revenue on a dashboard, and it does not look like a security-sensitive query to anyone reading the diff. The same property makes the whole class hard — nothing marks a missing filter as wrong: no type error, no lint rule, no runtime failure, and a test suite with one tenant cannot detect it, because with one tenant the filtered and unfiltered results are identical. Seed a second tenant whose rows must never appear in any assertion. Then add the layers: the tenant comes from the session and never from a request parameter, a data layer injects the filter so handlers cannot forget, and row-level security in the database is the last word — it also covers the background job, the export and the console session, which is where these queries actually live.',
            'Cả bốn đều có thật, và phép tổng hợp là cái kết hợp mức tiết lộ cao nhất với mức lộ diện thấp nhất: một biểu đồ hoá đơn quá hạn gộp mọi tenant chính là doanh thu của đối thủ nằm trên bảng điều khiển, mà nó chẳng trông giống một truy vấn nhạy cảm với bất kỳ ai đang đọc bản khác biệt. Cũng chính tính chất đó làm cả lớp lỗi này khó bắt — không có gì đánh dấu một bộ lọc thiếu là sai: không lỗi kiểu, không luật lint, không hỏng lúc chạy, và một bộ kiểm thử chỉ có MỘT tenant thì không phát hiện nổi, vì với một tenant thì kết quả có lọc và không lọc giống hệt nhau. Hãy gieo sẵn một tenant thứ hai mà dữ liệu của nó không được phép xuất hiện trong bất kỳ phép khẳng định nào. Rồi thêm các lớp: tenant lấy từ PHIÊN chứ không bao giờ từ tham số request, một tầng dữ liệu tự chèn bộ lọc để handler không quên nổi, và bảo mật theo hàng trong cơ sở dữ liệu là tiếng nói cuối cùng — nó phủ cả việc chạy nền, bản xuất dữ liệu và phiên gõ lệnh, đúng những chỗ mà các truy vấn kiểu này thật sự sinh sống.',
          ),
        }),

        mcq({
          prompt: B(
            'Row-level security is enabled, the policy on <code>tenant_id</code> is correct, and the application sets its tenant variable on every request. Measured on a real PostgreSQL: as the table owner the query returns 2 rows, as <code>postgres</code> it returns all 4. What are the two structural fixes?',
            'Bảo mật theo hàng đã bật, chính sách trên <code>tenant_id</code> viết đúng, và ứng dụng đặt biến tenant ở mọi request. Đo thật trên một PostgreSQL: chạy với vai CHỦ BẢNG thì truy vấn trả 2 hàng, chạy với vai <code>postgres</code> thì trả cả 4. Hai cách sửa về mặt cấu trúc là gì?',
          ),
          options: [
            B(
              'Grant the application role <code>BYPASSRLS</code> explicitly, and set the tenant variable with a plain <code>SET</code> so it survives the whole connection',
              'Cấp tường minh <code>BYPASSRLS</code> cho vai ứng dụng, và đặt biến tenant bằng <code>SET</code> thường để nó sống suốt cả kết nối',
            ),
            B(
              'Add <code>FORCE ROW LEVEL SECURITY</code> so the owner is covered, and run the application as a separate non-superuser, non-owner role — and set the variable with <code>SET LOCAL</code> inside a transaction, because a plain <code>SET</code> leaks onto the next request that borrows the pooled connection',
              'Thêm <code>FORCE ROW LEVEL SECURITY</code> để phủ cả chủ bảng, và chạy ứng dụng bằng một vai RIÊNG không phải siêu người dùng và không phải chủ bảng — rồi đặt biến bằng <code>SET LOCAL</code> bên trong một giao dịch, vì <code>SET</code> thường sẽ rò sang request kế tiếp mượn đúng cái kết nối trong bể',
            ),
            B(
              'Move the policy from <code>USING</code> to <code>WITH CHECK</code>, which is the clause that applies to reads',
              'Chuyển chính sách từ <code>USING</code> sang <code>WITH CHECK</code>, mệnh đề vốn áp cho các lệnh đọc',
            ),
            B(
              'Nothing structural is needed: the owner and superuser results are the expected behaviour for administrative connections and do not affect the application',
              'Không cần sửa gì về cấu trúc: kết quả của chủ bảng và siêu người dùng là hành vi mong đợi cho các kết nối quản trị và không ảnh hưởng tới ứng dụng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The trap is that most projects connect as the migration user, which is usually both the table owner and a superuser — so the policy is enabled, correct, and enforcing nothing. <code>FORCE</code> covers the owner; nothing covers a superuser, so the application simply must not be one. The pooling detail is the second half and it is a tenant leak created by the defence itself: a plain <code>SET</code> persists on the connection after the request ends, and the next request to borrow it inherits somebody else\'s tenant. <code>SET LOCAL</code> is scoped to the transaction and resets on its own. <code>USING</code> is the read clause and <code>WITH CHECK</code> is what stops an <code>INSERT</code> writing into another tenant, so you want both. And verify it in CI: connect as the application role with the variable unset and assert every tenant-scoped table returns zero rows — forgetting must fail closed, which is what makes an unset variable show an empty page instead of everybody\'s data.',
            'Cái bẫy là phần lớn dự án kết nối bằng vai chạy migration, thứ thường vừa là chủ bảng vừa là siêu người dùng — nên chính sách được bật, viết đúng, và không thi hành gì cả. <code>FORCE</code> phủ được chủ bảng; còn siêu người dùng thì không gì phủ nổi, nên ứng dụng đơn giản là KHÔNG được phép là siêu người dùng. Chi tiết về bể kết nối là nửa thứ hai, và nó là một cú rò tenant do chính lớp phòng thủ tạo ra: một lệnh <code>SET</code> thường còn lại trên kết nối sau khi request kết thúc, và request kế tiếp mượn đúng kết nối ấy sẽ thừa hưởng tenant của người khác. <code>SET LOCAL</code> chỉ có phạm vi trong giao dịch và tự đặt lại. <code>USING</code> là mệnh đề cho lệnh đọc còn <code>WITH CHECK</code> mới là thứ chặn một lệnh <code>INSERT</code> ghi sang tenant khác, nên bạn cần cả hai. Và hãy kiểm nó trong CI: kết nối bằng vai ứng dụng với biến chưa đặt rồi khẳng định mọi bảng có tenant đều trả về 0 hàng — quên phải hỏng theo hướng ĐÓNG, và đó là thứ làm cho một biến chưa đặt hiện ra trang trống thay vì dữ liệu của tất cả mọi người.',
          ),
        }),

        // ── Chương 10 — Các cú tấn công ─────────────────────────────────
        mcq({
          prompt: B(
            'A login endpoint locks an account permanently after five failed attempts, releasing it only through support. During a credential-stuffing run against a list of a million pairs, what happens?',
            'Một endpoint đăng nhập khoá VĨNH VIỄN tài khoản sau năm lần sai, chỉ mở lại qua bộ phận hỗ trợ. Trong một đợt nhồi tín vật với danh sách một triệu cặp, chuyện gì xảy ra?',
          ),
          options: [
            B(
              'The lockout works as designed: five guesses per account is far below what a stuffing list needs, so the run produces almost no takeovers',
              'Cơ chế khoá chạy đúng thiết kế: năm lần đoán mỗi tài khoản là quá ít so với thứ một danh sách nhồi cần, nên đợt tấn công gần như không chiếm được tài khoản nào',
            ),
            B(
              'The lockout counter is the wrong axis, so the run is unaffected and only the support queue grows',
              'Bộ đếm khoá đặt sai trục, nên đợt tấn công không hề hấn gì và chỉ có hàng đợi hỗ trợ là dài ra',
            ),
            B(
              'Nothing changes, because a stuffing list contains one password per account and never reaches five attempts',
              'Chẳng có gì đổi, vì một danh sách nhồi chỉ có một mật khẩu cho mỗi tài khoản nên không bao giờ chạm tới năm lần',
            ),
            B(
              'The attacker locks out a large fraction of your real users in an afternoon, which is a worse outcome than the attack it prevents — and anyone who knows an address can do it deliberately',
              'Kẻ tấn công khoá được một phần lớn người dùng thật của bạn trong một buổi chiều, một kết cục tệ hơn cả cú tấn công mà nó ngăn — và bất kỳ ai biết một địa chỉ email đều làm được điều đó một cách có chủ đích',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A permanent lock is a denial-of-service tool you hand to the attacker: it converts "somebody guessed wrong" into "this account is now unusable until a human intervenes", and a stuffing run trips it across a large share of your user base in one pass. Counting per account is the right axis — the attacker rotates addresses for pennies and cannot rotate the target — but the response must be a rolling window that expires on its own, with exponential backoff (two seconds, four, eight, capped) and a reset on a correct sign-in, so a real user who mistyped once never notices. Reserve a real lock for accounts where you have positive evidence of compromise, and there the correct response is a forced reset rather than a wall. Stuffing lists routinely carry several passwords per address, so five attempts is reached often.',
            'Khoá vĩnh viễn là một công cụ từ chối dịch vụ mà bạn tự tay trao cho kẻ tấn công: nó biến "có người đoán sai" thành "tài khoản này không dùng được cho tới khi có người can thiệp", và một đợt nhồi sẽ bật cái bẫy đó trên một phần lớn tập người dùng chỉ trong một lượt. Đếm theo TÀI KHOẢN là đúng trục — kẻ tấn công đổi địa chỉ IP rẻ như bèo và không đổi được cái đích — nhưng phản ứng phải là một cửa sổ trượt tự hết hạn, kèm lùi theo cấp số nhân (hai giây, bốn, tám, chặn trần) và đặt lại khi đăng nhập đúng, để một người dùng thật lỡ gõ sai một lần chẳng nhận ra gì. Hãy để dành việc khoá thật cho những tài khoản mà bạn có bằng chứng RÕ RÀNG là đã bị chiếm, và ở đó phản ứng đúng là ép đặt lại mật khẩu chứ không phải dựng một bức tường. Các danh sách nhồi thường mang vài mật khẩu cho mỗi địa chỉ, nên mốc năm lần bị chạm tới thường xuyên.',
          ),
        }),

        mcq({
          prompt: B(
            'You want one alert that reliably fires on a credential-stuffing run and stays quiet on a busy Monday morning. Which signal, and why that one?',
            'Bạn muốn MỘT cảnh báo nổ đáng tin khi có đợt nhồi tín vật và im lặng vào một sáng thứ Hai đông khách. Chọn tín hiệu nào, và vì sao là cái đó?',
          ),
          options: [
            B(
              'The number of failed logins per hour, with the threshold set from last month\'s peak',
              'Số lượt đăng nhập hỏng mỗi giờ, với ngưỡng đặt theo đỉnh của tháng trước',
            ),
            B(
              'The number of distinct IP addresses seen per hour, since a botnet multiplies it',
              'Số địa chỉ IP khác nhau nhìn thấy mỗi giờ, vì một mạng máy tính ma sẽ nhân nó lên',
            ),
            B(
              'The proportion of logins that fail, sustained over fifteen minutes — normal sits between five and fifteen percent and the ratio does not move with traffic, so one threshold works at 3am on a Sunday and at 10am on a Monday',
              'TỈ LỆ lượt đăng nhập hỏng, duy trì trong mười lăm phút — bình thường nằm giữa năm và mười lăm phần trăm, và tỉ lệ thì không trôi theo lưu lượng, nên một ngưỡng dùng được cả lúc 3 giờ sáng Chủ nhật lẫn 10 giờ sáng thứ Hai',
            ),
            B(
              'The number of successful logins from countries the account has never used, because that is where the damage actually happens and a failure never costs anybody an account',
              'Số lượt đăng nhập THÀNH CÔNG từ những quốc gia tài khoản chưa từng dùng, vì thiệt hại thật sự xảy ra ở đó, còn một lượt hỏng thì chẳng làm ai mất tài khoản nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A count moves with your traffic and with the working week, so a threshold tuned to Monday is deaf on Sunday and a threshold tuned to Sunday screams every Monday — which is how an alert channel gets muted. A ratio is stable across both, and a stuffing run pushes it past ninety percent because almost every pair is wrong. Distinct addresses is a useful dashboard number and a poor alert: a normal morning has plenty. Successful logins from new countries genuinely matter and are on the six-signal list, but as a slower ticket rather than the primary detector, because the volume is low and noisy. Two more cheap detectors from the same lesson deserve a place beside it: distinct accounts attempted per address, and addresses attempted per account — neither shows up in a per-IP rate limiter\'s counters at all.',
            'Một con ĐẾM trôi theo lưu lượng và theo ngày trong tuần, nên ngưỡng chỉnh cho thứ Hai thì điếc vào Chủ nhật, còn ngưỡng chỉnh cho Chủ nhật thì gào lên mỗi thứ Hai — đó chính là cách một kênh cảnh báo bị tắt tiếng. Một TỈ LỆ thì ổn định ở cả hai, và một đợt nhồi đẩy nó vượt chín mươi phần trăm vì gần như cặp nào cũng sai. Số địa chỉ khác nhau là một con số hay để lên bảng điều khiển và là một cảnh báo dở: một buổi sáng bình thường đã có rất nhiều. Đăng nhập thành công từ quốc gia mới thật sự quan trọng và nằm trong danh sách sáu tín hiệu, nhưng ở dạng một phiếu việc chậm hơn chứ không phải cảm biến chính, vì lượng ít và nhiễu. Hai cảm biến rẻ nữa cùng bài học xứng đáng đứng cạnh nó: số tài khoản KHÁC NHAU bị thử từ một địa chỉ, và số địa chỉ thử vào một tài khoản — cả hai đều không hề xuất hiện trong bộ đếm của một bộ giới hạn theo IP.',
          ),
        }),

        mcq({
          prompt: B(
            'A team adds a CAPTCHA to every login to stop credential stuffing. What is the honest assessment?',
            'Một nhóm thêm CAPTCHA vào mọi lượt đăng nhập để chặn nhồi tín vật. Đánh giá trung thực là gì?',
          ),
          options: [
            B(
              'It is useless in every configuration and should never be deployed on an authentication endpoint',
              'Nó vô dụng ở mọi cấu hình và không bao giờ nên triển khai trên một endpoint xác thực',
            ),
            B(
              'It is complete protection, because a stuffing run is by definition automated and a CAPTCHA is by definition an automation test',
              'Đó là lớp bảo vệ trọn vẹn, vì một đợt nhồi theo định nghĩa là tự động còn CAPTCHA theo định nghĩa là phép thử tính tự động',
            ),
            B(
              'It stops the cheapest naive scripts, which is real value, while solving services charge fractions of a cent per challenge — so a determined run pays a rounding error and continues, and every legitimate user pays the friction',
              'Nó chặn được những script rẻ tiền và ngây thơ nhất, đó là giá trị có thật, trong khi các dịch vụ giải hộ tính vài phần nghìn xu mỗi lượt — nên một đợt tấn công quyết tâm chỉ trả một khoản làm tròn rồi đi tiếp, còn mọi người dùng thật thì trả phí ma sát',
            ),
            B(
              'It is equivalent to a per-account rate limit, so deploying both is redundant and the challenge should replace the limiter rather than sit in front of it',
              'Nó tương đương với một bộ giới hạn theo tài khoản, nên triển khai cả hai là thừa, và thử thách kia nên THAY THẾ bộ giới hạn chứ không phải đứng trước nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The economics decide it. Human-backed solving services price a challenge in fractions of a cent, so a run against a million pairs absorbs the cost without noticing — while the tax lands on every legitimate sign-in, disproportionately on people using assistive technology or a slow connection. That does not make it worthless: the long tail of unsophisticated scripts really does stop. Deploy it triggered by risk signals rather than on every login, prefer a modern invisible challenge, and never let it be the only thing between a stuffing list and your accounts. The three measures that actually move the numbers are elsewhere and cost about a day between them: check new passwords against a breach corpus, push a second factor, and count failures per account rather than per address.',
            'Bài toán kinh tế quyết định. Các dịch vụ giải hộ có người thật đứng sau tính mỗi lượt vài phần nghìn xu, nên một đợt tấn công vào một triệu cặp nuốt chi phí ấy mà không thấy gì — trong khi khoản thuế đó rơi lên MỌI lượt đăng nhập chính đáng, và rơi nặng hơn lên người dùng công nghệ trợ giúp hay đường truyền chậm. Điều đó không làm nó vô giá trị: cái đuôi dài các script thô sơ thật sự dừng lại. Hãy bật nó theo TÍN HIỆU RỦI RO chứ không phải ở mọi lượt đăng nhập, ưu tiên loại thử thách vô hình hiện đại, và đừng bao giờ để nó là thứ duy nhất nằm giữa một danh sách nhồi và các tài khoản của bạn. Ba biện pháp thật sự làm chuyển con số thì nằm chỗ khác và cộng lại tốn chừng một ngày: đối chiếu mật khẩu mới với kho dữ liệu rò rỉ, đẩy mạnh yếu tố thứ hai, và đếm số lần sai theo tài khoản thay vì theo địa chỉ.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured: ' + c('cuongthái.com') + ' is served as <code>xn--cuongthi-fza.com</code>, ' + c('cuongthai.com.dang-nhap.co') + ' belongs to <code>dang-nhap.co</code>, and a Greek omicron in ' + c('cuοngthai.com') + ' produces yet another host. All of them obtain a valid TLS certificate within seconds. What follows for user-facing advice?',
            'Đo thật: ' + c('cuongthái.com') + ' được phục vụ dưới dạng <code>xn--cuongthi-fza.com</code>, ' + c('cuongthai.com.dang-nhap.co') + ' thuộc về <code>dang-nhap.co</code>, và một chữ omicron Hy Lạp trong ' + c('cuοngthai.com') + ' cho ra thêm một host nữa. Cả ba đều xin được chứng chỉ TLS hợp lệ trong vài giây. Suy ra điều gì cho lời khuyên dành cho người dùng?',
          ),
          options: [
            B(
              '"Check for the padlock" is now advice that helps the attacker, because free certificates put a padlock on every phishing site — the only reliable signal is the registrable domain, and the durable answer is a credential that reads it mechanically',
              '"Hãy nhìn cái ổ khoá" nay là lời khuyên GIÚP kẻ tấn công, vì chứng chỉ miễn phí gắn một cái ổ khoá lên mọi trang lừa đảo — tín hiệu đáng tin duy nhất là tên miền đăng ký được, và câu trả lời bền vững là một tín vật tự đọc nó bằng máy',
            ),
            B(
              '"Check the padlock" still works, because a lookalike domain cannot obtain a certificate for a name that resembles a registered trademark',
              '"Hãy nhìn cái ổ khoá" vẫn dùng được, vì một tên miền nhìn giống không xin nổi chứng chỉ cho một cái tên na ná một nhãn hiệu đã đăng ký',
            ),
            B(
              'Browsers display the punycode form for every internationalised domain, so a user who reads the address bar sees the deception',
              'Trình duyệt hiển thị dạng punycode cho mọi tên miền quốc tế hoá, nên người dùng đọc thanh địa chỉ là thấy ngay trò lừa',
            ),
            B(
              'The problem is solved by certificate transparency, which prevents a certificate being issued for a confusable name',
              'Vấn đề đã được giải quyết bằng minh bạch chứng chỉ, thứ ngăn việc cấp chứng chỉ cho một cái tên gây nhầm lẫn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A padlock means the connection is encrypted and nothing else, and a generation of advice trained people to read it as "this is the real site" — so the one cue users were taught to trust is now present on both sides. Browsers do apply punycode display rules, but they are heuristic and they do not help with <code>cuongthai.com.dang-nhap.co</code>, which contains no unusual characters at all and reads correctly left to right. Certificate transparency does not prevent issuance; it publishes it, which makes it a very good <em>detection</em> feed — filter it for names resembling yours and you find the phishing site the day it is set up, often before the campaign starts. The durable answer is the one from Chapter 7: the browser writes the origin into the signed data, so the comparison happens mechanically, every time, and the user is never asked to make the judgement.',
            'Cái ổ khoá nghĩa là kết nối được mã hoá, và chỉ có thế; cả một thế hệ lời khuyên đã dạy người ta đọc nó thành "đây là trang thật" — nên cái tín hiệu duy nhất người dùng được dạy để tin giờ hiện ra ở CẢ HAI phía. Trình duyệt có áp quy tắc hiển thị punycode, nhưng đó là quy tắc phỏng đoán và nó chẳng giúp gì với <code>cuongthai.com.dang-nhap.co</code>, thứ không chứa một ký tự lạ nào và đọc từ trái sang phải thì hoàn toàn xuôi tai. Minh bạch chứng chỉ không NGĂN việc cấp; nó CÔNG BỐ việc cấp, và điều đó làm nó thành một nguồn PHÁT HIỆN rất tốt — lọc nó theo những cái tên na ná tên bạn thì tìm ra trang lừa đảo ngay ngày nó được dựng, thường là trước khi chiến dịch bắt đầu. Câu trả lời bền vững là câu ở chương 7: trình duyệt tự ghi origin vào khối dữ liệu được ký, nên phép so sánh diễn ra bằng máy, mọi lần, và người dùng không bao giờ bị hỏi để phán đoán.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on the same push-approval model: at a 2% slip rate, one prompt gives the attacker 2.0%, ten prompts 18.3%, and a hundred prompts 86.7%. With two-digit number matching the same hundred prompts cap at 2.97%. What does the last column actually change?',
            'Đo trên cùng một mô hình phê duyệt bằng thông báo đẩy: với tỉ lệ bấm nhầm 2%, một lần nhắc cho kẻ tấn công 2,0%, mười lần 18,3%, một trăm lần 86,7%. Có khớp số hai chữ số thì đúng một trăm lần nhắc ấy chặn lại ở 2,97%. Cột cuối THẬT SỰ thay đổi cái gì?',
          ),
          options: [
            B(
              'It slows the attacker down, so the same hundred prompts now take long enough for the user to notice and report them',
              'Nó làm kẻ tấn công chậm lại, nên đúng một trăm lần nhắc ấy giờ kéo dài đủ lâu để người dùng nhận ra và báo lại',
            ),
            B(
              'It replaces a judgement the user cannot make — approve or not, with no context — by a task they cannot complete: the number is on the sign-in screen they are not looking at, so the residual is a one-in-a-hundred guess capped by a wrong-entry limit',
              'Nó thay một phán đoán mà người dùng không thể đưa ra — chấp nhận hay không, chẳng có bối cảnh nào — bằng một việc họ không thể làm: con số nằm trên màn hình đăng nhập mà họ đâu có nhìn, nên phần còn lại chỉ là một cú đoán một-phần-trăm, lại còn bị chặn bởi giới hạn nhập sai',
            ),
            B(
              'It makes the prompt harder to read, which measurably reduces the slip rate from 2% to well under 1%, which is what the last column of the table is measuring',
              'Nó làm lời nhắc khó đọc hơn, và điều đó làm tỉ lệ bấm nhầm giảm đo được từ 2% xuống hẳn dưới 1%, và đó chính là thứ mà cột cuối của bảng đang đo',
            ),
            B(
              'It moves the factor from "something you have" to "something you know", which is the category that resists fatigue',
              'Nó chuyển yếu tố đó từ "thứ bạn CÓ" sang "thứ bạn BIẾT", loại vốn chống chịu được sự mệt mỏi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Plain push approval asks a person to decide something they have no information about, at whatever hour the attacker chooses, for free and as many times as they like — and the table shows any defence framed as "users should not approve unexpected prompts" losing that argument at scale. Number matching removes the decision: there is no button to press by mistake, and the attacker would have to supply a number displayed on a screen they never saw. The residual 2.97% is a one-in-a-hundred guess, and it stops climbing because three wrong entries cancel the attempt. Two things belong beside it: cap pending approvals per account per hour, and treat a burst of prompts as a security event, because a push storm means somebody already has the password.',
            'Phê duyệt đẩy trơn bắt một con người quyết định thứ họ không có mẩu thông tin nào về nó, vào bất cứ giờ nào kẻ tấn công chọn, miễn phí và bao nhiêu lần tuỳ thích — và cái bảng kia cho thấy mọi lớp phòng thủ diễn đạt kiểu "người dùng không nên chấp nhận lời nhắc bất ngờ" đều thua cuộc tranh luận ấy khi lên quy mô. Khớp số thì XOÁ BỎ cái phán đoán: chẳng còn cái nút nào để bấm nhầm, và kẻ tấn công phải cung cấp một con số hiện trên màn hình mà chúng chưa từng thấy. Phần dư 2,97% là một cú đoán một-phần-trăm, và nó thôi leo lên vì ba lần nhập sai là huỷ luôn lượt đó. Có hai thứ nữa phải đứng cạnh: chặn số lời nhắc đang chờ theo tài khoản mỗi giờ, và coi một tràng lời nhắc là một SỰ KIỆN AN NINH, vì một cơn bão thông báo đẩy nghĩa là ai đó đã có mật khẩu rồi.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on this repository: 73 backend dependencies plus 21 dev, 85 frontend plus 11, and roughly 2,058 packages across both lockfiles. What is the security statement that follows?',
            'Đo trên chính kho mã này: 73 gói phụ thuộc backend cộng 21 gói dev, 85 gói frontend cộng 11, và khoảng 2.058 gói trong cả hai lockfile. Phát biểu về an toàn suy ra từ đó là gì?',
          ),
          options: [
            B(
              'The number is what matters: a tree that size cannot be audited, so the answer is to reduce it below some threshold',
              'Con số mới là thứ quan trọng: một cây phụ thuộc cỡ đó không rà nổi, nên câu trả lời là giảm nó xuống dưới một ngưỡng nào đó',
            ),
            B(
              'Only direct dependencies matter, because a transitive package cannot execute code you did not import',
              'Chỉ các gói phụ thuộc trực tiếp mới đáng kể, vì một gói bắc cầu không chạy được mã nếu bạn không import nó',
            ),
            B(
              'Every package that runs in the browser has exactly the power of a stored XSS on every page, and every package running in the backend can read <code>process.env</code> — which holds the signing key and the database URL',
              'Mọi gói chạy TRONG TRÌNH DUYỆT đều có đúng quyền lực của một lỗ XSS lưu trữ, trên mọi trang; và mọi gói chạy ở BACKEND đều đọc được <code>process.env</code> — nơi chứa khoá ký và địa chỉ cơ sở dữ liệu',
            ),
            B(
              'Lockfiles remove the risk, because pinning exact versions means a compromised package can never reach production',
              'Lockfile xoá bỏ rủi ro, vì ghim phiên bản chính xác nghĩa là một gói bị chiếm không bao giờ tới được production',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The count is context; the statement is about capability. A compromised frontend package does not need a vulnerability in your code — you installed it and shipped it, and it runs with your origin\'s full authority on every page, forever. A backend package is worse, because it runs with the process\'s privileges and can read the environment, which is where Chapter 4\'s signing key and Chapter 11\'s secrets live. Transitive packages execute too: a dependency of a dependency runs inside the same process and can register a <code>postinstall</code> script that runs at install time. A lockfile pins what you get, which is genuinely valuable for reproducibility and for noticing a new transitive appearing in a routine update — it does not vouch for the contents. The defences are unglamorous: pin, scan in CI, be suspicious of a single-maintainer package with no releases for two years, and treat install scripts as code you chose to run.',
            'Con số chỉ là bối cảnh; phát biểu nằm ở NĂNG LỰC. Một gói frontend bị chiếm không cần một lỗ hổng nào trong mã của bạn — chính bạn cài nó và chính bạn phát hành nó, và nó chạy với toàn bộ thẩm quyền của origin bạn, trên mọi trang, mãi mãi. Một gói backend còn tệ hơn, vì nó chạy với đặc quyền của tiến trình và đọc được biến môi trường, nơi khoá ký ở chương 4 và các bí mật ở chương 11 đang nằm. Gói bắc cầu cũng chạy: một phụ thuộc của một phụ thuộc chạy trong CÙNG tiến trình và có thể khai một script <code>postinstall</code> chạy ngay lúc cài. Lockfile ghim lại thứ bạn nhận được, điều đó thật sự có giá trị cho tính tái lập và cho việc nhận ra một gói bắc cầu MỚI xuất hiện trong một lần cập nhật thường lệ — nhưng nó không bảo lãnh cho nội dung. Các lớp phòng thủ đều không hào nhoáng: ghim, quét trong CI, dè chừng những gói một người duy trì và hai năm không phát hành, và coi script cài đặt là mã mà bạn ĐÃ CHỌN để chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'A stored XSS fires on a page whose session lives in an <code>HttpOnly</code> cookie, and the account is protected by a passkey. What can the attacker do?',
            'Một lỗ XSS lưu trữ phát tác trên một trang có phiên nằm trong cookie <code>HttpOnly</code>, và tài khoản thì được bảo vệ bằng passkey. Kẻ tấn công làm được gì?',
          ),
          options: [
            B(
              'Nothing meaningful: <code>HttpOnly</code> blocks reading the cookie and the passkey blocks reauthentication, so the script has no credential to use',
              'Chẳng làm được gì đáng kể: <code>HttpOnly</code> chặn việc đọc cookie còn passkey chặn việc xác thực lại, nên script không có tín vật nào để dùng',
            ),
            B(
              'Register a new passkey silently, because WebAuthn registration does not require user presence when a session already exists',
              'Âm thầm đăng ký một passkey mới, vì việc đăng ký WebAuthn không cần sự hiện diện của người dùng khi đã có sẵn một phiên',
            ),
            B(
              'Exfiltrate the cookie, because <code>HttpOnly</code> only prevents <code>document.cookie</code> and not a <code>fetch</code> with <code>credentials: \'include\'</code>',
              'Mang cookie đi, vì <code>HttpOnly</code> chỉ chặn <code>document.cookie</code> chứ không chặn một lời gọi <code>fetch</code> kèm <code>credentials: \'include\'</code>',
            ),
            B(
              'Act as the user for as long as the page is open, because the browser attaches the cookie to requests the script makes — the passkey protected the login, which already happened',
              'Hành động với tư cách người dùng suốt thời gian trang còn mở, vì trình duyệt tự đính cookie vào các request do script tạo ra — passkey bảo vệ khoảnh khắc ĐĂNG NHẬP, thứ đã xảy ra xong rồi',
            ),
          ],
          correct: 3,
          explanation: EX(
            '<code>HttpOnly</code> stops the token being <em>read</em>; it does not stop it being <em>used</em>. A script on your origin can call your own endpoints with <code>credentials: \'include\'</code> and the browser attaches the cookie automatically — but the response comes back into the page, not to the attacker, so they are proxying through the victim\'s browser rather than carrying a credential away. That is a large improvement over <code>localStorage</code>, where one line exfiltrates a token that then works from the attacker\'s machine, at leisure, outside your rate limits and anomaly detection, until it expires. And passkeys protect the moment of authentication, which is why Chapter 5 is not made redundant by Chapter 7: one prevents a fake login, the other ends a real session that fell into the wrong hands. WebAuthn registration requires a user gesture, and step-up re-authentication before adding a factor is what keeps this from becoming permanent.',
            '<code>HttpOnly</code> chặn việc ĐỌC token; nó không chặn việc DÙNG token. Một script trên origin của bạn gọi được chính các endpoint của bạn với <code>credentials: \'include\'</code> và trình duyệt tự đính cookie vào — nhưng phản hồi quay về TRANG chứ không về tay kẻ tấn công, nên chúng đang nhờ trình duyệt nạn nhân làm hộ chứ không mang được tín vật đi. Đó là một cải thiện lớn so với <code>localStorage</code>, nơi một dòng là mang được token đi rồi nó chạy ngay trên máy kẻ tấn công, thong thả, nằm ngoài mọi giới hạn tần suất và phép dò bất thường của bạn, cho tới khi hết hạn. Còn passkey bảo vệ KHOẢNH KHẮC xác thực, và đó là lý do chương 5 không bị chương 7 làm cho thừa: một cái ngăn một lượt đăng nhập giả, cái kia kết thúc một phiên THẬT đã rơi vào tay sai. Việc đăng ký WebAuthn đòi một cử chỉ của người dùng, và xác thực lại trước khi thêm một yếu tố mới là thứ giữ cho chuyện này không trở thành vĩnh viễn.',
          ),
        }),

        mcq({
          prompt: B(
            'A recovery-code handler reads the row, hashes the new password, then marks the code used. It passes every test. Five concurrent requests with the same code all succeed. What is the fix, and how do you test it?',
            'Một handler mã khôi phục đọc hàng dữ liệu, băm mật khẩu mới, rồi mới đóng dấu mã là đã dùng. Nó qua mọi bài kiểm thử. Năm request đồng thời với cùng một mã đều thành công. Sửa thế nào, và kiểm thế nào?',
          ),
          options: [
            B(
              'Put the condition inside the write — <code>updateMany({ where: { hash, used: false }, data: { used: true } })</code> — and act only when the affected-row count is one; test with <code>Promise.all</code>, because a sequential loop passes',
              'Đưa điều kiện vào BÊN TRONG lệnh ghi — <code>updateMany({ where: { hash, used: false }, data: { used: true } })</code> — và chỉ hành động khi số hàng bị ảnh hưởng bằng một; kiểm bằng <code>Promise.all</code>, vì một vòng lặp tuần tự thì vẫn qua',
            ),
            B(
              'Move the hashing before the read, so the slow operation no longer sits between the check and the write',
              'Chuyển phép băm lên TRƯỚC lệnh đọc, để thao tác chậm không còn nằm giữa phép kiểm và lệnh ghi',
            ),
            B(
              'Raise the transaction isolation level to <code>SERIALIZABLE</code>, which serialises the five requests without any code change',
              'Nâng mức cô lập giao dịch lên <code>SERIALIZABLE</code>, thứ tuần tự hoá năm request mà không phải đổi dòng mã nào',
            ),
            B(
              'Take an application-level mutex around the handler, which is the only mechanism that works across multiple processes',
              'Dùng một khoá loại trừ ở tầng ứng dụng bao quanh handler, cơ chế duy nhất chạy được xuyên nhiều tiến trình',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The pattern to look for is read, await, decide: any handler that loads a row, awaits something slow, and then acts on what it read has this bug — and an authentication flow does all three, because hashing a password, sending mail and calling an API are each slow enough to lose the race. A conditional write lets the database decide the winner: exactly one caller sees a count of one, everybody else sees zero and gets the same refusal. It needs no coordination service and it works across processes, which an in-process mutex does not. Raising the isolation level can turn the race into a serialisation error you then have to retry — more machinery for the same outcome, and it does not remove the read-then-write shape. And the test is the other half of the answer: five sequential calls pass and five concurrent ones fail, so write the concurrent version for every single-use flow — refresh rotation, reset redemption, the TOTP step advance, invitation acceptance and the registration insert.',
            'Khuôn mẫu cần tìm là ĐỌC, AWAIT, QUYẾT ĐỊNH: bất kỳ handler nào nạp một hàng, chờ một thứ gì đó chậm, rồi hành động dựa trên thứ vừa đọc đều dính con lỗi này — mà một luồng xác thực thì làm cả ba, vì băm mật khẩu, gửi thư và gọi API đều đủ chậm để thua cuộc đua. Một lệnh ghi CÓ ĐIỀU KIỆN để cơ sở dữ liệu chọn người thắng: đúng một bên gọi thấy số hàng bằng một, mọi bên còn lại thấy không và nhận cùng một lời từ chối. Nó không cần dịch vụ điều phối nào và chạy được xuyên tiến trình, thứ mà một khoá trong-tiến-trình thì không. Nâng mức cô lập có thể biến cuộc đua thành một lỗi tuần tự hoá mà bạn lại phải thử lại — thêm máy móc cho cùng một kết quả, và nó không xoá bỏ được hình dạng đọc-rồi-ghi. Và phép KIỂM là nửa còn lại của câu trả lời: năm lời gọi tuần tự thì qua còn năm lời gọi đồng thời thì trượt, nên hãy viết bản đồng thời cho MỌI luồng dùng-một-lần — xoay vòng refresh, dùng token đặt lại, tiến bước TOTP, chấp nhận lời mời, và lệnh chèn lúc đăng ký.',
          ),
        }),

        // ── Chương 11 — Vận hành ────────────────────────────────────────
        mcq({
          prompt: B(
            'A service reads its signing key as ' + c("process.env.JWT_SECRET ?? 'dev-secret'") + '. Production has never set the variable. What is the state of the system, and what is the fix?',
            'Một dịch vụ đọc khoá ký của nó bằng ' + c("process.env.JWT_SECRET ?? 'dev-secret'") + '. Production thì chưa bao giờ đặt biến đó. Hệ thống đang ở trạng thái nào, và sửa thế nào?',
          ),
          options: [
            B(
              'Degraded but contained: a short fallback key weakens signatures without allowing forgery, and lengthening the fallback is enough',
              'Suy giảm nhưng còn kiểm soát được: một khoá dự phòng ngắn làm chữ ký yếu đi chứ chưa cho phép giả mạo, và kéo dài chuỗi dự phòng ấy là đủ',
            ),
            B(
              'Healthy: every request succeeds, every token verifies, and monitoring is green — which is the problem. Tokens are signed with a value published in the repository, so anyone can mint one. Validate the environment at module load with no defaults, so a missing secret fails the deploy instead of the security model',
              'Khoẻ mạnh: mọi request đều thành công, mọi token đều kiểm qua, và giám sát thì xanh — và đó chính là vấn đề. Token đang được ký bằng một giá trị nằm công khai trong kho mã, nên ai cũng đúc được token. Hãy kiểm biến môi trường ngay lúc nạp mô-đun và KHÔNG có giá trị mặc định, để một bí mật thiếu làm hỏng lượt deploy chứ không làm hỏng mô hình an toàn',
            ),
            B(
              'Broken loudly: the process throws on the first request that needs the key, which is how the mistake gets caught in staging long before anything reaches production, at the cost of one failed request',
              'Hỏng ầm ĩ: tiến trình ném lỗi ở request đầu tiên cần tới cái khoá đó, và đó là cách sai lầm này bị bắt ngay ở môi trường thử nghiệm, từ rất lâu trước khi có thứ gì tới được production, với cái giá là một request hỏng',
            ),
            B(
              'Safe in practice: the fallback only applies in development because <code>NODE_ENV</code> gates it, and production has its own configuration path',
              'Thực tế thì an toàn: chuỗi dự phòng chỉ áp ở môi trường phát triển vì <code>NODE_ENV</code> chặn nó lại, còn production có đường cấu hình riêng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A default value is the most common way a development secret reaches production, and it is dangerous precisely because it removes the symptom: nothing throws, no request fails, and the deploy is green while every token is signed with a string anybody can read in the repository. Nothing in the expression gates on the environment. The fix is a schema parsed at module load — required, minimum length, no defaults — so the process refuses to start and the deploy fails in two minutes rather than the security model failing silently for a year. Put the public URL in that required set too, because a missing one is how a reset link falls back to the <code>Host</code> header. And once the secret has been in a repository, rotate it: deleting it from the working tree leaves it in the history, in every clone and in every CI cache.',
            'Một giá trị mặc định là cách phổ biến nhất để một bí mật của môi trường phát triển đi tới production, và nó nguy hiểm chính vì nó XOÁ MẤT triệu chứng: không gì ném lỗi, không request nào hỏng, lượt deploy thì xanh, trong khi mọi token đang được ký bằng một chuỗi ai cũng đọc được trong kho mã. Trong biểu thức ấy chẳng có gì rẽ theo môi trường cả. Cách sửa là một lược đồ phân tích ngay lúc nạp mô-đun — bắt buộc, có độ dài tối thiểu, không giá trị mặc định — để tiến trình từ chối khởi động và lượt deploy hỏng trong hai phút, thay vì mô hình an toàn hỏng lặng lẽ suốt một năm. Hãy đặt cả địa chỉ công khai vào tập bắt buộc đó, vì thiếu nó chính là cách một đường dẫn đặt lại mật khẩu lùi về header <code>Host</code>. Và một khi bí mật đã từng nằm trong kho mã thì hãy XOAY nó: xoá khỏi cây làm việc vẫn để nó lại trong lịch sử, trong mọi bản clone và trong mọi cache của CI.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on this repository today: <b>161</b> environment variables read in <code>src/</code>, <b>136</b> declared in <code>.env.example</code>, <b>89</b> read but never declared. The lesson measured 155, 135 and 84. What is the finding?',
            'Đo trên chính kho mã này hôm nay: <b>161</b> biến môi trường được đọc trong <code>src/</code>, <b>136</b> biến khai trong <code>.env.example</code>, <b>89</b> biến đọc mà chưa từng khai. Bài học đo được 155, 135 và 84. Phát hiện ở đây là gì?',
          ),
          options: [
            B(
              'A leak of eighty-nine secrets, since anything not declared has no owner and no rotation plan',
              'Một vụ rò rỉ tám mươi chín bí mật, vì thứ gì không được khai thì không có chủ và không có kế hoạch xoay khoá',
            ),
            B(
              'A configuration bug: the application reads variables that do not exist, so eighty-nine code paths silently take their fallback branch',
              'Một lỗi cấu hình: ứng dụng đọc những biến không tồn tại, nên tám mươi chín nhánh mã âm thầm rơi vào đường dự phòng',
            ),
            B(
              'Nothing actionable: the counts moved by six, which is within the noise of a grep-based measurement, so the right response is to re-run it next quarter and compare again',
              'Không có gì để hành động: các con số chỉ nhích sáu đơn vị, nằm trong sai số của một phép đo bằng grep, nên phản ứng đúng là chạy lại vào quý sau rồi đối chiếu tiếp',
            ),
            B(
              'Drift, and the gap widened: most of the eighty-nine are configuration rather than secrets with sensible defaults, but a newcomer cannot tell what is tunable and someone rotating a key has no list to check against — so generate the example file from the code and fail CI when it disagrees',
              'Sự trôi dạt, và khoảng cách rộng ra: phần lớn trong tám mươi chín cái là CẤU HÌNH chứ không phải bí mật, và đều có giá trị mặc định hợp lý; nhưng người mới vào không biết chỉnh được những gì, còn người đi xoay một cái khoá thì chẳng có danh sách nào để đối chiếu — nên hãy SINH tệp mẫu ấy TỪ MÃ và cho CI đỏ khi hai bên lệch nhau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Reading an undeclared variable is not a bug — the code takes a sensible default, which is why nothing is broken and why nobody notices. It is also not a leak: most of these are timeouts, model names and feature flags. The cost is informational and it compounds: a new engineer cannot answer "what can I configure?", and the person rotating a key has no authoritative list of where it is used, which is the one document rotation actually needs. The gap grew from 84 to 89 in the time between the lesson and this exam, which is what a hand-maintained list does. Generate the declaration from the source, diff it in CI, and separate configuration from secrets so the whole file is not treated with the care of its least sensitive line.',
            'Đọc một biến chưa khai không phải là lỗi — mã lấy một giá trị mặc định hợp lý, và đó là lý do chẳng có gì hỏng và chẳng ai để ý. Nó cũng không phải rò rỉ: phần lớn số đó là thời gian chờ, tên model và cờ tính năng. Cái giá nằm ở thông tin và nó dồn lại: một kỹ sư mới không trả lời nổi câu "tôi chỉnh được những gì?", còn người đi xoay một cái khoá thì không có danh sách chính thức nào về những chỗ nó được dùng — đúng cái tài liệu duy nhất mà việc xoay khoá cần. Khoảng cách đã nới từ 84 lên 89 chỉ trong quãng thời gian giữa bài học và đề thi này, và đó là thứ một danh sách gõ tay luôn làm. Hãy SINH bản khai từ mã nguồn, so sánh nó trong CI, và tách cấu hình khỏi bí mật để cả tệp không bị đối xử theo mức cẩn trọng của dòng ít nhạy cảm nhất trong nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A rolling deploy starts signing tokens with a new key while some instances still hold only the old verifying set. Measured: a freshly minted, perfectly valid token is rejected. What is the symptom operators see, and what is the correct order?',
            'Một lượt deploy cuốn chiếu bắt đầu ký token bằng khoá mới trong khi vài instance vẫn chỉ giữ chùm khoá kiểm cũ. Đo thật: một token vừa đúc, hoàn toàn hợp lệ, bị TỪ CHỐI. Người vận hành thấy triệu chứng gì, và thứ tự đúng là gì?',
          ),
          options: [
            B(
              'Only new logins fail, because existing sessions keep verifying against the old key until they expire naturally',
              'Chỉ các lượt đăng nhập mới hỏng, vì các phiên đang có vẫn kiểm bằng khoá cũ cho tới khi tự hết hạn',
            ),
            B(
              'All requests fail at once, because a key set is global state and the first instance to update rewrites it for everybody',
              'Mọi request hỏng cùng một lúc, vì chùm khoá là trạng thái toàn cục và instance cập nhật đầu tiên viết lại nó cho tất cả',
            ),
            B(
              'Roughly half of all requests fail depending on which instance answers, with valid tokens rejected as an unknown key id — publish first, wait for the rollout to finish, then flip the signing key, then wait out the longest lifetime, then retire',
              'Khoảng một nửa số request hỏng tuỳ instance nào trả lời, với những token hợp lệ bị từ chối vì mã khoá lạ — hãy CÔNG BỐ trước, chờ lượt cuốn chiếu xong, rồi mới đổi khoá ký, rồi chờ hết vòng đời dài nhất, rồi mới rút',
            ),
            B(
              'Nothing fails: a verifier that meets an unknown key id falls back to its default key, which is why the phases are a convention rather than a requirement',
              'Chẳng có gì hỏng: một bộ kiểm gặp mã khoá lạ sẽ lùi về khoá mặc định của nó, và đó là lý do các giai đoạn chỉ là quy ước chứ không phải yêu cầu',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The intermittent, instance-dependent failure is the signature of this mistake and it is what makes it confusing: the token is genuine, the key is real, and whether it works depends on which pod answered. Publish, sign, wait, retire — four words in one order, and both ways of getting it wrong produce the same symptom of a valid token being rejected. Retiring early is the same outage arriving from the other end. Keep the two settings genuinely separate: a set of key ids that verify, and exactly one that signs. Falling back to a default key when the key id is unknown is not a safety net, it is the mistake — it turns "which key signed this" into "any key I have will do". Alert on unknown-key-id rejections; it is the one metric that tells you a rotation is going wrong while it is still recoverable.',
            'Cái kiểu hỏng chập chờn và phụ thuộc instance chính là chữ ký của sai lầm này, và đó là thứ làm nó rối: token là thật, khoá là thật, còn chuyện nó chạy hay không thì tuỳ pod nào vừa trả lời. CÔNG BỐ, KÝ, CHỜ, RÚT — bốn chữ theo một thứ tự, và cả hai kiểu làm sai đều cho ra cùng một triệu chứng là một token hợp lệ bị từ chối. Rút sớm chính là cùng cú sập ấy đi vào từ đầu bên kia. Hãy giữ hai cấu hình thật sự tách rời: một TẬP mã khoá dùng để kiểm, và đúng MỘT mã khoá dùng để ký. Lùi về một khoá mặc định khi gặp mã khoá lạ không phải là lưới an toàn, nó chính là sai lầm — nó biến "khoá nào đã ký cái này" thành "khoá nào tôi có cũng được". Hãy cảnh báo trên số lượt từ chối vì mã khoá lạ; đó là chỉ số duy nhất báo cho bạn biết một lượt xoay khoá đang hỏng khi nó còn cứu được.',
          ),
        }),

        mcq({
          prompt: B(
            'A login rate limiter is implemented with an in-memory counter in each application instance, and the service runs six instances behind a load balancer with <code>trust proxy</code> unset. Name both defects.',
            'Bộ giới hạn tần suất cho màn đăng nhập được cài bằng một bộ đếm trong bộ nhớ ở mỗi instance ứng dụng, và dịch vụ chạy sáu instance sau một bộ cân bằng tải, với <code>trust proxy</code> chưa bật. Nêu cả hai khiếm khuyết.',
          ),
          options: [
            B(
              'The counter resets on deploy, and the load balancer already rate-limits, so the two limits multiply',
              'Bộ đếm bị đặt lại ở mỗi lượt deploy, và bộ cân bằng tải vốn đã giới hạn tần suất rồi, nên hai giới hạn nhân lên nhau',
            ),
            B(
              'The effective limit is six times what was configured and resets on every deploy; and every request appears to come from the load balancer, so one shared bucket throttles all users at once',
              'Giới hạn thực tế lớn gấp sáu lần con số đã cấu hình và bị đặt lại ở mỗi lượt deploy; và mọi request trông như đến từ bộ cân bằng tải, nên một cái rổ dùng chung bóp cổ tất cả người dùng cùng lúc',
            ),
            B(
              'The counter is not atomic, so concurrent requests lose increments; and <code>trust proxy</code> only affects HTTPS detection, not the address',
              'Bộ đếm không nguyên tử nên các request đồng thời làm mất lượt tăng; còn <code>trust proxy</code> chỉ ảnh hưởng tới việc nhận biết HTTPS chứ không ảnh hưởng địa chỉ',
            ),
            B(
              'Nothing is wrong with the store; the only defect is the axis, because a login limiter should count against the account rather than the address',
              'Chỗ lưu trữ chẳng có gì sai; khiếm khuyết duy nhất là TRỤC đếm, vì một bộ giới hạn đăng nhập phải đếm theo tài khoản chứ không theo địa chỉ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Six independent counters mean a configured limit of ten is a real limit of sixty, and it silently resets whenever you deploy — the same lesson as the session store in Chapter 3, and the fix is the same: one shared store with an atomic increment. The second defect is the opposite failure: Express reports the proxy\'s address until <code>trust proxy</code> is configured, so every user shares one bucket and the limiter is effectively global, throttling real traffic while measuring nothing useful. Set it to the exact number of proxies you have — setting it to <code>true</code> lets a client forge <code>X-Forwarded-For</code> and pick their own bucket, which is a third way to get this wrong. The axis point is correct and important, and it is a separate decision from the store: count login failures against the account, keep a much looser per-IP ceiling as a backstop against raw flooding, and never let the two be the same number.',
            'Sáu bộ đếm độc lập nghĩa là một giới hạn cấu hình mười thật ra là sáu mươi, và nó âm thầm đặt lại mỗi lần bạn deploy — đúng bài học của kho lưu phiên ở chương 3, và cách sửa cũng vậy: MỘT kho dùng chung với lệnh tăng nguyên tử. Khiếm khuyết thứ hai là kiểu hỏng ngược lại: Express báo địa chỉ của proxy cho tới khi bật <code>trust proxy</code>, nên mọi người dùng chung một cái rổ và bộ giới hạn hoá ra là giới hạn toàn cục, bóp cổ lưu lượng thật mà chẳng đo được gì hữu ích. Hãy đặt nó bằng ĐÚNG số proxy bạn thật sự có — đặt thành <code>true</code> là cho phép client giả mạo <code>X-Forwarded-For</code> và tự chọn rổ của mình, tức là cách làm sai thứ ba. Ý về TRỤC đếm thì đúng và quan trọng, nhưng đó là một quyết định riêng, tách khỏi chuyện kho lưu: đếm số lần đăng nhập hỏng theo tài khoản, giữ một trần theo IP lỏng hơn nhiều làm lưới đỡ chống ngập thô, và đừng bao giờ để hai con số ấy bằng nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'Which response does a login rate limiter owe a client, and which information must it withhold?' + code(
              'HTTP/1.1 429 Too Many Requests\n' +
              'Retry-After: 8\n' +
              '{"error":"Qua nhieu yeu cau. Hay thu lai sau."}',
            ),
            'Một bộ giới hạn tần suất ở màn đăng nhập nợ client phản hồi nào, và phải GIỮ LẠI thông tin nào?' + code(
              'HTTP/1.1 429 Too Many Requests\n' +
              'Retry-After: 8\n' +
              '{"error":"Qua nhieu yeu cau. Hay thu lai sau."}',
            ),
          ),
          options: [
            B(
              'Send <code>Retry-After</code> so a well-behaved client backs off instead of turning one rejection into a retry loop; withhold the cap, the remaining allowance and which axis is counted, because on an auth endpoint the <code>X-RateLimit-*</code> headers are a map for probing',
              'Gửi <code>Retry-After</code> để một client tử tế lùi lại thay vì biến một lượt từ chối thành một vòng lặp thử lại; giữ lại con số trần, số lượt còn lại và trục đang đếm, vì trên một endpoint xác thực thì các header <code>X-RateLimit-*</code> là tấm bản đồ cho kẻ dò',
            ),
            B(
              'Send the full <code>X-RateLimit-Limit</code> and <code>X-RateLimit-Remaining</code> headers, because a documented contract is what stops clients retrying blindly',
              'Gửi đầy đủ header <code>X-RateLimit-Limit</code> và <code>X-RateLimit-Remaining</code>, vì một hợp đồng có tài liệu mới là thứ ngăn client thử lại một cách mù quáng',
            ),
            B(
              'Send nothing beyond the status code, since any hint about timing lets an attacker schedule requests to stay just under the limit',
              'Đừng gửi gì ngoài mã trạng thái, vì mọi gợi ý về thời gian đều cho kẻ tấn công xếp lịch request để nằm sát ngay dưới ngưỡng',
            ),
            B(
              'Send a 503 rather than a 429, so automated clients treat it as a transient server fault and back off using their own defaults',
              'Trả 503 thay vì 429, để các client tự động coi đó là lỗi máy chủ tạm thời và tự lùi theo mặc định của chúng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Without <code>Retry-After</code> a mobile app retries immediately and turns one rejection into a loop that looks exactly like an attack, so the header is worth sending even to a caller you do not trust — it changes behaviour and it makes your graphs readable. The headers you withhold are the ones that describe the policy: on a documented public API <code>X-RateLimit-*</code> is genuinely right, and on a login endpoint it hands an attacker the exact shape of the limit to tune against. A 503 misrepresents the situation and invites retry behaviour you do not control. Two more things belong in the same design: back off exponentially and reset on success, so a real user who mistyped once never reaches the second step; and rate-limit the expensive path separately, because a hundred concurrent password hashes saturate the CPU and take the service down without a single successful authentication.',
            'Thiếu <code>Retry-After</code> thì một ứng dụng di động thử lại ngay lập tức và biến một lượt từ chối thành một vòng lặp trông y hệt một cú tấn công, nên cái header ấy đáng gửi ngay cả cho một bên gọi mà bạn không tin — nó đổi hành vi và nó làm cho biểu đồ của bạn đọc được. Những header phải giữ lại là những cái MÔ TẢ chính sách: trên một API công khai có tài liệu thì <code>X-RateLimit-*</code> hoàn toàn đúng, còn trên một endpoint đăng nhập thì nó trao cho kẻ tấn công đúng hình dạng của cái ngưỡng để mà chỉnh cho khớp. Trả 503 là mô tả sai tình huống và mời gọi kiểu thử lại mà bạn không kiểm soát. Hai thứ nữa thuộc về cùng thiết kế này: lùi theo cấp số nhân và đặt lại khi thành công, để một người dùng thật lỡ gõ sai một lần không bao giờ chạm tới bậc thứ hai; và giới hạn RIÊNG cho đường tốn kém, vì một trăm phép băm mật khẩu đồng thời sẽ ngốn sạch CPU và làm sập dịch vụ mà không cần một lượt xác thực thành công nào.',
          ),
        }),

        mcq({
          prompt: B(
            'An audit table stores, per row, a hash of its own content combined with the previous row\'s hash. Measured: editing row 2 breaks verification at row 1, and deleting row 2 also breaks it at row 1. What does that buy, and what does it not?',
            'Một bảng kiểm toán lưu ở mỗi hàng một chuỗi băm của chính nội dung hàng đó ghép với chuỗi băm của hàng trước. Đo thật: sửa hàng 2 làm phép kiểm hỏng ở hàng 1, và xoá hàng 2 cũng làm hỏng ở hàng 1. Nó mua được gì, và KHÔNG mua được gì?',
          ),
          options: [
            B(
              'It prevents an attacker with database access from destroying the log, which is the property an audit trail needs',
              'Nó ngăn một kẻ có quyền vào cơ sở dữ liệu phá huỷ nhật ký, đúng tính chất mà một dấu vết kiểm toán cần',
            ),
            B(
              'It guarantees ordering, which is the actual requirement — the hashes are only a side effect of the sequence numbers',
              'Nó bảo đảm thứ tự, và đó mới là yêu cầu thật — mấy chuỗi băm chỉ là hệ quả phụ của các số thứ tự',
            ),
            B(
              'It removes the need for access control on the table, because tampering is detectable either way, so the application can keep full write access to the table and the verification job is the only control needed',
              'Nó bỏ được nhu cầu kiểm soát truy cập trên bảng đó, vì đằng nào việc can thiệp cũng phát hiện được, nên ứng dụng cứ giữ toàn quyền ghi lên bảng đó và việc chạy kiểm lại là lớp kiểm soát duy nhất cần có',
            ),
            B(
              'It makes editing or deleting visible rather than impossible — the log can still be destroyed, and the difference between "the log is gone" and "the log says nothing happened" is what an investigation needs; but it proves nothing unless something verifies the chain on a schedule',
              'Nó làm việc sửa hay xoá trở nên NHÌN THẤY ĐƯỢC chứ không phải bất khả — nhật ký vẫn có thể bị phá huỷ, và khác biệt giữa "nhật ký mất rồi" với "nhật ký nói là chẳng có gì xảy ra" chính là thứ một cuộc điều tra cần; nhưng nó chẳng chứng minh được gì nếu không có thứ gì đi kiểm lại chuỗi theo lịch',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A chain is tamper-<em>evident</em>, not tamper-proof, and the distinction is the whole value: somebody with full database access can still drop the table, but they cannot quietly rewrite one row to hide a privilege escalation, and an investigation that finds a broken chain knows exactly where to look. The evidence only exists if it is produced, so a nightly job must walk the chain and alert on the first mismatch — a chain nobody verifies proves nothing. Two things strengthen it: publish the latest hash daily to a system with different credentials, so even someone with database access cannot rewrite history that was already anchored; and grant the application <code>INSERT</code> and <code>SELECT</code> only, no <code>UPDATE</code> and no <code>DELETE</code>, so a bug or a compromised process cannot rewrite the record of what it did. Access control is not replaced by the chain, it is what makes the chain worth having.',
            'Một chuỗi băm là thứ làm cho can thiệp LỘ RA, không phải làm cho can thiệp bất khả, và chính sự phân biệt đó là toàn bộ giá trị: kẻ có toàn quyền vào cơ sở dữ liệu vẫn xoá được cả bảng, nhưng không thể lặng lẽ viết lại một hàng để che một cú leo thang đặc quyền, và một cuộc điều tra thấy chuỗi đứt thì biết chính xác phải soi chỗ nào. Bằng chứng chỉ tồn tại nếu có ai SINH ra nó, nên phải có một việc chạy hằng đêm đi hết chuỗi và báo động ở chỗ lệch đầu tiên — một chuỗi không ai kiểm thì chẳng chứng minh điều gì. Có hai thứ làm nó mạnh thêm: công bố chuỗi băm mới nhất mỗi ngày sang một hệ thống dùng bộ đăng nhập KHÁC, để ngay cả người có quyền vào cơ sở dữ liệu cũng không viết lại được phần lịch sử đã neo; và chỉ cấp cho ứng dụng quyền <code>INSERT</code> với <code>SELECT</code>, không <code>UPDATE</code> và không <code>DELETE</code>, để một con lỗi hay một tiến trình bị chiếm không viết lại được bản ghi về chính việc nó vừa làm. Kiểm soát truy cập không bị chuỗi băm thay thế; nó chính là thứ làm cho chuỗi băm đáng có.',
          ),
        }),

        mcq({
          prompt: B(
            'Granting a role commits successfully, and the audit insert that records it fails immediately afterwards. Why is that specific ordering the dangerous one, and what is the fix?',
            'Lệnh cấp một vai trò commit thành công, rồi ngay sau đó lệnh chèn bản ghi kiểm toán cho việc ấy thất bại. Vì sao đúng thứ tự ấy mới là thứ tự nguy hiểm, và sửa thế nào?',
          ),
          options: [
            B(
              'Because the log now disagrees with reality in the direction that hides a privilege escalation; write the audit event in the same transaction as the change, and where that is impossible write it first as pending and settle it after',
              'Vì nhật ký giờ trái với thực tế theo đúng hướng CHE GIẤU một cú leo thang đặc quyền; hãy ghi sự kiện kiểm toán trong CÙNG giao dịch với thay đổi, và chỗ nào không làm được thì ghi TRƯỚC ở trạng thái treo rồi chốt lại sau',
            ),
            B(
              'Because the hash chain now has a gap, which makes every later verification fail and the log unusable',
              'Vì chuỗi băm giờ có một lỗ hổng, làm mọi phép kiểm sau đó đều trượt và cả nhật ký thành vô dụng',
            ),
            B(
              'Because the grant should be rolled back automatically when its audit event fails, and the absence of that rollback is the bug',
              'Vì lệnh cấp lẽ ra phải tự động quay lui khi sự kiện kiểm toán hỏng, và việc thiếu phép quay lui đó mới là con lỗi',
            ),
            B(
              'It is not the dangerous ordering: an audit event without a corresponding change is far worse, because it accuses somebody of something that never happened',
              'Đó không phải thứ tự nguy hiểm: một sự kiện kiểm toán không có thay đổi tương ứng mới tệ hơn nhiều, vì nó buộc tội ai đó về một việc chưa từng xảy ra',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both mismatches are bad and they are not symmetric. An audit event with no corresponding change is a puzzle somebody has to resolve; a change with no audit event is a hole, and it is a hole in exactly the direction an attacker wants — the grant happened, and nothing records who did it. One transaction makes the two atomic, so a failure rolls both back and the state is consistent either way; that is the fix, not an after-the-fact compensating rollback, which is itself another operation that can fail. When the log genuinely lives in another system, write it first marked pending and settle it after, so the worst case is the harmless direction. The chain is unaffected by a missing event — it links the rows that exist — which is a reminder that tamper evidence and completeness are two different properties, and only the transaction gives you the second.',
            'Cả hai kiểu lệch đều tệ, và chúng KHÔNG đối xứng. Một sự kiện kiểm toán không có thay đổi tương ứng là một câu đố ai đó phải gỡ; còn một thay đổi không có sự kiện kiểm toán là một LỖ HỔNG, và nó thủng đúng theo hướng mà kẻ tấn công mong muốn — việc cấp quyền đã xảy ra, và chẳng có gì ghi lại ai đã làm. Một giao dịch làm hai thứ trở nên nguyên tử, nên hỏng thì cả hai cùng quay lui và trạng thái nhất quán ở cả hai đường; ĐÓ mới là cách sửa, chứ không phải một phép quay lui bù đắp sau đó, thứ mà bản thân nó cũng là một thao tác có thể hỏng. Khi nhật ký thật sự nằm ở một hệ thống khác thì hãy ghi TRƯỚC ở trạng thái treo rồi chốt lại sau, để trường hợp xấu nhất rơi vào hướng vô hại. Chuỗi băm không bị ảnh hưởng bởi một sự kiện thiếu — nó nối các hàng ĐANG CÓ — và đó là lời nhắc rằng "lộ dấu can thiệp" và "đầy đủ" là hai tính chất khác nhau, mà chỉ giao dịch mới cho bạn cái thứ hai.',
          ),
        }),

        mcq({
          prompt: B(
            'A team turns on twenty authentication alerts. Three months later nobody reads the channel. Which pair of alerts should have been switched on first, and what makes an alert worth switching on at all?',
            'Một nhóm bật hai mươi cảnh báo về xác thực. Ba tháng sau chẳng ai đọc cái kênh ấy nữa. Cặp cảnh báo nào lẽ ra phải bật trước, và điều gì làm cho một cảnh báo đáng được bật?',
          ),
          options: [
            B(
              'Refresh-token reuse and the login failure ratio — one is close to proof of a stolen token and the other detects a stuffing run; an alert needs a threshold taken from a fortnight of your own data, a named owner and a linked runbook, or it belongs on a dashboard instead',
              'Phát hiện tái dùng refresh token và tỉ lệ đăng nhập hỏng — một cái gần như là bằng chứng của một token bị cắp, cái kia phát hiện một đợt nhồi; một cảnh báo cần một ngưỡng lấy từ hai tuần dữ liệu CỦA CHÍNH BẠN, một người chủ có tên, và một cuốn runbook đi kèm, nếu không thì nó thuộc về bảng điều khiển',
            ),
            B(
              'Failed logins per user and password resets per user, because the per-user view is where an investigation starts',
              'Số lượt đăng nhập hỏng theo từng người và số lượt đặt lại mật khẩu theo từng người, vì góc nhìn theo từng người là chỗ một cuộc điều tra bắt đầu',
            ),
            B(
              'CPU and memory on the authentication service, because every attack in Chapter 10 shows up as load before it shows up as a security event',
              'CPU và bộ nhớ của dịch vụ xác thực, vì mọi cú tấn công ở chương 10 đều hiện ra thành tải trước khi hiện ra thành một sự kiện an ninh',
            ),
            B(
              'All twenty, with the noisy ones routed to a separate low-priority channel so nothing is lost, because an alert that is never delivered cannot be acted on later',
              'Cả hai mươi, với những cái ồn ào đẩy sang một kênh ưu tiên thấp riêng để không mất gì, vì một cảnh báo chưa từng được gửi đi thì sau này cũng chẳng xử lý được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The cost of a false positive is not the interruption, it is the next real alert being dismissed by reflex — so six alerts that fire correctly beat sixty that mostly do not, and twenty on day one is how a channel gets muted by month three. The two to start with cover the two attacks that will actually reach you: reuse detection is the closest thing to proof of a stolen token in the whole course and should be flat zero once the client is correct, and the failure ratio catches a stuffing run without moving with your traffic. Per-user alerting produces thousands of pages and finds nothing — one person failing five logins is a typo; aggregate first and let the per-user detail live in the audit log where an investigation can find it. Reuse detection is the deliberate exception, because a single occurrence is meaningful. And routing noise to a quieter channel does not fix a noisy alert, it just moves the place nobody looks.',
            'Cái giá của một báo động giả không phải là lần bị làm phiền, mà là lần báo động THẬT kế tiếp bị gạt đi theo phản xạ — nên sáu cảnh báo nổ đúng hơn hẳn sáu mươi cái phần lớn nổ sai, và bật hai mươi cái ngay ngày đầu chính là cách một cái kênh bị tắt tiếng vào tháng thứ ba. Hai cái nên bắt đầu phủ đúng hai cú tấn công sẽ thật sự tìm tới bạn: phát hiện tái dùng là thứ gần với BẰNG CHỨNG của một token bị cắp nhất trong cả khoá học và phải phẳng lì ở số không khi client đã đúng, còn tỉ lệ hỏng thì bắt được một đợt nhồi mà không trôi theo lưu lượng. Cảnh báo theo từng người dùng đẻ ra hàng nghìn lần gọi dậy và chẳng tìm ra gì — một người sai năm lần đăng nhập là gõ nhầm; hãy tổng hợp trước rồi để phần chi tiết theo từng người sống trong nhật ký kiểm toán, nơi một cuộc điều tra tìm thấy nó. Phát hiện tái dùng là ngoại lệ CÓ CHỦ ĐÍCH, vì chỉ một lần xảy ra đã có ý nghĩa. Còn đẩy tiếng ồn sang một kênh im hơn thì không sửa được một cảnh báo ồn, nó chỉ dời chỗ mà không ai nhìn tới.',
          ),
        }),

        // ── Chương 12 — Chẩn đoán ───────────────────────────────────────
        mcq({
          prompt: B(
            'Four reports arrive: everybody is locked out; one named person is locked out; everyone in one workspace is locked out; and a handful of people are logged out at random all day. Which mapping is right?',
            'Bốn báo cáo cùng tới: tất cả mọi người không vào được; đúng một người tên tuổi cụ thể không vào được; mọi người trong MỘT không gian làm việc không vào được; và lác đác vài người bị đăng xuất ngẫu nhiên suốt cả ngày. Ánh xạ nào đúng?',
          ),
          options: [
            B(
              'Everybody means a browser update; one person means their password; a workspace means the database; random means the network',
              'Tất cả mọi người nghĩa là trình duyệt vừa cập nhật; một người nghĩa là mật khẩu của họ; một không gian làm việc nghĩa là cơ sở dữ liệu; ngẫu nhiên nghĩa là đường mạng',
            ),
            B(
              'Everybody means the last change you deployed; one person means read their row and their audit log; a workspace means find the attribute they share; random means concurrency or a partial rollout',
              'Tất cả mọi người nghĩa là thay đổi cuối cùng bạn vừa deploy; một người nghĩa là hãy ĐỌC hàng dữ liệu và nhật ký kiểm toán của họ; một không gian làm việc nghĩa là đi tìm THUỘC TÍNH mà họ dùng chung; ngẫu nhiên nghĩa là tính đồng thời hoặc một lượt cuốn chiếu dở dang',
            ),
            B(
              'All four have the same class of cause, so the population affected tells you nothing and the logs are the only starting point',
              'Cả bốn đều cùng một lớp nguyên nhân, nên tập người bị ảnh hưởng chẳng nói lên điều gì và log là điểm khởi đầu duy nhất',
            ),
            B(
              'Everybody means a certificate expired; the other three are all cookie attribute problems and belong in Chapter 3',
              'Tất cả mọi người nghĩa là một chứng chỉ hết hạn; ba cái còn lại đều là vấn đề thuộc tính cookie và thuộc về chương 3',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The population affected is the cheapest question you can ask and it halves the search space immediately. Nothing but a change you made affects every user at the same moment — the last deploy, the last configuration edit, the last dependency bump, in that order, and a recent key rotation moves to the front of that list. One person is a row: locked, unverified, sessions revoked by a password change, an enrolled factor they do not have — four columns and one audit query answer it faster than any hypothesis. A group means finding the shared attribute rather than guessing at a cause: one tenant, one identity provider, one client version, one rate-limit bucket. And "random, a few people, all day" has exactly two shapes — a race that only appears under parallel requests, or a rolling deploy where instances disagree — and neither reproduces with a single sequential attempt. A certificate expiring is a real cause of the first shape, but it is one candidate rather than the mapping.',
            'Tập người bị ảnh hưởng là câu hỏi rẻ nhất bạn có thể đặt ra và nó cắt đôi không gian tìm kiếm ngay lập tức. Không gì ngoài một thay đổi do chính bạn làm mới tác động tới MỌI người cùng một khoảnh khắc — lượt deploy gần nhất, lần sửa cấu hình gần nhất, lần nâng gói gần nhất, theo đúng thứ tự đó, và nếu vừa có xoay khoá thì nó nhảy lên đầu danh sách. Một người là một HÀNG dữ liệu: bị khoá, chưa xác minh email, phiên bị thu hồi bởi một lần đổi mật khẩu, một yếu tố đã đăng ký mà họ không có — bốn cột và một câu truy vấn kiểm toán trả lời nhanh hơn mọi giả thuyết. Một nhóm nghĩa là đi TÌM thuộc tính dùng chung chứ không phải đoán nguyên nhân: một tenant, một nhà cung cấp danh tính, một phiên bản client, một cái rổ giới hạn tần suất. Còn "ngẫu nhiên, vài người, suốt ngày" thì có đúng hai hình dạng — một cuộc đua chỉ hiện ra dưới các request song song, hoặc một lượt cuốn chiếu mà các instance bất đồng với nhau — và cả hai đều không tái hiện được bằng một lần thử tuần tự. Chứng chỉ hết hạn đúng là một nguyên nhân có thật của hình dạng thứ nhất, nhưng nó là MỘT ứng viên chứ không phải cái ánh xạ.',
          ),
        }),

        mcq({
          prompt: B(
            'Sign-in works from <code>curl</code> and fails in the browser. The server logs show a clean 200 with a <code>Set-Cookie</code> header. Where is the bug, and why do the logs not show it?',
            'Đăng nhập chạy được bằng <code>curl</code> và hỏng trên trình duyệt. Log máy chủ hiện một mã 200 sạch sẽ kèm header <code>Set-Cookie</code>. Con lỗi nằm ở đâu, và vì sao log không cho thấy nó?',
          ),
          options: [
            B(
              'In CORS: the browser is blocked from reading the response, so the cookie never reaches the cookie jar, and adding the origin to the allow-list restores the login without touching the cookie attributes',
              'Ở CORS: trình duyệt bị chặn đọc phản hồi, nên cookie không bao giờ tới được kho cookie, và thêm origin đó vào danh sách cho phép là đăng nhập chạy lại mà không cần đụng tới thuộc tính cookie nào',
            ),
            B(
              'In the credential check: <code>curl</code> sends the password as form data while the browser sends JSON, so a different code path runs',
              'Ở phép kiểm tín vật: <code>curl</code> gửi mật khẩu dạng form còn trình duyệt gửi JSON, nên chạy vào một nhánh mã khác',
            ),
            B(
              'In the cookie attributes meeting a browser policy — <code>Secure</code> on an http origin, <code>SameSite=Strict</code> after a cross-site redirect, a <code>Domain</code> that does not match — and the browser simply never sends the cookie back, so the next request looks like an ordinary unauthenticated one',
              'Ở chỗ các thuộc tính cookie đụng phải một chính sách của trình duyệt — <code>Secure</code> trên một origin http, <code>SameSite=Strict</code> sau một cú chuyển hướng xuyên trang, một <code>Domain</code> không khớp — và trình duyệt đơn giản là KHÔNG gửi cookie đó về, nên request kế tiếp trông y như một request chưa đăng nhập bình thường',
            ),
            B(
              'In the session store: <code>curl</code> and the browser land on different instances, and only one of them has the session',
              'Ở kho lưu phiên: <code>curl</code> và trình duyệt rơi vào hai instance khác nhau, và chỉ một trong hai có cái phiên đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>curl</code> is a browser with none of the policies, so "works there, fails here" locates the bug in a policy rather than in your credential handling — and none of it appears in server logs, because a request arriving without a cookie is indistinguishable from a request that never had one. Read the <code>Set-Cookie</code> header literally and check it against where the page is actually running. Reproduce the whole thing with a cookie jar (<code>-c</code> writes, <code>-b</code> sends) and look at the stored line: domain, host-only flag, path, secure flag, expiry. And run the control case — call the endpoint with no cookie at all, because if it answers 200 you have found something more interesting than the reported bug. Instance affinity is a real cause of a different shape (random logouts for a few users, all day) and it would not produce a consistent browser-only failure.',
            '<code>curl</code> là một trình duyệt không mang theo chính sách nào, nên "chạy ở đây, hỏng ở kia" định vị con lỗi vào một CHÍNH SÁCH chứ không phải vào phần xử lý tín vật của bạn — và chẳng có gì trong đó hiện ra ở log máy chủ, vì một request tới mà không mang cookie thì không phân biệt được với một request vốn chưa từng có cookie. Hãy đọc header <code>Set-Cookie</code> theo đúng từng chữ và đối chiếu với chỗ trang đang thật sự chạy. Tái hiện trọn quy trình bằng một kho cookie (<code>-c</code> để ghi, <code>-b</code> để gửi) rồi nhìn vào dòng đã lưu: domain, cờ chỉ-thuộc-host, path, cờ secure, hạn dùng. Và chạy cả ca đối chứng — gọi endpoint đó mà KHÔNG kèm cookie nào, vì nếu nó trả 200 thì bạn vừa tìm ra một thứ thú vị hơn cái lỗi được báo. Chuyện dính instance là nguyên nhân có thật của một hình dạng khác (vài người bị đăng xuất ngẫu nhiên suốt ngày) và nó sẽ không tạo ra một kiểu hỏng nhất quán chỉ-trên-trình-duyệt.',
          ),
        }),

        mcq({
          prompt: B(
            'A report says sessions "stop working after about a day". Nobody deployed anything. What is the fastest way to turn that sentence into a diagnosis?',
            'Một báo cáo nói rằng các phiên "ngừng chạy sau khoảng một ngày". Chẳng ai deploy gì cả. Cách nhanh nhất để biến câu đó thành một chẩn đoán là gì?',
          ),
          options: [
            B(
              'Reproduce it by leaving a session open for a day, since only a real observation settles a report about timing',
              'Tái hiện bằng cách để một phiên mở suốt một ngày, vì chỉ một quan sát thật mới kết luận được một báo cáo về thời gian',
            ),
            B(
              'Search the audit log for logout events at that hour, because a scheduled job is the only thing that ends sessions without a deploy',
              'Tìm trong nhật ký kiểm toán các sự kiện đăng xuất vào giờ đó, vì một việc chạy theo lịch là thứ duy nhất kết thúc phiên mà không cần deploy',
            ),
            B(
              'Ask for the exact number, then match it against every lifetime you configured — the number is the diagnosis: fifteen minutes is an access token, a day or seven is a cookie <code>Max-Age</code>, thirty days is a refresh token or a remembered device, ninety days is a certificate',
              'Hỏi cho ra CON SỐ chính xác, rồi đối chiếu nó với mọi vòng đời bạn đã cấu hình — con số CHÍNH LÀ chẩn đoán: mười lăm phút là access token, một ngày hay bảy ngày là <code>Max-Age</code> của cookie, ba mươi ngày là refresh token hay một thiết bị được nhớ, chín mươi ngày là một chứng chỉ',
            ),
            B(
              'Check the server clock, because "about a day" is the classic signature of NTP drift accumulating over weeks until it crosses a token lifetime',
              'Kiểm đồng hồ máy chủ, vì "khoảng một ngày" là chữ ký kinh điển của việc NTP trôi tích luỹ qua nhiều tuần cho tới lúc vượt qua vòng đời của một token',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A consistent interval is the single most informative thing in an authentication report, because everything in this system that ends on its own ends on a configured number — and you wrote all of those numbers down. Matching the reported interval against the list usually identifies the subsystem before you open an editor, and it converts a vague sentence into "the cookie outlives the token inside it", which is a specific bug with a specific fix. Waiting a day to reproduce is the slowest possible route to information you already have. The audit log is worth reading and it will not show a logout, because nothing logged the user out: the credential simply aged past a number. And server clock drift produces shape 6 — every MFA code from every user rejected at once — not a clean per-user interval. Ask two more things while you are there: when did it last work, and does it reproduce with <code>curl</code> right now.',
            'Một khoảng thời gian ĐỀU ĐẶN là thứ nhiều thông tin nhất trong một báo cáo về xác thực, vì mọi thứ trong hệ này tự kết thúc đều kết thúc theo một CON SỐ đã cấu hình — và chính bạn đã ghi hết những con số ấy ra. Đối chiếu khoảng thời gian được báo với danh sách đó thường chỉ ra đúng phân hệ trước cả khi bạn mở trình soạn thảo, và nó biến một câu nói mơ hồ thành "cái cookie sống lâu hơn cái token nằm trong nó", một con lỗi cụ thể với một cách sửa cụ thể. Chờ một ngày để tái hiện là con đường chậm nhất có thể để tới một thông tin bạn đã có sẵn. Nhật ký kiểm toán thì đáng đọc, và nó sẽ KHÔNG hiện ra một sự kiện đăng xuất nào, vì có ai đăng xuất người dùng đâu: cái tín vật đơn giản là già quá một con số. Còn đồng hồ máy chủ trôi thì tạo ra hình dạng số 6 — mọi mã MFA của mọi người bị từ chối cùng lúc — chứ không phải một khoảng thời gian gọn ghẽ theo từng người. Tiện thể hãy hỏi thêm hai điều: lần cuối nó còn chạy là khi nào, và ngay bây giờ nó có tái hiện bằng <code>curl</code> không.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on a live implementation with a one-step drift window: at <code>T mod 30 = 0</code> the server accepts a client that is −30s to +59s out; at <code>T mod 30 = 29</code> it accepts −59s to +30s. One user\'s codes are rejected every time, and nobody else is affected. What is the diagnosis?',
            'Đo trên một bản cài đặt thật với cửa sổ trôi một bước: ở <code>T mod 30 = 0</code> máy chủ chấp nhận một client lệch từ −30s tới +59s; ở <code>T mod 30 = 29</code> thì chấp nhận từ −59s tới +30s. Mã của MỘT người dùng bị từ chối lần nào cũng vậy, và không ai khác bị ảnh hưởng. Chẩn đoán là gì?',
          ),
          options: [
            B(
              'Their device clock is outside the guaranteed band, so every code they will ever generate is rejected — the interval depends on where <code>T</code> sits in the step, and the band guaranteed at every moment is only about −30s to +29s',
              'Đồng hồ thiết bị của họ nằm ngoài dải BẢO ĐẢM, nên mọi mã họ sẽ sinh ra từ nay đều bị từ chối — khoảng chấp nhận phụ thuộc vị trí của <code>T</code> trong bước, và dải bảo đảm cho mọi thời điểm chỉ vào khoảng −30s tới +29s',
            ),
            B(
              'The secret was decoded as hex where the app read it as base32, which is why the codes never match for this account and would match again after a re-enrolment',
              'Bí mật bị giải mã dạng hex trong khi ứng dụng đọc nó dạng base32, và đó là lý do các mã không bao giờ khớp với tài khoản này, và sẽ khớp lại sau một lượt đăng ký mới',
            ),
            B(
              'The server is configured for SHA-256 while the authenticator uses SHA-1, so every code differs',
              'Máy chủ được cấu hình dùng SHA-256 còn ứng dụng xác thực thì dùng SHA-1, nên mọi mã đều lệch',
            ),
            B(
              'The replay guard is rejecting them, because a code that already succeeded can never succeed again',
              'Chốt chặn phát lại đang từ chối họ, vì một mã đã từng thành công thì không bao giờ thành công lại được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The population is the diagnosis. An encoding mismatch or a hash-algorithm mismatch fails for <em>everyone</em>, from the very first enrolment — so if anybody has ever completed enrolment successfully, it is neither, and the fastest confirmation is to check your implementation against the RFC 6238 test vectors. A server clock that drifted fails for everyone <em>suddenly</em>. One user forever is their device, and the fix is to have them enable automatic time — while you log the observed step offset so support can read the drift instead of guessing at it. Note the measured band: the lesson\'s summary of "−60s to +59s" is only true at one position within the step, and the interval guaranteed at every moment is about half that. The replay guard produces a different and very specific report — a code that works once and then never again for that step, usually because the client submitted the form twice.',
            'Tập người bị ảnh hưởng chính là chẩn đoán. Lệch cách mã hoá hay lệch thuật toán băm thì hỏng với TẤT CẢ mọi người, ngay từ lượt đăng ký đầu tiên — nên nếu đã từng có ai đăng ký thành công thì không phải hai cái đó, và cách xác nhận nhanh nhất là đối chiếu bản cài đặt của bạn với các vector kiểm thử của RFC 6238. Một đồng hồ máy chủ bị trôi thì hỏng với tất cả mọi người và hỏng ĐỘT NGỘT. Một người hỏng mãi mãi là chuyện của THIẾT BỊ họ, và cách sửa là bảo họ bật đồng bộ giờ tự động — còn bạn thì ghi lại độ lệch bước quan sát được để bộ phận hỗ trợ đọc ra con số thay vì ngồi đoán. Để ý dải đo được: câu tóm tắt "−60s tới +59s" của bài học chỉ đúng ở MỘT vị trí trong bước, còn khoảng bảo đảm cho mọi thời điểm chỉ bằng khoảng một nửa thế. Chốt chặn phát lại tạo ra một báo cáo khác và rất đặc trưng — một mã chạy được một lần rồi thôi ở đúng bước đó, thường vì client gửi biểu mẫu hai lần.',
          ),
        }),

        mcq({
          prompt: B(
            'During an incident you need to know what is inside a production access token. Which approach is correct?' + code(
              "echo $TOKEN | cut -d. -f2 | basenc --base64url -d\n" +
              'node -e "console.log(new Date(1756000900 * 1000).toISOString())"',
            ),
            'Trong lúc xử lý sự cố bạn cần biết bên trong một access token của production có gì. Cách làm nào đúng?' + code(
              "echo $TOKEN | cut -d. -f2 | basenc --base64url -d\n" +
              'node -e "console.log(new Date(1756000900 * 1000).toISOString())"',
            ),
          ),
          options: [
            B(
              'Paste it into a well-known decoder site, which is faster and shows the signature status as well',
              'Dán nó vào một trang giải mã nổi tiếng, vừa nhanh hơn vừa hiện luôn trạng thái chữ ký',
            ),
            B(
              'Decode locally in two commands and convert <code>exp</code> to an ISO string before arguing about it — and remember that decoding is not verifying, so this tells you what the token claims and nothing about whether it is valid',
              'Giải mã tại chỗ bằng hai lệnh và ĐỔI <code>exp</code> ra chuỗi ISO trước khi tranh luận về nó — và nhớ rằng giải mã không phải là xác minh, nên việc này cho biết token TỰ XƯNG điều gì chứ không cho biết nó có hợp lệ hay không',
            ),
            B(
              'Read it from the application log, which is why request logging should include the <code>Authorization</code> header on authentication routes',
              'Đọc nó từ log ứng dụng, và đó là lý do phần ghi log request nên bao gồm cả header <code>Authorization</code> trên các route xác thực',
            ),
            B(
              'Verify it first with the production signing key pasted into a local script, because an unverified payload cannot be trusted for a diagnosis',
              'Xác minh nó trước bằng khoá ký production dán vào một script cục bộ, vì một payload chưa xác minh thì không tin được để chẩn đoán',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two shell commands do the job locally, and this matters because pasting a live token into a decoder site is the single most common way a working session credential leaves an organisation during an incident — the site is convenient and it receives the credential. Converting <code>exp</code> is not pedantry: comparing Unix timestamps by eye is how people conclude a token is valid when it expired a year ago, and printing both times as ISO strings makes the answer something nobody can disagree with. Keep the distinction clear — this reads the claims; whether the signature is good needs the key and the full set of checks. Logging the <code>Authorization</code> header is the failure this whole chapter warns about, and pulling a production signing key onto a laptop to satisfy curiosity creates a second incident: the header, the <code>kid</code> and the claims are almost always enough.',
            'Hai lệnh shell làm xong việc ngay tại chỗ, và điều này quan trọng vì dán một token còn sống vào một trang giải mã là cách phổ biến nhất để một tín vật phiên đang hoạt động rời khỏi tổ chức trong lúc xử lý sự cố — trang đó tiện lợi, và nó NHẬN được cái tín vật ấy. Đổi <code>exp</code> ra chuỗi ISO không phải là chuyện câu nệ: so mấy con dấu thời gian Unix bằng mắt chính là cách người ta kết luận một token còn hạn trong khi nó đã hết hạn từ năm ngoái, còn in cả hai mốc ra dạng ISO thì biến câu trả lời thành thứ không ai cãi được. Hãy giữ rõ sự phân biệt — việc này ĐỌC các claim; còn chữ ký có tốt không thì cần cái khoá và cả bộ phép kiểm. Ghi log header <code>Authorization</code> chính là cái hỏng mà cả chương này cảnh báo, còn kéo một khoá ký production về máy cá nhân chỉ để thoả trí tò mò là tạo ra một sự cố thứ hai: header, trường <code>kid</code> và các claim gần như luôn là đủ.',
          ),
        }),

        mcq({
          prompt: B(
            'Five red-flag greps run against this repository today return <b>0</b> uses of a decode helper, <b>7</b> unpinned <code>jwt.verify</code> calls, <b>4</b> mass-assignment sites, <b>2</b> Host-header URLs and <b>7</b> secrets with a fallback default. How should that be written up?',
            'Năm lệnh grep tìm dấu hiệu đỏ chạy trên kho mã này hôm nay trả về <b>0</b> chỗ dùng hàm decode, <b>7</b> lời gọi <code>jwt.verify</code> không ghim thuật toán, <b>4</b> chỗ gán hàng loạt, <b>2</b> chỗ dựng URL từ header Host, và <b>7</b> bí mật có giá trị mặc định dự phòng. Nên viết kết quả đó ra sao?',
          ),
          options: [
            B(
              'As twenty findings, since each hit is an instance of a documented vulnerability class from this course and grouping them would hide how much of the codebase is affected',
              'Thành hai mươi phát hiện, vì mỗi lượt khớp là một thể hiện của một lớp lỗ hổng đã có tài liệu trong khoá học này, và gộp chúng lại sẽ che mất mức độ lan rộng trong kho mã',
            ),
            B(
              'Not at all until each hit is confirmed exploitable, since an unconfirmed count is noise that damages the review\'s credibility and invites the team to argue about the tooling',
              'Đừng viết gì cả cho tới khi từng lượt khớp được xác nhận là khai thác được, vì một con số chưa xác nhận chỉ là nhiễu, làm hỏng uy tín của bản rà soát và kéo cả nhóm vào cuộc cãi nhau về công cụ',
            ),
            B(
              'As one finding, because the five patterns are symptoms of the same root cause — nobody wrote the rules down — and should be reported together as a single process finding',
              'Thành MỘT phát hiện, vì năm khuôn mẫu ấy đều là triệu chứng của cùng một nguyên nhân gốc — chẳng ai ghi các luật ra giấy — và nên báo cáo chung thành một phát hiện về quy trình',
            ),
            B(
              'As five counts and five conclusions, kept separate: a grep produces candidates and a human classifies them — several of the fallback hits are one key read under a chain of variable names, which is deliberate, while seven unpinned verifies is a real finding; and the zero is worth writing down too',
              'Thành năm CON SỐ ĐO và năm KẾT LUẬN, giữ tách bạch: grep sinh ra ứng viên còn con người phân loại — vài lượt khớp ở nhóm dự phòng chỉ là MỘT cái khoá đọc qua một chuỗi tên biến, và đó là cố ý, trong khi bảy lời gọi không ghim thuật toán là một phát hiện thật; và cả con số không cũng đáng ghi lại',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A grep tells you where to spend the next four hours; it does not tell you what is wrong. Reporting the raw hits as findings produces a document that reads as if everything is broken and gets dismissed; suppressing them until each is proven exploitable produces nothing at all and takes a week. Report what you measured and what you concluded, separately, so a reader can check both. The zero matters as much as the sevens — "no decode helper anywhere in the request path" is a real property of this codebase and worth recording, because a review that lists only problems is not a description of the system. Then order the work: things that are exploitable now and cheap to fix (the unpinned verifies, the Host-header URLs, the mass assignment) go first; structural gaps go on a quarterly list; and deliberate decisions get written down so nobody re-litigates them in six months.',
            'Một lệnh grep cho bạn biết nên tiêu bốn giờ tới ở đâu; nó không cho biết cái gì đang sai. Báo cáo các lượt khớp thô như những phát hiện sẽ cho ra một tài liệu đọc như thể mọi thứ đều hỏng, và rồi bị gạt đi; còn giấu chúng lại cho tới khi từng cái được chứng minh là khai thác được thì chẳng cho ra gì và tốn một tuần. Hãy báo cáo thứ bạn ĐO được và thứ bạn KẾT LUẬN, tách bạch, để người đọc kiểm được cả hai. Con số không quan trọng ngang mấy con số bảy — "không có chỗ nào dùng hàm decode trên đường đi của request" là một tính chất có thật của kho mã này và đáng ghi lại, vì một bản rà soát chỉ liệt kê vấn đề thì không phải là một mô tả về hệ thống. Rồi hãy sắp thứ tự công việc: những thứ khai thác được ngay và sửa rẻ (mấy lời gọi không ghim thuật toán, mấy chỗ dựng URL từ header Host, chỗ gán hàng loạt) đi trước; những khoảng trống về cấu trúc vào danh sách của quý; còn các quyết định CÓ CHỦ ĐÍCH thì ghi ra giấy để sáu tháng nữa không ai đem ra cãi lại.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q31 — Two bugs that need no broken cryptography (chapters 9 and 10).</b> The starter block gives you a tiny database whose only write is <code>db.updateMany(table, where, data)</code> — the condition lives <b>inside</b> the write and it returns the number of rows it changed — plus a deliberately slow password hash, one user row, one unused recovery code, and the list <code>EDITABLE</code>. Write four functions.</p><ul><li><code>pickEditable(body)</code> — return an object containing only the keys named in <code>EDITABLE</code> that are actually present. Anything that is not a plain object yields <code>{}</code>.</li><li><code>rejectedFields(body)</code> — the keys that were sent and refused, sorted. This is what turns silent stripping into something a reviewer and a client can both see.</li><li><code>updateProfile(userId, body)</code> — apply only the editable fields and return <code>{ ok, changed, refused }</code>, with <code>changed</code> sorted. When nothing editable was sent, return <code>{ ok: false, reason: \"nothing to update\", refused }</code> and write nothing. <code>role</code>, <code>tenantId</code>, <code>passwordHash</code> and <code>emailVerifiedAt</code> must be unreachable through this path — an allow-list, never a deny-list.</li><li><code>redeemRecoveryCode(userId, hash, newPassword)</code> — consume the code with a <b>conditional write</b>: the condition <code>{ userId, hash, used: false }</code> goes inside <code>updateMany</code>, and only the caller that sees a count of one proceeds to hash the new password and store it. Everybody else returns <code>{ ok: false, reason: \"invalid or used\" }</code> — the same answer for a spent code, a code that never existed and the right code presented by the wrong user.</li></ul><p>The harness fires five requests at the same recovery code with <code>Promise.all</code>. That race is the question: a version that reads the row, awaits the hash and then marks the code used passes a sequential test and lets all five through here.</p>",
            "<p><b>Câu 31 — Hai con lỗi chẳng cần phá vỡ mật mã nào (chương 9 và 10).</b> Khối đề cho sẵn một cơ sở dữ liệu tí hon mà lệnh ghi DUY NHẤT là <code>db.updateMany(bảng, where, data)</code> — điều kiện nằm <b>bên trong</b> lệnh ghi và nó trả về số hàng đã đổi — cộng thêm một phép băm mật khẩu cố ý làm chậm, một hàng người dùng, một mã khôi phục chưa dùng, và danh sách <code>EDITABLE</code>. Hãy viết bốn hàm.</p><ul><li><code>pickEditable(body)</code> — trả về một object chỉ chứa những khoá có tên trong <code>EDITABLE</code> và thật sự có mặt. Thứ gì không phải object thường thì cho ra <code>{}</code>.</li><li><code>rejectedFields(body)</code> — những khoá được gửi lên và bị từ chối, sắp xếp tăng dần. Đây là thứ biến việc lặng lẽ vứt bỏ thành thứ mà cả người review lẫn client đều nhìn thấy.</li><li><code>updateProfile(userId, body)</code> — chỉ áp các trường sửa được rồi trả về <code>{ ok, changed, refused }</code>, với <code>changed</code> đã sắp xếp. Khi không có trường sửa được nào được gửi thì trả <code>{ ok: false, reason: \"nothing to update\", refused }</code> và KHÔNG ghi gì. <code>role</code>, <code>tenantId</code>, <code>passwordHash</code> và <code>emailVerifiedAt</code> phải không với tới được qua đường này — danh sách CHO PHÉP, không bao giờ là danh sách CẤM.</li><li><code>redeemRecoveryCode(userId, hash, newPassword)</code> — tiêu thụ mã bằng một <b>lệnh ghi có điều kiện</b>: điều kiện <code>{ userId, hash, used: false }</code> nằm bên trong <code>updateMany</code>, và chỉ bên gọi nào thấy số hàng bằng một mới đi tiếp để băm mật khẩu mới rồi cất nó. Mọi bên còn lại trả <code>{ ok: false, reason: \"invalid or used\" }</code> — cùng một câu trả lời cho một mã đã tiêu, một mã chưa từng tồn tại, và đúng mã ấy nhưng do sai người trình ra.</li></ul><p>Khung chạy bắn năm request vào cùng một mã khôi phục bằng <code>Promise.all</code>. Chính cuộc đua đó là nội dung câu hỏi: một bản đọc hàng dữ liệu, chờ băm xong rồi mới đóng dấu là đã dùng sẽ QUA một bài kiểm tuần tự và cho lọt cả năm ở đây.</p>",
          ),
          language: 'javascript',
          starterCode: "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n'use strict';\nconst crypto = require('node:crypto');\n\n// Một \"cơ sở dữ liệu\" nhỏ. `updateMany` là thứ DUY NHẤT ghi được, và nó\n// nguyên tử: điều kiện nằm TRONG lệnh ghi, và nó trả về số hàng đã đổi.\nconst TABLES = { users: new Map(), recoveryCodes: new Map() };\n\nconst sleep = (ms) => new Promise((r) => setTimeout(r, ms));\n\nconst db = {\n  async findFirst(table, where) {\n    await sleep(1);                                   // một lượt đi mạng\n    for (const row of TABLES[table].values()) {\n      if (Object.entries(where).every(([k, v]) => row[k] === v)) return { ...row };\n    }\n    return null;\n  },\n  async updateMany(table, where, data) {\n    // KHÔNG await trước khi ghi: cả hàm này là một thao tác nguyên tử.\n    let count = 0;\n    for (const row of TABLES[table].values()) {\n      if (Object.entries(where).every(([k, v]) => row[k] === v)) {\n        Object.assign(row, data);\n        count++;\n      }\n    }\n    return { count };\n  },\n};\n\n// Một phép băm mật khẩu CHẬM, đúng như Argon2id trên máy thật. Nó là lý do\n// khoảng cách giữa \"đọc\" và \"ghi\" đủ rộng để năm request cùng lọt qua.\nconst slowHash = async (pw) => { await sleep(20); return 'h$' + crypto.createHash('sha256').update(pw).digest('hex').slice(0, 16); };\n\nTABLES.users.set('u_1', {\n  id: 'u_1', email: 'an@vidu.com', name: 'An', avatar: null,\n  role: 'MEMBER', tenantId: 't_acme', emailVerifiedAt: 1, passwordHash: 'h$cu',\n});\nTABLES.recoveryCodes.set('rc_1', { id: 'rc_1', userId: 'u_1', hash: 'BAM_CUA_MA_KHOI_PHUC', used: false });\n\nconst EDITABLE = ['name', 'avatar'];\n\n// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n\nfunction pickEditable(body) {\n  // TODO\n}\n\nfunction rejectedFields(body) {\n  // TODO\n}\n\nasync function updateProfile(userId, body) {\n  // TODO\n}\n\nasync function redeemRecoveryCode(userId, hash, newPassword) {\n  // TODO\n}\n\n// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\nconst P = (label, v) => console.log(String(label).padEnd(46) + v);\nconst user = () => TABLES.users.get('u_1');\n\nasync function main() {\n  console.log('== the profile update ==');\n  P('plain rename', JSON.stringify(await updateProfile('u_1', { name: 'An Nguyen' })));\n  P('name is now', user().name);\n  P('privilege escalation attempt',\n    JSON.stringify(await updateProfile('u_1', { name: 'An', role: 'ADMIN', tenantId: 't_globex' })));\n  P('role is still', user().role);\n  P('tenant is still', user().tenantId);\n  P('only forbidden fields', JSON.stringify(await updateProfile('u_1', { passwordHash: 'h$cua-toi', emailVerifiedAt: 1 })));\n  P('passwordHash is still', user().passwordHash);\n  P('a hostile shape', JSON.stringify(await updateProfile('u_1', null)));\n  P('an array', JSON.stringify(await updateProfile('u_1', ['name'])));\n\n  console.log('== one recovery code, five requests at once ==');\n  const results = await Promise.all(\n    [1, 2, 3, 4, 5].map((i) => redeemRecoveryCode('u_1', 'BAM_CUA_MA_KHOI_PHUC', 'mat-khau-moi-' + i)),\n  );\n  P('succeeded', results.filter((r) => r.ok).length);\n  P('refused', results.filter((r) => !r.ok).length);\n  P('every refusal says the same thing',\n    new Set(results.filter((r) => !r.ok).map((r) => r.reason)).size === 1);\n  P('the code is spent', TABLES.recoveryCodes.get('rc_1').used);\n  P('password changed exactly once', user().passwordHash.startsWith('h$'));\n\n  console.log('== and again, sequentially ==');\n  P('same code, sixth attempt',\n    JSON.stringify(await redeemRecoveryCode('u_1', 'BAM_CUA_MA_KHOI_PHUC', 'x')));\n  P('a code that never existed',\n    JSON.stringify(await redeemRecoveryCode('u_1', 'BAM_KHONG_CO_THAT', 'x')));\n  P('the right code, the wrong user',\n    JSON.stringify(await redeemRecoveryCode('u_2', 'BAM_CUA_MA_KHOI_PHUC', 'x')));\n}\nmain();\n",
          expectedOutput: "== the profile update ==\nplain rename                                  {\"ok\":true,\"changed\":[\"name\"],\"refused\":[]}\nname is now                                   An Nguyen\nprivilege escalation attempt                  {\"ok\":true,\"changed\":[\"name\"],\"refused\":[\"role\",\"tenantId\"]}\nrole is still                                 MEMBER\ntenant is still                               t_acme\nonly forbidden fields                         {\"ok\":false,\"reason\":\"nothing to update\",\"refused\":[\"emailVerifiedAt\",\"passwordHash\"]}\npasswordHash is still                         h$cu\na hostile shape                               {\"ok\":false,\"reason\":\"nothing to update\",\"refused\":[]}\nan array                                      {\"ok\":false,\"reason\":\"nothing to update\",\"refused\":[]}\n== one recovery code, five requests at once ==\nsucceeded                                     1\nrefused                                       4\nevery refusal says the same thing             true\nthe code is spent                             true\npassword changed exactly once                 true\n== and again, sequentially ==\nsame code, sixth attempt                      {\"ok\":false,\"reason\":\"invalid or used\"}\na code that never existed                     {\"ok\":false,\"reason\":\"invalid or used\"}\nthe right code, the wrong user                {\"ok\":false,\"reason\":\"invalid or used\"}",
          sampleSolution: "function pickEditable(body) {\n  const out = {};\n  if (body === null || typeof body !== 'object' || Array.isArray(body)) return out;\n  for (const field of EDITABLE) {\n    if (Object.prototype.hasOwnProperty.call(body, field)) out[field] = body[field];\n  }\n  return out;\n}\n\nfunction rejectedFields(body) {\n  if (body === null || typeof body !== 'object' || Array.isArray(body)) return [];\n  return Object.keys(body).filter((k) => !EDITABLE.includes(k)).sort();\n}\n\nasync function updateProfile(userId, body) {\n  const data = pickEditable(body);\n  const refused = rejectedFields(body);\n  if (Object.keys(data).length === 0) return { ok: false, reason: 'nothing to update', refused };\n  const { count } = await db.updateMany('users', { id: userId }, data);\n  return { ok: count === 1, changed: Object.keys(data).sort(), refused };\n}\n\nasync function redeemRecoveryCode(userId, hash, newPassword) {\n  // Điều kiện nằm TRONG lệnh ghi: đúng MỘT request nhận được count === 1.\n  const { count } = await db.updateMany(\n    'recoveryCodes',\n    { userId, hash, used: false },\n    { used: true },\n  );\n  if (count === 0) return { ok: false, reason: 'invalid or used' };\n\n  const passwordHash = await slowHash(newPassword);\n  await db.updateMany('users', { id: userId }, { passwordHash });\n  return { ok: true };\n}\n",
        }),

        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q32 — Rotating a signing key without logging everyone out (chapters 11 and 4).</b> The starter block gives you three clearly fake secrets under the ids <code>k1</code>, <code>k2</code> and <code>k3</code>, a clock in seconds, two lifetimes — a 15-minute access token and a 24-hour email link — and the two settings that make rotation possible: a <code>keyring</code> of ids that verify, and one <code>signingKid</code> that signs. Write five functions.</p><ul><li><code>signToken(payload, ttl)</code> — header <code>{ alg: \"HS256\", typ: \"JWT\", kid }</code> with the <b>current</b> signing id, payload plus <code>iat</code> and <code>exp</code>, signed with HMAC-SHA256 over <code>header.payload</code>.</li><li><code>verifyToken(token)</code> — return <code>\"ACCEPT kid=&lt;kid&gt;\"</code> or <code>\"REJECT &lt;reason&gt;\"</code> with one of <code>malformed</code>, <code>alg not allowed</code>, <code>unknown kid</code>, <code>bad signature</code>, <code>no exp</code>, <code>expired</code>. Pin the algorithm, look the <code>kid</code> up in the keyring by exact match and <b>never fall back to a default key</b>, and compare signatures with <code>crypto.timingSafeEqual</code> after settling the length.</li><li><code>publish(kid)</code> — add an id to the keyring. Refuse <code>no such key</code> for an id with no material and <code>already published</code> for one already there.</li><li><code>activate(kid)</code> — make it the signing id, and refuse with <code>not published</code> if it is not already in the keyring. That refusal is the whole point: signing with a key the verifiers do not have is an instant outage.</li><li><code>retire(kid)</code> — remove it, refusing <code>still signing with it</code> for the active id and <code>not published</code> for one that is absent.</li></ul><p>Keep the fixtures and the harness exactly as they are. Read the last two blocks of the output carefully: they retire the old key one hour after the flip, which is generous for a fifteen-minute access token and not nearly enough for the twenty-four-hour link the same key also signed.</p>",
            "<p><b>Câu 32 — Xoay một khoá ký mà không đá tất cả mọi người ra ngoài (chương 11 và 4).</b> Khối đề cho sẵn ba bí mật ghi rõ là GIẢ dưới các mã <code>k1</code>, <code>k2</code>, <code>k3</code>, một đồng hồ tính bằng giây, hai vòng đời — access token 15 phút và đường dẫn email 24 giờ — cùng hai cấu hình làm cho việc xoay khoá khả thi: một <code>keyring</code> gồm các mã khoá dùng để KIỂM, và một <code>signingKid</code> dùng để KÝ. Hãy viết năm hàm.</p><ul><li><code>signToken(payload, ttl)</code> — header <code>{ alg: \"HS256\", typ: \"JWT\", kid }</code> với mã khoá ký HIỆN TẠI, payload kèm <code>iat</code> và <code>exp</code>, ký bằng HMAC-SHA256 trên <code>header.payload</code>.</li><li><code>verifyToken(token)</code> — trả <code>\"ACCEPT kid=&lt;kid&gt;\"</code> hoặc <code>\"REJECT &lt;lý do&gt;\"</code> với một trong các lý do <code>malformed</code>, <code>alg not allowed</code>, <code>unknown kid</code>, <code>bad signature</code>, <code>no exp</code>, <code>expired</code>. Hãy ghim thuật toán, tra <code>kid</code> trong keyring theo khớp CHÍNH XÁC và <b>tuyệt đối không lùi về một khoá mặc định</b>, rồi so chữ ký bằng <code>crypto.timingSafeEqual</code> sau khi đã giải quyết chuyện độ dài.</li><li><code>publish(kid)</code> — thêm một mã khoá vào keyring. Từ chối với <code>no such key</code> nếu mã đó không có vật liệu khoá, và <code>already published</code> nếu nó đã nằm sẵn trong đó.</li><li><code>activate(kid)</code> — đặt nó làm mã khoá ký, và TỪ CHỐI với <code>not published</code> nếu nó chưa nằm trong keyring. Chính lời từ chối đó mới là điểm mấu chốt: ký bằng một khoá mà các bên kiểm chưa có là một cú sập tức thì.</li><li><code>retire(kid)</code> — gỡ nó ra, từ chối với <code>still signing with it</code> nếu đó là mã đang ký và <code>not published</code> nếu nó vốn không có mặt.</li></ul><p>Giữ nguyên phần dữ liệu cho sẵn và phần khung chạy. Hãy đọc kỹ hai khối cuối của kết quả: chúng rút khoá cũ đúng MỘT GIỜ sau lượt đổi, rộng rãi với một access token mười lăm phút và không đủ chút nào với cái đường dẫn hai mươi tư giờ mà cùng cái khoá ấy cũng đã ký.</p>",
          ),
          language: 'javascript',
          starterCode: "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n'use strict';\nconst crypto = require('node:crypto');\n\n// Ba bí mật GIẢ, chỉ tồn tại trong bài thi. Trên production chúng là 32 byte\n// từ CSPRNG, nằm trong kho bí mật, và không bao giờ nằm trong mã nguồn.\nconst MATERIAL = {\n  k1: 'BI-MAT-GIA-k1-cua-de-thi',\n  k2: 'BI-MAT-GIA-k2-cua-de-thi',\n  k3: 'BI-MAT-GIA-k3-cua-de-thi',\n};\n\nlet NOW = 1_800_000_000;              // đồng hồ giả, tính bằng GIÂY\nconst ACCESS_TTL = 900;               // access token: 15 phút\nconst LINK_TTL = 86_400;              // đường dẫn xác minh email: 24 giờ\n\n// Hai cấu hình TÁCH RỜI: một chùm khoá để KIỂM, một mã khoá để KÝ.\nconst state = { keyring: new Set(['k1']), signingKid: 'k1' };\n\nconst b64url = (obj) => Buffer.from(JSON.stringify(obj), 'utf8').toString('base64url');\n\n// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n\nfunction signToken(payload, ttl) {\n  // TODO\n}\n\nfunction verifyToken(token) {\n  // TODO\n}\n\nfunction publish(kid) {\n  // TODO\n}\n\nfunction activate(kid) {\n  // TODO\n}\n\nfunction retire(kid) {\n  // TODO\n}\n\n// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\nconst P = (label, v) => console.log(String(label).padEnd(40) + v);\nconst ring = () => '{ ' + [...state.keyring].join(', ' ) + ' }';\n\nconst oldAccess = signToken({ sub: 'u_1' }, ACCESS_TTL);\nconst oldLink = signToken({ sub: 'u_1', use: 'verify-email' }, LINK_TTL);\n\nconsole.log('== phase 0 · before the rotation ==');\nP('keyring / signing', ring() + '  signing=' + state.signingKid);\nP('a token minted now', verifyToken(signToken({ sub: 'u_1' }, ACCESS_TTL)));\nP('the access token from before', verifyToken(oldAccess));\n\nconsole.log('== the two mistakes, refused ==');\nP('activate k2 before publishing it', JSON.stringify(activate('k2')));\nP('signing kid is still', state.signingKid);\nP('retire the key we sign with', JSON.stringify(retire('k1')));\nP('publish a key that does not exist', JSON.stringify(publish('k9')));\n\nconsole.log('== phase 1 · publish k2, keep signing with k1 ==');\nP('publish', JSON.stringify(publish('k2')));\nP('keyring / signing', ring() + '  signing=' + state.signingKid);\nconst stillK1 = signToken({ sub: 'u_1' }, ACCESS_TTL);\nP('a token minted now', verifyToken(stillK1));\n\nconsole.log('== phase 2 · sign with k2 ==');\nP('activate', JSON.stringify(activate('k2')));\nP('keyring / signing', ring() + '  signing=' + state.signingKid);\nconst newAccess = signToken({ sub: 'u_1' }, ACCESS_TTL);\nP('a token minted now', verifyToken(newAccess));\nP('the k1 token still in flight', verifyToken(stillK1));\nP('the k1 verification link', verifyToken(oldLink));\n\nconsole.log('== phase 3a · retire k1 after one hour ==');\nNOW += 3600;\nP('the k1 access token', verifyToken(stillK1));\nP('the k1 verification link', verifyToken(oldLink));\nP('retire k1 now', JSON.stringify(retire('k1')));\nP('keyring', ring());\nP('the k1 verification link, again', verifyToken(oldLink));\nP('the k2 token', verifyToken(newAccess));\n\nconsole.log('== phase 3b · what the overlap should have been ==');\nP('link TTL in hours', LINK_TTL / 3600);\nP('access TTL in minutes', ACCESS_TTL / 60);\nP('waited before retiring (hours)', 1);\n",
          expectedOutput: "== phase 0 · before the rotation ==\nkeyring / signing                       { k1 }  signing=k1\na token minted now                      ACCEPT kid=k1\nthe access token from before            ACCEPT kid=k1\n== the two mistakes, refused ==\nactivate k2 before publishing it        {\"ok\":false,\"reason\":\"not published\"}\nsigning kid is still                    k1\nretire the key we sign with             {\"ok\":false,\"reason\":\"still signing with it\"}\npublish a key that does not exist       {\"ok\":false,\"reason\":\"no such key\"}\n== phase 1 · publish k2, keep signing with k1 ==\npublish                                 {\"ok\":true}\nkeyring / signing                       { k1, k2 }  signing=k1\na token minted now                      ACCEPT kid=k1\n== phase 2 · sign with k2 ==\nactivate                                {\"ok\":true}\nkeyring / signing                       { k1, k2 }  signing=k2\na token minted now                      ACCEPT kid=k2\nthe k1 token still in flight            ACCEPT kid=k1\nthe k1 verification link                ACCEPT kid=k1\n== phase 3a · retire k1 after one hour ==\nthe k1 access token                     REJECT expired\nthe k1 verification link                ACCEPT kid=k1\nretire k1 now                           {\"ok\":true}\nkeyring                                 { k2 }\nthe k1 verification link, again         REJECT unknown kid\nthe k2 token                            REJECT expired\n== phase 3b · what the overlap should have been ==\nlink TTL in hours                       24\naccess TTL in minutes                   15\nwaited before retiring (hours)          1",
          sampleSolution: "function signToken(payload, ttl) {\n  const kid = state.signingKid;\n  const header = { alg: 'HS256', typ: 'JWT', kid };\n  const body = { ...payload, iat: NOW, exp: NOW + ttl };\n  const input = b64url(header) + '.' + b64url(body);\n  const sig = crypto.createHmac('sha256', MATERIAL[kid]).update(input).digest('base64url');\n  return input + '.' + sig;\n}\n\nfunction verifyToken(token) {\n  const parts = String(token).split('.');\n  if (parts.length !== 3) return 'REJECT malformed';\n  let header;\n  try { header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8')); } catch { return 'REJECT malformed'; }\n  if (header.alg !== 'HS256') return 'REJECT alg not allowed';\n  const kid = header.kid;\n  if (typeof kid !== 'string' || !state.keyring.has(kid)) return 'REJECT unknown kid';\n\n  const expected = crypto.createHmac('sha256', MATERIAL[kid]).update(parts[0] + '.' + parts[1]).digest();\n  const got = Buffer.from(parts[2], 'base64url');\n  if (got.length !== expected.length || !crypto.timingSafeEqual(got, expected)) return 'REJECT bad signature';\n\n  let body;\n  try { body = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')); } catch { return 'REJECT malformed'; }\n  if (typeof body.exp !== 'number') return 'REJECT no exp';\n  if (NOW >= body.exp) return 'REJECT expired';\n  return 'ACCEPT kid=' + kid;\n}\n\nfunction publish(kid) {\n  if (!Object.prototype.hasOwnProperty.call(MATERIAL, kid)) return { ok: false, reason: 'no such key' };\n  if (state.keyring.has(kid)) return { ok: false, reason: 'already published' };\n  state.keyring.add(kid);\n  return { ok: true };\n}\n\nfunction activate(kid) {\n  if (!state.keyring.has(kid)) return { ok: false, reason: 'not published' };\n  state.signingKid = kid;\n  return { ok: true };\n}\n\nfunction retire(kid) {\n  if (kid === state.signingKid) return { ok: false, reason: 'still signing with it' };\n  if (!state.keyring.has(kid)) return { ok: false, reason: 'not published' };\n  state.keyring.delete(kid);\n  return { ok: true };\n}\n",
        }),
      ],
    },
  ],
};
