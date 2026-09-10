/**
 * Docker — Progress Test 2 (chương s05–s08).
 *
 * Đề tự soạn, bám sát `content/courses/docker/s05…s08`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI đoạn terminal trong đề đều CHẠY THẬT trên máy này, ngày 10/09/2026:
 *   Docker Engine 29.5.3 (client + server), API 1.54, Docker Desktop 4.78.0
 *   (229452), containerd v2.2.4, runc 1.3.5, BuildKit v0.30.0, buildx
 *   v0.34.1-desktop.1, Compose v5.1.4 — nền tảng linux/arm64 trong máy ảo của
 *   Desktop, máy chủ macOS 25.6.0 / Apple M1 Max, 32 GiB RAM, 10 nhân.
 *
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (5.4, phần Pitfall) nói trình dựng `docker` mặc định KHÔNG
 *     xuất được cache, nên `--cache-to` âm thầm vô hiệu. ĐO THẬT: trên trình
 *     `docker` của Desktop 4.78 lệnh in `#10 exporting cache to client
 *     directory` và ghi ra 3,9MB thật (`blobs/`, `index.json`). Đề vì thế
 *     KHÔNG ra câu nào dựa vào cái hạn chế đó; câu 8 hỏi chỗ vẫn đúng là cache
 *     mount không đi theo `--cache-to`.
 *   • Giáo trình (6.2) đo `node:22` 1,13GB · `-slim` 224MB · `-alpine` 185MB.
 *     ĐO THẬT trên linux/arm64: **1,63GB · 349MB · 229MB**. Tỉ lệ giữ nguyên,
 *     con số thì không — đề dùng số của máy này và nói rõ nền tảng.
 *   • Giáo trình (7.3, Trap 2) nói file container ghi qua bind mount thuộc về
 *     root trên máy chủ. ĐO THẬT trên Docker Desktop macOS: file hiện ra thuộc
 *     **uid 501**, tức người dùng máy chủ — lớp chia sẻ file của Desktop ánh xạ
 *     lại quyền sở hữu. Đó là chuyện của Linux trần (chính giáo trình cũng ghi
 *     ở dòng "Docker Desktop hides it"), nên đề không ra câu dựa vào nó.
 *   • Giáo trình (5.1) nói `touch` một file KHÔNG làm mất hiệu lực cache còn
 *     đổi một byte thì có, và ví dụ in ra 5 rồi 4. ĐO THẬT ở đây khớp về CƠ
 *     CHẾ nhưng số CACHED là 3 rồi ít hơn — số phụ thuộc số chỉ thị trong file.
 *     Đề dùng số đo của chính máy này (câu 1 và câu 2).
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 8 · B 8 · C 7 · D 7.
 *   node -e "import('./content/exams/DOCKER-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DOCKER-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/docker-exam-kit.mjs';

export default {
  course: { slug: 'docker' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 5–8 (cache, small and safe images, data, networking)',
        'Kiểm tra tiến độ 2 — Chương 5–8 (cache, ảnh nhỏ và an toàn, dữ liệu, mạng)',
      ),
      description: B(
        'The middle third of the Docker course: how the build cache decides, instruction ordering, cache mounts and CI cache, multi-stage builds, choosing a base image and the musl trap, cutting megabytes, running a container safely, scanning, volumes and bind mounts, tmpfs and secrets, backup and restore, bridge networks and DNS, publishing ports, and diagnosing what will not connect. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Docker: cache lúc dựng quyết định thế nào, thứ tự chỉ thị, cache mount và cache của CI, dựng nhiều tầng, chọn ảnh nền và cái bẫy musl, cắt bớt megabyte, chạy container an toàn, quét lỗ hổng, volume và bind mount, tmpfs và bí mật, sao lưu và khôi phục, mạng bridge và DNS, công bố cổng, và chẩn đoán thứ không chịu kết nối. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '5–8'),
      questions: [
        /* ── Chương 5 — tầng ảnh, cache & dựng nhanh (8 câu) ─────────────── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'Measured on this machine with BuildKit v0.30. The file was touched but not edited. Why is the cache still complete?' + code(
              '# Dockerfile: FROM · WORKDIR · COPY src ./src · RUN echo … > /marker · CMD\n' +
              '\n' +
              '$ docker build --progress=plain -t p2:1 .   # nothing changed\n' +
              '(CACHED lines: 3)\n' +
              '\n' +
              '$ touch src/app.js\n' +
              '$ docker build --progress=plain -t p2:1 .\n' +
              '(CACHED lines: 3)',
            ),
            'Đo trên máy này với BuildKit v0.30. File bị touch nhưng không sửa nội dung. Vì sao cache vẫn nguyên vẹn?' + code(
              '# Dockerfile: FROM · WORKDIR · COPY src ./src · RUN echo … > /marker · CMD\n' +
              '\n' +
              '$ docker build --progress=plain -t p2:1 .   # không đổi gì\n' +
              '(số dòng CACHED: 3)\n' +
              '\n' +
              '$ touch src/app.js\n' +
              '$ docker build --progress=plain -t p2:1 .\n' +
              '(số dòng CACHED: 3)',
            ),
          ),
          options: [
            B(
              'BuildKit checks modification times only once a day and reuses the previous answer until midnight, so a <code>touch</code> made during the same day is never noticed at all',
              'BuildKit chỉ kiểm mốc thời gian sửa đổi mỗi ngày một lần và dùng lại kết quả cũ tới nửa đêm, nên một lệnh <code>touch</code> trong cùng ngày hoàn toàn không bị để ý',
            ),
            B(
              'The <code>COPY</code> step was already skipped by the previous build, and a step that was CACHED once stays CACHED until the Dockerfile itself is edited on disk',
              'Bước <code>COPY</code> đã bị lượt dựng trước bỏ qua rồi, và một bước đã CACHED một lần thì cứ CACHED cho tới khi chính file Dockerfile bị sửa trên đĩa',
            ),
            B(
              'A COPY step is keyed on the CONTENTS of the files it copies (plus their path and mode), and <code>touch</code> changes only the modification time — BuildKit ignores mtime, unlike the old builder',
              'Một bước COPY lấy khoá theo NỘI DUNG những file nó chép (cộng đường dẫn và quyền), còn <code>touch</code> chỉ đổi mốc thời gian sửa đổi — BuildKit bỏ qua mtime, khác với trình dựng cũ',
            ),
            B(
              'The file lives under <code>src/</code>, and BuildKit hashes a directory once when it first appears in the context rather than re-hashing it on every build',
              'File nằm dưới <code>src/</code>, và BuildKit băm một thư mục đúng một lần khi nó lần đầu xuất hiện trong ngữ cảnh chứ không băm lại ở mỗi lượt dựng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'There are two key rules and this is the second: RUN is keyed on the command STRING, COPY and ADD on the file CONTENTS. Knowing that <code>touch</code> is free matters more than it sounds, because generated files, formatters and editors rewrite timestamps constantly — under the old builder that was enough to throw away a dependency install.',
            'Có hai quy tắc khoá cache và đây là quy tắc thứ hai: RUN lấy khoá theo CHUỖI câu lệnh, còn COPY và ADD lấy theo NỘI DUNG file. Biết rằng <code>touch</code> không tốn gì quan trọng hơn nghe tưởng, vì file sinh tự động, trình định dạng và trình soạn thảo viết lại mốc thời gian liên tục — với trình dựng cũ chừng đó là đủ để vứt cả một lượt cài thư viện.',
          ),
        }),

        // q2 · đáp án 3
        mcq({
          prompt: B(
            'The same project, one byte appended to <code>src/app.js</code>. Why is WORKDIR still CACHED while the RUN below the COPY re-ran?' + code(
              '$ printf \'\\n\' >> src/app.js\n' +
              '$ docker build --progress=plain -t p2:1 .\n' +
              '#6 [2/4] WORKDIR /app\n' +
              '#6 CACHED\n' +
              '#7 [3/4] COPY src ./src\n' +
              '#7 DONE 0.0s\n' +
              '#8 [4/4] RUN echo "step-after-copy" > /marker\n' +
              '#8 DONE 0.1s',
            ),
            'Vẫn dự án đó, thêm đúng một byte vào <code>src/app.js</code>. Vì sao WORKDIR vẫn CACHED còn lệnh RUN nằm dưới COPY thì chạy lại?' + code(
              '$ printf \'\\n\' >> src/app.js\n' +
              '$ docker build --progress=plain -t p2:1 .\n' +
              '#6 [2/4] WORKDIR /app\n' +
              '#6 CACHED\n' +
              '#7 [3/4] COPY src ./src\n' +
              '#7 DONE 0.0s\n' +
              '#8 [4/4] RUN echo "step-after-copy" > /marker\n' +
              '#8 DONE 0.1s',
            ),
          ),
          options: [
            B(
              'A metadata instruction such as WORKDIR is never invalidated by anything, so it is always CACHED regardless of what happens above or below it in the file',
              'Một chỉ thị siêu dữ liệu như WORKDIR không bao giờ bị thứ gì làm mất hiệu lực, nên nó luôn CACHED bất kể điều gì xảy ra phía trên hay phía dưới nó trong file',
            ),
            B(
              'The RUN command writes to <code>/marker</code>, which lives outside <code>/app</code>, and BuildKit re-runs any step whose output path is not under the current WORKDIR',
              'Câu lệnh RUN ghi vào <code>/marker</code>, nằm ngoài <code>/app</code>, và BuildKit chạy lại mọi bước có đường dẫn đầu ra không nằm dưới WORKDIR hiện tại',
            ),
            B(
              'The RUN command string contains a quoted argument, and BuildKit cannot compute a stable key for a quoted string, so such a step is re-run on every build',
              'Chuỗi câu lệnh RUN có một tham số trong dấu nháy, mà BuildKit không tính được khoá ổn định cho chuỗi có dấu nháy, nên bước kiểu đó chạy lại ở mỗi lượt dựng',
            ),
            B(
              'The key of step N includes the key of step N−1, so invalidation only ever cascades DOWNWARD: everything above the changed COPY is untouched, and everything below it re-runs even though its own inputs did not change',
              'Khoá của bước N chứa cả khoá của bước N−1, nên việc mất hiệu lực chỉ lan XUỐNG DƯỚI: mọi thứ phía trên lệnh COPY đã đổi thì nguyên vẹn, còn mọi thứ phía dưới nó chạy lại dù đầu vào của riêng chúng không đổi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'That one sentence is the whole of build performance. It is why ordering beats every other optimisation: put what changes rarely at the top (base image, system packages, dependency manifests and the install) and what changes hourly at the bottom (your source), so a source edit throws away as little as possible. The classic failure is <code>COPY . .</code> above the dependency install, where editing a README reinstalls nine hundred packages.',
            'Đúng một câu đó là toàn bộ chuyện hiệu năng lúc dựng. Nó là lý do thứ tự thắng mọi tối ưu khác: đặt thứ hiếm khi đổi lên trên (ảnh nền, gói hệ thống, file kê khai thư viện và bước cài) và thứ đổi từng giờ xuống dưới (mã nguồn của bạn), để một lần sửa mã vứt đi ít nhất có thể. Kiểu hỏng kinh điển là <code>COPY . .</code> nằm trên bước cài thư viện, khiến sửa một cái README lại cài lại chín trăm gói.',
          ),
        }),

        // q3 · đáp án 0
        mcq({
          prompt: B(
            'Measured. The only difference between the two builds is the value passed to <code>--build-arg</code>. Why did the CACHED count collapse?' + code(
              'FROM alpine:3.20\n' +
              'ARG BUILD_DATE=none\n' +
              'RUN echo "date=$BUILD_DATE" > /d\n' +
              'WORKDIR /app\n' +
              'COPY src ./src\n' +
              '\n' +
              '$ docker build --build-arg BUILD_DATE=A …   -> CACHED lines: 3\n' +
              '$ docker build --build-arg BUILD_DATE=B …   -> CACHED lines: 1',
            ),
            'Đo thật. Khác biệt duy nhất giữa hai lượt dựng là giá trị truyền vào <code>--build-arg</code>. Vì sao số dòng CACHED tụt hẳn?' + code(
              'FROM alpine:3.20\n' +
              'ARG BUILD_DATE=none\n' +
              'RUN echo "date=$BUILD_DATE" > /d\n' +
              'WORKDIR /app\n' +
              'COPY src ./src\n' +
              '\n' +
              '$ docker build --build-arg BUILD_DATE=A …   -> số dòng CACHED: 3\n' +
              '$ docker build --build-arg BUILD_DATE=B …   -> số dòng CACHED: 1',
            ),
          ),
          options: [
            B(
              'An ARG value is an input to the cache key, so changing it invalidates from its declaration downward — which is why <code>--build-arg BUILD_DATE=$(date)</code> near the top of a Dockerfile disables the cache for the whole file',
              'Giá trị của một ARG là đầu vào của khoá cache, nên đổi nó làm mất hiệu lực từ dòng khai báo trở xuống — và đó là lý do <code>--build-arg BUILD_DATE=$(date)</code> đặt gần đầu Dockerfile tắt luôn cache của cả file',
            ),
            B(
              'Passing any <code>--build-arg</code> at all switches BuildKit into a no-cache mode for the whole build, whatever the value is and wherever the ARG is declared',
              'Chỉ cần truyền bất kỳ <code>--build-arg</code> nào là BuildKit chuyển sang chế độ không dùng cache cho cả lượt dựng, bất kể giá trị là gì và ARG khai ở đâu',
            ),
            B(
              'The <code>RUN echo</code> writes a different file, and BuildKit compares the OUTPUT of each step rather than its inputs, so a differing output invalidates the step retroactively',
              'Lệnh <code>RUN echo</code> ghi ra một file khác, và BuildKit so KẾT QUẢ của từng bước chứ không so đầu vào, nên kết quả khác nhau làm bước đó mất hiệu lực ngược lại',
            ),
            B(
              'The <code>ARG</code> line has a default value, and a default that is overridden on the command line forces BuildKit to re-evaluate every instruction that mentions any variable',
              'Dòng <code>ARG</code> có giá trị mặc định, và một giá trị mặc định bị ghi đè trên dòng lệnh buộc BuildKit tính lại mọi chỉ thị có nhắc tới bất kỳ biến nào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Only <code>FROM</code> survived, because it sits above the ARG. This is a surprisingly common accident: a pipeline that stamps a build date or a commit SHA as a build arg at the top of the file, and then wonders why CI never gets a cache hit. If you need such a value, declare the ARG as late as possible — below the expensive steps — or bake it in as a LABEL at the very end.',
            'Chỉ có <code>FROM</code> sống sót, vì nó nằm phía trên dòng ARG. Đây là một tai nạn phổ biến đến bất ngờ: một quy trình đóng dấu ngày dựng hay mã commit vào một build arg ở đầu file, rồi thắc mắc vì sao CI chẳng bao giờ trúng cache. Nếu bạn cần một giá trị như thế, hãy khai ARG càng muộn càng tốt — dưới các bước tốn kém — hoặc nướng nó vào một LABEL ở tận cuối.',
          ),
        }),

        // q4 · đáp án 1
        mcq({
          prompt: B(
            'Real build failure, then the fix, both measured. What is the one-word difference?' + code(
              'FROM alpine:3.20\n' +
              'RUN adduser -D -u 1000 app\n' +
              'USER app\n' +
              'RUN --mount=type=cache,target=/home/app/.npm sh -c \'touch /home/app/.npm/x\'\n' +
              '\n' +
              '#8 0.128 touch: /home/app/.npm/x: Permission denied\n' +
              'ERROR: failed to build: … did not complete successfully: exit code: 1\n' +
              '\n' +
              '# with  ,uid=1000,gid=1000  added to the same mount:\n' +
              '#9 0.110 wrote ok',
            ),
            'Một lượt dựng hỏng thật, rồi cách chữa, cả hai đều đo được. Khác biệt nằm ở đâu?' + code(
              'FROM alpine:3.20\n' +
              'RUN adduser -D -u 1000 app\n' +
              'USER app\n' +
              'RUN --mount=type=cache,target=/home/app/.npm sh -c \'touch /home/app/.npm/x\'\n' +
              '\n' +
              '#8 0.128 touch: /home/app/.npm/x: Permission denied\n' +
              'ERROR: failed to build: … did not complete successfully: exit code: 1\n' +
              '\n' +
              '# thêm  ,uid=1000,gid=1000  vào chính phép mount đó:\n' +
              '#9 0.110 wrote ok',
            ),
          ),
          options: [
            B(
              'A cache mount can only be used by the root user; <code>uid=1000</code> tells BuildKit to run that one instruction as root again and drop back to <code>app</code> afterwards',
              'Cache mount chỉ dùng được bởi root; <code>uid=1000</code> bảo BuildKit chạy riêng chỉ thị đó bằng root rồi hạ lại về <code>app</code> sau đó',
            ),
            B(
              'A cache mount is created owned by root by default, so a step running under <code>USER app</code> cannot write into it — <code>uid=</code>/<code>gid=</code> set the ownership of the mounted directory, and this is the most common reason a cache mount appears to do nothing',
              'Cache mount mặc định được tạo với chủ sở hữu là root, nên một bước chạy dưới <code>USER app</code> không ghi vào đó được — <code>uid=</code>/<code>gid=</code> đặt quyền sở hữu cho thư mục được gắn, và đây là lý do phổ biến nhất khiến một cache mount trông như chẳng làm gì',
            ),
            B(
              'The <code>USER</code> instruction must always come after every <code>RUN --mount</code> in a Dockerfile, and <code>uid=1000</code> is a compatibility shim for files that break that ordering rule',
              'Chỉ thị <code>USER</code> luôn phải đứng sau mọi <code>RUN --mount</code> trong một Dockerfile, và <code>uid=1000</code> chỉ là miếng đệm tương thích cho những file phá vỡ quy tắc thứ tự đó',
            ),
            B(
              'The home directory <code>/home/app</code> did not exist yet because <code>adduser -D</code> does not create one, and <code>uid=1000</code> makes BuildKit create the parent directories on the way',
              'Thư mục nhà <code>/home/app</code> chưa tồn tại vì <code>adduser -D</code> không tạo nó, và <code>uid=1000</code> khiến BuildKit tạo luôn các thư mục cha trên đường đi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The failure mode is worth knowing in both shapes. Here it fails loudly. In a step that tolerates a write failure — <code>npm ci</code> falls back to downloading — it fails quietly instead: the build succeeds, the cache mount stays empty forever, and every build re-downloads everything while you believe the cache is working. Two other cache-mount rules: cache the download directory (<code>~/.npm</code>, <code>~/.cache/pip</code>, <code>/go/pkg/mod</code>) and never the installed tree, and use <code>sharing=locked</code> for apt, which takes a lock.',
            'Kiểu hỏng này đáng biết ở cả hai hình dạng. Ở đây nó hỏng thành tiếng. Trong một bước chịu được lỗi ghi — <code>npm ci</code> sẽ lùi về tải lại — thì nó hỏng lặng lẽ: lượt dựng vẫn xanh, cache mount rỗng mãi mãi, và mọi lượt dựng đều tải lại toàn bộ trong khi bạn tin rằng cache đang chạy. Hai quy tắc khác của cache mount: hãy đệm thư mục TẢI VỀ (<code>~/.npm</code>, <code>~/.cache/pip</code>, <code>/go/pkg/mod</code>) chứ đừng đệm cây đã cài, và dùng <code>sharing=locked</code> cho apt vì nó có giữ khoá.',
          ),
        }),

        // q5 · đáp án 2
        mcq({
          prompt: B(
            'This instruction has been in a Dockerfile for eight months and the image still ships the commit from the day it was first built. Nothing is broken. Why?' + code(
              'RUN git clone https://github.com/me/lib.git /opt/lib',
            ),
            'Chỉ thị này nằm trong một Dockerfile đã tám tháng và cái ảnh vẫn giao đúng commit của ngày dựng lần đầu. Không có gì hỏng. Vì sao?' + code(
              'RUN git clone https://github.com/me/lib.git /opt/lib',
            ),
          ),
          options: [
            B(
              'The registry caches the resulting layer by its digest, and a layer already present in the registry is never rebuilt by any client that has previously pushed it',
              'Registry lưu đệm tầng kết quả theo digest của nó, và một tầng đã có sẵn trên registry thì không client nào từng đẩy nó lên còn dựng lại nữa',
            ),
            B(
              'Git clones the default branch, which stays pinned to whatever the remote HEAD pointed at when the repository was first read by this machine',
              'Git clone nhánh mặc định, và nhánh đó bị ghim vào thứ mà HEAD ở phía xa trỏ tới lúc kho được máy này đọc lần đầu',
            ),
            B(
              'A RUN step is keyed on the command STRING and nothing else — BuildKit has no idea what the command does, so the key is identical every day and the cached result is reused forever',
              'Một bước RUN lấy khoá theo CHUỖI câu lệnh và chỉ thế thôi — BuildKit không hề biết câu lệnh đó làm gì, nên khoá mỗi ngày đều y hệt và kết quả đã đệm được dùng lại mãi mãi',
            ),
            B(
              'The clone writes into <code>/opt</code>, which is outside the build context, and BuildKit does not track changes to paths that no COPY instruction mentions',
              'Lệnh clone ghi vào <code>/opt</code>, nằm ngoài ngữ cảnh dựng, và BuildKit không theo dõi thay đổi ở những đường dẫn mà không lệnh COPY nào nhắc tới',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Correct by Docker\'s rules and wrong in reality. The same trap applies to <code>RUN curl -O https://example.com/latest.tar.gz</code> and to installing a CLI without a version. Two fixes: make the changing thing part of the key by pinning it in the command (<code>git clone --branch v1.4.2</code>), or add a cheap invalidator such as <code>ADD https://api.github.com/repos/me/lib/commits/main /tmp/commit.json</code> just above the clone. The same mechanism is why <code>apt-get update</code> must share a RUN with the install it feeds.',
            'Đúng theo luật của Docker và sai với thực tế. Cùng cái bẫy đó với <code>RUN curl -O https://example.com/latest.tar.gz</code> và với việc cài một công cụ dòng lệnh mà không ghi phiên bản. Hai cách chữa: đưa thứ hay đổi vào khoá bằng cách ghim nó ngay trong câu lệnh (<code>git clone --branch v1.4.2</code>), hoặc thêm một thứ làm mất hiệu lực rẻ tiền như <code>ADD https://api.github.com/repos/me/lib/commits/main /tmp/commit.json</code> ngay phía trên lệnh clone. Cũng cơ chế đó là lý do <code>apt-get update</code> phải nằm chung một RUN với lệnh cài mà nó phục vụ.',
          ),
        }),

        // q6 · đáp án 3
        mcq({
          prompt: B(
            'Real output of a command that builds nothing at all. What is it, and where does it belong?' + code(
              '$ docker build --check -t app .\n' +
              'Check complete, 2 warnings have been found!\n' +
              '\n' +
              'WARNING: LegacyKeyValueFormat - "ENV key=value" should be used instead of\n' +
              'legacy "ENV key value" format\n' +
              'Dockerfile:2\n' +
              '\n' +
              'WARNING: CopyIgnoredFile - Attempting to Copy file "nothere.txt" that is\n' +
              'excluded by .dockerignore\n' +
              'Dockerfile:3',
            ),
            'Output thật của một lệnh không dựng gì cả. Nó là gì, và nên đặt ở đâu?' + code(
              '$ docker build --check -t app .\n' +
              'Check complete, 2 warnings have been found!\n' +
              '\n' +
              'WARNING: LegacyKeyValueFormat - "ENV key=value" should be used instead of\n' +
              'legacy "ENV key value" format\n' +
              'Dockerfile:2\n' +
              '\n' +
              'WARNING: CopyIgnoredFile - Attempting to Copy file "nothere.txt" that is\n' +
              'excluded by .dockerignore\n' +
              'Dockerfile:3',
            ),
          ),
          options: [
            B(
              'A vulnerability scan of the base image, which belongs in a nightly job because it needs to download a vulnerability database before it can say anything',
              'Một lượt quét lỗ hổng của ảnh nền, nên đặt vào một công việc chạy đêm vì nó phải tải cơ sở dữ liệu lỗ hổng về rồi mới nói được gì',
            ),
            B(
              'A dry run of the build that stops before the first RUN, so it reports only problems that would have surfaced in the first two instructions of the file',
              'Một lượt dựng thử dừng lại trước lệnh RUN đầu tiên, nên nó chỉ báo những vấn đề lẽ ra sẽ lộ ra ở hai chỉ thị đầu của file',
            ),
            B(
              'A report on the layer sizes of the previous build, useful for spotting an instruction that added more bytes to the image than the author intended',
              'Một báo cáo về kích thước các tầng của lượt dựng trước, hữu ích để phát hiện một chỉ thị thêm vào ảnh nhiều byte hơn tác giả định',
            ),
            B(
              'BuildKit\'s linter: it parses the Dockerfile without executing anything and reports legacy syntax, undefined variables, COPY sources excluded by <code>.dockerignore</code> and stage names that do not exist — it costs nothing and belongs in CI as its own step',
              'Bộ soi lỗi của BuildKit: nó phân tích Dockerfile mà không chạy gì và báo cú pháp cũ, biến chưa khai, nguồn COPY bị <code>.dockerignore</code> loại ra và tên stage không tồn tại — nó chẳng tốn gì và nên là một bước riêng trong CI',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The second warning is the interesting one: <code>COPY nothere.txt /x</code> would have failed the build, and the linter says so in half a second instead of after the dependency install. This is the class of mistake that otherwise produces a working build with a subtly wrong image — an ignored file that silently never arrives, a variable that expands to an empty string.',
            'Cảnh báo thứ hai mới là cái thú vị: <code>COPY nothere.txt /x</code> lẽ ra làm hỏng lượt dựng, và bộ soi lỗi nói ra điều đó trong nửa giây thay vì sau khi đã cài xong thư viện. Đây đúng là loại lỗi mà nếu không có nó thì sinh ra một lượt dựng chạy được với một cái ảnh sai một cách khó thấy — một file bị loại ra rồi lặng lẽ không bao giờ tới, một biến khai triển thành chuỗi rỗng.',
          ),
        }),

        // q7 · đáp án 0
        mcq({
          prompt: B(
            'Measured three times on this machine: 4s, 4s, 3s. Two stages that each sleep three seconds, and the whole build finishes in under four. What is happening?' + code(
              'FROM alpine:3.20 AS one\n' +
              'RUN sleep 3 && echo one > /o\n' +
              '\n' +
              'FROM alpine:3.20 AS two\n' +
              'RUN sleep 3 && echo two > /t\n' +
              '\n' +
              'FROM alpine:3.20\n' +
              'COPY --from=one /o /o\n' +
              'COPY --from=two /t /t',
            ),
            'Đo ba lượt trên máy này: 4s, 4s, 3s. Hai stage mỗi cái ngủ ba giây, mà cả lượt dựng xong dưới bốn giây. Chuyện gì đang xảy ra?' + code(
              'FROM alpine:3.20 AS one\n' +
              'RUN sleep 3 && echo one > /o\n' +
              '\n' +
              'FROM alpine:3.20 AS two\n' +
              'RUN sleep 3 && echo two > /t\n' +
              '\n' +
              'FROM alpine:3.20\n' +
              'COPY --from=one /o /o\n' +
              'COPY --from=two /t /t',
            ),
          ),
          options: [
            B(
              'BuildKit builds a graph rather than a list, so stages that do not depend on each other run CONCURRENTLY with no configuration — which is why a well-structured multi-stage Dockerfile is often faster than the single-stage one it replaced',
              'BuildKit dựng một đồ thị chứ không phải một danh sách, nên những stage không phụ thuộc nhau chạy ĐỒNG THỜI mà không cần cấu hình gì — và đó là lý do một Dockerfile nhiều tầng được sắp xếp tốt thường nhanh hơn bản một tầng mà nó thay thế',
            ),
            B(
              'Both <code>sleep</code> calls resolve against the same kernel timer, so the second one inherits the first one\'s remaining time instead of starting a new interval',
              'Cả hai lệnh <code>sleep</code> đều dựa vào cùng một bộ đếm giờ của nhân, nên cái thứ hai thừa hưởng phần thời gian còn lại của cái thứ nhất thay vì bắt đầu một khoảng mới',
            ),
            B(
              'The two stages share the same base image, and BuildKit deduplicates identical base layers by running the instructions above them exactly once per build',
              'Hai stage dùng chung một ảnh nền, và BuildKit khử trùng lặp các tầng nền giống nhau bằng cách chạy những chỉ thị phía trên chúng đúng một lần mỗi lượt dựng',
            ),
            B(
              'Only the last stage is actually executed; earlier stages are evaluated lazily and their RUN instructions are replaced by the files that <code>COPY --from</code> asks for',
              'Chỉ stage cuối là thực sự chạy; các stage trước được đánh giá trì hoãn và những chỉ thị RUN của chúng bị thay bằng đúng những file mà <code>COPY --from</code> hỏi tới',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The corollary matters as much as the fact: adding an unnecessary <code>COPY --from</code> between two stages serialises them, so keep stage dependencies to what you actually need. You can see the parallelism in <code>--progress=plain</code> as interleaved step numbers. The other half of the same property is that unused stages are skipped entirely — <code>--target dev</code> never runs the test or production stages, so extra stages cost nothing when you do not ask for them.',
            'Hệ quả cũng quan trọng ngang sự thật: thêm một lệnh <code>COPY --from</code> không cần thiết giữa hai stage là biến chúng thành tuần tự, nên hãy giữ phụ thuộc giữa các stage đúng ở mức bạn thật sự cần. Bạn nhìn thấy sự song song đó trong <code>--progress=plain</code> qua các số bước đan xen nhau. Nửa còn lại của cùng tính chất là stage không dùng thì bị bỏ qua hoàn toàn — <code>--target dev</code> không hề chạy stage kiểm thử hay stage production, nên thêm stage không tốn gì khi bạn không gọi tới.',
          ),
        }),

        // q8 · đáp án 1
        mcq({
          prompt: B(
            'Your CI exports the layer cache with <code>--cache-to</code> and it works: layers are reused across runs. Yet whenever a dependency is added, CI still downloads every package from scratch while your laptop does not. Why?',
            'CI của bạn xuất cache tầng bằng <code>--cache-to</code> và nó chạy: các tầng được dùng lại giữa các lượt. Vậy mà hễ thêm một thư viện là CI vẫn tải lại mọi gói từ đầu, còn laptop của bạn thì không. Vì sao?',
          ),
          options: [
            B(
              'The exported cache stores only the final image\'s layers, so a step that is re-run cannot read anything the previous run downloaded, whatever mode was used',
              'Cache đã xuất chỉ chứa các tầng của ảnh cuối, nên một bước phải chạy lại thì không đọc được thứ gì lượt trước đã tải về, dù dùng mode nào',
            ),
            B(
              'A <code>RUN --mount=type=cache</code> directory is builder-local and is NOT included in <code>--cache-to</code>: the layer cache travels between runs, the npm download cache does not, so a layer miss in CI is still a full download',
              'Thư mục của <code>RUN --mount=type=cache</code> nằm cục bộ ở bộ dựng và KHÔNG nằm trong <code>--cache-to</code>: cache tầng đi được giữa các lượt, còn cache tải về của npm thì không, nên một cú trượt tầng trong CI vẫn là tải lại toàn bộ',
            ),
            B(
              'CI runners always pass <code>--no-cache</code> to guarantee reproducibility, which silently defeats any cache mount while leaving the exported layer cache usable',
              'Máy chạy CI luôn truyền <code>--no-cache</code> để bảo đảm dựng lại được y hệt, và điều đó âm thầm vô hiệu mọi cache mount trong khi vẫn dùng được cache tầng đã xuất',
            ),
            B(
              'The registry that holds the exported cache garbage-collects package tarballs after each run because they are not referenced by any manifest in the image index',
              'Registry giữ cache đã xuất sẽ thu gom rác các gói tarball sau mỗi lượt vì chúng không được manifest nào trong chỉ mục ảnh tham chiếu tới',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two different caches solving two different halves of the problem: correct ordering makes a miss RARE, a cache mount makes a miss CHEAP. Only the first travels through <code>--cache-to</code>. Teams that care close the gap with a separate <code>actions/cache</code> step for <code>~/.npm</code> outside Docker. And remember <code>mode=max</code>: the default <code>mode=min</code> exports only the final image\'s layers, which excludes the expensive build stage of every multi-stage Dockerfile.',
            'Hai loại cache giải hai nửa khác nhau của cùng một vấn đề: sắp xếp đúng thứ tự làm cho cú trượt HIẾM, còn cache mount làm cho cú trượt RẺ. Chỉ cái thứ nhất đi qua được <code>--cache-to</code>. Nhóm nào để tâm thì vá chỗ hở đó bằng một bước <code>actions/cache</code> riêng cho <code>~/.npm</code> nằm ngoài Docker. Và nhớ <code>mode=max</code>: mặc định <code>mode=min</code> chỉ xuất tầng của ảnh cuối, tức là bỏ mất cái stage dựng đắt tiền của mọi Dockerfile nhiều tầng.',
          ),
        }),

        /* ── Chương 6 — ảnh nhỏ và an toàn (8 câu) ────────────────────────── */

        // q9 · đáp án 2
        mcq({
          prompt: B(
            'Two ways to pin the same base image. Why is the second one better, given that both name Node 22?' + code(
              'FROM node:22-alpine\n' +
              'FROM node:22-alpine3.20',
            ),
            'Hai cách ghim cùng một ảnh nền. Vì sao cách thứ hai tốt hơn, khi cả hai đều gọi tên Node 22?' + code(
              'FROM node:22-alpine\n' +
              'FROM node:22-alpine3.20',
            ),
          ),
          options: [
            B(
              'The longer tag is resolved without contacting the registry, because the Alpine release number is enough for the daemon to compute the digest locally and skip the manifest request',
              'Cái tag dài hơn được phân giải mà không cần liên hệ registry, vì số hiệu bản phát hành Alpine đủ để tiến trình nền tự tính digest tại chỗ và bỏ qua lượt hỏi manifest',
            ),
            B(
              'Only a tag that names two components is eligible for automatic security patches; a two-part tag such as <code>22-alpine</code> stops receiving them once a newer major version exists',
              'Chỉ tag nào gọi tên hai thành phần mới đủ điều kiện nhận bản vá bảo mật tự động; một tag hai phần như <code>22-alpine</code> thôi nhận chúng khi đã có một phiên bản lớn mới hơn',
            ),
            B(
              'It pins the OS release as well as the language version: <code>node:22-alpine</code> silently moved from Alpine 3.19 to 3.20 to 3.21 over a year, and each move changes the system libraries underneath you — the longer tag turns "our build broke and nothing changed" into a decision you make on purpose',
              'Nó ghim cả bản phát hành hệ điều hành chứ không chỉ phiên bản ngôn ngữ: <code>node:22-alpine</code> lặng lẽ dịch từ Alpine 3.19 sang 3.20 rồi 3.21 trong một năm, và mỗi lần dịch là đổi thư viện hệ thống bên dưới chân bạn — cái tag dài hơn biến "lượt dựng hỏng mà chẳng ai đổi gì" thành một quyết định bạn tự đưa ra',
            ),
            B(
              'The longer tag selects a build made specifically for the platform you are on, whereas the shorter one always resolves to the linux/amd64 image and needs emulation on ARM hardware',
              'Cái tag dài hơn chọn đúng bản dựng cho nền tảng bạn đang chạy, còn cái ngắn thì luôn phân giải ra ảnh linux/amd64 và phải mô phỏng trên phần cứng ARM',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Three levels of pinning, each a deliberate trade. <code>node:22-alpine</code> keeps receiving patches, including base-OS bumps you did not ask for. <code>node:22-alpine3.20</code> keeps the OS stable until you choose otherwise. <code>node:22-alpine3.20@sha256:…</code> is the same bytes forever, which is what production wants — paired with Renovate or a scheduled rebuild, or you have frozen your security patches along with your versions.',
            'Ba mức ghim, mỗi mức là một đánh đổi có chủ ý. <code>node:22-alpine</code> vẫn nhận bản vá, kể cả những lần nhảy hệ điều hành nền mà bạn không hề yêu cầu. <code>node:22-alpine3.20</code> giữ hệ điều hành đứng yên tới khi bạn quyết định khác. <code>node:22-alpine3.20@sha256:…</code> là đúng những byte đó mãi mãi, tức thứ mà production cần — kèm theo Renovate hoặc một lượt dựng lại định kỳ, không thì bạn đã đóng băng luôn các bản vá bảo mật cùng với phiên bản.',
          ),
        }),

        // q10 · đáp án 3
        mcq({
          prompt: B(
            'Measured on this machine (linux/arm64). A Python service is moved from <code>python:3.12-slim</code> to an Alpine base "to save space". The install step now takes ten minutes instead of twenty seconds and sometimes fails outright. What is the mechanism?' + code(
              '$ docker run --rm node:22-slim   sh -c \'ldd --version | head -1\'\n' +
              'ldd (Debian GLIBC 2.36-9+deb12u14) 2.36\n' +
              '\n' +
              '$ docker run --rm node:22-alpine sh -c \'ldd 2>&1 | head -1\'\n' +
              'musl libc (aarch64)',
            ),
            'Đo trên máy này (linux/arm64). Một dịch vụ Python được chuyển từ <code>python:3.12-slim</code> sang nền Alpine "cho nhẹ". Bước cài giờ mất mười phút thay vì hai mươi giây và thỉnh thoảng hỏng hẳn. Cơ chế là gì?' + code(
              '$ docker run --rm node:22-slim   sh -c \'ldd --version | head -1\'\n' +
              'ldd (Debian GLIBC 2.36-9+deb12u14) 2.36\n' +
              '\n' +
              '$ docker run --rm node:22-alpine sh -c \'ldd 2>&1 | head -1\'\n' +
              'musl libc (aarch64)',
            ),
          ),
          options: [
            B(
              'Alpine\'s package index is served from fewer mirrors, so every download is slower and occasionally times out during a large dependency tree',
              'Danh mục gói của Alpine được phục vụ từ ít máy gương hơn, nên mỗi lượt tải đều chậm và thỉnh thoảng hết giờ khi cây phụ thuộc lớn',
            ),
            B(
              'Alpine ships a Python interpreter compiled without optimisation, so anything that runs during installation — including setup scripts — executes several times slower',
              'Alpine giao một trình thông dịch Python biên dịch không tối ưu, nên mọi thứ chạy trong lúc cài — kể cả script cài đặt — đều chạy chậm hơn vài lần',
            ),
            B(
              'Alpine mounts <code>/tmp</code> on a small tmpfs, so pip has to spill its work to the writable layer and the extra I/O is what costs the minutes',
              'Alpine gắn <code>/tmp</code> lên một tmpfs nhỏ, nên pip phải đổ phần việc dở sang tầng ghi được, và chính lượng I/O phụ đó ngốn mất mấy phút',
            ),
            B(
              'PyPI wheels are built as <code>manylinux</code>, which means glibc. Alpine uses musl — a different C library, not binary-compatible — so pip finds no usable wheel and compiles numpy, pandas and psycopg2 from source instead',
              'Wheel trên PyPI được dựng theo chuẩn <code>manylinux</code>, tức là glibc. Alpine dùng musl — một thư viện C khác, không tương thích nhị phân — nên pip không tìm được wheel dùng được và phải biên dịch numpy, pandas, psycopg2 từ mã nguồn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The same mechanism explains the whole family of Alpine surprises: npm packages that ship prebuilt <code>linux-x64-glibc</code> binaries, Prisma engines that need <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code>, and musl\'s DNS resolver behaving differently under load. The honest rule is that <code>-slim</code> is the safe default for a final image — a few tens of megabytes more and none of the surprises — and distroless is the better production answer once the app is stable.',
            'Cũng cơ chế đó giải thích cả họ những bất ngờ của Alpine: gói npm giao sẵn tệp nhị phân <code>linux-x64-glibc</code>, engine Prisma cần <code>binaryTargets = ["linux-musl-openssl-3.0.x"]</code>, và bộ phân giải DNS của musl hành xử khác đi khi tải nặng. Quy tắc thật thà là <code>-slim</code> mới là mặc định an toàn cho ảnh cuối — nặng hơn vài chục megabyte và không kèm bất ngờ nào — còn distroless là câu trả lời tốt hơn cho production khi ứng dụng đã ổn định.',
          ),
        }),

        // q11 · đáp án 0
        mcq({
          prompt: B(
            'Two ways to get <code>jq</code> into an image. What does the second one buy you?' + code(
              '# A\n' +
              'RUN apk add --no-cache jq\n' +
              '\n' +
              '# B\n' +
              'COPY --from=ghcr.io/jqlang/jq:latest /jq /usr/local/bin/jq',
            ),
            'Hai cách đưa <code>jq</code> vào một cái ảnh. Cách thứ hai được lợi gì?' + code(
              '# A\n' +
              'RUN apk add --no-cache jq\n' +
              '\n' +
              '# B\n' +
              'COPY --from=ghcr.io/jqlang/jq:latest /jq /usr/local/bin/jq',
            ),
          ),
          options: [
            B(
              '<code>COPY --from</code> can name an external image, not just a stage, so you take one static binary out of an image that already has it — no package index, no dependency resolution, no package manager involved, and it works even in a final stage that has none',
              '<code>COPY --from</code> gọi tên được một ảnh bên ngoài chứ không chỉ một stage, nên bạn lấy đúng một tệp nhị phân tĩnh ra khỏi một cái ảnh vốn đã có nó — không cần danh mục gói, không cần giải phụ thuộc, không dính tới trình quản lý gói nào, và nó chạy được cả ở một stage cuối chẳng có trình quản lý gói',
            ),
            B(
              'B pulls the binary at container start rather than at build time, so the image stays smaller and the tool is always the newest published version',
              'B kéo tệp nhị phân về lúc container khởi động chứ không phải lúc dựng, nên ảnh nhỏ hơn và công cụ luôn là bản mới nhất được phát hành',
            ),
            B(
              'B is the only form that works when the final stage is Alpine, because <code>apk</code> cannot install into a stage that already has a <code>USER</code> instruction',
              'B là dạng duy nhất chạy được khi stage cuối là Alpine, vì <code>apk</code> không cài được vào một stage đã có chỉ thị <code>USER</code>',
            ),
            B(
              'B makes the tool part of the build cache rather than the image, so it is available to later RUN steps but does not increase the published image size at all',
              'B biến công cụ đó thành một phần của bộ đệm dựng chứ không phải của ảnh, nên các bước RUN sau dùng được nó mà kích thước ảnh công bố không tăng chút nào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'It works for anything statically linked: jq, dockerize, grpc_health_probe, migrate, tini. Two lines and a few megabytes instead of a package index and its dependency closure. The same syntax reaches a named stage (<code>COPY --from=build /app/dist ./dist</code>) and a named build context (<code>--build-context assets=./shared</code>), which is what makes multi-stage builds composable rather than merely smaller.',
            'Nó chạy được với mọi thứ liên kết tĩnh: jq, dockerize, grpc_health_probe, migrate, tini. Hai dòng và vài megabyte thay cho một danh mục gói cùng toàn bộ cây phụ thuộc của nó. Cũng cú pháp ấy với tới được một stage có tên (<code>COPY --from=build /app/dist ./dist</code>) và một ngữ cảnh dựng có tên (<code>--build-context assets=./shared</code>), và đó là thứ khiến dựng nhiều tầng ghép được với nhau chứ không chỉ nhỏ hơn.',
          ),
        }),

        // q12 · đáp án 1
        mcq({
          prompt: B(
            'One Dockerfile, three images. What does <code>--target</code> change, and what does an unused stage cost?' + code(
              'FROM node:22-alpine AS deps\n' +
              'FROM deps AS dev     ...  CMD ["npm","run","dev"]\n' +
              'FROM deps AS test    ...  RUN npm run lint && npm test\n' +
              'FROM deps AS build   ...  RUN npm run build\n' +
              'FROM node:22-alpine AS prod\n' +
              'COPY --from=build /app/dist ./dist\n' +
              '\n' +
              '$ docker build --target dev  -t app:dev  .\n' +
              '$ docker build --target test -t app:test .   # a failing test fails the build\n' +
              '$ docker build              -t app:prod .   # the last stage',
            ),
            'Một Dockerfile, ba cái ảnh. <code>--target</code> đổi gì, và một stage không dùng tới tốn bao nhiêu?' + code(
              'FROM node:22-alpine AS deps\n' +
              'FROM deps AS dev     ...  CMD ["npm","run","dev"]\n' +
              'FROM deps AS test    ...  RUN npm run lint && npm test\n' +
              'FROM deps AS build   ...  RUN npm run build\n' +
              'FROM node:22-alpine AS prod\n' +
              'COPY --from=build /app/dist ./dist\n' +
              '\n' +
              '$ docker build --target dev  -t app:dev  .\n' +
              '$ docker build --target test -t app:test .   # bài kiểm hỏng thì lượt dựng hỏng\n' +
              '$ docker build              -t app:prod .   # stage cuối',
            ),
          ),
          options: [
            B(
              '<code>--target</code> selects which stage is tagged but every stage still executes, so the three builds take the same time and the extra stages cost a test run each',
              '<code>--target</code> chọn stage nào được gắn tag nhưng mọi stage vẫn chạy, nên ba lượt dựng mất thời gian như nhau và các stage phụ tốn thêm một lượt kiểm thử mỗi cái',
            ),
            B(
              'It stops the build at a named stage, and BuildKit only executes what that target DEPENDS on — so <code>--target dev</code> never runs the build or test stages, and extra stages cost nothing when you do not ask for them',
              'Nó dừng lượt dựng ở một stage có tên, và BuildKit chỉ chạy những gì cái đích đó PHỤ THUỘC vào — nên <code>--target dev</code> không hề chạy stage dựng hay stage kiểm thử, và stage phụ chẳng tốn gì khi bạn không gọi tới',
            ),
            B(
              'It reorders the stages so that the named one becomes last, which is why the production build must always be written at the bottom of the file to remain reachable',
              'Nó sắp xếp lại các stage để cái được gọi tên trở thành cuối cùng, và đó là lý do bản dựng production luôn phải viết ở đáy file thì mới còn với tới được',
            ),
            B(
              'It builds every stage but discards the layers of the ones after the target, so the build cache holds all of them and the disk cost grows with the number of stages',
              'Nó dựng mọi stage nhưng vứt các tầng của những stage nằm sau cái đích, nên bộ đệm dựng giữ hết và chi phí đĩa tăng theo số stage',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is what makes one Dockerfile produce development, test, production and debug images that cannot drift apart. Two details worth carrying: a test stage means a failing test cannot produce an image at all — but it also means you cannot build the image to debug why the tests failed, so keep a <code>--target deps</code> escape hatch. And name every stage: indexes break when you insert one, names do not.',
            'Đây là thứ khiến một Dockerfile sinh ra ảnh phát triển, kiểm thử, production và gỡ lỗi mà chúng không thể trôi dạt khỏi nhau. Hai chi tiết đáng mang theo: có một stage kiểm thử nghĩa là một bài kiểm hỏng thì không thể sinh ra ảnh — nhưng cũng nghĩa là bạn không dựng được cái ảnh đó để xem vì sao bài kiểm hỏng, nên hãy giữ một lối thoát <code>--target deps</code>. Và hãy đặt tên cho mọi stage: dùng chỉ số thì chèn thêm một stage là hỏng, dùng tên thì không.',
          ),
        }),

        // q13 · đáp án 2
        mcq({
          prompt: B(
            'A team converts a 1.24GB single-stage image to multi-stage and the result is 612MB — a real saving, and far less than expected. This is what is inside:' + code(
              '$ docker run --rm app:1.0 sh -c \'du -sh node_modules/* | sort -hr | head -5\'\n' +
              '118M  node_modules/@swc\n' +
              '64M   node_modules/typescript\n' +
              '41M   node_modules/@esbuild\n' +
              '22M   node_modules/prisma\n' +
              '19M   node_modules/@prisma\n' +
              '\n' +
              '# the final stage does:\n' +
              'COPY --from=build /app/node_modules ./node_modules',
            ),
            'Một nhóm chuyển một ảnh một tầng 1,24GB sang nhiều tầng và ra 612MB — tiết kiệm thật, và ít hơn kỳ vọng nhiều. Bên trong nó là thế này:' + code(
              '$ docker run --rm app:1.0 sh -c \'du -sh node_modules/* | sort -hr | head -5\'\n' +
              '118M  node_modules/@swc\n' +
              '64M   node_modules/typescript\n' +
              '41M   node_modules/@esbuild\n' +
              '22M   node_modules/prisma\n' +
              '19M   node_modules/@prisma\n' +
              '\n' +
              '# stage cuối làm thế này:\n' +
              'COPY --from=build /app/node_modules ./node_modules',
            ),
          ),
          options: [
            B(
              'The compilers are dev dependencies, and a dev dependency copied into the final stage is inert — the saving is already maximal and the remaining size is the Node runtime itself',
              'Mấy trình biên dịch là thư viện phát triển, mà một thư viện phát triển được chép vào stage cuối thì nằm im — phần tiết kiệm đã kịch trần rồi và kích thước còn lại chính là môi trường chạy Node',
            ),
            B(
              'The final stage should copy <code>node_modules</code> with <code>--link</code>, which stores the directory as an independent layer and lets the registry deduplicate the compiler packages against the build stage',
              'Stage cuối nên chép <code>node_modules</code> kèm <code>--link</code>, cách đó lưu thư mục thành một tầng độc lập và để registry khử trùng lặp mấy gói trình biên dịch với stage dựng',
            ),
            B(
              'The build stage installed EVERYTHING, so copying its <code>node_modules</code> wholesale carries 223MB of compiler into production — run <code>npm prune --omit=dev</code> at the end of the build stage, or keep a separate deps stage that only ever ran <code>npm ci --omit=dev</code> and copy from that one',
              'Stage dựng đã cài TẤT CẢ, nên chép nguyên cả <code>node_modules</code> của nó là mang 223MB trình biên dịch vào production — hãy chạy <code>npm prune --omit=dev</code> ở cuối stage dựng, hoặc giữ một stage deps riêng chỉ từng chạy <code>npm ci --omit=dev</code> rồi chép từ stage đó',
            ),
            B(
              'The <code>prisma</code> and <code>@prisma</code> directories are duplicates of one another, and removing the duplicate is where the missing saving is hiding',
              'Hai thư mục <code>prisma</code> và <code>@prisma</code> là bản sao của nhau, và gỡ cái trùng đi chính là chỗ phần tiết kiệm còn thiếu đang trốn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Note <code>prisma</code> versus <code>@prisma</code>: the CLI is a dev dependency and the generated client is not, so pruning removes 22MB and keeps the 19MB you need — the two names are not duplicates. The same trap exists in Python (<code>pip install --prefix=/install</code> in a build stage that also has <code>build-essential</code>) and anywhere the build and runtime dependency sets differ. Measure first: <code>docker history</code> and <code>dive</code> find the 400MB directory in ten seconds, and it is usually not where you expected.',
            'Để ý <code>prisma</code> so với <code>@prisma</code>: công cụ dòng lệnh là thư viện phát triển còn client sinh ra thì không, nên tỉa bớt sẽ gỡ 22MB và giữ lại 19MB bạn cần — hai cái tên đó không phải bản sao của nhau. Cùng cái bẫy ấy có ở Python (<code>pip install --prefix=/install</code> trong một stage dựng vốn cũng có <code>build-essential</code>) và ở bất cứ đâu mà bộ phụ thuộc lúc dựng khác bộ phụ thuộc lúc chạy. Hãy đo trước: <code>docker history</code> và <code>dive</code> tìm ra cái thư mục 400MB trong mười giây, và nó thường không nằm ở chỗ bạn tưởng.',
          ),
        }),

        // q14 · đáp án 3
        mcq({
          prompt: B(
            'Measured on this machine. Both of these are sometimes necessary. What do they have in common?' + code(
              '$ docker run --rm alpine:3.20 sh -c \'ls /dev | wc -l\'\n' +
              '15\n' +
              '$ docker run --rm --privileged alpine:3.20 sh -c \'ls /dev | wc -l\'\n' +
              '167\n' +
              '\n' +
              '$ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\\n' +
              '    run --rm -v /:/host alpine chroot /host id\n' +
              'uid=0(root) gid=0(root) groups=0(root),1(daemon),2(bin),3(sys),…',
            ),
            'Đo trên máy này. Cả hai thứ này đôi khi là cần thiết. Chúng có điểm gì chung?' + code(
              '$ docker run --rm alpine:3.20 sh -c \'ls /dev | wc -l\'\n' +
              '15\n' +
              '$ docker run --rm --privileged alpine:3.20 sh -c \'ls /dev | wc -l\'\n' +
              '167\n' +
              '\n' +
              '$ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock docker:cli \\\n' +
              '    run --rm -v /:/host alpine chroot /host id\n' +
              'uid=0(root) gid=0(root) groups=0(root),1(daemon),2(bin),3(sys),…',
            ),
          ),
          options: [
            B(
              'Both weaken the container boundary by roughly the same amount as simply running the process as root instead of as an unprivileged user — so an image that already carries a <code>USER 10001</code> instruction is unaffected by either of them, and the extra devices are cosmetic',
              'Cả hai làm yếu ranh giới container xấp xỉ bằng mức chỉ đơn giản chạy tiến trình bằng root thay vì một người dùng không đặc quyền — nên một cái ảnh vốn đã có chỉ thị <code>USER 10001</code> thì không chịu ảnh hưởng của cái nào cả, và đám thiết bị thêm ra chỉ là trang trí',
            ),
            B(
              'Both are blocked by the default seccomp profile, so neither actually works until <code>--security-opt seccomp=unconfined</code> is passed as well — the outputs above came from a machine where that profile had already been switched off in <code>daemon.json</code>',
              'Cả hai bị hồ sơ seccomp mặc định chặn, nên chẳng cái nào thật sự chạy cho tới khi truyền thêm <code>--security-opt seccomp=unconfined</code> — mấy đoạn output ở trên đến từ một cỗ máy đã tắt sẵn hồ sơ đó trong <code>daemon.json</code>',
            ),
            B(
              'Both are undone by <code>--cap-drop=ALL</code>, which strips the capabilities that the extra devices and the daemon socket would otherwise let a process use — that is why dropping capabilities is the first hardening step to apply and the only one that matters here',
              'Cả hai bị <code>--cap-drop=ALL</code> vô hiệu, cờ này tước đi những capability mà nếu không thì đám thiết bị thêm và cái socket của tiến trình nền sẽ cho một tiến trình dùng tới — vì thế bỏ bớt capability là bước gia cố đầu tiên nên làm và là bước duy nhất có ý nghĩa ở đây',
            ),
            B(
              'Each is root on the host with extra steps: <code>--privileged</code> hands over every capability and every device (167 of them here, including the raw disk), and anything that can talk to the daemon socket can start a container that mounts <code>/</code> and give itself a root shell — as the second transcript does',
              'Mỗi cái là quyền root trên máy chủ, chỉ thêm vài bước: <code>--privileged</code> trao đi mọi capability và mọi thiết bị (ở đây là 167 cái, kể cả đĩa thô), còn thứ gì nói chuyện được với socket của tiến trình nền thì khởi chạy được một container gắn <code>/</code> vào rồi tự cho mình một shell root — đúng như đoạn thứ hai làm',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The socket case is arguably worse because it looks harmless — a bind mount of one file. Both are sometimes genuinely necessary: a CI runner that builds images, a monitoring agent. Treat them as "this container is root on this machine", with the same care you would give a root shell. For the CI case a rootless builder or a socket proxy that whitelists API endpoints is a real alternative.',
            'Ca socket còn tệ hơn ở chỗ nó trông vô hại — chỉ là bind mount một file. Cả hai đôi khi thật sự cần: một máy chạy CI dựng ảnh, một tác nhân giám sát. Hãy đối xử với chúng như "container này là root trên cỗ máy này", cẩn thận đúng như bạn cẩn thận với một shell root. Với ca CI thì một bộ dựng rootless hoặc một proxy socket chỉ cho qua danh sách endpoint đã duyệt là lựa chọn thay thế có thật.',
          ),
        }),

        // q15 · đáp án 0
        mcq({
          prompt: B(
            'Real output for a container started with the whole hardening set. Which line is doing the most work, and why?' + code(
              '$ docker inspect hardened --format \\\n' +
              '  \'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}} pids={{.HostConfig.PidsLimit}}\'\n' +
              'user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true] pids=200\n' +
              '\n' +
              '$ docker exec hardened id\n' +
              'uid=10001 gid=10001 groups=10001',
            ),
            'Output thật của một container khởi chạy với trọn bộ gia cố. Dòng nào gánh nhiều việc nhất, và vì sao?' + code(
              '$ docker inspect hardened --format \\\n' +
              '  \'user={{.Config.User}} ro={{.HostConfig.ReadonlyRootfs}} caps={{.HostConfig.CapDrop}} opts={{.HostConfig.SecurityOpt}} pids={{.HostConfig.PidsLimit}}\'\n' +
              'user=10001:10001 ro=true caps=[ALL] opts=[no-new-privileges:true] pids=200\n' +
              '\n' +
              '$ docker exec hardened id\n' +
              'uid=10001 gid=10001 groups=10001',
            ),
          ),
          options: [
            B(
              '<code>user=10001:10001</code>. There is no user namespace by default, so UID 0 inside is UID 0 on the host — an escape from a root process lands on the host as root, and from 10001 it lands as a user that owns nothing',
              '<code>user=10001:10001</code>. Mặc định không có user namespace, nên UID 0 bên trong chính là UID 0 trên máy chủ — thoát ra từ một tiến trình root là rơi xuống máy chủ với quyền root, còn từ 10001 là rơi xuống thành một người dùng chẳng sở hữu gì',
            ),
            B(
              '<code>pids=200</code>. A process limit is what prevents a compromised container from spawning a shell at all, since every escalation technique needs to fork at least once',
              '<code>pids=200</code>. Trần số tiến trình mới là thứ ngăn một container bị chiếm khởi chạy nổi một cái shell, vì mọi kỹ thuật leo thang đều phải fork ít nhất một lần',
            ),
            B(
              '<code>caps=[ALL]</code>. Dropping every capability also removes the container\'s ability to open network sockets, which is what actually stops a payload being downloaded',
              '<code>caps=[ALL]</code>. Bỏ mọi capability còn lấy đi cả khả năng mở socket mạng của container, và đó mới là thứ thực sự chặn việc tải một payload về',
            ),
            B(
              '<code>opts=[no-new-privileges:true]</code>. It is the only one of the five that survives a <code>docker exec</code>, so it is the only one an attacker who already has a shell cannot step around',
              '<code>opts=[no-new-privileges:true]</code>. Đó là thứ duy nhất trong năm cái sống sót qua một lệnh <code>docker exec</code>, nên là thứ duy nhất mà kẻ đã có shell không đi vòng qua được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The order that matters is: drop root, make the root filesystem read-only, drop capabilities to what is used, then check what you left open — because <code>--privileged</code>, a mounted <code>docker.sock</code> or <code>--network host</code> each undo everything above in one flag. Two practical notes on the user: use a NUMERIC uid, because Kubernetes\' <code>runAsNonRoot</code> reads the number and rejects a name it cannot resolve; and pick a high one (above 10000) so it does not collide with a host user on a bind mount.',
            'Thứ tự đáng nhớ là: bỏ root trước, cho hệ thống file gốc thành chỉ-đọc, hạ capability xuống đúng thứ đang dùng, rồi kiểm lại xem còn để hở gì — vì <code>--privileged</code>, một <code>docker.sock</code> đã gắn hay <code>--network host</code> mỗi cái đều xoá sạch mọi thứ ở trên chỉ bằng một cờ. Hai ghi chú thực dụng về người dùng: hãy dùng uid dạng SỐ, vì <code>runAsNonRoot</code> của Kubernetes đọc con số và từ chối một cái tên nó không phân giải được; và hãy chọn số lớn (trên 10000) để nó không đụng một người dùng của máy chủ trên một bind mount.',
          ),
        }),

        // q16 · đáp án 1
        mcq({
          prompt: B(
            'A CI scan gate is configured to fail the build on any CVE of any severity, fixable or not. Three months later, what is the most likely state of the project?',
            'Một cổng chặn quét lỗ hổng trong CI được đặt để đỏ với mọi CVE ở mọi mức, có bản vá hay không cũng vậy. Ba tháng sau, tình trạng dự án nhiều khả năng là gì?',
          ),
          options: [
            B(
              'The image has no vulnerabilities left, because a gate that never passes forces the team to resolve every finding before anything can be merged at all',
              'Ảnh không còn lỗ hổng nào, vì một cổng không bao giờ xanh buộc cả nhóm phải giải quyết hết mọi phát hiện trước khi bất cứ thứ gì được gộp vào',
            ),
            B(
              'The gate has been disabled or blanket-ignored, so nothing is checked at all — a gate that fires on findings nobody can act on today teaches people to route around it, and the three findings that mattered are now invisible too',
              'Cổng đó đã bị tắt hoặc bị bỏ qua hàng loạt, nên chẳng còn gì được kiểm — một cổng nổ vì những phát hiện mà hôm nay không ai xử lý được thì dạy người ta cách đi vòng qua nó, và ba phát hiện thật sự quan trọng giờ cũng tàng hình luôn',
            ),
            B(
              'The scanner has narrowed its database to the packages this image actually loads, so the noise falls away on its own after a few weeks of use',
              'Bộ quét đã thu hẹp cơ sở dữ liệu của nó về đúng những gói mà cái ảnh này thật sự nạp, nên nhiễu tự rụng đi sau vài tuần dùng',
            ),
            B(
              'The team has moved to a base image with fewer packages, which is the correct outcome and the reason strict gates are recommended',
              'Cả nhóm đã chuyển sang một ảnh nền ít gói hơn, đó là kết quả đúng và là lý do người ta khuyến nghị đặt cổng nghiêm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Fail on HIGH and CRITICAL that have a fix, and nothing else. Filter with <code>--ignore-unfixed</code>, separate base-image findings (fixed by bumping the base) from dependency findings (fixed in your lockfile), and record accepted risks in a <code>.trivyignore</code> with a reason and a review date. And the habit that beats any scanner: a weekly scheduled rebuild with <code>--pull</code>, which collects upstream base-image patches with no human involved.',
            'Hãy để đỏ ở mức HIGH và CRITICAL mà CÓ bản vá, và chỉ thế thôi. Lọc bằng <code>--ignore-unfixed</code>, tách phát hiện thuộc ảnh nền (chữa bằng cách nâng ảnh nền) khỏi phát hiện thuộc thư viện (chữa trong lockfile của bạn), và ghi lại rủi ro đã chấp nhận vào một file <code>.trivyignore</code> kèm lý do và ngày xem lại. Còn thói quen thắng mọi bộ quét: một lượt dựng lại định kỳ hằng tuần kèm <code>--pull</code>, nó gom các bản vá ảnh nền ở thượng nguồn mà không cần ai nhúng tay.',
          ),
        }),

        /* ── Chương 7 — dữ liệu (7 câu) ───────────────────────────────────── */

        // q17 · đáp án 0
        mcq({
          prompt: B(
            'Measured on this machine. The image installs 312 files into <code>/app/node_modules</code> at build time. Explain all three lines.' + code(
              '$ docker run --rm img\n' +
              '312\n' +
              '\n' +
              '$ docker run --rm -v "$PWD:/app" img\n' +
              'ls: /app/node_modules: No such file or directory\n' +
              '0\n' +
              '\n' +
              '$ docker run --rm -v "$PWD:/app" -v /app/node_modules img\n' +
              '312',
            ),
            'Đo trên máy này. Ảnh cài 312 file vào <code>/app/node_modules</code> lúc dựng. Hãy giải thích cả ba dòng.' + code(
              '$ docker run --rm img\n' +
              '312\n' +
              '\n' +
              '$ docker run --rm -v "$PWD:/app" img\n' +
              'ls: /app/node_modules: No such file or directory\n' +
              '0\n' +
              '\n' +
              '$ docker run --rm -v "$PWD:/app" -v /app/node_modules img\n' +
              '312',
            ),
          ),
          options: [
            B(
              'A bind mount NEVER copies and the host always wins, so the second run shows an empty host directory. The third adds an anonymous VOLUME at the deeper path — mounts apply in order of path depth, and a volume over a populated image directory does get the image\'s files copied in on first use',
              'Bind mount KHÔNG BAO GIỜ chép và phía máy chủ luôn thắng, nên lượt thứ hai thấy một thư mục máy chủ rỗng. Lượt thứ ba thêm một VOLUME vô danh ở đường dẫn sâu hơn — các phép gắn áp theo độ sâu đường dẫn, và một volume đè lên một thư mục ảnh có sẵn nội dung thì ĐƯỢC chép file của ảnh vào ở lần dùng đầu',
            ),
            B(
              'The second run deleted the directory because the bind mount is read-write and the host directory was empty, so the container synchronised the deletion back into the image layer',
              'Lượt thứ hai đã xoá cái thư mục vì bind mount là đọc-ghi còn thư mục máy chủ thì rỗng, nên container đồng bộ phép xoá đó ngược vào tầng ảnh',
            ),
            B(
              'The third run works because a second <code>-v</code> flag disables the first one for any path underneath it, leaving the image\'s own filesystem visible again at every level',
              'Lượt thứ ba chạy được vì một cờ <code>-v</code> thứ hai vô hiệu hoá cờ thứ nhất ở mọi đường dẫn nằm dưới nó, làm hệ thống file của chính cái ảnh hiện lại ở mọi tầng',
            ),
            B(
              'The difference is the trailing path: <code>/app</code> is a WORKDIR and Docker refuses to bind-mount over a WORKDIR unless a deeper mount is declared as well',
              'Khác biệt nằm ở đường dẫn cuối: <code>/app</code> là một WORKDIR và Docker từ chối bind mount đè lên một WORKDIR trừ khi có khai thêm một phép gắn sâu hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'In compose the same trick reads much better: <code>- .:/app</code> for your live source and a bare <code>- /app/node_modules</code> to keep the image\'s copy. The same pattern applies to <code>.next/</code>, <code>target/</code>, <code>__pycache__/</code> and <code>vendor/</code> — anything the image builds that the host should not overwrite. On macOS and Windows it is doubly worthwhile, because the dependency tree then lives in the VM\'s own filesystem at native speed instead of crossing the file-sharing boundary on every stat.',
            'Trong compose thì mẹo đó đọc dễ hơn hẳn: <code>- .:/app</code> cho mã nguồn sống của bạn và một dòng trần <code>- /app/node_modules</code> để giữ bản của ảnh. Cùng khuôn đó áp cho <code>.next/</code>, <code>target/</code>, <code>__pycache__/</code> và <code>vendor/</code> — mọi thứ do ảnh dựng ra mà máy chủ không nên ghi đè. Trên macOS và Windows nó còn đáng gấp đôi, vì khi đó cây phụ thuộc nằm trong hệ thống file của chính máy ảo với tốc độ nguyên bản thay vì phải vượt ranh giới chia sẻ file ở mỗi lần stat.',
          ),
        }),

        // q18 · đáp án 1
        mcq({
          prompt: B(
            'Real transcript, and the reason the long form belongs in anything committed to a repository.' + code(
              '$ docker run --rm -v "$PWD/does-not-exist-typo:/conf" alpine:3.20 ls -la /conf\n' +
              'total 4\n' +
              'drwxr-xr-x    2 root     root            64 Sep  9 23:36 .\n' +
              '$ ls -d does-not-exist-typo\n' +
              'does-not-exist-typo          <- created on the host, empty\n' +
              '\n' +
              '$ docker run --rm --mount type=bind,src="$PWD/another-typo",dst=/conf alpine:3.20 ls /conf\n' +
              'docker: Error response from daemon: invalid mount config for type "bind":\n' +
              'bind source path does not exist: …/another-typo',
            ),
            'Đoạn terminal thật, và lý do dạng viết dài nên nằm trong mọi thứ được commit vào kho.' + code(
              '$ docker run --rm -v "$PWD/does-not-exist-typo:/conf" alpine:3.20 ls -la /conf\n' +
              'total 4\n' +
              'drwxr-xr-x    2 root     root            64 Sep  9 23:36 .\n' +
              '$ ls -d does-not-exist-typo\n' +
              'does-not-exist-typo          <- được tạo trên máy chủ, rỗng\n' +
              '\n' +
              '$ docker run --rm --mount type=bind,src="$PWD/another-typo",dst=/conf alpine:3.20 ls /conf\n' +
              'docker: Error response from daemon: invalid mount config for type "bind":\n' +
              'bind source path does not exist: …/another-typo',
            ),
          ),
          options: [
            B(
              '<code>--mount</code> refuses because it only accepts named volumes, so a bind source has to be declared with <code>-v</code> and the difference is syntactic rather than behavioural',
              '<code>--mount</code> từ chối vì nó chỉ nhận volume có tên, nên nguồn bind phải khai bằng <code>-v</code> và khác biệt là ở cú pháp chứ không phải ở hành vi',
            ),
            B(
              'They do the same thing, but <code>-v</code> guesses and <code>--mount</code> is explicit: a host path that does not exist is silently created as an empty directory by <code>-v</code>, so a typo in a config path gives you an empty directory instead of an error',
              'Chúng làm cùng một việc, nhưng <code>-v</code> thì đoán còn <code>--mount</code> thì tường minh: một đường dẫn máy chủ không tồn tại sẽ bị <code>-v</code> lặng lẽ tạo thành thư mục rỗng, nên một lỗi gõ trong đường dẫn cấu hình cho bạn một thư mục rỗng thay vì một thông báo lỗi',
            ),
            B(
              '<code>-v</code> creates a named volume whenever the source has no leading slash, and the directory that appeared on the host is that volume\'s mount point rather than a new directory',
              '<code>-v</code> tạo một volume có tên mỗi khi nguồn không bắt đầu bằng dấu gạch chéo, và cái thư mục xuất hiện trên máy chủ chính là điểm gắn của volume đó chứ không phải thư mục mới',
            ),
            B(
              '<code>--mount</code> validates the path only because <code>type=bind</code> was stated; leaving the type out makes it behave exactly like <code>-v</code> and create the directory too',
              '<code>--mount</code> chỉ kiểm đường dẫn vì đã ghi <code>type=bind</code>; bỏ phần type đi thì nó hành xử y hệt <code>-v</code> và cũng tạo thư mục',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The empty-directory failure is the nasty one because the container starts. A config file that should have been mounted simply is not there, the application falls back to its defaults, and you are debugging behaviour rather than an error. Use <code>-v</code> interactively where a typo costs you one retry, and <code>--mount</code> in compose files and scripts, where it costs an incident.',
            'Kiểu hỏng ra-thư-mục-rỗng mới là kiểu khó chịu, vì container vẫn khởi động. Một file cấu hình lẽ ra được gắn thì đơn giản là không có ở đó, ứng dụng lùi về giá trị mặc định của nó, và bạn đi gỡ một hành vi chứ không phải một thông báo lỗi. Hãy dùng <code>-v</code> lúc gõ tay, nơi một lỗi gõ chỉ tốn một lần chạy lại, và dùng <code>--mount</code> trong file compose và script, nơi nó tốn một sự cố.',
          ),
        }),

        // q19 · đáp án 2
        mcq({
          prompt: B(
            'Measured. The container was stopped between the two attempts and the message did not change. What is Docker protecting?' + code(
              '$ docker volume rm pt2-vol\n' +
              'Error response from daemon: remove pt2-vol: volume is in use - [137790afe0b4…]\n' +
              '\n' +
              '$ docker stop holder\n' +
              '$ docker volume rm pt2-vol\n' +
              'Error response from daemon: remove pt2-vol: volume is in use - [137790afe0b4…]',
            ),
            'Đo thật. Container đã bị dừng giữa hai lần thử mà thông báo không đổi. Docker đang bảo vệ điều gì?' + code(
              '$ docker volume rm pt2-vol\n' +
              'Error response from daemon: remove pt2-vol: volume is in use - [137790afe0b4…]\n' +
              '\n' +
              '$ docker stop holder\n' +
              '$ docker volume rm pt2-vol\n' +
              'Error response from daemon: remove pt2-vol: volume is in use - [137790afe0b4…]',
            ),
          ),
          options: [
            B(
              'A lock file that the last writer left behind inside the volume; removing it by hand from the mount point releases the volume immediately',
              'Một file khoá mà người ghi cuối cùng để lại bên trong volume; xoá nó bằng tay ở điểm gắn là volume được giải phóng ngay',
            ),
            B(
              'A grace period after the last write, during which the daemon keeps the volume so that a container restarted quickly does not lose an unflushed page cache',
              'Một khoảng ân hạn sau lần ghi cuối, trong đó tiến trình nền giữ volume lại để một container khởi động lại nhanh không mất phần bộ đệm chưa xả',
            ),
            B(
              'The reference is the CONTAINER, not the process: a stopped container still references its volumes, so the volume is only removable once the container itself is removed. The hex string is the container id, and <code>docker ps -a --filter volume=&lt;name&gt;</code> names it',
              'Thứ tham chiếu là CONTAINER chứ không phải tiến trình: một container đã dừng vẫn tham chiếu tới volume của nó, nên volume chỉ xoá được khi chính container bị xoá đi. Chuỗi hex đó là id container, và <code>docker ps -a --filter volume=&lt;tên&gt;</code> gọi tên nó ra',
            ),
            B(
              'The volume has a label that marks it as belonging to a compose project, and project-scoped volumes can only be removed with <code>docker compose down -v</code>',
              'Volume có một nhãn đánh dấu nó thuộc về một dự án compose, và volume thuộc phạm vi dự án chỉ xoá được bằng <code>docker compose down -v</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This asymmetry is deliberate and it saves you far more often than it hurts: named volumes survive <code>docker rm</code>, <code>docker compose down</code> and a full <code>docker system prune</code>. You have to ask specifically — <code>docker volume prune</code>, or <code>docker compose down -v</code>, where the flag is one character. It also means "I removed everything and the old data came back" is a normal Tuesday rather than a bug.',
            'Sự bất đối xứng này là cố ý và nó cứu bạn nhiều hơn hẳn số lần nó làm phiền: volume có tên sống sót qua <code>docker rm</code>, <code>docker compose down</code> và cả một lượt <code>docker system prune</code> đầy đủ. Bạn phải hỏi thẳng — <code>docker volume prune</code>, hoặc <code>docker compose down -v</code>, chỗ mà cái cờ chỉ dài một ký tự. Nó cũng có nghĩa là "tôi xoá sạch rồi mà dữ liệu cũ vẫn quay lại" là một ngày thứ Ba bình thường chứ không phải lỗi.',
          ),
        }),

        // q20 · đáp án 3
        mcq({
          prompt: B(
            'Measured in this order, on one volume holding twenty files. What does <code>dangling=true</code> actually mean here?' + code(
              '# while the container still exists (stopped)\n' +
              '$ docker volume ls -qf dangling=true | grep -c pt2-vol\n' +
              '0\n' +
              '\n' +
              '$ docker rm holder\n' +
              '$ docker volume ls -qf dangling=true | grep -c pt2-vol\n' +
              '1\n' +
              '\n' +
              '$ docker run --rm -v pt2-vol:/d alpine:3.20 sh -c \'ls /d | wc -l\'\n' +
              '20',
            ),
            'Đo theo đúng thứ tự này, trên một volume đang giữ hai mươi file. Ở đây <code>dangling=true</code> thật ra nghĩa là gì?' + code(
              '# khi container còn tồn tại (đã dừng)\n' +
              '$ docker volume ls -qf dangling=true | grep -c pt2-vol\n' +
              '0\n' +
              '\n' +
              '$ docker rm holder\n' +
              '$ docker volume ls -qf dangling=true | grep -c pt2-vol\n' +
              '1\n' +
              '\n' +
              '$ docker run --rm -v pt2-vol:/d alpine:3.20 sh -c \'ls /d | wc -l\'\n' +
              '20',
            ),
          ),
          options: [
            B(
              'That the volume is corrupt: it appeared in the dangling list the moment its container was removed, and the twenty files that still list are stale directory entries',
              'Rằng volume đã hỏng: nó lọt vào danh sách dangling ngay khi container của nó bị xoá, và hai mươi file còn liệt kê được chỉ là mục thư mục cũ còn sót',
            ),
            B(
              'That the volume has never been written to by a running container, which is why it only became dangling after the writer was removed rather than when it stopped',
              'Rằng volume chưa từng được một container đang chạy ghi vào, và vì thế nó chỉ thành dangling sau khi người ghi bị xoá chứ không phải khi người ghi dừng',
            ),
            B(
              'That the volume is anonymous, since only anonymous volumes are ever reported as dangling and named ones are excluded from the filter by design',
              'Rằng volume là vô danh, vì chỉ volume vô danh mới bị báo là dangling còn volume có tên thì bị bộ lọc loại ra theo thiết kế',
            ),
            B(
              'Only that no container references it RIGHT NOW — which is not the same as unused: recreating the service from a compose file puts it back in use with all twenty files intact, and that is the normal upgrade path rather than an accident',
              'Chỉ là NGAY LÚC NÀY không container nào tham chiếu tới nó — điều đó khác với "không dùng nữa": dựng lại dịch vụ từ file compose là nó quay lại được dùng với đủ hai mươi file, và đó là đường nâng cấp bình thường chứ không phải tai nạn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Reading <code>dangling=true</code> as "safe to delete" is how a development database disappears. The volumes that are genuinely garbage have three properties together: no links, an anonymous 64-hex name, and a creation date you can trace to an experiment. Before pruning on a server with real data, list them, read the names, and confirm each one — Docker\'s prompt shows a count, not the names, and there is no undo.',
            'Đọc <code>dangling=true</code> thành "xoá được rồi" chính là cách một cơ sở dữ liệu phát triển biến mất. Những volume thật sự là rác có đủ ba tính chất cùng lúc: không liên kết nào, một cái tên vô danh 64 ký tự hex, và một ngày tạo mà bạn truy được về một lần thử nghiệm. Trước khi dọn trên một máy chủ có dữ liệu thật, hãy liệt kê ra, đọc từng cái tên, và xác nhận từng cái — lời nhắc của Docker chỉ hiện số lượng chứ không hiện tên, và không có nút hoàn tác.',
          ),
        }),

        // q21 · đáp án 0
        mcq({
          prompt: B(
            'A complete backup and restore, measured, with no tooling beyond Docker. Why does the restore go into a NEW volume?' + code(
              '$ docker run --rm -v pt2-vol:/from:ro -v "$PWD:/to" alpine:3.20 \\\n' +
              '    tar -C /from -czf /to/backup.tgz .\n' +
              '\n' +
              '$ docker run --rm -v pt2-vol:/from:ro alpine:3.20 touch /from/nope\n' +
              'touch: /from/nope: Read-only file system\n' +
              '\n' +
              '$ docker volume create pt2-vol-restored\n' +
              '$ docker run --rm -v pt2-vol-restored:/to -v "$PWD:/from:ro" alpine:3.20 \\\n' +
              '    tar -C /to -xzf /from/backup.tgz\n' +
              '$ docker run --rm -v pt2-vol-restored:/d alpine:3.20 sh -c \'ls /d | wc -l\'\n' +
              '20',
            ),
            'Một lượt sao lưu và khôi phục trọn vẹn, đo thật, không cần công cụ nào ngoài Docker. Vì sao lại khôi phục vào một volume MỚI?' + code(
              '$ docker run --rm -v pt2-vol:/from:ro -v "$PWD:/to" alpine:3.20 \\\n' +
              '    tar -C /from -czf /to/backup.tgz .\n' +
              '\n' +
              '$ docker run --rm -v pt2-vol:/from:ro alpine:3.20 touch /from/nope\n' +
              'touch: /from/nope: Read-only file system\n' +
              '\n' +
              '$ docker volume create pt2-vol-restored\n' +
              '$ docker run --rm -v pt2-vol-restored:/to -v "$PWD:/from:ro" alpine:3.20 \\\n' +
              '    tar -C /to -xzf /from/backup.tgz\n' +
              '$ docker run --rm -v pt2-vol-restored:/d alpine:3.20 sh -c \'ls /d | wc -l\'\n' +
              '20',
            ),
          ),
          options: [
            B(
              'It costs disk and nothing else, and it turns "restore the backup" from a terrifying one-way operation into something you can verify before it matters — point a container at the restored volume, check the data, and only then stop the service and re-point it',
              'Nó chỉ tốn đĩa chứ không tốn gì khác, và nó biến "khôi phục bản sao lưu" từ một thao tác một chiều đáng sợ thành thứ bạn kiểm tra được trước khi nó thành chuyện — chĩa một container vào volume đã khôi phục, xem dữ liệu, rồi mới dừng dịch vụ và chĩa nó sang',
            ),
            B(
              'Docker refuses to extract a tar archive into a volume that already contains files, so restoring in place would fail with a "destination not empty" error',
              'Docker từ chối giải nén một kho tar vào một volume vốn đã có file, nên khôi phục tại chỗ sẽ hỏng với lỗi "đích không rỗng"',
            ),
            B(
              'A volume can only be mounted read-write by one container at a time, and the original is still held read-only by the backup container until the archive is closed',
              'Một volume chỉ được một container gắn ở chế độ đọc-ghi tại một thời điểm, và bản gốc vẫn bị container sao lưu giữ ở chế độ chỉ-đọc cho tới khi kho nén được đóng',
            ),
            B(
              'The <code>:ro</code> flag on the source is inherited by anything created from that archive, so extracting into the original volume would leave it permanently read-only',
              'Cờ <code>:ro</code> trên nguồn được thừa hưởng bởi mọi thứ tạo ra từ kho nén đó, nên giải nén vào volume gốc sẽ khiến nó thành chỉ-đọc vĩnh viễn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The <code>:ro</code> on the source is the other half of the discipline: a mistake in the command cannot damage the original, as the failed <code>touch</code> demonstrates. And note what this method is NOT good for: a file-level copy of a RUNNING database is a torn snapshot — the tar completes, the size looks plausible, and the corruption is invisible until you need it. For a database, use a logical dump through <code>docker exec</code>, or stop the engine first. A backup you have never restored has an unknown status, not a good one.',
            'Cờ <code>:ro</code> trên nguồn là nửa còn lại của kỷ luật đó: một lỗi trong câu lệnh không làm hỏng được bản gốc, đúng như lệnh <code>touch</code> hỏng đã cho thấy. Và để ý cách này KHÔNG hợp với việc gì: một bản chép mức file của một cơ sở dữ liệu ĐANG CHẠY là một ảnh chụp rách — lệnh tar xong xuôi, kích thước trông hợp lý, và chỗ hỏng thì vô hình cho tới lúc bạn cần. Với cơ sở dữ liệu, hãy dùng một bản kết xuất logic qua <code>docker exec</code>, hoặc dừng engine trước. Một bản sao lưu chưa từng khôi phục thì trạng thái của nó là KHÔNG BIẾT, chứ không phải là tốt.',
          ),
        }),

        // q22 · đáp án 1
        mcq({
          prompt: B(
            'Measured on this machine. A headless Chromium under Playwright dies with a bare "Target closed" and nothing in the error mentions memory. What is the fix?' + code(
              '$ docker run --rm alpine:3.20 df -h /dev/shm\n' +
              'shm                      64.0M         0     64.0M   0% /dev/shm\n' +
              '\n' +
              '$ docker run --rm --shm-size=1g alpine:3.20 df -h /dev/shm\n' +
              'shm                       1.0G         0      1.0G   0% /dev/shm',
            ),
            'Đo trên máy này. Một Chromium không giao diện chạy dưới Playwright chết với đúng một dòng "Target closed" và thông báo lỗi chẳng nhắc gì tới bộ nhớ. Chữa thế nào?' + code(
              '$ docker run --rm alpine:3.20 df -h /dev/shm\n' +
              'shm                      64.0M         0     64.0M   0% /dev/shm\n' +
              '\n' +
              '$ docker run --rm --shm-size=1g alpine:3.20 df -h /dev/shm\n' +
              'shm                       1.0G         0      1.0G   0% /dev/shm',
            ),
          ),
          options: [
            B(
              'Raise the container memory limit with <code>--memory 2g</code>: <code>/dev/shm</code> is sized as a fixed fraction of the limit, so the shared-memory area grows with it',
              'Nâng trần bộ nhớ của container bằng <code>--memory 2g</code>: <code>/dev/shm</code> được định cỡ theo một tỉ lệ cố định của trần đó, nên vùng bộ nhớ dùng chung to lên theo',
            ),
            B(
              'Docker gives every container a 64MB <code>/dev/shm</code>, and Chromium uses shared memory for its renderer processes — <code>--shm-size=1g</code> (or <code>shm_size: 1gb</code> in compose) is the fix, and the reason to know it is that nothing in the error mentions shared memory',
              'Docker cấp cho mọi container một <code>/dev/shm</code> 64MB, còn Chromium dùng bộ nhớ chia sẻ cho các tiến trình render — <code>--shm-size=1g</code> (hoặc <code>shm_size: 1gb</code> trong compose) là cách chữa, và lý do phải biết là vì thông báo lỗi không hề nhắc tới bộ nhớ chia sẻ',
            ),
            B(
              'Mount a tmpfs over <code>/dev/shm</code> with <code>--tmpfs /dev/shm:rw,size=1g</code>, because <code>--shm-size</code> only affects containers started with <code>--ipc=host</code>',
              'Gắn một tmpfs đè lên <code>/dev/shm</code> bằng <code>--tmpfs /dev/shm:rw,size=1g</code>, vì <code>--shm-size</code> chỉ có tác dụng với container khởi chạy kèm <code>--ipc=host</code>',
            ),
            B(
              'Pass <code>--read-only</code> and a writable tmpfs elsewhere, since the crash comes from Chromium being unable to write its profile directory rather than from shared memory',
              'Truyền <code>--read-only</code> cùng một tmpfs ghi được ở chỗ khác, vì cú sập đến từ việc Chromium không ghi được thư mục hồ sơ chứ không phải từ bộ nhớ chia sẻ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The IPC namespace gets its own shared memory (Lesson 1.1), and 64MB is the default. It is fine for most things and far too small for a browser. The neighbouring rule is worth pairing with it: always give a <code>--tmpfs</code> an explicit <code>size=</code>, because an uncapped one spends the container\'s memory budget and the OOM killer then takes the main process rather than the files — a cap turns a slow mystery into an immediate <code>No space left on device</code>.',
            'Namespace IPC có vùng bộ nhớ chia sẻ riêng của nó (bài 1.1), và 64MB là mặc định. Chừng đó ổn với hầu hết mọi thứ và quá nhỏ với một trình duyệt. Quy tắc hàng xóm đáng ghép chung: luôn cho một <code>--tmpfs</code> một giá trị <code>size=</code> tường minh, vì cái không có trần sẽ tiêu vào ngân sách bộ nhớ của container rồi kẻ giết OOM lấy mất tiến trình chính chứ không lấy đám file — đặt trần biến một bí ẩn chậm chạp thành một lỗi <code>No space left on device</code> tức thì.',
          ),
        }),

        // q23 · đáp án 2
        mcq({
          prompt: B(
            'Measured. Both containers hold the same password. What did the second arrangement actually change?' + code(
              '$ docker run -d --env-file app.env -e API_KEY=sk-live-abc123 alpine:3.20 sleep 120\n' +
              "$ docker inspect c1 --format '{{json .Config.Env}}'\n" +
              '["DB_PASSWORD=hunter2","API_KEY=sk-live-abc123", …]\n' +
              '\n' +
              '$ docker run -d --tmpfs /run/secrets:rw,size=1m,mode=0700 \\\n' +
              '    -e DB_PASSWORD_FILE=/run/secrets/db alpine:3.20 sleep 120\n' +
              "$ docker inspect c2 --format '{{json .Config.Env}}'\n" +
              '["DB_PASSWORD_FILE=/run/secrets/db", …]',
            ),
            'Đo thật. Cả hai container đều nắm cùng một mật khẩu. Cách sắp xếp thứ hai thật ra đổi được gì?' + code(
              '$ docker run -d --env-file app.env -e API_KEY=sk-live-abc123 alpine:3.20 sleep 120\n' +
              "$ docker inspect c1 --format '{{json .Config.Env}}'\n" +
              '["DB_PASSWORD=hunter2","API_KEY=sk-live-abc123", …]\n' +
              '\n' +
              '$ docker run -d --tmpfs /run/secrets:rw,size=1m,mode=0700 \\\n' +
              '    -e DB_PASSWORD_FILE=/run/secrets/db alpine:3.20 sleep 120\n' +
              "$ docker inspect c2 --format '{{json .Config.Env}}'\n" +
              '["DB_PASSWORD_FILE=/run/secrets/db", …]',
            ),
          ),
          options: [
            B(
              'Nothing meaningful: Docker encrypts environment variables at rest, so the first form was already safe and the second only adds a level of indirection',
              'Chẳng đổi gì đáng kể: Docker mã hoá biến môi trường khi lưu, nên dạng thứ nhất vốn đã an toàn và dạng thứ hai chỉ thêm một tầng gián tiếp',
            ),
            B(
              'The second form hides the value from the process itself, so a compromised application can no longer read the password even though the database still can',
              'Dạng thứ hai giấu giá trị khỏi chính tiến trình, nên một ứng dụng bị chiếm không đọc nổi mật khẩu nữa dù cơ sở dữ liệu thì vẫn đọc được',
            ),
            B(
              'The value is now a PATH rather than a value, so it no longer appears in <code>docker inspect</code>, in <code>docker compose config</code>, in crash reports that dump the environment, or in the environment inherited by every child process — and the file lives on a tmpfs, so it never touches a disk that outlives the container',
              'Giá trị bây giờ là một ĐƯỜNG DẪN chứ không phải một giá trị, nên nó không còn hiện trong <code>docker inspect</code>, trong <code>docker compose config</code>, trong báo cáo sự cố có kết xuất môi trường, hay trong môi trường mà mọi tiến trình con thừa hưởng — và cái file nằm trên tmpfs nên nó không bao giờ chạm vào một cái đĩa sống lâu hơn container',
            ),
            B(
              'The <code>mode=0700</code> on the tmpfs restricts the mount to the root user, which is what removes the value from <code>docker inspect</code> output for non-root callers',
              'Giá trị <code>mode=0700</code> trên tmpfs giới hạn phép gắn cho người dùng root, và đó là thứ gỡ giá trị khỏi output của <code>docker inspect</code> với người gọi không phải root',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Most official images already support the <code>_FILE</code> convention — <code>POSTGRES_PASSWORD_FILE</code> works today. Nothing makes a secret invisible to the machine running the process, and a support engineer pasting <code>docker inspect</code> output into a chat is exactly how a database password gets published. The practical consequence is that rotating a leaked key means rotating it at the provider, not just changing the variable.',
            'Phần lớn ảnh chính thức đã hỗ trợ quy ước <code>_FILE</code> — <code>POSTGRES_PASSWORD_FILE</code> dùng được ngay hôm nay. Không có gì làm một bí mật vô hình với chính cỗ máy đang chạy tiến trình, và một kỹ sư hỗ trợ dán output <code>docker inspect</code> vào một khung chat đúng là cách mà mật khẩu cơ sở dữ liệu được công bố. Hệ quả thực dụng là xoay một khoá đã lộ nghĩa là xoay nó ở phía nhà cung cấp, chứ không phải chỉ đổi cái biến.',
          ),
        }),

        /* ── Chương 8 — mạng (7 câu) ──────────────────────────────────────── */

        // q24 · đáp án 3
        mcq({
          prompt: B(
            'Measured on a user-defined network. One container answers to three names. Where do the extra two come from, and what are they for?' + code(
              '$ docker run -d --name pt2_pg --network pt2-net \\\n' +
              '    --network-alias db --network-alias primary.db alpine:3.20 sleep 300\n' +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 sh -c \'…getent hosts…\'\n' +
              'pt2_pg       172.20.0.3\n' +
              'db           172.20.0.3\n' +
              'primary.db   172.20.0.3',
            ),
            'Đo trên một mạng tự tạo. Một container trả lời cho ba cái tên. Hai cái tên thêm từ đâu ra, và để làm gì?' + code(
              '$ docker run -d --name pt2_pg --network pt2-net \\\n' +
              '    --network-alias db --network-alias primary.db alpine:3.20 sleep 300\n' +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 sh -c \'…getent hosts…\'\n' +
              'pt2_pg       172.20.0.3\n' +
              'db           172.20.0.3\n' +
              'primary.db   172.20.0.3',
            ),
          ),
          options: [
            B(
              'They are reverse-DNS entries generated from the container id, and they exist so that a packet capture can show a readable name instead of an address',
              'Đó là các mục DNS ngược sinh ra từ id container, và chúng tồn tại để một lượt bắt gói tin hiện ra một cái tên đọc được thay vì một địa chỉ',
            ),
            B(
              'They are written into the container\'s <code>/etc/hosts</code> at start-up, which is why they survive a restart even after the address changes',
              'Chúng được ghi vào <code>/etc/hosts</code> của container lúc khởi động, và vì thế chúng sống sót qua một lần khởi động lại kể cả sau khi địa chỉ đổi',
            ),
            B(
              'They are a compatibility layer for the deprecated <code>--link</code> flag, and Docker will stop honouring them in a future release',
              'Chúng là lớp tương thích cho cờ <code>--link</code> đã bị khai tử, và Docker sẽ thôi tôn trọng chúng ở một bản phát hành tương lai',
            ),
            B(
              'They are network aliases: extra DNS names, scoped to one network, served by Docker\'s embedded resolver at 127.0.0.11. They exist for when a config file hard-codes a hostname you cannot change, or when <code>db</code> should mean different containers in staging and production',
              'Đó là network alias: những tên DNS thêm, chỉ có hiệu lực trên một mạng, do bộ phân giải nhúng của Docker ở 127.0.0.11 phục vụ. Chúng có để dùng khi một file cấu hình ghi cứng một tên máy mà bạn không đổi được, hoặc khi <code>db</code> cần trỏ vào những container khác nhau ở môi trường thử và production',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The resolver is real DNS, re-resolved on every lookup, which is why it never goes stale after a restart — unlike the old <code>--link</code>, which wrote <code>/etc/hosts</code> entries once and kept a dead address. Two more properties worth knowing: several containers may share one alias, and Docker then returns all their addresses for crude round-robin; and any name the resolver does not know is forwarded upstream, so public DNS still works from inside a container.',
            'Bộ phân giải đó là DNS thật, tra lại ở mỗi lượt tra, và vì thế nó không bao giờ cũ đi sau một lần khởi động lại — khác với cờ <code>--link</code> ngày xưa, thứ ghi các dòng <code>/etc/hosts</code> đúng một lần rồi giữ lại một địa chỉ đã chết. Hai tính chất nữa đáng biết: nhiều container dùng chung được một alias, và khi đó Docker trả về hết địa chỉ của chúng để chia tải thô; và cái tên nào bộ phân giải không biết thì được chuyển tiếp lên trên, nên DNS công cộng vẫn chạy được từ bên trong container.',
          ),
        }),

        // q25 · đáp án 0
        mcq({
          prompt: B(
            'Real, verbatim. What is Docker telling you, and what follows from it?' + code(
              '$ docker run --rm --network host -p 8080:80 alpine:3.20 echo ok\n' +
              'WARNING: Published ports are discarded when using host network mode\n' +
              'ok',
            ),
            'Nguyên văn, chạy thật. Docker đang nói gì, và từ đó suy ra điều gì?' + code(
              '$ docker run --rm --network host -p 8080:80 alpine:3.20 echo ok\n' +
              'WARNING: Published ports are discarded when using host network mode\n' +
              'ok',
            ),
          ),
          options: [
            B(
              'In host mode there is no network namespace at all, so there is nothing to map from and nothing to map to — the container binds host ports directly, which also means two containers cannot both take 8080 and a compromised one sits on the host\'s interfaces',
              'Ở chế độ host thì hoàn toàn không có network namespace, nên không có gì để ánh xạ từ đâu và không có gì để ánh xạ tới — container gắn thẳng vào cổng của máy chủ, tức là hai container không cùng lấy được 8080 và một container bị chiếm thì nằm ngay trên các giao diện của máy chủ',
            ),
            B(
              'The mapping is deferred until the container publishes something itself, so <code>-p</code> takes effect only after the process inside calls <code>listen()</code> on the matching port',
              'Phép ánh xạ bị hoãn tới khi chính container công bố thứ gì đó, nên <code>-p</code> chỉ có tác dụng sau khi tiến trình bên trong gọi <code>listen()</code> ở đúng cổng đó',
            ),
            B(
              'Host mode ignores <code>-p</code> only for TCP; adding <code>/udp</code> to the mapping makes it apply again, which is why the warning does not mention a protocol',
              'Chế độ host chỉ bỏ qua <code>-p</code> với TCP; thêm <code>/udp</code> vào phép ánh xạ là nó lại có tác dụng, và vì thế cảnh báo không nhắc tới giao thức nào',
            ),
            B(
              'The port was already claimed by another process, and host mode reports that condition as a warning rather than as the usual "address already in use" error',
              'Cổng đó đã bị một tiến trình khác chiếm, và chế độ host báo tình trạng ấy dưới dạng cảnh báo chứ không phải lỗi "address already in use" như thường lệ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Host mode is occasionally right — a monitoring agent that must see the host\'s interfaces, software needing broadcast or multicast, a load balancer where NAT is measurable. It is much more often reached for to "fix" a connection problem, which is exactly what makes it dangerous: the immediate error goes away, the real bug (a service bound to 127.0.0.1, two containers on different networks, a reversed port map) is still there and now hidden. On Docker Desktop it also behaves differently from Linux, because "the host" there is the Linux VM.',
            'Chế độ host thỉnh thoảng là đúng — một tác nhân giám sát phải nhìn thấy giao diện của máy chủ, phần mềm cần broadcast hay multicast, một bộ cân bằng tải nơi NAT đo được. Nhưng nó bị vớ lấy để "chữa" một trục trặc kết nối nhiều hơn hẳn, và đó đúng là điều làm nó nguy hiểm: thông báo lỗi trước mắt biến mất, còn lỗi thật (một dịch vụ gắn vào 127.0.0.1, hai container ở hai mạng khác nhau, một ánh xạ cổng viết ngược) vẫn nằm đó và giờ thì bị che đi. Trên Docker Desktop nó còn hành xử khác Linux, vì "máy chủ" ở đó là cái máy ảo Linux.',
          ),
        }),

        // q26 · đáp án 1
        mcq({
          prompt: B(
            'Both containers were run against the same nginx container on the same network. Why does one see the site on <code>localhost</code> and the other does not?' + code(
              '$ docker run --rm --network container:pt2_app alpine:3.20 \\\n' +
              '    sh -c \'wget -qO- http://localhost/ | head -1\'\n' +
              '&lt;!DOCTYPE html&gt;\n' +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 \\\n' +
              '    sh -c \'wget -T2 -qO- http://localhost/\'\n' +
              "wget: can't connect to remote host: Connection refused",
            ),
            'Hai container cùng chạy nhắm vào một container nginx trên cùng một mạng. Vì sao một cái thấy trang web ở <code>localhost</code> còn cái kia thì không?' + code(
              '$ docker run --rm --network container:pt2_app alpine:3.20 \\\n' +
              '    sh -c \'wget -qO- http://localhost/ | head -1\'\n' +
              '&lt;!DOCTYPE html&gt;\n' +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 \\\n' +
              '    sh -c \'wget -T2 -qO- http://localhost/\'\n' +
              "wget: can't connect to remote host: Connection refused",
            ),
          ),
          options: [
            B(
              'The first container inherits nginx\'s published port mapping, so <code>localhost</code> reaches the host side of that mapping while the second has no mapping of its own',
              'Container thứ nhất thừa hưởng ánh xạ cổng đã công bố của nginx, nên <code>localhost</code> tới được phía máy chủ của ánh xạ đó còn cái thứ hai thì không có ánh xạ nào của riêng nó',
            ),
            B(
              '<code>--network container:X</code> puts the new container INSIDE the target\'s network namespace — same interfaces, same sockets, same <code>localhost</code>. Merely being on the same network gives you your own namespace, where <code>localhost</code> is your own loopback and nobody is listening',
              '<code>--network container:X</code> đặt container mới VÀO BÊN TRONG network namespace của mục tiêu — cùng giao diện, cùng socket, cùng <code>localhost</code>. Còn chỉ ở chung một mạng thì bạn có namespace riêng, nơi <code>localhost</code> là loopback của chính bạn và chẳng ai nghe ở đó',
            ),
            B(
              'The second command used <code>-T2</code>, which sets a two-second timeout that expires before Docker\'s embedded resolver has answered, and the timeout is reported as a refusal',
              'Lệnh thứ hai dùng <code>-T2</code>, đặt hạn hai giây và hạn đó hết trước khi bộ phân giải nhúng của Docker kịp trả lời, rồi việc hết giờ bị báo thành từ chối',
            ),
            B(
              'nginx binds to <code>0.0.0.0</code>, which excludes the loopback interface, so only a container sharing its bridge address can reach it while loopback traffic is refused',
              'nginx gắn vào <code>0.0.0.0</code>, và địa chỉ đó loại trừ giao diện loopback, nên chỉ container nào dùng chung địa chỉ bridge của nó mới với tới được còn lưu lượng loopback thì bị từ chối',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the most useful diagnostic move in the chapter: a tool-rich image such as <code>nicolaka/netshoot</code> joined to the app\'s namespace gives you <code>ss</code>, <code>dig</code>, <code>curl</code> and <code>tcpdump</code> with the app\'s own view of the network, without adding a single byte to the application image. It is also how sidecars work in Kubernetes pods. The general rule it teaches: test from the same vantage point as the thing that is failing — matching the vantage point is most of the skill.',
            'Đây là nước đi chẩn đoán hữu ích nhất chương: một ảnh đầy công cụ như <code>nicolaka/netshoot</code> được ghép vào namespace của ứng dụng cho bạn <code>ss</code>, <code>dig</code>, <code>curl</code> và <code>tcpdump</code> với đúng tầm nhìn mạng của ứng dụng, mà không thêm một byte nào vào ảnh ứng dụng. Đó cũng là cách sidecar hoạt động trong pod của Kubernetes. Quy tắc chung nó dạy: hãy kiểm từ đúng vị trí quan sát của thứ đang hỏng — khớp được vị trí quan sát đã là phần lớn kỹ năng.',
          ),
        }),

        // q27 · đáp án 2
        mcq({
          prompt: B(
            'Measured. Two containers, two networks, one difference in the routing table. What did <code>--internal</code> do?' + code(
              '$ docker network create --internal pt2-priv\n' +
              '$ docker run --rm --network pt2-priv alpine:3.20 sh -c \'ip route; wget -T3 -qO- http://example.com\'\n' +
              '172.21.0.0/16 dev eth0 scope link  src 172.21.0.2\n' +
              "wget: bad address 'example.com'\n" +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 sh -c \'ip route | head -1\'\n' +
              'default via 172.20.0.1 dev eth0',
            ),
            'Đo thật. Hai container, hai mạng, một khác biệt trong bảng định tuyến. <code>--internal</code> đã làm gì?' + code(
              '$ docker network create --internal pt2-priv\n' +
              '$ docker run --rm --network pt2-priv alpine:3.20 sh -c \'ip route; wget -T3 -qO- http://example.com\'\n' +
              '172.21.0.0/16 dev eth0 scope link  src 172.21.0.2\n' +
              "wget: bad address 'example.com'\n" +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 sh -c \'ip route | head -1\'\n' +
              'default via 172.20.0.1 dev eth0',
            ),
          ),
          options: [
            B(
              'It made the network read-only, so containers on it can accept connections but cannot open new ones in either direction',
              'Nó làm mạng đó thành chỉ-đọc, nên container trên mạng ấy nhận được kết nối tới nhưng không mở được kết nối mới theo cả hai chiều',
            ),
            B(
              'It disabled Docker\'s embedded resolver on that network, which is why the name did not resolve — connectivity itself is unchanged and a raw IP address would still work',
              'Nó tắt bộ phân giải nhúng của Docker trên mạng đó, và vì thế cái tên không phân giải được — còn khả năng kết nối thì không đổi và một địa chỉ IP trần vẫn chạy',
            ),
            B(
              'It created a bridge with no default route, so there is no path out at all: containers on it still reach each other by name, and a database on such a network physically cannot reach the internet — free security, and one flag',
              'Nó tạo một bridge không có tuyến mặc định, nên hoàn toàn không có đường ra: container trên đó vẫn gọi nhau bằng tên, còn một cơ sở dữ liệu nằm trên mạng như thế thì về mặt vật lý không với tới Internet được — an toàn miễn phí, chỉ tốn một cái cờ',
            ),
            B(
              'It moved the network into the host namespace, where outbound traffic is governed by the host firewall rather than by Docker\'s own NAT rules',
              'Nó dời cái mạng vào namespace của máy chủ, nơi lưu lượng đi ra do tường lửa của máy chủ quản chứ không do luật NAT của chính Docker',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The routing table is the evidence: the internal network has only its own subnet, no <code>default via</code>. Combine it with the fact that a container can join several networks and you get the shape a small deployment should have — a proxy on a public network, a database on an <code>--internal</code> one, and the API on both. If the proxy is ever compromised, the database is not one <code>nc</code> away; it cannot even be named from there.',
            'Bảng định tuyến chính là bằng chứng: mạng internal chỉ có mỗi mạng con của nó, không có dòng <code>default via</code>. Ghép nó với việc một container tham gia được nhiều mạng là bạn có đúng hình dạng mà một bản triển khai nhỏ nên có — một proxy trên mạng công khai, một cơ sở dữ liệu trên mạng <code>--internal</code>, và API nằm trên cả hai. Nếu proxy có bị chiếm thì cơ sở dữ liệu không nằm cách đó một lệnh <code>nc</code>; từ đó thậm chí không gọi nổi tên nó.',
          ),
        }),

        // q28 · đáp án 3
        mcq({
          prompt: B(
            'Measured. Redis published nothing at all, and the two probes disagree. What is the rule?' + code(
              '$ docker run -d --name cache --network pt2-net redis:7-alpine     # no -p\n' +
              '$ docker port cache\n' +
              '(no output)\n' +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 \\\n' +
              '    sh -c \'getent hosts cache; nc -z -w2 cache 6379 && echo "6379 open"\'\n' +
              '172.20.0.2        cache\n' +
              '6379 open\n' +
              '\n' +
              '$ nc -z -w2 localhost 6379   # from the host\n' +
              'host: refused/closed',
            ),
            'Đo thật. Redis chẳng công bố gì cả, và hai phép thử cho kết quả trái nhau. Quy tắc là gì?' + code(
              '$ docker run -d --name cache --network pt2-net redis:7-alpine     # không có -p\n' +
              '$ docker port cache\n' +
              '(không có gì)\n' +
              '\n' +
              '$ docker run --rm --network pt2-net alpine:3.20 \\\n' +
              '    sh -c \'getent hosts cache; nc -z -w2 cache 6379 && echo "6379 open"\'\n' +
              '172.20.0.2        cache\n' +
              '6379 open\n' +
              '\n' +
              '$ nc -z -w2 localhost 6379   # từ máy chủ\n' +
              'host: refused/closed',
            ),
          ),
          options: [
            B(
              'The container port is open to the network only while a name lookup is cached; the host probe failed because it went straight to an address without a preceding DNS query',
              'Cổng của container chỉ mở ra mạng trong lúc một lượt tra tên còn nằm trong bộ đệm; phép thử từ máy chủ hỏng vì nó đi thẳng tới địa chỉ mà không có lượt tra DNS đi trước',
            ),
            B(
              'Redis binds to the bridge address rather than to <code>0.0.0.0</code>, which is why the host cannot reach it and a peer container can — publishing a port would not change that',
              'Redis gắn vào địa chỉ bridge chứ không gắn vào <code>0.0.0.0</code>, và vì thế máy chủ không với tới được còn một container hàng xóm thì được — công bố một cổng cũng không đổi được điều đó',
            ),
            B(
              'The host probe used <code>localhost</code>, and on this machine Docker runs inside a VM, so the host\'s loopback and the container network are simply two different address spaces regardless of publishing',
              'Phép thử từ máy chủ dùng <code>localhost</code>, mà trên cỗ máy này Docker chạy trong một máy ảo, nên loopback của máy chủ và mạng container đơn giản là hai không gian địa chỉ khác nhau bất kể có công bố hay không',
            ),
            B(
              'Publishing is only about the HOST boundary. Container-to-container traffic never crosses it, so a peer on the same network reaches 6379 with nothing published — and between containers you always use the CONTAINER\'s port, never the published host port',
              'Công bố cổng chỉ liên quan tới ranh giới với MÁY CHỦ. Lưu lượng giữa các container không bao giờ vượt qua ranh giới đó, nên một hàng xóm trên cùng mạng tới được 6379 mà chẳng cần công bố gì — và giữa các container thì luôn dùng cổng CỦA CONTAINER, không bao giờ dùng cổng máy chủ đã công bố',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the correct shape for a backend service: reachable by the things that need it, invisible to everything else. It also settles a frequent confusion — a database published as <code>-p 5433:5432</code> is still <code>5432</code> from another container, and using 5433 there silently connects to nothing. Publishing a port on a public VPS is the opposite move, and Docker writes its DNAT rules where UFW never sees them, so a published database port is on the internet whatever your firewall says.',
            'Đây là hình dạng đúng cho một dịch vụ backend: những thứ cần nó thì với tới được, còn lại thì không thấy nó. Nó cũng dẹp một nhầm lẫn hay gặp — một cơ sở dữ liệu công bố kiểu <code>-p 5433:5432</code> thì từ container khác vẫn là <code>5432</code>, và gõ 5433 ở đó là lặng lẽ nối vào hư không. Công bố một cổng trên một VPS công khai là nước đi ngược lại, và Docker ghi luật DNAT của nó ở chỗ UFW không bao giờ nhìn thấy, nên một cổng cơ sở dữ liệu đã công bố là nằm trên Internet bất kể tường lửa của bạn nói gì.',
          ),
        }),

        // q29 · đáp án 0
        mcq({
          prompt: B(
            'A service runs on the host machine, not in Docker, and a container needs to reach it. Which pair of conditions has to hold?' + code(
              'docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 \\\n' +
              '  sh -c \'getent hosts host.docker.internal\'\n' +
              '172.17.0.1      host.docker.internal',
            ),
            'Một dịch vụ chạy trên chính máy chủ chứ không trong Docker, và một container cần với tới nó. Cặp điều kiện nào phải đúng?' + code(
              'docker run --rm --add-host=host.docker.internal:host-gateway alpine:3.20 \\\n' +
              '  sh -c \'getent hosts host.docker.internal\'\n' +
              '172.17.0.1      host.docker.internal',
            ),
          ),
          options: [
            B(
              'The container needs a name for the host — <code>host.docker.internal</code> mapped to <code>host-gateway</code>, which Docker Desktop provides automatically and Linux needs the flag for — AND the host service must listen on <code>0.0.0.0</code>, because the container arrives via the bridge interface, not via the host\'s loopback',
              'Container cần một cái tên để gọi máy chủ — <code>host.docker.internal</code> ánh xạ tới <code>host-gateway</code>, thứ mà Docker Desktop cấp sẵn còn Linux thì phải thêm cờ — VÀ dịch vụ trên máy chủ phải nghe ở <code>0.0.0.0</code>, vì container đi vào qua giao diện bridge chứ không qua loopback của máy chủ',
            ),
            B(
              'The container must be started with <code>--network host</code> and the service must listen on a port above 1024, because a bridged container cannot reach any privileged port on the host side',
              'Container phải khởi chạy với <code>--network host</code> và dịch vụ phải nghe ở một cổng trên 1024, vì một container ở chế độ bridge không với tới được cổng đặc quyền nào phía máy chủ',
            ),
            B(
              'The host service must be published with <code>-p</code> from the host side, and the container must join the same user-defined network that the publishing created',
              'Dịch vụ trên máy chủ phải được công bố bằng <code>-p</code> từ phía máy chủ, và container phải tham gia đúng cái mạng tự tạo mà việc công bố đó sinh ra',
            ),
            B(
              'The container needs <code>--dns 127.0.0.11</code> so that the embedded resolver forwards the name upstream, and the host service must have a matching entry in the host\'s <code>/etc/hosts</code>',
              'Container cần <code>--dns 127.0.0.11</code> để bộ phân giải nhúng chuyển tiếp cái tên lên trên, và dịch vụ trên máy chủ phải có một dòng tương ứng trong <code>/etc/hosts</code> của máy chủ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The second half is where people get stuck: a host Postgres on <code>127.0.0.1:5432</code> refuses the container exactly as it refuses any other machine, because from the host\'s point of view the container IS another machine on a small private network. Using one portable name rather than the bridge gateway address means the same compose file runs on a Mac and on a Linux CI runner. And the better answer, where it is available, is to put the service in a container too — then it is just a name on a network.',
            'Nửa sau mới là chỗ người ta hay mắc: một Postgres của máy chủ nghe ở <code>127.0.0.1:5432</code> từ chối container y hệt cách nó từ chối mọi cỗ máy khác, vì dưới góc nhìn của máy chủ thì container LÀ một cỗ máy khác trên một mạng riêng nhỏ. Dùng một cái tên đi được khắp nơi thay cho địa chỉ gateway của bridge nghĩa là cùng một file compose chạy được trên Mac và trên một máy CI Linux. Còn câu trả lời tốt hơn, ở đâu làm được, là đưa luôn dịch vụ đó vào một container — khi ấy nó chỉ là một cái tên trên một mạng.',
          ),
        }),

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'Three commands, and the whole topology of a stack on screen. Which failure does this immediately rule in or out?' + code(
              "$ docker inspect -f '{{ .Name }} → {{ range $n, $v := .NetworkSettings.Networks }}{{ $n }} {{ $v.IPAddress }} {{ end }}' $(docker ps -q)\n" +
              '/proxy   → public 172.20.0.3\n' +
              '/backend → private 172.21.0.2 public 172.20.0.2\n' +
              '/db      → private 172.21.0.3\n' +
              '\n' +
              "$ docker ps --format 'table {{.Names}}\\t{{.Ports}}'\n" +
              'proxy     0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp\n' +
              'backend   3000/tcp\n' +
              'db        5432/tcp',
            ),
            'Ba câu lệnh, và cả topo của một stack hiện lên màn hình. Nó loại ngay hoặc xác nhận ngay kiểu hỏng nào?' + code(
              "$ docker inspect -f '{{ .Name }} → {{ range $n, $v := .NetworkSettings.Networks }}{{ $n }} {{ $v.IPAddress }} {{ end }}' $(docker ps -q)\n" +
              '/proxy   → public 172.20.0.3\n' +
              '/backend → private 172.21.0.2 public 172.20.0.2\n' +
              '/db      → private 172.21.0.3\n' +
              '\n' +
              "$ docker ps --format 'table {{.Names}}\\t{{.Ports}}'\n" +
              'proxy     0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp\n' +
              'backend   3000/tcp\n' +
              'db        5432/tcp',
            ),
          ),
          options: [
            B(
              'Whether the database is bound to <code>0.0.0.0</code> or to <code>127.0.0.1</code> inside its own namespace, which the <code>5432/tcp</code> entry states directly',
              'Chuyện cơ sở dữ liệu gắn vào <code>0.0.0.0</code> hay vào <code>127.0.0.1</code> bên trong namespace của chính nó, điều mà dòng <code>5432/tcp</code> nói thẳng ra',
            ),
            B(
              'Whether two containers even share a network — <code>proxy</code> and <code>db</code> do not, so a name lookup from the proxy cannot resolve <code>db</code> at all, and no amount of port or firewall debugging would explain it',
              'Chuyện hai container có chung mạng hay không — <code>proxy</code> và <code>db</code> thì không, nên một lượt tra tên từ proxy không thể phân giải nổi <code>db</code>, và có gỡ lỗi cổng hay tường lửa bao nhiêu cũng không giải thích được',
            ),
            B(
              'Whether the proxy\'s published ports are reachable from the internet, which the <code>0.0.0.0</code> prefix answers for both 80 and 443 without any further checking',
              'Chuyện các cổng đã công bố của proxy có với tới được từ Internet hay không, điều mà tiền tố <code>0.0.0.0</code> trả lời cho cả 80 lẫn 443 mà chẳng cần kiểm gì thêm',
            ),
            B(
              'Whether the backend process has finished starting, since a container that appears in <code>docker ps</code> with a port listed is by definition already listening on it',
              'Chuyện tiến trình backend đã khởi động xong chưa, vì một container xuất hiện trong <code>docker ps</code> kèm một cổng được liệt kê thì theo định nghĩa là đã nghe ở cổng đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Most "the network is broken" reports are answered by this listing before any diagnostic tool runs: a container missing from a network, or a port published where it should not be. Then ask the four questions in order — is the process listening, on what address, does the name resolve, does a packet get through. Note that <code>3000/tcp</code> and <code>5432/tcp</code> with no arrow are EXPOSE metadata, not evidence that anything is listening, and refused and timeout are different diagnoses: one means something answered no, the other means silence.',
            'Phần lớn những báo cáo kiểu "mạng hỏng rồi" được bản liệt kê này trả lời xong trước khi chạy bất kỳ công cụ chẩn đoán nào: một container thiếu mặt trên một mạng, hoặc một cổng công bố ở chỗ không nên. Rồi hãy hỏi bốn câu theo thứ tự — tiến trình có đang nghe không, nghe ở địa chỉ nào, cái tên có phân giải được không, gói tin có đi qua được không. Để ý <code>3000/tcp</code> và <code>5432/tcp</code> không có mũi tên là siêu dữ liệu EXPOSE, không phải bằng chứng rằng có ai đang nghe, và refused với timeout là hai chẩn đoán khác nhau: một bên là có thứ gì trả lời không, bên kia là im lặng.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q31 — Predict the build cache (chapter 5).</b> Model BuildKit\'s cache the way Chapter 5 describes it, then replay six builds of one Dockerfile and say which steps are CACHED.</p>' +
            '<p><code>khoaRieng(step, build)</code> returns the step\'s OWN key, as a string:</p>' +
            '<ul>' +
            '<li><code>FROM</code> → <code>&quot;FROM#&quot; + build.base</code> (the base image digest).</li>' +
            '<li><code>ARG</code> → <code>&quot;ARG#&quot; + step.text + &quot;=&quot; + (build.args[step.text] ?? &quot;&quot;)</code>.</li>' +
            '<li><code>COPY</code> → <code>&quot;COPY#&quot;</code> followed by, for each path in <code>step.srcs</code> in order, <code>path + &quot;=&quot; + build.files[path]</code>, joined with <code>&quot;,&quot;</code>. The CONTENTS matter, not the order they were written.</li>' +
            '<li>Anything else → <code>step.op + &quot;#&quot; + step.text</code>. A RUN is keyed on its command STRING and nothing else.</li>' +
            '</ul>' +
            '<p><code>dungMot(build, daBiet)</code> walks the instructions top to bottom, building a CHAINED key: start from the empty string and append <code>&quot;~&quot; + khoaRieng(...)</code> at each step, so the key of step N contains the key of step N−1. A step is <code>&quot;CACHED&quot;</code> when its chained key is already in the <code>daBiet</code> set; otherwise it is <code>&quot;RUN&quot;</code>. Add every chained key to the set as you go, and return the array of verdicts.</p>' +
            '<p><code>dungTatCa(builds)</code> runs the builds in order against ONE shared set and returns, per build, <code>{ ten, ketQua, cached }</code> where <code>cached</code> counts the CACHED steps.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Đoán trước bộ đệm lúc dựng (chương 5).</b> Hãy mô hình hoá bộ đệm của BuildKit đúng như chương 5 mô tả, rồi phát lại sáu lượt dựng của một Dockerfile và nói bước nào là CACHED.</p>' +
            '<p><code>khoaRieng(step, build)</code> trả về khoá RIÊNG của bước đó, dạng chuỗi:</p>' +
            '<ul>' +
            '<li><code>FROM</code> → <code>&quot;FROM#&quot; + build.base</code> (digest của ảnh nền).</li>' +
            '<li><code>ARG</code> → <code>&quot;ARG#&quot; + step.text + &quot;=&quot; + (build.args[step.text] ?? &quot;&quot;)</code>.</li>' +
            '<li><code>COPY</code> → <code>&quot;COPY#&quot;</code> rồi tới, với từng đường dẫn trong <code>step.srcs</code> theo đúng thứ tự, <code>path + &quot;=&quot; + build.files[path]</code>, nối lại bằng <code>&quot;,&quot;</code>. NỘI DUNG mới là thứ quan trọng, không phải thứ tự viết ra.</li>' +
            '<li>Còn lại → <code>step.op + &quot;#&quot; + step.text</code>. Một lệnh RUN lấy khoá theo CHUỖI câu lệnh của nó và chỉ thế thôi.</li>' +
            '</ul>' +
            '<p><code>dungMot(build, daBiet)</code> đi từ trên xuống dưới, dựng một khoá NỐI CHUỖI: bắt đầu từ chuỗi rỗng và nối thêm <code>&quot;~&quot; + khoaRieng(...)</code> ở mỗi bước, để khoá của bước N chứa cả khoá của bước N−1. Một bước là <code>&quot;CACHED&quot;</code> khi khoá nối chuỗi của nó đã có sẵn trong tập <code>daBiet</code>; ngược lại là <code>&quot;RUN&quot;</code>. Vừa đi vừa thêm mọi khoá nối chuỗi vào tập, rồi trả về mảng kết luận.</p>' +
            '<p><code>dungTatCa(builds)</code> chạy các lượt dựng theo thứ tự trên MỘT tập dùng chung và trả về, với mỗi lượt, <code>{ ten, ketQua, cached }</code> trong đó <code>cached</code> đếm số bước CACHED.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const DOCKERFILE = [\n' +
            "  { op: 'FROM',    text: 'node:22-alpine' },\n" +
            "  { op: 'ARG',     text: 'BUILD_DATE' },\n" +
            "  { op: 'WORKDIR', text: '/app' },\n" +
            "  { op: 'COPY',    text: 'manifests', srcs: ['package.json', 'package-lock.json'] },\n" +
            "  { op: 'RUN',     text: 'npm ci --omit=dev' },\n" +
            "  { op: 'COPY',    text: 'source', srcs: ['src/index.js', 'src/util.js'] },\n" +
            "  { op: 'RUN',     text: 'npm run build' },\n" +
            "  { op: 'CMD',     text: 'node dist/index.js' },\n" +
            '];\n\n' +
            'const F0 = {\n' +
            "  'package.json': '{\"deps\":1}',\n" +
            "  'package-lock.json': 'lock-v1',\n" +
            "  'src/index.js': 'console.log(1)',\n" +
            "  'src/util.js': 'export const a = 1',\n" +
            '};\n' +
            'const BUILDS = [\n' +
            "  { ten: 'cold',        base: 'sha256:aaa', args: { BUILD_DATE: 'none' }, files: { ...F0 } },\n" +
            "  { ten: 'nothing',     base: 'sha256:aaa', args: { BUILD_DATE: 'none' }, files: { ...F0 } },\n" +
            "  { ten: 'edit-source', base: 'sha256:aaa', args: { BUILD_DATE: 'none' }, files: { ...F0, 'src/index.js': 'console.log(2)' } },\n" +
            "  { ten: 'edit-lock',   base: 'sha256:aaa', args: { BUILD_DATE: 'none' }, files: { ...F0, 'package-lock.json': 'lock-v2' } },\n" +
            "  { ten: 'new-arg',     base: 'sha256:aaa', args: { BUILD_DATE: '2026-09-10' }, files: { ...F0 } },\n" +
            "  { ten: 'pulled-base', base: 'sha256:bbb', args: { BUILD_DATE: 'none' }, files: { ...F0 } },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function khoaRieng(step, build) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function dungMot(build, daBiet) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function dungTatCa(builds) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const r of dungTatCa(BUILDS)) {\n' +
            "  console.log(r.ten.padEnd(12), r.ketQua.map((k) => (k === 'CACHED' ? 'C' : 'R')).join(' '), ' cached=' + r.cached);\n" +
            '}\n',
          expectedOutput:
            'cold         R R R R R R R R  cached=0\n' +
            'nothing      C C C C C C C C  cached=8\n' +
            'edit-source  C C C C C R R R  cached=5\n' +
            'edit-lock    C C C R R R R R  cached=3\n' +
            'new-arg      C R R R R R R R  cached=1\n' +
            'pulled-base  R R R R R R R R  cached=0',
          sampleSolution:
            'function khoaRieng(step, build) {\n' +
            "  if (step.op === 'FROM') return 'FROM#' + build.base;\n" +
            "  if (step.op === 'ARG') return 'ARG#' + step.text + '=' + (build.args[step.text] ?? '');\n" +
            "  if (step.op === 'COPY') return 'COPY#' + step.srcs.map((p) => p + '=' + build.files[p]).join(',');\n" +
            "  return step.op + '#' + step.text;\n" +
            '}\n\n' +
            'function dungMot(build, daBiet) {\n' +
            '  const ketQua = [];\n' +
            "  let chuoi = '';\n" +
            '  for (const step of DOCKERFILE) {\n' +
            "    chuoi = chuoi + '~' + khoaRieng(step, build);\n" +
            '    const trung = daBiet.has(chuoi);\n' +
            '    daBiet.add(chuoi);\n' +
            "    ketQua.push(trung ? 'CACHED' : 'RUN');\n" +
            '  }\n' +
            '  return ketQua;\n' +
            '}\n\n' +
            'function dungTatCa(builds) {\n' +
            '  const daBiet = new Set();\n' +
            '  return builds.map((b) => {\n' +
            '    const ketQua = dungMot(b, daBiet);\n' +
            "    return { ten: b.ten, ketQua, cached: ketQua.filter((k) => k === 'CACHED').length };\n" +
            '  });\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Will this connection work? (chapters 7 + 8).</b> Given a small stack, implement the reachability rules from Chapter 8 so a script can answer "can A reach B on this port" without starting anything.</p>' +
            '<p><code>ketNoi(tuTen, host, port)</code> returns one of <code>&quot;ok&quot;</code>, <code>&quot;refused&quot;</code>, <code>&quot;dns-fail&quot;</code>, <code>&quot;no-such-container&quot;</code>:</p>' +
            '<ul>' +
            '<li>If <code>tuTen</code> names no container, return <code>&quot;no-such-container&quot;</code>.</li>' +
            '<li>If <code>host</code> is <code>&quot;localhost&quot;</code> or <code>&quot;127.0.0.1&quot;</code>, the target is the CALLING container itself — inside a namespace, loopback is your own.</li>' +
            '<li>Otherwise the target is a container that (a) is not the caller, (b) shares at least one network with the caller, NOT counting the default network named <code>&quot;bridge&quot;</code> (names never resolve there), and (c) matches <code>host</code> by its <code>name</code> or by one of its <code>aliases</code>. If there is none, return <code>&quot;dns-fail&quot;</code>. If several match, take the first in <code>CONTAINERS</code> order.</li>' +
            '<li>Then: a target whose <code>port</code> is not the requested one → <code>&quot;refused&quot;</code>. A target listening on <code>&quot;127.0.0.1&quot;</code> reached from anything other than itself → <code>&quot;refused&quot;</code>. Otherwise <code>&quot;ok&quot;</code>. The <code>publish</code> field is irrelevant between containers.</li>' +
            '</ul>' +
            '<p><code>tuMayChu(port)</code> answers the same question from the HOST: return <code>&quot;ok:&quot; + name</code> for the container that published that host port, or <code>&quot;refused&quot;</code> when none did.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Kết nối này có chạy không? (chương 7 + 8).</b> Cho một stack nhỏ, hãy cài đặt các quy tắc với-tới-được của chương 8 để một script trả lời được "A có gọi được B ở cổng này không" mà không cần khởi chạy gì.</p>' +
            '<p><code>ketNoi(tuTen, host, port)</code> trả về một trong <code>&quot;ok&quot;</code>, <code>&quot;refused&quot;</code>, <code>&quot;dns-fail&quot;</code>, <code>&quot;no-such-container&quot;</code>:</p>' +
            '<ul>' +
            '<li>Nếu <code>tuTen</code> không gọi tên container nào, trả về <code>&quot;no-such-container&quot;</code>.</li>' +
            '<li>Nếu <code>host</code> là <code>&quot;localhost&quot;</code> hoặc <code>&quot;127.0.0.1&quot;</code> thì đích chính là container ĐANG GỌI — trong một namespace thì loopback là của chính mình.</li>' +
            '<li>Ngược lại, đích là một container (a) không phải người gọi, (b) chung ít nhất một mạng với người gọi, KHÔNG tính mạng mặc định tên <code>&quot;bridge&quot;</code> (ở đó tên không bao giờ phân giải được), và (c) khớp <code>host</code> qua <code>name</code> hoặc qua một phần tử trong <code>aliases</code> của nó. Không có cái nào thì trả <code>&quot;dns-fail&quot;</code>. Nhiều cái khớp thì lấy cái đầu theo thứ tự trong <code>CONTAINERS</code>.</li>' +
            '<li>Sau đó: đích có <code>port</code> khác cổng được hỏi → <code>&quot;refused&quot;</code>. Đích nghe ở <code>&quot;127.0.0.1&quot;</code> mà bị gọi từ thứ khác không phải chính nó → <code>&quot;refused&quot;</code>. Còn lại là <code>&quot;ok&quot;</code>. Trường <code>publish</code> không liên quan gì giữa các container.</li>' +
            '</ul>' +
            '<p><code>tuMayChu(port)</code> trả lời cùng câu hỏi đó từ phía MÁY CHỦ: trả về <code>&quot;ok:&quot; + tên</code> của container đã công bố cổng máy chủ đó, hoặc <code>&quot;refused&quot;</code> nếu không có cái nào.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CONTAINERS = [\n' +
            "  { name: 'proxy',   networks: ['public'],            aliases: [],      listen: '0.0.0.0',   port: 80,   publish: 8080 },\n" +
            "  { name: 'api',     networks: ['public', 'private'], aliases: ['web'], listen: '0.0.0.0',   port: 3000, publish: null },\n" +
            "  { name: 'db',      networks: ['private'],           aliases: ['pg'],  listen: '0.0.0.0',   port: 5432, publish: null },\n" +
            "  { name: 'metrics', networks: ['private'],           aliases: [],      listen: '127.0.0.1', port: 9090, publish: null },\n" +
            "  { name: 'legacy',  networks: ['bridge'],            aliases: [],      listen: '0.0.0.0',   port: 7000, publish: 7000 },\n" +
            "  { name: 'old',     networks: ['bridge'],            aliases: [],      listen: '0.0.0.0',   port: 7001, publish: null },\n" +
            '];\n\n' +
            'const THU = [\n' +
            "  ['proxy', 'api', 3000],\n" +
            "  ['proxy', 'web', 3000],\n" +
            "  ['proxy', 'db', 5432],\n" +
            "  ['api', 'pg', 5432],\n" +
            "  ['api', 'db', 3000],\n" +
            "  ['api', 'metrics', 9090],\n" +
            "  ['api', 'localhost', 3000],\n" +
            "  ['api', 'localhost', 5432],\n" +
            "  ['old', 'legacy', 7000],\n" +
            "  ['proxy', 'api', 8080],\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function ketNoi(tuTen, host, port) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function tuMayChu(port) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const [tu, host, port] of THU) {\n' +
            "  console.log((tu + ' -> ' + host + ':' + port).padEnd(28), ketNoi(tu, host, port));\n" +
            '}\n' +
            "for (const p of [8080, 3000, 7000, 5432]) console.log(('host:' + p).padEnd(28), tuMayChu(p));\n",
          expectedOutput:
            'proxy -> api:3000            ok\n' +
            'proxy -> web:3000            ok\n' +
            'proxy -> db:5432             dns-fail\n' +
            'api -> pg:5432               ok\n' +
            'api -> db:3000               refused\n' +
            'api -> metrics:9090          refused\n' +
            'api -> localhost:3000        ok\n' +
            'api -> localhost:5432        refused\n' +
            'old -> legacy:7000           dns-fail\n' +
            'proxy -> api:8080            refused\n' +
            'host:8080                    ok:proxy\n' +
            'host:3000                    refused\n' +
            'host:7000                    ok:legacy\n' +
            'host:5432                    refused',
          sampleSolution:
            'function timTheo(ten) {\n' +
            '  return CONTAINERS.find((c) => c.name === ten) || null;\n' +
            '}\n\n' +
            'function ketNoi(tuTen, host, port) {\n' +
            '  const tu = timTheo(tuTen);\n' +
            "  if (!tu) return 'no-such-container';\n\n" +
            '  let dich = null;\n' +
            "  if (host === 'localhost' || host === '127.0.0.1') {\n" +
            '    dich = tu;\n' +
            '  } else {\n' +
            '    const chung = CONTAINERS.filter((c) =>\n' +
            '      c !== tu &&\n' +
            "      c.networks.some((n) => n !== 'bridge' && tu.networks.includes(n)) &&\n" +
            '      (c.name === host || c.aliases.includes(host)));\n' +
            "    if (chung.length === 0) return 'dns-fail';\n" +
            '    dich = chung[0];\n' +
            '  }\n\n' +
            "  if (dich.port !== port) return 'refused';\n" +
            "  if (dich.listen === '127.0.0.1' && dich !== tu) return 'refused';\n" +
            "  return 'ok';\n" +
            '}\n\n' +
            'function tuMayChu(port) {\n' +
            '  const c = CONTAINERS.find((x) => x.publish === port);\n' +
            "  return c ? 'ok:' + c.name : 'refused';\n" +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
