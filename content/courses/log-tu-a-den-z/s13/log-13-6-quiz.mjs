/**
 * 13.6 — Kiểm tra Chương 13 (soạn 24/11/2026, agent lgz). 8 câu; đáp số dựa trên output thật OUT['s13/*'].
 * Phân bố đáp án: A ×2 (3, 8) · B ×2 (1, 6) · C ×2 (2, 7) · D ×2 (4, 5).
 */
export default {
  title: '13.6 — Chapter 13 quiz|||13.6 — Kiểm tra Chương 13',
  slug: 'log-13-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Tám câu: stderr bị ống bỏ qua, 137 không phải lúc nào cũng là OOM, log trống vì đệm stdout, kubectl logs --previous, ImagePullBackOff chỉ có trong event, đọc X-Forwarded-For, trust proxy và giới hạn đăng nhập, và chuỗi sự kiện CloudTrail sau khi lộ khoá.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Containers, Kubernetes, proxies and cloud logs</h2>
<p class="lead">Eight questions built on the real output of this chapter. For each one, ask: which of the three — the log, the events, or the exit status — actually answers it?</p>
<h3>Self-check before you start</h3>
<ul>
<li>I always write <code>2&gt;&amp;1</code> before piping <code>docker logs</code>.</li>
<li>I can tell an OOM 137 from a slow-shutdown 137.</li>
<li>I know why a Python container can print nothing.</li>
<li>I read <code>describe</code> + <code>logs -p</code> for a crash loop and <code>get events</code> for a pod that never started.</li>
<li>I read X-Forwarded-For from the right and trust it only from my proxies.</li>
<li>I can name the three kinds of cloud log and what each answers.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Container, Kubernetes, proxy và log cloud</h2>
<p class="lead">Tám câu dựa trên output thật của chương này. Với mỗi câu, tự hỏi: trong ba thứ — log, event, hay trạng thái thoát — cái nào thật sự trả lời được nó?</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi luôn viết <code>2&gt;&amp;1</code> trước khi đưa <code>docker logs</code> vào ống.</li>
<li>Tôi phân biệt được 137 do OOM với 137 do dừng chậm.</li>
<li>Tôi biết vì sao một container Python có thể chẳng in gì.</li>
<li>Tôi đọc <code>describe</code> + <code>logs -p</code> cho vòng lặp sập và <code>get events</code> cho pod chưa từng chạy.</li>
<li>Tôi đọc X-Forwarded-For từ bên phải và chỉ tin nó khi đến từ proxy của mình.</li>
<li>Tôi kể được ba loại log cloud và mỗi loại trả lời câu hỏi gì.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: '`docker logs api | grep -c WARN` prints 0, but you know the app wrote warnings with console.error. Why?|||`docker logs api | grep -c WARN` in ra 0, nhưng bạn biết ứng dụng có ghi cảnh báo bằng console.error. Vì sao?',
        options: [
          'docker logs only keeps the last 100 lines|||docker logs chỉ giữ 100 dòng cuối',
          'docker logs replays stderr to your stderr; the pipe carries only stdout — use 2>&1|||docker logs phát lại stderr vào stderr của bạn; ống chỉ chở stdout — dùng 2>&1',
          'The json-file driver drops stderr|||Driver json-file bỏ stderr',
          'grep cannot read UTF-8|||grep không đọc được UTF-8',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In 13.1, 2>/dev/null kept 11 stdout lines and 2>&1 >/dev/null kept exactly the 3 WARN lines. Both streams are stored; your shell splits them again.|||VI: Ở 13.1, 2>/dev/null giữ 11 dòng stdout và 2>&1 >/dev/null giữ đúng 3 dòng WARN. Cả hai luồng đều được lưu; chính shell của bạn tách chúng ra lần nữa.',
      },
      {
        question: 'A container ended with ExitCode=137, OOMKilled=false. docker events shows "kill 15" and, ten seconds later, "kill 9" and "die 137". What happened?|||Một container kết thúc với ExitCode=137, OOMKilled=false. docker events có "kill 15" và mười giây sau là "kill 9" và "die 137". Chuyện gì đã xảy ra?',
        options: [
          'It exceeded its memory limit|||Nó vượt hạn mức bộ nhớ',
          'It segfaulted|||Nó bị lỗi phân đoạn bộ nhớ (segfault)',
          'docker stop: PID 1 ignored SIGTERM, so Docker sent SIGKILL after the grace period|||docker stop: PID 1 lờ SIGTERM nên Docker gửi SIGKILL sau thời gian ân hạn',
          'The program called exit(137) on purpose|||Chương trình tự gọi exit(137)',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: lgz-stop (sleep as PID 1) took 10.2 s and ended 137 with OOMKilled=false; with --init it stopped in 0.1 s with 143. Memory 137 has OOMKilled=true and an oom event.|||VI: lgz-stop (sleep làm PID 1) mất 10,2 giây và kết thúc 137 với OOMKilled=false; có --init thì dừng trong 0,1 giây với 143. 137 do bộ nhớ thì có OOMKilled=true và sự kiện oom.',
      },
      {
        question: 'A Python worker in a container has been running for 3 seconds, prints a line every second, and docker logs shows nothing. Most likely cause?|||Một worker Python trong container đã chạy 3 giây, mỗi giây in một dòng, mà docker logs không có gì. Nguyên nhân khả dĩ nhất?',
        options: [
          'stdout is not a terminal, so Python buffers it; set PYTHONUNBUFFERED=1 or python -u|||stdout không phải terminal nên Python đệm nó; đặt PYTHONUNBUFFERED=1 hoặc python -u',
          'The log driver is none|||Log driver là none',
          'The container has no memory limit|||Container không có hạn mức bộ nhớ',
          'print() writes to stderr|||print() ghi ra stderr',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: lgz-dem printed 0 lines after 3 s, then all five lines with the same timestamp at exit; lgz-dem-u (PYTHONUNBUFFERED=1) produced one line per second. A none driver would give an error, not silence.|||VI: lgz-dem in 0 dòng sau 3 giây, rồi cả năm dòng cùng một mốc giờ lúc thoát; lgz-dem-u (PYTHONUNBUFFERED=1) cho mỗi giây một dòng. Driver none thì sẽ báo lỗi chứ không im lặng.',
      },
      {
        question: 'A pod restarts about once an hour. Right now it is Running and its log looks healthy. Which command shows why it died last time?|||Một pod khoảng mỗi giờ khởi động lại một lần. Lúc này nó đang Running và log trông bình thường. Lệnh nào cho thấy vì sao nó chết lần trước?',
        options: [
          'kubectl logs deploy/app|||kubectl logs deploy/app',
          'kubectl get pods -o wide|||kubectl get pods -o wide',
          'kubectl delete pod and read the new one|||kubectl delete pod rồi đọc pod mới',
          'kubectl logs <pod> --previous (plus describe for Last State)|||kubectl logs <pod> --previous (cộng describe để xem Last State)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: --previous reads the container instance before the current one; describe shows Last State (Reason, Exit Code). Deleting the pod destroys that evidence — 13.2 showed its log directory disappears.|||VI: --previous đọc bản container ngay trước bản hiện tại; describe hiện Last State (Reason, Exit Code). Xoá pod là huỷ bằng chứng đó — 13.2 đã cho thấy thư mục log của nó biến mất.',
      },
      {
        question: 'kubectl logs anh-sai returns "is waiting to start: trying and failing to pull image". Where is the reason?|||kubectl logs anh-sai trả về "is waiting to start: trying and failing to pull image". Lý do nằm ở đâu?',
        options: [
          'In kubectl logs --previous|||Trong kubectl logs --previous',
          'In /var/log/pods on the node|||Trong /var/log/pods trên node',
          'In the application log of another pod|||Trong log ứng dụng của một pod khác',
          'In the pod\'s events (kubectl get events / describe): Failed to pull image …|||Trong event của pod (kubectl get events / describe): Failed to pull image …',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The container never started, so there is no log of any run. The events said Failed to pull image "registry.invalid/lab13/web:1.0", ErrImagePull, then ImagePullBackOff — and events are kept only about an hour by default.|||VI: Container chưa từng chạy nên không có log của lần chạy nào. Event ghi Failed to pull image "registry.invalid/lab13/web:1.0", ErrImagePull, rồi ImagePullBackOff — mà event mặc định chỉ được giữ khoảng một giờ.',
      },
      {
        question: 'Your nginx receives "X-Forwarded-For: 203.0.113.7, 10.113.0.66" from your CDN edge at 10.113.0.5. Which address is the real client?|||nginx của bạn nhận "X-Forwarded-For: 203.0.113.7, 10.113.0.66" từ biên CDN ở 10.113.0.5. Địa chỉ nào là khách thật?',
        options: [
          '203.0.113.7, because the leftmost value is always the client|||203.0.113.7, vì giá trị trái nhất luôn là khách',
          '10.113.0.66 — the entry your own edge appended; the left part was typed by the client|||10.113.0.66 — phần tử do chính biên của bạn nối thêm; phần bên trái do khách tự gõ',
          '10.113.0.5, the TCP peer|||10.113.0.5, đầu TCP',
          'It cannot be known|||Không thể biết',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Read from the right and skip proxies you trust: the edge appended the address it received the connection from. In 13.3 the attacker at .66 sent the 203.0.113.7 part; trust proxy = true made Express believe it.|||VI: Đọc từ phải và bỏ qua các proxy bạn tin: biên đã nối thêm địa chỉ mà nó nhận kết nối từ đó. Ở 13.3, kẻ tấn công ở .66 đã gửi phần 203.0.113.7; trust proxy = true khiến Express tin nó.',
      },
      {
        question: 'Eight failed POST /login from one machine, each with a different X-Forwarded-For, all return 401 and none 429, although the limit is 5 per minute per IP. What do you check first?|||Tám lần POST /login hỏng từ một máy, mỗi lần một X-Forwarded-For khác nhau, đều trả 401 và không có 429, dù giới hạn là 5 lần mỗi phút mỗi IP. Bạn kiểm gì trước?',
        options: [
          'Whether the database is slow|||Cơ sở dữ liệu có chậm không',
          'Whether the users exist|||Các tài khoản đó có tồn tại không',
          'How the app derives the client IP (trust proxy / real_ip): it trusts a client-controlled header|||Ứng dụng lấy IP khách thế nào (trust proxy / real_ip): nó đang tin một header do khách điều khiển',
          'Whether HTTP/2 is enabled|||HTTP/2 có bật không',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Port 80 of the lab (trust proxy = true) gave 8 × 401 from 8 "IPs"; port 8080 gave five 401 then 429. express-rate-limit even logged "ValidationError: The Express \'trust proxy\' setting is true". Same flaw as CVE-2026-25552 and CVE-2025-59152.|||VI: Cổng 80 của lab (trust proxy = true) cho 8 × 401 từ 8 "IP"; cổng 8080 cho năm 401 rồi 429. express-rate-limit còn ghi log "ValidationError: The Express \'trust proxy\' setting is true". Cùng lỗi với CVE-2026-25552 và CVE-2025-59152.',
      },
      {
        question: 'In CloudTrail you see, from one access key and one IP within a minute: GetCallerIdentity, four IAM calls with AccessDenied, DescribeTrails, StopLogging. What is the best reading?|||Trong CloudTrail bạn thấy, từ một access key và một IP trong vòng một phút: GetCallerIdentity, bốn lời gọi IAM bị AccessDenied, DescribeTrails, StopLogging. Cách đọc đúng nhất?',
        options: [
          'A leaked key: whoami, permission probing, then blinding the audit log — treat as an incident and alert on StopLogging|||Khoá bị lộ: hỏi "tôi là ai", dò quyền, rồi bịt mắt log kiểm toán — coi là sự cố và cảnh báo trên StopLogging',
          'A normal CI deploy|||Một lần deploy CI bình thường',
          'A misconfigured CloudWatch retention|||Retention CloudWatch cấu hình sai',
          'AWS maintenance activity|||Hoạt động bảo trì của AWS',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: That is the 13.4 sample: 203.0.113.50 with the CI user\'s AKIA key, then DeleteFlowLogs and an attempted RunInstances of GPU machines. Disabling cloud logs is ATT&CK T1685.002 (formerly T1562.008).|||VI: Đó là mẫu ở 13.4: 203.0.113.50 dùng khoá AKIA của người dùng CI, sau đó DeleteFlowLogs và thử RunInstances máy GPU. Tắt log cloud là ATT&CK T1685.002 (trước là T1562.008).',
      },
    ],
  },
};
