/**
 * 13.2 — Kubernetes cơ bản cho việc đọc log (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s13/k8s'] — cụm k3s v1.33.5 một node ("lab13") chạy trong container lgz-k3s trên máy lab; manifest ./_demo/s13/k8s/.
 * kubectl = hàm trong _demo/s13/cong-cu/k8s-env.bash (docker exec vào lgz-k3s). Người học dùng kind/minikube/k3d — lệnh y hệt.
 * Chạy lại ⇒ tên pod (orders-fcbdf6758-…), UID, giờ đổi: soát số trong lời ("RESTARTS 3 sau 75 s", "COUNT 6", "4.log").
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '13.2 — Kubernetes basics for logs: kubectl logs -p/-c/-l, get events, describe, CrashLoopBackOff, OOMKilled|||13.2 — Kubernetes cơ bản cho việc đọc log: kubectl logs -p/-c/-l, get events, describe, CrashLoopBackOff, OOMKilled',
  slug: 'log-13-2-kubernetes',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Trên một cụm k3s thật: kubectl logs theo pod, deploy/, nhãn -l với --prefix, -c cho pod nhiều container, --previous để đọc lần chạy đã chết; describe đọc Last State (Error 1, OOMKilled 137, Completed 0); get events cho lỗi không có log (ImagePullBackOff, liveness probe); log thật nằm ở /var/log/pods trên node theo định dạng CRI, chỉ giữ lần chạy trước, mất khi xoá pod; events chỉ sống 1 giờ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Kubernetes: the same stdout, more places to look, and less time before it is gone</h2>
<p class="lead">Kubernetes runs the containers of lesson 13.1 on many machines, restarts them, moves them and deletes them. The log is still stdout/stderr, but now you need to find <em>which</em> pod, <em>which</em> container in it, and <em>which run</em> — and some failures leave no log at all, only <strong>events</strong>. Everything below ran on a real one-node k3s cluster (Kubernetes v1.33.5); with kind, minikube or k3d the commands are identical. Kubernetes itself (pods, deployments, services) is taught in the Kubernetes course.</p>

<h3>The everyday picture: the hospital ward</h3>
<p>A patient (container) lies in a bed (pod) in a ward (node). The patient's own diary is the log. The nurses' notebook at the desk — "08:10 patient fainted, 08:11 moved to bed 4, 08:15 doctor called" — is the events list; nurses tear out pages older than an hour. When the patient is discharged (pod deleted) the diary leaves with them. If you want the history later, someone must photocopy the diary while the patient is still there: cluster-level log collection.</p>

<h3>Step 1 — a healthy Deployment: logs by pod, by deployment, by label</h3>
${lenh('s13/k8s', 0)}
${lenh('s13/k8s', 1)}
${ma('yaml', 's13/k8s/orders.yaml')}
${lenh('s13/k8s', 2)}
${lenh('s13/k8s', 3)}
${lenh('s13/k8s', 4)}
${lenh('s13/k8s', 5)}
${lenh('s13/k8s', 6)}
${lenh('s13/k8s', 7)}
<ul>
<li><code>logs deploy/orders</code> is a shortcut that <strong>picks one pod</strong> ("Found 2 pods, using pod/…"). With two replicas you see half the story. Errors on the other replica are invisible.</li>
<li><code>-l app=orders --prefix</code> reads every pod matching the label and tags each line with <code>[pod/…/container]</code>. This is the everyday command. (By default <code>-l</code> follows at most 5 pods concurrently with <code>-f</code>; raise with <code>--max-log-requests</code>.)</li>
<li><code>--timestamps</code>, <code>--since 3s</code>, <code>--tail</code>: the same meanings as Docker's <code>-t</code>, <code>--since</code>, <code>--tail</code>. Note <code>-l</code> without <code>--tail</code> defaults to the last 10 lines per pod.</li>
<li>Always pass <code>-n &lt;namespace&gt;</code>. "No resources found" is usually the wrong namespace, not a missing pod.</li>
</ul>

<h3>Step 2 — four broken pods, and the status column</h3>
${ma('yaml', 's13/k8s/hong.yaml')}
${lenh('s13/k8s', 8)}
${lenh('s13/k8s', 9)}
<p>Seventy-five seconds later, three pods are in <strong>CrashLoopBackOff</strong> with 3 restarts and one is in <strong>ImagePullBackOff</strong> with 0. Learn to read this as two different worlds:</p>
<ul>
<li><strong>CrashLoopBackOff</strong> is not an error by itself. It means "the container started, then exited, again and again, so I wait longer before each restart" (10 s, 20 s, 40 s … capped at 5 minutes). The <em>reason</em> is in the log of the run that died and in <code>Last State</code>.</li>
<li><strong>ImagePullBackOff / ErrImagePull / CreateContainerConfigError / Pending</strong>: the container never started. There is <em>no log</em>. The reason is in events.</li>
</ul>

<h3>Step 3 — the run that died: --previous and Last State</h3>
${lenh('s13/k8s', 10)}
${lenh('s13/k8s', 11)}
${lenh('s13/k8s', 12)}
<p><code>kubectl logs</code> shows the <em>current</em> container instance; <code>--previous</code> (<code>-p</code>) shows the one before it. Here both show the same thing because every run dies identically — but on a pod that crashes once per hour, the current instance is the healthy new one and only <code>-p</code> shows why the old one died. <code>describe</code> is the inspect of Kubernetes: <code>State: Waiting (CrashLoopBackOff)</code> is now, <code>Last State: Terminated, Reason: Error, Exit Code: 1</code> is how the previous run ended.</p>
${lenh('s13/k8s', 13)}
${lenh('s13/k8s', 14)}
${lenh('s13/k8s', 21)}
<p>Memory: <code>Reason: OOMKilled, Exit Code: 137</code> — the 64Mi limit. The previous run's log stops at <code>held 48 MB</code> with no error message: the kernel does not let the process say goodbye. The JSON form (<code>-o jsonpath</code>) is what you script with.</p>
${lenh('s13/k8s', 19)}
${lenh('s13/k8s', 20)}
<div class="pitfall co-tieu-de"><p><strong>"Exit 0 but CrashLoopBackOff?"</strong> The <code>xong-viec</code> pod did its job, printed its report and exited 0 — <code>Reason: Completed</code>. A Pod's default <code>restartPolicy</code> is <code>Always</code> (and in a Deployment it can only be Always), so Kubernetes restarts it forever and backs off. One-off work belongs in a <strong>Job</strong> or CronJob. A long-running app that exits 0 lost its foreground process (a script that starts the server in the background, then ends).</p></div>

<h3>Step 4 — failures with no log: events</h3>
${lenh('s13/k8s', 15)}
${lenh('s13/k8s', 16)}
${lenh('s13/k8s', 17)}
${lenh('s13/k8s', 18)}
<ul>
<li><code>kubectl logs</code> on a pod whose container never started returns a BadRequest — the question has no answer. Go to events: <code>Failed to pull image "registry.invalid/lab13/web:1.0"</code> (wrong name/tag, private registry without credentials, rate limit).</li>
<li>Events are <strong>aggregated</strong>: one object with a <code>COUNT</code> (6 back-offs) instead of six lines. <code>--sort-by=.lastTimestamp</code> puts them in order; without it the order is not guaranteed.</li>
<li><code>--field-selector type=Warning</code> across the namespace is a good first command after "something is wrong in staging".</li>
<li><strong>Events live one hour</strong> by default (<code>kube-apiserver --event-ttl=1h</code>). The ticket that arrives the next morning finds nothing; that is why the logs/events must be shipped (Chapter 15) and why you paste them into the ticket the moment you see them.</li>
</ul>

<h3>Step 5 — pods with several containers, and probes</h3>
${ma('yaml', 's13/k8s/hai-container.yaml')}
${lenh('s13/k8s', 22)}
${lenh('s13/k8s', 23)}
${lenh('s13/k8s', 24)}
${lenh('s13/k8s', 25)}
<p>With two containers, <code>kubectl logs pod</code> picks the default one and says so on stderr (<em>Defaulted container "nginx" out of: nginx, goi-thu</em>). Sidecars (proxies like Envoy/Istio, log shippers, the app's helper) all live in the same pod: <code>-c name</code> for one, <code>--all-containers --prefix</code> for all. The nginx access log inside the pod shows the sidecar's requests from <code>127.0.0.1</code> — containers in a pod share one network namespace.</p>
${lenh('s13/k8s', 26)}
${lenh('s13/k8s', 27)}
${lenh('s13/k8s', 28)}
<p>The liveness probe calls <code>/healthz</code>, nginx answers 404, so after two failures the kubelet kills and restarts the container: events say <em>Unhealthy … statuscode: 404</em> and <em>Container api failed liveness probe, will be restarted</em>. The app's own log (<code>-p</code>) shows the probe requests — user agent <code>kube-probe/1.33</code>. Notice <code>LAST: Completed, EXIT 0</code>: nginx shut down cleanly on SIGTERM, so the exit code looks innocent. The restart count and the events tell the truth.</p>

<h3>Step 6 — where the log really is, and when it disappears</h3>
${lenh('s13/k8s', 29)}
${lenh('s13/k8s', 30)}
${lenh('s13/k8s', 31)}
${lenh('s13/k8s', 32)}
${lenh('s13/k8s', 33)}
<ul>
<li>On each node, the container runtime writes <code>/var/log/pods/&lt;namespace&gt;_&lt;pod&gt;_&lt;uid&gt;/&lt;container&gt;/&lt;restart&gt;.log</code>; <code>/var/log/containers/*.log</code> are symlinks with the names flattened. This is what log agents (Fluent Bit, Alloy, Filebeat) read.</li>
<li>CRI line format: <code>time stream tag message</code> — <code>stderr F FATAL…</code>. <code>F</code> = full line, <code>P</code> = partial (a long line split by the runtime, to be joined). This is different from Docker's json-file.</li>
<li>Only <code>4.log</code> is left: the kubelet keeps the current and the previous instance, not all of them. Rotation: <code>containerLogMaxSize</code> 10Mi × <code>containerLogMaxFiles</code> 5 by default.</li>
</ul>
${lenh('s13/k8s', 34)}
${lenh('s13/k8s', 35)}
<p>Delete the pod and the log is gone from the API immediately, and from the node a few seconds later (0 directories). Every <code>kubectl rollout restart</code>, every scale-down, every evicted pod does the same. That is the strongest argument in this course for central log collection.</p>

<h3>Hacker's corner: who may read pod logs</h3>
<p>In RBAC, reading logs is the subresource <code>pods/log</code> — a separate permission from <code>pods</code>. Teams often give developers <code>get pods/log</code> in production "just to debug", forgetting that the log may contain tokens and personal data (lesson 16.3). And <code>kubectl logs</code> goes through the kubelet's API on port 10250: a kubelet exposed without authentication lets anyone read logs and even run commands in pods. The same mistake one level up: in February 2018 RedLock researchers found Tesla's Kubernetes administration console reachable from the Internet without a password; intruders had read AWS credentials stored there and were mining cryptocurrency on Tesla's cloud, keeping CPU usage low to stay unnoticed. Check with <code>kubectl auth can-i get pods/log -n prod --as=someone</code> who can read what.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>OJT, staging is "down":</strong> <code>kubectl -n staging get pods</code> → find the odd status → <code>describe</code> (Last State, events at the bottom) → <code>logs -p</code>. Paste <em>describe</em> and <em>logs -p</em> output into the ticket immediately — in an hour the events are gone and after the next deploy the pod is gone.</li>
<li><strong>"Works on dev, OOMKilled on the customer's cluster":</strong> their LimitRange gives every container 256Mi by default. <code>kubectl describe pod</code> shows <code>Limits</code>; compare with the JVM/Node heap.</li>
<li><strong>Your access is read-only and there is no Grafana:</strong> <code>kubectl logs -l app=api --since 1h --prefix --timestamps | grep -v healthz &gt; ticket-123.log</code> and attach the file — sorted, labelled, and still readable after the pods are replaced.</li>
</ul>

<h3>🧪 Practice (25 min, needs kind/minikube/k3d)</h3>
<div class="callout ok"><ol>
<li>Apply <code>orders.yaml</code> and <code>hong.yaml</code> from <code>_demo/s13/k8s</code> (create namespace <code>lab13</code> and the configmap as in step 1).</li>
<li>For each broken pod, write one line: status, the command that showed the reason, the reason.</li>
<li>Scale <code>orders</code> to 3 and show the last line of every replica with pod names.</li>
<li>Delete one <code>orders</code> pod. Can you still read its log? What replaced it?</li>
</ol>
<p><strong>Done when:</strong> 2 reads — <code>orders-loi</code> CrashLoopBackOff, <code>logs -p</code>: missing DB_URL; <code>an-ram</code> CrashLoopBackOff, <code>describe</code>: OOMKilled 137 at 64Mi; <code>anh-sai</code> ImagePullBackOff, <code>get events</code>: image not found; <code>xong-viec</code> CrashLoopBackOff, <code>describe</code>: Completed 0 — should be a Job. 3 uses <code>logs -l app=orders --prefix --tail 1</code> with three pod names; 4: no — NotFound; a new pod with a new name, whose log starts from <em>started</em>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['kubectl logs -p', 'Log of the previous instance of the container (the run that died).'],
  ['-l … --prefix', 'Logs of all pods matching a label, each line tagged with pod/container.'],
  ['-c / --all-containers', 'Choose a container in a multi-container pod / take all of them.'],
  ['CrashLoopBackOff', 'Container keeps exiting; kubelet waits longer before each restart. Reason in logs -p and Last State.'],
  ['ImagePullBackOff', 'Image could not be pulled; container never started; reason only in events.'],
  ['events', 'Aggregated notes from the control plane (Scheduled, Pulled, BackOff, Unhealthy, Killing); kept 1 h by default.'],
  ['/var/log/pods', 'Where the runtime writes container logs on the node, CRI format; removed with the pod.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Use <code>-n</code>, then <code>-l app=… --prefix</code>, not <code>deploy/…</code>, when there are replicas.</li>
<li>Crash loop: <code>describe</code> (Last State) + <code>logs -p</code>. Never started: <code>get events</code>.</li>
<li>OOMKilled 137 leaves no error line; Completed 0 in a crash loop means the wrong workload type.</li>
<li>Probe kills look innocent in the exit code; restart count + events show them.</li>
<li>Logs live on the node, one previous run only, and die with the pod; events die after an hour. Ship both.</li>
</ul>
${nguon('📘', 'Kubernetes — Logging Architecture', 'kubectl logs --previous, /var/log/pods, containerLogMaxSize/MaxFiles, cluster-level logging', 'https://kubernetes.io/docs/concepts/cluster-administration/logging/')}
${nguon('🛡️', 'Infosecurity Magazine — Tesla falls to cryptojackers (RedLock, 2018)', 'Kubernetes console without a password exposed AWS credentials', 'https://www.infosecurity-magazine.com/news/tesla-falls-to-cryptojackers/')}
${nguon('📘', 'kube-apiserver reference', '--event-ttl (default 1h0m0s)', 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/')}
${lienKet({ khoa: 'kubernetes', bai: 'k8s-9-1-go-loi', title: 'Kubernetes 9.1 — Debugging Pending, CrashLoopBackOff, ImagePullBackOff', sub: 'Decision tree for the pod statuses', cta: 'Open lesson' })}
${lienKet({ khoa: 'kubernetes', bai: 'k8s-9-2-log-metrics', title: 'Kubernetes 9.2 — Logs and metrics', sub: 'Prometheus, Grafana in the cluster', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Kubernetes: vẫn là stdout, nhiều chỗ phải nhìn hơn, và ít thời gian hơn trước khi nó biến mất</h2>
<p class="lead">Kubernetes chạy các container của bài 13.1 trên nhiều máy, khởi động lại, di chuyển và xoá chúng. Log vẫn là stdout/stderr, nhưng giờ bạn phải tìm <em>pod nào</em>, <em>container nào</em> trong đó, và <em>lần chạy nào</em> — và có những lỗi không để lại log nào, chỉ có <strong>event</strong>. Mọi thứ dưới đây chạy trên một cụm k3s một node thật (Kubernetes v1.33.5); với kind, minikube hay k3d thì lệnh y hệt. Bản thân Kubernetes (pod, deployment, service) được dạy ở khoá Kubernetes.</p>

<h3>Liên tưởng đời thường: khu điều trị của bệnh viện</h3>
<p>Một bệnh nhân (container) nằm trên một giường (pod) trong một khu (node). Nhật ký riêng của bệnh nhân là log. Sổ của y tá ở bàn trực — "08:10 bệnh nhân ngất, 08:11 chuyển sang giường 4, 08:15 gọi bác sĩ" — là danh sách event; y tá xé bỏ những trang cũ hơn một giờ. Khi bệnh nhân xuất viện (pod bị xoá), nhật ký đi theo họ. Muốn xem lại lịch sử sau này thì phải có người photo nhật ký khi bệnh nhân còn nằm đó: gom log ở mức cụm.</p>

<h3>Bước 1 — một Deployment khoẻ: log theo pod, theo deployment, theo nhãn</h3>
${lenh('s13/k8s', 0)}
${lenh('s13/k8s', 1)}
${ma('yaml', 's13/k8s/orders.yaml')}
${lenh('s13/k8s', 2)}
${lenh('s13/k8s', 3)}
${lenh('s13/k8s', 4)}
${lenh('s13/k8s', 5)}
${lenh('s13/k8s', 6)}
${lenh('s13/k8s', 7)}
<ul>
<li><code>logs deploy/orders</code> là lối tắt <strong>chọn một pod</strong> ("Found 2 pods, using pod/…"). Có hai bản sao thì bạn chỉ thấy nửa câu chuyện. Lỗi ở bản sao kia là vô hình.</li>
<li><code>-l app=orders --prefix</code> đọc mọi pod khớp nhãn và gắn vào mỗi dòng <code>[pod/…/container]</code>. Đây là lệnh dùng hằng ngày. (Mặc định <code>-l</code> kèm <code>-f</code> theo dõi tối đa 5 pod cùng lúc; tăng bằng <code>--max-log-requests</code>.)</li>
<li><code>--timestamps</code>, <code>--since 3s</code>, <code>--tail</code>: cùng nghĩa với <code>-t</code>, <code>--since</code>, <code>--tail</code> của Docker. Lưu ý <code>-l</code> mà không có <code>--tail</code> thì mặc định chỉ lấy 10 dòng cuối mỗi pod.</li>
<li>Luôn truyền <code>-n &lt;namespace&gt;</code>. "No resources found" thường là sai namespace, không phải thiếu pod.</li>
</ul>

<h3>Bước 2 — bốn pod hỏng, và cột trạng thái</h3>
${ma('yaml', 's13/k8s/hong.yaml')}
${lenh('s13/k8s', 8)}
${lenh('s13/k8s', 9)}
<p>Bảy mươi lăm giây sau, ba pod ở <strong>CrashLoopBackOff</strong> với 3 lần khởi động lại và một pod ở <strong>ImagePullBackOff</strong> với 0. Hãy tập đọc chúng như hai thế giới khác nhau:</p>
<ul>
<li><strong>CrashLoopBackOff</strong> tự nó không phải lỗi. Nó nghĩa là "container đã chạy, rồi thoát, hết lần này tới lần khác, nên tôi chờ lâu hơn trước mỗi lần khởi động lại" (10 s, 20 s, 40 s … tối đa 5 phút). <em>Lý do</em> nằm trong log của lần chạy đã chết và trong <code>Last State</code>.</li>
<li><strong>ImagePullBackOff / ErrImagePull / CreateContainerConfigError / Pending</strong>: container chưa bao giờ chạy. <em>Không có log</em>. Lý do nằm trong event.</li>
</ul>

<h3>Bước 3 — lần chạy đã chết: --previous và Last State</h3>
${lenh('s13/k8s', 10)}
${lenh('s13/k8s', 11)}
${lenh('s13/k8s', 12)}
<p><code>kubectl logs</code> cho xem bản container <em>hiện tại</em>; <code>--previous</code> (<code>-p</code>) cho xem bản ngay trước đó. Ở đây cả hai như nhau vì lần nào cũng chết giống hệt — nhưng với một pod mỗi giờ sập một lần, bản hiện tại là bản mới đang khoẻ và chỉ <code>-p</code> mới cho thấy vì sao bản cũ chết. <code>describe</code> là inspect của Kubernetes: <code>State: Waiting (CrashLoopBackOff)</code> là hiện tại, <code>Last State: Terminated, Reason: Error, Exit Code: 1</code> là cách lần chạy trước kết thúc.</p>
${lenh('s13/k8s', 13)}
${lenh('s13/k8s', 14)}
${lenh('s13/k8s', 21)}
<p>Bộ nhớ: <code>Reason: OOMKilled, Exit Code: 137</code> — hạn mức 64Mi. Log của lần chạy trước dừng ở <code>held 48 MB</code> mà không có thông báo lỗi nào: nhân không cho tiến trình kịp chào tạm biệt. Dạng JSON (<code>-o jsonpath</code>) là thứ bạn dùng khi viết script.</p>
${lenh('s13/k8s', 19)}
${lenh('s13/k8s', 20)}
<div class="pitfall co-tieu-de"><p><strong>"Thoát 0 mà vẫn CrashLoopBackOff?"</strong> Pod <code>xong-viec</code> làm xong việc, in báo cáo rồi thoát 0 — <code>Reason: Completed</code>. <code>restartPolicy</code> mặc định của Pod là <code>Always</code> (trong Deployment thì chỉ được là Always), nên Kubernetes khởi động lại nó mãi và giãn dần thời gian chờ. Việc chạy một lần thuộc về <strong>Job</strong> hoặc CronJob. Còn một ứng dụng chạy dài mà thoát 0 là đã mất tiến trình tiền cảnh (script khởi động máy chủ ở chế độ nền rồi kết thúc).</p></div>

<h3>Bước 4 — lỗi không có log: event</h3>
${lenh('s13/k8s', 15)}
${lenh('s13/k8s', 16)}
${lenh('s13/k8s', 17)}
${lenh('s13/k8s', 18)}
<ul>
<li><code>kubectl logs</code> với pod mà container chưa từng chạy trả về BadRequest — câu hỏi không có câu trả lời. Sang event: <code>Failed to pull image "registry.invalid/lab13/web:1.0"</code> (sai tên/tag, registry riêng mà thiếu thông tin đăng nhập, bị giới hạn tốc độ).</li>
<li>Event được <strong>gộp</strong>: một đối tượng có <code>COUNT</code> (6 lần back-off) thay vì sáu dòng. <code>--sort-by=.lastTimestamp</code> xếp chúng theo thứ tự; không có nó thì thứ tự không được đảm bảo.</li>
<li><code>--field-selector type=Warning</code> trên cả namespace là lệnh đầu tiên tốt khi nghe "staging có gì đó hỏng".</li>
<li><strong>Event chỉ sống một giờ</strong> theo mặc định (<code>kube-apiserver --event-ttl=1h</code>). Ticket đến vào sáng hôm sau sẽ không tìm thấy gì; vì vậy log/event phải được gửi đi lưu (Chương 15) và bạn dán chúng vào ticket ngay khi nhìn thấy.</li>
</ul>

<h3>Bước 5 — pod nhiều container, và probe</h3>
${ma('yaml', 's13/k8s/hai-container.yaml')}
${lenh('s13/k8s', 22)}
${lenh('s13/k8s', 23)}
${lenh('s13/k8s', 24)}
${lenh('s13/k8s', 25)}
<p>Có hai container thì <code>kubectl logs pod</code> chọn container mặc định và báo ra stderr (<em>Defaulted container "nginx" out of: nginx, goi-thu</em>). Sidecar (proxy như Envoy/Istio, bộ gửi log, tiến trình phụ của ứng dụng) đều sống chung pod: <code>-c tên</code> cho một cái, <code>--all-containers --prefix</code> cho tất cả. Access log của nginx trong pod ghi các request của sidecar từ <code>127.0.0.1</code> — các container trong một pod dùng chung một không gian mạng.</p>
${lenh('s13/k8s', 26)}
${lenh('s13/k8s', 27)}
${lenh('s13/k8s', 28)}
<p>Liveness probe gọi <code>/healthz</code>, nginx trả 404, nên sau hai lần hỏng kubelet giết và khởi động lại container: event ghi <em>Unhealthy … statuscode: 404</em> và <em>Container api failed liveness probe, will be restarted</em>. Log riêng của ứng dụng (<code>-p</code>) cho thấy các request của probe — user agent <code>kube-probe/1.33</code>. Để ý <code>LAST: Completed, EXIT 0</code>: nginx tắt gọn gàng khi nhận SIGTERM, nên mã thoát trông vô tội. Số lần khởi động lại và event mới nói sự thật.</p>

<h3>Bước 6 — log thật ra nằm ở đâu, và khi nào nó biến mất</h3>
${lenh('s13/k8s', 29)}
${lenh('s13/k8s', 30)}
${lenh('s13/k8s', 31)}
${lenh('s13/k8s', 32)}
${lenh('s13/k8s', 33)}
<ul>
<li>Trên mỗi node, bộ chạy container ghi <code>/var/log/pods/&lt;namespace&gt;_&lt;pod&gt;_&lt;uid&gt;/&lt;container&gt;/&lt;lần-khởi-động&gt;.log</code>; <code>/var/log/containers/*.log</code> là liên kết tượng trưng với tên được làm phẳng. Đây là chỗ các tác tử log (Fluent Bit, Alloy, Filebeat) đọc.</li>
<li>Định dạng dòng CRI: <code>giờ luồng cờ thông-điệp</code> — <code>stderr F FATAL…</code>. <code>F</code> = dòng đầy đủ, <code>P</code> = một phần (dòng dài bị bộ chạy cắt, cần ghép lại). Khác với json-file của Docker.</li>
<li>Chỉ còn <code>4.log</code>: kubelet giữ bản hiện tại và bản trước, không giữ tất cả. Xoay vòng: mặc định <code>containerLogMaxSize</code> 10Mi × <code>containerLogMaxFiles</code> 5.</li>
</ul>
${lenh('s13/k8s', 34)}
${lenh('s13/k8s', 35)}
<p>Xoá pod là log biến khỏi API ngay lập tức, và khỏi node vài giây sau (0 thư mục). Mỗi lần <code>kubectl rollout restart</code>, mỗi lần giảm số bản sao, mỗi pod bị đuổi đều như vậy. Đó là lý lẽ mạnh nhất của khoá này cho việc gom log tập trung.</p>

<h3>Góc hacker: ai được đọc log của pod</h3>
<p>Trong RBAC, đọc log là tài nguyên con <code>pods/log</code> — một quyền tách riêng khỏi <code>pods</code>. Các đội hay cho lập trình viên quyền <code>get pods/log</code> trên production "chỉ để gỡ lỗi", quên rằng log có thể chứa token và dữ liệu cá nhân (bài 16.3). Và <code>kubectl logs</code> đi qua API của kubelet ở cổng 10250: kubelet để lộ mà không xác thực thì ai cũng đọc được log, thậm chí chạy lệnh trong pod. Cùng sai lầm đó ở tầng cao hơn: tháng 2/2018, nhóm nghiên cứu RedLock phát hiện bảng quản trị Kubernetes của Tesla truy cập được từ Internet mà không cần mật khẩu; kẻ xâm nhập đã đọc thông tin đăng nhập AWS lưu ở đó và đào tiền ảo trên cloud của Tesla, giữ mức CPU thấp để khỏi bị chú ý. Kiểm ai đọc được gì bằng <code>kubectl auth can-i get pods/log -n prod --as=ai-do</code>.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>OJT, staging "sập":</strong> <code>kubectl -n staging get pods</code> → tìm trạng thái lạ → <code>describe</code> (Last State, event ở cuối) → <code>logs -p</code>. Dán ngay output <em>describe</em> và <em>logs -p</em> vào ticket — một giờ nữa event mất, lần deploy sau pod mất.</li>
<li><strong>"Máy dev chạy được, lên cụm của khách thì OOMKilled":</strong> LimitRange của họ mặc định cho mỗi container 256Mi. <code>kubectl describe pod</code> hiện <code>Limits</code>; so với heap của JVM/Node.</li>
<li><strong>Bạn chỉ có quyền đọc và không có Grafana:</strong> <code>kubectl logs -l app=api --since 1h --prefix --timestamps | grep -v healthz &gt; ticket-123.log</code> rồi đính kèm tệp — đã có thứ tự, có nhãn, và vẫn đọc được sau khi pod bị thay.</li>
</ul>

<h3>🧪 Thực hành (25 phút, cần kind/minikube/k3d)</h3>
<div class="callout ok"><ol>
<li>Apply <code>orders.yaml</code> và <code>hong.yaml</code> trong <code>_demo/s13/k8s</code> (tạo namespace <code>lab13</code> và configmap như bước 1).</li>
<li>Với mỗi pod hỏng, viết một dòng: trạng thái, lệnh cho thấy lý do, lý do.</li>
<li>Tăng <code>orders</code> lên 3 bản sao và in dòng cuối của mọi bản sao kèm tên pod.</li>
<li>Xoá một pod <code>orders</code>. Còn đọc được log của nó không? Cái gì đã thay nó?</li>
</ol>
<p><strong>Đạt khi:</strong> câu 2 ghi — <code>orders-loi</code> CrashLoopBackOff, <code>logs -p</code>: thiếu DB_URL; <code>an-ram</code> CrashLoopBackOff, <code>describe</code>: OOMKilled 137 ở 64Mi; <code>anh-sai</code> ImagePullBackOff, <code>get events</code>: không tìm thấy ảnh; <code>xong-viec</code> CrashLoopBackOff, <code>describe</code>: Completed 0 — lẽ ra phải là Job. Câu 3 dùng <code>logs -l app=orders --prefix --tail 1</code> ra ba tên pod; câu 4: không — NotFound; một pod mới tên mới, log bắt đầu từ <em>started</em>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['kubectl logs -p', 'Log của bản container trước đó (lần chạy đã chết).'],
  ['-l … --prefix', 'Log của mọi pod khớp nhãn, mỗi dòng gắn pod/container.'],
  ['-c / --all-containers', 'Chọn một container trong pod nhiều container / lấy tất cả.'],
  ['CrashLoopBackOff', 'Container cứ thoát; kubelet chờ lâu dần trước mỗi lần khởi động lại. Lý do ở logs -p và Last State.'],
  ['ImagePullBackOff', 'Không kéo được ảnh; container chưa từng chạy; lý do chỉ có trong event.'],
  ['event', 'Ghi chú đã gộp của control plane (Scheduled, Pulled, BackOff, Unhealthy, Killing); mặc định giữ 1 giờ.'],
  ['/var/log/pods', 'Nơi bộ chạy ghi log container trên node, định dạng CRI; bị xoá cùng pod.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dùng <code>-n</code>, rồi <code>-l app=… --prefix</code>, đừng dùng <code>deploy/…</code> khi có nhiều bản sao.</li>
<li>Vòng lặp sập: <code>describe</code> (Last State) + <code>logs -p</code>. Chưa từng chạy: <code>get events</code>.</li>
<li>OOMKilled 137 không để lại dòng lỗi; Completed 0 trong vòng lặp sập nghĩa là chọn sai loại workload.</li>
<li>Bị probe giết thì mã thoát trông vô tội; số lần khởi động lại + event mới lộ ra.</li>
<li>Log nằm trên node, chỉ giữ một lần chạy trước, và chết cùng pod; event chết sau một giờ. Gửi cả hai đi lưu.</li>
</ul>
${nguon('📘', 'Kubernetes — Logging Architecture', 'kubectl logs --previous, /var/log/pods, containerLogMaxSize/MaxFiles, gom log mức cụm', 'https://kubernetes.io/docs/concepts/cluster-administration/logging/')}
${nguon('🛡️', 'Infosecurity Magazine — Tesla bị chiếm cloud để đào tiền ảo (RedLock, 2018)', 'Bảng quản trị Kubernetes không mật khẩu làm lộ thông tin đăng nhập AWS', 'https://www.infosecurity-magazine.com/news/tesla-falls-to-cryptojackers/')}
${nguon('📘', 'Tham chiếu kube-apiserver', '--event-ttl (mặc định 1h0m0s)', 'https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/')}
${lienKet({ khoa: 'kubernetes', bai: 'k8s-9-1-go-loi', title: 'Kubernetes 9.1 — Gỡ lỗi Pending, CrashLoopBackOff, ImagePullBackOff', sub: 'Cây quyết định cho các trạng thái pod', cta: 'Mở bài' })}
${lienKet({ khoa: 'kubernetes', bai: 'k8s-9-2-log-metrics', title: 'Kubernetes 9.2 — Log và chỉ số', sub: 'Prometheus, Grafana trong cụm', cta: 'Mở bài' })}
</div>
`,
};
