/**
 * Docker — Progress Test 3 (chương s09–s12).
 *
 * Đề tự soạn, bám sát `content/courses/docker/s09…s12`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI đoạn terminal trong đề đều CHẠY THẬT trên máy này, ngày 10/09/2026:
 *   Docker Engine 29.5.3 (client + server), API 1.54, Docker Desktop 4.78.0
 *   (229452), containerd v2.2.4, runc 1.3.5, BuildKit v0.30.0, buildx
 *   v0.34.1-desktop.1, Compose v5.1.4, node:22-alpine (Node v22.23.2) —
 *   nền tảng linux/arm64 trong máy ảo của Desktop, máy chủ macOS 25.6.0 /
 *   Apple M1 Max, 32 GiB RAM, 10 nhân.
 *
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (11.2) nói Node lấy cỡ heap từ RAM của MÁY CHỦ, và in ví dụ
 *     `heap cap: 2048MB` bên trong một container `-m 512m`. ĐO THẬT với Node
 *     v22.23.2: `-m 512m` → **259MB**, `-m 2g` → **1048MB**, không đặt trần →
 *     2096MB. Tức Node 22 CÓ đọc trần cgroup. Nhưng ở trần nhỏ thì nó chạm
 *     sàn: `-m 256m` vẫn ra **259MB**, tức heap được phép lớn HƠN cả container
 *     — chỗ đó mới là chỗ còn nguy hiểm, và câu 17 ra đúng theo số đo này.
 *   • Giáo trình (9.2 và quiz 9.6) nói YAML đọc `22:22` thành số hệ sáu mươi
 *     nên phải bọc nháy cho ánh xạ cổng. Compose v5.1.4 phân giải đúng thành
 *     `target: 22, published: "22"` (đã ghi trong `DOCKER-FE.mjs`), nên đề
 *     KHÔNG có câu nào dựa vào cái bẫy đó.
 *   • Giáo trình (12.3) in `127: /bin/sh: wget: not found` cho một healthcheck
 *     gọi nhầm chương trình. ĐO THẬT với `--health-cmd 'curl … || exit 1'`:
 *     `.State.Health.Log` ghi **ExitCode 1**, không phải 127, vì `|| exit 1`
 *     nuốt mất mã 127; phần chữ vẫn là `/bin/sh: curl: not found`. Câu 26 dùng
 *     đúng đoạn đo được, và hỏi vào phần chữ chứ không hỏi con số.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 8 · B 8 · C 7 · D 7.
 *   node -e "import('./content/exams/DOCKER-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DOCKER-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/docker-exam-kit.mjs';

export default {
  course: { slug: 'docker' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 9–12 (Compose, a real stack, production, diagnosis)',
        'Kiểm tra tiến độ 3 — Chương 9–12 (Compose, một stack thật, production, chẩn đoán)',
      ),
      description: B(
        'The last third of the Docker course: the compose file and the service reference, depends_on and healthchecks, variables, profiles and override files, a seven-service stack with a public and a private tier, the data tier, one image with three commands, Next.js and nginx, restart policies, limits and exit 137, log rotation, deploys and rollback, disk and monitoring, and a method for diagnosing a container that will not start, will not stay up, or only fails in CI. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Docker: file compose và bảng tra dịch vụ, depends_on và healthcheck, biến, profile và file ghi đè, một stack bảy dịch vụ với tầng công khai và tầng riêng, tầng dữ liệu, một ảnh ba câu lệnh, Next.js và nginx, chính sách khởi động lại, hạn mức và mã thoát 137, xoay vòng log, deploy và quay lui, đĩa và giám sát, cùng một phương pháp chẩn đoán khi container không khởi động, không trụ được, hoặc chỉ hỏng trong CI. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '9–12'),
      questions: [
        /* ── Chương 9 — Docker Compose (8 câu) ────────────────────────────── */

        // q1 · đáp án 1
        mcq({
          prompt: B(
            'Real output on this machine. What does the <code>migrate</code> line guarantee that a plain <code>depends_on: [db]</code> cannot?' + code(
              '$ docker compose up -d\n' +
              ' Container pt3demo-db-1 Waiting\n' +
              ' Container pt3demo-migrate-1 Waiting\n' +
              ' Container pt3demo-db-1 Healthy\n' +
              ' Container pt3demo-migrate-1 Exited\n' +
              ' Container pt3demo-api-1 Starting\n' +
              ' Container pt3demo-api-1 Started\n' +
              '\n' +
              "$ docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'\n" +
              'SERVICE   STATUS\n' +
              'api       Up Less than a second\n' +
              'db        Up 6 seconds (healthy)\n' +
              'migrate   Exited (0) Less than a second ago',
            ),
            'Output thật trên máy này. Dòng <code>migrate</code> bảo đảm được điều gì mà một <code>depends_on: [db]</code> trần không làm được?' + code(
              '$ docker compose up -d\n' +
              ' Container pt3demo-db-1 Waiting\n' +
              ' Container pt3demo-migrate-1 Waiting\n' +
              ' Container pt3demo-db-1 Healthy\n' +
              ' Container pt3demo-migrate-1 Exited\n' +
              ' Container pt3demo-api-1 Starting\n' +
              ' Container pt3demo-api-1 Started\n' +
              '\n' +
              "$ docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'\n" +
              'SERVICE   STATUS\n' +
              'api       Up Less than a second\n' +
              'db        Up 6 seconds (healthy)\n' +
              'migrate   Exited (0) Less than a second ago',
            ),
          ),
          options: [
            B(
              'That the migration container is restarted until it succeeds, because compose treats a job gated this way as retryable and keeps trying until the schema applies',
              'Rằng container migration được khởi động lại tới khi nó thành công, vì compose coi một công việc bị chốt kiểu này là thử-lại-được và cứ thử tới khi schema áp xong',
            ),
            B(
              'That the API cannot start until the migration has EXITED WITH 0 — <code>service_completed_successfully</code> waits for a job to finish, not for a service to be ready, so a failed migration aborts the <code>up</code> instead of producing an API running against a half-migrated schema',
              'Rằng API không thể khởi động cho tới khi migration đã THOÁT VỚI MÃ 0 — <code>service_completed_successfully</code> chờ một công việc CHẠY XONG chứ không chờ một dịch vụ sẵn sàng, nên một migration hỏng sẽ huỷ lệnh <code>up</code> thay vì sinh ra một API chạy trên schema mới di trú được một nửa',
            ),
            B(
              'That the migration runs inside the database container, which is why its status is <code>Exited (0)</code> while the database itself stays up and healthy',
              'Rằng migration chạy bên trong container cơ sở dữ liệu, và vì thế trạng thái của nó là <code>Exited (0)</code> trong khi bản thân cơ sở dữ liệu vẫn chạy và khoẻ',
            ),
            B(
              'That compose applies the migration itself using the schema files in the build context, so the container is only a placeholder recording that it happened',
              'Rằng chính compose áp migration bằng các file schema trong ngữ cảnh dựng, nên container chỉ là một chỗ giữ chỗ ghi lại rằng việc đó đã xảy ra',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Three conditions, three different guarantees. <code>service_started</code> (the default) says only that the container was created and started. <code>service_healthy</code> waits for the dependency\'s healthcheck to pass, and errors out if the dependency defines none. <code>service_completed_successfully</code> waits for an exit code of 0 — which is how migrations, seeds and one-off setup jobs slot into a stack correctly. Note the migration service must also carry <code>restart: "no"</code>, because exiting is its job.',
            'Ba điều kiện, ba bảo đảm khác nhau. <code>service_started</code> (mặc định) chỉ nói rằng container đã được tạo và khởi chạy. <code>service_healthy</code> chờ healthcheck của thứ phụ thuộc chạy đạt, và báo lỗi nếu thứ đó không khai healthcheck nào. <code>service_completed_successfully</code> chờ mã thoát bằng 0 — và đó là cách migration, seed cùng các công việc cài đặt một lần lắp đúng vào một stack. Để ý dịch vụ migration còn phải mang <code>restart: "no"</code>, vì thoát ra chính là việc của nó.',
          ),
        }),

        // q2 · đáp án 2
        mcq({
          prompt: B(
            'Real, verbatim, from a compose file whose <code>.env</code> was missing. Which syntax produced it, and why is it worth using?' + code(
              '$ docker compose config\n' +
              'error while interpolating services.db.environment.POSTGRES_PASSWORD:\n' +
              'required variable POSTGRES_PASSWORD is missing a value:\n' +
              'set POSTGRES_PASSWORD in .env',
            ),
            'Nguyên văn, chạy thật, từ một file compose thiếu <code>.env</code>. Cú pháp nào sinh ra nó, và vì sao đáng dùng?' + code(
              '$ docker compose config\n' +
              'error while interpolating services.db.environment.POSTGRES_PASSWORD:\n' +
              'required variable POSTGRES_PASSWORD is missing a value:\n' +
              'set POSTGRES_PASSWORD in .env',
            ),
          ),
          options: [
            B(
              '<code>${POSTGRES_PASSWORD:-set POSTGRES_PASSWORD in .env}</code> — the fallback text is used as the value and compose reports it as an error because it is not a valid password',
              '<code>${POSTGRES_PASSWORD:-set POSTGRES_PASSWORD in .env}</code> — phần chữ dự phòng được lấy làm giá trị và compose báo lỗi vì nó không phải một mật khẩu hợp lệ',
            ),
            B(
              '<code>${POSTGRES_PASSWORD}</code> alone — compose always fails on an unset variable, and the message after the colon comes from the service definition',
              'Riêng <code>${POSTGRES_PASSWORD}</code> — compose luôn hỏng khi một biến chưa được đặt, còn phần chữ sau dấu hai chấm đến từ định nghĩa dịch vụ',
            ),
            B(
              '<code>${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}</code> — the <code>:?</code> form fails loudly with your own message when the variable is unset or empty, which beats a container that starts with a superuser whose password is the empty string',
              '<code>${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD in .env}</code> — dạng <code>:?</code> hỏng thành tiếng kèm đúng thông báo của bạn khi biến chưa đặt hoặc rỗng, và như thế tốt hơn một container khởi động với siêu người dùng có mật khẩu là chuỗi rỗng',
            ),
            B(
              '<code>${POSTGRES_PASSWORD:+set POSTGRES_PASSWORD in .env}</code> — the <code>:+</code> form substitutes the alternate text only when the variable IS set, so an unset variable is reported instead',
              '<code>${POSTGRES_PASSWORD:+set POSTGRES_PASSWORD in .env}</code> — dạng <code>:+</code> chỉ thay bằng phần chữ thay thế khi biến ĐÃ được đặt, nên biến chưa đặt thì bị báo ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Without it, a plain <code>${VAR}</code> resolves to an empty string with a warning nobody reads, and one missing variable produces three downstream mysteries at once: an image reference with an empty tag (<code>invalid reference format</code>), a connection string with an empty password, and a database whose superuser has no password. Use <code>:-default</code> for optional values and <code>:?message</code> for required ones, and remember <code>docker compose config</code> shows the merged, interpolated truth in one command.',
            'Không có nó, một <code>${VAR}</code> trần ra chuỗi rỗng kèm một cảnh báo chẳng ai đọc, và một biến thiếu sinh ra ba bí ẩn phía sau cùng lúc: một tham chiếu ảnh có tag rỗng (<code>invalid reference format</code>), một chuỗi kết nối có mật khẩu rỗng, và một cơ sở dữ liệu mà siêu người dùng không có mật khẩu. Hãy dùng <code>:-mặc định</code> cho giá trị tuỳ chọn và <code>:?thông báo</code> cho giá trị bắt buộc, và nhớ rằng <code>docker compose config</code> cho thấy sự thật đã hợp nhất và đã thay biến chỉ trong một lệnh.',
          ),
        }),

        // q3 · đáp án 3
        mcq({
          prompt: B(
            'Measured. The compose file declares <code>name: pt3demo</code>, a network called <code>private</code> and a volume called <code>pgdata</code>. What is the prefix, and what breaks without it?' + code(
              '$ docker compose config\n' +
              'name: pt3demo\n' +
              '      POSTGRES_PASSWORD: secret\n' +
              '    name: pt3demo_private\n' +
              '    internal: true\n' +
              '    name: pt3demo_pgdata',
            ),
            'Đo thật. File compose khai <code>name: pt3demo</code>, một mạng tên <code>private</code> và một volume tên <code>pgdata</code>. Tiền tố đó là gì, và không có nó thì hỏng chuyện gì?' + code(
              '$ docker compose config\n' +
              'name: pt3demo\n' +
              '      POSTGRES_PASSWORD: secret\n' +
              '    name: pt3demo_private\n' +
              '    internal: true\n' +
              '    name: pt3demo_pgdata',
            ),
          ),
          options: [
            B(
              'It is the name of the default network, which compose reuses as a prefix so that services can resolve each other by their fully qualified names rather than by the short service name',
              'Đó là tên của mạng mặc định, được compose dùng lại làm tiền tố để các dịch vụ phân giải nhau bằng tên đầy đủ thay vì bằng tên dịch vụ ngắn',
            ),
            B(
              'It is a hash of the compose file contents, so editing the file produces a new prefix and a clean set of resources on the next <code>up</code>',
              'Đó là một mã băm của nội dung file compose, nên sửa file là ra một tiền tố mới và một bộ tài nguyên sạch ở lần <code>up</code> kế tiếp',
            ),
            B(
              'It is the Docker context name, which is why the same stack gets different resource names on a laptop and on a remote engine reached over SSH',
              'Đó là tên của Docker context, và vì thế cùng một stack có tên tài nguyên khác nhau trên laptop và trên một engine ở xa nối qua SSH',
            ),
            B(
              'It is the PROJECT NAME — the directory name unless a top-level <code>name:</code> says otherwise — and it namespaces every container, network and volume. Rename or move the directory without setting <code>name:</code> and compose starts a SECOND stack with new empty volumes, so the data appears to have vanished',
              'Đó là TÊN DỰ ÁN — tên thư mục, trừ khi có khoá <code>name:</code> ở mức cao nhất — và nó gắn không gian tên cho mọi container, mạng và volume. Đổi tên hay dời thư mục mà không đặt <code>name:</code> thì compose dựng lên một stack THỨ HAI với volume mới còn rỗng, nên dữ liệu trông như đã bốc hơi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The namespacing is what makes two copies of the same stack run side by side on one machine without touching each other, and it is also why <code>docker compose down -v</code> can find exactly the volumes belonging to this project and leave your other stacks alone. Set <code>name:</code> explicitly in any file that matters — the alternative is a stack whose identity depends on a directory name somebody may rename for tidiness.',
            'Việc gắn không gian tên đó là thứ khiến hai bản của cùng một stack chạy cạnh nhau trên một máy mà không đụng nhau, và cũng là lý do <code>docker compose down -v</code> tìm được đúng những volume thuộc dự án này mà để yên các stack khác. Hãy đặt <code>name:</code> tường minh trong mọi file quan trọng — nếu không thì danh tính của cả stack phụ thuộc vào một cái tên thư mục mà ai đó có thể đổi cho gọn.',
          ),
        }),

        // q4 · đáp án 0
        mcq({
          prompt: B(
            'Measured. A base file and an override, merged by <code>docker compose config</code>. Three fields, three different behaviours — which sentence describes all three?' + code(
              '# base                          # compose.override.yaml\n' +
              'command: ["sleep","300"]        command: ["sleep","600"]\n' +
              'ports:  ["18201:3000"]          ports:  ["18202:3000"]\n' +
              'environment:                    environment:\n' +
              '  NODE_ENV: production            NODE_ENV: development\n' +
              '  KEEP_ME: "yes"\n' +
              '\n' +
              '# merged result\n' +
              'command: [sleep, "600"]\n' +
              'environment: { KEEP_ME: "yes", NODE_ENV: development }\n' +
              'ports: [ {published: "18201", target: 3000}, {published: "18202", target: 3000} ]',
            ),
            'Đo thật. Một file nền và một file ghi đè, hợp nhất bằng <code>docker compose config</code>. Ba trường, ba hành vi khác nhau — câu nào mô tả đúng cả ba?' + code(
              '# nền                           # compose.override.yaml\n' +
              'command: ["sleep","300"]        command: ["sleep","600"]\n' +
              'ports:  ["18201:3000"]          ports:  ["18202:3000"]\n' +
              'environment:                    environment:\n' +
              '  NODE_ENV: production            NODE_ENV: development\n' +
              '  KEEP_ME: "yes"\n' +
              '\n' +
              '# kết quả hợp nhất\n' +
              'command: [sleep, "600"]\n' +
              'environment: { KEEP_ME: "yes", NODE_ENV: development }\n' +
              'ports: [ {published: "18201", target: 3000}, {published: "18202", target: 3000} ]',
            ),
          ),
          options: [
            B(
              'Scalars are REPLACED (command), maps are MERGED key by key (environment, so KEEP_ME survives), and sequences are APPENDED (ports, so both mappings exist) — <code>!override</code> and <code>!reset</code> are the escape hatches when appending is wrong',
              'Giá trị đơn thì bị THAY (command), map thì HỢP NHẤT theo từng khoá (environment, nên KEEP_ME sống sót), còn dãy thì NỐI THÊM (ports, nên cả hai ánh xạ đều tồn tại) — <code>!override</code> và <code>!reset</code> là lối thoát khi nối thêm là sai',
            ),
            B(
              'The later file always wins outright for every field type, and <code>KEEP_ME</code> survives only because the override happens not to declare an <code>environment</code> key with that exact name',
              'File đứng sau luôn thắng dứt khoát với mọi kiểu trường, còn <code>KEEP_ME</code> sống sót chỉ vì file ghi đè tình cờ không khai một khoá <code>environment</code> đúng tên đó',
            ),
            B(
              'Compose merges anything it can parse as a list and replaces anything it can parse as a mapping, which is why <code>environment</code> kept one value from each side and <code>ports</code> kept only the newer one',
              'Compose hợp nhất mọi thứ nó phân tích được thành danh sách và thay mọi thứ nó phân tích được thành ánh xạ, và vì thế <code>environment</code> giữ một giá trị từ mỗi phía còn <code>ports</code> chỉ giữ cái mới hơn',
            ),
            B(
              'The order of the files decides everything: the first file supplies defaults and the second supplies the whole service, so any key absent from the override is dropped from the merged result entirely',
              'Thứ tự các file quyết định tất cả: file đầu cung cấp giá trị mặc định còn file sau cung cấp trọn dịch vụ, nên khoá nào vắng mặt trong file ghi đè thì bị loại hẳn khỏi kết quả hợp nhất',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The appending rule is the one that surprises people, and here it was harmless only because the two host ports differ. Publish the SAME host port in both layers and you get two identical mappings and a bind error at <code>up</code> — or worse, a second volume at the same target that silently shadows the first. Keep lists in exactly one layer where you can, and when a merged file surprises you, do not reason about it: run <code>docker compose -f a.yaml -f b.yaml config</code> and read what compose actually produced.',
            'Quy tắc nối thêm mới là quy tắc làm người ta bất ngờ, và ở đây nó vô hại chỉ vì hai cổng máy chủ khác nhau. Hãy công bố CÙNG một cổng máy chủ ở cả hai lớp là bạn có hai ánh xạ y hệt nhau và một lỗi bind lúc <code>up</code> — hoặc tệ hơn, một volume thứ hai ở cùng một đích lặng lẽ che mất cái thứ nhất. Hãy giữ các danh sách ở đúng một lớp khi có thể, và khi một file hợp nhất làm bạn bất ngờ thì đừng ngồi suy luận: chạy <code>docker compose -f a.yaml -f b.yaml config</code> và đọc thứ compose thật sự sinh ra.',
          ),
        }),

        // q5 · đáp án 1
        mcq({
          prompt: B(
            'The same directory, the same two files, measured back to back. Why does the second command lose the override?' + code(
              '$ docker compose config          # compose.yaml + compose.override.yaml\n' +
              '  command: [sleep, "600"]\n' +
              '  environment: { KEEP_ME: "yes", NODE_ENV: development }\n' +
              '\n' +
              '$ docker compose -f compose.yaml config\n' +
              '  command: [sleep, "300"]\n' +
              '  environment: { KEEP_ME: "yes", NODE_ENV: production }',
            ),
            'Cùng thư mục, cùng hai file, đo liền nhau. Vì sao lệnh thứ hai mất phần ghi đè?' + code(
              '$ docker compose config          # compose.yaml + compose.override.yaml\n' +
              '  command: [sleep, "600"]\n' +
              '  environment: { KEEP_ME: "yes", NODE_ENV: development }\n' +
              '\n' +
              '$ docker compose -f compose.yaml config\n' +
              '  command: [sleep, "300"]\n' +
              '  environment: { KEEP_ME: "yes", NODE_ENV: production }',
            ),
          ),
          options: [
            B(
              'A file passed with <code>-f</code> is parsed in strict mode, and the override contains development-only keys that strict mode discards silently',
              'Một file truyền bằng <code>-f</code> được phân tích ở chế độ nghiêm, và file ghi đè chứa những khoá chỉ dành cho môi trường phát triển mà chế độ nghiêm lặng lẽ vứt bỏ',
            ),
            B(
              '<code>compose.override.yaml</code> is loaded AUTOMATICALLY only when no <code>-f</code> is given; the moment you list files explicitly, you list every file you want — which is exactly what a deploy script needs, so a developer\'s local override can never reach the server',
              '<code>compose.override.yaml</code> chỉ được nạp TỰ ĐỘNG khi không có <code>-f</code> nào; hễ bạn liệt kê file tường minh là bạn phải liệt kê mọi file bạn cần — và đó đúng là thứ một script deploy cần, để file ghi đè trên máy của một lập trình viên không bao giờ lên tới máy chủ',
            ),
            B(
              'The override file is only read when the project name is taken from the directory, and passing <code>-f</code> makes compose derive the project name from the file path instead',
              'File ghi đè chỉ được đọc khi tên dự án lấy từ tên thư mục, còn truyền <code>-f</code> khiến compose lấy tên dự án từ đường dẫn file',
            ),
            B(
              'Overrides apply to <code>up</code> and <code>run</code> but never to <code>config</code>, which by design prints the base file so that a reviewer sees the committed version',
              'File ghi đè có tác dụng với <code>up</code> và <code>run</code> nhưng không bao giờ với <code>config</code>, vì lệnh này cố ý in ra file nền để người duyệt thấy đúng bản đã commit',
            ),
          ],
          correct: 1,
          explanation: EX(
            'That gives you the ideal split with no flags at all: <code>docker compose up</code> on a developer\'s machine picks up build, bind mounts, hot reload and a debugger port, while the deploy script runs <code>docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build</code> and gets exactly the two files it named. Verify the combination the server will use before deploying it — <code>config</code> on that exact pair costs a second and shows you what will really run.',
            'Cách đó cho bạn kiểu tách lý tưởng mà không cần cờ nào: <code>docker compose up</code> trên máy lập trình viên lấy phần dựng, bind mount, nạp nóng và cổng gỡ lỗi, còn script deploy chạy <code>docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build</code> và nhận đúng hai file nó gọi tên. Hãy kiểm chính tổ hợp mà máy chủ sẽ dùng trước khi deploy — chạy <code>config</code> trên đúng cặp đó tốn một giây và cho thấy thứ sẽ thật sự chạy.',
          ),
        }),

        // q6 · đáp án 2
        mcq({
          prompt: B(
            'Measured. The file declares two services; one has <code>profiles: [tools]</code>. What do the three results tell you?' + code(
              '$ docker compose config --services\n' +
              'api\n' +
              '\n' +
              '$ docker compose --profile tools config --services\n' +
              'adminer\n' +
              'api\n' +
              '\n' +
              '$ docker compose config --profiles\n' +
              'tools',
            ),
            'Đo thật. File khai hai dịch vụ; một cái có <code>profiles: [tools]</code>. Ba kết quả đó nói lên điều gì?' + code(
              '$ docker compose config --services\n' +
              'api\n' +
              '\n' +
              '$ docker compose --profile tools config --services\n' +
              'adminer\n' +
              'api\n' +
              '\n' +
              '$ docker compose config --profiles\n' +
              'tools',
            ),
          ),
          options: [
            B(
              'A profiled service is defined but not validated until its profile is enabled, so <code>config</code> hides it to avoid reporting errors in a block nobody asked for',
              'Một dịch vụ có profile thì được định nghĩa nhưng chưa được kiểm cho tới khi profile của nó được bật, nên <code>config</code> giấu nó đi để khỏi báo lỗi trong một khối chẳng ai yêu cầu',
            ),
            B(
              'Profiles are an alternative to override files: enabling one replaces the default set of services rather than adding to it, which is why <code>api</code> disappears from other profiles',
              'Profile là một lựa chọn thay cho file ghi đè: bật một profile là THAY bộ dịch vụ mặc định chứ không phải thêm vào, và vì thế <code>api</code> biến mất khỏi các profile khác',
            ),
            B(
              'A service with no <code>profiles</code> key runs under every profile and is the core of the stack; a profiled one is off unless asked for — and <code>docker compose run --rm seed</code> starts a profiled service without enabling its profile at all, which is the natural way to invoke a one-off job',
              'Một dịch vụ không có khoá <code>profiles</code> thì chạy dưới mọi profile và là phần lõi của stack; dịch vụ có profile thì tắt trừ khi được gọi — và <code>docker compose run --rm seed</code> khởi chạy một dịch vụ có profile mà không hề bật profile của nó, đó là cách tự nhiên để gọi một công việc chạy một lần',
            ),
            B(
              'The third command lists the profiles that are currently enabled in this shell, so <code>tools</code> is already active and the first command simply filtered it out by name',
              'Lệnh thứ ba liệt kê những profile đang được bật trong shell này, nên <code>tools</code> đã hoạt động rồi và lệnh đầu chỉ lọc nó ra theo tên',
            ),
          ],
          correct: 2,
          explanation: EX(
            'One file can then describe debug tools, a mail catcher, a metrics stack and a seed job alongside the core services, with only the core running by default — better than a second file that drifts out of sync. Two details: a service can list several profiles (<code>profiles: [debug, ci]</code>, or <code>COMPOSE_PROFILES=tools,debug</code>), and a non-profiled service that <code>depends_on</code> a profiled one fails unless that profile is on or the dependency is marked <code>required: false</code>.',
            'Khi đó một file mô tả được cả công cụ gỡ lỗi, một cái bẫy thư, một bộ đo lường và một công việc seed nằm cạnh các dịch vụ lõi, mà mặc định chỉ phần lõi chạy — tốt hơn hẳn một file thứ hai rồi trôi dạt khỏi file kia. Hai chi tiết: một dịch vụ liệt kê được nhiều profile (<code>profiles: [debug, ci]</code>, hoặc <code>COMPOSE_PROFILES=tools,debug</code>), và một dịch vụ không có profile mà <code>depends_on</code> một dịch vụ có profile thì hỏng, trừ khi profile đó đang bật hoặc phụ thuộc đó được đánh dấu <code>required: false</code>.',
          ),
        }),

        // q7 · đáp án 3
        mcq({
          prompt: B(
            'Four healthcheck fields. Which one is most often omitted, and what does omitting it cost?' + code(
              'healthcheck:\n' +
              '  test: ["CMD-SHELL", "pg_isready -U postgres -d demo"]\n' +
              '  interval: 5s\n' +
              '  timeout: 3s\n' +
              '  retries: 10\n' +
              '  start_period: 30s',
            ),
            'Bốn trường của healthcheck. Trường nào hay bị bỏ sót nhất, và bỏ sót nó thì mất gì?' + code(
              'healthcheck:\n' +
              '  test: ["CMD-SHELL", "pg_isready -U postgres -d demo"]\n' +
              '  interval: 5s\n' +
              '  timeout: 3s\n' +
              '  retries: 10\n' +
              '  start_period: 30s',
            ),
          ),
          options: [
            B(
              '<code>timeout</code>. Without it a check that hangs blocks the container\'s own start-up, so a slow dependency freezes the whole service instead of merely delaying it',
              '<code>timeout</code>. Không có nó thì một phép kiểm bị treo sẽ chặn luôn quá trình khởi động của container, nên một phụ thuộc chậm làm đông cứng cả dịch vụ chứ không chỉ làm nó trễ',
            ),
            B(
              '<code>retries</code>. Without it a single transient failure marks the container unhealthy immediately, and any dependent service waiting on <code>service_healthy</code> gives up at once',
              '<code>retries</code>. Không có nó thì một lần hỏng thoáng qua cũng đánh dấu container là không khoẻ ngay lập tức, và mọi dịch vụ đang chờ <code>service_healthy</code> bỏ cuộc tức thì',
            ),
            B(
              '<code>interval</code>. Without it the check runs once at start and never again, so a service that dies later stays marked healthy for the rest of its life',
              '<code>interval</code>. Không có nó thì phép kiểm chạy đúng một lần lúc khởi động rồi thôi, nên một dịch vụ chết về sau vẫn bị đánh dấu là khoẻ tới hết đời',
            ),
            B(
              '<code>start_period</code>. It is a grace window during which failing checks do NOT count — without it a slow-starting service (a JVM, a database running <code>initdb</code>, a Next.js server) is marked unhealthy while it is still legitimately booting, and anything gated on it never starts',
              '<code>start_period</code>. Đó là cửa sổ ân hạn mà trong đó phép kiểm hỏng KHÔNG bị tính — không có nó thì một dịch vụ khởi động chậm (một JVM, một cơ sở dữ liệu đang chạy <code>initdb</code>, một máy chủ Next.js) bị đánh dấu không khoẻ trong khi nó vẫn đang khởi động một cách chính đáng, và thứ nào bị chốt theo nó thì không bao giờ khởi chạy',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The related habit is to check that the check can run at all inside that image — a healthcheck calling a binary the image does not ship fails forever while the application is perfectly fine. And a healthcheck is not a <code>sleep</code>: it polls, so it returns as soon as the service is genuinely ready and keeps waiting when it is not, and unlike a sleep it keeps reporting afterwards, which is the signal restart policies and monitoring are built on.',
            'Thói quen đi kèm là kiểm xem phép kiểm có chạy nổi bên trong cái ảnh đó không — một healthcheck gọi một chương trình mà ảnh không giao thì hỏng mãi mãi trong khi ứng dụng hoàn toàn ổn. Và healthcheck không phải một lệnh <code>sleep</code>: nó dò liên tục nên trả về ngay khi dịch vụ thật sự sẵn sàng và cứ chờ tiếp khi chưa, còn khác với sleep là nó tiếp tục báo cáo về sau — đó chính là tín hiệu mà chính sách khởi động lại và giám sát dựa vào.',
          ),
        }),

        // q8 · đáp án 0
        mcq({
          prompt: B(
            'A value in a running stack is not what the file appears to say. Which command settles it, and what is the one caution?',
            'Một giá trị trong stack đang chạy không giống thứ file có vẻ nói. Lệnh nào dẹp được tranh cãi, và điều cần dè chừng duy nhất là gì?',
          ),
          options: [
            B(
              '<code>docker compose config</code> — it prints the fully merged, fully interpolated file that compose will actually act on, with every override applied and every short syntax expanded, and it validates the YAML while it is at it. The caution: it prints secrets in full',
              '<code>docker compose config</code> — nó in ra file đã hợp nhất trọn vẹn và thay biến trọn vẹn, tức thứ compose sẽ thật sự dùng, với mọi phần ghi đè đã áp và mọi cú pháp ngắn đã khai triển, và tiện thể kiểm luôn tính hợp lệ của YAML. Điều cần dè chừng: nó in bí mật ra đầy đủ',
            ),
            B(
              '<code>docker compose ps --format json</code> — it reports the effective configuration of each running container, which is the only view that accounts for values a container computed for itself at start-up',
              '<code>docker compose ps --format json</code> — nó báo cấu hình có hiệu lực của từng container đang chạy, và đó là góc nhìn duy nhất tính được cả những giá trị mà container tự tính ra lúc khởi động',
            ),
            B(
              '<code>docker compose logs --tail 0 -f</code> — compose emits the resolved configuration of every service as its first log line, so following the logs from a fresh start shows the values in use',
              '<code>docker compose logs --tail 0 -f</code> — compose phát ra cấu hình đã phân giải của mọi dịch vụ ở dòng log đầu tiên, nên theo dõi log từ một lần khởi động mới sẽ thấy các giá trị đang dùng',
            ),
            B(
              '<code>docker compose build --dry-run</code> — it resolves the file the same way a build would and reports the values without creating any container, which is why it is safe on a production host',
              '<code>docker compose build --dry-run</code> — nó phân giải file y như một lượt dựng và báo lại các giá trị mà không tạo container nào, và vì thế nó an toàn trên một máy chủ production',
            ),
          ],
          correct: 0,
          explanation: EX(
            'It answers three different questions at once: which override actually won, what a <code>${VAR}</code> resolved to, and whether the file is valid at all. <code>--no-interpolate</code> shows the file before substitution, <code>--services</code> and <code>--profiles</code> list what is defined, and <code>--format json</code> makes it scriptable. Because it prints secrets, treat its output the way you would treat <code>docker inspect</code> output — never paste it into a chat.',
            'Nó trả lời ba câu hỏi khác nhau cùng lúc: phần ghi đè nào thật sự thắng, một <code>${VAR}</code> đã ra giá trị gì, và file có hợp lệ hay không. Cờ <code>--no-interpolate</code> cho thấy file trước khi thay biến, <code>--services</code> và <code>--profiles</code> liệt kê những gì đã định nghĩa, còn <code>--format json</code> khiến nó viết script được. Vì nó in cả bí mật, hãy đối xử với output của nó như với output của <code>docker inspect</code> — đừng bao giờ dán vào một khung chat.',
          ),
        }),

        /* ── Chương 10 — một stack thật (8 câu) ───────────────────────────── */

        // q9 · đáp án 1
        mcq({
          prompt: B(
            'Three services in the stack share one image and differ only in <code>command</code>. What does that buy, beyond disk space?' + code(
              'api:     image: ghcr.io/me/api:${TAG}    # CMD: node dist/index.js\n' +
              'worker:  image: ghcr.io/me/api:${TAG}    command: ["node","dist/worker.js"]\n' +
              'migrate: image: ghcr.io/me/api:${TAG}    command: ["npx","prisma","migrate","deploy"]',
            ),
            'Ba dịch vụ trong stack dùng chung một ảnh và chỉ khác nhau ở <code>command</code>. Ngoài chỗ trống trên đĩa, cách đó được lợi gì?' + code(
              'api:     image: ghcr.io/me/api:${TAG}    # CMD: node dist/index.js\n' +
              'worker:  image: ghcr.io/me/api:${TAG}    command: ["node","dist/worker.js"]\n' +
              'migrate: image: ghcr.io/me/api:${TAG}    command: ["npx","prisma","migrate","deploy"]',
            ),
          ),
          options: [
            B(
              'Compose can then start all three from a single container, so the worker and the migration share the API\'s process table and its open database connections',
              'Compose khi đó khởi chạy được cả ba từ một container duy nhất, nên worker và migration dùng chung bảng tiến trình và các kết nối cơ sở dữ liệu đang mở của API',
            ),
            B(
              'One build, one thing to scan and patch, and a guarantee that the worker cannot be running last week\'s code — only <code>command</code> differs, so the three roles cannot drift apart between deploys',
              'Một lượt dựng, một thứ để quét và vá, và một bảo đảm rằng worker không thể đang chạy mã của tuần trước — chỉ <code>command</code> khác nhau, nên ba vai trò không thể trôi dạt khỏi nhau giữa các lượt deploy',
            ),
            B(
              'The image layers are deduplicated on the host, which is the only way three services can be pulled in parallel without exhausting the registry rate limit',
              'Các tầng của ảnh được khử trùng lặp trên máy chủ, và đó là cách duy nhất để ba dịch vụ được kéo về song song mà không cạn hạn mức tần suất của registry',
            ),
            B(
              'Compose can restart the three together as one unit, so a failed migration automatically takes the API and the worker down with it',
              'Compose khởi động lại được cả ba như một khối, nên một migration hỏng sẽ tự động kéo API và worker chết theo',
            ),
          ],
          correct: 1,
          explanation: EX(
            'It is a correctness property, not an optimisation. Two images built at different moments from "the same" repository can differ — a dependency resolved differently, a base image that moved — and then the worker processes jobs with code the API does not have. One artifact, tagged by commit, removes the possibility. The same reasoning is why the seed job is the same image behind a profile rather than a separate script somebody runs from their laptop.',
            'Đó là một tính chất về tính ĐÚNG chứ không phải một phép tối ưu. Hai cái ảnh dựng ở hai thời điểm khác nhau từ "cùng một" kho vẫn có thể khác nhau — một thư viện giải phụ thuộc khác đi, một ảnh nền đã dịch chuyển — và thế là worker xử lý công việc bằng mã mà API không có. Một hiện vật duy nhất, gắn tag theo commit, xoá bỏ khả năng đó. Cũng lý lẽ ấy là vì sao công việc seed dùng chính cái ảnh đó nấp sau một profile, thay vì là một script ai đó chạy từ laptop.',
          ),
        }),

        // q10 · đáp án 2
        mcq({
          prompt: B(
            'A team runs <code>prisma migrate deploy</code> from the API container\'s entrypoint instead of a separate service. Which pair of failures does that invite?',
            'Một nhóm chạy <code>prisma migrate deploy</code> từ entrypoint của container API thay vì một dịch vụ riêng. Cách đó mời gọi cặp lỗi nào?',
          ),
          options: [
            B(
              'The entrypoint runs before the network is attached, so the migration cannot resolve the database name; and it runs as root, so the schema ends up owned by the wrong role',
              'Entrypoint chạy trước khi mạng được gắn nên migration không phân giải được tên cơ sở dữ liệu; và nó chạy bằng root nên schema rốt cuộc thuộc quyền một vai sai',
            ),
            B(
              'Compose cannot apply a restart policy to a container whose entrypoint exits, so the API can never come back after a crash; and the migration output is discarded because it happens before logging starts',
              'Compose không áp được chính sách khởi động lại cho một container có entrypoint thoát ra, nên API không bao giờ trở lại sau một lần sập; và output của migration bị vứt vì nó xảy ra trước khi việc ghi log bắt đầu',
            ),
            B(
              'Every API replica races to apply the same migration (an advisory lock USUALLY saves you); and a failed migration becomes a crash-looping API rather than a clear stop — the container restarts, retries, fails again, and the deploy reports success while the logs fill with one repeated error',
              'Mọi bản sao API đua nhau áp cùng một migration (một khoá tư vấn THƯỜNG thì cứu được bạn); và một migration hỏng biến thành một API quay vòng sập thay vì một điểm dừng rõ ràng — container khởi động lại, thử lại, hỏng tiếp, còn lượt deploy thì báo thành công trong khi log đầy một lỗi lặp đi lặp lại',
            ),
            B(
              'The migration inherits the API\'s memory limit and is OOM-killed on a large schema change; and Prisma refuses to run <code>migrate deploy</code> from a process that also opens an HTTP listener',
              'Migration thừa hưởng trần bộ nhớ của API rồi bị OOM giết khi thay đổi schema lớn; và Prisma từ chối chạy <code>migrate deploy</code> từ một tiến trình cũng mở một cổng nghe HTTP',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A dedicated <code>migrate</code> service with <code>restart: "no"</code> and <code>condition: service_completed_successfully</code> gives you one run, one clear exit code, and a deploy that stops when the schema change fails. Note also which migration command belongs in a container: <code>migrate deploy</code> applies pending migrations and never creates or resets anything, while <code>migrate dev</code> needs a shadow database and is a developer command.',
            'Một dịch vụ <code>migrate</code> riêng với <code>restart: "no"</code> và <code>condition: service_completed_successfully</code> cho bạn một lượt chạy, một mã thoát rõ ràng, và một lượt deploy dừng lại khi thay đổi schema hỏng. Cũng lưu ý lệnh migration nào mới thuộc về một container: <code>migrate deploy</code> áp những migration còn treo và không bao giờ tạo hay đặt lại thứ gì, còn <code>migrate dev</code> cần một cơ sở dữ liệu bóng và là lệnh dành cho lập trình viên.',
          ),
        }),

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'A new SQL file is added to the mounted init directory and the stack is redeployed. The extension never appears in the existing database. Why?' + code(
              'volumes:\n' +
              '  - pgdata:/var/lib/postgresql/data\n' +
              '  - ./ops/postgres-init:/docker-entrypoint-initdb.d:ro\n' +
              '\n' +
              '# ops/postgres-init/01-extensions.sql\n' +
              'CREATE EXTENSION IF NOT EXISTS pg_trgm;\n' +
              'CREATE EXTENSION IF NOT EXISTS unaccent;    &lt;- added today',
            ),
            'Một file SQL mới được thêm vào thư mục khởi tạo đang gắn và stack được deploy lại. Extension đó chẳng bao giờ xuất hiện trong cơ sở dữ liệu đang có. Vì sao?' + code(
              'volumes:\n' +
              '  - pgdata:/var/lib/postgresql/data\n' +
              '  - ./ops/postgres-init:/docker-entrypoint-initdb.d:ro\n' +
              '\n' +
              '# ops/postgres-init/01-extensions.sql\n' +
              'CREATE EXTENSION IF NOT EXISTS pg_trgm;\n' +
              'CREATE EXTENSION IF NOT EXISTS unaccent;    &lt;- thêm hôm nay',
            ),
          ),
          options: [
            B(
              'The directory is mounted read-only, so the entrypoint cannot mark the script as executed and skips it defensively on every start after the first',
              'Thư mục được gắn ở chế độ chỉ-đọc nên entrypoint không đánh dấu được là script đã chạy, và nó bỏ qua một cách phòng thủ ở mọi lần khởi động sau lần đầu',
            ),
            B(
              'Scripts in that directory run in alphabetical order and stop at the first statement that is already satisfied, so <code>IF NOT EXISTS</code> on the first line ends the file',
              'Các script trong thư mục đó chạy theo thứ tự bảng chữ cái và dừng ở câu lệnh đầu tiên đã thoả, nên <code>IF NOT EXISTS</code> ở dòng đầu kết thúc luôn cả file',
            ),
            B(
              'Extensions must be created by a superuser, and the entrypoint drops to the <code>POSTGRES_USER</code> role before running anything in that directory',
              'Extension phải do siêu người dùng tạo, mà entrypoint hạ xuống vai <code>POSTGRES_USER</code> trước khi chạy bất cứ thứ gì trong thư mục đó',
            ),
            B(
              'Scripts in <code>/docker-entrypoint-initdb.d</code> run ONLY when the data directory is empty. On an existing volume they are skipped entirely and silently — the same one-time rule that makes changing <code>POSTGRES_PASSWORD</code> in <code>.env</code> do nothing',
              'Script trong <code>/docker-entrypoint-initdb.d</code> CHỈ chạy khi thư mục dữ liệu còn rỗng. Trên một volume đã có sẵn thì chúng bị bỏ qua hoàn toàn và lặng lẽ — cùng quy tắc một-lần khiến việc đổi <code>POSTGRES_PASSWORD</code> trong <code>.env</code> chẳng có tác dụng gì',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The dangerous half of this rule is the password: the application then fails to authenticate with the new value while the database still holds the old one, and the obvious-looking fix — <code>docker compose down -v</code> to "start fresh" — deletes the database. The actual fix is one SQL statement (<code>ALTER USER … PASSWORD …</code>), then update <code>.env</code> and the connection string to match. Anything that must apply to an existing database belongs in a migration, not in the init directory.',
            'Nửa nguy hiểm của quy tắc này là cái mật khẩu: ứng dụng sẽ xác thực hỏng với giá trị mới trong khi cơ sở dữ liệu vẫn giữ giá trị cũ, và cách chữa trông có vẻ hiển nhiên — <code>docker compose down -v</code> để "làm lại từ đầu" — thì xoá mất cơ sở dữ liệu. Cách chữa thật là một câu SQL (<code>ALTER USER … PASSWORD …</code>), rồi cập nhật <code>.env</code> và chuỗi kết nối cho khớp. Thứ gì phải áp lên một cơ sở dữ liệu đã có thì thuộc về một migration, không thuộc thư mục khởi tạo.',
          ),
        }),

        // q12 · đáp án 0
        mcq({
          prompt: B(
            'Redis is declared with a memory limit but no eviction policy. What happens when the working set outgrows it?' + code(
              'cache:\n' +
              '  image: redis:7.4-alpine\n' +
              '  command: ["redis-server", "--appendonly", "yes"]\n' +
              '  deploy:\n' +
              '    resources:\n' +
              '      limits: { memory: 256M }',
            ),
            'Redis được khai với một trần bộ nhớ nhưng không có chính sách loại bỏ. Chuyện gì xảy ra khi tập dữ liệu đang dùng vượt quá nó?' + code(
              'cache:\n' +
              '  image: redis:7.4-alpine\n' +
              '  command: ["redis-server", "--appendonly", "yes"]\n' +
              '  deploy:\n' +
              '    resources:\n' +
              '      limits: { memory: 256M }',
            ),
          ),
          options: [
            B(
              'Redis knows nothing about the container limit, so it keeps allocating until the cgroup OOM killer takes the process — you need BOTH <code>--maxmemory</code> and <code>--maxmemory-policy allkeys-lru</code>, which give you a degraded cache that evicts instead of a dead one that restarts',
              'Redis không biết gì về trần của container nên nó cứ cấp phát tới khi kẻ giết OOM của cgroup lấy mất tiến trình — bạn cần CẢ <code>--maxmemory</code> lẫn <code>--maxmemory-policy allkeys-lru</code>, hai thứ đó cho bạn một bộ đệm suy giảm biết loại bớt khoá thay vì một bộ đệm chết rồi khởi động lại',
            ),
            B(
              'Redis reads the cgroup limit at start-up and sets <code>maxmemory</code> to it automatically, so the container never OOMs and the only cost is a rising eviction rate',
              'Redis đọc trần cgroup lúc khởi động và tự đặt <code>maxmemory</code> bằng đúng nó, nên container không bao giờ OOM và cái giá duy nhất là tỉ lệ loại bỏ tăng lên',
            ),
            B(
              'The append-only file absorbs the overflow by writing keys to disk, so memory stays flat and the container is limited only by the size of the volume',
              'File chỉ-ghi-thêm hấp thụ phần tràn bằng cách ghi khoá xuống đĩa, nên bộ nhớ giữ nguyên và container chỉ bị giới hạn bởi kích thước của volume',
            ),
            B(
              'Redis refuses new writes with an OOM error while continuing to serve reads, which is the default policy and the reason a policy is optional',
              'Redis từ chối các phép ghi mới bằng một lỗi OOM trong khi vẫn phục vụ phép đọc, đó là chính sách mặc định và là lý do khai chính sách chỉ là tuỳ chọn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The persistence decision sits next to it and is separate: no persistence is correct only if Redis holds derived data you can recompute; RDB snapshots (<code>--save "300 10"</code>) lose everything written since the last dump; and <code>--appendonly yes</code> is the right choice when sessions or queues live there, because otherwise every user is logged out on a deploy. Pick the eviction policy from what the data is: <code>allkeys-lru</code> for a cache, <code>noeviction</code> for a queue where losing data is worse than an error.',
            'Quyết định về tính bền vững nằm ngay cạnh và là chuyện riêng: không lưu gì chỉ đúng khi Redis giữ dữ liệu dẫn xuất mà bạn tính lại được; ảnh chụp RDB (<code>--save "300 10"</code>) mất hết những gì ghi từ lần chụp cuối; còn <code>--appendonly yes</code> là lựa chọn đúng khi phiên đăng nhập hay hàng đợi nằm ở đó, vì nếu không thì mỗi lần deploy là mọi người dùng bị đăng xuất. Hãy chọn chính sách loại bỏ theo bản chất dữ liệu: <code>allkeys-lru</code> cho một bộ đệm, <code>noeviction</code> cho một hàng đợi mà mất dữ liệu còn tệ hơn báo lỗi.',
          ),
        }),

        // q13 · đáp án 1
        mcq({
          prompt: B(
            'A Next.js image built with <code>output: \'standalone\'</code> serves pages, but every stylesheet, script chunk and image 404s. What is missing?' + code(
              'FROM node:22.11-alpine AS production\n' +
              'ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000\n' +
              'WORKDIR /app\n' +
              'COPY --from=build /app/.next/standalone ./\n' +
              'USER node\n' +
              'CMD ["node", "server.js"]',
            ),
            'Một ảnh Next.js dựng với <code>output: \'standalone\'</code> phục vụ được trang, nhưng mọi file style, mảnh script và ảnh đều 404. Thiếu gì?' + code(
              'FROM node:22.11-alpine AS production\n' +
              'ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000\n' +
              'WORKDIR /app\n' +
              'COPY --from=build /app/.next/standalone ./\n' +
              'USER node\n' +
              'CMD ["node", "server.js"]',
            ),
          ),
          options: [
            B(
              'A <code>RUN npm run build</code> in this stage — the standalone output contains the server but the assets are generated on first start, and a read-only or non-root stage cannot write them',
              'Một lệnh <code>RUN npm run build</code> ở stage này — bản standalone chứa máy chủ nhưng tài nguyên tĩnh được sinh ra ở lần khởi động đầu, và một stage chỉ-đọc hay không phải root thì không ghi được chúng',
            ),
            B(
              '<code>.next/static</code> and <code>public</code> must be copied separately — the standalone output deliberately excludes them, expecting a CDN, so the server starts perfectly and serves a site with no CSS and no images',
              'Phải chép <code>.next/static</code> và <code>public</code> riêng — bản standalone cố ý loại chúng ra vì cho rằng sẽ có một CDN, nên máy chủ khởi động ngon lành và phục vụ một trang không có CSS lẫn ảnh',
            ),
            B(
              'The <code>USER node</code> line comes after the COPY, so the copied files are owned by root and the server process cannot read them — add <code>--chown=node:node</code> to make the assets readable',
              'Dòng <code>USER node</code> đứng sau lệnh COPY nên các file đã chép thuộc quyền root và tiến trình máy chủ không đọc được — hãy thêm <code>--chown=node:node</code> để tài nguyên đọc được',
            ),
            B(
              'The <code>PORT=3000</code> variable conflicts with the standalone server\'s own asset port, which defaults to 3001 and must be published separately for static files to resolve',
              'Biến <code>PORT=3000</code> xung đột với cổng tài nguyên riêng của máy chủ standalone, cổng này mặc định là 3001 và phải được công bố riêng thì file tĩnh mới phân giải được',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two more things this file gets right and one it must not lose. <code>output: \'standalone\'</code> traces exactly which files the server needs and turns a 1.3GB image into roughly 190MB. <code>HOSTNAME=0.0.0.0</code> is the difference between a working container and a 502 from nginx, because Next binds to localhost by default and inside a container that means only itself. And in development, keep <code>/app/.next</code> and <code>/app/node_modules</code> as anonymous volumes over the source bind mount, or the host\'s stale build shadows the container\'s.',
            'Hai thứ nữa mà file này làm đúng và một thứ nó không được để mất. <code>output: \'standalone\'</code> lần ra đúng những file mà máy chủ cần và biến một cái ảnh 1,3GB thành khoảng 190MB. <code>HOSTNAME=0.0.0.0</code> là ranh giới giữa một container chạy được và một cú 502 từ nginx, vì Next mặc định gắn vào localhost mà bên trong container thì điều đó nghĩa là chỉ chính nó. Và lúc phát triển, hãy giữ <code>/app/.next</code> với <code>/app/node_modules</code> làm volume vô danh đè lên bind mount mã nguồn, không thì bản dựng cũ trên máy chủ che mất bản của container.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'The same Next.js code runs in two places and needs two different API addresses. Which pair is right, and why?' + code(
              '// lib/api.ts — one file, two execution contexts\n' +
              'const BASE = typeof window === \'undefined\'\n' +
              '  ? process.env.INTERNAL_API_URL   // server-side render\n' +
              '  : \'\';                            // in the browser',
            ),
            'Cùng một đoạn mã Next.js chạy ở hai nơi và cần hai địa chỉ API khác nhau. Cặp nào đúng, và vì sao?' + code(
              '// lib/api.ts — một file, hai ngữ cảnh thực thi\n' +
              'const BASE = typeof window === \'undefined\'\n' +
              '  ? process.env.INTERNAL_API_URL   // kết xuất phía máy chủ\n' +
              '  : \'\';                            // trong trình duyệt',
            ),
          ),
          options: [
            B(
              'Both should be the public URL. Using one address everywhere is what makes the code identical in both contexts, and the extra hop through the proxy is negligible on a single host',
              'Cả hai nên là URL công khai. Dùng một địa chỉ ở khắp nơi là thứ khiến mã giống hệt nhau ở cả hai ngữ cảnh, và một chặng thêm qua proxy thì không đáng kể trên một máy chủ đơn',
            ),
            B(
              'Both should be <code>http://api:3000</code>, because the browser resolves container names through the same embedded DNS server once the page is served from the same origin',
              'Cả hai nên là <code>http://api:3000</code>, vì trình duyệt phân giải tên container qua chính bộ DNS nhúng đó khi trang được phục vụ từ cùng một nguồn gốc',
            ),
            B(
              'Server-side: <code>http://api:3000</code> over the container network. Browser: a relative path, so nginx routes <code>/api</code> to the backend. The public URL from inside the container would leave the host, cross the internet and come back for a call between two containers on one machine — and <code>http://api:3000</code> does not resolve in a browser at all',
              'Phía máy chủ: <code>http://api:3000</code> qua mạng container. Trình duyệt: một đường dẫn tương đối, để nginx định tuyến <code>/api</code> tới backend. Dùng URL công khai từ bên trong container thì gói tin rời máy chủ, vòng qua Internet rồi quay lại chỉ để gọi giữa hai container trên cùng một cái máy — còn <code>http://api:3000</code> thì trình duyệt hoàn toàn không phân giải được',
            ),
            B(
              'Server-side: a relative path, because the Next server proxies it internally. Browser: the container name, because the browser inherits the page\'s network namespace from the server that rendered it',
              'Phía máy chủ: một đường dẫn tương đối, vì máy chủ Next tự chuyển tiếp nó ở bên trong. Trình duyệt: tên container, vì trình duyệt thừa hưởng network namespace của trang từ chính máy chủ đã kết xuất ra nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two paths, two addresses, one API. The relative form in the browser is also what frees you from the <code>NEXT_PUBLIC_*</code> problem entirely: values with that prefix are substituted into the JavaScript bundle at BUILD time, so they are string literals inside the image that a restart cannot change, and they are shipped to every visitor — which makes a third-party key with that prefix a published secret. If there is no URL to bake in, there is nothing to get wrong per environment.',
            'Hai đường đi, hai địa chỉ, một API. Dạng tương đối ở phía trình duyệt còn giải phóng bạn khỏi hẳn vấn đề <code>NEXT_PUBLIC_*</code>: giá trị mang tiền tố đó được thay vào gói JavaScript lúc DỰNG, nên chúng là chuỗi hằng nằm trong cái ảnh mà một lần khởi động lại không đổi được, và chúng được giao tới mọi khách truy cập — khiến một khoá của bên thứ ba mang tiền tố đó thành một bí mật đã công bố. Không có URL nào để nướng vào thì cũng chẳng có gì để làm sai theo từng môi trường.',
          ),
        }),

        // q15 · đáp án 3
        mcq({
          prompt: B(
            'A reverse proxy is added in front of an Express API. Redirects start downgrading to <code>http://</code>, secure cookies are never set, and every client IP in the logs is the same address. Which header pair was forgotten?' + code(
              'location /api/ {\n' +
              '  proxy_pass http://api;\n' +
              '  proxy_http_version 1.1;\n' +
              '  proxy_set_header Host $host;\n' +
              '}',
            ),
            'Một reverse proxy được đặt trước một API Express. Các lệnh chuyển hướng bắt đầu tụt về <code>http://</code>, cookie secure không bao giờ được đặt, và mọi IP khách trong log đều là cùng một địa chỉ. Cặp header nào bị quên?' + code(
              'location /api/ {\n' +
              '  proxy_pass http://api;\n' +
              '  proxy_http_version 1.1;\n' +
              '  proxy_set_header Host $host;\n' +
              '}',
            ),
          ),
          options: [
            B(
              '<code>Upgrade</code> and <code>Connection</code> — without them the proxy downgrades the connection to HTTP/1.0, which is what strips the scheme from redirects and collapses the client address',
              '<code>Upgrade</code> và <code>Connection</code> — không có chúng thì proxy hạ kết nối xuống HTTP/1.0, và đó là thứ tước mất giao thức khỏi các lệnh chuyển hướng rồi gộp địa chỉ khách lại',
            ),
            B(
              '<code>Accept-Encoding</code> and <code>Vary</code> — the backend cannot tell that the response passed through a compressing proxy, so it rewrites absolute URLs conservatively',
              '<code>Accept-Encoding</code> và <code>Vary</code> — backend không nhận ra phản hồi đã đi qua một proxy có nén, nên nó viết lại các URL tuyệt đối một cách dè dặt',
            ),
            B(
              '<code>X-Request-Id</code> and <code>X-Forwarded-Host</code> — without a request id the framework cannot correlate a redirect with its original request, and falls back to the proxy\'s own hostname',
              '<code>X-Request-Id</code> và <code>X-Forwarded-Host</code> — không có mã yêu cầu thì framework không nối được một lệnh chuyển hướng với yêu cầu gốc của nó, và lùi về dùng tên máy của chính proxy',
            ),
            B(
              '<code>X-Forwarded-Proto</code> and <code>X-Forwarded-For</code> — without the first the app believes every request is plain HTTP; without the second every client IP in your logs and your rate limiter is the proxy container\'s address, so one abusive user rate-limits everybody. Pair them with <code>app.set(\'trust proxy\', 1)</code>',
              '<code>X-Forwarded-Proto</code> và <code>X-Forwarded-For</code> — thiếu cái đầu thì ứng dụng tin rằng mọi yêu cầu đều là HTTP trần; thiếu cái sau thì mọi IP khách trong log và trong bộ giới hạn tần suất đều là địa chỉ của container proxy, nên một người dùng phá phách sẽ giới hạn luôn tất cả mọi người. Hãy ghép chúng với <code>app.set(\'trust proxy\', 1)</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three neighbouring proxy settings are worth knowing before they bite. <code>client_max_body_size</code> defaults to 1MB, so nginx rejects a larger upload with a 413 before your app ever sees it — a confusing failure because the application\'s own limit was set correctly. <code>proxy_read_timeout</code> defaults to 60s and cuts streamed responses off mid-stream. And the trailing slash in <code>proxy_pass</code> silently rewrites the path: <code>http://api;</code> passes <code>/api/v1/posts</code> through unchanged, <code>http://api/;</code> strips the prefix and sends <code>/v1/posts</code>.',
            'Ba thiết lập proxy hàng xóm đáng biết trước khi chúng cắn. <code>client_max_body_size</code> mặc định 1MB, nên nginx từ chối một lượt tải lên lớn hơn bằng mã 413 trước khi ứng dụng của bạn kịp thấy — một kiểu hỏng khó hiểu vì giới hạn của chính ứng dụng đã đặt đúng. <code>proxy_read_timeout</code> mặc định 60 giây và cắt ngang những phản hồi đang chảy dần. Còn dấu gạch chéo cuối trong <code>proxy_pass</code> âm thầm viết lại đường dẫn: <code>http://api;</code> chuyển <code>/api/v1/posts</code> qua nguyên vẹn, còn <code>http://api/;</code> bóc mất tiền tố và gửi đi <code>/v1/posts</code>.',
          ),
        }),

        // q16 · đáp án 0
        mcq({
          prompt: B(
            'Real codes measured against a running proxy. Which line should fail a deploy script, and why?' + code(
              '$ for r in "" "missing-route" "50x.html"; do\n' +
              '    printf \'%-16s %s\\n\' "/$r" "$(curl -s -o /dev/null -w \'%{http_code}\' http://localhost:18300/$r)"\n' +
              '  done\n' +
              '/                200\n' +
              '/missing-route   404\n' +
              '/50x.html        200',
            ),
            'Các mã đo thật với một proxy đang chạy. Dòng nào nên làm một script deploy đỏ, và vì sao?' + code(
              '$ for r in "" "missing-route" "50x.html"; do\n' +
              '    printf \'%-16s %s\\n\' "/$r" "$(curl -s -o /dev/null -w \'%{http_code}\' http://localhost:18300/$r)"\n' +
              '  done\n' +
              '/                200\n' +
              '/missing-route   404\n' +
              '/50x.html        200',
            ),
          ),
          options: [
            B(
              'A 404 on a route you know exists: 401 and 200 both mean the route is MOUNTED, while 404 means the running container is not the image you just built — a stale or partial deploy that leaves every container healthy and one feature silently dead',
              'Mã 404 trên một tuyến mà bạn biết chắc là có: 401 và 200 đều nghĩa là tuyến đã được GẮN, còn 404 nghĩa là container đang chạy không phải cái ảnh bạn vừa dựng — một lượt deploy cũ hoặc dở dang khiến mọi container đều khoẻ mà một tính năng thì chết lặng',
            ),
            B(
              'A 200 on a route that should require authentication, because an unauthenticated success means the auth middleware was dropped from the build and the API is open',
              'Mã 200 trên một tuyến lẽ ra phải xác thực, vì một lượt thành công không xác thực nghĩa là lớp trung gian xác thực đã rơi khỏi bản dựng và API đang mở toang',
            ),
            B(
              'Any code other than 200, since a deploy is only complete when every route the smoke test names answers successfully without credentials',
              'Bất cứ mã nào khác 200, vì một lượt deploy chỉ hoàn tất khi mọi tuyến mà phép kiểm khói gọi tên đều trả lời thành công mà không cần thông tin đăng nhập',
            ),
            B(
              'The 200 on <code>/50x.html</code>, because an error page answering successfully means nginx is serving its own fallback instead of proxying to the application',
              'Mã 200 trên <code>/50x.html</code>, vì một trang lỗi trả lời thành công nghĩa là nginx đang phục vụ trang dự phòng của chính nó thay vì chuyển tiếp tới ứng dụng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This exact shape has cost this project real downtime twice: a <code>--no-build</code> deploy left production running an old <code>dist/</code> that never mounted the GIF router, so the feature was dead, the container was healthy, and nothing in the logs said so. Put one param-less unauthenticated GET route per feature module in the list — and only routes that return non-404 on a bare GET, or every deploy false-fails. A deploy is not finished when the containers start; it is finished when the routes answer.',
            'Đúng hình dạng này đã khiến dự án này chết thật hai lần: một lượt deploy <code>--no-build</code> để production chạy một thư mục <code>dist/</code> cũ chưa từng gắn router GIF, nên tính năng đó chết, container thì khoẻ, và log chẳng nói gì. Hãy bỏ vào danh sách mỗi module tính năng một tuyến GET không tham số, không xác thực — và chỉ những tuyến trả về khác 404 với một lệnh GET trần, không thì mọi lượt deploy đều đỏ oan. Một lượt deploy chưa xong khi container khởi động; nó xong khi các tuyến trả lời.',
          ),
        }),

        /* ── Chương 11 — chạy trên production (7 câu) ─────────────────────── */

        // q17 · đáp án 1
        mcq({
          prompt: B(
            'Measured on this machine with Node v22.23.2. Which limit still leaves the container able to OOM, and why?' + code(
              "$ docker run --rm       node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '2096MB\n' +
              "$ docker run --rm -m 2g   node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '1048MB\n' +
              "$ docker run --rm -m 512m node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '259MB\n' +
              "$ docker run --rm -m 256m node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '259MB',
            ),
            'Đo trên máy này với Node v22.23.2. Trần nào vẫn để container có thể chết OOM, và vì sao?' + code(
              "$ docker run --rm       node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '2096MB\n' +
              "$ docker run --rm -m 2g   node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '1048MB\n' +
              "$ docker run --rm -m 512m node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '259MB\n' +
              "$ docker run --rm -m 256m node:22-alpine node -e \"…heap_size_limit…\"\n" +
              '259MB',
            ),
          ),
          options: [
            B(
              '<code>-m 2g</code>, because a heap of 1048MB leaves only half the container for everything else — the runtime, the native modules and the page cache all have to fit in the other gigabyte',
              '<code>-m 2g</code>, vì một heap 1048MB chỉ chừa lại nửa container cho mọi thứ còn lại — môi trường chạy, các module gốc và bộ đệm trang đều phải nhét vừa vào một gigabyte kia',
            ),
            B(
              '<code>-m 256m</code>. Node 22 does read the cgroup limit — 512m gives 259MB, 2g gives 1048MB — but it stops scaling down at a floor, so at 256m the heap it plans for is LARGER than the whole container. Set <code>NODE_OPTIONS=--max-old-space-size</code> below the limit whenever the limit is small',
              '<code>-m 256m</code>. Node 22 CÓ đọc trần cgroup — 512m ra 259MB, 2g ra 1048MB — nhưng nó ngừng thu nhỏ khi chạm một cái sàn, nên ở 256m cái heap nó dự tính LỚN HƠN cả container. Hãy đặt <code>NODE_OPTIONS=--max-old-space-size</code> thấp hơn trần mỗi khi trần nhỏ',
            ),
            B(
              'The one with no limit at all, since 2096MB of heap on a machine whose Docker VM has under 8GB is the only figure here that exceeds what the host can actually provide',
              'Cái không đặt trần gì cả, vì 2096MB heap trên một cỗ máy mà máy ảo Docker có dưới 8GB là con số duy nhất ở đây vượt quá thứ máy chủ thật sự cấp được',
            ),
            B(
              'None of them. Every figure is below its own container limit, so the heap can never be the cause — an OOM at any of these settings must come from native allocations outside the V8 heap',
              'Không cái nào. Mọi con số đều thấp hơn trần container của chính nó, nên cái heap không bao giờ là nguyên nhân — một cú OOM ở bất kỳ thiết lập nào trong số này chắc chắn đến từ phần cấp phát gốc nằm ngoài heap của V8',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The course text describes an older Node that sized its heap from the host\'s RAM regardless of the cgroup; measured here, that is no longer true — but the conclusion survives in a narrower form. The symptom to recognise is a container that OOMs under load while its own logs show plenty of free heap: the garbage collector is not becoming aggressive because, by its arithmetic, there is room. The same shape applies to the JVM (<code>-XX:MaxRAMPercentage</code>) and to anything that sizes itself from what it believes the machine has.',
            'Phần chữ trong giáo trình mô tả một bản Node đời cũ tính cỡ heap theo RAM của máy chủ bất kể cgroup; đo ở đây thì điều đó không còn đúng — nhưng kết luận vẫn sống sót ở dạng hẹp hơn. Triệu chứng cần nhận ra là một container chết OOM khi có tải trong khi log của chính nó cho thấy heap còn thừa: bộ gom rác không quyết liệt lên vì theo phép tính của nó thì vẫn còn chỗ. Cùng hình dạng ấy đúng với JVM (<code>-XX:MaxRAMPercentage</code>) và với mọi thứ tự định cỡ theo phần nó TIN là cỗ máy đang có.',
          ),
        }),

        // q18 · đáp án 2
        mcq({
          prompt: B(
            'The stack has <code>depends_on</code> with healthcheck conditions everywhere and every service is <code>restart: unless-stopped</code>. The server reboots. What actually happens?',
            'Stack có <code>depends_on</code> kèm điều kiện healthcheck ở khắp nơi và mọi dịch vụ đều <code>restart: unless-stopped</code>. Máy chủ khởi động lại. Thực tế xảy ra chuyện gì?',
          ),
          options: [
            B(
              'The daemon replays the last <code>docker compose up</code> from the project labels it stored on each container, so the same ordering is reproduced exactly, every healthcheck condition is honoured a second time, and the stack comes back in full dependency order',
              'Tiến trình nền phát lại lệnh <code>docker compose up</code> gần nhất dựa vào các nhãn dự án nó đã lưu trên từng container, nên đúng thứ tự đó được tái hiện, mọi điều kiện healthcheck được tôn trọng thêm một lần nữa, và stack trở lại theo trọn vẹn thứ tự phụ thuộc',
            ),
            B(
              'Nothing comes back until someone runs <code>up</code> again, because a restart policy applies to a process that crashed while the daemon was running and never to a host reboot, where every container is stopped deliberately as the machine shuts down',
              'Không gì trở lại cho tới khi có người chạy <code>up</code> lần nữa, vì chính sách khởi động lại chỉ áp cho một tiến trình sập trong lúc tiến trình nền đang chạy, chứ không bao giờ áp cho một lần khởi động lại máy chủ, nơi mọi container đều bị dừng có chủ đích lúc cỗ máy tắt đi',
            ),
            B(
              'Containers come back but <code>depends_on</code> has NO effect — it orders <code>docker compose up</code> and nothing else, and the daemon restarting containers on boot knows nothing about it. The API may start before the database accepts connections, so the application must retry; a systemd unit that runs <code>compose up</code> is what restores the ordering',
              'Container trở lại nhưng <code>depends_on</code> KHÔNG có tác dụng — nó sắp thứ tự cho lệnh <code>docker compose up</code> và chỉ thế thôi, còn tiến trình nền khi khởi động lại container lúc máy lên thì chẳng biết gì về nó. API có thể khởi động trước khi cơ sở dữ liệu nhận kết nối, nên ứng dụng phải tự thử lại; một unit systemd chạy <code>compose up</code> mới là thứ khôi phục lại thứ tự',
            ),
            B(
              'Only the services with a healthcheck come back, because the daemon uses the check to decide whether a container was healthy when the machine went down',
              'Chỉ những dịch vụ có healthcheck mới trở lại, vì tiến trình nền dùng phép kiểm đó để quyết định container có khoẻ hay không lúc cỗ máy tắt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two more reboot facts worth having. Only <code>always</code> and <code>unless-stopped</code> bring a container back on daemon start — an <code>on-failure</code> worker quietly does not return. And the daemon itself must be enabled (<code>systemctl is-enabled docker</code>); most distributions do this on install, but a hand-installed daemon may not, and nothing tells you until the reboot. Test it once on a quiet afternoon; finding out during an unplanned reboot is the expensive version of the same experiment.',
            'Hai sự thật nữa về khởi động lại đáng có. Chỉ <code>always</code> và <code>unless-stopped</code> mới đưa một container trở lại lúc tiến trình nền khởi động — một worker để <code>on-failure</code> thì lặng lẽ không quay về. Và bản thân tiến trình nền phải được bật (<code>systemctl is-enabled docker</code>); phần lớn bản phân phối làm việc đó lúc cài, nhưng một tiến trình nền cài tay thì có thể không, và chẳng ai báo cho bạn tới tận lần khởi động lại. Hãy thử một lần vào một buổi chiều yên tĩnh; phát hiện ra giữa một lần khởi động lại ngoài ý muốn là bản đắt tiền của cùng thí nghiệm đó.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'Measured on a plain container. The log file is 4.1GB and the disk is nearly full. What does <code>map[]</code> mean, and what is the correct first move?' + code(
              "$ docker inspect c --format '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}'\n" +
              'json-file map[]\n' +
              "$ docker inspect c --format '{{.LogPath}}'\n" +
              '/var/lib/docker/containers/723d6f74c050…/723d6f74c050…-json.log',
            ),
            'Đo trên một container thường. File log nặng 4,1GB và đĩa gần đầy. <code>map[]</code> nghĩa là gì, và nước đi đầu tiên đúng là gì?' + code(
              "$ docker inspect c --format '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}'\n" +
              'json-file map[]\n' +
              "$ docker inspect c --format '{{.LogPath}}'\n" +
              '/var/lib/docker/containers/723d6f74c050…/723d6f74c050…-json.log',
            ),
          ),
          options: [
            B(
              'It means the driver is buffering in memory with no file backing yet; restart the container and the buffered lines are flushed and rotated automatically',
              'Nó nghĩa là trình ghi đang đệm trong bộ nhớ và chưa có file nào phía sau; khởi động lại container là các dòng đã đệm được xả ra và xoay vòng tự động',
            ),
            B(
              'It means rotation is handled by the daemon rather than the container, so the file will be rotated at the next daemon reload and nothing needs doing now',
              'Nó nghĩa là việc xoay vòng do tiến trình nền lo chứ không phải container, nên file sẽ được xoay ở lần nạp lại kế tiếp của tiến trình nền và bây giờ không cần làm gì',
            ),
            B(
              'It means the container uses the <code>local</code> driver internally, which compresses on the fly — so the 4.1GB is already compressed and deleting it is the only way to reclaim anything',
              'Nó nghĩa là container dùng trình <code>local</code> ở bên trong, thứ nén ngay khi ghi — nên 4,1GB đó đã là bản nén và xoá đi là cách duy nhất lấy lại được gì',
            ),
            B(
              'It means NO rotation options are configured, and the default <code>json-file</code> driver never rotates until you set <code>max-size</code>. Reclaim with <code>truncate -s 0</code>, not <code>rm</code> — the container holds the file open, so deleting it frees nothing until the process exits and breaks <code>docker logs</code> as well',
              'Nó nghĩa là KHÔNG có tuỳ chọn xoay vòng nào được cấu hình, và trình <code>json-file</code> mặc định không bao giờ xoay vòng cho tới khi bạn đặt <code>max-size</code>. Hãy lấy lại chỗ bằng <code>truncate -s 0</code> chứ đừng <code>rm</code> — container vẫn giữ file đó mở, nên xoá nó chẳng giải phóng được gì cho tới khi tiến trình thoát, mà còn làm hỏng luôn <code>docker logs</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'These files live outside everything <code>docker system df</code> counts — they are not images, container layers or volumes — so a server can report plenty of Docker space and still be out of disk. Set <code>max-size</code> and <code>max-file</code> in <code>/etc/docker/daemon.json</code> AND in compose: the daemon default protects every container anyone starts on that host, the compose entry documents the intent where a reviewer sees it. A daemon-level change applies only to containers created after the reload, so recreate the existing ones.',
            'Những file này nằm ngoài mọi thứ mà <code>docker system df</code> đếm — chúng không phải ảnh, không phải tầng container, không phải volume — nên một máy chủ có thể báo còn nhiều chỗ cho Docker mà vẫn hết đĩa. Hãy đặt <code>max-size</code> và <code>max-file</code> trong <code>/etc/docker/daemon.json</code> VÀ trong compose: giá trị mặc định của tiến trình nền bảo vệ mọi container mà bất kỳ ai khởi chạy trên máy đó, còn dòng trong compose ghi lại chủ ý ở chỗ người duyệt nhìn thấy. Thay đổi ở mức tiến trình nền chỉ áp cho container tạo sau lần nạp lại, nên hãy dựng lại những cái đang có.',
          ),
        }),

        // q20 · đáp án 0
        mcq({
          prompt: B(
            'A deploy script builds the images on the production VPS. Which two costs is it paying, beyond the build time itself?',
            'Một script deploy dựng ảnh ngay trên VPS production. Ngoài chính thời gian dựng, nó đang trả hai cái giá nào?',
          ),
          options: [
            B(
              'The build competes for CPU and memory with the live site — parallel cold builds have been OOM-killed on a 6GB machine — and it fills the disk with build cache, on the same disk that holds the database; a build cache once grew to 7.6GB there and a deploy died with <code>no space left on device</code>',
              'Lượt dựng tranh CPU và bộ nhớ với chính trang đang chạy — dựng nguội song song từng bị OOM giết trên một cỗ máy 6GB — và nó làm đầy đĩa bằng bộ đệm dựng, đúng cái đĩa chứa cơ sở dữ liệu; bộ đệm dựng có lần phình lên 7,6GB ở đó và một lượt deploy đã chết với <code>no space left on device</code>',
            ),
            B(
              'The daemon cannot build and serve containers at the same time, so every running service is paused for the duration; and the resulting image is tagged locally only, so a rollback has nothing to return to',
              'Tiến trình nền không thể vừa dựng vừa phục vụ container cùng lúc nên mọi dịch vụ đang chạy bị tạm dừng suốt thời gian đó; và cái ảnh thu được chỉ được gắn tag cục bộ nên một lượt quay lui chẳng có gì để trở về',
            ),
            B(
              'Images built on the server cannot be signed, so a supply-chain policy will reject them; and the build layers are written to the container writable layer rather than the image store',
              'Ảnh dựng trên máy chủ không ký được nên một chính sách chuỗi cung ứng sẽ từ chối chúng; và các tầng dựng bị ghi vào tầng ghi được của container chứ không vào kho ảnh',
            ),
            B(
              'The server has no build cache from previous runs, so every build is cold; and building requires the daemon to run in privileged mode, which removes the container boundary for everything else on the host',
              'Máy chủ không có bộ đệm dựng từ các lượt trước nên mọi lượt dựng đều nguội; và việc dựng đòi tiến trình nền chạy ở chế độ đặc quyền, thứ xoá bỏ ranh giới container cho mọi thứ khác trên máy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Build on a machine with headroom, push to a registry, and let the server do one thing: pull and swap. Seconds instead of minutes, no build cache on the production disk, and the artifact is byte-identical to the one you tested. Two habits go with it: only committed code goes out (building from a push rather than rsyncing a working tree means a half-edited file cannot reach production), and tag by commit SHA rather than a moving tag, so "what is running" is a fact you can check.',
            'Hãy dựng trên một cỗ máy còn dư sức, đẩy lên registry, và để máy chủ làm đúng một việc: kéo về và tráo. Vài giây thay vì vài phút, không có bộ đệm dựng nào trên đĩa production, và hiện vật giống hệt từng byte với thứ bạn đã kiểm. Hai thói quen đi kèm: chỉ mã đã commit mới đi ra (dựng từ một lượt push thay vì rsync cây làm việc nghĩa là một file sửa dở không thể lên tới production), và gắn tag theo mã commit thay vì một tag di động, để "cái gì đang chạy" là một sự thật kiểm được.',
          ),
        }),

        // q21 · đáp án 1
        mcq({
          prompt: B(
            'A bad release is live. Images are tagged by commit SHA. Which situation makes the forty-second rollback the WRONG first move?' + code(
              "$ docker images --format '{{.Repository}}:{{.Tag}}\\t{{.CreatedSince}}' | grep api | head -2\n" +
              'ghcr.io/me/api:9f2ac1e\t14 minutes ago\n' +
              'ghcr.io/me/api:3b81e77\t2 days ago\n' +
              '\n' +
              '$ TAG=3b81e77 docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api',
            ),
            'Một bản phát hành hỏng đang chạy. Ảnh được gắn tag theo mã commit. Tình huống nào khiến cú quay lui bốn mươi giây thành nước đi đầu tiên SAI?' + code(
              "$ docker images --format '{{.Repository}}:{{.Tag}}\\t{{.CreatedSince}}' | grep api | head -2\n" +
              'ghcr.io/me/api:9f2ac1e\t14 minutes ago\n' +
              'ghcr.io/me/api:3b81e77\t2 days ago\n' +
              '\n' +
              '$ TAG=3b81e77 docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api',
            ),
          ),
          options: [
            B(
              'When the previous image is no longer on the host, because a rollback that has to pull from the registry is slower than fixing forward and should never be attempted',
              'Khi cái ảnh trước không còn trên máy chủ nữa, vì một lượt quay lui phải kéo từ registry thì chậm hơn sửa tới và không bao giờ nên thử',
            ),
            B(
              'When the release included a database migration — reverting the code does not revert the schema, and the old code may not run against the new one, so this needs a deliberate decision rather than a reflex',
              'Khi bản phát hành có kèm một migration cơ sở dữ liệu — quay lui mã KHÔNG quay lui schema, và mã cũ có thể không chạy được trên schema mới, nên chuyện này cần một quyết định có chủ ý chứ không phải một phản xạ',
            ),
            B(
              'When more than one service changed in the release, because <code>up -d</code> recreates only the service you name and the stack would end up with mismatched versions',
              'Khi bản phát hành đổi nhiều hơn một dịch vụ, vì <code>up -d</code> chỉ dựng lại đúng dịch vụ bạn gọi tên và stack sẽ rơi vào cảnh lệch phiên bản',
            ),
            B(
              'When the previous tag is more than twenty-four hours old, because a base image may have been patched since and redeploying it reintroduces the vulnerabilities that patch fixed',
              'Khi cái tag trước cũ hơn hai mươi tư giờ, vì ảnh nền có thể đã được vá từ đó và deploy lại nó là đưa trở lại đúng những lỗ hổng bản vá ấy đã sửa',
            ),
          ],
          correct: 1,
          explanation: EX(
            'For a code-only change the rollback is forty seconds, no data involved and no thinking required — which is exactly why tagging by commit matters. When a migration is in the release, a down-migration is a separate, deliberate decision to talk through, not a reflex under pressure. Two closing habits: <code>git revert &lt;sha&gt;</code> then deploy normally is the durable fix once the emergency is handled (never <code>push --force</code>, which loses the record of what happened), and the real output of an incident is one new check — the missing check is the actual finding.',
            'Với một thay đổi chỉ có mã, cú quay lui mất bốn mươi giây, không dính dữ liệu và không cần suy nghĩ — và đó chính là lý do gắn tag theo commit quan trọng. Khi bản phát hành có migration, một lượt di trú lùi là một quyết định riêng, có chủ ý, cần bàn bạc, không phải một phản xạ dưới áp lực. Hai thói quen khép lại: <code>git revert &lt;sha&gt;</code> rồi deploy như bình thường là cách chữa bền vững sau khi dập xong đám cháy (đừng bao giờ <code>push --force</code>, nó xoá mất dấu vết chuyện đã xảy ra), và sản phẩm thật sự của một sự cố là MỘT phép kiểm mới — cái phép kiểm còn thiếu mới là phát hiện thật.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'Every deploy drops in-flight requests and <code>docker compose stop api</code> always takes the full grace period. Which pair of changes fixes it?',
            'Mỗi lượt deploy đều làm rơi các yêu cầu đang dở và <code>docker compose stop api</code> lần nào cũng ăn trọn thời gian ân hạn. Cặp thay đổi nào chữa được?',
          ),
          options: [
            B(
              'Set <code>restart: always</code> and shorten <code>stop_grace_period</code>, so a container that refuses to stop is killed sooner and immediately replaced by a fresh one',
              'Đặt <code>restart: always</code> và rút ngắn <code>stop_grace_period</code>, để một container không chịu dừng bị giết sớm hơn rồi được thay ngay bằng một cái mới',
            ),
            B(
              'Add a healthcheck with a short <code>interval</code> and set <code>stop_signal: SIGKILL</code>, so the proxy stops routing to the container before it is taken down',
              'Thêm một healthcheck với <code>interval</code> ngắn và đặt <code>stop_signal: SIGKILL</code>, để proxy thôi định tuyến tới container trước khi nó bị hạ',
            ),
            B(
              'Handle SIGTERM in the application — stop accepting connections, let in-flight work finish, close the database pool, exit 0 — and set <code>stop_grace_period</code> longer than the application\'s own timeout. Also make sure the process really is PID 1, or the signal goes nowhere',
              'Xử lý SIGTERM trong ứng dụng — thôi nhận kết nối mới, để phần việc đang dở chạy nốt, đóng bể kết nối cơ sở dữ liệu, thoát 0 — và đặt <code>stop_grace_period</code> dài hơn hạn giờ của chính ứng dụng. Cũng phải chắc rằng tiến trình đó thật sự là PID 1, không thì tín hiệu đi vào hư không',
            ),
            B(
              'Run two replicas and let compose stop them together, since the grace period only applies when a single container is the last one serving traffic',
              'Chạy hai bản sao và để compose dừng chúng cùng lúc, vì thời gian ân hạn chỉ áp khi một container đơn độc là cái cuối cùng còn phục vụ lưu lượng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The grace period is a negotiation, not a delay: a process that exits during it ends the wait immediately. Measured in this project, the difference is 412ms instead of ten seconds, with no dropped requests. The PID 1 half is the part people miss — a shell-form <code>CMD</code> wraps your process in <code>/bin/sh -c</code> on some base images, and that shell neither forwards the signal nor exits, which is what <code>tini</code> and <code>init: true</code> fix. The remaining gap between the old container stopping and the new one being ready is real, and the two honest answers are to deploy when it is quiet or to run two replicas behind the proxy.',
            'Thời gian ân hạn là một cuộc thương lượng chứ không phải một khoảng trễ: một tiến trình thoát ra trong khoảng đó là chấm dứt việc chờ ngay lập tức. Đo trong chính dự án này, khác biệt là 412ms thay vì mười giây, và không rơi yêu cầu nào. Nửa về PID 1 mới là chỗ người ta hay bỏ sót — một <code>CMD</code> dạng shell bọc tiến trình của bạn trong <code>/bin/sh -c</code> trên vài ảnh nền, mà cái shell đó không chuyển tiếp tín hiệu cũng không thoát, và đó là thứ <code>tini</code> với <code>init: true</code> chữa. Khoảng hở còn lại giữa lúc container cũ dừng và container mới sẵn sàng là có thật, và hai câu trả lời thật thà là deploy lúc vắng, hoặc chạy hai bản sao sau proxy.',
          ),
        }),

        // q23 · đáp án 0
        mcq({
          prompt: B(
            'What is compose telling you here, and why is it safe to run <code>up -d</code> repeatedly?' + code(
              '$ docker compose up -d\n' +
              '[+] Running 3/3\n' +
              ' ✔ Container blog-api-1  Recreated                          10.4s\n' +
              ' ✔ Container blog-web-1  Running                             0.0s\n' +
              ' ✔ Container blog-db-1   Running                             0.0s',
            ),
            'Compose đang nói gì ở đây, và vì sao chạy <code>up -d</code> nhiều lần lại an toàn?' + code(
              '$ docker compose up -d\n' +
              '[+] Running 3/3\n' +
              ' ✔ Container blog-api-1  Recreated                          10.4s\n' +
              ' ✔ Container blog-web-1  Running                             0.0s\n' +
              ' ✔ Container blog-db-1   Running                             0.0s',
            ),
          ),
          options: [
            B(
              'Compose DIFFS the running state against the file and only touches containers whose image, environment, mounts or config differ — "Running" means unchanged and untouched, which is why an API deploy does not disturb the database',
              'Compose SO SÁNH trạng thái đang chạy với file và chỉ đụng tới những container có ảnh, môi trường, phép gắn hay cấu hình khác đi — "Running" nghĩa là không đổi và không bị đụng, và vì thế một lượt deploy API không làm phiền cơ sở dữ liệu',
            ),
            B(
              'Compose restarts every container in dependency order but reports only the slowest one as recreated, so the other two lines are a summary rather than a statement about what happened',
              'Compose khởi động lại mọi container theo thứ tự phụ thuộc nhưng chỉ báo cái chậm nhất là đã dựng lại, nên hai dòng kia là phần tóm tắt chứ không phải một lời khẳng định về chuyện đã xảy ra',
            ),
            B(
              'Only the service whose image tag changed is pulled; the other two keep running because compose skips any service that declares a healthcheck currently reporting healthy',
              'Chỉ dịch vụ có tag ảnh thay đổi mới được kéo về; hai cái kia vẫn chạy vì compose bỏ qua mọi dịch vụ có khai một healthcheck đang báo khoẻ',
            ),
            B(
              'The 10.4s on the API is the pull time; "Running" on the other two means their images were already present locally, and all three containers were in fact replaced',
              'Con số 10,4 giây ở API là thời gian kéo ảnh; chữ "Running" ở hai cái kia nghĩa là ảnh của chúng đã có sẵn tại chỗ, và thật ra cả ba container đều đã bị thay',
            ),
          ],
          correct: 0,
          explanation: EX(
            'That idempotence is the point, and it also names the cost of the one service that did change: recreating means stopping one container and starting another, so there is a gap. During it requests fail — ten seconds of 502s per deploy unless the application handles SIGTERM and drains. Note that <code>--force-recreate</code> deliberately throws the diff away, and <code>--no-build</code> after a code change is how a stack ends up running an older image than you think.',
            'Tính bất biến khi lặp lại đó chính là điểm mấu chốt, và nó cũng gọi tên cái giá của dịch vụ duy nhất đã đổi: dựng lại nghĩa là dừng một container rồi khởi chạy một cái khác, tức là có một khoảng hở. Trong khoảng đó các yêu cầu hỏng — mười giây 502 mỗi lượt deploy, trừ khi ứng dụng xử lý SIGTERM và rút lui có trật tự. Để ý <code>--force-recreate</code> cố ý vứt bỏ phép so sánh đó, còn <code>--no-build</code> sau khi đổi mã là cách một stack rốt cuộc chạy một cái ảnh cũ hơn thứ bạn nghĩ.',
          ),
        }),

        /* ── Chương 12 — chẩn đoán (7 câu) ────────────────────────────────── */

        // q24 · đáp án 1
        mcq({
          prompt: B(
            'Measured. Same image, one argument apart. Why did the first container finish immediately with a clean exit code?' + code(
              '$ docker run -d --name q nginx:1.27-alpine nginx\n' +
              "$ docker ps -a --filter name=q --format '{{.Status}}'\n" +
              'Exited (0) 2 seconds ago\n' +
              '\n' +
              "$ docker run -d --name l nginx:1.27-alpine nginx -g 'daemon off;'\n" +
              "$ docker ps --filter name=l --format '{{.Status}}'\n" +
              'Up 1 second',
            ),
            'Đo thật. Cùng một ảnh, khác nhau một tham số. Vì sao container đầu kết thúc ngay với một mã thoát sạch?' + code(
              '$ docker run -d --name q nginx:1.27-alpine nginx\n' +
              "$ docker ps -a --filter name=q --format '{{.Status}}'\n" +
              'Exited (0) 2 seconds ago\n' +
              '\n' +
              "$ docker run -d --name l nginx:1.27-alpine nginx -g 'daemon off;'\n" +
              "$ docker ps --filter name=l --format '{{.Status}}'\n" +
              'Up 1 second',
            ),
          ),
          options: [
            B(
              'Without arguments nginx runs a configuration test and exits, which is why the exit code is 0; the second form is what actually starts the server',
              'Không có tham số thì nginx chạy một lượt kiểm cấu hình rồi thoát, và vì thế mã thoát là 0; dạng thứ hai mới là dạng thật sự khởi chạy máy chủ',
            ),
            B(
              'It DAEMONISED: nginx forked into the background and PID 1 exited, so Docker considered the container finished. Foreground mode is mandatory in a container — the same applies to <code>postgres</code> rather than <code>pg_ctl start</code>, and <code>redis-server</code> without <code>--daemonize yes</code>',
              'Nó TỰ CHẠY NỀN: nginx fork xuống nền và PID 1 thoát ra, nên Docker coi container đã xong việc. Chế độ chạy tiền cảnh là bắt buộc trong một container — điều đó cũng đúng với <code>postgres</code> thay vì <code>pg_ctl start</code>, và <code>redis-server</code> không kèm <code>--daemonize yes</code>',
            ),
            B(
              'The <code>-d</code> flag detached the container before nginx finished binding its listening socket, so the process was reaped as an orphan and reported a clean exit',
              'Cờ <code>-d</code> tách container ra trước khi nginx kịp gắn xong socket nghe, nên tiến trình bị thu dọn như một đứa trẻ mồ côi và báo về một lần thoát sạch',
            ),
            B(
              'The image\'s entrypoint script requires at least one argument after the command name; with none it prints usage and exits 0 without ever invoking the server',
              'Script entrypoint của ảnh đòi ít nhất một tham số sau tên câu lệnh; không có cái nào thì nó in hướng dẫn dùng rồi thoát 0 mà chưa hề gọi máy chủ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Three other reasons a container exits 0 immediately are worth keeping next to this one. The command genuinely finished — <code>CMD ["npm","run","build"]</code> in a service definition, where exit 0 is correct behaviour and the mistake is calling it a service. It wanted a TTY and had none: <code>docker run -d alpine sh</code> exits instantly because stdin is closed. And a wrapper swallowed the real command, which <code>docker inspect -f \'{{ .Config.Entrypoint }} {{ .Config.Cmd }}\'</code> settles in one line.',
            'Ba lý do khác khiến một container thoát 0 ngay lập tức cũng đáng để cạnh cái này. Câu lệnh thật sự đã chạy xong — <code>CMD ["npm","run","build"]</code> trong một định nghĩa dịch vụ, chỗ mà thoát 0 là hành vi đúng còn sai lầm là gọi nó là một dịch vụ. Nó cần một TTY mà không có: <code>docker run -d alpine sh</code> thoát tức thì vì stdin đã đóng. Và một lớp bọc nuốt mất câu lệnh thật, chuyện mà <code>docker inspect -f \'{{ .Config.Entrypoint }} {{ .Config.Cmd }}\'</code> dẹp gọn trong một dòng.',
          ),
        }),

        // q25 · đáp án 3
        mcq({
          prompt: B(
            'Measured on this machine. The file is plainly there and executable. What is the message actually telling you?' + code(
              '$ file crlf.sh lf.sh\n' +
              'crlf.sh: POSIX shell script text executable, ASCII text, with CRLF line terminators\n' +
              'lf.sh:   POSIX shell script text executable, ASCII text\n' +
              '\n' +
              '$ docker run --rm -v "$PWD/crlf.sh:/s.sh" alpine:3.20 /s.sh\n' +
              'exec /s.sh: no such file or directory\n' +
              '\n' +
              '$ docker run --rm -v "$PWD/lf.sh:/s.sh" alpine:3.20 /s.sh\n' +
              'hello',
            ),
            'Đo trên máy này. File rõ ràng có ở đó và có quyền chạy. Thông báo đó thật ra đang nói gì?' + code(
              '$ file crlf.sh lf.sh\n' +
              'crlf.sh: POSIX shell script text executable, ASCII text, with CRLF line terminators\n' +
              'lf.sh:   POSIX shell script text executable, ASCII text\n' +
              '\n' +
              '$ docker run --rm -v "$PWD/crlf.sh:/s.sh" alpine:3.20 /s.sh\n' +
              'exec /s.sh: no such file or directory\n' +
              '\n' +
              '$ docker run --rm -v "$PWD/lf.sh:/s.sh" alpine:3.20 /s.sh\n' +
              'hello',
            ),
          ),
          options: [
            B(
              'The bind mount of a single file failed silently, so the path exists as an empty placeholder — mounting the containing directory instead makes the script readable',
              'Phép bind mount một file đơn đã hỏng trong im lặng nên đường dẫn tồn tại như một chỗ giữ chỗ rỗng — gắn cả thư mục chứa nó thì script đọc được',
            ),
            B(
              'Alpine cannot execute a script written on macOS, because the executable bit does not survive the file-sharing layer and the kernel refuses a non-executable file',
              'Alpine không chạy được một script viết trên macOS, vì bit thực thi không sống sót qua lớp chia sẻ file và nhân từ chối một file không có quyền chạy',
            ),
            B(
              'The script has no interpreter at all — a shebang is only honoured for files under <code>/usr/bin</code>, so a script mounted at the root has to be invoked as <code>sh /s.sh</code>',
              'Script hoàn toàn không có trình thông dịch — dòng shebang chỉ được tôn trọng với file nằm dưới <code>/usr/bin</code>, nên một script gắn ở thư mục gốc phải gọi bằng <code>sh /s.sh</code>',
            ),
            B(
              'The missing thing is the INTERPRETER, not the script: with CRLF line endings the shebang reads <code>#!/bin/sh\\r</code>, so the kernel looks for a program literally named <code>sh\\r</code> and reports "no such file or directory" for a file that is plainly there',
              'Thứ không tìm thấy là TRÌNH THÔNG DỊCH chứ không phải cái script: với ký tự xuống dòng kiểu CRLF thì dòng shebang đọc thành <code>#!/bin/sh\\r</code>, nên nhân đi tìm một chương trình tên đúng là <code>sh\\r</code> rồi báo "no such file or directory" cho một file rành rành đang ở đó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two neighbouring causes produce a similar-looking message. An exec-form <code>CMD</code> containing <code>$VAR</code> passes the literal dollar sign as part of the program name, because exec form invokes no shell. And a binary compiled for another architecture is reported as <code>exec format error</code>, which reads like corruption. The one command that separates all three: <code>docker run --rm --entrypoint sh &lt;image&gt; -c \'file /app/entrypoint.sh; command -v node\'</code>. Prevent the CRLF case with <code>git update-index --chmod=+x</code> plus a <code>.gitattributes</code> line <code>*.sh text eol=lf</code>.',
            'Hai nguyên nhân hàng xóm cho ra thông báo trông na ná. Một <code>CMD</code> dạng exec chứa <code>$VAR</code> sẽ truyền nguyên dấu đô-la như một phần của tên chương trình, vì dạng exec không gọi shell nào. Còn một tệp nhị phân biên dịch cho kiến trúc khác thì bị báo là <code>exec format error</code>, đọc lên như thể file bị hỏng. Một câu lệnh tách bạch cả ba: <code>docker run --rm --entrypoint sh &lt;ảnh&gt; -c \'file /app/entrypoint.sh; command -v node\'</code>. Ngừa ca CRLF bằng <code>git update-index --chmod=+x</code> cộng một dòng <code>.gitattributes</code> ghi <code>*.sh text eol=lf</code>.',
          ),
        }),

        // q26 · đáp án 0
        mcq({
          prompt: B(
            'Measured on this machine. The container is marked unhealthy and keeps running. Which thing is actually broken?' + code(
              "$ docker inspect c --format 'health={{.State.Health.Status}} status={{.State.Status}} restarts={{.RestartCount}}'\n" +
              'health=unhealthy status=running restarts=0\n' +
              '\n' +
              "$ docker inspect c --format '{{range .State.Health.Log}}{{.ExitCode}}: {{.Output}}{{end}}'\n" +
              '1: /bin/sh: curl: not found\n' +
              '1: /bin/sh: curl: not found\n' +
              '\n' +
              "$ docker exec c node -e \"fetch('http://127.0.0.1:3000/health').then(r=>r.text()).then(t=>console.log('app says:',t))\"\n" +
              'app says: ok',
            ),
            'Đo trên máy này. Container bị đánh dấu không khoẻ mà vẫn chạy. Thứ thật sự hỏng là gì?' + code(
              "$ docker inspect c --format 'health={{.State.Health.Status}} status={{.State.Status}} restarts={{.RestartCount}}'\n" +
              'health=unhealthy status=running restarts=0\n' +
              '\n' +
              "$ docker inspect c --format '{{range .State.Health.Log}}{{.ExitCode}}: {{.Output}}{{end}}'\n" +
              '1: /bin/sh: curl: not found\n' +
              '1: /bin/sh: curl: not found\n' +
              '\n' +
              "$ docker exec c node -e \"fetch('http://127.0.0.1:3000/health').then(r=>r.text()).then(t=>console.log('app says:',t))\"\n" +
              'app says: ok',
            ),
          ),
          options: [
            B(
              'The CHECK, not the service: it calls a binary this image does not ship, so it fails forever while the application answers perfectly. Inside a Node image use <code>node -e</code>; inside distroless use the app\'s own binary; and verify the check with <code>docker exec</code> before trusting its verdict',
              'PHÉP KIỂM, không phải dịch vụ: nó gọi một chương trình mà cái ảnh này không giao, nên nó hỏng mãi mãi trong khi ứng dụng trả lời hoàn hảo. Trong một ảnh Node hãy dùng <code>node -e</code>; trong distroless hãy dùng chính chương trình của ứng dụng; và hãy kiểm phép kiểm bằng <code>docker exec</code> trước khi tin vào phán quyết của nó',
            ),
            B(
              'The application: it answers on <code>127.0.0.1</code> but the healthcheck runs from outside the network namespace, so a check that works must use the container name instead of loopback',
              'Ứng dụng: nó trả lời ở <code>127.0.0.1</code> nhưng healthcheck chạy từ ngoài network namespace, nên một phép kiểm chạy được phải dùng tên container thay cho loopback',
            ),
            B(
              'The restart policy: with <code>restarts=0</code> Docker never acted on the unhealthy state, and setting <code>restart: on-failure</code> is what makes an unhealthy container recover',
              'Chính sách khởi động lại: với <code>restarts=0</code> thì Docker chưa hề xử lý trạng thái không khoẻ, và đặt <code>restart: on-failure</code> mới là thứ giúp một container không khoẻ hồi phục',
            ),
            B(
              'The exit code: a healthcheck must return 0 or 1 and this one returned 1 twice, which Docker reads as an error in the check protocol rather than as a failing check',
              'Mã thoát: một healthcheck phải trả về 0 hoặc 1 mà cái này trả về 1 hai lần, và Docker đọc đó là một lỗi trong giao thức kiểm chứ không phải một phép kiểm không đạt',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This project burned about 25 seconds on every deploy for months on exactly this — a frontend check calling <code>wget</code> inside a container whose Dockerfile deliberately installs neither <code>wget</code> nor <code>curl</code>. It failed every time, the loop ran all its retries, and nothing was ever checked. Note also what the status line proves: an unhealthy container keeps running and Docker never restarts it. Only something else acts on health — <code>depends_on: condition: service_healthy</code>, an orchestrator, a load balancer, or your deploy script.',
            'Dự án này đốt khoảng 25 giây mỗi lượt deploy suốt nhiều tháng vì đúng chuyện này — một phép kiểm frontend gọi <code>wget</code> bên trong một container mà Dockerfile của nó cố ý không cài cả <code>wget</code> lẫn <code>curl</code>. Nó hỏng lần nào cũng hỏng, vòng lặp quay hết số lần thử, và chẳng có gì được kiểm cả. Cũng để ý dòng trạng thái chứng minh điều gì: một container không khoẻ vẫn chạy tiếp và Docker không bao giờ khởi động lại nó. Chỉ có thứ khác mới hành động dựa trên sức khoẻ — <code>depends_on: condition: service_healthy</code>, một bộ điều phối, một bộ cân bằng tải, hay script deploy của bạn.',
          ),
        }),

        // q27 · đáp án 1
        mcq({
          prompt: B(
            'Measured. The container was never started, yet a file came out of it. When is this the right tool?' + code(
              '$ cid=$(docker create nginx:1.27-alpine)\n' +
              '$ docker cp "$cid:/etc/nginx/nginx.conf" - | tar -t\n' +
              'nginx.conf\n' +
              "$ docker ps -a --filter id=$cid --format '{{.Status}}'\n" +
              'Created',
            ),
            'Đo thật. Container chưa từng được khởi chạy, vậy mà một file vẫn được lấy ra. Khi nào thì đây là công cụ đúng?' + code(
              '$ cid=$(docker create nginx:1.27-alpine)\n' +
              '$ docker cp "$cid:/etc/nginx/nginx.conf" - | tar -t\n' +
              'nginx.conf\n' +
              "$ docker ps -a --filter id=$cid --format '{{.Status}}'\n" +
              'Created',
            ),
          ),
          options: [
            B(
              'When the image is too large to pull in full: <code>create</code> fetches only the manifest, so <code>cp</code> streams the one layer that holds the file you asked for',
              'Khi cái ảnh quá lớn để kéo trọn: <code>create</code> chỉ lấy manifest, nên <code>cp</code> chảy về đúng cái tầng chứa file bạn hỏi',
            ),
            B(
              'When the ENTRYPOINT is the thing that is broken, or the image has no shell to <code>exec</code> into — <code>create</code> gives you a container filesystem you can copy from without ever running the entrypoint, and <code>docker cp</code> also works on a stopped container',
              'Khi chính ENTRYPOINT là thứ đang hỏng, hoặc cái ảnh không có shell nào để <code>exec</code> vào — <code>create</code> cho bạn một hệ thống file container để chép ra mà không hề chạy entrypoint, và <code>docker cp</code> cũng chạy được với container đã dừng',
            ),
            B(
              'When you need the file exactly as the running process would see it, including anything the entrypoint generates at start-up, which a plain <code>docker run</code> would overwrite',
              'Khi bạn cần file đúng như tiến trình đang chạy nhìn thấy nó, kể cả thứ mà entrypoint sinh ra lúc khởi động, thứ mà một lệnh <code>docker run</code> thường sẽ ghi đè',
            ),
            B(
              'When the container must not appear in <code>docker ps -a</code>, since a created-but-never-started container is not recorded in the daemon\'s state and leaves nothing to clean up',
              'Khi container không được xuất hiện trong <code>docker ps -a</code>, vì một container đã tạo mà chưa từng khởi chạy thì không được ghi vào trạng thái của tiến trình nền và chẳng để lại gì phải dọn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'It is genuinely recorded — the STATUS line says <code>Created</code>, and you should <code>docker rm</code> it afterwards. Pair it with <code>--entrypoint sh</code> for images that do have a shell, and with a sidecar (<code>--pid container:X --network container:X</code>) reading <code>/proc/1/root/</code> for a running one that has none, and there is almost nothing you cannot inspect. The general habit it belongs to: when a container will not start, <code>docker ps -a</code> first — the STATUS column distinguishes <code>Created</code> (never started) from <code>Exited (1)</code> (ran and failed) from <code>Restarting</code> before you read a single log line.',
            'Nó CÓ được ghi lại — dòng STATUS ghi <code>Created</code>, và sau đó bạn nên <code>docker rm</code> nó đi. Hãy ghép nó với <code>--entrypoint sh</code> cho những ảnh có shell, và với một container phụ trợ (<code>--pid container:X --network container:X</code>) đọc <code>/proc/1/root/</code> cho một container đang chạy mà không có shell, thế là gần như không còn gì bạn không soi được. Thói quen chung mà nó thuộc về: khi một container không khởi động, hãy <code>docker ps -a</code> trước — cột STATUS phân biệt <code>Created</code> (chưa từng khởi chạy) với <code>Exited (1)</code> (đã chạy rồi hỏng) với <code>Restarting</code> trước khi bạn đọc một dòng log nào.',
          ),
        }),

        // q28 · đáp án 0
        mcq({
          prompt: B(
            'Real BuildKit output, then a technique. What does the second command buy you?' + code(
              '$ docker build -t app .\n' +
              'Dockerfile:5\n' +
              '--------------------\n' +
              '   3 |     FROM deps AS build\n' +
              '   4 |     COPY src /app/src\n' +
              '   5 | &gt;&gt;&gt; RUN test -f /app/src/MISSING.txt\n' +
              '   6 |     FROM alpine:3.20\n' +
              '--------------------\n' +
              'ERROR: failed to solve: process "/bin/sh -c test -f /app/src/MISSING.txt"\n' +
              'did not complete successfully: exit code: 1\n' +
              '\n' +
              '$ docker build --target deps -t app:dbg .\n' +
              "$ docker run --rm app:dbg sh -c 'ls -la /app'\n" +
              'total 12\n' +
              '-rw-r--r--    1 root     root             4 Sep 10 00:06 dep.txt',
            ),
            'Output thật của BuildKit, rồi tới một kỹ thuật. Câu lệnh thứ hai cho bạn cái gì?' + code(
              '$ docker build -t app .\n' +
              'Dockerfile:5\n' +
              '--------------------\n' +
              '   3 |     FROM deps AS build\n' +
              '   4 |     COPY src /app/src\n' +
              '   5 | &gt;&gt;&gt; RUN test -f /app/src/MISSING.txt\n' +
              '   6 |     FROM alpine:3.20\n' +
              '--------------------\n' +
              'ERROR: failed to solve: process "/bin/sh -c test -f /app/src/MISSING.txt"\n' +
              'did not complete successfully: exit code: 1\n' +
              '\n' +
              '$ docker build --target deps -t app:dbg .\n' +
              "$ docker run --rm app:dbg sh -c 'ls -la /app'\n" +
              'total 12\n' +
              '-rw-r--r--    1 root     root             4 Sep 10 00:06 dep.txt',
            ),
          ),
          options: [
            B(
              '<code>--target</code> stops the build at a named stage, so you get an image of the state just BEFORE the failure and can run the failing command by hand — listing files, checking variables and iterating in seconds instead of rebuilding each time',
              '<code>--target</code> dừng lượt dựng ở một stage có tên, nên bạn có một cái ảnh của trạng thái ngay TRƯỚC chỗ hỏng và chạy tay được câu lệnh đang hỏng — liệt kê file, kiểm biến và lặp trong vài giây thay vì dựng lại mỗi lần',
            ),
            B(
              '<code>--target</code> re-runs the build with the failing instruction skipped, which is how you confirm that the rest of the Dockerfile is correct before fixing the one line',
              '<code>--target</code> chạy lại lượt dựng với chỉ thị đang hỏng bị bỏ qua, và đó là cách xác nhận phần còn lại của Dockerfile là đúng trước khi sửa một dòng kia',
            ),
            B(
              '<code>--target</code> tags every intermediate stage so they survive a <code>docker builder prune</code>, which is what lets you compare two builds layer by layer afterwards',
              '<code>--target</code> gắn tag cho mọi stage trung gian để chúng sống sót qua <code>docker builder prune</code>, và đó là thứ cho phép bạn so hai lượt dựng theo từng tầng về sau',
            ),
            B(
              '<code>--target</code> switches BuildKit into a single-threaded mode so the interleaved progress output cannot hide the failing step behind a parallel stage',
              '<code>--target</code> chuyển BuildKit sang chế độ một luồng để phần output tiến độ đan xen không thể giấu bước đang hỏng sau một stage chạy song song',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read BuildKit output bottom-up: the last line names the failing command and its exit code, the block above it points at the exact Dockerfile line with two lines of context, and above that is the command\'s own output with elapsed-second prefixes. <code>--progress=plain</code> turns off the collapsing display when the interleaving hides something, and <code>buildx debug --invoke</code> drops you straight into a shell at the failing step with everything built so far still there.',
            'Hãy đọc output của BuildKit từ dưới lên: dòng cuối gọi tên câu lệnh đang hỏng và mã thoát của nó, khối phía trên chỉ đúng dòng trong Dockerfile kèm hai dòng ngữ cảnh, và phía trên nữa là output của chính câu lệnh đó với tiền tố số giây đã trôi. Cờ <code>--progress=plain</code> tắt màn hình gom gọn khi phần đan xen giấu mất thứ gì đó, còn <code>buildx debug --invoke</code> thả bạn thẳng vào một shell tại bước đang hỏng với mọi thứ đã dựng được vẫn còn nguyên.',
          ),
        }),

        // q29 · đáp án 2
        mcq({
          prompt: B(
            'A build is green on a developer\'s Mac and red on the Linux runner, every time. Which four flags reproduce nearly all of these locally, and what is the classic cause?' + code(
              '$ git stash -u\n' +
              '$ docker build --no-cache --pull --platform linux/amd64 -f Dockerfile.backend -t api:ci .\n' +
              '17.4 src/routes/index.ts(8,24): error TS2307: Cannot find module \'./Auth.routes\'\n' +
              '$ git stash pop',
            ),
            'Một lượt dựng xanh trên máy Mac của lập trình viên và đỏ trên máy chạy Linux, lần nào cũng vậy. Bốn thứ nào tái hiện gần hết các ca đó ngay tại máy, và nguyên nhân kinh điển là gì?' + code(
              '$ git stash -u\n' +
              '$ docker build --no-cache --pull --platform linux/amd64 -f Dockerfile.backend -t api:ci .\n' +
              '17.4 src/routes/index.ts(8,24): error TS2307: Cannot find module \'./Auth.routes\'\n' +
              '$ git stash pop',
            ),
          ),
          options: [
            B(
              'A missing registry token: the local Docker config has credentials the runner does not, so a private base image resolves locally and fails in CI with a module error from the wrong image',
              'Thiếu một token registry: cấu hình Docker tại máy có thông tin đăng nhập mà máy chạy CI không có, nên một ảnh nền riêng tư phân giải được tại chỗ và hỏng trong CI với một lỗi module đến từ cái ảnh sai',
            ),
            B(
              'A different Node minor version on the runner, which changes how TypeScript resolves relative imports — pinning the base image to an exact patch version is the fix',
              'Một phiên bản Node phụ khác trên máy chạy CI, thứ làm đổi cách TypeScript phân giải các lệnh import tương đối — ghim ảnh nền vào đúng một bản vá cụ thể là cách chữa',
            ),
            B(
              '<code>--no-cache</code>, <code>--pull</code>, <code>--platform linux/amd64</code> and a stashed working tree. The cause here is CASE SENSITIVITY: <code>./Auth.routes</code> resolves on a case-insensitive macOS filesystem and fails on Linux, where the file is <code>auth.routes.ts</code>',
              '<code>--no-cache</code>, <code>--pull</code>, <code>--platform linux/amd64</code> và một cây làm việc đã stash. Nguyên nhân ở đây là PHÂN BIỆT HOA THƯỜNG: <code>./Auth.routes</code> phân giải được trên hệ thống file macOS không phân biệt hoa thường và hỏng trên Linux, nơi file tên là <code>auth.routes.ts</code>',
            ),
            B(
              'A <code>.dockerignore</code> in the wrong directory: it must sit next to the Dockerfile, and the runner reads the context root instead, which excludes the routes directory entirely',
              'Một file <code>.dockerignore</code> đặt sai thư mục: nó phải nằm cạnh Dockerfile, còn máy chạy CI lại đọc ở gốc ngữ cảnh, và điều đó loại hẳn thư mục routes ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A CI-only failure is never random, and there are only about seven places it hides: a file excluded by <code>.dockerignore</code>, a stale local cache, uncommitted files, case sensitivity, architecture, memory on the runner, and secrets or network access one side has and the other does not. The four flags above cover the first five directly. Note the last option has the <code>.dockerignore</code> rule backwards: it must sit next to the build CONTEXT root, not next to the Dockerfile, when those differ.',
            'Một lỗi chỉ xảy ra trong CI thì không bao giờ ngẫu nhiên, và nó chỉ trốn được ở khoảng bảy chỗ: một file bị <code>.dockerignore</code> loại ra, một bộ đệm cũ tại máy, file chưa commit, phân biệt hoa thường, kiến trúc, bộ nhớ của máy chạy CI, và bí mật hay quyền ra mạng mà bên này có bên kia không. Bốn thứ ở trên phủ trực tiếp năm cái đầu. Để ý lựa chọn cuối nói ngược quy tắc <code>.dockerignore</code>: nó phải nằm cạnh gốc NGỮ CẢNH dựng, không phải cạnh Dockerfile, khi hai chỗ đó khác nhau.',
          ),
        }),

        // q30 · đáp án 3
        mcq({
          prompt: B(
            'Measured. The service as defined dies before it can log anything. What does the second command give you that reading the logs cannot?' + code(
              '$ docker compose up -d\n' +
              'Error response from daemon: … error during container init:\n' +
              'exec: "/bin/nope": stat /bin/nope: no such file or directory\n' +
              "$ docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'\n" +
              'SERVICE   STATUS\n' +
              'api       Created\n' +
              '\n' +
              "$ docker compose run --rm --entrypoint sh api -c 'env | grep -E \"DATABASE_URL|NODE_ENV\"'\n" +
              'DATABASE_URL=postgres://demo@db:5432/demo\n' +
              'NODE_ENV=production',
            ),
            'Đo thật. Dịch vụ như đang khai chết trước khi kịp ghi log gì. Câu lệnh thứ hai cho bạn thứ mà đọc log không cho được là gì?' + code(
              '$ docker compose up -d\n' +
              'Error response from daemon: … error during container init:\n' +
              'exec: "/bin/nope": stat /bin/nope: no such file or directory\n' +
              "$ docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'\n" +
              'SERVICE   STATUS\n' +
              'api       Created\n' +
              '\n' +
              "$ docker compose run --rm --entrypoint sh api -c 'env | grep -E \"DATABASE_URL|NODE_ENV\"'\n" +
              'DATABASE_URL=postgres://demo@db:5432/demo\n' +
              'NODE_ENV=production',
            ),
          ),
          options: [
            B(
              'A container built from the base image without the project\'s configuration, which is what isolates a Dockerfile problem from a compose problem',
              'Một container dựng từ ảnh nền mà không kèm cấu hình của dự án, và đó là thứ tách một vấn đề của Dockerfile khỏi một vấn đề của compose',
            ),
            B(
              'The logs of the failed container, recovered from the writable layer — <code>run</code> reattaches to the container that just died rather than creating a new one',
              'Log của container đã hỏng, lấy lại từ tầng ghi được — <code>run</code> nối lại vào đúng cái container vừa chết chứ không tạo cái mới',
            ),
            B(
              'A dry run that reports what the service would do without starting anything, which is the only safe way to inspect a service on a production host',
              'Một lượt chạy thử báo lại dịch vụ sẽ làm gì mà không khởi chạy thứ gì, và đó là cách an toàn duy nhất để soi một dịch vụ trên máy chủ production',
            ),
            B(
              'The service\'s EXACT image, environment, networks and mounts — but with a shell instead of the failing command. From there you run the real command by hand and watch it fail with your hands on the keyboard, which is a completely different experience from reading its logs afterwards',
              'ĐÚNG cái ảnh, đúng biến môi trường, đúng mạng và đúng phép gắn của dịch vụ — nhưng với một cái shell thay cho câu lệnh đang hỏng. Từ đó bạn chạy tay câu lệnh thật và nhìn nó hỏng khi tay đang đặt trên bàn phím, một trải nghiệm khác hẳn việc đọc log của nó sau khi mọi chuyện đã rồi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Note what <code>docker compose ps -a</code> already told you before any of this: <code>Created</code> means the container never started, so <code>docker logs</code> is empty by design and the real message is on stderr from the CLI. That is the layer-first method — image, container configuration, the process inside, or the environment around it — and naming the layer eliminates three quarters of the possibilities before you run a diagnostic. Under pressure, change one thing at a time, and treat a rollback that buys quiet time as a legitimate first move.',
            'Để ý <code>docker compose ps -a</code> đã nói với bạn điều gì trước tất cả những thứ này: <code>Created</code> nghĩa là container chưa từng khởi chạy, nên <code>docker logs</code> rỗng theo đúng thiết kế và thông báo thật nằm ở stderr của CLI. Đó chính là phương pháp xác định TẦNG trước — cái ảnh, cấu hình container, tiến trình bên trong, hay môi trường xung quanh nó — và gọi tên được cái tầng là loại bỏ ba phần tư khả năng trước khi chạy một công cụ chẩn đoán nào. Dưới áp lực, hãy đổi một thứ mỗi lần, và coi một cú quay lui mua lấy chút thời gian yên tĩnh là một nước đi đầu tiên chính đáng.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q31 — Merge and interpolate a compose file (chapter 9).</b> Implement what <code>docker compose config</code> does: apply the override, then substitute the variables.</p>' +
            '<p><code>thay(s, env)</code> replaces every <code>${...}</code> in a string:</p>' +
            '<ul>' +
            '<li><code>${VAR}</code> → the value, or the empty string when unset.</li>' +
            '<li><code>${VAR:-default}</code> → the value, or <code>default</code> when the variable is unset OR empty.</li>' +
            '<li><code>${VAR:?message}</code> → the value, or <b>throw</b> <code>new Error("required variable " + VAR + " is missing a value: " + message)</code> when unset or empty.</li>' +
            '</ul>' +
            '<p><code>hopNhat(base, over)</code> merges one override onto one base service, with compose\'s three rules:</p>' +
            '<ul>' +
            '<li>The keys <code>ports</code>, <code>volumes</code>, <code>dns</code> and <code>expose</code> are sequences — <b>append</b> the override\'s entries after the base\'s.</li>' +
            '<li>A plain object (a map, such as <code>environment</code>) is <b>merged key by key</b>, the override winning per key.</li>' +
            '<li>Everything else — including an array such as <code>command</code> — is a scalar and is <b>replaced</b>.</li>' +
            '</ul>' +
            '<p><code>dungFile(base, over, env)</code> merges, then walks the whole result and calls <code>thay</code> on every string, at any depth. If anything throws, return <code>{ loi: &lt;the message&gt; }</code> instead.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Hợp nhất và thay biến cho một file compose (chương 9).</b> Hãy cài đặt đúng thứ <code>docker compose config</code> làm: áp phần ghi đè, rồi thay các biến.</p>' +
            '<p><code>thay(s, env)</code> thay mọi <code>${...}</code> trong một chuỗi:</p>' +
            '<ul>' +
            '<li><code>${VAR}</code> → giá trị, hoặc chuỗi rỗng khi biến chưa đặt.</li>' +
            '<li><code>${VAR:-mặc định}</code> → giá trị, hoặc <code>mặc định</code> khi biến chưa đặt HOẶC rỗng.</li>' +
            '<li><code>${VAR:?thông báo}</code> → giá trị, hoặc <b>ném</b> <code>new Error("required variable " + VAR + " is missing a value: " + thông báo)</code> khi chưa đặt hoặc rỗng.</li>' +
            '</ul>' +
            '<p><code>hopNhat(base, over)</code> hợp nhất một phần ghi đè lên một dịch vụ nền, theo ba quy tắc của compose:</p>' +
            '<ul>' +
            '<li>Các khoá <code>ports</code>, <code>volumes</code>, <code>dns</code> và <code>expose</code> là dãy — <b>nối thêm</b> các phần tử của file ghi đè vào sau phần tử của file nền.</li>' +
            '<li>Một object thường (một map, ví dụ <code>environment</code>) thì <b>hợp nhất theo từng khoá</b>, file ghi đè thắng ở từng khoá.</li>' +
            '<li>Mọi thứ còn lại — kể cả một mảng như <code>command</code> — là giá trị đơn và bị <b>thay thế</b>.</li>' +
            '</ul>' +
            '<p><code>dungFile(base, over, env)</code> hợp nhất, rồi đi khắp kết quả và gọi <code>thay</code> lên mọi chuỗi, ở mọi độ sâu. Nếu có gì ném lỗi thì trả về <code>{ loi: &lt;thông báo&gt; }</code> thay vì kết quả.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode: "// \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nconst BASE = {\n  image: 'ghcr.io/me/api:${TAG:-latest}',\n  command: ['node', 'dist/index.js'],\n  restart: 'unless-stopped',\n  environment: { NODE_ENV: 'production', KEEP_ME: 'yes', PORT: '${PORT:-3000}' },\n  ports: ['${HTTP_PORT:-8080}:3000'],\n  volumes: ['certs:/etc/letsencrypt'],\n};\nconst OVERRIDE = {\n  command: ['npm', 'run', 'dev'],\n  environment: { NODE_ENV: 'development', DEBUG: '${DEBUG:?set DEBUG for the dev override}' },\n  ports: ['9229:9229'],\n  volumes: ['.:/app', '/app/node_modules'],\n};\nconst CA = [\n  { ten: 'no vars',      env: { DEBUG: '1' } },\n  { ten: 'tag + port',   env: { DEBUG: '1', TAG: '1.4.2', HTTP_PORT: '80' } },\n  { ten: 'empty PORT',   env: { DEBUG: '1', PORT: '' } },\n  { ten: 'DEBUG unset',  env: {} },\n];\n\n// \u2500\u2500 VI\u1ebeT L\u1edcI GI\u1ea2I C\u1ee6A B\u1ea0N \u1ede \u0110\u00c2Y \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nfunction thay(s, env) {\n  // TODO\n}\n\nfunction hopNhat(base, over) {\n  // TODO\n}\n\nfunction dungFile(base, over, env) {\n  // TODO\n}\n\n// \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfor (const c of CA) {\n  const r = dungFile(BASE, OVERRIDE, c.env);\n  console.log('== ' + c.ten);\n  if (r.loi) { console.log('  error: ' + r.loi); continue; }\n  console.log('  image=' + r.image + ' command=' + r.command.join(' ') + ' restart=' + r.restart);\n  console.log('  env=' + JSON.stringify(r.environment));\n  console.log('  ports=' + JSON.stringify(r.ports) + ' volumes=' + JSON.stringify(r.volumes));\n}\n",
          expectedOutput: "== no vars\n  image=ghcr.io/me/api:latest command=npm run dev restart=unless-stopped\n  env={\"NODE_ENV\":\"development\",\"KEEP_ME\":\"yes\",\"PORT\":\"3000\",\"DEBUG\":\"1\"}\n  ports=[\"8080:3000\",\"9229:9229\"] volumes=[\"certs:/etc/letsencrypt\",\".:/app\",\"/app/node_modules\"]\n== tag + port\n  image=ghcr.io/me/api:1.4.2 command=npm run dev restart=unless-stopped\n  env={\"NODE_ENV\":\"development\",\"KEEP_ME\":\"yes\",\"PORT\":\"3000\",\"DEBUG\":\"1\"}\n  ports=[\"80:3000\",\"9229:9229\"] volumes=[\"certs:/etc/letsencrypt\",\".:/app\",\"/app/node_modules\"]\n== empty PORT\n  image=ghcr.io/me/api:latest command=npm run dev restart=unless-stopped\n  env={\"NODE_ENV\":\"development\",\"KEEP_ME\":\"yes\",\"PORT\":\"3000\",\"DEBUG\":\"1\"}\n  ports=[\"8080:3000\",\"9229:9229\"] volumes=[\"certs:/etc/letsencrypt\",\".:/app\",\"/app/node_modules\"]\n== DEBUG unset\n  error: required variable DEBUG is missing a value: set DEBUG for the dev override",
          sampleSolution: "function thay(s, env) {\n  return s.replace(/\\$\\{([A-Za-z_][A-Za-z0-9_]*)(?::([-?])([^}]*))?\\}/g, (_, ten, dau, phan) => {\n    const co = Object.prototype.hasOwnProperty.call(env, ten) && env[ten] !== '';\n    if (co) return env[ten];\n    if (dau === '-') return phan;\n    if (dau === '?') throw new Error('required variable ' + ten + ' is missing a value: ' + phan);\n    return '';\n  });\n}\n\nconst NOI_THEM = new Set(['ports', 'volumes', 'dns', 'expose']);\n\nfunction hopNhat(base, over) {\n  const ra = { ...base };\n  for (const [k, v] of Object.entries(over)) {\n    const cu = base[k];\n    if (NOI_THEM.has(k)) ra[k] = [...(cu || []), ...v];\n    else if (v && typeof v === 'object' && !Array.isArray(v)) ra[k] = { ...(cu || {}), ...v };\n    else ra[k] = v;\n  }\n  return ra;\n}\n\nfunction dungFile(base, over, env) {\n  let hop;\n  try {\n    hop = hopNhat(base, over);\n  } catch (e) {\n    return { loi: e.message };\n  }\n  const di = (x) => (Array.isArray(x) ? x.map(di)\n    : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, di(v)]))\n    : typeof x === 'string' ? thay(x, env) : x);\n  try {\n    return di(hop);\n  } catch (e) {\n    return { loi: e.message };\n  }\n}\n",
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Resolve the start order (chapters 9 + 10).</b> Given a stack, work out what compose would start, in what order, and what it would refuse to start. Implement <code>khoiDong(stack)</code>.</p>' +
            '<p>Each service has <code>{ name, healthcheck, exits, depends }</code>, where <code>exits</code> is <code>null</code> for a long-running service and a number for a job, and <code>depends</code> is a list of <code>[name, condition]</code> pairs.</p>' +
            '<p>Resolve repeatedly, scanning the array in order, until nothing changes. A service gets a status the moment it can:</p>' +
            '<ul>' +
            '<li><b>config-error</b> — it depends on a name that is not in the stack, or it uses <code>service_healthy</code> against a dependency whose <code>healthcheck</code> is false.</li>' +
            '<li><b>blocked</b> — some dependency is already resolved in a way that can never satisfy it: the dependency is <code>blocked</code>/<code>config-error</code>; or the condition is <code>service_healthy</code> and the dependency is not <code>started</code>; or the condition is <code>service_completed_successfully</code> and the dependency is not <code>exited-ok</code>; or the condition is <code>service_started</code> and the dependency is <code>exited-fail</code>.</li>' +
            '<li>Otherwise, once every dependency is resolved and satisfied: <b>started</b> when <code>exits</code> is null, <b>exited-ok</b> when it is 0, <b>exited-fail</b> otherwise.</li>' +
            '</ul>' +
            '<p>Anything still unresolved when nothing can change any more is part of a dependency cycle — give it the status <b>cycle</b>, in <code>stack</code> order.</p>' +
            '<p>Return an array of <code>{ name, status }</code> in RESOLUTION order, which is the start order.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Suy ra thứ tự khởi động (chương 9 + 10).</b> Cho một stack, hãy tính xem compose sẽ khởi chạy những gì, theo thứ tự nào, và nó sẽ từ chối khởi chạy cái gì. Hãy cài đặt <code>khoiDong(stack)</code>.</p>' +
            '<p>Mỗi dịch vụ có <code>{ name, healthcheck, exits, depends }</code>, trong đó <code>exits</code> là <code>null</code> với một dịch vụ chạy dài và là một con số với một công việc, còn <code>depends</code> là danh sách các cặp <code>[tên, điều kiện]</code>.</p>' +
            '<p>Hãy giải lặp đi lặp lại, quét mảng theo đúng thứ tự, cho tới khi không còn gì đổi. Một dịch vụ nhận trạng thái ngay khi nó có thể:</p>' +
            '<ul>' +
            '<li><b>config-error</b> — nó phụ thuộc vào một cái tên không có trong stack, hoặc nó dùng <code>service_healthy</code> với một phụ thuộc có <code>healthcheck</code> là false.</li>' +
            '<li><b>blocked</b> — một phụ thuộc nào đó đã có trạng thái theo kiểu không bao giờ thoả được: phụ thuộc đó là <code>blocked</code>/<code>config-error</code>; hoặc điều kiện là <code>service_healthy</code> mà phụ thuộc không phải <code>started</code>; hoặc điều kiện là <code>service_completed_successfully</code> mà phụ thuộc không phải <code>exited-ok</code>; hoặc điều kiện là <code>service_started</code> mà phụ thuộc là <code>exited-fail</code>.</li>' +
            '<li>Còn lại, khi mọi phụ thuộc đã có trạng thái và đều thoả: <b>started</b> nếu <code>exits</code> là null, <b>exited-ok</b> nếu là 0, <b>exited-fail</b> nếu khác.</li>' +
            '</ul>' +
            '<p>Thứ nào vẫn chưa có trạng thái khi không còn gì thay đổi được nữa thì thuộc một vòng phụ thuộc — hãy cho nó trạng thái <b>cycle</b>, theo thứ tự trong <code>stack</code>.</p>' +
            '<p>Trả về một mảng <code>{ name, status }</code> theo thứ tự ĐƯỢC GIẢI, tức là thứ tự khởi động.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode: "// \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nconst STACK = [\n  { name: 'db',      healthcheck: true,  exits: null, depends: [] },\n  { name: 'cache',   healthcheck: false, exits: null, depends: [] },\n  { name: 'migrate', healthcheck: false, exits: 0,    depends: [['db', 'service_healthy']] },\n  { name: 'seed',    healthcheck: false, exits: 1,    depends: [['migrate', 'service_completed_successfully']] },\n  { name: 'api',     healthcheck: true,  exits: null, depends: [['db', 'service_healthy'], ['migrate', 'service_completed_successfully']] },\n  { name: 'report',  healthcheck: false, exits: null, depends: [['seed', 'service_completed_successfully']] },\n  { name: 'worker',  healthcheck: false, exits: null, depends: [['cache', 'service_healthy']] },\n  { name: 'web',     healthcheck: false, exits: null, depends: [['api', 'service_started']] },\n  { name: 'left',    healthcheck: false, exits: null, depends: [['right', 'service_started']] },\n  { name: 'right',   healthcheck: false, exits: null, depends: [['left', 'service_started']] },\n];\n\n// \u2500\u2500 VI\u1ebeT L\u1edcI GI\u1ea2I C\u1ee6A B\u1ea0N \u1ede \u0110\u00c2Y \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nfunction khoiDong(stack) {\n  // TODO\n}\n\n// \u2500\u2500 \u0110\u1ec0 CHO S\u1eb4N \u2014 KH\u00d4NG S\u1eecA \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nconst ra = khoiDong(STACK);\nra.forEach((r, i) => console.log(String(i + 1).padStart(2) + '. ' + r.name.padEnd(9) + r.status));\nconst d = {};\nfor (const r of ra) d[r.status] = (d[r.status] || 0) + 1;\nconsole.log('tomTat:', Object.keys(d).sort().map((k) => k + '=' + d[k]).join(' '));\n",
          expectedOutput: " 1. db       started\n 2. cache    started\n 3. migrate  exited-ok\n 4. seed     exited-fail\n 5. api      started\n 6. report   blocked\n 7. worker   config-error\n 8. web      started\n 9. left     cycle\n10. right    cycle\ntomTat: blocked=1 config-error=1 cycle=2 exited-fail=1 exited-ok=1 started=4",
          sampleSolution: "function khoiDong(stack) {\n  const theoTen = new Map(stack.map((s) => [s.name, s]));\n  const trangThai = new Map();\n  const thuTu = [];\n\n  const chotCua = (dich, dieuKien) => {\n    const tt = trangThai.get(dich.name);\n    if (tt === undefined) return 'cho';\n    if (tt === 'blocked' || tt === 'config-error') return 'hong';\n    if (dieuKien === 'service_started') return tt === 'exited-fail' ? 'hong' : 'dat';\n    if (dieuKien === 'service_healthy') return tt === 'started' ? 'dat' : 'hong';\n    return tt === 'exited-ok' ? 'dat' : 'hong';\n  };\n\n  let doi = true;\n  while (doi) {\n    doi = false;\n    for (const s of stack) {\n      if (trangThai.has(s.name)) continue;\n      const thieu = s.depends.find(([d]) => !theoTen.has(d));\n      const khongCheck = s.depends.find(([d, c]) => c === 'service_healthy' && theoTen.get(d) && !theoTen.get(d).healthcheck);\n      if (thieu || khongCheck) {\n        trangThai.set(s.name, 'config-error');\n        thuTu.push(s.name);\n        doi = true;\n        continue;\n      }\n      const cua = s.depends.map(([d, c]) => chotCua(theoTen.get(d), c));\n      if (cua.includes('hong')) {\n        trangThai.set(s.name, 'blocked');\n        thuTu.push(s.name);\n        doi = true;\n        continue;\n      }\n      if (cua.includes('cho')) continue;\n      trangThai.set(s.name, s.exits === null ? 'started' : s.exits === 0 ? 'exited-ok' : 'exited-fail');\n      thuTu.push(s.name);\n      doi = true;\n    }\n  }\n\n  for (const s of stack) if (!trangThai.has(s.name)) { trangThai.set(s.name, 'cycle'); thuTu.push(s.name); }\n  return thuTu.map((n) => ({ name: n, status: trangThai.get(n) }));\n}\n",
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
