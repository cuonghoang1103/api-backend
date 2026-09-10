/**
 * Docker — Progress Test 1 (chương s00–s04).
 *
 * Đề tự soạn, bám sát `content/courses/docker/s00…s04`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI đoạn terminal trong đề đều CHẠY THẬT trên máy này, ngày 10/09/2026:
 *   Docker Engine 29.5.3 (client + server), API 1.54, Docker Desktop 4.78.0
 *   (229452), containerd v2.2.4, runc 1.3.5, BuildKit v0.30.0, buildx
 *   v0.34.1-desktop.1, Compose v5.1.4 — nền tảng linux/arm64 trong máy ảo của
 *   Desktop, máy chủ macOS 25.6.0 / Apple M1 Max, 32 GiB RAM, 10 nhân.
 *   Mã thoát, thông báo lỗi và số đo kích thước đều là nguyên văn máy in ra.
 *
 * ⚠️ SÁU CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (1.3, 4.3) nói `sh -c 'sleep 600'` trên Alpine cho PID 1 là
 *     `/bin/sh -c sleep 600`. ĐO THẬT: busybox ash **exec thẳng** khi chỉ còn
 *     đúng MỘT lệnh đơn, nên PID 1 là `sleep 600`. Dạng `/bin/sh -c …` chỉ
 *     hiện ra trên `ubuntu:24.04` (dash), hoặc khi có lệnh thứ hai phía sau.
 *     Câu 8 hỏi đúng cơ chế này thay vì chép lại đoạn output của giáo trình.
 *   • Giáo trình (4.1) nói không có `.dockerignore` thì `node_modules` được
 *     tải lên mỗi lượt dựng (61,44MB). ĐO THẬT trên BuildKit v0.30: với
 *     `COPY src ./src` chỉ **83 B** đi qua — BuildKit chỉ chuyển những đường
 *     dẫn mà COPY thật sự hỏi tới. Chỉ khi `COPY . .` thì 50,01MB mới đi
 *     (và nằm luôn trong ảnh: 114MB so với 13,6MB). Câu 24 ra theo số đo này.
 *   • Giáo trình (4.2) nói file ghi vào đường dẫn `VOLUME` ở một `RUN` sau đó
 *     sẽ bị vứt. ĐO THẬT: cả `file.txt` (ghi trước VOLUME) lẫn `after.txt`
 *     (ghi sau VOLUME) đều CÓ trong container — Docker chép nội dung thư mục
 *     của ảnh vào volume rỗng lúc gắn. Thứ đúng vẫn còn nguyên là rò volume
 *     vô danh (đo: 30 → 31 volume mỗi lượt run, và nó sống sót `docker rm`),
 *     nên đề chỉ dùng phần đó.
 *   • Giáo trình (2.4) nói file do container ghi qua bind mount thuộc về root
 *     trên máy chủ. ĐO THẬT trên Docker Desktop macOS: file hiện ra thuộc về
 *     **người dùng máy chủ (uid 501)** dù trong container là root — lớp chia
 *     sẻ file của Desktop ánh xạ lại quyền sở hữu. Đó là chuyện của Linux
 *     trần, nên đề KHÔNG ra câu nào dựa vào nó.
 *   • Giáo trình (3.4) nói `docker buildx build --platform a,b --load` hỏng
 *     với `docker exporter does not currently support exporting manifest
 *     lists`. ĐO THẬT: lệnh chạy XONG, không lỗi, và chỉ để lại ảnh nền tảng
 *     của máy chủ trong kho cục bộ. Đề không hỏi về `--load` nữa; câu 22 hỏi
 *     phần vẫn đúng là mô phỏng qua QEMU.
 *   • Giáo trình (0.2) nói `docker-compose` (gạch nối) là bản v1 viết bằng
 *     Python và khác hẳn `docker compose`. ĐO THẬT: cả hai đều in
 *     `Docker Compose version v5.1.4` — gạch nối bây giờ chỉ là lớp đệm gọi
 *     v2. Đề không có câu nào dựa vào cái bẫy đó.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 8 · B 8 · C 7 · D 7.
 *   node -e "import('./content/exams/DOCKER-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DOCKER-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/docker-exam-kit.mjs';

export default {
  course: { slug: 'docker' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–4 (the model, running containers, images, Dockerfiles)',
        'Kiểm tra tiến độ 1 — Chương 0–4 (mô hình, chạy container, ảnh, Dockerfile)',
      ),
      description: B(
        'The first third of the Docker course: what Docker solves and what you installed, what a container is made of, layers and the writable layer, the lifecycle and PID 1, running and observing containers, image names, tags and digests, registries and disk, and writing a Dockerfile. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Docker: Docker giải quyết gì và bạn đã cài cái gì, container được làm bằng gì, tầng ảnh và tầng ghi được, vòng đời và PID 1, chạy và quan sát container, tên ảnh với tag và digest, registry và đĩa, và viết Dockerfile. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–4'),
      questions: [
        /* ── Chương 0 — Docker giải quyết gì, cài đặt, năm phút đầu (4 câu) ── */

        // q1 · đáp án 1
        mcq({
          prompt: B(
            'Run on this machine. Why does <code>docker version</code> print two separate blocks?' + code(
              'Client:\n' +
              ' Version:           29.5.3\n' +
              ' API version:       1.54\n' +
              ' Context:           desktop-linux\n' +
              '\n' +
              'Server: Docker Desktop 4.78.0 (229452)\n' +
              ' Engine:\n' +
              '  Version:          29.5.3\n' +
              '  API version:      1.54 (minimum version 1.40)\n' +
              '  OS/Arch:          linux/arm64',
            ),
            'Chạy thật trên máy này. Vì sao <code>docker version</code> in ra hai khối riêng?' + code(
              'Client:\n' +
              ' Version:           29.5.3\n' +
              ' API version:       1.54\n' +
              ' Context:           desktop-linux\n' +
              '\n' +
              'Server: Docker Desktop 4.78.0 (229452)\n' +
              ' Engine:\n' +
              '  Version:          29.5.3\n' +
              '  API version:      1.54 (minimum version 1.40)\n' +
              '  OS/Arch:          linux/arm64',
            ),
          ),
          options: [
            B(
              'The first block is the version installed here and the second is the newest release Docker has published, so you can see at a glance whether an upgrade is waiting for you',
              'Khối đầu là phiên bản đang cài ở đây còn khối sau là bản mới nhất Docker đã phát hành, để bạn liếc một cái là biết có bản nâng cấp đang chờ hay không',
            ),
            B(
              'They are two separate programs: <code>docker</code> is only a client that sends HTTP requests over a socket, and <code>dockerd</code> is the daemon that does the work — the two can even sit on different machines',
              'Đó là HAI chương trình riêng: <code>docker</code> chỉ là máy khách gửi yêu cầu HTTP qua một socket, còn <code>dockerd</code> là tiến trình nền làm việc thật — hai thứ đó thậm chí nằm trên hai máy khác nhau được',
            ),
            B(
              'The first block lists the CLI plugins that are installed (buildx, compose) and the second lists the container runtimes the daemon is allowed to choose between at run time',
              'Khối đầu liệt kê các plugin CLI đang cài (buildx, compose) còn khối sau liệt kê những runtime container mà tiến trình nền được phép chọn lúc chạy',
            ),
            B(
              'Client is the account you are currently logged into on Docker Hub, and Server is the registry hostname that account resolves to whenever you push an image',
              'Client là tài khoản bạn đang đăng nhập trên Docker Hub, còn Server là tên máy registry mà tài khoản đó phân giải ra mỗi khi bạn đẩy một ảnh lên',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two sections because there are two programs. The CLI contains no container logic at all — it turns your command line into an API call over <code>/var/run/docker.sock</code>. That is why <code>DOCKER_HOST=ssh://vps-1 docker ps</code> lists containers on another machine with nothing extra installed, and why "Cannot connect to the Docker daemon" is never a CLI problem: the client is fine, the daemon is not running.',
            'Hai phần vì có hai chương trình. Bản thân CLI không chứa chút logic container nào — nó biến dòng lệnh của bạn thành một lời gọi API qua <code>/var/run/docker.sock</code>. Vì thế <code>DOCKER_HOST=ssh://vps-1 docker ps</code> liệt kê được container trên một máy khác mà không cần cài thêm gì, và vì thế "Cannot connect to the Docker daemon" không bao giờ là lỗi của CLI: máy khách vẫn ổn, tiến trình nền mới là thứ chưa chạy.',
          ),
        }),

        // q2 · đáp án 2
        mcq({
          prompt: B(
            'Both commands were run on the same Mac, one after the other. Which explanation fits?' + code(
              '$ sysctl -n hw.memsize hw.ncpu      # the Mac itself\n' +
              '34359738368\n' +
              '10\n' +
              '\n' +
              "$ docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'\n" +
              'Docker Desktop · aarch64 · 10 CPU · 8321515520',
            ),
            'Hai lệnh chạy trên cùng một máy Mac, cái nọ ngay sau cái kia. Giải thích nào khớp?' + code(
              '$ sysctl -n hw.memsize hw.ncpu      # chính cái Mac\n' +
              '34359738368\n' +
              '10\n' +
              '\n' +
              "$ docker info --format '{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}'\n" +
              'Docker Desktop · aarch64 · 10 CPU · 8321515520',
            ),
          ),
          options: [
            B(
              'Docker permanently reserves about three quarters of host RAM for the image layer cache and reports only what is left over to the rest of the system',
              'Docker giữ hẳn khoảng ba phần tư RAM của máy chủ cho bộ nhớ đệm tầng ảnh và chỉ báo cáo phần còn thừa cho phần còn lại của hệ thống',
            ),
            B(
              'MemTotal reports the memory that happens to be free at the moment of the call, so the number drifts every time you run it on a busy machine',
              'MemTotal báo phần bộ nhớ đang rảnh tại đúng thời điểm gọi lệnh, nên con số trôi đi mỗi lần chạy trên một máy đang bận',
            ),
            B(
              'Containers need Linux kernel features, so on macOS Docker Desktop runs a small Linux VM with Engine inside it — <code>docker info</code> is describing that VM, whose RAM allocation is a Desktop setting rather than the Mac total',
              'Container cần các tính năng của nhân Linux, nên trên macOS Docker Desktop chạy một máy ảo Linux nhỏ có Engine bên trong — <code>docker info</code> đang mô tả cái máy ảo đó, và phần RAM cấp cho nó là một thiết lập của Desktop chứ không phải tổng RAM của Mac',
            ),
            B(
              'MemTotal is measured in bits while <code>hw.memsize</code> is measured in bytes, so the two lines are the same quantity written in two different units',
              'MemTotal đo bằng bit còn <code>hw.memsize</code> đo bằng byte, nên hai dòng là cùng một lượng viết theo hai đơn vị khác nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            '34359738368 bytes is 32 GiB; 8321515520 is 7.75 GiB. The Mac has no Linux kernel, so Desktop boots one inside a VM and every container is a process in there. Two consequences you will meet again: the VM has its own CPU/memory/disk budget, and files shared from macOS cross a virtualisation boundary, which is why a <code>node_modules</code> bind mount is slow on a Mac and instant on a Linux server.',
            '34359738368 byte là 32 GiB; 8321515520 là 7,75 GiB. Máy Mac không có nhân Linux, nên Desktop khởi động một cái bên trong máy ảo và mọi container là một tiến trình ở trong đó. Hai hệ quả bạn sẽ gặp lại: máy ảo có ngân sách CPU/bộ nhớ/đĩa riêng, và file chia sẻ từ macOS phải vượt một ranh giới ảo hoá — đó là lý do bind mount một <code>node_modules</code> chậm trên Mac mà tức thì trên máy chủ Linux.',
          ),
        }),

        // q3 · đáp án 0
        mcq({
          prompt: B(
            'Real transcript. <code>docker ps</code> shows nothing running, yet the name is refused. What is holding it?' + code(
              '$ docker ps\n' +
              'CONTAINER ID   IMAGE   COMMAND   STATUS   PORTS   NAMES\n' +
              '\n' +
              '$ docker run --name job alpine:3.20 true\n' +
              'docker: Error response from daemon: Conflict. The container name "/job" is\n' +
              'already in use by container "81c0fe78e85006b0651239aa679d5c2f8730be51...".\n' +
              'You have to remove (or rename) that container to be able to reuse that name.',
            ),
            'Đoạn terminal thật. <code>docker ps</code> không hiện gì đang chạy, vậy mà cái tên vẫn bị từ chối. Thứ gì đang giữ nó?' + code(
              '$ docker ps\n' +
              'CONTAINER ID   IMAGE   COMMAND   STATUS   PORTS   NAMES\n' +
              '\n' +
              '$ docker run --name job alpine:3.20 true\n' +
              'docker: Error response from daemon: Conflict. The container name "/job" is\n' +
              'already in use by container "81c0fe78e85006b0651239aa679d5c2f8730be51...".\n' +
              'You have to remove (or rename) that container to be able to reuse that name.',
            ),
          ),
          options: [
            B(
              'A container that has already exited: a stopped container keeps its name, its writable layer and its logs until something removes it — <code>docker ps -a</code> shows it, and <code>--rm</code> on the earlier run would have prevented this entirely',
              'Một container đã thoát: container đã dừng vẫn giữ tên, tầng ghi được và log của nó cho tới khi có thứ gì xoá đi — <code>docker ps -a</code> cho thấy nó, và <code>--rm</code> ở lượt chạy trước đã ngăn được chuyện này',
            ),
            B(
              'The daemon caches container names for sixty seconds after the process exits so that restarts stay fast, so simply waiting a minute and running the command again resolves it',
              'Tiến trình nền lưu đệm tên container sáu mươi giây sau khi tiến trình thoát để việc khởi động lại còn nhanh, nên chỉ cần chờ một phút rồi chạy lại là xong',
            ),
            B(
              'The image <code>alpine:3.20</code> claimed the name when it was pulled, and pulling the image again with a different tag is what releases the name back to you',
              'Ảnh <code>alpine:3.20</code> đã nhận cái tên đó lúc được kéo về, và kéo lại ảnh với một tag khác mới là thứ trả cái tên lại cho bạn',
            ),
            B(
              'A network endpoint called <code>job</code> was left behind by an earlier run, and <code>docker network prune</code> is the command that clears endpoints of that kind',
              'Một đầu nối mạng tên <code>job</code> còn sót lại từ lượt chạy trước, và <code>docker network prune</code> là lệnh dọn những đầu nối kiểu đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>docker ps</code> lists only running containers. Every <code>docker run</code> without <code>--rm</code> leaves an <code>Exited</code> container behind that owns its name forever. The symptoms are exactly this puzzling conflict plus a slow disk leak nobody notices — <code>docker ps -a | wc -l</code> in the hundreds. Use <code>--rm</code> for anything one-shot or interactive, keep the container when you actually want its logs or its exit code, and prune deliberately.',
            '<code>docker ps</code> chỉ liệt kê container đang chạy. Mỗi lệnh <code>docker run</code> không kèm <code>--rm</code> để lại một container <code>Exited</code> giữ tên của nó mãi mãi. Triệu chứng đúng là cái xung đột khó hiểu này cộng thêm một chỗ rò đĩa chậm rãi không ai để ý — <code>docker ps -a | wc -l</code> lên tới hàng trăm. Hãy dùng <code>--rm</code> cho mọi thứ chạy một lần hay tương tác, giữ container lại khi bạn thật sự cần log hoặc mã thoát của nó, và dọn dẹp một cách có chủ ý.',
          ),
        }),

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'Real transcript. Which change fixes the second container without touching nginx configuration at all?' + code(
              '$ docker run -d --name a -p 18099:80 nginx:1.27-alpine\n' +
              '083375b8241c14c8fb47d4ff3a4c9fb6fb0f31176d3b88093c3a1a4f60044d55\n' +
              '\n' +
              '$ docker run -d --name b -p 18099:80 nginx:1.27-alpine\n' +
              'docker: Error response from daemon: failed to set up container networking:\n' +
              'driver failed programming external connectivity on endpoint b (a54028685d3a...):\n' +
              'Bind for 0.0.0.0:18099 failed: port is already allocated',
            ),
            'Đoạn terminal thật. Thay đổi nào chữa được container thứ hai mà không đụng gì tới cấu hình nginx?' + code(
              '$ docker run -d --name a -p 18099:80 nginx:1.27-alpine\n' +
              '083375b8241c14c8fb47d4ff3a4c9fb6fb0f31176d3b88093c3a1a4f60044d55\n' +
              '\n' +
              '$ docker run -d --name b -p 18099:80 nginx:1.27-alpine\n' +
              'docker: Error response from daemon: failed to set up container networking:\n' +
              'driver failed programming external connectivity on endpoint b (a54028685d3a...):\n' +
              'Bind for 0.0.0.0:18099 failed: port is already allocated',
            ),
          ),
          options: [
            B(
              'Give the second container <code>--network host</code>, which removes the network namespace so no port mapping is needed and the collision cannot happen',
              'Cho container thứ hai cờ <code>--network host</code>, cờ này bỏ hẳn namespace mạng nên không cần ánh xạ cổng và không thể va nhau',
            ),
            B(
              'Change the second container to <code>-p 18099:8080</code> so that the two containers listen on two different ports and stop competing for one',
              'Đổi container thứ hai thành <code>-p 18099:8080</code> để hai container nghe ở hai cổng khác nhau và thôi tranh nhau một cổng',
            ),
            B(
              'Rebuild the image with <code>EXPOSE 18099</code> so that the daemon knows the port belongs to this image and allocates one mapping per container',
              'Dựng lại ảnh với <code>EXPOSE 18099</code> để tiến trình nền biết cổng đó thuộc về ảnh này và cấp cho mỗi container một ánh xạ riêng',
            ),
            B(
              'Publish a different HOST port, for example <code>-p 18100:80</code>: the number on the left is the host side, and that is the only side two containers can collide on',
              'Công bố một cổng MÁY CHỦ khác, ví dụ <code>-p 18100:80</code>: con số bên trái là phía máy chủ, và đó là phía duy nhất mà hai container có thể va nhau',
            ),
          ],
          correct: 3,
          explanation: EX(
            '<code>-p</code> is always <code>host:container</code>. Two containers may both listen on container port 80 with no conflict at all — each has its own network namespace — but only one process on the host can hold host port 18099. So the fix is on the left of the colon. <code>-p 18099:8080</code> would instead point the host port at a port nothing is listening on inside, giving you a working mapping to a dead socket.',
            '<code>-p</code> luôn là <code>máy chủ:container</code>. Hai container có thể cùng nghe ở cổng 80 bên trong mà không xung đột chút nào — mỗi cái có namespace mạng riêng — nhưng trên máy chủ chỉ một tiến trình giữ được cổng 18099. Nên chỗ cần sửa nằm bên trái dấu hai chấm. Còn <code>-p 18099:8080</code> sẽ trỏ cổng máy chủ vào một cổng chẳng ai nghe bên trong, cho bạn một ánh xạ chạy được tới một socket đã chết.',
          ),
        }),

        /* ── Chương 1 — mô hình tư duy (7 câu) ────────────────────────────── */

        // q5 · đáp án 0
        mcq({
          prompt: B(
            'Real measurement. Two bytes were appended to a file, and the container grew by 8.4MB. Why?' + code(
              '$ docker exec c ls -l /data.bin\n' +
              '-rw-r--r--    1 root     root       8388608 Sep  9 23:01 /data.bin\n' +
              "$ docker ps -s --format '{{.Names}} {{.Size}}'\n" +
              'c 4.1kB (virtual 17.9MB)\n' +
              '\n' +
              "$ docker exec c sh -c 'echo x >> /data.bin'\n" +
              "$ docker ps -s --format '{{.Names}} {{.Size}}'\n" +
              'c 8.4MB (virtual 26.3MB)',
            ),
            'Số đo thật. Ghi thêm hai byte vào một file, container phình lên 8,4MB. Vì sao?' + code(
              '$ docker exec c ls -l /data.bin\n' +
              '-rw-r--r--    1 root     root       8388608 Sep  9 23:01 /data.bin\n' +
              "$ docker ps -s --format '{{.Names}} {{.Size}}'\n" +
              'c 4.1kB (virtual 17.9MB)\n' +
              '\n' +
              "$ docker exec c sh -c 'echo x >> /data.bin'\n" +
              "$ docker ps -s --format '{{.Names}} {{.Size}}'\n" +
              'c 8.4MB (virtual 26.3MB)',
            ),
          ),
          options: [
            B(
              'Copy-on-write: the file lives in a read-only image layer, so the FIRST write to it copies the whole file up into the writable layer — the cost is the size of the file, not the size of the change',
              'Sao-chép-khi-ghi: file nằm ở một tầng ảnh chỉ-đọc, nên lần ghi ĐẦU TIÊN vào nó chép cả file lên tầng ghi được — cái giá là kích thước của file, không phải kích thước của thay đổi',
            ),
            B(
              'The overlay filesystem rounds every write up to the nearest layer boundary, and on this storage driver that boundary happens to be eight megabytes',
              'Hệ thống file overlay làm tròn mọi phép ghi lên biên tầng gần nhất, và trên trình lưu trữ này biên đó tình cờ là tám megabyte',
            ),
            B(
              'The second number in brackets is the one that changed, and <code>docker ps -s</code> reports the two columns in the opposite order to the one you would expect',
              'Con số thứ hai trong ngoặc mới là cái đã đổi, và <code>docker ps -s</code> in hai cột theo thứ tự ngược với thứ bạn nghĩ',
            ),
            B(
              'Appending to a file forces the daemon to re-download the layer that contains it so the checksum stays valid, and the download is counted as container size',
              'Ghi thêm vào một file buộc tiến trình nền tải lại cái tầng chứa nó để tổng kiểm còn hợp lệ, và lượt tải đó bị tính vào kích thước container',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Reading needs no copy at all; the first write to any file copies it up whatever its size. That is why editing a 2GB file inside a container briefly costs 2GB of disk, and why <code>docker ps -s</code> prints two numbers: the container\'s own writable bytes, and the shared image behind it. It is also the reason a container is cheap to start — a hundred containers from one image add no image bytes.',
            'Đọc thì không cần chép gì cả; lần ghi đầu tiên vào bất cứ file nào cũng chép nó lên, dù nó to cỡ nào. Vì thế sửa một file 2GB bên trong container tốn tạm 2GB đĩa, và vì thế <code>docker ps -s</code> in hai con số: phần byte ghi được của riêng container, và cái ảnh dùng chung nằm sau nó. Đó cũng là lý do khởi động một container rẻ — trăm container từ một ảnh không thêm một byte ảnh nào.',
          ),
        }),

        // q6 · đáp án 1
        mcq({
          prompt: B(
            'The same container, continued. The writable layer went back to 4.1kB. What happened to the 8MB inside the image?' + code(
              '$ docker exec c rm /data.bin\n' +
              '$ docker diff c\n' +
              'D /data.bin\n' +
              "$ docker ps -s --format '{{.Names}} {{.Size}}'\n" +
              'c 4.1kB (virtual 17.9MB)\n' +
              "$ docker images pt-cow --format '{{.Size}}'\n" +
              '30.4MB',
            ),
            'Vẫn container đó, chạy tiếp. Tầng ghi được quay về 4,1kB. Còn 8MB nằm trong ảnh thì sao?' + code(
              '$ docker exec c rm /data.bin\n' +
              '$ docker diff c\n' +
              'D /data.bin\n' +
              "$ docker ps -s --format '{{.Names}} {{.Size}}'\n" +
              'c 4.1kB (virtual 17.9MB)\n' +
              "$ docker images pt-cow --format '{{.Size}}'\n" +
              '30.4MB',
            ),
          ),
          options: [
            B(
              'The image lost the 8MB as well, because a layer is recomputed and repacked whenever a file inside it is deleted from a running container',
              'Ảnh cũng mất luôn 8MB đó, vì một tầng được tính lại và đóng gói lại mỗi khi một file bên trong nó bị xoá từ một container đang chạy',
            ),
            B(
              'Nothing: read-only layers are immutable. The <code>rm</code> dropped the copied-up copy from the writable layer and recorded a whiteout marker, so the original bytes are still in the image — which is why it is still 30.4MB',
              'Không gì cả: tầng chỉ-đọc là bất biến. Lệnh <code>rm</code> bỏ bản đã chép lên khỏi tầng ghi được rồi ghi một dấu whiteout, nên những byte gốc vẫn nằm trong ảnh — vì thế nó vẫn 30,4MB',
            ),
            B(
              'The 8MB moved into the build cache, where it is held for seven days and then reclaimed automatically by BuildKit\'s garbage collector',
              '8MB đó dời vào bộ đệm dựng, nằm ở đó bảy ngày rồi được bộ thu gom rác của BuildKit tự động thu hồi',
            ),
            B(
              'The layer became a dangling image of its own, which is why it still appears in the total and can be listed with <code>docker images -f dangling=true</code>',
              'Cái tầng đó thành một ảnh mồ côi riêng, vì thế nó vẫn nằm trong tổng và liệt kê được bằng <code>docker images -f dangling=true</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Overlayfs records a deletion by writing a whiteout marker into the upper layer — a tiny special file meaning "pretend this is not there". Nothing below is ever touched, because read-only layers are immutable by definition. The operational consequence is the expensive one: a secret added in one Dockerfile layer and removed in a later one is still shipped to everyone who pulls the image, and <code>docker save img | tar -x</code> reads it back out.',
            'Overlayfs ghi lại một phép xoá bằng cách viết một dấu whiteout vào tầng trên — một file đặc biệt tí hon mang nghĩa "coi như thứ này không có". Không có gì bên dưới bị đụng tới, vì tầng chỉ-đọc bất biến theo định nghĩa. Hệ quả vận hành mới là cái đắt giá: một bí mật thêm ở một tầng Dockerfile rồi xoá ở tầng sau vẫn được giao tới tay mọi người kéo ảnh về, và <code>docker save img | tar -x</code> moi nó ra lại.',
          ),
        }),

        // q7 · đáp án 2
        mcq({
          prompt: B(
            'Two containers, two different failures, both messages copied verbatim. Which pair of exit codes did they leave behind?' + code(
              '$ docker run --name c1 alpine:3.20 /bin/nope\n' +
              'docker: Error response from daemon: ... error during container init:\n' +
              'exec: "/bin/nope": stat /bin/nope: no such file or directory\n' +
              '\n' +
              '$ docker run --name c2 alpine:3.20 /etc/hostname\n' +
              'docker: Error response from daemon: ... error during container init:\n' +
              'exec: "/etc/hostname": permission denied',
            ),
            'Hai container, hai kiểu hỏng, cả hai thông báo đều chép nguyên văn. Chúng để lại cặp mã thoát nào?' + code(
              '$ docker run --name c1 alpine:3.20 /bin/nope\n' +
              'docker: Error response from daemon: ... error during container init:\n' +
              'exec: "/bin/nope": stat /bin/nope: no such file or directory\n' +
              '\n' +
              '$ docker run --name c2 alpine:3.20 /etc/hostname\n' +
              'docker: Error response from daemon: ... error during container init:\n' +
              'exec: "/etc/hostname": permission denied',
            ),
          ),
          options: [
            B(
              '125 and 125 — both failures happened before the container process existed, so both of them are reported with Docker\'s own generic exit code for a run that never got started',
              '125 và 125 — cả hai lỗi đều xảy ra trước khi tiến trình container tồn tại, nên cả hai được báo bằng mã thoát chung của chính Docker cho một lượt chạy chưa từng khởi động',
            ),
            B(
              '1 and 1 — a container that cannot start always exits with 1, and the difference between the two cases lives only in the message on the CLI',
              '1 và 1 — một container không khởi động được thì luôn thoát bằng 1, và khác biệt giữa hai trường hợp chỉ nằm ở thông báo trên CLI',
            ),
            B(
              '127 then 126 — 127 means the command was not found inside the image, and 126 means it was found but could not be executed (no execute bit, or a shebang with Windows line endings)',
              '127 rồi 126 — 127 nghĩa là không tìm thấy câu lệnh trong ảnh, còn 126 nghĩa là tìm thấy nhưng không chạy được (thiếu bit thực thi, hoặc dòng shebang có ký tự xuống dòng kiểu Windows)',
            ),
            B(
              '126 then 127 — permission problems are detected first by the runtime, so the exit codes come out in the opposite order to the one the messages suggest',
              '126 rồi 127 — vấn đề quyền bị runtime phát hiện trước, nên mã thoát ra theo thứ tự ngược với thứ mà hai thông báo gợi ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured on this machine: <code>c1</code> exits 127, <code>c2</code> exits 126. Both are worth memorising because they are how a base-image change announces itself — 127 is "the binary you rely on is simply not in this image", and 126 is very often a script that lost its <code>+x</code> or came through Windows. Note also that neither message appears in <code>docker logs</code>: the container never started, so it never had a stdout.',
            'Đo thật trên máy này: <code>c1</code> thoát 127, <code>c2</code> thoát 126. Cả hai đáng thuộc vì đó là cách một lần đổi ảnh nền tự giới thiệu — 127 là "chương trình bạn dựa vào đơn giản không có trong ảnh này", còn 126 rất hay là một script bị mất <code>+x</code> hoặc đi qua đường Windows. Cũng để ý: không thông báo nào hiện trong <code>docker logs</code> — container chưa từng khởi động nên chưa từng có stdout.',
          ),
        }),

        // q8 · đáp án 3
        mcq({
          prompt: B(
            'Three containers, all started in shell form, all measured on this machine. What explains three different PID 1s?' + code(
              "$ docker run -d --name a alpine:3.20 sh -c 'sleep 600'\n" +
              '$ docker exec a ps -o pid,args\n' +
              'PID   COMMAND\n' +
              '    1 sleep 600\n' +
              '\n' +
              "$ docker run -d --name b ubuntu:24.04 sh -c 'sleep 600'\n" +
              '$ docker exec b ps -o pid,args\n' +
              '  PID COMMAND\n' +
              '    1 sh -c sleep 600\n' +
              '    7 sleep 600\n' +
              '\n' +
              "$ docker run -d --name c alpine:3.20 sh -c 'sleep 600; echo done'\n" +
              '$ docker exec c ps -o pid,args\n' +
              'PID   COMMAND\n' +
              '    1 sh -c sleep 600; echo done\n' +
              '    7 sleep 600',
            ),
            'Ba container, đều khởi chạy ở dạng shell, đều đo trên máy này. Điều gì giải thích ba PID 1 khác nhau?' + code(
              "$ docker run -d --name a alpine:3.20 sh -c 'sleep 600'\n" +
              '$ docker exec a ps -o pid,args\n' +
              'PID   COMMAND\n' +
              '    1 sleep 600\n' +
              '\n' +
              "$ docker run -d --name b ubuntu:24.04 sh -c 'sleep 600'\n" +
              '$ docker exec b ps -o pid,args\n' +
              '  PID COMMAND\n' +
              '    1 sh -c sleep 600\n' +
              '    7 sleep 600\n' +
              '\n' +
              "$ docker run -d --name c alpine:3.20 sh -c 'sleep 600; echo done'\n" +
              '$ docker exec c ps -o pid,args\n' +
              'PID   COMMAND\n' +
              '    1 sh -c sleep 600; echo done\n' +
              '    7 sleep 600',
            ),
          ),
          options: [
            B(
              'Alpine\'s <code>ps</code> hides a shell that is sitting in PID 1, so the first listing is simply incomplete and the three containers are in fact identical',
              '<code>ps</code> của Alpine giấu đi cái shell đang nằm ở PID 1, nên bản liệt kê đầu chỉ là thiếu, còn ba container thật ra giống hệt nhau',
            ),
            B(
              '<code>ubuntu:24.04</code> starts a real init system as PID 1 while Alpine does not, so on Ubuntu everything you launch becomes a child of that init',
              '<code>ubuntu:24.04</code> khởi chạy một hệ init thật ở PID 1 còn Alpine thì không, nên trên Ubuntu mọi thứ bạn chạy đều thành con của cái init đó',
            ),
            B(
              'The <code>-d</code> flag makes Docker skip the wrapping shell on images whose default shell is busybox, and <code>docker run</code> without it would show a shell in all three',
              'Cờ <code>-d</code> khiến Docker bỏ qua cái shell bọc ngoài trên những ảnh có shell mặc định là busybox, và chạy <code>docker run</code> không có nó thì cả ba đều hiện một shell',
            ),
            B(
              'When a shell has exactly ONE simple command left, busybox ash execs it in place instead of forking, so the shell disappears; dash on Ubuntu forks instead, and the moment a second command follows (container c) even busybox has to stay alive as PID 1',
              'Khi shell chỉ còn đúng MỘT lệnh đơn, busybox ash exec thẳng nó tại chỗ thay vì fork, nên cái shell biến mất; dash trên Ubuntu thì fork, và hễ có lệnh thứ hai đi sau (container c) thì ngay cả busybox cũng phải ở lại làm PID 1',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured here, and it is worth knowing because the courseware shows Ubuntu\'s behaviour with an Alpine image. The practical rule does not change: never rely on a shell in PID 1 to forward SIGTERM or reap zombies, because whether it is there at all depends on your base image and on how many commands you happened to chain. Write <code>CMD ["node","server.js"]</code>, or end an entrypoint script with <code>exec "$@"</code>, and the question stops mattering.',
            'Đo thật ở đây, và đáng biết vì giáo trình dùng ảnh Alpine mà lại in ra hành vi của Ubuntu. Quy tắc thực hành thì không đổi: đừng bao giờ trông cậy một cái shell ở PID 1 để chuyển tiếp SIGTERM hay thu dọn tiến trình mồ côi, vì việc nó có ở đó hay không phụ thuộc vào ảnh nền và vào chuyện bạn tình cờ nối bao nhiêu lệnh. Cứ viết <code>CMD ["node","server.js"]</code>, hoặc kết thúc script entrypoint bằng <code>exec "$@"</code>, là câu hỏi này hết quan trọng.',
          ),
        }),

        // q9 · đáp án 0
        mcq({
          prompt: B(
            'Both containers have their real program as PID 1, in exec form. Why does one leave 137 and the other 0?' + code(
              '$ docker run -d --name s alpine:3.20 sleep 600\n' +
              "$ docker stop s; docker inspect -f '{{.State.ExitCode}}' s\n" +
              '137\n' +
              '\n' +
              '$ docker run -d --name n nginx:1.27-alpine\n' +
              "$ docker stop n; docker inspect -f '{{.State.ExitCode}}' n\n" +
              '0',
            ),
            'Cả hai container đều có chương trình thật làm PID 1, đều dạng exec. Vì sao một cái để lại 137 còn cái kia 0?' + code(
              '$ docker run -d --name s alpine:3.20 sleep 600\n' +
              "$ docker stop s; docker inspect -f '{{.State.ExitCode}}' s\n" +
              '137\n' +
              '\n' +
              '$ docker run -d --name n nginx:1.27-alpine\n' +
              "$ docker stop n; docker inspect -f '{{.State.ExitCode}}' n\n" +
              '0',
            ),
          ),
          options: [
            B(
              'PID 1 is special: the kernel drops any signal PID 1 has no handler for, so <code>sleep</code> never sees SIGTERM, the grace period runs out and Docker sends SIGKILL (128+9 = 137); nginx installs a handler, shuts down and exits 0',
              'PID 1 là ca đặc biệt: nhân vứt bỏ mọi tín hiệu mà PID 1 không có bộ xử lý, nên <code>sleep</code> chẳng bao giờ thấy SIGTERM, hết thời gian ân hạn thì Docker gửi SIGKILL (128+9 = 137); nginx có cài bộ xử lý, nó tắt gọn và thoát 0',
            ),
            B(
              '<code>sleep 600</code> had not finished its six hundred seconds, so Docker reports the number of seconds still outstanding as a non-zero exit code',
              '<code>sleep 600</code> chưa chạy hết sáu trăm giây, nên Docker báo số giây còn dư dưới dạng một mã thoát khác không',
            ),
            B(
              'nginx runs its worker processes as a non-root user and is therefore permitted to exit cleanly, while <code>sleep</code> runs as root and the runtime kills root processes',
              'nginx chạy tiến trình worker dưới một người dùng không phải root nên được phép thoát êm, còn <code>sleep</code> chạy dưới root và runtime thì giết các tiến trình root',
            ),
            B(
              '137 always means the container reached its memory limit, and <code>sleep</code> allocates a kernel timer buffer that nginx does not need',
              '137 luôn nghĩa là container chạm trần bộ nhớ, và <code>sleep</code> cấp phát một vùng đệm bộ đếm giờ trong nhân mà nginx không cần',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Exec form gets your process to PID 1; it does not give it a signal handler. A program that ignores SIGTERM anywhere else merely stops slowly — as PID 1 the kernel will not kill it at all, so the only thing that ends it is SIGKILL. Read 137 as "something insisted", then use <code>.State.OOMKilled</code> to tell a timed-out stop from the OOM killer.',
            'Dạng exec đưa tiến trình của bạn lên PID 1; nó không tặng kèm một bộ xử lý tín hiệu. Một chương trình bỏ qua SIGTERM ở chỗ khác thì chỉ dừng chậm — còn ở vị trí PID 1 thì nhân sẽ không giết nó chút nào, nên thứ duy nhất kết liễu nó là SIGKILL. Hãy đọc 137 là "có thứ gì đó đã ép", rồi dùng <code>.State.OOMKilled</code> để phân biệt một lệnh dừng hết giờ với kẻ giết OOM.',
          ),
        }),

        // q10 · đáp án 1
        mcq({
          prompt: B(
            'Real transcript. What does the CREATED BY column of the new layer tell somebody reading this image six months from now?' + code(
              '$ docker run -d --name tinker alpine:3.20 sleep 600\n' +
              '$ docker exec tinker apk add --no-cache jq\n' +
              "$ docker commit -m 'added jq' tinker pt-tools:v1\n" +
              "$ docker history pt-tools:v1 --format 'table {{.CreatedBy}}\\t{{.Size}}\\t{{.Comment}}'\n" +
              'CREATED BY          SIZE      COMMENT\n' +
              'sleep 600           1.36MB    added jq\n' +
              'CMD ["/bin/sh"]     0B        buildkit.dockerfile.v0',
            ),
            'Đoạn terminal thật. Cột CREATED BY của tầng mới nói gì với người đọc cái ảnh này sáu tháng sau?' + code(
              '$ docker run -d --name tinker alpine:3.20 sleep 600\n' +
              '$ docker exec tinker apk add --no-cache jq\n' +
              "$ docker commit -m 'added jq' tinker pt-tools:v1\n" +
              "$ docker history pt-tools:v1 --format 'table {{.CreatedBy}}\\t{{.Size}}\\t{{.Comment}}'\n" +
              'CREATED BY          SIZE      COMMENT\n' +
              'sleep 600           1.36MB    added jq\n' +
              'CMD ["/bin/sh"]     0B        buildkit.dockerfile.v0',
            ),
          ),
          options: [
            B(
              'That <code>jq</code> was installed with <code>apk</code>, because Docker records every command that was exec\'d into the container while it was running',
              'Rằng <code>jq</code> được cài bằng <code>apk</code>, vì Docker ghi lại mọi câu lệnh đã exec vào container trong lúc nó chạy',
            ),
            B(
              'Nothing useful: it records the CONTAINER\'s command, <code>sleep 600</code>, not what you did inside it. Only the free-text comment hints at the truth, so nobody can review or reproduce this image — which is the whole argument for Dockerfiles',
              'Không gì hữu ích: nó ghi câu lệnh CỦA CONTAINER, tức <code>sleep 600</code>, chứ không ghi thứ bạn làm bên trong. Chỉ có dòng chú thích tự do là hé lộ sự thật, nên không ai duyệt hay dựng lại được cái ảnh này — và đó chính là toàn bộ lý lẽ của Dockerfile',
            ),
            B(
              'That the layer weighs 1.36MB, which on Alpine is enough to identify the package that produced it without needing any other information',
              'Rằng cái tầng nặng 1,36MB, và trên Alpine chừng đó đủ để nhận ra gói nào đã sinh ra nó mà không cần thông tin nào khác',
            ),
            B(
              'That the image was produced by BuildKit from a Dockerfile, exactly as the second row of the history output confirms with its comment',
              'Rằng ảnh do BuildKit sinh ra từ một Dockerfile, đúng như dòng thứ hai của lịch sử xác nhận qua phần chú thích của nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>docker commit</code> works, and it is a trap. Compare it with a three-line Dockerfile: in git, reviewable, rebuildable on any machine, and rebuilt automatically when the base image gets a security patch. There are two legitimate uses — a forensic snapshot of a misbehaving production container, and capturing a 3am hot-patch so it is not lost. In both cases the commit is a receipt, not the deliverable.',
            '<code>docker commit</code> chạy được, và nó là một cái bẫy. Hãy so với một Dockerfile ba dòng: nằm trong git, duyệt được, dựng lại được trên mọi máy, và được dựng lại tự động khi ảnh nền có bản vá bảo mật. Có hai chỗ dùng chính đáng — chụp lại hiện trường một container production đang giở chứng, và giữ lại bản vá nóng lúc 3 giờ sáng cho khỏi mất. Ở cả hai chỗ, cái commit là tờ biên nhận, không phải sản phẩm giao.',
          ),
        }),

        // q11 · đáp án 2
        mcq({
          prompt: B(
            'Real transcript against a container that has already stopped. Why does one command work and the other not?' + code(
              '$ docker stop job\n' +
              '$ docker cp job:/tmp/last.log ./last.log && cat last.log\n' +
              'evidence\n' +
              '\n' +
              '$ docker exec job cat /tmp/last.log\n' +
              'Error response from daemon: container e2aef2da55a3... is not running',
            ),
            'Đoạn terminal thật với một container đã dừng. Vì sao một lệnh chạy được còn lệnh kia thì không?' + code(
              '$ docker stop job\n' +
              '$ docker cp job:/tmp/last.log ./last.log && cat last.log\n' +
              'evidence\n' +
              '\n' +
              '$ docker exec job cat /tmp/last.log\n' +
              'Error response from daemon: container e2aef2da55a3... is not running',
            ),
          ),
          options: [
            B(
              '<code>docker cp</code> is queued by the daemon and will actually be carried out the next time the container is started, which is why the file appeared to arrive',
              '<code>docker cp</code> được tiến trình nền xếp hàng và thật ra chỉ thực thi ở lần container khởi động kế tiếp, vì thế cái file trông như đã tới nơi',
            ),
            B(
              '<code>docker cp</code> travels over the container\'s healthcheck channel, and that channel stays open for a grace period after the main process exits',
              '<code>docker cp</code> đi qua kênh healthcheck của container, và kênh đó còn mở thêm một khoảng ân hạn sau khi tiến trình chính thoát',
            ),
            B(
              '<code>docker cp</code> reads the container\'s writable layer straight off the disk rather than through the running process, so it works on a stopped container — which makes it the tool for getting evidence out of something that has already died',
              '<code>docker cp</code> đọc thẳng tầng ghi được của container trên đĩa chứ không đi qua tiến trình đang chạy, nên nó chạy được với container đã dừng — và đó là thứ để lấy bằng chứng ra khỏi một thứ đã chết',
            ),
            B(
              '<code>docker exec</code> needs a pseudo-terminal and the stopped container released its own, so adding <code>-i</code> to the exec would have made it succeed',
              '<code>docker exec</code> cần một pseudo-terminal mà container đã dừng thì trả nó lại rồi, nên thêm <code>-i</code> vào lệnh exec là chạy được',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the rescue path: when a container crash-loops and you need the file it wrote just before dying, <code>docker cp</code> gets it while <code>docker exec</code> cannot. It is not a deployment mechanism, though — copying a file into a running container produces a machine whose state exists nowhere in version control and vanishes on the next deploy. If you do it twice for the same file, that file belongs in the image or on a volume.',
            'Đây là đường cứu hộ: khi một container quay vòng chết đi sống lại và bạn cần đúng cái file nó ghi ngay trước lúc chết, <code>docker cp</code> lấy được còn <code>docker exec</code> thì không. Nhưng nó không phải cách deploy — chép một file vào container đang chạy tạo ra một cỗ máy có trạng thái không tồn tại ở đâu trong quản lý phiên bản và biến mất ở lần deploy sau. Nếu bạn làm thế hai lần cho cùng một file, file đó thuộc về cái ảnh hoặc một volume.',
          ),
        }),

        /* ── Chương 2 — chạy container (7 câu) ────────────────────────────── */

        // q12 · đáp án 3
        mcq({
          prompt: B(
            'Real transcript. Container <code>a</code> was started with no <code>-p</code> at all, yet <code>docker ps</code> prints <code>80/tcp</code> for it. What is that line?' + code(
              '$ docker run -d --name a nginx:1.27-alpine\n' +
              '$ docker port a\n' +
              '(no output)\n' +
              '\n' +
              '$ docker run -d --name b -P nginx:1.27-alpine\n' +
              '$ docker port b\n' +
              '80/tcp -> 0.0.0.0:55000\n' +
              '\n' +
              "$ docker ps --format 'table {{.Names}}\\t{{.Ports}}'\n" +
              'NAMES  PORTS\n' +
              'b      0.0.0.0:55000->80/tcp\n' +
              'a      80/tcp',
            ),
            'Đoạn terminal thật. Container <code>a</code> khởi chạy không có <code>-p</code> nào, vậy mà <code>docker ps</code> vẫn in <code>80/tcp</code> cho nó. Dòng đó là gì?' + code(
              '$ docker run -d --name a nginx:1.27-alpine\n' +
              '$ docker port a\n' +
              '(không có gì)\n' +
              '\n' +
              '$ docker run -d --name b -P nginx:1.27-alpine\n' +
              '$ docker port b\n' +
              '80/tcp -> 0.0.0.0:55000\n' +
              '\n' +
              "$ docker ps --format 'table {{.Names}}\\t{{.Ports}}'\n" +
              'NAMES  PORTS\n' +
              'b      0.0.0.0:55000->80/tcp\n' +
              'a      80/tcp',
            ),
          ),
          options: [
            B(
              'Container <code>a</code> is published on host port 80; the short form just leaves out the host address because it is the default one',
              'Container <code>a</code> đang công bố ở cổng 80 của máy chủ; dạng viết ngắn chỉ bỏ đi địa chỉ máy chủ vì đó là địa chỉ mặc định',
            ),
            B(
              'It is a leftover line from container <code>b</code>, because <code>docker ps</code> groups the PORTS column by image rather than by container',
              'Đó là dòng còn sót của container <code>b</code>, vì <code>docker ps</code> gộp cột PORTS theo ảnh chứ không theo container',
            ),
            B(
              'Container <code>a</code> is reachable from the host on port 80, but only from localhost, which is why the address is omitted from the listing',
              'Container <code>a</code> tiếp cận được từ máy chủ ở cổng 80, nhưng chỉ từ localhost, nên địa chỉ bị bỏ khỏi bản liệt kê',
            ),
            B(
              'It is the image\'s EXPOSE metadata with no host mapping behind it — nothing at all is published for <code>a</code>, which is why <code>docker port</code> prints nothing, and <code>-P</code> is what turns that metadata into a real random host port',
              'Đó là siêu dữ liệu EXPOSE của ảnh, phía sau không có ánh xạ máy chủ nào — <code>a</code> chẳng công bố gì cả, vì thế <code>docker port</code> không in gì, và <code>-P</code> mới là thứ biến siêu dữ liệu đó thành một cổng máy chủ ngẫu nhiên có thật',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A line in the PORTS column with an arrow is a mapping; a line without one is documentation. <code>EXPOSE</code> in the Dockerfile publishes nothing and opens no firewall — it only records the port in the image config, where <code>-P</code> reads it to pick random high host ports. So "the port is listed in <code>docker ps</code>" is not evidence that anything outside can reach it; <code>docker port</code> is.',
            'Một dòng trong cột PORTS có mũi tên là một ánh xạ; dòng không có mũi tên là tài liệu. <code>EXPOSE</code> trong Dockerfile không công bố gì và không mở tường lửa nào — nó chỉ ghi cổng vào cấu hình ảnh, chỗ mà <code>-P</code> đọc để chọn cổng máy chủ ngẫu nhiên. Nên "cổng có trong <code>docker ps</code>" không phải bằng chứng rằng bên ngoài với tới được; <code>docker port</code> mới là.',
          ),
        }),

        // q13 · đáp án 0
        mcq({
          prompt: B(
            'Real transcript. The same pipeline, one flag apart. Why is the second one empty?' + code(
              '$ echo \'{"b":2,"a":1}\' | docker run --rm -i alpine:3.20 cat\n' +
              '{"b":2,"a":1}\n' +
              '\n' +
              '$ echo \'{"b":2,"a":1}\' | docker run --rm alpine:3.20 cat\n' +
              '(no output)',
            ),
            'Đoạn terminal thật. Cùng một đường ống, khác nhau đúng một cờ. Vì sao cái thứ hai trống?' + code(
              '$ echo \'{"b":2,"a":1}\' | docker run --rm -i alpine:3.20 cat\n' +
              '{"b":2,"a":1}\n' +
              '\n' +
              '$ echo \'{"b":2,"a":1}\' | docker run --rm alpine:3.20 cat\n' +
              '(không có gì)',
            ),
          ),
          options: [
            B(
              'Without <code>-i</code> the container\'s stdin is closed immediately, so <code>cat</code> reads EOF at once and prints nothing. In pipes and scripts use <code>-i</code> alone; add <code>-t</code> only when a human is typing',
              'Không có <code>-i</code> thì stdin của container bị đóng ngay, nên <code>cat</code> đọc được EOF tức thì và không in gì. Trong đường ống và script hãy dùng riêng <code>-i</code>; chỉ thêm <code>-t</code> khi có người đang gõ',
            ),
            B(
              'The <code>cat</code> in busybox insists on a pseudo-terminal before it will read anything, so <code>-t</code> is the flag that is actually missing here',
              '<code>cat</code> của busybox đòi phải có pseudo-terminal thì mới chịu đọc, nên <code>-t</code> mới là cờ thật sự còn thiếu ở đây',
            ),
            B(
              'The shell consumed the pipe before <code>docker</code> was even started, so the data never reached the daemon; a here-string would have worked',
              'Shell đã nuốt hết đường ống trước cả khi <code>docker</code> khởi chạy, nên dữ liệu chẳng bao giờ tới tiến trình nền; dùng here-string thì chạy được',
            ),
            B(
              '<code>--rm</code> removed the container before it had a chance to read its input; dropping that flag makes the output appear as expected',
              '<code>--rm</code> xoá container trước khi nó kịp đọc đầu vào; bỏ cờ đó đi là output hiện ra như mong đợi',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>-i</code> keeps stdin open and connected; <code>-t</code> allocates a pseudo-terminal. They are two separate things and only the first one matters in a pipeline. Adding <code>-t</code> there is actively harmful: programs detect a TTY and start emitting colour escape codes, progress bars and interactive prompts into exactly the stream your script is trying to parse.',
            '<code>-i</code> giữ stdin mở và nối vào; <code>-t</code> cấp một pseudo-terminal. Đó là hai thứ riêng biệt và trong một đường ống chỉ cái đầu có ý nghĩa. Thêm <code>-t</code> vào đó còn có hại: các chương trình phát hiện có TTY rồi bắt đầu phun mã thoát màu, thanh tiến độ và lời nhắc tương tác vào đúng cái luồng mà script của bạn đang cố phân tích.',
          ),
        }),

        // q14 · đáp án 1
        mcq({
          prompt: B(
            'Real transcript. Which rule explains both of the values that came out?' + code(
              '$ cat a.env\n' +
              'MODE=file\n' +
              'SHARED=from-a\n' +
              '$ cat b.env\n' +
              'SHARED=from-b\n' +
              '\n' +
              '$ docker run --rm --env-file a.env --env-file b.env -e MODE=flag alpine:3.20 \\\n' +
              '    sh -c \'echo "MODE=$MODE SHARED=$SHARED"\'\n' +
              'MODE=flag SHARED=from-b',
            ),
            'Đoạn terminal thật. Quy tắc nào giải thích cả hai giá trị đã ra?' + code(
              '$ cat a.env\n' +
              'MODE=file\n' +
              'SHARED=from-a\n' +
              '$ cat b.env\n' +
              'SHARED=from-b\n' +
              '\n' +
              '$ docker run --rm --env-file a.env --env-file b.env -e MODE=flag alpine:3.20 \\\n' +
              '    sh -c \'echo "MODE=$MODE SHARED=$SHARED"\'\n' +
              'MODE=flag SHARED=from-b',
            ),
          ),
          options: [
            B(
              'Whichever file name sorts last alphabetically wins, and every <code>-e</code> on the command line is applied before any file is read at all',
              'Tên file nào xếp sau theo bảng chữ cái thì thắng, và mọi cờ <code>-e</code> trên dòng lệnh đều được áp trước khi đọc bất cứ file nào',
            ),
            B(
              'Later <code>--env-file</code> files override earlier ones, and <code>-e</code> on the command line beats every file — the order is image ENV, then env files, then <code>-e</code>, then whatever the entrypoint script sets',
              'File <code>--env-file</code> đứng sau đè lên file đứng trước, và <code>-e</code> trên dòng lệnh thắng mọi file — thứ tự là ENV của ảnh, rồi file env, rồi <code>-e</code>, rồi thứ mà script entrypoint đặt',
            ),
            B(
              'Docker merges the files and, when two of them disagree about a key, keeps the shorter of the two values so that a truncated line never wins',
              'Docker trộn các file lại và, khi hai file bất đồng về một khoá, giữ giá trị ngắn hơn để một dòng bị cắt cụt không bao giờ thắng',
            ),
            B(
              'Only the first <code>--env-file</code> is ever read; MODE came from the flag simply because <code>a.env</code> was ignored in its entirety',
              'Chỉ file <code>--env-file</code> đầu tiên được đọc; MODE ra từ cái cờ chỉ vì <code>a.env</code> đã bị bỏ qua toàn bộ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both halves of the output confirm the chain: <code>SHARED</code> came from the second file, <code>MODE</code> from the flag even though a file also set it. The other thing worth remembering about env files is that Docker reads them literally — no quote stripping, no <code>${VAR}</code> expansion, no <code>export</code>. A password that arrives wrapped in quote characters is one of the most common "the credentials are right but authentication fails" causes.',
            'Cả hai nửa của output đều xác nhận chuỗi ưu tiên: <code>SHARED</code> ra từ file thứ hai, <code>MODE</code> ra từ cái cờ dù trong file cũng có đặt. Thứ nữa đáng nhớ về file env là Docker đọc chúng theo nghĩa đen — không bóc dấu nháy, không khai triển <code>${VAR}</code>, không có <code>export</code>. Một mật khẩu tới nơi mà còn dính cặp dấu nháy là một trong những nguyên nhân phổ biến nhất của "thông tin đăng nhập đúng mà xác thực vẫn hỏng".',
          ),
        }),

        // q15 · đáp án 2
        mcq({
          prompt: B(
            'Real measurement on this machine. Beyond safety, why does setting <code>--memory</code> matter?' + code(
              '$ docker run -d --name free nginx:1.27-alpine\n' +
              '$ docker run -d --name capped --memory 256m nginx:1.27-alpine\n' +
              "$ docker stats --no-stream --format '{{.Name}} {{.MemUsage}}' free capped\n" +
              'free 8.332MiB / 7.75GiB\n' +
              'capped 8.332MiB / 256MiB',
            ),
            'Số đo thật trên máy này. Ngoài chuyện an toàn ra, vì sao đặt <code>--memory</code> lại quan trọng?' + code(
              '$ docker run -d --name free nginx:1.27-alpine\n' +
              '$ docker run -d --name capped --memory 256m nginx:1.27-alpine\n' +
              "$ docker stats --no-stream --format '{{.Name}} {{.MemUsage}}' free capped\n" +
              'free 8.332MiB / 7.75GiB\n' +
              'capped 8.332MiB / 256MiB',
            ),
          ),
          options: [
            B(
              'It makes the container start measurably faster, because the daemon can pre-allocate the whole cgroup in one operation instead of growing it on demand',
              'Nó làm container khởi động nhanh hơn thấy rõ, vì tiến trình nền cấp phát trọn cgroup trong một thao tác thay vì nới dần theo nhu cầu',
            ),
            B(
              'It makes the kernel compress pages above the limit rather than allocating new ones, so a leaking process slows down instead of taking memory it should not',
              'Nó khiến nhân nén các trang vượt trần thay vì cấp phát trang mới, nên một tiến trình rò bộ nhớ chỉ chậm lại chứ không ăn phần không phải của nó',
            ),
            B(
              'Modern runtimes read the cgroup limit to size heaps and thread pools — with no limit a Node or JVM process here sizes itself for 7.75GiB and 10 CPUs while being allowed far less, so limits are a correctness fix as much as a safety one',
              'Các môi trường chạy hiện đại đọc trần cgroup để định cỡ heap và bể luồng — không có trần thì một tiến trình Node hay JVM ở đây tự định cỡ cho 7,75GiB và 10 nhân trong khi được cấp ít hơn nhiều, nên đặt trần là sửa cho ĐÚNG chứ không chỉ cho an toàn',
            ),
            B(
              'Without a limit <code>docker stats</code> cannot compute the MEM% column and simply leaves it blank, and nothing else about the container changes at all',
              'Không có trần thì <code>docker stats</code> không tính được cột MEM% và bỏ trống nó, còn lại thì chẳng có gì về container thay đổi cả',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Notice what the LIMIT column says: with no <code>--memory</code> it reports the whole VM. Modern JVMs, Node 20+, .NET and Go with automaxprocs read the cgroup files instead of <code>/proc</code>, so an unlimited container builds thread pools for hardware it will never be allowed to use, producing context-switch thrash that looks like a mysterious latency problem. The safety argument is real too: one leaking process with no cap can take the database sharing the host down with it.',
            'Hãy để ý cột LIMIT: không có <code>--memory</code> thì nó báo cả cái máy ảo. JVM đời mới, Node 20+, .NET và Go kèm automaxprocs đọc các file cgroup thay vì <code>/proc</code>, nên một container không trần dựng bể luồng cho phần cứng mà nó sẽ không bao giờ được dùng, sinh ra cảnh giành nhau chuyển ngữ cảnh trông y như một vấn đề độ trễ bí ẩn. Lý lẽ an toàn cũng thật: một tiến trình rò bộ nhớ không trần có thể kéo sập cả cơ sở dữ liệu đang ở chung máy.',
          ),
        }),

        // q16 · đáp án 3
        mcq({
          prompt: B(
            'Real measurement. What would <code>--restart always</code> have produced instead, and which policy belongs on a service?' + code(
              "$ docker run -d --name flapping --restart on-failure:3 alpine:3.20 sh -c 'sleep 1; exit 1'\n" +
              '$ sleep 18\n' +
              "$ docker inspect flapping --format 'status={{.State.Status}} exit={{.State.ExitCode}} restarts={{.RestartCount}} policy={{.HostConfig.RestartPolicy.Name}}'\n" +
              'status=exited exit=1 restarts=3 policy=on-failure',
            ),
            'Số đo thật. Nếu là <code>--restart always</code> thì kết quả sẽ ra sao, và chính sách nào hợp với một dịch vụ?' + code(
              "$ docker run -d --name flapping --restart on-failure:3 alpine:3.20 sh -c 'sleep 1; exit 1'\n" +
              '$ sleep 18\n' +
              "$ docker inspect flapping --format 'status={{.State.Status}} exit={{.State.ExitCode}} restarts={{.RestartCount}} policy={{.HostConfig.RestartPolicy.Name}}'\n" +
              'status=exited exit=1 restarts=3 policy=on-failure',
            ),
          ),
          options: [
            B(
              '<code>always</code> would have given up after the same three attempts, because the <code>:N</code> attempt limit applies to both policies in exactly the same way',
              '<code>always</code> cũng bỏ cuộc sau đúng ba lần thử, vì giới hạn <code>:N</code> áp cho cả hai chính sách y như nhau',
            ),
            B(
              '<code>always</code> would have refused to start the container at all, because it requires the image to declare a HEALTHCHECK it can act on',
              '<code>always</code> sẽ không cho container khởi chạy chút nào, vì nó đòi ảnh phải khai một HEALTHCHECK để nó dựa vào mà xử lý',
            ),
            B(
              '<code>always</code> is identical to <code>on-failure</code> with no count attached, and neither of the two survives a reboot of the host machine',
              '<code>always</code> giống hệt <code>on-failure</code> không kèm số đếm, và cả hai đều không sống sót qua một lần khởi động lại máy chủ',
            ),
            B(
              '<code>always</code> keeps restarting with no cap and starts the container again at the next daemon start even if you stopped it by hand — for a service prefer <code>unless-stopped</code>, which is the same thing except that it remembers a deliberate stop',
              '<code>always</code> khởi động lại mãi không có trần và còn chạy lại container ở lần tiến trình nền khởi động kế tiếp dù bạn đã tự tay dừng nó — với một dịch vụ hãy chọn <code>unless-stopped</code>, y hệt nhưng nó nhớ rằng bạn đã cố ý dừng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: three attempts, then <code>exited</code> with the application\'s own code 1. Two things to carry away. <code>RestartCount</code> is a triage signal — anything non-zero deserves a look and a growing one is a crash loop in progress. And a restart policy reacts only to the process exiting: a container that is running but wedged (deadlocked, event loop blocked, pool exhausted) stays <code>Up</code> forever as far as Docker is concerned.',
            'Đo được: ba lần thử, rồi <code>exited</code> với mã 1 của chính ứng dụng. Hai thứ mang về. <code>RestartCount</code> là một tín hiệu phân loại — khác không là đáng nhìn, mà tăng dần là một vòng xoáy sập đang diễn ra. Và chính sách khởi động lại chỉ phản ứng với việc tiến trình thoát: một container đang chạy nhưng kẹt cứng (khoá chết, vòng lặp sự kiện tắc, cạn bể kết nối) thì với Docker vẫn là <code>Up</code> mãi mãi.',
          ),
        }),

        // q17 · đáp án 0
        mcq({
          prompt: B(
            'Real transcript. What does this pair of commands prove about <code>-u</code>?' + code(
              '$ docker run --rm -u node alpine:3.20 id\n' +
              'docker: Error response from daemon: unable to find user node:\n' +
              'no matching entries in passwd file\n' +
              '\n' +
              '$ docker run --rm -u 1000:1000 alpine:3.20 id\n' +
              'uid=1000 gid=1000 groups=1000',
            ),
            'Đoạn terminal thật. Cặp lệnh này chứng minh điều gì về <code>-u</code>?' + code(
              '$ docker run --rm -u node alpine:3.20 id\n' +
              'docker: Error response from daemon: unable to find user node:\n' +
              'no matching entries in passwd file\n' +
              '\n' +
              '$ docker run --rm -u 1000:1000 alpine:3.20 id\n' +
              'uid=1000 gid=1000 groups=1000',
            ),
          ),
          options: [
            B(
              'A user NAME has to exist in the image\'s <code>/etc/passwd</code>, while a numeric UID:GID never does — which is why the numeric form is the portable one, at the cost of a process with no passwd entry, so <code>whoami</code> fails and <code>$HOME</code> may be <code>/</code>',
              'Một TÊN người dùng phải có sẵn trong <code>/etc/passwd</code> của ảnh, còn cặp UID:GID bằng số thì không cần — vì thế dạng số mới là dạng đi được khắp nơi, đổi lại tiến trình không có mục trong passwd nên <code>whoami</code> hỏng và <code>$HOME</code> có thể là <code>/</code>',
            ),
            B(
              'Alpine images do not implement the short <code>-u</code> flag and need the long <code>--user</code> spelling instead, which accepts both names and numbers',
              'Ảnh Alpine không cài đặt cờ ngắn <code>-u</code> mà cần dạng dài <code>--user</code>, dạng này nhận cả tên lẫn số',
            ),
            B(
              'The name form only works when the image also carries a <code>USER</code> instruction naming the same account, and Alpine\'s Dockerfile carries none',
              'Dạng tên chỉ chạy khi ảnh còn có một chỉ thị <code>USER</code> gọi đúng tài khoản đó, mà Dockerfile của Alpine thì không có',
            ),
            B(
              'Docker resolves user names against the HOST\'s <code>/etc/passwd</code>, and this particular host simply has no account called <code>node</code>',
              'Docker phân giải tên người dùng theo <code>/etc/passwd</code> của MÁY CHỦ, và cái máy chủ này thì đơn giản là không có tài khoản tên <code>node</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The name is resolved inside the image, not on the host. Numeric IDs always work because they need no entry anywhere, which is what makes <code>-u "$(id -u):$(id -g)"</code> the portable development form. The catch is real though: with a bare numeric UID there is no home directory, so npm, pip and git misbehave — <code>-e HOME=/tmp</code> is the usual patch. The proper fix is a <code>USER</code> instruction with a fixed UID in the Dockerfile, so development and production agree.',
            'Cái tên được phân giải bên trong ảnh, không phải trên máy chủ. ID bằng số thì luôn chạy vì chúng không cần mục nào ở đâu cả, và đó là điều khiến <code>-u "$(id -u):$(id -g)"</code> thành dạng đi được khi phát triển. Nhưng cái giá là thật: với một UID trần thì không có thư mục nhà, nên npm, pip và git giở chứng — <code>-e HOME=/tmp</code> là miếng vá quen thuộc. Cách chữa đúng là một chỉ thị <code>USER</code> với UID cố định trong Dockerfile, để lúc phát triển và lúc chạy thật khớp nhau.',
          ),
        }),

        // q18 · đáp án 1
        mcq({
          prompt: B(
            'Real transcript. What exactly did the empty <code>--entrypoint</code> value do?' + code(
              "$ docker image inspect nginx:1.27-alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'\n" +
              'ENTRYPOINT=[/docker-entrypoint.sh] CMD=[nginx -g daemon off;]\n' +
              '\n' +
              '$ docker run --rm --entrypoint "" nginx:1.27-alpine ls /docker-entrypoint.d\n' +
              '10-listen-on-ipv6-by-default.sh\n' +
              '15-local-resolvers.envsh\n' +
              '20-envsubst-on-templates.sh\n' +
              '30-tune-worker-processes.sh',
            ),
            'Đoạn terminal thật. Giá trị <code>--entrypoint</code> rỗng đã làm chính xác điều gì?' + code(
              "$ docker image inspect nginx:1.27-alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'\n" +
              'ENTRYPOINT=[/docker-entrypoint.sh] CMD=[nginx -g daemon off;]\n' +
              '\n' +
              '$ docker run --rm --entrypoint "" nginx:1.27-alpine ls /docker-entrypoint.d\n' +
              '10-listen-on-ipv6-by-default.sh\n' +
              '15-local-resolvers.envsh\n' +
              '20-envsubst-on-templates.sh\n' +
              '30-tune-worker-processes.sh',
            ),
          ),
          options: [
            B(
              'It ran the image\'s entrypoint script with no arguments at all, and the script happened to list its own hook directory before handing over to nginx',
              'Nó chạy script entrypoint của ảnh mà không kèm tham số nào, và script tình cờ liệt kê thư mục hook của chính nó trước khi bàn giao cho nginx',
            ),
            B(
              'It cleared the image\'s ENTRYPOINT, so the words after the image name became the entire command — the escape hatch for when an entrypoint script stands between you and the shell you want',
              'Nó xoá trắng ENTRYPOINT của ảnh, nên mấy chữ sau tên ảnh trở thành toàn bộ câu lệnh — đây là lối thoát khi một script entrypoint đứng chắn giữa bạn và cái shell bạn cần',
            ),
            B(
              'It replaced the entrypoint with <code>/bin/sh</code>, which is what Docker substitutes whenever the value passed to the flag is an empty string',
              'Nó thay entrypoint bằng <code>/bin/sh</code>, thứ mà Docker điền vào mỗi khi giá trị truyền cho cờ đó là chuỗi rỗng',
            ),
            B(
              'It told the daemon to reuse the entrypoint of the most recently created container from the same image, which in this case had already been cleared',
              'Nó bảo tiến trình nền dùng lại entrypoint của container được tạo gần nhất từ cùng ảnh đó, mà cái này thì đã bị xoá trắng từ trước',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The relationship is <code>final command = ENTRYPOINT + CMD</code>. Arguments after the image name replace CMD and are appended to ENTRYPOINT — so with the entrypoint still in place, <code>docker run nginx ls</code> would have run <code>/docker-entrypoint.sh ls</code>. Clearing it with <code>--entrypoint ""</code> leaves your words as the whole command. Note also that <code>--entrypoint sh</code> clears CMD, so the <code>-c \'…\'</code> has to go after the image name.',
            'Quan hệ là <code>câu lệnh cuối cùng = ENTRYPOINT + CMD</code>. Tham số sau tên ảnh thay thế CMD và được nối vào sau ENTRYPOINT — nên nếu entrypoint còn nguyên thì <code>docker run nginx ls</code> đã chạy thành <code>/docker-entrypoint.sh ls</code>. Xoá nó bằng <code>--entrypoint ""</code> để lại mấy chữ của bạn làm toàn bộ câu lệnh. Cũng lưu ý <code>--entrypoint sh</code> xoá luôn CMD, nên phần <code>-c \'…\'</code> phải nằm sau tên ảnh.',
          ),
        }),

        /* ── Chương 3 — ảnh & registry (5 câu) ────────────────────────────── */

        // q19 · đáp án 2
        mcq({
          prompt: B(
            'Real transcript. Why did the first push aim at Docker Hub when nothing in the command mentions it?' + code(
              '$ docker tag alpine:3.20 myregistry/demo:1.0\n' +
              '$ docker push myregistry/demo:1.0\n' +
              'The push refers to repository [docker.io/myregistry/demo]\n' +
              '\n' +
              '$ docker tag alpine:3.20 localhost:5999/demo:1.0\n' +
              '$ docker push localhost:5999/demo:1.0\n' +
              'The push refers to repository [localhost:5999/demo]',
            ),
            'Đoạn terminal thật. Vì sao lượt push đầu nhắm vào Docker Hub trong khi câu lệnh chẳng nhắc gì tới nó?' + code(
              '$ docker tag alpine:3.20 myregistry/demo:1.0\n' +
              '$ docker push myregistry/demo:1.0\n' +
              'The push refers to repository [docker.io/myregistry/demo]\n' +
              '\n' +
              '$ docker tag alpine:3.20 localhost:5999/demo:1.0\n' +
              '$ docker push localhost:5999/demo:1.0\n' +
              'The push refers to repository [localhost:5999/demo]',
            ),
          ),
          options: [
            B(
              'Because <code>1.0</code> is not a shape of tag a private registry accepts, Docker quietly falls back to the default registry whenever the tag looks like a bare version number',
              'Vì <code>1.0</code> không phải dạng tag mà registry riêng chấp nhận, Docker lặng lẽ lùi về registry mặc định mỗi khi cái tag trông như một số phiên bản trần',
            ),
            B(
              'Because <code>docker login</code> was last run against Docker Hub, and a push always follows whichever registry you most recently authenticated to',
              'Vì <code>docker login</code> gần nhất chạy với Docker Hub, và một lượt push luôn đi theo registry mà bạn xác thực gần nhất',
            ),
            B(
              'Docker treats the first component as a registry HOST only when it contains a dot or a colon, or is exactly <code>localhost</code>. <code>myregistry</code> has none of those, so it is read as a Hub account name — and the push then fails with an authentication error for an account you do not own',
              'Docker chỉ coi thành phần đầu là TÊN MÁY registry khi nó chứa dấu chấm hoặc dấu hai chấm, hoặc đúng bằng <code>localhost</code>. <code>myregistry</code> chẳng có thứ nào, nên nó bị đọc thành tên tài khoản trên Hub — và lượt push hỏng với lỗi xác thực cho một tài khoản không phải của bạn',
            ),
            B(
              'Only a registry listening on a port other than 443 is recognised as a host, so writing <code>myregistry:443/demo:1.0</code> is what makes Docker treat it as a real registry',
              'Chỉ registry nghe ở một cổng khác 443 mới được nhận là tên máy, nên viết <code>myregistry:443/demo:1.0</code> mới khiến Docker coi nó là một registry thật',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the whole of "<code>denied: requested access to the resource is denied</code> when I am definitely logged in". The repository name has to contain the destination: <code>cuonghoang1103/demo:1.0</code> for Hub, <code>ghcr.io/cuonghoang1103/demo:1.0</code> for GHCR, or <code>localhost:5000/demo</code> for a local registry. The same rule catches people with <code>minikube/app</code> and <code>k3s/app</code>.',
            'Đây là toàn bộ câu chuyện "<code>denied: requested access to the resource is denied</code> trong khi tôi rõ ràng đã đăng nhập". Tên kho phải chứa đích đến: <code>cuonghoang1103/demo:1.0</code> cho Hub, <code>ghcr.io/cuonghoang1103/demo:1.0</code> cho GHCR, hoặc <code>localhost:5000/demo</code> cho registry cục bộ. Cũng quy tắc đó tóm những ai gõ <code>minikube/app</code> hay <code>k3s/app</code>.',
          ),
        }),

        // q20 · đáp án 3
        mcq({
          prompt: B(
            'Real output from this machine. You want to pin this base image in a Dockerfile that both an ARM laptop and an x86 server build from. Which digest, and why?' + code(
              "$ docker image inspect alpine:3.20 --format '{{index .RepoDigests 0}}'\n" +
              'alpine@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc\n' +
              '\n' +
              '$ docker buildx imagetools inspect --raw alpine:3.20\n' +
              '{"manifests":[{ ... "digest":"sha256:c64c687cbea9300178b30c95835354e34c4e4feb...",\n' +
              '  "platform":{"architecture":"amd64","os":"linux"} }, ... ]}',
            ),
            'Output thật từ máy này. Bạn muốn ghim ảnh nền này trong một Dockerfile mà cả laptop ARM lẫn máy chủ x86 đều dựng. Chọn digest nào, và vì sao?' + code(
              "$ docker image inspect alpine:3.20 --format '{{index .RepoDigests 0}}'\n" +
              'alpine@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc\n' +
              '\n' +
              '$ docker buildx imagetools inspect --raw alpine:3.20\n' +
              '{"manifests":[{ ... "digest":"sha256:c64c687cbea9300178b30c95835354e34c4e4feb...",\n' +
              '  "platform":{"architecture":"amd64","os":"linux"} }, ... ]}',
            ),
          ),
          options: [
            B(
              'The <code>c64c687c…</code> one, because a digest taken from the manifests list is the only kind that a registry will verify byte for byte on download',
              'Cái <code>c64c687c…</code>, vì digest lấy từ danh sách manifest là loại duy nhất mà registry kiểm từng byte lúc tải về',
            ),
            B(
              'Either one: the two digests are two encodings of the same content, so whichever you paste, the registry resolves it to the same per-platform image',
              'Cái nào cũng được: hai digest là hai cách mã hoá cùng một nội dung, nên dán cái nào thì registry cũng phân giải ra đúng ảnh theo nền tảng',
            ),
            B(
              'Neither, because a digest cannot appear in a <code>FROM</code> line at all — you have to keep a moving tag there and pin the digest in your deployment manifest instead',
              'Không cái nào, vì digest không xuất hiện được trong dòng <code>FROM</code> — bạn phải để một tag di động ở đó rồi ghim digest trong bản kê khai triển khai',
            ),
            B(
              'The <code>d9e853e8…</code> one: it is the INDEX digest, which still resolves per platform on every machine. The <code>c64c687c…</code> value is one platform\'s manifest, and pinning that would make the ARM laptop pull an x86 image and fail with <code>exec format error</code>',
              'Cái <code>d9e853e8…</code>: đó là digest của CHỈ MỤC, thứ vẫn phân giải theo nền tảng trên mọi máy. Giá trị <code>c64c687c…</code> là manifest của đúng một nền tảng, ghim nó thì laptop ARM sẽ kéo về ảnh x86 và hỏng với <code>exec format error</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'One tag can point at an index containing several per-platform images, which is why <code>docker pull alpine</code> gives different bytes on an ARM laptop and an x86 server. <code>RepoDigests</code> and <code>docker buildx imagetools inspect --format \'{{.Manifest.Digest}}\'</code> both give you the index digest — that is the one to paste. And remember pinning is a commitment: pair it with Renovate or a scheduled rebuild, or you have frozen your security patches along with your versions.',
            'Một tag có thể trỏ vào một chỉ mục chứa nhiều ảnh theo nền tảng, và đó là lý do <code>docker pull alpine</code> cho ra byte khác nhau trên laptop ARM và máy chủ x86. Cả <code>RepoDigests</code> lẫn <code>docker buildx imagetools inspect --format \'{{.Manifest.Digest}}\'</code> đều trả về digest của chỉ mục — đó mới là cái đáng dán. Và nhớ rằng ghim là một cam kết: hãy kèm Renovate hay một lượt dựng lại định kỳ, không thì bạn đã đóng băng luôn cả các bản vá bảo mật cùng với phiên bản.',
          ),
        }),

        // q21 · đáp án 0
        mcq({
          prompt: B(
            'Real output from a machine that builds and deploys daily, now nearly out of disk. Which command comes first, and why?' + code(
              '$ docker system df\n' +
              'TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE\n' +
              'Images          68        10        54.72GB   21.59GB (39%)\n' +
              'Containers      21        1         545.2MB   545.2MB (99%)\n' +
              'Local Volumes   28        20        6.529GB   2.198GB (33%)\n' +
              'Build Cache     398       0         33.31GB   19.26GB',
            ),
            'Output thật từ một máy ngày nào cũng dựng và deploy, giờ sắp hết đĩa. Lệnh nào chạy trước, và vì sao?' + code(
              '$ docker system df\n' +
              'TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE\n' +
              'Images          68        10        54.72GB   21.59GB (39%)\n' +
              'Containers      21        1         545.2MB   545.2MB (99%)\n' +
              'Local Volumes   28        20        6.529GB   2.198GB (33%)\n' +
              'Build Cache     398       0         33.31GB   19.26GB',
            ),
          ),
          options: [
            B(
              '<code>docker builder prune</code> — 19.26GB reclaimable with ACTIVE 0, and the only cost is a slower next build; nothing can reference a cache entry by name, so the step needs no judgement at all',
              '<code>docker builder prune</code> — 19,26GB thu hồi được với ACTIVE 0, và cái giá duy nhất là lượt dựng sau chậm hơn; không thứ gì tham chiếu tới một mục cache bằng tên, nên bước này chẳng cần cân nhắc gì',
            ),
            B(
              '<code>docker system prune -a --volumes</code>, because it is the only command that reaches all four rows in a single pass and therefore frees the most space per keystroke',
              '<code>docker system prune -a --volumes</code>, vì nó là lệnh duy nhất chạm được cả bốn hàng trong một lượt nên giải phóng nhiều chỗ nhất trên mỗi lần gõ',
            ),
            B(
              '<code>docker volume prune</code> — 2.198GB, and Local Volumes is the row that grows fastest on a machine that rebuilds images every day',
              '<code>docker volume prune</code> — 2,198GB, và Local Volumes là hàng phình nhanh nhất trên một máy ngày nào cũng dựng lại ảnh',
            ),
            B(
              '<code>docker image prune -a</code>, because Images carries the largest SIZE of the four rows and is therefore where the largest single win must be',
              '<code>docker image prune -a</code>, vì Images có SIZE lớn nhất trong bốn hàng nên chắc chắn đó là chỗ có phần thắng lớn nhất',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The ladder goes build cache, then dangling images, then stopped containers, and only then anything that needs thought. <code>-a</code> removes every image no <em>running</em> container uses — on a server that includes the previous release you would redeploy to roll back, so a ten-second rollback becomes a registry pull at 3am. And never automate volume pruning: an anonymous volume with a random 64-character name is quite often somebody\'s database.',
            'Cái thang đi theo thứ tự bộ đệm dựng, rồi ảnh mồ côi, rồi container đã dừng, và chỉ sau đó mới tới thứ cần suy nghĩ. Cờ <code>-a</code> gỡ mọi ảnh không được một container <em>đang chạy</em> dùng — trên máy chủ điều đó gồm cả bản phát hành trước mà bạn sẽ deploy lại để lùi, nên một cú lùi mười giây biến thành một lượt kéo từ registry lúc 3 giờ sáng. Và đừng bao giờ tự động hoá việc dọn volume: một volume vô danh mang cái tên ngẫu nhiên 64 ký tự rất hay là cơ sở dữ liệu của ai đó.',
          ),
        }),

        // q22 · đáp án 1
        mcq({
          prompt: B(
            'Real transcript on an ARM host. An x86 image ran without <code>exec format error</code>. What is happening, and what does it cost?' + code(
              "$ docker version --format '{{.Server.Arch}}'\n" +
              'arm64\n' +
              '$ docker run --rm alpine:3.20 uname -m\n' +
              'aarch64\n' +
              '\n' +
              '$ docker pull -q --platform linux/amd64 alpine:3.20\n' +
              '$ docker run --rm --platform linux/amd64 alpine:3.20 uname -m\n' +
              'x86_64',
            ),
            'Đoạn terminal thật trên một máy chủ ARM. Một ảnh x86 chạy được mà không có <code>exec format error</code>. Chuyện gì đang xảy ra, và cái giá là gì?' + code(
              "$ docker version --format '{{.Server.Arch}}'\n" +
              'arm64\n' +
              '$ docker run --rm alpine:3.20 uname -m\n' +
              'aarch64\n' +
              '\n' +
              '$ docker pull -q --platform linux/amd64 alpine:3.20\n' +
              '$ docker run --rm --platform linux/amd64 alpine:3.20 uname -m\n' +
              'x86_64',
            ),
          ),
          options: [
            B(
              'The official alpine image ships a universal binary that carries machine code for both instruction sets, so no translation of any kind is taking place here',
              'Ảnh alpine chính thức giao một tệp nhị phân đa năng mang mã máy cho cả hai tập lệnh, nên ở đây chẳng có phép dịch nào diễn ra cả',
            ),
            B(
              'The foreign binaries are being routed through QEMU by <code>binfmt_misc</code>, so it genuinely executes — at roughly 5–20× the cost, which is fine for a quick check and unusable for a real build or a test suite',
              'Các tệp nhị phân lạ đang được <code>binfmt_misc</code> dẫn qua QEMU, nên nó chạy thật — với cái giá cỡ 5–20 lần, chấp nhận được cho một phép kiểm nhanh và vô dụng cho một lượt dựng thật hay một bộ kiểm thử',
            ),
            B(
              'Docker recompiled the layers for arm64 while pulling them, which is exactly why the <code>--platform</code> pull took noticeably longer than the plain one',
              'Docker biên dịch lại các tầng sang arm64 trong lúc kéo về, và đó chính là lý do lượt kéo có <code>--platform</code> lâu hơn hẳn lượt thường',
            ),
            B(
              '<code>uname</code> simply reports the platform that was requested rather than the CPU actually executing the code, so nothing was emulated and nothing was translated',
              '<code>uname</code> chỉ báo lại nền tảng được yêu cầu chứ không báo CPU thật đang chạy mã, nên chẳng có gì được mô phỏng và chẳng có gì được dịch',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Emulation is for producing an image you cannot build natively, and for a quick check. It is not a way to develop or to run CI: JIT compilers, code that probes CPU features and anything with a build-time timeout simply fail under it. The real answers are native runners in parallel, or cross-compilation with the <code>TARGETOS</code>/<code>TARGETARCH</code> build args BuildKit gives you for free.',
            'Mô phỏng là để tạo ra một ảnh mà bạn không dựng nguyên bản được, và để kiểm nhanh. Nó không phải cách để phát triển hay chạy CI: trình biên dịch JIT, mã dò tính năng CPU và bất cứ thứ gì có hạn giờ lúc dựng đều hỏng thẳng dưới nó. Đáp án thật là chạy máy dựng nguyên bản song song, hoặc biên dịch chéo bằng các tham số dựng <code>TARGETOS</code>/<code>TARGETARCH</code> mà BuildKit cho không.',
          ),
        }),

        // q23 · đáp án 2
        mcq({
          prompt: B(
            'A CI pipeline that has worked for months starts failing halfway through with ' + c('toomanyrequests: You have reached your pull rate limit') + '. Which fix addresses the mechanism?',
            'Một quy trình CI chạy êm hàng tháng trời bỗng hỏng giữa chừng với ' + c('toomanyrequests: You have reached your pull rate limit') + '. Cách chữa nào đúng vào cơ chế?',
          ),
          options: [
            B(
              'Retry the job, because the counting window is only a few seconds long and a second attempt almost always lands on a fresh budget',
              'Chạy lại công việc, vì cửa sổ đếm chỉ dài vài giây và lần thử thứ hai gần như luôn rơi vào một hạn mức mới',
            ),
            B(
              'Switch every base image to <code>:latest</code>, since the default tag is served from the CDN rather than counted against the registry quota',
              'Đổi mọi ảnh nền sang <code>:latest</code>, vì tag mặc định được phục vụ từ CDN chứ không tính vào hạn mức registry',
            ),
            B(
              'Authenticate in CI: anonymous pulls are counted per source IP, so a runner pool or an office NAT shares one budget. <code>docker login</code> moves the count onto your account, and hosting your own images on GHCR plus a pull-through mirror removes most of the rest',
              'Xác thực trong CI: lượt kéo ẩn danh được đếm theo IP nguồn, nên một dàn runner hay một NAT văn phòng dùng chung một hạn mức. <code>docker login</code> chuyển phần đếm sang tài khoản của bạn, còn đưa ảnh của mình lên GHCR cộng một gương kéo-xuyên-qua thì gỡ nốt phần lớn còn lại',
            ),
            B(
              'Add <code>--pull=always</code> so that every job downloads a fresh copy instead of reusing a stale one that has already been counted against the quota',
              'Thêm <code>--pull=always</code> để mỗi công việc tải một bản mới thay vì dùng lại bản cũ vốn đã bị tính vào hạn mức',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The counting is per source IP for anonymous pulls, which is exactly why a shared NAT or a cloud runner pool hits it while your laptop never does. Note the last option is the opposite of a fix — <code>--pull=always</code> increases the number of pulls. You can read the numbers that apply to you right now out of the registry\'s own response headers (<code>ratelimit-limit</code>, <code>ratelimit-remaining</code>) rather than trusting any documentation, including the course\'s.',
            'Phép đếm tính theo IP nguồn cho các lượt kéo ẩn danh, và đó đúng là lý do một NAT dùng chung hay một dàn runner đám mây đụng trần trong khi laptop của bạn thì không bao giờ. Để ý lựa chọn cuối là ngược lại của một cách chữa — <code>--pull=always</code> làm tăng số lượt kéo. Bạn đọc được con số đang áp cho mình ngay lúc này từ chính header phản hồi của registry (<code>ratelimit-limit</code>, <code>ratelimit-remaining</code>) thay vì tin bất kỳ tài liệu nào, kể cả tài liệu của khoá này.',
          ),
        }),

        /* ── Chương 4 — Dockerfile (7 câu) ────────────────────────────────── */

        // q24 · đáp án 3
        mcq({
          prompt: B(
            'Measured on this machine with BuildKit v0.30. The same directory, neither build has a <code>.dockerignore</code>. Why does A move 83 bytes?' + code(
              '# the directory holds src/ (83B), big.bin (20MB) and node_modules/ (30MB)\n' +
              '\n' +
              '# Dockerfile A                     # Dockerfile B\n' +
              'FROM alpine:3.20                   FROM alpine:3.20\n' +
              'WORKDIR /app                       WORKDIR /app\n' +
              'COPY src ./src                     COPY . .\n' +
              '\n' +
              'A:  => transferring context: 83B         resulting image  13.6MB\n' +
              'B:  => transferring context: 50.01MB     resulting image   114MB',
            ),
            'Đo trên máy này với BuildKit v0.30. Cùng một thư mục, cả hai lượt dựng đều không có <code>.dockerignore</code>. Vì sao A chỉ chuyển 83 byte?' + code(
              '# thư mục chứa src/ (83B), big.bin (20MB) và node_modules/ (30MB)\n' +
              '\n' +
              '# Dockerfile A                     # Dockerfile B\n' +
              'FROM alpine:3.20                   FROM alpine:3.20\n' +
              'WORKDIR /app                       WORKDIR /app\n' +
              'COPY src ./src                     COPY . .\n' +
              '\n' +
              'A:  => transferring context: 83B         ảnh thu được  13,6MB\n' +
              'B:  => transferring context: 50.01MB     ảnh thu được   114MB',
            ),
          ),
          options: [
            B(
              'A reused a context that an earlier build had already uploaded and cached on the daemon side, so the 83B line is only the delta since that upload; running the same build again with <code>--no-cache</code> would report the same 50.01MB that B reports, and the two images would then be the same size',
              'A dùng lại một ngữ cảnh mà lượt dựng trước đã tải lên và đệm sẵn ở phía tiến trình nền, nên dòng 83B chỉ là phần chênh kể từ lượt tải đó; chạy lại đúng lượt dựng ấy với <code>--no-cache</code> thì cũng báo đúng 50,01MB như B, và hai cái ảnh khi đó sẽ bằng nhau',
            ),
            B(
              'The daemon compresses the whole context before transferring it and reports the compressed figure, and <code>src</code> is the only part of this directory that compresses down to almost nothing — <code>big.bin</code> and <code>node_modules</code> hold random bytes, so B has nothing to gain from the same compression',
              'Tiến trình nền nén trọn ngữ cảnh trước khi chuyển rồi báo con số đã nén, và <code>src</code> là phần duy nhất của thư mục này nén xuống gần như còn không — <code>big.bin</code> với <code>node_modules</code> chứa byte ngẫu nhiên nên B chẳng được lợi gì từ chính phép nén ấy',
            ),
            B(
              'BuildKit refuses to transfer any single file above sixteen megabytes and silently leaves it out of the context, so <code>big.bin</code> and the archives inside <code>node_modules</code> are skipped automatically in A; B is larger only because <code>COPY . .</code> disables that size filter for the whole directory',
              'BuildKit từ chối chuyển bất cứ file đơn nào lớn hơn mười sáu megabyte và lặng lẽ để nó ngoài ngữ cảnh, nên <code>big.bin</code> và các kho nén trong <code>node_modules</code> tự động bị bỏ qua ở A; B to hơn chỉ vì <code>COPY . .</code> tắt bộ lọc kích thước đó cho cả thư mục',
            ),
            B(
              'BuildKit transfers only the paths a COPY actually asks for, so a selective COPY never pays for the rest of the directory. B says <code>COPY . .</code>, so everything travels — and lands in the image. <code>.dockerignore</code> is still worth writing: it is what protects B, and what keeps <code>.git</code> and <code>.env</code> out of a published image',
              'BuildKit chỉ chuyển những đường dẫn mà một lệnh COPY thật sự hỏi tới, nên một lệnh COPY có chọn lọc không bao giờ phải trả giá cho phần còn lại của thư mục. B viết <code>COPY . .</code> nên mọi thứ đi qua — và nằm luôn trong ảnh. <code>.dockerignore</code> vẫn đáng viết: nó là thứ bảo vệ B, và là thứ giữ <code>.git</code> với <code>.env</code> ở ngoài một ảnh đã công bố',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The course text describes the older behaviour, where the whole directory was tarred up and uploaded every time; measured here it is not. What did not change is the reason <code>.dockerignore</code> matters most: excluding <code>.env</code> and <code>.git</code> means a careless <code>COPY . .</code> cannot bake your credentials or your entire commit history into an image you publish. Write it before you write the Dockerfile, and start from your <code>.gitignore</code> plus <code>.git</code> itself.',
            'Phần chữ trong giáo trình mô tả hành vi cũ, khi cả thư mục bị đóng gói và tải lên mỗi lượt; đo ở đây thì không phải vậy. Thứ không đổi là lý do <code>.dockerignore</code> quan trọng nhất: loại <code>.env</code> và <code>.git</code> ra nghĩa là một lệnh <code>COPY . .</code> cẩu thả không thể nướng thông tin đăng nhập hay toàn bộ lịch sử commit của bạn vào một cái ảnh đem công bố. Hãy viết nó trước khi viết Dockerfile, khởi đi từ <code>.gitignore</code> của bạn cộng thêm chính <code>.git</code>.',
          ),
        }),

        // q25 · đáp án 0
        mcq({
          prompt: B(
            'Built and run on this machine. <code>/app</code> listed nothing and the file landed at <code>/file.txt</code>. Why?' + code(
              'FROM alpine:3.20\n' +
              'RUN mkdir /app\n' +
              'RUN cd /app\n' +
              'RUN echo marker > file.txt\n' +
              'CMD ["sh","-c","ls /app; ls /file.txt"]\n' +
              '\n' +
              '$ docker run --rm img\n' +
              '/file.txt',
            ),
            'Dựng và chạy trên máy này. <code>/app</code> chẳng liệt kê gì và file rơi vào <code>/file.txt</code>. Vì sao?' + code(
              'FROM alpine:3.20\n' +
              'RUN mkdir /app\n' +
              'RUN cd /app\n' +
              'RUN echo marker > file.txt\n' +
              'CMD ["sh","-c","ls /app; ls /file.txt"]\n' +
              '\n' +
              '$ docker run --rm img\n' +
              '/file.txt',
            ),
          ),
          options: [
            B(
              'Every RUN is a fresh shell in its own layer, so the <code>cd</code> is discarded when that instruction ends and the next one starts in the previous working directory — <code>WORKDIR</code> is the stateful instruction, and <code>ENV</code> replaces <code>RUN export</code> the same way',
              'Mỗi RUN là một shell mới trong tầng riêng của nó, nên lệnh <code>cd</code> bị vứt khi chỉ thị đó kết thúc và chỉ thị sau bắt đầu ở thư mục làm việc cũ — <code>WORKDIR</code> mới là chỉ thị có trạng thái, và <code>ENV</code> thay cho <code>RUN export</code> theo đúng kiểu ấy',
            ),
            B(
              'BuildKit reorders independent RUN instructions to improve cache reuse, so the <code>echo</code> was executed before the <code>cd</code> had a chance to take effect',
              'BuildKit sắp xếp lại các chỉ thị RUN độc lập để tận dụng cache tốt hơn, nên lệnh <code>echo</code> chạy trước khi <code>cd</code> kịp có tác dụng',
            ),
            B(
              '<code>mkdir /app</code> creates the directory in a layer that is discarded because nothing in it is referenced later, so the <code>cd</code> then failed silently',
              '<code>mkdir /app</code> tạo thư mục trong một tầng bị vứt đi vì không có gì trong đó được tham chiếu về sau, nên lệnh <code>cd</code> hỏng trong im lặng',
            ),
            B(
              'A bare relative path in a shell-form RUN is always resolved against <code>/</code>, so writing <code>RUN echo marker > ./file.txt</code> would have put the file in <code>/app</code>',
              'Một đường dẫn tương đối trần trong RUN dạng shell luôn được phân giải theo <code>/</code>, nên viết <code>RUN echo marker > ./file.txt</code> thì file đã nằm trong <code>/app</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The dangerous part is that this does not fail. The build is green and the image quietly has its files in the wrong place, which you discover at run time. <code>WORKDIR /app</code> is stateful across instructions and creates the directory if it is missing; that is the instruction to use. Where two commands genuinely belong together — install and clean up, for instance — chain them inside one RUN with <code>&&</code> so they also share one layer.',
            'Chỗ nguy hiểm là nó không hề báo hỏng. Lượt dựng vẫn xanh và cái ảnh lặng lẽ để file sai chỗ, tới lúc chạy bạn mới phát hiện. <code>WORKDIR /app</code> có trạng thái xuyên qua các chỉ thị và tự tạo thư mục nếu chưa có; đó là chỉ thị nên dùng. Chỗ nào hai câu lệnh thật sự thuộc về nhau — chẳng hạn cài đặt và dọn dẹp — thì nối chúng trong cùng một RUN bằng <code>&&</code> để chúng dùng chung một tầng.',
          ),
        }),

        // q26 · đáp án 1
        mcq({
          prompt: B(
            'Two images, identical except for one instruction, both run on this machine. What does the difference show?' + code(
              '$ tar -czf data.tar.gz -C pack .        # pack/ holds a.txt and b.txt\n' +
              '\n' +
              '# image A: ADD data.tar.gz /opt/     # image B: COPY data.tar.gz /opt/\n' +
              '$ docker run --rm imgA ls -1 /opt      $ docker run --rm imgB ls -1 /opt\n' +
              'a.txt                                  data.tar.gz\n' +
              'b.txt',
            ),
            'Hai ảnh giống hệt nhau trừ một chỉ thị, cùng chạy trên máy này. Khác biệt đó cho thấy điều gì?' + code(
              '$ tar -czf data.tar.gz -C pack .        # pack/ chứa a.txt và b.txt\n' +
              '\n' +
              '# ảnh A: ADD data.tar.gz /opt/       # ảnh B: COPY data.tar.gz /opt/\n' +
              '$ docker run --rm imgA ls -1 /opt      $ docker run --rm imgB ls -1 /opt\n' +
              'a.txt                                  data.tar.gz\n' +
              'b.txt',
            ),
          ),
          options: [
            B(
              'ADD could not copy the archive as one file and fell back to extracting whatever entries it was able to read out of it before giving up',
              'ADD không chép được cả kho nén thành một file nên lùi về việc giải nén những mục nào nó đọc được trước khi bỏ cuộc',
            ),
            B(
              'ADD auto-extracts a local tar archive while COPY copies the file as-is — that surprise, plus ADD\'s URL download which verifies no checksum, is why COPY is the default choice and remote files go through <code>RUN curl</code> with a <code>sha256sum -c</code>',
              'ADD tự giải nén một kho tar ở máy còn COPY chép nguyên file — cái bất ngờ đó, cộng với việc ADD tải URL mà không kiểm tổng nào, là lý do COPY là lựa chọn mặc định còn file ở xa thì đi qua <code>RUN curl</code> kèm <code>sha256sum -c</code>',
            ),
            B(
              'COPY has no support for compressed files, so it stored only the file name as a placeholder and the real contents never entered the image at all',
              'COPY không hỗ trợ file nén nên nó chỉ lưu cái tên file làm chỗ giữ chỗ, còn nội dung thật thì chưa từng vào trong ảnh',
            ),
            B(
              'The real difference is the trailing slash on <code>/opt/</code> rather than the instruction, and writing <code>COPY data.tar.gz /opt/</code> without it would have extracted too',
              'Khác biệt thật nằm ở dấu gạch chéo cuối trong <code>/opt/</code> chứ không phải ở chỉ thị, và viết <code>COPY data.tar.gz /opt/</code> mà bỏ nó đi thì cũng giải nén',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both of ADD\'s extra behaviours are traps. Auto-extraction is surprising when you meant to ship the archive, and <code>ADD &lt;url&gt;</code> downloads without checksum verification and without invalidating the cache when the remote content changes — so a build can silently ship different bytes on two different days. Use COPY unless you specifically want extraction, and fetch remote files explicitly so the verification is visible in the file.',
            'Cả hai hành vi phụ của ADD đều là bẫy. Tự giải nén gây bất ngờ khi bạn định giao chính cái kho nén, còn <code>ADD &lt;url&gt;</code> tải về mà không kiểm tổng và không làm mất hiệu lực cache khi nội dung ở xa đổi — nên một lượt dựng có thể lặng lẽ giao byte khác nhau vào hai ngày khác nhau. Hãy dùng COPY trừ khi bạn cố ý muốn giải nén, và tải file ở xa một cách tường minh để phép kiểm nhìn thấy được ngay trong file.',
          ),
        }),

        // q27 · đáp án 2
        mcq({
          prompt: B(
            'Real transcript. The build succeeded with no warning at all. What happened?' + code(
              'FROM alpine:3.20\n' +
              "CMD ['echo', 'hi']\n" +
              '\n' +
              '$ docker build -t img .\n' +
              '$ docker run --rm img\n' +
              '/bin/sh: [echo,: not found\n' +
              '\n' +
              "$ docker image inspect img --format '{{.Config.Cmd}}'\n" +
              "[/bin/sh -c ['echo', 'hi']]",
            ),
            'Đoạn terminal thật. Lượt dựng thành công, không một lời cảnh báo. Chuyện gì đã xảy ra?' + code(
              'FROM alpine:3.20\n' +
              "CMD ['echo', 'hi']\n" +
              '\n' +
              '$ docker build -t img .\n' +
              '$ docker run --rm img\n' +
              '/bin/sh: [echo,: not found\n' +
              '\n' +
              "$ docker image inspect img --format '{{.Config.Cmd}}'\n" +
              "[/bin/sh -c ['echo', 'hi']]",
            ),
          ),
          options: [
            B(
              'Alpine has no <code>echo</code> binary on the PATH, and the JSON array itself was perfectly fine — the same file on a Debian base would have worked',
              'Alpine không có chương trình <code>echo</code> trên PATH, còn bản thân mảng JSON thì hoàn toàn ổn — vẫn file đó trên nền Debian là chạy được',
            ),
            B(
              'CMD in exec form accepts at most one element, so the second string turned the whole instruction into an invalid command line',
              'CMD ở dạng exec chỉ nhận nhiều nhất một phần tử, nên chuỗi thứ hai đã biến cả chỉ thị thành một dòng lệnh không hợp lệ',
            ),
            B(
              'Single quotes are not valid JSON, so Docker silently treated the whole line as SHELL form and ran <code>/bin/sh -c</code> on the literal text — the inspect output shows exactly that, and it is how you check',
              'Dấu nháy đơn không phải JSON hợp lệ, nên Docker lặng lẽ coi cả dòng là dạng SHELL rồi chạy <code>/bin/sh -c</code> trên đúng chuỗi chữ đó — output của inspect cho thấy y như vậy, và đó là cách để kiểm',
            ),
            B(
              'The file is missing the <code>#</code> <code>syntax=docker/dockerfile:1</code> parser directive, without which exec form is not available to the frontend',
              'File thiếu chỉ thị bộ phân tích <code>#</code> <code>syntax=docker/dockerfile:1</code>, mà không có nó thì frontend không dùng được dạng exec',
            ),
          ],
          correct: 2,
          explanation: EX(
            'There is no warning at build time, which is what makes this expensive: the image builds, pushes and deploys green and only dies when a container starts. Exec form means a JSON array with double quotes, and <code>docker image inspect img --format \'{{.Config.Cmd}}\'</code> is the check — exec form shows the array intact, shell form shows <code>[/bin/sh -c …]</code>. The same mistake in ENTRYPOINT is worse still, because a shell-form ENTRYPOINT makes CMD ignored entirely.',
            'Lúc dựng không có cảnh báo nào, và đó là thứ khiến nó đắt: ảnh dựng xanh, đẩy xanh, deploy xanh, rồi chỉ chết khi một container khởi động. Dạng exec nghĩa là một mảng JSON với dấu nháy kép, và <code>docker image inspect img --format \'{{.Config.Cmd}}\'</code> là phép kiểm — dạng exec hiện nguyên mảng, dạng shell hiện <code>[/bin/sh -c …]</code>. Cũng lỗi đó ở ENTRYPOINT còn tệ hơn, vì ENTRYPOINT dạng shell làm CMD bị bỏ qua hoàn toàn.',
          ),
        }),

        // q28 · đáp án 3
        mcq({
          prompt: B(
            'Real measurement. <code>lib/</code> is 7.8MB on disk. Why does image A cost 16MB more than image B?' + code(
              '# image A                          # image B\n' +
              'COPY lib ./lib                     COPY --chown=app:app lib ./lib\n' +
              'RUN chown -R app:app /app\n' +
              '\n' +
              "$ docker images --format '{{.Repository}} {{.Size}}'\n" +
              'pt-chown    46.1MB\n' +
              'pt-copyown  29.9MB\n' +
              '\n' +
              "$ docker history pt-chown --format 'table {{.CreatedBy}}\\t{{.Size}}'\n" +
              'RUN /bin/sh -c chown -R app:app /app …   8.2MB\n' +
              'COPY lib ./lib # buildkit                8.2MB',
            ),
            'Số đo thật. <code>lib/</code> nặng 7,8MB trên đĩa. Vì sao ảnh A tốn hơn ảnh B tới 16MB?' + code(
              '# ảnh A                            # ảnh B\n' +
              'COPY lib ./lib                     COPY --chown=app:app lib ./lib\n' +
              'RUN chown -R app:app /app\n' +
              '\n' +
              "$ docker images --format '{{.Repository}} {{.Size}}'\n" +
              'pt-chown    46.1MB\n' +
              'pt-copyown  29.9MB\n' +
              '\n' +
              "$ docker history pt-chown --format 'table {{.CreatedBy}}\\t{{.Size}}'\n" +
              'RUN /bin/sh -c chown -R app:app /app …   8.2MB\n' +
              'COPY lib ./lib # buildkit                8.2MB',
            ),
          ),
          options: [
            B(
              '<code>chown -R</code> has to walk the directory tree and BuildKit stores that walk as an index alongside the layer, and the index is roughly the size of the data it indexes',
              '<code>chown -R</code> phải đi hết cây thư mục và BuildKit lưu lượt đi đó thành một chỉ mục nằm cạnh cái tầng, mà chỉ mục thì to xấp xỉ dữ liệu nó lập chỉ mục',
            ),
            B(
              'Image A has one more instruction, and every instruction in a Dockerfile carries a fixed overhead of about eight megabytes of layer metadata',
              'Ảnh A có thêm một chỉ thị, và mỗi chỉ thị trong Dockerfile mang một khoản phí cố định khoảng tám megabyte siêu dữ liệu tầng',
            ),
            B(
              'The <code>app</code> user does not exist yet when <code>COPY</code> runs in image A, so the files are stored twice, once for root and once for the numeric owner',
              'Người dùng <code>app</code> chưa tồn tại lúc <code>COPY</code> chạy ở ảnh A, nên file được lưu hai lần, một lần cho root và một lần cho chủ sở hữu dạng số',
            ),
            B(
              'Changing a file\'s metadata is a write, and a write copies the file up into the new layer — so <code>chown -R</code> duplicates every copied file into a second 8.2MB layer, while <code>COPY --chown</code> sets ownership as the bytes are written and costs nothing extra',
              'Đổi siêu dữ liệu của một file cũng là ghi, và ghi thì chép file lên tầng mới — nên <code>chown -R</code> nhân đôi mọi file đã chép vào một tầng 8,2MB thứ hai, còn <code>COPY --chown</code> đặt quyền sở hữu ngay lúc ghi byte và không tốn thêm gì',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is copy-on-write again, seen from the build side: the two 8.2MB rows in the history are the same files stored twice. On a <code>node_modules</code> with 40,000 files the same mistake adds hundreds of megabytes for a permission change. The same applies to <code>RUN chmod -R</code>, where <code>COPY --chmod</code> is the free version. Note that the image sizes here also double-count shared layers, which is why the totals are larger than the layer arithmetic suggests.',
            'Vẫn là sao-chép-khi-ghi, nhìn từ phía dựng ảnh: hai dòng 8,2MB trong lịch sử là cùng những file đó được lưu hai lần. Trên một <code>node_modules</code> bốn vạn file thì cũng lỗi ấy thêm hàng trăm megabyte chỉ để đổi quyền. Điều đó đúng luôn với <code>RUN chmod -R</code>, chỗ mà <code>COPY --chmod</code> là bản miễn phí. Cũng lưu ý kích thước ảnh ở đây còn đếm hai lần các tầng dùng chung, nên tổng lớn hơn phép cộng tầng gợi ra.',
          ),
        }),

        // q29 · đáp án 0
        mcq({
          prompt: B(
            'Real build failure on this machine. <code>typescript</code> is listed in <code>devDependencies</code>. What happened, and what is the fix?' + code(
              'FROM node:22-alpine\n' +
              'ENV NODE_ENV=production\n' +
              'WORKDIR /app\n' +
              'COPY package.json package-lock.json ./\n' +
              'RUN npm ci\n' +
              'RUN npm run build\n' +
              '\n' +
              '#8 0.223 sh: tsc: not found\n' +
              'ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build"\n' +
              'did not complete successfully: exit code: 127',
            ),
            'Lượt dựng hỏng thật trên máy này. <code>typescript</code> nằm trong <code>devDependencies</code>. Chuyện gì đã xảy ra, và chữa thế nào?' + code(
              'FROM node:22-alpine\n' +
              'ENV NODE_ENV=production\n' +
              'WORKDIR /app\n' +
              'COPY package.json package-lock.json ./\n' +
              'RUN npm ci\n' +
              'RUN npm run build\n' +
              '\n' +
              '#8 0.223 sh: tsc: not found\n' +
              'ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build"\n' +
              'did not complete successfully: exit code: 127',
            ),
          ),
          options: [
            B(
              '<code>npm ci</code> reads NODE_ENV and omitted devDependencies, so <code>tsc</code> was never installed and 127 is "command not found" — set NODE_ENV=production after the build, or only in the final stage of a multi-stage build',
              '<code>npm ci</code> đọc NODE_ENV rồi bỏ qua devDependencies, nên <code>tsc</code> chưa từng được cài và 127 là "không tìm thấy câu lệnh" — hãy đặt NODE_ENV=production sau khi dựng xong, hoặc chỉ ở stage cuối của một lượt dựng nhiều tầng',
            ),
            B(
              'Inside a container <code>typescript</code> has to be a production dependency, because Docker installs from the lockfile rather than from <code>package.json</code>',
              'Bên trong container thì <code>typescript</code> phải là thư viện production, vì Docker cài từ lockfile chứ không từ <code>package.json</code>',
            ),
            B(
              'The <code>node_modules</code> directory was excluded from the build context, so the packages that <code>npm ci</code> installed never reached the next layer',
              'Thư mục <code>node_modules</code> bị loại khỏi ngữ cảnh dựng, nên các gói mà <code>npm ci</code> cài chưa từng tới được tầng kế tiếp',
            ),
            B(
              '<code>npm ci</code> does not link executables into <code>node_modules/.bin</code>, so a script that calls a binary by name has to spell out the full path instead',
              '<code>npm ci</code> không tạo liên kết chương trình vào <code>node_modules/.bin</code>, nên một script gọi chương trình theo tên thì phải ghi ra đường dẫn đầy đủ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'An <code>ENV</code> line changes the behaviour of every RUN after it, which is easy to forget because nothing announces it — the install step succeeds and the failure surfaces two lines later with an exit code that names the wrong problem. Build with dev dependencies, ship without them. The same shape appears elsewhere: Python\'s <code>PIP_NO_DEPS</code>, Ruby\'s <code>BUNDLE_WITHOUT</code>, and any environment variable a package manager reads.',
            'Một dòng <code>ENV</code> đổi hành vi của mọi RUN sau nó, và điều đó rất dễ quên vì chẳng có gì thông báo — bước cài chạy trót lọt còn chỗ hỏng nổi lên hai dòng sau với một mã thoát gọi tên sai vấn đề. Hãy dựng với thư viện phát triển, và giao đi mà không có chúng. Cùng hình dạng ấy còn ở chỗ khác: <code>PIP_NO_DEPS</code> của Python, <code>BUNDLE_WITHOUT</code> của Ruby, và bất kỳ biến môi trường nào mà một trình quản lý gói đọc tới.',
          ),
        }),

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'One image, four runs, all measured. Which single rule matches every line of output?' + code(
              'FROM alpine:3.20\n' +
              'ENTRYPOINT ["echo"]\n' +
              'CMD ["hello"]\n' +
              '\n' +
              '$ docker run --rm img                                  -> hello\n' +
              '$ docker run --rm img goodbye                          -> goodbye\n' +
              '$ docker run --rm img a b                              -> a b\n' +
              "$ docker run --rm --entrypoint sh img -c 'echo done'   -> done",
            ),
            'Một ảnh, bốn lượt chạy, đều đo thật. Quy tắc DUY NHẤT nào khớp mọi dòng output?' + code(
              'FROM alpine:3.20\n' +
              'ENTRYPOINT ["echo"]\n' +
              'CMD ["hello"]\n' +
              '\n' +
              '$ docker run --rm img                                  -> hello\n' +
              '$ docker run --rm img goodbye                          -> goodbye\n' +
              '$ docker run --rm img a b                              -> a b\n' +
              "$ docker run --rm --entrypoint sh img -c 'echo done'   -> done",
            ),
          ),
          options: [
            B(
              'Whatever appears last on the command line always wins, and <code>--entrypoint</code> is simply a way of renaming the program that ends up running',
              'Thứ xuất hiện cuối cùng trên dòng lệnh luôn thắng, còn <code>--entrypoint</code> chỉ là một cách đổi tên chương trình rốt cuộc được chạy',
            ),
            B(
              'ENTRYPOINT is the program and CMD is its default arguments; anything after the image name REPLACES CMD and is appended to ENTRYPOINT — and <code>--entrypoint</code> replaces the program, so what follows the image name becomes the new CMD',
              'ENTRYPOINT là chương trình còn CMD là tham số mặc định của nó; mọi thứ sau tên ảnh THAY THẾ CMD và được nối vào sau ENTRYPOINT — còn <code>--entrypoint</code> thay chính chương trình, nên phần sau tên ảnh trở thành CMD mới',
            ),
            B(
              'CMD and ENTRYPOINT are concatenated only when neither of the two is written in exec form, and in exec form the later instruction silently wins',
              'CMD và ENTRYPOINT chỉ được nối lại khi cả hai đều không viết ở dạng exec, còn ở dạng exec thì chỉ thị đứng sau lặng lẽ thắng',
            ),
            B(
              'Arguments after the image name replace ENTRYPOINT while CMD survives as the default, which is why the third run printed both of its words',
              'Tham số sau tên ảnh thay thế ENTRYPOINT còn CMD sống sót làm giá trị mặc định, và đó là lý do lượt chạy thứ ba in ra cả hai chữ của nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read it as one sentence and every combination follows. ENTRYPOINT-only images behave like a single command (<code>ENTRYPOINT ["jq"]</code> makes <code>docker run img -S .</code> run <code>jq -S .</code>). CMD-only images are fully replaceable. The pair is what official images use, and it is why <code>docker run postgres:16-alpine postgres -c log_statement=all</code> still goes through the image\'s entrypoint script. Note the fourth line: <code>--entrypoint</code> also clears CMD, which is why <code>-c \'echo done\'</code> had to be spelled out.',
            'Đọc nó thành một câu là mọi tổ hợp tự suy ra. Ảnh chỉ có ENTRYPOINT thì hành xử như một câu lệnh duy nhất (<code>ENTRYPOINT ["jq"]</code> khiến <code>docker run img -S .</code> chạy thành <code>jq -S .</code>). Ảnh chỉ có CMD thì thay thế được hoàn toàn. Cặp cả hai là thứ các ảnh chính thức dùng, và đó là lý do <code>docker run postgres:16-alpine postgres -c log_statement=all</code> vẫn đi qua script entrypoint của ảnh. Để ý dòng thứ tư: <code>--entrypoint</code> còn xoá luôn CMD, vì thế phải ghi rõ <code>-c \'echo done\'</code>.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q31 — Triage from <code>docker inspect</code> (chapters 1 + 2).</b> You are given the fields a triage script reads back for every container on a host. Implement two functions that turn them into a verdict.</p>' +
            '<p><code>chanDoan(c)</code> returns <code>{ verdict, where }</code>. Decide <code>verdict</code> in this order:</p>' +
            '<ul>' +
            '<li><code>Status</code> is <code>&quot;created&quot;</code> → <b>never-started</b> (it was configured and never run).</li>' +
            '<li><code>Status</code> is <code>&quot;running&quot;</code> → <b>crash-loop</b> when <code>RestartCount &gt;= 3</code>, otherwise <b>ok</b>.</li>' +
            '<li>Otherwise read <code>ExitCode</code>: <code>0</code> → <b>clean-exit</b>, <code>125</code> → <b>docker-error</b>, <code>126</code> → <b>not-executable</b>, <code>127</code> → <b>not-found</b>, <code>143</code> → <b>sigterm</b>.</li>' +
            '<li><code>137</code> → <b>oom-killed</b> when <code>OOMKilled</code> is true, otherwise <b>sigkill</b>.</li>' +
            '<li>Any other non-zero code → <b>app-error</b>.</li>' +
            '</ul>' +
            '<p><code>where</code> says where the real message lives: <code>&quot;dmesg&quot;</code> for <b>oom-killed</b>; <code>&quot;cli-stderr&quot;</code> for <b>never-started</b>, <b>docker-error</b>, <b>not-executable</b> and <b>not-found</b> (those four never produced a line of container output); <code>&quot;logs&quot;</code> for everything else.</p>' +
            '<p><code>tomTat(list)</code> counts how many containers fall into each <code>where</code> and returns one string, keys sorted alphabetically, in the form <code>&quot;cli-stderr=4 dmesg=1 logs=6&quot;</code>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Phân loại từ <code>docker inspect</code> (chương 1 + 2).</b> Đề cho sẵn những trường mà một script phân loại đọc về cho mọi container trên một máy chủ. Hãy cài đặt hai hàm biến chúng thành một kết luận.</p>' +
            '<p><code>chanDoan(c)</code> trả về <code>{ verdict, where }</code>. Quyết định <code>verdict</code> theo đúng thứ tự này:</p>' +
            '<ul>' +
            '<li><code>Status</code> là <code>&quot;created&quot;</code> → <b>never-started</b> (đã cấu hình mà chưa từng chạy).</li>' +
            '<li><code>Status</code> là <code>&quot;running&quot;</code> → <b>crash-loop</b> khi <code>RestartCount &gt;= 3</code>, ngược lại là <b>ok</b>.</li>' +
            '<li>Còn lại thì đọc <code>ExitCode</code>: <code>0</code> → <b>clean-exit</b>, <code>125</code> → <b>docker-error</b>, <code>126</code> → <b>not-executable</b>, <code>127</code> → <b>not-found</b>, <code>143</code> → <b>sigterm</b>.</li>' +
            '<li><code>137</code> → <b>oom-killed</b> khi <code>OOMKilled</code> là true, ngược lại là <b>sigkill</b>.</li>' +
            '<li>Mọi mã khác không còn lại → <b>app-error</b>.</li>' +
            '</ul>' +
            '<p><code>where</code> cho biết thông báo thật nằm ở đâu: <code>&quot;dmesg&quot;</code> với <b>oom-killed</b>; <code>&quot;cli-stderr&quot;</code> với <b>never-started</b>, <b>docker-error</b>, <b>not-executable</b> và <b>not-found</b> (bốn ca đó chưa từng in ra một dòng output nào của container); <code>&quot;logs&quot;</code> với mọi ca còn lại.</p>' +
            '<p><code>tomTat(list)</code> đếm xem mỗi giá trị <code>where</code> có bao nhiêu container rồi trả về MỘT chuỗi, khoá xếp theo bảng chữ cái, dạng <code>&quot;cli-stderr=4 dmesg=1 logs=6&quot;</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const INSPECT = [\n' +
            "  { Name: 'web',     Status: 'running', ExitCode: 0,   OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'api',     Status: 'running', ExitCode: 0,   OOMKilled: false, RestartCount: 7 },\n" +
            "  { Name: 'job',     Status: 'created', ExitCode: 0,   OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'migrate', Status: 'exited',  ExitCode: 0,   OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'flags',   Status: 'exited',  ExitCode: 125, OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'hook',    Status: 'exited',  ExitCode: 126, OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'tool',    Status: 'exited',  ExitCode: 127, OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'worker',  Status: 'exited',  ExitCode: 137, OOMKilled: true,  RestartCount: 2 },\n" +
            "  { Name: 'cache',   Status: 'exited',  ExitCode: 137, OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'proxy',   Status: 'exited',  ExitCode: 143, OOMKilled: false, RestartCount: 0 },\n" +
            "  { Name: 'seed',    Status: 'exited',  ExitCode: 1,   OOMKilled: false, RestartCount: 0 },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function chanDoan(c) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function tomTat(list) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const c of INSPECT) console.log(c.Name.padEnd(8), JSON.stringify(chanDoan(c)));\n' +
            "console.log('tomTat:', tomTat(INSPECT));\n",
          expectedOutput:
            'web      {"verdict":"ok","where":"logs"}\n' +
            'api      {"verdict":"crash-loop","where":"logs"}\n' +
            'job      {"verdict":"never-started","where":"cli-stderr"}\n' +
            'migrate  {"verdict":"clean-exit","where":"logs"}\n' +
            'flags    {"verdict":"docker-error","where":"cli-stderr"}\n' +
            'hook     {"verdict":"not-executable","where":"cli-stderr"}\n' +
            'tool     {"verdict":"not-found","where":"cli-stderr"}\n' +
            'worker   {"verdict":"oom-killed","where":"dmesg"}\n' +
            'cache    {"verdict":"sigkill","where":"logs"}\n' +
            'proxy    {"verdict":"sigterm","where":"logs"}\n' +
            'seed     {"verdict":"app-error","where":"logs"}\n' +
            'tomTat: cli-stderr=4 dmesg=1 logs=6',
          sampleSolution:
            'function chanDoan(c) {\n' +
            "  const CLI = new Set(['docker-error', 'never-started', 'not-executable', 'not-found']);\n" +
            '  let ket;\n' +
            "  if (c.Status === 'created') ket = 'never-started';\n" +
            "  else if (c.Status === 'running') ket = c.RestartCount >= 3 ? 'crash-loop' : 'ok';\n" +
            "  else if (c.ExitCode === 0) ket = 'clean-exit';\n" +
            "  else if (c.ExitCode === 125) ket = 'docker-error';\n" +
            "  else if (c.ExitCode === 126) ket = 'not-executable';\n" +
            "  else if (c.ExitCode === 127) ket = 'not-found';\n" +
            "  else if (c.ExitCode === 137) ket = c.OOMKilled ? 'oom-killed' : 'sigkill';\n" +
            "  else if (c.ExitCode === 143) ket = 'sigterm';\n" +
            "  else ket = 'app-error';\n" +
            "  const noiXem = ket === 'oom-killed' ? 'dmesg' : CLI.has(ket) ? 'cli-stderr' : 'logs';\n" +
            '  return { verdict: ket, where: noiXem };\n' +
            '}\n\n' +
            'function tomTat(list) {\n' +
            '  const d = {};\n' +
            '  for (const c of list) {\n' +
            '    const w = chanDoan(c).where;\n' +
            '    d[w] = (d[w] || 0) + 1;\n' +
            '  }\n' +
            "  return Object.keys(d).sort().map((k) => k + '=' + d[k]).join(' ');\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Expand an image reference (chapter 3).</b> <code>nginx</code> looks like a name and is really four fields with three of them left blank. Implement <code>docTenAnh(ref)</code>, which fills the blanks in exactly the way Docker does.</p>' +
            '<ul>' +
            '<li>If the reference contains <code>@</code>, everything after it is the <b>digest</b> and everything before it is the name part.</li>' +
            '<li>Split the name part on <code>/</code>. The first component is the <b>registry</b> ONLY when there is more than one component AND it contains a dot or a colon, or is exactly <code>localhost</code>. Otherwise the registry is <code>&quot;docker.io&quot;</code>.</li>' +
            '<li>The LAST component holds the repository and, after the last <code>:</code>, the <b>tag</b>. Everything between registry and repository is the <b>namespace</b>, joined with <code>/</code>.</li>' +
            '<li>An empty namespace becomes <code>&quot;library&quot;</code> when the registry is <code>docker.io</code>, and stays the empty string otherwise.</li>' +
            '<li>A missing tag is <code>&quot;latest&quot;</code> — except when a digest is present and no tag was written, where it is <code>null</code>.</li>' +
            '<li>Also return <code>full</code>: <code>registry/[namespace/]repository[:tag][@digest]</code>, omitting each bracketed part that is absent.</li>' +
            '</ul>' +
            '<p>Keep the given list and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Khai triển một tham chiếu ảnh (chương 3).</b> <code>nginx</code> trông như một cái tên mà thật ra là bốn trường với ba trường bỏ trống. Hãy cài đặt <code>docTenAnh(ref)</code>, điền vào chỗ trống đúng theo cách Docker làm.</p>' +
            '<ul>' +
            '<li>Nếu tham chiếu có <code>@</code>, phần sau nó là <b>digest</b> còn phần trước nó là phần tên.</li>' +
            '<li>Tách phần tên theo <code>/</code>. Thành phần đầu là <b>registry</b> CHỈ KHI có nhiều hơn một thành phần VÀ nó chứa dấu chấm hoặc dấu hai chấm, hoặc đúng bằng <code>localhost</code>. Ngược lại registry là <code>&quot;docker.io&quot;</code>.</li>' +
            '<li>Thành phần CUỐI chứa tên kho và, sau dấu <code>:</code> cuối cùng, là <b>tag</b>. Mọi thứ nằm giữa registry và tên kho là <b>namespace</b>, nối lại bằng <code>/</code>.</li>' +
            '<li>Namespace rỗng thành <code>&quot;library&quot;</code> khi registry là <code>docker.io</code>, còn lại thì giữ nguyên chuỗi rỗng.</li>' +
            '<li>Thiếu tag thì là <code>&quot;latest&quot;</code> — trừ khi có digest mà không viết tag, lúc đó là <code>null</code>.</li>' +
            '<li>Trả về thêm <code>full</code>: <code>registry/[namespace/]repository[:tag][@digest]</code>, bỏ đi phần nào trong ngoặc mà không có.</li>' +
            '</ul>' +
            '<p>Giữ nguyên danh sách cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const REFS = [\n' +
            "  'nginx',\n" +
            "  'nginx:1.27-alpine',\n" +
            "  'bitnami/nginx',\n" +
            "  'ghcr.io/jqlang/jq:latest',\n" +
            "  'myregistry/app',\n" +
            "  'localhost:5000/app',\n" +
            "  'registry.internal:5000/team/edge/app:v2',\n" +
            "  'alpine@sha256:d9e853e87e55526f6b2917df91a2115c36dd7c696a35be12163d44e6e2a4b6bc',\n" +
            "  'node:22-alpine@sha256:0011223344556677889900112233445566778899001122334455667788990011',\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function docTenAnh(ref) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const gon = (d) => (d === null ? 'null' : d.slice(0, 19) + '..');\n" +
            'for (const r of REFS) {\n' +
            '  const o = docTenAnh(r);\n' +
            "  console.log('reg=' + o.registry + ' ns=[' + o.namespace + '] repo=' + o.repository +\n" +
            "              ' tag=' + o.tag + ' dig=' + gon(o.digest));\n" +
            "  console.log('  ' + o.full.replace(/(@sha256:.{12}).*/, '$1..'));\n" +
            '}\n',
          expectedOutput:
            'reg=docker.io ns=[library] repo=nginx tag=latest dig=null\n' +
            '  docker.io/library/nginx:latest\n' +
            'reg=docker.io ns=[library] repo=nginx tag=1.27-alpine dig=null\n' +
            '  docker.io/library/nginx:1.27-alpine\n' +
            'reg=docker.io ns=[bitnami] repo=nginx tag=latest dig=null\n' +
            '  docker.io/bitnami/nginx:latest\n' +
            'reg=ghcr.io ns=[jqlang] repo=jq tag=latest dig=null\n' +
            '  ghcr.io/jqlang/jq:latest\n' +
            'reg=docker.io ns=[myregistry] repo=app tag=latest dig=null\n' +
            '  docker.io/myregistry/app:latest\n' +
            'reg=localhost:5000 ns=[] repo=app tag=latest dig=null\n' +
            '  localhost:5000/app:latest\n' +
            'reg=registry.internal:5000 ns=[team/edge] repo=app tag=v2 dig=null\n' +
            '  registry.internal:5000/team/edge/app:v2\n' +
            'reg=docker.io ns=[library] repo=alpine tag=null dig=sha256:d9e853e87e55..\n' +
            '  docker.io/library/alpine@sha256:d9e853e87e55..\n' +
            'reg=docker.io ns=[library] repo=node tag=22-alpine dig=sha256:001122334455..\n' +
            '  docker.io/library/node:22-alpine@sha256:001122334455..',
          sampleSolution:
            'function docTenAnh(ref) {\n' +
            '  let digest = null;\n' +
            '  let phanTen = ref;\n' +
            "  const at = ref.indexOf('@');\n" +
            '  if (at >= 0) {\n' +
            '    digest = ref.slice(at + 1);\n' +
            '    phanTen = ref.slice(0, at);\n' +
            '  }\n\n' +
            "  const khuc = phanTen.split('/');\n" +
            "  let registry = 'docker.io';\n" +
            "  if (khuc.length > 1 && (khuc[0].includes('.') || khuc[0].includes(':') || khuc[0] === 'localhost')) {\n" +
            '    registry = khuc.shift();\n' +
            '  }\n\n' +
            '  const cuoi = khuc.pop();\n' +
            "  const hai = cuoi.lastIndexOf(':');\n" +
            '  const repository = hai >= 0 ? cuoi.slice(0, hai) : cuoi;\n' +
            '  let tag = hai >= 0 ? cuoi.slice(hai + 1) : null;\n' +
            "  if (tag === null) tag = digest ? null : 'latest';\n\n" +
            "  let namespace = khuc.join('/');\n" +
            "  if (namespace === '') namespace = registry === 'docker.io' ? 'library' : '';\n\n" +
            "  const duoi = tag ? ':' + tag : '';\n" +
            "  const bam = digest ? '@' + digest : '';\n" +
            "  const giua = namespace ? namespace + '/' : '';\n" +
            '  return {\n' +
            '    registry, namespace, repository, tag, digest,\n' +
            "    full: registry + '/' + giua + repository + duoi + bam,\n" +
            '  };\n' +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
