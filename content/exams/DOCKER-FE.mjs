/**
 * Docker — Final Exam (FE): 50 câu trắc nghiệm phủ cả 13 chương (s00–s12).
 *
 * Đề tự soạn, bám sát `content/courses/docker/s00…s12`. Có cả câu lý thuyết lẫn
 * câu đọc terminal; MỌI đoạn output trong đề đều CHẠY THẬT trên Docker Engine
 * 29.5.3 / Compose v5.1.4 (Docker Desktop 4.78, nhân 6.12.76-linuxkit,
 * linux/arm64) — mã thoát, thông báo lỗi, số đo kích thước ảnh và thời gian
 * dựng đều là nguyên văn máy in ra, không phải trí nhớ.
 *
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (1.3, 4.3) nói `docker stop` chờ 10 giây rồi mới SIGKILL. Trên
 *     Engine 29.5.3 mặc định `.Config.StopTimeout` là **1**, đo được 1,16s —
 *     nên đề chỉ hỏi CƠ CHẾ (SIGTERM → ân hạn → SIGKILL → 137), không hỏi con
 *     số 10 giây.
 *   • Giáo trình (4.2) cho ví dụ `VOLUME /data` rồi `RUN echo > /data/file.txt`
 *     và nói file bị vứt lúc chạy. Với BuildKit thì chính LƯỢT DỰNG hỏng
 *     (`can't create /data/file.txt: nonexistent directory`), còn nếu `mkdir`
 *     trước thì file lại SỐNG SÓT vào ảnh — nên đề không dùng ví dụ đó.
 *   • Giáo trình (9.2, quiz 9.6) nói YAML đọc `22:22` thành số hệ sáu mươi.
 *     Compose v5.1.4 phân giải đúng thành `target: 22, published: "22"` — nên
 *     đề không có câu nào dựa vào cái bẫy đó.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/DOCKER-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DOCKER-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/docker-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all thirteen chapters, from "what a container is actually made of" to "a green build is not a running image". Many questions show a real terminal transcript and ask you to explain it; every one of those outputs came from actually running the command, so read the transcript rather than the intuition.</p>' +
  '<p>Three habits pay off here. First, separate the two boundaries: publishing a port concerns the <em>host</em>, while container-to-container traffic never crosses it. Second, read exit codes as evidence — 125 is Docker itself, 126 is found-but-not-executable, 127 is not found, 137 is a kill. Third, when a question shows a status line, use it: <code>Created</code>, <code>Exited (1)</code> and <code>Restarting</code> point at three different layers of the problem.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười ba chương, từ "container thật ra được làm bằng gì" tới "build xanh không có nghĩa là ảnh chạy được". Nhiều câu cho sẵn một đoạn terminal thật rồi hỏi bạn giải thích nó; mọi đoạn output loại đó đều lấy từ việc chạy thật câu lệnh, nên hãy đọc đoạn terminal thay vì đoán theo cảm tính.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, tách bạch hai ranh giới: công bố một cổng là chuyện với MÁY CHỦ, còn lưu lượng giữa các container thì không bao giờ vượt qua ranh giới đó. Hai, đọc mã thoát như đọc bằng chứng — 125 là chính Docker, 126 là tìm thấy nhưng không chạy được, 127 là không tìm thấy, 137 là bị giết. Ba, khi một câu cho sẵn dòng trạng thái thì hãy dùng nó: <code>Created</code>, <code>Exited (1)</code> và <code>Restarting</code> chỉ vào ba tầng khác nhau của vấn đề.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'docker' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole Docker course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Docker (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all thirteen chapters: what a container is made of, layers and the writable layer, running and observing containers, image names, tags and digests, writing Dockerfiles, the build cache, multi-stage and safe images, volumes and bind mounts, networking and published ports, Compose, a real five-service stack, production limits and logs, and a method for diagnosing what broke.',
        'Năm mươi câu trắc nghiệm phủ cả mười ba chương: container được làm bằng gì, tầng ảnh và tầng ghi được, chạy và quan sát container, tên ảnh với tag và digest, viết Dockerfile, cache lúc dựng, dựng nhiều tầng và ảnh an toàn, volume và bind mount, mạng và cổng công bố, Compose, một stack năm dịch vụ thật, hạn mức và log trên production, và một phương pháp chẩn đoán khi có thứ hỏng.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — giới thiệu, cài đặt, năm phút đầu (2 câu) ───────────── */

        // q1 · đáp án 0
        mcq({
          prompt: B(
            'What is the difference between an image and a container?',
            'Image khác container ở chỗ nào?',
          ),
          options: [
            B(
              'An image is a read-only filesystem plus the metadata to start a process in it; a container is one running instance of that image with a thin writable layer on top',
              'Image là một hệ thống file chỉ-đọc cộng siêu dữ liệu để khởi chạy một tiến trình bên trong; container là một bản đang chạy của image đó, có thêm một tầng ghi được mỏng nằm trên',
            ),
            B(
              'They are two names for the same artifact: "image" is what the registry stores and "container" is what the same bytes are called once they are on your disk',
              'Chúng là hai tên của cùng một hiện vật: "image" là thứ registry lưu, còn "container" là tên gọi của đúng những byte đó khi đã nằm trên đĩa của bạn',
            ),
            B(
              'An image is the compressed form and a container is the extracted form; Docker unpacks the image into a container directory when you pull it',
              'Image là dạng đã nén còn container là dạng đã giải nén; Docker bung image thành một thư mục container ngay lúc bạn kéo nó về',
            ),
            B(
              'An image runs on a server and a container runs on your laptop; the two words describe where the same thing is deployed',
              'Image chạy trên máy chủ còn container chạy trên laptop của bạn; hai chữ đó mô tả nơi cùng một thứ được triển khai',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This one distinction carries the whole course. An <b>image</b> is immutable: an ordered stack of read-only layers plus a config JSON saying which process to start, with what environment and working directory. A <b>container</b> is that image plus one thin writable layer and a set of namespaces — a running (or stopped) instance. One image can back a hundred containers and add no image bytes at all, because they share the same read-only layers. Option 2 misses that the writable layer exists at all, which is what makes ' + c('docker rm') + ' destroy data. Option 3 confuses the transport format with the model: layers are indeed tar archives, but extracting one does not produce a container. Option 4 is not a technical distinction at all — the same image runs in both places, which is the entire point.',
            'Riêng khác biệt này gánh cả khoá học. Một <b>IMAGE</b> là bất biến: một chồng có thứ tự các tầng chỉ-đọc cộng một mẩu JSON cấu hình nói chạy tiến trình nào, với môi trường và thư mục làm việc ra sao. Một <b>CONTAINER</b> là image đó cộng một tầng ghi được mỏng và một bộ namespace — tức một bản đang chạy (hoặc đã dừng). Một image đỡ được cả trăm container mà không thêm một byte ảnh nào, vì chúng dùng chung đúng các tầng chỉ-đọc ấy. Phương án 2 bỏ sót hẳn sự tồn tại của tầng ghi được, mà chính tầng đó khiến ' + c('docker rm') + ' huỷ mất dữ liệu. Phương án 3 lẫn định dạng vận chuyển với mô hình: tầng ảnh đúng là các kho tar, nhưng giải nén một cái ra thì không sinh ra container. Phương án 4 không phải một khác biệt kỹ thuật nào cả — cùng một image chạy ở cả hai nơi, và đó chính là toàn bộ điểm mấu chốt.',
          ),
        }),

        // q2 · đáp án 2
        mcq({
          prompt: B(
            'You run <code>sudo usermod -aG docker deploy</code> on a server so the deploy user does not need <code>sudo</code>. What have you actually granted?',
            'Bạn chạy <code>sudo usermod -aG docker deploy</code> trên máy chủ để người dùng deploy khỏi cần <code>sudo</code>. Bạn đã thật sự cấp cái gì?',
          ),
          options: [
            B(
              'Permission to start and stop containers, but not to change anything on the host filesystem outside them',
              'Quyền khởi chạy và dừng container, nhưng không đổi được gì trên hệ thống file của máy chủ bên ngoài chúng',
            ),
            B(
              'The same privileges as <code>sudo</code>, except that every command is written to the audit log so the access stays traceable',
              'Đúng đặc quyền như <code>sudo</code>, chỉ khác là mọi câu lệnh đều được ghi vào nhật ký kiểm toán nên quyền truy cập vẫn truy vết được',
            ),
            B(
              'Effectively unrestricted root on the machine, with no password prompt and no <code>sudo</code> log entry',
              'Trên thực tế là quyền root không hạn chế trên máy, không hỏi mật khẩu và không để lại dòng log <code>sudo</code> nào',
            ),
            B(
              'Read-only access to images and container logs, which is why CI runners are usually given this group instead of a sudo rule',
              'Quyền chỉ-đọc với ảnh và log container, và đó là lý do các máy chạy CI thường được cấp nhóm này thay vì một luật sudo',
            ),
          ],
          correct: 2,
          explanation: EX(
            'It is arithmetic, not a warning about carelessness. Anyone in the <code>docker</code> group can run ' + c('docker run -v /:/host -it alpine chroot /host sh') + ' and land in an unrestricted root shell on the host — the daemon runs as root and will happily mount the host root filesystem for them. There is no password prompt and nothing in the <code>sudo</code> log, so option 2 is exactly backwards: this access is <em>less</em> traceable than <code>sudo</code>, not more. Option 1 forgets that a bind mount reaches outside the container by design. Option 4 invents a read-only mode that does not exist. On a laptop this is a reasonable trade; on a shared or production server, prefer <code>sudo docker</code> or rootless mode.',
            'Đây là phép tính, không phải lời nhắc cẩn thận. Bất kỳ ai trong nhóm <code>docker</code> đều chạy được ' + c('docker run -v /:/host -it alpine chroot /host sh') + ' và rơi thẳng vào một shell root không hạn chế trên máy chủ — tiến trình nền chạy dưới quyền root và sẵn lòng gắn hệ thống file gốc của máy chủ cho họ. Không có lời hỏi mật khẩu và không có gì trong log <code>sudo</code>, nên phương án 2 sai đúng chiều ngược lại: quyền này KHÓ truy vết hơn <code>sudo</code>, chứ không phải dễ hơn. Phương án 1 quên rằng một bind mount vốn được thiết kế để với ra ngoài container. Phương án 4 bịa ra một chế độ chỉ-đọc không hề tồn tại. Trên laptop thì đây là một đánh đổi hợp lý; trên máy chủ dùng chung hay production thì nên dùng <code>sudo docker</code> hoặc chế độ rootless.',
          ),
        }),

        /* ── Chương 1 — container & image: mô hình tư duy (5 câu) ─────────── */

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'Namespaces and cgroups are the two kernel features a container is built from. What does each one control?',
            'Namespace và cgroup là hai tính năng của nhân mà container được dựng từ đó. Mỗi cái điều khiển thứ gì?',
          ),
          options: [
            B(
              'Namespaces isolate the filesystem and cgroups isolate the network, which is why a container needs both to have its own <code>/</code> and its own ports',
              'Namespace cô lập hệ thống file còn cgroup cô lập mạng, và đó là lý do container cần cả hai mới có <code>/</code> riêng và cổng riêng',
            ),
            B(
              'Namespaces control what a process can SEE (filesystem, process table, network, hostname); cgroups control what it can USE (memory, CPU, PIDs, I/O)',
              'Namespace điều khiển thứ một tiến trình NHÌN THẤY (hệ thống file, bảng tiến trình, mạng, tên máy); cgroup điều khiển thứ nó DÙNG ĐƯỢC (bộ nhớ, CPU, số tiến trình, I/O)',
            ),
            B(
              'Namespaces are a Docker invention layered on top of the kernel; cgroups are the kernel feature underneath that Docker delegates the real work to',
              'Namespace là phát minh của Docker đắp lên trên nhân; cgroup mới là tính năng của nhân bên dưới mà Docker giao việc thật cho',
            ),
            B(
              'They are two views of one mechanism: cgroups is the older name, kept for compatibility, and namespaces is what the current kernel actually implements',
              'Chúng là hai cách nhìn của cùng một cơ chế: cgroup là tên cũ giữ lại cho tương thích, còn namespace mới là thứ nhân hiện nay thật sự hiện thực',
            ),
          ],
          correct: 1,
          explanation: EX(
            'See versus use — that is the whole split, and every container feature you meet later is one of the two wearing a friendlier name. The mount namespace is why ' + c('ls /') + ' inside shows Alpine and not your host; the PID namespace is why your process is PID 1; the network namespace is why two containers can both listen on port 80. Cgroups are separate files in the host kernel that Docker writes numbers into: ' + c('--memory 256m') + ' becomes <code>memory.max</code>, ' + c('--cpus 0.5') + ' becomes <code>cpu.max</code>. Option 1 swaps the responsibilities (the network is a namespace, not a cgroup). Options 3 and 4 both get the ownership wrong: <em>both</em> are Linux kernel features that predate Docker, and Docker only turns them on consistently.',
            'NHÌN THẤY so với DÙNG ĐƯỢC — đó là toàn bộ ranh giới, và mọi tính năng container bạn gặp về sau đều là một trong hai cái đó khoác cái tên thân thiện hơn. Namespace mount là lý do ' + c('ls /') + ' bên trong hiện ra Alpine chứ không phải máy bạn; namespace PID là lý do tiến trình của bạn là PID 1; namespace mạng là lý do hai container cùng nghe cổng 80 được. Cgroup là những file riêng trong nhân của máy chủ mà Docker ghi số vào: ' + c('--memory 256m') + ' thành <code>memory.max</code>, ' + c('--cpus 0.5') + ' thành <code>cpu.max</code>. Phương án 1 đổi chỗ hai vai trò (mạng là namespace, không phải cgroup). Phương án 3 và 4 đều nhận nhầm quyền sở hữu: CẢ HAI đều là tính năng của nhân Linux, có trước Docker, và Docker chỉ bật chúng lên một cách nhất quán.',
          ),
        }),

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'These four commands were run on one machine. What does the result prove?' + code(
              '$ uname -r\n' +
              '6.12.76-linuxkit\n' +
              '$ docker run --rm alpine:3.20 uname -r\n' +
              '6.12.76-linuxkit\n' +
              '$ docker run --rm ubuntu:24.04 uname -r\n' +
              '6.12.76-linuxkit\n' +
              '$ docker run --rm alpine:3.20 head -1 /etc/os-release\n' +
              'NAME="Alpine Linux"',
            ),
            'Bốn câu lệnh này được chạy trên một cái máy. Kết quả chứng minh điều gì?' + code(
              '$ uname -r\n' +
              '6.12.76-linuxkit\n' +
              '$ docker run --rm alpine:3.20 uname -r\n' +
              '6.12.76-linuxkit\n' +
              '$ docker run --rm ubuntu:24.04 uname -r\n' +
              '6.12.76-linuxkit\n' +
              '$ docker run --rm alpine:3.20 head -1 /etc/os-release\n' +
              'NAME="Alpine Linux"',
            ),
          ),
          options: [
            B(
              'Both images happen to ship the same kernel version, which is a coincidence of the base images being rebuilt from the same upstream release',
              'Hai ảnh tình cờ đóng gói cùng một phiên bản nhân, chuyện trùng hợp do các ảnh nền được dựng lại từ cùng một bản phát hành thượng nguồn',
            ),
            B(
              'Docker rewrites the output of <code>uname</code> inside containers so that build tools cannot detect they are running in one',
              'Docker viết lại kết quả của <code>uname</code> bên trong container để công cụ dựng không phát hiện được nó đang chạy trong container',
            ),
            B(
              'The Ubuntu container failed to start and silently fell back to the Alpine image, which is why the two lines are identical',
              'Container Ubuntu khởi động hỏng rồi âm thầm lùi về ảnh Alpine, và đó là lý do hai dòng giống hệt nhau',
            ),
            B(
              'There is exactly one kernel — the host\'s — and containers only supply the userland above it, which is why two different distributions report the same release',
              'Chỉ có đúng MỘT cái nhân — của máy chủ — và container chỉ cung cấp phần userland nằm trên nó, và đó là lý do hai bản phân phối khác nhau lại báo cùng một phiên bản',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it. An image contains a <em>userland</em> — libc, the package manager, the binaries, <code>/etc/os-release</code> — and no kernel at all. The container process is scheduled by the host kernel like any other process, so <code>uname -r</code> reports the host\'s release no matter which distribution the image claims to be. That single fact explains the speed (nothing boots), the size (a 13MB image is normal), and the weaker boundary compared with a VM (a kernel bug reachable from inside is an escape). Option 1 is testable and false — try any two images and the answer is always the host\'s kernel. Option 2 invents a masking layer Docker does not have. Option 3 is contradicted by the fourth command, which shows the Alpine container really is Alpine.',
            'Đã chạy thật. Một image chứa phần <em>USERLAND</em> — libc, trình quản lý gói, các chương trình, <code>/etc/os-release</code> — và hoàn toàn không chứa nhân nào. Tiến trình container được chính nhân của máy chủ lập lịch như mọi tiến trình khác, nên <code>uname -r</code> báo phiên bản của máy chủ bất kể cái ảnh tự nhận là bản phân phối nào. Riêng sự thật đó giải thích được tốc độ (không có gì phải khởi động), kích thước (một ảnh 13MB là bình thường), và cái ranh giới mỏng hơn máy ảo (một con bọ của nhân mà với tới được từ bên trong là một cú thoát). Phương án 1 kiểm được và sai — thử hai ảnh bất kỳ thì câu trả lời luôn là nhân của máy chủ. Phương án 2 bịa ra một tầng che giấu mà Docker không có. Phương án 3 bị chính câu lệnh thứ tư bác bỏ, vì nó cho thấy container Alpine đúng là Alpine.',
          ),
        }),

        // q5 · đáp án 0
        mcq({
          prompt: B(
            'Two Dockerfiles write the same 20MB file and then remove it. Measured with <code>docker images</code> on a machine where <code>alpine:3.20</code> is 13.7MB:' + code(
              '# A                                   # B\n' +
              'FROM alpine:3.20                      FROM alpine:3.20\n' +
              'RUN dd if=/dev/urandom of=/blob \\     RUN dd if=/dev/urandom of=/blob \\\n' +
              '      bs=1M count=20                        bs=1M count=20 \\\n' +
              'RUN rm -f /blob                          && rm -f /blob\n' +
              '\n' +
              'A -> 55.5MB          B -> 13.6MB',
            ) + '<p>Why is A so much larger?</p>',
            'Hai Dockerfile cùng ghi một file 20MB rồi xoá nó đi. Đo bằng <code>docker images</code> trên một máy mà <code>alpine:3.20</code> nặng 13,7MB:' + code(
              '# A                                   # B\n' +
              'FROM alpine:3.20                      FROM alpine:3.20\n' +
              'RUN dd if=/dev/urandom of=/blob \\     RUN dd if=/dev/urandom of=/blob \\\n' +
              '      bs=1M count=20                        bs=1M count=20 \\\n' +
              'RUN rm -f /blob                          && rm -f /blob\n' +
              '\n' +
              'A -> 55,5MB          B -> 13,6MB',
            ) + '<p>Vì sao A lại to hơn nhiều đến thế?</p>',
          ),
          options: [
            B(
              'Layers only ever add: A\'s first layer still holds all 20MB, and the second layer just adds a whiteout marker saying "pretend this file is gone"',
              'Tầng ảnh chỉ biết cộng thêm: tầng đầu của A vẫn ôm đủ 20MB, còn tầng thứ hai chỉ thêm một dấu whiteout nói "coi như file này biến mất rồi"',
            ),
            B(
              'B is smaller because chaining with <code>&amp;&amp;</code> lets BuildKit run the two commands in parallel and deduplicate the blocks they write',
              'B nhỏ hơn vì nối bằng <code>&amp;&amp;</code> cho phép BuildKit chạy hai câu lệnh song song rồi khử trùng lặp những khối chúng ghi ra',
            ),
            B(
              'A has one more instruction, and each instruction carries about 20MB of layer metadata regardless of what it writes',
              'A có nhiều hơn một chỉ thị, mà mỗi chỉ thị mang theo khoảng 20MB siêu dữ liệu tầng ảnh bất kể nó ghi ra cái gì',
            ),
            B(
              'The <code>rm</code> in A ran before the <code>dd</code> finished flushing, so the file survived and the deletion never actually applied',
              'Lệnh <code>rm</code> trong A chạy trước khi <code>dd</code> xả xong bộ đệm, nên file sống sót và phép xoá thật ra chưa hề có hiệu lực',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, not guessed: 55.5MB against 13.6MB for the same finished filesystem. A read-only layer is immutable by definition, so overlayfs records a deletion by writing a tiny <b>whiteout</b> marker into the layer above — the original bytes stay below it forever and are still downloaded by everyone who pulls the image. B nets the write and the delete out inside <em>one</em> layer, so the diff for that step is empty and the image comes back to the base size. This is also why a secret you ' + c('COPY') + 'ed and then deleted is still extractable with ' + c('docker save img | tar -x') + '. Option 2 invents a deduplication pass BuildKit does not perform. Option 3 is refuted by the same measurement: instructions like ' + c('ENV') + ' and ' + c('LABEL') + ' show 0B. Option 4 would show the file present in the running container, and it is not.',
            'Đo thật, không đoán: 55,5MB so với 13,6MB cho cùng một hệ thống file cuối cùng. Một tầng chỉ-đọc theo định nghĩa là bất biến, nên overlayfs ghi lại phép xoá bằng một dấu <b>WHITEOUT</b> tí hon đặt ở tầng bên trên — những byte gốc nằm lại bên dưới mãi mãi và vẫn bị tải về bởi mọi người kéo cái ảnh đó. B thì bù trừ phép ghi và phép xoá ngay bên trong MỘT tầng, nên phần khác biệt của bước đó rỗng và ảnh quay về đúng kích thước nền. Đây cũng là lý do một bí mật bạn ' + c('COPY') + ' vào rồi xoá đi vẫn moi ra được bằng ' + c('docker save img | tar -x') + '. Phương án 2 bịa ra một lượt khử trùng lặp mà BuildKit không hề làm. Phương án 3 bị chính phép đo đó bác bỏ: những chỉ thị như ' + c('ENV') + ' và ' + c('LABEL') + ' hiện 0B. Phương án 4 thì sẽ khiến file còn nguyên trong container đang chạy, mà thực tế không có.',
          ),
        }),

        // q6 · đáp án 2
        mcq({
          prompt: B(
            'A colleague reports "the container is broken, <code>docker logs</code> prints nothing at all". This is what they ran:' + code(
              '$ docker create --name job alpine:3.20 sleep 60\n' +
              '3f21a9c04b8e...\n' +
              '$ docker ps -a --filter name=job --format \'{{.Status}}\'\n' +
              'Created\n' +
              '$ docker logs job\n' +
              '$',
            ) + '<p>What is going on?</p>',
            'Một đồng nghiệp báo "container hỏng rồi, <code>docker logs</code> chẳng in ra gì cả". Đây là những gì họ đã chạy:' + code(
              '$ docker create --name job alpine:3.20 sleep 60\n' +
              '3f21a9c04b8e...\n' +
              '$ docker ps -a --filter name=job --format \'{{.Status}}\'\n' +
              'Created\n' +
              '$ docker logs job\n' +
              '$',
            ) + '<p>Chuyện gì đang xảy ra?</p>',
          ),
          options: [
            B(
              'The logging driver is misconfigured for this container, so the output is being written somewhere <code>docker logs</code> cannot read it back from',
              'Trình ghi log của container này bị cấu hình sai, nên phần output được ghi vào một chỗ mà <code>docker logs</code> không đọc ngược lại được',
            ),
            B(
              'The <code>sleep</code> command produces no output by design, so the logs would still be empty even after the container had finished running normally',
              'Câu lệnh <code>sleep</code> vốn không in ra gì, nên log vẫn sẽ rỗng kể cả sau khi container đã chạy xong bình thường',
            ),
            B(
              'Nothing is broken: <code>docker create</code> only makes the container, it never starts it — the status <code>Created</code> means no process has run, so there is nothing to log',
              'Không có gì hỏng cả: <code>docker create</code> chỉ tạo ra container chứ không khởi chạy nó — trạng thái <code>Created</code> nghĩa là chưa tiến trình nào chạy, nên không có gì để ghi log',
            ),
            B(
              'The container exited immediately because <code>sleep 60</code> needs a TTY, and <code>docker logs</code> discards output from containers started without <code>-t</code>',
              'Container thoát ngay vì <code>sleep 60</code> cần một TTY, và <code>docker logs</code> vứt bỏ output của những container khởi chạy mà không có <code>-t</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it. ' + c('docker run') + ' is three operations glued together — <b>pull</b>, <b>create</b>, <b>start</b> — and ' + c('docker create') + ' stops after the second. The container fully exists at that point: it has an ID, a name, a writable layer, a network configuration and its port mapping, and no process. Empty logs are the correct output. The habit this teaches is worth more than the command: run ' + c('docker ps -a') + ' <em>before</em> ' + c('docker logs') + ', because the <code>STATUS</code> column separates <code>Created</code> (never started) from <code>Exited (1)</code> (ran and failed) from <code>Restarting</code> (a loop), and each sends you to a different place. Option 2 is true about <code>sleep</code> but does not explain <code>Created</code>. Options 1 and 4 both invent behaviour: the driver is fine, and no command needs a TTY to have its stdout captured.',
            'Đã chạy thật. ' + c('docker run') + ' là ba thao tác dán vào nhau — <b>pull</b>, <b>create</b>, <b>start</b> — và ' + c('docker create') + ' dừng lại sau cái thứ hai. Ở thời điểm đó container tồn tại đầy đủ: có ID, có tên, có tầng ghi được, có cấu hình mạng và ánh xạ cổng, và không có tiến trình nào. Log rỗng chính là kết quả đúng. Thói quen rút ra được còn đáng giá hơn câu lệnh: hãy chạy ' + c('docker ps -a') + ' TRƯỚC ' + c('docker logs') + ', vì cột <code>STATUS</code> tách được <code>Created</code> (chưa từng khởi chạy) khỏi <code>Exited (1)</code> (đã chạy rồi hỏng) và khỏi <code>Restarting</code> (một vòng lặp), mà mỗi cái dẫn bạn tới một chỗ khác nhau. Phương án 2 đúng về <code>sleep</code> nhưng không giải thích được chữ <code>Created</code>. Phương án 1 và 4 đều bịa hành vi: trình ghi log không sao cả, và không câu lệnh nào cần TTY thì stdout mới được ghi lại.',
          ),
        }),

        // q7 · đáp án 3
        mcq({
          prompt: B(
            'A PostgreSQL container has data you care about. Which of these operations destroys it?',
            'Một container PostgreSQL đang giữ dữ liệu bạn cần. Thao tác nào dưới đây huỷ mất nó?',
          ),
          options: [
            B(
              '<code>docker restart</code> — restarting recreates the container from the image, so the writable layer is rebuilt empty each time',
              '<code>docker restart</code> — khởi động lại là dựng lại container từ ảnh, nên tầng ghi được bị tạo lại rỗng mỗi lần',
            ),
            B(
              '<code>docker stop</code> — stopping releases the container\'s storage back to the pool, which is why a stopped container takes no disk space',
              '<code>docker stop</code> — dừng lại là trả kho lưu của container về bể chung, và đó là lý do một container đã dừng không chiếm đĩa',
            ),
            B(
              '<code>docker pause</code> — the freezer flushes the writable layer before suspending the processes, so anything unwritten is lost',
              '<code>docker pause</code> — bộ đông lạnh xả sạch tầng ghi được trước khi treo các tiến trình, nên thứ gì chưa ghi xuống là mất',
            ),
            B(
              '<code>docker rm</code> — and therefore every deploy, every flag change and every <code>docker compose down</code>, unless the data path is on a volume',
              '<code>docker rm</code> — và do đó là mọi bản deploy, mọi lần đổi cờ và mọi lệnh <code>docker compose down</code>, trừ khi đường dẫn dữ liệu nằm trên một volume',
            ),
          ],
          correct: 3,
          explanation: EX(
            '<code>stop</code>, <code>start</code>, <code>restart</code> and <code>pause</code> all keep the same container object and therefore the same writable layer on disk — data survives all four. <code>rm</code> deletes that layer, permanently, immediately, with no prompt. The uncomfortable part is how often <code>rm</code> happens without anyone typing it: changing any ' + c('docker run') + ' flag forces a recreate, ' + c('docker compose down') + ' removes containers, and every deploy that pulls a new image necessarily builds a new container. That is exactly why a database path belongs on a named volume — the volume lives outside the container lifecycle, so the container goes back to being disposable, which was always the point. Options 1, 2 and 3 each attribute destruction to an operation that provably preserves the layer.',
            '<code>stop</code>, <code>start</code>, <code>restart</code> và <code>pause</code> đều giữ nguyên cùng một đối tượng container, và do đó giữ nguyên tầng ghi được trên đĩa — dữ liệu sống sót qua cả bốn. <code>rm</code> thì xoá tầng đó, vĩnh viễn, ngay lập tức, không hỏi một câu. Chỗ khó chịu là <code>rm</code> xảy ra thường xuyên đến mức nào mà không ai gõ nó: đổi bất cứ cờ nào của ' + c('docker run') + ' là buộc phải tạo lại, ' + c('docker compose down') + ' thì xoá container, và mọi bản deploy kéo về ảnh mới đều tất yếu dựng ra một container mới. Đó chính xác là lý do đường dẫn dữ liệu của cơ sở dữ liệu phải nằm trên một volume có tên — volume sống ngoài vòng đời container, nên container quay về đúng bản chất vứt-đi-được của nó. Phương án 1, 2 và 3 mỗi cái đều gán việc huỷ dữ liệu cho một thao tác mà thực tế chứng minh được là giữ nguyên tầng ghi.',
          ),
        }),

        /* ── Chương 2 — chạy container (5 câu) ───────────────────────────── */

        // q8 · đáp án 1
        mcq({
          prompt: B(
            'This is the real output of the command below. Why did it fail?' + code(
              '$ docker run --rm alpine:3.20 -it\n' +
              'docker: Error response from daemon: failed to create task for container:\n' +
              'failed to create shim task: OCI runtime create failed: runc create failed:\n' +
              'unable to start container process: error during container init:\n' +
              'exec: "-it": executable file not found in $PATH',
            ),
            'Đây là kết quả thật của câu lệnh dưới đây. Vì sao nó hỏng?' + code(
              '$ docker run --rm alpine:3.20 -it\n' +
              'docker: Error response from daemon: failed to create task for container:\n' +
              'failed to create shim task: OCI runtime create failed: runc create failed:\n' +
              'unable to start container process: error during container init:\n' +
              'exec: "-it": executable file not found in $PATH',
            ),
          ),
          options: [
            B(
              'Alpine\'s busybox shell cannot allocate a pseudo-terminal, so <code>-it</code> has to be replaced by <code>--tty --interactive</code> on that base image',
              'Shell busybox của Alpine không cấp phát được terminal giả, nên <code>-it</code> phải đổi thành <code>--tty --interactive</code> với ảnh nền đó',
            ),
            B(
              'Everything after the image name is the command for the container, so Docker tried to execute a program literally named <code>-it</code>; Docker\'s own flags must come BEFORE the image',
              'Mọi thứ sau tên ảnh là câu lệnh CHO container, nên Docker đã cố chạy một chương trình tên đúng là <code>-it</code>; cờ của chính Docker phải đứng TRƯỚC tên ảnh',
            ),
            B(
              'The image has no <code>ENTRYPOINT</code>, and <code>-it</code> only works on images that define one for the flags to attach to',
              'Ảnh đó không có <code>ENTRYPOINT</code>, mà <code>-it</code> chỉ chạy được với những ảnh có khai báo một cái để các cờ bám vào',
            ),
            B(
              'Combined short flags are not supported by the container runtime; they must be written separately as <code>-i -t</code> in this position',
              'Môi trường chạy container không hỗ trợ gộp cờ ngắn; ở vị trí này chúng phải viết tách ra thành <code>-i -t</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The error text names the cause precisely once you know the shape of the command: ' + c('docker run [OPTIONS] IMAGE [COMMAND] [ARG...]') + '. Everything left of the image name is for Docker; everything right of it is handed to the process inside. Here <code>-it</code> landed on the right, so runc dutifully looked for a binary called <code>-it</code> and reported that it is not in <code>$PATH</code>. The same rule explains most "my flag was ignored" reports: ' + c('docker run alpine --memory 256m') + ' does not set a memory limit either, it passes two arguments to a program. All three wrong answers propose a restriction that does not exist — ' + c('docker run --rm -it alpine:3.20 sh') + ' works exactly as written, with the flags on the correct side.',
            'Chính đoạn báo lỗi gọi tên nguyên nhân, một khi bạn nắm được hình dạng của câu lệnh: ' + c('docker run [OPTIONS] IMAGE [COMMAND] [ARG...]') + '. Mọi thứ bên trái tên ảnh là dành cho Docker; mọi thứ bên phải được giao cho tiến trình bên trong. Ở đây <code>-it</code> rơi sang bên phải, nên runc ngoan ngoãn đi tìm một chương trình tên <code>-it</code> rồi báo rằng nó không nằm trong <code>$PATH</code>. Cũng luật đó giải thích phần lớn những lời than "cờ của tôi bị bỏ qua": ' + c('docker run alpine --memory 256m') + ' cũng chẳng đặt trần bộ nhớ nào, nó chỉ truyền hai tham số cho một chương trình. Cả ba phương án sai đều dựng lên một hạn chế không hề tồn tại — ' + c('docker run --rm -it alpine:3.20 sh') + ' chạy đúng y như viết, chỉ cần cờ nằm đúng phía.',
          ),
        }),

        // q9 · đáp án 2
        mcq({
          prompt: B(
            'An application container is clearly working — it answers requests — but <code>docker logs</code> shows nothing. Inside, this is what you find:' + code(
              '$ docker exec app tail -2 /var/log/app.log\n' +
              '2026-09-07 19:14:02 GET /api/v1/posts 200 41ms\n' +
              '2026-09-07 19:14:03 GET /api/v1/posts 200 38ms',
            ) + '<p>What is the correct fix?</p>',
            'Một container ứng dụng rõ ràng đang chạy — nó trả lời request — nhưng <code>docker logs</code> chẳng hiện gì. Bên trong, bạn thấy thế này:' + code(
              '$ docker exec app tail -2 /var/log/app.log\n' +
              '2026-09-07 19:14:02 GET /api/v1/posts 200 41ms\n' +
              '2026-09-07 19:14:03 GET /api/v1/posts 200 38ms',
            ) + '<p>Cách chữa đúng là gì?',
          ),
          options: [
            B(
              'Mount a volume at <code>/var/log</code> so the log file survives the container, then point your log collector at that volume on the host',
              'Gắn một volume vào <code>/var/log</code> để file log sống sót qua container, rồi trỏ bộ thu log của bạn vào volume đó trên máy chủ',
            ),
            B(
              'Switch the container to the <code>journald</code> logging driver, which is the only driver able to pick up log files written inside a container',
              'Đổi container sang trình ghi log <code>journald</code>, trình duy nhất nhặt được những file log ghi bên trong container',
            ),
            B(
              'Make the application write to stdout and stderr instead — those two streams are the only thing Docker captures, and a log file inside the container dies with it',
              'Hãy bắt ứng dụng ghi ra stdout và stderr — hai luồng đó là thứ duy nhất Docker ghi lại, còn một file log bên trong container thì chết theo nó',
            ),
            B(
              'Restart the container with <code>--log-opt max-size=10m</code>, because a container with no rotation configured buffers its output instead of writing it',
              'Khởi động lại container với <code>--log-opt max-size=10m</code>, vì một container chưa cấu hình xoay vòng sẽ đệm output lại thay vì ghi ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Docker captures exactly two things: the container\'s stdout and its stderr. Anything written to a path inside the container is invisible to ' + c('docker logs') + ', invisible to your log aggregator, invisible to everything Chapter 11 sets up — and it dies with the container. The convention exists precisely so that logging is one uniform mechanism, and the official nginx image demonstrates it: ' + c('/var/log/nginx/access.log') + ' is a symlink to ' + c('/dev/stdout') + '. If a framework insists on a file path, point it at <code>/dev/stdout</code> and you are done. Option 1 preserves the file but still leaves ' + c('docker logs') + ' empty and every collector blind. Option 2 invents a capability no driver has — every driver reads the same two streams. Option 4 confuses this with the separate buffering problem (a Python container needing <code>PYTHONUNBUFFERED=1</code>), which is worth knowing but is not what this transcript shows.',
            'Docker ghi lại đúng hai thứ: stdout và stderr của container. Bất cứ thứ gì được ghi vào một đường dẫn bên trong container đều vô hình với ' + c('docker logs') + ', vô hình với bộ gom log của bạn, vô hình với mọi thứ Chương 11 dựng lên — và nó chết theo container. Quy ước này tồn tại chính là để việc ghi log thành một cơ chế duy nhất, đồng nhất, và ảnh nginx chính thức làm mẫu điều đó: ' + c('/var/log/nginx/access.log') + ' là một liên kết mềm trỏ tới ' + c('/dev/stdout') + '. Nếu một framework cứ đòi một đường dẫn file, hãy trỏ nó vào <code>/dev/stdout</code> là xong. Phương án 1 giữ được cái file nhưng vẫn để ' + c('docker logs') + ' rỗng và mọi bộ thu log mù tịt. Phương án 2 bịa ra một khả năng không trình ghi log nào có — mọi trình đều đọc đúng hai luồng đó. Phương án 4 nhầm sang bài toán đệm output (một container Python cần <code>PYTHONUNBUFFERED=1</code>), chuyện đáng biết nhưng không phải thứ đoạn terminal này cho thấy.',
          ),
        }),

        // q10 · đáp án 0
        mcq({
          prompt: B(
            'You want a shell inside a running production container to look at a config file. What is the practical difference between <code>docker exec -it api sh</code> and <code>docker attach api</code>?',
            'Bạn muốn có một shell bên trong một container production đang chạy để xem một file cấu hình. Khác biệt thực tế giữa <code>docker exec -it api sh</code> và <code>docker attach api</code> là gì?',
          ),
          options: [
            B(
              '<code>exec</code> starts a NEW process in the container\'s namespaces, so leaving it is harmless; <code>attach</code> connects your terminal to PID 1\'s own stdio, so Ctrl-C signals the application and usually stops the container',
              '<code>exec</code> khởi chạy một tiến trình MỚI trong namespace của container, nên thoát ra là vô hại; <code>attach</code> nối terminal của bạn vào stdio của chính PID 1, nên Ctrl-C gửi tín hiệu cho ứng dụng và thường là dừng container',
            ),
            B(
              'They do the same thing; <code>attach</code> is the older spelling kept for scripts written before <code>exec</code> existed',
              'Hai lệnh làm cùng một việc; <code>attach</code> là cách viết cũ giữ lại cho những script viết từ trước khi có <code>exec</code>',
            ),
            B(
              '<code>attach</code> works on stopped containers and <code>exec</code> does not, which is why <code>attach</code> is the right tool for reading a crashed container',
              '<code>attach</code> chạy được với container đã dừng còn <code>exec</code> thì không, và đó là lý do <code>attach</code> mới là công cụ đúng để đọc một container đã sập',
            ),
            B(
              '<code>exec</code> requires the image to ship bash; <code>attach</code> works on any image because it reuses the shell PID 1 already has',
              '<code>exec</code> đòi cái ảnh phải có bash; <code>attach</code> chạy được với mọi ảnh vì nó dùng lại cái shell mà PID 1 vốn đã có',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is worth getting right before you try it on production. ' + c('exec') + ' spawns an additional process inside the same namespaces — same filesystem, same network, same process table — but it is not PID 1, so exiting your shell does nothing to the application and Ctrl-C only affects your own command. ' + c('attach') + ' does not start anything; it wires your terminal to the stdin and stdout of PID 1 itself, which means Ctrl-C sends SIGINT straight to your server. The escape that does not kill anything is <b>Ctrl-P Ctrl-Q</b>. Attach is genuinely useful only when you need to <em>send input</em> to PID 1, such as a REPL you started detached. Option 3 has it backwards — neither works on a stopped container, and the tool for that is ' + c('docker cp') + '. Option 4 confuses <code>exec</code> with the shell you ask it for: ' + c('docker exec -it api sh') + ' works on any image that has <code>/bin/sh</code>, which Alpine does even without bash.',
            'Chuyện này đáng nắm cho chắc TRƯỚC khi bạn thử trên production. ' + c('exec') + ' sinh thêm một tiến trình bên trong đúng những namespace đó — cùng hệ thống file, cùng mạng, cùng bảng tiến trình — nhưng nó không phải PID 1, nên thoát khỏi shell của bạn chẳng ảnh hưởng gì tới ứng dụng và Ctrl-C chỉ tác động lên chính câu lệnh của bạn. ' + c('attach') + ' thì không khởi chạy gì cả; nó đấu terminal của bạn vào stdin và stdout của chính PID 1, nghĩa là Ctrl-C gửi SIGINT thẳng vào máy chủ của bạn. Lối thoát không giết gì là <b>Ctrl-P Ctrl-Q</b>. Attach chỉ thật sự hữu ích khi bạn cần GỬI ĐẦU VÀO cho PID 1, ví dụ một REPL bạn đã khởi chạy ở chế độ nền. Phương án 3 nói ngược — cả hai đều không chạy được với container đã dừng, và công cụ cho việc đó là ' + c('docker cp') + '. Phương án 4 lẫn <code>exec</code> với cái shell bạn yêu cầu nó chạy: ' + c('docker exec -it api sh') + ' chạy được với mọi ảnh có <code>/bin/sh</code>, mà Alpine thì có kể cả khi không có bash.',
          ),
        }),

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'A container was started with <code>--env-file app.env</code>. The file and the real result are below.' + code(
              '# app.env\n' +
              'PASSWORD="p@ss word"\n' +
              'URL=postgres://${USER}@db/app\n' +
              'GREETING=hello world\n' +
              '\n' +
              '$ docker run --rm --env-file app.env alpine:3.20 sh -c \\\n' +
              '    \'echo "[$PASSWORD]"; echo "[$URL]"; echo "[$GREETING]"\'\n' +
              '["p@ss word"]\n' +
              '[postgres://${USER}@db/app]\n' +
              '[hello world]',
            ) + '<p>Which statement about <code>--env-file</code> does this confirm?</p>',
            'Một container được khởi chạy với <code>--env-file app.env</code>. File và kết quả thật nằm dưới đây.' + code(
              '# app.env\n' +
              'PASSWORD="p@ss word"\n' +
              'URL=postgres://${USER}@db/app\n' +
              'GREETING=hello world\n' +
              '\n' +
              '$ docker run --rm --env-file app.env alpine:3.20 sh -c \\\n' +
              '    \'echo "[$PASSWORD]"; echo "[$URL]"; echo "[$GREETING]"\'\n' +
              '["p@ss word"]\n' +
              '[postgres://${USER}@db/app]\n' +
              '[hello world]',
            ) + '<p>Kết quả này xác nhận phát biểu nào về <code>--env-file</code>?</p>',
          ),
          options: [
            B(
              'Docker strips the quotes but does not expand variables, which is why only the second line still shows its placeholder',
              'Docker bóc dấu nháy nhưng không khai triển biến, và đó là lý do chỉ dòng thứ hai còn giữ chỗ giữ chỗ của nó',
            ),
            B(
              'Values containing a space must be quoted, and the quotes are consumed as delimiters exactly as a shell would consume them',
              'Giá trị có dấu cách bắt buộc phải bọc nháy, và cặp nháy bị nuốt như một dấu phân cách hệt như shell vẫn làm',
            ),
            B(
              'The file is sourced by <code>/bin/sh</code> inside the container, so shell rules apply but the container\'s own empty <code>$USER</code> is substituted',
              'File được <code>/bin/sh</code> bên trong container nạp bằng source, nên luật shell có hiệu lực nhưng biến <code>$USER</code> rỗng của chính container mới là thứ được thay vào',
            ),
            B(
              'Docker reads the file literally: no quote stripping, no variable expansion, no shell at all — everything after the first <code>=</code> is the value, spaces included',
              'Docker đọc file theo nghĩa đen: không bóc nháy, không khai triển biến, không có shell nào cả — mọi thứ sau dấu <code>=</code> đầu tiên là giá trị, kể cả dấu cách',
            ),
          ],
          correct: 3,
          explanation: EX(
            'All three lines came back verbatim, and that is the whole rule: there is no shell anywhere in this path. The quote characters are <em>part of the password</em>, which is the most common cause of "the credentials are definitely right but authentication fails" in Compose setups — the database receives ' + c('"p@ss word"') + ' with two extra characters nobody can see. ' + c('${USER}') + ' arrives as six literal characters because nothing was there to expand it. And <code>GREETING</code> proves quoting was never needed for the space in the first place. Write values bare, and verify with ' + c('docker exec c env') + '. Options 1 and 2 both claim quote stripping the output disproves. Option 3 invents a sourcing step: if a shell had read the file, <code>$USER</code> would have become an empty string rather than surviving intact.',
            'Cả ba dòng trở về nguyên văn, và đó là toàn bộ luật: trên đường đi này không có shell nào cả. Hai ký tự nháy là MỘT PHẦN CỦA MẬT KHẨU, và đây là nguyên nhân phổ biến nhất của cảnh "thông tin đăng nhập chắc chắn đúng mà xác thực vẫn hỏng" trong các thiết lập Compose — cơ sở dữ liệu nhận được ' + c('"p@ss word"') + ' kèm hai ký tự thừa mà không ai nhìn thấy. ' + c('${USER}') + ' về đúng sáu ký tự nguyên vẹn vì chẳng có gì ở đó để khai triển nó. Còn <code>GREETING</code> chứng minh rằng ngay từ đầu cũng không cần bọc nháy cho dấu cách. Hãy viết giá trị trần, và kiểm lại bằng ' + c('docker exec c env') + '. Phương án 1 và 2 đều khẳng định có bóc nháy, điều mà chính kết quả bác bỏ. Phương án 3 bịa ra một bước source: nếu có shell đọc file thì <code>$USER</code> đã thành chuỗi rỗng chứ không còn nguyên.',
          ),
        }),

        // q12 · đáp án 1
        mcq({
          prompt: B(
            'A container has a <code>HEALTHCHECK</code>. It has just been measured after the check started failing:' + code(
              '$ docker inspect web --format \\\n' +
              '    \'health={{.State.Health.Status}} status={{.State.Status}} restarts={{.RestartCount}}\'\n' +
              'health=unhealthy status=running restarts=0\n' +
              '\n' +
              '$ docker exec web wget -qO- http://localhost/ | head -1\n' +
              '<!DOCTYPE html>',
            ) + '<p>What does plain Docker do about an unhealthy container?</p>',
            'Một container có <code>HEALTHCHECK</code>. Nó vừa được đo ngay sau khi phép kiểm bắt đầu hỏng:' + code(
              '$ docker inspect web --format \\\n' +
              '    \'health={{.State.Health.Status}} status={{.State.Status}} restarts={{.RestartCount}}\'\n' +
              'health=unhealthy status=running restarts=0\n' +
              '\n' +
              '$ docker exec web wget -qO- http://localhost/ | head -1\n' +
              '<!DOCTYPE html>',
            ) + '<p>Docker trần làm gì với một container không khoẻ?</p>',
          ),
          options: [
            B(
              'It restarts the container after the configured number of retries, which is what <code>--health-retries</code> counts down to',
              'Nó khởi động lại container sau đúng số lần thử đã cấu hình, và đó là thứ <code>--health-retries</code> đếm ngược tới',
            ),
            B(
              'Nothing — it only reports the status; something else has to act on it: Compose <code>depends_on: service_healthy</code>, an orchestrator, a proxy, or your deploy script',
              'Không gì cả — nó chỉ BÁO CÁO trạng thái; phải có thứ khác hành động theo: Compose <code>depends_on: service_healthy</code>, một bộ điều phối, một proxy, hoặc script deploy của bạn',
            ),
            B(
              'It stops the container and marks it <code>dead</code>, so that a restart policy can bring a clean replacement up',
              'Nó dừng container và đánh dấu <code>dead</code>, để một chính sách restart có thể dựng lên một bản thay thế sạch',
            ),
            B(
              'It removes the container from any published port mappings, so traffic stops reaching it while the process keeps running',
              'Nó gỡ container khỏi mọi ánh xạ cổng đã công bố, nên lưu lượng ngừng tới nó trong khi tiến trình vẫn chạy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: <code>status=running</code> and <code>restarts=0</code> while the health status is <code>unhealthy</code>. This is the single most expensive misconception about healthchecks — people add one, assume the platform will act on it, and nothing does. Plain Docker only computes and publishes the status. What consumes it is always something you set up deliberately: Compose waits for <code>service_healthy</code> before starting a dependent service, Swarm and Kubernetes reschedule, Traefik routes away, and a deploy script can block until healthy and abort otherwise. The second command is also worth noticing — the server answers perfectly, so this particular check was measuring the wrong thing. Options 1, 3 and 4 each describe something a real orchestrator does, which is exactly where the misconception comes from.',
            'Đã đo: <code>status=running</code> và <code>restarts=0</code> trong khi trạng thái sức khoẻ là <code>unhealthy</code>. Đây là hiểu lầm đắt giá nhất về healthcheck — người ta thêm một cái vào, mặc định rằng nền tảng sẽ hành động theo, và chẳng có gì hành động cả. Docker trần chỉ tính ra và công bố trạng thái. Thứ TIÊU THỤ trạng thái đó luôn là cái bạn tự dựng lên: Compose chờ <code>service_healthy</code> rồi mới khởi chạy dịch vụ phụ thuộc, Swarm và Kubernetes lên lịch lại, Traefik định tuyến tránh đi, còn script deploy thì chặn tới khi khoẻ và huỷ nếu không. Câu lệnh thứ hai cũng đáng để ý — máy chủ trả lời hoàn hảo, nên chính phép kiểm này đang đo nhầm thứ. Phương án 1, 3 và 4 mỗi cái đều mô tả một việc mà một bộ điều phối thật sự làm, và đó chính là nơi hiểu lầm bắt nguồn.',
          ),
        }),

        /* ── Chương 3 — image & registry (4 câu) ─────────────────────────── */

        // q13 · đáp án 2
        mcq({
          prompt: B(
            'What does the short reference <code>nginx</code> expand to in full?',
            'Tham chiếu ngắn <code>nginx</code> khai triển đầy đủ ra thành gì?',
          ),
          options: [
            B(
              '<code>hub.docker.com/nginx/nginx:stable</code> — the vendor namespace and the tag the maintainers mark as current',
              '<code>hub.docker.com/nginx/nginx:stable</code> — không gian tên của nhà phát hành và cái tag mà nhóm bảo trì đánh dấu là hiện hành',
            ),
            B(
              '<code>nginx:latest</code> on whichever registry you most recently ran <code>docker login</code> against',
              '<code>nginx:latest</code> trên registry mà bạn vừa chạy <code>docker login</code> gần nhất',
            ),
            B(
              '<code>docker.io/library/nginx:latest</code> — the registry, the namespace and the tag all have defaults you never type',
              '<code>docker.io/library/nginx:latest</code> — registry, không gian tên và tag đều có giá trị mặc định mà bạn không bao giờ gõ',
            ),
            B(
              'Nothing — a bare repository name is ambiguous, so Docker asks you to disambiguate before it will pull anything',
              'Không gì cả — một cái tên kho trần là mập mờ, nên Docker yêu cầu bạn nói rõ trước khi chịu kéo bất cứ thứ gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A reference has four fields — ' + c('registry/namespace/repository:tag') + ' — and three of them have defaults: <code>docker.io</code>, <code>library</code> and <code>latest</code>. So ' + c('docker pull nginx') + ', ' + c('docker pull library/nginx') + ' and ' + c('docker pull docker.io/library/nginx:latest') + ' all fetch the same bytes. <code>library</code> is Docker\'s own namespace for curated official images, and it is the only one you never have to type — which is also why a name with no slash is a useful signal that you are looking at an official image rather than someone\'s account. Option 2 is wrong in a way worth knowing: logging in changes credentials, never the default registry. Option 1 invents a namespace. Option 4 would be a defensible design and is not the one Docker chose; the defaults are silent, which is exactly why reading a name carefully matters.',
            'Một tham chiếu có bốn trường — ' + c('registry/namespace/repository:tag') + ' — và ba trong số đó có giá trị mặc định: <code>docker.io</code>, <code>library</code> và <code>latest</code>. Nên ' + c('docker pull nginx') + ', ' + c('docker pull library/nginx') + ' và ' + c('docker pull docker.io/library/nginx:latest') + ' đều kéo về đúng những byte đó. <code>library</code> là không gian tên riêng của Docker dành cho các ảnh chính thức đã được duyệt, và nó là cái duy nhất bạn không bao giờ phải gõ — đó cũng là lý do một cái tên không có dấu gạch chéo là tín hiệu hữu ích rằng bạn đang nhìn một ảnh chính thức chứ không phải tài khoản của ai đó. Phương án 2 sai theo một kiểu đáng biết: đăng nhập chỉ đổi thông tin xác thực, không bao giờ đổi registry mặc định. Phương án 1 bịa ra một không gian tên. Phương án 4 sẽ là một thiết kế hợp lý nhưng không phải cái Docker chọn; các giá trị mặc định là im lặng, và đó đúng là lý do đọc kỹ một cái tên lại quan trọng.',
          ),
        }),

        /* ── Chương 3 — image & registry (tiếp) ──────────────────────────── */

        // q14 · đáp án 0
        mcq({
          prompt: B(
            'This was run on a real machine. What is the image with ID <code>d9e853e87e55</code> now?' + code(
              '$ docker tag alpine:3.20 demo:v1\n' +
              '$ docker images demo --format \'{{.Repository}}:{{.Tag}} {{.ID}}\'\n' +
              'demo:v1 d9e853e87e55\n' +
              '\n' +
              '$ docker tag busybox:1.36 demo:v1\n' +
              '$ docker images demo --format \'{{.Repository}}:{{.Tag}} {{.ID}}\'\n' +
              'demo:v1 73aaf090f3d8',
            ),
            'Đoạn này chạy trên một máy thật. Cái ảnh có ID <code>d9e853e87e55</code> giờ là gì?' + code(
              '$ docker tag alpine:3.20 demo:v1\n' +
              '$ docker images demo --format \'{{.Repository}}:{{.Tag}} {{.ID}}\'\n' +
              'demo:v1 d9e853e87e55\n' +
              '\n' +
              '$ docker tag busybox:1.36 demo:v1\n' +
              '$ docker images demo --format \'{{.Repository}}:{{.Tag}} {{.ID}}\'\n' +
              'demo:v1 73aaf090f3d8',
            ),
          ),
          options: [
            B(
              'Still on disk, but it has lost that name: a tag is a mutable pointer, and an image with no tag left pointing at it is called dangling',
              'Vẫn nằm trên đĩa, nhưng nó mất cái tên đó: một tag là con trỏ thay đổi được, và một ảnh không còn tag nào trỏ tới thì gọi là dangling',
            ),
            B(
              'Deleted — retagging replaces the old image, which is why the second listing shows only one entry for <code>demo</code>',
              'Đã bị xoá — gắn tag lại là thay thế ảnh cũ, và đó là lý do lượt liệt kê thứ hai chỉ hiện một dòng cho <code>demo</code>',
            ),
            B(
              'Merged into <code>73aaf090f3d8</code>: Docker combined the layers of both images because they now share a tag',
              'Đã gộp vào <code>73aaf090f3d8</code>: Docker trộn các tầng của cả hai ảnh vì giờ chúng dùng chung một tag',
            ),
            B(
              'Unchanged and still tagged <code>demo:v1</code> as well — one image ID can hold several identical tags, and <code>docker images</code> shows only the newest',
              'Không đổi và vẫn còn tag <code>demo:v1</code> — một ID ảnh giữ được nhiều tag giống nhau, và <code>docker images</code> chỉ hiện cái mới nhất',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Same tag, different image, no warning — because a tag is a name in a table, not an identity. The alpine image is untouched on disk; it simply has nothing pointing at it any more, so it shows up as ' + c('<none>:<none>') + ' in ' + c('docker images -f dangling=true') + ' and is where most of the reclaimable space in ' + c('docker system df') + ' comes from. Upstream maintainers move tags deliberately every time they ship a patch, which is exactly why ' + c('postgres:latest') + ' can cross a major version between two clones of the same Compose file. The immutable alternative is a digest: ' + c('nginx@sha256:...') + ' names the content and cannot be repointed. Option 2 confuses losing a name with being deleted. Options 3 and 4 both invent behaviour — layers are never merged across images, and a tag maps to exactly one image at a time.',
            'Cùng một tag, khác ảnh, không một lời cảnh báo — vì một tag là một cái tên trong bảng, không phải một danh tính. Ảnh alpine vẫn nguyên trên đĩa; nó chỉ không còn gì trỏ tới nữa, nên hiện ra dạng ' + c('<none>:<none>') + ' trong ' + c('docker images -f dangling=true') + ' và là nơi phần lớn dung lượng lấy lại được trong ' + c('docker system df') + ' đến từ. Nhóm bảo trì thượng nguồn chủ động dịch tag mỗi lần ra bản vá, và đó chính xác là lý do ' + c('postgres:latest') + ' có thể nhảy qua một phiên bản lớn giữa hai lần clone cùng một file Compose. Lựa chọn bất biến là digest: ' + c('nginx@sha256:...') + ' gọi tên chính nội dung và không trỏ lại được. Phương án 2 nhầm việc mất tên với việc bị xoá. Phương án 3 và 4 đều bịa hành vi — tầng ảnh không bao giờ bị trộn giữa hai ảnh, và một tag tại một thời điểm ánh xạ tới đúng một ảnh.',
          ),
        }),

        // q15 · đáp án 3
        mcq({
          prompt: B(
            'A container refuses to start on a server. Which pair of commands settles the diagnosis?' + code(
              '$ docker run --rm ghcr.io/me/api:1.4.2\n' +
              'exec /usr/local/bin/node: exec format error',
            ),
            'Một container không chịu khởi động trên máy chủ. Cặp câu lệnh nào chốt được chẩn đoán?' + code(
              '$ docker run --rm ghcr.io/me/api:1.4.2\n' +
              'exec /usr/local/bin/node: exec format error',
            ),
          ),
          options: [
            B(
              '<code>docker logs</code> and <code>docker inspect .State.ExitCode</code> — the application printed the reason before it exited',
              '<code>docker logs</code> và <code>docker inspect .State.ExitCode</code> — ứng dụng đã in ra lý do trước khi thoát',
            ),
            B(
              '<code>docker pull --no-cache</code> and a checksum of the layer tar — the message means one layer arrived corrupted',
              '<code>docker pull --no-cache</code> và một mã kiểm của file tar tầng ảnh — thông báo đó nghĩa là một tầng về tới nơi bị hỏng',
            ),
            B(
              '<code>ls -l</code> on the entrypoint and <code>file</code> on the script — the message means the executable bit or the shebang is wrong',
              '<code>ls -l</code> trên entrypoint và <code>file</code> trên script — thông báo đó nghĩa là bit thực thi hoặc dòng shebang bị sai',
            ),
            B(
              '<code>docker image inspect --format \'{{.Os}}/{{.Architecture}}\'</code> against <code>uname -m</code> on the host — the message always means wrong CPU architecture',
              '<code>docker image inspect --format \'{{.Os}}/{{.Architecture}}\'</code> đối chiếu với <code>uname -m</code> trên máy chủ — thông báo đó LUÔN nghĩa là sai kiến trúc CPU',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The kernel is saying the ELF header belongs to another machine. Nothing is corrupted and the image is fine — it is just for a different instruction set. On the machine these answers were verified, ' + c('docker image inspect --format \'{{.Os}}/{{.Architecture}}\' alpine:3.20') + ' reports <code>linux/arm64</code> while ' + c('uname -m') + ' inside reports <code>aarch64</code>: the same thing under two naming schemes, exactly as <code>amd64</code> and <code>x86_64</code> are. The classic way to produce this is building on an Apple Silicon laptop and deploying to an x86 VPS — build green, push green, deploy green, service dead. Option 1 fails because the process never ran, so there are no application logs. Option 2 would give a digest mismatch during the pull, not an exec error. Option 3 describes exit code 126, a genuinely different failure.',
            'Nhân đang nói rằng phần đầu ELF thuộc về một cái máy khác. Không có gì hỏng và cái ảnh vẫn lành — nó chỉ dành cho một tập lệnh khác. Trên chính cái máy dùng để kiểm chứng những đáp án này, ' + c('docker image inspect --format \'{{.Os}}/{{.Architecture}}\' alpine:3.20') + ' báo <code>linux/arm64</code> còn ' + c('uname -m') + ' bên trong báo <code>aarch64</code>: cùng một thứ dưới hai lối đặt tên, y như <code>amd64</code> và <code>x86_64</code>. Cách kinh điển để tạo ra cảnh này là dựng trên laptop Apple Silicon rồi triển khai lên một VPS x86 — dựng xanh, đẩy xanh, deploy xanh, dịch vụ chết. Phương án 1 hỏng vì tiến trình chưa từng chạy, nên không có log ứng dụng nào. Phương án 2 sẽ cho lỗi lệch digest ngay lúc kéo về chứ không phải lỗi exec. Phương án 3 mô tả mã thoát 126, một cú hỏng hoàn toàn khác.',
          ),
        }),

        // q16 · đáp án 1
        mcq({
          prompt: B(
            'A production server is at 96% disk. A teammate suggests <code>docker system prune -a --volumes</code>. Beyond deleting data, what specific operational capability does the <code>-a</code> take away?',
            'Một máy chủ production đã dùng 96% đĩa. Một đồng đội đề xuất <code>docker system prune -a --volumes</code>. Ngoài chuyện xoá dữ liệu, riêng cờ <code>-a</code> lấy đi khả năng vận hành cụ thể nào?',
          ),
          options: [
            B(
              'It clears the build cache, so the next deploy has to rebuild every layer from scratch instead of reusing the warm cache',
              'Nó xoá bộ đệm dựng, nên bản deploy kế tiếp phải dựng lại mọi tầng từ đầu thay vì dùng lại cache đang ấm',
            ),
            B(
              'It removes every image no RUNNING container uses — including the previous release, turning a ten-second rollback into a registry pull',
              'Nó gỡ MỌI ảnh mà không container ĐANG CHẠY nào dùng — kể cả bản phát hành trước, biến một cú quay lui mười giây thành một lượt kéo từ registry',
            ),
            B(
              'It resets <code>/etc/docker/daemon.json</code> to defaults, so log rotation and live-restore have to be configured again afterwards',
              'Nó đặt lại <code>/etc/docker/daemon.json</code> về mặc định, nên xoay vòng log và live-restore phải cấu hình lại sau đó',
            ),
            B(
              'It stops running containers for the duration of the sweep, which is a short outage rather than a lasting loss of capability',
              'Nó dừng các container đang chạy trong suốt lượt quét, tức là một gián đoạn ngắn chứ không phải mất khả năng lâu dài',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Without <code>-a</code>, ' + c('docker image prune') + ' removes only dangling images — ones no tag points at, which nothing can reference by name. With <code>-a</code> it removes every image not attached to a running container, and that set includes the release you were running an hour ago. Suddenly a rollback means pulling from the registry, which is fine right up until the registry is the thing that is down, or the network is slow, or it is three in the morning. The safe ladder is ' + c('docker builder prune') + ', then ' + c('docker image prune') + ' with no <code>-a</code>, then ' + c('docker container prune') + ', checking <code>df</code> between each — that recovers most of the space with nothing at risk. Option 1 describes ' + c('builder prune') + ', which is the safest step, not the dangerous one. Option 3 invents a config reset. Option 4 is false: running containers and their images are never touched.',
            'Không có <code>-a</code> thì ' + c('docker image prune') + ' chỉ gỡ những ảnh dangling — những ảnh không tag nào trỏ tới, thứ mà không gì gọi tên được. Có <code>-a</code> thì nó gỡ mọi ảnh không gắn với một container đang chạy, và tập đó bao gồm cả bản phát hành bạn đang chạy một tiếng trước. Bỗng nhiên quay lui nghĩa là phải kéo từ registry, chuyện vốn không sao cho tới khi chính registry là thứ đang chết, hoặc mạng chậm, hoặc lúc đó là ba giờ sáng. Thang an toàn là ' + c('docker builder prune') + ', rồi ' + c('docker image prune') + ' không kèm <code>-a</code>, rồi ' + c('docker container prune') + ', kiểm <code>df</code> giữa mỗi bước — cách đó lấy lại phần lớn dung lượng mà không đặt gì vào thế rủi ro. Phương án 1 mô tả ' + c('builder prune') + ', vốn là bước an toàn nhất chứ không phải bước nguy hiểm. Phương án 3 bịa ra một lần đặt lại cấu hình. Phương án 4 sai: container đang chạy và ảnh của chúng không bao giờ bị đụng tới.',
          ),
        }),

        /* ── Chương 4 — viết Dockerfile (5 câu) ──────────────────────────── */

        // q17 · đáp án 0
        mcq({
          prompt: B(
            'What is the dot at the end of <code>docker build -t app -f docker/api.Dockerfile .</code>?',
            'Dấu chấm ở cuối lệnh <code>docker build -t app -f docker/api.Dockerfile .</code> là gì?',
          ),
          options: [
            B(
              'The BUILD CONTEXT — a directory packaged and sent to the daemon, and the only place <code>COPY</code> and <code>ADD</code> can read from',
              'NGỮ CẢNH DỰNG — một thư mục được đóng gói rồi gửi tới tiến trình nền, và là nơi DUY NHẤT mà <code>COPY</code> với <code>ADD</code> đọc được',
            ),
            B(
              'The path to the Dockerfile, which <code>-f</code> then overrides for this particular build',
              'Đường dẫn tới Dockerfile, thứ mà <code>-f</code> sau đó ghi đè cho riêng lượt dựng này',
            ),
            B(
              'The output directory where the finished image layers are written before they are committed',
              'Thư mục đầu ra nơi các tầng ảnh hoàn chỉnh được ghi ra trước khi được chốt lại',
            ),
            B(
              'The working directory for every <code>RUN</code> instruction, unless a <code>WORKDIR</code> overrides it later in the file',
              'Thư mục làm việc cho mọi chỉ thị <code>RUN</code>, trừ khi có một <code>WORKDIR</code> ghi đè nó về sau trong file',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Before a single instruction runs, the CLI packages that directory and ships it to the daemon — which might be on another machine and cannot read your disk. Two consequences follow, and both surprise people once. First, ' + c('COPY ../shared /app') + ' can never work: the parent directory is not in the context, and no path outside it ever will be. Second, the size of that directory is a cost you pay on every build, which is why a stray <code>node_modules</code> shows up as ' + c('transferring context: 61.44MB') + ' and three wasted seconds before anything happens — and why ' + c('.dockerignore') + ' is worth writing before the Dockerfile. Option 2 gets the roles backwards: <code>-f</code> names the Dockerfile, the dot names the context, and they are chosen independently. Options 3 and 4 describe things Docker does not take from the command line at all.',
            'Trước khi một chỉ thị nào kịp chạy, CLI đóng gói cái thư mục đó rồi chuyển tới tiến trình nền — thứ có thể đang nằm trên một máy khác và không đọc được đĩa của bạn. Hai hệ quả đi kèm, và cả hai đều làm người ta bất ngờ đúng một lần. Một, ' + c('COPY ../shared /app') + ' không bao giờ chạy được: thư mục cha không nằm trong ngữ cảnh, và không đường dẫn nào ngoài nó sẽ nằm trong đó. Hai, kích thước thư mục ấy là cái giá bạn trả ở MỌI lượt dựng, và đó là lý do một cái <code>node_modules</code> lạc chỗ hiện ra thành ' + c('transferring context: 61.44MB') + ' cùng ba giây phí phạm trước khi có gì xảy ra — và là lý do nên viết ' + c('.dockerignore') + ' TRƯỚC cả Dockerfile. Phương án 2 đảo ngược hai vai: <code>-f</code> gọi tên Dockerfile, dấu chấm gọi tên ngữ cảnh, và hai thứ được chọn độc lập. Phương án 3 và 4 mô tả những thứ Docker hoàn toàn không lấy từ dòng lệnh.',
          ),
        }),

        // q18 · đáp án 2
        mcq({
          prompt: B(
            'Two images were built and run. Explain the difference in output.' + code(
              '# image A                        # image B\n' +
              'FROM alpine:3.20                 FROM alpine:3.20\n' +
              'ENV NAME=cuong                   ENV NAME=cuong\n' +
              'CMD ["echo", "hi $NAME"]         CMD ["sh","-c","echo hi $NAME"]\n' +
              '\n' +
              '$ docker run --rm A              $ docker run --rm B\n' +
              'hi $NAME                         hi cuong',
            ),
            'Hai cái ảnh được dựng rồi chạy. Hãy giải thích khác biệt ở kết quả.' + code(
              '# ảnh A                          # ảnh B\n' +
              'FROM alpine:3.20                 FROM alpine:3.20\n' +
              'ENV NAME=cuong                   ENV NAME=cuong\n' +
              'CMD ["echo", "hi $NAME"]         CMD ["sh","-c","echo hi $NAME"]\n' +
              '\n' +
              '$ docker run --rm A              $ docker run --rm B\n' +
              'hi $NAME                         hi cuong',
            ),
          ),
          options: [
            B(
              'The <code>ENV</code> in A was defined after the layer that <code>CMD</code> belongs to, so the variable does not exist yet when the command is assembled',
              'Chỉ thị <code>ENV</code> trong A được định nghĩa sau cái tầng mà <code>CMD</code> thuộc về, nên biến chưa tồn tại lúc câu lệnh được lắp ráp',
            ),
            B(
              'Variables in <code>CMD</code> must be written <code>${NAME}</code> with braces; the bare <code>$NAME</code> form is only expanded inside a <code>RUN</code>',
              'Biến trong <code>CMD</code> phải viết là <code>${NAME}</code> có ngoặc; dạng <code>$NAME</code> trần chỉ được khai triển bên trong một <code>RUN</code>',
            ),
            B(
              'Exec form runs the binary directly with no shell, and only a shell expands variables — B asks for one explicitly, so the expansion happens',
              'Dạng exec chạy thẳng chương trình mà không qua shell, và chỉ shell mới khai triển biến — B chủ động gọi một cái shell, nên phép khai triển xảy ra',
            ),
            B(
              'A is shell form and B is exec form; shell form passes its arguments through unmodified, which is why the placeholder survives in A',
              'A là dạng shell còn B là dạng exec; dạng shell truyền tham số đi nguyên vẹn, và đó là lý do chỗ giữ chỗ sống sót trong A',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Verified by building and running both. A JSON array ' + c('CMD ["echo", "hi $NAME"]') + ' is <b>exec form</b>: Docker calls <code>execve</code> on <code>echo</code> with one literal argument, and there is no shell anywhere to notice the dollar sign. B asks for a shell by name, so ordinary shell expansion applies. Exec form is what you want almost always, because your process becomes PID 1 and receives SIGTERM directly; when you genuinely need a variable or a pipe, spell the shell out and add <code>exec</code> so you keep PID 1: ' + c('CMD ["sh","-c","exec node server.js --port $PORT"]') + '. Option 4 has the two forms exactly swapped — the JSON array is exec form. Option 1 invents an ordering rule (<code>ENV</code> is in the config and available to any later shell). Option 2 invents a brace requirement that no form has.',
            'Đã kiểm chứng bằng cách dựng và chạy cả hai. Một mảng JSON ' + c('CMD ["echo", "hi $NAME"]') + ' là <b>DẠNG EXEC</b>: Docker gọi <code>execve</code> lên <code>echo</code> với đúng một tham số theo nghĩa đen, và không có shell nào ở đó để mà để ý tới dấu đô-la. B thì gọi đích danh một cái shell, nên phép khai triển thông thường của shell có hiệu lực. Dạng exec là thứ bạn muốn trong hầu hết mọi trường hợp, vì tiến trình của bạn trở thành PID 1 và nhận SIGTERM trực tiếp; khi thật sự cần một biến hay một ống dẫn thì hãy gọi rõ cái shell và thêm <code>exec</code> để giữ được PID 1: ' + c('CMD ["sh","-c","exec node server.js --port $PORT"]') + '. Phương án 4 đảo ngược đúng hai dạng — mảng JSON mới là dạng exec. Phương án 1 bịa ra một luật thứ tự (<code>ENV</code> nằm trong cấu hình và có sẵn cho mọi shell về sau). Phương án 2 bịa ra một yêu cầu về ngoặc mà không dạng nào có.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'This image was built and run with no extra arguments. It printed <code>entrypoint-shell-form</code> and nothing else. Where did <code>CMD</code> go?' + code(
              'FROM alpine:3.20\n' +
              'ENTRYPOINT echo entrypoint-shell-form\n' +
              'CMD ["hello"]',
            ),
            'Ảnh này được dựng rồi chạy mà không kèm tham số nào. Nó in ra <code>entrypoint-shell-form</code> và không gì khác. <code>CMD</code> đi đâu mất?' + code(
              'FROM alpine:3.20\n' +
              'ENTRYPOINT echo entrypoint-shell-form\n' +
              'CMD ["hello"]',
            ),
          ),
          options: [
            B(
              '<code>CMD</code> only applies when <code>ENTRYPOINT</code> is absent; whenever both are present the <code>CMD</code> is documentation and never runs',
              '<code>CMD</code> chỉ có tác dụng khi vắng <code>ENTRYPOINT</code>; hễ có cả hai thì <code>CMD</code> chỉ là tài liệu và không bao giờ chạy',
            ),
            B(
              '<code>echo</code> received <code>hello</code> but discarded it, because <code>echo</code> in busybox prints only its first argument',
              '<code>echo</code> có nhận <code>hello</code> nhưng bỏ đi, vì <code>echo</code> của busybox chỉ in tham số đầu tiên',
            ),
            B(
              'The two instructions must be in the order <code>CMD</code> then <code>ENTRYPOINT</code>; declared this way round the later one wins outright',
              'Hai chỉ thị phải theo thứ tự <code>CMD</code> rồi mới <code>ENTRYPOINT</code>; khai báo theo chiều này thì cái sau thắng tuyệt đối',
            ),
            B(
              'A shell-form <code>ENTRYPOINT</code> becomes <code>/bin/sh -c "echo entrypoint-shell-form"</code>, and in that form <code>CMD</code> is ignored entirely',
              'Một <code>ENTRYPOINT</code> dạng shell trở thành <code>/bin/sh -c "echo entrypoint-shell-form"</code>, và ở dạng đó <code>CMD</code> bị bỏ qua hoàn toàn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it: the output is one word, not ' + c('entrypoint-shell-form hello') + '. The normal contract is <b>final command = ENTRYPOINT + CMD</b>, so ' + c('ENTRYPOINT ["echo"]') + ' plus ' + c('CMD ["hello"]') + ' really does print <code>hello</code>, and an argument after the image name replaces the CMD half. But shell form wraps the whole entrypoint in ' + c('/bin/sh -c "..."') + ', and that construction takes exactly one string — there is nowhere for CMD to be appended, so it is silently dropped. If your CMD appears to have no effect, this is almost always why. Option 1 states a rule that is the opposite of the truth and would make the most common official-image pattern impossible. Option 2 is testable and false. Option 3 invents an ordering requirement; only the <em>last</em> of each instruction counts, and their relative order does not matter.',
            'Đã chạy thật: kết quả là một chữ, không phải ' + c('entrypoint-shell-form hello') + '. Bản hợp đồng bình thường là <b>câu lệnh cuối = ENTRYPOINT + CMD</b>, nên ' + c('ENTRYPOINT ["echo"]') + ' cộng ' + c('CMD ["hello"]') + ' đúng là in ra <code>hello</code>, và một tham số đặt sau tên ảnh sẽ thay thế nửa CMD. Nhưng dạng shell bọc cả cái entrypoint vào trong ' + c('/bin/sh -c "..."') + ', mà cấu trúc đó nhận đúng một chuỗi — không còn chỗ nào để nối CMD vào, nên nó bị bỏ đi trong im lặng. Nếu CMD của bạn có vẻ chẳng tác dụng gì, gần như luôn là vì lý do này. Phương án 1 phát biểu một luật ngược hẳn sự thật và sẽ khiến khuôn mẫu phổ biến nhất của các ảnh chính thức trở thành bất khả. Phương án 2 kiểm được và sai. Phương án 3 bịa ra một yêu cầu về thứ tự; chỉ chỉ thị CUỐI CÙNG của mỗi loại được tính, và thứ tự tương đối giữa chúng không quan trọng.',
          ),
        }),

        // q20 · đáp án 1
        mcq({
          prompt: B(
            'Measured on a real build of the Dockerfile below. Which explanation fits all three lines of evidence?' + code(
              'FROM alpine:3.20\n' +
              'ARG BUILD_ONLY=from-arg\n' +
              'ENV RUNTIME_TOO=from-env\n' +
              'RUN echo "at build: ARG=$BUILD_ONLY ENV=$RUNTIME_TOO"\n' +
              'CMD ["sh","-c","echo at run: ARG=$BUILD_ONLY ENV=$RUNTIME_TOO"]\n' +
              '\n' +
              'build output : at build: ARG=from-arg ENV=from-env\n' +
              'run output   : at run: ARG= ENV=from-env\n' +
              'docker history: RUN |1 BUILD_ONLY=from-arg /bin/sh -c echo "at build: ..."',
            ),
            'Đo trên một lượt dựng thật của Dockerfile dưới đây. Lời giải thích nào khớp với cả ba dòng bằng chứng?' + code(
              'FROM alpine:3.20\n' +
              'ARG BUILD_ONLY=from-arg\n' +
              'ENV RUNTIME_TOO=from-env\n' +
              'RUN echo "at build: ARG=$BUILD_ONLY ENV=$RUNTIME_TOO"\n' +
              'CMD ["sh","-c","echo at run: ARG=$BUILD_ONLY ENV=$RUNTIME_TOO"]\n' +
              '\n' +
              'lúc dựng    : at build: ARG=from-arg ENV=from-env\n' +
              'lúc chạy    : at run: ARG= ENV=from-env\n' +
              'docker history: RUN |1 BUILD_ONLY=from-arg /bin/sh -c echo "at build: ..."',
            ),
          ),
          options: [
            B(
              '<code>ARG</code> without an explicit <code>--build-arg</code> is treated as unset, so its default only reached the <code>RUN</code> by luck of shell inheritance',
              '<code>ARG</code> mà không có <code>--build-arg</code> tường minh thì bị coi là chưa đặt, nên giá trị mặc định chỉ tới được <code>RUN</code> nhờ may mắn kế thừa của shell',
            ),
            B(
              '<code>ARG</code> exists only during the build and is gone from the finished image, while <code>ENV</code> is stored in the image config — but the ARG value is still recorded in <code>docker history</code>, so neither is private',
              '<code>ARG</code> chỉ sống trong lúc dựng và biến mất khỏi ảnh hoàn chỉnh, còn <code>ENV</code> được lưu trong cấu hình ảnh — nhưng giá trị của ARG vẫn được ghi vào <code>docker history</code>, nên chẳng cái nào là riêng tư',
            ),
            B(
              '<code>ARG</code> is scoped to the instruction that follows it, so it was consumed by the <code>RUN</code> and unavailable to anything after that line',
              '<code>ARG</code> chỉ có phạm vi trong chỉ thị ngay sau nó, nên nó bị <code>RUN</code> tiêu thụ mất và không còn cho bất cứ thứ gì sau dòng đó',
            ),
            B(
              'Both survive into the image, but exec-form <code>CMD</code> cannot read build arguments, so <code>ARG</code> would appear if the CMD were written in shell form',
              'Cả hai đều sống sót vào ảnh, chỉ là <code>CMD</code> dạng exec không đọc được tham số dựng, nên <code>ARG</code> sẽ hiện ra nếu CMD viết ở dạng shell',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Three measurements, one rule. <code>ARG</code> is a build-time variable: available to instructions during the build, and completely absent from the image config afterwards — which is why the run line shows ' + c('ARG=') + ' with nothing after it. <code>ENV</code> is written into the config and is therefore present in every container ever started from that image. The third line is the part that matters for security: BuildKit records the argument in the layer\'s <code>CreatedBy</code>, so ' + c('docker history --no-trunc') + ' hands the value to anyone with the image. That is why a registry token must never travel by <code>--build-arg</code>; ' + c('RUN --mount=type=secret,id=npmrc ...') + ' exists precisely because it writes the value into no layer and no history entry. Option 3 invents a one-instruction scope. Options 1 and 4 are both contradicted by the transcript.',
            'Ba phép đo, một luật. <code>ARG</code> là biến LÚC DỰNG: có sẵn cho các chỉ thị trong lúc dựng, và biến mất hoàn toàn khỏi cấu hình ảnh sau đó — nên dòng lúc chạy hiện ' + c('ARG=') + ' với chẳng gì phía sau. <code>ENV</code> thì được ghi vào cấu hình và do đó có mặt trong mọi container từng khởi chạy từ ảnh ấy. Dòng thứ ba mới là phần quan trọng về mặt an toàn: BuildKit ghi lại tham số đó vào trường <code>CreatedBy</code> của tầng, nên ' + c('docker history --no-trunc') + ' trao giá trị ấy cho bất cứ ai có cái ảnh. Đó là lý do một token registry không bao giờ được đi bằng <code>--build-arg</code>; ' + c('RUN --mount=type=secret,id=npmrc ...') + ' tồn tại chính vì nó không ghi giá trị vào tầng nào và cũng không vào mục history nào. Phương án 3 bịa ra một phạm vi gói gọn trong một chỉ thị. Phương án 1 và 4 đều bị chính đoạn terminal bác bỏ.',
          ),
        }),

        // q21 · đáp án 2
        mcq({
          prompt: B(
            'This built successfully. The second stage printed an empty value. Why?' + code(
              'ARG BASE_TAG=3.20\n' +
              'FROM alpine:${BASE_TAG} AS build\n' +
              'ARG BASE_TAG\n' +
              'RUN echo "stage1 sees: ${BASE_TAG}"\n' +
              '\n' +
              'FROM alpine:${BASE_TAG}\n' +
              'RUN echo "stage2 sees: ${BASE_TAG}"\n' +
              '\n' +
              '-> stage2 sees:',
            ),
            'Đoạn này dựng thành công. Stage thứ hai in ra một giá trị rỗng. Vì sao?' + code(
              'ARG BASE_TAG=3.20\n' +
              'FROM alpine:${BASE_TAG} AS build\n' +
              'ARG BASE_TAG\n' +
              'RUN echo "stage1 sees: ${BASE_TAG}"\n' +
              '\n' +
              'FROM alpine:${BASE_TAG}\n' +
              'RUN echo "stage2 sees: ${BASE_TAG}"\n' +
              '\n' +
              '-> stage2 sees:',
            ),
          ),
          options: [
            B(
              'An <code>ARG</code> with a default is consumed by the first <code>FROM</code> that uses it, so the second <code>FROM</code> resolved against an already-emptied variable',
              'Một <code>ARG</code> có giá trị mặc định bị cái <code>FROM</code> đầu tiên dùng nó tiêu thụ mất, nên <code>FROM</code> thứ hai phân giải trên một biến đã bị làm rỗng',
            ),
            B(
              'You must pass <code>--build-arg BASE_TAG=3.20</code> on the command line; a default written in the file is only a fallback for <code>FROM</code> lines, never for <code>RUN</code>',
              'Bạn phải truyền <code>--build-arg BASE_TAG=3.20</code> trên dòng lệnh; giá trị mặc định viết trong file chỉ là phương án dự phòng cho các dòng <code>FROM</code>, không bao giờ cho <code>RUN</code>',
            ),
            B(
              'An <code>ARG</code> declared before the first <code>FROM</code> lives outside every stage: it is usable in <code>FROM</code> lines, and each stage that wants it must re-declare <code>ARG BASE_TAG</code> — which stage 1 did and stage 2 did not',
              'Một <code>ARG</code> khai báo trước <code>FROM</code> đầu tiên sống NGOÀI mọi stage: nó dùng được trong các dòng <code>FROM</code>, và mỗi stage muốn dùng phải khai báo lại <code>ARG BASE_TAG</code> — điều mà stage 1 đã làm còn stage 2 thì không',
            ),
            B(
              'Only the last stage of a multi-stage build inherits build arguments, and this <code>ARG</code> was shadowed by the redeclaration inside the <code>build</code> stage',
              'Chỉ stage cuối của một bản dựng nhiều tầng mới kế thừa tham số dựng, và <code>ARG</code> này bị chính lần khai báo lại bên trong stage <code>build</code> che mất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is documented and still catches everyone once, because the symptom is a silently empty variable rather than an error. The pre-<code>FROM</code> <code>ARG</code> belongs to no stage; it exists so that ' + c('FROM alpine:${BASE_TAG}') + ' can be parameterised, and both <code>FROM</code> lines above did resolve correctly. Inside a stage, the variable is only in scope if that stage writes <code>ARG BASE_TAG</code> again — with no value, which inherits the outer one. Stage 1 did, stage 2 did not, hence the empty string. The same re-declaration is needed per stage in every multi-stage build. Option 1 invents a consume-once rule. Option 2 is refuted by stage 1 printing the value with no <code>--build-arg</code> anywhere. Option 4 has the inheritance backwards and misreads the redeclaration as shadowing.',
            'Chuyện này có trong tài liệu mà vẫn tóm được ai cũng đúng một lần, vì triệu chứng là một biến rỗng trong im lặng chứ không phải một lỗi. Cái <code>ARG</code> đứng trước <code>FROM</code> không thuộc stage nào; nó tồn tại để ' + c('FROM alpine:${BASE_TAG}') + ' tham số hoá được, và cả hai dòng <code>FROM</code> ở trên đều phân giải đúng. Bên trong một stage, biến đó chỉ có phạm vi nếu chính stage ấy viết lại <code>ARG BASE_TAG</code> — không kèm giá trị, để kế thừa giá trị bên ngoài. Stage 1 có làm, stage 2 thì không, nên ra chuỗi rỗng. Cũng phải khai báo lại như vậy cho từng stage trong mọi bản dựng nhiều tầng. Phương án 1 bịa ra một luật tiêu-thụ-một-lần. Phương án 2 bị bác bởi chính việc stage 1 in ra giá trị mà chẳng có <code>--build-arg</code> nào. Phương án 4 đảo ngược chiều kế thừa và đọc nhầm lần khai báo lại thành che khuất.',
          ),
        }),

        /* ── Chương 5 — tầng ảnh, cache & dựng nhanh (5 câu) ──────────────── */

        // q22 · đáp án 0
        mcq({
          prompt: B(
            'A build has worked for six weeks. Today, adding one package makes it fail with <code>404 Not Found</code> from the mirror. The Dockerfile contains:' + code(
              'RUN apt-get update\n' +
              'RUN apt-get install -y --no-install-recommends curl jq',
            ) + '<p>What is actually wrong?</p>',
            'Một bản dựng đã chạy tốt sáu tuần. Hôm nay thêm một gói vào thì nó hỏng với lỗi <code>404 Not Found</code> từ máy chủ gương. Dockerfile chứa:' + code(
              'RUN apt-get update\n' +
              'RUN apt-get install -y --no-install-recommends curl jq',
            ) + '<p>Thật ra sai ở đâu?</p>',
          ),
          options: [
            B(
              'A <code>RUN</code> is keyed on its command STRING, so editing only the install line left the six-week-old <code>apt-get update</code> cached, and the install now asks for versions the index no longer lists',
              'Một <code>RUN</code> lấy khoá cache từ chính CHUỖI câu lệnh, nên chỉ sửa dòng install thì lệnh <code>apt-get update</code> sáu tuần tuổi vẫn nằm trong cache, và lượt install giờ đòi những phiên bản mà danh mục không còn liệt kê',
            ),
            B(
              'The mirror has genuinely dropped those packages; pinning the Debian release in the base image tag is the only reliable fix',
              'Máy chủ gương thật sự đã bỏ những gói đó; ghim phiên bản Debian vào tag ảnh nền là cách chữa đáng tin duy nhất',
            ),
            B(
              '<code>--no-install-recommends</code> excludes a transitive dependency of the new package, and apt reports the missing dependency as a 404',
              '<code>--no-install-recommends</code> loại mất một phụ thuộc gián tiếp của gói mới, và apt báo phụ thuộc thiếu đó thành lỗi 404',
            ),
            B(
              'apt holds a lock between the two instructions, and the second <code>RUN</code> runs in a fresh container that cannot see the lock it needs',
              'apt giữ một cái khoá giữa hai chỉ thị, và lệnh <code>RUN</code> thứ hai chạy trong một container mới toanh không thấy được cái khoá nó cần',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the classic, and it produces a network-shaped error from a cache-shaped cause. BuildKit does not know or care what a command does: the key for a <code>RUN</code> is the literal command string plus the previous step\'s key. ' + c('RUN apt-get update') + ' therefore has the same key today as it did six weeks ago, so its result — a package index from six weeks ago — is reused. Meanwhile you changed the install line, so that step really does re-run, and it asks the mirror for versions that have since been superseded and removed. Keeping <code>update</code> and <code>install</code> in one ' + c('RUN ... && ...') + ' means changing the package list invalidates both together. The same shape applies to <code>apk update</code> and <code>dnf makecache</code>. Option 2 mistakes the symptom for the cause. Options 3 and 4 invent apt behaviour; each <code>RUN</code> is its own container by design, and that is not what a 404 means.',
            'Đây là ca kinh điển, và nó tạo ra một lỗi mang hình dạng lỗi mạng từ một nguyên nhân mang hình dạng lỗi cache. BuildKit không biết và không quan tâm một câu lệnh làm gì: khoá của một <code>RUN</code> là chính chuỗi câu lệnh theo nghĩa đen cộng khoá của bước trước. Vì thế ' + c('RUN apt-get update') + ' hôm nay có cùng khoá với sáu tuần trước, nên kết quả của nó — một danh mục gói của sáu tuần trước — được dùng lại. Trong khi đó bạn đã đổi dòng install, nên bước đó thật sự chạy lại, và nó hỏi máy chủ gương những phiên bản từ đó tới nay đã bị thay và gỡ đi. Giữ <code>update</code> và <code>install</code> trong cùng một ' + c('RUN ... && ...') + ' khiến việc đổi danh sách gói làm mất hiệu lực cả hai cùng lúc. Cũng hình dạng đó áp cho <code>apk update</code> và <code>dnf makecache</code>. Phương án 2 nhầm triệu chứng thành nguyên nhân. Phương án 3 và 4 bịa hành vi của apt; mỗi <code>RUN</code> vốn được thiết kế là một container riêng, và đó không phải nghĩa của một lỗi 404.',
          ),
        }),

        // q23 · đáp án 1
        mcq({
          prompt: B(
            'Two Dockerfiles, identical instructions, different order. Both were rebuilt after editing one source file and one README line. Measured:' + code(
              '# slow                         # fast\n' +
              'FROM alpine:3.20               FROM alpine:3.20\n' +
              'WORKDIR /app                   WORKDIR /app\n' +
              'COPY . .                       COPY package.json ./\n' +
              'RUN <expensive install>        RUN <expensive install>\n' +
              '                               COPY src ./src\n' +
              '\n' +
              'slow: 3.61s        fast: 0.39s',
            ) + '<p>Which statement explains the gap?</p>',
            'Hai Dockerfile, cùng chỉ thị, khác thứ tự. Cả hai được dựng lại sau khi sửa một file mã nguồn và một dòng README. Đo được:' + code(
              '# chậm                         # nhanh\n' +
              'FROM alpine:3.20               FROM alpine:3.20\n' +
              'WORKDIR /app                   WORKDIR /app\n' +
              'COPY . .                       COPY package.json ./\n' +
              'RUN <bước cài tốn kém>         RUN <bước cài tốn kém>\n' +
              '                               COPY src ./src\n' +
              '\n' +
              'chậm: 3,61s        nhanh: 0,39s',
            ) + '<p>Phát biểu nào giải thích được khoảng cách đó?</p>',
          ),
          options: [
            B(
              'The slow build transfers a bigger context, and the extra seconds are the upload rather than the install re-running',
              'Bản chậm chuyển một ngữ cảnh lớn hơn, và mấy giây thừa là phần tải lên chứ không phải bước cài chạy lại',
            ),
            B(
              '<code>COPY . .</code> hashes every file in the context, so editing anything — even the README — changes that step\'s key, and invalidation cascades to every step below it',
              '<code>COPY . .</code> băm mọi file trong ngữ cảnh, nên sửa bất cứ thứ gì — kể cả README — cũng đổi khoá của bước đó, và việc mất hiệu lực lan xuống mọi bước bên dưới',
            ),
            B(
              'The fast version has one more instruction, and BuildKit parallelises instructions, so more instructions means more concurrency',
              'Bản nhanh có nhiều hơn một chỉ thị, và BuildKit chạy song song các chỉ thị, nên càng nhiều chỉ thị thì càng nhiều đồng thời',
            ),
            B(
              'The slow version copies files before <code>WORKDIR</code> takes effect, so the install step has to relocate them into <code>/app</code> on every build',
              'Bản chậm chép file trước khi <code>WORKDIR</code> có hiệu lực, nên bước cài phải dời chúng vào <code>/app</code> ở mỗi lượt dựng',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>COPY</code> is keyed on the <em>contents</em> of everything it copies, and every step\'s key includes the key of the step before it. So in the slow version a one-character README edit changes step 3, which forces steps 4 and 5 to rerun even though nothing they depend on changed — including the expensive install. The fast version copies only the two files the install actually reads, so the install stays cached and only the last <code>COPY</code> re-runs. Nine times on a toy project with one dependency; on a real backend where the install takes 90 to 180 seconds, it is the difference between a two-minute loop and a five-second one, times every commit and every CI run. Option 1 is a real cost but a separate one, fixed by <code>.dockerignore</code>. Option 3 misreads BuildKit\'s parallelism, which applies across independent <em>stages</em>, not sequential instructions. Option 4 invents a relocation step that does not exist.',
            '<code>COPY</code> lấy khoá từ NỘI DUNG của mọi thứ nó chép, và khoá của mỗi bước bao gồm cả khoá của bước trước nó. Nên ở bản chậm, một lần sửa README đúng một ký tự cũng đổi khoá của bước 3, buộc bước 4 và 5 chạy lại dù chẳng có gì chúng phụ thuộc thay đổi — kể cả bước cài tốn kém. Bản nhanh chỉ chép đúng hai file mà bước cài thật sự đọc, nên bước cài nằm yên trong cache và chỉ lệnh <code>COPY</code> cuối chạy lại. Gấp chín lần trên một dự án đồ chơi có một thư viện; trên một backend thật nơi lượt cài mất 90 tới 180 giây, đó là khác biệt giữa một vòng lặp hai phút và một vòng năm giây, nhân với mọi lần commit và mọi lượt CI. Phương án 1 là một cái giá có thật nhưng là chuyện khác, chữa bằng <code>.dockerignore</code>. Phương án 3 đọc nhầm tính song song của BuildKit, thứ áp cho các STAGE độc lập chứ không phải các chỉ thị nối tiếp. Phương án 4 bịa ra một bước dời file không hề tồn tại.',
          ),
        }),

        // q24 · đáp án 3
        mcq({
          prompt: B(
            'The same Dockerfile was rebuilt three times. Between builds, only the action shown happened. What decides whether a <code>COPY</code> step is reused?' + code(
              'build 1: (no change)          -> 4 steps CACHED\n' +
              'build 2: touch src/index.js   -> 4 steps CACHED\n' +
              'build 3: printf \'\\n\' >> src/index.js -> 3 steps CACHED',
            ),
            'Cùng một Dockerfile được dựng lại ba lần. Giữa các lượt, chỉ có đúng thao tác ghi kèm xảy ra. Cái gì quyết định một bước <code>COPY</code> có được dùng lại hay không?' + code(
              'lượt 1: (không đổi gì)        -> 4 bước CACHED\n' +
              'lượt 2: touch src/index.js    -> 4 bước CACHED\n' +
              'lượt 3: printf \'\\n\' >> src/index.js -> 3 bước CACHED',
            ),
          ),
          options: [
            B(
              'The file\'s modification time, which <code>touch</code> updated — build 2 kept the cache only because the timestamp granularity is one second',
              'Thời điểm sửa file, thứ mà <code>touch</code> đã cập nhật — lượt 2 giữ được cache chỉ vì độ phân giải mốc thời gian là một giây',
            ),
            B(
              'The number of files in the context, which <code>touch</code> did not change but appending a byte did',
              'Số lượng file trong ngữ cảnh, thứ mà <code>touch</code> không đổi còn việc nối thêm một byte thì có',
            ),
            B(
              'Whether the file is listed in <code>.dockerignore</code>; <code>touch</code> re-applies the ignore rules while a write bypasses them',
              'Việc file có nằm trong <code>.dockerignore</code> hay không; <code>touch</code> áp lại các luật bỏ qua còn một phép ghi thì đi vòng qua chúng',
            ),
            B(
              'A checksum of the file contents together with its path and mode — BuildKit ignores mtime, so <code>touch</code> costs nothing and one appended byte costs a rebuild',
              'Một mã kiểm nội dung file cùng với đường dẫn và quyền của nó — BuildKit bỏ qua mtime, nên <code>touch</code> chẳng tốn gì còn thêm đúng một byte thì phải dựng lại',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured across three consecutive builds. This is the difference between the two key types worth memorising: <code>RUN</code> is keyed on the command <em>string</em>, while <code>COPY</code> and <code>ADD</code> are keyed on the file <em>contents</em>. Content hashing is why an editor that rewrites a file without changing it, a <code>git checkout</code> that resets timestamps, or a CI step that touches everything cost you nothing — behaviour the old pre-BuildKit builder did not have. It is also why one appended newline invalidates that step and everything after it. Option 1 gets the mechanism exactly backwards and would make build 2 a cache miss. Option 2 would mean editing a file in place never invalidates anything, which build 3 disproves. Option 3 invents an interaction: <code>.dockerignore</code> decides what is in the context at all, and applies identically to both builds.',
            'Đo qua ba lượt dựng liên tiếp. Đây là khác biệt giữa hai kiểu khoá đáng thuộc lòng: <code>RUN</code> lấy khoá từ CHUỖI câu lệnh, còn <code>COPY</code> và <code>ADD</code> lấy khoá từ NỘI DUNG file. Băm theo nội dung là lý do một trình soạn thảo ghi lại file mà không đổi gì, một lệnh <code>git checkout</code> làm mới lại mốc thời gian, hay một bước CI chạm vào mọi thứ đều không tốn của bạn đồng nào — hành vi mà trình dựng cũ trước BuildKit không có. Nó cũng là lý do thêm đúng một ký tự xuống dòng làm mất hiệu lực bước đó và mọi thứ sau nó. Phương án 1 hiểu ngược hẳn cơ chế và sẽ khiến lượt 2 trượt cache. Phương án 2 sẽ nghĩa là sửa một file tại chỗ không bao giờ làm mất hiệu lực gì, điều mà lượt 3 bác bỏ. Phương án 3 bịa ra một tương tác: <code>.dockerignore</code> quyết định thứ gì có mặt trong ngữ cảnh, và áp y hệt cho cả hai lượt.',
          ),
        }),

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'Someone writes <code>RUN --mount=type=cache,target=/app/node_modules npm ci</code> to speed up builds. What happens to the resulting image?',
            'Ai đó viết <code>RUN --mount=type=cache,target=/app/node_modules npm ci</code> để dựng cho nhanh. Cái ảnh sinh ra sẽ ra sao?',
          ),
          options: [
            B(
              'It works and is the recommended form, because caching the installed tree skips both the download and the linking step on the next build',
              'Nó chạy được và là dạng được khuyến nghị, vì lưu đệm cả cây đã cài giúp bỏ qua cả bước tải lẫn bước liên kết ở lượt dựng sau',
            ),
            B(
              'The build fails, because a cache mount cannot be placed on a path that an instruction later writes to',
              'Bản dựng hỏng, vì một cache mount không đặt được lên đường dẫn mà một chỉ thị về sau sẽ ghi vào',
            ),
            B(
              'The build is green and the image ships with NO dependencies at all — a cache mount is not part of any layer, so the directory is empty at run time',
              'Bản dựng xanh và cái ảnh đem đi HOÀN TOÀN không có thư viện nào — cache mount không thuộc tầng ảnh nào, nên lúc chạy thư mục đó rỗng',
            ),
            B(
              'The dependencies are present but read-only, so the application starts and then fails the first time a package writes to its own directory',
              'Thư viện có mặt nhưng ở chế độ chỉ đọc, nên ứng dụng khởi động rồi hỏng ngay lần đầu một gói ghi vào chính thư mục của nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A cache mount is unmounted when the instruction ends, and nothing it contains becomes a layer — that is the whole point, and it is why a 400MB npm cache costs zero image bytes. Put the <em>installed tree</em> there and you get a completely green build followed by a container that exits immediately with ' + c('Cannot find module') + '. The rule is: cache mounts are for <b>inputs you would otherwise re-download</b> — ' + c('/root/.npm') + ', ' + c('/root/.cache/pip') + ', ' + c('/go/pkg/mod') + ' — never the installed result. Cache the tarball store and let ' + c('npm ci') + ' write a fresh <code>node_modules</code> into the layer as usual. There is a second reason too: concurrent builds share a mount by default, and npm assumes it owns that directory. Options 1 and 4 both assume the directory survives into the image. Option 2 assumes a validation Docker does not perform — nothing warns you.',
            'Một cache mount bị gỡ bỏ khi chỉ thị kết thúc, và không thứ gì trong nó trở thành một tầng ảnh — đó chính là điểm mấu chốt, và là lý do một bộ đệm npm 400MB tốn không byte ảnh nào. Đặt CÂY ĐÃ CÀI vào đó thì bạn nhận được một bản dựng xanh hoàn toàn, theo sau là một container thoát ngay lập tức với ' + c('Cannot find module') + '. Luật là: cache mount dành cho <b>ĐẦU VÀO mà nếu không có nó bạn phải tải lại</b> — ' + c('/root/.npm') + ', ' + c('/root/.cache/pip') + ', ' + c('/go/pkg/mod') + ' — không bao giờ dành cho kết quả đã cài. Hãy lưu đệm kho tarball và để ' + c('npm ci') + ' ghi một <code>node_modules</code> mới vào tầng ảnh như thường lệ. Còn một lý do thứ hai: các lượt dựng đồng thời mặc định dùng chung một mount, mà npm thì cho rằng nó sở hữu thư mục ấy. Phương án 1 và 4 đều giả định thư mục đó sống sót vào ảnh. Phương án 2 giả định có một phép kiểm mà Docker không thực hiện — không có gì cảnh báo bạn cả.',
          ),
        }),

        // q26 · đáp án 1
        mcq({
          prompt: B(
            'CI passes <code>--cache-to type=gha</code> with the default mode on a multi-stage Dockerfile, and every run is still cold. What is the fix?',
            'CI truyền <code>--cache-to type=gha</code> với mode mặc định trên một Dockerfile nhiều tầng, và mọi lượt chạy vẫn nguội. Cách chữa là gì?',
          ),
          options: [
            B(
              'Give each branch its own cache key, because the default scope is per-commit and a new commit can never find the previous cache',
              'Cấp cho mỗi nhánh một khoá cache riêng, vì phạm vi mặc định là theo từng commit và một commit mới không bao giờ tìm thấy cache trước đó',
            ),
            B(
              'Add <code>mode=max</code> — the default <code>mode=min</code> exports only the FINAL image\'s layers, and the expensive build stage is not in the final image',
              'Thêm <code>mode=max</code> — mặc định <code>mode=min</code> chỉ xuất những tầng của ảnh CUỐI, mà cái stage dựng tốn kém thì không nằm trong ảnh cuối',
            ),
            B(
              'Switch to <code>type=registry</code>, because the GitHub Actions cache backend does not support multi-stage builds',
              'Đổi sang <code>type=registry</code>, vì backend cache của GitHub Actions không hỗ trợ dựng nhiều tầng',
            ),
            B(
              'Name the cache the same as the image tag, so <code>--cache-from</code> can find it without an extra reference',
              'Đặt tên cache trùng với tag của ảnh, để <code>--cache-from</code> tìm được nó mà không cần một tham chiếu phụ',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>mode=min</code> exports only the layers that ended up in the final image. In a multi-stage build the final image is deliberately a thin runtime stage — the compiler, the dev dependencies and the 90-second install all live in a build stage that <em>is not exported</em>. So the cache is written, it is restored, and it covers nothing that costs time. <code>mode=max</code> exports every layer of every stage; it costs 30 to 60 seconds of upload and is almost always a large net win. Two related traps to check at the same time: the default <code>docker</code> driver cannot export cache at all (you need <code>docker-container</code>, which <code>setup-buildx-action</code> creates), and cache <em>mounts</em> never export, so a layer miss in CI still means a full download. Option 1 misstates the scoping, which is per branch with fallback to the default branch. Option 3 invents a limitation. Option 4 would produce a tag that is not a runnable image.',
            '<code>mode=min</code> chỉ xuất những tầng rốt cuộc nằm trong ảnh cuối. Trong một bản dựng nhiều tầng thì ảnh cuối được thiết kế để mỏng — trình biên dịch, các gói dev và lượt cài 90 giây đều nằm ở một stage dựng KHÔNG được xuất ra. Nên cache vẫn được ghi, vẫn được khôi phục, và nó chẳng bao phủ thứ gì tốn thời gian. <code>mode=max</code> xuất mọi tầng của mọi stage; nó tốn 30 tới 60 giây tải lên và gần như luôn lời to. Hai cái bẫy liên quan nên kiểm cùng lúc: trình dựng <code>docker</code> mặc định hoàn toàn không xuất được cache (bạn cần <code>docker-container</code>, thứ mà <code>setup-buildx-action</code> tạo ra), và CACHE MOUNT thì không bao giờ xuất, nên một cú trượt tầng trong CI vẫn nghĩa là tải lại toàn bộ. Phương án 1 nói sai về phạm vi, vốn là theo nhánh có dự phòng về nhánh mặc định. Phương án 3 bịa ra một hạn chế. Phương án 4 sẽ tạo ra một tag không phải là một ảnh chạy được.',
          ),
        }),

        /* ── Chương 6 — ảnh nhỏ và an toàn (4 câu) ───────────────────────── */

        // q27 · đáp án 0
        mcq({
          prompt: B(
            'Two Dockerfiles build the same application. Real measurement with <code>docker images</code>, where the base <code>node:22-alpine</code> is 229MB:' + code(
              '# single-stage -> 617MB          # multi-stage -> 228MB\n' +
              'FROM node:22-alpine              FROM node:22-alpine AS build\n' +
              'WORKDIR /app                     WORKDIR /app\n' +
              'RUN apk add --no-cache \\         RUN apk add --no-cache \\\n' +
              '      python3 make g++                 python3 make g++\n' +
              'COPY app.js ./                   COPY app.js ./\n' +
              'CMD ["node","app.js"]            RUN cp app.js /out.js\n' +
              '                                 FROM node:22-alpine\n' +
              '                                 COPY --from=build /out.js ./app.js\n' +
              '                                 CMD ["node","app.js"]',
            ) + '<p>Why is the multi-stage image smaller?</p>',
            'Hai Dockerfile dựng cùng một ứng dụng. Đo thật bằng <code>docker images</code>, với ảnh nền <code>node:22-alpine</code> nặng 229MB:' + code(
              '# một tầng -> 617MB              # nhiều tầng -> 228MB\n' +
              'FROM node:22-alpine              FROM node:22-alpine AS build\n' +
              'WORKDIR /app                     WORKDIR /app\n' +
              'RUN apk add --no-cache \\         RUN apk add --no-cache \\\n' +
              '      python3 make g++                 python3 make g++\n' +
              'COPY app.js ./                   COPY app.js ./\n' +
              'CMD ["node","app.js"]            RUN cp app.js /out.js\n' +
              '                                 FROM node:22-alpine\n' +
              '                                 COPY --from=build /out.js ./app.js\n' +
              '                                 CMD ["node","app.js"]',
            ) + '<p>Vì sao ảnh nhiều tầng lại nhỏ hơn?</p>',
          ),
          options: [
            B(
              'Only the final stage\'s layers are shipped: the compilers were never copied forward, so they are absent — not deleted, simply never there',
              'Chỉ các tầng của stage CUỐI được đem đi: trình biên dịch chưa từng được chép sang, nên nó vắng mặt — không phải bị xoá, mà đơn giản là chưa từng có ở đó',
            ),
            B(
              'BuildKit deduplicates identical layers between stages, so the toolchain is stored once and counted once instead of twice',
              'BuildKit khử trùng lặp những tầng giống nhau giữa các stage, nên bộ công cụ chỉ được lưu một lần và tính một lần thay vì hai',
            ),
            B(
              'Each <code>FROM</code> ends the previous stage with an implicit cleanup pass that removes packages installed inside it',
              'Mỗi <code>FROM</code> kết thúc stage trước bằng một lượt dọn dẹp ngầm, gỡ đi những gói đã cài bên trong nó',
            ),
            B(
              'The final stage compresses its layers, while a single-stage image is stored uncompressed because there is nothing to compare it against',
              'Stage cuối nén các tầng của nó, còn ảnh một tầng thì lưu ở dạng chưa nén vì không có gì để đối chiếu',
            ),
          ],
          correct: 0,
          explanation: EX(
            '389MB of difference, from a mechanism with no cleverness in it. A later <code>FROM</code> starts a completely fresh filesystem, and only the last stage\'s layers are exported as the image. ' + c('COPY --from=build') + ' reaches back and takes exactly what you name. Everything else — <code>python3 make g++</code>, the source tree, the package cache, any secret you needed for one step — is simply not in the result. That is also why this is the <em>only</em> reliable way to not ship something: deleting in a later layer leaves the bytes below plus a whiteout, so it makes the image slightly larger, not smaller. Option 2 describes a real property (identical layers are stored once) that does not apply here, since the toolchain layer is in one stage only. Options 3 and 4 both invent an automatic step Docker does not perform.',
            '389MB chênh lệch, từ một cơ chế chẳng có gì khôn khéo. Một <code>FROM</code> về sau khởi đầu một hệ thống file hoàn toàn mới, và chỉ các tầng của stage cuối được xuất ra thành cái ảnh. ' + c('COPY --from=build') + ' với ngược về lấy đúng thứ bạn gọi tên. Mọi thứ còn lại — <code>python3 make g++</code>, cây mã nguồn, bộ đệm gói, bất cứ bí mật nào bạn cần cho một bước — đơn giản là không nằm trong kết quả. Đó cũng là lý do đây là cách DUY NHẤT đáng tin để KHÔNG đem theo một thứ gì: xoá ở một tầng sau chỉ để lại số byte ở dưới cộng một dấu whiteout, nên nó làm ảnh to hơn một chút chứ không nhỏ đi. Phương án 2 mô tả một tính chất có thật (tầng giống hệt nhau chỉ lưu một lần) nhưng không áp được ở đây, vì tầng chứa bộ công cụ chỉ có trong một stage. Phương án 3 và 4 đều bịa ra một bước tự động mà Docker không làm.',
          ),
        }),

        // q28 · đáp án 3
        mcq({
          prompt: B(
            'A Node service is moved from <code>node:22-slim</code> to <code>node:22-alpine</code> to save space. The build is green, the push is green, the deploy is green — then the container restarts forever:' + code(
              'Error: Query engine library for current platform "linux-musl-openssl-3.0.x"\n' +
              '       could not be found.\n' +
              '       Files in query engine directory:\n' +
              '         libquery_engine-debian-openssl-3.0.x.so.node',
            ) + '<p>What happened?</p>',
            'Một dịch vụ Node được đổi từ <code>node:22-slim</code> sang <code>node:22-alpine</code> cho nhẹ. Dựng xanh, đẩy xanh, deploy xanh — rồi container restart vô tận:' + code(
              'Error: Query engine library for current platform "linux-musl-openssl-3.0.x"\n' +
              '       could not be found.\n' +
              '       Files in query engine directory:\n' +
              '         libquery_engine-debian-openssl-3.0.x.so.node',
            ) + '<p>Chuyện gì đã xảy ra?</p>',
          ),
          options: [
            B(
              'Alpine images ship no Node runtime, only the package manager, so the native module had nothing to bind to at load time',
              'Ảnh Alpine không kèm môi trường chạy Node, chỉ có trình quản lý gói, nên mô-đun native không có gì để gắn vào lúc nạp',
            ),
            B(
              'The <code>-alpine</code> tag is published only for arm64, so the amd64 server pulled an image built for another architecture',
              'Tag <code>-alpine</code> chỉ được phát hành cho arm64, nên máy chủ amd64 đã kéo về một ảnh dựng cho kiến trúc khác',
            ),
            B(
              'Alpine blocks loading unsigned native modules by default, and the engine binary has to be added to an allow-list before it will load',
              'Alpine mặc định chặn việc nạp mô-đun native chưa ký, và tệp engine phải được thêm vào danh sách cho phép thì mới nạp được',
            ),
            B(
              'Alpine uses musl libc while Debian-based images use glibc; a prebuilt binary compiled for one cannot load on the other, which is why a green build does not mean a runnable image',
              'Alpine dùng musl libc còn các ảnh nền Debian dùng glibc; một tệp nhị phân dựng sẵn cho bên này không nạp được ở bên kia, và đó là lý do build xanh không có nghĩa là ảnh chạy được',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both libraries implement the same standard and they are not binary-compatible. The install step succeeded because npm found <em>a</em> prebuild, and nothing checks that it matches the base image\'s C library — the mismatch only surfaces when the process tries to <code>dlopen</code> it, on the server, after three green gates. This exact failure cost this project seven minutes of 502s when a deploy script built with the default <code>Dockerfile</code> instead of the <code>Dockerfile.backend</code> that Compose uses. The fix is two-part: declare the target explicitly (' + c('binaryTargets = ["native", "linux-musl-openssl-3.0.x"]') + ' for Prisma) and add one smoke run before the push — ' + c('docker run --rm img node -e \'require("@prisma/client")\'') + ' — which converts an outage into a failed build. The same shape hits Python wheels, <code>sharp</code> and <code>bcrypt</code>; when in doubt, <code>-slim</code> costs about 120MB and removes the whole class of problem. Options 1 and 3 invent Alpine behaviour. Option 2 describes ' + c('exec format error') + ', a different message entirely.',
            'Hai thư viện cùng hiện thực một chuẩn nhưng KHÔNG tương thích nhị phân. Bước cài thành công vì npm tìm thấy MỘT bản dựng sẵn, và chẳng có gì kiểm rằng nó khớp với thư viện C của ảnh nền — chỗ lệch chỉ lộ ra khi tiến trình cố <code>dlopen</code> nó, trên máy chủ, sau ba cái cổng đều xanh. Đúng cú hỏng này đã khiến dự án này mất bảy phút trả 502 khi một script deploy dựng bằng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> mà Compose dùng. Cách chữa gồm hai phần: khai báo đích tường minh (' + c('binaryTargets = ["native", "linux-musl-openssl-3.0.x"]') + ' với Prisma) và thêm một lượt chạy chốt kiểm trước khi đẩy — ' + c('docker run --rm img node -e \'require("@prisma/client")\'') + ' — thứ biến một sự cố thành một bản dựng đỏ. Cùng hình dạng đó đánh vào wheel của Python, <code>sharp</code> và <code>bcrypt</code>; lúc phân vân thì <code>-slim</code> tốn khoảng 120MB và gỡ bỏ cả lớp vấn đề này. Phương án 1 và 3 bịa hành vi của Alpine. Phương án 2 mô tả lỗi ' + c('exec format error') + ', một thông báo hoàn toàn khác.',
          ),
        }),

        // q29 · đáp án 1
        mcq({
          prompt: B(
            'Two containers were inspected with <code>capsh --print</code>. What does the second line tell you?' + code(
              '$ docker run --rm alpine ... capsh --print | head -1\n' +
              'Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,\n' +
              'cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,\n' +
              'cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep\n' +
              '\n' +
              '$ docker run --rm --cap-drop=ALL alpine ... capsh --print | head -1\n' +
              'Current: =',
            ),
            'Hai container được soi bằng <code>capsh --print</code>. Dòng thứ hai nói lên điều gì?' + code(
              '$ docker run --rm alpine ... capsh --print | head -1\n' +
              'Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,\n' +
              'cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,\n' +
              'cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap=ep\n' +
              '\n' +
              '$ docker run --rm --cap-drop=ALL alpine ... capsh --print | head -1\n' +
              'Current: =',
            ),
          ),
          options: [
            B(
              'The container now runs as an unprivileged user, because dropping all capabilities implies switching away from UID 0',
              'Container giờ chạy dưới một người dùng không đặc quyền, vì bỏ hết capability đồng nghĩa với việc rời khỏi UID 0',
            ),
            B(
              'The container holds no Linux capabilities at all — and since most web applications need none, <code>--cap-drop=ALL</code> is a sensible starting point you add back from',
              'Container không giữ một capability Linux nào — và vì phần lớn ứng dụng web chẳng cần cái nào, <code>--cap-drop=ALL</code> là điểm khởi đầu hợp lý để từ đó thêm lại',
            ),
            B(
              'Capability reporting is disabled inside the container, so the empty list means the information is hidden rather than absent',
              'Việc báo cáo capability bị tắt bên trong container, nên danh sách rỗng nghĩa là thông tin bị giấu đi chứ không phải không có',
            ),
            B(
              'All capabilities were moved to the inheritable set, so they are unavailable to this process but still granted to anything it spawns',
              'Mọi capability đã được chuyển sang tập kế thừa, nên tiến trình này không dùng được nhưng mọi thứ nó sinh ra thì vẫn được cấp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two useful facts sit in that output. First, the default is already restrictive: of Linux\'s roughly forty capabilities a container gets fourteen, which is a large part of why a container is safer than running as root on the host. Second, <code>--cap-drop=ALL</code> really does leave nothing — and most application containers keep working, because opening a socket above 1024 and reading files you own needs no capability at all. Start there and add back only what breaks; the one you may genuinely need is <code>CAP_NET_BIND_SERVICE</code> for a port below 1024, and publishing a high port instead is usually better. Note the two flags that undo all of this in one move: <code>--privileged</code>, and mounting <code>/var/run/docker.sock</code>. Option 1 confuses capabilities with the user — the process is still UID 0, just powerless. Option 3 invents a reporting switch. Option 4 misreads capability sets; children inherit less, never more.',
            'Có hai sự thật hữu ích nằm trong đoạn kết quả đó. Một, mức mặc định đã khá chặt: trong khoảng bốn mươi capability của Linux thì container được mười bốn, và đó là một phần lớn lý do container an toàn hơn việc chạy root thẳng trên máy chủ. Hai, <code>--cap-drop=ALL</code> thật sự không chừa lại gì — và phần lớn container ứng dụng vẫn chạy bình thường, vì mở một socket trên 1024 và đọc những file mình sở hữu thì chẳng cần capability nào. Hãy bắt đầu từ đó rồi chỉ thêm lại thứ nào hỏng; cái bạn có thể thật sự cần là <code>CAP_NET_BIND_SERVICE</code> cho một cổng dưới 1024, mà công bố một cổng cao thay vào đó thường lại tốt hơn. Chú ý hai cái cờ xoá sạch tất cả những thứ trên chỉ trong một nước: <code>--privileged</code>, và việc gắn <code>/var/run/docker.sock</code>. Phương án 1 lẫn capability với người dùng — tiến trình vẫn là UID 0, chỉ là bất lực. Phương án 3 bịa ra một công tắc báo cáo. Phương án 4 đọc nhầm các tập capability; tiến trình con kế thừa ít hơn, không bao giờ nhiều hơn.',
          ),
        }),

        // q30 · đáp án 2
        mcq({
          prompt: B(
            'Measured behaviour of <code>--read-only</code>:' + code(
              '$ docker run --rm --read-only alpine:3.20 sh -c \'touch /tmp/x\'\n' +
              'touch: /tmp/x: Read-only file system\n' +
              '\n' +
              '$ docker run --rm --read-only --tmpfs /tmp:rw,size=8m \\\n' +
              '    alpine:3.20 sh -c \'touch /tmp/x && echo writable\'\n' +
              'writable',
            ) + '<p>What is the practical value of running a service this way?</p>',
            'Hành vi đo được của <code>--read-only</code>:' + code(
              '$ docker run --rm --read-only alpine:3.20 sh -c \'touch /tmp/x\'\n' +
              'touch: /tmp/x: Read-only file system\n' +
              '\n' +
              '$ docker run --rm --read-only --tmpfs /tmp:rw,size=8m \\\n' +
              '    alpine:3.20 sh -c \'touch /tmp/x && echo writable\'\n' +
              'writable',
            ) + '<p>Chạy một dịch vụ theo kiểu này có giá trị thực tế gì?</p>',
          ),
          options: [
            B(
              'It shrinks the image, because a container with no writable layer does not need one allocated at start',
              'Nó làm ảnh nhỏ đi, vì một container không có tầng ghi được thì không cần cấp phát tầng đó lúc khởi động',
            ),
            B(
              'It guarantees the container cannot lose data on a crash, since every write now goes through memory and is flushed synchronously',
              'Nó bảo đảm container không mất dữ liệu khi sập, vì mọi phép ghi giờ đi qua bộ nhớ và được xả đồng bộ',
            ),
            B(
              'Most attacks need to write something — a web shell, a downloaded binary, a modified config — and a read-only root blocks all of it, at the cost of listing the few paths the app genuinely writes',
              'Phần lớn các cuộc tấn công đều cần ghi một thứ gì đó — một web shell, một tệp tải về, một cấu hình bị sửa — và một hệ thống file gốc chỉ-đọc chặn hết, đổi lại bạn phải liệt kê vài đường dẫn mà ứng dụng thật sự ghi vào',
            ),
            B(
              'It makes the container immutable, so a <code>docker restart</code> is guaranteed to reproduce the exact state the image describes',
              'Nó làm container thành bất biến, nên một lệnh <code>docker restart</code> chắc chắn tái tạo đúng trạng thái mà cái ảnh mô tả',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Along with a non-root <code>USER</code>, this is the cheapest real hardening Docker offers, and the transcript shows the whole mechanic: the root filesystem refuses writes, and you punch small <code>tmpfs</code> holes exactly where the process needs them. The cost is an exercise worth doing anyway — turn it on, read the errors, and grant precisely the paths that fail, which for a well-behaved service is usually <code>/tmp</code> and a pid or socket directory, and sometimes nothing at all once logs go to stdout. Use ' + c('docker diff') + ' on a normally-running container to find them. Anything that must <em>persist</em> is a volume, not a tmpfs — that distinction is the whole decision. Option 1 confuses the writable layer with image size. Option 2 inverts the tmpfs guarantee: memory-backed storage is gone on stop, by design. Option 4 describes a nice property that <code>--read-only</code> does not provide, since a volume or tmpfs still carries state.',
            'Cùng với một <code>USER</code> không phải root, đây là biện pháp gia cố thật sự rẻ nhất mà Docker có, và đoạn terminal cho thấy trọn vẹn cơ chế: hệ thống file gốc từ chối ghi, còn bạn đục vài lỗ <code>tmpfs</code> nhỏ đúng chỗ tiến trình cần. Cái giá là một bài tập vốn dĩ đáng làm — bật nó lên, đọc các lỗi, rồi cấp đúng những đường dẫn nào hỏng, mà với một dịch vụ ngoan thì thường là <code>/tmp</code> cùng một thư mục chứa pid hoặc socket, và đôi khi chẳng cần gì một khi log đã đi ra stdout. Dùng ' + c('docker diff') + ' trên một container đang chạy bình thường để tìm ra chúng. Thứ gì phải TỒN TẠI LÂU DÀI thì là volume chứ không phải tmpfs — chính khác biệt đó là toàn bộ quyết định. Phương án 1 lẫn tầng ghi được với kích thước ảnh. Phương án 2 đảo ngược bảo đảm của tmpfs: kho lưu dựa trên bộ nhớ thì mất khi dừng, theo đúng thiết kế. Phương án 4 mô tả một tính chất hay ho mà <code>--read-only</code> không cung cấp, vì một volume hay tmpfs vẫn mang theo trạng thái.',
          ),
        }),

        /* ── Chương 7 — dữ liệu: volume, bind mount, tmpfs (4 câu) ────────── */

        // q31 · đáp án 0
        mcq({
          prompt: B(
            'An EMPTY named volume was mounted over <code>/etc/nginx</code>, a directory the image already populates. This is what happened:' + code(
              '$ docker volume create demo-etc\n' +
              '$ docker run --rm -v demo-etc:/etc/nginx nginx:1.27-alpine ls /etc/nginx\n' +
              'conf.d  fastcgi.conf  fastcgi_params  mime.types\n' +
              '\n' +
              '$ docker run --rm -v demo-etc:/mnt alpine:3.20 ls /mnt\n' +
              'conf.d  fastcgi.conf  fastcgi_params  mime.types',
            ) + '<p>What rule does this demonstrate?</p>',
            'Một volume có tên còn RỖNG được gắn đè lên <code>/etc/nginx</code>, thư mục mà cái ảnh vốn đã có sẵn nội dung. Kết quả:' + code(
              '$ docker volume create demo-etc\n' +
              '$ docker run --rm -v demo-etc:/etc/nginx nginx:1.27-alpine ls /etc/nginx\n' +
              'conf.d  fastcgi.conf  fastcgi_params  mime.types\n' +
              '\n' +
              '$ docker run --rm -v demo-etc:/mnt alpine:3.20 ls /mnt\n' +
              'conf.d  fastcgi.conf  fastcgi_params  mime.types',
            ) + '<p>Nó minh hoạ luật nào?</p>',
          ),
          options: [
            B(
              'An empty volume mounted over a populated image directory receives a copy of the image\'s files, once, on first use — which is how a fresh postgres container initialises its data directory',
              'Một volume rỗng gắn đè lên một thư mục có sẵn nội dung trong ảnh sẽ được chép nội dung của ảnh vào, một lần, ở lần dùng đầu — và đó là cách một container postgres mới tinh khởi tạo thư mục dữ liệu của nó',
            ),
            B(
              'Docker resolves the mount lazily, so <code>ls</code> falls through to the image layers whenever the volume has no entry for a path',
              'Docker phân giải phép gắn theo kiểu lười, nên <code>ls</code> rơi xuống các tầng ảnh mỗi khi volume không có mục nào cho một đường dẫn',
            ),
            B(
              'Named volumes are read-through caches of the image, so the second container sees the nginx files because it re-read them from the nginx image',
              'Volume có tên là bộ đệm đọc-xuyên của cái ảnh, nên container thứ hai thấy các file nginx vì nó đọc lại chúng từ ảnh nginx',
            ),
            B(
              'The volume was not actually empty: <code>docker volume create</code> seeds a new volume from the image of the first container that will use it',
              'Volume đó thật ra không rỗng: <code>docker volume create</code> gieo sẵn nội dung cho volume mới từ ảnh của container đầu tiên sẽ dùng nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The second command is the proof: a completely unrelated Alpine container reads the same files, so they are genuinely <em>in the volume</em> now, not being resolved from the nginx image. This copy-on-first-use behaviour is what makes ' + c('-v pgdata:/var/lib/postgresql/data') + ' work on a brand-new volume — <code>initdb</code> runs, and its output lands in the volume rather than the doomed writable layer. It also has a sharp edge: it happens <b>once</b>. Fix a config file inside the image later and the volume still holds the old copy, and the new version never appears. That is why volumes are for data, and a config file belongs in the image or on a read-only bind mount. Options 2 and 3 both invent a fall-through mechanism; the mount fully replaces the path. Option 4 misattributes the copy to ' + c('docker volume create') + ', which creates an empty directory and nothing else.',
            'Câu lệnh thứ hai chính là bằng chứng: một container Alpine hoàn toàn không liên quan đọc được đúng những file đó, nghĩa là chúng thật sự ĐANG NẰM TRONG VOLUME chứ không phải được phân giải từ ảnh nginx. Hành vi chép-ở-lần-dùng-đầu này là thứ khiến ' + c('-v pgdata:/var/lib/postgresql/data') + ' chạy được trên một volume mới toanh — <code>initdb</code> chạy, và kết quả của nó rơi vào volume chứ không phải cái tầng ghi được đã cầm chắc số phận. Nó cũng có một cạnh sắc: chuyện đó xảy ra ĐÚNG MỘT LẦN. Về sau bạn sửa một file cấu hình bên trong ảnh thì volume vẫn ôm bản cũ, và bản mới không bao giờ xuất hiện. Đó là lý do volume dành cho DỮ LIỆU, còn một file cấu hình thì thuộc về cái ảnh hoặc một bind mount chỉ-đọc. Phương án 2 và 3 đều bịa ra một cơ chế rơi-xuyên; phép gắn thay thế hoàn toàn đường dẫn đó. Phương án 4 gán nhầm phép chép cho ' + c('docker volume create') + ', thứ chỉ tạo ra một thư mục rỗng và không làm gì khác.',
          ),
        }),

        // q32 · đáp án 3
        mcq({
          prompt: B(
            'The same image, mounted two different ways over the same populated directory. Measured:' + code(
              '$ docker run --rm -v demo-vol:/etc/nginx  nginx:1.27-alpine ls -a /etc/nginx\n' +
              'conf.d  fastcgi.conf  mime.types  nginx.conf  ...\n' +
              '\n' +
              '$ docker run --rm -v "$PWD/empty:/etc/nginx" nginx:1.27-alpine ls -a /etc/nginx\n' +
              '.  ..',
            ) + '<p>Your dev container keeps losing <code>node_modules</code> under a <code>- .:/app</code> bind mount. Which line fixes it, and why?</p>',
            'Cùng một ảnh, gắn theo hai cách khác nhau lên cùng một thư mục có sẵn nội dung. Đo được:' + code(
              '$ docker run --rm -v demo-vol:/etc/nginx  nginx:1.27-alpine ls -a /etc/nginx\n' +
              'conf.d  fastcgi.conf  mime.types  nginx.conf  ...\n' +
              '\n' +
              '$ docker run --rm -v "$PWD/empty:/etc/nginx" nginx:1.27-alpine ls -a /etc/nginx\n' +
              '.  ..',
            ) + '<p>Container dev của bạn cứ mất <code>node_modules</code> dưới một bind mount <code>- .:/app</code>. Dòng nào chữa được, và vì sao?</p>',
          ),
          options: [
            B(
              '<code>read_only: true</code> on the service, so the host copy cannot overwrite the image\'s directory during startup',
              '<code>read_only: true</code> trên dịch vụ, để bản trên máy chủ không ghi đè được thư mục của ảnh trong lúc khởi động',
            ),
            B(
              '<code>- ./node_modules:/app/node_modules</code>, binding the host copy in so both sides agree on one directory',
              '<code>- ./node_modules:/app/node_modules</code>, bind bản trên máy chủ vào để hai phía thống nhất một thư mục',
            ),
            B(
              'Nothing in Compose can fix it; the dependencies must be reinstalled inside the container on every start',
              'Không có gì trong Compose chữa được; phải cài lại thư viện bên trong container ở mỗi lần khởi động',
            ),
            B(
              '<code>- /app/node_modules</code> — an anonymous VOLUME mounted deeper than the bind, so it wins at that path and, being a volume, receives the image\'s copy on first use',
              '<code>- /app/node_modules</code> — một VOLUME vô danh gắn sâu hơn cái bind, nên nó thắng ở đường dẫn đó và, vì là volume, được chép bản của ảnh vào ở lần dùng đầu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The two measurements are the whole explanation. A <b>volume</b> over a populated directory copies the image\'s files in on first use; a <b>bind mount</b> never copies anything and the host side always wins — so ' + c('- .:/app') + ' replaces <code>/app</code> with your project directory, which has no <code>node_modules</code> (or worse, one built for macOS). Mounts are applied in order of path depth, so a second, deeper mount at <code>/app/node_modules</code> layers on top of the bind; because it is a volume rather than a bind, it inherits the image\'s copy. The same pattern applies to <code>.next/</code>, <code>target/</code>, <code>__pycache__/</code> and <code>vendor/</code>. Option 2 mounts the host\'s directory, which is empty or platform-wrong — the original problem. Option 1 would break the dev server, which needs to write. Option 3 gives up on a fix that is one line.',
            'Hai phép đo chính là toàn bộ lời giải thích. Một <b>VOLUME</b> đè lên thư mục có sẵn nội dung thì chép file của ảnh vào ở lần dùng đầu; một <b>BIND MOUNT</b> thì không bao giờ chép gì và phía máy chủ luôn thắng — nên ' + c('- .:/app') + ' thay <code>/app</code> bằng thư mục dự án của bạn, nơi không có <code>node_modules</code> (hoặc tệ hơn, có một cái dựng cho macOS). Các phép gắn được áp theo thứ tự độ sâu đường dẫn, nên một phép gắn thứ hai sâu hơn ở <code>/app/node_modules</code> nằm chồng lên cái bind; và vì nó là volume chứ không phải bind, nó thừa hưởng bản chép của ảnh. Cùng khuôn mẫu đó áp cho <code>.next/</code>, <code>target/</code>, <code>__pycache__/</code> và <code>vendor/</code>. Phương án 2 gắn thư mục của máy chủ vào, thứ vốn rỗng hoặc sai nền tảng — đúng cái vấn đề ban đầu. Phương án 1 sẽ làm hỏng máy chủ dev, vốn cần ghi. Phương án 3 bỏ cuộc trước một cách chữa dài đúng một dòng.',
          ),
        }),

        // q33 · đáp án 2
        mcq({
          prompt: B(
            'Real output from a tmpfs mount with a size cap:' + code(
              '$ docker run --rm --tmpfs /scratch:rw,size=8m alpine:3.20 \\\n' +
              '    sh -c \'dd if=/dev/zero of=/scratch/big bs=1M count=16\'\n' +
              'dd: error writing \'/scratch/big\': No space left on device\n' +
              '9+0 records in\n' +
              '8+0 records out',
            ) + '<p>Why should a tmpfs mount always be given a <code>size=</code>?</p>',
            'Kết quả thật của một phép gắn tmpfs có đặt trần dung lượng:' + code(
              '$ docker run --rm --tmpfs /scratch:rw,size=8m alpine:3.20 \\\n' +
              '    sh -c \'dd if=/dev/zero of=/scratch/big bs=1M count=16\'\n' +
              'dd: error writing \'/scratch/big\': No space left on device\n' +
              '9+0 records in\n' +
              '8+0 records out',
            ) + '<p>Vì sao một phép gắn tmpfs luôn nên được đặt <code>size=</code>?</p>',
          ),
          options: [
            B(
              'Docker refuses to create a tmpfs mount without one, so the flag is mandatory rather than advisory',
              'Docker từ chối tạo một phép gắn tmpfs nếu thiếu nó, nên cái cờ này là bắt buộc chứ không phải khuyến nghị',
            ),
            B(
              'The size determines how long the data survives after the container stops, and an unbounded mount is discarded immediately',
              'Kích thước quyết định dữ liệu sống được bao lâu sau khi container dừng, và một phép gắn không giới hạn thì bị vứt ngay lập tức',
            ),
            B(
              'A tmpfs spends the container\'s memory budget, so an uncapped one grows until the memory limit is hit and the OOM killer takes the main process instead — a cap turns that into an immediate ENOSPC',
              'Một tmpfs tiêu vào chính hạn mức bộ nhớ của container, nên nếu không có trần nó phình tới khi chạm hạn mức và bộ giết OOM lấy mất tiến trình chính — đặt trần biến chuyện đó thành một lỗi ENOSPC tức thì',
            ),
            B(
              'Without a cap the mount falls back to disk once it exceeds a threshold, which silently removes the guarantee that nothing sensitive is written to storage',
              'Không có trần thì phép gắn sẽ lùi xuống đĩa khi vượt một ngưỡng, và điều đó âm thầm xoá mất bảo đảm rằng không có gì nhạy cảm bị ghi xuống kho lưu',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A tmpfs is memory pretending to be a directory, and that memory is charged to the same cgroup as the process. So a container with ' + c('-m 512m') + ' and an uncapped tmpfs can be OOM-killed by <em>writing files</em> — and the kernel kills the main process, not the files, so what you see is exit 137 on a service that was doing nothing unusual. A cap converts that mystery into ' + c('No space left on device') + ' at the exact write that went too far, which is a diagnosis rather than a puzzle. Budget the two together: a 512MB container with a 256MB tmpfs really only has 256MB for the application. Option 1 is testable and false — the mount is created happily without a size. Option 2 confuses the cap with the lifetime; a tmpfs is gone on stop regardless. Option 4 invents a swap-to-disk fallback that would defeat the entire purpose of using tmpfs for secrets.',
            'Một tmpfs là bộ nhớ giả dạng một thư mục, và phần bộ nhớ đó bị tính vào đúng cái cgroup của tiến trình. Nên một container có ' + c('-m 512m') + ' cùng một tmpfs không trần hoàn toàn có thể bị OOM giết chỉ vì GHI FILE — và nhân giết tiến trình chính chứ không giết đám file, nên thứ bạn thấy là mã thoát 137 trên một dịch vụ chẳng làm gì bất thường. Đặt trần biến điều bí ẩn đó thành ' + c('No space left on device') + ' ngay tại phép ghi đi quá đà, tức là một chẩn đoán chứ không phải một câu đố. Hãy tính hai thứ cùng nhau: một container 512MB kèm tmpfs 256MB thật ra chỉ còn 256MB cho ứng dụng. Phương án 1 kiểm được và sai — phép gắn vẫn được tạo ngon lành khi thiếu size. Phương án 2 lẫn cái trần với vòng đời; tmpfs biến mất khi dừng bất kể thế nào. Phương án 4 bịa ra một cơ chế lùi-xuống-đĩa mà nếu có thì sẽ phá sạch lý do người ta dùng tmpfs cho bí mật.',
          ),
        }),

        // q34 · đáp án 1
        mcq({
          prompt: B(
            'A nightly job runs <code>tar</code> on the live PostgreSQL data volume. It always succeeds and the file size always looks right. What is the status of that backup?',
            'Một việc chạy hằng đêm chạy <code>tar</code> lên volume dữ liệu PostgreSQL đang sống. Nó luôn thành công và kích thước file lúc nào cũng trông đúng. Trạng thái của bản sao lưu đó là gì?',
          ),
          options: [
            B(
              'Valid — <code>tar</code> opens each file once and reads it atomically, so the archive is a consistent point-in-time copy',
              'Hợp lệ — <code>tar</code> mở mỗi file một lần và đọc nguyên tử, nên kho lưu là một bản chụp nhất quán tại một thời điểm',
            ),
            B(
              'Likely a torn snapshot: files were copied while the engine was writing them, so it may restore, may restore wrong, or may refuse to start — use <code>pg_dump</code> on a live database, or stop the engine first',
              'Nhiều khả năng là một ảnh chụp rách: file bị chép trong lúc engine đang ghi vào chúng, nên nó có thể khôi phục được, khôi phục sai, hoặc không chịu khởi động — hãy dùng <code>pg_dump</code> trên cơ sở dữ liệu đang sống, hoặc dừng engine trước',
            ),
            B(
              'Valid, because PostgreSQL is crash-safe: restoring the archive is equivalent to recovering from a power cut, which the WAL handles',
              'Hợp lệ, vì PostgreSQL an toàn khi sập: khôi phục kho lưu tương đương phục hồi sau một lần mất điện, thứ mà WAL xử lý được',
            ),
            B(
              'Valid only if the volume is mounted <code>:ro</code> in the backup container, which prevents the archive from being written inconsistently',
              'Chỉ hợp lệ nếu volume được gắn <code>:ro</code> trong container sao lưu, điều này ngăn kho lưu bị ghi ra một cách không nhất quán',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The dangerous part is that nothing about the failure is visible until you need it: the tar completes, the size is plausible, and the corruption only appears at restore time. You are copying files while the engine is rewriting them, so what you get is the on-disk state at no single point in time. Three answers are actually valid: a logical dump on a live database (' + c('docker exec -t db pg_dump ... --format=custom') + '), a file-level copy of a <em>stopped</em> engine, or an atomic filesystem snapshot. Whichever you choose, restore it into a scratch database once and count a table you recognise — two minutes that turn an assumption into a fact, because a backup you have never restored has an unknown status, not a good one. Option 3 half-remembers crash safety: the WAL protects a crash, not a copy taken across an unknown span of time. Option 4 mistakes protecting the <em>source</em> for making the copy consistent; <code>:ro</code> is a good habit and changes nothing here.',
            'Chỗ nguy hiểm là không có gì về cú hỏng ấy lộ ra cho tới lúc bạn cần đến nó: lệnh tar chạy xong, kích thước hợp lý, và sự hư hỏng chỉ hiện ra lúc khôi phục. Bạn đang chép file trong khi engine đang ghi lại chúng, nên thứ bạn nhận được là trạng thái trên đĩa của KHÔNG một thời điểm nào cả. Có ba đáp án thật sự hợp lệ: một bản xuất logic trên cơ sở dữ liệu đang sống (' + c('docker exec -t db pg_dump ... --format=custom') + '), một bản chép mức file của một engine ĐÃ DỪNG, hoặc một ảnh chụp nguyên tử ở tầng hệ thống file. Chọn cái nào cũng được, nhưng hãy khôi phục nó vào một cơ sở dữ liệu nháp một lần rồi đếm một cái bảng bạn nhận ra — hai phút biến một giả định thành một sự thật, vì một bản sao lưu chưa từng được khôi phục thì trạng thái của nó là KHÔNG BIẾT, chứ không phải là tốt. Phương án 3 nhớ nửa vời về tính an toàn khi sập: WAL bảo vệ trước một cú sập, không bảo vệ một bản chép trải qua một khoảng thời gian không xác định. Phương án 4 nhầm việc bảo vệ NGUỒN với việc làm bản chép nhất quán; <code>:ro</code> là thói quen tốt và ở đây không thay đổi gì.',
          ),
        }),

        /* ── Chương 8 — mạng (5 câu) ─────────────────────────────────────── */

        // q35 · đáp án 0
        mcq({
          prompt: B(
            'Real output from one machine. Why does the name resolve in the second case and not the first?' + code(
              '$ docker run -d --name a alpine:3.20 sleep 300\n' +
              '$ docker run --rm alpine:3.20 getent hosts a\n' +
              '(nothing)\n' +
              '\n' +
              '$ docker network create app-net\n' +
              '$ docker run -d --name b --network app-net alpine:3.20 sleep 300\n' +
              '$ docker run --rm --network app-net alpine:3.20 getent hosts b\n' +
              '172.19.0.2        b',
            ),
            'Kết quả thật trên một cái máy. Vì sao cái tên phân giải được ở ca thứ hai mà không phải ca thứ nhất?' + code(
              '$ docker run -d --name a alpine:3.20 sleep 300\n' +
              '$ docker run --rm alpine:3.20 getent hosts a\n' +
              '(không gì cả)\n' +
              '\n' +
              '$ docker network create app-net\n' +
              '$ docker run -d --name b --network app-net alpine:3.20 sleep 300\n' +
              '$ docker run --rm --network app-net alpine:3.20 getent hosts b\n' +
              '172.19.0.2        b',
            ),
          ),
          options: [
            B(
              'The first pair is on the DEFAULT bridge, which has no embedded DNS; a user-defined network runs a resolver at <code>127.0.0.11</code> that maps container names to current addresses',
              'Cặp đầu nằm trên bridge MẶC ĐỊNH, vốn không có DNS nhúng; một mạng tự tạo thì chạy một bộ phân giải ở <code>127.0.0.11</code> ánh xạ tên container sang địa chỉ hiện tại',
            ),
            B(
              'Container <code>a</code> published no port, and a name only becomes resolvable once at least one port is published',
              'Container <code>a</code> không công bố cổng nào, mà một cái tên chỉ phân giải được khi đã có ít nhất một cổng được công bố',
            ),
            B(
              'Container <code>a</code>\'s image has no <code>EXPOSE</code> instruction, so Docker has no port metadata to register a DNS entry against',
              'Ảnh của container <code>a</code> không có chỉ thị <code>EXPOSE</code>, nên Docker không có siêu dữ liệu cổng nào để đăng ký một bản ghi DNS',
            ),
            B(
              'Single-letter container names are reserved by the resolver; the second call worked because the network name provided a qualifying suffix',
              'Tên container một chữ cái bị bộ phân giải giữ chỗ; lời gọi thứ hai chạy được vì tên mạng đã cung cấp một hậu tố định danh',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the single most useful fact in the networking chapter, and it explains one of the most common reports: "it works in Compose and not with <code>docker run</code>". Compose creates a user-defined network for every project automatically; a bare ' + c('docker run') + ' puts you on the default bridge, where names have never resolved. On a user-defined bridge, ' + c('/etc/resolv.conf') + ' inside the container points at <code>127.0.0.11</code> — Docker\'s embedded resolver — which answers for container names and network aliases and forwards everything else upstream, so public DNS still works. It also re-resolves, so a restarted container with a new address is found without anyone updating a config. Create a network, always. Options 2 and 3 both tie DNS to publishing or <code>EXPOSE</code>; neither has anything to do with name resolution. Option 4 invents a reserved-name rule.',
            'Đây là sự thật hữu ích nhất của chương mạng, và nó giải thích một trong những lời than phổ biến nhất: "chạy trong Compose thì được, chạy bằng <code>docker run</code> thì không". Compose tự tạo một mạng tự tạo cho mỗi dự án; một lệnh ' + c('docker run') + ' trần thì đặt bạn lên bridge mặc định, nơi tên chưa bao giờ phân giải được. Trên một bridge tự tạo, ' + c('/etc/resolv.conf') + ' bên trong container trỏ tới <code>127.0.0.11</code> — bộ phân giải nhúng của Docker — thứ trả lời cho tên container và alias mạng, còn mọi thứ khác thì chuyển tiếp lên trên, nên DNS công cộng vẫn chạy. Nó cũng phân giải lại, nên một container khởi động lại với địa chỉ mới vẫn được tìm thấy mà không ai phải sửa cấu hình. Hãy luôn tạo một mạng. Phương án 2 và 3 đều buộc DNS vào việc công bố cổng hay <code>EXPOSE</code>; cả hai đều chẳng liên quan gì tới phân giải tên. Phương án 4 bịa ra một luật giữ chỗ tên.',
          ),
        }),

        // q36 · đáp án 3
        mcq({
          prompt: B(
            'An <code>nginx</code> container was started on a user-defined network with NO <code>-p</code> flag. Measured:' + code(
              '$ docker image inspect nginx:1.27-alpine --format \'{{json .Config.ExposedPorts}}\'\n' +
              '{"80/tcp":{}}\n' +
              '\n' +
              '$ curl --max-time 3 http://localhost:80/          # from the host\n' +
              '(no route)\n' +
              '\n' +
              '$ docker run --rm --network app-net alpine:3.20 wget -qO- http://web/ | head -1\n' +
              '<!DOCTYPE html>',
            ) + '<p>What does <code>EXPOSE</code> actually do?</p>',
            'Một container <code>nginx</code> được khởi chạy trên một mạng tự tạo mà KHÔNG có cờ <code>-p</code>. Đo được:' + code(
              '$ docker image inspect nginx:1.27-alpine --format \'{{json .Config.ExposedPorts}}\'\n' +
              '{"80/tcp":{}}\n' +
              '\n' +
              '$ curl --max-time 3 http://localhost:80/          # từ máy chủ\n' +
              '(không có đường tới)\n' +
              '\n' +
              '$ docker run --rm --network app-net alpine:3.20 wget -qO- http://web/ | head -1\n' +
              '<!DOCTYPE html>',
            ) + '<p><code>EXPOSE</code> thật ra làm gì?</p>',
          ),
          options: [
            B(
              'It opens the port on the host, but only for connections originating on the host itself, which is why the container-to-container call worked and <code>curl</code> did not',
              'Nó mở cổng trên máy chủ, nhưng chỉ cho những kết nối bắt nguồn từ chính máy chủ, và đó là lý do lời gọi giữa hai container chạy được còn <code>curl</code> thì không',
            ),
            B(
              'It makes the port reachable from other containers — without it, the second command would have been refused',
              'Nó làm cổng đó với tới được từ các container khác — nếu không có nó thì câu lệnh thứ hai đã bị từ chối',
            ),
            B(
              'It binds the container process to <code>0.0.0.0:80</code>, which is what allows a peer on the same network to connect at all',
              'Nó gắn tiến trình container vào <code>0.0.0.0:80</code>, và chính điều đó mới cho phép một container cùng mạng kết nối được',
            ),
            B(
              'Nothing but record metadata that the image listens on 80: only <code>-p</code> creates a host mapping, and container-to-container traffic never needed one',
              'Không gì ngoài ghi lại siêu dữ liệu rằng cái ảnh nghe ở cổng 80: chỉ <code>-p</code> mới tạo ánh xạ ra máy chủ, còn lưu lượng giữa các container thì chưa bao giờ cần tới nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two separate boundaries, and the transcript separates them cleanly. Publishing with <code>-p</code> is about the <b>host</b> boundary: it writes an iptables DNAT rule so traffic arriving on a host port is forwarded inside. Nothing was published here, so the host has no route — correct. Container-to-container traffic crosses no such boundary: they share a bridge, the port was never hidden from the network, and <code>wget</code> from a peer succeeds. <code>EXPOSE</code> contributed nothing to either result; it records a port in the image config so ' + c('docker run -P') + ' can pick random host ports and Compose can document intent. This is exactly the shape a backend service should have — reachable by the things that need it, invisible from outside the host. Option 2 is the most tempting and is disproved by the fact that <code>EXPOSE</code> is metadata: remove it and the second command still works. Options 1 and 3 attribute host routing and socket binding to an instruction that does neither.',
            'Hai ranh giới khác nhau, và đoạn terminal tách chúng ra rất gọn. Công bố bằng <code>-p</code> là chuyện của ranh giới với <b>MÁY CHỦ</b>: nó ghi một luật DNAT trong iptables để lưu lượng tới một cổng của máy chủ được chuyển vào trong. Ở đây không có gì được công bố, nên máy chủ không có đường tới — đúng như vậy. Lưu lượng giữa hai container thì không vượt qua ranh giới đó: chúng chung một cây cầu, cổng chưa từng bị giấu khỏi mạng, và lệnh <code>wget</code> từ một container cùng mạng thành công. <code>EXPOSE</code> chẳng đóng góp gì vào cả hai kết quả; nó ghi một cổng vào cấu hình ảnh để ' + c('docker run -P') + ' chọn được cổng ngẫu nhiên trên máy chủ và để Compose ghi lại ý định. Đây đúng là hình dạng mà một dịch vụ backend nên có — với tới được bởi những thứ cần nó, vô hình từ bên ngoài máy chủ. Phương án 2 hấp dẫn nhất và bị bác bởi chính việc <code>EXPOSE</code> chỉ là siêu dữ liệu: bỏ nó đi thì câu lệnh thứ hai vẫn chạy. Phương án 1 và 3 gán việc định tuyến ở máy chủ và việc gắn socket cho một chỉ thị không làm cả hai.',
          ),
        }),

        // q37 · đáp án 1
        mcq({
          prompt: B(
            'A VPS runs <code>ufw</code> with only 22, 80 and 443 allowed. A database container is started with <code>-p 5432:5432</code>. From a laptop somewhere else, <code>nc -zv &lt;server-ip&gt; 5432</code> succeeds. Why?',
            'Một VPS chạy <code>ufw</code> chỉ cho phép 22, 80 và 443. Một container cơ sở dữ liệu được khởi chạy với <code>-p 5432:5432</code>. Từ một laptop ở nơi khác, lệnh <code>nc -zv &lt;ip-máy-chủ&gt; 5432</code> thành công. Vì sao?',
          ),
          options: [
            B(
              'ufw only filters traffic addressed to the host itself, and traffic destined for a container is forwarded rather than delivered locally',
              'ufw chỉ lọc lưu lượng gửi tới chính máy chủ, còn lưu lượng nhắm tới một container thì được chuyển tiếp chứ không giao tại chỗ',
            ),
            B(
              'Docker writes DNAT rules into the nat table\'s PREROUTING chain, which is evaluated BEFORE the filter table where ufw\'s rules live — so ufw is never consulted at all',
              'Docker ghi luật DNAT vào chuỗi PREROUTING của bảng nat, và bảng đó được duyệt TRƯỚC bảng filter nơi luật của ufw nằm — nên ufw hoàn toàn không được hỏi tới',
            ),
            B(
              'The rule takes effect only after <code>ufw reload</code>, and starting a container does not trigger one, so the firewall is running a stale rule set',
              'Luật chỉ có hiệu lực sau <code>ufw reload</code>, mà khởi chạy một container thì không kích hoạt lệnh đó, nên tường lửa đang chạy một bộ luật cũ',
            ),
            B(
              'PostgreSQL binds to <code>0.0.0.0</code> inside the container, and a process listening on all interfaces is exempt from host firewall rules',
              'PostgreSQL gắn vào <code>0.0.0.0</code> bên trong container, và một tiến trình nghe trên mọi giao diện thì được miễn khỏi luật tường lửa của máy chủ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is not a bug; it is Docker doing exactly what you asked, through a mechanism that runs earlier in the packet path than your firewall. The consequence is that a published port is open <em>regardless of what</em> ' + c('ufw status') + ' <em>says</em>, and internet-wide scanners find an open 5432, 6379 or 27017 within hours. Three fixes, in order of preference: bind to loopback (' + c('-p 127.0.0.1:5432:5432') + ') and reach it through an SSH tunnel; do not publish at all and let the API reach the database by service name on a private network; or, if you must publish, write rules into <code>DOCKER-USER</code>, the one chain Docker guarantees not to overwrite. The two-second audit is ' + c('ss -lntp | grep docker-proxy') + ' — anything showing <code>0.0.0.0:</code> for a database or an admin UI is reachable from the internet. Options 1 and 4 invent exemptions. Option 3 blames staleness for a rule ordering that would still lose after any reload.',
            'Đây không phải một con bọ; đây là Docker làm đúng thứ bạn yêu cầu, qua một cơ chế nằm sớm hơn tường lửa của bạn trên đường đi của gói tin. Hệ quả là một cổng đã công bố thì MỞ, BẤT KỂ ' + c('ufw status') + ' NÓI GÌ, và các máy quét toàn Internet tìm ra một cổng 5432, 6379 hay 27017 đang mở chỉ trong vài giờ. Ba cách chữa, theo thứ tự ưu tiên: gắn vào loopback (' + c('-p 127.0.0.1:5432:5432') + ') rồi với tới qua một đường hầm SSH; đừng công bố gì cả và để API gọi cơ sở dữ liệu bằng tên dịch vụ trên một mạng riêng; hoặc nếu buộc phải công bố thì ghi luật vào <code>DOCKER-USER</code>, cái chuỗi duy nhất Docker bảo đảm không ghi đè. Phép rà hai giây là ' + c('ss -lntp | grep docker-proxy') + ' — thứ nào hiện <code>0.0.0.0:</code> cho một cơ sở dữ liệu hay một giao diện quản trị thì đang với tới được từ Internet. Phương án 1 và 4 bịa ra những trường hợp miễn trừ. Phương án 3 đổ cho luật cũ, trong khi thứ tự luật đó vẫn thua sau bất kỳ lần reload nào.',
          ),
        }),

        // q38 · đáp án 2
        mcq({
          prompt: B(
            'A service resolves correctly but every connection from a peer container is refused instantly. Measured:' + code(
              '$ docker run --rm --network app-net alpine:3.20 \\\n' +
              '    sh -c \'nc -z -w2 lb 8000 && echo open || echo refused\'\n' +
              'refused\n' +
              '\n' +
              '$ docker exec lb sh -c \'nc -z 127.0.0.1 8000 && echo "open from inside"\'\n' +
              'open from inside',
            ) + '<p>What is the cause?</p>',
            'Một dịch vụ phân giải tên đúng nhưng mọi kết nối từ container cùng mạng đều bị từ chối tức thì. Đo được:' + code(
              '$ docker run --rm --network app-net alpine:3.20 \\\n' +
              '    sh -c \'nc -z -w2 lb 8000 && echo open || echo refused\'\n' +
              'refused\n' +
              '\n' +
              '$ docker exec lb sh -c \'nc -z 127.0.0.1 8000 && echo "open from inside"\'\n' +
              'open from inside',
            ) + '<p>Nguyên nhân là gì?</p>',
          ),
          options: [
            B(
              'The two containers are on different networks, and Docker returned a cached DNS answer from an earlier attachment',
              'Hai container nằm trên hai mạng khác nhau, và Docker trả về một câu trả lời DNS cũ còn trong bộ đệm từ lần gắn trước',
            ),
            B(
              'Port 8000 is published to the host but not exposed to the container network, so peers must use the published host port instead',
              'Cổng 8000 được công bố ra máy chủ nhưng không mở cho mạng container, nên các container cùng mạng phải dùng cổng đã công bố trên máy chủ',
            ),
            B(
              'The service is bound to <code>127.0.0.1</code> inside its own network namespace, and loopback there is reachable only from that namespace — it must listen on <code>0.0.0.0</code>',
              'Dịch vụ đang gắn vào <code>127.0.0.1</code> bên trong network namespace của chính nó, và loopback ở đó chỉ với tới được từ chính namespace ấy — nó phải nghe trên <code>0.0.0.0</code>',
            ),
            B(
              'A firewall between the two containers is dropping the packets, which is why the connection fails rather than timing out',
              'Một tường lửa giữa hai container đang vứt các gói tin, và đó là lý do kết nối hỏng chứ không phải hết giờ chờ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The second command is the whole proof: the same port is open from inside the container and closed from outside it. Loopback inside a network namespace is <em>that namespace\'s own</em> loopback — reachable by the process itself and by nothing else, ever. Many frameworks default to <code>localhost</code> because that is the safe choice on a shared machine, and it is exactly wrong in a container where the namespace already provides the isolation. The fixes are per-framework and all the same idea: ' + c('app.listen(3000, "0.0.0.0")') + ' for Express, ' + c('--host 0.0.0.0') + ' for uvicorn and Vite, ' + c('HOSTNAME=0.0.0.0') + ' for Next.js, ' + c("listen_addresses='*'") + ' for Postgres. Then let the network boundary protect you: do not publish, and put the service on an internal network. Option 4 confuses the two failure modes — a dropped packet gives a <em>timeout</em>, while refused means something answered. Option 1 is ruled out by the name resolving. Option 2 misdescribes publishing, which only ever concerns the host.',
            'Câu lệnh thứ hai chính là toàn bộ bằng chứng: cùng một cổng, mở từ bên trong container và đóng từ bên ngoài. Loopback bên trong một network namespace là loopback CỦA CHÍNH NAMESPACE ĐÓ — chỉ tiến trình ấy với tới được, và không gì khác, không bao giờ. Nhiều framework mặc định dùng <code>localhost</code> vì đó là lựa chọn an toàn trên một cái máy dùng chung, và nó sai đúng chỗ khi ở trong container, nơi bản thân namespace đã lo phần cô lập. Cách chữa tuỳ framework nhưng cùng một ý: ' + c('app.listen(3000, "0.0.0.0")') + ' với Express, ' + c('--host 0.0.0.0') + ' với uvicorn và Vite, ' + c('HOSTNAME=0.0.0.0') + ' với Next.js, ' + c("listen_addresses='*'") + ' với Postgres. Rồi để ranh giới mạng bảo vệ bạn: đừng công bố cổng, và đặt dịch vụ lên một mạng nội bộ. Phương án 4 lẫn hai kiểu hỏng — một gói bị vứt thì cho TIMEOUT, còn refused nghĩa là đã có thứ gì trả lời. Phương án 1 bị loại vì cái tên vẫn phân giải được. Phương án 2 mô tả sai việc công bố cổng, thứ chỉ liên quan tới máy chủ.',
          ),
        }),

        // q39 · đáp án 0
        mcq({
          prompt: B(
            'While diagnosing, you get a <em>connection refused</em> from one service and a <em>timeout</em> from another. Why is that distinction worth hours?',
            'Trong lúc chẩn đoán, bạn nhận <em>connection refused</em> từ một dịch vụ và <em>timeout</em> từ một dịch vụ khác. Vì sao khác biệt đó đáng giá hàng giờ?',
          ),
          options: [
            B(
              'Refused is an answer — the packet arrived and something actively said no, so you have the right host and the wrong port or a dead process; timeout is silence, so a firewall dropped it or the address does not route',
              'Refused là một câu trả lời — gói tin đã tới nơi và có thứ gì chủ động nói không, nên bạn đúng máy chủ mà sai cổng hoặc tiến trình đã chết; timeout là im lặng, nên hoặc tường lửa đã vứt gói hoặc địa chỉ đó không có đường tới',
            ),
            B(
              'Refused means DNS returned no record, while timeout means DNS returned a record that no longer points at a running container',
              'Refused nghĩa là DNS không trả về bản ghi nào, còn timeout nghĩa là DNS trả về một bản ghi không còn trỏ tới container đang chạy',
            ),
            B(
              'Timeout means the port is open but the service is slow, so the fix is raising the client timeout rather than changing anything about the network',
              'Timeout nghĩa là cổng đang mở nhưng dịch vụ chậm, nên cách chữa là nâng thời gian chờ của phía gọi chứ không phải đổi gì về mạng',
            ),
            B(
              'They are the same condition reported differently depending on whether the client uses TCP or a higher-level HTTP library',
              'Chúng là cùng một tình trạng nhưng báo khác nhau tuỳ phía gọi dùng TCP hay một thư viện HTTP ở tầng cao hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Never treat them as the same symptom. <b>Refused</b> means a RST came back: the packet reached a host that is up, and nothing is listening on that port — so you are looking at a wrong port number, a service that has not started yet, or a process bound to loopback. <b>Timeout</b> means nothing came back at all: a firewall dropped it silently, you are talking to an address that does not route, or the two containers share no network. They send you to opposite halves of the problem. That distinction is step four of the four questions worth asking in order — is the process listening, is it on the right address, does the name resolve, does a packet get through — and each question eliminates a whole class of cause before you reach for <code>tcpdump</code>. Option 2 attributes both to DNS, which has already succeeded by the time you get either. Option 3 is a plausible-sounding way to hide a routing bug behind a bigger timeout. Option 4 would make the distinction useless, which is exactly why it is worth rejecting.',
            'Đừng bao giờ coi hai thứ đó là cùng một triệu chứng. <b>Refused</b> nghĩa là có một gói RST trả về: gói tin đã tới một máy đang sống, và không có gì nghe ở cổng đó — nên bạn đang nhìn một số cổng sai, một dịch vụ chưa khởi động, hoặc một tiến trình gắn vào loopback. <b>Timeout</b> nghĩa là chẳng có gì trả về cả: tường lửa đã vứt nó trong im lặng, bạn đang nói với một địa chỉ không có đường tới, hoặc hai container không chung mạng nào. Chúng đẩy bạn về hai nửa đối lập của vấn đề. Khác biệt đó là bước thứ tư trong bốn câu hỏi đáng hỏi theo thứ tự — tiến trình có nghe không, nghe ở đúng địa chỉ không, cái tên có phân giải được không, gói tin có đi lọt không — và mỗi câu hỏi loại bỏ nguyên một lớp nguyên nhân trước khi bạn phải với tới <code>tcpdump</code>. Phương án 2 quy cả hai về DNS, thứ vốn đã thành công xong xuôi trước khi bạn nhận được một trong hai lỗi đó. Phương án 3 là một cách nghe có lý để giấu một con bọ định tuyến sau một thời gian chờ dài hơn. Phương án 4 sẽ khiến khác biệt này thành vô dụng, và đó chính là lý do đáng bác bỏ nó.',
          ),
        }),

        /* ── Chương 9 — Docker Compose (4 câu) ───────────────────────────── */

        // q40 · đáp án 3
        mcq({
          prompt: B(
            'The same probe service was run twice against the same Postgres. Only the <code>depends_on</code> block differs. Real output:' + code(
              '# A                              # B\n' +
              'depends_on: [db]                 depends_on:\n' +
              '                                   db: { condition: service_healthy }\n' +
              '\n' +
              'Container db  Started            Container db  Started\n' +
              'A: ECONNREFUSED                  Container db  Healthy\n' +
              '                                 B: db reachable',
            ) + '<p>Why did A fail?</p>',
            'Cùng một dịch vụ thăm dò được chạy hai lần với cùng một Postgres. Chỉ khối <code>depends_on</code> khác nhau. Kết quả thật:' + code(
              '# A                              # B\n' +
              'depends_on: [db]                 depends_on:\n' +
              '                                   db: { condition: service_healthy }\n' +
              '\n' +
              'Container db  Started            Container db  Started\n' +
              'A: ECONNREFUSED                  Container db  Healthy\n' +
              '                                 B: db reachable',
            ) + '<p>Vì sao A hỏng?</p>',
          ),
          options: [
            B(
              'The list form of <code>depends_on</code> was removed in Compose v2, so A declared no dependency at all and the two services started in file order',
              'Dạng danh sách của <code>depends_on</code> đã bị bỏ trong Compose v2, nên A thật ra không khai báo phụ thuộc nào và hai dịch vụ khởi động theo thứ tự trong file',
            ),
            B(
              'A did not publish the database port, and <code>depends_on</code> only orders services whose ports are reachable from the host',
              'A không công bố cổng cơ sở dữ liệu, mà <code>depends_on</code> chỉ sắp thứ tự cho những dịch vụ có cổng với tới được từ máy chủ',
            ),
            B(
              'The <code>db</code> service needs <code>restart: always</code>; without it the first connection attempt was made against a container Compose had already given up on',
              'Dịch vụ <code>db</code> cần <code>restart: always</code>; không có nó thì lần thử kết nối đầu tiên nhắm vào một container mà Compose đã bỏ cuộc',
            ),
            B(
              'Plain <code>depends_on</code> orders the container STARTS, not readiness — Postgres takes seconds to accept connections, and only a healthcheck plus <code>condition: service_healthy</code> makes Compose wait for it',
              '<code>depends_on</code> trần chỉ sắp thứ tự KHỞI ĐỘNG container chứ không sắp mức sẵn sàng — Postgres mất vài giây mới nhận kết nối, và chỉ một healthcheck cộng <code>condition: service_healthy</code> mới khiến Compose chờ nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both runs are real, and the difference is visible in the progress lines: B printed <code>Healthy</code> before starting the dependent service, A did not. A container being "started" says nothing about the process inside — Postgres creates the data directory, runs <code>initdb</code> and restarts itself once, which takes two to eight seconds on a first run. The healthcheck turns "started" into "ready", and because it polls rather than sleeps, it returns as soon as the service genuinely is ready and keeps waiting when it is not. Note the second half of the lesson too: this fixes start-up only. A database restarting at 3am, a network blip or a failover will still break a connection pool on a service that has been up for days, so the application should retry with a capped exponential backoff regardless. Option 1 is false: the list form is current and does exactly what A shows. Options 2 and 3 tie the ordering to publishing and restart policy, neither of which participates.',
            'Cả hai lượt đều là thật, và khác biệt hiện ra ở các dòng tiến trình: B in <code>Healthy</code> trước khi khởi chạy dịch vụ phụ thuộc, A thì không. Việc một container "đã khởi động" chẳng nói gì về tiến trình bên trong — Postgres tạo thư mục dữ liệu, chạy <code>initdb</code> rồi tự khởi động lại một lần, mất hai tới tám giây ở lần chạy đầu. Healthcheck biến "đã khởi động" thành "đã sẵn sàng", và vì nó THĂM DÒ chứ không NGỦ, nó trả về ngay khi dịch vụ thật sự sẵn sàng và tiếp tục chờ khi chưa. Chú ý cả nửa sau của bài học: cách này chỉ chữa được lúc KHỞI ĐỘNG. Một cơ sở dữ liệu khởi động lại lúc 3 giờ sáng, một cú chớp mạng hay một lần chuyển dự phòng vẫn sẽ làm vỡ bể kết nối của một dịch vụ đã chạy nhiều ngày, nên ứng dụng vẫn phải tự thử lại với độ trễ tăng dần có trần. Phương án 1 sai: dạng danh sách vẫn hiện hành và làm đúng những gì A cho thấy. Phương án 2 và 3 buộc thứ tự khởi động vào việc công bố cổng và chính sách restart, mà cả hai đều không tham gia.',
          ),
        }),

        // q41 · đáp án 1
        mcq({
          prompt: B(
            'Measured on a project with one named volume:' + code(
              '$ docker compose down\n' +
              '$ docker run --rm -v proj_data:/d alpine:3.20 cat /d/f.txt\n' +
              'persisted\n' +
              '\n' +
              '$ docker compose down -v\n' +
              '$ docker volume ls -q | grep -c proj_data\n' +
              '0',
            ) + '<p>What is the practical difference between the two commands?</p>',
            'Đo trên một dự án có một volume có tên:' + code(
              '$ docker compose down\n' +
              '$ docker run --rm -v proj_data:/d alpine:3.20 cat /d/f.txt\n' +
              'persisted\n' +
              '\n' +
              '$ docker compose down -v\n' +
              '$ docker volume ls -q | grep -c proj_data\n' +
              '0',
            ) + '<p>Khác biệt thực tế giữa hai câu lệnh là gì?</p>',
          ),
          options: [
            B(
              '<code>-v</code> makes the output verbose, and the volume disappeared because the second <code>down</code> ran when no container was holding it',
              '<code>-v</code> làm kết quả chi tiết hơn, còn volume biến mất vì lệnh <code>down</code> thứ hai chạy lúc không container nào giữ nó',
            ),
            B(
              '<code>down</code> removes containers and networks but keeps named volumes; <code>-v</code> additionally deletes them — your database — with no confirmation and no undo',
              '<code>down</code> gỡ container và mạng nhưng giữ lại volume có tên; thêm <code>-v</code> thì xoá luôn chúng — tức cơ sở dữ liệu của bạn — không hỏi xác nhận và không hoàn tác được',
            ),
            B(
              '<code>down</code> stops containers without removing them and <code>-v</code> removes them, which is why the volume was released only in the second case',
              '<code>down</code> dừng container mà không gỡ, còn <code>-v</code> thì gỡ, và đó là lý do volume chỉ được giải phóng ở ca thứ hai',
            ),
            B(
              'They are identical for named volumes; <code>-v</code> only affects anonymous volumes, and <code>proj_data</code> disappeared because nothing referenced it',
              'Hai lệnh giống hệt nhau với volume có tên; <code>-v</code> chỉ tác động tới volume vô danh, còn <code>proj_data</code> biến mất vì không gì tham chiếu tới nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The first <code>cat</code> is the important line: after a plain <code>down</code>, the data is still there and a completely unrelated container can read it. That asymmetry saves you far more often than it hurts — the normal upgrade path is to remove and recreate containers, and your database has to survive that. But it means one character separates "restart the stack" from "the development database I spent an afternoon seeding is gone", with no prompt in between. Two habits protect you: never put <code>-v</code> in an alias or in a script that is not explicitly named something like <code>reset-dev-db</code>, and back up first on any machine with data worth keeping. If you only want the stack restarted, ' + c('docker compose restart') + ' or ' + c('docker compose up -d --force-recreate') + ' does what you meant and cannot delete anything. Option 1 confuses <code>-v</code> with a verbosity flag. Options 3 and 4 are both directly contradicted by the transcript.',
            'Dòng <code>cat</code> đầu tiên mới là dòng quan trọng: sau một lệnh <code>down</code> trần, dữ liệu vẫn còn đó và một container hoàn toàn không liên quan vẫn đọc được. Sự bất đối xứng đó cứu bạn nhiều hơn hại bạn rất nhiều — con đường nâng cấp bình thường là gỡ rồi dựng lại container, và cơ sở dữ liệu của bạn phải sống sót qua đó. Nhưng nó cũng có nghĩa là đúng một ký tự ngăn cách giữa "khởi động lại cả stack" và "cái cơ sở dữ liệu dev mà tôi ngồi cả buổi chiều gieo dữ liệu đã bay mất", không một lời hỏi ở giữa. Hai thói quen bảo vệ bạn: đừng bao giờ nhét <code>-v</code> vào một bí danh hay một script không được đặt tên rõ ràng kiểu <code>reset-dev-db</code>, và hãy sao lưu trước trên bất kỳ máy nào có dữ liệu đáng giữ. Nếu chỉ muốn khởi động lại stack thì ' + c('docker compose restart') + ' hoặc ' + c('docker compose up -d --force-recreate') + ' làm đúng ý bạn và không xoá được gì. Phương án 1 nhầm <code>-v</code> với một cờ tăng độ chi tiết. Phương án 3 và 4 đều bị chính đoạn terminal bác bỏ thẳng.',
          ),
        }),

        // q42 · đáp án 2
        mcq({
          prompt: B(
            'A service lists <code>env_file: [./api.env]</code>, and <code>api.env</code> contains <code>TAG=1.4.2</code>. The compose file then says <code>image: ghcr.io/me/api:${TAG}</code>. What does <code>docker compose config</code> show?',
            'Một dịch vụ khai <code>env_file: [./api.env]</code>, và <code>api.env</code> chứa <code>TAG=1.4.2</code>. File compose sau đó ghi <code>image: ghcr.io/me/api:${TAG}</code>. Lệnh <code>docker compose config</code> cho thấy gì?',
          ),
          options: [
            B(
              '<code>image: ghcr.io/me/api:1.4.2</code> — <code>env_file</code> values are loaded before interpolation so that a service can parameterise its own image tag',
              '<code>image: ghcr.io/me/api:1.4.2</code> — giá trị trong <code>env_file</code> được nạp trước khi nội suy để một dịch vụ tham số hoá được chính tag ảnh của nó',
            ),
            B(
              'An error, because a variable referenced in the YAML but supplied only by <code>env_file</code> is rejected at parse time',
              'Một lỗi, vì một biến được tham chiếu trong YAML mà chỉ do <code>env_file</code> cung cấp thì bị từ chối ngay lúc phân tích cú pháp',
            ),
            B(
              '<code>image: ghcr.io/me/api:</code> with a warning — <code>env_file</code> is read by the CONTAINER, and only the project <code>.env</code> or the shell feeds <code>${...}</code> in the YAML',
              '<code>image: ghcr.io/me/api:</code> kèm một cảnh báo — <code>env_file</code> do CONTAINER đọc, và chỉ file <code>.env</code> của dự án hoặc shell mới nuôi <code>${...}</code> trong YAML',
            ),
            B(
              '<code>image: ghcr.io/me/api:latest</code> — an unresolved variable falls back to the default tag rather than producing an empty reference',
              '<code>image: ghcr.io/me/api:latest</code> — một biến không phân giải được sẽ lùi về tag mặc định thay vì tạo ra một tham chiếu rỗng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'There are two completely different things called <code>.env</code> in Compose, and confusing them causes most "the variable is empty" reports. The <b>project <code>.env</code></b> sits next to the compose file, is read by Compose itself, and its values are substituted into <code>${...}</code> anywhere in the YAML. A service\'s <b>env_file</b> is read by the container and its values become environment variables inside it — they are never available for interpolation. The failure is quiet: Compose warns once and carries on, so you get an invalid image reference, or ' + c('ports: [":3000"]') + ' silently publishing on a random port. Two defences: run ' + c('docker compose config') + ' whenever a value is not what you expected, and write anything required as ' + c('${VAR:?set it in .env}') + ', which fails loudly at <code>up</code> with your own message instead of starting a container with an empty secret. Options 1 and 4 both invent resolution behaviour. Option 2 is close in spirit but wrong in fact — plain <code>${VAR}</code> warns rather than errors, and that silence is the whole problem.',
            'Trong Compose có HAI thứ hoàn toàn khác nhau cùng mang tên <code>.env</code>, và việc lẫn lộn chúng gây ra phần lớn những lời than "biến bị rỗng". File <b><code>.env</code> của dự án</b> nằm cạnh file compose, do chính Compose đọc, và giá trị của nó được thay vào <code>${...}</code> ở bất cứ đâu trong YAML. Còn <b>env_file</b> của một dịch vụ thì do CONTAINER đọc và giá trị của nó thành biến môi trường bên trong đó — chúng không bao giờ dùng được cho phép nội suy. Cú hỏng diễn ra rất êm: Compose cảnh báo một lần rồi đi tiếp, nên bạn nhận được một tham chiếu ảnh không hợp lệ, hoặc ' + c('ports: [":3000"]') + ' âm thầm công bố lên một cổng ngẫu nhiên. Hai lớp phòng vệ: chạy ' + c('docker compose config') + ' mỗi khi một giá trị không như bạn nghĩ, và viết mọi thứ bắt buộc thành ' + c('${VAR:?set it in .env}') + ', thứ sẽ hỏng to tiếng ngay ở lệnh <code>up</code> kèm đúng thông điệp của bạn thay vì khởi chạy một container với một bí mật rỗng. Phương án 1 và 4 đều bịa ra hành vi phân giải. Phương án 2 gần đúng về tinh thần nhưng sai về sự thật — một <code>${VAR}</code> trần thì cảnh báo chứ không báo lỗi, và chính sự im lặng đó mới là vấn đề.',
          ),
        }),

        // q43 · đáp án 3
        mcq({
          prompt: B(
            'A base file and an override were merged and inspected with <code>docker compose config</code>. Real result:' + code(
              '# base                          # override\n' +
              'environment:                    environment:\n' +
              '  NODE_ENV: production            NODE_ENV: development\n' +
              '  KEEP_ME: yes                  command: ["false"]\n' +
              'command: ["true"]               ports: ["4000:4000"]\n' +
              'ports: ["3000:3000"]\n' +
              '\n' +
              'merged: command ["false"] · KEEP_ME yes · NODE_ENV development\n' +
              '        ports published 3000 AND 4000',
            ) + '<p>Which set of rules does this show?</p>',
            'Một file nền và một file ghi đè được hợp nhất rồi soi bằng <code>docker compose config</code>. Kết quả thật:' + code(
              '# nền                           # ghi đè\n' +
              'environment:                    environment:\n' +
              '  NODE_ENV: production            NODE_ENV: development\n' +
              '  KEEP_ME: yes                  command: ["false"]\n' +
              'command: ["true"]               ports: ["4000:4000"]\n' +
              'ports: ["3000:3000"]\n' +
              '\n' +
              'hợp nhất: command ["false"] · KEEP_ME yes · NODE_ENV development\n' +
              '          ports công bố cả 3000 LẪN 4000',
            ) + '<p>Kết quả này cho thấy bộ luật nào?</p>',
          ),
          options: [
            B(
              'Everything in the later file replaces the same key in the earlier one, which is why only the override\'s values appear',
              'Mọi thứ trong file sau thay thế cùng khoá ở file trước, và đó là lý do chỉ giá trị của file ghi đè xuất hiện',
            ),
            B(
              'Everything is appended, and a map key that appears twice keeps both values in declaration order',
              'Mọi thứ đều được nối thêm, và một khoá map xuất hiện hai lần thì giữ cả hai giá trị theo thứ tự khai báo',
            ),
            B(
              'Compose validates the merge and rejects any key present in both files unless it is tagged <code>!override</code>',
              'Compose kiểm tra phép hợp nhất và từ chối mọi khoá có mặt ở cả hai file trừ khi nó được gắn thẻ <code>!override</code>',
            ),
            B(
              'Scalars are replaced, maps merge key by key, and sequences APPEND — which is why <code>KEEP_ME</code> survived and both ports ended up published',
              'Giá trị đơn thì bị thay thế, map thì hợp nhất theo từng khoá, còn dãy thì NỐI THÊM — và đó là lý do <code>KEEP_ME</code> sống sót còn cả hai cổng đều được công bố',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three different behaviours in one merge, which is why guessing is a bad strategy. <code>command</code> is a scalar-ish field and is replaced outright — there is no appending. <code>environment</code> is a map, so keys present in both take the later value while keys present in only one survive, which is exactly what lets an override change <code>NODE_ENV</code> without repeating every other variable. <code>ports</code> is a sequence and sequences concatenate, so you end up publishing both — occasionally what you want and often not. When appending is wrong, the escape hatches are ' + c('ports: !override ["127.0.0.1:3000:3000"]') + ' and ' + c('volumes: !reset []') + '. And when a merged file surprises you, do not reason about it: run ' + c('docker compose -f a.yaml -f b.yaml config') + ' and read what Compose actually produced. Option 1 would have dropped <code>KEEP_ME</code>. Option 2 would have produced two <code>NODE_ENV</code> entries, which a map cannot hold. Option 3 invents a validation step that would make overrides impossible.',
            'Ba hành vi khác nhau trong cùng một phép hợp nhất, và đó là lý do đoán mò là chiến lược tồi. <code>command</code> thuộc nhóm giá trị đơn nên bị thay thế thẳng — không có chuyện nối thêm. <code>environment</code> là một map, nên khoá có ở cả hai thì lấy giá trị của file sau còn khoá chỉ có ở một bên thì sống sót, và chính điều đó cho phép một file ghi đè đổi <code>NODE_ENV</code> mà không phải chép lại mọi biến khác. <code>ports</code> là một dãy, mà dãy thì nối vào nhau, nên bạn kết thúc bằng việc công bố cả hai — thỉnh thoảng đúng ý bạn và thường thì không. Khi nối thêm là sai, hai lối thoát là ' + c('ports: !override ["127.0.0.1:3000:3000"]') + ' và ' + c('volumes: !reset []') + '. Còn khi một file đã hợp nhất làm bạn bất ngờ thì đừng ngồi suy luận: hãy chạy ' + c('docker compose -f a.yaml -f b.yaml config') + ' và đọc thứ Compose thật sự tạo ra. Phương án 1 sẽ làm mất <code>KEEP_ME</code>. Phương án 2 sẽ tạo ra hai mục <code>NODE_ENV</code>, thứ mà một map không chứa nổi. Phương án 3 bịa ra một bước kiểm tra mà nếu có thì việc ghi đè trở thành bất khả.',
          ),
        }),

        /* ── Chương 10 — một stack thật (3 câu) ──────────────────────────── */

        // q44 · đáp án 0
        mcq({
          prompt: B(
            'In this stack, <code>nginx</code> is on the <code>public</code> network only and <code>db</code> is on a <code>private</code> network declared <code>internal: true</code>. Only <code>api</code> is on both. If the proxy is compromised, what can it do to the database?',
            'Trong stack này, <code>nginx</code> chỉ nằm trên mạng <code>public</code> còn <code>db</code> nằm trên mạng <code>private</code> khai báo <code>internal: true</code>. Chỉ <code>api</code> nằm trên cả hai. Nếu proxy bị chiếm, nó làm được gì với cơ sở dữ liệu?',
          ),
          options: [
            B(
              'Nothing — it has no interface on that network, so the name does not even resolve and there is no route to try',
              'Không gì cả — nó không có giao diện nào trên mạng đó, nên cái tên thậm chí không phân giải được và cũng chẳng có đường nào để thử',
            ),
            B(
              'Reach it, but only on port 5432, because an internal network still permits traffic to ports the target image declares with <code>EXPOSE</code>',
              'Với tới được, nhưng chỉ ở cổng 5432, vì một mạng nội bộ vẫn cho phép lưu lượng tới những cổng mà ảnh đích khai báo bằng <code>EXPOSE</code>',
            ),
            B(
              'Reach it through the <code>api</code> service automatically, because containers sharing a network with a common peer inherit routes to that peer\'s other networks',
              'Với tới được một cách tự động thông qua dịch vụ <code>api</code>, vì các container chung mạng với một container trung gian sẽ kế thừa đường tới các mạng khác của container đó',
            ),
            B(
              'Reach it only if the database publishes a port, and <code>internal: true</code> merely blocks outbound internet access rather than inbound container traffic',
              'Chỉ với tới được nếu cơ sở dữ liệu công bố một cổng, còn <code>internal: true</code> chỉ chặn truy cập Internet đi ra chứ không chặn lưu lượng container đi vào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the strongest structural decision available in a small deployment, and it costs one extra ' + c('docker network create') + '. A network is a real isolation boundary: <code>nginx</code> has no interface on <code>private</code>, so Docker\'s embedded resolver does not answer for <code>db</code> from inside it, and there is no route even if an attacker guesses an IP. Not "is blocked from" — cannot name, cannot reach. Two related decisions complete the shape: exactly one service publishes ports (the proxy), so there is no database port to forget about; and <code>internal: true</code> on the private network also removes the route <em>outward</em>, so a compromised database container cannot exfiltrate. Write the <code>networks:</code> lines before the services and read them as an access-control policy, because that is what they are. Option 3 invents transitive routing, which would defeat the entire design. Options 2 and 4 misread <code>EXPOSE</code> and <code>internal</code>.',
            'Đây là quyết định cấu trúc mạnh nhất mà một hệ thống triển khai nhỏ có được, và nó tốn thêm đúng một lệnh ' + c('docker network create') + '. Một mạng là một ranh giới cô lập THẬT: <code>nginx</code> không có giao diện nào trên <code>private</code>, nên bộ phân giải nhúng của Docker không trả lời cho <code>db</code> từ bên trong nó, và cũng chẳng có đường đi nào kể cả khi kẻ tấn công đoán trúng một địa chỉ IP. Không phải "bị chặn khỏi" — mà là không gọi nổi tên, không với tới được. Hai quyết định liên quan hoàn thiện hình dạng đó: đúng MỘT dịch vụ công bố cổng (cái proxy), nên chẳng có cổng cơ sở dữ liệu nào để mà quên; và <code>internal: true</code> trên mạng riêng còn gỡ luôn đường ĐI RA, nên một container cơ sở dữ liệu bị chiếm cũng không tuồn dữ liệu ra ngoài được. Hãy viết các dòng <code>networks:</code> TRƯỚC các dịch vụ và đọc chúng như một chính sách kiểm soát truy cập, vì bản chất chúng đúng là như vậy. Phương án 3 bịa ra định tuyến bắc cầu, thứ mà nếu có thì phá sạch cả thiết kế. Phương án 2 và 4 đọc nhầm <code>EXPOSE</code> và <code>internal</code>.',
          ),
        }),

        // q45 · đáp án 2
        mcq({
          prompt: B(
            'You change <code>POSTGRES_PASSWORD</code> in <code>.env</code> and redeploy onto the existing volume. The API now fails to authenticate. What happened, and what is the correct fix?',
            'Bạn đổi <code>POSTGRES_PASSWORD</code> trong <code>.env</code> rồi deploy lại lên volume đang có. Giờ API xác thực hỏng. Chuyện gì đã xảy ra, và cách chữa đúng là gì?',
          ),
          options: [
            B(
              'The API container cached the old value at startup; recreating just the API service with <code>up -d --force-recreate api</code> picks up the new one',
              'Container API đã lưu đệm giá trị cũ lúc khởi động; chỉ cần dựng lại riêng dịch vụ API bằng <code>up -d --force-recreate api</code> là nó lấy được giá trị mới',
            ),
            B(
              'The new password contains a character that needs escaping in a connection URL; percent-encoding it in <code>DATABASE_URL</code> resolves the mismatch',
              'Mật khẩu mới chứa một ký tự cần thoát trong URL kết nối; mã hoá phần trăm nó trong <code>DATABASE_URL</code> là hết lệch',
            ),
            B(
              '<code>POSTGRES_PASSWORD</code> is read only when the data directory is initialised — on an existing volume it is ignored entirely; fix it with <code>ALTER USER</code>, never with <code>down -v</code>',
              '<code>POSTGRES_PASSWORD</code> chỉ được đọc khi thư mục dữ liệu được khởi tạo — trên một volume đã có thì nó bị phớt lờ hoàn toàn; hãy chữa bằng <code>ALTER USER</code>, đừng bao giờ dùng <code>down -v</code>',
            ),
            B(
              'Compose caches environment variables between deploys in the project\'s state file; <code>docker compose config --no-interpolate</code> clears that cache',
              'Compose lưu đệm biến môi trường giữa các lượt deploy trong file trạng thái của dự án; lệnh <code>docker compose config --no-interpolate</code> xoá bộ đệm đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The official image reads <code>POSTGRES_PASSWORD</code>, <code>POSTGRES_USER</code> and <code>POSTGRES_DB</code> exactly once, during <code>initdb</code>, and runs everything in <code>/docker-entrypoint-initdb.d</code> on that same first start. On the second and every later start, all of it is skipped silently. So the database still holds the old password while your ' + c('DATABASE_URL') + ' carries the new one, and the obvious-looking fix — ' + c('docker compose down -v') + ' to "start fresh" — deletes the database. The actual fix is one statement: ' + c('docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD \'new\'"') + ', then update <code>.env</code> and recreate the API. The same one-time rule is why a new extension added to an init script never appears on an existing database; that belongs in a migration. Option 1 is a plausible-sounding non-fix that recreates the wrong side. Option 2 is a real problem in other situations and does not explain a password that was never applied. Option 4 invents a Compose cache.',
            'Ảnh chính thức đọc <code>POSTGRES_PASSWORD</code>, <code>POSTGRES_USER</code> và <code>POSTGRES_DB</code> đúng MỘT lần, trong lúc <code>initdb</code>, và chạy mọi thứ trong <code>/docker-entrypoint-initdb.d</code> cũng ngay lần khởi động đầu tiên đó. Từ lần thứ hai trở đi, tất cả bị bỏ qua trong im lặng. Nên cơ sở dữ liệu vẫn giữ mật khẩu cũ trong khi ' + c('DATABASE_URL') + ' của bạn mang mật khẩu mới, và cách chữa trông có vẻ hiển nhiên — ' + c('docker compose down -v') + ' để "làm lại từ đầu" — thì xoá mất cơ sở dữ liệu. Cách chữa thật là một câu lệnh: ' + c('docker compose exec db psql -U blog -c "ALTER USER blog PASSWORD \'new\'"') + ', rồi cập nhật <code>.env</code> và dựng lại API. Cũng cái luật một-lần đó là lý do một extension mới thêm vào script khởi tạo không bao giờ xuất hiện trên một cơ sở dữ liệu đã có; thứ đó thuộc về một migration. Phương án 1 là một cách chữa nghe hợp lý nhưng dựng lại nhầm phía. Phương án 2 là một vấn đề có thật trong hoàn cảnh khác và không giải thích được một mật khẩu chưa bao giờ được áp dụng. Phương án 4 bịa ra một bộ đệm của Compose.',
          ),
        }),

        // q46 · đáp án 1
        mcq({
          prompt: B(
            'A Next.js service is given <code>NEXT_PUBLIC_API_URL</code> under <code>environment:</code> and the container is restarted. The site still calls the old URL. Why?',
            'Một dịch vụ Next.js được đặt <code>NEXT_PUBLIC_API_URL</code> trong <code>environment:</code> rồi container được khởi động lại. Trang web vẫn gọi URL cũ. Vì sao?',
          ),
          options: [
            B(
              'The browser is serving a cached bundle; a hard refresh or a cache-busting query parameter makes the new value take effect',
              'Trình duyệt đang phục vụ một gói JS trong bộ đệm; một lần tải lại cứng hoặc một tham số truy vấn phá đệm là giá trị mới có hiệu lực',
            ),
            B(
              '<code>NEXT_PUBLIC_*</code> values are substituted into the JavaScript bundle at BUILD time, so they are string literals inside the image and a restart cannot change them — pass it as a build arg, or use a same-origin relative URL',
              'Giá trị <code>NEXT_PUBLIC_*</code> được thay vào gói JavaScript ngay lúc DỰNG, nên chúng là chuỗi hằng nằm bên trong cái ảnh và khởi động lại không đổi được — hãy truyền nó làm build arg, hoặc dùng một URL tương đối cùng origin',
            ),
            B(
              'Compose ignores <code>environment:</code> for any service that also declares a <code>build:</code> section, so the variable never reached the container at all',
              'Compose phớt lờ <code>environment:</code> với mọi dịch vụ có kèm khối <code>build:</code>, nên biến đó chưa bao giờ tới được container',
            ),
            B(
              'Runtime variables need the <code>NEXT_RUNTIME_</code> prefix; the <code>NEXT_PUBLIC_</code> prefix marks a variable as read-only after the first start',
              'Biến lúc chạy cần tiền tố <code>NEXT_RUNTIME_</code>; tiền tố <code>NEXT_PUBLIC_</code> đánh dấu một biến là chỉ-đọc sau lần khởi động đầu tiên',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Nothing is broken. The value was inlined into the JavaScript when ' + c('npm run build') + ' ran, and restarting a container cannot alter files inside an image — you can confirm it by grepping the built bundle for the old string. Two consequences follow. Operationally, a public build variable means one image per environment, and it must be passed as a build ' + c('arg') + ' plus an ' + c('ENV') + ' in the build stage; the better answer is usually a same-origin relative URL like ' + c("fetch('/api/posts')") + ', so nginx routes it and the same image runs everywhere. Security-wise, ' + c('NEXT_PUBLIC_*') + ' values are shipped to every visitor\'s browser, so a third-party key with that prefix is a published secret — which is exactly how a GIF picker in this project ended up falling back to a revoked public key and returning 403 for everyone. Option 1 is worth ruling out but does not explain a value that is not in the file at all. Options 3 and 4 invent Compose and Next.js rules.',
            'Không có gì hỏng cả. Giá trị đó đã được nhúng thẳng vào JavaScript lúc ' + c('npm run build') + ' chạy, và khởi động lại một container thì không sửa được file bên trong một cái ảnh — bạn xác nhận được bằng cách grep chuỗi cũ trong gói đã dựng. Hai hệ quả đi kèm. Về vận hành, một biến công khai lúc dựng nghĩa là mỗi môi trường một cái ảnh, và nó phải được truyền vào dưới dạng ' + c('arg') + ' lúc dựng cộng một ' + c('ENV') + ' trong stage dựng; câu trả lời tốt hơn thường là một URL tương đối cùng origin kiểu ' + c("fetch('/api/posts')") + ', để nginx định tuyến và cùng một cái ảnh chạy được ở mọi nơi. Về an toàn, giá trị ' + c('NEXT_PUBLIC_*') + ' được gửi tới trình duyệt của MỌI khách truy cập, nên một khoá của bên thứ ba mang tiền tố đó là một bí mật đã công bố — và đó đúng là cách một bộ chọn GIF trong dự án này rốt cuộc lùi về một khoá công khai đã bị thu hồi rồi trả 403 cho tất cả mọi người. Phương án 1 đáng loại trừ nhưng không giải thích được một giá trị vốn không hề có trong file. Phương án 3 và 4 bịa ra luật của Compose và của Next.js.',
          ),
        }),

        /* ── Chương 11 — chạy trên production (2 câu) ─────────────────────── */

        // q47 · đáp án 3
        mcq({
          prompt: B(
            'A worker container exits and this is the evidence. What happened, and what would change if the second field read <code>false</code>?' + code(
              '$ docker inspect worker --format \'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}\'\n' +
              'exit=137 oom=true\n' +
              '$ sudo dmesg -T | grep -i -m1 \'killed process\'\n' +
              'Memory cgroup out of memory: Killed process 9481 (node)',
            ),
            'Một container worker thoát và đây là bằng chứng. Chuyện gì đã xảy ra, và sẽ khác thế nào nếu trường thứ hai ghi <code>false</code>?' + code(
              '$ docker inspect worker --format \'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}\'\n' +
              'exit=137 oom=true\n' +
              '$ sudo dmesg -T | grep -i -m1 \'killed process\'\n' +
              'Memory cgroup out of memory: Killed process 9481 (node)',
            ),
          ),
          options: [
            B(
              '137 is an application exit code the worker chose; <code>OOMKilled</code> would be <code>false</code> if it had called <code>process.exit(0)</code> instead',
              '137 là mã thoát do chính worker chọn; <code>OOMKilled</code> sẽ là <code>false</code> nếu nó gọi <code>process.exit(0)</code> thay vào đó',
            ),
            B(
              '137 always means the memory limit, so <code>false</code> would indicate the inspect data was collected before the kernel finished recording the kill',
              '137 luôn nghĩa là trần bộ nhớ, nên <code>false</code> sẽ cho thấy dữ liệu inspect được thu thập trước khi nhân kịp ghi lại cú giết',
            ),
            B(
              '137 is a failed healthcheck after three retries; <code>false</code> would mean the healthcheck passed and something else stopped the container',
              '137 là một healthcheck hỏng sau ba lần thử; <code>false</code> sẽ nghĩa là healthcheck đã qua và có thứ khác dừng container',
            ),
            B(
              '137 is 128+9, so SIGKILL; <code>true</code> pins it on the container\'s own cgroup memory limit, while <code>false</code> would point at something else sending SIGKILL — a <code>docker kill</code>, or a <code>stop</code> that outlasted its grace period',
              '137 là 128+9, tức SIGKILL; <code>true</code> chốt nguyên nhân là chính trần bộ nhớ cgroup của container, còn <code>false</code> sẽ chỉ sang một thứ khác đã gửi SIGKILL — một lệnh <code>docker kill</code>, hoặc một lệnh <code>stop</code> hết thời gian ân hạn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Exit 137 on its own is ambiguous — it says the process was SIGKILLed and nothing about who did it. ' + c('.State.OOMKilled') + ' is the field that ends the argument, and <code>dmesg</code> confirms it and names the process. Both readings were reproduced on a real machine while writing this exam: a container with ' + c('-m 96m') + ' allocating buffers in a loop gave <code>exit=137 oom=true</code>, while a container that ignored SIGTERM and was killed after the stop grace period gave <code>exit=137 oom=false</code>. The follow-up matters as much as the diagnosis: a runtime that sizes itself from the host rather than the cgroup will OOM under load while its own logs show free heap, so check ' + c('NODE_OPTIONS=--max-old-space-size') + ' against the container limit. Option 1 confuses a signal-derived code with an application choice. Option 2 overclaims — 137 does not always mean OOM, which is the entire point of the boolean. Option 3 describes something Docker never does: an unhealthy container is not stopped.',
            'Riêng mã thoát 137 thì mập mờ — nó nói tiến trình bị SIGKILL và không nói ai đã làm. ' + c('.State.OOMKilled') + ' mới là trường chốt lại cuộc tranh luận, và <code>dmesg</code> xác nhận rồi gọi tên tiến trình. Cả hai cách đọc đều đã được tái hiện trên một máy thật trong lúc soạn đề này: một container có ' + c('-m 96m') + ' cấp phát buffer trong vòng lặp cho <code>exit=137 oom=true</code>, còn một container phớt lờ SIGTERM rồi bị giết sau thời gian ân hạn cho <code>exit=137 oom=false</code>. Bước tiếp theo cũng quan trọng ngang phần chẩn đoán: một môi trường chạy tự tính kích thước theo máy chủ thay vì theo cgroup sẽ chết OOM khi có tải trong khi log của chính nó vẫn báo heap còn trống, nên hãy đối chiếu ' + c('NODE_OPTIONS=--max-old-space-size') + ' với hạn mức của container. Phương án 1 lẫn một mã thoát suy ra từ tín hiệu với một lựa chọn của ứng dụng. Phương án 2 nói quá — 137 không phải lúc nào cũng là OOM, và đó chính là lý do tồn tại của cái boolean kia. Phương án 3 mô tả một việc Docker không bao giờ làm: một container không khoẻ thì không bị dừng.',
          ),
        }),

        // q48 · đáp án 0
        mcq({
          prompt: B(
            'A server is out of disk. <code>docker system df</code> reports little reclaimable, but this turns up:' + code(
              '$ sudo du -sh /var/lib/docker/containers/* | sort -rh | head -1\n' +
              '4.1G    /var/lib/docker/containers/9f2ac1...\n' +
              '$ docker inspect api --format \'{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}\'\n' +
              'json-file map[]',
            ) + '<p>What is true here?</p>',
            'Một máy chủ hết đĩa. <code>docker system df</code> báo rất ít chỗ lấy lại được, nhưng lại lòi ra thế này:' + code(
              '$ sudo du -sh /var/lib/docker/containers/* | sort -rh | head -1\n' +
              '4.1G    /var/lib/docker/containers/9f2ac1...\n' +
              '$ docker inspect api --format \'{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}\'\n' +
              'json-file map[]',
            ) + '<p>Điều nào đúng ở đây?</p>',
          ),
          options: [
            B(
              'Container log files are not images, layers or volumes, so they appear in none of <code>system df</code>\'s categories, and <code>map[]</code> means no rotation is configured — reclaim it with <code>truncate -s 0</code>, not <code>rm</code>',
              'File log của container không phải ảnh, tầng hay volume, nên chúng không nằm trong hạng mục nào của <code>system df</code>, và <code>map[]</code> nghĩa là chưa cấu hình xoay vòng — hãy lấy lại chỗ bằng <code>truncate -s 0</code>, không phải <code>rm</code>',
            ),
            B(
              'The <code>json-file</code> driver rotates at 100MB by default, so a 4.1GB file means the driver has crashed and the container must be recreated to restore logging',
              'Trình <code>json-file</code> mặc định xoay vòng ở mức 100MB, nên một file 4,1GB nghĩa là trình đó đã sập và phải dựng lại container mới khôi phục được việc ghi log',
            ),
            B(
              '<code>system df</code> only counts objects belonging to running containers, and this file belongs to a container that has since exited',
              '<code>system df</code> chỉ đếm những đối tượng thuộc về container đang chạy, mà file này thuộc về một container từ đó tới nay đã thoát',
            ),
            B(
              'Log files are stored inside the container\'s writable layer, so the fix is <code>docker container prune</code> to release the layer and the log together',
              'File log được lưu bên trong tầng ghi được của container, nên cách chữa là <code>docker container prune</code> để giải phóng cả tầng lẫn log cùng lúc',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two traps in one incident. First, a host can be genuinely out of disk while ' + c('docker system df') + ' reports plenty free, because container log files live under ' + c('/var/lib/docker/containers/') + ' and belong to none of its four categories. Second, <code>map[]</code> means no <code>max-size</code> was ever set, and the default <code>json-file</code> driver rotates nothing — that file grows until the disk is full, which on a single-disk VPS is the disk your database is on. The reclaim has to be ' + c('truncate -s 0') + ': the container still holds the file open, so ' + c('rm') + ' frees no blocks until the process exits and additionally breaks ' + c('docker logs') + ', which reads that exact path. Then set rotation in both places — ' + c('daemon.json') + ' protects every container anyone starts on the host, the compose <code>logging:</code> block documents the intent — and recreate the existing containers, because a daemon-level change applies only to containers created after the reload. Options 2, 3 and 4 each misplace either the rotation default, the accounting, or the file itself.',
            'Hai cái bẫy trong cùng một sự cố. Một, một máy chủ có thể hết đĩa thật trong khi ' + c('docker system df') + ' báo còn nhiều, vì file log của container nằm dưới ' + c('/var/lib/docker/containers/') + ' và không thuộc hạng mục nào trong bốn hạng mục của nó. Hai, <code>map[]</code> nghĩa là chưa từng đặt <code>max-size</code>, và trình <code>json-file</code> mặc định KHÔNG xoay vòng gì cả — file đó phình tới khi đĩa đầy, mà trên một VPS một đĩa thì đó chính là cái đĩa chứa cơ sở dữ liệu của bạn. Việc lấy lại chỗ bắt buộc phải là ' + c('truncate -s 0') + ': container vẫn đang giữ file mở, nên ' + c('rm') + ' không giải phóng khối nào cho tới khi tiến trình thoát, mà còn làm hỏng luôn ' + c('docker logs') + ', thứ đọc đúng đường dẫn đó. Sau đó hãy đặt xoay vòng ở cả hai nơi — ' + c('daemon.json') + ' bảo vệ mọi container bất kỳ ai khởi chạy trên máy đó, còn khối <code>logging:</code> trong compose ghi lại ý định — rồi dựng lại các container đang có, vì một thay đổi ở mức tiến trình nền chỉ áp cho container tạo ra SAU lần nạp lại. Phương án 2, 3 và 4 mỗi cái đều đặt sai chỗ hoặc mức mặc định của xoay vòng, hoặc cách tính toán, hoặc chính vị trí của cái file.',
          ),
        }),

        /* ── Chương 12 — chẩn đoán container (2 câu) ─────────────────────── */

        // q49 · đáp án 2
        mcq({
          prompt: B(
            'Triage on a container that will not run. Which layer is broken, and where is the real message?' + code(
              '$ docker ps -a --format \'table {{.Names}}\\t{{.Status}}\'\n' +
              'NAMES   STATUS\n' +
              'job     Created\n' +
              '$ docker logs job\n' +
              '$',
            ),
            'Phân loại nhanh một container không chạy được. Tầng nào đang hỏng, và thông báo thật nằm ở đâu?' + code(
              '$ docker ps -a --format \'table {{.Names}}\\t{{.Status}}\'\n' +
              'NAMES   STATUS\n' +
              'job     Created\n' +
              '$ docker logs job\n' +
              '$',
            ),
          ),
          options: [
            B(
              'Layer 3, the process: the application crashed during initialisation before it could flush anything to stdout',
              'Tầng 3, tiến trình: ứng dụng sập trong lúc khởi tạo trước khi kịp xả gì ra stdout',
            ),
            B(
              'Layer 4, the environment: a dependency is unreachable, and the container is waiting rather than failing',
              'Tầng 4, môi trường: một phụ thuộc không với tới được, và container đang chờ chứ không phải hỏng',
            ),
            B(
              'Layer 1 or 2 — the image or the container configuration; your code never ran, so the real message went to the CLI\'s stderr at creation time, not into the logs',
              'Tầng 1 hoặc 2 — cái ảnh hoặc cấu hình container; mã của bạn chưa từng chạy, nên thông báo thật đã đi ra stderr của CLI lúc tạo container chứ không vào log',
            ),
            B(
              'The logging driver: <code>Created</code> is a normal running state, and empty logs mean the driver failed to attach to the container\'s streams',
              'Trình ghi log: <code>Created</code> là một trạng thái chạy bình thường, và log rỗng nghĩa là trình đó gắn không được vào các luồng của container',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The single most useful triage habit is running ' + c('docker ps -a') + ' before ' + c('docker logs') + ', because the <code>STATUS</code> column separates three completely different situations before you read a line: <code>Created</code> means no process has ever run, <code>Exited (1)</code> means your code ran and failed, and <code>Restarting</code> means a loop. Empty logs on a <code>Created</code> container are correct output, not a broken driver — the failure happened at layer 1 (the image: not found, wrong architecture) or layer 2 (the configuration: a command that is not executable, a bad mount, a name conflict), and the daemon reported it on stderr when you typed the command. The exit codes narrow it further: 125 is Docker itself, 126 is found-but-not-executable, 127 is not found. Options 1 and 2 both put the fault inside a process that never started. Option 4 mislabels <code>Created</code> as a running state and blames a driver that is working exactly as designed.',
            'Thói quen phân loại hữu ích nhất là chạy ' + c('docker ps -a') + ' TRƯỚC ' + c('docker logs') + ', vì cột <code>STATUS</code> tách được ba tình huống hoàn toàn khác nhau trước khi bạn đọc một dòng nào: <code>Created</code> nghĩa là chưa tiến trình nào từng chạy, <code>Exited (1)</code> nghĩa là mã của bạn đã chạy rồi hỏng, còn <code>Restarting</code> nghĩa là một vòng lặp. Log rỗng trên một container <code>Created</code> là kết quả ĐÚNG chứ không phải một trình ghi log hỏng — cú hỏng nằm ở tầng 1 (cái ảnh: không tìm thấy, sai kiến trúc) hoặc tầng 2 (cấu hình: một câu lệnh không thực thi được, một phép gắn sai, một cái tên trùng), và tiến trình nền đã báo nó ra stderr ngay lúc bạn gõ câu lệnh. Các mã thoát thu hẹp thêm: 125 là chính Docker, 126 là tìm thấy nhưng không chạy được, 127 là không tìm thấy. Phương án 1 và 2 đều đặt lỗi vào bên trong một tiến trình chưa từng khởi động. Phương án 4 gán nhầm <code>Created</code> thành trạng thái đang chạy và đổ lỗi cho một trình ghi log đang làm việc đúng như thiết kế.',
          ),
        }),

        // q50 · đáp án 1
        mcq({
          prompt: B(
            'What does a successful <code>docker build</code> prove about the resulting image?',
            'Một lệnh <code>docker build</code> thành công chứng minh điều gì về cái ảnh sinh ra?',
          ),
          options: [
            B(
              'That the image will start and serve traffic, since every instruction that could fail has already been executed inside a real container',
              'Rằng cái ảnh sẽ khởi động và phục vụ được, vì mọi chỉ thị có thể hỏng đều đã được thực thi bên trong một container thật',
            ),
            B(
              'Only that the instructions ran without error — architecture, libc compatibility and whether the process starts at all are unverified, so add one <code>docker run</code> smoke check before pushing',
              'Chỉ rằng các chỉ thị đã chạy mà không lỗi — kiến trúc, tương thích libc và việc tiến trình có khởi động nổi hay không đều CHƯA được kiểm, nên hãy thêm một lệnh <code>docker run</code> chốt kiểm trước khi đẩy',
            ),
            B(
              'That the image matches the deployment target\'s architecture, because BuildKit refuses to export a platform the local daemon cannot execute',
              'Rằng cái ảnh khớp kiến trúc của đích triển khai, vì BuildKit từ chối xuất ra một nền tảng mà tiến trình nền cục bộ không chạy được',
            ),
            B(
              'That its dependencies are compatible with the base image, since the package manager resolved and installed them against that exact base',
              'Rằng các phụ thuộc của nó tương thích với ảnh nền, vì trình quản lý gói đã phân giải và cài chúng dựa trên đúng ảnh nền đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the closing rule of the whole course, and every failure in it that reached production shares the shape: green at build, green at push, green at swap, broken in production. A glibc engine in a musl image. An arm64 image on an x86 server. A frontend built without a public variable. A stale <code>dist/</code> that never mounted a router. In every case the build system did its only job — verifying that the instructions ran — and nothing checked that the result starts. The defence is cheap and mechanical: one ' + c('docker run') + ' against the image you just built, executing the smallest thing that would fail if something were wrong (load the database client, print the version, hit <code>/health</code>), plus a smoke test after the deploy that curls one route per feature module and fails on 404. Ten seconds in the pipeline, and it converts an outage into a failed build. Option 4 is the most tempting because the install <em>did</em> run on that base — but npm downloading a prebuilt binary is not the same as that binary loading. Options 1 and 3 assume verification steps Docker does not perform.',
            'Đây là luật kết của cả khoá học, và mọi cú hỏng trong khoá từng lọt lên production đều mang cùng hình dạng: xanh lúc dựng, xanh lúc đẩy, xanh lúc tráo, hỏng trên production. Một engine glibc trong ảnh musl. Một ảnh arm64 trên máy chủ x86. Một frontend dựng thiếu biến công khai. Một thư mục <code>dist/</code> cũ chưa bao giờ gắn được router. Ở mọi trường hợp, hệ thống dựng đã làm đúng việc duy nhất của nó — xác nhận các chỉ thị đã chạy — và chẳng có gì kiểm rằng kết quả khởi động được. Cách phòng vệ thì rẻ và máy móc: một lệnh ' + c('docker run') + ' lên chính cái ảnh vừa dựng, thực thi thứ nhỏ nhất mà sẽ hỏng nếu có gì sai (nạp client cơ sở dữ liệu, in phiên bản, gọi <code>/health</code>), cộng một lượt chốt kiểm sau deploy curl một tuyến cho mỗi module tính năng và đỏ nếu gặp 404. Mười giây trong đường ống, và nó biến một sự cố thành một bản dựng đỏ. Phương án 4 hấp dẫn nhất vì lượt cài ĐÚNG LÀ đã chạy trên ảnh nền đó — nhưng npm tải về một tệp nhị phân dựng sẵn không đồng nghĩa với việc tệp đó NẠP ĐƯỢC. Phương án 1 và 3 giả định những bước kiểm chứng mà Docker không thực hiện.',
          ),
        }),
      ],
    },
  ],
};
